# `web/` — Cruscotto editoriale (template)

App **Next.js 15** (App Router) + **TypeScript strict** + **Tailwind CSS 3.4** + **shadcn/ui** + **Lucide Icons**. È il **template** del cruscotto editoriale: il progetto adottante lo copia, lo configura, lo deploya.

---

## Cosa è

Quattro sezioni operative:

1. **`/catalogo`** — vista navigabile delle schede entità (personaggi, luoghi, oggetti). Tree gerarchico, gallerie con lightbox, body editoriale collassabile, prompt di generazione asset dove disponibili.
2. **`/storie`** — vista delle unità narrative del progetto (storia / capitolo / episodio / albo, dipende dal progetto). Indice + dettaglio pagina-per-pagina.
3. **`/orchestra`** — atlante saga: tutte le unità narrative sull'asse temporale, con archi dei semi narrativi, presenze personaggi e luoghi. Vista a tre tracce. Deep linking via hash.
4. **`/strade`** (opzionale) — indice dei percorsi del mondo del progetto. Si attiva via `PROJECT_CONFIG.hasStrade`.

> La sezione **`/mappa`** (mappa cartografica navigabile) **non è parte del template kit** perché richiede troppi parametri progetto-specifici (bbox geografico, slot canonici, layer asset). Se il tuo progetto ha cartografia, costruisci la sezione partendo dal pattern delle altre route (`/orchestra`, `/strade`).

---

## Stack

- Next.js 15, React 19, Tailwind 3.4, shadcn/ui, lucide-react
- Font via `next/font/google`: **Fraunces** (serif) e **JetBrains Mono** (mono)
- Design tokens (`paper`, `ink`, `accent`, `accent-warm`, ecc.) come CSS variables in `app/globals.css` e mappate in `tailwind.config.ts`
- Path alias `@/*`

---

## Adozione: come specializzare al tuo progetto

### Passo 1 — Configurazione

Modifica **`lib/project-config.ts`** con i valori del tuo progetto:

```ts
export const PROJECT_CONFIG: ProjectConfig = {
  title: "Il Mio Progetto",
  subtitle: "Cruscotto editoriale",
  description: "...",
  language: "it",
  expectedUnitsCount: 12,        // o null se non noto
  hasMappa: false,               // true se hai cartografia
  hasStrade: false,              // true se hai indice strade
  // ...
};
```

### Passo 2 — Variabili d'ambiente per i prebuild

Gli script di prebuild leggono il grafo + il catalogo del progetto. Imposta le env vars rilevanti:

| Variabile | Default | Cosa è |
|---|---|---|
| `REPO_ROOT` | `../` rispetto a `web/` | radice del progetto |
| `GRAPH_PATH` | `$REPO_ROOT/story_graph.json` | grafo canonico (output di `_scripts/bootstrap_graph.py`) |
| `CATALOG_INDEX_PATH` | `$REPO_ROOT/catalogo_index/data/entities.json` | indice catalogo (output di `_scripts/build_catalog_index.py`) |
| `STORIE_DASHBOARD_PATH` | `$REPO_ROOT/catalogo_index/data/storie.json` | dashboard storie (opzionale) |
| `TESTI_FINALI_DIR` | `$REPO_ROOT/testi_finali` | cartella con i testi finali Markdown |
| `STORY_FILE_PATTERN` | `^[^_].+\.md$` | regex per riconoscere i file di unità |
| `NEXT_PUBLIC_IMAGE_BASE` | (vuoto) | CDN immagini esterno opzionale |

Esempio in radice progetto:

```bash
cd <tuo-progetto>
export REPO_ROOT="$(pwd)"
export GRAPH_PATH="$REPO_ROOT/story_graph.json"
export CATALOG_INDEX_PATH="$REPO_ROOT/catalogo_index/data/entities.json"
export TESTI_FINALI_DIR="$REPO_ROOT/testi_finali"
cd web
npm install
npm run dev
```

### Passo 3 — Specializzazioni codice (cerca `// PROJECT:`)

Pochi punti nel codice sono marcati con `// PROJECT:` per indicare dove serve adattamento al tuo progetto. In particolare:

- **`scripts/build-orchestra-data.mjs`** — funzioni `mapLocationType`, `normalizeBlock`, `normalizeAtmosphereDimension`, `normalizeUnitArcMarker`. Adatta se il tuo progetto ha campi specifici (cicli, stagioni, venti, ecc.) o no.

### Passo 4 — Smoke test

```bash
npm run dev          # localhost:3000
npm run build        # produzione
npm run lint         # lint
```

Controlla:
- `/` carica con il titolo del tuo progetto
- `/catalogo` mostra le tue entità
- `/orchestra` mostra l'atlante con le tue unità

Se `/orchestra` è vuota o ha 0 unità, lo script `build-orchestra-data.mjs` non ha trovato unità nel grafo: verifica `GRAPH_PATH` e che il grafo abbia `g.units` popolato.

---

## Decisioni architetturali del kit

### Soft fields per portabilità

Il modello dati `OrchestraData` (`lib/types-orchestra.ts`) usa **soft fields**: campi opzionali (`null` quando il progetto non li ha). Esempi:
- `cycle` — solo se il progetto ha cicli (atti, blocchi, parti)
- `season` — solo se il progetto ha una dimensione stagionale
- `wind` / `atmosphere` — solo se il progetto ha una cosmologia atmosferica
- `fear` / `arc_marker` — solo se il progetto ha un pattern di archi personaggi tipizzato

La UI gestisce graziosamente l'assenza: se un campo è `null`, non viene mostrato.

### Tolleranza nomenclatura grafo

Gli script di prebuild riconoscono la nomenclatura canonica del kit (`g.units`, `cast_in_scene`, `primary_location_id`, `seeds_blooming`, `global_relations.narrative_promises`) e tollerano alcune nomenclature alternative comuni (`g.stories`, `characters_in_scene`, `location_primary`, `seeds_bloomed_here`, `g.seeds`). Questo permette di adottare il kit anche su grafi che hanno usato varianti di naming nel tempo.

### Niente progetto-specifico nel template

I componenti UI **non hanno hardcoded** nomi di personaggi, luoghi, formule, voci specifiche di un progetto. Tutto passa via il grafo + catalogo del progetto via prebuild scripts.

---

## Sviluppo

```bash
cd web
npm install
npm run dev
```

Apre `http://localhost:3000`. La home è `app/page.tsx`.

Build:
```bash
npm run build
npm start
```

Lint:
```bash
npm run lint
```

---

## Deploy

### Vercel

1. Crea un nuovo progetto Vercel.
2. **Root Directory**: `web/` (relativa alla root del repo del tuo progetto)
3. Framework preset: auto-detect (Next.js)
4. Imposta env vars rilevanti (vedi sopra)
5. Deploy.

### Self-hosted

Build statica + Node:

```bash
npm run build
npm start
```

---

## Vincolo

L'app web **legge** dati dal resto del repo del progetto (grafo, catalogo, narrazioni fattuali) ma **non scrive**. La pipeline narrativa resta governata dagli script Python di `_starter_kit/_scripts/` + dagli agenti IA.

---

## File chiave

```
web/
├── app/
│   ├── page.tsx              home cruscotto
│   ├── layout.tsx            metadata progetto
│   ├── catalogo/             route catalogo + scheda entità
│   ├── orchestra/            route atlante saga
│   ├── storie/               route unità narrative
│   └── strade/               route indice strade (opzionale)
├── components/               componenti React (UI specializzata)
│   ├── catalogo/             tree, gallery, lightbox, sidebar
│   ├── orchestra/            atlas SVG + side-panel
│   ├── storie/               hook list, prosa pagine
│   ├── storie-dashboard/     dashboard storie con audit
│   └── ui/                   shadcn primitives
├── lib/
│   ├── project-config.ts     ★ PUNTO DI SPECIALIZZAZIONE PROGETTO
│   ├── data.ts               loader catalogo
│   ├── orchestra.ts          loader orchestra
│   ├── storie.ts             loader storie
│   ├── markdown.ts           rendering markdown
│   ├── image-url.ts          URL builder immagini
│   ├── types.ts              tipi catalogo
│   ├── types-orchestra.ts    tipi orchestra (soft fields)
│   └── types-storie.ts       tipi storie
├── scripts/                  prebuild script (parametrizzati env)
│   ├── copy-data.mjs         copia entities.json + storie-dashboard.json
│   ├── build-orchestra-data.mjs   genera orchestra.json dal grafo
│   └── build-storie.mjs      genera storie.json dai testi finali
└── public/
    └── data/                 generato da prebuild (gitignored)
```

---

## Status nel kit

Layer 0: **template estratto e generalizzato**.

Layer 1 (di fase): N/A. La web è uno strumento *trasversale* alle fasi, non specializzato di fase.

Layer 2 (di progetto): il progetto adottante specializza via `lib/project-config.ts` + env vars + eventuali estensioni puntuali del codice (es. mappa cartografica progetto-specifica).
