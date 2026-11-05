# Rules — O que é PROIBIDO

Estas regras existem para manter a arquitetura consistente. Violações devem ser corrigidas em code review.

---

## ❌ 1. Lógica de negócio fora do Service

A lógica de negócio vive **exclusivamente** no Service. Nunca em repositories ou routes.

```ts
// ❌ errado — lógica no repository
class PostRepository {
  async create(data: NewPost) {
    if (data.title.length < 3) throw new Error('Title too short'); // ← PROIBIDO
    return db.insert(posts).values(data);
  }
}

// ❌ errado — lógica na route
postsRouter.post('/', async (c) => {
  const body = c.req.valid('json');
  if (body.title.length < 3) throw new BadRequestError('Title too short'); // ← PROIBIDO
  // ...
});

// ✅ correto — lógica no service
class CreatePostService {
  async execute(input: CreatePostInput) {
    if (input.title.length < 3) throw new BadRequestError('Title too short');
    return this.postRepository.create(input);
  }
}
```

---

## ❌ 2. Service com mais de uma responsabilidade

Cada service faz **exatamente uma coisa** e expõe apenas `execute()`.

```ts
// ❌ errado — service faz criar E notificar E atualizar contador
class PostService {
  async createPost() { ... }
  async notifyFollowers() { ... }
  async updatePostCount() { ... }
}

// ✅ correto — um service, uma operação
class CreatePostService {
  async execute(input: CreatePostInput): Promise<Post> { ... }
}
```

---

## ❌ 3. Entrada HTTP sem validação Zod

Toda rota que recebe dados (body, query, param) **deve** usar `zValidator` do Hono.

```ts
// ❌ errado — sem validação
postsRouter.post('/', async (c) => {
  const body = await c.req.json(); // ← sem validação, sem tipo
  // ...
});

// ✅ correto — com zValidator
postsRouter.post('/', zValidator('json', createPostSchema), async (c) => {
  const body = c.req.valid('json'); // ← tipado e validado
  // ...
});
```

---

## ❌ 4. Erros genéricos — sempre use typed AppError

Nunca lance `new Error('mensagem')`. Use sempre os typed errors de `src/modules/shared/errors`.

```ts
// ❌ errado
throw new Error('Post not found');
throw new Error('User already exists');

// ✅ correto
import { NotFoundError, ConflictError } from '@/modules/shared/errors';

throw new NotFoundError('Post not found');
throw new ConflictError('User already exists');
```

Errors disponíveis: `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`, `BadRequestError`.

---

## ❌ 5. Interface de model redundante quando o tipo do Drizzle já serve

Não crie interfaces TypeScript que espelham 1:1 um schema Drizzle. Use os tipos inferidos exportados pelo próprio schema.

```ts
// ❌ errado — interface redundante que duplica o schema
export interface Post {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ correto — tipo inferido no arquivo de schema
export type Post    = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

Crie interfaces em `models/` **apenas** para tipos compostos que não correspondem a uma única tabela (ex: resultado de join com objetos aninhados).

---

## ❌ 6. Mapper desnecessário em queries simples

Não escreva mapper para queries que retornam diretamente o tipo `$inferSelect`. O Drizzle já mapeia `snake_case` → `camelCase` automaticamente via o nome da propriedade no schema.

```ts
// ❌ errado — mapper desnecessário para query simples
function toPost(row: Post): Post {
  return {
    id:        row.id,
    title:     row.title,
    userId:    row.userId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async findById(id: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ? toPost(row) : null; // ← mapper inútil aqui
}

// ✅ correto — sem mapper
async findById(id: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ?? null;
}
```

Mapper é necessário apenas quando a query faz join e o resultado é um tipo composto diferente do schema.

---

## ❌ 7. Coluna do banco sem snake_case explícito

O Drizzle **não** converte automaticamente. Sempre declare o nome da coluna explicitamente em `snake_case`.

```ts
// ❌ errado — Drizzle vai criar coluna "userId" no banco
userId: uuid('userId').notNull(),

// ✅ correto — coluna no banco será "user_id"
userId: uuid('user_id').notNull(),
```

---

## ❌ 8. Imports com caminhos relativos profundos

Use sempre o path alias `@/*`. Proibido usar `../../` para sair do módulo atual.

```ts
// ❌ errado
import { db } from '../../../infra/database/drizzle';

// ✅ correto
import { db } from '@/infra/database/drizzle';
```

---

## ❌ 9. Refresh token armazenado no banco

O refresh token é um JWT — não é armazenado em banco de dados. Toda validação usa assinatura criptográfica.

```ts
// ❌ errado — salvar refresh token no banco
await db.insert(refreshTokens).values({ token, userId });

// ✅ correto — gerar JWT com JwtService
const refreshToken = await jwtService.signRefreshToken(userId);
```
