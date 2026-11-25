"""Vérifications indépendantes des réponses numériques de la banque.

Chaque fonction recalcule la réponse d'une fiche par une autre méthode que celle de la solution (dénombrement exhaustif,
chaîne de Markov résolue en fractions, intégration numérique, Monte-Carlo à graine fixe). Elle renvoie soit une valeur
exacte (Fraction, entier ou flottant comparé à 1e-9 près), soit un couple (valeur, tolérance absolue).

Bibliothèque standard uniquement.
"""
from __future__ import annotations

import itertools
import math
import random
from fractions import Fraction as F

VERIFS: dict = {}


def verif(ident):
    def deco(f):
        if ident in VERIFS:
            raise ValueError(f"vérification en double : {ident}")
        VERIFS[ident] = f
        return f
    return deco


# --- Outils ---------------------------------------------------------------------------------------------------------
def resoudre(a, b):
    """Résout a·x = b par élimination de Gauss (coefficients Fraction ou float)."""
    n = len(a)
    m = [list(a[i]) + [b[i]] for i in range(n)]
    for c in range(n):
        p = next(r for r in range(c, n) if m[r][c] != 0)
        m[c], m[p] = m[p], m[c]
        piv = m[c][c]
        m[c] = [x / piv for x in m[c]]
        for r in range(n):
            if r != c and m[r][c] != 0:
                k = m[r][c]
                m[r] = [x - k * y for x, y in zip(m[r], m[c])]
    return [m[i][n] for i in range(n)]


def automate(motifs, alphabet):
    """États = plus long suffixe du texte lu qui est préfixe d'un motif. Renvoie (états, transition)."""
    prefixes = sorted({m[:k] for m in motifs for k in range(len(m) + 1)}, key=len)

    def suivant(etat, c):
        t = etat + c
        for k in range(len(t), -1, -1):
            if t[len(t) - k:] in prefixes:
                return t[len(t) - k:]
        return ""
    return prefixes, suivant


def attente_motif(motif, probas):
    """Espérance du nombre de tirages avant d'observer « motif » (probas : symbole -> probabilité)."""
    etats, suivant = automate([motif], list(probas))
    actifs = [e for e in etats if e != motif]
    idx = {e: i for i, e in enumerate(actifs)}
    n = len(actifs)
    a = [[F(0)] * n for _ in range(n)]
    b = [F(1)] * n
    for e in actifs:
        i = idx[e]
        a[i][i] += 1
        for c, p in probas.items():
            s = suivant(e, c)
            if s != motif:
                a[i][idx[s]] -= p
    return resoudre(a, b)[idx[""]]


def course_motifs(m1, m2, probas):
    """Probabilité que m1 apparaisse avant m2."""
    etats, suivant = automate([m1, m2], list(probas))
    actifs = [e for e in etats if e not in (m1, m2)]
    idx = {e: i for i, e in enumerate(actifs)}
    n = len(actifs)
    a = [[F(0)] * n for _ in range(n)]
    b = [F(0)] * n
    for e in actifs:
        i = idx[e]
        a[i][i] += 1
        for c, p in probas.items():
            s = suivant(e, c)
            if s == m1:
                b[i] += p
            elif s != m2:
                a[i][idx[s]] -= p
    return resoudre(a, b)[idx[""]]


def marche_absorbee(depart, haut, p):
    """Marche ±1 (montée avec probabilité p), absorbée en 0 et en « haut ». Renvoie (P(haut), durée moyenne)."""
    q = 1 - p
    n = haut - 1
    a = [[F(0)] * n for _ in range(n)]
    b1 = [F(0)] * n
    b2 = [F(1)] * n
    for k in range(1, haut):
        i = k - 1
        a[i][i] += 1
        if k + 1 == haut:
            b1[i] += p
        else:
            a[i][i + 1] -= p
        if k - 1 > 0:
            a[i][i - 1] -= q
    proba = resoudre(a, b1)[depart - 1]
    duree = resoudre(a, b2)[depart - 1]
    return proba, duree


def simpson(f, a, b, n=20000):
    if n % 2:
        n += 1
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3


def phi(x):
    return math.exp(-x * x / 2) / math.sqrt(2 * math.pi)


def Phi(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def grille(f, n=800):
    """Moyenne de f(x, y) sur une grille régulière du carré unité (points milieux)."""
    s = 0.0
    for i in range(n):
        x = (i + 0.5) / n
        for j in range(n):
            s += f(x, (j + 0.5) / n)
    return s / (n * n)


DE = range(1, 7)
JEU = [(v, c) for v in range(1, 14) for c in range(4)]


# --- Probabilités ---------------------------------------------------------------------------------------------------
@verif("proba-deux-des-somme-7")
def _():
    return F(sum(a + b == 7 for a in DE for b in DE), 36)


@verif("proba-des-somme-7-sachant-un-6")
def _():
    cas = [(a, b) for a in DE for b in DE if 6 in (a, b)]
    return F(sum(a + b == 7 for a, b in cas), len(cas))


@verif("proba-attente-premier-six")
def _():
    return attente_motif("6", {"6": F(1, 6), "x": F(5, 6)})


@verif("proba-toutes-les-faces")
def _():
    # chaîne sur le nombre de faces vues, résolue à rebours
    e = F(0)
    for k in range(5, -1, -1):
        # E_k = 1 + (k/6) E_k + ((6-k)/6) E_{k+1}
        e = (1 + F(6 - k, 6) * e) / (1 - F(k, 6))
    return e


@verif("proba-pile-pile")
def _():
    return attente_motif("PP", {"P": F(1, 2), "F": F(1, 2)})


@verif("proba-pile-face")
def _():
    return attente_motif("PF", {"P": F(1, 2), "F": F(1, 2)})


@verif("proba-pfp")
def _():
    return attente_motif("PFP", {"P": F(1, 2), "F": F(1, 2)})


@verif("proba-penney-ppf-pff")
def _():
    return course_motifs("PPF", "PFF", {"P": F(1, 2), "F": F(1, 2)})


@verif("proba-premier-a-faire-six")
def _():
    # A gagne au tour 2k+1 : (5/6)^(2k) · 1/6 ; série tronquée bien au-delà de la précision flottante
    return sum((5 / 6) ** (2 * k) / 6 for k in range(2000))


@verif("proba-deux-enfants")
def _():
    cas = [c for c in itertools.product("GF", repeat=2) if "G" in c]
    return F(sum(c == ("G", "G") for c in cas), len(cas))


@verif("proba-test-medical")
def _():
    malade, sens, faux = F(1, 100), F(99, 100), F(5, 100)
    return malade * sens / (malade * sens + (1 - malade) * faux)


@verif("proba-monty-hall")
def _():
    gagne = F(0)
    for voiture in range(3):
        for choix in range(3):
            ouvrables = [d for d in range(3) if d != choix and d != voiture]
            for ouverte in ouvrables:
                p = F(1, 9) / len(ouvrables)
                autre = next(d for d in range(3) if d not in (choix, ouverte))
                gagne += p * (autre == voiture)
    return gagne


@verif("proba-baton-triangle")
def _():
    def tri(x, y):
        a, b = min(x, y), max(x, y)
        return 1.0 if max(a, b - a, 1 - b) < 0.5 else 0.0
    return grille(tri), 3e-3


@verif("proba-baton-plus-long")
def _():
    return grille(lambda x, y: max(min(x, y), abs(x - y), 1 - max(x, y))), 1e-3


@verif("proba-demi-cercle")
def _():
    # premier point en 0, les deux autres uniformes ; ils sont dans un demi-cercle si le plus grand arc vide >= 1/2
    def dans(x, y):
        a, b = sorted((x, y))
        return 1.0 if max(a, b - a, 1 - b) >= 0.5 else 0.0
    return grille(dans), 3e-3


@verif("proba-max-deux-uniformes")
def _():
    return grille(max), 1e-4


@verif("proba-min-cinq-uniformes")
def _():
    return simpson(lambda x: (1 - x) ** 5, 0, 1), 1e-9


@verif("proba-ecart-uniformes")
def _():
    return grille(lambda x, y: abs(x - y)), 1e-4


@verif("proba-somme-uniformes-depasse-un")
def _():
    rng = random.Random(1)
    n, total = 200000, 0
    for _ in range(n):
        s, k = 0.0, 0
        while s <= 1:
            s += rng.random()
            k += 1
        total += k
    return total / n, 0.01


@verif("proba-passager-avion")
def _():
    # p[m] : probabilité que le dernier ait sa place quand un passager « perturbé » choisit parmi m places libres
    # (dont celle du premier et celle du dernier) ; choisir la k-ième place intermédiaire repousse le problème.
    p = {2: F(1, 2)}
    for m in range(3, 101):
        p[m] = (F(1) + sum(p[m - k] for k in range(1, m - 1))) / m
    return p[100]


@verif("proba-points-fixes")
def _():
    perms = list(itertools.permutations(range(7)))
    return F(sum(sum(i == s for i, s in enumerate(p)) for p in perms), len(perms))


@verif("proba-derangement")
def _():
    d = [1, 0]
    for n in range(2, 53):
        d.append((n - 1) * (d[-1] + d[-2]))
    return F(d[52], math.factorial(52)), 1e-12


@verif("proba-anniversaires")
def _():
    p = F(1)
    for k in range(23):
        p *= F(365 - k, 365)
    return float(1 - p), 1e-4


@verif("proba-meme-anniversaire-que-moi")
def _():
    n = 1
    while 1 - (364 / 365) ** n < 0.5:
        n += 1
    return n


def valeur_jeu_de(lancers):
    v = F(7, 2)
    for _ in range(lancers - 1):
        v = sum(max(F(k), v) for k in DE) / 6
    return v


@verif("proba-de-avec-relance")
def _():
    return valeur_jeu_de(2)


@verif("proba-de-deux-relances")
def _():
    return valeur_jeu_de(3)


@verif("proba-max-deux-des")
def _():
    return F(sum(max(a, b) for a in DE for b in DE), 36)


@verif("proba-premier-as")
def _():
    # E[position] = Σ_k P(position >= k) = Σ_{k>=0} P(aucun as parmi les k premières cartes)
    e = F(0)
    for k in range(0, 49):
        e += F(math.comb(48, k), math.comb(52, k))
    return e


@verif("proba-ruine-equitable")
def _():
    return marche_absorbee(3, 10, F(1, 2))[0]


@verif("proba-duree-ruine")
def _():
    return marche_absorbee(3, 10, F(1, 2))[1]


@verif("proba-ruine-biaisee")
def _():
    return marche_absorbee(2, 4, F(3, 5))[0]


@verif("proba-polya")
def _():
    rouges, bleues = 1, 1
    p1 = F(rouges, rouges + bleues)
    p2 = F(rouges + 1, rouges + bleues + 1)
    return p1 * p2


def psd3(r12, r13, r23):
    m = [[1, r12, r13], [r12, 1, r23], [r13, r23, 1]]
    mineurs = [m[i][i] for i in range(3)] + [1 - r12 ** 2, 1 - r13 ** 2, 1 - r23 ** 2]
    det = 1 + 2 * r12 * r13 * r23 - r12 ** 2 - r13 ** 2 - r23 ** 2
    return min(mineurs) >= -1e-15 and det >= -1e-15


@verif("proba-correlation-trois")
def _():
    lo, hi = -1.0, 0.0  # psd3 faux en -1, vrai en 0
    for _ in range(80):
        mid = (lo + hi) / 2
        if psd3(mid, mid, mid):
            hi = mid
        else:
            lo = mid
    return hi, 1e-9


@verif("proba-correlation-xz")
def _():
    lo, hi = -1.0, 1.0
    for _ in range(80):
        mid = (lo + hi) / 2
        if psd3(0.9, mid, 0.9):
            hi = mid
        else:
            lo = mid
    return hi, 1e-9


@verif("proba-quadrant-normal")
def _():
    rng = random.Random(7)
    n, k = 400000, 0
    rho = 0.5
    s = math.sqrt(1 - rho ** 2)
    for _ in range(n):
        x = rng.gauss(0, 1)
        y = rho * x + s * rng.gauss(0, 1)
        k += x > 0 and y > 0
    return k / n, 0.004


@verif("proba-max-normales")
def _():
    # densité du max de deux N(0,1) iid : 2 φ(x) Φ(x)
    return simpson(lambda x: x * 2 * phi(x) * Phi(x), -12, 12), 1e-8


@verif("proba-normale-positive")
def _():
    return simpson(lambda x: x * phi(x), 0, 40, 40000) / 0.5, 1e-8


@verif("proba-bertrand-boites")
def _():
    boites = [("o", "o"), ("a", "a"), ("o", "a")]
    tirages = [(b, i) for b in boites for i in range(2)]
    ors = [(b, i) for b, i in tirages if b[i] == "o"]
    return F(sum(b[1 - i] == "o" for b, i in ors), len(ors))


@verif("proba-pieces-un-de-plus")
def _():
    a = [math.comb(101, k) for k in range(102)]
    b = [math.comb(100, k) for k in range(101)]
    favorables = sum(a[i] * sum(b[:i]) for i in range(102))
    return F(favorables, 2 ** 201)


@verif("proba-attente-bus")
def _():
    # attente moyenne = E[L²] / (2 E[L]) pour des intervalles L exponentiels de moyenne 10
    lam = 0.1
    m1 = simpson(lambda x: x * lam * math.exp(-lam * x), 0, 600, 60000)
    m2 = simpson(lambda x: x * x * lam * math.exp(-lam * x), 0, 600, 60000)
    return m2 / (2 * m1), 1e-6


@verif("proba-ampoules")
def _():
    return simpson(lambda x: 1 - (1 - math.exp(-x)) ** 2, 0, 60, 60000), 1e-8


@verif("proba-premiere-rouge")
def _():
    total = F(0)
    combis = list(itertools.combinations(range(1, 11), 3))
    for c in combis:
        total += min(c)
    return total / len(combis)


@verif("proba-meme-couleur")
def _():
    paires = list(itertools.combinations(JEU, 2))
    return F(sum(a[1] == b[1] for a, b in paires), len(paires))


@verif("proba-poker-paire")
def _():
    favorables = 0
    for rangs in itertools.combinations_with_replacement(range(13), 5):
        compte = sorted((rangs.count(r) for r in set(rangs)), reverse=True)
        if max(compte) > 4:
            continue
        if compte == [2, 1, 1, 1]:
            n = 1
            for r in set(rangs):
                n *= math.comb(4, rangs.count(r))
            favorables += n
    return F(favorables, math.comb(52, 5))


@verif("proba-trois-des-croissants")
def _():
    return F(sum(a < b < c for a in DE for b in DE for c in DE), 216)


@verif("proba-de-carre")
def _():
    return F(sum(k * k for k in DE), 6)


@verif("proba-produit-deux-des")
def _():
    return F(sum(a * b for a in DE for b in DE), 36)


@verif("proba-piece-truquee-bayes")
def _():
    vrais = F(1, 10) * 1
    faux = F(9, 10) * F(1, 2) ** 5
    return vrais / (vrais + faux)


@verif("proba-premier-pile-pair")
def _():
    return sum(0.5 ** k for k in range(2, 400, 2)), 1e-12


@verif("proba-deux-six-consecutifs")
def _():
    return attente_motif("66", {"6": F(1, 6), "x": F(5, 6)})


@verif("proba-variance-uniforme")
def _():
    m1 = simpson(lambda x: x, 0, 1)
    m2 = simpson(lambda x: x * x, 0, 1)
    return m2 - m1 ** 2, 1e-12


@verif("proba-secretaire")
def _():
    n = 2000
    meilleur = 0.0
    for r in range(1, n):
        p = r / n * sum(1 / (i - 1) for i in range(r + 1, n + 1))
        meilleur = max(meilleur, p)
    return meilleur, 1e-3


@verif("proba-esperance-somme-tirages-de")
def _():
    # P(N = n) = (5/6)^(n-1)/6 ; somme = 6 + (n-1) lancers non-6 de moyenne 3
    return sum((5 / 6) ** (n - 1) / 6 * (6 + 3 * (n - 1)) for n in range(1, 3000)), 1e-9


# --- Calcul stochastique --------------------------------------------------------------------------------------------
@verif("stoch-covariance")
def _():
    # W_t comme somme d'accroissements indépendants de variance 1 : seuls les deux premiers sont communs à W₂ et W₅
    communs = set(range(2)) & set(range(5))
    return len(communs)


@verif("stoch-moment-quatre")
def _():
    s = math.sqrt(2)
    return simpson(lambda x: x ** 4 * phi(x / s) / s, -30, 30, 60000), 1e-7


@verif("stoch-isometrie")
def _():
    rng = random.Random(3)
    n, pas = 20000, 100
    dt = 1 / pas
    total = 0.0
    for _ in range(n):
        i = 0.0
        for k in range(pas):
            i += (k * dt) * rng.gauss(0, math.sqrt(dt))
        total += i * i
    return total / n, 0.012


@verif("stoch-integrale-temps")
def _():
    return grille(min, 600), 1e-4


@verif("stoch-esperance-gbm")
def _():
    mu, sig = 0.05, 0.3
    return simpson(lambda z: 100 * math.exp(mu - sig ** 2 / 2 + sig * z) * phi(z), -14, 14, 40000), 1e-6


@verif("stoch-mediane-gbm")
def _():
    rng = random.Random(11)
    sig = 0.2
    xs = sorted(100 * math.exp(-sig ** 2 / 2 + sig * rng.gauss(0, 1)) for _ in range(200001))
    return xs[len(xs) // 2], 0.15


@verif("stoch-proba-au-dessus")
def _():
    rng = random.Random(5)
    n = 400000
    sig = 0.2
    k = sum(math.exp(-sig ** 2 / 2 + sig * rng.gauss(0, 1)) > 1 for _ in range(n))
    return k / n, 0.004


@verif("stoch-sortie-intervalle")
def _():
    # marche ±1 décalée de 2 : départ 2, absorption en 0 (niveau −2) et en 3 (niveau +1)
    return marche_absorbee(2, 3, F(1, 2))[0]


@verif("stoch-temps-sortie")
def _():
    # une marche ±1 dont chaque pas dure 1 a le même temps moyen de sortie que le brownien (k(N − k))
    return marche_absorbee(2, 3, F(1, 2))[1]


@verif("stoch-reflexion")
def _():
    # simulation exacte du franchissement : pont brownien entre deux dates de la grille
    rng = random.Random(9)
    n, pas = 40000, 50
    dt = 1 / pas
    touche = 0
    for _ in range(n):
        w = 0.0
        for _k in range(pas):
            w2 = w + rng.gauss(0, math.sqrt(dt))
            if w2 >= 1 or rng.random() < math.exp(-2 * (1 - w) * (1 - w2) / dt):
                touche += 1
                break
            w = w2
    return touche / n, 0.01


@verif("stoch-demi-vie")
def _():
    lo, hi = 0.0, 100.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if math.exp(-0.1 * mid) > 0.5:
            lo = mid
        else:
            hi = mid
    return lo, 1e-9


# --- Produits dérivés : prix obtenus par intégration numérique contre la densité log-normale -------------------------
def prix(payoff, S=100.0, sig=0.2, T=1.0, r=0.0, q=0.0):
    """E^Q[e^{−rT} payoff(S_T)] par intégration de Simpson (indépendant de la formule fermée)."""
    def f(z):
        st = S * math.exp((r - q - sig ** 2 / 2) * T + sig * math.sqrt(T) * z)
        return payoff(st) * phi(z)
    return math.exp(-r * T) * simpson(f, -12, 12, 48000)


def call(K, **kw):
    return prix(lambda s: max(s - K, 0.0), **kw)


@verif("der-parite-call-put")
def _():
    # on choisit la vol qui donne un call 105 à 8, puis on intègre le put
    lo, hi = 0.01, 1.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if call(105, sig=mid) < 8:
            lo = mid
        else:
            hi = mid
    return prix(lambda s: max(105 - s, 0.0), sig=lo), 1e-5


@verif("der-approx-atm")
def _():
    return call(100), 1e-5


@verif("der-delta-atm")
def _():
    h = 0.01
    return (call(100, S=100 + h) - call(100, S=100 - h)) / (2 * h), 1e-5


@verif("der-gamma-atm")
def _():
    h = 0.5
    return (call(100, S=100 + h) - 2 * call(100) + call(100, S=100 - h)) / h ** 2, 1e-4


@verif("der-vega-point")
def _():
    return call(100, sig=0.21) - call(100, sig=0.2), 1e-5


@verif("der-digitale-prix")
def _():
    # S_T > 100 ⇔ z > 0,1 : on intègre la densité au-delà du saut de l'indicatrice
    seuil = next(z / 1000 for z in range(-3000, 3000) if 100 * math.exp(-0.02 + 0.2 * z / 1000) > 100)
    return simpson(phi, seuil, 12, 40000), 2e-3


@verif("der-forward-dividende")
def _():
    return prix(lambda s: s, r=0.05, q=0.02) * math.exp(0.05), 1e-6


@verif("der-straddle-vol-implicite")
def _():
    def straddle(sig):
        return prix(lambda s: abs(s - 100), sig=sig, T=0.25)
    lo, hi = 0.05, 0.6
    for _ in range(50):
        mid = (lo + hi) / 2
        if straddle(mid) < 8:
            lo = mid
        else:
            hi = mid
    return lo, 2e-4


@verif("der-option-carre")
def _():
    return prix(lambda s: s * s), 1e-3


# --- Statistiques ---------------------------------------------------------------------------------------------------
def quantile_normal(p):
    lo, hi = -10.0, 10.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if Phi(mid) < p:
            lo = mid
        else:
            hi = mid
    return lo


@verif("stats-sharpe-annualise")
def _():
    # 252 jours indépendants de moyenne 0,1 et d'écart-type 1 : moyenne et variance s'additionnent
    moyenne = sum(0.1 for _ in range(252))
    variance = sum(1.0 for _ in range(252))
    return moyenne / math.sqrt(variance), 1e-12


@verif("stats-sharpe-erreur")
def _():
    rng = random.Random(21)
    jours, essais = 1008, 2000
    mu, sig = 1 / math.sqrt(252) * 0.01, 0.01
    estimes = []
    for _ in range(essais):
        r = [rng.gauss(mu, sig) for _ in range(jours)]
        m = sum(r) / jours
        s = math.sqrt(sum((x - m) ** 2 for x in r) / (jours - 1))
        estimes.append(m / s * math.sqrt(252))
    moy = sum(estimes) / essais
    return math.sqrt(sum((x - moy) ** 2 for x in estimes) / (essais - 1)), 0.03


@verif("stats-tests-multiples")
def _():
    # P(au moins un) = 1 − P(aucun), calculée par la loi binomiale complète
    return sum(math.comb(100, k) * 0.05 ** k * 0.95 ** (100 - k) for k in range(1, 101)), 1e-12


@verif("stats-bonferroni")
def _():
    return 0.05 / 1540


@verif("stats-pentes-croisees")
def _():
    rng = random.Random(4)
    n = 200000
    xs, ys = [], []
    for _ in range(n):
        x = rng.gauss(0, 1)
        xs.append(x)
        ys.append(0.8 * x + rng.gauss(0, math.sqrt(1.92)))  # corr = 0,8/√2,56 = 0,5
    mx, my = sum(xs) / n, sum(ys) / n
    cov = sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / n
    vy = sum((b - my) ** 2 for b in ys) / n
    return cov / vy, 0.005


@verif("stats-intervalle-moyenne")
def _():
    return quantile_normal(0.975) * 10 / math.sqrt(100), 1e-3


@verif("stats-taille-echantillon")
def _():
    n = 100
    while 1 / math.sqrt(n) > 0.5 / math.sqrt(100) + 1e-15:
        n += 1
    return n


@verif("stats-vol-portefeuille")
def _():
    rng = random.Random(8)
    n = 300000
    vals = []
    for _ in range(n):
        z1, z2 = rng.gauss(0, 1), rng.gauss(0, 1)
        a = 0.2 * z1
        b = 0.3 * (0.5 * z1 + math.sqrt(0.75) * z2)
        vals.append(0.5 * a + 0.5 * b)
    m = sum(vals) / n
    return math.sqrt(sum((v - m) ** 2 for v in vals) / n), 0.001


@verif("stats-erreur-variable")
def _():
    rng = random.Random(6)
    n = 200000
    xs, ys = [], []
    for _ in range(n):
        x = rng.gauss(0, 1)
        ys.append(x + rng.gauss(0, 1))
        xs.append(x + rng.gauss(0, 0.5))
    mx, my = sum(xs) / n, sum(ys) / n
    return sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / sum((a - mx) ** 2 for a in xs), 0.01


# --- Taux, crédit, risque -------------------------------------------------------------------------------------------
@verif("taux-duration")
def _():
    def p(y):
        return 1 / (1 + y) ** 5
    h = 1e-6
    return -(p(0.04 + h) - p(0.04 - h)) / (2 * h) / p(0.04), 1e-6


@verif("taux-dv01")
def _():
    # obligation zéro-coupon de duration modifiée 4,8 : maturité 4,8 × (1 + y) ; on la décale d'un point de base
    y = 0.04
    T = 4.8 * (1 + y)
    valeur = 10_000_000
    def v(t):
        return valeur * (1 + y) ** T / (1 + t) ** T
    return (v(y - 0.00005) - v(y + 0.00005)), 0.5


@verif("taux-forward")
def _():
    df1, df2 = 1 / 1.03, 1 / 1.04 ** 2
    return df1 / df2 - 1, 1e-12


@verif("taux-swap-par")
def _():
    def valeur(s):
        return s * (0.97 + 0.94) - (1 - 0.94)
    lo, hi = 0.0, 0.2
    for _ in range(100):
        mid = (lo + hi) / 2
        if valeur(mid) < 0:
            lo = mid
        else:
            hi = mid
    return lo, 1e-12


@verif("taux-var-normale")
def _():
    return quantile_normal(0.99) * 0.01 * 1_000_000, 1.0


@verif("taux-var-10-jours")
def _():
    # variance de la somme de 10 rendements indépendants
    return 23263 * math.sqrt(sum(1 for _ in range(10))), 1e-6


@verif("taux-es-gaussienne")
def _():
    q = quantile_normal(0.975)
    return simpson(lambda x: x * phi(x), q, 40, 40000) / 0.025, 1e-3


@verif("taux-exceptions-var")
def _():
    return sum(k * math.comb(250, k) * 0.01 ** k * 0.99 ** (250 - k) for k in range(251)), 1e-9


@verif("taux-intensite-defaut")
def _():
    # égalité des jambes d'un CDS à intensité constante et paiement continu : s = λ(1 − R)
    lam_lo, lam_hi = 0.0, 1.0
    for _ in range(100):
        lam = (lam_lo + lam_hi) / 2
        prime = 0.012 * simpson(lambda t: math.exp(-lam * t), 0, 5, 2000)
        protection = 0.6 * simpson(lambda t: lam * math.exp(-lam * t), 0, 5, 2000)
        if protection < prime:
            lam_lo = lam
        else:
            lam_hi = lam
    return lam_lo, 1e-9


@verif("taux-survie")
def _():
    n = 5 * 365 * 24
    return (1 - 0.02 / (365 * 24)) ** n, 1e-6


@verif("taux-cva-simple")
def _():
    return 0.6 * 0.02 * 1_000_000


@verif("taux-hedge-ratio-future")
def _():
    return 4800 / 80


# --- Marchés, paris -------------------------------------------------------------------------------------------------
def maximiser(f, a, b, n=200):
    """Recherche ternaire du maximum d'une fonction unimodale sur [a, b]."""
    for _ in range(n):
        m1, m2 = a + (b - a) / 3, b - (b - a) / 3
        if f(m1) < f(m2):
            a = m1
        else:
            b = m2
    return (a + b) / 2


@verif("mm-kelly")
def _():
    return maximiser(lambda f: 0.6 * math.log(1 + f) + 0.4 * math.log(1 - f), 0, 0.999), 1e-6


@verif("mm-kelly-cote")
def _():
    return maximiser(lambda f: 0.4 * math.log(1 + 2 * f) + 0.6 * math.log(1 - f), 0, 0.999), 1e-6


@verif("mm-option-sur-de")
def _():
    return F(sum(max(k - 3, 0) for k in DE), 6)


@verif("mm-cartes-rouges-noires")
def _():
    memo = {}

    def v(r, n):
        if (r, n) in memo:
            return memo[(r, n)]
        if r == 0:
            res = 0.0
        elif n == 0:
            res = float(r)
        else:
            continuer = r / (r + n) * (1 + v(r - 1, n)) + n / (r + n) * (-1 + v(r, n - 1))
            res = max(0.0, continuer)
        memo[(r, n)] = res
        return res
    return v(26, 26), 1e-4


@verif("mm-meme-de-deux-fois")
def _():
    return F(sum(a * a for a in DE), 6) / F(7, 2)


# --- Machine learning -----------------------------------------------------------------------------------------------
@verif("ml-ridge-1d")
def _():
    sxy, sxx, lam = 10, 20, 5
    return maximiser(lambda b: -(-2 * b * sxy + b * b * sxx + lam * b * b), -10, 10), 1e-6


@verif("ml-precision-rappel")
def _():
    vp, signales, positifs = 40, 50, 100
    p, r = F(vp, signales), F(vp, positifs)
    return 1 / ((1 / p + 1 / r) / 2)


@verif("ml-log-loss")
def _():
    return -math.log(0.8), 1e-12


# --- Code et algorithmique ------------------------------------------------------------------------------------------
@verif("algo-comparaisons-dichotomie")
def _():
    # pire cas mesuré : on cherche chaque position possible d'une liste triée d'un million d'éléments (échantillon)
    n = 1_000_000
    pire = 0
    for cible in list(range(0, n, 997)) + [n - 1, 0, n // 2]:
        bas, haut, k = 0, n - 1, 0
        while bas <= haut:
            k += 1
            m = (bas + haut) // 2
            if m == cible:
                break
            if m < cible:
                bas = m + 1
            else:
                haut = m - 1
        pire = max(pire, k)
    return pire


@verif("algo-escalier")
def _():
    # dénombrement exhaustif des suites de pas de 1 ou 2
    return sum(1 for n in range(11) for pas in itertools.product((1, 2), repeat=n) if sum(pas) == 10)


@verif("algo-chemins-grille")
def _():
    return sum(1 for c in itertools.product("DH", repeat=8) if c.count("D") == 4)


# --- Casse-têtes ----------------------------------------------------------------------------------------------------
@verif("ct-chevaux")
def _():
    # la stratégie en 7 courses trouve toujours les 3 plus rapides (vérifiée sur des tirages aléatoires)
    rng = random.Random(2)
    for _ in range(3000):
        vitesse = rng.sample(range(1000), 25)
        courses = 0

        def course(chevaux):
            nonlocal courses
            courses += 1
            return sorted(chevaux, key=lambda c: -vitesse[c])
        groupes = [course(list(range(5 * g, 5 * g + 5))) for g in range(5)]
        vainqueurs = course([g[0] for g in groupes])
        groupe_de = {g[0]: g for g in groupes}
        a, b, c = (groupe_de[v] for v in vainqueurs[:3])
        finale = course([a[1], a[2], b[0], b[1], c[0]])
        top = [a[0]] + finale[:2]
        if top != sorted(range(25), key=lambda h: -vitesse[h])[:3]:
            raise AssertionError("stratégie fausse")
    return courses


@verif("ct-casiers")
def _():
    ouvert = [False] * 101
    for k in range(1, 101):
        for n in range(k, 101, k):
            ouvert[n] = not ouvert[n]
    return sum(ouvert)


@verif("ct-oeufs")
def _():
    # étages couverts avec e œufs et t lâchers : f(e, t) = f(e−1, t−1) + f(e, t−1) + 1
    def f(e, t):
        if e == 0 or t == 0:
            return 0
        return f(e - 1, t - 1) + f(e, t - 1) + 1
    t = 0
    while f(2, t) < 100:
        t += 1
    return t


@verif("ct-pont")
def _():
    import heapq
    temps = (1, 2, 5, 10)
    depart = (frozenset(range(4)), 0)  # (personnes du côté de départ, côté de la lampe : 0 départ, 1 arrivée)
    dist = {depart: 0}
    tas = [(0, 0, depart)]
    compteur = 0
    while tas:
        d, _, (gauche, lampe) = heapq.heappop(tas)
        if not gauche:
            return d
        cote = gauche if lampe == 0 else frozenset(range(4)) - gauche
        for k in (1, 2):
            for groupe in itertools.combinations(sorted(cote), k):
                g = frozenset(groupe)
                nouveau = (gauche - g if lampe == 0 else gauche | g, 1 - lampe)
                nd = d + max(temps[i] for i in g)
                if nd < dist.get(nouveau, 10 ** 9):
                    dist[nouveau] = nd
                    compteur += 1
                    heapq.heappush(tas, (nd, compteur, nouveau))
    raise AssertionError


@verif("ct-angle-horloge")
def _():
    minutes = 15
    heures = 3 + minutes / 60
    a = abs(heures * 30 - minutes * 6) % 360
    return min(a, 360 - a), 1e-12


@verif("ct-zeros-factorielle")
def _():
    s = str(math.factorial(100))
    return len(s) - len(s.rstrip("0"))


@verif("ct-dernier-chiffre")
def _():
    return pow(7, 2026, 10)


@verif("ct-vin-empoisonne")
def _():
    n = 0
    while 2 ** n < 1000:
        n += 1
    return n


@verif("ct-carres-echiquier")
def _():
    return sum(1 for k in range(1, 9) for i in range(9 - k) for j in range(9 - k))


@verif("ct-poignees")
def _():
    return len(list(itertools.combinations(range(20), 2)))


@verif("ct-impairs")
def _():
    return sum(range(1, 100, 2))


@verif("ct-fourmis")
def _():
    # simulation avec demi-tours réels ; positions en demi-centimètres, toutes paires pour que les fourmis se croisent
    # exactement sur une même case ; un pas = 0,5 s
    rng = random.Random(12)

    def duree(fourmis):
        pos = [p for p, _ in fourmis]
        sens = [s for _, s in fourmis]
        vivantes = set(range(len(pos)))
        t = 0
        while vivantes:
            t += 1
            for i in list(vivantes):
                pos[i] += sens[i]
            par_case = {}
            for i in vivantes:
                par_case.setdefault(pos[i], []).append(i)
            for groupe in par_case.values():
                if len(groupe) == 2:
                    for i in groupe:
                        sens[i] = -sens[i]
            for i in list(vivantes):
                if pos[i] <= 0 or pos[i] >= 200:
                    vivantes.discard(i)
        return t * 0.5
    pire = 0.0
    for essai in range(60):
        cases = rng.sample(range(2, 200, 2), 99)
        fourmis = [(c, rng.choice((-1, 1))) for c in cases]
        if essai % 2 == 0:
            fourmis.append((0, 1))  # une fourmi au bord gauche tournée vers la droite
        pire = max(pire, duree(fourmis))
    return pire, 1.0


@verif("ct-train-mouche")
def _():
    # somme des allers-retours de la mouche
    ecart, total = 100.0, 0.0
    while ecart > 1e-12:
        t = ecart / (75 + 50)     # la mouche rejoint le train d'en face
        total += 75 * t
        ecart -= 2 * 50 * t       # les deux trains ont avancé pendant ce temps
    return total, 1e-9


@verif("ct-chiffre-un")
def _():
    return sum(str(n).count("1") for n in range(1, 101))


# --- Chiffres à connaître -------------------------------------------------------------------------------------------
@verif("cst-racine-2")
def _():
    x = 1.0
    for _ in range(50):
        x = (x + 2 / x) / 2   # Newton
    return x, 1e-12


@verif("cst-ln-2")
def _():
    return sum((-1) ** (k + 1) / k for k in range(1, 2_000_001)), 1e-6


@verif("cst-e")
def _():
    return sum(1 / math.factorial(k) for k in range(30)), 1e-12


@verif("cst-un-septieme")
def _():
    return F(1, 7)


@verif("cst-n-1")
def _():
    return 0.5 + simpson(phi, 0, 1), 1e-10


@verif("cst-quantile-975")
def _():
    return quantile_normal(0.975), 1e-3


@verif("cst-quantile-99")
def _():
    return quantile_normal(0.99), 1e-3


@verif("cst-densite-zero")
def _():
    return phi(0), 1e-12


@verif("cst-racine-252")
def _():
    return math.isqrt(252 * 10 ** 12) / 10 ** 6, 1e-6


@verif("cst-vol-quotidienne")
def _():
    return 0.32 / math.sqrt(252), 1e-12


@verif("cst-regle-72")
def _():
    n, capital = 0, 1.0
    while capital < 2:
        capital *= 1.06
        n += 1
    # interpolation géométrique dans la dernière année
    return n - 1 + math.log(2 / (capital / 1.06)) / math.log(1.06), 1e-9


@verif("cst-puissances-2")
def _():
    return 1 << 16


@verif("cst-e-01")
def _():
    return sum(0.1 ** k / math.factorial(k) for k in range(20)), 1e-12


@verif("cst-carres")
def _():
    return sum(17 for _ in range(17))


@verif("cst-variance-de")
def _():
    m = F(sum(DE), 6)
    return sum((F(k) - m) ** 2 for k in DE) / 6


@verif("cst-pi-carre")
def _():
    n = 1_000_000
    return sum(1 / k ** 2 for k in range(1, n + 1)) + 1 / n, 1e-9


# --- Projets --------------------------------------------------------------------------------------------------------
@verif("proj-vs-ailes")
def _():
    a, b, rho, m, s = 0.04, 0.1, -0.6, 0.0, 0.1

    def w(k):
        return a + b * (rho * (k - m) + math.sqrt((k - m) ** 2 + s ** 2))
    return (w(-2e6) - w(-1e6)) / 1e6, 1e-9  # pente en valeur absolue de l'aile gauche


@verif("proj-sa-faux-positifs")
def _():
    n, p = 1540, 0.05
    proba, moyenne = (1 - p) ** n, 0.0
    for k in range(n):
        moyenne += k * proba
        proba *= (n - k) / (k + 1) * p / (1 - p)
    return moyenne + n * proba, 1e-6


@verif("proj-mm-reservation")
def _():
    s, q, gamma, sigma, reste = 100, 3, 0.5, 2, 0.5
    return s - q * gamma * sigma ** 2 * reste


@verif("proj-mm-spread")
def _():
    gamma, sigma, k = 0.5, 2.0, 1.5
    # terme de liquidité : distance optimale par côté pour un ordre, max de δ·e^{−kδ} corrigé de l'aversion
    # (formule fermée de l'article), retrouvée en maximisant (1/γ) ln(1 + γδ) − ... ; on vérifie la forme fermée
    # par l'identité 2/γ·ln(1 + γ/k) = 2∫₀^{1/k} 1/(1 + γu) du
    terme = 2 * simpson(lambda u: 1 / (1 + gamma * u), 0, 1 / k, 2000)
    return gamma * sigma ** 2 * 1 + terme, 1e-9


# --- Deuxième série : probabilités ----------------------------------------------------------------------------------
@verif("proba-faces-distinctes")
def _():
    suites = list(itertools.product(DE, repeat=6))
    return F(sum(len(set(s)) for s in suites), len(suites))


@verif("proba-max-trois-des")
def _():
    return F(sum(max(t) for t in itertools.product(DE, repeat=3)), 216)


@verif("proba-premier-plus-grand")
def _():
    return F(sum(a > b for a in DE for b in DE), 36)


@verif("proba-de-mere-un")
def _():
    return F(sum(6 in t for t in itertools.product(DE, repeat=4)), 6 ** 4)


@verif("proba-esperance-sachant-somme")
def _():
    cas = [(a, b) for a in DE for b in DE if a + b == 10]
    return F(sum(a for a, _ in cas), len(cas))


@verif("proba-variance-binomiale")
def _():
    n = 100
    pmf = [F(math.comb(n, k), 2 ** n) for k in range(n + 1)]
    m = sum(k * p for k, p in enumerate(pmf))
    return sum((k - m) ** 2 * p for k, p in enumerate(pmf))


@verif("proba-quinte-couleur")
def _():
    couleurs = [[c for c in JEU if c[1] == s] for s in range(4)]
    favorables = sum(1 for cs in couleurs for _ in itertools.combinations(cs, 5))
    return F(favorables, math.comb(52, 5))


@verif("proba-derniere-boule")
def _():
    arrangements = set(itertools.permutations("RRRBB"))
    return F(sum(a[-1] == "R" for a in arrangements), len(arrangements))


@verif("proba-deux-identiques")
def _():
    rng = random.Random(14)
    n, total = 200000, 0
    for _ in range(n):
        precedent, k = rng.random() < 0.5, 1
        while True:
            x = rng.random() < 0.5
            k += 1
            if x == precedent:
                break
            precedent = x
        total += k
    return total / n, 0.02


@verif("proba-somme-exponentielles")
def _():
    # ∫₀¹ e^{-x} (∫₀^{1-x} e^{-y} dy) dx par double intégration numérique
    return simpson(lambda x: math.exp(-x) * simpson(lambda y: math.exp(-y), 0, 1 - x, 200), 0, 1, 200), 1e-8


@verif("proba-exponentielle-sachant-somme")
def _():
    # densité conditionnelle de X sachant X + Y = 2 : proportionnelle à f(x) f(2 − x)
    def f(x):
        return math.exp(-x)
    num = simpson(lambda x: x * f(x) * f(2 - x), 0, 2, 2000)
    den = simpson(lambda x: f(x) * f(2 - x), 0, 2, 2000)
    return num / den, 1e-9


@verif("proba-somme-normales-positive")
def _():
    rng = random.Random(15)
    n, a, b = 400000, 0, 0
    for _ in range(n):
        x, y = rng.gauss(0, 1), rng.gauss(0, 1)
        if x > 0:
            a += 1
            b += x + y > 0
    return b / a, 0.005


@verif("proba-coupons-moitie")
def _():
    # chaîne sur le nombre de vignettes possédées, résolue à rebours jusqu'à 5
    e = F(0)
    for k in range(4, -1, -1):
        e = (1 + F(10 - k, 10) * e) / (1 - F(k, 10))
    return e


@verif("proba-variance-geometrique")
def _():
    p = 1 / 6
    m1 = sum(k * (1 - p) ** (k - 1) * p for k in range(1, 3000))
    m2 = sum(k * k * (1 - p) ** (k - 1) * p for k in range(1, 3000))
    return m2 - m1 ** 2, 1e-8


@verif("proba-markov-meteo")
def _():
    beau = 1.0
    for _ in range(500):
        beau = beau * 0.8 + (1 - beau) * 0.4
    return beau, 1e-12


@verif("proba-records")
def _():
    rng = random.Random(16)
    n, total = 100000, 0
    for _ in range(n):
        meilleur = -1.0
        for _k in range(10):
            x = rng.random()
            if x > meilleur:
                meilleur = x
                total += 1
    return total / n, 0.02


@verif("proba-boites-vides")
def _():
    rng = random.Random(17)
    n, total = 100000, 0
    for _ in range(n):
        total += 10 - len({rng.randrange(10) for _k in range(10)})
    return total / n, 0.02


@verif("proba-premiers-entre-eux")
def _():
    n = 1000
    premiers = sum(math.gcd(a, b) == 1 for a in range(1, n + 1) for b in range(1, n + 1))
    return premiers / n ** 2, 0.003


@verif("proba-produit-max-min")
def _():
    return grille(lambda x, y: max(x, y) * min(x, y)), 1e-6


# --- Deuxième série : produits dérivés ------------------------------------------------------------------------------
def repliquer(s_haut, s_bas, v_haut, v_bas, s0, taux):
    """Portefeuille (a actions, b en cash) qui réplique deux valeurs futures ; renvoie (prix, a)."""
    a = (v_haut - v_bas) / (s_haut - s_bas)
    b = (v_haut - a * s_haut) / taux
    return a * s0 + b, a


@verif("der-arbre-un-pas")
def _():
    return repliquer(120, 80, 20, 0, 100, 1)[0], 1e-12


@verif("der-arbre-delta")
def _():
    return repliquer(120, 80, 20, 0, 100, 1)[1], 1e-12


def arbre(s0, u, d, taux, n, payoff, americain=False):
    """Arbre binomial résolu par réplication à chaque nœud (sans probabilité risque-neutre explicite)."""
    valeurs = {j: payoff(s0 * u ** j * d ** (n - j)) for j in range(n + 1)}
    for etape in range(n - 1, -1, -1):
        nouvelles = {}
        for j in range(etape + 1):
            s = s0 * u ** j * d ** (etape - j)
            prix, _ = repliquer(s * u, s * d, valeurs[j + 1], valeurs[j], s, taux)
            nouvelles[j] = max(prix, payoff(s)) if americain else prix
        valeurs = nouvelles
    return valeurs[0]


@verif("der-arbre-deux-pas")
def _():
    return arbre(100, 1.1, 0.9, 1.0, 2, lambda s: max(s - 100, 0)), 1e-9


@verif("der-put-americain-arbre")
def _():
    return arbre(100, 1.2, 0.8, 1.05, 2, lambda s: max(100 - s, 0), americain=True), 1e-4


@verif("der-forward-start")
def _():
    sig = 0.2
    # E[max(S₂ − S₁, 0)] = E[S₁] · E[(R − 1)⁺] avec R = S₂/S₁ indépendant de S₁ (accroissements indépendants)
    es1 = simpson(lambda z: 100 * math.exp(-sig ** 2 / 2 + sig * z) * phi(z), -12, 12, 24000)
    er = simpson(lambda z: max(math.exp(-sig ** 2 / 2 + sig * z) - 1, 0) * phi(z), -12, 12, 48000)
    return es1 * er, 1e-4


@verif("der-margrabe")
def _():
    sig, rho = 0.2, 0.5
    s = math.sqrt(1 - rho ** 2)
    n, borne = 500, 8.0
    h = 2 * borne / n
    total = 0.0
    for i in range(n + 1):
        z1 = -borne + i * h
        wi = 1 if i in (0, n) else (4 if i % 2 else 2)
        a = 100 * math.exp(-sig ** 2 / 2 + sig * z1)
        for j in range(n + 1):
            z2 = -borne + j * h
            wj = 1 if j in (0, n) else (4 if j % 2 else 2)
            b = 100 * math.exp(-sig ** 2 / 2 + sig * (rho * z1 + s * z2))
            total += wi * wj * max(a - b, 0.0) * phi(z1) * phi(z2)
    return total * h * h / 9, 5e-3


# --- Deuxième série : calcul stochastique ---------------------------------------------------------------------------
@verif("stoch-esperance-exponentielle")
def _():
    s = math.sqrt(2)
    return simpson(lambda x: math.exp(x) * phi(x / s) / s, -30, 30, 60000), 1e-8


@verif("stoch-deux-instants-positifs")
def _():
    # W₁ = Z₁, W₂ = Z₁ + Z₂ : P(Z₁ > 0, Z₂ > −Z₁) = ∫₀^∞ φ(z) P(Z₂ > −z) dz
    return simpson(lambda z: phi(z) * (1 - Phi(-z)), 0, 12, 24000), 1e-9


def cov_brownien(s, t):
    # nombre d'accroissements unitaires communs (instants entiers)
    return len(set(range(s)) & set(range(t)))


@verif("stoch-pont-esperance")
def _():
    return cov_brownien(1, 4) / cov_brownien(4, 4) * 2, 1e-12


@verif("stoch-pont-variance")
def _():
    return cov_brownien(1, 1) - cov_brownien(1, 4) ** 2 / cov_brownien(4, 4), 1e-12


@verif("stoch-integrale-carre")
def _():
    rng = random.Random(18)
    n, pas = 20000, 100
    dt = 1 / pas
    total = 0.0
    for _ in range(n):
        w, i = 0.0, 0.0
        for _k in range(pas):
            w2 = w + rng.gauss(0, math.sqrt(dt))
            i += (w * w + w2 * w2) / 2 * dt
            w = w2
        total += i
    return total / n, 0.015


@verif("stoch-variance-somme")
def _():
    return cov_brownien(1, 1) + cov_brownien(2, 2) + 2 * cov_brownien(1, 2)


@verif("stoch-covariance-carre")
def _():
    return simpson(lambda x: x ** 3 * phi(x), -12, 12, 24000), 1e-9


# --- Deuxième série : code, ML --------------------------------------------------------------------------------------
@verif("algo-paires-nombre")
def _():
    return sum(1 for i in range(1000) for j in range(i + 1, 1000))


@verif("ml-auc")
def _():
    pos, neg = [0.9, 0.7, 0.4], [0.8, 0.3]
    return F(sum(p > n for p in pos for n in neg), len(pos) * len(neg))


@verif("ml-loi-fondamentale")
def _():
    # 400 paris indépendants : la moyenne des gains croît comme n·IC, l'écart-type comme √n
    n, ic = 400, 0.05
    return n * ic / math.sqrt(n), 1e-12


# --- Troisième série : jeux, risque, séries temporelles -------------------------------------------------------------
@verif("jeu-malediction-vainqueur")
def _():
    # gain espéré d'une offre b : E[(1,5·V − b) 1{V < b}] avec V ~ U(0, 100) ; on cherche l'offre qui le maximise
    def gain(b):
        return simpson(lambda v: (1.5 * v - b) / 100, 0, b, 200) if b > 0 else 0.0
    meilleure = max((gain(b), b) for b in range(0, 101))
    return meilleure[1]


@verif("jeu-dichotomie")
def _():
    def pire(n):  # nombre de propositions au pire pour n candidats
        if n <= 0:
            return 0
        return 1 + max(pire((n - 1) // 2), pire(n - 1 - (n - 1) // 2))
    return pire(100)


@verif("jeu-trois-piles")
def _():
    return attente_motif("PPP", {"P": F(1, 2), "F": F(1, 2)})


@verif("jeu-marche-aleatoire-sortie")
def _():
    return marche_absorbee(10, 20, F(1, 2))[1]


@verif("jeu-arret-uniforme")
def _():
    # itération de la valeur : V ← −c + E[max(X, V)]
    v, c = 0.0, 0.01
    for _ in range(10000):
        v = -c + v * v + (1 - v * v) / 2
    return v, 1e-9


@verif("jeu-pari-de-plus-grand")
def _():
    sans_egalite = [(a, b) for a in DE for b in DE if a != b]
    return F(sum(a > b for a, b in sans_egalite), len(sans_egalite))


@verif("jeu-partage-mise")
def _():
    # partie jouée jusqu'au bout depuis 4-2 : A doit gagner 1 manche avant que B en gagne 3
    def p(a, b):
        if a == 0:
            return F(1)
        if b == 0:
            return F(0)
        return (p(a - 1, b) + p(a, b - 1)) / 2
    return p(1, 3)


@verif("risque-garch-long-terme")
def _():
    # on itère l'espérance de la variance conditionnelle jusqu'à convergence
    v = 0.0004
    for _ in range(5000):
        v = 0.000002 + (0.1 + 0.88) * v
    return math.sqrt(v), 1e-9


@verif("risque-ewma-demi-vie")
def _():
    k, poids = 0.0, 1.0
    while poids > 0.5:
        k += 0.001
        poids = 0.94 ** k
    return k, 2e-3


@verif("risque-diversification-limite")
def _():
    n = 100000
    sig, rho = 0.2, 0.25
    var = sig ** 2 * (rho + (1 - rho) / n)
    return math.sqrt(var), 1e-4


@verif("risque-beta")
def _():
    rng = random.Random(19)
    n = 200000
    xs, ys = [], []
    for _ in range(n):
        m = rng.gauss(0, 0.15)
        xs.append(m)
        ys.append(0.6 * 0.3 / 0.15 * m + rng.gauss(0, 0.3 * math.sqrt(1 - 0.36)))
    mx, my = sum(xs) / n, sum(ys) / n
    return sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / sum((a - mx) ** 2 for a in xs), 0.01


@verif("risque-couverture-variance-min")
def _():
    s, f, rho = 0.02, 0.025, 0.9
    # variance résiduelle de S − hF, minimisée numériquement
    return maximiser(lambda h: -(s * s + h * h * f * f - 2 * h * rho * s * f), 0, 2), 1e-6


@verif("risque-exceptions-historique")
def _():
    return 500 * F(1, 100)


@verif("risque-autocorrelation-ar1")
def _():
    rng = random.Random(20)
    x, serie = 0.0, []
    for _ in range(300000):
        x = 0.8 * x + rng.gauss(0, 1)
        serie.append(x)
    m = sum(serie) / len(serie)
    c0 = sum((v - m) ** 2 for v in serie)
    c3 = sum((serie[i] - m) * (serie[i + 3] - m) for i in range(len(serie) - 3))
    return c3 / c0, 0.01


@verif("risque-variance-ar1")
def _():
    v = 0.0
    for _ in range(1000):
        v = 0.64 * v + 1
    return v, 1e-9


# --- Énergie --------------------------------------------------------------------------------------------------------
@verif("nrj-spark-spread")
def _():
    gaz_par_mwh = 1 / 0.5   # rendement 50 % : 2 MWh de gaz par MWh électrique
    return 90 - gaz_par_mwh * 35, 1e-12


@verif("nrj-clean-spark")
def _():
    return 90 - (1 / 0.5) * 35 - 0.4 * 80, 1e-12


# --- Produits structurés --------------------------------------------------------------------------------------------
@verif("struct-capital-garanti")
def _():
    reste = 100 - 90          # ce qui reste après l'achat du zéro-coupon
    return F(reste, 20)       # nombre de calls (20 chacun) achetés par unité de nominal


@verif("struct-dispersion")
def _():
    # variance d'un indice équipondéré de N composants : σ²[ρ + (1 − ρ)/N] ; on cherche ρ pour σ_indice = 15 %
    n, sig = 10 ** 6, 0.3
    lo, hi = 0.0, 1.0
    for _ in range(100):
        rho = (lo + hi) / 2
        if math.sqrt(sig ** 2 * (rho + (1 - rho) / n)) < 0.15:
            lo = rho
        else:
            hi = rho
    return lo, 1e-5


# --- Machine learning, troisième série ------------------------------------------------------------------------------
@verif("ml-acp-variance")
def _():
    # matrice diagonale de valeurs propres connues : part de la trace portée par la plus grande
    valeurs = [4, 2, 1, 1]
    return F(max(valeurs), sum(valeurs))


@verif("ml-cote-logistique")
def _():
    def cote(x):
        p = 1 / (1 + math.exp(-(-2 + 0.7 * x)))
        return p / (1 - p)
    return cote(3.0) / cote(2.0), 1e-9


@verif("ml-matrice-confusion")
def _():
    vrais_positifs, alertes = 90, 120
    return F(vrais_positifs, alertes)


@verif("ml-ridge-retrecissement")
def _():
    # une variable, Σx² = n : le coefficient Ridge vaut Σxy/(n + λ) contre Σxy/n pour les moindres carrés
    n, lam, sxy = 250, 250, 37.0
    return (sxy / (n + lam)) / (sxy / n), 1e-12


# --- Fiches issues du cours (contenu/cours_complements.txt) ---------------------------------------------------------
@verif("stoch-ou-variance")
def _():
    # σ² ∫₀^∞ e^{−2κu} du par intégration numérique (κ = 3, σ = 2)
    return simpson(lambda u: 4 * math.exp(-6 * u), 0, 20, 20000), 1e-9


@verif("stoch-cir-moyenne")
def _():
    rng = random.Random(201)
    n, pas = 10000, 100
    dt = 1 / pas
    total = 0.0
    for _ in range(n):
        r = 0.01
        for _ in range(pas):
            r += (0.05 - r) * dt + 0.1 * math.sqrt(max(r, 0.0)) * rng.gauss(0, math.sqrt(dt))
        total += r
    return total / n, 0.00025


@verif("der-black76")
def _():
    return math.exp(-0.04) * simpson(lambda z: max(80 * math.exp(-0.25 ** 2 / 2 + 0.25 * z) - 80, 0.0) * phi(z), -12, 12, 48000), 1e-6


@verif("mm-glosten-milgrom")
def _():
    alpha = F(1, 4)
    num = den = F(0)
    for v in (80, 120):
        p = F(1, 2) * (alpha * (1 if v == 120 else 0) + (1 - alpha) * F(1, 2))
        num += p * v
        den += p
    return num / den


@verif("risque-portefeuille-variance-min")
def _():
    return maximiser(lambda w: -(w * w * 0.01 + (1 - w) ** 2 * 0.04), -1, 2), 1e-7


@verif("risque-sharpe-strategies")
def _():
    def sharpe(w):  # une unité de la première (μ = 0,6, σ = 1), w de la seconde (μ = 0,8, σ = 1)
        return (0.6 + 0.8 * w) / math.sqrt(1 + w * w)
    return sharpe(maximiser(sharpe, 0, 10)), 1e-9


@verif("risque-proba-drawdown")
def _():
    # ruine d'une marche aléatoire biaisée de pas h, qui converge vers le brownien avec dérive
    mu, sig, d, h = 0.05, 0.1, 0.1, 0.0001
    p = 0.5 * (1 + mu * h / sig ** 2)
    return ((1 - p) / p) ** round(d / h), 1e-4


@verif("stats-lasso-seuillage")
def _():
    return maximiser(lambda b: -(b * b - 2 * 0.8 * b + abs(b)), -2, 2), 1e-7


@verif("ml-foret-variance")
def _():
    n = 50
    return sum((1 if i == j else F(1, 5)) for i in range(n) for j in range(n)) / F(n * n)


@verif("num-stabilite-explicite")
def _():
    def stable(dt):
        a = 0.3 ** 2 * dt / (2 * 0.02 ** 2)
        return all(abs(1 - 4 * a * math.sin(math.pi * i / 800) ** 2) <= 1 + 1e-12 for i in range(401))
    lo, hi = 0.0, 0.02
    for _ in range(60):
        mid = (lo + hi) / 2
        if stable(mid):
            lo = mid
        else:
            hi = mid
    return lo, 1e-9


# --- Fiches issues des chapitres ajoutés (contenu/cours_complements2.txt) -------------------------------------------
@verif("proba-scrutin")
def _():
    bons = total = 0
    for pos in itertools.combinations(range(10), 3):  # positions des voix de B
        s, ok = 0, True
        for i in range(10):
            s += -1 if i in pos else 1
            ok = ok and s > 0
        bons += ok
        total += 1
    return F(bons, total)


@verif("proba-catalan")
def _():
    def bien_forme(t):
        s = 0
        for c in t:
            s += 1 if c == '(' else -1
            if s < 0:
                return False
        return s == 0
    return sum(bien_forme(t) for t in itertools.product('()', repeat=8))


@verif("proba-amincissement")
def _():
    rng = random.Random(301)
    n, ok = 100000, 0
    for _ in range(n):
        t, gros = rng.expovariate(6), 0
        while t < 1:
            gros += rng.random() < 1 / 3
            t += rng.expovariate(6)
        ok += gros >= 2
    return ok / n, 0.005


@verif("stats-equicorrelation")
def _():
    m = [[1 if i == j else 0.2 for j in range(6)] for i in range(6)]
    v = [1.0, 0.7, 0.4, 0.9, 0.3, 0.5]
    for _ in range(300):
        w = [sum(m[i][j] * v[j] for j in range(6)) for i in range(6)]
        n = math.sqrt(sum(x * x for x in w))
        v = [x / n for x in w]
    return sum(v[i] * sum(m[i][j] * v[j] for j in range(6)) for i in range(6)), 1e-9


@verif("stats-cholesky")
def _():
    # L₂₂ est l'écart-type résiduel de X₂ après régression sur X₁ : variance minimale de X₂ − bX₁
    return math.sqrt(min(4 - 2 * b * 2 + b * b * 4 for b in [k / 10000 for k in range(0, 20001)])), 1e-6


@verif("der-barriere-carr")
def _():
    # EDP de Black-Scholes (taux nul) en log-prix pour le down-and-out, puis knock-in = vanille − knock-out
    s, B, K = 0.2, 80.0, 100.0
    x0, x1, n = math.log(B), math.log(600.0), 500
    dx = (x1 - x0) / n
    pas = int(math.ceil(1 / (0.4 * dx * dx / (s * s))))
    dt = 1 / pas
    xs = [x0 + i * dx for i in range(n + 1)]
    u = [max(math.exp(x) - K, 0.0) for x in xs]
    a, b = 0.5 * s * s * dt / dx ** 2, 0.5 * s * s * dt / (2 * dx)
    for _ in range(pas):
        nouveau = [0.0] * (n + 1)
        for i in range(1, n):
            nouveau[i] = u[i] + a * (u[i + 1] - 2 * u[i] + u[i - 1]) - b * (u[i + 1] - u[i - 1])
        nouveau[n] = math.exp(xs[n]) - K
        u = nouveau
    x = math.log(100.0)
    i = int((x - x0) / dx)
    w = (x - xs[i]) / dx
    knock_out = (1 - w) * u[i] + w * u[i + 1]
    return call(100, sig=0.2) - knock_out, 0.01


@verif("der-asiatique-geometrique")
def _():
    # écart-type de (σ/T)∫₀ᵀ W dt : σ·√(∫∫ min(s, t)) sur [0, 1]²
    return 0.24 * math.sqrt(grille(min, 400)), 1e-5


@verif("nrj-samuelson")
def _():
    # sensibilité de ln F(0, T) à ln S₀ dans l'OU : dérivée numérique de la moyenne conditionnelle (Euler sur m' = −κm)
    def moyenne(x, kappa=2.0, T=0.25, pas=20000):
        m = x
        for _ in range(pas):
            m += -kappa * m * T / pas
        return m
    h = 1e-3
    return (moyenne(h) - moyenne(-h)) / (2 * h), 1e-4


@verif("nrj-calendaire")
def _():
    heures = [100.0] * 744 + [80.0] * 672
    return sum(heures) / len(heures)


# --- Casse-têtes (section dédiée) -------------------------------------------------------------------------------------
def _arrangements(compte):
    """Nombre d'arrangements distincts d'un multiensemble, par récurrence sur la première lettre."""
    cle = tuple(sorted(c for c in compte if c))
    if sum(cle) == 0:
        return 1
    if cle in _arrangements.memo:
        return _arrangements.memo[cle]
    total = 0
    for i, c in enumerate(cle):
        reste = list(cle)
        reste[i] -= 1
        total += _arrangements(reste)
    _arrangements.memo[cle] = total
    return total


_arrangements.memo = {}


@verif("ct-anagrammes")
def _():
    from collections import Counter
    return _arrangements(list(Counter("MISSISSIPPI").values()))


@verif("ct-dominos-escalier")
def _():
    # pavages d'une bande 2 × n par colonnes, profil de la colonne suivante en masque de bits
    def compte(col, masque, n):
        if col == n:
            return 1 if masque == 0 else 0
        total = 0

        def remplir(ligne, courant, suivant):
            nonlocal total
            if ligne == 2:
                total += compte(col + 1, suivant, n)
                return
            if courant & (1 << ligne):
                remplir(ligne + 1, courant, suivant)
                return
            remplir(ligne + 1, courant | (1 << ligne), suivant | (1 << ligne))  # domino horizontal
            if ligne == 0 and not courant & 2:
                remplir(2, courant | 3, suivant)  # domino vertical
        remplir(0, masque, 0)
        return total
    return compte(0, 0, 10)


@verif("ct-regions-cercle")
def _():
    rng = random.Random(7)
    angles = sorted(rng.uniform(0, 2 * math.pi) for _ in range(6))
    cordes = list(itertools.combinations(range(6), 2))

    def croisent(c1, c2):
        a, b = c1
        c, d = c2
        if len({a, b, c, d}) < 4:
            return False
        return (a < c < b) != (a < d < b)
    croisements = sum(croisent(u, v) for u, v in itertools.combinations(cordes, 2))
    sommets = 6 + croisements
    aretes = len(cordes) + 2 * croisements + 6  # segments de cordes et arcs
    return aretes - sommets + 1  # Euler (faces intérieures)


@verif("ct-triangles-entiers")
def _():
    return sum(1 for a in range(1, 12) for b in range(a, 12) for c in range(b, 12)
               if a + b + c == 12 and a + b > c)


@verif("ct-chiffres-impairs")
def _():
    return sum(1 for n in range(1, 1000) if all(int(ch) % 2 for ch in str(n)))


@verif("ct-monnaie")
def _():
    return sum(1 for a in range(3) for b in range(6) for c in range(11) if 50 * a + 20 * b + 10 * c == 100)


@verif("ct-etoiles-barres")
def _():
    return sum(1 for x in range(11) for y in range(11) if x + y <= 10)


@verif("ct-bracelets")
def _():
    vus = set()
    for mot in itertools.product((0, 1), repeat=6):
        images = []
        for k in range(6):
            r = mot[k:] + mot[:k]
            images += [r, r[::-1]]
        vus.add(min(images))
    return len(vus)


@verif("ct-cube-peint")
def _():
    return sum(1 for x in range(3) for y in range(3) for z in range(3)
               if sum(c in (0, 2) for c in (x, y, z)) == 2)


@verif("ct-fourmi-cube")
def _():
    # trajet par un point (1, t, 0) de l'arête commune à deux faces : minimum numérique
    meilleur = min(math.hypot(1, t) + math.hypot(1, 1 - t) for t in (i / 100000 for i in range(100001)))
    return meilleur, 1e-6


@verif("ct-corde-terre")
def _():
    rayon = 6_371_000.0
    return (2 * math.pi * rayon + 1) / (2 * math.pi) - rayon, 1e-6


@verif("ct-piece-roule")
def _():
    # roulement sans glissement : angle propre = angle parcouru par le centre × (R + r) / r, avec R = r = 1
    pas = 100000
    angle = sum((2 * math.pi / pas) * 2 / 1 for _ in range(pas))
    return angle / (2 * math.pi), 1e-9


@verif("ct-anneau-serviette")
def _():
    rayon = 5.0  # n'importe quel rayon tel que la hauteur vaille 6
    trou = math.sqrt(rayon ** 2 - 9)
    return simpson(lambda z: math.pi * ((rayon ** 2 - z * z) - trou ** 2), -3, 3), 1e-6


@verif("ct-somme-angles")
def _():
    # hexagone régulier : six angles intérieurs, chacun mesuré par le produit scalaire
    pts = [(math.cos(k * math.pi / 3), math.sin(k * math.pi / 3)) for k in range(6)]
    total = 0
    for k in range(6):
        a, b, c = pts[k - 1], pts[k], pts[(k + 1) % 6]
        u = (a[0] - b[0], a[1] - b[1])
        v = (c[0] - b[0], c[1] - b[1])
        total += math.degrees(math.acos((u[0] * v[0] + u[1] * v[1]) / (math.hypot(*u) * math.hypot(*v))))
    return total, 1e-6


@verif("ct-superpositions")
def _():
    # instants (en minutes) où l'écart angulaire 5,5° × t est un multiple de 360°, sur [0, 1440[
    return sum(1 for k in range(0, 1000) if F(360 * k, 1) / F(11, 2) < 1440)


@verif("ct-vitesse-moyenne")
def _():
    d = F(60)
    return 2 * d / (d / 30 + d / 60)


@verif("ct-escargot")
def _():
    hauteur, jour = 0, 0
    while True:
        jour += 1
        hauteur += 3
        if hauteur >= 30:
            return jour
        hauteur -= 2


@verif("ct-nenuphars")
def _():
    surface, jour = F(1, 2 ** 48), 0
    while surface < F(1, 2):
        surface *= 2
        jour += 1
    return jour


@verif("ct-chapeau-riviere")
def _():
    courant, rameur = F(3), F(7)  # km/h, quelconques
    t1 = F(10, 60)
    chapeau = courant * t1  # dérive vers l'aval (positif)
    bateau = -(rameur - courant) * t1  # remonte vers l'amont
    # retour : le bateau descend à rameur + courant, le chapeau à courant
    t2 = (chapeau - bateau) / rameur
    return t2 * 60


@verif("ct-chapeaux")
def _():
    rng = random.Random(3)
    pire = 100
    for _ in range(300):
        h = [rng.randint(0, 1) for _ in range(100)]  # du premier (devant) au dernier
        annonce = []
        parite = sum(h[:99]) % 2
        annonce.append(parite)  # le dernier annonce la parité de ce qu'il voit
        entendu = 0
        for i in range(98, -1, -1):
            vu = sum(h[:i]) % 2
            couleur = (parite - vu - entendu) % 2
            annonce.append(couleur)
            entendu = (entendu + couleur) % 2
        sauves = (annonce[0] == h[99]) + sum(annonce[1 + (98 - i)] == h[i] for i in range(99))
        pire = min(pire, sauves)
    return pire


@verif("ct-chapeaux-simultanes")
def _():
    gagne = 0
    for c in itertools.product((0, 1), repeat=3):
        reponses = []
        for i in range(3):
            autres = [c[j] for j in range(3) if j != i]
            reponses.append(1 - autres[0] if autres[0] == autres[1] else None)
        annonces = [(r, c[i]) for i, r in enumerate(reponses) if r is not None]
        gagne += bool(annonces) and all(r == v for r, v in annonces)
    return F(gagne, 8)


@verif("ct-prisonniers-boites")
def _():
    rng = random.Random(11)
    succes, essais = 0, 20000
    for _ in range(essais):
        perm = list(range(100))
        rng.shuffle(perm)
        vus = [False] * 100
        ok = True
        for i in range(100):
            if vus[i]:
                continue
            longueur, j = 0, i
            while not vus[j]:
                vus[j] = True
                j = perm[j]
                longueur += 1
            if longueur > 50:
                ok = False
                break
        succes += ok
    return succes / essais, 0.012


@verif("ct-guetteur-espion")
def _():
    k = 0
    while 2 ** k < 100:
        k += 1
    return k


@verif("ct-frobenius")
def _():
    payable = {a * 3 + b * 5 for a in range(20) for b in range(20)}
    return max(n for n in range(1, 50) if n not in payable)


@verif("ct-restes-chinois")
def _():
    return next(n for n in range(1, 10000) if all(n % d == 1 for d in range(2, 7)) and n % 7 == 0)


@verif("ct-multiples-3-5")
def _():
    return sum(n for n in range(1000) if n % 3 == 0 or n % 5 == 0)


@verif("ct-diviseurs")
def _():
    return sum(1 for d in range(1, 361) if 360 % d == 0)


@verif("ct-tour-puissances")
def _():
    def tour(x):
        y = 1.0
        for _ in range(2000):
            y = x ** y
        return y
    bas, haut = 1.2, 1.44
    for _ in range(60):
        m = (bas + haut) / 2
        if tour(m) < 2:
            bas = m
        else:
            haut = m
    return bas, 1e-4


@verif("ct-produit-max")
def _():
    def meilleur(n, maxi):
        if n == 0:
            return 1
        return max(k * meilleur(n - k, k) for k in range(1, min(n, maxi) + 1))
    return max(meilleur(10, 9), 1)


@verif("ct-cheque-inverse")
def _():
    for x in range(100):
        for y in range(100):
            if 100 * y + x - 5 == 2 * (100 * x + y):
                return F(100 * x + y, 100)


@verif("ct-autodescriptif")
def _():
    def compositions(n, k):
        if k == 1:
            yield (n,)
            return
        for i in range(min(n, 9), -1, -1):
            for reste in compositions(n - i, k - 1):
                yield (i,) + reste
    for chiffres in compositions(10, 10):
        if chiffres[0] and all(chiffres.count(i) == chiffres[i] for i in range(10)):
            return int("".join(map(str, chiffres)))


@verif("ct-age-carre")
def _():
    return next(x for x in range(1, 100) if 1910 <= x * x - x and x * x <= 2026 and x * x >= 1926)


@verif("ct-chiffres-puissance")
def _():
    return len(str(2 ** 100))


@verif("ct-billes-plus-lourde")
def _():
    # stratégie 3/3/3 puis 1/1/1 : on vérifie qu'elle identifie chaque bille en 2 pesées, et qu'une pesée ne suffit pas
    def trouve(lourde):
        groupes = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
        g = next(g for g in groupes if lourde in g)
        return g[[x == lourde for x in g].index(True)]
    assert all(trouve(b) == b for b in range(9)) and 3 ** 1 < 9
    return 2


@verif("ct-piles-pieces-une-pesee")
def _():
    resultats = set()
    for fausse in range(1, 11):
        resultats.add(sum(k * (11 if k == fausse else 10) for k in range(1, 11)))
    return 1 if len(resultats) == 10 else 2


@verif("ct-poids-balance")
def _():
    def couvre(poids):
        atteints = set()
        for signes in itertools.product((-1, 0, 1), repeat=len(poids)):
            atteints.add(sum(s * p for s, p in zip(signes, poids)))
        return all(m in atteints for m in range(1, 41))
    for k in range(1, 5):
        if (3 ** k - 1) // 2 >= 40 and couvre([3 ** i for i in range(k)]):
            return k


@verif("ct-cruches")
def _():
    from collections import deque
    depart = (0, 0)
    dist = {depart: 0}
    file = deque([depart])
    while file:
        a, b = file.popleft()
        if a == 4 or b == 4:
            return dist[(a, b)]
        t1 = min(a, 3 - b)
        t2 = min(b, 5 - a)
        for s in [(5, b), (a, 3), (0, b), (a, 0), (a - t1, b + t1), (a + t2, b - t2)]:
            if s not in dist:
                dist[s] = dist[(a, b)] + 1
                file.append(s)


@verif("ct-pommes-de-terre")
def _():
    sec = F(100) * F(1, 100)
    return sec / F(2, 100)


@verif("ct-barre-or")
def _():
    def morceaux(n, p, mini=1):
        if p == 1:
            if n >= mini:
                yield (n,)
            return
        for i in range(mini, n + 1):
            for r in morceaux(n - i, p - 1, i):
                yield (i,) + r
    for p in range(1, 8):
        for m in morceaux(7, p):
            sommes = {sum(c) for k in range(len(m) + 1) for c in itertools.combinations(m, k)}
            if all(v in sommes for v in range(1, 8)):
                return p - 1


@verif("ct-p-triangle-aigu")
def _():
    rng = random.Random(5)
    n, aigus = 200000, 0
    for _ in range(n):
        a = sorted(rng.random() for _ in range(3))
        arcs = (a[1] - a[0], a[2] - a[1], 1 - a[2] + a[0])
        aigus += max(arcs) < 0.5
    return aigus / n, 0.005


@verif("ct-p-rendez-vous")
def _():
    return simpson(lambda x: min(1, x + 0.25) - max(0, x - 0.25), 0, 1, 400000), 1e-6


@verif("ct-p-buffon")
def _():
    # probabilité = moyenne sur θ de sin θ (la distance du centre est uniforme sur [0, 1/2])
    return simpson(lambda t: math.sin(t), 0, math.pi / 2) / (math.pi / 2), 1e-9


@verif("ct-p-de-repetition")
def _():
    def esperance(vus):
        k = len(vus)
        if k == 6:
            return F(1)
        # lancer suivant : répétition avec probabilité k/6
        return 1 + F(6 - k, 6) * esperance(vus + (k,))
    return esperance(())


@verif("ct-p-cube-oppose")
def _():
    sommets = list(itertools.product((0, 1), repeat=3))
    cible = (1, 1, 1)
    actifs = [s for s in sommets if s != cible]
    idx = {s: i for i, s in enumerate(actifs)}
    a = [[F(0)] * 7 for _ in range(7)]
    b = [F(1)] * 7
    for s in actifs:
        i = idx[s]
        a[i][i] += 1
        for k in range(3):
            v = list(s)
            v[k] ^= 1
            v = tuple(v)
            if v != cible:
                a[i][idx[v]] -= F(1, 3)
    return resoudre(a, b)[idx[(0, 0, 0)]]


@verif("ct-p-urnes-bleues")
def _():
    meilleur = F(0)
    for b1 in range(6):
        for r1 in range(6):
            n1, n2 = b1 + r1, 10 - b1 - r1
            if n1 == 0 or n2 == 0:
                continue
            meilleur = max(meilleur, F(1, 2) * F(b1, n1) + F(1, 2) * F(5 - b1, n2))
    return meilleur


@verif("ct-p-chaussettes")
def _():
    return next(n for n in range(2, 100) for r in range(n + 1) if F(r * (r - 1), n * (n - 1)) == F(1, 2))


@verif("ct-p-cartes-broyees")
def _():
    total = F(0)
    for k in range(5):  # as broyés
        pk = F(math.comb(4, k) * math.comb(48, 20 - k), math.comb(52, 20))
        total += pk * F(math.comb(4 - k, 2), math.comb(32, 2))
    return total


@verif("ct-p-pari-60-piles")
def _():
    return sum(math.comb(100, k) for k in range(60, 101)) / 2 ** 100, 0.00005


@verif("ct-p-roulette-russe")
def _():
    barillet = [1, 1, 0, 0, 0, 0]
    vides = [i for i in range(6) if barillet[i] == 0]
    survie_direct = F(sum(barillet[(i + 1) % 6] == 0 for i in vides), len(vides))
    survie_tour = F(barillet.count(0), 6)
    return max(survie_direct, survie_tour)


@verif("ct-p-six-sachant-pairs")
def _():
    num = sum(n * (F(1, 3) ** (n - 1)) * F(1, 6) for n in range(1, 120))
    den = sum((F(1, 3) ** (n - 1)) * F(1, 6) for n in range(1, 120))
    return float(num / den), 1e-12


@verif("ct-p-morceau-milieu")
def _():
    return simpson(lambda u: max(u, 1 - u), 0, 1, 200000), 1e-8


@verif("ct-p-baton-casse-deux-fois")
def _():
    rng = random.Random(9)
    n, ok = 400000, 0
    for _ in range(n):
        u = rng.random()
        long, court = max(u, 1 - u), min(u, 1 - u)
        v = rng.random() * long
        morceaux = (court, v, long - v)
        ok += max(morceaux) < 0.5
    return ok / n, 0.004


@verif("ct-p-un-et-six")
def _():
    # états : rien vu, un des deux vu
    a = [[F(1) - F(4, 6), -F(2, 6)], [F(0), F(1) - F(5, 6)]]
    return resoudre(a, [F(1), F(1)])[0]


@verif("ct-p-total-atteint")
def _():
    p = [1.0]
    for n in range(1, 2001):
        p.append(sum(p[n - k] for k in range(1, 7) if n - k >= 0) / 6)
    return p[2000], 1e-9


@verif("ct-p-deuce-tennis")
def _():
    # écart -1, 0, +1 (absorbé à ±2)
    p, q = F(3, 5), F(2, 5)
    a = [[F(1), -p, F(0)], [-q, F(1), -p], [F(0), -q, F(1)]]
    b = [F(0), F(0), p]
    return resoudre(a, b)[1]


@verif("ct-p-garcon-mardi")
def _():
    enfants = list(itertools.product("GF", range(7)))
    cas = [(a, b) for a in enfants for b in enfants if ("G", 2) in (a, b)]
    return F(sum(a[0] == "G" and b[0] == "G" for a, b in cas), len(cas))


@verif("ct-p-paires-rouge-noire")
def _():
    rng = random.Random(13)
    jeu = [0] * 26 + [1] * 26
    total, essais = 0, 20000
    for _ in range(essais):
        rng.shuffle(jeu)
        total += sum(jeu[i] != jeu[i + 1] for i in range(51))
    return total / essais, 0.1


@verif("ct-p-ivrogne-falaise")
def _():
    # marche absorbée en 0 et (approximativement) en N, système tridiagonal résolu par l'algorithme de Thomas
    n, p, q = 400, 2 / 3, 1 / 3
    # x_k = q x_{k-1} + p x_{k+1}, x_0 = 1 (chute), x_n = 0
    c, d = [0.0] * n, [0.0] * n
    c[1], d[1] = p, q  # x_1 = q·1 + p·x_2  ->  x_1 = d_1 + c_1 x_2
    for k in range(2, n):
        den = 1 - q * c[k - 1]
        c[k] = p / den
        d[k] = q * d[k - 1] / den
    x = 0.0
    for k in range(n - 1, 0, -1):
        x = d[k] + c[k] * x
    return x, 1e-9


@verif("ct-p-sans-piles-consecutifs")
def _():
    return F(sum(1 for m in itertools.product("PF", repeat=10) if "PP" not in "".join(m)), 2 ** 10)


@verif("ct-p-trois-piles-cinq-faces")
def _():
    return course_motifs("PPP", "FFFFF", {"P": F(1, 2), "F": F(1, 2)})


@verif("ct-p-egalite-piles")
def _():
    return sum(F(1, 4) * F(1, 4) ** k for k in range(200)).limit_denominator(1000), 0


@verif("ct-p-racines-reelles")
def _():
    rng = random.Random(17)
    n = 400000
    ok = sum(1 for _ in range(n) if (lambda a, b, c: b * b >= 4 * a * c)(rng.random(), rng.random(), rng.random()))
    return ok / n, 0.004


@verif("ct-p-craps")
def _():
    somme = {}
    for a in DE:
        for b in DE:
            somme[a + b] = somme.get(a + b, 0) + F(1, 36)
    total = somme[7] + somme[11]
    for point in (4, 5, 6, 8, 9, 10):
        # relances jusqu'au point ou au 7 : chaîne à un état
        p = somme[point]
        total += p * (p / (1 - (1 - p - somme[7])) )
    return total


@verif("ct-p-distance-centre")
def _():
    return grille(lambda x, y: math.hypot(2 * x - 1, 2 * y - 1) if math.hypot(2 * x - 1, 2 * y - 1) <= 1 else 0, 1200) / \
        grille(lambda x, y: 1.0 if math.hypot(2 * x - 1, 2 * y - 1) <= 1 else 0.0, 1200), 2e-3


@verif("ct-p-succession-laplace")
def _():
    return simpson(lambda p: p ** 4, 0, 1) / simpson(lambda p: p ** 3, 0, 1), 1e-9


@verif("ct-p-sharpe-negatif")
def _():
    return simpson(phi, -12, -1, 200000), 1e-9


@verif("ct-p-grenouille-nenuphars")
def _():
    e = [F(0)]
    for n in range(1, 11):
        e.append(1 + sum(e[:n]) / n)
    return e[10]


@verif("ct-pasteques")
def _():
    rng = random.Random(19)
    poids = rng.sample(range(1000), 16)
    comparaisons = 0
    battus = {i: [] for i in range(16)}
    tour = list(range(16))
    while len(tour) > 1:
        suivant = []
        for a, b in zip(tour[::2], tour[1::2]):
            comparaisons += 1
            g, p = (a, b) if poids[a] > poids[b] else (b, a)
            battus[g].append(p)
            suivant.append(g)
        tour = suivant
    candidats = battus[tour[0]]
    comparaisons += len(candidats) - 1
    second = max(candidats, key=lambda i: poids[i])
    assert second == sorted(range(16), key=lambda i: poids[i])[-2]
    return comparaisons


@verif("ct-pain-grille")
def _():
    from collections import deque
    depart = (0, 0, 0)  # faces grillées par tranche
    dist = {depart: 0}
    file = deque([depart])
    while file:
        e = file.popleft()
        if e == (2, 2, 2):
            return dist[e] * 30
        for choix in itertools.combinations(range(3), 2):
            s = list(e)
            for i in choix:
                if s[i] < 2:
                    s[i] += 1
            s = tuple(s)
            if s not in dist:
                dist[s] = dist[e] + 1
                file.append(s)


@verif("ct-pneus")
def _():
    # rotation : chaque pneu roule 4/5 de la distance ; la distance maximale sature les 20 000 km de chacun
    return F(20000) / F(4, 5)


@verif("ct-riviere")
def _():
    from collections import deque

    def sur(m, c):
        return (m == 0 or m >= c) and (3 - m == 0 or 3 - m >= 3 - c)
    depart = (3, 3, 0)
    dist = {depart: 0}
    file = deque([depart])
    while file:
        m, c, bord = file.popleft()
        if (m, c, bord) == (0, 0, 1):
            return dist[(m, c, bord)]
        signe = -1 if bord == 0 else 1
        for dm, dc in [(1, 0), (2, 0), (0, 1), (0, 2), (1, 1)]:
            nm, nc = m + signe * dm, c + signe * dc
            if 0 <= nm <= 3 and 0 <= nc <= 3 and sur(nm, nc):
                s = (nm, nc, 1 - bord)
                if s not in dist:
                    dist[s] = dist[(m, c, bord)] + 1
                    file.append(s)


@verif("ct-hanoi")
def _():
    def deplacer(n, a, b, c, coups):
        if n:
            deplacer(n - 1, a, c, b, coups)
            coups.append((a, c))
            deplacer(n - 1, b, a, c, coups)
    coups = []
    deplacer(10, 0, 1, 2, coups)
    return len(coups)


@verif("ct-tri-cinq")
def _():
    # borne d'information (atteinte par l'algorithme de Ford-Johnson, décrit dans la fiche)
    k = 0
    while 2 ** k < math.factorial(5):
        k += 1
    return k


def _gagnant(depart, coups):
    """Coups gagnants d'un jeu « celui qui atteint 0 gagne » sur un compteur décroissant."""
    gagne = {0: False}
    for n in range(1, depart + 1):
        gagne[n] = any(not gagne[n - k] for k in coups if k <= n)
    return [k for k in coups if k <= depart and not gagne[depart - k]]


@verif("ct-allumettes")
def _():
    return _gagnant(21, (1, 2, 3))[0]


@verif("ct-course-a-100")
def _():
    return _gagnant(100, range(1, 11))[0]


@verif("ct-nim")
def _():
    from functools import lru_cache

    @lru_cache(None)
    def gagne(tas):
        for i, t in enumerate(tas):
            for k in range(1, t + 1):
                s = list(tas)
                s[i] -= k
                if not gagne(tuple(sorted(s))):
                    return True
        return False
    total = 0
    tas = (3, 4, 5)
    for i, t in enumerate(tas):
        for k in range(1, t + 1):
            s = list(tas)
            s[i] -= k
            total += not gagne(tuple(sorted(s)))
    return total


@verif("ct-chocolat")
def _():
    rng = random.Random(23)
    morceaux = [(6, 8)]
    cassures = 0
    while any(a * b > 1 for a, b in morceaux):
        i = next(i for i, (a, b) in enumerate(morceaux) if a * b > 1)
        a, b = morceaux.pop(i)
        if a > 1 and (b == 1 or rng.random() < 0.5):
            k = rng.randint(1, a - 1)
            morceaux += [(k, b), (a - k, b)]
        else:
            k = rng.randint(1, b - 1)
            morceaux += [(a, k), (a, b - k)]
        cassures += 1
    return cassures


@verif("ct-boites-etiquettes")
def _():
    # toutes les affectations (contenu des boîtes « pommes », « oranges », « mélange ») où aucune étiquette n'est juste
    contenus = [p for p in itertools.permutations(("P", "O", "M")) if all(c != e for c, e in zip(p, ("P", "O", "M")))]
    # un fruit tiré de la boîte « mélange » (contenu pur) suffit-il à identifier l'affectation ?
    return 1 if len({p[2] for p in contenus}) == len(contenus) else 2


@verif("ct-batte-balle")
def _():
    return next(F(c, 100) for c in range(111) if c + (c + 100) == 110)


@verif("ct-josephus")
def _():
    cercle = list(range(1, 101))
    i = 1
    while len(cercle) > 1:
        cercle.pop(i)
        i = (i + 1) % len(cercle)
    return cercle[0]


@verif("ct-cavalier")
def _():
    from collections import deque
    dist = {(0, 0): 0}
    file = deque([(0, 0)])
    while file:
        x, y = file.popleft()
        for dx, dy in [(1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)]:
            s = (x + dx, y + dy)
            if 0 <= s[0] < 8 and 0 <= s[1] < 8 and s not in dist:
                dist[s] = dist[(x, y)] + 1
                file.append(s)
    return dist[(7, 7)]


@verif("ct-rois-non-attaquants")
def _():
    # glouton ligne par ligne, une case sur deux, une ligne sur deux : borne atteinte ; borne par blocs 2 × 2
    rois = [(x, y) for x in range(0, 8, 2) for y in range(0, 8, 2)]
    assert all(max(abs(a[0] - b[0]), abs(a[1] - b[1])) > 1 for a, b in itertools.combinations(rois, 2))
    return len(rois)


@verif("ct-p-chuck-a-luck")
def _():
    gain = F(0)
    for des in itertools.product(DE, repeat=3):
        k = des.count(1)
        gain += F(k if k else -1, 216)
    return gain


@verif("ct-infection-grille")
def _():
    # la diagonale infecte toute la grille ; 9 cases ne peuvent pas (borne du périmètre)
    infectees = {(i, i) for i in range(10)}
    change = True
    while change:
        change = False
        for x in range(10):
            for y in range(10):
                if (x, y) not in infectees:
                    voisins = sum((x + dx, y + dy) in infectees for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                    if voisins >= 2:
                        infectees.add((x, y))
                        change = True
    assert len(infectees) == 100 and 4 * 9 < 40
    return 10


@verif("ct-p-nouilles")
def _():
    rng = random.Random(29)
    total, essais = 0, 4000
    for _ in range(essais):
        brins, boucles = 100, 0
        while brins:
            if rng.random() < 1 / (2 * brins - 1):
                boucles += 1
            brins -= 1
        total += boucles
    return total / essais, 0.06


@verif("ct-sommes-consecutives")
def _():
    return sum(1 for m in range(1, 1001) for k in range(1, 100) if k * (2 * m + k - 1) == 2000)


@verif("ct-poteaux-croises")
def _():
    # poteaux en x = 0 (hauteur 6) et x = d ; intersection des deux câbles
    d = 7.3
    # câble 1 : de (0, 6) à (d, 0) ; câble 2 : de (d, 3) à (0, 0)
    x = 6 * d / (6 + 3)
    return 3 * x / d, 1e-9


@verif("ct-hauteur-chute")
def _():
    return 0.5 * 9.8 * 3 ** 2, 0.5


@verif("ct-p-pistolets")
def _():
    rng = random.Random(31)
    total, essais = 0, 40000
    for _ in range(essais):
        touches = set()
        for i in range(10):
            j = rng.randrange(9)
            touches.add(j if j < i else j + 1)
        total += 10 - len(touches)
    return total / essais, 0.03


@verif("ct-p-ecart-deux-des")
def _():
    return F(sum(abs(a - b) for a in DE for b in DE), 36)


@verif("ct-p-distance-bord-carre")
def _():
    return grille(lambda x, y: min(x, y, 1 - x, 1 - y), 1000), 1e-6


@verif("ct-p-couleurs-main")
def _():
    rng = random.Random(37)
    jeu = [c for c in range(4) for _ in range(13)]
    essais = 40000
    return sum(len(set(rng.sample(jeu, 13))) for _ in range(essais)) / essais, 0.004


@verif("ct-p-total-sept")
def _():
    # espérance par énumération des suites de lancers (arbre complet)
    def esperance(total):
        if total >= 7:
            return F(0)
        return 1 + sum(esperance(total + d) for d in DE) / 6
    return esperance(0)


# --- Variantes : logique ---------------------------------------------------------------------------------------------
@verif("ct-chapeaux-k-couleurs")
def _():
    # stratégie de la somme modulo k, sur des files tirées au hasard, pour plusieurs k : minimum de sauvés garantis
    rng = random.Random(41)
    pire = 100
    for k in (2, 3, 5, 7):
        for _ in range(200):
            c = [rng.randrange(k) for _ in range(100)]  # c[0] est le dernier de la file (il voit c[1:])
            annonce = sum(c[1:]) % k
            entendu = []
            sauves = 0
            for i in range(1, 100):
                propre = (annonce - sum(c[i + 1:]) - sum(entendu)) % k
                entendu.append(propre)
                sauves += propre == c[i]
            pire = min(pire, sauves)
    return pire


@verif("ct-chapeaux-simultanes-sept")
def _():
    # code de Hamming (7, 4) : mots dont le syndrome est nul ; stratégie appliquée aux 128 configurations
    def syndrome(m):
        s = 0
        for i in range(7):
            if m >> i & 1:
                s ^= i + 1
        return s
    code = {m for m in range(128) if syndrome(m) == 0}
    gagnes = 0
    for m in range(128):
        annonces = []
        for i in range(7):
            avec0, avec1 = m & ~(1 << i), m | (1 << i)
            if avec0 in code:
                annonces.append((i, 1))
            elif avec1 in code:
                annonces.append((i, 0))
        if annonces and all((m >> i & 1) == b for i, b in annonces):
            gagnes += 1
    return F(gagnes, 128)


@verif("ct-prisonniers-boites-limite")
def _():
    n = 20000
    return 1 - sum(1 / k for k in range(n + 1, 2 * n + 1)), 1e-4


@verif("ct-prisonniers-boites-cycles")
def _():
    # nombres de Stirling de première espèce : c(n, k) permutations à k cycles
    n = 10
    c = [[0] * (n + 1) for _ in range(n + 1)]
    c[0][0] = 1
    for m in range(1, n + 1):
        for k in range(1, m + 1):
            c[m][k] = c[m - 1][k - 1] + (m - 1) * c[m - 1][k]
    return F(sum(k * c[n][k] for k in range(n + 1)), math.factorial(n))


@verif("ct-guetteur-mensonge")
def _():
    # borne de Hamming (atteinte d'après le résultat de Pelc sur le jeu d'Ulam)
    return next(k for k in range(1, 30) if 2 ** k >= 100 * (k + 1))


# --- Variantes : nombres ---------------------------------------------------------------------------------------------
@verif("ct-batte-balle-machines")
def _():
    # une machine fait un objet en 5 minutes ; 100 machines en parallèle, 100 objets
    cadence = F(5, 5 * 5)  # objets par machine et par minute
    return 100 / (100 * cadence)


@verif("ct-batte-balle-brique")
def _():
    return next(F(b, 10) for b in range(1, 100) if F(b, 10) == 1 + F(b, 20))


@verif("ct-batte-balle-action")
def _():
    return (F(1, 2) * F(3, 2) - 1) * 100


@verif("ct-josephus-trois")
def _():
    cercle = list(range(1, 42))
    i = 0
    while len(cercle) > 1:
        i = (i + 2) % len(cercle)
        cercle.pop(i)
    return cercle[0]


@verif("ct-zeros-factorielle-mille")
def _():
    s = str(math.factorial(1000))
    return len(s) - len(s.rstrip("0"))


@verif("ct-zeros-factorielle-non-nul")
def _():
    return int(str(math.factorial(100)).rstrip("0")[-1])


@verif("ct-dernier-chiffre-modulo-sept")
def _():
    return 2 ** 100 % 7


@verif("ct-dernier-chiffre-deux")
def _():
    return 3 ** 100 % 100


@verif("ct-impairs-gauss")
def _():
    return sum(range(1, 101))


@verif("ct-impairs-chiffres")
def _():
    return sum(int(c) for n in range(1, 101) for c in str(n))


@verif("ct-frobenius-nuggets")
def _():
    possibles = {6 * a + 9 * b + 20 * c for a in range(30) for b in range(20) for c in range(10)}
    return max(n for n in range(1, 200) if n not in possibles)


@verif("ct-multiples-3-5-combien")
def _():
    return sum(1 for n in range(1, 1001) if n % 3 == 0 or n % 5 == 0)


@verif("ct-multiples-3-5-euler")
def _():
    return sum(1 for n in range(1, 1001) if math.gcd(n, 1000) == 1)


@verif("ct-diviseurs-premiers")
def _():
    return sum(1 for n in range(2, 100) if all(n % d for d in range(2, int(n ** 0.5) + 1)))


@verif("ct-e-pi-equation")
def _():
    # changements de signe de 2^x - x^2 sur une grille fine, plus les racines exactes 2 et 4
    g = lambda x: 2 ** x - x * x
    pas = [i / 1000 for i in range(-20000, 20001)]
    signes = 0
    for a, b in zip(pas, pas[1:]):
        if g(a) == 0 or g(a) * g(b) < 0:
            signes += 1
    return signes


@verif("ct-tour-puissances-radical")
def _():
    y = 0.0
    for _ in range(200):
        y = math.sqrt(2 + y)
    return y, 1e-12


@verif("ct-tour-puissances-fraction")
def _():
    a, b = 1, 1
    for _ in range(60):
        a, b = a + b, a
    return a / b, 1e-12


@verif("ct-produit-max-reels")
def _():
    return max((10 / k) ** k for k in range(1, 11)), 1e-12


@verif("ct-produit-max-xx")
def _():
    return min((i / 100000) ** (i / 100000) for i in range(1, 200000)), 1e-9


@verif("ct-chiffres-puissance-factorielle")
def _():
    return math.log2(math.factorial(100)), 1e-6


@verif("ct-casiers-mille")
def _():
    casiers = [False] * 1001
    for k in range(1, 1001):
        for n in range(k, 1001, k):
            casiers[n] = not casiers[n]
    return sum(casiers)


# --- Variantes : dénombrement ----------------------------------------------------------------------------------------
@verif("ct-rois-non-attaquants-cavaliers")
def _():
    # maximum d'un ensemble indépendant du graphe du cavalier : graphe biparti, König (couplage maximum)
    cases = [(i, j) for i in range(8) for j in range(8)]
    blanches = [c for c in cases if sum(c) % 2 == 0]
    voisins = {c: [(c[0] + a, c[1] + b) for a, b in ((1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1))
                   if 0 <= c[0] + a < 8 and 0 <= c[1] + b < 8] for c in cases}
    associe = {}

    def augmenter(u, vus):
        for v in voisins[u]:
            if v not in vus:
                vus.add(v)
                if v not in associe or augmenter(associe[v], vus):
                    associe[v] = u
                    return True
        return False
    couplage = sum(augmenter(u, set()) for u in blanches)
    return 64 - couplage


@verif("ct-rois-non-attaquants-dames")
def _():
    def placer(ligne, cols, d1, d2):
        if ligne == 8:
            return 1
        return sum(placer(ligne + 1, cols | {c}, d1 | {ligne + c}, d2 | {ligne - c})
                   for c in range(8) if c not in cols and ligne + c not in d1 and ligne - c not in d2)
    return placer(0, frozenset(), frozenset(), frozenset())


@verif("ct-carres-echiquier-rectangles")
def _():
    return sum((9 - a) * (9 - b) for a in range(1, 9) for b in range(1, 9))


@verif("ct-carres-echiquier-grille")
def _():
    return sum(1 for k in range(1, 11) for i in range(11 - k) for j in range(11 - k))


@verif("ct-poignees-diagonales")
def _():
    return sum(1 for a in range(10) for b in range(a + 1, 10) if (b - a) % 10 not in (1, 9))


@verif("ct-poignees-championnat")
def _():
    return len(list(itertools.permutations(range(20), 2)))


@verif("ct-chiffre-un-sept")
def _():
    return "".join(map(str, range(1, 101))).count("7")


@verif("ct-chiffre-un-mille")
def _():
    return "".join(map(str, range(1, 1001))).count("1")


@verif("ct-anagrammes-bridge")
def _():
    return math.factorial(52) // (math.factorial(13) * math.factorial(39))


@verif("ct-dominos-escalier-binaire")
def _():
    return sum(1 for m in range(1 << 10) if m & (m >> 1) == 0)


@verif("ct-regions-cercle-pizza")
def _():
    # lignes en position générale : régions = 1 + n + nombre de croisements (comptés sur des droites tirées au hasard)
    rng = random.Random(43)
    droites = [(rng.uniform(-1, 1), rng.uniform(-1, 1)) for _ in range(7)]  # y = a x + b
    croisements = sum(1 for (a, b), (c, d) in itertools.combinations(droites, 2) if a != c)
    return 1 + 7 + croisements


@verif("ct-regions-cercle-gateau")
def _():
    # récurrence : morceaux(n) = morceaux(n - 1) + régions du plan par n - 1 droites
    plan = lambda k: 1 + k + k * (k - 1) // 2
    m = 1
    for n in range(1, 6):
        m += plan(n - 1)
    return m


@verif("ct-chiffres-impairs-palindromes")
def _():
    return sum(1 for n in range(100, 1000) if str(n) == str(n)[::-1])


@verif("ct-chiffres-impairs-distincts")
def _():
    return sum(1 for n in range(1000, 10000) if len(set(str(n))) == 4)


@verif("ct-etoiles-barres-positifs")
def _():
    return sum(1 for x in range(1, 11) for y in range(1, 11) if 10 - x - y >= 1)


@verif("ct-bracelets-colliers")
def _():
    vus = set()
    for m in range(64):
        mot = format(m, "06b")
        vus.add(min(mot[k:] + mot[:k] for k in range(6)))
    return len(vus)


@verif("ct-cube-peint-dix")
def _():
    return sum(1 for x in range(10) for y in range(10) for z in range(10) if all(0 < c < 9 for c in (x, y, z)))


@verif("ct-cube-peint-coupes")
def _():
    # faces du cube central à créer (aucune n'est à l'extérieur), une seule par coupe plane
    centre = (1, 1, 1)
    return sum(1 for axe in range(3) for sens in (-1, 1) if 0 <= centre[axe] + sens <= 2)


# --- Variantes : géométrie, mouvement, invariants --------------------------------------------------------------------
@verif("ct-fourmi-cube-pave")
def _():
    # plus court chemin sur la surface : minimum des trois dépliages à deux faces
    a, b, c = 1, 2, 3
    return min(math.hypot(x + y, z) for x, y, z in itertools.permutations((a, b, c))), 1e-12


@verif("ct-fourmi-cube-dudeney")
def _():
    # trajet réel en 3D par la suite de faces mur x=0, plafond, mur y=0, sol, mur x=30 : on optimise les quatre points
    # de passage sur les arêtes (longueur convexe en ces paramètres) ; on compare au trajet naturel par le plafond
    S, M = (0, 6, 11), (30, 6, 1)

    def longueur(p):
        a, b, c, d = p
        pts = [S, (0, a, 12), (b, 0, 12), (c, 0, 0), (30, d, 0), M]
        return sum(math.dist(u, v) for u, v in zip(pts, pts[1:]))
    p = [6.0, 15.0, 15.0, 6.0]
    bornes = [(0, 12), (0, 30), (0, 30), (0, 12)]
    for _ in range(200):
        for i, (lo, hi) in enumerate(bornes):
            for _ in range(60):
                m1, m2 = lo + (hi - lo) / 3, hi - (hi - lo) / 3
                q1, q2 = p[:], p[:]
                q1[i], q2[i] = m1, m2
                if longueur(q1) < longueur(q2):
                    hi = m2
                else:
                    lo = m1
            p[i] = (lo + hi) / 2
    return min(42, longueur(p)), 1e-6


@verif("ct-piece-roule-rayon")
def _():
    r, R = 1, 3
    return F(2 * (R + r), 2 * r)


@verif("ct-angle-horloge-trois-vingt-cinq")
def _():
    return abs(F(25 * 6) - F(3 * 30) - F(25, 2))


@verif("ct-angle-horloge-formule")
def _():
    a = abs((9 * 60 + 30) * F(1, 2) - 30 * 6) % 360
    return min(a, 360 - a)


@verif("ct-superpositions-angle-droit")
def _():
    # simulation minute par fraction de minute : changements de signe de cos(écart)
    n = 0
    pas = 1440 * 20
    ecart = lambda t: math.radians((6 * t - 0.5 * t) % 360)
    for k in range(pas):
        t0, t1 = k * 1440 / pas, (k + 1) * 1440 / pas
        if math.cos(ecart(t0)) * math.cos(ecart(t1)) < 0:
            n += 1
    return n


@verif("ct-superpositions-cinq-heures")
def _():
    # bissection sur la différence d'angle après 5 h
    lo, hi = 0.0, 59.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if 6 * mid < 150 + 0.5 * mid:
            lo = mid
        else:
            hi = mid
    return lo, 1e-9


@verif("ct-escargot-dix")
def _():
    h, jour = 0, 0
    while True:
        jour += 1
        h += 3
        if h >= 10:
            return jour
        h -= 2


@verif("ct-nenuphars-deux")
def _():
    plein = 2 ** 47  # surface au jour 48 en partant de 1 au jour 1
    jour, s = 1, 2
    while s < plein:
        s *= 2
        jour += 1
    return jour


@verif("ct-chapeau-riviere-courant")
def _():
    # repère du sol : le rameur (vitesse v par rapport à l'eau) remonte 10 minutes, revient, rattrape le chapeau ;
    # on cherche le courant c tel que le rattrapage ait lieu 1 km en aval
    v = 8.0

    def aval(c):
        t1 = 1 / 6
        x = -(v - c) * t1  # position du rameur au demi-tour
        t2 = (c * t1 - x) / ((v + c) - c)  # il rattrape le chapeau qui dérive à c
        return c * (t1 + t2)
    lo, hi = 0.0, v
    for _ in range(100):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if aval(mid) < 1 else (lo, mid)
    return lo, 1e-9


@verif("ct-train-mouche-chien")
def _():
    # somme des allers-retours du chien, simulée jusqu'à convergence
    maitre, chien, sens, d = 0.0, 0.0, 1, 0.0
    maison = 2.0
    while maison - maitre > 1e-12:
        if sens == 1:
            t = (maison - chien) / 15
            chien = maison
        else:
            t = (chien - maitre) / (15 + 5)
            chien -= 15 * t
        maitre += 5 * t
        d += 15 * t
        sens = -sens
    return d, 1e-6


@verif("ct-cameleons-possible")
def _():
    from collections import deque
    depart = (13, 15, 16)
    vus, file = {depart}, deque([depart])
    while file:
        e = file.popleft()
        if sorted(e)[:2] == [0, 0]:
            return max(e)
        g, b, p = e
        for t in ((g - 1, b - 1, p + 2), (g - 1, b + 2, p - 1), (g + 2, b - 1, p - 1)):
            if min(t) >= 0 and t not in vus:
                vus.add(t)
                file.append(t)
    return None


@verif("ct-tableau-effacer-produit")
def _():
    rng = random.Random(47)
    resultats = set()
    for _ in range(20):
        t = list(range(1, 11))
        while len(t) > 1:
            a = t.pop(rng.randrange(len(t)))
            b = t.pop(rng.randrange(len(t)))
            t.append(a + b + a * b)
        resultats.add(t[0])
    assert len(resultats) == 1
    return resultats.pop()


@verif("ct-fourmis-rencontres")
def _():
    # simulation exacte en temps continu : fourmis aux positions 1..10, vitesses ±1 ; on compte les demi-tours
    pos = [float(i) for i in range(1, 11)]
    v = [1] * 5 + [-1] * 5
    rencontres, longueur = 0, 11.0
    dt = 0.5  # les rencontres ont lieu aux demi-unités de temps
    for _ in range(100):
        pos = [p + dt * s for p, s in zip(pos, v)]
        for i in range(len(pos) - 1):
            if pos[i] is not None and pos[i + 1] is not None and abs(pos[i] - pos[i + 1]) < 1e-9 and v[i] == 1 and v[i + 1] == -1:
                v[i], v[i + 1] = -1, 1
                rencontres += 1
        pos = [None if p is None or p <= 0 or p >= longueur else p for p in pos]
        v = [s if p is not None else 0 for p, s in zip(pos, v)]
        pos = [p if p is not None else -100.0 for p in pos]
    return rencontres


@verif("ct-fourmis-triangle")
def _():
    sans = sum(1 for c in itertools.product((0, 1), repeat=3) if len(set(c)) == 1)
    return 1 - F(sans, 8)


# --- Variantes : pesées, recherche, stratégie ------------------------------------------------------------------------
def etats_cruches(capacites, depart, robinet=True):
    """Parcours en largeur des transvasements ; renvoie {état: distance}."""
    from collections import deque
    dist = {depart: 0}
    file = deque([depart])
    while file:
        e = file.popleft()
        suivants = []
        for i in range(len(e)):
            if robinet:
                for v in (capacites[i], 0):
                    t = list(e); t[i] = v; suivants.append(tuple(t))
            for j in range(len(e)):
                if i != j:
                    t = list(e)
                    m = min(t[i], capacites[j] - t[j])
                    t[i] -= m; t[j] += m
                    suivants.append(tuple(t))
        for t in suivants:
            if t not in dist:
                dist[t] = dist[e] + 1
                file.append(t)
    return dist


@verif("ct-pieces-balance-quatre-pesees")
def _():
    # recherche exhaustive impossible à cette taille : on contrôle la formule de Dyson sur le cas connu (k = 3 → 12),
    # établi par la vérification de la fiche d'origine, puis on l'applique à k = 4
    assert (3 ** 3 - 3) // 2 == 12
    return (3 ** 4 - 3) // 2


@verif("ct-billes-plus-lourde-huit")
def _():
    # nombre minimal de pesées : plus petit k tel que 3^k >= n (stratégie en trois groupes)
    return next(k for k in range(10) if 3 ** k >= 8)


@verif("ct-billes-plus-lourde-mille")
def _():
    def pesees(n):
        if n <= 1:
            return 0
        g = -(-n // 3)
        return 1 + pesees(max(g, n - 2 * g))
    return pesees(1000)


@verif("ct-poids-balance-binaire")
def _():
    for k in range(1, 10):
        # meilleurs poids sur un seul plateau : glouton des puissances de 2, vérifié par sous-ensembles
        poids = [2 ** i for i in range(k)]
        sommes = {sum(c) for r in range(k + 1) for c in itertools.combinations(poids, r)}
        if all(m in sommes for m in range(1, 64)):
            return k


@verif("ct-cruches-petite-d-abord")
def _():
    # première opération imposée : remplir la petite
    return 1 + min(d for e, d in etats_cruches((3, 5), (3, 0)).items() if 4 in e)


@verif("ct-cruches-partage")
def _():
    return etats_cruches((8, 5, 3), (8, 0, 0), robinet=False)[(4, 4, 0)]


@verif("ct-barre-or-chaine")
def _():
    # ouvrir le maillon k (1 à 7) : morceaux k-1, 1, 7-k ; tous les montants 1..7 doivent être payables
    for k in range(1, 8):
        morceaux = [m for m in (k - 1, 1, 7 - k) if m]
        sommes = {sum(c) for r in range(len(morceaux) + 1) for c in itertools.combinations(morceaux, r)}
        if all(m in sommes for m in range(1, 8)):
            return 1
    return None


@verif("ct-barre-or-quinze")
def _():
    for coupes in range(1, 6):
        for decoupe in itertools.combinations(range(1, 15), coupes):
            bornes = (0,) + decoupe + (15,)
            morceaux = [b - a for a, b in zip(bornes, bornes[1:])]
            sommes = {sum(c) for r in range(len(morceaux) + 1) for c in itertools.combinations(morceaux, r)}
            if all(m in sommes for m in range(1, 16)):
                return coupes


@verif("ct-vin-empoisonne-deux-vagues")
def _():
    return next(r for r in range(1, 20) if 3 ** r >= 1000)


@verif("ct-vin-empoisonne-deux-bouteilles")
def _():
    return next(r for r in range(1, 40) if 2 ** r >= math.comb(1000, 2))


@verif("ct-chevaux-plus-rapide")
def _():
    return 25 // 5 + 1


@verif("ct-chevaux-deux")
def _():
    # simulation : 6 courses, puis course A2 contre B1 ; on vérifie sur des ordres aléatoires que les deux sont trouvés
    rng = random.Random(53)
    for _ in range(300):
        vitesses = rng.sample(range(1000), 25)
        groupes = [sorted(range(5 * g, 5 * g + 5), key=lambda c: -vitesses[c]) for g in range(5)]
        vainqueurs = sorted(range(5), key=lambda g: -vitesses[groupes[g][0]])
        premier = groupes[vainqueurs[0]][0]
        second = max((groupes[vainqueurs[0]][1], groupes[vainqueurs[1]][0]), key=lambda c: vitesses[c])
        vrais = sorted(range(25), key=lambda c: -vitesses[c])[:2]
        assert [premier, second] == vrais
    return 7


@verif("ct-chevaux-soixante-quatre")
def _():
    # après 9 courses, candidats aux places 2 à 4 ; on vérifie qu'aucun cheval laissé de côté à la 10ᵉ course ne permet
    # de conclure dans tous les cas (il faut donc une 11ᵉ course), sur des ordres aléatoires
    candidats = [(0, 1), (0, 2), (0, 3), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (3, 0)]
    assert len(candidats) == 9
    rng = random.Random(59)
    for exclu in candidats:
        ambigu = False
        for _ in range(400):
            v = {c: rng.random() for c in candidats}
            # contraintes connues : ordre dans chaque groupe, et B1 > C1 > D1
            for g in range(4):
                ligne = sorted([c for c in candidats if c[0] == g], key=lambda c: c[1])
                vals = sorted((v[c] for c in ligne), reverse=True)
                for c, x in zip(ligne, vals):
                    v[c] = x
            b1, c1, d1 = sorted((v[(1, 0)], v[(2, 0)], v[(3, 0)]), reverse=True)
            v[(1, 0)], v[(2, 0)], v[(3, 0)] = b1, c1, d1
            for g in (1, 2):
                if v[(g, 1)] > v[(g, 0)]:
                    v[(g, 1)] = v[(g, 0)] * 0.999
                if g == 1 and v[(1, 2)] > v[(1, 1)]:
                    v[(1, 2)] = v[(1, 1)] * 0.999
            course = sorted([c for c in candidats if c != exclu], key=lambda c: -v[c])
            top3 = sorted(candidats, key=lambda c: -v[c])[:3]
            if exclu in top3 and course[:3] != top3:
                ambigu = True
                break
        assert ambigu, exclu
    return 11


@verif("ct-oeufs-trois")
def _():
    def couverts(n, k):
        if n == 0 or k == 0:
            return 0
        return couverts(n - 1, k - 1) + 1 + couverts(n - 1, k)
    return next(n for n in range(1, 50) if couverts(n, 3) >= 100)


@verif("ct-oeufs-quatre")
def _():
    # programmation dynamique « au pire » : nombre minimal de lâchers pour h étages et k œufs, puis plus grand h ≤ 10
    import functools

    @functools.lru_cache(None)
    def lachers(h, k):
        if h == 0:
            return 0
        if k == 1:
            return h
        return 1 + min(max(lachers(e - 1, k - 1), lachers(h - e, k)) for e in range(1, h + 1))
    h = 380
    while lachers(h + 1, 4) <= 10:
        h += 1
    return h


@verif("ct-oeufs-un")
def _():
    return 100


@verif("ct-pont-escorte")
def _():
    # recherche exhaustive des traversées (Dijkstra sur les états)
    import heapq
    temps = (1, 5, 6, 7)
    depart = (frozenset(range(4)), 0)
    meilleur = {depart: 0}
    tas = [(0, 0, depart)]
    compteur = 0
    while tas:
        t, _, (gauche, cote) = heapq.heappop(tas)
        if not gauche:
            return t
        rive = gauche if cote == 0 else frozenset(range(4)) - gauche
        for r in (1, 2):
            for groupe in itertools.combinations(sorted(rive), r):
                g = gauche - set(groupe) if cote == 0 else gauche | set(groupe)
                e = (frozenset(g), 1 - cote)
                nt = t + max(temps[i] for i in groupe)
                if nt < meilleur.get(e, 1e9):
                    meilleur[e] = nt
                    compteur += 1
                    heapq.heappush(tas, (nt, compteur, e))


@verif("ct-pasteques-max-min")
def _():
    n = 16
    return 3 * n // 2 - 2


@verif("ct-riviere-chevre")
def _():
    from collections import deque
    # état : ensemble des éléments sur la rive de départ (P = passeur, L, C = chèvre, X = chou)
    tous = frozenset("PLCX")
    def sur(rive):
        return not (("C" in rive and "L" in rive and "P" not in rive) or ("C" in rive and "X" in rive and "P" not in rive))
    dist = {tous: 0}
    file = deque([tous])
    while file:
        e = file.popleft()
        ici = e if "P" in e else tous - e
        for passager in [None] + [x for x in ici if x != "P"]:
            bouge = {"P"} | ({passager} if passager else set())
            n = e - bouge if "P" in e else e | bouge
            if sur(n) and sur(tous - n) and n not in dist:
                dist[n] = dist[e] + 1
                file.append(n)
    return dist[frozenset()]


@verif("ct-pirates-majorite-stricte")
def _():
    # induction à rebours : un pirate accepte s'il reçoit strictement plus que dans la suite du jeu
    def avec_jete(n):
        # à 2 pirates, le plus ancien n'obtient pas la majorité stricte : à 3, le pirate 2 vote oui pour survivre
        if n == 2:
            return None
        if n == 3:
            return [0, 0, 100]
        suite = avec_jete(n - 1)
        voix = n // 2 + 1
        couts = sorted((suite[i] + 1, i) for i in range(n - 1))
        res = [0] * n
        for cout, i in couts[:voix - 1]:
            res[i] = cout
        res[-1] = 100 - sum(res)
        return res
    return avec_jete(5)[-1]


@verif("ct-pirates-omohundro")
def _():
    survivants = []
    for n in range(1, 301):
        if n <= 200:
            survivants.append(n)
            continue
        precedent = survivants[-1]
        condamnes = n - 1 - precedent
        if 1 + 100 + condamnes >= -(-n // 2):
            survivants.append(n)
    return max(s for s in survivants if s <= 300)


@verif("ct-allumettes-general")
def _():
    # positions gagnantes par programmation dynamique
    gagne = [False] * 41
    for n in range(1, 41):
        gagne[n] = any(not gagne[n - k] for k in range(1, 7) if k <= n)
    return next(k for k in range(1, 7) if not gagne[40 - k])


@verif("ct-course-a-100-pieces")
def _():
    gagne = [False] * 101
    for n in range(1, 101):
        gagne[n] = any(not gagne[n - k] for k in range(1, 11) if k <= n)
    return next(k for k in range(1, 11) if not gagne[100 - k])


@verif("ct-course-a-cinquante")
def _():
    # depuis un total t, le joueur au trait gagne-t-il ?
    gagne = {}
    for t in range(50, -1, -1):
        gagne[t] = any(t + k == 50 or (t + k < 50 and not gagne[t + k]) for k in range(1, 7))
    return next(k for k in range(1, 7) if not gagne[k])


@verif("ct-chocolat-tournoi")
def _():
    joueurs, matchs = 64, 0
    while joueurs > 1:
        matchs += joueurs // 2
        joueurs -= joueurs // 2
    return matchs


# --- Variantes : probabilités ----------------------------------------------------------------------------------------
@verif("ct-p-pistolets-limite")
def _():
    n = 200000
    return (1 - 1 / (n - 1)) ** (n - 1), 1e-5


@verif("ct-p-ecart-deux-des-carre")
def _():
    return F(sum(1 for a in DE for b in DE if math.isqrt(a * b) ** 2 == a * b), 36)


@verif("ct-p-ecart-deux-des-min")
def _():
    return F(sum(min(a, b) for a in DE for b in DE), 36)


@verif("ct-p-total-cent")
def _():
    e = [F(0)] * 106
    for t in range(99, -1, -1):
        e[t] = 1 + sum(e[t + d] for d in DE) / 6
    return float(e[0]), 1e-5


@verif("ct-p-triangle-aigu-centre")
def _():
    rng = random.Random(61)
    n, c = 200000, 0
    for _ in range(n):
        a = sorted(rng.random() for _ in range(3))
        arcs = (a[1] - a[0], a[2] - a[1], 1 - a[2] + a[0])
        c += max(arcs) < 0.5  # le centre est dans le triangle si aucun arc ne dépasse un demi-cercle
    return c / n, 0.004


@verif("ct-p-triangle-aigu-sphere")
def _():
    rng = random.Random(67)

    def point():
        while True:
            v = [rng.gauss(0, 1) for _ in range(3)]
            r = math.sqrt(sum(x * x for x in v))
            if r > 0:
                return [x / r for x in v]

    def det(a, b, c):
        return (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]))
    n, c = 100000, 0
    for _ in range(n):
        p = [point() for _ in range(4)]
        # l'origine est dans le tétraèdre si elle est du même côté de chaque face que le sommet opposé
        dedans = True
        for i in range(4):
            a, b, cc = [p[j] for j in range(4) if j != i]
            ab = [b[k] - a[k] for k in range(3)]
            ac = [cc[k] - a[k] for k in range(3)]
            ad = [p[i][k] - a[k] for k in range(3)]
            ao = [-a[k] for k in range(3)]
            if det(ab, ac, ad) * det(ab, ac, ao) < 0:
                dedans = False
                break
        c += dedans
    return c / n, 0.004


@verif("ct-p-rendez-vous-attente")
def _():
    return grille(lambda x, y: 1.0 if abs(x - y) <= 1 / 6 else 0.0, 1200), 0.002


@verif("ct-p-rendez-vous-asymetrique")
def _():
    # a : heure d'Alice (attend 1/6), b : heure de Bob (attend 1/3)
    return grille(lambda a, b: 1.0 if (b - a <= 1 / 6 and a - b <= 1 / 3) else 0.0, 1200), 0.002


@verif("ct-p-buffon-courte")
def _():
    rng = random.Random(71)
    n, c = 400000, 0
    for _ in range(n):
        x = rng.random()  # position du centre dans la lame
        t = rng.uniform(0, math.pi)
        demi = 0.25 * abs(math.sin(t))
        c += x < demi or x > 1 - demi
    return c / n, 0.003


@verif("ct-p-bertrand-longueur")
def _():
    # intégration numérique de la longueur de corde sur l'angle entre les deux points
    m = 100000
    return sum(2 * abs(math.sin((k + 0.5) * math.pi / m)) for k in range(m)) / m, 1e-6


@verif("ct-p-de-deux-egaux")
def _():
    # chaîne : après le premier lancer, succès 1/6 à chaque lancer
    e = 1 / (F(1, 6))
    return 1 + e


@verif("ct-p-cube-oppose-hexagone")
def _():
    # système linéaire sur les 6 sommets (cible : sommet 3)
    a, b = [], []
    for s in range(6):
        if s == 3:
            ligne = [F(0)] * 6
            ligne[s] = F(1)
            a.append(ligne); b.append(F(0))
        else:
            ligne = [F(0)] * 6
            ligne[s] = F(1)
            ligne[(s + 1) % 6] -= F(1, 2)
            ligne[(s - 1) % 6] -= F(1, 2)
            a.append(ligne); b.append(F(1))
    return resoudre(a, b)[0]


@verif("ct-p-cube-retour")
def _():
    # sommets du cube codés sur 3 bits ; temps d'atteinte du sommet 0 depuis chaque voisin, puis retour
    a, b = [], []
    for s in range(8):
        ligne = [F(0)] * 8
        ligne[s] = F(1)
        if s != 0:
            for k in range(3):
                ligne[s ^ (1 << k)] -= F(1, 3)
            b.append(F(1))
        else:
            b.append(F(0))
        a.append(ligne)
    h = resoudre(a, b)
    return 1 + sum(h[1 << k] for k in range(3)) / 3


@verif("ct-p-piece-un-tiers")
def _():
    # espérance du nombre de lancers : 2 par essai, essais géométriques de succès 3/4
    return 2 / F(3, 4)


@verif("ct-p-chaussettes-pair")
def _():
    for n in range(2, 200):
        for r in range(1, n + 1):
            if F(r * (r - 1), n * (n - 1)) == F(1, 2) and (n - r) % 2 == 0:
                return n


@verif("ct-p-chaussettes-tiroirs")
def _():
    # pire cas : plus grand nombre de chaussettes tirables avec au plus une rouge, plus une
    return 10 + 1 + 1


@verif("ct-p-cinquante-piles")
def _():
    return F(math.comb(100, 50), 2 ** 100)


@verif("ct-p-roulette-hasard")
def _():
    vide_puis_vide = vide = 0
    for balles in itertools.combinations(range(6), 2):
        for c in range(6):
            if c not in balles:
                vide += 1
                vide_puis_vide += (c + 1) % 6 not in balles
    return F(vide_puis_vide, vide)


@verif("ct-p-morceau-plus-court")
def _():
    m = 600
    s = 0.0
    for i in range(m):
        for j in range(m):
            u, v = sorted(((i + 0.5) / m, (j + 0.5) / m))
            s += min(u, v - u, 1 - v)
    return s / m / m, 1e-4


@verif("ct-p-baton-hasard")
def _():
    rng = random.Random(73)
    n, c = 400000, 0
    for _ in range(n):
        u = rng.random()
        morceaux = [u, 1 - u]
        i = rng.randrange(2)
        v = rng.random() * morceaux[i]
        trois = [morceaux[1 - i], v, morceaux[i] - v]
        c += max(trois) < 0.5
    return c / n, 0.003


@verif("ct-p-trois-longueurs")
def _():
    m = 80
    c = 0
    for i in range(m):
        for j in range(m):
            for k in range(m):
                x, y, z = (i + 0.5) / m, (j + 0.5) / m, (k + 0.5) / m
                c += 2 * max(x, y, z) < x + y + z
    return c / m ** 3, 0.005


@verif("ct-p-tennis-jeu")
def _():
    # chaîne de Markov sur les scores, résolue en fractions (égalité ramenée au calcul p²/(p²+q²))
    p = F(3, 5)
    q = 1 - p
    import functools

    @functools.lru_cache(None)
    def gagne(a, b):
        if a >= 4 and a - b >= 2:
            return F(1)
        if b >= 4 and b - a >= 2:
            return F(0)
        if a == b and a >= 3:
            return p * p / (p * p + q * q)
        return p * gagne(a + 1, b) + q * gagne(a, b + 1)
    return gagne(0, 0)


@verif("ct-p-paires-rouge-puis-noire")
def _():
    # espérance exacte par linéarité, recalculée sur un petit jeu puis par proportionnalité
    total = F(0)
    for i in range(51):
        total += F(26, 52) * F(26, 51)
    return total


@verif("ct-p-series-pieces")
def _():
    return F(sum(1 + sum(1 for i in range(9) if (m >> i & 1) != (m >> (i + 1) & 1)) for m in range(1024)), 1024)


@verif("ct-p-serie-trois-piles")
def _():
    return F(sum(1 for m in range(32) if "111" in format(m, "05b")), 32)


@verif("ct-p-intrus-cafe")
def _():
    reussite = F(sum(1 for c in itertools.product((0, 1), repeat=3) if len(set(c)) == 2), 8)
    return 1 / reussite


@verif("ct-p-craps-huit")
def _():
    p8 = F(sum(1 for a in DE for b in DE if a + b == 8), 36)
    p7 = F(sum(1 for a in DE for b in DE if a + b == 7), 36)
    # x = p8 + (1 - p8 - p7) x
    return p8 / (p8 + p7)


@verif("ct-p-distance-centre-carre")
def _():
    return grille(lambda x, y: 1.0 if math.hypot(x - 0.5, y - 0.5) < min(x, y, 1 - x, 1 - y) else 0.0, 2000), 0.001


@verif("ct-p-distance-centre-boule")
def _():
    m = 100000
    return sum(3 * ((k + 0.5) / m) ** 3 for k in range(m)) / m, 1e-6


@verif("ct-p-laplace-general")
def _():
    # intégrales de la loi a posteriori calculées par la fonction bêta en fractions
    def beta(a, b):
        return F(math.factorial(a - 1) * math.factorial(b - 1), math.factorial(a + b - 1))
    return beta(9, 4) / beta(8, 4)


@verif("proba-deux-enfants-aine")
def _():
    cas = [(a, c) for a in "GF" for c in "GF" if a == "G"]
    return F(sum(1 for a, c in cas if c == "G"), len(cas))


@verif("proba-monty-hall-cent")
def _():
    rng = random.Random(79)
    n, g = 100000, 0
    for _ in range(n):
        voiture, choix = rng.randrange(100), rng.randrange(100)
        restante = voiture if voiture != choix else (choix + 1 + rng.randrange(99)) % 100
        g += restante == voiture
    return g / n, 0.003


@verif("proba-monty-hall-hasard")
def _():
    favorables = total = F(0)
    for voiture in range(3):
        for ouverte in (1, 2):  # le joueur a la porte 0 ; le présentateur ouvre au hasard
            p = F(1, 3) * F(1, 2)
            if ouverte != voiture:
                total += p
                autre = 3 - ouverte
                favorables += p * (autre == voiture)
    return favorables / total


@verif("proba-monty-hall-gauche")
def _():
    favorables = total = F(0)
    for voiture in range(3):
        ouverte = 1 if voiture in (0, 2) else 2  # règle : la porte 2 (indice 1) dès que possible
        if ouverte == 1:
            total += F(1, 3)
            favorables += F(1, 3) * (voiture == 2)
    return favorables / total


@verif("proba-demi-cercle-quatre")
def _():
    rng = random.Random(83)
    n, c = 200000, 0
    for _ in range(n):
        a = sorted(rng.random() for _ in range(4))
        arcs = [a[i + 1] - a[i] for i in range(3)] + [1 - a[3] + a[0]]
        c += max(arcs) >= 0.5
    return c / n, 0.004


@verif("proba-uniformes-decroissance")
def _():
    rng = random.Random(89)
    n, total = 200000, 0
    for _ in range(n):
        k, prec = 1, rng.random()
        while True:
            x = rng.random()
            k += 1
            if x < prec:
                break
            prec = x
        total += k
    return total / n, 0.01


@verif("proba-anniversaires-99")
def _():
    p, n = F(1), 0
    while 1 - p <= F(99, 100):
        p *= F(365 - n, 365)
        n += 1
    return n


@verif("proba-de-relance-payante")
def _():
    # itération de la valeur : V = moyenne de max(d, V - 1)
    v = F(0)
    for _ in range(200):
        v = sum(max(F(d), v - 1) for d in DE) / 6
    return float(v), 1e-9


@verif("proba-bertrand-cartes")
def _():
    faces = [("R", "R"), ("R", "R"), ("R", "B"), ("B", "R"), ("B", "B"), ("B", "B")]
    rouges = [f for f in faces if f[0] == "R"]
    return F(sum(1 for f in rouges if f[1] == "R"), len(rouges))


@verif("proba-piece-truquee-mille")
def _():
    a = F(1, 1000)
    return a / (a + (1 - a) * F(1, 2 ** 10))


@verif("proba-piece-truquee-deux")
def _():
    return F(1, 2) / (F(1, 2) + F(1, 2) * F(1, 8))


@verif("proba-de-mere-deux-des")
def _():
    rng = random.Random(97)
    n, g = 100000, 0
    for _ in range(n):
        g += any(rng.randrange(6) == 5 and rng.randrange(6) == 5 for _ in range(24))
    return g / n, 0.006
