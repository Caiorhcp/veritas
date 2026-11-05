import { MessageForm } from '@/components/organisms/MessageForm';
import { MessageList } from '@/components/organisms/MessageList';
import { listMessages } from '@/lib/messages';

// Server Component: lê os dados direto no servidor, sem fetch no cliente.
export default async function HomePage() {
  const messages = await listMessages();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold">Mural</h1>
        <p className="mt-1 text-slate-600">Server Component lendo os dados; Server Action gravando.</p>
      </section>
      <MessageForm />
      <MessageList messages={messages} />
    </div>
  );
}
