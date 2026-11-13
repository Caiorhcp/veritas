# Exemplos — responsividade

Arquivo de apoio da skill `responsividade`. Cada bloco é um ponto de partida:
os valores de cor, espaço e tamanho vêm dos tokens do projeto
(`veritas:cores`, `veritas:tipografia-e-espacamento`).

## Grade que não estoura

```css
/* celular: uma coluna que pode encolher abaixo do conteúdo mais largo */
.cards { display: grid; gap: var(--space-4); grid-template-columns: minmax(0, 1fr); }
/* daqui para cima, quantas colunas de pelo menos 16rem couberem */
@media (min-width: 40rem) {
  .cards { grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }
}
```

Tailwind: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. A classe
`grid-cols-1` é o que transforma a coluna implícita (`auto`) em
`minmax(0, 1fr)`; `grid gap-4 md:grid-cols-2` sozinho deixa o celular sem
coluna declarada.

Projeto com muitas grades assim: uma regra de base resolve todas, e as
utilidades continuam ganhando por estar numa camada acima:

```css
@layer base { .grid > * { min-width: 0; } }
```

## Container query

```css
.slot { container-type: inline-size; }
.card { display: grid; gap: var(--space-3); }
@container (min-width: 28rem) {
  .card { grid-template-columns: 8rem minmax(0, 1fr); }
}
```

Tailwind v4: `<div class="@container"><article class="grid @md:grid-cols-[8rem_1fr]">`.

## Tabela e bloco de código

```html
<div class="tabela-rola" role="region" aria-label="Planos" tabindex="0">
  <table>…</table>
</div>
```

```css
.tabela-rola { overflow-x: auto; }
pre { overflow-x: auto; max-width: 100%; }
.texto-livre { overflow-wrap: anywhere; }
```

O `tabindex="0"` com `role="region"` e nome deixa quem usa teclado rolar a
tabela; sem ele, a parte escondida fica inalcançável.

## Menu do celular (React)

Disclosure simples: a lista desce abaixo do cabeçalho, sem prender o foco.

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation'; // Vite: useLocation().pathname

export function MenuCelular({ links, rotulo }: { links: { href: string; label: string }[]; rotulo: string }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const rota = usePathname();

  useEffect(() => setAberto(false), [rota]);

  useEffect(() => {
    if (!aberto) return;
    raiz.current?.querySelector<HTMLAnchorElement>('nav a')?.focus();
    const fechar = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key !== 'Escape' : raiz.current?.contains(e.target as Node)) return;
      setAberto(false);
      if (e instanceof KeyboardEvent) botao.current?.focus();
    };
    document.addEventListener('mousedown', fechar);
    document.addEventListener('keydown', fechar);
    return () => {
      document.removeEventListener('mousedown', fechar);
      document.removeEventListener('keydown', fechar);
    };
  }, [aberto]);

  return (
    <div ref={raiz} className="md:hidden">
      <button ref={botao} type="button" aria-expanded={aberto} aria-controls="menu-celular"
        aria-label={rotulo} onClick={() => setAberto((a) => !a)} className="size-11">
        {/* ícone de menu / fechar */}
      </button>
      <nav id="menu-celular" aria-label={rotulo} hidden={!aberto} className="absolute inset-x-0 top-full">
        <ul>{links.map((l) => <li key={l.href}><a href={l.href} className="block px-3 py-3">{l.label}</a></li>)}</ul>
      </nav>
    </div>
  );
}
```

O cabeçalho que contém o menu precisa de `position: sticky` ou `relative` para
o `absolute` ancorar nele.

## Partial Django

```django
{# templates/components/tabela_rola.html #}
<div class="tabela-rola" role="region" aria-label="{{ rotulo }}" tabindex="0">
  <table>
    <thead><tr>{% for c in colunas %}<th scope="col">{{ c }}</th>{% endfor %}</tr></thead>
    <tbody>
      {% for linha in linhas %}
        <tr>{% for valor in linha %}<td>{{ valor }}</td>{% endfor %}</tr>
      {% endfor %}
    </tbody>
  </table>
</div>
```

```django
{% include "components/tabela_rola.html" with rotulo="Pedidos" colunas=colunas linhas=linhas %}
```

O meta viewport mora no `base.html`, uma vez:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## React Native

```tsx
import { FlatList, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Catalogo({ itens }: { itens: Item[] }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colunas = width >= 900 ? 3 : width >= 600 ? 2 : 1; // tablet a partir de ~600dp
  return (
    <FlatList
      key={colunas} // FlatList não aceita mudar numColumns sem remontar
      data={itens}
      numColumns={colunas}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingHorizontal: 16 }}
      renderItem={({ item }) => <View style={{ flex: 1, margin: 8 }}><CardItem item={item} /></View>}
    />
  );
}
```

O app precisa de um `SafeAreaProvider` na raiz.

## Medir a rolagem horizontal

Rode no console (ou pelo Playwright/DevTools) em cada largura. `LARGURA` é a
largura que você pediu à janela:

```js
((LARGURA) => {
  const culpados = [...document.querySelectorAll('body *')].filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= LARGURA + 1) return false;
    // quem está dentro de um bloco que rola ou corta não conta
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement)
      if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowX)) return false;
    return true;
  });
  return {
    estoura: document.documentElement.scrollWidth > LARGURA,
    scrollWidth: document.documentElement.scrollWidth,
    culpados: culpados.slice(0, 10).map((el) => `${el.tagName.toLowerCase()}.${el.className} → ${Math.round(el.getBoundingClientRect().right)}px`),
  };
})(360);
```

O primeiro culpado da lista costuma ser o pai de todos os outros: conserte nele.
