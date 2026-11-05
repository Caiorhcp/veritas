import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { repoFile } from "@/lib/site";
import { docTitle, type Heading, readSkillDoc, type Skill } from "@/lib/skills";
import { Command } from "./Command";
import { PtNote } from "./PtNote";

/** Página de uma skill ou de um arquivo de apoio: ficha ao lado, texto renderizado no meio. */
export function SkillArticle({
  lang,
  d,
  skill,
  html,
  toc,
  file,
}: {
  lang: Locale;
  d: Dictionary;
  skill: Skill;
  html: string;
  toc: Heading[];
  file: string;
}) {
  const s = d.skills;
  const base = `/${lang}/skills/${skill.name}`;
  const isMain = file === "SKILL.md";
  return (
    <div className="mx-auto grid max-w-[90rem] gap-12 px-4 pt-12 pb-32 sm:px-8 sm:pt-16 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <div className="space-y-8 lg:sticky lg:top-24">
          <Link href={`/${lang}/skills`} className="inline-block font-medium underline-offset-4 hover:underline">
            ← {s.back}
          </Link>
          <div className="bg-field p-6 text-on-field">
            <p className="text-head leading-none font-bold break-words">{skill.name}</p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-small">
              <dt className="text-on-field-soft">{s.scope}</dt>
              <dd>{s.groups[skill.scope] ?? skill.scope}</dd>
              <dt className="text-on-field-soft">{s.stacks}</dt>
              <dd>{skill.stacks.join(", ")}</dd>
              <dt className="text-on-field-soft">{s.verified}</dt>
              <dd className="tabular">{skill.verified === "1.0" ? s.authored : skill.verified}</dd>
            </dl>
          </div>
          <div>
            <p className="text-small">{skill.manual ? s.manualNote : s.autoNote}</p>
            <Command cmd={`/veritas:${skill.name}`} copy={d.copy} className="mt-2" />
          </div>
          {skill.files.length > 0 && (
            <nav aria-label={s.files}>
              <p className="text-small font-bold">{s.files}</p>
              <ul className="mt-3 space-y-1 text-small">
                <li>
                  <Link href={base} aria-current={isMain ? "page" : undefined} className={`block px-2 py-1 ${isMain ? "bg-surface font-medium" : "hover:bg-surface"}`}>
                    SKILL.md
                  </Link>
                </li>
                {skill.files.map((f) => {
                  const current = f.path === file;
                  const href = f.isMarkdown ? `${base}/${f.path.slice(0, -3)}` : repoFile(`plugin/skills/${skill.name}/${f.path}`);
                  return (
                    <li key={f.path}>
                      <Link href={href} aria-current={current ? "page" : undefined} className={`block px-2 py-1 break-all ${current ? "bg-surface font-medium" : "hover:bg-surface"}`}>
                        {f.path}
                        {f.isMarkdown && <span className="block text-small text-soft">{docTitle(readSkillDoc(skill.name, f.path) ?? "", f.path)}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </aside>

      <article className="min-w-0 lg:col-span-6">
        {!isMain && (
          <p className="mb-6 text-small text-soft">
            {s.partOf} <Link href={base} className="font-medium text-ink underline underline-offset-4">{skill.name}</Link> · {file}
          </p>
        )}
        {!html.includes("<h1") && <h1 className="mb-6 text-head">{isMain ? skill.name : file}</h1>}
        {isMain && <p lang="pt-BR" className="mb-10 text-lead">{skill.description}</p>}
        <PtNote text={s.ptNote} />
        <div lang="pt-BR" className="prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />
        <a href={repoFile(`plugin/skills/${skill.name}/${file}`)} className="mt-16 inline-block font-medium underline underline-offset-4">
          {s.onGithub} →
        </a>
      </article>

      {toc.length > 0 && (
        <nav aria-label={s.onPage} className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <p className="text-small font-bold">{s.onPage}</p>
            <ul className="mt-3 space-y-1.5 text-small">
              {toc.map((h) => (
                <li key={h.id} className={h.depth === 3 ? "pl-4 text-soft" : ""}>
                  <a href={`#${h.id}`} className="hover:underline hover:underline-offset-4">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}
