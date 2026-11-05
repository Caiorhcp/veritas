# ClickUp numa sessão autônoma

Parte da skill `clickup`. Vale quando você foi iniciado sem ninguém no chat:
um orquestrador que vigia o ClickUp, abre uma pasta por task e roda o agente,
ou uma tarefa agendada como `/veritas:executar-tasks`.

**Como saber.** O prompt inicial diz que você está rodando uma task, e a pasta
de trabalho costuma ter arquivos do orquestrador (`TASK.md`, `STATE.md`, um
`AGENTS.md` com as instruções dele).

## O que muda

**Não há pessoa do outro lado.** Toda regra da skill que diz "pergunte" vira:
comente a pergunta no card e **pare**, sem escrever código. Quem responde é
alguém lendo o card depois. Seguir adiante com um palpite, sem ninguém para
corrigir, é o pior resultado possível numa sessão autônoma.

**O card pode já vir pronto.** Se ele está num arquivo da pasta (`TASK.md`),
não procure. A seção "1. Começar → ache o card" não se aplica. O resto de
"Começar" vale inteiro.

**As ferramentas podem ser do orquestrador, não do conector.** Se ele expõe as
próprias ferramentas para ler o card, comentar, baixar anexos e ver os status,
use as dele. Use um caminho só: ler pelo conector e comentar pelo orquestrador,
ou o contrário, produz comentário duplicado e estado que ninguém consegue
reconstruir. Repositórios: pelo mecanismo do orquestrador, quando houver, e
não por `git clone` à mão.

## Onde o orquestrador e esta skill divergem

As instruções do orquestrador são o padrão genérico da ferramenta. Esta skill
é a regra da casa. Onde os dois discordam, **vale esta skill**:

1. **Status.** Mesmo que o orquestrador permita mover o card, a regra 2
   continua: não mova. Quem tira o card do status de gatilho é o próprio
   orquestrador, pela configuração dele, ou a pessoa.

2. **Comentários.** Comentários curtos ao começar, em decisões, bloqueios e PR
   podem seguir: servem a quem acompanha o card. O **último** comentário é o
   relatório no formato de `relatorio.md`, com ✗ explícito no que não foi
   atendido. Ele substitui qualquer resumo final que o orquestrador peça. Se o
   orquestrador já posta sozinho que a task começou, seu primeiro comentário
   não precisa anunciar isso.

3. **Card que não é seu.** Não há "me" para resolver: a conta é a do token do
   orquestrador, e quem filtra os cards é a configuração dele (o responsável
   pelos cards). A regra 1 passa a ser responsabilidade de quem configurou o
   orquestrador.

## O que não muda

- Critério de aceite não se inventa (regra 3). Card sem critério: comente
  oferecendo os critérios que você escreveria, e pare.
- Os critérios de aceite são o contrato, um por um.
- As skills de stack continuam dizendo **como**; o card diz **o quê**.
- `STATE.md` é para retomar a sessão. O relatório vai no card, não lá.
