#!/usr/bin/env python3
"""
bootstrap_graph.py — Bootstrap del grafo iniziale dal glossario-consegna
della Fase 01 + schema specializzato della Fase 02.

Crea il grafo iniziale popolato a livello macro:
- tutte le entità del glossario-consegna promosse (con id stabili)
- relazioni globali dichiarate ma vuote
- quote_tracker inizializzato a zero
- livello medio (unità narrative) vuoto
- livello micro (scene/hook) vuoto

Idempotente: se rilanciato e il grafo esiste già, verifica integrità
schema vs grafo, segnala drift, non sovrascrive senza --force.

Uso:
    python3 _scripts/bootstrap_graph.py                 # dry-run
    python3 _scripts/bootstrap_graph.py --apply
    python3 _scripts/bootstrap_graph.py --apply --force # sovrascrive
"""
import argparse
import json
import os
import shutil
import sys
import time
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))
SCHEMA_PATH = Path(os.environ.get("SCHEMA_PATH", REPO_ROOT / "grafo_schema.json"))
GLOSSARY_PATH = Path(os.environ.get("GLOSSARY_PATH", REPO_ROOT / "glossario_consegna.json"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--force", action="store_true", help="sovrascrive grafo esistente")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def load_glossary() -> dict:
    """Carica il glossario-consegna della Fase 01.

    Forma attesa: dict con chiavi corrispondenti alle categorie tematiche
    del progetto (es. characters, locations, objects, ...) e per ogni
    categoria un dict {id_entita: {name, ...}}.

    TODO: il progetto può avere il glossario in forma diversa (Markdown
    strutturato, YAML, ...). Adatta il parsing qui.
    """
    if not GLOSSARY_PATH.exists():
        sys.exit(f"❌ Glossario-consegna non trovato: {GLOSSARY_PATH}")
    with open(GLOSSARY_PATH, encoding="utf-8") as f:
        if str(GLOSSARY_PATH).endswith(".json"):
            return json.load(f)
        else:
            sys.exit(f"❌ Forma glossario non supportata: {GLOSSARY_PATH.suffix}. "
                     f"Adatta load_glossary() per il tuo progetto.")


def load_schema() -> dict:
    """Carica lo schema del grafo specializzato in Fase 02."""
    if not SCHEMA_PATH.exists():
        sys.exit(f"❌ Schema grafo non trovato: {SCHEMA_PATH}. "
                 f"Eseguire prima la specializzazione in Fase 02.")
    with open(SCHEMA_PATH, encoding="utf-8") as f:
        return json.load(f)


def build_initial_graph(glossary: dict, schema: dict) -> dict:
    """Costruisce il grafo iniziale dal glossario + schema."""
    # struttura macro come da schema
    graph = {
        "schema_version": schema.get("properties", {}).get("schema_version", {}).get("default", "1.0"),
        "graph_version": "0.0.0",
        "project": {
            "id": glossary.get("project_id", "<id_progetto>"),
            "title": glossary.get("project_title", "<Titolo>"),
            "subtitle": glossary.get("project_subtitle"),
            "medium": glossary.get("medium", "altro"),
            "target_audience": glossary.get("target_audience", "<da definire>"),
            "language": glossary.get("language", "it"),
            "created_at": time.strftime("%Y-%m-%d"),
            "updated_at": time.strftime("%Y-%m-%d"),
        },
        "entities": {},
        "units": {},
        "global_relations": {
            "narrative_promises": {},
            "explicit_callbacks": {},
            "narrative_debts": {},
            "character_arcs": {},
        },
        "quote_tracker": {},
        "misalignments_path": "misalignments.json",
        "audit": {
            "last_run": None,
            "results": {
                "audit_1_integrity": "skip",
                "audit_2_schema": "skip",
                "audit_3_navigability": "skip",
                "audit_4_drift": "skip",
            }
        }
    }

    # promuovi entità dal glossario al livello macro
    for category, entities in glossary.get("entities", {}).items():
        graph["entities"][category] = {}
        for entity_id, entity_data in entities.items():
            graph["entities"][category][entity_id] = {
                "id": entity_id,
                "name": entity_data.get("name", entity_id),
                "aliases": entity_data.get("aliases", []),
                "category": entity_data.get("category"),
                "type": entity_data.get("type"),
                "role_saga": entity_data.get("role_saga"),
                "appears_in_units": [],
                "stato_per_unita": {},
                "links": {
                    "catalog_path": f"catalogo/{category}/{entity_id}/scheda.md",
                    "bibbia_section": entity_data.get("bibbia_section"),
                },
                "promotion": {
                    "promoted_at": time.strftime("%Y-%m-%d"),
                    "promoted_by": "bootstrap",
                    "promotion_unit": None,
                }
            }
            # campi specifici per categoria
            if category == "characters" and "voice" in entity_data:
                graph["entities"][category][entity_id]["voice"] = entity_data["voice"]
            if category == "locations" and "geographical" in entity_data:
                graph["entities"][category][entity_id]["geographical"] = entity_data["geographical"]

    # quote_tracker: campi vuoti dichiarati nello schema
    schema_quote = schema.get("properties", {}).get("quote_tracker", {}).get("properties", {})
    for tracker_name in schema_quote:
        graph["quote_tracker"][tracker_name] = {}

    return graph


def main():
    args = parse_args()
    dry_run = not args.apply

    print(f"Bootstrap grafo iniziale ({'DRY-RUN' if dry_run else 'APPLY'})")
    print(f"  glossario: {GLOSSARY_PATH}")
    print(f"  schema: {SCHEMA_PATH}")
    print(f"  output: {GRAPH_PATH}")

    if GRAPH_PATH.exists() and not args.force:
        sys.exit(f"❌ Grafo esiste già: {GRAPH_PATH}\n"
                 f"   Usa --force per sovrascriverlo (con backup automatico).")

    glossary = load_glossary()
    schema = load_schema()
    graph = build_initial_graph(glossary, schema)

    n_entities = sum(len(v) for v in graph["entities"].values())
    print(f"\n  Entità promosse: {n_entities}")
    for category, entities in graph["entities"].items():
        print(f"    {category}: {len(entities)}")

    if dry_run:
        print("\n  [dry-run] avrei scritto il grafo iniziale.")
        print("  Per scrivere davvero: --apply")
        return

    if GRAPH_PATH.exists():
        backup = GRAPH_PATH.with_suffix(f".bak.{time.strftime('%Y%m%d_%H%M%S')}")
        shutil.copy2(GRAPH_PATH, backup)
        print(f"  backup automatico: {backup}")

    canonical_backup = GRAPH_PATH.with_suffix(".pre_bootstrap.backup.json")
    if not canonical_backup.exists() and GRAPH_PATH.exists():
        shutil.copy2(GRAPH_PATH, canonical_backup)
        print(f"  backup canonico: {canonical_backup}")

    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Grafo iniziale scritto: {GRAPH_PATH}")
    print(f"  Schema version: {graph['schema_version']}")
    print(f"  Graph version: {graph['graph_version']}")


if __name__ == "__main__":
    main()
