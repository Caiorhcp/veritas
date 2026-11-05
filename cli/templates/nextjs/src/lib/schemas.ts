import { z } from 'zod';

export const messageSchema = z.object({
  author: z.string().trim().min(2, 'Informe o nome.').max(60),
  text: z.string().trim().min(3, 'Escreva ao menos 3 caracteres.').max(280),
});

export type MessageInput = z.infer<typeof messageSchema>;
