# CLAUDE.md — L'Ombra del Vesper

> Questo file è letto automaticamente da Claude Code. **Leggilo per intero prima di qualsiasi azione.**

---

## Cosa è questo progetto

Pipeline narrativa agentica per **"L'Ombra del Vesper"** — dark contemporary romance, ~60-80k parole, target Kindle Unlimited.

- **Protagonisti**: Dante Ravencroft (41, proprietario The Vesper) & Aurora "Rory" Winters (37, giornalista investigativa)
- **Setting**: Seattle, club esclusivo The Vesper con segreti oscuri
- **Struttura**: 20 capitoli, 4 movimenti, doppio POV (Dante/Rory)
- **Stato**: 8 capitoli scritti (`progetto/narrazione_fattuale/`), 12 da scrivere

**Documenti-anima** (`progetto/_documenti_anima/`):
- `bibbia.md` — canone-mondo (personaggi, setting, temi)
- `framework_strutturale.md` — struttura 20 capitoli, 4 movimenti
- `carta_voce.md` — vocabolario frattale, registro dei personaggi

**Contenuto narrativo** (`progetto/`):
- `narrazione_fattuale/cap_01..08.md` — capitoli già scritti
- `testi_finali/cap_01..08.md` — stessa fonte, pronti per editing
- `grafo_schema.json` — schema del grafo (da completare Fase 02)
- `glossario_consegna.json` — glossario entità (da completare Fase 01/02)

---

## REGOLE OPERATIVE — leggere prima di qualsiasi azione

### 🔴 Regola 1 — Mai modificare il grafo a mano

`progetto/story_graph.json` non si edita **mai** direttamente. Tutto passa per `_scripts/`. Sequenza obbligatoria:

```
python3 _scripts/<script>.py            # dry-run (preview, nessuna modifica)
python3 _scripts/<script>.py --apply    # scrittura con backup automatico
```

Se il dry-run dà errore → **non lanciare --apply**. Fermarsi e diagnosticare.

### 🔴 Regola 2 — Modifiche strutturali: serve autorizzazione del creatore

**Qualsiasi modifica che cambia la *forma* del grafo** (non il contenuto) richiede autorizzazione esplicita del creatore del sistema prima di procedere.

Rientrano in questa categoria:
- Modifiche a `progetto/grafo_schema.json` (aggiunta/rimozione/rinomina campi)
- Esecuzione di `_scripts/migrate_schema.py`
- Aggiunta di nuove categorie top-level in `entities`
- Cambiamento della `schema_version`
- Qualsiasi modifica che tocchi la struttura dei nodi unità (non il loro contenuto)

**Se l'utente richiede una di queste operazioni:**
1. Spiega cos'è la modifica strutturale e perché richiede autorizzazione
2. Fermati. **Non procedere.**
3. Di' all'utente: *"Questa modifica richiede l'autorizzazione del creatore del sistema. Contatta il creatore, descrivi la modifica richiesta, e torna con la sua conferma prima di continuare."*

**Non fanno parte di questa categoria** (operazioni normali, nessuna autorizzazione richiesta):
- Aggiungere contenuto via `write_node_to_graph.py` (distillazione capitoli)
- Aggiungere entità via `promote_entities_to_graph.py`
- `bootstrap_graph.py` (prima inizializzazione)
- Qualsiasi script di lettura/audit
- Modificare file narrativi (`narrazione_fattuale/`, `testi_finali/`, `_documenti_anima/`)

### 🔴 Regola 3 — Workflow Git: sempre branch + PR

**Mai modifiche dirette su `main`.** Sempre:

1. **Crea un branch** prima di iniziare qualsiasi lavoro
2. **Lavora sul branch**
3. **Crea una PR** a lavoro concluso
4. **Merge su `main` solo su richiesta esplicita dell'utente** — l'agente non fa mai merge autonomamente

**Naming convention branch:**

| Tipo di lavoro | Nome branch |
|---|---|
| Distillazione capitolo N | `cap/cap_NN-distillazione` |
| Scrittura prosa capitolo N | `cap/cap_NN-prosa` |
| Fase 02 (schema grafo) | `fase/02-schema` |
| Catalogo | `fase/04-catalogo` |
| Fix/correzione | `fix/descrizione-breve` |
| Lavoro generico agente | `claude/descrizione-breve` |

**L'agente a inizio sessione:**
1. Verifica se è su `main` → se sì, crea/switcha su branch appropriato
2. Verifica se ci sono branch aperti non mergiati dal lavoro precedente → segnalalo all'utente
3. Ricorda all'utente di fare merge + pull di `main` prima di iniziare nuovo lavoro

**Atomic commits:** un commit per unità logica di lavoro (es. un capitolo distillato = un commit).

---

## Come Claude Code aiuta l'utente

### 1. All'inizio di ogni sessione

Prima di qualsiasi altra cosa:
1. Leggi `progetto/STATO_PROGETTO.md` — capisce lo stato corrente
2. Controlla il branch attivo — se è `main`, crea un branch
3. Controlla se ci sono sessioni agenti foreground in corso (`list_pending_agent_sessions()`)

### 2. Le 7 fasi della pipeline

| Fase | Cosa succede |
|---|---|
| 01 — Ideazione | documenti-anima (bibbia, voce, archi, glossario) |
| 02 — Congelamento grafo | specializzazione schema (**richiede autorizzazione creatore per modifiche strutturali**) |
| 03 — Distillazione | una unità per chat: dai fatti al grafo + narrazione fattuale |
| 04 — Catalogo | schede strutturate per personaggi, luoghi, oggetti |
| 05 — Brief | composizione meccanica del brief (zero LLM) |
| 06 — Prosa | scrittura testo finale, una scena alla volta, chat dedicata |
| 07 — Editing/composizione | assemblaggio prodotto finale |

Stato corrente: **fase di importazione** (transizione 01→02). Vedi `progetto/STATO_PROGETTO.md`.

### 3. Le skill — indossa il ruolo richiesto

Quando il contesto richiede una skill, leggi `_skills/<nome>/SKILL.md` e adotta quell'identità:

- `architetto_grafo` — Fase 02 (congelamento schema)
- `distillatore` — Fase 03 (popolamento grafo)
- `catalogatore` — Fase 04 (schede catalogo)
- `critic_fisica_realismo` — validazione coerenza fisica
- `promotore_entita` — promozione entità nuove al grafo
- `brieffer` — generazione brief Fase 05
- `prosa` — scrittura testo finale Fase 06

### 4. Gli script — sempre via `_scripts/` o MCP

Idempotenti, `--dry-run` di default, backup automatico prima di ogni scrittura.

Il modo preferito è via il server MCP (`_mcp_server/`). Se non installato: `cd _mcp_server && pip install -e .`.

### 5. Agenti foreground

Per task con dialogo iterativo (distillatore, agente prosa, ecc.):

1. Prepara sessione: `prepare_agent_session(agent_name, objective, ...)`
2. Istruisci l'utente: *"Apri un terminale in `_agenti/<nome>/`, lancia `claude`."*
3. L'utente torna e dice *"ho finito con `<nome>`"*
4. Leggi risultati: `read_agent_session_output(agent_name)` e integra

---

## Convenzioni operative (riepilogo)

1. **Mai modificare il grafo a mano.** Tutto via script. (Regola 1 sopra)
2. **Modifiche strutturali → autorizzazione creatore.** (Regola 2 sopra)
3. **Sempre branch + PR.** Mai commit diretti su `main`. (Regola 3 sopra)
4. **`--dry-run` prima di `--apply`.** Sempre, senza eccezioni.
5. **Backup canonico** prima di ogni modifica significativa.
6. **Una unità per chat** in Fase 03 e Fase 06. Mai due unità nella stessa sessione.
7. **Frasi-codice del grafo** sono inalterabili. Mai modificate dall'agente prosa.
8. **Pattern AI da bandire** sono inderogabili. Zero eccezioni.

Dettaglio: `_convenzioni/` e `progetto/_convenzioni_progetto/convenzioni_vesper.md`.

---

## Stato del progetto (snapshot)

| Componente | Stato |
|---|---|
| Documenti-anima (`bibbia`, `framework`, `carta_voce`) | ✅ |
| Capitoli scritti (cap_01..08) | ✅ — in `narrazione_fattuale/` + `testi_finali/` |
| Schema grafo (`grafo_schema.json`) | 🟡 bozza — da completare Fase 02 |
| Glossario (`glossario_consegna.json`) | 🟡 bozza — da completare |
| Bootstrap grafo (`story_graph.json`) | ⬜ non ancora — dopo schema + glossario |
| Distillazione retroattiva cap.01-08 | ⬜ non ancora — dopo bootstrap |
| Pattern AI da bandire | ⬜ da scrivere in chat dedicata |
| Capitoli 09-20 | ⬜ da scrivere |

Prossimo passo → `progetto/STATO_PROGETTO.md`.
