#!/usr/bin/env python3
"""
promote_entities_to_graph.py — Promuove entità nuove al livello macro
del grafo + crea schede embrionali nel catalogo.

Modalità due:
- --bootstrap-catalog: crea schede embrionali per tutte le entità che
  esistono nel grafo macro ma non hanno una scheda nel catalogo
- --queue <path>: legge una coda di entità da promuovere (JSON list di
  dict) e le promuove una a una

Idempotente: se l'entità esiste già nel grafo a livello macro, non la
rilancia. Se la scheda catalogo esiste già, non la sovrascrive.

Uso:
    python3 _scripts/promote_entities_to_graph.py --bootstrap-catalog                # dry-run
    python3 _scripts/promote_entities_to_graph.py --bootstrap-catalog --apply
    python3 _scripts/promote_entities_to_graph.py --queue queue.json --apply
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
CATALOG_DIR = Path(os.environ.get("CATALOG_DIR", REPO_ROOT / "catalogo"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--bootstrap-catalog", action="store_true",
                   help="crea schede embrionali per tutte le entità del grafo")
    g.add_argument("--queue", help="path a JSON con coda entità da promuovere")
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def load_graph() -> dict:
    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_graph(graph: dict) -> None:
    backup = GRAPH_PATH.with_suffix(f".bak.{time.strftime('%Y%m%d_%H%M%S')}")
    shutil.copy2(GRAPH_PATH, backup)
    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)


def make_schema_embrional(entity_id: str, entity_data: dict, category: str) -> str:
    """Genera il body Markdown di una scheda embrionale (frontmatter +
    sezioni con marker `_da popolare_`)."""
    return f"""---
id: {entity_id}
name: {entity_data.get("name", entity_id)}
famiglia: {category}
sottotipo: {entity_data.get("category", "<da definire>")}
tipo_grafo: {entity_data.get("type", "")}
ruolo_saga: {entity_data.get("role_saga", "")}
status: provvisorio
ultima_modifica: {time.strftime("%Y-%m-%d")}
fonti:
  - "{GRAPH_PATH.name}#entities.{category}.{entity_id}"
appare_in_storie: []
relazioni: {{}}
---


# {entity_data.get("name", entity_id)}

> **Stato compilazione:** scheda embrionale post-promozione. Tutte le
> sezioni in `_da popolare_`, da arricchire dal catalogatore.

## Identità (sintesi)

_da popolare_

## Aspetto / forma

_da popolare_

## Espressione / comportamento

_da popolare_

## Palette e atmosfera

_da popolare_

## Coerenza cross-scena (cose che NON cambiano)

_da popolare_

## Variabilità ammessa

_da popolare_

## Cliché da evitare

_da popolare_

## Storie / scene di apparizione

_(generato automaticamente da build_catalog_index.py)_

## Disallineamenti / domande aperte

_(nessuno al momento della promozione)_

## Riferimenti puntuali (citazioni dirette dalle fonti)

- **Promozione**: avvenuta il {time.strftime("%Y-%m-%d")} via `promote_entities_to_graph.py`
- (altre derivazioni: `_da popolare_` man mano che il catalogatore arricchisce)
"""


def write_embrional_card(entity_id: str, entity_data: dict, category: str,
                          dry_run: bool, verbose: bool) -> str:
    """Crea cartella + scheda embrionale. Ritorna 'created'|'exists'|'dry-run'."""
    card_dir = CATALOG_DIR / category / entity_id
    card_path = card_dir / "scheda.md"
    if card_path.exists():
        if verbose:
            print(f"  [{entity_id}] scheda esiste già")
        return "exists"
    if dry_run:
        if verbose:
            print(f"  [{entity_id}] [dry-run] avrei creato {card_path}")
        return "dry-run"
    card_dir.mkdir(parents=True, exist_ok=True)
    card_path.write_text(make_schema_embrional(entity_id, entity_data, category),
                          encoding="utf-8")
    if verbose:
        print(f"  [{entity_id}] creata: {card_path}")
    return "created"


def bootstrap_catalog(dry_run: bool, verbose: bool):
    """Crea schede embrionali per tutte le entità del grafo che ne sono prive."""
    graph = load_graph()
    counts = {"created": 0, "exists": 0, "dry-run": 0}
    for category, entities in graph.get("entities", {}).items():
        for eid, edata in entities.items():
            status = write_embrional_card(eid, edata, category, dry_run, verbose)
            counts[status] += 1
    return counts


def promote_from_queue(queue_path: str, dry_run: bool, verbose: bool):
    """Promuove entità dalla coda al grafo + crea schede embrionali."""
    with open(queue_path, encoding="utf-8") as f:
        queue = json.load(f)
    graph = load_graph()
    counts = {"promoted": 0, "skipped_existing": 0, "card_created": 0, "card_exists": 0}
    graph_modified = False
    for item in queue:
        eid = item["id"]
        category = item["category"]
        edata = item.get("data", {"name": eid})
        # promozione al grafo
        graph.setdefault("entities", {}).setdefault(category, {})
        if eid in graph["entities"][category]:
            if verbose:
                print(f"  [{eid}] esiste già nel grafo, skip")
            counts["skipped_existing"] += 1
        else:
            edata.setdefault("id", eid)
            edata.setdefault("appears_in_units", [])
            edata.setdefault("promotion", {
                "promoted_at": time.strftime("%Y-%m-%d"),
                "promoted_by": item.get("promoted_by", "promote_script"),
                "promotion_unit": item.get("promotion_unit"),
            })
            graph["entities"][category][eid] = edata
            graph_modified = True
            counts["promoted"] += 1
            if verbose:
                print(f"  [{eid}] promosso a {category}")
        # scheda embrionale
        status = write_embrional_card(eid, edata, category, dry_run, verbose)
        if status == "created":
            counts["card_created"] += 1
        elif status == "exists":
            counts["card_exists"] += 1

    if graph_modified and not dry_run:
        canonical_backup = GRAPH_PATH.with_suffix(f".pre_promote.backup.json")
        if not canonical_backup.exists():
            shutil.copy2(GRAPH_PATH, canonical_backup)
        save_graph(graph)
    return counts


def main():
    args = parse_args()
    dry_run = not args.apply
    print(f"Promozione entità ({'DRY-RUN' if dry_run else 'APPLY'})")
    if args.bootstrap_catalog:
        counts = bootstrap_catalog(dry_run, args.verbose)
    else:
        counts = promote_from_queue(args.queue, dry_run, args.verbose)
    print(f"\n  Riepilogo: {counts}")
    if not dry_run:
        print("\n✓ Promozione completata.")


if __name__ == "__main__":
    main()
