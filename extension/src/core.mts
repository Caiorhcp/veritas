// Lógica pura da extensão (sem `vscode`), testada com node:test. A detecção de stack, a escolha
// de skills, o INDEX.md e o bloco do AGENTS.md vêm da CLI, para os dois nunca divergirem.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { VERSION, agentsBlock, loadCatalog, upsertBlock, writeConventions, type Skill } from '../../cli/src/lib.ts';

export { VERSION, detectStacks, loadCatalog, resolveSkills, copyTemplate, upsertBlock } from '../../cli/src/lib.ts';
export type { Skill } from '../../cli/src/lib.ts';

export const TARGETS = ['cursor', 'copilot', 'windsurf', 'cline', 'roo', 'continue', 'claude', 'agents', 'gemini'] as const;
export type Target = (typeof TARGETS)[number];

/** Marca dos arquivos que a extensão gerencia por inteiro. Sem ela, o arquivo é do usuário e não é tocado. */
export const GENERATED = '<!-- veritas:generated — gerado pela extensão Veritas; reescrito ao reaplicar. Não edite. -->';
const PREFIX = 'veritas-';

const readText = (p: string) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const q = (s: string) => JSON.stringify(s); // string YAML entre aspas duplas: aguenta ":", "`" e aspas

export interface RuleFile {
  path: string; // relativo à raiz do projeto, com "/"
  content: string;
  shared?: boolean; // arquivo do usuário: só o bloco <!-- veritas:start/end --> é nosso
}

const skillPath = (s: string) => `.veritas/${s}/SKILL.md`;

function indexBody(skills: string[], catalog: Map<string, Skill>): string {
  const rows = skills.map((s) => `- \`${skillPath(s)}\`: ${catalog.get(s)?.description ?? ''}`);
  return `# Convenções do projeto (Veritas)

Antes de mudar código, leia \`.veritas/INDEX.md\` e a skill da área que vai mexer.
As convenções estão em português e valem para código novo; em código que já existe,
siga \`.veritas/projeto-existente/SKILL.md\` quando ela estiver lá.

Skills instaladas (leia o arquivo quando a tarefa bater com a descrição):

${rows.join('\n')}
`;
}

// `ref` muda como o arquivo é citado: o Cursor entende `@caminho` como "leia este arquivo".
const skillBody = (s: string, ref = `\`${skillPath(s)}\``) =>
  `Leia ${ref} antes de mexer no código desta área e siga o que ele diz.
Os arquivos .md ao lado dele (em \`.veritas/${s}/\`) detalham o assunto; abra o que o SKILL.md citar.
`;

const fm = (lines: string[]) => `---\n${lines.join('\n')}\n---\n${GENERATED}\n\n`;
const plain = (body: string) => `${GENERATED}\n\n${body}`;

/** Arquivos de regra de um assistente, no formato nativo dele. */
export function ruleFiles(target: Target, skills: string[], catalog: Map<string, Skill>, root = ''): RuleFile[] {
  const desc = (s: string) => catalog.get(s)?.description ?? s;
  const index = indexBody(skills, catalog);
  switch (target) {
    case 'cursor': // https://cursor.com/docs/rules — .mdc; description sem globs = "Apply Intelligently"
      return [
        { path: `.cursor/rules/${PREFIX}index.mdc`, content: fm(['description: "Convenções do Veritas: índice"', 'alwaysApply: true']) + index },
        ...skills.map((s) => ({ path: `.cursor/rules/${PREFIX}${s}.mdc`, content: fm([`description: ${q(desc(s))}`, 'alwaysApply: false']) + skillBody(s, `@${skillPath(s)}`) })),
      ];
    case 'copilot': // https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
      return [
        { path: '.github/copilot-instructions.md', content: agentsBlock(), shared: true },
        // shortcut: sem applyTo, só o VS Code (sessão Local) carrega por description; o bloco acima cobre o resto.
        ...skills.map((s) => ({ path: `.github/instructions/${PREFIX}${s}.instructions.md`, content: fm([`description: ${q(desc(s))}`]) + skillBody(s) })),
      ];
    case 'windsurf': // https://docs.devin.ai/cli/extensibility/rules.md — trigger: always_on | model_decision | glob | manual
      return [
        { path: `.windsurf/rules/${PREFIX}index.md`, content: fm(['trigger: always_on', 'description: "Convenções do Veritas: índice"']) + index },
        ...skills.map((s) => ({ path: `.windsurf/rules/${PREFIX}${s}.md`, content: fm(['trigger: model_decision', `description: ${q(desc(s))}`]) + skillBody(s) })),
      ];
    case 'cline': {
      // https://docs.cline.bot/customization/cline-rules — sem frontmatter = sempre ativo. O único condicional
      // é `paths`, então vai só o índice (com as descrições) para não carregar toda skill em todo pedido.
      // Um `.clinerules` antigo em arquivo único ocupa o nome da pasta; aí usamos `.cline/rules/`, também documentado.
      const legacy = root !== '' && existsSync(join(root, '.clinerules')) && !statSync(join(root, '.clinerules')).isDirectory();
      return [{ path: `${legacy ? '.cline/rules' : '.clinerules'}/${PREFIX}index.md`, content: plain(index) }];
    }
    case 'roo': // https://docs.roocode.com/features/custom-instructions — .roo/rules/ é lido inteiro, sempre
      return [{ path: `.roo/rules/${PREFIX}index.md`, content: plain(index) }];
    case 'continue': // https://docs.continue.dev/customize/deep-dives/rules
      return [
        { path: `.continue/rules/${PREFIX}index.md`, content: fm(['name: Veritas', 'alwaysApply: true']) + index },
        ...skills.map((s) => ({ path: `.continue/rules/${PREFIX}${s}.md`, content: fm([`name: ${q('Veritas: ' + s)}`, `description: ${q(desc(s))}`, 'alwaysApply: false']) + skillBody(s) })),
      ];
    case 'claude':
      return [{ path: 'CLAUDE.md', content: agentsBlock(), shared: true }];
    case 'agents':
      return [{ path: 'AGENTS.md', content: agentsBlock(), shared: true }];
    case 'gemini': // https://geminicli.com/docs/cli/gemini-md/
      return [{ path: 'GEMINI.md', content: agentsBlock(), shared: true }];
  }
}

/** Pastas onde a extensão é dona dos arquivos `veritas-*` marcados. */
const OWNED_DIRS: Partial<Record<Target, string[]>> = {
  cursor: ['.cursor/rules'],
  copilot: ['.github/instructions'],
  windsurf: ['.windsurf/rules'],
  cline: ['.clinerules', '.cline/rules'],
  roo: ['.roo/rules'],
  continue: ['.continue/rules'],
};

export const isGenerated = (text: string) => text.includes(GENERATED);

export interface ApplyResult {
  written: string[];
  removed: string[];
  skipped: string[]; // arquivos com o nosso nome mas sem a marca: são do usuário
}

/** Skills instaladas em `.veritas/` (pastas com SKILL.md). */
export function installedSkills(root: string): string[] {
  const dir = join(root, '.veritas');
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(dir, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort();
}

/**
 * Escreve `.veritas/` e as regras de cada assistente. Reaplicar é idempotente: arquivos próprios
 * (com a marca) são reescritos ou apagados; arquivos compartilhados só têm o bloco trocado.
 */
export function applyConventions(root: string, skills: string[], catalog: Map<string, Skill>, targets: readonly Target[], conventionsDir: string): ApplyResult {
  const result: ApplyResult = { written: [], removed: [], skipped: [] };
  // Skill que saiu da lista sai de .veritas/; pastas que não são skills conhecidas ficam.
  for (const s of installedSkills(root)) {
    if (catalog.has(s) && !skills.includes(s)) {
      rmSync(join(root, '.veritas', s), { recursive: true, force: true });
      result.removed.push(`.veritas/${s}`);
    }
  }
  writeConventions(root, skills, catalog, conventionsDir);
  result.written.push('.veritas/');

  for (const target of targets) {
    const files = ruleFiles(target, skills, catalog, root);
    const keep = new Set(files.map((f) => f.path));
    for (const rel of OWNED_DIRS[target] ?? []) {
      const dir = join(root, rel);
      if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
      for (const name of readdirSync(dir)) {
        const p = `${rel}/${name}`;
        if (name.startsWith(PREFIX) && !keep.has(p) && isGenerated(readText(join(root, p)))) {
          unlinkSync(join(root, p));
          result.removed.push(p);
        }
      }
    }
    for (const f of files) {
      const abs = join(root, f.path);
      const current = readText(abs);
      if (!f.shared && current !== '' && !isGenerated(current)) {
        result.skipped.push(f.path);
        continue;
      }
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, f.shared ? upsertBlock(current, f.content) : f.content);
      result.written.push(f.path);
    }
  }
  return result;
}

/** Versão de `.veritas/VERSION`, ou '' se não houver. */
export const projectVersion = (root: string) => readText(join(root, '.veritas', 'VERSION')).trim();

/** a < b em semver simples (x.y.z); pré-release é ignorado. */
export function isOlder(a: string, b: string): boolean {
  const pa = a.split(/[.-]/).map(Number);
  const pb = b.split(/[.-]/).map(Number);
  for (let i = 0; i < 3; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x < y;
  }
  return false;
}

export type Group = 'stacks' | 'gerais' | 'processo';

/** Stacks: skills com lista de stacks própria; Gerais: `stacks: [todas]`; Processo: só do Claude. */
export function groupOf(skillMd: string, isProcess: boolean): Group {
  if (isProcess) return 'processo';
  return /^\s+stacks:.*\btodas\b/m.test(skillMd) ? 'gerais' : 'stacks';
}

export interface CatalogEntry extends Skill {
  dir: string;
  group: Group;
  files: string[]; // .md da pasta, SKILL.md primeiro
}

const mdFiles = (dir: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => (a === 'SKILL.md' ? -1 : b === 'SKILL.md' ? 1 : a.localeCompare(b)));

/** Tudo o que vai no painel: convenções (gravam no projeto) + skills de processo (só leitura). */
export function fullCatalog(conventionsDir: string, processDir: string): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [dir, isProcess] of [[conventionsDir, false], [processDir, true]] as const) {
    if (!existsSync(dir)) continue;
    for (const skill of loadCatalog(dir).values()) {
      const d = join(dir, skill.name);
      out.push({ ...skill, dir: d, group: groupOf(readText(join(d, 'SKILL.md')), isProcess), files: mdFiles(d) });
    }
  }
  return out;
}

export interface SearchItem {
  skill: string;
  file: string;
  heading?: string;
  description?: string;
}

/** Itens da busca: uma linha por skill (com a descrição) e uma por título de cada .md. */
export function searchItems(catalog: CatalogEntry[]): SearchItem[] {
  const items: SearchItem[] = [];
  for (const e of catalog) {
    items.push({ skill: e.name, file: join(e.dir, 'SKILL.md'), description: e.description });
    for (const f of e.files) {
      const text = readText(join(e.dir, f)).replace(/^---[\s\S]*?\n---/, '').replace(/```[\s\S]*?```/g, '');
      for (const m of text.matchAll(/^#{1,4}\s+(.+)$/gm)) items.push({ skill: e.name, file: join(e.dir, f), heading: m[1].trim() });
    }
  }
  return items;
}

/** O .gitignore já ignora `entry` (com ou sem barra inicial/final)? */
export function ignores(gitignore: string, entry: string): boolean {
  const bare = entry.replace(/^\/|\/$/g, '');
  return gitignore.split(/\r?\n/).some((l) => l.trim().replace(/^\/|\/$/g, '') === bare);
}

export const appendIgnore = (gitignore: string, entry: string) =>
  (gitignore === '' || gitignore.endsWith('\n') ? gitignore : gitignore + '\n') + entry + '\n';

/** Nome de pacote a partir do nome da pasta, como na CLI. */
export const packageName = (folder: string) => folder.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
