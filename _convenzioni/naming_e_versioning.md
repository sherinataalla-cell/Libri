# Convenzione — Naming e versioning

> Convenzione trasversale al kit: come si nominano entità, file, asset, versioni dello schema, backup. Stabile attraverso tutto il progetto, dichiarata una volta per tutte.

---

## §1. Naming entità (id stabili)

Ogni entità del progetto (personaggio, luogo, oggetto, categoria specifica) ha un **id stabile** in `snake_case` ASCII, che la identifica univocamente in:

- nodo grafo (a livello macro: `entities.<famiglia>.<id>`)
- cartella catalogo (`<repo-progetto>/.../catalogo/<famiglia>/<id>/`)
- riferimenti incrociati (briefs, callback, seeds, scene/hook, marker testo finale)

### Regole id

- **`snake_case` ASCII**: lettere minuscole, numeri, underscore. Niente accenti, spazi, caratteri speciali, maiuscole.
- **Espressivo ma compatto**: `forno_di_fiamma` meglio di `f` o di `il_forno_della_volpe_che_sta_a_est_del_villaggio`
- **Stabile per sempre**: l'id deve resistere a evoluzioni autoriali. Non basare l'id su un attributo che potrebbe cambiare (es. `bambino_piu_grande` cambia se decidi di aggiungere un fratello maggiore; `gabriel` no)
- **Univoco in tutto il progetto**: due entità non possono avere lo stesso id, neanche in famiglie diverse
- **Mai rinominato dopo la prima referenza**: una volta usato come riferimento da un seed/callback/brief, l'id è congelato. Per cambiarlo serve migrazione esplicita

### Aliases

Una entità può avere uno o più *alias* dichiarati nel suo nodo grafo / scheda catalogo. Gli alias permettono di referenziare l'entità con nomi alternativi (es. il personaggio `gabriel` può avere alias `gabri`, `il maggiore`). Gli alias sono per il *parser narrativo* / il *brieffer*, non per il routing degli script (che usano sempre l'id canonico).

---

## §2. Naming file di canone

| Tipo file | Pattern | Esempio |
|---|---|---|
| Scheda catalogo | `<repo-progetto>/.../catalogo/<famiglia>/[<sotto-famiglia>/]<id>/scheda.md` | `catalogo/personaggi/individuali/protagonisti/gabriel/scheda.md` |
| Asset canonico (immagine) | `<id>_canonica_v1_<vista>.<estensione>` | `gabriel_canonica_v1_fronte.jpg` |
| Asset turnaround (multi-vista) | `<id>_turnaround_v1.<estensione>` | `gabriel_turnaround_v1.jpg` |
| Prompt di generazione | `prompt_<modello>.md` (es. `prompt_grok.md`, `prompt_flux.md`, `prompt_dalle.md`) | `prompt_grok.md` |
| Descrizione narrativa-social | `descrizione_narrativa_social.md` | — |
| Narrazione fattuale | `<repo-progetto>/.../narrazione_fattuale/<id-unità>_<slug>.md` | `narrazione_fattuale/cap03_la_visita.md` |
| Brief scrittura | `<repo-progetto>/.../briefs/<id-unità>_brief.md` | `briefs/cap03_brief.md` |
| Testo finale prosa | `<repo-progetto>/.../testi_finali/<id-unità>_<slug>.md` | `testi_finali/cap03_la_visita.md` |
| Annotazioni autoriali post-prosa | `<repo-progetto>/.../testi_finali/_annotations/<id-unità>.yaml` | `_annotations/cap03.yaml` |
| Inventario testuale (audit prosa) | `<repo-progetto>/.../testi_finali/_inventory/<id-unità>_inventory.md` | `_inventory/cap03_inventory.md` |
| Asset finale composto per pagina-prodotto | `<repo-progetto>/.../testi_finali/_scene/<id-unità>/<id-unità>_s<NN><x>.<estensione>` | `_scene/cap03/cap03_s01b.jpg` |

---

## §3. Status delle schede catalogo

Ogni scheda dichiara nel frontmatter il proprio status:

- **`provvisorio`** (default iniziale): la scheda è stata creata, body parzialmente popolato. Alcune sezioni hanno marker `_da popolare_`. Modificabile dal catalogatore.
- **`canonico`**: la scheda è stata canonizzata, l'autore l'ha approvata. **Da qui in avanti immutabile come reference**: gli asset associati (immagini canoniche, sample audio canonici) sono intoccabili, eventuali modifiche al body richiedono **bump esplicito di versione** (`v1` → `v2`) e archiviazione della v1.

Pattern di archiviazione bump:

```
catalogo/<famiglia>/.../<id>/
├── scheda.md                     ← v2 corrente
├── prompt_<modello>.md           ← corrente
├── _archivio_v1/
│   ├── scheda.md                 ← versione canonizzata v1
│   └── ...
└── immagini/
    ├── <id>_canonica_v1_*.jpg    ← reference v1, intoccabili
    └── _archivio_v1/
        └── ...                   ← (se servisse)
```

---

## §4. Versioning dello schema del grafo

Lo schema del grafo segue **semver simplificato**:

- `<major>.<minor>.<patch>` o anche solo `<major>.<minor>`
- **major bump**: vietato dopo congelamento iniziale. Un major bump significa breaking change (campi rimossi o rinominati) — è una rottura che invalida tutti i brief generati e gli script downstream
- **minor bump**: aggiunta additiva di campi/relazioni/tracciatori. Retroattiva a `null`. Avviene tramite migrazione one-shot idempotente con backup canonico
- **patch bump**: correzioni di metadati o documentazione interna allo schema. Nessun impatto sul contenuto

Il file canonico del grafo dichiara nello stesso file la sua versione schema:

```json
{
  "schema_version": "1.4",
  "graph_version": "1.2.0",
  ...
}
```

`schema_version` = versione della **forma** dei nodi.
`graph_version` = versione dello **stato del contenuto**.

Si bumpano indipendentemente: una migrazione che riempie campi senza cambiare la forma bumpa solo `graph_version`.

---

## §5. Backup chain canonico

Prima di ogni modifica destruttiva al grafo (anche se idempotente, anche tramite script, anche con `--apply`), si genera un **backup canonico** con nome esplicito che dichiara *prima di cosa* il backup è stato fatto:

```
<file-grafo>.pre_<scope-fase>.backup.<estensione>
```

Esempi:

```
story_graph.json.pre_distillazione_iniziale.backup.json
story_graph.json.pre_aggiunta_campo_X.backup.json
story_graph.json.pre_riempimento_archi_personaggi.backup.json
```

I backup canonici **vivono nella stessa cartella** del file canonico, **mai in cartelle separate**. Sono trail di audit operativo: se serve rollback, si vede subito da quale punto recuperare.

I backup canonici **non** sostituiscono il backup automatico timestamp-based che gli script idempotenti possono generare di default (es. `<file>.bak.<timestamp>`). Sono complementari: il backup automatico è "rete di sicurezza" tecnica; il backup canonico è "punto di salvataggio" autoriale.

---

## §6. Naming branch e commit (Git)

Vedi `git.md` per il dettaglio. In sintesi:

- branch principale: `main`
- per lavori grandi: branch dedicato `<agente>/<scope>` (es. `claude/distillazione-cap03`, `autore/migrazione-schema-1.5`)
- commit prefix: opzionale ma consigliato (`distillazione:`, `catalogo:`, `brief:`, `prosa:`, `schema:`, `convenzione:`)
- mai `--force`, mai `--no-verify`, mai amend di commit altrui

---

## §7. Naming output finale

Il prodotto finale (Fase 07) ha naming proprio dichiarato dal compositore output del progetto (PDF/EPUB/HTML/...). Convenzione consigliata:

```
<nome-progetto>_<id-unità o "completo">_<versione>_<data>.<estensione>
```

Esempi:

- `mio_progetto_cap03_v1_2026-05-07.pdf`
- `mio_progetto_completo_v2_2026-12-15.epub`

---

## §8. Lessico stabile attraverso il progetto

Il progetto dichiara una volta per tutte:

- come si chiamano le **unità narrative** (storia? capitolo? episodio? canto? tavola?)
- come si chiamano le **scene** dentro l'unità (scena? hook? beat? sequenza? pannello?)
- come si chiamano le **pagine-prodotto fisiche** (pagina? tavola? doppia pagina? segmento audio?)

Questa dichiarazione vive in `<repo-progetto>/.../convenzioni_progetto.md` e gli agenti la leggono per sapere come riferirsi alle cose. Il kit usa termini neutri (*unità narrativa*, *scena*, *pagina-prodotto*); il progetto li rinomina al proprio dominio se vuole.
