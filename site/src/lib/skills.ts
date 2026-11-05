import fs from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import type { Locale } from "@/i18n/config";
import { repoFile } from "./site";

// As skills moram no plugin, ao lado do site no mesmo repositório; são lidas só no build.
const ROOT = path.join(process.cwd(), "..", "plugin", "skills");

export type Scope = "geral" | "processo" | "frontend" | "backend" | "mobile";

export type Heading = { depth: number; text: string; id: string };

export type SkillFile = { path: string; isMarkdown: boolean };

export type Skill = {
  name: string;
  description: string;
  scope: Scope;
  stacks: string[];
  verified: string;
  /** `disable-model-invocation`: só roda quando a pessoa chama por `/`. */
  manual: boolean;
  body: string;
  files: SkillFile[];
};

export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Separa o frontmatter YAML do corpo. Lê só os campos que o site usa. */
export function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const yaml = match?.[1] ?? "";
  const body = match ? raw.slice(match[0].length) : raw;
  const field = (key: string) => {
    const value = yaml.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"))?.[1].trim() ?? "";
    return value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  };
  const list = field("stacks").replace(/^\[|\]$/g, "");
  return {
    name: field("name"),
    description: field("description").replace(/\\"/g, '"'),
    scope: (field("escopo") || "geral") as Scope,
    stacks: list ? list.split(",").map((s) => s.trim()) : [],
    verified: field("versao_verificada"),
    manual: field("disable-model-invocation") === "true",
    body,
  };
}

function listFiles(dir: string, prefix = ""): SkillFile[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) return listFiles(path.join(dir, entry.name), rel);
      if (rel === "SKILL.md") return [];
      return [{ path: rel, isMarkdown: rel.endsWith(".md") }];
    });
}

let cache: Skill[] | undefined;

export function getSkills(): Skill[] {
  cache ??= fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, "SKILL.md")))
    .map((d) => {
      const meta = parseFrontmatter(fs.readFileSync(path.join(ROOT, d.name, "SKILL.md"), "utf8"));
      return { ...meta, name: meta.name || d.name, files: listFiles(path.join(ROOT, d.name)) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export const getSkill = (name: string) => getSkills().find((s) => s.name === name);

/** Texto de um arquivo de apoio (`patterns/testing.md`), sem frontmatter. */
export function readSkillDoc(name: string, file: string) {
  const full = path.join(ROOT, name, file);
  if (!full.startsWith(path.join(ROOT, name)) || !fs.existsSync(full)) return undefined;
  return parseFrontmatter(fs.readFileSync(full, "utf8")).body;
}

/** Título de um arquivo de apoio: o primeiro `#`, ou o nome do arquivo. */
export function docTitle(markdown: string, file: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1].replace(/[`*]/g, "").trim() ?? file;
}

/** Leva um link relativo entre arquivos das skills para a página do site (ou para o GitHub, se não for markdown). */
export function resolveLink(href: string, skill: string, fromFile: string, lang: Locale): string {
  if (/^([a-z]+:|#|\/)/i.test(href)) return href;
  const [target, hash] = href.split("#");
  const anchor = hash ? `#${hash}` : "";
  const resolved = path.posix.normalize(path.posix.join(skill, path.posix.dirname(fromFile), target));
  if (resolved.startsWith("..")) return repoFile(path.posix.normalize(`plugin/skills/${resolved}`)) + anchor;
  const [owner, ...rest] = resolved.split("/");
  const file = rest.join("/");
  if (!getSkill(owner)) return repoFile(`plugin/skills/${resolved}`) + anchor;
  if (file === "" || file === "SKILL.md") return `/${lang}/skills/${owner}${anchor}`;
  if (file.endsWith(".md") && fs.existsSync(path.join(ROOT, owner, file))) return `/${lang}/skills/${owner}/${file.slice(0, -3)}${anchor}`;
  return repoFile(`plugin/skills/${resolved}`) + anchor;
}

const plain = (text: string) => text.replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();

/** Títulos `##` e `###` do texto, com o mesmo id que o HTML recebe. */
export function headings(markdown: string): Heading[] {
  const seen = new Map<string, number>();
  return new Marked()
    .lexer(markdown)
    .filter((t): t is Tokens.Heading => t.type === "heading" && t.depth >= 2 && t.depth <= 3)
    .map((t) => {
      const text = plain(t.text);
      const base = slugify(text) || "secao";
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return { depth: t.depth, text, id: n ? `${base}-${n}` : base };
    });
}

/** Markdown da skill em HTML: títulos com âncora, links corrigidos, `veritas:nome` vira link. */
export function renderMarkdown(markdown: string, skill: string, fromFile: string, lang: Locale) {
  const seen = new Map<string, number>();
  const marked = new Marked({
    gfm: true,
    walkTokens(token) {
      if (token.type === "link") token.href = resolveLink(token.href, skill, fromFile, lang);
    },
    renderer: {
      heading({ tokens, depth, text }) {
        const base = slugify(plain(text)) || "secao";
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const external = /^https?:/.test(href);
        const attrs = `${title ? ` title="${title}"` : ""}${external ? ' rel="noreferrer" target="_blank"' : ""}`;
        return `<a href="${href}"${attrs}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  const names = new Set(getSkills().map((s) => s.name));
  return (marked.parse(markdown) as string).replace(/<code>veritas:([a-z0-9-]+)<\/code>/g, (whole, name: string) =>
    names.has(name) ? `<a href="/${lang}/skills/${name}">${whole}</a>` : whole,
  );
}
