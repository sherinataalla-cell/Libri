# Skill overlay — architetto_grafo (Fase 02)

> Layer 1 di specializzazione di fase per la skill `architetto_grafo`. Si compone con il Layer 0 (`_skills/architetto_grafo/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Questo overlay specializza l'architetto_grafo per il momento esatto in cui opera in Fase 02 (congelamento iniziale dello schema), distinto da quando opera per migrazioni one-shot successive.

### Vincoli specifici di Fase 02

1. **Mai partire senza i documenti-anima** della Fase 01. Se mancano, fermati e segnala. Documenti minimi:
   - bibbia / canone-mondo
   - archi globali
   - glossario-consegna
   - carta voce + pattern AI da bandire

2. **Le 4 decisioni autoriali sono sequenziali e accumulative**: non saltare alla Decisione 2 se la 1 non è chiara. Ogni decisione si basa sulle precedenti.

3. **Documento `decisioni_schema_grafo.md` obbligatorio** prima di scrivere lo schema concreto. Le decisioni devono essere scritte e validate dall'autore *esplicitamente* prima di essere applicate.

4. **Bootstrap del grafo iniziale via script**, mai a mano. Lo script `bootstrap_graph.py` legge il glossario-consegna + lo schema specializzato e genera il grafo iniziale. Niente popolamento manuale del grafo iniziale.

5. **Backup canonico iniziale** obbligatorio prima di chiudere la fase: `<file-grafo>.pre_distillazione_iniziale.backup.json`.

### Pattern operativo: chat dedicata Fase 02

L'orchestratrice apre una chat dedicata per la Fase 02. La chat:

- è chiusa, focalizzata, una sola decisione alla volta
- l'autore è presente e valida ogni decisione
- nessun altro agente partecipa (catalogatore, distillatore, prosa: tutti silenti)
- alla chiusura, l'orchestratrice riceve i 5 output (schema, grafo iniziale, decisioni doc, backup, schede embrionali) e aggiorna lo stato di progetto

### Casi di "Fase 02 e 03 collassano"

Vedi `PIPELINE.md` §6. Pattern frequente: la prima unità si distilla in chat **prima** del congelamento ufficiale, e il congelamento avviene quando *sia* lo schema *sia* la prima unità sono validi.

In questo caso l'architetto_grafo:

1. produce uno schema "candidato" + bootstrap grafo iniziale
2. cede la chat al distillatore per la prima unità
3. rientra se durante la distillazione emerge un campo mancante (migrazione additiva on-the-fly)
4. al termine della prima unità validata, finalizza schema + grafo iniziale + backup canonico

Questo è atteso e previsto. Non un'eccezione.

### Cosa NON fare in questo overlay

- Non specializzare lo schema basandoti su "intuizioni" sul progetto: tutto deve venire dai documenti-anima o dall'autore.
- Non aggiungere campi al template del kit per "dare ricchezza": la ricchezza è sufficiente. Aggiungi solo dove le 4 decisioni lo richiedono.
- Non popolare il livello medio (unità narrative) in Fase 02. Il livello medio è compito della Fase 03.

## Stato

🟡 Overlay scritto, da testare al primo progetto reale che adotterà il kit.
