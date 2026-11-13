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
    <section id="flags" aria-labelledby="flags-titulo" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-12 rounded-3xl border border-line bg-field p-7 text-on-field sm:p-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <RevealItem>
            <h2 id="flags-titulo" className="text-head">
              {d.heading}
            </h2>
            <p className="mt-5 max-w-[46ch] text-lead text-on-field-soft">{d.text}</p>
          </RevealItem>
          <RevealItem>
            <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
              {d.list.map((f) => (
                <div key={f.flag} className="contents">
                  <dt>
                    <code className="rounded-md bg-[color-mix(in_srgb,var(--sky)_14%,transparent)] px-2 py-0.5 font-mono text-small text-sky">{f.flag}</code>
                  </dt>
                  <dd className="text-on-field-soft">{f.text}</dd>
                </div>
              ))}
            </dl>
          </RevealItem>
          <RevealItem>
            <Link href={`/${lang}/cli`} className="tap mt-10 inline-block font-medium text-accent underline-offset-4 hover:underline">
              {d.reference} →
            </Link>
          </RevealItem>
        </Reveal>

        <Reveal className="flex flex-col gap-4">
          <RevealItem>
            <div role="radiogroup" aria-label={d.control} className="flex w-fit items-center gap-1 rounded-xl bg-field-deep p-1">
              <code className="px-3 font-mono text-small text-on-field-soft">{d.control}</code>
              {STACKS.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={stack === s}
                  onClick={() => setStack(s)}
                  className={`rounded-lg px-4 py-1.5 text-small font-semibold pointer-coarse:min-h-11 transition-[background-color,color] duration-300 ${
                    stack === s ? "bg-accent text-on-accent" : "text-on-field-soft hover:text-on-field"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </RevealItem>
          <RevealItem>
            <div data-ui className="overflow-hidden rounded-2xl border border-line bg-ground">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-rose/70" />
                <span className="size-2.5 rounded-full bg-peach/70" />
                <span className="size-2.5 rounded-full bg-mint/70" />
                <span className="ml-2 text-small text-soft">{d.terminal}</span>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.8125rem] leading-[1.75]">
                <code>
                  <span className="block text-ink">
                    <span className="text-mint">$ </span>npx create-veritas new my-app{d.langFlag} &lt; /dev/null
                  </span>
                  <span className="block whitespace-pre-wrap text-rose">{d.errorLine}</span>
                  <span className="block text-ink">
                    <span className="text-mint">$ </span>echo $?
                  </span>
                  <span className="block text-soft">1</span>
                  <span className="block text-ink">
                    <span className="text-mint">$ </span>npx create-veritas new my-app --stack <span className="text-sky">{stack}</span> --no-install{d.langFlag}
                  </span>
                  <span className="block text-mint">✓ {d.doneLine}</span>
                </code>
              </pre>
            </div>
          </RevealItem>
          <RevealItem>
            <Command cmd={full} copy={copy} className="rounded-xl" tone="bg-field-deep" />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
