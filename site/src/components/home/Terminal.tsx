"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/pt";

type T = Dictionary["home"]["terminal"];

const COMMAND = "npm create veritas@latest my-app -- --stack vite";

// Cada linha da saída: texto e tom. A árvore é a de um projeto gerado de verdade pela CLI.
const output = (t: T): [string, string][] => [
  [`◇ ${t.stack}: vite`, "text-soft"],
  [`◇ ${t.conventions}: vite, principios, lgpd, atomic-design`, "text-soft"],
  [`✓ ${t.created} my-app/`, "text-mint"],
  ["", ""],
  ["my-app/", "text-ink"],
  ["├── .veritas/", "text-sky"],
  ["│   ├── INDEX.md", "text-sky"],
  ["│   ├── vite/SKILL.md", "text-sky"],
  ["│   ├── lgpd/SKILL.md", "text-sky"],
  ["│   └── principios/SKILL.md", "text-sky"],
  ["├── src/  api/ pages/ routes/ store/", "text-ink"],
  ["├── AGENTS.md", "text-lilac"],
  ["└── CLAUDE.md", "text-lilac"],
  ["", ""],
  [`${t.next}: cd my-app && npm run dev`, "text-peach"],
];

/** Terminal que digita o comando e mostra o projeto nascendo com as convenções dentro; repete em ciclo. */
export function Terminal({ t }: { t: T }) {
  const reduce = useReducedMotion();
  const lines = output(t);
  const [typed, setTyped] = useState(reduce ? COMMAND.length : 0);
  const [shown, setShown] = useState(reduce ? lines.length : 0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) return;
    setTyped(0);
    setShown(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= COMMAND.length; i++) timers.push(setTimeout(() => setTyped(i), 400 + i * 38));
    const afterTyping = 400 + COMMAND.length * 38 + 450;
    for (let i = 1; i <= lines.length; i++) timers.push(setTimeout(() => setShown(i), afterTyping + i * 170));
    timers.push(setTimeout(() => setCycle((c) => c + 1), afterTyping + lines.length * 170 + 4500));
    return () => timers.forEach(clearTimeout);
  }, [cycle, reduce, lines.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/30"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-rose/70" />
        <span className="size-3 rounded-full bg-peach/70" />
        <span className="size-3 rounded-full bg-mint/70" />
        <span className="ml-3 text-small text-soft">{t.title}</span>
      </div>
      <pre className="min-h-[24rem] overflow-hidden p-5 font-mono text-[13px] leading-[1.75] sm:p-6 sm:text-sm">
        <code>
          <span className="text-mint">$ </span>
          <span className="text-ink">{COMMAND.slice(0, typed)}</span>
          {typed < COMMAND.length && <span className="caret" />}
          {"\n"}
          {lines.slice(0, shown).map(([text, tone], i) => (
            <motion.span
              key={`${cycle}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`block ${tone}`}
            >
              {text || " "}
            </motion.span>
          ))}
          {typed === COMMAND.length && shown === lines.length && <span className="caret" />}
        </code>
      </pre>
    </motion.div>
  );
}
