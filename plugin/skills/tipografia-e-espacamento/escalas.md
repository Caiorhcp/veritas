# Escalas — código por stack

Arquivo de apoio da skill `tipografia-e-espacamento`. Valores de exemplo para
um sistema (razão 1.25, base 16). Página pública troca a razão; o resto fica.

## Vite e Next.js — Tailwind v4

Tailwind já traz espaçamento na grade de 4 (`--spacing: 0.25rem`) e
breakpoints. O projeto declara só o que é dele, no mesmo `@theme` das cores:

```css
@theme {
  --font-sans: "Nome da Fonte", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Nome da Fonte de Título", ui-serif, Georgia, serif;

  --text-xs: 0.8125rem;   /* 13 */
  --text-sm: 0.875rem;    /* 14, rótulo e legenda */
  --text-base: 1rem;      /* 16, corpo */
  --text-lg: 1.25rem;     /* 20 */
  --text-xl: 1.5625rem;   /* 25 */
  --text-2xl: clamp(1.56rem, 1.238rem + 1.333vw, 2.44rem); /* 25 → 39 */
  --text-3xl: clamp(2rem, 1.443rem + 2.286vw, 3.5rem);     /* 32 → 56 */

  --radius-sm: 0.375rem;  /* campo, botão */
  --radius-md: 0.75rem;   /* card */
  --radius-full: 9999px;  /* pílula, avatar */

  --shadow-1: 0 1px 2px rgb(14 22 29 / 0.08);
  --shadow-2: 0 6px 20px rgb(14 22 29 / 0.10);
}
```

No Next.js, a fonte vem do `next/font` e entra pela variável:
`--font-sans: var(--font-texto), ui-sans-serif, system-ui, sans-serif;`.

Componente: `text-base`, `text-3xl font-display`, `p-4`, `gap-6`,
`rounded-md`, `shadow-1`. Proibido `text-[15px]`, `p-[13px]`, `rounded-[10px]`.

Alvo de toque: `min-h-11 min-w-11` (44px) no botão de ícone.

## CSS sem Tailwind

Os mesmos valores como custom properties (`--fs-base`, `--space-4`,
`--radius-md`...) em `:root`, e o componente com `var(--...)`.

## React Native / Expo

`src/theme/escala.ts`:

```ts
export const fonte = { xs: 13, sm: 14, base: 16, lg: 20, xl: 25, '2xl': 31, '3xl': 39 } as const;
export const espaco = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 } as const;
export const raio = { sm: 6, md: 12, full: 9999 } as const;
export const alvoMinimo = 44; // 48 no Android: Platform.select({ android: 48, default: 44 })
```

- `fontSize` em dp, `allowFontScaling` ligado (padrão). Em título que quebra o
  layout no tamanho máximo, `maxFontSizeMultiplier={1.5}` naquele `Text`, não
  na tela.
- `lineHeight` no RN é absoluto: `fonte.base * 1.5`, não `1.5`.
- Alvo pequeno: `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}` no
  `Pressable`, até fechar 44 (ou 48).
- Sombra: `elevation` no Android e `shadow*` no iOS, ambos lidos de um token
  só, por `Platform.select`.

## Django templates

Custom properties no `base.html` ao lado das de cor, ou o `@theme` acima se o
projeto usa Tailwind. A fonte fica em `static/fonts/` com `@font-face` e
`font-display: swap`. O componente usa só `var(--...)` ou as classes da escala.
