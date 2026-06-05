// Copia idempotente dei file dati statici dentro public/data/.
// Eseguito come `prebuild` dal package.json. Idempotente: ricopia ogni volta.
//
// Pattern del kit: NON committiamo public/data/ (gitignored). Il prebuild
// pesca i dati dal repo del progetto. I path sono parametrizzati via
// variabili d'ambiente per portabilità fra progetti.
//
// Variabili d'ambiente (con default sensati):
//   REPO_ROOT             radice del progetto (default: ../ rispetto a web/)
//   CATALOG_INDEX_PATH    path JSON indice catalogo
//                         (default: REPO_ROOT/catalogo_index/data/entities.json)
//   STORIE_DASHBOARD_PATH path JSON dashboard storie (opzionale)
//                         (default: REPO_ROOT/catalogo_index/data/storie.json)

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(process.env.REPO_ROOT || resolve(WEB_ROOT, ".."));

// Path delle sorgenti, parametrizzabili
const CATALOG_INDEX_PATH =
  process.env.CATALOG_INDEX_PATH ||
  resolve(REPO_ROOT, "catalogo_index/data/entities.json");

const STORIE_DASHBOARD_PATH =
  process.env.STORIE_DASHBOARD_PATH ||
  resolve(REPO_ROOT, "catalogo_index/data/storie.json");

const FILES = [
  {
    from: CATALOG_INDEX_PATH,
    to: resolve(WEB_ROOT, "public/data/entities.json"),
    required: true,
    note: "Indice catalogo (output di _scripts/build_catalog_index.py)",
  },
  {
    from: STORIE_DASHBOARD_PATH,
    to: resolve(WEB_ROOT, "public/data/storie-dashboard.json"),
    required: false,
    note: "Dashboard storie (opzionale, alimenta route /storie)",
  },
];

let failed = false;
for (const { from, to, required, note } of FILES) {
  if (!existsSync(from)) {
    const msg = `[copy-data] sorgente non trovato: ${from} (${note})`;
    if (required) {
      console.error(msg);
      failed = true;
    } else {
      console.warn(msg + " (skip — opzionale)");
    }
    continue;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  const size = statSync(to).size;
  const rel = to.replace(WEB_ROOT + "/", "");
  console.log(`[copy-data] ${rel} (${(size / 1024).toFixed(1)} KB) ← ${note}`);
}

if (failed) process.exit(1);
