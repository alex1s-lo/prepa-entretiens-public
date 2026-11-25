"""Met les expressions mathématiques des fiches au format LaTeX ($…$) : outil de conversion ponctuelle.

Usage : python outils/formules.py [--ecrire] [fichier.txt …]
Sans --ecrire, affiche les lignes modifiées (avant / après) pour relecture ; avec --ecrire, réécrit les fichiers.

Principe : chaque ligne est découpée en jetons (mots, nombres, symboles). Une « portée mathématique » est une suite de
jetons mathématiques contenant au moins un signe fort (opérateur, lettre grecque, exposant, appel de fonction, variable
isolée). Elle est convertie en TeX (exposants Unicode → ^{…}, √ → \\sqrt, × → \\times, E[…] → \\mathbb{E}[…],
virgule décimale → {,}, mots français → \\text{…}) puis entourée de $…$. Le code (``` et `…`) et les formules déjà
balisées sont laissés tels quels. Le résultat se relit : l'outil ne remplace pas la relecture.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent

EXPOSANTS = dict(zip("⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵀˣʸᵏᵐᵗᵈᵃᵇᶜᶠᵍʰʲˡᵒᵖˢᵘᵛʷᶻᴺᴷ",
                     "0123456789+-=()niTxykmtdabcfghjlopsuvwzNK"))
INDICES = dict(zip("₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥ", "0123456789+-=()aeoxhklmnpstijruv"))
GRECQUES = {"α": r"\alpha", "β": r"\beta", "γ": r"\gamma", "δ": r"\delta", "ε": r"\varepsilon", "θ": r"\theta",
            "κ": r"\kappa", "λ": r"\lambda", "μ": r"\mu", "ν": r"\nu", "ξ": r"\xi", "π": r"\pi", "ρ": r"\rho",
            "σ": r"\sigma", "τ": r"\tau", "φ": r"\varphi", "ϕ": r"\varphi", "χ": r"\chi", "ψ": r"\psi", "ω": r"\omega",
            "Γ": r"\Gamma", "Δ": r"\Delta", "Θ": r"\Theta", "Λ": r"\Lambda", "Φ": r"\Phi",
            "Ω": r"\Omega", "η": r"\eta", "ζ": r"\zeta", "Π": r"\Pi", "Ψ": r"\Psi", "ℓ": r"\ell"}
SYMBOLES = {"×": r"\times", "·": r"\cdot", "≤": r"\le", "≥": r"\ge", "≈": r"\approx", "≠": r"\neq", "±": r"\pm",
            "→": r"\to", "⇒": r"\Rightarrow", "⇔": r"\Leftrightarrow", "∞": r"\infty", "∈": r"\in", "∉": r"\notin",
            "∑": r"\sum", "∫": r"\int", "∂": r"\partial", "∝": r"\propto", "≡": r"\equiv",
            "⊂": r"\subset", "∪": r"\cup", "∩": r"\cap", "∀": r"\forall", "∃": r"\exists", "÷": r"\div",
            "⌊": r"\lfloor", "⌋": r"\rfloor", "⌈": r"\lceil", "⌉": r"\rceil", "…": r"\dots", "∼": r"\sim",
            "ℝ": r"\mathbb{R}", "ℕ": r"\mathbb{N}", "ℤ": r"\mathbb{Z}", "∅": r"\emptyset",
            "⊥": r"\perp", "∘": r"\circ", "½": r"\tfrac12", "¼": r"\tfrac14", "¾": r"\tfrac34",
            "⊕": r"\oplus", "⟨": r"\langle", "⟩": r"\rangle", "‖": r"\|"}
FONCTIONS = {"Var": r"\operatorname{Var}", "Cov": r"\operatorname{Cov}", "corr": r"\operatorname{corr}",
             "Corr": r"\operatorname{Corr}", "ln": r"\ln", "log": r"\log", "exp": r"\exp", "max": r"\max",
             "min": r"\min", "sin": r"\sin", "cos": r"\cos", "tan": r"\tan", "argmax": r"\operatorname{argmax}",
             "argmin": r"\operatorname{argmin}", "sgn": r"\operatorname{sgn}", "pgcd": r"\operatorname{pgcd}",
             "ppcm": r"\operatorname{ppcm}", "lim": r"\lim", "sqrt": r"\sqrt",
             "Std": r"\operatorname{Std}", "erf": r"\operatorname{erf}", "det": r"\det",
             "diag": r"\operatorname{diag}", "tr": r"\operatorname{tr}", "log2": r"\log_2", "log10": r"\log_{10}"}
APPELS = {"E", "P", "Var", "Cov", "corr", "Corr", "N", "max", "min", "Std", "V", "Q", "f", "g", "F", "G", "h", "u",
          "ln", "log", "exp", "C", "Φ", "φ", "erf", "sin", "cos", "p", "q", "r", "L", "R", "S", "W", "X", "Y", "Z", "M",
          "K", "B", "D", "H", "T", "U", "e"}
FORTS = set("=<>≤≥≈≠±√∑Σ∫∞→⇒⇔∈∉×·∂∝≡⊂∪∩∀∃÷⌊⌋⌈⌉^_∼⊕½¼¾/⟨⟩‖+−~\u0302\u0304") | set(EXPOSANTS) | set(INDICES) | set(GRECQUES)
FAIBLES = set("()[]{}|,.-–!'%:…")
# lettres isolées qui sont aussi des mots ou des noms : mathématiques seulement à côté d'un signe fort
AMBIGUES = {"a", "y", "A", "B", "C", "D", "I", "L", "l", "o", "O"}
PETITS_MOTS = {"et", "ou", "de", "le", "la", "les", "si", "un", "une", "des", "du", "est", "au", "en", "par", "sur",
               "and", "or", "if", "the", "of", "is", "to", "pour", "avec", "sans", "car"}
DIFFERENTIELLES = re.compile(r"^d[b-df-hj-np-tv-zA-Zτθσ]$|^d[A-Z][a-z]?$")
DEUX_LETTRES_MATH = re.compile(r"^[a-z][A-Z]$")  # rT, qT, kT…
MOT = r"[A-Za-zÀ-ÖØ-öø-ÿŒœ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿŒœ]+)*(?:-[A-Za-zÀ-ÖØ-öø-ÿŒœ]+)*"
JETON = re.compile(MOT + r"|\d+(?:[,.]\d+)?|\s+|.", re.S)
UNITE = re.compile(r"\b(?:km|m|kg|g|MWh|kWh|MW|GW|€|\$|h|s|min|cm|L|t|bp|pb)/(?:h|s|an|jour|j|MWh|kWh|MW|km|L|kg|t|m²|mois|action|an)\b")


def est_mot(j):
    return bool(re.fullmatch(MOT, j))


def fusionner_appels(jetons):
    """Regroupe « P(…) », « E[…] », « Var(…) » en un seul jeton, parenthèses équilibrées comprises."""
    sortie = []
    i = 0
    while i < len(jetons):
        j = jetons[i]
        if j in APPELS and i + 1 < len(jetons) and jetons[i + 1] in ("(", "["):
            ouvrant = jetons[i + 1]
            fermant = ")" if ouvrant == "(" else "]"
            niveau, k = 0, i + 1
            while k < len(jetons):
                if jetons[k] in ("(", "["):
                    niveau += 1
                elif jetons[k] in (")", "]"):
                    niveau -= 1
                    if niveau == 0:
                        break
                k += 1
            interieur = "".join(jetons[i + 2:k])
            # un appel n'est retenu que s'il ressemble à une formule (pas « A (le premier joueur) »)
            mots = [m for m in re.findall(MOT, interieur) if len(m) > 2 and m not in FONCTIONS]
            if k < len(jetons) and jetons[k] == fermant and len(interieur) < 120 and (
                    j in ("E", "P", "Var", "Cov", "corr", "Corr", "max", "min", "Std", "ln", "log", "exp", "N", "Φ", "φ",
                          "erf", "sin", "cos") or len(mots) <= 1):
                sortie.append("".join(jetons[i:k + 1]))
                i = k + 1
                continue
        sortie.append(j)
        i += 1
    return sortie


def classer(jetons, i):
    """F : signe fort ; W : faible (nombre, parenthèse, ponctuation interne) ; V : variable ; A : ambigu ; T : texte."""
    j = jetons[i]
    colle = jetons[i + 1] if i + 1 < len(jetons) else ""
    precedent = jetons[i - 1] if i > 0 else ""
    if j.isspace():
        return "W"
    nom = re.match(r"^[A-Za-zΦφ]+", j)
    if len(j) > 2 and nom and nom.group() in APPELS and j[-1] in ")]" and j[len(nom.group())] in "([":
        return "F"
    # jeton placé juste après _ ou ^ (éventuellement après une accolade) : indice ou exposant
    if est_mot(j) and (precedent in ("_", "^") or (precedent == "{" and i > 1 and jetons[i - 2] in ("_", "^"))):
        return "V"
    if j in FONCTIONS:
        apres = next((jetons[k] for k in range(i + 1, len(jetons)) if not jetons[k].isspace()), "")
        if colle in ("(", "["):
            return "F"
        if j in ("ln", "log", "exp", "sin", "cos", "log2", "log10", "Var", "Cov") and re.fullmatch(r"\d+(?:[,.]\d+)?|[A-Za-z]|[α-ωΑ-Ω]", apres):
            return "F"
        return "T"
    if j == "/":
        return "F" if (precedent and not precedent.isspace()) else "W"
    if j == "!":
        return "W" if (precedent and re.fullmatch(r"\w|\)", precedent[-1:])) else "T"
    if j == ":":
        return "W" if (precedent[-1:].isdigit() and colle[:1].isdigit()) else "T"
    if j == "-":
        return "F" if (precedent.isspace() and colle.isspace()) or (precedent[-1:].isalnum() and colle[:1].isalnum()
                                                                   and len(precedent) == 1) else "W"
    if any(c in FORTS for c in j):
        return "F"
    if re.fullmatch(r"\d+(?:[,.]\d+)?", j):
        return "W"
    if j in FAIBLES:
        return "W"
    if est_mot(j):
        if len(j) == 1:
            if not re.fullmatch(r"[A-Za-z]", j):
                return "T"
            avant = next((jetons[k] for k in range(i - 1, -1, -1) if not jetons[k].isspace()), "")
            apres = next((jetons[k] for k in range(i + 1, len(jetons)) if not jetons[k].isspace()), "")
            if avant == "«" and apres == "»":
                return "T"
            # unité après un nombre (« 6 m », « 3 h », « 30 s »)
            if j in ("m", "h", "s", "g", "L", "t", "j", "l") and re.fullmatch(r"\d+(?:[,.]\d+)?", avant) and \
                    apres not in ("=", "+", "−", "×", "·", "/", "^", "_", "≈", "≤", "≥", "<", ">"):
                return "T"
            return "A" if j in AMBIGUES else "V"
        if DIFFERENTIELLES.match(j) or DEUX_LETTRES_MATH.match(j):
            return "V"
        return "T"
    return "T"


def mot_en_texte(m):
    mot = m.group(0)
    if mot in FONCTIONS or DIFFERENTIELLES.match(mot) or len(mot) == 1:
        return mot
    if len(mot) <= 2 and mot not in PETITS_MOTS and re.fullmatch(r"[A-Za-z]+", mot):
        return mot
    return r"\text{" + mot + "}"


def racines(t: str) -> str:
    """√(…) → \\sqrt{…} en suivant l'équilibre des parenthèses."""
    while "√(" in t:
        i = t.index("√(")
        niveau = 0
        for k in range(i + 1, len(t)):
            niveau += {"(": 1, ")": -1}.get(t[k], 0)
            if niveau == 0:
                break
        else:
            break
        t = t[:i] + "\\sqrt{" + t[i + 2:k] + "}" + t[k + 1:]
    return t


OPERATEURS_TEX = {"times", "cdot", "approx", "le", "ge", "leq", "geq", "to", "pm", "neq", "mid", "in", "sim", "Rightarrow",
                  "iff", "equiv", "quad", "qquad", "dots", "sum", "int", "prod"}


def espacer_textes(f: str) -> str:
    """Un mot \\text{…} collé à une variable s'afficherait collé : espace intérieure du côté d'une variable ou d'un
    nombre, jamais du côté d'un opérateur (\\times, \\approx…), d'une parenthèse, d'un indice ou d'un exposant."""
    out, i = [], 0
    while True:
        k = f.find("\\text{", i)
        if k < 0:
            out.append(f[i:])
            break
        j = f.index("}", k)
        contenu = f[k + 6:j].strip()
        avant = f[i:k].rstrip(" ")
        m = re.search(r"(\\[A-Za-z]+|[A-Za-z0-9)}]|[_^{])$", avant)
        en_indice = bool(m) and m.group(1) in ("_", "^")
        if m and m.group(1).startswith("\\"):
            pad_g = m.group(1)[1:] not in OPERATEURS_TEX
        else:
            pad_g = bool(m) and m.group(1) not in ("_", "^", "{")
        n = re.match(r"\\([A-Za-z]+)|[A-Za-z0-9]", f[j + 1:].lstrip(" "))
        pad_d = bool(n) and not en_indice and (n.group(1) is None or n.group(1) not in OPERATEURS_TEX)
        out.append(avant + (" " if f[i:k] != avant else "") + "\\text{" + (" " if pad_g else "") + contenu +
                   (" " if pad_d else "") + "}")
        i = j + 1
    return "".join(out)


def convertir_tex(s: str) -> str:
    t = s
    # mots français → \text{…} (avant d'introduire des commandes TeX, et avant que « − » devienne un trait d'union)
    t = re.sub(MOT, mot_en_texte, t)
    t = t.replace("−", "-").replace("–", "-").replace("′", "'")
    t = re.sub(r"(?<=\d)[ \u202f\u00a0](?=\d{3}\b)", r"\\,", t)
    t = re.sub(r"(\d),(\d)", r"\1{,}\2", t)
    t = t.replace("%", r"\%")
    t = re.sub("[" + "".join(EXPOSANTS) + "]+", lambda m: "^{" + "".join(EXPOSANTS[c] for c in m.group()) + "}", t)
    t = re.sub("[" + "".join(INDICES) + "]+", lambda m: "_{" + "".join(INDICES[c] for c in m.group()) + "}", t)
    t = re.sub(r"\^\(([^()]*)\)", r"^{\1}", t)
    t = re.sub(r"_([A-Za-z]{2,})(?![A-Za-z{])", r"_{\1}", t)
    t = re.sub(r"(\S)\u0302", r"\\hat{\1}", t)
    t = re.sub(r"(\S)\u0304", r"\\bar{\1}", t)
    t = t.replace("~", r" \sim ")
    t = re.sub(r"\^(-?[\w.]+)", lambda m: "^{" + m.group(1) + "}" if len(m.group(1)) > 1 else m.group(0), t)
    t = racines(t)
    t = re.sub(r"√([A-Za-z0-9.{},\\]+|[" + "".join(GRECQUES) + "])", r"\\sqrt{\1}", t)
    t = re.sub(r"√", r"\\sqrt{\\,}", t)
    t = re.sub(r"(?<![A-Za-z\\])E\[", r"\\mathbb{E}[", t)
    t = re.sub(r"(?<![A-Za-z\\])P\(", r"\\mathbb{P}(", t)
    t = re.sub(r"(?<![A-Za-z\\])C\(([^(),]+),\s*([^(),]+)\)", r"\\binom{\1}{\2}", t)
    for nom, tex in sorted(FONCTIONS.items(), key=lambda x: -len(x[0])):
        t = re.sub(r"(?<![A-Za-z\\{])" + nom + r"(?![A-Za-z])", lambda m, tex=tex: tex + " ", t)
    t = re.sub(r"Σ(?=\s*(?:=|,|\)|$))", r"\\Sigma ", t)
    t = t.replace("Σ", r"\sum ")
    for c, tex in GRECQUES.items():
        t = t.replace(c, tex + " ")
    for c, tex in SYMBOLES.items():
        t = t.replace(c, " " + tex + " ")
    t = re.sub(r"[ ]{2,}", " ", t).strip()
    t = re.sub(r"\s+([,)\]}^_])", r"\1", t)
    t = re.sub(r"([(\[{_^])\s+", r"\1", t)
    for _ in range(3):
        t = re.sub(r"\\text\{([^{}]*)\}\s*\\text\{", r"\\text{\1 ", t)
    t = espacer_textes(t)
    t = re.sub(r"\\(sigma|mu|rho|lambda|theta|alpha|beta|gamma|delta|tau|pi|phi|varphi|kappa|nu|omega|xi|eta)(?=[A-Za-z])",
               r"\\\1 ", t)
    return t


def portees(ligne: str):
    jetons = fusionner_appels(JETON.findall(ligne))
    classes = [classer(jetons, i) for i in range(len(jetons))]
    # une lettre ambiguë (a, y, A…) ou un nom de fonction seul ne compte que s'il touche un signe fort
    for i, c in enumerate(classes):
        if c == "D":
            avant = next((k for k in range(i - 1, -1, -1) if not jetons[k].isspace()), None)
            apres = next((k for k in range(i + 1, len(jetons)) if not jetons[k].isspace()), None)
            maths = lambda k: k is not None and classes[k] in ("F", "V", "W") and jetons[k] not in (",", ".", ":")
            classes[i] = "V" if (maths(avant) or (apres is not None and classes[apres] == "F")) else "T"
    for i, c in enumerate(classes):
        if c == "A":
            voisins = [classes[k] for k in range(max(0, i - 2), min(len(classes), i + 3)) if k != i and not jetons[k].isspace()]
            avant = next((jetons[k] for k in range(i - 1, -1, -1) if not jetons[k].isspace()), "")
            apres = next((jetons[k] for k in range(i + 1, len(jetons)) if not jetons[k].isspace()), "")
            n_uplet = avant in ("(", ",", "[") and apres in (",", ")", "]")
            classes[i] = "V" if ("F" in voisins or n_uplet) else "T"
    plages = []
    i = 0
    n = len(jetons)
    while i < n:
        if classes[i] in ("F", "V"):
            debut = i
            while debut > 0 and classes[debut - 1] in ("W", "V", "F"):
                if jetons[debut - 1].isspace() and debut > 1 and jetons[debut - 2] == ".":
                    break
                if jetons[debut - 1] == "," and re.fullmatch(r"\d+(?:[,.]\d+)?", next(
                        (jetons[k] for k in range(debut - 2, -1, -1) if not jetons[k].isspace()), "")) and \
                        re.fullmatch(r"\d+(?:[,.]\d+)?", next((jetons[k] for k in range(debut, n) if not jetons[k].isspace()), "")):
                    break
                debut -= 1
            fin = i
            while fin + 1 < n and classes[fin + 1] in ("W", "V", "F"):
                if jetons[fin + 1] == "." and fin + 2 < n and jetons[fin + 2].isspace():
                    break
                if jetons[fin + 1] == "," and re.fullmatch(r"\d+(?:[,.]\d+)?", jetons[fin]) and \
                        re.fullmatch(r"\d+(?:[,.]\d+)?", next((jetons[k] for k in range(fin + 2, n) if not jetons[k].isspace()), "")):
                    break
                fin += 1
            plages.append((debut, fin))
            i = fin + 1
        else:
            i += 1
    return jetons, plages


def nettoyer_bornes(texte: str):
    avant = re.match(r"^[\s,.(\[]*", texte).group()
    reste = texte[len(avant):]
    apres = re.search(r"[\s,.)\]'!:\-–(\[]*$", reste).group()
    coeur = reste[:len(reste) - len(apres)] if apres else reste
    # garder la factorielle et les parenthèses / crochets nécessaires à l'équilibre
    while apres and apres[0] in ")]!" and (apres[0] == "!" or coeur.count("(" if apres[0] == ")" else "[") >
                                             coeur.count(apres[0])):
        coeur += apres[0]
        apres = apres[1:]
    while avant and avant[-1] in "([" and coeur.count(")" if avant[-1] == "(" else "]") > coeur.count(avant[-1]):
        coeur = avant[-1] + coeur
        avant = avant[:-1]
    def bien_forme(x):
        pile = []
        for c in x:
            if c in "([":
                pile.append(c)
            elif c in ")]":
                if not pile or pile.pop() != ("(" if c == ")" else "["):
                    return False
        return not pile
    if not bien_forme(coeur) and avant.endswith(("(", "[")) and apres.startswith((")", "]")) and \
            bien_forme(avant[-1] + coeur + apres[0]):
        coeur, avant, apres = avant[-1] + coeur + apres[0], avant[:-1], apres[1:]
    return avant, coeur, apres, bien_forme(coeur)


def convertir_ligne(ligne: str) -> str:
    if not ligne.strip():
        return ligne
    proteges = []

    def proteger(m):
        proteges.append(m.group())
        return "\u0001" + str(len(proteges) - 1) + "\u0001"
    t = re.sub(r"`[^`]*`|\$\$.*?\$\$|(?<!\\)\$[^$]*?(?<!\\)\$|https?://\S+|\]\([^)]*\)", proteger, ligne)
    t = UNITE.sub(proteger, t)
    t = re.sub(r"\b[nN]°|\b[A-Z]{2,}\b(?!\()|\bi\.i\.d\.?|\bp\.\s?ex\.|\bc\.-à-d\.|\betc\.", proteger, t)  # sigles, abréviations
    prefixe = re.match(r"^(\s*(?:[-*]\s+|\d+\.\s+|>\s*)?)", t).group()
    corps = t[len(prefixe):]
    jetons, plages = portees(corps)
    sortie = []
    dernier = 0
    morceaux = []
    for d, f in plages:
        pile, coupures = [], []
        for k in range(d, f + 1):
            if jetons[k] in ("(", "["):
                pile.append(k)
            elif jetons[k] in (")", "]"):
                if pile:
                    pile.pop()
                else:
                    coupures.append(k)
        coupures = sorted(coupures + pile)
        debut = d
        for k in coupures:
            if debut <= k - 1:
                morceaux.append((debut, k - 1))
            debut = k + 1
        if debut <= f:
            morceaux.append((debut, f))
    plages = [(a, b) for a, b in morceaux if any(not jetons[x].isspace() for x in range(a, b + 1))]
    for d, f in plages:
        sortie.append("".join(jetons[dernier:d]))
        brut = "".join(jetons[d:f + 1])
        avant, coeur, apres, equilibre = nettoyer_bornes(brut)
        utile = re.search(r"[A-Za-z0-9" + "".join(GRECQUES) + "]", coeur)
        if not coeur or "\u0001" in coeur or not utile or not equilibre or re.fullmatch(r"\d+(?:[,.]\d+)?", coeur.strip()):
            sortie.append(brut)
        else:
            sortie.append(avant + "$" + convertir_tex(coeur) + "$" + apres)
        dernier = f + 1
    sortie.append("".join(jetons[dernier:]))
    res = prefixe + "".join(sortie)
    for _ in range(3):
        res = re.sub("\u0001(\\d+)\u0001", lambda m: proteges[int(m.group(1))], res)
    return res


def convertir_texte(texte: str) -> str:
    lignes = texte.split("\n")
    dans_code = False
    sortie = []
    for l in lignes:
        if l.strip().startswith("```"):
            dans_code = not dans_code
            sortie.append(l)
            continue
        if dans_code or l.startswith(("===", "--- ", "#")) or re.match(r"^[a-z]+:\s", l):
            sortie.append(l)
            continue
        if l.lstrip().startswith("|") and l.rstrip().endswith("|"):
            cellules = l.split("|")
            sortie.append("|".join(convertir_ligne(c) if c.strip() and not re.fullmatch(r"[\s:-]+", c) else c
                                   for c in cellules))
            continue
        sortie.append(convertir_ligne(l))
    return "\n".join(sortie)


def main(argv):
    ecrire = "--ecrire" in argv
    # les fiches de casse-têtes (ct_*.txt) sont écrites directement en LaTeX : on ne les retouche pas
    fichiers = [Path(a) for a in argv if not a.startswith("--")] or \
        [f for f in sorted((RACINE / "contenu").glob("*.txt")) if not f.name.startswith("ct_")]
    for f in fichiers:
        avant = f.read_text(encoding="utf-8")
        apres = convertir_texte(avant)
        if ecrire:
            f.write_text(apres, encoding="utf-8")
        else:
            for a, b in zip(avant.split("\n"), apres.split("\n")):
                if a != b:
                    print("-", a)
                    print("+", b)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
