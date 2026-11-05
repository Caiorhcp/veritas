// `product`: a lib cuja documentação a skill conferiu; sem ela, a convenção é autoral.
// As stacks da página inicial. Libs e trechos vêm do SKILL.md de cada uma; o texto de cada cartão fica no dicionário.
export type Stack = { name: string; label: string; product?: string; snippet: string; libs: string; cli: boolean; tint: string };

export const STACKS: Stack[] = [
  { name: "vite", product: "Vite", label: "React + Vite", snippet: "@/", libs: "react-router-dom · Tailwind · Zustand · Axios + TanStack Query · React Hook Form + Zod · lucide-react", cli: true, tint: "var(--sky)" },
  { name: "nextjs", product: "Next.js", label: "Next.js", snippet: "'use client'", libs: "App Router · Tailwind + shadcn/ui · React Hook Form + Zod · SWR / TanStack Query · Prisma / Drizzle", cli: true, tint: "var(--lilac)" },
  { name: "django", product: "Django", label: "Django / DRF", snippet: "service", libs: "DRF · Django ORM · SimpleJWT · uv", cli: false, tint: "var(--mint)" },
  { name: "nestjs", product: "NestJS", label: "NestJS", snippet: "@Module", libs: "TypeORM / Prisma · class-validator · @nestjs/jwt · @nestjs/swagger", cli: false, tint: "var(--rose)" },
  { name: "react-native", product: "React Native", label: "React Native", snippet: "<View>", libs: "React Navigation · NativeWind · Zustand · MMKV", cli: false, tint: "var(--sky)" },
  { name: "python", label: "Python", snippet: "uv", libs: "ruff · pytest · Pydantic · uv", cli: false, tint: "var(--peach)" },
  { name: "bun-hono-api", label: "Bun + Hono", snippet: "bun test", libs: "Bun · Hono · Drizzle · Zod · uuidv7 · Biome", cli: false, tint: "var(--mint)" },
];

export const GENERAL_ORDER = ["principios", "projeto-existente", "lgpd", "docs-oficiais", "atomic-design", "clickup", "executar-tasks", "ajuda", "atualizar", "buscar-skills", "ambiente"];
