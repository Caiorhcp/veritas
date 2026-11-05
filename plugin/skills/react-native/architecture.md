# React Native — estrutura e arquitetura

Detalhamento das convenções descritas no `SKILL.md`. Carrega sob demanda.

## Estrutura

Siga o padrão do Expo Router (baseado em arquivos) ou agrupe telas em
`src/screens/` caso use React Navigation padrão.

## Isolamento

Siga o padrão ATOMIC DESIGN estritamente na pasta `src/components/`: `atoms`
(botões, inputs, labels, ícones - componentize tudo, inclusive tamanhos),
`molecules`, `organisms`, `templates`. Separe regras de negócio em `src/hooks/`
ou `src/services/`. Esta estrutura age como uma grande biblioteca de Cloud
Design.

## Assets

Arquivos estáticos (fontes, imagens) devem ficar centralizados na pasta
`assets/`.
