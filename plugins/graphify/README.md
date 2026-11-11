# Graphify, empacotado pelo Veritas

Este plugin é a skill oficial do [Graphify](https://github.com/Graphify-Labs/graphify), da Graphify Labs, sob a licença Apache-2.0 (veja `LICENSE` e `NOTICE`). O Graphify não publica um plugin para o Claude Code; o Veritas copia a skill de uma versão marcada do repositório oficial, **sem alterações**, para que ela seja instalada junto com o Veritas.

- Versão empacotada: veja `version` em `.claude-plugin/plugin.json`.
- Para atualizar: `node tools/sync-graphify.mjs <tag>` na raiz do repositório do Veritas (ex.: `v0.9.106`).
- Na primeira execução, a skill instala o pacote Python `graphifyy` (com `uv` ou `pip`).

Todo o crédito pelo Graphify é da Graphify Labs. Problemas com o Graphify em si: https://github.com/Graphify-Labs/graphify/issues
