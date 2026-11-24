---
titre: La volatilité : implicite, smile, modèles, swaps de variance
partie: Pricing
resume: Mesurer la volatilité (historique, implicite), comprendre le smile et ses causes, écrire une surface sans arbitrage (variance totale, SVI, conditions papillon et calendaire), les deux grandes familles de modèles (volatilité locale de Dupire, volatilité stochastique de Heston et SABR) et la réplication d'un swap de variance. C'est le chapitre de un projet de surface de volatilité.
duree: 3 h 30
fiches: der-smile der-straddle-vol-implicite der-vol-locale-stochastique der-heston der-sabr der-swap-variance mm-vix struct-dispersion proj-vs-pitch proj-vs-variance-totale proj-vs-svi proj-vs-ailes proj-vs-papillon proj-vs-calendaire proj-vs-heston cst-racine-252 cst-vol-quotidienne der-dupire
---
Black-Scholes suppose une volatilité constante ; le marché la contredit tous les jours. Ce chapitre explique comment on vit avec : on garde la formule comme **convertisseur** entre prix et volatilité implicite, on décrit la **surface** de vols implicites (et on vérifie qu'elle ne permet pas d'arbitrage), et on choisit un **modèle** qui la reproduit. C'est exactement le sujet de ton projet de surface de volatilité ([[fiche:proj-vs-pitch]]) : chaque section te donne la théorie derrière une partie du code.

## Volatilité historique, volatilité implicite

:::definition Volatilité historique (réalisée)
Sur des rendements logarithmiques quotidiens $r_i = \ln(S_i/S_{i-1})$, $i = 1, \dots, n$ :
$$
\hat\sigma_{\text{jour}} = \sqrt{\frac{1}{n - 1}\sum_{i=1}^n (r_i - \bar r)^2}, \qquad \hat\sigma_{\text{an}} = \hat\sigma_{\text{jour}}\sqrt{252}.
$$
On utilise souvent la version sans moyenne ($\bar r = 0$, car la moyenne quotidienne est négligeable et mal estimée) ou une moyenne exponentielle (EWMA) qui donne plus de poids aux jours récents.
:::

:::preuve Pourquoi $\sqrt{252}$
Si les rendements quotidiens sont indépendants et de même variance $\sigma_j^2$, le rendement annuel est la somme de 252 rendements quotidiens, de variance $252\,\sigma_j^2$ (les covariances sont nulles). L'écart-type annuel est donc $\sigma_j\sqrt{252} \approx 15{,}9\,\sigma_j$ ([[fiche:cst-racine-252]]). Si les rendements sont autocorrélés, cette règle est fausse : une autocorrélation positive augmente la variance annuelle (chapitre [[n:esperance-variance-covariance]], variance d'une somme).
:::

:::exercice ex-vol-annualiser
reponse: 1.2*sqrt(252)
tolerance: 0.05
L'écart-type des rendements quotidiens d'une action est de 1,2 %. Quelle est sa volatilité annualisée, en % ?
---
$1{,}2 \times \sqrt{252} \approx 1{,}2 \times 15{,}87 \approx 19{,}0\,\%$. Règle mentale : multiplier par 16 ([[fiche:cst-vol-quotidienne]]).
:::

:::definition Volatilité implicite
La volatilité implicite d'une option cotée est l'unique $\sigma_{\text{imp}}$ tel que le prix Black-Scholes avec $\sigma_{\text{imp}}$ égale le prix de marché :
$$
C_{\text{BS}}(S, K, T, r, \sigma_{\text{imp}}) = C_{\text{marché}}.
$$
:::

:::propriete Existence, unicité, calcul
- La vega est **strictement positive** : $\sigma \mapsto C_{\text{BS}}$ est strictement croissante, de $(S - Ke^{-rT})^+$ (en $\sigma = 0$) à $S$ (quand $\sigma \to \infty$). Tout prix strictement entre ces bornes sans arbitrage a donc **une et une seule** vol implicite.
- **Méthode de Newton** : $\sigma_{n+1} = \sigma_n + \dfrac{C_{\text{marché}} - C_{\text{BS}}(\sigma_n)}{\mathcal{V}(\sigma_n)}$. Converge très vite près de la monnaie ; loin de la monnaie, la vega est minuscule et Newton peut diverger : on utilise alors la dichotomie (toujours sûre grâce à la monotonie).
- Point de départ : l'approximation à la monnaie $\sigma \approx \dfrac{C}{0{,}4\,S\sqrt T}$ ([[fiche:der-straddle-vol-implicite]]).
:::

:::exercice ex-vol-newton
reponse: 0.2+(10-100*(N(0.1)-N(-0.1)))/(100*phi(0.1))
tolerance: 0.0005
Call à la monnaie, $S = K = 100$, $T = 1$, $r = 0$, coté 10. Fais **une** itération de Newton à partir de $\sigma_0 = 20\,\%$ (prix à 20 % : 7,966 ; vega : $100\,\varphi(0{,}1) = 39{,}70$).
---
$\sigma_1 = 0{,}2 + \frac{10 - 7{,}966}{39{,}70} \approx 0{,}2 + 0{,}0512 = 25{,}12\,\%$. La vraie vol implicite vaut $25{,}13\,\%$ : à la monnaie, le prix est presque linéaire en vol, une seule itération suffit.
:::

## Le smile

:::definition Smile, skew, structure par terme
En traçant la vol implicite en fonction du strike pour une maturité donnée, on n'obtient pas une droite horizontale :
- sur les **actions et indices**, elle décroît avec le strike : c'est le **skew** (les puts en dehors de la monnaie sont chers) ;
- sur le **change**, elle est plus symétrique : c'est un vrai **smile** ;
- sur certaines **matières premières** (électricité, gaz en hiver), les calls en dehors sont chers : skew positif.
En fonction de la maturité, la vol à la monnaie forme la **structure par terme**. L'ensemble (strike, maturité) ↦ vol est la **surface de volatilité**.
:::

:::intuition Pourquoi un skew négatif sur les actions ([[fiche:der-smile]])
1. **Queues épaisses à gauche** : les krachs sont plus fréquents et plus violents que dans le modèle log-normal ; un put très en dehors doit coûter plus que ce que dit Black-Scholes avec la vol à la monnaie.
2. **Effet de levier** : quand le cours baisse, la dette pèse plus lourd relativement aux fonds propres, et la volatilité monte. Spot et vol sont **négativement corrélés**.
3. **Offre et demande** : les investisseurs achètent des puts pour se protéger ; les vendeurs de ces puts demandent une prime de risque.
Historiquement, le skew sur indices est devenu marqué après le krach d'octobre 1987.
:::

:::propriete Smile et forme de la loi risque-neutre
Une vol implicite plus haute aux deux extrémités (smile convexe) signifie que la loi risque-neutre a des **queues plus épaisses** que la log-normale (kurtosis). Un skew négatif signifie une loi **asymétrique à gauche** (skewness négative). La densité se lit sur les prix par Breeden-Litzenberger (chapitre [[n:arbitrage-et-risque-neutre]]) : $f(K) = e^{rT}\,\partial_{KK}C$.
:::

## Écrire une surface : variance totale et log-moneyness

:::definition Coordonnées naturelles ([[fiche:proj-vs-variance-totale]])
- **Log-moneyness** : $k = \ln(K/F)$, où $F$ est le forward de même maturité. $k = 0$ est la monnaie forward.
- **Variance totale** implicite : $w(k, T) = \sigma_{\text{imp}}(k, T)^2\,T$.
:::

:::intuition Pourquoi ces coordonnées
Par la formule de Black (chapitre [[n:black-scholes]]), le prix d'un call divisé par $e^{-rT}F$ ne dépend que de $k$ et de $w$ :
$$
\frac{C}{e^{-rT}F} = N(d_1) - e^{k}N(d_2), \qquad d_{1,2} = \frac{-k}{\sqrt w} \pm \frac{\sqrt w}{2}.
$$
Taux, dividendes et maturité n'entrent que via $F$ et $w$. On compare donc proprement des maturités différentes, et la **variance** s'additionne dans le temps (la volatilité, non).
:::

:::exemple Volatilité forward
Si la vol implicite à la monnaie vaut 20 % à 1 an et 18 % à 2 ans, la variance totale passe de $0{,}04$ à $2 \times 0{,}0324 = 0{,}0648$. La vol « forward » entre 1 et 2 ans vérifie $\sigma_{1,2}^2 \times 1 = 0{,}0648 - 0{,}04$, soit $\sigma_{1,2} \approx 15{,}7\,\%$. Si la vol à 2 ans était inférieure à $20/\sqrt 2 \approx 14{,}1\,\%$, la variance totale baisserait : arbitrage calendaire.
:::

:::exercice ex-vol-forward
reponse: sqrt(0.18**2*2-0.2**2)
tolerance: 0.0005
Vols implicites à la monnaie forward : 20 % à 1 an, 18 % à 2 ans. Quelle volatilité (forward) le marché anticipe-t-il entre 1 et 2 ans ?
---
$\sigma_{1,2} = \sqrt{\frac{0{,}18^2 \times 2 - 0{,}20^2 \times 1}{2 - 1}} = \sqrt{0{,}0248} \approx 15{,}75\,\%$.
:::

## Absence d'arbitrage sur une surface

:::propriete Les deux conditions
1. **Pas d'arbitrage papillon** (dans une maturité) : $K \mapsto C(K, T)$ est convexe, c'est-à-dire que la densité implicite $e^{rT}\partial_{KK}C$ est positive. En variance totale, Gatheral et Jacquier montrent que c'est équivalent à $g(k) \ge 0$, avec
$$
g(k) = \left(1 - \frac{k\,w'(k)}{2w(k)}\right)^2 - \frac{w'(k)^2}{4}\left(\frac{1}{w(k)} + \frac14\right) + \frac{w''(k)}{2}
$$
(et $d_1 \to -\infty$ quand $k \to +\infty$) ([[fiche:proj-vs-papillon]]).
2. **Pas d'arbitrage calendaire** (entre maturités) : $T \mapsto w(k, T)$ est **croissante** à $k$ fixé ([[fiche:proj-vs-calendaire]]).
:::

:::preuve De la condition calendaire, dans le cas sans taux ni dividende
Avec $r = q = 0$, $F = S$ et $k = \ln(K/S)$ ne dépend pas de $T$. Le prix normalisé $N(d_1) - e^kN(d_2)$ est une fonction croissante de $w$ (c'est la vega, positive). Or, sans taux ni dividende, $T \mapsto C(K, T)$ doit être croissante : un call plus long vaut au moins un call plus court de même strike. (Preuve : $(S_t - K)^+$ est une sous-martingale par Jensen, car $S$ est une martingale et $x \mapsto (x - K)^+$ est convexe.) Donc $w(k, T)$ doit être croissante en $T$. Avec des taux et dividendes, le même argument fonctionne à $k = \ln(K/F_T)$ fixé.
:::

:::theoreme Formule des moments de Lee (énoncé)
Quand $|k| \to \infty$, la variance totale croît au plus linéairement : $\limsup_{|k| \to \infty} \dfrac{w(k)}{|k|} \le 2$. La pente exacte des ailes est liée au nombre de moments finis de $S_T$ (plus les queues sont épaisses, plus la pente est proche de 2).
:::

## SVI, la paramétrisation de ton projet

:::definition SVI « raw » ([[fiche:proj-vs-svi]])
Pour une maturité donnée,
$$
w(k) = a + b\left(\rho\,(k - m) + \sqrt{(k - m)^2 + \sigma^2}\right),
$$
avec $b \ge 0$, $|\rho| < 1$, $\sigma > 0$. Rôles : $a$ règle le **niveau**, $b$ la **pente des ailes**, $\rho$ l'**asymétrie** (skew), $m$ **translate** le smile, $\sigma$ règle la **courbure** au centre.
:::

:::propriete Ailes et minimum
- **Ailes** : quand $k \to +\infty$, $\sqrt{(k - m)^2 + \sigma^2} \approx k - m$, donc $w(k) \approx a + b(1 + \rho)(k - m)$ ; quand $k \to -\infty$, $w(k) \approx a - b(1 - \rho)(k - m)$. Pentes $b(1 + \rho)$ à droite et $b(1 - \rho)$ à gauche, à comparer à la borne de Lee : $b(1 + |\rho|) \le 2$ ([[fiche:proj-vs-ailes]]).
- **Minimum** : $w$ est convexe en $k$ et son minimum vaut $a + b\sigma\sqrt{1 - \rho^2}$, atteint en $k^* = m - \dfrac{\rho\sigma}{\sqrt{1 - \rho^2}}$. Il faut $a + b\sigma\sqrt{1 - \rho^2} \ge 0$ pour que la variance reste positive.
:::

:::preuve Du minimum
$w'(k) = b\left(\rho + \dfrac{k - m}{\sqrt{(k - m)^2 + \sigma^2}}\right)$. Posons $u = k - m$ : $w'(k) = 0 \iff \dfrac{u}{\sqrt{u^2 + \sigma^2}} = -\rho$. En élevant au carré : $u^2 = \rho^2(u^2 + \sigma^2)$, soit $u^2 = \dfrac{\rho^2\sigma^2}{1 - \rho^2}$, et $u$ est du signe de $-\rho$ : $u^* = -\dfrac{\rho\sigma}{\sqrt{1 - \rho^2}}$. Alors $\sqrt{u^{*2} + \sigma^2} = \dfrac{\sigma}{\sqrt{1 - \rho^2}}$ et
$$
w(k^*) = a + b\left(-\frac{\rho^2\sigma}{\sqrt{1 - \rho^2}} + \frac{\sigma}{\sqrt{1 - \rho^2}}\right) = a + b\sigma\,\frac{1 - \rho^2}{\sqrt{1 - \rho^2}} = a + b\sigma\sqrt{1 - \rho^2}.
$$
La convexité vient de $w''(k) = \dfrac{b\sigma^2}{\big((k - m)^2 + \sigma^2\big)^{3/2}} > 0$.
:::

:::widget svi
:::

:::exercice ex-vol-svi-min
reponse: 0.02+0.1*0.15*sqrt(1-0.16)
tolerance: 0.00001
Tranche SVI : $a = 0{,}02$, $b = 0{,}1$, $\rho = -0{,}4$, $m = 0$, $\sigma = 0{,}15$ (les valeurs par défaut du widget). Quelle est la variance totale minimale ?
---
$a + b\sigma\sqrt{1 - \rho^2} = 0{,}02 + 0{,}015\sqrt{0{,}84} \approx 0{,}02 + 0{,}01375 = 0{,}03375$, atteinte en $k^* = 0{,}4 \times 0{,}15/\sqrt{0{,}84} \approx 0{,}065$ (le minimum est décalé du côté des calls quand $\rho < 0$).
:::

:::exercice ex-vol-svi-aile
reponse: 0.45
tolerance: 0.0001
Tranche SVI avec $b = 0{,}3$ et $\rho = -0{,}5$. Que vaut la pente de l'aile gauche, $\lim_{k \to -\infty} w(k)/|k|$ ? La borne de Lee est-elle respectée ?
---
$b(1 - \rho) = 0{,}3 \times 1{,}5 = 0{,}45 \le 2$ : oui. Aile droite : $b(1 + \rho) = 0{,}15$. L'aile gauche est trois fois plus pentue : c'est le skew négatif.
:::

:::attention Ce que ton projet a montré
L'ajustement d'une tranche SVI est un problème **non convexe** : il faut plusieurs points de départ. Dans ton projet, un minimum local ($\rho = 0{,}92$, $m = 0{,}63$) ajustait bien les données mais violait la condition papillon ($g = -2{,}17$). Et contrôler chaque tranche séparément ne garantit pas l'absence d'arbitrage **entre** tranches : la paramétrisation SSVI de Gatheral et Jacquier donne des conditions suffisantes sur toute la surface.
:::

## Volatilité locale (Dupire)

:::definition Modèle à volatilité locale
$dS_t = rS_t\,dt + \sigma_{\text{loc}}(t, S_t)\,S_t\,dW_t$ : la volatilité est une **fonction déterministe** du temps et du niveau du sous-jacent.
:::

:::theoreme Formule de Dupire (avec $r = q = 0$)
Il existe une unique fonction $\sigma_{\text{loc}}$ qui reproduit exactement tous les prix de calls $C(K, T)$ du marché :
$$
\sigma_{\text{loc}}^2(T, K) = \frac{\partial_T C(K, T)}{\frac12K^2\,\partial_{KK}C(K, T)}.
$$
:::

:::preuve Heuristique (rendue rigoureuse par la formule de Tanaka)
Avec $r = 0$, $C(K, T) = \mathbb{E}[(S_T - K)^+]$. Appliquons Itô à $f(S) = (S - K)^+$ en faisant comme si elle était régulière : $f'(S) = \mathbf{1}_{S > K}$ et $f''(S) = \delta_K(S)$ (la « dérivée » d'un saut est un Dirac). Alors
$$
d(S_T - K)^+ = \mathbf{1}_{S_T > K}\,dS_T + \frac12\,\delta_K(S_T)\,\sigma_{\text{loc}}^2(T, S_T)\,S_T^2\,dT.
$$
En espérance, le terme en $dS_T$ disparaît ($S$ est une martingale), et $\mathbb{E}[\delta_K(S_T)\,h(S_T)] = h(K)f(K, T)$, où $f(\cdot, T)$ est la densité de $S_T$. Donc
$$
\partial_TC = \frac12\,\sigma_{\text{loc}}^2(T, K)\,K^2\,f(K, T).
$$
Par Breeden-Litzenberger (avec $r = 0$), $f(K, T) = \partial_{KK}C$. On divise.
:::

:::propriete Forces et faiblesses ([[fiche:der-vol-locale-stochastique]])
- **Force** : reproduit exactement toute la surface de vanilles ; marché complet (un seul brownien), couverture claire.
- **Faiblesse** : la **dynamique** du smile est fausse. Quand le spot bouge, le smile de la vol locale se déplace dans le mauvais sens, et le smile forward s'aplatit. Les produits sensibles au smile futur (options forward-start, cliquets, barrières) sont mal pricés.
- En pratique, le numérateur et le dénominateur sont des dérivées de données bruitées : on calcule la vol locale sur une surface lissée et sans arbitrage (d'où l'intérêt de SVI).
:::

## Volatilité stochastique (Heston, SABR)

:::definition Modèle de Heston ([[fiche:der-heston]])
$$
dS_t = rS_t\,dt + \sqrt{v_t}\,S_t\,dW^1_t, \qquad dv_t = \kappa(\theta - v_t)\,dt + \xi\sqrt{v_t}\,dW^2_t, \qquad d\langle W^1, W^2\rangle_t = \rho\,dt.
$$
La variance instantanée $v$ suit un processus CIR (chapitre [[n:equations-differentielles-stochastiques]]). Paramètres : $v_0$ (variance actuelle), $\theta$ (variance de long terme), $\kappa$ (vitesse de retour), $\xi$ (vol de la vol), $\rho$ (corrélation spot-vol).
:::

:::propriete Rôle de chaque paramètre sur le smile
- $\rho < 0$ : quand le spot baisse, la vol monte ; la queue gauche s'épaissit : **skew négatif**. C'est l'effet de levier modélisé.
- $\xi$ : plus la vol est volatile, plus les queues sont épaisses des deux côtés : **courbure** du smile.
- $v_0$, $\theta$, $\kappa$ : niveau et **structure par terme** (la vol à la monnaie passe de $\sqrt{v_0}$ à court terme à $\sqrt\theta$ à long terme).
- **Condition de Feller** $2\kappa\theta \ge \xi^2$ : la variance ne touche jamais 0. Elle est souvent violée par les calibrations sur actions, ce qui complique la simulation.
- Prix : semi-fermés via la **fonction caractéristique** de $\ln S_T$ et une inversion de Fourier (Gil-Pelaez dans ton projet). La forme « little Heston trap » d'Albrecher et al. évite les sauts de branche du logarithme complexe ([[fiche:proj-vs-heston]]).
:::

:::exemple Variance moyenne anticipée dans Heston
$\mathbb{E}[v_t] = \theta + (v_0 - \theta)e^{-\kappa t}$ (même calcul que la moyenne d'OU ou de CIR : on prend l'espérance de l'EDS). Donc
$$
\frac1T\,\mathbb{E}\left[\int_0^T v_t\,dt\right] = \theta + (v_0 - \theta)\,\frac{1 - e^{-\kappa T}}{\kappa T}.
$$
C'est le **strike juste d'un swap de variance** dans Heston (voir plus bas) : il ne dépend ni de $\xi$ ni de $\rho$.
:::

:::exercice ex-vol-heston-swap
reponse: sqrt(0.09-0.05*(1-exp(-2))/2)
tolerance: 0.002
Heston avec $v_0 = 0{,}04$ (vol spot 20 %), $\theta = 0{,}09$ (30 %), $\kappa = 2$. Quel est le strike juste d'un swap de variance à 1 an, exprimé en volatilité ?
---
$\theta + (v_0 - \theta)\frac{1 - e^{-2}}{2} = 0{,}09 - 0{,}05 \times 0{,}4323 \approx 0{,}0684$, soit une vol de $\sqrt{0{,}0684} \approx 26{,}2\,\%$ : entre la vol spot et la vol de long terme, plus proche de cette dernière car le retour est rapide ($\kappa = 2$, demi-vie de quatre mois).
:::

:::definition SABR ([[fiche:der-sabr]])
Sur un forward : $dF_t = \alpha_tF_t^\beta\,dW^1_t$, $d\alpha_t = \nu\,\alpha_t\,dW^2_t$, corrélation $\rho$. C'est le standard des **options de taux** (swaptions, caps), grâce à une formule asymptotique de Hagan qui donne directement la vol implicite. $\beta$ fixe la dynamique « backbone » (normale si $\beta = 0$, log-normale si $\beta = 1$), $\rho$ le skew, $\nu$ la courbure.
:::

## Swaps de variance et VIX

:::definition Swap de variance ([[fiche:der-swap-variance]])
À l'échéance, l'acheteur reçoit $N_{\text{var}}\big(\sigma_{\text{réalisée}}^2 - K_{\text{var}}\big)$, où $\sigma_{\text{réalisée}}^2 = \frac{252}{n}\sum_i r_i^2$ est la variance réalisée annualisée sur la période. Le strike $K_{\text{var}}$ est fixé pour que le swap ne coûte rien à l'entrée.
:::

:::theoreme Réplication par un contrat log et des options
Sous la probabilité risque-neutre avec $r = 0$ (pour simplifier) et une volatilité quelconque $\sigma_t$ (stochastique ou non), pour un sous-jacent à trajectoires continues (sans sauts),
$$
K_{\text{var}} = \frac1T\,\mathbb{E}\left[\int_0^T\sigma_t^2\,dt\right] = \frac2T\left(\int_0^{F}\frac{P(K)}{K^2}\,dK + \int_F^\infty\frac{C(K)}{K^2}\,dK\right).
$$
La variance se réplique avec un **continuum d'options en dehors de la monnaie pondérées par $1/K^2$**.
:::

:::preuve
**Étape 1 : Itô sur le log.** $d\ln S_t = \dfrac{dS_t}{S_t} - \dfrac12\sigma_t^2\,dt$, donc
$$
\int_0^T\sigma_t^2\,dt = 2\int_0^T\frac{dS_t}{S_t} - 2\ln\frac{S_T}{S_0}.
$$
Le premier terme est le gain d'une stratégie qui détient $1/S_t$ actions (exposition constante d'un euro) : d'espérance nulle sous $\mathbb{Q}$ avec $r = 0$. Il reste $\mathbb{E}\big[\int\sigma^2\,dt\big] = -2\,\mathbb{E}[\ln(S_T/S_0)]$ : la variance est le prix d'un **contrat log**.

**Étape 2 : décomposer le log en options** (formule de Carr-Madan). Pour $f$ deux fois dérivable et tout $F > 0$, la formule de Taylor avec reste intégral s'écrit
$$
f(S) = f(F) + f'(F)(S - F) + \int_0^F f''(K)(K - S)^+\,dK + \int_F^\infty f''(K)(S - K)^+\,dK.
$$
(Pour $S > F$, seule la seconde intégrale est non nulle et vaut $\int_F^S f''(K)(S - K)\,dK$, le reste de Taylor ; idem pour $S < F$.) Avec $f = -\ln$, $f''(K) = 1/K^2$, et $F = S_0$ : l'espérance du terme linéaire est nulle (car $\mathbb{E}[S_T] = S_0$), et chaque $(K - S_T)^+$ et $(S_T - K)^+$ a pour espérance le prix du put ou du call. On multiplie par $2/T$.
:::

:::intuition Pourquoi le strike est au-dessus de la vol à la monnaie
Les poids $1/K^2$ favorisent les **bas strikes**, là où le skew rend les puts chers. Avec un skew négatif, $\sqrt{K_{\text{var}}}$ est donc supérieur à la vol implicite à la monnaie. Autre effet : un swap de **volatilité** (qui paie $\sigma_{\text{réalisée}} - K_{\text{vol}}$) a un strike **inférieur** à $\sqrt{K_{\text{var}}}$, par Jensen ($\mathbb{E}[\sqrt X] \le \sqrt{\mathbb{E}[X]}$) : c'est l'ajustement de convexité, d'autant plus grand que la vol de la vol est élevée.
:::

:::exercice ex-vol-replication
reponse: 0.04
tolerance: 0.0002
Dans Black-Scholes avec $\sigma = 20\,\%$, $S_0 = 100$, $T = 1$, $r = 0$, que donne la formule de réplication $\frac2T\big(\int_0^{100}\frac{P(K)}{K^2}dK + \int_{100}^\infty\frac{C(K)}{K^2}dK\big)$ ?
---
Le résultat doit être $\sigma^2 = 0{,}04$ : quand la vol est constante, la variance réalisée attendue est $\sigma^2$. (La vérification de cet exercice calcule réellement l'intégrale avec les prix Black-Scholes.) Sans smile, le strike d'un swap de variance est la vol implicite au carré.
:::

:::definition Le VIX ([[fiche:mm-vix]])
Le VIX est la racine du strike de variance à 30 jours sur le S&P 500, calculé par la formule de réplication ci-dessus sur une grille discrète d'options cotées, exprimé en points de pourcentage. Ce n'est pas un actif : on ne peut pas « acheter le VIX ». On traite des **futures** et des **options** sur VIX, dont les prix reflètent le VIX anticipé à leur échéance (et sont généralement en contango).
:::

## Corrélation implicite et dispersion

:::exemple La corrélation implicite d'un indice ([[fiche:struct-dispersion]])
Un indice de $n$ actions équipondérées ($w_i = 1/n$), de même vol $\sigma$ et de corrélations deux à deux $\rho$, a pour variance (chapitre [[n:esperance-variance-covariance]])
$$
\sigma_I^2 = \sum_{i,j}w_iw_j\rho_{ij}\sigma_i\sigma_j = \sigma^2\left(\frac1n + \Big(1 - \frac1n\Big)\rho\right) \approx \rho\,\sigma^2 \quad (n \text{ grand}).
$$
En inversant avec des vols **implicites**, on obtient la **corrélation implicite** $\rho \approx \sigma_I^2/\sigma^2$. Une stratégie de **dispersion** vend la vol de l'indice et achète celle des composants : c'est une vente de corrélation.
:::

:::exercice ex-vol-dispersion
reponse: 0.3*sqrt(1/50+49/50*0.3)
tolerance: 0.0005
Un indice équipondère 50 actions de vol 30 % chacune, avec une corrélation de 0,3 entre chaque paire. Quelle est la vol de l'indice ?
---
$\sigma_I = 0{,}3\sqrt{\frac{1}{50} + \frac{49}{50} \times 0{,}3} = 0{,}3\sqrt{0{,}314} \approx 16{,}8\,\%$. L'approximation $\sigma\sqrt\rho = 16{,}4\,\%$ est un peu en dessous : le terme $\frac1n$ (risque spécifique non diversifié) pèse encore.
:::

## Pièges classiques

:::attention Les confusions fréquentes
- Dire que la vol implicite est une **prévision** de la vol réalisée : elle l'est en partie, mais contient une **prime de risque** (en moyenne, la vol implicite des indices dépasse la vol réalisée).
- Interpoler la **vol** entre maturités au lieu de la **variance totale**.
- Croire qu'un smile peut prendre n'importe quelle forme : convexité en strike, croissance de la variance totale, ailes de pente au plus 2.
- Confondre vol locale et vol implicite : la vol locale est la vol **instantanée** au point $(t, S)$ ; la vol implicite en est grossièrement une moyenne le long des chemins de $S_0$ à $K$ (règle approximative : le skew de la vol locale est deux fois celui de la vol implicite).
- Dire qu'on peut acheter le VIX.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Pourquoi y a-t-il un skew sur les actions ? »** Queues épaisses, effet de levier, demande de protection ; depuis 1987.
- **« Comment calcules-tu une vol implicite ? »** Newton avec la vega, dichotomie en secours ; unicité par monotonie.
- **« Présente ton projet de surface de vol. »** Données en $(k, w)$, SVI par tranche, contrôle papillon avec $g(k)$ et calendaire, Heston comme générateur de données synthétiques, l'anecdote du minimum local. Prépare deux minutes chronométrées.
- **« Vol locale ou vol stochastique ? »** Dupire calibre exactement mais donne une mauvaise dynamique du smile ; Heston a une dynamique réaliste mais ne calibre pas parfaitement les maturités courtes ; en pratique, des modèles mixtes (vol locale stochastique).
- **« Écris Heston et explique chaque paramètre. Qu'est-ce que la condition de Feller ? »** La section ci-dessus.
- **« Qu'est-ce qu'un swap de variance, comment le réplique-t-on ? »** Itô sur le log, puis Carr-Madan ; strike au-dessus de la vol ATM à cause du skew.
:::
