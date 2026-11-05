import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { docTitle, getSkills, headings, readSkillDoc } from "./skills";

export type SearchEntry = { title: string; text: string; href: string; kind: "page" | "skill" | "section" };

/** Índice da busca, montado no build: páginas, skills, arquivos de apoio e as seções de cada um. */
export function searchIndex(lang: Locale, d: Dictionary): SearchEntry[] {
  const pages: SearchEntry[] = [
    { title: d.nav.start, text: d.start.description, href: `/${lang}/comecar`, kind: "page" },
    { title: d.cli.title, text: d.cli.description, href: `/${lang}/cli`, kind: "page" },
    { title: d.skills.title, text: d.skills.description, href: `/${lang}/skills`, kind: "page" },
  ];
  const skills = getSkills().flatMap((s) => {
    const base = `/${lang}/skills/${s.name}`;
    const docs = s.files
      .filter((f) => f.isMarkdown)
      .flatMap((f) => {
        const md = readSkillDoc(s.name, f.path) ?? "";
        const href = `${base}/${f.path.slice(0, -3)}`;
        return [
          { title: docTitle(md, f.path), text: `${s.name} · ${f.path}`, href, kind: "section" as const },
          ...headings(md).map((h) => ({ title: h.text, text: `${s.name} · ${f.path}`, href: `${href}#${h.id}`, kind: "section" as const })),
        ];
      });
    return [
      { title: s.name, text: s.description, href: base, kind: "skill" as const },
      ...headings(s.body).map((h) => ({ title: h.text, text: s.name, href: `${base}#${h.id}`, kind: "section" as const })),
      ...docs,
    ];
  });
  return [...pages, ...skills];
}
