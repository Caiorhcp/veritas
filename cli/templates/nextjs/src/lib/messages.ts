import type { MessageInput } from '@/lib/schemas';
import type { Message } from '@/types/message';

// shortcut: memória do processo, some a cada restart; trocar por banco (Prisma ou Drizzle) no primeiro uso real.
const messages: Message[] = [
  { id: 1, author: 'Veritas', text: 'Projeto criado. Leia .veritas/INDEX.md antes de mudar código.', createdAt: new Date().toISOString() },
];

export async function listMessages(): Promise<Message[]> {
  return [...messages].reverse();
}

export async function addMessage(input: MessageInput): Promise<Message> {
  const message: Message = { id: messages.length + 1, ...input, createdAt: new Date().toISOString() };
  messages.push(message);
  return message;
}
