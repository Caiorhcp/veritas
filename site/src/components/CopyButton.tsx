"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, labels, className = "" }: { text: string; labels: { copy: string; copied: string; label: string }; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      // sem permissão de área de transferência: o comando continua selecionável na tela
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${labels.label}: ${text}`}
      className={`inline-flex shrink-0 items-center gap-1.5 px-3 py-2 pointer-coarse:min-h-11 text-small font-medium transition-[background-color,transform] hover:bg-sunken active:scale-95 ${className}`}
    >
      {done ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite">{done ? labels.copied : labels.copy}</span>
    </button>
  );
}
