# Fontes oficiais por stack

Ponto de partida do passo 3 da `docs-oficiais`: a raiz da doc oficial de cada
lib que as skills do Veritas citam. Com a raiz em mãos, `firecrawl map <raiz>
--search "<assunto>"` encontra a página.

Todas as URLs responderam 200 em 2026-09-23.

**Fonte de verdade.** As skills de stack que conferem contra doc externa
declaram a URL em `metadata.upstream`. Esta tabela repete essas URLs para a
consulta caber em um arquivo. Se uma mudar, mude a outra no mesmo PR — a
auditoria confere as duas (`auditoria.md`, passo 2).

## Backend

| Lib | Doc oficial | Usada em |
|---|---|---|
| Bun | https://bun.sh/docs | `bun-hono-api` |
| Hono | https://hono.dev/docs | `bun-hono-api` |
| Drizzle ORM / drizzle-kit | https://orm.drizzle.team/docs/overview | `bun-hono-api`, `nextjs` |
| Zod | https://zod.dev | `bun-hono-api`, `nextjs`, `vite` |
| Biome | https://biomejs.dev/guides/getting-started/ | `bun-hono-api` |
| NestJS (inclui config, swagger, passport, jwt) | https://docs.nestjs.com/ | `nestjs` (upstream) |
| class-validator | https://github.com/typestack/class-validator | `nestjs` |
| TypeORM | https://typeorm.io/ | `nestjs` |
| Prisma | https://www.prisma.io/docs | `nestjs`, `nextjs` |
| Django | https://docs.djangoproject.com/en/stable/ | `django` (upstream) |
| Django REST Framework | https://www.django-rest-framework.org/ | `django` |

## Frontend

| Lib | Doc oficial | Usada em |
|---|---|---|
| React | https://react.dev/reference/react | `vite`, `nextjs`, `atomic-design` |
| Next.js | https://nextjs.org/docs | `nextjs` (upstream) |
| Vite | https://vite.dev/guide/ | `vite` (upstream) |
| React Router | https://reactrouter.com/home | `vite` |
| TanStack Query | https://tanstack.com/query/latest/docs/framework/react/overview | `vite`, `nextjs` |
| SWR | https://swr.vercel.app/docs/getting-started | `nextjs` |
| Axios | https://axios-http.com/docs/intro | `vite` |
| Zustand | https://zustand.docs.pmnd.rs/ | `vite`, `react-native` |
| React Hook Form | https://react-hook-form.com/docs | `vite`, `nextjs` |
| Tailwind CSS | https://tailwindcss.com/docs | `vite`, `nextjs`, `react-native` (via NativeWind) |
| shadcn/ui | https://ui.shadcn.com/docs | `nextjs` |
| TypeScript | https://www.typescriptlang.org/docs/ | todas as de TS |

## Mobile

| Lib | Doc oficial | Usada em |
|---|---|---|
| React Native | https://reactnative.dev/docs/getting-started | `react-native` (upstream) |
| Expo | https://docs.expo.dev/ | `react-native` |
| Expo Router | https://docs.expo.dev/router/introduction/ | `react-native` |
| React Navigation | https://reactnavigation.org/docs/getting-started | `react-native` |
| NativeWind | https://www.nativewind.dev/ | `react-native` |
| AsyncStorage | https://github.com/react-native-async-storage/async-storage | `react-native` |
| MMKV | https://github.com/mrousavy/react-native-mmkv | `react-native` |

## Python

| Lib | Doc oficial | Usada em |
|---|---|---|
| Python | https://docs.python.org/3/ | `python`, `django` |
| uv | https://docs.astral.sh/uv/ | `python` |
| Ruff | https://docs.astral.sh/ruff/ | `python` |
| pytest | https://docs.pytest.org/en/stable/ | `python` |
| Pydantic | https://docs.pydantic.dev/latest/ | `python`, `django` |

## Versões

A raiz aponta para a versão mais nova. Para a versão do projeto:

- **Django**: troque `stable` pela versão (`/en/5.2/`).
- **Python**: troque `3` pela versão (`/3.11/`).
- **TanStack Query**: troque `latest` pela major só se o projeto estiver numa
  anterior à atual (`/query/v4/`). A major atual redireciona para `latest`.
- **Pydantic**: troque `latest` pela versão (`/2.9/`).
- **As demais**: use o seletor de versão do site, se houver. Se não houver,
  confirme no changelog ou em `https://github.com/<org>/<repo>/releases`.

## Lib fora da tabela

Use o degrau 3 do passo 3 (`firecrawl developer`) para achar o site oficial.
Se a lib virou parte de uma stack da casa, acrescente a linha aqui por PR.
