import { ContactForm } from '@/components/organisms/ContactForm';

export function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Contato</h1>
      <ContactForm />
    </div>
  );
}
