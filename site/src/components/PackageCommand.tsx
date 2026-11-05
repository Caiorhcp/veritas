"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/pt";
import { CopyButton } from "./CopyButton";

const MANAGERS = ["npm", "pnpm", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

/** Mesmo comando nos três gerenciadores: `npm create` pede o @latest, pnpm e bun já buscam a última versão. */
export const createCommand = (pm: Manager, args: string) =>
  pm === "npm" ? `npm create veritas@latest ${args}` : `${pm} create veritas ${args}`;

export function PackageCommand({ args = "my-app", copy, label }: { args?: string; copy: Dictionary["copy"]; label: string }) {
  const [pm, setPm] = useState<Manager>("npm");
  const cmd = createCommand(pm, args);
  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-1">
        {MANAGERS.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={m === pm}
            onClick={() => setPm(m)}
            className={`tab-cut px-4 pt-1.5 pb-1 text-small font-medium transition-[background-color,color,transform] active:scale-95 ${
              m === pm ? "bg-surface text-ink" : "text-soft hover:text-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="flex items-center justify-between gap-3 bg-surface py-1 pr-1 pl-4">
        <pre className="min-w-0 overflow-x-auto py-2.5 font-mono text-small sm:text-base">
          <code>{cmd}</code>
        </pre>
        <CopyButton text={cmd} labels={copy} />
      </div>
    </div>
  );
}
