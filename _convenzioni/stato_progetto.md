# Convenzione — Stato del progetto

> Convenzione trasversale al kit: come si traccia lo stato corrente di un progetto attraverso le fasi, le sessioni, i passaggi di mano fra agenti.

---

## §1. Tre file di stato

Il progetto mantiene uno **stato consultabile** in tre file canonici, in radice della repo del progetto:

### `STATO_PROGETTO.md`

**Snapshot operativo cumulativo**. È il file che chiunque (autore, agente IA, orchestratrice) legge **per primo** per capire dove siamo.

Contiene:

- **fase corrente** (delle 7 fasi della pipeline) e suo stato (in corso / completata / bloccata)
- **ultimo snapshot di sessione** (data, cosa è stato fatto, cosa resta)
- **tabella di stato per artefatto** (es. quali unità sono state distillate, quante schede catalogo sono canoniche, quanti brief sono generati)
- **eventuali blocchi attivi** (decisioni autoriali in attesa, misalignment non risolti)

Pattern di scrittura: ogni sessione importante aggiunge una sezione datata in cima al file. Le sezioni vecchie restano sotto come storico.

### `LOG_SINCRONIZZAZIONE.md`

**Log dei cambiamenti che impattano altre repo o sistemi esterni**. Es. modifiche allo schema del grafo che richiedono rigenerazione brief; pulizie di canone (trasferimenti di autorità) che richiedono propagazione; migrazioni one-shot.

Contiene una entry per ogni cambiamento significativo, con:

- data
- cosa è cambiato
- impatto downstream (cosa va rigenerato, cosa va aggiornato)
- chi ha fatto il cambiamento (autore, quale agente IA)

Pattern di scrittura: append-only, mai si rimuovono entry vecchie. È la traccia storica dei cambiamenti strutturali.

### `INDICE_FASI.md`

**Mappa storicizzata delle fasi** del progetto, con riferimenti puntuali. Più maturo del progetto, più cresce.

Contiene:

- per ogni fase pipeline (01..07), elenco delle sotto-fasi/passi attraversati con date
- decisioni autoriali consolidate per fase
- output prodotti per fase (con path)
- eventuali pattern emergenti dal progetto specifico (es. "in questo progetto distilliamo prima in chat e poi formalizziamo via YAML, abbiamo provato il contrario e non funzionava")

Pattern di scrittura: documento vivo, riorganizzato man mano che il progetto matura. Diversamente dal log, può essere ristrutturato.

---

## §2. Misalignment tracking

Durante la distillazione, la compilazione catalogo, e altre operazioni di riempimento, gli agenti IA possono rilevare **incoerenze fra le fonti** del progetto (catalogo / grafo / bibbia / ...). 

**L'agente non risolve.** Segnala in un rolling file canonico:

```
<repo-progetto>/.../misalignments.json
```

Schema del file (proposta):

```json
{
  "open": [
    {
      "id": "mis_001",
      "rilevato_il": "2026-05-07",
      "rilevato_da": "<agente o autore>",
      "fonti_coinvolte": ["catalogo:<famiglia>/<id>", "bibbia:§<X.Y>", "grafo:<path-nodo>"],
      "descrizione": "Il personaggio X ha età 'giovane' nel catalogo ma 'anziano' in bibbia §4.2",
      "proposta_risoluzione": "decisione autoriale richiesta",
      "stato": "aperto"
    }
  ],
  "resolved": [
    {
      "id": "mis_000",
      "rilevato_il": "2026-04-15",
      "risolto_il": "2026-04-20",
      "risolto_da": "<autore>",
      "decisione": "Vince catalogo. Bibbia da aggiornare al prossimo bump."
    }
  ]
}
```

I misalignment **risolti** restano nel file (mai cancellati): sono trail di audit delle decisioni autoriali storiche.

Le risoluzioni autoriali si applicano in **passate dedicate**, mai in mezzo ad altre operazioni. L'autore decide, applica, marca risolto.

---

## §3. Rolling files di stato di lavoro

Per fasi che producono molto stato intermedio (es. distillazione di una saga lunga, compilazione bulk del catalogo), si usano **rolling files**: file JSON o YAML che si aggiornano a ogni passo, mai cancellati.

Esempi:

- `<repo-progetto>/.../_provisional_state.json` — stato dei valori provvisori non ancora confermati dall'autore (vedi `marker_machine_readable.md` §5)
- `<repo-progetto>/.../_promotion_queue.json` — coda di entità in attesa di promozione dal catalogatore al grafo
- `<repo-progetto>/.../_audit_state.json` — risultati degli ultimi audit grafo (4 audit, vedi `_scripts/audit/`)

I rolling files non sono "stato finale": sono **stato di lavoro**. Vengono letti dagli agenti per capire da dove riprendere, scritti per registrare progresso. Sono in `.gitignore` se contengono dati transitori (decisione del progetto), oppure committati se servono come trail (es. `_audit_state.json` committato per tracciabilità).

---

## §4. Lo stato fra sessioni

Quando una sessione di lavoro chiude (o si interrompe), lo **stato deve essere consistente**:

- ogni script idempotente è terminato con esito noto (success / fail / noop)
- ogni agente in chat ha consegnato un consuntivo
- l'orchestratrice ha aggiornato `STATO_PROGETTO.md` con cosa è stato fatto, cosa resta
- eventuali rolling files sono stati salvati

Quando una nuova sessione inizia, l'orchestratrice (o l'autore manualmente):

1. legge `STATO_PROGETTO.md` per situarsi
2. legge `LOG_SINCRONIZZAZIONE.md` per vedere ultimi cambiamenti strutturali
3. legge `misalignments.json` per vedere issue aperte
4. legge eventuali rolling files della fase corrente
5. **decide il prossimo passo** in base allo stato

Pattern di "ripartenza pulita di una sessione": non c'è magia. Bastano i tre file canonici + il rolling file della fase, e una sessione si riavvia in 5-10 minuti.

---

## §5. Stato vs canone

Lo **stato** è transitorio: cambia ogni sessione. Si versiona ma è ok che cambi.

Il **canone** (grafo, catalogo, bibbia, carta voce, pattern AI) è meno transitorio: cambia su decisione autoriale esplicita, con bump versione.

Mai confondere i due: una modifica di stato (es. "ho avanzato la distillazione di s05") non richiede bump del canone; una modifica al canone (es. "ho aggiunto un campo allo schema del grafo") richiede bump esplicito + log sincronizzazione.

---

## §6. Pattern di "pacchetto autoriale consegnato"

Caso ricorrente: l'autore prepara fuori sessione un **pacchetto** di documenti (decisioni autoriali strutturate, nuovi schemi, nuove convenzioni) da integrare in una passata operativa.

Pattern del pacchetto:

```
<repo-progetto>/_pacchetti_consegnati/<nome-pacchetto>/
├── README.md                  cosa contiene il pacchetto, cosa va integrato
├── DOC_1_<scope>.md           documento autoriale 1
├── DOC_2_<scope>.md           documento autoriale 2
└── ...
```

Quando l'autore consegna il pacchetto, l'agente IA (o orchestratrice):

1. legge il pacchetto, conferma di aver capito
2. integra: scrive script idempotenti che applicano il pacchetto al canone (con backup canonico, dry-run, apply)
3. esegue gli script step-by-step con validazione autoriale
4. al termine, **archivia il pacchetto** nello stesso posto (resta come trail) e aggiorna `LOG_SINCRONIZZAZIONE.md` con un'entry

Il pacchetto archiviato non si tocca più: è documento storico autoriale.

Esempio reale di pattern: in un progetto di riferimento, l'autore ha consegnato il pacchetto "cornice del mondo" come 6 documenti autoriali; gli script di integrazione hanno scritto 7 step idempotenti applicati al grafo + catalogo, ognuno con backup canonico esplicito. Il pacchetto resta archiviato come trail del passaggio.
