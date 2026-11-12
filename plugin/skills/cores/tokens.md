# Tokens de cor — paleta de exemplo e código por stack

Arquivo de apoio da skill `cores`. A paleta abaixo é um exemplo medido, não a
paleta da casa: cada projeto deriva a sua pelos passos do `SKILL.md`.

## Paleta de exemplo

Ideia: 60/30 num azul-ardósia (matiz ~205°), destaque num laranja queimado
(matiz ~20°, quase oposto). Neutros puxados para o azul.

| Token | Claro | Escuro |
|---|---|---|
| `bg` | `#F4F6F8` | `#0E161D` |
| `surface` | `#E4EAF0` | `#1A2631` |
| `text` | `#16212B` | `#E5ECF1` |
| `muted` | `#4D5D6C` | `#A0B0BD` |
| `border` | `#6E7F8D` | `#647786` |
| `accent` | `#A63D0E` | `#F0935A` |
| `accent-contrast` | `#FFFFFF` | `#1F1006` |
| `success` | `#176B36` | `#5CC487` |
| `warning` | `#8F5A06` | `#E8B04B` |
| `danger` | `#B42318` | `#F2817A` |

No escuro, o destaque ficou mais claro e menos saturado, e o texto sobre ele
virou quase-preto: branco sobre `#F0935A` não chegaria a 4.5:1.

### Contraste medido

Medido com `node contraste.mjs` (fórmula WCAG 2.2) em 2026-11-12.

| Par | Claro | Escuro | Mínimo |
|---|---|---|---|
| `text` / `bg` | 15.07 | 15.29 | 4.5 |
| `text` / `surface` | 13.47 | 12.89 | 4.5 |
| `muted` / `bg` | 6.26 | 8.20 | 4.5 |
| `muted` / `surface` | 5.59 | 6.91 | 4.5 |
| `accent` / `bg` (link) | 5.88 | 7.84 | 4.5 |
| `accent` / `surface` | 5.26 | 6.61 | 4.5 |
| `accent-contrast` / `accent` (botão) | 6.37 | 7.95 | 4.5 |
| `border` / `bg` | 3.81 | 3.93 | 3 |
| `border` / `surface` | 3.41 | 3.31 | 3 |
| `success` / `bg` | 6.07 | 8.43 | 4.5 |
| `success` / `surface` | 5.43 | 7.10 | 4.5 |
| `warning` / `bg` | 5.34 | 9.33 | 4.5 |
| `warning` / `surface` | 4.77 | 7.87 | 4.5 |
| `danger` / `bg` | 6.07 | 7.12 | 4.5 |
| `danger` / `surface` | 5.42 | 6.00 | 4.5 |

O anel de foco usa `accent`: 5.88 (claro) e 7.84 (escuro) contra `bg`, acima
dos 3:1 de indicador de foco.

O primeiro rascunho tinha `accent` `#B8430F`: dava 4.50 sobre `surface`, na
linha, e foi escurecido. É para isso que se mede.

## Vite e Next.js — Tailwind v4

No CSS global (`src/index.css` no Vite, `src/app/globals.css` no Next):

```css
@import "tailwindcss";

@theme {
  --color-bg: #F4F6F8;
  --color-surface: #E4EAF0;
  --color-text: #16212B;
  --color-muted: #4D5D6C;
  --color-border: #6E7F8D;
  --color-accent: #A63D0E;
  --color-accent-contrast: #FFFFFF;
  --color-success: #176B36;
  --color-warning: #8F5A06;
  --color-danger: #B42318;
}

/* Escuro: segue o sistema, e data-theme na <html> força a escolha manual. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #0E161D;
    --color-surface: #1A2631;
    --color-text: #E5ECF1;
    --color-muted: #A0B0BD;
    --color-border: #647786;
    --color-accent: #F0935A;
    --color-accent-contrast: #1F1006;
    --color-success: #5CC487;
    --color-warning: #E8B04B;
    --color-danger: #F2817A;
  }
}
:root[data-theme="dark"] { /* os mesmos valores do bloco acima */ }

body { background: var(--color-bg); color: var(--color-text); }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
```

No componente: `className="bg-surface text-text border-border"`,
`className="bg-accent text-accent-contrast"`. Nunca `bg-orange-700`.

Com shadcn/ui, os tokens dele (`--background`, `--primary`...) apontam para
estes: `--primary: var(--color-accent)`. Um nome por papel, um valor por tema.

## CSS sem Tailwind

Os mesmos valores em `:root` com nomes curtos (`--bg`, `--surface`...) e o
mesmo bloco de escuro. O componente usa `var(--surface)`.

## React Native / Expo

`src/theme/cores.ts`:

```ts
export const claro = {
  bg: '#F4F6F8', surface: '#E4EAF0', text: '#16212B', muted: '#4D5D6C',
  border: '#6E7F8D', accent: '#A63D0E', accentContrast: '#FFFFFF',
  success: '#176B36', warning: '#8F5A06', danger: '#B42318',
} as const;

export const escuro: typeof claro = {
  bg: '#0E161D', surface: '#1A2631', text: '#E5ECF1', muted: '#A0B0BD',
  border: '#647786', accent: '#F0935A', accentContrast: '#1F1006',
  success: '#5CC487', warning: '#E8B04B', danger: '#F2817A',
};
```

`src/theme/useCores.ts`:

```ts
import { useColorScheme } from 'react-native';
import { claro, escuro } from './cores';

export const useCores = () => (useColorScheme() === 'dark' ? escuro : claro);
```

No componente, `const c = useCores()` e `StyleSheet` com `c.surface`. Com
NativeWind, os mesmos nomes vão no `tailwind.config` e o tema escuro pela
estratégia de dark mode do NativeWind. `StatusBar` acompanha o tema.

## Django templates

No `base.html` (ou no CSS que ele carrega, em `static/css/`):

```html
<style>
  :root { --bg: #F4F6F8; --surface: #E4EAF0; --text: #16212B; /* ... */ }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --bg: #0E161D; /* ... */ }
  }
  :root[data-theme="dark"] { --bg: #0E161D; /* ... */ }
</style>
```

Componente (`templates/components/...`) usa só `var(--...)` ou as classes
geradas pelo `@theme`, se o projeto usa Tailwind. Ver
`veritas:django-templates` para onde o CSS de componente mora.
