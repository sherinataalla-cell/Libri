# `INPUT/` — File in lettura per l'agente

Questa cartella contiene i file che l'agente legge durante la sessione. È popolata dall'orchestratrice **prima** del lancio.

## Cosa va dentro

**File transitori specifici della sessione**:
- output di una sessione precedente che servono come input qui
- draft autoriali (testi grezzi, materiali da consegna)
- sub-frammenti del canone selezionati per questa sessione

**Cosa NON va dentro:**
- file canonici del progetto (grafo, schede catalogo, brief). Quelli sono referenziati per **path assoluto** nel `BRIEFING.md` §3, non duplicati. L'agente li legge dal canonico.

## Convenzioni

- Naming descrittivo, snake_case, italiano: `unita_da_distillare.yaml`, `narrazione_grezza_cap03.md`, `voce_da_analizzare_1.md`
- Niente versioning nel nome (la versione è la sessione stessa)
- Niente timestamp nel nome (l'archivio passa per la cartella della sessione, non per i nomi)

## Lifecycle

I file qui dentro vengono archiviati insieme alla sessione quando l'orchestratrice chiude (in `../_sessioni_archivio/<timestamp>_<descrizione>/INPUT/`). Sono parte del trail di audit.
