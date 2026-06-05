"""script_runner — esecuzione uniforme degli script Python del kit.

I tool MCP delegano la logica agli script idempotenti del kit. Questo
helper standardizza:
- composizione dei comandi
- environment con env vars KIT_*
- cattura stdout/stderr
- timeout configurabile
- gestione errori in modo che il tool MCP restituisca sempre un risultato
  strutturato (mai un'eccezione che blocca il client)
"""

import subprocess
import sys
from pathlib import Path
from typing import Sequence

from .config import KitConfig


class ScriptResult:
    """Risultato strutturato dell'esecuzione di uno script."""

    def __init__(
        self,
        success: bool,
        stdout: str,
        stderr: str,
        returncode: int,
        cmd: Sequence[str],
    ):
        self.success = success
        self.stdout = stdout
        self.stderr = stderr
        self.returncode = returncode
        self.cmd = list(cmd)

    def to_dict(self) -> dict:
        return {
            "success": self.success,
            "stdout": self.stdout.strip(),
            "stderr": self.stderr.strip(),
            "returncode": self.returncode,
            "cmd": " ".join(self.cmd),
        }


def run_script(
    script_path: Path,
    args: Sequence[str],
    config: KitConfig,
    timeout: int = 120,
) -> ScriptResult:
    """Lancia uno script Python con env del kit.

    Args:
        script_path: path assoluto allo script .py
        args: argomenti CLI (es. ["--unit", "cap03", "--apply"])
        config: KitConfig per env vars
        timeout: timeout in secondi (default 120s)

    Returns:
        ScriptResult con success/stdout/stderr/returncode
    """
    if not script_path.exists():
        return ScriptResult(
            success=False,
            stdout="",
            stderr=f"Script non trovato: {script_path}",
            returncode=-1,
            cmd=[sys.executable, str(script_path), *args],
        )

    cmd = [sys.executable, str(script_path), *args]
    try:
        proc = subprocess.run(
            cmd,
            env=config.env_for_subprocess(),
            cwd=str(config.repo_root),
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
        return ScriptResult(
            success=proc.returncode == 0,
            stdout=proc.stdout,
            stderr=proc.stderr,
            returncode=proc.returncode,
            cmd=cmd,
        )
    except subprocess.TimeoutExpired:
        return ScriptResult(
            success=False,
            stdout="",
            stderr=f"Timeout {timeout}s superato",
            returncode=-2,
            cmd=cmd,
        )
    except Exception as e:
        return ScriptResult(
            success=False,
            stdout="",
            stderr=f"Errore esecuzione: {type(e).__name__}: {e}",
            returncode=-3,
            cmd=cmd,
        )
