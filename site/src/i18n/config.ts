export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_COOKIE = "idioma";

export const HTML_LANG: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };
export const OG_LOCALE: Record<Locale, string> = { pt: "pt_BR", en: "en_US", es: "es_ES" };
export const LOCALE_NAME: Record<Locale, string> = { pt: "Português", en: "English", es: "Español" };

export const hasLocale = (value: string | undefined): value is Locale => LOCALES.includes(value as Locale);

/** Escolhe o idioma pelo cabeçalho Accept-Language, respeitando o peso (q) de cada língua. */
export function negotiate(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: tag.split("-")[0], q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((l) => l.q > 0)
    .sort((a, b) => b.q - a.q);
  return ranked.map((l) => l.base).find(hasLocale) ?? DEFAULT_LOCALE;
}

/** Mesmo caminho em todas as línguas, para o hreflang do Google. */
export function languageAlternates(path: string) {
  const suffix = path === "/" ? "" : path;
  return {
    "pt-BR": `/pt${suffix}`,
    en: `/en${suffix}`,
    es: `/es${suffix}`,
    "x-default": `/pt${suffix}`,
  };
}
