---
id: <id_snake_case>
name: <Nome Visualizzato>
famiglia: luogo
sottotipo: <quartiere | landmark | sentiero | annesso | ...>
tipo_grafo: <type dal grafo>
ruolo_saga: <role_saga dal grafo>
status: provvisorio
ultima_modifica: YYYY-MM-DD
fonti: ["<repo-progetto>/.../grafo.json#entities.locations.<id>"]
appare_in_storie: []
geographical:
  quartiere: <id_quartiere|null>
  coordinates: []
  geojson_feature_id: null
ha_esterno: true
ha_interno: false
ha_cortile_o_annessi: false
relazioni:
  contiene: []
  contenuto_in: <id_luogo|null>
  related_to: []
---


# <Nome Visualizzato>

> **Stato compilazione:** body provvisorio. Le sezioni in derivazione autoriale sono dichiarate in "Riferimenti puntuali".

## Identità (sintesi)

**Ruolo nel progetto:** <role_saga>.
**Tipo:** <type>.
**Quartiere / area:** <quartiere o "—">.

[1 paragrafo di sintesi: cosa coglie a colpo d'occhio chi arriva. 3-5 righe. Cita scala, materiale dominante, atmosfera tipica.]

## Aspetto / forma — geografia generale

[Descrizione fisica generale: dove si trova nel mondo del progetto, come è raggiungibile, cosa lo circonda, scala e proporzioni rispetto al resto. Travaso 1:1 da fonte + derivazione autoriale.]

## Espressione / comportamento (dinamica del luogo)

[Come "vive" il luogo: chi lo frequenta, ritmi tipici (mattino/sera/stagione), suoni/odori/luce ricorrenti, eventuali fenomeni dinamici (es. luce filtrata, vento dominante).]

## Palette e atmosfera

[Palette canonica del luogo. Atmosfera tipica. Per progetti illustrati: palette specifica con riferimento al canone trasversale. Per audio: ambiente sonoro. Per testo: vocabolario di descrizione tipico.]

## Contesto e ambientazioni ricorrenti

[Tipiche scene/situazioni che si svolgono qui. Quali personaggi lo frequentano abitualmente.]

## Coerenza cross-scena (cose che NON cambiano)

[Invarianti del luogo: sempre quella scala, sempre quel materiale dominante, sempre quella luce caratteristica.]

## Variabilità ammessa

[Cosa può variare fra apparizioni: stagioni, ore del giorno, presenza/assenza di personaggi, eventi atmosferici.]

## Cliché da evitare

[Pattern visivi/narrativi banditi per il luogo.]

## ⭐ Descrizione visiva canonica per generazione — ESTERNO

[Blocco da copia-incollare nel prompt asset quando una scena è ambientata all'**esterno** del luogo. Include: scala, prospettiva canonica, materiali, luce, vegetazione/arredo urbano se applicabile.]

```
[Testo del blocco esterno, da incollare in prompt asset.
Esempio per progetto illustrato:
"<descrizione esterno: vista canonica, materiali, luce, scala>"]
```

## ⭐ Descrizione visiva canonica per generazione — INTERNO (solo se `ha_interno: true`)

[Blocco da copia-incollare nel prompt asset quando una scena è ambientata all'**interno** del luogo. Include: ambiente, mobili, atmosfera, luce.]

```
[Testo del blocco interno, da incollare in prompt asset]
```

## ⭐ Descrizione visiva canonica per generazione — CORTILE / ANNESSI (solo se `ha_cortile_o_annessi: true`)

[Blocco da copia-incollare nel prompt asset quando una scena è ambientata in un **cortile o annesso** del luogo.]

```
[Testo del blocco cortile/annessi, da incollare in prompt asset]
```

## Per stampa 3D / modello (se applicabile)

[Note su modello tridimensionale del luogo, se il progetto produce 3D.]

## Per narrativa e social

[Pattern di descrizione esterna. Vedi `descrizione_narrativa_social.md` se compilato.]

## Storie / scene di apparizione

[Lista derivata dal grafo. Aggiornata automaticamente da `build_catalog_index.py`.]

- <id-unità>: scena <id-scena>, qualifier `<esterno | interno | cortile>`
- ...

## Disallineamenti / domande aperte

_(eventuali incoerenze rilevate fra fonti, decisioni rimandate, dubbi autoriali)_

## Riferimenti puntuali (citazioni dirette dalle fonti)

- **Sezione "Aspetto / forma"**: travaso 1:1 da `<repo-progetto>/.../bibbia.md` §<X.Y>
- **Sezione "Geografia"**: derivazione da `<repo-progetto>/.../cartografia/` e GeoJSON feature `<id>`
- **Blocco ESTERNO**: derivazione autoriale, basata su <fonti consultate>
- **Blocco INTERNO**: travaso 1:1 da `<fonte>` se presente, altrimenti derivazione autoriale
- ...
