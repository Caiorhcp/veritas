import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";

export const localeParams = () => LOCALES.map((lang) => ({ lang }));

/** Idioma da rota; qualquer outro valor vira 404. */
export async function resolveLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return lang;
}
