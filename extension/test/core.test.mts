import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  GENERATED, TARGETS, appendIgnore, applyConventions, detectStacks, fullCatalog, groupOf, ignores, installedSkills,
  isOlder, loadCatalog, resolveSkills, ruleFiles, searchItems,
} from '../src/core.mts';

const ext = (p: string) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const CONV = ext('conventions');
const PROC = ext('process');
const catalog = loadCatalog(CONV);
const dirs: string[] = [];
const tmp = (files: Record<string, string> = {}) => {
  const d = mkdtempSync(join(tmpdir(), 'veritas-ext-'));
  dirs.push(d);
  for (const [f, c] of Object.entries(files)) {
    mkdirSync(join(d, f, '..'), { recursive: true });
    writeFileSync(join(d, f), c);
  }
  return d;
};
after(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));
const read = (d: string, f: string) => readFileSync(join(d, f), 'utf8');
const frontmatter = (text: string) => /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? '';

describe('reuso da CLI', () => {
  test('detecção de stack e seleção de skills vêm da CLI', () => {
    const d = tmp({ 'package.json': JSON.stringify({ dependencies: { next: '1', react: '1' } }) });
    assert.deepEqual(detectStacks(d), ['nextjs']);
    assert.deepEqual(resolveSkills(['nextjs'], catalog, true), ['nextjs', 'principios', 'lgpd', 'atomic-design', 'cores', 'tipografia-e-espacamento', 'direcao-de-arte', 'revisao-de-design', 'projeto-existente']);
  });
  test('as skills de processo do Claude não vão para o projeto, mas aparecem no painel', () => {
    for (const s of ['clickup', 'executar-tasks', 'ajuda', 'atualizar', 'ambiente', 'buscar-skills']) {
      assert.ok(!catalog.has(s), s);
      assert.ok(existsSync(join(PROC, s, 'SKILL.md')), s);
    }
    const groups = new Map(fullCatalog(CONV, PROC).map((e) => [e.name, e.group]));
    assert.equal(groups.get('clickup'), 'processo');
    assert.equal(groups.get('vite'), 'stacks');
    assert.equal(groups.get('principios'), 'gerais');
  });
});

describe('arquivos de regra por assistente', () => {
  const skills = ['vite', 'principios'];
  const byPath = (t: (typeof TARGETS)[number]) => new Map(ruleFiles(t, skills, catalog).map((f) => [f.path, f]));

  test('Cursor: .mdc, índice sempre aplicado, uma regra por skill pela description', () => {
    const files = byPath('cursor');
    assert.deepEqual([...files.keys()], ['.cursor/rules/veritas-index.mdc', '.cursor/rules/veritas-vite.mdc', '.cursor/rules/veritas-principios.mdc']);
    assert.match(frontmatter(files.get('.cursor/rules/veritas-index.mdc')!.content), /^alwaysApply: true$/m);
    const vite = files.get('.cursor/rules/veritas-vite.mdc')!.content;
    const fm = frontmatter(vite);
    assert.match(fm, /^alwaysApply: false$/m);
    assert.doesNotMatch(fm, /globs/);
    const desc = JSON.parse(/^description: (.*)$/m.exec(fm)![1]);
    assert.equal(desc, catalog.get('vite')!.description);
    assert.ok(vite.includes(GENERATED));
    assert.match(vite, /\.veritas\/vite\/SKILL\.md/);
  });
  test('Copilot: bloco no copilot-instructions.md e .instructions.md com description', () => {
    const files = byPath('copilot');
    assert.ok(files.get('.github/copilot-instructions.md')!.shared);
    assert.match(files.get('.github/copilot-instructions.md')!.content, /<!-- veritas:start -->[\s\S]*\.veritas\/INDEX\.md[\s\S]*<!-- veritas:end -->/);
    assert.match(frontmatter(files.get('.github/instructions/veritas-vite.instructions.md')!.content), /^description: "/m);
  });
  test('Windsurf: trigger always_on no índice e model_decision nas skills', () => {
    const files = byPath('windsurf');
    assert.match(frontmatter(files.get('.windsurf/rules/veritas-index.md')!.content), /^trigger: always_on$/m);
    assert.match(frontmatter(files.get('.windsurf/rules/veritas-vite.md')!.content), /^trigger: model_decision$/m);
  });
  test('Cline e Roo: só o índice, sem frontmatter (sempre ativo), com as descrições', () => {
    for (const [t, path] of [['cline', '.clinerules/veritas-index.md'], ['roo', '.roo/rules/veritas-index.md']] as const) {
      const files = ruleFiles(t, skills, catalog);
      assert.deepEqual(files.map((f) => f.path), [path]);
      assert.ok(files[0].content.startsWith(GENERATED));
      assert.ok(files[0].content.includes(catalog.get('vite')!.description));
    }
  });
  test('Cline: .clinerules em arquivo único antigo faz usar .cline/rules/', () => {
    const d = tmp({ '.clinerules': 'regra antiga do usuário\n' });
    assert.equal(ruleFiles('cline', skills, catalog, d)[0].path, '.cline/rules/veritas-index.md');
  });
  test('Continue: name obrigatório, índice alwaysApply e skills por description', () => {
    const files = byPath('continue');
    assert.match(frontmatter(files.get('.continue/rules/veritas-index.md')!.content), /^name: Veritas\nalwaysApply: true$/m);
    const fm = frontmatter(files.get('.continue/rules/veritas-vite.md')!.content);
    assert.match(fm, /^name: "Veritas: vite"$/m);
    assert.match(fm, /^alwaysApply: false$/m);
  });
  test('Claude, AGENTS.md e Gemini: o mesmo bloco delimitado da CLI', () => {
    for (const [t, path] of [['claude', 'CLAUDE.md'], ['agents', 'AGENTS.md'], ['gemini', 'GEMINI.md']] as const) {
      const [f] = ruleFiles(t, skills, catalog);
      assert.equal(f.path, path);
      assert.ok(f.shared);
    }
  });
});

describe('applyConventions', () => {
  test('escreve tudo, é idempotente e não toca no que é do usuário', () => {
    const d = tmp({
      'package.json': JSON.stringify({ dependencies: { react: '1' }, devDependencies: { vite: '1' } }),
      'AGENTS.md': '# Regras da casa\n',
      '.github/copilot-instructions.md': 'Use pnpm.\n',
      '.cursor/rules/minha-regra.mdc': '---\nalwaysApply: true\n---\nminha\n',
      '.cursor/rules/veritas-vite.mdc': 'escrito à mão, sem a marca\n',
    });
    const skills = resolveSkills(detectStacks(d), catalog, true);
    const first = applyConventions(d, skills, catalog, TARGETS, CONV);
    assert.deepEqual(first.skipped, ['.cursor/rules/veritas-vite.mdc']);
    assert.equal(read(d, '.cursor/rules/veritas-vite.mdc'), 'escrito à mão, sem a marca\n');
    assert.ok(read(d, 'AGENTS.md').startsWith('# Regras da casa\n'));
    assert.ok(read(d, '.github/copilot-instructions.md').startsWith('Use pnpm.\n'));
    assert.ok(existsSync(join(d, '.cursor/rules/minha-regra.mdc')));
    for (const f of ['.veritas/INDEX.md', '.veritas/VERSION', '.veritas/vite/SKILL.md', '.windsurf/rules/veritas-index.md', '.clinerules/veritas-index.md', '.roo/rules/veritas-index.md', '.continue/rules/veritas-lgpd.md', 'CLAUDE.md', 'GEMINI.md']) {
      assert.ok(existsSync(join(d, f)), f);
    }
    const snapshot = (f: string) => read(d, f);
    const before = ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md', '.cursor/rules/veritas-index.mdc'].map(snapshot);
    applyConventions(d, skills, catalog, TARGETS, CONV);
    assert.deepEqual(['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md', '.cursor/rules/veritas-index.mdc'].map(snapshot), before);
    assert.equal(read(d, 'AGENTS.md').split('veritas:start').length, 2);
  });

  test('tirar uma skill apaga a pasta e as regras geradas dela', () => {
    const d = tmp();
    applyConventions(d, ['python', 'lgpd'], catalog, ['cursor', 'windsurf'], CONV);
    assert.ok(existsSync(join(d, '.cursor/rules/veritas-lgpd.mdc')));
    const r = applyConventions(d, ['python'], catalog, ['cursor', 'windsurf'], CONV);
    assert.deepEqual(installedSkills(d), ['python']);
    assert.ok(!existsSync(join(d, '.cursor/rules/veritas-lgpd.mdc')));
    assert.ok(!existsSync(join(d, '.windsurf/rules/veritas-lgpd.md')));
    assert.ok(r.removed.includes('.veritas/lgpd'));
    assert.doesNotMatch(read(d, '.veritas/INDEX.md'), /lgpd/);
  });

  test('veritas.targets limita os assistentes escritos', () => {
    const d = tmp();
    applyConventions(d, ['python'], catalog, ['agents'], CONV);
    assert.ok(existsSync(join(d, 'AGENTS.md')));
    for (const f of ['CLAUDE.md', '.cursor', '.github', '.windsurf', '.clinerules', '.roo', '.continue', 'GEMINI.md']) assert.ok(!existsSync(join(d, f)), f);
  });
});

describe('utilitários', () => {
  test('isOlder compara versões numericamente', () => {
    assert.ok(isOlder('0.1.0', '0.2.0'));
    assert.ok(isOlder('0.9.0', '0.10.0'));
    assert.ok(!isOlder('0.1.0', '0.1.0'));
    assert.ok(!isOlder('1.0.0', '0.9.9'));
  });
  test('groupOf lê stacks: [todas]', () => {
    assert.equal(groupOf('---\nmetadata:\n  stacks: [todas]\n---', false), 'gerais');
    assert.equal(groupOf('---\nmetadata:\n  stacks: [vite, react]\n---', false), 'stacks');
    assert.equal(groupOf('', true), 'processo');
  });
  test('gitignore: detecta graphify-out com e sem barras e acrescenta sem quebrar a última linha', () => {
    assert.ok(ignores('node_modules\ngraphify-out/\n', 'graphify-out'));
    assert.ok(ignores('/graphify-out', 'graphify-out/'));
    assert.ok(!ignores('graphify-out-old\n', 'graphify-out'));
    assert.equal(appendIgnore('dist', 'graphify-out/'), 'dist\ngraphify-out/\n');
    assert.equal(appendIgnore('', 'graphify-out/'), 'graphify-out/\n');
  });
  test('busca cobre nome, descrição e títulos dos .md', () => {
    const items = searchItems(fullCatalog(CONV, PROC));
    assert.ok(items.some((i) => i.skill === 'vite' && i.description));
    assert.ok(items.some((i) => i.skill === 'python' && i.file.endsWith('architecture.md') && i.heading));
  });
});

describe('l10n', () => {
  test('toda string de vscode.l10n.t tem tradução em inglês', () => {
    const src = readFileSync(ext('src/extension.ts'), 'utf8');
    const en = JSON.parse(readFileSync(ext('l10n/bundle.l10n.en.json'), 'utf8'));
    const keys = [...src.matchAll(/\bt\('((?:[^'\\]|\\.)+)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
    assert.ok(keys.length > 20);
    for (const k of keys) assert.ok(k in en, k);
  });
  test('package.nls.json e package.nls.en.json têm as mesmas chaves, e todas são usadas', () => {
    const pt = JSON.parse(readFileSync(ext('package.nls.json'), 'utf8'));
    const en = JSON.parse(readFileSync(ext('package.nls.en.json'), 'utf8'));
    assert.deepEqual(Object.keys(en).sort(), Object.keys(pt).sort());
    const pkg = readFileSync(ext('package.json'), 'utf8');
    for (const k of Object.keys(pt)) assert.ok(pkg.includes(`%${k}%`), k);
  });
});
