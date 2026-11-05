# Pattern — Paginação

## Contrato padrão

O tipo de paginação está em `src/modules/shared/models/pagination.ts`:

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

## Validator (query string)

```ts
// src/modules/<feature>/validators/<entity>.validator.ts
import { z } from 'zod';

export const listPostsQuerySchema = z.object({
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
```

## Repository

```ts
import { count, desc } from 'drizzle-orm';
import type { PaginationParams, Pagination } from '@/modules/shared/models/pagination';
import type { Post } from '../models/post.model';

async list({ page, limit }: PaginationParams): Promise<Pagination<Post>> {
  const offset = (page - 1) * limit;

  const [{ total }] = await db
    .select({ total: count() })
    .from(posts);

  const rows = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    count:   Number(total),
    results: rows.map(toPost),
  };
}
```

## Service

```ts
import type { PaginationParams, Pagination } from '@/modules/shared/models/pagination';

export class ListPostsService {
  async execute(params: PaginationParams): Promise<Pagination<Post>> {
    return postRepository.list(params);
  }
}
```

## Route

```ts
router.get('/', zValidator('query', listPostsQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const result = await listPostsService.execute(query);
  return c.json(result);
});
```

## Resposta esperada

```json
{
  "count": 42,
  "results": [
    { "id": "...", "title": "...", "..." }
  ]
}
```
