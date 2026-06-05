# Skill overlay — distillatore (Fase 03)

> Layer 1 di specializzazione di fase per la skill `distillatore`. Si compone con il Layer 0 (`_skills/distillatore/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Specializza il distillatore per la modalità *agente-in-chat-condivisa* in Fase 03, con autore presente.

### Vincoli operativi specifici di Fase 03

1. **Una unità per chat**, sempre. Mai due unità nella stessa chat. Se l'autore vuole distillare un'altra unità, chiude la chat corrente con consuntivo e ne apre una nuova.

2. **Tre passate sequenziali** (sentinella catalogo → carpentiere meccanico → co-autore consultivo). Mai saltare. La validazione autoriale fra una passata e la successiva è obbligatoria.

3. **Quote tracker globale** è un **vincolo duro** in passata 2: leggi sempre lo stato corrente del quote_tracker prima di proporre valori per i `null`. Mai violare unicità saga, distribuzioni minime/massime, anti-consecutività dichiarate.

4. **Misalignment rilevati** vanno annotati sempre nel rolling file, mai risolti in autonomia. La risoluzione è in passate dedicate dell'autore.

5. **Mai modificare lo schema** del grafo durante la distillazione. Se serve un nuovo campo, è una migrazione one-shot in Fase 02 (chat dedicata con `architetto_grafo`). La distillazione corrente si mette in pausa.

### Pattern operativo: chat dedicata Fase 03

L'orchestratrice apre una chat dedicata per ogni unità. Nella chat:

- è presente l'autore + il distillatore
- l'orchestratrice osserva, mantiene lo stato di progetto
- il catalogatore può essere chiamato per via indiretta (via `promotore_entita` per nuove entità)
- il critic_fisica_realismo può essere chiamato per validare valori proposti in passata 2 (sub-loop opzionale)

### Modalità mista chat aperta + YAML deterministico

Per progetti dove il livello micro è denso e fissato, il pattern è:

1. distillazione del livello medio (nodo unità + cast in scena + premise/problem/...) in chat aperta
2. compilazione del livello micro (scene/hook) via YAML deterministico (TEMPLATE_scene.yaml)
3. scrittura nel grafo via `write_node_to_graph.py` con i 16 controlli pre-scrittura

Per progetti meno densi: tutto in chat aperta.

### Cosa NON fare in questo overlay

- Non scrivere prosa finale durante la distillazione: la distillazione produce *fatti* della unità (referente di verità), non testo letterario. La prosa è Fase 06.
- Non popolare il quote_tracker manualmente: lo aggiorna lo script writer in modo idempotente.
- Non scrivere il grafo direttamente: solo via `write_node_to_graph.py`.

### Casi limite specifici Fase 03

- **Unità troppo lunga per una chat**: spezza in passate parziali (passata 0+1 in una chat, passata 2 in un'altra), MAI in unità multiple.
- **Autore non disponibile per validazione**: aspetta. Mai procedere senza validazione fra passate.
- **Schema rivela campo mancante durante distillazione**: pausa, rientra in Fase 02 con `architetto_grafo`, applica migrazione additiva, torna qui.

## Stato

🟡 Overlay scritto, da testare al primo progetto reale.
