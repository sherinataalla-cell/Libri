# `_template_inventario/` — Inventario testuale per QA

> Pattern del file Markdown derivato dal testo finale + annotazioni: **inventario** di entità citate, scene composte, callback chiamati, seeds toccati, ecc. Usato per audit drift e validazione coerenza testo finale ↔ catalogo ↔ grafo.

---

## §1. Cosa è

L'inventario è un file `<id-unità>_inventory.md` generato dallo script `build_inventory.py` (o equivalente nel progetto), che legge:

- il testo finale `<id-unità>_<slug>.md`
- le annotazioni `<id-unità>.yaml`
- il grafo (per validare che gli id citati esistano)
- il catalogo (per arricchire i dati di ogni entità citata)

Output: un Markdown leggibile dall'autore + parsable dagli script di audit.

---

## §2. Sezioni canoniche dell'inventario

```markdown
# Inventario — <id-unita> ("<titolo>")

Generato il: YYYY-MM-DD da build_inventory.py v1.0
Fonti lette:
- testi_finali/<id-unita>_<slug>.md
- testi_finali/_annotations/<id-unita>.yaml
- grafo.json (commit <sha>)
- catalogo/ (commit <sha>)

## A — Cast presente nella unità

- **<id_personaggio_1>** (<Nome Visualizzato>)
  - presente in scene: <lista id-scena>
  - ruolo cumulativo: <primario | secondario | misto>
  - frasi-codice integrate: <N>/<atteso N>
  - modalità attive osservate: <lista>
  - eventuali drift: <lista>

- **<id_personaggio_2>** ...

## B — Luoghi visitati

- **<id_luogo_1>** (<Nome>)
  - scene: <lista id-scena> con qualifier <esterno/interno/cortile>
  - eventuali drift: <lista>

## C — Oggetti citati

- **<id_oggetto_1>** (<Nome>)
  - scene: <lista id-scena>
  - stato osservato: <stato>

## D — Relazioni narrative attivate

### Callback chiamati
- **<id_callback>** in scena <id-scena>: <descrizione dal grafo>

### Seeds toccati
- **<id_seed>**:
  - **piantato in**: scena <id-scena>
  - **florisce in**: scena <id-scena> [se applicabile]
  - **matura in**: scena <id-scena> [se applicabile]

### Debts
- **<id_debt>**: aperto/chiuso in scena <id-scena>: <descrizione>

## E — Frasi-codice integrate

| Personaggio | Frase | Posizione | Conformità |
|---|---|---|---|
| <id> | «<frase>» | offset N | ✅ identica al canone | / ⚠️ alterata (drift) |

## F — Onomatopee firma

| Personaggio / sorgente | Onomatopea | Frequenza | Atteso |
|---|---|---|---|
| <id> | «<onomatopea>» | <N> | <atteso N>/scena |

## G — Coerenza catalogo

| Entità | Scheda | Drift rilevati |
|---|---|---|
| <id> | <path-scheda> | nessuno / <descrizione drift> |

## H — Quote tracker (per QA globale)

Stato dopo questa unità:

- **<vincolo>**: <stato precedente> → <stato post-unità>

## Riassunto (sintesi automatica)

- Scene composte: <N>
- Pagine-prodotto: <K>
- Cast totale: <N>
- Luoghi visitati: <N>
- Frasi-codice integrate: <N>/<atteso N>
- Drift rilevati: <N> (vedi sezione G)
- Quote saturate da questa unità: <lista>
- Quote ancora disponibili saga: <lista breve>
```

## §3. Quando si genera

L'inventario si rigenera ogni volta che cambia:

- il testo finale di una unità (nuova revisione)
- le annotazioni
- il grafo (perché è la fonte canonica di seeds/callbacks/etc.)
- il catalogo (perché alimenta il "drift rilevati" se le schede sono cambiate)

Pattern: lo script `build_inventory.py` viene rilanciato `--all` periodicamente, o `--unit <id>` mirato.

## §4. Cosa NON è l'inventario

- **Non è il testo finale**: non sostituisce la prosa, è un derivato
- **Non è la valutazione narrativa**: non dice "questa unità è bella" o "ha buon ritmo", quello è giudizio dell'autore o del lettore
- **Non è una fonte canonica**: è derivato da fonti canoniche (testo + annotazioni + grafo + catalogo)

## §5. Uso pratico per l'autore

L'inventario è **leggibile in 2 minuti** e dice all'autore:

- ho integrato tutte le frasi-codice attese? (sezione E)
- ho rispettato i vincoli quote tracker globali? (sezione H)
- ci sono drift catalogo? (sezione G)
- la unità ha il numero giusto di scene/pagine? (riassunto)
- ho chiamato i callback / piantato i seeds attesi? (sezione D)

È uno strumento di **autovalidazione veloce** per l'autore prima di chiudere la unità come "finale".

## §6. Uso pratico per gli audit downstream

Lo script `audit_4_drift.py` legge l'inventario e:

- confronta cast inventario vs cast atteso dal grafo (drift = personaggio nel grafo, assente nel testo, o viceversa)
- confronta frasi-codice inventario vs canone delle voci nel grafo (drift = frase alterata)
- confronta seeds piantati inventario vs grafo (drift = seed atteso non piantato, o seed piantato fuori previsione)

Output: report che l'autore decide caso per caso (drift canonico → aggiornare grafo; drift errore → correggere testo).
