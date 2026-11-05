import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { Command } from "../Command";
import { PackageCommand } from "../PackageCommand";
import { Reveal, RevealItem } from "../Reveal";

/**
 * Primeira tela: o nome, uma frase e uma pilha de pastas. As pastas são as seções da página,
 * como as pastas de .veritas/ são as convenções do projeto; a da frente está aberta e traz os comandos.
 */
export function Hero({ lang, d }: { lang: Locale; d: Dictionary }) {
  const h = d.home;
  const back = [
    { href: "#skills-gerais", label: h.tabs.skills, tone: "bg-field-deep text-on-field", tab: "left-[4%] sm:left-[6%]" },
    { href: "#flags", label: h.tabs.flags, tone: "bg-field text-on-field", tab: "left-[38%] sm:left-[30%]" },
    { href: "#stacks", label: h.tabs.stacks, tone: "bg-sunken text-ink", tab: "right-[4%] sm:left-[54%] sm:right-auto" },
    { href: "#duas-coisas", label: h.tabs.two, tone: "bg-surface text-ink", tab: "left-[20%] sm:left-auto sm:right-[6%]" },
  ];
  return (
    <section aria-labelledby="titulo" className="overflow-hidden">
      <div className="px-4 pt-10 text-center sm:px-8 sm:pt-14">
        <h1 id="titulo" className="text-[17vw] leading-[0.85] font-bold tracking-[-0.03em] sm:text-display">
          {h.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[46ch] text-body sm:text-lead">{h.lead}</p>
      </div>

      <Reveal className="mx-auto mt-16 w-full sm:mt-20 sm:w-[86%]">
        {back.map((f) => (
          <RevealItem key={f.href} className={`relative h-[3.25rem] sm:h-16 ${f.tone}`}>
            <a
              href={f.href}
              className={`folder-tab absolute bottom-full flex h-8 items-center px-7 text-small font-medium transition-transform hover:-translate-y-1 sm:h-10 sm:px-9 sm:text-body ${f.tone} ${f.tab}`}
            >
              {f.label}
            </a>
          </RevealItem>
        ))}
        <RevealItem className="relative bg-paper px-5 pt-8 pb-14 sm:px-8 sm:pb-16">
          <span className="folder-tab absolute bottom-full left-[52%] flex h-8 items-center bg-paper px-7 text-small font-medium sm:left-[12%] sm:h-10 sm:px-9 sm:text-body">
            {h.tabs.install}
          </span>
          <div className="grid gap-10 lg:grid-cols-[auto_1fr_1fr] lg:items-end">
            <Link
              href={`/${lang}/comecar`}
              className="tab-cut block bg-accent px-7 py-4 text-center text-lead font-bold text-on-accent transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.97] sm:inline-block lg:self-start"
            >
              {h.primary}
            </Link>
            <div>
              <p className="mb-3 font-medium">{h.newProject}</p>
              <PackageCommand copy={d.copy} label={h.newProject} />
            </div>
            <div>
              <p className="mb-3 font-medium">{h.claudeCode}</p>
              <div className="space-y-1.5">
                <Command cmd="/plugin marketplace add Caiorhcp/veritas" copy={d.copy} />
                <Command cmd="/plugin install veritas@veritas" copy={d.copy} />
              </div>
            </div>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
