---
name: python
description: Use ao começar ou estruturar um projeto Python — criar um módulo ou pacote novo, definir a estrutura de pastas, escolher entre ruff, pytest e Pydantic, aplicar type hints e tipagem em assinaturas, configurar o pyproject.toml ou gerenciar dependências e ambiente com uv.
metadata:
  escopo: geral
  stacks: [python]
  upstream:
    - registry: interno
  versao_verificada: "3.11"
---

# Python

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

## Filosofia

**ESTRUTURA:** Use Type Hints (typing) do Python moderno. Estruture em pacotes modulares.

## Tecnologias

- Formatação/Linting: ruff.
- Testes: pytest.
- Validações base: Pydantic.
- Ambiente: Gerencie bibliotecas e versões com `uv`.

## Proibições (violação = erro)

1. **CLEAN CODE:** Siga a PEP8 de forma rigorosa e deixe docstrings claras.
2. **TIPAGEM:** Use e abuse de Type Hints para todas as assinaturas de funções e classes.
3. **VALIDAÇÃO:** Pydantic é preferível para parsers de dados estruturados.

## Recursos adicionais

- Estrutura e arquitetura: [architecture.md](architecture.md)

## Origem

Portada do `scaffold/stacks/python.py` do Veritas v1, onde vivia como string dentro do Python.
