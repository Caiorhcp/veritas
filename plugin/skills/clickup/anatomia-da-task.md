# Anatomia de uma task

Cinco seções, nesta ordem. Um card sem "Critérios de aceite" não está pronto
para começar, qualquer que seja o status.

```markdown
## História de usuário

Como <papel>
Gostaria de <ação>
Para que <benefício concreto>

## Objetivo

O que se quer alcançar, em prosa. Depois, o que já se sabe do código:

Pontos levantados na leitura do código:

*   `caminho/arquivo.py:763` — o que está errado ali, em uma frase
*   `caminho/outro.py:2443` — idem

Fluxo: `urls.py:106` → `View` (`views.py:2377`) → `service` (`services.py:763`)

**Suposições assumidas** (por não terem sido especificadas):

1. ...
2. ...

## Critérios de aceite

1. ✅ **Nome curto do critério**: o que precisa ser verdade para ele estar
   atendido, de forma verificável.
2. ✅ **Sem regressão**: o que não pode quebrar, e o comando que prova.
3. ✅ **Cobertura de teste**: o que os testes novos precisam cobrir.

## Subtarefas (sugestão)

- [ ] passo
- [ ] passo

## Etiquetas

🔖 s1, backend, financeiro, mais-saude
```

---

## O que faz um card bom aqui

**Caminho e linha, não descrição vaga.** `services.py:763 — total_payments_active
devolve o queryset sem o filtro de status` vale mais que "o cálculo está errado".

**Suposição declarada é suposição visível.** O que não foi especificado vira
item numerado em "Suposições assumidas", não vira decisão silenciosa no meio
do código.

**Critério de aceite é verificável.** "Funcionar corretamente" não é critério.
"Parcela pendente, vencida, cancelada ou estornada não entra em nenhuma das
colunas" é.

**Critério em negrito, com nome.** O nome é o que se cita no relatório de
fechamento — sem ele, cada relatório reescreve o critério com outras palavras
e ninguém consegue comparar.

**O que fica de fora fica escrito.** "Incluir dependentes é decisão de negócio
a confirmar com a gestão, não entra nesta correção" — escopo recusado é parte
do escopo.

---

## Revisar um card existente

Procure, nesta ordem:

1. Tem critérios de aceite? Se não, o resto não importa ainda.
2. Cada critério é verificável, ou algum é opinião?
3. Alguma decisão foi tomada no texto sem estar em "Suposições assumidas"?
4. Os caminhos citados ainda existem no código?
5. O que está fora do escopo está dito, ou está só ausente?

Traga o que encontrou. Não reescreva o card sem confirmação — quem escreveu
pode ter contexto que não está ali.
