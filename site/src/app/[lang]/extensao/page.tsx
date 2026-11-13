import { Download, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Command } from "@/components/Command";
import { PageHead } from "@/components/PageHead";
import { HTML_LANG } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import vsix from "@/lib/vsix.json";
import { resolveLocale } from "../params";

const fill = (s: string) => s.replaceAll("{version}", vsix.version);

export async function generateMetadata({ params }: PageProps<"/[lang]/extensao">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  return pageMeta(lang, "/extensao", d.extension.title, d.extension.description);
}

export default async function ExtensionPage({ params }: PageProps<"/[lang]/extensao">) {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  const e = d.extension;
  const size = `${new Intl.NumberFormat(HTML_LANG[lang], { maximumFractionDigits: 0 }).format(vsix.size / 1024)} KB`;
  const href = `/downloads/${vsix.file}`;

  return (
    <>
      <PageHead title={e.title} lead={e.lead}>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={href}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-on-accent transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-95"
          >
            <Download size={18} aria-hidden />
            {e.download}
          </a>
          <span className="text-small text-soft">
            {e.meta.replace("{version}", vsix.version).replace("{size}", size)}
          </span>
        </div>
        <details className="mt-5 max-w-full text-small text-soft">
          <summary className="cursor-pointer pointer-coarse:py-3.5">{e.checksum}</summary>
          <code className="mt-2 block font-mono break-all">{vsix.sha256}</code>
        </details>
        <p className="mt-6 max-w-[60ch] text-small text-soft">{e.soon}</p>
      </PageHead>

      <section aria-labelledby="editores" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <h2 id="editores" className="text-head">{e.editorsHeading}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {e.editors.map((ed) => (
            <article key={ed.name} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <h3 className="text-lead font-semibold">{ed.name}</h3>
              <p className="mt-5 text-small font-medium text-soft">{e.viaMenu}</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                {ed.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-6 mb-2 text-small font-medium text-soft">{e.viaTerminal}</p>
              <Command cmd={fill(ed.cli)} copy={d.copy} className="rounded-xl" tone="bg-paper" />
            </article>
          ))}
        </div>
        <p className="mt-4 text-small text-soft">{e.terminalNote}</p>
      </section>

      <section aria-labelledby="depois" className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 md:grid-cols-12">
        <h2 id="depois" className="text-head md:col-span-4">{e.useHeading}</h2>
        <div className="md:col-span-8">
          <ol className="list-decimal space-y-3 pl-5">
            {e.use.map((u) => (
              <li key={u} className="max-w-[64ch]">{u}</li>
            ))}
          </ol>
          <h3 className="mt-12 text-lead font-semibold">{e.updateHeading}</h3>
          <p className="mt-3 max-w-[64ch]">{e.update}</p>
          <p className="mt-8 flex max-w-[64ch] items-start gap-2 text-small text-soft">
            <ShieldCheck size={18} aria-hidden className="mt-0.5 shrink-0 text-mint" />
            {e.privacy}
          </p>
        </div>
      </section>
    </>
  );
}
