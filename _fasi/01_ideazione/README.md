# Fase 01 — Ideazione

> L'umano e l'AI iterano in chat su un set di documenti-anima del progetto, finché l'umano dice "ora basta, abbiamo abbastanza per raccontare le storie".

## Cosa accade in questa fase

L'autore consegna all'AI quello che ha in testa (mondo, voci, atmosfera, archi, glossario embrionale di personaggi e luoghi) e lo arricchisce in iterazioni successive *insieme* all'AI. Alcuni documenti sono scritti dall'umano e affinati dall'AI; altri sono *inferiti* dall'AI con ricerca web e proposti all'umano per scelta (tipicamente: pattern AI da bandire, voce stilistica per mix di autori reali). Niente di automatico fuori dal controllo dell'autore.

## Input

- L'autore in chat (idee, decisioni, vincoli, direzione)
- Eventuale fetch web a supporto (autori esistenti, riferimenti stilistici, modelli di voce)

## Output atteso

Un set di documenti-anima nel progetto, in stato "abbastanza maturo per congelare il grafo":

- bibbia del mondo (cosmologia, regole interne, atlante alto-livello)
- carta della voce (come deve essere la voce del prodotto)
- voce dell'autore estratta (come scrive davvero l'autore reale, opzionale)
- archi narrativi globali (mappa N storie/capitoli ad alto livello)
- framework strutturale silente (opzionale, dipende dal progetto)
- glossario-consegna (= prime schede di catalogo embrionali, vedi §5.6 di ARCHITETTURA.md)
- pattern AI da bandire (inferito o composto in collaborazione AI ↔ umano)
- miti / antefatti (opzionale)

I template di questi documenti sono in `_template/` (da popolare nelle prossime sessioni del kit).

## Stato di uscita atteso

L'umano dichiara esplicitamente "fase 01 chiusa, congeliamo il grafo". Da quel momento i documenti-anima diventano fonte di lettura per le fasi successive — non si tornerà a modificarli salvo ritorno esplicito a questa fase (raro, e segnalato).

## Skill chiamate dall'orchestratrice in questa fase

- `_skills/ideazione/` (Layer 0) — agente che conduce l'iterazione collaborativa con l'umano
- eventuali specializzazioni Layer 1 in `skill_overlay_*.md` di questa cartella (da popolare)

## Pattern di interazione

Iterazione collaborativa con autorizzazioni: default = l'AI propone e si ferma a chiedere all'umano dove decide l'umano (voce, stile, scelte autoriali); se l'umano dice "fai tu" l'AI procede in autonomia. Lo stesso pattern delle autorizzazioni Git su `main`: la possibilità si suggerisce, l'esecuzione attende il via dell'umano, salvo deleghe esplicite. Il protocollo dettagliato vive in `_convenzioni/protocollo_iterazione.md` (da popolare nelle prossime sessioni — è il primo lavoro concreto di Fase 01).

## Cosa NON va in questa fase

- non si scrive il grafo (è la Fase 02)
- non si scrivono storie singole come narrazione fattuale (è la Fase 03)
- non si scrive prosa (è la Fase 06)

## Stato

🟡 Cartella creata, README dichiarativo presente. Template documenti-anima e protocollo iterazione da estrarre nelle prossime sessioni (richiede materiale dalle chat storiche di un progetto pilota).
