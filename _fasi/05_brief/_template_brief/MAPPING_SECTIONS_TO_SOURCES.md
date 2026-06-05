# Template Brief — Mappatura sezioni → fonti

> Per ogni sezione canonica del brief, dichiarazione di quale fonte la alimenta. Il progetto reale specializza al proprio dominio in `<repo-progetto>/.../template_brief/MAPPING.md`.

---

## Principio

Il brief è composto **meccanicamente** dallo script `build_brief.py` aggregando contenuto da N fonti. Ogni sezione del brief ha una mappatura precisa a una o più fonti specifiche.

Pattern: la mappatura è dichiarata **una volta** in questo documento, e lo script la implementa.

---

## Mappatura canonica

| Sezione | Fonte primaria | Fonti secondarie | Trasformazione |
|---|---|---|---|
| 1 — Frontmatter | nodo unità del grafo | tutte le fonti (per dichiarazione provenance) | metadata extraction |
| 2 — Core narrativo | nodo unità del grafo (campi premise, problem, threshold_moment, resolution_mode) | — | travaso 1:1 |
| 3 — Narrazione fattuale | file `<repo-progetto>/.../narrazione_fattuale/<id>.md` | — | travaso integrale (intero contenuto) |
| 4 — Inventario scene/hook | nodo unità del grafo (`scenes`) | catalogo (per nomi entità) | espansione: per ogni scena, una entry strutturata |
| 5 — Cast in scena | nodo unità (cast_in_scene) | catalogo (schede entità per canone visivo + voce + frasi codice) | merge: cast dal grafo + dettaglio dal catalogo |
| 6 — Convenzioni del mondo | bibbia (sezione "convenzioni mondo applicabili") | nodo unità (eventuali convenzioni dichiarate locali) | travaso filtrato (solo convenzioni applicabili a questa unità) |
| 7 — Relazioni narrative | global_relations del grafo | — | filtro per unità: solo callback/seeds/debts che riguardano questa unità |
| 8 — Vincoli universali | carta voce + pattern AI da bandire | — | travaso integrale (entrambi i file per intero) |
| 9 — Quote tracker awareness | quote_tracker globale + cumulativo grafo | — | computa stato corrente: cosa è consumato, cosa è disponibile |
| 10 — Istruzione operativa | template del brief (statico) | — | template compilato con metadati unità |

---

## Dettagli di trasformazione per sezione

### Sezione 4 — Inventario scene/hook

Lo script itera sull'array `scenes` del nodo unità. Per ogni scena, compone una entry strutturata:

```markdown
### Scena <NN> — <id-scena>

- **Posizione**: <position>
- **Tipo**: <type>
- **Momento**: <moment>
- **Location**: <id-luogo> (qualifier: <esterno | interno | cortile>) — <name from catalog>
- **Cast presente**: <list di id, con nomi dal catalogo>
- **Focal action**: <focal_action>
- **Atmosfera**: <atmosphere>
- **Palette**: <palette>
- **Onomatopee firma**: <list>
- (campi specifici medium)
```

I nomi delle entità sono pescati dal catalogo per evitare di mostrare solo gli id snake_case nell'inventario. La visualizzazione è "id (nome)".

### Sezione 5 — Cast in scena

Per ogni elemento di `cast_in_scene` del nodo unità:

1. legge l'id entità
2. carica la scheda catalogo dell'entità
3. legge dal nodo unità: ruolo nella unità, modalità attiva, vincoli locali
4. compone la entry:

```markdown
### <Nome Entità> (`<id>`)

**Ruolo nella unità**: <role_in_unit>
**Modalità attiva**: <active_modality>
**Vincoli locali**: max_detti=<N>, max_onomatopee=<N>, ...

**Voce e frasi codificate** (dal grafo, sezione `voice`):
- registro: <register>
- frasi-codice (inalterabili, da integrare):
  - «<frase 1>»
  - «<frase 2>»
- modalità di comunicazione: <list>
- cosa NON dice mai: <list>

**Canone visivo** (dalla scheda catalogo, sezione "Aspetto / forma" + blocco multi-blocco corretto se applicabile):
[blocco testuale travasato dalla scheda]
```

### Sezione 6 — Convenzioni del mondo

Lo script identifica quali convenzioni del mondo sono **applicabili** a questa unità. Criterio tipico:

- convenzioni dichiarate "universali" nella bibbia → sempre incluse
- convenzioni dichiarate "stagionali" / "geografiche" → incluse se il nodo unità ha le condizioni che le attivano
- convenzioni dichiarate "specifiche a un cast" → incluse se il cast della unità le tocca

Travaso del testo della convenzione 1:1 dalla bibbia.

### Sezione 7 — Relazioni narrative

Lo script filtra `global_relations`:

- `callbacks_in` del nodo unità → callback chiamati qui
- `seeds_planted` / `seeds_blooming` / `seeds_maturing` del nodo unità → seeds rilevanti
- `debts_opened` / `debts_closed` del nodo unità → debts rilevanti

Per ognuno, compone una entry strutturata con id, descrizione (dal global_relations), contesto.

### Sezione 9 — Quote tracker awareness

Lo script computa lo stato del quote tracker **al momento della generazione** (cioè considerando tutte le unità già distillate):

- per ogni vincolo del quote tracker, calcola: quota consumata, quota residua, eventuali vincoli anti-consecutività attivi per questa unità
- compone una entry strutturata, leggibile dall'agente prosa

---

## Vincoli implementativi sullo script

- **Lo script è puramente meccanico**: zero LLM, zero arricchimenti, zero inferenze
- **Lo script è idempotente**: rilanciato sullo stesso input, produce identico output
- **Lo script non fallisce silenziosamente**: ogni sezione mancante o errore di mapping logga un avviso o un errore esplicito
- **Lo script preserva l'ordine canonico delle sezioni**: 1 → 10
- **Lo script rispetta i vincoli `_da popolare_`**: una sezione catalogo non popolata genera nel brief un avviso `_(scheda parzialmente popolata, fallback applicato)_`, non blocca il brief
