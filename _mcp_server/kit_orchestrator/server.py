"""kit-orchestrator — MCP server per la pipeline narrativa del kit.

Espone all'orchestratrice (Claude Code) un set di tool nominali per
operare sul progetto narrativo dell'utente, senza che l'orchestratrice
debba conoscere path, env vars, sequenze di script.

Pattern: thin layer sopra gli script Python idempotenti del kit. Ogni
tool è un wrapper di uno script (o una combinazione di script) con tipi
chiari, documentazione strutturata, gestione uniforme degli errori.

Avvio:
    kit-orchestrator                          # stdio mode (per Claude Code)
    REPO_ROOT=/path/to/progetto kit-orchestrator

Registrazione in Claude Code (`.mcp.json` o `claude_desktop_config.json`):
    {
      "mcpServers": {
        "kit-orchestrator": {
          "command": "kit-orchestrator",
          "env": { "REPO_ROOT": "/path/to/your/project" }
        }
      }
    }
"""

import json
from pathlib import Path
from typing import Optional

from mcp.server.fastmcp import FastMCP

from .config import KitConfig
from ._lib.script_runner import run_script

# === Bootstrap del server ===

mcp = FastMCP("kit-orchestrator")

# Config globale (usata da tutti i tool). Il REPO_ROOT viene risolto
# dall'env all'avvio. Cambiare progetto in vivo richiede restart del server.
_config: Optional[KitConfig] = None


def get_config() -> KitConfig:
    global _config
    if _config is None:
        _config = KitConfig()
    return _config


def _scripts_dir() -> Path:
    return get_config().kit_scripts_dir()


# === RESOURCES ===
# Risorse leggibili dall'orchestratrice senza side-effects.

@mcp.resource("kit://config")
def resource_config() -> str:
    """Configurazione corrente del kit per il progetto adottante.

    Path canonici (grafo, catalogo, bibbia, ecc.) e stato variabili
    d'ambiente. Letto dall'orchestratrice per orientarsi al primo turno.
    """
    cfg = get_config()
    paths = {
        "repo_root": str(cfg.repo_root),
        "graph_path": str(cfg.graph_path),
        "schema_path": str(cfg.schema_path),
        "catalog_dir": str(cfg.catalog_dir),
        "bibbia_path": str(cfg.bibbia_path),
        "carta_voce_path": str(cfg.carta_voce_path),
        "pattern_ai_path": str(cfg.pattern_ai_path),
        "narrazione_dir": str(cfg.narrazione_dir),
        "briefs_dir": str(cfg.briefs_dir),
        "testi_finali_dir": str(cfg.testi_finali_dir),
        "glossary_path": str(cfg.glossary_path),
        "catalog_index_path": str(cfg.catalog_index_path),
        "web_dir": str(cfg.web_dir),
        "stato_progetto_path": str(cfg.stato_progetto_path),
        "log_sincronizzazione_path": str(cfg.log_sincronizzazione_path),
        "kit_scripts_dir": str(cfg.kit_scripts_dir()),
    }
    existence = {k: Path(v).exists() for k, v in paths.items()}
    return json.dumps(
        {"paths": paths, "existence": existence}, indent=2, ensure_ascii=False
    )


@mcp.resource("kit://status")
def resource_status() -> str:
    """Stato corrente del progetto: STATO_PROGETTO.md + LOG_SINCRONIZZAZIONE.md.

    Punto di ingresso dell'orchestratrice all'inizio di una sessione.
    Restituisce i due file canonici di stato (Markdown) per orientarsi
    su dove siamo nel progetto e cosa è stato fatto di recente.
    """
    cfg = get_config()
    out = {}
    if cfg.stato_progetto_path.exists():
        out["stato_progetto"] = cfg.stato_progetto_path.read_text(
            encoding="utf-8"
        )
    else:
        out["stato_progetto"] = (
            f"_(file non trovato: {cfg.stato_progetto_path})_"
        )
    if cfg.log_sincronizzazione_path.exists():
        out["log_sincronizzazione"] = cfg.log_sincronizzazione_path.read_text(
            encoding="utf-8"
        )
    else:
        out["log_sincronizzazione"] = (
            f"_(file non trovato: {cfg.log_sincronizzazione_path})_"
        )
    return json.dumps(out, indent=2, ensure_ascii=False)


# === TOOLS — Fase 02 (schema grafo) ===

@mcp.tool()
def bootstrap_graph(apply: bool = False, force: bool = False) -> dict:
    """Inizializza il grafo del progetto dal glossario-consegna + schema.

    Crea il grafo iniziale popolato a livello macro (tutte le entità del
    glossario promosse), con livelli medio/micro vuoti. Idempotente.

    Args:
        apply: se False (default), dry-run; se True scrive davvero
        force: se True sovrascrive un grafo esistente (con backup)
    """
    args = []
    if apply:
        args.append("--apply")
    if force:
        args.append("--force")
    result = run_script(
        _scripts_dir() / "bootstrap_graph.py", args, get_config()
    )
    return result.to_dict()


@mcp.tool()
def migrate_schema(migration: str, apply: bool = False) -> dict:
    """Applica una migrazione one-shot additiva allo schema del grafo.

    Le migrazioni sono dichiarative, definite nello script
    `migrate_schema.py`. Solo aggiunte additive (campi nuovi retroattivi
    a `null`). Rimozioni e rinominazioni vietate post-congelamento.

    Args:
        migration: nome della migrazione da applicare
        apply: se False dry-run; se True scrive con backup canonico
    """
    args = ["--migration", migration]
    if apply:
        args.append("--apply")
    result = run_script(
        _scripts_dir() / "migrate_schema.py", args, get_config()
    )
    return result.to_dict()


# === TOOLS — Fase 03 (distillazione) ===

@mcp.tool()
def write_unit_to_graph(
    unit: str,
    yaml_unit: str,
    yaml_scenes: Optional[str] = None,
    apply: bool = False,
) -> dict:
    """Scrive un nodo unità nel grafo dal YAML deterministico.

    Esegue ~16 controlli pre-scrittura (campi obbligatori, id univoci,
    referenze valide, vincoli quote_tracker). Idempotente: rilanciato
    sullo stesso input non incrementa contatori.

    Args:
        unit: id unità (es. "cap03")
        yaml_unit: path al YAML del livello medio
        yaml_scenes: path al YAML del livello micro (opzionale)
        apply: se False dry-run; se True scrive con backup canonico
    """
    args = ["--unit", unit, "--yaml-unit", yaml_unit]
    if yaml_scenes:
        args.extend(["--yaml-scenes", yaml_scenes])
    if apply:
        args.append("--apply")
    result = run_script(
        _scripts_dir() / "write_node_to_graph.py", args, get_config()
    )
    return result.to_dict()


@mcp.tool()
def split_source_to_units(
    source: str, apply: bool = False, force: bool = False
) -> dict:
    """Splitta un documento sorgente unico in N file narrazione fattuale.

    Convenzione header attesa: ogni unità inizia con `## <id> — <Titolo>`.

    Args:
        source: path al documento sorgente
        apply: se False dry-run; se True scrive
        force: se True sovrascrive file esistenti (con backup)
    """
    args = ["--source", source]
    if apply:
        args.append("--apply")
    if force:
        args.append("--force")
    result = run_script(
        _scripts_dir() / "split_source_to_units.py", args, get_config()
    )
    return result.to_dict()


@mcp.tool()
def promote_entities(
    queue: Optional[str] = None,
    bootstrap_catalog: bool = False,
    apply: bool = False,
) -> dict:
    """Promuove entità nuove al grafo + crea schede embrionali nel catalogo.

    Due modalità:
    - bootstrap_catalog=True: crea schede embrionali per tutte le entità
      che esistono nel grafo macro ma non hanno scheda
    - queue=path: legge una coda JSON di entità da promuovere

    Args:
        queue: path JSON con coda entità
        bootstrap_catalog: se True, crea schede per tutto il grafo
        apply: se False dry-run; se True scrive
    """
    if bootstrap_catalog and queue:
        return {
            "success": False,
            "stderr": "Errore: --bootstrap-catalog e --queue mutuamente esclusivi",
            "returncode": -1,
        }
    args = []
    if bootstrap_catalog:
        args.append("--bootstrap-catalog")
    elif queue:
        args.extend(["--queue", queue])
    else:
        return {
            "success": False,
            "stderr": "Errore: serve --bootstrap-catalog o --queue",
            "returncode": -1,
        }
    if apply:
        args.append("--apply")
    result = run_script(
        _scripts_dir() / "promote_entities_to_graph.py", args, get_config()
    )
    return result.to_dict()


# === TOOLS — Fase 04 (catalogo) ===

@mcp.tool()
def compile_catalog(
    sezioni: Optional[str] = None, apply: bool = False
) -> dict:
    """Bulk meccanico travaso da fonte canonica → schede catalogo.

    Pattern: travaso 1:1 dove i campi combaciano, marker `_da popolare_`
    dove non c'è derivazione. Body preservation: non sovrascrive sezioni
    già modificate manualmente.

    Args:
        sezioni: csv di sezioni da travasare (default: tutte)
        apply: se False dry-run; se True scrive
    """
    args = []
    if sezioni:
        args.extend(["--sezioni", sezioni])
    if apply:
        args.append("--apply")
    result = run_script(
        _scripts_dir() / "compile_catalog_from_graph.py", args, get_config()
    )
    return result.to_dict()


@mcp.tool()
def build_catalog_index() -> dict:
    """Genera l'indice JSON machine-readable del catalogo.

    Legge tutte le schede + il grafo, produce JSON con metadati frontmatter
    + statistiche apparizioni. Output: `<catalog_index_path>` (default:
    catalogo_index/data/entities.json).

    Idempotente: rilanciato produce identico output a parità di stato.
    """
    result = run_script(
        _scripts_dir() / "build_catalog_index.py", [], get_config()
    )
    return result.to_dict()


# === TOOLS — Fase 05 (brief) ===

@mcp.tool()
def build_brief(
    unit: Optional[str] = None, all_units: bool = False
) -> dict:
    """Genera il/i brief autosufficiente/i per le unità del progetto.

    Composizione **puramente meccanica** (zero LLM). Idempotente.

    Args:
        unit: id unità singola da generare (mutually exclusive con all_units)
        all_units: se True, genera tutti i brief

    Esattamente uno dei due deve essere fornito.
    """
    if unit and all_units:
        return {
            "success": False,
            "stderr": "Errore: unit e all_units mutuamente esclusivi",
            "returncode": -1,
        }
    if not unit and not all_units:
        return {
            "success": False,
            "stderr": "Errore: serve unit=<id> o all_units=True",
            "returncode": -1,
        }
    args = ["--all"] if all_units else ["--unit", unit]
    result = run_script(
        _scripts_dir() / "build_brief.py", args, get_config()
    )
    return result.to_dict()


# === TOOLS — Fase 06 (prosa) ===

@mcp.tool()
def normalize_storie(unit: Optional[str] = None, apply: bool = False) -> dict:
    """Normalizza i file di testo finale (frontmatter + marker canonici).

    Verifica forma canonica del frontmatter, marker scena/pagina-prodotto
    coerenti, naming file allineato.

    Args:
        unit: normalizza solo una unità (default: tutte)
        apply: se False dry-run; se True scrive (correzione automatica
               attualmente limitata, vedi script TODO)
    """
    args = []
    if unit:
        args.extend(["--unit", unit])
    if apply:
        args.append("--apply")
    result = run_script(
        _scripts_dir() / "normalize_storie.py", args, get_config()
    )
    return result.to_dict()


# === TOOLS — Audit ===

@mcp.tool()
def audit_graph(audit: Optional[str] = None) -> dict:
    """Lancia uno o tutti i 4 audit del grafo.

    - 1_integrity: campi obbligatori, JSON valido
    - 2_schema: validazione contro JSON Schema
    - 3_navigability: referenze fra nodi (cast, location, callbacks, seeds)
    - 4_drift: drift testo finale vs canone

    Args:
        audit: nome audit specifico (1_integrity / 2_schema /
               3_navigability / 4_drift). Default: lancia tutti.
    """
    cfg = get_config()
    audits = (
        [audit]
        if audit
        else ["1_integrity", "2_schema", "3_navigability", "4_drift"]
    )
    results = {}
    for a in audits:
        script_name = f"audit_{a}.py"
        # 4_drift richiede --all
        args = ["--all"] if a == "4_drift" else []
        result = run_script(
            _scripts_dir() / "audit" / script_name, args, cfg
        )
        results[a] = result.to_dict()
    overall_success = all(r["success"] for r in results.values())
    return {"success": overall_success, "audits": results}


# === TOOLS — Web cruscotto ===

@mcp.tool()
def rebuild_web_data() -> dict:
    """Rigenera i 3 file JSON che alimentano il cruscotto web.

    Esegue in sequenza i 3 prebuild script di `web/scripts/`:
    - copy-data.mjs (entities.json + storie-dashboard.json)
    - build-orchestra-data.mjs (orchestra.json dal grafo)
    - build-storie.mjs (storie.json dai testi finali)

    Da chiamare dopo modifiche al grafo, catalogo, narrazioni fattuali,
    o testi finali, per vedere l'aggiornamento nel cruscotto Next.js.

    L'utente deve avere `web/` dentro il progetto e aver fatto `npm install`
    almeno una volta. Riconosce sia `web/` in radice progetto sia
    `_starter_kit/web/`.
    """
    cfg = get_config()
    web_dirs = [
        cfg.repo_root / "web",
        cfg.repo_root / "_starter_kit" / "web",
    ]
    web_dir = next((d for d in web_dirs if d.exists()), None)
    if not web_dir:
        return {
            "success": False,
            "stderr": (
                f"Cartella web/ non trovata. Cercato in: "
                f"{', '.join(str(d) for d in web_dirs)}"
            ),
            "returncode": -1,
        }

    import subprocess

    scripts = [
        "copy-data.mjs",
        "build-orchestra-data.mjs",
        "build-storie.mjs",
    ]
    results = {}
    for script in scripts:
        script_path = web_dir / "scripts" / script
        if not script_path.exists():
            results[script] = {
                "success": False,
                "stderr": f"Script non trovato: {script_path}",
            }
            continue
        try:
            proc = subprocess.run(
                ["node", str(script_path)],
                env=cfg.env_for_subprocess(),
                cwd=str(web_dir),
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
            results[script] = {
                "success": proc.returncode == 0,
                "stdout": proc.stdout.strip(),
                "stderr": proc.stderr.strip(),
                "returncode": proc.returncode,
            }
        except Exception as e:
            results[script] = {
                "success": False,
                "stderr": f"{type(e).__name__}: {e}",
            }
    overall_success = all(r["success"] for r in results.values())
    return {
        "success": overall_success,
        "web_dir": str(web_dir),
        "scripts": results,
        "note": (
            "L'app Next.js in dev mode dovrebbe rilevare i file aggiornati e "
            "ricaricare automaticamente. Se non lo fa, forza un refresh "
            "browser (Cmd/Ctrl+R)."
        ),
    }


# === TOOLS — Inspection ===

@mcp.tool()
def get_project_status() -> dict:
    """Ritorna stato corrente del progetto come JSON strutturato.

    Combina:
    - esistenza dei file canonici (grafo, catalogo, bibbia, ecc.)
    - dimensioni file principali
    - conteggio entità per categoria nel grafo (se esiste)
    - conteggio unità narrative nel grafo (se esiste)
    - ultimo audit registrato (se esiste)

    Versione "live" dello stato — non legge da STATO_PROGETTO.md ma
    interroga il filesystem direttamente.
    """
    cfg = get_config()
    status = {
        "repo_root": str(cfg.repo_root),
        "files": {},
        "graph_summary": None,
    }

    files_to_check = [
        ("graph", cfg.graph_path),
        ("schema", cfg.schema_path),
        ("bibbia", cfg.bibbia_path),
        ("carta_voce", cfg.carta_voce_path),
        ("pattern_ai", cfg.pattern_ai_path),
        ("glossary", cfg.glossary_path),
        ("catalog_index", cfg.catalog_index_path),
        ("stato_progetto", cfg.stato_progetto_path),
        ("log_sincronizzazione", cfg.log_sincronizzazione_path),
    ]
    for name, path in files_to_check:
        if path.exists():
            stat = path.stat()
            status["files"][name] = {
                "exists": True,
                "path": str(path),
                "size_bytes": stat.st_size,
                "modified_at": stat.st_mtime,
            }
        else:
            status["files"][name] = {"exists": False, "path": str(path)}

    status["files"]["catalog_dir"] = {
        "exists": cfg.catalog_dir.exists(),
        "path": str(cfg.catalog_dir),
        "schede_count": (
            len(list(cfg.catalog_dir.glob("**/scheda.md")))
            if cfg.catalog_dir.exists()
            else 0
        ),
    }
    status["files"]["narrazione_dir"] = {
        "exists": cfg.narrazione_dir.exists(),
        "path": str(cfg.narrazione_dir),
        "files_count": (
            len(list(cfg.narrazione_dir.glob("*.md")))
            if cfg.narrazione_dir.exists()
            else 0
        ),
    }
    status["files"]["briefs_dir"] = {
        "exists": cfg.briefs_dir.exists(),
        "path": str(cfg.briefs_dir),
        "briefs_count": (
            len(list(cfg.briefs_dir.glob("*_brief.md")))
            if cfg.briefs_dir.exists()
            else 0
        ),
    }

    if cfg.graph_path.exists():
        try:
            graph = json.loads(cfg.graph_path.read_text(encoding="utf-8"))
            entities_count = {
                cat: len(ents)
                for cat, ents in graph.get("entities", {}).items()
            }
            status["graph_summary"] = {
                "schema_version": graph.get("schema_version"),
                "graph_version": graph.get("graph_version"),
                "project": graph.get("project", {}),
                "entities_count": entities_count,
                "units_count": len(graph.get("units", {})),
                "global_relations_count": {
                    k: len(v)
                    for k, v in (graph.get("global_relations") or {}).items()
                    if isinstance(v, dict)
                },
                "last_audit": graph.get("audit", {}).get("last_run"),
            }
        except (json.JSONDecodeError, Exception) as e:
            status["graph_summary"] = {"error": f"{type(e).__name__}: {e}"}

    return status


@mcp.tool()
def read_canonical_file(file: str, max_chars: int = 20000) -> dict:
    """Legge un file canonico del progetto per ispezione (no side effects).

    Limitato ai file canonici dichiarati nel kit (grafo, bibbia, carta voce,
    pattern AI, schede catalogo, brief, narrazioni fattuali). Niente
    accesso arbitrario al filesystem.

    Args:
        file: tipo o path. Tipi accettati: "graph", "schema", "bibbia",
              "carta_voce", "pattern_ai", "glossary",
              "catalog/<entity_id>", "brief/<unit_id>",
              "narrazione/<unit_id>", "stato_progetto",
              "log_sincronizzazione".
        max_chars: massimo caratteri da restituire (default 20k)
    """
    cfg = get_config()
    target_path: Optional[Path] = None
    type_known: bool = True

    if file == "graph":
        target_path = cfg.graph_path
    elif file == "schema":
        target_path = cfg.schema_path
    elif file == "bibbia":
        target_path = cfg.bibbia_path
    elif file == "carta_voce":
        target_path = cfg.carta_voce_path
    elif file == "pattern_ai":
        target_path = cfg.pattern_ai_path
    elif file == "glossary":
        target_path = cfg.glossary_path
    elif file == "stato_progetto":
        target_path = cfg.stato_progetto_path
    elif file == "log_sincronizzazione":
        target_path = cfg.log_sincronizzazione_path
    elif file.startswith("catalog/"):
        entity_id = file[len("catalog/") :]
        candidates = list(
            cfg.catalog_dir.glob(f"**/{entity_id}/scheda.md")
        ) if cfg.catalog_dir.exists() else []
        if not candidates:
            return {
                "success": False,
                "error": f"Scheda catalog/{entity_id} non trovata",
            }
        target_path = candidates[0]
    elif file.startswith("brief/"):
        unit_id = file[len("brief/") :]
        target_path = cfg.briefs_dir / f"{unit_id}_brief.md"
    elif file.startswith("narrazione/"):
        unit_id = file[len("narrazione/") :]
        candidates = (
            list(cfg.narrazione_dir.glob(f"{unit_id}*.md"))
            if cfg.narrazione_dir.exists()
            else []
        )
        if not candidates:
            return {
                "success": False,
                "error": f"Narrazione/{unit_id} non trovata",
            }
        target_path = candidates[0]
    else:
        type_known = False

    if not type_known:
        return {
            "success": False,
            "error": (
                f"Tipo non riconosciuto: '{file}'. Tipi accettati: graph, "
                "schema, bibbia, carta_voce, pattern_ai, glossary, "
                "stato_progetto, log_sincronizzazione, catalog/<id>, "
                "brief/<unit_id>, narrazione/<unit_id>."
            ),
        }
    if not target_path or not target_path.exists():
        return {
            "success": False,
            "error": f"File non esiste: {target_path}",
        }
    try:
        content = target_path.read_text(encoding="utf-8")
        truncated = False
        if len(content) > max_chars:
            content = content[:max_chars]
            truncated = True
        return {
            "success": True,
            "path": str(target_path),
            "size_bytes": target_path.stat().st_size,
            "content": content,
            "truncated": truncated,
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"{type(e).__name__}: {e}",
        }


# === TOOLS — Agenti foreground ===
# Vedi _convenzioni/agenti_foreground.md per la convenzione completa.

def _agent_dir(agent_name: str) -> Optional[Path]:
    """Risolve la cartella di un agente foreground."""
    cfg = get_config()
    candidate = cfg.agenti_dir / agent_name
    return candidate if candidate.exists() else None


def _isoformat_now() -> str:
    """ISO datetime corrente in UTC."""
    from datetime import datetime, timezone

    return (
        datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    )


@mcp.tool()
def prepare_agent_session(
    agent_name: str,
    objective: str,
    context: str = "",
    input_files: Optional[dict] = None,
    expected_outputs: Optional[list] = None,
    constraints: Optional[list] = None,
    canonical_refs: Optional[dict] = None,
    overwrite_pending: bool = False,
) -> dict:
    """Prepara la sessione di un agente foreground (BRIEFING + INPUT + log).

    Crea la struttura `_sessione_corrente/` dell'agente con:
    - BRIEFING.md compilato dai parametri (6 sezioni canoniche)
    - INPUT/ con i file passati in `input_files`
    - OUTPUT/ vuota
    - _log_sessione.md inizializzato con entry [SETUP]

    L'orchestratrice usa questo tool prima di passare la sessione all'utente.

    Args:
        agent_name: nome dell'agente (deve esistere come `_agenti/<nome>/`)
        objective: §1 del briefing — cosa deve fare l'agente, 2-5 frasi
        context: §2 — contesto rilevante, 1-2 paragrafi (default: vuoto)
        input_files: dict {"nome_file": "contenuto"} — file da scrivere in INPUT/
                     (default: nessun file)
        expected_outputs: §4 — lista di stringhe descrittive degli output attesi
                          (default: lista vuota, segnala che non ci sono output
                          obbligatori)
        constraints: §5 — lista di stringhe con i vincoli specifici della sessione
        canonical_refs: §3 — dict {"nome": "path"} per file canonici referenziati
                        per path assoluto (NON copiati in INPUT/)
        overwrite_pending: se True e una sessione precedente è in
                           `_sessione_corrente/` non chiusa, archivia
                           come `aborted` prima di sovrascrivere. Default False.
    """
    cfg = get_config()
    agent_dir = _agent_dir(agent_name)
    if not agent_dir:
        return {
            "success": False,
            "error": (
                f"Agente '{agent_name}' non trovato in {cfg.agenti_dir}. "
                f"Verifica che esista la cartella _agenti/{agent_name}/."
            ),
        }
    sessione = agent_dir / "_sessione_corrente"
    if not sessione.exists():
        return {
            "success": False,
            "error": (
                f"Cartella _sessione_corrente/ mancante per agente '{agent_name}'. "
                "Verifica struttura agente (vedi _convenzioni/agenti_foreground.md)."
            ),
        }

    # Verifica se sessione precedente non chiusa
    log_path = sessione / "_log_sessione.md"
    if log_path.exists():
        log_content = log_path.read_text(encoding="utf-8")
        # Cerca STATUS: nelle ultime righe
        has_status = "[STATUS:" in log_content
        # Cerca entry oltre il SETUP iniziale
        has_activity = log_content.count("**[") > 1
        if has_activity and not has_status:
            if not overwrite_pending:
                return {
                    "success": False,
                    "error": (
                        f"Sessione precedente di '{agent_name}' non risulta "
                        "chiusa (manca STATUS:). Archivia o usa "
                        "overwrite_pending=True (forza chiusura come 'aborted')."
                    ),
                }
            else:
                # Archivia la sessione pendente come aborted
                _archive_pending_session(sessione, agent_dir, status="aborted")

    # Pulizia INPUT/OUTPUT (se sessione precedente chiusa correttamente,
    # la cartella è già stata svuotata via archive — qui ripulisco residui)
    input_dir = sessione / "INPUT"
    output_dir = sessione / "OUTPUT"
    for d in (input_dir, output_dir):
        d.mkdir(exist_ok=True)
        for f in d.iterdir():
            if f.is_file() and f.name != "README.md":
                f.unlink()

    # Compila BRIEFING.md
    now = _isoformat_now()
    input_lines = []
    if input_files:
        for name in input_files.keys():
            input_lines.append(f"- `{name}`")
    canonical_lines = []
    if canonical_refs:
        for name, path in canonical_refs.items():
            canonical_lines.append(f"- {name}: `{path}`")
    output_lines = expected_outputs or []
    constraint_lines = constraints or []

    briefing = f"""# Briefing sessione — `{agent_name}`

**Sessione preparata da:** orchestratrice
**Data preparazione:** {now}
**Stato:** pronta per lancio

---

## 1. Obiettivo della sessione

{objective.strip()}

## 2. Contesto rilevante

{context.strip() if context else "_(nessun contesto specifico oltre la skill base dell'agente)_"}

## 3. Input forniti

I seguenti file sono in `INPUT/` di questa sessione:

{chr(10).join(input_lines) if input_lines else "_(nessun file in INPUT/)_"}

Riferimenti canonici (path assoluti, non duplicati in INPUT/):

{chr(10).join(canonical_lines) if canonical_lines else "_(nessun riferimento canonico)_"}

## 4. Output attesi

Al termine, l'agente deve produrre in `OUTPUT/`:

{chr(10).join(f"- {o}" for o in output_lines) if output_lines else "_(nessun output obbligatorio dichiarato)_"}

File opzionali:
- `proposte_orchestratrice.md` — proposte non integrabili dall'agente
- `note_sessione.md` — annotazioni libere per l'orchestratrice

## 5. Vincoli e regole specifiche di questa sessione

{chr(10).join(f"- {c}" for c in constraint_lines) if constraint_lines else "_(nessun vincolo specifico oltre la skill base)_"}

## 6. Fine sessione

L'agente termina la sessione scrivendo:
1. Tutti i file richiesti in §4 dentro `OUTPUT/`
2. Una riga finale in `_log_sessione.md` con `[STATUS: completed | partial | aborted]` e un consuntivo di 3-5 righe.

L'utente può poi tornare nella chat orchestratrice e dire "ho finito con `{agent_name}`".
"""
    (sessione / "BRIEFING.md").write_text(briefing, encoding="utf-8")

    # Scrivi i file in INPUT/
    written_inputs = []
    if input_files:
        for name, content in input_files.items():
            target = input_dir / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
            written_inputs.append(str(target.relative_to(agent_dir)))

    # Inizializza _log_sessione.md con entry SETUP
    log_init = f"""# Log sessione — `{agent_name}`

> File **append-only**: si aggiungono entry, mai si rimuovono.

---
**[{now}] [orchestratrice] [SETUP]**

Sessione preparata per agente `{agent_name}`. Obiettivo:
{objective.strip()[:200]}{'...' if len(objective.strip()) > 200 else ''}

Vedi `BRIEFING.md` per il dettaglio completo. Input forniti in `INPUT/`
({len(written_inputs)} file). Output attesi dichiarati in BRIEFING §4
({len(output_lines)} file).

L'agente può lanciarsi quando l'utente apre Claude Code in
`_agenti/{agent_name}/`.
"""
    log_path.write_text(log_init, encoding="utf-8")

    return {
        "success": True,
        "agent_name": agent_name,
        "session_dir": str(sessione),
        "briefing_path": str(sessione / "BRIEFING.md"),
        "log_path": str(log_path),
        "input_files_written": written_inputs,
        "expected_outputs_count": len(output_lines),
        "user_instruction": (
            f"La sessione per l'agente '{agent_name}' è pronta. "
            f"Apri un terminale, vai in '_agenti/{agent_name}/' e lancia "
            f"'claude'. L'agente saprà cosa fare leggendo BRIEFING.md."
        ),
    }


def _archive_pending_session(
    sessione_dir: Path, agent_dir: Path, status: str = "aborted"
) -> Path:
    """Archivia la sessione corrente in _sessioni_archivio/.

    Internal helper: aggiunge entry STATUS forzata al log, sposta la cartella.
    """
    import shutil
    from datetime import datetime, timezone

    log_path = sessione_dir / "_log_sessione.md"
    if log_path.exists():
        with log_path.open("a", encoding="utf-8") as f:
            f.write(
                f"\n---\n**[{_isoformat_now()}] [orchestratrice] "
                f"[STATUS: {status}]**\n\n"
                f"Sessione chiusa forzatamente da orchestratrice via "
                f"prepare_agent_session(overwrite_pending=True) o tool di "
                f"archiviazione manuale.\n"
            )
    archive_root = agent_dir / "_sessioni_archivio"
    archive_root.mkdir(exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M")
    suffix = f"forced_{status}"
    archive_name = f"{timestamp}_{suffix}"
    archive_path = archive_root / archive_name
    counter = 1
    while archive_path.exists():
        archive_path = archive_root / f"{archive_name}_{counter}"
        counter += 1
    shutil.move(str(sessione_dir), str(archive_path))
    sessione_dir.mkdir()
    # Ripristina struttura minima
    (sessione_dir / "INPUT").mkdir()
    (sessione_dir / "OUTPUT").mkdir()
    return archive_path


@mcp.tool()
def read_agent_session_output(
    agent_name: str, archive_after_read: bool = False
) -> dict:
    """Legge OUTPUT + log di una sessione conclusa di agente foreground.

    L'orchestratrice usa questo tool **dopo** che l'utente ha terminato
    la sessione e dice "ho finito con `<nome>`". Restituisce:
    - lo stato della sessione (completed/partial/aborted)
    - il consuntivo finale dell'agente
    - il contenuto di tutti i file in OUTPUT/
    - opzionalmente, archivia la sessione (sposta in _sessioni_archivio/)

    Args:
        agent_name: nome dell'agente
        archive_after_read: se True, archivia la sessione dopo aver letto.
                            Default False (l'orchestratrice archivia
                            esplicitamente quando ha integrato i risultati).
    """
    cfg = get_config()
    agent_dir = _agent_dir(agent_name)
    if not agent_dir:
        return {"success": False, "error": f"Agente '{agent_name}' non trovato"}
    sessione = agent_dir / "_sessione_corrente"
    log_path = sessione / "_log_sessione.md"
    output_dir = sessione / "OUTPUT"

    if not log_path.exists():
        return {
            "success": False,
            "error": f"Nessuna sessione corrente per agente '{agent_name}'.",
        }

    log_content = log_path.read_text(encoding="utf-8")

    # Estrai STATUS conclusivo
    status = None
    consuntivo = None
    import re

    status_match = re.search(
        r"\*\*\[[^\]]+\]\s*\[agente\]\s*\[STATUS:\s*(\w+)\]\*\*\s*\n+(.*?)(?=\n---|\Z)",
        log_content,
        re.DOTALL,
    )
    if status_match:
        status = status_match.group(1).strip()
        consuntivo = status_match.group(2).strip()

    # Leggi tutti i file in OUTPUT/ (tranne README.md)
    output_files = {}
    if output_dir.exists():
        for f in sorted(output_dir.iterdir()):
            if f.is_file() and f.name != "README.md":
                try:
                    output_files[f.name] = {
                        "size_bytes": f.stat().st_size,
                        "content": f.read_text(encoding="utf-8"),
                    }
                except UnicodeDecodeError:
                    output_files[f.name] = {
                        "size_bytes": f.stat().st_size,
                        "content": "_(contenuto binario, non letto)_",
                    }

    # Estrai entry chiave dal log
    entries = re.findall(
        r"\*\*\[([^\]]+)\]\s*\[([^\]]+)\]\s*\[([^\]]+)\]\*\*\s*\n+(.*?)(?=\n---|\Z)",
        log_content,
        re.DOTALL,
    )
    entry_summary = [
        {"timestamp": ts, "actor": actor, "category": cat, "content": content.strip()}
        for ts, actor, cat, content in entries
    ]

    result = {
        "success": True,
        "agent_name": agent_name,
        "session_status": status if status else "open",
        "consuntivo": consuntivo,
        "output_files": output_files,
        "log_entries_count": len(entry_summary),
        "log_entries": entry_summary,
    }

    if archive_after_read and status in ("completed", "partial", "aborted"):
        # Sposta in _sessioni_archivio/
        import shutil
        from datetime import datetime, timezone

        archive_root = agent_dir / "_sessioni_archivio"
        archive_root.mkdir(exist_ok=True)
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M")
        # Estrai descrizione breve dal consuntivo (prime parole)
        desc = "session"
        if consuntivo:
            words = re.findall(r"\w+", consuntivo)[:4]
            desc = "_".join(words).lower()[:40] if words else "session"
        archive_name = f"{timestamp}_{status}_{desc}"
        archive_path = archive_root / archive_name
        counter = 1
        while archive_path.exists():
            archive_path = archive_root / f"{archive_name}_{counter}"
            counter += 1
        shutil.move(str(sessione), str(archive_path))
        # Ricrea struttura minima per prossima sessione
        sessione.mkdir()
        (sessione / "INPUT").mkdir()
        (sessione / "OUTPUT").mkdir()
        result["archived_to"] = str(archive_path)

    return result


@mcp.tool()
def list_pending_agent_sessions() -> dict:
    """Lista tutte le sessioni di agenti foreground attualmente attive o pendenti.

    Per ogni agente in `_agenti/`, controlla `_sessione_corrente/`:
    - se il log esiste e NON ha STATUS conclusivo: sessione **attiva** (in corso o
      interrotta)
    - se il log esiste e HA STATUS conclusivo ma OUTPUT/ non è vuoto: sessione
      **da chiudere** (aspetta che orchestratrice integri e archivi)
    - se la sessione è vuota o non preparata: niente da fare

    L'orchestratrice usa questo tool all'inizio di una conversazione per
    orientarsi su cosa è pendente.
    """
    cfg = get_config()
    if not cfg.agenti_dir.exists():
        return {"success": True, "agenti_dir_exists": False, "sessions": []}

    sessions = []
    for entry in sorted(cfg.agenti_dir.iterdir()):
        if not entry.is_dir() or entry.name.startswith("_"):
            continue
        agent_name = entry.name
        sessione = entry / "_sessione_corrente"
        if not sessione.exists():
            continue
        log_path = sessione / "_log_sessione.md"
        if not log_path.exists():
            continue

        log_content = log_path.read_text(encoding="utf-8")
        has_status = "[STATUS:" in log_content
        has_activity_beyond_setup = log_content.count("**[") > 1

        # Cerca STATUS specifico
        import re

        status_match = re.search(r"\[STATUS:\s*(\w+)\]", log_content)
        status = status_match.group(1) if status_match else None

        # Cerca briefing per estrarre obiettivo
        briefing_path = sessione / "BRIEFING.md"
        objective_snippet = None
        if briefing_path.exists():
            briefing_content = briefing_path.read_text(encoding="utf-8")
            obj_match = re.search(
                r"## 1\. Obiettivo[^\n]*\n+(.+?)(?=\n##|\Z)",
                briefing_content,
                re.DOTALL,
            )
            if obj_match:
                obj_text = obj_match.group(1).strip()
                objective_snippet = (
                    obj_text[:200] + "..." if len(obj_text) > 200 else obj_text
                )

        # Conta file in OUTPUT/
        output_dir = sessione / "OUTPUT"
        output_count = (
            len(
                [
                    f
                    for f in output_dir.iterdir()
                    if f.is_file() and f.name != "README.md"
                ]
            )
            if output_dir.exists()
            else 0
        )

        # Determina state
        if not has_status and has_activity_beyond_setup:
            state = "active_or_interrupted"
        elif not has_status and not has_activity_beyond_setup:
            state = "ready_to_launch"
        elif has_status and output_count > 0:
            state = "awaiting_integration"
        elif has_status:
            state = "completed_no_output"
        else:
            state = "unknown"

        sessions.append(
            {
                "agent_name": agent_name,
                "state": state,
                "status": status,
                "objective": objective_snippet,
                "output_files_count": output_count,
                "session_dir": str(sessione),
            }
        )

    return {
        "success": True,
        "agenti_dir_exists": True,
        "agenti_dir": str(cfg.agenti_dir),
        "sessions_count": len(sessions),
        "sessions": sessions,
    }


# === Entry point ===

def main():
    """Avvio del server in stdio mode (per Claude Code / Claude Desktop)."""
    mcp.run()


if __name__ == "__main__":
    main()
