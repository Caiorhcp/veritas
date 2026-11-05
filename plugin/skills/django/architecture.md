# Django — estrutura e configuração

Detalhamento das camadas descritas no `SKILL.md`. Carrega sob demanda.

## Estrutura de pastas

Use `apps/` como pasta guarda-chuva para separar domínio de infraestrutura.

```
apps/
  <dominio>/
    services/      # lógica de negócio isolada, sempre em funções
    api/
      views.py
      urls.py
      serializers/
```

**A regra que não se quebra:** `services/` nunca importa nada de `api/`. A
dependência aponta sempre de fora para dentro — o transporte conhece o domínio,
o domínio não conhece o transporte.

## Configurações

Centralizadas e tipadas, via `django-environ` ou `pydantic-settings`. Nada de
`os.environ` solto espalhado pelo código.

## Onde cada coisa acontece

| Preciso... | Vai em |
|---|---|
| Autenticar e autorizar a requisição | View |
| Validar o formato do payload | Serializer |
| Validar contra o estado do sistema | Service |
| Abrir transação | Service |
| Disparar email, webhook, fila | `transaction.on_commit()` dentro do service |
| Consultar ou gravar | Model / QuerySet, chamado pelo service |
