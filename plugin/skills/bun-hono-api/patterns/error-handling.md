# Pattern — Error Handling

## Typed errors disponíveis

Todos os erros estão em `src/modules/shared/errors`. Importe sempre pelo index:

```ts
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
} from '@/modules/shared/errors';
```

| Classe | HTTP Status | Quando usar |
|---|---|---|
| `NotFoundError` | 404 | Recurso não encontrado |
| `ConflictError` | 409 | Violação de unicidade, estado conflitante |
| `UnauthorizedError` | 401 | Não autenticado |
| `ForbiddenError` | 403 | Autenticado mas sem permissão |
| `BadRequestError` | 400 | Input inválido que passou pelo Zod mas falhou na regra de negócio |

## Criando um novo typed error

Se precisar de um erro novo, crie em `src/modules/shared/errors/` e exporte no `index.ts`:

```ts
// src/modules/shared/errors/payment-required.error.ts
import { AppError, AppErrorCode } from './app-error';

export class PaymentRequiredError extends AppError {
  constructor(message: string) {
    super(message, AppErrorCode.FORBIDDEN, 402);
  }
}
```

## Onde lançar erros

Apenas nos **Services**. Nunca em repositories ou routes.

```ts
// ✅ correto — erro lançado no service
export class GetPostService {
  async execute(id: string): Promise<Post> {
    const post = await postRepository.findById(id);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  }
}
```

## O que acontece com o erro

O global error handler em `src/infra/http/middlewares/error-handler.middleware.ts` captura tudo e responde:

```json
// AppError
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}

// ZodError (validação HTTP — 422)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "String must contain at least 3 character(s)" }
    ]
  }
}
```

Controllers **nunca** escrevem respostas de erro manualmente.
