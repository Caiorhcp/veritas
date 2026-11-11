// Copia para dentro da extensão o que ela distribui: as convenções (pela mesma seleção da CLI),
// as skills de processo do Claude (só para o painel) e os templates de projeto da CLI.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const plugin = here('../plugin/skills');

if (!existsSync(plugin)) {
  if (existsSync(here('conventions'))) process.exit(0); // fora do monorepo: usa a cópia que já existe
  console.error('plugin/skills não encontrado e conventions/ não existe.');
  process.exit(1);
}
execFileSync(process.execPath, [here('../cli/scripts/copy-conventions.mjs')], { stdio: 'inherit' });
for (const d of ['conventions', 'process', 'templates']) rmSync(here(d), { recursive: true, force: true });
cpSync(here('../cli/conventions'), here('conventions'), { recursive: true });
cpSync(here('../cli/templates'), here('templates'), { recursive: true });

const conventions = new Set(readdirSync(here('conventions')));
const processSkills = readdirSync(plugin, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !conventions.has(e.name) && existsSync(`${plugin}/${e.name}/SKILL.md`))
  .map((e) => e.name);
for (const s of processSkills) cpSync(`${plugin}/${s}`, here(`process/${s}`), { recursive: true });
console.log(`process/: ${processSkills.join(', ')}\ntemplates/: ${readdirSync(here('templates')).join(', ')}`);
