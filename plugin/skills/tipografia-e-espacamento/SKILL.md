---
name: tipografia-e-espacamento
description: Tipografia, espaçamento e medidas de layout do Veritas em todo front-end (Vite, Next.js, React Native e templates Django). Use ao escolher fonte ou par de fontes, definir escala de tamanhos de texto, altura de linha, largura de parágrafo, espaçamento, margem, padding, grid, raio de borda, sombra, breakpoint ou largura de container, ao dimensionar botão ou alvo de toque, ou quando a tela parecer apertada, solta, desalinhada ou com texto pequeno demais.
metadata:
  escopo: frontend
  stacks: [vite, nextjs, react-native, django]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Tipografia e espaçamento — escala, grade e alvo de toque

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

A palavra que governa esta skill é **escala**: tamanho de texto, espaço, raio e
sombra saem de uma lista curta de degraus, definida uma vez como token. Valor
fora da escala é o que faz uma tela parecer "quase certa".

Os tokens moram na mesma base dos tokens de cor (`veritas:cores`), abaixo dos
atoms (`veritas:atomic-design`). **Proibido** `px`, `rem` ou número mágico de
tamanho, espaço, raio ou sombra dentro de componente: o componente usa o token.

## Escala de tipo

Um tamanho base e uma **razão**. Cada degrau é o anterior vezes a razão.

| Uso | Razão | Degraus a partir de 16px |
|---|---|---|
| Sistema, painel, app | 1.2 a 1.25 | 1.25 → 13 · **16** · 20 · 25 · 31 · 39 |
| Página pública, marketing | 1.333 ou mais | 1.333 → 12 · **16** · 21 · 28 · 38 · 50 · 67 |

- Seis ou sete degraus bastam. Arredonde para inteiro e congele como token
  (`text-sm`, `text-base`, `text-lg`... ou `fs-1`...`fs-6`).
- Hierarquia vem de **pular degrau**: título e corpo separados por um degrau só
  quase não se distinguem.
- Tela de app não precisa de título gigante; página pública não precisa ter só
  dois tamanhos.

### Tamanho fluido na web

Títulos crescem com a tela por `clamp(min, base + inclinação·vw, max)`, entre
390px e 1440px de largura:

```
inclinação = (max − min) / (1440 − 390)
base       = min − inclinação × 390
```

Exemplo, título de 32px a 56px: `clamp(2rem, 1.443rem + 2.286vw, 3.5rem)`.
Corpo de texto não precisa ser fluido. Sempre `rem` no `clamp` (nunca só `vw`):
só `vw` ignora o zoom do navegador.

## Fontes

- **No máximo duas famílias**: uma para texto e interface, outra (opcional)
  para títulos. Uma família com bons pesos resolve a maioria dos sistemas.
- **Par que contrasta em uma coisa só**: serifa de título com sem-serifa de
  texto, ou duas sem-serifas de desenho bem diferente. Duas parecidas parecem
  erro.
- A de texto precisa de: acentos do português, números legíveis, pelo menos
  regular e negrito, e versão variável ou arquivos leves.
- Carregamento: `next/font` no Next.js; `@fontsource` ou arquivo em `public/`
  no Vite; `expo-font` no Expo; `static/fonts/` no Django. `font-display: swap`
  e fallback do sistema com métrica parecida.
- Fonte paga ou de serviço novo é dependência: passa pela `veritas:principios`.

## Peso, altura de linha e medida

| Tamanho | `line-height` |
|---|---|
| corpo (14–18px) | 1.5 a 1.7 |
| subtítulo (20–28px) | 1.25 a 1.35 |
| título grande (32px+) | 1.05 a 1.2 |

- Pesos: regular (400) para texto, um médio ou seminegrito (500–600) para
  rótulo e botão, negrito (700) para título. Três pesos por família.
- **Medida**: parágrafo entre 45 e 75 caracteres por linha
  (`max-width: 65ch` é o atalho). Texto de largura total em tela larga cansa.
- Título curto em várias linhas: `text-wrap: balance`. Parágrafo:
  `text-wrap: pretty`.
- Título grande pede `letter-spacing` levemente negativo; rótulo pequeno em
  caixa alta pede levemente positivo.

### Números

Tabela, preço, contador e qualquer coluna de números: `font-variant-numeric:
tabular-nums` (Tailwind: `tabular-nums`; RN: `fontVariant: ['tabular-nums']`).
Sem isso, os dígitos dançam quando o valor muda.

## Tamanho mínimo

- **Web**: corpo com **16px** (`1rem`). Campo de formulário também com 16px:
  abaixo disso o Safari do iOS dá zoom ao focar. Legenda e rótulo podem descer
  a 12–14px, nunca o texto que se lê.
- Tamanho em `rem`, nunca `px` fixo no `html`: respeita o tamanho de fonte que
  a pessoa escolheu no navegador.
- **React Native**: tamanho em dp (o número puro do `fontSize`). Corpo com 16,
  e o `allowFontScaling` fica ligado (é o padrão): quem aumentou a fonte do
  sistema precisa ver o aumento. Teste com fonte do sistema no máximo; onde o
  layout quebrar, limite pontualmente com `maxFontSizeMultiplier`, nunca
  desligando a escala da tela toda.

## Espaço — grade de 4 e 8

Todo espaço é múltiplo de **4px**, e os degraus maiores, de **8px**:

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```

- Tailwind já segue a grade (`p-4` = 16px): use os degraus da escala, nunca
  valor arbitrário (`p-[13px]`).
- **Proximidade diz parentesco**: rótulo e campo ficam mais perto entre si do
  que do campo seguinte. Espaço interno de um grupo menor que o espaço entre
  grupos.
- **Ritmo vertical**: entre seções de página, um degrau grande e constante
  (64–128 no desktop, 48–64 no celular). Entre blocos de uma seção, um degrau
  médio. Tudo com o mesmo espaço vira uma lista sem hierarquia.

## Raio e sombra

- **Raio**: três tokens (pequeno para campo e botão, médio para card, cheio
  para pílula e avatar). Elemento dentro de elemento arredondado tem raio
  menor que o de fora (raio de fora menos o padding).
- **Sombra**: dois ou três níveis de elevação, como token, com a cor puxada
  para o matiz do fundo em vez de preto puro. No tema escuro, elevação vem da
  superfície mais clara (`veritas:cores`), não da sombra.

## Layout

- **Container**: conteúdo de leitura em até ~1200–1280px com margem lateral
  automática; texto corrido no limite de medida acima. Margem lateral mínima de
  16px no celular.
- **Breakpoints**: os do Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
  Comece pelo celular e acrescente para cima. Breakpoint novo só quando o
  conteúdo quebrar, não para um aparelho.
- Altura de seção cheia: `min-height: 100dvh`, não `100vh` (a barra do
  navegador do celular come o `vh`).
- RN: `SafeAreaView` e flexbox (`veritas:react-native`); largura de tela por
  `useWindowDimensions`, não por breakpoint de web.

## Alvo de toque

| Fonte | Mínimo |
|---|---|
| WCAG 2.2, [2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), AA | 24×24 px CSS, ou espaço que compense |
| Apple, [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) | 44×44 pt (padrão no iOS) |
| Android, [Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps) | 48×48 dp |

**A regra da casa é 44×44** em tudo que se toca (web e iOS) e **48×48** no
Android. O 24 do WCAG é o piso legal, não a meta. O alvo pode ser maior que o
desenho: ícone de 20px com padding até 44, ou `hitSlop` no RN. Entre alvos
vizinhos, pelo menos 8px.

Código dos tokens por stack: [escalas.md](escalas.md).

## Antes de entregar

- [ ] Zero tamanho, espaço, raio ou sombra solto em componente: tudo token.
- [ ] Corpo com 16px; parágrafo com no máximo ~75 caracteres por linha.
- [ ] Título e corpo separados por pelo menos dois degraus da escala.
- [ ] Números de tabela com `tabular-nums`.
- [ ] Todo alvo de toque com 44×44 (48×48 no Android).
- [ ] RN: tela conferida com a fonte do sistema no máximo.

Cor: `veritas:cores`. Composição de página pública: `veritas:direcao-de-arte`.
Conferir na tela: `veritas:revisao-de-design`.

## Origem

Banco de skills do Veritas, skill `tipografia-e-espacamento`. Criada em
2026-11-12. Alvo de toque conferido na data nas fontes da tabela (W3C, Apple,
Android Developers). Escala modular, grade de 4/8 e medida de 45–75 caracteres
são prática tipográfica consolidada; os degraus e as proibições são escolha da
casa. Inspiração: ver "Inspiração" no README do plugin.

Correções vão por PR no repositório, não editando a cópia local.
