"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/i18n/pt";
import { Mark } from "../Logo";
import { Reveal, RevealItem } from "../Reveal";

export type SheetItem = { name: string; href: string; line: string; checked: string; group: "geral" | "processo" | "manual"; sections: string[] };

/**
 * As skills gerais numa folha impressa, como um cardápio: o nome à esquerda e, no lugar do preço,
 * contra o que ela foi conferida. Apontar uma linha mostra as seções do SKILL.md no quadro ao lado.
 */
export function GeneralSheet({ items, d }: { items: SheetItem[]; d: Dictionary["home"]["general"] }) {
  const [active, setActive] = useState(items[0]);
  const groups = (["geral", "processo", "manual"] as const).map((g) => ({ g, rows: items.filter((i) => i.group === g) }));
  return (
    <section id="skills-gerais" aria-labelledby="gerais-titulo" className="px-2.5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-12">
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                data-ui
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                className="rounded-3xl border border-line bg-field p-8 text-on-field"
              >
                <code className="block font-mono text-small text-on-field-soft">skills/{active.name}/SKILL.md</code>
                <p className="mt-6 text-head font-bold break-words">{active.name}</p>
                <p className="mt-4 max-w-[40ch]">{active.line}</p>
                <p className="mt-8 text-small font-bold">{d.previewLabel}</p>
                <ul className="notch-bullet mt-3 space-y-1.5 text-small text-on-field-soft">
                  {active.sections.slice(0, 8).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-paper px-5 py-16 sm:px-16 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <Mark className="mx-auto size-8" />
          <h2 id="gerais-titulo" className="mt-6 text-center text-head">
            {d.heading}
          </h2>
          <p className="mt-3 text-center text-small text-soft">{d.note}</p>
          <Reveal>
          {groups.map(({ g, rows }) => (
            <RevealItem key={g} className="mt-14">
              <h3 className="text-center text-lead">{d.groups[g]}</h3>
              <ul className="mt-6 space-y-4">
                {rows.map((r) => (
                  <li key={r.name} onMouseEnter={() => setActive(r)} onFocus={() => setActive(r)}>
                    <Link href={r.href} className={`group block rounded-lg px-3 py-2 transition-colors hover:bg-surface ${active.name === r.name ? "md:bg-surface" : ""}`}>
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="font-bold group-hover:underline group-hover:underline-offset-4">{r.name}</span>
                        <span className="tabular shrink-0 text-right text-small">{r.checked}</span>
                      </span>
                      <span className="mt-0.5 block text-small text-soft">{r.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
          </Reveal>
          <div className="mt-14 text-center text-small">
            <p>{d.footer[0]}</p>
            <p>{d.footer[1]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
