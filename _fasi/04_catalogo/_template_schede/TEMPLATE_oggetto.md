---
id: <id_snake_case>
name: <Nome Visualizzato>
famiglia: oggetto
sottotipo: <utensili | arredi | indumenti | strumenti | artefatti | ...>
tipo_grafo: <type dal grafo>
ruolo_saga: <role_saga dal grafo>
status: provvisorio
ultima_modifica: YYYY-MM-DD
fonti: ["<repo-progetto>/.../grafo.json#entities.objects.<id>"]
appare_in_storie: []
ha_stati_nel_tempo: false
relazioni:
  appartiene_a: <id_personaggio|null>
  collocato_in: <id_luogo|null>
  related_to: []
---


# <Nome Visualizzato>

> **Stato compilazione:** body provvisorio. Le sezioni in derivazione autoriale sono dichiarate in "Riferimenti puntuali".

## Identità (sintesi)

**Ruolo nel progetto:** <role_saga>.
**Tipo:** <type>.
**Possessore / collocazione:** <id_personaggio o id_luogo o "—">.

[1 paragrafo di sintesi: cosa coglie a colpo d'occhio chi lo incontra. 3-5 righe. Cita materiale, scala, dettaglio distintivo.]

## Aspetto / forma

[Descrizione fisica dettagliata. Travaso 1:1 + derivazione autoriale dichiarata. Materiali, dimensioni, lavorazione, dettagli specifici.]

## Stato d'uso / firma

**Firma esteriore (canone):** [travaso 1:1 da fonte]

**Variabilità di stato:** [se applicabile, vedi sezione "Stati nel tempo"]

## Espressione / comportamento (se applicabile)

[Per oggetti animati o significativi narrativamente: come si manifesta, suoni associati, dinamiche.]

## Palette e atmosfera

[Palette canonica dell'oggetto. Per illustrato: colori dominanti. Per audio: timbri associati. Per testo: lessico tipico di descrizione.]

## Contesto e ambientazioni ricorrenti

[Dove tipicamente appare. Con chi tipicamente associato. In che situazioni si manifesta.]

## Coerenza cross-scena (cose che NON cambiano)

[Invarianti dell'oggetto. Materiale, forma base, dettaglio distintivo.]

## Variabilità ammessa

[Cosa può variare fra apparizioni: stato d'uso (nuovo / usato / consunto), illuminazione, contesto.]

## Cliché da evitare

[Pattern visivi/narrativi banditi.]

## Stati nel tempo (se `ha_stati_nel_tempo: true`)

L'oggetto evolve attraverso il progetto. Blocchi descrittivi distinti per ogni stato:

### Stato 1 — <nome stato> (es. "nuovo / appena creato")

[Descrizione visiva + comportamentale + atmosferica per questo stato.]

### Stato 2 — <nome stato> (es. "usato / patinato dal tempo")

[Idem]

### Stato 3 — <nome stato> (es. "spezzato / perso / archiviato")

[Idem]

Il grafo registra lo stato dell'oggetto per ogni unità in cui appare. Il prompt asset usa il blocco corrispondente allo stato della unità corrente.

## Per stampa 3D / modello (se applicabile)

[Note su modello tridimensionale dell'oggetto.]

## Per narrativa e social

[Pattern di descrizione esterna. Vedi `descrizione_narrativa_social.md` se compilato.]

## Storie / scene di apparizione

[Lista derivata dal grafo. Aggiornata automaticamente da `build_catalog_index.py`.]

- <id-unità>: stato `<nome stato>`, scena <id-scena>
- ...

## Disallineamenti / domande aperte

_(eventuali incoerenze rilevate fra fonti, decisioni rimandate, dubbi autoriali)_

## Riferimenti puntuali (citazioni dirette dalle fonti)

- **Sezione "Aspetto / forma"**: travaso 1:1 da `<repo-progetto>/.../bibbia.md` §<X.Y>
- **Sezione "Stati nel tempo"**: derivazione autoriale, basata su <fonti consultate>
- ...
