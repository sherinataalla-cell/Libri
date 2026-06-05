# Esempi — Formato blocco-unità con marker e note tecniche

> Esempi del formato del file di testo finale prodotto dall'agente prosa: frontmatter + header sezione narrativa + marker scena + marker pagina-prodotto + prosa.

---

## §1. Forma canonica del file

```markdown
---
id_unita: <id-unita>
titolo: <Titolo Visualizzato>
slug: <slug>
totale_scene: <N>
totale_pagine_prodotto: <K>
status: bozza | revisione | definitiva
ultima_modifica: YYYY-MM-DD
fonti:
  - <repo-progetto>/.../narrazione_fattuale/<id>.md
  - <repo-progetto>/.../briefs/<id>_brief.md
  - <repo-progetto>/.../grafo.json#unita.<id>
schema_marker: |
  Ogni '## Scena N' è seguito da:
  <!-- @scena <id-unita>_s<NN> | @posizione <NN> | @sub_pagine [...] | @asset_principale TBD -->
  Sotto a ogni @scena, uno o più marker @pagina precedono il blocco di prosa:
  <!-- @pagina <id-unita>_s<NN><x> | @numero_libro <K> | @asset <path o TBD> -->
---


# <Titolo Visualizzato>

## Scena 1

<!-- @scena <id-unita>_s01 | @posizione 1 | @sub_pagine [<id-unita>_s01a, <id-unita>_s01b] | @asset_principale TBD -->

<!-- @pagina <id-unita>_s01a | @numero_libro 5 | @asset TBD -->

[testo letterario per la pagina-prodotto 5]

<!-- @pagina <id-unita>_s01b | @numero_libro 6 | @layout double_spread | @asset TBD -->

[testo letterario per la pagina-prodotto 6]

## Scena 2

<!-- @scena <id-unita>_s02 | @posizione 2 | @sub_pagine [<id-unita>_s02a] | @asset_principale TBD -->

<!-- @pagina <id-unita>_s02a | @numero_libro 7 | @asset TBD -->

[testo letterario per la pagina-prodotto 7]

[... etc per tutte le scene]
```

## §2. Esempio compilato

Per dare concretezza, vedi un esempio fittizio:

```markdown
---
id_unita: cap03
titolo: La Visita Inattesa
slug: la_visita_inattesa
totale_scene: 8
totale_pagine_prodotto: 12
status: bozza
ultima_modifica: 2026-05-07
fonti:
  - testi_progetto/narrazione_fattuale/cap03.md
  - testi_progetto/briefs/cap03_brief.md
  - testi_progetto/grafo.json#unita.cap03
schema_marker: |
  ...
---


# La Visita Inattesa

## Scena 1

<!-- @scena cap03_s01 | @posizione 1 | @sub_pagine [cap03_s01a, cap03_s01b] | @asset_principale TBD -->

<!-- @pagina cap03_s01a | @numero_libro 5 | @asset TBD -->

[testo letterario della pagina 5...]

<!-- @pagina cap03_s01b | @numero_libro 6 | @layout double_spread | @asset TBD -->

[testo letterario della pagina 6 in spread...]

## Scena 2

<!-- @scena cap03_s02 | @posizione 2 | @sub_pagine [cap03_s02a] | @asset_principale TBD -->

<!-- @pagina cap03_s02a | @numero_libro 7 | @asset TBD -->

[testo letterario della pagina 7...]

[... etc fino a Scena 8]
```

## §3. Vincoli sul formato

- **Marker scena prima della prosa di scena**: il marker `@scena` apre la sezione, il marker `@pagina` precede ogni blocco di prosa
- **Mai marker dentro il testo letterario**: solo come commenti HTML/Markdown (invisibili al rendering)
- **Naming pagine deterministico**: `<id-unita>_s<NN><x>` con `x ∈ {a, b, c, ...}`
- **`@asset` può essere TBD** finché l'asset non è pronto (legacy compatibilità) o il path reale
- **`@layout double_spread`** opzionale, per pagine in doppia pagina
- **Mai due marker `@pagina` consecutivi senza prosa fra loro**: ogni marker pagina apre un blocco di prosa, anche minimal

## §4. Cosa NON deve esserci nel testo finale

- **Nessuna prosa "fattuale"** stile narrazione fattuale del brief: il testo finale è prosa letteraria, voce autoriale piena.
- **Nessuna spiegazione meta** del tipo "in questa scena vediamo...".
- **Nessun preambolo, epigrafe, dedica** che non sia previsto dal progetto.
- **Nessuna nota tecnica nel testo finale**: le note tecniche dell'agente prosa stanno **fuori** dal file canonico, nelle annotazioni o nei consuntivi di chat.
- **Nessun italics gratuito**: italics solo per pensieri interni (se la convenzione del progetto lo prevede), o per termini tecnici dichiarati. Mai per "enfasi stilistica".
- **Nessuna onomatopea stilizzata**: le onomatopee sono parte del mondo (vedi convenzione progetto), non emfasi grafiche.

## §5. Esempio di blocco-unità prodotto durante la chat (intermedio)

Durante la chat, l'agente prosa produce blocchi-unità con note tecniche separate. Esempio:

```markdown
### Pagina 5 — cap03_s01a

[testo letterario della pagina 5]

---
*Note tecniche (3-5 punti):*
- frasi-codice integrate: «<frase canonica 1>» (in posizione 142)
- vincoli applicati: max 2 detti del personaggio_X rispettato (in scena 2)
- pattern locale "cornice di striscio C1" applicato: la guardia notturna passa sullo sfondo, non viene nominata
- punto di incertezza: il timing del tramonto può confliggere con la condizione meteo dichiarata? Verificare con autore
```

Le note tecniche **non vanno nel file canonico finale**: sono comunicazione operativa fra agente prosa e autore durante la chat. Il file canonico finale ha solo il testo letterario + i marker.

## §6. Pattern di assemblaggio del file canonico

Quando tutte le pagine-prodotto sono state scritte e validate, il file canonico è assemblato (manualmente o via script):

1. frontmatter compilato dai metadati della unità
2. titolo come `# `
3. per ogni scena della unità:
   - header `## Scena N`
   - marker `@scena`
   - per ogni pagina-prodotto della scena:
     - marker `@pagina`
     - testo letterario della pagina
4. salvato in `<repo-progetto>/.../testi_finali/<id-unita>_<slug>.md`

Lo script `audit_4_drift.py` (o equivalente) può validare la struttura del file canonico (presenza di marker, ordine, naming) prima di accettarlo come "definitivo".
