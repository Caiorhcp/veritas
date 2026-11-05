---
name: lgpd
description: Proteção de dados pessoais (LGPD) no código e no trabalho do agente. Use ao mexer em código que trata dado pessoal (nome, CPF, e-mail, telefone, endereço, saúde, dado de criança, dado financeiro, senha ou token); ao escrever log, exportação, relatório, CSV, backup ou integração com terceiro; ao criar model ou tabela com dado pessoal; ao encontrar dado exposto, endpoint aberto ou suspeita de vazamento; ou quando pedirem LGPD, anonimização, direitos do titular ou dado de teste.
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - url: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
      registry: interno
  versao_verificada: "1.0"
---

# LGPD — dado pessoal no código e no trabalho do agente

Vale em qualquer stack e em qualquer modo da `veritas:projeto-existente`.
LGPD não é arquitetura: no modo conservar, você não reescreve o sistema, mas
tudo o que **você** escrever ou alterar segue esta skill.

Você não é advogado. Pergunta jurídica ("isso pode?", "vamos ser multados?")
recebe o fato da norma, com o artigo, e a recomendação de consultar o
jurídico. Artigos e prazos em [`referencia.md`](referencia.md).

## Quem decide

Na maior parte dos projetos feitos para cliente, a empresa que desenvolve é **operadora** (art. 5º, VII): trata
o dado em nome do cliente, que é o **controlador**. Finalidade, base legal,
prazo de guarda e comunicação à ANPD são decisões do controlador. Quando a
tarefa precisar de uma delas (coletar campo novo, guardar por mais tempo,
mandar para um terceiro), **pergunte**, e não decida pelo cliente.

## Classifique o dado antes de mexer

| Classe | Exemplos | O que muda |
|---|---|---|
| **Pessoal** (art. 5º, I) | nome, CPF, e-mail, telefone, endereço, IP, id de usuário | as regras de "Sempre" |
| **Sensível** (art. 5º, II) | saúde (exame, consulta, diagnóstico, prescrição), biometria, origem racial, religião, vida sexual, genético | + criptografia e trilha de acesso |
| **Alto risco em incidente** (Res. CD/ANPD 15/2024, art. 5º) | criança, adolescente ou idoso; financeiro; senha, token, sessão; sigilo profissional; grande volume | + menor exposição possível |

Dado de criança ou adolescente (art. 14, e ECA Digital, Lei 15.211/2025):
**pare e pergunte** antes de coletar ou mudar como é tratado.

## Sempre: o dado não sai

Regras do seu comportamento, em qualquer tarefa:

- **Dado real nunca vai para fora do sistema:** prompt de ferramenta externa
  (Firecrawl, busca na web), comentário ou descrição de card, PR, commit,
  issue, relatório, mensagem no chat. Use o identificador interno
  (`cliente_id=4821`) ou um exemplo fictício.
- **Dado de produção não sai de produção.** Nada de dump na máquina, cópia de
  banco para staging, planilha exportada para teste. Se a tarefa pedir, recuse
  e ofereça as alternativas: dado fictício (Faker `pt_BR`, CPF gerado) ou uma
  cópia anonimizada. A anonimização roda **dentro** de produção, antes de a
  cópia sair: o dado real nunca passa pela máquina de ninguém.
- **Você não lê** `.env`, dump, backup ou export com dado real, nem consulta o
  banco de produção. Precisa de um exemplo de formato? Peça um fictício.

## Sempre: no código que você escreve

**Log.** Nunca dado pessoal: nem o campo (`cpf`, `email`, `telefone`), nem o
objeto inteiro, nem o corpo da requisição (`request.data`, `request.POST`,
`req.body`). Logue o identificador interno. Mensagem de erro que sobe para
o Sentry e afins segue a mesma regra.

**URL.** Dado pessoal não vai em query string nem em path
(`?cpf=`, `/clientes/12345678900`): URL fica gravada em log de servidor,
proxy, histórico do navegador e analytics. Busca por CPF ou e-mail é `POST`
com o dado no corpo.

**API responde o mínimo** (art. 6º, III, necessidade). Serializer, DTO e
resposta listam os campos, nunca `fields = "__all__"` nem o model espalhado.
Campo novo no model não aparece na API sem alguém decidir.

**Acesso.** Endpoint, tela, exportação ou relatório com dado pessoal exige
login **e** permissão por papel, e confere se o objeto pertence a quem pede
(sem isso, trocar o id na URL mostra o cliente de outra pessoa). Exportação e
CSV contam como endpoint: são o caminho mais comum de vazamento.

**Coleta.** Só entra campo com finalidade. Campo novo com dado pessoal:
pergunte para que serve e por quanto tempo fica, antes de criar a migration.

**Sensível.** Criptografia em repouso (no campo ou no disco, conforme o
projeto já faz) e trilha de acesso: quem viu, quando, qual registro. Dado
sensível não vira filtro de analytics nem de marketing.

**Terceiros.** Mande a um serviço externo (pagamento, e-mail, push, storage,
LLM, analytics) só o campo que ele precisa. Terceiro novo recebendo dado
pessoal: avise, porque vira suboperador, e se o servidor estiver fora do
Brasil é transferência internacional (art. 33).

**Ferramenta que guarda o que o agente lê.** Memória persistente entre
sessões não é adotada pela casa (claude-mem, ou a memória do Headroom): ela
grava saída de ferramenta, resume com IA e reinjeta, e o caminho padrão manda
isso para fora. O Headroom é padrão porque comprime na máquina; o cache dele
fica local, como as transcrições do próprio Claude Code, e é por isso que dado
de produção não pode chegar à máquina de dev. Detalhes em
`docs/FERRAMENTAS.md`; `/veritas:ambiente` confere.

**Apagar.** Pedido de exclusão do titular não é `DELETE` automático: há dado
que a lei manda guardar (art. 16, fiscal, médico). Pergunte a regra ao
controlador; o padrão é anonimizar o que não precisa ficar.

**Teste e seed.** Sempre dado fictício. Nunca um CPF, e-mail ou telefone de
pessoa real, nem "só para testar".

## Achou algo exposto: é incidente

Endpoint com dado pessoal sem login, dado em log, bucket ou arquivo público,
credencial no repositório, exportação que qualquer um baixa: **pare e siga
[`incidente.md`](incidente.md)**. Em resumo: você não manda nada para
ninguém e não corrige por conta própria. Diz à pessoa que ela precisa
procurar o responsável pelo projeto, e barra o PR.

No modo conservar isso não é "observado, fora do escopo": exposição que está
acontecendo agora não espera a próxima remodelação.

## Checagem automática

Duas travas que rodam no CI do projeto: segredo em commit (gitleaks) e dado
pessoal em log ou URL (regras Semgrep da casa). Configuração pronta e como
instalar em [`automacao.md`](automacao.md). Em modo conservar, é ferramenta
nova no projeto: pergunte antes de acrescentar.

## Fora desta skill

Programa de conformidade (mapa de dados, ROPA, RIPD, política de privacidade,
DPA com operadores, canal de direitos do titular, encarregado): use o
`lgpd-skills` (terceiro, MIT), instalado do original. Veja
`docs/FERRAMENTAS.md` no repositório do Veritas.

## Origem

Banco de skills do Veritas, skill `lgpd`. Criada em
2026-09-23. Artigos lidos no texto compilado da Lei 13.709/2018 no Planalto
(com a redação da Lei 15.352/2026) e na Resolução CD/ANPD nº 15/2024.
Decisão da casa: fora de produção, só dado fictício ou cópia anonimizada
gerada dentro de produção.

Correções vão por PR no repositório, não editando a cópia local.
