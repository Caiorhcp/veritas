#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import {
  MissingAnswer, VERSION, answer, copyTemplate, detectStacks, loadCatalog, resolveSkills, stackTemplates, writeVeritas,
} from './lib.ts';

const MSG = {
  pt: {
    help: `create-veritas ${VERSION}

Uso:
  npm create veritas@latest <nome>        cria um projeto novo
  npx create-veritas new <nome>           idem
  npx create-veritas init                 adiciona .veritas/ a um projeto que já existe
  npx create-veritas list                 lista as convenções disponíveis

Opções:
  --stack <vite|nextjs>   stack do projeto novo
  --skills a,b            usa exatamente estas convenções
  --dir <pasta>           pasta do projeto (new: ./<nome>; init: a atual)
  --yes, -y               confirma sem perguntar
  --no-install            não roda o install
  --lang <pt|en>          idioma das mensagens (as convenções ficam em português)
  --help, -h | --version, -v`,
    name: 'Nome do projeto: ',
    stack: (opts: string[]) => `Stack (${opts.join(', ')}): `,
    skills: 'Convenções (separadas por vírgula): ',
    detected: (s: string) => `Detectado: ${s || 'nenhuma stack conhecida'}`,
    confirm: (s: string) => `Escrever .veritas/ com: ${s}? (S/n) `,
    aborted: 'Cancelado.',
    missing: (flag: string) => `Faltou resposta e o terminal não é interativo. Passe ${flag}.`,
    badStack: (s: string, opts: string[]) => `Stack "${s}" não existe. Use uma de: ${opts.join(', ')}.`,
    badSkill: (s: string) => `Convenção "${s}" não existe. Veja: npx create-veritas list`,
    notEmpty: (d: string) => `A pasta ${d} já existe e não está vazia.`,
    noSkills: 'Nenhuma convenção escolhida.',
    emptyName: 'O projeto precisa de um nome.',
    installing: (pm: string) => `Instalando dependências com ${pm}...`,
    installFailed: (pm: string) => `O ${pm} install falhou. Rode à mão dentro da pasta.`,
    created: (d: string, pm: string, installed: boolean) =>
      `\nPronto: ${d}\n\n  cd ${d}\n${installed ? '' : `  ${pm} install\n`}  ${pm} run dev\n\nAs convenções estão em .veritas/ e o AGENTS.md aponta para elas.`,
    inited: (s: string) => `\nPronto: .veritas/ (${s}), AGENTS.md e CLAUDE.md.`,
    unknownCmd: (c: string) => `Comando desconhecido: ${c}`,
    hasTemplate: 'tem template para create-veritas new',
  },
  en: {
    help: `create-veritas ${VERSION}

Usage:
  npm create veritas@latest <name>        create a new project
  npx create-veritas new <name>           same
  npx create-veritas init                 add .veritas/ to an existing project
  npx create-veritas list                 list available conventions

Options:
  --stack <vite|nextjs>   stack for the new project
  --skills a,b            use exactly these conventions
  --dir <folder>          project folder (new: ./<name>; init: current)
  --yes, -y               confirm without asking
  --no-install            skip install
  --lang <pt|en>          message language (conventions stay in Portuguese)
  --help, -h | --version, -v`,
    name: 'Project name: ',
    stack: (opts: string[]) => `Stack (${opts.join(', ')}): `,
    skills: 'Conventions (comma separated): ',
    detected: (s: string) => `Detected: ${s || 'no known stack'}`,
    confirm: (s: string) => `Write .veritas/ with: ${s}? (Y/n) `,
    aborted: 'Cancelled.',
    missing: (flag: string) => `Missing answer and the terminal is not interactive. Pass ${flag}.`,
    badStack: (s: string, opts: string[]) => `Stack "${s}" does not exist. Use one of: ${opts.join(', ')}.`,
    badSkill: (s: string) => `Convention "${s}" does not exist. See: npx create-veritas list`,
    notEmpty: (d: string) => `Folder ${d} already exists and is not empty.`,
    noSkills: 'No conventions chosen.',
    emptyName: 'The project needs a name.',
    installing: (pm: string) => `Installing dependencies with ${pm}...`,
    installFailed: (pm: string) => `${pm} install failed. Run it by hand inside the folder.`,
    created: (d: string, pm: string, installed: boolean) =>
      `\nDone: ${d}\n\n  cd ${d}\n${installed ? '' : `  ${pm} install\n`}  ${pm} run dev\n\nConventions live in .veritas/ and AGENTS.md points to them.`,
    inited: (s: string) => `\nDone: .veritas/ (${s}), AGENTS.md and CLAUDE.md.`,
    unknownCmd: (c: string) => `Unknown command: ${c}`,
    hasTemplate: 'has a template for create-veritas new',
  },
};

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  allowNegative: true,
  options: {
    stack: { type: 'string' },
    skills: { type: 'string' },
    dir: { type: 'string' },
    yes: { type: 'boolean', short: 'y', default: false },
    install: { type: 'boolean', default: true },
    lang: { type: 'string', default: 'pt' },
    help: { type: 'boolean', short: 'h' },
    version: { type: 'boolean', short: 'v' },
  },
});

const t = opts.lang === 'en' ? MSG.en : MSG.pt;
const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
const catalog = loadCatalog();

class Fail extends Error {}

async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

function parseSkills(list: string): string[] {
  const skills = list.split(',').map((s) => s.trim()).filter(Boolean);
  for (const s of skills) if (!catalog.has(s)) throw new Fail(t.badSkill(s));
  if (skills.length === 0) throw new Fail(t.noSkills);
  return skills;
}

function packageManager(): string {
  const ua = process.env.npm_config_user_agent ?? '';
  return ['pnpm', 'yarn', 'bun'].find((pm) => ua.startsWith(pm)) ?? 'npm';
}

async function cmdNew(nameArg?: string) {
  const stacks = stackTemplates();
  const name = await answer(nameArg ?? (opts.dir ? basename(resolve(opts.dir)) : undefined), '<nome> (ex.: create-veritas new my-app)', interactive, () => ask(t.name));
  if (!name) throw new Fail(t.emptyName);
  const stack = await answer(opts.stack, `--stack <${stacks.join('|')}>`, interactive, () => ask(t.stack(stacks)));
  if (!stacks.includes(stack)) throw new Fail(t.badStack(stack, stacks));
  const dir = resolve(opts.dir ?? name);
  if (existsSync(dir) && readdirSync(dir).length > 0) throw new Fail(t.notEmpty(dir));

  const skills = opts.skills ? parseSkills(opts.skills) : resolveSkills([stack], catalog, false);
  copyTemplate(stack, dir, basename(dir).toLowerCase().replace(/[^a-z0-9._-]+/g, '-'));
  writeVeritas(dir, skills, catalog);

  const pm = packageManager();
  let installed = false;
  if (opts.install) {
    console.log(t.installing(pm));
    // shell: no Windows o npm é npm.cmd; args fixos, sem entrada do usuário.
    // NODE_ENV=production faz o gerenciador pular devDependencies (Tailwind, TypeScript) e o build quebra.
    const { NODE_ENV: _ignorado, ...env } = process.env;
    installed = spawnSync(pm, ['install'], { cwd: dir, env, stdio: 'inherit', shell: process.platform === 'win32' }).status === 0;
    if (!installed) console.error(t.installFailed(pm));
  }
  console.log(t.created(opts.dir ?? name, pm, installed));
}

async function cmdInit() {
  const dir = resolve(opts.dir ?? '.');
  let skills: string[];
  if (opts.skills) {
    skills = parseSkills(opts.skills);
  } else {
    const stacks = detectStacks(dir);
    console.log(t.detected(stacks.join(', ')));
    skills = resolveSkills(stacks, catalog, true);
  }
  if (!opts.yes) {
    const ok = await answer<string>(undefined, '--yes', interactive, () => ask(t.confirm(skills.join(', '))));
    if (/^n/i.test(ok)) {
      const other = await ask(t.skills);
      if (!other) throw new Fail(t.aborted);
      skills = parseSkills(other);
    }
  }
  writeVeritas(dir, skills, catalog);
  console.log(t.inited(skills.join(', ')));
}

function cmdList() {
  const templates = new Set(stackTemplates());
  const byScope = Map.groupBy(catalog.values(), (s) => s.escopo || '-');
  for (const [scope, skills] of byScope) {
    console.log(`\n${scope}`);
    for (const s of skills) {
      const mark = templates.has(s.name) ? ' [new]' : '';
      const desc = s.description.length > 90 ? s.description.slice(0, 89) + '…' : s.description;
      console.log(`  ${(s.name + mark).padEnd(20)}${desc}`);
    }
  }
  console.log(`\n[new] = ${t.hasTemplate}\n`);
}

async function main() {
  if (opts.help) return console.log(t.help);
  if (opts.version) return console.log(VERSION);
  const [cmd, arg] = positionals;
  if (cmd === 'init') return cmdInit();
  if (cmd === 'list') return cmdList();
  if (cmd === 'new') return cmdNew(arg);
  if (cmd === undefined || positionals.length === 1) return cmdNew(cmd); // npm create veritas <nome>
  throw new Fail(t.unknownCmd(cmd));
}

main().catch((err) => {
  if (err instanceof MissingAnswer) console.error(t.missing(err.message));
  else if (err instanceof Fail) console.error(err.message);
  else throw err;
  process.exitCode = 1;
});
