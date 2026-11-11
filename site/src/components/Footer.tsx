import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { LINKS } from "@/lib/site";
import { Mark } from "./Logo";

// O nome fecha a página construído em blocos: cada letra recortada do seu próprio retângulo.
const BLOCKS = [
  { letter: "V", h: "100%" },
  { letter: "E", h: "78%" },
  { letter: "R", h: "88%" },
  { letter: "I", h: "64%" },
  { letter: "T", h: "94%" },
  { letter: "A", h: "72%" },
  { letter: "S", h: "84%" },
];

export function Footer({ lang, d }: { lang: Locale; d: Dictionary }) {
  const columns = [
    {
      title: d.footer.columns.site,
      links: [
        { href: `/${lang}`, label: d.nav.home },
        { href: `/${lang}/skills`, label: d.nav.skills },
        { href: `/${lang}/cli`, label: d.nav.cli },
        { href: `/${lang}/extensao`, label: d.nav.extension },
        { href: `/${lang}/comecar`, label: d.nav.start },
      ],
    },
    {
      title: d.footer.columns.project,
      links: [
        { href: LINKS.repo, label: d.footer.repo },
        { href: LINKS.releases, label: d.footer.releases },
        { href: LINKS.issues, label: d.footer.issues },
        { href: LINKS.license, label: d.footer.license },
      ],
    },
    {
      title: d.footer.columns.elsewhere,
      links: [
        { href: LINKS.npm, label: d.footer.npm },
        { href: LINKS.author, label: "Caio Gonçalves" },
        { href: LINKS.prumo, label: "Prumo" },
        { href: LINKS.ponytail, label: "Ponytail" },
        { href: LINKS.graphify, label: "Graphify" },
      ],
    },
  ];
  return (
    <footer className="bg-field text-on-field">
      <div className="mx-auto max-w-[90rem] px-4 pt-24 pb-10 sm:px-8">
        <div aria-hidden className="flex h-[22svh] items-end gap-1 sm:h-[34svh]">
          <div className="grid h-full basis-[14%] place-items-center bg-on-field text-field">
            <Mark className="w-1/2" />
          </div>
          {BLOCKS.map((b) => (
            <div key={b.letter} style={{ height: b.h }} className="flex flex-1 items-end justify-center overflow-hidden bg-on-field text-field">
              <span className="translate-y-[0.12em] text-[clamp(2.5rem,11vw,11rem)] leading-[0.8] font-bold">{b.letter}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-lead font-bold">{d.footer.claim}</p>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
          {columns.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <h2 className="text-small font-bold">{c.title}</h2>
              <ul className="mt-3 space-y-2 text-small">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-on-field-soft transition-colors hover:text-on-field">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 space-y-2 text-small md:col-span-4 md:col-start-9">
            <p>
              {d.footer.by} <a href={LINKS.author} className="underline underline-offset-4">Caio Gonçalves</a> · {d.footer.license}
            </p>
            <p className="text-on-field-soft">
              <a href={LINKS.prumo} className="underline underline-offset-4 hover:text-on-field">{d.footer.inspired}</a>
            </p>
            <p className="text-on-field-soft">
              <a href={LINKS.ponytail} className="underline underline-offset-4 hover:text-on-field">{d.footer.photo}</a>
            </p>
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between gap-4 text-small">
          <p>© {new Date().getFullYear()} Caio Gonçalves</p>
          <a href="#conteudo" className="tab-cut bg-on-field px-4 py-2 font-medium text-field transition-transform hover:-translate-y-0.5 active:scale-95">
            {d.footer.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
