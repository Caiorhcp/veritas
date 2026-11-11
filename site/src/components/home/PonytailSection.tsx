import { ArrowUpRight, Feather, type LucideIcon, Puzzle, Scissors } from "lucide-react";
import type { Dictionary } from "@/i18n/pt";
import { Command } from "../Command";
import { Reveal, RevealItem } from "../Reveal";


interface Companion {
  id: string;
  d: Dictionary["home"]["ponytail"];
  copy: Dictionary["copy"];
  cmd: string;
  tint: string;
  repo: string;
  author: { href: string; label: string };
  icons?: LucideIcon[];
}

/** Um dos plugins que vêm com o Veritas (Ponytail, Graphify), com o crédito ao autor em destaque. */
export function PonytailSection({ id, d, copy, cmd, tint, repo, author, icons = [Feather, Puzzle, Scissors] }: Companion) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div style={{ "--tint": tint } as React.CSSProperties} className="tinted relative overflow-hidden rounded-3xl p-7 sm:p-12">
        <Reveal className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <RevealItem>
              <h2 id={`${id}-titulo`} className="text-head">
                {d.heading}
              </h2>
              <p className="mt-5 max-w-[52ch] text-lead text-soft">{d.lead}</p>
            </RevealItem>
            <RevealItem className="mt-8 max-w-md">
              <Command cmd={cmd} copy={copy} className="rounded-xl" />
            </RevealItem>
            <RevealItem>
              <p className="mt-8 max-w-[56ch] text-small text-soft">
                {d.credit}{" "}
                <a href={author.href} className="tint-text underline underline-offset-4">
                  {author.label}
                </a>
              </p>
              <a
                href={repo}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--tint)_18%,transparent)] px-5 py-3 font-semibold transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--tint)_28%,transparent)]"
              >
                {d.cta}
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </RevealItem>
          </div>
          <ul className="grid gap-4">
            {d.points.map((p, i) => {
              const Icon = icons[i];
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
