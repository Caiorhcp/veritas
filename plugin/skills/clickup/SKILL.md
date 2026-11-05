---
name: clickup
description: "Fluxo de trabalho de um time que acompanha o trabalho no ClickUp: pegar uma task pelo card, trabalhar contra os critérios de aceite e fechar com um relatório na própria task. Use quando alguém citar uma task do ClickUp por link, ID ou nome, colar um card no chat, começar ou revisar uma tarefa, escrever critérios de aceite, ou documentar o que foi entregue; e sempre que rodar sem ninguém no chat, numa sessão autônoma aberta para uma task (pasta com TASK.md ou STATE.md)."
metadata:
  escopo: processo
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# ClickUp — como se trabalha aqui

O card é a especificação. Três momentos: começar, trabalhar, fechar.

**Sessão autônoma?** Se você foi iniciado por um orquestrador ou tarefa
agendada, sem ninguém no chat (a pasta costuma ter `TASK.md` ou `STATE.md`),
leia [`sessao-autonoma.md`](sessao-autonoma.md) antes de seguir. Não há ninguém no chat, as ferramentas são outras, e algumas
regras abaixo mudam de forma.

## Antes de tudo: o conector existe?

As ferramentas `clickup_*` **não vêm no plugin**. Elas são o conector do
ClickUp, que cada pessoa liga uma vez no próprio Claude. A skill chega para
todo mundo; o conector, não.

Se `clickup_get_task` não está disponível nesta sessão, **diga isso na primeira
frase e não invente**. Não descreva um card que você não leu, não finja que
postou comentário.

O que ainda funciona sem conector — e é a maior parte:

- A pessoa cola o card no chat. Você trabalha normalmente contra os critérios
  de aceite dele.
- No fim, você **entrega o relatório no chat**, pronto para ela colar como
  comentário. Mesmo formato, mesma exigência de ❌ explícito.
- Escrever e revisar card (`anatomia-da-task.md`) não depende de conector
  nenhum.

Só se perde o ler e o postar automáticos. Diga em uma linha que ligar o
conector do ClickUp no Claude resolve, e siga trabalhando.

## As quatro regras duras

1. **Card que não é dela: ler pode, escrever não.** O conector lê com a conta
   da pessoa, e a conta dela enxerga o workspace inteiro — **ele não filtra por
   responsável**. Quem filtra é você. Antes de trabalhar num card, confira o
   campo `assignees`:

   ```
   clickup_resolve_assignees(["me"])   → o id dela
   ```

   Não é dela? Você pode ler para entender contexto, e só. Não trabalhe, não
   comente, não altere nada — a não ser que ela peça explicitamente naquele
   card. Comentário assinado com a conta dela num card de outra pessoa é ela
   falando sem ter falado.

2. **Status é da pessoa, nunca seu.** Você nunca chama `clickup_update_task`
   para mover status. Termina o trabalho, posta o relatório, e para. Quem move
   o card é quem responde por ele. Exceção única: `/veritas:executar-tasks`
   move para `doing` o card da fila que ele pega (etiqueta `agente`).

3. **Critério de aceite não se inventa.** Se o card não diz o que é "pronto",
   ele ainda não está pronto para começar. Ofereça escrever os critérios e
   espere confirmação — não deduza do título.

4. **O relatório vai na própria task**, como comentário, no fim. Não em
   arquivo solto, não em doc novo, não no chat e pronto.

---

## 1. Começar

Primeiro, ache o card. Três casos, e o terceiro é o que erra:

**Tem ID ou link** (`wdwmbdkj2c`, `app.clickup.com/t/<id>`) — direto:

```
clickup_get_task(task_id, include: ["description"])
```

**Tem só o nome ou o assunto** ("a task do recibo anual") — procure:

```
clickup_search(keywords: "recibo anual", filters: {asset_types: ["task"]})
```

Achou um só, e o nome bate sem dúvida? Siga. Achou vários, ou nenhum bate com
clareza? **Mostre o que achou e pergunte qual.** Nunca escolha da lista
sozinho — trabalhar no card errado custa mais que uma pergunta.

**Não tem nada** — pergunte qual é a task antes de abrir arquivo. Não deduza
pelo branch, pelo diff ou pelo que você acha que está em andamento.

Leia o card inteiro antes de abrir qualquer arquivo. Então:

- **Identifique a stack** pelos caminhos citados na descrição (`crm/`, `src/modules/`,
  `app/`). A skill da stack entra sozinha quando o assunto aparece — se não
  entrou, diga qual convenção está seguindo e por quê.
- **Confira se o card tem "Critérios de aceite".** Se não tem, ele está em
  rascunho de fato, qualquer que seja o status. Veja `anatomia-da-task.md` e
  ofereça escrever — não comece pelo código.
- **Leia as "Suposições assumidas"**, quando houver. São decisões tomadas sem
  confirmação. Se o trabalho depende de uma delas estar certa, pergunte antes.

## 2. Trabalhar

Os critérios de aceite são a sua lista de verificação, um por um. Não são
sugestão e não são resumo do objetivo — são o contrato.

As convenções da casa continuam valendo dentro da task. O card diz **o que**;
a skill da stack diz **como**. Quando os dois se contradizem, é o card que
está errado até alguém dizer o contrário — traga a contradição, não escolha
sozinho.

**Divergência não é violação até você saber o que foi pedido.** Código fora do
padrão pode ser defeito, pode ser exceção aprovada, pode ser o padrão que está
desatualizado. Pergunte antes de classificar.

## 3. Fechar

Formato em `relatorio.md`. Em uma frase: um comentário na task cobrindo cada
critério de aceite, com ❌ explícito no que não foi atendido.

```
clickup_create_task_comment(task_id, comment_text: "<relatório>")
```

Depois disso, pare. Diga que o relatório foi postado e que o status espera a
pessoa. **Não mova o card.**

---

## Os status mudam por lista — leia, não assuma

**Não existe um fluxo de status único num workspace.** Cada lista tem o seu, e
eles nem compartilham idioma. Leia o do card em vez de supor:

```
clickup_get_task(task_id, expand_statuses: true)   → available_statuses
```

Dois fluxos reais, do mesmo workspace, só para você reconhecer que são diferentes de verdade:

| Fluxo | Status |
|---|---|
| longo, em português | `rascunho` → `suporte` → `dev` → `em progresso` → `t1` → `t2` → `t3` → `finalizado` → `produção` |
| curto, em inglês | `draft` → `to do` → `doing` → `ready to test` → `released` |

Usar o fluxo errado faz você ler o estado do trabalho ao contrário. Um card em
`draft` e um em `rascunho` se parecem; um em `released` e um em `produção`
também — mas a lista do meio não bate, e é nela que se decide se o trabalho já
foi validado.

## Tipos de task e etapas de teste

Se o time tem um doc de diretrizes (tipos de task, etapas de teste, regras de
fluxo), **ele é a fonte** e vale para todos os espaços do workspace. O resumo
abaixo é o modelo que o Veritas segue, só para consulta rápida. Na dúvida,
leia o doc do time.

**Tipo** (etiqueta no card) diz o que é a task; **prioridade** diz a
velocidade.

| Etiqueta | Tipo | O que é |
|---|---|---|
| `s1` | Suporte | Travamento do sistema ou inconsistência crítica de dados |
| `s2` | Suporte | Melhoria com alto impacto em gargalo de uso |
| `s3` | Suporte | Melhoria visual ou funcionalidade nova em produto existente |
| `d1` | Dev | Funcionalidade nova de maior urgência |
| `d2` | Dev | Funcionalidade nova ou inovação de menor urgência |
| `d3` | Dev | Ideia não validada, para experimentação |

**Etapas de teste** (os status `t1`, `t2`, `t3`):

| Status | Quem testa | O quê |
|---|---|---|
| `t1` | o dev | verifica a própria entrega |
| `t2` | gestão e usuários | teste controlado, com contas de teste de status distintos |
| `t3` | usuários em produção | uso real, com coleta de feedback |

O que isso muda no seu trabalho:

- **O roteiro de testes é do dev**, escrito em `em progresso`, para a gestão
  entender o que vai validar em `t2`. Entregue o roteiro junto com o relatório.
- **Card em `rascunho` (ou `draft`, no outro fluxo) não foi aprovado pela
  gestão.** Não comece trabalho nele, mesmo que a pessoa seja a responsável:
  diga isso e pare.
- **Deploy não é seu.** É de quem o time designou para isso, depois da
  liberação da gestão e do `t2`.

## Ainda não confirmado

**Não afirme como regra.** Se importar para a decisão, pergunte:

- **Onde as etapas de teste ficam no fluxo curto.** Listas com o fluxo curto
  não têm colunas `t1`/`t2`/`t3`. Não se sabe se `ready to test` cobre `t2` e
  `t3` juntas. Até alguém do time dizer, registre no relatório a etapa de teste
  em que o trabalho está, e não mova o card por conta disso.

---

## Origem

Padrão extraído de cards e docs reais de um workspace do ClickUp em
2026-09-21 — não é convenção declarada, é prática consolidada lida do próprio
ClickUp. As lacunas estão marcadas acima em vez de preenchidas por dedução.
Tipos e etapas de teste vieram do doc de diretrizes do time de dev, lido em
2026-09-23.

`sessao-autonoma.md` cobre a execução sem ninguém no chat, aberta por um
orquestrador externo ou por `/veritas:executar-tasks` agendada.
