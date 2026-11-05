# Instalar o Firecrawl para a `docs-oficiais`

Guia para a pessoa, não para o agente. O agente entrega estes passos e não roda
nenhum por ela: login e chave são dela.

Sem o Firecrawl, a skill segue funcionando e avisa quando a resposta não foi
conferida na doc. Instalar deixa essa conferência possível.

## Antes

- **Node.js 22 ou mais novo** (`node --version`). É o mínimo que a CLI exige.
- **Uma chave de API.** Combine com o seu time qual das duas usar:
  - **Conta do time, uma chave por pessoa.** Recomendado. Cada chave pode ter
    teto próprio (passo 3), e revogar a de uma pessoa não derruba as outras.
  - **Conta pessoal.** Serve para testar. O plano gratuito dá 1.000 créditos
    por mês por conta.

## 1. Instale e faça login

No PowerShell ou no terminal, **fora** de `C:\Windows\System32`:

```bash
npx -y firecrawl-cli@latest init --browser --skip-skills
```

- `--browser` faz o login pelo navegador, e a chave não passa pelo terminal.
- `--skip-skills` deixa de fora as 28 skills que o Firecrawl instala por
  padrão. A `docs-oficiais` já traz o que o time usa. As 28 somariam descrições
  em toda conversa e disputariam o gatilho com ela.

Prefere colar a chave? Rode `firecrawl login --method manual` e cole quando
ele pedir. **Não passe a chave com `-k` na linha de comando**: ela fica gravada
no histórico do terminal.

## 2. Confira

```bash
firecrawl --status
```

Esperado: `Authenticated` e o saldo de créditos. Não gasta crédito.

## 3. Ponha um teto na chave

Em `firecrawl.dev/app/api-keys`, no menu da chave: **Set limit**. Um teto
mensal (ex.: 300 créditos) impede que uma tarefa longa consuma a cota do time
inteiro.

## 4. No Cowork e no Claude Desktop

O agente só alcança a CLI por uma ferramenta que rode comandos na sua máquina.
Hoje, é o **Desktop Commander**. Sem ele conectado, o agente trabalha num
ambiente isolado onde o Firecrawl não existe, e a skill cai no modo "sem
Firecrawl".

No **Claude Code** não há nada a fazer: ele já roda na sua máquina.

## 5. Nos projetos

Acrescente ao `.gitignore` de cada repositório:

```
.firecrawl/
```

É onde a CLI grava quando raspa várias URLs de uma vez.

## O que deixar de fora

- **`firecrawl setup defaults` e `firecrawl make default`.** Tornam o
  Firecrawl o leitor padrão de páginas do agente. Toda página que ele abrir
  passa a gastar crédito, inclusive as que não precisam. Se já rodou, desfaça:
  `firecrawl setup defaults --undo`.
- **`firecrawl env`.** Grava a chave num `.env` na pasta atual, e esse arquivo
  acaba commitado mais cedo ou mais tarde.

## Já instalou com `init --all`?

As 28 skills ficam em `~/.claude/skills/` e `~/.agents/skills/`, nas pastas que
começam com `firecrawl`. Para tirar, confira a lista e apague:

```powershell
Get-ChildItem "$env:USERPROFILE\.claude\skills", "$env:USERPROFILE\.agents\skills" -Directory -Filter "firecrawl*"
# Conferiu? Então:
Get-ChildItem "$env:USERPROFILE\.claude\skills", "$env:USERPROFILE\.agents\skills" -Directory -Filter "firecrawl*" | Remove-Item -Recurse
```

A CLI continua instalada. Só as skills saem.

## A chave vazou

Colou no chat, commitou, mandou no terminal com `-k`: trate como vazada.

1. Revogue em `firecrawl.dev/app/api-keys` e gere outra.
2. Troque a credencial local:

   ```bash
   firecrawl logout
   firecrawl login --browser
   ```

3. Se foi pelo terminal, limpe o histórico. No PowerShell, o arquivo está em:

   ```powershell
   (Get-PSReadLineOption).HistorySavePath
   ```

   Abra, apague a linha com a chave, salve.
4. Se foi commitada, apagar no commit seguinte não basta: o histórico do git
   guarda. A revogação do passo 1 é o que resolve.
