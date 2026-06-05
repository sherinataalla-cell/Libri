#!/usr/bin/env python3
"""
audit_3_navigability.py — Audit di navigabilità del grafo.

Verifica:
- ogni cast_in_scene riferisce entità esistenti nel registro entities
- ogni primary_location_id esiste nel registro entities.locations
- ogni location.id nelle scene esiste nel registro
- ogni callback_in punta a un callback esistente in global_relations
- ogni seed in seeds_planted/blooming/maturing esiste in
  global_relations.narrative_promises
- ogni debt in debts_opened/debts_closed esiste in narrative_debts

Output: lista referenze rotte. Exit 1 se ce ne sono.

Uso:
    python3 _scripts/audit/audit_3_navigability.py
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
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def main():
    args = parse_args()
    print("Audit 3 — Navigabilità")

    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        graph = json.load(f)

    # raccolgo tutti gli id validi
    all_entity_ids = set()
    for cat, ents in graph.get("entities", {}).items():
        all_entity_ids.update(ents.keys())
    location_ids = set(graph.get("entities", {}).get("locations", {}).keys())

    seeds = set(graph.get("global_relations", {}).get("narrative_promises", {}).keys())
    callbacks = set(graph.get("global_relations", {}).get("explicit_callbacks", {}).keys())
    debts = set(graph.get("global_relations", {}).get("narrative_debts", {}).keys())

    errors = []

    for uid, unit in graph.get("units", {}).items():
        # cast
        for cast_entry in unit.get("cast_in_scene", []) or []:
            eid = cast_entry.get("entity_id")
            if eid and eid not in all_entity_ids:
                errors.append(f"Unità {uid}: cast_in_scene riferisce entità inesistente: {eid}")
        # primary_location
        ploc = unit.get("primary_location_id")
        if ploc and ploc not in location_ids:
            errors.append(f"Unità {uid}: primary_location_id inesistente: {ploc}")
        for sloc in unit.get("secondary_location_ids", []) or []:
            if sloc not in location_ids:
                errors.append(f"Unità {uid}: secondary_location_ids inesistente: {sloc}")
        # scene
        for scene in unit.get("scenes", []) or []:
            loc = scene.get("location") or {}
            if loc.get("id") and loc["id"] not in location_ids:
                errors.append(f"Unità {uid}/scena {scene.get('id')}: location.id inesistente: {loc['id']}")
            for cid in scene.get("characters_present", []) or []:
                if cid not in all_entity_ids:
                    errors.append(f"Unità {uid}/scena {scene.get('id')}: characters_present inesistente: {cid}")
            fobj = scene.get("focal_object")
            if fobj and fobj not in all_entity_ids:
                errors.append(f"Unità {uid}/scena {scene.get('id')}: focal_object inesistente: {fobj}")
        # callbacks/seeds/debts
        for cb in unit.get("callbacks_in", []) or []:
            if cb not in callbacks:
                errors.append(f"Unità {uid}: callbacks_in punta a callback inesistente: {cb}")
        for s in (unit.get("seeds_planted", []) or []) + (unit.get("seeds_blooming", []) or []) + (unit.get("seeds_maturing", []) or []):
            if s not in seeds:
                errors.append(f"Unità {uid}: seed inesistente in narrative_promises: {s}")
        for d in (unit.get("debts_opened", []) or []) + (unit.get("debts_closed", []) or []):
            if d not in debts:
                errors.append(f"Unità {uid}: debt inesistente in narrative_debts: {d}")

    if errors:
        print(f"\n❌ {len(errors)} riferimenti rotti:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("\n✓ Audit 3 (navigabilità) passato.")


if __name__ == "__main__":
    main()
