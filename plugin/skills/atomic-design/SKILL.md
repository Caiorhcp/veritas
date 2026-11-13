---
name: atomic-design
description: Organização de componentes de interface no Veritas, em todo front-end (Vite, Next.js, React Native e templates Django). Use ao criar um componente novo, decidir onde ele mora, quebrar uma tela em partes, ou quando um componente parecer grande ou repetido demais.
metadata:
  escopo: frontend
  stacks: [vite, nextjs, react-native, react, django]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Atomic Design — organização de componentes

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

Vale para todo front-end da casa: Vite, Next.js e React Native.

**Templates Django** (renderizados no servidor): os níveis e as regras são os
mesmos, mas as pastas, a forma de chamar e o CSS mudam. Leia
[`django.md`](django.md).

## A pergunta que a pasta responde

Todo componente responde a uma pergunta: **de que ele depende?** É isso, e não o
tamanho dele, que decide onde mora.

```
src/components/
  atoms/        # não depende de nenhum outro componente nosso
  molecules/    # compõe atoms
  organisms/    # compõe molecules e atoms; pode ter estado e buscar dados
  templates/    # o esqueleto da tela, sem dado real
src/pages/      # template + dado; é o que a rota renderiza
```

## Os níveis

**Atom** — a menor peça útil. Botão, input, label, ícone, avatar. Não importa
outro componente nosso. Não sabe de domínio: um atom não se chama
`BotaoSalvarCliente`, se chama `Botao`.

**Molecule** — um punhado de atoms com um propósito só. Campo de busca (label +
input + botão), item de lista, card simples. Ainda não busca dado.

**Organism** — um pedaço da interface que se sustenta sozinho. Cabeçalho,
formulário de cadastro, tabela com paginação. Pode ter estado próprio e chamar
serviço.

**Template** — a tela sem conteúdo. Define o arranjo — onde fica o cabeçalho,
onde entra a lista — com props no lugar dos dados.

**Page** — o template preenchido. Busca o dado, trata carregamento e erro, e
entrega para o template. É a única camada que conhece rota.

**Tokens** — abaixo dos atoms. Cor, tamanho de texto, espaço, raio e sombra,
definidos uma vez (`@theme`, `:root`, objeto `theme` no RN, `base.html` no
Django). Não são componente: são o que os atoms consomem. Como montar:
`veritas:cores` e `veritas:tipografia-e-espacamento`.

## Regras (violação = erro)

- **Componente consome token, nunca valor cru.** Hex, `rgb()`, `px` solto,
  classe de cor do framework (`bg-blue-600`) ou valor arbitrário (`p-[13px]`)
  dentro de atom, molecule ou organism é erro: o valor vira token primeiro.
  Antes de entregar a tela: `veritas:revisao-de-design`.

- **A dependência aponta sempre para baixo.** Atom nunca importa molecule,
  molecule nunca importa organism. Se precisou, o componente está no nível
  errado.
- **Atom não conhece domínio.** Nada de `CardCliente` em `atoms/`. Se o nome
  precisa de um substantivo do negócio, é molecule ou acima.
- **Busca de dado só em organism ou page.** Atom e molecule recebem por prop —
  é o que os mantém testáveis e reutilizáveis.
- **Template não tem dado real.** Se você precisou de um `useEffect` no
  template, aquilo é uma page.
- **Componente responde ao próprio espaço, não à janela.** O que muda de
  forma conforme a largura do lugar onde está usa container query
  (`veritas:responsividade`).
- **Não crie o nível por antecipação.** Componente usado numa tela só começa
  dentro da própria page; sobe para `organisms/` quando a segunda tela precisar
  dele. Pasta cheia de componente com um uso só é custo sem retorno.

## Onde isso costuma dar errado

**O organism que virou página.** Se um organism busca dado, controla rota e
decide layout, ele é uma page com nome errado. Sintoma: props demais e
`useEffect` encadeado.

**O atom que cresceu.** Um `Botao` com quinze variantes por prop booleana já não
é um atom, é três componentes disfarçados. Sintoma: `if` sobre prop dentro do
render. Se `vercel-composition-patterns` estiver instalada, carregue para
desmontar: ela decide a técnica, esta skill decide em que nível cada parte
mora. As outras skills de fora: [skills-de-fora.md](skills-de-fora.md).

**Molecule que só existe para embrulhar um atom.** Se ela não acrescenta
comportamento nem composição, apague e use o atom direto.

## React Native

Os mesmos cinco níveis. O que muda é só o vocabulário da camada de baixo: atoms
são `View`, `Text`, `TouchableOpacity` em vez de elementos HTML. A regra de
dependência é idêntica.

## Origem

Banco de skills do Veritas, skill `atomic-design`. Método
original de Brad Frost; os nomes de pasta e as regras acima são a aplicação
escolhida pela casa.

Correções vão por PR no repositório, não editando a cópia local.
