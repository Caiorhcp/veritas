import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { LINKS } from "@/lib/site";
import { Wordmark } from "./Logo";
import { Search } from "./Search";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ lang, d }: { lang: Locale; d: Dictionary }) {
  const links = [
    { href: `/${lang}/skills`, label: d.nav.skills },
    { href: `/${lang}/cli`, label: d.nav.cli },
    { href: `/${lang}/comecar`, label: d.nav.start },
  ];
  return (
    <header className="sticky top-0 z-40 bg-ground">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-4 sm:px-8">
        <Link href={`/${lang}`} className="text-lead transition-opacity hover:opacity-75">
          <Wordmark />
        </Link>
        <nav aria-label={d.nav.menu} className="ml-6 hidden gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-2 font-medium transition-colors hover:bg-surface">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Search lang={lang} d={d} />
          <a href={LINKS.repo} className="hidden px-3 py-2 font-medium transition-colors hover:bg-surface sm:block">
            {d.nav.github}
          </a>
          <ThemeToggle toLight={d.nav.toLight} toDark={d.nav.toDark} />
        </div>
      </div>
      <nav aria-label={d.nav.menu} className="flex gap-1 overflow-x-auto px-2 pb-2 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0 px-3 py-1.5 font-medium transition-colors hover:bg-surface">
            {l.label}
          </Link>
        ))}
        <a href={LINKS.repo} className="shrink-0 px-3 py-1.5 font-medium sm:hidden">
          {d.nav.github}
        </a>
      </nav>
    </header>
  );
}
