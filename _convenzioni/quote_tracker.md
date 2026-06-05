# Convenzione — Quote Tracker (vincoli quantitativi globali)

> Convenzione trasversale al kit: come si dichiarano e gestiscono i **vincoli quantitativi globali** del progetto — quelli che valgono attraverso tutte le unità narrative ("usato già qui, non riusare lì"; "max N volte saga"; "ogni gruppo deve apparire almeno M volte").

---

## §1. Cosa è il quote tracker

Il **quote tracker** è una struttura nel livello macro del grafo che traccia *contatori globali* del progetto:

- **unicità saga**: "questo elemento è usato una sola volta in tutto il progetto"
- **distribuzione minima**: "ogni elemento di questa categoria appare almeno N volte"
- **distribuzione massima**: "questo pattern stilistico appare al massimo M volte per evitare ripetitività"
- **anti-consecutività**: "questo elemento non può apparire in due unità di fila"
- **uso già consumato**: "questo nome / formula è già stato usato in queste unità"

Vive nel grafo come oggetto `quote_tracker` a livello macro:

```json
{
  "quote_tracker": {
    "<categoria_di_vincolo>": <struttura specifica>,
    ...
  }
}
```

Si aggiorna **automaticamente** quando una unità viene distillata (la skill distillatore incrementa i contatori), e si **legge** prima di proporre nuovi valori (la skill distillatore in passata 2 verifica i vincoli).

---

## §2. Categorie di vincoli (esempi tipici)

### §2.1 Lista di "elementi già usati" (anti-duplicazione)

```json
{
  "<elemento>_usato_per_unita": [
    { "unita": "<id-unita>", "elemento": "<valore>" }
  ]
}
```

Esempio: "questo specifico animale-archetipo è già stato usato in queste unità della saga, non riusarlo".

### §2.2 Conteggio per categoria (con max/min)

```json
{
  "<categoria>_count": {
    "<elemento>": <int>,
    "<elemento>": <int>
  }
}
```

Esempio: ogni gruppo del progetto ha un conteggio di apparizioni; la skill distillatore verifica che nessun gruppo superi il max o resti sotto il min.

### §2.3 Anti-consecutività

```json
{
  "ultimo_<categoria>_per_unita": {
    "<id-unita>": "<elemento>",
    "<id-unita-successiva>": "<elemento-diverso>"
  }
}
```

Esempio: "non lo stesso ruolo familiare episodico in due unità di fila".

### §2.4 Pattern unico saga

```json
{
  "patterns_unici_saga": [
    "<nome-pattern-1>",
    "<nome-pattern-2>"
  ]
}
```

Esempio: "questo specifico tipo di scena (es. 'rivelazione finale del titolo') può accadere una sola volta in tutto il progetto".

### §2.5 Vincoli compositi

I vincoli possono comporre più condizioni. Esempi (in pseudo-DSL):

- "Pattern A può accadere in al massimo 3 unità per ciclo"
- "Personaggio X può avere protagonismo solo in unità non consecutive"
- "Elemento Y appare obbligatoriamente in apertura del primo blocco e in chiusura dell'ultimo"

Questi sono vincoli specifici al progetto, vivono come campi del quote_tracker, e gli agenti li rispettano come **vincoli duri**.

---

## §3. Quando si dichiara il quote tracker

Il quote tracker si **dichiara in Fase 02** (congelamento schema), come parte delle 4 decisioni autoriali (vedi `_skills/architetto_grafo/SKILL.md` §3.1, Decisione 4).

L'autore (con assistenza dell'agente architetto_grafo) elenca:

- quali elementi del progetto richiedono unicità
- quali categorie richiedono distribuzione minima/massima
- quali pattern hanno vincoli di anti-consecutività
- quali pattern sono unici saga

Questi vincoli vengono codificati come campi del `quote_tracker` nello schema del grafo.

**Mai aggiungere vincoli quote tracker dopo il congelamento** — è una migrazione one-shot additiva (vedi `naming_e_versioning.md` §4 minor bump). Possibile, ma esplicita.

---

## §4. Come gli agenti lo usano

### §4.1 Skill distillatore (Passata 2 — co-autore consultivo)

Prima di proporre un valore per un campo `null` di un nodo unità:

1. legge `quote_tracker` corrente
2. verifica se la sua proposta viola vincoli duri:
   - "questo elemento è marcato unico saga e già usato? → non posso proporlo"
   - "questo gruppo è al max? → non posso proporlo"
   - "questo pattern è stato usato nella unità precedente? → non posso proporlo se vincolo anti-consecutività attivo"
3. se la proposta è OK, propone all'autore. Se non OK, segnala il vincolo e propone alternativa.

### §4.2 Script `write_node_to_graph.py`

Quando lo script writer scrive un nodo unità nel grafo:

1. **valida** il nodo contro il quote_tracker corrente (non viola vincoli duri)
2. **incrementa** il quote_tracker con i nuovi valori della unità
3. salva grafo + quote_tracker aggiornato

Idempotente: se la unità è riscritta (rilancio script), il quote_tracker viene **ricalcolato** dal contenuto del grafo, non incrementato due volte.

### §4.3 Script `audit/audit_2_schema.py` (uno dei 4 audit)

Audit posteriore: verifica che il quote_tracker sia **coerente** con lo stato del grafo (i contatori riflettono effettivamente cosa c'è nelle unità).

Se incoerente, segnala. Possibili cause: modifiche manuali al grafo che hanno bypassato gli script (errore operativo); migrazione mal eseguita.

---

## §5. Esempi di vincoli quantitativi tipici (da progetti reali)

Per dare concretezza al pattern, ecco esempi tipici di vincoli che sono stati usati in progetti reali (non da copiare, da capire come riferimento):

- "ogni nome di animale può essere usato come identificatore di un singolo individuo in al massimo 1 unità della saga" (vincolo unicità saga)
- "ogni gruppo professionale (camminanti, pastori, pescatori, mercanti, ecc.) deve apparire come cornice in almeno 2 unità diverse" (vincolo distribuzione minima)
- "lo stesso ruolo familiare episodico (madre / padre / nonno / zio) non può ripetersi in due unità consecutive" (anti-consecutività)
- "Pattern A (cose rotte arrivano lo stesso) può essere riconosciuto narrativamente al massimo in 4 unità su 12 della saga" (vincolo distribuzione massima)
- "scene notturne (ambientate dopo il tramonto) max 2 nella saga" (vincolo distribuzione massima)
- "la frase-firma del narratore può comparire una sola volta in tutta la saga, in posizione strategica" (vincolo unicità saga)

Ogni progetto ha i suoi. Il pattern è universale, gli esempi sono specifici.

---

## §6. Vincoli quantitativi NON globali (locali alla unità)

Non tutti i vincoli quantitativi sono globali. Alcuni sono **locali alla unità** (vivono nel nodo unità del grafo, non nel quote_tracker):

- "max 2 detti di Personaggio X in questa unità"
- "max 3 onomatopee firma in questa unità"
- "lunghezza target: 1500 parole ±15%"

Questi vincoli locali sono nel nodo unità (campi `personaggi_vincoli_attivi`, `onomatopee_firma`, `estimated_length` o nomi equivalenti scelti dal progetto). Non vanno nel quote_tracker.

Il **brieffer** li include nel brief della unità sotto la sezione "vincoli universali della scrittura". L'agente prosa li applica.

---

## §7. Casi limite

### §7.1 Aggiungere un vincolo quote dopo che molte unità sono già distillate

È una migrazione one-shot additiva. Procedura:

1. l'autore decide il nuovo vincolo
2. l'architetto_grafo aggiunge il campo al quote_tracker (schema bump minor)
3. uno script idempotente **ricalcola retroattivamente** il valore del campo dal contenuto del grafo (es. conta quante volte ciascun elemento è già stato usato, popola il contatore)
4. da quel momento i nuovi vincoli sono in vigore

Se il ricalcolo retroattivo rivela che vincoli sono già violati (es. "abbiamo usato 5 volte questo pattern, ma ora dichiariamo max 3"), l'autore deve decidere: rilassare il vincolo, oppure modificare le unità già distillate.

### §7.2 Vincoli che dipendono da fonti esterne al grafo

Esempio: "ogni unità deve avere palette coerente col quartiere geografico in cui è ambientata" — il vincolo dipende dal catalogo, non dal solo grafo.

Pattern: il vincolo si dichiara nel quote_tracker come *riferimento* al catalogo, e gli agenti che lo verificano leggono entrambe le fonti.

```json
{
  "vincoli_cross_fonte": [
    {
      "id": "palette_quartiere",
      "descrizione": "Palette unità coerente con catalogo del quartiere primario",
      "fonti_da_leggere": ["grafo:unita.<id>.palette_emotiva", "catalogo:luoghi/<id-quartiere>/scheda.md#palette"]
    }
  ]
}
```

L'agente distillatore (in passata 2) e gli audit (audit_2 schema, audit_3 navigability) verificano questi vincoli.
