---
name: projeto-existente
description: Decide se as convenções do Veritas valem num repositório que já existe ou se a arquitetura dele manda. Use antes da primeira mudança de código num sistema legado, de cliente ou feito por outra equipe, quando o código diverge das skills de stack, ou numa tarefa de refatorar, migrar ou remodelar para uma versão nova.
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Projeto existente: conservar ou remodelar

As skills de stack do Veritas descrevem como a casa constrói **código novo**.
Muito do trabalho é em sistema que já existe: legado, de cliente, ou feito por
outra equipe, onde a arquitetura é dele e não se muda. Esta skill decide qual
das duas vale **antes da primeira linha alterada**.

## Os dois modos

**Conservar** — o padrão. A arquitetura do projeto manda.

- Siga a estrutura, as camadas, as libs, os nomes e o estilo que já estão lá,
  mesmo quando contradizem uma skill de stack do Veritas.
- Nada novo fora do que já existe: camada, pasta, padrão, dependência,
  ferramenta de lint ou de teste.
- Mexa só no que a tarefa pede. Sem refatorar "de passagem", sem mover
  arquivo, sem renomear o que funciona.
- A tarefa não cabe na arquitetura existente: **pare e pergunte.** Não
  improvise uma estrutura paralela.

**Remodelar** — só quando a tarefa é explicitamente essa: reescrever,
migrar ou montar uma versão nova do sistema. Aí as convenções do Veritas
valem inteiras, e a skill de stack volta a ser a regra.

## Como decidir

1. **O `CLAUDE.md` do projeto declara o modo** (seção "Veritas: modo
   conservar" ou "modo remodelar"): siga, sem perguntar.
2. **A tarefa é de remodelar**, dita com essas palavras no pedido ou no card
   ("migrar para", "reescrever", "nova versão", "remodelar"): modo remodelar.
   Confirme o escopo em uma linha antes de começar: o sistema inteiro ou um
   módulo.
3. **Qualquer outro caso: pergunte**, uma vez, antes da primeira mudança:

   ```
   Este sistema segue uma arquitetura própria que eu devo conservar
   (legado, de cliente, de outra equipe), ou a tarefa é remodelar para
   o padrão do Veritas?
   ```

   Sinais que valem citar na pergunta, se você viu algum: o repositório não é
   da organização do time; o código diverge das skills de stack; a versão
   do framework é antiga; há dois padrões convivendo (`v1/` e `v2/`, por
   exemplo).

**Registre a resposta** no `CLAUDE.md` do projeto, numa seção
"Veritas: modo conservar" ou "Veritas: modo remodelar", com uma linha sobre o
motivo. É o que faz a próxima tarefa cair no passo 1.

**Sem ninguém para responder** (tarefa agendada, `/veritas:executar-tasks`):
assuma **conservar** e diga isso no relatório. Mudar a arquitetura de um
sistema sem ninguém ter pedido é o erro mais caro; conservar à toa custa, no
máximo, uma segunda passada.

## Conservar, na prática

**O vizinho mais parecido é o molde.** Antes de escrever, abra duas ou três
partes do sistema que já fazem algo parecido com a tarefa: uma tela irmã, um
endpoint do mesmo módulo, um teste do mesmo tipo. Copie a forma delas:
pastas, nomes, como tratam erro, como validam, como testam.

**O que continua valendo mesmo conservando.** Nada disto é arquitetura:

- não abrir falha de segurança, não expor segredo, validar o que vem de fora;
- a `veritas:lgpd` inteira no código que você escreve ou altera, e dado exposto
  encontrado é incidente, nunca "observado, fora do escopo";
- não perder dado: migração reversível, nada destrutivo sem confirmação;
- os `principios`: a solução mais simples dentro do que o sistema já usa.

**O que você viu e não mexeu vai no relatório**, numa seção
"Observado, fora do escopo": código morto, padrão inconsistente, dependência
desatualizada, algo que uma remodelação resolveria. Falha de segurança
encontrada vai no topo dessa seção, e você pergunta antes de corrigir.

## Remodelar, na prática

- **Uma parte de cada vez.** Proponha a ordem (módulo por módulo, ou camada
  por camada) e confirme antes de começar. Remodelar tudo num PR só não tem
  revisão possível.
- **O comportamento não muda junto com a estrutura.** Primeiro a remodelação
  com o mesmo comportamento, protegida por teste; depois, em outra mudança,
  o comportamento novo.
- **O que ainda não foi remodelado continua em modo conservar.** Enquanto
  convivem, o código novo segue o Veritas e o antigo segue a arquitetura
  dele.

## Origem

Banco de skills do Veritas, skill `projeto-existente`.
Criada em 2026-09-23: parte do trabalho da casa é em sistema legado ou feito
por outras pessoas, onde a regra é não mudar nem criar nada fora da
arquitetura existente, a não ser que a tarefa seja justamente remodelar.

Correções vão por PR no repositório, não editando a cópia local.
