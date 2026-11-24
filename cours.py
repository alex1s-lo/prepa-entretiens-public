"""Lecture et validation du cours (contenu/cours/*.md) ; produit les données de app/cours.js.

Format d'un chapitre :

    ---
    titre: Espérance, variance, covariance
    partie: Probabilités
    resume: Une phrase.
    duree: 2 h
    fiches: proba-points-fixes proba-correlation-trois
    ---
    Introduction en Markdown, formules $…$ et $$…$$.

    ## Une section
    Texte. Lien vers une fiche : [[fiche:proba-pile-pile]].

    :::definition Titre facultatif
    …
    :::

    :::exercice identifiant-unique
    reponse: 1/6            (facultatif : réponse numérique vérifiée)
    tolerance: 0.005        (facultatif)
    Énoncé…
    ---
    Solution détaillée…
    :::

    :::widget covariance
    :::

Blocs : definition, theoreme, propriete, preuve, exemple, methode, intuition, attention, entretien, exercice, widget.
"""
from __future__ import annotations

import re
from pathlib import Path

import construire

DOSSIER = construire.CONTENU / "cours"
BLOCS = {"definition", "theoreme", "propriete", "preuve", "exemple", "methode", "intuition", "attention", "entretien",
         "exercice", "widget"}
WIDGETS = {"tcl", "covariance", "quadrants", "brownien", "ito", "marche", "bs", "binomial", "montecarlo", "kelly", "ou",
           "svi", "couverture", "conditionnement", "regression", "obligation", "glosten", "gradient", "poisson", "correlations", "barriere"}
CLES = {"titre", "partie", "resume", "duree", "fiches"}
PARTIES = ["Méthode", "Probabilités", "Algèbre linéaire et statistiques", "Calcul stochastique", "Pricing",
           "Risque, données et marchés", "Programmation", "Entretiens"]


class ErreurCours(ValueError):
    pass


def lire_chapitres(dossier: Path = DOSSIER, fiches_connues: set[str] | None = None) -> list[dict]:
    if fiches_connues is None:
        fiches_connues = {f["id"] for f in construire.lire_fiches()}
    chapitres = []
    ids_exercices: dict[str, str] = {}
    for chemin in sorted(dossier.glob("*.md")):
        chap = lire_chapitre(chemin, fiches_connues)
        for ex in chap["exercices"]:
            if ex["id"] in ids_exercices:
                raise ErreurCours(f"{chemin.name} : exercice {ex['id']!r} déjà défini dans {ids_exercices[ex['id']]}")
            ids_exercices[ex["id"]] = chemin.name
        chapitres.append(chap)
    for i, c in enumerate(chapitres):  # le mode d'emploi est le chapitre 0
        c["numero"] = i
    # renvois entre chapitres : toujours symboliques ([[n:id]] devient le numéro, avec un lien), jamais un numéro en dur
    connus = {c["id"] for c in chapitres}
    for c in chapitres:
        for ref in re.findall(r"\[\[n:([a-z0-9-]+)\]\]", c["texte"] + " " + c["resume"]):
            if ref not in connus:
                raise ErreurCours(f"chapitre {c['id']} : renvoi vers un chapitre inconnu {ref!r}")
        sans_code = re.sub(r"```.*?```", "", c["texte"], flags=re.S)
        m = re.search(r"chapitres?\s+\d", sans_code + " " + c["resume"])
        if m:
            raise ErreurCours(f"chapitre {c['id']} : numéro de chapitre en dur ({m.group()!r}), utiliser [[n:id]]")
    return chapitres


def lire_chapitre(chemin: Path, fiches_connues: set[str]) -> dict:
    texte = chemin.read_text(encoding="utf-8").replace("\r\n", "\n")
    m = re.match(r"^---\n(.*?)\n---\n", texte, re.S)
    if not m:
        raise ErreurCours(f"{chemin.name} : en-tête « --- » manquant")
    entete: dict[str, str] = {}
    for ligne in m.group(1).splitlines():
        if not ligne.strip():
            continue
        k, _, v = ligne.partition(":")
        k = k.strip()
        if k not in CLES:
            raise ErreurCours(f"{chemin.name} : clé d'en-tête inconnue {k!r}")
        entete[k] = v.strip()
    for k in ("titre", "partie", "resume"):
        if not entete.get(k):
            raise ErreurCours(f"{chemin.name} : « {k} » manquant")
    if entete["partie"] not in PARTIES:
        raise ErreurCours(f"{chemin.name} : partie inconnue {entete['partie']!r}")
    corps = texte[m.end():]
    ident = re.sub(r"^\d+[-_]", "", chemin.stem)
    fiches = entete.get("fiches", "").split()
    for f in fiches:
        if f not in fiches_connues:
            raise ErreurCours(f"{chemin.name} : fiche inconnue {f!r}")
    for f in re.findall(r"\[\[fiche:([a-z0-9-]+)\]\]", corps):
        if f not in fiches_connues:
            raise ErreurCours(f"{chemin.name} : lien vers une fiche inconnue {f!r}")
    exercices, widgets, sections = _verifier_blocs(chemin.name, corps)
    _verifier_maths(chemin.name, corps)
    return {"id": ident, "titre": entete["titre"], "partie": entete["partie"], "resume": entete["resume"],
            "duree": entete.get("duree", ""), "fiches": fiches, "texte": corps.strip(), "exercices": exercices,
            "widgets": widgets, "sections": sections}


def _verifier_blocs(nom: str, corps: str) -> tuple[list[dict], list[str], list[str]]:
    exercices: list[dict] = []
    widgets: list[str] = []
    sections: list[str] = []
    ouvert = None
    entete_ex: dict | None = None
    separateur = False
    dans_code = False
    for num, ligne in enumerate(corps.splitlines(), 1):
        ou = f"{nom}:{num}"
        if ligne.startswith("```"):
            dans_code = not dans_code
            continue
        if dans_code:
            continue
        if ouvert is None and ligne.startswith("## "):
            sections.append(ligne[3:].strip())
        if ligne.startswith(":::"):
            reste = ligne[3:].strip()
            if not reste:
                if ouvert is None:
                    raise ErreurCours(f"{ou} : « ::: » fermant sans bloc ouvert")
                if ouvert == "exercice":
                    if not separateur:
                        raise ErreurCours(f"{ou} : exercice sans « --- » entre énoncé et solution")
                    exercices.append(entete_ex)
                ouvert = None
                continue
            if ouvert is not None:
                raise ErreurCours(f"{ou} : bloc ouvert dans un autre bloc ({ouvert})")
            genre, _, titre = reste.partition(" ")
            if genre not in BLOCS:
                raise ErreurCours(f"{ou} : bloc inconnu {genre!r}")
            ouvert = genre
            if genre == "exercice":
                ident = titre.strip()
                if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", ident):
                    raise ErreurCours(f"{ou} : identifiant d'exercice invalide {ident!r}")
                entete_ex = {"id": ident}
                separateur = False
            elif genre == "widget":
                w = titre.strip()
                if w not in WIDGETS:
                    raise ErreurCours(f"{ou} : widget inconnu {w!r}")
                widgets.append(w)
            continue
        if ouvert == "exercice":
            if ligne.strip() == "---":
                if separateur:
                    raise ErreurCours(f"{ou} : deux « --- » dans un exercice")
                separateur = True
                continue
            mm = re.match(r"^(reponse|tolerance):\s*(.+)$", ligne)
            if mm and not separateur:
                if mm.group(1) == "reponse":
                    entete_ex["reponse"] = mm.group(2).strip()
                    entete_ex["valeur"] = construire.evaluer(entete_ex["reponse"])
                    entete_ex.setdefault("tolerance", 0.005)
                else:
                    entete_ex["tolerance"] = float(mm.group(2))
    if ouvert is not None:
        raise ErreurCours(f"{nom} : bloc « {ouvert} » non fermé")
    if dans_code:
        raise ErreurCours(f"{nom} : bloc de code non fermé")
    return exercices, widgets, sections


def _verifier_maths(nom: str, corps: str) -> None:
    """Les « $ » doivent aller par paires (formules en ligne) et les « $$ » aussi, hors blocs de code."""
    sans_code = re.sub(r"```.*?```", "", corps, flags=re.S)
    sans_code = re.sub(r"`[^`\n]*`", "", sans_code)
    if sans_code.count("$$") % 2:
        raise ErreurCours(f"{nom} : nombre impair de « $$ »")
    sans_blocs = re.sub(r"\$\$.*?\$\$", "", sans_code, flags=re.S)
    for num, ligne in enumerate(sans_blocs.splitlines(), 1):
        n = len(re.findall(r"(?<!\\)\$", ligne))
        if n % 2:
            raise ErreurCours(f"{nom} : « $ » non fermé dans la ligne « {ligne.strip()[:70]} »")
