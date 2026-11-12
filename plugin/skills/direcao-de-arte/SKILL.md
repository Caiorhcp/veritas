---
name: direcao-de-arte
description: Direção de arte do Veritas para página pública — landing page, site institucional, página de produto, portfolio, hero, onboarding de app — em Vite, Next.js, React Native ou templates Django. Use ao criar ou redesenhar uma página que vai ser vista por cliente ou visitante, escrever o texto de uma seção, escolher imagem, ícone, animação ou efeito, ou quando alguém disser que a página está genérica, com cara de template ou "feita por IA".
metadata:
  escopo: frontend
  stacks: [vite, nextjs, react-native, django]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Direção de arte — página que só podia ser deste cliente

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

Uma página genérica não tem erro nenhum: ela só não tem **decisão**. Cada bloco
é o padrão da categoria, e o conjunto podia estar no site de qualquer
concorrente. Esta skill troca o padrão por decisões tiradas do assunto.

Vale para página pública. Tela de sistema (painel, cadastro, tabela) segue só
`veritas:cores`, `veritas:tipografia-e-espacamento` e a skill da stack: lá a
meta é previsibilidade, não personalidade. No app React Native, esta skill
cobre o que faz papel de vitrine: boas-vindas, onboarding, tela vazia de
primeira abertura e as imagens da loja.

## 1. Comece pelo conteúdo, não pelo layout

Antes de qualquer markup, escreva em texto puro:

1. **O que só este cliente tem.** Liste de oito a dez fatos concretos: o nome e
   de onde ele vem, o lugar, os números reais (prazo, preço, quantidade, ano),
   a restrição que o define, o material, o processo, quem atende. Pergunte o que
   faltar em vez de inventar.
2. **O que a página precisa fazer a pessoa fazer.** Uma ação. Ela vira o botão
   principal, e é o destaque do 10% (`veritas:cores`).
3. **Uma ideia, numa frase.** Um fato da lista vira o recurso visual da página
   inteira: o mapa do bairro vira o fundo do hero, o cronograma de entrega vira
   a navegação, a tabela de preço é o próprio destaque. Se a frase continuar
   verdadeira com o nome de um concorrente no lugar, ela é da categoria, não do
   cliente: volte à lista.
4. **As seções, como argumentos.** Uma linha por seção: o que ela afirma e qual
   fato prova. Seção sem afirmação sai. É isso que quebra a sequência de
   sempre (hero, logos, três cards, depoimento, preço, rodapé).

Escreva o texto completo da página nessa etapa. Layout desenhado com texto
provisório acomoda texto ruim.

## 2. Composição

- **Um ponto focal por seção.** Quem olha a seção por dois segundos sabe para
  onde olhar primeiro. Dois elementos do mesmo tamanho disputando é ausência
  de ponto focal.
- **Ritmo variado.** Seções vizinhas não repetem o mesmo arranjo. Alterne
  largura cheia e coluna estreita, texto à esquerda e imagem dominante, bloco
  denso e respiro.
- **Assimetria com grade.** Coluna 7/5 ou 8/4 na grade de 12, deslocada, em vez
  de tudo centralizado. Assimetria sem grade é bagunça: o alinhamento continua
  na grade (`veritas:tipografia-e-espacamento`).
- **Grade de cards idênticos só quando o conteúdo é uma coleção de iguais**
  (produtos, posts, planos). Três "benefícios" com ícone e duas linhas não são
  coleção: são um texto que ninguém escreveu.
- **Primeira tela responde a pergunta de quem chegou**: o que é, para quem, e a
  ação. Em letra grande, não num subtítulo cinza.
- **Contraste de escala.** Um elemento claramente maior que o resto por seção.
  Página onde tudo tem o mesmo tamanho é página sem hierarquia.

## 3. Imagem

Ordem de preferência:

1. Foto ou material **do próprio cliente** (o lugar, a equipe, o produto, a
   interface real do software).
2. Imagem feita para a página (ilustração, diagrama, interface montada em HTML).
3. Acervo aberto com licença que permite o uso (domínio público, CC0, CC BY),
   com o crédito na página.

- Banco de imagem genérico (aperto de mão, equipe sorrindo para o notebook,
  cidade desfocada) não entra: não prova nada.
- Imagem gerada por IA não se passa pela realidade do cliente (falso produto,
  falsa equipe, falso cliente).
- Toda imagem tem `alt` que diz o que ela mostra para quem não vê; decorativa
  tem `alt=""`. Formato moderno (AVIF/WebP), dimensão declarada, carregamento
  preguiçoso abaixo da primeira tela (`next/image` no Next).

## 4. Ornamento com moderação

Cada efeito precisa de um motivo que caiba numa frase. Sem motivo, sai.

- **Gradiente**: no máximo um, e sutil, onde ele significa algo (luz, céu,
  material). Nunca o roxo-azul de fundo de hero.
- **Vidro fosco, brilho, glow, sombra colorida**: só se a ideia da página é
  sobre luz ou vidro.
- **Ícone**: de uma família só, mesmo traço e tamanho. Emoji no lugar de ícone,
  não.
- **Selos e etiquetas** ("Novo", "Beta", pílula em cima de todo título): um,
  quando é verdade.
- **Prova social** só verdadeira: depoimento, logo de cliente, número e
  avaliação reais, com permissão. Inventar prova é proibido.

## 5. Movimento com propósito

- Movimento explica uma mudança (algo abriu, entrou, foi salvo) ou guia o olho
  para a ação. Decoração em loop distrai da leitura.
- Duração: 150–300 ms para interface (hover, abrir, fechar); até ~500 ms para
  entrada de seção. Saída mais rápida que entrada.
- Anime `transform` e `opacity`; `top`, `width` e `height` travam a página.
- **Obrigatório** respeitar `prefers-reduced-motion`: com ele ligado, troca de
  posição vira troca de opacidade ou nada.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- A página funciona e parece pronta **sem** animação nenhuma. Lib de animação
  nova (GSAP, Framer Motion) é dependência: `veritas:principios`.

## 6. Texto

- **Específico vence bonito.** "Entrega em 48 h para Curitiba e região
  metropolitana" ganha de "Soluções ágeis para o seu negócio".
- Banidos por serem vazios: "Revolucione seu negócio", "Leve sua empresa ao
  próximo nível", "Solução completa e inovadora", "Transforme sua experiência",
  "O futuro de X chegou", "Feito para você". Se a frase cabe em qualquer site,
  ela não diz nada sobre este.
- Título com um verbo e um fato. Botão diz o que acontece ao clicar ("Pedir
  orçamento", "Ver horários"), não "Saiba mais" nem "Clique aqui".
- Sem ponto de exclamação de entusiasmo, sem nome falso (Fulano, Empresa X,
  lorem ipsum) na entrega. Dado de exemplo que faltou é marcado para o cliente
  confirmar.

## Evite

- Hero centralizado com título de três linhas, subtítulo cinza e dois botões.
- Fileira de três cards com ícone e duas linhas de texto.
- Gradiente roxo-azul, orbe desfocado no fundo, brilho em volta do botão.
- Etiqueta em pílula acima de cada título.
- Emoji como ícone; família de ícone misturada.
- Foto de banco de imagem genérica; mockup de celular vazio.
- Toda seção com o mesmo arranjo e o mesmo espaçamento.
- Animação de entrada em tudo, em loop, ou que ignora `prefers-reduced-motion`.
- Frase de efeito que serve para qualquer empresa.

## Faça

- Ideia tirada de um fato do cliente, escrita antes do layout.
- Uma ação principal por página, com o destaque reservado para ela.
- Um ponto focal e um contraste de escala por seção.
- Seções com arranjos diferentes, na mesma grade.
- Imagem do próprio cliente, ou feita para a página.
- Texto com número, lugar, prazo, nome.
- Efeito só com motivo; movimento que respeita a preferência da pessoa.

## Conferência antes de entregar

- [ ] A ideia da página está escrita em uma frase e não vale para o concorrente.
- [ ] Cada seção tem uma afirmação e um ponto focal.
- [ ] Nenhuma seção vizinha repete o arranjo.
- [ ] Nenhum item da lista "Evite" ficou, ou cada um que ficou tem motivo.
- [ ] Texto sem frase vazia; botões dizem o que fazem.
- [ ] Imagens reais ou feitas para a página, com `alt` e crédito.
- [ ] Com `prefers-reduced-motion` ligado, nada se move sem necessidade.
- [ ] Revisão na tela renderizada feita: `veritas:revisao-de-design`.

## Origem

Banco de skills do Veritas, skill `direcao-de-arte`. Criada em 2026-11-12.
Texto e regras originais da casa. Para escrevê-la foram lidas como referência
as skills `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`,
`redesign-existing-projects`, `stitch-design-taste` e `industrial-brutalist-ui`
(Leonxlnx/taste-skill, MIT) e `web-design-guidelines` (Vercel); nenhuma frase
ou lista delas foi copiada. Crédito completo: "Inspiração" no README do
plugin.

Correções vão por PR no repositório, não editando a cópia local.
