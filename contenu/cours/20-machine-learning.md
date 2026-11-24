---
titre: Machine learning pour la finance
partie: Risque, données et marchés
resume: Le compromis biais-variance démontré, la validation sur séries temporelles et les fuites d'information, la régression logistique (vraisemblance, gradient, cotes), les métriques de classification (précision, rappel, F1, AUC, log-loss), la descente de gradient et sa condition de stabilité, les arbres, forêts et boosting (avec la variance d'une moyenne corrélée), l'ACP, et pourquoi prédire des rendements est si difficile. C'est aussi ton plan B en data science.
duree: 3 h
fiches: ml-biais-variance ml-surapprentissage-signes ml-validation-temporelle ml-fuite-information ml-normalisation ml-regression-logistique ml-cote-logistique ml-log-loss ml-matrice-confusion ml-precision-rappel ml-auc ml-metriques-desequilibre ml-desequilibre-classes ml-descente-gradient ml-arret-precoce ml-arbre-decision ml-foret-boosting ml-importance-variables ml-pca ml-acp-variance ml-k-means ml-l1-l2 ml-ridge-retrecissement ml-surapprentissage-finance ml-desequilibre-temporel ml-features-finance ml-loi-fondamentale ml-regression-quantile ml-foret-variance ml-gradient-logistique
---
Les fonds quantitatifs recrutent de plus en plus de profils « data science », et ton plan B est précisément ce domaine. Les questions de machine learning en entretien quant ne portent presque jamais sur l'architecture d'un réseau de neurones : elles portent sur les **fondamentaux** (biais-variance, validation, métriques, régularisation) et sur les **pièges propres à la finance** (fuites d'information, non-stationnarité, signal très faible). Ce chapitre prolonge la régression du chapitre [[n:statistiques-et-regression]].

## Le cadre et le compromis biais-variance

:::definition Apprentissage supervisé
On observe des couples $(x_i, y_i)$ et on cherche une fonction $\hat f$ qui prédit $y$ à partir de $x$ sur de **nouvelles** données. On minimise une perte moyenne sur l'échantillon d'apprentissage (le **risque empirique**), mais ce qui compte est l'erreur sur des données jamais vues (l'**erreur de généralisation**), estimée sur un échantillon de **validation** (pour régler les hyperparamètres) puis de **test** (regardé une seule fois, à la fin).
:::

:::theoreme Décomposition biais-variance de l'erreur de prédiction
Supposons $y = f(x) + \varepsilon$ avec $\mathbb{E}[\varepsilon] = 0$, $\operatorname{Var}(\varepsilon) = \sigma^2$, et $\hat f$ estimé sur un échantillon aléatoire indépendant de $\varepsilon$. En un point $x$ :
$$
\mathbb{E}\big[(y - \hat f(x))^2\big] = \underbrace{\sigma^2}_{\text{bruit irréductible}} + \underbrace{\big(f(x) - \mathbb{E}[\hat f(x)]\big)^2}_{\text{biais}^2} + \underbrace{\operatorname{Var}\big(\hat f(x)\big)}_{\text{variance}}.
$$
:::

:::preuve
$y - \hat f(x) = \varepsilon + \big(f(x) - \hat f(x)\big)$, et $\varepsilon$ (le bruit du nouveau point) est indépendant de $\hat f$, d'espérance nulle : le terme croisé disparaît, et $\mathbb{E}[(y - \hat f)^2] = \sigma^2 + \mathbb{E}[(f(x) - \hat f(x))^2]$. Le second terme se décompose en biais au carré plus variance, exactement comme au chapitre [[n:statistiques-et-regression]] (décomposition de l'erreur quadratique d'un estimateur).
:::

:::intuition Lecture ([[fiche:ml-biais-variance]])
Un modèle **trop simple** (régression linéaire sur un phénomène non linéaire) a un fort biais ; un modèle **trop flexible** (arbre profond, polynôme de degré 20) a une forte variance : il apprend le bruit de l'échantillon. L'erreur de test en fonction de la complexité a une forme en U. Signes de surapprentissage : erreur d'apprentissage bien plus faible que l'erreur de validation, performances instables d'une période à l'autre ([[fiche:ml-surapprentissage-signes]]). Remèdes : régularisation (Ridge, Lasso, chapitre [[n:statistiques-et-regression]]), plus de données, modèles plus simples, moyennes de modèles, arrêt précoce.
:::

## Valider sur des séries temporelles

:::attention Pourquoi la validation croisée classique est dangereuse ([[fiche:ml-validation-temporelle]])
La validation croisée à $k$ blocs **aléatoires** suppose des observations indépendantes. En finance, elles sont autocorrélées et les étiquettes se chevauchent (un rendement à 5 jours calculé chaque jour partage 4 jours avec celui du lendemain). Mélanger les dates met dans l'apprentissage des observations quasi identiques à celles du test : la performance mesurée est fausse, souvent très optimiste.
:::

:::methode La bonne pratique
1. **Walk-forward** : apprendre sur $[0, t]$, tester sur $]t, t + h]$, avancer $t$, recommencer. On ne prédit jamais le passé avec le futur.
2. **Purge et embargo** (López de Prado) : retirer de l'apprentissage les observations dont l'étiquette chevauche la période de test, et laisser un trou après celle-ci.
3. **Normaliser sans regarder le futur** : moyennes et écarts-types calculés sur l'apprentissage seul (ou glissants) ([[fiche:ml-normalisation]]).
4. Un échantillon final **jamais regardé**, et le nombre d'essais déclaré (tests multiples, chapitre [[n:statistiques-et-regression]]).
:::

:::propriete Les fuites d'information classiques ([[fiche:ml-fuite-information]])
- Utiliser une donnée publiée **après** la date de décision (résultats révisés, prix de clôture pour une décision prise à la clôture).
- Normaliser ou sélectionner les variables sur **tout** l'échantillon.
- Un univers d'actions défini **aujourd'hui** (biais du survivant).
- Des variables construites avec un décalage mal aligné (un jour de trop ou de moins).
:::

## La régression logistique

:::definition Modèle
Pour une étiquette binaire $y \in \{0, 1\}$, on modélise $\mathbb{P}(y = 1 \mid x) = \sigma(x^\top\beta)$ où $\sigma(z) = \frac{1}{1 + e^{-z}}$ est la **sigmoïde**. De façon équivalente, la **log-cote** est linéaire : $\ln\dfrac{p}{1 - p} = x^\top\beta$ ([[fiche:ml-regression-logistique]]).
:::

:::propriete Interprétation des coefficients ([[fiche:ml-cote-logistique]])
Augmenter $x_j$ d'une unité ajoute $\beta_j$ à la log-cote, donc **multiplie la cote** $\frac{p}{1 - p}$ par $e^{\beta_j}$. L'effet sur la probabilité elle-même n'est pas constant : il est maximal près de $p = \frac12$ (pente $\sigma'(z) = \sigma(z)(1 - \sigma(z)) \le \frac14$).
:::

:::exercice ex-ml-cote
reponse: exp(0.8)
tolerance: 0.001
Dans une régression logistique de défaut, le coefficient de l'endettement vaut 0,4. Par combien la cote du défaut est-elle multipliée quand l'endettement augmente de 2 unités ?
---
$e^{0{,}4 \times 2} = e^{0{,}8} \approx 2{,}23$. Si la probabilité de défaut valait 5 % (cote $0{,}0526$), elle passe à une cote de $0{,}117$, soit $p \approx 10{,}5\,\%$.
:::

:::theoreme Perte et gradient
L'estimateur du maximum de vraisemblance minimise l'**entropie croisée** (log-loss)
$$
\mathcal{L}(\beta) = -\frac1n\sum_{i=1}^n\Big(y_i\ln p_i + (1 - y_i)\ln(1 - p_i)\Big), \qquad p_i = \sigma(x_i^\top\beta),
$$
dont le gradient est
$$
\nabla_\beta\mathcal{L} = \frac1n\sum_{i=1}^n(p_i - y_i)\,x_i = \frac1nX^\top(p - y).
$$
La perte est **convexe** : avec un pas assez petit, la descente de gradient converge vers le minimum global, s'il existe (sur des données linéairement séparables, il n'y en a pas : $\|\beta\| \to \infty$, d'où la régularisation).
:::

:::preuve
**Vraisemblance** : $\mathbb{P}(y_i \mid x_i) = p_i^{y_i}(1 - p_i)^{1 - y_i}$ ; le logarithme de la vraisemblance est $\sum(y_i\ln p_i + (1 - y_i)\ln(1 - p_i))$ : la log-loss est son opposé divisé par $n$.

**Gradient** : la sigmoïde vérifie $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ (dériver $(1 + e^{-z})^{-1}$). Donc $\frac{\partial}{\partial z}\ln\sigma(z) = 1 - \sigma(z)$ et $\frac{\partial}{\partial z}\ln(1 - \sigma(z)) = -\sigma(z)$. Pour un exemple, avec $z = x^\top\beta$ :
$$
\frac{\partial}{\partial z}\Big(-y\ln\sigma(z) - (1 - y)\ln(1 - \sigma(z))\Big) = -y(1 - \sigma) + (1 - y)\sigma = \sigma(z) - y.
$$
La règle de dérivation en chaîne ($\partial z/\partial\beta = x$) donne $(p - y)x$. C'est la **même forme** que le gradient des moindres carrés ($X^\top(X\beta - y)$), avec la prédiction $p$ à la place de $X\beta$.

**Convexité** : la hessienne vaut $\frac1n\sum p_i(1 - p_i)\,x_ix_i^\top$, positive.
:::

:::exercice ex-ml-log-loss
reponse: -(log(0.9)+log(0.8)+log(0.6)+log(0.4))/4
tolerance: 0.0001
Quatre exemples d'étiquettes $(1, 0, 1, 1)$ reçoivent les probabilités prédites $(0{,}9 ; 0{,}2 ; 0{,}6 ; 0{,}4)$. Log-loss moyenne (logarithme népérien) ?
---
On prend $-\ln$ de la probabilité donnée à la **bonne** classe : $-\ln 0{,}9$, $-\ln 0{,}8$, $-\ln 0{,}6$, $-\ln 0{,}4$, soit $0{,}105 + 0{,}223 + 0{,}511 + 0{,}916 = 1{,}756$, divisé par 4 : $\approx 0{,}439$. Référence : prédire 0,5 partout donne $\ln 2 \approx 0{,}693$ ([[fiche:ml-log-loss]]).
:::

:::exercice ex-ml-gradient
reponse: -0.225
tolerance: 0.0001
Mêmes données. Quelle est la dérivée de la log-loss moyenne par rapport à la constante (le biais) du modèle ?
---
La colonne de la constante vaut 1, donc la dérivée est $\frac14\sum(p_i - y_i) = \frac14\big((0{,}9 - 1) + (0{,}2 - 0) + (0{,}6 - 1) + (0{,}4 - 1)\big) = \frac{-0{,}9}{4} = -0{,}225$. Négative : augmenter la constante (prédire plus de 1) réduirait la perte, ce qui est logique puisque trois étiquettes sur quatre valent 1 alors que la prédiction moyenne est 0,525.
:::

## Mesurer un classifieur

:::definition Matrice de confusion et métriques ([[fiche:ml-matrice-confusion]], [[fiche:ml-precision-rappel]])
Avec VP (vrais positifs), FP, FN, VN :
- **Précision** $= \frac{VP}{VP + FP}$ : parmi les alertes, la part de vraies.
- **Rappel** (sensibilité) $= \frac{VP}{VP + FN}$ : parmi les vrais cas, la part détectée.
- **F1** $= \frac{2\,\text{précision} \times \text{rappel}}{\text{précision} + \text{rappel}}$, moyenne harmonique des deux.
- **Exactitude** $= \frac{VP + VN}{\text{total}}$ : trompeuse quand les classes sont déséquilibrées (un modèle qui ne signale jamais de fraude a 99,9 % d'exactitude si 0,1 % des transactions sont frauduleuses) ([[fiche:ml-metriques-desequilibre]]).
:::

:::exercice ex-ml-f1
reponse: 2*0.6*0.5/(0.6+0.5)
tolerance: 0.0001
Il y a 60 cas positifs. Le modèle émet 50 alertes, dont 30 vraies. Score F1 ?
---
Précision $30/50 = 0{,}6$, rappel $30/60 = 0{,}5$, F1 $= \frac{2 \times 0{,}6 \times 0{,}5}{1{,}1} \approx 0{,}545$.
:::

:::theoreme L'AUC est une probabilité de bon classement
L'aire sous la courbe ROC (taux de vrais positifs en fonction du taux de faux positifs, quand on fait varier le seuil) est égale à la probabilité qu'un positif tiré au hasard reçoive un score plus élevé qu'un négatif tiré au hasard (en comptant $\frac12$ en cas d'égalité) ([[fiche:ml-auc]]).
:::

:::preuve Idée, sur un échantillon fini
Parcourons les exemples par score décroissant. Chaque positif rencontré fait monter la courbe ROC de $\frac{1}{n_+}$ ; chaque négatif la fait avancer horizontalement de $\frac{1}{n_-}$. Le pas horizontal d'un négatif contribue à l'aire $\frac{1}{n_-} \times$ (hauteur courante), et la hauteur courante est la proportion des positifs déjà rencontrés, c'est-à-dire de **scores supérieurs** à celui de ce négatif. En sommant sur les négatifs : l'aire est la proportion des paires (positif, négatif) bien ordonnées.
:::

:::exercice ex-ml-auc
reponse: 2/3
tolerance: 0.0001
Scores des positifs : 0,8 ; 0,6 ; 0,35. Scores des négatifs : 0,7 ; 0,4 ; 0,2. AUC ?
---
On compte les paires bien ordonnées parmi les $3 \times 3 = 9$ : le 0,8 bat les trois négatifs (3), le 0,6 bat 0,4 et 0,2 (2), le 0,35 bat 0,2 (1). AUC $= \frac{6}{9} = \frac23$.
:::

:::propriete Classes déséquilibrées ([[fiche:ml-desequilibre-classes]])
Rééchantillonner (sous- ou sur-échantillonner, SMOTE) change les **probabilités prédites** : le modèle croit les positifs plus fréquents qu'ils ne le sont. Pondérer la perte par classe a le même effet (poids $w$ sur les positifs ≈ positifs dupliqués $w$ fois : la log-cote est décalée d'environ $\ln w$). Si l'on a besoin de probabilités calibrées (pricing du risque, dimensionnement), on corrige ensuite (retrancher $\ln w$ à la log-cote, ou recalibrer sur la validation), ou l'on garde les données et la perte telles quelles et l'on choisit le seuil de décision selon le coût réel des erreurs.
:::

## Descente de gradient

:::definition Descente de gradient
Pour minimiser $\mathcal{L}(\theta)$ : $\theta_{k+1} = \theta_k - \eta\,\nabla\mathcal{L}(\theta_k)$, avec un **taux d'apprentissage** $\eta$. La version **stochastique** (SGD) remplace le gradient par celui calculé sur un petit lot d'exemples tirés au hasard : moins cher, bruité, et ce bruit aide parfois à sortir de mauvais minima ([[fiche:ml-descente-gradient]]).
:::

:::theoreme Stabilité sur une fonction quadratique
Pour $\mathcal{L}(\theta) = \frac a2\theta^2$ ($a > 0$), la descente de gradient converge si et seulement si $0 < \eta < \frac2a$. En dimension quelconque, pour $\mathcal{L}(\theta) = \frac12\theta^\top H\theta$, il faut $\eta < \frac{2}{\lambda_{\max}(H)}$, et la vitesse est limitée par le **conditionnement** $\lambda_{\max}/\lambda_{\min}$.
:::

:::preuve
$\theta_{k+1} = \theta_k - \eta a\theta_k = (1 - \eta a)\theta_k$, donc $\theta_k = (1 - \eta a)^k\theta_0$, qui tend vers 0 si et seulement si $|1 - \eta a| < 1$, soit $0 < \eta < 2/a$. En dimension $p$, on diagonalise $H$ : chaque direction propre évolue indépendamment avec le facteur $1 - \eta\lambda_i$. Le pas doit convenir à la direction la plus raide ; la direction la plus plate converge alors au rythme $1 - 2\lambda_{\min}/\lambda_{\max}$, lent si le problème est mal conditionné (d'où l'intérêt de **normaliser** les variables, et des méthodes à moment ou adaptatives comme Adam).
:::

:::widget gradient
:::

:::exercice ex-ml-pas
reponse: 0.4
tolerance: 0.0001
On minimise $\mathcal{L}(\theta) = \frac52\theta^2$ par descente de gradient. Au-delà de quel taux d'apprentissage l'algorithme diverge-t-il ?
---
$\eta < \frac{2}{5} = 0{,}4$. Pour $\eta = 0{,}2 = 1/a$, on atteint le minimum en un pas ; entre 0,2 et 0,4, les itérés oscillent autour du minimum en convergeant ; au-delà de 0,4, ils oscillent en divergeant.
:::

:::propriete Arrêt précoce ([[fiche:ml-arret-precoce]])
On arrête l'entraînement quand l'erreur de **validation** cesse de baisser : c'est une forme de régularisation (pour une régression linéaire, la descente de gradient arrêtée tôt se comporte comme une Ridge). Piège en finance : choisir le moment d'arrêt sur une période de validation qui sert aussi à évaluer, ce qui la contamine.
:::

## Arbres, forêts et boosting

:::definition Arbre de décision ([[fiche:ml-arbre-decision]])
Un arbre découpe l'espace des variables par des questions successives « $x_j \le s$ ? » ; chaque découpe est choisie pour réduire le plus possible l'impureté (variance des $y$ en régression, indice de Gini ou entropie en classification). Un arbre profond isole chaque observation : biais faible, **variance très forte**.
:::

:::theoreme Variance d'une moyenne de prédicteurs corrélés
Si $B$ prédicteurs ont chacun la variance $\sigma^2$ et une corrélation deux à deux $\rho$, leur moyenne a pour variance
$$
\operatorname{Var}\Big(\frac1B\sum_{b=1}^B\hat f_b\Big) = \rho\,\sigma^2 + \frac{1 - \rho}{B}\,\sigma^2.
$$
:::

:::preuve
C'est exactement la limite de la diversification du chapitre [[n:risque-et-portefeuille]] : $\frac{1}{B^2}\big(B\sigma^2 + B(B - 1)\rho\sigma^2\big) = \frac{\sigma^2}{B} + \frac{B - 1}{B}\rho\sigma^2 = \rho\sigma^2 + \frac{1 - \rho}{B}\sigma^2$.
:::

:::intuition Forêt aléatoire et boosting ([[fiche:ml-foret-boosting]])
- **Forêt aléatoire** : moyenne de nombreux arbres profonds, chacun appris sur un échantillon bootstrap et en ne regardant qu'un sous-ensemble aléatoire de variables à chaque découpe. La moyenne sur $B$ arbres fait tendre le terme $\frac{1 - \rho}{B}\sigma^2$ vers 0 ; le bootstrap et surtout le tirage de variables **décorrèlent** les arbres et réduisent le terme $\rho\sigma^2$, qui ne diminue pas avec $B$. Robuste, peu de réglages.
- **Gradient boosting** : arbres **peu profonds** ajoutés un par un, chacun ajusté sur les erreurs (plus généralement le gradient de la perte) du modèle courant, avec un petit taux d'apprentissage. Il réduit le **biais** ; plus performant mais plus sensible au surapprentissage : arrêt précoce indispensable.
:::

:::exercice ex-ml-foret
reponse: 0.37
tolerance: 0.01
Une forêt moyenne 10 arbres ; chaque arbre a une variance de prédiction de 1 et deux arbres ont une corrélation de 0,3. Variance de la prédiction de la forêt ?
---
$0{,}3 + \frac{0{,}7}{10} = 0{,}37$. Avec une infinité d'arbres, on ne descendrait pas sous 0,3 : pour progresser, il faut décorréler les arbres.
:::

:::attention Importance des variables ([[fiche:ml-importance-variables]])
L'importance « par impureté » des forêts favorise les variables continues ou à nombreuses modalités et se calcule sur l'apprentissage. Préférer l'importance par **permutation** sur la validation, en se méfiant des variables corrélées (permuter l'une laisse l'autre porter l'information), ou les valeurs de Shapley.
:::

## Apprentissage non supervisé : ACP et k-moyennes

:::theoreme Analyse en composantes principales ([[fiche:ml-pca]])
Soit $\Sigma$ la matrice de covariance de variables centrées. La direction unitaire $v$ qui maximise la variance de la projection $v^\top x$ est le **vecteur propre** de $\Sigma$ associé à la plus grande valeur propre $\lambda_1$, et la variance obtenue vaut $\lambda_1$. Les composantes suivantes sont les vecteurs propres suivants, orthogonaux entre eux. La part de variance expliquée par la $k$-ième composante est $\lambda_k/\sum_i\lambda_i$.
:::

:::preuve
On maximise $v^\top\Sigma v$ sous la contrainte $v^\top v = 1$. Le lagrangien $v^\top\Sigma v - \lambda(v^\top v - 1)$ a pour gradient $2\Sigma v - 2\lambda v$ : au maximum, $\Sigma v = \lambda v$, donc $v$ est un vecteur propre, et la variance $v^\top\Sigma v = \lambda v^\top v = \lambda$ est maximale pour la plus grande valeur propre. La variance totale $\operatorname{tr}\Sigma$ est la somme des valeurs propres.
:::

:::exercice ex-ml-acp
reponse: 0.75
tolerance: 0.0001
Deux variables de variance 2 et de covariance 1. Quelle part de la variance totale la première composante principale explique-t-elle ?
---
Les valeurs propres de $\begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$ sont $3$ (vecteur $(1, 1)/\sqrt2$, la moyenne) et $1$ (vecteur $(1, -1)/\sqrt2$, l'écart). Part : $\frac{3}{4} = 75\,\%$.
:::

:::exemple En finance
Sur des rendements d'actions, la première composante est presque toujours le **marché** (tous les poids du même signe), suivie de facteurs sectoriels ou de style. Sur la courbe des taux : niveau, pente, courbure (chapitre [[n:taux-et-credit]]). L'ACP sert à réduire la dimension, à construire des facteurs de risque, et à débruiter une matrice de covariance ([[fiche:ml-acp-variance]]).
:::

:::definition k-moyennes ([[fiche:ml-k-means]])
On cherche $k$ centres qui minimisent la somme des distances au carré de chaque point à son centre le plus proche. L'algorithme alterne affectation de chaque point au centre le plus proche et recalcul des centres (moyennes). Il converge vers un minimum **local** (relancer avec plusieurs initialisations, k-means++), suppose des groupes de forme sphérique et de tailles comparables, et il faut choisir $k$.
:::

## Pourquoi prédire des rendements est si difficile

:::propriete Les spécificités de la finance ([[fiche:ml-surapprentissage-finance]])
1. **Signal très faible** : une corrélation de 0,05 entre prédiction et rendement est déjà un bon signal. En reconnaissance d'images, le signal est presque parfait.
2. **Non-stationnarité** : les relations changent (régimes, arbitrage par les autres participants qui font disparaître le signal).
3. **Peu de données indépendantes** : 20 ans de données quotidiennes, ce n'est que 5 000 points très bruités et dépendants.
4. **Coûts** : un signal rentable avant coûts peut ne plus l'être après.
Conséquences : modèles simples et régularisés, validation stricte, peu d'essais, et l'intuition économique du signal compte autant que la statistique ([[fiche:ml-features-finance]]).
:::

:::propriete Juger une exactitude de 54 % ([[fiche:ml-desequilibre-temporel]])
Sur $n$ jours de test indépendants, sous l'hypothèse « aucun pouvoir prédictif » ($p = 0{,}5$), l'exactitude a un écart-type de $\sqrt{0{,}25/n}$. Avec $n = 1\,000$ : $1{,}58\,\%$, et 54 % est à $2{,}5$ écarts-types. Mais il faut aussi comparer à la **fréquence de base** (si le marché monte 53 % des jours, prédire « hausse » tous les jours fait 53 %), tenir compte de l'**amplitude** des mouvements bien prédits, et des tests multiples.
:::

:::exercice ex-ml-exactitude
reponse: 0.04/sqrt(0.25/1000)
tolerance: 0.001
Un modèle de direction du marché a 54 % d'exactitude sur 1 000 jours de test indépendants. À combien d'écarts-types de 50 % est-on sous l'hypothèse d'un modèle sans pouvoir prédictif ?
---
Écart-type $\sqrt{0{,}5 \times 0{,}5/1\,000} \approx 0{,}0158$, donc $z = 0{,}04/0{,}0158 \approx 2{,}53$. Significatif pour un seul test, mais pas après avoir essayé vingt modèles (chapitre [[n:statistiques-et-regression]]).
:::

:::propriete La loi fondamentale de la gestion active ([[fiche:ml-loi-fondamentale]])
$\text{IR} \approx \text{IC} \times \sqrt{\text{BR}}$ : le ratio d'information est la corrélation entre prévisions et réalisations (IC) multipliée par la racine du nombre de paris **indépendants** par an (BR). Un IC de 0,05 sur 400 paris indépendants donne un IR de 1. C'est pourquoi les fonds quantitatifs exploitent des signaux faibles sur un très grand nombre d'actifs. Elle découle de l'addition des Sharpe en carré pour des stratégies non corrélées (chapitre [[n:risque-et-portefeuille]]).
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Mélanger les dates dans une validation croisée sur données financières.
- Normaliser ou sélectionner des variables sur tout l'échantillon avant de le découper.
- Juger un classifieur à son exactitude sur des classes déséquilibrées.
- Interpréter un coefficient logistique comme un effet sur la probabilité (c'est un effet sur la log-cote).
- Lire l'importance des variables d'une forêt comme une causalité.
- Annoncer une performance de backtest sans dire combien de modèles ont été essayés.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Explique le compromis biais-variance. »** La décomposition, la courbe en U, un exemple.
- **« Pourquoi pas de validation croisée classique sur des séries financières ? »** Autocorrélation, étiquettes qui se chevauchent ; walk-forward, purge, embargo.
- **« Dérive le gradient de la régression logistique. »** $\sigma' = \sigma(1 - \sigma)$ puis $(p - y)x$.
- **« Forêt aléatoire ou boosting ? »** Variance contre biais, la formule $\rho\sigma^2 + \frac{1 - \rho}{B}\sigma^2$.
- **« Ton modèle a 54 % d'exactitude. C'est bien ? »** Écart-type binomial, fréquence de base, tests multiples, amplitude des gains.
- **« Que ferais-tu pour prédire le rendement à 5 jours d'une action ? »** Variables avec une intuition économique, alignement temporel strict, modèle simple régularisé, validation walk-forward, coûts.
:::
