# Fase 03 — Distillazione: pipeline operativa

> Come si distilla una unità narrativa nel grafo: l'autore racconta i fatti, l'agente distillatore riempie il nodo, l'autore valida blocco-per-blocco. Una unità per chat, mai parallelo.

---

## §1. Quando si entra in Fase 03

Si entra in Fase 03 quando:

- Fase 02 è chiusa (schema congelato, grafo iniziale popolato a livello macro)
- L'autore ha pronto il "racconto fattuale" della prima unità (può essere un appunto, una bozza di trama, una conversazione)

Si **rientra** in Fase 03 ogni volta che si distilla una unità nuova, fino al completamento di tutte le unità del progetto.

---

## §2. Output di Fase 03 (per unità)

Per ogni unità distillata, esistono al termine:

1. **Nodo unità nel grafo** — livello medio popolato in tutti i campi obbligatori, livello micro (scene/hook) popolato e validato
2. **File narrazione fattuale** — `<repo-progetto>/.../narrazione_fattuale/<id>.md` con i *fatti* della unità in italiano referente, **non** prosa finale
3. **Eventuali nuove entità promosse** al livello macro (con scheda embrionale nel catalogo)
4. **Quote tracker globale aggiornato** — i contatori globali del progetto incrementati con i valori di questa unità
5. **Seeds / callbacks / debts globali aggiornati**
6. **Eventuale rolling file misalignments aggiornato** con incoerenze rilevate
7. **Backup canonico** del grafo prima della scrittura: `<file-grafo>.pre_<id-unita>.backup.json`

---

## §3. Il flusso operativo per ogni unità

### Passo 1 — Chat dedicata aperta dall'orchestratrice

Una unità = una chat. L'orchestratrice apre la chat con la skill `distillatore` (Layer 0 + skill_overlay_distillatore.md di questa fase) attivata. Nella chat sono presenti: autore + distillatore + (orchestratrice come osservatrice).

### Passo 2 — Passata 0: Sentinella catalogo

Prima di toccare il nodo unità, il distillatore verifica lo stato del catalogo per le entità che l'autore citerà:

- entità citate ma assenti dal catalogo → da promuovere via `promotore_entita`
- entità con scheda stub che meritano arricchimento
- contenuti del nodo che sono **canonici** (vanno nel catalogo) vs **di unità** (restano nel grafo)

Se ci sono nuove entità da promuovere, il distillatore si **ferma** e segnala. La promozione passa per la skill `promotore_entita` con autorizzazione autoriale. Solo dopo la promozione si procede al Passo 3.

### Passo 3 — Passata 1: Carpentiere meccanico

L'autore racconta i fatti della unità. Il distillatore mappa i fatti ai campi del nodo:

- campi *strutturali* deterministici (id, posizione, registro, lunghezza target, condizioni ambientali, dominanti tematiche)
- *cast in scena* con vincoli locali (chi fa cosa qui, frasi codificate, modalità attiva del personaggio in questa unità)
- *luoghi* primario + secondari riferiti al macro
- *scene/hook* del livello micro (chi presente, dove, quando, focal action, atmosfera, palette)

**Mai inventare contenuto narrativo.** Dove l'informazione manca: `null` / `[]` / `false`.

L'autore valida la passata 1 prima di passare alla 2.

### Passo 4 — Passata 2: Co-autore consultivo

Per ogni `null` lasciato in passata 1, il distillatore *propone* un valore provvisorio motivato, leggendo:

- grafo intero (per coerenza con altre unità)
- catalogo (per coerenza esteriore)
- bibbia + carta voce (per coerenza canonica)
- **quote_tracker globale** come **vincolo duro** (vedi `_convenzioni/quote_tracker.md`)

Le proposte sono marcate come provvisorie (vedi `_convenzioni/marker_machine_readable.md` §5, gradi A/B/C).

In parallelo, il distillatore **annota** misalignment fra fonti nel rolling file `<repo-progetto>/.../misalignments.json`. Non risolve: solo segnala.

L'autore valida o respinge le proposte una a una.

### Passo 5 — Scrittura nel grafo via script

Una volta validati tutti i blocchi, il distillatore (o l'orchestratrice) lancia lo script writer:

```bash
python3 _scripts/write_node_to_graph.py --unit <id> [--dry-run]
```

Lo script:

- valida il nodo proposto contro lo schema e contro il quote_tracker
- genera il backup canonico (`<file-grafo>.pre_<id-unita>.backup.json`)
- scrive il nodo nel grafo
- aggiorna il quote_tracker globale
- aggiorna seeds / callbacks / debts globali
- è idempotente: rilanciato sullo stesso input non incrementa i contatori due volte

Convenzione: prima `--dry-run` per verifica, poi `--apply` per scrittura effettiva. (Lo script lancia di default in dry-run se non si passa `--apply`.)

### Passo 6 — Scrittura della narrazione fattuale

Se l'autore ha consegnato i fatti come testo coerente durante la chat, il distillatore (o l'autore stesso) finalizza il file:

```
<repo-progetto>/.../narrazione_fattuale/<id>_<slug>.md
```

Questo file è il **referente di verità** dei fatti della unità: l'agente prosa lo userà via brief.

### Passo 7 — Validazione audit

Lancio dei 4 audit:

```bash
python3 _scripts/audit/audit_1_integrity.py
python3 _scripts/audit/audit_2_schema.py
python3 _scripts/audit/audit_3_navigability.py
python3 _scripts/audit/audit_4_drift.py
```

Se gli audit passano, la distillazione della unità è chiusa. L'orchestratrice riceve l'esito e aggiorna `STATO_PROGETTO.md`.

---

## §4. Format YAML deterministico (opzionale)

Quando il livello micro è denso e ben fissato (es. molte scene/hook con molti campi), conviene **non** distillare in chat aperta ma usare un **formato YAML deterministico** per unità:

1. l'autore (o il distillatore in chat) compila il file YAML a mano
2. lo script `write_node_to_graph.py` legge il YAML, valida con N controlli, scrive nel grafo

Vantaggi:

- riproducibilità: il YAML è artefatto autoriale committato, il grafo è output deterministico
- batch: si possono distillare più unità in successione lanciando lo script in loop
- validazione pre-scrittura solida (tipicamente ~16 controlli)

Quando usarlo:

- progetti con livello micro molto denso (tipo: 10+ scene per unità con 12+ campi ciascuna)
- batch di unità da distillare in successione
- rispettare un canone editoriale fisso (es. esattamente N hook per unità)

Vedi `_template_yaml_unita/` per la forma del YAML.

---

## §5. Casi limite

### §5.1 L'autore racconta un dato che contraddice il catalogo o la bibbia

1. Il distillatore non risolve in autonomia
2. Segnala in chiaro: "stai dicendo X, ma in <fonte> è Y. Quale vince?"
3. Aspetta decisione autoriale
4. Annota il misalignment nel rolling file

### §5.2 Emerge una entità nuova durante la chat

1. Distillatore si ferma in passata 0 o 1
2. Segnala all'autore: "emersa entità `<nome>`, propongo promozione"
3. Se OK, passa la palla a `promotore_entita`
4. Quando la promozione è fatta, riprende la distillazione

### §5.3 Il quote tracker dichiara "elemento saturo per la saga"

1. Distillatore non propone l'elemento
2. Segnala il vincolo all'autore + propone alternativa dalle fonti
3. Aspetta decisione

### §5.4 La unità è troppo lunga per una sola chat

Spezza in **passate parziali**, mai in unità multiple:

- Passata 0 + 1 in una chat
- Passata 2 in una chat successiva, con stato letto dai rolling files

Mai due unità diverse nella stessa chat.

### §5.5 L'autore vuole modificare lo schema durante la distillazione

Non farlo nella chat di distillazione. Spiega che richiede una migrazione one-shot in Fase 02. La distillazione si mette in pausa, l'orchestratrice apre una chat Fase 02 con `architetto_grafo`, applica la migrazione, poi torna qui.

---

## §6. Relazione con altre fasi

| Fase | Relazione |
|---|---|
| Fase 02 (schema) | Lo schema è la *forma* dei nodi che riempio. Mai modificato qui. |
| Fase 04 (catalogo) | Ogni promozione di entità nuova qui chiama il catalogatore (via promotore_entita) per la scheda embrionale |
| Fase 05 (brief) | Il brieffer legge il grafo distillato e la narrazione fattuale per generare il brief |
| Fase 06 (prosa) | L'agente prosa userà il brief per scrivere la unità |

---

## §7. Vincoli inalterabili

- **Una unità per chat**, mai due
- **Mai inventare contenuto narrativo**
- **Mai modificare lo schema** (rientra in Fase 02 con migrazione one-shot)
- **Mai scrivere il file canonico del grafo direttamente**: solo via `write_node_to_graph.py`
- **Sempre backup canonico** prima della scrittura
- **Quote tracker come vincolo duro** in passata 2
- **Mai saltare la validazione autore** fra una passata e la successiva
