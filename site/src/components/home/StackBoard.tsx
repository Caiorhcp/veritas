import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { getSkill } from "@/lib/skills";
import { STACKS } from "@/lib/stacks";
import { Reveal, RevealItem } from "../Reveal";

/** Um quadro de peças: cada stack é uma peça com o trecho de código que a resume, ampliado e cortado pela borda. */
export function StackBoard({ lang, d }: { lang: Locale; d: Dictionary["home"]["stacks"] }) {
  return (
    <section id="stacks" aria-labelledby="stacks-titulo" className="px-2.5 py-28 sm:py-40">
      <Reveal className="grid auto-rows-auto grid-cols-1 gap-2 md:grid-flow-dense md:auto-rows-[8.5rem] md:grid-cols-12">
        <RevealItem className="flex flex-col justify-between bg-ground px-2 py-4 sm:px-6 md:col-span-6 md:row-span-2">
          <h2 id="stacks-titulo" className="text-head">
            {d.heading}
          </h2>
          <p className="mt-6 max-w-[52ch]">{d.lead}</p>
        </RevealItem>
        {STACKS.map((s) => {
          const verified = getSkill(s.name)?.verified;
          const big = s.span.includes("row-span-4");
          return (
            <RevealItem key={s.name} className={`${s.span} min-h-64`}>
              <Link href={`/${lang}/skills/${s.name}`} className={`group relative flex h-full flex-col justify-end overflow-hidden p-5 sm:p-6 ${s.tone}`}>
                <code
                  data-ui
                  aria-hidden
                  className={`pointer-events-none absolute top-4 left-5 font-mono leading-none font-bold whitespace-nowrap opacity-15 transition-transform duration-500 group-hover:translate-x-2 sm:left-6 ${
                    big ? "text-[clamp(5rem,11vw,10rem)]" : "text-[clamp(3.5rem,6vw,5.5rem)]"
                  }`}
                >
                  {s.snippet}
                </code>
                <div className="relative">
                  <h3 className="text-lead">{s.label}</h3>
                  <p className="mt-1 text-small opacity-80">
                    {d.verified} {s.product && verified ? `${s.product} ${verified}` : d.authored} · {s.cli ? `${d.generates} ${s.name}` : d.conventionOnly}
                  </p>
                  <p className={`mt-3 max-w-[48ch] ${big ? "" : "text-small"}`}>{d.items[s.name]}</p>
                  <p className="mt-3 text-small opacity-80">{s.libs}</p>
                  {big && <span className="mt-4 inline-flex items-center gap-2 text-small font-medium underline-offset-4 group-hover:underline">{d.open} →</span>}
                </div>
              </Link>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}
