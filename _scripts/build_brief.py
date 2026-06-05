#!/usr/bin/env python3
"""
build_brief.py — Genera il writing brief per una unità (o tutte) dal
grafo + narrazione fattuale + catalogo + bibbia + carta voce + pattern AI.

Composizione **puramente meccanica**: zero LLM, zero arricchimenti, zero
inferenze. Idempotente: rilanciato sullo stesso input produce identico
output.

Vedi _fasi/05_brief/_template_brief/SECTIONS.md per le 10 sezioni
canoniche, _fasi/05_brief/_template_brief/MAPPING_SECTIONS_TO_SOURCES.md
per la mappatura sezione → fonte.

Test di accettazione: il brief generato per la unità di reference deve
essere identico (diff vuoto) al brief reference autoriale. Vedi
_fasi/05_brief/_validazione/README.md.

Uso:
    python3 _scripts/build_brief.py --unit <id>          # genera un brief
    python3 _scripts/build_brief.py --all                # tutti i brief
    python3 _scripts/build_brief.py --all --verbose
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
NARRAZIONE_DIR = Path(os.environ.get("NARRAZIONE_DIR",
                                       REPO_ROOT / "narrazione_fattuale"))
BIBBIA_PATH = Path(os.environ.get("BIBBIA_PATH", REPO_ROOT / "bibbia.md"))
CARTA_VOCE_PATH = Path(os.environ.get("CARTA_VOCE_PATH", REPO_ROOT / "carta_voce.md"))
PATTERN_AI_PATH = Path(os.environ.get("PATTERN_AI_PATH", REPO_ROOT / "pattern_ai_da_bandire.md"))
BRIEFS_DIR = Path(os.environ.get("BRIEFS_DIR", REPO_ROOT / "briefs"))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--unit", help="id unità da generare")
    g.add_argument("--all", action="store_true", help="tutti i brief")
    p.add_argument("--verbose", "-v", action="store_true")
    return p.parse_args()


def load_graph() -> dict:
    if not GRAPH_PATH.exists():
        sys.exit(f"❌ Grafo non trovato: {GRAPH_PATH}")
    with open(GRAPH_PATH, encoding="utf-8") as f:
        return json.load(f)


def safe_read(path: Path, fallback: str = "") -> str:
    return path.read_text(encoding="utf-8") if path.exists() else fallback


def find_card(entity_id: str) -> Path:
    """Trova la scheda catalogo di una entità per id."""
    if not CATALOG_DIR.exists():
        return None
    for card_path in CATALOG_DIR.glob("**/scheda.md"):
        if card_path.parent.name == entity_id:
            return card_path
    return None


def section_or_fallback(card_path: Path, section_name: str) -> str:
    """Estrae una sezione `## <section_name>` dalla scheda. Se non trova
    o è `_da popolare_`, ritorna fallback."""
    if not card_path or not card_path.exists():
        return f"_(scheda non trovata)_"
    text = card_path.read_text(encoding="utf-8")
    pattern = re.compile(rf"^##\s+{re.escape(section_name)}\s*\n(.*?)(?=^##|\Z)",
                         re.MULTILINE | re.DOTALL)
    m = pattern.search(text)
    if not m:
        return f"_(sezione {section_name} non trovata in {card_path.name})_"
    content = m.group(1).strip()
    if content == "_da popolare_":
        return f"_(scheda parzialmente popolata, sezione {section_name})_"
    return content


def build_brief_for_unit(graph: dict, unit_id: str, verbose: bool) -> str:
    """Compone il brief per una unità. Vedi SECTIONS.md per le 10 sezioni."""
    unit = graph.get("units", {}).get(unit_id)
    if not unit:
        sys.exit(f"❌ Unità '{unit_id}' non trovata nel grafo")

    out = []

    # Sezione 1 — Frontmatter machine-readable
    out.append(f"""---
unita_id: {unit_id}
titolo: {unit.get("title", "")}
slug: {unit.get("slug", "")}
posizione: {unit.get("position", "")}
registro: {unit.get("register", "")}
lunghezza_target: {unit.get("estimated_length", "")}
ambient_conditions: {json.dumps(unit.get("ambient_conditions", {}), ensure_ascii=False)}
status_brief: bozza
generato_il: {time.strftime("%Y-%m-%d")}
schema_brief_version: "1.0"
---

# Brief — {unit.get("title", unit_id)}
""")

    # Sezione 2 — Core narrativo
    out.append(f"""## 2 — Core narrativo

**Premessa:** {unit.get("premise") or "_(non specificata)_"}

**Problema:** {unit.get("problem") or "_(non specificato)_"}

**Soglia:** {unit.get("threshold_moment") or "_(non specificata)_"}

**Risoluzione:** {unit.get("resolution_mode") or "_(non specificata)_"}
""")

    # Sezione 3 — Narrazione fattuale (integrale)
    nf_path = NARRAZIONE_DIR / f"{unit_id}_{unit.get('slug', '')}.md"
    if not nf_path.exists():
        # fallback: cerca file che inizia con unit_id
        candidates = list(NARRAZIONE_DIR.glob(f"{unit_id}*.md")) if NARRAZIONE_DIR.exists() else []
        nf_path = candidates[0] if candidates else None
    nf_content = safe_read(nf_path, "_(narrazione fattuale non trovata)_") if nf_path else "_(narrazione fattuale non trovata)_"
    out.append(f"## 3 — Narrazione fattuale (integrale)\n\n{nf_content}\n")

    # Sezione 4 — Inventario scene/hook
    out.append("## 4 — Inventario scene/hook\n")
    for scene in unit.get("scenes", []):
        loc = scene.get("location") or {}
        out.append(f"""
### Scena {scene.get("position")} — `{scene.get("id")}`

- **Tipo**: {scene.get("type") or "—"}
- **Momento**: {scene.get("moment") or "—"}
- **Location**: {loc.get("id") or "—"} (qualifier: {loc.get("qualifier") or "—"})
- **Cast presente**: {", ".join(scene.get("characters_present", []) or []) or "—"}
- **Focal action**: {scene.get("focal_action") or "—"}
- **Atmosfera**: {scene.get("atmosphere") or "—"}
- **Palette**: {scene.get("palette") or "—"}
""")

    # Sezione 5 — Cast in scena
    out.append("## 5 — Cast in scena\n")
    for cast_entry in unit.get("cast_in_scene", []):
        eid = cast_entry.get("entity_id")
        card = find_card(eid)
        # voce dal grafo (campo voice dell'entità a livello macro)
        voice_data = {}
        for cat, ents in graph.get("entities", {}).items():
            if eid in ents:
                voice_data = ents[eid].get("voice", {}) or {}
                ent_name = ents[eid].get("name", eid)
                break
        else:
            ent_name = eid
        frasi = "\n".join(f"  - «{f}»" for f in voice_data.get("frasi_codice", []) or [])
        canone_visivo = section_or_fallback(card, "Aspetto / forma")
        out.append(f"""
### {ent_name} (`{eid}`)

- **Ruolo nella unità**: {cast_entry.get("role_in_unit") or "—"}
- **Modalità attiva**: {cast_entry.get("active_modality") or "—"}
- **Vincoli locali**: {json.dumps(cast_entry.get("vincoli_locali", {}), ensure_ascii=False)}

**Voce**:
- Registro: {voice_data.get("register") or "—"}
- Frasi-codice (inalterabili):
{frasi if frasi else "  _(nessuna)_"}

**Canone visivo (dalla scheda catalogo)**:

{canone_visivo}
""")

    # Sezione 6 — Convenzioni del mondo
    out.append("## 6 — Convenzioni del mondo applicabili\n")
    out.append("_(travaso filtrato dalla bibbia, sezione convenzioni applicabili a questa unità — TODO: implementare filtro)_\n")
    # TODO: logica di filtro convenzioni applicabili dipende dalla forma della bibbia

    # Sezione 7 — Relazioni narrative
    out.append("## 7 — Relazioni narrative\n")
    out.append(f"""
**Callback chiamati qui**: {", ".join(unit.get("callbacks_in", []) or []) or "_(nessuno)_"}

**Seeds piantati qui**: {", ".join(unit.get("seeds_planted", []) or []) or "_(nessuno)_"}
**Seeds che fioriscono qui**: {", ".join(unit.get("seeds_blooming", []) or []) or "_(nessuno)_"}
**Seeds che maturano qui**: {", ".join(unit.get("seeds_maturing", []) or []) or "_(nessuno)_"}

**Debts aperti qui**: {", ".join(unit.get("debts_opened", []) or []) or "_(nessuno)_"}
**Debts chiusi qui**: {", ".join(unit.get("debts_closed", []) or []) or "_(nessuno)_"}
""")

    # Sezione 8 — Vincoli universali (carta voce + pattern AI integrali)
    out.append("## 8 — Vincoli universali\n\n### 8.1 — Carta voce (integrale)\n\n")
    out.append(safe_read(CARTA_VOCE_PATH, "_(carta voce non trovata)_"))
    out.append("\n\n### 8.2 — Pattern AI da bandire (integrale)\n\n")
    out.append(safe_read(PATTERN_AI_PATH, "_(pattern AI non trovato)_"))

    # Sezione 9 — Quote tracker awareness
    out.append("\n\n## 9 — Quote tracker awareness\n")
    qt = graph.get("quote_tracker", {})
    out.append(f"\n```json\n{json.dumps(qt, ensure_ascii=False, indent=2)}\n```\n")
    out.append("\n_(TODO: computare stato corrente per questa unità — vincoli attivi, quote consumate, quote residue saga)_\n")

    # Sezione 10 — Istruzione operativa
    out.append(f"""
## 10 — Istruzione operativa all'agente prosa

Modalità: collaborativa, una scena/pagina alla volta.

Lunghezza target: {unit.get("estimated_length", "—")} parole ±15%.

Formato di ogni blocco:

```
### <Etichetta unità> — <id>

[testo finale]

---
*Note tecniche:*
- frasi-codice integrate: «...»
- vincoli applicati: ...
- punti di incertezza: [se ce ne sono]
```

Aspetta sempre validazione autoriale fra una scena e la successiva. Mai 2+ blocchi in fila senza pausa.

Vincoli inalterabili: vedi §8 (carta voce + pattern AI da bandire).

Frasi-codice: integrate letterali, mai modificate.

Onomatopee firma del progetto: usa solo se previste dal brief, mai in italics gratuiti.
""")

    return "\n".join(out)


def main():
    args = parse_args()
    graph = load_graph()
    BRIEFS_DIR.mkdir(parents=True, exist_ok=True)

    if args.unit:
        unit_ids = [args.unit]
    else:
        unit_ids = list(graph.get("units", {}).keys())

    print(f"Build brief per {len(unit_ids)} unità → {BRIEFS_DIR}")
    success, failed = 0, 0
    for uid in unit_ids:
        try:
            brief = build_brief_for_unit(graph, uid, args.verbose)
            output_path = BRIEFS_DIR / f"{uid}_brief.md"
            output_path.write_text(brief, encoding="utf-8")
            success += 1
            if args.verbose:
                print(f"  ✓ {uid} → {output_path}")
        except SystemExit:
            failed += 1
        except Exception as e:
            failed += 1
            print(f"  ✗ {uid}: {e}")

    print(f"\n✓ Generati: {success}/{len(unit_ids)}, falliti: {failed}")


if __name__ == "__main__":
    main()
