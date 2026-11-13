---
name: ajuda
description: Menu do Veritas — o que existe no banco, como instalar e atualizar, como enviar uma skill nova, como reportar uma que falhou. Só roda quando a pessoa chama.
disable-model-invocation: true
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Veritas — menu

Instruções para você, o agente. A pessoa chamou `/veritas:ajuda`.

Se ela não disse o que quer, imprima o menu abaixo **exatamente como está** e
pare. Não explique o Veritas antes, não ofereça resumo, não pergunte nada além
do menu. Se ela já disse o que quer ("quero mandar uma skill nova"), pule o menu
e vá direto para a seção correspondente.

---

## O menu

```
VERITAS — convenções de engenharia do Veritas

  O que tenho          quais skills estão ativas e o que cada uma cobre
  Instalar/atualizar   pegar a última versão do plugin
  Enviar uma skill     criar uma regra nova e abrir PR
  Reportar problema    skill não disparou, ou disparou e foi ignorada
  Buscar skill externa procurar no diretório público skills.sh

Diga qual, ou `/veritas:ajuda <opção>`.
```

---

## O que tenho

Liste as skills do banco com uma linha cada. Se você tem acesso à lista de
skills instaladas da sessão, use-a — é a verdade da máquina dela. Senão, use
esta tabela:

| Skill | Cobre | Como entra |
|---|---|---|
| `principios` | decisão entre abordagens, avaliar dependência, escopo | sozinha |
| `mapa-do-codigo` | projeto grande ou desconhecido, arquitetura, impacto de mudança; quando usar o Graphify e o Ponytail | sozinha |
| `projeto-existente` | sistema legado ou de outra equipe: conservar a arquitetura dele ou remodelar | sozinha |
| `lgpd` | dado pessoal no código e no trabalho do agente, incidente, checagem no CI | sozinha |
| `clickup` | pegar task pelo card, critérios de aceite, relatório de fechamento | sozinha |
| `atomic-design` | onde cada componente de interface mora, em todo front | sozinha |
| `cores` | paleta 60-30-10, tokens de cor, modo escuro, contraste medido | sozinha |
| `tipografia-e-espacamento` | escala de texto, fontes, grade de 4/8, raio, sombra, alvo de toque | sozinha |
| `direcao-de-arte` | landing e página pública sem cara de template ou "de IA" | sozinha |
| `revisao-de-design` | capturar e conferir a tela (1440 e 390, claro e escuro) antes de entregar | sozinha |
| `responsividade` | layout do celular ao monitor largo, rolagem horizontal, menu de celular, área segura | sozinha |
| `django` | views, serializers, services, models, auth em Django/DRF | sozinha |
| `django-templates` | front em templates Django: componentes, forms no template, HTMX, Alpine | sozinha |
| `bun-hono-api` | API em Bun + Hono — Hono, Drizzle, Zod, typed errors, JWT | sozinha |
| `nestjs` | modules, controllers, services, DTOs, guards | sozinha |
| `nextjs` | App Router, Server Components, Server Actions | sozinha |
| `vite` | front React + Vite — páginas, rotas, stores, services | sozinha |
| `react-native` | telas, navegação, estado, listas | sozinha |
| `python` | projeto Python novo, estrutura, dependências | sozinha |
| `docs-oficiais` | consultar a doc oficial da lib na versão do projeto, auditar skill contra a doc | sozinha |
| `ajuda` | este menu | só por `/` |
| `atualizar` | pegar a última versão | só por `/` |
| `buscar-skills` | procurar skill pública no skills.sh | só por `/` |
| `executar-tasks` | pegar o próximo card com a etiqueta `agente`, trabalhar e abrir o PR | só por `/` ou agendamento |
| `ambiente` | conferir e ajustar as ferramentas da máquina (Veritas, Firecrawl, Headroom, claude-mem) ao padrão da casa | só por `/` |

Termine dizendo que as vinte primeiras entram sozinhas quando o assunto aparece;
as cinco últimas só quando a pessoa chama (a `executar-tasks` também por
tarefa agendada).

---

## Instalar / atualizar

Delegue para a skill `atualizar` e não repita o conteúdo dela aqui — ela sabe
detectar onde os comandos rodam, o que muda as instruções por completo.

Se a pessoa só quer o link para baixar à mão:

```
https://github.com/Caiorhcp/veritas/releases/latest
```

Avise que instalar por cima substitui a versão anterior, e que edições feitas na
cópia local se perdem — correção vai por PR.

---

## Enviar uma skill

Você escreve a skill; a pessoa traz o conteúdo. Nesta ordem:

1. **Pergunte o que a regra afirma.** Qual stack, o que é proibido, o que é
   obrigatório, de onde veio (doc oficial, incidente, decisão, prática já
   consolidada). Não invente convenção: se ela não souber dizer, a regra ainda
   não existe.

2. **Decida o nível.** Convenção que vale só num projeto **não entra** — vai no
   `CLAUDE.md` daquele repositório. O banco é para o que é compartilhado.

3. **Descubra se é skill nova ou alteração de uma que existe.** Este passo vem
   antes de escrever qualquer coisa, e errá-lo produz convenção duplicada.

   **Procure primeiro.** Se a regra toca um assunto que alguma skill já cobre,
   é alteração:

   ```bash
   grep -rln "<termo da regra>" skills/
   ```

   **Alteração** — o caso mais comum, de longe. Skill nova é raro; corrigir
   regra existente é toda semana. Encontre onde a regra mora hoje e edite ali.
   Se a regra contradiz o que está escrito, **mude o texto existente**; não
   acrescente uma exceção solta em outro lugar, senão a skill passa a dizer duas
   coisas. Decida entre corpo e arquivo de apoio pelo passo 4.

   **Skill nova** — só quando é uma stack ou assunto que o banco não cobre.
   Copie `docs/modelo-de-skill/` para `skills/<nome>/`. Frontmatter com `name`,
   `description` e tudo o mais dentro de `metadata`. A `description` precisa
   dizer **quando** usar, citando os termos que um dev usaria ao pedir ajuda —
   é ela, e não o corpo, que faz a skill ser escolhida.

   **Em qualquer um dos dois**, registre a origem no texto: de onde a regra
   veio e quando. Daqui a seis meses alguém vai querer saber por quê.

4. **Respeite a política de token.** No `SKILL.md` vai o que se consulta o tempo
   todo: proibições, stack, o núcleo. Detalhamento vai para arquivo de apoio ao
   lado, que carrega sob demanda. Skill nova com 20 KB no corpo está errada
   mesmo com conteúdo bom.

5. **Valide antes de propor**, se você alcança o repositório:

```bash
uv run python tools/validate_skills.py skills
```

Se o comando falhar, diga o que ele respondeu e peça que ela rode no próprio
terminal antes de abrir o PR. **Não pule a validação em silêncio, e não deduza
o ambiente a partir da falha** — o que importa é que a validação não aconteceu,
não onde você está.

6. **Abra o PR.** Se ela tem o repositório clonado **e você alcança o disco
   dela**, faça o commit em branch nova. Caso contrário, entregue o markdown
   pronto e diga para colar em `skills/<nome>/SKILL.md` pelo próprio site do
   GitHub — dá para criar arquivo e abrir PR sem clonar nada.

O CI confere o formato e responde em português se faltar algo.

---

## Reportar problema

Três casos, e a diferença entre eles é o que conserta:

**A skill não disparou.** Peça **a frase exata** que ela usou. É com ela que a
`description` é corrigida — sem a frase, o conserto é chute. Anote também o que
ela esperava que acontecesse.

**A skill disparou e a regra foi ignorada.** Mais grave que o anterior: o texto
da skill não está afirmativo o bastante. Peça o trecho da resposta que violou a
regra e qual regra era.

**A regra está errada ou faltando.** Vira PR, como em "Enviar uma skill".

Nos três, ofereça abrir uma issue com o que foi coletado:

```bash
gh issue create --repo Caiorhcp/veritas --title "..." --body "..."
```

---

## Buscar skill externa

Delegue para a skill `buscar-skills` e não repita o conteúdo dela aqui.

---

## Origem

Banco de skills do Veritas, skill `ajuda`.
Correções vão por PR no repositório, não editando a cópia local.
