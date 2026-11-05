import type { Metadata } from "next";
import Link from "next/link";
import { Command } from "@/components/Command";
import { PackageCommand } from "@/components/PackageCommand";
import { PageHead } from "@/components/PageHead";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { resolveLocale } from "../params";

export async function generateMetadata({ params }: PageProps<"/[lang]/cli">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  return pageMeta(lang, "/cli", d.cli.title, d.cli.description);
}

const FULL = "npx create-veritas new my-app --stack nextjs --skills nextjs,principios,lgpd,atomic-design --dir apps/web --no-install";
const INIT = "npx create-veritas init --yes";

export default async function CliPage({ params }: PageProps<"/[lang]/cli">) {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  const c = d.cli;
  return (
    <>
      <PageHead title="create-veritas" lead={c.lead}>
        <div className="mt-10 max-w-2xl">
          <PackageCommand copy={d.copy} label={c.title} />
        </div>
      </PageHead>

      <section aria-labelledby="comandos" className="bg-surface">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-24 sm:px-8 sm:py-32 md:grid-cols-12">
          <h2 id="comandos" className="text-head md:col-span-4">{c.commandsHeading}</h2>
          <dl className="space-y-10 md:col-span-8">
            {c.commands.map((cmd) => (
              <div key={cmd.cmd} className="grid gap-3 sm:grid-cols-[18rem_1fr] sm:gap-8">
                <dt>
                  <code className="bg-paper px-2 py-1 font-mono text-small font-medium">{cmd.cmd}</code>
                </dt>
                <dd className="max-w-[60ch]">{cmd.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="flags" className="bg-field text-on-field">
        <div className="mx-auto max-w-[90rem] px-4 py-24 sm:px-8 sm:py-32">
          <h2 id="flags" className="text-head">{c.flagsHeading}</h2>
          <p className="mt-6 max-w-[60ch]">{c.flagsLead}</p>
          <table className="mt-12 w-full max-w-5xl border-collapse text-left">
            <thead>
              <tr className="bg-field-deep">
                <th className="px-4 py-3 font-bold">{c.flagCol}</th>
                <th className="px-4 py-3 font-bold">{c.meansCol}</th>
              </tr>
            </thead>
            <tbody>
              {c.flags.map((f) => (
                <tr key={f.flag} className="align-top even:bg-field-deep/40">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <code className="font-mono text-small">{f.flag}</code>
                  </td>
                  <td className="px-4 py-4">{f.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="mt-20 text-lead">{c.defaultsHeading}</h3>
          <p className="mt-3 max-w-[60ch]">{c.defaults}</p>
          <h3 className="mt-14 text-lead">{c.fullHeading}</h3>
          <p className="mt-3 text-on-field-soft">{c.fullLead}</p>
          <div className="mt-6 max-w-5xl space-y-1.5">
            {[FULL, INIT].map((cmd) => (
              <Command key={cmd} cmd={cmd} copy={d.copy} tone="bg-on-field text-field [&_button:hover]:bg-on-field-soft" />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="escrito" className="mx-auto max-w-[90rem] px-4 py-24 sm:px-8 sm:py-32">
        <h2 id="escrito" className="text-head">{c.writtenHeading}</h2>
        <table className="mt-12 w-full max-w-5xl border-collapse text-left">
          <thead>
            <tr className="bg-surface">
              <th className="px-4 py-3 font-bold">{c.fileCol}</th>
              <th className="px-4 py-3 font-bold">{c.whatCol}</th>
            </tr>
          </thead>
          <tbody>
            {c.written.map((w) => (
              <tr key={w.file} className="align-top even:bg-surface">
                <td className="px-4 py-4 whitespace-nowrap">
                  <code className="font-mono text-small">{w.file}</code>
                </td>
                <td className="px-4 py-4">{w.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-12 max-w-[60ch]">
          {c.pluginNote}{" "}
          <Link href={`/${lang}/comecar`} className="font-medium underline underline-offset-4">
            {d.nav.start} →
          </Link>
        </p>
      </section>
    </>
  );
}
