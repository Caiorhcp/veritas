---
name: nextjs
description: Use ao criar ou editar um projeto Next.js com App Router — Server Components e 'use client', Server Actions, rotas em src/app/, Route Handlers em src/app/api/, layout.tsx e page.tsx, Tailwind CSS e shadcn/ui, React Hook Form com Zod, SWR ou TanStack Query, Prisma ou Drizzle, create-next-app.
metadata:
  escopo: frontend
  stacks: [nextjs, react]
  upstream:
    - url: https://nextjs.org/docs
      pacote: next
      registry: npm
  versao_verificada: "16.2.4"
---

# nextjs

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

## Filosofia

App Router (Next.js 14+). Crie Server Components por padrão. Use 'use client' APENAS onde hooks ou interatividade são necessários. Use Server Actions para mutações.

## Tecnologias

- UI: Estilização com Tailwind CSS e shadcn/ui.
- Forms: React Hook Form + Zod para validação.
- Dados: SWR ou TanStack Query (React Query) no client-side.
- DB (se fullstack): Prisma ou Drizzle ORM.

## Proibições (violação = erro)

1. SERVER vs CLIENT COMPONENTS: Crie Server Components por padrão. Adicione `'use client'` apenas na primeira linha de arquivos que usam estado (`useState`), ciclo de vida (`useEffect`), ou eventos de DOM (`onClick`).
2. MUTAÇÃO DE DADOS: Use Server Actions (`'use server'`) para mutações em vez de criar APIs manuais para tudo.
3. ESTILIZAÇÃO: Utilize Tailwind CSS nativamente via propriedade `className`.
4. TIPAGEM: Tipagem forte usando interfaces ou types. Não use `any`.

## Imports proibidos

- `styled-components`
- `@emotion/react`
- `@emotion/styled`
- `redux`
- `@reduxjs/toolkit`
- `react-redux`

## Arquivos protegidos

- `next.config.ts`
- `next.config.mjs`
- `tailwind.config.ts`
- `src/app/layout.tsx`

## Skills de fora

Se estiverem instaladas, carregue sem esperar pedido:

- Componente, data fetching ou performance → `vercel-react-best-practices`
- Prop booleana demais, componente reutilizável → `vercel-composition-patterns`
- Animação entre rotas ou estados → `vercel-react-view-transitions`
- Página pública (landing, site, portfolio) → `design-taste-frontend`
- Revisar UI ou acessibilidade → `web-design-guidelines`

Elas decidem visual e tática; stack, libs e pastas são desta skill. **Em
conflito, esta vence.** O que nunca entra sozinho:
[skills-de-fora.md](../atomic-design/skills-de-fora.md).

## Recursos adicionais

- Estrutura e arquitetura: [architecture.md](architecture.md)

## Origem

Portada do `scaffold/stacks/nextjs.py` do Veritas v1, onde vivia como string dentro do Python.
