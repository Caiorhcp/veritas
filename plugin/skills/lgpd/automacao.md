# Checagem automática de LGPD no CI

Parte da `lgpd`. Duas travas que reprovam o PR sem depender de alguém lembrar
da regra:

- **gitleaks:** senha, chave de API ou token commitado.
- **Semgrep, regras da casa** ([`lgpd.semgrep.yml`](lgpd.semgrep.yml)):
  - dado pessoal em log ou `print` (Python e JS/TS);
  - corpo inteiro da requisição em log;
  - dado pessoal em query string;
  - serializer ou form com `fields = "__all__"` (aviso, não erro).

**Em modo conservar** (`veritas:projeto-existente`), isso é ferramenta nova
no projeto: pergunte antes de acrescentar. As duas só olham o que o PR
muda, então um legado com problemas antigos não fica reprovado para sempre.
Os problemas antigos vão para "Observado, fora do escopo".

## Instalar num projeto

1. Copie `lgpd.semgrep.yml` desta skill para `.semgrep/lgpd.yml` na raiz do
   projeto.
2. Crie `.github/workflows/lgpd.yml`:

```yaml
name: lgpd

on:
  pull_request:

jobs:
  segredos:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      # Só os commits do PR: segredo antigo no histórico se trata à parte
      # (revogar e gerar outro), não reprovando todo PR novo.
      - name: gitleaks
        run: |
          curl -sSfL https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz | tar -xz gitleaks
          ./gitleaks git . --redact --verbose --log-opts="origin/${{ github.base_ref }}..HEAD"

  dado-pessoal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: pip install semgrep
      # --baseline-commit: só reprova o que este PR introduziu.
      - run: semgrep scan --config .semgrep/lgpd.yml --baseline-commit "origin/${{ github.base_ref }}" --error --metrics=off
```

3. Na proteção da branch principal, marque os dois checks (`segredos` e
   `dado-pessoal`) como obrigatórios.

`--redact` tira o segredo da saída do CI: o log do job é visível para quem
tem acesso ao repositório.

## Quando reprovar

**gitleaks achou um segredo:** tirar do commit não basta, porque o histórico
guarda. Revogue a credencial, gere outra, e só então reescreva o commit. Falso
positivo (valor de exemplo) se marca com `# gitleaks:allow` na linha.

**Semgrep achou dado pessoal em log:** troque pelo identificador interno.
Falso positivo se marca com `# nosemgrep: <id-da-regra>` na linha, com um
comentário dizendo por quê. Quem revisa o PR confere a justificativa.

## O que ainda não foi conferido

- O job do gitleaks acima ainda não rodou num PR de verdade. Confira no
  primeiro projeto piloto se ele acha o repositório e a branch base.
- O gitleaks está em modo só de correções de segurança; o autor passou a
  manter o Betterleaks. Vale reavaliar na auditoria mensal.
- As regras Semgrep procuram por **nome** de variável (`cpf`, `email`,
  `telefone`...). Dado pessoal numa variável de nome genérico
  (`valor`, `dados`) passa. Elas pegam o erro comum, não substituem a revisão.
