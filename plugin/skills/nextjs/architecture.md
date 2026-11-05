# Arquitetura

1. ESTRUTURA: Siga o padrão App Router (`src/app/`). Separe claramente `components/`, `lib/`, e `hooks/` fora da pasta `app/` para não poluir o roteamento. Na pasta `components/`, siga o padrão ATOMIC DESIGN estritamente: `atoms` (botões, inputs, labels, ícones - componentize tudo, inclusive tamanhos), `molecules`, `organisms`, `templates`. Esta estrutura age como uma grande biblioteca de Cloud Design.
2. PONTOS DE ENTRADA: Garanta que os arquivos obrigatórios do Next.js existam (ex: `layout.tsx`, `page.tsx`).
3. ROTEAMENTO API: Se criar endpoints de API, use a pasta `src/app/api/` (Route Handlers).
4. DEPENDÊNCIAS: Inclua dependências comuns do ecossistema React/Next (ex: `lucide-react` para ícones, `clsx`, `tailwind-merge`).
