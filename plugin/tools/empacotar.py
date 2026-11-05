"""Gera o veritas.plugin para distribuir ao time.

    uv run python tools/empacotar.py

Valida as skills antes, e recusa empacotar se alguma estiver quebrada — um
pacote invalido so e descoberto na maquina de outra pessoa.

A versao sai do plugin.json: e o unico lugar para alterar ao publicar.
"""

import json
import subprocess
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
# Rodado como script, o sys.path comeca em tools/, nao na raiz — sem isto o
# `import tools` falha. O pythonpath do pyproject.toml so vale para o pytest.
sys.path.insert(0, str(RAIZ))

from tools.validate_skills import main as validar  # noqa: E402
MANIFESTO = RAIZ / ".claude-plugin" / "plugin.json"
SAIDA = RAIZ / "dist"

# O que entra no pacote. Tudo o mais (tools, tests, docs, .github) e trabalho
# de quem mantem, nao de quem instala.
AVULSOS = ["README.md"]
PASTAS = ["hooks"]  # componentes do plugin alem de skills/


def arquivos_do_pacote() -> list[Path]:
    itens = [MANIFESTO]
    itens += [RAIZ / nome for nome in AVULSOS if (RAIZ / nome).exists()]
    for skill in sorted((RAIZ / "skills").iterdir()):
        if not (skill / "SKILL.md").is_file():
            print(f"  ignorado (sem SKILL.md): skills/{skill.name}")
            continue
        itens += sorted(p for p in skill.rglob("*") if p.is_file())
    for nome in PASTAS:
        pasta = RAIZ / nome
        if pasta.is_dir():
            itens += sorted(
                p for p in pasta.rglob("*")
                if p.is_file() and "__pycache__" not in p.parts
            )
    return itens


REPO = "Caiorhcp/veritas"


def tag_ja_publicada(versao: str) -> bool | None:
    """True se a tag existe, False se nao, None se nao deu para saber.

    None e' diferente de False de proposito: sem `gh`, ou offline, nao ha como
    afirmar que a versao esta livre — e afirmar seria pior que nao saber.
    """
    try:
        r = subprocess.run(
            ["gh", "release", "view", f"v{versao}", "--repo", REPO, "--json", "tagName"],
            capture_output=True, text=True, timeout=8,
        )
    except Exception:
        return None
    if r.returncode == 0:
        return True
    if "release not found" in (r.stderr or "").lower():
        return False
    return None


def main() -> int:
    if validar(RAIZ / "skills") != 0:
        print("\nskills invalidas — nada foi empacotado")
        return 1

    versao = json.loads(MANIFESTO.read_text(encoding="utf-8")).get("version", "0.0.0")

    ja = tag_ja_publicada(versao)
    if ja is True:
        print(
            f"\n  v{versao} JA FOI PUBLICADA.\n"
            f"\n  Empacotar de novo com o mesmo numero cria duas versoes"
            f" diferentes\n  com a mesma etiqueta: quem baixou ontem tem uma"
            f" coisa, quem baixar\n  hoje tem outra, e os dois dizem estar na"
            f" v{versao}.\n"
            f"\n  Suba o version em .claude-plugin/plugin.json.\n"
            f"\n  Se voce PRECISA corrigir o pacote de uma release ja"
            f" publicada — so\n  faz sentido se ninguem baixou ainda:\n"
            f"    gh release upload v{versao} dist/veritas.plugin --clobber\n"
        )
        return 1
    if ja is None:
        print(f"  (nao consegui conferir se a v{versao} ja existe — sem gh ou sem rede)")
    SAIDA.mkdir(exist_ok=True)
    destino = SAIDA / "veritas.plugin"

    itens = arquivos_do_pacote()
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        for caminho in itens:
            z.write(caminho, caminho.relative_to(RAIZ).as_posix())

    # Conferencia: o pacote precisa ter o manifesto e uma SKILL.md por skill.
    # Sem isto, um erro de selecao so aparece na maquina de quem instalar.
    with zipfile.ZipFile(destino) as z:
        dentro = set(z.namelist())
    esperadas = {
        f"skills/{d.name}/SKILL.md"
        for d in (RAIZ / "skills").iterdir()
        if (d / "SKILL.md").is_file()
    }
    faltando = ({".claude-plugin/plugin.json"} | esperadas) - dentro
    permitidos = {".claude-plugin", "skills", *PASTAS}
    intrusos = {n for n in dentro
                if n.split("/")[0] not in permitidos and n not in AVULSOS}
    if faltando or intrusos:
        print(f"  FALHA: faltando={sorted(faltando)} intrusos={sorted(intrusos)}")
        return 1

    kb = destino.stat().st_size / 1024
    print(f"\n  {destino.relative_to(RAIZ)} — v{versao}, {len(itens)} arquivos, {kb:.0f} KB")
    print(f"\n  publicar:")
    print(f"    gh release create v{versao} {destino.relative_to(RAIZ)} --notes 'o que mudou'")
    return 0


if __name__ == "__main__":
    sys.exit(main())
