import { usePosts } from '@/hooks/usePosts';

export function PostList() {
  const { data, isPending, isError } = usePosts();

  if (isPending) return <p className="text-sm text-slate-500">Carregando posts...</p>;
  if (isError) return <p className="text-sm text-red-600">Não foi possível carregar os posts.</p>;

  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {data.map((post) => (
        <li key={post.id} className="p-4">
          <h3 className="font-medium text-slate-900 first-letter:uppercase">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
