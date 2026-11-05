---
name: vite
description: Use ao criar ou revisar código em projetos React + Vite + TypeScript com Tailwind — telas em `src/pages/`, rotas em `src/routes/AppRoutes.tsx`, stores Zustand, services com Axios + TanStack Query, forms React Hook Form + Zod, alias `@/`, `vite.config.ts`, `npm run dev`.
metadata:
  escopo: frontend
  stacks: [vite, react]
  upstream:
    - url: https://vite.dev/guide/
      pacote: vite
      registry: npm
  versao_verificada: "8.0.1"
---

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

## Filosofia

**FOCO DO MVP:** preparar um boilerplate FUNCIONAL, não apenas pastas vazias. Roteamento, estado global, cliente HTTP e formulário de exemplo devem estar operantes e navegáveis no primeiro `npm run dev`.

**ESTRUTURA:** React com Functional Components e Hooks. Separe lógica em hooks customizados.

## Tecnologias

**TECNOLOGIAS/LIBS:**

- Rotas: react-router-dom.
- UI: Tailwind CSS.
- Estado Global: Zustand.
- Dados/API: Axios + TanStack Query.
- Forms: React Hook Form + Zod.
- Ícones: lucide-react.
- Imports: sempre via alias `@/`.

## Proibições (violação = erro)

1. **BOILERPLATE FUNCIONAL:** os arquivos gerados devem compilar e rodar sem erro assim que o agente de features começar a trabalhar. Nada de imports para libs não instaladas.
2. **GERÊNCIA DE ESTADO:** Zustand APENAS para estado global (`src/store/`). Estado local usa exclusivamente hooks nativos (`useState`, `useReducer`).
3. **CHAMADAS DE API:** use o cliente `@/api/client`. Toda chamada nova vira uma função em `src/services/`, tipada em `src/types/`, consumida via hook do TanStack Query.
4. **COMPONENTES:** Functional Components limpos, sem lógica de fetch dentro de `components/ui`.
5. **ESTILIZAÇÃO:** Tailwind via `className`, design moderno mesmo em componentes mockados.
6. **TIPAGEM:** forte, com interfaces/types em `src/types/`. Nunca `any`.
7. **NAVEGAÇÃO:** toda tela nova entra em `src/pages/` e ganha uma rota em `src/routes/AppRoutes.tsx`.

## Imports proibidos

- `styled-components`
- `@emotion/react`
- `@emotion/styled`
- `redux`
- `@reduxjs/toolkit`
- `react-redux`
- `mobx`
- `mobx-react`

## Arquivos protegidos

- `vite.config.ts`
- `tsconfig.app.json`
- `src/index.css`
- `src/api/client.ts`
- `src/context/ConfigContext.tsx`

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

Portada do `scaffold/stacks/vite.py` do Veritas v1, onde vivia como string dentro do Python.
