# Pattern — Testes com Bun Test

Testes são gerados **sob demanda** quando o dev solicitar. Use sempre `bun test` nativo — sem Jest, sem Vitest.

---

## Estrutura de pastas

```
tests/
└── <feature>/
    ├── <verb>-<entity>.service.test.ts   # unit
    └── <feature>.integration.test.ts    # integration
```

---

## Testes unitários (Services)

Testam o service de forma isolada com repositório mockado. Sem banco real.

```ts
// tests/posts/create-post.service.test.ts
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { CreatePostService } from '@/modules/posts/services/create-post.service';
import { ConflictError } from '@/modules/shared/errors';

// Mock do repository
const mockPostRepository = {
  findByTitle: mock(() => Promise.resolve(null)),
  create:      mock(() => Promise.resolve({
    id:        '01900000-0000-7000-0000-000000000001',
    title:     'My Post',
    content:   'Content here',
    userId:    '01900000-0000-7000-0000-000000000002',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
};

// Injeta mock substituindo o módulo
mock.module('@/modules/posts/repositories/post.repository', () => ({
  PostRepository: mock(() => mockPostRepository),
}));

describe('CreatePostService', () => {
  beforeEach(() => {
    mockPostRepository.findByTitle.mockClear();
    mockPostRepository.create.mockClear();
  });

  it('should create a post successfully', async () => {
    const service = new CreatePostService();
    const result = await service.execute({
      title:  'My Post',
      content: 'Content here',
      userId: '01900000-0000-7000-0000-000000000002',
    });

    expect(result.title).toBe('My Post');
    expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictError if title already exists', async () => {
    mockPostRepository.findByTitle.mockResolvedValueOnce({ id: 'existing' });

    const service = new CreatePostService();
    expect(
      service.execute({ title: 'My Post', content: 'Content', userId: 'user-id' })
    ).rejects.toThrow(ConflictError);
  });
});
```

---

## Testes de integração

Testam o fluxo real com banco de dados. Requerem um banco de teste isolado.

```ts
// tests/posts/posts.integration.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'bun:test';
import { app } from '@/infra/http/app';
import { db } from '@/infra/database/drizzle';
import { posts } from '@/infra/database/drizzle/schema/posts';

beforeAll(async () => {
  // Garante que migrações foram aplicadas no banco de teste
});

afterEach(async () => {
  // Limpa dados entre testes
  await db.delete(posts);
});

afterAll(async () => {
  // Fecha conexão
});

describe('POST /posts', () => {
  it('should create a post and return 201', async () => {
    const response = await app.request('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <valid-test-token>',
      },
      body: JSON.stringify({ title: 'Integration Post', content: 'Content' }),
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.title).toBe('Integration Post');
  });

  it('should return 422 when title is missing', async () => {
    const response = await app.request('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'No title' }),
    });

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

---

## Rodando os testes

```bash
bun test                          # todos os testes
bun test tests/posts              # testes de um módulo
bun test --watch                  # watch mode
bun test tests/posts/create-post.service.test.ts  # arquivo específico
```

---

## Variáveis de ambiente para testes

Use um `.env.test` separado com um banco de dados diferente do de desenvolvimento:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb_test
NODE_ENV=test
```
