# Veritas

Convenções de engenharia para agentes de código, em forma de skills. Uma skill
por stack, escrita em português, que o Claude carrega sozinho quando o assunto
aparece: pediu algo de Django, entra a convenção de Django; mexeu em dado
pessoal, entra a de LGPD.

A ideia é simples: o agente para de escolher entre cinco jeitos defensáveis de
fazer a mesma coisa e usa o que foi decidido — camadas, libs, proibições e
como testar.

Guia de uso: [`docs/COMO-USAR.md`](docs/COMO-USAR.md).

## Skills

### As skills

| Skill | Escopo | Conferida contra |
|---|---|---|
| `principios` | geral | autoral |
| `mapa-do-codigo` | geral | Graphify 0.9.106 · Ponytail 5.3 |
| `projeto-existente` | geral | autoral |
| `lgpd` | geral | Lei 13.709/2018 e Res. CD/ANPD 15/2024 |
| `docs-oficiais` | geral | Firecrawl CLI 1.24.4 |
| `python` | geral | autoral |
| `clickup` | processo | autoral |
| `executar-tasks` | processo, **só por `/`** | autoral |
| `atomic-design` | frontend | autoral |
| `cores` | frontend | WCAG 2.2 (W3C) |
| `tipografia-e-espacamento` | frontend | WCAG 2.2 · Apple HIG · Android |
| `direcao-de-arte` | frontend | autoral |
| `revisao-de-design` | frontend | autoral |
| `django` | backend | Django 5.2 |
| `django-templates` | frontend | Django 6.0 |
| `bun-hono-api` | backend | autoral (Bun, Hono, Drizzle, Zod) |
| `nestjs` | backend | NestJS 11 |
| `nextjs` | frontend | Next 16.2.4 |
| `vite` | frontend | Vite 8.0.1 |
| `react-native` | mobile | React Native 0.86.2 |
| `ajuda` | geral, **só por `/`** | autoral |
| `atualizar` | geral, **só por `/`** | autoral |
| `buscar-skills` | geral, **só por `/`** | autoral |
| `ambiente` | geral, **só por `/`** | autoral |

"Conferida contra" é a versão da documentação oficial com que a skill foi
revisada (campo `metadata.versao_verificada` no `SKILL.md`). "Autoral" é
convenção própria, sem lib de referência.

### Como entram

As skills marcadas **só por `/`** rodam quando você chama (`/veritas:ajuda`,
`/veritas:atualizar` etc.). As demais entram sozinhas pela `description`.
`/veritas:ajuda` mostra o menu completo.

## Instalar

### Claude Code

```
/plugin marketplace add Caiorhcp/veritas
/plugin install veritas@veritas
```

Junto com o Veritas vêm o [Ponytail](https://github.com/DietrichGebert/ponytail), de [Dietrich Gebert](https://github.com/DietrichGebert) (MIT), instalado direto do repositório do autor, e o [Graphify](https://github.com/Graphify-Labs/graphify), da Graphify Labs (Apache-2.0), cuja skill oficial o Veritas empacota sem alterações. Quando usar cada um: skill `mapa-do-codigo`.

Reinicie o Claude Code. Para atualizar:

```bash
claude plugin marketplace update veritas
claude plugin update veritas@veritas
```

### Cowork

Baixe o `veritas.plugin` da [última release](https://github.com/Caiorhcp/veritas/releases/latest)
e arraste para uma conversa.

## Contribuir

PRs em [github.com/Caiorhcp/veritas](https://github.com/Caiorhcp/veritas). É
markdown: não precisa saber programar.

- **Skill nova:** copie `docs/modelo-de-skill/` para `skills/<nome>/` e
  preencha. Frontmatter com `name` e `description`; o resto dentro de
  `metadata`. A `description` diz **quando** usar, com os termos que um dev
  usaria — é ela que faz a skill ser escolhida.
- **Alteração:** procure antes onde a regra já mora (`grep -rln "<termo>" skills/`)
  e mude ali. Skill nova é raro; corrigir regra existente é o caso comum.
- **O eixo é stack, não projeto.** Convenção que vale só para um projeto vai no
  `CLAUDE.md` daquele repositório.
- **Política de token:** no `SKILL.md` vai o que se consulta o tempo todo
  (proibições, stack, núcleo); o detalhe vai para arquivos de apoio ao lado,
  que carregam sob demanda. `SKILL.md` com 20 KB ou mais reprova no teste.
- **Registre a origem** no fim da skill: de onde a regra veio e quando.

Antes de abrir o PR, na pasta `plugin/`:

```bash
uv run pytest
uv run python tools/validate_skills.py skills
```

O CI roda os mesmos testes, o validador oficial do Claude Code
(`claude plugin validate`) e as regras Semgrep da skill `lgpd`.

Ferramentas recomendadas ao redor do Veritas (ponytail, Headroom,
lgpd-skills) estão em [`docs/FERRAMENTAS.md`](docs/FERRAMENTAS.md).

## Inspiração

As skills `cores`, `tipografia-e-espacamento`, `direcao-de-arte` e
`revisao-de-design` são texto original do Veritas. Para escrevê-las, estas
skills de terceiros foram lidas como referência, sem cópia de frase, lista ou
estrutura:

- `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`,
  `redesign-existing-projects`, `stitch-design-taste` e
  `industrial-brutalist-ui`, do [Taste Skill](https://github.com/Leonxlnx/taste-skill)
  (Leonxlnx, MIT; as antigas hoje moram em
  [taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)).
- `web-design-guidelines`, da Vercel
  ([vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)).

Os números de contraste e de alvo de toque vêm das fontes oficiais citadas em
cada skill (W3C, Apple, Android Developers).

## Licença

[MIT](../LICENSE) — Caio Gonçalves.
