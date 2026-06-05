"""Config — risoluzione path canonici + variabili d'ambiente.

Coerente con la convenzione del kit (vedi _scripts/README.md):
- REPO_ROOT  radice del progetto adottante
- GRAPH_PATH grafo canonico
- ...

Il server MCP riceve REPO_ROOT all'avvio (via env o auto-detect dalla
working dir) e da lì deriva tutti gli altri path.
"""

import os
from pathlib import Path
from typing import Optional


def resolve_repo_root(explicit: Optional[str] = None) -> Path:
    """Risolve la radice del progetto adottante.

    Ordine di precedenza:
    1. argomento esplicito
    2. variabile d'ambiente REPO_ROOT
    3. cwd corrente
    """
    if explicit:
        return Path(explicit).resolve()
    env = os.environ.get("REPO_ROOT")
    if env:
        return Path(env).resolve()
    return Path.cwd().resolve()


class KitConfig:
    """Container path canonici del progetto adottante."""

    def __init__(self, repo_root: Optional[str] = None):
        self.repo_root = resolve_repo_root(repo_root)

    @property
    def graph_path(self) -> Path:
        return Path(
            os.environ.get("GRAPH_PATH", self.repo_root / "story_graph.json")
        )

    @property
    def schema_path(self) -> Path:
        return Path(
            os.environ.get("SCHEMA_PATH", self.repo_root / "grafo_schema.json")
        )

    @property
    def catalog_dir(self) -> Path:
        return Path(
            os.environ.get("CATALOG_DIR", self.repo_root / "catalogo")
        )

    @property
    def bibbia_path(self) -> Path:
        return Path(
            os.environ.get("BIBBIA_PATH", self.repo_root / "bibbia.md")
        )

    @property
    def carta_voce_path(self) -> Path:
        return Path(
            os.environ.get("CARTA_VOCE_PATH", self.repo_root / "carta_voce.md")
        )

    @property
    def pattern_ai_path(self) -> Path:
        return Path(
            os.environ.get(
                "PATTERN_AI_PATH", self.repo_root / "pattern_ai_da_bandire.md"
            )
        )

    @property
    def narrazione_dir(self) -> Path:
        return Path(
            os.environ.get(
                "NARRAZIONE_DIR", self.repo_root / "narrazione_fattuale"
            )
        )

    @property
    def briefs_dir(self) -> Path:
        return Path(os.environ.get("BRIEFS_DIR", self.repo_root / "briefs"))

    @property
    def testi_finali_dir(self) -> Path:
        return Path(
            os.environ.get(
                "TESTI_FINALI_DIR", self.repo_root / "testi_finali"
            )
        )

    @property
    def glossary_path(self) -> Path:
        return Path(
            os.environ.get(
                "GLOSSARY_PATH", self.repo_root / "glossario_consegna.json"
            )
        )

    @property
    def catalog_index_path(self) -> Path:
        return Path(
            os.environ.get(
                "CATALOG_INDEX_PATH",
                self.repo_root / "catalogo_index" / "data" / "entities.json",
            )
        )

    @property
    def web_dir(self) -> Path:
        """Cartella del cruscotto web (se presente nella radice del progetto adottante)."""
        return self.repo_root / "web"

    @property
    def agenti_dir(self) -> Path:
        """Cartella degli agenti foreground (vedi _convenzioni/agenti_foreground.md).

        Cercata prima in radice progetto, poi dentro _starter_kit/.
        """
        candidates = [
            self.repo_root / "_agenti",
            self.repo_root / "_starter_kit" / "_agenti",
        ]
        for c in candidates:
            if c.exists():
                return c
        return candidates[0]

    @property
    def stato_progetto_path(self) -> Path:
        return self.repo_root / "STATO_PROGETTO.md"

    @property
    def log_sincronizzazione_path(self) -> Path:
        return self.repo_root / "LOG_SINCRONIZZAZIONE.md"

    @property
    def misalignments_path(self) -> Path:
        return Path(
            os.environ.get(
                "MISALIGNMENTS_PATH", self.repo_root / "misalignments.json"
            )
        )

    def kit_scripts_dir(self) -> Path:
        """Path agli script Python del kit (cercati prima nel progetto, poi nel kit)."""
        # Convenzione: il progetto adottante può copiare _scripts/ nella sua
        # radice oppure tenerli dentro _starter_kit/_scripts/.
        candidates = [
            self.repo_root / "_scripts",
            self.repo_root / "_starter_kit" / "_scripts",
        ]
        for c in candidates:
            if c.exists():
                return c
        # fallback: stesso path del kit relativo al server MCP
        return Path(__file__).parent.parent.parent / "_scripts"

    def env_for_subprocess(self) -> dict:
        """Genera env vars per chiamate subprocess agli script Python del kit.

        Tutti gli script del kit leggono questi env vars per la configurazione
        path. Vedi _scripts/README.md.
        """
        env = os.environ.copy()
        env.update(
            {
                "REPO_ROOT": str(self.repo_root),
                "GRAPH_PATH": str(self.graph_path),
                "SCHEMA_PATH": str(self.schema_path),
                "CATALOG_DIR": str(self.catalog_dir),
                "BIBBIA_PATH": str(self.bibbia_path),
                "CARTA_VOCE_PATH": str(self.carta_voce_path),
                "PATTERN_AI_PATH": str(self.pattern_ai_path),
                "NARRAZIONE_DIR": str(self.narrazione_dir),
                "BRIEFS_DIR": str(self.briefs_dir),
                "TESTI_FINALI_DIR": str(self.testi_finali_dir),
                "GLOSSARY_PATH": str(self.glossary_path),
                "CATALOG_INDEX_PATH": str(self.catalog_index_path),
            }
        )
        return env
