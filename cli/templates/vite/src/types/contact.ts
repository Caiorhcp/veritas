import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome.'),
  email: z.email('E-mail inválido.'),
  message: z.string().trim().min(10, 'Escreva ao menos 10 caracteres.'),
});

export type ContactInput = z.infer<typeof contactSchema>;
