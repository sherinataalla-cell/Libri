---
id: <id_snake_case>
name: <Nome Visualizzato>
famiglia: personaggio
sottotipo: <protagonisti | secondari | comparse | collettivi | ...>
tipo_grafo: <type dal grafo>
ruolo_saga: <role_saga dal grafo>
status: provvisorio
ultima_modifica: YYYY-MM-DD
fonti: ["<repo-progetto>/.../grafo.json#entities.characters.<id>"]
appare_in_storie: []
relazioni:
  dimora: <id_luogo|null>
  related_to: []
  cross_skill: {}
---


# <Nome Visualizzato>

> **Stato compilazione:** body provvisorio. Le sezioni in derivazione autoriale sono dichiarate in "Riferimenti puntuali".

## Identità (sintesi)

**Ruolo nel progetto:** <role_saga>.
**Tipo:** <type>.
**Categoria/sotto-categoria:** <sottotipo>.
**Dimora:** <id_luogo o "—">.

[1 paragrafo di sintesi: cosa coglie a colpo d'occhio chi lo incontra. 3-5 righe. Cita postura, tratto distintivo, firma sensoriale, modalità comportamentali se hanno aspetto esteriore.]

## Aspetto / forma

[Descrizione dettagliata. Travaso 1:1 dalla fonte canonica + derivazione autoriale dichiarata per dettagli mancanti. Per progetti illustrati: postura, statura, corporatura, tratti specie-specifici, occhi, mani/zampe, età narrativa. Per progetti audio: timbro vocale, ritmo, registro. Per progetti testuali puri: tratti che emergono nei dialoghi e nei gesti.]

## Abbigliamento / stato d'uso

**Firma esteriore (canone):** [travaso 1:1 da fonte]

**Varianti permesse:** [casi in cui la firma esteriore può variare]

**Vincoli stagionali / contestuali:** [se applicabili]

## Espressione / comportamento

[Tratti comportamentali esteriori, gesti tipici, modalità ricorrenti. Travaso 1:1 + derivazione autoriale.]

## Palette / atmosfera

[Per progetti illustrati: palette canonica del personaggio. Per audio: registro timbrico. Per testo: lessico e ritmo tipici del personaggio.]

## Contesto e ambientazioni ricorrenti

[Luoghi tipici dove appare. Cosa fa solitamente. Con chi è solitamente.]

## Coerenza cross-scena (cose che NON cambiano)

[Invarianti del personaggio. Es: ha sempre quella firma, ha sempre quella postura, ha sempre quel tono.]

## Variabilità ammessa

[Cosa può variare fra apparizioni. Es: posture diverse a seconda dell'attività, abiti diversi a seconda della stagione.]

## Cliché da evitare

[Pattern visivi/narrativi banditi per il personaggio. Per evitare deriva stilistica.]

## Voce e frasi codificate

**Registro:** <registro>

**Frasi-codice canoniche** (alterabili = mai, integrate dove indicato dal brief):

- «<frase canonica 1>»
- «<frase canonica 2>»
- ...

**Modalità di comunicazione:**
- [tratto 1]
- [tratto 2]

**Cosa NON dice mai:**
- [vincolo 1]
- [vincolo 2]

## Per stampa 3D / modello (se applicabile)

[Note su modello tridimensionale, se il progetto produce stampa 3D / modello.]

## Per narrativa e social

[Pattern di descrizione esterna. Vedi `descrizione_narrativa_social.md` se compilato.]

## Storie / scene di apparizione

[Lista derivata dal grafo. Aggiornata automaticamente da `build_catalog_index.py`.]

- <id-unità-1>: <ruolo nella unità>
- <id-unità-2>: <ruolo nella unità>
- ...

## Disallineamenti / domande aperte

_(eventuali incoerenze rilevate fra fonti, decisioni rimandate, dubbi autoriali)_

## Riferimenti puntuali (citazioni dirette dalle fonti)

- **Sezione "Aspetto / forma"**: travaso 1:1 da `<repo-progetto>/.../bibbia.md` §<X.Y>
- **Sezione "Voce e frasi codificate"**: travaso 1:1 da `<repo-progetto>/.../grafo.json#entities.characters.<id>.voice`
- **Sezione "Coerenza cross-scena"**: derivazione autoriale, basata su <fonti consultate>
- **Sezione "Cliché da evitare"**: derivazione autoriale, basata su `<repo-progetto>/.../pattern_ai_da_bandire.md` + specifiche del personaggio
- ...
