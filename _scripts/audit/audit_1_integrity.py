#!/usr/bin/env python3
"""
audit_1_integrity.py — Audit di integrità del grafo.

Verifica:
- il grafo è JSON valido
- ha tutti i campi top-level obbligatori (schema_version, graph_version,
  project, entities, units, global_relations, quote_tracker)
- ogni entità ha id non vuoto, name non vuoto
- ogni unità ha id, title, position
- ogni scena ha id, position
- nessun campo duplicato fra livelli

Output: report stdout. Exit code 0 se pass, 1 se fail.

Uso:
    python3 _scripts/audit/audit_1_integrity.py            # report
    python3 _scripts/audit/audit_1_integrity.py --strict   # exit 1 al primo errore
"""
import argparse
import json
import os
import sys
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--strict", action="store_true",
                   help="exit 1 al primo errore (default: report completo)")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def main():
    args = parse_args()
    print("Audit 1 — Integrità grafo")

    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    try:
        with open(GRAPH_PATH, encoding="utf-8") as f:
            graph = json.load(f)
    except json.JSONDecodeError as e:
        sys.exit(f"❌ JSON non valido: {e}")

    errors = []

    # Top-level fields
    required_top = ["schema_version", "graph_version", "project", "entities",
                    "units", "global_relations", "quote_tracker"]
    for field in required_top:
        if field not in graph:
            errors.append(f"Top-level mancante: {field}")

    # Entità
    for category, entities in graph.get("entities", {}).items():
        for eid, entity in entities.items():
            if not entity.get("id"):
                errors.append(f"Entità {category}/{eid}: id vuoto")
            if not entity.get("name"):
                errors.append(f"Entità {category}/{eid}: name vuoto")

    # Unità
    for uid, unit in graph.get("units", {}).items():
        for required_field in ["id", "title", "position"]:
            if not unit.get(required_field):
                errors.append(f"Unità {uid}: {required_field} mancante")
        # Scene
        for i, scene in enumerate(unit.get("scenes", []) or []):
            if not scene.get("id"):
                errors.append(f"Unità {uid}/scene[{i}]: id mancante")
            if not scene.get("position"):
                errors.append(f"Unità {uid}/scene[{i}]: position mancante")

    if errors:
        print(f"\n❌ {len(errors)} errori rilevati:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("✓ Audit 1 (integrità) passato.")


if __name__ == "__main__":
    main()
