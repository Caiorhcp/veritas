"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("tema", next);
    } catch {
      // aba privada sem armazenamento: o tema vale só nesta visita
    }
    setDark(!dark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? toLight : toDark}
      className="grid size-10 place-items-center transition-[background-color,transform] hover:bg-surface active:scale-90"
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
