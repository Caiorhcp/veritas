# Capturas — como tirar as quatro em cada ambiente

Arquivo de apoio da skill `revisao-de-design`. Salve as capturas fora do que
vai para o repositório (ex.: `.revisao/`, no `.gitignore`).

## Ferramenta de navegador do agente

Se a sessão tem ferramenta de navegador (Claude in Chrome, preview do editor,
outra), use-a: abra a URL do servidor de desenvolvimento, redimensione para
1440 e 390 de largura, troque o tema pelo controle da página ou pelo atributo
`data-theme` na `<html>`, e capture rolando a página inteira.

## Playwright (web)

Se o projeto já tem Playwright, ou dá para rodar sem instalar no projeto
(`npx playwright`), o script abaixo faz as quatro capturas, ativa
`prefers-reduced-motion` e mede a rolagem horizontal. Salve fora de `src/`
(ex.: `.revisao/capturar.mjs`) e rode com o servidor de desenvolvimento no ar:

```js
// node .revisao/capturar.mjs http://localhost:5173/rota
import { chromium } from 'playwright';

const url = process.argv[2];
const browser = await chromium.launch();
for (const largura of [1440, 390]) {
  for (const tema of ['light', 'dark']) {
    const page = await browser.newPage({
      viewport: { width: largura, height: largura === 390 ? 844 : 900 },
      colorScheme: tema,
      reducedMotion: 'reduce',
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: `.revisao/${largura}-${tema}.png`, fullPage: true });
    console.log(`${largura} ${tema}: rolagem horizontal ${sobra > 0 ? `SIM (+${sobra}px)` : 'não'}`);
    await page.close();
  }
}
await browser.close();
```

Uma captura avulsa pela linha de comando:

```bash
npx playwright screenshot --viewport-size=390,844 --color-scheme=dark --full-page http://localhost:5173 .revisao/390-dark.png
```

## Chrome ou Edge headless, sem Playwright

```bash
chrome --headless=new --screenshot=.revisao/390-light.png --window-size=390,844 http://localhost:5173
```

(No Windows, o executável é `msedge` ou o caminho completo do `chrome.exe`.)
A linha de comando não emula o tema escuro: use o controle de tema da página,
o atributo `data-theme="dark"`, ou fale com o navegador pelo protocolo de
DevTools (`Emulation.setEmulatedMedia` com `prefers-color-scheme: dark`).

## Django

Igual à web: rode `python manage.py runserver` com dado de exemplo carregado
(fixture ou factory, nunca cópia da produção: `veritas:lgpd`) e capture a URL.

## React Native / Expo

Rode o app no simulador ou emulador (`npx expo start`, depois `i` ou `a`).

| | iOS (simulador) | Android (emulador) |
|---|---|---|
| Captura | `xcrun simctl io booted screenshot .revisao/ios-claro.png` | `adb exec-out screencap -p > .revisao/android-claro.png` |
| Tema escuro | `xcrun simctl ui booted appearance dark` | `adb shell cmd uimode night yes` |
| Fonte máxima | Ajustes → Acessibilidade → Tela e Tamanho do Texto | `adb shell settings put system font_scale 2.0` |

Larguras: um aparelho pequeno (iPhone SE ou equivalente, ~375) e um grande. Em
tablet, se o app suporta. Sem simulador nem emulador, capture pelo Expo Go num
aparelho físico e diga isso no relatório.
