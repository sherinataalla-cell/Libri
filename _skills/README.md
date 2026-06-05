# `_skills/` — Inventario skill agente IA (Layer 0)

Skill **base, generiche, riusabili** per gli agenti IA del kit. Sono il **Layer 0** del pattern di ingegnerizzazione delle skill (vedi `ARCHITETTURA.md` §7.5).

## Inventario corrente

| Skill | Tipologia operativa | Fasi che la usano | Stato |
|---|---|---|---|
| [`prosa/`](./prosa/SKILL.md) | agente-in-chat-dedicata | 06 | ✅ scritta |
| [`brieffer/`](./brieffer/SKILL.md) | agente-script (default) | 05 | ✅ scritta |
| [`catalogatore/`](./catalogatore/SKILL.md) | agente-a-agente (con critic) | 04, riempimenti | ✅ scritta |
| [`distillatore/`](./distillatore/SKILL.md) | agente-in-chat-condivisa | 03 | ✅ scritta |
| [`architetto_grafo/`](./architetto_grafo/SKILL.md) | agente-in-chat-condivisa | 02, migrazioni | ✅ scritta |
| [`promotore_entita/`](./promotore_entita/SKILL.md) | agente-script (con conferme) | 03, 04 | ✅ scritta |
| [`critic_fisica_realismo/`](./critic_fisica_realismo/SKILL.md) | agente-a-agente (loop) | 04, riempimenti grafo | ✅ scritta |
| `orchestratrice/` | meta-livello | tutte | 🟡 fase a sé del kit |
| `illustratore/` | misto | 07 | 🟡 da definire (medium-dipendente) |
| `impaginatore/` | script | 07 | 🟡 da definire |

## Forma canonica di una skill

Ogni `SKILL.md` ha sezioni standard:

- **Identità** — chi è l'agente, cosa fa, cosa NON è
- **Quando intervenire** — situazioni d'attivazione
- **Come operare** — procedura standard
- **Vincoli operativi / cosa NON fare** — vincoli forti
- **Output finale** — formato di consegna all'orchestratrice
- **Casi limite** — gestione situazioni anomale
- **Coordinamento con altri agenti** — chi chiama, chi è chiamato
- **Modalità operativa** — tipologia per orchestratrice
- **Checklist sanity** — verifiche prima di dichiarare done

## Pattern di composizione

L'orchestratrice quando attiva una skill compone:

```
Layer 0 (base, qui in _skills/<nome>/SKILL.md)
   ↓
+ Layer 1 (di fase, in _fasi/<NN>/skill_overlay_<nome>.md, se esiste)
   ↓
+ Layer 2 (di progetto, nella repo del progetto reale, se esiste)
   ↓
contesto operativo passato all'agente
```

## Perché skill in cartella separata, non dentro le fasi

Alcune skill operano in più fasi (catalogatore: 04 + riempimenti grafo; critic_fisica_realismo: 04 + riempimenti grafo + audit autoriale; orchestratrice: tutte). Tenerle in `_skills/` rende l'orchestratrice un punto unico di pesca: chiama una skill per nome, indipendentemente dalla fase corrente. Le fasi referenziano le skill che usano nei loro README.

## Stato

🟢 7/10 skill scritte. Mancano: `orchestratrice` (fase a sé del kit, vedi ARCHITETTURA §7), `illustratore` e `impaginatore` (medium-dipendenti, da definire dopo aver chiarito casi d'uso).
