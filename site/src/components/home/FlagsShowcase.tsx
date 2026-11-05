"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { Command } from "../Command";
import { Reveal, RevealItem } from "../Reveal";

const STACKS = ["vite", "nextjs"] as const;

/** O controle de que tudo depende, ampliado: trocar a stack troca o campo de cor e o comando inteiro. */
export function FlagsShowcase({ lang, d, copy }: { lang: Locale; d: Dictionary["home"]["flags"]; copy: Dictionary["copy"] }) {
  const [stack, setStack] = useState<(typeof STACKS)[number]>("vite");
  const full = `npx create-veritas new my-app --stack ${stack} --skills ${stack},principios,lgpd,atomic-design --no-install`;
  return (
    <section
      id="flags"
      aria-labelledby="flags-titulo"
      className={`relative overflow-hidden text-on-field transition-colors duration-500 md:min-h-[92svh] ${stack === "vite" ? "bg-field" : "bg-field-deep"}`}
    >
      <Reveal className="relative z-10 px-4 pt-16 pb-10 sm:px-8 md:max-w-[52%] md:pt-24 md:pb-24">
        <RevealItem>
          <h2 id="flags-titulo" className="text-head">
            {d.heading}
          </h2>
          <p className="mt-6 max-w-[46ch]">{d.text}</p>
        </RevealItem>
        <RevealItem>
        <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
          {d.list.map((f) => (
            <div key={f.flag} className="contents">
              <dt>
                <code className="font-mono text-small">{f.flag}</code>
              </dt>
              <dd className="text-on-field-soft">{f.text}</dd>
            </div>
          ))}
        </dl>
        </RevealItem>
        <RevealItem>
        <Command cmd={full} copy={copy} className="mt-10" tone="bg-on-field text-field [&_button:hover]:bg-on-field-soft" />
        <Link href={`/${lang}/cli`} className="mt-6 inline-block font-medium underline underline-offset-4 hover:no-underline">
          {d.reference} →
        </Link>
        </RevealItem>
      </Reveal>

      <div data-ui className="relative z-10 mx-4 mb-[60vw] bg-ink text-paper sm:mx-8 md:absolute md:top-24 md:right-8 md:mx-0 md:mb-0 md:w-[min(34rem,42vw)]">
        <p className="bg-on-field-soft px-4 py-2 text-small font-medium text-field">{d.terminal}</p>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8125rem] leading-[1.7]">
          <code>
            <span className="block">$ npx create-veritas new my-app{d.langFlag} &lt; /dev/null</span>
            <span className="block whitespace-pre-wrap opacity-75">{d.errorLine}</span>
            <span className="block">$ echo $?</span>
            <span className="block">1</span>
            <span className="block">$ npx create-veritas new my-app --stack {stack} --no-install{d.langFlag}</span>
            <span className="block opacity-75">{d.doneLine}</span>
          </code>
        </pre>
      </div>

      <div
        data-ui
        role="radiogroup"
        aria-label={d.control}
        className="absolute right-[-12vw] bottom-[-3vw] flex items-center gap-[0.3em] text-[22vw] leading-none md:right-[-6vw] md:bottom-[-2vw] md:text-[clamp(6rem,9.5vw,10rem)]"
      >
        <code className="pr-[0.15em] font-mono text-[0.35em] text-on-field-soft">{d.control}</code>
        <div className="flex bg-on-field p-[0.06em]">
          {STACKS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={stack === s}
              onClick={() => setStack(s)}
              className={`px-[0.3em] pt-[0.06em] pb-[0.12em] font-bold tracking-[-0.04em] transition-[background-color,color] duration-300 ${
                stack === s ? "bg-field text-on-field" : "text-field hover:bg-on-field-soft"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
