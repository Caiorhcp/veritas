---
name: buscar-skills
description: Procura e instala skills públicas do diretório skills.sh. Só roda quando a pessoa pede — não é convenção da casa, é ferramenta de busca.
disable-model-invocation: true
metadata:
  escopo: geral
  stacks: [todas]
  upstream:
    - registry: interno
  versao_verificada: "1.0"
---

# Procurar skills públicas no skills.sh

**Esta skill não dispara sozinha.** `disable-model-invocation: true` no
frontmatter garante isso: ela só roda quando a pessoa chama por `/`. É
deliberado — as outras skills do Veritas são convenção da casa e devem entrar
sem pedir; esta é uma busca externa, e busca externa é escolha de quem trabalha,
não do agente.

## O que é o skills.sh

Diretório público de Agent Skills mantido pela Vercel, com skills de vários
autores para vários agentes. O código do diretório é aberto em
`github.com/vercel-labs/skills`.

## Procurar

A API oficial exige token OIDC da Vercel, então não serve aqui. Use as páginas,
que são públicas:

- Uma skill específica: `https://www.skills.sh/{owner}/{repo}/{skill}`
  Exemplo: `https://www.skills.sh/anthropics/skills/frontend-design`
- Fonte por domínio: `https://www.skills.sh/site/{dominio}/{skill}`

A página de cada skill mostra o `SKILL.md` inteiro e o comando de instalação.
Busque por web, abra a página da candidata, e **leia o `SKILL.md` antes de
sugerir**.

## Instalar

**Não rode o instalador.** Entregue o comando para ela rodar no próprio
terminal, sempre, e diga por quê em uma linha.

Isto não é cautela exagerada: é o único jeito de não mentir. Instalar é uma
ação que **precisa acontecer no Claude dela**, e você não tem como provar daqui
que foi ali que aconteceu.

**Não tente adivinhar o ambiente para decidir.** A versão anterior desta skill
deduzia por alcance ao disco (`ls ~/.claude`, `ls ~/workspace`) e tratava
ausência como sandbox. Existe um terceiro caso que essa conta não previa:
**alcançar o disco dela por um caminho montado, sem ser o ambiente onde o Claude
dela carrega skill.** Ali o teste dá "máquina real", você roda o instalador, ele
até funciona — e a skill não aparece para ela. Sucesso reportado, nada
instalado.

Nenhum teste que você rode aqui distingue esse caso com segurança. Então não
teste: entregue o comando.

O comando, literal como o site mostra:

```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

No formato geral:

```bash
npx skills add https://github.com/{owner}/{repo} --skill {nome-da-skill}
```

Não precisa instalar CLI — roda por `npx`. O instalador envia telemetria anônima
por padrão; para desligar, `DISABLE_TELEMETRY=1`.

## Antes de instalar qualquer coisa

Skill de terceiro é código que vai orientar o agente dentro dos projetos da
empresa. Trate como dependência nova, não como atalho:

1. **Leia o `SKILL.md` inteiro.** Se ele manda rodar comando, buscar URL ou
   escrever em caminho fora do projeto, mostre isso à pessoa antes.
2. **Veja quem mantém.** Autor, repositório, atividade recente.
3. **Prefira fonte oficial.** Uma skill da `anthropics/skills` ou do próprio
   fabricante da ferramenta vale mais que uma homônima de autor desconhecido.
4. **Instale uma por vez** e verifique se ela muda o que você queria. Instalar
   cinco de uma vez torna impossível saber qual atrapalhou.

Nunca instale sem a pessoa ver o que a skill afirma.

## Relação com o Veritas

Skill de fora **não entra** no banco da casa por cópia. Se uma se provar útil
para o time, discuta no repositório: ou vira pré-requisito documentado (cada um
instala do original, e recebe atualizações), ou a ideia dela é reescrita como
convenção nossa. Copiar o markdown de terceiro para dentro de `skills/` congela
uma versão e cria uma segunda fonte de verdade.

## Origem

Banco de skills do Veritas, skill `buscar-skills`.
Correções vão por PR no repositório, não editando a cópia local.
