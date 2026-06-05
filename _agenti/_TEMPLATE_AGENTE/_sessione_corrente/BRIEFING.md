# Briefing sessione — `<nome agente>`

> **Questo file è un template.** Scritto dall'orchestratrice (manualmente o via tool MCP `prepare_agent_session`) prima del lancio dell'agente. Le 6 sezioni sotto sono **tutte obbligatorie**: l'agente al boot rifiuta sessioni con briefing incompleto.

**Sessione preparata da:** orchestratrice
**Data preparazione:** `<ISO datetime>`
**Stato:** `<bozza | pronta per lancio>`

---

## 1. Obiettivo della sessione

`<Cosa deve fare l'agente in questa sessione, in 2-5 frasi. Specifico, misurabile, chiuso.>`

`<Esempio "tipo": "Distillare la unità narrativa cap03 dal materiale grezzo a YAML deterministico per il livello medio (unita) e micro (scene). Output atteso: 1 file YAML con livello medio + 1 file YAML con livello micro per le scene 1-4. Senza arricchimento del catalogo. Senza promozione di entità nuove.">`

## 2. Contesto rilevante

`<Frammenti di stato del progetto che l'agente deve conoscere — non più di 1-2 paragrafi. Più contesto = più rumore. Includi solo ciò che cambia il modo in cui l'agente lavora su questa sessione specifica.>`

`<Esempio: "Il progetto è alla Fase 03, prima distillazione. Il grafo macro è stato bootstrappato 3 giorni fa. Il glossario di consegna ha 47 entità. Per cap03 c'è già una narrazione fattuale grezza in input. Vincolo autoriale per questa unità: 4 scene, location primaria 'cucina_invernale'.">`

## 3. Input forniti

I seguenti file sono in `INPUT/` di questa sessione:

- `<nome_file_1>` — `<descrizione di cosa è e perché serve all'agente>`
- `<nome_file_2>` — `<...>`

Riferimenti canonici (path assoluti, **non duplicati in INPUT/**):

- Grafo: `<path al story_graph.json>`
- Schema: `<path al grafo_schema.json>`
- `<altri file canonici rilevanti per la sessione>`

## 4. Output attesi

Al termine, l'agente deve produrre in `OUTPUT/`:

- `<nome_file_1>.<ext>` — `<forma e contenuto attesi. Specificare: schema da rispettare, lunghezza, sezioni obbligatorie, campi richiesti.>`
- `<nome_file_2>.<ext>` — `<...>`

File opzionali (scrivere solo se applicabili):
- `proposte_orchestratrice.md` — proposte di promozione/modifica del canone, NON integrabili dall'agente stesso.
- `note_sessione.md` — eventuali note libere per l'orchestratrice.

## 5. Vincoli e regole specifiche di questa sessione

`<Regole che valgono SOLO per questa sessione e si aggiungono — non sostituiscono — alla skill base dell'agente. Esempi:>`

- `<"Lavorare solo sulle scene 1-4. La scena 5 è ancora in discussione, NON distillarla.">`
- `<"Non promuovere entità nuove: se l'utente propone qualcosa di nuovo, registrarlo in proposte_orchestratrice.md.">`
- `<"Massimo 3 passate sull'intera unità. Se al termine della 3a non c'è validazione completa dell'utente, chiudere partial.">`
- `<"Frasi-codice del personaggio X (definite in scheda catalogo) sono inalterabili: usarle letterali se l'agente vuole inserirle.">`

## 6. Fine sessione

L'agente termina la sessione scrivendo:

1. Tutti i file richiesti in §4 dentro `OUTPUT/`
2. Una riga finale in `_log_sessione.md` con `[STATUS: completed | partial | aborted]` e un consuntivo di 3-5 righe.

L'utente può poi tornare nella chat orchestratrice e dire "ho finito con `<nome agente>`".

L'orchestratrice integrerà l'output nel canone (eventualmente via tool MCP), poi archivierà la sessione in `../_sessioni_archivio/<timestamp>_<descrizione>/`.

---

**Checklist di pronto-lancio per l'orchestratrice:**

- [ ] §1 obiettivo chiaro, misurabile, chiuso
- [ ] §2 contesto stretto, niente verbosità
- [ ] §3 input presenti in `INPUT/` (verificato `ls`)
- [ ] §4 output dichiarati con forma precisa (schema/lunghezza/sezioni)
- [ ] §5 vincoli specifici alla sessione, non duplicati dalla skill base
- [ ] `_log_sessione.md` inizializzato con entry `[SETUP]`
- [ ] Stato di questo file aggiornato a "pronta per lancio"

Solo se tutti spuntati: passare la sessione all'utente.
