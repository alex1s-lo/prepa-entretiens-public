---
titre: Équations différentielles stochastiques
partie: Calcul stochastique
resume: Résoudre les trois EDS qui reviennent partout (brownien géométrique, Ornstein-Uhlenbeck, taux courts de Vasicek et CIR), calculer leurs moments sans les résoudre, passer d'une espérance à une EDP avec Feynman-Kac et simuler correctement. Le lien avec ton projet de stat arb (demi-vie d'un spread) est fait en détail.
duree: 3 h 30
fiches: stoch-gbm stoch-esperance-gbm stoch-mediane-gbm stoch-proba-au-dessus stoch-ornstein-uhlenbeck stoch-demi-vie risque-autocorrelation-ar1 risque-variance-ar1 taux-modeles-taux-courts nrj-schwartz stoch-feynman-kac der-edp-bs stoch-discretisation-euler proj-sa-pitch stoch-ou-variance stoch-cir-moyenne stoch-vasicek-zc
---
Le chapitre [[n:integrale-et-lemme-ito]] t'a donné l'outil (le lemme d'Itô). Ici on s'en sert pour **résoudre** des équations. En entretien, trois EDS couvrent l'essentiel des questions : le **brownien géométrique** (modèle de Black-Scholes), le processus d'**Ornstein-Uhlenbeck** (retour à la moyenne : spreads, taux, matières premières, et le cœur de ton projet de stat arb) et les modèles de **taux courts** (Vasicek, CIR). Pour chacune, la démarche est la même : trouver la bonne transformation, appliquer Itô, intégrer, puis lire la loi.

## Ce qu'est une EDS

:::definition Équation différentielle stochastique
Une EDS s'écrit
$$
dX_t = a(t, X_t)\,dt + b(t, X_t)\,dW_t, \qquad X_0 = x_0,
$$
ce qui est une notation pour l'équation intégrale
$$
X_t = x_0 + \int_0^t a(s, X_s)\,ds + \int_0^t b(s, X_s)\,dW_s.
$$
$a$ est la **dérive** (drift), $b$ la **volatilité** (ou coefficient de diffusion). Une solution (forte) est un processus adapté qui vérifie cette égalité.
:::

:::intuition Lire une EDS comme une recette de simulation
Sur un petit pas $\Delta t$ : $X_{t + \Delta t} \approx X_t + a(t, X_t)\,\Delta t + b(t, X_t)\sqrt{\Delta t}\,Z$ avec $Z \sim \mathcal{N}(0,1)$ indépendant du passé. La dérive pousse de façon déterministe, la volatilité ajoute un bruit dont l'écart-type est proportionnel à $\sqrt{\Delta t}$. C'est exactement le **schéma d'Euler** ; une EDS est la limite de cette recette quand $\Delta t \to 0$.
:::

:::theoreme Existence et unicité (admis)
Si $a$ et $b$ sont **lipschitziennes** en $x$ (uniformément en $t$) et à croissance au plus linéaire, l'EDS admet une unique solution forte, continue, avec $\mathbb{E}[\sup_{t \le T} X_t^2] < \infty$.
:::

C'est l'analogue du théorème de Cauchy-Lipschitz. Il couvre le brownien géométrique et Ornstein-Uhlenbeck, mais **pas** CIR, dont la volatilité $\sigma\sqrt{r}$ n'est pas lipschitzienne en 0 (il existe quand même une unique solution, par un autre théorème, de Yamada-Watanabe).

:::methode Résoudre une EDS en entretien
1. **Repérer la forme** : volatilité proportionnelle à $X$ (« $\sigma X\,dW$ ») → passer au **logarithme** ; dérive linéaire de rappel « $\kappa(\theta - X)$ » → multiplier par le **facteur intégrant** $e^{\kappa t}$.
2. Appliquer **Itô** à la transformation $f(t, X_t)$ : $df = \partial_t f\,dt + \partial_x f\,dX + \frac12\partial_{xx}f\,(dX)^2$, avec $(dX)^2 = b^2\,dt$.
3. Le membre de droite ne doit plus dépendre de $X$ : **intégrer** de 0 à $t$.
4. **Lire la loi** : une intégrale $\int f(s)\,dW_s$ avec $f$ déterministe est gaussienne de variance $\int f^2$ (isométrie).
5. **Vérifier** (si le temps le permet) en réappliquant Itô à la solution.
:::

## Le brownien géométrique

:::definition Brownien géométrique
$$
dS_t = \mu S_t\,dt + \sigma S_t\,dW_t, \qquad S_0 > 0.
$$
Le rendement instantané $dS_t / S_t$ a une moyenne $\mu\,dt$ et un écart-type $\sigma\sqrt{dt}$, indépendamment du niveau du prix : c'est l'hypothèse de Black-Scholes.
:::

:::theoreme Solution
$$
S_t = S_0 \exp\Big(\big(\mu - \tfrac12\sigma^2\big)t + \sigma W_t\Big).
$$
Autrement dit $\ln S_t \sim \mathcal{N}\big(\ln S_0 + (\mu - \tfrac12\sigma^2)t,\ \sigma^2 t\big)$ : $S_t$ suit une loi **log-normale**.
:::

:::preuve
Étape 1 : la volatilité est proportionnelle à $S$, on pose $Y_t = \ln S_t$, soit $f(x) = \ln x$, $f'(x) = 1/x$, $f''(x) = -1/x^2$.

Étape 2 : Itô. On a $(dS_t)^2 = \sigma^2 S_t^2\,dt$ (seul le terme $dW^2 = dt$ survit). Donc
$$
dY_t = \frac{1}{S_t}\,dS_t - \frac{1}{2}\,\frac{1}{S_t^2}\,(dS_t)^2 = \big(\mu\,dt + \sigma\,dW_t\big) - \frac12\,\sigma^2\,dt = \big(\mu - \tfrac12\sigma^2\big)dt + \sigma\,dW_t.
$$
Étape 3 : le membre de droite ne dépend plus de $Y$ ; on intègre : $Y_t = Y_0 + (\mu - \frac12\sigma^2)t + \sigma W_t$, puis on prend l'exponentielle.

Étape 5 (vérification) : posons $S_t = S_0 e^{Z_t}$ avec $dZ = (\mu - \frac12\sigma^2)dt + \sigma\,dW$. Itô avec $g(z) = S_0e^z$ ($g' = g'' = g$) : $dS = S\,dZ + \frac12 S\,(dZ)^2 = S(\mu - \frac12\sigma^2)dt + S\sigma\,dW + \frac12 S\sigma^2\,dt = \mu S\,dt + \sigma S\,dW$. ✓
:::

:::intuition D'où vient le $-\frac12\sigma^2$ ?
C'est la **concavité du logarithme** (inégalité de Jensen en temps continu). Un rendement de $+10\,\%$ suivi de $-10\,\%$ ne ramène pas au point de départ : $1{,}1 \times 0{,}9 = 0{,}99$. Plus la volatilité est grande, plus la croissance du logarithme (le rendement « composé ») est inférieure au rendement moyen $\mu$ : c'est le **volatility drag**. Le terme $-\frac12\sigma^2$ en est la version exacte, et il vient directement du terme $\frac12 f''\,(dS)^2$ d'Itô.
:::

### Moments, médiane, probabilités

Tout se déduit de $S_t = S_0 e^{G}$ avec $G \sim \mathcal{N}(m, v)$, $m = (\mu - \frac12\sigma^2)t$, $v = \sigma^2 t$, et de la formule du chapitre [[n:lois-gaussiennes]] : $\mathbb{E}[e^{\lambda G}] = e^{\lambda m + \frac12\lambda^2 v}$.

:::propriete Les formules à connaître
- **Espérance** : $\mathbb{E}[S_t] = S_0 e^{m + v/2} = S_0 e^{\mu t}$. Le $-\frac12\sigma^2$ et le $+\frac12 v$ se compensent exactement ([[fiche:stoch-esperance-gbm]]).
- **Second moment** : $\mathbb{E}[S_t^2] = S_0^2 e^{2m + 2v} = S_0^2 e^{(2\mu + \sigma^2)t}$.
- **Variance** : $\operatorname{Var}(S_t) = S_0^2 e^{2\mu t}\big(e^{\sigma^2 t} - 1\big)$.
- **Médiane** : $S_0 e^{(\mu - \frac12\sigma^2)t}$, **inférieure** à l'espérance ([[fiche:stoch-mediane-gbm]]).
- **Probabilité de finir au-dessus de $K$** : $\mathbb{P}(S_t > K) = N\left(\dfrac{\ln(S_0/K) + (\mu - \frac12\sigma^2)t}{\sigma\sqrt t}\right)$ ([[fiche:stoch-proba-au-dessus]]). Avec $\mu = r$, c'est le $N(d_2)$ de Black-Scholes : la probabilité risque-neutre d'exercice.
:::

:::preuve De la variance et de la probabilité
**Variance** : $\operatorname{Var}(S_t) = \mathbb{E}[S_t^2] - \mathbb{E}[S_t]^2 = S_0^2e^{(2\mu + \sigma^2)t} - S_0^2e^{2\mu t} = S_0^2e^{2\mu t}(e^{\sigma^2 t} - 1)$.

**Probabilité** : $S_t > K \iff \ln S_0 + m + \sigma W_t > \ln K \iff Z > -\dfrac{\ln(S_0/K) + m}{\sigma\sqrt t}$ où $Z = W_t/\sqrt t \sim \mathcal{N}(0,1)$. Par symétrie, $\mathbb{P}(Z > -x) = N(x)$.
:::

:::exemple Ordres de grandeur avec $S_0 = 100$, $\mu = 0$, $\sigma = 20\,\%$, $t = 1$
- $\mathbb{E}[S_1] = 100$, mais la médiane vaut $100e^{-0{,}02} \approx 98{,}02$ : plus d'une trajectoire sur deux finit **en dessous** de 100, compensée par quelques grosses hausses.
- $\mathbb{P}(S_1 > 100) = N(-0{,}1) \approx 0{,}460$.
- Écart-type : $100\sqrt{e^{0{,}04} - 1} \approx 20{,}2$, très proche de $\sigma S_0 = 20$ (car $e^{x} - 1 \approx x$).
- Quand $t \to \infty$ avec $\mu = 0$ : $\mathbb{E}[S_t] = 100$ pour tout $t$, alors que $S_t \to 0$ presque sûrement (car $-\frac12\sigma^2 t + \sigma W_t \to -\infty$). L'espérance est portée par des trajectoires de plus en plus rares. Question piège classique.
:::

:::exercice ex-eds-gbm-variance
reponse: 10000*(exp(0.04)-1)
tolerance: 0.01
$S_0 = 100$, $\mu = 0$, $\sigma = 20\,\%$. Que vaut $\operatorname{Var}(S_1)$ ?
---
$\operatorname{Var}(S_1) = S_0^2 e^{2\mu}(e^{\sigma^2} - 1) = 10\,000\,(e^{0{,}04} - 1) \approx 408{,}1$. L'approximation $\sigma^2 S_0^2 = 400$ est correcte à 2 % près.
:::

:::exercice ex-eds-gbm-proba
reponse: N(0.4)
$\mu = 10\,\%$, $\sigma = 20\,\%$. Quelle est la probabilité que $S_1 > S_0$ ?
---
$\mathbb{P}(S_1 > S_0) = N\left(\dfrac{\mu - \frac12\sigma^2}{\sigma}\right) = N\left(\dfrac{0{,}1 - 0{,}02}{0{,}2}\right) = N(0{,}4) \approx 0{,}655$. Le ratio $(\mu - \frac12\sigma^2)/\sigma$ ressemble à un ratio de Sharpe : sur un an, même une stratégie de Sharpe 0,5 perd de l'argent environ une année sur trois.
:::

## Le processus d'Ornstein-Uhlenbeck

:::definition Processus d'Ornstein-Uhlenbeck (OU)
$$
dX_t = \kappa(\theta - X_t)\,dt + \sigma\,dW_t, \qquad \kappa > 0.
$$
$\theta$ est le **niveau moyen**, $\kappa$ la **vitesse de retour** : la dérive pousse $X$ vers $\theta$ avec une force proportionnelle à l'écart. La volatilité $\sigma$ est constante.
:::

C'est le modèle de base du **retour à la moyenne** : spread de paires cointégrées (ton projet [[fiche:proj-sa-pitch]]), taux d'intérêt (Vasicek), log-prix des matières premières (Schwartz, [[fiche:nrj-schwartz]]), volatilité.

:::theoreme Solution d'Ornstein-Uhlenbeck
$$
X_t = \theta + (X_0 - \theta)e^{-\kappa t} + \sigma\int_0^t e^{-\kappa(t - s)}\,dW_s.
$$
Si $X_0$ est déterministe, $X_t$ est **gaussien** de moyenne et variance
$$
\mathbb{E}[X_t] = \theta + (X_0 - \theta)e^{-\kappa t}, \qquad \operatorname{Var}(X_t) = \frac{\sigma^2}{2\kappa}\big(1 - e^{-2\kappa t}\big).
$$
:::

:::preuve
Étape 1 : la dérive est linéaire en $X$ ; comme pour l'équation différentielle ordinaire $x' = -\kappa x + \kappa\theta$, on multiplie par le **facteur intégrant** $e^{\kappa t}$. Posons $Y_t = e^{\kappa t}X_t$, soit $f(t, x) = e^{\kappa t}x$.

Étape 2 : Itô. $\partial_t f = \kappa e^{\kappa t}x$, $\partial_x f = e^{\kappa t}$, $\partial_{xx} f = 0$ : **pas de terme de second ordre** (la transformation est linéaire en $x$). Donc
$$
dY_t = \kappa e^{\kappa t}X_t\,dt + e^{\kappa t}\,dX_t = \kappa e^{\kappa t}X_t\,dt + e^{\kappa t}\big(\kappa\theta - \kappa X_t\big)dt + e^{\kappa t}\sigma\,dW_t = \kappa\theta e^{\kappa t}\,dt + \sigma e^{\kappa t}\,dW_t.
$$
Les termes en $X_t$ se sont annulés : c'était le but.

Étape 3 : on intègre de 0 à $t$ :
$$
e^{\kappa t}X_t - X_0 = \kappa\theta\int_0^t e^{\kappa s}\,ds + \sigma\int_0^t e^{\kappa s}\,dW_s = \theta\big(e^{\kappa t} - 1\big) + \sigma\int_0^t e^{\kappa s}\,dW_s.
$$
On multiplie par $e^{-\kappa t}$ : $X_t = X_0e^{-\kappa t} + \theta(1 - e^{-\kappa t}) + \sigma\int_0^t e^{-\kappa(t - s)}\,dW_s$, qui est la formule annoncée.

Étape 4 : l'intégrande $s \mapsto e^{-\kappa(t-s)}$ est déterministe, donc l'intégrale est gaussienne, centrée, de variance (isométrie)
$$
\sigma^2\int_0^t e^{-2\kappa(t - s)}\,ds = \sigma^2\left[\frac{e^{-2\kappa(t-s)}}{2\kappa}\right]_{s=0}^{s=t} = \frac{\sigma^2}{2\kappa}\big(1 - e^{-2\kappa t}\big).
$$
:::

:::propriete Ce qu'il faut savoir dire sur OU
1. **L'écart à la moyenne décroît exponentiellement** en espérance : $\mathbb{E}[X_t] - \theta = (X_0 - \theta)e^{-\kappa t}$.
2. **Demi-vie** : le temps pour que l'écart attendu soit divisé par deux, $e^{-\kappa h} = \frac12$, soit $h = \dfrac{\ln 2}{\kappa}$ ([[fiche:stoch-demi-vie]]).
3. **Loi stationnaire** : quand $t \to \infty$, $X_t \to \mathcal{N}\big(\theta, \frac{\sigma^2}{2\kappa}\big)$ en loi. Si $X_0$ suit déjà cette loi (et est indépendant de $W$), $X_t$ la garde pour tout $t$.
4. **Covariance stationnaire** : $\operatorname{Cov}(X_s, X_t) = \dfrac{\sigma^2}{2\kappa}e^{-\kappa|t - s|}$. La corrélation décroît exponentiellement avec l'écart de temps.
5. Comparaison avec le brownien : la variance de $W_t$ croît sans fin ($t$), celle d'OU sature à $\sigma^2/(2\kappa)$. Pour $t \ll 1/\kappa$, $\operatorname{Var}(X_t) \approx \sigma^2 t$ : aux temps courts, OU ressemble à un brownien.
:::

:::preuve De la covariance (point 4)
Partons de $X_s$ et regardons $X_t$ pour $t \ge s$ : la formule de la solution appliquée entre $s$ et $t$ donne
$$
X_t - \theta = (X_s - \theta)e^{-\kappa(t - s)} + \sigma\int_s^t e^{-\kappa(t - u)}\,dW_u.
$$
L'intégrale ne dépend que des accroissements de $W$ après $s$ : elle est indépendante de $X_s$. Par bilinéarité,
$$
\operatorname{Cov}(X_s, X_t) = e^{-\kappa(t - s)}\operatorname{Var}(X_s) + 0.
$$
En régime stationnaire, $\operatorname{Var}(X_s) = \sigma^2/(2\kappa)$. Avec $X_0$ déterministe, $\operatorname{Var}(X_s) = \frac{\sigma^2}{2\kappa}(1 - e^{-2\kappa s})$, d'où $\operatorname{Cov}(X_s, X_t) = \frac{\sigma^2}{2\kappa}\big(e^{-\kappa(t - s)} - e^{-\kappa(t + s)}\big)$.
:::

:::widget ou
:::

### En temps discret : le modèle AR(1)

:::theoreme OU échantillonné = AR(1)
Observé tous les $\Delta$ (par exemple chaque jour), un OU vérifie exactement
$$
X_{k+1} - \theta = \varphi\,(X_k - \theta) + \varepsilon_{k+1}, \qquad \varphi = e^{-\kappa\Delta}, \qquad \varepsilon_{k+1} \sim \mathcal{N}\left(0,\ \frac{\sigma^2}{2\kappa}\big(1 - e^{-2\kappa\Delta}\big)\right),
$$
avec des $\varepsilon_k$ indépendants. C'est un **processus autorégressif d'ordre 1** ([[fiche:risque-autocorrelation-ar1]]).
:::

:::preuve
C'est la formule de passage de $s$ à $t$ ci-dessus, avec $s = k\Delta$, $t = (k+1)\Delta$. Le bruit $\varepsilon_{k+1} = \sigma\int_{k\Delta}^{(k+1)\Delta} e^{-\kappa((k+1)\Delta - u)}\,dW_u$ ne dépend que des accroissements de $W$ sur $[k\Delta, (k+1)\Delta]$, intervalles disjoints : les $\varepsilon_k$ sont indépendants. Sa variance se calcule comme dans la preuve de la solution, en remplaçant $t$ par $\Delta$.
:::

:::propriete Variance et autocorrélation d'un AR(1) stationnaire
Si $x_t = \varphi x_{t-1} + \varepsilon_t$ avec $|\varphi| < 1$, $\operatorname{Var}(\varepsilon_t) = s^2$ et $\varepsilon_t$ indépendant du passé :
$$
\operatorname{Var}(x_t) = \frac{s^2}{1 - \varphi^2}, \qquad \operatorname{Cov}(x_t, x_{t+h}) = \varphi^{h}\,\frac{s^2}{1 - \varphi^2}, \qquad \operatorname{Corr}(x_t, x_{t+h}) = \varphi^{h}.
$$
:::

:::preuve
**Variance** : en stationnaire, $V = \operatorname{Var}(x_t) = \operatorname{Var}(x_{t-1})$. Comme $\varepsilon_t$ est indépendant de $x_{t-1}$, $V = \varphi^2 V + s^2$, donc $V = s^2/(1 - \varphi^2)$ ([[fiche:risque-variance-ar1]]).

**Covariance** : par récurrence, $x_{t+h} = \varphi^h x_t + (\text{combinaison de } \varepsilon_{t+1}, \dots, \varepsilon_{t+h})$, et ces bruits sont indépendants de $x_t$ : $\operatorname{Cov}(x_t, x_{t+h}) = \varphi^h V$.

**Cohérence avec OU** : $s^2 = \frac{\sigma^2}{2\kappa}(1 - e^{-2\kappa\Delta})$ et $1 - \varphi^2 = 1 - e^{-2\kappa\Delta}$ donnent $V = \frac{\sigma^2}{2\kappa}$ : la même variance stationnaire. ✓
:::

:::methode Estimer un OU sur des données (ce que fait ton projet de stat arb)
1. Régresser par moindres carrés $X_{k+1} = c + \varphi X_k + \text{résidu}$ (régression du spread du jour sur celui de la veille).
2. En déduire $\kappa = -\ln(\hat\varphi)/\Delta$, $\theta = \hat c/(1 - \hat\varphi)$, et $\sigma$ à partir de la variance des résidus $\hat s^2$ : $\sigma^2 = \dfrac{2\kappa\,\hat s^2}{1 - \hat\varphi^2}$.
3. **Demi-vie** $h = \ln 2/\kappa = -\Delta\ln 2/\ln\hat\varphi$, soit $-\ln 2/\ln\hat\varphi$ en nombre de pas. Pour $\hat\varphi$ proche de 1, $-\ln\hat\varphi \approx 1 - \hat\varphi$, donc $h \approx 0{,}69/(1 - \hat\varphi)$.
4. Garde-fous : si $\hat\varphi \ge 1$, il n'y a pas de retour à la moyenne (racine unitaire, voir le test ADF au chapitre [[n:statistiques-et-regression]]). Une demi-vie de plusieurs centaines de jours est inexploitable en pratique ; une demi-vie de l'ordre de la journée sur données quotidiennes est suspecte (bruit, bid-ask bounce).
:::

:::exemple Le calcul que l'on te demandera
Un spread quotidien a un coefficient AR(1) estimé $\hat\varphi = 0{,}9$. Alors $\kappa = -\ln 0{,}9 \approx 0{,}105$ par jour et la demi-vie vaut $\ln 2/0{,}105 \approx 6{,}6$ jours. L'approximation $0{,}69/0{,}1 = 6{,}9$ jours suffit à l'oral.
:::

:::exercice ex-eds-ou-demi-vie
reponse: log(2)/(-log(0.95))
tolerance: 0.01
Le coefficient AR(1) quotidien d'un spread vaut $0{,}95$. Quelle est sa demi-vie, en jours ?
---
$\kappa = -\ln 0{,}95 \approx 0{,}0513$ par jour, donc $h = \ln 2/\kappa \approx 13{,}5$ jours. Vérification directe : $0{,}95^{13{,}5} \approx 0{,}5$. L'approximation $0{,}693/0{,}05 \approx 13{,}9$ est un peu au-dessus.
:::

:::exercice ex-eds-ou-variance
reponse: (1-exp(-4))/4
$dX = -2X\,dt + dW$, $X_0 = 0$. Que vaut $\operatorname{Var}(X_1)$ ?
---
$\kappa = 2$, $\sigma = 1$ : $\operatorname{Var}(X_1) = \frac{1}{4}(1 - e^{-4}) \approx 0{,}2454$. On est déjà presque à la variance stationnaire $1/4$ : au bout de $t = 1$, soit environ trois demi-vies ($\ln 2/2 \approx 0{,}35$), le processus a « oublié » son point de départ.
:::

:::exercice ex-eds-ar1-covariance
reponse: 1/6
$x_t = 0{,}5\,x_{t-1} + \varepsilon_t$, avec des $\varepsilon_t$ indépendants de variance 1, en régime stationnaire. Que vaut $\operatorname{Cov}(x_t, x_{t+3})$ ?
---
$\operatorname{Var}(x_t) = \frac{1}{1 - 0{,}25} = \frac43$ et $\operatorname{Cov}(x_t, x_{t+3}) = 0{,}5^3 \times \frac43 = \frac{1}{6}$.
:::

## Les modèles de taux courts

On modélise le taux sans risque instantané $r_t$ ; le prix en $0$ d'une obligation zéro-coupon de maturité $T$ (qui paie 1 en $T$) est, sous la probabilité risque-neutre (chapitre [[n:arbitrage-et-risque-neutre]]),
$$
P(0, T) = \mathbb{E}\left[\exp\left(-\int_0^T r_t\,dt\right)\right].
$$

:::definition Vasicek, CIR, Hull-White
- **Vasicek** : $dr_t = \kappa(\theta - r_t)\,dt + \sigma\,dW_t$. C'est un OU : taux gaussiens, formules fermées, mais **taux négatifs possibles**.
- **Cox-Ingersoll-Ross (CIR)** : $dr_t = \kappa(\theta - r_t)\,dt + \sigma\sqrt{r_t}\,dW_t$. La volatilité s'éteint quand $r \to 0$ : le taux reste positif. Il ne touche jamais 0 si la **condition de Feller** $2\kappa\theta \ge \sigma^2$ est vérifiée (admis).
- **Hull-White** : Vasicek avec un niveau $\theta(t)$ dépendant du temps, choisi pour **recaler exactement la courbe des taux** observée aujourd'hui. C'est le standard en banque pour les produits de taux simples ([[fiche:taux-modeles-taux-courts]]).
:::

:::theoreme Prix d'un zéro-coupon dans Vasicek
Notons $B(T) = \dfrac{1 - e^{-\kappa T}}{\kappa}$. L'intégrale $I = \int_0^T r_t\,dt$ est gaussienne, de moyenne et variance
$$
\mathbb{E}[I] = \theta T + (r_0 - \theta)B(T), \qquad \operatorname{Var}(I) = \frac{\sigma^2}{\kappa^2}\left(T - 2B(T) + \frac{1 - e^{-2\kappa T}}{2\kappa}\right),
$$
et $P(0, T) = \exp\big(-\mathbb{E}[I] + \frac12\operatorname{Var}(I)\big)$.
:::

:::preuve
**Moyenne** : $\mathbb{E}[r_t] = \theta + (r_0 - \theta)e^{-\kappa t}$, et $\int_0^T e^{-\kappa t}\,dt = B(T)$.

**Partie aléatoire** : d'après la solution d'OU, $r_t - \mathbb{E}[r_t] = \sigma\int_0^t e^{-\kappa(t - s)}\,dW_s$. On intègre en $t$ et on échange les deux intégrales (Fubini stochastique, admis) :
$$
\int_0^T\!\!\int_0^t \sigma e^{-\kappa(t - s)}\,dW_s\,dt = \int_0^T \sigma\left(\int_s^T e^{-\kappa(t - s)}\,dt\right)dW_s = \int_0^T \sigma\,\frac{1 - e^{-\kappa(T - s)}}{\kappa}\,dW_s.
$$
L'intégrande est déterministe : $I$ est gaussienne et, par isométrie, avec $u = T - s$,
$$
\operatorname{Var}(I) = \frac{\sigma^2}{\kappa^2}\int_0^T \big(1 - e^{-\kappa u}\big)^2\,du = \frac{\sigma^2}{\kappa^2}\int_0^T \big(1 - 2e^{-\kappa u} + e^{-2\kappa u}\big)\,du = \frac{\sigma^2}{\kappa^2}\left(T - 2B(T) + \frac{1 - e^{-2\kappa T}}{2\kappa}\right).
$$
**Prix** : pour $I \sim \mathcal{N}(m, v)$, $\mathbb{E}[e^{-I}] = e^{-m + v/2}$ (transformée de Laplace gaussienne, chapitre [[n:lois-gaussiennes]]).
:::

:::intuition Lecture du résultat
Le terme $+\frac12\operatorname{Var}(I)$ **augmente** le prix de l'obligation : c'est un effet de **convexité** ($x \mapsto e^{-x}$ est convexe, Jensen). Plus les taux sont volatils, plus les zéro-coupons longs valent cher, et plus les taux longs sont bas à anticipations égales. Aux temps courts ($\kappa T \ll 1$), $\operatorname{Var}(I) \approx \sigma^2 T^3/3$ : c'est la variance de $\int_0^T W_t\,dt$ (chapitre [[n:mouvement-brownien]]), cohérent puisque OU ressemble alors à un brownien.
:::

:::exercice ex-eds-vasicek-variance
reponse: 2*exp(-1)-0.5*exp(-2)-0.5
tolerance: 0.001
Dans Vasicek avec $\kappa = 1$, $\sigma = 1$ et $r_0$ déterministe, que vaut $\operatorname{Var}\left(\int_0^1 r_t\,dt\right)$ ?
---
$B(1) = 1 - e^{-1}$, donc $\operatorname{Var} = 1 - 2(1 - e^{-1}) + \frac{1 - e^{-2}}{2} = 2e^{-1} - \frac12 e^{-2} - \frac12 \approx 0{,}168$. Contrôle : sans retour à la moyenne ($\kappa \to 0$), on aurait $T^3/3 = 0{,}333$ ; le rappel divise ici la variance par deux.
:::

### Les moments sans résoudre l'équation

Pour CIR, on ne sait pas écrire $r_t$ comme une fonction explicite de $W$. Mais on peut calculer ses moments : on prend l'espérance de l'EDS, ce qui tue le terme en $dW$ (l'intégrale d'Itô est d'espérance nulle).

:::methode Équation différentielle des moments
Si $dX = a(X)\,dt + b(X)\,dW$, alors $m(t) = \mathbb{E}[X_t]$ vérifie $m'(t) = \mathbb{E}[a(X_t)]$. Si $a$ est **affine**, c'est une équation différentielle ordinaire en $m$. Pour le second moment, on applique d'abord Itô à $X^2$ : $d(X^2) = 2X\,dX + (dX)^2 = \big(2Xa(X) + b(X)^2\big)dt + 2Xb(X)\,dW$.
:::

:::exemple Moyenne et variance stationnaire de CIR
**Moyenne** : $m' = \kappa(\theta - m)$, donc $m(t) = \theta + (r_0 - \theta)e^{-\kappa t}$, **la même que Vasicek** : la forme de la volatilité ne change pas l'espérance.

**Second moment** : $d(r^2) = 2r\big(\kappa(\theta - r)dt + \sigma\sqrt r\,dW\big) + \sigma^2 r\,dt$. En espérance, avec $q(t) = \mathbb{E}[r_t^2]$ :
$$
q' = 2\kappa\theta\,m - 2\kappa q + \sigma^2 m.
$$
En régime stationnaire, $q' = 0$ et $m = \theta$ : $q = \theta^2 + \dfrac{\sigma^2\theta}{2\kappa}$, d'où $\operatorname{Var}_\infty(r) = \dfrac{\sigma^2\theta}{2\kappa}$. Comparé à Vasicek ($\sigma^2/(2\kappa)$), il y a un facteur $\theta$ : la volatilité de CIR est $\sigma\sqrt r$, de carré moyen $\sigma^2\theta$.
:::

:::exercice ex-eds-cir-moyenne
reponse: 0.04-0.02*exp(-1)
tolerance: 0.0005
CIR avec $\kappa = 0{,}5$, $\theta = 4\,\%$, $\sigma = 10\,\%$ et $r_0 = 2\,\%$. Que vaut $\mathbb{E}[r_2]$ ?
---
$\mathbb{E}[r_2] = \theta + (r_0 - \theta)e^{-\kappa \cdot 2} = 0{,}04 - 0{,}02\,e^{-1} \approx 3{,}26\,\%$. La volatilité n'intervient pas.
:::

:::exemple Matières premières : le modèle de Schwartz à un facteur
Le log-prix spot $X_t = \ln S_t$ suit un OU : $dX = \kappa(\mu - X)\,dt + \sigma\,dW$ ([[fiche:nrj-schwartz]]). Le prix forward (sous la probabilité risque-neutre, en ignorant la prime de risque) est
$$
F(0, T) = \mathbb{E}[S_T] = \exp\left(\mathbb{E}[X_T] + \tfrac12\operatorname{Var}(X_T)\right) = \exp\left(\mu + (X_0 - \mu)e^{-\kappa T} + \frac{\sigma^2}{4\kappa}\big(1 - e^{-2\kappa T}\big)\right).
$$
Les forwards longs ne dépendent presque plus du spot du jour : la courbe forward « oublie » le spot avec la demi-vie $\ln 2/\kappa$. C'est le comportement observé sur l'électricité et le gaz (et un point à mentionner si tu as une expérience dans l'énergie).
:::

## De l'espérance à l'EDP : Feynman-Kac

:::definition Générateur d'une diffusion
Pour $dX = a(t, X)\,dt + b(t, X)\,dW$, le générateur agit sur les fonctions régulières par
$$
\mathcal{L}f(t, x) = a(t, x)\,\partial_x f(t, x) + \tfrac12 b(t, x)^2\,\partial_{xx}f(t, x).
$$
Par Itô, $df(t, X_t) = \big(\partial_t f + \mathcal{L}f\big)(t, X_t)\,dt + \partial_x f\,b\,dW_t$ : $\partial_t f + \mathcal{L} f$ est la dérive de $f(t, X_t)$.
:::

:::theoreme Formule de Feynman-Kac
Soit $u(t, x) = \mathbb{E}\left[e^{-\int_t^T r(s, X_s)\,ds}\,g(X_T)\ \middle|\ X_t = x\right]$. Sous des hypothèses de régularité, $u$ est solution de
$$
\partial_t u + a\,\partial_x u + \tfrac12 b^2\,\partial_{xx}u - r\,u = 0, \qquad u(T, x) = g(x).
$$
Réciproquement, une solution (régulière, à croissance contrôlée) de cette EDP admet cette représentation ([[fiche:stoch-feynman-kac]]).
:::

:::preuve Idée, dans le sens EDP vers espérance
Supposons $r$ constant et soit $u$ solution de l'EDP. Posons $M_s = e^{-r(s - t)}u(s, X_s)$ pour $s \in [t, T]$. Par Itô (produit d'une fonction déterministe et de $u(s, X_s)$) :
$$
dM_s = e^{-r(s - t)}\Big(-r\,u + \partial_t u + a\,\partial_x u + \tfrac12 b^2\,\partial_{xx}u\Big)ds + e^{-r(s - t)}\,\partial_x u\,b\,dW_s.
$$
La parenthèse est nulle par l'EDP : $M$ n'a pas de dérive, c'est une martingale (sous des conditions d'intégrabilité). Donc $M_t = \mathbb{E}[M_T \mid X_t = x]$, c'est-à-dire $u(t, x) = \mathbb{E}\big[e^{-r(T - t)}g(X_T) \mid X_t = x\big]$.
:::

:::intuition Pourquoi c'est utile
Feynman-Kac est un **pont** entre deux mondes. Un prix d'option est une espérance (on peut le calculer par **Monte-Carlo**) et aussi la solution d'une EDP (on peut le calculer par **différences finies**). Selon le produit, l'un ou l'autre est plus efficace : l'EDP en dimension 1 ou 2 avec exercice anticipé, le Monte-Carlo en grande dimension ou pour des produits dépendant de la trajectoire.
:::

:::exemple L'EDP de Black-Scholes
Sous la probabilité risque-neutre, $dS = rS\,dt + \sigma S\,dW$. Le prix $V(t, S) = \mathbb{E}\big[e^{-r(T - t)}g(S_T) \mid S_t = S\big]$ vérifie donc, avec $a = rS$ et $b = \sigma S$,
$$
\partial_t V + rS\,\partial_S V + \tfrac12\sigma^2S^2\,\partial_{SS}V - rV = 0, \qquad V(T, S) = g(S).
$$
C'est l'EDP de Black-Scholes ([[fiche:der-edp-bs]]). Au chapitre [[n:black-scholes]], on la retrouvera par un argument complètement différent, la couverture en delta.
:::

:::exemple Résoudre une EDP en calculant une espérance
Résoudre $\partial_t u + \frac12\partial_{xx}u = 0$ sur $[0, T]$ avec $u(T, x) = x^2$. Ici $a = 0$, $b = 1$, $r = 0$ : la diffusion est un brownien partant de $x$, donc
$$
u(t, x) = \mathbb{E}\big[(x + W_{T - t})^2\big] = x^2 + 2x\,\mathbb{E}[W_{T-t}] + \mathbb{E}[W_{T-t}^2] = x^2 + (T - t).
$$
Vérification : $\partial_t u = -1$ et $\frac12\partial_{xx}u = 1$, la somme est nulle. ✓
:::

:::exercice ex-eds-feynman-kac
reponse: 10
Soit $u$ solution de $\partial_t u + \frac12\partial_{xx}u = 0$ avec $u(1, x) = x^4$. Que vaut $u(0, 1)$ ?
---
$u(0, x) = \mathbb{E}[(x + W_1)^4] = x^4 + 6x^2\,\mathbb{E}[W_1^2] + \mathbb{E}[W_1^4] = x^4 + 6x^2 + 3$ (les moments impairs sont nuls). En $x = 1$ : $1 + 6 + 3 = 10$.
:::

## Simuler une EDS

:::definition Schéma d'Euler-Maruyama
Sur une grille de pas $\Delta$ : $\hat X_{k+1} = \hat X_k + a(t_k, \hat X_k)\,\Delta + b(t_k, \hat X_k)\sqrt\Delta\,Z_{k+1}$, avec des $Z_k \sim \mathcal{N}(0,1)$ indépendants.
:::

:::propriete Précision (admis)
- **Ordre fort** $\frac12$ : $\mathbb{E}|X_T - \hat X_T| = O(\sqrt\Delta)$ (erreur trajectoire par trajectoire).
- **Ordre faible** 1 : $|\mathbb{E}[g(X_T)] - \mathbb{E}[g(\hat X_T)]| = O(\Delta)$ (erreur sur les espérances, ce qui compte pour un prix).
- Le schéma de **Milstein** ajoute le terme $\frac12 b\,\partial_x b\,\big((\Delta W)^2 - \Delta\big)$ et atteint l'ordre fort 1. Il vient du développement d'Itô à l'ordre suivant ([[fiche:stoch-discretisation-euler]]).
:::

:::methode Simuler sans biais quand c'est possible
- **Brownien géométrique** : simuler le logarithme, $S_{k+1} = S_k\exp\big((\mu - \frac12\sigma^2)\Delta + \sigma\sqrt\Delta\,Z\big)$. C'est **exact** pour tout pas, et le prix reste positif (Euler direct peut le rendre négatif si $Z$ est très négatif).
- **Ornstein-Uhlenbeck** : utiliser la récurrence AR(1) exacte (c'est ce que fait le widget plus haut).
- **CIR** : pas de récurrence exacte simple ; Euler peut donner $r < 0$ et $\sqrt r$ n'a plus de sens. Corrections usuelles : troncature « full truncation » ($r$ remplacé par $r^+ = \max(r, 0)$ dans la dérive et dans $\sqrt{r}$), ou simulation exacte par la loi du khi-deux non centré.
- **Erreur totale d'un Monte-Carlo** = biais de discrétisation $O(\Delta)$ + erreur statistique $O(1/\sqrt{n})$. À budget de calcul fixé $n/\Delta$, on équilibre les deux (voir le chapitre sur les méthodes numériques).
:::

## Pièges classiques

:::attention Les erreurs qui coûtent cher en entretien
- **Oublier le terme d'Itô** en passant au log : écrire $d\ln S = \mu\,dt + \sigma\,dW$. Le $-\frac12\sigma^2$ est la première chose que l'intervieweur vérifie.
- Confondre **espérance et médiane** du brownien géométrique : $\mathbb{E}[S_t] = S_0e^{\mu t}$, médiane $S_0e^{(\mu - \sigma^2/2)t}$.
- Dire qu'OU est **stationnaire** quel que soit $X_0$ : il ne l'est que si $X_0$ suit la loi stationnaire ; sinon il y converge.
- Confondre la **variance stationnaire** $\sigma^2/(2\kappa)$ avec $\sigma^2/\kappa$ : le 2 vient de $\int_0^\infty e^{-2\kappa u}\,du = 1/(2\kappa)$.
- Donner une demi-vie en $1/\kappa$ au lieu de $\ln 2/\kappa$ ($1/\kappa$ est le temps caractéristique, où l'écart est divisé par $e$).
- Dans Vasicek, oublier la **convexité** : $P(0,T) \ne e^{-\mathbb{E}[I]}$.
- Croire que CIR et Vasicek ont des moyennes différentes : la moyenne ne dépend que de la dérive.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Résous $dS = \mu S\,dt + \sigma S\,dW$. »** Passer au log, Itô, intégrer ; donner la loi, $\mathbb{E}[S_t]$ et la médiane. Deux minutes, au tableau, sans hésiter.
- **« Qu'est-ce qu'un processus d'Ornstein-Uhlenbeck ? Où l'utilise-t-on ? »** EDS, solution par facteur intégrant, moyenne, variance stationnaire, demi-vie ; exemples : spread de paires, taux, matières premières, volatilité (Heston utilise un CIR pour la variance).
- **« Comment estimerais-tu la demi-vie d'un spread ? »** Régression AR(1), $h = -\ln 2/\ln\hat\varphi$, garde-fous (racine unitaire, stabilité dans le temps, walk-forward). C'est exactement ton projet : sois prêt à expliquer tes propres chiffres.
- **« Vasicek ou CIR ? »** Vasicek : gaussien, formules fermées, taux négatifs possibles (ce qui n'est plus forcément un défaut depuis les taux négatifs de la zone euro). CIR : positif sous Feller, volatilité qui dépend du niveau. Hull-White pour caler la courbe.
- **« Énonce Feynman-Kac et donne un exemple. »** L'EDP de Black-Scholes, et la preuve en une ligne : $e^{-rt}V(t, S_t)$ est une martingale.
- **« Comment simuler cette EDS ? »** Euler (ordres fort $\frac12$ et faible 1), simulation exacte quand elle existe, attention à la positivité.
:::
