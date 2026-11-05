import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google"; // taste-skill-ignore: mono só em código
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageFloat } from "@/components/LanguageFloat";
import { HTML_LANG, OG_LOCALE } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { absolute, LINKS, SITE } from "@/lib/site";
import "../globals.css";
import { localeParams, resolveLocale } from "./params";

const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
// só para blocos de código e comandos de terminal
const mono = JetBrains_Mono( // taste-skill-ignore
  { subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const dynamicParams = false;
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: d.meta.title, template: `%s · ${SITE.name}` },
    description: d.meta.description,
    keywords: d.meta.keywords,
    authors: [{ name: SITE.author, url: LINKS.author }],
    creator: SITE.author,
    ...pageMeta(lang, "/"),
    openGraph: { type: "website", locale: OG_LOCALE[lang], siteName: SITE.name, url: `/${lang}`, title: d.meta.title, description: d.meta.description },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e2e2e2" },
    { media: "(prefers-color-scheme: dark)", color: "#161213" },
  ],
};

// Aplica o tema salvo antes da primeira pintura, sem piscar
const THEME_SCRIPT = `try{var t=localStorage.getItem("tema");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: SITE.name,
    description: d.meta.description,
    url: absolute(`/${lang}`),
    codeRepository: LINKS.repo,
    license: "https://opensource.org/licenses/MIT",
    programmingLanguage: ["Markdown", "TypeScript"],
    author: { "@type": "Person", name: SITE.author, url: LINKS.author },
  };

  return (
    <html lang={HTML_LANG[lang]} data-theme="light" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:p-3">
          {d.nav.skip}
        </a>
        <Header lang={lang} d={d} />
        <main id="conteudo">{children}</main>
        <Footer lang={lang} d={d} />
        <LanguageFloat lang={lang} label={d.nav.language} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
