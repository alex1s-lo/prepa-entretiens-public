"""Construit app/banque.js à partir des fiches de contenu/ (questions) et contenu/guides/ (guides).

Usage : python construire.py        (réécrit app/banque.js)
        python construire.py --verifier  (échoue si app/banque.js n'est pas à jour)

Format d'une fiche (fichiers contenu/*.txt) :

    === identifiant-unique
    theme: probas
    niveau: 2
    profils: hf mm banque
    type: numerique          (ou : ouverte)
    reponse: 1/6             (type numerique : expression exacte)
    tolerance: 0.005         (facultatif, relative)
    --- question
    Texte en Markdown simple.
    --- en
    English wording of the question (facultatif).
    --- indice
    --- solution
    --- piege
    --- relances
    - une relance par ligne

Bibliothèque standard uniquement.
"""
from __future__ import annotations

import ast
import json
import math
import operator
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent
CONTENU = RACINE / "contenu"
GUIDES = CONTENU / "guides"
SORTIE = RACINE / "app" / "banque.js"

THEMES = {
    "probas": "Probabilités",
    "stats": "Statistiques et économétrie",
    "stoch": "Calcul stochastique",
    "derives": "Produits dérivés et pricing",
    "taux": "Taux, crédit et XVA",
    "marches": "Marchés et trading",
    "ml": "Machine learning",
    "algo": "Code et algorithmique",
    "casse-tete": "Casse-têtes",
    "constantes": "Chiffres à connaître",
    "projets": "Projets types",
    "fit": "Motivation et parcours",
}
PROFILS = {
    "hf": "Hedge fund (recherche quant)",
    "mm": "Teneur de marché / trading prop",
    "banque": "Banque : quant pricing / strats",
    "risque": "Risque, validation, XVA",
    "data": "Data science / ML",
}
# Familles de la section « Casse-têtes » : toute fiche qui porte « categorie: » y figure, quel que soit son thème.
CATEGORIES = {
    "logique": "Logique et déduction",
    "pesees": "Pesées, mesures et transvasements",
    "strategie": "Jeux et stratégie",
    "probas": "Probabilités et espérance",
    "denombrement": "Dénombrement",
    "nombres": "Nombres et chiffres",
    "invariants": "Invariants, parité et coloriage",
    "recherche": "Recherche optimale et algorithmes",
    "geometrie": "Géométrie et espace",
    "mouvement": "Vitesses, horloges et calendriers",
    "fermi": "Estimations (Fermi)",
}
TYPES = {"ouverte", "numerique"}
SECTIONS = {"question", "en", "indice", "solution", "piege", "relances", "variantes"}
CLES = {"theme", "niveau", "profils", "type", "reponse", "tolerance", "duree", "source", "categorie", "titre"}

_OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv,
        ast.Pow: operator.pow, ast.USub: operator.neg, ast.UAdd: operator.pos}
_FONCTIONS = {"sqrt": math.sqrt, "exp": math.exp, "ln": math.log, "log": math.log, "log2": math.log2,
              "log10": math.log10, "comb": math.comb, "factorial": math.factorial, "atan": math.atan,
              "asin": math.asin, "acos": math.acos, "sin": math.sin, "cos": math.cos, "erf": math.erf,
              "N": lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2))),
              "phi": lambda x: math.exp(-x * x / 2) / math.sqrt(2 * math.pi)}
_CONSTANTES = {"pi": math.pi, "e": math.e}


class ErreurContenu(ValueError):
    pass


def evaluer(expr: str) -> float:
    """Évalue une expression numérique sûre (nombres, + - * / **, ^, fonctions usuelles, pi, e)."""
    def ev(n):
        if isinstance(n, ast.Expression):
            return ev(n.body)
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
            return n.value
        if isinstance(n, ast.BinOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.left), ev(n.right))
        if isinstance(n, ast.UnaryOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.operand))
        if isinstance(n, ast.Name) and n.id in _CONSTANTES:
            return _CONSTANTES[n.id]
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in _FONCTIONS and not n.keywords:
            return _FONCTIONS[n.func.id](*[ev(a) for a in n.args])
        raise ErreurContenu(f"expression non autorisée : {expr!r}")
    return float(ev(ast.parse(expr.replace("^", "**"), mode="eval")))


def lire_fiches(dossier: Path = CONTENU) -> list[dict]:
    fiches: list[dict] = []
    for chemin in sorted(dossier.glob("*.txt")):
        fiches.extend(_lire_fichier(chemin))
    return fiches


def _lire_fichier(chemin: Path) -> list[dict]:
    fiches: list[dict] = []
    courante: dict | None = None
    section: str | None = None
    for num, ligne in enumerate(chemin.read_text(encoding="utf-8").splitlines(), 1):
        ou = f"{chemin.name}:{num}"
        if ligne.startswith("=== "):
            courante = {"id": ligne[4:].strip(), "_ou": ou, "_sections": {}}
            fiches.append(courante)
            section = None
            continue
        if courante is None:
            if ligne.strip() and not ligne.startswith("#"):
                raise ErreurContenu(f"{ou} : texte hors fiche")
            continue
        if ligne.startswith("--- "):
            section = ligne[4:].strip()
            if section not in SECTIONS:
                raise ErreurContenu(f"{ou} : section inconnue {section!r}")
            if section in courante["_sections"]:
                raise ErreurContenu(f"{ou} : section {section!r} en double")
            courante["_sections"][section] = []
            continue
        if section is None:
            if not ligne.strip():
                continue
            m = re.match(r"^([a-z]+):\s*(.*)$", ligne)
            if not m or m.group(1) not in CLES:
                raise ErreurContenu(f"{ou} : en-tête invalide {ligne!r}")
            courante[m.group(1)] = m.group(2).strip()
        else:
            courante["_sections"][section].append(ligne)
    return [_normaliser(f) for f in fiches]


def _normaliser(brut: dict) -> dict:
    ou = brut["_ou"]
    fid = brut["id"]
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", fid):
        raise ErreurContenu(f"{ou} : identifiant invalide {fid!r}")
    theme = brut.get("theme")
    if theme not in THEMES:
        raise ErreurContenu(f"{ou} : thème inconnu {theme!r}")
    try:
        niveau = int(brut.get("niveau", "1"))
    except ValueError:
        raise ErreurContenu(f"{ou} : niveau invalide") from None
    if niveau not in (1, 2, 3):
        raise ErreurContenu(f"{ou} : niveau hors de 1 à 3")
    profils = brut.get("profils", "").split()
    if not profils or any(p not in PROFILS for p in profils):
        raise ErreurContenu(f"{ou} : profils invalides {profils!r}")
    typ = brut.get("type", "ouverte")
    if typ not in TYPES:
        raise ErreurContenu(f"{ou} : type inconnu {typ!r}")
    sections = {k: "\n".join(v).strip() for k, v in brut["_sections"].items()}
    if not sections.get("question"):
        raise ErreurContenu(f"{ou} : question vide")
    if not sections.get("solution"):
        raise ErreurContenu(f"{ou} : solution vide")
    fiche = {"id": fid, "theme": theme, "niveau": niveau, "profils": profils, "type": typ,
             "question": sections["question"], "solution": sections["solution"]}
    for cle in ("en", "indice", "piege"):
        if sections.get(cle):
            fiche[cle] = sections[cle]
    for cle in ("relances", "variantes"):
        if sections.get(cle):
            fiche[cle] = [re.sub(r"^-\s*", "", l).strip() for l in sections[cle].splitlines() if l.strip()]
    categorie = brut.get("categorie")
    if categorie is not None and categorie not in CATEGORIES:
        raise ErreurContenu(f"{ou} : catégorie inconnue {categorie!r}")
    if theme == "casse-tete" and not categorie:
        raise ErreurContenu(f"{ou} : un casse-tête doit avoir une catégorie")
    if categorie:
        fiche["categorie"] = categorie
        if not brut.get("titre"):
            raise ErreurContenu(f"{ou} : une fiche de la section Casse-têtes doit avoir un titre court")
    if brut.get("titre"):
        fiche["titre"] = brut["titre"]
    if typ == "numerique":
        if not brut.get("reponse"):
            raise ErreurContenu(f"{ou} : réponse attendue pour une question numérique")
        fiche["reponse"] = brut["reponse"]
        fiche["valeur"] = evaluer(brut["reponse"])
        fiche["tolerance"] = float(brut.get("tolerance", "0.005"))
    elif brut.get("reponse"):
        raise ErreurContenu(f"{ou} : « reponse » réservé aux questions numériques")
    if brut.get("duree"):
        fiche["duree"] = int(brut["duree"])
    if brut.get("source"):
        fiche["source"] = brut["source"]
    return fiche


def lire_guides(dossier: Path = GUIDES) -> list[dict]:
    guides = []
    for chemin in sorted(dossier.glob("*.md")):
        texte = chemin.read_text(encoding="utf-8").strip()
        premiere, _, reste = texte.partition("\n")
        if not premiere.startswith("# "):
            raise ErreurContenu(f"{chemin.name} : la première ligne doit être « # Titre »")
        ident = re.sub(r"^\d+[-_]", "", chemin.stem)
        guides.append({"id": ident, "titre": premiere[2:].strip(), "texte": reste.strip()})
    return guides


def lire_essentiels(chemin: Path = CONTENU / "essentiels.lst") -> list[str]:
    if not chemin.exists():
        return []
    return [l.strip() for l in chemin.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]


def construire() -> str:
    fiches = lire_fiches()
    connus = {f["id"] for f in fiches}
    essentiels = lire_essentiels()
    inconnus = [e for e in essentiels if e not in connus]
    if inconnus:
        raise ErreurContenu(f"essentiels.lst : identifiants inconnus : {', '.join(inconnus)}")
    for f in fiches:
        if f["id"] in essentiels:
            f["essentiel"] = True
    vus: dict[str, int] = {}
    for f in fiches:
        vus[f["id"]] = vus.get(f["id"], 0) + 1
    doublons = [i for i, n in vus.items() if n > 1]
    if doublons:
        raise ErreurContenu(f"identifiants en double : {', '.join(doublons)}")
    donnees = {"themes": THEMES, "profils": PROFILS, "categories": CATEGORIES, "fiches": fiches, "guides": lire_guides()}
    corps = json.dumps(donnees, ensure_ascii=False, indent=1)
    return ("// Fichier généré par construire.py à partir de contenu/ : ne pas modifier à la main.\n"
            f"window.PREPA_BANQUE = {corps};\n")


SW = RACINE / "sw.js"


COURS_JS = RACINE / "app" / "cours.js"


def construire_cours() -> str:
    """Données du cours (app/cours.js), validées par cours.py."""
    import cours
    chapitres = cours.lire_chapitres()
    donnees = {"parties": cours.PARTIES, "chapitres": chapitres}
    corps = json.dumps(donnees, ensure_ascii=False, indent=1)
    return ("// Fichier généré par construire.py à partir de contenu/cours/ : ne pas modifier à la main.\n"
            f"window.PREPA_COURS = {corps};\n")


def fichiers_application() -> list[str]:
    """Fichiers mis en cache pour l'usage hors ligne (chemins relatifs à la racine, sans sw.js)."""
    fichiers = ["index.html", "manifest.webmanifest"]
    fichiers += sorted(p.relative_to(RACINE).as_posix() for p in (RACINE / "app").rglob("*")
                       if p.is_file() and p.suffix in {".js", ".css", ".png", ".woff2"})
    return fichiers


def construire_sw(banque: str) -> str:
    """Service worker : met l'application en cache ; sa version change dès qu'un fichier change."""
    import hashlib
    empreinte = hashlib.sha256()
    for f in fichiers_application():
        empreinte.update(f.encode())
        contenu = banque.encode("utf-8") if f == "app/banque.js" else (RACINE / f).read_bytes()
        empreinte.update(contenu)
    version = "prepa-" + empreinte.hexdigest()[:12]
    liste = ",\n".join(f"  './{f}'" for f in fichiers_application())
    return f"""// Fichier généré par construire.py : ne pas modifier à la main.
// Usage hors ligne quand l'application est servie en http(s) (GitHub Pages) ; inactif en ouverture locale (file://).
// Stratégie « réseau d'abord » : en ligne on reçoit toujours la dernière version, hors ligne on lit le cache.
const VERSION = '{version}';
const FICHIERS = [
{liste}
];

self.addEventListener('install', function (e) {{
  e.waitUntil(caches.open(VERSION).then(function (c) {{ return c.addAll(FICHIERS); }}).then(function () {{ return self.skipWaiting(); }}));
}});

self.addEventListener('activate', function (e) {{
  e.waitUntil(caches.keys().then(function (cles) {{
    return Promise.all(cles.filter(function (k) {{ return k !== VERSION; }}).map(function (k) {{ return caches.delete(k); }}));
  }}).then(function () {{ return self.clients.claim(); }}));
}});

self.addEventListener('fetch', function (e) {{
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (rep) {{
    if (rep.ok) {{ const copie = rep.clone(); caches.open(VERSION).then(function (c) {{ c.put(req, copie); }}); }}
    return rep;
  }}).catch(function () {{
    return caches.match(req, {{ ignoreSearch: true }}).then(function (r) {{ return r || caches.match('./index.html'); }});
  }}));
}});
"""


ARTEFACT = RACINE / "artefact.html"


def construire_artefact() -> str:
    """Variante de index.html pour une page publiée sur claude.ai : sans squelette (ajouté à la publication), sans
    manifeste ni service worker, et avec le drapeau PREPA_ARTEFACT (export par copie, pas d'impression)."""
    html = (RACINE / "index.html").read_text(encoding="utf-8")
    garder = []
    for ligne in html.splitlines():
        brute = ligne.strip()
        if brute.lower() in {"<!doctype html>", "<html lang=\"fr\">", "<head>", "</head>", "<body>", "</body>", "</html>"}:
            continue
        if brute.startswith(('<meta charset', '<meta name="viewport"', '<link rel="manifest"', '<meta name="theme-color"',
                             '<link rel="apple-touch-icon"', '<meta name="apple-mobile-web-app')):
            continue
        if brute == '<script src="app/banque.js"></script>':
            garder.append("<script>window.PREPA_ARTEFACT = true;</script>")
        garder.append(ligne)
    return "<!-- Fichier généré par construire.py à partir de index.html : ne pas modifier à la main. -->\n" + "\n".join(garder) + "\n"


def main(argv: list[str]) -> int:
    texte = construire()
    cours_js = construire_cours()
    if "--verifier" not in argv:
        COURS_JS.write_text(cours_js, encoding="utf-8", newline="\n")
    sw = construire_sw(texte)
    artefact = construire_artefact()
    if "--verifier" in argv:
        actuel = SORTIE.read_text(encoding="utf-8") if SORTIE.exists() else ""
        sw_actuel = SW.read_text(encoding="utf-8") if SW.exists() else ""
        art_actuel = ARTEFACT.read_text(encoding="utf-8") if ARTEFACT.exists() else ""
        cours_actuel = COURS_JS.read_text(encoding="utf-8") if COURS_JS.exists() else ""
        if actuel != texte or sw_actuel != sw or art_actuel != artefact or cours_actuel != cours_js:
            print("app/banque.js, sw.js ou artefact.html n'est pas à jour : lance « python construire.py ».")
            return 1
        print("app/banque.js, sw.js et artefact.html sont à jour.")
        return 0
    SORTIE.write_text(texte, encoding="utf-8", newline="\n")
    SW.write_text(sw, encoding="utf-8", newline="\n")
    ARTEFACT.write_text(artefact, encoding="utf-8", newline="\n")
    n = texte.count('"id":')
    print(f"app/banque.js écrit ({n} entrées, fiches et guides) ; sw.js et artefact.html écrits.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
