"""Avisa, no inicio da sessao, se ha versao nova do Veritas.

Roda como hook SessionStart. Nao instala nada: imprime uma linha e sai.

Falha em silencio, sempre. Um hook que roda na maquina de todo mundo em toda
sessao nao pode reclamar quando esta offline, sem `gh`, ou sem acesso ao repo —
o custo do ruido diario e maior que o do aviso perdido.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

REPO = "Caiorhcp/veritas"
TIMEOUT = 6


def versao_instalada() -> str | None:
    raiz = os.environ.get("CLAUDE_PLUGIN_ROOT")
    manifesto = (Path(raiz) if raiz else Path(__file__).resolve().parent.parent) / (
        ".claude-plugin/plugin.json"
    )
    try:
        return json.loads(manifesto.read_text(encoding="utf-8")).get("version")
    except Exception:
        return None


def versao_publicada() -> str | None:
    try:
        r = subprocess.run(
            ["gh", "release", "view", "--repo", REPO, "--json", "tagName"],
            capture_output=True, text=True, timeout=TIMEOUT,
        )
        if r.returncode != 0:
            return None
        return json.loads(r.stdout)["tagName"].lstrip("v")
    except Exception:
        return None


def partes(v: str) -> tuple:
    return tuple(int(x) for x in v.split(".") if x.isdigit())


def main() -> int:
    tenho, la = versao_instalada(), versao_publicada()
    if not tenho or not la:
        return 0
    try:
        if partes(la) <= partes(tenho):
            return 0
    except Exception:
        if la == tenho:
            return 0
    print(f"Veritas v{la} disponivel (voce tem v{tenho}) — rode /veritas:atualizar")
    return 0


if __name__ == "__main__":
    sys.exit(main())
