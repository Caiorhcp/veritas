// shortcut: domínio provisório; troque por NEXT_PUBLIC_SITE_URL quando o site tiver endereço próprio
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://veritasdev.vercel.app",
  name: "Veritas",
  author: "Caio Gonçalves",
};

export const LINKS = {
  repo: "https://github.com/Caiorhcp/veritas",
  issues: "https://github.com/Caiorhcp/veritas/issues",
  releases: "https://github.com/Caiorhcp/veritas/releases/latest",
  license: "https://github.com/Caiorhcp/veritas/blob/main/LICENSE",
  npm: "https://www.npmjs.com/package/create-veritas",
  author: "https://github.com/Caiorhcp",
  prumo: "https://prumo.stjosephworks.org",
  ponytail: "https://github.com/DietrichGebert/ponytail",
  ponytailAuthor: "https://github.com/DietrichGebert",
  graphify: "https://github.com/Graphify-Labs/graphify",
  graphifyAuthor: "https://github.com/Graphify-Labs",
  stjoseph: "https://stjosephworks.org",
};

/** Arquivo do repositório no GitHub (caminho a partir da raiz). */
export const repoFile = (path: string) => `${LINKS.repo}/blob/main/${path}`;

export const absolute = (path: string) => new URL(path, SITE.url).toString();
