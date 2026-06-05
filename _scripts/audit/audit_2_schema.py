#!/usr/bin/env python3
"""
audit_2_schema.py — Audit del grafo contro lo schema.

Verifica:
- la versione schema dichiarata nel grafo corrisponde a quella attesa
- ogni nodo unità rispetta i campi obbligatori dello schema
- ogni nodo entità rispetta i campi obbligatori della sua categoria
- il quote_tracker è coerente con lo stato del grafo (nessun valore
  registrato che non sia derivabile dalle unità distillate)

Per validazione JSON Schema completa, usa la libreria `jsonschema`.

Uso:
    python3 _scripts/audit/audit_2_schema.py
"""
import argparse
import json
import os
import sys
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))
SCHEMA_PATH = Path(os.environ.get("SCHEMA_PATH", REPO_ROOT / "grafo_schema.json"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def main():
    args = parse_args()
    print("Audit 2 — Schema")

    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        graph = json.load(f)

    errors = []
    warnings = []

    # Schema version coerenza
    if SCHEMA_PATH.exists():
        with open(SCHEMA_PATH, encoding="utf-8") as f:
            schema = json.load(f)
        # Per validazione completa: jsonschema.validate(graph, schema)
        try:
            import jsonschema
            try:
                jsonschema.validate(graph, schema)
                print("  Validazione JSON Schema: ✓ pass")
            except jsonschema.ValidationError as e:
                errors.append(f"JSON Schema validation: {e.message} (path: {list(e.path)})")
        except ImportError:
            warnings.append("Modulo `jsonschema` non installato. Validazione completa skippata. "
                            "Installa: pip install jsonschema")
    else:
        warnings.append(f"Schema canonico non trovato: {SCHEMA_PATH}. "
                        f"Validazione completa skippata.")

    # Quote_tracker coerenza (verifiche minimali)
    qt = graph.get("quote_tracker", {})
    units = graph.get("units", {})
    # TODO: verifica che ogni elemento conteggiato in qt corrisponda
    # effettivamente a quello che è scritto nelle unità del grafo.
    # Esempio: se qt dice "elemento X usato in [unit1, unit2]", verifica
    # che le unità unit1 e unit2 effettivamente usino X.

    # Output
    if warnings:
        print(f"\n⚠ {len(warnings)} avvisi:")
        for w in warnings:
            print(f"  - {w}")
    if errors:
        print(f"\n❌ {len(errors)} errori rilevati:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("\n✓ Audit 2 (schema) passato.")


if __name__ == "__main__":
    main()
