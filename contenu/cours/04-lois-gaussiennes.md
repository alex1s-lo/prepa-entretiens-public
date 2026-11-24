---
titre: Loi normale, log-normale et vecteurs gaussiens
partie: Probabilités
resume: Tous les calculs gaussiens dont tu auras besoin ensuite : moments, transformée de Laplace, espérances tronquées, loi log-normale (les deux intégrales de Black-Scholes, faites à l'avance), vecteurs gaussiens, conditionnement, quadrants et théorème central limite.
duree: 3 h
fiches: proba-normale-positive proba-max-normales proba-quadrant-normal proba-somme-normales-positive stoch-moment-quatre stoch-esperance-exponentielle stoch-esperance-gbm stoch-mediane-gbm stoch-proba-au-dessus der-option-carre der-digitale-prix taux-es-gaussienne taux-var-normale cst-n-1 cst-quantile-975 cst-quantile-99 cst-densite-zero proba-correlation-xz stoch-deux-instants-positifs stoch-pont-esperance stoch-pont-variance
---
Le mouvement brownien est une famille de variables gaussiennes ; le prix d'une action dans Black-Scholes est une exponentielle de gaussienne. Presque tous les calculs du calcul stochastique et du pricing se ramènent donc à **quelques intégrales gaussiennes**. Ce chapitre les fait toutes, une fois pour toutes, en détail. Si tu maîtrises les sections « compléter le carré » et « log-normale », la démonstration de Black-Scholes du chapitre [[n:black-scholes]] ne sera plus qu'une application.

## La loi normale

:::definition Loi normale
$Z \sim \mathcal{N}(0, 1)$ a pour densité $\varphi(z) = \dfrac{1}{\sqrt{2\pi}}e^{-z^2/2}$ et pour fonction de répartition $\Phi(x) = \int_{-\infty}^x \varphi(z)\,dz$ (notée aussi $N(x)$ en finance). Pour $\mu \in \mathbb{R}$ et $\sigma > 0$, $X = \mu + \sigma Z \sim \mathcal{N}(\mu, \sigma^2)$, de densité $\frac{1}{\sigma}\varphi\!\left(\frac{x - \mu}{\sigma}\right)$.
:::

:::theoreme L'intégrale de Gauss
$$
\int_{-\infty}^{+\infty} e^{-z^2/2}\,dz = \sqrt{2\pi}.
$$
:::

:::preuve
Soit $I$ l'intégrale. On calcule $I^2$ comme une intégrale double et on passe en coordonnées polaires ($dx\,dy = r\,dr\,d\theta$) :
$$
I^2 = \iint_{\mathbb{R}^2} e^{-(x^2 + y^2)/2}\,dx\,dy = \int_0^{2\pi}\!\!\int_0^{\infty} e^{-r^2/2}\,r\,dr\,d\theta = 2\pi\left[-e^{-r^2/2}\right]_0^\infty = 2\pi.
$$
Le facteur $r$ du changement de variables rend l'intégrale calculable : c'est toute l'astuce.
:::

:::exemple Symétries et valeurs à connaître
$\varphi$ est paire, donc $\Phi(-x) = 1 - \Phi(x)$ et $\mathbb{P}(\lvert Z\rvert \le x) = 2\Phi(x) - 1$. Valeurs : $\Phi(1) \approx 0{,}841$, $\Phi(1{,}645) = 0{,}95$, $\Phi(1{,}96) = 0{,}975$, $\Phi(2{,}326) = 0{,}99$ ; $\varphi(0) = 1/\sqrt{2\pi} \approx 0{,}399$. D'où la règle 68 % / 95 % / 99,7 % à 1, 2, 3 écarts-types. Fiches : [[fiche:cst-n-1]], [[fiche:cst-quantile-975]], [[fiche:cst-densite-zero]].
:::

:::theoreme Moments de la loi normale centrée réduite
$\mathbb{E}[Z^{2k+1}] = 0$ et $\mathbb{E}[Z^{2k}] = (2k-1)(2k-3)\cdots 3 \cdot 1$. En particulier $\mathbb{E}[Z^2] = 1$, $\mathbb{E}[Z^4] = 3$, $\mathbb{E}[Z^6] = 15$.
:::

:::preuve
Les moments impairs sont nuls par symétrie. Pour les pairs, on remarque que $\varphi'(z) = -z\varphi(z)$ et on intègre par parties :
$$
\mathbb{E}[Z^{2k}] = \int z^{2k-1}\,\big(z\varphi(z)\big)\,dz = \Big[-z^{2k-1}\varphi(z)\Big]_{-\infty}^{+\infty} + (2k-1)\int z^{2k-2}\varphi(z)\,dz = (2k-1)\,\mathbb{E}[Z^{2k-2}].
$$
Le crochet est nul car $\varphi$ décroît plus vite que tout polynôme. On conclut par récurrence à partir de $\mathbb{E}[Z^0] = 1$.
:::

Pour $X \sim \mathcal{N}(0, \sigma^2)$ : $\mathbb{E}[X^4] = 3\sigma^4$. L'**aplatissement** (kurtosis) d'une gaussienne vaut donc 3 ; les rendements financiers ont un aplatissement bien supérieur (queues épaisses). Appliqué à $W_t \sim \mathcal{N}(0, t)$ : $\mathbb{E}[W_t^4] = 3t^2$ ([[fiche:stoch-moment-quatre]]).

:::exercice ex-moment-six
reponse: 15
Calcule $\mathbb{E}[Z^6]$ pour $Z \sim \mathcal{N}(0,1)$ avec la récurrence de la démonstration. (Bonus, non vérifié : $\mathbb{E}[W_2^6]$ pour un mouvement brownien.)
---
$\mathbb{E}[Z^6] = 5 \times \mathbb{E}[Z^4] = 5 \times 3 = 15$. Et $W_2 = \sqrt2\,Z$ en loi, donc $\mathbb{E}[W_2^6] = 2^3 \times 15 = 120$.
:::

## Compléter le carré : la transformée de Laplace

C'est le calcul le plus important du chapitre : il revient dans la loi log-normale, dans les martingales exponentielles, dans Girsanov et dans Black-Scholes.

:::theoreme Transformée de Laplace d'une gaussienne
Pour $X \sim \mathcal{N}(\mu, \sigma^2)$ et tout réel $\theta$ :
$$
\mathbb{E}\big[e^{\theta X}\big] = e^{\theta\mu + \frac12\theta^2\sigma^2}.
$$
En particulier $\mathbb{E}[e^{\sigma Z}] = e^{\sigma^2/2}$ : l'espérance de l'exponentielle n'est **pas** l'exponentielle de l'espérance (inégalité de Jensen), il y a un terme de convexité $\sigma^2/2$.
:::

:::preuve Compléter le carré, ligne à ligne
Il suffit de traiter $Z \sim \mathcal{N}(0,1)$ et $\mathbb{E}[e^{tZ}]$, puis d'écrire $X = \mu + \sigma Z$ avec $t = \theta\sigma$.
$$
\mathbb{E}[e^{tZ}] = \frac{1}{\sqrt{2\pi}}\int e^{tz}e^{-z^2/2}\,dz = \frac{1}{\sqrt{2\pi}}\int e^{-\frac12(z^2 - 2tz)}\,dz.
$$
On complète le carré dans l'exposant : $z^2 - 2tz = (z - t)^2 - t^2$. Donc
$$
\mathbb{E}[e^{tZ}] = e^{t^2/2}\cdot\underbrace{\frac{1}{\sqrt{2\pi}}\int e^{-\frac12(z - t)^2}\,dz}_{=\,1 \text{ (densité de } \mathcal{N}(t,1))} = e^{t^2/2}.
$$
Enfin $\mathbb{E}[e^{\theta X}] = e^{\theta\mu}\,\mathbb{E}[e^{\theta\sigma Z}] = e^{\theta\mu + \theta^2\sigma^2/2}$.
:::

:::methode Le changement de probabilité caché dans ce calcul
Le même calcul dit plus : pour toute fonction $g$,
$$
\mathbb{E}\big[e^{tZ}\,g(Z)\big] = e^{t^2/2}\,\mathbb{E}\big[g(Z + t)\big].
$$
Multiplier par $e^{tZ - t^2/2}$ revient à **décaler la gaussienne de $t$**. Retiens cette identité : c'est la version à une variable du théorème de Girsanov (chapitre [[n:arbitrage-et-risque-neutre]]), et c'est elle qui fait apparaître $d_1 = d_2 + \sigma\sqrt T$ dans Black-Scholes.
:::

:::preuve De l'identité de décalage
$\mathbb{E}[e^{tZ}g(Z)] = \frac{1}{\sqrt{2\pi}}\int g(z)\,e^{t^2/2}e^{-\frac12(z-t)^2}\,dz$ (même complétion du carré), puis on pose $u = z - t$ : $= e^{t^2/2}\,\frac{1}{\sqrt{2\pi}}\int g(u + t)\,e^{-u^2/2}\,du = e^{t^2/2}\,\mathbb{E}[g(Z + t)]$.
:::

:::exercice ex-laplace
reponse: exp(1.125)
$X \sim \mathcal{N}(1 ; 0{,}25)$ (variance 0,25). Calcule $\mathbb{E}[e^X]$.
---
$\theta = 1$, $\mu = 1$, $\sigma^2 = 0{,}25$ : $\mathbb{E}[e^X] = e^{1 + 0{,}25/2} = e^{1{,}125} \approx 3{,}08$, alors que $e^{\mathbb{E}[X]} = e \approx 2{,}72$.
:::

## Espérances tronquées

Les payoffs d'options sont des fonctions « coupées » : $(X - K)^+$, $\mathbf{1}_{\{X > K\}}$. Voici les trois intégrales de base.

:::theoreme Trois intégrales tronquées
Pour $Z \sim \mathcal{N}(0, 1)$ et un réel $a$ :
$$
\text{(i)}\ \mathbb{P}(Z > a) = \Phi(-a), \qquad \text{(ii)}\ \mathbb{E}\big[Z\,\mathbf{1}_{\{Z > a\}}\big] = \varphi(a), \qquad \text{(iii)}\ \mathbb{E}\big[e^{tZ}\mathbf{1}_{\{Z > a\}}\big] = e^{t^2/2}\,\Phi(t - a).
$$
:::

:::preuve
(i) : symétrie. (ii) : comme $\varphi'(z) = -z\varphi(z)$, une primitive de $z\varphi(z)$ est $-\varphi(z)$ :
$$
\int_a^{\infty} z\varphi(z)\,dz = \big[-\varphi(z)\big]_a^\infty = \varphi(a).
$$
(iii) : identité de décalage avec $g = \mathbf{1}_{(a, \infty)}$ : $\mathbb{E}[e^{tZ}\mathbf{1}_{\{Z > a\}}] = e^{t^2/2}\,\mathbb{P}(Z + t > a) = e^{t^2/2}\,\mathbb{P}(Z > a - t) = e^{t^2/2}\,\Phi(t - a)$.
:::

:::exemple Conséquences immédiates
- $\mathbb{E}[Z \mid Z > 0] = \varphi(0)/\tfrac12 = \sqrt{2/\pi} \approx 0{,}80$, et $\mathbb{E}\lvert Z\rvert = \sqrt{2/\pi}$ ([[fiche:proba-normale-positive]]).
- **Expected shortfall** d'une perte gaussienne : $\mathbb{E}[Z \mid Z > q_\alpha] = \frac{\varphi(q_\alpha)}{1 - \alpha}$ ; à 97,5 %, $\varphi(1{,}96)/0{,}025 \approx 2{,}34$ ([[fiche:taux-es-gaussienne]]).
- **Formule de Bachelier** : si $X \sim \mathcal{N}(m, s^2)$, alors
$$
\mathbb{E}\big[(X - K)^+\big] = (m - K)\,\Phi\!\left(\frac{m - K}{s}\right) + s\,\varphi\!\left(\frac{m - K}{s}\right).
$$
Démonstration : $X - K = s(Z - a)$ avec $a = \frac{K - m}{s}$, donc $\mathbb{E}[(X - K)^+] = s\,\mathbb{E}[(Z - a)\mathbf{1}_{\{Z > a\}}] = s\big(\varphi(a) - a\,\Phi(-a)\big)$, et $\varphi(a) = \varphi(-a)$. À la monnaie ($m = K$) : $s\,\varphi(0) \approx 0{,}4\,s$. C'est l'origine de l'approximation $C \approx 0{,}4\,\sigma S\sqrt T$.
:::

:::exercice ex-bachelier
reponse: phi(0.5)-0.5*(1-N(0.5))
tolerance: 0.002
$X \sim \mathcal{N}(0, 1)$. Calcule $\mathbb{E}[(X - 0{,}5)^+]$.
---
Avec $a = 0{,}5$ : $\mathbb{E}[(Z - a)^+] = \varphi(a) - a\,\Phi(-a) = \varphi(0{,}5) - 0{,}5\,(1 - \Phi(0{,}5)) \approx 0{,}3521 - 0{,}5 \times 0{,}3085 \approx 0{,}198$.
:::

## La loi log-normale

:::definition Loi log-normale
$S$ est log-normale si $\ln S \sim \mathcal{N}(m, s^2)$, c'est-à-dire $S = e^{m + sZ}$. C'est la loi de $S_T$ dans Black-Scholes : $S_T = S_0 \exp\big((\mu - \tfrac{\sigma^2}{2})T + \sigma W_T\big)$, soit $m = \ln S_0 + (\mu - \sigma^2/2)T$ et $s = \sigma\sqrt T$.
:::

:::theoreme Moments, médiane et probabilités
$$
\mathbb{E}[S] = e^{m + s^2/2}, \qquad \operatorname{Var}(S) = e^{2m + s^2}\big(e^{s^2} - 1\big), \qquad \text{méd}(S) = e^{m} < \mathbb{E}[S],
$$
$$
\mathbb{P}(S > K) = \Phi\!\left(\frac{m - \ln K}{s}\right), \qquad \mathbb{E}\big[S\,\mathbf{1}_{\{S > K\}}\big] = e^{m + s^2/2}\,\Phi\!\left(\frac{m - \ln K}{s} + s\right).
$$
:::

:::preuve
Moments : transformée de Laplace avec $\theta = 1$ puis $\theta = 2$ : $\mathbb{E}[S^2] = e^{2m + 2s^2}$, donc $\operatorname{Var}(S) = e^{2m + 2s^2} - e^{2m + s^2}$. Médiane : $\ln$ est croissante, donc la médiane de $S$ est l'exponentielle de celle de $\ln S$, soit $e^m$.

Probabilité : $\{S > K\} = \{m + sZ > \ln K\} = \{Z > a\}$ avec $a = \frac{\ln K - m}{s}$, de probabilité $\Phi(-a) = \Phi\big(\frac{m - \ln K}{s}\big)$.

Espérance tronquée : $S\,\mathbf{1}_{\{S > K\}} = e^m\,e^{sZ}\mathbf{1}_{\{Z > a\}}$, et l'intégrale (iii) avec $t = s$ donne $e^m e^{s^2/2}\Phi(s - a)$.
:::

:::exemple Les deux intégrales de Black-Scholes, déjà faites
Taux nul pour simplifier, $S_T = S_0 e^{-\sigma^2 T/2 + \sigma\sqrt T Z}$, soit $m = \ln S_0 - \sigma^2 T/2$ et $s = \sigma\sqrt T$. Posons
$$
d_2 = \frac{m - \ln K}{s} = \frac{\ln(S_0/K) - \sigma^2T/2}{\sigma\sqrt T}, \qquad d_1 = d_2 + \sigma\sqrt T = \frac{\ln(S_0/K) + \sigma^2T/2}{\sigma\sqrt T}.
$$
Alors $\mathbb{P}(S_T > K) = \Phi(d_2)$ et $\mathbb{E}[S_T\mathbf{1}_{\{S_T > K\}}] = e^{m + s^2/2}\Phi(d_1) = S_0\,\Phi(d_1)$. Donc
$$
\mathbb{E}\big[(S_T - K)^+\big] = \mathbb{E}\big[S_T\mathbf{1}_{\{S_T > K\}}\big] - K\,\mathbb{P}(S_T > K) = S_0\,\Phi(d_1) - K\,\Phi(d_2).
$$
C'est la formule de Black-Scholes à taux nul. Il ne reste au chapitre [[n:black-scholes]] qu'à justifier **pourquoi** on calcule cette espérance (sous la probabilité risque-neutre) et à ajouter l'actualisation. Fiches liées : [[fiche:stoch-esperance-gbm]], [[fiche:stoch-mediane-gbm]], [[fiche:stoch-proba-au-dessus]], [[fiche:der-digitale-prix]], [[fiche:der-option-carre]].
:::

:::attention Espérance contre médiane
Avec dérive nulle ($\mu = 0$), $\mathbb{E}[S_T] = S_0$ mais la médiane vaut $S_0 e^{-\sigma^2 T/2} < S_0$, et $\mathbb{P}(S_T > S_0) = \Phi(-\sigma\sqrt T/2) < 1/2$. La plupart des trajectoires finissent sous $S_0$, quelques-unes très au-dessus. Quand $T \to \infty$, $S_T \to 0$ presque sûrement alors que $\mathbb{E}[S_T] = S_0$ : l'espérance est portée par des événements de plus en plus rares.
:::

:::exercice ex-lognormale-proba
reponse: 1-N((ln(1.1)+0.02)/0.2)
tolerance: 0.003
Une action vaut 100 aujourd'hui, avec $\ln S_1 \sim \mathcal{N}(\ln 100 - 0{,}02 ;\ 0{,}04)$ (volatilité 20 %, dérive nulle). Probabilité que $S_1 > 110$ ?
---
$m = \ln 100 - 0{,}02$, $s = 0{,}2$. $\mathbb{P}(S_1 > 110) = \Phi\left(\frac{m - \ln 110}{s}\right) = \Phi\left(\frac{-\ln 1{,}1 - 0{,}02}{0{,}2}\right) = 1 - \Phi\left(\frac{\ln 1{,}1 + 0{,}02}{0{,}2}\right) = 1 - \Phi(0{,}577) \approx 0{,}282$.
:::

## Vecteurs gaussiens

:::definition Vecteur gaussien
$X = (X_1, \dots, X_n)$ est un vecteur gaussien si **toute combinaison linéaire** $a_1X_1 + \dots + a_nX_n$ suit une loi normale (éventuellement dégénérée, de variance nulle). Sa loi est entièrement déterminée par sa moyenne $\mu$ et sa matrice de covariance $\Sigma$ : on note $X \sim \mathcal{N}(\mu, \Sigma)$.
:::

:::theoreme Propriétés fondamentales
1. **Transformation affine** : si $X \sim \mathcal{N}(\mu, \Sigma)$, alors $AX + b \sim \mathcal{N}(A\mu + b, A\Sigma A^\top)$.
2. **Indépendance** : les composantes d'un vecteur **gaussien** sont indépendantes si et seulement si elles sont non corrélées ($\Sigma$ diagonale).
3. **Construction** : si $Z$ a des composantes $\mathcal{N}(0,1)$ indépendantes et $\Sigma = LL^\top$ (Cholesky), alors $\mu + LZ \sim \mathcal{N}(\mu, \Sigma)$.
:::

:::preuve
1. Une combinaison linéaire de $AX + b$ est une combinaison linéaire de $X$ plus une constante, donc gaussienne ; moyenne et covariance se calculent comme au chapitre [[n:esperance-variance-covariance]].
2. Pour un vecteur gaussien, la fonction caractéristique vaut $\mathbb{E}[e^{i u^\top X}] = e^{iu^\top\mu - \frac12 u^\top\Sigma u}$ (c'est la transformée de Laplace de la variable gaussienne $u^\top X$). Si $\Sigma$ est diagonale, $u^\top\Sigma u = \sum u_k^2\sigma_k^2$ et la fonction caractéristique se factorise en produit de celles des composantes : c'est l'indépendance.
3. Conséquence de 1 : $LZ$ a pour covariance $L\,I\,L^\top = \Sigma$.
:::

:::attention Être gaussien composante par composante ne suffit pas
Soit $X \sim \mathcal{N}(0,1)$ et $\varepsilon = \pm 1$ avec probabilité $1/2$, indépendant de $X$. $Y = \varepsilon X$ est encore $\mathcal{N}(0,1)$, et $\operatorname{Cov}(X, Y) = \mathbb{E}[\varepsilon]\,\mathbb{E}[X^2] = 0$. Pourtant $\lvert Y\rvert = \lvert X\rvert$ : elles sont très dépendantes. Il n'y a pas de contradiction : $(X, Y)$ n'est pas un vecteur gaussien ($X + Y$ vaut 0 avec probabilité $1/2$). « Non corrélées donc indépendantes » exige un vecteur **conjointement** gaussien.
:::

:::exemple Construire deux gaussiennes corrélées (Cholesky en dimension 2)
Pour obtenir $(X, Y)$ réduites de corrélation $\rho$ à partir de $Z_1, Z_2$ indépendantes :
$$
X = Z_1, \qquad Y = \rho Z_1 + \sqrt{1 - \rho^2}\,Z_2.
$$
Vérification : $\operatorname{Var}(Y) = \rho^2 + (1 - \rho^2) = 1$ et $\operatorname{Cov}(X, Y) = \rho\operatorname{Var}(Z_1) = \rho$. C'est la factorisation $\begin{pmatrix} 1 & \rho \\ \rho & 1\end{pmatrix} = \begin{pmatrix} 1 & 0 \\ \rho & \sqrt{1-\rho^2}\end{pmatrix}\begin{pmatrix} 1 & \rho \\ 0 & \sqrt{1-\rho^2}\end{pmatrix}$. C'est ainsi qu'on simule des actifs corrélés en Monte-Carlo (widget du chapitre [[n:esperance-variance-covariance]]).
:::

## Conditionner un vecteur gaussien

:::theoreme Loi conditionnelle gaussienne
Si $(X, Y)$ est un vecteur gaussien, alors sachant $X = x$, $Y$ est gaussienne de paramètres
$$
\mathbb{E}[Y \mid X = x] = \mu_Y + \frac{\operatorname{Cov}(X, Y)}{\operatorname{Var}(X)}(x - \mu_X), \qquad \operatorname{Var}(Y \mid X = x) = (1 - \rho^2)\,\sigma_Y^2.
$$
L'espérance conditionnelle est **affine** en $x$ (c'est la droite de régression du chapitre [[n:esperance-variance-covariance]]) et la variance conditionnelle **ne dépend pas de $x$**.
:::

:::preuve Par décomposition orthogonale
Posons $\beta = \operatorname{Cov}(X, Y)/\operatorname{Var}(X)$ et $\varepsilon = Y - \mu_Y - \beta(X - \mu_X)$. Le couple $(X, \varepsilon)$ est gaussien (transformation linéaire de $(X, Y)$), et
$$
\operatorname{Cov}(X, \varepsilon) = \operatorname{Cov}(X, Y) - \beta\operatorname{Var}(X) = 0.
$$
Non corrélés **et** conjointement gaussiens : $X$ et $\varepsilon$ sont indépendants. Donc sachant $X = x$, $Y = \mu_Y + \beta(x - \mu_X) + \varepsilon$ avec $\varepsilon$ de loi inchangée $\mathcal{N}(0, \operatorname{Var}(\varepsilon))$, et
$$
\operatorname{Var}(\varepsilon) = \operatorname{Var}(Y) - 2\beta\operatorname{Cov}(X, Y) + \beta^2\operatorname{Var}(X) = \sigma_Y^2 - \frac{\operatorname{Cov}(X,Y)^2}{\sigma_X^2} = (1 - \rho^2)\sigma_Y^2.
$$
:::

:::exemple Pont brownien
$W_1$ et $W_4$ forment un vecteur gaussien : $\operatorname{Var}(W_4) = 4$, $\operatorname{Cov}(W_1, W_4) = \min(1, 4) = 1$. Sachant $W_4 = 2$ :
$$
\mathbb{E}[W_1 \mid W_4 = 2] = \frac{1}{4}\times 2 = 0{,}5, \qquad \operatorname{Var}(W_1 \mid W_4) = 1 - \frac{1^2}{4} = \frac34.
$$
Fiches : [[fiche:stoch-pont-esperance]], [[fiche:stoch-pont-variance]].
:::

:::exercice ex-cond-gauss
reponse: 1.2
$X$ et $Y$ sont gaussiennes centrées réduites de corrélation 0,6. Que vaut $\mathbb{E}[Y \mid X = 2]$ ? (La variance conditionnelle vaut alors $1 - 0{,}36 = 0{,}64$.)
---
$\mathbb{E}[Y \mid X = 2] = \rho \times 2 = 1{,}2$ ; $\operatorname{Var}(Y \mid X) = 0{,}64$, écart-type 0,8. Lecture « régression vers la moyenne » : une valeur extrême de $X$ n'annonce qu'une valeur un peu moins extrême de $Y$.
:::

:::exercice ex-var-cond
reponse: 0.64
Même couple : que vaut $\operatorname{Var}(Y \mid X = 2)$ ?
---
$(1 - \rho^2)\sigma_Y^2 = 1 - 0{,}36 = 0{,}64$. Elle ne dépend pas de la valeur observée de $X$ : propriété propre aux vecteurs gaussiens.
:::

## Probabilités de quadrant et maximum de gaussiennes

:::theoreme Formule de Sheppard
Si $(X, Y)$ est gaussien centré réduit de corrélation $\rho$ :
$$
\mathbb{P}(X > 0,\ Y > 0) = \frac14 + \frac{\arcsin\rho}{2\pi}.
$$
:::

:::preuve Par la géométrie
Écrivons $X = \langle Z, a\rangle$ et $Y = \langle Z, b\rangle$ où $Z$ est un vecteur gaussien isotrope du plan ($Z = (Z_1, Z_2)$ indépendantes) et $a, b$ deux vecteurs unitaires d'angle $\theta$ avec $\cos\theta = \rho$ (c'est possible : $\operatorname{Cov}(X, Y) = \langle a, b\rangle$). La loi de $Z$ est invariante par rotation, donc la direction de $Z$ est uniforme sur le cercle. L'événement $\{X > 0, Y > 0\}$ signifie que $Z$ est dans l'intersection de deux demi-plans dont les normales font un angle $\theta$ : c'est un secteur d'angle $\pi - \theta$. Donc
$$
\mathbb{P} = \frac{\pi - \theta}{2\pi} = \frac{\pi - \arccos\rho}{2\pi} = \frac{\pi - (\pi/2 - \arcsin\rho)}{2\pi} = \frac14 + \frac{\arcsin\rho}{2\pi}.
$$
:::

:::widget quadrants
:::

Exemples : $\rho = 0{,}5$ donne $1/3$ ([[fiche:proba-quadrant-normal]]) ; $W_1 > 0$ et $W_2 > 0$ pour un brownien ($\rho = 1/\sqrt2$) donne $3/8$ ([[fiche:stoch-deux-instants-positifs]]).

:::exercice ex-quadrant-negatif
reponse: 1/6
$(X, Y)$ gaussien centré réduit de corrélation $-0{,}5$. Que vaut $\mathbb{P}(X > 0, Y > 0)$ ?
---
$\frac14 + \frac{\arcsin(-0{,}5)}{2\pi} = \frac14 - \frac{\pi/6}{2\pi} = \frac14 - \frac1{12} = \frac16$. Géométriquement, l'angle entre les normales vaut $\theta = 120°$ et le secteur $180° - 120° = 60°$, soit $60/360 = 1/6$.
:::

:::exemple Maximum de deux gaussiennes
Pour $X, Y$ indépendantes $\mathcal{N}(0,1)$ : $\max(X, Y) = \frac{X + Y}{2} + \frac{\lvert X - Y\rvert}{2}$ (vrai pour tous réels). Or $X - Y \sim \mathcal{N}(0, 2)$, donc $\mathbb{E}\lvert X - Y\rvert = \sqrt2\sqrt{2/\pi} = 2/\sqrt\pi$, et
$$
\mathbb{E}[\max(X, Y)] = 0 + \frac{1}{\sqrt\pi} \approx 0{,}564.
$$
Pour $n$ gaussiennes indépendantes, le maximum croît comme $\sqrt{2\ln n}$ : c'est ce qui biaise le meilleur Sharpe parmi $n$ stratégies essayées (Sharpe déflaté, chapitre [[n:statistiques-et-regression]]). Fiche : [[fiche:proba-max-normales]].
:::

## Le théorème central limite

:::theoreme Théorème central limite
Si $X_1, X_2, \dots$ sont indépendantes, de même loi, de moyenne $\mu$ et de variance $\sigma^2 < \infty$, alors
$$
\frac{X_1 + \dots + X_n - n\mu}{\sigma\sqrt n} \xrightarrow[n\to\infty]{\text{loi}} \mathcal{N}(0, 1).
$$
:::

:::intuition Pourquoi la gaussienne
La démonstration classique utilise la fonction caractéristique : $\mathbb{E}[e^{iuX/(\sigma\sqrt n)}] = 1 - \frac{u^2}{2n} + o(1/n)$ pour une variable centrée de variance $\sigma^2$, donc la fonction caractéristique de la somme normalisée vaut $\left(1 - \frac{u^2}{2n} + o(1/n)\right)^n \to e^{-u^2/2}$, celle de $\mathcal{N}(0,1)$. Seuls la moyenne et la variance survivent à la normalisation ; les moments supérieurs (asymétrie, aplatissement) s'effacent en $1/\sqrt n$ et $1/n$.
:::

:::widget tcl
:::

:::attention Les limites du TCL en finance
Le TCL exige une variance finie et des termes indépendants (ou faiblement dépendants). Les rendements quotidiens ont des queues épaisses, une volatilité qui varie dans le temps et des chocs groupés : la convergence vers la gaussienne est lente, et les quantiles extrêmes (VaR à 99 %, krachs) sont mal décrits par la loi normale. D'où l'importance des stress tests, de l'expected shortfall et des modèles à sauts ou à volatilité stochastique.
:::

:::entretien Ce que l'intervieweur veut voir
Les calculs de ce chapitre se font au tableau en deux minutes à condition de **compléter le carré** sans hésiter et de connaître $\mathbb{E}[e^{\sigma Z}] = e^{\sigma^2/2}$. Une question comme « que vaut $\mathbb{E}[S_T^2]$ dans Black-Scholes ? » ou « montre que $e^{\sigma W_t - \sigma^2 t/2}$ est d'espérance 1 » doit être immédiate. Pour une corrélation conditionnelle ou un pont brownien, annonce la décomposition $Y = \beta X + \varepsilon$ avec $\varepsilon$ indépendant de $X$ : c'est la démonstration attendue.
:::
