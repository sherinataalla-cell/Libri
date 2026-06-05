# Fase 05 — Brief (script meccanico, zero LLM)

> Per ogni unità narrativa, uno script idempotente compone un **brief autosufficiente** leggendo le 4 fonti del progetto. Da qui in avanti, il flusso è deterministico per unità.

## Cosa accade in questa fase

Uno script Python idempotente legge:

- il **grafo** (struttura, scene, cast con vincoli locali, seeds, callbacks, debts)
- il **catalogo** delle schede del cast in scena (aspetto, modalità, frasi codificate, cliché da evitare specifici)
- la **bibbia** (canone del mondo, regole, framework strutturale silente)
- la **carta voce + pattern AI da bandire** (come scrivere e come non scrivere)

E **compone** un brief Markdown autosufficiente per l'unità narrativa scelta. Lo script non chiama LLM, non interpreta, non riassume: assembla meccanicamente le sezioni.

Il brief è **autosufficiente**: l'agente prosa (Fase 06) lavora *solo* leggendo il brief, mai rifetcha altre fonti. Questo è il punto in cui il kit cristallizza tutta la conoscenza canonica nel formato CAG (Context Augmented Generation, contesto pre-costruito).

## Input

- Schema di brief target (in `_template_brief/`, da popolare)
- Le 4 fonti del progetto (grafo, catalogo, bibbia, carta voce + pattern AI)
- Lo script `build_brief.py` in `_scripts/` del kit (template), specializzato dal progetto

## Output atteso

- Per ogni unità narrativa: `<repo-progetto>/.../briefs/<id>_brief.md` — brief autosufficiente
- Dimensione: tipicamente fra 5k e 30k parole (vedi `ARCHITETTURA.md` §3.2 — il brief comprime il *seme* della storia, non il testo finale)
- 13 sezioni canoniche (varia per medium e per progetto, vedi `_template_brief/SECTIONS.md` da scrivere):
  - identità + posizione
  - core narrativo
  - narrazione fattuale integrale (referente di verità)
  - scene/hook/pagine (livello micro)
  - cast in scena (voci + vincoli + frasi codificate + canone visivo dal catalogo)
  - convenzioni del mondo applicabili a questa unità
  - relazioni narrative (callback, seeds, debts, archi)
  - vincoli universali (carta voce + pattern AI da bandire integrale)
  - quote tracker awareness (cosa è stato già usato in saga)
  - istruzione operativa all'agente prosa (modalità collaborativa, lunghezza target, ecc.)

## Stato di uscita atteso

Brief generato, pronto per la Fase 06. **Idempotente**: si può rilanciare quante volte si vuole, sovrascrive con la versione aggiornata. Si rilancia ogni volta che cambia una delle 4 fonti.

## Skill chiamate dall'orchestratrice in questa fase

Nessuna in chat. È **pura tipologia "agente-script"** (vedi `ARCHITETTURA.md` §7.2): l'orchestratrice lancia lo script, riceve l'output (brief generato + log), aggiorna lo stato di progetto.

Eventuale `_skills/brieffer/` (Layer 0) per il caso d'uso in cui l'umano vuole una conferma interattiva del brief generato (raro). Il default è esecuzione muta.

## Cosa NON va in questa fase

- non si scrive prosa (Fase 06)
- non si modificano le 4 fonti (sono solo lettura)
- non si patcha mai il brief a mano: si corregge la fonte upstream e si rilancia lo script

## Stato

🟡 Cartella creata, README dichiarativo presente. Script `build_brief.py` template da scrivere (in `_scripts/` del kit). Schema sezioni del brief da formalizzare.
