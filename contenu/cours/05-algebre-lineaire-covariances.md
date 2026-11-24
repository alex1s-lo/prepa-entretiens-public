---
titre: Algèbre linéaire des matrices de covariance
partie: Algèbre linéaire et statistiques
resume: Ce qu'il faut savoir faire avec une matrice de covariance : reconnaître une matrice valide (semi-définie positive), trouver les corrélations possibles, diagonaliser une matrice équicorrélée, factoriser par Cholesky, lire l'inverse (corrélations partielles, régressions), conditionner par le complément de Schur, analyser en composantes principales, et inverser vite un modèle à facteurs. Tout est démontré et relié aux portefeuilles.
duree: 3 h
fiches: proba-correlation-trois proba-correlation-xz stats-vol-portefeuille risque-diversification-limite stats-colinearite ml-pca ml-acp-variance stats-pca-taux stats-equicorrelation stats-cholesky
---
Au chapitre [[n:esperance-variance-covariance]], la covariance est une opération sur deux variables. Ici, on la regarde comme un **objet matriciel** : une matrice symétrique $\Sigma$ qui résume toutes les variances et covariances d'un vecteur aléatoire. C'est le langage des portefeuilles, des facteurs de risque, de la simulation corrélée et de l'ACP. Tu connais l'algèbre linéaire de prépa ; ce chapitre la met au service des covariances, et chaque résultat est démontré à partir d'une seule idée : **$w^\top\Sigma w$ est la variance de $w^\top X$**.

## La matrice de covariance

:::definition Matrice de covariance
Pour un vecteur aléatoire $X = (X_1, \dots, X_n)^\top$ de moyenne $\mu$ :
$$
\Sigma = \mathbb{E}\big[(X - \mu)(X - \mu)^\top\big], \qquad \Sigma_{ij} = \operatorname{Cov}(X_i, X_j).
$$
La **matrice de corrélation** est $R = D^{-1}\Sigma D^{-1}$ avec $D = \operatorname{diag}(\sigma_1, \dots, \sigma_n)$ : $R_{ij} = \rho_{ij}$, $R_{ii} = 1$.
:::

:::theoreme Les deux règles de calcul
Pour une matrice fixe $A$ (de taille $m \times n$) et un vecteur fixe $w$ :
$$
\operatorname{Var}(w^\top X) = w^\top\Sigma w, \qquad \operatorname{Var}(AX) = A\Sigma A^\top, \qquad \operatorname{Cov}(AX, BX) = A\Sigma B^\top.
$$
:::

:::preuve
$AX - \mathbb{E}[AX] = A(X - \mu)$, donc $\operatorname{Var}(AX) = \mathbb{E}\big[A(X - \mu)(X - \mu)^\top A^\top\big] = A\,\mathbb{E}\big[(X - \mu)(X - \mu)^\top\big]A^\top = A\Sigma A^\top$, par linéarité de l'espérance (les matrices fixes sortent). Le cas $A = w^\top$ (une ligne) donne la variance d'un portefeuille ([[fiche:stats-vol-portefeuille]]). C'est la bilinéarité du chapitre [[n:esperance-variance-covariance]], écrite une fois pour toutes.
:::

:::theoreme Une matrice de covariance est symétrique semi-définie positive
$\Sigma$ est symétrique et $w^\top\Sigma w \ge 0$ pour tout $w$. Réciproquement, toute matrice symétrique semi-définie positive est la matrice de covariance d'un vecteur gaussien.
:::

:::preuve
Symétrie : $\operatorname{Cov}(X_i, X_j) = \operatorname{Cov}(X_j, X_i)$. Positivité : $w^\top\Sigma w = \operatorname{Var}(w^\top X) \ge 0$. Réciproque : par le théorème spectral (ci-dessous), $\Sigma = Q\Lambda Q^\top$ avec $\Lambda \ge 0$ diagonale ; posons $\Sigma^{1/2} = Q\Lambda^{1/2}Q^\top$ et $X = \Sigma^{1/2}Z$ avec $Z \sim \mathcal{N}(0, I)$ : $\operatorname{Var}(X) = \Sigma^{1/2}I\,\Sigma^{1/2} = \Sigma$.
:::

:::intuition Défini ou seulement semi-défini ?
$\Sigma$ est **définie** positive (toutes ses valeurs propres sont $> 0$) si et seulement si aucune combinaison linéaire non triviale $w^\top X$ ($w \ne 0$) n'est presque sûrement constante. Une valeur propre nulle signale une **redondance** : un actif est une combinaison exacte des autres (par exemple un indice et tous ses composants). En finance, une valeur propre nulle dans une covariance de rendements, c'est un portefeuille sans risque construit avec des actifs risqués : si son rendement n'est pas le taux sans risque, c'est un arbitrage.
:::

## Reconnaître une matrice valide

:::theoreme Théorème spectral (rappel de prépa)
Une matrice réelle symétrique est diagonalisable dans une base orthonormée : $\Sigma = Q\Lambda Q^\top$, $Q^\top Q = I$, $\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$ réelle. Alors $\operatorname{tr}\Sigma = \sum\lambda_i$, $\det\Sigma = \prod\lambda_i$, et $\Sigma$ est semi-définie positive si et seulement si tous les $\lambda_i \ge 0$.
:::

:::preuve Du dernier point
Avec $u = Q^\top w$ (changement de base orthonormée), $w^\top\Sigma w = u^\top\Lambda u = \sum_i\lambda_iu_i^2$. C'est $\ge 0$ pour tout $u$ si et seulement si tous les $\lambda_i \ge 0$ (prendre $u$ égal à un vecteur de base pour le sens direct).
:::

:::propriete Critères pratiques
- **Taille 2** : $\begin{pmatrix}a & b\\ b & c\end{pmatrix}$ est semi-définie positive si et seulement si $a \ge 0$, $c \ge 0$ et $ac - b^2 \ge 0$. Pour une corrélation : $|\rho| \le 1$.
- **Critère de Sylvester** : $\Sigma$ est **définie** positive si et seulement si tous ses mineurs principaux dominants (déterminants des sous-matrices en haut à gauche) sont $> 0$. Attention : pour « semi-définie », il faut tous les mineurs principaux, pas seulement les dominants.
- **Taille 3, corrélations** : avec des $|\rho_{ij}| \le 1$, la matrice $R$ est valide si et seulement si
$$
\det R = 1 + 2\rho_{12}\rho_{13}\rho_{23} - \rho_{12}^2 - \rho_{13}^2 - \rho_{23}^2 \ge 0.
$$
:::

:::theoreme Les corrélations possibles ([[fiche:proba-correlation-xz]])
Si $\operatorname{corr}(X, Y) = a$ et $\operatorname{corr}(Y, Z) = b$, alors
$$
ab - \sqrt{(1 - a^2)(1 - b^2)} \;\le\; \operatorname{corr}(X, Z) \;\le\; ab + \sqrt{(1 - a^2)(1 - b^2)}.
$$
:::

:::preuve
Notons $c = \operatorname{corr}(X, Z)$. La condition $\det R \ge 0$ s'écrit, en ordonnant selon $c$ :
$$
1 + 2abc - a^2 - b^2 - c^2 \ge 0 \iff c^2 - 2ab\,c + (a^2 + b^2 - 1) \le 0.
$$
C'est un trinôme en $c$, négatif entre ses racines $c = ab \pm\sqrt{a^2b^2 - a^2 - b^2 + 1} = ab \pm\sqrt{(1 - a^2)(1 - b^2)}$. Les mineurs de taille 2 imposent seulement $|a|, |b|, |c| \le 1$, déjà vérifié dans cet intervalle.

**Lecture** : avec $a = b = 0{,}9$, $c \ge 0{,}81 - 0{,}19 = 0{,}62$. Une forte corrélation ne se « transmet » que partiellement : $X$ et $Z$ peuvent n'être corrélés qu'à 0,62. Avec $a = b = 0{,}5$, $c \in [-0{,}5 ; 1]$ : la corrélation n'est pas transitive.
:::

:::exercice ex-al-rho-min
reponse: 0.63-sqrt(0.19*0.51)
tolerance: 0.001
$\operatorname{corr}(X, Y) = 0{,}9$ et $\operatorname{corr}(X, Z) = 0{,}7$. Quelle est la plus petite valeur possible de $\operatorname{corr}(Y, Z)$ ?
---
$0{,}9 \times 0{,}7 - \sqrt{(1 - 0{,}81)(1 - 0{,}49)} = 0{,}63 - \sqrt{0{,}0969} \approx 0{,}63 - 0{,}311 = 0{,}319$. Même si $Y$ et $Z$ suivent tous deux $X$ de près, leur corrélation peut tomber à 0,32.
:::

:::widget correlations
:::

## La matrice équicorrélée

:::theoreme Valeurs propres d'une matrice équicorrélée
La matrice $n \times n$ avec des 1 sur la diagonale et $\rho$ partout ailleurs s'écrit $R = (1 - \rho)I + \rho\,\mathbf{1}\mathbf{1}^\top$. Ses valeurs propres sont
- $1 + (n - 1)\rho$, de vecteur propre $\mathbf{1} = (1, \dots, 1)^\top$ (le « mode marché ») ;
- $1 - \rho$, de multiplicité $n - 1$, pour tous les vecteurs orthogonaux à $\mathbf{1}$ (les « écarts » entre actifs).
:::

:::preuve
$R\mathbf{1} = (1 - \rho)\mathbf{1} + \rho\,\mathbf{1}(\mathbf{1}^\top\mathbf{1}) = (1 - \rho + n\rho)\mathbf{1}$. Si $v \perp \mathbf{1}$, alors $\mathbf{1}^\top v = 0$ et $Rv = (1 - \rho)v$. L'espace orthogonal à $\mathbf{1}$ est de dimension $n - 1$ : on a toutes les valeurs propres.
:::

:::propriete Conséquences
1. **Corrélation minimale** : $R$ est valide si et seulement si $1 + (n - 1)\rho \ge 0$ et $1 - \rho \ge 0$, soit $-\frac{1}{n - 1} \le \rho \le 1$. Trois variables ne peuvent pas être deux à deux corrélées à moins de $-\frac12$ ([[fiche:proba-correlation-trois]]).
2. **Diversification** : si tous les actifs ont la même volatilité $\sigma$ ($\Sigma = \sigma^2R$), le portefeuille équipondéré $w = \frac1n\mathbf{1}$ a pour variance $\frac{\sigma^2}{n^2}\mathbf{1}^\top R\mathbf{1} = \frac{\sigma^2}{n}\big(1 + (n - 1)\rho\big) \to \rho\sigma^2$ : c'est la limite de la diversification ([[fiche:risque-diversification-limite]]), lue comme la valeur propre du mode marché.
3. **ACP** : si $\rho \ge 0$, la première composante (le mode marché) explique $\frac{1 + (n - 1)\rho}{n}$ de la variance totale, environ $\rho$ quand $n$ est grand. Sur des actions, on observe une grande valeur propre isolée : le marché.
:::

:::exercice ex-al-equicorrelation
reponse: 0.46
tolerance: 0.001
Dix actifs ont des rendements standardisés, deux à deux corrélés à 0,4. Quelle part de la variance totale la première composante principale explique-t-elle ?
---
$\lambda_1 = 1 + 9 \times 0{,}4 = 4{,}6$ et la variance totale est $\operatorname{tr}R = 10$ : $46\,\%$. Les neuf autres composantes se partagent le reste à parts égales ($0{,}6$ chacune).
:::

## La factorisation de Cholesky

:::theoreme Cholesky
Toute matrice symétrique **définie** positive s'écrit de façon unique $\Sigma = LL^\top$ avec $L$ triangulaire inférieure à diagonale strictement positive.
:::

:::methode Calculer $L$ colonne par colonne
On identifie les coefficients de $LL^\top$ avec ceux de $\Sigma$, dans l'ordre :
$$
L_{11} = \sqrt{\Sigma_{11}}, \qquad L_{i1} = \frac{\Sigma_{i1}}{L_{11}}, \qquad L_{jj} = \sqrt{\Sigma_{jj} - \sum_{k<j}L_{jk}^2}, \qquad L_{ij} = \frac{\Sigma_{ij} - \sum_{k<j}L_{ik}L_{jk}}{L_{jj}} \ (i > j).
$$
Si une quantité sous la racine est négative ou nulle, la matrice n'est pas définie positive : **Cholesky est le test de positivité le moins cher** ($\approx n^3/3$ opérations).
:::

:::exemple Une matrice $3 \times 3$ à la main
$\Sigma = \begin{pmatrix}4 & 2 & 2\\ 2 & 5 & 3\\ 2 & 3 & 6\end{pmatrix}$.
- Colonne 1 : $L_{11} = \sqrt4 = 2$, $L_{21} = 2/2 = 1$, $L_{31} = 2/2 = 1$.
- Colonne 2 : $L_{22} = \sqrt{5 - 1^2} = 2$, $L_{32} = \frac{3 - 1 \times 1}{2} = 1$.
- Colonne 3 : $L_{33} = \sqrt{6 - 1^2 - 1^2} = 2$.
Donc $L = \begin{pmatrix}2 & 0 & 0\\ 1 & 2 & 0\\ 1 & 1 & 2\end{pmatrix}$. Vérification : la ligne 3 de $LL^\top$ vaut $(2, 1 + 2, 1 + 1 + 4) = (2, 3, 6)$. ✓
:::

:::propriete Pourquoi on s'en sert
- **Simuler** $X \sim \mathcal{N}(\mu, \Sigma)$ : $X = \mu + LZ$ avec $Z \sim \mathcal{N}(0, I)$ (chapitre [[n:methodes-numeriques]]).
- **Lecture** : $X_1 = L_{11}Z_1$ ; $X_2 = L_{21}Z_1 + L_{22}Z_2$, où $L_{21}Z_1$ est la partie de $X_2$ expliquée par $X_1$ et $L_{22}Z_2$ sa partie propre. Cholesky est une **orthogonalisation de Gram-Schmidt** des variables : $L_{jj}^2$ est la variance de $X_j$ non expliquée par $X_1, \dots, X_{j-1}$.
- **Résoudre** $\Sigma x = b$ par deux systèmes triangulaires, plus stable que d'inverser.
:::

:::exercice ex-al-cholesky
reponse: 3
Factorisation de Cholesky de $\Sigma = \begin{pmatrix}9 & 3 & 6\\ 3 & 5 & 4\\ 6 & 4 & 14\end{pmatrix}$ : que vaut $L_{33}$ ?
---
$L_{11} = 3$, $L_{21} = 1$, $L_{31} = 2$ ; $L_{22} = \sqrt{5 - 1} = 2$, $L_{32} = \frac{4 - 1 \times 2}{2} = 1$ ; $L_{33} = \sqrt{14 - 2^2 - 1^2} = 3$. La variance de $X_3$ non expliquée par $X_1$ et $X_2$ vaut donc $9$ sur $14$.
:::

## L'inverse : régressions et corrélations partielles

:::theoreme Ce que contient la matrice de précision $P = \Sigma^{-1}$
Pour un vecteur gaussien (ou, plus généralement, pour les meilleures prédictions linéaires) :
1. $\dfrac{1}{P_{ii}}$ est la **variance résiduelle** de $X_i$ régressé sur toutes les autres variables ;
2. le coefficient de $X_j$ dans cette régression vaut $-\dfrac{P_{ij}}{P_{ii}}$ ;
3. la **corrélation partielle** de $X_i$ et $X_j$ sachant toutes les autres vaut $-\dfrac{P_{ij}}{\sqrt{P_{ii}P_{jj}}}$. En particulier, $P_{ij} = 0$ signifie que $X_i$ et $X_j$ sont **conditionnellement** non corrélées (indépendantes, dans le cas gaussien).
:::

:::preuve Des points 1 et 2, par blocs
Écrivons $X = (X_1, X_2)$ avec $X_1$ scalaire et $X_2$ le reste, et $\Sigma = \begin{pmatrix}a & b^\top\\ b & C\end{pmatrix}$. La régression de $X_1$ sur $X_2$ (chapitre [[n:statistiques-et-regression]], en population) a pour coefficients $\beta = C^{-1}b$ et pour variance résiduelle
$$
s = \operatorname{Var}(X_1 - \beta^\top X_2) = a - 2\beta^\top b + \beta^\top C\beta = a - b^\top C^{-1}b,
$$
le **complément de Schur** de $C$. La formule d'inversion par blocs (vérifiable en multipliant) donne $P_{11} = \frac1s$ et la première ligne de $P$ hors diagonale $-\frac1s\,b^\top C^{-1} = -P_{11}\beta^\top$. D'où $\frac{1}{P_{11}} = s$ et $\beta_j = -\frac{P_{1j}}{P_{11}}$.
:::

:::propriete Le cas de deux variables
$\Sigma = \begin{pmatrix}\sigma_1^2 & \rho\sigma_1\sigma_2\\ \rho\sigma_1\sigma_2 & \sigma_2^2\end{pmatrix}$, $\Sigma^{-1} = \dfrac{1}{\sigma_1^2\sigma_2^2(1 - \rho^2)}\begin{pmatrix}\sigma_2^2 & -\rho\sigma_1\sigma_2\\ -\rho\sigma_1\sigma_2 & \sigma_1^2\end{pmatrix}$. On retrouve $\frac{1}{P_{11}} = \sigma_1^2(1 - \rho^2)$ (la variance non expliquée de la couverture de variance minimale, chapitre [[n:risque-et-portefeuille]]) et le coefficient $\rho\frac{\sigma_1}{\sigma_2}$ (le bêta). Quand $\rho \to \pm1$, le déterminant s'annule et l'inverse explose : c'est la colinéarité ([[fiche:stats-colinearite]]).
:::

:::exercice ex-al-residuelle
reponse: 8/3
$\operatorname{Var}(X_1) = 4$, $\operatorname{Var}(X_2) = 3$, $\operatorname{Cov}(X_1, X_2) = 2$. Variance résiduelle de $X_1$ après régression sur $X_2$ ? Vérifie avec $1/(\Sigma^{-1})_{11}$.
---
Complément de Schur : $4 - \frac{2^2}{3} = \frac83$. Avec l'inverse : $\det\Sigma = 12 - 4 = 8$, $(\Sigma^{-1})_{11} = \frac38$, et $\frac{1}{3/8} = \frac83$. ✓
:::

:::exercice ex-al-partielle
reponse: 1/3
Trois variables standardisées, deux à deux corrélées à 0,5. Quelle est la corrélation partielle de $X_1$ et $X_2$ sachant $X_3$ ?
---
Formule pour trois variables : $\rho_{12 \cdot 3} = \frac{\rho_{12} - \rho_{13}\rho_{23}}{\sqrt{(1 - \rho_{13}^2)(1 - \rho_{23}^2)}} = \frac{0{,}5 - 0{,}25}{0{,}75} = \frac13$. Une fois l'effet commun de $X_3$ retiré (par exemple le marché), il reste une corrélation de $\frac13$. On retrouve la même valeur avec $-P_{12}/\sqrt{P_{11}P_{22}}$.
:::

:::propriete Complément de Schur et lois conditionnelles gaussiennes
Si $(X_1, X_2)$ est gaussien, $X_1 \mid X_2 = x_2 \sim \mathcal{N}\big(\mu_1 + \Sigma_{12}\Sigma_{22}^{-1}(x_2 - \mu_2),\ \Sigma_{11} - \Sigma_{12}\Sigma_{22}^{-1}\Sigma_{21}\big)$. C'est exactement la régression ci-dessus : la variance conditionnelle est le complément de Schur, et elle **ne dépend pas** de la valeur observée $x_2$ (chapitre [[n:lois-gaussiennes]]).
:::

## Décomposition spectrale et ACP

:::theoreme Composantes principales
Si $\Sigma = Q\Lambda Q^\top$ avec $\lambda_1 \ge \dots \ge \lambda_n$, les variables $Y = Q^\top(X - \mu)$ sont **non corrélées**, de variances $\lambda_1, \dots, \lambda_n$, et la direction unitaire de variance maximale est la première colonne de $Q$.
:::

:::preuve
$\operatorname{Var}(Q^\top X) = Q^\top\Sigma Q = Q^\top Q\Lambda Q^\top Q = \Lambda$, diagonale. Pour $\|v\| = 1$, $v^\top\Sigma v = \sum_i\lambda_iu_i^2$ avec $u = Q^\top v$ de norme 1, donc $\le \lambda_1$, avec égalité pour $v = q_1$. (Démonstration équivalente par le lagrangien au chapitre [[n:machine-learning]].)
:::

:::propriete En pratique
- **Covariance ou corrélation ?** Sur la covariance, les actifs les plus volatils dominent les premières composantes ; sur la corrélation (variables standardisées), toutes pèsent pareil. Pour des rendements d'actions de volatilités différentes, on travaille souvent sur la corrélation.
- **Courbe des taux** : niveau, pente, courbure ([[fiche:stats-pca-taux]]).
- **Conditionnement** $\kappa = \lambda_{\max}/\lambda_{\min}$ : il mesure à quel point $\Sigma^{-1}$ amplifie les erreurs. Une matrice de corrélation $2 \times 2$ avec $\rho = 0{,}99$ a $\kappa = \frac{1{,}99}{0{,}01} = 199$ : une erreur de 1 % sur les données peut devenir une erreur de 200 % sur les poids de Markowitz.
:::

:::exercice ex-al-conditionnement
reponse: 199
Quel est le conditionnement de la matrice de corrélation $\begin{pmatrix}1 & 0{,}99\\ 0{,}99 & 1\end{pmatrix}$ ?
---
Valeurs propres $1 \pm 0{,}99$ (vecteurs $(1, 1)$ et $(1, -1)$, cas $n = 2$ de la matrice équicorrélée) : $\kappa = \frac{1{,}99}{0{,}01} = 199$.
:::

:::attention Les covariances estimées sont bruitées
Avec $n$ actifs et $T$ observations, la covariance empirique a $\frac{n(n+1)}{2}$ paramètres estimés sur $nT$ nombres. Quand $n/T$ n'est pas petit, ses valeurs propres sont très dispersées même si la vraie matrice est l'identité : selon la loi de Marchenko-Pastur, elles s'étalent entre $(1 - \sqrt{n/T})^2$ et $(1 + \sqrt{n/T})^2$. Avec 500 actions et deux ans de données quotidiennes ($T = 500$), la plus petite valeur propre estimée est proche de 0 : l'optimiseur de Markowitz s'y engouffre. Remèdes : **rétrécissement** $\hat\Sigma = (1 - \delta)S + \delta F$ vers une cible simple $F$ (Ledoit-Wolf), modèles à facteurs, nettoyage des valeurs propres de la zone de bruit.
:::

:::methode Réparer une matrice de corrélation invalide
Quand on modifie des corrélations à la main (scénario de stress, données manquantes), la matrice peut perdre sa positivité. Recette simple : diagonaliser, remplacer les valeurs propres négatives par un petit $\varepsilon > 0$, reconstruire, puis renormaliser pour remettre des 1 sur la diagonale. Plus rigoureux : la matrice de corrélation valide la plus proche (algorithme de Higham).
:::

## Modèles à facteurs

:::definition Modèle à facteurs
$X = Bf + \varepsilon$, avec $k$ facteurs $f$ de covariance $F$ ($k \ll n$), des expositions $B$ ($n \times k$) et des résidus $\varepsilon$ non corrélés entre eux et aux facteurs, de variances $D = \operatorname{diag}(d_1, \dots, d_n)$. Alors $\Sigma = BFB^\top + D$. Pour un seul facteur (le marché) : $\Sigma = \sigma_m^2\beta\beta^\top + D$.
:::

:::theoreme Formule de Sherman-Morrison
Pour $D$ inversible et un vecteur $b$ tels que $1 + b^\top D^{-1}b \ne 0$ (toujours vrai si $D$ est définie positive, par exemple une matrice de variances résiduelles) : $(D + bb^\top)^{-1} = D^{-1} - \dfrac{D^{-1}bb^\top D^{-1}}{1 + b^\top D^{-1}b}$.
:::

:::preuve
On multiplie : $(D + bb^\top)\Big(D^{-1} - \frac{D^{-1}bb^\top D^{-1}}{1 + c}\Big)$ avec $c = b^\top D^{-1}b$, ce qui donne $I + bb^\top D^{-1} - \frac{bb^\top D^{-1} + b\,c\,b^\top D^{-1}}{1 + c} = I + bb^\top D^{-1} - \frac{(1 + c)\,bb^\top D^{-1}}{1 + c} = I$.

**Intérêt** : inverser la covariance d'un modèle à un facteur sur 3 000 actions ne demande que des divisions par les $d_i$ et un produit scalaire, au lieu d'une inversion $3\,000 \times 3\,000$ (la version à $k$ facteurs est la formule de Woodbury). Et comme $bb^\top$ est semi-définie positive, toutes les valeurs propres de $\Sigma$ sont $\ge \min_i d_i$ : l'inverse reste borné, sans petite valeur propre de bruit, tant que les $d_i$ ne sont pas trop petits.
:::

:::exercice ex-al-woodbury
reponse: 0.8
$\Sigma = I + bb^\top$ en dimension 4, avec $b = (1, 1, 1, 1)^\top$. Que vaut $(\Sigma^{-1})_{11}$ ?
---
Sherman-Morrison avec $D = I$ : $\Sigma^{-1} = I - \frac{bb^\top}{1 + 4}$, donc $(\Sigma^{-1})_{11} = 1 - \frac15 = 0{,}8$. Variance résiduelle de $X_1$ sachant les trois autres : $\frac{1}{0{,}8} = 1{,}25$, à comparer à $\operatorname{Var}(X_1) = 2$.
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Proposer une matrice de corrélation sans vérifier qu'elle est semi-définie positive (en particulier en stress test).
- Croire que la corrélation est transitive.
- Utiliser le critère des mineurs dominants pour la semi-définie positivité (il ne vaut que pour la définie positivité).
- Inverser une matrice presque singulière sans regarder son conditionnement.
- Faire une ACP sur des covariances d'actifs de volatilités très différentes sans se demander si la corrélation serait plus pertinente.
- Confondre la corrélation partielle (sachant les autres) et la corrélation simple.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Cette matrice peut-elle être une matrice de corrélation ? »** Symétrie, diagonale de 1, positivité : déterminant en taille 3, valeurs propres, ou Cholesky.
- **« corr(X, Y) = corr(Y, Z) = 0,9 : bornes sur corr(X, Z) ? »** Le trinôme issu de $\det R \ge 0$.
- **« Corrélation minimale de $n$ variables équicorrélées ? »** $-\frac1{n-1}$ par les valeurs propres de $(1 - \rho)I + \rho\mathbf{1}\mathbf{1}^\top$.
- **« Comment simuler des gaussiennes corrélées ? »** Cholesky, et la preuve $\operatorname{Var}(LZ) = LL^\top$.
- **« Que représente l'inverse d'une covariance ? »** Variances résiduelles, coefficients de régression, corrélations partielles.
- **« Pourquoi Markowitz donne-t-il des poids absurdes ? »** Conditionnement, petites valeurs propres bruitées, rétrécissement.
:::
