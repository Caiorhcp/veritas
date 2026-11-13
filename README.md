# Veritas

Convenções de engenharia em português, uma por stack, escritas dentro do projeto. O assistente de IA lê antes de escrever código.

Este repositório tem quatro partes:

| Pasta | O que é |
|---|---|
| [`plugin/`](plugin) | O plugin para Claude Code e Cowork: uma skill por stack (Vite, Next.js, NestJS, Django, React Native, Python, Bun + Hono), skills gerais (princípios, LGPD, projeto existente) e de interface (atomic design, cores, tipografia e espaçamento, direção de arte, revisão de design, responsividade). |
| [`cli/`](cli) | `create-veritas`: cria um projeto que já funciona com as convenções dentro, em `.veritas/`, ou adiciona as convenções a um projeto existente. |
| [`extension/`](extension) | A extensão para VS Code, Cursor, Windsurf e afins: aplica as convenções no formato de cada assistente de IA, painel de convenções, projeto novo e o grafo do Graphify. Download e instalação manual: [veritasdev.vercel.app/pt/extensao](https://veritasdev.vercel.app/pt/extensao). |
| [`site/`](site) | O site com a documentação, em português, inglês e espanhol. |

## Usar

No Claude Code:

```
/plugin marketplace add Caiorhcp/veritas
/plugin install veritas@veritas
```

Instalar o Veritas instala junto dois plugins de terceiros:

- [Ponytail](https://github.com/DietrichGebert/ponytail) (MIT, de Dietrich Gebert): o agente escolhe a menor mudança que resolve e gasta menos tokens.
- [Graphify](https://github.com/Graphify-Labs/graphify) (Apache-2.0, da Graphify Labs): monta um grafo do código e dos documentos para consultar antes de mexer em projeto grande. A skill oficial vem empacotada sem alterações em `plugins/graphify/`.

O Graphify precisa de Python 3 no computador; na primeira vez, a própria skill instala o pacote `graphifyy` com o pip. O resto do Veritas não depende de Python. A CLI precisa de Node.js.

A skill `mapa-do-codigo` do Veritas diz quando usar cada um. Para comprimir o contexto, a skill `/veritas:ambiente` instala e configura o [Headroom](https://pypi.org/project/headroom-ai/).

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

O Veritas recomenda e distribui pelo seu marketplace o [Ponytail](https://github.com/DietrichGebert/ponytail), de [Dietrich Gebert](https://github.com/DietrichGebert), sob licença MIT. O Veritas diz o que usar e onde cada coisa mora; o Ponytail diz quanto escrever, com a menor mudança que resolve e menos tokens gastos. O plugin é instalado direto do repositório do autor, sem cópia aqui, e todo o crédito por ele é do Dietrich.

O Veritas também distribui o [Graphify](https://github.com/Graphify-Labs/graphify), da [Graphify Labs](https://github.com/Graphify-Labs), sob licença Apache-2.0. Como o Graphify não publica um plugin para o Claude Code, a skill oficial é copiada sem alterações de uma versão marcada (`tools/sync-graphify.mjs`), com o `LICENSE` e o `NOTICE` originais em `plugins/graphify/`. Todo o crédito pelo Graphify é deles.

As skills de interface (`cores`, `tipografia-e-espacamento`, `direcao-de-arte`, `revisao-de-design`) são texto original do Veritas. Inspiração: foram lidas como referência as skills de design do [Taste Skill](https://github.com/Leonxlnx/taste-skill), de Leonxlnx (MIT): `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `redesign-existing-projects`, `stitch-design-taste` e `industrial-brutalist-ui`; e a `web-design-guidelines`, da [Vercel](https://github.com/vercel-labs/agent-skills). Nada foi copiado delas; o crédito pela inspiração é dos autores.

A ideia de escrever as convenções dentro do projeto, e de que nenhuma resposta é decidida em silêncio, vem do [Prumo](https://prumo.stjosephworks.org), da St. Joseph Works (MIT).

Licença [MIT](LICENSE) © 2026 Caio Gonçalves.
