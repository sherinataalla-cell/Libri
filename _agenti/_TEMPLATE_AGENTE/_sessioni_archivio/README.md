# `_sessioni_archivio/` — Storico delle sessioni passate

Questa cartella ospita le sessioni passate dell'agente, archiviate **dopo** che l'orchestratrice ha letto e integrato i risultati di `_sessione_corrente/`.

## Convenzione di naming

```
_sessioni_archivio/<YYYY-MM-DD_HH-MM>_<descrizione_breve>/
```

Esempi:
- `2026-05-12_11-20_distill_cap03/`
- `2026-05-15_09-45_voce_iterazione_2/`
- `2026-05-18_14-30_partial_aborted_cap05/`

## Contenuto di una sessione archiviata

L'archivio è una copia 1:1 di `_sessione_corrente/` al momento della chiusura:

```
2026-05-12_11-20_distill_cap03/
├── BRIEFING.md
├── INPUT/
├── OUTPUT/
└── _log_sessione.md
```

## Quando archiviare

L'orchestratrice archivia una sessione quando:

1. Ha letto `OUTPUT/` (via tool MCP `read_agent_session_output`)
2. Ha integrato i risultati nel canone del progetto (eventualmente via tool MCP idempotenti)
3. Ha verificato che il `_log_sessione.md` chiude con `[STATUS: ...]`

## Audit trail

L'archivio è **committato al repo** (audit trail). Permette di ricostruire ogni sessione passata, riprodurre decisioni, fare diff fra integrazioni successive.

`_sessione_corrente/` invece è un rolling state: cambia continuamente, viene resettata fra sessioni.
