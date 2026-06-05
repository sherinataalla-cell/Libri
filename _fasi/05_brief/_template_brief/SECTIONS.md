# Template Brief — Inventario delle sezioni canoniche

> Catalogo delle sezioni che compongono un writing brief autosufficiente. Il progetto reale specializza questo elenco al proprio dominio in `<repo-progetto>/.../template_brief/SECTIONS.md`.

---

## Principio

Un brief è **autosufficiente**: l'agente prosa scrive l'unità leggendo solo il brief, senza consultare altre fonti. Per essere autosufficiente, il brief deve contenere tutte le sezioni necessarie a:

- identificare la unità (chi, cosa, dove)
- conoscere il referente di verità dei fatti (la narrazione fattuale)
- conoscere il livello micro (scene/hook/pagine)
- conoscere il cast in scena (voci, vincoli, frasi codificate, canone visivo se applicabile)
- conoscere le convenzioni del mondo applicabili
- conoscere le relazioni narrative (callback, seeds, debts)
- conoscere i vincoli universali (carta voce + pattern AI da bandire)
- conoscere lo stato del quote tracker globale (cosa è già stato consumato altrove)
- ricevere l'istruzione operativa di scrittura

Il brief tipicamente è 5-30k parole (non scala col testo finale, scala con la complessità della unità).

---

## Sezioni canoniche del kit

### 1 — Frontmatter machine-readable

YAML in testa al file. Metadati operativi della unità.

```yaml
---
unita_id: <id-unità>
titolo: <Titolo>
slug: <slug>
posizione: <N>
registro: <registro>
lunghezza_target: <parole o equivalente>
ambient_conditions:
  season: ...
  time_of_day: ...
  weather: ...
status_brief: <bozza | validato>
generato_il: YYYY-MM-DD
schema_brief_version: 1.0
fonti_lette:
  - <repo-progetto>/.../grafo.json (commit <sha>)
  - <repo-progetto>/.../narrazione_fattuale/<id>.md
  - <repo-progetto>/.../catalogo/<famiglia>/<id-entità>/scheda.md
  - <repo-progetto>/.../bibbia.md
  - <repo-progetto>/.../carta_voce.md
  - <repo-progetto>/.../pattern_ai_da_bandire.md
---
```

### 2 — Core narrativo

Premessa / problema / soglia / risoluzione della unità. Sintesi (4-8 righe per ognuno) derivata dal nodo unità del grafo.

### 3 — Narrazione fattuale (integrale)

Il **referente di verità** dei fatti della unità. Travaso 1:1 dal file `<repo-progetto>/.../narrazione_fattuale/<id>.md`. Italiano referente, presente indicativo, neutro. **Non è prosa finale** ma contratto fattuale: "queste cose accadono in questa unità, in questo ordine, con queste persone".

### 4 — Inventario scene/hook/pagine

Livello micro del grafo, una entry per ogni scena. Per ognuna:

- id scena
- posizione
- tipo / categoria (se progetto ne ha)
- moment temporale
- location (con qualifier per luoghi multi-blocco)
- cast presente
- focal action (italiano presente indicativo, breve)
- atmosfera + palette
- onomatopee firma se previste
- composition_zone / panel_layout / audio_duration_seconds (specifico medium)

### 5 — Cast in scena (voci, vincoli, frasi codificate, canone visivo)

Per ogni personaggio/entità nel cast della unità:

- identità (id, nome, ruolo nella unità, modalità attiva se applicabile)
- voce (registro, frasi-codice da integrare letterali, modalità di comunicazione)
- vincoli locali alla unità (max detti, max onomatopee firma, ecc.)
- canone visivo (sezione travasata dalla scheda catalogo, blocco corretto se entità multi-blocco)
- cosa NON dice/fa il personaggio in questa unità (vincoli espliciti)

### 6 — Convenzioni del mondo applicabili a questa unità

Cornici, sentieri, saluti, formule rituali, elementi atmosferici ricorrenti del progetto **applicabili a questa unità**. Sfondo silenzioso, mai trama. Pattern di apparizione: "naturale come fatto del mondo, mai spiegato al lettore".

### 7 — Relazioni narrative

Per ognuna:

- **callback aperti rilevanti**: cosa di unità precedenti viene richiamato qui (id, descrizione, contesto)
- **seeds piantati / che fioriscono / che maturano qui**: id, descrizione, attesa
- **debts aperti / chiusi qui**: id, descrizione, status

### 8 — Vincoli universali (carta voce + pattern AI da bandire integrale)

Travaso 1:1:

- **Carta voce** del progetto (integrale)
- **Pattern AI da bandire** del progetto (integrale)

Questi due blocchi non sono mai abbreviati o riassunti. Vanno per intero perché l'agente prosa li applica letteralmente.

### 9 — Quote tracker awareness

Stato dei vincoli quantitativi globali rilevanti per questa unità. Pattern: "cosa è già stato consumato in altre unità, cosa è quindi *non disponibile* per questa unità". Esempio:

```
Vincoli quote tracker per <id-unità>:
- Pattern A: usato 3/4 saga (quota residua: 1)
- Gruppo X: già visto in [<id-unità-precedente>] (anti-consecutività attiva)
- Pattern unico saga "<nome>": già consumato in <id-unità-precedente>, non riutilizzabile
```

### 10 — Istruzione operativa all'agente prosa

In coda al brief, istruzione finale:

- modalità di scrittura (collaborativa, una scena alla volta, blocchi-unità con note tecniche)
- formato dei blocchi-unità
- lunghezza target ±15%
- come fermarsi e attendere validazione
- come segnalare problemi (incoerenze, dubbi, lunghezze fuori target)

---

## Sezioni opzionali (specifiche al progetto)

Il progetto può aggiungere sezioni specifiche al proprio dominio:

- **Sezione "Strato adulto / sotto-tema"** per progetti con reading multi-livello
- **Sezione "Riferimenti audio"** per progetti audio
- **Sezione "Layout pannelli previsti"** per progetti fumetto
- **Sezione "Note di ricerca / contesto storico"** per progetti che hanno background di ricerca
- ...

Le sezioni opzionali si dichiarano nel `SECTIONS.md` del progetto reale.

---

## Vincoli sulla forma del brief

- **Italiano** (lingua del progetto)
- **Markdown puro**, no HTML salvo commenti machine-readable se necessari
- **Sezioni con header `##`** numerati 1, 2, 3, ... in ordine canonico
- **Sotto-sezioni con header `###`** dove serve (es. una entry per ogni scena nell'inventario)
- **Frontmatter YAML** in testa, sempre presente
- **Mai prosa "letteraria" nel brief**: il brief è documento operativo, non un esempio di prosa finale
