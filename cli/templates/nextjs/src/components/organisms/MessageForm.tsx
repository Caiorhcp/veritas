'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { createMessage } from '@/app/actions';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { messageSchema, type MessageInput } from '@/lib/schemas';

export function MessageForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageInput>({ resolver: zodResolver(messageSchema) });

  const onSubmit = (data: MessageInput) =>
    startTransition(async () => {
      const result = await createMessage(data);
      if (result.ok) reset();
      setServerError(result.ok ? null : result.error);
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6">
      <FormField id="author" label="Nome" error={errors.author?.message}>
        <Input id="author" aria-invalid={!!errors.author} {...register('author')} />
      </FormField>
      <FormField id="text" label="Mensagem" error={errors.text?.message ?? serverError ?? undefined}>
        <Textarea id="text" aria-invalid={!!errors.text} {...register('text')} />
      </FormField>
      <Button type="submit" disabled={isPending} className="self-start">
        <Send size={16} aria-hidden /> {isPending ? 'Enviando...' : 'Publicar'}
      </Button>
    </form>
  );
}
