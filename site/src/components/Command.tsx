import type { Dictionary } from "@/i18n/pt";
import { CopyButton } from "./CopyButton";

/** Uma linha de terminal com botão de copiar. */
export function Command({ cmd, copy, className = "", tone = "bg-surface" }: { cmd: string; copy: Dictionary["copy"]; className?: string; tone?: string }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-1 pr-1 pl-4 ${tone} ${className}`}>
      <pre className="min-w-0 overflow-x-auto py-2 font-mono text-small">
        <code>{cmd}</code>
      </pre>
      <CopyButton text={cmd} labels={copy} />
    </div>
  );
}
