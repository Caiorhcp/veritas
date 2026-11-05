# create-veritas

Cria um projeto que já funciona, com as convenções que ele segue escritas dentro dele.
Qualquer assistente de IA que abrir o repositório (Claude Code, Codex, Cursor, Copilot)
lê o `AGENTS.md` ou o `CLAUDE.md`, que aponta para `.veritas/INDEX.md`.

## Projeto novo

```bash
npm create veritas@latest meu-app
# ou
npx create-veritas new meu-app --stack vite
```

Stacks com template: `vite` (React + TS + Tailwind, react-router-dom, Zustand, Axios +
TanStack Query, React Hook Form + Zod, lucide-react, alias `@/`) e `nextjs` (App Router,
Server Components, Server Action, Tailwind). O template vem pronto no pacote: nada de
create-vite ou create-next-app na hora.

## Projeto que já existe

```bash
npx create-veritas init
```

Detecta a stack pelo `package.json`, `pyproject.toml`, `requirements.txt` ou `manage.py`
(vite, next, nestjs, react-native/expo, django, hono + drizzle, python), pede confirmação e
escreve só `.veritas/`, mais um bloco no `AGENTS.md` e no `CLAUDE.md`. Se esses arquivos já
existem, o conteúdo fica intacto: o bloco vai entre `<!-- veritas:start -->` e
`<!-- veritas:end -->` e é trocado, não duplicado, quando você roda de novo.

```bash
npx create-veritas list   # convenções disponíveis
```

## O que vai para o projeto

```
.veritas/
  INDEX.md          qual convenção vale quando (das descrições das skills)
  VERSION           versão do create-veritas que escreveu
  vite/SKILL.md     a skill da stack e os .md ao lado dela
  principios/  lgpd/  atomic-design/ (front)  projeto-existente/ (init)
AGENTS.md
CLAUDE.md
```

## Flags

Toda pergunta tem uma flag. Em terminal não interativo (CI, script), pergunta sem
resposta é erro que diz qual flag passar; nunca um padrão silencioso.

| Flag | Para |
| --- | --- |
| `--stack <vite\|nextjs>` | stack do projeto novo |
| `--skills a,b` | usar exatamente estas convenções |
| `--dir <pasta>` | pasta do projeto (`new`: `./<nome>`; `init`: a atual) |
| `--yes`, `-y` | confirmar sem perguntar (`init`) |
| `--no-install` | não rodar o install |
| `--lang pt\|en` | idioma das mensagens; as convenções ficam em português |

## Desenvolvimento

```bash
npm install
npm test          # node:test, direto no TypeScript (Node >= 22.18)
npm run build     # copia ../plugin/skills para conventions/ e compila para dist/
npm pack
```

As convenções vêm de `../plugin/skills` no build; o pacote publicado não lê o monorepo.
Skills de processo do plugin (clickup, executar-tasks, ajuda, atualizar, ambiente,
buscar-skills) ficam de fora.

## English

`create-veritas` scaffolds a working project and writes the conventions it follows into the
repo (`.veritas/`, `AGENTS.md`, `CLAUDE.md`), so any AI assistant reads them before
changing code. `npm create veritas@latest my-app` creates a Vite or Next.js project;
`npx create-veritas init` adds the conventions to an existing project without touching
your existing `AGENTS.md`/`CLAUDE.md` content. Every prompt has a flag (`--stack`,
`--skills`, `--yes`, `--no-install`, `--dir`, `--lang en`); in a non-interactive terminal
a missing answer is an error naming the flag. The conventions themselves are in
Portuguese.

MIT © Caio Gonçalves
