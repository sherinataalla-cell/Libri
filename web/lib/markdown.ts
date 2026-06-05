// Helpers markdown.
//
// Scelta: `marked` v14, GFM-friendly. Motivazioni:
//   - già lo standard del viewer vanilla precedente → output consistente con
//     l'utente atteso;
//   - parser sincrono → posso splittare server-side in sezioni `##` senza
//     async chains;
//   - bundle leggero e zero dipendenze runtime React (le sezioni le
//     rendiamo come HTML statico in un client wrapper Collapsible).
//
// `react-markdown` sarebbe stato altrettanto valido, ma costa più dipendenze
// (mdast/hast/unified) e non porta benefici tangibili in questo step (no
// custom renderers richiesti).

import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export interface MarkdownSection {
  /** Anchor slug, derivato dal titolo. */
  id: string;
  /** Titolo nudo (senza il `## `). */
  title: string;
  /** HTML del corpo della sezione (senza l'header `<h2>`). */
  bodyHtml: string;
}

export interface ParsedBody {
  /** HTML del preambolo prima del primo `##` (es. `# H1` + intro). */
  preambleHtml: string;
  /** Sezioni `##` in ordine. */
  sections: MarkdownSection[];
}

/**
 * Splitta il body markdown sui titoli `##` e renderizza ciascuna parte in HTML.
 * I titoli `#` (H1) e i sotto-titoli `###` restano nel preambolo o nella
 * sezione corrente (non vengono usati come delimitatori).
 *
 * Idempotente, sincrono.
 */
export function parseBody(md: string): ParsedBody {
  if (!md || !md.trim()) {
    return { preambleHtml: "", sections: [] };
  }

  const lines = md.split(/\r?\n/);
  const sections: { title: string; lines: string[] }[] = [];
  const preambleLines: string[] = [];
  let current: { title: string; lines: string[] } | null = null;
  const headerRe = /^##\s+(.+?)\s*$/;

  for (const line of lines) {
    const m = headerRe.exec(line);
    if (m) {
      if (current) sections.push(current);
      current = { title: m[1], lines: [] };
    } else {
      if (current) current.lines.push(line);
      else preambleLines.push(line);
    }
  }
  if (current) sections.push(current);

  const preambleHtml = renderInlineHtml(preambleLines.join("\n"));
  const usedSlugs = new Set<string>();
  const out: MarkdownSection[] = sections.map((s) => {
    const slug = uniqueSlug(slugify(s.title), usedSlugs);
    return {
      id: slug,
      title: s.title,
      bodyHtml: renderInlineHtml(s.lines.join("\n")),
    };
  });

  return { preambleHtml, sections: out };
}

/** Render markdown → HTML (sincrono). */
export function renderInlineHtml(md: string): string {
  if (!md.trim()) return "";
  // marked.parse è async-by-default in v14; usiamo `parse` con `async:false` o
  // lo invochiamo come marked.parse (che ritorna stringa quando non si usa
  // `async:true`).
  const out = marked.parse(md, { async: false });
  return typeof out === "string" ? out : "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function uniqueSlug(base: string, used: Set<string>): string {
  if (!base) base = "section";
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  const slug = `${base}-${n}`;
  used.add(slug);
  return slug;
}
