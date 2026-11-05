---
name: django-templates
description: Front-end Django com templates renderizados no servidor. Use ao criar ou alterar templates .html de um projeto Django, componentizar uma tela, criar include ou partial, montar formulário no template, começar o front de um projeto ou app Django, ou usar Tailwind, HTMX ou Alpine em Django.
metadata:
  escopo: frontend
  stacks: [django]
  upstream:
    - url: https://docs.djangoproject.com/en/6.0/ref/templates/builtins/
      pacote: django
      registry: pypi
  versao_verificada: "6.0"
---

# Django templates — front renderizado no servidor

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

A casa ainda não tem um projeto de referência para o front Django. Por isso
esta skill não impõe arquitetura: ela **lê o que o projeto já decidiu**, e
**pergunta** quando nada foi decidido. As regras da seção "Sempre" valem em
qualquer caso.

Backend (view, service, model) continua na `veritas:django`. Onde cada nível
de componente mora está na `veritas:atomic-design`, arquivo `django.md`.

## 1. Leia antes de perguntar

Procure, nesta ordem:

1. O `CLAUDE.md` do projeto: uma seção de front decidida vale mais que esta
   skill.
2. `templates/components/` e o `base.html` ou `layouts/`: como o projeto já
   quebra as telas.
3. `static/css/`: CSS por componente (`components/atoms/...`) ou utilities
   direto no HTML.
4. `pyproject.toml` e `package.json`: `tailwindcss`, `django-widget-tweaks`,
   `django-crispy-forms`, `htmx`, `alpinejs`.

**Achou padrão:** siga o padrão, e não pergunte o que o código já responde.
Divergir do padrão do projeto só com pedido explícito.

## 2. Pergunte quando nada foi decidido

**Em modo conservar** (`veritas:projeto-existente`), estas perguntas não se
fazem: siga a tela mais parecida que já existe, mesmo que o projeto misture
padrões. Elas servem a projeto novo, front novo num projeto da casa, ou
remodelação.

Faça as perguntas quando:

- o projeto, ou a área da tela, ainda não tem front;
- a pessoa pediu para "componentizar" ou "criar do zero";
- o que existe se contradiz (ex.: `components/` e `v2/` com padrões
  diferentes).

As três de uma vez, numa mensagem só, antes de escrever markup:

1. **Componentizar?**
   - **Atomic design:** pastas `atoms/`, `molecules/` e `organisms/`, no
     template e no CSS. Veja `veritas:atomic-design` → `django.md`.
   - **Pasta única:** `templates/components/_nome.html`, sem níveis.
   - **Sem componente:** tela simples ou descartável, tudo na própria página.
2. **CSS:**
   - **Classes de componente:** um arquivo CSS por componente (`.btn`,
     `.card`), e utilities do Tailwind só para posicionamento.
   - **Utilities direto no HTML:** sem arquivo por componente.
3. **Interatividade:**
   - **HTMX:** trocar pedaço da tela com resposta do servidor.
   - **Alpine:** estado só no navegador (modal, aba, toggle).
   - **Os dois.**
   - **Nenhum:** página recarrega, formulário com PRG.

Ofereça como padrão atomic design, classes de componente e HTMX com Alpine.
É a combinação mais testada na casa (jcmotors), mas a escolha é da pessoa.

**Registre a resposta** no `CLAUDE.md` do projeto, numa seção "Front". É o que
faz a próxima tarefa cair no passo 1 e não perguntar de novo.

Escolheu HTMX ou Alpine: leia [`interatividade.md`](interatividade.md) antes
de escrever o primeiro atributo `hx-` ou `x-`.

## 3. Sempre

Valem com qualquer resposta às perguntas.

**Componente tem contrato.**

- Todo `{% include %}` de componente usa `with ... only`. Sem o `only`, o
  componente passa a depender do contexto da página por acidente.
- O topo do arquivo diz, num `{% comment %}`, o que ele recebe, quais
  parâmetros são obrigatórios e um exemplo de uso.

**CSRF em componente com formulário.** Com `only`, o `csrf_token` não vai
junto: passe `csrf_token=csrf_token` explicitamente. Sem isso, o
`{% csrf_token %}` sai vazio e todo envio volta 403. O Django só avisa no
console, e o test client não confere CSRF, então o teste não pega.

**Lógica fora do template.** No template fica só lógica de exibição: `{% if %}`
para mostrar ou esconder, `{% for %}` sobre lista pronta, filtro para
formatar. Calcular, decidir estado, agregar ou filtrar queryset vai para o
model (`@property`, `is_*()`), um presenter, o form ou o contexto da view.
Template tag que consulta o banco é query escondida: a view entrega o dado.

**Fragmento de um arquivo só usa partial nativo.** No Django 6:
`{% partialdef nome %}` e `{% partial nome %}`. Ele também serve de resposta
de HTMX: `render(request, "app/tela.html#nome", ctx)`. Vira arquivo próprio em
`components/` quando o segundo template precisar dele.

**Formulário.**

- Rótulo e `help_text` ficam no model; rótulo específico de uma tela, em
  `Meta.labels` do form.
- `placeholder`, `autofocus` e classe CSS ficam no template, nunca em
  `attrs=` no `forms.py`. Atributo de comportamento (`step`, `min`,
  `inputmode`, `maxlength`) pode ficar no form.
- `{{ form.non_field_errors }}` aparece na tela: erro de restrição com mais de
  um campo não cai em campo nenhum.
- Com `django-widget-tweaks`: campo a campo, com `{% render_field %}` ou o
  componente de campo do projeto, nunca `{{ form }}` ou `as_p`. Atributo com
  `:` (`x-on:change`, `:class`, `@click`) não passa pelo `render_field`: sai
  renderizado errado e sem erro. Ponha o handler num elemento escrito à mão.

**Link sem destino renderiza inerte.** Item de menu ou botão cuja tela ainda
não existe ganha estado desabilitado visível, nunca `href="#"`.

**Acessibilidade.** Todo campo tem `<label for>`. O erro do campo fica em
`id="{{ field.auto_id }}_error"`, que é para onde o `aria-describedby` do
Django aponta. Ícone sozinho num botão pede `aria-label`.

## Skills de fora

Se estiverem instaladas, carregue sem esperar pedido:

- Página pública (landing, site, portfolio) → `design-taste-frontend`
- Site existente com cara genérica → `redesign-existing-projects`
- Revisar UI ou acessibilidade → `web-design-guidelines`

Elas decidem visual; as respostas do passo 2 e as regras de "Sempre" são
desta skill. **Em conflito, esta vence.** O que nunca entra sozinho:
[skills-de-fora.md](../atomic-design/skills-de-fora.md).

## Origem

Banco de skills do Veritas, skill `django-templates`. Criada
em 2026-09-23. As regras de "Sempre" foram tiradas do `CLAUDE.md` do jcmotors,
onde cada uma veio de um defeito real (o CSRF vazio no partial de pagamento, o
atributo `x-on:` mutilado pelo widget-tweaks). A escolha de arquitetura ficou
como pergunta porque a casa ainda não tem projeto de referência. Partials
nativos conferidos nas notas de versão do Django 6.0.

Correções vão por PR no repositório, não editando a cópia local.
