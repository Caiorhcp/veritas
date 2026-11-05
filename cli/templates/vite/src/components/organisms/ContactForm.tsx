import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { contactSchema, type ContactInput } from '@/types/contact';

export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  // Exemplo: troque pelo service real quando houver endpoint.
  const onSubmit = async (data: ContactInput) => {
    await new Promise((r) => setTimeout(r, 300));
    setSentTo(data.name);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6">
      <FormField id="name" label="Nome" error={errors.name?.message}>
        <Input id="name" aria-invalid={!!errors.name} {...register('name')} />
      </FormField>
      <FormField id="email" label="E-mail" error={errors.email?.message}>
        <Input id="email" type="email" aria-invalid={!!errors.email} {...register('email')} />
      </FormField>
      <FormField id="message" label="Mensagem" error={errors.message?.message}>
        <Textarea id="message" aria-invalid={!!errors.message} {...register('message')} />
      </FormField>
      <Button type="submit" disabled={isSubmitting} className="self-start">
        <Send size={16} aria-hidden /> {isSubmitting ? 'Enviando...' : 'Enviar'}
      </Button>
      {sentTo && <p className="text-sm text-green-700">Obrigado, {sentTo}. Mensagem recebida.</p>}
    </form>
  );
}
