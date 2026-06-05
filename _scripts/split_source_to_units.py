#!/usr/bin/env python3
"""
split_source_to_units.py — Split di una fonte testuale unica in N file
narrazione fattuale, uno per unità narrativa.

Pattern: l'autore consegna un documento unico con tutti i fatti del
progetto (es. "trama_completa.md"); lo script lo divide in N file
`<id-unita>_<slug>.md`, uno per unità, in
<repo-progetto>/.../narrazione_fattuale/.

Idempotente: se i file di output esistono già, sovrascrive solo se
--force.

Uso:
    python3 _scripts/split_source_to_units.py --source <path>           # dry-run
    python3 _scripts/split_source_to_units.py --source <path> --apply
    python3 _scripts/split_source_to_units.py --source <path> --apply --force
"""
import argparse
import os
import re
import shutil
import sys
import time
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
OUTPUT_DIR = Path(os.environ.get("NARRAZIONE_DIR",
                                  REPO_ROOT / "narrazione_fattuale"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--source", required=True,
                   help="path al documento sorgente da splittare")
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--force", action="store_true",
                   help="sovrascrive file esistenti")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def parse_source(source_path: str) -> list:
    """Parsea il documento sorgente, ritorna lista di unità.

    Convenzione attesa: ogni unità inizia con un header Markdown di
    livello 2 contenente l'id, formato:
        ## <id-unità> — <Titolo>
    Es: '## cap03 — La Visita Inattesa'

    TODO: adatta il regex al formato sorgente del tuo progetto.
    """
    text = Path(source_path).read_text(encoding="utf-8")
    pattern = re.compile(r"^##\s+([a-z0-9_]+)\s+[—–-]\s+(.+?)$", re.MULTILINE)
    matches = list(pattern.finditer(text))
    units = []
    for i, m in enumerate(matches):
        unit_id = m.group(1)
        title = m.group(2).strip()
        body_start = m.end()
        body_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[body_start:body_end].strip()
        slug = title.lower().replace(" ", "_")
        slug = re.sub(r"[^a-z0-9_]+", "", slug)
        units.append({
            "id": unit_id,
            "title": title,
            "slug": slug,
            "body": body,
        })
    return units


def write_unit(unit: dict, dry_run: bool, force: bool, verbose: bool) -> str:
    """Scrive il file narrazione fattuale per una unità. Ritorna lo
    status: 'created' | 'skipped' | 'overwritten' | 'dry-run'."""
    output_path = OUTPUT_DIR / f"{unit['id']}_{unit['slug']}.md"
    file_text = f"# {unit['title']}\n\n_Id unità: `{unit['id']}`_\n\n{unit['body']}\n"
    if output_path.exists() and not force:
        if verbose:
            print(f"  [{unit['id']}] esiste già, skipping (usa --force)")
        return "skipped"
    if dry_run:
        if verbose:
            print(f"  [{unit['id']}] [dry-run] avrei scritto {output_path}")
        return "dry-run"
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if output_path.exists() and force:
        backup = output_path.with_suffix(f".bak.{time.strftime('%Y%m%d_%H%M%S')}")
        shutil.copy2(output_path, backup)
        if verbose:
            print(f"  [{unit['id']}] backup: {backup}")
        output_path.write_text(file_text, encoding="utf-8")
        return "overwritten"
    output_path.write_text(file_text, encoding="utf-8")
    return "created"


def main():
    args = parse_args()
    dry_run = not args.apply

    print(f"Split sorgente in unità ({'DRY-RUN' if dry_run else 'APPLY'})")
    print(f"  sorgente: {args.source}")
    print(f"  output: {OUTPUT_DIR}")

    units = parse_source(args.source)
    if not units:
        sys.exit("❌ Nessuna unità trovata nel sorgente. Verifica formato header.")

    print(f"  Unità trovate: {len(units)}")

    counts = {"created": 0, "skipped": 0, "overwritten": 0, "dry-run": 0}
    for unit in units:
        status = write_unit(unit, dry_run, args.force, args.verbose)
        counts[status] += 1

    print(f"\n  Riepilogo: {counts}")
    if not dry_run:
        print(f"\n✓ Split completato in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
