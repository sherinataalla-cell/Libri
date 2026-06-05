# Fase 06 — Prosa: pipeline operativa

> Come si scrive il **testo finale** di una unità narrativa: agente prosa + autore in chat dedicata, una scena/pagina alla volta, con annotazioni autoriali post-prosa e inventario per QA.

---

## §1. Quando si entra in Fase 06

Si entra in Fase 06 quando per una unità è pronto:

- brief generato e validato (Fase 05)
- l'autore vuole effettivamente scrivere il testo (non c'è urgenza tecnica: l'autore decide il timing)

---

## §2. Output di Fase 06

Per ogni unità completata:

1. **Testo finale** in `<repo-progetto>/.../testi_finali/<id-unità>_<slug>.md` — Markdown con frontmatter machine-readable + corpo prosa con marker a 2 livelli
2. **Annotazioni autoriali post-prosa** in `<repo-progetto>/.../testi_finali/_annotations/<id-unità>.yaml` — ground truth post-scrittura che sovrascrive il NER fuzzy
3. **Inventario testuale per QA** in `<repo-progetto>/.../testi_finali/_inventory/<id-unità>_inventory.md` — derivato dal testo, per audit e validazione coerenza con catalogo

---

## §3. Il flusso operativo

### Passo 1 — Apertura chat dedicata

L'orchestratrice apre una chat dedicata per la unità. Nella chat sono presenti:

- **autore**
- **agente prosa** (skill `prosa` Layer 0 + skill_overlay di questa fase)
- **orchestratrice** come osservatrice

Nessun altro agente partecipa. La chat è chiusa, focalizzata.

### Passo 2 — Caricamento del brief

L'agente prosa al primo turno fetcha il brief (vedi `_skills/prosa/SKILL.md` §2 Passo 2). Conferma all'autore di averlo letto, propone il piano (max 8 righe), aspetta il "vai".

### Passo 3 — Scrittura una scena/pagina alla volta

L'agente prosa scrive **una unità di scrittura per turno** (scena / pagina / segmento, dipende dal medium). Ogni blocco:

```markdown
### <Etichetta unità> — <id-unità>

[il testo finale per questa unità]

---
*Note tecniche (3-5 punti):*
- frasi-codice integrate: «...», «...»
- vincoli applicati: ...
- punti di incertezza: [se ce ne sono]
```

L'autore valida o chiede modifiche. Solo dopo il "vai", l'agente prosa scrive la unità successiva.

**Mai due unità in fila senza pausa autoriale.**

### Passo 4 — Composizione del file finale

Quando tutte le unità sono scritte e validate, l'agente prosa (o l'autore stesso) compone il file finale `<id-unità>_<slug>.md`:

- frontmatter machine-readable (vedi `_convenzioni/marker_machine_readable.md` §3)
- header sezione narrativa (`## Scena 1`, `## Scena 2`, ...)
- marker scena (`<!-- @scena ... -->`)
- marker pagina-prodotto (`<!-- @pagina ... -->`)
- prosa per ogni pagina-prodotto

Vedi `_esempi_formato_blocco.md` per la forma precisa.

### Passo 5 — Annotazioni autoriali post-prosa

L'autore (eventualmente assistito dall'agente prosa) compila il file:

```
<repo-progetto>/.../testi_finali/_annotations/<id-unità>.yaml
```

Il file dichiara, scena per scena: chi è effettivamente in scena, quale luogo è qualified come, quali oggetti sono presenti, quali frasi-codice sono state integrate. È **ground truth** post-scrittura che sovrascrive il NER fuzzy nei tool di audit.

Vedi `_template_annotazioni/README.md` per il dettaglio.

### Passo 6 — Inventario testuale per QA

Lo script `_scripts/build_inventory.py` (o equivalente) deriva dal testo + annotazioni:

```
<repo-progetto>/.../testi_finali/_inventory/<id-unità>_inventory.md
```

Inventario di entità citate, scene composte, callback chiamati, seeds piantati/fioriti, ecc. È usato per audit (coerenza testo finale ↔ catalogo ↔ grafo).

Vedi `_template_inventario/README.md` per il dettaglio.

### Passo 7 — Audit drift

Lo script `_scripts/audit/audit_4_drift.py` confronta:

- inventario testuale (cosa c'è effettivamente nella prosa)
- nodo unità del grafo (cosa era previsto)
- catalogo (consistenza descrizione)

Output: lista di drift rilevati. Esempi:

- "il brief diceva che il personaggio X era in scena, ma il testo non lo cita mai"
- "il testo cita un oggetto Y che non è nel catalogo"
- "una frase-codice del personaggio Z è stata modificata (drift letterale)"

L'autore decide caso per caso: il drift è desiderato (e va aggiornato il grafo) o è un errore (e va corretto il testo).

### Passo 8 — Consuntivo finale

L'agente prosa scrive il consuntivo (max 10 righe, vedi `_skills/prosa/SKILL.md` §3.3) e l'orchestratrice aggiorna lo stato di progetto.

---

## §4. Vincoli inalterabili

- **Voce autoriale finale**: mai prosa fattuale come la "narrazione fattuale" del brief.
- **Frasi-codice nel brief inalterabili**: mai riformulate, mai sostituite, mai modificate.
- **Pattern AI da bandire**: inderogabili. Mai violati.
- **Lunghezza target ±15%**: se sfora del 20%, segnala e chiedi.
- **Una unità di scrittura per turno**: mai 2+ blocchi in fila senza pausa autore.
- **Mai prosa "informativa"** che descrive cosa l'illustrazione mostra (per progetti illustrati): il testo dialoga con l'illustrazione, non la descrive.
- **Marker machine-readable** completi e coerenti nel file finale.

---

## §5. Casi limite

### §5.1 Il brief è incompleto

Se nel brief manca qualcosa di critico (referente di verità assente, vincoli universali assenti, ecc.), l'agente prosa **non scrive**. Segnala all'autore subito e si ferma. Si rientra in Fase 05 per rigenerare il brief.

### §5.2 L'autore vuole modificare il brief durante la scrittura

Spiegare all'autore che il brief è generato dallo script. Modifica deve essere upstream (in una delle 4 fonti), poi rigenerazione del brief, poi rientro in Fase 06. La chat di scrittura corrente si mette in pausa.

### §5.3 Drift autoriale rilevato post-scrittura

L'autore in fase di scrittura ha deviato dal brief (es. ha aggiunto una scena non prevista, ha cambiato la modalità attiva di un personaggio). Pattern:

1. l'audit_4_drift rileva il drift
2. l'autore decide: il drift è canonico (va aggiornato il grafo) o è un errore (va corretto il testo)
3. se canonico: rientro in Fase 03 per aggiornare il nodo unità del grafo, poi rigenerazione brief, poi update dell'inventario
4. se errore: l'agente prosa aggiusta il testo

Il drift è normale e desiderato in molti casi: l'unità si rivela durante la scrittura, e ciò che emerge va consolidato nel grafo.

### §5.4 L'autore vuole più scrittura in autonomia

Se l'autore dice "scrivi tutto, vado io a rivedere": l'agente prosa avvisa che la qualità calerà rispetto al lavoro unità-per-unità, mantiene la divisione in blocchi, suggerisce revisione condivisa al termine. Vedi `_skills/prosa/SKILL.md` §7.4.

### §5.5 L'autore non c'è

L'agente prosa **non procede da solo**. Aspetta. Se la chat riprende, riprende da dove era fermo.

---

## §6. Relazione con altre fasi

| Fase | Relazione |
|---|---|
| Fase 05 (brief) | Il brief è la mia fonte canonica per scrivere |
| Fase 03 (distillazione) | Se durante la scrittura emerge drift canonico, si rientra in Fase 03 per aggiornare il grafo |
| Fase 04 (catalogo) | Se durante la scrittura emerge un dato esteriore nuovo da promuovere, si segnala al catalogatore (post-fase) |
| Fase 07 (composizione) | Il testo finale + annotazioni + inventario alimentano la composizione del prodotto finale |

---

## §7. Una sola unità per chat

**Una unità = una chat.** Mai due unità nella stessa sessione.

Se l'autore vuole scrivere una nuova unità, l'orchestratrice chiude la chat corrente con consuntivo e ne apre un'altra. Lo stato si tiene nei file canonici.
