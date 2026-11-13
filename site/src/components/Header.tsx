import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import { LINKS } from "@/lib/site";
import { Wordmark } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Search } from "./Search";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ lang, d }: { lang: Locale; d: Dictionary }) {
  const links = [
    { href: `/${lang}/skills`, label: d.nav.skills },
    { href: `/${lang}/cli`, label: d.nav.cli },
    { href: `/${lang}/extensao`, label: d.nav.extension },
    { href: `/${lang}/comecar`, label: d.nav.start },
  ];
  return (
    <header className="sticky top-0 z-40 bg-ground">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-4 sm:px-8">
        <Link href={`/${lang}`} className="tap text-lead transition-opacity hover:opacity-75">
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
          <a href={LINKS.repo} className="hidden px-3 py-2 font-medium transition-colors hover:bg-surface md:block">
            {d.nav.github}
          </a>
          <ThemeToggle toLight={d.nav.toLight} toDark={d.nav.toDark} />
          <MobileMenu links={[...links, { href: LINKS.repo, label: d.nav.github }]} label={d.nav.menu} />
        </div>
      </div>
    </header>
  );
}
