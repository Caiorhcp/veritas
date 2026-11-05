# Arquitetura

1. **OBJETIVO DA GERAÇÃO:** crie um esqueleto NAVEGÁVEL — rotas funcionando, layout base renderizando, um exemplo de chamada de API e um exemplo de estado global já ligados. Não implemente regras de negócio específicas do usuário.
2. **DOCUMENTAÇÃO:** sempre gere/atualize README.md e respeite o CLAUDE.md já presente no projeto.
3. **ESTRUTURA (obrigatória, não crie alternativas):** Siga o padrão ATOMIC DESIGN estritamente. Use as pastas `src/components/atoms` (botões, inputs, labels, ícones - componentize tudo, inclusive tamanhos de botão), `src/components/molecules` (grupos de atoms), `src/components/organisms` (seções complexas), `src/components/templates` (layouts de página), `src/pages` (telas), `src/routes`, `src/context`, `src/hooks`, `src/services`, `src/store`, `src/types`. Esta estrutura age como uma grande biblioteca de Cloud Design.
4. **ROTEAMENTO:** centralize toda definição de rotas em `src/routes/AppRoutes.tsx`, importado uma única vez em `main.tsx`.
5. **ARQUIVOS:** sempre `.tsx` para arquivos que retornam JSX, `.ts` para lógica pura.
6. **IMPORTS:** sempre use o alias `@/` (já configurado em vite.config.ts e tsconfig.app.json). Nunca use caminhos relativos do tipo `../../../`.
