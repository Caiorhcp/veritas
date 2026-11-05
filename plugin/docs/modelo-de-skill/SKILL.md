---
name: modelo
description: Modelo para criar uma skill nova. Copie este diretório para skills/, renomeie e substitua o conteúdo. Não é uma convenção real e não deve disparar em nenhuma tarefa.
metadata:
  escopo: backend
  stacks: [exemplo]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Nome da stack — convenções da casa

> Este arquivo mora em `docs/`, fora de `skills/`, de propósito: dentro de
> `skills/` ele seria instalado como skill de verdade e custaria contexto em
> toda sessão do time, para nada. O CI valida ele aqui mesmo assim, para o
> modelo não apodrecer.

## Filosofia

Uma ou duas frases sobre o que orienta as decisões nesta stack.

## Tecnologias

- **Responsabilidade**: lib que a casa adotou, e por quê se não for óbvio.

## Proibições (violação = erro)

- **O que não fazer.** Por que, e o que fazer no lugar.

Escreva aqui o que se consulta o tempo todo. Uma vez carregado, este arquivo
fica em contexto até o fim da sessão — cada linha é custo recorrente. O
detalhamento vai para arquivos de apoio.

## Recursos adicionais

- Estrutura e arquitetura: [architecture.md](architecture.md)

## Origem

De onde veio esta convenção: doc oficial, incidente, decisão de arquitetura ou
prática já consolidada no time.
