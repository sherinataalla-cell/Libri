# Pattern — Bulk iniziale e trasferimento di autorità

> Pattern operativo per la **prima compilazione** del catalogo: bulk meccanico di travaso da fonte canonica originaria, eventualmente seguito da trasferimento di autorità (svuotamento del layer dalla fonte originaria).

---

## §1. La situazione iniziale

Quando il catalogo non esiste ancora (post-Fase 02), le sue entità sono **embrionali**: hanno solo frontmatter machine-readable, body con marker `_da popolare_`. La fonte canonica originaria del progetto (tipicamente la bibbia / canone-mondo) contiene i dati ricchi delle entità: descrizioni, comportamenti, vincoli, ricorrenze.

Il catalogo deve essere popolato. Due strade:

- **manualmente, una scheda alla volta**: lento, soggetto a errori di trascrizione, non scala
- **bulk meccanico**: uno script idempotente legge la fonte canonica e popola le sezioni delle schede 1:1, travasando dove i campi combaciano

Il pattern del kit è il **bulk meccanico**.

## §2. Il pattern bulk

### Lo script di travaso

Si scrive uno script idempotente (`compile_catalog_from_source.py` o equivalente nel progetto, vedi `_scripts/compile_catalog_from_graph.py` come riferimento) che:

1. Legge la fonte canonica originaria (bibbia, JSON di canone, glossario-consegna esteso, ...)
2. Per ogni entità promossa al grafo a livello macro, identifica le sezioni della fonte che corrispondono ai campi della scheda
3. Travasa il contenuto **1:1** nella sezione corrispondente della scheda
4. Lascia `_da popolare_` per le sezioni dove la fonte non copre

**Nessuna inferenza, nessun arricchimento, nessuna proposta autoriale.** Solo travaso.

### Idempotenza

Lo script è idempotente. Rilanciato:

- non duplica contenuto già travasato
- aggiorna le schede dove la fonte è cambiata
- preserva il body modificato manualmente sotto i marker (vedi convenzione di body preservation negli script del kit)

### Output del bulk

Tutte le schede del catalogo passano da "embrionali" a "popolate da bulk":

- frontmatter completo (era già)
- body con sezioni travasate dalla fonte canonica
- sezioni rimaste `_da popolare_` per dati non disponibili nella fonte

Le schede passano in **status `provvisorio`**: pronte per arricchimento successivo (catalogatore + critic in loop chiuso) o per canonizzazione diretta se l'autore le approva così.

## §3. Il trasferimento di autorità (dopo il bulk)

Decisione autoriale **una-tantum, esplicita** che può seguire il bulk.

### Il problema

Dopo il bulk, lo stesso dato vive in **due posti**: nella fonte canonica originaria *e* nella scheda del catalogo. Questo viola la regola di non-duplicazione (vedi `_convenzioni/architettura_informativa.md` §2).

Soluzioni possibili:

- **mantenere la duplicazione** (catalogo vista derivata, fonte canonica autoritativa): rilanciando il bulk in caso di drift. Funziona ma richiede disciplina di non modificare il catalogo a mano.

- **trasferire l'autorità**: rimuovere il layer travasato dalla fonte canonica, dichiarare il catalogo autoritativo per quel layer da quel momento.

### Quando si fa il trasferimento

L'autore decide quando, e per quali layer specifici. Esempi tipici:

- "il visivo dei personaggi vive solo nel catalogo da ora in poi; la bibbia non lo contiene più"
- "le palette dei luoghi vivono solo nel catalogo; la bibbia parla solo di geografia narrativa"
- "i comportamenti esteriori dei gruppi vivono solo nel catalogo; la bibbia parla solo del loro ruolo nella saga"

### Come si fa

1. **decisione autoriale esplicita**, segnata in `<repo-progetto>/.../LOG_SINCRONIZZAZIONE.md` con data e motivazione
2. **bump versione bibbia / fonte canonica** (pre / post pulizia)
3. **script di pulizia** della fonte canonica (idempotente, rimuove le sezioni travasate, preserva il resto)
4. **dichiarazione esplicita** in `<repo-progetto>/.../convenzioni_progetto.md`: "da `<data>`, il visivo dei personaggi è autoritativo nel catalogo, non più nella bibbia"

### Vincoli post-trasferimento

Dopo il trasferimento:

- gli agenti IA **non leggono più** la fonte canonica per quel layer (lo sanno dalla convenzione di progetto)
- nuovi dati di quel layer vanno **solo** nel catalogo
- mai propagati indietro nella fonte canonica originaria

## §4. Casi specifici

### §4.1 Bulk parziale

L'autore può scegliere di fare bulk solo per *alcune* sezioni (es. "Aspetto / forma" e "Palette" sì, "Cliché da evitare" no). Lo script accetta un flag `--sezioni`:

```bash
python3 _scripts/compile_catalog_from_source.py --sezioni aspetto,palette --apply
```

Le altre sezioni restano `_da popolare_` e vengono compilate in altre passate (catalogatore in loop con critic, o autore manualmente).

### §4.2 Bulk con sovrascrittura selettiva

L'autore può voler *aggiornare* dati già travasati perché la fonte è cambiata. Lo script lo fa, ma **chiede conferma** prima di sovrascrivere body modificati manualmente sotto i marker:

```
Scheda <id>: la sezione "Aspetto / forma" ha modifiche manuali rispetto al bulk precedente.
Sovrascrivere con la nuova versione dalla fonte? (y/n/diff)
```

L'autore decide caso per caso.

### §4.3 Trasferimento di autorità parziale

L'autore può trasferire l'autorità **solo per alcune entità** (es. "trasferimento solo per i personaggi principali, i secondari restano nella bibbia"). Pattern raro ma supportato dalla convenzione:

```markdown
# In convenzioni_progetto.md:
## Autorità per layer

| Layer | Categoria | Autoritativo in |
|---|---|---|
| visivo | personaggi.principali | catalogo (dal 2026-04-15) |
| visivo | personaggi.secondari | bibbia |
| visivo | luoghi | catalogo (dal 2026-04-29) |
```

Gli agenti leggono questa tabella per sapere dove trovare il dato autoritativo per ogni combinazione layer + categoria.

## §5. Stato del bulk in `STATO_PROGETTO.md`

Lo stato del bulk va tracciato:

```markdown
## Stato bulk catalogo (data: 2026-05-07)

- Travaso meccanico: completato per tutte le 116 entità
- Sezioni travasate: aspetto, abbigliamento, espressione, palette, contesto
- Sezioni non travasate (manuale o da popolare): cliché da evitare, riferimenti puntuali
- Trasferimento autorità: avvenuto per layer "visivo" (data: 2026-04-15). Bibbia non contiene più visivo.
- Status entità: 23 canoniche, 93 provvisorie
```

Questo è il riferimento per chi entra nel progetto dopo: capisce cosa è stato fatto, quale autorità vive dove.
