# App

Next.js (App Router) + TypeScript + Tailwind, criado com `create-veritas`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

- Rotas em `src/app/`; Server Components por padrão, `'use client'` só onde há estado ou evento
- Mutação via Server Action: `src/app/actions.ts`, chamada pelo formulário em `src/components/organisms/MessageForm.tsx` (React Hook Form + Zod, validado de novo no servidor)
- Componentes: Atomic Design em `src/components/`; utilitários em `src/lib/`
- Os dados de exemplo ficam em memória (`src/lib/messages.ts`): troque por Prisma ou Drizzle
- shadcn/ui não vem instalado; para usar: `npx shadcn@latest init`

As convenções do projeto estão em `.veritas/`. Comece por `.veritas/INDEX.md`.
