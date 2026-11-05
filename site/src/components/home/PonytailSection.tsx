import { ArrowUpRight, Feather, Puzzle, Scissors } from "lucide-react";
import type { Dictionary } from "@/i18n/pt";
import { LINKS } from "@/lib/site";
import { Command } from "../Command";
import { Reveal, RevealItem } from "../Reveal";

const ICONS = [Feather, Puzzle, Scissors];

/** O par do Veritas: o Ponytail, de Dietrich Gebert, com o crédito em destaque. */
export function PonytailSection({ d, copy }: { d: Dictionary["home"]["ponytail"]; copy: Dictionary["copy"] }) {
  return (
    <section id="ponytail" aria-labelledby="ponytail-titulo" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div style={{ "--tint": "var(--mint)" } as React.CSSProperties} className="tinted relative overflow-hidden rounded-3xl p-7 sm:p-12">
        <Reveal className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <RevealItem>
              <h2 id="ponytail-titulo" className="text-head">
                {d.heading}
              </h2>
              <p className="mt-5 max-w-[52ch] text-lead text-soft">{d.lead}</p>
            </RevealItem>
            <RevealItem className="mt-8 max-w-md">
              <Command cmd="/plugin install ponytail@veritas" copy={copy} className="rounded-xl" />
            </RevealItem>
            <RevealItem>
              <p className="mt-8 max-w-[56ch] text-small text-soft">
                {d.credit}{" "}
                <a href={LINKS.ponytailAuthor} className="tint-text underline underline-offset-4">
                  @DietrichGebert
                </a>
              </p>
              <a
                href={LINKS.ponytail}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--tint)_18%,transparent)] px-5 py-3 font-semibold transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--tint)_28%,transparent)]"
              >
                {d.cta}
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </RevealItem>
          </div>
          <ul className="grid gap-4">
            {d.points.map((p, i) => {
              const Icon = ICONS[i];
              return (
                <RevealItem key={p.title}>
                  <li className="flex gap-4 rounded-2xl bg-surface/70 p-5 transition-transform duration-300 hover:-translate-y-0.5">
                    <span className="tint-text grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--tint)_16%,transparent)]">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{p.title}</span>
                      <span className="mt-1 block text-soft">{p.text}</span>
                    </span>
                  </li>
                </RevealItem>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
