import type { Dictionary } from "@/i18n/pt";
import { LINKS } from "@/lib/site";
import { Reveal, RevealItem } from "../Reveal";

/** O fechamento é uma fileira do quadro: a peça do meio chama para o repositório; as das pontas saem da tela. */
export function Contribute({ d }: { d: Dictionary["home"]["contribute"] }) {
  return (
    <section aria-labelledby="contribuir-titulo" className="overflow-hidden py-28 sm:py-40">
      <Reveal className="grid grid-cols-2 gap-2 md:-mx-[6vw] md:grid-cols-12 md:gap-3">
        <RevealItem className="order-2 h-32 overflow-hidden md:order-1 md:col-span-2 md:h-[22.5rem]">
          {/* eslint-disable-next-line @next/next/no-img-element -- foto local, já no tamanho certo */}
          <img src="/img/teto.jpg" alt={d.photoAlt} width={900} height={1200} loading="lazy" className="size-full object-cover transition-transform duration-[2s] hover:scale-105" />
        </RevealItem>
        <RevealItem className="order-1 col-span-2 flex flex-col justify-center bg-accent p-7 text-on-accent sm:p-10 md:order-2 md:col-span-8 md:h-[22.5rem]">
          <h2 id="contribuir-titulo" className="text-head">
            {d.heading}
          </h2>
          <p className="mt-4 max-w-[52ch]">{d.text}</p>
          <a
            href={LINKS.repo}
            className="tab-cut mt-8 inline-block self-start bg-on-accent px-6 py-3 font-bold text-accent transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            {d.action}
          </a>
        </RevealItem>
        <RevealItem className="order-3 h-32 overflow-hidden md:col-span-2 md:h-[22.5rem]">
          {/* eslint-disable-next-line @next/next/no-img-element -- foto local, já no tamanho certo */}
          <img src="/img/fachada.jpg" alt={d.photoAlt2} width={900} height={1200} loading="lazy" className="size-full object-cover transition-transform duration-[2s] hover:scale-105" />
        </RevealItem>
      </Reveal>
    </section>
  );
}
