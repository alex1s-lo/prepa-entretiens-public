---
titre: Risque et construction de portefeuille
partie: Risque, données et marchés
resume: La variance d'un portefeuille en écriture matricielle, la diversification et sa limite, le portefeuille de variance minimale et le portefeuille tangent (preuves par Lagrange), le bêta et la couverture de variance minimale, la VaR et l'Expected Shortfall (avec le contre-exemple de sous-additivité), les modèles EWMA et GARCH, la probabilité de drawdown et le critère de Kelly.
duree: 3 h 30
fiches: stats-vol-portefeuille risque-diversification-limite risque-beta risque-couverture-variance-min risque-sharpe-levier ml-loi-fondamentale taux-var-normale taux-var-10-jours taux-var-es taux-es-gaussienne taux-exceptions-var risque-var-historique risque-exceptions-historique risque-stress-test risque-correlation-crise risque-liquidite risque-ewma-demi-vie risque-garch-long-terme risque-drawdown-attendu mm-kelly mm-kelly-cote stats-correlation-rendements risque-portefeuille-variance-min risque-sharpe-strategies risque-var-sous-additivite risque-proba-drawdown
---
Ce chapitre est l'application la plus directe de la manipulation des covariances du chapitre [[n:esperance-variance-covariance]]. Un portefeuille est une combinaison linéaire d'actifs ; son risque est une forme quadratique $w^\top\Sigma w$ ; et presque toutes les questions (diversification, couverture, allocation optimale, bêta) reviennent à minimiser ou maximiser une telle forme. On termine par la mesure du risque (VaR, ES, volatilité dynamique) et par la question « combien miser ? » (Kelly).

## La variance d'un portefeuille

:::theoreme Variance d'une combinaison linéaire
Si un portefeuille détient les poids $w = (w_1, \dots, w_n)$ d'actifs de rendements $R = (R_1, \dots, R_n)$, de moyenne $\mu$ et de matrice de covariance $\Sigma$, son rendement $R_p = w^\top R$ vérifie
$$
\mathbb{E}[R_p] = w^\top\mu, \qquad \operatorname{Var}(R_p) = w^\top\Sigma w = \sum_{i,j}w_iw_j\Sigma_{ij}.
$$
Pour deux actifs : $\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2$.
:::

:::preuve
Par bilinéarité de la covariance (chapitre [[n:esperance-variance-covariance]]) : $\operatorname{Var}\big(\sum_iw_iR_i\big) = \operatorname{Cov}\big(\sum_iw_iR_i, \sum_jw_jR_j\big) = \sum_{i,j}w_iw_j\operatorname{Cov}(R_i, R_j)$.
:::

:::exemple Portefeuille 50/50 ([[fiche:stats-vol-portefeuille]])
Volatilités 20 % et 30 %, corrélation 0,5 : $\sigma_p^2 = 0{,}25 \times 0{,}04 + 0{,}25 \times 0{,}09 + 2 \times 0{,}25 \times 0{,}5 \times 0{,}2 \times 0{,}3 = 0{,}0475$, soit $\sigma_p \approx 21{,}8\,\%$, moins que la moyenne des volatilités (25 %) : c'est la diversification. Avec $\rho = 1$, on aurait exactement 25 %.
:::

:::theoreme Limite de la diversification ([[fiche:risque-diversification-limite]])
Pour $n$ actifs équipondérés, de même volatilité $\sigma$ et de corrélation deux à deux $\rho$ :
$$
\sigma_p^2 = \frac{\sigma^2}{n} + \Big(1 - \frac1n\Big)\rho\,\sigma^2 \xrightarrow[n \to \infty]{} \rho\,\sigma^2.
$$
:::

:::preuve
$\sum_{i,j}\frac{1}{n^2}\Sigma_{ij}$ contient $n$ termes diagonaux égaux à $\sigma^2$ et $n(n-1)$ termes hors diagonale égaux à $\rho\sigma^2$ : $\frac{n\sigma^2 + n(n - 1)\rho\sigma^2}{n^2}$.

**Lecture** : le risque **spécifique** (le terme en $1/n$) disparaît, le risque **systématique** ($\rho\sigma^2$) reste. Avec $\sigma = 20\,\%$ et $\rho = 0{,}25$, la volatilité ne descend jamais sous $20\,\% \times \sqrt{0{,}25} = 10\,\%$.
:::

:::exercice ex-rp-vol
reponse: sqrt(0.36*0.0225+0.16*0.0625+2*0.6*0.4*0.2*0.15*0.25)
tolerance: 0.0001
Portefeuille 60 % / 40 % de deux actifs de volatilités 15 % et 25 %, corrélés à 0,2. Volatilité du portefeuille ?
---
$\sigma_p^2 = 0{,}36 \times 0{,}0225 + 0{,}16 \times 0{,}0625 + 2 \times 0{,}6 \times 0{,}4 \times 0{,}2 \times 0{,}15 \times 0{,}25 = 0{,}0081 + 0{,}0100 + 0{,}0036 = 0{,}0217$, donc $\sigma_p \approx 14{,}7\,\%$ : moins que le moins risqué des deux actifs.
:::

:::attention Corrélations et horizon ([[fiche:stats-correlation-rendements]], [[fiche:risque-correlation-crise]])
Une corrélation dépend de la **fréquence** des rendements (asynchronisme des clôtures, retour à la moyenne à court terme) et du **régime** : en crise, les corrélations montent vers 1 et la diversification disparaît précisément quand on en a besoin. Une matrice estimée en période calme sous-estime le risque de crise : on la complète par des **stress tests** ([[fiche:risque-stress-test]]).
:::

## Portefeuilles optimaux

:::theoreme Portefeuille de variance minimale
Parmi les portefeuilles investis à 100 % ($\mathbf{1}^\top w = 1$), celui de variance minimale est
$$
w^* = \frac{\Sigma^{-1}\mathbf{1}}{\mathbf{1}^\top\Sigma^{-1}\mathbf{1}}.
$$
Pour deux actifs : $w_1^* = \dfrac{\sigma_2^2 - \rho\sigma_1\sigma_2}{\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2}$.
:::

:::preuve Par le lagrangien
On minimise $\frac12w^\top\Sigma w$ sous la contrainte $\mathbf{1}^\top w = 1$. Le lagrangien $\mathcal{L} = \frac12w^\top\Sigma w - \lambda(\mathbf{1}^\top w - 1)$ a pour gradient $\Sigma w - \lambda\mathbf{1}$, nul pour $w = \lambda\Sigma^{-1}\mathbf{1}$. La contrainte donne $\lambda = 1/(\mathbf{1}^\top\Sigma^{-1}\mathbf{1})$.

**Deux actifs, directement** : avec $w_2 = 1 - w_1$, $\sigma_p^2(w_1) = w_1^2\sigma_1^2 + (1 - w_1)^2\sigma_2^2 + 2w_1(1 - w_1)\rho\sigma_1\sigma_2$. Dérivée : $2w_1\sigma_1^2 - 2(1 - w_1)\sigma_2^2 + 2(1 - 2w_1)\rho\sigma_1\sigma_2 = 0$, d'où $w_1(\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2) = \sigma_2^2 - \rho\sigma_1\sigma_2$.
:::

:::exercice ex-rp-min-variance
reponse: 6/7
tolerance: 0.0001
Deux actifs de volatilités 20 % et 30 %, corrélés à 0,5. Quel poids dans le premier donne la variance minimale ?
---
$w_1^* = \frac{0{,}09 - 0{,}5 \times 0{,}2 \times 0{,}3}{0{,}04 + 0{,}09 - 2 \times 0{,}03} = \frac{0{,}06}{0{,}07} = \frac67 \approx 85{,}7\,\%$.
:::

:::theoreme Allocation moyenne-variance et portefeuille tangent
Avec un actif sans risque de taux $r$ et des excès de rendement $m = \mu - r\mathbf{1}$, l'investisseur qui maximise $w^\top m - \frac\gamma2w^\top\Sigma w$ (rendement moins une pénalité de risque) choisit
$$
w = \frac1\gamma\,\Sigma^{-1}m.
$$
La **direction** $\Sigma^{-1}m$ ne dépend pas de l'aversion au risque $\gamma$ : c'est le **portefeuille tangent**, celui de Sharpe maximal, et son Sharpe vaut $\text{SR}^* = \sqrt{m^\top\Sigma^{-1}m}$.
:::

:::preuve
Le gradient $m - \gamma\Sigma w$ s'annule en $w = \Sigma^{-1}m/\gamma$ (maximum car $-\gamma\Sigma$ est définie négative). Le Sharpe d'un portefeuille $w$ est $\frac{w^\top m}{\sqrt{w^\top\Sigma w}}$, invariant par multiplication de $w$ par une constante positive ; en $w = \Sigma^{-1}m$, il vaut $\frac{m^\top\Sigma^{-1}m}{\sqrt{m^\top\Sigma^{-1}\Sigma\Sigma^{-1}m}} = \sqrt{m^\top\Sigma^{-1}m}$. C'est le maximum, par l'inégalité de Cauchy-Schwarz pour le produit scalaire $\langle u, v\rangle = u^\top\Sigma v$ : $w^\top m = \langle w, \Sigma^{-1}m\rangle \le \sqrt{w^\top\Sigma w}\,\sqrt{m^\top\Sigma^{-1}m}$.
:::

:::propriete Combiner des stratégies non corrélées
Si les stratégies sont **non corrélées** ($\Sigma$ diagonale), $\text{SR}^{*2} = \sum_i\frac{m_i^2}{\sigma_i^2} = \sum_i\text{SR}_i^2$ : **les Sharpe s'ajoutent en carré**. Deux stratégies indépendantes de Sharpe 1 donnent un Sharpe de $\sqrt2 \approx 1{,}41$. C'est la logique des fonds multi-stratégies, et celle de la **loi fondamentale de la gestion active** : $\text{IR} \approx \text{IC}\sqrt{\text{nombre de paris indépendants}}$ ([[fiche:ml-loi-fondamentale]]).
:::

:::exercice ex-rp-sharpe-combine
reponse: sqrt(1.25)
tolerance: 0.0005
Deux stratégies non corrélées ont des Sharpe de 1 et 0,5. Quel est le Sharpe de leur meilleure combinaison ?
---
$\sqrt{1^2 + 0{,}5^2} = \sqrt{1{,}25} \approx 1{,}12$. La seconde stratégie, médiocre seule, améliore le total de 12 % : une stratégie non corrélée de Sharpe positif a toujours de la valeur.
:::

:::attention Markowitz en pratique
$\Sigma^{-1}m$ amplifie les **erreurs d'estimation** : les rendements attendus sont très mal estimés (chapitre [[n:statistiques-et-regression]]), et l'inverse d'une matrice de covariance estimée exagère les directions de faible variance. Le portefeuille « optimal » prend alors des positions extrêmes. Remèdes : contraintes de poids, rétrécissement de la covariance (Ledoit-Wolf), modèles à facteurs, ou allocations robustes (variance minimale, parité de risque) qui n'utilisent pas $\mu$.
:::

:::propriete Levier et Sharpe ([[fiche:risque-sharpe-levier]])
Doubler le levier (en empruntant au taux sans risque) double l'excès de rendement et la volatilité : le **Sharpe ne change pas**. C'est pourquoi on compare des stratégies par leur Sharpe et non par leur rendement. Les limites : coût réel de l'emprunt, drawdowns, appels de marge et queues épaisses.
:::

## Bêta et couverture

:::definition Bêta ([[fiche:risque-beta]])
Le bêta d'un actif par rapport au marché est la pente de la régression de ses rendements sur ceux du marché (chapitre [[n:statistiques-et-regression]]) :
$$
\beta = \frac{\operatorname{Cov}(R_i, R_m)}{\operatorname{Var}(R_m)} = \rho_{im}\,\frac{\sigma_i}{\sigma_m}.
$$
Le rendement se décompose en $R_i = \alpha + \beta R_m + \varepsilon_i$, avec $\operatorname{Cov}(R_m, \varepsilon_i) = 0$, donc $\sigma_i^2 = \beta^2\sigma_m^2 + \sigma_\varepsilon^2$ : risque **systématique** plus risque **spécifique**. Le MEDAF (CAPM) affirme qu'à l'équilibre seul le risque systématique est rémunéré : $\mathbb{E}[R_i] - r = \beta\,(\mathbb{E}[R_m] - r)$.
:::

:::theoreme Couverture de variance minimale ([[fiche:risque-couverture-variance-min]])
Pour couvrir une position $S$ avec un instrument $F$, le ratio $h$ qui minimise $\operatorname{Var}(\Delta S - h\,\Delta F)$ est
$$
h^* = \frac{\operatorname{Cov}(\Delta S, \Delta F)}{\operatorname{Var}(\Delta F)} = \rho\,\frac{\sigma_S}{\sigma_F}, \qquad \text{et le risque résiduel vaut } \sigma_S\sqrt{1 - \rho^2}.
$$
:::

:::preuve
$\operatorname{Var}(\Delta S - h\Delta F) = \sigma_S^2 - 2h\rho\sigma_S\sigma_F + h^2\sigma_F^2$, trinôme minimal en $h^* = \rho\sigma_S/\sigma_F$ (c'est le bêta de $S$ sur $F$). Valeur au minimum : $\sigma_S^2 - 2\rho^2\sigma_S^2 + \rho^2\sigma_S^2 = \sigma_S^2(1 - \rho^2)$.

**Lecture** : même avec une corrélation de 0,9, la couverture laisse $\sqrt{1 - 0{,}81} \approx 44\,\%$ du risque initial. Il faut une corrélation de 0,995 pour réduire le risque à 10 %.
:::

:::exercice ex-rp-residuel
reponse: 0.25*sqrt(1-0.64)
tolerance: 0.0001
Une position de volatilité 25 % est couverte au ratio optimal par un indice de volatilité 20 %, corrélé à 0,8. Quel est le ratio et quelle volatilité reste-t-il ?
---
$h^* = 0{,}8 \times \frac{25}{20} = 1$, et le risque résiduel vaut $25\,\% \times \sqrt{1 - 0{,}64} = 15\,\%$ : la couverture n'a retiré que 40 % de la volatilité.
:::

## Mesurer le risque : VaR et Expected Shortfall

:::definition VaR et ES
Soit $L$ la perte d'un portefeuille sur un horizon donné.
- La **Value-at-Risk** au niveau $\alpha$ (99 % par exemple) est le quantile : $\text{VaR}_\alpha = \inf\{x : \mathbb{P}(L \le x) \ge \alpha\}$. Dans 99 % des cas, on ne perd pas plus que la VaR à 99 %.
- L'**Expected Shortfall** (ES, ou CVaR) est la moyenne des VaR au-delà du niveau : $\text{ES}_\alpha = \frac{1}{1 - \alpha}\int_\alpha^1\text{VaR}_u\,du$, égale à $\mathbb{E}[L \mid L \ge \text{VaR}_\alpha]$ pour une loi continue. C'est cette définition qui est sous-additive.
:::

:::propriete Le cas gaussien
Si $L \sim \mathcal{N}(0, \sigma^2)$ :
$$
\text{VaR}_\alpha = z_\alpha\,\sigma, \qquad \text{ES}_\alpha = \frac{\varphi(z_\alpha)}{1 - \alpha}\,\sigma,
$$
avec $z_{0{,}99} \approx 2{,}326$ et $z_{0{,}975} \approx 1{,}960$. Numériquement, $\text{ES}_{97{,}5\,\%} \approx 2{,}34\,\sigma \approx \text{VaR}_{99\,\%}$ : c'est pourquoi la réglementation bancaire (FRTB) a remplacé la VaR à 99 % par l'ES à 97,5 % ([[fiche:taux-es-gaussienne]]).
:::

:::preuve De la formule de l'ES
$\mathbb{E}[Z\mathbf{1}_{Z > z}] = \int_z^\infty x\,\varphi(x)\,dx = \big[-\varphi(x)\big]_z^\infty = \varphi(z)$, car $\varphi'(x) = -x\varphi(x)$. On divise par $\mathbb{P}(Z > z) = 1 - \alpha$ et on multiplie par $\sigma$.
:::

:::propriete Règle de la racine du temps ([[fiche:taux-var-10-jours]])
Si les pertes quotidiennes sont indépendantes, de même loi gaussienne centrée, la VaR à $h$ jours est $\sqrt h$ fois la VaR à 1 jour (la variance s'additionne). Elle est fausse en présence d'autocorrélation, de volatilité variable, ou si le portefeuille change pendant la période.
:::

:::exercice ex-rp-var
reponse: 10000*0.015*2.326348*sqrt(10)
tolerance: 0.5
Portefeuille de 10 M€, volatilité quotidienne 1,5 %, pertes gaussiennes centrées et indépendantes. VaR à 99 % sur 10 jours, en milliers d'euros ?
---
VaR à 1 jour : $10\,000 \times 0{,}015 \times 2{,}326 \approx 349$ k€. Sur 10 jours : $\times\sqrt{10} \approx 1\,103$ k€.
:::

:::exercice ex-rp-es
reponse: phi(2.3263479)/0.01
tolerance: 0.001
Expected Shortfall à 99 % d'une perte gaussienne centrée réduite ?
---
$\frac{\varphi(2{,}326)}{0{,}01} = \frac{0{,}02665}{0{,}01} \approx 2{,}665$ écarts-types, contre 2,326 pour la VaR : la moyenne de la queue est 15 % plus loin que son seuil. Pour une loi à queue épaisse, l'écart serait bien plus grand.
:::

:::theoreme La VaR n'est pas sous-additive
Il existe des portefeuilles $A$ et $B$ tels que $\text{VaR}(A + B) > \text{VaR}(A) + \text{VaR}(B)$ : la VaR peut **pénaliser la diversification**. L'ES, elle, est sous-additive (c'est une mesure de risque **cohérente**) ([[fiche:taux-var-es]]).
:::

:::preuve Contre-exemple
Deux prêts indépendants perdent chacun 100 avec probabilité 4 %, rien sinon. Pour chacun, $\mathbb{P}(L > 0) = 4\,\% < 5\,\%$, donc $\text{VaR}_{95\,\%} = 0$. Pour la somme, $\mathbb{P}(L_A + L_B \ge 100) = 1 - 0{,}96^2 = 7{,}84\,\% > 5\,\%$, donc $\text{VaR}_{95\,\%}(A + B) = 100 > 0 + 0$. Avec la définition intégrale, l'ES ne tombe pas dans ce piège : $\text{ES}_{95\,\%} = \frac{0{,}04 \times 100}{0{,}05} = 80$ pour chaque prêt et $\frac{100 \times (0{,}9984 - 0{,}95) + 200 \times 0{,}0016}{0{,}05} = 103{,}2 \le 160$ pour la somme.
:::

:::propriete VaR historique et backtest ([[fiche:risque-var-historique]], [[fiche:taux-exceptions-var]])
- **VaR historique** : appliquer au portefeuille actuel les variations observées sur les $N$ derniers jours et prendre le quantile empirique des pertes simulées. Avec 500 jours, la VaR à 99 % est entre la 5e et la 6e pire perte ([[fiche:risque-exceptions-historique]]). Avantage : pas d'hypothèse de loi ; limites : le passé récent ne contient peut-être pas de crise, et l'estimation des quantiles extrêmes repose sur très peu de points.
- **Backtest** : compter les **exceptions** (jours où la perte dépasse la VaR). Pour une VaR à 99 % bien calibrée, le nombre d'exceptions sur 250 jours suit une loi binomiale $\mathcal{B}(250, 0{,}01)$, d'espérance 2,5. Les « feux » de Bâle : vert jusqu'à 4 exceptions, orange de 5 à 9, rouge à partir de 10.
:::

:::exercice ex-rp-exceptions
reponse: 1-(0.99**250+250*0.01*0.99**249+comb(250,2)*0.01**2*0.99**248+comb(250,3)*0.01**3*0.99**247+comb(250,4)*0.01**4*0.99**246)
tolerance: 0.003
Une VaR à 99 % est parfaitement calibrée et les exceptions sont indépendantes. Quelle est la probabilité d'observer au moins 5 exceptions en 250 jours (et donc de sortir de la zone verte à tort) ?
---
$1 - \sum_{k=0}^4\binom{250}{k}0{,}01^k\,0{,}99^{250-k} \approx 10{,}8\,\%$. Un bon modèle sort de la zone verte une année sur dix : un test d'exceptions est peu puissant.
:::

:::propriete Liquidité ([[fiche:risque-liquidite]])
La VaR suppose qu'on peut liquider au prix de marché. Pour une position grosse par rapport au volume échangé, il faut ajouter le coût de sortie (demi-spread, impact de marché) et allonger l'horizon de liquidation, ce qui augmente la VaR.
:::

## Volatilité dynamique : EWMA et GARCH

:::definition EWMA et GARCH(1,1)
- **EWMA** (RiskMetrics) : $\sigma_t^2 = \lambda\sigma_{t-1}^2 + (1 - \lambda)r_{t-1}^2$. Le poids d'une observation vieille de $k$ jours est proportionnel à $\lambda^k$ ; **demi-vie** $\frac{\ln 0{,}5}{\ln\lambda}$ (11,2 jours pour $\lambda = 0{,}94$) ([[fiche:risque-ewma-demi-vie]]).
- **GARCH(1,1)** : $\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta\sigma_{t-1}^2$, avec $\omega > 0$, $\alpha, \beta \ge 0$ et $\alpha + \beta < 1$. Il ajoute un **retour à la moyenne** de la variance.
:::

:::theoreme Variance de long terme du GARCH ([[fiche:risque-garch-long-terme]])
$$
\bar\sigma^2 = \mathbb{E}[\sigma_t^2] = \frac{\omega}{1 - \alpha - \beta}, \qquad \mathbb{E}\big[\sigma_{t+k}^2 \mid \mathcal{F}_{t-1}\big] - \bar\sigma^2 = (\alpha + \beta)^k\big(\sigma_t^2 - \bar\sigma^2\big).
$$
:::

:::preuve
Avec $r_t = \sigma_t\varepsilon_t$ et $\varepsilon_t$ de variance 1 indépendant du passé, $\mathbb{E}[r_{t-1}^2 \mid \mathcal{F}_{t-2}] = \sigma_{t-1}^2$. En prenant l'espérance de la récurrence : $\mathbb{E}[\sigma_t^2] = \omega + (\alpha + \beta)\mathbb{E}[\sigma_{t-1}^2]$. En régime stationnaire, $\bar\sigma^2 = \omega + (\alpha + \beta)\bar\sigma^2$. En soustrayant $\bar\sigma^2$ des deux côtés, l'écart à la moyenne est multiplié par $\alpha + \beta$ à chaque pas : c'est un AR(1) en espérance (chapitre [[n:equations-differentielles-stochastiques]]), de demi-vie $\frac{\ln 0{,}5}{\ln(\alpha + \beta)}$. EWMA est le cas limite $\omega = 0$, $\alpha + \beta = 1$ : pas de retour à la moyenne.
:::

:::exercice ex-rp-garch
reponse: sqrt(1e-6/0.02*252)
tolerance: 0.004
GARCH(1,1) sur rendements quotidiens : $\omega = 10^{-6}$, $\alpha = 0{,}08$, $\beta = 0{,}90$. Quelle est la volatilité **annualisée** de long terme ?
---
$\bar\sigma^2 = \frac{10^{-6}}{0{,}02} = 5 \times 10^{-5}$, soit une vol quotidienne de $0{,}707\,\%$ et une vol annuelle de $0{,}707\,\% \times \sqrt{252} \approx 11{,}2\,\%$. La persistance $\alpha + \beta = 0{,}98$ donne une demi-vie des chocs de volatilité de $\ln 0{,}5/\ln 0{,}98 \approx 34$ jours.
:::

## Drawdowns

:::theoreme Probabilité de descendre d'un montant $d$
Si la valeur d'une stratégie suit un brownien avec dérive, $dX_t = \mu\,dt + \sigma\,dW_t$ avec $\mu > 0$, la probabilité qu'elle passe **un jour** $d$ en dessous de son niveau actuel est
$$
\mathbb{P}\Big(\inf_{t \ge 0}(X_t - X_0) \le -d\Big) = e^{-2\mu d/\sigma^2}.
$$
:::

:::preuve Par une martingale exponentielle (chapitre [[n:conditionnement-markov-martingales]] et [[n:integrale-et-lemme-ito]])
On cherche $\theta$ tel que $M_t = e^{\theta X_t}$ soit une martingale. Par Itô, $dM = M\big(\theta\mu + \frac12\theta^2\sigma^2\big)dt + M\theta\sigma\,dW$ : la dérive est nulle pour $\theta = -2\mu/\sigma^2$. Partons de $X_0 = 0$, arrêtons-nous au premier passage en $-d$ ou en $+a$. Par arrêt optionnel, avec $p$ la probabilité d'atteindre $-d$ d'abord :
$$
1 = p\,e^{2\mu d/\sigma^2} + (1 - p)\,e^{-2\mu a/\sigma^2}.
$$
Quand $a \to \infty$, le second terme tend vers 0, donc $p = e^{-2\mu d/\sigma^2}$. C'est la version continue de la ruine du joueur avec biais.
:::

:::exemple Sharpe 1, volatilité 10 % ([[fiche:risque-drawdown-attendu]])
$\mu = \sigma = 10\,\%$ par an. La probabilité de perdre un jour 15 % depuis le niveau actuel vaut $e^{-2 \times 0{,}1 \times 0{,}15/0{,}01} = e^{-3} \approx 5\,\%$. Mais un **drawdown** se mesure depuis le **plus haut historique**, qui se renouvelle sans cesse : sur plusieurs années, il y a beaucoup de « points de départ », et des drawdowns de 1,5 volatilité annuelle ne sont pas rares. Avant de conclure qu'une stratégie ne marche plus, on compare le drawdown observé à sa distribution simulée avec le Sharpe supposé.
:::

:::exercice ex-rp-drawdown
reponse: exp(-3)
tolerance: 0.003
Une stratégie suit un brownien de dérive 10 % et de volatilité 10 % par an. Quelle est la probabilité qu'elle passe un jour 15 % sous son niveau actuel ?
---
$e^{-2\mu d/\sigma^2} = e^{-2 \times 0{,}1 \times 0{,}15/0{,}01} = e^{-3} \approx 0{,}050$.
:::

## Combien miser : le critère de Kelly

:::theoreme Kelly pour un pari
Un pari gagne $b$ euros par euro misé avec probabilité $p$ et perd la mise sinon ($q = 1 - p$). En misant la fraction $f$ de sa richesse à chaque fois, la richesse croît à long terme au taux $g(f) = p\ln(1 + bf) + q\ln(1 - f)$ par pari, maximal pour
$$
f^* = \frac{bp - q}{b} = \frac{\text{espérance de gain par euro}}{\text{cote}}.
$$
:::

:::preuve
Après $n$ paris dont $k$ gagnés, $W_n = W_0(1 + bf)^k(1 - f)^{n-k}$, donc $\frac1n\ln\frac{W_n}{W_0} = \frac kn\ln(1 + bf) + \frac{n - k}{n}\ln(1 - f) \to g(f)$ par la loi des grands nombres. Maximiser la croissance, c'est maximiser $g$ : $g'(f) = \frac{pb}{1 + bf} - \frac{q}{1 - f} = 0 \iff pb(1 - f) = q(1 + bf) \iff f = \frac{pb - q}{b}$. $g$ est concave, c'est bien un maximum ([[fiche:mm-kelly]], [[fiche:mm-kelly-cote]]).
:::

:::theoreme Kelly en temps continu
Un actif risqué d'excès de rendement $\mu - r$ et de volatilité $\sigma$ : la fraction de Kelly est $f^* = \dfrac{\mu - r}{\sigma^2}$, et le taux de croissance obtenu est $r + \frac12\text{SR}^2$.
:::

:::preuve
La richesse vérifie $\frac{dW}{W} = \big(r + f(\mu - r)\big)dt + f\sigma\,dW_t$. Par Itô sur $\ln W$ (chapitre [[n:equations-differentielles-stochastiques]]) : $d\ln W = \big(r + f(\mu - r) - \frac12f^2\sigma^2\big)dt + f\sigma\,dW_t$. Le taux de croissance $g(f) = r + f(\mu - r) - \frac12f^2\sigma^2$ est maximal en $f^* = (\mu - r)/\sigma^2$, où il vaut $r + \frac{(\mu - r)^2}{2\sigma^2} = r + \frac12\text{SR}^2$.
:::

:::intuition Pourquoi on mise « demi-Kelly »
- $g$ est **plate** autour de $f^*$ : avec $f^*/2$, on garde 75 % de la croissance ($g(f^*/2) - r = \frac34 \cdot \frac12\text{SR}^2$) pour **la moitié** de la volatilité.
- Au-delà de $2f^*$, la croissance devient **inférieure au taux sans risque** ($g(f) - r < 0$, négative pour un pari sans taux) alors que l'espérance de gain reste positive : le sur-levier ruine.
- Surtout, $f^*$ dépend de $\mu$, très mal estimé : sur la croissance, l'erreur est presque symétrique (en temps continu, $g(f^* + \Delta) = g(f^* - \Delta)$ exactement), mais sur-miser donne la même croissance avec plus de volatilité et de drawdowns : dans le doute, mieux vaut se tromper vers le bas. Le widget montre la courbe $g(f)$.
:::

:::widget kelly
:::

:::exercice ex-rp-kelly
reponse: 2
tolerance: 0.03
Un actif a un excès de rendement de 8 % par an et une volatilité de 20 %. Quelle fraction de Kelly (levier) faut-il lui allouer ?
---
$f^* = \frac{0{,}08}{0{,}04} = 2$ : un levier de 2. Croissance excédentaire $\frac12\text{SR}^2 = \frac12 \times 0{,}4^2 = 8\,\%$ par an, contre 6 % avec un levier de 1 ($0{,}08 - \frac12 \times 0{,}04$) et 6 % aussi avec un levier de 3 ($0{,}24 - \frac12 \times 9 \times 0{,}04$).
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Additionner des volatilités au lieu des variances (ou oublier le terme de covariance).
- Croire que la diversification élimine tout le risque : il reste $\rho\sigma^2$.
- Présenter un portefeuille de Markowitz non contraint comme optimal sans parler de l'erreur d'estimation.
- Confondre VaR (un seuil) et ES (une moyenne au-delà du seuil) ; affirmer que la VaR est sous-additive.
- Appliquer la racine du temps à des rendements autocorrélés ou à volatilité changeante.
- Miser plein Kelly avec des paramètres estimés.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Volatilité d'un portefeuille 50/50 de deux actifs à 20 % et 30 %, corrélés à 0,5 ? »** Calcul mental en vingt secondes.
- **« Portefeuille de variance minimale ? Portefeuille tangent ? »** Lagrangien, $\Sigma^{-1}\mathbf{1}$ et $\Sigma^{-1}m$ ; limites en pratique.
- **« Deux stratégies indépendantes de Sharpe 1 : quel Sharpe combiné ? »** $\sqrt2$.
- **« Qu'est-ce que la VaR ? Ses défauts ? Pourquoi l'ES ? »** Quantile, non sous-additive (contre-exemple), aveugle à la queue ; l'ES est cohérente.
- **« Combien d'exceptions pour une VaR à 99 % sur un an ? »** 2,5 en moyenne ; feux de Bâle.
- **« GARCH : variance de long terme ? »** $\omega/(1 - \alpha - \beta)$ et la preuve en une ligne.
- **« Une pièce donne pile à 60 %, cote 1 contre 1 : combien miser ? »** Kelly 20 %, et pourquoi en pratique on mise moins.
:::
