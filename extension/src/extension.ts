import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import * as vscode from 'vscode';
import {
  TARGETS, VERSION, appendIgnore, applyConventions, copyTemplate, detectStacks, fullCatalog, ignores, installedSkills,
  isOlder, loadCatalog, packageName, projectVersion, resolveSkills, searchItems,
  type CatalogEntry, type Group, type Skill, type Target,
} from './core.mts';

const t = vscode.l10n.t;
const PROMPT_KEY = 'veritas.promptDismissed';
const GRAPH_DIR = 'graphify-out';

let conventionsDir = '';
let processDir = '';
let templatesDir = '';
let catalog = new Map<string, Skill>(); // só as convenções que podem ir para o projeto
let panelCatalog: CatalogEntry[] = [];

// ---------- raiz do projeto ----------

function currentRoot(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders?.length) return undefined;
  const active = vscode.window.activeTextEditor?.document.uri;
  const folder = (active && vscode.workspace.getWorkspaceFolder(active)) ?? folders[0];
  return folder.uri.fsPath;
}

async function pickRoot(): Promise<string | undefined> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders?.length) {
    vscode.window.showWarningMessage(t('Abra uma pasta de projeto primeiro.'));
    return undefined;
  }
  if (folders.length === 1) return folders[0].uri.fsPath;
  return (await vscode.window.showWorkspaceFolderPick())?.uri.fsPath;
}

const configuredTargets = (): Target[] => {
  const v = vscode.workspace.getConfiguration('veritas').get<string[]>('targets') ?? [...TARGETS];
  return v.filter((x): x is Target => (TARGETS as readonly string[]).includes(x));
};

// ---------- aplicar convenções ----------

async function chooseSkills(root: string, preselected: string[]): Promise<string[] | undefined> {
  const items = [...catalog.values()].map((s) => ({ label: s.name, description: s.escopo, detail: s.description, picked: preselected.includes(s.name) }));
  items.sort((a, b) => Number(b.picked) - Number(a.picked) || a.label.localeCompare(b.label));
  const picked = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    title: t('Convenções para {0}', basename(root)),
    placeHolder: t('Confirme ou ajuste as convenções que vão para .veritas/'),
    matchOnDetail: true,
  });
  if (!picked) return undefined;
  if (picked.length === 0) {
    vscode.window.showWarningMessage(t('Nenhuma convenção escolhida.'));
    return undefined;
  }
  return picked.map((p) => p.label);
}

function apply(root: string, skills: string[]): void {
  const targets = configuredTargets();
  const r = applyConventions(root, skills, catalog, targets, conventionsDir);
  const msg = t('Veritas: {0} convenções aplicadas para {1} assistentes.', skills.length, targets.length);
  if (r.skipped.length) vscode.window.showWarningMessage(msg + ' ' + t('Arquivos seus não foram tocados: {0}', r.skipped.join(', ')));
  else vscode.window.showInformationMessage(msg);
  refreshAll();
}

async function cmdApply(): Promise<void> {
  const root = await pickRoot();
  if (!root) return;
  const installed = installedSkills(root);
  const defaults = installed.length ? installed : resolveSkills(detectStacks(root), catalog, true); // projeto aberto = projeto existente, como no `init` da CLI
  const skills = await chooseSkills(root, defaults);
  if (skills) apply(root, skills);
}

async function cmdUpdate(): Promise<void> {
  const root = await pickRoot();
  if (!root) return;
  const skills = installedSkills(root).filter((s) => catalog.has(s));
  if (!skills.length) return cmdApply();
  apply(root, skills);
}

async function setSkill(entry: SkillNode | undefined, add: boolean): Promise<void> {
  const root = await pickRoot();
  if (!root || !entry) return;
  const current = installedSkills(root).filter((s) => catalog.has(s));
  const next = add ? [...new Set([...current, entry.entry.name])] : current.filter((s) => s !== entry.entry.name);
  if (!add && next.length === 0) {
    vscode.window.showWarningMessage(t('Essa é a última convenção do projeto. Para tirar o Veritas, apague .veritas/.'));
    return;
  }
  apply(root, next);
}

async function maybePrompt(context: vscode.ExtensionContext): Promise<void> {
  if (!vscode.workspace.getConfiguration('veritas').get<boolean>('promptOnOpen', true)) return;
  if (context.workspaceState.get<boolean>(PROMPT_KEY)) return;
  const root = currentRoot();
  if (!root || existsSync(join(root, '.veritas'))) return;
  const stacks = detectStacks(root);
  if (!stacks.length) return;
  const yes = t('Aplicar');
  const later = t('Agora não');
  const never = t('Não perguntar neste projeto');
  const choice = await vscode.window.showInformationMessage(t('Veritas: projeto {0} sem convenções. Escrever .veritas/ e as regras dos assistentes de IA?', stacks.join(' + ')), yes, later, never);
  if (choice === yes) return cmdApply();
  if (choice === never) await context.workspaceState.update(PROMPT_KEY, true);
}

// ---------- novo projeto ----------

async function cmdNewProject(): Promise<void> {
  const stacks = readdirSync(templatesDir).sort();
  const stack = await vscode.window.showQuickPick(stacks, { title: t('Novo projeto Veritas'), placeHolder: t('Stack do projeto') });
  if (!stack) return;
  const parent = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, openLabel: t('Criar aqui'), title: t('Pasta onde o projeto vai ser criado') });
  if (!parent?.[0]) return;
  const name = await vscode.window.showInputBox({
    title: t('Novo projeto Veritas'),
    prompt: t('Nome do projeto'),
    validateInput: (v) => {
      if (!v.trim()) return t('O projeto precisa de um nome.');
      const d = join(parent[0].fsPath, v.trim());
      return existsSync(d) && readdirSync(d).length > 0 ? t('A pasta {0} já existe e não está vazia.', d) : undefined;
    },
  });
  if (!name) return;
  const dir = join(parent[0].fsPath, name.trim());
  copyTemplate(stack, dir, packageName(basename(dir)));
  applyConventions(dir, resolveSkills([stack], catalog, false), catalog, configuredTargets(), conventionsDir);

  const install = t('Rodar npm install');
  const open = t('Abrir pasta');
  const choice = await vscode.window.showInformationMessage(t('Projeto criado em {0}.', dir), install, open);
  if (choice === install) {
    const term = vscode.window.createTerminal({ name: 'Veritas: npm install', cwd: dir });
    term.show();
    term.sendText('npm install');
    const again = await vscode.window.showInformationMessage(t('O npm install está rodando no terminal. Abrir a pasta do projeto?'), open);
    if (again !== open) return;
  } else if (choice !== open) return;
  await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(dir), { forceNewWindow: true });
}

// ---------- Graphify ----------

function graphifyInstalled(): boolean {
  // shell no Windows: o graphify instalado pelo uv/pip é um .exe/.cmd no PATH; args fixos.
  return spawnSync('graphify', ['--version'], { shell: process.platform === 'win32', timeout: 15000 }).status === 0;
}

async function ensureGraphify(): Promise<boolean> {
  if (graphifyInstalled()) return true;
  const uv = 'uv tool install graphifyy';
  const pip = 'pip install graphifyy';
  const docs = t('Ver o Graphify');
  const choice = await vscode.window.showWarningMessage(
    t('O Graphify não está instalado (CLI "graphify" fora do PATH). Ele monta o grafo do código localmente, sem modelo de IA. Quer rodar o comando de instalação num terminal?'),
    { modal: true },
    uv, pip, docs,
  );
  if (choice === docs) vscode.env.openExternal(vscode.Uri.parse('https://github.com/Graphify-Labs/graphify'));
  else if (choice) runInTerminal(currentRoot(), choice, 'Graphify');
  return false;
}

function runInTerminal(cwd: string | undefined, command: string, name: string): void {
  const term = vscode.window.createTerminal({ name, cwd });
  term.show();
  term.sendText(command);
}

async function ensureIgnored(root: string): Promise<void> {
  const file = join(root, '.gitignore');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (ignores(text, GRAPH_DIR)) return;
  const add = t('Adicionar');
  const choice = await vscode.window.showInformationMessage(t('O grafo não costuma ir para o git. Adicionar {0}/ ao .gitignore?', GRAPH_DIR), add, t('Não'));
  if (choice === add) writeFileSync(file, appendIgnore(text, `${GRAPH_DIR}/`));
}

async function cmdGraphBuild(): Promise<void> {
  const root = await pickRoot();
  if (!root || !(await ensureGraphify())) return;
  const codeOnly = { label: t('Só o código'), description: t('recomendado'), detail: t('Local, sem modelo de IA e sem custo de tokens.'), cmd: 'graphify extract . --code-only' };
  const withDocs = { label: t('Código e documentos'), detail: t('Documentos, PDFs e imagens passam por um modelo de IA configurado (chave de API): custa tempo e tokens.'), cmd: 'graphify extract .' };
  const pick = await vscode.window.showQuickPick([codeOnly, withDocs], { title: t('Montar grafo do código') });
  if (!pick) return;
  await ensureIgnored(root);
  runInTerminal(root, pick.cmd, 'Graphify');
}

async function cmdGraphUpdate(): Promise<void> {
  const root = await pickRoot();
  if (!root || !(await ensureGraphify())) return;
  if (!existsSync(join(root, GRAPH_DIR, 'graph.json'))) return cmdGraphBuild();
  runInTerminal(root, 'graphify update .', 'Graphify');
}

async function cmdGraphOpen(): Promise<void> {
  const root = await pickRoot();
  if (!root) return;
  const html = join(root, GRAPH_DIR, 'graph.html');
  const report = join(root, GRAPH_DIR, 'GRAPH_REPORT.md');
  if (!existsSync(html) && !existsSync(report)) {
    const build = t('Montar grafo');
    if ((await vscode.window.showInformationMessage(t('Ainda não há grafo neste projeto.'), build)) === build) return cmdGraphBuild();
    return;
  }
  if (existsSync(report)) await vscode.window.showTextDocument(vscode.Uri.file(report), { preview: true });
  if (existsSync(html)) await vscode.env.openExternal(vscode.Uri.file(html));
}

// ---------- painel ----------

const GROUPS: Group[] = ['stacks', 'gerais', 'processo'];
const groupLabel = (g: Group) => ({ stacks: t('Stacks'), gerais: t('Gerais'), processo: t('Processo (Claude)') })[g];

class GroupNode {
  group: Group;
  constructor(group: Group) {
    this.group = group;
  }
}
class SkillNode {
  entry: CatalogEntry;
  active: boolean;
  constructor(entry: CatalogEntry, active: boolean) {
    this.entry = entry;
    this.active = active;
  }
}
class FileNode {
  entry: CatalogEntry;
  file: string;
  path: string;
  constructor(entry: CatalogEntry, file: string, path: string) {
    this.entry = entry;
    this.file = file;
    this.path = path;
  }
}
type Node = GroupNode | SkillNode | FileNode;

/** O arquivo da cópia do projeto quando existe; senão, o que vem na extensão. */
function resolveFile(entry: CatalogEntry, file: string): string {
  const root = currentRoot();
  const local = root && join(root, '.veritas', entry.name, file);
  return local && existsSync(local) ? local : join(entry.dir, file);
}

class SkillsTree implements vscode.TreeDataProvider<Node> {
  private emitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.emitter.event;
  refresh = () => this.emitter.fire();

  getChildren(node?: Node): Node[] {
    if (!node) return GROUPS.filter((g) => panelCatalog.some((e) => e.group === g)).map((g) => new GroupNode(g));
    if (node instanceof GroupNode) {
      const root = currentRoot();
      const active = new Set(root ? installedSkills(root) : []);
      return panelCatalog.filter((e) => e.group === node.group).map((e) => new SkillNode(e, active.has(e.name)));
    }
    if (node instanceof SkillNode) return node.entry.files.map((f) => new FileNode(node.entry, f, resolveFile(node.entry, f)));
    return [];
  }

  getTreeItem(node: Node): vscode.TreeItem {
    if (node instanceof GroupNode) {
      const item = new vscode.TreeItem(groupLabel(node.group), vscode.TreeItemCollapsibleState.Expanded);
      item.contextValue = 'group';
      return item;
    }
    if (node instanceof SkillNode) {
      const { entry, active } = node;
      const item = new vscode.TreeItem(entry.name, vscode.TreeItemCollapsibleState.Collapsed);
      item.description = entry.group === 'processo' ? t('só no Claude') : active ? t('no projeto') : '';
      item.tooltip = new vscode.MarkdownString(`**${entry.name}**\n\n${entry.description}`);
      item.iconPath = new vscode.ThemeIcon(entry.group === 'processo' ? 'lock' : active ? 'pass-filled' : 'circle-large-outline');
      item.contextValue = entry.group === 'processo' ? 'skill.process' : active ? 'skill.active' : 'skill.inactive';
      return item;
    }
    const item = new vscode.TreeItem(node.file, vscode.TreeItemCollapsibleState.None);
    item.resourceUri = vscode.Uri.file(node.path);
    item.iconPath = new vscode.ThemeIcon('markdown');
    item.command = { command: 'veritas.openFile', title: t('Abrir'), arguments: [node.path] };
    return item;
  }
}

const openPreview = (path: string) => vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(path));

async function cmdSearch(): Promise<void> {
  const items = searchItems(panelCatalog).map((i) => ({
    label: i.heading ? `$(symbol-key) ${i.heading}` : `$(book) ${i.skill}`,
    description: i.heading ? `${i.skill}/${basename(i.file)}` : '',
    detail: i.description,
    path: i.file,
    skill: i.skill,
  }));
  const pick = await vscode.window.showQuickPick(items, { title: t('Buscar convenção'), placeHolder: t('Nome, descrição ou título'), matchOnDescription: true, matchOnDetail: true });
  if (!pick) return;
  const entry = panelCatalog.find((e) => e.name === pick.skill);
  openPreview(entry ? resolveFile(entry, basename(pick.path)) : pick.path);
}

// ---------- barra de status ----------

let statusConventions: vscode.StatusBarItem;
let statusGraph: vscode.StatusBarItem;
let tree: SkillsTree;

function age(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min < 60) return t('há {0} min', min);
  const h = Math.round(min / 60);
  return h < 48 ? t('há {0} h', h) : t('há {0} dias', Math.round(h / 24));
}

function refreshStatus(): void {
  const root = currentRoot();
  const version = root ? projectVersion(root) : '';
  if (!root || !version) statusConventions.hide();
  else {
    const outdated = isOlder(version, VERSION);
    statusConventions.text = outdated ? `$(warning) ${t('Veritas: desatualizado')}` : `$(check) ${t('Veritas ✓ {0} convenções', installedSkills(root).length)}`;
    statusConventions.tooltip = outdated ? t('Convenções {0}; a extensão traz {1}. Clique para atualizar.', version, VERSION) : t('Convenções do Veritas {0}', version);
    statusConventions.command = outdated ? 'veritas.update' : 'veritas.focus';
    statusConventions.backgroundColor = outdated ? new vscode.ThemeColor('statusBarItem.warningBackground') : undefined;
    statusConventions.show();
  }
  const graph = root && join(root, GRAPH_DIR, 'graph.json');
  if (graph && existsSync(graph)) {
    statusGraph.text = `$(type-hierarchy) ${t('Grafo {0}', age(Date.now() - statSync(graph).mtimeMs))}`;
    statusGraph.tooltip = t('Grafo do Graphify. Clique para abrir.');
    statusGraph.show();
  } else statusGraph.hide();
}

function refreshAll(): void {
  tree?.refresh();
  if (statusConventions) refreshStatus();
}

// ---------- ativação ----------

export function activate(context: vscode.ExtensionContext): void {
  conventionsDir = join(context.extensionPath, 'conventions');
  processDir = join(context.extensionPath, 'process');
  templatesDir = join(context.extensionPath, 'templates');
  catalog = loadCatalog(conventionsDir);
  panelCatalog = fullCatalog(conventionsDir, processDir);

  tree = new SkillsTree();
  statusConventions = vscode.window.createStatusBarItem('veritas.conventions', vscode.StatusBarAlignment.Left, 50);
  statusConventions.name = 'Veritas';
  statusGraph = vscode.window.createStatusBarItem('veritas.graph', vscode.StatusBarAlignment.Left, 49);
  statusGraph.name = 'Veritas: Graphify';
  statusGraph.command = 'veritas.graph.open';

  const watcher = vscode.workspace.createFileSystemWatcher('**/{.veritas/VERSION,.veritas/*/SKILL.md,graphify-out/graph.json}');
  const reg = <T extends unknown[]>(id: string, fn: (...a: T) => unknown) => vscode.commands.registerCommand(id, fn as (...a: unknown[]) => unknown);

  context.subscriptions.push(
    statusConventions,
    statusGraph,
    watcher,
    watcher.onDidCreate(refreshAll),
    watcher.onDidChange(refreshAll),
    watcher.onDidDelete(refreshAll),
    vscode.window.onDidChangeActiveTextEditor(refreshAll),
    vscode.workspace.onDidChangeWorkspaceFolders(refreshAll),
    vscode.window.registerTreeDataProvider('veritas.skills', tree),
    reg('veritas.apply', cmdApply),
    reg('veritas.update', cmdUpdate),
    reg('veritas.search', cmdSearch),
    reg('veritas.newProject', cmdNewProject),
    reg('veritas.graph.build', cmdGraphBuild),
    reg('veritas.graph.update', cmdGraphUpdate),
    reg('veritas.graph.open', cmdGraphOpen),
    reg('veritas.skill.add', (n: SkillNode) => setSkill(n, true)),
    reg('veritas.skill.remove', (n: SkillNode) => setSkill(n, false)),
    reg('veritas.openFile', (p: string) => openPreview(p)),
    reg('veritas.refresh', refreshAll),
    reg('veritas.focus', () => vscode.commands.executeCommand('veritas.skills.focus')),
  );
  refreshStatus();
  // Atualiza a idade do grafo sem depender de evento.
  const timer = setInterval(refreshStatus, 5 * 60 * 1000);
  context.subscriptions.push({ dispose: () => clearInterval(timer) });
  void maybePrompt(context);
}

export function deactivate(): void {}
