// Prebuild: estrae i testi finali delle unità narrative del progetto
// (file Markdown con frontmatter + marker @hook / @subhook / @page_book)
// e produce public/data/storie.json per il viewer Next.
//
// Pattern marker del kit (vedi _starter_kit/_convenzioni/marker_machine_readable.md):
//   <!-- @hook <id-unità>_h<NN> | @page <N> | @subhooks [...] | @image TBD -->
//   <!-- @subhook <id-unità>_h<NN><x> | @page_book <K> | @image TBD -->
//   (opz. @layout double_spread tra @page_book e @image, o all'estremità)
//
// Idempotente. ESM. Tollera errori sui singoli file (warn + skip), non blocca
// il build complessivo.
//
// Variabili d'ambiente:
//   REPO_ROOT          radice del progetto (default: ../ rispetto a web/)
//   TESTI_FINALI_DIR   path dei testi finali
//                      (default: REPO_ROOT/testi_finali)
//   STORY_FILE_PATTERN regex per identificare i file di unità
//                      (default: ^.+\.md$ — tutti i Markdown della cartella)
//
// Output:
//   public/data/storie.json:
//   {
//     generated_at: ISO,
//     stories: [{
//       sid, title, slug, frontmatter, totalPages, hooks, pages
//     }]
//   }

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(process.env.REPO_ROOT || resolve(WEB_ROOT, ".."));
const STORIE_DIR = resolve(
  process.env.TESTI_FINALI_DIR || resolve(REPO_ROOT, "testi_finali"),
);
const OUT_DIR = resolve(WEB_ROOT, "public/data");
const OUT_FILE = resolve(OUT_DIR, "storie.json");

// PROJECT: regex per riconoscere i file di unità narrativa.
// Default permissivo: tutti i .md della cartella (esclusi quelli con _ iniziale).
// Se il progetto ha un pattern di id specifico (es. ^s\d{2}_ per "s01..s12"),
// imposta STORY_FILE_PATTERN nell'env.
const STORY_FILE_RE = new RegExp(
  process.env.STORY_FILE_PATTERN || "^[^_].+\\.md$",
);

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// Hook header marker — riconosce sia 1+ subhook che `[]` vuoto.
const HOOK_RE =
  /<!--\s*@hook\s+(\S+)\s*\|\s*@page\s+(\d+)\s*\|\s*@subhooks\s*\[(.*?)\]\s*\|\s*@image\s+(\S+?)\s*-->/g;

// Subhook marker — `@layout` opzionale, può apparire dopo `@page_book` o
// dopo `@image`. Tolleriamo entrambi gli ordini.
const SUBHOOK_RE =
  /<!--\s*@subhook\s+(\S+)\s*\|\s*@page_book\s+(\S+?)\s*(?:\|\s*@layout\s+(\S+?)\s*)?\|\s*@image\s+(\S+?)\s*(?:\|\s*@layout\s+(\S+?)\s*)?-->/g;

// Titolo H1: pattern flessibile "# <Titolo>" oppure "# <SID> — <Titolo>"
const H1_RE = /^#\s+(?:\S+\s*[—–-]+\s*)?(.+?)\s*$/m;

function parseFrontmatter(raw) {
  const m = FRONTMATTER_RE.exec(raw);
  if (!m) return { fm: {}, body: raw, fmEnd: 0 };
  let fm = {};
  try {
    const parsed = yaml.load(m[1]);
    fm = parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.warn(`[build-storie] frontmatter YAML invalido: ${err.message}`);
    fm = {};
  }
  return { fm, body: raw.slice(m[0].length), fmEnd: m[0].length };
}

function findHookHeaders(body) {
  HOOK_RE.lastIndex = 0;
  const hooks = [];
  let m;
  while ((m = HOOK_RE.exec(body)) !== null) {
    const subhooksRaw = (m[3] || "").trim();
    const subhookIds = subhooksRaw
      ? subhooksRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    hooks.push({
      id: m[1],
      page: Number(m[2]),
      subhookIds,
      image: m[4] === "TBD" ? null : m[4],
      headerStart: m.index,
      headerEnd: m.index + m[0].length,
    });
  }
  return hooks;
}

function findSubhooks(segment) {
  SUBHOOK_RE.lastIndex = 0;
  const subs = [];
  let m;
  while ((m = SUBHOOK_RE.exec(segment)) !== null) {
    const layout = m[3] || m[5] || null;
    const imageRaw = m[4];
    const pageBookRaw = m[2];
    let pageBook;
    if (pageBookRaw.startsWith("[") && pageBookRaw.endsWith("]")) {
      // forma [N, N+1] (spread doppia non standard, ma documentata)
      pageBook = pageBookRaw;
    } else {
      const n = Number(pageBookRaw);
      pageBook = Number.isFinite(n) ? n : pageBookRaw;
    }
    subs.push({
      id: m[1],
      pageBook,
      layout: layout && layout !== "TBD" ? layout : null,
      imagePath: imageRaw === "TBD" ? null : imageRaw,
      markerStart: m.index,
      markerEnd: m.index + m[0].length,
    });
  }
  return subs;
}

/**
 * Estrae il testo prosa del subhook: dal marker subhook fino al prossimo
 * marker (subhook o hook) o al separatore `---` di fine pagina.
 */
function extractSubhookProse(segment, subIndex, subs, segEnd) {
  const sub = subs[subIndex];
  const start = sub.markerEnd;
  const end =
    subIndex + 1 < subs.length ? subs[subIndex + 1].markerStart : segEnd;
  const slice = segment.slice(start, end);
  // Pulisci eventuali `---` di chiusura pagina e spazi laterali.
  return slice.replace(/^[\r\n]+/, "").replace(/[\r\n]*-{3,}\s*$/, "").trimEnd();
}

function parseStoria(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const { fm, body } = parseFrontmatter(raw);

  const sid = String(fm.sid || "").trim();
  const slug = String(fm.slug || "").trim();
  const title = String(fm.title || "").trim() || (() => {
    const m = H1_RE.exec(body);
    return m ? m[1].trim() : sid || "(senza titolo)";
  })();

  const totalPages =
    typeof fm.book_pages_total === "number"
      ? fm.book_pages_total
      : typeof fm.total_pages === "number"
        ? fm.total_pages
        : 10;

  const hookHeaders = findHookHeaders(body);
  const hooks = [];
  const pages = [];

  for (let i = 0; i < hookHeaders.length; i++) {
    const h = hookHeaders[i];
    const segStart = h.headerEnd;
    const segEnd =
      i + 1 < hookHeaders.length ? hookHeaders[i + 1].headerStart : body.length;
    const segment = body.slice(segStart, segEnd);

    hooks.push({
      id: h.id,
      page: h.page,
      subhookIds: h.subhookIds,
    });

    const subs = findSubhooks(segment);
    if (subs.length === 0) {
      // Hook senza subhook: trattalo come una singola pagina libro = numero hook.
      // Il testo prosa è tutto il segmento (puliti i `---`).
      const prosaMd = segment
        .replace(/^[\r\n]+/, "")
        .replace(/[\r\n]*-{3,}\s*$/, "")
        .trimEnd();
      pages.push({
        subhookId: null,
        hookId: h.id,
        pageBook: h.page,
        layout: null,
        imagePath: null,
        prosaMd,
      });
    } else {
      for (let s = 0; s < subs.length; s++) {
        const sub = subs[s];
        const prosaMd = extractSubhookProse(segment, s, subs, segment.length);
        pages.push({
          subhookId: sub.id,
          hookId: h.id,
          pageBook: sub.pageBook,
          layout: sub.layout,
          imagePath: sub.imagePath,
          prosaMd,
        });
      }
    }
  }

  return {
    sid,
    title,
    slug,
    frontmatter: fm,
    totalPages,
    hooks,
    pages,
  };
}

function main() {
  if (!existsSync(STORIE_DIR)) {
    console.error(`[build-storie] dir non trovata: ${STORIE_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(STORIE_DIR)
    .filter((f) => STORY_FILE_RE.test(f) && !f.startsWith("_"))
    .sort();

  const stories = [];
  let totalPagesAll = 0;
  for (const f of files) {
    const full = join(STORIE_DIR, f);
    try {
      const story = parseStoria(full);
      if (!story.sid) {
        console.warn(`[build-storie] ${f}: sid mancante, skip`);
        continue;
      }
      stories.push(story);
      totalPagesAll += story.pages.length;
    } catch (err) {
      console.warn(`[build-storie] errore parsing ${f}: ${err.message}`);
    }
  }

  // Ordina per sid (s01..s12).
  stories.sort((a, b) => a.sid.localeCompare(b.sid));

  mkdirSync(OUT_DIR, { recursive: true });
  const out = {
    generated_at: new Date().toISOString(),
    stories,
  };
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf-8");

  const sizeKb = (Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(1);
  console.log(
    `[build-storie] ${stories.length}/${files.length} storie, ${totalPagesAll} pagine totali → public/data/storie.json (${sizeKb} KB)`,
  );
}

main();
