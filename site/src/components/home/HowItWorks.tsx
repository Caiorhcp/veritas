import { Bot, FileCode2, FolderTree, RefreshCw } from "lucide-react";
import type { Dictionary } from "@/i18n/pt";
import { Reveal, RevealItem } from "../Reveal";

const ICONS = [FileCode2, FolderTree, Bot, RefreshCw];
const TINTS = ["var(--sky)", "var(--lilac)", "var(--mint)", "var(--peach)"];

/** As quatro peças do que a CLI entrega, em cartões lado a lado. */
export function HowItWorks({ d, how }: { d: Dictionary["home"]["two"]; how: Dictionary["home"]["how"] }) {
  return (
    <section id="duas-coisas" aria-labelledby="como-titulo" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <RevealItem className="max-w-2xl">
          <h2 id="como-titulo" className="text-head">
            {how.heading}
          </h2>
          <p className="mt-5 text-lead text-soft">{how.lead}</p>
        </RevealItem>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.stages.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <RevealItem key={s.name}>
                <article
                  style={{ "--tint": TINTS[i] } as React.CSSProperties}
                  className="tinted group h-full rounded-2xl p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1"
                >
                  <span className="tint-text grid size-11 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--tint)_16%,transparent)] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} aria-hidden />
                  </span>
                  <p className="tint-text mt-6 font-mono text-small">{s.name}</p>
                  <h3 className="mt-1.5 text-lead font-semibold">{s.clause}</h3>
                  <p className="mt-3 text-soft">{s.text}</p>
                </article>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
