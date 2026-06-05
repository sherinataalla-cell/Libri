# `_schema_template/` — Template di schema-grafo del kit

Schema canonico di partenza per il grafo di un progetto narrativo: forma a 3 livelli (macro / medio / micro), campi base universali, sezioni opzionali per categorie tematiche specifiche al dominio.

## File

| File | Cosa è |
|---|---|
| `grafo_schema_v1.json` | schema canonico del kit, JSON Schema ridotto. Da specializzare al dominio del progetto. |
| `grafo_iniziale_TEMPLATE.json` | grafo vuoto coerente con lo schema, con tutti i livelli ma niente contenuto |

## Come usarli

In Fase 02 (vedi `../PIPELINE.md`), l'agente `architetto_grafo`:

1. legge `grafo_schema_v1.json` come punto di partenza
2. lo specializza basandosi sulle 4 decisioni autoriali raccolte (livelli usati, categorie tematiche, relazioni globali, tracciatori globali)
3. salva lo schema specializzato in `<repo-progetto>/.../grafo_schema.json`
4. usa `grafo_iniziale_TEMPLATE.json` come modello per il bootstrap del grafo iniziale

## Struttura del template

Il template segue il pattern frattale a 3 livelli di `ARCHITETTURA.md` §4:

- **Livello macro** (root): metadati progetto, registro entità, relazioni globali, quote_tracker, indice unità
- **Livello medio** (unità narrative): nodo per ogni storia/capitolo/episodio con campi di registro, condizioni, dominanti, cast in scena con vincoli locali
- **Livello micro** (scene/hook): nodo per ogni scena/hook con campi di chi/dove/quando/azione/atmosfera

Il template **non assume** un medium specifico: i campi sono neutri al medium (illustrato/audio/fumetto/testo). Il progetto specializza i campi al medium nel passo di specializzazione.

## Cosa NON fare

- **Non modificare il template del kit** per le proprie esigenze di progetto. Fai una copia in `<repo-progetto>/.../grafo_schema.json` e modifica quella. Il template del kit resta riusabile per altri progetti futuri.
- **Non usare il template in produzione senza specializzazione**. È pensato come punto di partenza, non come prodotto finale.

## Stato

🟡 In via di stesura. I file `grafo_schema_v1.json` e `grafo_iniziale_TEMPLATE.json` sono il prossimo step di completamento del kit (livello strutturale denso, vedi `_fasi/02_congelamento_grafo/PIPELINE.md` §3 per come si usano).
