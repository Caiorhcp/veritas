import { Home, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useConfig } from '@/context/ConfigContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`;

export function Header() {
  const { appName } = useConfig();
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <span className="font-semibold text-slate-900">{appName}</span>
        <div className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            <Home size={16} aria-hidden /> Início
          </NavLink>
          <NavLink to="/contato" className={linkClass}>
            <Mail size={16} aria-hidden /> Contato
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
