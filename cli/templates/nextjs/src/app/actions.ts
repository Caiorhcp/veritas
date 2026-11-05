'use server';

import { revalidatePath } from 'next/cache';
import { addMessage } from '@/lib/messages';
import { messageSchema } from '@/lib/schemas';
import type { ActionResult } from '@/types/message';

export async function createMessage(input: unknown): Promise<ActionResult> {
  // A action é um endpoint público: valida de novo no servidor.
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' };

  await addMessage(parsed.data);
  revalidatePath('/');
  return { ok: true };
}
