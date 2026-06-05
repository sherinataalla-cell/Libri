#!/usr/bin/env python3
"""
migrate_schema.py — Migrazione one-shot dello schema del grafo (additivo).

Applica una migrazione additiva al grafo (aggiunta di campi, retroattiva
a `null` su tutti i nodi dello stesso livello) con backup canonico
esplicito + bump versione schema.

Le rimozioni e rinominazioni di campo sono **vietate** dopo congelamento
schema. Vedi _convenzioni/naming_e_versioning.md §4.

Idempotente: verifica schema_version corrente prima di applicare —
errore con messaggio chiaro se la migrazione è già stata applicata o
la versione è fuori sync. Backup canonico + automatico prima di ogni
scrittura.

Pattern d'uso: si scrive UNA migrazione per ogni cambiamento strutturale.
Lo script di migrazione è dichiarativo: descrive cosa aggiungere e dove,
calcola il diff vs schema corrente, applica retroattivamente.

Uso:
    python3 _scripts/migrate_schema.py --migration <nome>            # dry-run
    python3 _scripts/migrate_schema.py --migration <nome> --apply
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


# === DEFINIZIONI MIGRAZIONI ===
# Aggiungi qui le tue migrazioni in ordine cronologico. Ogni migrazione
# è un dict che descrive cosa fare. Lo script applica solo le migrazioni
# non ancora applicate (in base a schema_version corrente del grafo).

MIGRATIONS = [
    {
        "name": "add_field_X_to_scenes",
        "from_schema": "1.0",
        "to_schema": "1.1",
        "description": "Aggiunge campo 'X' a tutte le scene del livello micro, default null.",
        "apply": "add_field_to_scenes",  # nome funzione handler
        "field_name": "X",
        "default_value": None,
    },
    # Aggiungi nuove migrazioni qui...
]


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--migration", required=True, help="nome migrazione da applicare")
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def load_graph() -> dict:
    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        return json.load(f)


# === HANDLERS DI MIGRAZIONE ===

def handler_add_field_to_scenes(graph: dict, migration: dict, verbose: bool) -> int:
    """Aggiunge un campo a tutte le scene di tutte le unità."""
    field_name = migration["field_name"]
    default_value = migration["default_value"]
    n_modified = 0
    for unit_id, unit in graph.get("units", {}).items():
        for scene in unit.get("scenes", []):
            if field_name not in scene:
                scene[field_name] = default_value
                n_modified += 1
                if verbose:
                    print(f"    [{unit_id}/{scene.get('id')}] aggiunto {field_name}={default_value}")
    return n_modified


def handler_add_field_to_entities(graph: dict, migration: dict, verbose: bool) -> int:
    """Aggiunge un campo a tutte le entità di una categoria."""
    field_name = migration["field_name"]
    default_value = migration["default_value"]
    category = migration.get("category")
    n_modified = 0
    if category:
        entities = graph.get("entities", {}).get(category, {})
    else:
        # tutte le categorie
        entities = {}
        for cat, ents in graph.get("entities", {}).items():
            for eid, edata in ents.items():
                entities[f"{cat}/{eid}"] = edata
    for entity_id, entity in entities.items():
        if field_name not in entity:
            entity[field_name] = default_value
            n_modified += 1
            if verbose:
                print(f"    [{entity_id}] aggiunto {field_name}={default_value}")
    return n_modified


HANDLERS = {
    "add_field_to_scenes": handler_add_field_to_scenes,
    "add_field_to_entities": handler_add_field_to_entities,
    # Aggiungi handler personalizzati qui per il tuo progetto
}


def main():
    args = parse_args()
    dry_run = not args.apply

    # trova migrazione richiesta
    migration = next((m for m in MIGRATIONS if m["name"] == args.migration), None)
    if not migration:
        sys.exit(f"❌ Migrazione '{args.migration}' non trovata. "
                 f"Migrazioni disponibili: {[m['name'] for m in MIGRATIONS]}")

    print(f"Migrazione: {migration['name']}")
    print(f"  schema: {migration['from_schema']} → {migration['to_schema']}")
    print(f"  descrizione: {migration['description']}")
    print(f"  modalità: {'DRY-RUN' if dry_run else 'APPLY'}")

    graph = load_graph()
    current_schema = graph.get("schema_version")
    if current_schema != migration["from_schema"]:
        sys.exit(f"❌ Schema corrente è {current_schema}, atteso {migration['from_schema']}. "
                 f"Migrazione non applicabile (forse già applicata, o schema fuori sync).")

    # esegui handler
    handler_name = migration["apply"]
    handler = HANDLERS.get(handler_name)
    if not handler:
        sys.exit(f"❌ Handler '{handler_name}' non implementato.")

    n_modified = handler(graph, migration, args.verbose)
    print(f"\n  Nodi modificati: {n_modified}")

    # bump schema version
    graph["schema_version"] = migration["to_schema"]

    if dry_run:
        print("\n  [dry-run] avrei applicato la migrazione e bumpato lo schema.")
        return

    # backup canonico esplicito
    canonical_backup = GRAPH_PATH.with_suffix(f".pre_{migration['name']}.backup.json")
    shutil.copy2(GRAPH_PATH, canonical_backup)
    print(f"  backup canonico: {canonical_backup}")

    # backup automatico
    auto_backup = GRAPH_PATH.with_suffix(f".bak.{time.strftime('%Y%m%d_%H%M%S')}")
    shutil.copy2(GRAPH_PATH, auto_backup)

    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Migrazione applicata. Schema: {migration['from_schema']} → {migration['to_schema']}")
    print(f"  Aggiorna LOG_SINCRONIZZAZIONE.md con un'entry per questa migrazione.")


if __name__ == "__main__":
    main()
