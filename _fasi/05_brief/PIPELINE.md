# Fase 05 — Brief: pipeline operativa

> Come si generano e mantengono i **writing brief** per le unità narrative del progetto: documenti autosufficienti che l'agente prosa userà per scrivere il testo finale.

---

## §1. Quando si entra in Fase 05

Si entra in Fase 05 quando per una unità sono pronti:

- nodo unità nel grafo, distillato e validato (Fase 03)
- file narrazione fattuale presente (Fase 03)
- catalogo arricchito per le entità citate nel cast (Fase 04, almeno embrionale)
- bibbia / canone-mondo del progetto stabile (Fase 01)
- carta voce + pattern AI da bandire stabili (Fase 01)

Si **rientra** in Fase 05 ogni volta che cambia una delle 4 fonti per rigenerare i brief impattati.

---

## §2. Output di Fase 05

Per ogni unità: un file `<repo-progetto>/.../briefs/<id-unità>_brief.md` autosufficiente, contenente tutto ciò che serve all'agente prosa per scrivere il testo finale.

Il brief è **deterministico**: rigenerarlo dalle stesse fonti produce lo stesso output (zero LLM nello script, pura composizione meccanica).

---

## §3. Il flusso operativo

### Passo 1 — Bootstrap delle sezioni canoniche (una volta per progetto)

In primo arrivo in Fase 05, il progetto definisce **quali sezioni canoniche** ha il proprio brief, con quale ordine e quale livello di dettaglio. Riferimento: `_template_brief/SECTIONS.md`.

Output: documento `<repo-progetto>/.../template_brief/SECTIONS.md` con l'inventario delle sezioni del progetto.

### Passo 2 — Mappatura sezioni → fonti (una volta per progetto)

Per ogni sezione, dichiarare quale fonte la alimenta. Riferimento: `_template_brief/MAPPING_SECTIONS_TO_SOURCES.md`.

Output: documento `<repo-progetto>/.../template_brief/MAPPING.md` con la mappatura sezione → fonte.

### Passo 3 — Implementazione dello script `build_brief.py`

Si scrive (o si specializza dal template del kit) lo script `_scripts/build_brief.py`:

- legge il grafo del progetto, le narrazioni fattuali, le schede catalogo, la bibbia, la carta voce, i pattern AI
- per ogni sezione canonica del brief, applica la mappatura sezione → fonte
- compone il brief in Markdown, con frontmatter machine-readable
- è **idempotente**: rilanciato sullo stesso input produce identico output (nessun LLM)
- supporta flag `--all` (rigenera tutti i brief) e `--unit <id>` (rigenera solo uno)

### Passo 4 — Validazione contro reference autoriale (test di accettazione)

Il pattern di validazione del kit è: l'autore consegna un **brief reference** scritto a mano per una unità di prova (es. la prima unità distillata). Lo script `build_brief.py` viene calibrato finché il suo output per quella unità è **identico** al reference (`diff` vuoto).

Se il diff non è vuoto, **si corregge lo script**, mai si patcha il brief generato. Vedi `_validazione/README.md`.

Una volta passato il test di accettazione, il builder è pronto per scaling.

### Passo 5 — Generazione dei brief per tutte le unità

```bash
python3 _scripts/build_brief.py --all
```

Output: tutti i file `<id-unità>_brief.md` nella directory canonica.

### Passo 6 — Verifica e segnalazione di anomalie

Per ogni brief generato, lo script logga:

- ✅ generato con successo
- ⚠️ avviso non bloccante (es. scheda catalogo parzialmente popolata, fallback applicato)
- ❌ errore (es. campo obbligatorio del grafo mancante, blocca questa unità)

L'agente brieffer (vedi `_skills/brieffer/SKILL.md`) verifica i log e segnala all'autore. Mai patchare i brief a mano: si correggono le fonti upstream e si rilancia.

### Passo 7 — Aggiornamento incrementale

Quando una delle 4 fonti cambia:

```bash
python3 _scripts/build_brief.py --unit <id-unità>     # se l'impatto è noto
python3 _scripts/build_brief.py --all                 # se in dubbio
```

Lo script è idempotente: rilanciato senza modifiche, non cambia nulla.

---

## §4. Vincoli inalterabili

- **Lo script è puramente meccanico**: zero LLM, zero arricchimenti, zero inferenze. Solo composizione.
- **I brief sono autosufficienti**: l'agente prosa non deve mai consultare altre fonti durante la scrittura.
- **Il brief è scritto in italiano** (o lingua del progetto), salvo blocchi tecnici che possono restare in inglese se citati identici dal canone trasversale.
- **Mai modificare i brief a mano**: se manca qualcosa, si modifica lo script o la fonte upstream e si rilancia.
- **Il brief non è negoziabile dall'agente prosa**: contiene tutto ciò che serve, è la fonte canonica per quella unità.

---

## §5. Casi limite

### §5.1 Sezione del brief incompleta perché la fonte è incompleta

Lo script logga un avviso. Il brief viene generato comunque, con la sezione marcata `_(non popolato — fonte: <riferimento>)_`. L'agente prosa la vedrà e segnalerà.

La correzione: si arricchisce la fonte upstream (catalogo, grafo, bibbia), si rilancia lo script. **Non si patchano i brief.**

### §5.2 La narrazione fattuale di una unità non esiste

Errore bloccante: senza referente di verità sui fatti, l'agente prosa non può scrivere. Lo script segnala, l'autore o l'agente distillatore producono la narrazione fattuale, poi si rilancia.

### §5.3 Cambia la carta voce a metà progetto

Caso comune dopo molte unità completate. Pattern:

1. l'autore aggiorna la carta voce (`<repo-progetto>/.../carta_voce.md`)
2. bumpa la versione della carta voce
3. logga il cambio in `LOG_SINCRONIZZAZIONE.md`
4. si rigenerano **tutti** i brief (`--all`)
5. le unità già scritte (Fase 06) si rivalutano: vanno riscritte? la carta voce nuova è retroattiva?

La risposta dipende dall'autore. Lo script non decide: rigenera meccanicamente.

### §5.4 Pattern AI da bandire si arricchisce

Caso comune dopo aver letto pochi testi finali e identificato nuovi pattern AI da bandire. Pattern:

1. l'autore aggiorna `<repo-progetto>/.../pattern_ai_da_bandire.md`
2. bumpa versione
3. si rigenerano tutti i brief delle unità non ancora scritte
4. l'autore decide se le unità già scritte vanno riscritte o lasciate (decisione narrativa)

---

## §6. Relazione con altre fasi

| Fase | Relazione |
|---|---|
| Fase 03 (distillazione) | Mi alimenta con il grafo distillato + narrazione fattuale |
| Fase 04 (catalogo) | Mi alimenta con le schede catalogo per il cast in scena |
| Fase 06 (prosa) | Consuma i miei brief per scrivere il testo finale |
| Fase 07 (composizione) | Riferisce indirettamente i brief (via testo finale + asset) |

---

## §7. Test di accettazione del builder

Il test di accettazione è il **diff vuoto** vs reference autoriale:

```bash
python3 _scripts/build_brief.py --unit <id-prova>
diff <repo-progetto>/.../briefs/<id-prova>_brief.md \
     <repo-progetto>/.../template_brief/REFERENCE/<id-prova>_brief_reference.md
# expected: nessuna differenza
```

Se diff non è vuoto: **si corregge lo script**, non si patcha.

Vedi `_validazione/README.md` per il dettaglio.
