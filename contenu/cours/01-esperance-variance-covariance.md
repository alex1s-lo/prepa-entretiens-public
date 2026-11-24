---
titre: Espérance, variance, covariance
partie: Probabilités
resume: Les trois outils de calcul derrière la moitié des questions d'entretien : linéarité de l'espérance et indicatrices, variance d'une somme, manipulation des covariances et des matrices de covariance.
duree: 3 h
fiches: proba-points-fixes proba-faces-distinctes proba-boites-vides proba-records proba-premier-as proba-premiere-rouge proba-min-cinq-uniformes proba-max-trois-des proba-variance-uniforme proba-variance-binomiale proba-variance-geometrique cst-variance-de proba-produit-deux-des proba-de-carre mm-meme-de-deux-fois proba-produit-max-min proba-correlation-trois proba-correlation-xz stats-vol-portefeuille risque-diversification-limite risque-beta stats-pentes-croisees stoch-variance-somme
---
Presque toutes les questions de probabilités d'un entretien quant se ramènent à trois gestes : **calculer une espérance en découpant** (linéarité, indicatrices), **calculer une variance en développant** (variance d'une somme, covariances), et **manipuler une matrice de covariance** (portefeuilles, corrélations). Ce chapitre les reprend depuis le début, avec toutes les étapes. Le fil conducteur : on ne calcule presque jamais une loi ; on calcule des espérances de sommes.

## Espérance : définition et linéarité

:::definition Espérance
Pour une variable aléatoire réelle $X$ :

- **discrète**, à valeurs $x_1, x_2, \dots$ : $\mathbb{E}[X] = \sum_i x_i \, \mathbb{P}(X = x_i)$, si la série converge absolument ;
- **à densité** $f$ : $\mathbb{E}[X] = \int_{-\infty}^{+\infty} x f(x)\,dx$, si l'intégrale converge absolument.

Pour une fonction $g$, la **formule de transfert** donne $\mathbb{E}[g(X)] = \sum_i g(x_i)\,\mathbb{P}(X = x_i)$ ou $\int g(x) f(x)\,dx$ : pas besoin de calculer la loi de $g(X)$.
:::

L'espérance est une moyenne pondérée par les probabilités. Sa propriété la plus utile, et de loin, est la linéarité.

:::theoreme Linéarité de l'espérance
Pour toutes variables $X, Y$ (intégrables) et tous réels $a, b$ :
$$
\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y].
$$
**Aucune hypothèse d'indépendance n'est nécessaire.** Par récurrence, $\mathbb{E}\left[\sum_{i=1}^n X_i\right] = \sum_{i=1}^n \mathbb{E}[X_i]$ pour des variables quelconques, même très dépendantes.
:::

:::preuve
Cas discret. Notons $p(x, y) = \mathbb{P}(X = x, Y = y)$ la loi du couple. Par transfert appliqué au couple :
$$
\mathbb{E}[aX + bY] = \sum_{x, y} (ax + by)\, p(x, y) = a \sum_x x \underbrace{\sum_y p(x, y)}_{\mathbb{P}(X = x)} + b \sum_y y \underbrace{\sum_x p(x, y)}_{\mathbb{P}(Y = y)} = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y].
$$
On a seulement réarrangé une somme (licite grâce à la convergence absolue) et reconnu les lois marginales. Nulle part on n'a utilisé $p(x, y) = \mathbb{P}(X = x)\mathbb{P}(Y = y)$ : c'est pourquoi l'indépendance est inutile. Le cas à densité est identique avec des intégrales.
:::

:::attention
La linéarité concerne les **sommes**. Pour les produits, $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$ est faux en général ; c'est vrai si $X$ et $Y$ sont indépendantes (ou plus généralement non corrélées, voir plus bas). Exemple : un seul dé $X$, $\mathbb{E}[X \cdot X] = 91/6 \approx 15{,}17$ alors que $\mathbb{E}[X]^2 = 12{,}25$ ([[fiche:mm-meme-de-deux-fois]]).
:::

## La méthode des indicatrices

C'est l'outil numéro un des entretiens. L'idée : pour **compter** un nombre aléatoire d'objets, on l'écrit comme une somme d'indicatrices, puis on utilise la linéarité.

:::definition Indicatrice
Pour un événement $A$, l'indicatrice $\mathbf{1}_A$ vaut $1$ si $A$ est réalisé et $0$ sinon. C'est une variable de Bernoulli de paramètre $\mathbb{P}(A)$, donc
$$
\mathbb{E}[\mathbf{1}_A] = 1 \cdot \mathbb{P}(A) + 0 \cdot (1 - \mathbb{P}(A)) = \mathbb{P}(A).
$$
:::

:::methode Compter avec des indicatrices
1. Écrire la quantité comme une somme : $N = \sum_i \mathbf{1}_{A_i}$, où $A_i$ est l'événement « l'objet $i$ est compté ».
2. Calculer chaque $\mathbb{P}(A_i)$, souvent égale pour tous les $i$ par symétrie.
3. Conclure : $\mathbb{E}[N] = \sum_i \mathbb{P}(A_i)$.

Les $A_i$ peuvent être aussi dépendants que l'on veut : la linéarité ne s'en soucie pas.
:::

:::exemple Points fixes d'une permutation
On mélange un jeu de $n$ cartes. Combien de cartes restent en moyenne à leur place ?

Soit $A_i$ l'événement « la carte $i$ est en position $i$ ». Une permutation uniforme envoie la carte $i$ dans chacune des $n$ positions avec la même probabilité, donc $\mathbb{P}(A_i) = 1/n$. Le nombre de points fixes est $N = \sum_{i=1}^n \mathbf{1}_{A_i}$, donc
$$
\mathbb{E}[N] = \sum_{i=1}^n \frac{1}{n} = 1.
$$
La réponse ne dépend pas de $n$. Calculer la loi de $N$ serait bien plus difficile (c'est presque une loi de Poisson de paramètre 1, voir [[fiche:proba-derangement]]). Fiche : [[fiche:proba-points-fixes]].
:::

:::exemple Faces distinctes et boîtes vides
On lance un dé 6 fois. Nombre moyen de faces différentes vues ?

Pour chaque face $k$, soit $B_k$ = « la face $k$ apparaît au moins une fois ». Le complémentaire est « aucun des 6 lancers ne donne $k$ », de probabilité $(5/6)^6$ par indépendance des lancers. Donc $\mathbb{P}(B_k) = 1 - (5/6)^6$ et
$$
\mathbb{E}[\text{nombre de faces vues}] = \sum_{k=1}^6 \mathbb{P}(B_k) = 6\left(1 - (5/6)^6\right) \approx 6 \times 0{,}665 = 3{,}99.
$$
Même raisonnement pour 10 balles lancées dans 10 boîtes : une boîte donnée reste vide avec probabilité $0{,}9^{10}$, donc il y a en moyenne $10 \times 0{,}9^{10} \approx 3{,}49$ boîtes vides. Fiches : [[fiche:proba-faces-distinctes]], [[fiche:proba-boites-vides]].
:::

:::exemple Records
On observe $X_1, \dots, X_n$ indépendantes de même loi continue. $X_k$ est un record si elle dépasse $X_1, \dots, X_{k-1}$. Par symétrie, chacune des $k$ premières valeurs a la même chance d'être la plus grande des $k$ (les égalités ont probabilité nulle) : $\mathbb{P}(X_k \text{ record}) = 1/k$. Donc
$$
\mathbb{E}[\text{nombre de records}] = \sum_{k=1}^n \frac{1}{k} = H_n \approx \ln n + 0{,}577.
$$
Pour $n = 10$ : $H_{10} \approx 2{,}93$. Fiche : [[fiche:proba-records]].
:::

:::exercice ex-paires-anniversaire
reponse: 435/365
tolerance: 0.002
Dans un groupe de 30 personnes, combien y a-t-il **en moyenne** de paires de personnes nées le même jour de l'année (365 jours équiprobables, naissances indépendantes) ?
---
Il y a $\binom{30}{2} = 435$ paires. Pour une paire $\{i, j\}$, soit $A_{ij}$ = « $i$ et $j$ ont le même anniversaire » : quelle que soit la date de $i$, celle de $j$ coïncide avec probabilité $1/365$. Donc
$$
\mathbb{E}[\text{nombre de paires}] = \sum_{\{i,j\}} \mathbb{P}(A_{ij}) = \frac{435}{365} \approx 1{,}19.
$$
Les événements $A_{ij}$ ne sont pas indépendants ($A_{12}$ et $A_{13}$ rendent $A_{23}$ plus probable), mais la linéarité s'en moque. C'est aussi pourquoi la probabilité qu'au moins une paire coïncide est élevée avec seulement 23 personnes : il y a déjà 253 paires ([[fiche:proba-anniversaires]]).
:::

## Espérance par la queue de distribution

Une deuxième formule très utile, notamment pour les maximums et minimums.

:::theoreme Espérance et fonction de survie
Si $X$ est à valeurs dans $\{0, 1, 2, \dots\}$ :
$$
\mathbb{E}[X] = \sum_{k \ge 1} \mathbb{P}(X \ge k) = \sum_{k \ge 0} \mathbb{P}(X > k).
$$
Si $X \ge 0$ est à densité : $\mathbb{E}[X] = \int_0^{+\infty} \mathbb{P}(X > x)\,dx$.
:::

:::preuve
On écrit $X = \sum_{k \ge 1} \mathbf{1}_{\{X \ge k\}}$ : si $X = 3$, les indicatrices pour $k = 1, 2, 3$ valent 1 et les autres 0, et la somme vaut bien 3. Il suffit de prendre l'espérance (linéarité, étendue aux séries de termes positifs) :
$$
\mathbb{E}[X] = \sum_{k \ge 1} \mathbb{E}\left[\mathbf{1}_{\{X \ge k\}}\right] = \sum_{k \ge 1} \mathbb{P}(X \ge k).
$$
Version continue : $X = \int_0^{+\infty} \mathbf{1}_{\{X > x\}}\,dx$, puis on échange espérance et intégrale (théorème de Fubini-Tonelli, tout est positif).
:::

:::exemple Maximum et minimum de variables uniformes
Soient $U_1, \dots, U_n$ indépendantes uniformes sur $[0, 1]$, $M = \max U_i$ et $m = \min U_i$.

- $\mathbb{P}(M \le x) = \mathbb{P}(\text{tous les } U_i \le x) = x^n$ par indépendance, donc $\mathbb{P}(M > x) = 1 - x^n$ et
$$
\mathbb{E}[M] = \int_0^1 (1 - x^n)\,dx = 1 - \frac{1}{n+1} = \frac{n}{n+1}.
$$
- $\mathbb{P}(m > x) = \mathbb{P}(\text{tous les } U_i > x) = (1 - x)^n$, donc $\mathbb{E}[m] = \int_0^1 (1-x)^n\,dx = \frac{1}{n+1}$.

Pour $n = 5$, $\mathbb{E}[m] = 1/6$ ([[fiche:proba-min-cinq-uniformes]]). Intuition : $n$ points uniformes découpent $[0, 1]$ en $n + 1$ morceaux de même longueur moyenne $1/(n+1)$.
:::

:::exercice ex-min-trois-des
reponse: 441/216
Trois dés sont lancés. Calcule l'espérance du plus petit résultat avec la formule $\mathbb{E}[X] = \sum_{k \ge 1} \mathbb{P}(X \ge k)$.
---
Soit $m$ le minimum. $\{m \ge k\}$ signifie « les trois dés font au moins $k$ », de probabilité $\left(\frac{7-k}{6}\right)^3$ pour $k = 1, \dots, 6$. Donc
$$
\mathbb{E}[m] = \sum_{k=1}^6 \left(\frac{7-k}{6}\right)^3 = \frac{6^3 + 5^3 + 4^3 + 3^3 + 2^3 + 1^3}{216} = \frac{216 + 125 + 64 + 27 + 8 + 1}{216} = \frac{441}{216} \approx 2{,}04.
$$
Vérification par symétrie : le maximum de trois dés vaut en moyenne $7 - 2{,}04 = 4{,}96$ (car $7 - X$ a la même loi qu'un dé), cohérent avec [[fiche:proba-max-trois-des]].
:::

## Variance

:::definition Variance et écart-type
$$
\operatorname{Var}(X) = \mathbb{E}\left[(X - \mathbb{E}[X])^2\right], \qquad \sigma_X = \sqrt{\operatorname{Var}(X)}.
$$
La variance mesure la dispersion autour de la moyenne ; l'écart-type est dans la même unité que $X$.
:::

:::theoreme Formule de König-Huygens et transformations affines
$$
\operatorname{Var}(X) = \mathbb{E}[X^2] - \mathbb{E}[X]^2, \qquad \operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X).
$$
:::

:::preuve
Posons $\mu = \mathbb{E}[X]$ (un nombre, pas une variable aléatoire). On développe le carré puis on applique la linéarité :
$$
\mathbb{E}[(X - \mu)^2] = \mathbb{E}[X^2 - 2\mu X + \mu^2] = \mathbb{E}[X^2] - 2\mu\,\mathbb{E}[X] + \mu^2 = \mathbb{E}[X^2] - 2\mu^2 + \mu^2 = \mathbb{E}[X^2] - \mu^2.
$$
Pour $aX + b$ : sa moyenne est $a\mu + b$, donc $aX + b - (a\mu + b) = a(X - \mu)$ et $\operatorname{Var}(aX + b) = \mathbb{E}[a^2 (X - \mu)^2] = a^2 \operatorname{Var}(X)$. La constante $b$ décale sans disperser.
:::

:::exemple Les variances à connaître, calculées
- **Bernoulli** de paramètre $p$ : $X^2 = X$ (car $0^2 = 0$ et $1^2 = 1$), donc $\mathbb{E}[X^2] = p$ et $\operatorname{Var}(X) = p - p^2 = p(1-p)$.
- **Dé à 6 faces** : $\mathbb{E}[X^2] = \frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \frac{91}{6}$, donc $\operatorname{Var}(X) = \frac{91}{6} - \frac{49}{4} = \frac{182 - 147}{12} = \frac{35}{12} \approx 2{,}92$ ([[fiche:cst-variance-de]]).
- **Uniforme sur $[0,1]$** : $\mathbb{E}[U^2] = \int_0^1 x^2\,dx = \frac13$, donc $\operatorname{Var}(U) = \frac13 - \frac14 = \frac{1}{12}$. Sur $[a, b]$, $U' = a + (b-a)U$ a pour variance $\frac{(b-a)^2}{12}$.
- **Géométrique** (nombre d'essais jusqu'au premier succès, probabilité $p$) : $\mathbb{E}[X] = 1/p$ et $\operatorname{Var}(X) = \frac{1-p}{p^2}$ ; pour le premier 6 d'un dé, $\operatorname{Var} = \frac{5/6}{1/36} = 30$ ([[fiche:proba-variance-geometrique]]). Démonstration au chapitre [[n:conditionnement-markov-martingales]], par conditionnement.
:::

## Covariance

C'est la notion qui pose le plus de problèmes, et pourtant les règles de calcul sont celles d'un produit qu'on développe.

:::definition Covariance et corrélation
$$
\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])\big] = \mathbb{E}[XY] - \mathbb{E}[X]\,\mathbb{E}[Y],
$$
$$
\rho(X, Y) = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\,\sigma_Y} \in [-1, 1].
$$
La covariance est positive quand $X$ et $Y$ ont tendance à être ensemble au-dessus (ou ensemble en dessous) de leurs moyennes.
:::

La deuxième égalité se démontre exactement comme König-Huygens : on développe $(X - \mu_X)(Y - \mu_Y)$ et on prend l'espérance.

:::theoreme Règles de calcul (bilinéarité)
Pour des variables $X, Y, Z$ et des constantes $a, b, c$ :

1. $\operatorname{Cov}(X, X) = \operatorname{Var}(X)$ ;
2. $\operatorname{Cov}(X, Y) = \operatorname{Cov}(Y, X)$ ;
3. $\operatorname{Cov}(X, c) = 0$ : une constante ne covarie avec rien ;
4. $\operatorname{Cov}(aX + bY, Z) = a\operatorname{Cov}(X, Z) + b\operatorname{Cov}(Y, Z)$, et de même dans le second argument.

En pratique : **on développe $\operatorname{Cov}\left(\sum_i a_i X_i, \sum_j b_j Y_j\right)$ comme le produit $\left(\sum_i a_i X_i\right)\left(\sum_j b_j Y_j\right)$**, en remplaçant chaque produit $X_i Y_j$ par $\operatorname{Cov}(X_i, Y_j)$ et en effaçant les constantes :
$$
\operatorname{Cov}\Big(\sum_i a_i X_i, \sum_j b_j Y_j\Big) = \sum_i \sum_j a_i b_j \operatorname{Cov}(X_i, Y_j).
$$
:::

:::preuve
1 et 2 sont immédiats sur la définition. Pour 3, $c - \mathbb{E}[c] = 0$. Pour 4, notons $\tilde X = X - \mathbb{E}[X]$ et de même pour $Y, Z$. Alors $aX + bY - \mathbb{E}[aX + bY] = a\tilde X + b\tilde Y$ par linéarité, et
$$
\operatorname{Cov}(aX + bY, Z) = \mathbb{E}[(a\tilde X + b\tilde Y)\tilde Z] = a\,\mathbb{E}[\tilde X \tilde Z] + b\,\mathbb{E}[\tilde Y \tilde Z] = a\operatorname{Cov}(X,Z) + b\operatorname{Cov}(Y,Z).
$$
La formule générale s'en déduit en appliquant 4 dans chaque argument.
:::

:::exemple Un calcul de covariance complet, étape par étape
On suppose $\operatorname{Var}(X) = 4$, $\operatorname{Var}(Y) = 9$, $\operatorname{Cov}(X, Y) = 1{,}5$. Calculons $\operatorname{Cov}(2X - Y + 3, X + Y)$.

On efface d'abord la constante 3 (règle 3). Puis on développe comme un produit $(2X - Y)(X + Y) = 2X\cdot X + 2X\cdot Y - Y\cdot X - Y \cdot Y$ :
$$
\operatorname{Cov}(2X - Y, X + Y) = 2\operatorname{Cov}(X,X) + 2\operatorname{Cov}(X,Y) - \operatorname{Cov}(Y,X) - \operatorname{Cov}(Y,Y)
$$
$$
= 2 \times 4 + 2 \times 1{,}5 - 1{,}5 - 9 = 8 + 3 - 1{,}5 - 9 = 0{,}5.
$$
:::

:::theoreme Indépendance et covariance
Si $X$ et $Y$ sont indépendantes, alors $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$, donc $\operatorname{Cov}(X, Y) = 0$. **La réciproque est fausse.**
:::

:::preuve
Cas discret : par indépendance $p(x, y) = \mathbb{P}(X=x)\,\mathbb{P}(Y=y)$, donc
$$
\mathbb{E}[XY] = \sum_{x,y} xy\,\mathbb{P}(X=x)\,\mathbb{P}(Y=y) = \Big(\sum_x x\,\mathbb{P}(X=x)\Big)\Big(\sum_y y\,\mathbb{P}(Y=y)\Big) = \mathbb{E}[X]\,\mathbb{E}[Y].
$$
Contre-exemple pour la réciproque : $X \sim \mathcal{N}(0,1)$ et $Y = X^2$. Alors $\operatorname{Cov}(X, X^2) = \mathbb{E}[X^3] - \mathbb{E}[X]\,\mathbb{E}[X^2] = 0 - 0 = 0$ (moment impair d'une loi symétrique), alors que $Y$ est une fonction de $X$ : dépendance totale ([[fiche:stoch-covariance-carre]]).
:::

:::theoreme La corrélation est entre −1 et 1
$\lvert\operatorname{Cov}(X, Y)\rvert \le \sigma_X \sigma_Y$, avec égalité, lorsque $X$ n'est pas constante, si et seulement si $Y$ est une fonction affine de $X$ (presque sûrement).
:::

:::preuve
Pour tout réel $t$, la variance de $Y - tX$ est positive. Développons-la avec la bilinéarité :
$$
0 \le \operatorname{Var}(Y - tX) = \operatorname{Var}(Y) - 2t\operatorname{Cov}(X, Y) + t^2 \operatorname{Var}(X).
$$
C'est un trinôme en $t$ toujours positif (si $\operatorname{Var}(X) > 0$ ; si $\operatorname{Var}(X) = 0$, $X$ est constante, $\operatorname{Cov}(X, Y) = 0$ et l'inégalité est immédiate) : son discriminant est négatif ou nul,
$$
4\operatorname{Cov}(X,Y)^2 - 4\operatorname{Var}(X)\operatorname{Var}(Y) \le 0,
$$
ce qui est l'inégalité annoncée (c'est l'inégalité de Cauchy-Schwarz). Égalité : le trinôme s'annule en un $t_0$, donc $\operatorname{Var}(Y - t_0 X) = 0$ et $Y - t_0 X$ est constante.
:::

## Variance d'une somme

C'est **la** formule à savoir appliquer sans hésiter.

:::theoreme Variance d'une somme
$$
\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y),
$$
$$
\operatorname{Var}\Big(\sum_{i=1}^n a_i X_i\Big) = \sum_{i=1}^n a_i^2 \operatorname{Var}(X_i) + 2\sum_{i < j} a_i a_j \operatorname{Cov}(X_i, X_j).
$$
Si les $X_i$ sont deux à deux non corrélées (par exemple indépendantes), les variances s'additionnent : $\operatorname{Var}\left(\sum X_i\right) = \sum \operatorname{Var}(X_i)$.
:::

:::preuve
$\operatorname{Var}(S) = \operatorname{Cov}(S, S)$ ; on développe $\operatorname{Cov}\left(\sum_i a_i X_i, \sum_j a_j X_j\right) = \sum_i \sum_j a_i a_j \operatorname{Cov}(X_i, X_j)$. Les termes $i = j$ donnent les variances ; les termes $i \neq j$ vont par paires ($(i, j)$ et $(j, i)$ sont égaux par symétrie), d'où le facteur 2.
:::

:::attention
$\operatorname{Var}(X - Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) - 2\operatorname{Cov}(X,Y)$ : pour des variables indépendantes, **les variances s'ajoutent aussi pour une différence**. Le risque d'un écart entre deux actifs indépendants est plus grand que celui de chacun.
:::

:::exemple Variance d'une loi binomiale, par les indicatrices
Le nombre de piles en $n$ lancers est $S = \sum_{i=1}^n \mathbf{1}_{A_i}$, avec des indicatrices indépendantes de variance $p(1-p)$. Donc $\operatorname{Var}(S) = np(1-p)$ ; pour 100 lancers équilibrés, $25$, soit un écart-type de 5 ([[fiche:proba-variance-binomiale]]).
:::

:::exemple Variance du nombre de points fixes : les covariances comptent
Reprenons $N = \sum_{i=1}^n \mathbf{1}_{A_i}$ (points fixes). Ici les indicatrices ne sont **pas** indépendantes. On a :

- $\operatorname{Var}(\mathbf{1}_{A_i}) = \frac1n\left(1 - \frac1n\right)$ ;
- pour $i \neq j$ : $\mathbb{P}(A_i \cap A_j) = \frac{1}{n(n-1)}$ (la carte $i$ va en $i$, puis la carte $j$ en $j$ parmi $n - 1$ places), donc
$$
\operatorname{Cov}(\mathbf{1}_{A_i}, \mathbf{1}_{A_j}) = \frac{1}{n(n-1)} - \frac{1}{n^2} = \frac{n - (n-1)}{n^2(n-1)} = \frac{1}{n^2(n-1)}.
$$
Avec $n$ variances et $n(n-1)$ couples ordonnés $(i, j)$, $i \neq j$ :
$$
\operatorname{Var}(N) = n \cdot \frac1n\Big(1 - \frac1n\Big) + n(n-1)\cdot\frac{1}{n^2(n-1)} = 1 - \frac1n + \frac1n = 1.
$$
Moyenne 1, variance 1 : c'est la signature d'une loi de Poisson de paramètre 1.
:::

:::exercice ex-cov-points-fixes
reponse: 1/100
Pour une permutation uniforme de 5 cartes, calcule $\operatorname{Cov}(\mathbf{1}_{A_1}, \mathbf{1}_{A_2})$, où $A_i$ = « la carte $i$ est à sa place ».
---
$\mathbb{P}(A_1 \cap A_2) = \frac{1}{5 \times 4} = \frac{1}{20}$ et $\mathbb{P}(A_1)\,\mathbb{P}(A_2) = \frac{1}{25}$. Donc
$$
\operatorname{Cov} = \frac{1}{20} - \frac{1}{25} = \frac{5 - 4}{100} = \frac{1}{100}.
$$
Positive : savoir que la carte 1 est à sa place laisse 4 places pour 4 cartes, ce qui rend un autre point fixe un peu plus probable ($1/4 > 1/5$).
:::

:::exercice ex-var-combinaison
reponse: 19
$\operatorname{Var}(X) = 4$, $\operatorname{Var}(Y) = 9$, $\operatorname{Cov}(X, Y) = 1{,}5$. Calcule $\operatorname{Var}(2X - Y)$.
---
$$
\operatorname{Var}(2X - Y) = 2^2 \operatorname{Var}(X) + (-1)^2 \operatorname{Var}(Y) + 2 \times 2 \times (-1) \operatorname{Cov}(X, Y) = 16 + 9 - 6 = 19.
$$
Réflexe : les coefficients passent **au carré** devant les variances, et **sans carré, avec leur signe** devant les covariances (multipliés par 2).
:::

## La variance d'une moyenne et la racine du temps

:::theoreme Moyenne de variables corrélées
Soient $X_1, \dots, X_n$ de même variance $\sigma^2$ et de corrélation commune $\rho$ deux à deux. Alors
$$
\operatorname{Var}\Big(\frac1n \sum_{i=1}^n X_i\Big) = \frac{\sigma^2}{n}\big(1 + (n-1)\rho\big) \xrightarrow[n \to \infty]{} \rho\,\sigma^2.
$$
:::

:::preuve
Avec les $a_i = 1/n$ : $n$ termes de variance $\frac{\sigma^2}{n^2}$ et $n(n-1)$ couples ordonnés de covariance $\frac{\rho\sigma^2}{n^2}$ :
$$
\frac{n\sigma^2}{n^2} + \frac{n(n-1)\rho\sigma^2}{n^2} = \frac{\sigma^2}{n}\big(1 + (n-1)\rho\big).
$$
:::

Deux conséquences que l'on retrouve partout en finance :

- **Indépendance ($\rho = 0$)** : l'écart-type d'une moyenne décroît en $\sigma/\sqrt{n}$. C'est l'erreur d'un Monte-Carlo, la largeur d'un intervalle de confiance, et la **règle de la racine du temps** : si les rendements quotidiens sont indépendants de volatilité $\sigma_j$, la somme de 252 rendements a une volatilité $\sigma_j\sqrt{252}$, d'où $\sigma_{\text{an}} = \sigma_j\sqrt{252} \approx 16\,\sigma_j$.
- **Corrélation positive** : la diversification plafonne. Un portefeuille équipondéré d'un grand nombre d'actions de volatilité 20 % corrélées à 0,25 garde une volatilité $20\% \times \sqrt{0{,}25} = 10\%$ ([[fiche:risque-diversification-limite]]).

:::exercice ex-var-moyenne-correlee
reponse: 0.37
Dix variables de variance 1 sont corrélées deux à deux à 0,3. Quelle est la variance de leur moyenne ?
---
$\frac{1}{10}\big(1 + 9 \times 0{,}3\big) = \frac{3{,}7}{10} = 0{,}37$, contre $0{,}1$ si elles étaient indépendantes : la corrélation multiplie la variance par 3,7.
:::

## Portefeuilles et matrices de covariance

Pour plus de deux variables, l'écriture matricielle évite les erreurs.

:::definition Matrice de covariance
Pour un vecteur aléatoire $X = (X_1, \dots, X_n)^\top$, la matrice de covariance est $\Sigma = \big(\operatorname{Cov}(X_i, X_j)\big)_{i,j}$, soit
$$
\Sigma = \mathbb{E}\big[(X - \mu)(X - \mu)^\top\big], \qquad \mu = \mathbb{E}[X].
$$
Sur la diagonale, les variances ; hors diagonale, les covariances $\Sigma_{ij} = \rho_{ij}\sigma_i\sigma_j$.
:::

:::theoreme Variance d'une combinaison linéaire et transformation linéaire
Pour un vecteur de poids $w$ et une matrice $A$ :
$$
\operatorname{Var}(w^\top X) = w^\top \Sigma\, w, \qquad \operatorname{Cov}(AX) = A\,\Sigma\,A^\top.
$$
En particulier, $\Sigma$ est **symétrique positive** : $w^\top \Sigma w \ge 0$ pour tout $w$.
:::

:::preuve
$w^\top X - w^\top \mu = w^\top (X - \mu)$, nombre réel qui est égal à sa transposée $(X - \mu)^\top w$. Donc
$$
\operatorname{Var}(w^\top X) = \mathbb{E}\big[w^\top (X-\mu)(X-\mu)^\top w\big] = w^\top\, \mathbb{E}\big[(X-\mu)(X-\mu)^\top\big]\, w = w^\top \Sigma w,
$$
où l'on a sorti les constantes $w^\top$ et $w$ de l'espérance (linéarité, coefficient par coefficient). Positivité : c'est une variance. Même calcul pour $AX$ avec $A$ à la place de $w^\top$. En développant $w^\top\Sigma w = \sum_{i,j} w_i w_j \Sigma_{ij}$, on retrouve exactement la formule de la variance d'une somme.
:::

:::exemple Portefeuille à deux actifs
Poids $w = (w_1, w_2)$, volatilités $\sigma_1, \sigma_2$, corrélation $\rho$ :
$$
\Sigma = \begin{pmatrix} \sigma_1^2 & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^2 \end{pmatrix}, \qquad \sigma_p^2 = w^\top\Sigma w = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2.
$$
Avec $w = (0{,}5 ; 0{,}5)$, $\sigma_1 = 20\%$, $\sigma_2 = 30\%$, $\rho = 0{,}5$ :
$$
\sigma_p^2 = 0{,}25 \times 0{,}04 + 0{,}25 \times 0{,}09 + 2 \times 0{,}25 \times 0{,}5 \times 0{,}2 \times 0{,}3 = 0{,}01 + 0{,}0225 + 0{,}015 = 0{,}0475,
$$
soit $\sigma_p \approx 21{,}8\%$, moins que la moyenne des volatilités (25 %) : c'est la diversification ([[fiche:stats-vol-portefeuille]]). Manipule la simulation ci-dessous pour voir chaque terme bouger.
:::

:::widget covariance
:::

:::exemple Portefeuille de variance minimale
**Deux actifs.** Avec $w_2 = 1 - w_1$, on minimise $f(w_1) = w_1^2\sigma_1^2 + (1-w_1)^2\sigma_2^2 + 2w_1(1-w_1)\rho\sigma_1\sigma_2$. La dérivée :
$$
f'(w_1) = 2w_1\sigma_1^2 - 2(1-w_1)\sigma_2^2 + 2(1 - 2w_1)\rho\sigma_1\sigma_2 = 0
$$
$$
\iff w_1\big(\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2\big) = \sigma_2^2 - \rho\sigma_1\sigma_2 \iff w_1^* = \frac{\sigma_2^2 - \rho\sigma_1\sigma_2}{\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2}.
$$
Pour l'exemple précédent : $w_1^* = \frac{0{,}09 - 0{,}03}{0{,}04 + 0{,}09 - 0{,}06} = \frac{0{,}06}{0{,}07} \approx 86\%$ dans l'actif le moins volatil.

**$n$ actifs.** On minimise $w^\top \Sigma w$ sous la contrainte $\mathbf{1}^\top w = 1$. Lagrangien $\mathcal{L} = w^\top\Sigma w - \lambda(\mathbf{1}^\top w - 1)$ ; le gradient s'annule : $2\Sigma w = \lambda\mathbf{1}$, donc $w = \frac{\lambda}{2}\Sigma^{-1}\mathbf{1}$, et la contrainte fixe $\lambda$ :
$$
w^* = \frac{\Sigma^{-1}\mathbf{1}}{\mathbf{1}^\top\Sigma^{-1}\mathbf{1}}, \qquad \sigma^2_{\min} = \frac{1}{\mathbf{1}^\top\Sigma^{-1}\mathbf{1}}.
$$
(Le gradient de $w^\top\Sigma w$ vaut $2\Sigma w$ car $\Sigma$ est symétrique.)
:::

## Corrélations possibles et impossibles

Toute matrice symétrique de 1 sur la diagonale n'est pas une matrice de corrélation : il faut qu'elle soit positive. C'est l'origine de questions classiques.

:::exemple Trois variables de même corrélation
Si $X_1, X_2, X_3$ sont réduites (variance 1) et de corrélation commune $\rho$, alors
$$
0 \le \operatorname{Var}(X_1 + X_2 + X_3) = 3 + 2 \times 3\rho = 3 + 6\rho \implies \rho \ge -\frac12.
$$
Pour $n$ variables : $0 \le n + n(n-1)\rho$, soit $\rho \ge -\frac{1}{n-1}$. Autre lecture : les valeurs propres de la matrice $(1-\rho)I + \rho J$ (où $J$ est remplie de 1) sont $1 + (n-1)\rho$ (vecteur $\mathbf{1}$) et $1 - \rho$ (vecteurs orthogonaux à $\mathbf{1}$), qui doivent être positives. Fiche : [[fiche:proba-correlation-trois]].
:::

:::exemple Corrélations enchaînées
$\rho(X, Y) = 0{,}9$ et $\rho(Y, Z) = 0{,}9$ : que peut valoir $\rho(X, Z)$ ? Variables réduites. On décompose $X$ et $Z$ en une partie proportionnelle à $Y$ et un reste non corrélé à $Y$ :
$$
X = 0{,}9\,Y + \sqrt{1 - 0{,}81}\,U, \qquad Z = 0{,}9\,Y + \sqrt{0{,}19}\,V,
$$
avec $U, V$ réduites et non corrélées à $Y$ (on vérifie : $\operatorname{Var}(X) = 0{,}81 + 0{,}19 = 1$ et $\operatorname{Cov}(X, Y) = 0{,}9$). Par bilinéarité :
$$
\rho(X, Z) = \operatorname{Cov}(X, Z) = 0{,}81\operatorname{Var}(Y) + 0{,}19\operatorname{Cov}(U, V) = 0{,}81 + 0{,}19\,\rho(U, V) \in [0{,}62 ; 1].
$$
Fiche : [[fiche:proba-correlation-xz]].
:::

:::exercice ex-rho-min-quatre
reponse: -1/3
Quatre actifs ont deux à deux la même corrélation $\rho$. Quelle est la plus petite valeur possible de $\rho$ ?
---
$0 \le \operatorname{Var}(X_1 + X_2 + X_3 + X_4) = 4 + 2 \times \binom{4}{2}\rho = 4 + 12\rho$, donc $\rho \ge -\frac13$ (cas général $-\frac{1}{n-1}$).
:::

## Covariance et régression

La covariance a une interprétation géométrique simple : elle donne la meilleure approximation affine de $Y$ par $X$.

:::theoreme Meilleur prédicteur affine
Le couple $(a, b)$ qui minimise $\mathbb{E}\left[(Y - a - bX)^2\right]$ est
$$
b^* = \frac{\operatorname{Cov}(X, Y)}{\operatorname{Var}(X)} = \rho\,\frac{\sigma_Y}{\sigma_X}, \qquad a^* = \mathbb{E}[Y] - b^*\,\mathbb{E}[X].
$$
Le résidu $\varepsilon = Y - a^* - b^*X$ est d'espérance nulle et **non corrélé** à $X$, et la part de variance expliquée vaut $\rho^2$.
:::

:::preuve
Pour $b$ fixé, $\mathbb{E}[(Y - bX - a)^2]$ est minimal en $a = \mathbb{E}[Y - bX]$ (la constante qui approche le mieux une variable au sens quadratique est sa moyenne). Il reste à minimiser
$$
\operatorname{Var}(Y - bX) = \operatorname{Var}(Y) - 2b\operatorname{Cov}(X, Y) + b^2 \operatorname{Var}(X),
$$
trinôme en $b$ minimal en $b^* = \operatorname{Cov}(X,Y)/\operatorname{Var}(X)$. Ensuite $\operatorname{Cov}(\varepsilon, X) = \operatorname{Cov}(Y, X) - b^*\operatorname{Var}(X) = 0$. Enfin $\operatorname{Var}(Y) = b^{*2}\operatorname{Var}(X) + \operatorname{Var}(\varepsilon)$ (somme de deux termes non corrélés), et $b^{*2}\operatorname{Var}(X)/\operatorname{Var}(Y) = \rho^2$.
:::

Conséquences directes :

- Le **bêta** d'une action est la pente de sa régression sur le marché : $\beta = \operatorname{Cov}(r, r_m)/\operatorname{Var}(r_m) = \rho\,\sigma/\sigma_m$ ([[fiche:risque-beta]]).
- La pente de $Y$ sur $X$ et celle de $X$ sur $Y$ ne sont pas inverses : leur produit vaut $\frac{\operatorname{Cov}^2}{\operatorname{Var}(X)\operatorname{Var}(Y)} = \rho^2$ ([[fiche:stats-pentes-croisees]]).
- Le ratio de couverture de variance minimale d'une position $S$ par un contrat $F$ est $h^* = \operatorname{Cov}(S, F)/\operatorname{Var}(F)$ : c'est le même calcul.

:::exercice ex-beta-calcul
reponse: 1.2
Une action a une volatilité de 30 %, l'indice de 15 %, et leur corrélation vaut 0,6. Combien d'euros d'indice faut-il vendre pour couvrir 1 € d'action au sens de la variance minimale ?
---
$h^* = \frac{\operatorname{Cov}}{\operatorname{Var}(\text{indice})} = \frac{0{,}6 \times 0{,}30 \times 0{,}15}{0{,}15^2} = \frac{0{,}6 \times 0{,}30}{0{,}15} = 1{,}2$ €. La variance résiduelle est $(1 - \rho^2)\sigma^2 = 0{,}64 \times 0{,}09$ : la couverture n'élimine que 36 % de la variance.
:::

## Pièges classiques en entretien

:::attention Les erreurs qui reviennent
- **Produit de variables dépendantes** : $\mathbb{E}[\max(U,V)\min(U,V)] = \mathbb{E}[UV] = 1/4$, et non $\mathbb{E}[\max]\,\mathbb{E}[\min] = 2/9$ ([[fiche:proba-produit-max-min]]).
- **Oublier la covariance** : $\operatorname{Var}(W_1 + W_2) = 5$ pour un mouvement brownien, pas 3, car $\operatorname{Cov}(W_1, W_2) = 1$ ([[fiche:stoch-variance-somme]]).
- **Variance d'une différence** : les variances s'ajoutent, elles ne se soustraient pas.
- **Covariance nulle n'est pas indépendance** ($X$ et $X^2$).
- **Racine du temps sans indépendance** : avec de l'autocorrélation, $\sigma\sqrt{T}$ est faux ; il faut ajouter les covariances entre périodes.
:::

:::entretien Ce que l'intervieweur veut voir
Sur une question de type « nombre moyen de… », annonce tout de suite : « je l'écris comme une somme d'indicatrices et j'utilise la linéarité, qui ne demande pas l'indépendance ». Sur une variance, écris la formule de la variance d'une somme avant de calculer et dis explicitement quelles covariances sont nulles et pourquoi. Ces deux phrases montrent la méthode, même si le calcul déraille ensuite.
:::

## Pour aller plus loin

Le chapitre [[n:conditionnement-markov-martingales]] ajoute le second outil fondamental, le **conditionnement** (espérance totale, méthode du premier pas, martingales), qui résout les questions de temps d'attente et de jeux. Le chapitre [[n:lois-gaussiennes]] applique tout ceci aux vecteurs gaussiens, où la matrice de covariance décrit entièrement la loi.
