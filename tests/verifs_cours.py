"""Vérifications indépendantes des exercices numériques du cours (contenu/cours/*.md).

Même principe que verifs.py : chaque fonction recalcule la réponse par une autre méthode que la solution rédigée et
renvoie une valeur exacte ou un couple (valeur, tolérance absolue).
"""
from __future__ import annotations

import itertools
import math
import random
from fractions import Fraction as F

from tests.verifs import (DE, Phi, attente_motif, grille, marche_absorbee, maximiser, phi, prix, quantile_normal,
                          resoudre, simpson)

VERIFS_COURS: dict = {}


def verif(ident):
    def deco(f):
        if ident in VERIFS_COURS:
            raise ValueError(f"vérification en double : {ident}")
        VERIFS_COURS[ident] = f
        return f
    return deco


def cholesky(m):
    """Décomposition de Cholesky d'une matrice symétrique ; lève ValueError si elle n'est pas définie positive."""
    n = len(m)
    L = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1):
            s = m[i][j] - sum(L[i][k] * L[j][k] for k in range(j))
            if i == j:
                if s <= 0:
                    raise ValueError("non définie positive")
                L[i][i] = math.sqrt(s)
            else:
                L[i][j] = s / L[j][j]
    return L


def echantillon_correle(cov, n, graine):
    """Tirages gaussiens de matrice de covariance donnée (par Cholesky)."""
    L = cholesky(cov)
    rng = random.Random(graine)
    d = len(cov)
    for _ in range(n):
        z = [rng.gauss(0, 1) for _ in range(d)]
        yield [sum(L[i][k] * z[k] for k in range(i + 1)) for i in range(d)]


def variance_empirique(xs):
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)


# --- Chapitre 1 : espérance, variance, covariance ------------------------------------------------------------------
@verif("ex-paires-anniversaire")
def _():
    rng = random.Random(1)
    n, total = 40000, 0
    for _ in range(n):
        jours = [rng.randrange(365) for _ in range(30)]
        compte = {}
        for j in jours:
            compte[j] = compte.get(j, 0) + 1
        total += sum(c * (c - 1) // 2 for c in compte.values())
    return total / n, 0.02


@verif("ex-min-trois-des")
def _():
    return F(sum(min(t) for t in itertools.product(DE, repeat=3)), 216)


@verif("ex-cov-points-fixes")
def _():
    perms = list(itertools.permutations(range(5)))
    n = len(perms)
    a = F(sum(p[0] == 0 for p in perms), n)
    b = F(sum(p[1] == 1 for p in perms), n)
    ab = F(sum(p[0] == 0 and p[1] == 1 for p in perms), n)
    return ab - a * b


@verif("ex-var-combinaison")
def _():
    tirages = [2 * x - y for x, y in echantillon_correle([[4, 1.5], [1.5, 9]], 200000, 2)]
    return variance_empirique(tirages), 0.25


@verif("ex-var-moyenne-correlee")
def _():
    n, rho = 10, 0.3
    cov = [[1.0 if i == j else rho for j in range(n)] for i in range(n)]
    return sum(cov[i][j] for i in range(n) for j in range(n)) / n ** 2, 1e-12


@verif("ex-rho-min-quatre")
def _():
    def definie(rho):
        try:
            cholesky([[1.0 if i == j else rho for j in range(4)] for i in range(4)])
            return True
        except ValueError:
            return False
    lo, hi = -0.99, 0.0
    for _ in range(80):
        mid = (lo + hi) / 2
        if definie(mid):
            hi = mid
        else:
            lo = mid
    return hi, 1e-9


@verif("ex-beta-calcul")
def _():
    s, m, rho = 0.30, 0.15, 0.6
    cov = [[m * m, rho * s * m], [rho * s * m, s * s]]
    xs, ys = [], []
    for x, y in echantillon_correle(cov, 200000, 3):
        xs.append(x)
        ys.append(y)
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    return sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / sum((a - mx) ** 2 for a in xs), 0.01


# --- Chapitre 2 : conditionnement, Markov, martingales -------------------------------------------------------------
@verif("ex-bayes-deux-tests")
def _():
    # dénombrement exact sur les deux états et les deux résultats de tests
    p_malade, sens, faux = F(1, 100), F(99, 100), F(5, 100)
    pos_malade = p_malade * sens * sens
    pos_sain = (1 - p_malade) * faux * faux
    return pos_malade / (pos_malade + pos_sain)


@verif("ex-variance-wald")
def _():
    # loi exacte de S par convolution : N uniforme sur 1..6 puis somme de N dés
    loi = {}
    somme_de = {0: F(1)}
    for n in range(1, 7):
        nouvelle = {}
        for s, p in somme_de.items():
            for f in DE:
                nouvelle[s + f] = nouvelle.get(s + f, 0) + p / 6
        somme_de = nouvelle
        for s, p in somme_de.items():
            loi[s] = loi.get(s, 0) + p / 6
    m = sum(s * p for s, p in loi.items())
    return sum((s - m) ** 2 * p for s, p in loi.items())


@verif("ex-attente-ppf")
def _():
    return attente_motif("PPF", {"P": F(1, 2), "F": F(1, 2)})


@verif("ex-markov-regimes")
def _():
    calme = 1.0
    for _ in range(5000):
        calme = calme * 0.98 + (1 - calme) * 0.05
    return calme, 1e-9


@verif("ex-duree-ruine-biaisee")
def _():
    return marche_absorbee(2, 4, F(3, 5))[1]


@verif("ex-de-quatre-lancers")
def _():
    v = F(7, 2)
    for _ in range(3):
        v = sum(max(F(k), v) for k in DE) / 6
    return v


# --- Chapitre 3 : lois gaussiennes ---------------------------------------------------------------------------------
@verif("ex-moment-six")
def _():
    return simpson(lambda z: z ** 6 * phi(z), -14, 14, 40000), 1e-8


@verif("ex-laplace")
def _():
    s = 0.5
    return simpson(lambda x: math.exp(x) * phi((x - 1) / s) / s, 1 - 14 * s, 1 + 14 * s, 40000), 1e-8


@verif("ex-bachelier")
def _():
    return simpson(lambda z: (z - 0.5) * phi(z), 0.5, 14, 40000), 1e-9


@verif("ex-lognormale-proba")
def _():
    lo, hi = -10.0, 10.0
    for _ in range(100):           # seuil z* tel que 100·exp(−0,02 + 0,2 z) = 110
        mid = (lo + hi) / 2
        if 100 * math.exp(-0.02 + 0.2 * mid) < 110:
            lo = mid
        else:
            hi = mid
    return simpson(phi, lo, 14, 40000), 1e-8


def densite_couple(x, y, rho):
    d = 1 - rho * rho
    return math.exp(-(x * x - 2 * rho * x * y + y * y) / (2 * d)) / (2 * math.pi * math.sqrt(d))


@verif("ex-cond-gauss")
def _():
    num = simpson(lambda y: y * densite_couple(2, y, 0.6), -12, 12, 20000)
    den = simpson(lambda y: densite_couple(2, y, 0.6), -12, 12, 20000)
    return num / den, 1e-8


@verif("ex-var-cond")
def _():
    den = simpson(lambda y: densite_couple(2, y, 0.6), -12, 12, 20000)
    m1 = simpson(lambda y: y * densite_couple(2, y, 0.6), -12, 12, 20000) / den
    m2 = simpson(lambda y: y * y * densite_couple(2, y, 0.6), -12, 12, 20000) / den
    return m2 - m1 ** 2, 1e-8


@verif("ex-quadrant-negatif")
def _():
    rng = random.Random(31)
    n, k, rho = 400000, 0, -0.5
    s = math.sqrt(1 - rho * rho)
    for _ in range(n):
        x = rng.gauss(0, 1)
        y = rho * x + s * rng.gauss(0, 1)
        k += x > 0 and y > 0
    return k / n, 0.003


# --- Chapitre 5 : mouvement brownien -------------------------------------------------------------------------------
def increments(dates, graine, n):
    """Tirages de (W_t) aux dates données, par accroissements indépendants."""
    rng = random.Random(graine)
    for _ in range(n):
        w, t0, valeurs = 0.0, 0.0, []
        for t in dates:
            w += rng.gauss(0, math.sqrt(t - t0))
            t0 = t
            valeurs.append(w)
        yield valeurs


@verif("ex-bm-var-somme-trois")
def _():
    # matrice de covariance min(s, t) sommée : Var(Σ W_i) = Σ_i Σ_j min(i, j)
    return sum(min(i, j) for i in (1, 2, 3) for j in (1, 2, 3))


@verif("ex-bm-moment-croise")
def _():
    tirages = list(increments([1, 3], 41, 300000))
    return sum(a * a * b * b for a, b in tirages) / len(tirages), 0.1


@verif("ex-bm-esperance-conditionnelle")
def _():
    rng = random.Random(42)
    n = 200000
    return sum((2 + rng.gauss(0, math.sqrt(2))) ** 2 for _ in range(n)) / n, 0.05


@verif("ex-bm-variance-qv")
def _():
    rng = random.Random(43)
    vals = []
    for _ in range(20000):
        vals.append(sum(rng.gauss(0, 0.1) ** 2 for _ in range(100)))
    m = sum(vals) / len(vals)
    return sum((v - m) ** 2 for v in vals) / len(vals), 0.0015


@verif("ex-bm-sortie")
def _():
    # marche ±1 : départ 1 (niveau 0), absorption en 0 (niveau −1) et en 3 (niveau +2)
    return marche_absorbee(1, 3, F(1, 2))[0]


@verif("ex-bm-laplace-atteinte")
def _():
    # densité du temps d'atteinte de 1 (réflexion) : a/√(2π t³) e^{−a²/(2t)} ; on intègre e^{−t/2} contre elle
    def dens(t):
        return math.exp(-1 / (2 * t)) / math.sqrt(2 * math.pi * t ** 3)
    morceaux = [(1e-6, 1), (1, 20), (20, 400), (400, 4000)]
    return sum(simpson(lambda t: math.exp(-t / 2) * dens(t), a, b, 20000) for a, b in morceaux), 1e-6


@verif("ex-bm-reflexion")
def _():
    # simulation exacte du franchissement par pont brownien entre les dates de la grille
    rng = random.Random(44)
    n, pas = 30000, 40
    dt = 4 / pas
    touche = 0
    for _ in range(n):
        w = 0.0
        for _k in range(pas):
            w2 = w + rng.gauss(0, math.sqrt(dt))
            if w2 >= 2 or rng.random() < math.exp(-2 * (2 - w) * (2 - w2) / dt):
                touche += 1
                break
            w = w2
    return touche / n, 0.012


# --- Chapitre 6 : intégrale et lemme d'Itô -------------------------------------------------------------------------
def sommes_ito(T, pas, n, graine, integrande):
    """Sommes de Riemann d'Itô Σ H(t_k, W_k) ΔW_k (intégrande évalué au début de chaque pas) ; renvoie aussi W_T."""
    rng = random.Random(graine)
    dt = T / pas
    for _ in range(n):
        w, s = 0.0, 0.0
        for k in range(pas):
            d = rng.gauss(0, math.sqrt(dt))
            s += integrande(k * dt, w) * d
            w += d
        yield s, w


@verif("ex-ito-isometrie")
def _():
    vals = [s for s, _ in sommes_ito(2, 200, 20000, 51, lambda t, w: t)]
    return variance_empirique(vals), 0.1


@verif("ex-ito-covariance")
def _():
    paires = list(sommes_ito(1, 200, 30000, 52, lambda t, w: t))
    ms = sum(s for s, _ in paires) / len(paires)
    mw = sum(w for _, w in paires) / len(paires)
    return sum((s - ms) * (w - mw) for s, w in paires) / len(paires), 0.02


@verif("ex-ito-moment-six")
def _():
    s = math.sqrt(2)
    return simpson(lambda x: x ** 6 * phi(x / s) / s, -30, 30, 60000), 1e-6


@verif("ex-ito-exponentielle")
def _():
    return simpson(lambda x: math.exp(2 * x) * phi(x), -20, 20, 60000), 1e-8


@verif("ex-ito-aire")
def _():
    # ∫∫_{[0,2]²} min(s, t) ds dt = 8 × ∫∫_{[0,1]²} min(s, t) (changement d'échelle)
    return 8 * grille(min, 600), 1e-3


@verif("ex-ito-variance-wdw")
def _():
    vals = [s for s, _ in sommes_ito(2, 200, 20000, 53, lambda t, w: w)]
    return variance_empirique(vals), 0.1


# --- Chapitre 7 : équations différentielles stochastiques -----------------------------------------------------------
@verif("ex-eds-gbm-variance")
def _():
    m = simpson(lambda z: 100 * math.exp(-0.02 + 0.2 * z) * phi(z), -12, 12, 24000)
    m2 = simpson(lambda z: (100 * math.exp(-0.02 + 0.2 * z)) ** 2 * phi(z), -12, 12, 24000)
    return m2 - m * m, 1e-6


@verif("ex-eds-gbm-proba")
def _():
    # Euler très fin sur dS = 0,1 S dt + 0,2 S dW, sans passer par la solution explicite
    rng = random.Random(71)
    n, pas = 20000, 100
    dt = 1 / pas
    gagnants = 0
    for _ in range(n):
        s = 1.0
        for _ in range(pas):
            s += 0.1 * s * dt + 0.2 * s * rng.gauss(0, math.sqrt(dt))
        gagnants += s > 1
    return gagnants / n, 0.012


@verif("ex-eds-ou-demi-vie")
def _():
    lo, hi = 0.0, 100.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if 0.95 ** mid > 0.5:
            lo = mid
        else:
            hi = mid
    return lo, 1e-9


@verif("ex-eds-ou-variance")
def _():
    # Euler fin sur dX = −2X dt + dW
    rng = random.Random(72)
    n, pas = 20000, 200
    dt = 1 / pas
    vals = []
    for _ in range(n):
        x = 0.0
        for _ in range(pas):
            x += -2 * x * dt + rng.gauss(0, math.sqrt(dt))
        vals.append(x)
    return variance_empirique(vals), 0.01


@verif("ex-eds-ar1-covariance")
def _():
    rng = random.Random(73)
    x, xs = 0.0, []
    for i in range(400000):
        x = 0.5 * x + rng.gauss(0, 1)
        if i > 100:
            xs.append(x)
    m = sum(xs) / len(xs)
    return sum((xs[i] - m) * (xs[i + 3] - m) for i in range(len(xs) - 3)) / (len(xs) - 3), 0.015


@verif("ex-eds-vasicek-variance")
def _():
    # ∫∫ Cov(r_s, r_t) ds dt avec Cov(r_s, r_t) = (e^{−|t−s|} − e^{−(t+s)})/2 (κ = σ = 1, r₀ déterministe)
    return grille(lambda s, t: (math.exp(-abs(t - s)) - math.exp(-(t + s))) / 2, 600), 1e-4


@verif("ex-eds-cir-moyenne")
def _():
    rng = random.Random(74)
    n, pas = 10000, 100
    dt = 2 / pas
    total = 0.0
    for _ in range(n):
        r = 0.02
        for _ in range(pas):
            r += 0.5 * (0.04 - r) * dt + 0.1 * math.sqrt(max(r, 0.0)) * rng.gauss(0, math.sqrt(dt))
        total += r
    return total / n, 0.0004


@verif("ex-eds-feynman-kac")
def _():
    # solution de l'EDP de la chaleur rétrograde par différences finies explicites, sans passer par l'espérance
    L, nx, nt = 8.0, 321, 4000
    dx = 2 * L / (nx - 1)
    dt = 1 / nt
    xs = [-L + i * dx for i in range(nx)]
    u = [x ** 4 for x in xs]
    for _ in range(nt):
        nouveau = u[:]
        for i in range(1, nx - 1):
            nouveau[i] = u[i] + 0.5 * dt * (u[i + 1] - 2 * u[i] + u[i - 1]) / dx ** 2
        u = nouveau  # bords figés à x⁴ : à 7 unités de x = 1, leur influence est négligeable
    return u[xs.index(min(xs, key=lambda x: abs(x - 1)))], 0.01


# --- Chapitre 8 : absence d'arbitrage et probabilité risque-neutre --------------------------------------------------
def arbre(S, u, d, R, n, payoff, americaine=False):
    """Induction à rebours dans un arbre recombinant (R : facteur de capitalisation par pas)."""
    q = (R - d) / (u - d)
    v = [payoff(S * u ** j * d ** (n - j)) for j in range(n + 1)]
    for k in range(n - 1, -1, -1):
        v = [(q * v[j + 1] + (1 - q) * v[j]) / R for j in range(k + 1)]
        if americaine:
            v = [max(v[j], payoff(S * u ** j * d ** (k - j))) for j in range(k + 1)]
    return v[0]


@verif("ex-rn-forward-dividende")
def _():
    # compte de trésorerie du cash-and-carry, capitalisé pas à pas (un pas par jour)
    pas = 3650
    dt = 1 / pas
    tresorerie = -100.0
    for k in range(pas):
        tresorerie *= math.exp(0.04 * dt)
        if k + 1 == pas // 2:
            tresorerie += 3
    return -tresorerie, 1e-6


@verif("ex-rn-parite")
def _():
    def call_bs(sig):
        d1 = (0.05 + sig * sig / 2) / sig
        return 100 * Phi(d1) - 100 * math.exp(-0.05) * Phi(d1 - sig)
    lo, hi = 0.01, 1.0
    for _ in range(80):
        mid = (lo + hi) / 2
        if call_bs(mid) < 10:
            lo = mid
        else:
            hi = mid
    return prix(lambda s: max(100 - s, 0.0), sig=lo, r=0.05), 1e-5


@verif("ex-rn-un-pas")
def _():
    delta, b = resoudre([[F(120), F(1)], [F(90), F(1)]], [F(20), F(0)])
    return float(delta * 100 + b), 1e-12


@verif("ex-rn-papillon")
def _():
    # le papillon (90, 100, 110) a un flux positif : son coût 14 − 2·8 + x doit l'être aussi
    flux = [max(s - 90, 0) - 2 * max(s - 100, 0) + max(s - 110, 0) for s in range(0, 300)]
    assert min(flux) == 0
    xs = [x / 100 for x in range(0, 801)]
    return min(x for x in xs if 14 - 2 * 8 + x >= 0), 1e-9


@verif("ex-rn-put-americain")
def _():
    return arbre(100, 1.2, 0.8, 1.05, 2, lambda s: max(100 - s, 0.0), americaine=True), 1e-9


@verif("ex-rn-girsanov")
def _():
    return simpson(lambda x: x * x * math.exp(x - 0.5) * phi(x), -20, 20, 40000), 1e-8


@verif("ex-rn-digitale")
def _():
    return prix(lambda s: 1.0 if s > 100 else 0.0), 5e-4


@verif("ex-rn-puissance")
def _():
    return prix(lambda s: s * s, S=1.0), 1e-8


# --- Chapitre 9 : Black-Scholes (intégration numérique sous la probabilité risque-neutre, sans formule fermée) ------
@verif("ex-bs-call-atm")
def _():
    return prix(lambda s: max(s - 100, 0.0)), 1e-6


@verif("ex-bs-put")
def _():
    return prix(lambda s: max(110 - s, 0.0), sig=0.25, T=0.5, r=0.03), 1e-5


@verif("ex-bs-delta")
def _():
    h = 0.01
    return (prix(lambda s: max(s - 100, 0.0), S=100 + h) - prix(lambda s: max(s - 100, 0.0), S=100 - h)) / (2 * h), 1e-4


@verif("ex-bs-approx")
def _():
    return prix(lambda s: max(s - 100, 0.0), sig=0.3, T=0.25), 1e-6


@verif("ex-bs-straddle")
def _():
    return prix(lambda s: abs(s - 100), sig=0.16, T=0.25), 1e-6


@verif("ex-bs-vol-implicite")
def _():
    lo, hi = 0.05, 0.5
    for _ in range(40):
        mid = (lo + hi) / 2
        if prix(lambda s: max(s - 100, 0.0), sig=mid, T=0.25) < 4:
            lo = mid
        else:
            hi = mid
    return lo, 2e-4


@verif("ex-bs-dividende")
def _():
    return prix(lambda s: max(s - 100, 0.0), r=0.03, q=0.03), 1e-6


@verif("ex-bs-black76")
def _():
    # sous Q, le futures est une martingale : F_T = 50·exp(−σ²/2 + σZ), actualisé au taux de 5 %
    return math.exp(-0.05) * simpson(lambda z: max(50 * math.exp(-0.08 + 0.4 * z) - 50, 0.0) * phi(z), -12, 12, 48000), 1e-6


# --- Chapitre 10 : grecques et couverture (différences finies sur des prix obtenus par intégration) ----------------
def _call(**kw):
    return prix(lambda s: max(s - 100, 0.0), **kw)


@verif("ex-gr-gamma")
def _():
    h = 0.5
    return (_call(S=100 + h) - 2 * _call(S=100) + _call(S=100 - h)) / h ** 2, 2e-5


@verif("ex-gr-vega")
def _():
    return (_call(sig=0.21) - _call(sig=0.19)) / 2, 1e-4


@verif("ex-gr-theta")
def _():
    h = 1 / 365
    return -(_call(T=1 + h) - _call(T=1 - h)) / (2 * h) / 365, 1e-6


@verif("ex-gr-pnl-vol")
def _():
    # couverture discrète (500 pas) au delta de la vol réalisée, sur des trajectoires à 25 % de vol
    def delta(S, s, T):
        return Phi((math.log(S / 100) + s * s * T / 2) / (s * math.sqrt(T))) if T > 1e-12 else float(S > 100)
    rng = random.Random(81)
    prime = _call(sig=0.2)
    n, pas, total = 600, 500, 0.0
    dt = 1 / pas
    for _ in range(n):
        S, d = 100.0, delta(100.0, 0.25, 1.0)
        cash = -prime + d * S
        for i in range(1, pas + 1):
            S *= math.exp(-0.25 ** 2 / 2 * dt + 0.25 * math.sqrt(dt) * rng.gauss(0, 1))
            nd = delta(S, 0.25, 1 - i * dt)
            cash += (nd - d) * S
            d = nd
        total += max(S - 100, 0.0) + cash - d * S
    return total / n, 0.03


@verif("ex-gr-point-mort")
def _():
    # gamma et theta mesurés par différences finies (T = 0,5), puis ½ Γ dS² = −Θ/252
    h, k = 0.5, 1 / 252
    g = (_call(S=100 + h, sig=0.16, T=0.5) - 2 * _call(S=100, sig=0.16, T=0.5) + _call(S=100 - h, sig=0.16, T=0.5)) / h ** 2
    theta_jour = -(_call(sig=0.16, T=0.5 + k) - _call(sig=0.16, T=0.5 - k)) / (2 * k) / 252
    return math.sqrt(-2 * theta_jour / g), 2e-3


@verif("ex-gr-gamma-neutre")
def _():
    n, s = resoudre([[F(4, 100), F(0)], [F(6, 10), F(1)]], [F(2), F(54)])
    return float(s), 1e-12


# --- Chapitre 11 : volatilité ----------------------------------------------------------------------------------------
@verif("ex-vol-annualiser")
def _():
    # variance de la somme de 252 rendements indépendants : Σ_i Σ_j Cov(r_i, r_j) avec une matrice diagonale
    n, s = 252, 1.2
    return math.sqrt(sum(s * s if i == j else 0.0 for i in range(n) for j in range(n))), 1e-9


@verif("ex-vol-newton")
def _():
    c = prix(lambda s: max(s - 100, 0.0))
    vega = (prix(lambda s: max(s - 100, 0.0), sig=0.2001) - prix(lambda s: max(s - 100, 0.0), sig=0.1999)) / 0.0002
    return 0.2 + (10 - c) / vega, 1e-5


@verif("ex-vol-forward")
def _():
    lo, hi = 0.0, 0.5
    for _ in range(80):
        mid = (lo + hi) / 2
        integrale = simpson(lambda t: (0.2 if t < 1 else mid) ** 2, 0, 2, 2000)
        if integrale < 2 * 0.18 ** 2:
            lo = mid
        else:
            hi = mid
    return lo, 1e-4


def _svi(k, a, b, rho, m, s):
    return a + b * (rho * (k - m) + math.sqrt((k - m) ** 2 + s * s))


@verif("ex-vol-svi-min")
def _():
    k = maximiser(lambda x: -_svi(x, 0.02, 0.1, -0.4, 0, 0.15), -2, 2)
    return _svi(k, 0.02, 0.1, -0.4, 0, 0.15), 1e-9


@verif("ex-vol-svi-aile")
def _():
    return _svi(-1e7, 0.02, 0.3, -0.5, 0, 0.15) / 1e7, 1e-6


@verif("ex-vol-heston-swap")
def _():
    rng = random.Random(91)
    n, pas = 4000, 250
    dt = 1 / pas
    total = 0.0
    for _ in range(n):
        v, integrale = 0.04, 0.0
        for _ in range(pas):
            integrale += v * dt
            v += 2 * (0.09 - v) * dt + 0.5 * math.sqrt(max(v, 0.0)) * rng.gauss(0, math.sqrt(dt))
        total += integrale
    return math.sqrt(total / n), 0.0015


@verif("ex-vol-replication")
def _():
    def call(K):
        d1 = (math.log(100 / K) + 0.02) / 0.2
        return 100 * Phi(d1) - K * Phi(d1 - 0.2)
    def put(K):
        return call(K) - 100 + K
    gauche = simpson(lambda K: put(K) / K ** 2, 1e-3, 100, 40000)
    droite = simpson(lambda K: call(K) / K ** 2, 100, 3000, 60000)
    return 2 * (gauche + droite), 1e-5


@verif("ex-vol-dispersion")
def _():
    n = 50
    var = sum((1 / n) * (1 / n) * (1.0 if i == j else 0.3) * 0.09 for i in range(n) for j in range(n))
    return math.sqrt(var), 1e-12


# --- Chapitre 4 : statistiques et régression -------------------------------------------------------------------------
def mco(xs, ys):
    """Pente et constante par les équations normales (fractions exactes si les données le sont)."""
    n = len(xs)
    a = [[sum(x * x for x in xs), sum(xs)], [sum(xs), n]]
    b = [sum(x * y for x, y in zip(xs, ys)), sum(ys)]
    return resoudre(a, b)


@verif("ex-stats-n-moins-un")
def _():
    # loi à deux valeurs ±2 (variance 4), énumération exacte des 2⁵ échantillons
    total = F(0)
    for ech in itertools.product([-2, 2], repeat=5):
        m = F(sum(ech), 5)
        total += sum((x - m) ** 2 for x in ech) / 5
    return float(total / 32), 1e-12


@verif("ex-stats-mle")
def _():
    xs = [1, 2, 3, 4, 10]
    return maximiser(lambda l: sum(math.log(l) - l * x for x in xs), 0.01, 3), 1e-6


@verif("ex-stats-sharpe-se")
def _():
    rng = random.Random(41)
    mu, sig, n = 1.5 / math.sqrt(252) * 0.01, 0.01, 504
    sharpes = []
    for _ in range(3000):
        r = [rng.gauss(mu, sig) for _ in range(n)]
        m = sum(r) / n
        s = math.sqrt(sum((x - m) ** 2 for x in r) / (n - 1))
        sharpes.append(m / s * math.sqrt(252))
    return math.sqrt(variance_empirique(sharpes)), 0.02


@verif("ex-stats-tests-multiples")
def _():
    rng = random.Random(42)
    n = 100000
    return sum(any(rng.random() < 0.05 for _ in range(20)) for _ in range(n)) / n, 0.004


@verif("ex-stats-max-sharpe")
def _():
    esperance_max = simpson(lambda x: x * 100 * phi(x) * Phi(x) ** 99, -12, 12, 40000)
    return 0.5 * esperance_max, 1e-4


@verif("ex-stats-ols")
def _():
    pente, _ = mco([F(0), F(1), F(2), F(3)], [F(1), F(3), F(2), F(6)])
    return float(pente), 1e-12


@verif("ex-stats-r2")
def _():
    xy = list(echantillon_correle([[4, 3], [3, 9]], 100000, 43))
    xs, ys = [p[0] for p in xy], [p[1] for p in xy]
    pente, const = mco(xs, ys)
    my = sum(ys) / len(ys)
    scr = sum((y - pente * x - const) ** 2 for x, y in zip(xs, ys))
    sct = sum((y - my) ** 2 for y in ys)
    return 1 - scr / sct, 0.01


@verif("ex-stats-vif")
def _():
    # première colonne de l'inverse de [[1, 0,9], [0,9, 1]]
    v = resoudre([[F(1), F(9, 10)], [F(9, 10), F(1)]], [F(1), F(0)])
    return float(v[0]), 1e-12


@verif("ex-stats-variable-omise")
def _():
    rng = random.Random(44)
    pts = list(echantillon_correle([[1, 0.5], [0.5, 1]], 100000, 45))
    xs = [p[0] for p in pts]
    ys = [p[0] + p[1] + rng.gauss(0, 1) for p in pts]
    return mco(xs, ys)[0], 0.02


@verif("ex-stats-attenuation")
def _():
    rng = random.Random(46)
    xs = [rng.gauss(0, math.sqrt(2)) for _ in range(100000)]
    ys = [3 * x + rng.gauss(0, 1) for x in xs]
    bruites = [x + rng.gauss(0, math.sqrt(0.5)) for x in xs]
    return mco(bruites, ys)[0], 0.03


@verif("ex-stats-ridge")
def _():
    # critère Σ(y − βx)² + λβ² = Σy² − 2β·12 + β²·8 + 4β² (la constante Σy² ne change pas le minimum)
    return maximiser(lambda b: -(-2 * b * 12 + b * b * 8 + 4 * b * b), -10, 10), 1e-8


# --- Chapitre 12 : méthodes numériques -------------------------------------------------------------------------------
@verif("ex-num-cholesky")
def _():
    rng = random.Random(121)
    vals = []
    for _ in range(200000):
        z1, z2 = rng.gauss(0, 1), rng.gauss(0, 1)
        vals.append(z1 + 2 * (0.6 * z1 + 0.8 * z2))
    return variance_empirique(vals), 0.07


@verif("ex-num-ecart-type-payoff")
def _():
    m1 = prix(lambda s: max(s - 100, 0.0))
    m2 = prix(lambda s: max(s - 100, 0.0) ** 2)
    return math.sqrt(m2 - m1 * m1), 1e-4


@verif("ex-num-antithetique")
def _():
    m1 = simpson(lambda z: math.cosh(z) * phi(z), -20, 20, 40000)
    m2 = simpson(lambda z: math.cosh(z) ** 2 * phi(z), -20, 20, 40000)
    return m2 - m1 * m1, 1e-8


@verif("ex-num-controle")
def _():
    rng = random.Random(122)
    xs, ys = [], []
    for _ in range(200000):
        x = rng.gauss(0, 1)
        xs.append(x)
        ys.append(0.95 * x + math.sqrt(1 - 0.95 ** 2) * rng.gauss(0, 1))
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    c = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
    controle = [y - c * x for x, y in zip(xs, ys)]  # E[X] = 0 connu
    return variance_empirique(ys) / variance_empirique(controle), 0.25


@verif("ex-num-difference-centree")
def _():
    # sinh(h)/h − 1 = Σ_{k≥1} h^{2k}/(2k+1)!
    h = 0.1
    return sum(h ** (2 * k) / math.factorial(2 * k + 1) for k in range(1, 10)), 1e-12


@verif("ex-num-stabilite")
def _():
    def stable(dt):
        a = 0.2 ** 2 * dt / (2 * 0.01 ** 2)
        return all(abs(a * 2 * math.cos(math.pi * i / 400) + 1 - 2 * a) <= 1 + 1e-12 for i in range(401))
    lo, hi = 0.0, 0.01
    for _ in range(60):
        mid = (lo + hi) / 2
        if stable(mid):
            lo = mid
        else:
            hi = mid
    return lo, 1e-8


# --- Chapitre 13 : taux et crédit ------------------------------------------------------------------------------------
@verif("ex-tc-forward")
def _():
    p1, p2 = 1 / 1.02, 1 / 1.03 ** 2
    return p1 / p2 - 1, 1e-12


@verif("ex-tc-duration")
def _():
    def p(y):
        return 5 / (1 + y) + 105 / (1 + y) ** 2
    h = 1e-6
    return -(p(0.05 + h) - p(0.05 - h)) / (2 * h) / p(0.05), 1e-7


@verif("ex-tc-convexite")
def _():
    def p(y):
        return math.exp(-simpson(lambda t: y, 0, 10, 10))
    return p(0.05) / p(0.04) - 1, 1e-12


@verif("ex-tc-swap")
def _():
    ps = [1.0, 0.98, 0.955, 0.93]
    flottante = sum((ps[i - 1] / ps[i] - 1) * ps[i] for i in range(1, 4))  # forwards actualisés
    return flottante / sum(ps[1:]), 1e-12


@verif("ex-tc-survie")
def _():
    rng = random.Random(131)
    n = 400000
    return sum(2 < rng.expovariate(0.03) <= 3 for _ in range(n)) / n, 0.0008


@verif("ex-tc-triangle")
def _():
    r, R, T, s = 0.03, 0.4, 5, 0.018
    def ecart(lam):
        prime = s * simpson(lambda t: math.exp(-(r + lam) * t), 0, T, 2000)
        protection = (1 - R) * simpson(lambda t: math.exp(-r * t) * lam * math.exp(-lam * t), 0, T, 2000)
        return protection - prime
    lo, hi = 0.0, 0.5
    for _ in range(60):
        mid = (lo + hi) / 2
        if ecart(mid) < 0:
            lo = mid
        else:
            hi = mid
    return lo, 1e-9


@verif("ex-tc-cva")
def _():
    densite = lambda t: 0.02 * math.exp(-0.02 * t)
    return 0.6 * (1000 * simpson(densite, 0, 1, 200) + 2000 * simpson(densite, 1, 2, 200)), 1e-6


# --- Chapitre 14 : risque et portefeuille ----------------------------------------------------------------------------
@verif("ex-rp-vol")
def _():
    w, vols, rho = [0.6, 0.4], [0.15, 0.25], [[1, 0.2], [0.2, 1]]
    return math.sqrt(sum(w[i] * w[j] * rho[i][j] * vols[i] * vols[j] for i in range(2) for j in range(2))), 1e-12


@verif("ex-rp-min-variance")
def _():
    def var(a):
        return a * a * 0.04 + (1 - a) ** 2 * 0.09 + 2 * a * (1 - a) * 0.5 * 0.2 * 0.3
    return maximiser(lambda a: -var(a), -2, 3), 1e-7


@verif("ex-rp-sharpe-combine")
def _():
    def sharpe(w):  # une unité de la première stratégie (μ = 1, σ = 1), w de la seconde (μ = 0,5, σ = 1)
        return (1 + 0.5 * w) / math.sqrt(1 + w * w)
    return sharpe(maximiser(sharpe, 0, 5)), 1e-9


@verif("ex-rp-residuel")
def _():
    def var(h):
        return 0.25 ** 2 - 2 * h * 0.8 * 0.25 * 0.2 + h * h * 0.2 ** 2
    return math.sqrt(var(maximiser(lambda h: -var(h), -5, 5))), 1e-7


@verif("ex-rp-var")
def _():
    return 10000 * 0.015 * quantile_normal(0.99) * math.sqrt(10), 0.01


@verif("ex-rp-es")
def _():
    z = quantile_normal(0.99)
    return simpson(lambda x: x * phi(x), z, 40, 40000) / 0.01, 1e-4


@verif("ex-rp-exceptions")
def _():
    # loi du nombre d'exceptions par récurrence (convolution de 250 Bernoulli), sans formule binomiale
    loi = [1.0]
    for _ in range(250):
        nouvelle = [0.0] * (len(loi) + 1)
        for k, p in enumerate(loi):
            nouvelle[k] += 0.99 * p
            nouvelle[k + 1] += 0.01 * p
        loi = nouvelle
    return sum(loi[5:]), 1e-12


@verif("ex-rp-garch")
def _():
    rng = random.Random(141)
    omega, a, b = 1e-6, 0.08, 0.90
    s2, total, n = omega / (1 - a - b), 0.0, 1000000
    for _ in range(n):
        r = math.sqrt(s2) * rng.gauss(0, 1)
        total += s2
        s2 = omega + a * r * r + b * s2
    return math.sqrt(total / n * 252), 0.003


@verif("ex-rp-drawdown")
def _():
    # marche aléatoire biaisée de pas h (ruine du joueur, chapitre 2) qui converge vers le brownien avec dérive
    mu, sig, d, h = 0.1, 0.1, 0.15, 0.0001
    p = 0.5 * (1 + mu * h / sig ** 2)
    return ((1 - p) / p) ** round(d / h), 1e-4


@verif("ex-rp-kelly")
def _():
    dt = 1 / 252
    def croissance(f):
        return simpson(lambda z: math.log(1 + f * (0.08 * dt + 0.2 * math.sqrt(dt) * z)) * phi(z), -10, 10, 4000)
    return maximiser(croissance, 0.5, 4, 80), 0.02


# --- Chapitre 15 : market making et microstructure -------------------------------------------------------------------
def _glosten(achats, alpha=F(3, 10)):
    """E[V | suite d'achats] par énumération exacte des états (valeur, type de chaque client)."""
    num = den = F(0)
    for v in (90, 110):
        p = F(1, 2)
        for _ in range(achats):
            p_achat = alpha * (1 if v == 110 else 0) + (1 - alpha) * F(1, 2)
            p *= p_achat
        num += p * v
        den += p
    return num / den


@verif("ex-mm-glosten")
def _():
    return float(_glosten(1)), 1e-12


@verif("ex-mm-glosten-maj")
def _():
    return float(_glosten(2)), 1e-12


@verif("ex-mm-reservation")
def _():
    # équivalent certain calculé par intégration numérique de l'utilité exponentielle, puis indifférence à ±1 titre
    s, q, g, sig, tau = 50.0, -4, 0.1, 1.0, 2.0
    def ec(x, qq):
        e = simpson(lambda z: math.exp(-g * (x + qq * (s + sig * math.sqrt(tau) * z))) * phi(z), -12, 12, 6000)
        return -math.log(e) / g
    base = ec(0.0, q)
    rb = ec(0.0, q + 1) - base   # x − r_b + … = base  ⇒  r_b = ec(0, q+1) − base
    ra = base - ec(0.0, q - 1)
    return (ra + rb) / 2, 1e-6


@verif("ex-mm-spread")
def _():
    g, k = 0.1, 1.0
    d = maximiser(lambda x: math.exp(-k * x) * (1 - math.exp(-g * x)), 0, 20)
    return g * 4 * 1 + 2 * d, 1e-6


@verif("ex-mm-impact")
def _():
    return 2 * 0.05 ** 0.5, 1e-12


@verif("ex-mm-ecart-type-des")
def _():
    sommes = [a + b for a in DE for b in DE]
    m = F(sum(sommes), 36)
    return math.sqrt(float(sum((x - m) ** 2 for x in sommes) / 36)), 1e-12


@verif("ex-mm-max-des")
def _():
    return float(F(sum(max(a, b) for a in DE for b in DE), 36)), 1e-12


@verif("ex-mm-option-des")
def _():
    return float(F(sum(max(a + b - 8, 0) for a in DE for b in DE), 36)), 1e-12


# --- Chapitre 16 : machine learning ----------------------------------------------------------------------------------
def _sigmoide(z):
    return 1 / (1 + math.exp(-z))


@verif("ex-ml-cote")
def _():
    # cote avant / après une hausse de 2 unités, avec une constante quelconque
    a = -2.9
    cote = lambda x: _sigmoide(a + 0.4 * x) / (1 - _sigmoide(a + 0.4 * x))
    return cote(3.0) / cote(1.0), 1e-9


_Y = [1, 0, 1, 1]
_P = [0.9, 0.2, 0.6, 0.4]


def _log_loss(ps):
    return -sum(y * math.log(p) + (1 - y) * math.log(1 - p) for y, p in zip(_Y, ps)) / len(ps)


@verif("ex-ml-log-loss")
def _():
    return _log_loss(_P), 1e-12


@verif("ex-ml-gradient")
def _():
    # dérivée numérique de la perte quand on décale tous les logits de b (la constante du modèle)
    logits = [math.log(p / (1 - p)) for p in _P]
    def perte(b):
        return _log_loss([_sigmoide(z + b) for z in logits])
    h = 1e-6
    return (perte(h) - perte(-h)) / (2 * h), 1e-7


@verif("ex-ml-f1")
def _():
    vp, alertes, positifs = 30, 50, 60
    fp, fn = alertes - vp, positifs - vp
    return 2 * vp / (2 * vp + fp + fn), 1e-12


@verif("ex-ml-auc")
def _():
    # aire sous la courbe ROC par la méthode des trapèzes, en balayant les seuils
    pos, neg = [0.8, 0.6, 0.35], [0.7, 0.4, 0.2]
    seuils = sorted(set(pos + neg + [1.1, -0.1]), reverse=True)
    points = [(sum(s >= t for s in neg) / 3, sum(s >= t for s in pos) / 3) for t in seuils]
    return sum((x2 - x1) * (y1 + y2) / 2 for (x1, y1), (x2, y2) in zip(points, points[1:])), 1e-12


@verif("ex-ml-pas")
def _():
    def converge(eta):
        x = 1.0
        for _ in range(4000):
            x -= eta * 5 * x
            if abs(x) > 1e6:
                return False
        return abs(x) < 1
    lo, hi = 0.01, 1.0
    for _ in range(50):
        mid = (lo + hi) / 2
        if converge(mid):
            lo = mid
        else:
            hi = mid
    return lo, 1e-3


@verif("ex-ml-foret")
def _():
    # arbres = facteur commun (corrélation 0,3) + bruit propre ; variance de la moyenne de 10
    rng = random.Random(161)
    moyennes = []
    for _ in range(100000):
        c = rng.gauss(0, 1)
        moyennes.append(sum(math.sqrt(0.3) * c + math.sqrt(0.7) * rng.gauss(0, 1) for _ in range(10)) / 10)
    return variance_empirique(moyennes), 0.008


@verif("ex-ml-acp")
def _():
    # itération de la puissance sur [[2, 1], [1, 2]]
    v = [1.0, 0.3]
    for _ in range(200):
        w = [2 * v[0] + v[1], v[0] + 2 * v[1]]
        n = math.hypot(*w)
        v = [w[0] / n, w[1] / n]
    lam = v[0] * (2 * v[0] + v[1]) + v[1] * (v[0] + 2 * v[1])
    return lam / 4, 1e-9


@verif("ex-ml-exactitude")
def _():
    n = 1000
    m = sum(k * math.comb(n, k) for k in range(n + 1)) / 2 ** n
    v = sum((k - m) ** 2 * math.comb(n, k) for k in range(n + 1)) / 2 ** n
    return (540 - m) / math.sqrt(v), 1e-9


# --- Chapitre : dénombrement, lois discrètes et processus de Poisson ------------------------------------------------
@verif("ex-den-etoiles")
def _():
    return sum(1 for a in range(11) for b in range(11 - a) for c in range(11 - a - b)), 1e-12  # d = 10 − a − b − c


@verif("ex-den-derangement")
def _():
    perms = list(itertools.permutations(range(4)))
    return F(sum(all(p[i] != i for i in range(4)) for p in perms), len(perms)), 1e-12


@verif("ex-den-toutes-faces")
def _():
    return F(sum(len(set(t)) == 6 for t in itertools.product(range(6), repeat=6)), 6 ** 6), 1e-12


@verif("ex-den-scrutin")
def _():
    bons = total = 0
    for pos in itertools.combinations(range(10), 4):  # positions des 4 voix de B
        s, ok = 0, True
        for i in range(10):
            s += -1 if i in pos else 1
            ok = ok and s > 0
        bons += ok
        total += 1
    return F(bons, total), 1e-12


@verif("ex-den-catalan")
def _():
    def ok(seq):
        s = 0
        for c in seq:
            s += 1 if c == '(' else -1
            if s < 0:
                return False
        return s == 0
    return sum(ok(t) for t in itertools.product('()', repeat=10)), 1e-12


@verif("ex-den-rares")
def _():
    # loi exacte du nombre de rejets par convolution, puis P(0)
    p = F(1)
    for _ in range(1000):
        p *= F(998, 1000)
    return float(p), 1e-12


@verif("ex-den-min-exp")
def _():
    rng = random.Random(21)
    n = 300000
    return sum(rng.expovariate(1) < min(rng.expovariate(2), rng.expovariate(3)) for _ in range(n)) / n, 0.003


@verif("ex-den-amincissement")
def _():
    rng = random.Random(22)
    n, aucun = 100000, 0
    for _ in range(n):
        t, gros = rng.expovariate(6), False
        while t < 0.5:
            gros = gros or rng.random() < 1 / 3
            t += rng.expovariate(6)
        aucun += not gros
    return aucun / n, 0.004


@verif("ex-den-compose")
def _():
    rng = random.Random(23)
    vals = []
    for _ in range(100000):
        t, s = rng.expovariate(3), 0.0
        while t < 1:
            s += rng.gauss(-0.02, 0.05)
            t += rng.expovariate(3)
        vals.append(s)
    return variance_empirique(vals), 0.0003


@verif("ex-den-ordre")
def _():
    # densité de la 2e plus petite de 4 uniformes : 4·3·x(1 − x)², intégrée contre x
    return simpson(lambda x: x * 12 * x * (1 - x) ** 2, 0, 1, 2000), 1e-9


# --- Chapitre : algèbre linéaire des matrices de covariance ----------------------------------------------------------
def _inverse(m):
    n = len(m)
    cols = [resoudre([[F(x) for x in l] for l in m], [F(int(i == j)) for i in range(n)]) for j in range(n)]
    return [[cols[j][i] for j in range(n)] for i in range(n)]


def _vp_max(m, iterations=500):
    v = [1.0] + [0.5] * (len(m) - 1)
    for _ in range(iterations):
        w = [sum(m[i][j] * v[j] for j in range(len(m))) for i in range(len(m))]
        n = math.sqrt(sum(x * x for x in w))
        v = [x / n for x in w]
    return sum(v[i] * sum(m[i][j] * v[j] for j in range(len(m))) for i in range(len(m)))


def _definie_positive(m):
    try:
        cholesky(m)
        return True
    except (ValueError, ZeroDivisionError):
        return False


@verif("ex-al-rho-min")
def _():
    # plus petit ρ₂₃ rendant la matrice définie positive (Cholesky), par dichotomie
    lo, hi = -1.0, 0.63
    for _ in range(60):
        mid = (lo + hi) / 2
        if _definie_positive([[1, 0.9, 0.7], [0.9, 1, mid], [0.7, mid, 1]]):
            hi = mid
        else:
            lo = mid
    return hi, 1e-6


@verif("ex-al-equicorrelation")
def _():
    m = [[1 if i == j else 0.4 for j in range(10)] for i in range(10)]
    return _vp_max(m) / 10, 1e-9


@verif("ex-al-cholesky")
def _():
    return cholesky([[9, 3, 6], [3, 5, 4], [6, 4, 14]])[2][2], 1e-12


@verif("ex-al-residuelle")
def _():
    # variance du résidu X₁ − βX₂ minimisée numériquement sur β
    def var(b):
        return 4 - 2 * b * 2 + b * b * 3
    return var(maximiser(lambda b: -var(b), -5, 5)), 1e-9


@verif("ex-al-partielle")
def _():
    p = _inverse([[1, F(1, 2), F(1, 2)], [F(1, 2), 1, F(1, 2)], [F(1, 2), F(1, 2), 1]])
    return -float(p[0][1]) / math.sqrt(float(p[0][0] * p[1][1])), 1e-12


@verif("ex-al-conditionnement")
def _():
    m = [[1, 0.99], [0.99, 1]]
    lmax = _vp_max(m)
    inv = _inverse(m)
    lmin = 1 / _vp_max([[float(x) for x in l] for l in inv])
    return lmax / lmin, 1e-6


@verif("ex-al-woodbury")
def _():
    m = [[(1 if i == j else 0) + 1 for j in range(4)] for i in range(4)]
    return float(_inverse(m)[0][0]), 1e-12


# --- Chapitre : options exotiques -------------------------------------------------------------------------------------
def esperance2(f, rho, n=500, L=8.0):
    """E[f(Z1, Z2)] pour un couple gaussien standard de corrélation rho (Simpson 2D sur deux normales indépendantes)."""
    h = 2 * L / n
    poids = [1 if i in (0, n) else (4 if i % 2 else 2) for i in range(n + 1)]
    xs = [-L + i * h for i in range(n + 1)]
    q = math.sqrt(1 - rho * rho)
    total = 0.0
    for i, x in enumerate(xs):
        px = poids[i] * phi(x)
        for j, y in enumerate(xs):
            total += px * poids[j] * phi(y) * f(x, rho * x + q * y)
    return total * (h / 3) ** 2


@verif("ex-ex-digitale-skew")
def _():
    def call(K):
        sig = 0.2 - 0.002 * (K - 100)
        return prix(lambda s: max(s - K, 0.0), sig=sig)
    h = 0.5
    return (call(100 - h) - call(100 + h)) / (2 * h), 5e-4


@verif("ex-ex-barriere")
def _():
    # EDP de Black-Scholes en log-prix (taux nul) résolue par différences finies explicites, valeur nulle sur la barrière
    s, B, K = 0.2, 90.0, 100.0
    x0, x1 = math.log(B), math.log(600.0)
    n = 500
    dx = (x1 - x0) / n
    dt = 0.4 * dx * dx / (s * s)
    pas = int(math.ceil(1 / dt))
    dt = 1 / pas
    xs = [x0 + i * dx for i in range(n + 1)]
    u = [max(math.exp(x) - K, 0.0) for x in xs]
    a = 0.5 * s * s * dt / dx ** 2
    b = 0.5 * s * s * dt / (2 * dx)
    for _ in range(pas):
        nouveau = [0.0] * (n + 1)
        for i in range(1, n):
            nouveau[i] = u[i] + a * (u[i + 1] - 2 * u[i] + u[i - 1]) - b * (u[i + 1] - u[i - 1])
        nouveau[n] = math.exp(xs[n]) - K
        u = nouveau
    x = math.log(100.0)
    i = int((x - x0) / dx)
    w = (x - xs[i]) / dx
    return (1 - w) * u[i] + w * u[i + 1], 0.02


@verif("ex-ex-asiatique")
def _():
    # moments de ln G calculés numériquement : moyenne ∫(−σ²t/2)dt, variance σ²·∫∫min(s,t) (T = 1)
    s = 0.3
    m = math.log(100) + simpson(lambda t: -s * s * t / 2, 0, 1, 200)
    v = s * s * grille(min, 400)
    return simpson(lambda z: max(math.exp(m + math.sqrt(v) * z) - 100, 0.0) * phi(z), -12, 12, 24000), 0.003


@verif("ex-ex-forward-start")
def _():
    s, t1 = 0.2, 0.5
    def f(z1, z2):
        st1 = 100 * math.exp(-s * s * t1 / 2 + s * math.sqrt(t1) * z1)
        sT = st1 * math.exp(-s * s * (1 - t1) / 2 + s * math.sqrt(1 - t1) * z2)
        return max(sT - st1, 0.0)
    return esperance2(f, 0.0, 400), 1e-3


@verif("ex-ex-margrabe")
def _():
    s1, s2 = 0.3, 0.2
    def f(z1, z2):
        a = 100 * math.exp(-s1 * s1 / 2 + s1 * z1)
        b = 100 * math.exp(-s2 * s2 / 2 + s2 * z2)
        return max(b - a, 0.0)
    return esperance2(f, 0.6, 500), 2e-3


@verif("ex-ex-quanto")
def _():
    # sous la probabilité étrangère, puis densité de passage à la probabilité domestique (Y = 1/X, corrélé à −ρ avec l'indice)
    rf, rd, sS, sX, rho = 0.02, 0.01, 0.2, 0.1, -0.3
    def f(z1, z2):
        S = 100 * math.exp(rf - sS * sS / 2 + sS * z1)
        Y = math.exp(rf - rd - sX * sX / 2 + sX * z2)
        return S * Y * math.exp(rd - rf)
    return esperance2(f, -rho, 400), 1e-3


@verif("ex-ex-reverse-convertible")
def _():
    def valeur(c):
        return math.exp(-0.03) * simpson(
            lambda z: (100 + c - max(100 - 100 * math.exp(0.03 - 0.03125 + 0.25 * z), 0.0)) * phi(z), -12, 12, 24000)
    lo, hi = 0.0, 30.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if valeur(mid) < 100:
            lo = mid
        else:
            hi = mid
    return lo, 1e-4


# --- Chapitre : énergie et matières premières --------------------------------------------------------------------------
@verif("ex-en-calendaire")
def _():
    trimestres = [(120, 2160), (70, 2184), (80, 2208), (110, 2208)]
    heures = [p for p, h in trimestres for _ in range(h)]  # un prix par heure de livraison
    return sum(heures) / len(heures), 1e-12


def _schwartz_moments(x0, mu, kappa, sig, T, pas=20000):
    """Moyenne et variance de X_T par intégration (Euler) des équations m' = κ(μ − m), v' = −2κv + σ²."""
    m, v, dt = x0, 0.0, T / pas
    for _ in range(pas):
        m, v = m + kappa * (mu - m) * dt, v + (-2 * kappa * v + sig * sig) * dt
    return m, v


@verif("ex-en-samuelson")
def _():
    # sensibilité de ln F à ln S : dérivée numérique de ln E[e^{X_T} | X_0 = x]
    def lnF(x):
        m, v = _schwartz_moments(x, 0.0, 3.0, 1.0, 0.5, 4000)
        return math.log(simpson(lambda z: math.exp(m + math.sqrt(v) * z) * phi(z), -12, 12, 4000))
    h = 1e-3
    return (lnF(h) - lnF(-h)) / (2 * h), 1e-4


@verif("ex-en-forward-schwartz")
def _():
    m, v = _schwartz_moments(math.log(50), math.log(60), 2.0, 0.8, 0.5)
    return simpson(lambda z: math.exp(m + math.sqrt(v) * z) * phi(z), -12, 12, 6000), 0.005


@verif("ex-en-clean-spark")
def _():
    recette, gaz, co2 = 110.0, 1.9 * 40.0, 0.37 * 70.0
    return recette - gaz - co2, 1e-12


@verif("ex-en-spread")
def _():
    T, sp, sg = 1 / 12, 0.6, 0.4
    def f(z1, z2):
        p = 72 * math.exp(-sp * sp * T / 2 + sp * math.sqrt(T) * z1)
        g = 70 * math.exp(-sg * sg * T / 2 + sg * math.sqrt(T) * z2)
        return max(p - g, 0.0)
    return esperance2(f, 0.6, 500), 2e-3


@verif("ex-en-capture")
def _():
    def f(z1, z2):
        return (30 + 15 * z1) * (60 + 20 * z2)
    return esperance2(f, -0.4, 200) / 30, 1e-6


# --- Chapitre : code et algorithmique (solutions naïves, indépendantes des algorithmes du cours) ---------------------
@verif("ex-code-tri-cinq")
def _():
    h = 0
    while 2 ** h < math.factorial(5):
        h += 1
    return h, 1e-12


@verif("ex-code-dichotomie")
def _():
    # pire cas d'une recherche dichotomique à trois issues : on retombe sur la plus grande moitié, de taille ⌊n/2⌋
    def pire(n):
        return 0 if n == 0 else 1 + pire(n // 2)
    return pire(10 ** 6), 1e-12


@verif("ex-code-paires")
def _():
    a = [1, 5, 7, -1, 5]
    return sum(a[i] + a[j] == 6 for i in range(len(a)) for j in range(i + 1, len(a))), 1e-12


@verif("ex-code-drawdown")
def _():
    s = [100, 120, 90, 130, 80, 110, 140, 100]
    return max((s[i] - s[j]) / s[i] for i in range(len(s)) for j in range(i, len(s))), 1e-12


@verif("ex-code-kadane")
def _():
    a = [2, -5, 3, 4, -1, 2, -8, 6, 1, -2]
    return max(sum(a[i:j]) for i in range(len(a)) for j in range(i + 1, len(a) + 1)), 1e-12


@verif("ex-code-escalier")
def _():
    return sum(sum(t) == 10 for n in range(5, 11) for t in itertools.product((1, 2), repeat=n)), 1e-12


@verif("ex-code-monnaie")
def _():
    n = 0
    for c50 in range(3):
        for c20 in range(6):
            for c10 in range(11):
                for c5 in range(21):
                    for c2 in range(51):
                        n += 100 - 50 * c50 - 20 * c20 - 10 * c10 - 5 * c5 - 2 * c2 >= 0  # le reste en pièces de 1
    return n, 1e-12


@verif("ex-code-lcs")
def _():
    x, y = "BDCABA", "ABCBDAB"
    def sous_suite(s, t):
        it = iter(t)
        return all(c in it for c in s)
    meilleur = 0
    for masque in range(1 << len(x)):
        s = "".join(x[i] for i in range(len(x)) if masque >> i & 1)
        if len(s) > meilleur and sous_suite(s, y):
            meilleur = len(s)
    return meilleur, 1e-12
