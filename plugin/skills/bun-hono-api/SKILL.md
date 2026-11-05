---
name: bun-hono-api
description: "Convenções obrigatórias para APIs em Bun + Hono + Drizzle + Zod. Use ao escrever, revisar ou discutir código de API: rotas Hono, services, repositories Drizzle, validação Zod, typed errors, schemas e migrations, auth JWT, testes com bun test. Stack: Bun, Hono, Drizzle, Zod, uuidv7, Biome."
metadata:
  escopo: backend
  stacks: [bun-hono-api]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# API Bun + Hono — contexto obrigatório

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

Você é um engenheiro sênior do time. Ao escrever, revisar ou discutir
código de API, siga **obrigatoriamente** os padrões deste contexto.

## Stack

**Runtime:** Bun · **HTTP:** Hono · **ORM:** Drizzle + postgres · **Validação:**
Zod · **IDs:** uuidv7 · **Linter:** Biome

`@/*` mapeia para `src/*`. Use sempre em imports internos.

## Libs proibidas

- **`express`, `fastify`** — use Hono
- **`prisma`, `typeorm`, `sequelize`** — use Drizzle
- **`class-validator`, `joi`, `yup`** — use Zod
- **`uuid` (v4)** — use `uuidv7`
- **`eslint`, `prettier`** — use Biome
- **`jest`, `vitest`** — use `bun test`

## As nove proibições

Nunca gere código que viole qualquer uma. Os exemplos de cada uma, com o certo
e o errado lado a lado, estão em [rules.md](rules.md).

1. Lógica de negócio fora do Service
2. Service com mais de uma responsabilidade
3. Entrada HTTP sem validação Zod
4. Erros genéricos — sempre use typed `AppError`
5. Interface de model redundante quando o tipo do Drizzle já serve
6. Mapper desnecessário em queries simples
7. Coluna do banco sem snake_case explícito
8. Imports com caminhos relativos profundos
9. Refresh token armazenado no banco

## Comportamento esperado

- **Sempre** valide entradas HTTP com Zod
- **Sempre** use os typed errors de [patterns/error-handling.md](patterns/error-handling.md)
- Use os tipos inferidos do Drizzle (`$inferSelect`, `$inferInsert`) em
  repositories — sem interfaces redundantes
- Use mapper **apenas** quando a query retorna um tipo composto (join com objeto
  aninhado)
- Testes só quando solicitado
- Docs e Bruno só quando solicitado

## Onde consultar

Leia o arquivo que a tarefa pede — não todos de uma vez.

| Vou... | Leia |
|---|---|
| entender a estrutura, camadas e data flow | [architecture.md](architecture.md) |
| escolher lib, versão ou script | [stack.md](stack.md) |
| nomear arquivo, pasta, coluna ou variável | [conventions.md](conventions.md) |
| conferir uma proibição em detalhe | [rules.md](rules.md) |
| mexer em login, JWT ou refresh token | [auth.md](auth.md) |
| criar um módulo do zero | [patterns/new-module.md](patterns/new-module.md) |
| tratar erro | [patterns/error-handling.md](patterns/error-handling.md) |
| fazer listagem paginada | [patterns/pagination.md](patterns/pagination.md) |
| escrever schema Drizzle | [patterns/drizzle-schemas.md](patterns/drizzle-schemas.md) |
| escrever teste | [patterns/testing.md](patterns/testing.md) |
| gerar docs ou coleção Bruno | [patterns/generate-docs.md](patterns/generate-docs.md) |

## Origem

Convenções de uma API em produção, antes mantidas num repositório de
contextos que era copiado para `.context/api` dentro de cada projeto; aqui
elas viajam com a skill.
