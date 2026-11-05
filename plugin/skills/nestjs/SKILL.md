---
name: nestjs
description: "Use ao criar, editar ou depurar um backend NestJS com TypeScript: app.module.ts, modules, controllers, services, DTOs com class-validator, guards e JwtStrategy (@nestjs/passport, @nestjs/jwt), @nestjs/config, @nestjs/swagger, TypeORM ou Prisma, testes .spec.ts, `nest new`."
metadata:
  escopo: backend
  stacks: [nestjs, typescript]
  upstream:
    - url: https://docs.nestjs.com/
      pacote: "@nestjs/core"
      registry: npm
  versao_verificada: "11"
---

# NestJS

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

## Filosofia

ESTRUTURA: Use TypeScript e Decorators rigorosamente. Isole features em Modules. Prefira Injeção de Dependência.

## Tecnologias

TECNOLOGIAS/LIBS:

- ORM: Integre TypeORM ou Prisma para banco de dados.
- Validação: Use class-validator e class-transformer para DTOs.
- Segurança: Proteja rotas com @nestjs/passport e @nestjs/jwt.
- Utilitários: Use @nestjs/config para .env e @nestjs/swagger para documentar.

## Proibições (violação = erro)

### 1. Tipagem TS no NestJS (obrigatório)

- Tipe os parâmetros de métodos de Guards (ex: `handleRequest(err: any, user: any, info: any)`).
- **NUNCA** use interfaces TypeScript como valores em decorators (ex: `@ApiResponse({ type: User })` -> Remova o 'type: User' se User for interface).
- Use 'import type { Interface }' para evitar erros de decorators quando isolateModules estiver ativo.
- Crie as propriedades DTO declaradas exatamente como os services precisam (ex: `email`, `password` não podem faltar no RegisterDto).

### 2. JWT e configuração

- O tipo de `signOptions.expiresIn` causa conflito. Use cast: `expiresIn: (config.get('JWT_EXPIRES_IN') || '7d') as any`.
- Em Passport JwtStrategy, `secretOrKey` não aceita undefined. Faça fallback seguro: `secretOrKey: config.get('JWT_SECRET') || 'default_secret'`.

### 3. Imports

- Não esqueça de importar os DTOs nos controllers e services correspondentes.

## Recursos adicionais

- Estrutura e arquitetura: [architecture.md](architecture.md)

## Origem

Portada do `scaffold/stacks/nestjs.py` do Veritas v1, onde vivia como string dentro do Python.
