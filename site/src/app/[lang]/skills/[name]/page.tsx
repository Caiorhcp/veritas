import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkillArticle } from "@/components/SkillArticle";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { getSkill, getSkills, headings, renderMarkdown } from "@/lib/skills";
import { resolveLocale } from "../../params";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => getSkills().map((s) => ({ lang, name: s.name })));

export async function generateMetadata({ params }: PageProps<"/[lang]/skills/[name]">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const skill = getSkill((await params).name);
  if (!skill) return {};
  return pageMeta(lang, `/skills/${skill.name}`, skill.name, skill.description);
}

export default async function SkillPage({ params }: PageProps<"/[lang]/skills/[name]">) {
  const lang = await resolveLocale(params);
  const skill = getSkill((await params).name);
  if (!skill) notFound();
  return (
    <SkillArticle
      lang={lang}
      d={getDictionary(lang)}
      skill={skill}
      file="SKILL.md"
      html={renderMarkdown(skill.body, skill.name, "SKILL.md", lang)}
      toc={headings(skill.body).filter((h) => h.depth === 2)}
    />
  );
}
