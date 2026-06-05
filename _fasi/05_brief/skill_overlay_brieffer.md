# Skill overlay — brieffer (Fase 05)

> Layer 1 di specializzazione di fase per la skill `brieffer`. Si compone con il Layer 0 (`_skills/brieffer/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Specializza il brieffer per la Fase 05, sia nell'occasione di **bootstrap** (prima generazione) sia nelle occasioni di **rigenerazione incrementale** (dopo modifiche a una delle 4 fonti).

### Vincoli operativi specifici di Fase 05

1. **Mai partire senza test di accettazione passato**: prima della prima esecuzione `--all`, il builder deve aver passato il test di accettazione (diff vuoto vs reference autoriale). Vedi `_validazione/README.md`.

2. **Lo script è puramente meccanico**: il brieffer **non** scrive prosa, **non** arricchisce, **non** inferisce. Lancia lo script, verifica i log, segnala anomalie. Tipologia operativa primaria: **agente-script**.

3. **Mai patchare i brief a mano**: se un brief generato ha problemi, si correggono le fonti upstream o lo script, mai il brief.

4. **Idempotenza obbligatoria**: rilanciare lo script senza modifiche alle fonti deve produrre identico output. Se non è così, c'è un bug nello script (date, ordine non deterministico, ecc.) — segnala all'autore.

### Pattern operativo specifico

L'orchestratrice avvia il brieffer in una di queste 3 occasioni:

- **A — Bootstrap**: prima generazione di tutti i brief. Il brieffer:
  1. verifica che il test di accettazione sia passato
  2. lancia `build_brief.py --all`
  3. legge i log, segnala anomalie
  4. consegna l'esito all'orchestratrice

- **B — Rigenerazione mirata**: dopo modifica a una fonte, una unità nota è impattata. Il brieffer:
  1. lancia `build_brief.py --unit <id>`
  2. verifica output
  3. consegna esito

- **C — Rigenerazione completa**: dopo modifica strutturale (es. cambio carta voce). Il brieffer:
  1. lancia `build_brief.py --all`
  2. verifica output
  3. logga in `LOG_SINCRONIZZAZIONE.md` con motivazione del rerun
  4. segnala all'autore se serve rivedere unità già scritte

### Casi tipici di anomalie da segnalare

- **Scheda catalogo parzialmente popolata**: avviso non-bloccante. Brief generato con fallback. Segnala all'autore: "scheda <id> ha sezioni `_da popolare_`, considera di completarla".
- **Narrazione fattuale mancante**: errore bloccante. Brief non generato. Segnala all'autore: "manca <repo-progetto>/.../narrazione_fattuale/<id>.md, non posso generare".
- **Campo grafo mancante**: errore bloccante. Segnala all'autore con il nome del campo e il tipo di errore (KeyError o equivalente).
- **Brief generato ma fuori range parole atteso**: avviso non-bloccante. Segnala "brief <id> ha N parole, range tipico 5k-30k. Verifica completezza".

### Cosa NON fare in questo overlay

- Non aprire chat per consigliare all'autore "magari aggiungerei questa frase nel brief": il brief è composto meccanicamente, non personalizzato.
- Non chiamare LLM, mai. Lo script è 100% meccanico.
- Non patchare i brief a mano, mai. Se manca qualcosa, è upstream.
- Non saltare i log: ogni esecuzione genera log che vanno letti e verificati.

## Stato

🟡 Overlay scritto, da testare al primo progetto reale.
