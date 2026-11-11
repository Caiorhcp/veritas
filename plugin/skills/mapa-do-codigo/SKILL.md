---
name: mapa-do-codigo
description: Quando usar o grafo do Graphify e quando usar o Ponytail antes de mexer no código. Use antes de uma mudança em projeto grande ou desconhecido, em perguntas de arquitetura, fluxo de dados ou impacto ("o que quebra se eu mexer aqui?"), quando existir graphify-out/ no repositório, e para decidir o tamanho de uma mudança.
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Mapa do código: Graphify e Ponytail no Veritas

O Veritas instala dois plugins de terceiros junto com ele. Cada um tem um papel:

- **Graphify** ([Graphify Labs](https://github.com/Graphify-Labs/graphify), Apache-2.0) mostra **onde** mexer: monta um grafo do código e dos documentos e responde perguntas de estrutura.
- **Ponytail** ([Dietrich Gebert](https://github.com/DietrichGebert/ponytail), MIT) define **quanto** mexer: a menor mudança que resolve.
- As skills do Veritas dizem **como** escrever: stack, camadas e proibições.

O grafo é uma ferramenta, não um pedágio. Ele entra quando economiza leitura; numa tarefa pontual, atrapalha.

## Quando usar o grafo

| Situação | O que fazer |
|---|---|
| Existe `graphify-out/graph.json` e a pergunta é de estrutura (arquitetura, fluxo, dependências, impacto de uma mudança) | Consulte o grafo **primeiro**: `/graphify query "<pergunta>"`. Só depois abra os arquivos que ele apontar. |
| Primeiro contato com um projeto grande ou desconhecido (centenas de arquivos, sistema legado, código de outra equipe) | Monte o grafo **só do código**, que não gasta tokens: `/graphify .`. Antes de incluir documentação, PDFs ou imagens, pergunte à pessoa: essa parte usa o modelo e custa tempo e tokens. |
| Tarefa pontual: "onde está X", corrigir um botão, renomear uma função | Busca normal (grep, leitura do arquivo). Não monte grafo para isso. |
| O grafo existe mas o código mudou muito desde então | `/graphify . --update` (refaz só o que mudou) antes de confiar nas respostas. |

## Regras

- **Não versione o grafo por padrão.** `graphify-out/` vai no `.gitignore`, a não ser que o time decida compartilhá-lo.
- **Grafo desatualizado mente.** Se a resposta do grafo contradiz o código aberto, vale o código; atualize o grafo.
- **O grafo aponta, o código confirma.** Antes de alterar um arquivo, leia o arquivo. Uma aresta marcada como `INFERRED` ou `AMBIGUOUS` é pista, não fato.
- **Para manter atualizado sem lembrar:** o Graphify instala um gancho de commit que refaz o grafo dos arquivos alterados (veja a skill `graphify`, seção de hooks). Ofereça, não instale sem perguntar.

## O tamanho da mudança

Com o lugar encontrado, o Ponytail decide o tamanho: reaproveitar o que o projeto já tem, biblioteca padrão antes de dependência nova, nenhuma abstração que ninguém pediu. Isso não suspende as proibições da skill da stack nem a `lgpd`: o mínimo continua tendo que estar certo.

## Origem

Decisão do Veritas 2.1: Graphify e Ponytail entram como dependências do plugin, com uso guiado por esta skill em vez de rodar antes de toda tarefa, porque montar o grafo em cada pedido pequeno custa mais do que economiza.
