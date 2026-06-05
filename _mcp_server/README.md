# `_mcp_server/kit-orchestrator` — MCP server per la pipeline narrativa

Espone all'**orchestratrice** (Claude Code, Claude Desktop, qualsiasi client MCP) un set di tool nominali per operare sul progetto narrativo dell'utente, senza che l'orchestratrice debba conoscere path, env vars, sequenze di script.

Standard: [Model Context Protocol](https://modelcontextprotocol.io/), trasporto stdio.

---

## Cosa espone

### Resources (lettura)

| URI | Cosa è |
|---|---|
| `kit://config` | Path canonici del progetto + esistenza file (orientamento per orchestratrice) |
| `kit://status` | Contenuto di `STATO_PROGETTO.md` + `LOG_SINCRONIZZAZIONE.md` |

### Tools (azione)

| Tool | Fase | Cosa fa |
|---|---|---|
| `bootstrap_graph` | 02 | Inizializza il grafo dal glossario-consegna |
| `migrate_schema` | 02 | Migrazione one-shot additiva dello schema |
| `write_unit_to_graph` | 03 | Scrive nodo unità da YAML deterministico |
| `split_source_to_units` | 03 | Splitta documento sorgente in N narrazioni fattuali |
| `promote_entities` | 02–03 | Promuove entità + crea schede embrionali |
| `compile_catalog` | 04 | Bulk meccanico fonte canonica → schede catalogo |
| `build_catalog_index` | 04 | Genera indice JSON catalogo |
| `build_brief` | 05 | Genera brief autosufficiente (1 o tutti) |
| `normalize_storie` | 06 | Normalizza testi finali (frontmatter, marker) |
| `audit_graph` | trasversale | Lancia 1 o tutti i 4 audit |
| `rebuild_web_data` | trasversale | Rigenera i 3 JSON dell'UI cruscotto |
| `get_project_status` | trasversale | Snapshot strutturato dello stato (live) |
| `read_canonical_file` | trasversale | Legge file canonici per ispezione |
| `prepare_agent_session` | trasversale | Prepara la sessione di un agente foreground (BRIEFING + INPUT + log) |
| `read_agent_session_output` | trasversale | Legge OUTPUT + log di una sessione conclusa |
| `list_pending_agent_sessions` | trasversale | Lista sessioni attive o da integrare di tutti gli agenti |

Tutti i tool sono **pass-through** verso gli script Python idempotenti del kit (`_scripts/`). L'orchestratrice riceve sempre un dict strutturato (mai eccezioni che bloccano il client).

---

## Installazione

### Prerequisiti

- Python ≥ 3.10
- pip / uv / poetry / pipx (uno qualsiasi)

### Installazione locale (sviluppo)

Dalla radice del kit:

```bash
cd _mcp_server
pip install -e .
```

L'eseguibile `kit-orchestrator` viene installato nel `PATH`.

### Verifica

```bash
kit-orchestrator --help
# dovrebbe mostrare le opzioni di FastMCP
```

Per un test rapido senza Claude Code, puoi lanciare il server in modalità ispettiva:

```bash
mcp dev kit_orchestrator/server.py
```

Apre il MCP Inspector nel browser per vedere resources/tools esposti.

---

## Registrazione in Claude Code

### Modalità A — `.mcp.json` nel progetto (consigliata)

Crea un file `.mcp.json` nella radice del progetto adottante:

```json
{
  "mcpServers": {
    "kit-orchestrator": {
      "command": "kit-orchestrator",
      "env": {
        "REPO_ROOT": "/path/to/your/project"
      }
    }
  }
}
```

Claude Code rileva automaticamente `.mcp.json` quando si apre la cartella e propone l'attivazione del server.

### Modalità B — Configurazione globale Claude Desktop

Modifica `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "kit-orchestrator": {
      "command": "kit-orchestrator",
      "env": {
        "REPO_ROOT": "/path/to/your/project"
      }
    }
  }
}
```

Riavvia Claude Desktop. Il server sarà disponibile in tutte le chat.

### Modalità C — Solo l'CLI di Claude Code (con --mcp-config)

```bash
claude --mcp-config .mcp.json
```

---

## Variabili d'ambiente

| Variabile | Default | Descrizione |
|---|---|---|
| `REPO_ROOT` | `cwd` | Radice del progetto adottante |
| `GRAPH_PATH` | `$REPO_ROOT/story_graph.json` | Grafo canonico |
| `SCHEMA_PATH` | `$REPO_ROOT/grafo_schema.json` | Schema grafo |
| `CATALOG_DIR` | `$REPO_ROOT/catalogo` | Cartella schede catalogo |
| `BIBBIA_PATH` | `$REPO_ROOT/bibbia.md` | Bibbia / canone-mondo |
| `CARTA_VOCE_PATH` | `$REPO_ROOT/carta_voce.md` | Carta voce |
| `PATTERN_AI_PATH` | `$REPO_ROOT/pattern_ai_da_bandire.md` | Pattern AI da bandire |
| `NARRAZIONE_DIR` | `$REPO_ROOT/narrazione_fattuale` | Narrazioni fattuali |
| `BRIEFS_DIR` | `$REPO_ROOT/briefs` | Brief generati |
| `TESTI_FINALI_DIR` | `$REPO_ROOT/testi_finali` | Testi finali prosa |
| `GLOSSARY_PATH` | `$REPO_ROOT/glossario_consegna.json` | Glossario-consegna Fase 01 |
| `CATALOG_INDEX_PATH` | `$REPO_ROOT/catalogo_index/data/entities.json` | Indice JSON catalogo |
| `MISALIGNMENTS_PATH` | `$REPO_ROOT/misalignments.json` | Rolling file misalignment |

Le variabili sono passate dal client MCP (sezione `env` della registrazione) e propagate ai sub-process degli script.

---

## Architettura

```
Claude Code (client)
    ↓ MCP stdio
kit_orchestrator/server.py (FastMCP)
    ↓ subprocess
_starter_kit/_scripts/<script>.py (script idempotenti del kit)
    ↓ filesystem
Progetto adottante (grafo, catalogo, brief, ecc.)
```

I tool del server sono **thin wrappers** sopra gli script idempotenti. Vantaggio: aggiungere/rimuovere/aggiornare gli script non richiede modificare il server, solo aggiungere/rimuovere il tool relativo.

### File

```
_mcp_server/
├── pyproject.toml                  package metadata + dipendenze
├── README.md                       questo file
└── kit_orchestrator/
    ├── __init__.py
    ├── server.py                   FastMCP server, registra resources + tools
    ├── config.py                   risoluzione path canonici + env
    └── _lib/
        ├── __init__.py
        └── script_runner.py        helper esecuzione script con env uniforme
```

---

## Aggiungere un tool

Per esporre un nuovo script del kit come tool MCP:

1. Aggiungi lo script a `_starter_kit/_scripts/<nome>.py` (con i `// PROJECT:` per la specializzazione)
2. Aggiungi un decoratore `@mcp.tool()` in `server.py`:

```python
@mcp.tool()
def my_new_tool(arg: str, apply: bool = False) -> dict:
    """Descrizione tool. La docstring viene esposta al client MCP."""
    args = ["--arg", arg]
    if apply:
        args.append("--apply")
    result = run_script(_scripts_dir() / "my_script.py", args, get_config())
    return result.to_dict()
```

3. Riavvia il server (Claude Code lo fa automaticamente al cambio del `server.py`)

---

## Convenzioni dei tool

Tutti i tool del server seguono il pattern del kit:

- **Dry-run di default**: parametro `apply: bool = False` (mai `True` di default)
- **Output strutturato**: sempre `dict` con almeno `success`, `stdout`, `stderr`, `returncode`
- **Mai eccezioni**: errori catturati e restituiti come `{"success": False, "stderr": "..."}`
- **Idempotenza**: rilanciare un tool con gli stessi parametri non causa danni
- **Backup automatico**: gli script sottostanti generano backup prima di scritture significative

---

## Stato

✅ Server MCP funzionante (FastMCP, Python ≥3.10)
✅ 16 tool + 2 resources
✅ Smoke test sintassi passato

🟡 Test funzionale end-to-end con Claude Code: da fare al primo progetto pilota
🟡 Ulteriori tool da aggiungere col tempo (illustratore, impaginatore, web watch)
