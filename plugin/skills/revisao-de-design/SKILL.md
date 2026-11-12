---
name: revisao-de-design
description: Revisão visual do Veritas antes de entregar qualquer tela, em todo front-end (Vite, Next.js, React Native e templates Django). Use ao terminar ou alterar uma tela, página, componente visível ou tema, antes de dizer que está pronto, abrir PR ou mostrar ao cliente; e quando pedirem para revisar UI, design, layout, responsividade, acessibilidade ou modo escuro.
metadata:
  escopo: frontend
  stacks: [vite, nextjs, react-native, django]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Revisão de design — olhar a tela antes de entregar

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

Código de interface que compila não está pronto: está pronto quando alguém
**olhou a tela renderizada** e ela passou na lista abaixo. Ler o JSX não
substitui olhar a captura. Esta skill é o laço: capturar, olhar, consertar,
capturar de novo.

As regras que a revisão confere moram nas outras skills; aqui fica só o
critério de aprovação:

- cor, tema e contraste → `veritas:cores`
- tipo, espaço, grade e alvo de toque → `veritas:tipografia-e-espacamento`
- página pública com cara genérica → `veritas:direcao-de-arte`
- componente no nível errado, cor ou medida solta no componente →
  `veritas:atomic-design`

## 1. Capturar

**Obrigatório**: quatro capturas da tela, com dado realista (nunca tela vazia
de desenvolvimento, a menos que o estado vazio seja o que se revisa):

| Largura | Tema |
|---|---|
| 1440 | claro |
| 1440 | escuro |
| 390 | claro |
| 390 | escuro |

Página inteira, não só a primeira dobra. Use o que o ambiente tiver, nesta
ordem: ferramenta de navegador do próprio agente (redimensionar e capturar),
Playwright, Chrome ou Edge headless, ou, em React Native, simulador e emulador.
Comandos prontos: [capturas.md](capturas.md).

Sem nenhum jeito de renderizar (sem navegador, sem simulador): diga isso na
entrega, com todas as letras, e entregue a lista de verificação para a pessoa
fazer. Nunca declare "conferido" sem captura.

**Depois, abra e olhe cada imagem.** Gerar o arquivo não é revisar.

## 2. Conferir

Cada item tem um jeito de verificar. Anote o resultado, não a intenção.

**Cor**
- [ ] 60-30-10: na captura inteira, o destaque é raro e aponta a ação
      principal; fundo e superfície do mesmo matiz.
- [ ] Contraste medido (número, não impressão) de texto, `muted`, link, botão,
      borda de campo e foco, nos dois temas.
- [ ] Nenhuma informação só por cor (erro tem ícone ou texto, link tem
      sublinhado no meio do texto).
- [ ] Modo escuro é paleta própria: nada de branco estourado, sombra preta
      sobre preto ou imagem com fundo branco recortado.

**Hierarquia e grade**
- [ ] **Teste do borrão**: desfoque a captura (ou aperte os olhos). Ainda dá
      para ver o que é título, onde está a ação e como a tela se divide? Se
      não, falta contraste de escala ou de peso.
- [ ] Bordas alinhadas: textos e blocos começam na mesma linha vertical da
      grade; nada desalinhado por 2–3px.
- [ ] Tamanhos e espaços só da escala (procure no código `text-[`, `p-[`,
      `px` solto, hex solto).

**Teclado e foco** (web)
- [ ] Percorra a tela com Tab: a ordem segue a leitura, todo controle recebe
      foco, o anel de foco aparece sempre e tem 3:1 contra o vizinho.
- [ ] Modal prende o foco e devolve ao fechar; Esc fecha.

**Estados**
- [ ] Vazio, carregando, erro e sucesso existem e foram capturados: cada um
      diz o que aconteceu e o que fazer.
- [ ] Texto longo: nome de 60 caracteres, número com sete dígitos, tradução
      maior. Nada estoura, corta sem reticências ou empurra o layout.
- [ ] Lista com um item e com cem.

**Celular (390)**
- [ ] Nenhuma rolagem horizontal na página (`scrollWidth` igual à largura da
      janela; o script de [capturas.md](capturas.md) mede).
- [ ] Alvo de toque com 44×44 (48×48 no Android); vizinhos com folga.
- [ ] Texto de corpo com 16px; campos não dão zoom ao focar.

**Conteúdo e movimento**
- [ ] Toda imagem com `alt` adequado (decorativa com `alt=""`); ícone sozinho
      em botão com nome acessível.
- [ ] Com `prefers-reduced-motion: reduce` nada se desloca sem necessidade.
- [ ] RN: tela conferida com a fonte do sistema no máximo e com leitor de tela
      (VoiceOver ou TalkBack) em pelo menos um fluxo.

Página pública: rode também a conferência final de `veritas:direcao-de-arte`.

## 3. Consertar e repetir

Conserte do mais grave para o menos grave, capture de novo e olhe de novo. A
revisão termina quando a lista inteira passa ou quando o que sobrou está no
relatório, com motivo. Três voltas costumam bastar; se a quarta ainda acha
problema grave, o defeito é de estrutura e vale parar e dizer.

## 4. Relatar

Na entrega (resposta, PR ou relatório de task), uma lista ordenada por
gravidade. Cada item com: onde, o que está errado, a evidência e a correção.

| Gravidade | Critério |
|---|---|
| **Bloqueia** | impede uso ou viola mínimo de acessibilidade: contraste abaixo do mínimo, sem foco, alvo pequeno, rolagem horizontal, texto cortado, estado de erro ausente |
| **Corrigir** | quebra a regra da casa sem impedir uso: valor fora da escala, destaque gasto em decoração, desalinhamento, modo escuro desequilibrado |
| **Sugestão** | gosto e acabamento |

Exemplo:

```
Bloqueia
1. /checkout, 390 escuro: texto "Frete grátis" em #6B7785 sobre #1A2631
   dá 3.37:1 (mínimo 4.5). Trocar para o token muted (#A0B0BD, 6.91:1).
Corrigir
2. /checkout, 1440: card de resumo com p-[18px]; usar p-4 ou p-6.
Conferido sem achado: foco e ordem de Tab, estados vazio/erro, alt.
Capturas: 1440 e 390, claro e escuro (anexas ou em .revisao/).
```

Diga também o que **não** foi conferido e por quê (ex.: "sem simulador
Android, alvo de 48dp não verificado").

## Origem

Banco de skills do Veritas, skill `revisao-de-design`. Criada em 2026-11-12.
O laço de capturar e olhar antes de entregar veio do erro mais comum em tela
feita por agente: código correto, tela nunca vista. Inspiração: ver
"Inspiração" no README do plugin.

Correções vão por PR no repositório, não editando a cópia local.
