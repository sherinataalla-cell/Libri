#!/usr/bin/env python3
"""
build_catalog_index.py — Costruisce l'indice machine-readable del
catalogo come JSON (per consumo downstream: brieffer, audit, sito web).

Legge tutte le schede del catalogo + il grafo, produce JSON con metadati
estratti dai frontmatter + statistiche di apparizione derivate dal grafo.

Idempotente: rilanciato produce lo stesso output (a parità di stato del
catalogo + grafo).

Uso:
    python3 _scripts/build_catalog_index.py            # scrive sempre
    python3 _scripts/build_catalog_index.py --verbose
"""
import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))
CATALOG_DIR = Path(os.environ.get("CATALOG_DIR", REPO_ROOT / "catalogo"))
OUTPUT_PATH = Path(os.environ.get("CATALOG_INDEX_PATH",
                                   REPO_ROOT / "catalogo_index" / "data" / "entities.json"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def parse_frontmatter(card_text: str) -> dict:
    """Estrae il frontmatter YAML in testa alla scheda.

    Per minimizzare le dipendenze, parser minimal solo dei campi più
    comuni. Per parsing completo, usa PyYAML.
    """
    m = re.match(r"^---\n(.*?)\n---", card_text, re.DOTALL)
    if not m:
        return {}
    fm_text = m.group(1)
    fm = {}
    for line in fm_text.splitlines():
        m2 = re.match(r"^([a-z_][a-z0-9_]*):\s*(.*)$", line.strip())
        if m2:
            key, val = m2.groups()
            val = val.strip()
            if val == "":
                val = None
            elif val.startswith("[") and val.endswith("]"):
                inner = val[1:-1].strip()
                val = [x.strip() for x in inner.split(",")] if inner else []
            elif val == "true":
                val = True
            elif val == "false":
                val = False
            fm[key] = val
    return fm


def find_schede() -> list:
    if not CATALOG_DIR.exists():
        return []
    return sorted(CATALOG_DIR.glob("**/scheda.md"))


def load_graph() -> dict:
    if not GRAPH_PATH.exists():
        return {}
    with open(GRAPH_PATH, encoding="utf-8") as f:
        return json.load(f)


def compute_appears_in(graph: dict, entity_id: str) -> list:
    """Cerca tutte le unità in cui l'entità appare nel grafo."""
    units_with_entity = []
    for unit_id, unit in graph.get("units", {}).items():
        cast = unit.get("cast_in_scene", [])
        if any(c.get("entity_id") == entity_id for c in cast):
            units_with_entity.append(unit_id)
            continue
        if unit.get("primary_location_id") == entity_id:
            units_with_entity.append(unit_id)
            continue
        for scene in unit.get("scenes", []):
            loc = scene.get("location") or {}
            if loc.get("id") == entity_id:
                units_with_entity.append(unit_id)
                break
            if entity_id in (scene.get("characters_present", []) or []):
                units_with_entity.append(unit_id)
                break
    return list(dict.fromkeys(units_with_entity))


def build_index(verbose: bool) -> dict:
    schede = find_schede()
    graph = load_graph()
    entities = []
    for card_path in schede:
        card_text = card_path.read_text(encoding="utf-8")
        fm = parse_frontmatter(card_text)
        entity_id = fm.get("id")
        if not entity_id:
            if verbose:
                print(f"  [{card_path}] frontmatter senza id, skip")
            continue
        appears_in = compute_appears_in(graph, entity_id)
        entities.append({
            "id": entity_id,
            "name": fm.get("name"),
            "famiglia": fm.get("famiglia"),
            "sottotipo": fm.get("sottotipo"),
            "tipo_grafo": fm.get("tipo_grafo"),
            "ruolo_saga": fm.get("ruolo_saga"),
            "status": fm.get("status"),
            "ultima_modifica": fm.get("ultima_modifica"),
            "card_path": str(card_path.relative_to(REPO_ROOT)),
            "appare_in_storie": appears_in,
        })
    return {
        "_description": "Indice catalogo derivato da schede + grafo",
        "_generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "_total": len(entities),
        "entities": entities,
    }


def main():
    args = parse_args()
    print(f"Build catalog index → {OUTPUT_PATH}")
    index = build_index(args.verbose)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Indice scritto: {len(index['entities'])} entità.")


if __name__ == "__main__":
    main()
