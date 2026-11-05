import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkillArticle } from "@/components/SkillArticle";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { docTitle, getSkill, getSkills, headings, readSkillDoc, renderMarkdown } from "@/lib/skills";
import { resolveLocale } from "../../../params";

export const dynamicParams = false;
export const generateStaticParams = () =>
  LOCALES.flatMap((lang) =>
    getSkills().flatMap((s) => s.files.filter((f) => f.isMarkdown).map((f) => ({ lang, name: s.name, doc: f.path.slice(0, -3).split("/") }))),
  );

async function load(params: PageProps<"/[lang]/skills/[name]/[...doc]">["params"]) {
  const { name, doc } = await params;
  const skill = getSkill(name);
  const file = `${doc.join("/")}.md`;
  const markdown = skill && readSkillDoc(name, file);
  return skill && markdown !== undefined ? { skill, file, markdown } : undefined;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/skills/[name]/[...doc]">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const found = await load(params);
  if (!found) return {};
  const { skill, file, markdown } = found;
  return pageMeta(lang, `/skills/${skill.name}/${file.slice(0, -3)}`, `${docTitle(markdown, file)} · ${skill.name}`, skill.description);
}

export default async function SkillDocPage({ params }: PageProps<"/[lang]/skills/[name]/[...doc]">) {
  const lang = await resolveLocale(params);
  const found = await load(params);
  if (!found) notFound();
  const { skill, file, markdown } = found;
  return (
    <SkillArticle
      lang={lang}
      d={getDictionary(lang)}
      skill={skill}
      file={file}
      html={renderMarkdown(markdown, skill.name, file, lang)}
      toc={headings(markdown).filter((h) => h.depth === 2)}
    />
  );
}
