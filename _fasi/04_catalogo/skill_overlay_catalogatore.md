# Skill overlay — catalogatore (Fase 04)

> Layer 1 di specializzazione di fase per la skill `catalogatore`. Si compone con il Layer 0 (`_skills/catalogatore/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Specializza il catalogatore per la Fase 04, sia nella modalità *bulk iniziale* (compilazione massiva post-Fase 02) sia nella modalità *iterativa* (arricchimento di schede embrionali emerse durante la Fase 03).

### Vincoli operativi specifici di Fase 04

1. **Mai partire senza i documenti di canone trasversale** del progetto (in `<repo-progetto>/.../canone_trasversale/`). Se non esistono ancora, il primo passo della Fase 04 è la loro creazione.

2. **Validazione del template prima dello scaling**: per ogni nuova categoria tematica (personaggi / luoghi / oggetti / specifiche al progetto), il catalogatore valida il template su **2 esempi sufficientemente diversi** prima di scalare a tutto il catalogo. Esempi tipici di criterio:
   - per personaggi: 2 specie/tipi diversi, per scoprire vincoli di template che emergono solo con varietà
   - per luoghi: 2 tipi diversi (es. uno semplice + uno multi-blocco)
   - per oggetti: 2 tipi diversi (es. uno semplice + uno con stati nel tempo)

3. **Bulk iniziale** (vedi `PATTERN_BULK_INIZIALE.md`): script idempotente di travaso meccanico da fonte canonica originaria → schede catalogo. Mai invenzioni, solo travaso.

4. **Trasferimento di autorità** (vedi `PATTERN_BULK_INIZIALE.md` §3): operazione una-tantum, autoriale, esplicita. Quando l'autore decide, il layer travasato viene rimosso dalla fonte originaria, e il catalogo diventa autoritativo. Tracciato in `LOG_SINCRONIZZAZIONE.md`.

5. **Loop chiuso con `critic_fisica_realismo`**: ogni scheda passa per validazione critic prima di essere consegnata. Modalità *agente-a-agente* gestita dall'orchestratrice.

### Pattern operativo specifico Fase 04

L'orchestratrice apre **una sessione di lavoro batch**, non chat dedicata:

- modalità **agente-script** (per il bulk iniziale): lo script `compile_catalog_from_source.py` lavora su tutte le entità, il catalogatore supervisiona e gestisce le decisioni che emergono
- modalità **agente-a-agente** (per arricchimenti successivi e validazione): catalogatore in loop con critic per ogni scheda

Pattern misto frequente:

1. Bulk iniziale via script
2. Catalogatore + critic in loop chiuso per le schede da arricchire (sezioni `_da popolare_` rimaste dopo il bulk)
3. Approvazione autoriale per il passaggio `provvisorio` → `canonico`
4. Eventualmente, asset di output (prompt + generazione esterna)
5. Eventualmente, descrizione narrativa-social

### Nuove entità promosse dalla Fase 03

Quando la Fase 03 (distillazione) promuove una nuova entità via `promotore_entita`, il catalogatore riceve una **scheda embrionale** da arricchire. Pattern:

1. il distillatore segnala "nuova entità promossa: <id>"
2. l'orchestratrice schedula il catalogatore per arricchimento
3. il catalogatore arricchisce la scheda con dati derivabili dalla fonte canonica + dalla narrazione fattuale della unità di emersione (se utile)
4. loop con critic
5. la scheda passa in `provvisorio` (canonizzazione successiva, dopo eventuale finalizzazione asset)

### Cosa NON fare in questo overlay

- Non saltare il critic per "fretta" del bulk iniziale: anche le schede bulk passano per validazione, almeno nelle prime 2 esemplari di ogni categoria.
- Non canonizzare schede senza autorizzazione autoriale esplicita.
- Non modificare schede `canonico` senza bump versione.

## Stato

🟡 Overlay scritto, da testare al primo progetto reale.
