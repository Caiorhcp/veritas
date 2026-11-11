// Atualiza o plugin graphify empacotado em plugins/graphify a partir de uma versão publicada do Graphify
// (https://github.com/Graphify-Labs/graphify, Apache-2.0). O Graphify não publica um plugin para Claude Code;
// este script copia a skill oficial dele, sem alterações, e grava a versão no plugin.json.
//
// Uso: node tools/sync-graphify.mjs v0.9.106
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const tag = process.argv[2];
if (!tag) {
  console.error("Informe a versão do Graphify, por exemplo: node tools/sync-graphify.mjs v0.9.106");
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "plugins", "graphify");
const raw = (path) => `https://raw.githubusercontent.com/Graphify-Labs/graphify/${tag}/${path}`;
const REFS = ["add-watch", "exports", "extraction-spec", "github-and-merge", "hooks", "query", "transcribe", "update"];
const files = [
  ["graphify/skill.md", "skills/graphify/SKILL.md"],
  ...REFS.map((r) => [`graphify/skills/claude/references/${r}.md`, `skills/graphify/references/${r}.md`]),
  ["LICENSE", "LICENSE"],
  ["NOTICE", "NOTICE"],
];

for (const [from, to] of files) {
  const res = await fetch(raw(from));
  if (!res.ok) throw new Error(`${from}: HTTP ${res.status}`);
  const dest = join(root, to);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, await res.text());
  console.log(`ok ${to}`);
}

const manifest = join(root, ".claude-plugin", "plugin.json");
const json = JSON.parse(readFileSync(manifest, "utf8"));
json.version = tag.replace(/^v/, "");
writeFileSync(manifest, `${JSON.stringify(json, null, 2)}\n`);
console.log(`plugin.json -> ${json.version}`);
