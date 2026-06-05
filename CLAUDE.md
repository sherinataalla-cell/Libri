# CLAUDE.md — L'Ombra del Vesper

> Questo file è letto automaticamente da Claude Code. Descrive il progetto e come Claude deve operare.

---

## Cosa è questo progetto

Sei dentro la pipeline narrativa agentica per **"L'Ombra del Vesper"** — dark contemporary romance, ~60-80k parole, target Kindle Unlimited.

- **Protagonisti**: Dante Ravencroft (41, proprietario The Vesper) & Aurora "Rory" Winters (37, giornalista investigativa)
- **Setting**: Seattle, club esclusivo The Vesper con segreti oscuri
- **Struttura**: 20 capitoli, 4 movimenti, doppio POV (Dante/Rory)
- **Stato corrente**: 8 capitoli scritti (in `progetto/narrazione_fattuale/`), 12 da scrivere

Il progetto usa una pipeline narrativa in 7 fasi con:
- **skill** per gli agenti AI (`_skills/`)
- **convenzioni** trasversali (`_convenzioni/`)
- **script Python idempotenti** per le operazioni sul canone (`_scripts/`)
- un **cruscotto editoriale** in Next.js (`web/`) per visualizzare il progetto

**Documenti-anima del progetto** (in `progetto/_documenti_anima/`):
- `bibbia.md` — canone-mondo (personaggi, setting, temi)
- `framework_strutturale.md` — struttura 20 capitoli, 4 movimenti
- `carta_voce.md` — vocabolario frattale, registro dei personaggi

**Contenuto narrativo** (in `progetto/`):
- `narrazione_fattuale/cap_01..08.md` — i capitoli già scritti
- `testi_finali/cap_01..08.md` — stessa fonte, pronti per editing
- `grafo_schema.json` — schema del grafo (da completare in Fase 02)
- `glossario_consegna.json` — glossario entità (da completare in Fase 01/02)

---

## Come Claude Code aiuta l'utente

L'utente ha appena scaricato il kit. È all'inizio: ha un'idea creativa, un progetto in mente. Da qui in avanti, Claude:

### 1. Legge `ARCHITETTURA.md` e capisce la forma del sistema

Questo è il documento fondante. Va letto **una volta**, a freddo, prima di qualsiasi altra azione. Contiene la pipeline 7 fasi, il template-pattern frattale del grafo, il pattern delle skill, il pattern degli script, il sistema multi-agente.

### 2. Chiede all'utente "in che fase sei?"

Le 7 fasi sono:

| Fase | Cosa succede |
|---|---|
| 01 — Ideazione | autore + AI iterano sui documenti-anima (bibbia, voce, archi, glossario) |
| 02 — Congelamento grafo | si specializza lo schema-template del grafo al dominio del progetto |
| 03 — Distillazione | una unità narrativa per chat: dai fatti al grafo + narrazione fattuale |
| 04 — Catalogo | schede strutturate per personaggi, luoghi, oggetti |
| 05 — Brief | composizione meccanica del brief autosufficiente per ogni unità |
| 06 — Prosa | scrittura del testo finale dall'agente prosa, una scena alla volta |
| 07 — Editing/composizione | assemblaggio del prodotto finale (PDF/EPUB/HTML/...) |

Se l'utente è all'inizio assoluto: **Fase 01**. Si parte da lì.

### 3. Per ogni fase, segue il `PIPELINE.md` corrispondente

Le fasi 02-06 sono già operative e hanno il loro `PIPELINE.md` che spiega cosa fare passo per passo. Le fasi 01 e 07 sono in via di estrazione (vedi sotto).

### 4. Usa le skill in `_skills/` indossando il ruolo richiesto

Le 7 skill base sono:

- `architetto_grafo` — assiste nella Fase 02 (congelamento schema)
- `distillatore` — assiste nella Fase 03 (popolamento grafo unità per unità)
- `catalogatore` — assiste nella Fase 04 (compilazione schede catalogo)
- `critic_fisica_realismo` — valida coerenza fisica/realismo (loop con catalogatore)
- `promotore_entita` — promuove entità nuove al grafo + crea schede embrionali
- `brieffer` — gestisce la generazione meccanica dei brief in Fase 05
- `prosa` — scrive il testo finale, una scena alla volta, in chat dedicata

Quando il contesto richiede una skill, **leggi** `_skills/<nome>/SKILL.md` e adotta quella identità per il task corrente.

### 5. Usa gli script in `_scripts/` — meglio: via il server MCP

Sono Python, idempotenti, con `--dry-run` di default. Mai modificare il grafo a mano: tutto passa per `write_node_to_graph.py`, `bootstrap_graph.py`, ecc. Backup automatici + canonici per ogni modifica.

**Il modo preferito di chiamarli è via il server MCP** in `_mcp_server/`. Si installa una volta (`cd _mcp_server && pip install -e .`) e Claude Code ottiene tool nominali per tutte le operazioni: `bootstrap_graph`, `write_unit_to_graph`, `build_brief`, `audit_graph`, `rebuild_web_data`, ecc. Vedi `_mcp_server/README.md`.

Se il server MCP non è ancora installato (utente nuovo), usa direttamente gli script in `_scripts/` con le env vars appropriate.

### 6. Visualizza con `web/`

L'utente può lanciare `cd web && npm install && npm run dev` per avere il cruscotto editoriale (catalogo, atlante saga, storie) sull'ambiente locale. Aggiornato a ogni rigenerazione dei dati via prebuild.

### 7. Quando delegare a un agente foreground

Distinzione importante:

- **Agenti background**: lanciati direttamente come tool MCP / sub-process. No interazione utente. Esempio: `bootstrap_graph`, `build_brief`, `audit_graph`. Usali liberamente.
- **Agenti foreground**: skill specializzate che richiedono **chat dedicata** con l'utente. Esempi tipici (definiti dal progetto adottante): distillatore, agente prosa, analista voce, agente di Fase 01.

Per gli agenti foreground tu (orchestratrice) **NON puoi aprire una nuova istanza Claude**. Il pattern è:

1. Tu prepari la sessione via `prepare_agent_session(agent_name, objective, ...)` — questo crea `_agenti/<nome>/_sessione_corrente/` con BRIEFING + INPUT + log
2. Tu istruisci l'utente: "Apri un terminale, vai in `_agenti/<nome>/`, lancia `claude`. L'agente saprà cosa fare."
3. L'utente lavora con l'agente in chat dedicata
4. L'utente torna e ti dice "ho finito con `<nome>`"
5. Tu leggi i risultati via `read_agent_session_output(agent_name)` e li integri nel canone

Convenzione completa in `_convenzioni/agenti_foreground.md`. Ad inizio sessione, controlla con `list_pending_agent_sessions()` se ci sono sessioni di agenti foreground in corso o da integrare.

**Quando delegare a un agente foreground:** quando il task richiede dialogo iterativo con l'utente, è ricco di skill specifica (>1000 parole di istruzioni operative), produce output strutturati che vanno validati passo-passo. Per task brevi prompt→risposta, fai direttamente.

---

## Stato corrente del kit

| Componente | Stato |
|---|---|
| Convenzioni trasversali (7/7, incluso agenti_foreground) | ✅ |
| Skill agente IA Layer 0 (7/7) | ✅ |
| Script Python idempotenti (14 + 4 audit) | ✅ |
| Materiali fasi 02–06 | ✅ |
| Materiali fase 01 (ideazione) | 🟡 da definire |
| Materiali fase 07 (editing/composizione) | 🟡 da definire |
| Cruscotto editoriale `web/` | ✅ |
| Server MCP per orchestratrice (16 tool, `_mcp_server/`) | ✅ |
| Pattern agenti foreground (`_agenti/_TEMPLATE_AGENTE/`) | ✅ |
| Agenti foreground specifici (Fase 01, voce, distillatore, prosa) | 🟡 |
| Specifica orchestratrice (chat-router) | 🟡 fase a sé |

**Cose da sapere se la Fase 01 non è ancora pronta:** l'utente può lavorare in **modalità transitoria**: scrivere insieme a Claude i documenti-anima a mano (bibbia, glossario-consegna, carta voce, pattern AI da bandire), poi passare alla Fase 02. Quando la Fase 01 sarà formalizzata, il workflow sarà più strutturato.

---

## Convenzioni operative

Quando lavori in questo progetto:

1. **Mai modificare il grafo a mano.** Tutto via script. Vedi `_convenzioni/git.md` §5.
2. **Backup canonico prima di ogni modifica significativa.** `<file>.pre_<scope>.backup.<estensione>`.
3. **`--dry-run` prima di `--apply`.** Sempre.
4. **Una unità per chat, in Fase 03 e Fase 06.** Mai due unità nella stessa sessione.
5. **Frasi-codice del grafo sono inalterabili.** Mai modificate dall'agente prosa.
6. **Pattern AI da bandire** sono inderogabili. Zero eccezioni.

Per il dettaglio: `_convenzioni/`.

---

## Configurazione del progetto adottante

L'utente personalizza il kit per il suo progetto in **3 punti**:

1. **`web/lib/project-config.ts`** — titolo, sottotitolo, sezioni attive del cruscotto
2. **Variabili d'ambiente** per gli script (vedi `_scripts/README.md` e `web/README.md`)
3. **Specializzazione delle skill di fase** (Layer 1, in `_fasi/<NN>/skill_overlay_<nome>.md`) e della repo del progetto (Layer 2, fuori dal kit)

Per il dettaglio sui 3 layer: `ARCHITETTURA.md` §7.5.

---

## Prima domanda da fare all'utente

Se l'utente è appena entrato nel kit:

> "Siamo in fase di importazione: i documenti-anima esistono già (`progetto/_documenti_anima/`), 8 capitoli sono scritti (`progetto/narrazione_fattuale/cap_01..08.md`). Il prossimo passo è:
> 1. Completare `progetto/glossario_consegna.json` con le entità principali (Fase 01 finale)
> 2. Specializzare `progetto/grafo_schema.json` (Fase 02)
> 3. Bootstrap del grafo con `_scripts/bootstrap_graph.py --apply` (Fase 02)
> 4. Distillazione retroattiva cap. 1-8 (Fase 03) — un capitolo per chat
> 5. Proseguire con la scrittura dei capitoli 9-20"

**Regola principale**: mai modificare il grafo a mano. Tutto via `_scripts/`. Vedi `ARCHITETTURA.md` e `_convenzioni/`.
