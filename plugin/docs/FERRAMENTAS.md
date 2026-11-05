# Ferramentas ao redor do Veritas

Coisas que a casa adota mas que **não são skills** — porque skill é conteúdo que
o agente lê, e estas são software que roda na máquina. Registradas aqui para a
decisão não se perder e para ninguém tentar empacotá-las junto.

---

## Ponytail — disciplina de simplicidade

**O que é:** um plugin que faz o agente parar no primeiro degrau que resolve o
problema, antes de escrever código: isto precisa existir? já existe no
repositório? a biblioteca padrão faz? o recurso nativo da plataforma faz? uma
dependência já instalada faz? cabe em uma linha? Só então escreve.

Nunca corta validação em fronteira de confiança, tratamento que evita perda de
dados, segurança ou acessibilidade.

**Como instalar** — no Claude Code, dois comandos em mensagens separadas (o
autor avisa que juntos não funciona):

```
/plugin marketplace add DietrichGebert/ponytail
```

```
/plugin install ponytail@ponytail
```

Precisa do `node` no PATH. Intensidade: `/ponytail lite | full | ultra | off`,
padrão `full`.

**Por que não está dentro do Veritas.** A licença é MIT e o próprio README
manda copiar os arquivos de regra para outros projetos — então seria permitido.
Mas copiar congela uma versão e cria uma segunda fonte de verdade: o dia em que
o autor corrigir algo, a nossa cópia não sabe. Instalar do original é um comando
e vem com atualização.

**Relação com a skill `principios`.** Elas se sobrepõem de propósito e não se
anulam. `principios` é o que o Veritas escreveu e tem autoridade dentro da
casa; ponytail é a versão dura e genérica da mesma ideia. Quem quiser as duas,
instala as duas.

---

## Headroom — compressão de contexto

**O que é:** uma camada entre o agente e a API do modelo que comprime o que o
agente lê (saída de ferramenta, log, JSON, arquivo) antes de virar contexto.
Roda na máquina, sem mandar o conteúdo para fora para comprimir. Guarda os
originais num cache local (CCR) para o agente recuperar se precisar.
Repositório: `github.com/headroomlabs-ai/headroom` (antes
`chopratejas/headroom`, que hoje redireciona para lá). Apache 2.0.

**Decisão da casa (2026-09-23): padrão do time.** Toda máquina que usa o
Claude Code tem o Headroom instalado, do jeito abaixo. O `/veritas:ambiente`
confere e instala se faltar. O Veritas continua funcionando sem ele: é
economia de token, não dependência.

**Como instalar, do jeito da casa** (só Claude Code):

```bash
uv tool install --python 3.13 "headroom-ai[all]"
headroom wrap claude --code-memory none
```

E deixe a telemetria desligada, de forma permanente:

```powershell
# Windows
[Environment]::SetEnvironmentVariable("HEADROOM_BEACON", "off", "User")
```

```bash
# macOS / Linux: no ~/.zshrc ou ~/.bashrc
export HEADROOM_BEACON=off
```

Desfazer tudo: `headroom unwrap claude`. O `/veritas:ambiente` confere essa
configuração.

**Os cuidados, e eles são reais:**

1. **A telemetria vem ligada.** Ela manda taxa de compressão, modelo e sistema
   operacional, sem prompt nem código, mas em máquina da empresa fica
   desligada (`HEADROOM_BEACON=off`).
2. **`--code-memory none`.** Sem ele, o `wrap` instala o Serena no escopo do
   usuário, e ele passa a aparecer em todos os seus projetos.
3. **Não use a memória dele** (`--memory`). A casa não adota memória
   persistente entre sessões (ver claude-mem, abaixo).
4. **`headroom learn` escreve no `CLAUDE.local.md`**, que fica fora do git.
   Não use `--target CLAUDE.md`: regra do time vem por PR, não por mineração
   automática de sessão.
5. **O cache CCR guarda, na máquina, o original do que o agente leu.** É o
   mesmo tipo de risco das transcrições que o próprio Claude Code já grava
   localmente, e nada sai da máquina para comprimir: por isso o Headroom pode
   ser padrão e o claude-mem não. O que a `veritas:lgpd` exige continua
   valendo: dado de produção não chega à máquina de dev, então não chega ao
   cache. Disco da máquina criptografado (BitLocker, FileVault).
6. **Vale só no Claude Code.** O Cowork não passa pelo proxy.
7. **Vira uma peça no caminho crítico.** Se o proxy cair, o agente para até
   você rodar `headroom unwrap claude`.

**O ganho** anunciado para agente de código é de uns 20%, e passa de 50% em
log e JSON repetitivo. Cada um mede o próprio com `headroom savings`, e
`headroom doctor` confirma que o tráfego está passando pelo proxy.

---

## claude-mem — não adotado

**O que é:** um plugin (`github.com/thedotmack/claude-mem`, Apache 2.0) que
grava tudo o que o agente faz, resume com IA e injeta nas sessões seguintes.

**Decisão da casa (2026-09-23): não usar.** Não instale, nem para teste, em
máquina que abre projeto de cliente. O `/veritas:ambiente` avisa se encontrar.

**Por quê:**

1. **Grava a saída de toda ferramenta** (arquivo lido, resultado de consulta,
   log) num banco local, sem prazo de expiração. Num sistema com dado de
   saúde, isso é dado sensível parado na máquina de dev, fora do controle do
   cliente (`veritas:lgpd`).
2. **O caminho padrão manda o conteúdo para fora.** O instalador empurra login
   e o resumidor hospedado do projeto, e o Cloud Sync, segundo a própria
   documentação, envia os resumos e o texto completo dos prompts para o
   servidor deles. Os provedores alternativos (OpenRouter, Gemini) são mais
   um terceiro.
3. **Não encontramos como excluir um projeto** da gravação. Sem isso, não dá
   para usar só nos projetos sem dado pessoal.
4. **O README do projeto associa o autor a uma criptomoeda** com o nome do
   projeto. Não é um problema técnico, mas pesa na decisão de adotar algo que
   vê todo o trabalho do time.

**O que a casa usa no lugar:** o `CLAUDE.md` de cada projeto (modo conservar ou
remodelar, decisões de front), o `STATE.md` da `executar-tasks`, e as próprias
skills do Veritas. É memória escrita de propósito, revisável e versionada.

**Reavaliar se:** o projeto passar a permitir exclusão por projeto e uma
configuração 100% local documentada, sem login nem nuvem.

---

## skills.sh — diretório público de skills

Diretório mantido pela Vercel, com skills de vários autores. **Não é regra da
casa** — é uma fonte de busca, e por isso virou a skill `buscar-skills`, que só
roda quando a pessoa chama por `/`.

A diferença é deliberada: as skills do Veritas são convenção e devem entrar sem
pedir; busca externa é escolha de quem trabalha.

Skill de fora não entra no banco por cópia. Se uma se provar útil, ou vira
pré-requisito documentado aqui — como o ponytail — ou a ideia dela é reescrita
como convenção nossa.

---

## lgpd-skills — o programa de conformidade LGPD

**O que é:** 19 skills de terceiro (`github.com/goul4rt/lgpd-skills`, MIT)
para o **programa** de conformidade: mapa de dados, ROPA (art. 37), RIPD
(art. 38), política de privacidade, DPA com operadores, canal de direitos do
titular (art. 18), encarregado, runbook de incidente (Res. CD/ANPD 15/2024) e
ECA Digital. Uma skill maestro, `lgpd-audit`, pergunta o cenário (projeto
novo, legado, híbrido ou incidente) e encadeia as outras, gerando documentos
em `.lgpd/`.

**Relação com a `veritas:lgpd`.** Não se sobrepõem. A `veritas:lgpd` é a
trava do dia a dia: o que o agente não faz com dado pessoal, e o que o código
que ele escreve não pode ter (log, URL, API, acesso). O `lgpd-skills` é o
trabalho de conformidade de um sistema inteiro, que se faz uma vez e se
revisa.

**Por que não está dentro do Veritas.** Pela mesma regra do ponytail: copiar
congela uma versão e cria uma segunda fonte de verdade. Instalar do original
vem com atualização.

**Como instalar**, no Claude Code:

```bash
claude plugin marketplace add goul4rt/lgpd-skills
claude plugin install lgpd-skills@lgpd-skills
```

**Antes de usar num projeto de cliente, quatro cuidados:**

1. **Quem desenvolve para cliente costuma ser operador.** ROPA, RIPD, política e base legal
   são documentos do **controlador** (o cliente). O agente pode redigir, mas
   quem assina e decide é o cliente, com o jurídico dele.
2. **`.lgpd/` fica no repositório.** Registro de incidente e mapa de dados
   num repositório de código ficam visíveis para todo mundo com acesso a ele.
   Combine com o cliente onde esses documentos moram. Nunca com dado pessoal
   real dentro.
3. **Os exemplos são em Prisma e Better Auth.** Nos projetos Django e Drizzle,
   leia como ideia, e siga a skill de stack da casa.
4. **O repositório é novo** (criado em maio de 2026, sem commit desde
   31/05/2026 quando foi avaliado). Lido inteiro em 2026-09-23: não roda comando
   nem busca URL fora das fontes oficiais (Planalto e ANPD).

**Veredito:** recomendado quando a tarefa é conformidade de um sistema
inteiro, como a auditoria LGPD de um sistema com dado de saúde (art. 11). Não
precisa estar instalado no dia a dia: a `veritas:lgpd` cobre o código.

---

## Vercel agent-skills e taste-skill — front-end

**O que são:** dois pacotes de skills de terceiro, ambos MIT.
`github.com/vercel-labs/agent-skills` traz performance e composição de React,
React Native, view transitions, revisão de UI e deploy na Vercel.
`github.com/Leonxlnx/taste-skill` traz direção de arte para página pública
(`design-taste-frontend`), redesign, estilos fechados e geração de imagem.

**Decisão da casa (2026-10-14): pré-requisito do front.** Pela mesma regra do
ponytail, não são copiadas para dentro do banco: cada um instala do original.
O que o Veritas acrescenta é **quando cada uma entra e quem vence**: as skills
de stack (`nextjs`, `vite`, `react-native`, `django-templates`) chamam a
skill certa sem a pessoa pedir, e em conflito a convenção da casa ganha. A
tabela completa está em `skills/atomic-design/skills-de-fora.md`.

**Como instalar.** No Cowork, cada skill vem como `.skill` e se instala com
"Save skill". No Claude Code:

```
/plugin marketplace add Leonxlnx/taste-skill
```

```
/plugin install taste-skill@taste-skill
```

```bash
npx skills add vercel-labs/agent-skills
```

**Os cuidados:**

1. **Elas disparam pela própria descrição**, e o Veritas não tem como
   desligar isso. As regras de "só quando pedir" funcionam quando a skill de
   stack está carregada; fora dela, uma variante de estilo pode entrar
   sozinha. Quem não usa as variantes (`minimalist-ui`, `industrial-brutalist-ui`,
   `high-end-visual-design`, `gpt-taste`) e as versões antigas
   (`design-taste-frontend-v1`, `-v2-experimental`) pode simplesmente não
   instalá-las.
2. **`deploy-to-vercel` envia o projeto** para um endpoint da Vercel. Nunca
   entra sozinha, e não roda em projeto de cliente sem combinar.
3. **`design-taste-frontend` busca imagens** em acervos públicos (Met, Art
   Institute, NASA, Wikimedia, Openverse). É uma consulta de saída da máquina;
   nada do projeto vai junto.
