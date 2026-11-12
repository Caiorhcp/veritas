import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { agentsBlock, buildIndex, detectStacks, loadCatalog, resolveSkills, upsertBlock, writeVeritas } from '../src/lib.ts';

const CLI = fileURLToPath(new URL('../src/index.ts', import.meta.url));
const dirs: string[] = [];
const tmp = (files: Record<string, string> = {}) => {
  const d = mkdtempSync(join(tmpdir(), 'veritas-'));
  dirs.push(d);
  for (const [f, c] of Object.entries(files)) writeFileSync(join(d, f), c);
  return d;
};
after(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));
const pkg = (deps: Record<string, string>, dev: Record<string, string> = {}) =>
  JSON.stringify({ dependencies: deps, devDependencies: dev });

const catalog = loadCatalog();

describe('detectStacks', () => {
  const cases: [string, Record<string, string>, string[]][] = [
    ['vite + react', { 'package.json': pkg({ react: '1' }, { vite: '1' }) }, ['vite']],
    ['vite sem react não é a stack vite', { 'package.json': pkg({}, { vite: '1' }) }, []],
    ['next ganha de vite', { 'package.json': pkg({ next: '1', react: '1' }, { vite: '1' }) }, ['nextjs']],
    ['nestjs', { 'package.json': pkg({ '@nestjs/core': '1' }) }, ['nestjs']],
    ['expo', { 'package.json': pkg({ expo: '1' }) }, ['react-native']],
    ['hono + drizzle', { 'package.json': pkg({ hono: '1', 'drizzle-orm': '1' }) }, ['bun-hono-api']],
    ['hono sem drizzle', { 'package.json': pkg({ hono: '1' }) }, []],
    ['django por manage.py', { 'manage.py': '' }, ['django']],
    ['django no requirements', { 'requirements.txt': 'Django==5.2\n' }, ['django']],
    ['django no pyproject', { 'pyproject.toml': '[project]\ndependencies = ["django>=5", "djangorestframework"]\n' }, ['django']],
    ['python genérico', { 'pyproject.toml': '[project]\nname = "x"\n' }, ['python']],
    ['monorepo next + python', { 'package.json': pkg({ next: '1' }), 'requirements.txt': 'fastapi\n' }, ['nextjs', 'python']],
    ['pasta vazia', {}, []],
  ];
  for (const [name, files, expected] of cases) test(name, () => assert.deepEqual(detectStacks(tmp(files)), expected));
});

describe('resolveSkills', () => {
  test('front ganha as skills de interface; init ganha projeto-existente', () => {
    assert.deepEqual(resolveSkills(['vite'], catalog, false), ['vite', 'principios', 'lgpd', 'atomic-design', 'cores', 'tipografia-e-espacamento', 'direcao-de-arte', 'revisao-de-design']);
    assert.deepEqual(resolveSkills(['django'], catalog, true), ['django', 'principios', 'lgpd', 'projeto-existente']);
  });
  test('o catálogo não traz skills de processo', () => {
    for (const s of ['clickup', 'executar-tasks', 'ajuda', 'atualizar', 'ambiente', 'buscar-skills']) assert.ok(!catalog.has(s), s);
  });
});

describe('INDEX', () => {
  test('lista cada skill com a descrição do frontmatter', () => {
    const index = buildIndex(['vite', 'lgpd'], catalog);
    assert.match(index, /\| \[vite\]\(vite\/SKILL\.md\) \| Use ao criar ou revisar código em projetos React \+ Vite/);
    assert.match(index, /\| \[lgpd\]\(lgpd\/SKILL\.md\) \| Proteção de dados pessoais/);
    assert.doesNotMatch(index, /nextjs/);
  });
});

describe('bloco do AGENTS.md', () => {
  const block = agentsBlock();
  test('cria, preserva o conteúdo e é idempotente', () => {
    assert.equal(upsertBlock('', block), block + '\n');
    const original = '# Meu projeto\n\nRegras da casa.\n';
    const once = upsertBlock(original, block);
    assert.ok(once.startsWith(original));
    assert.equal(upsertBlock(once, block), once);
    assert.equal(once.split('veritas:start').length, 2);
  });
  test('troca um bloco antigo sem mexer no resto', () => {
    const old = `antes\n\n<!-- veritas:start -->\nvelho\n<!-- veritas:end -->\n\ndepois\n`;
    assert.equal(upsertBlock(old, block), `antes\n\n${block}\n\ndepois\n`);
  });
  test('writeVeritas duas vezes não duplica nada', () => {
    const d = tmp({ 'AGENTS.md': '# Já existia\n' });
    writeVeritas(d, ['python', 'principios'], catalog);
    writeVeritas(d, ['python', 'principios'], catalog);
    const agents = readFileSync(join(d, 'AGENTS.md'), 'utf8');
    assert.ok(agents.startsWith('# Já existia\n'));
    assert.equal(agents.split('veritas:start').length, 2);
    assert.ok(existsSync(join(d, 'CLAUDE.md')));
    assert.ok(existsSync(join(d, '.veritas/python/architecture.md')));
    assert.ok(existsSync(join(d, '.veritas/VERSION')));
  });
});

describe('terminal não interativo', () => {
  const run = (args: string[], cwd: string) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8', input: '' });
  test('new sem --stack falha e cita a flag', () => {
    const r = run(['new', 'app', '--no-install'], tmp());
    assert.equal(r.status, 1);
    assert.match(r.stderr, /--stack/);
  });
  test('init sem --yes falha e cita a flag, sem escrever nada', () => {
    const d = tmp({ 'manage.py': '' });
    const r = run(['init'], d);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /--yes/);
    assert.ok(!existsSync(join(d, '.veritas')));
  });
  test('init --yes escreve .veritas/', () => {
    const d = tmp({ 'manage.py': '' });
    const r = run(['init', '--yes', '--lang', 'en'], d);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(existsSync(join(d, '.veritas/django/SKILL.md')));
    assert.ok(existsSync(join(d, '.veritas/projeto-existente/SKILL.md')));
  });
  test('new --stack vite --no-install gera o template com o nome', () => {
    const d = tmp();
    const r = run(['new', 'Meu App', '--stack', 'vite', '--no-install'], d);
    assert.equal(r.status, 0, r.stderr);
    const app = join(d, 'Meu App');
    assert.equal(JSON.parse(readFileSync(join(app, 'package.json'), 'utf8')).name, 'meu-app');
    assert.ok(existsSync(join(app, '.gitignore')));
    assert.ok(existsSync(join(app, '.veritas/atomic-design/SKILL.md')));
  });
});
