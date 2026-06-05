#!/usr/bin/env python3
"""
normalize_storie.py — Normalizza i file di testo finale: frontmatter
coerente, marker machine-readable in forma canonica, naming file
allineato a unit_id + slug.

Idempotente: rilanciato non modifica file già normalizzati.

Casi tipici di intervento:
- file con frontmatter incompleto o malformato
- marker scena/pagina con campi mancanti
- file rinominati che non riflettono unit_id+slug

Uso:
    python3 _scripts/normalize_storie.py                # dry-run
    python3 _scripts/normalize_storie.py --apply
    python3 _scripts/normalize_storie.py --apply --unit <id>   # solo una unità
"""
import argparse
import os
import re
import shutil
import sys
import time
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
TESTI_FINALI_DIR = Path(os.environ.get("TESTI_FINALI_DIR",
                                         REPO_ROOT / "testi_finali"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--unit", help="normalizza solo una unità")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def find_storie() -> list:
    if not TESTI_FINALI_DIR.exists():
        return []
    # esclude sotto-cartelle tecniche
    return [p for p in TESTI_FINALI_DIR.glob("*.md")
            if not p.parent.name.startswith("_")]


def parse_frontmatter(text: str) -> tuple:
    """Ritorna (frontmatter_dict, body)."""
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not m:
        return {}, text
    fm_text, body = m.groups()
    fm = {}
    for line in fm_text.splitlines():
        m2 = re.match(r"^([a-z_][a-z0-9_]*):\s*(.*)$", line)
        if m2:
            fm[m2.group(1)] = m2.group(2).strip()
    return fm, body


def check_frontmatter(fm: dict) -> list:
    """Ritorna lista di problemi nel frontmatter."""
    issues = []
    required = ["id_unita", "titolo", "slug", "totale_scene",
                "totale_pagine_prodotto", "status", "ultima_modifica"]
    for key in required:
        if key not in fm or not fm[key]:
            issues.append(f"frontmatter manca: {key}")
    return issues


def check_marker_consistency(body: str) -> list:
    """Verifica che i marker scena/pagina siano in forma canonica."""
    issues = []
    scene_markers = re.findall(r"<!--\s*@scena\s+(\S+)", body)
    pagina_markers = re.findall(r"<!--\s*@pagina\s+(\S+)", body)
    for sm in scene_markers:
        if not re.match(r"^[a-z0-9_]+_s\d+$", sm):
            issues.append(f"id scena non canonico: {sm}")
    for pm in pagina_markers:
        if not re.match(r"^[a-z0-9_]+_s\d+[a-z]?$", pm):
            issues.append(f"id pagina non canonico: {pm}")
    return issues


def normalize_file(file_path: Path, dry_run: bool, verbose: bool) -> dict:
    text = file_path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(text)
    issues = check_frontmatter(fm) + check_marker_consistency(body)
    if not issues:
        if verbose:
            print(f"  [{file_path.name}] ok")
        return {"status": "ok", "issues": []}
    if verbose:
        print(f"  [{file_path.name}] {len(issues)} problemi:")
        for i in issues:
            print(f"    - {i}")
    return {"status": "issues", "issues": issues}


def main():
    args = parse_args()
    storie = find_storie()
    if args.unit:
        storie = [s for s in storie if s.name.startswith(args.unit)]
    print(f"Normalize storie ({'DRY-RUN' if not args.apply else 'APPLY'})")
    print(f"  File: {len(storie)}")
    summary = {"ok": 0, "issues": 0}
    for f in storie:
        result = normalize_file(f, not args.apply, args.verbose)
        summary[result["status"]] += 1
    print(f"\n  Riepilogo: {summary}")
    if summary["issues"] > 0:
        print("\n  ⚠ Sono stati rilevati problemi. Per i dettagli: --verbose")
        print("  La correzione automatica non è ancora implementata.")
        print("  TODO: implementare auto-fix per problemi banali (campi default, naming)")


if __name__ == "__main__":
    main()
