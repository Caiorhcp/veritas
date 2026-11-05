# Auditoria de skill contra a doc oficial

Parte da `docs-oficiais`. Dois usos: **conferir** uma skill do Veritas que já
existe, ou **pesquisar** para uma skill nova. O passo 1 da `SKILL.md` (testar a
capacidade) vale aqui também. Sem Firecrawl, a auditoria não acontece: diga
isso e pare. Uma auditoria feita de memória só reproduz o que a skill já diz.

## Conferir uma skill existente

### 1. Separe fato de decisão

Leia o `SKILL.md` da skill e todos os arquivos de apoio. Monte duas listas:

- **Fatos da lib**: tudo o que a doc pode confirmar ou desmentir. Nome de
  função, hook, decorator ou opção; comando de CLI; chave de config; caminho
  que o framework exige (`src/app/`, `app.module.ts`); versão mínima;
  comportamento padrão.
- **Decisões da casa**: proibições, camadas, escolha entre libs, nomes de
  pasta nossos. Não se audita decisão contra doc. Só uma coisa se confere
  nela: se ainda é **possível** na versão atual (ex.: a lib obrigatória não foi
  descontinuada).

A lista de fatos é o escopo. **A auditoria termina quando cada fato da lista
tem um estado e uma URL.**

### 2. Confira o metadata

- `metadata.upstream.url` responde e bate com a linha da lib em `fontes.md`.
  Divergência entre os dois entra no relatório.
- `versao_verificada` contra a última versão publicada. Consulte de graça,
  antes de gastar crédito:

  ```bash
  npm view <pacote> version        # registry: npm
  pip index versions <pacote>      # registry: pypi
  ```

  Se o comando não existir no shell, use a página de releases do repositório.

### 3. Orce antes de raspar

Conte os fatos. Estimativa: cerca de 2 créditos por fato (um `map` compartilhado
por site, um `scrape` por página). Se passar de 10 créditos, diga o número e
espere o sim. Fatos que caem na mesma página saem pelo preço de uma.

### 4. Classifique cada fato

Para cada fato, ache a página (passos 3 e 4 da `SKILL.md`) na **última versão
publicada** e marque:

| Estado | Quando |
|---|---|
| `confirmado` | a doc atual diz o mesmo |
| `desatualizado` | a doc atual diz outra coisa; anote o quê |
| `removido` | a doc marca como removido ou depreciado |
| `não encontrado` | três páginas depois, nada; não conta como erro da skill |

### 5. Relatório

Um bloco, uma vez:

```
AUDITORIA — veritas:<skill>

  Verificada contra   <lib> <versão publicada>   (skill dizia <versao_verificada>)
  Fatos conferidos    <n>   · confirmados <n> · desatualizados <n> · removidos <n> · não encontrados <n>
  Créditos gastos     <n>

  Desatualizados
    · <arquivo>:<trecho curto> — a doc diz <Y>. <url>

  Removidos
    · <arquivo>:<trecho curto> — <o que substitui>. <url>

  Decisões da casa afetadas
    · <regra> — <por que deixou de ser possível>. <url>

  Proposta
    <diff do texto, pronto para PR>
```

Suba `versao_verificada` na proposta **só** se todos os fatos ficaram
`confirmado` ou `não encontrado`. Com qualquer `desatualizado` pendente, a
versão verificada continua a antiga, que é a verdade.

### 6. Entrega

Não edite a cópia instalada: ela é sobrescrita na próxima atualização. Entregue
a proposta e siga o fluxo de PR de `/veritas:ajuda` → "Enviar uma skill".
Mudança em decisão da casa não vai direto na proposta: apresente o problema e
deixe a decisão para quem cuida do banco.

## Pesquisar para uma skill nova

A skill nova nasce de duas fontes, e o trabalho aqui é manter as duas
separadas.

1. **Levante os fatos** da stack na doc oficial: estrutura de projeto que o
   framework exige, comandos, APIs centrais, versão atual, o que foi depreciado
   nas duas últimas majors. Cada fato com a URL.
2. **Liste as decisões em aberto**: toda escolha que a doc deixa livre (qual
   ORM, onde fica a lógica de negócio, como validar). Não preencha. Convenção
   inventada pelo agente não é convenção da casa.
3. **Entregue as duas listas** para a pessoa decidir a segunda, e siga
   `/veritas:ajuda` → "Enviar uma skill" com as decisões dela.

A lib nova entra em `fontes.md` no mesmo PR.
