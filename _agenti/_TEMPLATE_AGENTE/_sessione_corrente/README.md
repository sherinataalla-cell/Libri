# `_sessione_corrente/` — Cartella di lavoro per la sessione attiva

Questa cartella ospita i file di **una sola sessione attiva** dell'agente. È preparata dall'orchestratrice prima del lancio, e usata dall'agente durante la sessione.

> **Quando la sessione è chiusa e l'orchestratrice ha integrato i risultati**, questa cartella viene archiviata in `../_sessioni_archivio/<timestamp>_<descrizione>/` e svuotata. Questo è il rolling state, non lo storico.

## Struttura

```
_sessione_corrente/
├── BRIEFING.md         scritto dall'orchestratrice prima del lancio
├── INPUT/              file in lettura per l'agente
├── OUTPUT/             file scritti dall'agente
├── _log_sessione.md    append-only, comunicazione orchestratrice ↔ agente
└── README.md           questo file
```

## Convenzione completa

Vedi `_convenzioni/agenti_foreground.md` per la convenzione canonica:
- §1 — `BRIEFING.md`: 6 paragrafi obbligatori
- §2 — `INPUT/`: copie locali vs path canonici
- §3 — `OUTPUT/`: dove e come l'agente scrive
- §4 — `_log_sessione.md`: formato append-only, categorie canoniche, entry `STATUS:` conclusiva

## Stato corrente

**🟡 Sessione non preparata.** Se vedi questo messaggio nel `BRIEFING.md` (o assenza del file), l'orchestratrice non ha ancora preparato una sessione. Non lanciare l'agente.
