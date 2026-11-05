import type { Metadata } from "next";
import { Command } from "@/components/Command";
import { PageHead } from "@/components/PageHead";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { LINKS } from "@/lib/site";
import { resolveLocale } from "../params";

export async function generateMetadata({ params }: PageProps<"/[lang]/comecar">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  return pageMeta(lang, "/comecar", d.start.title, d.start.description);
}

export default async function StartPage({ params }: PageProps<"/[lang]/comecar">) {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  const s = d.start;
  return (
    <>
      <PageHead title={s.title} lead={s.lead} />
      <ol className="mx-auto max-w-[90rem] space-y-2 px-2.5 pb-24 sm:px-8">
        {s.steps.map((step, i) => (
          <li key={step.heading} className={`grid gap-6 p-6 sm:p-10 md:grid-cols-12 ${i === 0 ? "bg-field text-on-field" : "bg-surface"}`}>
            <div className="md:col-span-5">
              <h2 className="text-head">{step.heading}</h2>
              <p className="mt-4 max-w-[46ch]">{step.text}</p>
              {i === 0 && <p className="mt-4 max-w-[46ch] text-small text-on-field-soft">{s.cowork}</p>}
            </div>
            <div className="space-y-1.5 self-end md:col-span-7">
              {step.commands.map((cmd) => (
                <Command
                  key={cmd}
                  cmd={cmd}
                  copy={d.copy}
                  tone={i === 0 ? "bg-on-field text-field [&_button:hover]:bg-on-field-soft" : "bg-paper"}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby="contribuir" className="mx-auto grid max-w-[90rem] gap-10 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
        <h2 id="contribuir" className="text-head md:col-span-4">{s.contributeHeading}</h2>
        <div className="md:col-span-7">
          <ul className="notch-bullet space-y-4">
            {s.contribute.map((p) => (
              <li key={p} className="max-w-[60ch]">{p}</li>
            ))}
          </ul>
          <div className="mt-6 space-y-1.5">
            {s.contributeCommands.map((cmd) => (
              <Command key={cmd} cmd={cmd} copy={d.copy} />
            ))}
          </div>
          <a href={LINKS.repo} className="tab-cut mt-10 inline-block bg-accent px-6 py-3 font-bold text-on-accent transition-[background-color,transform] hover:bg-accent-hover active:scale-95">
            {s.openPr}
          </a>
        </div>
      </section>
    </>
  );
}
