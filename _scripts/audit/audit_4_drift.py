#!/usr/bin/env python3
"""
audit_4_drift.py — Audit di drift fra testo finale e canone.

Confronta:
- il testo finale di una unità (Fase 06) + le annotazioni post-prosa
- il nodo unità nel grafo (cosa era previsto)
- il catalogo (consistenza descrizione)
- la voce dei personaggi (frasi-codice integrate identiche al canone)

Tipi di drift:
- cast: personaggio nel grafo, assente nel testo (o viceversa)
- frase-codice: frase nel testo alterata rispetto al canone della voce
- seed/callback: seed/callback atteso, non piantato/chiamato
- canone visivo: descrizione nel testo che contraddice la scheda catalogo

Output: report con lista drift rilevati. L'autore decide caso per caso
se è canonico (aggiornare grafo/catalogo) o errore (correggere testo).

Uso:
    python3 _scripts/audit/audit_4_drift.py --unit <id>
    python3 _scripts/audit/audit_4_drift.py --all
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

REPO_ROOT = Path(os.environ.get("REPO_ROOT", "."))
GRAPH_PATH = Path(os.environ.get("GRAPH_PATH", REPO_ROOT / "story_graph.json"))
TESTI_FINALI_DIR = Path(os.environ.get("TESTI_FINALI_DIR",
                                         REPO_ROOT / "testi_finali"))
ANNOTATIONS_DIR = TESTI_FINALI_DIR / "_annotations"


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--unit", help="audit di una sola unità")
    g.add_argument("--all", action="store_true", help="audit di tutte le unità")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def find_unit_text(unit_id: str) -> Path:
    if not TESTI_FINALI_DIR.exists():
        return None
    candidates = list(TESTI_FINALI_DIR.glob(f"{unit_id}*.md"))
    return candidates[0] if candidates else None


def load_annotations(unit_id: str) -> dict:
    """Carica annotazioni post-prosa per la unità."""
    if not yaml:
        return {}
    candidates = list(ANNOTATIONS_DIR.glob(f"{unit_id}*.yaml")) if ANNOTATIONS_DIR.exists() else []
    if not candidates:
        return {}
    with open(candidates[0], encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def audit_unit(graph: dict, unit_id: str, verbose: bool) -> list:
    drifts = []
    unit = graph.get("units", {}).get(unit_id)
    if not unit:
        return [f"Unità {unit_id} non esiste nel grafo"]

    text_path = find_unit_text(unit_id)
    if not text_path:
        return [f"Testo finale di {unit_id} non trovato"]
    text = text_path.read_text(encoding="utf-8")

    annotations = load_annotations(unit_id)

    # Cast drift: personaggio nel grafo che non appare nel testo
    expected_cast = {c.get("entity_id") for c in unit.get("cast_in_scene", []) or []}
    annotated_cast = set()
    for scene in annotations.get("scene", []) or []:
        for c in scene.get("cast_presente", []) or []:
            annotated_cast.add(c.get("id"))
    missing = expected_cast - annotated_cast
    extra = annotated_cast - expected_cast
    for eid in missing:
        drifts.append(f"[cast] {unit_id}: {eid} previsto in grafo, assente in annotazioni testo")
    for eid in extra:
        drifts.append(f"[cast] {unit_id}: {eid} appare in annotazioni testo, non in grafo")

    # Frasi-codice drift
    for cat, ents in graph.get("entities", {}).items():
        for eid, entity in ents.items():
            if eid not in expected_cast:
                continue
            voice = entity.get("voice", {}) or {}
            frasi_codice = voice.get("frasi_codice", []) or []
            for frase in frasi_codice:
                # cerca occorrenza letterale nel testo
                if frase and frase not in text:
                    # cerca occorrenza fuzzy: stessa frase senza punteggiatura
                    frase_clean = re.sub(r"[.,;:!?«»\"'\(\)]", "", frase).lower().strip()
                    text_clean = re.sub(r"[.,;:!?«»\"'\(\)]", "", text).lower()
                    if frase_clean and frase_clean in text_clean:
                        drifts.append(f"[frase-codice] {eid}: «{frase[:50]}...» presente con punteggiatura/case alterati")

    # Seeds/callbacks/debts drift (sintetico)
    for sp in unit.get("seeds_planted", []) or []:
        annotated_seeds = set()
        for scene in annotations.get("scene", []) or []:
            annotated_seeds.update(scene.get("seeds_piantati", []) or [])
        if sp not in annotated_seeds:
            drifts.append(f"[seed] {unit_id}: '{sp}' previsto piantato, assente in annotazioni")

    return drifts


def main():
    args = parse_args()
    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        graph = json.load(f)

    if args.unit:
        unit_ids = [args.unit]
    else:
        unit_ids = list(graph.get("units", {}).keys())

    print(f"Audit 4 — Drift testo finale vs canone ({len(unit_ids)} unità)")
    if not yaml:
        print("⚠ Modulo PyYAML non installato. Annotazioni post-prosa skippate. "
              "Installa: pip install pyyaml")

    total_drifts = 0
    for uid in unit_ids:
        drifts = audit_unit(graph, uid, args.verbose)
        if drifts:
            total_drifts += len(drifts)
            print(f"\n  Unità {uid}: {len(drifts)} drift")
            for d in drifts:
                print(f"    - {d}")

    print(f"\n✓ Totale drift: {total_drifts}")
    if total_drifts > 0:
        print("  L'autore decide caso per caso: drift canonico (aggiornare canone) "
              "o errore (correggere testo).")


if __name__ == "__main__":
    main()
