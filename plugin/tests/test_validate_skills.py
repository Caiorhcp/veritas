from pathlib import Path

from tools.validate_skills import erros_da_skill

SKILL_VALIDA = """---
name: django
description: Convencoes Django da casa
metadata:
  escopo: backend
  stacks: [django]
  upstream:
    - url: https://docs.djangoproject.com/en/stable/
      pacote: django
      registry: pypi
  versao_verificada: "5.2"
---

# Corpo
"""


def escrever(tmp_path: Path, conteudo: str) -> Path:
    caminho = tmp_path / "SKILL.md"
    caminho.write_text(conteudo, encoding="utf-8")
    return caminho


def test_skill_valida_nao_tem_erro(tmp_path):
    assert erros_da_skill(escrever(tmp_path, SKILL_VALIDA)) == []


def test_frontmatter_ausente(tmp_path):
    erros = erros_da_skill(escrever(tmp_path, "# so o corpo\n"))
    assert any("primeira linha" in e for e in erros)


def test_bom_do_bloco_de_notas(tmp_path):
    # BOM e invisivel: sem mensagem propria, a pessoa ve o '---' na primeira
    # linha e nao entende a reprovacao.
    erros = erros_da_skill(escrever(tmp_path, "﻿" + SKILL_VALIDA))
    assert any("BOM" in e for e in erros)


def test_crlf_do_windows_passa(tmp_path):
    # Arquivo criado no PowerShell nasce com CRLF. Nao pode reprovar por isso.
    assert erros_da_skill(escrever(tmp_path, SKILL_VALIDA.replace("\n", "\r\n"))) == []


def test_frontmatter_nao_fechado(tmp_path):
    erros = erros_da_skill(escrever(tmp_path, "---\nname: x\n"))
    assert any("nao fechado" in e for e in erros)


def test_yaml_invalido_nao_derruba_o_validador(tmp_path):
    # ':' sem aspas dentro do valor: o erro mais provavel de um contribuidor.
    conteudo = SKILL_VALIDA.replace(
        "Convencoes Django da casa", "Convencoes Django: camadas e proibicoes"
    )
    erros = erros_da_skill(escrever(tmp_path, conteudo))
    assert any("aspas" in e for e in erros)


def test_campo_nosso_fora_de_metadata(tmp_path):
    conteudo = SKILL_VALIDA.replace("metadata:", "escopo: backend\nmetadata:")
    erros = erros_da_skill(escrever(tmp_path, conteudo))
    assert any("metadata" in e and "escopo" in e for e in erros)


def test_campo_de_comportamento_e_permitido(tmp_path):
    # `disable-model-invocation` nao e portatil, mas e o unico jeito de a skill
    # nao disparar sozinha — sem ele, nao existe skill so por invocacao.
    conteudo = SKILL_VALIDA.replace(
        "metadata:", "disable-model-invocation: true\nmetadata:"
    )
    assert erros_da_skill(escrever(tmp_path, conteudo)) == []


def test_description_longa_demais(tmp_path):
    conteudo = SKILL_VALIDA.replace("Convencoes Django da casa", "x" * 1537)
    erros = erros_da_skill(escrever(tmp_path, conteudo))
    assert any("1536" in e for e in erros)


def test_upstream_ausente(tmp_path):
    conteudo = """---
name: django
description: Convencoes Django da casa
metadata:
  versao_verificada: "5.2"
---
"""
    erros = erros_da_skill(escrever(tmp_path, conteudo))
    assert any("upstream" in e for e in erros)


def test_upstream_incompleto(tmp_path):
    conteudo = SKILL_VALIDA.replace("      registry: pypi\n", "")
    erros = erros_da_skill(escrever(tmp_path, conteudo))
    assert any("registry" in e for e in erros)


def test_registry_desconhecido(tmp_path):
    conteudo = SKILL_VALIDA.replace("registry: pypi", "registry: cargo")
    erros = erros_da_skill(escrever(tmp_path, conteudo))
    assert any("cargo" in e for e in erros)


def test_registry_interno_dispensa_url_e_pacote(tmp_path):
    conteudo = """---
name: bun-hono-api
description: Convencoes internas da API
metadata:
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---
"""
    assert erros_da_skill(escrever(tmp_path, conteudo)) == []
