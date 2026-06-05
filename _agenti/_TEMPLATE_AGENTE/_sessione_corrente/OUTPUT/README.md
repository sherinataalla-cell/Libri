# `OUTPUT/` — File scritti dall'agente

Questa cartella contiene i file che l'agente produce durante la sessione. È vuota all'avvio. L'agente la popola progressivamente, scrivendo entry `[OUTPUT]` nel `_log_sessione.md` ad ogni file scritto.

## Cosa va dentro

**Output principali della sessione** (dichiarati nel `BRIEFING.md` §4):
- file YAML/JSON con dati strutturati per il canone
- file Markdown con prosa, analisi, sintesi
- altri formati specifici al mestiere dell'agente

**File opzionali** (scrivere solo se applicabili):
- `proposte_orchestratrice.md` — proposte di cose nuove che NON spettano all'agente integrare nel canone (es. nuove entità, modifiche alla bibbia, archi che non c'erano). Sarà l'orchestratrice a decidere se promuoverle.
- `note_sessione.md` — annotazioni libere per l'orchestratrice (incertezze residue, contesto utile, decisioni rilevanti che meritano attenzione).

## Cosa NON va dentro

- File destinati al canone del progetto (grafo, schede catalogo, brief, testi finali). Quelli vengono integrati dall'orchestratrice **dopo** la sessione, leggendo i file di OUTPUT e usando i tool MCP idempotenti.
- File temporanei di lavoro intermedio. Se l'agente ha bisogno di scratch, può usare `_sessione_corrente/_scratch/` (cartella che può creare e gestire da sé).

## Convenzioni

- Naming descrittivo, snake_case, italiano: `cap03_unita.yaml`, `cap03_scene.yaml`, `analisi_voce_v1.md`
- Niente versioning nel nome (l'integrazione e i backup sono dell'orchestratrice)
- Niente prefissi tipo `OUT_` o `RESULT_`: la cartella stessa è già OUTPUT/

## Lifecycle

I file qui dentro vengono **letti dall'orchestratrice** dopo la sessione (via tool MCP `read_agent_session_output`), integrati nel canone, e archiviati insieme alla sessione in `../_sessioni_archivio/`.
