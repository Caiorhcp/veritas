# Publicar a extensão

Dois lugares: o **VS Code Marketplace** (VS Code) e o **Open VSX** (Cursor, Windsurf, VSCodium, Trae e outros forks, que não usam o Marketplace da Microsoft). Os dois usam o mesmo `.vsix`.

> **Tokens nunca entram no repositório.** Nada de `.env` commitado, nada de token em `package.json`, em script ou em workflow. Use as variáveis só no terminal (ou em secrets do GitHub, se um dia automatizar).

## 0. Gerar o pacote

```powershell
cd extension
$env:NODE_ENV=$null
npm ci
npm test
npx @vscode/vsce package     # gera veritas-<versão>.vsix (roda o build antes)
```

Para uma versão nova: suba `version` no `package.json` antes de empacotar.

## Download manual pelo site

Depois de gerar o pacote, copie-o para o site (que mostra versão, tamanho e SHA-256 na página /extensao):

```powershell
cd ..\site
node scripts/sync-vsix.mjs
```

Envie a mudança; a Vercel publica o arquivo novo em `https://veritasdev.vercel.app/downloads/veritas-<versão>.vsix`.

## 1. VS Code Marketplace

1. Crie uma organização no Azure DevOps (grátis): https://dev.azure.com → "New organization". Qualquer nome serve; ela só existe para emitir o token.
2. Crie um Personal Access Token nessa organização: avatar → **Personal access tokens** → **New Token**:
   - Organization: **All accessible organizations** (obrigatório; com uma só, o publish falha com 401).
   - Scopes: **Custom defined** → **Show all scopes** → **Marketplace → Manage**.
   - Copie o token; ele não aparece de novo.
3. Crie o publisher em https://marketplace.visualstudio.com/manage/createpublisher, entrando com a mesma conta Microsoft. O **ID** precisa ser igual ao campo `publisher` do `package.json` (hoje `caiorhcp`). Se escolher outro ID, troque no `package.json`.
4. Faça login e publique:

   ```powershell
   npx @vscode/vsce login caiorhcp          # cola o token quando pedir
   npx @vscode/vsce publish                 # ou: npx @vscode/vsce publish --packagePath veritas-0.2.0.vsix
   ```

A página fica em `https://marketplace.visualstudio.com/items?itemName=caiorhcp.veritas` depois da verificação automática (alguns minutos).

## 2. Open VSX

1. Entre em https://open-vsx.org com a conta do GitHub.
2. Ligue uma conta Eclipse e assine o **Publisher Agreement**: https://open-vsx.org/user-settings/profile → "Log in with Eclipse" → crie a conta Eclipse com o mesmo e-mail se não tiver → assine o acordo.
3. Gere um token em https://open-vsx.org/user-settings/tokens → **Generate New Token**. Copie.
4. Crie o namespace (uma vez só; o nome é o `publisher` do `package.json`) e publique:

   ```powershell
   npx ovsx create-namespace caiorhcp -p <token>
   npx ovsx publish veritas-0.2.0.vsix -p <token>
   ```

   Em vez de `-p`, dá para usar a variável `OVSX_PAT` só nessa sessão do terminal: `$env:OVSX_PAT="<token>"`.

5. Opcional: peça a verificação do namespace (selo de publisher verificado) abrindo uma issue em https://github.com/EclipseFdn/open-vsx.org/issues com o modelo "Claim namespace ownership".

## Conferir antes de publicar

- `npx @vscode/vsce ls` lista o que entra no pacote: tem que ter `dist/`, `conventions/`, `process/`, `templates/`, `l10n/`, `media/`, `icon.png`, `README.md`, `LICENSE`, `package.nls*.json`, e nada de `src/`, `test/` ou `node_modules/`.
- Instale o `.vsix` localmente: `code --install-extension veritas-0.2.0.vsix --force` (no Cursor: `cursor --install-extension …`).
