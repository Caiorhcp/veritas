# Skills de fora — quando entram e quem manda

Skills de terceiro que a casa usa junto com o Veritas. **Não moram aqui**:
cada um instala do original (ver `docs/FERRAMENTAS.md`). Este arquivo só diz
ao agente quando carregar cada uma e o que fazer quando ela contradiz a casa.

Se a skill não estiver instalada, siga sem ela. Não peça para instalar no
meio da tarefa.

## Quem vence

A skill de fora decide **visual e tática**: tipografia, espaçamento, cor,
composição, padrão de render, memoização, como evitar re-render.

O Veritas decide **estrutura**: stack, libs, pastas, nível do componente,
imports proibidos, arquivos protegidos, LGPD. Em conflito, o Veritas vence,
sem perguntar.

Casos que já aparecem:

- A skill de fora sugere lib nova (GSAP, Framer Motion, FlashList,
  Reanimated, fonte paga): é dependência nova. Passa pela `veritas:principios`
  antes de instalar, e em modo conservar não entra.
- A skill de fora pede outra forma de estilizar (CSS-in-JS, styled-components):
  proibido pela skill de stack. Mesmo visual, em Tailwind.
- A skill de fora monta pastas próprias (`sections/`, `ui/`): os componentes
  vão para o nível certo da `atomic-design`.

## Entram sozinhas

| Tarefa | Skill |
|---|---|
| Componente React, data fetching, bundle, performance (Next, Vite) | `vercel-react-best-practices` |
| Componente com prop booleana demais, API de componente reutilizável | `vercel-composition-patterns` |
| Animação entre rotas ou entre estados da tela, em React | `vercel-react-view-transitions` |
| Lista, animação, performance ou módulo nativo em React Native | `vercel-react-native-skills` |
| Página pública: landing, site institucional, portfolio, hero, página de produto | `design-taste-frontend` |
| Site que já existe e está com cara genérica, "de IA", ou pediram para deixar premium | `redesign-existing-projects` |
| Revisar UI, acessibilidade ou UX | `web-design-guidelines` |

`design-taste-frontend` não é para dashboard nem tela de sistema: a própria
skill diz isso. Tela interna segue só a skill de stack.

## Só quando a pessoa pede pelo nome

| Skill | Por que não entra sozinha |
|---|---|
| `deploy-to-vercel`, `vercel-cli-with-tokens` | Publica código fora da máquina. Deploy é decisão da pessoa, nunca efeito colateral |
| `vercel-optimize` | Lê métricas e custo da conta Vercel do cliente |
| `minimalist-ui`, `industrial-brutalist-ui`, `high-end-visual-design`, `gpt-taste` | Cada uma é uma estética fechada, e elas se contradizem. Entram quando a pessoa nomeia o estilo, e aí substituem a `design-taste-frontend` |
| `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit`, `stitch-design-taste` | Geram imagem ou documento de design, não código. Etapa que a pessoa escolhe |
| `full-output-enforcement`, `writing-guidelines` | Não são de código de interface |

## Nunca

`design-taste-frontend-v1` e `design-taste-frontend-v2-experimental`: versões
antigas, mantidas pelo autor só por compatibilidade. A atual é a
`design-taste-frontend`.

## Origem

Banco de skills do Veritas. Criado em 2026-10-14 ao adotar
`vercel-labs/agent-skills` e `Leonxlnx/taste-skill`. Correções vão por PR.
