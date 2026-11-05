import { MessagesSquare } from 'lucide-react';
import type { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 font-semibold">
          <MessagesSquare size={18} aria-hidden /> App
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </>
  );
}
