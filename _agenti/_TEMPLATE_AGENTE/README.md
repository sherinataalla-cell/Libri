# Agente: `<nome>` — README per l'utente

> **Questo file è il primo che l'utente legge** quando entra nella cartella di un agente foreground. Spiega in poche righe cosa fa l'agente e come si lancia. Va riscritto per ogni agente specifico, sostituendo le parti tra `<...>`.

---

## Cosa fa questo agente

`<nome>` è un agente foreground specializzato per `<descrizione del suo lavoro in 1-2 frasi>`. Si attiva quando `<la fase del progetto / il momento in cui serve>`.

A differenza dell'orchestratrice (che gestisce il flusso generale del progetto), questo agente lavora **una cosa per volta**, in chat dedicata, con il proprio contesto pulito.

## Quando lanciarlo

Lo lanci **solo dopo che l'orchestratrice ti dice di farlo**. L'orchestratrice ha preparato per te tutto il necessario nella cartella `_sessione_corrente/`.

Se entri in questa cartella e `_sessione_corrente/BRIEFING.md` non esiste o è vuoto, **non lanciare l'agente**: torna nella chat orchestratrice, dille che la sessione non è preparata.

## Come si lancia

1. Apri un terminale (se non l'hai già aperto)
2. Spostati in questa cartella:
   ```bash
   cd _agenti/<nome>
   ```
3. Lancia Claude Code:
   ```bash
   claude
   ```
4. Claude leggerà automaticamente `CLAUDE.md` di questa cartella e saprà cosa deve fare. Lui ti saluterà e ti dirà come procedere.

## Cosa aspettarsi durante la sessione

L'agente:
- Ti dirà cosa sta facendo (in linguaggio naturale, niente tecnicismi)
- Ti chiederà conferma quando deve prendere decisioni che riguardano la storia
- Scriverà i file di lavoro in `_sessione_corrente/OUTPUT/`
- Terrà un log della conversazione in `_sessione_corrente/_log_sessione.md`

Tu durante la sessione:
- Rispondi alle sue domande
- Validi le sue proposte (sì / no / modifica così)
- **Non modifichi tu i file in `_sessione_corrente/`**: ci pensa l'agente

## Come termina la sessione

L'agente ti dirà esplicitamente: "Sessione conclusa. Puoi tornare nella chat orchestratrice."

A quel punto:
1. Chiudi Claude Code (basta `exit` o Ctrl+D)
2. Torna nella chat orchestratrice
3. Dille "ho finito con `<nome>`"

L'orchestratrice leggerà l'output dell'agente e proseguirà.

## Se qualcosa va storto

- **L'agente si blocca o entra in loop**: dimmi `stop` e chiudi Claude Code. La sessione resterà `partial`. L'orchestratrice saprà come gestirla.
- **Hai cambiato idea su qualcosa**: di' all'agente "voglio cambiare la decisione X". Lui aggiusterà.
- **Hai chiuso per sbaglio**: rilancia `claude` nella stessa cartella. L'agente leggerà il log della sessione interrotta e ti chiederà se vuoi riprendere o ricominciare.

## Vedere cosa è successo

Tutto quello che è avvenuto nella sessione resta scritto in `_sessione_corrente/_log_sessione.md`. Puoi leggerlo quando vuoi (è un file Markdown normale). Le sessioni passate sono in `_sessioni_archivio/`.
