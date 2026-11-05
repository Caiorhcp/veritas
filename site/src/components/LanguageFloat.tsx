"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HTML_LANG, type Locale, LOCALE_COOKIE, LOCALE_NAME, LOCALES } from "@/i18n/config";
import { Flag } from "./Flag";

const TOP_FLAG = "idioma-topo";

/** Botão flutuante no canto: abre, para cima, um menu com as línguas e suas bandeiras. */
export function LanguageFloat({ lang, label }: { lang: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rest = usePathname().replace(/^\/(pt|en|es)(?=\/|$)/, "");

  // Depois de trocar o idioma, a página nova abre do topo (sem pular para outra seção)
  useEffect(() => {
    try {
      if (sessionStorage.getItem(TOP_FLAG) !== lang) return;
      sessionStorage.removeItem(TOP_FLAG);
    } catch {
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.ul
            id="menu-idioma"
            aria-label={label}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 bottom-full mb-3 w-48 origin-bottom-right bg-paper p-1.5 shadow-lg" /* taste-skill-ignore: flutua sobre a página */
          >
            {LOCALES.map((l) => (
              <li key={l}>
                <Link
                  href={`/${l}${rest}`}
                  hrefLang={HTML_LANG[l]}
                  lang={HTML_LANG[l]}
                  aria-current={l === lang ? "true" : undefined}
                  scroll={false}
                  onClick={() => {
                    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
                    try {
                      sessionStorage.setItem(TOP_FLAG, l);
                    } catch {
                      // sem sessionStorage: o Next mantém a rolagem padrão
                    }
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                    l === lang ? "bg-field font-medium text-on-field" : "hover:bg-surface"
                  }`}
                >
                  <Flag locale={l} className="size-6 shrink-0 rounded-full" />
                  {LOCALE_NAME[l]}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`${label}: ${LOCALE_NAME[lang]}`}
        aria-expanded={open}
        aria-controls="menu-idioma"
        className="grid size-14 place-items-center rounded-full bg-paper shadow-lg transition-transform hover:scale-105 active:scale-95" /* taste-skill-ignore: botão flutuante */
      >
        <Flag locale={lang} className="size-8 rounded-full" />
      </button>
    </div>
  );
}
