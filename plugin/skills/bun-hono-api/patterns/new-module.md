# Pattern — Criando um novo módulo

Siga esta ordem sempre. Não pule etapas.

---

## 1. Schema Drizzle (`src/infra/database/drizzle/schema/<entity>.ts`)

Veja `patterns/drizzle-schemas.md` para detalhes. Após criar, **exporte os tipos inferidos** no mesmo arquivo e re-exporte em `schema/index.ts`:

```ts
export const posts = pgTable('posts', { ... });

export type Post    = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

Em seguida rode:

```bash
bun run db:generate
bun run db:migrate
```

---

## 2. Model (`src/modules/<feature>/models/<entity>.model.ts`) — apenas se necessário

Só crie se o módulo precisar de um tipo composto que não existe no schema (ex: join com dados de outra tabela):

```ts
import type { Post } from '@/infra/database/drizzle/schema/posts';
import type { User } from '@/infra/database/drizzle/schema/users';

export interface PostWithAuthor extends Post {
  author: Pick<User, 'id' | 'username'>;
}
```

Para tipos simples, importe direto do schema — não crie interface redundante.

---

## 3. Repository (`src/modules/<feature>/repositories/<entity>.repository.ts`)

- Uma classe por entidade
- Use os tipos inferidos do Drizzle (`$inferSelect`, `$inferInsert`) nos parâmetros e retornos
- Mapper privado co-localizado apenas quando a query faz join e retorna shape composto
- Nunca aplica regra de negócio

```ts
import { eq } from 'drizzle-orm';
import { db } from '@/infra/database/drizzle';
import { posts, type Post, type NewPost } from '@/infra/database/drizzle/schema/posts';

export class PostRepository {
  async findById(id: string): Promise<Post | null> {
    const [row] = await db.select().from(posts).where(eq(posts.id, id));
    return row ?? null;
  }

  async create(data: Pick<NewPost, 'title' | 'content' | 'userId'>): Promise<Post> {
    const [row] = await db.insert(posts).values(data).returning();
    return row;
  }
}
```

---

## 4. Services (`src/modules/<feature>/services/<verb>-<entity>.service.ts`)

Um arquivo por operação. Instancie o repository no escopo do módulo (fora da classe).

```ts
import { NotFoundError } from '@/modules/shared/errors';
import { PostRepository } from '../repositories/post.repository';
import type { Post } from '@/infra/database/drizzle/schema/posts';

const postRepository = new PostRepository();

export class GetPostService {
  async execute(id: string): Promise<Post> {
    const post = await postRepository.findById(id);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  }
}
```

---

## 5. Validators (`src/modules/<feature>/validators/<entity>.validator.ts`)

Um schema Zod por shape de entrada HTTP. Exporte os tipos inferidos juntos.

```ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title:   z.string().min(3).max(255),
  content: z.string().min(1),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const listPostsQuerySchema = z.object({
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
```

---

## 6. Routes (`src/modules/<feature>/routes/<feature>.routes.ts`)

Exporte um router Hono nomeado. Importe middlewares diretamente — sem factory function.

```ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { jwtAuthMiddleware }          from '@/infra/http/middlewares/jwt-auth.middleware';
import { createPostSchema, listPostsQuerySchema } from '../validators/post.validator';
import { CreatePostService } from '../services/create-post.service';
import { GetPostService }    from '../services/get-post.service';
import { ListPostsService }  from '../services/list-posts.service';
import { DeletePostService } from '../services/delete-post.service';

const createPostService = new CreatePostService();
const getPostService    = new GetPostService();
const listPostsService  = new ListPostsService();
const deletePostService = new DeletePostService();

export const postsRouter = new Hono();

postsRouter.get('/', zValidator('query', listPostsQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const result = await listPostsService.execute(query);
  return c.json(result);
});

postsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const post = await getPostService.execute(id);
  return c.json(post);
});

postsRouter.post('/', jwtAuthMiddleware, zValidator('json', createPostSchema), async (c) => {
  const body = c.req.valid('json');
  const user = c.get('user');
  const post = await createPostService.execute({ ...body, userId: user.sub });
  return c.json(post, 201);
});

postsRouter.delete('/:id', jwtAuthMiddleware, async (c) => {
  const id = c.req.param('id');
  await deletePostService.execute(id);
  return c.body(null, 204);
});
```

---

## 7. Registrar a rota (`src/infra/http/routes/index.ts`)

```ts
import { postsRouter } from '@/modules/posts/routes/posts.routes';

export const registerRoutes = (app: Hono) => {
  app.route('/posts', postsRouter);
};
```
