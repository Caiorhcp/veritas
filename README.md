# Veritas

Convenções de engenharia em português, uma por stack, escritas dentro do projeto. O assistente de IA lê antes de escrever código.

Este repositório tem três partes:

| Pasta | O que é |
|---|---|
| [`plugin/`](plugin) | O plugin para Claude Code e Cowork: uma skill por stack (Vite, Next.js, NestJS, Django, React Native, Python, Bun + Hono) e skills gerais (princípios, LGPD, atomic design, projeto existente). |
| [`cli/`](cli) | `create-veritas`: cria um projeto que já funciona com as convenções dentro, em `.veritas/`, ou adiciona as convenções a um projeto existente. |
| [`site/`](site) | O site com a documentação, em português, inglês e espanhol. |

## Usar

No Claude Code:

```
/plugin marketplace add Caiorhcp/veritas
/plugin install veritas@veritas
```

Num projeto novo ou existente:

```bash
npm create veritas@latest meu-app -- --stack vite   # ou nextjs
npx create-veritas init                              # num projeto que já existe
```

Toda pergunta da CLI também tem uma flag. Num terminal sem ninguém do outro lado (CI, agente, script), a resposta que falta é erro: nada é escolhido em silêncio.

## Contribuir

Achou uma regra errada ou faltando? Abra uma issue ou um PR. As skills ficam em `plugin/skills/<nome>/SKILL.md`; rode `uv run pytest` dentro de `plugin/` antes de enviar. A CLI tem `npm test` em `cli/`.

## English

Veritas is a set of engineering conventions (written in Portuguese), one per stack, that live inside your project so any AI coding assistant reads them before writing code. It ships as a Claude Code plugin and as a CLI (`npm create veritas@latest`). Docs: see `site/`.

## Créditos

A ideia de escrever as convenções dentro do projeto, e de que nenhuma resposta é decidida em silêncio, vem do [Prumo](https://prumo.stjosephworks.org), da St. Joseph Works (MIT).

Licença [MIT](LICENSE) © 2026 Caio Gonçalves.
