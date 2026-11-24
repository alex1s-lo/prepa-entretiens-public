"""Tests de la banque de questions : format, cohérence, et exactitude des réponses numériques."""
from __future__ import annotations

import sys
import unittest
from fractions import Fraction
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import construire  # noqa: E402
from tests.verifs import VERIFS  # noqa: E402


class TestBanque(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fiches = construire.lire_fiches()
        cls.guides = construire.lire_guides()

    def test_identifiants_uniques(self):
        ids = [f["id"] for f in self.fiches]
        self.assertEqual(len(ids), len(set(ids)), "identifiants en double")

    def test_banque_js_a_jour(self):
        attendu = construire.construire()
        actuel = construire.SORTIE.read_text(encoding="utf-8")
        self.assertEqual(actuel, attendu, "app/banque.js n'est pas à jour : lance « python construire.py »")

    def test_artefact_a_jour(self):
        self.assertEqual(construire.ARTEFACT.read_text(encoding="utf-8"), construire.construire_artefact(),
                         "artefact.html n'est pas à jour : lance « python construire.py »")
        texte = construire.ARTEFACT.read_text(encoding="utf-8")
        self.assertNotIn("<html", texte)
        self.assertNotIn("<body", texte)
        self.assertIn("<title>", texte[:8000])
        self.assertIn("window.PREPA_ARTEFACT = true", texte)

    def test_service_worker_a_jour(self):
        attendu = construire.construire_sw(construire.construire())
        self.assertEqual(construire.SW.read_text(encoding="utf-8"), attendu, "sw.js n'est pas à jour : lance « python construire.py »")
        for f in construire.fichiers_application():
            self.assertTrue((construire.RACINE / f).exists(), f)

    def test_tous_les_themes_sont_representes(self):
        presents = {f["theme"] for f in self.fiches}
        manquants = set(construire.THEMES) - presents
        self.assertFalse(manquants, f"thèmes sans aucune fiche : {sorted(manquants)}")

    def test_chaque_profil_a_assez_de_questions(self):
        for p in construire.PROFILS:
            n = sum(p in f["profils"] for f in self.fiches)
            self.assertGreaterEqual(n, 40, f"profil {p} : seulement {n} fiches")

    def test_chaque_reponse_numerique_est_verifiee(self):
        numeriques = {f["id"] for f in self.fiches if f["type"] == "numerique"}
        sans = sorted(numeriques - set(VERIFS))
        self.assertFalse(sans, f"réponses numériques sans vérification indépendante : {sans}")
        orphelines = sorted(set(VERIFS) - numeriques)
        self.assertFalse(orphelines, f"vérifications sans fiche numérique : {orphelines}")

    def test_reponses_numeriques_exactes(self):
        par_id = {f["id"]: f for f in self.fiches}
        for ident, fonction in sorted(VERIFS.items()):
            with self.subTest(fiche=ident):
                f = par_id.get(ident)
                self.assertIsNotNone(f)
                res = fonction()
                if isinstance(res, tuple):
                    valeur, tol = res
                    tol_abs = tol
                else:
                    valeur, tol_abs = res, 1e-9 * max(1.0, abs(float(res)))
                valeur = float(valeur) if isinstance(valeur, (Fraction, int)) else valeur
                self.assertLessEqual(abs(valeur - f["valeur"]), tol_abs,
                                     f"{ident} : fiche {f['reponse']} = {f['valeur']!r}, vérification {valeur!r}")
                # la tolérance acceptée pour l'utilisateur doit laisser passer la valeur exacte arrondie à 4 chiffres
                if f["valeur"] != 0 and f["tolerance"] > 0:
                    arrondi = float(f"{f['valeur']:.4g}")
                    self.assertLessEqual(abs(arrondi - f["valeur"]), f["tolerance"] * abs(f["valeur"]) + 1e-12,
                                         f"{ident} : tolérance trop stricte pour une réponse à 4 chiffres")

    def test_contenu_lisible(self):
        for f in self.fiches:
            with self.subTest(fiche=f["id"]):
                self.assertGreater(len(f["solution"]), 20)
                self.assertNotIn("\t", f["question"] + f["solution"])
                for r in f.get("relances", []):
                    self.assertTrue(r.strip())

    def test_evaluation_des_expressions(self):
        self.assertAlmostEqual(construire.evaluer("1/6"), 1 / 6)
        self.assertAlmostEqual(construire.evaluer("2^10"), 1024)
        self.assertAlmostEqual(construire.evaluer("sqrt(2/pi)"), (2 / 3.141592653589793) ** 0.5)
        self.assertAlmostEqual(construire.evaluer("comb(5,2)*e"), 10 * 2.718281828459045)
        with self.assertRaises(construire.ErreurContenu):
            construire.evaluer("__import__('os')")
        with self.assertRaises(construire.ErreurContenu):
            construire.evaluer("(1).real")

    def test_readme_a_jour(self):
        from tests import comptes_readme
        local, parent = comptes_readme.textes_attendus()
        self.assertEqual((construire.RACINE / "README.md").read_text(encoding="utf-8"), local,
                         "nombres de fiches du README à mettre à jour : python tests/comptes_readme.py")

    def test_essentiels(self):
        ess = construire.lire_essentiels()
        self.assertGreaterEqual(len(ess), 40)
        self.assertEqual(len(ess), len(set(ess)), "essentiel en double")
        ids = {f["id"] for f in self.fiches}
        self.assertFalse(set(ess) - ids, "essentiels inconnus")

    def test_guides(self):
        self.assertGreaterEqual(len(self.guides), 4)
        for g in self.guides:
            self.assertTrue(g["titre"])
            self.assertGreater(len(g["texte"]), 200)


class TestFormatFiches(unittest.TestCase):
    def ecrire(self, texte):
        import tempfile
        d = Path(tempfile.mkdtemp())
        (d / "a.txt").write_text(texte, encoding="utf-8")
        return d

    def test_fiche_minimale(self):
        d = self.ecrire("=== x-1\ntheme: probas\nprofils: hf\n--- question\nQ ?\n--- solution\nUne solution assez longue.\n")
        f = construire.lire_fiches(d)[0]
        self.assertEqual(f["type"], "ouverte")
        self.assertEqual(f["niveau"], 1)

    def test_erreurs_detectees(self):
        cas = [
            "=== x\ntheme: inconnu\nprofils: hf\n--- question\nQ\n--- solution\nS\n",
            "=== x\ntheme: probas\nprofils: zz\n--- question\nQ\n--- solution\nS\n",
            "=== x\ntheme: probas\nprofils: hf\ntype: numerique\n--- question\nQ\n--- solution\nS\n",
            "=== x\ntheme: probas\nprofils: hf\n--- question\nQ\n--- solution\nS\n--- truc\nT\n",
            "=== X majuscule\ntheme: probas\nprofils: hf\n--- question\nQ\n--- solution\nS\n",
            "=== x\ntheme: probas\nprofils: hf\n--- question\nQ\n",
        ]
        for texte in cas:
            with self.subTest(texte=texte[:40]):
                with self.assertRaises(construire.ErreurContenu):
                    construire.lire_fiches(self.ecrire(texte))


if __name__ == "__main__":
    unittest.main()
