# `_agenti/` — Agenti foreground del kit

Questa cartella ospita gli **agenti foreground**: skill specializzate del kit che richiedono una chat dedicata con l'utente, lanciate come istanza Claude Code separata in una sotto-cartella.

> **Convenzione completa**: vedi `_convenzioni/agenti_foreground.md`. Documento canonico letto dall'orchestratrice e da ogni agente al boot.

## Differenza con `_skills/`

| `_skills/<nome>/` | `_agenti/<nome>/` |
|---|---|
| Layer 0 generico, dichiarativo | Modalità di lancio in chat dedicata |
| `SKILL.md` come unico file | `CLAUDE.md` + `SKILL.md` + `_sessione_corrente/` |
| Riusabile da qualsiasi agente | Specifico per una sessione interattiva |
| Definisce l'identità | Definisce **come si lancia** quell'identità |

Un agente foreground può **importare** una skill: il suo `CLAUDE.md` rinvia a `_skills/<nome>/SKILL.md` per le istruzioni operative, e aggiunge le regole di sessione foreground.

## Struttura di un agente

```
_agenti/<nome_agente>/
├── README.md              cosa fa, quando lanciarlo (per l'utente)
├── CLAUDE.md              istruzioni di boot (Claude Code legge questo)
├── SKILL.md               skill operativa (può importare da _skills/)
├── _sessione_corrente/    preparata dall'orchestratrice
│   ├── BRIEFING.md
│   ├── INPUT/
│   ├── OUTPUT/
│   └── _log_sessione.md
└── _sessioni_archivio/    sessioni passate (committate, audit trail)
    └── 2026-05-12_11-20_distill_cap03/
```

## Pattern di lancio

```
1. Orchestratrice prepara _sessione_corrente/ via tool MCP
        prepare_agent_session(agent_name, briefing, input_files)

2. Orchestratrice istruisce utente:
   "Apri terminale → cd _agenti/<nome>/ → claude"

3. Utente lancia. CLAUDE.md locale si attiva, agente legge SKILL.md +
   BRIEFING.md, lavora con utente

4. Agente scrive OUTPUT/ + chiude _log_sessione.md con [STATUS: ...]

5. Utente torna nella chat orchestratrice

6. Orchestratrice via tool MCP read_agent_session_output legge OUTPUT
   + log, integra nel canone, archivia sessione
```

## Template

Per creare un nuovo agente foreground, copia `_TEMPLATE_AGENTE/` e personalizza:

```bash
cp -r _agenti/_TEMPLATE_AGENTE _agenti/<nome_nuovo_agente>
```

Poi modifica:
1. `README.md` — descrivi cosa fa e quando si lancia
2. `CLAUDE.md` — istruzioni di boot specifiche
3. `SKILL.md` — la skill operativa (puoi importare da `_skills/`)

Il sotto-tree `_sessione_corrente/` resta vuoto: lo popola l'orchestratrice quando prepara una sessione.

## Agenti previsti del kit

Il kit non include agenti foreground pre-fatti — ogni progetto specializza i suoi in base a genere narrativo, stile, vincoli autoriali. Esempi tipici di agenti che un progetto potrebbe creare:

| Agente | Quando | Origine skill |
|---|---|---|
| `agente_fase_01_ideazione` | Fase 01: dialogo iniziale con l'autore | da scrivere |
| `analista_voce` | Fase 01: analisi stilistica su testi pre-esistenti | da scrivere |
| `distillatore` | Fase 03: una unità per chat | importa `_skills/distillatore/` |
| `agente_prosa` | Fase 06: una scena per chat | importa `_skills/prosa/` |
| `illustratore` | trasversale: generazione immagine + revisione | da scrivere |

Ogni progetto può aggiungere altri agenti foreground specifici al genere e al medium.

## Stato

- ✅ Convenzione filesystem-bus (`_convenzioni/agenti_foreground.md`)
- ✅ Template `_TEMPLATE_AGENTE/` con scheletro funzionante
- ✅ Tool MCP per orchestratrice (`prepare_agent_session`, `read_agent_session_output`, `list_pending_agent_sessions`)
- 🟡 Agenti specifici: nessuno pre-fatto, sono responsabilità del progetto adottante
