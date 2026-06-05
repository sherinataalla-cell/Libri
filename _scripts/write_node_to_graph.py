#!/usr/bin/env python3
"""
write_node_to_graph.py — Scrive un nodo unità nel grafo dal YAML
deterministico della Fase 03.

Legge TEMPLATE_unita.yaml + TEMPLATE_scene.yaml compilati per una unità,
valida con N controlli pre-scrittura, scrive a livello medio + micro,
aggiorna global_relations e quote_tracker.

Idempotente: rilanciato sullo stesso input non incrementa quote_tracker
due volte (ricalcola cumulativo dal contenuto del grafo).

Uso:
    python3 _scripts/write_node_to_graph.py --unit <id> --yaml-unit <path>             # dry-run
    python3 _scripts/write_node_to_graph.py --unit <id> --yaml-unit <path> --apply
"""
import argparse
import json
import os
import shutil
import sys
import time
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("❌ Manca PyYAML. Installa: pip install pyyaml")

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--unit", required=True, help="id unità da scrivere")
    p.add_argument("--yaml-unit", required=True, help="path YAML livello medio")
    p.add_argument("--yaml-scenes", help="path YAML livello micro (opzionale)")
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def load_yaml(path: str) -> dict:
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_graph() -> dict:
    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        return json.load(f)


def validate_unit_data(unit_data: dict, scenes_data: list, graph: dict) -> list:
    """Controlli pre-scrittura. Ritorna lista errori (vuota se ok).

    TODO: ~16 controlli specifici al progetto. Espandi con vincoli editoriali
    del tuo progetto (numero scene, tassonomia tipi scena, ecc.).
    """
    errors = []
    required_fields = ["unit_id", "title", "slug", "position"]
    for field in required_fields:
        if not unit_data.get(field):
            errors.append(f"Campo obbligatorio mancante: {field}")
    scene_ids = [s.get("id") for s in scenes_data]
    if len(scene_ids) != len(set(scene_ids)):
        errors.append("Id scene duplicati")
    positions = sorted([s.get("position") for s in scenes_data])
    if positions and positions != list(range(1, len(positions) + 1)):
        errors.append(f"Position scene non contigui: {positions}")
    # validazione id riferimenti (cast, location)
    all_entity_ids = set()
    for cat, ents in graph.get("entities", {}).items():
        all_entity_ids.update(ents.keys())
    for cast_entry in unit_data.get("cast_in_scene", []):
        eid = cast_entry.get("entity_id")
        if eid and eid not in all_entity_ids:
            errors.append(f"cast_in_scene riferisce entità non esistente: {eid}")
    for scene in scenes_data:
        loc = scene.get("location") or {}
        if loc.get("id") and loc["id"] not in all_entity_ids:
            errors.append(f"scena {scene.get('id')}: location.id non esiste: {loc['id']}")
        for cid in scene.get("characters_present", []) or []:
            if cid not in all_entity_ids:
                errors.append(f"scena {scene.get('id')}: characters_present non esiste: {cid}")
    # TODO: aggiungere controlli quote_tracker (vedi _convenzioni/quote_tracker.md §4.2)
    return errors


def build_unit_node(unit_data: dict, scenes_data: list) -> dict:
    """Compone il nodo unità da scrivere nel grafo."""
    return {
        "id": unit_data["unit_id"],
        "title": unit_data["title"],
        "slug": unit_data.get("slug"),
        "position": unit_data["position"],
        "block_id": unit_data.get("block_id"),
        "register": unit_data.get("register"),
        "estimated_length": unit_data.get("estimated_length"),
        "ambient_conditions": unit_data.get("ambient_conditions", {}),
        "dominant_attributes": unit_data.get("dominant_attributes", {}),
        "premise": unit_data.get("premise"),
        "problem": unit_data.get("problem"),
        "threshold_moment": unit_data.get("threshold_moment"),
        "resolution_mode": unit_data.get("resolution_mode"),
        "cast_in_scene": unit_data.get("cast_in_scene", []),
        "primary_location_id": unit_data.get("primary_location_id"),
        "secondary_location_ids": unit_data.get("secondary_location_ids", []),
        "scenes": scenes_data,
        "narrazione_fattuale_path": unit_data.get("narrazione_fattuale_path"),
        "brief_path": unit_data.get("brief_path"),
        "testo_finale_path": unit_data.get("testo_finale_path"),
        "status": unit_data.get("status", "macro_distilled"),
        "callbacks_in": unit_data.get("callbacks_in", []),
        "seeds_planted": unit_data.get("seeds_planted", []),
        "seeds_blooming": unit_data.get("seeds_blooming", []),
        "seeds_maturing": unit_data.get("seeds_maturing", []),
        "debts_opened": unit_data.get("debts_opened", []),
        "debts_closed": unit_data.get("debts_closed", []),
    }


def update_global_relations(graph: dict, unit_node: dict) -> None:
    """Aggiorna global_relations con seeds/callbacks/debts della unità.

    TODO: pattern specifico al progetto. Esempio minimal:
    - per ogni seed in seeds_planted, crea entry in graph.global_relations.narrative_promises
    - per ogni callback in callbacks_in, registra in explicit_callbacks
    """
    pass


def recompute_quote_tracker(graph: dict) -> None:
    """Ricalcola cumulativo del quote_tracker dal contenuto del grafo.

    Idempotenza: questa funzione si esegue ogni volta dopo una scrittura,
    ricalcolando da zero. Non incrementa due volte se il nodo è
    sovrascritto.

    TODO: logica specifica al progetto. Vedi _convenzioni/quote_tracker.md §4.2.
    """
    pass


def main():
    args = parse_args()
    dry_run = not args.apply

    print(f"Scrittura nodo unità: {args.unit} ({'DRY-RUN' if dry_run else 'APPLY'})")

    unit_data = load_yaml(args.yaml_unit)
    if unit_data.get("unit_id") != args.unit:
        sys.exit(f"❌ unit_id nel YAML ({unit_data.get('unit_id')}) != --unit ({args.unit})")
    scenes_data = unit_data.get("scenes", [])
    if args.yaml_scenes:
        scenes_yaml = load_yaml(args.yaml_scenes)
        if scenes_yaml.get("unit_id") != args.unit:
            sys.exit(f"❌ scene yaml unit_id non corrisponde")
        scenes_data = scenes_yaml.get("scenes", [])

    graph = load_graph()
    errors = validate_unit_data(unit_data, scenes_data, graph)
    if errors:
        print("\n❌ Errori di validazione:")
        for e in errors:
            print(f"   - {e}")
        sys.exit(1)
    print(f"  Validazione: ✓ {len(scenes_data)} scene")

    unit_node = build_unit_node(unit_data, scenes_data)
    graph.setdefault("units", {})[args.unit] = unit_node
    update_global_relations(graph, unit_node)
    recompute_quote_tracker(graph)

    if dry_run:
        print(f"  [dry-run] avrei scritto unità {args.unit} con {len(scenes_data)} scene.")
        return

    canonical_backup = GRAPH_PATH.with_suffix(f".pre_{args.unit}.backup.json")
    if not canonical_backup.exists():
        shutil.copy2(GRAPH_PATH, canonical_backup)
        print(f"  backup canonico: {canonical_backup}")
    auto_backup = GRAPH_PATH.with_suffix(f".bak.{time.strftime('%Y%m%d_%H%M%S')}")
    shutil.copy2(GRAPH_PATH, auto_backup)

    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Unità {args.unit} scritta nel grafo.")


if __name__ == "__main__":
    main()
