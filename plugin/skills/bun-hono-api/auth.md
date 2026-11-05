# Auth — JWT Bearer + Refresh Token (stateless)

## Fluxo geral

```
Login
  → API valida credenciais
  → Gera access token (JWT, 15 min) + refresh token (JWT, 7 dias)
  → Retorna: { accessToken } no body + refreshToken em cookie httpOnly

Request autenticado
  → Client envia: Authorization: Bearer <accessToken>
  → Middleware JWT valida o token e injeta payload no contexto (c.get('user'))

Refresh
  → Client envia: refreshToken no body OU cookie
  → API verifica o JWT do refresh token (assinatura + expiração)
  → Gera novo par de tokens
  → Retorna: { accessToken } + novo refreshToken em cookie httpOnly

Logout
  → Client descarta os dois tokens
  → Sem operação no banco — os tokens expiram naturalmente
```

O refresh token é um JWT — não é armazenado no banco. Toda validação é feita por assinatura criptográfica.

---

## Access Token

- Tipo: JWT assinado com `JWT_SECRET`
- Expiração: 15 minutos
- Enviado pelo client: header `Authorization: Bearer <token>`
- Payload:

```ts
interface AccessTokenPayload {
  sub: string;   // userId
  type: 'access';
  iat: number;
  exp: number;
}
```

---

## Refresh Token

- Tipo: JWT assinado com `JWT_REFRESH_SECRET` (secret separado do access)
- Expiração: 7 dias
- Enviado pelo client: cookie httpOnly `refreshToken` **ou** campo no body `refreshToken`
- Payload:

```ts
interface RefreshTokenPayload {
  sub: string;   // userId
  type: 'refresh';
  iat: number;
  exp: number;
}
```

O campo `type` diferencia os dois tokens — um access token não pode ser usado como refresh e vice-versa.

---

## JwtService

Toda operação de sign/verify passa pelo `JwtService` em `src/infra/lib/jwt/jwt.service.ts`.

```ts
const jwtService = new JwtService();

// login / refresh
const accessToken  = await jwtService.signAccessToken(userId);
const refreshToken = await jwtService.signRefreshToken(userId);

// middleware de auth
const payload = await jwtService.verifyAccessToken(token);

// refresh endpoint
const payload = await jwtService.verifyRefreshToken(token);
if (payload.type !== 'refresh') throw new UnauthorizedError('Invalid token type');
```

---

## Middleware JWT

O middleware de auth fica em `src/infra/http/middlewares/jwt-auth.middleware.ts` e é importado diretamente nas rotas que precisam de autenticação.

```ts
// Rota protegida — importa o middleware diretamente
import { jwtAuthMiddleware } from '@/infra/http/middlewares/jwt-auth.middleware';

router.get('/', jwtAuthMiddleware, async (c) => {
  const user = c.get('user'); // AccessTokenPayload
  // ...
});

// Rota pública — sem middleware
router.post('/login', zValidator('json', loginSchema), async (c) => {
  // ...
});
```

---

## Registro de rotas auth

Em `src/infra/http/routes/index.ts`, as rotas de auth são registradas sem middleware (login/refresh são públicos):

```ts
import { authRouter } from '@/modules/auth/routes/auth.routes';
import { postsRouter } from '@/modules/posts/routes/posts.routes';

app.route('/auth',  authRouter);
app.route('/posts', postsRouter);
```

---

## Módulo de auth — estrutura esperada

```
src/modules/auth/
├── services/
│   ├── login.service.ts
│   ├── refresh-token.service.ts
│   └── logout.service.ts
├── validators/
│   └── auth.validator.ts
└── routes/
    └── auth.routes.ts
```

Não há repository no módulo de auth — nenhum dado de token é persistido no banco.
