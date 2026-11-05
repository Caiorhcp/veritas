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
| `projeto-existente` | geral | autoral |
| `lgpd` | geral | Lei 13.709/2018 e Res. CD/ANPD 15/2024 |
| `docs-oficiais` | geral | Firecrawl CLI 1.24.4 |
| `python` | geral | autoral |
| `clickup` | processo | autoral |
| `executar-tasks` | processo, **só por `/`** | autoral |
| `atomic-design` | frontend | autoral |
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
/plugin install ponytail@veritas   # opcional: menos código e menos tokens
```

O [Ponytail](https://github.com/DietrichGebert/ponytail) é de [Dietrich Gebert](https://github.com/DietrichGebert) (MIT). O Veritas só o lista no marketplace; ele é instalado direto do repositório do autor.

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

## Licença

[MIT](../LICENSE) — Caio Gonçalves.
