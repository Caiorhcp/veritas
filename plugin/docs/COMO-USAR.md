# Como usar o Veritas

Guia para quem vai **usar** as skills. Se você cuida do banco, veja o
[`README.md`](../README.md).

---

## O que é isso

As convenções de engenharia do Veritas, num formato que o Claude carrega
sozinho quando o assunto aparece.

Antes, as regras da casa viviam em três lugares: na cabeça de quem já estava
aqui há tempo, num `CLAUDE.md` que cada projeto tinha diferente, e numa pasta de
contextos que você copiava na mão. Resultado: o Claude gerava código que passava
no code review de um jeito e reprovava no de outro.

Agora é um plugin só. Você instala uma vez. Quando pede algo de Django, a
convenção de Django entra junto; quando é uma API em Bun + Hono, entra a dela.

---

## Instalar

### Claude Code

Dentro do Claude Code:

```
/plugin marketplace add Caiorhcp/veritas
/plugin install veritas@veritas
```

Ou no terminal:

```bash
claude plugin marketplace add Caiorhcp/veritas
claude plugin install veritas@veritas
```

Confira com `claude plugin list`: `veritas@veritas` com `✔ enabled`.

Para atualizar depois:

```bash
claude plugin marketplace update veritas
claude plugin update veritas@veritas
```

e reinicie o Claude Code.

**Prefere uma cópia local?** Use o clone como marketplace:

```bash
git clone https://github.com/Caiorhcp/veritas.git ~/workspace/veritas
claude plugin marketplace add ~/workspace/veritas
claude plugin install veritas@veritas
```

Nesse caso, atualizar é `git pull` na pasta **e** os dois comandos de
atualização acima. Só o `git pull` não muda o plugin instalado, que é uma
cópia.

### Cowork

Baixe o `veritas.plugin` da última release em
`github.com/Caiorhcp/veritas/releases/latest` e arraste para uma conversa.

### Headroom, no Claude Code

É padrão da casa: comprime o que o agente lê e economiza token. Rode
`/veritas:ambiente` e ele instala e configura do jeito certo (telemetria
desligada, sem Serena), ou siga `docs/FERRAMENTAS.md`. Depois, abra o Claude
Code com `headroom wrap claude --code-memory none`.

### Usa o Cowork e o Claude Code

O Claude Code também puxa os plugins que você instalou no Cowork. Eles
aparecem em `claude plugin list` como `veritas@synced`. Se você instalou o
Veritas pelos dois caminhos, o `veritas@veritas` ganha, e o `@synced` fica
com o aviso "not loaded". É esperado, e não precisa fazer nada.

---

## Perdido? Chame o menu

```
/veritas:ajuda
```

Mostra o que existe no banco, como atualizar, como mandar uma skill nova e como
reportar uma que falhou. É o único comando que você precisa lembrar.

---

## Usar

**Não tem passo.** Você não invoca, não digita comando, não configura nada.

Trabalhe como sempre. O Claude lê a descrição das skills disponíveis e carrega a
que couber.

### O que muda na prática

Você pede:

> Preciso de um endpoint que cadastra um cliente e dispara um email de
> boas-vindas.

**Sem o Veritas**, vem uma resposta correta de Django genérico: view que valida,
salva e manda o email.

**Com o Veritas**, vem a resposta da casa: a lógica vai num service, o serializer
não consulta outra tabela, e o email dispara em `transaction.on_commit()` — não
dentro da transação.

A diferença não é o Claude ficar mais inteligente. É ele parar de escolher entre
cinco jeitos defensáveis e usar o que o time escolheu.

### Quando cada skill entra

| Skill | Entra quando você mexe em |
|---|---|
| `principios` | decisão de arquitetura, escolha entre duas abordagens, avaliar dependência nova |
| `mapa-do-codigo` | projeto grande ou desconhecido, pergunta de arquitetura ou de impacto de mudança, repositório com `graphify-out/` |
| `projeto-existente` | primeira mudança num sistema legado, de cliente ou de outra equipe. Pergunta uma vez se é para conservar a arquitetura dele ou remodelar, e anota a resposta no `CLAUDE.md` do projeto |
| `lgpd` | código com dado pessoal (CPF, saúde, contato, financeiro), log, exportação, integração com terceiro, dado exposto. Também impede que dado real vá para card, PR, prompt ou máquina de dev |
| `atomic-design` | onde um componente de interface mora, em qualquer front, inclusive templates Django |
| `cores` | paleta, tokens de cor, tema escuro, cor de botão, link, foco ou erro, contraste |
| `tipografia-e-espacamento` | fonte, escala de texto, espaçamento, grade, raio, sombra, breakpoint, tamanho de botão e alvo de toque |
| `direcao-de-arte` | landing page, site, página de produto, hero, onboarding; página com cara genérica |
| `revisao-de-design` | antes de entregar uma tela: capturas em 1440 e 390, claro e escuro, e a lista de conferência |
| `clickup` | pegar uma task pelo card, critérios de aceite, relatório de fechamento |
| `django` | views, serializers, services, models, migrations, auth em Django/DRF |
| `django-templates` | templates `.html` de Django: componentizar tela, include, form no template, HTMX, Alpine. Num front ainda sem padrão, pergunta a arquitetura antes |
| `bun-hono-api` | API em Bun + Hono — rotas Hono, Drizzle, Zod, typed errors, JWT |
| `nestjs` | modules, controllers, services, DTOs, guards |
| `nextjs` | App Router, Server Components, Server Actions, rotas em `src/app/` |
| `vite` | front React + Vite — páginas, rotas, stores Zustand, services |
| `react-native` | telas, navegação, estado, listas |
| `python` | projeto Python novo, estrutura de módulo, dependências |
| `docs-oficiais` | dúvida de API de uma lib, erro de função removida, upgrade de versão |

Quatro só rodam quando você chama: `/veritas:ajuda`, `/veritas:atualizar`,
`/veritas:buscar-skills` e `/veritas:ambiente`, que confere as ferramentas da
sua máquina (Firecrawl, Headroom, claude-mem) e ajusta ao padrão da casa. A `/veritas:executar-tasks` também, ou por uma
tarefa agendada: ela pega o próximo card do ClickUp com a etiqueta `agente`,
trabalha e abre o PR.

A `bun-hono-api` é a mais completa: além do `SKILL.md`, ela carrega onze
arquivos de apoio — arquitetura, convenções de nomes, auth, e cinco padrões
(módulo novo, erros, paginação, schemas Drizzle, testes). Eles entram sob
demanda: se a tarefa é criar um módulo, o Claude abre `patterns/new-module.md`
e mais nada.

### A `clickup` precisa de um passo a mais

Todas as outras skills funcionam sozinhas assim que o plugin está instalado.
A `clickup` é a única exceção: ela sabe o formato dos cards e dos relatórios,
mas para **ler** um card e **postar** o relatório ela usa o conector do
ClickUp — e conector é por pessoa, não vem no plugin.

Ligue o ClickUp uma vez no seu Claude e ela passa a fazer as duas pontas
sozinha. Sem ele, você cola o card no chat e o Claude devolve o relatório
pronto para colar de volta — muda o trabalho manual, não a regra.

---

## Quando algo está errado

### A skill não disparou

Aconteceu de você pedir algo de Django e a resposta vir genérica? Isso é um
problema real e vale reportar. Anote **a frase exata que você usou** — é com ela
que a descrição da skill é corrigida.

Enquanto não corrige, dá para forçar: mencione a stack explicitamente ("seguindo
nossas convenções de Django, ...").

### A skill disparou e o Claude ignorou a regra

Reporte também, e esse caso é mais grave que o anterior: significa que o texto
da skill não está afirmativo o bastante. O conserto é na skill, não no seu
prompt.

### A regra está errada ou faltando

**Não edite a sua cópia.** Ela é sobrescrita na próxima atualização e a correção
se perde — e pior, até lá você trabalha com uma regra que ninguém mais tem.

Abra uma issue ou um PR direto no
[repositório](https://github.com/Caiorhcp/veritas). É markdown: dá para
editar pelo próprio site do GitHub, sem clonar nada. O CI confere o formato e
responde em português se faltar alguma coisa.

### Preciso de uma regra que vale só no meu projeto

Essa não entra no Veritas. Vai no `CLAUDE.md` do próprio repositório.

O banco é para o que é compartilhado entre projetos. No dia em que existir uma
skill por projeto, a mesma regra estará escrita cinco vezes e desatualizada em
quatro.

### A minha stack não está aqui

Cinco stacks ficaram de fora na primeira versão — `express`, `fastapi`,
`flutter`, `go_fiber` e `langgraph` — porque nenhum projeto ativo as usava.
Se a sua faz falta, abra uma issue ou proponha a skill por PR.

---

## Atualizações

Chame `/veritas:atualizar`. Ele descobre o que você tem, o que existe, e diz em
um bloco só o que fez e o que falta.

**Uma coisa que confunde:** no Claude Desktop, o Claude executa comandos num
ambiente isolado que não é o seu computador. Por isso ele pode dizer
`não verificável aqui` e te entregar os comandos para rodar no seu terminal —
isso não é erro nem `gh` quebrado, é o agente sendo honesto sobre onde ele
alcança.

No Claude Code, rodando no terminal, ele faz tudo sozinho, menos reiniciar.

Quando uma skill muda, sai uma versão nova, e você fica sabendo pelo aviso que
aparece ao abrir o Claude. No Cowork, baixe o `veritas.plugin` em
`github.com/Caiorhcp/veritas/releases/latest` e arraste para uma conversa.
No Claude Code, os dois comandos de atualização de "Instalar".

---

## Uma coisa que vale saber

Este banco é novo. As skills foram escritas a partir das convenções que já
existiam, mas nenhuma delas foi testada em semanas de uso real ainda.

Se alguma parecer errada, provavelmente está — reclame em vez de assumir que é
assim mesmo. As primeiras semanas de reclamação são o que transforma isso de
"markdown que alguém escreveu" em regra que funciona.
