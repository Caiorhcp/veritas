import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PKG_ROOT = fileURLToPath(new URL('..', import.meta.url));
export const CONVENTIONS_DIR = join(PKG_ROOT, 'conventions');
export const TEMPLATES_DIR = join(PKG_ROOT, 'templates');
export const VERSION: string = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).version;

export const GENERAL = ['principios', 'lgpd'];
const FRONT_SCOPES = new Set(['frontend', 'mobile']);
/** Skills de interface que entram em toda stack de front ou mobile. */
const FRONT = ['atomic-design', 'cores', 'tipografia-e-espacamento', 'direcao-de-arte', 'revisao-de-design', 'responsividade'];

export interface Skill {
  name: string;
  description: string;
  escopo: string;
}

// shortcut: lê só chaves de uma linha (name, description, escopo); trocar por um parser YAML se o frontmatter crescer.
export function parseFrontmatter(md: string): Skill {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md)?.[1] ?? '';
  const get = (re: RegExp) => (re.exec(fm)?.[1] ?? '').trim().replace(/^(["'])(.*)\1$/, '$2');
  return { name: get(/^name:(.*)$/m), description: get(/^description:(.*)$/m), escopo: get(/^\s+escopo:(.*)$/m) };
}

export function loadCatalog(dir = CONVENTIONS_DIR): Map<string, Skill> {
  const catalog = new Map<string, Skill>();
  for (const name of readdirSync(dir).sort()) {
    const file = join(dir, name, 'SKILL.md');
    if (existsSync(file)) catalog.set(name, { ...parseFrontmatter(readFileSync(file, 'utf8')), name });
  }
  return catalog;
}

export function stackTemplates(dir = TEMPLATES_DIR): string[] {
  return readdirSync(dir).sort();
}

const readText = (p: string) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

/** Skills de stack que valem para o projeto em `dir`, na ordem de detecção. */
export function detectStacks(dir: string): string[] {
  const found: string[] = [];
  const pkgText = readText(join(dir, 'package.json'));
  if (pkgText) {
    const pkg = JSON.parse(pkgText);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const has = (d: string) => d in deps;
    if (has('next')) found.push('nextjs');
    else if (has('vite') && has('react')) found.push('vite');
    if (has('@nestjs/core')) found.push('nestjs');
    if (has('react-native') || has('expo')) found.push('react-native');
    if (has('hono') && has('drizzle-orm')) found.push('bun-hono-api');
  }
  const py = readText(join(dir, 'pyproject.toml')) + '\n' + readText(join(dir, 'requirements.txt'));
  const isPython = py.trim() !== '' || existsSync(join(dir, 'manage.py'));
  if (existsSync(join(dir, 'manage.py')) || /\bdjango/i.test(py)) found.push('django');
  else if (isPython) found.push('python');
  return found;
}

/** Stacks + skills gerais; as de interface (FRONT) se houver front; projeto-existente no init. */
export function resolveSkills(stacks: string[], catalog: Map<string, Skill>, existing: boolean): string[] {
  const skills = [...stacks, ...GENERAL];
  if (stacks.some((s) => FRONT_SCOPES.has(catalog.get(s)?.escopo ?? ''))) skills.push(...FRONT);
  if (existing) skills.push('projeto-existente');
  return [...new Set(skills)].filter((s) => catalog.has(s));
}

export function buildIndex(skills: string[], catalog: Map<string, Skill>): string {
  const rows = skills.map((s) => `| [${s}](${s}/SKILL.md) | ${catalog.get(s)?.description.replace(/\|/g, '\\|') ?? ''} |`);
  return `# Convenções deste projeto (Veritas)

Antes de mudar código, leia a skill que se aplica à tarefa. Cada pasta aqui é uma
skill: o \`SKILL.md\` dela e os arquivos .md ao lado. Quando um texto citar
\`veritas:<nome>\`, leia \`.veritas/<nome>/SKILL.md\`. Se a skill citada não
estiver nesta pasta, ela não foi instalada neste projeto.

| Skill | Quando usar |
| --- | --- |
${rows.join('\n')}

Gerado por create-veritas ${VERSION}. Para atualizar: \`npx create-veritas@latest init\`.
`;
}

export const BLOCK_START = '<!-- veritas:start -->';
export const BLOCK_END = '<!-- veritas:end -->';

export function agentsBlock(): string {
  return `${BLOCK_START}
## Convenções (Veritas)

Antes de mudar código, leia \`.veritas/INDEX.md\` e a skill da área que vai mexer.
As convenções estão em português e valem para código novo; em código que já existe,
siga \`.veritas/projeto-existente/SKILL.md\` quando ela estiver lá.
${BLOCK_END}`;
}

/** Insere ou troca o bloco do Veritas sem tocar no resto do arquivo. */
export function upsertBlock(current: string, block: string): string {
  const start = current.indexOf(BLOCK_START);
  const end = current.indexOf(BLOCK_END);
  if (start !== -1 && end > start) return current.slice(0, start) + block + current.slice(end + BLOCK_END.length);
  if (current.trim() === '') return block + '\n';
  return current.replace(/\s*$/, '\n\n') + block + '\n';
}

/** Só a pasta .veritas/ (skills, INDEX.md, VERSION). A extensão do editor usa esta parte sozinha. */
export function writeConventions(dir: string, skills: string[], catalog: Map<string, Skill>, conventionsDir = CONVENTIONS_DIR): void {
  const out = join(dir, '.veritas');
  mkdirSync(out, { recursive: true });
  for (const s of skills) cpSync(join(conventionsDir, s), join(out, s), { recursive: true });
  writeFileSync(join(out, 'INDEX.md'), buildIndex(skills, catalog));
  writeFileSync(join(out, 'VERSION'), VERSION + '\n');
}

export function writeVeritas(dir: string, skills: string[], catalog: Map<string, Skill>, conventionsDir = CONVENTIONS_DIR): void {
  writeConventions(dir, skills, catalog, conventionsDir);
  for (const f of ['AGENTS.md', 'CLAUDE.md']) {
    const p = join(dir, f);
    writeFileSync(p, upsertBlock(readText(p), agentsBlock()));
  }
}

export function copyTemplate(stack: string, dir: string, name: string): void {
  cpSync(join(TEMPLATES_DIR, stack), dir, { recursive: true });
  // npm pack descarta .gitignore, então o template guarda _gitignore.
  if (existsSync(join(dir, '_gitignore'))) renameSync(join(dir, '_gitignore'), join(dir, '.gitignore'));
  const pkgPath = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = name;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

export class MissingAnswer extends Error {}

/** Em terminal não interativo, pergunta sem resposta é erro com a flag a passar. */
export async function answer<T>(given: T | undefined, flag: string, interactive: boolean, ask: () => Promise<T>): Promise<T> {
  if (given !== undefined) return given;
  if (!interactive) throw new MissingAnswer(flag);
  return ask();
}
