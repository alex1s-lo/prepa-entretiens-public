"""Tests du cours : format des chapitres, liens vers les fiches, exercices numériques vérifiés indépendamment."""
from __future__ import annotations

import sys
import tempfile
import unittest
from fractions import Fraction
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import construire  # noqa: E402
import cours  # noqa: E402
from tests.verifs_cours import VERIFS_COURS  # noqa: E402


class TestCours(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.chapitres = cours.lire_chapitres()

    def test_cours_js_a_jour(self):
        self.assertEqual(construire.COURS_JS.read_text(encoding="utf-8"), construire.construire_cours(),
                         "app/cours.js n'est pas à jour : lance « python construire.py »")

    def test_chapitres_bien_formes(self):
        self.assertGreaterEqual(len(self.chapitres), 2)
        ids = [c["id"] for c in self.chapitres]
        self.assertEqual(len(ids), len(set(ids)))
        for c in self.chapitres:
            with self.subTest(chapitre=c["id"]):
                self.assertGreater(len(c["texte"]), 1500, "chapitre trop court")
                if c["partie"] != "Méthode":
                    self.assertTrue(c["sections"], "chapitre sans sections")

    def test_exercices_numeriques_verifies(self):
        numeriques = {e["id"]: e for c in self.chapitres for e in c["exercices"] if "reponse" in e}
        sans = sorted(set(numeriques) - set(VERIFS_COURS))
        self.assertFalse(sans, f"exercices numériques sans vérification indépendante : {sans}")
        orphelines = sorted(set(VERIFS_COURS) - set(numeriques))
        self.assertFalse(orphelines, f"vérifications sans exercice : {orphelines}")
        for ident, fonction in sorted(VERIFS_COURS.items()):
            with self.subTest(exercice=ident):
                e = numeriques[ident]
                res = fonction()
                if isinstance(res, tuple):
                    valeur, tol = res
                else:
                    valeur, tol = res, 1e-9 * max(1.0, abs(float(res)))
                valeur = float(valeur) if isinstance(valeur, (Fraction, int)) else valeur
                self.assertLessEqual(abs(valeur - e["valeur"]), tol,
                                     f"{ident} : cours {e['reponse']} = {e['valeur']!r}, vérification {valeur!r}")

    def test_chaque_chapitre_technique_a_des_exercices(self):
        for c in self.chapitres:
            if c["partie"] in ("Méthode", "Entretiens"):
                continue
            with self.subTest(chapitre=c["id"]):
                self.assertGreaterEqual(len(c["exercices"]), 3, "moins de 3 exercices")
                self.assertTrue(c["fiches"], "aucune fiche liée")


class TestFormatCours(unittest.TestCase):
    def lire(self, corps, entete="titre: T\npartie: Probabilités\nresume: R"):
        d = Path(tempfile.mkdtemp())
        (d / "01-x.md").write_text(f"---\n{entete}\n---\n{corps}\n", encoding="utf-8")
        return cours.lire_chapitres(d, fiches_connues={"proba-pile-pile"})

    def test_code_python_du_cours_juste(self):
        """Les extraits Python du chapitre de code s'exécutent et donnent les résultats annoncés."""
        import random
        import re
        from collections import Counter
        chap = next(c for c in cours.lire_chapitres() if c["id"] == "code-et-algorithmique")
        env: dict = {}
        for bloc in re.findall(r"```python\n(.*?)```", chap["texte"], re.S):
            exec(bloc, env)  # noqa: S102 (code du cours, écrit dans le dépôt)
        self.assertEqual(env["deux_sommes"]([2, 7, 11, 15], 9), (0, 1))
        self.assertEqual(env["meilleur_gain"]([7, 1, 5, 3, 6, 4, 8, 2]), 7)
        self.assertAlmostEqual(env["drawdown_max"]([100, 120, 90, 130, 80, 110, 140, 100]), 50 / 130)
        self.assertEqual(env["kadane"]([2, -5, 3, 4, -1, 2, -8, 6, 1, -2]), 8)
        self.assertEqual(env["kadane"]([-3, -1, -2]), -1)
        self.assertEqual(env["k_plus_grands"]([5, 1, 9, 3, 7, 9, 2], 3), [9, 9, 7])
        self.assertEqual(env["premier_vrai"](0, 100, lambda x: x * x >= 50), 8)
        self.assertEqual(env["nombre_de_facons"](100, [1, 2, 5, 10, 20, 50]), 4562)
        random.seed(1)
        tirages = Counter()
        for _ in range(30000):
            a = [0, 1, 2]
            env["melanger"](a)
            tirages[tuple(a)] += 1
        self.assertEqual(len(tirages), 6)
        self.assertLess(max(tirages.values()) / min(tirages.values()), 1.12)

    def test_chapitre_valide(self):
        c = self.lire("## S\nTexte $x$ et [[fiche:proba-pile-pile]].\n\n:::exercice e-1\nreponse: 1/2\nÉnoncé\n---\nSolution\n:::\n")[0]
        self.assertEqual(c["sections"], ["S"])
        self.assertAlmostEqual(c["exercices"][0]["valeur"], 0.5)

    def test_erreurs_detectees(self):
        cas = [
            ":::exercice e-1\nÉnoncé sans séparateur\n:::\n",
            ":::inconnu\nx\n:::\n",
            ":::definition\nnon fermé\n",
            "Un $ seul\n",
            "[[fiche:inexistante]]\n",
            ":::widget nimporte\n:::\n",
            ":::exercice e-1\nreponse: 1/2\na\n---\nb\n:::\n:::exercice e-1\nreponse: 1\na\n---\nb\n:::\n",
        ]
        for corps in cas:
            with self.subTest(corps=corps[:30]):
                with self.assertRaises((cours.ErreurCours, construire.ErreurContenu)):
                    self.lire(corps)
        with self.assertRaises(cours.ErreurCours):
            self.lire("x", entete="titre: T\npartie: Inconnue\nresume: R")


if __name__ == "__main__":
    unittest.main()
