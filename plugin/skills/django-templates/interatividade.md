# HTMX e Alpine em templates Django

Parte da `django-templates`. Vale quando o projeto escolheu HTMX, Alpine ou os
dois. Cada item abaixo já custou uma volta num projeto da casa (jcmotors).

## Quem faz o quê

- **HTMX:** o servidor decide, e o HTML volta pronto. Filtro de lista,
  paginação, prévia de cálculo, trocar uma linha da tabela.
- **Alpine:** o estado vive só no navegador. Abrir modal, trocar aba,
  mostrar ou esconder, habilitar o botão de enviar.

Regra de negócio não vai no Alpine. Se a decisão depende de dado do banco, é
HTMX (ou recarregar a página).

## HTMX

**A resposta é um partial.** A view renderiza só o pedaço que troca:
`render(request, "app/tela.html#resultado", ctx)` com `{% partialdef
resultado %}` no template da tela (Django 6). A mesma marcação serve à página
inteira e à resposta do HTMX, sem arquivo duplicado.

**CSRF em POST do HTMX.** Ponha o token no `<body>` do layout base, e toda
requisição HTMX leva junto:

```html
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
```

**O que é inicializado por JS some no conteúdo trocado.** Ícones (Lucide:
`<i data-lucide>`), máscaras de campo (IMask) e qualquer outro
`init` que rode no carregamento da página não passam pelo HTML novo. Reaplique
no evento `htmx:afterSwap`, com uma guarda para não aplicar duas vezes no
mesmo elemento:

```js
document.body.addEventListener("htmx:afterSwap", () => {
  lucide.createIcons();
  aplicarMascaras();   // a função do projeto, que já confere se o campo tem máscara
});
```

**Retorno de ação.** Ação que passa pelo servidor responde com `messages`
(PRG, ou no próprio partial). Ação que acontece só no navegador (copiar
texto, por exemplo) responde com toast. Um não substitui o outro.

## Alpine

**`x-cloak` fica fora de qualquer `@layer`, com `!important`:**

```css
[x-cloak] { display: none !important; }
```

Dentro de `@layer base`, ele perde para qualquer componente que define
`display` (um backdrop `flex` em `@layer components`), e o modal pisca em todo
carregamento. Todo elemento `fixed` que o Alpine esconde (backdrop de modal,
toast) leva `x-cloak`.

**Modal com formulário.** O `<form>` do modal é irmão do resto da página,
nunca aninhado em outro `<form>`.

**Estado do formulário no `<form>`.** O `x-data` fica no `<form>`, não no
campo. O botão de enviar que depende desse estado nasce `disabled` no HTML,
além do `x-bind:disabled`: se o JS não carregar, ele não fica clicável por
engano.

**`x-on:` e `:attr` não passam pelo `render_field`** do widget-tweaks (ver a
seção Formulário da `SKILL.md`). Ponha o handler num elemento escrito à mão:
o evento borbulha até ele.

## Sem JS, ainda funciona

Máscara é conveniência de digitação, não validação: quem valida é o campo do
form. HTMX e Alpine melhoram a tela, mas o formulário tem que funcionar com
JS desligado (envio normal, validação no servidor).
