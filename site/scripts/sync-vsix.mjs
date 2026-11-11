// Copia o .vsix da extensão para o site (download manual) e grava versão, tamanho e SHA-256.
// Rode depois de `npx @vscode/vsce package` em extension/:  node scripts/sync-vsix.mjs
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const ext = join(site, "..", "extension");
const { version } = JSON.parse(readFileSync(join(ext, "package.json"), "utf8"));
const file = `veritas-${version}.vsix`;
const from = join(ext, file);
const dir = join(site, "public", "downloads");

mkdirSync(dir, { recursive: true });
for (const old of readdirSync(dir)) if (old.endsWith(".vsix") && old !== file) rmSync(join(dir, old)); // só a versão atual
copyFileSync(from, join(dir, file));

const buf = readFileSync(from);
const info = { version, file, size: statSync(from).size, sha256: createHash("sha256").update(buf).digest("hex") };
writeFileSync(join(site, "src", "lib", "vsix.json"), `${JSON.stringify(info, null, 2)}\n`);
console.log(info);
