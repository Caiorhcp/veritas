"""Coisas que eram conferidas à mão e já saíram erradas uma vez."""

import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SKILLS = RAIZ / "skills"
LIMITE_SKILL_MD = 20_000  # README, "Política de token": 20 KB no SKILL.md está errado

LINHA_DE_TABELA = re.compile(r"^\| `([a-z0-9-]+)` \|", re.MULTILINE)
LINK_RELATIVO = re.compile(r"\]\((?!https?://|#|mailto:)([^)#\s]+)")


def skills_no_disco() -> set[str]:
    return {p.parent.name for p in SKILLS.glob("*/SKILL.md")}


def skills_na_secao(arquivo: Path, inicio: str, fim: str) -> set[str]:
    texto = arquivo.read_text(encoding="utf-8")
    secao = texto.split(inicio, 1)[1].split(fim, 1)[0]
    return set(LINHA_DE_TABELA.findall(secao))


def test_readme_lista_todas_as_skills():
    tabela = skills_na_secao(RAIZ / "README.md", "### As skills", "\n### ")
    assert tabela == skills_no_disco(), (
        f"faltam no README: {sorted(skills_no_disco() - tabela)}; "
        f"sobram: {sorted(tabela - skills_no_disco())}"
    )


def test_ajuda_lista_todas_as_skills():
    tabela = skills_na_secao(SKILLS / "ajuda" / "SKILL.md", "## O que tenho", "\n---")
    assert tabela == skills_no_disco(), (
        f"faltam na ajuda: {sorted(skills_no_disco() - tabela)}; "
        f"sobram: {sorted(tabela - skills_no_disco())}"
    )


def skills_automaticas() -> set[str]:
    return {
        p.parent.name
        for p in SKILLS.glob("*/SKILL.md")
        if "disable-model-invocation: true" not in p.read_text(encoding="utf-8").split("---")[1]
    }


def test_como_usar_lista_as_skills_automaticas():
    tabela = skills_na_secao(RAIZ / "docs" / "COMO-USAR.md", "### Quando cada skill entra", "\n### ")
    assert tabela == skills_automaticas(), (
        f"faltam no COMO-USAR: {sorted(skills_automaticas() - tabela)}; "
        f"sobram: {sorted(tabela - skills_automaticas())}"
    )


def skills_de_stack() -> list[Path]:
    stack = []
    for p in SKILLS.glob("*/SKILL.md"):
        escopo = re.search(r"^\s+escopo:\s*(\S+)", p.read_text(encoding="utf-8"), re.MULTILINE)
        if escopo and escopo.group(1) in {"backend", "frontend", "mobile"} or p.parent.name == "python":
            stack.append(p)
    return stack


def test_skills_de_stack_apontam_para_projeto_existente():
    # Convenção de stack vale para código novo; em sistema legado quem manda é a
    # arquitetura dele. Skill de stack sem o ponteiro faria o agente "corrigir"
    # um sistema que não é para mudar.
    sem = [p.parent.name for p in skills_de_stack()
           if "veritas:projeto-existente" not in p.read_text(encoding="utf-8")]
    assert not sem, sem


def test_skills_de_stack_apontam_para_lgpd():
    # A lgpd dispara pela descrição, e numa tarefa em que o dado pessoal está
    # implícito ("ajusta o log do checkout") ela pode não entrar. O ponteiro na
    # skill de stack, que entra sempre, é a segunda chance.
    sem = [p.parent.name for p in skills_de_stack()
           if "veritas:lgpd" not in p.read_text(encoding="utf-8")]
    assert not sem, sem


def test_links_entre_arquivos_das_skills_existem():
    quebrados = []
    for md in SKILLS.rglob("*.md"):
        for alvo in LINK_RELATIVO.findall(md.read_text(encoding="utf-8")):
            if not (md.parent / alvo).exists():
                quebrados.append(f"{md.relative_to(RAIZ)} -> {alvo}")
    assert not quebrados, quebrados


def test_skill_md_dentro_do_limite():
    grandes = [
        f"{p.parent.name}: {p.stat().st_size} bytes"
        for p in SKILLS.glob("*/SKILL.md")
        if p.stat().st_size >= LIMITE_SKILL_MD
    ]
    assert not grandes, grandes
