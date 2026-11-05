"use client";

import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pt";
import type { SearchEntry } from "@/lib/search";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Busca nas skills: abre com "/" (fora de campos de texto), navega com as setas, fecha com Esc. */
export function Search({ lang, d }: { lang: Locale; d: Dictionary }) {
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const terms = norm(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((e) => e.kind !== "section").slice(0, 12);
    return index
      .map((e) => {
        const title = norm(e.title);
        const all = `${title} ${norm(e.text)}`;
        if (!terms.every((t) => all.includes(t))) return null;
        const score = (title.startsWith(terms[0]) ? 4 : 0) + (terms.every((t) => title.includes(t)) ? 2 : 0) + (e.kind === "skill" ? 1 : 0);
        return { e, score };
      })
      .filter((r): r is { e: SearchEntry; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.e);
  }, [index, query]);

  const open = () => {
    dialog.current?.showModal();
    // o índice só é baixado na primeira vez que a busca abre
    if (!index.length) fetch(`/${lang}/search.json`).then((r) => r.json()).then(setIndex, () => {});
    input.current?.select();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || target.closest("input, textarea, [contenteditable=true]")) return;
      e.preventDefault();
      open();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  useEffect(() => setActive(0), [query]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
    else if (e.key === "Enter" && results[active]) {
      dialog.current?.close();
      router.push(results[active].href);
    } else return;
    e.preventDefault();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-keyshortcuts="/"
        className="flex h-10 items-center gap-2 bg-surface px-3 text-small text-soft transition-[background-color,color,transform] hover:bg-sunken hover:text-ink active:scale-95"
      >
        <SearchIcon size={16} aria-hidden />
        <span className="hidden lg:inline">{d.nav.searchHint}</span>
        <span className="sr-only lg:hidden">{d.nav.search}</span>
        <kbd className="hidden bg-ground px-1.5 font-sans font-medium text-ink lg:inline">/</kbd>
      </button>
      <dialog
        ref={dialog}
        aria-label={d.search.label}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-0 mx-auto mt-[8vh] w-[min(40rem,calc(100vw-2rem))] max-w-none bg-paper p-0 text-ink shadow-2xl" /* taste-skill-ignore: flutua sobre a página */
      >
        <div className="flex items-center gap-3 bg-surface px-4">
          <SearchIcon size={18} aria-hidden className="shrink-0" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder={d.search.placeholder}
            aria-label={d.search.label}
            aria-controls="resultados-busca"
            className="h-14 min-w-0 flex-1 bg-transparent text-lead outline-none placeholder:text-soft"
          />
          <button type="button" onClick={() => dialog.current?.close()} aria-label={d.search.close} className="grid size-9 place-items-center hover:bg-sunken active:scale-90">
            <X size={18} aria-hidden />
          </button>
        </div>
        <ul id="resultados-busca" className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-soft">{d.search.empty}</li>}
          {results.map((r, i) => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => dialog.current?.close()}
                onMouseEnter={() => setActive(i)}
                aria-current={i === active ? "true" : undefined}
                className={`flex items-baseline justify-between gap-4 px-3 py-2.5 ${i === active ? "bg-field text-on-field" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block font-medium">{r.title}</span>
                  <span className={`line-clamp-1 text-small ${i === active ? "text-on-field-soft" : "text-soft"}`}>{r.text}</span>
                </span>
                <span className={`shrink-0 text-small ${i === active ? "text-on-field-soft" : "text-soft"}`}>{d.search.kinds[r.kind]}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="bg-surface px-5 py-2.5 text-small text-soft">{d.search.hint}</p>
      </dialog>
    </>
  );
}
