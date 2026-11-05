import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'App',
  description: 'Criado com create-veritas',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
