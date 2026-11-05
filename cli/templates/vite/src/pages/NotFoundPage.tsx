import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <Link to="/" className="text-sm text-slate-600 underline">Voltar ao início</Link>
    </div>
  );
}
