---
titre: Méthodes numériques : Monte-Carlo et différences finies
partie: Pricing
resume: Simuler des variables aléatoires (inversion, Box-Muller, Cholesky), estimer un prix par Monte-Carlo avec son intervalle de confiance, réduire la variance (antithétiques, variable de contrôle, échantillonnage préférentiel), calculer des grecques par simulation, puis résoudre l'EDP de Black-Scholes par différences finies avec l'analyse d'erreur et de stabilité.
duree: 3 h
fiches: der-monte-carlo-variance der-differences-finies stoch-discretisation-euler algo-rand7 algo-flottants algo-numpy-vectorisation der-arbre-deux-pas der-put-americain-arbre proj-vs-heston num-antithetique num-stabilite-explicite num-box-muller
---
Dès qu'un produit n'a pas de formule fermée (option asiatique, panier, barrière en temps discret, modèle de Heston), on calcule son prix numériquement. Deux familles dominent : la **simulation** (Monte-Carlo), qui calcule une espérance, et les **différences finies**, qui résolvent une EDP ; Feynman-Kac (chapitre [[n:equations-differentielles-stochastiques]]) dit que les deux calculent la même chose. En entretien, on te demandera surtout l'ordre de grandeur des erreurs, comment les réduire, et comment générer de l'aléa à partir d'une source uniforme.

## Générer des variables aléatoires

:::theoreme Méthode d'inversion
Soit $F$ une fonction de répartition continue et strictement croissante, et $U \sim \mathcal{U}[0, 1]$. Alors $X = F^{-1}(U)$ a pour fonction de répartition $F$.
:::

:::preuve
$\mathbb{P}(X \le x) = \mathbb{P}(F^{-1}(U) \le x) = \mathbb{P}(U \le F(x)) = F(x)$, car $F$ est croissante et $U$ uniforme.
:::

:::exemple Exponentielle et gaussienne
- **Exponentielle** de paramètre $\lambda$ : $F(x) = 1 - e^{-\lambda x}$, donc $X = -\frac{1}{\lambda}\ln(1 - U)$, ou simplement $-\frac1\lambda\ln U$ ($1 - U$ est aussi uniforme).
- **Gaussienne** : $N^{-1}$ n'a pas de forme fermée ; on utilise une approximation rationnelle (Beasley-Springer-Moro) ou **Box-Muller** : si $U_1, U_2$ sont uniformes indépendantes,
$$
Z_1 = \sqrt{-2\ln U_1}\,\cos(2\pi U_2), \qquad Z_2 = \sqrt{-2\ln U_1}\,\sin(2\pi U_2)
$$
sont deux gaussiennes standard indépendantes.
:::

:::preuve De Box-Muller
Prenons $(Z_1, Z_2)$ gaussien standard dans le plan et passons en coordonnées polaires $(R, \Theta)$. La densité jointe $\frac{1}{2\pi}e^{-(z_1^2 + z_2^2)/2}\,dz_1\,dz_2 = \frac{1}{2\pi}e^{-r^2/2}\,r\,dr\,d\theta$ se factorise : $\Theta$ est uniforme sur $[0, 2\pi]$, indépendant de $R$, et $R^2/2$ a la densité $e^{-s}$ (poser $s = r^2/2$, $ds = r\,dr$) : c'est une exponentielle de paramètre 1. Donc $R^2 = -2\ln U_1$ et $\Theta = 2\pi U_2$ conviennent.
:::

:::propriete Vecteurs gaussiens corrélés
Pour simuler $X \sim \mathcal{N}(0, \Sigma)$, on factorise $\Sigma = LL^\top$ (Cholesky, $L$ triangulaire inférieure) et on pose $X = LZ$ avec $Z$ gaussien standard. En effet $\operatorname{Var}(LZ) = L\operatorname{Var}(Z)L^\top = LL^\top = \Sigma$. En dimension 2 avec corrélation $\rho$ : $X_1 = Z_1$, $X_2 = \rho Z_1 + \sqrt{1 - \rho^2}\,Z_2$ (chapitre [[n:lois-gaussiennes]]).
:::

:::exercice ex-num-cholesky
reponse: 7.4
On simule $X_1 = Z_1$ et $X_2 = 0{,}6\,Z_1 + 0{,}8\,Z_2$ avec $Z_1, Z_2$ gaussiennes standard indépendantes. Que vaut $\operatorname{Var}(X_1 + 2X_2)$ ?
---
$X_1$ et $X_2$ sont de variance 1 ($0{,}36 + 0{,}64$) et de covariance $0{,}6$. Donc $\operatorname{Var}(X_1 + 2X_2) = 1 + 4 + 2 \times 2 \times 0{,}6 = 7{,}4$. Directement : $X_1 + 2X_2 = 2{,}2\,Z_1 + 1{,}6\,Z_2$, de variance $4{,}84 + 2{,}56 = 7{,}4$.
:::

:::methode Questions de génération classiques en entretien
- **Simuler un dé à 7 faces avec un dé à 5 faces** ([[fiche:algo-rand7]]) : deux lancers donnent 25 issues équiprobables ; on garde les 21 premières (3 par face) et on recommence sinon (méthode de **rejet**). Nombre moyen de paires de lancers : $25/21$.
- **Pièce équilibrée à partir d'une pièce biaisée** (von Neumann) : lancer deux fois ; PF → pile, FP → face, sinon recommencer.
- **Point uniforme dans un disque** : rejet depuis le carré (efficacité $\pi/4$), ou $r = \sqrt U$ (et non $r = U$, qui concentrerait les points au centre) et $\theta = 2\pi V$.
:::

## Monte-Carlo

:::theoreme Estimateur de Monte-Carlo
Pour estimer $\mu = \mathbb{E}[Y]$, on tire $Y_1, \dots, Y_n$ indépendants de même loi que $Y$ et on pose $\hat\mu_n = \frac1n\sum Y_i$. Alors $\hat\mu_n$ est **sans biais**, de variance $\frac{\sigma_Y^2}{n}$, et (TCL) un intervalle de confiance à 95 % est
$$
\hat\mu_n \pm 1{,}96\,\frac{\hat\sigma_Y}{\sqrt n}.
$$
:::

:::intuition Ce qu'il faut retenir sur la vitesse
- L'erreur décroît en $1/\sqrt n$ : **diviser l'erreur par 10 coûte 100 fois plus de tirages** ([[fiche:der-monte-carlo-variance]]).
- Cette vitesse **ne dépend pas de la dimension** : un panier de 50 actions se price aussi facilement qu'une seule, alors que les grilles d'EDP explosent avec la dimension. C'est la raison d'être du Monte-Carlo en finance.
- Pour progresser, on agit sur $\sigma_Y$ (réduction de variance) plutôt que sur $n$.
- Si les trajectoires sont discrétisées, il s'ajoute un **biais** de discrétisation (ordre faible 1 pour Euler, chapitre [[n:equations-differentielles-stochastiques]]) : à budget fixé, on équilibre pas de temps et nombre de tirages.
:::

:::exemple Combien de tirages pour un call
Pour le call $S_0 = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = 0$ (prix 7,97), l'écart-type du flux $(S_T - K)^+$ vaut environ $13{,}15$ (exercice suivant). Pour une demi-largeur d'intervalle de $0{,}05$ (soit 0,6 % du prix), il faut $n = (1{,}96 \times 13{,}15/0{,}05)^2 \approx 266\,000$ tirages.
:::

:::exercice ex-num-ecart-type-payoff
reponse: sqrt(10000*exp(0.04)*N(0.3)-20000*N(0.1)+10000*N(-0.1)-(100*(N(0.1)-N(-0.1)))**2)
tolerance: 0.01
Sous la probabilité risque-neutre, $S_0 = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = 0$. Quel est l'écart-type du flux $(S_T - K)^+$ ? (Calcule $\mathbb{E}[((S_T - K)^+)^2]$ en développant le carré, avec les mêmes techniques qu'au chapitre [[n:black-scholes]].)
---
$((S_T - K)^+)^2 = (S_T^2 - 2KS_T + K^2)\mathbf{1}_{S_T > K}$. Avec $S_T = S_0e^{-\sigma^2T/2 + \sigma\sqrt TZ}$ et $\{S_T > K\} = \{Z > -d_2\}$ :
- $\mathbb{E}[S_T^2\mathbf{1}] = S_0^2e^{-\sigma^2T}\,\mathbb{E}[e^{2\sigma\sqrt TZ}\mathbf{1}_{Z > -d_2}] = S_0^2e^{\sigma^2T}N(d_2 + 2\sigma\sqrt T)$ (complétion du carré avec un décalage de $2\sigma\sqrt T$) ;
- $\mathbb{E}[S_T\mathbf{1}] = S_0N(d_1)$ et $\mathbb{P}(S_T > K) = N(d_2)$.

Avec $d_1 = 0{,}1$, $d_2 = -0{,}1$ : $\mathbb{E}[\cdot^2] = 10\,000\,e^{0{,}04}N(0{,}3) - 20\,000\,N(0{,}1) + 10\,000\,N(-0{,}1) \approx 236{,}5$. Variance $236{,}5 - 7{,}97^2 \approx 173{,}0$, écart-type $\approx 13{,}15$ : environ 1,65 fois le prix, ce qui est typique d'un flux nul une fois sur deux.
:::

:::widget montecarlo
:::

## Réduire la variance

:::theoreme Variables antithétiques
Si $Z \sim \mathcal{N}(0, 1)$, $-Z$ a la même loi. L'estimateur $\frac12\big(f(Z) + f(-Z)\big)$ est sans biais, de variance
$$
\operatorname{Var}\left(\frac{f(Z) + f(-Z)}{2}\right) = \frac12\Big(\operatorname{Var}(f(Z)) + \operatorname{Cov}\big(f(Z), f(-Z)\big)\Big).
$$
À coût égal (deux évaluations de $f$), il bat deux tirages indépendants (variance $\frac12\operatorname{Var}(f(Z))$) **si et seulement si** $\operatorname{Cov}(f(Z), f(-Z)) < 0$, ce qui est le cas dès que $f$ est **monotone**.
:::

:::preuve
Par bilinéarité, $\operatorname{Var}\big(\frac{A + B}{2}\big) = \frac14\big(\operatorname{Var}A + \operatorname{Var}B + 2\operatorname{Cov}(A, B)\big)$, et $\operatorname{Var}A = \operatorname{Var}B$ car $f(Z)$ et $f(-Z)$ ont la même loi. Pour $f$ croissante, $f(Z)$ et $f(-Z)$ varient en sens contraires : leur covariance est négative (inégalité de Tchebychev pour les fonctions monotones, admise).
:::

:::attention Quand les antithétiques ne servent à rien
Si $f$ est **paire** ($f(z) = f(-z)$, par exemple le flux d'un straddle à la monnaie, à peu près), la covariance vaut $+\operatorname{Var}f$ et l'antithétique **double** le coût sans réduire la variance. Le widget plus haut montre le gain pour un call (fonction croissante).
:::

:::exercice ex-num-antithetique
reponse: (exp(1)-1)**2/2
tolerance: 0.001
$Z \sim \mathcal{N}(0, 1)$. Que vaut $\operatorname{Var}\big(\frac12(e^Z + e^{-Z})\big)$ ? Compare à $\frac12\operatorname{Var}(e^Z)$, la variance de la moyenne de deux tirages indépendants.
---
$\frac12(e^Z + e^{-Z}) = \cosh Z$. $\mathbb{E}[\cosh Z] = e^{1/2}$ et $\mathbb{E}[\cosh^2Z] = \frac14\mathbb{E}[e^{2Z} + 2 + e^{-2Z}] = \frac{e^2 + 1}{2}$. Donc $\operatorname{Var} = \frac{e^2 + 1}{2} - e = \frac{(e - 1)^2}{2} \approx 1{,}476$. Avec deux tirages indépendants : $\frac12(e^2 - e) \approx 2{,}335$. Gain de 37 % à coût égal.
:::

:::theoreme Variable de contrôle
Soit $X$ une variable corrélée à $Y$ dont on connaît l'espérance exacte $\mathbb{E}[X]$. Pour tout $c$, $Y_c = Y - c\,(X - \mathbb{E}[X])$ a la même espérance que $Y$. Sa variance est minimale pour
$$
c^* = \frac{\operatorname{Cov}(X, Y)}{\operatorname{Var}(X)}, \qquad \operatorname{Var}(Y_{c^*}) = (1 - \rho_{XY}^2)\operatorname{Var}(Y).
$$
:::

:::preuve
$\operatorname{Var}(Y_c) = \operatorname{Var}(Y) - 2c\operatorname{Cov}(X, Y) + c^2\operatorname{Var}(X)$ est un trinôme en $c$, minimal en $c^* = \frac{\operatorname{Cov}(X, Y)}{\operatorname{Var}(X)}$ (c'est la pente de la régression de $Y$ sur $X$, chapitre [[n:statistiques-et-regression]]). En remplaçant : $\operatorname{Var}(Y) - \frac{\operatorname{Cov}(X, Y)^2}{\operatorname{Var}(X)} = \operatorname{Var}(Y)(1 - \rho^2)$.
:::

:::exemple Choisir le contrôle
- Pour un call, $X = S_T$ (dont l'espérance risque-neutre est $S_0e^{rT}$) : la corrélation est forte pour un call dans la monnaie.
- Pour une option **asiatique arithmétique**, le meilleur contrôle est l'asiatique **géométrique**, qui a une formule fermée (le produit de log-normales est log-normal) : corrélation typiquement supérieure à 0,999, variance divisée par plusieurs centaines.
- Pour un modèle compliqué, le même produit pricé dans un modèle simple (Black-Scholes) sert de contrôle.
:::

:::exercice ex-num-controle
reponse: 1/(1-0.95**2)
tolerance: 0.3
La corrélation entre le flux simulé et la variable de contrôle vaut 0,95. Par combien la variance de l'estimateur est-elle divisée avec le coefficient optimal ?
---
$\frac{1}{1 - 0{,}95^2} = \frac{1}{0{,}0975} \approx 10{,}3$ : autant que dix fois plus de tirages, pour un coût de calcul presque nul.
:::

:::definition Échantillonnage préférentiel (importance sampling)
Pour estimer $\mathbb{E}[h(Z)]$ quand $h$ n'est non nul que sur un événement rare (option très en dehors de la monnaie, probabilité de défaut), on tire sous une autre loi qui rend l'événement fréquent et on corrige par le **rapport de vraisemblance**. Avec un décalage $\theta$ de la moyenne :
$$
\mathbb{E}[h(Z)] = \mathbb{E}\Big[h(Z + \theta)\,e^{-\theta Z - \theta^2/2}\Big].
$$
C'est exactement le changement de probabilité de Girsanov (chapitre [[n:arbitrage-et-risque-neutre]]), utilisé à l'envers.
:::

:::preuve
$\mathbb{E}\big[h(Z + \theta)e^{-\theta Z - \theta^2/2}\big] = \int h(z + \theta)e^{-\theta z - \theta^2/2}\varphi(z)\,dz$. Or $e^{-\theta z - \theta^2/2}\varphi(z) = \varphi(z + \theta)$ (complétion du carré). Avec $u = z + \theta$ : $\int h(u)\varphi(u)\,du = \mathbb{E}[h(Z)]$.
:::

:::propriete Autres techniques, à connaître de nom
- **Stratification** : découper l'espace des tirages en strates et tirer une proportion fixe dans chacune.
- **Quasi-Monte-Carlo** (suites de Sobol, Halton) : points déterministes « bien répartis », erreur proche de $1/n$ au lieu de $1/\sqrt n$ en dimension modérée.
- **Nombres aléatoires communs** : utiliser les mêmes tirages pour deux calculs que l'on compare (indispensable pour les grecques par différences finies).
:::

## Grecques par simulation

:::methode Trois façons de calculer un delta par Monte-Carlo
1. **Bump and revalue** : $\Delta \approx \frac{V(S_0 + h) - V(S_0 - h)}{2h}$, avec les **mêmes** tirages pour les deux prix. Sans nombres aléatoires communs, la variance de l'estimateur explose en $1/h^2$.
2. **Dérivée trajectorielle** (pathwise) : dériver le flux sous l'espérance. Pour un call, $\frac{\partial}{\partial S_0}(S_T - K)^+ = \mathbf{1}_{S_T > K}\,\frac{S_T}{S_0}$, donc $\Delta = e^{-rT}\,\mathbb{E}\big[\mathbf{1}_{S_T > K}\,S_T/S_0\big]$. Ne marche pas pour une digitale (flux discontinu, dérivée nulle presque partout).
3. **Rapport de vraisemblance** : dériver la **densité** plutôt que le flux. Pour Black-Scholes, $\Delta = e^{-rT}\,\mathbb{E}\Big[g(S_T)\,\dfrac{Z}{S_0\sigma\sqrt T}\Big]$. Marche pour les flux discontinus, mais avec une variance plus grande.
:::

## Différences finies

:::propriete Approximations des dérivées
Par Taylor, pour $f$ régulière :
$$
\frac{f(x + h) - f(x)}{h} = f'(x) + O(h), \qquad \frac{f(x + h) - f(x - h)}{2h} = f'(x) + \frac{h^2}{6}f'''(x) + O(h^4),
$$
$$
\frac{f(x + h) - 2f(x) + f(x - h)}{h^2} = f''(x) + \frac{h^2}{12}f^{(4)}(x) + O(h^4).
$$
Les schémas **centrés** sont d'ordre 2 : diviser $h$ par 2 divise l'erreur par 4 ([[fiche:der-differences-finies]]).
:::

:::preuve
$f(x \pm h) = f(x) \pm hf'(x) + \frac{h^2}{2}f''(x) \pm \frac{h^3}{6}f'''(x) + \frac{h^4}{24}f^{(4)}(x) + \dots$ En soustrayant les deux développements, les termes pairs s'annulent : $f(x + h) - f(x - h) = 2hf'(x) + \frac{h^3}{3}f'''(x) + \dots$ En les additionnant, les termes impairs s'annulent : $f(x + h) + f(x - h) = 2f(x) + h^2f''(x) + \frac{h^4}{12}f^{(4)}(x) + \dots$ On divise.
:::

:::attention Le pas optimal en arithmétique flottante
Diminuer $h$ réduit l'erreur de troncature, mais augmente l'erreur d'**arrondi** : $f(x + h) - f(x - h)$ soustrait deux nombres proches, avec une erreur relative de l'ordre de $\varepsilon \approx 10^{-16}$ (double précision), divisée par $h$. L'erreur totale $\approx \frac{h^2}{6}|f'''| + \frac{\varepsilon|f|}{h}$ est minimale pour $h \approx \varepsilon^{1/3} \approx 10^{-5}$ (relatif). Prendre $h = 10^{-12}$ donne des résultats faux ([[fiche:algo-flottants]]).
:::

:::exercice ex-num-difference-centree
reponse: (exp(0.1)-exp(-0.1))/0.2-1
tolerance: 0.000001
Quelle est l'erreur de la différence centrée $\frac{f(h) - f(-h)}{2h}$ pour $f = \exp$ en 0, avec $h = 0{,}1$ ?
---
$\frac{e^{0{,}1} - e^{-0{,}1}}{0{,}2} - 1 = \frac{\sinh 0{,}1}{0{,}1} - 1 \approx 0{,}001668$, très proche de la prédiction $\frac{h^2}{6}f'''(0) = \frac{0{,}01}{6} \approx 0{,}001667$.
:::

### Résoudre l'EDP de Black-Scholes

:::methode Le schéma explicite
On passe en log ($x = \ln S$) et en temps restant $\tau = T - t$ : l'EDP devient (avec $r = 0$ pour simplifier)
$$
\partial_\tau V = \tfrac12\sigma^2\,\partial_{xx}V - \tfrac12\sigma^2\,\partial_xV,
$$
à coefficients constants. Sur une grille $x_j = x_0 + j\,\Delta x$, $\tau_n = n\,\Delta\tau$, on part du flux à $\tau = 0$ et on avance :
$$
V_j^{n+1} = V_j^n + \Delta\tau\left(\frac{\sigma^2}{2}\,\frac{V_{j+1}^n - 2V_j^n + V_{j-1}^n}{\Delta x^2} - \frac{\sigma^2}{2}\,\frac{V_{j+1}^n - V_{j-1}^n}{2\Delta x}\right).
$$
Il faut des **conditions aux bords** (par exemple $V \approx S - K$ très haut, $V \approx 0$ très bas pour un call). Pour une option **américaine**, on prend à chaque pas $V_j^{n+1} \leftarrow \max(V_j^{n+1}, \text{valeur d'exercice})$.
:::

:::theoreme Stabilité du schéma explicite (équation de la chaleur)
Pour $\partial_\tau u = \frac12\sigma^2\partial_{xx}u$, le schéma explicite est stable si et seulement si
$$
\alpha = \frac{\sigma^2\Delta\tau}{2\Delta x^2} \le \frac12, \qquad \text{c'est-à-dire} \qquad \Delta\tau \le \frac{\Delta x^2}{\sigma^2}.
$$
:::

:::preuve Par l'analyse de Fourier (von Neumann)
Le schéma s'écrit $u_j^{n+1} = \alpha u_{j-1}^n + (1 - 2\alpha)u_j^n + \alpha u_{j+1}^n$. Cherchons une solution de la forme $u_j^n = g^n e^{ikj\Delta x}$ (un mode de Fourier). En remplaçant :
$$
g = \alpha e^{-ik\Delta x} + (1 - 2\alpha) + \alpha e^{ik\Delta x} = 1 - 2\alpha\big(1 - \cos(k\Delta x)\big) = 1 - 4\alpha\sin^2\!\Big(\frac{k\Delta x}{2}\Big).
$$
Le schéma est stable si $|g| \le 1$ pour tous les modes. $g \le 1$ toujours ; $g \ge -1$ pour tous les $k$ équivaut à $4\alpha \le 2$, soit $\alpha \le \frac12$. Sinon, le mode le plus oscillant ($k\Delta x = \pi$) est amplifié d'un facteur $|1 - 4\alpha| > 1$ à chaque pas et la solution explose.
:::

:::intuition Ce que cela coûte
Diviser $\Delta x$ par 2 (pour gagner en précision) oblige à diviser $\Delta\tau$ par 4 : le coût est multiplié par 8. D'où les schémas **implicites** (on résout un système tridiagonal à chaque pas, en $O(N)$ par l'algorithme de Thomas), inconditionnellement stables. **Crank-Nicolson** (moyenne des schémas explicite et implicite) est d'ordre 2 en temps et en espace, mais peut produire des oscillations près d'un flux non dérivable ; on fait souvent quelques pas implicites au départ (lissage de Rannacher).
:::

:::exercice ex-num-stabilite
reponse: 0.0025
tolerance: 0.00001
Schéma explicite pour $\partial_\tau u = \frac12\sigma^2\partial_{xx}u$ avec $\sigma = 20\,\%$ et un pas en log-prix $\Delta x = 0{,}01$. Quel est le plus grand pas de temps $\Delta\tau$ stable (en années) ?
---
$\Delta\tau \le \frac{\Delta x^2}{\sigma^2} = \frac{0{,}0001}{0{,}04} = 0{,}0025$ an, soit environ 0,6 jour ouvré. Un an d'échéance demande donc au moins 400 pas de temps pour 1 % de pas en espace.
:::

## Arbres, Fourier, et quelle méthode choisir

:::propriete Le bon outil selon le produit
| Situation | Méthode naturelle |
|---|---|
| Vanille européenne, modèle simple | formule fermée |
| Américaine, une ou deux variables d'état | arbre ou différences finies (avec le max d'exercice) |
| Modèle avec fonction caractéristique (Heston, sauts) | inversion de Fourier ([[fiche:proj-vs-heston]]) |
| Produit dépendant du chemin, panier, grande dimension | Monte-Carlo |
| Américaine en grande dimension | Monte-Carlo avec régression (Longstaff-Schwartz) |
:::

:::definition Longstaff-Schwartz, en une phrase
Pour une option américaine par simulation, on remonte le temps et, à chaque date d'exercice, on estime la **valeur de continuation** en régressant les flux futurs actualisés sur des fonctions de l'état présent (par moindres carrés, chapitre [[n:statistiques-et-regression]]) ; on exerce si la valeur immédiate dépasse cette estimation.
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Annoncer un prix Monte-Carlo sans **intervalle de confiance**.
- Calculer un delta par différences finies avec des tirages différents pour les deux prix.
- Utiliser Euler sur le prix d'un brownien géométrique au lieu de simuler le log exactement.
- Choisir des pas d'EDP sans vérifier la condition de stabilité, ou un pas de dérivation numérique trop petit.
- Oublier qu'un générateur pseudo-aléatoire doit être initialisé (graine) pour que les résultats soient **reproductibles**.
- Écrire des boucles Python sur des millions de tirages au lieu de vectoriser avec NumPy ([[fiche:algo-numpy-vectorisation]]).
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Comment pricer une option asiatique ? Avec quelle précision ? »** Monte-Carlo, erreur en $\sigma/\sqrt n$, variable de contrôle géométrique.
- **« Comment générer une gaussienne à partir d'uniformes ? Et deux gaussiennes corrélées ? »** Inversion ou Box-Muller ; Cholesky.
- **« Simule un dé à 7 faces avec un dé à 5 faces. »** Rejet sur 25 issues ; nombre moyen de lancers.
- **« Comment calculer un delta par Monte-Carlo ? »** Les trois méthodes, et les nombres aléatoires communs.
- **« Quelle est la condition de stabilité du schéma explicite ? D'où vient-elle ? »** $\Delta\tau \le \Delta x^2/\sigma^2$, analyse de Fourier, schémas implicites.
- **« Monte-Carlo ou EDP ? »** Dimension, dépendance au chemin, exercice anticipé.
:::
