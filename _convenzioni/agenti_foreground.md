# Agenti foreground — convenzione filesystem-bus

## Cos'è un agente foreground

Un **agente foreground** è una skill specializzata del kit che richiede una **chat dedicata** con l'utente. Esempi tipici: distillatore Fase 03, agente prosa Fase 06, analista voce, agente di Fase 01 ideazione.

A differenza degli agenti **background** (script idempotenti, audit, prebuild), che l'orchestratrice lancia direttamente come sub-process e che non interagiscono con l'utente, gli agenti foreground:

1. Hanno bisogno di una **chat dedicata** per dialogare con l'utente
2. Lavorano con il loro contesto pulito, senza il "rumore" di tutto ciò che ha fatto l'orchestratrice
3. Producono output che l'orchestratrice integra alla fine della sessione

L'orchestratrice **non può aprire una nuova istanza di Claude Code da sé**. Quindi il pattern è:

1. L'orchestratrice prepara tutto il necessario in una cartella di sessione dell'agente
2. Istruisce l'utente: "apri un terminale, vai in `_agenti/<nome>/`, lancia `claude`"
3. L'utente lancia. La nuova istanza Claude Code in quella cartella legge il `CLAUDE.md` locale (sovrascrive quello della radice) e il `SKILL.md` dell'agente
4. L'agente lavora con l'utente
5. Al termine scrive l'output nel filesystem condiviso e chiude il log
6. L'utente torna nella chat orchestratrice. L'orchestratrice legge l'output e prosegue

La comunicazione orchestratrice ↔ agente foreground passa **via filesystem**. Robusta, ispezionabile, permette di riprendere sessioni interrotte.

## Struttura canonica di un agente foreground

```
_agenti/<nome_agente>/
├── README.md              cosa fa l'agente, quando si lancia (per l'utente)
├── CLAUDE.md              istruzioni di boot per Claude all'apertura
├── SKILL.md               la skill operativa (può importare da _skills/)
└── _sessione_corrente/    preparata dall'orchestratrice prima del lancio
    ├── BRIEFING.md        cosa l'orchestratrice ha preparato
    ├── INPUT/             file che l'agente deve leggere
    ├── OUTPUT/            dove l'agente scrive
    └── _log_sessione.md   append-only, comunicazione bidirezionale
```

### Regole strutturali

- **Una sola sessione attiva alla volta** per agente. La cartella si chiama sempre `_sessione_corrente/`. Quando una sessione è chiusa e archiviata, viene rinominata in `_sessioni_archivio/<timestamp>_<descrizione>/` (vedi §5).
- **`_sessione_corrente/` è gestita dall'orchestratrice e dall'agente, mai dall'utente direttamente**. L'utente non modifica file dentro quella cartella.
- **`CLAUDE.md` locale dell'agente sovrascrive quello della radice** quando Claude Code è lanciato in `_agenti/<nome>/`. Comportamento nativo di Claude Code, non c'è da configurare.

## 1. `BRIEFING.md` — cosa prepara l'orchestratrice

Il `BRIEFING.md` è il documento che l'orchestratrice scrive **prima** di passare la sessione all'agente. È il "passaggio di consegne" da una chat all'altra. Struttura canonica:

```markdown
# Briefing sessione — <nome agente>

**Sessione preparata da:** orchestratrice
**Data preparazione:** <ISO datetime>
**Stato:** pronta per lancio

---

## 1. Obiettivo della sessione

[Cosa deve fare l'agente in questa sessione, in 2-5 frasi. Specifico, misurabile, chiuso.]

## 2. Contesto rilevante

[Frammenti di stato del progetto che l'agente deve conoscere — non più di 1-2 paragrafi. Più contesto = più rumore.]

## 3. Input forniti

I seguenti file sono in `INPUT/`:
- `<nome_file>` — [breve descrizione di cosa è]
- ...

## 4. Output attesi

Al termine, l'agente deve produrre in `OUTPUT/`:
- `<nome_file>` — [forma e contenuto attesi]
- ...

## 5. Vincoli e regole specifiche di questa sessione

[Regole che valgono per questa sessione e che si aggiungono — non sostituiscono — alla skill base dell'agente. Esempio: "lavorare solo su questa unità", "non promuovere entità", "fermarsi a 3 passate".]

## 6. Fine sessione

L'agente termina la sessione scrivendo:
1. Tutti i file richiesti in `OUTPUT/`
2. Una riga finale in `_log_sessione.md` con `[STATUS: completed | partial | aborted]` e un consuntivo di 3-5 righe.

L'utente può poi tornare nella chat orchestratrice.
```

## 2. `INPUT/` — file in lettura per l'agente

L'orchestratrice popola `INPUT/` con i file che l'agente deve leggere. Convenzioni:

- **Path assoluti vs copie locali.** Per file canonici (grafo, schede catalogo, brief) preferire i **path assoluti** referenziati nel `BRIEFING.md` invece di duplicarli in `INPUT/`. L'agente legge dal canonico.
- **File transitori** (output di una sessione precedente, draft, materiali da consegna) vanno copiati dentro `INPUT/`.
- **Nomenclatura semplice e descrittiva.** Esempio: `unita_da_distillare.yaml`, `narrazione_fattuale_grezza.md`, `voce_da_analizzare_1.md`.

## 3. `OUTPUT/` — dove l'agente scrive

L'agente produce file in `OUTPUT/`. **Mai modifica direttamente file canonici del progetto** (grafo, schede catalogo). Quelli li integra l'orchestratrice (eventualmente via tool MCP idempotenti) **dopo** aver letto l'output.

Convenzioni:
- **Output strutturati**: per dati machine-readable usare YAML/JSON.
- **Output narrativi**: Markdown.
- **Mai timestamp nei nomi file**: l'archivio storico passa per `_sessioni_archivio/`, non per il naming.

## 4. `_log_sessione.md` — comunicazione bidirezionale

Il file `_log_sessione.md` è **append-only**. Sia l'orchestratrice (in fase di preparazione) sia l'agente (durante e a fine sessione) ci scrivono. Non si rimuovono righe, mai. Formato canonico di ogni entry:

```markdown
---
**[<ISO datetime>] [<chi>] [<categoria>]**

<contenuto>
```

Esempi di entry:

```markdown
---
**[2026-05-12T10:30:00Z] [orchestratrice] [SETUP]**

Sessione preparata. Agente: distillatore. Unità target: cap03.
Vedi BRIEFING.md per dettagli completi.

---
**[2026-05-12T10:45:12Z] [agente] [DECISION]**

Per la scena 4, propongo che la location sia `cucina_invernale` invece di
`cucina` non qualificata. Motivo: la stagione è inverno, e la cucina ha
arredo stagionale documentato in scheda. Validato con utente.

---
**[2026-05-12T11:20:30Z] [agente] [OUTPUT]**

Scritto OUTPUT/cap03_unita.yaml + OUTPUT/cap03_scene.yaml.

---
**[2026-05-12T11:21:00Z] [agente] [STATUS: completed]**

Sessione conclusa. 4 scene distillate, 1 entità nuova proposta
(`oggetto_xy`), 0 disallineamenti rilevati. L'utente può tornare alla
chat orchestratrice.
```

### Categorie canoniche

| Categoria | Quando |
|---|---|
| `SETUP` | preparazione sessione (orchestratrice) |
| `BOOT` | apertura sessione (agente alla prima azione) |
| `DECISION` | scelte motivate dell'agente con/senza utente |
| `QUESTION` | quando l'agente si ferma per chiedere all'utente |
| `OUTPUT` | scrittura di un file in OUTPUT/ |
| `WARNING` | rilevazione di problema non bloccante |
| `ERROR` | errore bloccante |
| `STATUS: <value>` | unica entry conclusiva, valori: `completed`, `partial`, `aborted` |

### Una sola entry `STATUS:` per sessione

L'entry conclusiva è **obbligatoria** e **unica**. Senza di essa l'orchestratrice non considera chiusa la sessione.

## 5. Archiviazione di una sessione

Quando l'orchestratrice ha letto `OUTPUT/` e integrato i risultati nel canone:

1. Sposta `_sessione_corrente/` in `_sessioni_archivio/<YYYY-MM-DD_HH-MM>_<descrizione_breve>/`
2. La cartella `_sessione_corrente/` torna vuota, pronta per la prossima

Esempio:
```
_sessione_corrente/  →  _sessioni_archivio/2026-05-12_11-20_distill_cap03/
```

L'archivio è committato (audit trail). Il rolling state `_sessione_corrente/` è solo lo stato corrente.

## 6. Più agenti foreground in parallelo

Più agenti possono avere sessioni attive contemporaneamente, ognuno nella propria cartella `_agenti/<nome>/_sessione_corrente/`. L'orchestratrice tiene conto di quali sessioni sono pendenti via il tool MCP `list_pending_agent_sessions`.

L'utente lavora **una sessione alla volta** (un terminale aperto in una sotto-cartella per volta). La parallelizzazione vale solo lato orchestratrice / coda di sessioni preparate.

## 7. Errori e ripresa

### Sessione interrotta dall'utente

Se l'utente chiude Claude Code prima del `STATUS:`, la sessione resta `partial`. L'orchestratrice (al ritorno dell'utente) ispeziona `_sessione_corrente/_log_sessione.md` e decide:
- riprendere → l'utente rilancia `claude` nella stessa cartella, l'agente legge il log, riparte dall'ultimo punto coerente
- abbandonare → l'orchestratrice archivia la sessione con tag `aborted` e ne prepara una nuova

### Sessione con errore bloccante

L'agente scrive entry `[ERROR]` + `[STATUS: aborted]` con motivazione. L'orchestratrice legge, decide come rimediare.

### Conflitti di stato

Se due sessioni dello stesso agente sono state aperte per errore (utente che ha lanciato due volte), la seconda istanza Claude in `CLAUDE.md` deve **rifiutare** se trova `_log_sessione.md` con entry recenti senza `STATUS:`. È compito di `CLAUDE.md` dell'agente fare questo controllo al boot.

## 8. Naming dell'agente

Convenzione: snake_case in italiano. Esempi:
- `distillatore`
- `analista_voce`
- `agente_fase_01_ideazione` (oppure più stretto `agente_bibbia` / `agente_archi`)
- `agente_prosa`
- `agente_illustratore`

Mai prefissi tipo `_agente_` nel nome (la cartella `_agenti/` lo dà già). Mai versioning nel nome (versioning passa per le iterazioni delle skill, non per cartelle parallele).

## 9. Quando NON usare un agente foreground

Non tutto richiede una chat dedicata. Usare un agente foreground solo se:

- la sessione richiede **dialogo iterativo** con l'utente (non un singolo prompt-risposta)
- la skill è **densa** (>1000 parole di istruzioni operative) e il contesto orchestratrice si "infetterebbe"
- la sessione produce output **strutturati** che vanno validati passo-passo dall'utente

Per task brevi (un prompt → una risposta), niente agente foreground: l'orchestratrice fa direttamente.

## 10. Checklist orchestratrice prima di passare a un agente foreground

- [ ] Agente esiste in `_agenti/<nome>/` con `SKILL.md` + `CLAUDE.md`
- [ ] `_sessione_corrente/` è vuota (sessione precedente archiviata)
- [ ] `BRIEFING.md` scritto, completo dei 6 paragrafi canonici
- [ ] `INPUT/` popolata con i file necessari
- [ ] `_log_sessione.md` inizializzato con entry `[SETUP]`
- [ ] Istruzione all'utente è chiara: cosa lanciare, da dove, cosa aspettarsi

Se anche uno solo di questi è no, **non passare la sessione**. L'agente foreground non improvvisa.
