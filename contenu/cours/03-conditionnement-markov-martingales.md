---
titre: Conditionnement, chaînes de Markov, martingales
partie: Probabilités
resume: Bayes, espérance conditionnelle, méthode du premier pas pour les temps d'attente, chaînes de Markov, martingales et théorème d'arrêt, arrêt optimal : tout ce qu'il faut pour les jeux et les temps d'attente.
duree: 3 h
fiches: proba-test-medical proba-monty-hall proba-deux-enfants proba-des-somme-7-sachant-un-6 proba-piece-truquee-bayes proba-bertrand-boites proba-esperance-sachant-somme proba-attente-premier-six proba-variance-geometrique proba-pile-pile proba-pile-face proba-pfp proba-penney-ppf-pff jeu-trois-piles proba-deux-six-consecutifs proba-premier-a-faire-six proba-toutes-les-faces proba-esperance-somme-tirages-de proba-ruine-equitable proba-duree-ruine proba-ruine-biaisee jeu-marche-aleatoire-sortie proba-markov-meteo proba-polya proba-de-avec-relance proba-de-deux-relances mm-cartes-rouges-noires jeu-arret-uniforme proba-passager-avion
---
Le chapitre [[n:esperance-variance-covariance]] donnait l'outil pour **découper** une quantité en somme. Celui-ci donne l'outil pour **découper selon ce qui se passe d'abord** : on conditionne sur une information (le premier lancer, le premier état, la première étape) et on écrit une équation. C'est la méthode qui résout les temps d'attente, la ruine du joueur, les jeux à plusieurs coups et les options américaines. Les martingales en sont la version élégante : elles transforment des équations en une ligne.

## Probabilités conditionnelles et formule de Bayes

:::definition Probabilité conditionnelle
Si $\mathbb{P}(B) > 0$ : $\mathbb{P}(A \mid B) = \dfrac{\mathbb{P}(A \cap B)}{\mathbb{P}(B)}$. C'est la probabilité de $A$ quand on sait que $B$ est réalisé : on restreint l'univers à $B$ et on renormalise.
:::

:::theoreme Probabilités totales et formule de Bayes
Si $(B_i)$ est une partition de l'univers (les $B_i$ sont disjoints et l'un d'eux se réalise) :
$$
\mathbb{P}(A) = \sum_i \mathbb{P}(A \mid B_i)\,\mathbb{P}(B_i), \qquad \mathbb{P}(B_j \mid A) = \frac{\mathbb{P}(A \mid B_j)\,\mathbb{P}(B_j)}{\sum_i \mathbb{P}(A \mid B_i)\,\mathbb{P}(B_i)}.
$$
:::

:::preuve
$A = \bigsqcup_i (A \cap B_i)$ (union disjointe), donc $\mathbb{P}(A) = \sum_i \mathbb{P}(A \cap B_i) = \sum_i \mathbb{P}(A \mid B_i)\mathbb{P}(B_i)$. Bayes : $\mathbb{P}(B_j \mid A) = \mathbb{P}(A \cap B_j)/\mathbb{P}(A)$, on remplace le numérateur par $\mathbb{P}(A \mid B_j)\mathbb{P}(B_j)$ et le dénominateur par la formule précédente.
:::

:::methode Bayes en cotes (la version à faire de tête)
Pour deux hypothèses $H$ et $\bar H$ et une observation $A$ :
$$
\underbrace{\frac{\mathbb{P}(H \mid A)}{\mathbb{P}(\bar H \mid A)}}_{\text{cote a posteriori}} = \underbrace{\frac{\mathbb{P}(H)}{\mathbb{P}(\bar H)}}_{\text{cote a priori}} \times \underbrace{\frac{\mathbb{P}(A \mid H)}{\mathbb{P}(A \mid \bar H)}}_{\text{rapport de vraisemblance}}.
$$
Le dénominateur commun $\mathbb{P}(A)$ disparaît. Avec plusieurs observations indépendantes sachant l'hypothèse, on **multiplie** les rapports de vraisemblance.
:::

:::exemple Le test médical, en cotes
Prévalence 1 %, sensibilité 99 %, faux positifs 5 %. Cote a priori d'être malade : $1 : 99$. Rapport de vraisemblance d'un test positif : $0{,}99 / 0{,}05 = 19{,}8$. Cote a posteriori : $19{,}8 : 99 = 1 : 5$, soit une probabilité de $1/6 \approx 16{,}7\%$ ([[fiche:proba-test-medical]]). L'intuition « 99 % » confond $\mathbb{P}(\text{positif} \mid \text{malade})$ et $\mathbb{P}(\text{malade} \mid \text{positif})$.

Même calcul pour la pièce truquée ([[fiche:proba-piece-truquee-bayes]]) : cote a priori $1 : 9$, cinq piles ont un rapport de vraisemblance $1 / (1/2)^5 = 32$, cote a posteriori $32 : 9$, probabilité $32/41$.
:::

:::attention La manière dont l'information est obtenue compte
« Au moins un des deux enfants est un garçon » donne $\mathbb{P}(\text{deux garçons}) = 1/3$ ; « l'aîné est un garçon » donne $1/2$. Au Monty Hall, le présentateur **sait** où est la voiture et choisit une porte vide : ce choix est informatif, d'où le $2/3$ en changeant. S'il ouvrait au hasard (et tombait par chance sur une chèvre), changer ne donnerait que $1/2$. Avant tout calcul, écris précisément l'événement observé. Fiches : [[fiche:proba-deux-enfants]], [[fiche:proba-monty-hall]], [[fiche:proba-des-somme-7-sachant-un-6]].
:::

:::exercice ex-bayes-deux-tests
reponse: 0.01*0.99^2/(0.01*0.99^2+0.99*0.05^2)
tolerance: 0.003
Même maladie (prévalence 1 %, sensibilité 99 %, faux positifs 5 %). Tu fais deux tests indépendants (sachant ton état) et les deux sont positifs. Probabilité d'être malade ?
---
En cotes : $1 : 99$ a priori, chaque test multiplie par $19{,}8$, donc la cote devient $19{,}8^2 : 99 = 392{,}04 : 99$, soit une probabilité $\frac{392{,}04}{491{,}04} \approx 0{,}798$.

Directement : $\frac{0{,}01 \times 0{,}99^2}{0{,}01 \times 0{,}99^2 + 0{,}99 \times 0{,}05^2} = \frac{0{,}009801}{0{,}012276} \approx 0{,}798$.

L'hypothèse « indépendants sachant l'état » est cruciale : deux tests qui se trompent pour la même raison n'apportent pas deux fois l'information.
:::

## Espérance conditionnelle

:::definition Espérance conditionnelle (cas discret)
Pour $Y$ discrète et $\mathbb{P}(Y = y) > 0$ : $\mathbb{E}[X \mid Y = y] = \sum_x x\,\mathbb{P}(X = x \mid Y = y)$. La variable aléatoire $\mathbb{E}[X \mid Y]$ est la fonction de $Y$ qui vaut $\mathbb{E}[X \mid Y = y]$ quand $Y = y$ : c'est la **meilleure prévision de $X$ quand on connaît $Y$**.
:::

:::theoreme Propriétés
1. **Espérance totale (tour)** : $\mathbb{E}\big[\mathbb{E}[X \mid Y]\big] = \mathbb{E}[X]$, soit $\mathbb{E}[X] = \sum_y \mathbb{E}[X \mid Y = y]\,\mathbb{P}(Y = y)$.
2. **Ce qui est connu sort** : $\mathbb{E}[g(Y)\,X \mid Y] = g(Y)\,\mathbb{E}[X \mid Y]$.
3. **Indépendance** : si $X$ est indépendante de $Y$, $\mathbb{E}[X \mid Y] = \mathbb{E}[X]$.
4. **Linéarité** : $\mathbb{E}[aX + bZ \mid Y] = a\,\mathbb{E}[X \mid Y] + b\,\mathbb{E}[Z \mid Y]$.
5. **Variance totale** : $\operatorname{Var}(X) = \mathbb{E}\big[\operatorname{Var}(X \mid Y)\big] + \operatorname{Var}\big(\mathbb{E}[X \mid Y]\big)$.
:::

:::preuve Espérance totale et variance totale
Tour : $\sum_y \mathbb{P}(Y=y)\sum_x x\,\frac{\mathbb{P}(X=x, Y=y)}{\mathbb{P}(Y=y)} = \sum_x x \sum_y \mathbb{P}(X = x, Y = y) = \sum_x x\,\mathbb{P}(X=x) = \mathbb{E}[X]$.

Variance totale. Notons $m(Y) = \mathbb{E}[X \mid Y]$ et $\operatorname{Var}(X \mid Y) = \mathbb{E}[X^2 \mid Y] - m(Y)^2$. Alors
$$
\mathbb{E}[\operatorname{Var}(X \mid Y)] = \mathbb{E}[X^2] - \mathbb{E}[m(Y)^2], \qquad \operatorname{Var}(m(Y)) = \mathbb{E}[m(Y)^2] - \mathbb{E}[m(Y)]^2 = \mathbb{E}[m(Y)^2] - \mathbb{E}[X]^2.
$$
En additionnant, les $\mathbb{E}[m(Y)^2]$ s'annulent et il reste $\mathbb{E}[X^2] - \mathbb{E}[X]^2 = \operatorname{Var}(X)$.
:::

Lecture de la variance totale : la dispersion de $X$ = dispersion moyenne **à l'intérieur** de chaque groupe + dispersion **entre** les moyennes des groupes. C'est la décomposition de la variance d'une ANOVA, et celle du risque total en risque spécifique plus risque de facteur.

:::exemple Somme d'un nombre aléatoire de termes (identité de Wald)
On lance un dé ; s'il donne $N$, on lance ensuite $N$ dés et on additionne : $S = X_1 + \dots + X_N$, les $X_i$ indépendants de $N$. Conditionnons sur $N$ :
$$
\mathbb{E}[S \mid N] = N\mu, \qquad \operatorname{Var}(S \mid N) = N\sigma^2 \qquad (\mu = 3{,}5,\ \sigma^2 = 35/12).
$$
Donc $\mathbb{E}[S] = \mathbb{E}[N]\mu = 3{,}5 \times 3{,}5 = 12{,}25$, et par variance totale
$$
\operatorname{Var}(S) = \mathbb{E}[N]\sigma^2 + \operatorname{Var}(N)\mu^2 = 3{,}5 \times \tfrac{35}{12} + \tfrac{35}{12} \times 12{,}25.
$$
Le premier terme vient de l'aléa des dés, le second de l'aléa sur leur nombre. L'identité $\mathbb{E}[S] = \mathbb{E}[N]\,\mathbb{E}[X]$ reste vraie quand $N$ est un **temps d'arrêt** d'espérance finie (on décide de s'arrêter au vu des lancers passés) : c'est l'identité de Wald ([[fiche:proba-esperance-somme-tirages-de]]).
:::

:::exercice ex-variance-wald
reponse: 35/12*(3.5+12.25)
tolerance: 0.002
Calcule numériquement $\operatorname{Var}(S)$ dans l'exemple précédent (un dé donne $N$, puis on additionne $N$ dés).
---
$\operatorname{Var}(S) = \mathbb{E}[N]\sigma^2 + \operatorname{Var}(N)\mu^2 = \frac{35}{12}\left(3{,}5 + 3{,}5^2\right) = \frac{35}{12} \times 15{,}75 \approx 45{,}94$. (Ici $\operatorname{Var}(N) = \sigma^2 = 35/12$ car $N$ est lui-même un dé.)
:::

:::exemple Une espérance conditionnelle par symétrie
Deux dés de somme 10 : $\mathbb{E}[X_1 \mid X_1 + X_2 = 10]$ ? Les rôles de $X_1$ et $X_2$ sont symétriques, donc $\mathbb{E}[X_1 \mid S] = \mathbb{E}[X_2 \mid S]$, et leur somme vaut $\mathbb{E}[S \mid S] = S$. D'où $\mathbb{E}[X_1 \mid S] = S/2 = 5$. Plus généralement, pour $n$ variables échangeables, $\mathbb{E}[X_1 \mid X_1 + \dots + X_n] = \frac{S}{n}$ ([[fiche:proba-esperance-sachant-somme]]).
:::

## La méthode du premier pas

:::methode Méthode du premier pas
Pour calculer une espérance (temps d'attente, gain) ou une probabilité (gagner, atteindre un état) :

1. Définir des **états** qui résument tout ce qui compte pour la suite (« rien d'utile », « un pile vient de tomber »…).
2. Pour chaque état, écrire $E_{\text{état}} = (\text{coût du pas}) + \sum_{\text{issues}} \mathbb{P}(\text{issue}) \times E_{\text{état d'arrivée}}$, avec $E = 0$ dans les états terminaux.
3. Résoudre le système linéaire.

C'est exactement l'espérance totale conditionnée sur le premier pas, combinée au fait que le futur ne dépend que de l'état actuel (propriété de Markov).
:::

:::exemple Premier 6, moyenne et variance
Soit $N$ le nombre de lancers jusqu'au premier 6. Après le premier lancer : soit c'est un 6 (probabilité $1/6$, on s'arrête), soit non, et tout recommence à zéro. Donc $N = 1 + N'\,\mathbf{1}_{\text{pas 6}}$ avec $N'$ de même loi que $N$, indépendante du premier lancer.

- **Moyenne** : $\mathbb{E}[N] = 1 + \frac56\mathbb{E}[N]$, d'où $\mathbb{E}[N] = 6$.
- **Variance** : $\mathbb{E}[N^2] = \mathbb{E}\big[(1 + N'\mathbf{1})^2\big] = 1 + 2\cdot\frac56\,\mathbb{E}[N] + \frac56\,\mathbb{E}[N^2]$ (car $\mathbf{1}^2 = \mathbf{1}$). Donc $\frac16\mathbb{E}[N^2] = 1 + 10 = 11$, $\mathbb{E}[N^2] = 66$ et $\operatorname{Var}(N) = 66 - 36 = 30$.

En général, $\mathbb{E}[N] = 1/p$ et $\operatorname{Var}(N) = (1-p)/p^2$. Fiches : [[fiche:proba-attente-premier-six]], [[fiche:proba-variance-geometrique]].
:::

:::exemple Deux piles consécutifs
États : $E_0$ (rien d'utile), $E_1$ (un pile vient de tomber), terminal (PP).
$$
E_0 = 1 + \tfrac12 E_1 + \tfrac12 E_0, \qquad E_1 = 1 + \tfrac12 \cdot 0 + \tfrac12 E_0.
$$
La première donne $E_0 = 2 + E_1$ ; avec la seconde, $E_0 = 2 + 1 + \tfrac12 E_0$, donc $E_0 = 6$. Pour « pile puis face », un pile après un pile ne fait pas perdre la progression : $E_1 = 1 + \tfrac12\cdot 0 + \tfrac12 E_1$ donne $E_1 = 2$ et $E_0 = 4$. Même probabilité d'apparition à chaque instant ($1/4$), mais pas la même attente : PP se chevauche avec lui-même, et un échec renvoie au début. Fiches : [[fiche:proba-pile-pile]], [[fiche:proba-pile-face]].
:::

:::exemple Pile-face-pile
États : $E_0$, $E_1$ (« P »), $E_2$ (« PF »).
$$
E_0 = 1 + \tfrac12 E_1 + \tfrac12 E_0, \quad E_1 = 1 + \tfrac12 E_1 + \tfrac12 E_2, \quad E_2 = 1 + \tfrac12 \cdot 0 + \tfrac12 E_0.
$$
Attention à la deuxième : après « P », un nouveau P laisse dans l'état « P » (on garde le dernier P). Et dans la troisième, après « PF » un F donne « PFF » : rien d'utile, retour en $E_0$. On obtient $E_0 = 2 + E_1$, $E_1 = 2 + E_2$, $E_2 = 1 + E_0/2$, donc $E_0 = 5 + E_0/2$ et $E_0 = 10$ ([[fiche:proba-pfp]]).
:::

:::theoreme Règle des chevauchements (admis ici, démontrée par martingales plus bas)
Pour une pièce équilibrée, le temps moyen d'attente d'un motif de longueur $n$ vaut $\sum 2^\ell$, la somme portant sur les longueurs $\ell \in \{1, \dots, n\}$ pour lesquelles le préfixe de longueur $\ell$ du motif est égal à son suffixe de longueur $\ell$.

PP : $\ell = 1, 2$, donc $2 + 4 = 6$. PF : $\ell = 2$ seulement, donc 4. PFP : $\ell = 1, 3$, donc $2 + 8 = 10$. PPP : $2 + 4 + 8 = 14$ ([[fiche:jeu-trois-piles]]).
:::

:::widget conditionnement
:::

:::exercice ex-attente-ppf
reponse: 8
Combien de lancers d'une pièce équilibrée en moyenne pour voir apparaître « pile, pile, face » ? Fais-le par la méthode du premier pas, puis vérifie avec la règle des chevauchements.
---
États : $E_0$, $E_1$ (« P »), $E_2$ (« PP »).
- $E_0 = 1 + \frac12 E_1 + \frac12 E_0$ ;
- $E_1 = 1 + \frac12 E_2 + \frac12 E_0$ (un F après « P » donne « PF », sans préfixe utile) ;
- $E_2 = 1 + \frac12 \cdot 0 + \frac12 E_2$ (un P après « PP » laisse « PP »).

La troisième donne $E_2 = 2$ ; la première $E_0 = 2 + E_1$ ; la deuxième $E_1 = 1 + 1 + \frac12 E_0$. Donc $E_0 = 2 + 2 + \frac12 E_0$ et $E_0 = 8$. Règle des chevauchements : seul $\ell = 3$ convient (« P » ≠ « F », « PP » ≠ « PF »), donc $2^3 = 8$.
:::

:::exemple Qui gagne la course ? (premier pas sur une probabilité)
A et B lancent un dé à tour de rôle, A commence ; le premier qui fait 6 gagne. Soit $p$ la probabilité que A gagne. Premier tour : A gagne tout de suite ($1/6$), ou A et B ratent ($25/36$) et la situation est la même qu'au départ :
$$
p = \frac16 + \frac{25}{36}p \implies p = \frac{1/6}{11/36} = \frac{6}{11}.
$$
Fiche : [[fiche:proba-premier-a-faire-six]]. Course entre deux motifs : [[fiche:proba-penney-ppf-pff]].
:::

## Chaînes de Markov

:::definition Chaîne de Markov
Une suite $(X_n)$ à valeurs dans un ensemble d'états est une chaîne de Markov si la loi de $X_{n+1}$ sachant tout le passé ne dépend que de $X_n$ :
$$
\mathbb{P}(X_{n+1} = j \mid X_n = i, X_{n-1}, \dots, X_0) = P_{ij}.
$$
$P = (P_{ij})$ est la **matrice de transition** ; chaque ligne somme à 1. La loi au temps $n$ (vecteur ligne $\pi_n$) vérifie $\pi_{n+1} = \pi_n P$, donc $\pi_n = \pi_0 P^n$.
:::

:::definition Loi stationnaire
Une loi $\pi$ est stationnaire si $\pi P = \pi$ : si la chaîne part de $\pi$, elle reste en $\pi$. Pour une chaîne irréductible et apériodique sur un ensemble fini, $\pi_n \to \pi$ quelle que soit la loi de départ, et $\pi_i$ est la proportion du temps passé en $i$ sur le long terme.
:::

:::exemple Deux états : formule générale
États « beau » et « pluie », avec $\mathbb{P}(\text{beau} \to \text{pluie}) = a$ et $\mathbb{P}(\text{pluie} \to \text{beau}) = b$. Équilibre des flux : à l'état stationnaire, autant de transitions beau → pluie que pluie → beau, soit $\pi_{\text{beau}}\,a = \pi_{\text{pluie}}\,b$. Avec $\pi_{\text{beau}} + \pi_{\text{pluie}} = 1$ :
$$
\pi_{\text{beau}} = \frac{b}{a + b}.
$$
Avec $a = 0{,}2$ et $b = 0{,}4$ : $2/3$ ([[fiche:proba-markov-meteo]]). En finance, c'est la structure d'un modèle à deux régimes (calme / agité) ; $1/a$ est la durée moyenne d'un épisode de beau temps.
:::

:::exercice ex-markov-regimes
reponse: 0.05/(0.02+0.05)
Un marché alterne entre un régime calme et un régime agité. Chaque jour, on passe de calme à agité avec probabilité 0,02, et d'agité à calme avec probabilité 0,05. Quelle proportion des jours est calme sur le long terme ?
---
$\pi_{\text{calme}} = \frac{b}{a + b} = \frac{0{,}05}{0{,}02 + 0{,}05} = \frac57 \approx 0{,}714$. Durées moyennes des épisodes : 50 jours de calme ($1/0{,}02$), 20 jours d'agitation ($1/0{,}05$), et $50/(50+20) = 5/7$.
:::

## Probabilités d'absorption : la ruine du joueur

:::theoreme Ruine du joueur
Une fortune part de $k \in \{0, \dots, N\}$ et monte de 1 avec probabilité $p$, descend de 1 avec probabilité $q = 1 - p$, jusqu'à atteindre 0 ou $N$. Notons $r = q/p$.
$$
\mathbb{P}_k(\text{atteindre } N) = \begin{cases} \dfrac{k}{N} & \text{si } p = \tfrac12, \\[2mm] \dfrac{1 - r^k}{1 - r^N} & \text{si } p \ne \tfrac12, \end{cases}
\qquad \mathbb{E}_k[\text{durée}] = k(N - k) \text{ si } p = \tfrac12.
$$
:::

:::preuve Par le premier pas
Soit $u_k = \mathbb{P}_k(\text{atteindre } N)$. Conditionnons sur le premier pas : $u_k = p\,u_{k+1} + q\,u_{k-1}$ pour $0 < k < N$, avec $u_0 = 0$ et $u_N = 1$.

Comme $p + q = 1$, on réécrit $p(u_{k+1} - u_k) = q(u_k - u_{k-1})$ : les accroissements $d_k = u_k - u_{k-1}$ vérifient $d_{k+1} = r\,d_k$, donc $d_k = r^{k-1}d_1$.

- Si $p = 1/2$ ($r = 1$) : les accroissements sont constants, $u_k = k\,d_1$, et $u_N = 1$ donne $u_k = k/N$.
- Sinon : $u_k = d_1(1 + r + \dots + r^{k-1}) = d_1\frac{1 - r^k}{1 - r}$, et $u_N = 1$ fixe $d_1$, d'où $u_k = \frac{1 - r^k}{1 - r^N}$.

Durée pour $p = 1/2$ : $D_k = 1 + \frac12 D_{k+1} + \frac12 D_{k-1}$, avec $D_0 = D_N = 0$. Les différences secondes sont constantes : $D_{k+1} - 2D_k + D_{k-1} = -2$, donc $D_k$ est un polynôme de degré 2 de coefficient dominant $-1$ qui s'annule en 0 et $N$ : $D_k = k(N - k)$.
:::

:::widget marche
:::

Fiches : [[fiche:proba-ruine-equitable]], [[fiche:proba-duree-ruine]], [[fiche:proba-ruine-biaisee]], [[fiche:jeu-marche-aleatoire-sortie]].

:::exercice ex-duree-ruine-biaisee
reponse: 50/13
tolerance: 0.002
Fortune de départ 2, objectif 4, gain avec probabilité 0,6 à chaque tour. Durée moyenne de la partie ? Indication : pour $p \ne 1/2$, $D_k = \dfrac{k}{q - p} - \dfrac{N}{q - p}\,u_k$.
---
Avec $q - p = -0{,}2$ et $u_2 = 9/13$ (fiche de la ruine biaisée) :
$$
D_2 = \frac{2}{-0{,}2} - \frac{4}{-0{,}2}\cdot\frac{9}{13} = -10 + \frac{180}{13} = \frac{50}{13} \approx 3{,}85.
$$
On peut aussi résoudre directement $D_1 = 1 + 0{,}6 D_2$, $D_2 = 1 + 0{,}6 D_3 + 0{,}4 D_1$, $D_3 = 1 + 0{,}4 D_2$. La formule de l'indication se retrouve avec la martingale $S_n - (p - q)n$ (voir plus bas).
:::

## Martingales

Les martingales formalisent le « jeu équitable » et donnent des démonstrations en une ligne.

:::definition Martingale
Une suite $(M_n)$ est une martingale (par rapport à l'information $\mathcal{F}_n$ disponible au temps $n$) si $M_n$ est connue au temps $n$, intégrable, et
$$
\mathbb{E}[M_{n+1} \mid \mathcal{F}_n] = M_n.
$$
En moyenne, conditionnellement à tout ce qu'on sait, la valeur de demain est celle d'aujourd'hui. En particulier $\mathbb{E}[M_n] = \mathbb{E}[M_0]$ pour tout $n$ (par espérance totale).
:::

:::exemple Les martingales de la marche aléatoire
Soit $S_n = \xi_1 + \dots + \xi_n$ avec des $\xi_i$ indépendants valant $+1$ avec probabilité $p$ et $-1$ sinon.

1. **$S_n - (p - q)n$** : $\mathbb{E}[S_{n+1} \mid \mathcal{F}_n] = S_n + \mathbb{E}[\xi_{n+1}] = S_n + (p - q)$. Si $p = 1/2$, $S_n$ elle-même est une martingale.
2. **$S_n^2 - n$** (cas $p = 1/2$) : $\mathbb{E}[S_{n+1}^2 \mid \mathcal{F}_n] = \mathbb{E}[S_n^2 + 2S_n\xi_{n+1} + \xi_{n+1}^2 \mid \mathcal{F}_n] = S_n^2 + 2S_n \cdot 0 + 1$, donc $S_{n+1}^2 - (n+1)$ a pour espérance conditionnelle $S_n^2 - n$.
3. **$r^{S_n}$ avec $r = q/p$** : $\mathbb{E}[r^{S_{n+1}} \mid \mathcal{F}_n] = r^{S_n}\,(p\,r + q\,r^{-1}) = r^{S_n}(q + p) = r^{S_n}$.

Dans chaque calcul, on a « sorti ce qui est connu » ($S_n$) et utilisé l'indépendance de $\xi_{n+1}$ avec le passé. Ce sont les ancêtres discrets de $W_t$, $W_t^2 - t$ et $e^{\theta W_t - \theta^2 t/2}$ du calcul stochastique.
:::

:::theoreme Théorème d'arrêt (version utilisable)
Si $(M_n)$ est une martingale et $\tau$ un temps d'arrêt (la décision de s'arrêter au temps $n$ ne dépend que de l'information jusqu'à $n$), alors $\mathbb{E}[M_\tau] = \mathbb{E}[M_0]$ dès que l'une de ces conditions est vraie :
- $\tau$ est bornée ;
- $\mathbb{E}[\tau] < \infty$ et les accroissements $\lvert M_{n+1} - M_n\rvert$ sont bornés ;
- $(M_{n \wedge \tau})$ est bornée et $\tau < \infty$ presque sûrement.
:::

:::preuve Idée, pour $\tau$ bornée par $N$
$M_\tau = M_0 + \sum_{n=0}^{N-1} (M_{n+1} - M_n)\,\mathbf{1}_{\{\tau > n\}}$. L'événement $\{\tau > n\}$ est connu au temps $n$, donc
$$
\mathbb{E}\big[(M_{n+1} - M_n)\mathbf{1}_{\{\tau > n\}}\big] = \mathbb{E}\big[\mathbf{1}_{\{\tau > n\}}\,\mathbb{E}[M_{n+1} - M_n \mid \mathcal{F}_n]\big] = 0.
$$
Chaque terme est d'espérance nulle : on ne peut pas créer d'espérance positive en choisissant **quand** s'arrêter avec l'information disponible. Les autres cas s'obtiennent en appliquant ce résultat à $\tau \wedge N$ puis en faisant $N \to \infty$ (convergence dominée).
:::

:::exemple La ruine du joueur en trois lignes
Cas équitable, $\tau$ = temps de sortie de $\{1, \dots, N-1\}$ en partant de $k$ ; $S$ arrêtée reste dans $[0, N]$, donc bornée (et $\tau < \infty$ p.s.).

- Avec $S$ : $k = \mathbb{E}[S_\tau] = N\,\mathbb{P}(\text{atteindre } N)$, donc $\mathbb{P} = k/N$.
- Avec $S^2 - n$ (le processus arrêté n'est plus borné, à cause du terme $n \wedge \tau$ ; mais $\mathbb{E}[\tau] < \infty$ et ses accroissements $\lvert 2S_n\xi_{n+1}\rvert$ sont bornés par $2N$ : deuxième condition) : $k^2 = \mathbb{E}[S_\tau^2] - \mathbb{E}[\tau] = N^2 \cdot \frac{k}{N} - \mathbb{E}[\tau]$, donc $\mathbb{E}[\tau] = kN - k^2 = k(N - k)$.
- Cas biaisé, avec $r^S$ : $r^k = \mathbb{P}(N)\,r^N + (1 - \mathbb{P}(N))\,r^0$, donc $\mathbb{P}(N) = \frac{1 - r^k}{1 - r^N}$.
:::

:::attention Pourquoi les conditions comptent : la martingale de doublement
Stratégie : miser 1 sur pile ; si on perd, doubler la mise ; s'arrêter au premier gain. À l'arrêt, on a toujours gagné exactement 1 : $\mathbb{E}[M_\tau] = 1 \neq 0$. Contradiction ? Non : les pertes intermédiaires ne sont pas bornées (il faut une richesse infinie), et aucune des conditions du théorème n'est vérifiée. Avec une richesse finie, la petite probabilité d'une ruine énorme compense exactement les petits gains fréquents. C'est aussi l'esprit de la vente d'options très hors de la monnaie.
:::

:::exemple Démonstration de la règle des chevauchements (« abracadabra »)
Avant chaque lancer, un nouveau parieur arrive avec 1 € et parie sur le motif, lettre par lettre : il mise tout sur la première lettre (gain ×2 si elle sort), puis tout sur la deuxième, etc., et part dès qu'il perd. Jeu équitable : la richesse totale détenue par les parieurs, moins le nombre de parieurs arrivés (1 € apporté par chacun), est une martingale nulle au départ. Au moment $\tau$ où le motif apparaît, les parieurs encore présents sont ceux dont le début des paris coïncide avec une fin du motif : un parieur arrivé $\ell$ lancers avant la fin possède $2^\ell$ si le préfixe de longueur $\ell$ égale le suffixe. Théorème d'arrêt : $\mathbb{E}[\text{richesse totale}] - \mathbb{E}[\tau] = 0$, donc $\mathbb{E}[\tau] = \sum 2^\ell$ sur les chevauchements.
:::

## Arrêt optimal et récurrence à rebours

Dernier type de question classique : un jeu où l'on peut s'arrêter ou continuer. Principe : **on raisonne en partant de la fin** (induction à rebours), exactement comme pour une option américaine dans un arbre.

:::exemple Le dé qu'on peut relancer
Gain = valeur du dernier lancer, au plus $n$ lancers. Soit $v_n$ la valeur du jeu avec $n$ lancers restants. $v_1 = 3{,}5$. Avec $n$ lancers, on garde le premier résultat $x$ s'il dépasse ce qu'on obtiendrait en continuant, $v_{n-1}$ :
$$
v_n = \mathbb{E}\big[\max(X, v_{n-1})\big].
$$
$v_2 = \frac{4 + 5 + 6}{6} + \frac{3}{6} \times 3{,}5 = 2{,}5 + 1{,}75 = 4{,}25$ ; $v_3 = \frac{5 + 6}{6} + \frac46 \times 4{,}25 = \frac{11}{6} + \frac{17}{6} = \frac{14}{3}$. Fiches : [[fiche:proba-de-avec-relance]], [[fiche:proba-de-deux-relances]].
:::

:::exercice ex-de-quatre-lancers
reponse: 89/18
Même jeu avec au plus 4 lancers. Valeur du jeu ?
---
$v_4 = \mathbb{E}[\max(X, 14/3)]$ ; $14/3 \approx 4{,}67$, donc on garde 5 ou 6 au premier lancer :
$$
v_4 = \frac{5 + 6}{6} + \frac46 \times \frac{14}{3} = \frac{11}{6} + \frac{28}{9} = \frac{33 + 56}{18} = \frac{89}{18} \approx 4{,}94.
$$
La valeur tend vers 6 quand le nombre de lancers augmente, de plus en plus lentement.
:::

:::exemple Arrêt optimal avec coût : la valeur est un point fixe
On tire des uniformes sur $[0, 1]$, chaque tirage coûte $c$, on garde le dernier. La valeur $V$ vérifie $V = -c + \mathbb{E}[\max(U, V)]$ : on s'arrête dès que $U \ge V$. Comme $\mathbb{E}[\max(U, V)] = V + \mathbb{E}[(U - V)^+] = V + \frac{(1-V)^2}{2}$, il vient $c = \frac{(1 - V)^2}{2}$, donc $V = 1 - \sqrt{2c}$ ; pour $c = 0{,}01$, $V \approx 0{,}859$ ([[fiche:jeu-arret-uniforme]]). Version avec un paquet de cartes : [[fiche:mm-cartes-rouges-noires]].
:::

:::entretien Ce que l'intervieweur veut voir
Pour un temps d'attente ou une probabilité de gagner : « je définis des états et je conditionne sur le premier pas », puis écris les équations proprement avant de résoudre. Pour une ruine du joueur : cite la martingale ($S_n$, puis $S_n^2 - n$) et le théorème d'arrêt, en vérifiant à voix haute qu'il s'applique (processus arrêté borné pour $S_n$ ; pour $S_n^2 - n$, $\mathbb{E}[\tau] < \infty$ et accroissements bornés). Pour un jeu où l'on peut s'arrêter : « je pars de la fin ». Ces trois réflexes couvrent l'essentiel des questions de teneurs de marché.
:::

## Pour aller plus loin

Le chapitre [[n:mouvement-brownien]] prolonge tout ceci en temps continu : le mouvement brownien est la limite de la marche aléatoire, $W_t^2 - t$ et $e^{\theta W_t - \theta^2 t/2}$ sont les limites des martingales vues ici, et le théorème d'arrêt donne les probabilités et les temps de sortie d'un intervalle.
