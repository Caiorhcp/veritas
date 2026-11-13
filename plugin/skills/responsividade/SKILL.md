---
name: responsividade
description: Layout responsivo do Veritas em todo front-end (Vite, Next.js, React Native e templates Django), do celular de 320px ao monitor largo. Use ao montar ou mudar o layout de uma tela, página ou componente; ao criar menu de celular, tabela, bloco de código, imagem ou formulário que vai aparecer no celular; ao adaptar app para tablet ou paisagem; ou quando aparecer rolagem horizontal, conteúdo cortado, coluna espremida ou algo escondido atrás do notch ou da barra do navegador.
metadata:
  escopo: frontend
  stacks: [vite, nextjs, react-native, django]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Responsividade — o conteúdo flui para a largura que tiver

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

A palavra que governa esta skill é **fluir**: texto, grade e imagem se ajustam à
largura disponível, e nada na tela exige uma largura que o aparelho não tem. A
página rola num eixo só, o vertical. O piso é o do WCAG 2.2,
[1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (AA):
**320px CSS de largura sem rolagem nos dois eixos** (equivale a 1280px com zoom
de 400%). Só mapa, diagrama, vídeo, jogo e tabela de dados podem pedir duas
dimensões, e mesmo assim dentro do próprio bloco.

O que mora em outra skill, e aqui só se aponta:

- escala de tipo, `clamp()` de título, espaço, breakpoints da casa, largura de
  container e **alvo de toque de 44×44** → `veritas:tipografia-e-espacamento`
- onde o componente mora e o que ele recebe por prop → `veritas:atomic-design`
- capturar, olhar e aprovar a tela → `veritas:revisao-de-design`

Exemplos completos (menu, grade, tabela, partial Django, React Native, script de
medição): [exemplos.md](exemplos.md).

## Web: a base

- **Meta viewport** em toda página: `width=device-width, initial-scale=1`. O
  Next.js já injeta; no Vite fica no `index.html`; no Django, no `base.html`.
  Nunca `user-scalable=no` nem `maximum-scale=1`: travar o zoom tira a leitura
  de quem enxerga pouco (o iOS 10+ ignora, os outros obedecem).
- **Celular primeiro.** O CSS sem media query é o do celular; cada `@media
  (min-width: …)` acrescenta para cima. No Tailwind, a classe sem prefixo é a
  do celular e `md:` vale de 768 para cima. Escrever o desktop e "consertar" com
  `max-width` deixa o celular como remendo.
- **Breakpoint é onde o conteúdo quebra**, não onde existe um aparelho.
  Estreite a janela devagar; onde a linha fica curta demais ou o bloco aperta,
  ali entra o degrau. Use os da escala da casa antes de inventar outro.

## Layout fluido

- **Grade que se arruma sozinha**:
  `grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr))`.
  O `min(100%, …)` impede que a coluna mínima estoure a tela de 320.
- **Flex com `flex-wrap`** para fileiras de botões, filtros e etiquetas.
- **Item de grid e de flex nasce com `min-width: auto`**: ele cresce até caber o
  conteúdo mais largo dele (um `<pre>`, uma URL, uma célula com `nowrap`) e
  empurra a página. É a causa mais comum de rolagem horizontal. A coluna do
  celular precisa ser `minmax(0, 1fr)` (`grid-cols-1` no Tailwind, nunca uma
  grade sem colunas declaradas) e o item que contém texto longo leva
  `min-width: 0` (`min-w-0`).
- **Tamanho fluido** com `clamp()` em `rem`, pela fórmula de
  `veritas:tipografia-e-espacamento`. Largura de bloco com `max-width`, nunca
  `width` fixa em px.

### Container query

Quando o mesmo componente aparece em lugares de larguras diferentes (card na
grade de três colunas e na barra lateral), ele responde ao **próprio espaço**,
não à janela: o pai declara `container-type: inline-size` e o componente usa
`@container (min-width: 28rem) { … }` (Tailwind v4: `@container` no pai e
`@md:` no filho). Media query continua sendo a ferramenta do layout da página.

## Altura, bordas e teclado

- **Altura de tela cheia**: `100dvh` acompanha a barra do navegador que aparece
  e some; `100svh` é a menor altura (estável, nunca esconde conteúdo); `100lvh`
  é a maior. `100vh` no celular equivale à maior e corta o rodapé. Para herói e
  tela de login, `min-height: 100svh`; para painel que precisa caber exato,
  `100dvh`.
- **Área segura** (notch, cantos arredondados, barra de gestos): com
  `viewport-fit=cover` no meta viewport, o conteúdo vai até a borda e o
  espaço vem de `env(safe-area-inset-top|right|bottom|left)`, por exemplo
  `padding-bottom: calc(1rem + env(safe-area-inset-bottom))` em barra fixa no
  rodapé. Sem `viewport-fit=cover`, o navegador já recua a página e os valores
  ficam 0.
- **Teclado virtual**: por padrão encolhe só a viewport visual. Se um rodapé
  fixo precisa subir com o teclado, `interactive-widget=resizes-content` no meta
  viewport.

## Rolagem horizontal: os culpados

| Culpado | Correção |
|---|---|
| Item de grid/flex com `min-width: auto` (acima) | coluna `minmax(0, 1fr)`, `min-w-0` no item |
| Palavra ou URL longa, hash, e-mail | `overflow-wrap: anywhere` no texto que pode trazer isso (Tailwind v4: `wrap-anywhere`); `break-all` só em hash e código |
| Bloco de código, linha de terminal | `overflow-x: auto` **no bloco**, ou `white-space: pre-wrap` quando quebrar não muda o sentido |
| Tabela | dentro de um contêiner com `overflow-x: auto`; ou, abaixo de `sm`, cada linha vira um card |
| `width` fixa em px, `min-width` grande | `max-width: 100%` e largura fluida |
| `width: 100vw` | `100vw` conta a barra de rolagem: use `100%` |
| `white-space: nowrap` em texto de tamanho variável | só abaixo do breakpoint onde cabe (`sm:whitespace-nowrap`) |
| Decoração posicionada ou margem negativa vazando | `overflow: clip` no pai da decoração (não no `body`, que mascara o defeito) |

Nunca resolva com `overflow-x: hidden` no `html` ou no `body`: esconde o
conteúdo cortado, quebra `position: sticky` e o defeito continua lá.

## Imagens

- `max-width: 100%; height: auto` em toda imagem de conteúdo.
- **`width` e `height` no `<img>`** (ou `aspect-ratio` no CSS): o navegador
  reserva o espaço e a página não pula quando a imagem chega.
- Imagem que muda de largura com a tela: `srcset` com larguras (`480w`,
  `960w`…) e `sizes` dizendo quanto ela ocupa (`(min-width: 768px) 50vw,
  100vw`). No Next.js, `next/image` gera o `srcset`; com `fill` ou largura por
  CSS, o `sizes` é obrigatório, senão o celular baixa a imagem do desktop.

## Navegação no celular

Se os links do topo não cabem em 320 numa linha só, eles vão para um **menu de
botão**, nunca para uma fileira com rolagem lateral que esconde itens:

- `<button>` com nome acessível, `aria-expanded` e `aria-controls`; alvo de
  44×44.
- Ao abrir, o foco vai para o primeiro link; **Esc** fecha e devolve o foco ao
  botão; tocar fora fecha; trocar de rota fecha.
- Menu que cobre a tela inteira é modal: prende o foco (`<dialog>` com
  `showModal()` já faz isso). Lista que só desce abaixo do cabeçalho não precisa.

## Formulário no celular

- O `type` e o `inputmode` escolhem o teclado: `type="email"`, `"tel"`,
  `"url"`; para CPF, CEP e código numérico, `inputmode="numeric"` com
  `type="text"` (`type="number"` aceita `e`, tira zeros à esquerda e muda com a
  roda do mouse).
- `autocomplete` com o token certo (`email`, `tel`, `postal-code`,
  `one-time-code`, `current-password`): o celular preenche sozinho.
- Rótulo acima do campo, campo na largura toda, um campo por linha.
- Fonte do campo com 16px (`veritas:tipografia-e-espacamento`). *Não
  verificado em documentação oficial da Apple:* abaixo de 16px o Safari do iOS
  dá zoom ao focar; é comportamento observado e amplamente relatado.

## Toque, hover e orientação

- Nada essencial só no hover: menu, dica e ação aparecem também no toque e no
  foco. Efeito de hover vai dentro de `@media (hover: hover)`; aumento de alvo só
  para toque, em `@media (pointer: coarse)` (Tailwind: `pointer-coarse:`).
- Paisagem no celular deixa ~360px de altura: cabeçalho fixo alto e modal com
  altura fixa somem com o conteúdo. Teste girado; prefira media query de
  largura e altura a `orientation`. Não trave a orientação na web.

## Por stack

- **Next.js**: viewport pelo `export const viewport` do `layout.tsx` (é ali que
  entra `viewportFit: "cover"`); imagem por `next/image` com `sizes`.
- **Vite**: meta viewport no `index.html`; o resto é CSS/Tailwind igual.
- **Django**: meta viewport no `base.html`; as regras de CSS são as mesmas. Os
  pedaços que se repetem (menu do celular, tabela com rolagem) viram partial
  `{% include %}` (`veritas:django-templates`).
- **React Native / Expo**: não há media query. Largura por
  `useWindowDimensions()` (atualiza ao girar e ao redimensionar; `Dimensions.get`
  não); área segura por `react-native-safe-area-context` (`SafeAreaProvider` +
  `useSafeAreaInsets` ou o `SafeAreaView` do pacote; o `SafeAreaView` do core
  está obsoleto). Tamanho por flex (`flex: 1`, `flexWrap`), nunca largura fixa
  em dp para bloco de conteúdo. Fonte do sistema no máximo:
  `veritas:tipografia-e-espacamento`. **Tablet**: a partir de ~600dp de largura,
  lista e detalhe lado a lado ou grade de duas colunas; no iPad, o app precisa
  aceitar as duas orientações e janelas divididas.

## Como testar

1. Larguras: **320, 360, 390, 430, 768, 1024, 1440**, mais o celular girado.
   Celular em DevTools com emulação de toque.
2. Em cada largura, meça a rolagem horizontal (o script completo, que lista o
   elemento culpado, está em [exemplos.md](exemplos.md)):

   ```js
   document.documentElement.scrollWidth > LARGURA_PEDIDA
   ```

   Compare com a largura que você pediu, não com `innerWidth`: com emulação de
   celular, `innerWidth` cresce junto com a página que estourou e o teste passa
   em falso.
3. Texto longo de verdade: tradução maior, nome de 60 caracteres, URL inteira.
4. Depois, `veritas:revisao-de-design`: capturas, olhar, consertar.

## Antes de entregar

- [ ] Zero rolagem horizontal da página em 320, 360, 390, 430, 768 e 1440.
- [ ] Toda grade com coluna declarada no celular; bloco de código e tabela
      rolam dentro de si.
- [ ] Menu do celular abre por botão, com `aria-expanded`, Esc e foco.
- [ ] Imagens com `width`/`height` ou `aspect-ratio`, e `sizes` quando fluidas.
- [ ] Campos com `type`/`inputmode` e `autocomplete` certos.
- [ ] Nada essencial só no hover; barra fixa respeita a área segura.
- [ ] RN: conferido em aparelho pequeno, grande, girado e com fonte no máximo.

## Origem

Banco de skills do Veritas, skill `responsividade`. Criada em 2026-11-12, a
partir da auditoria do próprio site do Veritas, que rolava na horizontal em
320px por grade sem coluna declarada, tabela com `nowrap` e menu em fileira
lateral. Conferido na data: WCAG 2.2 1.4.10 (W3C), unidades de viewport,
`env()`, meta viewport, `@container` e `hover` (MDN), CSS Values 4 (viewport
ignora a barra de rolagem), `next/image` `sizes` (docs do Next.js) e
`SafeAreaView` obsoleto (docs do React Native). Não verificado em fonte
oficial: o zoom do Safari do iOS em campo abaixo de 16px.

Correções vão por PR no repositório, não editando a cópia local.
