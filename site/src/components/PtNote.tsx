/** Aviso, em en e es, de que o texto das convenções está em português. */
export function PtNote({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="mt-8 inline-flex max-w-[60ch] items-start gap-3 bg-surface px-4 py-3 text-small">
      <span aria-hidden className="mt-1.5 size-2.5 shrink-0 bg-accent" />
      {text}
    </p>
  );
}
