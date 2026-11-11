// Empacota src/extension.ts (e o lib.ts da CLI que ele importa) num único dist/extension.js CommonJS.
import { build } from 'esbuild';

await build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  external: ['vscode'],
  minify: true,
  logLevel: 'info',
  // cli/src/lib.ts acha conventions/, templates/ e package.json por import.meta.url; no bundle, dist/.. é a extensão.
  define: { 'import.meta.url': 'importMetaUrl' },
  banner: { js: "const importMetaUrl = require('node:url').pathToFileURL(__filename).href;" },
});
