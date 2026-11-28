"""Met à jour les nombres de fiches cités dans les README (python tests/comptes_readme.py)."""
from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))
import construire  # noqa: E402


def textes_attendus() -> tuple[str, str]:
    fiches = construire.lire_fiches()
    n = len(fiches)
    num = sum(f["type"] == "numerique" for f in fiches)
    ess = len(construire.lire_essentiels())
    c = Counter(f["theme"] for f in fiches)
    lignes = ["| Thème | Fiches | Thème | Fiches |", "|---|---|---|---|"]
    rangs = sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))
    for i in range(0, len(rangs), 2):
        a = rangs[i]
        b = rangs[i + 1] if i + 1 < len(rangs) else ("", "")
        lignes.append(f"| {construire.THEMES[a[0]]} | {a[1]} | {construire.THEMES.get(b[0], '')} | {b[1]} |")
    s = (RACINE / "README.md").read_text(encoding="utf-8")
    s = re.sub(r"\| \*\*Révisions\*\* \| \d+ questions", f"| **Révisions** | {n} questions", s)
    qcm = construire.lire_qcm()
    cours = sum(q["cible"].startswith("cours:") for q in qcm)
    enigmes = [f for f in fiches if f.get("categorie")]
    variantes = sum(1 for f in enigmes if f.get("parent"))
    s = re.sub(r"\| \*\*QCM\*\* \| \d+ questions à choix multiples \(dont \d+ sur le cours\)",
               f"| **QCM** | {len(qcm)} questions à choix multiples (dont {cours} sur le cours)", s)
    s = re.sub(r": \d+ énigmes, dont \d+ variantes\.", f": {len(enigmes)} énigmes, dont {variantes} variantes.", s)
    s = re.sub(r"range les \d+ fiches", f"range les {n} fiches", s)
    s = re.sub(r"Les \d+ questions à réponse chiffrée", f"Les {num} questions à réponse chiffrée", s)
    s = re.sub(r"\*\*Les essentiels\*\* \(`contenu/essentiels.lst`\) : \d+ questions",
               f"**Les essentiels** (`contenu/essentiels.lst`) : {ess} questions", s)
    s = re.sub(r"\| Thème \| Fiches \| Thème \| Fiches \|\n\|---\|---\|---\|---\|\n(?:\|.*\|\n)+", "\n".join(lignes) + "\n", s)
    return s, None


def main() -> None:
    s, _ = textes_attendus()
    (RACINE / "README.md").write_text(s, encoding="utf-8")
    print("README à jour.")


if __name__ == "__main__":
    main()
