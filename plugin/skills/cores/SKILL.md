---
name: cores
description: Sistema de cores do Veritas em todo front-end (Vite, Next.js, React Native e templates Django), pela regra 60-30-10. Use ao escolher ou mudar uma paleta, criar tokens de cor ou tema, montar modo escuro, definir cor de botão, link, foco, erro ou sucesso, ou quando um texto parecer apagado, a tela parecer colorida demais ou alguém pedir contraste e acessibilidade de cor.
metadata:
  escopo: frontend
  stacks: [vite, nextjs, react-native, django]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Cores — 60-30-10 e contraste medido

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

Cor é **orçamento**: cada área da tela gasta uma fatia, e quem gasta mais que a
sua fatia some com a hierarquia. A casa divide assim:

| Fatia | Papel | Onde aparece |
|---|---|---|
| **60%** | dominante | fundo da página, grandes áreas vazias |
| **30%** | secundária | superfícies: card, seção alternada, barra de navegação, painel lateral, campo |
| **10%** | destaque | a ação principal, link, anel de foco, o número que importa |

A conta é de área visível, a olho, numa captura da tela inteira. Não precisa
medir pixel: precisa o destaque ser raro o bastante para apontar a ação.

## Derivar a paleta

1. **Uma família de matiz para o 60 e o 30.** Fundo e superfície são o mesmo
   matiz com luminosidade diferente. Duas famílias no 60/30 dividem a tela em
   duas marcas.
2. **Neutros puxados para a marca.** Cinza e quase-preto levam um pouco do
   matiz da marca (saturação baixa, 5–15%). `#000`, `#fff` puro e cinza neutro
   de framework ficam fora: deixam a tela sem identidade e brigam com a foto.
3. **Destaque que contrasta com o 60/30.** Matiz oposto ou bem afastado no
   círculo cromático, mais saturado que os neutros. **Um** destaque. Segundo
   destaque é decisão de marca, registrada no `CLAUDE.md` do projeto, não
   improviso de tela.
4. **Meça antes de usar** (seção "Contraste"). Cor bonita que reprova vira outra
   cor, não exceção.

Paleta que o cliente já tem (manual de marca) entra nos papéis acima: o
trabalho é mapear, não reinventar.

## Tokens semânticos — definidos uma vez

O componente pede **papel**, nunca valor. A lista mínima:

| Token | Papel |
|---|---|
| `bg` | fundo da página (60) |
| `surface` | card, seção, nav, campo (30) |
| `text` | texto principal |
| `muted` | texto secundário, legenda, placeholder |
| `border` | borda de campo e divisória que identifica controle |
| `accent` | ação principal, link, foco (10) |
| `accent-contrast` | texto e ícone **sobre** o `accent` |
| `success`, `warning`, `danger` | estado |

Moram num lugar só, na base do front: é a camada abaixo dos atoms
(`veritas:atomic-design`).

| Stack | Onde |
|---|---|
| Vite, Next.js (Tailwind v4) | `@theme` no CSS global; as classes saem dos nomes (`bg-surface`, `text-muted`) |
| CSS sem Tailwind | custom properties em `:root` |
| React Native / Expo | um objeto `theme` em `src/theme/`, lido por hook; NativeWind usa os mesmos nomes no `tailwind.config` |
| Django templates | custom properties no `base.html` (ou no CSS que ele carrega); Tailwind, se o projeto usar, pelo `@theme` |

Código pronto de cada stack e a paleta de exemplo medida: [tokens.md](tokens.md).

**Proibido:** hex, `rgb()`, `hsl()` ou classe de cor crua do framework
(`bg-blue-600`, `text-gray-500`) dentro de componente. Cor nova entra primeiro
como token, com papel e contraste medido; depois o componente usa o token.

## Claro e escuro

O tema escuro é **outra paleta**, não a clara invertida.

- O 60 vira um quase-preto puxado para o matiz da marca; o 30 fica **mais
  claro** que o 60 (no escuro, elevação é luz, não sombra).
- Saturação desce: o destaque que funciona sobre claro vibra demais sobre
  escuro. Use uma versão mais clara e menos saturada do mesmo matiz.
- Rebalanceie o 60-30-10: superfície grande e clara no escuro pesa mais do que
  pesava no claro. Confira a captura, não a planilha.
- Sombra quase não aparece no escuro: a separação vem da diferença entre `bg`
  e `surface`, e da `border`.
- Os dois temas usam os **mesmos nomes de token**. Troca o valor, o componente
  não muda. Web: `prefers-color-scheme` mais um atributo (`data-theme`) para a
  escolha manual. RN: `useColorScheme()` escolhe o objeto.
- Meça o contraste dos dois temas, par por par. Passar no claro não diz nada do
  escuro.

## Cores de estado

`success`, `warning` e `danger` ficam **fora** do orçamento de 10%, mas
aparecem só onde há estado: mensagem de erro, badge de situação, validação.
Tela inteira vermelha, ou estado usado como decoração, é ruído que ensina o
usuário a ignorar o alerta de verdade.

Cada estado tem variante para o claro e para o escuro, medida como texto (o
estado quase sempre é texto ou ícone com texto).

## Contraste (WCAG 2.2, nível AA)

| O quê | Mínimo | Fonte |
|---|---|---|
| Texto normal | **4.5:1** | [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| Texto grande: ≥ 24px, ou ≥ 18.5px em negrito | **3:1** | idem (18pt / 14pt bold) |
| Borda de campo, ícone que é controle, estado de componente, **indicador de foco** | **3:1** contra o que está ao lado | [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |

- O limite não arredonda: 4.49:1 reprova em 4.5.
- Vale para placeholder, texto em hover e texto sobre foto (meça contra a área
  mais clara da foto, ou ponha um véu sólido atrás).
- Controle desabilitado não tem mínimo, mas precisa parecer desabilitado por
  outro sinal além da cor (cursor, opacidade com rótulo, atributo `disabled`).
- Cor de marca não é exceção: só logotipo é.

**Nunca só a cor.** Erro tem ícone ou texto além do vermelho; link no meio do
texto tem sublinhado; gráfico tem rótulo ou padrão além da legenda colorida
([1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)).

### Como medir

Razão = `(L1 + 0.05) / (L2 + 0.05)`, com L1 a luminância relativa da cor mais
clara e L2 a da mais escura. A luminância vem do sRGB linearizado:
`L = 0.2126 R + 0.7152 G + 0.0722 B`, cada canal `c/255` passado por
`c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`.

Não estime de olho. Rode o script ao lado (Node, sem dependência):

```bash
node contraste.mjs "#16212B" "#F4F6F8" "#FFFFFF" "#A63D0E"
# #16212B sobre #F4F6F8: 15.07:1 | texto passa | texto grande e UI passa
```

Qualquer ferramenta que use a mesma fórmula serve (DevTools do navegador,
Accessibility Inspector, Accessibility Scanner). O que conta é o número escrito
na entrega, par por par, nos dois temas.

## Antes de entregar

- [ ] Toda cor de componente vem de token; zero hex no componente.
- [ ] Captura da tela: destaque raro, superfície e fundo do mesmo matiz.
- [ ] Pares `text`, `muted` e `accent` sobre `bg` e `surface`, e
      `accent-contrast` sobre `accent`, medidos nos dois temas.
- [ ] `border` de campo e anel de foco ≥ 3:1 contra o vizinho.
- [ ] Nenhuma informação só por cor.

Tipo, espaço e raio: `veritas:tipografia-e-espacamento`. Uso da cor numa
página pública (gradiente, brilho, foto): `veritas:direcao-de-arte`. Conferir
na tela renderizada: `veritas:revisao-de-design`.

## Origem

Banco de skills do Veritas, skill `cores`. Criada em 2026-11-12. Os mínimos de
contraste e a fórmula vêm das páginas Understanding do WCAG 2.2 (W3C),
conferidas na data. A divisão 60-30-10 é regra clássica de design de
interiores aplicada a tela; os nomes de token e as proibições são escolha da
casa. Inspiração: ver "Inspiração" no README do plugin.

Correções vão por PR no repositório, não editando a cópia local.
