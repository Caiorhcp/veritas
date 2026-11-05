// Copia ../plugin/skills para conventions/ para o pacote publicado não depender do monorepo.
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';

// Comandos do plugin do Claude: processo da casa, não convenção de projeto.
const EXCLUDED = new Set(['ajuda', 'ambiente', 'atualizar', 'buscar-skills', 'clickup', 'executar-tasks']);

const src = new URL('../../plugin/skills/', import.meta.url);
const dest = new URL('../conventions/', import.meta.url);

if (!existsSync(src)) {
  if (existsSync(dest)) process.exit(0); // fora do monorepo: usa a cópia que já existe
  console.error('plugin/skills não encontrado e conventions/ não existe.');
  process.exit(1);
}
rmSync(dest, { recursive: true, force: true });
const copied = [];
for (const entry of readdirSync(src, { withFileTypes: true })) {
  if (!entry.isDirectory() || EXCLUDED.has(entry.name)) continue;
  if (!existsSync(new URL(`${entry.name}/SKILL.md`, src))) continue;
  cpSync(new URL(entry.name, src), new URL(entry.name, dest), { recursive: true });
  copied.push(entry.name);
}
console.log(`conventions/: ${copied.join(', ')}`);
