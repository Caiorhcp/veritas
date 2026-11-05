import type { ReactNode } from "react";

/** Abertura das páginas internas: título grande e uma frase. */
export function PageHead({ title, lead, children }: { title: string; lead: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-[90rem] px-4 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
      <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.03em]">{title}</h1>
      <p className="mt-8 max-w-[56ch] text-lead">{lead}</p>
      {children}
    </header>
  );
}
