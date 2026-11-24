---
titre: Statistiques, régression et backtests
partie: Algèbre linéaire et statistiques
resume: Les estimateurs (biais, variance, n − 1), le maximum de vraisemblance, les tests et la p-valeur, la statistique du ratio de Sharpe et le piège des tests multiples, puis la régression linéaire en écriture matricielle avec toutes ses preuves (estimateur, biais, variance, variable omise, erreur de mesure, colinéarité, Ridge et Lasso), les séries non stationnaires et la cointégration, et les biais de backtest.
duree: 4 h
fiches: stats-variance-n-moins-un stats-intervalle-moyenne stats-taille-echantillon stats-mle-exponentielle stats-p-valeur stats-erreurs stats-sharpe-annualise stats-sharpe-erreur stats-tests-multiples stats-bonferroni stats-sharpe-deflate stats-ols-hypotheses stats-pentes-croisees stats-r2 stats-donnees-doublees stats-erreur-variable stats-colinearite stats-heteroscedasticite ml-ridge-1d ml-l1-l2 stats-stationnarite stats-regression-fallacieuse stats-adf proj-sa-coint-corr proj-sa-engle-granger proj-sa-faux-positifs stats-bootstrap stats-biais-backtest stats-lasso-seuillage stats-variance-mco
---
Les fonds quantitatifs (QRT, CFM, Squarepoint, et les équipes de recherche des banques) testent autant les statistiques que les probabilités : « hypothèses des moindres carrés », « Ridge ou Lasso », « ton Sharpe est-il significatif ? », « combien de faux positifs dans ton backtest ? ». Ces questions viennent toutes de quelques calculs de variance et de covariance (chapitre [[n:esperance-variance-covariance]]), faits ici en détail. Le fil rouge est ton projet de stat arb : chaque notion y a servi.

## Estimateurs

:::definition Estimateur, biais, erreur quadratique
Un estimateur $\hat\theta$ d'un paramètre $\theta$ est une fonction des données. Son **biais** est $\mathbb{E}[\hat\theta] - \theta$, sa **variance** mesure sa dispersion d'un échantillon à l'autre, et son **erreur quadratique moyenne** est $\text{EQM} = \mathbb{E}[(\hat\theta - \theta)^2]$.
:::

:::theoreme Décomposition biais-variance
$$
\mathbb{E}\big[(\hat\theta - \theta)^2\big] = \big(\mathbb{E}[\hat\theta] - \theta\big)^2 + \operatorname{Var}(\hat\theta).
$$
:::

:::preuve
Posons $m = \mathbb{E}[\hat\theta]$ et écrivons $\hat\theta - \theta = (\hat\theta - m) + (m - \theta)$. En développant le carré, le terme croisé $2(m - \theta)\,\mathbb{E}[\hat\theta - m]$ est nul car $\mathbb{E}[\hat\theta - m] = 0$. Il reste $\mathbb{E}[(\hat\theta - m)^2] + (m - \theta)^2$.
:::

C'est la raison d'être de la régularisation (Ridge, plus bas) : accepter un peu de biais pour beaucoup moins de variance.

:::propriete La moyenne empirique
Pour $X_1, \dots, X_n$ indépendantes de moyenne $\mu$ et de variance $\sigma^2$, $\bar X = \frac1n\sum X_i$ vérifie $\mathbb{E}[\bar X] = \mu$ et $\operatorname{Var}(\bar X) = \dfrac{\sigma^2}{n}$ (chapitre [[n:esperance-variance-covariance]]). Par le TCL, un intervalle de confiance à 95 % pour $\mu$ est $\bar X \pm 1{,}96\,\dfrac{\sigma}{\sqrt n}$ ([[fiche:stats-intervalle-moyenne]]). **Pour diviser la largeur par deux, il faut quatre fois plus de données** ([[fiche:stats-taille-echantillon]]).
:::

:::theoreme Pourquoi diviser par $n - 1$
$$
\mathbb{E}\left[\sum_{i=1}^n (X_i - \bar X)^2\right] = (n - 1)\,\sigma^2,
$$
donc $s^2 = \frac{1}{n - 1}\sum (X_i - \bar X)^2$ est sans biais, et la version en $\frac1n$ sous-estime $\sigma^2$ d'un facteur $\frac{n-1}{n}$ ([[fiche:stats-variance-n-moins-un]]).
:::

:::preuve
On développe : $\sum (X_i - \bar X)^2 = \sum X_i^2 - 2\bar X\sum X_i + n\bar X^2 = \sum X_i^2 - n\bar X^2$ (car $\sum X_i = n\bar X$). En espérance, avec $\mathbb{E}[Y^2] = \operatorname{Var}(Y) + \mathbb{E}[Y]^2$ :
$$
\sum\mathbb{E}[X_i^2] - n\,\mathbb{E}[\bar X^2] = n(\sigma^2 + \mu^2) - n\left(\frac{\sigma^2}{n} + \mu^2\right) = (n - 1)\sigma^2.
$$
**Intuition** : les écarts sont mesurés par rapport à $\bar X$, qui est justement le point qui minimise $\sum(X_i - c)^2$ ; ils sont donc systématiquement plus petits que les écarts à la vraie moyenne. On a « consommé un degré de liberté » en estimant $\mu$.
:::

:::exercice ex-stats-n-moins-un
reponse: 3.2
Cinq observations indépendantes de variance $\sigma^2 = 4$. Que vaut l'espérance de la variance empirique calculée en divisant par $n$, $\frac1n\sum(X_i - \bar X)^2$ ?
---
$\frac{n-1}{n}\sigma^2 = \frac45 \times 4 = 3{,}2$. Le biais ($-0{,}8$) est de 20 % : il n'est négligeable que pour de grands échantillons.
:::

## Le maximum de vraisemblance

:::definition Estimateur du maximum de vraisemblance (EMV)
Si les données ont une densité $f(x; \theta)$ et sont indépendantes, la **vraisemblance** est $L(\theta) = \prod_i f(x_i; \theta)$. L'EMV est le $\theta$ qui la maximise. En pratique on maximise la **log-vraisemblance** $\ell(\theta) = \sum_i\ln f(x_i; \theta)$ (une somme se dérive mieux qu'un produit).
:::

:::exemple Loi exponentielle ([[fiche:stats-mle-exponentielle]])
$f(x; \lambda) = \lambda e^{-\lambda x}$ pour $x \ge 0$. Alors $\ell(\lambda) = n\ln\lambda - \lambda\sum x_i$, et
$$
\ell'(\lambda) = \frac n\lambda - \sum x_i = 0 \iff \hat\lambda = \frac{n}{\sum x_i} = \frac{1}{\bar x}.
$$
C'est bien un maximum : $\ell''(\lambda) = -n/\lambda^2 < 0$. Intuition : la moyenne d'une exponentielle est $1/\lambda$.
:::

:::exemple Loi normale
$\ell(\mu, \sigma^2) = -\frac n2\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum(x_i - \mu)^2$. La dérivée en $\mu$ donne $\hat\mu = \bar x$ ; la dérivée en $\sigma^2$ donne $-\frac{n}{2\sigma^2} + \frac{1}{2\sigma^4}\sum(x_i - \mu)^2 = 0$, soit $\hat\sigma^2 = \frac1n\sum(x_i - \bar x)^2$ : l'EMV de la variance est **biaisé** (division par $n$). Il est cependant **convergent**, comme tous les EMV dans les cas réguliers.
:::

:::propriete Propriétés asymptotiques (admises)
Sous des conditions de régularité, l'EMV est convergent, asymptotiquement gaussien et asymptotiquement de variance minimale : $\hat\theta \approx \mathcal{N}\big(\theta, \frac{1}{nI(\theta)}\big)$, où $I(\theta) = -\mathbb{E}\big[\partial^2_\theta\ln f(X; \theta)\big]$ est l'**information de Fisher**. Exemple : pour une Bernoulli, $I(p) = \frac{1}{p(1-p)}$, d'où $\operatorname{Var}(\hat p) \approx \frac{p(1-p)}{n}$.
:::

:::exercice ex-stats-mle
reponse: 0.25
Durées observées entre deux transactions (en secondes) : 1, 2, 3, 4 et 10. En les supposant exponentielles, quel est l'EMV de l'intensité $\lambda$ ?
---
$\hat\lambda = \frac{5}{1 + 2 + 3 + 4 + 10} = \frac{5}{20} = 0{,}25$ transaction par seconde.
:::

## Tests et p-valeurs

:::definition Test d'hypothèse
On confronte une **hypothèse nulle** $H_0$ (par exemple « la stratégie a un rendement moyen nul ») à une alternative $H_1$. On choisit une statistique de test et une région de rejet telle que, sous $H_0$, la probabilité de rejeter soit $\alpha$ (le **niveau**, souvent 5 %).
- **Erreur de première espèce** : rejeter $H_0$ alors qu'elle est vraie (probabilité $\alpha$) : croire qu'un signal marche alors qu'il ne marche pas.
- **Erreur de seconde espèce** : ne pas rejeter $H_0$ alors qu'elle est fausse (probabilité $\beta$) : rater un vrai signal.
- **Puissance** : $1 - \beta$ ([[fiche:stats-erreurs]]).
:::

:::definition p-valeur ([[fiche:stats-p-valeur]])
La p-valeur est la probabilité, **sous $H_0$**, d'observer une statistique au moins aussi extrême que celle observée. On rejette $H_0$ au niveau $\alpha$ si $p < \alpha$.

Ce qu'elle **n'est pas** : la probabilité que $H_0$ soit vraie, ni la probabilité que le résultat soit dû au hasard, ni une mesure de la taille de l'effet. Avec assez de données, un effet minuscule devient « significatif ».
:::

:::propriete Le test de Student sur une moyenne
Pour tester $\mu = 0$ : $t = \dfrac{\bar x}{s/\sqrt n}$. Sous $H_0$ et pour $n$ grand, $t \approx \mathcal{N}(0, 1)$ ; on rejette au niveau 5 % (bilatéral) si $|t| > 1{,}96$. Sous $H_0$, la p-valeur est **uniforme** sur $[0, 1]$ : c'est ce qui rend les tests multiples dangereux.
:::

## Le ratio de Sharpe est une statistique

:::definition Ratio de Sharpe
$\text{SR} = \dfrac{\mu}{\sigma}$, rendement moyen en excès du taux sans risque divisé par sa volatilité, sur la même période. **Annualisation** (rendements indépendants) : la moyenne est multipliée par 252, l'écart-type par $\sqrt{252}$, donc $\text{SR}_{\text{an}} = \sqrt{252}\,\text{SR}_{\text{jour}}$ ([[fiche:stats-sharpe-annualise]]).
:::

:::theoreme Erreur d'estimation du Sharpe (Lo, 2002)
Avec $N$ rendements gaussiens indépendants, l'estimateur $\widehat{\text{SR}} = \hat\mu/\hat\sigma$ vérifie, pour $N$ grand,
$$
\operatorname{Var}\big(\widehat{\text{SR}}\big) \approx \frac{1 + \frac12\text{SR}^2}{N},
$$
le Sharpe et $N$ étant exprimés dans la **même unité de période**. Sur $Y$ années de données quotidiennes, l'écart-type du Sharpe annualisé vaut donc environ $\sqrt{1/Y}$ ([[fiche:stats-sharpe-erreur]]).
:::

:::preuve Par la méthode delta
Pour des gaussiennes, $\hat\mu$ et $\hat\sigma$ sont indépendants, avec $\operatorname{Var}(\hat\mu) = \frac{\sigma^2}{N}$ et $\operatorname{Var}(\hat\sigma) \approx \frac{\sigma^2}{2N}$ (admis). On linéarise $g(\mu, \sigma) = \mu/\sigma$ : $\partial_\mu g = \frac1\sigma$, $\partial_\sigma g = -\frac{\mu}{\sigma^2}$. Donc
$$
\operatorname{Var}\big(\widehat{\text{SR}}\big) \approx \frac{1}{\sigma^2}\cdot\frac{\sigma^2}{N} + \frac{\mu^2}{\sigma^4}\cdot\frac{\sigma^2}{2N} = \frac{1 + \frac12\text{SR}^2}{N}.
$$
En annuel : $\text{SR}_{\text{jour}}$ est petit ($\approx 0{,}06$ pour un Sharpe annuel de 1), donc $\operatorname{Var}(\widehat{\text{SR}}_{\text{jour}}) \approx 1/N$, puis on multiplie l'écart-type par $\sqrt{252}$ : $\sqrt{252/N} = \sqrt{1/Y}$.
:::

:::intuition Conséquence brutale
Un Sharpe annuel de 1 mesuré sur 4 ans a un écart-type de $0{,}5$ : la t-stat vaut 2, à peine significative. Pour qu'un Sharpe de 0,5 soit significatif à 5 %, il faut environ $Y$ tel que $0{,}5\sqrt Y = 2$, soit **16 ans** de données. La plupart des backtests sont statistiquement bien moins solides qu'ils n'en ont l'air.
:::

:::exercice ex-stats-sharpe-se
reponse: sqrt((1+1.5**2/252/2)/2)
tolerance: 0.02
Une stratégie affiche un Sharpe annualisé de 1,5 sur 2 ans de rendements quotidiens (gaussiens, indépendants). Quel est l'écart-type de cet estimateur (en unités de Sharpe annuel) ?
---
Avec $N = 504$ jours et $\text{SR}_{\text{jour}} = 1{,}5/\sqrt{252} \approx 0{,}094$ : $\sqrt{252} \times \sqrt{\frac{1 + 0{,}094^2/2}{504}} \approx \sqrt{\frac{1{,}0045}{2}} \approx 0{,}71$. La t-stat vaut $1{,}5/0{,}71 \approx 2{,}1$.
:::

## Tests multiples et Sharpe déflaté

:::propriete Le problème
Si l'on teste $m$ signaux **sans aucun pouvoir prédictif**, chacun au niveau $\alpha$, et indépendamment :
- le nombre attendu de faux positifs est $m\alpha$ ;
- la probabilité d'au moins un faux positif est $1 - (1 - \alpha)^m$ ([[fiche:stats-tests-multiples]]).
Avec $m = 100$ et $\alpha = 5\,\%$ : 5 faux positifs attendus et $1 - 0{,}95^{100} \approx 99{,}4\,\%$ de chances d'en avoir au moins un. Dans ton projet de stat arb, tester 1 540 paires au seuil de 5 % produit environ **77** paires « cointégrées » par pur hasard ([[fiche:proj-sa-faux-positifs]]).
:::

:::preuve
Chaque test est une Bernoulli de paramètre $\alpha$ sous $H_0$ : l'espérance du total est $m\alpha$ par linéarité (même sans indépendance). La probabilité de n'avoir **aucun** faux positif est $(1 - \alpha)^m$ par indépendance ; on passe au complémentaire.
:::

:::theoreme Correction de Bonferroni
Si chaque test est fait au niveau $\alpha/m$, la probabilité d'au moins un faux positif est au plus $\alpha$, **quelle que soit la dépendance** entre les tests ([[fiche:stats-bonferroni]]).
:::

:::preuve
Borne de l'union : $\mathbb{P}\big(\bigcup_i A_i\big) \le \sum_i\mathbb{P}(A_i) = m \times \frac\alpha m = \alpha$.
:::

Bonferroni est très conservateur (il perd de la puissance). L'alternative standard, **Benjamini-Hochberg**, contrôle au niveau $\alpha$ l'**espérance** de la proportion de fausses découvertes parmi les découvertes (FDR), pour des tests indépendants ou positivement dépendants : on trie les p-valeurs $p_{(1)} \le \dots \le p_{(m)}$ et on rejette les $k$ premières, où $k$ est le plus grand indice tel que $p_{(k)} \le \frac{k}{m}\alpha$.

:::propriete Le meilleur de $m$ essais
Le maximum de $m$ gaussiennes standard indépendantes vaut en moyenne de l'ordre de $\sqrt{2\ln m}$ (équivalent asymptotique, qui surestime nettement pour $m$ modéré ; valeurs exactes : 1,54 pour $m = 10$, 2,51 pour $m = 100$, 3,24 pour $m = 1\,000$). Donc si l'on essaie $m$ variantes d'une stratégie sans valeur et qu'on garde la meilleure, son Sharpe estimé vaudra environ $\text{SE} \times \mathbb{E}[\max]$. Le **Sharpe déflaté** (Bailey et López de Prado) compare le Sharpe observé à ce seuil plutôt qu'à zéro ([[fiche:stats-sharpe-deflate]]).
:::

:::exercice ex-stats-tests-multiples
reponse: 1-0.95**20
tolerance: 0.005
Tu testes 20 signaux indépendants sans aucun pouvoir prédictif, chacun au seuil de 5 %. Quelle est la probabilité qu'au moins un soit « significatif » ?
---
$1 - 0{,}95^{20} \approx 0{,}64$. Près de deux chances sur trois de « découvrir » un signal inexistant.
:::

:::exercice ex-stats-max-sharpe
reponse: 1.2538
tolerance: 0.003
Tu backtestes 100 variantes indépendantes d'une stratégie sans valeur sur 4 ans de données quotidiennes, et tu gardes la meilleure. Quel Sharpe annuel moyen affiche-t-elle ? (On donne $\mathbb{E}[\max]$ de 100 gaussiennes standard $\approx 2{,}5076$.)
---
Chaque Sharpe estimé est $\approx \mathcal{N}(0, 0{,}5^2)$ (écart-type $\sqrt{1/4}$). Le maximum vaut en moyenne $0{,}5 \times 2{,}5076 \approx 1{,}25$. Un Sharpe de 1,25 en backtest ne prouve rien si l'on a essayé 100 variantes.
:::

## La régression linéaire

:::definition Modèle et estimateur des moindres carrés (MCO)
On observe $n$ individus, une variable expliquée $y \in \mathbb{R}^n$ et $p$ variables explicatives rangées dans une matrice $X \in \mathbb{R}^{n \times p}$ (avec une colonne de 1 pour la constante). Le modèle est $y = X\beta + \varepsilon$. L'estimateur MCO minimise la somme des carrés des résidus $\|y - X\beta\|^2$.
:::

:::theoreme Formule de l'estimateur
Si $X^\top X$ est inversible (pas de colinéarité parfaite),
$$
\hat\beta = (X^\top X)^{-1}X^\top y.
$$
:::

:::preuve
**Par le gradient** : $\|y - X\beta\|^2 = y^\top y - 2\beta^\top X^\top y + \beta^\top X^\top X\beta$. Le gradient en $\beta$ vaut $-2X^\top y + 2X^\top X\beta$ (on utilise $\nabla_\beta(\beta^\top A\beta) = 2A\beta$ pour $A$ symétrique). Il s'annule pour $X^\top X\hat\beta = X^\top y$ (les **équations normales**). C'est un minimum car la hessienne $2X^\top X$ est positive.

**Géométriquement** : $X\hat\beta$ est la projection orthogonale de $y$ sur l'espace engendré par les colonnes de $X$. Les équations normales disent que le résidu $y - X\hat\beta$ est orthogonal à chaque colonne : $X^\top(y - X\hat\beta) = 0$.
:::

:::propriete Le cas d'une seule variable (avec constante)
$$
\hat b = \frac{\widehat{\operatorname{Cov}}(x, y)}{\widehat{\operatorname{Var}}(x)} = \hat\rho_{xy}\,\frac{\hat\sigma_y}{\hat\sigma_x}, \qquad \hat a = \bar y - \hat b\,\bar x, \qquad R^2 = \hat\rho_{xy}^2.
$$
Conséquences : la droite passe par le point moyen ; la pente de $x$ sur $y$ n'est **pas** l'inverse de celle de $y$ sur $x$, leur produit vaut $\rho^2$ ([[fiche:stats-pentes-croisees]]) ; et le bêta d'une action est la pente de ses rendements sur ceux du marché.
:::

:::preuve
Avec une constante, la première équation normale donne $\sum(y_i - a - bx_i) = 0$, soit $a = \bar y - b\bar x$. En remplaçant dans la seconde, $\sum x_i(y_i - \bar y - b(x_i - \bar x)) = 0$ ; comme $\sum\bar x(y_i - \bar y - b(x_i - \bar x)) = 0$, on peut remplacer $x_i$ par $x_i - \bar x$ : $\sum(x_i - \bar x)(y_i - \bar y) = b\sum(x_i - \bar x)^2$.

Pour le $R^2 = 1 - \frac{\text{SCR}}{\text{SCT}}$ : la variance expliquée est $\operatorname{Var}(\hat bx) = \hat b^2\sigma_x^2 = \rho^2\sigma_y^2$, donc $R^2 = \rho^2$.
:::

:::exercice ex-stats-ols
reponse: 1.4
Données : $x = (0, 1, 2, 3)$ et $y = (1, 3, 2, 6)$. Pente de la régression de $y$ sur $x$ (avec constante) ?
---
$\bar x = 1{,}5$, $\bar y = 3$. $\sum(x_i - \bar x)(y_i - \bar y) = (-1{,}5)(-2) + (-0{,}5)(0) + (0{,}5)(-1) + (1{,}5)(3) = 7$ et $\sum(x_i - \bar x)^2 = 5$. Pente $7/5 = 1{,}4$, constante $3 - 1{,}4 \times 1{,}5 = 0{,}9$.
:::

:::exercice ex-stats-r2
reponse: 0.25
$\operatorname{Var}(x) = 4$, $\operatorname{Var}(y) = 9$, $\operatorname{Cov}(x, y) = 3$. Quel $R^2$ donne la régression de $y$ sur $x$ (en population) ?
---
$\rho = \frac{3}{2 \times 3} = 0{,}5$ et $R^2 = \rho^2 = 0{,}25$. Les pentes valent $3/4$ ($y$ sur $x$) et $3/9 = 1/3$ ($x$ sur $y$) ; leur produit vaut bien $0{,}25$.
:::

### Biais et variance de l'estimateur

:::theoreme Propriétés sous les hypothèses classiques
Si $\mathbb{E}[\varepsilon \mid X] = 0$ (exogénéité), alors $\mathbb{E}[\hat\beta \mid X] = \beta$ : **sans biais**. Si de plus $\operatorname{Var}(\varepsilon \mid X) = \sigma^2I_n$ (homoscédasticité et absence d'autocorrélation), alors
$$
\operatorname{Var}(\hat\beta \mid X) = \sigma^2(X^\top X)^{-1}.
$$
:::

:::preuve
On remplace $y$ : $\hat\beta = (X^\top X)^{-1}X^\top(X\beta + \varepsilon) = \beta + (X^\top X)^{-1}X^\top\varepsilon$.

**Biais** : $\mathbb{E}[\hat\beta \mid X] = \beta + (X^\top X)^{-1}X^\top\mathbb{E}[\varepsilon \mid X] = \beta$.

**Variance** : pour une matrice fixe $A$, $\operatorname{Var}(A\varepsilon) = A\operatorname{Var}(\varepsilon)A^\top$ (chapitre [[n:esperance-variance-covariance]], matrice de covariance d'une transformation linéaire). Avec $A = (X^\top X)^{-1}X^\top$ :
$$
\operatorname{Var}(\hat\beta \mid X) = (X^\top X)^{-1}X^\top\,\sigma^2I_n\,X(X^\top X)^{-1} = \sigma^2(X^\top X)^{-1}X^\top X(X^\top X)^{-1} = \sigma^2(X^\top X)^{-1}.
$$
:::

:::propriete Ce qu'on en tire
- **Une variable** : $\operatorname{Var}(\hat b) = \dfrac{\sigma^2}{\sum(x_i - \bar x)^2} \approx \dfrac{\sigma^2}{n\,\sigma_x^2}$. L'erreur standard baisse en $1/\sqrt n$ et quand $x$ varie beaucoup.
- **Données dupliquées** : les coefficients ne changent pas, mais le logiciel croit avoir $2n$ observations : les erreurs standard sont divisées par $\sqrt2$ et les t-stats multipliées par $\sqrt 2$, à tort ([[fiche:stats-donnees-doublees]]).
- **Théorème de Gauss-Markov** (admis) : sous ces hypothèses, MCO est le meilleur estimateur linéaire sans biais.
:::

:::propriete Colinéarité ([[fiche:stats-colinearite]])
Avec deux variables standardisées de corrélation $r$, $X^\top X \approx n\begin{pmatrix}1 & r\\ r & 1\end{pmatrix}$, dont l'inverse est $\frac{1}{n(1 - r^2)}\begin{pmatrix}1 & -r\\ -r & 1\end{pmatrix}$. La variance de chaque coefficient est multipliée par le **facteur d'inflation** $\text{VIF} = \frac{1}{1 - r^2}$ (5,3 pour $r = 0{,}9$ ; 25 pour $r = 0{,}98$), et les deux estimations ont une corrélation $-r$ : fortement **négative** quand les variables sont positivement corrélées. Le modèle prédit bien, mais on ne sait plus attribuer l'effet à l'une ou l'autre variable. Remèdes : retirer ou combiner les variables, ACP, Ridge.
:::

:::exercice ex-stats-vif
reponse: 1/(1-0.81)
tolerance: 0.001
Deux variables explicatives standardisées ont une corrélation de 0,9. Par combien la variance de chaque coefficient est-elle multipliée par rapport au cas de variables non corrélées ?
---
$\text{VIF} = \frac{1}{1 - 0{,}81} \approx 5{,}26$ : les erreurs standard sont multipliées par $\sqrt{5{,}26} \approx 2{,}3$.
:::

### Quand les hypothèses tombent

:::theoreme Biais de variable omise
Vrai modèle : $y = \beta_1x_1 + \beta_2x_2 + \varepsilon$. Si l'on régresse $y$ sur $x_1$ seul, la pente converge vers
$$
\beta_1 + \beta_2\,\frac{\operatorname{Cov}(x_1, x_2)}{\operatorname{Var}(x_1)}.
$$
:::

:::preuve
La pente estimée converge vers $\frac{\operatorname{Cov}(x_1, y)}{\operatorname{Var}(x_1)}$. Par bilinéarité, $\operatorname{Cov}(x_1, y) = \beta_1\operatorname{Var}(x_1) + \beta_2\operatorname{Cov}(x_1, x_2) + \operatorname{Cov}(x_1, \varepsilon)$, et le dernier terme est nul. On divise.
:::

:::exercice ex-stats-variable-omise
reponse: 1.5
$y = x_1 + x_2 + \varepsilon$ avec $\operatorname{Var}(x_1) = \operatorname{Var}(x_2) = 1$ et $\operatorname{Corr}(x_1, x_2) = 0{,}5$. Vers quoi tend la pente de la régression de $y$ sur $x_1$ seul ?
---
$1 + 1 \times \frac{0{,}5}{1} = 1{,}5$. La variable omise « passe » dans le coefficient de celle qui lui est corrélée. Exemple en finance : un signal qui n'est qu'une exposition déguisée au marché ou à un facteur connu.
:::

:::theoreme Erreur sur la variable explicative (atténuation)
Vrai modèle $y = \beta x + \varepsilon$, mais on observe $\tilde x = x + u$ avec $u$ indépendant de $x$ et de $\varepsilon$. La pente de $y$ sur $\tilde x$ converge vers
$$
\beta\,\frac{\operatorname{Var}(x)}{\operatorname{Var}(x) + \operatorname{Var}(u)}.
$$
:::

:::preuve
$\operatorname{Cov}(\tilde x, y) = \operatorname{Cov}(x + u, \beta x + \varepsilon) = \beta\operatorname{Var}(x)$ (tous les autres termes sont nuls par indépendance) et $\operatorname{Var}(\tilde x) = \operatorname{Var}(x) + \operatorname{Var}(u)$. La pente est **atténuée** vers 0 ([[fiche:stats-erreur-variable]]). C'est pourquoi un bêta estimé contre un indice mesuré avec bruit (ou avec des cours non synchrones) est biaisé vers 0 ; un bruit sur $y$, lui, n'atténue pas la pente. À ne pas confondre avec l'ajustement de Blume ou de Vasicek, qui rétrécit les bêtas estimés vers 1 (la moyenne transversale) pour réduire leur erreur d'échantillonnage : il corrige une variance, pas une atténuation.
:::

:::exercice ex-stats-attenuation
reponse: 2.4
Vrai modèle $y = 3x + \varepsilon$, $\operatorname{Var}(x) = 2$. On observe $x$ avec un bruit indépendant de variance $0{,}5$. Vers quoi tend la pente estimée ?
---
$3 \times \frac{2}{2{,}5} = 2{,}4$.
:::

:::widget regression
:::

:::propriete Les hypothèses et leurs violations ([[fiche:stats-ols-hypotheses]], [[fiche:stats-heteroscedasticite]])
| Hypothèse | Si elle est violée | Remède |
|---|---|---|
| Linéarité | modèle mal spécifié | transformer les variables, termes non linéaires |
| Exogénéité $\mathbb{E}[\varepsilon \mid X] = 0$ | **biais** (variable omise, erreur de mesure, causalité inverse) | variables de contrôle, variables instrumentales |
| Homoscédasticité | coefficients sans biais mais **erreurs standard fausses** | erreurs robustes de White |
| Pas d'autocorrélation des résidus | idem, t-stats gonflées (fréquent en séries temporelles) | erreurs de Newey-West (HAC) |
| Pas de colinéarité parfaite | $X^\top X$ non inversible ; quasi-colinéarité : variance énorme | retirer des variables, Ridge |
| Normalité des résidus | tests exacts invalides en petit échantillon | asymptotique, bootstrap |
:::

:::intuition Un $R^2$ de 1 % est-il inutile ? ([[fiche:stats-r2]])
En finance, non. Un signal qui explique 1 % de la variance des rendements quotidiens a une corrélation de 10 % avec eux. Appliqué à des centaines d'actifs tous les jours, il peut donner un Sharpe élevé (loi fondamentale de la gestion active : $\text{IR} \approx \text{IC}\sqrt{\text{nombre de paris indépendants}}$). À l'inverse, un $R^2$ de 0,9 entre deux séries de **prix** est souvent un artefact (voir la régression fallacieuse plus bas).
:::

## Régularisation : Ridge et Lasso

:::definition Ridge et Lasso
- **Ridge** : minimiser $\|y - X\beta\|^2 + \lambda\|\beta\|_2^2$. Solution : $\hat\beta_{\text{Ridge}} = (X^\top X + \lambda I)^{-1}X^\top y$ (même calcul de gradient que MCO, avec $+2\lambda\beta$).
- **Lasso** : minimiser $\|y - X\beta\|^2 + \lambda\|\beta\|_1$. Pas de formule fermée en général.
:::

:::propriete Ce qu'il faut savoir dire ([[fiche:ml-l1-l2]])
- Ridge **rétrécit** tous les coefficients vers 0 sans les annuler ; il stabilise les régressions colinéaires ($X^\top X + \lambda I$ est toujours inversible). Interprétation bayésienne : a priori gaussien sur $\beta$.
- Lasso met des coefficients **exactement à 0** : il sélectionne des variables. A priori de Laplace.
- Les deux introduisent un **biais** pour réduire la **variance** ; $\lambda$ se choisit par validation croisée (temporelle en finance).
- Il faut **standardiser** les variables avant, sinon la pénalité dépend des unités.
:::

:::exemple En dimension 1 ([[fiche:ml-ridge-1d]])
Sans constante : $\hat\beta_{\text{MCO}} = \frac{\sum x_iy_i}{\sum x_i^2}$ et $\hat\beta_{\text{Ridge}} = \frac{\sum x_iy_i}{\sum x_i^2 + \lambda}$. Pour le Lasso avec $\sum x_i^2 = 1$, le critère est $\beta^2 - 2\beta z + \lambda|\beta|$ (à une constante près), avec $z = \sum x_iy_i$. Pour $\beta > 0$, la dérivée $2\beta - 2z + \lambda$ s'annule en $\beta = z - \lambda/2$, valable si $z > \lambda/2$ ; symétriquement pour $\beta < 0$ ; sinon le minimum est en 0. D'où le **seuillage doux** :
$$
\hat\beta_{\text{Lasso}} = \operatorname{signe}(z)\,\big(|z| - \lambda/2\big)^+.
$$
Les petits coefficients sont mis à zéro : c'est l'angle du losange $\|\beta\|_1 \le c$ qui fait tomber la solution sur les axes.
:::

:::exercice ex-stats-ridge
reponse: 1
Régression Ridge à une variable sans constante : $\sum x_iy_i = 12$, $\sum x_i^2 = 8$, $\lambda = 4$. Coefficient estimé ?
---
$\frac{12}{8 + 4} = 1$, contre $\frac{12}{8} = 1{,}5$ sans pénalité.
:::

## Séries non stationnaires et cointégration

:::definition Stationnarité ([[fiche:stats-stationnarite]])
Une série est (faiblement) **stationnaire** si sa moyenne, sa variance et ses autocovariances ne dépendent pas du temps. Les **prix** ne le sont pas (marche aléatoire : la variance croît comme $t$) ; les **rendements** le sont approximativement (avec une volatilité qui varie, néanmoins).
:::

:::attention La régression fallacieuse ([[fiche:stats-regression-fallacieuse]])
Régresser une marche aléatoire sur une autre, **indépendante**, donne typiquement un $R^2$ élevé et une t-stat énorme : les deux séries ont des tendances stochastiques qui se ressemblent par hasard, et les résidus sont eux-mêmes une marche aléatoire, ce qui invalide toute la théorie des tests (Granger et Newbold, 1974). Règle : on régresse des **rendements**, ou on vérifie la **cointégration**.
:::

:::definition Racine unitaire et test de Dickey-Fuller ([[fiche:stats-adf]])
On écrit $\Delta x_t = c + \gamma x_{t-1} + \sum_j\phi_j\Delta x_{t-j} + \varepsilon_t$. $H_0$ : $\gamma = 0$ (racine unitaire, pas de retour à la moyenne) ; $H_1$ : $\gamma < 0$ (stationnaire). Sous $H_0$, la t-stat de $\hat\gamma$ ne suit **pas** une loi de Student : il faut les valeurs critiques de Dickey-Fuller (environ $-2{,}86$ à 5 % avec constante, au lieu de $-1{,}65$).
:::

:::definition Cointégration et procédure d'Engle-Granger ([[fiche:proj-sa-coint-corr]], [[fiche:proj-sa-engle-granger]])
Deux séries non stationnaires $x$ et $y$ sont **cointégrées** s'il existe $\beta$ tel que $y - \beta x$ soit stationnaire : elles peuvent s'écarter, mais un ressort les ramène. Procédure : (1) régresser $y$ sur $x$ en niveau pour estimer $\beta$ ; (2) tester la stationnarité des résidus par ADF, avec des valeurs critiques **plus sévères** (MacKinnon), car $\hat\beta$ a été choisi pour rendre les résidus aussi petits que possible, donc aussi « stationnaires » que possible.

**Corrélation et cointégration sont différentes** : la corrélation porte sur les rendements (court terme), la cointégration sur les niveaux (long terme). Deux actions peuvent être très corrélées et diverger durablement, ou peu corrélées au jour le jour et cointégrées.
:::

Une fois le spread $y - \beta x$ jugé stationnaire, on le modélise par un processus d'Ornstein-Uhlenbeck et on en estime la demi-vie (chapitre [[n:equations-differentielles-stochastiques]]) : c'est la chaîne complète de ton projet.

## Bootstrap et backtests

:::definition Bootstrap ([[fiche:stats-bootstrap]])
Pour estimer la loi d'une statistique (un Sharpe, une médiane), on **rééchantillonne** les données avec remise un grand nombre de fois et on recalcule la statistique à chaque fois ; la dispersion obtenue approche son erreur d'échantillonnage. Pour des séries **dépendantes** (autocorrélation, clusters de volatilité), on tire des **blocs** de données consécutives, sinon on détruit la dépendance et on sous-estime l'incertitude.
:::

:::propriete Les biais de backtest ([[fiche:stats-biais-backtest]])
1. **Biais d'anticipation** (look-ahead) : utiliser une information pas encore disponible (prix de clôture pour trader à la clôture, données révisées, paramètres estimés sur toute la période).
2. **Biais du survivant** : ne garder que les actifs qui existent aujourd'hui.
3. **Surapprentissage et data snooping** : essayer beaucoup de variantes et garder la meilleure (tests multiples ci-dessus).
4. **Coûts oubliés** : frais, spread, impact de marché, coût d'emprunt des titres vendus à découvert.
5. **Changement de régime** : une relation stable sur la période d'apprentissage peut disparaître.
Le remède principal : un protocole **walk-forward** (estimer sur le passé, tester sur la période suivante, avancer), un échantillon final jamais regardé, et le nombre d'essais déclaré.
:::

## Pièges classiques

:::attention Les erreurs qui coûtent cher
- Interpréter une p-valeur comme la probabilité que l'hypothèse nulle soit vraie.
- Annualiser un Sharpe sans vérifier l'autocorrélation des rendements (une stratégie lissée ou illiquide a un Sharpe artificiellement élevé).
- Oublier le **nombre d'essais** quand on présente un backtest.
- Dire qu'une hétéroscédasticité **biaise** les coefficients MCO : elle fausse les erreurs standard, pas les coefficients.
- Régresser des prix sur des prix.
- Confondre corrélation et cointégration.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Quelles sont les hypothèses des MCO ? Que se passe-t-il si chacune est violée ? »** Le tableau, avec l'idée clé : l'exogénéité conditionne le biais, les autres hypothèses conditionnent les erreurs standard.
- **« Dérive l'estimateur MCO. Quelle est sa variance ? »** Gradient, équations normales, $\sigma^2(X^\top X)^{-1}$.
- **« Ridge ou Lasso ? »** Rétrécissement contre sélection, la géométrie du losange, le seuillage doux.
- **« Ton Sharpe de 1,5 est-il significatif ? »** Écart-type $\approx 1/\sqrt{\text{années}}$, nombre d'essais, Sharpe déflaté.
- **« Tu as testé 1 540 paires, combien de faux positifs ? »** $1\,540 \times 5\,\% = 77$, Bonferroni à $3{,}2 \cdot 10^{-5}$, ou Benjamini-Hochberg.
- **« Corrélation ou cointégration ? Pourquoi les valeurs critiques changent-elles dans Engle-Granger ? »** La section précédente.
- **« Pourquoi divise-t-on par $n - 1$ ? »** La preuve en trois lignes.
:::
