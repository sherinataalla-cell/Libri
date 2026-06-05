# `_template_yaml_unita/` — Format YAML deterministico per unità

Quando il livello micro di una unità è denso (molte scene/hook con molti campi) e fissato, conviene non distillare in chat aperta ma usare un **formato YAML deterministico**: l'autore o il distillatore in chat compila il YAML, lo script `write_node_to_graph.py` lo valida con N controlli e lo scrive nel grafo.

## File

| File | Cosa è |
|---|---|
| `TEMPLATE_unita.yaml` | template YAML per il livello medio (nodo unità + sotto-cast + attributi globali della unità) |
| `TEMPLATE_scene.yaml` | template YAML per il livello micro (scene/hook che compongono la unità) |

## Quando usare il YAML deterministico vs distillare in chat aperta

| Situazione | Modalità consigliata |
|---|---|
| Prima unità del progetto, schema in via di stabilizzazione | chat aperta (Fase 02 + Fase 03 collassano) |
| Unità "esplorativa" con molti `null` da proporre | chat aperta (con passata 2 in cui l'agente propone) |
| Unità con livello micro denso (es. 10+ scene fissate) | YAML deterministico |
| Batch di unità da distillare in successione | YAML deterministico |
| Canone editoriale fisso del livello micro (es. esattamente N hook per unità) | YAML deterministico |

## Pattern misto

Spesso un progetto vive entrambe le modalità in fasi diverse:

1. Le prime 2-3 unità si distillano in chat aperta, mentre lo schema si stabilizza
2. Una volta che il canone editoriale del livello micro è chiaro, le successive unità si distillano via YAML deterministico (più veloce, più riproducibile)

## Controlli pre-scrittura tipici (16 per riferimento)

Lo script writer (`_scripts/write_node_to_graph.py`) tipicamente esegue ~16 controlli prima di scrivere nel grafo. Esempi:

1. tutti i campi obbligatori dello schema sono presenti
2. id univoci nella unità (no scene con id duplicati)
3. id riferimenti (entità, luoghi, oggetti) esistono nel grafo a livello macro
4. numero scene rispetta il canone editoriale del progetto (se dichiarato)
5. tipi di scena rispettano la tassonomia del progetto
6. focal_action segue le convenzioni linguistiche dichiarate (es. presente indicativo, max N parole)
7. quote_tracker non viene violato dalla scrittura
8. seeds piantati / che fioriscono / che maturano sono coerenti con global_relations
9. callbacks_in puntano a callback esistenti
10. ...

I controlli specifici dipendono dal progetto. Il pattern è universale: validazione pre-scrittura come gate.

## Stato

🟡 In via di stesura. I template `TEMPLATE_unita.yaml` e `TEMPLATE_scene.yaml` sono il prossimo step di completamento del kit (forma dipende dalle decisioni autoriali specifiche del progetto, vedi `../PIPELINE.md` §4).
