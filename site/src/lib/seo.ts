import type { Metadata } from "next";
import { languageAlternates, type Locale, OG_LOCALE } from "@/i18n/config";

/** Canônica, hreflang e Open Graph de uma página (`path` sem o idioma, ex.: "/blog"). */
export function pageMeta(lang: Locale, path: string, title?: string, description?: string): Metadata {
  const url = `/${lang}${path === "/" ? "" : path}`;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { url, locale: OG_LOCALE[lang], ...(title ? { title } : {}), ...(description ? { description } : {}) },
  };
}
