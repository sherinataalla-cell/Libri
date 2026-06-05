#!/usr/bin/env python3
"""
Pattern base — Script idempotente del kit.

Tutti gli script di _scripts/ seguono questo pattern. Copia questo file come
punto di partenza per nuovi script.

Idempotente: rilanciabile senza danni. Dry-run di default. --apply per
scrivere. Backup automatico timestamp-based prima di ogni scrittura.

Uso:
    python3 _scripts/<nome>.py                # dry-run di default
    python3 _scripts/<nome>.py --apply        # scrive davvero
    python3 _scripts/<nome>.py --apply --verbose
"""
import argparse
import json
import shutil
import sys
import time
from pathlib import Path

# === COSTANTI PATH ===
# Sovrascrivibili via variabile d'ambiente per portabilità progetto.
import os

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))
CATALOG_DIR = Path(os.environ.get("CATALOG_DIR", REPO_ROOT / "catalogo"))
BIBBIA_PATH = Path(os.environ.get("BIBBIA_PATH", REPO_ROOT / "bibbia.md"))


def make_backup(file_path: Path) -> Path:
    """Genera backup timestamp-based <file>.bak.<timestamp>."""
    if not file_path.exists():
        return None
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    backup_path = file_path.with_suffix(f"{file_path.suffix}.bak.{timestamp}")
    shutil.copy2(file_path, backup_path)
    return backup_path


def make_canonical_backup(file_path: Path, scope: str) -> Path:
    """Genera backup canonico <file>.pre_<scope>.backup.<estensione>.

    Vedi _convenzioni/naming_e_versioning.md §5. Da chiamare per modifiche
    autoriali significative, in aggiunta al backup automatico.
    """
    if not file_path.exists():
        return None
    backup_path = file_path.with_suffix(f"{file_path.suffix}.pre_{scope}.backup{file_path.suffix}")
    shutil.copy2(file_path, backup_path)
    return backup_path


def load_graph() -> dict:
    """Carica il grafo dal path canonico, validando JSON."""
    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_graph(graph: dict, dry_run: bool = True, verbose: bool = False) -> None:
    """Salva il grafo, con backup automatico se non dry-run."""
    if dry_run:
        if verbose:
            print(f"  [dry-run] avrei scritto {GRAPH_PATH}")
        return
    backup = make_backup(GRAPH_PATH)
    if backup and verbose:
        print(f"  backup automatico: {backup}")
    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)
    if verbose:
        print(f"  scritto {GRAPH_PATH}")


def parse_args(description: str) -> argparse.Namespace:
    """Parser standard: --dry-run (default), --apply, --verbose."""
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument("--apply", action="store_true",
                        help="scrive davvero. Default: dry-run.")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="output dettagliato")
    return parser.parse_args()


def main():
    args = parse_args(__doc__)
    dry_run = not args.apply

    if dry_run:
        print("Modalità: DRY-RUN (nessuna modifica scritta). Usa --apply per scrivere.")
    else:
        print("Modalità: APPLY (scrittura attiva). Backup automatico generato.")

    # === LOGICA SPECIFICA DELLO SCRIPT QUI ===
    # graph = load_graph()
    # ... operazioni ...
    # save_graph(graph, dry_run=dry_run, verbose=args.verbose)

    print("✓ Fatto.")


if __name__ == "__main__":
    main()
