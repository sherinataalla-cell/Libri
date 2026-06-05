# Convenzione — Marker machine-readable

> Convenzione trasversale al kit: come si marcano i punti del testo finale e delle schede catalogo per essere letti da script (compositore output, brieffer, audit).

---

## §1. Perché marker machine-readable

Il flusso del kit produce, alle ultime fasi, un **prodotto finale** (PDF, EPUB, HTML, fumetto, audio, sito) composto assemblando testo prosa + asset esterni (immagini, audio, layout). L'assemblaggio è **meccanico**: lo fa uno script (compositore output, Fase 07).

Perché lo script possa orientarsi nel testo prosa senza ambiguità — sapere dove inizia una scena, quale immagine va con quale blocco di testo, dove va una transizione di volume — il testo prosa è punteggiato da **marker machine-readable**: brevi commenti HTML/Markdown invisibili al lettore ma leggibili da script con regex stabile.

Lo stesso pattern serve a:
- gli **script di audit** per verificare coerenza fra testo finale e canone
- i **template di scheda** per dichiarare lo stato di compilazione delle sezioni (`_da popolare_`, `_(non trovato)_`)
- i **link inter-livello** (un marker scena nel testo che riferisce un nodo del grafo)

---

## §2. Il pattern a 2 livelli per il testo finale

Per opere illustrate, fumetto, impaginate (qualsiasi medium che ha *pagine-prodotto* fisiche distinte dalla *struttura narrativa*), serve un **doppio livello di marker**:

- **livello narrativo** (una scena / un hook / un beat narrativo): è la struttura *concettuale* del testo. Quante scene narrative ha l'unità? Tipicamente fissato dal brief
- **livello pagina-prodotto fisica** (una pagina di libro, una tavola di fumetto, una doppia pagina spread): è la struttura *materiale* del prodotto finale. Quante pagine fisiche ha l'unità? Dipende dal medium e dall'impaginazione

Una scena narrativa può corrispondere a *una* pagina-prodotto, oppure a *più* pagine-prodotto (perché va spalmata su una doppia pagina, perché serve più spazio, perché c'è un'illustrazione che la divide). Il pattern a 2 livelli rispecchia questa gerarchia.

Per opere senza distinzione narrativo/fisico (es. romanzo a flusso continuo), il livello narrativo basta.

### §2.1 Forma del marker (proposta canonica)

Marker **livello narrativo** (parent):

```
<!-- @scena <id-unità>_s<NN> | @posizione <NN> | @sub_pagine [<id-unità>_s<NN>a, <id-unità>_s<NN>b, ...] | @asset_principale TBD -->
```

| Campo | Significato | Esempio |
|---|---|---|
| `@scena` | id univoco della scena narrativa (formato: `<id-unità>_s<NN>`, NN zero-padded) | `cap03_s01` |
| `@posizione` | numero ordinale della scena nell'unità (1..N) | `1` |
| `@sub_pagine` | lista degli id pagine-prodotto fisiche associate a questa scena (vuota se 1:1) | `[cap03_s01a, cap03_s01b]` |
| `@asset_principale` | path dell'asset principale a livello scena (legacy / o `TBD` da popolare) | `TBD` |

Marker **livello pagina-prodotto fisica** (figli, uno per pagina):

```
<!-- @pagina <id-unità>_s<NN><x> | @numero_libro <K> | @asset <path> -->
```

| Campo | Significato | Esempio |
|---|---|---|
| `@pagina` | id sotto-pagina (formato: `<id-unità>_s<NN><x>`, x ∈ {a, b, c, ...}) | `cap03_s01b` |
| `@numero_libro` | numero pagina fisica (1..totale_pagine_libro). Per spread doppia: `[N, N+1]` | `5` |
| `@layout` (opz.) | `double_spread` per immagini che attraversano 2 pagine | — |
| `@asset` | path dell'asset finale (immagine, audio, ecc.). `TBD` finché non popolato | `assets/cap03/cap03_s01b.jpg` |

### §2.2 Personalizzazione per il progetto

I nomi `@scena`, `@pagina`, `@asset` sono il **default del kit**. Il progetto può rinominarli per riflettere il proprio dominio (es. fumetto: `@tavola`, `@pannello`; podcast: `@segmento`, `@traccia`). La forma generale è:

```
<!-- @<entità-livello-1> <id> | @<campi> ... | @<asset-pointer> <valore> -->
```

L'importante è che la convenzione sia **dichiarata nel progetto in un singolo posto** (tipicamente nel frontmatter dei file storia finale, sezione `schema_marker`) e gli script downstream la rispettino.

---

## §3. Il marker nel frontmatter di una unità narrativa finale

Ogni file di testo finale (`<id-unità>_<slug>.md`) ha un frontmatter YAML con metadati e dichiarazione esplicita dello schema marker:

```yaml
---
id_unita: <id-unità>
titolo: <Titolo Visualizzato>
slug: <slug-snake-case>
totale_scene: <N>
totale_pagine_prodotto: <K>
status: <bozza | revisione | definitiva>
ultima_modifica: YYYY-MM-DD
fonti:
  - <repo-progetto>/.../narrazione_fattuale/<id>.md
  - <repo-progetto>/.../briefs/<id>_brief.md
  - <repo-progetto>/.../grafo.json#unita.<id>
schema_marker: |
  Ogni '## Scena N' (N = numero scena, 1..totale_scene) è seguito da
  un commento HTML machine-readable:
  <!-- @scena <id-unità>_s<NN> | @posizione <NN> | @sub_pagine [...] | @asset_principale TBD -->
  Sotto a ogni @scena, uno o più marker @pagina precedono il blocco di prosa:
  <!-- @pagina <id-unità>_s<NN><x> | @numero_libro <K> | @asset <path o TBD> -->
---
```

Il blocco `schema_marker` è autodichiarativo: chi legge il file (script, agente IA, autore) sa interpretare i marker leggendo solo il file stesso.

---

## §4. Marker di stato sezione (per le schede catalogo)

Le schede del catalogo hanno sezioni che possono essere non ancora compilate. Per non lasciare sezioni "vuote silenziose", si usa un **marker uniforme di stato sezione**:

```markdown
## <Nome Sezione>

_da popolare_
```

oppure, per sezioni che lo script di build ha tentato di popolare ma non ha trovato fonte:

```markdown
## <Nome Sezione>

_(non trovato — fonte: <riferimento alla fonte attesa>)_
```

Lo script di build/audit del catalogo riconosce questi due marker come "sezione presente nello schema, contenuto non ancora popolato" — distinto da "sezione popolata vuota" (cosa che non dovrebbe mai accadere).

Variante alternativa (per progetti che preferiscono): commenti HTML invisibili al render Markdown:

```markdown
## <Nome Sezione>

<!-- _da popolare_ -->
```

Il progetto sceglie una delle due varianti e la dichiara in `<repo-progetto>/.../convenzioni_progetto.md`.

---

## §5. Marker di provvisorietà (per il grafo)

Durante la distillazione, alcuni campi di un nodo del grafo possono essere riempiti con valori *provvisori*: l'autore o l'agente ha proposto un valore, ma è soggetto a revisione.

Pattern: ogni valore provvisorio è accompagnato da un **grado di provvisorietà** in un campo gemello, oppure dichiarato nel rolling file `_provisional_state.json` del progetto.

Tre gradi standard (proposta del kit, il progetto può usarne meno):

- **A** — *nessun dato disponibile*: il campo è `null`, in attesa di decisione autoriale
- **B** — *dato derivato da inferenza*: l'agente ha proposto un valore basato su lettura coerente delle fonti, ma l'autore non l'ha ancora validato esplicitamente
- **C** — *dato proposto autorialmente ma marcato rifiutabile*: l'autore ha messo un valore "per ora", riservandosi di cambiarlo

Forma nel grafo (esempio):

```json
"campo_X": "valore_proposto",
"campo_X_provisional": "B"
```

Oppure in un rolling file separato:

```json
{
  "<id-nodo>": {
    "campo_X": { "value": "valore_proposto", "provisional": "B", "proposed_by": "<agente>", "proposed_at": "2026-05-07" }
  }
}
```

> **[da definire in Fase 01]** — la forma esatta dei marker di provvisorietà, e in particolare se il campo gemello `_provisional` vive nel grafo stesso o in un rolling file separato, dipende da decisioni che si prendono iterativamente in Fase 01 di ideazione e Fase 02 di congelamento schema. Il kit fornisce qui il pattern; il progetto ne decide la forma concreta.

---

## §6. Esempio di parsing Python

Pattern minimal per leggere i marker a 2 livelli da un file di testo finale:

```python
import re

SCENE_PATTERN = re.compile(
    r"<!--\s*@scena\s+(\S+)\s*\|"
    r"\s*@posizione\s+(\d+)\s*\|"
    r"\s*@sub_pagine\s+\[([^\]]*)\]\s*\|"
    r"\s*@asset_principale\s+(\S+)\s*-->"
)

PAGINA_PATTERN = re.compile(
    r"<!--\s*@pagina\s+(\S+)\s*\|"
    r"\s*@numero_libro\s+(\S+)\s*\|"
    r"\s*@asset\s+(\S+)\s*-->"
)

def parse_unita(path):
    text = open(path, encoding="utf-8").read()
    scene = []
    for match in SCENE_PATTERN.finditer(text):
        scena_id, posizione, sub_pagine_str, asset = match.groups()
        sub_pagine = [s.strip() for s in sub_pagine_str.split(",") if s.strip()]
        scene.append({
            "id": scena_id,
            "posizione": int(posizione),
            "sub_pagine": sub_pagine,
            "asset_principale": asset,
        })
    pagine = []
    for match in PAGINA_PATTERN.finditer(text):
        pagina_id, numero, asset = match.groups()
        pagine.append({"id": pagina_id, "numero_libro": numero, "asset": asset})
    return {"scene": scene, "pagine": pagine}
```

Il compositore output (Fase 07) usa questo parsing per assemblare il prodotto finale.

---

## §7. Vincoli sui marker

- **Mai modificare gli id** dei marker (`@scena`, `@pagina`) dopo che sono stati assegnati: gli script downstream li referenziano. Bump versione se proprio necessario.
- **`@asset` aggiornabile** da `TBD` al path reale quando l'asset è pronto (questo è il punto di sutura fra prosa e composizione output).
- **Naming pagine-prodotto deterministico**: `<id-unità>_s<NN><x>` con `x ∈ {a, b, c, ...}`. Mai numerazione ambigua.
- **Mai marker dentro il testo "letterario"** (visibili al lettore). Solo come commenti HTML/Markdown.
