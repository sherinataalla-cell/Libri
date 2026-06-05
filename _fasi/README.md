# `_fasi/` — Le 7 fasi della pipeline narrativa

Ogni fase è un **modulo autocontenuto sviluppabile singolarmente**. Si lavora a una fase alla volta in qualsiasi ordine: le scelte di una fase non bloccano lo sviluppo delle altre.

## Mappa fasi

| # | Cartella | Cosa fa | Tipologia agenti principali |
|---|---|---|---|
| 01 | [`01_ideazione/`](./01_ideazione/) | umano + AI iterano sui documenti-anima del progetto | agente-in-chat-condivisa |
| 02 | [`02_congelamento_grafo/`](./02_congelamento_grafo/) | si congela lo schema-template del grafo per il progetto | agente-in-chat-condivisa + script |
| 03 | [`03_distillazione/`](./03_distillazione/) | una storia/capitolo/episodio alla volta: l'AI riempie il nodo grafo, l'umano valida | agente-in-chat-condivisa |
| 04 | [`04_catalogo/`](./04_catalogo/) | per ogni entità si scrive la scheda canonica del catalogo | agente-a-agente (catalogatore + critic-fisica-realismo) |
| 05 | [`05_brief/`](./05_brief/) | uno script meccanico compone il brief autosufficiente per ogni unità | agente-script |
| 06 | [`06_prosa/`](./06_prosa/) | l'agente prosa scrive il testo finale in chat dedicata con l'umano | agente-in-chat-dedicata |
| 07 | [`07_editing_composizione/`](./07_editing_composizione/) | editing + asset finali (se previsti) + compositore output | misto |

## Iterazione fra le fasi

Le **fasi 1–4 iterano liberamente**: si torna indietro quando emerge che qualcosa manca. Esempi: in fase 03 emerge che la voce di un personaggio non è abbastanza fissata → torna in 01 per rifissarla; in fase 04 una scheda blocca → torna in 03 per recuperare un dettaglio mancante.

Da **fase 5 in poi l'iterazione è bandita** salvo errori manifesti. Se l'agente prosa fa domande strutturali, manca qualcosa nelle 4 fonti — e il fix non è in chat, è a monte (fase 03 o 04) e poi rilancio brief.

Vedi `ARCHITETTURA.md` §2 per la pipeline completa e §4.8 per la regola d'oro del grafo.

## Struttura tipica di una fase

Ogni cartella `NN_nome_fase/` contiene:

```
NN_nome_fase/
├── README.md                    cosa accade nella fase
├── _template/                   template specifici della fase (opzionale)
├── _scripts/                    script specifici della fase (opzionale)
├── _esempi/                     riferimenti puntuali (opzionale)
└── skill_overlay_<nome>.md      Layer 1 specializzazione di fase per skill (opzionale)
```

Le skill base (Layer 0) vivono in [`_skills/`](../_skills/) — cartella separata, vedi `ARCHITETTURA.md` §7.5.

## Stato

🟡 Le 7 cartelle esistono con README dichiarativi. I contenuti specifici (template, schemi, script, skill_overlay) sono da popolare nelle prossime sessioni di sviluppo del kit, una fase alla volta.
