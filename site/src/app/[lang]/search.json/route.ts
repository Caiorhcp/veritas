import { getDictionary } from "@/i18n/dictionaries";
import { searchIndex } from "@/lib/search";
import { localeParams, resolveLocale } from "../params";

export const dynamic = "force-static";
export const generateStaticParams = localeParams;

export async function GET(_: Request, { params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLocale(params);
  return Response.json(searchIndex(lang, getDictionary(lang)));
}
