---
name: ambiente
description: Confere as ferramentas ao redor do Veritas na máquina da pessoa (Veritas, Firecrawl, Headroom, claude-mem, lgpd-skills) e ajusta o que estiver fora do padrão da casa, com confirmação. Só roda quando a pessoa chama.
disable-model-invocation: true
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Ambiente — as ferramentas no padrão da casa

Instruções para você, o agente. A pessoa chamou `/veritas:ambiente`.

**Regra de saída:** não narre. Confira tudo, proponha as correções numa
mensagem só, aplique o que ela confirmar, e termine com **um relatório**, no
formato do fim.

A fonte das decisões é o `docs/FERRAMENTAS.md` do repositório do Veritas.
Esta skill só confere e aplica o que está decidido lá.

## 0. Onde os comandos rodam

Tudo aqui é da máquina da pessoa. Use o shell que roda nela: no Claude Code, o
shell normal; no Cowork, o Desktop Commander. O shell isolado do Cowork **não
serve**: o que ele encontra ou muda não é a máquina dela.

Sem acesso à máquina: relatório com estado `não verificável aqui`, com os
comandos do passo 1 para ela rodar, e pare.

Descubra o sistema operacional (`$env:OS` no PowerShell, `uname` no bash). Os
comandos de variável de ambiente mudam entre Windows e macOS/Linux.

## 1. Confira

Um item de cada vez. Comando que não existe significa "não instalado", não
erro. **Comando que existe mas quebra** (traceback, `ModuleNotFoundError`) é
outro estado: `instalado com erro`. Costuma ser sobra de uma instalação
antiga. Mostre a última linha do erro e onde está o executável
(`Get-Command <nome>` no PowerShell, `command -v <nome>` no bash). Conserto,
só pelo passo 2, com o sim dela.

| Item | Como conferir | Padrão da casa |
|---|---|---|
| **Veritas no Claude Code** | `claude plugin list` → `veritas@veritas`, versão e status; `gh release view --repo Caiorhcp/veritas --json tagName` para a última | instalado, `enabled`, na última versão |
| **Firecrawl** | `firecrawl --status` | autenticado, com crédito; nunca `setup defaults` |
| **Headroom** (padrão do time) | `headroom --version`; `headroom doctor`; variável `HEADROOM_BEACON`; `claude mcp list` (procure `serena`) | instalado e funcionando, `HEADROOM_BEACON=off`, sem Serena |
| **claude-mem** (não adotado) | `claude plugin list` (procure `claude-mem`); pasta `~/.claude-mem` | ausente |
| **lgpd-skills** (opcional) | `claude plugin list` (procure `lgpd-skills`) | tanto faz: só informe |

Não leia o conteúdo de `~/.claude-mem` nem de nenhum banco ou cache que você
encontrar: pode ter dado pessoal de sessões anteriores (`veritas:lgpd`).
Basta saber se a pasta existe.

## 2. Proponha, numa mensagem só

Liste só o que está fora do padrão, com o comando que corrige. Peça um sim
para o conjunto, ou item a item se ela preferir.

| Fora do padrão | Correção |
|---|---|
| Veritas desatualizado no Claude Code | `claude plugin marketplace update veritas` e `claude plugin update veritas@veritas` |
| Veritas com erro de carga | mostre a mensagem do `claude plugin list`; não tente consertar |
| Firecrawl sem autenticação | ela roda `firecrawl login --browser` (a chave é dela, você não digita) |
| Headroom ausente | `uv tool install --python 3.13 "headroom-ai[all]"` (precisa do `uv`; sem ele, `pip install "headroom-ai[all]"`), depois `headroom wrap claude --code-memory none` |
| Headroom com telemetria | Windows: `[Environment]::SetEnvironmentVariable("HEADROOM_BEACON","off","User")`. macOS/Linux: `export HEADROOM_BEACON=off` no `~/.zshrc` ou `~/.bashrc` |
| Serena instalado pelo Headroom | `headroom unwrap claude` e `headroom wrap claude --code-memory none` |
| claude-mem instalado | `claude plugin uninstall claude-mem` |
| Headroom instalado com erro | remover a sobra (`pip uninstall headroom-ai`, no Python do executável que você achou) e instalar como em "Headroom ausente". Depois, `headroom --version` tem que resolver para o executável novo |
| Pasta `~/.claude-mem` existe | só avise. Ela guarda o que as sessões capturaram. Apagar é definitivo e é decisão dela: entregue o caminho e não apague |

Mudança que precisa de reiniciar (plugin, variável de ambiente) vai em "falta
você fazer".

## 3. Aplique o que ela confirmou

Rode os comandos confirmados e confira de novo o item. O estado do relatório é
o que a segunda conferência mostrou, não o que o comando prometeu.

Instalar, só o que é padrão do time e só com o sim dela: o Headroom. O
lgpd-skills é opcional: ausente, o relatório diz "não instalado" e pronto.
Firecrawl ausente também só se informa, porque precisa da chave dela
(`skills/docs-oficiais/instalacao.md`).

## 4. Relatório

```
VERITAS — ambiente

  Veritas (Claude Code)   v1.0.0 · atualizado
  Firecrawl               autenticado · 994 créditos
  Headroom                instalado · telemetria desligada · sem Serena
  claude-mem              ausente
  lgpd-skills             não instalado (opcional)

  Ajustado agora
    · HEADROOM_BEACON=off (usuário)

  Falta você fazer
    1. Reiniciar o Claude Code
    2. Decidir sobre ~/.claude-mem: guarda sessões antigas; apagar é definitivo
```

Estados por item: `ok`, `ajustado agora`, `fora do padrão` (quando ela não
confirmou), `não instalado`, `instalado com erro`, `não verificável aqui`.

## Origem

Banco de skills do Veritas, skill `ambiente`. Criada em
2026-09-23 para a v1.0, quando a casa decidiu: Headroom padrão do time, com
telemetria desligada e sem Serena; claude-mem não adotado. Decisões e motivos
em `docs/FERRAMENTAS.md`.

Correções vão por PR no repositório, não editando a cópia local.
