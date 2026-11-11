import type { MetadataRoute } from "next";
import { languageAlternates, LOCALES } from "@/i18n/config";
import { getSkills } from "@/lib/skills";
import { absolute } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

// Cada página aparece nas três línguas, com o hreflang das outras versões
function localized(path: string, extra: Omit<Entry, "url" | "alternates">): Entry[] {
  const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([k, v]) => [k, absolute(v)]));
  return LOCALES.map((lang) => ({ url: absolute(`/${lang}${path === "/" ? "" : path}`), alternates: { languages }, ...extra }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localized("/", { changeFrequency: "monthly", priority: 1 }),
    ...localized("/comecar", { changeFrequency: "monthly", priority: 0.9 }),
    ...localized("/extensao", { changeFrequency: "monthly", priority: 0.9 }),
    ...localized("/cli", { changeFrequency: "monthly", priority: 0.9 }),
    ...localized("/skills", { changeFrequency: "weekly", priority: 0.9 }),
    ...getSkills().flatMap((s) => [
      ...localized(`/skills/${s.name}`, { changeFrequency: "monthly", priority: 0.7 }),
      ...s.files.filter((f) => f.isMarkdown).flatMap((f) => localized(`/skills/${s.name}/${f.path.slice(0, -3)}`, { changeFrequency: "monthly", priority: 0.4 })),
    ]),
  ];
}
