# Skill — Gerar Docs + Bruno Collection

Use esta skill quando o dev solicitar geração de documentação para um módulo.

**Trigger:** dev envia o conteúdo do arquivo de rotas e pede para gerar docs.

---

## O que gerar

A partir de um arquivo de rotas, gere **simultaneamente**:

1. `docs/resources/<module>.md` — documentação para o front-end
2. `docs/bruno/<module>/<verb>-<entity>.bru` — um arquivo `.bru` por endpoint

Se a coleção Bruno ainda não existir no projeto, gere também:

3. `docs/bruno/bruno.json` — manifest da coleção
4. `docs/bruno/environments/` — arquivos de ambiente (Development, Production)

---

## Estrutura da coleção Bruno

```
docs/bruno/
├── bruno.json
├── environments/
│   ├── Development.bru
│   └── Production.bru
├── auth/
│   ├── folder.bru
│   └── login.bru
└── <module>/
    ├── folder.bru
    └── <verb>-<entity>.bru
```

---

## `bruno.json` — manifest da coleção

Crie este arquivo na raiz da coleção (`docs/bruno/bruno.json`). Deve existir **uma única vez** no projeto:

```json
{
  "version": "1",
  "name": "Minha API",
  "type": "collection",
  "ignore": ["node_modules", ".git"]
}
```

---

## Ambientes (`environments/`)

### `environments/Development.bru`

```
vars {
  baseUrl: http://localhost:3000
  accessToken:
}

vars:secret [
  accessToken
]
```

### `environments/Production.bru`

```
vars {
  baseUrl: https://api.example.com
  accessToken:
}

vars:secret [
  accessToken
]
```

---

## `folder.bru` — metadado de pasta

Cada pasta de recurso precisa de um `folder.bru`:

```
meta {
  name: Users
}
```

---

## 1. Formato do arquivo de documentação (`docs/resources/<module>.md`)

```markdown
# <Module> API

Base path: `/<module>`

---

## <METHOD> /<path>

**Descrição:** Uma linha descrevendo o que faz.

**Auth:** Requerida / Não requerida

### Path params
| Param | Tipo | Descrição |
|---|---|---|
| id | string (uuid) | ID do recurso |

### Query params
| Param | Tipo | Obrigatório | Default | Descrição |
|---|---|---|---|---|
| page | number | não | 1 | Página |
| limit | number | não | 20 | Itens por página |

### Request body
\`\`\`json
{
  "title": "string (min 3, max 255)",
  "content": "string"
}
\`\`\`

### Responses

**201 Created**
\`\`\`json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "userId": "uuid",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
\`\`\`

**422 Unprocessable Entity**
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "title", "message": "..." }]
  }
}
\`\`\`

**401 Unauthorized** *(se rota protegida)*
\`\`\`json
{
  "error": { "code": "UNAUTHORIZED", "message": "Unauthorized" }
}
\`\`\`

---
```

Repita a seção para cada endpoint do módulo.

---

## 2. Formato do arquivo Bruno (`.bru`)

Gere um arquivo `.bru` por endpoint. Seções disponíveis (inclua apenas as que se aplicam):

```
meta {
  name: <Verb> <Entity>
  type: http
  seq: <número sequencial começando em 1>
}

<method> {
  url: {{baseUrl}}/<path>
  body: json        # none | json | text | xml | form-urlencoded
  auth: bearer      # none | bearer | basic
}

auth:bearer {
  token: {{accessToken}}
}

query {
  page: 1
  limit: 10
}

headers {
  Accept: application/json
  Content-Type: application/json
}

body:json {
  {
    "field": "value"
  }
}

script:post-response {
  if (res.body.accessToken) {
    bru.setEnvVar("accessToken", res.body.accessToken);
  }
}

tests {
  test("status 200", function() {
    expect(res.status).to.equal(200);
  });
}

docs {
  Descrição do endpoint.
}
```

### Regras para os arquivos `.bru`

- Rotas com `jwtAuthMiddleware` → `auth: bearer` + bloco `auth:bearer`
- Rotas públicas → `auth: none`, sem bloco `auth:bearer`
- Endpoints sem body → `body: none`, sem bloco `body:json`
- Endpoints sem query params → omitir bloco `query`
- Path params dinâmicos → `{{baseUrl}}/users/{{userId}}`
- Nome do arquivo: `<verb>-<entity>.bru` (ex: `create-post.bru`, `list-posts.bru`)
- Endpoint de login → incluir `script:post-response` que salva o token no ambiente

### Verbos por método HTTP

| HTTP Method | Verbo no nome do arquivo |
|---|---|
| GET (lista) | `list-<entity>` |
| GET (por id) | `get-<entity>` |
| POST | `create-<entity>` |
| PUT/PATCH | `update-<entity>` |
| DELETE | `delete-<entity>` |

---

## Exemplos completos de arquivos `.bru`

### `auth/login.bru`

```
meta {
  name: Login
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/auth/login
  body: json
  auth: none
}

headers {
  Accept: application/json
  Content-Type: application/json
}

body:json {
  {
    "email": "user@example.com",
    "password": "password123"
  }
}

script:post-response {
  if (res.body.accessToken) {
    bru.setEnvVar("accessToken", res.body.accessToken);
  }
}

docs {
  Autentica o usuário e retorna o access token.
  O token é salvo automaticamente na variável de ambiente accessToken.
}
```

### `users/list-users.bru`

```
meta {
  name: List Users
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/users
  body: none
  auth: bearer
}

auth:bearer {
  token: {{accessToken}}
}

query {
  page: 1
  limit: 10
}

headers {
  Accept: application/json
}

docs {
  Retorna lista paginada de usuários.
}
```

### `users/create-user.bru`

```
meta {
  name: Create User
  type: http
  seq: 3
}

post {
  url: {{baseUrl}}/users
  body: json
  auth: bearer
}

auth:bearer {
  token: {{accessToken}}
}

headers {
  Accept: application/json
  Content-Type: application/json
}

body:json {
  {
    "name": "João Silva",
    "email": "joao@example.com"
  }
}

docs {
  Cria um novo usuário.
}
```

### `users/delete-user.bru`

```
meta {
  name: Delete User
  type: http
  seq: 5
}

delete {
  url: {{baseUrl}}/users/{{userId}}
  body: none
  auth: bearer
}

auth:bearer {
  token: {{accessToken}}
}

headers {
  Accept: application/json
}

docs {
  Remove um usuário pelo ID.
}
```

---

## Script de geração (`scripts/generate-bruno.ts`)

Quando o dev pedir para gerar a coleção programaticamente, use este script como base:

```ts
import * as fs from 'fs';
import * as path from 'path';

interface RouteInfo {
  method: string;
  path: string;
  name: string;
  description?: string;
  body?: object;
  queryParams?: { name: string; value: string }[];
  auth?: boolean;
}

interface BrunoOptions {
  collectionName: string;
  outputDir: string;
  baseUrl: string;
  authType?: 'bearer' | 'basic';
}

function generateBrunoCollection(routes: RouteInfo[], options: BrunoOptions): void {
  const { outputDir, collectionName } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // bruno.json
  const manifest = {
    version: '1',
    name: collectionName,
    type: 'collection',
    ignore: ['node_modules', '.git'],
  };
  fs.writeFileSync(path.join(outputDir, 'bruno.json'), JSON.stringify(manifest, null, 2));

  // environments
  generateEnvironments(outputDir);

  // requests grouped by resource
  const grouped = groupRoutesByResource(routes);

  for (const [resource, resourceRoutes] of Object.entries(grouped)) {
    const folderPath = path.join(outputDir, resource);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    fs.writeFileSync(
      path.join(folderPath, 'folder.bru'),
      `meta {\n  name: ${capitalize(resource)}\n}\n`,
    );

    let seq = 1;
    for (const route of resourceRoutes) {
      const fileName = route.name.toLowerCase().replace(/\s+/g, '-');
      fs.writeFileSync(path.join(folderPath, `${fileName}.bru`), generateBruFile(route, seq++, options));
    }
  }
}

function generateBruFile(route: RouteInfo, seq: number, options: BrunoOptions): string {
  const lines: string[] = [];
  const method = route.method.toLowerCase();
  const urlPath = route.path.replace(/:(\w+)/g, '{{$1}}');
  const hasBody = ['post', 'put', 'patch'].includes(method) && route.body;

  lines.push('meta {');
  lines.push(`  name: ${route.name}`);
  lines.push('  type: http');
  lines.push(`  seq: ${seq}`);
  lines.push('}', '');

  lines.push(`${method} {`);
  lines.push(`  url: {{baseUrl}}${urlPath}`);
  lines.push(`  body: ${hasBody ? 'json' : 'none'}`);
  lines.push(`  auth: ${route.auth && options.authType ? options.authType : 'none'}`);
  lines.push('}', '');

  if (route.auth && options.authType === 'bearer') {
    lines.push('auth:bearer {');
    lines.push('  token: {{accessToken}}');
    lines.push('}', '');
  }

  if (route.queryParams?.length) {
    lines.push('query {');
    for (const p of route.queryParams) lines.push(`  ${p.name}: ${p.value}`);
    lines.push('}', '');
  }

  lines.push('headers {');
  lines.push('  Accept: application/json');
  if (hasBody) lines.push('  Content-Type: application/json');
  lines.push('}', '');

  if (hasBody) {
    lines.push('body:json {');
    lines.push(JSON.stringify(route.body, null, 2));
    lines.push('}', '');
  }

  if (route.description) {
    lines.push('docs {');
    lines.push(`  ${route.description}`);
    lines.push('}');
  }

  return lines.join('\n');
}

function generateEnvironments(outputDir: string): void {
  const envsDir = path.join(outputDir, 'environments');
  if (!fs.existsSync(envsDir)) fs.mkdirSync(envsDir, { recursive: true });

  const envs = [
    { name: 'Development', baseUrl: 'http://localhost:3000' },
    { name: 'Production',  baseUrl: 'https://api.example.com' },
  ];

  for (const env of envs) {
    const content = `vars {\n  baseUrl: ${env.baseUrl}\n  accessToken:\n}\n\nvars:secret [\n  accessToken\n]\n`;
    fs.writeFileSync(path.join(envsDir, `${env.name}.bru`), content);
  }
}

function groupRoutesByResource(routes: RouteInfo[]): Record<string, RouteInfo[]> {
  const groups: Record<string, RouteInfo[]> = {};
  for (const route of routes) {
    const resource = route.path.split('/').filter(Boolean)[0] ?? 'api';
    (groups[resource] ??= []).push(route);
  }
  return groups;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

---

## Variáveis de ambiente esperadas

| Variável | Descrição |
|---|---|
| `baseUrl` | URL base da API (ex: `http://localhost:3000`) |
| `accessToken` | JWT de acesso — preenchido pelo script do login |

---

## Exemplo completo — módulo `posts`

### Input (arquivo de rotas fornecido pelo dev)
```ts
postsRouter.get('/', zValidator('query', listPostsQuerySchema), ...);              // público
postsRouter.get('/:id', ...);                                                      // público
postsRouter.post('/', jwtAuthMiddleware, zValidator('json', createPostSchema), ...); // protegido
postsRouter.delete('/:id', jwtAuthMiddleware, ...);                                // protegido
```

### Output esperado

```
docs/bruno/bruno.json                     ← apenas se ainda não existir
docs/bruno/environments/Development.bru   ← apenas se ainda não existir
docs/bruno/environments/Production.bru    ← apenas se ainda não existir
docs/bruno/posts/folder.bru
docs/bruno/posts/list-posts.bru
docs/bruno/posts/get-post.bru
docs/bruno/posts/create-post.bru
docs/bruno/posts/delete-post.bru
docs/resources/posts.md
```

---

## Checklist de entrega

- [ ] `bruno.json` criado na raiz da coleção (se não existir)
- [ ] Ambientes Development e Production (se não existirem)
- [ ] `folder.bru` para cada pasta de recurso
- [ ] Um `.bru` por endpoint com sintaxe correta
- [ ] Path params usando `{{param}}` (ex: `{{userId}}`)
- [ ] Query params no bloco `query` (não em `params:query`)
- [ ] Auth configurada corretamente por rota (bearer ou none)
- [ ] Endpoint de login com `script:post-response` salvando o token
- [ ] Documentação Markdown gerada em `docs/resources/`
