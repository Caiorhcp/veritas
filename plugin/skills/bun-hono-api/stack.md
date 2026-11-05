# Stack

Estas são as únicas libs autorizadas para cada responsabilidade. Não adicione alternativas sem aprovação do time.

## Tabela de dependências

| Responsabilidade | Lib | Versão mínima | Por quê |
|---|---|---|---|
| Runtime | `bun` | 1.x | Performance, tooling nativo (test, bundler) |
| HTTP Framework | `hono` | 4.x | Leve, tipado, middleware simples |
| ORM | `drizzle-orm` | 0.30+ | Type-safe, sem magic, SQL explícito |
| Driver Postgres | `postgres` | 3.x | Leve, compatível com Drizzle. Exceção para projeto descartável ou pedido explícito: ver `patterns/drizzle-schemas.md` |
| Migrations | `drizzle-kit` | — | Geração e aplicação de migrations |
| Validação HTTP | `zod` + `@hono/zod-validator` | — | Validação e inferência de tipos juntos |
| IDs | `uuidv7` | — | UUIDs ordenáveis por tempo |
| Linter/Formatter | `biome` | — | Substitui ESLint + Prettier |

## Libs proibidas

- ❌ `express`, `fastify` — use Hono
- ❌ `prisma`, `typeorm`, `sequelize` — use Drizzle
- ❌ `class-validator`, `joi`, `yup` — use Zod
- ❌ `uuid` (v4) — use `uuidv7`
- ❌ `eslint`, `prettier` — use Biome
- ❌ `jest`, `vitest` — use `bun test`

## Scripts disponíveis

```bash
bun run http:dev       # Dev server com watch
bun run http:start     # Produção

bun run db:generate    # Gera migrations a partir do schema
bun run db:migrate     # Aplica migrations pendentes
bun run db:studio      # Drizzle Studio UI

bun test               # Roda todos os testes
bun run check          # Lint + format (Biome)
```

## Path alias

`@/*` mapeia para `src/*`. Use sempre em imports internos:

```ts
// ✅ correto
import { db } from '@/infra/database/drizzle';
import { NotFoundError } from '@/modules/shared/errors';

// ❌ errado
import { db } from '../../infra/database/drizzle';
```
