---
name: atualizar
description: Atualiza o Veritas para a última versão publicada e informa em um relatório único o que deu certo, o que falhou e o que falta. Só roda quando a pessoa chama.
disable-model-invocation: true
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Atualizar o Veritas

Instruções para você, o agente. A pessoa chamou `/veritas:atualizar`, ou aceitou
o aviso de versão nova.

**Regra de saída, acima de tudo:** não narre os passos enquanto executa. Execute
em silêncio e termine com **um único relatório**, no formato da última seção.
Uma vez só. Sem "vou verificar…", sem "agora vou baixar…", sem repetir o
relatório depois de uma pergunta.

## 0. Teste a capacidade, não o ambiente

Isto decide tudo o que vem depois, e errar aqui produz um relatório mentiroso.

**Não tente adivinhar em que ambiente você está.** Teste diretamente a única
coisa que importa — se você consegue falar com o GitHub:

```bash
gh release view --repo Caiorhcp/veritas --json tagName 2>&1 | head -3
```

**Respondeu com a tag** — siga o fluxo normal, passos 1 a 4.

**Não respondeu** — `gh` ausente, sem autenticação ou sem rede. Você **não
consegue** consultar a Release nem instalar nada daqui. Emita o relatório com
estado `não verificável aqui` e entregue os comandos para ela rodar no próprio
terminal.

Não diga `falhou`, e **não diga que ela precisa instalar o `gh`**. Você não tem
como saber se o `gh` falta na máquina dela ou só no lugar de onde você executa.
Se faltar mesmo, ela descobre no primeiro comando que rodar, e a mensagem do
próprio `gh` é mais clara que o seu palpite.

**Por que não adivinhar o ambiente.** A versão anterior desta skill decidia por
alcance ao disco (`ls ~/.claude`, `ls ~/workspace`) e chamava de sandbox tudo
que não os encontrasse. Existe um terceiro caso que essa conta não previa, e é
onde o Cowork cai: **alcança o disco da pessoa por um caminho montado, mas não
tem `gh` nem credencial.** A resposta saía certa por coincidência. Capacidade se
testa usando, não deduzindo.

### Se o `gh` responde, ainda falta uma pergunta

Funcionar não basta: o arquivo precisa cair onde ela alcança. Antes de reportar
`baixado`, confira onde o download parou:

```bash
pwd && ls -la *.plugin
```

Se o caminho não é um que ela reconhece e consegue abrir, o arquivo caiu num
isolamento e some. Nesse caso o estado é `não verificável aqui`, não `baixado` —
reportar sucesso de um arquivo que ninguém vai encontrar é a pior saída
possível.

## 1. Levante o estado

```bash
gh release view --repo Caiorhcp/veritas --json tagName,publishedAt,body
```

Versão instalada: campo `version` de `.claude-plugin/plugin.json` do plugin.

Se já estiver na última, emita o relatório com estado `já atualizado` e pare.

## 2. Antes de tocar em nada, cheque edição local

Se a pessoa tem o repositório clonado:

```bash
cd ~/workspace/veritas && git status --short plugin/
```

**Se houver mudança não commitada em `plugin/skills/`, pare.** Não atualize. Emita o
relatório com estado `bloqueado` e liste os arquivos — instalar por cima apaga
aquilo em silêncio, e trabalho perdido sem aviso é pior que ficar desatualizado.

## 3. Atualize

Depende de como o plugin foi instalado. Descubra usando:
`claude plugin marketplace list` mostra a marketplace `veritas` e a origem
dela.

**Claude Code, marketplace do GitHub** (`Source: GitHub`):

```bash
claude plugin marketplace update veritas
claude plugin update veritas@veritas
```

**Claude Code, marketplace de pasta local** (`Source: Directory`): o
`git pull` sozinho não basta, porque o plugin instalado é uma cópia.

```bash
cd ~/workspace/veritas && git pull
claude plugin marketplace update veritas
claude plugin update veritas@veritas
```

Nos dois casos, a versão nova só vale depois de reiniciar o Claude Code:
isso vai em `falta você fazer`.

**Cowork, ou sem `claude` no PATH:**

```bash
gh release download --repo Caiorhcp/veritas --pattern "*.plugin" --clobber
```

O download entrega o arquivo; quem instala é a pessoa, arrastando para uma
conversa. Isso conta como `falta você fazer`, não como falha.

## 4. Emita o relatório

Um bloco, no formato abaixo. Preencha só as seções que se aplicam.

```
VERITAS — atualização

  Antes     v0.1.0
  Agora     v0.2.0
  Estado    atualizado

  Novidades
    · menu /veritas:ajuda
    · skill atomic-design

  Falta você fazer
    1. Reiniciar o Claude — plugins carregam na abertura da sessão
```

Estados possíveis: `atualizado`, `já atualizado`, `baixado`, `bloqueado`,
`não verificável aqui`, `falhou`.

Modelo do estado `não verificável aqui`:

```
VERITAS — atualização

  Instalada   v0.2.0
  Publicada   não consegui consultar
  Estado      não verificável aqui — o gh não respondeu de onde eu executo

  Falta você fazer
    1. No seu terminal:
       gh release view --repo Caiorhcp/veritas
    2. Se houver versão mais nova:
       gh release download --repo Caiorhcp/veritas --pattern "*.plugin"
    3. Arrastar o .plugin para uma conversa e instalar por cima
```

## Quando falha: causa, o que falta, link

Diga **o que falhou** e **o que a pessoa faz agora**. Nunca só "deu erro".

| O que aconteceu | Escreva em "Falta você fazer" |
|---|---|
| `gh` não respondeu no passo 0 | Não é falha — estado `não verificável aqui`. Entregue os comandos para ela rodar no terminal dela, e o link: `https://github.com/Caiorhcp/veritas/releases/latest`. Não mande instalar o `gh`: você não sabe se ele falta lá |
| `gh` respondeu, mas pede autenticação | Rodar `gh auth login`, depois `/veritas:atualizar` de novo |
| Nenhuma release publicada | Nada a fazer — use a instalação pela marketplace (`claude plugin marketplace add Caiorhcp/veritas`) |
| Sem rede | Tentar de novo quando houver conexão |
| `git pull` com conflito | Resolver o conflito, ou `git stash` se a mudança local não importa — links não ajudam aqui, mostre os arquivos em conflito |
| Mudança local não commitada | Transformar em PR antes: `git checkout -b minha-regra`, commit, `gh pr create` |

Exemplo de relatório de falha:

```
VERITAS — atualização

  Antes     v0.1.0
  Agora     v0.1.0 (sem mudança)
  Estado    falhou — gh não encontrado no PATH

  Falta você fazer
    1. Baixar: https://github.com/Caiorhcp/veritas/releases/latest
    2. Arrastar o .plugin para uma conversa e instalar por cima
    3. Reiniciar o Claude
```

## Publicar, do outro lado

Se quem chamou é a pessoa que cuida do banco e quer **publicar**:

```bash
# na pasta plugin/; 1. subir o version em .claude-plugin/plugin.json
uv run pytest tests/ -v
uv run python tools/empacotar.py
gh release create v0.3.0 dist/veritas.plugin --notes "o que mudou"
```

## Origem

Banco de skills do Veritas, skill `atualizar`.
Correções vão por PR no repositório, não editando a cópia local.
