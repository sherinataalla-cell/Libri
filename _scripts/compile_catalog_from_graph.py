#!/usr/bin/env python3
"""
compile_catalog_from_graph.py — Bulk meccanico di travaso da fonte
canonica originaria (bibbia / canone-mondo / glossario-consegna esteso)
verso le sezioni delle schede del catalogo.

Pattern: vedi _fasi/04_catalogo/PATTERN_BULK_INIZIALE.md.

Lo script legge una fonte canonica (typically bibbia.md o equivalente),
identifica le sezioni che corrispondono ai campi delle schede catalogo,
travasa il contenuto 1:1 nelle sezioni corrispondenti delle schede.

Idempotente: rilanciato non duplica contenuto. Preserva body modificato
manualmente sotto i marker (vedi convenzione body preservation).

Uso:
    python3 _scripts/compile_catalog_from_graph.py                              # dry-run
    python3 _scripts/compile_catalog_from_graph.py --apply
    python3 _scripts/compile_catalog_from_graph.py --apply --sezioni aspetto,palette
"""
import argparse
import os
import re
import shutil
import sys
import time
from pathlib import Path

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
CATALOG_DIR = Path(os.environ.get("CATALOG_DIR", REPO_ROOT / "catalogo"))
SOURCE_PATH = Path(os.environ.get("BIBBIA_PATH", REPO_ROOT / "bibbia.md"))


# === MAPPA SEZIONI BIBBIA → SEZIONI SCHEDA ===
# Adatta al tuo progetto. Esempio canonico per illustrato:

SECTION_MAPPING = {
    # nome_sezione_scheda: pattern regex per estrarla dalla fonte
    "Aspetto / forma": "{entity_name}.*?Aspetto.*?(?=^##|\\Z)",
    "Abbigliamento / stato d'uso": "{entity_name}.*?Abbigliamento.*?(?=^##|\\Z)",
    "Espressione / comportamento": "{entity_name}.*?Espressione.*?(?=^##|\\Z)",
    "Palette e atmosfera": "{entity_name}.*?Palette.*?(?=^##|\\Z)",
}


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    p.add_argument("--apply", action="store_true", help="scrive davvero")
    p.add_argument("--sezioni",
                   help="csv di sezioni da travasare (default: tutte). "
                        "Es: aspetto,abbigliamento,palette")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def find_schede() -> list:
    """Trova tutte le schede del catalogo."""
    if not CATALOG_DIR.exists():
        return []
    return sorted(CATALOG_DIR.glob("**/scheda.md"))


def extract_section_from_source(source_text: str, entity_name: str,
                                  section_pattern: str) -> str:
    """Estrae la sezione corrispondente dalla fonte canonica.

    TODO: questo è un placeholder. La logica esatta dipende dalla forma
    della fonte canonica del progetto. Esempi possibili:
    - cercare un header `### {entity_name}` e estrarre il body fino al
      prossimo header dello stesso livello
    - parsing strutturato se la fonte è YAML/JSON
    - regex specifici alla forma della bibbia del progetto
    """
    pattern = section_pattern.format(entity_name=re.escape(entity_name))
    m = re.search(pattern, source_text, re.DOTALL | re.MULTILINE)
    return m.group(0).strip() if m else ""


def compile_card(card_path: Path, source_text: str, sezioni_filter: list,
                 dry_run: bool, verbose: bool) -> dict:
    """Compila una scheda con travaso meccanico dalle sezioni della fonte.

    Body preservation: se una sezione della scheda ha contenuto che NON
    è il marker `_da popolare_`, NON la sovrascrive (l'autore ha già
    arricchito).
    """
    card_text = card_path.read_text(encoding="utf-8")
    # estrai entity_name dal frontmatter
    m = re.search(r"^name:\s*(.+)$", card_text, re.MULTILINE)
    entity_name = m.group(1).strip() if m else card_path.parent.name

    counts = {"updated": 0, "skipped_existing": 0, "no_source_match": 0}
    for section_name, section_pattern in SECTION_MAPPING.items():
        if sezioni_filter:
            if not any(s.lower() in section_name.lower() for s in sezioni_filter):
                continue
        section_content = extract_section_from_source(source_text, entity_name,
                                                       section_pattern)
        if not section_content:
            counts["no_source_match"] += 1
            continue
        # cerca il marker della sezione nella scheda
        section_marker = re.compile(rf"^(##\s+{re.escape(section_name)})\s*\n+_da popolare_\s*\n",
                                     re.MULTILINE)
        if section_marker.search(card_text):
            new_card = section_marker.sub(rf"\1\n\n{section_content}\n\n", card_text)
            counts["updated"] += 1
            if dry_run:
                if verbose:
                    print(f"  [{card_path.name}/{section_name}] [dry-run] aggiornerei")
            else:
                card_text = new_card
        else:
            counts["skipped_existing"] += 1
            if verbose:
                print(f"  [{card_path.name}/{section_name}] sezione già popolata, skip")

    if not dry_run and counts["updated"] > 0:
        backup = card_path.with_suffix(f".bak.{time.strftime('%Y%m%d_%H%M%S')}")
        shutil.copy2(card_path, backup)
        card_path.write_text(card_text, encoding="utf-8")
    return counts


def main():
    args = parse_args()
    dry_run = not args.apply
    print(f"Bulk catalog compilation ({'DRY-RUN' if dry_run else 'APPLY'})")

    if not SOURCE_PATH.exists():
        sys.exit(f"❌ Fonte canonica non trovata: {SOURCE_PATH}")
    source_text = SOURCE_PATH.read_text(encoding="utf-8")

    schede = find_schede()
    if not schede:
        sys.exit(f"❌ Nessuna scheda in {CATALOG_DIR}. "
                 f"Eseguire prima promote_entities_to_graph.py --bootstrap-catalog")

    sezioni_filter = args.sezioni.split(",") if args.sezioni else None

    print(f"  Schede: {len(schede)}")
    print(f"  Fonte: {SOURCE_PATH}")
    print(f"  Sezioni filter: {sezioni_filter or 'tutte'}")

    totals = {"updated": 0, "skipped_existing": 0, "no_source_match": 0}
    for card_path in schede:
        counts = compile_card(card_path, source_text, sezioni_filter,
                               dry_run, args.verbose)
        for k, v in counts.items():
            totals[k] += v

    print(f"\n  Riepilogo totale: {totals}")
    if not dry_run:
        print("\n✓ Bulk completato.")


if __name__ == "__main__":
    main()
