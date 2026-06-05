// Prebuild: estrae il modello dati per l'atlante (vista Orchestra) dal
// grafo canonico del progetto e produce `web/public/data/orchestra.json`.
//
// Pattern del kit: GENERICO. Il grafo del progetto vive in un path
// configurabile via env. Il modello dati orchestra usa "soft fields":
// campi opzionali che esistono se il progetto li ha (es. ciclo, stagione,
// vento, qualunque dimensione tematica progetto-specifica), altrimenti
// vengono lasciati a null. La UI orchestra gestisce graziosamente l'assenza.
//
// Variabili d'ambiente:
//   REPO_ROOT             radice del progetto (default: ../ rispetto a web/)
//   GRAPH_PATH            path JSON grafo canonico
//                         (default: REPO_ROOT/story_graph.json)
//
// Idempotente. ESM. Tollera errori per singolo elemento (warn + skip).
//
// Schema output (vedi web/lib/types-orchestra.ts):
//   {
//     generated_at: ISO,
//     graph_version, schema_version,
//     stories:    OrchestraStory[]      // unità narrative del progetto
//     characters: OrchestraCharacter[]  // entità grafo + appearances calcolate
//     locations:  OrchestraLocation[]   // entità grafo + appearances calcolate
//     seeds:      OrchestraSeed[]       // narrative_promises del progetto
//   }
//
// **Punti di specializzazione progetto** (cerca i `// PROJECT:` in basso):
//   - mapLocationType: mappa `entity.type` → tipo visuale; default minimal
//   - normalizeBlock / normalizeWind / normalizeFear: campi opzionali del
//     livello unità del progetto (lascia commentati se il progetto non li ha)
//   - sid pattern: regex per riconoscere quali unit_id sono "unità narrative"
//     (default: tutti). Personalizza se il progetto ha id particolari.

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(process.env.REPO_ROOT || resolve(WEB_ROOT, ".."));
const GRAPH_PATH =
  process.env.GRAPH_PATH || resolve(REPO_ROOT, "story_graph.json");
const OUT_DIR = resolve(WEB_ROOT, "public/data");
const OUT_FILE = resolve(OUT_DIR, "orchestra.json");

// === Helpers generici ===

function humanizeId(id) {
  if (typeof id !== "string" || !id) return "";
  return id
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(" ");
}

function pickName(meta, id) {
  if (!meta || typeof meta !== "object") return humanizeId(id);
  const candidates = [
    meta.name,
    meta.displayName,
    meta.display_name,
    meta.nome,
    meta.label,
    meta.title,
    meta.title_provvisorio,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return humanizeId(id);
}

function asStringList(v) {
  if (!v) return [];
  if (Array.isArray(v))
    return v
      .map((x) => {
        if (typeof x === "string") return x;
        if (x && typeof x === "object" && typeof x.id === "string") return x.id;
        return null;
      })
      .filter((x) => typeof x === "string" && x.length > 0);
  if (typeof v === "string") return [v];
  return [];
}

function characterIdFromEntry(entry) {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object" && typeof entry.id === "string")
    return entry.id;
  return null;
}

function locationIdFromPrimary(lp) {
  if (typeof lp === "string") return lp;
  if (lp && typeof lp === "object" && typeof lp.id === "string") return lp.id;
  return null;
}

// === Specializzazioni progetto (PROJECT:) ===

// PROJECT: mappa il `type` dell'entità luogo a un tipo visuale categorico
// per la UI atlante. Il default è minimal — il progetto può estenderlo
// con la propria tassonomia.
function mapLocationType(meta) {
  if (!meta || typeof meta !== "object") return "default";
  const t = String(meta.type || "").toLowerCase();
  // Pattern minimal del kit: solo distinzione interno/esterno, default neutro.
  // Estendi con regex specifiche al tuo progetto.
  if (/(esterno|outdoor|external)/.test(t)) return "esterno";
  if (/(interno|indoor|internal)/.test(t)) return "interno";
  return "default";
}

// PROJECT: campo "block_position" esiste solo se il progetto struttura
// le unità in blocchi (apertura/centro/chiusura, oppure prologo/atto/epilogo,
// ecc.). Se il progetto non ha questa dimensione, ritorna sempre null.
function normalizeBlock(bp) {
  if (typeof bp !== "string") return null;
  // Pattern flessibile: estrae il primo segmento snake_case
  const m = /^([a-z]+)/.exec(bp);
  return m ? m[1] : null;
}

// PROJECT: campo "wind" / "season" / "atmosphere_dominant" — uno per
// progetto, dipende dalla cosmologia. Lascialo a null se non applicabile.
function normalizeAtmosphereDimension(field) {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object" && typeof field.id === "string") return field.id;
  return null;
}

// PROJECT: campo "fear" / "growth" / "arc_marker" — pattern progetto-specifico
// per tracciare archi personaggi a livello unità. Default: passa attraverso
// se è un dict, altrimenti null.
function normalizeUnitArcMarker(f) {
  if (!f || typeof f !== "object") return null;
  const out = {};
  for (const [k, v] of Object.entries(f)) {
    out[k] = typeof v === "string" ? v : null;
  }
  return Object.keys(out).length > 0 ? out : null;
}

// === Build ===

function build() {
  if (!existsSync(GRAPH_PATH)) {
    console.error(`[build-orchestra] grafo non trovato: ${GRAPH_PATH}`);
    console.error(
      `  Imposta GRAPH_PATH oppure crea il grafo in ${GRAPH_PATH}`,
    );
    process.exit(1);
  }

  let g;
  try {
    g = JSON.parse(readFileSync(GRAPH_PATH, "utf-8"));
  } catch (err) {
    console.error(`[build-orchestra] errore parsing grafo: ${err.message}`);
    process.exit(1);
  }

  const graphVersion = g.graph_version || null;
  const schemaVersion = g.schema_version || null;

  // Il kit usa `g.units` per le unità narrative (storie, capitoli,
  // episodi, ecc.). Compatibilità con nomenclatura alternativa `g.stories`.
  const unitsRaw = g.units || g.stories || {};

  const charactersMeta = (g.entities && g.entities.characters) || {};
  const locationsMeta = (g.entities && g.entities.locations) || {};

  // Seeds: il kit usa `g.global_relations.narrative_promises`.
  // Compatibilità con nomenclatura alternativa `g.seeds` top-level.
  const seedsRaw =
    (g.global_relations && g.global_relations.narrative_promises) ||
    g.seeds ||
    {};

  // === Stories (= unità narrative) ===
  // PROJECT: il kit non assume una pattern di id; ordina lessicograficamente
  // tutti gli id di units. Personalizza se il progetto ha pattern specifici.
  const sids = Object.keys(unitsRaw)
    .filter((k) => !k.startsWith("_"))
    .sort();
  const stories = [];
  for (const sid of sids) {
    const s = unitsRaw[sid];
    if (!s || typeof s !== "object") {
      console.warn(`[build-orchestra] ${sid}: invalida, skip`);
      continue;
    }
    try {
      // Cast: campo "cast_in_scene" del kit. Compat: "characters_in_scene".
      const castRaw = s.cast_in_scene || s.characters_in_scene || [];
      const charIds = (Array.isArray(castRaw) ? castRaw : [])
        .map(characterIdFromEntry)
        .filter((x) => typeof x === "string" && x.length > 0);

      // Location: campo "primary_location_id" del kit. Compat: "location_primary".
      const locId = locationIdFromPrimary(
        s.primary_location_id || s.location_primary,
      );

      const seedsPlanted = asStringList(s.seeds_planted);
      const seedsBloomed = asStringList(
        s.seeds_blooming || s.seeds_bloomed_here,
      );
      const debtsOpened = asStringList(s.debts_opened);
      const debtsClosed = asStringList(s.debts_closed);
      const callbacks = asStringList(s.callbacks_in || s.callbacks_made);

      stories.push({
        sid,
        title:
          typeof s.title === "string"
            ? s.title
            : typeof s.title_provvisorio === "string"
              ? s.title_provvisorio
              : sid,
        // Soft fields: progetto-specifici, null se assenti
        season:
          normalizeAtmosphereDimension(s.season) ||
          (typeof s.season === "string" ? s.season : null),
        cycle: typeof s.cycle === "string" ? s.cycle : null,
        block: normalizeBlock(s.block_position || s.block),
        wind: normalizeAtmosphereDimension(s.wind_active || s.wind),
        premise: typeof s.premise === "string" ? s.premise : null,
        // PROJECT: rinomina in `arc_marker` per genericità
        fear: normalizeUnitArcMarker(s.fear_touched || s.arc_marker),
        location_id: locId,
        character_ids: charIds,
        seeds_planted_ids: seedsPlanted,
        seeds_bloomed_ids: seedsBloomed,
        seeds_planted_count: seedsPlanted.length,
        seeds_bloomed_count: seedsBloomed.length,
        debts_opened_count: debtsOpened.length,
        debts_closed_count: debtsClosed.length,
        callbacks_count: callbacks.length,
      });
    } catch (err) {
      console.warn(
        `[build-orchestra] ${sid}: errore (${err.message}), skip`,
      );
    }
  }

  // === Characters ===
  const allCharIds = new Set(Object.keys(charactersMeta));
  for (const s of stories)
    for (const cid of s.character_ids) allCharIds.add(cid);
  const characters = [];
  for (const cid of Array.from(allCharIds).sort()) {
    if (cid.startsWith("_")) continue;
    const meta = charactersMeta[cid] || {};
    const appearances = stories
      .filter((s) => s.character_ids.includes(cid))
      .map((s) => s.sid);
    characters.push({
      id: cid,
      name: pickName(meta, cid),
      role: meta.role_saga || meta.role || meta.type || null,
      species: meta.species || null,
      age_band: meta.age_band || null,
      appearances,
    });
  }

  // === Locations ===
  const allLocIds = new Set(Object.keys(locationsMeta));
  for (const s of stories) if (s.location_id) allLocIds.add(s.location_id);
  const locations = [];
  for (const lid of Array.from(allLocIds).sort()) {
    if (lid.startsWith("_")) continue;
    const meta = locationsMeta[lid] || {};
    const appearances = stories
      .filter((s) => s.location_id === lid)
      .map((s) => s.sid);
    locations.push({
      id: lid,
      name: pickName(meta, lid),
      type: mapLocationType(meta),
      raw_type: typeof meta.type === "string" ? meta.type : null,
      quadrant: typeof meta.quadrant === "string" ? meta.quadrant : null,
      role_saga: typeof meta.role_saga === "string" ? meta.role_saga : null,
      appearances,
    });
  }

  // === Seeds (narrative promises) ===
  const seeds = [];
  let multiBloom = 0,
    singleBloom = 0,
    zeroBloom = 0;
  const seedEntries = Array.isArray(seedsRaw)
    ? seedsRaw.map((s) => [
        s && typeof s.seed_id === "string"
          ? s.seed_id
          : s && typeof s.id === "string"
            ? s.id
            : null,
        s,
      ])
    : Object.entries(seedsRaw);

  for (const [sidKey, s] of seedEntries) {
    if (!s || typeof s !== "object") continue;
    const id =
      (typeof s.seed_id === "string" && s.seed_id) ||
      (typeof s.id === "string" && s.id) ||
      sidKey;
    if (!id) continue;
    const planted =
      typeof s.origin_story === "string"
        ? s.origin_story
        : typeof s.planted_in === "string"
          ? s.planted_in
          : null;
    let blooms =
      s.bloom_target_stories || s.blooms_in || s.bloom_targets || [];
    if (typeof blooms === "string") blooms = [blooms];
    if (!Array.isArray(blooms)) blooms = [];
    blooms = blooms.filter((x) => typeof x === "string" && x.length > 0);
    if (blooms.length === 0) zeroBloom += 1;
    else if (blooms.length === 1) singleBloom += 1;
    else multiBloom += 1;
    seeds.push({
      id,
      description: typeof s.description === "string" ? s.description : null,
      planted,
      bloom_targets: blooms,
      type: typeof s.type === "string" ? s.type : null,
      bloom_type: typeof s.bloom_type === "string" ? s.bloom_type : null,
      status: typeof s.status === "string" ? s.status : null,
    });
  }
  seeds.sort((a, b) => {
    const pa = a.planted || "zzz";
    const pb = b.planted || "zzz";
    if (pa !== pb) return pa.localeCompare(pb);
    return a.id.localeCompare(b.id);
  });

  const out = {
    generated_at: new Date().toISOString(),
    graph_version: graphVersion,
    schema_version: schemaVersion,
    stories,
    characters,
    locations,
    seeds,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf-8");

  const sizeKb = (Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(1);
  console.log(
    `[build-orchestra] ${stories.length} unità, ${characters.length} pers, ${locations.length} luoghi, ${seeds.length} semi (multi=${multiBloom}, single=${singleBloom}, zero=${zeroBloom}) → public/data/orchestra.json (${sizeKb} KB)`,
  );

  if (stories.length === 0) {
    console.warn(
      `[build-orchestra] WARNING: 0 unità trovate. Verifica che ${GRAPH_PATH} abbia 'units' o 'stories' popolati.`,
    );
  }
}

build();
