# Convenzioni progetto — L'Ombra del Vesper

> Regole specifiche di questo progetto. Integrano (non sostituiscono) le convenzioni trasversali in `_convenzioni/`.

---

## §1 — Regola fondamentale: mai toccare il grafo a mano

**`progetto/story_graph.json` non si edita mai a mano.** Tutto passa per `_scripts/`.

Ordine operativo obbligatorio:
1. `python3 _scripts/<script>.py` → **dry-run** (nessuna modifica, solo preview)
2. `python3 _scripts/<script>.py --apply` → scrittura con backup automatico

Se uno script dà errore in dry-run, **non** lanciare `--apply`. Correggere prima.

---

## §2 — Script e cosa fanno (guida rapida)

| Script | Quando usarlo | Pericoloso? |
|---|---|---|
| `bootstrap_graph.py` | Una volta sola per inizializzare il grafo | ⚠️ solo con `--apply`, una volta |
| `write_node_to_graph.py` | Scrive un capitolo distillato nel grafo | ⚠️ `--apply` dopo dry-run ok |
| `promote_entities_to_graph.py` | Aggiunge entità nuove al grafo | ✅ sicuro, salta esistenti |
| `build_brief.py` | Genera brief (read-only sul grafo) | ✅ sempre sicuro |
| `build_catalog_index.py` | Rigenera indice catalogo (read-only) | ✅ sempre sicuro |
| `compile_catalog_from_graph.py` | Aggiorna schede catalogo | ✅ sicuro, non sovrascrive manuale |
| `normalize_storie.py` | Normalizza frontmatter testi_finali | ✅ sicuro, dry-run default |
| `migrate_schema.py` | Solo quando si aggiunge un campo allo schema | ⚠️ con backup, mai senza motivazione |
| `split_source_to_units.py` | Splitta testo sorgente in unità | ✅ dry-run default |
| `audit/audit_1_integrity.py` | Controlla integrità grafo | ✅ read-only |
| `audit/audit_2_schema.py` | Valida schema | ✅ read-only |
| `audit/audit_3_navigability.py` | Verifica navigabilità | ✅ read-only |
| `audit/audit_4_drift.py` | Rileva derive | ✅ read-only |

---

## §3 — Struttura capitoli

- **20 capitoli**, numerati `cap_01` → `cap_20`
- **4 movimenti**: `la_danza` (1-5), `la_caduta` (6-10), `la_crisi` (11-15), `la_battaglia` (16-20)
- **Doppio POV**: ogni capitolo ha sezione Rory + sezione Dante
- **3.000-4.000 parole** per capitolo (split ~50/50 tra i due POV)
- **Naming file**: `cap_01.md`, `cap_02.md`, ecc. — non cambiare mai il nome dopo distillazione

---

## §4 — Flusso per ogni capitolo nuovo

```
[Autore scrive bozza] 
    → narrazione_fattuale/cap_NN.md (testo grezzo/fattuale)
    → Distillazione (Fase 03): write_node_to_graph.py --apply
    → Catalogo aggiornato: promote_entities_to_graph.py (se entità nuove)
    → Brief generato: build_brief.py --unit cap_NN
    → Prosa finale (Fase 06): agente prosa in chat dedicata
    → testi_finali/cap_NN.md (testo finale)
    → Audit: audit_1_integrity.py + audit_4_drift.py
```

---

## §5 — Backup e versioning

- Ogni `--apply` genera automaticamente un backup `story_graph.json.bak.TIMESTAMP`
- Prima di ogni modifica significativa: backup canonico `story_graph.json.pre_<scope>.backup.json`
- I backup non vanno committati (sono in `.gitignore` → aggiungere pattern se non presente)
- Commit git dopo ogni distillazione completata + audit passato

---

## §6 — Quote tracker (da completare in Fase 02)

Il `quote_tracker` in `story_graph.json` traccia frasi-codice e pattern ricorrenti dei personaggi (es. frasi signature di Dante, tic linguistici di Rory). Da definire con lo skill `architetto_grafo` in Fase 02 leggendo `progetto/_documenti_anima/carta_voce.md`.

---

## §7 — Pattern AI da bandire (da scrivere)

`progetto/_documenti_anima/pattern_ai_da_bandire.md` va scritto in chat dedicata analizzando i cap. 1-8. Contiene i cliché e pattern di linguaggio che l'agente prosa deve evitare tassativamente.
