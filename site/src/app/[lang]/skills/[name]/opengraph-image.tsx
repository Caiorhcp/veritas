import { getSkill, getSkills } from "@/lib/skills";
import { LOCALES } from "@/i18n/config";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Veritas";
export const size = OG_SIZE;
export const contentType = "image/png";
export const generateStaticParams = () => LOCALES.flatMap((lang) => getSkills().map((s) => ({ lang, name: s.name })));

export default async function Image({ params }: { params: Promise<{ lang: string; name: string }> }) {
  const skill = getSkill((await params).name);
  return ogImage(skill?.name ?? "Veritas", "Veritas · skill", `/veritas:${skill?.name ?? ""}`);
}
