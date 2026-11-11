import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { Command } from "../Command";
import { PackageCommand } from "../PackageCommand";
import { Reveal, RevealItem } from "../Reveal";
import { Terminal } from "./Terminal";

/** Primeira tela: o que é, como começar e um terminal que mostra o projeto nascendo com as convenções dentro. */
export function Hero({ lang, d }: { lang: Locale; d: Dictionary }) {
  const h = d.home;
  return (
    <section aria-labelledby="titulo" className="glow relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:pt-24 lg:pb-28">
        <Reveal className="min-w-0">
          <RevealItem>
            <h1 id="titulo" className="text-[clamp(3.5rem,9vw,7rem)] leading-[0.9] font-bold tracking-[-0.04em]">
              {h.title}
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mt-6 max-w-[42ch] text-lead text-soft">{h.lead}</p>
          </RevealItem>
          <RevealItem className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={`/${lang}/comecar`}
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-on-accent transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
            >
              {h.primary}
              <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href={`/${lang}/skills`} className="font-medium text-soft underline-offset-4 transition-colors hover:text-ink hover:underline">
              {h.stacksCta}
            </Link>
          </RevealItem>
          <RevealItem className="mt-12 grid max-w-xl gap-6">
            <div>
              <p className="mb-2.5 text-small font-medium text-soft">{h.newProject}</p>
              <PackageCommand copy={d.copy} label={h.newProject} />
            </div>
            <div>
              <p className="mb-2.5 text-small font-medium text-soft">{h.claudeCode}</p>
              <div className="space-y-1.5">
                <Command cmd="/plugin marketplace add Caiorhcp/veritas" copy={d.copy} className="rounded-xl" />
                <Command cmd="/plugin install veritas@veritas" copy={d.copy} className="rounded-xl" />
              </div>
              <p className="mt-3 text-small text-soft">{h.tokens}</p>
            </div>
          </RevealItem>
        </Reveal>
        <Terminal t={h.terminal} />
      </div>
    </section>
  );
}
