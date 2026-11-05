// A marca: um bloco com um V recortado no alto. O V de Veritas é também o entalhe de um calibre,
// a medida fixa contra a qual se confere o que é verdadeiro.
export const MARK_PATH = "M0 0H11L16 10L21 0H32V32H0Z";

export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
      <Mark className="size-[1.1em]" />
      Veritas
    </span>
  );
}
