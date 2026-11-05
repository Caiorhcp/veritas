import { getDictionary } from "@/i18n/dictionaries";
import { OG_SIZE, ogImage } from "@/lib/og";
import { localeParams, resolveLocale } from "../params";

export const alt = "Veritas";
export const size = OG_SIZE;
export const contentType = "image/png";
export const generateStaticParams = localeParams;

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const d = getDictionary(await resolveLocale(params));
  return ogImage(d.start.description, `Veritas · ${d.start.title}`);
}
