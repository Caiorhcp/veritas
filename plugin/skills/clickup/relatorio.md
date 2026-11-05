# Relatório de fechamento

Vai como comentário na própria task, quando o trabalho termina. É o que a
pessoa lê para decidir se move o status — e ela vai decidir com base nele, não
no código.

## A regra que vale mais que o formato

**Critério não atendido vira ❌ escrito, nunca omissão.** Um relatório que só
lista o que deu certo é pior que nenhum: ele faz a falha parecer ausência de
assunto. Todo critério do card aparece, com o resultado que teve.

Segunda regra: **não aumente o escopo em silêncio.** Se você mexeu em algo que
o card não pedia, isso vai em "Fora do escopo do card", com o motivo.

Terceira, e sem exceção: **nenhum dado pessoal real no relatório.** O card é
lido por muita gente. Cliente é `cliente_id=4821`, nunca nome, CPF ou
telefone; exemplo de teste é fictício (`veritas:lgpd`).

---

## Formato

```markdown
## <Título da task>

**O que mudou.** Dois ou três parágrafos em português de gente, não em nome de
função. Quem lê pode não ser quem programa.

**Causa raiz.** O que estava errado de verdade, não o sintoma que o card
descreveu. Se a correção foi no lugar onde todos os chamadores passam, diga —
é a diferença entre consertar uma vez e consertar um caso.

### Critérios de aceite

| # | Critério | Resultado |
|---|---|---|
| 1 | Somente pago entra na conta | ✅ `services.py:782` filtra por `GET_PAIDS_PLOTS_STATUS()` |
| 2 | Recorte anual comprovado | ✅ teste `test_recibo_virada_de_ano` |
| 7 | Permissão e URL direta | ❌ não feito — ver Pendências |

### Arquivos

- `crm/customers/services.py:763-799` — filtro de status no queryset `general`
- `crm/customers/views.py:2424` — PDF recalcula a partir de `(cliente, ano)`

### Como testar

Passo a passo que alguém que não escreveu o código consegue seguir.

```bash
docker compose exec web uv run manage.py test crm.customers
```

### Pendências

O que ficou de fora e **por quê**. Sem isto o relatório vira promessa.

### Fora do escopo do card

O que foi mexido além do pedido, e o motivo.

### Observado, fora do escopo

O que você viu e **não** mexeu: código morto, padrão inconsistente, algo que
uma remodelação resolveria. Falha de segurança vai no topo. Em sistema legado
(modo conservar da `veritas:projeto-existente`), é aqui que a melhoria que
você faria vira registro, em vez de mudança.

**Modo:** conservar ou remodelar, e se foi declarado ou assumido.

**PR:** <link>
```

---

## Ajustes por tamanho

**Task pequena** (uma correção, um critério): corte a tabela e escreva em prosa.
O que não se corta nunca: causa raiz, como testar, e o ❌ do que não foi feito.

**Task grande, ou que vira referência** (uma migração, uma integração inteira):
o comentário continua sendo obrigatório, e além dele cabe uma página no doc de
registro do projeto — o padrão é `<Projeto> — Registro de correções`, uma
seção por sintoma:

```markdown
## <O sintoma, como a pessoa de negócio descreveria>

**Problema.** ...

**Correção.** ...

## ⚠️ Pendência que bloqueia a estreia
```

Página em doc só quando a pessoa pedir. O comentário é o padrão.

---

## Depois de postar

Diga em uma linha que o relatório foi postado e que o status espera a pessoa.
**Não mova o card.** Não ofereça mover.
