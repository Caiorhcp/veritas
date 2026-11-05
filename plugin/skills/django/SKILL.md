---
name: django
description: Convenções, camadas e proibições do Veritas para projetos Django e Django REST Framework. Use ao criar, revisar ou alterar views, serializers, services, models, migrations ou autenticação em qualquer projeto Django ou DRF da casa.
metadata:
  escopo: backend
  stacks: [django, drf]
  upstream:
    - url: https://docs.djangoproject.com/en/stable/topics/http/views/
      pacote: django
      registry: pypi
  versao_verificada: "5.2"
---

# Django / DRF — convenções da casa

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

## Filosofia

A lógica de negócios deve ser isolada e testável fora de qualquer camada de
transporte (HTTP, Celery). O framework Django é uma ferramenta a ser alavancada,
nunca o dono do domínio.

## Tecnologias

- **API**: Django REST Framework (DRF)
- **Banco**: ORM nativo e migrations do Django
- **Autenticação**: SimpleJWT para DRF
- **Pacotes**: ambiente gerenciado com `uv`

## Camadas

`Request → View → Serializer → Service → Model`

- **View**: orquestração HTTP. Autentica, chama serializer e service, molda a
  resposta. Não decide nada.
- **Serializer**: valida formato e shape. Nunca faz query a outra tabela, nunca
  dispara efeito colateral.
- **Service**: lógica de negócio. Validação que depende do estado do sistema,
  transações, efeitos colaterais. Sempre funções.
- **Model**: acesso a dados.

A camada de `services/` nunca importa nada de `api/`.

## Proibições (violação = erro)

- **Lógica de negócio em `views.py` ou `serializers.py`** — delegue ao service.
- **Validador de serializer consultando o banco** — se depende de estado, é
  service.
- **`@transaction.atomic` em view** — efeito colateral vai em
  `transaction.on_commit()`.
- **Exceção do DRF levantada direto do service** — crie exceção de domínio e
  traduza num handler central.
- **`User` default sem `AUTH_USER_MODEL` customizado** — e, para JWT, nada de
  lógica complexa direto na view do simplejwt.
- **Lógica em `save_model()` do admin** — o admin também delega ao service.

## Recursos adicionais

- Estrutura de pastas e configuração: [architecture.md](architecture.md)
- Front em templates (componentes, forms no template, HTMX, Alpine): skill
  `veritas:django-templates`

## Origem

Portada do `scaffold/stacks/django.py` do Veritas v1, onde vivia como string
dentro do Python. Aqui é dado: o time edita por PR e adicionar uma stack não
exige deploy.
