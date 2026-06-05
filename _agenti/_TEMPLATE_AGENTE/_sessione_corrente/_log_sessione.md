# Log sessione — `<nome agente>`

> File **append-only**: si aggiungono entry, mai si rimuovono. Sia l'orchestratrice (in fase di SETUP) sia l'agente (durante e a fine sessione) ci scrivono. Trail completo della sessione, ispezionabile per audit e ripresa.

Formato canonico di ogni entry:

```
---
**[<ISO datetime>] [<chi>] [<categoria>]**

<contenuto in linguaggio naturale, 1-N paragrafi>
```

**Categorie ammesse:**
- `[SETUP]` — solo orchestratrice, alla preparazione
- `[BOOT]` — solo agente, alla prima azione
- `[DECISION]` — agente, scelte motivate (con o senza utente)
- `[QUESTION]` — agente, domanda all'utente con cui si ferma
- `[OUTPUT]` — agente, scrittura di un file in OUTPUT/
- `[WARNING]` — agente, problema non bloccante
- `[ERROR]` — agente, errore bloccante
- `[STATUS: completed | partial | aborted]` — **unica entry conclusiva**, alla fine della sessione

L'orchestratrice considera la sessione chiusa solo quando trova esattamente **una** entry `[STATUS: ...]` come ultima riga del log.

---
**[<ISO datetime di preparazione>] [orchestratrice] [SETUP]**

Sessione preparata per agente `<nome>`. Obiettivo: `<sintesi obiettivo>`.
Vedi `BRIEFING.md` per il dettaglio completo. Input forniti in `INPUT/`.
Output attesi dichiarati in BRIEFING §4.

L'agente può lanciarsi quando l'utente apre Claude Code in
`_agenti/<nome>/`.
