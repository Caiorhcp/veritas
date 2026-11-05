import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { PtNote } from "@/components/PtNote";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { getSkills, type Skill } from "@/lib/skills";
import { resolveLocale } from "../params";

export async function generateMetadata({ params }: PageProps<"/[lang]/skills">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  return pageMeta(lang, "/skills", d.skills.title, d.skills.description);
}

const GROUPS = ["frontend", "backend", "mobile", "geral", "processo", "manual"] as const;
const groupOf = (s: Skill) => (s.manual ? "manual" : s.scope);

export default async function SkillsPage({ params }: PageProps<"/[lang]/skills">) {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  const skills = getSkills();
  return (
    <>
      <PageHead title={d.skills.title} lead={d.skills.lead}>
        <PtNote text={d.skills.ptNote} />
      </PageHead>
      <div className="mx-auto max-w-[90rem] space-y-24 px-4 pb-32 sm:px-8 sm:pb-40">
        {GROUPS.map((g) => {
          const rows = skills.filter((s) => groupOf(s) === g);
          if (!rows.length) return null;
          return (
            <section key={g} aria-labelledby={`grupo-${g}`} className="grid gap-6 md:grid-cols-12">
              <h2 id={`grupo-${g}`} className="text-head md:col-span-3">
                {d.skills.groups[g]}
              </h2>
              <ul className="space-y-2 md:col-span-9">
                {rows.map((s) => (
                  <li key={s.name}>
                    <Link href={`/${lang}/skills/${s.name}`} className="group grid gap-x-8 gap-y-1 bg-surface p-5 transition-colors hover:bg-field hover:text-on-field sm:grid-cols-[14rem_1fr] sm:p-6">
                      <span>
                        <span className="block text-lead font-bold">{s.name}</span>
                        <span className="mt-1 block text-small text-soft group-hover:text-on-field-soft">
                          {s.manual ? `/veritas:${s.name}` : s.stacks.filter((x) => x !== "todas").join(", ") || d.skills.groups[s.scope]}
                        </span>
                      </span>
                      <span lang="pt-BR" className="line-clamp-3 text-small leading-relaxed">{s.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
