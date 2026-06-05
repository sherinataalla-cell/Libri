# Fase 04 — Catalogo: pipeline operativa

> Come si compila e mantiene il catalogo del progetto: schede strutturate per ogni entità (personaggi, luoghi, oggetti, e categorie tematiche specifiche), con asset di output associati se il progetto li prevede.

---

## §1. Quando si entra in Fase 04

Si entra in Fase 04 in due momenti:

- **Bulk iniziale**: dopo il bootstrap del grafo in Fase 02. Il catalogo ha schede embrionali per tutte le entità del glossario-consegna; vanno arricchite (vedi `PATTERN_BULK_INIZIALE.md`).
- **Iterativo durante la distillazione**: ogni volta che la Fase 03 promuove una nuova entità, la sua scheda embrionale va arricchita prima che la Fase 05 generi i brief che la useranno.

---

## §2. Output di Fase 04

Per ogni scheda completata:

1. **`scheda.md`** popolato in tutte le sezioni canoniche (o con marker `_da popolare_` per le sezioni non ancora compilate)
2. **Frontmatter machine-readable** completo (id, nome, famiglia, sottotipo, status, fonti, relazioni, ultima modifica)
3. **Asset di output** (se il progetto li prevede): prompt di generazione, immagini canoniche, audio sample, ecc.
4. **Descrizione narrativa-social** (opzionale): registri d'uso per marketing/pubblicazione
5. **Indice catalogo aggiornato** (output dello script `build_catalog_index.py`)

---

## §3. Il flusso operativo per ogni scheda

### Setup (a inizio sessione)

Una volta a sessione:

1. Leggi `_starter_kit/_fasi/04_catalogo/PIPELINE.md` (questo file)
2. Leggi i documenti di canone trasversale del progetto (in `<repo-progetto>/.../canone_visuale/` o equivalente, vedi `_template_canone/README.md`)
3. Leggi il template della tipologia di entità (`_template_schede/TEMPLATE_<tipo>.md`)
4. Leggi un esempio di scheda già canonizzata, se esiste
5. Carica `_skills/critic_fisica_realismo/SKILL.md` per capire cosa il critic verificherà

### Per ogni scheda

**Passo 1 — Verifica/popola frontmatter**

Lo script di bootstrap dovrebbe già aver popolato il frontmatter (id, nome, famiglia, sottotipo, fonti). Verifica e completa.

**Passo 2 — Compila body sezione per sezione**

Per ogni sezione del template:

- **Sezioni "fonte canonica"** (Aspetto / forma, Abbigliamento / stato d'uso, Espressione / comportamento, Palette e atmosfera, ecc.): travaso 1:1 dalle fonti del progetto (bibbia + grafo + glossario-consegna). Niente arricchimenti, niente inferenze stilistiche.

- **Sezioni "derivazione autoriale"** (Coerenza cross-scena, Variabilità ammessa, Cliché da evitare): deriva da fonti coerenti, dichiara la derivazione esplicitamente in "Riferimenti puntuali".

- **Sezioni "dal grafo"** (Storie / scene di apparizione): lista deterministica derivata dal grafo.

- **Sezioni "Disallineamenti / domande aperte"**: nota esplicita dei punti dove le fonti si contraddicono o c'è incertezza autoriale.

**Mai inventare contenuto non derivabile.** Se non c'è derivazione possibile, lascia `_da popolare_` con annotazione in "Disallineamenti / domande aperte".

**Passo 3 — Loop con critic_fisica_realismo**

Passa la scheda al critic. Il critic legge la scheda + grafo + bibbia + altre schede già canonizzate, e restituisce:

- **OK pulito**: nessuna incoerenza fisica/realismo
- **Lista incoerenze**: per ognuna, il critic indica cosa non torna. Tu **correggi** dove la correzione è derivabile dalle fonti, oppure **ti blocchi e segnali all'autore** dove serve decisione autoriale

Il loop chiude quando: critic OK; o blocco autore esplicito.

**Passo 4 — Asset di output (se previsti)**

Per progetti illustrati / audio / fumetto:

- compila `prompt_<modello>.md` (template adattato dal progetto): stylesheet del canone trasversale + blocco entity dalla scheda + N asset canonici con angoli/modalità + negative prompt globale
- l'esecuzione della generazione asset è solitamente delegata a un modulo separato (Fase 07 lato asset) eseguito da operatore esterno con repo sync via git

Per progetti di solo testo, salta questo passo.

**Passo 5 — Descrizione narrativa-social (opzionale)**

Se il progetto necessita materiale marketing/pubblicazione, compila `descrizione_narrativa_social.md` con i 7 registri d'uso del template.

**Passo 6 — Status nel frontmatter**

- inizia con `status: provvisorio`
- passa a `status: canonico` solo dopo: critic OK + autore approva esplicitamente

**Passo 7 — Indice catalogo**

A chiusura di un batch di schede:

```bash
python3 _scripts/build_catalog_index.py
```

Output: indice machine-readable in `<repo-progetto>/.../catalogo_index/data/entities.json` (o equivalente).

---

## §4. Pattern di entità complesse

Vedi `PATTERN_ENTITA_COMPLESSE.md`. Sintesi: alcune entità hanno più "facce" (esterno+interno+cortile per luoghi; modalità comportamentali per personaggi; stati nel tempo per oggetti). Pattern: più blocchi distinti dentro la stessa scheda, mai mescolati. Quando un asset richiama l'entità, sceglie *un solo blocco*.

## §5. Pattern bulk iniziale

Vedi `PATTERN_BULK_INIZIALE.md`. Sintesi: la prima compilazione del catalogo è bulk meccanica (travaso da fonte canonica). Dopo il bulk, può avvenire un **trasferimento di autorità**: la fonte originaria viene svuotata del layer travasato, e il catalogo diventa autoritativo per quel layer.

---

## §6. Casi limite

Vedi `_skills/catalogatore/SKILL.md` §7-§8 per i casi limite tipici della skill.

Casi specifici Fase 04:

### §6.1 Una scheda dovrebbe avere asset canonici ma il modulo di generazione non è ancora pronto

OK lasciare gli asset al `TBD` nel frontmatter. La compilazione del body procede comunque. Gli asset vengono generati in passate dedicate quando il modulo è pronto.

### §6.2 Bulk parziale: alcune entità sono già state canonizzate, altre no

Pattern misto. Le canonizzate restano intatte (immutabili senza bump). Le altre proseguono in compilazione standard. Lo script `build_catalog_index.py` distingue lo status nel frontmatter.

---

## §7. Relazione con altre fasi

| Fase | Relazione |
|---|---|
| Fase 02 (schema) | Lo schema del grafo dichiara le categorie tematiche di entità che hanno schede |
| Fase 03 (distillazione) | Promuove nuove entità al macro, chiama me (via promotore_entita) per schede embrionali |
| Fase 05 (brief) | Il brieffer legge le schede del catalogo per popolare le sezioni "cast in scena" e "convenzioni mondo" del brief |
| Fase 07 (composizione) | Gli asset canonici delle schede vengono assemblati nel prodotto finale |

---

## §8. Vincoli inalterabili

- **Mai inventare dati esteriori.** Tutto deriva da fonti canoniche, esplicitamente.
- **Mai modificare bibbia o canone-mondo.** Solo lettura. Dato esteriore nuovo → solo nel catalogo.
- **Mai toccare schede `canonico`** senza bump esplicito di versione + autorizzazione autoriale.
- **Mai sostituire asset canonici** (intoccabili come reference).
- **Mai saltare il critic** prima di consegnare.
- **Sempre marker `_da popolare_`** per sezioni non compilate, mai vuote silenti.
