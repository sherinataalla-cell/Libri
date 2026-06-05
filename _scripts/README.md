# `_scripts/` — Script Python idempotenti riusabili

Tooling Python condiviso tra le fasi del kit. Pattern: **idempotenti**, `--dry-run` di default, `--apply` per scrivere, backup automatico, additivi.

## Stato

Tutti gli script sono **scheletri funzionanti**: parsano args, gestiscono backup, dry-run, side-effects, errori. I punti dove serve la **logica specifica del progetto** sono marcati con `TODO` e commentati con riferimenti alle convenzioni del kit.

L'adottante del kit:
1. copia gli script che gli servono in `<repo-progetto>/.../scripts/`
2. completa i `TODO` con la logica specifica al proprio dominio (forma del glossario, regole di travaso, vincoli di validazione)
3. testa su uno o due esempi
4. usa in produzione

## Inventario

| Script | Cosa fa | Fase | Stato |
|---|---|---|---|
| `_base_pattern.py` | Pattern base per nuovi script (template di partenza) | — | ✅ scritto |
| `bootstrap_graph.py` | Crea grafo iniziale dal glossario-consegna + schema | 02 | ✅ scheletro |
| `migrate_schema.py` | Migrazione one-shot additiva schema (con bump versione) | 02 | ✅ scheletro |
| `write_node_to_graph.py` | Scrive nodo unità nel grafo dal YAML deterministico | 03 | ✅ scheletro |
| `split_source_to_units.py` | Split documento sorgente unico in N narrazioni fattuali | 03 | ✅ scheletro |
| `promote_entities_to_graph.py` | Promuove entità nuove + crea schede embrionali | 02, 03 | ✅ scheletro |
| `compile_catalog_from_graph.py` | Bulk meccanico travaso bibbia → schede catalogo | 04 | ✅ scheletro |
| `build_catalog_index.py` | Costruisce indice JSON catalogo (frontmatter + apparizioni) | 04 | ✅ scheletro |
| `build_brief.py` | Genera brief da grafo + narrazione + catalogo + bibbia + voce | 05 | ✅ scheletro |
| `normalize_storie.py` | Normalizza file testo finale (frontmatter, marker) | 06 | ✅ scheletro |
| `audit/audit_1_integrity.py` | Verifica integrità grafo (campi obbligatori, JSON valido) | tutte | ✅ scheletro |
| `audit/audit_2_schema.py` | Verifica grafo contro JSON Schema (richiede `jsonschema`) | tutte | ✅ scheletro |
| `audit/audit_3_navigability.py` | Verifica referenze fra nodi (cast → entità, location → registro) | tutte | ✅ scheletro |
| `audit/audit_4_drift.py` | Drift testo finale vs canone (cast, frasi-codice, seeds) | 06 | ✅ scheletro |

## Pattern dello script idempotente

Ogni script segue questo pattern (vedi `_base_pattern.py` per il template):

```python
#!/usr/bin/env python3
"""<Nome script> — <Cosa fa>.

Idempotente: rilanciabile senza danni.
Dry-run di default. --apply per scrivere. Backup automatico.

Uso:
  python3 _scripts/<nome>.py            # dry-run
  python3 _scripts/<nome>.py --apply    # scrive davvero
"""
import argparse, json, shutil, sys, time
from pathlib import Path
import os

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))

def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--apply", action="store_true")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()

def main():
    args = parse_args()
    dry_run = not args.apply
    # ... logica ...

if __name__ == "__main__":
    main()
```

## Variabili d'ambiente

Tutti gli script usano variabili d'ambiente per la portabilità fra progetti:

| Variabile | Default | Uso |
|---|---|---|
| `REPO_ROOT` | `.` | radice del progetto |
| `GRAPH_PATH` | `$REPO_ROOT/story_graph.json` | grafo canonico |
| `SCHEMA_PATH` | `$REPO_ROOT/grafo_schema.json` | schema canonico |
| `CATALOG_DIR` | `$REPO_ROOT/catalogo` | cartella schede catalogo |
| `BIBBIA_PATH` | `$REPO_ROOT/bibbia.md` | bibbia / canone-mondo |
| `CARTA_VOCE_PATH` | `$REPO_ROOT/carta_voce.md` | carta voce |
| `PATTERN_AI_PATH` | `$REPO_ROOT/pattern_ai_da_bandire.md` | pattern AI da bandire |
| `NARRAZIONE_DIR` | `$REPO_ROOT/narrazione_fattuale` | narrazioni fattuali |
| `BRIEFS_DIR` | `$REPO_ROOT/briefs` | output dei brief generati |
| `TESTI_FINALI_DIR` | `$REPO_ROOT/testi_finali` | testi finali prosa |
| `GLOSSARY_PATH` | `$REPO_ROOT/glossario_consegna.json` | glossario-consegna Fase 01 |

Esempio uso con override:

```bash
GRAPH_PATH=/altro/path/grafo.json python3 _scripts/audit/audit_1_integrity.py
```

## Backup

- **automatici timestamp-based** (`<file>.bak.<timestamp>`): generati prima di ogni `--apply`, NON committati (in `.gitignore`)
- **canonici** (`<file>.pre_<scope>.backup.<estensione>`): generati per modifiche autoriali significative, **committati** come trail di audit (vedi `_convenzioni/naming_e_versioning.md` §5)

## Dipendenze opzionali

Alcuni script richiedono pacchetti Python opzionali:

- `pyyaml` (per `write_node_to_graph.py`, `audit_4_drift.py`): `pip install pyyaml`
- `jsonschema` (per `audit_2_schema.py` validazione completa): `pip install jsonschema`

Lo script gestisce graziosamente l'assenza: skippa la funzionalità con un avviso, non si ferma.

## Cosa fare quando si adotta uno script

1. **Copia** lo script in `<repo-progetto>/.../scripts/<nome>.py`
2. **Cerca i `TODO`** dentro lo script
3. **Implementa la logica specifica** per ogni `TODO`:
   - parsing di formati specifici al progetto (glossario, fonte canonica, ecc.)
   - regole di validazione progetto-specifiche
   - mappature sezione → fonte
4. **Testa su uno-due esempi** in `--dry-run`
5. **Valida con `--apply`** quando l'output è ok
6. **Commit** lo script + i suoi output canonici

## Convenzioni di naming output

- Backup automatico: `<file>.bak.<timestamp>` (gitignore)
- Backup canonico: `<file>.pre_<scope>.backup.<estensione>` (committato)
- Output index: `<repo-progetto>/.../catalogo_index/data/entities.json`
- Output brief: `<repo-progetto>/.../briefs/<id-unità>_brief.md`
- Output narrazione fattuale: `<repo-progetto>/.../narrazione_fattuale/<id-unità>_<slug>.md`
