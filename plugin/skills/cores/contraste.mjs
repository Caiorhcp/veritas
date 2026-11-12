// Razão de contraste WCAG 2.2 entre pares de cores hex. Sem dependência.
//   node contraste.mjs "#16212B" "#F4F6F8" ["#A63D0E" "#E4EAF0" ...]
// Fórmula: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html (definições "contrast ratio" e "relative luminance")

const canal = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

export function luminancia(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`cor inválida: ${hex} (use #rgb ou #rrggbb)`);
  const [r, g, b] = [0, 2, 4].map((i) => canal(parseInt(full.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function razao(a, b) {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

// Autoteste: preto/branco é 21:1 e #777 sobre branco fica abaixo de 4.5 (4.48).
console.assert(Math.abs(razao('#000', '#fff') - 21) < 1e-9, 'preto/branco deveria dar 21');
console.assert(razao('#777777', '#ffffff') < 4.5, '#777 sobre branco deveria reprovar texto normal');

const args = process.argv.slice(2);
if (args.length % 2) {
  console.error('passe as cores em pares: frente fundo [frente fundo ...]');
  process.exit(1);
}
for (let i = 0; i < args.length; i += 2) {
  const r = razao(args[i], args[i + 1]);
  // Sem arredondar para cima: 4.499 não passa em 4.5 (nota do próprio W3C).
  const v = (min) => (r >= min ? 'passa' : 'REPROVA');
  console.log(`${args[i]} sobre ${args[i + 1]}: ${r.toFixed(2)}:1 | texto ${v(4.5)} | texto grande e UI ${v(3)}`);
}
