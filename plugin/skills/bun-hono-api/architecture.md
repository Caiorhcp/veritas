# Architecture Guide

This document describes the architectural pattern used in this project. It is intentionally free of domain-specific business logic so it can be reused as a template for other projects.

---

## Overview

The architecture organises code around **feature modules** (vertical slices), supported by a thin **infrastructure layer** (horizontal concerns). Each module owns its models, data access, business logic, validation, and routing. The infrastructure layer handles the HTTP server, database connection, environment, and shared libraries.

```
src/
├── modules/          # Feature modules — one folder per resource
│   ├── <feature>/
│   │   ├── models/       # TypeScript interfaces for composed/joined types only
│   │   ├── repositories/ # Data access — Drizzle queries
│   │   ├── services/     # Business logic — one class per operation
│   │   ├── validators/   # Zod schemas for HTTP input
│   │   └── routes/
│   │       └── <feature>.routes.ts   # Hono router + inline controller logic
│   └── shared/
│       ├── errors/       # Typed application errors
│       └── models/       # Shared types (pagination, etc.)
└── infra/
    ├── database/drizzle/
    │   ├── schema/       # Drizzle table definitions + inferred type exports
    │   └── index.ts      # DB connection singleton (exported as `db`)
    ├── http/
    │   ├── app.ts        # Hono app, global middlewares
    │   ├── server.ts     # Bun server bootstrap
    │   ├── routes/       # Central route registration
    │   └── middlewares/  # Reusable Hono middlewares (auth, error handler)
    ├── env/              # Zod env schema — validated at startup
    └── lib/              # Third-party service adapters
        └── jwt/
            └── jwt.service.ts
```

---

## Core Principles

### 1. Modules own their full vertical slice

Every feature module (`posts`, `users`, `communities`, …) contains everything it needs: types, data access, business logic, validation rules, and HTTP routing. You can read a feature end-to-end by staying inside one folder.

### 2. Services are single-operation classes

Each service class does exactly one thing and exposes a single `execute()` method. No service mixes concerns or calls another service unless explicitly needed.

### 3. Repositories own SQL — services own logic

A **repository** is a class that wraps Drizzle queries for one entity. It uses Drizzle's inferred types (`$inferSelect`, `$inferInsert`) directly — no redundant model interfaces. Mappers are only written when a query joins multiple tables and the result shape is a composed type not represented by a single schema. The service never writes SQL; the repository never applies business rules.

### 4. Routes are simple Hono routers

Route files export a configured `Hono` router. Middlewares (JWT auth, etc.) are imported directly from `@/infra/http/middlewares` and applied inline on each route that needs them — no factory functions, no dependency injection.

### 5. Errors are typed and thrown

Services throw typed errors (`NotFoundError`, `ConflictError`, …). A single global Hono error handler maps them to HTTP responses. Controllers never write error responses manually.

### 6. Environment is validated at startup

A Zod schema at `src/infra/env/index.ts` parses `process.env`. If any required variable is missing the process exits immediately with a clear message — no silent runtime failures.

---

## Stack

| Layer | Library |
|---|---|
| Runtime | Bun |
| HTTP framework | Hono |
| ORM | Drizzle ORM (`drizzle-orm`) + `postgres` driver |
| Schema migrations | `drizzle-kit` |
| Validation | Zod + `@hono/zod-validator` |
| IDs | `uuidv7` |
| Linter/formatter | Biome |

---

## Layer-by-layer walkthrough

### `src/modules/shared/errors/`

All application errors extend a single `AppError` base class that carries `message`, `code` (enum), and `statusCode`.

```ts
// src/modules/shared/errors/app-error.ts
export enum AppErrorCode {
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: AppErrorCode,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
```

Each concrete error is a one-liner:

```ts
// src/modules/shared/errors/not-found.error.ts
import { AppError, AppErrorCode } from './app-error';

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, AppErrorCode.NOT_FOUND, 404);
  }
}
```

Export everything from a single `index.ts` so imports stay clean:

```ts
// src/modules/shared/errors/index.ts
export { AppError, AppErrorCode } from './app-error';
export { BadRequestError }       from './bad-request.error';
export { ConflictError }         from './conflict.error';
export { ForbiddenError }        from './forbidden.error';
export { NotFoundError }         from './not-found.error';
export { UnauthorizedError }     from './unauthorized.error';
```

### `src/modules/shared/models/pagination.ts`

Standard pagination contract used across the entire API:

```ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface Pagination<T> {
  count: number;
  results: T[];
}
```

---

### `src/infra/env/index.ts`

Validates environment variables at import time. Process exits if validation fails.

```ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL:        z.string().min(1),
  NODE_ENV:            z.enum(['development', 'production', 'test']).default('development'),
  PORT:                z.coerce.number().default(3000),
  CORS_ORIGIN:         z.string().default('*'),
  JWT_SECRET:          z.string().min(1),
  JWT_REFRESH_SECRET:  z.string().min(1),
  // add every required variable here
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  for (const issue of parsed.error.issues) {
    console.error(` - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = {
  databaseUrl:       parsed.data.DATABASE_URL,
  nodeEnv:           parsed.data.NODE_ENV,
  port:              parsed.data.PORT,
  corsOrigin:        parsed.data.CORS_ORIGIN,
  jwtSecret:         parsed.data.JWT_SECRET,
  jwtRefreshSecret:  parsed.data.JWT_REFRESH_SECRET,
};
```

---

### `src/infra/database/drizzle/index.ts`

One connection pool, one exported `db` instance, used by every repository.

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/infra/env';
import * as schema from './schema';

const client = postgres(env.databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export const closeDb = () => client.end();
```

### `src/infra/database/drizzle/schema/<entity>.ts`

Drizzle table definitions. Each file exports tables, their relations, **and inferred TypeScript types**. A shared `timestamps` helper keeps `created_at`/`updated_at` consistent:

```ts
import { pgTable, uuid, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()).notNull(),
};

export const items = pgTable(
  'items',
  {
    id:        uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    name:      text('name').notNull(),
    isActive:  boolean('is_active').default(true).notNull(),
    userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (t) => [
    index('items_user_idx').on(t.userId),
  ],
);

export const itemsRelations = relations(items, ({ one }) => ({
  user: one(users, { fields: [items.userId], references: [users.id] }),
}));

// Export inferred types here — use these in repositories and services
export type Item    = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

All schema files are re-exported from `schema/index.ts` so Drizzle can discover everything.

---

### `src/modules/<feature>/models/<entity>.model.ts`

Only create model files for **composed types** that don't map 1:1 to a single table — for example, a joined result with nested objects:

```ts
// Only needed when the shape combines multiple tables
import type { Item } from '@/infra/database/drizzle/schema/items';
import type { User } from '@/infra/database/drizzle/schema/users';

export interface ItemWithAuthor extends Item {
  author: Pick<User, 'id' | 'username'>;
}
```

For simple entity types, import directly from the schema file:
```ts
import type { Item } from '@/infra/database/drizzle/schema/items';
```

---

### `src/modules/<feature>/repositories/<entity>.repository.ts`

A class that wraps Drizzle queries for one entity. Uses Drizzle's inferred types in method signatures. Mapper functions are only written when the query result shape differs from the schema type (e.g., joins).

```ts
import { eq, and, count, desc } from 'drizzle-orm';
import { db } from '@/infra/database/drizzle';
import { items, type Item, type NewItem } from '@/infra/database/drizzle/schema/items';
import { users } from '@/infra/database/drizzle/schema/users';
import type { ItemWithAuthor } from '../models/item-with-author.model';

// ----- mapper (only needed for the joined query) -----

function toItemWithAuthor(row: {
  item: Item;
  user: { id: string; username: string };
}): ItemWithAuthor {
  return { ...row.item, author: row.user };
}

// ----- repository -----

export class ItemRepository {
  async findById(id: string): Promise<Item | null> {
    const [row] = await db.select().from(items).where(eq(items.id, id));
    return row ?? null;
  }

  async findByIdWithAuthor(id: string): Promise<ItemWithAuthor | null> {
    const [row] = await db
      .select({ item: items, user: { id: users.id, username: users.username } })
      .from(items)
      .innerJoin(users, eq(items.userId, users.id))
      .where(eq(items.id, id));

    return row ? toItemWithAuthor(row) : null;
  }

  async list(page: number, limit: number): Promise<{ count: number; results: Item[] }> {
    const offset = (page - 1) * limit;

    const [countResult, rows] = await Promise.all([
      db.select({ count: count() }).from(items),
      db.select().from(items)
        .orderBy(desc(items.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    return {
      count:   countResult[0]?.count ?? 0,
      results: rows,
    };
  }

  async create(data: Pick<NewItem, 'name' | 'userId'>): Promise<Item> {
    const [row] = await db.insert(items).values(data).returning();
    return row;
  }

  async softDelete(id: string): Promise<void> {
    await db.update(items).set({ isActive: false }).where(eq(items.id, id));
  }
}
```

---

### `src/modules/<feature>/services/<action>.service.ts`

One class, one public method: `execute()`. Throws typed errors. Never writes SQL.

```ts
import { NotFoundError } from '@/modules/shared/errors';
import { ItemRepository } from '../repositories/item.repository';
import type { Item } from '@/infra/database/drizzle/schema/items';

const itemRepo = new ItemRepository();

export class GetItemService {
  async execute(id: string): Promise<Item> {
    const item = await itemRepo.findById(id);
    if (!item) throw new NotFoundError('Item not found.');
    return item;
  }
}
```

---

### `src/modules/<feature>/validators/<entity>.validator.ts`

Zod schemas for HTTP input. Types inferred directly from the schema.

```ts
import { z } from 'zod';

export const createItemBodySchema = z.object({
  name:  z.string().min(1),
  extra: z.string().optional(),
});
export type CreateItemBody = z.infer<typeof createItemBodySchema>;

export const listItemsQuerySchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
});
export type ListItemsQuery = z.infer<typeof listItemsQuerySchema>;
```

---

### `src/modules/<feature>/routes/<feature>.routes.ts`

A Hono router with inline controller logic. Middlewares are imported directly — no factory functions, no dependency injection.

```ts
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { jwtAuthMiddleware }          from '@/infra/http/middlewares/jwt-auth.middleware';
import { GetItemService }    from '../services/get-item.service';
import { CreateItemService } from '../services/create-item.service';
import { DeleteItemService } from '../services/delete-item.service';
import { ListItemsService }  from '../services/list-items.service';
import { createItemBodySchema, listItemsQuerySchema } from '../validators/item.validator';

const getItemService    = new GetItemService();
const createItemService = new CreateItemService();
const deleteItemService = new DeleteItemService();
const listItemsService  = new ListItemsService();

export const itemsRouter = new Hono();

itemsRouter.get('/', zValidator('query', listItemsQuerySchema), async (c) => {
  const { page, limit } = c.req.valid('query');
  const data = await listItemsService.execute({ page, limit });
  return c.json(data);
});

itemsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const data = await getItemService.execute(id);
  return c.json(data);
});

itemsRouter.post('/', jwtAuthMiddleware, zValidator('json', createItemBodySchema), async (c) => {
  const userId = c.get('sub' as never) as string;
  const body   = c.req.valid('json');
  const data   = await createItemService.execute(userId, body);
  return c.json(data, 201);
});

itemsRouter.delete('/:id', jwtAuthMiddleware, async (c) => {
  const id = c.req.param('id');
  await deleteItemService.execute(id);
  return c.body(null, 204);
});
```

---

### `src/infra/lib/jwt/jwt.service.ts`

Concrete implementation of JWT sign/verify. Used by auth middlewares and auth services.

```ts
import { sign, verify } from 'hono/jwt';
import { env } from '@/infra/env';

export interface AccessTokenPayload {
  sub: string;
  type: 'access';
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

export class JwtService {
  async signAccessToken(userId: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return sign({ sub: userId, type: 'access', iat: now, exp: now + 15 * 60 }, env.jwtSecret);
  }

  async signRefreshToken(userId: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return sign({ sub: userId, type: 'refresh', iat: now, exp: now + 7 * 24 * 60 * 60 }, env.jwtRefreshSecret);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return verify(token, env.jwtSecret) as Promise<AccessTokenPayload>;
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return verify(token, env.jwtRefreshSecret) as Promise<RefreshTokenPayload>;
  }
}
```

---

### `src/infra/http/middlewares/error-handler.middleware.ts`

The single place that translates domain errors into HTTP responses.

```ts
import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { AppError, AppErrorCode } from '@/modules/shared/errors';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: { code: err.code, message: err.message } }, err.statusCode as any);
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        error: {
          code: AppErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: err.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
        },
      },
      422,
    );
  }

  console.error(err);
  return c.json({ error: { code: AppErrorCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' } }, 500);
};
```

### `src/infra/http/app.ts`

```ts
import { Hono } from 'hono';
import { compress }      from 'hono/compress';
import { cors }          from 'hono/cors';
import { logger }        from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { timeout }       from 'hono/timeout';
import { env }           from '@/infra/env';
import { errorHandler }  from './middlewares/error-handler.middleware';
import { registerRoutes } from './routes';

const app = new Hono();

app.use(secureHeaders());
app.use(logger());
app.use(cors({ origin: env.corsOrigin }));
app.use(compress());
app.use(timeout(30_000));

app.onError(errorHandler);
registerRoutes(app);

export { app };
```

### `src/infra/http/routes/index.ts`

All module routers are registered here.

```ts
import type { Hono } from 'hono';
import { itemsRouter } from '@/modules/items/routes/items.routes';
import { usersRouter } from '@/modules/users/routes/users.routes';

export const registerRoutes = (app: Hono) => {
  app.route('/items', itemsRouter);
  app.route('/users', usersRouter);
  // ...
};
```

### `src/infra/http/server.ts`

```ts
import { closeDb } from '@/infra/database/drizzle';
import { env }     from '@/infra/env';
import { app }     from './app';

const server = Bun.serve({
  hostname: '0.0.0.0',
  port:     env.port,
  fetch:    app.fetch,
});

console.log(`Server running on http://0.0.0.0:${env.port}`);

async function shutdown() {
  server.stop(true);
  await closeDb();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

---

## Data flow

```
HTTP Request
  → Hono global middlewares (cors, logger, secureHeaders, timeout)
  → Route match
  → Auth middleware (applied inline per route, optional or required)
  → zValidator middleware (Zod schema)  ← 422 if invalid
  → Controller (inline in routes file)
  → Service.execute()                   ← throws AppError if business rule fails
  → Repository method                   ← returns typed result
  → Drizzle query → PostgreSQL
  → Result returned to service
  → c.json(data, statusCode)
  → [on any throw] errorHandler middleware → JSON error response
```

---

## Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| Module folder | kebab-case | `posts`, `community-members` |
| Model file | `<entity>.model.ts` | `post-with-author.model.ts` |
| Repository file | `<entity>.repository.ts` | `post.repository.ts` |
| Service file | `<verb>-<entity>.service.ts` | `create-post.service.ts` |
| Validator file | `<entity>.validator.ts` | `post.validator.ts` |
| Routes file | `<feature>.routes.ts` inside `routes/` | `src/modules/posts/routes/posts.routes.ts` |
| Schema file | `<entity>.ts` (plural table names) | `posts.ts` |
| IDs | `uuidv7()` everywhere | — |
| DB columns | `snake_case` | `created_at`, `user_id` |
| TS properties | `camelCase` | `createdAt`, `userId` |

---

## Step-by-step: adding a new feature

### 1. Write the Drizzle schema

```
src/infra/database/drizzle/schema/<entity>.ts
```

Define the table with `pgTable`, add indexes, define `relations`, and **export inferred types**:

```ts
export type Post    = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

Re-export from `schema/index.ts`. Run migrations:
```bash
bun run db:generate
bun run db:migrate
```

### 2. Define models (only when needed)

```
src/modules/<feature>/models/<entity>.model.ts
```

Only if the feature requires a composed type (joins, nested objects). Simple entities use the Drizzle-inferred type directly.

### 3. Implement the repository

```
src/modules/<feature>/repositories/<entity>.repository.ts
```

Write CRUD methods. Import types from the schema file. Add mapper functions only when the query result shape differs from the schema type (e.g., joins with nested objects).

### 4. Write services

```
src/modules/<feature>/services/<verb>-<entity>.service.ts
```

One service per operation. Instantiate the repository at module scope. Throw typed errors for invalid states.

### 5. Define validators

```
src/modules/<feature>/validators/<entity>.validator.ts
```

One Zod schema per HTTP input shape. Export inferred TypeScript types alongside.

### 6. Create routes

```
src/modules/<feature>/routes/<feature>.routes.ts
```

Export a named Hono router. Import middlewares directly from `@/infra/http/middlewares`. Instantiate services at module scope. Use `zValidator` for input parsing.

### 7. Register routes

Add a line in `src/infra/http/routes/index.ts`:

```ts
import { postsRouter } from '@/modules/posts/routes/posts.routes';

app.route('/posts', postsRouter);
```

---

## Environment setup

`.env` minimum:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NODE_ENV=development
PORT=3000
JWT_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CORS_ORIGIN=*
```

Extend `src/infra/env/index.ts` for every new variable.

---

## Scripts

```bash
bun run http:dev       # Start dev server with watch mode
bun run http:start     # Start production server

bun run db:generate    # Generate Drizzle migrations from schema changes
bun run db:migrate     # Apply pending migrations
bun run db:studio      # Open Drizzle Studio UI

bun test               # Run all tests
bun run check          # Lint + format (Biome)
```

---

## Path alias

`@/*` maps to `src/*`. Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Use it for all internal imports:

```ts
import { db }            from '@/infra/database/drizzle';
import { NotFoundError } from '@/modules/shared/errors';
import { env }           from '@/infra/env';
```
