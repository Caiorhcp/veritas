# App

React + Vite + TypeScript + Tailwind, criado com `create-veritas`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build
```

- Rotas: `src/routes/AppRoutes.tsx` (react-router-dom)
- Estado global: `src/store/` (Zustand)
- API: `src/api/client.ts` (Axios) → `src/services/` → hooks do TanStack Query em `src/hooks/`
- Formulário: React Hook Form + Zod (`src/components/organisms/ContactForm.tsx`)
- Componentes: Atomic Design em `src/components/`
- Imports com o alias `@/`

A URL da API vem de `VITE_API_URL` (veja `.env.example`).

As convenções do projeto estão em `.veritas/`. Comece por `.veritas/INDEX.md`.
