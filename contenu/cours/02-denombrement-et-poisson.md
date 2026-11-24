---
titre: Dénombrement, lois discrètes et processus de Poisson
partie: Probabilités
resume: Compter sans se tromper (arrangements, combinaisons, étoiles et barres, inclusion-exclusion, principe de réflexion et nombres de Catalan), les lois discrètes usuelles et la limite de Poisson, la loi exponentielle et sa propriété sans mémoire, le processus de Poisson (amincissement, paradoxe de l'inspection, Poisson composé), les statistiques d'ordre et le collectionneur de vignettes.
duree: 3 h
fiches: proba-anniversaires proba-poker-paire proba-quinte-couleur ct-poignees proba-derangement proba-points-fixes proba-boites-vides proba-faces-distinctes proba-variance-binomiale proba-variance-geometrique proba-somme-exponentielles proba-exponentielle-sachant-somme proba-ampoules proba-attente-bus proba-min-cinq-uniformes proba-max-deux-uniformes proba-ecart-uniformes proba-produit-max-min proba-records proba-toutes-les-faces proba-coupons-moitie proba-scrutin proba-catalan proba-amincissement
---
Les sociétés de trading posent énormément de questions de **comptage** et de **temps d'attente** : cartes, dés, files d'attente, arrivées d'ordres. Elles se résolvent avec une poignée d'outils : savoir compter des configurations, reconnaître une loi usuelle, et manipuler la loi exponentielle, qui est au temps continu ce que la loi géométrique est aux lancers. Ce chapitre complète le chapitre [[n:esperance-variance-covariance]] (la méthode des indicatrices y reste l'arme principale) et prépare le chapitre [[n:conditionnement-markov-martingales]].

## Compter

:::propriete Les quatre formules de base
Pour choisir $k$ objets parmi $n$ :
| | ordre compté | ordre ignoré |
|---|---|---|
| sans remise | arrangements $\dfrac{n!}{(n - k)!}$ | combinaisons $\dbinom{n}{k} = \dfrac{n!}{k!\,(n - k)!}$ |
| avec remise | $n^k$ | $\dbinom{n + k - 1}{k}$ |
Le **coefficient multinomial** $\dfrac{n!}{n_1!\,n_2!\cdots n_r!}$ compte les façons de répartir $n$ objets distincts en groupes de tailles $n_1, \dots, n_r$ (ou les anagrammes d'un mot).
:::

:::theoreme Étoiles et barres
Le nombre de façons d'écrire $n = x_1 + \dots + x_k$ avec des entiers $x_i \ge 0$ (répartir $n$ objets **identiques** dans $k$ boîtes) vaut $\dbinom{n + k - 1}{k - 1}$.
:::

:::preuve
Représentons une répartition par une suite de $n$ étoiles (les objets) et $k - 1$ barres (les séparations entre boîtes) : par exemple $\star\star|\,|\star\star\star$ code $2 + 0 + 3$. C'est une bijection entre les répartitions et les suites de $n + k - 1$ symboles dont $k - 1$ sont des barres. On choisit la position des barres : $\binom{n + k - 1}{k - 1}$.
:::

:::exercice ex-den-etoiles
reponse: 286
De combien de façons peut-on répartir 10 pièces identiques entre 4 personnes (certaines pouvant ne rien recevoir) ?
---
Étoiles et barres avec $n = 10$, $k = 4$ : $\binom{13}{3} = 286$. Si chacun doit recevoir au moins une pièce, on en donne d'abord une à chacun et on répartit les 6 restantes : $\binom{9}{3} = 84$.
:::

:::exemple Le problème des anniversaires ([[fiche:proba-anniversaires]])
Avec $k$ personnes et 365 jours équiprobables, on calcule le complémentaire : tous les anniversaires distincts.
$$
\mathbb{P}(\text{tous distincts}) = \frac{365 \times 364 \times \dots \times (365 - k + 1)}{365^k} = \prod_{i=0}^{k-1}\Big(1 - \frac{i}{365}\Big) \approx \exp\Big(-\sum_{i<k}\frac{i}{365}\Big) = e^{-k(k-1)/730},
$$
car $1 - x \approx e^{-x}$ pour $x$ petit. Pour $k = 23$ : exactement $1 - 0{,}4927 = 50{,}7\,\%$ de chances d'une coïncidence, et l'approximation donne $1 - e^{-0{,}693} = 50{,}0\,\%$. L'intuition se trompe parce qu'elle compte les personnes (23) au lieu des **paires** ($\binom{23}{2} = 253$).
:::

:::exemple Une paire au poker ([[fiche:proba-poker-paire]])
On choisit la hauteur de la paire (13), ses deux couleurs ($\binom42$), les trois autres hauteurs toutes différentes et différentes de la paire ($\binom{12}{3}$), et une couleur pour chacune ($4^3$) :
$$
\frac{13\binom42\binom{12}{3}4^3}{\binom{52}{5}} = \frac{1\,098\,240}{2\,598\,960} \approx 42{,}3\,\%.
$$
Le piège : choisir les trois cartes isolées « parmi les 48 restantes » compte des doubles paires et des fulls (paire + brelan d'une autre hauteur), et, si l'on tire les cartes une à une ($48 \times 47 \times 46$), compte plusieurs fois la même main dans des ordres différents.
:::

## Inclusion-exclusion

:::theoreme Formule d'inclusion-exclusion
$$
\mathbb{P}\Big(\bigcup_{i=1}^n A_i\Big) = \sum_i\mathbb{P}(A_i) - \sum_{i<j}\mathbb{P}(A_i \cap A_j) + \sum_{i<j<k}\mathbb{P}(A_i \cap A_j \cap A_k) - \dots + (-1)^{n+1}\,\mathbb{P}(A_1 \cap \dots \cap A_n).
$$
:::

:::preuve Par les indicatrices
L'événement « aucun $A_i$ » a pour indicatrice $\prod_i(1 - \mathbf{1}_{A_i})$. Donc
$$
\mathbf{1}_{\bigcup A_i} = 1 - \prod_{i=1}^n\big(1 - \mathbf{1}_{A_i}\big) = \sum_i\mathbf{1}_{A_i} - \sum_{i<j}\mathbf{1}_{A_i}\mathbf{1}_{A_j} + \dots
$$
en développant le produit, avec $\mathbf{1}_{A_i}\mathbf{1}_{A_j} = \mathbf{1}_{A_i \cap A_j}$. On prend l'espérance, terme à terme (linéarité).
:::

:::theoreme Dérangements ([[fiche:proba-derangement]])
La probabilité qu'une permutation aléatoire de $n$ éléments n'ait **aucun point fixe** vaut
$$
\sum_{k=0}^n\frac{(-1)^k}{k!} \xrightarrow[n \to \infty]{} e^{-1} \approx 0{,}368.
$$
:::

:::preuve
Soit $A_i$ l'événement « $i$ est un point fixe ». Pour $k$ indices donnés, $\mathbb{P}(A_{i_1} \cap \dots \cap A_{i_k}) = \frac{(n - k)!}{n!}$ (les $n - k$ autres éléments se permutent librement), et il y a $\binom nk$ choix d'indices : la $k$-ième somme vaut $\binom nk\frac{(n - k)!}{n!} = \frac1{k!}$. Par inclusion-exclusion, $\mathbb{P}(\text{au moins un point fixe}) = \sum_{k=1}^n\frac{(-1)^{k+1}}{k!}$, et on passe au complémentaire. La série converge très vite : dès $n = 6$, on est à $10^{-3}$ de $e^{-1}$.
:::

:::intuition Le nombre de points fixes ressemble à une loi de Poisson
Le **nombre moyen** de points fixes vaut exactement 1 pour tout $n$ (indicatrices : $n \times \frac1n$, [[fiche:proba-points-fixes]]), et sa loi tend vers une loi de Poisson de paramètre 1 : $\mathbb{P}(\text{aucun}) \to e^{-1}$. C'est un exemple de la « loi des événements rares » vue plus bas.
:::

:::exercice ex-den-derangement
reponse: 3/8
Quatre traders déposent leur badge dans une boîte et en reprennent un au hasard. Probabilité qu'aucun ne récupère le sien ?
---
$\frac{1}{0!} - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \frac{1}{4!} = 1 - 1 + \frac12 - \frac16 + \frac1{24} = \frac{9}{24} = \frac38$. Il y a donc 9 dérangements parmi les 24 permutations.
:::

:::exercice ex-den-toutes-faces
reponse: 720/6**6
tolerance: 0.001
On lance six dés. Probabilité de voir les six faces ?
---
Il faut une permutation des six faces : $\frac{6!}{6^6} = \frac{720}{46\,656} \approx 1{,}54\,\%$. Par inclusion-exclusion sur les faces manquantes, on trouverait la même chose : $\sum_{k=0}^6(-1)^k\binom6k\big(\frac{6 - k}{6}\big)^6$.
:::

## Chemins et principe de réflexion

:::propriete Chemins dans une grille
Un chemin de $(0, 0)$ à $(m, n)$ par pas « droite » ou « haut » est une suite de $m + n$ pas dont $n$ vers le haut : il y en a $\binom{m + n}{n}$. Une marche de $\pm1$ de longueur $N$ qui finit en $k$ a $\frac{N + k}{2}$ pas montants : il y en a $\binom{N}{(N + k)/2}$.
:::

:::theoreme Principe de réflexion (discret)
Soit $a, b > 0$. Le nombre de chemins de $\pm1$ allant de la hauteur $a$ à la hauteur $b$ en $N$ pas **et touchant 0** est égal au nombre de chemins allant de $-a$ à $b$ en $N$ pas.
:::

:::preuve
À un chemin qui part de $a$ et touche 0, on associe le chemin obtenu en **réfléchissant** (changeant le signe de) sa partie avant le premier passage en 0. Il part de $-a$ et arrive en $b$. Inversement, tout chemin de $-a$ à $b$ doit traverser 0 (il change de signe) ; en réfléchissant sa partie avant le premier passage en 0, on retrouve un chemin de $a$ à $b$ touchant 0. Les deux opérations sont inverses l'une de l'autre : c'est une bijection. C'est la version discrète du principe de réflexion du mouvement brownien (chapitre [[n:mouvement-brownien]]).
:::

:::theoreme Le théorème du scrutin
Dans un dépouillement aléatoire où A reçoit $a$ voix et B en reçoit $b < a$, la probabilité que A soit **strictement en tête tout au long** du dépouillement vaut $\dfrac{a - b}{a + b}$.
:::

:::preuve
Les dépouillements sont les $\binom{a + b}{a}$ chemins (voix pour A : $+1$, pour B : $-1$) de 0 à $a - b$. Les bons commencent par A, puis vont de 1 à $a - b$ sans toucher 0. Il y a $\binom{a + b - 1}{a - 1}$ chemins de 1 à $a - b$ ; ceux qui touchent 0 sont, par réflexion, en bijection avec les chemins de $-1$ à $a - b$, qui commencent par B : il y en a $\binom{a + b - 1}{a}$. Donc
$$
\frac{\binom{a+b-1}{a-1} - \binom{a+b-1}{a}}{\binom{a+b}{a}} = \frac{a}{a+b} - \frac{b}{a+b} = \frac{a - b}{a + b}.
$$
(On utilise $\binom{a+b-1}{a-1} = \frac{a}{a+b}\binom{a+b}{a}$ et $\binom{a+b-1}{a} = \frac{b}{a+b}\binom{a+b}{a}$.)
:::

:::exercice ex-den-scrutin
reponse: 1/5
Un candidat obtient 6 voix, l'autre 4. Probabilité que le premier soit strictement en tête pendant tout le dépouillement ?
---
$\frac{6 - 4}{6 + 4} = \frac15$. Vérification par le décompte : $\binom95 - \binom96 = 126 - 84 = 42$ bons chemins sur $\binom{10}{4} = 210$.
:::

:::theoreme Nombres de Catalan
Le nombre de chemins de $\pm1$ de longueur $2n$, partant de 0, revenant en 0 et ne passant **jamais en dessous de 0** (chemins de Dyck) vaut
$$
C_n = \binom{2n}{n} - \binom{2n}{n+1} = \frac{1}{n+1}\binom{2n}{n}.
$$
:::

:::preuve
Parmi les $\binom{2n}{n}$ chemins de 0 à 0, les mauvais touchent $-1$. En réfléchissant par rapport à $-1$ la partie qui suit le premier passage en $-1$, on obtient une bijection avec les chemins de 0 à $-2$, qui ont $n - 1$ pas montants : $\binom{2n}{n-1} = \binom{2n}{n+1}$. Enfin $\binom{2n}{n+1} = \frac{n}{n+1}\binom{2n}{n}$. Les nombres de Catalan (1, 1, 2, 5, 14, 42…) comptent aussi les parenthésages bien formés (une question de code classique, chapitre [[n:code-et-algorithmique]]).
:::

:::exercice ex-den-catalan
reponse: 42
Combien de suites de 5 parenthèses ouvrantes et 5 fermantes sont bien formées ?
---
Une parenthèse ouvrante est un pas montant, une fermante un pas descendant ; « bien formée » signifie ne jamais descendre sous 0. $C_5 = \frac{1}{6}\binom{10}{5} = \frac{252}{6} = 42$.
:::

## Les lois discrètes usuelles

:::propriete Tableau à connaître
| Loi | Situation | $\mathbb{P}(X = k)$ | Espérance | Variance |
|---|---|---|---|---|
| Bernoulli $\mathcal{B}(p)$ | un essai | $p$ ou $1 - p$ | $p$ | $p(1 - p)$ |
| Binomiale $\mathcal{B}(n, p)$ | succès en $n$ essais indépendants | $\binom nk p^k(1 - p)^{n-k}$ | $np$ | $np(1 - p)$ |
| Géométrique $\mathcal{G}(p)$ | rang du premier succès | $(1 - p)^{k-1}p$, $k \ge 1$ | $\frac1p$ | $\frac{1 - p}{p^2}$ |
| Poisson $\mathcal{P}(\lambda)$ | nombre d'événements rares | $e^{-\lambda}\frac{\lambda^k}{k!}$ | $\lambda$ | $\lambda$ |
| Hypergéométrique | succès en $n$ tirages **sans remise** | $\frac{\binom Kk\binom{N-K}{n-k}}{\binom Nn}$ | $n\frac KN$ | $n\frac KN\big(1 - \frac KN\big)\frac{N - n}{N - 1}$ |
:::

Les espérances et variances de la binomiale et de l'hypergéométrique se démontrent par les indicatrices (chapitre [[n:esperance-variance-covariance]]) ; celles de la géométrique par le premier pas (chapitre [[n:conditionnement-markov-martingales]]). Le facteur $\frac{N - n}{N - 1}$ de l'hypergéométrique vient des covariances **négatives** entre tirages sans remise.

:::theoreme Moyenne et variance de la loi de Poisson
Si $X \sim \mathcal{P}(\lambda)$, alors $\mathbb{E}[X] = \operatorname{Var}(X) = \lambda$ et $\mathbb{E}[e^{tX}] = e^{\lambda(e^t - 1)}$.
:::

:::preuve
$\mathbb{E}[e^{tX}] = \sum_k e^{-\lambda}\frac{(\lambda e^t)^k}{k!} = e^{-\lambda}e^{\lambda e^t}$. De même $\mathbb{E}[X] = \sum_{k \ge 1}ke^{-\lambda}\frac{\lambda^k}{k!} = \lambda\sum_{k \ge 1}e^{-\lambda}\frac{\lambda^{k-1}}{(k-1)!} = \lambda$, et $\mathbb{E}[X(X - 1)] = \lambda^2$ par le même décalage (deux fois), d'où $\operatorname{Var}(X) = \lambda^2 + \lambda - \lambda^2 = \lambda$.

Conséquence : la somme de deux Poisson **indépendantes** de paramètres $\lambda$ et $\mu$ est une Poisson de paramètre $\lambda + \mu$ (le produit des fonctions génératrices est $e^{(\lambda + \mu)(e^t - 1)}$).
:::

:::theoreme Loi des événements rares
Si $X_n \sim \mathcal{B}(n, \lambda/n)$, alors pour tout $k$, $\mathbb{P}(X_n = k) \to e^{-\lambda}\dfrac{\lambda^k}{k!}$.
:::

:::preuve
$$
\binom nk\Big(\frac\lambda n\Big)^k\Big(1 - \frac\lambda n\Big)^{n-k} = \underbrace{\frac{n(n-1)\cdots(n-k+1)}{n^k}}_{\to 1}\;\frac{\lambda^k}{k!}\;\underbrace{\Big(1 - \frac\lambda n\Big)^n}_{\to e^{-\lambda}}\;\underbrace{\Big(1 - \frac\lambda n\Big)^{-k}}_{\to 1}.
$$
:::

:::exercice ex-den-rares
reponse: 0.998**1000
tolerance: 0.001
Chacun des 1 000 ordres de la journée a une probabilité de 0,2 % d'être rejeté, indépendamment. Probabilité qu'aucun ne soit rejeté ? Compare à l'approximation de Poisson.
---
Exactement $0{,}998^{1000} \approx 0{,}1351$. Poisson de paramètre $1\,000 \times 0{,}002 = 2$ : $e^{-2} \approx 0{,}1353$. L'approximation est excellente dès que $p$ est petit.
:::

## La loi exponentielle

:::definition Loi exponentielle
$T \sim \mathcal{E}(\lambda)$ a pour densité $\lambda e^{-\lambda t}$ sur $[0, \infty[$ : $\mathbb{P}(T > t) = e^{-\lambda t}$, $\mathbb{E}[T] = \frac1\lambda$, $\operatorname{Var}(T) = \frac1{\lambda^2}$. C'est la loi d'une durée avant un événement qui survient au **taux constant** $\lambda$ (un défaut au chapitre [[n:taux-et-credit]], une exécution d'ordre au chapitre [[n:market-making-et-microstructure]]).
:::

:::theoreme Absence de mémoire
Pour tous $s, t \ge 0$ : $\mathbb{P}(T > s + t \mid T > s) = \mathbb{P}(T > t)$. Avoir déjà attendu $s$ ne change rien à l'attente restante. L'exponentielle est la **seule** loi continue sur $[0, \infty[$ qui ait cette propriété.
:::

:::preuve
$\mathbb{P}(T > s + t \mid T > s) = \frac{e^{-\lambda(s + t)}}{e^{-\lambda s}} = e^{-\lambda t}$. Réciproquement, si $G(t) = \mathbb{P}(T > t)$ vérifie $G(s + t) = G(s)G(t)$ et est continue (décroissante), alors $\ln G$ est additive et continue, donc linéaire : $G(t) = e^{-\lambda t}$.
:::

:::theoreme Minimum d'exponentielles indépendantes
Si $T_1, \dots, T_n$ sont indépendantes, $T_i \sim \mathcal{E}(\lambda_i)$, alors $\min_i T_i \sim \mathcal{E}(\lambda_1 + \dots + \lambda_n)$ et la probabilité que $T_j$ soit le plus petit vaut $\dfrac{\lambda_j}{\lambda_1 + \dots + \lambda_n}$.
:::

:::preuve
$\mathbb{P}(\min T_i > t) = \prod_i\mathbb{P}(T_i > t) = e^{-(\sum\lambda_i)t}$. Pour deux variables : $\mathbb{P}(T_1 < T_2) = \int_0^\infty\lambda_1e^{-\lambda_1t}\,e^{-\lambda_2t}\,dt = \frac{\lambda_1}{\lambda_1 + \lambda_2}$ ; pour $n$, on applique ce calcul à $T_j$ contre le minimum des autres, qui est exponentiel de paramètre $\sum_{i \ne j}\lambda_i$.
:::

:::exemple Deux ampoules ([[fiche:proba-ampoules]])
Deux ampoules de durées de vie $\mathcal{E}(1)$ indépendantes (moyenne 1 an). La première panne survient après $\min \sim \mathcal{E}(2)$, soit $\frac12$ an en moyenne. Par absence de mémoire, l'ampoule restante est « comme neuve » : il faut encore 1 an en moyenne. Total $\mathbb{E}[\max] = \frac12 + 1 = \frac32$ an.
:::

:::exercice ex-den-min-exp
reponse: 1/6
Trois serveurs tombent en panne selon des lois exponentielles indépendantes de taux 1, 2 et 3 par an. Probabilité que le premier à tomber soit celui de taux 1 ?
---
$\frac{1}{1 + 2 + 3} = \frac16$. Et la première panne survient en moyenne après $\frac16$ an, soit environ deux mois.
:::

:::propriete Somme d'exponentielles (loi Gamma)
La somme de $n$ exponentielles indépendantes $\mathcal{E}(\lambda)$ a pour densité $\lambda e^{-\lambda t}\dfrac{(\lambda t)^{n-1}}{(n-1)!}$ (loi d'Erlang). Pour $n = 2$, par convolution : $\int_0^t\lambda e^{-\lambda s}\,\lambda e^{-\lambda(t - s)}\,ds = \lambda^2te^{-\lambda t}$. Conséquence : $\mathbb{P}(X + Y \le 1) = 1 - 2e^{-1}$ pour $\lambda = 1$ ([[fiche:proba-somme-exponentielles]]). Et **sachant** $X + Y = s$, $X$ est uniforme sur $[0, s]$ (la densité jointe $\lambda^2e^{-\lambda(x + y)}$ est constante sur la droite $x + y = s$), d'où $\mathbb{E}[X \mid X + Y = 2] = 1$ ([[fiche:proba-exponentielle-sachant-somme]]).
:::

## Le processus de Poisson

:::definition Processus de Poisson d'intensité $\lambda$
Un processus de comptage $(N_t)_{t \ge 0}$, $N_0 = 0$, est un processus de Poisson d'intensité $\lambda$ si ses accroissements sur des intervalles disjoints sont **indépendants** et si $N_{t+h} - N_t \sim \mathcal{P}(\lambda h)$. De façon équivalente, les durées entre deux événements successifs sont des exponentielles $\mathcal{E}(\lambda)$ indépendantes.
:::

:::preuve Du lien entre les deux définitions (premier temps d'arrivée)
Le premier événement $T_1$ survient après $t$ si et seulement si il n'y a aucun événement dans $[0, t]$ : $\mathbb{P}(T_1 > t) = \mathbb{P}(N_t = 0) = e^{-\lambda t}$. Donc $T_1 \sim \mathcal{E}(\lambda)$. Par indépendance des accroissements, le processus « redémarre » après chaque événement, et les durées suivantes sont des copies indépendantes.
:::

:::theoreme Amincissement et superposition
1. **Amincissement** : si chaque événement d'un processus de Poisson d'intensité $\lambda$ est conservé avec probabilité $p$, indépendamment, les événements conservés forment un processus de Poisson d'intensité $\lambda p$, **indépendant** de celui des événements rejetés (intensité $\lambda(1 - p)$).
2. **Superposition** : la réunion de deux processus de Poisson indépendants d'intensités $\lambda$ et $\mu$ est un processus de Poisson d'intensité $\lambda + \mu$.
:::

:::preuve De l'amincissement, pour les comptages sur $[0, t]$
Notons $A$ et $B$ les nombres d'événements conservés et rejetés, $q = 1 - p$. Sachant $N_t = a + b$, $A$ suit une binomiale :
$$
\mathbb{P}(A = a, B = b) = e^{-\lambda t}\frac{(\lambda t)^{a+b}}{(a + b)!}\binom{a + b}{a}p^aq^b = e^{-\lambda pt}\frac{(\lambda pt)^a}{a!}\;\cdot\;e^{-\lambda qt}\frac{(\lambda qt)^b}{b!}.
$$
La loi jointe se factorise : $A \sim \mathcal{P}(\lambda pt)$ et $B \sim \mathcal{P}(\lambda qt)$ sont **indépendantes**. Résultat surprenant : savoir qu'il y a eu beaucoup d'événements rejetés n'apprend rien sur le nombre d'événements conservés.
:::

:::exercice ex-den-amincissement
reponse: exp(-1)
tolerance: 0.001
Des ordres clients arrivent selon un processus de Poisson de 6 par heure ; un tiers sont de gros ordres, indépendamment. Probabilité de ne recevoir aucun gros ordre pendant 30 minutes ?
---
Les gros ordres forment un processus de Poisson d'intensité $6 \times \frac13 = 2$ par heure ; sur une demi-heure, le nombre est $\mathcal{P}(1)$ et $\mathbb{P}(0) = e^{-1} \approx 0{,}368$.
:::

:::theoreme Le paradoxe de l'inspection ([[fiche:proba-attente-bus]])
Des bus passent selon un processus de Poisson, un toutes les 10 minutes en moyenne. Un voyageur qui arrive à un instant quelconque attend en moyenne **10 minutes**, et non 5 ; l'intervalle entre deux bus dans lequel il tombe dure en moyenne **20 minutes**.
:::

:::preuve
L'attente jusqu'au prochain bus est exponentielle de paramètre $\lambda$ par absence de mémoire : moyenne $\frac1\lambda = 10$ minutes. Le temps écoulé depuis le bus précédent l'est aussi (en regardant le temps à l'envers, pour un processus installé depuis longtemps). L'intervalle qui contient l'instant d'arrivée dure donc en moyenne $\frac2\lambda = 20$ minutes. Explication : un instant au hasard tombe plus souvent dans un **long** intervalle que dans un court ; la loi de l'intervalle observé est pondérée par sa longueur, de moyenne $\frac{\mathbb{E}[L^2]}{\mathbb{E}[L]} = \frac{2/\lambda^2}{1/\lambda} = \frac2\lambda$. Le même biais explique que « les classes semblent toujours pleines » ou qu'un fonds tiré au hasard parmi les investisseurs soit plus gros que la moyenne.
:::

:::widget poisson
:::

:::propriete Processus de Poisson composé
Si des sauts de tailles $Y_1, Y_2, \dots$ indépendantes, de même loi, arrivent selon un processus de Poisson d'intensité $\lambda$ (indépendant des $Y_i$), la somme $S_t = \sum_{i=1}^{N_t}Y_i$ vérifie
$$
\mathbb{E}[S_t] = \lambda t\,\mathbb{E}[Y], \qquad \operatorname{Var}(S_t) = \lambda t\,\mathbb{E}[Y^2].
$$
:::

:::preuve
Conditionnellement à $N_t = n$, $S_t$ est une somme de $n$ termes : $\mathbb{E}[S_t \mid N_t] = N_t\mathbb{E}[Y]$ et $\operatorname{Var}(S_t \mid N_t) = N_t\operatorname{Var}(Y)$. Par la formule de la variance totale (chapitre [[n:conditionnement-markov-martingales]]) :
$$
\operatorname{Var}(S_t) = \mathbb{E}[N_t]\operatorname{Var}(Y) + \operatorname{Var}(N_t)\,\mathbb{E}[Y]^2 = \lambda t\big(\operatorname{Var}(Y) + \mathbb{E}[Y]^2\big) = \lambda t\,\mathbb{E}[Y^2].
$$
C'est la brique des **modèles à sauts** (Merton ajoute un Poisson composé au brownien géométrique pour produire des krachs et un smile de court terme) et des modèles de pertes en assurance et en crédit.
:::

:::exercice ex-den-compose
reponse: 3*(0.02**2+0.05**2)
tolerance: 0.001
Un actif subit en moyenne 3 sauts par an (processus de Poisson). La taille d'un saut (rendement logarithmique) a pour moyenne $-2\,\%$ et pour écart-type $5\,\%$. Quelle variance annuelle les sauts ajoutent-ils ?
---
$\lambda\,\mathbb{E}[Y^2] = 3 \times (0{,}02^2 + 0{,}05^2) = 3 \times 0{,}0029 = 0{,}0087$, soit une volatilité de $\sqrt{0{,}0087} \approx 9{,}3\,\%$ due aux seuls sauts.
:::

## Statistiques d'ordre et temps d'attente

:::theoreme Statistiques d'ordre de variables uniformes
Soient $U_1, \dots, U_n$ uniformes indépendantes sur $[0, 1]$ et $U_{(1)} \le \dots \le U_{(n)}$ leurs valeurs triées. La $k$-ième a pour densité
$$
f_{(k)}(x) = \frac{n!}{(k - 1)!\,(n - k)!}\,x^{k-1}(1 - x)^{n-k} \qquad \text{et} \qquad \mathbb{E}\big[U_{(k)}\big] = \frac{k}{n + 1}.
$$
:::

:::preuve
Pour que la $k$-ième valeur tombe dans $[x, x + dx]$, il faut qu'une des $n$ variables y tombe (probabilité $dx$), que $k - 1$ des $n - 1$ autres soient en dessous de $x$ et les $n - k$ restantes au-dessus : $n\binom{n-1}{k-1}x^{k-1}(1 - x)^{n-k}\,dx$, ce qui donne la densité. Pour l'espérance, on utilise l'intégrale bêta $\int_0^1x^a(1 - x)^b\,dx = \frac{a!\,b!}{(a + b + 1)!}$ :
$$
\mathbb{E}\big[U_{(k)}\big] = \frac{n!}{(k-1)!\,(n-k)!}\cdot\frac{k!\,(n - k)!}{(n + 1)!} = \frac{k}{n + 1}.
$$
**Intuition** : les $n$ points découpent $[0, 1]$ en $n + 1$ morceaux qui ont, par symétrie, la même longueur moyenne $\frac{1}{n + 1}$. D'où $\mathbb{E}[\min] = \frac{1}{n+1}$ ([[fiche:proba-min-cinq-uniformes]]), $\mathbb{E}[\max] = \frac{n}{n+1}$ ([[fiche:proba-max-deux-uniformes]]) et $\mathbb{E}[\max - \min] = \frac{n - 1}{n + 1}$.
:::

:::exercice ex-den-ordre
reponse: 2/5
On tire 4 nombres uniformes sur $[0, 1]$. Espérance du deuxième plus petit ?
---
$\frac{k}{n + 1} = \frac{2}{5}$.
:::

:::theoreme Le collectionneur de vignettes ([[fiche:proba-toutes-les-faces]])
Pour obtenir les $n$ vignettes d'une collection (chaque achat en donne une au hasard), il faut en moyenne
$$
\mathbb{E}[T] = n\Big(1 + \frac12 + \dots + \frac1n\Big) = nH_n \approx n\ln n.
$$
:::

:::preuve
Découpons l'attente en étapes : quand on a déjà $i$ vignettes distinctes, chaque achat en apporte une nouvelle avec probabilité $\frac{n - i}{n}$, donc l'étape dure une géométrique de moyenne $\frac{n}{n - i}$. Par linéarité, $\mathbb{E}[T] = \sum_{i=0}^{n-1}\frac{n}{n - i} = n\sum_{j=1}^n\frac1j$. Pour un dé : $6 \times 2{,}45 = 14{,}7$ lancers. Les dernières vignettes coûtent le plus cher : la dernière demande à elle seule $n$ achats en moyenne ([[fiche:proba-coupons-moitie]]).
:::

:::propriete Records
Parmi $n$ valeurs indépendantes de même loi continue observées dans l'ordre, la $i$-ième est un record (plus grande que toutes les précédentes) avec probabilité $\frac1i$ (par symétrie, chacune des $i$ premières a la même chance d'être la plus grande). Le nombre moyen de records vaut $H_n = 1 + \frac12 + \dots + \frac1n$ : environ 2,9 pour $n = 10$, seulement 7,5 pour $n = 1\,000$ ([[fiche:proba-records]]).
:::

## Pièges classiques

:::attention Les erreurs les plus fréquentes
- Compter des configurations **ordonnées** au numérateur et **non ordonnées** au dénominateur (ou l'inverse).
- Oublier qu'un tirage sans remise rend les tirages dépendants (hypergéométrique, pas binomiale).
- Croire qu'après une longue attente, l'événement « doit » arriver : l'exponentielle et la géométrique n'ont pas de mémoire.
- Répondre 5 minutes au paradoxe de l'inspection.
- Confondre la loi de Poisson (un **nombre** d'événements) et l'exponentielle (une **durée** entre événements).
- Additionner des variances de Poisson composées en oubliant le terme $\mathbb{E}[Y]^2$.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Probabilité d'une paire au poker ? D'une couleur ? »** Compter étape par étape, en vérifiant qu'on ne compte ni trop (meilleures mains) ni plusieurs fois.
- **« On mélange un jeu : probabilité qu'aucune carte ne reste à sa place ? »** Inclusion-exclusion, $e^{-1}$, et le nombre moyen de points fixes égal à 1.
- **« Combien de lancers pour voir les six faces ? »** Collectionneur, $6H_6 = 14{,}7$.
- **« Deux ampoules exponentielles : quand la seconde grille-t-elle ? »** Minimum $\mathcal{E}(2)$ puis absence de mémoire.
- **« Tu attends le bus, un toutes les 10 minutes en moyenne : combien attends-tu ? »** 10 minutes si les passages sont poissonniens (5 s'ils sont parfaitement réguliers), et pourquoi.
- **« Espérance du minimum de 5 uniformes ? »** $\frac16$, par l'argument de symétrie des morceaux.
:::
