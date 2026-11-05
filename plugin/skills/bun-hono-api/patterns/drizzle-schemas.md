# Pattern — Drizzle Schemas

## Regras obrigatórias

1. **Sempre** declare o nome da coluna em `snake_case` explicitamente
2. **Sempre** use `uuidv7()` para IDs
3. **Sempre** inclua o helper `timestamps`
4. **Sempre** adicione `index` para colunas de foreign key
5. **Sempre** declare `relations` quando houver relacionamentos
6. **Sempre** exporte os tipos inferidos (`$inferSelect`, `$inferInsert`) no próprio arquivo de schema
7. Re-exporte o schema em `schema/index.ts`

---

## Outro banco: quando é aceitável

**Postgres com `pgTable` é o padrão**, e é o que se usa sem pensar. Todo projeto
que vai para produção nasce assim.

**A exceção:** quando a pessoa pede outro banco explicitamente, ou o projeto é
descartável — validação de ideia, prova de conceito, teste de fluxo. Aí
`sqliteTable` do `drizzle-orm/sqlite-core` é aceitável.

**O que não muda na exceção.** As sete regras acima continuam valendo, todas:
nome de coluna em `snake_case` explícito, `uuidv7()` para IDs, o helper
`timestamps`, tipos inferidos exportados no próprio arquivo, re-export em
`schema/index.ts`. O que muda é o adaptador, não a disciplina.

```ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { uuidv7 } from 'uuidv7';

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
};

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

**Nunca escolha sozinho.** Sem pedido explícito e sem ser descartável, é
Postgres. Migrar de SQLite para Postgres depois custa mais que nascer certo.

**Origem:** decisão de arquitetura, surgida no `validacao-usuario-api`
(2026-09-21). O projeto usou SQLite a pedido, seguiu as outras nove regras da
skill, e revelou que a convenção não previa o caso.

---

## Template base

```ts
import { pgTable, uuid, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

// Helper de timestamps — use em todas as tabelas
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()).notNull(),
};

export const posts = pgTable(
  'posts',
  {
    id:      uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    title:   text('title').notNull(),
    content: text('content').notNull(),
    userId:  uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (t) => [
    index('posts_user_idx').on(t.userId), // index em toda FK
  ],
);

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
}));

// Exporte os tipos inferidos aqui — use nos repositories e services
export type Post    = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

---

## Tipos de coluna comuns

```ts
// Texto
name:        text('name').notNull(),
description: text('description'),              // nullable — sem .notNull()

// Número
price:       integer('price').notNull(),
amount:      numeric('amount', { precision: 10, scale: 2 }).notNull(),

// Boolean
isActive:    boolean('is_active').default(true).notNull(),

// Enum
import { pgEnum } from 'drizzle-orm/pg-core';
export const statusEnum = pgEnum('status', ['active', 'inactive', 'pending']);
status: statusEnum('status').default('active').notNull(),

// JSON
metadata: jsonb('metadata'),

// FK
userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
```

---

## Relacionamentos

```ts
// Um para muitos
export const postsRelations = relations(posts, ({ one, many }) => ({
  user:     one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
}));

// Muitos para muitos (via tabela pivot)
export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag:  one(tags,  { fields: [postTags.tagId],  references: [tags.id] }),
}));
```

---

## Re-exportar em schema/index.ts

```ts
// src/infra/database/drizzle/schema/index.ts
export * from './users';
export * from './posts';
export * from './comments';
// adicione cada novo schema aqui
```

---

## Usando tipos do Drizzle nos repositories

Para queries simples (sem join), use os tipos exportados diretamente — sem mapper:

```ts
import { posts, type Post, type NewPost } from '@/infra/database/drizzle/schema/posts';

async findById(id: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ?? null;
}

async create(data: Pick<NewPost, 'title' | 'content' | 'userId'>): Promise<Post> {
  const [row] = await db.insert(posts).values(data).returning();
  return row;
}
```

---

## Mapper no Repository — apenas quando necessário

Escreva mapper **somente** quando a query retorna um shape diferente do schema (tipicamente em joins):

```ts
// Tipo composto para join — definido em models/
export interface PostWithAuthor extends Post {
  author: { id: string; username: string };
}

// Mapper privado co-localizado no repository
function toPostWithAuthor(row: {
  post: Post;
  user: { id: string; username: string };
}): PostWithAuthor {
  return { ...row.post, author: row.user };
}

// Query com join
async findByIdWithAuthor(id: string): Promise<PostWithAuthor | null> {
  const [row] = await db
    .select({ post: posts, user: { id: users.id, username: users.username } })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id));

  return row ? toPostWithAuthor(row) : null;
}
```

Não crie mappers para queries simples — o Drizzle já retorna o tipo correto via `$inferSelect`.
