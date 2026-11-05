"""Mede se cada skill muda a resposta do agente.

Para cada skill, faz a mesma pergunta duas vezes:

    A — sessao normal, com as skills instaladas disponiveis
    B — `--bare`, que desliga skills, plugins e CLAUDE.md  (grupo de controle)

Depois conta quantos termos caracteristicos da skill (o que esta em `crase` ou
**negrito** dentro do SKILL.md) aparecem em cada resposta. Se A nao supera B, a
skill nao esta mudando nada — ou nao disparou, ou nao tinha o que acrescentar.
Nos dois casos e problema.

Nao existe campo documentado no output do Claude Code dizendo qual skill
carregou. Medir efeito e melhor do que medir carregamento de qualquer forma:
skill que carrega e nao muda a resposta nao serve.

Uso:
    uv run python tools/medir_trigger.py
    uv run python tools/medir_trigger.py django          # so uma
"""

import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SKILLS = RAIZ / "skills"
PROMPTS = RAIZ / "docs" / "trigger-prompts.json"
SAIDA = RAIZ / "docs" / "trigger-baseline.md"

# Termos curtos demais viram ruido ("db", "id"); termos genericos tambem.
TAMANHO_MINIMO = 4
RUIDO = {"skill", "true", "false", "null", "none", "http", "https", "json"}


def termos_caracteristicos(skill: str) -> list[str]:
    """Extrai de `crase` e **negrito** do SKILL.md o vocabulario proprio da casa."""
    texto = (SKILLS / skill / "SKILL.md").read_text(encoding="utf-8")
    corpo = texto.split("---\n", 2)[2] if texto.count("---\n") >= 2 else texto

    # "Origem" e "Recursos adicionais" falam da migracao e dos arquivos de
    # apoio, nao da convencao. Contar `nextjs.py` ou `scaffold` como acerto
    # inflaria o placar com vocabulario que a resposta nunca deveria usar.
    corpo = re.split(r"\n##+ *(?:Origem|Recursos adicionais|Onde consultar)\b", corpo)[0]

    achados = re.findall(r"`([^`\n]+)`", corpo) + re.findall(r"\*\*([^*\n]+)\*\*", corpo)

    termos = set()
    for bruto in achados:
        for pedaco in re.split(r"[\s,;/()]+", bruto.strip().lower()):
            pedaco = pedaco.strip(".:'\"`*[]")
            if len(pedaco) >= TAMANHO_MINIMO and pedaco not in RUIDO:
                termos.add(pedaco)
    return sorted(termos)


def perguntar(prompt: str, com_skills: bool) -> str:
    cmd = ["claude", "-p", prompt, "--permission-mode", "dontAsk"]
    if not com_skills:
        cmd.append("--bare")
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    except FileNotFoundError:
        sys.exit("comando `claude` nao encontrado no PATH")
    except subprocess.TimeoutExpired:
        return "(timeout)"
    return (r.stdout or r.stderr).strip()


def contar(resposta: str, termos: list[str], prompt: str) -> list[str]:
    """Termos presentes na resposta e ausentes no prompt (senao o prompt entregou)."""
    alvo = resposta.lower()
    entregue = prompt.lower()
    return [t for t in termos if t in alvo and t not in entregue]


def medir(skill: str, prompt: str) -> dict:
    termos = termos_caracteristicos(skill)
    com = perguntar(prompt, com_skills=True)
    sem = perguntar(prompt, com_skills=False)
    achados_com = contar(com, termos, prompt)
    achados_sem = contar(sem, termos, prompt)
    return {
        "skill": skill,
        "prompt": prompt,
        "total_termos": len(termos),
        "com": achados_com,
        "sem": achados_sem,
        "ganho": len(achados_com) - len(achados_sem),
        "resposta_com": com,
        "resposta_sem": sem,
    }


def escrever(resultados: list[dict]) -> None:
    linhas = [
        f"# Linha de base de trigger — {date.today().isoformat()}",
        "",
        "Cada prompt roda duas vezes: com as skills disponiveis e com `--bare`",
        "(skills desligadas, grupo de controle). A contagem e de termos",
        "caracteristicos da skill que aparecem na resposta e nao estavam no prompt.",
        "",
        "| Skill | com skills | sem (controle) | ganho | veredito |",
        "|---|---|---|---|---|",
    ]
    for r in resultados:
        veredito = "ok" if r["ganho"] > 0 else "**nao mudou nada**"
        linhas.append(
            f"| {r['skill']} | {len(r['com'])}/{r['total_termos']} | "
            f"{len(r['sem'])}/{r['total_termos']} | {r['ganho']:+d} | {veredito} |"
        )

    linhas += ["", "---", ""]
    for r in resultados:
        linhas += [
            f"## {r['skill']}",
            "",
            f"**Prompt:** {r['prompt']}",
            "",
            f"**Termos que so apareceram com a skill:** "
            f"{', '.join(sorted(set(r['com']) - set(r['sem']))) or '(nenhum)'}",
            "",
            "<details><summary>resposta com skills</summary>",
            "",
            "```",
            r["resposta_com"][:4000],
            "```",
            "",
            "</details>",
            "",
            "<details><summary>resposta sem skills (controle)</summary>",
            "",
            "```",
            r["resposta_sem"][:4000],
            "```",
            "",
            "</details>",
            "",
        ]

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text("\n".join(linhas), encoding="utf-8")


def main() -> int:
    prompts = {
        k: v for k, v in json.loads(PROMPTS.read_text(encoding="utf-8")).items()
        if not k.startswith("_")
    }
    if len(sys.argv) > 1:
        prompts = {k: v for k, v in prompts.items() if k in sys.argv[1:]}
        if not prompts:
            sys.exit(f"nenhuma skill casou com {sys.argv[1:]}")

    resultados = []
    for i, (skill, prompt) in enumerate(prompts.items(), 1):
        if not (SKILLS / skill / "SKILL.md").exists():
            print(f"[{i}/{len(prompts)}] {skill}: SKILL.md nao existe, pulando")
            continue
        print(f"[{i}/{len(prompts)}] {skill}: duas chamadas...", flush=True)
        r = medir(skill, prompt)
        print(f"          com={len(r['com'])} sem={len(r['sem'])} ganho={r['ganho']:+d}")
        resultados.append(r)

    if not resultados:
        return 1

    escrever(resultados)
    ruins = [r["skill"] for r in resultados if r["ganho"] <= 0]
    print(f"\nrelatorio: {SAIDA}")
    if ruins:
        print(f"sem efeito medido: {', '.join(ruins)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
