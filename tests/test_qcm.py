"""Tests du QCM : format, couverture de toutes les fiches, fichier généré à jour, variantes reliées."""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import construire  # noqa: E402


class TestQCM(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fiches = construire.lire_fiches()
        cls.qcm = construire.lire_qcm(fiches=cls.fiches)

    def test_chaque_fiche_a_son_qcm(self):
        couvertes = {q["cible"] for q in self.qcm}
        manquantes = sorted(f["id"] for f in self.fiches if f["id"] not in couvertes)
        self.assertEqual(manquantes, [], "fiches sans QCM")

    def test_chaque_chapitre_du_cours_a_ses_questions(self):
        import cours
        for c in cours.lire_chapitres():
            n = sum(1 for q in self.qcm if q["cible"] == "cours:" + c["id"])
            with self.subTest(chapitre=c["id"]):
                self.assertGreaterEqual(n, 1 if c["id"] == "mode-emploi" else 3)

    def test_une_bonne_reponse_et_des_explications(self):
        for q in self.qcm:
            with self.subTest(question=q["id"]):
                self.assertEqual(sum(c["ok"] for c in q["choix"]), 1)
                self.assertGreaterEqual(len(q["choix"]), 3)
                for c in q["choix"]:
                    self.assertTrue(c["pourquoi"].strip())
                    self.assertNotIn("Sans fondement", c["pourquoi"], "explication à rédiger vraiment")

    def test_identifiants_uniques(self):
        ids = [q["id"] for q in self.qcm]
        self.assertEqual(len(ids), len(set(ids)))

    def test_qcm_js_a_jour(self):
        self.assertEqual(construire.QCM_JS.read_text(encoding="utf-8"), construire.construire_qcm(),
                         "app/qcm.js n'est pas à jour : lance « python construire.py »")

    def test_format_refuse_les_erreurs(self):
        mauvais = {
            "deux bonnes": "=== proba-monty-hall\n+ a\n  x\n+ b\n  y\n- c\n  z\n",
            "sans explication": "=== proba-monty-hall\n+ a\n- b\n  y\n- c\n  z\n",
            "fiche inconnue": "=== n-existe-pas\n+ a\n  x\n- b\n  y\n- c\n  z\n",
            "cours sans énoncé": "=== cours:black-scholes\n+ a\n  x\n- b\n  y\n- c\n  z\n",
        }
        for nom, texte in mauvais.items():
            with self.subTest(cas=nom), tempfile.TemporaryDirectory() as d:
                (Path(d) / "x.txt").write_text(texte, encoding="utf-8")
                with self.assertRaises(construire.ErreurContenu):
                    construire.lire_qcm(Path(d), fiches=self.fiches)

    def test_variantes_reliees(self):
        par_id = {f["id"]: f for f in self.fiches}
        variantes = [f for f in self.fiches if f.get("parent")]
        self.assertGreaterEqual(len(variantes), 100)
        for f in variantes:
            with self.subTest(fiche=f["id"]):
                p = par_id[f["parent"]]
                self.assertNotIn("parent", p, "une variante dépend d'un problème d'origine")
                self.assertEqual(f.get("categorie"), p.get("categorie"))


if __name__ == "__main__":
    unittest.main()
