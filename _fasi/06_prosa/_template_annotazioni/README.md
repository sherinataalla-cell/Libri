# `_template_annotazioni/` — Annotazioni autoriali post-prosa

> Pattern del file YAML che dichiara, scena per scena, **ground truth post-scrittura**: chi è effettivamente in scena, quale luogo è qualified come, quali oggetti sono presenti, quali frasi-codice sono state integrate. Sovrascrive il NER fuzzy nei tool di audit downstream.

---

## §1. Perché esistono le annotazioni

Il testo finale prodotto dall'agente prosa è **prosa letteraria**: contiene riferimenti a personaggi, luoghi, oggetti in forma naturale ("la volpe rossa", "la casa accanto al pozzo", "il libro spezzato"). Per i tool downstream (audit drift, build inventario, compositore output), riconoscere automaticamente che "la volpe rossa" è il personaggio `fiamma` (o equivalente) richiederebbe NER fuzzy che ha errori.

Il pattern del kit risolve così: l'autore (eventualmente assistito dall'agente prosa) dichiara esplicitamente in un file YAML cosa c'è scena per scena. Il file è **ground truth canonica post-scrittura**: i tool si fidano di esso, non del NER.

## §2. Forma del file

Esempio canonico (`<repo-progetto>/.../testi_finali/_annotations/<id-unità>.yaml`):

```yaml
unita_id: "<id-unita>"
versione: 1
ultima_modifica: YYYY-MM-DD
schema_annotazioni_version: "1.0"

scene:
  - scena_id: "<id-unita>_s01"
    pagine_prodotto: ["<id-unita>_s01a", "<id-unita>_s01b"]
    location:
      id: "<id_luogo>"
      qualifier: "interno"          # esterno | interno | cortile | null
    cast_presente:
      - id: "<id_personaggio_1>"
        modalita_attiva: null       # se personaggio multi-modale, dichiara modalità
        ruolo_in_scena: "primario"  # primario | secondario | sfondo
      - id: "<id_personaggio_2>"
        modalita_attiva: null
        ruolo_in_scena: "primario"
    oggetti_presenti:
      - id: "<id_oggetto>"
        stato: null                 # se oggetto multi-stato, dichiara stato
    frasi_codice_integrate:
      - personaggio: "<id_personaggio>"
        frase: "<la frase canonica>"
        position_in_text: 142        # offset nel testo finale (carattere)
    callback_chiamati:
      - "<id-callback>"
    seeds_piantati: []
    seeds_blooming: []
    seeds_maturing: []
    note_autoriali: null

  - scena_id: "<id-unita>_s02"
    # ...
```

## §3. Quando si compila

Dopo la scrittura completa della unità, prima del commit del testo finale. Pattern:

1. l'autore (o l'agente prosa) compila il file YAML scena per scena
2. lo script `build_inventory.py` legge il YAML + il testo finale e produce l'inventario testuale per QA
3. lo script `audit_4_drift.py` confronta annotazioni vs grafo per rilevare drift

## §4. Cosa c'è e cosa NON c'è

Le annotazioni dichiarano **fatti ground truth**:

- ✅ chi è in scena (id stabili)
- ✅ qualifier dei luoghi (per luoghi multi-blocco)
- ✅ modalità attive (per personaggi multi-modali)
- ✅ stato (per oggetti multi-stato)
- ✅ ruolo in scena (primario / secondario / sfondo)
- ✅ frasi-codice integrate, con offset nel testo finale
- ✅ callback / seeds chiamati o piantati o sviluppati

Le annotazioni **non** dichiarano:

- ❌ qualità della prosa (è del lettore)
- ❌ atmosfera percepita (è del lettore)
- ❌ stile (è dell'autore, già nel testo)
- ❌ pattern AI banditi (sono nel testo, vanno verificati con audit)

## §5. Vincoli

- **Tutti gli id devono esistere nel grafo** (livello macro, entità promosse). Se l'autore cita un'entità nuova nelle annotazioni, è un'**emersione canonica post-scrittura**: va promossa via `promotore_entita`, poi annotazioni aggiornate.
- **Posizione testuale (`position_in_text`) opzionale ma consigliata**: serve agli script per validare che la frase-codice è effettivamente lì.
- **Annotazioni sempre in italiano** (lingua del progetto), salvo metadati come `qualifier: "interno"` che vivono nel namespace tecnico.

## §6. Quando aggiornare le annotazioni

- ad ogni revisione del testo finale (le posizioni testuali potrebbero shiftare)
- quando emerge una entità nuova nelle annotazioni
- quando si scopre un'imprecisione (es. "ho scritto fratello primario quando volevo fratello sfondo")

Le annotazioni sono **versionate via Git** insieme al testo finale: ogni commit del testo dovrebbe accompagnare un commit delle annotazioni se i fatti dichiarati sono cambiati.

## §7. Esempio applicativo

In un progetto reale ha senso tenere annotazioni per:

- audit drift automatici (catch regressioni canonical/voce dopo revisioni)
- compositore output (sa quale immagine canonica del personaggio applicare a quale scena, con la giusta modalità)
- generazione automatica di indici e crediti ("appare in scena: <lista>", "frasi-firma di <personaggio>: <lista>")
- preparazione materiale promozionale ("frase di apertura più potente", "scena emblematica della unità")

Sono lo strato **ground truth** che il sistema agentico si aspetta.
