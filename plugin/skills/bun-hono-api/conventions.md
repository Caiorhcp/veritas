# Conventions

## Naming de arquivos e pastas

| Artefato | Convenção | Exemplo |
|---|---|---|
| Pasta de módulo | `kebab-case` | `community-members` |
| Model | `<entity>.model.ts` | `post-with-author.model.ts` |
| Repository | `<entity>.repository.ts` | `post.repository.ts` |
| Service | `<verb>-<entity>.service.ts` | `create-post.service.ts` |
| Validator | `<entity>.validator.ts` | `post.validator.ts` |
| Routes | `<feature>.routes.ts` dentro de `routes/` | `src/modules/posts/routes/posts.routes.ts` |
| Schema Drizzle | `<entity>.ts` (plural) | `posts.ts` |
| Teste unit | `<verb>-<entity>.service.test.ts` | `create-post.service.test.ts` |
| Teste integration | `<module>.integration.test.ts` | `posts.integration.test.ts` |

## snake_case no banco, camelCase no TypeScript

**Sempre** use `snake_case` nas colunas do banco e `camelCase` nas interfaces TypeScript. O Drizzle faz o mapeamento automaticamente via o nome da propriedade na definição do schema.

### Schema Drizzle (banco)
```ts
// ✅ correto — snake_case nas colunas, camelCase nas propriedades
export const posts = pgTable('posts', {
  id:        uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  title:     text('title').notNull(),
  userId:    uuid('user_id').notNull(),   // coluna no banco: user_id | prop TypeScript: userId
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()).notNull(),
});

// Exporte os tipos inferidos no próprio arquivo de schema
export type Post    = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

### Usando tipos do Drizzle no repository
```ts
// ✅ correto — usa os tipos inferidos do schema, sem interface redundante
import { posts, type Post, type NewPost } from '@/infra/database/drizzle/schema/posts';

async findById(id: string): Promise<Post | null> { ... }
async create(data: Pick<NewPost, 'title' | 'userId'>): Promise<Post> { ... }
```

### Model TypeScript (apenas para tipos compostos)
```ts
// ✅ correto — model só quando necessário (joins, shapes compostos)
import type { Post } from '@/infra/database/drizzle/schema/posts';
import type { User } from '@/infra/database/drizzle/schema/users';

export interface PostWithAuthor extends Post {
  author: Pick<User, 'id' | 'username'>;
}
```

### Mapper (dentro do repository, apenas quando necessário)
```ts
// ✅ correto — mapper só quando o resultado de uma query tem shape diferente do schema
function toPostWithAuthor(row: { post: Post; user: { id: string; username: string } }): PostWithAuthor {
  return { ...row.post, author: row.user };
}
```

Não escreva mapper para queries simples — o Drizzle já retorna o tipo correto.

## Estrutura de pastas por módulo

```
src/modules/<feature>/
├── models/             # Apenas para tipos compostos (joins, shapes especiais)
│   └── <entity>.model.ts
├── repositories/
│   └── <entity>.repository.ts
├── services/
│   └── <verb>-<entity>.service.ts
├── validators/
│   └── <entity>.validator.ts
└── routes/
    └── <feature>.routes.ts
```

## IDs

Use `uuidv7()` em **todos** os `id` de todas as tabelas. Nunca use `uuid()` (v4) nem IDs sequenciais.

```ts
id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
```

## Timestamps

Todo model que persiste no banco deve ter `createdAt` e `updatedAt`. Use o helper de timestamps:

```ts
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()).notNull(),
};

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  // ... outros campos
  ...timestamps,
});
```

## Imports

Sempre use o path alias `@/*`:

```ts
import { db }             from '@/infra/database/drizzle';
import { env }            from '@/infra/env';
import { NotFoundError }  from '@/modules/shared/errors';
import { jwtAuthMiddleware } from '@/infra/http/middlewares/jwt-auth.middleware';
```
