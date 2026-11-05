import json
from pathlib import Path

HOOKS = Path(__file__).resolve().parent.parent / "hooks" / "hooks.json"


def test_hooks_json_tem_envelope_hooks():
    # O Claude Code recusa o plugin inteiro sem a chave "hooks" por fora dos eventos.
    # O Cowork aceita sem ela, e por isso a v0.5.0 saiu quebrada no Claude Code.
    dados = json.loads(HOOKS.read_text(encoding="utf-8"))
    assert isinstance(dados.get("hooks"), dict)
    assert "SessionStart" in dados["hooks"]
