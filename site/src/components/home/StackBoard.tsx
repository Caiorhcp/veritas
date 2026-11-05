import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { getSkill } from "@/lib/skills";
import { STACKS } from "@/lib/stacks";
import { Reveal, RevealItem } from "../Reveal";

/** Uma grade de cartões, um por stack, cada um com o seu tom pastel. */
export function StackBoard({ lang, d, cta }: { lang: Locale; d: Dictionary["home"]["stacks"]; cta: string }) {
  return (
    <section id="stacks" aria-labelledby="stacks-titulo" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <RevealItem className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 id="stacks-titulo" className="text-head">
              {d.heading}
            </h2>
            <p className="mt-5 text-lead text-soft">{d.lead}</p>
          </div>
          <Link href={`/${lang}/skills`} className="font-medium text-accent underline-offset-4 hover:underline">
            {cta} →
          </Link>
        </RevealItem>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACKS.map((s) => {
            const verified = getSkill(s.name)?.verified;
            return (
              <RevealItem key={s.name}>
                <Link
                  href={`/${lang}/skills/${s.name}`}
                  style={{ "--tint": s.tint } as React.CSSProperties}
                  className="tinted group flex h-full flex-col rounded-2xl p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <code className="tint-text rounded-lg bg-[color-mix(in_srgb,var(--tint)_14%,transparent)] px-2.5 py-1 font-mono text-small">
                      {s.snippet}
                    </code>
                    <ArrowUpRight size={20} aria-hidden className="tint-text transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mt-6 text-lead font-semibold">{s.label}</h3>
                  <p className="mt-1 text-small text-soft">
                    {d.verified} {s.product && verified ? `${s.product} ${verified}` : d.authored}
                    {s.cli && <span className="tint-text"> · {d.generates} {s.name}</span>}
                  </p>
                  <p className="mt-4 text-soft">{d.items[s.name]}</p>
                  <p className="mt-auto pt-5 text-small text-soft/80">{s.libs}</p>
                </Link>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
