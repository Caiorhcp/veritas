"""Valida as skills do banco. Roda no CI de todo PR e também localmente:

    uv run python tools/validate_skills.py skills
"""

import sys
from pathlib import Path

import yaml

# Fora do Claude Code apenas estes seis campos de topo são aceitos.
# Tudo que é do Veritas vive dentro de `metadata`.
CAMPOS_PORTATEIS = {
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
}

# Campos que so o Claude Code entende. Nao sao portateis, e mesmo assim sao
# permitidos porque mudam o COMPORTAMENTO da skill — nao ha como obter o efeito
# por `metadata`. Fora do Claude Code viram erro duro, entao a lista fica curta
# de proposito e cada entrada carrega o motivo.
CAMPOS_DE_COMPORTAMENTO = {
    # skill que nao deve disparar sozinha, so quando a pessoa invoca por `/`
    "disable-model-invocation",
}

LIMITE_DESCRICAO = 1536
REGISTRIES = {"pypi", "npm", "pub", "goproxy", "interno"}


def carregar_frontmatter(caminho: Path) -> dict:
    texto = caminho.read_text(encoding="utf-8")
    if texto.startswith("﻿"):
        # O Bloco de Notas do Windows salva em UTF-8 com BOM por padrao. O
        # caractere e invisivel: sem nomea-lo, a pessoa olha o arquivo, ve o
        # '---' na primeira linha, e nao entende a reprovacao.
        raise ValueError(
            "o arquivo comeca com um caractere invisivel (BOM). Salve como "
            "UTF-8 sem BOM — no Bloco de Notas, em 'Salvar como', troque a "
            "codificacao para UTF-8"
        )
    if not texto.startswith("---\n"):
        raise ValueError("'---' precisa ser a primeira linha do arquivo")
    partes = texto.split("---\n", 2)
    if len(partes) < 3:
        raise ValueError("frontmatter nao fechado: falta o '---' final")
    try:
        dados = yaml.safe_load(partes[1]) or {}
    except yaml.YAMLError as erro:
        # Causa mais comum: valor com ':' sem aspas. Nomear o caso poupa o
        # contribuidor de decifrar o erro cru do parser.
        raise ValueError(
            f"YAML invalido no frontmatter: {erro}. Se algum valor tem ':' ou "
            f"'#', envolva em aspas duplas"
        ) from erro
    if not isinstance(dados, dict):
        raise ValueError("frontmatter nao e um mapa YAML")
    return dados


def _erros_do_upstream(upstream: list) -> list[str]:
    if not upstream:
        return ["falta metadata.upstream (a Fatia 2 depende dele)"]

    erros = []
    for i, fonte in enumerate(upstream):
        if not isinstance(fonte, dict):
            erros.append(f"metadata.upstream[{i}] nao e um mapa")
            continue

        registry = fonte.get("registry")
        if registry not in REGISTRIES:
            erros.append(
                f"metadata.upstream[{i}].registry '{registry}' desconhecido; "
                f"use um de {sorted(REGISTRIES)}"
            )
            continue

        # `interno` declara que nao ha doc publica para conferir.
        if registry == "interno":
            continue

        faltando = [c for c in ("url", "pacote") if not fonte.get(c)]
        if faltando:
            erros.append(f"metadata.upstream[{i}] sem {faltando}")

    return erros


def erros_da_skill(caminho: Path) -> list[str]:
    try:
        fm = carregar_frontmatter(caminho)
    except ValueError as erro:
        return [str(erro)]

    erros = []

    extras = sorted(set(fm) - CAMPOS_PORTATEIS - CAMPOS_DE_COMPORTAMENTO)
    if extras:
        erros.append(f"campos {extras} fora do conjunto portatil; mova para metadata")

    if not fm.get("name"):
        erros.append("falta 'name'")

    descricao = fm.get("description") or ""
    if not descricao:
        erros.append("falta 'description'")
    elif len(descricao) > LIMITE_DESCRICAO:
        erros.append(
            f"description tem {len(descricao)} chars; o limite de listagem e "
            f"{LIMITE_DESCRICAO}"
        )

    metadados = fm.get("metadata") or {}
    if not metadados.get("versao_verificada"):
        erros.append("falta metadata.versao_verificada")
    erros.extend(_erros_do_upstream(metadados.get("upstream") or []))

    return erros


def main(raiz: Path) -> int:
    skills = sorted(raiz.glob("*/SKILL.md"))
    if not skills:
        print(f"nenhuma SKILL.md encontrada em {raiz}")
        return 1

    total = 0
    for caminho in skills:
        for erro in erros_da_skill(caminho):
            print(f"{caminho}: {erro}")
            total += 1

    print(f"{len(skills)} skills verificadas, {total} erro(s)")
    return 1 if total else 0


if __name__ == "__main__":
    alvo = sys.argv[1] if len(sys.argv) > 1 else "skills"
    sys.exit(main(Path(alvo)))
