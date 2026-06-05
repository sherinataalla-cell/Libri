# Fase 02 — Congelamento Schema-Grafo: pipeline operativa

> Come si specializza il template-pattern frattale del kit (`ARCHITETTURA.md` §4) al dominio specifico del progetto, e come si congela lo schema una volta per tutte.

---

## §1. Quando si entra in Fase 02

Si entra in Fase 02 quando la Fase 01 (ideazione) è chiusa e l'autore ha consegnato i **documenti-anima**:

- bibbia / canone-mondo
- carta voce + pattern AI da bandire
- archi narrativi globali
- glossario-consegna (pre-catalogo embrionale + pre-grafo a livello macro)
- framework strutturale silente (opzionale)

Vedi `_fasi/01_ideazione/` per il dettaglio (in via di estrazione). Il segnale di chiusura Fase 01 è una dichiarazione esplicita dell'autore: "i documenti-anima sono pronti, possiamo congelare".

---

## §2. Output di Fase 02

A chiusura della fase, esistono nel progetto:

1. **Schema canonico del grafo** — `<repo-progetto>/.../grafo_schema.json` (o equivalente)
2. **Grafo iniziale popolato a livello macro** — `<repo-progetto>/.../story_graph.json` con tutte le entità del glossario-consegna promosse, livelli medio/micro vuoti
3. **Documento autoriale di scelte di specializzazione** — `<repo-progetto>/.../decisioni_schema_grafo.md`
4. **Backup canonico iniziale** — `<file-grafo>.pre_distillazione_iniziale.backup.json`
5. **Schede embrionali del catalogo** per le entità del glossario-consegna (frontmatter + body con marker `_da popolare_`) — questo passaggio chiama anche la skill `catalogatore` o `promotore_entita`

Da qui la **regola d'oro** è in vigore: schema additivo, retroattivo a `null`, riempimenti contestualizzati (vedi `ARCHITETTURA.md` §4.8).

---

## §3. Il flusso operativo

### Passo 1 — Raccolta delle 4 decisioni autoriali

L'agente `architetto_grafo` (vedi `_skills/architetto_grafo/SKILL.md` §3.1) raccoglie dall'autore le 4 decisioni:

1. **Quante granularità servono** (1, 2 o 3 livelli del template-pattern frattale)
2. **Quali categorie tematiche** di entità (universali: personaggi, luoghi; opzionali: oggetti, gruppi; specifiche al dominio: fenomeni, artefatti, dispositivi, ...)
3. **Quali relazioni globali** (promesse narrative, richiami espliciti, debiti, archi personaggi)
4. **Quali tracciatori globali** (vincoli di unicità, distribuzione, anti-consecutività)

Modalità: chat condivisa autore + architetto_grafo (orchestratrice osserva). Pattern: l'agente legge i documenti-anima, **propone** le 4 decisioni con motivazioni, l'autore approva o modifica.

Output: documento `decisioni_schema_grafo.md` con le 4 decisioni motivate.

### Passo 2 — Specializzazione dello schema

L'architetto_grafo prende il template `_fasi/02_congelamento_grafo/_schema_template/grafo_schema_v1.json` del kit e lo specializza:

- mantiene inalterati i campi base universali (id, versioni, struttura macro/medio/micro, regola d'oro)
- aggiunge le categorie tematiche di entità decise, ognuna con il suo schema di nodo
- aggiunge le relazioni globali decise come strutture top-level del macro
- aggiunge i tracciatori globali come oggetto `quote_tracker` del macro
- specializza i campi del nodo unità narrativa (livello medio) per il dominio
- specializza i campi del nodo scena/hook (livello micro) per il medium

Output: file `<repo-progetto>/.../grafo_schema.json` (o equivalente per il progetto).

### Passo 3 — Bootstrap del grafo iniziale

Lancio dello script idempotente:

```bash
python3 _scripts/bootstrap_graph.py --apply
```

Lo script legge il glossario-consegna (Fase 01) + lo schema appena compilato, e crea il grafo iniziale popolato a livello macro:

- tutte le entità del glossario promosse al livello macro (con id stabili)
- relazioni globali dichiarate ma vuote
- quote_tracker inizializzato a zero
- livello medio (unità narrative) vuoto
- livello micro (scene/hook) vuoto

Output: file `<repo-progetto>/.../story_graph.json` (o equivalente).

### Passo 4 — Generazione delle schede embrionali del catalogo

Per ogni entità appena promossa al grafo, si crea la sua scheda embrionale nel catalogo:

```bash
python3 _scripts/promote_entities_to_graph.py --bootstrap-catalog --apply
```

(oppure è gestito da uno script gemello, dipende dall'organizzazione del progetto.)

Output: cartelle `<repo-progetto>/.../catalogo/<famiglia>/<id>/scheda.md` con frontmatter machine-readable + body con marker `_da popolare_` per ogni entità.

### Passo 5 — Backup canonico iniziale

Prima di chiudere la fase:

```bash
cp <file-grafo> <file-grafo>.pre_distillazione_iniziale.backup.json
```

Il backup è committato insieme allo schema e al grafo iniziale, come trail di audit.

### Passo 6 — Validazione finale

L'architetto_grafo lancia gli audit del kit (vedi `_scripts/audit/`):

- `audit_1_integrity.py`: il grafo è ben formato, tutti i campi obbligatori sono presenti
- `audit_2_schema.py`: il grafo rispetta lo schema dichiarato
- `audit_3_navigability.py`: tutte le referenze fra nodi sono valide
- `audit_4_drift.py`: (n/a in questa fase, riguarda la prosa)

Se gli audit passano: la fase è chiusa.

---

## §4. Casi limite

### §4.1 Distillazione di una unità prima del congelamento

Caso comune: l'autore vuole distillare la prima unità in chat, e durante la distillazione emerge che lo schema ha bisogno di un campo non previsto.

Soluzione: la distillazione precoce **aiuta** a stabilizzare lo schema. È una pratica consigliata, non un problema. Vedi `_skills/architetto_grafo/SKILL.md` §5.3 per il dettaglio: si congela lo schema **dopo** che almeno una unità è stata distillata con successo, usando quella unità come "prova di adeguatezza dello schema".

### §4.2 L'autore propone una categoria tematica anomala

L'agente architetto_grafo accetta. Il template è agnostico: aggiungi la categoria al livello macro del grafo, scrivi un template di nodo entità per quella categoria seguendo il pattern in `ARCHITETTURA.md` §4.5, segnala alla skill `catalogatore` che ci sarà un template di scheda specifico per quella categoria.

### §4.3 Il glossario-consegna è incompleto

Caso comune: l'autore consegna un glossario con 30 entità "principali", sapendo che ne emergeranno altre durante la distillazione. È accettabile: il bootstrap promuove le 30, e durante la Fase 03 la skill `promotore_entita` aggiunge le altre via passate di promozione.

### §4.4 L'autore vuole partire senza nessun framework strutturale silente

Va benissimo. Il framework strutturale silente è opzionale. Se non c'è, lo schema dello unità narrativa non avrà i campi `attributo_dominante` e simili. Niente di speciale.

---

## §5. Relazione con altre fasi

| Fase | Relazione |
|---|---|
| Fase 01 (ideazione) | Fornisce i documenti-anima da cui Fase 02 specializza lo schema |
| Fase 03 (distillazione) | Riempie il grafo a livello medio/micro usando lo schema congelato in Fase 02 |
| Fase 04 (catalogo) | Arricchisce le schede embrionali create in Fase 02 |
| Fase 05+ | Leggono il grafo congelato come fonte autoritativa per la struttura |

---

## §6. Onestà di processo: Fase 02 e Fase 03 collassano spesso

Nella pratica reale, la separazione netta Fase 02 / Fase 03 è un'**idealizzazione architetturale**. Spesso le due fasi si vivono insieme: la prima unità si distilla in chat, e durante la distillazione lo schema si stabilizza. La fase si chiude quando *sia* lo schema *sia* la prima unità sono validi.

Questo è atteso. Il kit lo dichiara qui esplicitamente per non illudere l'autore (o un futuro agente IA) che ci sia una sequenza pulita 02 → 03.

Pattern frequente:

1. Bootstrap del grafo iniziale a livello macro (Passo 3 sopra)
2. Distillazione della prima unità in chat (Fase 03 — vedi `_fasi/03_distillazione/PIPELINE.md`)
3. Eventuali aggiunte additive allo schema rivelate dalla distillazione (rientro in Fase 02 con migrazione one-shot)
4. Congelamento ufficiale dello schema (Passo 5 + 6 sopra)
5. Distillazione delle unità successive (Fase 03 a regime)
