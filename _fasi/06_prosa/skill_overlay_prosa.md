# Skill overlay — prosa (Fase 06)

> Layer 1 di specializzazione di fase per la skill `prosa`. Si compone con il Layer 0 (`_skills/prosa/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Specializza l'agente prosa per la modalità *agente-in-chat-dedicata* in Fase 06, con autore come co-scrittore.

### Vincoli operativi specifici di Fase 06

1. **Una unità per chat**, sempre. Mai due unità nella stessa sessione. Se l'autore vuole scrivere una nuova unità, chiude la chat con consuntivo e ne apre un'altra.

2. **Una unità di scrittura per turno** (scena / pagina / segmento, dipende dal medium). Mai 2+ blocchi in fila senza pausa autoriale.

3. **Brief è canonico**: non discutere se i suoi contenuti siano giusti. Se manca qualcosa, è upstream. Vai in pausa, segnala.

4. **Frasi-codice inalterabili**: copia letterale, mai riformulate, mai sostituite, mai cambiata punteggiatura.

5. **Pattern AI da bandire inderogabili**: zero eccezioni. Se ti accorgi di averne usato uno, riscrivi la pagina prima di consegnare il blocco.

6. **Annotazioni post-prosa obbligatorie**: a chiusura unità, file YAML annotazioni compilato (anche se solo dall'autore, con tua assistenza).

### Pattern operativo specifico Fase 06

1. **Apertura**: l'orchestratrice apre chat dedicata, ti fornisce il brief o il path al brief.
2. **Boot**: leggi il brief, conferma all'autore, proponi piano (max 8 righe), aspetta "vai".
3. **Loop di scrittura**: una pagina per turno, blocco con note tecniche separate. Aspetti validazione, applichi modifiche se richieste, ripresenti, vai alla successiva.
4. **Composizione finale**: a fine scrittura, componi il file canonico con frontmatter + marker scena + marker pagina + prosa per ogni pagina (vedi `_esempi_formato_blocco.md`).
5. **Annotazioni**: assisti l'autore a compilare il YAML annotazioni (cast presente, qualifier luoghi, frasi-codice integrate con position_in_text, callback/seeds toccati).
6. **Inventario**: lascia che lo script `build_inventory.py` produca l'inventario testuale per QA.
7. **Consuntivo**: chiudi la chat con consuntivo (max 10 righe).

### Casi di drift autoriale durante la scrittura

L'autore in scrittura può **deviare dal brief** intenzionalmente: aggiungere una scena non prevista, cambiare la modalità attiva di un personaggio, far emergere un dettaglio nuovo.

Tu (agente prosa) **non bloccare** le deviazioni dell'autore: la scrittura è creativa, non solo esecutiva. Ma:

1. **annota nelle note tecniche** del blocco la deviazione: "ho aggiunto la scena s09 non prevista nel brief — drift potenziale, da consolidare nel grafo dopo"
2. **continua a scrivere** secondo il drift dell'autore
3. al consuntivo finale, **lista tutti i drift** rilevati. L'autore deciderà se sono canonici (rientro in Fase 03 per aggiornare grafo) o errori (revisione).

Il drift è normale e desiderato in molti casi: è la unità che si rivela durante la scrittura, e ciò che emerge va consolidato dopo.

### Cosa NON fare in questo overlay

- Non scrivere prose "fattuali" stile narrazione fattuale: il testo finale è letteraria.
- Non descrivere cosa l'illustrazione mostra (per progetti illustrati): dialoga con l'illustrazione, non la descrive.
- Non aggiungere preambolo, epigrafi, dediche, post-scriptum non previsti dal progetto.
- Non spiegare al lettore cosa significa una scena o un gesto: far accadere, non spiegare.
- Non commentare le proprie scelte stilistiche dentro il file canonico: il commento sta nelle note tecniche del blocco intermedio, non nel file finale.
- Non terminare la chat senza consuntivo + annotazioni.

## Stato

🟡 Overlay scritto, da testare al primo progetto reale.
