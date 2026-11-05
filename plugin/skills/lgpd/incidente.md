# Suspeita de incidente com dado pessoal

Parte da `lgpd`. Vale quando você encontra dado pessoal exposto ou em risco:
endpoint ou exportação sem login, dado em log, arquivo ou bucket público,
credencial no repositório, backup acessível, permissão que mostra o dado de
outra pessoa.

**Regra da casa: você não manda nada para ninguém.** Nem aviso, nem registro,
nem comunicação, nem correção por conta própria. Você para, diz à pessoa que
ela precisa procurar o responsável pelo projeto, e barra o PR. Confirmar,
conter e comunicar é com o responsável e com o controlador (o cliente).

## 1. Pare de mexer no dado

Confirme só o mínimo para ter certeza de que o problema existe: a rota
responde sem login, o campo aparece no log. **Não** baixe a exportação, não
liste registros, não copie exemplos. Cada leitura a mais é mais dado exposto,
agora na sua sessão.

## 2. Não divulgue

A descrição do problema é, ela mesma, um mapa de como explorar. Nada em
comentário de card, canal, issue, commit ou descrição de PR. Nenhum dado real
em lugar nenhum, nem como exemplo.

## 3. Diga à pessoa: procure o responsável

Na mesma resposta em que encontrou, sem esperar terminar a tarefa:

```
Parei: encontrei uma possível exposição de dado pessoal em <área, sem detalhe
de como explorar>. Não vou abrir o PR nem mexer nisso. Procure o responsável
pelo projeto, hoje: o cliente tem 3 dias úteis para comunicar a ANPD a partir
de quando fica sabendo, e cada hora de atraso sai desse prazo.
```

O detalhe (onde está, o que você viu, desde quando parece existir) vai só
para a pessoa com quem você está falando, nesta conversa. Ela decide o que
repassar.

**Sem ninguém no chat** (`/veritas:executar-tasks`, tarefa agendada): no card,
só `Bloqueado por questão de segurança. Falar com o responsável pelo
projeto.` O detalhe vai no relatório da execução, que só a pessoa lê.

## 4. Barre o PR

- **O PR da tarefa atual não abre.** Se já estava aberto, não empurre mais
  commit nele e diga que está barrado até o responsável liberar.
- **A correção não é sua sem ordem.** Fechar a rota, revogar o token, tirar o
  arquivo do ar mexem em produção e em evidência. Quando o responsável pedir,
  aí sim: siga a `lgpd` ("Acesso", "Log"), e a descrição do PR fica genérica
  ("exige login na exportação de inadimplência"), sem o caminho de exploração.
- **Não apague** log, arquivo ou histórico: a apuração precisa deles.

## O que vale saber, para responder se perguntarem

- **Credencial no repositório está vazada**, mesmo em repositório privado e
  mesmo que o commit seguinte a remova: o histórico guarda. O que resolve é o
  dono revogar e gerar outra.
- **Log que já gravou dado pessoal** continua lá depois que o código for
  corrigido. Limpar é decisão do controlador.
- **O controlador guarda todo incidente por 5 anos**, comunicado ou não
  (Res. CD/ANPD 15/2024, art. 10). Se o responsável pedir ajuda para montar
  esse registro, os itens estão na resolução: data do conhecimento, o que
  aconteceu, natureza e categoria dos dados, quantos titulares, risco,
  medidas tomadas. Nunca com dado pessoal no texto.
