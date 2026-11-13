"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { href: string; label: string };

/** Menu do celular (abaixo de md): botão que abre a lista de páginas. Esc ou toque fora fecha e devolve o foco ao botão. */
export function MobileMenu({ links, label }: { links: Item[]; label: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLAnchorElement>("#menu-celular a")?.focus();
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key !== "Escape" : root.current?.contains(e.target as Node)) return;
      setOpen(false);
      if (e instanceof KeyboardEvent) button.current?.focus();
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="md:hidden">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="menu-celular"
        aria-label={label}
        className="grid size-11 place-items-center transition-[background-color,transform] hover:bg-surface active:scale-90"
      >
        {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
      </button>
      <nav id="menu-celular" aria-label={label} hidden={!open} className="absolute inset-x-0 top-full border-b border-line bg-ground px-2 pb-3">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} className="block px-3 py-3 font-medium hover:bg-surface aria-[current=page]:bg-surface">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
