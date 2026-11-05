"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/pt";

type Group = "root" | "code" | "veritas" | "agents";
type Row = { depth: number; name: string; group: Group };

// O que create-veritas new escreve, conferido contra cli/templates e cli/src/lib.ts (writeVeritas)
const veritas = (stack: string): Row[] => [
  { depth: 1, name: ".veritas/", group: "veritas" },
  { depth: 2, name: "INDEX.md", group: "veritas" },
  { depth: 2, name: `${stack}/SKILL.md`, group: "veritas" },
  { depth: 2, name: `${stack}/architecture.md`, group: "veritas" },
  { depth: 2, name: "principios/SKILL.md", group: "veritas" },
  { depth: 2, name: "lgpd/SKILL.md", group: "veritas" },
  { depth: 2, name: "atomic-design/SKILL.md", group: "veritas" },
  { depth: 2, name: "VERSION", group: "veritas" },
];
const agents: Row[] = [
  { depth: 1, name: "AGENTS.md", group: "agents" },
  { depth: 1, name: "CLAUDE.md", group: "agents" },
];

const TREES: Record<"vite" | "nextjs", Row[]> = {
  vite: [
    { depth: 0, name: "my-app/", group: "root" },
    ...veritas("vite"),
    { depth: 1, name: "src/", group: "code" },
    { depth: 2, name: "api/client.ts", group: "code" },
    { depth: 2, name: "pages/HomePage.tsx", group: "code" },
    { depth: 2, name: "routes/AppRoutes.tsx", group: "code" },
    { depth: 2, name: "components/atoms/Button.tsx", group: "code" },
    { depth: 2, name: "services/  store/  types/", group: "code" },
    ...agents,
    { depth: 1, name: "package.json", group: "code" },
    { depth: 1, name: "vite.config.ts", group: "code" },
  ],
  nextjs: [
    { depth: 0, name: "my-app/", group: "root" },
    ...veritas("nextjs"),
    { depth: 1, name: "src/", group: "code" },
    { depth: 2, name: "app/layout.tsx", group: "code" },
    { depth: 2, name: "app/page.tsx", group: "code" },
    { depth: 2, name: "app/actions.ts", group: "code" },
    { depth: 2, name: "components/atoms/Button.tsx", group: "code" },
    { depth: 2, name: "lib/  types/", group: "code" },
    ...agents,
    { depth: 1, name: "package.json", group: "code" },
    { depth: 1, name: "next.config.ts", group: "code" },
  ],
};

const LIT: Group[][] = [["code"], ["veritas"], ["agents"], ["veritas", "agents"]];

/** "Um projeto chega com duas coisas": um controle deslizante percorre as etapas e acende a parte da árvore de cada uma. */
export function TwoThings({ d }: { d: Dictionary["home"]["two"] }) {
  const [stage, setStage] = useState(0);
  const [stack, setStack] = useState<"vite" | "nextjs">("vite");
  const current = d.stages[stage];
  const lit = LIT[stage];
  const command = stage === 3 ? "npx create-veritas init" : `npm create veritas@latest my-app -- --stack ${stack}`;

  return (
    <section id="duas-coisas" aria-labelledby="duas-coisas-titulo" className="grid lg:min-h-[88svh] lg:grid-cols-2">
      <div className="order-2 flex flex-col bg-surface px-4 pt-12 pb-10 sm:px-8 lg:order-1 lg:pt-20">
        <motion.h2
          id="duas-coisas-titulo"
          className="max-w-[18ch] text-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {d.heading}
        </motion.h2>
        <div className="mt-10 min-h-48 lg:mt-auto" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <p className="text-head font-bold tracking-[-0.02em]">{current.clause}</p>
              <p className="mt-4 max-w-[46ch]">{current.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="order-1 flex items-center justify-center overflow-hidden bg-field px-4 py-12 lg:order-2 lg:py-16">
        <div data-ui className="w-full max-w-[27.5rem] bg-paper text-ink">
          <div className="flex items-center justify-between gap-3 bg-sunken px-4 py-2 text-small">
            <span className="font-medium">{d.stack}</span>
            <div role="radiogroup" aria-label={d.stack} className="flex gap-1">
              {(["vite", "nextjs"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={stack === s}
                  onClick={() => setStack(s)}
                  className={`px-2.5 py-1 font-medium transition-[background-color,color,transform] active:scale-95 ${stack === s ? "bg-field text-on-field" : "hover:bg-surface"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <pre className="overflow-x-auto bg-ink px-4 py-3 font-mono text-[0.8125rem] text-paper">
            <code>$ {command}</code>
          </pre>
          <pre className="py-3 font-mono text-[0.875rem] leading-[1.7]">
            <code>
            {TREES[stack].map((row) => {
              const on = lit.includes(row.group);
              const dim = stage === 3 && row.group === "code";
              return (
                <span
                  key={row.name}
                  style={{ paddingLeft: `${1 + row.depth * 1.25}rem` }}
                  className={`block pr-4 transition-[background-color,color,opacity] duration-200 ${on ? "bg-field text-on-field" : ""} ${dim ? "opacity-45" : ""}`}
                >
                  {row.name}
                </span>
              );
            })}
            </code>
          </pre>
        </div>
      </div>

      <div className="order-3 bg-surface px-4 pb-10 sm:px-8 lg:col-span-2 lg:pb-12">
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={stage}
          onChange={(e) => setStage(Number(e.target.value))}
          aria-label={d.rangeLabel}
          aria-valuetext={current.clause}
          className="stage-range w-full"
        />
        <ol className="mt-3 grid grid-cols-2 gap-2 text-small sm:grid-cols-4 sm:text-body">
          {d.stages.map((s, i) => (
            <li key={s.name} className={i === 3 ? "sm:text-right" : i > 0 ? "sm:text-center" : ""}>
              <button type="button" onClick={() => setStage(i)} className={`font-medium transition-colors ${i === stage ? "text-ink" : "text-soft hover:text-ink"}`}>
                {s.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
