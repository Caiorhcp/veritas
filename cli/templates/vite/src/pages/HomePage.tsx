import { Button } from '@/components/atoms/Button';
import { PostList } from '@/components/organisms/PostList';
import { useCounterStore } from '@/store/useCounterStore';

export function HomePage() {
  const { count, increment, reset } = useCounterStore();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold">Início</h1>
        <p className="mt-1 text-slate-600">Rotas, estado global, API e formulário já ligados.</p>
      </section>

      <section className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Estado global (Zustand): {count}</span>
        <Button size="sm" onClick={increment}>+1</Button>
        <Button size="sm" variant="ghost" onClick={reset}>Zerar</Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Posts (Axios + TanStack Query)</h2>
        <PostList />
      </section>
    </div>
  );
}
