---
titre: Code et algorithmique pour les entretiens
partie: Programmation
resume: La méthode pour un exercice de code en direct, la complexité (avec les deux preuves qu'on demande : coût amorti d'un tableau dynamique, borne n log n du tri), les structures de données et les techniques qui résolvent la plupart des questions (deux pointeurs, fenêtre glissante, sommes préfixes, tas, dichotomie, programmation dynamique), les grands classiques de la finance en Python avec leur preuve de correction, puis les pièges de Python, NumPy et pandas, l'essentiel du C++ et du SQL.
duree: 4 h
fiches: algo-two-sum algo-paires-nombre algo-achat-vente-une-fois algo-kadane algo-drawdown algo-moyenne-mobile algo-mediane-flux algo-k-plus-grands algo-fusion-intervalles algo-recherche-binaire algo-comparaisons-dichotomie algo-parentheses algo-escalier algo-chemins-grille algo-lru algo-reservoir algo-melange algo-rand7 algo-dict-complexite algo-mutable-defaut py-copie py-decorateur algo-generateurs algo-gil algo-flottants algo-numpy-vectorisation algo-pandas-pieges algo-cpp-bases cpp-virtuel cpp-move cpp-comportement-indefini sql-group-by sql-fenetre sql-rendement-lag sql-jointures sql-dedoublonnage sql-null algo-amorti
---
Les fonds quantitatifs (QRT, Squarepoint, et de plus en plus les autres) font passer un ou plusieurs entretiens de **code en direct** : un problème d'algorithmique de niveau « moyen », en Python, sur un éditeur partagé, et parfois de la manipulation de données avec NumPy ou pandas. Les banques posent plutôt des questions de C++ et de conception (chapitre [[n:entretiens]]). Ce chapitre ne remplace pas la pratique (il faut écrire du code, beaucoup), mais il donne la méthode, les quinze techniques qui couvrent l'essentiel, et les preuves de correction qu'un intervieweur quantitatif aime demander.

## La méthode, en direct

:::methode Six étapes, à voix haute
1. **Reformuler** et poser les questions : taille des entrées, valeurs possibles (négatives, doublons, vide), ce qu'on renvoie en cas d'égalité.
2. **Un exemple à la main**, petit, plus un cas limite.
3. **La solution naïve** et sa complexité, même si elle est lente : elle montre qu'on a compris et sert de référence pour tester.
4. **Optimiser** : quelle structure de données évite le travail répété ? Annonce la complexité visée avant de coder.
5. **Coder proprement** : noms explicites, fonctions courtes, pas d'astuce illisible.
6. **Tester** en déroulant l'exemple et les cas limites (tableau vide, un élément, tout négatif), puis **redonner la complexité** en temps et en mémoire.
:::

## Complexité

:::definition Notation $O$
$f(n) = O(g(n))$ si $f(n) \le Cg(n)$ pour $n$ assez grand. Ordres de grandeur à connaître, pour $n = 10^6$ et environ $10^8$ opérations simples par seconde en C++ (dix à cent fois moins en Python pur) : $O(\log n)$ instantané, $O(n)$ et $O(n\log n)$ confortables, $O(n^2)$ hors de portée ($10^{12}$).
:::

:::theoreme Coût amorti de l'ajout dans un tableau dynamique
Un tableau dynamique qui multiplie sa capacité par un facteur constant $r > 1$ quand il est plein (souvent $r = 2$ pour un `std::vector`, environ $1{,}125$ pour une liste CPython) permet $n$ ajouts en $O(n)$ au total : chaque ajout coûte $O(1)$ **en moyenne amortie**.
:::

:::preuve
Un ajout coûte 1, plus la recopie de tous les éléments quand on double. Partant de la capacité 1, les recopies ont lieu aux tailles $1, 2, 4, \dots, 2^k < n$ et coûtent au total $1 + 2 + \dots + 2^k = 2^{k+1} - 1 < 2n$. Le coût total est donc inférieur à $n + 2n = 3n$. Pour un facteur $r$ quelconque, les recopies forment encore une suite géométrique, de somme inférieure à $\frac{n}{r - 1}$ : toujours $O(n)$, avec une constante plus grande quand $r$ est proche de 1. (Avec une croissance **additive**, par exemple de 10 cases à chaque fois, on aurait des recopies de $10, 20, 30, \dots$, soit $O(n^2)$ au total : c'est pourquoi on multiplie.)
:::

:::theoreme Un tri par comparaisons demande au moins $\log_2(n!) \approx n\log_2n$ comparaisons
:::

:::preuve
Un algorithme de tri par comparaisons est un **arbre de décision** binaire : chaque comparaison oriente vers un des deux sous-arbres, et chaque feuille correspond à un ordre de sortie. Il doit distinguer les $n!$ permutations possibles, donc avoir au moins $n!$ feuilles ; un arbre binaire de hauteur $h$ a au plus $2^h$ feuilles. Donc $h \ge \log_2(n!)$, et par la formule de Stirling, $\log_2(n!) = n\log_2n - n\log_2e + O(\log n)$. Le tri fusion l'atteint au premier ordre (environ $n\log_2n$ comparaisons) ; le tri par tas (environ $2n\log_2n$) et le tri rapide en moyenne ($2n\ln n \approx 1{,}39\,n\log_2n$) l'atteignent à une constante près : tous sont en $O(n\log n)$, optimaux en ordre de grandeur.
:::

:::exercice ex-code-tri-cinq
reponse: 7
Combien de comparaisons faut-il au minimum, dans le pire cas, pour trier 5 éléments distincts (borne de l'arbre de décision) ?
---
$\lceil\log_2(5!)\rceil = \lceil\log_2 120\rceil = 7$, car $2^6 = 64 < 120 \le 128 = 2^7$. On sait trier 5 éléments en 7 comparaisons : la borne est atteinte.
:::

:::exercice ex-code-dichotomie
reponse: 20
Une recherche dichotomique dans un tableau trié d'un million d'éléments : combien de comparaisons au plus pour savoir si une valeur est présente ?
---
Chaque comparaison divise l'intervalle restant par deux : il en faut $\lceil\log_2(10^6 + 1)\rceil = 20$ ([[fiche:algo-comparaisons-dichotomie]]). Un milliard d'éléments : 30.
:::

## Les structures de données

:::propriete Ce que coûte chaque opération (Python)
| Structure | Accès | Recherche | Ajout / retrait | Usage typique |
|---|---|---|---|---|
| `list` | $O(1)$ par indice | $O(n)$ | $O(1)$ amorti à la fin, $O(n)$ au début | séquence ordonnée |
| `collections.deque` | $O(1)$ aux extrémités | $O(n)$ | $O(1)$ aux deux bouts | file, fenêtre glissante |
| `dict`, `set` | | $O(1)$ en moyenne | $O(1)$ en moyenne | comptage, déjà vu ? |
| `heapq` (tas binaire) | minimum en $O(1)$ | | $O(\log n)$ | $k$ plus grands, médiane, planification |
| tableau trié + `bisect` | | $O(\log n)$ | $O(n)$ (décalage) | requêtes par intervalle |
Une table de hachage est en $O(1)$ **en moyenne** (si la fonction de hachage répartit bien les clés) et $O(n)$ dans le pire cas ([[fiche:algo-dict-complexite]]).
:::

## Quinze techniques qui couvrent l'essentiel

:::methode Reconnaître la technique
- « Paire ou complément » → **table de hachage** (déjà vu ?).
- Tableau trié, ou qu'on peut trier → **deux pointeurs** ou **dichotomie**.
- Sous-tableau contigu de somme ou de longueur optimale → **fenêtre glissante** ou **sommes préfixes**.
- « $k$ plus grands », « médiane d'un flux », « prochain événement » → **tas**.
- Intervalles → **trier par début, puis balayer** ([[fiche:algo-fusion-intervalles]]).
- Parenthèses, annulation du dernier élément → **pile** ([[fiche:algo-parentheses]]).
- Nombre de façons, optimum sur des choix successifs → **programmation dynamique**.
- « Le plus petit $x$ tel que… » avec une condition monotone → **dichotomie sur la réponse**.
:::

:::exemple Somme de deux nombres en $O(n)$ ([[fiche:algo-two-sum]])
```python
def deux_sommes(nombres, cible):
    vus = {}                      # valeur -> indice
    for i, x in enumerate(nombres):
        if cible - x in vus:
            return vus[cible - x], i
        vus[x] = i
    return None
```
Naïf : deux boucles, $O(n^2)$. Ici une seule passe et un dictionnaire : $O(n)$ en temps et en mémoire. Variante : **compter** les paires de somme donnée, en ajoutant à chaque élément le nombre de fois où son complément a déjà été vu ([[fiche:algo-paires-nombre]]).
:::

:::exercice ex-code-paires
reponse: 3
Combien de paires d'indices $i < j$ ont une somme égale à 6 dans le tableau $(1, 5, 7, -1, 5)$ ?
---
$(1, 5)$ deux fois (avec chacun des deux 5) et $(7, -1)$ : 3 paires. Avec le compteur : en lisant 5, on a vu un 1 (+1) ; en lisant $-1$, on a vu un 7 (+1) ; en lisant le second 5, on a vu un 1 (+1).
:::

:::exemple Acheter puis vendre une fois ([[fiche:algo-achat-vente-une-fois]])
```python
def meilleur_gain(prix):
    meilleur, plus_bas = 0, float("inf")
    for p in prix:
        plus_bas = min(plus_bas, p)          # meilleur prix d'achat jusqu'ici
        meilleur = max(meilleur, p - plus_bas)
    return meilleur
```
**Invariant** : après avoir lu $p_0, \dots, p_t$, `plus_bas` est $\min_{s \le t}p_s$ et `meilleur` est le meilleur gain avec une vente au plus tard en $t$. Si la vente optimale a lieu en $t^*$, l'achat optimal est le minimum avant $t^*$, que l'invariant contient à ce moment : la réponse est exacte. $O(n)$, $O(1)$ en mémoire.
:::

:::exemple Drawdown maximal ([[fiche:algo-drawdown]])
```python
def drawdown_max(valeurs):
    sommet, pire = valeurs[0], 0.0
    for v in valeurs:
        sommet = max(sommet, v)
        pire = max(pire, (sommet - v) / sommet)
    return pire
```
Même structure que le problème précédent : on garde le **plus haut** atteint jusqu'ici. C'est une question récurrente chez les fonds, souvent suivie de « et la durée du drawdown ? » (on mémorise la date du sommet).
:::

:::exercice ex-code-drawdown
reponse: 50/130
Valeurs successives d'un portefeuille : 100, 120, 90, 130, 80, 110, 140, 100. Drawdown maximal (en fraction) ?
---
Les sommets successifs sont 100, 120, 130, 140. Depuis 130, la valeur tombe à 80 : $\frac{50}{130} \approx 38{,}5\,\%$. Les autres baisses (120 → 90 : 25 % ; 140 → 100 : 28,6 %) sont moindres.
:::

:::theoreme Algorithme de Kadane ([[fiche:algo-kadane]])
La plus grande somme d'un sous-tableau contigu non vide se calcule en une passe :
```python
def kadane(a):
    meilleur = courant = a[0]
    for x in a[1:]:
        courant = max(x, courant + x)   # meilleure somme finissant ici
        meilleur = max(meilleur, courant)
    return meilleur
```
:::

:::preuve
Notons $c_t$ la meilleure somme d'un sous-tableau **se terminant en $t$**. Un tel sous-tableau est soit réduit à $a_t$, soit un sous-tableau se terminant en $t - 1$ prolongé par $a_t$ : donc $c_t = \max(a_t, c_{t-1} + a_t)$. C'est exactement la mise à jour de `courant`. La réponse est $\max_tc_t$, que `meilleur` accumule. C'est de la **programmation dynamique** avec un état de taille 1.
:::

:::exercice ex-code-kadane
reponse: 8
Plus grande somme d'un sous-tableau contigu de $(2, -5, 3, 4, -1, 2, -8, 6, 1, -2)$ ?
---
Kadane : $c$ vaut successivement $2, -3, 3, 7, 6, 8, 0, 6, 7, 5$ ; le maximum est 8, atteint par $(3, 4, -1, 2)$.
:::

:::exemple Fenêtre glissante et sommes préfixes ([[fiche:algo-moyenne-mobile]])
Moyenne mobile sur $k$ points en $O(n)$ : on ajoute l'élément qui entre et on retire celui qui sort, au lieu de resommer $k$ éléments. Plus généralement, avec les **sommes préfixes** $P_t = a_0 + \dots + a_{t-1}$, la somme de $a_i$ à $a_{j-1}$ vaut $P_j - P_i$ en $O(1)$. Pour le **maximum** sur une fenêtre glissante, on garde dans une `deque` les indices des candidats, de valeurs décroissantes : chaque indice entre et sort une fois, $O(n)$ au total.
:::

:::exemple Tas : les $k$ plus grands et la médiane d'un flux ([[fiche:algo-k-plus-grands]], [[fiche:algo-mediane-flux]])
```python
import heapq

def k_plus_grands(flux, k):
    tas = []                       # tas min des k meilleurs vus
    for x in flux:
        if len(tas) < k:
            heapq.heappush(tas, x)
        elif x > tas[0]:
            heapq.heapreplace(tas, x)
    return sorted(tas, reverse=True)
```
$O(n\log k)$ en temps et $O(k)$ en mémoire, adapté à un flux qu'on ne peut pas trier. Pour la **médiane d'un flux**, on garde deux tas : un tas max pour la moitié basse, un tas min pour la moitié haute, équilibrés à un élément près ; la médiane se lit au sommet, chaque insertion coûte $O(\log n)$.
:::

:::exemple Dichotomie ([[fiche:algo-recherche-binaire]])
```python
def premier_vrai(bas, haut, condition):
    """Plus petit x dans [bas, haut] tel que condition(x), si condition est croissante (faux puis vrai) ; renvoie haut si aucun ne convient."""
    while bas < haut:
        milieu = (bas + haut) // 2
        if condition(milieu):
            haut = milieu
        else:
            bas = milieu + 1
    return bas
```
**Invariant** : la réponse est toujours dans $[\text{bas}, \text{haut}]$ ; l'intervalle rétrécit strictement à chaque tour, donc la boucle termine, en $\lceil\log_2(\text{haut} - \text{bas} + 1)\rceil$ tours. La plupart des bogues de dichotomie viennent d'un invariant mal choisi (bornes incluses ou exclues) : écris-le avant de coder. La même idée sert à chercher une valeur dans un tableau trié ou, sur des réels (milieu $= (\text{bas} + \text{haut})/2$, arrêt quand $\text{haut} - \text{bas}$ est sous une tolérance), une racine ou une volatilité implicite (chapitre [[n:volatilite]]).
:::

## Programmation dynamique

:::methode Les quatre questions
1. **L'état** : quelle information minimale résume le passé pour décider la suite ?
2. **La récurrence** : comment la valeur d'un état s'écrit à partir d'états plus petits ?
3. **Les cas de base**.
4. **L'ordre de calcul** (de bas en haut) ou la **mémoïsation** (de haut en bas, avec `functools.lru_cache`).
Complexité : nombre d'états $\times$ coût d'une transition. C'est le même principe que la récurrence à rebours d'une option américaine (chapitre [[n:arbitrage-et-risque-neutre]]) ou du jeu des cartes rouges et noires (chapitre [[n:market-making-et-microstructure]]).
:::

:::exemple L'escalier et les chemins dans une grille ([[fiche:algo-escalier]], [[fiche:algo-chemins-grille]])
Monter $n$ marches par pas de 1 ou 2 : le dernier pas est un 1 ou un 2, donc $f(n) = f(n - 1) + f(n - 2)$, $f(0) = f(1) = 1$ : la suite de Fibonacci. Chemins de la case en haut à gauche à la case en bas à droite d'une grille de $m \times n$ cases (droite ou bas) : $g(i, j) = g(i - 1, j) + g(i, j - 1)$, et la formule fermée $\binom{m + n - 2}{m - 1}$ ($m - 1$ pas vers le bas parmi $m + n - 2$) ; entre les **points** $(0, 0)$ et $(m, n)$ d'un quadrillage, la convention de [[fiche:algo-chemins-grille]], c'est $\binom{m + n}{m}$ (chapitre [[n:denombrement-et-poisson]]). Avec des cases interdites, seule la récurrence marche.
:::

:::exercice ex-code-escalier
reponse: 89
De combien de façons peut-on monter un escalier de 10 marches par pas de 1 ou 2 ?
---
$f(0..10) = 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89$ : 89 façons.
:::

:::exemple Rendu de monnaie : compter les façons
```python
def nombre_de_facons(montant, pieces):
    facons = [1] + [0] * montant           # facons[m] : façons de faire m
    for p in pieces:                       # une pièce à la fois : on compte les combinaisons, pas les ordres
        for m in range(p, montant + 1):
            facons[m] += facons[m - p]
    return facons[montant]
```
Mettre la boucle sur les pièces **à l'extérieur** compte chaque combinaison une seule fois ; l'inverser compterait les suites ordonnées (comme l'escalier). C'est l'erreur classique de cet exercice. $O(\text{montant} \times \text{nombre de pièces})$.
:::

:::exercice ex-code-monnaie
reponse: 4562
De combien de façons peut-on former 100 centimes avec des pièces de 1, 2, 5, 10, 20 et 50 centimes (l'ordre ne compte pas) ?
---
La récurrence ci-dessus donne 4 562. La vérification de cet exercice énumère directement les nombres de pièces de chaque valeur, sans programmation dynamique.
:::

:::exemple Plus longue sous-suite commune
$L(i, j)$, longueur de la plus longue sous-suite commune aux préfixes $x_{<i}$ et $y_{<j}$ : si $x_{i-1} = y_{j-1}$, $L(i, j) = L(i - 1, j - 1) + 1$, sinon $\max\big(L(i - 1, j), L(i, j - 1)\big)$. $O(|x|\,|y|)$. Les distances d'édition (Levenshtein) et l'alignement de séries temporelles (DTW) suivent le même schéma.
:::

:::exercice ex-code-lcs
reponse: 4
Longueur de la plus longue sous-suite commune à « ABCBDAB » et « BDCABA » ?
---
4, par exemple « BCBA » ou « BDAB ». La table $L$ a $8 \times 7$ cases ; la vérification de cet exercice teste toutes les sous-suites de la chaîne la plus courte.
:::

## Aléatoire : trois algorithmes et leurs preuves

:::theoreme Mélange de Fisher-Yates ([[fiche:algo-melange]])
```python
import random

def melanger(a):
    for i in range(len(a) - 1, 0, -1):
        j = random.randint(0, i)   # 0 <= j <= i, i inclus
        a[i], a[j] = a[j], a[i]
```
produit chacune des $n!$ permutations avec la probabilité $\frac{1}{n!}$.
:::

:::preuve
À l'étape $i$ (de $n - 1$ à 1), on choisit uniformément l'élément qui occupera la position $i$ parmi les $i + 1$ restants. Le nombre de suites de choix possibles est $n \times (n - 1) \times \dots \times 2 = n!$, chacune de probabilité $\frac{1}{n!}$, et deux suites différentes donnent deux permutations différentes (la position $i$ est fixée définitivement à l'étape $i$). C'est une bijection entre suites de choix et permutations. L'erreur classique, tirer `j` dans tout le tableau à chaque étape, donne $n^n$ suites équiprobables, et, pour $n \ge 3$, $n^n$ n'est pas un multiple de $n!$ : certaines permutations sont plus probables.
:::

:::theoreme Échantillonnage par réservoir ([[fiche:algo-reservoir]])
Pour tirer uniformément $k$ éléments d'un flux de longueur inconnue : garder les $k$ premiers, puis remplacer, quand arrive le $t$-ième élément ($t > k$), un élément du réservoir choisi au hasard, avec probabilité $\frac kt$. À la fin, chacun des $\binom nk$ sous-ensembles de taille $k$ a la même probabilité ; en particulier, chaque élément est dans le réservoir avec la probabilité $\frac kn$.
:::

:::preuve Par récurrence
Supposons qu'après $t - 1$ éléments, chacun soit dans le réservoir avec probabilité $\frac{k}{t - 1}$. Le $t$-ième y entre avec probabilité $\frac kt$. Un élément déjà présent y reste si le nouveau n'entre pas, ou entre mais remplace un autre : $1 - \frac kt + \frac kt \cdot \frac{k - 1}{k} = 1 - \frac1t = \frac{t - 1}{t}$. Il est donc présent avec probabilité $\frac{k}{t - 1} \cdot \frac{t - 1}{t} = \frac kt$. La propriété se propage jusqu'à $t = n$.

**Uniformité des sous-ensembles** (plus fort que l'égalité des probabilités d'inclusion) : supposons que chaque sous-ensemble de taille $k$ des $t - 1$ premiers éléments ait la probabilité $1/\binom{t-1}{k}$. Un sous-ensemble final sans l'élément $t$ s'obtient si $t$ est refusé : $\frac{1}{\binom{t-1}{k}}\cdot\frac{t - k}{t} = \frac{1}{\binom tk}$. Un sous-ensemble contenant $t$ s'obtient à partir de $t - k$ réservoirs possibles (l'élément remplacé est l'un des $t - k$ absents), avec $t$ accepté et le bon élément remplacé : $(t - k)\cdot\frac{1}{\binom{t-1}{k}}\cdot\frac kt\cdot\frac1k = \frac{1}{\binom tk}$.
:::

:::propriete Générer une loi à partir d'une autre ([[fiche:algo-rand7]])
Pour simuler un dé à 7 faces avec un dé à 5 faces : deux lancers donnent $5 \times 5 = 25$ issues équiprobables ; on garde les 21 premières (3 par face) et on recommence sinon. Nombre moyen de paires de lancers : $\frac{25}{21}$ (loi géométrique). Le principe général est le **rejet** (chapitre [[n:methodes-numeriques]]).
:::

## Python : les pièges qu'on te fera remarquer

:::attention Les questions de langage classiques
- **Argument par défaut mutable** : `def f(x, acc=[])` partage la même liste entre tous les appels ; écrire `acc=None` puis `acc = [] if acc is None else acc` ([[fiche:algo-mutable-defaut]]).
- **Copie** : `b = a` ne copie rien ; `a.copy()` ou `list(a)` copient en surface ; `copy.deepcopy` copie aussi les objets imbriqués ([[fiche:py-copie]]). Une liste de listes créée par multiplication d'une liste interne partage cette liste interne.
- **Flottants** : `0.1 + 0.2 != 0.3` ; comparer avec une tolérance (`math.isclose`), et ne jamais sommer naïvement des millions de petits nombres très différents (sommation de Kahan, `math.fsum`) ([[fiche:algo-flottants]]).
- **Générateurs** : `(x * x for x in données)` ne calcule qu'à la demande et ne se parcourt qu'une fois ([[fiche:algo-generateurs]]).
- **GIL** : dans la version standard de CPython, un seul fil exécute du code Python à la fois (une version sans GIL existe depuis Python 3.13, encore optionnelle) ; on parallélise le calcul avec des processus ou dans du code compilé (NumPy) ([[fiche:algo-gil]]).
- **Décorateurs** : une fonction qui prend une fonction et en renvoie une autre, par exemple pour mesurer un temps ou mettre en cache ([[fiche:py-decorateur]]).
:::

:::methode NumPy et pandas sans boucle ([[fiche:algo-numpy-vectorisation]], [[fiche:algo-pandas-pieges]])
- Remplacer les boucles par des opérations sur tableaux : `rendements = prix[1:] / prix[:-1] - 1`, `np.cumsum`, `np.maximum.accumulate` (le plus haut courant d'un drawdown en une ligne).
- Comprendre la **diffusion** (broadcasting) : un tableau $(n, 1)$ combiné à un tableau $(1, m)$ donne $(n, m)$.
- En pandas : `shift(1)` pour n'utiliser que l'information passée, `rolling(20).mean()`, `groupby(...).transform(...)`, et attention à l'**affectation enchaînée** (`df[df.a > 0]["b"] = 1` ne modifie qu'une copie temporaire : `df` reste inchangé, et pandas 3 le signale par une erreur) : utiliser `df.loc[masque, "b"] = 1`.
- **Fuite d'information** : un `shift(-1)` oublié, une normalisation sur tout l'échantillon, un `fillna` vers l'arrière (chapitre [[n:machine-learning]]).
:::

## C++ : l'essentiel pour une banque

:::propriete Ce qu'on attend d'un stagiaire ([[fiche:algo-cpp-bases]], [[fiche:cpp-virtuel]], [[fiche:cpp-move]], [[fiche:cpp-comportement-indefini]])
- **Pile et tas**, **références** (alias, jamais nulles) contre **pointeurs** (peuvent être nuls, réaffectés).
- **RAII** : une ressource est libérée par le destructeur de l'objet qui la possède ; en pratique `std::unique_ptr` (propriété unique) et `std::shared_ptr` (compteur de références), jamais de `new` / `delete` à la main.
- **Fonctions virtuelles** : appel résolu à l'exécution via la table virtuelle ; une classe de base polymorphe doit avoir un **destructeur virtuel**, sinon détruire un objet dérivé par un pointeur de base est un comportement indéfini.
- **Sémantique de déplacement** : `std::move` transforme en référence de valeur temporaire, ce qui permet de « voler » les ressources au lieu de les copier (conteneurs d'objets lourds, transfert de propriété). Au `return` d'une variable locale, ne pas écrire `std::move` : le compilateur élide déjà la copie (RVO) ou déplace de lui-même, et `std::move` empêche l'élision.
- **Comportement indéfini** : dépassement de tableau, entier signé qui déborde, déréférencement d'un pointeur nul ou d'un objet détruit, lecture d'une variable non initialisée. Le compilateur peut alors faire n'importe quoi, y compris « marcher » en test.
- **`const`** partout où c'est possible, passage par référence constante des gros objets.
- Complexités de la STL : `vector` (accès $O(1)$), `map` (arbre équilibré, $O(\log n)$, ordonné), `unordered_map` (hachage, $O(1)$ en moyenne).
:::

## SQL : les requêtes qui reviennent

:::exemple Rendements quotidiens et classements
```sql
-- rendement quotidien de chaque titre (fonction de fenêtre)
SELECT titre, date,
       prix / LAG(prix) OVER (PARTITION BY titre ORDER BY date) - 1 AS rendement
FROM prix;

-- dernière cotation de chaque titre (dédoublonnage)
SELECT titre, date, prix FROM (
    SELECT p.*, ROW_NUMBER() OVER (PARTITION BY titre ORDER BY date DESC) AS rang
    FROM prix p
) t WHERE rang = 1;
```
À savoir aussi ([[fiche:sql-group-by]], [[fiche:sql-fenetre]], [[fiche:sql-rendement-lag]], [[fiche:sql-dedoublonnage]], [[fiche:sql-jointures]], [[fiche:sql-null]]) : `GROUP BY` avec `HAVING` (filtre après agrégation, contre `WHERE` avant) ; les jointures interne, gauche, complète, et le piège de la jointure qui **multiplie** les lignes quand la clé n'est pas unique ; `NULL` n'est égal à rien, pas même à `NULL` (`IS NULL`), et `COUNT(colonne)` ignore les `NULL` alors que `COUNT(*)` les compte.
:::

## Pièges classiques

:::attention En entretien de code
- Coder avant d'avoir clarifié l'énoncé et donné un exemple.
- Annoncer une complexité fausse (une recherche `x in liste` dans une boucle, c'est $O(n^2)$).
- Oublier les cas limites : vide, un seul élément, doublons, valeurs négatives, débordement en C++.
- Une dichotomie aux bornes mal définies (boucle infinie ou élément manqué).
- Rester silencieux en cas de blocage : dire ce qu'on essaie vaut mieux que se taire.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Meilleur gain en achetant puis vendant une fois ? Le drawdown maximal ? »** Une passe, l'invariant « minimum (ou maximum) jusqu'ici ».
- **« Plus grande somme d'un sous-tableau ? »** Kadane et sa preuve par la récurrence $c_t = \max(a_t, c_{t-1} + a_t)$.
- **« Médiane d'un flux, $k$ plus grands éléments ? »** Deux tas, un tas min de taille $k$.
- **« Mélange un tableau uniformément. Tire $k$ éléments d'un flux. »** Fisher-Yates et réservoir, avec leurs preuves.
- **« Nombre de façons de rendre la monnaie ? »** Programmation dynamique, et l'ordre des boucles.
- **« Pourquoi un destructeur virtuel ? Que fait `std::move` ? »** Les définitions ci-dessus, avec un exemple.
- **« Calcule des rendements en SQL, garde la dernière ligne par titre. »** `LAG` et `ROW_NUMBER`.
:::
