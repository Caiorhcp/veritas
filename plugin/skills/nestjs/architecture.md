# Arquitetura NestJS

## 1. Pontos de entrada

Nunca esqueça dos arquivos raiz fundamentais (ex: app.module.ts, app.controller.ts, app.service.ts).

## 2. Integração de módulos

O módulo principal (AppModule) DEVE ser planejado para importar TODOS os módulos de funcionalidades (AuthModule, UserModule, etc) para que a API não fique órfã.

## 3. Testes

Sempre planeje arquivos de testes automatizados (.spec.ts, unitários) adequados para os controllers e services gerados.

## 4. Dependências

Planeje e liste TODAS as dependências no array 'dependencies_to_install', incluindo tipagens (ex: bcrypt, @types/bcrypt, uuid, @types/uuid, passport-jwt).

## 5. DTOs

Se planejar Controllers e Services, planeje os respectivos DTOs separados (ex: login.dto.ts) e assegure-se de criá-los.
