# Atomic design em Django (templates no servidor)

Parte da `atomic-design`. Vale quando o projeto Django escolheu componentizar
com atomic design (a `django-templates` pergunta isso quando nada foi
decidido). Os cinco níveis e as regras de dependência da `SKILL.md` valem
iguais; o que muda é onde cada nível mora e como ele é chamado.

## Onde cada nível mora

O template e o CSS de um componente ficam **no mesmo nível**, com o mesmo
nome:

```
core/templates/components/
  atoms/        _button.html   _badge.html   _input.html
  molecules/    _field.html    _card.html    _stat_card.html
  organisms/    _sidebar.html  _header.html  _dialog.html
core/templates/layouts/         base.html, app.html        ← nível template
<app>/templates/<app>/          lista.html, form.html      ← nível page

core/static/css/components/
  atoms/        button.css     badge.css     input.css
  molecules/    field.css      card.css      stat-card.css
  organisms/    sidebar.css    header.css    dialog.css
```

- **Componente compartilhado** mora em `core/`. **Componente de um app só**
  mora no app: `<app>/templates/<app>/components/molecules/_x.html`. Sobe para
  `core/` quando o segundo app precisar dele.
- **Nome com `_` na frente:** o arquivo é pedaço, não tela.

## Como cada nível é chamado

| Nível | Chamado com | Recebe |
|---|---|---|
| atom | `{% include "components/atoms/_button.html" with ... only %}` | valores prontos: texto, variante, ícone |
| molecule | `{% include ... with ... only %}` | valores ou um objeto de apresentação (um `field` de form, por exemplo) |
| organism | `{% include ... with ... only %}` | objetos do contexto da view; pode iterar sobre lista |
| template | `{% extends "layouts/app.html" %}` | blocks: `{% block content %}` |
| page | a view: `render(request, "app/lista.html", ctx)` | o contexto inteiro |

## As regras, traduzidas

- **A dependência aponta para baixo.** Um atom não inclui nenhum outro
  componente. Uma molecule inclui atoms. Se um atom precisou incluir alguma
  coisa, ele está no nível errado.
- **Atom não conhece domínio.** `_button.html`, nunca `_botao_salvar_cliente.html`.
- **Ninguém busca dado.** Aqui a regra é mais estrita que no React, onde o
  organism pode chamar serviço: no Django, "buscar dado" é consultar o banco,
  e só a view faz isso. Nem organism, nem template tag: inclusion tag que chama o ORM
  é query escondida dentro do HTML. O organism recebe a lista pronta.
- **Layout não tem dado.** O `layouts/app.html` define os `{% block %}` e o
  esqueleto (sidebar, cabeçalho, área de conteúdo). Dado entra pela page.
- **Não crie o nível por antecipação.** Pedaço usado numa tela só começa como
  `{% partialdef %}` dentro da própria page (Django 6). Vira arquivo em
  `components/` quando a segunda tela precisar dele.

## CSS

- **Um arquivo por componente**, na pasta do nível dele. Todo componente entra
  com `layer(components)`. Sem a camada, a classe do componente vence as
  utilities do Tailwind, e um `class="btn w-full"` perde o `w-full`.
- **Importe na ordem atoms → molecules → organisms** no CSS de entrada
  (`input.css`). Componente fora da lista de `@import` não entra no bundle.
  Exceção de ordem (um atom que sobrescreve outro) fica comentada no próprio
  `@import`.
- **A classe do componente é o componente:** estrutura, cor, tipografia,
  estados, variantes. **A utility é o posicionamento na página:** grid,
  espaço, largura, alinhamento. Variante nova entra no arquivo CSS do
  componente, nunca inline no template.
- **Parta do que existe.** Antes de escrever markup, leia os arquivos de
  `static/css/components/` e use as classes de lá. Nunca invente um nome de
  classe que não existe nesses arquivos.

## Uma página que mostra tudo

Vale ter uma rota `/design-system/` (só em `DEBUG`, ou só para staff) que
renderiza cada componente com as variantes dele. Ela serve de catálogo para
quem vai montar a tela, e mostra de cara quando uma mudança de CSS quebrou
outro componente.
