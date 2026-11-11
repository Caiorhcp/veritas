import { Contribute } from "@/components/home/Contribute";
import { FlagsShowcase } from "@/components/home/FlagsShowcase";
import { GeneralSheet, type SheetItem } from "@/components/home/GeneralSheet";
import { Hero } from "@/components/home/Hero";
import { StackBoard } from "@/components/home/StackBoard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Network, Puzzle, Search } from "lucide-react";
import { PonytailSection } from "@/components/home/PonytailSection";
import { LINKS } from "@/lib/site";
import { getDictionary } from "@/i18n/dictionaries";
import { getSkill, headings } from "@/lib/skills";
import { GENERAL_ORDER } from "@/lib/stacks";
import { resolveLocale } from "./params";

// "Conferida contra" das skills gerais, como no README do plugin
const CHECKED: Record<string, string> = { lgpd: "Lei 13.709/2018", "docs-oficiais": "Firecrawl 1.24.4" };

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = await resolveLocale(params);
  const d = getDictionary(lang);
  const items: SheetItem[] = GENERAL_ORDER.flatMap((name) => {
    const skill = getSkill(name);
    if (!skill) return [];
    return [
      {
        name,
        href: `/${lang}/skills/${name}`,
        line: d.home.general.items[name] ?? skill.description,
        checked: CHECKED[name] ?? d.home.stacks.authored,
        group: skill.manual ? "manual" : skill.scope === "processo" ? "processo" : "geral",
        sections: headings(skill.body).filter((h) => h.depth === 2).map((h) => h.text),
      },
    ];
  });

  return (
    <>
      <Hero lang={lang} d={d} />
      <HowItWorks d={d.home.two} how={d.home.how} />
      <StackBoard lang={lang} d={d.home.stacks} cta={d.home.stacksCta} />
      <FlagsShowcase lang={lang} d={d.home.flags} copy={d.copy} />
      <PonytailSection
        id="ponytail"
        d={d.home.ponytail}
        copy={d.copy}
        cmd="/plugin install ponytail@veritas"
        tint="var(--mint)"
        repo={LINKS.ponytail}
        author={{ href: LINKS.ponytailAuthor, label: "@DietrichGebert" }}
      />
      <PonytailSection
        id="graphify"
        d={d.home.graphify}
        copy={d.copy}
        cmd="/graphify ."
        tint="var(--sky)"
        repo={LINKS.graphify}
        author={{ href: LINKS.graphifyAuthor, label: "@Graphify-Labs" }}
        icons={[Network, Puzzle, Search]}
      />
      <GeneralSheet items={items} d={d.home.general} />
      <Contribute d={d.home.contribute} />
    </>
  );
}
