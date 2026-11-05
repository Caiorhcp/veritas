import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

// Fora do idioma não há params aqui; a página de erro fala português, a língua padrão.
export default function NotFound() {
  const d = getDictionary("pt");
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-40 sm:px-8">
      <h1 className="text-head">{d.notFound.title}</h1>
      <p className="mt-6 max-w-xl">{d.notFound.text}</p>
      <Link href="/pt" className="tab-cut mt-10 inline-block bg-accent px-6 py-3 font-medium text-on-accent hover:bg-accent-hover">
        {d.notFound.back}
      </Link>
    </section>
  );
}
