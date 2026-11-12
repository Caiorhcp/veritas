# Veritas para VS Code, Cursor, Windsurf e afins

As convenções de engenharia do [Veritas](https://veritasdev.vercel.app) dentro do seu projeto, escritas no formato que cada assistente de IA lê: Cursor, GitHub Copilot, Windsurf, Cline, Roo Code, Continue, Claude Code, Codex e Gemini CLI. Funciona no VS Code e nos editores baseados nele (Cursor, Windsurf, VSCodium, Trae).

As convenções são em português, uma por stack (Vite, Next.js, NestJS, Django, React Native, Python, Bun + Hono) mais as gerais (princípios, LGPD, projeto existente, mapa do código) e as de interface (atomic design, cores, tipografia e espaçamento, direção de arte, revisão de design).

## O que faz

- **Aplicar convenções ao projeto.** Detecta a stack (mesma lógica da CLI `create-veritas`), deixa você confirmar a lista de convenções e escreve `.veritas/` (as skills, `INDEX.md` e `VERSION`) mais os arquivos de regra de cada assistente. Na primeira vez que você abre um projeto com stack conhecida e sem `.veritas/`, a extensão pergunta uma vez; dá para dizer "não perguntar neste projeto".
- **Painel de convenções.** Um ícone na barra lateral lista as convenções em Stacks, Gerais e Processo (Claude). O ícone mostra o que já está no projeto. Clicar abre o Markdown em pré-visualização (a cópia do projeto, se houver; senão, a da extensão). Botão direito: adicionar ou remover do projeto.
- **Buscar convenção.** Procura por nome, descrição e títulos de todos os arquivos.
- **Novo projeto.** Escolha a stack (vite ou nextjs), a pasta e o nome: sai um projeto que já roda, com as convenções e as regras dos assistentes. A extensão oferece rodar `npm install` num terminal e abrir a pasta.
- **Grafo do código com o Graphify.** Monta, atualiza e abre o grafo do [Graphify](https://github.com/Graphify-Labs/graphify). O padrão é só o código (local, sem modelo de IA); incluir documentos é uma escolha explícita, porque passa por um modelo e custa tokens. Se o `graphify` não estiver instalado, a extensão explica e oferece o comando; não instala nada sozinha. Antes do primeiro grafo, pergunta se pode pôr `graphify-out/` no `.gitignore`.
- **Barra de status.** `Veritas ✓ n convenções`, ou `Veritas: desatualizado` quando o `.veritas/VERSION` do projeto é mais antigo que o da extensão (clique para atualizar). Com grafo, mostra a idade dele.

## Comandos

| Comando | O que faz |
|---|---|
| `Veritas: Aplicar convenções ao projeto` | Detecta a stack, confirma a lista e escreve `.veritas/` e as regras |
| `Veritas: Atualizar convenções` | Reaplica as convenções instaladas com a versão da extensão |
| `Veritas: Buscar convenção` | Busca por nome, descrição e títulos |
| `Veritas: Novo projeto` | Cria um projeto a partir do template da stack |
| `Veritas: Montar grafo do código` | `graphify extract . --code-only` (ou com documentos, se você escolher) |
| `Veritas: Atualizar grafo` | `graphify update .` |
| `Veritas: Abrir grafo` | Abre `graphify-out/GRAPH_REPORT.md` no editor e `graph.html` no navegador |

## Configurações

| Configuração | Padrão | O que faz |
|---|---|---|
| `veritas.targets` | todos | Quais assistentes recebem arquivos de regra: `cursor`, `copilot`, `windsurf`, `cline`, `roo`, `continue`, `claude`, `agents`, `gemini` |
| `veritas.promptOnOpen` | `true` | Perguntar ao abrir um projeto com stack conhecida e sem `.veritas/` |

## Assistentes suportados

Cada regra aponta para `.veritas/<skill>/SKILL.md` em vez de copiar a skill inteira, para não pesar no contexto. Onde o formato permite carregar por descrição, cada skill vira uma regra que o agente puxa quando a tarefa bate com ela; onde não permite, vai um índice único com as descrições.

| Assistente | Arquivos | Como entra | Documentação |
|---|---|---|---|
| Cursor | `.cursor/rules/veritas-index.mdc` + `veritas-<skill>.mdc` | índice com `alwaysApply: true`; skills com `description` (Apply Intelligently) | [cursor.com/docs/rules](https://cursor.com/docs/rules) |
| GitHub Copilot | bloco em `.github/copilot-instructions.md` + `.github/instructions/veritas-<skill>.instructions.md` | arquivo do repositório sempre; skills por `description` | [GitHub Docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), [VS Code](https://code.visualstudio.com/docs/agent-customization/custom-instructions) |
| Windsurf | `.windsurf/rules/veritas-index.md` + `veritas-<skill>.md` | `trigger: always_on` no índice; `trigger: model_decision` nas skills | [Windsurf / Devin rules](https://docs.devin.ai/cli/extensibility/rules.md) |
| Cline | `.clinerules/veritas-index.md` (ou `.cline/rules/` se `.clinerules` for um arquivo antigo) | sem frontmatter = sempre ativo | [docs.cline.bot](https://docs.cline.bot/customization/cline-rules) |
| Roo Code | `.roo/rules/veritas-index.md` | a pasta é lida inteira, sempre | [docs.roocode.com](https://docs.roocode.com/features/custom-instructions) |
| Continue | `.continue/rules/veritas-index.md` + `veritas-<skill>.md` | índice com `alwaysApply: true`; skills com `description` e `alwaysApply: false` | [docs.continue.dev](https://docs.continue.dev/customize/deep-dives/rules) |
| Claude Code | bloco em `CLAUDE.md` | sempre | [Claude Code memory](https://docs.anthropic.com/en/docs/claude-code/memory) |
| Codex e outros | bloco em `AGENTS.md` | sempre | [agents.md](https://agents.md) |
| Gemini CLI | bloco em `GEMINI.md` | sempre | [geminicli.com](https://geminicli.com/docs/cli/gemini-md/) |

**Seu conteúdo fica intacto.** Os arquivos `veritas-*` levam a marca `<!-- veritas:generated … -->` e são reescritos (ou apagados, quando a skill sai) a cada aplicação. Um arquivo com o mesmo nome e sem a marca é seu e não é tocado. Em arquivos compartilhados (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`), só o trecho entre `<!-- veritas:start -->` e `<!-- veritas:end -->` é do Veritas: o mesmo bloco da CLI, trocado e nunca duplicado.

As skills de processo do plugin do Claude (`ajuda`, `ambiente`, `atualizar`, `buscar-skills`, `clickup`, `executar-tasks`) aparecem no painel para leitura, mas não são escritas no projeto.

## Capturas de tela

A fazer:

1. Painel Veritas na barra lateral com os grupos e o ícone de "no projeto".
2. QuickPick de confirmação das convenções.
3. Árvore de arquivos depois de aplicar (`.veritas/`, `.cursor/rules/`, `.github/`…).
4. Barra de status com `Veritas ✓` e a idade do grafo.
5. Escolha entre "Só o código" e "Código e documentos" no grafo.

## Privacidade

A extensão não tem telemetria e não envia nada para lugar nenhum. Tudo é escrito no disco, na pasta do seu projeto. Os únicos programas externos são os que você pede: `npm install` e o `graphify`, sempre num terminal visível. O grafo só do código roda localmente; incluir documentos passa pelo modelo que você configurou no Graphify.

## Créditos

- [Graphify](https://github.com/Graphify-Labs/graphify), da Graphify Labs (Apache-2.0): o grafo do código. A extensão só chama a CLI que você instalou.
- [Ponytail](https://github.com/DietrichGebert/ponytail), de Dietrich Gebert (MIT): a menor mudança que resolve; a skill `mapa-do-codigo` diz quando usar cada um.
- A ideia de escrever as convenções dentro do projeto vem do [Prumo](https://prumo.stjosephworks.org), da St. Joseph Works (MIT).

## Licença

[MIT](LICENSE) © 2026 Caio Gonçalves. Código em [github.com/Caiorhcp/veritas](https://github.com/Caiorhcp/veritas).

---

## English

Veritas puts engineering conventions (written in Portuguese, one per stack) inside your project, in each AI assistant's native rule format. Works in VS Code and VS Code–based editors (Cursor, Windsurf, VSCodium, Trae). The UI is in Portuguese by default and English when the editor runs in English.

- **Apply conventions to project**: detects the stack, lets you confirm the list, writes `.veritas/` plus rule files for Cursor (`.cursor/rules/*.mdc`), GitHub Copilot (`.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`), Windsurf (`.windsurf/rules/`), Cline (`.clinerules/`), Roo Code (`.roo/rules/`), Continue (`.continue/rules/`), Claude Code (`CLAUDE.md`), Codex and others (`AGENTS.md`) and Gemini CLI (`GEMINI.md`). Choose assistants with `veritas.targets`.
- **Never overwrites your content**: generated `veritas-*` files carry a marker and are fully managed; shared files only get a delimited `<!-- veritas:start --> … <!-- veritas:end -->` block.
- **Conventions panel**, **search**, **new project** (vite or nextjs template) and **Graphify** integration (code-only graph by default; documents only when you choose; never installs anything silently).
- **Privacy**: no telemetry, nothing is sent anywhere.

License: MIT.
