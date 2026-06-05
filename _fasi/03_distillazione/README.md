# Fase 03 — Distillazione (per unità narrativa)

> L'autore racconta una storia / capitolo / episodio all'AI, l'AI inferisce e riempie il nodo nel grafo, l'autore valida blocco-per-blocco. Una unità narrativa alla volta.

## Cosa accade in questa fase

Per ciascuna unità narrativa del progetto (in saga: una storia; in romanzo: un capitolo; in fumetto: un episodio; ecc.) l'autore racconta i fatti all'AI in chat, e l'AI riempie il nodo del grafo corrispondente al livello medio (vedi `ARCHITETTURA.md` §4.6) e i suoi sotto-nodi al livello micro (§4.7 — scene/hook).

La distillazione è **una unità per chat**, mai a batch. Ogni unità ha la sua chat con doppio turno di guardia: l'AI propone blocco di compilazione → l'autore valida → si passa al blocco successivo.

Le entità che emergono qui ma non sono ancora promosse al livello macro vanno **promosse** al livello macro come parte della distillazione (con scheda catalogo embrionale che parte vuota, riempita poi in Fase 04).

## Input

- Lo schema-template del grafo (Fase 02, congelato)
- I documenti-anima della Fase 01 (bibbia, voce, archi, glossario)
- L'autore in chat (racconta la storia)
- Le unità già distillate (per coerenza arco saga, callback, seeds piantati e da fiorire)

## Output atteso

- Un nodo `unita_narrativa.<id>` completo nel grafo, con scene/hook al livello micro
- Eventuali **nuove entità promosse** al livello macro
- **Narrazione fattuale** della storia in `narrazione_fattuale/<id>.md` — il racconto dei *fatti* della storia in italiano referente, non la prosa finale (è il "referente di verità" che alimenterà il brief in Fase 05)
- Aggiornamento di seeds/callbacks/debts/quote tracker globali

## Stato di uscita atteso

L'autore conferma "storia distillata, passa alla prossima" oppure "passa a Fase 04 per arricchire le schede catalogo delle entità nuove emerse qui". Il loop 03 ↔ 04 è lecito e frequente — sono le **passate riempitive** dichiarate nella regola d'oro (vedi `ARCHITETTURA.md` §4.8 e §2 iterazione fasi 1-4).

## Skill chiamate dall'orchestratrice in questa fase

- `_skills/distillatore/` (Layer 0) — agente che conduce la distillazione storia per storia con doppio turno di guardia
- `_skills/promotore_entita/` (Layer 0, opzionale) — agente che gestisce la promozione di entità nuove al livello macro
- Eventuali specializzazioni Layer 1 in questa cartella

## Cosa NON va in questa fase

- non si riempiono le schede catalogo in dettaglio (Fase 04)
- non si scrive prosa (Fase 06)
- non si saltano storie a casaccio: l'ordine è quello dichiarato negli archi globali

## Stato

🟡 Cartella creata, README dichiarativo presente. Skill `distillatore` e `promotore_entita` da scrivere (Fase 06 di sviluppo del kit).
