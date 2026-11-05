import { GitPullRequest } from "lucide-react";
import type { Dictionary } from "@/i18n/pt";
import { LINKS } from "@/lib/site";
import { Reveal, RevealItem } from "../Reveal";

/** Fechamento: um cartão largo chamando para o repositório. */
export function Contribute({ d }: { d: Dictionary["home"]["contribute"] }) {
  return (
    <section aria-labelledby="contribuir-titulo" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <RevealItem>
          <div
            style={{ "--tint": "var(--lilac)" } as React.CSSProperties}
            className="tinted glow relative overflow-hidden rounded-3xl px-7 py-14 text-center sm:px-14 sm:py-20"
          >
            <h2 id="contribuir-titulo" className="text-head">
              {d.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-lead text-soft">{d.text}</p>
            <a
              href={LINKS.repo}
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-on-accent transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-95"
            >
              <GitPullRequest size={18} aria-hidden />
              {d.action}
            </a>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
