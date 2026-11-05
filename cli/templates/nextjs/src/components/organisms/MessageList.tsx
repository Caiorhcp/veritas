import type { Message } from '@/types/message';

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {messages.map((m) => (
        <li key={m.id} className="p-4">
          <p className="text-sm text-slate-900">{m.text}</p>
          <p className="mt-1 text-xs text-slate-500">
            {m.author} · <time dateTime={m.createdAt}>{new Date(m.createdAt).toLocaleString('pt-BR')}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
