# Casos das regras de skills/lgpd/lgpd.semgrep.yml, no formato do `semgrep --test`.
# `ruleid:` marca a linha seguinte que a regra TEM de pegar; `ok:`, a que não pode.
# Roda no CI (validate.yml). Não é importado por nada.
import logging
from datetime import datetime
from decimal import Decimal
logger = logging.getLogger(__name__)

def ruim(request, cliente, cpf):
    # ruleid: lgpd-dado-pessoal-em-log-python
    logger.info("cadastro %s", cpf)
    # ruleid: lgpd-dado-pessoal-em-log-python
    logger.info(f"cliente {cliente.email}")
    # ruleid: lgpd-request-inteiro-em-log-python
    print(request.data)
    # ruleid: lgpd-request-inteiro-em-log-python
    logger.warning("payload %s", request.POST)
    # ruleid: lgpd-dado-pessoal-em-log-python
    print("tel", cliente.telefone)
    # ruleid: lgpd-dado-pessoal-na-url
    return f"/api/clientes/?cpf={cpf}"

def bom(request, cliente, ExamForm):
    # ok: lgpd-dado-pessoal-em-log-python
    logger.info("cadastro cliente_id=%s", cliente.id)
    # ok: lgpd-dado-pessoal-em-log-python
    logger.info("tem email? %s", bool(cliente.email_verificado))
    # ok: lgpd-request-inteiro-em-log-python
    value = Decimal(request.POST["value"])
    # ok: lgpd-request-inteiro-em-log-python
    data = datetime.strptime(request.data["nascimento"], "%d/%m/%Y")
    # ok: lgpd-request-inteiro-em-log-python
    form = ExamForm(request.POST, instance=None)
    return value, data, form

class SerializerRuim:
    class Meta:
        model = object
        # ruleid: lgpd-serializer-todos-os-campos
        fields = "__all__"

class SerializerBom:
    class Meta:
        model = object
        # ok: lgpd-serializer-todos-os-campos
        fields = ["id", "nome"]
