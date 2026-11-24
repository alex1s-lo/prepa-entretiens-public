"""Tests de l'application web : modules JavaScript (Node), parcours complet dans Chromium (Playwright), fichiers."""
from __future__ import annotations

import re
import shutil
import subprocess
import unittest
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
NODE = shutil.which("node")


@unittest.skipUnless(NODE, "Node.js absent")
class TestJavaScript(unittest.TestCase):
    def test_modules(self):
        r = subprocess.run([NODE, "--test", str(RACINE / "tests" / "js" / "modules.test.js"), str(RACINE / "tests" / "js" / "maths.test.js")],
                           capture_output=True, text=True, timeout=300)
        self.assertEqual(r.returncode, 0, r.stdout[-4000:] + r.stderr[-2000:])

    def test_syntaxe_de_tous_les_scripts(self):
        for js in sorted((RACINE / "app").rglob("*.js")):
            with self.subTest(fichier=js.name):
                r = subprocess.run([NODE, "--check", str(js)], capture_output=True, text=True, timeout=60)
                self.assertEqual(r.returncode, 0, r.stderr)

    def test_parcours_navigateur(self):
        r = subprocess.run([NODE, str(RACINE / "tests" / "navigateur.js")], capture_output=True, text=True,
                           timeout=600, cwd=RACINE)
        if "SAUTE" in r.stdout:
            self.skipTest("Playwright absent")
        self.assertEqual(r.returncode, 0, r.stdout[-4000:] + r.stderr[-4000:])
        self.assertIn("OK", r.stdout)


class TestFichiers(unittest.TestCase):
    def test_scripts_references_existent(self):
        html = (RACINE / "index.html").read_text(encoding="utf-8")
        for src in re.findall(r'(?:src|href)="(app/[^"]+)"', html):
            self.assertTrue((RACINE / src).exists(), src)
        vues = {p.name for p in (RACINE / "app" / "vues").glob("*.js")}
        charges = set(re.findall(r'src="app/vues/([^"]+)"', html))
        self.assertEqual(vues, charges, "chaque vue doit être chargée par index.html")

    def test_hors_ligne(self):
        """L'application ne charge rien depuis Internet : elle marche hors connexion et ne divulgue rien."""
        # KaTeX (app/vendor) est une bibliothèque tierce embarquée : son analyseur a une méthode « fetch() » sans réseau
        fichiers = [p for p in sorted((RACINE / "app").rglob("*.js")) if "vendor" not in p.parts]
        for f in [RACINE / "index.html", *fichiers, RACINE / "app" / "style.css"]:
            texte = f.read_text(encoding="utf-8")
            with self.subTest(fichier=f.name):
                self.assertNotRegex(texte, r'(src|href)\s*=\s*["\']https?://', "ressource externe")
                self.assertNotIn("fetch(", texte)
                self.assertNotIn("XMLHttpRequest", texte)
                self.assertNotRegex(texte, r"@import\s+url\(\s*['\"]?https?://")

    def test_manifeste_et_cache(self):
        import json
        m = json.loads((RACINE / "manifest.webmanifest").read_text(encoding="utf-8"))
        for icone in m["icons"]:
            self.assertTrue((RACINE / icone["src"]).exists(), icone["src"])
        sw = (RACINE / "sw.js").read_text(encoding="utf-8")
        html = (RACINE / "index.html").read_text(encoding="utf-8")
        for src in re.findall(r'(?:src|href)="(app/[^"]+)"', html):
            self.assertIn("'./" + src + "'", sw, "fichier absent du cache hors ligne : " + src)

    def test_katex_embarque(self):
        k = RACINE / "app" / "vendor" / "katex"
        self.assertTrue((k / "katex.min.js").exists() and (k / "LICENSE").exists())
        css = (k / "katex.min.css").read_text(encoding="utf-8")
        for url in re.findall(r"url\(([^)]+)\)", css):
            self.assertTrue((k / url).exists(), url)
            self.assertFalse(url.startswith("http"), url)

    def test_bat_crlf_ascii(self):
        for bat in RACINE.glob("*.bat"):
            with self.subTest(fichier=bat.name):
                brut = bat.read_bytes()
                brut.decode("ascii")
                self.assertNotIn(b"\n", brut.replace(b"\r\n", b""), "fins de ligne CRLF attendues")


if __name__ == "__main__":
    unittest.main()
