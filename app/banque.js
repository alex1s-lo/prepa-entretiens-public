// Fichier généré par construire.py à partir de contenu/ : ne pas modifier à la main.
window.PREPA_BANQUE = {
 "themes": {
  "probas": "Probabilités",
  "stats": "Statistiques et économétrie",
  "stoch": "Calcul stochastique",
  "derives": "Produits dérivés et pricing",
  "taux": "Taux, crédit et XVA",
  "marches": "Marchés et trading",
  "ml": "Machine learning",
  "algo": "Code et algorithmique",
  "casse-tete": "Casse-têtes",
  "constantes": "Chiffres à connaître",
  "projets": "Projets types",
  "fit": "Motivation et parcours"
 },
 "profils": {
  "hf": "Hedge fund (recherche quant)",
  "mm": "Teneur de marché / trading prop",
  "banque": "Banque : quant pricing / strats",
  "risque": "Risque, validation, XVA",
  "data": "Data science / ML"
 },
 "categories": {
  "logique": "Logique et déduction",
  "pesees": "Pesées, mesures et transvasements",
  "strategie": "Jeux et stratégie",
  "probas": "Probabilités et espérance",
  "denombrement": "Dénombrement",
  "nombres": "Nombres et chiffres",
  "invariants": "Invariants, parité et coloriage",
  "recherche": "Recherche optimale et algorithmes",
  "geometrie": "Géométrie et espace",
  "mouvement": "Vitesses, horloges et calendriers",
  "fermi": "Estimations (Fermi)"
 },
 "fiches": [
  {
   "id": "algo-achat-vente-une-fois",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "On te donne la liste des prix d'une action, jour par jour. Écris une fonction qui renvoie le meilleur gain possible avec un seul achat suivi d'une seule vente. Complexité ?",
   "solution": "```python\ndef meilleur_gain(prix):\n    plus_bas = float(\"inf\")\n    meilleur = 0\n    for p in prix:\n        plus_bas = min(plus_bas, p)\n        meilleur = max(meilleur, p - plus_bas)\n    return meilleur\n```\nTemps O($n$), mémoire O(1). La solution naïve (toutes les paires) est en O($n^{2}$).",
   "en": "Given a list of daily stock prices, write a function returning the maximum profit from one buy followed by one sell. Complexity?",
   "indice": "Parcours la liste une seule fois en retenant le plus bas prix vu jusqu'ici.",
   "relances": [
    "Et si on peut faire autant d'allers-retours qu'on veut ? (somme des hausses quotidiennes positives)",
    "Et avec au plus deux transactions ? (programmation dynamique à quatre états, O($n$))",
    "Comment renvoyer aussi les dates d'achat et de vente ?"
   ],
   "essentiel": true
  },
  {
   "id": "algo-kadane",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Trouve la somme maximale d'un sous-tableau contigu (par exemple sur une liste de PnL quotidiens). Complexité ?",
   "solution": "Algorithme de Kadane : la meilleure somme qui se termine en $i$ est soit $x[i]$, soit $x[i] +$ la meilleure qui se termine en $i - 1$.\n```python\ndef somme_max(x):\n    courant = meilleur = x[0]\n    for v in x[1:]:\n        courant = max(v, courant + v)\n        meilleur = max(meilleur, courant)\n    return meilleur\n```\nO($n$) en temps, O(1) en mémoire.",
   "en": "Find the maximum sum of a contiguous subarray (e.g. over a list of daily P&Ls). Complexity?",
   "relances": [
    "Lien avec le drawdown maximal ? (même idée : plus grande baisse depuis un plus haut, en suivant le maximum courant de la courbe de PnL cumulé)"
   ]
  },
  {
   "id": "algo-drawdown",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Écris une fonction qui calcule le drawdown maximal d'une courbe de valeur de portefeuille.",
   "solution": "```python\ndef drawdown_max(valeurs):\n    sommet = valeurs[0]\n    pire = 0.0\n    for v in valeurs:\n        sommet = max(sommet, v)\n        pire = min(pire, v / sommet - 1)\n    return pire          # par exemple -0.16 pour -16 %\n```\nO($n$). En NumPy : `(v / np.maximum.accumulate(v) - 1).min()`.",
   "en": "Write a function computing the maximum drawdown of a portfolio value series.",
   "relances": [
    "Durée du drawdown maximal ? (garder la date du sommet et compter jusqu'au retour au sommet)"
   ]
  },
  {
   "id": "algo-two-sum",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Dans une liste d'entiers, trouve deux éléments dont la somme vaut une cible donnée. Fais mieux que O($n^{2}$).",
   "solution": "Dictionnaire des valeurs déjà vues :\n```python\ndef deux_somme(x, cible):\n    vus = {}\n    for i, v in enumerate(x):\n        if cible - v in vus:\n            return vus[cible - v], i\n        vus[v] = i\n    return None\n```\nO($n$) en moyenne en temps et en mémoire. Alternative : trier puis deux pointeurs, O($n \\log n$) et O(1) mémoire supplémentaire.",
   "en": "In a list of integers, find two elements summing to a target. Do better than O($n^{2}$).",
   "essentiel": true
  },
  {
   "id": "algo-moyenne-mobile",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Calcule la moyenne mobile sur $k$ jours d'une série de $n$ prix en O($n$), sans recalculer chaque somme.",
   "solution": "Somme glissante : on ajoute l'entrant et on retire le sortant.\n```python\ndef moyenne_mobile(x, k):\n    res, s = [], 0.0\n    for i, v in enumerate(x):\n        s += v\n        if i >= k:\n            s -= x[i - k]\n        if i >= k - 1:\n            res.append(s / k)\n    return res\n```\nEn NumPy : `c = np.cumsum(np.insert(x, 0, 0)); (c[k:] - c[:-k]) / k`. En pandas : `serie.rolling(k).mean()`.",
   "en": "Compute the k-day moving average of $n$ prices in O($n$) without recomputing each sum.",
   "relances": [
    "Attention aux erreurs d'arrondi qui s'accumulent sur de très longues séries (recalculer la somme de temps en temps, ou sommation de Kahan)",
    "Et un écart-type glissant ? (sommes glissantes de $x$ et de $x^{2}$, ou algorithme de Welford pour la stabilité)"
   ]
  },
  {
   "id": "algo-mediane-flux",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Des prix arrivent un par un. Maintiens la médiane de tout ce qui a été reçu, avec un coût faible par prix.",
   "solution": "Deux tas : un tas max pour la moitié basse, un tas min pour la moitié haute, de tailles égales à un près.\n```python\nimport heapq\n\nclass Mediane:\n    def __init__(self):\n        self.bas = []   # tas max (valeurs opposées)\n        self.haut = []  # tas min\n\n    def ajouter(self, x):\n        heapq.heappush(self.bas, -x)\n        heapq.heappush(self.haut, -heapq.heappop(self.bas))\n        if len(self.haut) > len(self.bas):\n            heapq.heappush(self.bas, -heapq.heappop(self.haut))\n\n    def mediane(self):\n        if len(self.bas) > len(self.haut):\n            return -self.bas[0]\n        return (-self.bas[0] + self.haut[0]) / 2\n```\n$O(\\log n)$ par insertion, O(1) pour lire la médiane.",
   "en": "Prices arrive one at a time. Maintain the running median efficiently."
  },
  {
   "id": "algo-reservoir",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Un flux de transactions de longueur inconnue (trop grand pour la mémoire) défile. Comment tirer une transaction uniformément au hasard en une seule passe ?",
   "solution": "Échantillonnage par réservoir : garder le i-ème élément avec probabilité $1/i$.\n```python\nimport random\n\ndef tirer(flux):\n    choix = None\n    for i, x in enumerate(flux, start=1):\n        if random.random() < 1 / i:\n            choix = x\n    return choix\n```\nPreuve : l'élément $i$ est choisi ($1/i$) puis jamais remplacé : $(1/i) \\cdot (i/(i+1)) \\cdot \\dots \\cdot ((n-1)/n) = 1/n$.\nPour $k$ éléments : garder les $k$ premiers, puis remplacer un élément au hasard avec probabilité $k/i$.",
   "en": "A stream of trades of unknown length passes by. How do you sample one uniformly at random in a single pass?",
   "categorie": "recherche",
   "titre": "Tirer un élément uniforme d’un flux de longueur inconnue"
  },
  {
   "id": "algo-melange",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Écris un mélange uniforme d'une liste. Pourquoi « échanger chaque élément avec une position tirée dans toute la liste » est-il biaisé ?",
   "solution": "Fisher-Yates :\n```python\nimport random\n\ndef melanger(x):\n    for i in range(len(x) - 1, 0, -1):\n        j = random.randint(0, i)   # j dans [0, i]\n        x[i], x[j] = x[j], x[i]\n```\nLa version naïve ($j$ dans [$0, n - 1$] à chaque étape) produit $n^{n}$ suites de tirages équiprobables pour $n!$ permutations ; $n^{n}$ n'est pas un multiple de $n!$ (pour $n = 3$ : 27 et 6), donc certaines permutations sont plus probables.",
   "en": "Write a uniform shuffle. Why is \"swap each element with a random position anywhere in the list\" biased?"
  },
  {
   "id": "algo-rand7",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu as une fonction rand5() qui renvoie un entier uniforme de 1 à 5. Construis rand7().",
   "solution": "Rejet : deux appels donnent un entier uniforme de 0 à 24 ; on garde les 21 premiers.\n```python\ndef rand7():\n    while True:\n        n = 5 * (rand5() - 1) + (rand5() - 1)   # uniforme sur 0..24\n        if n < 21:\n            return n % 7 + 1\n```\nProbabilité d'accepter : $21/25$ ; nombre moyen d'appels à rand5 : $2 \\times 25/21 \\approx 2{,}38$.",
   "en": "Given rand5() returning a uniform integer in 1..5, build rand7().",
   "piege": "`rand5() + rand5()` n'est pas uniforme (loi triangulaire).",
   "categorie": "recherche",
   "titre": "Fabriquer rand7 à partir de rand5"
  },
  {
   "id": "algo-recherche-binaire",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Écris une recherche dichotomique. Comment l'utiliser pour calculer une volatilité implicite ?",
   "solution": "```python\ndef vol_implicite(prix_marche, prix_bs, bas=1e-4, haut=5.0, tol=1e-8):\n    # prix_bs(sigma) est croissant en sigma : on coupe l'intervalle en deux\n    while haut - bas > tol:\n        milieu = (bas + haut) / 2\n        if prix_bs(milieu) < prix_marche:\n            bas = milieu\n        else:\n            haut = milieu\n    return (bas + haut) / 2\n```\nLe prix d'une option est strictement croissant en $\\sigma$ (vega $> 0$) : la dichotomie converge toujours, en $\\log_2((\\text{haut} - \\text{bas})/\\text{tol})$ itérations. Newton ($\\sigma \\leftarrow \\sigma - (C(\\sigma) - C_\\text{marché})/\\text{vega}$) converge beaucoup plus vite mais peut diverger loin de la monnaie (vega minuscule) ; on combine souvent les deux (Brent, comme dans ton projet).",
   "en": "Write a binary search. How do you use it to compute an implied volatility?",
   "relances": [
    "Combien d'itérations pour passer d'un intervalle de 5 à une précision de $10^{-8}$ ? (environ 29)"
   ]
  },
  {
   "id": "algo-comparaisons-dichotomie",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "numerique",
   "question": "Au pire, combien de comparaisons faut-il pour trouver un élément par dichotomie dans une liste triée d'un million d'éléments ?",
   "solution": "On divise par deux à chaque étape : il faut $\\lceil \\log_2(1\\,000\\,001) \\rceil =$ **20** comparaisons ($2^{20} = 1\\,048\\,576$).",
   "en": "In the worst case, how many comparisons does binary search need in a sorted list of one million elements?",
   "reponse": "20",
   "valeur": 20.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "algo-parentheses",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Vérifie qu'une chaîne de parenthèses, crochets et accolades est bien équilibrée.",
   "solution": "Une pile :\n```python\ndef equilibre(s):\n    paires = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    pile = []\n    for c in s:\n        if c in \"([{\":\n            pile.append(c)\n        elif c in paires:\n            if not pile or pile.pop() != paires[c]:\n                return False\n    return not pile\n```\nO($n$).",
   "en": "Check whether a string of brackets is balanced."
  },
  {
   "id": "algo-lru",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Implémente un cache LRU (on évince l'élément le moins récemment utilisé) avec des opérations en O(1).",
   "solution": "Table de hachage + liste doublement chaînée ; en Python, `OrderedDict` fait les deux :\n```python\nfrom collections import OrderedDict\n\nclass CacheLRU:\n    def __init__(self, capacite):\n        self.capacite = capacite\n        self.d = OrderedDict()\n\n    def lire(self, cle):\n        if cle not in self.d:\n            return None\n        self.d.move_to_end(cle)\n        return self.d[cle]\n\n    def ecrire(self, cle, valeur):\n        self.d[cle] = valeur\n        self.d.move_to_end(cle)\n        if len(self.d) > self.capacite:\n            self.d.popitem(last=False)\n```\nPour mettre en cache une fonction pure : `functools.lru_cache`.",
   "en": "Implement an LRU cache with O(1) operations."
  },
  {
   "id": "algo-escalier",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "numerique",
   "question": "De combien de façons peut-on monter un escalier de 10 marches en faisant des pas de 1 ou 2 marches ?",
   "solution": "$f(n) = f(n - 1) + f(n - 2), f(1) = 1, f(2) = 2$ : suite de Fibonacci décalée. $f(10) =$ **89**.\n```python\ndef facons(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\nLa récursion naïve est exponentielle ; la mémoïsation ou l'itération est en O($n$).",
   "en": "In how many ways can you climb a 10-step staircase taking 1 or 2 steps at a time?",
   "categorie": "denombrement",
   "titre": "Monter un escalier par pas de 1 ou 2",
   "reponse": "89",
   "valeur": 89.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "algo-chemins-grille",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "numerique",
   "question": "Sur une grille, combien de chemins vont du coin (0, 0) au coin (4, 4) en ne faisant que des pas vers la droite ou vers le haut ?",
   "solution": "Il faut 8 pas dont 4 vers la droite : $\\binom{8}{4} =$ **70**.",
   "en": "How many lattice paths go from (0, 0) to (4, 4) using only right and up steps?",
   "relances": [
    "Lien avec un arbre binomial ? (nombre de chemins menant à un nœud = coefficient binomial)"
   ],
   "categorie": "denombrement",
   "titre": "Chemins dans une grille",
   "reponse": "comb(8,4)",
   "valeur": 70.0,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "algo-mutable-defaut",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Que fait ce code, et pourquoi ?\n```python\ndef ajouter(x, liste=[]):\n    liste.append(x)\n    return liste\n\nprint(ajouter(1))\nprint(ajouter(2))\n```",
   "solution": "Il affiche `[1]` puis `[1, 2]`. La valeur par défaut est évaluée **une seule fois**, à la définition de la fonction : la même liste est partagée entre les appels.\nCorrection :\n```python\ndef ajouter(x, liste=None):\n    if liste is None:\n        liste = []\n    liste.append(x)\n    return liste\n```",
   "en": "What does this code print, and why? (mutable default argument)",
   "essentiel": true
  },
  {
   "id": "algo-gil",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que le GIL en Python ? Comment accélérer un calcul lourd en Python ?",
   "solution": "Le Global Interpreter Lock empêche plusieurs threads d'exécuter du bytecode Python en même temps dans un même processus (CPython). Les threads aident pour les entrées-sorties (réseau, disque), pas pour le calcul pur.\nPour accélérer :\n- **vectoriser** avec NumPy (boucles en C, qui libèrent souvent le GIL) ;\n- **multiprocessing** / `concurrent.futures.ProcessPoolExecutor` pour paralléliser sur plusieurs cœurs ;\n- compiler les boucles chaudes : Numba, Cython, ou une extension C++ ;\n- mieux : un meilleur algorithme (O($n$) au lieu de O($n^{2}$)).\nProfiler d'abord (`cProfile`) avant d'optimiser. (Des versions récentes de CPython proposent une construction expérimentale sans GIL.)",
   "en": "What is the GIL in Python? How do you speed up heavy computation in Python?"
  },
  {
   "id": "algo-generateurs",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un générateur en Python ? Quand l'utiliser ?",
   "solution": "Une fonction avec `yield` renvoie un itérateur qui produit les valeurs à la demande, en gardant son état entre deux appels. Rien n'est calculé à l'avance ni stocké en entier.\nUsages : lire un gros fichier de cotations ligne par ligne, flux infinis, pipelines de traitement paresseux ; expressions génératrices `(x * x for x in data)` au lieu de listes quand on ne parcourt qu'une fois.\n```python\ndef lignes_valides(chemin):\n    with open(chemin) as f:\n        for ligne in f:\n            if ligne.strip():\n                yield ligne.split(\",\")\n```",
   "en": "What is a Python generator? When would you use one?"
  },
  {
   "id": "algo-dict-complexite",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Quelle est la complexité de la recherche dans une liste, un dictionnaire et un ensemble Python ? Comment fonctionne un dictionnaire ?",
   "solution": "- `x in liste` : O($n$) (parcours).\n- `x in dict` / `x in set` : O(1) en moyenne, O($n$) au pire (collisions).\nUn dictionnaire est une table de hachage : la clé est hachée pour trouver une case ; les collisions sont résolues par adressage ouvert ; la table est agrandie quand elle se remplit (coût amorti O(1)). Les clés doivent être hachables (immuables : pas de liste comme clé). Depuis Python 3.7, l'ordre d'insertion est conservé.",
   "en": "What is the lookup complexity in a Python list, dict and set? How does a dict work?"
  },
  {
   "id": "algo-numpy-vectorisation",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Pourquoi une opération NumPy vectorisée est-elle beaucoup plus rapide qu'une boucle Python ? Qu'est-ce que le broadcasting ?",
   "solution": "Une boucle Python manipule des objets un par un (typage dynamique, appels de fonction, allocation). NumPy stocke des données homogènes contiguës en mémoire et exécute la boucle en C compilé, souvent avec des instructions SIMD : facteur 10 à 100.\n**Broadcasting** : règles qui étendent virtuellement les dimensions de taille 1 pour combiner des tableaux de formes différentes sans copie. Exemple : `prix (n, 1) - strikes (1, m)` donne une matrice ($n, m$) de payoffs. Un simulateur de market making vectorise 4 000 trajectoires de cette façon.",
   "en": "Why is a vectorized NumPy operation much faster than a Python loop? What is broadcasting?",
   "relances": [
    "Piège classique ? (une forme ($n$,) contre ($n, 1$) produit une matrice ($n, n$) par broadcasting au lieu d'une erreur)"
   ]
  },
  {
   "id": "algo-pandas-pieges",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Cite des pièges courants avec pandas sur des données financières.",
   "solution": "- **Alignement sur l'index** : additionner deux séries aux dates différentes produit des NaN silencieux.\n- `shift` : `rendement.shift(-1)` regarde le futur ; vérifier le sens de chaque décalage (source classique de regard vers le futur).\n- `fillna(method=\"ffill\")` sur des prix d'actifs disparus prolonge des cotations fictives.\n- **Affectation en chaîne** (`df[df.a > 0][\"b\"] = 1`) qui ne modifie pas le DataFrame d'origine ; utiliser `.loc`.\n- `merge` qui multiplie les lignes quand la clé n'est pas unique.\n- Fuseaux horaires et heures de clôture différentes selon les marchés.\n- `rolling` avec `center=True` : utilise des données futures.\n- `pct_change` sur des séries avec des NaN ou des dividendes non ajustés.",
   "en": "List common pandas pitfalls with financial data."
  },
  {
   "id": "algo-flottants",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Pourquoi $0{,}1 + 0{,}2 \\neq 0{,}3$ en Python ? Quelles conséquences en finance, et comment les gérer ?",
   "solution": "Les flottants sont stockés en binaire (IEEE 754, 53 bits de mantisse) : 0,1 n'a pas de représentation binaire exacte, l'erreur d'arrondi apparaît dans la somme (0,30000000000000004).\nConséquences : comparaisons d'égalité fausses, accumulation d'erreurs sur de longues sommes, **annulation catastrophique** quand on soustrait deux nombres proches (différences finies avec un pas trop petit, variance calculée comme $\\mathbb{E}[X^{2}] - \\mathbb{E}[X]^{2}$).\nRemèdes : comparer avec une tolérance (`math.isclose`), `decimal.Decimal` ou des entiers (centimes) pour la comptabilité, sommation de Kahan ou `math.fsum`, algorithmes stables (Welford pour la variance), pas de différences finies adapté ($\\approx \\sqrt{\\varepsilon} \\times$ échelle).",
   "en": "Why is $0.1 + 0.2$ !$= 0.3$ in Python? What are the consequences in finance and how do you handle them?"
  },
  {
   "id": "algo-cpp-bases",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "banque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Questions C++ fréquentes en banque et chez les teneurs de marché : pointeur ou référence, destructeur virtuel, RAII, pointeurs intelligents. Explique-les.",
   "solution": "- **Référence** : alias d'un objet existant, jamais nulle, non réaffectable. **Pointeur** : adresse, peut être nul, réaffectable, arithmétique possible.\n- **Destructeur virtuel** : indispensable dans une classe de base destinée au polymorphisme ; sinon `delete` via un pointeur de base n'appelle pas le destructeur de la classe dérivée (comportement indéfini, fuites).\n- **RAII** : une ressource (mémoire, fichier, verrou) est acquise dans le constructeur et libérée dans le destructeur ; la libération est garantie même en cas d'exception.\n- **Pointeurs intelligents** : `std::unique_ptr` (propriété unique, déplaçable, sans surcoût), `std::shared_ptr` (compteur de références, attention aux cycles : `weak_ptr`).\n- Aussi : sémantique de déplacement (`std::move`), `const` correct, passage par référence constante pour éviter des copies, `vector` contre `list` (localité mémoire).",
   "en": "Common C++ questions: pointer vs reference, virtual destructor, RAII, smart pointers. Explain them.",
   "relances": [
    "Pourquoi `std::vector` est-il presque toujours plus rapide que `std::list`, même pour des insertions ? (mémoire contiguë et cache du processeur)"
   ]
  },
  {
   "id": "sql-group-by",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Table `rendements(ticker, jour, r)`. Écris une requête SQL qui donne, pour chaque ticker ayant au moins 200 observations, le rendement moyen et l'écart-type, triés par rendement moyen décroissant.",
   "solution": "```sql\nSELECT ticker,\n       AVG(r)         AS moyenne,\n       STDDEV_SAMP(r) AS ecart_type,\n       COUNT(*)       AS n\nFROM rendements\nGROUP BY ticker\nHAVING COUNT(*) >= 200\nORDER BY moyenne DESC;\n```\n`WHERE` filtre les lignes avant le regroupement, `HAVING` filtre les groupes après. Le nom exact de la fonction d'écart-type dépend du moteur (`STDDEV`, `STDEV`…).",
   "en": "Table returns(ticker, day, $r$). Write a SQL query giving, for each ticker with at least 200 observations, the mean return and standard deviation, sorted by mean descending."
  },
  {
   "id": "sql-fenetre",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Même table `rendements(ticker, jour, r)`. Calcule pour chaque ligne la moyenne mobile du rendement sur les 20 dernières observations du même ticker.",
   "solution": "Fonction de fenêtre :\n```sql\nSELECT ticker, jour, r,\n       AVG(r) OVER (\n         PARTITION BY ticker\n         ORDER BY jour\n         ROWS BETWEEN 19 PRECEDING AND CURRENT ROW\n       ) AS moyenne_20\nFROM rendements;\n```\nContrairement à `GROUP BY`, une fonction de fenêtre garde toutes les lignes. Attention : les 19 premières lignes de chaque ticker ont une moyenne sur moins de 20 valeurs ; filtrer avec un `COUNT(*) OVER (...)` si besoin.",
   "en": "Compute, for each row, the 20-observation moving average of $r$ for the same ticker.",
   "relances": [
    "Rendement de la veille ? (`LAG(r) OVER (PARTITION BY ticker ORDER BY jour)`)",
    "Rang de chaque ticker par jour ? (`RANK() OVER (PARTITION BY jour ORDER BY r DESC)`)"
   ]
  },
  {
   "id": "sql-rendement-lag",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Table `prix(ticker, jour, cloture)`. Calcule le rendement quotidien de chaque ticker en SQL.",
   "solution": "```sql\nSELECT ticker, jour,\n       cloture / LAG(cloture) OVER (PARTITION BY ticker ORDER BY jour) - 1 AS rendement\nFROM prix;\n```\nLa première ligne de chaque ticker donne NULL. Pièges : jours manquants (le rendement couvre alors plusieurs jours), prix non ajustés des dividendes et divisions d'actions, division par zéro.",
   "en": "Table prices(ticker, day, close). Compute each ticker's daily return in SQL."
  },
  {
   "id": "sql-jointures",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Différence entre `INNER JOIN` et `LEFT JOIN` ? Une table `ordres` a 1 000 lignes, `clients` 100 ; combien de lignes renvoie `ordres LEFT JOIN clients ON ordres.client_id = clients.id` ?",
   "solution": "- `INNER JOIN` : seulement les lignes qui ont une correspondance des deux côtés.\n- `LEFT JOIN` : toutes les lignes de la table de gauche, complétées par NULL quand il n'y a pas de correspondance.\nSi `clients.id` est unique : exactement **1 000 lignes** (une par ordre). Si `id` n'est pas unique dans `clients`, chaque ordre est dupliqué autant de fois qu'il a de correspondances : plus de 1 000 lignes. C'est la cause classique des sommes gonflées après une jointure.",
   "en": "Difference between INNER JOIN and LEFT JOIN? How many rows does orders LEFT JOIN clients return?"
  },
  {
   "id": "sql-dedoublonnage",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Une table `cotations(ticker, horodatage, prix)` contient plusieurs lignes par ticker. Garde uniquement la dernière cotation de chaque ticker.",
   "solution": "```sql\nSELECT ticker, horodatage, prix\nFROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY horodatage DESC) AS rang\n  FROM cotations\n) t\nWHERE rang = 1;\n```\nAlternative : jointure avec `SELECT ticker, MAX(horodatage) ... GROUP BY ticker`, mais elle renvoie plusieurs lignes en cas d'égalité d'horodatage, alors que `ROW_NUMBER` en garde une seule.",
   "en": "Keep only the latest quote per ticker from quotes(ticker, ts, price)."
  },
  {
   "id": "sql-null",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Quels pièges pose NULL en SQL ?",
   "solution": "- `NULL = NULL` n'est pas vrai mais **inconnu** : utiliser `IS NULL` / `IS NOT NULL`.\n- `COUNT(*)` compte les lignes, `COUNT(colonne)` ignore les NULL ; `AVG` ignore les NULL (la moyenne ne porte que sur les valeurs présentes).\n- `WHERE x NOT IN (SELECT y ...)` ne renvoie **rien** si la sous-requête contient un NULL ; préférer `NOT EXISTS`.\n- Toute opération arithmétique avec NULL donne NULL : `COALESCE(x, 0)` si 0 a un sens.\n- Les NULL ne sont pas égaux entre eux dans une jointure : les lignes à clé NULL disparaissent d'un `INNER JOIN`.",
   "en": "What pitfalls does NULL create in SQL?"
  },
  {
   "id": "cpp-virtuel",
   "theme": "algo",
   "niveau": 3,
   "profils": [
    "banque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Comment fonctionne un appel de fonction virtuelle en C++ ? Quel est son coût, et pourquoi les systèmes à faible latence l'évitent-ils parfois ?",
   "solution": "Chaque classe polymorphe a une table de fonctions virtuelles (vtable) ; chaque objet contient un pointeur vers la vtable de sa classe. Un appel virtuel = lire ce pointeur, lire l'adresse dans la table, appel indirect.\nCoût : quelques nanosecondes en soi, mais surtout il **empêche l'inlining** et peut provoquer une mauvaise prédiction de branchement et des défauts de cache. Dans une boucle critique, c'est mesurable.\nAlternatives : polymorphisme statique par templates (CRTP), `std::variant` avec `std::visit`, `final` pour permettre la dévirtualisation par le compilateur. Toujours mesurer avant d'optimiser.",
   "en": "How does a virtual function call work in C++? What does it cost, and why do low-latency systems sometimes avoid it?"
  },
  {
   "id": "cpp-comportement-indefini",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "banque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un comportement indéfini en C++ ? Donne des exemples.",
   "solution": "Une opération pour laquelle la norme n'impose aucun résultat : le programme peut sembler marcher, planter, ou être « optimisé » de façon surprenante par le compilateur, qui suppose que le comportement indéfini n'arrive jamais.\nExemples : lire au-delà d'un tableau, déréférencer un pointeur nul ou libéré (dangling), dépassement d'entier **signé**, variable non initialisée, deux `delete` sur le même pointeur, modification d'un objet pendant qu'on itère dessus (itérateurs invalidés après `push_back` sur un `vector`), course de données entre threads.\nOutils : sanitizers (`-fsanitize=address,undefined`), avertissements du compilateur, Valgrind.",
   "en": "What is undefined behavior in C++? Give examples."
  },
  {
   "id": "cpp-move",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "banque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que la sémantique de déplacement (move) en $C++11$ ? Que fait `std::move` ?",
   "solution": "Une référence rvalue (`T&&`) désigne un objet temporaire dont on peut « voler » les ressources (le tampon d'un `std::vector` ou d'une `std::string`) au lieu de les copier : le constructeur et l'affectation par déplacement transfèrent un pointeur au lieu de copier les données (O(1) au lieu de O($n$)).\n`std::move` ne déplace rien : c'est une conversion en rvalue qui **autorise** le déplacement. Après un déplacement, l'objet source est dans un état valide mais non spécifié.\nRègle des cinq : si une classe définit un destructeur, un constructeur de copie ou une affectation, elle doit en général définir les cinq (ou aucun, en s'appuyant sur des membres RAII).",
   "en": "What are move semantics in $C++11$? What does std::move do?"
  },
  {
   "id": "py-copie",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Que contient `m` après ce code, et pourquoi ?\n```python\nm = [[0] * 3] * 3\nm[0][0] = 1\n```",
   "solution": "`[[1, 0, 0], [1, 0, 0], [1, 0, 0]]` : `* 3` répète la **référence** à la même liste intérieure ; les trois lignes sont le même objet.\nCorrection : `m = [[0] * 3 for _ in range(3)]`. Même famille de pièges : `b = a` (même objet), `a.copy()` (copie superficielle : les objets intérieurs sont partagés), `copy.deepcopy(a)` (copie complète).",
   "en": "What does $m$ contain after $m =$ [[0]*3]*3; $m[0][0] = 1$, and why?"
  },
  {
   "id": "py-decorateur",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Écris un décorateur Python qui mesure et affiche la durée d'exécution d'une fonction.",
   "solution": "```python\nimport functools\nimport time\n\ndef chronometre(f):\n    @functools.wraps(f)            # garde le nom et la documentation de f\n    def enveloppe(*args, **kwargs):\n        debut = time.perf_counter()\n        try:\n            return f(*args, **kwargs)\n        finally:\n            print(f\"{f.__name__} : {time.perf_counter() - debut:.3f} s\")\n    return enveloppe\n\n@chronometre\ndef calcul(n):\n    return sum(i * i for i in range(n))\n```\nUn décorateur est une fonction qui prend une fonction et en renvoie une autre ; `@chronometre` équivaut à `calcul = chronometre(calcul)`. `perf_counter` est l'horloge adaptée aux mesures de durée.",
   "en": "Write a Python decorator that measures and prints a function's run time."
  },
  {
   "id": "algo-fusion-intervalles",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "On te donne des intervalles [début, fin] (par exemple des périodes où une stratégie est en position). Fusionne ceux qui se chevauchent.",
   "solution": "Trier par début, puis balayer :\n```python\ndef fusionner(intervalles):\n    res = []\n    for debut, fin in sorted(intervalles):\n        if res and debut <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], fin)\n        else:\n            res.append([debut, fin])\n    return res\n```\nO($n \\log n$) à cause du tri. Cas limites : intervalles inclus l'un dans l'autre (d'où le `max`), intervalles qui se touchent (choisir `<=` ou `<` selon la convention).",
   "en": "Merge overlapping intervals."
  },
  {
   "id": "algo-k-plus-grands",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Trouve les $k$ plus grandes valeurs d'une liste de $n$ nombres ($n$ très grand, $k$ petit). Quelle complexité ?",
   "solution": "- Trier tout : O($n \\log n$).\n- **Tas min de taille $k$** : parcourir la liste, garder les $k$ plus grandes vues ; O($n \\log k$) et mémoire O($k$), utilisable en flux : `heapq.nlargest(k, donnees)`.\n- **Quickselect** : partitionner autour d'un pivot comme dans le tri rapide, ne continuer que du côté utile ; O($n$) en moyenne, O($n^{2}$) au pire (pivot aléatoire ou médiane des médianes). `numpy.partition` le fait.",
   "en": "Find the $k$ largest values among $n$ numbers ($n$ huge, $k$ small). Complexity?"
  },
  {
   "id": "algo-paires-nombre",
   "theme": "algo",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "banque"
   ],
   "type": "numerique",
   "question": "Une double boucle compare chaque paire d'éléments d'une liste de 1 000 éléments une seule fois. Combien de comparaisons ?",
   "solution": "$C(1\\,000, 2) = 1\\,000 \\times 999/2 =$ **499 500** : c'est le O($n^{2}$) qui devient prohibitif quand $n$ grandit (50 milliards pour $n = 316\\,000$).",
   "en": "A nested loop compares each pair of 1,000 elements once. How many comparisons?",
   "reponse": "1000*999/2",
   "valeur": 499500.0,
   "tolerance": 0.005,
   "duree": 45
  },
  {
   "id": "cst-racine-2",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "$\\sqrt{2} \\approx$ ? (3 décimales)",
   "solution": "**$\\sqrt{2} \\approx 1{,}414$** ; $\\sqrt{3} \\approx 1{,}732$ ; $\\sqrt{5} \\approx 2{,}236$ ; $\\sqrt{10} \\approx 3{,}162$.",
   "reponse": "sqrt(2)",
   "valeur": 1.4142135623730951,
   "tolerance": 0.001,
   "duree": 20
  },
  {
   "id": "cst-ln-2",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "$\\ln 2 \\approx$ ? (3 décimales)",
   "solution": "**$\\ln 2 \\approx 0{,}693$** ; $\\ln 3 \\approx 1{,}099$ ; $\\ln 10 \\approx 2{,}303$. Sert pour les demi-vies ($\\ln 2/\\kappa$) et la règle de 72 (temps de doublement $\\approx 72/\\text{taux en} \\,\\%$).",
   "reponse": "ln(2)",
   "valeur": 0.6931471805599453,
   "tolerance": 0.001,
   "duree": 20
  },
  {
   "id": "cst-e",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "$e \\approx$ ? (3 décimales) Et $1/e$ ?",
   "solution": "**$e \\approx 2{,}718$** (2,718281828…) ; $1/e \\approx 0{,}368$. $1/e$ revient dans les dérangements, le problème de la secrétaire et $(1 - 1/n)^{n}$.",
   "reponse": "e",
   "valeur": 2.718281828459045,
   "tolerance": 0.0005,
   "duree": 20
  },
  {
   "id": "cst-un-septieme",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "$1/7$ en décimal ? (4 décimales)",
   "solution": "**$1/7 = 0{,}142857 \\dots$** (période de 6 chiffres) ; $2/7 = 0{,}2857 \\dots$ ; $1/6 = 0{,}1667$ ; $1/8 = 0{,}125$ ; $1/9 = 0{,}111 \\dots$ ; $1/11 = 0{,}0909 \\dots$ ; $1/12 = 0{,}0833$.",
   "reponse": "1/7",
   "valeur": 0.14285714285714285,
   "tolerance": 0.0005,
   "duree": 20
  },
  {
   "id": "cst-n-1",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "$N(1) = \\mathbb{P}(Z \\le 1)$ pour $Z$ normale centrée réduite $\\approx$ ? (3 décimales)",
   "solution": "**$N(1) \\approx 0{,}841$**. Donc $\\mathbb{P}(|Z| \\le 1) \\approx 68\\,\\%, \\mathbb{P}(|Z| \\le 2) \\approx 95\\,\\%, \\mathbb{P}(|Z| \\le 3) \\approx 99{,}7\\,\\%$.",
   "reponse": "N(1)",
   "valeur": 0.8413447460685429,
   "tolerance": 0.002,
   "duree": 20
  },
  {
   "id": "cst-quantile-975",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "Quantile à 97,5 % de la loi normale centrée réduite ?",
   "solution": "**1,96** (intervalle de confiance à 95 %). À 95 % : 1,645 ; à 99 % : 2,326 ; à 99,5 % : 2,576.",
   "reponse": "1.96",
   "valeur": 1.96,
   "tolerance": 0.003,
   "duree": 20
  },
  {
   "id": "cst-quantile-99",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "Quantile à 99 % de la loi normale centrée réduite (utilisé pour la VaR 99 %) ?",
   "solution": "**2,326**. À 95 % : 1,645.",
   "reponse": "2.3263",
   "valeur": 2.3263,
   "tolerance": 0.003,
   "duree": 20
  },
  {
   "id": "cst-densite-zero",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "$1/\\sqrt{2\\pi}$, la densité de la loi normale en $0 \\approx$ ?",
   "solution": "**$\\approx 0{,}399$**, soit environ 0,4 : c'est le « 0,4 » de l'approximation d'un call à la monnaie ($0{,}4 \\sigma S \\sqrt{T}$). $\\varphi (1) \\approx 0{,}242$ ; $\\varphi (2) \\approx 0{,}054$.",
   "reponse": "1/sqrt(2*pi)",
   "valeur": 0.3989422804014327,
   "tolerance": 0.003,
   "duree": 20
  },
  {
   "id": "cst-racine-252",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "$\\sqrt{252} \\approx$ ? (nombre de jours de bourse par an, pour annualiser une volatilité)",
   "solution": "**$\\sqrt{252} \\approx 15{,}87$**, souvent arrondi à 16. Une volatilité annuelle de 16 % correspond à un mouvement quotidien typique de 1 %. $\\sqrt{12} \\approx 3{,}46$ ; $\\sqrt{52} \\approx 7{,}21$.",
   "reponse": "sqrt(252)",
   "valeur": 15.874507866387544,
   "tolerance": 0.003,
   "duree": 20
  },
  {
   "id": "cst-vol-quotidienne",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Une action a une volatilité annuelle de 32 %. Quel mouvement quotidien typique (un écart-type), en % ?",
   "solution": "$32\\,\\%/\\sqrt{252} \\approx 32/16 \\approx$ **2 % par jour**.",
   "reponse": "0.32/sqrt(252)",
   "valeur": 0.020158105227158784,
   "tolerance": 0.02,
   "duree": 30
  },
  {
   "id": "cst-regle-72",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien d'années pour doubler un capital placé à 6 % par an ?",
   "solution": "Règle de 72 : $72/6 =$ **12 ans** (exactement $\\ln 2/\\ln 1{,}06 \\approx 11{,}9$).",
   "reponse": "ln(2)/ln(1.06)",
   "valeur": 11.895661045941875,
   "tolerance": 0.02,
   "duree": 30
  },
  {
   "id": "cst-puissances-2",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "$2^{16} =$ ?",
   "solution": "**65 536**. $2^{10} = 1\\,024 \\approx 10^{3}$ ; $2^{20} \\approx 10^{6}$ ; $2^{32} \\approx 4{,}3 \\times 10^{9}$.",
   "reponse": "2^16",
   "valeur": 65536.0,
   "tolerance": 0.005,
   "duree": 20
  },
  {
   "id": "cst-e-01",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "$e^{0{,}1} \\approx$ ? (de tête)",
   "solution": "$1 + x + x^{2}/2 = 1 + 0{,}1 + 0{,}005 \\approx$ **1,105**. Pour $x$ petit, $e^x \\approx 1 + x$ et $\\ln (1 + x) \\approx x - x^{2}/2$.",
   "reponse": "exp(0.1)",
   "valeur": 1.1051709180756477,
   "tolerance": 0.002,
   "duree": 30
  },
  {
   "id": "cst-carres",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "$17^{2} =$ ?",
   "solution": "**289**. À connaître : les carrés jusqu'à 25 (169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625). Astuce : $(a + b)^{2} = a^{2} + 2ab + b^{2}$, par exemple $47^{2} = 2\\,500 - 300 + 9 = 2\\,209$.",
   "reponse": "17^2",
   "valeur": 289.0,
   "tolerance": 0.005,
   "duree": 20
  },
  {
   "id": "cst-variance-de",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Variance d'un dé équilibré à six faces ?",
   "solution": "$\\mathbb{E}[X^{2}] - \\mathbb{E}[X]^{2} = 91/6 - 49/4 =$ **$35/12 \\approx 2{,}917$** ; écart-type $\\approx 1{,}708$. Pour la somme de $n$ dés : variance $35n/12$.",
   "reponse": "35/12",
   "valeur": 2.9166666666666665,
   "tolerance": 0.002,
   "duree": 30
  },
  {
   "id": "cst-pi-carre",
   "theme": "constantes",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "$\\sum 1/n^{2}$ ($n$ de 1 à l'infini) = ?",
   "solution": "**$\\pi^{2}/6 \\approx 1{,}645$** (problème de Bâle). À connaître aussi : $\\sum 1/n$ diverge $(\\approx \\ln n + 0{,}577), \\sum x^{n} = 1/(1 - x), \\sum n x^{n-1} = 1/(1 - x)^{2}$.",
   "reponse": "pi^2/6",
   "valeur": 1.6449340668482264,
   "tolerance": 0.002,
   "duree": 30
  },
  {
   "id": "stoch-ou-variance",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "hf",
    "risque"
   ],
   "type": "numerique",
   "question": "$dX = -3X dt + 2 dW$ (Ornstein-Uhlenbeck). Quelle est la variance stationnaire de $X$ ?",
   "solution": "$\\kappa = 3, \\sigma = 2$ : variance stationnaire $\\sigma^{2}/(2\\kappa) = 4/6 =$ **$2/3$**.\nDémonstration : $X_t = X_{0}e^{-\\kappa t} + \\sigma \\int_{0}^{t} e^{-\\kappa (t-s)} dW_s$, de variance $\\sigma^{2}(1 - e^{-2\\kappa t})/(2\\kappa) \\to \\sigma^{2}/(2\\kappa)$.",
   "en": "$dX = -3X dt + 2 dW$ (Ornstein-Uhlenbeck). What is the stationary variance of $X$?",
   "indice": "Facteur intégrant $e^{\\kappa t}$, puis isométrie d'Itô : $\\sigma^{2} \\int_{0}^\\infty e^{-2\\kappa u}$ du.",
   "piege": "Oublier le 2 : $\\sigma^{2}/\\kappa$ est faux, car $\\int_{0}^\\infty e^{-2\\kappa u}$ du $= 1/(2\\kappa)$.",
   "relances": [
    "Et la demi-vie ? ($\\ln 2/3 \\approx 0{,}23$)",
    "Que vaut $\\operatorname{Cov} (X_s, X_t)$ en régime stationnaire ? ($\\sigma^{2}/(2\\kappa) \\cdot e^{-\\kappa |t-s|}$)"
   ],
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "stoch-cir-moyenne",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Taux court CIR : $dr = \\kappa (\\theta - r)dt + \\sigma \\sqrt{r} dW$ avec $\\kappa = 1, \\theta = 5\\,\\%, \\sigma = 10\\,\\%, r_{0} = 1\\,\\%$. Que vaut $\\mathbb{E}[r_{1}]$ ?",
   "solution": "$m(t) = \\mathbb{E}[r_t]$ vérifie $m' = \\kappa (\\theta - m)$, donc $m(t) = \\theta + (r_{0} - \\theta)e^{-\\kappa t} = 0{,}05 - 0{,}04e^{-1} \\approx$ **3,53 %**.\nLa volatilité n'intervient pas : CIR et Vasicek ont la même moyenne.",
   "en": "CIR short rate with $\\kappa = 1, \\theta = 5\\,\\%, \\sigma = 10\\,\\%, r_{0} = 1\\,\\%$. What is $\\mathbb{E}[r_{1}]$?",
   "indice": "Prends l'espérance de l'EDS : le terme en $dW$ disparaît.",
   "relances": [
    "Variance stationnaire de CIR ? ($\\sigma^{2}\\theta /(2\\kappa)$, obtenue en appliquant Itô à $r^{2}$)",
    "Qu'est-ce que la condition de Feller ? ($2\\kappa \\theta \\ge \\sigma^{2}$ : le taux ne touche pas 0)"
   ],
   "reponse": "0.05-0.04*exp(-1)",
   "valeur": 0.03528482235314231,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "stoch-vasicek-zc",
   "theme": "stoch",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Dans le modèle de Vasicek, comment obtient-on le prix d'un zéro-coupon $P(0, T) = \\mathbb{E}[\\exp (- \\int_{0}^{T} r_t dt)]$ ?",
   "solution": "$r$ est un processus d'Ornstein-Uhlenbeck, donc gaussien ; $I = \\int_{0}^{T} r_t dt$ est une intégrale (limite de sommes) de gaussiennes : **I est gaussienne**.\n- $\\mathbb{E}[I] = \\theta T + (r_{0} - \\theta)B(T)$, avec $B(T) = (1 - e^{-\\kappa T})/\\kappa$.\n- $\\operatorname{Var} (I) = (\\sigma^{2}/\\kappa^{2})(T - 2B(T) + (1 - e^{-2\\kappa T})/(2\\kappa))$, par Fubini stochastique puis isométrie.\n- $P(0, T) = \\mathbb{E}[e^{-I}] = \\exp (-\\mathbb{E}[I] + \\operatorname{Var} (I)/2)$ (transformée de Laplace gaussienne).\nLe terme $+\\operatorname{Var}/2$ est un effet de convexité : plus les taux sont volatils, plus les zéro-coupons longs valent cher.",
   "en": "In the Vasicek model, how do you get the zero-coupon bond price $P(0, T) = \\mathbb{E}[\\exp (- \\int_{0}^{T} r_t dt)]$?",
   "relances": [
    "Pourquoi Vasicek peut-il donner des taux négatifs ?",
    "Que change Hull-White ? ($\\theta (t)$ pour recaler la courbe initiale)"
   ],
   "duree": 300
  },
  {
   "id": "der-black76",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "mm",
    "risque"
   ],
   "type": "numerique",
   "question": "Call sur un futures d'électricité : $F = K = 80$, volatilité 25 %, maturité 1 an, taux 4 %. Prix par la formule de Black ? ($N(0{,}125) \\approx 0{,}5497$)",
   "solution": "$d_{1} = 0{,}125, d_{2} = -0{,}125$. $C = e^{-0{,}04} \\times 80 \\times (N(0{,}125) - N(-0{,}125)) \\approx 0{,}9608 \\times 80 \\times 0{,}0995 \\approx$ **7,65**.\nApproximation : $e^{-rT} \\times 0{,}4 \\times \\sigma \\times F \\times \\sqrt{T} = 0{,}96 \\times 0{,}4 \\times 0{,}25 \\times 80 \\approx 7{,}69$.",
   "en": "Call on a power futures: $F = K = 80$, vol 25%, maturity 1 year, rate 4%. Black-76 price? ($N(0.125) \\approx 0.5497$)",
   "indice": "$C = e^{-rT}(F N(d_{1}) - K N(d_{2}))$ avec $d_{1},_{2} = \\pm \\sigma \\sqrt{T}/2$ à la monnaie.",
   "relances": [
    "Pourquoi utilise-t-on Black-76 plutôt que Black-Scholes sur les matières premières ?",
    "Et si les prix peuvent devenir négatifs ? (modèle de Bachelier)"
   ],
   "reponse": "exp(-0.04)*80*(N(0.125)-N(-0.125))",
   "valeur": 7.646073782233016,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "der-grecques-identite",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque"
   ],
   "type": "ouverte",
   "question": "Démontre l'identité $S \\varphi (d_{1}) = K e^{-rT} \\varphi (d_{2})$ et déduis-en le vega d'un call Black-Scholes.",
   "solution": "$\\varphi (d_{1})/\\varphi (d_{2}) = \\exp (-(d_{1}^{2} - d_{2}^{2})/2) = \\exp (-(d_{1} - d_{2})(d_{1} + d_{2})/2)$. Or $d_{1} - d_{2} = \\sigma \\sqrt{T}$ et $d_{1} + d_{2} = (2 \\ln (S/K) + 2rT)/(\\sigma \\sqrt{T})$ : le produit vaut $2 \\ln (S/K) + 2rT$, donc $\\varphi (d_{1})/\\varphi (d_{2}) = K e^{-rT}/S$.\n**Vega** : $\\partial C/ \\partial \\sigma = S \\varphi (d_{1}) \\partial d_{1}/ \\partial \\sigma - K e^{-rT} \\varphi (d_{2}) \\partial d_{2}/ \\partial \\sigma = S \\varphi (d_{1})(\\partial d_{1}/ \\partial \\sigma - \\partial d_{2}/ \\partial \\sigma) =$ **$S \\varphi (d_{1}) \\sqrt{T}$**, car $d_{1} - d_{2} = \\sigma \\sqrt{T}$.\nLa même identité donne $\\Delta = N(d_{1})$, le theta et le rho en quelques lignes.",
   "en": "Prove $S \\varphi (d_{1}) = K e^{-rT} \\varphi (d_{2})$ and use it to derive the Black-Scholes vega.",
   "relances": [
    "Quel est le vega d'un call à la monnaie un an, $S = 100$ ? ($\\approx 0{,}4$ par point de vol)",
    "Pourquoi call et put de même strike ont-ils le même vega ?"
   ],
   "duree": 240
  },
  {
   "id": "der-dupire",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque"
   ],
   "type": "ouverte",
   "question": "Écris la formule de Dupire (taux et dividendes nuls) et explique d'où elle vient.",
   "solution": "$\\sigma_\\text{loc}^{2}(T, K) = \\partial_T$ C / ($\\tfrac12 K^{2} \\partial_{KK}$ C).\n**Heuristique** : appliquer Itô à $(S_T - K)^{+}$ avec $f' = 1{S > K}$ et $f'' = \\delta_K$ (formule de Tanaka). En espérance, le terme en $dS$ disparaît ($S$ martingale) et il reste $\\partial_T C = \\tfrac12 \\sigma_\\text{loc}^{2}(T, K) K^{2} f(K, T)$, où $f$ est la densité de $S_T$. Breeden-Litzenberger donne $f(K, T) = \\partial_{KK}$ C. On divise.\n**À dire ensuite** : la vol locale calibre exactement les vanilles mais donne une mauvaise dynamique du smile ; il faut une surface lissée et sans arbitrage (dérivées de données bruitées).",
   "en": "Write Dupire's local volatility formula (zero rates and dividends) and explain where it comes from.",
   "relances": [
    "Que se passe-t-il si la surface a un arbitrage papillon ? ($\\partial_{KK} C < 0$ : variance locale négative)",
    "Vol locale ou vol stochastique pour une option forward-start ?"
   ],
   "duree": 300
  },
  {
   "id": "mm-glosten-milgrom",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une action vaut 80 ou 120 avec probabilité ½. Un quart des clients connaît la vraie valeur ; les autres achètent ou vendent au hasard. Quel ask fixe un teneur de marché qui ne veut ni gagner ni perdre en moyenne ?",
   "solution": "$\\mathbb{P}(\\text{achat} | 120) = 0{,}25 + 0{,}75/2 = 0{,}625$ ; $\\mathbb{P}(\\text{achat} | 80) = 0{,}375$ ; $\\mathbb{P}(\\text{achat}) = \\tfrac12$. Donc $\\mathbb{P}(120 | \\text{achat}) = 0{,}625$ et ask $= 80 + 0{,}625 \\times 40 =$ **105**.\nPar symétrie bid $= 95$ : le spread vaut $\\alpha \\times (V_H - V_L) = 10$, uniquement à cause de l'information privée.",
   "en": "A stock is worth 80 or 120 with probability ½. A quarter of the clients know the true value; the others buy or sell at random. What ask does a break-even market maker quote?",
   "indice": "ask $= \\mathbb{E}[V | \\text{achat}]$, par Bayes.",
   "relances": [
    "Un client vient d'acheter. Quel ask pour le suivant ? ($\\mathbb{E}[V | \\text{deux achats}] \\approx 109{,}4$)",
    "Que devient le spread si personne n'est informé ?"
   ],
   "reponse": "105",
   "valeur": 105.0,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "mm-reservation-equivalent-certain",
   "theme": "marches",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Dans Avellaneda-Stoikov, démontre que le prix de réservation vaut $r = s - q \\gamma \\sigma^{2} (T - t)$.",
   "solution": "Avec une utilité exponentielle et $S_T \\sim N(s, \\sigma^{2}(T - t))$, la valeur d'un inventaire figé est $-\\exp(-\\gamma \\cdot \\text{EC})$ avec l'**équivalent certain** $\\text{EC} = x + q s - \\tfrac12 \\gamma q^{2} \\sigma^{2} (T - t)$ (transformée de Laplace gaussienne).\nPrix de réservation à l'achat $r_b$ : indifférence entre ($x, q$) et ($x - r_b, q + 1$), soit $r_b = s - \\tfrac12 (1 + 2q) \\gamma \\sigma^{2} (T - t)$. À la vente : $r_a = s + \\tfrac12 (1 - 2q) \\gamma \\sigma^{2} (T - t)$. La moyenne vaut **$s - q \\gamma \\sigma^{2} (T - t)$**.\nLecture : long d'inventaire, on baisse ses prix pour vendre ; l'effet croît avec $\\gamma, \\sigma^{2}$ et le temps restant.",
   "en": "In Avellaneda-Stoikov, prove that the reservation price is $r = s - q \\gamma \\sigma^{2} (T - t)$.",
   "relances": [
    "D'où vient le terme $(2/\\gamma) \\ln (1 + \\gamma /k)$ du spread ?",
    "Que manque-t-il à ce modèle pour un vrai marché ? (sélection adverse, file d'attente, sauts)"
   ],
   "duree": 300
  },
  {
   "id": "risque-portefeuille-variance-min",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux actifs non corrélés de volatilités 10 % et 20 %. Quel poids dans le premier minimise la variance du portefeuille (investi à 100 %) ?",
   "solution": "Avec $\\rho = 0$ : $w_{1} = \\sigma_{2}^{2}/(\\sigma_{1}^{2} + \\sigma_{2}^{2}) = 0{,}04/0{,}05 =$ **0,8**. Sans corrélation, on pondère par l'inverse des variances.\nVol obtenue : $\\sqrt{0{,}64 \\times 0{,}01 + 0{,}04 \\times 0{,}04} \\approx 8{,}9\\,\\%$, moins que le moins risqué des deux.",
   "en": "Two uncorrelated assets with vols 10% and 20%. Which weight in the first minimises portfolio variance (fully invested)?",
   "indice": "$w_{1} = (\\sigma_{2}^{2} - \\rho \\sigma_{1}\\sigma_{2})/(\\sigma_{1}^{2} + \\sigma_{2}^{2} - 2\\rho \\sigma_{1}\\sigma_{2})$.",
   "relances": [
    "Forme générale ? ($\\sum^{-1}1 / 1^{T}\\sum^{-1}1$, par le lagrangien)",
    "Et si $\\rho = 1$ ?"
   ],
   "reponse": "0.8",
   "valeur": 0.8,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "risque-sharpe-strategies",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "data"
   ],
   "type": "numerique",
   "question": "Deux stratégies non corrélées ont des ratios de Sharpe de 0,6 et 0,8. Quel est le Sharpe de leur meilleure combinaison ?",
   "solution": "Pour des stratégies non corrélées, $\\text{SR}_*^2 = \\sum_i \\text{ SR}_i^2$ (portefeuille tangent, $\\text{SR}_*^2 = m^{T}\\Sigma^{-1}m$). $\\sqrt{0{,}36 + 0{,}64} =$ **1**.\nC'est la logique des fonds multi-stratégies et de la loi fondamentale $\\text{IR} \\approx \\text{IC } \\sqrt{N}$.",
   "en": "Two uncorrelated strategies have Sharpe ratios 0.6 and 0.8. What is the Sharpe ratio of their best combination?",
   "relances": [
    "Et si elles étaient corrélées à 0,5 ?",
    "Combien de stratégies indépendantes de Sharpe 0,5 pour atteindre 2 ? (16)"
   ],
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "risque-var-sous-additivite",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Montre par un exemple que la VaR n'est pas sous-additive. Pourquoi l'Expected Shortfall est-elle préférée ?",
   "solution": "Deux prêts indépendants perdent chacun 100 avec probabilité 4 %. Pour chacun, $\\mathbb{P}(\\text{perte} > 0) = 4\\,\\% < 5\\,\\%$, donc VaR $95\\,\\% = 0$. Pour les deux ensemble, $\\mathbb{P}(\\text{au moins une perte}) = 1 - 0{,}96^{2} = 7{,}84\\,\\% > 5\\,\\%$, donc VaR $95\\,\\% = 100 > 0 + 0$.\nLa VaR peut donc pénaliser la diversification, et elle ignore ce qui se passe au-delà du seuil. L'**ES** (moyenne des pertes au-delà de la VaR) est sous-additive (mesure de risque cohérente) et voit la queue ; la réglementation (FRTB) l'utilise à 97,5 %.",
   "en": "Show with an example that VaR is not subadditive. Why is Expected Shortfall preferred?",
   "relances": [
    "ES à 97,5 % d'une gaussienne, en écarts-types ? ($\\approx 2{,}34$, proche de la VaR à 99 %)",
    "Défaut de l'ES ? (plus difficile à backtester)"
   ],
   "duree": 180
  },
  {
   "id": "risque-proba-drawdown",
   "theme": "stats",
   "niveau": 3,
   "profils": [
    "hf",
    "risque",
    "mm"
   ],
   "type": "numerique",
   "question": "La valeur d'une stratégie suit un brownien de dérive 5 % et de volatilité 10 % par an. Quelle est la probabilité qu'elle passe un jour 10 % sous son niveau actuel ?",
   "solution": "$e^{\\theta X}$ est une martingale si $\\theta \\mu + \\tfrac12 \\theta^{2}\\sigma^{2} = 0$, soit $\\theta = -2\\mu /\\sigma^{2}$. Arrêt optionnel entre $-d$ et $+a$, puis $a \\to \\infty$ : $P = e^{-2\\mu d/\\sigma^{2}} = e^{-2 \\times 0{,}05 \\times 0{,}1/0{,}01} =$ **$e^{-1} \\approx 0{,}37$**.\nVersion continue de la ruine du joueur avec biais.",
   "en": "A strategy's value follows a Brownian motion with drift 5% and volatility 10% per year. What is the probability that it ever falls 10% below its current level?",
   "indice": "Cherche $\\theta$ tel que $e^{\\theta X_t}$ soit une martingale, puis arrêt optionnel.",
   "relances": [
    "Pourquoi les drawdowns depuis le plus haut sont-ils plus fréquents que ce calcul ?",
    "Que devient la probabilité si le Sharpe double ?"
   ],
   "reponse": "exp(-1)",
   "valeur": 0.36787944117144233,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "stats-lasso-seuillage",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "Lasso à une variable normée ($\\sum x_{i}^{2} = 1$), critère $\\sum (y_{i} - \\beta x_{i})^{2} + \\lambda |\\beta |$ avec $\\lambda = 1$. Le coefficient des moindres carrés vaut 0,8. Coefficient Lasso ?",
   "solution": "Pour $\\beta > 0$ : $2\\beta - 2z + \\lambda = 0$, donc $\\beta = z - \\lambda /2 = 0{,}8 - 0{,}5 =$ **0,3** (valable car positif).\nSeuillage doux : $\\beta = \\operatorname{signe}(z)\\,(|z| - \\lambda /2)^{+}$. Si $z$ valait 0,3, le Lasso donnerait exactement 0 : c'est ainsi qu'il sélectionne les variables.",
   "en": "One-variable Lasso with $\\sum x_{i}^{2} = 1$, objective $\\sum (y_{i} - \\beta x_{i})^{2} + \\lambda |\\beta |$ with $\\lambda = 1$. The OLS coefficient is 0.8. Lasso coefficient?",
   "indice": "Le critère vaut $\\beta^{2} - 2\\beta z + \\lambda |\\beta |$ à une constante près ; dérive pour $\\beta > 0$.",
   "relances": [
    "Et la Ridge avec le même $\\lambda$ ? ($z/(1 + \\lambda) = 0{,}4$)",
    "Pourquoi géométriquement des zéros exacts ?"
   ],
   "reponse": "0.3",
   "valeur": 0.3,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "stats-variance-mco",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Dérive l'estimateur des moindres carrés et sa variance $\\operatorname{Var} (\\hat{\\beta} | X) = \\sigma^{2}(X^{T}X)^{-1}$. Quelles hypothèses utilises-tu ?",
   "solution": "Gradient de $\\| y - X\\beta \\|^{2}$ : $-2X^{T}y + 2X^{T}X\\beta = 0$, donc $\\hat{\\beta} = (X^{T}X)^{-1}X^{T}y$ ($X^{T}X$ inversible : pas de colinéarité parfaite).\n$\\hat{\\beta} = \\beta + (X^{T}X)^{-1}X^{T}\\varepsilon$. **Sans biais** si $\\mathbb{E}[\\varepsilon | X] = 0$ (exogénéité). **Variance** : $\\operatorname{Var} (A\\varepsilon) = A \\operatorname{Var} (\\varepsilon) A^{T}$ avec $A = (X^{T}X)^{-1}X^{T}$ ; si $\\operatorname{Var} (\\varepsilon | X) = \\sigma^{2}I$ (homoscédasticité, pas d'autocorrélation), on obtient $\\sigma^{2}(X^{T}X)^{-1}X^{T}X(X^{T}X)^{-1} =$ **$\\sigma^{2}(X^{T}X)^{-1}$**.\nSi l'homoscédasticité tombe, les coefficients restent sans biais mais les erreurs standard sont fausses (White, Newey-West).",
   "en": "Derive the OLS estimator and its variance $\\operatorname{Var} (\\hat{\\beta} | X) = \\sigma^{2}(X^{T}X)^{-1}$. Which assumptions do you use?",
   "relances": [
    "Que devient la variance d'une pente quand deux variables sont corrélées à 0,9 ? ($\\times 5{,}3$)",
    "Biais de variable omise ?"
   ],
   "duree": 180
  },
  {
   "id": "ml-foret-variance",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "numerique",
   "question": "Une forêt aléatoire moyenne 50 arbres ; chaque arbre a une variance de prédiction de 1, et deux arbres ont une corrélation de 0,2. Variance de la prédiction de la forêt ?",
   "solution": "$\\rho \\sigma^{2} + (1 - \\rho)\\sigma^{2}/B = 0{,}2 + 0{,}8/50 =$ **0,216**. Le terme $\\rho \\sigma^{2}$ ne diminue pas avec le nombre d'arbres : d'où le tirage aléatoire de variables, qui décorrèle les arbres. Même calcul que la limite de la diversification d'un portefeuille.",
   "en": "A random forest averages 50 trees; each tree has prediction variance 1 and pairwise correlation 0.2. Variance of the forest's prediction?",
   "relances": [
    "Et le boosting, il réduit quoi ? (le biais)"
   ],
   "reponse": "0.216",
   "valeur": 0.216,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ml-gradient-logistique",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Dérive le gradient de la log-loss d'une régression logistique.",
   "solution": "$p = \\sigma (z), z = x^{T}\\beta, \\sigma '(z) = \\sigma (z)(1 - \\sigma (z))$. Donc $\\partial / \\partial z \\ln \\sigma = 1 - \\sigma$ et $\\partial / \\partial z \\ln (1 - \\sigma) = -\\sigma$.\nPour un exemple : $\\partial / \\partial z [-y \\ln \\sigma - (1 - y) \\ln (1 - \\sigma)] = -y(1 - \\sigma) + (1 - y)\\sigma =$ **$\\sigma (z) - y$**. En chaîne ($\\partial z/ \\partial \\beta = x$) : gradient $(p - y)x$, soit **$X^{T}(p - y)/n$** pour la moyenne.\nMême forme que les moindres carrés ; la perte est convexe (hessienne $\\sum p(1 - p)\\,x x^{T} \\succeq 0$).",
   "en": "Derive the gradient of the logistic regression log-loss.",
   "relances": [
    "Interprétation d'un coefficient ? (multiplie la cote par $e^\\beta$)",
    "Pourquoi pas les moindres carrés sur une étiquette $0/1$ ?"
   ],
   "duree": 180
  },
  {
   "id": "num-antithetique",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Quand les variables antithétiques réduisent-elles la variance d'un Monte-Carlo ? Et quand sont-elles inutiles ?",
   "solution": "$\\operatorname{Var} ((f(Z) + f(-Z))/2) = \\tfrac12$(Var $f(Z) + \\operatorname{Cov} (f(Z), f(-Z))$). À coût égal, le gain existe si et seulement si **$\\operatorname{Cov} (f(Z), f(-Z)) < 0$**, ce qui est vrai pour $f$ monotone (un call, un put).\nInutiles (voire nuisibles) pour $f$ paire : un straddle à la monnaie, $f(z) = z^{2}$. Autres réductions : variable de contrôle (variance $\\times (1 - \\rho^{2})$), échantillonnage préférentiel, quasi-Monte-Carlo.",
   "en": "When do antithetic variates reduce Monte Carlo variance? When are they useless?",
   "relances": [
    "Quelle variable de contrôle pour une asiatique arithmétique ? (l'asiatique géométrique)"
   ],
   "duree": 120
  },
  {
   "id": "num-stabilite-explicite",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque"
   ],
   "type": "numerique",
   "question": "Schéma explicite pour $\\partial_\\tau u = \\tfrac12 \\sigma^{2} \\partial_\\text{xxu}$ avec $\\sigma = 30\\,\\%$ et un pas en log-prix $\\Delta x = 0{,}02$. Plus grand pas de temps stable, en années ?",
   "solution": "Stabilité si $\\alpha \\le \\tfrac12$, soit $\\Delta \\tau \\le \\Delta x^{2}/\\sigma^{2} = 0{,}0004/0{,}09 \\approx$ **0,0044 an** (environ 1,1 jour ouvré).\nDiviser $\\Delta x$ par 2 oblige à diviser $\\Delta \\tau$ par 4 : d'où les schémas implicites ou Crank-Nicolson.",
   "en": "Explicit scheme for $\\partial_\\tau u = \\tfrac12 \\sigma^{2} \\partial_\\text{xxu}$ with $\\sigma = 30\\,\\%$ and $\\Delta x = 0.02$ in log-price. Largest stable time step, in years?",
   "indice": "Analyse de von Neumann : facteur d'amplification $1 - 4\\alpha \\sin^{2}(k\\Delta x/2)$, avec $\\alpha = \\sigma^{2}\\Delta \\tau /(2\\Delta x^{2})$.",
   "relances": [
    "Ordre de Crank-Nicolson ? (2 en temps et en espace)",
    "Pourquoi des oscillations près du strike ?"
   ],
   "reponse": "0.0004/0.09",
   "valeur": 0.0044444444444444444,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "num-box-muller",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "banque",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Comment générer deux gaussiennes standard indépendantes à partir de deux uniformes ? Pourquoi est-ce correct ?",
   "solution": "**Box-Muller** : $R = \\sqrt{-2 \\ln U_{1}}, \\Theta = 2\\pi U_{2}, Z_{1} = R \\cos \\Theta, Z_{2} = R \\sin \\Theta$.\nEn polaires, la densité $(1/2\\pi)e^{-r^{2}/2} r dr d\\theta$ se factorise : $\\Theta$ uniforme, indépendant de $R$, et $R^{2}/2 \\sim$ Exp(1). Or $-\\ln U_{1} \\sim$ Exp(1) (méthode d'inversion).\nPour deux gaussiennes corrélées à $\\rho$ : $X_{2} = \\rho Z_{1} + \\sqrt{1 - \\rho^{2}}Z_{2}$ (Cholesky).",
   "en": "How do you generate two independent standard normals from two uniforms? Why does it work?",
   "relances": [
    "Simuler une exponentielle ? ($-\\ln U / \\lambda$)",
    "Un point uniforme dans un disque ? ($r = \\sqrt{U}$, pas $r = U$)"
   ],
   "duree": 150
  },
  {
   "id": "taux-swap-telescopage",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Pourquoi la jambe variable d'un swap de taux vaut-elle $1 - P(0, T_n)$ (pour un nominal de 1) ? Quel est le taux de swap au pair ?",
   "solution": "Recevoir $\\delta L_i$ en $T_i$ ($L_i$ fixé en $T_{i-1}$) se réplique en plaçant 1 en $T_{i-1}$ jusqu'à $T_i$, ce qui rapporte $1 + \\delta L_i$ : le flux vaut $\\mathbb{P}(0, T_{i-1}) - P(0, T_i)$. En sommant, tout se télescope : **$1 - P(0, T_n)$**.\nJambe fixe : $K \\delta \\sum P(0, T_i)$. Taux au pair : **$S = (1 - P(0, T_n)) / (\\delta \\sum P(0, T_i))$**, moyenne pondérée des forwards.\nDepuis 2008, actualisation et projection n'utilisent plus la même courbe : la formule n'est plus exacte (mono-courbe).",
   "en": "Why is the floating leg of an interest rate swap worth $1 - P(0, T_n)$ (unit notional)? What is the par swap rate?",
   "relances": [
    "Duration d'un swap payeur de taux fixe ? (négative)"
   ],
   "duree": 180
  },
  {
   "id": "proba-scrutin",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Un candidat obtient 7 voix et l'autre 3. Le dépouillement se fait dans un ordre aléatoire. Probabilité que le premier soit strictement en tête pendant tout le dépouillement ?",
   "solution": "$(a - b)/(a + b) = (7 - 3)/10 =$ **$2/5$**.\nPreuve : les bons dépouillements commencent par A ; ceux qui, partant de là, touchent l'égalité sont en bijection (par réflexion avant le premier retour à 0) avec les dépouillements qui commencent par B. On obtient $\\binom{9}{6} - \\binom{9}{7} = 84 - 36 = 48$ bons sur $\\binom{10}{3} = 120$.",
   "en": "Candidate A gets 7 votes, B gets 3, counted in random order. Probability that A is strictly ahead throughout the count?",
   "indice": "Théorème du scrutin, démontré par le principe de réflexion.",
   "relances": [
    "Et si l'on demande « jamais derrière » au lieu de « strictement devant » ? ($(a + 1 - b)/(a + 1)$)",
    "Lien avec les nombres de Catalan ?"
   ],
   "categorie": "denombrement",
   "titre": "Le problème du scrutin",
   "reponse": "2/5",
   "valeur": 0.4,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proba-catalan",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de suites de 4 parenthèses ouvrantes et 4 fermantes sont bien formées ?",
   "solution": "Nombre de Catalan $C_{4} = \\binom{8}{4}/5 = 70/5 =$ **14**.\nPreuve par réflexion : parmi les $\\binom{8}{4}$ chemins de 0 à 0, ceux qui passent sous 0 sont en bijection avec les chemins de 0 à $-2$, au nombre de $\\binom{8}{5} = 56$ ; $70 - 56 = 14$.",
   "en": "How many well-formed sequences of 4 opening and 4 closing parentheses are there?",
   "relances": [
    "Combien d'arbres binaires à 4 nœuds internes ? (14 aussi)",
    "Comment le vérifier en code ? (pile, ou compteur qui ne doit jamais devenir négatif)"
   ],
   "categorie": "denombrement",
   "titre": "Parenthésages bien formés (nombres de Catalan)",
   "reponse": "14",
   "valeur": 14.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proba-amincissement",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Des ordres arrivent selon un processus de Poisson de 6 par minute ; chacun est un gros ordre avec probabilité $1/3$, indépendamment. Probabilité de recevoir au moins 2 gros ordres dans la minute ?",
   "solution": "Par amincissement, les gros ordres suivent un Poisson d'intensité 2 par minute : $\\mathbb{P}(N \\ge 2) = 1 - e^{-2}(1 + 2) =$ **$1 - 3e^{-2} \\approx 0{,}594$**.\nLe nombre de petits ordres est un Poisson indépendant (intensité 4) : observer beaucoup de petits ordres n'apprend rien sur les gros.",
   "en": "Orders arrive as a Poisson process at 6 per minute; each is large with probability $1/3$, independently. Probability of at least 2 large orders within a minute?",
   "indice": "Les gros ordres forment eux-mêmes un processus de Poisson.",
   "relances": [
    "Temps moyen jusqu'au premier gros ordre ? (30 secondes)"
   ],
   "reponse": "1-3*exp(-2)",
   "valeur": 0.5939941502901619,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "stats-equicorrelation",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "Six actifs ont des rendements standardisés, deux à deux corrélés à 0,2. Quelle est la plus grande valeur propre de leur matrice de corrélation ?",
   "solution": "Vecteur propre $1 = (1, \\dots, 1)$ : valeur propre $1 + (n - 1)\\rho = 1 + 5 \\times 0{,}2 =$ **2** (le mode marché, un tiers de la variance totale 6). Les cinq autres valent $1 - \\rho = 0{,}8$.\nConséquence : la matrice n'est valide que si $\\rho \\ge -1/(n - 1) = -0{,}2$.",
   "en": "Six standardised assets with pairwise correlation 0.2. Largest eigenvalue of their correlation matrix?",
   "indice": "$R = (1 - \\rho)I + \\rho 11^{T}$.",
   "relances": [
    "Quelle part de variance explique la première composante principale ? ($2/6$)"
   ],
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "stats-cholesky",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "banque",
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "Factorisation de Cholesky $\\Sigma = LL^T$ de la matrice de covariance $\\begin{pmatrix} 4 & 2 \\\\ 2 & 4 \\end{pmatrix}$ : que vaut $L_{22}$ ?",
   "solution": "$L_{11} = \\sqrt{4} = 2, L_{21} = 2/2 = 1, L_{22} = \\sqrt{4 - 1^{2}} =$ **$\\sqrt{3} \\approx 1{,}732$**.\nLecture : $X_{2} = 1 \\cdot Z_{1} + \\sqrt{3} \\cdot Z_{2}$ ; $\\sqrt{3}^{2} = 3$ est la variance de $X_{2}$ non expliquée par $X_{1}$ ($4 \\times (1 - \\rho^{2})$ avec $\\rho = 0{,}5$).",
   "en": "Cholesky factorisation $\\Sigma = LL^T$ of the covariance matrix $\\begin{pmatrix} 4 & 2 \\\\ 2 & 4 \\end{pmatrix}$: what is $L_{22}$?",
   "relances": [
    "Comment simuler ($X_{1}, X_{2}$) ? ($X =$ LZ)",
    "Que se passe-t-il si la matrice n'est pas définie positive ? (racine d'un nombre négatif : c'est un test de positivité)"
   ],
   "reponse": "sqrt(3)",
   "valeur": 1.7320508075688772,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "der-barriere-carr",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque"
   ],
   "type": "numerique",
   "question": "Black-Scholes, taux nul, $S_{0} = K = 100, \\sigma = 20\\,\\%, T = 1$ an. Prix d'un call down-and-in de barrière 80 (surveillance continue) ? Utilise la réplication statique par des puts.",
   "solution": "$B^{2}/K = 64$. $\\mathbb{P}(100, 64)$ avec $d_{1} = (\\ln (100/64) + 0{,}02)/0{,}2 \\approx 2{,}331$ et $d_{2} \\approx 2{,}131$ : $P = 64 N(-2{,}131) - 100 N(-2{,}331) \\approx 0{,}0712$. Donc $C_{DI} = (100/80) \\times 0{,}0712 \\approx$ **0,089**.\nPourquoi : si la barrière n'est jamais touchée, les puts de strike $64 < 80$ expirent sans valeur ; si elle l'est, en $S = B$ la symétrie call-put donne $\\binom{B}{K} = (K/B) \\mathbb{P}(B, B^{2}/K)$ et l'on échange les puts contre le call sans frais.",
   "en": "Black-Scholes with zero rates, $S_{0} = K = 100, \\sigma = 20\\,\\%, T = 1$. Price of a down-and-in call with barrier 80 (continuous monitoring)? Use the static put replication.",
   "indice": "$C_{DI} = (K/B) \\cdot \\mathbb{P}(S_{0}, B^{2}/K)$, par la symétrie call-put.",
   "relances": [
    "Prix du down-and-out ? (vanille − down-and-in)",
    "Que devient la réplication avec un skew ?"
   ],
   "reponse": "100/80*(64*N(-(log(100/64)-0.02)/0.2)-100*N(-(log(100/64)+0.02)/0.2))",
   "valeur": 0.08898076968192947,
   "tolerance": 0.01,
   "duree": 300
  },
  {
   "id": "der-asiatique-geometrique",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "mm"
   ],
   "type": "numerique",
   "question": "Taux nul, $\\sigma = 24\\,\\%, T = 1$ an. Quelle volatilité utiliser dans la formule de Black pour un call sur la moyenne géométrique continue du sous-jacent ?",
   "solution": "$\\ln G = \\ln S_{0} - \\sigma^{2}T/4 + (\\sigma /T) \\int_{0}^{T} W_t dt$, et $\\operatorname{Var} (\\int_{0}^{T} W dt) = T^{3}/3$. Donc $\\operatorname{Var} (\\ln G) = \\sigma^{2}T/3$ : volatilité **$\\sigma /\\sqrt{3} \\approx 13{,}9\\,\\%$**, avec le forward $S_{0} e^{-\\sigma^{2}T/12}$.\nL'asiatique géométrique sert de variable de contrôle pour l'arithmétique, qui n'a pas de formule fermée.",
   "en": "Zero rates, $\\sigma = 24\\,\\%, T = 1$. Which volatility goes into Black's formula for a call on the continuous geometric average?",
   "relances": [
    "Pourquoi la moyenne arithmétique est-elle toujours plus grande ? (inégalité arithmético-géométrique)"
   ],
   "reponse": "0.24/sqrt(3)",
   "valeur": 0.13856406460551018,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "der-digitale-skew",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi le prix d'une digitale n'est-il pas $e^{-rT}N(d_{2})$ calculé à la vol implicite de son strike ? Dans quel sens joue le skew des actions ?",
   "solution": "La digitale est la limite d'un call spread : $D = -dC/dK$, où $C(K) = C_{BS}(K, \\sigma (K))$. En dérivant : **$D = e^{-rT}N(d_{2}) -$ Vega $\\times \\partial \\sigma / \\partial K$**.\nSur actions, le skew est négatif ($\\partial \\sigma / \\partial K < 0$) : la correction est **positive**, une digitale call vaut plus que Black-Scholes à la vol du strike (et une digitale put moins). L'effet est du même ordre que le prix lui-même : ignorer le skew est une erreur de premier ordre.",
   "en": "Why is a digital option not priced as $e^{-rT}N(d_{2})$ at its strike's implied vol? Which way does the equity skew push the price?",
   "relances": [
    "Comment couvre-t-on une digitale près de l'échéance ? (call spread décalé, overhedge)"
   ],
   "duree": 180
  },
  {
   "id": "nrj-samuelson",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Modèle de Schwartz (log-spot Ornstein-Uhlenbeck) avec $\\kappa = 2$ par an. Quelle fraction de la volatilité du spot porte un forward livrant dans 3 mois ?",
   "solution": "$dF/F = \\sigma e^{-\\kappa (T - t)} dW$ : fraction $e^{-2 \\times 0{,}25} =$ **$e^{-0{,}5} \\approx 0{,}61$**.\nC'est l'effet Samuelson : la volatilité d'un forward augmente à l'approche de la livraison, car un choc sur le spot a le temps de se résorber avant une livraison lointaine.",
   "en": "Schwartz model (Ornstein-Uhlenbeck log-spot) with $\\kappa = 2$ per year. Which fraction of spot volatility does a forward delivering in 3 months carry?",
   "relances": [
    "Pourquoi les forwards lointains bougent-ils quand même en pratique ? (facteur de long terme, modèle à deux facteurs)"
   ],
   "reponse": "exp(-0.5)",
   "valeur": 0.6065306597126334,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "nrj-calendaire",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "banque",
    "mm",
    "risque"
   ],
   "type": "numerique",
   "question": "Forwards base d'électricité : janvier 100 €/MWh (744 heures), février 80 €/MWh (672 heures). Quel prix sans arbitrage pour un produit livrant 1 MW sur janvier et février ?",
   "solution": "Moyenne pondérée par les heures : $(100 \\times 744 + 80 \\times 672)/1\\,416 \\approx$ **90,51 €/MWh** (et non 90 : janvier compte plus d'heures).\nLes deux portefeuilles (le produit bimestriel, ou janvier plus février) livrent exactement la même énergie : même prix.",
   "en": "Baseload power forwards: January 100 €/MWh (744 hours), February 80 €/MWh (672 hours). Arbitrage-free price of a product delivering 1 MW over both months?",
   "relances": [
    "Et pour un produit pointe ? (mêmes poids, mais avec les heures de pointe)"
   ],
   "reponse": "(100*744+80*672)/(744+672)",
   "valeur": 90.50847457627118,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "algo-amorti",
   "theme": "algo",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "banque"
   ],
   "type": "ouverte",
   "question": "Pourquoi l'ajout à la fin d'une liste Python ou d'un std::vector coûte-t-il O(1) « amorti » ? Que se passerait-il si la capacité augmentait de 10 cases à chaque fois ?",
   "solution": "Quand le tableau est plein, on alloue une capacité **multipliée** par un facteur $r > 1$ et on recopie. Les recopies ont lieu à des tailles en progression géométrique ; leur coût total est une série géométrique inférieure à $n/(r - 1)$. Pour $n$ ajouts, le coût total est O($n$), donc O(1) en moyenne par ajout (avec $r = 2$ : moins de $3n$ opérations).\nAvec une croissance **additive** de 10 cases, on recopie 10, 20, 30, … éléments : O($n^{2}$) au total.",
   "en": "Why is appending to a Python list or std::vector O(1) amortised? What if capacity grew by 10 slots each time?",
   "relances": [
    "Pourquoi CPython agrandit-il d'environ 12,5 % plutôt que de doubler ? (mémoire gaspillée contre fréquence des recopies)"
   ],
   "duree": 150
  },
  {
   "id": "ct-boites-etiquettes",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois boîtes portent les étiquettes « pommes », « oranges » et « mélange », mais **toutes** les étiquettes sont fausses. Tu peux tirer des fruits sans regarder dans les boîtes. Combien de fruits faut-il tirer au minimum pour réétiqueter correctement les trois boîtes ?",
   "solution": "La boîte « mélange » n'est pas le mélange : elle ne contient qu'un seul type de fruit. Tire **un fruit** : si c'est une pomme, c'est la boîte de pommes. La boîte étiquetée « oranges » n'est ni les oranges ni (désormais) les pommes : c'est le mélange ; la dernière est les oranges.",
   "indice": "Commence par la boîte étiquetée « mélange » : que contient-elle forcément ?",
   "categorie": "logique",
   "titre": "Trois boîtes toutes mal étiquetées",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-batte-balle",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une batte et une balle coûtent 1,10 € au total. La batte coûte 1 € de plus que la balle. Combien coûte la balle (en euros) ?",
   "solution": "Balle $x$, batte $x + 1$ : $2x + 1 = 1{,}10$, donc $x =$ **0,05 €**. La réponse intuitive (0,10 €) donnerait une batte à 1,10 € et un total de 1,20 €. Ces questions testent le réflexe de **vérifier** avant d'annoncer.",
   "indice": "Ce n'est pas 0,10 € : vérifie la réponse intuitive.",
   "categorie": "nombres",
   "titre": "Batte et balle à 1,10 € (pièges de l'intuition)",
   "reponse": "0.05",
   "valeur": 0.05,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "ct-josephus",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "100 personnes numérotées de 1 à 100 sont en cercle. En partant de la 1, on élimine une personne sur deux (la 2, puis la 4, …) en tournant autour du cercle jusqu'à ce qu'il n'en reste qu'une. Quel numéro survit ?",
   "solution": "Avec $n = 2^m + \\ell$ ($0 \\le \\ell < 2^m$), après $\\ell$ éliminations il reste $2^m$ personnes et c'est au tour de la personne $2\\ell + 1$, qui survivra. $100 = 64 + 36$ : survivant $2 \\times 36 + 1 =$ **73**. En binaire : faire tourner le premier bit à la fin ($1100100 \\to 1001001 = 73$).",
   "indice": "Avec $2^m$ personnes, c'est la n° 1 qui survit. Écris $100 = 64 + 36$.",
   "categorie": "nombres",
   "titre": "Le problème de Josèphe (éliminer une personne sur deux)",
   "reponse": "73",
   "valeur": 73.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-cavalier",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de coups faut-il au minimum à un cavalier pour aller de a1 à h8 ?",
   "solution": "Chaque coup augmente la somme $x + y$ d'au plus 3, et il faut gagner 14 : au moins 5 coups. Mais un coup de cavalier change la couleur de la case, et a1 et h8 sont de la même couleur : il faut un nombre pair de coups, donc au moins 6. Six coups suffisent : a1, b3, c5, d7, f8, g6, h8. Réponse : **6** (un parcours en largeur le confirme).",
   "indice": "Chaque coup change la somme des coordonnées de 1 ou 3 ; il faut la faire varier de 14.",
   "categorie": "recherche",
   "titre": "Le cavalier d'un coin à l'autre de l'échiquier",
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-rois-non-attaquants",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de rois au maximum peut-on placer sur un échiquier $8 \\times 8$ sans que deux d'entre eux s'attaquent ?",
   "solution": "Chacun des 16 blocs $2 \\times 2$ contient au plus un roi (deux rois dans un même bloc se touchent) : au plus 16. Et 16 est atteint (un roi dans le coin inférieur gauche de chaque bloc). **16**.",
   "indice": "Découpe l'échiquier en blocs $2 \\times 2$.",
   "categorie": "denombrement",
   "titre": "Placer un maximum de rois qui ne s'attaquent pas",
   "reponse": "16",
   "valeur": 16.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-p-pays-garcons",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Dans un pays, chaque famille fait des enfants jusqu'au premier garçon, puis s'arrête. Garçons et filles sont équiprobables. À long terme, quelle est la proportion de filles ?",
   "solution": "**Une moitié**. Chaque naissance est un tirage équitable indépendant : aucune règle d'arrêt ne change la proportion (théorème d'arrêt). Par famille : exactement 1 garçon, et en moyenne $\\sum_{k \\ge 0} k\\,2^{-(k+1)} = 1$ fille.",
   "indice": "Chaque naissance reste un pile ou face équitable, quelle que soit la règle d'arrêt.",
   "categorie": "probas",
   "titre": "Le pays où chaque famille s'arrête au premier garçon"
  },
  {
   "id": "ct-canard-renard",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Un canard nage au centre d'un étang circulaire de rayon $R$. Un renard, sur la rive, court 4 fois plus vite que le canard nage, et ne peut pas entrer dans l'eau. Le canard peut s'envoler dès qu'il atteint la rive sans le renard. Peut-il s'échapper ?",
   "solution": "Sur un cercle de rayon $r < R/4$, la vitesse angulaire du canard ($v/r$) dépasse celle du renard ($4v/R$) : le canard peut se placer à l'opposé du renard sur le cercle de rayon juste inférieur à $R/4$. Il fonce alors droit vers la rive : il lui reste $\\frac34 R$ à parcourir, soit un temps $\\frac{3R}{4v}$, tandis que le renard doit faire un demi-tour, $\\pi R$, en $\\frac{\\pi R}{4v}$. Comme $\\frac34 < \\frac{\\pi}{4}$, **le canard s'échappe**. (Avec une stratégie plus fine, il s'échappe jusqu'à un rapport de vitesses d'environ 4,6.)",
   "indice": "Près du centre, le canard tourne plus vite (en vitesse angulaire) que le renard. Jusqu'à quel rayon ?",
   "categorie": "geometrie",
   "titre": "Le canard sur l'étang et le renard sur la rive"
  },
  {
   "id": "ct-points-antipodaux",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Montre qu'à tout instant, il existe deux points diamétralement opposés de l'équateur qui ont exactement la même température.",
   "solution": "$g(\\theta) = T(\\theta) - T(\\theta + \\pi)$ est continue et $g(\\theta + \\pi) = -g(\\theta)$ : elle prend des valeurs de signes opposés (ou nulles), donc s'annule par le théorème des valeurs intermédiaires. En ce point, les températures sont égales.",
   "indice": "Considère $g(\\theta) = T(\\theta) - T(\\theta + \\pi)$ sur l'équateur.",
   "categorie": "geometrie",
   "titre": "Deux points opposés de l'équateur à la même température"
  },
  {
   "id": "ct-p-chuck-a-luck",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu paries 1 € sur un numéro de 1 à 6, puis on lance trois dés. Si ton numéro sort sur $k \\ge 1$ dés, tu gagnes $k$ € (et récupères ta mise) ; sinon tu perds ta mise. Quel est ton gain espéré par euro misé ?",
   "solution": "$\\mathbb{P}(0) = \\frac{125}{216}$, $\\mathbb{P}(1) = \\frac{75}{216}$, $\\mathbb{P}(2) = \\frac{15}{216}$, $\\mathbb{P}(3) = \\frac{1}{216}$.\n$$\\mathbb{E} = -\\frac{125}{216} + \\frac{75}{216} + 2 \\cdot \\frac{15}{216} + 3 \\cdot \\frac{1}{216} = -\\frac{17}{216} \\approx -0{,}079.$$\nRéponse : **$-17/216$**. L'illusion « $3 \\times 1/6 = 1/2$ » ignore que les gains multiples se concentrent sur peu d'issues.",
   "indice": "Le nombre de dés montrant ton numéro suit une loi binomiale $\\mathcal{B}(3, 1/6)$.",
   "categorie": "probas",
   "titre": "Chuck-a-luck : le jeu de trois dés de la fête foraine",
   "reponse": "-17/216",
   "valeur": -0.0787037037037037,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-infection-grille",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Dans une grille $10 \\times 10$, une case saine devient infectée dès qu'au moins deux de ses voisines (par un côté) sont infectées. Combien de cases faut-il infecter au départ, au minimum, pour que toute la grille finisse infectée ?",
   "solution": "Quand une case s'infecte, au moins deux de ses côtés touchaient déjà la zone infectée : le périmètre de la zone ne peut pas augmenter. À la fin, il vaut 40 ; au départ, $k$ cases ont un périmètre au plus $4k$. Donc $4k \\ge 40$, $k \\ge 10$ ; et la diagonale de 10 cases suffit. **10**.",
   "indice": "Suis le périmètre total de la zone infectée : peut-il augmenter ?",
   "categorie": "invariants",
   "titre": "Infection d'une grille $10 \\times 10$",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-nouilles",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Un bol contient 100 nouilles. On prend deux extrémités au hasard et on les noue, et on recommence jusqu'à ce qu'il ne reste plus d'extrémité libre. Combien de boucles obtient-on en moyenne ?",
   "solution": "Avec $k$ brins, il y a $2k$ extrémités ; on en prend une, et l'autre extrémité choisie est la sienne avec probabilité $\\frac{1}{2k - 1}$ : une boucle se ferme. Sinon deux brins fusionnent. Par linéarité :\n$$\\mathbb{E}[\\text{boucles}] = \\sum_{k=1}^{100} \\frac{1}{2k - 1} \\approx \\frac12 \\ln(4 \\times 100) + \\frac{\\gamma}{2} \\approx 3{,}28.$$\nRéponse : **$\\approx 3{,}28$**.",
   "indice": "Quand il reste $k$ nouilles (« brins » en comptant les nœuds), quelle est la probabilité que le nœud ferme une boucle ?",
   "categorie": "probas",
   "titre": "Nouer au hasard les extrémités de 100 nouilles",
   "reponse": "3.2843",
   "valeur": 3.2843,
   "tolerance": 0.001,
   "duree": 420
  },
  {
   "id": "ct-sous-marin",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Un sous-marin se déplace sur une droite graduée par les entiers : il part d'une position entière inconnue $a$ et avance chaque minute d'une vitesse entière inconnue $v$ (position $a + vt$ à la minute $t$). Chaque minute, tu peux tirer une torpille sur un entier. Existe-t-il une stratégie qui le touche à coup sûr en un temps fini ?",
   "solution": "Oui. Énumère tous les couples $(a, v) \\in \\mathbb{Z}^2$ (par exemple en spirale autour de $(0, 0)$). À la minute $t$, prends le $t$-ième couple $(a_t, v_t)$ et tire sur $a_t + v_t\\,t$. Le vrai couple apparaît à un rang $t_0$ fini, et la torpille tirée à la minute $t_0$ le touche. L'idée : transformer un problème « en mouvement » en une énumération d'un ensemble dénombrable.",
   "indice": "Les couples $(a, v)$ sont dénombrables.",
   "categorie": "recherche",
   "titre": "Attraper un sous-marin de position et de vitesse inconnues"
  },
  {
   "id": "ct-sommes-consecutives",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "De combien de façons peut-on écrire 1 000 comme somme d'un ou plusieurs entiers **positifs consécutifs** ?",
   "solution": "$2000 = k(2m + k - 1)$ avec $k < 2m + k - 1$ de parités opposées : chaque façon correspond à un **diviseur impair** de 1 000. $1\\,000 = 2^3 \\times 5^3$ a 4 diviseurs impairs (1, 5, 25, 125) : **4 façons** ($1\\,000$ ; $198 + \\dots + 202$ ; $28 + \\dots + 52$ ; $55 + \\dots + 70$).",
   "indice": "Une somme de $k$ consécutifs à partir de $m$ vaut $k(2m + k - 1)/2$. Les deux facteurs $k$ et $2m + k - 1$ sont de parités différentes.",
   "categorie": "nombres",
   "titre": "Écrire 1 000 comme somme d'entiers consécutifs",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-poteaux-croises",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux poteaux verticaux de 6 m et 3 m sont plantés à une certaine distance l'un de l'autre. On tend un câble du sommet de chacun au pied de l'autre. À quelle hauteur (en mètres) les câbles se croisent-ils ?",
   "solution": "Avec des hauteurs $a$ et $b$, les triangles semblables donnent $\\frac{1}{h} = \\frac1a + \\frac1b$ : $h = \\frac{ab}{a + b} = \\frac{18}{9} =$ **2 m**, indépendamment de l'écartement (moitié de la moyenne harmonique).",
   "indice": "La réponse ne dépend pas de la distance entre les poteaux. Triangles semblables.",
   "categorie": "geometrie",
   "titre": "Deux poteaux reliés par des câbles croisés",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-hotel-hilbert",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Un hôtel a une infinité de chambres numérotées 1, 2, 3, …, toutes occupées. Un nouveau client arrive : peut-on le loger ? Et si un car d'une infinité (dénombrable) de clients arrive ?",
   "solution": "- Un client : chaque occupant passe de la chambre $n$ à $n + 1$ ; la chambre 1 se libère.\n- Une infinité dénombrable : chaque occupant passe de $n$ à $2n$ ; les chambres impaires se libèrent pour les nouveaux.\nLeçon : un ensemble infini peut être en bijection avec une partie stricte de lui-même ; $\\mathbb{N}$, $\\mathbb{Z}$ et $\\mathbb{Q}$ ont « autant » d'éléments, mais pas $\\mathbb{R}$ (argument diagonal de Cantor).",
   "indice": "Déplace chaque client existant selon une règle simple.",
   "categorie": "logique",
   "titre": "L'hôtel de Hilbert (un hôtel infini complet)"
  },
  {
   "id": "ct-hauteur-chute",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu lâches une pierre du toit d'un immeuble et l'entends toucher le sol 3 secondes plus tard. Estime la hauteur (en mètres), en négligeant le temps de trajet du son et les frottements.",
   "solution": "$h = \\frac12 \\times 9{,}8 \\times 3^2 \\approx$ **44 m**. Correction du son ($\\sim 0{,}13$ s pour 44 m à 340 m/s) : la vraie chute dure $\\sim 2{,}87$ s, soit $\\sim 40$ m. Dire quelle hypothèse on néglige et dans quel sens elle biaise.",
   "indice": "Chute libre : $h = \\frac12 g t^2$ avec $g \\approx 9{,}8$ m/s$^2$.",
   "categorie": "mouvement",
   "titre": "Mesurer la hauteur d'un immeuble avec un chronomètre",
   "reponse": "44",
   "valeur": 44.0,
   "tolerance": 0.03,
   "duree": 120
  },
  {
   "id": "ct-p-pistolets",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Dix personnes ont chacune un pistolet à eau. Au signal, chacune vise une des neuf autres au hasard et la touche. Combien de personnes en moyenne restent sèches ?",
   "solution": "Une personne donnée reste sèche si chacune des 9 autres vise ailleurs : $(8/9)^9$. Par linéarité : $10\\,(8/9)^9 \\approx$ **3,46** personnes.",
   "indice": "Linéarité de l'espérance : probabilité qu'une personne donnée ne soit visée par aucune des 9 autres.",
   "categorie": "probas",
   "titre": "Dix personnes tirent chacune sur une autre au hasard",
   "reponse": "10*(8/9)^9",
   "valeur": 3.464394161146184,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-ecart-deux-des",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés. Quelle est l'espérance de la valeur absolue de leur différence ?",
   "solution": "Nombre de couples d'écart $d \\ge 1$ : $2(6 - d)$. $\\mathbb{E}|X - Y| = \\frac{1}{36}\\sum_{d=1}^{5} d \\cdot 2(6 - d) = \\frac{2(5 + 8 + 9 + 8 + 5)}{36} = \\frac{70}{36} =$ **35/18** $\\approx 1{,}94$.",
   "indice": "Compte les couples par écart : 6 couples d'écart 0, 10 d'écart 1, …",
   "categorie": "probas",
   "titre": "Écart moyen entre deux dés",
   "reponse": "35/18",
   "valeur": 1.9444444444444444,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-p-distance-bord-carre",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On choisit un point uniformément dans le carré unité. Quelle est l'espérance de sa distance au côté le plus proche ?",
   "solution": "$\\mathbb{P}(D > t) = (1 - 2t)^2$ pour $t \\le 1/2$. $\\mathbb{E}[D] = \\int_0^{1/2} (1 - 2t)^2\\,dt = \\frac{1}{6}$. Réponse : **1/6**.",
   "indice": "La distance au bord le plus proche dépasse $t$ si le point est dans le carré central de côté $1 - 2t$.",
   "categorie": "probas",
   "titre": "Distance moyenne au bord le plus proche dans un carré",
   "reponse": "1/6",
   "valeur": 0.16666666666666666,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-couleurs-main",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On reçoit 13 cartes d'un jeu de 52. Combien de couleurs différentes (pique, cœur, carreau, trèfle) contient la main en moyenne ?",
   "solution": "Une couleur est absente avec probabilité $\\binom{39}{13} / \\binom{52}{13} \\approx 0{,}0128$. Par linéarité : $4\\left(1 - \\frac{\\binom{39}{13}}{\\binom{52}{13}}\\right) \\approx$ **3,95**.",
   "indice": "Indicatrices : probabilité qu'une couleur donnée soit absente.",
   "categorie": "probas",
   "titre": "Nombre moyen de couleurs dans une main de 13 cartes",
   "reponse": "4*(1-comb(39,13)/comb(52,13))",
   "valeur": 3.9488362078496944,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-total-sept",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance un dé en additionnant les résultats jusqu'à ce que le total atteigne au moins 7. Combien de lancers en moyenne ?",
   "solution": "Pour $1 \\le n \\le 6$, $e(n) = (7/6)^{n-1}$ ; puis $e(7) = 1 + \\frac16 \\sum_{k=1}^{6} e(7 - k) = 1 + \\frac16 \\sum_{j=0}^{5} (7/6)^j = (7/6)^6 = \\frac{117649}{46656} \\approx$ **2,52**.",
   "indice": "$e(n) = 1 + \\frac16 \\sum_{k=1}^{6} e(n - k)$, avec $e(m) = 0$ pour $m \\le 0$. Les premiers termes ont une forme simple.",
   "categorie": "probas",
   "titre": "Lancer un dé jusqu'à ce que le total atteigne 7",
   "reponse": "117649/46656",
   "valeur": 2.5216263717421126,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-partage-secret",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu veux répartir un code secret (un nombre) entre 5 personnes de sorte que 3 d'entre elles réunies le retrouvent, mais que 2 n'en apprennent **rien**. Comment ?",
   "solution": "Schéma de Shamir : choisis un polynôme aléatoire $P(x) = s + a_1 x + a_2 x^2$ (coefficients aléatoires modulo un grand nombre premier $p$), où $s$ est le secret. Donne à la personne $i$ le point $(i, P(i))$. Trois points déterminent $P$, donc $s = P(0)$ (interpolation de Lagrange). Avec deux points, toutes les valeurs de $s$ restent également possibles : aucune information.",
   "indice": "Deux points déterminent une droite, trois points une parabole.",
   "categorie": "logique",
   "titre": "Partager un code entre 5 personnes, 3 suffisent"
  },
  {
   "id": "ct-carres-echiquier",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de carrés (de toutes tailles) contient un échiquier de $8 \\times 8$ ?",
   "solution": "Un carré de côté $k$ peut se placer de $(9 - k)^2$ façons :\n$$\\sum_{k=1}^{8} k^2 = \\frac{8 \\times 9 \\times 17}{6} = 204.$$\nRéponse : **204**.",
   "en": "How many squares of all sizes are there on an $8 \\times 8$ chessboard?",
   "indice": "Un carré de côté $k$ : combien de positions possibles pour son coin supérieur gauche ?",
   "categorie": "denombrement",
   "titre": "Carrés et rectangles d'un échiquier",
   "reponse": "204",
   "valeur": 204.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-poignees",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "20 personnes se serrent toutes la main deux à deux une fois. Combien de poignées de main ?",
   "solution": "$\\binom{20}{2} = \\frac{20 \\times 19}{2} =$ **190**.",
   "en": "20 people each shake hands once with everyone else. How many handshakes?",
   "indice": "Une poignée de main = une paire de personnes.",
   "categorie": "denombrement",
   "titre": "Poignées de main entre 20 personnes",
   "reponse": "190",
   "valeur": 190.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "ct-chiffre-un",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de fois écrit-on le chiffre 1 en écrivant tous les nombres de 1 à 100 ?",
   "solution": "Unités : 1, 11, 21, …, 91 → 10. Dizaines : 10 à 19 → 10. Centaines : 100 → 1. Total **21**.",
   "en": "How many times do you write the digit 1 when writing all numbers from 1 to 100?",
   "indice": "Compte séparément les unités, les dizaines et les centaines.",
   "categorie": "denombrement",
   "titre": "Combien de chiffres 1 en écrivant 1 à 100 ?",
   "reponse": "21",
   "valeur": 21.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-anagrammes",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien d'arrangements distincts des lettres du mot MISSISSIPPI ?",
   "solution": "$$\\frac{11!}{4!\\,4!\\,2!} = 34\\,650.$$\nOn divise par les permutations des lettres identiques, qui ne créent pas de mot nouveau.",
   "indice": "11 lettres, dont des répétitions : M une fois, I quatre fois, S quatre fois, P deux fois.",
   "categorie": "denombrement",
   "titre": "Anagrammes de MISSISSIPPI",
   "reponse": "34650",
   "valeur": 34650.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-dominos-escalier",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "De combien de façons peut-on paver un rectangle de $2 \\times 10$ avec des dominos $1 \\times 2$ ?",
   "solution": "Soit $a_n$ le nombre de pavages de $2 \\times n$. La première colonne est couverte soit par un domino vertical (reste $2 \\times (n - 1)$), soit par deux horizontaux (reste $2 \\times (n - 2)$) : $a_n = a_{n-1} + a_{n-2}$, avec $a_1 = 1$, $a_2 = 2$. Suite de Fibonacci : $1, 2, 3, 5, 8, 13, 21, 34, 55, 89$ : **89**.",
   "indice": "Regarde la colonne de gauche : un domino vertical, ou deux horizontaux empilés.",
   "categorie": "denombrement",
   "titre": "Paver une bande $2 \\times 10$ avec des dominos",
   "reponse": "89",
   "valeur": 89.0,
   "tolerance": 0.005,
   "duree": 180,
   "voir": [
    "algo-escalier"
   ]
  },
  {
   "id": "ct-regions-cercle",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On place 6 points sur un cercle et on trace toutes les cordes qui les relient (sans que trois cordes soient concourantes à l'intérieur). En combien de régions le disque est-il découpé ?",
   "solution": "Formule d'Euler, ou ajout des cordes une à une : chaque corde ajoute 1 région plus 1 par croisement. Régions $= 1 + \\binom{n}{2} + \\binom{n}{4}$. Pour $n = 6$ : $1 + 15 + 15 =$ **31**, et non 32.\nLe piège est classique : 1, 2, 4, 8, 16, **31** pour $n = 1$ à 6.",
   "indice": "Les premiers termes 1, 2, 4, 8, 16 trompent. Compte les points d'intersection : chacun correspond à un choix de 4 points.",
   "categorie": "denombrement",
   "titre": "Régions d'un disque coupé par les cordes de 6 points",
   "reponse": "31",
   "valeur": 31.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-triangles-entiers",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de triangles non dégénérés, à côtés entiers, ont un périmètre de 12 (à l'ordre des côtés près) ?",
   "solution": "$a \\le b \\le c$, $a + b > c$ et $a + b + c = 12$ donnent $c < 6$, donc $c \\in \\{4, 5\\}$. Pour $c = 5$ : $(2, 5, 5)$, $(3, 4, 5)$. Pour $c = 4$ : $(4, 4, 4)$. **3 triangles**.",
   "indice": "Avec $a \\le b \\le c$ et $a + b + c = 12$, l'inégalité triangulaire impose $c < 6$.",
   "categorie": "denombrement",
   "titre": "Triangles à côtés entiers de périmètre 12",
   "reponse": "3",
   "valeur": 3.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-chiffres-impairs",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien d'entiers positifs inférieurs à 1 000 ne s'écrivent qu'avec des chiffres impairs ?",
   "solution": "5 choix par chiffre : $5 + 5^2 + 5^3 = 5 + 25 + 125 =$ **155**.",
   "indice": "Sépare selon le nombre de chiffres.",
   "categorie": "denombrement",
   "titre": "Entiers sous 1 000 aux chiffres tous impairs",
   "reponse": "155",
   "valeur": 155.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-monnaie",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "De combien de façons peut-on former 1 € avec des pièces de 50, 20 et 10 centimes (l'ordre ne compte pas) ?",
   "solution": "$a = 0$ : $b \\in \\{0, \\dots, 5\\}$, 6 façons ; $a = 1$ : $b \\in \\{0, 1, 2\\}$, 3 façons ; $a = 2$ : 1 façon. Total **10**.\nEn général : programmation dynamique sur le montant (le grand classique « coin change »).",
   "indice": "En dizaines de centimes : $5a + 2b + c = 10$. Fixe $a$, puis $b$.",
   "categorie": "denombrement",
   "titre": "Faire 1 € avec des pièces de 50, 20 et 10 centimes",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-etoiles-barres",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de triplets d'entiers $x, y, z \\ge 0$ vérifient $x + y + z = 10$ ?",
   "solution": "On place 2 barres parmi $10 + 2 = 12$ positions : $\\binom{12}{2} =$ **66**.",
   "indice": "Dix étoiles et deux barres de séparation.",
   "categorie": "denombrement",
   "titre": "Solutions entières de x + y + z = 10",
   "reponse": "66",
   "valeur": 66.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-bracelets",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Combien de bracelets différents peut-on faire avec 6 perles, chacune noire ou blanche, deux bracelets étant identiques s'ils se déduisent par rotation ou retournement ?",
   "solution": "Groupe diédral à 12 éléments. Rotations de 0, 1, 2, 3, 4, 5 crans : $2^6, 2, 2^2, 2^3, 2^2, 2$ coloriages fixes, total 84. Retournements : 3 axes passant par deux perles ($2^4$ chacun) et 3 axes entre les perles ($2^3$ chacun) : $48 + 24 = 72$. Burnside : $(84 + 72)/12 =$ **13**.",
   "indice": "Lemme de Burnside : moyenne, sur toutes les symétries, du nombre de coloriages qu'elles laissent fixes.",
   "categorie": "denombrement",
   "titre": "Bracelets de 6 perles noires ou blanches",
   "reponse": "13",
   "valeur": 13.0,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-cube-peint",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un cube $3 \\times 3 \\times 3$ est peint en rouge à l'extérieur, puis découpé en 27 petits cubes. Combien de petits cubes ont exactement deux faces peintes ?",
   "solution": "Coins : 8 cubes à 3 faces ; milieux d'arêtes : **12** cubes à 2 faces ; centres de faces : 6 cubes à 1 face ; centre : 1 cube sans peinture ($8 + 12 + 6 + 1 = 27$).",
   "indice": "Coins, arêtes, centres des faces, centre du cube.",
   "categorie": "denombrement",
   "titre": "Cube $3 \\times 3 \\times 3$ peint puis découpé",
   "reponse": "12",
   "valeur": 12.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-fermi-pianos",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Combien y a-t-il d'accordeurs de pianos à Paris ? (Question d'estimation : raisonne à voix haute.)",
   "solution": "Ce qui compte est la décomposition et la cohérence, pas le chiffre. Un exemple :\n- Paris intra-muros : $\\sim 2$ millions d'habitants, $\\sim 1$ million de foyers.\n- Foyers avec un piano : $\\sim 3\\,\\%$, soit 30 000 pianos ; plus écoles, conservatoires, salles : disons 40 000.\n- Accord : en moyenne une fois par an.\n- Un accordeur : $\\sim 3$ accords par jour, $\\sim 220$ jours par an, soit $\\sim 650$ accords par an.\n- Besoin : $40\\,000 / 650 \\approx$ **60 accordeurs** (quelques dizaines à une centaine).\nMéthode : annoncer la structure, arrondir franchement, vérifier par une seconde approche, donner une fourchette et dire quelle hypothèse est la plus incertaine.",
   "en": "How many piano tuners are there in Paris? (Estimation question: reason aloud.)",
   "indice": "Nombre de pianos $\\times$ fréquence d'accord, divisé par le nombre d'accords qu'un accordeur fait par an.",
   "categorie": "fermi",
   "titre": "Accordeurs de pianos à Paris"
  },
  {
   "id": "ct-fermi-stations",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Combien y a-t-il de stations-service en France ? Raisonne à voix haute.",
   "solution": "Approche par la demande :\n- $\\sim 40$ millions de voitures, $\\sim 13\\,000$ km par an, 6 L aux 100 km : $\\sim 800$ L par voiture et par an, soit $\\sim 32$ milliards de litres (plus utilitaires et poids lourds : disons 45 milliards).\n- Une station vend $\\sim 3$ à 5 millions de litres par an.\n- $45 \\times 10^9 / (4 \\times 10^6) \\approx$ **11 000 stations**.\nContrôle par l'offre : $\\sim 35\\,000$ communes, une station pour 3 à 4 communes : $\\sim 10\\,000$. Cohérent.\nDire quelle hypothèse est la plus fragile (volume par station) et comment l'affiner.",
   "en": "How many gas stations are there in France? Reason aloud.",
   "indice": "Pars de la consommation totale de carburant, puis du volume vendu par une station.",
   "categorie": "fermi",
   "titre": "Stations-service en France"
  },
  {
   "id": "ct-fermi-balles-avion",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Combien de balles de tennis peut-on mettre dans un Boeing 747 vide ? Raisonne à voix haute.",
   "solution": "- Cabine : $\\sim 60$ m de long, section utile $\\sim 6 \\times 4$ m, soit $\\sim 1\\,500$ m³ ; avec les soutes, disons $\\sim 1\\,800$ m³ ($1{,}8 \\times 10^9$ cm³).\n- Balle : diamètre $\\sim 6{,}7$ cm, volume $\\frac{4}{3}\\pi r^3 \\approx 160$ cm³. Un empilement en vrac remplit $\\sim 64\\,\\%$ de l'espace : $\\sim 250$ cm³ d'espace par balle.\n- $1{,}8 \\times 10^9 / 250 \\approx$ **7 millions de balles** (fourchette 3 à 15 millions).\nPoints notés : dimensions annoncées, prise en compte du taux de remplissage, ordre de grandeur final.",
   "indice": "Volume utile de l'avion, divisé par le volume d'une balle, corrigé par la compacité de l'empilement.",
   "categorie": "fermi",
   "titre": "Balles de tennis dans un avion de ligne"
  },
  {
   "id": "ct-fermi-avions-en-vol",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Combien d'avions commerciaux sont en vol dans le monde à un instant donné, en moyenne ?",
   "solution": "- $\\sim 100\\,000$ vols commerciaux par jour dans le monde (environ 4,5 milliards de passagers par an, $\\sim 120$ passagers par vol : $3{,}7 \\times 10^7$ vols par an).\n- Durée moyenne : $\\sim 2$ heures.\n- En moyenne : $100\\,000 \\times 2 / 24 \\approx$ **8 000 à 10 000 avions** en vol (davantage en journée européenne et américaine).\nFormule de Little : $\\text{nombre moyen dans le système} = \\text{débit} \\times \\text{durée de séjour}$.",
   "indice": "Nombre de vols par jour $\\times$ durée moyenne d'un vol $/$ 24 h.",
   "categorie": "fermi",
   "titre": "Combien d'avions de ligne en vol en ce moment ?"
  },
  {
   "id": "ct-fermi-cafe",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Combien de cafés sont vendus chaque jour dans les cafés, bars et restaurants de Paris ?",
   "solution": "- Demande : 2 millions d'habitants, plus $\\sim 1$ million de travailleurs venant de banlieue et $\\sim 0{,}5$ million de touristes. Un adulte sur trois achète en moyenne 1 à 2 cafés hors de chez lui par jour : $\\sim 1{,}5$ million de cafés.\n- Offre : $\\sim 15\\,000$ cafés, bars et restaurants, $\\sim 100$ cafés vendus par jour chacun : $1{,}5$ million.\nOrdre de grandeur : **1 à 2 millions de cafés par jour**, les deux méthodes concordent.",
   "indice": "Par la demande (habitants, travailleurs, touristes) et par l'offre (établissements $\\times$ cafés par jour).",
   "categorie": "fermi",
   "titre": "Cafés vendus à Paris chaque jour"
  },
  {
   "id": "ct-fermi-cheveux",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Combien de cheveux a-t-on sur la tête ? En déduire : y a-t-il forcément deux Parisiens qui ont exactement le même nombre de cheveux ?",
   "solution": "- Cuir chevelu : $\\sim 600$ cm² ; densité $\\sim 200$ cheveux par cm² : $\\sim$ **100 000 à 150 000 cheveux**.\n- Personne n'a plus de 500 000 cheveux, et Paris compte 2 millions d'habitants : par le **principe des tiroirs**, au moins deux Parisiens (en fait au moins 4) ont exactement le même nombre de cheveux.",
   "indice": "Surface du cuir chevelu $\\times$ densité. Puis compare le nombre de Parisiens au nombre maximal de cheveux.",
   "categorie": "fermi",
   "titre": "Combien de cheveux sur une tête ? (et le principe des tiroirs)"
  },
  {
   "id": "ct-fourmi-cube",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une fourmi marche à la surface d'un cube d'arête 1, d'un sommet au sommet opposé. Quelle est la longueur du plus court chemin ?",
   "solution": "En dépliant deux faces adjacentes, on obtient un rectangle $1 \\times 2$ dont le trajet est la diagonale : $\\sqrt{1^2 + 2^2} = \\sqrt 5 \\approx$ **2,236**. (À travers le cube, ce serait $\\sqrt 3$, et en longeant les arêtes, 3.)",
   "indice": "Déplie deux faces adjacentes à plat.",
   "categorie": "geometrie",
   "titre": "Plus court chemin d'une fourmi sur un cube",
   "reponse": "sqrt(5)",
   "valeur": 2.23606797749979,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-corde-terre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une corde fait le tour de la Terre au ras du sol à l'équateur. On la rallonge d'un mètre et on la soulève uniformément. À quelle hauteur (en mètres) flotte-t-elle ?",
   "solution": "$h = \\frac{1}{2\\pi} \\approx$ **0,16 m**, indépendamment du rayon : on passerait un chat dessous, que ce soit autour de la Terre ou d'une orange.",
   "indice": "$2\\pi(R + h) = 2\\pi R + 1$.",
   "categorie": "geometrie",
   "titre": "Une corde autour de la Terre, rallongée d'un mètre",
   "reponse": "1/(2*pi)",
   "valeur": 0.15915494309189535,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-piece-roule",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une pièce roule sans glisser autour d'une pièce identique fixe, jusqu'à revenir à sa position de départ. Combien de tours fait-elle sur elle-même ?",
   "solution": "Le centre parcourt un cercle de rayon $2r$, soit $4\\pi r$ ; la rotation propre vaut cette distance divisée par $r$, soit $4\\pi$ : **2 tours**. Intuitivement : un tour dû au roulement, plus un tour dû au fait de contourner le cercle.",
   "indice": "Le centre de la pièce mobile décrit un cercle de rayon $2r$.",
   "categorie": "geometrie",
   "titre": "Une pièce qui roule autour d'une pièce identique",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-anneau-serviette",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On perce un trou cylindrique traversant une sphère, passant par son centre. L'anneau restant a une hauteur de 6 cm. Quel est son volume (en cm³) ? On ne donne pas le rayon de la sphère.",
   "solution": "Si le volume ne dépend pas du rayon, prends le cas limite d'un trou de diamètre nul : la sphère elle-même, de diamètre 6, soit $\\frac43\\pi \\times 3^3 = 36\\pi \\approx$ **113,1 cm³**. Le calcul par tranches confirme : chaque section horizontale est un anneau d'aire $\\pi(h^2/4 - z^2)$, indépendante de $R$.",
   "indice": "Si la réponse ne dépend pas du rayon, prends un trou de rayon nul.",
   "categorie": "geometrie",
   "titre": "Le volume restant d'une sphère percée",
   "reponse": "36*pi",
   "valeur": 113.09733552923255,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-pole-nord",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Un explorateur marche 1 km vers le sud, 1 km vers l'est, puis 1 km vers le nord, et se retrouve à son point de départ. Où peut-il être ?",
   "solution": "- Au **pôle Nord**.\n- Ou à environ 1 km au nord d'un cercle de latitude de circonférence $1/n$ km ($n \\ge 1$) autour du pôle Sud : la marche vers l'est fait exactement $n$ tours de ce cercle. Une infinité de cercles de départ.",
   "indice": "Le pôle Nord est une réponse. Il y en a une infinité d'autres près du pôle Sud.",
   "categorie": "geometrie",
   "titre": "Sud, est, nord : revenir à son point de départ"
  },
  {
   "id": "ct-somme-angles",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quelle est la somme des angles intérieurs d'un hexagone convexe (en degrés) ?",
   "solution": "On le découpe en 4 triangles depuis un sommet : $4 \\times 180 =$ **720°** ; en général $(n - 2) \\times 180°$.",
   "indice": "Découpe-le en triangles depuis un sommet.",
   "categorie": "geometrie",
   "titre": "Somme des angles d'un hexagone",
   "reponse": "720",
   "valeur": 720.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "ct-angle-horloge",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel angle (en degrés) forment les aiguilles d'une horloge à 3 h 15 ?",
   "solution": "L'aiguille des minutes est sur 3 (90°). Celle des heures a avancé d'un quart d'heure au-delà de 3 : $90° + 15 \\times 0{,}5° = 97{,}5°$. Angle : **7,5°**.",
   "en": "What is the angle (in degrees) between the clock hands at 3:15?",
   "indice": "L'aiguille des heures avance de 0,5° par minute.",
   "categorie": "mouvement",
   "titre": "Angle des aiguilles à 3 h 15",
   "reponse": "7.5",
   "valeur": 7.5,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-superpositions",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de fois par jour (24 heures) les aiguilles des heures et des minutes se superposent-elles ?",
   "solution": "L'aiguille des minutes rattrape celle des heures une fois par tour de retard : $24 - 2 =$ **22** fois (toutes les $12/11$ heures).",
   "indice": "L'aiguille des minutes fait 24 tours, celle des heures 2.",
   "categorie": "mouvement",
   "titre": "Combien de fois les aiguilles se superposent-elles en un jour ?",
   "reponse": "22",
   "valeur": 22.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-vitesse-moyenne",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une voiture fait l'aller à 30 km/h et le retour, même distance, à 60 km/h. Quelle est sa vitesse moyenne sur l'aller-retour (en km/h) ?",
   "solution": "Pour une distance $d$ : temps $d/30 + d/60 = d/20$, distance $2d$ : $40$ km/h (moyenne harmonique $\\frac{2}{1/30 + 1/60}$). **40 km/h**.",
   "indice": "Ce n'est pas 45 : la voiture passe plus de temps à 30 km/h.",
   "categorie": "mouvement",
   "titre": "Aller à 30 km/h, retour à 60 km/h : vitesse moyenne",
   "reponse": "40",
   "valeur": 40.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-escargot",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un escargot au fond d'un puits de 30 m monte de 3 m le jour et glisse de 2 m la nuit. Quel jour sort-il du puits ?",
   "solution": "Après $n$ jours et nuits, il est à $n$ mètres. Il sort pendant la journée où il atteint 30 : il doit partir d'au moins 27 m, atteint au matin du 28ᵉ jour. **Jour 28**.",
   "indice": "Le dernier jour, il ne glisse pas.",
   "categorie": "mouvement",
   "titre": "L'escargot dans un puits de 30 mètres",
   "reponse": "28",
   "valeur": 28.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-nenuphars",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une tache de nénuphars double de surface chaque jour et couvre tout l'étang le 48ᵉ jour. Quel jour couvrait-elle la moitié de l'étang ?",
   "solution": "La veille : **jour 47**.",
   "indice": "Pense à rebours.",
   "categorie": "mouvement",
   "titre": "Des nénuphars qui doublent chaque jour",
   "reponse": "47",
   "valeur": 47.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "ct-chapeau-riviere",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un rameur remonte une rivière ; son chapeau tombe à l'eau. Il s'en aperçoit 10 minutes plus tard, fait demi-tour et rame à la même vitesse par rapport à l'eau. Combien de minutes lui faut-il pour rattraper le chapeau ?",
   "solution": "Dans le référentiel de l'eau, le chapeau est immobile et le rameur s'en éloigne 10 minutes puis revient à la même vitesse : **10 minutes**, quelle que soit la vitesse du courant.",
   "indice": "Place-toi dans le référentiel de l'eau.",
   "categorie": "mouvement",
   "titre": "Le rameur qui perd son chapeau dans la rivière",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-course-handicap",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "A bat B de 10 m sur un 100 m. Pour la revanche, A part 10 m derrière la ligne de départ. Qui gagne, à vitesses inchangées ?",
   "solution": "Quand A a couru 100 m, B en a couru 90 : ils sont côte à côte à 10 m de l'arrivée. A, plus rapide, finit devant : **A gagne**.",
   "indice": "Où sont-ils quand A a couru 100 m ?",
   "categorie": "mouvement",
   "titre": "Course de 100 m avec handicap de 10 m"
  },
  {
   "id": "ct-jour-semaine",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Le 25 novembre 2026 est un mercredi. Quel jour de la semaine sera le 1ᵉʳ janvier 2078 ?",
   "solution": "Du 25 novembre au 1ᵉʳ janvier 2027 : 37 jours, soit $37 \\equiv 2 \\pmod 7$ : un **vendredi**. De 2027 à 2078 : 51 années, dont 13 bissextiles (2028 à 2076) : décalage $51 + 13 = 64 \\equiv 1 \\pmod 7$. Le 1ᵉʳ janvier 2078 est un **samedi**.",
   "indice": "Une année décale le jour de la semaine de 1, une année bissextile de 2. Commence par le 1ᵉʳ janvier 2027.",
   "categorie": "mouvement",
   "titre": "Quel jour de la semaine tombe le 1er janvier 2078 ?"
  },
  {
   "id": "ct-train-mouche",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux trains distants de 100 km roulent l'un vers l'autre à 50 km/h chacun. Une mouche fait des allers-retours entre eux à 75 km/h jusqu'à ce qu'ils se rencontrent. Quelle distance parcourt-elle ?",
   "solution": "Les trains se rencontrent après 1 heure ; la mouche vole pendant 1 heure : **75 km**. Inutile de sommer la série infinie des allers-retours (anecdote attribuée à von Neumann, qui… a sommé la série de tête).",
   "en": "Two trains 100 km apart approach each other at 50 km/h each. A fly shuttles between them at 75 km/h until they meet. How far does the fly travel?",
   "indice": "Combien de temps vole-t-elle ?",
   "categorie": "mouvement",
   "titre": "La mouche entre deux trains",
   "reponse": "75",
   "valeur": 75.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-echiquier-dominos",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "On retire deux coins opposés d'un échiquier $8 \\times 8$. Peut-on paver les 62 cases restantes avec 31 dominos $2 \\times 1$ ?",
   "solution": "**Non**. Les deux coins opposés sont de la même couleur : il reste 32 cases d'une couleur et 30 de l'autre, alors que 31 dominos couvrent 31 cases de chaque couleur.",
   "indice": "Chaque domino couvre une case blanche et une case noire. De quelle couleur sont les deux coins retirés ?",
   "categorie": "invariants",
   "titre": "Échiquier privé de deux coins opposés et dominos"
  },
  {
   "id": "ct-cameleons",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Sur une île vivent 13 caméléons gris, 15 bruns et 17 pourpres. Quand deux caméléons de couleurs différentes se rencontrent, tous deux prennent la troisième couleur. Peuvent-ils un jour être tous de la même couleur ?",
   "solution": "Une rencontre change les effectifs $(g, b, p)$ en $(g - 1, b - 1, p + 2)$ (ou permutations) : chaque différence varie de 0 ou de $\\pm 3$. Les différences **modulo 3** sont invariantes. Au départ : $b - g = 2$, $p - b = 2$, $p - g = 4 \\equiv 1$. Tous de la même couleur exigerait deux effectifs nuls, donc une différence $\\equiv 0$ : aucune n'est multiple de 3. **Impossible**.",
   "indice": "Regarde les différences des effectifs deux à deux, modulo 3.",
   "categorie": "invariants",
   "titre": "Caméléons de trois couleurs"
  },
  {
   "id": "ct-poignees-impaires",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "À une soirée, certaines personnes se serrent la main. Montre que le nombre de personnes ayant serré un nombre **impair** de mains est pair.",
   "solution": "La somme des nombres de mains serrées vaut deux fois le nombre de poignées de main (chacune compte pour deux personnes) : elle est paire. Une somme d'entiers est paire si et seulement si elle contient un nombre pair de termes impairs. C'est le lemme des poignées de main de la théorie des graphes.",
   "indice": "Additionne le nombre de mains serrées par chacun.",
   "categorie": "invariants",
   "titre": "Ceux qui ont serré un nombre impair de mains"
  },
  {
   "id": "ct-tableau-effacer",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Les nombres 1, 2, …, 10 sont écrits au tableau. À chaque étape, on efface deux nombres $a$ et $b$ et on écrit $|a - b|$. À la fin, il reste un seul nombre : peut-il valoir 0 ?",
   "solution": "$a + b$ et $|a - b|$ ont la même parité : la parité de la somme est invariante. Au départ, $1 + \\dots + 10 = 55$ est impair ; le dernier nombre est donc impair : **jamais 0**.",
   "indice": "Que devient la parité de la somme des nombres au tableau ?",
   "categorie": "invariants",
   "titre": "Effacer deux nombres et écrire leur différence"
  },
  {
   "id": "ct-puzzle-15",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Au taquin (15 pièces numérotées dans un carré $4 \\times 4$ avec une case vide), on échange les pièces 14 et 15 à la main. Peut-on revenir à l'ordre normal en faisant glisser les pièces ?",
   "solution": "Considère la permutation des 16 cases (case vide comprise) : chaque glissement est une transposition et change sa parité ; il déplace aussi la case vide d'une case, ce qui change la couleur (damier) de sa position. La quantité « parité de la permutation + couleur de la case vide » est donc invariante. Échanger 14 et 15 change la parité sans bouger la case vide : **impossible** (Sam Loyd offrait 1 000 \\$ pour une solution).",
   "indice": "Chaque glissement est une transposition avec la case vide. Que font la parité de la permutation et la position de la case vide ?",
   "categorie": "invariants",
   "titre": "Le taquin dont on a échangé deux pièces"
  },
  {
   "id": "ct-recouvrement-pieces",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Neuf pièces en carré $3 \\times 3$, toutes côté pile sauf celle du centre, côté face. Une opération retourne les trois pièces d'une ligne ou d'une colonne. Peut-on obtenir toutes les pièces côté pile ?",
   "solution": "Regarde la parité du nombre de faces parmi les cases $\\{(1,1), (1,2), (2,1), (2,2)\\}$ (un carré $2 \\times 2$). Toute ligne ou colonne en contient 0 ou 2 : l'opération ne change pas la parité. Au départ, une seule face (le centre) : impair. À l'arrivée : 0, pair. **Impossible**.",
   "indice": "Regarde la parité du nombre de faces dans un sous-ensemble bien choisi de pièces.",
   "categorie": "invariants",
   "titre": "Retourner trois pièces à la fois"
  },
  {
   "id": "ct-fourmis",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "100 fourmis sont posées au hasard sur un bâton d'un mètre, chacune orientée au hasard vers la gauche ou la droite. Elles avancent à 1 cm/s ; quand deux fourmis se rencontrent, elles font demi-tour ; une fourmi qui atteint un bout tombe. Au pire, combien de secondes avant que toutes soient tombées ?",
   "solution": "Deux fourmis qui se croisent et font demi-tour se comportent exactement comme si elles se traversaient (on échange juste leurs noms). Chaque « trajectoire » parcourt au plus 100 cm : **100 secondes** au pire.\nSur un cercle, la même astuce montre qu'au bout d'un tour complet les positions occupées sont les mêmes, à une rotation des noms près.",
   "en": "100 ants are placed randomly on a 1 m stick, each facing left or right at random, moving at 1 cm/s. When two ants meet they both turn around; ants fall off at the ends. In the worst case, how many seconds until all have fallen?",
   "indice": "Si l'on ne regarde pas les noms des fourmis, qu'est-ce qui change quand deux fourmis font demi-tour ?",
   "categorie": "invariants",
   "titre": "100 fourmis sur un bâton qui font demi-tour",
   "reponse": "100",
   "valeur": 100.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-interrupteurs",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois interrupteurs au rez-de-chaussée commandent une ampoule au grenier, que tu ne peux voir qu'en montant. Tu ne montes qu'une fois. Comment savoir quel interrupteur commande l'ampoule ?",
   "solution": "Allume le 1 pendant quelques minutes, éteins-le, allume le 2, monte. Ampoule allumée : interrupteur 2. Éteinte mais chaude : 1. Éteinte et froide : 3.\nL'astuce est d'utiliser une deuxième information (la chaleur) : trois états à distinguer avec une seule visite.",
   "en": "Three switches downstairs control one bulb in the attic; you may go up only once. How do you identify the right switch?",
   "indice": "Une observation visuelle n'a que deux issues (allumée ou éteinte). Quelle autre grandeur physique peux-tu observer ?",
   "categorie": "logique",
   "titre": "Trois interrupteurs, une ampoule au grenier"
  },
  {
   "id": "ct-deux-gardiens",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Deux portes : l'une mène à la liberté, l'autre à la mort. Devant chacune, un gardien ; l'un dit toujours la vérité, l'autre ment toujours, et tu ne sais pas lequel est lequel. Tu as droit à une seule question posée à un seul gardien. Que demandes-tu ?",
   "solution": "Demande à l'un d'eux : « Si je demandais à l'autre gardien quelle porte mène à la liberté, laquelle m'indiquerait-il ? » puis prends **l'autre porte**.\n- Si tu interroges le sincère, il rapporte fidèlement le mensonge de l'autre : il désigne la mauvaise porte.\n- Si tu interroges le menteur, il déforme la réponse (vraie) du sincère : il désigne aussi la mauvaise porte.\nAutre question valable : « Si je te demandais si cette porte mène à la liberté, que répondrais-tu ? » : la double négation du menteur donne la vérité.",
   "indice": "Construis une question dont la réponse passe par les deux gardiens : la vérité et le mensonge se composent alors toujours en un mensonge.",
   "categorie": "logique",
   "titre": "Deux portes, deux gardiens, une question"
  },
  {
   "id": "ct-chevaliers-fripons",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Sur une île, les chevaliers disent toujours la vérité et les fripons mentent toujours. A dit : « Nous sommes tous les deux des fripons. » Que sont A et B ?",
   "solution": "Un chevalier ne peut pas dire « je suis un fripon » : A est donc un **fripon**. Sa phrase est fausse, donc ils ne sont pas tous deux fripons : B est un **chevalier**.\nMéthode générale : supposer un cas, chercher la contradiction ; ou écrire chaque affirmation comme une équation logique « A est chevalier ⇔ la phrase est vraie ».",
   "indice": "Un chevalier pourrait-il prononcer cette phrase ?",
   "categorie": "logique",
   "titre": "Chevaliers et fripons"
  },
  {
   "id": "ct-trois-oracles",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Trois oracles, Vrai, Faux et Aléatoire, répondent par « da » ou « ja » (dans un ordre inconnu, l'un signifie oui, l'autre non). Vrai dit toujours vrai, Faux toujours faux, Aléatoire répond au hasard. En trois questions fermées, chacune posée à un seul oracle, identifie les trois oracles.",
   "solution": "Avec $E(Q)$ = « Si je te demandais Q, répondrais-tu da ? », Vrai et Faux répondent tous deux « da » si Q est vraie et « ja » sinon, quel que soit le sens de « da » (double négation).\n1. Demande à l'oracle B : $E$(« A est-il Aléatoire ? »). Si « da », C n'est pas Aléatoire ; si « ja », A n'est pas Aléatoire. Dans les deux cas tu connais un oracle X qui est Vrai ou Faux.\n2. Demande à X : $E$(« Es-tu Faux ? ») : tu sais s'il est Vrai ou Faux.\n3. Demande à X : $E$(« B est-il Aléatoire ? ») : tu en déduis le troisième par élimination.\nLe point clé : la question 1 est utile même si B est Aléatoire (sa réponse ne dit alors rien, mais aucun des deux cas ne désigne Aléatoire par erreur, car Aléatoire c'est B).",
   "indice": "Rends la question insensible à la fois au mensonge et à la langue : « Si je te demandais Q, répondrais-tu da ? » La première question sert à trouver un oracle qui n'est sûrement pas Aléatoire.",
   "categorie": "logique",
   "titre": "Trois oracles : vrai, faux et aléatoire"
  },
  {
   "id": "ct-yeux-bleus",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Sur une île vivent 100 personnes aux yeux bleus, sans miroir ni moyen de connaître leur propre couleur ; chacune voit les autres. Règle : quiconque apprend avec certitude qu'il a les yeux bleus quitte l'île le soir même. Un visiteur annonce devant tous : « Je vois au moins une personne aux yeux bleus. » Que se passe-t-il ?",
   "solution": "Par récurrence : avec $k$ insulaires aux yeux bleus, ils partent **tous le $k$-ième soir**. Ici, les 100 partent le centième soir.\n- $k = 1$ : l'unique ne voit aucun œil bleu, comprend que c'est lui, part le premier soir.\n- $k = 2$ : chacun voit un œil bleu ; si l'autre ne part pas le premier soir, c'est qu'il voyait lui aussi quelqu'un : ils partent le deuxième soir.\n- Au rang $k$, chacun en voit $k - 1$ ; ne voyant personne partir le soir $k - 1$, il conclut.\nL'annonce n'apporte aucun fait nouveau à chacun, mais crée une **connaissance commune** (tout le monde sait que tout le monde sait… à tout ordre) qui déclenche le compte à rebours.",
   "indice": "Commence avec 1 insulaire aux yeux bleus, puis 2, puis 3. Qu'est-ce que l'annonce a appris, alors que tout le monde voyait déjà des yeux bleus ?",
   "categorie": "logique",
   "titre": "Les insulaires aux yeux bleus"
  },
  {
   "id": "ct-anniversaire-cheryl",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Cheryl donne à Albert le mois et à Bernard le jour de son anniversaire, parmi : 15, 16, 19 mai ; 17, 18 juin ; 14, 16 juillet ; 14, 15, 17 août. Albert : « Je ne sais pas, mais je sais que Bernard ne sait pas non plus. » Bernard : « Je ne savais pas, mais maintenant je sais. » Albert : « Alors moi aussi je sais. » Quelle est la date ?",
   "solution": "1. Les jours 18 (juin) et 19 (mai) sont uniques. Albert est sûr que Bernard ne sait pas : le mois n'est ni mai ni juin. Restent juillet (14, 16) et août (14, 15, 17).\n2. Bernard sait maintenant : son jour n'est pas 14 (ambigu). Restent 16 juillet, 15 août, 17 août.\n3. Albert sait aussi : son mois n'a qu'une date restante, c'est juillet. Réponse : **16 juillet**.",
   "indice": "Seuls les jours 18 et 19 sont uniques. Pour qu'Albert soit sûr que Bernard ne sait pas, son mois ne doit contenir aucun de ces jours.",
   "categorie": "logique",
   "titre": "L'anniversaire de Cheryl (ce que l'autre sait)",
   "voir": [
    "ct-somme-produit"
   ]
  },
  {
   "id": "ct-somme-produit",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Deux entiers $x$ et $y$ vérifient $1 < x < y$ et $x + y \\le 100$. S connaît leur somme, P leur produit. P : « Je ne connais pas les nombres. » S : « Je le savais. » P : « Maintenant je les connais. » S : « Moi aussi. » Quels sont les nombres ?",
   "solution": "1. P ne sait pas : le produit n'est pas un produit de deux premiers (ni de cas où une seule factorisation respecte les contraintes).\n2. S le savait : aucune façon d'écrire sa somme $s = a + b$ ne donne un produit qui identifierait les nombres. Les sommes paires sont exclues (Goldbach : somme de deux premiers), ainsi que $s - 2$ premier. Restent $s \\in \\{11, 17, 23, 27, 29, 35, 37, 41, 47, 53\\}$.\n3. P connaît alors les nombres : parmi les factorisations de son produit, une seule a une somme dans cette liste.\n4. S les connaît aussi : parmi les décompositions de sa somme, une seule passe l'étape 3. Seule $s = 17$ convient, avec le produit 52.\nRéponse : **4 et 13**. En entretien, on attend surtout la démarche (filtrer par « ce que l'autre sait ») ; la vérification complète se fait par ordinateur.",
   "indice": "« Je le savais » : aucune décomposition de la somme en deux entiers ne doit avoir un produit factorisable de façon unique. Que dit la conjecture de Goldbach sur les sommes paires ?",
   "categorie": "logique",
   "titre": "Somme et produit (problème de Freudenthal)"
  },
  {
   "id": "ct-ages-trois-filles",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Le produit des âges de mes trois filles vaut 36. La somme est le numéro de la maison d'en face. » Le recenseur regarde le numéro et répond : « Il me manque une information. » « L'aînée joue du piano. » Quels sont les âges ?",
   "solution": "Triplets de produit 36 et sommes : (1,1,36) 38 ; (1,2,18) 21 ; (1,3,12) 16 ; (1,4,9) 14 ; (1,6,6) 13 ; (2,2,9) 13 ; (2,3,6) 11 ; (3,3,4) 10.\nLe numéro ne suffit pas : la somme vaut 13, ambiguë entre (1,6,6) et (2,2,9). « L'aînée » suppose une aînée unique : **2, 2 et 9 ans**.",
   "indice": "Liste les triplets de produit 36 et leurs sommes. Pourquoi le numéro de la maison ne suffit-il pas ?",
   "categorie": "logique",
   "titre": "Les âges des trois filles (produit 36)"
  },
  {
   "id": "ct-chapeaux",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "100 prisonniers en file indienne portent un chapeau noir ou blanc. Chacun voit les chapeaux devant lui, pas le sien ni ceux de derrière. En partant du dernier de la file, chacun dit à haute voix une couleur ; ceux qui disent la couleur de leur propre chapeau sont libérés. Ils se concertent avant. Combien peuvent être sauvés à coup sûr ?",
   "solution": "**99** à coup sûr. Le dernier annonce la parité du nombre de chapeaux noirs qu'il voit (« noir » si ce nombre est impair). Il a une chance sur deux pour lui-même. Chacun des suivants connaît cette parité, voit les chapeaux devant lui et a entendu les réponses (justes) de ceux de derrière : il en déduit la couleur de son chapeau.\nIdée clé : un seul bit de parité suffit, et chaque réponse transmet de l'information aux suivants.",
   "en": "100 prisoners in a line wear black or white hats; each sees the hats in front only. Starting from the back, each says a color aloud; those naming their own hat color go free. They can agree on a strategy beforehand. How many can be saved for sure?",
   "indice": "Le dernier ne peut rien savoir de son propre chapeau. Quel unique bit d'information peut-il transmettre qui servira à tous les autres ?",
   "categorie": "logique",
   "titre": "100 prisonniers en file et chapeaux noirs ou blancs",
   "reponse": "99",
   "valeur": 99.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-chapeaux-simultanes",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Trois joueurs reçoivent chacun un chapeau rouge ou bleu (pile ou face indépendants). Chacun voit les deux autres, pas le sien. Simultanément, chacun annonce une couleur ou s'abstient. L'équipe gagne si au moins un joueur annonce et qu'aucun ne se trompe. Avec la meilleure stratégie concertée, quelle probabilité de gagner ?",
   "solution": "Stratégie : si tu vois deux chapeaux de même couleur, annonce l'autre couleur ; sinon abstiens-toi.\n- Configurations mélangées (6 sur 8) : exactement un joueur voit deux couleurs identiques, et il a raison ; les autres s'abstiennent : gagné.\n- Configurations unicolores (2 sur 8) : les trois annoncent et se trompent : perdu.\nProbabilité **3/4**. On ne change pas le nombre total d'erreurs, mais on les regroupe sur peu de configurations. Avec $n = 2^k - 1$ joueurs, les codes de Hamming donnent $1 - 1/(n + 1)$.",
   "indice": "Les configurations « toutes de même couleur » ne représentent que 2 cas sur 8. Peut-on concentrer toutes les erreurs dessus ?",
   "categorie": "logique",
   "titre": "Trois chapeaux, devinette simultanée ou abstention",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-logiciens-file",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois logiciens en file, numérotés de 1 (devant) à 3 (derrière) ; chacun voit les chapeaux de ceux qui sont devant lui, pas le sien. On a pris 3 chapeaux au hasard parmi 3 rouges et 2 bleus, un par tête (tous le savent). On demande au n° 3, puis au n° 2 : « Connais-tu ta couleur ? » Tous deux répondent « non ». Que répond le n° 1, qui ne voit personne ?",
   "solution": "- Le n° 3 dit non : les n° 1 et 2 ne portent pas tous les deux un bleu (sinon, les deux bleus étant pris, il saurait être rouge).\n- Le n° 2 dit non : s'il voyait un bleu sur le n° 1, il saurait (grâce au « non » du n° 3) ne pas en porter lui-même, donc être rouge. Puisqu'il ne sait pas, le n° 1 n'est pas bleu.\n- Le n° 1 répond donc **« oui, rouge »**, sans rien voir. Les couleurs des n° 2 et 3 restent indéterminées.\nLe moteur de ces énigmes : « s'il avait vu…, il aurait su ». Attention à la cohérence de l'énoncé : avec cinq logiciens et exactement 3 rouges et 2 bleus posés, le dernier de la file connaîtrait toujours sa couleur (il voit quatre chapeaux et sait ce qui reste).",
   "indice": "Le n° 3 dirait « oui » s'il voyait deux bleus. Le n° 2 sait ce que le « non » du n° 3 exclut : que dirait-il s'il voyait un bleu devant lui ?",
   "categorie": "logique",
   "titre": "Trois logiciens en file, chapeaux tirés parmi 3 rouges et 2 bleus"
  },
  {
   "id": "ct-prisonniers-ampoule",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "100 prisonniers, isolés, seront appelés un par un dans une pièce, dans un ordre aléatoire, autant de fois qu'il le faut (chacun une infinité de fois). La pièce contient une ampoule qu'ils peuvent allumer ou éteindre. Dès que l'un d'eux affirme à coup sûr que tous sont passés au moins une fois, ils sont libérés (s'il se trompe, ils sont exécutés). Quelle stratégie ?",
   "solution": "Un prisonnier est le **compteur**. Chaque autre prisonnier allume l'ampoule la première fois qu'il la trouve éteinte, puis ne la touche plus jamais. Le compteur éteint l'ampoule chaque fois qu'il la trouve allumée et ajoute 1 à son compte. Quand il atteint 99, il annonce que tous sont passés.\nDurée moyenne longue (de l'ordre de 10 000 passages) ; on peut l'accélérer par des schémas à plusieurs étapes, mais en entretien la correction de la stratégie compte d'abord.",
   "indice": "Désigne un compteur. Les autres n'ont le droit d'agir qu'une seule fois.",
   "categorie": "logique",
   "titre": "100 prisonniers et une ampoule"
  },
  {
   "id": "ct-prisonniers-boites",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "100 prisonniers numérotés. Dans une salle, 100 boîtes contiennent les numéros 1 à 100 dans un ordre aléatoire. Chaque prisonnier, seul, ouvre au plus 50 boîtes et doit trouver son numéro ; sans communication après le début. Ils sont libérés si **tous** réussissent. Avec la meilleure stratégie, quelle probabilité (à $10^{-3}$ près) ?",
   "solution": "Chacun suit le cycle de la permutation qui contient son numéro : il ouvre la boîte de son numéro, puis celle du numéro trouvé, etc. Il réussit si son cycle a une longueur au plus 50. Tous réussissent si la permutation n'a **aucun cycle de longueur > 50**.\nLe nombre de permutations de $\\{1, \\dots, n\\}$ ayant un cycle de longueur $k > n/2$ (au plus un tel cycle) est $n!/k$. D'où\n$$\\mathbb{P}(\\text{échec}) = \\sum_{k=51}^{100} \\frac{1}{k} = H_{100} - H_{50} \\approx \\ln 2 \\approx 0{,}688.$$\nProbabilité de succès : $1 - \\sum_{k=51}^{100} 1/k \\approx$ **0,312**. Toute la difficulté est que les succès individuels deviennent fortement corrélés.",
   "indice": "Au hasard, la probabilité est $2^{-100}$. Le prisonnier $k$ ouvre la boîte $k$, puis la boîte dont le numéro est celui qu'il vient de lire…",
   "categorie": "logique",
   "titre": "100 prisonniers et 100 boîtes (suivre les cycles)",
   "reponse": "0.3118",
   "valeur": 0.3118,
   "tolerance": 0.002,
   "duree": 420
  },
  {
   "id": "ct-meurtriers-balle",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Tu surveilles 100 détenus dans un champ avec un pistolet à une seule balle. Un détenu tente de s'enfuir s'il a une probabilité non nulle de survivre ; s'il est sûr de mourir, il reste. Tous sont parfaitement rationnels. Comment les empêcher de s'enfuir ?",
   "solution": "Numérote-les de 1 à 100 et annonce : « Je tirerai sur le **plus petit numéro** parmi ceux qui s'enfuient. »\nLe n° 1 serait abattu dès qu'il s'enfuit (il est toujours le plus petit) : il reste. Sachant cela, le n° 2 serait le plus petit fuyard : il reste. Par récurrence, personne ne bouge. C'est le même raisonnement à rebours que pour les pirates.",
   "indice": "« Je tirerai sur le premier qui bouge » ne suffit pas si deux partent en même temps. Il faut une règle qui désigne toujours une victime unique, connue d'avance.",
   "categorie": "logique",
   "titre": "100 détenus, un garde, une seule balle"
  },
  {
   "id": "ct-coffres-inscriptions",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois coffres, un seul contient l'or. Or : « L'or est ici. » Argent : « L'or n'est pas ici. » Plomb : « L'or n'est pas dans le coffre d'or. » Une seule inscription est vraie. Où est l'or ?",
   "solution": "- Or dans le coffre d'or : inscriptions d'or et d'argent vraies (deux), impossible.\n- Or dans le coffre d'argent : or faux, argent faux, plomb vrai (une), possible.\n- Or dans le coffre de plomb : argent vrai et plomb vrai (deux), impossible.\nL'or est dans le **coffre d'argent**. Méthode : énumérer les hypothèses, compter les contraintes.\nSi la règle devient « au plus une inscription vraie » ou « exactement une fausse », la méthode est la même : seule la règle de comptage change.",
   "indice": "Teste les trois hypothèses et compte les inscriptions vraies dans chaque cas.",
   "categorie": "logique",
   "titre": "Trois coffres, une seule inscription vraie"
  },
  {
   "id": "ct-tigres-mouton",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "100 tigres parfaitement rationnels et un mouton sont sur une île d'herbe. Un tigre qui mange le mouton devient lui-même un mouton (et peut être mangé). Chaque tigre préfère d'abord survivre, puis manger. Le mouton est-il mangé ?",
   "solution": "- 1 tigre : il mange le mouton (aucun risque).\n- 2 tigres : celui qui mangerait deviendrait mouton face à un tigre seul, donc mangé : personne ne mange.\n- 3 tigres : manger ramène au cas à 2 tigres, sûr : il mange.\nPar récurrence, le mouton est mangé si et seulement si le nombre de tigres est **impair**. Avec 100 tigres, **il survit**.",
   "indice": "Commence avec 1 tigre, puis 2, puis 3.",
   "categorie": "logique",
   "titre": "Tigres et mouton sur une île"
  },
  {
   "id": "ct-pieces-yeux-bandes",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "100 pièces sont posées sur une table, exactement 10 côté face. Les yeux bandés, tu peux déplacer et retourner les pièces, sans sentir leur côté. Forme deux tas contenant le même nombre de faces.",
   "solution": "Prends 10 pièces quelconques : si elles contiennent $k$ faces, l'autre tas en contient $10 - k$. **Retourne les 10 pièces** du petit tas : il contient maintenant $10 - k$ faces, comme l'autre.",
   "indice": "Prends un tas de 10 pièces quelconques. S'il contient $k$ faces, combien l'autre tas en contient-il ?",
   "categorie": "logique",
   "titre": "100 pièces, dont 10 côté face, les yeux bandés"
  },
  {
   "id": "ct-cadenas",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu veux envoyer un bijou à une amie par une poste qui vole tout colis non verrouillé. Vous avez chacune un cadenas et sa clé, mais aucune clé commune, et une clé envoyée serait copiée. Comment faire ?",
   "solution": "Tu fermes la boîte avec ton cadenas et l'envoies. Ton amie ajoute **son** cadenas et la renvoie. Tu retires le tien et la renvoies : elle l'ouvre avec sa clé. La boîte n'a jamais voyagé ouverte.\nC'est l'idée de l'échange de clés à la Diffie-Hellman (opérations qui commutent), utile pour parler de cryptographie.",
   "indice": "Le colis peut faire plusieurs allers-retours, et une boîte peut porter deux cadenas.",
   "categorie": "logique",
   "titre": "Envoyer un objet sous cadenas sans partager de clé"
  },
  {
   "id": "ct-cinq-cartes-fitch",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Un spectateur tire 5 cartes d'un jeu de 52 et les donne à l'assistant. L'assistant en garde une, et montre les 4 autres une par une, dans l'ordre qu'il veut, au magicien. Le magicien annonce la carte cachée. Comment ?",
   "solution": "1. Deux cartes sont de la même suite (tiroirs : 5 cartes, 4 suites). L'assistant cache l'une et montre l'autre **en premier** : la suite est connue.\n2. Sur le cercle des valeurs 1 à 13, l'écart de l'une à l'autre dans un sens est entre 1 et 6. L'assistant cache celle qui est « après », à $d \\in \\{1, \\dots, 6\\}$ crans.\n3. Les trois autres cartes, ordonnées selon un ordre total convenu (valeur puis suite), sont présentées dans l'une des $3! = 6$ permutations, qui code $d$.\nLe magicien ajoute $d$ à la première carte.",
   "indice": "Parmi 5 cartes, deux sont de la même couleur (au sens de la suite : pique, cœur…). Sur un cercle de 13 valeurs, l'une est au plus 6 crans après l'autre.",
   "categorie": "logique",
   "titre": "Le tour des cinq cartes (Fitch Cheney)"
  },
  {
   "id": "ct-guetteur-espion",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Je pense à un entier entre 1 et 100. Tu poses des questions fermées (oui ou non) et je réponds honnêtement. Combien de questions faut-il au minimum pour être sûr de le trouver ?",
   "solution": "$k$ réponses binaires distinguent au plus $2^k$ cas. $2^6 = 64 < 100 \\le 128 = 2^7$ : **7 questions** (dichotomie). C'est l'argument d'information, à rapprocher des pesées (trois issues : $3^k$).",
   "indice": "Chaque réponse divise au mieux le nombre de candidats par deux.",
   "categorie": "logique",
   "titre": "Combien de questions par oui ou non ? (information)",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.005,
   "duree": 120,
   "voir": [
    "jeu-dichotomie"
   ]
  },
  {
   "id": "ct-zeros-factorielle",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Par combien de zéros se termine $100!$ ?",
   "solution": "Chaque zéro vient d'un facteur $10 = 2 \\times 5$ ; les 2 sont plus nombreux que les 5. Facteurs 5 :\n$$\\left\\lfloor \\frac{100}{5} \\right\\rfloor + \\left\\lfloor \\frac{100}{25} \\right\\rfloor = 20 + 4 = 24.$$\nRéponse : **24**.",
   "en": "How many trailing zeros does $100!$ have?",
   "indice": "Un zéro final, c'est un facteur $10 = 2 \\times 5$. Lequel des deux facteurs est le plus rare ?",
   "categorie": "nombres",
   "titre": "Nombre de zéros à la fin de 100!",
   "reponse": "24",
   "valeur": 24.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-dernier-chiffre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel est le dernier chiffre de $7^{2026}$ ?",
   "solution": "Les derniers chiffres des puissances de 7 forment le cycle 7, 9, 3, 1 (période 4). $2026 = 4 \\times 506 + 2$ : même dernier chiffre que $7^2 = 49$, soit **9**.",
   "en": "What is the last digit of $7^{2026}$?",
   "indice": "Regarde les derniers chiffres de $7, 7^2, 7^3, 7^4, \\dots$",
   "categorie": "nombres",
   "titre": "Dernier chiffre de 7 puissance 2026",
   "reponse": "9",
   "valeur": 9.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-impairs",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Que vaut $1 + 3 + 5 + \\dots + 99$ (somme des nombres impairs jusqu'à 99) ?",
   "solution": "Il y a 50 termes ; la somme des $n$ premiers impairs vaut $n^2$ : **2 500**. (Ou : 50 termes de moyenne 50.)",
   "en": "Compute $1 + 3 + 5 + \\dots + 99$.",
   "indice": "Combien de termes, et quelle est leur moyenne ?",
   "categorie": "nombres",
   "titre": "Somme des impairs jusqu'à 99 (et la somme de Gauss)",
   "reponse": "2500",
   "valeur": 2500.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "ct-frobenius",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu n'as que des pièces de 3 € et de 5 €, en quantité illimitée. Quel est le plus grand montant entier impossible à payer exactement ?",
   "solution": "Payables : 3, 5, 6, 8, 9, 10, puis tout (8, 9, 10 consécutifs, on ajoute des 3). Impayables : 1, 2, 4, **7**. Formule de Frobenius pour deux valeurs premières entre elles : $ab - a - b = 15 - 8 = 7$.",
   "indice": "Une fois que trois montants consécutifs sont payables, tous les suivants le sont (ajoute des 3).",
   "categorie": "nombres",
   "titre": "Plus grand montant impayable avec des pièces de 3 et 5",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-restes-chinois",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel est le plus petit entier positif qui laisse un reste de 1 quand on le divise par 2, 3, 4, 5 et 6, et qui est divisible par 7 ?",
   "solution": "$n - 1$ est multiple de $\\mathrm{ppcm}(2, \\dots, 6) = 60$ : $n \\in \\{61, 121, 181, 241, 301, \\dots\\}$. Modulo 7, $60 \\equiv 4$, donc $n = 60k + 1 \\equiv 4k + 1$ ; il faut $4k \\equiv 6$, soit $k \\equiv 5 \\pmod 7$. $n = 301 = 7 \\times 43$ : **301**.",
   "indice": "$n - 1$ est un multiple de $\\mathrm{ppcm}(2, 3, 4, 5, 6)$.",
   "categorie": "nombres",
   "titre": "Reste 1 par 2, 3, 4, 5, 6 et divisible par 7",
   "reponse": "301",
   "valeur": 301.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-multiples-3-5",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quelle est la somme des entiers positifs inférieurs à 1 000 qui sont multiples de 3 ou de 5 ?",
   "solution": "Somme des multiples de $k$ sous 1 000 : $k \\cdot m(m + 1)/2$ avec $m = \\lfloor 999/k \\rfloor$.\n$3 \\times \\frac{333 \\times 334}{2} + 5 \\times \\frac{199 \\times 200}{2} - 15 \\times \\frac{66 \\times 67}{2} = 166\\,833 + 99\\,500 - 33\\,165 =$ **233 168**.",
   "indice": "Inclusion-exclusion : multiples de 3, plus multiples de 5, moins multiples de 15.",
   "categorie": "nombres",
   "titre": "Somme des multiples de 3 ou de 5 sous 1 000",
   "reponse": "233168",
   "valeur": 233168.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-diviseurs",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien 360 a-t-il de diviseurs positifs ?",
   "solution": "$360 = 2^3 \\times 3^2 \\times 5$. Un diviseur choisit un exposant de 2 parmi 4, de 3 parmi 3, de 5 parmi 2 : $4 \\times 3 \\times 2 =$ **24**.",
   "indice": "Décompose 360 en facteurs premiers.",
   "categorie": "nombres",
   "titre": "Nombre de diviseurs de 360",
   "reponse": "24",
   "valeur": 24.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-e-pi",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Sans calculatrice : lequel est le plus grand, $e^{\\pi}$ ou $\\pi^{e}$ ?",
   "solution": "$e^{\\pi} > \\pi^{e} \\iff \\pi > e \\ln \\pi \\iff \\frac{1}{e} > \\frac{\\ln \\pi}{\\pi}$. Or $f(x) = \\frac{\\ln x}{x}$ a pour dérivée $\\frac{1 - \\ln x}{x^2}$, maximale en $x = e$ où elle vaut $1/e$. Donc $\\frac{\\ln \\pi}{\\pi} < \\frac{1}{e}$ : **$e^{\\pi}$ est plus grand** ($23{,}14$ contre $22{,}46$).",
   "indice": "Compare $\\frac{\\ln x}{x}$ en $x = e$ et $x = \\pi$.",
   "categorie": "nombres",
   "titre": "Qui est le plus grand, $e^\\pi$ ou $\\pi^e$ ?"
  },
  {
   "id": "ct-tour-puissances",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Quel réel $x > 0$ vérifie $x^{x^{x^{\\cdots}}} = 2$ (tour infinie) ?",
   "solution": "Si la tour vaut $y$, alors $x^{y} = y$, donc $x^2 = 2$ et $x = \\sqrt{2} \\approx$ **1,414**. On vérifie que la suite $a_{n+1} = \\sqrt{2}^{\\,a_n}$ converge bien vers 2.",
   "indice": "La tour se retrouve dans son propre exposant.",
   "categorie": "nombres",
   "titre": "Tour de puissances infinie égale à 2",
   "reponse": "sqrt(2)",
   "valeur": 1.4142135623730951,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-produit-max",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On écrit 10 comme somme d'entiers positifs. Quel est le plus grand produit possible de ces entiers ?",
   "solution": "Tout terme $\\ge 5$ gagne à être coupé ($2(n - 2) > n$), et $3 \\times 3 > 2 \\times 2 \\times 2$ : on utilise des 3, complétés par des 2. $10 = 3 + 3 + 4$ (ou $3 + 3 + 2 + 2$) : **36**.",
   "indice": "Un 4 vaut 2 + 2 ; un nombre au moins 5 gagne à être cassé en 2 et 3.",
   "categorie": "nombres",
   "titre": "Produit maximal d'entiers de somme 10",
   "reponse": "36",
   "valeur": 36.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-cheque-inverse",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un caissier inverse les dollars et les cents d'un chèque. Le client dépense 5 cents et constate qu'il lui reste exactement le double du montant du chèque. Quel était le montant du chèque (en dollars) ?",
   "solution": "$100y + x - 5 = 2(100x + y)$, soit $98y - 199x = 5$ avec $0 \\le x, y \\le 99$. Modulo 98 : $-199x \\equiv -3x \\equiv 5$, d'où $x \\equiv 31$ ; $y = (5 + 199 \\times 31)/98 = 63$. Chèque : **31,63 \\$**.",
   "indice": "Chèque de $x$ dollars et $y$ cents : il reçoit $y$ dollars et $x$ cents. Écris l'égalité en cents.",
   "categorie": "nombres",
   "titre": "Le chèque aux dollars et cents inversés",
   "reponse": "31.63",
   "valeur": 31.63,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-autodescriptif",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Trouve le nombre à dix chiffres dont le premier chiffre est le nombre de 0 qu'il contient, le deuxième le nombre de 1, …, le dixième le nombre de 9.",
   "solution": "La somme des chiffres vaut 10 et la somme des chiffres pondérés $\\sum k\\,a_k$ vaut aussi 10. Beaucoup de zéros : essaie $a_0 = 6$ ; il faut alors un 6 ($a_6 = 1$), un 2 ($a_2 = 1$) et deux 1 ($a_1 = 2$). Vérification de 6210001000 : six 0, deux 1, un 2, un 6. Réponse : **6 210 001 000**, et c'est la seule.",
   "indice": "La somme des chiffres vaut 10 (il y a dix chiffres). Il y a donc beaucoup de zéros.",
   "categorie": "nombres",
   "titre": "Le nombre à dix chiffres qui se décrit lui-même",
   "reponse": "6210001000",
   "valeur": 6210001000.0,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-age-carre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une personne vivante aujourd'hui (fin 2026) avait $x$ ans en l'an $x^2$. Quel âge avait-elle cette année-là ?",
   "solution": "$44^2 = 1\\,936$ et $45^2 = 2\\,025$. Une personne de 44 ans en 1936 serait née en 1892 : improbable. Avec 45 ans en 2025, elle est née en 1980 : **45 ans**.",
   "indice": "Quels carrés tombent dans les cent dernières années ?",
   "categorie": "nombres",
   "titre": "J'avais $x$ ans en l'an $x^2$",
   "reponse": "45",
   "valeur": 45.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-chiffres-puissance",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de chiffres a $2^{100}$ (en base 10) ?",
   "solution": "$\\log_{10} 2^{100} = 100 \\times 0{,}30103 = 30{,}103$ : le nombre est entre $10^{30}$ et $10^{31}$, donc **31 chiffres**. Estimation rapide : $2^{100} = (2^{10})^{10} \\approx 1{,}024^{10} \\times 10^{30} \\approx 1{,}27 \\times 10^{30}$.",
   "indice": "$2^{10} = 1\\,024 \\approx 10^3$, ou $\\log_{10} 2 \\approx 0{,}301$.",
   "categorie": "nombres",
   "titre": "Combien de chiffres a 2 puissance 100 ?",
   "reponse": "31",
   "valeur": 31.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-irrationnel",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Démontre que $\\sqrt 2$ est irrationnel. Puis qu'il existe une infinité de nombres premiers.",
   "solution": "1. Si $\\sqrt 2 = p/q$ avec $p, q$ premiers entre eux, $p^2 = 2q^2$ : $p$ est pair, $p = 2r$, d'où $q^2 = 2r^2$ : $q$ est pair. Contradiction.\n2. Si $p_1, \\dots, p_n$ sont tous les premiers, $N = p_1 \\cdots p_n + 1$ n'est divisible par aucun d'eux ; or $N > 1$ a un facteur premier : contradiction.",
   "indice": "Par l'absurde dans les deux cas : $\\sqrt 2 = p/q$ irréductible ; puis une liste finie $p_1, \\dots, p_n$ de tous les premiers.",
   "categorie": "nombres",
   "titre": "Prouver que racine de 2 est irrationnel, et qu'il y a une infinité de premiers"
  },
  {
   "id": "ct-casiers",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "100 casiers fermés. Le passage $k$ ($k = 1$ à 100) change l'état (ouvert ou fermé) de tous les casiers dont le numéro est multiple de $k$. Combien de casiers sont ouverts à la fin ?",
   "solution": "Le casier $n$ est touché une fois par diviseur de $n$. Les diviseurs vont par paires $(d, n/d)$, sauf quand $d = n/d$ : seuls les carrés parfaits ont un nombre impair de diviseurs. Carrés jusqu'à 100 : $1, 4, \\dots, 100$, soit **10 casiers**.\nMême réponse pour 100 ampoules et 100 interrupteurs avec la même règle de bascule.",
   "en": "100 closed lockers. On pass $k$ ($k = 1$ to 100) you toggle every locker whose number is a multiple of $k$. How many lockers are open at the end?",
   "indice": "Combien de fois le casier $n$ est-il touché ?",
   "categorie": "nombres",
   "titre": "100 casiers ouverts et fermés à chaque passage",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 180,
   "essentiel": true
  },
  {
   "id": "ct-pieces-balance",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu as 12 pièces dont une fausse, plus lourde ou plus légère (tu ne sais pas). Avec une balance à deux plateaux, comment la trouver en 3 pesées et savoir si elle est plus lourde ou plus légère ?",
   "solution": "Argument de comptage : 24 possibilités et $3^3 = 27$ issues : c'est possible en principe, à condition que chaque pesée sépare bien les cas.\nPesée 1 : $\\{1,2,3,4\\}$ contre $\\{5,6,7,8\\}$.\n- **Équilibre** : la fausse est parmi 9 à 12. Pesée 2 : $\\{9,10,11\\}$ contre $\\{1,2,3\\}$ (vraies). Si équilibre, c'est 12 : pesée 3 contre une vraie pour le sens. Sinon le sens est connu et il reste 3 pièces : pesée 3 de 9 contre 10.\n- **Déséquilibre**, disons $\\{1,2,3,4\\}$ plus lourd : soit l'une de 1 à 4 est lourde, soit l'une de 5 à 8 est légère. Pesée 2 : $\\{1,2,5\\}$ contre $\\{3,6,9\\}$. Gauche plus lourde : 1 ou 2 lourde, ou 6 légère ; pesée 3 : 1 contre 2 (équilibre → 6). Droite plus lourde : 3 lourde ou 5 légère ; pesée 3 : 3 contre 9. Équilibre : 4 lourde, ou 7 ou 8 légère ; pesée 3 : 7 contre 8 (équilibre → 4).\nCe qui est évalué : l'argument d'information (trois issues par pesée) et l'organisation des cas.",
   "en": "12 coins, one counterfeit that is heavier or lighter (unknown). Find it and determine heavier/lighter in 3 weighings on a balance.",
   "indice": "Compte les cas : 12 pièces et 2 sens, soit $12 \\times 2 = 24$, et trois pesées ont $3^3 = 27$ issues. Première pesée : 4 contre 4.",
   "categorie": "pesees",
   "titre": "12 pièces, une fausse, 3 pesées",
   "voir": [
    "ct-billes-plus-lourde"
   ]
  },
  {
   "id": "ct-billes-plus-lourde",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Parmi 9 billes identiques d'apparence, une seule est plus lourde. Avec une balance à deux plateaux, combien de pesées faut-il au minimum pour la trouver à coup sûr ?",
   "solution": "Pesée 1 : 3 contre 3. Si un plateau penche, la lourde y est ; sinon elle est dans le troisième groupe. Pesée 2 : 1 contre 1 parmi les 3 restantes, même raisonnement. **2 pesées**. Avec $k$ pesées on traite $3^k$ billes, et on ne peut pas faire mieux : $\\lceil \\log_3 n \\rceil$.",
   "indice": "Une pesée a trois issues : gauche, droite, équilibre. Fais trois groupes.",
   "categorie": "pesees",
   "titre": "9 billes, une plus lourde, 2 pesées",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-piles-pieces-une-pesee",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Dix piles de dix pièces. Les vraies pèsent 10 g, et l'une des piles est entièrement faite de fausses pièces de 11 g. Avec une balance électronique précise, combien de pesées faut-il au minimum pour trouver la pile fausse ?",
   "solution": "Prends 1 pièce de la pile 1, 2 de la pile 2, …, 10 de la pile 10, et pèse le tout. Si tout était vrai : $55 \\times 10 = 550$ g. L'excédent en grammes donne directement le numéro de la pile fausse : **une seule pesée**.\nMême solution pour dix pots de pilules dont un contient des pilules de 11 g au lieu de 10 g.",
   "indice": "Une balance électronique donne un nombre, pas seulement « plus lourd / plus léger ». Prends un nombre différent de pièces dans chaque pile.",
   "categorie": "pesees",
   "titre": "10 piles de pièces, une pile fausse, une seule pesée",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-poids-balance",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une balance à deux plateaux. On veut pouvoir peser n'importe quelle masse entière de 1 à 40 g, en posant des poids sur l'un ou l'autre plateau. Combien de poids faut-il au minimum, et lesquels ?",
   "solution": "Chaque poids a trois états, d'où le système ternaire équilibré (chiffres $-1, 0, 1$). Avec $1, 3, 9, 27$ on atteint toutes les masses de 1 à $1 + 3 + 9 + 27 = 40$. Exemple : $5 = 9 - 3 - 1$. Trois poids donnent au plus $(3^3 - 1)/2 = 13$ masses positives, insuffisant : **4 poids**.\nC'est le problème de Bachet : un marchand casse un poids de 40 livres en 4 morceaux qui permettent de tout peser ; ce sont 1, 3, 9 et 27.",
   "indice": "Chaque poids peut être à gauche, à droite ou absent : trois états.",
   "categorie": "pesees",
   "titre": "Le moins de poids pour peser tout entier de 1 à 40 g",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-cordes",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Deux cordes brûlent chacune en exactement une heure, mais de façon irrégulière (la moitié de la corde ne brûle pas forcément en 30 minutes). Comment mesurer 45 minutes ?",
   "solution": "Allume la corde A par les deux bouts et la corde B par un bout. A brûle en 30 minutes. À cet instant, allume l'autre bout de B : il lui restait 30 minutes de combustion, elle finit en 15 minutes. Total : **45 minutes**.",
   "en": "Two ropes each burn in exactly one hour, but unevenly. How do you measure 45 minutes?",
   "indice": "Allumer une corde par les deux bouts divise son temps de combustion par deux, quelle que soit l'irrégularité.",
   "categorie": "pesees",
   "titre": "Deux cordes qui brûlent en une heure"
  },
  {
   "id": "ct-sabliers",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Avec un sablier de 7 minutes et un de 11 minutes, comment mesurer exactement 15 minutes ?",
   "solution": "- $t = 0$ : retourne les deux sabliers.\n- $t = 7$ : le petit est vide, retourne-le.\n- $t = 11$ : le grand est vide ; le petit coule depuis 4 minutes (4 minutes de sable en bas, 3 en haut). Retourne-le : les 4 minutes passées en bas remontent.\n- $t = 15$ : le petit se vide. **15 minutes**.\nPrincipe : quand un sablier se vide, retourner l'autre « rend » la durée qu'il vient d'écouler.",
   "indice": "Lance les deux en même temps. Que reste-t-il dans le grand quand le petit est vide ?",
   "categorie": "pesees",
   "titre": "Sabliers de 7 et 11 minutes pour mesurer 15 minutes"
  },
  {
   "id": "ct-cruches",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu as une cruche de 3 L, une de 5 L, un robinet et un évier, sans graduation. Comment obtenir exactement 4 L ? Combien d'opérations (remplir, vider ou transvaser) au minimum ?",
   "solution": "Remplis 5 (5, 0) ; verse dans 3 (2, 3) ; vide 3 (2, 0) ; verse les 2 L dans 3 (0, 2) ; remplis 5 (5, 2) ; complète 3 avec 1 L (4, 3). **6 opérations**.\nGénéral : avec des cruches $a$ et $b$, on atteint exactement les multiples de $\\mathrm{pgcd}(a, b)$ jusqu'à $\\max(a, b)$ (identité de Bézout).",
   "indice": "Remplis la grande et verse-la dans la petite.",
   "categorie": "pesees",
   "titre": "Cruches de 3 et 5 litres pour obtenir 4 litres",
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-vin-eau",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Un verre de vin et un verre d'eau, même volume. Tu prends une cuillère de vin, la verses dans l'eau et mélanges ; puis tu reprends une cuillère du mélange et la verses dans le vin. Y a-t-il plus de vin dans l'eau ou d'eau dans le vin ?",
   "solution": "**Autant** : chaque verre a son volume initial ; le vin qui manque dans le verre de vin se trouve dans le verre d'eau, et il a été remplacé exactement par le même volume d'eau. Le résultat ne dépend ni du mélange ni du nombre d'allers-retours.",
   "indice": "Les deux verres ont retrouvé leur volume initial. Ce qui manque de vin dans le verre de vin, où est-il ?",
   "categorie": "pesees",
   "titre": "Une cuillère de vin dans l'eau, puis une d'eau dans le vin"
  },
  {
   "id": "ct-pommes-de-terre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "100 kg de pommes de terre sont constituées à 99 % d'eau. Après séchage, elles ne contiennent plus que 98 % d'eau. Combien pèsent-elles (en kg) ?",
   "solution": "Matière sèche : 1 kg, inchangée. Elle représente maintenant 2 % du total : $1 / 0{,}02 =$ **50 kg**. Le résultat surprend parce qu'on raisonne sur l'eau au lieu de la partie invariante.",
   "indice": "La matière sèche ne change pas.",
   "categorie": "pesees",
   "titre": "100 kg de pommes de terre à 99 % d'eau",
   "reponse": "50",
   "valeur": 50.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-barre-or",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un ouvrier travaille 7 jours et doit recevoir chaque soir $1/7$ d'une barre d'or (la barre est divisée en 7 segments). Combien de coupes au minimum, s'il peut rendre des morceaux ?",
   "solution": "Deux coupes donnent des morceaux de **1, 2 et 4** segments. Jour 1 : donne 1. Jour 2 : donne 2, reprends 1. Jour 3 : donne 1. Jour 4 : donne 4, reprends 1 et 2. Etc. C'est l'écriture binaire. Une seule coupe ne donne que deux morceaux, insuffisant : **2 coupes**.",
   "indice": "Avec des morceaux de 1, 2 et 4 segments, on forme tous les montants de 1 à 7.",
   "categorie": "pesees",
   "titre": "Payer un ouvrier chaque jour avec une barre d'or",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-vin-empoisonne",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une bouteille sur 1 000 est empoisonnée ; le poison tue en 24 h, même à dose infime. Tu as 24 h pour la trouver. Combien de rats de laboratoire faut-il au minimum ?",
   "solution": "Numérote les bouteilles en binaire (10 bits suffisent : $2^{10} = 1\\,024 \\ge 1\\,000$). Le rat $i$ boit de chaque bouteille dont le bit $i$ vaut 1. L'ensemble des rats morts donne l'écriture binaire de la bouteille empoisonnée : **10 rats**.\nAvec des bandelettes réutilisables qui répondent en une heure et 10 heures devant soi, on peut faire une dichotomie séquentielle ; le codage parallèle reste plus économe en bandelettes.",
   "en": "One of 1,000 bottles is poisoned; the poison kills within 24 hours even in tiny doses. You have 24 hours. Minimum number of rats needed?",
   "indice": "Chaque rat donne un bit d'information : mort ou vivant.",
   "categorie": "pesees",
   "titre": "1 000 bouteilles, une empoisonnée, 24 heures",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-triangle-aigu",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On choisit trois points uniformément et indépendamment sur un cercle. Quelle est la probabilité que le triangle formé soit acutangle (tous ses angles aigus) ?",
   "solution": "Le triangle est obtus ou rectangle exactement quand les trois points tiennent dans un demi-cercle, ce qui arrive avec probabilité $3/4$ (chacun des trois points peut être « le premier » d'un demi-cercle qui contient les deux autres : $3 \\times (1/2)^2$). Triangle aigu : $1 - 3/4 =$ **1/4**.",
   "indice": "Un triangle inscrit est aigu si et seulement s'il contient le centre du cercle, c'est-à-dire si les trois points ne sont pas dans un même demi-cercle.",
   "categorie": "probas",
   "titre": "Trois points sur un cercle : triangle aigu ?",
   "reponse": "1/4",
   "valeur": 0.25,
   "tolerance": 0.005,
   "duree": 300,
   "voir": [
    "proba-demi-cercle"
   ]
  },
  {
   "id": "ct-p-rendez-vous",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux amis arrivent indépendamment à un instant uniforme entre 8 h et 9 h ; chacun attend 15 minutes puis s'en va. Probabilité qu'ils se rencontrent ?",
   "solution": "Ils se rencontrent si $|X - Y| \\le 1/4$. Le complémentaire forme deux triangles de côté $3/4$ : aire $(3/4)^2 = 9/16$. Probabilité : $1 - 9/16 =$ **7/16**.",
   "indice": "Dessine le carré $[0, 1]^2$ des heures d'arrivée et la bande $|x - y| \\le 1/4$.",
   "categorie": "probas",
   "titre": "Rendez-vous entre 8 h et 9 h, attente de 15 minutes",
   "reponse": "7/16",
   "valeur": 0.4375,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-p-buffon",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance une aiguille de longueur 1 sur un parquet dont les lames ont une largeur 1. Probabilité que l'aiguille croise une ligne ?",
   "solution": "$x$ uniforme sur $[0, 1/2]$, $\\theta$ uniforme sur $[0, \\pi/2]$ ; croisement si $x \\le \\frac12 \\sin\\theta$.\n$$\\mathbb{P} = \\frac{\\int_0^{\\pi/2} \\frac12 \\sin\\theta \\, d\\theta}{\\frac12 \\cdot \\frac{\\pi}{2}} = \\frac{1/2}{\\pi/4} = \\frac{2}{\\pi} \\approx 0{,}637.$$\nRéponse : **$2/\\pi$**. Astuce élégante (« nouille de Buffon ») : l'espérance du nombre de croisements est proportionnelle à la longueur, quelle que soit la forme.",
   "indice": "Paramètre l'aiguille par la distance $x$ de son centre à la ligne la plus proche ($0 \\le x \\le 1/2$) et l'angle $\\theta$.",
   "categorie": "probas",
   "titre": "L'aiguille de Buffon",
   "reponse": "2/pi",
   "valeur": 0.6366197723675814,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-bertrand-corde",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "On trace une corde « au hasard » dans un cercle. Quelle est la probabilité qu'elle soit plus longue que le côté du triangle équilatéral inscrit ?",
   "solution": "- Deux extrémités uniformes sur le cercle : **1/3**.\n- Un rayon uniforme puis un point uniforme sur ce rayon, corde perpendiculaire : **1/2**.\n- Milieu de la corde uniforme dans le disque : **1/4**.\nLeçon : une probabilité n'a de sens qu'avec un modèle précis. En entretien, dire « ça dépend » **et** donner les trois réponses.",
   "indice": "Le résultat dépend de ce que « au hasard » veut dire. Propose trois façons de tirer une corde.",
   "categorie": "probas",
   "titre": "Paradoxe de Bertrand : une corde « au hasard »"
  },
  {
   "id": "ct-p-de-repetition",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance un dé jusqu'à obtenir une face déjà sortie. Combien de lancers en moyenne (le lancer de la répétition compris) ?",
   "solution": "$\\mathbb{P}(N > k) = \\frac{6 \\cdot 5 \\cdots (6 - k + 1)}{6^k}$ pour $k \\le 6$.\n$$\\mathbb{E}[N] = 1 + 1 + \\frac56 + \\frac{5 \\cdot 4}{36} + \\frac{120}{216} + \\frac{360}{1296} + \\frac{720}{7776} = \\frac{1223}{324} \\approx 3{,}77.$$\nRéponse : **$1223/324 \\approx 3{,}77$**. C'est le problème des anniversaires avec 6 « jours ».",
   "indice": "$\\mathbb{E}[N] = \\sum_{k \\ge 0} \\mathbb{P}(N > k)$, et $N > k$ signifie que les $k$ premiers lancers sont tous différents.",
   "categorie": "probas",
   "titre": "Lancer un dé jusqu'à revoir une face",
   "reponse": "1223/324",
   "valeur": 3.7746913580246915,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-cube-oppose",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une fourmi part d'un sommet d'un cube et, à chaque minute, suit une arête au hasard (3 choix). En combien de minutes en moyenne atteint-elle le sommet opposé ?",
   "solution": "Notons $e_k$ l'espérance depuis la distance $k$.\n$e_3 = 1 + e_2$ ; $e_2 = 1 + \\frac13 e_3 + \\frac23 e_1$ ; $e_1 = 1 + \\frac23 e_2$.\nOn trouve $e_1 = 7$, $e_2 = 9$, $e_3 =$ **10**.",
   "indice": "Regroupe les sommets par distance au sommet d'arrivée : 3, 2, 1, 0.",
   "categorie": "probas",
   "titre": "Marche aléatoire sur un cube jusqu'au sommet opposé",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-piece-equitable",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Ta pièce tombe sur pile avec une probabilité $p$ inconnue ($0 < p < 1$). Comment simuler un tirage parfaitement équitable ? Combien de lancers en moyenne ?",
   "solution": "Méthode de von Neumann : lance deux fois ; PF donne « pile », FP donne « face » (chacun de probabilité $p(1 - p)$) ; PP ou FF : recommence. Nombre moyen de paires : $\\frac{1}{2p(1 - p)}$, soit $\\frac{1}{p(1 - p)}$ lancers ($4$ si $p = 1/2$).",
   "indice": "Lance deux fois. Quelles issues ont la même probabilité ?",
   "categorie": "probas",
   "titre": "Fabriquer un tirage équitable avec une pièce biaisée",
   "voir": [
    "algo-rand7"
   ]
  },
  {
   "id": "ct-p-urnes-bleues",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu répartis 5 boules bleues et 5 rouges dans deux urnes (chacune non vide). On choisit une urne au hasard, puis une boule dans cette urne. Tu gagnes si elle est bleue. Meilleure répartition et probabilité de gagner ?",
   "solution": "Mets **une seule boule bleue** dans la première urne, et les 9 autres (4 bleues, 5 rouges) dans la seconde :\n$$\\mathbb{P} = \\frac12 \\times 1 + \\frac12 \\times \\frac49 = \\frac{13}{18} \\approx 0{,}72.$$\nOn ne peut pas faire mieux : une urne ne peut pas dépasser 1, et l'autre est au mieux la plus « bleue » possible avec ce qui reste.",
   "indice": "Une urne qui ne contient qu'une boule bleue gagne à coup sûr.",
   "categorie": "probas",
   "titre": "Répartir 5 boules bleues et 5 rouges dans deux urnes",
   "reponse": "13/18",
   "valeur": 0.7222222222222222,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-chaussettes",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un tiroir contient des chaussettes rouges et noires. Si l'on en tire deux au hasard, la probabilité qu'elles soient toutes deux rouges vaut exactement $1/2$. Quel est le plus petit nombre total de chaussettes ?",
   "solution": "$2r(r - 1) = n(n - 1)$. Pour $n = 4$, $r = 3$ : $\\frac{3 \\times 2}{4 \\times 3} = \\frac12$. Plus petit total : **4** (3 rouges, 1 noire). Solution suivante : 21 chaussettes dont 15 rouges.",
   "indice": "$\\frac{r(r - 1)}{n(n - 1)} = \\frac12$. Essaie de petites valeurs de $n$.",
   "categorie": "probas",
   "titre": "Chaussettes : deux rouges avec probabilité 1/2",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-cartes-broyees",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On mélange un jeu de 52 cartes, on en jette 20 au hasard dans une broyeuse sans les regarder, puis on tire 2 des cartes restantes. Probabilité qu'elles soient toutes deux des as ?",
   "solution": "Par symétrie, les 2 cartes tirées sont deux cartes uniformes du jeu complet : $\\frac{4}{52} \\times \\frac{3}{51} = \\frac{1}{221}$. Réponse : **1/221**.",
   "indice": "Les cartes jetées sans être regardées n'apportent aucune information.",
   "categorie": "probas",
   "titre": "Deux as après avoir broyé 20 cartes au hasard",
   "reponse": "1/221",
   "valeur": 0.004524886877828055,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-p-pari-60-piles",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance 100 pièces équilibrées. Si au moins 60 tombent sur pile, tu gagnes 10 € ; sinon rien. Le jeu coûte 1 €. Quelle est (à peu près) la probabilité de gagner ? Faut-il jouer ?",
   "solution": "Le nombre de piles a pour moyenne 50 et écart-type $\\sqrt{100 \\times \\frac14} = 5$. Avec la correction de continuité, $\\mathbb{P}(X \\ge 60) \\approx \\mathbb{P}(Z \\ge 1{,}9) \\approx 0{,}029$ (valeur exacte $0{,}0284$). Gain espéré : $10 \\times 0{,}028 \\approx 0{,}28$ € pour 1 € de mise : **ne pas jouer**.",
   "indice": "Approximation normale : moyenne 50, écart-type 5.",
   "categorie": "probas",
   "titre": "Payer 1 € pour gagner 10 € si au moins 60 piles sur 100",
   "reponse": "0.0284",
   "valeur": 0.0284,
   "tolerance": 0.003,
   "duree": 240
  },
  {
   "id": "ct-p-roulette-russe",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un revolver à 6 chambres contient deux balles dans des chambres **adjacentes** ; le barillet a été tourné au hasard. Ton adversaire tire, le coup est vide. C'est ton tour : préfères-tu qu'on fasse tourner le barillet, ou tirer directement ? Quelle est ta probabilité de survie dans le meilleur cas ?",
   "solution": "Chambres : B B V V V V (cycliquement). Sachant la chambre courante vide (4 cas équiprobables), la suivante est vide dans 3 cas sur 4 (seule la dernière chambre vide précède une balle).\n- Sans tourner : survie $3/4$.\n- En tournant : survie $4/6 = 2/3$.\nTirer **sans tourner** : survie **3/4**.",
   "indice": "Sachant que la chambre courante était vide, combien de chambres vides suivantes sont suivies d'une chambre vide ?",
   "categorie": "probas",
   "titre": "Roulette russe à deux balles adjacentes",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-six-sachant-pairs",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance un dé jusqu'à obtenir un 6. Sachant que tous les lancers ont été pairs, quelle est l'espérance du nombre de lancers ?",
   "solution": "$\\mathbb{P}(N = n, \\text{tous pairs}) = (2/6)^{n-1} \\times 1/6$. Conditionnellement, $\\mathbb{P}(N = n \\mid \\text{tous pairs}) \\propto (1/3)^{n-1}$ : $N$ est géométrique de paramètre $2/3$, et $\\mathbb{E}[N] =$ **3/2**.\nIntuition : conditionner à « tous pairs » favorise fortement les suites courtes (une longue suite sans aucun impair est très improbable). Équivalent : lancer jusqu'au premier résultat dans $\\{1, 3, 5, 6\\}$, puis garder la suite si c'est un 6.",
   "indice": "Ce n'est pas 3. Calcule $\\mathbb{P}(N = n \\text{ et tous pairs})$ : il faut $n - 1$ lancers parmi $\\{2, 4\\}$ puis un 6.",
   "categorie": "probas",
   "titre": "Lancer un dé jusqu'au 6, sachant que tous les lancers sont pairs",
   "reponse": "3/2",
   "valeur": 1.5,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-morceau-milieu",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On casse un bâton de longueur 1 en un point uniforme. Quelle est la longueur moyenne du morceau qui contient le milieu du bâton ?",
   "solution": "Le morceau contenant le milieu est le plus long, de longueur $\\max(U, 1 - U)$, uniforme sur $[1/2, 1]$ : espérance **3/4**.",
   "indice": "Ce morceau est le plus long des deux.",
   "categorie": "probas",
   "titre": "Le morceau de bâton qui contient le milieu",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 240,
   "voir": [
    "proba-baton-plus-long"
   ]
  },
  {
   "id": "ct-p-baton-casse-deux-fois",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On casse un bâton de longueur 1 en un point uniforme, puis on casse le **plus long** des deux morceaux en un point uniforme. Probabilité que les trois morceaux forment un triangle ?",
   "solution": "Soit $L$ le plus long morceau ($L$ uniforme sur $[1/2, 1]$), cassé en $V$ et $L - V$ avec $V$ uniforme sur $[0, L]$. Triangle si $V < 1/2$ et $L - V < 1/2$ (l'autre morceau $1 - L$ est déjà $< 1/2$), soit $V \\in ]L - 1/2, 1/2[$, de probabilité $\\frac{1 - L}{L}$.\n$$\\mathbb{P} = 2 \\int_{1/2}^{1} \\frac{1 - \\ell}{\\ell} \\, d\\ell = 2\\left(\\ln 2 - \\frac12\\right) = 2\\ln 2 - 1 \\approx 0{,}386.$$\nRéponse : **$2 \\ln 2 - 1 \\approx 0{,}386$**, plus que les $1/4$ de la cassure en deux points simultanés.",
   "indice": "Le plus long morceau mesure $L$ uniforme sur $[1/2, 1]$. Les trois morceaux forment un triangle si chacun est $< 1/2$.",
   "categorie": "probas",
   "titre": "Casser le bâton, puis casser le plus long morceau",
   "reponse": "2*ln(2)-1",
   "valeur": 0.3862943611198906,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-un-et-six",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance un dé jusqu'à ce que le 1 et le 6 soient tous deux apparus. Combien de lancers en moyenne ?",
   "solution": "Le premier des deux (1 ou 6) arrive en moyenne en $6/2 = 3$ lancers ; l'autre ensuite en 6 lancers : **9**. (Collectionneur de vignettes restreint à deux faces.)",
   "indice": "Temps d'attente du premier des deux, puis du second.",
   "categorie": "probas",
   "titre": "Lancer un dé jusqu'à avoir vu le 1 et le 6",
   "reponse": "9",
   "valeur": 9.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-total-atteint",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance un dé indéfiniment en additionnant les résultats. Quelle est la probabilité que le total cumulé prenne exactement la valeur $n$, quand $n$ est grand ?",
   "solution": "Le total avance en moyenne de $3{,}5$ par lancer : sur une longue distance, il touche une proportion $1/3{,}5 = 2/7$ des entiers (théorème du renouvellement). Donc $\\mathbb{P}(\\text{atteindre } n) \\to$ **2/7** $\\approx 0{,}286$. Pour un petit $n$, récurrence $p_n = \\frac16 \\sum_{k=1}^{6} p_{n-k}$, $p_0 = 1$ (par exemple $p_1 = 1/6$, $p_6 = 7^5/6^6 \\approx 0{,}36$).",
   "indice": "Un pas de dé vaut $3{,}5$ en moyenne : sur un long trajet, quelle fraction des entiers le total « touche-t-il » ?",
   "categorie": "probas",
   "titre": "Le total cumulé des dés passe-t-il par une valeur donnée ?",
   "reponse": "2/7",
   "valeur": 0.2857142857142857,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-deuce-tennis",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Au tennis, depuis « égalité », il faut gagner deux points d'affilée de plus que l'adversaire. Tu gagnes chaque point avec probabilité $0{,}6$, indépendamment. Probabilité de gagner le jeu ?",
   "solution": "$w = p^2 + 2pq\\,w$, donc $w = \\frac{p^2}{1 - 2pq} = \\frac{p^2}{p^2 + q^2} = \\frac{0{,}36}{0{,}52} = \\frac{9}{13} \\approx 0{,}692$. Réponse : **9/13**.",
   "indice": "Après deux points : tu gagnes ($p^2$), tu perds ($q^2$), ou retour à égalité ($2pq$).",
   "categorie": "probas",
   "titre": "Gagner un jeu de tennis depuis égalité",
   "reponse": "9/13",
   "valeur": 0.6923076923076923,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-garcon-mardi",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une famille a deux enfants. On apprend qu'au moins l'un des deux est un garçon né un mardi. Probabilité que les deux soient des garçons ? (Sexes et jours équiprobables et indépendants.)",
   "solution": "Couples d'enfants où au moins un est « garçon-mardi » : $14^2 - 13^2 = 27$. Parmi eux, deux garçons : $7^2 - 6^2 = 13$. Probabilité : **13/27** $\\approx 0{,}48$, entre $1/3$ (« au moins un garçon ») et $1/2$ (« l'aîné est un garçon »).\nLeçon : plus l'information est spécifique, plus elle « désigne » un enfant particulier, et plus on se rapproche de $1/2$. La réponse dépend aussi de **comment** l'information a été obtenue.",
   "indice": "Chaque enfant est un couple (sexe, jour) parmi 14 issues. Compte les couples d'enfants compatibles avec l'information.",
   "categorie": "probas",
   "titre": "Deux enfants, dont un garçon né un mardi",
   "reponse": "13/27",
   "valeur": 0.48148148148148145,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-paires-rouge-noire",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On mélange un jeu de 52 cartes (26 rouges, 26 noires) et on les aligne. En moyenne, combien de paires de cartes voisines sont de couleurs différentes ?",
   "solution": "Pour chaque paire de voisines, $\\mathbb{P}(\\text{couleurs différentes}) = 2 \\times \\frac{26}{52} \\times \\frac{26}{51} = \\frac{26}{51}$. Sur 51 paires : **26**.",
   "indice": "Linéarité de l'espérance sur les 51 paires de voisines.",
   "categorie": "probas",
   "titre": "Cartes voisines de couleurs différentes dans un jeu mélangé",
   "reponse": "26",
   "valeur": 26.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-ivrogne-falaise",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un ivrogne est à un pas du bord d'une falaise. À chaque pas, il se rapproche du bord avec probabilité $1/3$ et s'en éloigne avec probabilité $2/3$. Probabilité qu'il tombe un jour ?",
   "solution": "$x = \\frac13 + \\frac23 x^2$, d'où $2x^2 - 3x + 1 = 0$ : $x = 1$ ou $x = \\frac12$. Comme la marche dérive loin de la falaise, la bonne racine est la plus petite : **1/2**. En général, avec $p < 1/2$ vers le bord : $x = p/(1 - p)$.",
   "indice": "Soit $x$ la probabilité de tomber en partant d'un pas du bord. Partir de deux pas revient à « descendre d'un pas » deux fois de suite.",
   "categorie": "probas",
   "titre": "L'ivrogne au bord de la falaise",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-p-sans-piles-consecutifs",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance 10 fois une pièce équilibrée. Probabilité de n'avoir jamais deux piles consécutifs ?",
   "solution": "$a_n = a_{n-1} + a_{n-2}$ (la suite commence par F, ou par PF), $a_1 = 2$, $a_2 = 3$ : $a_{10} = 144$. Probabilité : $144/1024 =$ **9/64** $\\approx 0{,}14$.",
   "indice": "Le nombre de suites de longueur $n$ sans deux piles consécutifs vérifie une récurrence de Fibonacci.",
   "categorie": "probas",
   "titre": "Dix lancers sans deux piles consécutifs",
   "reponse": "9/64",
   "valeur": 0.140625,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-trois-piles-cinq-faces",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance une pièce équilibrée jusqu'à obtenir trois piles consécutifs ou cinq faces consécutives. Probabilité que les trois piles arrivent en premier ?",
   "solution": "Juste après une série de piles commencée : $a = \\frac14 + \\frac34 b$ (il faut PP de plus, sinon on retombe sur une face). Juste après une face : $b = \\frac{15}{16} a$ (il faut éviter 4 faces de plus). D'où $a = \\frac{16}{19}$, $b = \\frac{15}{19}$, et au départ $\\frac{a + b}{2} = \\frac{31}{38} \\approx 0{,}816$. Réponse : **31/38**.",
   "indice": "Soit $a$ la probabilité de gagner juste après un pile, $b$ juste après une face. Exprime $a$ en fonction de $b$ et inversement.",
   "categorie": "probas",
   "titre": "Trois piles d'affilée avant cinq faces d'affilée",
   "reponse": "31/38",
   "valeur": 0.8157894736842105,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-egalite-piles",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux joueurs lancent chacun leur pièce simultanément, à chaque tour, jusqu'à obtenir pile. Celui qui obtient pile le premier gagne ; s'ils l'obtiennent au même tour, c'est une égalité. Probabilité d'égalité ?",
   "solution": "On conditionne sur le premier tour où quelque chose se passe : $\\mathbb{P}(\\text{égalité}) = \\frac{1/4}{1/4 + 1/2} =$ **1/3**.",
   "indice": "À chaque tour : les deux piles ($1/4$), un seul ($1/2$), aucun ($1/4$, on recommence).",
   "categorie": "probas",
   "titre": "Deux joueurs lancent jusqu'à pile : probabilité d'égalité",
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-p-racines-reelles",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "$a$, $b$, $c$ sont indépendants et uniformes sur $[0, 1]$. Probabilité que $ax^2 + bx + c = 0$ ait des racines réelles ?",
   "solution": "$\\mathbb{P}(ac \\le t) = t(1 - \\ln t)$ pour $t \\in ]0, 1]$. Donc\n$$\\mathbb{P} = \\int_0^1 \\mathbb{P}\\left(ac \\le \\tfrac{b^2}{4}\\right) db = \\int_0^1 \\frac{b^2}{4}\\left(1 - \\ln \\frac{b^2}{4}\\right) db = \\frac{5 + 3\\ln 4}{36} \\approx 0{,}254.$$\nRéponse : **$(5 + 3\\ln 4)/36 \\approx 0{,}254$**.",
   "indice": "Il faut $b^2 \\ge 4ac$. Conditionne sur $b$, et calcule la loi du produit $ac$ : $\\mathbb{P}(ac \\le t) = t - t\\ln t$.",
   "categorie": "probas",
   "titre": "Une équation du second degré à coefficients aléatoires",
   "reponse": "(5+3*ln(4))/36",
   "valeur": 0.25441341898221315,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-craps",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Au craps, on lance deux dés. 7 ou 11 : gagné ; 2, 3 ou 12 : perdu. Sinon le total devient le « point », et l'on relance jusqu'à refaire le point (gagné) ou faire 7 (perdu). Probabilité de gagner ?",
   "solution": "$\\mathbb{P} = \\frac{8}{36} + \\sum_{k \\in \\{4,5,6,8,9,10\\}} p_k \\frac{p_k}{p_k + 6/36}$, avec $p_4 = p_{10} = 3/36$, $p_5 = p_9 = 4/36$, $p_6 = p_8 = 5/36$.\n$$\\mathbb{P} = \\frac{8}{36} + 2\\left(\\frac{1}{36} + \\frac{2}{45} + \\frac{25}{396}\\right) = \\frac{244}{495} \\approx 0{,}493.$$\nRéponse : **244/495**, légèrement défavorable.",
   "indice": "Une fois le point $k$ établi, la probabilité de le refaire avant 7 vaut $\\frac{p_k}{p_k + p_7}$.",
   "categorie": "probas",
   "titre": "Probabilité de gagner au craps",
   "reponse": "244/495",
   "valeur": 0.49292929292929294,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-p-distance-centre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On choisit un point uniformément dans un disque de rayon 1. Quelle est sa distance moyenne au centre ?",
   "solution": "$R$ a pour densité $2r$ sur $[0, 1]$ : $\\mathbb{E}[R] = \\int_0^1 2r^2\\,dr =$ **2/3**. La masse est concentrée près du bord.",
   "indice": "$\\mathbb{P}(R \\le r) = r^2$ : ce n'est pas $1/2$.",
   "categorie": "probas",
   "titre": "Distance moyenne d'un point du disque à son centre",
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-p-succession-laplace",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une pièce a un biais $p$ inconnu, a priori uniforme sur $[0, 1]$. Elle donne 3 piles en 3 lancers. Probabilité que le lancer suivant soit pile ?",
   "solution": "Règle de succession de Laplace : $\\frac{k + 1}{n + 2} = \\frac{4}{5}$. Réponse : **4/5**. Avec un a priori uniforme, on « ajoute un pile et un face imaginaires ».",
   "indice": "Loi a posteriori Bêta$(k + 1, n - k + 1)$, de moyenne $\\frac{k + 1}{n + 2}$.",
   "categorie": "probas",
   "titre": "Pièce de biais inconnu : trois piles, puis ?",
   "reponse": "4/5",
   "valeur": 0.8,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-p-sharpe-negatif",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une stratégie a des rendements annuels gaussiens de ratio de Sharpe 1 (rendement moyen égal à l'écart-type, taux sans risque nul). Probabilité d'une année à rendement négatif ?",
   "solution": "$\\mathbb{P}(R < 0) = \\mathbb{P}(Z < -1) = N(-1) \\approx$ **0,159** : environ une année sur six. Avec un Sharpe de 2 : $N(-2) \\approx 2{,}3\\,\\%$.",
   "indice": "Une année perdante, c'est un rendement à plus d'un écart-type sous la moyenne.",
   "categorie": "probas",
   "titre": "Sharpe de 1 : probabilité d'une année perdante",
   "reponse": "N(-1)",
   "valeur": 0.15865525393145707,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-p-grenouille-nenuphars",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une grenouille est sur la rive, face à 10 nénuphars alignés, le dernier étant l'autre rive. À chaque saut, elle choisit uniformément l'un des nénuphars situés devant elle. Combien de sauts en moyenne pour atteindre l'autre rive ?",
   "solution": "Le nénuphar $k$ (en comptant depuis l'arrivée) est visité avec probabilité $1/k$ : nombre moyen de sauts $= H_{10} = 1 + \\frac12 + \\dots + \\frac{1}{10} = \\frac{7381}{2520} \\approx$ **2,93**.",
   "indice": "Chaque nénuphar $k$ est visité avec une probabilité simple. Ou récurrence $e_n = 1 + \\frac1n \\sum_{k<n} e_k$.",
   "categorie": "probas",
   "titre": "La grenouille qui saute vers l'avant au hasard",
   "reponse": "7381/2520",
   "valeur": 2.9289682539682538,
   "tolerance": 0.005,
   "duree": 300,
   "voir": [
    "proba-records"
   ]
  },
  {
   "id": "ct-p-des-efron",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Je te propose de choisir un dé parmi trois dés truqués, puis je choisis le mien ; le plus grand résultat gagne. Pourquoi est-ce une mauvaise affaire pour toi ? Donne un exemple de tels dés.",
   "solution": "Exemple : A = (2, 2, 4, 4, 9, 9), B = (1, 1, 6, 6, 8, 8), C = (3, 3, 5, 5, 7, 7). A bat B, B bat C et C bat A, chacun avec probabilité $5/9$. Quel que soit ton choix, je prends celui qui le bat : la relation « bat le plus souvent » n'est **pas transitive**. Écho en finance : comparer des stratégies deux à deux ne donne pas forcément un classement.",
   "indice": "« A bat B » et « B bat C » n'impliquent pas « A bat C ».",
   "categorie": "probas",
   "titre": "Les dés non transitifs",
   "voir": [
    "proba-penney-ppf-pff"
   ]
  },
  {
   "id": "ct-p-simpson",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Un traitement guérit mieux que l'autre chez les patients légers **et** chez les patients graves, mais moins bien sur l'ensemble des patients. Est-ce possible ? Donne un exemple et la leçon pour un backtest.",
   "solution": "Oui. Traitement A : légers 81/87 (93 %), graves 192/263 (73 %), total 273/350 (78 %). Traitement B : légers 234/270 (87 %), graves 55/80 (69 %), total 289/350 (83 %). A gagne dans chaque groupe mais perd au total, car il a surtout traité des cas graves.\nLeçon : une variable de confusion (la gravité, ou en finance le régime de marché, le secteur, la taille) peut inverser une conclusion agrégée. Toujours regarder les sous-groupes et la composition.",
   "indice": "Les deux traitements n'ont pas été donnés aux mêmes proportions de cas graves.",
   "categorie": "probas",
   "titre": "Le paradoxe de Simpson"
  },
  {
   "id": "ct-chevaux",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "25 chevaux, une piste où 5 chevaux courent à la fois, pas de chronomètre (on ne voit que l'ordre d'arrivée). Combien de courses au minimum pour trouver les 3 plus rapides ?",
   "solution": "1. 5 courses de 5 : on classe chaque groupe.\n2. 6ᵉ course : les 5 vainqueurs. Le gagnant (A1) est le plus rapide de tous.\n3. Candidats pour les places 2 et 3 : A2, A3 (groupe du 1ᵉʳ), B1, B2 (groupe du 2ᵉ de la course 6), C1 (groupe du 3ᵉ). Tous les autres ont au moins trois chevaux plus rapides. 7ᵉ course avec ces 5 : les deux premiers sont les 2ᵉ et 3ᵉ.\nTotal : **7 courses**.",
   "en": "25 horses, a track that fits 5 at a time, no stopwatch. Minimum number of races to find the 3 fastest?",
   "indice": "5 courses de groupes, puis une course des 5 vainqueurs. Quels chevaux peuvent encore être 2ᵉ ou 3ᵉ ?",
   "categorie": "recherche",
   "titre": "25 chevaux, 5 par course, trouver les 3 plus rapides",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.005,
   "duree": 300,
   "essentiel": true
  },
  {
   "id": "ct-oeufs",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu as deux œufs identiques et un immeuble de 100 étages. Tu veux trouver le plus haut étage d'où un œuf peut tomber sans casser. Combien de lâchers au pire avec la meilleure stratégie ?",
   "solution": "Avec $n$ lâchers, on lâche le premier œuf à l'étage $n$ ; s'il casse, on teste un à un les $n - 1$ étages en dessous avec le second. S'il ne casse pas, on monte de $n - 1$ étages, puis $n - 2$, etc. On couvre\n$$n + (n - 1) + \\dots + 1 = \\frac{n(n + 1)}{2} \\text{ étages}.$$\nIl faut $n(n + 1)/2 \\ge 100$, donc **$n = 14$** ($14 \\times 15 / 2 = 105$). Étages du premier œuf : 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100.",
   "en": "Two identical eggs, a 100-floor building. Find the highest floor from which an egg survives. Minimum number of drops in the worst case?",
   "indice": "Si tu disposes de $n$ lâchers au total, de quel étage lâcher le premier œuf ?",
   "categorie": "recherche",
   "titre": "Deux œufs et un immeuble de 100 étages",
   "reponse": "14",
   "valeur": 14.0,
   "tolerance": 0.005,
   "duree": 420,
   "essentiel": true
  },
  {
   "id": "ct-pont",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quatre personnes doivent traverser un pont la nuit avec une seule lampe ; au plus deux personnes à la fois, et la lampe doit accompagner chaque traversée. Elles mettent 1, 2, 5 et 10 minutes ; un groupe avance au rythme du plus lent. Temps minimal ?",
   "solution": "1 et 2 traversent (2), 1 revient (1), 5 et 10 traversent (10), 2 revient (2), 1 et 2 traversent (2) : **17 minutes**.\nL'astuce : faire traverser les deux plus lents ensemble. La stratégie « 1 accompagne tout le monde » donne 19.",
   "en": "Four people cross a bridge at night with one torch; at most two at a time, the torch must go with each crossing. They take 1, 2, 5 and 10 minutes; a pair walks at the slower pace. Minimum total time?",
   "indice": "Le 5 et le 10 doivent-ils traverser séparément ?",
   "categorie": "recherche",
   "titre": "Traverser un pont la nuit avec une lampe (1, 2, 5, 10 minutes)",
   "reponse": "17",
   "valeur": 17.0,
   "tolerance": 0.005,
   "duree": 300,
   "voir": [
    "ct-riviere"
   ]
  },
  {
   "id": "ct-pasteques",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "16 pastèques de poids tous différents et une balance à deux plateaux qui compare deux pastèques à la fois. Combien de pesées au minimum, au pire, pour trouver les **deux** plus lourdes ?",
   "solution": "Tournoi à élimination directe : $16 - 1 = 15$ pesées pour la plus lourde. La deuxième a forcément perdu **directement** contre la plus lourde : il y a $\\log_2 16 = 4$ candidates, départagées en 3 pesées. Total : $15 + 3 =$ **18** (et c'est optimal : $n + \\lceil \\log_2 n \\rceil - 2$).",
   "indice": "Un tournoi à élimination trouve la plus lourde. Qui peut être la deuxième ?",
   "categorie": "recherche",
   "titre": "16 pastèques et une balance : les deux plus lourdes",
   "reponse": "18",
   "valeur": 18.0,
   "tolerance": 0.005,
   "duree": 300,
   "voir": [
    "ct-chevaux"
   ]
  },
  {
   "id": "ct-celebrite",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "À une soirée de $n$ personnes, une célébrité est quelqu'un que tout le monde connaît et qui ne connaît personne. Tu peux demander « A connaît-il B ? ». Comment trouver la célébrité (ou montrer qu'il n'y en a pas) en $O(n)$ questions ?",
   "solution": "1. Élimination : garde un candidat $c$ ; pour chaque autre personne $x$, si $c$ connaît $x$, alors $c$ est éliminé et $x$ devient candidat ; sinon $x$ est éliminé. $n - 1$ questions.\n2. Vérification : $c$ ne connaît personne et tout le monde connaît $c$ : au plus $2(n - 1)$ questions.\nTotal moins de $3n$ questions, contre $n^2$ en testant toutes les paires.",
   "indice": "Chaque question élimine quelqu'un : si A connaît B, A n'est pas la célébrité ; sinon B ne l'est pas.",
   "categorie": "recherche",
   "titre": "Trouver la célébrité d'une soirée"
  },
  {
   "id": "ct-nombre-manquant",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Une liste non triée contient les entiers de 1 à $n$, sauf un. Comment trouver le manquant en temps $O(n)$ et mémoire $O(1)$ ? Et si un nombre apparaît deux fois au lieu de manquer ?",
   "solution": "Manquant : $n(n + 1)/2$ moins la somme de la liste (ou le ou exclusif de $1, \\dots, n$ et de la liste, qui évite les dépassements).\nDoublon dans une liste de $n + 1$ entiers pris dans $1..n$ : somme de la liste moins $n(n + 1)/2$ ; sans pouvoir sommer, l'algorithme de Floyd (lièvre et tortue) sur la suite $i \\mapsto t[i]$ trouve le cycle, dont l'entrée est le doublon, en $O(n)$ et $O(1)$ de mémoire.",
   "indice": "Que vaut $1 + 2 + \\dots + n$ ?",
   "categorie": "recherche",
   "titre": "Le nombre manquant (ou le doublon) dans une liste"
  },
  {
   "id": "ct-pain-grille",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une poêle accueille deux tranches de pain à la fois. Chaque face doit griller 30 secondes. Combien de secondes au minimum pour griller les deux faces de trois tranches ?",
   "solution": "Faces : A1, B1 (30 s) ; A2, C1 (30 s) ; B2, C2 (30 s) : **90 secondes**, contre 120 avec l'approche naïve. Borne : $6 \\times 30 / 2 = 90$ secondes (6 faces, 2 places).",
   "indice": "Il y a 6 faces à griller et 2 places : ne laisse jamais une place vide.",
   "categorie": "recherche",
   "titre": "Griller trois tranches dans une poêle à deux places",
   "reponse": "90",
   "valeur": 90.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-pneus",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une voiture roule sur 4 pneus et transporte une roue de secours ; chaque pneu dure 20 000 km. En faisant tourner les pneus, quelle distance maximale (en km) peut-elle parcourir ?",
   "solution": "Total disponible : $5 \\times 20\\,000 = 100\\,000$ km-pneu ; chaque kilomètre en consomme 4 : $100\\,000 / 4 =$ **25 000 km**, atteint en faisant rouler chaque pneu $4/5$ du temps (rotation tous les 5 000 km).",
   "indice": "Compte le « kilométrage pneu » total disponible.",
   "categorie": "recherche",
   "titre": "Cinq pneus qui durent 20 000 km chacun",
   "reponse": "25000",
   "valeur": 25000.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ct-riviere",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois missionnaires et trois cannibales doivent traverser une rivière avec une barque de deux places. Jamais, sur une rive, les cannibales ne doivent être plus nombreux que les missionnaires (s'il y a des missionnaires). Combien de traversées au minimum ?",
   "solution": "Un parcours en largeur sur les états donne **11 traversées**, par exemple (M, C sur la rive de départ) : CC partent, C revient ; CC partent, C revient ; MM partent, MC revient ; MM partent, C revient ; CC partent, C revient ; CC partent.\nEn entretien, la méthode compte : graphe des états, recherche du plus court chemin.",
   "indice": "Modélise les états (personnes sur la rive de départ, position de la barque) et cherche le plus court chemin.",
   "categorie": "recherche",
   "titre": "Traverser la rivière (chèvre, loup, chou ; missionnaires)",
   "reponse": "11",
   "valeur": 11.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "ct-hanoi",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de déplacements au minimum pour transférer une tour de Hanoï de 10 disques ?",
   "solution": "$T_n = 2T_{n-1} + 1$, $T_1 = 1$, donc $T_n = 2^n - 1$ : $2^{10} - 1 =$ **1 023**. Pour 64 disques, $2^{64} - 1 \\approx 1{,}8 \\times 10^{19}$ déplacements.",
   "indice": "Pour déplacer $n$ disques, il faut déplacer les $n - 1$ du dessus deux fois.",
   "categorie": "recherche",
   "titre": "Tours de Hanoï à 10 disques",
   "reponse": "1023",
   "valeur": 1023.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-tri-cinq",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de comparaisons faut-il au minimum, au pire, pour trier 5 éléments distincts ?",
   "solution": "Borne inférieure : $\\lceil \\log_2 120 \\rceil = 7$ ($2^7 = 128$). Elle est atteinte : compare $a, b$ puis $c, d$ ; compare les deux vainqueurs (on obtient une chaîne $a < b < d$ avec $c < d$) ; insère $e$ dans la chaîne $a < b < d$ en 2 comparaisons ; insère $c$ (dont on sait $c < d$) dans le reste en 2 comparaisons. **7 comparaisons**.",
   "indice": "Borne d'information : $5! = 120$ ordres possibles, chaque comparaison a deux issues.",
   "categorie": "recherche",
   "titre": "Trier 5 éléments en 7 comparaisons",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "ct-stations-circuit",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Des stations-service sont réparties sur un circuit fermé. La somme de l'essence disponible dans toutes les stations suffit exactement pour faire un tour. Ton réservoir est vide au départ. Montre qu'il existe une station d'où l'on peut faire le tour complet, et trouve-la en un passage.",
   "solution": "Pars d'une station quelconque avec un réservoir « virtuel » qui peut devenir négatif ; la courbe du niveau revient à 0 après un tour. Pars de la station où ce niveau est **minimal** : depuis ce point, le niveau ne descend jamais sous son départ, donc reste positif. Un seul passage suffit pour trouver ce minimum : $O(n)$.",
   "indice": "Trace le niveau d'essence cumulé (essence prise moins essence consommée) en partant de n'importe où. Où est son minimum ?",
   "categorie": "recherche",
   "titre": "Faire le tour d'un circuit de stations-service"
  },
  {
   "id": "ct-pirates",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Cinq pirates rationnels, classés par ancienneté, se partagent 100 pièces d'or. Le plus ancien propose un partage ; si au moins la moitié des pirates (lui compris) l'accepte, c'est fini ; sinon il est jeté par-dessus bord et le suivant propose. Chacun veut d'abord survivre, puis maximiser son or, puis voir les autres jetés à l'eau. Que propose le premier ?",
   "solution": "Raisonnement à rebours (pirates 1 à 5, 5 étant le plus ancien) :\n- 2 pirates : le 2 garde tout (sa voix suffit) : $(100, 0)$.\n- 3 pirates : le 3 doit acheter une voix ; le 1 aurait 0 sinon, 1 pièce lui suffit : $(1, 0, 99)$.\n- 4 pirates : il faut 2 voix ; le 2 aurait 0 dans le cas à 3 : $(0, 1, 0, 99)$.\n- 5 pirates : il faut 3 voix ; acheter les pirates 1 et 3 (qui auraient 0 dans le cas à 4) avec 1 pièce chacun.\nProposition : **98 pour le plus ancien, 1 pour les pirates 1 et 3, 0 pour les autres**. C'est l'induction à rebours, comme pour une option américaine.",
   "en": "Five rational pirates split 100 gold coins. The most senior proposes a split; if at least half (including him) accept, done; otherwise he is thrown overboard. Each wants to survive, then maximize gold, then see others thrown overboard. What does the first pirate propose?",
   "indice": "Pars de la fin : que se passe-t-il quand il ne reste que deux pirates ? puis trois ?",
   "categorie": "strategie",
   "titre": "Cinq pirates et 100 pièces d'or"
  },
  {
   "id": "ct-allumettes",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Il y a 21 allumettes. À tour de rôle, chaque joueur en retire 1, 2 ou 3. Celui qui prend la dernière gagne. Tu commences : combien en retires-tu pour gagner à coup sûr ?",
   "solution": "Laisser un multiple de 4 à l'adversaire est gagnant : quoi qu'il prenne ($k$), tu prends $4 - k$. $21 = 4 \\times 5 + 1$ : retire **1** allumette, puis complète toujours à 4.",
   "indice": "Quelles sont les positions perdantes pour celui qui doit jouer ? Commence par 4.",
   "categorie": "strategie",
   "titre": "21 allumettes, on en retire 1 à 3",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-course-a-100",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux joueurs ajoutent à tour de rôle un entier entre 1 et 10 à un total qui part de 0. Celui qui atteint exactement 100 gagne. Tu commences : quel nombre annonces-tu ?",
   "solution": "Atteindre 89 garantit 100 (l'adversaire ajoute $k$, tu ajoutes $11 - k$). De même 78, 67, …, 12, 1. Annonce **1**, puis complète chaque coup adverse à 11.",
   "indice": "Quels totaux faut-il atteindre pour être sûr d'atteindre 100 ? Pars de 100 et descends de 11 en 11.",
   "categorie": "strategie",
   "titre": "Course à 100 (on ajoute entre 1 et 10)",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-nim",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Trois tas de 3, 4 et 5 objets. À tour de rôle, on retire autant d'objets qu'on veut (au moins un) d'un seul tas ; celui qui prend le dernier objet gagne. Combien de premiers coups sont gagnants ?",
   "solution": "Théorème de Bouton : une position est perdante pour le joueur au trait si et seulement si le ou exclusif des tailles vaut 0. Ici $3 \\oplus 4 \\oplus 5 = 011 \\oplus 100 \\oplus 101 = 010 = 2 \\ne 0$ : le premier joueur gagne.\nUn coup gagnant ramène le ou exclusif à 0 : pour un tas $t$, il faut le réduire à $t \\oplus 2$, ce qui n'est possible que si $t \\oplus 2 < t$. Tas 3 : $3 \\oplus 2 = 1 < 3$, oui (retirer 2). Tas 4 : 6, non. Tas 5 : 7, non. **Un seul** coup gagnant : retirer 2 objets du tas de 3.",
   "indice": "Écris les tailles en binaire et fais un « ou exclusif » colonne par colonne (somme de Nim).",
   "categorie": "strategie",
   "titre": "Jeu de Nim avec des tas de 3, 4 et 5",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "ct-pieces-en-rangee",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Un nombre pair de pièces de valeurs différentes sont alignées. À tour de rôle, chaque joueur prend une pièce à l'une des deux extrémités. Le premier joueur peut-il garantir d'obtenir au moins la moitié de la somme ?",
   "solution": "Oui. Numérote les positions de 1 à $2n$. Le premier joueur calcule la somme des positions impaires et des positions paires, et choisit la plus grande. S'il commence par la pièce 1 (impaire), les deux extrémités restantes sont paires : l'adversaire prend forcément une paire, et une impaire redevient disponible. Il prend ainsi **toutes** les pièces de la parité choisie, donc au moins la moitié.\nPour le maximum exact, il faut la programmation dynamique ($O(n^2)$).",
   "indice": "Colorie les positions en alternance. Le premier joueur peut-il forcer l'adversaire à ne prendre que des pièces d'une seule couleur ?",
   "categorie": "strategie",
   "titre": "Pièces en rangée, on prend à un bout"
  },
  {
   "id": "ct-table-ronde",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Deux joueurs posent à tour de rôle une pièce (toutes identiques) sur une table ronde, sans chevauchement. Celui qui ne peut plus poser perd. Qui gagne ?",
   "solution": "Le **premier** joueur gagne : il pose sa première pièce exactement au centre, puis répond à chaque pièce adverse par la pièce symétrique par rapport au centre. Cette place est toujours libre (la configuration reste symétrique), donc il a toujours un coup.",
   "indice": "Symétrie centrale.",
   "categorie": "strategie",
   "titre": "Poser des pièces sur une table ronde"
  },
  {
   "id": "ct-duel-trois",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Trois tireurs à tour de rôle : A touche avec probabilité $1/3$, B avec $2/3$, C ne rate jamais. Ordre : A, B, C, A, B, … ; chacun tire sur qui il veut, et le dernier survivant gagne. A tire en premier : sur qui doit-il viser ?",
   "solution": "- Si A tue C, B tire sur A avec $2/3$ de réussite : mauvais pour A.\n- Si A tue B, C tue A à coup sûr.\n- Si A **tire en l'air**, B et C se visent (chacun est la menace de l'autre). Le survivant fait face à A, qui tire en premier.\nA doit donc **tirer en l'air** : être le plus faible le protège tant que les deux forts s'affrontent.",
   "indice": "Que se passe-t-il si A tue C ? S'il tue B ? Et s'il tire en l'air ?",
   "categorie": "strategie",
   "titre": "Duel à trois (truel)"
  },
  {
   "id": "ct-chocolat",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On veut séparer une tablette de $6 \\times 8$ carrés en carrés individuels. Chaque cassure coupe un seul morceau en deux le long d'une ligne. Combien de cassures au minimum ?",
   "solution": "Chaque cassure augmente le nombre de morceaux d'exactement 1. On passe de 1 à 48 morceaux : **47 cassures**, quelle que soit la méthode. Conséquence : un jeu où l'on casse à tour de rôle (le dernier à casser gagne) est décidé d'avance par la parité.",
   "indice": "Combien de morceaux de plus après chaque cassure ?",
   "categorie": "strategie",
   "titre": "Casser une tablette de chocolat $6 \\times 8$",
   "reponse": "47",
   "valeur": 47.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ct-somme-quinze",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Les nombres 1 à 9 sont sur la table. À tour de rôle, chaque joueur en prend un. Le premier qui possède trois nombres de somme 15 gagne. Qui gagne avec un jeu parfait, et comment réfléchir vite ?",
   "solution": "Dans le carré magique 2 7 6 / 9 5 1 / 4 3 8, les triplets de somme 15 sont exactement les 8 lignes, colonnes et diagonales. Le jeu **est** un morpion : avec un jeu parfait, c'est **match nul**. Prendre 5 (le centre) en premier est le coup le plus fort.\nLeçon d'entretien : reconnaître un problème connu sous un déguisement (isomorphisme).",
   "indice": "Range 1 à 9 dans un carré magique.",
   "categorie": "strategie",
   "titre": "Atteindre 15 avec trois nombres (morpion déguisé)"
  },
  {
   "id": "ct-martingale-doublement",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "À la roulette (rouge ou noir, probabilité $18/37$), tu mises 1 € et doubles ta mise après chaque perte, jusqu'à gagner : tu gagnes alors 1 € net. Est-ce une stratégie gagnante ?",
   "solution": "Non. Avec un capital fini, une suite de pertes suffisamment longue ruine le joueur : on gagne souvent 1 € et on perd rarement une somme énorme. L'espérance de chaque mise est négative ($18/37 - 19/37 = -1/37$ par euro), donc celle de toute stratégie à mises bornées l'est aussi (théorème d'arrêt des martingales : on ne transforme pas un jeu défavorable en jeu favorable en choisissant ses mises).\nMême avec un jeu équitable, l'espérance reste nulle : le gain quasi sûr de 1 € est compensé par une perte rare mais énorme.",
   "indice": "Le capital est fini. Quelle est l'espérance de chaque pari ?",
   "categorie": "strategie",
   "titre": "Doubler la mise après chaque perte"
  },
  {
   "id": "ct-rois-non-attaquants-cavaliers",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de cavaliers au maximum peut-on placer sur un échiquier $8 \\times 8$ sans que deux d'entre eux s'attaquent ?",
   "solution": "**32** : on place un cavalier sur chaque case blanche ; un cavalier n'attaque que des cases de l'autre couleur.\nOn ne peut pas faire mieux : chaque rectangle $2 \\times 4$ se découpe en 4 paires de cases qui s'attaquent mutuellement (un « circuit » du cavalier), donc il contient au plus 4 cavaliers ; 8 rectangles donnent au plus 32.",
   "indice": "Un cavalier change toujours de couleur de case. Pour la borne supérieure, découpe l'échiquier en rectangles $2 \\times 4$.",
   "categorie": "denombrement",
   "titre": "Cavaliers non attaquants",
   "reponse": "32",
   "valeur": 32.0,
   "tolerance": 0.0,
   "parent": "ct-rois-non-attaquants"
  },
  {
   "id": "ct-rois-non-attaquants-dames",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On sait qu'on peut placer au plus 8 dames sur un échiquier sans qu'elles s'attaquent (une par ligne). Combien y a-t-il de façons de placer ces 8 dames ?",
   "solution": "Retour sur trace : on place une dame ligne par ligne, en mémorisant les colonnes et les deux familles de diagonales ($i + j$ et $i - j$) occupées, et l'on revient en arrière en cas d'impasse. On trouve **92** solutions (12 à symétrie près).\nEn entretien, on attend surtout l'algorithme et ses structures (trois ensembles, ou trois masques de bits), pas le nombre par cœur.",
   "indice": "Pas de formule : décris un algorithme de retour sur trace (une dame par ligne, colonnes et diagonales libres).",
   "categorie": "denombrement",
   "titre": "Les huit dames",
   "reponse": "92",
   "valeur": 92.0,
   "tolerance": 0.0,
   "parent": "ct-rois-non-attaquants"
  },
  {
   "id": "ct-carres-echiquier-rectangles",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de rectangles (carrés compris, de toutes tailles) contient un échiquier $8 \\times 8$ ?",
   "solution": "La grille a 9 lignes verticales et 9 horizontales : $\\binom{9}{2} \\times \\binom{9}{2} = 36 \\times 36 =$ **1 296**. Le piège : compter les cases (64) ou les carrés (204).",
   "indice": "Un rectangle est déterminé par ses deux côtés verticaux et ses deux côtés horizontaux, choisis parmi les lignes de la grille.",
   "categorie": "denombrement",
   "titre": "Les rectangles d'un échiquier",
   "reponse": "1296",
   "valeur": 1296.0,
   "tolerance": 0.0,
   "parent": "ct-carres-echiquier"
  },
  {
   "id": "ct-carres-echiquier-grille",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de carrés (de toutes tailles) contient une grille $10 \\times 10$ ?",
   "solution": "$$\\sum_{k=1}^{10} k^2 = \\frac{10 \\times 11 \\times 21}{6} = 385.$$\nEn général $\\frac{n(n + 1)(2n + 1)}{6}$ carrés et $\\binom{n+1}{2}^2$ rectangles.",
   "indice": "Un carré de côté $k$ se place de $(n + 1 - k)^2$ façons.",
   "categorie": "denombrement",
   "titre": "Les carrés d'une grille $10 \\times 10$",
   "reponse": "385",
   "valeur": 385.0,
   "tolerance": 0.0,
   "parent": "ct-carres-echiquier"
  },
  {
   "id": "ct-poignees-diagonales",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de diagonales a un décagone convexe (10 côtés) ?",
   "solution": "Paires de sommets moins les côtés : $\\binom{10}{2} - 10 = 45 - 10 =$ **35**. En général $\\frac{n(n - 3)}{2}$ : chaque sommet a $n - 3$ diagonales, et chacune est comptée deux fois.",
   "indice": "Une diagonale relie deux sommets non voisins.",
   "categorie": "denombrement",
   "titre": "Les diagonales d'un décagone",
   "reponse": "35",
   "valeur": 35.0,
   "tolerance": 0.0,
   "parent": "ct-poignees"
  },
  {
   "id": "ct-poignees-championnat",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un championnat réunit 20 équipes ; chacune rencontre chaque autre deux fois (à domicile et à l'extérieur). Combien de matchs au total ?",
   "solution": "Couples ordonnés d'équipes distinctes : $20 \\times 19 =$ **380**, soit deux fois les 190 poignées de main.",
   "indice": "Ici l'ordre compte : (A reçoit B) et (B reçoit A) sont deux matchs différents.",
   "categorie": "denombrement",
   "titre": "Un championnat aller-retour",
   "reponse": "380",
   "valeur": 380.0,
   "tolerance": 0.0,
   "parent": "ct-poignees"
  },
  {
   "id": "ct-chiffre-un-sept",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de fois écrit-on le chiffre 7 en écrivant tous les nombres de 1 à 100 ?",
   "solution": "Unités : 7, 17, …, 97 → 10. Dizaines : 70 à 79 → 10. Total **20** (77 compte deux fois, une fois dans chaque groupe, et c'est correct : il contient deux chiffres 7). Contrairement au chiffre 1, il n'y a pas de bonus dû à 100.",
   "indice": "Compte séparément les unités et les dizaines ; attention à 77.",
   "categorie": "denombrement",
   "titre": "Le chiffre 7 de 1 à 100",
   "reponse": "20",
   "valeur": 20.0,
   "tolerance": 0.0,
   "parent": "ct-chiffre-un"
  },
  {
   "id": "ct-chiffre-un-mille",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de fois écrit-on le chiffre 1 en écrivant tous les nombres de 1 à 1 000 ?",
   "solution": "De 000 à 999 : 1 000 nombres, chaque position vaut 1 dans un dixième des cas, soit $100$ par position et $300$ au total. On ajoute le 1 de 1 000 : **301**.",
   "indice": "De 000 à 999 (sur trois chiffres), chaque position contient chaque chiffre autant de fois.",
   "categorie": "denombrement",
   "titre": "Le chiffre 1 de 1 à 1 000",
   "reponse": "301",
   "valeur": 301.0,
   "tolerance": 0.0,
   "parent": "ct-chiffre-un"
  },
  {
   "id": "ct-anagrammes-bridge",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de mains différentes de 13 cartes peut-on recevoir dans un jeu de 52 cartes ? Donne l'ordre de grandeur, puis la valeur.",
   "solution": "$\\binom{52}{13} = 635\\,013\\,559\\,600 \\approx 6{,}35 \\times 10^{11}$, environ 635 milliards : chaque main précise a une chance sur 635 milliards de sortir.",
   "indice": "L'ordre des cartes dans la main ne compte pas.",
   "categorie": "denombrement",
   "titre": "Le nombre de mains de bridge",
   "reponse": "635013559600",
   "valeur": 635013559600.0,
   "tolerance": 0.005,
   "parent": "ct-anagrammes"
  },
  {
   "id": "ct-dominos-escalier-binaire",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de sous-ensembles de $\\{1, 2, \\dots, 10\\}$ (ensemble vide compris) ne contiennent jamais deux entiers consécutifs ?",
   "solution": "Soit $s_n$ le nombre pour $\\{1, \\dots, n\\}$. Sans $n$ : $s_{n-1}$ ; avec $n$ : $s_{n-2}$. Donc $s_n = s_{n-1} + s_{n-2}$, $s_1 = 2$, $s_2 = 3$ : $2, 3, 5, 8, 13, 21, 34, 55, 89, 144$. Réponse : **144** $= F_{12}$.\nMême nombre de mots binaires de longueur 10 sans deux 1 consécutifs (bijection évidente), et même récurrence que les dominos ou l'escalier.",
   "indice": "Conditionne sur la présence de 10 : s'il est pris, 9 est exclu.",
   "categorie": "denombrement",
   "titre": "Sous-ensembles sans deux entiers consécutifs",
   "reponse": "144",
   "valeur": 144.0,
   "tolerance": 0.0,
   "parent": "ct-dominos-escalier",
   "voir": [
    "algo-escalier"
   ]
  },
  {
   "id": "ct-regions-cercle-pizza",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Combien de parts au maximum obtient-on en coupant une pizza (un disque) par 7 coupes droites ?",
   "solution": "La $k$-ième droite est coupée en au plus $k$ segments par les précédentes, et chaque segment sépare une région en deux : elle ajoute au plus $k$ parts. $1 + (1 + 2 + \\dots + 7) = 1 + 28 =$ **29**. Formule du « traiteur paresseux » : $1 + n + \\binom{n}{2}$.\nÀ distinguer des cordes entre points du cercle, où l'on n'a pas le choix des croisements.",
   "indice": "La $k$-ième coupe croise au plus les $k - 1$ précédentes, donc traverse au plus $k$ régions.",
   "categorie": "denombrement",
   "titre": "La pizza coupée par 7 droites",
   "reponse": "29",
   "valeur": 29.0,
   "tolerance": 0.0,
   "parent": "ct-regions-cercle"
  },
  {
   "id": "ct-regions-cercle-gateau",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Combien de morceaux au maximum obtient-on en coupant un gâteau (un volume convexe) par 5 coupes planes ?",
   "solution": "La $k$-ième coupe ajoute autant de morceaux que de régions dans le plan découpé par $k - 1$ droites : $1 + (k - 1) + \\binom{k-1}{2}$. En sommant : $\\binom{n}{0} + \\binom{n}{1} + \\binom{n}{2} + \\binom{n}{3}$. Pour $n = 5$ : $1 + 5 + 10 + 10 =$ **26** (nombres du gâteau : 1, 2, 4, 8, 15, 26).",
   "indice": "La $k$-ième coupe plane est découpée par les précédentes comme une pizza par $k - 1$ droites.",
   "categorie": "denombrement",
   "titre": "Le gâteau coupé par 5 plans",
   "reponse": "26",
   "valeur": 26.0,
   "tolerance": 0.0,
   "parent": "ct-regions-cercle"
  },
  {
   "id": "ct-chiffres-impairs-palindromes",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien y a-t-il de nombres palindromes à trois chiffres (comme 141 ou 707) ?",
   "solution": "Premier chiffre : 1 à 9 (9 choix) ; chiffre du milieu : 0 à 9 (10 choix) ; le dernier est imposé. $9 \\times 10 =$ **90**.",
   "indice": "Le dernier chiffre est imposé par le premier.",
   "categorie": "denombrement",
   "titre": "Les palindromes à trois chiffres",
   "reponse": "90",
   "valeur": 90.0,
   "tolerance": 0.0,
   "parent": "ct-chiffres-impairs"
  },
  {
   "id": "ct-chiffres-impairs-distincts",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien d'entiers à 4 chiffres ont leurs 4 chiffres tous distincts ?",
   "solution": "$9$ choix pour le premier (1 à 9), puis $9$ (le 0 redevient possible), $8$, $7$ : $9 \\times 9 \\times 8 \\times 7 =$ **4 536**. Le piège : $10 \\times 9 \\times 8 \\times 7$ ou $9 \\times 8 \\times 7 \\times 6$.",
   "indice": "Le premier chiffre ne peut pas être 0, les suivants si.",
   "categorie": "denombrement",
   "titre": "Entiers à 4 chiffres tous distincts",
   "reponse": "4536",
   "valeur": 4536.0,
   "tolerance": 0.0,
   "parent": "ct-chiffres-impairs"
  },
  {
   "id": "ct-etoiles-barres-positifs",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de triplets d'entiers $x, y, z \\ge 1$ vérifient $x + y + z = 10$ ?",
   "solution": "Avec $x' + y' + z' = 7$ en entiers $\\ge 0$ : $\\binom{9}{2} = 36$. Directement : on choisit 2 des 9 espaces entre 10 étoiles, $\\binom{9}{2} =$ **36**. C'est aussi le nombre de façons de répartir 10 bonbons identiques entre 3 enfants qui en reçoivent chacun au moins un.",
   "indice": "Pose $x' = x - 1$, etc., pour revenir à des entiers positifs ou nuls ; ou place les barres entre les étoiles.",
   "categorie": "denombrement",
   "titre": "Étoiles et barres, entiers strictement positifs",
   "reponse": "36",
   "valeur": 36.0,
   "tolerance": 0.0,
   "parent": "ct-etoiles-barres"
  },
  {
   "id": "ct-bracelets-colliers",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Combien de colliers différents de 6 perles noires ou blanches, si deux colliers sont identiques lorsqu'ils se déduisent par **rotation** (on ne peut pas les retourner) ?",
   "solution": "Coloriages fixés par les rotations de 0 à 5 crans : $2^6, 2, 2^2, 2^3, 2^2, 2$, soit $64 + 2 + 4 + 8 + 4 + 2 = 84$. Moyenne sur 6 rotations : $84/6 =$ **14**, un de plus que les 13 bracelets : seule la paire 001011 et 001101 (miroirs l'une de l'autre) se distingue sans retournement.",
   "indice": "Lemme de Burnside avec le groupe des 6 rotations seulement.",
   "categorie": "denombrement",
   "titre": "Colliers à 6 perles, rotations seulement",
   "reponse": "14",
   "valeur": 14.0,
   "tolerance": 0.0,
   "parent": "ct-bracelets"
  },
  {
   "id": "ct-cube-peint-dix",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un cube $10 \\times 10 \\times 10$ est peint à l'extérieur puis découpé en 1 000 petits cubes. Combien de petits cubes n'ont aucune face peinte ?",
   "solution": "Le cœur non peint est un cube $8 \\times 8 \\times 8$ : **512**. Pour le reste : 8 coins (3 faces), $12 \\times 8 = 96$ cubes d'arête (2 faces), $6 \\times 64 = 384$ centres de face (1 face) ; vérification $8 + 96 + 384 + 512 = 1\\,000$.",
   "indice": "Les cubes intacts forment un cube intérieur.",
   "categorie": "denombrement",
   "titre": "Le cube $10 \\times 10 \\times 10$ peint",
   "reponse": "512",
   "valeur": 512.0,
   "tolerance": 0.0,
   "parent": "ct-cube-peint"
  },
  {
   "id": "ct-cube-peint-coupes",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On veut découper un cube de bois $3 \\times 3 \\times 3$ en 27 petits cubes par des coupes planes. On a le droit de réempiler les morceaux entre deux coupes. Combien de coupes au minimum ?",
   "solution": "Le cube central n'a aucune face à l'extérieur : ses 6 faces doivent toutes être créées par des coupes, et une coupe plane ne crée qu'une face de ce cube. Il faut donc **au moins 6** coupes, et les 6 coupes droites habituelles suffisent : le réempilement ne sert à rien.",
   "indice": "Regarde le petit cube central : combien de ses faces doivent être créées, et combien une coupe peut-elle en créer à la fois ?",
   "categorie": "denombrement",
   "titre": "Couper un cube en 27 avec le moins de coupes",
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.0,
   "parent": "ct-cube-peint"
  },
  {
   "id": "ct-points-antipodaux-moine",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Un moine part du pied d'une montagne à 7 h, monte par un unique sentier à son rythme (avec des pauses) et arrive au sommet à 19 h. Le lendemain, il repart du sommet à 7 h et redescend par le même sentier, arrivant à 19 h. Montre qu'il existe un point du sentier où il passe à la même heure les deux jours.",
   "solution": "Superpose les deux journées : un moine monte pendant qu'un autre descend, le même jour, sur le même sentier. Ils partent des deux extrémités et finissent aux extrémités opposées : ils se croisent forcément. Le point et l'heure de la rencontre conviennent.\nVersion analytique : $g(t) = \\text{montée}(t) - \\text{descente}(t)$ est continue, négative à 7 h, positive à 19 h : elle s'annule (valeurs intermédiaires). Même argument que les points antipodaux.",
   "indice": "Imagine deux moines, l'un qui monte et l'autre qui descend, le même jour.",
   "categorie": "geometrie",
   "titre": "Le moine qui monte et redescend",
   "parent": "ct-points-antipodaux"
  },
  {
   "id": "ct-points-antipodaux-borsuk",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "On suppose la température et la pression continues à la surface de la Terre (une sphère). Existe-t-il deux points antipodaux ayant **à la fois** la même température et la même pression ?",
   "solution": "**Oui**, par le théorème de Borsuk-Ulam : toute application continue $f$ de la sphère $S^2$ dans $\\mathbb{R}^2$ envoie au moins une paire de points antipodaux sur la même valeur ($f(x) = f(-x)$). Avec $f = (\\text{température}, \\text{pression})$, c'est exactement l'énoncé.\nLe cas de l'équateur en est la version en dimension 1 : $S^1 \\to \\mathbb{R}$. On ne démontre pas Borsuk-Ulam en entretien ; on attend de reconnaître la structure et de citer le bon théorème.",
   "indice": "Le cas d'une seule grandeur sur un cercle se fait par les valeurs intermédiaires. En dimension 2, il faut un théorème plus fort.",
   "categorie": "geometrie",
   "titre": "Température et pression aux antipodes",
   "parent": "ct-points-antipodaux"
  },
  {
   "id": "ct-fourmi-cube-pave",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une fourmi marche à la surface d'un pavé de dimensions $1 \\times 2 \\times 3$, d'un sommet au sommet opposé. Quelle est la longueur du plus court chemin ?",
   "solution": "En dépliant deux faces adjacentes, on obtient un rectangle dont la diagonale vaut $\\sqrt{(a + b)^2 + c^2}$, où $c$ est la dimension non additionnée :\n- $\\sqrt{(1 + 2)^2 + 3^2} = \\sqrt{18} \\approx 4{,}243$ ;\n- $\\sqrt{(1 + 3)^2 + 2^2} = \\sqrt{20}$ ;\n- $\\sqrt{(2 + 3)^2 + 1^2} = \\sqrt{26}$.\nLe plus court laisse seule la **plus grande** dimension : $\\sqrt{18} = 3\\sqrt 2 \\approx$ **4,243**.",
   "indice": "Il y a trois dépliages possibles (selon l'arête traversée). Compare-les.",
   "categorie": "geometrie",
   "titre": "La fourmi sur un pavé $1 \\times 2 \\times 3$",
   "reponse": "sqrt(18)",
   "valeur": 4.242640687119285,
   "tolerance": 0.005,
   "parent": "ct-fourmi-cube"
  },
  {
   "id": "ct-fourmi-cube-dudeney",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une pièce mesure $30 \\times 12 \\times 12$ (longueur, largeur, hauteur). Une araignée est au milieu d'un des petits murs, à 1 du plafond ; une mouche est au milieu du mur opposé, à 1 du sol. L'araignée marche sur les murs, le sol et le plafond. Quelle est la longueur du plus court chemin jusqu'à la mouche ?",
   "solution": "Chemin direct : $1 + 30 + 11 = 42$. Mais un dépliage qui traverse **cinq** faces (le mur de départ, le plafond, un grand mur latéral, le sol, le mur d'arrivée) met les deux points aux sommets d'un triangle rectangle de côtés 24 et 32 :\n$$\\sqrt{24^2 + 32^2} = 40.$$\nRéponse : **40**. Leçon : sur un polyèdre, le plus court chemin peut traverser des faces « inutiles » ; il faut comparer les dépliages, pas se fier au trajet le plus naturel.",
   "indice": "Le chemin évident (monter de 1, traverser le plafond, descendre de 11) mesure 42. Essaie des dépliages qui passent par davantage de faces.",
   "categorie": "geometrie",
   "titre": "L'araignée et la mouche de Dudeney",
   "reponse": "40",
   "valeur": 40.0,
   "tolerance": 0.0,
   "parent": "ct-fourmi-cube"
  },
  {
   "id": "ct-piece-roule-rayon",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une pièce de rayon $r$ roule sans glisser autour d'une pièce fixe de rayon $3r$, jusqu'à revenir à son point de départ. Combien de tours fait-elle sur elle-même ?",
   "solution": "Le centre parcourt $2\\pi(3r + r) = 8\\pi r$ ; la rotation propre vaut cette distance divisée par $r$ : $8\\pi$, soit **4 tours**. En général $1 + R/r$ tours autour, et $R/r - 1$ tours si la pièce roule à l'intérieur d'un anneau de rayon $R$ (le « un tour de plus » devient un tour de moins).",
   "indice": "Le centre de la pièce mobile parcourt un cercle de rayon $R + r$.",
   "categorie": "geometrie",
   "titre": "Une pièce autour d'une pièce trois fois plus grande",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.0,
   "parent": "ct-piece-roule"
  },
  {
   "id": "ct-angle-horloge-trois-vingt-cinq",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel angle (en degrés) forment les aiguilles d'une horloge à 3 h 25 ?",
   "solution": "Minutes : $25 \\times 6° = 150°$. Heures : $3 \\times 30° + 25 \\times 0{,}5° = 102{,}5°$. Angle : $150 - 102{,}5 =$ **47,5°**.",
   "indice": "L'aiguille des heures avance de $0{,}5°$ par minute.",
   "categorie": "mouvement",
   "titre": "L'angle des aiguilles à 3 h 25",
   "reponse": "47.5",
   "valeur": 47.5,
   "tolerance": 0.005,
   "parent": "ct-angle-horloge"
  },
  {
   "id": "ct-angle-horloge-formule",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel angle (le plus petit des deux, en degrés) forment les aiguilles à 9 h 30 ? Donne aussi une formule pour $h$ heures et $m$ minutes.",
   "solution": "$|30 \\times 9 - 5{,}5 \\times 30| = |270 - 165| =$ **105°**. La formule vient de : heures à $30h + 0{,}5m$ degrés, minutes à $6m$ degrés, différence $30h - 5{,}5m$. Le piège : répondre 90° en oubliant que l'aiguille des heures est à mi-chemin entre 9 et 10.",
   "indice": "Formule : $|30h - 5{,}5m|$, puis prendre le complément à 360° si l'on dépasse 180°.",
   "categorie": "mouvement",
   "titre": "L'angle à 9 h 30 et la formule générale",
   "reponse": "105",
   "valeur": 105.0,
   "tolerance": 0.005,
   "parent": "ct-angle-horloge"
  },
  {
   "id": "ct-superpositions-angle-droit",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de fois par jour (24 heures) les aiguilles des heures et des minutes forment-elles un angle droit ?",
   "solution": "L'écart entre les aiguilles parcourt 360° entre deux superpositions, en passant une fois par 90° et une fois par 270° : deux angles droits par « rattrapage ». 22 rattrapages par jour : **44** angles droits, et non 48 (deux par heure) : l'aiguille des heures avance pendant ce temps.",
   "indice": "Entre deux superpositions, combien de fois l'écart passe-t-il par 90° ?",
   "categorie": "mouvement",
   "titre": "Les angles droits des aiguilles",
   "reponse": "44",
   "valeur": 44.0,
   "tolerance": 0.0,
   "parent": "ct-superpositions"
  },
  {
   "id": "ct-superpositions-cinq-heures",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "À quelle heure exacte (en minutes après 5 h) les aiguilles se superposent-elles pour la première fois après 5 h ?",
   "solution": "$150 / 5{,}5 = 300/11 \\approx 27{,}27$ minutes, soit 5 h 27 min 16 s. Réponse : **$300/11$ minutes** après 5 h. Contrôle : les superpositions ont lieu toutes les $12/11$ h, et $5 \\times 12/11 = 60/11$ h $= 5$ h $27{,}27$ min.",
   "indice": "À 5 h, l'aiguille des heures a 150° d'avance ; celle des minutes gagne $5{,}5°$ par minute.",
   "categorie": "mouvement",
   "titre": "La première superposition après 5 h",
   "reponse": "300/11",
   "valeur": 27.272727272727273,
   "tolerance": 0.005,
   "parent": "ct-superpositions"
  },
  {
   "id": "ct-vitesse-moyenne-impossible",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Une voiture fait un premier tour de circuit à 30 km/h. À quelle vitesse doit-elle faire le second tour pour obtenir une moyenne de 60 km/h sur les deux tours ?",
   "solution": "C'est **impossible**. Pour un tour de longueur $d$, deux tours à 60 km/h de moyenne prennent $2d/60 = d/30$. Or le premier tour à 30 km/h a déjà pris $d/30$ : il ne reste aucun temps, même à vitesse infinie.\nLa vitesse moyenne est une moyenne **harmonique** des vitesses, pondérée par les distances : les tours lents pèsent plus.",
   "indice": "Combien de temps faut-il pour faire deux tours à 60 km/h de moyenne ? Combien en a-t-on déjà dépensé ?",
   "categorie": "mouvement",
   "titre": "Le second tour à vitesse infinie",
   "parent": "ct-vitesse-moyenne"
  },
  {
   "id": "ct-vitesse-moyenne-vent",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Un avion vole à vitesse $v$ par rapport à l'air. Il fait un aller-retour de $d$ dans chaque sens, avec un vent constant de vitesse $w < v$ dans l'axe du trajet. Le vent rend-il l'aller-retour plus court, plus long, ou ne change-t-il rien ?",
   "solution": "Durée : $\\frac{d}{v + w} + \\frac{d}{v - w} = \\frac{2dv}{v^2 - w^2} > \\frac{2d}{v}$. L'aller-retour est **plus long**. Intuition : on passe plus de temps à vent contraire (lent) qu'à vent arrière (rapide), donc le vent nuit plus qu'il n'aide.",
   "indice": "Calcule la durée totale et compare-la à $2d/v$.",
   "categorie": "mouvement",
   "titre": "L'aller-retour en avion avec du vent",
   "parent": "ct-vitesse-moyenne"
  },
  {
   "id": "ct-escargot-dix",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un escargot au fond d'un puits de 10 m monte de 3 m le jour et glisse de 2 m la nuit. Quel jour sort-il ?",
   "solution": "Il doit commencer une journée à au moins 7 m, ce qui arrive au matin du jour 8 (après 7 jours et nuits, il est à 7 m). Il sort pendant le **jour 8**. Le piège : répondre 10 (10 m à 1 m net par jour).",
   "indice": "Le dernier jour, il ne glisse pas.",
   "categorie": "mouvement",
   "titre": "L'escargot dans un puits de 10 m",
   "reponse": "8",
   "valeur": 8.0,
   "tolerance": 0.0,
   "parent": "ct-escargot"
  },
  {
   "id": "ct-nenuphars-deux",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un nénuphar double de surface chaque jour et, planté seul, couvre l'étang le 48ᵉ jour. Si l'on plante deux nénuphars au lieu d'un, quel jour l'étang est-il couvert ?",
   "solution": "Partir de deux plants revient à prendre un jour d'avance : l'étang est couvert le **47ᵉ jour**, pas le 24ᵉ. La croissance exponentielle rend le doublement du point de départ équivalent à un seul jour gagné.",
   "indice": "Deux plants le jour 1, c'est la surface d'un seul plant le jour 2.",
   "categorie": "mouvement",
   "titre": "Les nénuphars partant de deux plants",
   "reponse": "47",
   "valeur": 47.0,
   "tolerance": 0.0,
   "parent": "ct-nenuphars"
  },
  {
   "id": "ct-chapeau-riviere-courant",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Même rameur : son chapeau tombe, il s'en aperçoit 10 minutes plus tard, fait demi-tour, et le rattrape 1 km en aval du point où il est tombé. Quelle est la vitesse du courant (en km/h) ?",
   "solution": "Dans le référentiel de l'eau, le rameur s'éloigne 10 minutes et revient en 10 minutes : le chapeau a dérivé **20 minutes** pour parcourir 1 km. Courant : $1 / (20/60) =$ **3 km/h**.",
   "indice": "Combien de temps le chapeau a-t-il dérivé au total ?",
   "categorie": "mouvement",
   "titre": "Le chapeau retrouvé 1 km en aval",
   "reponse": "3",
   "valeur": 3.0,
   "tolerance": 0.0,
   "parent": "ct-chapeau-riviere"
  },
  {
   "id": "ct-train-mouche-chien",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un promeneur est à 2 km de sa maison et rentre à 5 km/h. Son chien court à 15 km/h : il va jusqu'à la maison, revient vers le maître, repart, et ainsi de suite jusqu'à ce que le maître arrive. Quelle distance parcourt le chien (en km) ?",
   "solution": "Le maître met $2/5$ h $= 24$ minutes à rentrer ; le chien court pendant tout ce temps : $15 \\times 0{,}4 =$ **6 km**. Même principe que la mouche : distance $=$ vitesse $\\times$ durée.",
   "indice": "Ne somme pas les allers-retours : combien de temps le chien court-il ?",
   "categorie": "mouvement",
   "titre": "Le chien entre son maître et la maison",
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.0,
   "parent": "ct-train-mouche"
  },
  {
   "id": "ct-echiquier-dominos-gomory",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "On retire d'un échiquier $8 \\times 8$ deux cases de couleurs **différentes**, n'importe où. Peut-on toujours paver les 62 cases restantes avec 31 dominos ?",
   "solution": "**Oui, toujours** (théorème de Gomory). On trace un circuit fermé qui visite les 64 cases une fois chacune par des pas entre cases voisines (un serpentin refermé) ; les couleurs y alternent. Retirer deux cases de couleurs différentes coupe le circuit en deux chemins, chacun de longueur **paire** (les deux extrémités retirées sont de couleurs différentes). Chaque chemin de longueur paire se pave en suivant le circuit, deux cases par domino.\nL'invariant de couleur était donc la **seule** obstruction : ici la condition nécessaire est aussi suffisante.",
   "indice": "Trouve un circuit qui passe par les 64 cases en allant chaque fois d'une case à une case voisine.",
   "categorie": "invariants",
   "titre": "Retirer deux cases de couleurs différentes",
   "parent": "ct-echiquier-dominos"
  },
  {
   "id": "ct-echiquier-dominos-barres",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Peut-on paver un carré $10 \\times 10$ avec 25 barres $1 \\times 4$ (horizontales ou verticales) ?",
   "solution": "**Non.** Avec la couleur $(i + j) \\bmod 4$, une barre de 4 cases alignées couvre exactement une case de chaque couleur, quelle que soit son orientation : 25 barres couvriraient 25 cases de chaque couleur.\nOr le $10 \\times 10$ en contient 25, 26, 25 et 24 (couleurs 0, 1, 2, 3) : impossible. Le coloriage en deux couleurs ne suffisait pas (50 et 50) : il faut adapter le nombre de couleurs à la taille des pièces.",
   "indice": "Colorie la case $(i, j)$ avec la couleur $(i + j) \\bmod 4$ : combien de cases de chaque couleur une barre couvre-t-elle ?",
   "categorie": "invariants",
   "titre": "Paver $10 \\times 10$ avec des barres $1 \\times 4$",
   "parent": "ct-echiquier-dominos"
  },
  {
   "id": "ct-echiquier-dominos-triminos",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "On retire une case d'une grille $5 \\times 5$ et l'on veut paver les 24 cases restantes avec 8 triminos droits $1 \\times 3$. Quelles cases peut-on retirer ?",
   "solution": "Seulement la **case centrale**.\n- Coloriage $(i + j) \\bmod 3$ (lignes et colonnes numérotées de 0 à 4) : 8, 9 et 8 cases des couleurs 0, 1 et 2. Les 8 triminos couvrent 8 cases de chaque couleur : la case retirée doit être de couleur 1.\n- Coloriage $(i - j) \\bmod 3$ : 9 cases de couleur 0 et 8 des autres : la case retirée doit être de couleur 0.\n- $i + j \\equiv 1$ et $i \\equiv j \\pmod 3$ donnent $2i \\equiv 1$, soit $i \\equiv j \\equiv 2$ : seule la case $(2, 2)$, le centre.\nEt le centre convient : la grille privée de son centre se découpe en quatre rectangles $2 \\times 3$ disposés en moulinet autour de lui, chacun pavé par deux triminos.",
   "indice": "Colorie selon $(i + j) \\bmod 3$, puis selon $(i - j) \\bmod 3$ : un trimino couvre une case de chaque couleur dans les deux coloriages.",
   "categorie": "invariants",
   "titre": "Un $5 \\times 5$ troué, des triminos droits",
   "parent": "ct-echiquier-dominos"
  },
  {
   "id": "ct-cameleons-possible",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Même règle des caméléons (deux de couleurs différentes se rencontrent et prennent tous deux la troisième couleur), avec 13 gris, 15 bruns et 16 pourpres. Peuvent-ils devenir tous de la même couleur ? Si oui, combien de caméléons auront alors cette couleur ?",
   "solution": "$16 - 13 = 3$ : les gris et les pourpres peuvent être annulés ensemble. Une rencontre gris-brun donne $(12, 14, 18)$ ; puis 12 rencontres gris-pourpre (chacune : $-1$ gris, $-1$ pourpre, $+2$ bruns) donnent $(0, 38, 6)$. Il reste à vider les pourpres par cycles « une rencontre brun-pourpre, puis deux gris-pourpre », qui retirent 3 pourpres : $(0, 41, 3)$ puis $(0, 44, 0)$. Tous deviennent bruns : **44**.\nL'invariant modulo 3 dit **ce qui est impossible** ; pour prouver que c'est possible, il faut exhiber une suite de rencontres.",
   "indice": "Cherche deux effectifs dont la différence est un multiple de 3 : ce sont eux qu'il faut pouvoir annuler ensemble.",
   "categorie": "invariants",
   "titre": "Les caméléons 13, 15, 16",
   "reponse": "44",
   "valeur": 44.0,
   "tolerance": 0.0,
   "parent": "ct-cameleons"
  },
  {
   "id": "ct-tableau-effacer-produit",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Les nombres 1, 2, …, 10 sont au tableau. À chaque étape, on efface $a$ et $b$ et l'on écrit $a + b + ab$. Que vaut le dernier nombre ?",
   "solution": "La quantité $\\prod (1 + x_i)$ ne change pas : $(1 + a)(1 + b)$ est remplacé par $1 + (a + b + ab)$, la même valeur. Au départ, $\\prod_{k=1}^{10}(1 + k) = 11!$. À la fin, il reste $x$ avec $1 + x = 11!$ : **$x = 11! - 1 = 39\\,916\\,799$**, quel que soit l'ordre des opérations.",
   "indice": "$a + b + ab = (1 + a)(1 + b) - 1$.",
   "categorie": "invariants",
   "titre": "On écrit $a + b + ab$",
   "reponse": "39916799",
   "valeur": 39916799.0,
   "tolerance": 0.0,
   "parent": "ct-tableau-effacer"
  },
  {
   "id": "ct-tableau-effacer-choix",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Les nombres 1 à 10 sont au tableau. À chaque étape, on efface $a$ et $b$ et l'on écrit, au choix, $a + b$ ou $|a - b|$. Peut-on finir avec 0 ?",
   "solution": "**Non.** $a + b$ et $|a - b|$ ont la même parité que $a + b$ : la parité de la somme est invariante quel que soit le choix. Elle vaut $55$, impaire : le dernier nombre est impair. Avec le choix, on peut atteindre tous les impairs de 1 à 55, mais jamais 0.",
   "indice": "Les deux opérations ont un point commun.",
   "categorie": "invariants",
   "titre": "On écrit $a + b$ ou $|a - b|$ au choix",
   "parent": "ct-tableau-effacer"
  },
  {
   "id": "ct-fourmis-rencontres",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Sur un bâton, 5 fourmis orientées vers la droite sont toutes à gauche de 5 fourmis orientées vers la gauche. Mêmes règles (demi-tour à chaque rencontre, chute aux extrémités). Combien de rencontres ont lieu en tout ?",
   "solution": "Avec l'argument des « fantômes » qui se traversent, chaque fourmi de droite croise chaque fourmi de gauche exactement une fois : $5 \\times 5 =$ **25** rencontres. En général, le nombre de rencontres est le nombre de paires (fourmi vers la droite, fourmi vers la gauche placée à sa droite).",
   "indice": "Une rencontre de deux fourmis qui font demi-tour ressemble à deux fourmis qui se traversent.",
   "categorie": "invariants",
   "titre": "Le nombre de rencontres des fourmis",
   "reponse": "25",
   "valeur": 25.0,
   "tolerance": 0.0,
   "parent": "ct-fourmis"
  },
  {
   "id": "ct-fourmis-triangle",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois fourmis sont aux sommets d'un triangle équilatéral. Chacune choisit au hasard l'un des deux côtés partant de son sommet et le parcourt à la même vitesse. Probabilité qu'au moins deux fourmis se rencontrent ?",
   "solution": "Aucune rencontre seulement si les trois tournent dans le même sens (toutes dans le sens horaire, ou toutes dans l'autre) : $2/8$. Probabilité de rencontre : $1 - 2/8 =$ **3/4**. Avec $n$ fourmis sur un polygone à $n$ sommets : $1 - 2/2^n$.",
   "indice": "Quand n'y a-t-il **aucune** rencontre ?",
   "categorie": "invariants",
   "titre": "Trois fourmis aux sommets d'un triangle",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "parent": "ct-fourmis"
  },
  {
   "id": "ct-boites-etiquettes-pommes",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois boîtes étiquetées « pommes », « oranges » et « mélange », toutes mal étiquetées. Cette fois, on t'impose de tirer ton premier fruit dans la boîte étiquetée « pommes ». Ce seul fruit suffit-il toujours à réétiqueter les trois boîtes ?",
   "solution": "**Non.** La boîte « pommes » contient soit des oranges, soit le mélange. Si tu tires une pomme, c'est le mélange, et tout se déduit. Mais si tu tires une **orange**, elle peut être la boîte d'oranges **ou** le mélange (qui contient aussi des oranges) : deux possibilités restent ouvertes.\nLa boîte « mélange » est la seule dont le contenu est forcément pur : c'est pour cela qu'un fruit y suffit. Leçon : choisir l'observation qui ne laisse qu'une issue par résultat.",
   "indice": "Envisage le cas où tu tires une orange : quelles boîtes la boîte « pommes » peut-elle encore être ?",
   "categorie": "logique",
   "titre": "Boîtes mal étiquetées : tirer dans la boîte « pommes »",
   "parent": "ct-boites-etiquettes"
  },
  {
   "id": "ct-interrupteurs-trois-ampoules",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois interrupteurs dans le couloir commandent chacun une des trois ampoules d'une pièce fermée. Tu n'entres qu'une fois dans la pièce. Comment associer chaque interrupteur à son ampoule ?",
   "solution": "Allume l'interrupteur 1 quelques minutes, éteins-le, allume le 2, entre.\n- L'ampoule **allumée** est commandée par le 2.\n- L'ampoule **éteinte et chaude** par le 1.\n- L'ampoule **éteinte et froide** par le 3.\nMême principe que pour une seule ampoule : la chaleur donne une deuxième information, d'où trois états distinguables.",
   "indice": "Chaque ampoule doit être dans un état différent quand tu entres : combien d'états distincts peux-tu créer ?",
   "categorie": "logique",
   "titre": "Trois interrupteurs, trois ampoules, une visite",
   "parent": "ct-interrupteurs"
  },
  {
   "id": "ct-interrupteurs-quatre",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Quatre interrupteurs commandent quatre ampoules d'une pièce que tu ne visites qu'une fois. Comment associer chaque interrupteur à son ampoule ?",
   "solution": "Allume 1 et 2 pendant dix minutes, éteins le 2, allume le 3, entre aussitôt.\n- Allumée et chaude : 1.\n- Éteinte et chaude : 2.\n- Allumée et froide : 3 (allumée depuis trop peu de temps pour chauffer).\n- Éteinte et froide : 4.\nAvec deux bits par ampoule on distingue $2^2 = 4$ interrupteurs : c'est un argument de comptage, comme pour les pesées.",
   "indice": "Deux informations binaires par ampoule (allumée ou non, chaude ou non) donnent $2 \\times 2 = 4$ états.",
   "categorie": "logique",
   "titre": "Quatre interrupteurs, quatre ampoules",
   "parent": "ct-interrupteurs"
  },
  {
   "id": "ct-deux-gardiens-un-seul",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Deux portes, l'une vers la liberté. Un seul gardien, dont tu ignores s'il ment toujours ou dit toujours la vérité. Une seule question fermée (oui ou non) : laquelle poser pour savoir si la porte de gauche est la bonne ?",
   "solution": "Demande : « Si je te demandais si la porte de gauche mène à la liberté, répondrais-tu oui ? »\n- Le sincère répond la vérité.\n- Le menteur ment sur ce qu'il répondrait, lequel serait déjà un mensonge : la double négation redonne la vérité.\nDans les deux cas, « oui » signifie que la gauche est la bonne porte.",
   "indice": "Fais passer la question deux fois par le gardien : deux mensonges s'annulent.",
   "categorie": "logique",
   "titre": "Un seul gardien, menteur ou non",
   "parent": "ct-deux-gardiens"
  },
  {
   "id": "ct-deux-gardiens-villages",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "À une bifurcation, une route mène au village des sincères, l'autre au village des menteurs. Un habitant de l'un des deux villages se trouve là (sincère ou menteur, tu l'ignores). Tu veux aller au village des sincères. Quelle question lui poser ?",
   "solution": "« Montre-moi la route de ton village. »\n- Un sincère montre la route de son village : celui des sincères.\n- Un menteur doit mentir sur la route de son village (celui des menteurs) : il montre l'autre, celle des sincères.\nDans les deux cas, on te désigne le village des sincères.",
   "indice": "Demande-lui une chose qui dépend de son identité, de sorte que le mensonge se retourne contre lui.",
   "categorie": "logique",
   "titre": "La bifurcation entre deux villages",
   "parent": "ct-deux-gardiens"
  },
  {
   "id": "ct-chevaliers-fripons-au-moins-un",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Sur l'île des chevaliers (toujours sincères) et des fripons (toujours menteurs), A dit : « Au moins l'un de nous deux est un fripon. » Que sont A et B ?",
   "solution": "Si A était un fripon, la phrase « au moins l'un de nous est un fripon » serait **vraie** : un fripon ne peut pas la dire. Donc A est un **chevalier**, sa phrase est vraie, et comme lui n'est pas fripon, **B est un fripon**.",
   "indice": "Si A était un fripon, sa phrase serait-elle vraie ou fausse ?",
   "categorie": "logique",
   "titre": "« Au moins l'un de nous est un fripon »",
   "parent": "ct-chevaliers-fripons"
  },
  {
   "id": "ct-chevaliers-fripons-meme-nature",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "A dit : « B et moi sommes de même nature. » Que peut-on dire de A et de B ?",
   "solution": "- A chevalier : la phrase est vraie, B est chevalier.\n- A fripon : la phrase est fausse, B est de nature différente : chevalier.\nDans les deux cas **B est un chevalier**, et la nature de A reste **indéterminée**. C'est le schéma de « double négation » des gardiens : on apprend une chose sur l'autre, rien sur celui qui parle.",
   "indice": "Traite les deux cas pour A.",
   "categorie": "logique",
   "titre": "« B et moi sommes de même nature »",
   "parent": "ct-chevaliers-fripons"
  },
  {
   "id": "ct-chevaliers-fripons-trois",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois habitants A, B, C. A dit : « Nous sommes tous les trois des fripons. » B dit : « Exactement l'un de nous trois est un chevalier. » Que sont A, B et C ?",
   "solution": "Un chevalier ne peut pas dire « nous sommes tous fripons » : **A est fripon**, et sa phrase est fausse, donc au moins un chevalier parmi B et C.\n- Si B était fripon, C serait le seul chevalier : « exactement un chevalier » serait vrai, impossible pour un fripon.\n- Donc **B est chevalier**, sa phrase est vraie : il est l'unique chevalier, **C est fripon**.\nVérification : A fripon, B chevalier, C fripon ; A ment, B dit vrai.",
   "indice": "Commence par A, comme dans le problème à deux.",
   "categorie": "logique",
   "titre": "Chevaliers et fripons à trois",
   "parent": "ct-chevaliers-fripons"
  },
  {
   "id": "ct-yeux-bleus-fronts-sales",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "$n$ enfants jouent ; $k$ d'entre eux ont le front sale, chacun voit les fronts des autres mais pas le sien. Le père annonce : « Au moins l'un de vous a le front sale. » Puis il demande, à plusieurs reprises et tous ensemble : « Levez la main si vous savez que votre front est sale. » À quel appel les enfants sales lèvent-ils la main ?",
   "solution": "Au **$k$-ième appel**, les $k$ enfants sales lèvent la main ensemble.\n- $k = 1$ : l'enfant sale ne voit aucun front sale ; l'annonce lui apprend que c'est lui. Main levée au premier appel.\n- $k = 2$ : chacun voit un front sale ; si personne ne lève la main au premier appel, c'est que l'autre en voyait un aussi : main levée au deuxième.\n- Récurrence : au rang $k$, chacun en voit $k - 1$ et attend $k - 1$ appels.\nC'est le même mécanisme que les yeux bleus : l'annonce crée une **connaissance commune**.",
   "indice": "Commence par $k = 1$, puis $k = 2$ : que déduit un enfant sale de l'absence de main levée ?",
   "categorie": "logique",
   "titre": "Les enfants au front sale",
   "parent": "ct-yeux-bleus"
  },
  {
   "id": "ct-yeux-bleus-maris",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Dans un village, chaque épouse sait exactement quels maris sont infidèles, sauf le sien. La reine annonce : « Au moins un mari est infidèle ; toute épouse qui le découvre pour le sien doit le chasser le soir même, à minuit. » Il y a $k$ maris infidèles. Que se passe-t-il ?",
   "solution": "Les $k$ maris infidèles sont chassés **ensemble le $k$-ième soir**, et aucun avant.\nUne épouse trompée connaît $k - 1$ infidèles. Si seulement eux l'étaient, leurs épouses les chasseraient le soir $k - 1$ (récurrence). Ne voyant rien se passer ce soir-là, elle comprend que le sien l'est aussi. Une épouse non trompée connaît $k$ infidèles et attendrait le soir $k + 1$ : elle n'a pas à agir.",
   "indice": "Mets-toi à la place d'une épouse trompée qui connaît $k - 1$ infidèles.",
   "categorie": "logique",
   "titre": "Les maris infidèles",
   "parent": "ct-yeux-bleus"
  },
  {
   "id": "ct-ages-trois-filles-72",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Le produit des âges de mes trois filles vaut 72. La somme est le numéro de la maison d'en face. » Le recenseur regarde le numéro : « Il me manque une information. » « Mon aînée aime le chocolat. » Quels sont les âges ?",
   "solution": "Triplets et sommes : (1,1,72) 74 ; (1,2,36) 39 ; (1,3,24) 28 ; (1,4,18) 23 ; (1,6,12) 19 ; (1,8,9) 18 ; (2,2,18) 22 ; (2,3,12) 17 ; (2,4,9) 15 ; (2,6,6) **14** ; (3,3,8) **14** ; (3,4,6) 13.\nSeule la somme 14 laisse deux possibilités. « L'aînée » exclut (2,6,6), où les deux aînées ont le même âge : **3, 3 et 8 ans**.",
   "indice": "Liste les triplets de produit 72 et leurs sommes : une seule somme est ambiguë.",
   "categorie": "logique",
   "titre": "Les trois filles, produit 72",
   "parent": "ct-ages-trois-filles"
  },
  {
   "id": "ct-ages-cinq-enfants",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Le produit des âges de mes **cinq** enfants vaut 72 ; la somme est le numéro d'en face. » Le recenseur : « Il me manque une information. » « Mon aîné est unique. » Le recenseur peut-il maintenant donner les âges ?",
   "solution": "La seule somme ambiguë est **16**, avec trois candidats : (1,1,2,6,6), (1,1,3,3,8) et (1,2,2,2,9).\n« L'aîné est unique » n'élimine que (1,1,2,6,6). Il reste (1,1,3,3,8) et (1,2,2,2,9), qui ont tous deux un aîné unique : **le recenseur ne peut pas conclure**.\nLeçon d'entretien : ne jamais plaquer la réponse d'un problème connu. Refaire l'énumération, et oser dire que l'énoncé ne suffit pas.",
   "indice": "Énumère les quintuplets de produit 72 : quelle somme est ambiguë, et combien de candidats « aîné unique » laisse-t-elle ?",
   "categorie": "logique",
   "titre": "Cinq enfants, produit 72 : un piège",
   "parent": "ct-ages-trois-filles"
  },
  {
   "id": "ct-chapeaux-k-couleurs",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "100 prisonniers en file indienne, chacun voit les chapeaux devant lui. Les chapeaux sont maintenant de **$k$ couleurs** numérotées $0, \\dots, k - 1$. En partant du dernier, chacun annonce une couleur. Combien peuvent être sauvés à coup sûr avec une stratégie concertée ?",
   "solution": "Le dernier annonce la somme des couleurs qu'il voit, **modulo $k$**. Chaque suivant connaît cette somme, voit les chapeaux devant lui et a entendu les couleurs (justes) de ceux qui sont derrière lui, sauf la sienne : il retrouve sa couleur par soustraction modulo $k$.\nSeul le dernier joue à pile ou face (probabilité $1/k$) : **99** sauvés à coup sûr, quel que soit $k$.",
   "indice": "Remplace la parité par une somme modulo $k$.",
   "categorie": "logique",
   "titre": "La file de prisonniers, chapeaux de $k$ couleurs",
   "reponse": "99",
   "valeur": 99.0,
   "tolerance": 0.0,
   "parent": "ct-chapeaux"
  },
  {
   "id": "ct-chapeaux-cercle",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "$n$ personnes numérotées $0, \\dots, n - 1$ reçoivent chacune un chapeau d'une couleur parmi $n$ (numérotées aussi). Chacune voit tous les autres chapeaux, pas le sien, puis **toutes** annoncent en même temps une couleur pour leur propre chapeau. Trouve une stratégie qui garantit qu'**au moins une** personne a raison, quelle que soit la distribution.",
   "solution": "La personne $i$ suppose que $S \\equiv i \\pmod n$ et annonce la couleur qui rendrait cela vrai, compte tenu des chapeaux qu'elle voit.\n$S$ prend exactement une valeur $s$ modulo $n$ : la personne $i = s$ a fait la bonne hypothèse, donc annonce juste. Exactement une personne a raison, à coup sûr.\nOn ne peut pas faire mieux en garantie : chaque personne a raison avec probabilité $1/n$, donc en moyenne une seule.",
   "indice": "Soit $S$ la somme de toutes les couleurs modulo $n$. Chaque personne peut parier sur une valeur différente de $S$.",
   "categorie": "logique",
   "titre": "$n$ personnes, $n$ couleurs, annonces simultanées",
   "parent": "ct-chapeaux"
  },
  {
   "id": "ct-chapeaux-simultanes-sept",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Même jeu que les chapeaux rouges et bleus à trois joueurs (chacun annonce ou s'abstient, on gagne si au moins un annonce et que personne ne se trompe), mais avec **7 joueurs**. Quelle probabilité de gagner atteint-on avec la meilleure stratégie ?",
   "solution": "Le code de Hamming $(7, 4)$ contient 16 mots ; toute suite de 7 bits est soit un mot du code, soit à distance 1 d'exactement un mot. Stratégie : si en complétant ton bit tu peux obtenir un mot du code, annonce le bit qui n'en donne **pas** ; sinon abstiens-toi.\n- Configuration hors du code (112 sur 128) : un seul joueur peut « compléter en un mot du code », il annonce juste ; les autres s'abstiennent.\n- Configuration dans le code (16 sur 128) : les sept annoncent faux.\nProbabilité $112/128 =$ **7/8**, soit $1 - 1/(n + 1)$ avec $n = 7$.",
   "indice": "À trois joueurs, on concentre toutes les erreurs sur 2 configurations sur 8. Quel code correcteur fait la même chose sur 7 bits ?",
   "categorie": "logique",
   "titre": "Chapeaux simultanés à sept joueurs",
   "reponse": "7/8",
   "valeur": 0.875,
   "tolerance": 0.005,
   "parent": "ct-chapeaux-simultanes"
  },
  {
   "id": "ct-prisonniers-ampoule-inconnue",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Même problème des 100 prisonniers et de l'ampoule, mais on ne sait pas si l'ampoule est allumée ou éteinte au départ. Comment adapter la stratégie du compteur ?",
   "solution": "Chaque prisonnier autre que le compteur allume l'ampoule **deux fois** (les deux premières fois qu'il la trouve éteinte). Le compteur éteint et compte chaque ampoule allumée qu'il trouve ; il annonce quand son compte atteint $2 \\times 99 = 198$.\n- Le seuil est **atteignable** : même si l'ampoule était éteinte au départ, les 99 prisonniers fournissent $198$ allumages.\n- Le seuil est **sûr** : si l'ampoule était allumée au départ, un compte est parasite et $197$ viennent des prisonniers ; or 98 prisonniers n'en fournissent que $196$. Donc les 99 sont passés.\nLe piège est de s'arrêter à $197$ : si l'ampoule était allumée au départ, 98 prisonniers suffisent à faire $1 + 196 = 197$, et l'un d'eux peut ne jamais être venu.\nMéthode : vérifier qu'un seuil est à la fois atteignable dans le pire cas et concluant dans le pire cas.",
   "indice": "Le compteur ne sait pas si la première ampoule allumée vient d'un prisonnier ou de l'état initial : chaque prisonnier doit donc « compter » plus d'une fois.",
   "categorie": "logique",
   "titre": "L'ampoule des prisonniers, état initial inconnu",
   "parent": "ct-prisonniers-ampoule"
  },
  {
   "id": "ct-prisonniers-boites-limite",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Même jeu des boîtes avec $2n$ prisonniers qui ouvrent chacun $n$ boîtes et la stratégie des cycles. Vers quelle valeur tend la probabilité de succès quand $n \\to \\infty$ ?",
   "solution": "$$\\sum_{k=n+1}^{2n} \\frac{1}{k} = H_{2n} - H_n \\to \\ln 2,$$\ndonc la probabilité de succès tend vers $1 - \\ln 2 \\approx$ **0,307**. Résultat contre-intuitif : elle ne s'effondre pas avec le nombre de prisonniers, alors que la stratégie au hasard donne $2^{-2n}$.",
   "indice": "La probabilité d'échec est $\\sum_{k=n+1}^{2n} 1/k$. Reconnais une somme de Riemann.",
   "categorie": "logique",
   "titre": "Les prisonniers et les boîtes, beaucoup de prisonniers",
   "reponse": "1-ln(2)",
   "valeur": 0.3068528194400547,
   "tolerance": 0.01,
   "parent": "ct-prisonniers-boites"
  },
  {
   "id": "ct-prisonniers-boites-cycles",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On tire une permutation uniforme de $\\{1, \\dots, 10\\}$. Combien a-t-elle de cycles en moyenne (points fixes compris) ?",
   "solution": "Nombre moyen de cycles de longueur $k$ : $\\binom{n}{k}(k - 1)!\\,(n - k)!/n! = 1/k$. En sommant :\n$$\\mathbb{E}[\\text{cycles}] = \\sum_{k=1}^{n} \\frac1k = H_n.$$\nPour $n = 10$ : $H_{10} \\approx$ **2,93**, et $H_n \\approx \\ln n + 0{,}577$ en général. C'est la même série que pour la grenouille et les records.",
   "indice": "Le nombre de permutations de $\\{1, \\dots, n\\}$ ayant un cycle **donné** de longueur $k$ est $(n - k)!$. Compte les cycles de longueur $k$ en moyenne.",
   "categorie": "logique",
   "titre": "Nombre moyen de cycles d'une permutation",
   "reponse": "1+1/2+1/3+1/4+1/5+1/6+1/7+1/8+1/9+1/10",
   "valeur": 2.9289682539682538,
   "tolerance": 0.005,
   "parent": "ct-prisonniers-boites"
  },
  {
   "id": "ct-pieces-yeux-bandes-general",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "$N$ pièces sur la table, dont exactement $n$ côté face (tu connais $n$). Les yeux bandés, tu peux déplacer et retourner les pièces. Forme deux tas qui contiennent le même nombre de faces.",
   "solution": "Prends **$n$ pièces quelconques** et retourne-les toutes. Si elles contenaient $k$ faces, il en reste $n - k$ dans l'autre tas ; après retournement, le petit tas contient $n - k$ faces. Égalité dans tous les cas.",
   "indice": "La taille du petit tas est la seule chose que tu contrôles.",
   "categorie": "logique",
   "titre": "Pièces les yeux bandés, $n$ faces parmi $N$",
   "parent": "ct-pieces-yeux-bandes"
  },
  {
   "id": "ct-guetteur-mensonge",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Je pense à un entier entre 1 et 100. Tu poses des questions fermées ; je peux mentir **au plus une fois**. Combien de questions faut-il au minimum pour être sûr de trouver le nombre ?",
   "solution": "Avec $k$ questions, un scénario est un nombre (100 choix) et une position du mensonge parmi $k$, ou aucun mensonge : $100(k + 1)$ scénarios. Pour chaque nombre, les $k + 1$ suites de réponses possibles doivent être distinctes de celles des autres nombres : il faut $2^k \\ge 100(k + 1)$ (borne de Hamming).\n- $k = 10$ : $1\\,024 < 1\\,100$, impossible.\n- $k = 11$ : $2\\,048 \\ge 1\\,200$.\n**11 questions**, et une stratégie adaptative les atteint (jeu d'Ulam, résolu par Pelc). Sans mensonge il en fallait 7 : un seul mensonge coûte 4 questions.",
   "indice": "Compte les « scénarios » à distinguer : le nombre, et la position éventuelle du mensonge.",
   "categorie": "logique",
   "titre": "Deviner un nombre si je peux mentir une fois",
   "reponse": "11",
   "valeur": 11.0,
   "tolerance": 0.0,
   "parent": "ct-guetteur-espion"
  },
  {
   "id": "ct-batte-balle-machines",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Il faut 5 minutes à 5 machines pour fabriquer 5 objets. Combien de minutes faut-il à 100 machines pour fabriquer 100 objets ?",
   "solution": "Chaque machine fabrique un objet en 5 minutes. 100 machines travaillant en parallèle font 100 objets en **5 minutes**. La réponse réflexe (100) confond le nombre d'objets et la durée.",
   "indice": "Combien de temps faut-il à **une** machine pour faire **un** objet ?",
   "categorie": "nombres",
   "titre": "5 machines, 5 objets, 5 minutes",
   "reponse": "5",
   "valeur": 5.0,
   "tolerance": 0.0,
   "parent": "ct-batte-balle"
  },
  {
   "id": "ct-batte-balle-brique",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une brique pèse 1 kg plus la moitié d'une brique. Combien pèse une brique (en kg) ?",
   "solution": "$b = 1 + b/2$, donc $b/2 = 1$ et $b =$ **2 kg**. La réponse intuitive 1,5 kg ne vérifie pas l'énoncé : $1 + 0{,}75 \\ne 1{,}5$.",
   "indice": "Pose l'équation au lieu de répondre 1,5.",
   "categorie": "nombres",
   "titre": "La brique qui pèse 1 kg plus une demi-brique",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.0,
   "parent": "ct-batte-balle"
  },
  {
   "id": "ct-batte-balle-action",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une action perd 50 % un jour, puis gagne 50 % le lendemain. Quelle est sa variation totale, en pourcentage ?",
   "solution": "$0{,}5 \\times 1{,}5 = 0{,}75$ : **−25 %**. Pour revenir au niveau initial après −50 %, il faudrait +100 %. C'est la raison pour laquelle la moyenne arithmétique des rendements surestime la croissance (écart de l'ordre de $\\sigma^2/2$).",
   "indice": "Les pourcentages se multiplient, ils ne s'additionnent pas.",
   "categorie": "nombres",
   "titre": "−50 % puis +50 %",
   "reponse": "-25",
   "valeur": -25.0,
   "tolerance": 0.0,
   "parent": "ct-batte-balle"
  },
  {
   "id": "ct-josephus-trois",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "41 personnes en cercle, numérotées de 1 à 41. En partant de la 1, on compte jusqu'à 3 et l'on élimine la troisième (la 3, puis la 6, …), en continuant autour du cercle. Quel numéro survit ?",
   "solution": "Après la première élimination, on renumérote en partant de la personne qui suit l'éliminé : on retrouve le problème à $n - 1$ personnes décalé de $k$. D'où $J(1) = 0$ et $J(n) = (J(n - 1) + 3) \\bmod n$.\nEn déroulant jusqu'à $n = 41$ on trouve $J(41) = 30$, soit le numéro **31**. C'est la place qu'aurait choisie Josèphe selon la légende. Pas de formule fermée pour $k = 3$ : la récurrence en $O(n)$ est la bonne réponse.",
   "indice": "Avec $J(n)$ le survivant (numérotation à partir de 0) pour $n$ personnes, montre que $J(n) = (J(n - 1) + k) \\bmod n$.",
   "categorie": "nombres",
   "titre": "Flavius Josèphe : une personne sur trois",
   "reponse": "31",
   "valeur": 31.0,
   "tolerance": 0.0,
   "parent": "ct-josephus"
  },
  {
   "id": "ct-sommes-consecutives-puissances",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Quels entiers $N \\ge 1$ ne s'écrivent **pas** comme somme d'au moins deux entiers positifs consécutifs ?",
   "solution": "Écrire $N$ comme somme de $k$ consécutifs à partir de $m$, c'est écrire $2N = k \\times L$ avec $L = 2m + k - 1$ : deux facteurs de parités opposées, avec $L > k$.\n- Si $N = 2^a d$ avec $d$ impair, $d > 1$ : $2N = 2^{a+1} \\times d$. On prend $k = \\min(2^{a+1}, d)$ et $L = \\max(2^{a+1}, d)$ : parités opposées, $k \\ge 2$, et $m = (L - k + 1)/2 \\ge 1$. Exemple : $12 = 3 + 4 + 5$.\n- Si $N = 2^a$ : $2N = 2^{a+1}$ n'a pas de facteur impair autre que 1, donc $k = 1$ forcément.\nLes **puissances de 2** sont les seuls entiers qui ne s'écrivent pas ainsi. Plus généralement, le nombre d'écritures (un seul terme compris) est le nombre de diviseurs impairs de $N$.",
   "indice": "Une somme de $k \\ge 2$ consécutifs vaut $\\frac{k(2m + k - 1)}{2}$ : les deux facteurs sont de parités opposées.",
   "categorie": "nombres",
   "titre": "Les entiers qui ne sont pas sommes de consécutifs",
   "parent": "ct-sommes-consecutives"
  },
  {
   "id": "ct-zeros-factorielle-mille",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Par combien de zéros se termine $1\\,000!$ ?",
   "solution": "Formule de Legendre :\n$$\\left\\lfloor \\tfrac{1000}{5} \\right\\rfloor + \\left\\lfloor \\tfrac{1000}{25} \\right\\rfloor + \\left\\lfloor \\tfrac{1000}{125} \\right\\rfloor + \\left\\lfloor \\tfrac{1000}{625} \\right\\rfloor = 200 + 40 + 8 + 1 = 249.$$\nLe piège : s'arrêter à $1000/5 = 200$, ou oublier le terme en 625.",
   "indice": "Compte les facteurs 5, sans oublier 25, 125 et 625.",
   "categorie": "nombres",
   "titre": "Les zéros de $1\\,000!$",
   "reponse": "249",
   "valeur": 249.0,
   "tolerance": 0.0,
   "parent": "ct-zeros-factorielle"
  },
  {
   "id": "ct-zeros-factorielle-non-nul",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel est le dernier chiffre non nul de $100!$ ?",
   "solution": "$100!$ contient $97$ facteurs 2 et $24$ facteurs 5. On écrit $100! = 10^{24} \\times 2^{73} \\times R$, où $R$ est le produit des entiers de 1 à 100 privés de leurs facteurs 2 et 5 (impair, premier avec 5).\nEn suivant $R$ modulo 10 (bloc par bloc, ou avec la formule récursive $D(n) = 2^{\\lfloor n/5 \\rfloor} D(\\lfloor n/5 \\rfloor) D(n \\bmod 5) \\bmod 10$ pour le dernier chiffre non nul), on obtient **4**.\nVérification rapide : $D(100) = 2^{20} D(20) D(0) = 6 \\times 4 \\times 1 \\equiv 4 \\pmod{10}$, avec $D(20) = 2^4 D(4) = 6 \\times 4 = 24 \\equiv 4$.",
   "indice": "Retire les 24 couples $2 \\times 5$ qui font les zéros ; il reste un excédent de facteurs 2. Travaille modulo 10 sur ce qui reste.",
   "categorie": "nombres",
   "titre": "Le dernier chiffre non nul de $100!$",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.0,
   "parent": "ct-zeros-factorielle"
  },
  {
   "id": "ct-dernier-chiffre-modulo-sept",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel est le reste de la division de $2^{100}$ par 7 ?",
   "solution": "$2^3 = 8 \\equiv 1 \\pmod 7$. Or $100 = 3 \\times 33 + 1$, donc $2^{100} = (2^3)^{33} \\times 2 \\equiv 2$. Reste **2**. Même méthode que pour le dernier chiffre : trouver la période des puissances.",
   "indice": "Cherche une petite puissance de 2 qui vaut 1 modulo 7.",
   "categorie": "nombres",
   "titre": "$2^{100}$ modulo 7",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.0,
   "parent": "ct-dernier-chiffre"
  },
  {
   "id": "ct-dernier-chiffre-deux",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quels sont les deux derniers chiffres de $3^{100}$ ? Donne le nombre formé par ces deux chiffres.",
   "solution": "$3^{10} = 59\\,049 \\equiv 49 \\pmod{100}$, puis $3^{20} \\equiv 49^2 = 2\\,401 \\equiv 1$. Donc $3^{100} = (3^{20})^5 \\equiv 1$ : les deux derniers chiffres sont **01**.\nLe théorème d'Euler donne seulement $3^{40} \\equiv 1$ ($\\varphi(100) = 40$) ; l'ordre réel de 3 est plus petit (20).",
   "indice": "Travaille modulo 100 ; calcule $3^{10}$ modulo 100 puis élève au carré.",
   "categorie": "nombres",
   "titre": "Les deux derniers chiffres de $3^{100}$",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.0,
   "parent": "ct-dernier-chiffre"
  },
  {
   "id": "ct-impairs-gauss",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Que vaut $1 + 2 + 3 + \\dots + 100$ ?",
   "solution": "$1 + 100 = 2 + 99 = \\dots = 101$, et il y a 50 paires : $50 \\times 101 =$ **5 050**. En général $\\frac{n(n + 1)}{2}$.",
   "indice": "Apparie le premier et le dernier terme, le deuxième et l'avant-dernier…",
   "categorie": "nombres",
   "titre": "La somme de Gauss",
   "reponse": "5050",
   "valeur": 5050.0,
   "tolerance": 0.0,
   "parent": "ct-impairs"
  },
  {
   "id": "ct-impairs-chiffres",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On écrit tous les nombres de 1 à 100. Quelle est la somme de tous les chiffres écrits ?",
   "solution": "De 00 à 99, chaque chiffre de 0 à 9 apparaît 10 fois aux unités et 10 fois aux dizaines : $2 \\times 10 \\times (0 + 1 + \\dots + 9) = 900$. On ajoute 100, dont les chiffres font 1 : **901**.",
   "indice": "Écris les nombres de 00 à 99 sur deux chiffres : chaque chiffre apparaît autant de fois à chaque position.",
   "categorie": "nombres",
   "titre": "La somme de tous les chiffres de 1 à 100",
   "reponse": "901",
   "valeur": 901.0,
   "tolerance": 0.0,
   "parent": "ct-impairs"
  },
  {
   "id": "ct-frobenius-nuggets",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Des nuggets se vendent par boîtes de 6, 9 et 20. Quel est le plus grand nombre de nuggets qu'on ne peut pas acheter exactement ?",
   "solution": "6 et 9 donnent les multiples de 3 à partir de 6. Selon le reste modulo 3 :\n- reste 0 : tout multiple de 3 dès 6 ;\n- reste 2 : un 20, puis des multiples de 3, donc tout nombre $\\ge 26$ (et 20) ;\n- reste 1 : deux 20, donc tout nombre $\\ge 46$ (et 40).\nLe plus grand impossible est $46 - 3 =$ **43**. Pas de formule fermée avec trois valeurs, contrairement au cas de deux ($ab - a - b$).",
   "indice": "Avec 6 et 9 on n'obtient que des multiples de 3 ; un ou deux 20 changent le reste modulo 3.",
   "categorie": "nombres",
   "titre": "Les nuggets par 6, 9 et 20",
   "reponse": "43",
   "valeur": 43.0,
   "tolerance": 0.0,
   "parent": "ct-frobenius"
  },
  {
   "id": "ct-frobenius-pgcd",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu n'as que des pièces de 4 € et de 6 €. Existe-t-il un plus grand montant entier impossible à payer ?",
   "solution": "**Non** : tout montant payable est pair, donc tous les montants impairs sont impossibles, et il y en a une infinité. La formule de Frobenius $ab - a - b$ suppose $\\mathrm{pgcd}(a, b) = 1$. Ici $\\mathrm{pgcd}(4, 6) = 2$ : on paie exactement les nombres pairs à partir de 4.",
   "indice": "Quelle est la parité de tout montant payable ?",
   "categorie": "nombres",
   "titre": "Pièces de 4 et de 6",
   "parent": "ct-frobenius"
  },
  {
   "id": "ct-multiples-3-5-combien",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien d'entiers de 1 à 1 000 sont multiples de 3 ou de 5 ?",
   "solution": "$\\lfloor 1000/3 \\rfloor + \\lfloor 1000/5 \\rfloor - \\lfloor 1000/15 \\rfloor = 333 + 200 - 66 =$ **467**.",
   "indice": "Inclusion-exclusion : n'oublie pas de retirer les multiples de 15.",
   "categorie": "nombres",
   "titre": "Combien de multiples de 3 ou de 5 ?",
   "reponse": "467",
   "valeur": 467.0,
   "tolerance": 0.0,
   "parent": "ct-multiples-3-5"
  },
  {
   "id": "ct-multiples-3-5-euler",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien d'entiers de 1 à 1 000 sont premiers avec 1 000 ?",
   "solution": "Inclusion-exclusion : $1000 - 500 - 200 + 100 = 400$. C'est l'indicatrice d'Euler :\n$$\\varphi(1000) = 1000\\left(1 - \\tfrac12\\right)\\left(1 - \\tfrac15\\right) = 400.$$\nRéponse : **400**.",
   "indice": "Être premier avec $1\\,000 = 2^3 \\times 5^3$, c'est n'être divisible ni par 2 ni par 5.",
   "categorie": "nombres",
   "titre": "Les entiers premiers avec 1 000",
   "reponse": "400",
   "valeur": 400.0,
   "tolerance": 0.0,
   "parent": "ct-multiples-3-5"
  },
  {
   "id": "ct-diviseurs-impair",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Pour quels entiers $n \\ge 1$ le nombre de diviseurs positifs est-il impair ?",
   "solution": "Les diviseurs vont par paires $(d, n/d)$, sauf quand $d = n/d$, c'est-à-dire $d = \\sqrt n$. Le nombre de diviseurs est impair **si et seulement si $n$ est un carré parfait**. Autre preuve : $\\prod (a_i + 1)$ est impair si et seulement si tous les exposants $a_i$ sont pairs.\nC'est la clé du problème des 100 casiers.",
   "indice": "Associe chaque diviseur $d$ à $n/d$.",
   "categorie": "nombres",
   "titre": "Quand le nombre de diviseurs est-il impair ?",
   "parent": "ct-diviseurs"
  },
  {
   "id": "ct-diviseurs-premiers",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien y a-t-il de nombres premiers inférieurs à 100 ?",
   "solution": "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 : **25**. Ordre de grandeur : $100/\\ln 100 \\approx 22$ (théorème des nombres premiers).",
   "indice": "Crible d'Ératosthène : il suffit de barrer les multiples de 2, 3, 5 et 7 ($7^2 < 100 < 11^2$).",
   "categorie": "nombres",
   "titre": "Les nombres premiers inférieurs à 100",
   "reponse": "25",
   "valeur": 25.0,
   "tolerance": 0.0,
   "parent": "ct-diviseurs"
  },
  {
   "id": "ct-e-pi-puissances",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Sans calculatrice : lequel est le plus grand, $2^{100}$ ou $3^{63}$ ?",
   "solution": "$\\log_2 3^{63} = 63 \\log_2 3 \\approx 63 \\times 1{,}585 = 99{,}86 < 100$. Donc **$2^{100}$ est plus grand**, de peu ($2^{0{,}14} \\approx 1{,}1$, environ 10 %).\nPour retrouver $\\log_2 3$ : $3^{12} = 531\\,441$ est proche de $2^{19} = 524\\,288$, d'où $\\log_2 3 \\approx 19/12 \\approx 1{,}583$. Deux décimales ne suffiraient pas ici ($63 \\times 1{,}59 = 100{,}2$) : c'est le genre de comparaison serrée où il faut le dire, puis affiner.",
   "indice": "Compare les logarithmes en base 2 : il suffit de connaître $\\log_2 3$ à deux décimales.",
   "categorie": "nombres",
   "titre": "$2^{100}$ ou $3^{63}$ ?",
   "parent": "ct-e-pi"
  },
  {
   "id": "ct-e-pi-99-100",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Lequel est le plus grand, $99^{100}$ ou $100^{99}$ ?",
   "solution": "$99^{100} > 100^{99} \\iff 100 \\ln 99 > 99 \\ln 100 \\iff \\frac{\\ln 99}{99} > \\frac{\\ln 100}{100}$. La fonction $\\frac{\\ln x}{x}$ décroît après $e$ : c'est vrai, **$99^{100}$ est plus grand**.\nAutre façon : $\\frac{99^{100}}{100^{99}} = 99 \\times \\left(1 - \\frac{1}{100}\\right)^{99} \\approx 99 / e \\approx 36 > 1$.",
   "indice": "Compare $\\frac{\\ln 99}{99}$ et $\\frac{\\ln 100}{100}$.",
   "categorie": "nombres",
   "titre": "$99^{100}$ ou $100^{99}$ ?",
   "parent": "ct-e-pi"
  },
  {
   "id": "ct-e-pi-equation",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien l'équation $2^x = x^2$ a-t-elle de solutions réelles ?",
   "solution": "$x = 2$ et $x = 4$ sont solutions. Pour $x < 0$, $2^x$ croît de 0 à 1 tandis que $x^2$ décroît de $+\\infty$ à 0 : une troisième solution, vers $x \\approx -0{,}767$. Sur $]0, 2[$, $]2, 4[$ et $]4, +\\infty[$, l'étude de $\\frac{\\ln x}{x} = \\frac{\\ln 2}{2}$ montre qu'il n'y en a pas d'autre. **3 solutions**. Le piège : oublier les négatifs.",
   "indice": "Deux solutions entières se voient tout de suite. Regarde aussi ce qui se passe pour $x < 0$.",
   "categorie": "nombres",
   "titre": "Combien de solutions à $2^x = x^2$ ?",
   "reponse": "3",
   "valeur": 3.0,
   "tolerance": 0.0,
   "parent": "ct-e-pi"
  },
  {
   "id": "ct-tour-puissances-quatre",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Même méthode que pour $x^{x^{x^{\\cdots}}} = 2$ : si la tour vaut 4, alors $x^4 = 4$, donc $x = \\sqrt 2$. Où est l'erreur ?",
   "solution": "L'équation $x^y = y$ est une condition **nécessaire** si la tour converge, pas suffisante. Pour $x = \\sqrt 2$, la suite $a_{n+1} = \\sqrt 2^{\\,a_n}$ partant de $a_1 = \\sqrt 2$ croît et converge vers le **plus petit** point fixe, 2, jamais vers 4.\nLa tour converge si et seulement si $e^{-e} \\le x \\le e^{1/e}$, et sa valeur est alors au plus $e$ : la valeur 4 est impossible, l'équation $x^{x^{\\cdots}} = 4$ n'a **pas de solution**. Leçon : vérifier la convergence avant de résoudre une équation de point fixe.",
   "indice": "Pour $x = \\sqrt 2$, que vaut réellement la tour ? Quelles valeurs une tour infinie peut-elle prendre ?",
   "categorie": "nombres",
   "titre": "Une tour infinie égale à 4 ?",
   "parent": "ct-tour-puissances"
  },
  {
   "id": "ct-tour-puissances-radical",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut $\\sqrt{2 + \\sqrt{2 + \\sqrt{2 + \\cdots}}}$ ?",
   "solution": "$y = \\sqrt{2 + y}$, donc $y^2 - y - 2 = 0$, $y = 2$ (la racine $-1$ est exclue, $y > 0$). La suite $a_{n+1} = \\sqrt{2 + a_n}$ est croissante et majorée par 2 : elle converge bien vers **2**.",
   "indice": "Appelle $y$ la valeur : elle se retrouve sous le premier radical.",
   "categorie": "nombres",
   "titre": "Le radical infini",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.0,
   "parent": "ct-tour-puissances"
  },
  {
   "id": "ct-tour-puissances-fraction",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut la fraction continue $1 + \\cfrac{1}{1 + \\cfrac{1}{1 + \\cdots}}$ ?",
   "solution": "$\\varphi = 1 + 1/\\varphi$, soit $\\varphi^2 - \\varphi - 1 = 0$ : $\\varphi = \\frac{1 + \\sqrt 5}{2} \\approx$ **1,618**, le nombre d'or. Les réduites $1, 2, 3/2, 5/3, 8/5, \\dots$ sont des rapports de termes consécutifs de Fibonacci.",
   "indice": "Même idée : la valeur se retrouve au dénominateur.",
   "categorie": "nombres",
   "titre": "La fraction continue $1 + 1/(1 + 1/(1 + \\cdots))$",
   "reponse": "(1+sqrt(5))/2",
   "valeur": 1.618033988749895,
   "tolerance": 0.005,
   "parent": "ct-tour-puissances"
  },
  {
   "id": "ct-produit-max-reels",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On écrit 10 comme somme de **réels** positifs (en nombre quelconque). Quel est le plus grand produit possible ?",
   "solution": "Avec $k$ parts, le maximum est $(10/k)^k$, atteint pour des parts égales. La fonction $k \\mapsto (10/k)^k$ est maximale pour $k$ réel égal à $10/e \\approx 3{,}68$ ; parmi les entiers : $k = 3$ donne $37{,}04$, $k = 4$ donne $2{,}5^4 = 39{,}0625$. Réponse : **39,0625**, un peu plus que les 36 des entiers.",
   "indice": "À nombre de parts $k$ fixé, l'inégalité arithmético-géométrique impose des parts égales. Optimise ensuite sur $k$ entier.",
   "categorie": "nombres",
   "titre": "Produit maximal avec des réels",
   "reponse": "2.5^4",
   "valeur": 39.0625,
   "tolerance": 0.005,
   "parent": "ct-produit-max"
  },
  {
   "id": "ct-produit-max-xx",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quel est le minimum de $x^x$ sur $]0, +\\infty[$ ?",
   "solution": "$x^x = e^{x \\ln x}$ et $(x \\ln x)' = \\ln x + 1$ s'annule en $x = 1/e$. Minimum : $e^{-1/e} \\approx$ **0,692**. Et $x^x \\to 1$ quand $x \\to 0^+$ ($x \\ln x \\to 0$).",
   "indice": "Dérive $x \\ln x$.",
   "categorie": "nombres",
   "titre": "Minimum de $x^x$",
   "reponse": "exp(-1/e)",
   "valeur": 0.6922006275553464,
   "tolerance": 0.005,
   "parent": "ct-produit-max"
  },
  {
   "id": "ct-chiffres-puissance-factorielle",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Estime $\\log_2(100!)$ à une unité près.",
   "solution": "$\\ln 100! \\approx 100 \\times 4{,}605 - 100 + \\frac12 \\ln(628) \\approx 460{,}5 - 100 + 3{,}22 = 363{,}7$. Divisé par $\\ln 2$ : $\\log_2 100! \\approx$ **524,8**.\nInterprétation : il faut 525 bits pour coder une permutation de 100 éléments, et un tri par comparaisons fait au moins 525 comparaisons au pire.",
   "indice": "Formule de Stirling : $\\ln n! \\approx n \\ln n - n + \\frac12 \\ln(2\\pi n)$, avec $\\ln 10 \\approx 2{,}303$ et $\\ln 2 \\approx 0{,}693$.",
   "categorie": "nombres",
   "titre": "Combien de bits pour $100!$ ?",
   "reponse": "log2(factorial(100))",
   "valeur": 524.7649932900597,
   "tolerance": 0.002,
   "parent": "ct-chiffres-puissance"
  },
  {
   "id": "ct-irrationnel-puissance",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Existe-t-il deux irrationnels $a$ et $b$ tels que $a^b$ soit rationnel ?",
   "solution": "**Oui.** Soit $x = \\sqrt 2^{\\sqrt 2}$.\n- Si $x$ est rationnel, $a = b = \\sqrt 2$ conviennent.\n- Sinon, $a = x$ et $b = \\sqrt 2$ conviennent : $x^{\\sqrt 2} = \\sqrt 2^{\\sqrt 2 \\cdot \\sqrt 2} = \\sqrt 2^2 = 2$.\nPreuve non constructive classique. (On sait en fait que $x$ est irrationnel, par le théorème de Gelfond-Schneider.) Exemple constructif : $a = \\sqrt 2$, $b = 2\\log_2 3$ donne $a^b = 3$.",
   "indice": "Considère $\\sqrt 2^{\\sqrt 2}$, sans chercher à savoir s'il est rationnel.",
   "categorie": "nombres",
   "titre": "Un irrationnel puissance un irrationnel",
   "parent": "ct-irrationnel"
  },
  {
   "id": "ct-casiers-mille",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Même jeu avec 1 000 casiers et 1 000 passages : combien de casiers sont ouverts à la fin ?",
   "solution": "Carrés parfaits jusqu'à 1 000 : $1^2, \\dots, 31^2 = 961$ ($32^2 = 1\\,024 > 1\\,000$). **31 casiers**, soit $\\lfloor \\sqrt{1000} \\rfloor$.",
   "indice": "Les casiers ouverts sont toujours les carrés parfaits.",
   "categorie": "nombres",
   "titre": "1 000 casiers",
   "reponse": "31",
   "valeur": 31.0,
   "tolerance": 0.0,
   "parent": "ct-casiers"
  },
  {
   "id": "ct-pieces-balance-quatre-pesees",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Parmi $N$ pièces, une est fausse, plus lourde ou plus légère (on ne sait pas), et l'on doit la trouver **et** dire son sens, sans pièce de référence. Avec 3 pesées le maximum est 12. Quel est le maximum avec **4 pesées** ?",
   "solution": "Comptage : $2N$ cas (pièce, sens) pour $3^k$ suites d'issues. La suite « toujours équilibre » ne donne pas le sens, et les suites vont par paires miroirs (échanger gauche et droite échange « lourde » et « légère ») : $N \\le \\frac{3^k - 1}{2}$. Sans pièce de référence, on perd encore une pièce, car la première pesée doit mettre autant de pièces de chaque côté (Dyson) : $N \\le \\frac{3^k - 3}{2}$, et cette borne est atteinte.\n- $k = 3$ : $\\frac{27 - 3}{2} = 12$.\n- $k = 4$ : $\\frac{81 - 3}{2} =$ **39**.\nAvec une pièce de référence en plus, on gagne une pièce : 13 en 3 pesées, 40 en 4 ($\\frac{3^k - 1}{2}$).",
   "indice": "Comptage : $2N$ cas et $3^k$ issues, mais deux suites d'issues sont inutilisables. Lesquelles ?",
   "categorie": "pesees",
   "titre": "Pièce fausse inconnue : combien de pièces en 4 pesées ?",
   "reponse": "39",
   "valeur": 39.0,
   "tolerance": 0.0,
   "parent": "ct-pieces-balance"
  },
  {
   "id": "ct-billes-plus-lourde-huit",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Parmi 8 billes, une seule est plus lourde. Combien de pesées faut-il au minimum, au pire, avec une balance à deux plateaux ?",
   "solution": "3 contre 3 (2 billes de côté). Si un plateau penche, 1 contre 1 parmi ses 3 billes (la troisième si équilibre). Si équilibre, 1 contre 1 entre les 2 billes restantes. **2 pesées**. La pesée 4 contre 4 gaspille l'issue « équilibre », impossible ici, et en demande 3.",
   "indice": "Une pesée a trois issues. Ne pèse pas 4 contre 4.",
   "categorie": "pesees",
   "titre": "8 billes, une plus lourde",
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.0,
   "parent": "ct-billes-plus-lourde"
  },
  {
   "id": "ct-billes-plus-lourde-mille",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Parmi 1 000 billes, une seule est plus lourde. Combien de pesées au minimum, au pire ?",
   "solution": "$3^6 = 729 < 1\\,000 \\le 2\\,187 = 3^7$ : **7 pesées**, en divisant à chaque fois en trois groupes aussi égaux que possible. (Et 27 billes demandent 3 pesées.)",
   "indice": "$k$ pesées distinguent au plus $3^k$ billes.",
   "categorie": "pesees",
   "titre": "1 000 billes, une plus lourde",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.0,
   "parent": "ct-billes-plus-lourde"
  },
  {
   "id": "ct-piles-pieces-plusieurs",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Dix piles de pièces ; les vraies pèsent 10 g, les fausses 11 g. Cette fois, **un nombre quelconque** de piles peuvent être fausses (une pile est entièrement vraie ou entièrement fausse). Chaque pile contient assez de pièces. Comment trouver toutes les piles fausses en une seule pesée ?",
   "solution": "Prends $1, 2, 4, 8, \\dots, 512$ pièces des piles 1 à 10 (puissances de 2). L'excédent par rapport au poids attendu, en grammes, s'écrit de façon unique en binaire : ses bits à 1 désignent les piles fausses. Exemple : excédent $37 = 32 + 4 + 1$, piles 6, 3 et 1.\nIl faut $1\\,023$ pièces : c'est le coût de passer d'une seule pile fausse (10 cas, 55 pièces) à n'importe quel ensemble ($2^{10}$ cas).",
   "indice": "L'excédent de poids doit déterminer un **ensemble** de piles : il faut que toutes les sommes de sous-ensembles soient différentes.",
   "categorie": "pesees",
   "titre": "Plusieurs piles fausses, une seule pesée",
   "parent": "ct-piles-pieces-une-pesee"
  },
  {
   "id": "ct-piles-pieces-poids-inconnu",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Dix piles de pièces de 10 g, dont une pile de fausses pièces d'un poids **inconnu** (différent de 10 g). Combien de pesées faut-il sur une balance électronique pour trouver la pile fausse, et comment ?",
   "solution": "**Deux pesées.**\n- Pesée 1 : une pièce de chaque pile. L'écart à 100 g vaut $\\delta$, l'écart de poids d'une fausse pièce.\n- Pesée 2 : $1, 2, \\dots, 10$ pièces des piles 1 à 10. L'écart à 550 g vaut $k\\delta$ : on en déduit le numéro $k = \\text{écart}/\\delta$.\nUne seule pesée ne suffit pas : l'écart $k\\delta$ ne sépare pas $k$ et $\\delta$ (pile 2 avec $\\delta = 2$ g et pile 4 avec $\\delta = 1$ g donnent le même écart), quelles que soient les quantités prises.",
   "indice": "Une seule pesée de $1, 2, \\dots, 10$ pièces donne un excédent $k \\times \\delta$ : deux inconnues pour une équation.",
   "categorie": "pesees",
   "titre": "Une pile fausse de poids inconnu",
   "parent": "ct-piles-pieces-une-pesee"
  },
  {
   "id": "ct-poids-balance-binaire",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On ne peut poser les poids que sur **un seul** plateau (l'objet sur l'autre). Combien de poids faut-il au minimum pour peser toutes les masses entières de 1 à 63 g, et lesquels ?",
   "solution": "Système binaire : $1, 2, 4, 8, 16, 32$, soit **6 poids** ($2^6 - 1 = 63$). Avec 5 poids, au plus $2^5 - 1 = 31$ masses positives. Les deux plateaux donnent trois états par poids, d'où les puissances de 3 du problème d'origine.",
   "indice": "Chaque poids a maintenant deux états : posé ou non.",
   "categorie": "pesees",
   "titre": "Les poids sur un seul plateau",
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.0,
   "parent": "ct-poids-balance"
  },
  {
   "id": "ct-cordes-quinze",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Deux cordes brûlent chacune en une heure, de façon irrégulière. Comment mesurer exactement **15 minutes** ?",
   "solution": "Allume A par les deux bouts et B par un bout. Quand A est consumée (30 minutes), allume l'autre bout de B et **commence à compter** à cet instant : B finit 15 minutes plus tard.\nLe piège est de vouloir partir de $t = 0$ : on ne sait pas mesurer 15 minutes d'emblée, mais on sait les mesurer entre $t = 30$ et $t = 45$.",
   "indice": "Le début de la mesure n'est pas forcément au moment où tu allumes la première corde.",
   "categorie": "pesees",
   "titre": "Mesurer 15 minutes avec deux cordes",
   "parent": "ct-cordes"
  },
  {
   "id": "ct-cordes-une-seule",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Avec **une seule** corde qui brûle en une heure de façon irrégulière, quelles durées peux-tu mesurer à coup sûr ?",
   "solution": "**60 minutes** (un bout) et **30 minutes** (les deux bouts), rien d'autre de garanti. Couper la corde en deux ne donne pas deux demi-heures (la combustion est irrégulière), et allumer le second bout en cours de route ne sert que si l'on sait quand le faire, ce qui demande une autre mesure.",
   "indice": "Combien d'extrémités peux-tu allumer, et quand ?",
   "categorie": "pesees",
   "titre": "Une seule corde",
   "parent": "ct-cordes"
  },
  {
   "id": "ct-cordes-trois",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Trois cordes brûlent chacune en une heure, de façon irrégulière. Comment mesurer exactement 7 minutes 30 secondes ?",
   "solution": "- $t = 0$ : allume A par les deux bouts, B par un bout, C par un bout.\n- $t = 30$ : A est finie. B et C ont chacune 30 minutes de reste ; allume le second bout de B (il lui reste 15 minutes).\n- $t = 45$ : B est finie. C brûle par un bout depuis 45 minutes : il lui reste 15 minutes. Allume son second bout : elle finit en 7 min 30 s.\nL'intervalle entre $t = 45$ et $t = 52{,}5$ dure **7 min 30 s**. Chaque allumage d'un second bout divise un reste par deux : avec trois cordes on atteint $60/8$ minutes. Dérouler chaque instant à voix haute est ce qui est noté.",
   "indice": "Pour obtenir 7 min 30 s, il faut allumer par les deux bouts une corde à laquelle il reste exactement 15 minutes de combustion par un bout.",
   "categorie": "pesees",
   "titre": "Mesurer 7 min 30 s avec trois cordes",
   "parent": "ct-cordes"
  },
  {
   "id": "ct-sabliers-neuf",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Avec un sablier de 4 minutes et un de 7 minutes, comment mesurer exactement 9 minutes ?",
   "solution": "- $t = 0$ : retourne les deux.\n- $t = 4$ : le 4 est vide, retourne-le.\n- $t = 7$ : le 7 est vide, retourne-le.\n- $t = 8$ : le 4 est vide ; le 7 coule depuis 1 minute : retourne-le, il lui reste 1 minute.\n- $t = 9$ : le 7 est vide. **9 minutes.**",
   "indice": "Quand un sablier se vide, retourne l'autre pour « rendre » la durée qu'il vient d'écouler.",
   "categorie": "pesees",
   "titre": "Sabliers de 4 et 7 minutes : mesurer 9 minutes",
   "parent": "ct-sabliers"
  },
  {
   "id": "ct-sabliers-treize",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Avec un sablier de 5 minutes et un de 9 minutes, comment mesurer exactement 13 minutes ?",
   "solution": "- $t = 0$ : retourne les deux.\n- $t = 5$ : le 5 est vide, retourne-le.\n- $t = 9$ : le 9 est vide ; le 5 coule depuis 4 minutes (4 minutes de sable en bas). Retourne-le : il se vide en 4 minutes.\n- $t = 13$ : le 5 est vide. **13 minutes.**",
   "indice": "Lance les deux ensemble et regarde ce qu'il reste dans le petit quand le grand se vide.",
   "categorie": "pesees",
   "titre": "Sabliers de 5 et 9 minutes : mesurer 13 minutes",
   "parent": "ct-sabliers"
  },
  {
   "id": "ct-cruches-petite-d-abord",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Cruches de 3 L et de 5 L, robinet et évier. On impose de commencer par **remplir la petite**. Combien d'opérations au minimum pour obtenir 4 L ?",
   "solution": "(3, 0) ; (0, 3) ; (3, 3) ; (1, 5) ; (1, 0) ; (0, 1) ; (3, 1) ; (0, 4). **8 opérations**, contre 6 en commençant par la grande. Les deux sens de rotation atteignent 4 L, mais pas à la même vitesse.",
   "indice": "Remplis 3, verse dans 5, recommence : que reste-t-il dans la petite ?",
   "categorie": "pesees",
   "titre": "Les cruches de 3 et 5 L, en commençant par la petite",
   "reponse": "8",
   "valeur": 8.0,
   "tolerance": 0.0,
   "parent": "ct-cruches"
  },
  {
   "id": "ct-cruches-pgcd",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Avec une cruche de 4 L, une de 6 L, un robinet et un évier, peut-on obtenir exactement 1 L, 2 L, 3 L ou 5 L ?",
   "solution": "Toutes les quantités restent **paires** : remplir, vider et transvaser entre des cruches de 4 et 6 L ne produit que des multiples de $\\mathrm{pgcd}(4, 6) = 2$. On obtient 2 L (remplir 6, verser dans 4), mais **jamais** 1, 3 ou 5 L.",
   "indice": "Quelle propriété du contenu de chaque cruche est conservée par toutes les opérations ?",
   "categorie": "pesees",
   "titre": "Cruches de 4 et 6 litres",
   "parent": "ct-cruches"
  },
  {
   "id": "ct-cruches-partage",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une cruche de 8 L est pleine ; on a aussi deux cruches vides de 5 L et 3 L, sans robinet ni évier. Combien de transvasements au minimum pour partager le vin en deux fois 4 L ?",
   "solution": "(8, 0, 0) → (3, 5, 0) → (3, 2, 3) → (6, 2, 0) → (6, 0, 2) → (1, 5, 2) → (1, 4, 3) → (4, 4, 0). **7 transvasements** (problème de Tartaglia). Le parcours en largeur garantit la minimalité.",
   "indice": "Parcours en largeur sur les états $(a, b, c)$ avec $a + b + c = 8$.",
   "categorie": "pesees",
   "titre": "Partager 8 litres avec des cruches de 5 et 3",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.0,
   "parent": "ct-cruches"
  },
  {
   "id": "ct-barre-or-chaine",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un voyageur paie son hôtel un maillon d'une chaîne de 7 maillons par nuit, pendant 7 nuits, et peut récupérer de la monnaie. Combien de maillons faut-il **ouvrir** au minimum ?",
   "solution": "Ouvre le **troisième** maillon : on obtient des morceaux de 1 (le maillon ouvert), 2 et 4 maillons. Avec 1, 2, 4 on paie chaque nuit en rendant la monnaie, comme pour la barre d'or. **Un seul maillon** suffit, alors qu'il fallait deux coupes pour la barre : ouvrir un maillon crée trois morceaux d'un coup.",
   "indice": "Ouvrir un maillon au milieu de la chaîne crée trois morceaux, dont le maillon ouvert lui-même.",
   "categorie": "pesees",
   "titre": "La chaîne de 7 maillons",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.0,
   "parent": "ct-barre-or"
  },
  {
   "id": "ct-barre-or-quinze",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "L'ouvrier travaille maintenant 15 jours, payé chaque soir $1/15$ d'une barre d'or divisée en 15 segments. Combien de coupes au minimum ?",
   "solution": "Morceaux $1, 2, 4, 8$ (écriture binaire de 1 à 15) : **3 coupes**. Avec 2 coupes, 3 morceaux ne permettent que $2^3 - 1 = 7$ montants : insuffisant.",
   "indice": "Quels morceaux permettent d'écrire tous les entiers de 1 à 15 ?",
   "categorie": "pesees",
   "titre": "La barre d'or sur 15 jours",
   "reponse": "3",
   "valeur": 3.0,
   "tolerance": 0.0,
   "parent": "ct-barre-or"
  },
  {
   "id": "ct-vin-empoisonne-deux-vagues",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une bouteille sur 1 000 est empoisonnée, le poison tue en 24 h. Tu as maintenant **48 heures** (deux vagues de tests). Combien de rats au minimum ?",
   "solution": "Chaque rat finit mort le jour 1, mort le jour 2, ou vivant : 3 issues. On numérote les bouteilles en **base 3** : le chiffre $i$ dit si le rat $i$ boit le jour 1 (chiffre 1), le jour 2 (chiffre 2) ou jamais (0). Un rat mort le jour 1 ne boit pas le jour 2, ce qui est cohérent avec le codage.\n$3^6 = 729 < 1\\,000 \\le 2\\,187 = 3^7$ : **7 rats**.",
   "indice": "À la fin, chaque rat est dans l'un de trois états. Lesquels ?",
   "categorie": "pesees",
   "titre": "Le vin empoisonné en 48 heures",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.0,
   "parent": "ct-vin-empoisonne"
  },
  {
   "id": "ct-vin-empoisonne-deux-bouteilles",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux bouteilles sur 1 000 sont empoisonnées ; 24 h, une seule vague. Donne une **borne inférieure** sur le nombre de rats nécessaires, par un argument d'information.",
   "solution": "Il y a $\\binom{1000}{2} = 499\\,500$ paires possibles, et $r$ rats donnent au plus $2^r$ issues. $2^{18} = 262\\,144 < 499\\,500 \\le 524\\,288 = 2^{19}$ : il faut **au moins 19 rats**. En pratique, les schémas connus (tests de groupe non adaptatifs) en demandent davantage, car l'issue « mort » d'un rat ne dit plus laquelle des deux bouteilles il a bue.",
   "indice": "Combien de cas faut-il distinguer, et combien d'issues donnent $r$ rats ?",
   "categorie": "pesees",
   "titre": "Deux bouteilles empoisonnées",
   "reponse": "19",
   "valeur": 19.0,
   "tolerance": 0.0,
   "parent": "ct-vin-empoisonne"
  },
  {
   "id": "ct-chevaux-plus-rapide",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "25 chevaux, 5 par course, pas de chronomètre. Combien de courses au minimum pour trouver **le** plus rapide ?",
   "solution": "5 courses pour que chaque cheval coure, puis la course des 5 vainqueurs : **6 courses**. On ne peut pas faire mieux : chaque cheval sauf un doit avoir perdu au moins une fois, et 5 courses où chaque cheval court ne laissent que 5 candidats, à départager.",
   "indice": "Combien de courses pour que chaque cheval ait couru au moins une fois ?",
   "categorie": "recherche",
   "titre": "25 chevaux : seulement le plus rapide",
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.0,
   "parent": "ct-chevaux"
  },
  {
   "id": "ct-chevaux-deux",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "25 chevaux, 5 par course, pas de chronomètre. Combien de courses au minimum pour trouver les **deux** plus rapides ?",
   "solution": "Après les 5 courses de groupe et la course des vainqueurs, le 2ᵉ est soit A2 (deuxième du groupe du vainqueur), soit B1 (deuxième de la course des vainqueurs). Une 7ᵉ course entre eux (on peut même y ajouter d'autres chevaux) : **7 courses**, autant que pour les trois plus rapides.",
   "indice": "Après 6 courses, qui peut encore être deuxième ?",
   "categorie": "recherche",
   "titre": "25 chevaux : les deux plus rapides",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.0,
   "parent": "ct-chevaux"
  },
  {
   "id": "ct-chevaux-soixante-quatre",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "64 chevaux, une piste à 8 couloirs, pas de chronomètre. Avec la méthode classique (courses de groupes, course des vainqueurs, puis courses de départage), combien de courses faut-il au pire pour trouver les 4 plus rapides ?",
   "solution": "- 8 courses de groupes, puis la course des 8 vainqueurs (9 courses) : A1 est le plus rapide.\n- Candidats aux places 2 à 4 : A2, A3, A4 ; B1, B2, B3 ; C1, C2 ; D1, soit **9 chevaux** pour 8 couloirs.\n- 10ᵉ course avec 8 d'entre eux : quel que soit le cheval laissé de côté, il existe un cas où il pourrait être 4ᵉ (par exemple D1 si B1 et C1 terminent premiers). Une 11ᵉ course départage alors les derniers prétendants.\nRéponse : **11 courses** au pire avec cette méthode. On attend surtout le tableau des candidats déroulé à voix haute.",
   "indice": "Après 9 courses, dresse le tableau des candidats : un cheval est éliminé dès que 4 chevaux plus rapides que lui sont connus.",
   "categorie": "recherche",
   "titre": "64 chevaux, 8 couloirs, les 4 plus rapides",
   "reponse": "11",
   "valeur": 11.0,
   "tolerance": 0.0,
   "parent": "ct-chevaux"
  },
  {
   "id": "ct-oeufs-trois",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Même problème avec **trois** œufs et 100 étages : combien de lâchers au pire avec la meilleure stratégie ?",
   "solution": "$f(n, k) = \\sum_{i=1}^{k} \\binom{n}{i}$. Avec 3 œufs : $f(8, 3) = 8 + 28 + 56 = 92 < 100$ et $f(9, 3) = 9 + 36 + 84 = 129 \\ge 100$. **9 lâchers**, contre 14 avec deux œufs.",
   "indice": "Avec $n$ lâchers et $k$ œufs, le nombre d'étages couverts vérifie $f(n, k) = f(n - 1, k - 1) + 1 + f(n - 1, k)$.",
   "categorie": "recherche",
   "titre": "Trois œufs et 100 étages",
   "reponse": "9",
   "valeur": 9.0,
   "tolerance": 0.0,
   "parent": "ct-oeufs"
  },
  {
   "id": "ct-oeufs-quatre",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Avec 4 œufs et au plus 10 lâchers, combien d'étages au maximum peut-on traiter à coup sûr ?",
   "solution": "$f(n, k) = f(n - 1, k - 1) + 1 + f(n - 1, k)$, d'où $f(n, k) = \\sum_{i=1}^{k} \\binom{n}{i}$.\n$f(10, 4) = 10 + 45 + 120 + 210 =$ **385** étages. C'est la programmation dynamique classique, à savoir écrire en code.",
   "indice": "Le premier lâcher coupe l'immeuble : en dessous il reste $k - 1$ œufs et $n - 1$ lâchers, au-dessus $k$ œufs et $n - 1$ lâchers.",
   "categorie": "recherche",
   "titre": "Quatre œufs et dix lâchers",
   "reponse": "385",
   "valeur": 385.0,
   "tolerance": 0.0,
   "parent": "ct-oeufs"
  },
  {
   "id": "ct-oeufs-un",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Avec **un seul** œuf et 100 étages, combien de lâchers au pire ?",
   "solution": "On ne peut prendre aucun risque : étage 1, puis 2, puis 3… Si l'on saute un étage et que l'œuf casse, on ne sait plus si l'étage sauté était sûr. **100 lâchers** au pire.",
   "indice": "Que se passe-t-il si tu sautes un étage et que l'œuf casse ?",
   "categorie": "recherche",
   "titre": "Un seul œuf",
   "reponse": "100",
   "valeur": 100.0,
   "tolerance": 0.0,
   "parent": "ct-oeufs"
  },
  {
   "id": "ct-pont-escorte",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Même pont, même lampe, au plus deux à la fois, mais les quatre personnes mettent 1, 5, 6 et 7 minutes. Temps minimal ?",
   "solution": "- Les deux lents ensemble : $5 + 1 + 7 + 5 + 5 = 23$.\n- Le plus rapide escorte : $7 + 1 + 6 + 1 + 5 =$ **20**.\nRègle : avec $t_1 \\le t_2 \\le t_3 \\le t_4$, faire passer les deux lents ensemble coûte $2t_2$ contre $t_1 + t_3$ pour l'escorte. Ici $2 \\times 5 = 10 > 1 + 6 = 7$ : l'escorte gagne. Avec 1, 2, 5, 10 c'était l'inverse ($4 < 6$).",
   "indice": "Compare les deux stratégies : « les deux lents ensemble » et « le plus rapide accompagne chacun ».",
   "categorie": "recherche",
   "titre": "Le pont avec 1, 5, 6 et 7 minutes",
   "reponse": "20",
   "valeur": 20.0,
   "tolerance": 0.0,
   "parent": "ct-pont"
  },
  {
   "id": "ct-pasteques-max-min",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "16 pastèques de poids distincts, une balance qui compare deux pastèques. Combien de pesées au minimum, au pire, pour trouver **la plus lourde et la plus légère** ?",
   "solution": "8 pesées par paires ; la plus lourde est parmi les 8 gagnantes (7 pesées), la plus légère parmi les 8 perdantes (7 pesées) : $8 + 7 + 7 =$ **22**. En général $\\lceil 3n/2 \\rceil - 2$, contre $2n - 3$ si l'on cherche les deux séparément.",
   "indice": "Commence par comparer les pastèques deux à deux.",
   "categorie": "recherche",
   "titre": "La plus lourde et la plus légère",
   "reponse": "22",
   "valeur": 22.0,
   "tolerance": 0.0,
   "parent": "ct-pasteques"
  },
  {
   "id": "ct-nombre-manquant-deux",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Une liste non triée contient les entiers de 1 à $n$, sauf **deux**. Comment les trouver en temps $O(n)$ et mémoire $O(1)$ ?",
   "solution": "Somme : $s = a + b = \\frac{n(n + 1)}{2} - \\sum t_i$. Somme des carrés : $q = a^2 + b^2 = \\frac{n(n + 1)(2n + 1)}{6} - \\sum t_i^2$. Alors $ab = \\frac{s^2 - q}{2}$, et $a, b$ sont les racines de $x^2 - sx + ab$.\nVariante sans dépassement : le ou exclusif de tout donne $a \\oplus b$ ; un bit à 1 de ce résultat sépare les nombres en deux groupes, chacun contenant un seul manquant. Pour $k$ manquants : sommes des puissances 1 à $k$ (identités de Newton).",
   "indice": "La somme donne $a + b$ ; il te faut une deuxième équation.",
   "categorie": "recherche",
   "titre": "Deux nombres manquants",
   "parent": "ct-nombre-manquant"
  },
  {
   "id": "ct-nombre-manquant-doublon",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Une liste de $n$ entiers devrait contenir $1, \\dots, n$, mais un nombre $x$ manque et un nombre $y$ apparaît deux fois. Comment trouver $x$ et $y$ en $O(n)$ et mémoire $O(1)$ ?",
   "solution": "$\\sum t_i - \\frac{n(n + 1)}{2} = y - x$ et $\\sum t_i^2 - \\frac{n(n + 1)(2n + 1)}{6} = y^2 - x^2 = (y - x)(y + x)$. On en tire $y + x$, puis $x$ et $y$. Autre méthode si l'on peut modifier le tableau : marquer les cases vues par un signe négatif.",
   "indice": "Écris deux équations, avec la somme et la somme des carrés.",
   "categorie": "recherche",
   "titre": "Un manquant et un doublon",
   "parent": "ct-nombre-manquant"
  },
  {
   "id": "ct-riviere-chevre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un passeur doit faire traverser une chèvre, un loup et un chou ; sa barque ne prend qu'un passager. Sans surveillance, le loup mange la chèvre et la chèvre mange le chou. Combien de traversées au minimum ?",
   "solution": "Chèvre (aller), retour à vide, loup (aller), **chèvre ramenée**, chou (aller), retour à vide, chèvre (aller) : **7 traversées**. On peut échanger les rôles du loup et du chou. L'idée du retour d'un passager est la même que la lampe du pont.",
   "indice": "Il faudra ramener un passager en arrière.",
   "categorie": "recherche",
   "titre": "La chèvre, le loup et le chou",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.0,
   "parent": "ct-riviere",
   "voir": [
    "ct-pont"
   ]
  },
  {
   "id": "ct-riviere-quatre",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "Même règle que les missionnaires et cannibales, mais avec **quatre** de chaque et une barque de deux places. Est-ce possible ?",
   "solution": "**Impossible.** L'exploration des états sûrs atteignables (au plus $5 \\times 5 \\times 2 = 50$) ne contient jamais l'état final. Intuition : il faut faire passer des missionnaires, mais dès que deux missionnaires traversent, les cannibales restés sur une rive deviennent majoritaires. Avec une barque de **trois** places, c'est de nouveau possible. La méthode (graphe d'états) se transpose telle quelle.",
   "indice": "Parcours en largeur sur les états : un état est le nombre de missionnaires et de cannibales sur la rive de départ, et la rive de la barque.",
   "categorie": "recherche",
   "titre": "Quatre missionnaires et quatre cannibales",
   "parent": "ct-riviere"
  },
  {
   "id": "ct-tri-cinq-borne",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Montre qu'un tri par comparaisons de $n$ éléments distincts fait au moins $\\log_2 n!$ comparaisons au pire, puis donne l'ordre de grandeur.",
   "solution": "Un algorithme de tri par comparaisons se représente par un arbre binaire de décision ; chacune des $n!$ permutations doit aboutir à une feuille différente. Un arbre de hauteur $h$ a au plus $2^h$ feuilles : $2^h \\ge n!$, donc $h \\ge \\log_2 n!$.\nPar Stirling, $\\log_2 n! = n \\log_2 n - n \\log_2 e + O(\\log n) \\sim n \\log_2 n$. Le tri fusion atteint $O(n \\log n)$ : il est optimal à une constante près. Un tri par dénombrement contourne la borne car il ne compare pas.",
   "indice": "Arbre de décision : chaque feuille est un ordre possible.",
   "categorie": "recherche",
   "titre": "La borne inférieure du tri par comparaisons",
   "parent": "ct-tri-cinq"
  },
  {
   "id": "ct-pirates-majorite-stricte",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Cinq pirates, 100 pièces, mêmes préférences (survivre, puis l'or, puis voir les autres jetés), mais la proposition doit obtenir une majorité **stricte** (plus de la moitié des voix, proposant compris). Combien de pièces garde le plus ancien ?",
   "solution": "Pirates numérotés de 1 (le plus jeune) à 5.\n- 2 pirates : il faut 2 voix ; le pirate 1 refuse tout (il aurait 100 seul) : le pirate 2 est **jeté**.\n- 3 pirates : il faut 2 voix ; le pirate 2 vote pour n'importe quoi pour éviter de se retrouver à deux : $(0, 0, 100)$.\n- 4 pirates : il faut 3 voix ; les pirates 1 et 2 ont 0 dans le cas à 3, une pièce chacun suffit : $(1, 1, 0, 98)$.\n- 5 pirates : il faut 3 voix ; le pirate 3 a 0 dans le cas à 4 (1 pièce), et l'un des pirates 1 ou 2 a 1 (il en faut 2) : $(2, 0, 1, 0, 97)$.\nLe plus ancien garde **97**. Changer une règle change toute la chaîne : il faut refaire l'induction, pas adapter la réponse.",
   "indice": "Refais tout depuis 2 pirates : le plus ancien des deux peut-il obtenir une majorité stricte ?",
   "categorie": "strategie",
   "titre": "Les pirates à majorité stricte",
   "reponse": "97",
   "valeur": 97.0,
   "tolerance": 0.0,
   "parent": "ct-pirates"
  },
  {
   "id": "ct-pirates-omohundro",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Même jeu (au moins la moitié des voix suffit), 100 pièces, mais beaucoup de pirates. Jusqu'à 200, le plus ancien survit en achetant des voix. Parmi les nombres de pirates de 201 à 300, quel est le plus grand pour lequel le plus ancien survit ?",
   "solution": "Avec $n > 200$ pirates, le proposant a sa voix, 100 voix achetées, et celles des pirates condamnés si sa proposition échoue (ceux entre le dernier nombre « survivant » et lui). Il survit si ce total atteint $n/2$.\n- 201 et 202 survivent (101 voix suffisent).\n- 203 meurt (il faut 102 voix, il en a 101) ; 204 survit grâce à la voix de 203.\n- 205 à 207 meurent, 208 survit grâce à 205, 206, 207 ; puis 216, 232, 264, 328…\nLes survivants sont les $200 + 2^k$. Le plus grand $\\le 300$ est **264** (problème d'Omohundro, popularisé par Ian Stewart).",
   "indice": "Au-delà de 200, il ne peut acheter que 100 voix. Mais les pirates qui seraient jetés après lui votent pour lui gratuitement.",
   "categorie": "strategie",
   "titre": "Plus de 200 pirates pour 100 pièces",
   "reponse": "264",
   "valeur": 264.0,
   "tolerance": 0.0,
   "parent": "ct-pirates"
  },
  {
   "id": "ct-allumettes-misere",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "21 allumettes ; chacun en retire 1, 2 ou 3 à tour de rôle ; cette fois, **celui qui prend la dernière perd**. Tu commences : que fais-tu ?",
   "solution": "Il faut laisser à l'adversaire un nombre de la forme $4k + 1$ (1, 5, 9, 13, 17, 21). Or $21 = 4 \\times 5 + 1$ : **tu es déjà en position perdante**. Contre un adversaire parfait, aucun coup ne gagne ; tu retires une allumette et tu espères une erreur, après laquelle tu reviens à $4k + 1$.\nLeçon : la version « misère » décale l'analyse ; refais-la depuis la fin.",
   "indice": "La position perdante n'est plus 0 mais 1 : laisser une seule allumette à l'adversaire le fait perdre.",
   "categorie": "strategie",
   "titre": "Les allumettes : qui prend la dernière perd",
   "parent": "ct-allumettes"
  },
  {
   "id": "ct-allumettes-general",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "40 allumettes ; chacun en retire de 1 à 6 ; celui qui prend la dernière gagne. Tu commences : combien en retires-tu ?",
   "solution": "Il faut laisser un multiple de $m + 1 = 7$. $40 = 7 \\times 5 + 5$ : retire **5**, puis complète chaque coup adverse à 7.",
   "indice": "Quel multiple faut-il laisser quand on peut prendre de 1 à $m$ ?",
   "categorie": "strategie",
   "titre": "Allumettes : retirer de 1 à 6",
   "reponse": "5",
   "valeur": 5.0,
   "tolerance": 0.0,
   "parent": "ct-allumettes"
  },
  {
   "id": "ct-course-a-100-pieces",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "100 pièces sur la table ; chacun en prend de 1 à 10 à tour de rôle ; celui qui prend la dernière gagne. Tu commences : combien en prends-tu ?",
   "solution": "Laisse un multiple de 11 : $100 = 11 \\times 9 + 1$, prends **1**, puis complète chaque coup adverse à 11.",
   "indice": "C'est la course à 100 déguisée.",
   "categorie": "strategie",
   "titre": "100 pièces, de 1 à 10 par tour",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.0,
   "parent": "ct-course-a-100"
  },
  {
   "id": "ct-course-a-cinquante",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux joueurs ajoutent à tour de rôle un entier de 1 à 6 à un total qui part de 0 ; celui qui atteint exactement 50 gagne. Tu commences : quel nombre annonces-tu ?",
   "solution": "Atteindre 43 garantit 50 (l'adversaire ajoute $k$, tu ajoutes $7 - k$) ; de même 36, 29, …, 8, 1 : les totaux $\\equiv 1 \\pmod 7$. Annonce **1**.",
   "indice": "Quels totaux faut-il atteindre pour être sûr d'atteindre 50 ?",
   "categorie": "strategie",
   "titre": "La course à 50, de 1 à 6",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.0,
   "parent": "ct-course-a-100"
  },
  {
   "id": "ct-pieces-en-rangee-impair",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Même jeu (prendre une pièce à l'une des extrémités, à tour de rôle), mais avec un nombre **impair** de pièces. Le premier joueur peut-il toujours garantir au moins la moitié ?",
   "solution": "**Non.** Avec 1, 5, 1 : le premier joueur prend un 1, le second prend le 5. Le premier obtient 2 sur 7. La stratégie des parités ne marche plus : après le premier coup, il reste un nombre pair de pièces, et c'est l'adversaire qui peut choisir sa parité.",
   "indice": "Essaie avec trois pièces.",
   "categorie": "strategie",
   "titre": "Pièces en rangée, nombre impair",
   "parent": "ct-pieces-en-rangee"
  },
  {
   "id": "ct-table-ronde-chocolat",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Deux joueurs placent à tour de rôle un domino sur un échiquier $8 \\times 8$ (sur deux cases libres voisines). Celui qui ne peut plus jouer perd. Qui gagne ?",
   "solution": "Le **second** joueur gagne, par symétrie centrale : à chaque domino adverse, il répond par le domino symétrique par rapport au centre de l'échiquier. Ce domino ne peut jamais recouvrir le domino adverse (aucun domino n'est son propre symétrique, puisque le centre est un coin commun de quatre cases), et la position reste symétrique : il a toujours un coup.\nSur la table ronde, le premier joueur occupe le centre pour devenir « second » ; ici, ce n'est pas possible.",
   "indice": "Ici, il n'y a pas de case centrale. Quelle symétrie le **second** joueur peut-il utiliser ?",
   "categorie": "strategie",
   "titre": "La stratégie de la copie, ailleurs",
   "parent": "ct-table-ronde"
  },
  {
   "id": "ct-chocolat-tournoi",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un tournoi de tennis à élimination directe réunit 64 joueurs. Combien de matchs faut-il pour désigner le vainqueur ? Et avec 100 joueurs (certains exemptés à certains tours) ?",
   "solution": "Chaque match élimine exactement un joueur ; il faut en éliminer tous sauf un : **63** matchs, et 99 avec 100 joueurs, quelle que soit l'organisation des tours. Même argument que les cassures de la tablette.",
   "indice": "Combien de joueurs chaque match élimine-t-il ?",
   "categorie": "strategie",
   "titre": "Le tournoi à élimination directe",
   "reponse": "63",
   "valeur": 63.0,
   "tolerance": 0.0,
   "parent": "ct-chocolat"
  },
  {
   "id": "ct-p-pistolets-limite",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "$n$ personnes ont chacune un pistolet à eau et visent chacune une des $n - 1$ autres au hasard. Vers quelle proportion de personnes sèches tend-on quand $n$ devient grand ?",
   "solution": "Proportion moyenne : $\\left(1 - \\frac{1}{n - 1}\\right)^{n - 1} \\to e^{-1} \\approx$ **0,368**. Même limite que la proportion de boîtes vides quand on lance $n$ balles dans $n$ boîtes : chaque personne est une « boîte » que $n - 1$ tirs évitent.",
   "indice": "Une personne reste sèche avec probabilité $(1 - \\frac{1}{n - 1})^{n - 1}$.",
   "categorie": "probas",
   "titre": "Pistolets à eau : la proportion de personnes sèches",
   "reponse": "exp(-1)",
   "valeur": 0.36787944117144233,
   "tolerance": 0.005,
   "parent": "ct-p-pistolets"
  },
  {
   "id": "ct-p-ecart-deux-des-carre",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés. Probabilité que le produit des deux résultats soit un carré parfait ?",
   "solution": "Carrés : 1 (1·1), 4 (1·4, 4·1, 2·2), 9 (3·3), 16 (4·4), 25 (5·5), 36 (6·6) : 8 issues sur 36, soit **2/9**. Le piège : oublier les couples non doubles comme $(1, 4)$.",
   "indice": "Liste les carrés possibles entre 1 et 36 et leurs décompositions en deux faces.",
   "categorie": "probas",
   "titre": "Le produit de deux dés est un carré",
   "reponse": "2/9",
   "valeur": 0.2222222222222222,
   "tolerance": 0.005,
   "parent": "ct-p-ecart-deux-des"
  },
  {
   "id": "ct-p-ecart-deux-des-min",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés. Quelle est l'espérance du plus petit des deux résultats ?",
   "solution": "$$\\mathbb{E}[\\min] = \\frac{36 + 25 + 16 + 9 + 4 + 1}{36} = \\frac{91}{36} \\approx 2{,}53.$$\nEt $\\mathbb{E}[\\max] = 7 - \\mathbb{E}[\\min] = \\frac{161}{36}$, car $\\min + \\max = X + Y$ a pour espérance 7. Ce contrôle est la bonne habitude.",
   "indice": "$\\mathbb{E}[\\min] = \\sum_{k \\ge 1} \\mathbb{P}(\\min \\ge k)$, et $\\mathbb{P}(\\min \\ge k) = \\left(\\frac{7 - k}{6}\\right)^2$.",
   "categorie": "probas",
   "titre": "Espérance du minimum de deux dés",
   "reponse": "91/36",
   "valeur": 2.5277777777777777,
   "tolerance": 0.005,
   "parent": "ct-p-ecart-deux-des"
  },
  {
   "id": "ct-p-total-cent",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance un dé en additionnant les résultats jusqu'à ce que le total atteigne au moins 100. Combien de lancers en moyenne ? Donne d'abord un ordre de grandeur, puis la valeur.",
   "solution": "Première approximation : $100/3{,}5 \\approx 28{,}6$. Mais au moment de l'arrêt, le total dépasse 99 en moyenne de plus que zéro. Par le théorème du renouvellement, le dépassement moyen tend vers $\\frac{\\mathbb{E}[X^2]}{2\\mathbb{E}[X]} = \\frac{91/6}{7} \\approx 2{,}17$ au-delà de 99, donc le total final moyen vaut environ $101{,}67$, et par l'identité de Wald $\\mathbb{E}[N] = \\mathbb{E}[S_N]/3{,}5 \\approx 29{,}05$.\nLa récurrence exacte $e(t) = 1 + \\frac16 \\sum_{d=1}^{6} e(t + d)$ ($e(t) = 0$ pour $t \\ge 100$) donne **29,048**.",
   "indice": "Ordre de grandeur : $100 / 3{,}5$. La correction vient du dépassement final : quelle est sa taille moyenne ?",
   "categorie": "probas",
   "titre": "Lancer un dé jusqu'à atteindre 100",
   "reponse": "29.047619",
   "valeur": 29.047619,
   "tolerance": 0.005,
   "parent": "ct-p-total-sept"
  },
  {
   "id": "ct-p-triangle-aigu-centre",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois points uniformes et indépendants sur un cercle. Probabilité que le triangle formé contienne le centre du cercle ?",
   "solution": "Le triangle contient le centre exactement quand il est aigu, c'est-à-dire quand les trois points **ne** tiennent **pas** dans un demi-cercle : $1 - 3/4 =$ **1/4**. Même événement que le triangle aigu, vu autrement.",
   "indice": "Le triangle contient le centre si et seulement si…",
   "categorie": "probas",
   "titre": "Le triangle contient-il le centre ?",
   "reponse": "1/4",
   "valeur": 0.25,
   "tolerance": 0.005,
   "parent": "ct-p-triangle-aigu",
   "voir": [
    "proba-demi-cercle"
   ]
  },
  {
   "id": "ct-p-triangle-aigu-sphere",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Quatre points uniformes et indépendants sur une sphère. Probabilité que le tétraèdre formé contienne le centre ?",
   "solution": "Argument de Wendel : chaque point $P_i$ peut être remplacé par $-P_i$ sans changer la loi. Parmi les $2^3$ choix de signes pour les trois premiers points, exactement un donne un tétraèdre contenant le centre (presque sûrement). Probabilité **1/8**.\nThéorème de Wendel : $n$ points sont dans un même hémisphère de la sphère de $\\mathbb{R}^d$ avec probabilité $2^{1-n} \\sum_{k=0}^{d-1} \\binom{n-1}{k}$, soit $7/8$ ici ; le centre est dans l'enveloppe convexe avec la probabilité complémentaire. Sur le cercle ($d = 2$, $n = 3$) : $1 - 3/4 = 1/4$.",
   "indice": "Pour trois points $A, B, C$ fixés, considère les huit tétraèdres obtenus en remplaçant chacun d'eux par son antipode ou non, avec le quatrième point.",
   "categorie": "probas",
   "titre": "Le tétraèdre contient-il le centre de la sphère ?",
   "reponse": "1/8",
   "valeur": 0.125,
   "tolerance": 0.005,
   "parent": "ct-p-triangle-aigu"
  },
  {
   "id": "ct-p-rendez-vous-attente",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux amis arrivent indépendamment à un instant uniforme entre 8 h et 9 h ; chacun attend **10 minutes** puis s'en va. Probabilité qu'ils se rencontrent ?",
   "solution": "Ils se rencontrent si $|X - Y| \\le t$, de probabilité $1 - (1 - t)^2$. Avec $t = 1/6$ : $1 - (5/6)^2 = 1 - 25/36 =$ **11/36** $\\approx 0{,}31$.",
   "indice": "Formule générale avec une attente $t$ (en fraction d'heure).",
   "categorie": "probas",
   "titre": "Le rendez-vous avec 10 minutes d'attente",
   "reponse": "11/36",
   "valeur": 0.3055555555555556,
   "tolerance": 0.005,
   "parent": "ct-p-rendez-vous"
  },
  {
   "id": "ct-p-rendez-vous-asymetrique",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux amis arrivent indépendamment à un instant uniforme entre 8 h et 9 h. Alice attend 10 minutes, Bob attend 20 minutes. Probabilité qu'ils se rencontrent ?",
   "solution": "Avec $A$ et $B$ les heures d'arrivée (en heures) : rencontre si $B - A \\le 1/6$ (Alice attend) et $A - B \\le 1/3$ (Bob attend). Les zones exclues sont deux triangles de côtés $5/6$ et $2/3$ :\n$$\\mathbb{P} = 1 - \\frac12\\left(\\frac56\\right)^2 - \\frac12\\left(\\frac23\\right)^2 = 1 - \\frac{25}{72} - \\frac{16}{72} = \\frac{31}{72} \\approx 0{,}43.$$",
   "indice": "Si Alice arrive la première, c'est son attente qui compte. Dessine le carré et les deux triangles exclus, de tailles différentes.",
   "categorie": "probas",
   "titre": "Le rendez-vous où l'un attend plus que l'autre",
   "reponse": "31/72",
   "valeur": 0.4305555555555556,
   "tolerance": 0.005,
   "parent": "ct-p-rendez-vous"
  },
  {
   "id": "ct-p-buffon-courte",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance une aiguille de longueur $1/2$ sur un parquet dont les lames ont une largeur 1. Probabilité que l'aiguille croise une ligne ?",
   "solution": "$\\mathbb{P} = \\frac{2\\ell}{\\pi d}$ ; avec $\\ell = 1/2$ et $d = 1$ : $\\frac{1}{\\pi} \\approx$ **0,318**. La probabilité est proportionnelle à la longueur (tant que $\\ell \\le d$), cohérent avec la « nouille de Buffon ». C'est la première méthode de Monte-Carlo pour estimer $\\pi$.",
   "indice": "Formule générale pour $\\ell \\le d$.",
   "categorie": "probas",
   "titre": "L'aiguille de Buffon plus courte que les lames",
   "reponse": "1/pi",
   "valeur": 0.3183098861837907,
   "tolerance": 0.005,
   "parent": "ct-p-buffon"
  },
  {
   "id": "ct-p-bertrand-longueur",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "On choisit deux points uniformes et indépendants sur un cercle de rayon 1. Quelle est la longueur moyenne de la corde qui les relie ?",
   "solution": "$$\\mathbb{E} = \\frac{1}{\\pi}\\int_0^{\\pi} 2\\sin\\frac{\\theta}{2}\\,d\\theta = \\frac{1}{\\pi}\\left[-4\\cos\\frac{\\theta}{2}\\right]_0^{\\pi} = \\frac{4}{\\pi} \\approx 1{,}27.$$\nRéponse : **$4/\\pi$**. Avec un autre modèle de « corde au hasard », la réponse change, comme dans le paradoxe de Bertrand.",
   "indice": "Si l'angle au centre est $\\theta$, uniforme sur $[0, \\pi]$ par symétrie, la corde mesure $2 \\sin(\\theta/2)$.",
   "categorie": "probas",
   "titre": "Longueur moyenne d'une corde aléatoire",
   "reponse": "4/pi",
   "valeur": 1.2732395447351628,
   "tolerance": 0.005,
   "parent": "ct-p-bertrand-corde"
  },
  {
   "id": "ct-p-de-deux-egaux",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance un dé jusqu'à ce que deux lancers **consécutifs** donnent la même face. Combien de lancers en moyenne ?",
   "solution": "Le premier lancer ne peut pas conclure ; ensuite chaque lancer reproduit le précédent avec probabilité $1/6$ : attente géométrique de moyenne 6. Total : $1 + 6 =$ **7**. À comparer avec $3{,}77$ pour une face **déjà sortie** n'importe quand.",
   "indice": "Après le premier lancer, chaque lancer suivant « gagne » avec probabilité $1/6$, indépendamment.",
   "categorie": "probas",
   "titre": "Deux lancers consécutifs égaux",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.0,
   "parent": "ct-p-de-repetition"
  },
  {
   "id": "ct-p-cube-oppose-hexagone",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une grenouille saute à chaque minute vers l'un des deux sommets voisins d'un hexagone, au hasard. En combien de minutes en moyenne atteint-elle le sommet opposé à son départ ?",
   "solution": "$e_3 = 1 + e_2$ ; $e_2 = 1 + \\frac12 e_1 + \\frac12 e_3$ ; $e_1 = 1 + \\frac12 e_2$. On obtient $e_1 = 5$, $e_2 = 8$, $e_3 =$ **9**. C'est $k(n - k)$ avec $n = 6$, $k = 3$ : la marche simple sur un cycle.",
   "indice": "Utilise la distance au sommet visé (0 à 3), comme pour le cube.",
   "categorie": "probas",
   "titre": "La grenouille sur un hexagone",
   "reponse": "9",
   "valeur": 9.0,
   "tolerance": 0.0,
   "parent": "ct-p-cube-oppose"
  },
  {
   "id": "ct-p-cube-retour",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "La fourmi part d'un sommet du cube et suit à chaque minute une arête au hasard. Combien de minutes en moyenne avant de **revenir** à son sommet de départ ?",
   "solution": "La loi stationnaire est uniforme sur les 8 sommets ($\\pi_i = 1/8$) ; théorème de Kac : temps moyen de retour $= 1/\\pi_i =$ **8**. Vérification avec les distances : $1 + e_1 = 1 + 7 = 8$, où $e_1 = 7$ est le temps moyen depuis un voisin (calculé dans le problème d'origine).",
   "indice": "Pour une marche aléatoire sur un graphe régulier, la loi stationnaire est uniforme, et le temps moyen de retour en un sommet vaut $1/\\pi_i$.",
   "categorie": "probas",
   "titre": "Le retour au point de départ sur un cube",
   "reponse": "8",
   "valeur": 8.0,
   "tolerance": 0.0,
   "parent": "ct-p-cube-oppose"
  },
  {
   "id": "ct-p-piece-un-tiers",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Avec une pièce équitable, comment simuler un événement de probabilité exactement $1/3$ ? Combien de lancers en moyenne ?",
   "solution": "Lance deux fois : PP donne « oui », PF ou FP « non », FF : recommence. Chaque paire conclut avec probabilité $3/4$ : en moyenne $4/3$ paires, soit **$8/3$ lancers**. C'est un échantillonnage par rejet, comme pour construire un dé à 7 faces à partir d'un dé à 5.",
   "indice": "Deux lancers donnent quatre issues équiprobables : garde-en trois.",
   "categorie": "probas",
   "titre": "Simuler une probabilité $1/3$ avec une pièce",
   "reponse": "8/3",
   "valeur": 2.6666666666666665,
   "tolerance": 0.005,
   "parent": "ct-p-piece-equitable",
   "voir": [
    "algo-rand7"
   ]
  },
  {
   "id": "ct-p-chaussettes-pair",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Même tiroir : tirer deux chaussettes rouges a une probabilité exactement $1/2$. On sait en plus que le nombre de chaussettes **noires** est pair. Quel est le plus petit nombre total possible ?",
   "solution": "Solutions $(n, r)$ : $(4, 3)$ avec 1 noire (impair), puis $(21, 15)$ avec **6 noires** : $\\frac{15 \\times 14}{21 \\times 20} = \\frac{210}{420} = \\frac12$. Réponse : **21**. L'équation est une équation de Pell déguisée : $(2n - 1)^2 - 2(2r - 1)^2 = -1$.",
   "indice": "Les solutions de $2r(r - 1) = n(n - 1)$ forment une suite : (4, 3), (21, 15), (120, 85)…",
   "categorie": "probas",
   "titre": "Les chaussettes avec un nombre pair de noires",
   "reponse": "21",
   "valeur": 21.0,
   "tolerance": 0.0,
   "parent": "ct-p-chaussettes"
  },
  {
   "id": "ct-p-chaussettes-tiroirs",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un tiroir contient 10 chaussettes rouges et 10 noires. Dans le noir, combien faut-il en tirer pour être **sûr** d'avoir deux rouges ? Et pour être sûr d'avoir une paire de même couleur ?",
   "solution": "Au pire on tire d'abord les 10 noires : il en faut $10 + 2 =$ **12** pour deux rouges. Pour une paire quelconque, **3** suffisent (principe des tiroirs : deux couleurs, trois chaussettes). Ce n'est pas une question de probabilité mais de pire cas.",
   "indice": "Imagine le pire tirage possible.",
   "categorie": "probas",
   "titre": "Tirer dans le noir pour être sûr",
   "reponse": "12",
   "valeur": 12.0,
   "tolerance": 0.0,
   "parent": "ct-p-chaussettes"
  },
  {
   "id": "ct-p-cinquante-piles",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance 100 pièces équilibrées. Probabilité d'obtenir exactement 50 piles ? Donne une approximation sans calculatrice.",
   "solution": "$\\binom{100}{50} 2^{-100} \\approx \\frac{1}{\\sqrt{\\pi n}}$ avec $n = 50$ : $\\frac{1}{\\sqrt{157}} \\approx 0{,}080$. Valeur exacte $\\approx$ **0,0796**. Contre-intuitif : le résultat le plus probable n'arrive que 8 % du temps.",
   "indice": "Approximation normale : la densité de $\\mathcal{N}(50, 25)$ en 50, ou Stirling sur $\\binom{2n}{n}$.",
   "categorie": "probas",
   "titre": "Exactement 50 piles sur 100",
   "reponse": "comb(100,50)/2^100",
   "valeur": 0.07958923738717877,
   "tolerance": 0.005,
   "parent": "ct-p-pari-60-piles"
  },
  {
   "id": "ct-p-roulette-hasard",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Même jeu, mais les deux balles sont placées dans **deux chambres au hasard** (pas forcément adjacentes), puis le barillet est tourné. Ton adversaire tire à vide. Ta probabilité de survie si tu tires sans tourner ? Faut-il tourner ?",
   "solution": "$\\mathbb{P}(\\text{chambre courante et suivante vides}) = \\binom{4}{2} / \\binom{6}{2} = 6/15 = 2/5$, et $\\mathbb{P}(\\text{courante vide}) = 2/3$. Survie sans tourner : $\\frac{2/5}{2/3} =$ **3/5**. En tournant : $2/3 > 3/5$ : **il faut tourner**, à l'inverse du cas des balles adjacentes.",
   "indice": "Calcule la probabilité que deux chambres consécutives données soient toutes deux vides.",
   "categorie": "probas",
   "titre": "Roulette russe, balles placées au hasard",
   "reponse": "3/5",
   "valeur": 0.6,
   "tolerance": 0.005,
   "parent": "ct-p-roulette-russe"
  },
  {
   "id": "ct-p-morceau-plus-court",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On casse un bâton de longueur 1 en deux points uniformes indépendants. Quelle est la longueur moyenne du **plus court** des trois morceaux ?",
   "solution": "Les trois morceaux dépassent tous $x$ avec probabilité $(1 - 3x)^2$ (on retire $x$ à chacun, il reste $1 - 3x$ à répartir). Donc\n$$\\mathbb{E}[\\min] = \\int_0^{1/3} (1 - 3x)^2\\,dx = \\frac{1}{9}.$$\nRéponse : **1/9**. Le plus long vaut en moyenne $11/18$ et le moyen $5/18$ (somme 1, bon contrôle).",
   "indice": "$\\mathbb{P}(\\text{plus court} > x) = (1 - 3x)^2$ pour $x \\le 1/3$.",
   "categorie": "probas",
   "titre": "Le plus court des trois morceaux",
   "reponse": "1/9",
   "valeur": 0.1111111111111111,
   "tolerance": 0.005,
   "parent": "ct-p-morceau-milieu",
   "voir": [
    "proba-baton-plus-long"
   ]
  },
  {
   "id": "ct-p-baton-hasard",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On casse un bâton de longueur 1 en un point uniforme, puis on choisit **au hasard** (une chance sur deux) l'un des deux morceaux et on le casse en un point uniforme. Probabilité que les trois morceaux forment un triangle ?",
   "solution": "- Casser le plus court (probabilité $1/2$) : le plus long dépasse $1/2$, aucun triangle.\n- Casser le plus long (probabilité $1/2$) : c'est le problème d'origine, probabilité $2 \\ln 2 - 1$.\nTotal : $\\frac12 (2\\ln 2 - 1) = \\ln 2 - \\frac12 \\approx$ **0,193**.",
   "indice": "Si l'on casse le plus court, le plus long reste plus grand que $1/2$.",
   "categorie": "probas",
   "titre": "Casser l'un des deux morceaux au hasard",
   "reponse": "ln(2)-1/2",
   "valeur": 0.1931471805599453,
   "tolerance": 0.005,
   "parent": "ct-p-baton-casse-deux-fois"
  },
  {
   "id": "ct-p-trois-longueurs",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On tire trois longueurs indépendantes uniformes sur $[0, 1]$. Probabilité qu'elles forment un triangle ?",
   "solution": "$\\mathbb{P}(X \\ge Y + Z) = \\int_0^1 \\frac{x^2}{2}\\,dx = \\frac16$ (aire du triangle $y + z \\le x$). Les trois événements « une longueur dépasse la somme des deux autres » sont disjoints : $\\mathbb{P}(\\text{échec}) = 3/6$. Triangle : **1/2**.",
   "indice": "Le triangle échoue si la plus grande dépasse la somme des deux autres. Calcule $\\mathbb{P}(X \\ge Y + Z)$.",
   "categorie": "probas",
   "titre": "Trois longueurs uniformes forment-elles un triangle ?",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "parent": "ct-p-baton-casse-deux-fois"
  },
  {
   "id": "ct-p-tennis-jeu",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu gagnes chaque point avec probabilité $0{,}6$. Probabilité de gagner un jeu de tennis depuis 0-0 (il faut 4 points et deux d'avance) ?",
   "solution": "- 4-0, 4-1, 4-2 : le dernier point est gagné et les $k$ points perdus se placent parmi les $3 + k$ précédents, $\\binom{3}{0}, \\binom{4}{1}, \\binom{5}{2} = 1, 4, 10$ façons : $p^4\\left(1 + 4q + 10q^2\\right)$.\n- Égalité à 3-3 : $\\binom{6}{3} p^3 q^3 = 20p^3q^3$, puis $\\frac{p^2}{p^2 + q^2} = \\frac{9}{13}$.\nTotal : $0{,}5443 + 0{,}1914 \\approx$ **0,736**. Un avantage de 60 % par point devient 74 % par jeu, et davantage par set : le format amplifie l'avantage.",
   "indice": "Sépare les jeux gagnés à 4-0, 4-1, 4-2, et ceux qui passent par 3-3 (« égalité »).",
   "categorie": "probas",
   "titre": "Gagner un jeu de tennis depuis 0-0",
   "reponse": "0.6^4*(1+4*0.4+10*0.4^2)+20*0.6^3*0.4^3*9/13",
   "valeur": 0.7357292307692308,
   "tolerance": 0.005,
   "parent": "ct-p-deuce-tennis"
  },
  {
   "id": "ct-p-paires-rouge-puis-noire",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On aligne un jeu de 52 cartes mélangé. En moyenne, combien de positions sont occupées par une carte rouge immédiatement suivie d'une carte noire ?",
   "solution": "$\\mathbb{P}(\\text{rouge puis noire}) = \\frac{26}{52} \\times \\frac{26}{51}$ pour chaque paire ; sur 51 paires : $51 \\times \\frac{26}{52} \\times \\frac{26}{51} = 13$. Réponse : **13**, la moitié des 26 changements de couleur.",
   "indice": "Linéarité de l'espérance sur les 51 paires de voisines.",
   "categorie": "probas",
   "titre": "Paires « rouge puis noire »",
   "reponse": "13",
   "valeur": 13.0,
   "tolerance": 0.0,
   "parent": "ct-p-paires-rouge-noire"
  },
  {
   "id": "ct-p-series-pieces",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance 10 fois une pièce équilibrée. Une « série » est un bloc maximal de résultats identiques (PPFPPP contient 3 séries). Nombre moyen de séries ?",
   "solution": "Séries $= 1 +$ nombre de changements entre lancers consécutifs. Chacun des 9 couples change avec probabilité $1/2$ : $1 + 9/2 =$ **5,5**. Utile pour tester l'indépendance d'une suite (test des séries) : trop peu de séries signale une persistance.",
   "indice": "Une série commence au premier lancer, puis à chaque changement.",
   "categorie": "probas",
   "titre": "Le nombre moyen de séries",
   "reponse": "5.5",
   "valeur": 5.5,
   "tolerance": 0.005,
   "parent": "ct-p-paires-rouge-noire"
  },
  {
   "id": "ct-p-ivrogne-equitable",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "ouverte",
   "question": "L'ivrogne est à un pas de la falaise et fait maintenant chaque pas vers le bord ou vers l'intérieur avec probabilité $1/2$. Tombe-t-il presque sûrement ? Combien de pas en moyenne avant la chute ?",
   "solution": "$x = \\frac12 + \\frac12 x^2$ donne $(x - 1)^2 = 0$ : il **tombe presque sûrement** (la marche simple sur $\\mathbb{Z}$ est récurrente).\nMais le temps moyen est **infini** : avec une seconde barrière à distance $N$, la durée moyenne vaut $1 \\times (N - 1)$, qui tend vers l'infini. Il tombe à coup sûr, mais peut errer très longtemps ($\\mathbb{P}(T > n) \\sim c/\\sqrt n$). C'est l'exemple type d'un temps d'arrêt fini mais d'espérance infinie.",
   "indice": "L'équation $x = \\frac12 + \\frac12 x^2$ a une racine double. Pour le temps moyen, compare avec la ruine du joueur contre une banque infinie.",
   "categorie": "probas",
   "titre": "L'ivrogne avec $p = 1/2$",
   "parent": "ct-p-ivrogne-falaise"
  },
  {
   "id": "ct-p-serie-trois-piles",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance 5 fois une pièce équilibrée. Probabilité qu'apparaissent au moins 3 piles consécutifs ?",
   "solution": "Suites sans PPP : $a_n = a_{n-1} + a_{n-2} + a_{n-3}$ (la suite commence par F, PF ou PPF), avec $a_1 = 2$, $a_2 = 4$, $a_3 = 7$ : $a_4 = 13$, $a_5 = 24$. Avec PPP : $32 - 24 = 8$. Probabilité $8/32 =$ **1/4**.",
   "indice": "Compte les suites sans 3 piles consécutifs par une récurrence, ou énumère selon la position du premier bloc PPP.",
   "categorie": "probas",
   "titre": "Une série d'au moins 3 piles en 5 lancers",
   "reponse": "1/4",
   "valeur": 0.25,
   "tolerance": 0.005,
   "parent": "ct-p-sans-piles-consecutifs"
  },
  {
   "id": "ct-p-intrus-cafe",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois amis lancent chacun une pièce ; celui dont le résultat diffère des deux autres paie le café. Si les trois résultats sont identiques, on recommence. Nombre moyen de tours ?",
   "solution": "Un tour échoue seulement si les trois pièces sont identiques : $2/8$. Il réussit avec probabilité $6/8 = 3/4$ : nombre moyen de tours $1/(3/4) =$ **4/3**.",
   "indice": "Quelle est la probabilité qu'un tour désigne un intrus ?",
   "categorie": "probas",
   "titre": "L'intrus paie le café",
   "reponse": "4/3",
   "valeur": 1.3333333333333333,
   "tolerance": 0.005,
   "parent": "ct-p-egalite-piles"
  },
  {
   "id": "ct-p-craps-huit",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance deux dés de façon répétée. Probabilité d'obtenir un total de 8 avant d'obtenir un total de 7 ?",
   "solution": "On conditionne sur le premier lancer qui donne 7 ou 8 : $\\frac{p_8}{p_8 + p_7} = \\frac{5/36}{5/36 + 6/36} =$ **5/11**. C'est le calcul de chaque « point » au craps.",
   "indice": "Les lancers qui ne donnent ni 7 ni 8 ne comptent pas.",
   "categorie": "probas",
   "titre": "Un 8 avant un 7",
   "reponse": "5/11",
   "valeur": 0.45454545454545453,
   "tolerance": 0.005,
   "parent": "ct-p-craps"
  },
  {
   "id": "ct-p-distance-centre-carre",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On choisit un point uniforme dans un carré de côté 1. Probabilité qu'il soit plus près du centre du carré que du bord ?",
   "solution": "Centre en $(0, 0)$, carré $[-\\frac12, \\frac12]^2$, huitième $0 \\le x \\le y \\le \\frac12$ où le bord le plus proche est $y = \\frac12$. Condition : $\\sqrt{x^2 + y^2} < \\frac12 - y$, soit $y < \\frac14 - x^2$. On intègre entre la droite $y = x$ et la parabole, de $x = 0$ jusqu'à leur intersection $x_0 = \\frac{\\sqrt 2 - 1}{2}$ :\n$$\\int_0^{x_0} \\left(\\frac14 - x^2 - x\\right)dx,$$\npuis on multiplie par 8 (et divise par l'aire 1) : $\\frac{4\\sqrt 2 - 5}{3} \\approx$ **0,219**.",
   "indice": "Par symétrie, travaille dans un huitième du carré, où le bord le plus proche est un côté donné. La frontière est une parabole.",
   "categorie": "probas",
   "titre": "Plus près du centre que du bord",
   "reponse": "(4*sqrt(2)-5)/3",
   "valeur": 0.2189514164974602,
   "tolerance": 0.01,
   "parent": "ct-p-distance-centre"
  },
  {
   "id": "ct-p-distance-centre-boule",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On choisit un point uniforme dans une boule de rayon 1 (en dimension 3). Quelle est sa distance moyenne au centre ?",
   "solution": "Densité de $R$ : $3r^2$ sur $[0, 1]$. $\\mathbb{E}[R] = \\int_0^1 3r^3\\,dr =$ **3/4**. En dimension $d$ : $\\frac{d}{d + 1}$, de plus en plus proche de 1 : en grande dimension, presque tout le volume est près de la surface.",
   "indice": "$\\mathbb{P}(R \\le r) = r^3$.",
   "categorie": "probas",
   "titre": "Distance moyenne au centre d'une boule",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "parent": "ct-p-distance-centre"
  },
  {
   "id": "ct-p-laplace-general",
   "theme": "casse-tete",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une pièce de biais inconnu, uniforme a priori sur $[0, 1]$, donne 7 piles en 10 lancers. Probabilité que le lancer suivant soit pile ?",
   "solution": "A posteriori, $p \\sim \\mathrm{Beta}(k + 1, n - k + 1) = \\mathrm{Beta}(8, 4)$, de moyenne $\\frac{8}{12}$. Probabilité **$2/3$**, et non $0{,}7$ : l'a priori uniforme tire l'estimation vers $1/2$ (règle $\\frac{k + 1}{n + 2}$). Sans aucun lancer, on retrouve $1/2$.",
   "indice": "La loi a posteriori est une loi bêta.",
   "categorie": "probas",
   "titre": "La règle de succession, 7 piles sur 10",
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "parent": "ct-p-succession-laplace"
  },
  {
   "id": "proba-deux-enfants-aine",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une famille a deux enfants. On sait que l'**aîné** est un garçon. Probabilité que les deux soient des garçons ?",
   "solution": "L'information exclut FG et FF (aîné en premier) : il reste GG et GF, probabilité **1/2**. Avec « au moins un garçon », on gardait trois cas et l'on trouvait $1/3$ : la façon dont l'information a été obtenue change la réponse.",
   "indice": "Quels cas l'information exclut-elle cette fois ?",
   "categorie": "probas",
   "titre": "L'aîné est un garçon",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "parent": "proba-deux-enfants",
   "voir": [
    "ct-p-garcon-mardi"
   ]
  },
  {
   "id": "proba-monty-hall-cent",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "100 portes, une voiture. Tu en choisis une ; le présentateur, qui sait, ouvre 98 autres portes vides. Probabilité de gagner si tu changes pour la dernière porte fermée ?",
   "solution": "Ton choix initial gagne avec probabilité $1/100$, et l'ouverture des portes n'y change rien. Changer gagne avec probabilité **99/100**. Cette version rend l'intuition évidente : c'est la meilleure façon d'expliquer Monty Hall.",
   "indice": "Quelle est la probabilité que ton premier choix soit le bon ?",
   "categorie": "probas",
   "titre": "Monty Hall à 100 portes",
   "reponse": "99/100",
   "valeur": 0.99,
   "tolerance": 0.005,
   "parent": "proba-monty-hall"
  },
  {
   "id": "proba-monty-hall-hasard",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois portes. Tu choisis la porte 1 ; le présentateur, qui **ne sait pas** où est la voiture, ouvre au hasard l'une des deux autres, et elle se trouve vide. Probabilité de gagner en changeant ?",
   "solution": "Cas équiprobables (voiture, porte ouverte) : (1, 2), (1, 3), (2, 3), (3, 2), et (2, 2), (3, 3) où il montre la voiture. Sachant la porte ouverte vide, il reste 4 cas : la voiture est en 1 dans 2 cas, derrière l'autre porte fermée dans 2 cas. Changer ou non : **1/2**. Toute la valeur de l'énoncé d'origine vient de ce que le présentateur **sait**.",
   "indice": "Le fait que la porte ouverte soit vide est maintenant une information sur la position de la voiture.",
   "categorie": "probas",
   "titre": "Monty Hall avec un présentateur ignorant",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "parent": "proba-monty-hall"
  },
  {
   "id": "proba-monty-hall-gauche",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Tu choisis la porte 1. Le présentateur sait où est la voiture et ouvre toujours une porte vide ; quand il a le choix (voiture derrière ta porte), il ouvre la porte 2. Il ouvre la porte 2. Probabilité de gagner en changeant pour la porte 3 ?",
   "solution": "- Voiture en 1 (probabilité $1/3$) : il ouvre la 2 (règle).\n- Voiture en 3 ($1/3$) : il doit ouvrir la 2.\n- Voiture en 2 : il ouvre la 3, exclu.\nSachant qu'il ouvre la 2, la voiture est en 1 ou en 3 avec la même probabilité : changer gagne avec probabilité **1/2**. S'il avait ouvert la 3, changer gagnerait à coup sûr. En moyenne sur les deux cas, on retrouve $2/3$.",
   "indice": "Liste les positions de la voiture compatibles avec « il ouvre la porte 2 », avec leurs probabilités.",
   "categorie": "probas",
   "titre": "Monty Hall avec un présentateur prévisible",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "parent": "proba-monty-hall"
  },
  {
   "id": "proba-demi-cercle-quatre",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On place quatre points uniformément sur un cercle. Probabilité qu'ils soient tous dans un même demi-cercle ?",
   "solution": "Pour un point donné, les trois autres sont dans le demi-cercle horaire qui part de lui avec probabilité $(1/2)^3$ ; ces événements sont disjoints : $4 \\times 1/8 =$ **1/2**. En général $\\frac{n}{2^{n-1}}$.",
   "indice": "Même argument qu'à trois points : quel point « ouvre » le demi-cercle ?",
   "categorie": "probas",
   "titre": "Quatre points dans un demi-cercle",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "parent": "proba-demi-cercle",
   "voir": [
    "ct-p-triangle-aigu"
   ]
  },
  {
   "id": "proba-uniformes-decroissance",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On tire des uniformes indépendantes sur $[0, 1]$ et l'on s'arrête dès qu'un tirage est plus petit que le précédent. Combien de tirages en moyenne (le dernier compris) ?",
   "solution": "Les $n$ premiers tirages sont dans l'ordre croissant avec probabilité $1/n!$ (un ordre parmi $n!$ équiprobables). Donc $\\mathbb{E}[N] = \\sum_{n \\ge 0} \\mathbb{P}(N > n) = \\sum_{n \\ge 0} \\frac{1}{n!} =$ **$e$**. Même réponse que pour la somme qui dépasse 1, pour la même raison : un volume $1/n!$.",
   "indice": "$\\mathbb{P}(N > n)$ est la probabilité que les $n$ premiers tirages soient croissants.",
   "categorie": "probas",
   "titre": "Tirer jusqu'à une décroissance",
   "reponse": "e",
   "valeur": 2.718281828459045,
   "tolerance": 0.005,
   "parent": "proba-somme-uniformes-depasse-un"
  },
  {
   "id": "proba-anniversaires-99",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "À partir de combien de personnes la probabilité qu'au moins deux aient le même anniversaire dépasse-t-elle 99 % ?",
   "solution": "$\\exp\\left(-\\frac{n(n - 1)}{730}\\right) < 0{,}01 \\iff n(n - 1) > 730 \\ln 100 \\approx 3\\,362$, soit $n \\ge 59$ avec cette approximation, un peu pessimiste. Le calcul exact donne **57**. Ordre de grandeur général : $\\sqrt{2 \\times 365 \\times \\ln(1/\\varepsilon)}$.",
   "indice": "$\\mathbb{P}(\\text{aucune collision}) \\approx \\exp\\left(-\\frac{n(n - 1)}{730}\\right)$ ; cherche quand elle passe sous $0{,}01$.",
   "categorie": "probas",
   "titre": "Anniversaires : dépasser 99 %",
   "reponse": "57",
   "valeur": 57.0,
   "tolerance": 0.0,
   "parent": "proba-anniversaires"
  },
  {
   "id": "proba-de-relance-payante",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Tu lances un dé et reçois le montant affiché ; tu peux relancer autant de fois que tu veux, chaque relance coûtant 1 €. Valeur du jeu avec la meilleure stratégie ?",
   "solution": "Supposons qu'on garde 4, 5, 6 et qu'on relance 1, 2, 3 : $V = \\frac{4 + 5 + 6}{6} + \\frac12(V - 1)$, soit $V = 2{,}5 + \\frac{V}{2} - \\frac12$ et $V = 4$. Cohérence : relancer rapporte $V - 1 = 3$, donc on relance 1 et 2 et l'on est indifférent pour 3. Valeur **4 €**.",
   "indice": "Si le jeu vaut $V$, on relance tant que le résultat est inférieur à $V - 1$.",
   "categorie": "strategie",
   "titre": "Relances illimitées à 1 € chacune",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.0,
   "parent": "proba-de-avec-relance"
  },
  {
   "id": "proba-bertrand-cartes",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois cartes : l'une rouge des deux côtés, l'une blanche des deux côtés, l'une rouge d'un côté et blanche de l'autre. On en tire une au hasard et on la pose sur la table : la face visible est rouge. Probabilité que l'autre face soit rouge ?",
   "solution": "Il y a 3 faces rouges équiprobables, dont 2 sur la carte rouge-rouge : **2/3**. La réponse intuitive $1/2$ (« c'est l'une des deux cartes à face rouge ») oublie que la carte rouge-rouge a deux façons de montrer du rouge.",
   "indice": "Compte les **faces** rouges, pas les cartes.",
   "categorie": "probas",
   "titre": "Les trois cartes bicolores",
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "parent": "proba-bertrand-boites"
  },
  {
   "id": "proba-piece-truquee-mille",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Parmi 1 000 pièces, une a deux faces pile. Tu en prends une au hasard et la lances 10 fois : 10 piles. Probabilité d'avoir la pièce truquée ?",
   "solution": "Cote a posteriori : $\\frac{1}{999} \\times 1\\,024 = \\frac{1024}{999}$, soit une probabilité $\\frac{1024}{1024 + 999} = \\frac{1024}{2023} \\approx$ **0,506**. Malgré dix piles d'affilée, c'est à peine plus d'une chance sur deux : l'a priori est très défavorable.",
   "indice": "Raisonne en cotes : a priori 1 contre 999, rapport de vraisemblance $2^{10}$.",
   "categorie": "probas",
   "titre": "1 000 pièces dont une à deux piles",
   "reponse": "1024/2023",
   "valeur": 0.5061789421651013,
   "tolerance": 0.005,
   "parent": "proba-piece-truquee-bayes"
  },
  {
   "id": "proba-piece-truquee-deux",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux pièces : l'une normale, l'autre à deux faces pile. Tu en prends une au hasard et la lances 3 fois : 3 piles. Probabilité d'avoir la pièce truquée ?",
   "solution": "Cote a posteriori $8 : 1$, probabilité **8/9**.",
   "indice": "Cotes : a priori 1 contre 1, rapport de vraisemblance $2^3$.",
   "categorie": "probas",
   "titre": "Deux pièces, trois piles",
   "reponse": "8/9",
   "valeur": 0.8888888888888888,
   "tolerance": 0.005,
   "parent": "proba-piece-truquee-bayes"
  },
  {
   "id": "proba-de-mere-deux-des",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Probabilité d'obtenir au moins un double six en lançant 24 fois deux dés ?",
   "solution": "$1 - (35/36)^{24} \\approx$ **0,491**, moins de 1/2. Le chevalier pensait que ce pari valait le premier ($4/6 = 24/36$, « règle de proportionnalité ») ; elle ne vaut pas pour des probabilités : c'est l'erreur qui a lancé la correspondance Pascal-Fermat.",
   "indice": "Passe par le complémentaire.",
   "categorie": "probas",
   "titre": "Le second pari du chevalier de Méré",
   "reponse": "1-(35/36)^24",
   "valeur": 0.4914038761309034,
   "tolerance": 0.005,
   "parent": "proba-de-mere-un"
  },
  {
   "id": "der-formule-bs",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Écris la formule de Black-Scholes pour un call européen et explique $d_{1}$ et $d_{2}$.",
   "solution": "$C = S N(d_{1}) - K e^{-rT} N(d_{2})$, avec\n$d_{1} = [\\ln (S/K) + (r + \\sigma^{2}/2)T] / (\\sigma \\sqrt{T}), d_{2} = d_{1} - \\sigma \\sqrt{T}$.\n- **$N(d_{2})$** est la probabilité risque-neutre que le call finisse dans la monnaie.\n- **$N(d_{1})$** est le delta, et la probabilité d'exercice sous la mesure qui prend l'action comme numéraire.\n- Avec un dividende continu $q$ : remplacer $S$ par $S e^{-qT}$ (et $r$ par $r - q$ dans $d_{1}$).\nLecture : le call vaut « ce que je reçois » (l'action si exercice) moins « ce que je paie » ($K$ actualisé si exercice).",
   "en": "Write the Black-Scholes formula for a European call and explain $d_{1}$ and $d_{2}$.",
   "relances": [
    "Et le put ? ($K e^{-rT} N(-d_{2}) - S N(-d_{1})$)",
    "Que devient C quand $\\sigma \\to 0$ ? ($\\max (S - K e^{-rT}, 0)$) ; quand $\\sigma \\to \\infty$ ? ($S$)"
   ],
   "essentiel": true
  },
  {
   "id": "der-hypotheses-bs",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Quelles sont les hypothèses du modèle de Black-Scholes, et lesquelles sont les plus fausses en pratique ?",
   "solution": "Hypothèses : prix log-normal (brownien géométrique) à volatilité constante ; taux sans risque constant ; pas de coûts de transaction ni de contraintes de vente à découvert ; couverture continue ; pas d'arbitrage ; marché liquide.\nLes plus fausses :\n- **volatilité constante** : le smile et la structure par terme le contredisent ; la volatilité est stochastique et corrélée au prix (effet de levier) ;\n- **trajectoires continues** : il y a des sauts (annonces, krachs) ;\n- **couverture continue sans coût** : on couvre en discret, avec des coûts, d'où un risque résiduel (gamma).\nLe modèle reste utilisé comme langage : on cote les options en volatilité implicite.",
   "en": "What are the Black-Scholes assumptions, and which ones fail most in practice?",
   "relances": [
    "Pourquoi dit-on que Black-Scholes est « le mauvais nombre dans la mauvaise formule pour obtenir le bon prix » ? (on met dans la formule la volatilité implicite qui reproduit le prix de marché)"
   ],
   "essentiel": true
  },
  {
   "id": "der-parite-call-put",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Un call européen de strike 105 et de maturité 1 an vaut 8. Le sous-jacent vaut 100, il ne verse pas de dividende et les taux sont nuls. Que vaut le put de même strike et de même maturité ?",
   "solution": "Parité : $C - P = S - K e^{-rT}$, donc $P = C - S + K = 8 - 100 + 105 =$ **13**.\nDémonstration : long call + short put $= (S_T - K)$ dans tous les cas = un forward ; par absence d'arbitrage, même prix aujourd'hui.",
   "en": "A 1-year European call struck at 105 is worth 8. Spot is 100, no dividends, zero rates. What is the put with the same strike and maturity worth?",
   "relances": [
    "La parité dépend-elle d'un modèle ? (non : seulement de l'absence d'arbitrage, pour des options européennes)",
    "Et pour des options américaines ? (seulement des inégalités : $S - K \\le C - P \\le S - K e^{-rT}$ sans dividende)"
   ],
   "reponse": "13",
   "valeur": 13.0,
   "tolerance": 0.005,
   "duree": 90,
   "essentiel": true
  },
  {
   "id": "der-approx-atm",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Estime de tête le prix d'un call à la monnaie, $S = K = 100, \\sigma = 20\\,\\%$, maturité 1 an, taux nuls.",
   "solution": "$C \\approx 0{,}4 \\times 0{,}2 \\times 100 \\times 1 =$ **8** (valeur exacte : $100(2N(0{,}1) - 1) \\approx 7{,}97$).\nL'approximation vient d'un développement de $N$ au voisinage de 0 : $C \\approx S \\sigma \\sqrt{T} / \\sqrt{2\\pi}$.",
   "en": "Estimate mentally the price of an at-the-money call: $S = K = 100, \\sigma = 20\\,\\%, 1$ year, zero rates.",
   "indice": "Approximation à la monnaie : $C \\approx 0{,}4 \\cdot \\sigma \\cdot S \\cdot \\sqrt{T}$ (car $1/\\sqrt{2\\pi} \\approx 0{,}4$).",
   "relances": [
    "Prix du straddle à la monnaie ? ($\\approx 0{,}8 \\sigma S \\sqrt{T} \\approx 16$)",
    "Si la maturité passe à 3 mois ? (divisé par 2, car $\\sqrt{1/4} = 1/2$)"
   ],
   "reponse": "100*(N(0.1)-N(-0.1))",
   "valeur": 7.965567455405798,
   "tolerance": 0.01,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "der-delta-atm",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Delta d'un call à la monnaie $(S = K = 100), \\sigma = 20\\,\\%$, maturité 1 an, taux nuls ? Pourquoi n'est-il pas exactement 0,5 ?",
   "solution": "$\\Delta = N(d_{1})$ avec $d_{1} = \\sigma \\sqrt{T}/2 = 0{,}1$ : **$\\Delta \\approx 0{,}540$**.\nIl dépasse 0,5 à cause du terme $+\\sigma^{2}/2$ : la loi log-normale est asymétrique à droite. Le call de delta 0,5 a un strike un peu au-dessus du forward ($K = F e^{\\sigma^{2}T/2}$).",
   "en": "Delta of an ATM call $(S = K = 100), \\sigma = 20\\,\\%, 1$ year, zero rates? Why isn't it exactly 0.5?",
   "relances": [
    "Delta du put ? ($N(d_{1}) - 1 \\approx -0{,}46$)",
    "Que devient le delta d'un call à la monnaie quand la maturité tend vers 0 ? (0,5)"
   ],
   "reponse": "N(0.1)",
   "valeur": 0.539827837277029,
   "tolerance": 0.005,
   "duree": 90,
   "essentiel": true
  },
  {
   "id": "der-gamma-atm",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Gamma d'un call à la monnaie, $S = K = 100, \\sigma = 20\\,\\%$, maturité 1 an, taux nuls ? De combien le delta bouge-t-il si le sous-jacent prend 1 point ?",
   "solution": "$\\Gamma = \\varphi (d_{1})/(S\\sigma \\sqrt{T}) = \\varphi (0{,}1)/20 \\approx 0{,}397/20 \\approx$ **0,0198**. Une hausse d'un point fait passer le delta d'environ 0,540 à 0,560.\nOrdre de grandeur à retenir : à la monnaie, $\\Gamma \\approx 0{,}4/(S\\sigma \\sqrt{T})$.",
   "en": "Gamma of an ATM call, $S = K = 100, \\sigma = 20\\,\\%, T = 1$, zero rates? How much does delta move for a 1-point move in spot?",
   "relances": [
    "Où le gamma est-il maximal ? (près de la monnaie, et il explose quand la maturité tend vers 0)",
    "Quel lien entre gamma et vega pour une option vanille ? (Vega $= \\Gamma S^{2} \\sigma T$)"
   ],
   "reponse": "phi(0.1)/(100*0.2)",
   "valeur": 0.01984762737385059,
   "tolerance": 0.01,
   "duree": 150
  },
  {
   "id": "der-vega-point",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Un call à la monnaie ($S = K = 100$, maturité 1 an, taux nuls) est coté avec 20 % de volatilité. De combien augmente son prix si la volatilité passe à 21 % ?",
   "solution": "Vega $= S\\sqrt{T} \\varphi (d_{1}) \\approx 100 \\times 0{,}397 \\approx 39{,}7$ par unité de volatilité, soit **$\\approx 0{,}40$ par point de vol**. Le calcul exact ($7{,}97 \\to 8{,}36$) donne 0,397.\nApproximation : à la monnaie, le prix est presque linéaire en $\\sigma$ ($0{,}4 S \\sqrt{T}$ par unité), d'où vega $\\approx 0{,}4 S \\sqrt{T}$.",
   "en": "An ATM call ($S = K = 100$, 1 year, zero rates) is priced at 20% vol. By how much does its price increase if vol goes to 21%?",
   "relances": [
    "Où le vega est-il maximal ? (près de la monnaie ; il croît avec la maturité en $\\sqrt{T}$)",
    "Pourquoi les options longues sont-elles surtout un pari sur la vol, les courtes sur le gamma ?"
   ],
   "reponse": "100*(2*N(0.105)-1)-100*(2*N(0.1)-1)",
   "valeur": 0.39685167253513765,
   "tolerance": 0.01,
   "duree": 150
  },
  {
   "id": "der-digitale-prix",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Que vaut une option digitale qui paie 1 si $S_T > 100$ ($S_{0} = 100, \\sigma = 20\\,\\%$, maturité 1 an, taux nuls) ?",
   "solution": "Prix $= e^{-rT} N(d_{2})$ avec $d_{2} = -\\sigma \\sqrt{T}/2 = -0{,}1$ : **$\\approx 0{,}460$**.\nCe n'est pas 0,5 : sous la mesure risque-neutre avec taux nuls, la médiane de $S_T$ est sous 100.",
   "en": "Price of a digital option paying 1 if $S_T > 100$ ($S_{0} = 100, \\sigma = 20\\,\\%, T = 1$, zero rates)?",
   "relances": [
    "Comment répliquer une digitale avec des calls ? (call spread serré : $[C(K - \\varepsilon) - C(K + \\varepsilon)]/(2\\varepsilon)$, donc digitale $= - \\partial C/ \\partial K$)",
    "En quoi le smile change-t-il le prix ? (digitale $= - \\partial C/ \\partial K$ au total : $-\\partial C_{BS}/\\partial K - \\text{Vega} \\cdot \\partial \\sigma / \\partial K$ ; avec un skew négatif, la digitale call coûte plus cher que $N(d_{2})$)"
   ],
   "reponse": "N(-0.1)",
   "valeur": 0.460172162722971,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "der-digitale-replication",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi les digitales sont-elles difficiles à couvrir près de l'échéance ? Comment les banques gèrent-elles ce risque ?",
   "solution": "Près de l'échéance et du strike, le delta d'une digitale ($\\approx$ densité au strike) devient énorme et change de signe très vite : le gamma est explosif, la couverture en delta demande des volumes déraisonnables (« pin risk »).\nGestion : on la risque-manage comme un **call spread** légèrement décalé dans le sens conservateur (« overhedge », par exemple entre $K - \\varepsilon$ et $K$), ce qui borne les Greeks et facture la différence au client. Le prix inclut aussi le skew (dérivée de la vol implicite en $K$).",
   "en": "Why are digital options hard to hedge close to expiry? How do banks manage it?"
  },
  {
   "id": "der-greeks-signes",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pour un call acheté et un put acheté, donne le signe de delta, gamma, vega, theta et rho.",
   "solution": "| Greek | Call acheté | Put acheté |\n|---|---|---|\n| Delta | + (entre 0 et 1) | − (entre $-1$ et 0) |\n| Gamma | + | + (même gamma que le call) |\n| Vega | + | + |\n| Theta | − en général | − en général (peut être + pour un put européen très dans la monnaie) |\n| Rho | + | − |\nÊtre long d'une option, c'est être long de la convexité (gamma, vega) et payer le temps (theta).",
   "en": "For a long call and a long put, give the sign of delta, gamma, vega, theta and rho.",
   "relances": [
    "Pourquoi le gamma d'un call et celui d'un put de même strike sont-ils égaux ? (parité : call − put = forward, dont le gamma est nul)"
   ],
   "essentiel": true
  },
  {
   "id": "der-gamma-theta",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Quelle relation lie theta et gamma pour un portefeuille couvert en delta ? Comment l'interpréter ?",
   "solution": "L'EDP de Black-Scholes s'écrit $\\Theta + rS\\Delta + \\tfrac12 \\sigma^{2}S^{2}\\Gamma = rV$. Pour un portefeuille delta-neutre et avec $r \\approx 0$ : **$\\Theta \\approx - \\tfrac12 \\sigma^{2}S^{2}\\Gamma$**.\nInterprétation : être long gamma (on gagne sur les grands mouvements, dans les deux sens) se paie par une perte de valeur temps chaque jour. Sur un pas $dt$, le PnL d'une position couverte est $\\approx \\tfrac12 \\Gamma S^{2}[(\\Delta S/S)^{2} - \\sigma^{2}dt]$ : on gagne si le marché bouge plus que la volatilité implicite.",
   "en": "What relation links theta and gamma for a delta-hedged portfolio? How do you interpret it?",
   "relances": [
    "Un market maker vend des options et se couvre en delta : quand gagne-t-il ? (si la volatilité réalisée est inférieure à l'implicite vendue)"
   ],
   "essentiel": true
  },
  {
   "id": "der-pnl-couverture",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Tu achètes une option à 20 % de volatilité implicite et tu la couvres en delta jusqu'à l'échéance. La volatilité réalisée est de 25 %. Gagnes-tu de l'argent ? De quoi dépend le PnL ?",
   "solution": "Le PnL instantané de la position couverte vaut $\\tfrac12 \\Gamma S^{2}(\\sigma_\\text{réalisée}^{2} - \\sigma_\\text{implicite}^{2})dt$. Avec $25\\,\\% > 20\\,\\%$, tu gagnes **en espérance**, mais le gain total est\n$\\tfrac12 \\int \\Gamma_t S_t^{2} (\\sigma_r^{2} - \\sigma_i^{2}) dt$ :\nil dépend du chemin. Si le sous-jacent bouge beaucoup quand l'option est loin de la monnaie (gamma faible), tu gagnes peu ; s'il bouge près du strike à l'approche de l'échéance (gamma fort), tu gagnes beaucoup.\nDétails : si tu couvres avec le delta calculé à la vol implicite, le PnL dépend du chemin ; avec le delta à la vol réalisée (inconnue a priori), le PnL final est déterministe mais le PnL intermédiaire fluctue.",
   "en": "You buy an option at 20% implied vol and delta-hedge it until expiry. Realized vol is 25%. Do you make money? What does the $P$&L depend on?",
   "relances": [
    "Comment parier sur la volatilité sans cette dépendance au chemin ? (swap de variance : son payoff est la variance réalisée moins le strike, répliqué par un portefeuille d'options pondérées en $1/K^{2}$)"
   ]
  },
  {
   "id": "der-call-americain",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Pourquoi n'est-il jamais optimal d'exercer tôt un call américain sur une action sans dividende ? Et un put ?",
   "solution": "Call sans dividende : $C \\ge S - K e^{-rT} > S - K$ (pour $r > 0$). L'option vaut toujours plus que sa valeur d'exercice : mieux vaut la vendre (ou garder la protection contre une baisse et payer $K$ plus tard). Donc call américain = call européen.\nPut : exercer tôt peut être optimal si le put est très dans la monnaie, car recevoir $K$ tout de suite rapporte des intérêts, ce qui peut valoir plus que la valeur temps restante. Le put américain vaut strictement plus que l'européen (si $r > 0$).\nAvec des dividendes, exercer un call juste avant le détachement peut être optimal.",
   "en": "Why is it never optimal to exercise early an American call on a non-dividend-paying stock? What about a put?",
   "relances": [
    "Comment pricer un put américain ? (arbre binomial, EDP avec contrainte d'obstacle, Monte-Carlo de Longstaff-Schwartz)"
   ],
   "essentiel": true
  },
  {
   "id": "der-convexite-strike",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi le prix d'un call doit-il être décroissant et convexe en fonction du strike ? Que représente $\\partial^{2}C/ \\partial K^{2}$ ?",
   "solution": "- **Décroissant** : un call de strike plus bas paie toujours au moins autant. Sinon : acheter le call de strike bas, vendre celui de strike haut = arbitrage.\n- **Convexe** : un butterfly ($C(K - h) - 2C(K) + C(K + h)$) a un payoff positif ou nul, donc un prix positif ou nul.\n- **Breeden-Litzenberger** : $\\partial^{2}C/ \\partial K^{2} = e^{-rT} q(K)$, où $q$ est la densité risque-neutre de $S_T$. Une convexité violée équivaut à une densité négative : arbitrage papillon.\nC'est exactement ce que contrôle la condition $g(k) \\ge 0$ de Gatheral-Jacquier dans ton projet de surface de volatilité.",
   "en": "Why must the call price be decreasing and convex in the strike? What does $\\partial^{2}C/ \\partial K^{2}$ represent?",
   "relances": [
    "Quelles bornes encadrent la pente $\\partial C/ \\partial K$ ? (entre $-e^{-rT}$ et 0)"
   ]
  },
  {
   "id": "der-bornes",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Donne des bornes de non-arbitrage pour le prix d'un call européen (sans dividende).",
   "solution": "**$\\max (S - K e^{-rT}, 0) \\le C \\le S$.**\n- $C \\le S$ : le call paie au plus $S_T$.\n- $C \\ge S - K e^{-rT}$ : le call domine un forward acheté (payoff $\\max (S_T - K, 0) \\ge S_T - K$).\n- $C \\ge 0$.\nPour un put : $\\max (K e^{-rT} - S, 0) \\le P \\le K e^{-rT}$.",
   "en": "Give no-arbitrage bounds for the price of a European call (no dividends)."
  },
  {
   "id": "der-smile",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi observe-t-on un smile, et plus précisément un skew négatif, sur les options d'actions ?",
   "solution": "Si Black-Scholes était vrai, la volatilité implicite serait la même pour tous les strikes. Le smile traduit des queues de distribution plus épaisses que la log-normale. Le skew actions (puts de strike bas plus chers en vol) vient :\n- de l'asymétrie des rendements : les krachs sont plus brutaux que les hausses ;\n- de l'**effet de levier** et de la corrélation négative spot-vol : quand le marché baisse, la volatilité monte ;\n- de la **demande de protection** : les investisseurs achètent des puts, les teneurs de marché, vendeurs, demandent une prime.\nHistoriquement, le skew actions s'est fortement creusé après le krach de 1987.\nSur le change, le smile est plus symétrique ; sur certaines matières premières, le skew peut être positif (peur des hausses).",
   "en": "Why is there a volatility smile, and more precisely a negative skew, on equity options?",
   "relances": [
    "Quels modèles reproduisent le smile ? (volatilité locale, volatilité stochastique, sauts, SABR)",
    "Que dit le skew de la distribution risque-neutre ? (queue gauche épaisse, asymétrie négative)"
   ],
   "essentiel": true
  },
  {
   "id": "der-forward-dividende",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Action à 100, taux continu 5 %, dividende continu 2 %. Prix forward à 1 an ?",
   "solution": "$F = S e^{(r - q)T} = 100 e^{0{,}03} \\approx$ **103,05**.\nRéplication : emprunter $S$ pour acheter l'action, recevoir les dividendes, rembourser $S e^{rT}$ ; le forward doit coûter ce que coûte ce portage.",
   "en": "Stock at 100, continuous rate 5%, continuous dividend yield 2%. One-year forward price?",
   "relances": [
    "Et avec un dividende discret $D$ versé avant l'échéance ? ($F = (S - D e^{-r t_D})\\, e^{rT}$)"
   ],
   "reponse": "100*exp(0.03)",
   "valeur": 103.0454533953517,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "der-forward-futures",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Quelle différence entre un forward et un futures ? Leurs prix sont-ils égaux ?",
   "solution": "- **Forward** : contrat de gré à gré, réglé à l'échéance, avec risque de contrepartie (aujourd'hui souvent collatéralisé).\n- **Futures** : contrat standardisé, coté, avec chambre de compensation et appels de marge **quotidiens** (règlement au jour le jour).\nPrix : égaux si les taux sont déterministes. Avec des taux stochastiques corrélés au sous-jacent, le futures diffère : si le sous-jacent monte quand les taux montent, les gains de marge sont réinvestis à taux élevés, le futures vaut plus que le forward (ajustement de convexité, important sur les futures de taux).",
   "en": "What is the difference between a forward and a futures contract? Are their prices equal?"
  },
  {
   "id": "der-barriere-parite",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'une option à barrière « knock-out » ? Quelle relation entre knock-in et knock-out ?",
   "solution": "Une knock-out est une option vanille qui disparaît si le sous-jacent touche une barrière avant l'échéance ; une knock-in n'existe que si la barrière est touchée.\n**Knock-in + knock-out = vanille** (même strike, barrière, maturité) : exactement l'une des deux est active à l'échéance.\nUne barrière coûte donc moins cher que la vanille. Points de vigilance : surveillance discrète ou continue (correction de Broadie-Glasserman), gamma et vega très forts près de la barrière, sensibilité au smile (prix différent en vol locale et en vol stochastique).",
   "en": "What is a knock-out barrier option? What relation links knock-in and knock-out options?",
   "relances": [
    "Un up-and-out call avec une barrière sous le strike vaut combien ? (0 : il faut passer au-dessus du strike donc toucher la barrière)"
   ]
  },
  {
   "id": "der-asiatique",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Une option asiatique (sur la moyenne du sous-jacent) est-elle plus ou moins chère qu'une option européenne de même strike ? Pourquoi ?",
   "solution": "Moins chère (à la monnaie) : la moyenne est moins volatile que le prix final. Pour un brownien, la moyenne sur [$0, T$] a une variance $T/3$ contre $T$ pour la valeur finale : volatilité effective $\\approx \\sigma /\\sqrt{3}$.\nPas de formule fermée pour la moyenne arithmétique (une somme de log-normales n'est pas log-normale) : Monte-Carlo, avec l'asiatique géométrique (formule fermée) comme variable de contrôle.",
   "en": "Is an Asian option (on the average price) cheaper or more expensive than the corresponding European option? Why?",
   "relances": [
    "Pourquoi les acheteurs de matières premières aiment-elles les asiatiques ? (elles couvrent un coût moyen sur la période et sont moins manipulables à une date précise)"
   ]
  },
  {
   "id": "der-monte-carlo-variance",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment réduire la variance d'un estimateur Monte-Carlo de prix d'option ? Donne trois méthodes.",
   "solution": "L'erreur standard vaut $\\sigma /\\sqrt{N}$ : diviser l'erreur par 10 coûte 100 fois plus de trajectoires, d'où l'intérêt de réduire $\\sigma$.\n- **Variables antithétiques** : utiliser $Z$ et $-Z$ ; efficace si le payoff est monotone en $Z$.\n- **Variable de contrôle** : ajouter $c(Y - \\mathbb{E}[Y])$ avec $Y$ corrélé au payoff et $\\mathbb{E}[Y]$ connu (le sous-jacent actualisé, une asiatique géométrique, un call vanille).\n- **Échantillonnage préférentiel** : tirer davantage là où le payoff compte (options très hors de la monnaie), corriger par le rapport de vraisemblance.\n- Aussi : quasi-Monte-Carlo (suites de Sobol), stratification, conditionnement.",
   "en": "How do you reduce the variance of a Monte Carlo option-pricing estimator? Give three methods.",
   "relances": [
    "Comment calculer un delta par Monte-Carlo ? (différences finies avec les mêmes tirages, méthode trajectorielle, rapport de vraisemblance)"
   ]
  },
  {
   "id": "der-differences-finies",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Tu résous l'EDP de Black-Scholes par différences finies. Schéma explicite, implicite ou Crank-Nicolson : avantages et pièges ?",
   "solution": "- **Explicite** : simple, mais stable seulement si $\\Delta t \\le \\Delta x^{2}/(\\sigma^{2}S^{2})$ environ (condition de type CFL) : pas de temps minuscules quand la grille s'affine.\n- **Implicite** : inconditionnellement stable, système tridiagonal à résoudre à chaque pas (algorithme de Thomas, O($n$)), précision d'ordre 1 en temps.\n- **Crank-Nicolson** : ordre 2 en temps et stable, mais produit des oscillations parasites sur des payoffs non lisses (digitales, strike d'un call) : on démarre par quelques pas implicites (lissage de Rannacher).\nAutres points : conditions aux bords, grille en $\\log S$, maillage resserré autour du strike et des barrières.",
   "en": "You solve the Black-Scholes PDE by finite differences. Explicit, implicit or Crank-Nicolson: pros and pitfalls?"
  },
  {
   "id": "der-vol-locale-stochastique",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Volatilité locale (Dupire) ou volatilité stochastique (Heston) : quelles différences, et quand cela change-t-il le prix ?",
   "solution": "- **Volatilité locale** : $\\sigma (t, S)$ déterministe, déduite de toute la surface de vanilles par la formule de Dupire. Elle reproduit exactement les vanilles d'aujourd'hui.\n- **Volatilité stochastique** : la variance a sa propre dynamique (Heston : retour à la moyenne, vol de vol, corrélation spot-vol). Calibration approximative du smile, surtout pour les maturités courtes.\nLes deux peuvent donner les mêmes vanilles mais pas la même **dynamique du smile** : en vol locale, quand le spot bouge, le smile se déplace dans le sens opposé à celui observé sur le marché (critique de Hagan et al., 2002, à l'origine de SABR), et les smiles futurs (forward) s'aplatissent ; en vol stochastique, le smile se déplace avec le spot et les smiles futurs gardent leur forme. Les produits sensibles au smile forward (options à départ différé, cliquets, barrières, variance options) ont des prix très différents. D'où des modèles mixtes : vol locale stochastique (LSV).",
   "en": "Local volatility (Dupire) vs stochastic volatility (Heston): what are the differences, and when does it matter for pricing?",
   "relances": [
    "Formule de Dupire ? ($\\sigma^{2}(K, T) = (\\partial C/ \\partial T + (r - q)K \\partial C/ \\partial K + qC) / (\\tfrac12 K^{2} \\partial^{2}C/ \\partial K^{2})$)"
   ]
  },
  {
   "id": "der-heston",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Écris le modèle de Heston et le rôle de chaque paramètre. Qu'est-ce que la condition de Feller ?",
   "solution": "$dS = \\mu S dt + \\sqrt{v} S dW_{1}, dv = \\kappa (\\theta - v) dt + \\xi \\sqrt{v} dW_{2}, d \\langle W_{1}, W_{2} \\rangle = \\rho dt$.\n- $v_{0}$ : variance actuelle (niveau des vols courtes) ;\n- $\\theta$ : variance de long terme (niveau des vols longues) ;\n- $\\kappa$ : vitesse de retour à $\\theta$ (forme de la structure par terme) ;\n- $\\xi$ : volatilité de la variance (courbure du smile) ;\n- $\\rho$ : corrélation spot-variance (pente du skew ; $\\rho < 0$ pour les actions).\n**Feller** : $2\\kappa \\theta \\ge \\xi^{2}$ garantit que la variance ne touche pas 0. Souvent violée par les calibrations, d'où des schémas de simulation adaptés (QE d'Andersen).\nPrix : semi-analytique par la fonction caractéristique et une intégrale de Fourier (Gil-Pelaez, Carr-Madan), avec la forme « little Heston trap » pour éviter les discontinuités du logarithme complexe : c'est ce que fait un projet de surface de volatilité.",
   "en": "Write the Heston model and the role of each parameter. What is the Feller condition?",
   "relances": [
    "Pourquoi $\\rho < 0$ donne-t-il un skew négatif ? (quand le spot baisse, la variance monte : queue gauche épaisse)"
   ]
  },
  {
   "id": "der-sabr",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que le modèle SABR et où est-il utilisé ?",
   "solution": "$dF = \\alpha F^\\beta dW_{1}, d\\alpha = \\nu \\alpha dW_{2}, d \\langle W_{1}, W_{2} \\rangle = \\rho dt$, sur le forward $F$.\n- $\\alpha$ : niveau de volatilité ; $\\beta$ : forme du « backbone » (comment la vol à la monnaie bouge avec $F$ ; souvent fixé) ; $\\rho$ : pente du skew ; $\\nu$ : vol de vol, courbure du smile.\nUtilisé surtout en **taux** (swaptions, caps) grâce à la formule asymptotique de Hagan qui donne directement une volatilité implicite. Limite : la formule peut donner des densités négatives pour des strikes très bas ; variantes sans arbitrage et « shifted SABR » pour les taux négatifs.",
   "en": "What is the SABR model and where is it used?"
  },
  {
   "id": "der-risque-neutre",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Explique la valorisation risque-neutre à quelqu'un qui ne la connaît pas. Pourquoi le rendement espéré de l'action n'apparaît-il pas dans le prix d'une option ?",
   "solution": "Une option peut être **répliquée** par un portefeuille dynamique d'action et de cash (couverture en delta). Par absence d'arbitrage, son prix est le coût de cette réplication, quelles que soient les préférences des investisseurs. Comme le portefeuille couvert est sans risque, on peut faire le calcul « comme si » tout le monde était neutre au risque : tous les actifs rapportent alors le taux sans risque, et le prix est l'espérance actualisée du payoff sous cette probabilité $Q$.\nLe rendement espéré $\\mu$ disparaît parce que le risque directionnel est neutralisé par la couverture : seule la volatilité compte. $\\mu$ influence les probabilités réelles d'exercice, pas le prix.",
   "en": "Explain risk-neutral pricing to a layperson. Why doesn't the expected return of the stock appear in the option price?",
   "relances": [
    "Que se passe-t-il si le marché n'est pas complet (sauts, vol stochastique) ? (plusieurs mesures risque-neutres possibles : le prix dépend du prix du risque choisi, calibré au marché)"
   ],
   "essentiel": true
  },
  {
   "id": "der-edp-bs",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Redémontre l'équation aux dérivées partielles de Black-Scholes.",
   "solution": "$dS = \\mu S dt + \\sigma S dW$. Par Itô : $dV = (V_t + \\mu S V_S + \\tfrac12 \\sigma^{2}S^{2} V_{SS}) dt + \\sigma S V_S dW$.\nPortefeuille $\\Pi = V - \\Delta S$ : $d\\Pi = dV - \\Delta dS$. Avec **$\\Delta = V_S$**, le terme en $dW$ (et $\\mu$) disparaît :\n$d\\Pi = (V_t + \\tfrac12 \\sigma^{2}S^{2} V_{SS}) dt$.\nSans risque, il doit rapporter le taux sans risque : $d\\Pi = r\\Pi dt = r(V - S V_S) dt$. D'où\n**$V_t + rS V_S + \\tfrac12 \\sigma^{2}S^{2} V_{SS} - rV = 0$**, avec la condition terminale $V(T, S) =$ payoff.",
   "en": "Derive the Black-Scholes PDE.",
   "indice": "Portefeuille $\\Pi = V - \\Delta S$, applique Itô à $V(t, S)$, choisis $\\Delta$ pour annuler le terme en $dW$.",
   "essentiel": true
  },
  {
   "id": "der-straddle-vol-implicite",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Un straddle à la monnaie de maturité 3 mois sur un sous-jacent à 100 (taux nuls) cote 8. Quelle volatilité implicite, de tête ?",
   "solution": "$8 \\approx 0{,}8 \\times \\sigma \\times 100 \\times \\sqrt{0{,}25} = 40\\sigma$, donc **$\\sigma \\approx 20\\,\\%$** (l'inversion exacte de Black-Scholes donne 20,06 %).\nRéflexe utile chez un teneur de marché : un straddle à la monnaie coûte environ l'écart-type du sous-jacent à l'échéance $\\times 0{,}8$ (car $E|Z| = \\sqrt{2/\\pi} \\approx 0{,}8$).",
   "en": "A 3-month ATM straddle on an underlying at 100 (zero rates) trades at 8. What implied volatility, mentally?",
   "indice": "Straddle à la monnaie $\\approx 0{,}8 \\cdot \\sigma \\cdot S \\cdot \\sqrt{T}$.",
   "relances": [
    "Le mouvement quotidien moyen attendu correspondant ? ($\\sigma /\\sqrt{252} \\approx 1{,}26\\,\\%$ par jour, soit environ 1 point)"
   ],
   "reponse": "0.2006",
   "valeur": 0.2006,
   "tolerance": 0.01,
   "duree": 180
  },
  {
   "id": "der-option-carre",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Dans Black-Scholes avec taux nuls, $S_{0} = 100, \\sigma = 20\\,\\%$, combien vaut un contrat qui paie $S_T^{2}$ dans 1 an ?",
   "solution": "Sous $Q, S_T = S_{0} \\exp (-\\sigma^{2}T/2 + \\sigma W_T)$, donc $S_T^{2} = S_{0}^{2} \\exp (-\\sigma^{2}T + 2\\sigma W_T)$ et $\\mathbb{E}[S_T^{2}] = S_{0}^{2} \\exp (-\\sigma^{2}T + 2\\sigma^{2}T) = S_{0}^{2} e^{\\sigma^{2}T}$.\nPrix : $10\\,000 \\times e^{0{,}04} \\approx$ **10 408,1**.",
   "en": "In Black-Scholes with zero rates, $S_{0} = 100, \\sigma = 20\\,\\%$, what is the price of a contract paying $S_T^{2}$ in one year?",
   "relances": [
    "Plus généralement, prix de $S_T^n$ ? ($S_{0}^{n} \\exp (n(r - \\sigma^{2}/2)T + n^{2}\\sigma^{2}T/2) \\times e^{-rT}$)"
   ],
   "reponse": "10000*exp(0.04)",
   "valeur": 10408.107741923883,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "der-proba-exercice",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Un call a un delta de 0,30. Peut-on dire qu'il a 30 % de chances de finir dans la monnaie ?",
   "solution": "À peu près, mais pas exactement :\n- la probabilité risque-neutre d'exercice est $N(d_{2})$, légèrement inférieure à $N(d_{1}) =$ delta ;\n- la probabilité réelle dépend de la dérive réelle $\\mu$, pas de $r$.\nEn pratique les traders utilisent le delta comme approximation rapide de la probabilité d'exercice, en sachant que l'écart grandit avec $\\sigma \\sqrt{T}$.",
   "en": "A call has a delta of 0.30. Can you say it has a 30% chance of finishing in the money?"
  },
  {
   "id": "der-sensibilite-taux-dividendes",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Comment le prix d'un call varie-t-il quand les taux montent ? Et quand un dividende plus élevé est annoncé ?",
   "solution": "- **Taux en hausse** : le forward $S e^{rT}$ monte et le strike actualisé $K e^{-rT}$ baisse : le call prend de la valeur (rho $> 0$), le put en perd.\n- **Dividende plus élevé** : le forward baisse (l'action perd le dividende au détachement) : le call perd de la valeur, le put en gagne.\nRaisonner en forward évite les erreurs : un call est un call sur le forward.",
   "en": "How does a call price change when rates rise? And when a higher dividend is announced?"
  },
  {
   "id": "der-arbre-un-pas",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une action vaut 100 et vaudra 120 ou 80 dans un an. Taux nul. Que vaut un call de strike 100 à un an ?",
   "solution": "$q = (100 - 80)/(120 - 80) = 1/2$. Prix $= q \\times 20 + (1 - q) \\times 0 =$ **10**.\nPar réplication : $\\Delta = (20 - 0)/(120 - 80) = 0{,}5$ action ; le portefeuille 0,5 action $- 40$ de cash vaut 20 ou 0, comme le call ; il coûte $50 - 40 = 10$.",
   "en": "A stock at 100 will be worth 120 or 80 in one year. Zero rates. What is a one-year call struck at 100 worth?",
   "indice": "Probabilité risque-neutre $q$ telle que l'action soit une martingale : $100 = 120q + 80(1 - q)$.",
   "relances": [
    "Et si la vraie probabilité de hausse est 90 % ? (le prix ne change pas : seule compte la réplication)",
    "Et avec un taux de 5 % sur la période ? ($q = (105 - 80)/40 = 0{,}625$ ; prix $0{,}625 \\times 20/1{,}05 \\approx 11{,}90$)"
   ],
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 150,
   "essentiel": true
  },
  {
   "id": "der-arbre-delta",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Même arbre à une période ($100 \\to 120$ ou 80, taux nul). Combien d'actions faut-il détenir pour couvrir un call vendu de strike 100 ?",
   "solution": "$\\Delta = (C_\\text{haut} - C_\\text{bas})/(S_\\text{haut} - S_\\text{bas}) = (20 - 0)/(120 - 80) =$ **0,5** action. C'est l'équivalent discret de $\\partial C/ \\partial S$.",
   "en": "One-period tree ($100 \\to 120$ or 80, zero rates). How many shares hedge a short call struck at 100?",
   "reponse": "0.5",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "der-arbre-deux-pas",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Arbre à deux périodes : à chaque pas l'action est multipliée par 1,1 ou 0,9. Départ à 100, taux nul. Prix d'un call européen de strike 100 à l'issue des deux pas ?",
   "solution": "$q = (1 - 0{,}9)/(1{,}1 - 0{,}9) = 1/2$. Valeurs finales : 121 (proba $1/4$), $99 (1/2), 81 (1/4)$. Seul 121 paie 21 : prix $= 21/4 =$ **5,25**.",
   "en": "Two-step tree: each step the stock is multiplied by 1.1 or 0.9. Start at 100, zero rates. Price of a European call struck at 100 after two steps?",
   "relances": [
    "Pourquoi l'arbre est-il « recombinant » ? (haut puis bas = bas puis haut : 99 ; le nombre de nœuds croît linéairement)",
    "Lien avec Black-Scholes ? (avec $u = e^{\\sigma \\sqrt{\\Delta}t}, d = 1/u$ et $\\Delta t \\to 0$, le prix converge vers Black-Scholes : Cox-Ross-Rubinstein)"
   ],
   "reponse": "21/4",
   "valeur": 5.25,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "der-put-americain-arbre",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Arbre à deux périodes : l'action vaut 100 et est multipliée par 1,2 ou 0,8 à chaque période ; le taux est de 5 % par période. Prix d'un put **américain** de strike 100 ?",
   "solution": "$q = 0{,}625$. Valeurs finales : 144, 96, 64 ; payoffs du put : 0, 4, 36.\n- Nœud 120 : continuation $(0{,}625 \\times 0 + 0{,}375 \\times 4)/1{,}05 \\approx 1{,}43$ ; exercice $0 \\to$ **1,43**.\n- Nœud 80 : continuation $(0{,}625 \\times 4 + 0{,}375 \\times 36)/1{,}05 \\approx 15{,}24$ ; exercice $20 \\to$ **20** (on exerce tôt).\n- Racine : $(0{,}625 \\times 1{,}43 + 0{,}375 \\times 20)/1{,}05 \\approx$ **7,99**.\nLe put européen vaut 6,29 : l'exercice anticipé vaut environ 1,70.",
   "en": "Two-period tree: stock at 100, multiplied by 1.2 or 0.8 each period; interest 5% per period. Price of an American put struck at 100?",
   "indice": "$q = (1{,}05 - 0{,}8)/(1{,}2 - 0{,}8)$. À chaque nœud intermédiaire, compare la valeur de continuation à l'exercice immédiat.",
   "relances": [
    "Pourquoi exercer tôt ? (recevoir 100 tout de suite et le placer à 5 % rapporte plus que la valeur temps restante)",
    "Un call américain sur la même action sans dividende ? (jamais exercé tôt : même prix que l'européen)"
   ],
   "reponse": "8.39286/1.05",
   "valeur": 7.9932,
   "tolerance": 0.002,
   "duree": 420
  },
  {
   "id": "der-forward-start",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Black-Scholes, taux nuls, $\\sigma = 20\\,\\%, S_{0} = 100$. Une option démarre dans un an : à cette date, on reçoit un call à la monnaie (strike = cours du jour) de maturité un an. Que vaut-elle aujourd'hui ?",
   "solution": "Dans un an, le call à la monnaie vaudra $S_{1} \\times c$, où $c = 2N(\\sigma /2) - 1$ est le prix d'un call à la monnaie pour un sous-jacent valant 1 (homogénéité de Black-Scholes). Aujourd'hui : $\\mathbb{E}[S_{1}] \\times c = 100 \\times (2N(0{,}1) - 1) \\approx$ **7,97**, comme un call à la monnaie démarrant tout de suite.\nC'est un produit sensible au **smile futur** (forward) : en vol locale et en vol stochastique, les prix diffèrent, d'où son usage pour départager les modèles.",
   "en": "Black-Scholes, zero rates, $\\sigma = 20\\,\\%, S_{0} = 100$. A forward-start option: in one year you receive a one-year at-the-money call (strike = spot then). What is it worth today?",
   "reponse": "100*(2*N(0.1)-1)",
   "valeur": 7.965567455405798,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "der-margrabe",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Deux actions valent chacune 100, avec des volatilités de 20 %, une corrélation de 0,5, sans dividende. Que vaut l'option d'échanger l'action B contre l'action A dans un an (payoff $\\max (A - B, 0)$) ?",
   "solution": "Formule de Margrabe : le taux d'intérêt disparaît, et la volatilité effective est $\\sqrt{0{,}04 + 0{,}04 - 2 \\times 0{,}5 \\times 0{,}04} = 20\\,\\%$. Le prix est celui d'un call à la monnaie avec $\\sigma = 20\\,\\%$ : $100(2N(0{,}1) - 1) \\approx$ **7,97**.\nPlus la corrélation est forte, moins l'option vaut ($\\rho = 1$ et même volatilité : prix nul).",
   "en": "Two stocks both at 100, 20% vol each, correlation 0.5, no dividends. What is the option to exchange B for A in one year (payoff $\\max (A - B, 0)$) worth?",
   "indice": "Prends B comme numéraire : c'est un call de strike 1 sur $A/B$. Volatilité du ratio : $\\sqrt{\\sigma_A^{2} + \\sigma_B^{2} - 2\\rho \\sigma_A\\sigma_B}$.",
   "reponse": "100*(2*N(0.1)-1)",
   "valeur": 7.965567455405798,
   "tolerance": 0.005,
   "duree": 360
  },
  {
   "id": "der-swap-variance",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un swap de variance ? Comment le réplique-t-on, et pourquoi son strike est-il au-dessus de la vol à la monnaie ?",
   "solution": "Payoff : $N \\times$ (variance réalisée $- K_\\text{var}$), où la variance réalisée est la moyenne annualisée des carrés des rendements logarithmiques quotidiens.\n**Réplication** (sans modèle, si les trajectoires sont continues) : un portefeuille statique d'options hors de la monnaie de tous les strikes, pondérées en $1/K^{2}$, plus une couverture dynamique en delta (position en $1/S$). Le strike équitable est donc lisible sur la surface de volatilité ; c'est le principe du VIX.\n**Strike au-dessus de la vol ATM** : les poids en $1/K^{2}$ donnent beaucoup d'importance aux puts de strike bas, plus chers en vol à cause du skew.\nLe payoff est convexe en volatilité : un swap de vol (sur l'écart-type) vaut moins que la racine du strike de variance (ajustement de convexité). Risque : les sauts et les krachs, qui font exploser la variance réalisée (pertes énormes pour les vendeurs en 2008).",
   "en": "What is a variance swap? How is it replicated, and why is its strike above at-the-money vol?"
  },
  {
   "id": "der-quanto",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'une option quanto ? D'où vient l'ajustement de quanto ?",
   "solution": "Une option sur un actif coté dans une devise étrangère, mais payée dans la devise domestique à un taux de change fixé d'avance (par exemple un call sur le Nikkei payé en euros, 1 point $= 1$ €).\nPour la valoriser en mesure risque-neutre domestique, le sous-jacent étranger reçoit une dérive corrigée : $r_f - q - \\rho \\sigma_S \\sigma_X$, où $\\rho$ est la corrélation entre l'actif et le taux de change (domestique par unité étrangère). Si l'actif a tendance à monter quand la devise étrangère baisse, le quanto est plus cher pour l'acheteur d'un call, etc. Le vendeur est exposé à la corrélation, difficile à couvrir.",
   "en": "What is a quanto option? Where does the quanto adjustment come from?"
  },
  {
   "id": "der-couverture-discrete",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Tu couvres une option en delta une fois par jour au lieu de continûment. Que se passe-t-il ? Et avec des coûts de transaction ?",
   "solution": "- **Erreur de couverture** : entre deux réajustements, le gamma crée un PnL $\\tfrac12 \\Gamma S^{2}[(\\Delta S/S)^{2} - \\sigma^{2}\\Delta t]$ qui ne s'annule qu'en moyenne. L'écart-type de l'erreur totale décroît en $\\sqrt{\\Delta}t$ : diviser l'erreur par 2 demande 4 fois plus de réajustements.\n- **Coûts** : chaque réajustement coûte ; avec des réajustements plus fréquents, les coûts explosent. Il y a un arbitrage entre risque et coûts : couverture par bandes autour du delta cible (Whalley-Wilmott), ou volatilité modifiée de Leland (le vendeur d'options utilise une vol majorée pour payer ses coûts).\n- En pratique : couverture plus fréquente près de l'échéance et du strike (gamma fort), tolérance plus large ailleurs.",
   "en": "You delta-hedge an option once a day instead of continuously. What happens? And with transaction costs?"
  },
  {
   "id": "der-greeks-portefeuille",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Tu es vendeur d'un call à la monnaie et tu veux être neutre en delta et en gamma. Avec quels instruments, et dans quel ordre ?",
   "solution": "L'action a un delta de 1 mais un gamma nul : elle ne peut pas neutraliser le gamma. Il faut d'abord une **autre option** (par exemple un call d'un autre strike ou d'une autre maturité) en quantité $\\Gamma_\\text{vendu}/\\Gamma_\\text{option}$ pour annuler le gamma ; cette option apporte son propre delta. Ensuite, on annule le delta total avec l'action. Si on veut aussi neutraliser le vega, il faut une deuxième option (deux équations, deux inconnues) ; l'ordre « options d'abord, action en dernier » vaut toujours.",
   "en": "You are short an ATM call and want to be delta- and gamma-neutral. With which instruments, in what order?"
  },
  {
   "id": "der-strangle-straddle",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "mm",
    "banque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Différence entre un straddle et un strangle ? Quand acheter l'un ou l'autre ?",
   "solution": "- **Straddle** : un call et un put de même strike (souvent à la monnaie). Pari sur un mouvement de grande ampleur, dans un sens ou dans l'autre, ou sur une hausse de la volatilité implicite. Plus cher, delta proche de zéro, gamma maximal.\n- **Strangle** : un put de strike bas et un call de strike haut, hors de la monnaie. Moins cher, ne gagne que si le mouvement est très grand ; plus exposé aux queues de distribution.\nVendre l'un ou l'autre = encaisser la prime en pariant sur le calme (short gamma, short vega), avec une perte potentielle illimitée côté call.",
   "en": "Difference between a straddle and a strangle? When would you buy one or the other?"
  },
  {
   "id": "nrj-specificites-electricite",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qui rend l'électricité différente des autres matières premières pour un quant ?",
   "solution": "- **Non stockable** à grande échelle (ou très cher : batteries, barrages, STEP) : l'offre doit égaler la demande à chaque instant, d'où des **pics de prix** et une volatilité très forte.\n- **Saisonnalité** à plusieurs échelles : heure de la journée, jour de la semaine, saison (chauffage, climatisation).\n- **Retour à la moyenne** rapide après les chocs (pannes, vagues de froid), avec des sauts.\n- **Livraison sur une période** (une heure, un jour, un mois, un trimestre, une année ; produits base et pointe) plutôt qu'à une date.\n- **Dépendance à la météo** (température, vent, ensoleillement, hydraulicité) et aux combustibles (gaz, charbon) et au prix du CO$_2$.\n- **Prix négatifs** possibles.\nConséquence : les modèles de type Black-Scholes s'appliquent mal au prix spot ; on modélise plutôt la courbe forward, avec retour à la moyenne, saisonnalité et sauts.",
   "en": "What makes electricity different from other commodities for a quant?",
   "relances": [
    "Pourquoi la volatilité implicite des contrats proches est-elle bien plus forte que celle des contrats lointains ? (effet Samuelson : les chocs se dissipent avant les maturités lointaines)"
   ]
  },
  {
   "id": "nrj-prix-negatifs",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Comment le prix de l'électricité peut-il devenir négatif ?",
   "solution": "Quand l'offre dépasse la demande et que certains producteurs préfèrent **payer** pour continuer à produire plutôt que s'arrêter :\n- centrales peu flexibles (nucléaire, charbon) dont l'arrêt et le redémarrage coûtent cher ;\n- renouvelables subventionnées par un prix garanti ou une prime par MWh produit, qui continuent de produire tant que la subvention compense le prix négatif ;\n- faible demande (week-end, jours fériés, nuit) et forte production solaire ou éolienne ;\n- capacités d'export et de stockage saturées.\nLes prix négatifs sont surtout observés sur le marché spot (day-ahead et infrajournalier), pour quelques heures. Ils incitent au stockage et à la flexibilité (effacement, pilotage de la demande).",
   "en": "How can electricity prices become negative?"
  },
  {
   "id": "nrj-spark-spread",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Une centrale au gaz a un rendement de 50 % (il faut 2 MWh de gaz pour produire 1 MWh d'électricité). L'électricité vaut 90 €/MWh, le gaz 35 €/MWh. Quel est le spark spread (marge brute par MWh électrique, hors CO$_2$) ?",
   "solution": "$\\text{Spark spread} = \\text{prix de l'électricité} - \\text{taux de chaleur} \\times \\text{prix du gaz} = 90 - 2 \\times 35 =$ **20 €/MWh**.\nLa centrale produit quand le spread couvre ses coûts variables : c'est une **option** sur le spread (voir la fiche sur la valeur d'une centrale).",
   "en": "A gas plant has 50% efficiency (heat rate 2). Power is €90/MWh, gas €35/MWh. What is the spark spread per MWh of electricity (excluding CO$_2$)?",
   "relances": [
    "Et le « clean spark spread » ? (on retire aussi le coût du CO$_2$ : émissions par MWh électrique $\\times$ prix du quota)",
    "Et pour une centrale à charbon ? (dark spread)"
   ],
   "reponse": "90-2*35",
   "valeur": 20.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "nrj-clean-spark",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Même centrale (rendement 50 %, électricité 90 €/MWh, gaz 35 €/MWh). Elle émet 0,4 tonne de CO$_2$ par MWh électrique et le quota coûte 80 €/t. Que vaut le clean spark spread ? La centrale doit-elle produire ?",
   "solution": "$90 - 2 \\times 35 - 0{,}4 \\times 80 = 90 - 70 - 32 =$ **$-12$ €/MWh**. Négatif : produire à ces prix fait perdre de l'argent sur les coûts variables, la centrale ne devrait pas tourner (sauf contraintes techniques, services au réseau ou couverture déjà vendue).",
   "en": "Same plant (heat rate 2, power €90, gas €35). It emits 0.4 t CO$_2$ per MWh and allowances cost €80/t. Clean spark spread? Should it run?",
   "reponse": "90-2*35-0.4*80",
   "valeur": -12.0,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "nrj-centrale-option",
   "theme": "marches",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Pourquoi dit-on qu'une centrale électrique est une option ? Comment la valoriserais-tu ?",
   "solution": "Pour chaque heure, l'exploitant peut produire (et gagner le spread $P - H \\cdot G - c$) ou s'arrêter (gain nul) : le gain est **$\\max (P - H \\cdot G - c, 0)$**, une option d'échange (spread option) entre électricité et gaz. La centrale est une suite d'options horaires : sa valeur augmente avec la volatilité du spread et diminue avec la corrélation électricité-gaz (comme l'option de Margrabe).\nValorisation :\n- approche simple : somme d'options de spread (formule de Margrabe si $c = 0$, approximation de Kirk sinon) sur les forwards ;\n- approche réaliste : Monte-Carlo de prix horaires (retour à la moyenne, saisonnalité, sauts, corrélation) avec contraintes techniques (temps de démarrage, coûts de démarrage, durée minimale de fonctionnement) résolues par programmation dynamique ou Longstaff-Schwartz.\nC'est aussi la logique de la couverture : vendre à terme la production attendue (le delta) et ajuster.",
   "en": "Why is a power plant an option? How would you value it?"
  },
  {
   "id": "nrj-schwartz",
   "theme": "stoch",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Quel modèle simple utiliserais-tu pour le prix spot d'une matière première qui revient vers une moyenne ? Que devient le prix forward ?",
   "solution": "Modèle de Schwartz à un facteur : le logarithme du prix suit un Ornstein-Uhlenbeck,\n$d \\ln S = \\kappa (\\mu - \\ln S) dt + \\sigma dW$ (on ajoute une saisonnalité déterministe pour l'électricité).\nLe log du forward $F(t, T)$ est une moyenne pondérée entre le log spot actuel et le niveau de long terme, avec un poids $e^{-\\kappa (T-t)}$ sur le spot : les forwards lointains bougent peu quand le spot bouge. Leur volatilité vaut $\\sigma e^{-\\kappa (T-t)}$ : c'est l'**effet Samuelson** (volatilité décroissante avec la maturité).\nExtensions : modèle à deux facteurs (court terme et long terme, Schwartz-Smith), sauts et changements de régime pour les pics de l'électricité.",
   "en": "Which simple model would you use for a mean-reverting commodity spot price? What does the forward price become?",
   "relances": [
    "Lien avec tes projets ? (le spread du projet stat arb est aussi un processus d'Ornstein-Uhlenbeck : même demi-vie $\\ln 2/\\kappa$)"
   ]
  },
  {
   "id": "nrj-couverture-producteur",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Un producteur d'électricité veut se protéger contre une baisse des prix l'an prochain. Que peut-il faire, et quels risques restent ?",
   "solution": "- **Vendre à terme** (forwards ou futures base et pointe) une partie de la production attendue : prix bloqué, mais il renonce à la hausse.\n- **Acheter des puts** sur les futures : plancher de prix en gardant la hausse, contre une prime.\n- **Contrats de long terme** avec des clients (PPA).\nRisques restants : **risque de volume** (production incertaine : panne, météo, disponibilité ; si on a vendu plus que ce qu'on produit, il faut racheter au prix du moment, souvent quand il est élevé), **risque de base** (profil horaire ou zone géographique différents du contrat couvert), risque de contrepartie et de liquidité (appels de marge importants quand les prix montent, comme en 2022).\nOn couvre en général progressivement (par tranches sur plusieurs années) plutôt que d'un coup.",
   "en": "A power producer wants to protect against lower prices next year. What can it do, and what risks remain?"
  },
  {
   "id": "nrj-parler-stage",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Ton stage actuel est dans un autre secteur (par exemple l'énergie), mais tu postules en finance de marché. Qu'est-ce que tu en retiens pour nous ? »",
   "solution": "À préparer avec tes vrais éléments (Mes histoires → « Ton stage actuel »). Pistes de lien, à n'utiliser que si elles correspondent à ce que tu fais :\n- travail sur des données réelles, bruitées et incomplètes (et ce que ça apprend sur la validation) ;\n- modélisation sous incertitude (prévision, risque, optimisation) ;\n- outils (Python, statistiques) et rigueur de production (code relu, tests, documentation) ;\n- contact avec des opérationnels : expliquer un modèle à quelqu'un qui n'est pas quant ;\n- curiosité pour les marchés de l'énergie (volatilité, prix négatifs, spark spreads), ce qui intéresse aussi les desks de matières premières.\nTermine par ce que tu cherches en plus chez eux : la finance de marché au quotidien, un retour plus rapide entre idée et résultat.",
   "en": "\"Your current internship is in another sector but you apply to a markets role. What do you take from it for us?\""
  },
  {
   "id": "fit-ouverture-presente-toi",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Présente-toi. »",
   "solution": "60 à 90 secondes, préparées mot pour mot (Mes histoires → « Présente-toi ») :\n1. **Qui tu es** : formation, année, ce qui t'a amené aux maths financières (une phrase).\n2. **Ce que tu as fait** : ton stage actuel (une phrase, avec ce que tu y fais concrètement), un projet quant choisi pour ce poste (une phrase, avec un résultat ou une leçon).\n3. **Ce que tu cherches** : un stage de césure de 5 à 6 mois à partir de [mois de début], dans ce type d'équipe, et pourquoi.\nTermine sur une porte ouverte (« je pourrai vous parler de mon projet de surface de volatilité »), l'intervieweur rebondit souvent dessus.",
   "en": "\"Tell me about yourself.\"",
   "piege": "Réciter le CV ligne par ligne, ou parler cinq minutes. L'intervieweur a ton CV : il veut un fil conducteur et une voix.",
   "essentiel": true
  },
  {
   "id": "fit-ouverture-parcours",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Walk me through your CV » : déroule ton parcours.",
   "solution": "Dans l'ordre chronologique, en expliquant les **choix** (pourquoi cette école, cette mention, ce stage, ces projets) et ce que chaque étape t'a appris, jusqu'au poste visé. Chaque étape doit rendre la suivante logique : l'intervieweur cherche une trajectoire cohérente vers la finance quantitative.\nDeux minutes maximum ; garde les détails pour les relances.",
   "en": "\"Walk me through your CV.\""
  },
  {
   "id": "fit-pourquoi-quant",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Pourquoi la finance quantitative ? »",
   "solution": "Évite « j'aime les maths et la finance ». Structure :\n1. un **déclic concret** (un cours, un problème, un projet) ;\n2. ce qui te plaît dans le **travail réel** : modéliser, confronter un modèle aux données, avoir un retour rapide et mesurable, travailler sur des problèmes ouverts ;\n3. une **preuve** que tu l'as déjà fait par toi-même (un de tes projets, ce qu'il t'a appris, par exemple qu'un bon backtest est d'abord un backtest honnête).\nAdapte la fin au poste : recherche (signaux, statistiques), pricing (modèles, rigueur), trading (décision rapide sous incertitude).",
   "en": "\"Why quantitative finance?\"",
   "essentiel": true
  },
  {
   "id": "fit-pourquoi-nous",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Pourquoi nous ? Pourquoi cette équipe ? »",
   "solution": "Trois éléments précis, préparés pour chaque entreprise (notes dans le Journal) :\n1. ce que fait **l'équipe** (lu dans l'annonce, sur le site, dans leurs publications ou présentations) ;\n2. le **lien** avec ce que tu as fait ou étudié ;\n3. ce que tu veux **apprendre** là précisément.\nUne banque, un fonds systématique et un teneur de marché n'attendent pas la même réponse. Une phrase générique (« entreprise prestigieuse, leader de son secteur ») ne compte pas.",
   "en": "\"Why us? Why this team?\"",
   "essentiel": true
  },
  {
   "id": "fit-cesure",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Pourquoi une césure ? Et que feras-tu après le stage ? »",
   "solution": "Présente le calendrier comme un choix : stage actuel jusqu'à sa date de fin, puis 5 à 6 mois en finance quantitative à partir de [mois de début], avant la suite de ta formation. Dis ce que la césure t'apporte (deux expériences longues et différentes, tester le métier avant le stage de fin d'études) et ce que tu vises ensuite. Si l'entreprise recrute ses stagiaires de fin d'études ou ses jeunes diplômés parmi ses stagiaires, dis que cette perspective t'intéresse (si c'est vrai).",
   "en": "\"Why a gap year? What will you do after the internship?\""
  },
  {
   "id": "fit-stage-actuel",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Parle-moi de ton stage actuel. »",
   "solution": "Méthode STAR, en 1 à 2 minutes :\n- **Situation** : l'équipe, son rôle, l'enjeu ;\n- **Tâche** : ce qu'on t'a confié ;\n- **Action** : ce que **toi** tu as fait, avec quels outils et quelles méthodes ;\n- **Résultat** : un chiffre ou un effet concret, et ce qui a été fait de ton travail ;\n- **Lien** avec le poste : données, modélisation, risque, code, rigueur, communication avec des non-spécialistes.\nPrépare la version courte et la version détaillée : on te relancera sur un point technique.",
   "en": "\"Tell me about your current internship.\""
  },
  {
   "id": "fit-echec",
   "theme": "fit",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Parle-moi d'un échec. »",
   "solution": "Un vrai échec, pas un faux défaut (« je travaille trop »). Ce qui s'est passé, ta part de responsabilité, comment tu l'as diagnostiqué, ce que tu as changé ensuite, et la preuve que tu l'appliques depuis.\nUn bon matériau, si tu l'as vraiment vécu : le premier réglage du projet stat arb (Sharpe nul malgré de vraies paires cointégrées), diagnostiqué comme un manque de puissance et un problème de comparaisons multiples, puis le réglage final choisi après coup et la pénalité honnête (Sharpe déflaté).",
   "en": "\"Tell me about a failure.\""
  },
  {
   "id": "fit-equipe",
   "theme": "fit",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Raconte une situation où tu n'étais pas d'accord avec un collègue ou un responsable. »",
   "solution": "Une situation précise (projet d'école, stage, association, sport). Montre : que tu as compris la position de l'autre, que tu as argumenté avec des **faits** (données, test, prototype), que tu as su accepter la décision finale ou changer d'avis devant un meilleur argument, et ce qui en est sorti. En trading et en recherche, l'intervieweur cherche quelqu'un qui défend une idée sans s'y accrocher.",
   "en": "\"Tell me about a time you disagreed with a colleague or manager.\""
  },
  {
   "id": "fit-qualites-defauts",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Quelles sont tes qualités et tes défauts ? »",
   "solution": "Deux qualités utiles au poste, chacune prouvée par un exemple court. Un défaut réel mais compatible avec le poste, et ce que tu fais concrètement pour le corriger (par exemple : « j'ai tendance à vouloir tout comprendre avant d'avancer ; j'ai appris à fixer une limite de temps puis à demander »). Évite les faux défauts et les défauts rédhibitoires pour le poste.",
   "en": "\"What are your strengths and weaknesses?\""
  },
  {
   "id": "fit-ia",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Comment utilises-tu l'IA pour coder ? »",
   "solution": "Question de plus en plus fréquente. Réponse honnête et mature :\n- ce pour quoi tu l'utilises (écrire un premier jet, explorer une bibliothèque, chercher un bug, relire) ;\n- ce que tu fais toujours toi-même : comprendre chaque ligne, tester (des tests contre des cas connus, comme les contrôles de tes projets), vérifier les résultats contre une vérité connue ;\n- ses limites que tu as constatées : erreurs subtiles, code plausible mais faux, d'où l'importance des tests.\nNe cache pas son usage sur tes projets, et propose de détailler n'importe quelle partie.",
   "en": "\"How do you use AI when you code?\""
  },
  {
   "id": "fit-plan-b",
   "theme": "fit",
   "niveau": 2,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Tu postules aussi en data science et en trading ? Qu'est-ce que tu veux vraiment faire ? »",
   "solution": "Montre la cohérence plutôt que de nier : le fil rouge est de modéliser des données bruitées et de décider sous incertitude, avec les mathématiques appliquées. Puis dis clairement ce qui te fait préférer le poste en face de toi, et pourquoi ce stage précis est le meilleur pour toi maintenant. L'intervieweur vérifie surtout que tu ne partiras pas au premier entretien ailleurs.",
   "en": "\"You also apply to data science and trading roles. What do you really want to do?\""
  },
  {
   "id": "fit-pression",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Comment réagis-tu sous pression ? Donne un exemple. »",
   "solution": "Un exemple concret (examen, échéance de projet, compétition, stage) avec ce que tu as fait : prioriser, découper, communiquer tôt quand un délai ne tient pas, garder une routine. Chez un teneur de marché, la vraie réponse est ton comportement pendant l'entretien lui-même : rester calme quand on te contredit ou quand tu te trompes, corriger sans te justifier.",
   "en": "\"How do you handle pressure? Give an example.\""
  },
  {
   "id": "fit-cinq-ans",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Où te vois-tu dans cinq ans ? »",
   "solution": "Une réponse ambitieuse mais réaliste, liée au métier : avoir acquis une expertise (modélisation, recherche, trading), prendre en charge des sujets de bout en bout, encadrer peut-être des stagiaires. Inutile de promettre de rester toute ta vie ; montre que ce stage est une étape cohérente de ce chemin.",
   "en": "\"Where do you see yourself in five years?\""
  },
  {
   "id": "fit-dernieres-nouvelles",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Qu'as-tu lu récemment qui t'a intéressé (un article, un livre, un papier de recherche) ? »",
   "solution": "Prépare une lecture réelle et récente, liée au métier si possible (un papier de recherche, un chapitre de livre de référence, un article sur un sujet de marché). Dis en deux phrases ce qu'elle apporte, une limite ou une question qu'elle t'a posée, et ce que tu en as fait (un essai de code, une discussion). Références classiques pour se lancer : Hull (produits dérivés), Gatheral (« The Volatility Surface »), Shreve (calcul stochastique), López de Prado (« Advances in Financial Machine Learning »), Bouchaud et al. (« Trades, Quotes and Prices »), Zhou (« A Practical Guide to Quantitative Finance Interviews »).",
   "en": "\"What have you read recently that interested you?\""
  },
  {
   "id": "fit-questions-a-poser",
   "theme": "fit",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« As-tu des questions pour nous ? »",
   "solution": "Toujours oui : deux ou trois questions préparées (Mes histoires → « Mes questions à poser »). Exemples :\n- « À quoi ressemble une journée type dans l'équipe ? »\n- « Sur quel projet a travaillé votre dernier stagiaire, et qu'est-il devenu ? »\n- « Comment une idée passe-t-elle de la recherche à la production ? »\n- « Quels outils et langages utilisez-vous au quotidien ? »\n- « Qu'est-ce qui distingue un stagiaire excellent d'un bon stagiaire ici ? »\nÉvite le salaire et les questions dont la réponse est sur le site. Une question qui rebondit sur ce qui a été dit pendant l'entretien vaut encore mieux.",
   "en": "\"Do you have any questions for us?\"",
   "essentiel": true
  },
  {
   "id": "jeu-malediction-vainqueur",
   "theme": "marches",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une entreprise vaut, pour son propriétaire, un montant uniforme entre 0 et 100 qu'il est seul à connaître. Entre tes mains, elle vaudrait 1,5 fois ce montant. Tu fais une seule offre $b$ ; il accepte si $b$ dépasse la valeur pour lui. Quelle offre maximise ton gain espéré ?",
   "solution": "Si $b$ est accepté, la valeur pour le propriétaire est uniforme sur [$0, b$], de moyenne $b/2$ ; pour toi elle vaut $1{,}5 \\times b/2 = 0{,}75 b < b$. Chaque offre acceptée perd $0{,}25 b$ en moyenne : gain espéré $= (b/100) \\times (-0{,}25 b) < 0$. Meilleure offre : **0** (ne rien proposer).\nC'est la **malédiction du vainqueur** : être accepté est une information défavorable. Même mécanisme que la sélection adverse d'un teneur de marché.",
   "en": "A company is worth $U(0, 100)$ to its owner, who alone knows the value. In your hands it is worth 1.5 times that. You make one bid $b$; the owner accepts if $b$ exceeds his value. What bid maximizes your expected profit?",
   "indice": "Sachant que ton offre $b$ est acceptée, quelle est la valeur moyenne de l'entreprise ?",
   "piege": "Raisonner sur la valeur moyenne non conditionnelle ($50 \\times 1{,}5 = 75$) et offrir jusqu'à 75.",
   "relances": [
    "À partir de quel multiplicateur l'offre devient-elle intéressante ? (au-delà de 2 : valeur conditionnelle $k \\cdot b/2 \\ge b$)"
   ],
   "categorie": "strategie",
   "titre": "Racheter une entreprise : la malédiction du vainqueur",
   "reponse": "0",
   "valeur": 0.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "jeu-dichotomie",
   "theme": "casse-tete",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Je pense à un entier entre 1 et 100. Tu proposes un nombre, je réponds « plus grand », « plus petit » ou « trouvé ». Combien de propositions au pire avec la meilleure stratégie ?",
   "solution": "Chaque proposition coupe l'intervalle en deux : $2^{7} - 1 = 127 \\ge 100 > 63 = 2^{6} - 1$. Il faut **7** propositions au pire.",
   "en": "I think of an integer from 1 to 100. You guess; I answer higher, lower or correct. Worst-case number of guesses with the best strategy?",
   "relances": [
    "Si je te paie $100 - 10 \\times$ (nombre d'essais), combien paierais-tu pour jouer ? (calcule le nombre moyen d'essais de la dichotomie : 5,8 environ, donc environ 42)"
   ],
   "categorie": "strategie",
   "titre": "Deviner un nombre entre 1 et 100 : combien payer ?",
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "jeu-trois-piles",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Combien de lancers d'une pièce équilibrée faut-il en moyenne pour obtenir trois « pile » consécutifs ?",
   "solution": "Même méthode que pour deux piles (états 0, 1, 2 piles consécutifs), ou formule $2^{n+1} - 2$ : **14**.\nVérification avec les états : $E_{2} = 1 + E_{0}/2, E_{1} = 1 + E_{2}/2 + E_{0}/2, E_{0} = 1 + E_{1}/2 + E_{0}/2$ donne $E_{0} = 14$.",
   "en": "Expected number of fair coin flips to get three heads in a row?",
   "categorie": "probas",
   "titre": "Attendre une série de piles (PP, PPP…)",
   "reponse": "14",
   "valeur": 14.0,
   "tolerance": 0.005,
   "duree": 120,
   "voir": [
    "proba-pile-pile",
    "proba-deux-six-consecutifs"
   ]
  },
  {
   "id": "jeu-marche-aleatoire-sortie",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Une marche aléatoire part de 0 et fait des pas de $+1$ ou $-1$ avec probabilité $1/2$. Combien de pas en moyenne avant d'atteindre $+10$ ou $-10$ ?",
   "solution": "$S_n^{2} - n$ est une martingale : $\\mathbb{E}[T] = \\mathbb{E}[S_T^{2}] =$ **100**. Plus généralement, sortir de ]$-a, b$[ prend ab pas en moyenne : il faut environ $a^{2}$ pas pour s'éloigner de a, la diffusion est en $\\sqrt{n}$.",
   "en": "A symmetric $\\pm 1$ random walk starts at 0. Expected number of steps to reach $+10$ or $-10$?",
   "categorie": "probas",
   "titre": "Temps de sortie d’une marche aléatoire",
   "reponse": "100",
   "valeur": 100.0,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "jeu-arret-uniforme",
   "theme": "marches",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Tu peux tirer autant de nombres uniformes sur [0, 1] que tu veux ; chaque tirage coûte 0,01. Quand tu t'arrêtes, tu gagnes le dernier nombre tiré. Que vaut ce jeu avec la meilleure stratégie ?",
   "solution": "$V = -0{,}01 + \\mathbb{E}[\\max (X, V)]$, donc $0{,}01 = \\mathbb{E}[(X - V)^{+}] = (1 - V)^{2}/2$. D'où $V = 1 - \\sqrt{0{,}02} \\approx$ **0,859** : on s'arrête dès qu'un tirage dépasse 0,859.\nMême logique que l'exercice d'une option américaine : on arrête quand la valeur immédiate dépasse la valeur de continuation.",
   "en": "You may draw as many uniform [0, 1] numbers as you like, each draw costing 0.01. When you stop you win the last number drawn. What is the game worth under optimal play?",
   "indice": "La meilleure stratégie est un seuil : s'arrêter dès que le tirage dépasse la valeur $V$ du jeu.",
   "relances": [
    "Si le tirage est gratuit mais limité à 3 tirages ? (récurrence à rebours : 0,5 ; 0,625 ; 0,695)"
   ],
   "categorie": "strategie",
   "titre": "Tirer des uniformes payants : quand s’arrêter ?",
   "reponse": "1-sqrt(0.02)",
   "valeur": 0.8585786437626906,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "jeu-saint-petersbourg",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "ouverte",
   "question": "On lance une pièce jusqu'au premier « face ». Si cela arrive au lancer $n$, tu gagnes $2^{n}$ euros. Combien paierais-tu pour jouer ?",
   "solution": "L'espérance est infinie : $\\sum (1/2)^{n} \\times 2^{n} = 1 + 1 + 1 + \\dots$ Pourtant personne ne paierait une grosse somme. Explications à donner :\n- **Contrepartie limitée** : la banque ne peut pas payer plus que ce qu'elle possède. Si elle a 1 milliard ($\\approx 2^{30}$), l'espérance tombe à environ 31 €.\n- **Utilité** : avec une utilité logarithmique, l'équivalent certain est faible (Bernoulli, 1738).\n- **Variance et horizon** : on ne joue pas assez de fois pour que la moyenne s'applique ; la médiane du gain est 2 à 4 €.\nRéponse attendue : un prix chiffré et justifié (« une vingtaine d'euros, parce que… »), pas « l'infini ».",
   "en": "St. Petersburg game: a coin is flipped until the first tails; if it happens on flip $n$ you win $2^{n}$. How much would you pay to play?",
   "categorie": "probas",
   "titre": "Le paradoxe de Saint-Pétersbourg"
  },
  {
   "id": "jeu-deux-enveloppes",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Deux enveloppes contiennent des sommes dont l'une est le double de l'autre. Tu en ouvres une : 100 €. « L'autre contient 50 ou 200 avec la même probabilité, donc 125 en moyenne : il faut changer. » Où est l'erreur ?",
   "solution": "Le raisonnement suppose que, quelle que soit la somme vue, les deux cas sont équiprobables. C'est impossible pour toutes les sommes à la fois : il n'existe pas de loi a priori uniforme sur tous les montants (elle ne serait pas normalisable). Avec une vraie loi a priori sur la petite somme, la probabilité que l'autre enveloppe soit la plus grosse dépend de la somme vue ; en moyenne sur tout, changer ne rapporte rien (le jeu est symétrique).\nCe qui est évalué : identifier l'hypothèse implicite et la formuler proprement.",
   "en": "Two envelopes, one holds twice the other. You open one: \\$100. \"The other holds 50 or 200 with equal probability, so 125 on average: switch.\" What is wrong?",
   "categorie": "probas",
   "titre": "Le paradoxe des deux enveloppes"
  },
  {
   "id": "jeu-pari-de-plus-grand",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance deux dés. Tu paries 1 € que le premier dé est plus grand que le second ; en cas d'égalité, on relance. Quelle probabilité de gagner ?",
   "solution": "Égalités relancées : on conditionne sur « pas d'égalité ». Par symétrie, $P =$ **$1/2$**. (Sans relance : $15/36 = 5/12$.)",
   "en": "Two dice are rolled; you bet that the first is larger than the second, with ties re-rolled. Probability of winning?",
   "categorie": "probas",
   "titre": "Parier que le premier dé est plus grand",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "jeu-pari-sequence",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "« Je te propose un pari : je lance une pièce 100 fois ; si la plus longue suite de piles consécutifs fait au moins 5, je gagne 10 € ; sinon tu gagnes 10 €. » Acceptes-tu ?",
   "solution": "Non. La plus longue suite de piles en $n$ lancers est de l'ordre de $\\log_2 n$ : en moyenne environ 6 pour $n = 100$, et la probabilité d'avoir une suite d'au moins 5 piles dépasse $80\\,\\% (\\approx 0{,}81)$. Le pari est défavorable.\nMessage : l'intuition sous-estime la longueur des séries dans le hasard (les « séries » d'un trader ou d'un gérant peuvent être du pur hasard).",
   "en": "\"I flip a coin 100 times; if the longest run of heads is at least 5, I win \\$10, otherwise you win \\$10.\" Do you accept?",
   "relances": [
    "Comment le calculer exactement ? (chaîne de Markov sur la longueur de la série en cours, ou récurrence sur le nombre de suites sans série de 5)"
   ],
   "categorie": "probas",
   "titre": "Une série de 5 piles sur 100 lancers : pari équitable ?"
  },
  {
   "id": "jeu-partage-mise",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Deux joueurs de même force jouent en 5 manches gagnantes ; chacun a misé 50 €. La partie s'arrête à 4 manches à 2 pour A. Comment partager équitablement les 100 € ? Donne la part de A en fraction du total.",
   "solution": "B doit gagner les 3 manches suivantes pour l'emporter : probabilité $(1/2)^{3} = 1/8$. A gagne avec probabilité **$7/8$** : 87,50 € pour A, 12,50 € pour B. C'est le problème des partis (Pascal et Fermat, 1654), à l'origine du calcul des probabilités et, en un sens, de la valorisation par espérance.",
   "en": "Two equally skilled players play first to 5 wins, each staking \\$50. Play stops at 4–2 for A. What fair fraction of the pot goes to A?",
   "categorie": "probas",
   "titre": "Le problème des partis (partage de la mise)",
   "reponse": "7/8",
   "valeur": 0.875,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "mm-kelly",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une pièce tombe sur pile avec probabilité 0,6. Tu peux parier une fraction de ta richesse à cote 1 contre 1, autant de fois que tu veux. Quelle fraction miser à chaque pari pour maximiser la croissance de ta richesse à long terme ?",
   "solution": "Critère de Kelly : maximiser $\\mathbb{E}[\\ln (\\text{richesse})] = p \\ln (1 + f) + q \\ln (1 - f)$. Dérivée nulle : $p/(1 + f) = q/(1 - f)$, donc **$f$* $= p - q = 0{,}2$** (20 %).\nFormule générale pour une cote $b$ contre 1 : $f$* = (bp $- q$)$/b$, soit « avantage / cote ».",
   "en": "A coin lands heads with probability 0.6. You can repeatedly bet a fraction of your wealth at even odds. What fraction maximizes long-run growth?",
   "relances": [
    "Que se passe-t-il si tu mises 40 % ? (croissance nulle à long terme : à $2f$* la croissance retombe à environ zéro ; au-delà, ruine presque sûre)",
    "Pourquoi les praticiens misent-ils souvent « demi-Kelly » ? (incertitude sur $p$, volatilité énorme de Kelly plein ; demi-Kelly garde 75 % de la croissance avec moitié moins de volatilité)",
    "Lien avec le Sharpe ? (en continu, fraction optimale $= \\mu /\\sigma^{2}$, croissance $= \\text{SR}^2/2$)"
   ],
   "categorie": "strategie",
   "titre": "Quelle fraction miser ? (critère de Kelly)",
   "reponse": "0.2",
   "valeur": 0.2,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "mm-kelly-cote",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Un pari gagne avec probabilité 0,4 et paie 2 pour 1 (tu gagnes 2 € par euro misé, sinon tu perds ta mise). Fraction de Kelly ?",
   "solution": "$f$* = (bp $- q$)$/b = (2 \\times 0{,}4 - 0{,}6)/2 =$ **0,1** (10 %). Espérance par euro : $0{,}4 \\times 2 - 0{,}6 = 0{,}2 > 0$, mais le pari perd souvent : on mise peu.",
   "en": "A bet wins with probability 0.4 and pays 2 to 1. What is the Kelly fraction?",
   "reponse": "(2*0.4-0.6)/2",
   "valeur": 0.10000000000000003,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "mm-option-sur-de",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance un dé. Combien vaut une option qui paie $\\max (\\text{résultat} - 3, 0)$ ?",
   "solution": "Paiements 0, 0, 0, 1, 2, 3 : espérance $(1 + 2 + 3)/6 =$ **1**.",
   "en": "A die is rolled. What is an option paying $\\max (\\text{result} - 3, 0)$ worth?",
   "relances": [
    "Et le « put » $\\max (3 - \\text{résultat}, 0)$ ? ($(2 + 1 + 0)/6 = 0{,}5$) ; vérifie la parité : call − put $= \\mathbb{E}[X] - 3 = 0{,}5$",
    "Combien vaut un call de strike 3,5 ? ($(0{,}5 + 1{,}5 + 2{,}5)/6 = 0{,}75$)"
   ],
   "categorie": "probas",
   "titre": "Une option sur un dé",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "mm-cartes-rouges-noires",
   "theme": "marches",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Un jeu de 52 cartes (26 rouges, 26 noires) est retourné carte par carte. Chaque rouge te rapporte 1 €, chaque noire te coûte 1 €, et tu peux t'arrêter quand tu veux. Que vaut ce jeu avec la meilleure stratégie (valeur approchée) ?",
   "solution": "On résout la récurrence à rebours avec $V(r, 0) = r$ (on prend toutes les rouges restantes) et $V(0, n) = 0$ (on s'arrête). Pour $26/26$, **$V \\approx 2{,}62$ €**.\nIntuition : le jeu vaut au moins 0 (on peut s'arrêter tout de suite, et on finit sinon à 0) ; l'option de s'arrêter a de la valeur car on arrête quand on est en avance et que le paquet restant penche contre nous.",
   "en": "A deck of 26 red and 26 black cards is turned over one card at a time. Each red pays you \\$1, each black costs you \\$1, and you may stop at any time. What is the value of the game under optimal play (approximately)?",
   "indice": "Programmation dynamique sur (rouges restantes, noires restantes) : $V(r, n) = \\max (0, r/(r+n) \\cdot (1 + V(r-1, n)) + n/(r+n) \\cdot (-1 + V(r, n-1)))$.",
   "relances": [
    "Combien paierais-tu pour jouer ? (moins de 2,62 € ; un teneur de marché coterait autour)",
    "Et si on ne peut s'arrêter qu'au milieu du paquet ? (calcule : il faut alors l'espérance de $\\max (\\text{gain} à 26 \\text{ cartes}, 0)$)"
   ],
   "categorie": "strategie",
   "titre": "Cartes rouges et noires : quand s’arrêter ?",
   "reponse": "2.6245",
   "valeur": 2.6245,
   "tolerance": 0.002,
   "duree": 480
  },
  {
   "id": "mm-faire-un-marche",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "« Fais-moi un marché sur la population de l'Australie. » Comment t'y prends-tu, et que se passe-t-il ensuite ?",
   "solution": "1. **Estimation** à voix haute, avec un raisonnement (ordre de grandeur, points de repère). On ne te demande pas de savoir, mais d'estimer et de quantifier ton incertitude.\n2. **Cotation** : un bid et un ask, autour de ton estimation, avec un écart qui reflète ton incertitude (« 22 à 30 millions »). Trop large = inutile ; trop étroit = tu te fais prendre.\n3. **Réaction** : si l'intervieweur achète à ton ask, il pense que la valeur est plus haute. Tu dois réviser ton estimation (sélection adverse) et ta position (tu es vendeur, donc tu remontes tes prix).\n4. Il peut te demander de resserrer ; tu le fais en expliquant ce que tu risques.\nCe qui est évalué : rigueur de l'estimation, cohérence de l'écart, réaction aux ordres, gestion du risque (position, perte maximale), calme.",
   "en": "\"Make me a market on the population of Australia.\" How do you approach it, and what happens next?",
   "relances": [
    "Pourquoi un ask plus haut si on t'achète ? (l'ordre est une information, et tu veux réduire ta position courte)"
   ],
   "essentiel": true
  },
  {
   "id": "mm-marche-somme-des",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "« Fais-moi un marché sur la somme de deux dés. » Puis : « Je t'achète à ton ask. Le premier dé fait 6. Nouveau marché ? »",
   "solution": "Espérance : 7 ; écart-type : $\\sqrt{2 \\times 35/12} \\approx 2{,}4$. Un marché raisonnable : 6,5 à 7,5 (ou plus large si la contrepartie est bien informée).\nAprès « premier dé $= 6$ » : espérance $6 + 3{,}5 = 9{,}5$, écart-type 1,7. Nouveau marché autour de 9,5 (par exemple 9 à 10). Tu es vendeur d'une unité à 7,5 : tu perds en moyenne 2 sur cette position, à couvrir en achetant.\nRéflexes à montrer : recalculer l'espérance à chaque information, adapter l'écart à l'incertitude restante, tenir compte de ta position.",
   "en": "\"Make me a market on the sum of two dice.\" Then: \"I buy at your offer. The first die shows 6. New market?\"",
   "relances": [
    "Et si on te dit seulement « au moins un dé fait 6 » ? (espérance conditionnelle : (somme sur les 11 cas)$/11 = 102/11 \\approx 9{,}27$)"
   ]
  },
  {
   "id": "mm-selection-adverse",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que la sélection adverse pour un teneur de marché ? Comment s'en protège-t-il ?",
   "solution": "Le teneur de marché traite avec tout le monde, y compris des contreparties mieux informées. Celles-ci n'achètent que quand le prix va monter et ne vendent que quand il va baisser : en moyenne, il perd sur ces ordres-là. Le spread doit compenser ces pertes par les gains sur les ordres non informés (modèle de Glosten-Milgrom).\nProtections : écarter le spread quand la probabilité d'ordre informé est forte (annonces, volatilité) ; ajuster le prix après chaque exécution (un achat est une information) ; limiter la taille ; mesurer le « markout » (PnL quelques secondes ou minutes après chaque exécution) par contrepartie ou par type d'ordre ; être plus rapide (annuler les cotations quand le marché bouge).\nUn projet de market making ne modélise pas la sélection adverse : c'est sa principale limite.",
   "en": "What is adverse selection for a market maker? How does it protect itself?",
   "relances": [
    "Qu'est-ce que le markout ? (la valeur du prix milieu peu après l'exécution moins le prix d'exécution, du point de vue du teneur)"
   ],
   "essentiel": true
  },
  {
   "id": "mm-carnet-ordres",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Explique le fonctionnement d'un carnet d'ordres à cours limité.",
   "solution": "Le carnet liste les ordres à cours limité en attente : à l'achat (bids, du plus haut au plus bas) et à la vente (asks, du plus bas au plus haut). Le meilleur bid et le meilleur ask forment le spread ; le milieu sert de prix de référence.\n- Un **ordre limite** non exécutable s'ajoute au carnet (il fournit de la liquidité).\n- Un **ordre au marché** (ou limite agressif) consomme la liquidité au meilleur prix, puis aux niveaux suivants s'il est gros (impact).\n- **Priorité** : prix d'abord, puis ancienneté (FIFO) sur la plupart des marchés ; parfois au prorata (certains futures de taux).\nGrandeurs suivies : spread, profondeur, déséquilibre entre bids et asks (signal à court terme), taux d'annulation, position dans la file.",
   "en": "Explain how a limit order book works.",
   "relances": [
    "Pourquoi la position dans la file compte-t-elle ? (en FIFO, être devant augmente les chances d'exécution et réduit la sélection adverse)"
   ]
  },
  {
   "id": "mm-composantes-spread",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "De quoi se compose le spread bid-ask ? Pourquoi est-il plus large sur certains actifs ?",
   "solution": "Trois composantes classiques :\n1. **coûts de traitement** (frais, infrastructure) ;\n2. **risque d'inventaire** : le teneur porte une position qui peut perdre (proportionnel à la volatilité et au temps de détention, comme le terme $\\gamma \\sigma^{2}(T - t)$ d'Avellaneda-Stoikov) ;\n3. **sélection adverse** : compensation des pertes contre les contreparties informées.\nIl est plus large quand la volatilité est forte, la liquidité faible (petites capitalisations, obligations peu échangées), l'information asymétrique (avant des résultats), la concurrence entre teneurs faible, ou le pas de cotation grand.",
   "en": "What are the components of the bid-ask spread? Why is it wider for some assets?"
  },
  {
   "id": "mm-impact-marche",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu dois acheter 5 % du volume quotidien d'une action. Comment estimes-tu ton impact de marché, et comment l'exécutes-tu ?",
   "solution": "Loi empirique en racine carrée : impact $\\approx Y \\sigma_\\text{jour} \\sqrt{Q/V}$, avec $Y$ de l'ordre de 1. Ici $\\sqrt{0{,}05} \\approx 0{,}22$ : impact $\\approx 0{,}2$ à 0,25 fois la volatilité quotidienne (par exemple 40 points de base pour 2 % de volatilité).\nExécution : découper l'ordre dans le temps (TWAP, VWAP suivant la courbe de volume, participation fixe), arbitrer entre impact (aller vite coûte) et risque de prix (aller lentement expose aux mouvements) : modèle d'Almgren-Chriss. Mélanger ordres passifs et agressifs, utiliser des plateformes sans pré-transparence pour les gros blocs.\nMesure : implementation shortfall (prix moyen obtenu contre le prix au moment de la décision).",
   "en": "You must buy 5% of a stock's daily volume. How do you estimate your market impact and how do you execute?"
  },
  {
   "id": "mm-arbitrage-etf",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment fonctionne l'arbitrage entre un ETF et son panier sous-jacent ?",
   "solution": "Des participants autorisés peuvent créer des parts d'ETF en livrant le panier de titres, ou les détruire en récupérant le panier. Si l'ETF cote au-dessus de la valeur du panier (prime), ils achètent le panier, créent des parts et les vendent ; en cas de décote, ils achètent l'ETF, le détruisent et vendent le panier. Ce mécanisme ramène le prix vers la valeur liquidative indicative.\nLes teneurs de marché d'ETF cotent en continu autour de la valeur du panier en se couvrant avec les titres ou des futures. Difficultés : marchés sous-jacents fermés (ETF d'actions asiatiques coté en Europe : l'ETF devient l'instrument de découverte du prix), obligations peu liquides (décotes en période de stress), coûts de création, fiscalité.",
   "en": "How does arbitrage between an ETF and its underlying basket work?"
  },
  {
   "id": "mm-pnl-trader-options",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "banque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment décomposes-tu le PnL quotidien d'un livre d'options couvert en delta ?",
   "solution": "Développement de Taylor (PnL explain) :\n$\\text{PnL} \\approx \\Delta\\,\\delta S$ ($\\approx 0$ si couvert) $+ \\tfrac12 \\Gamma\\,\\delta S^{2} + \\Theta\\,\\delta t + \\text{Vega} \\,\\delta \\sigma + \\text{Vanna} \\,\\delta S\\,\\delta \\sigma + \\tfrac12 \\text{ Volga} \\,\\delta \\sigma^{2} + \\text{Rho} \\,\\delta r +$ résidu.\n- **Gamma contre theta** : on gagne si le mouvement réalisé dépasse ce que le theta payé suppose.\n- **Vega** : variation de la volatilité implicite (niveau, pente, courbure du smile).\n- **Résidu** inexpliqué : signale un modèle ou des données de marché faux ; c'est ce que surveillent les contrôleurs de risque.",
   "en": "How do you decompose the daily $P$&L of a delta-hedged options book?"
  },
  {
   "id": "mm-vix",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que le VIX ? Comment est-il calculé, et peut-on l'acheter ?",
   "solution": "Indice de volatilité implicite à 30 jours du S&P 500, calculé sans modèle à partir d'un panier d'options hors de la monnaie pondérées en $1/K^{2}$ : c'est la racine du prix d'un swap de variance à 30 jours ($\\times 100$).\nOn ne peut pas acheter l'indice lui-même : on traite des futures et des options sur VIX. Les futures sont en général en **contango** (plus chers que l'indice), d'où des pertes régulières pour les produits « long VIX » qui roulent les futures. Le VIX monte quand le marché baisse (corrélation négative), avec des pics lors des crises.",
   "en": "What is the VIX? How is it computed, and can you buy it?",
   "relances": [
    "Pourquoi la volatilité implicite est-elle en moyenne au-dessus de la volatilité réalisée ? (prime de risque de volatilité : les vendeurs de protection exigent une rémunération)"
   ]
  },
  {
   "id": "mm-carry",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'une stratégie de carry ? Donne deux exemples et le risque principal.",
   "solution": "Gagner le rendement obtenu « si les prix ne bougent pas ».\n- **Change** : emprunter dans une devise à taux bas, placer dans une devise à taux élevé. La parité des taux couverte dit que le forward compense l'écart de taux ; le carry parie que le change ne s'ajuste pas autant (violation empirique de la parité non couverte).\n- **Taux** : détenir des obligations longues financées à court terme quand la courbe est pentue (portage + effet de glissement sur la courbe, « roll-down »).\n- Aussi : vente de volatilité (prime de risque de vol), futures en déport sur les matières premières.\nRisque : rendements réguliers, puis pertes brutales lors des crises de liquidité (débouclages forcés : « monter par l'escalier, descendre par l'ascenseur »). Asymétrie négative.",
   "en": "What is a carry strategy? Give two examples and the main risk."
  },
  {
   "id": "mm-pari-favorable",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Je te propose un pari : on lance une pièce équilibrée, pile tu gagnes 3 millions d'euros, face tu en perds 1 million. Une seule fois. Tu acceptes ?",
   "solution": "L'espérance est positive ($+1$ million), mais la réponse dépend de ta richesse et de ton aversion au risque : perdre 1 million que tu n'as pas est une ruine. Ce que l'intervieweur veut entendre :\n- l'espérance seule ne suffit pas : c'est l'utilité, ou la croissance du capital (Kelly), qui compte ;\n- une fraction de Kelly : $p - q/b = 0{,}5 - 0{,}5/3 = 1/3$ de ta richesse : ce pari n'a de sens que si 1 million représente au plus un tiers de ce que tu possèdes ;\n- des solutions créatives : vendre une partie du pari à d'autres (syndication), demander à le jouer en plus petit et plusieurs fois.\nPuis donner une réponse nette : « Je refuse à titre personnel ; une entreprise avec 100 millions de capital devrait l'accepter. »",
   "en": "I offer you a bet: fair coin, heads you win €3m, tails you lose €1m. One time only. Do you take it?",
   "categorie": "strategie",
   "titre": "Un pari favorable mais énorme"
  },
  {
   "id": "mm-sujet-de-marche",
   "theme": "marches",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Parle-moi d'un sujet de marché qui t'intéresse en ce moment. » Comment prépares-tu cette question ?",
   "solution": "Elle est posée dans presque tous les entretiens, surtout en banque et en trading. Préparation (voir Mes histoires → « Un sujet de marché ») :\n1. Choisis **un** sujet que tu suis depuis quelques semaines : politique des banques centrales et courbe des taux, volatilité actions, un mouvement de change, matières premières, crédit.\n2. Prépare : les faits (niveaux approximatifs, sens du mouvement), le **mécanisme** (pourquoi ça bouge), ta **thèse** (ce que tu en penses), et comment l'exprimer en trade (instrument, risque, ce qui te ferait sortir).\n3. Mets-le à jour la semaine de l'entretien : une donnée vieille de trois mois montre que tu ne suis pas.\n4. Relie-le au poste : un desk de taux attend la courbe, un fonds systématique attend un regard sur les données et les régimes.\nSources : presse financière, notes de banques centrales, comptes rendus de marché quotidiens.",
   "en": "\"Tell me about a market topic you find interesting right now.\" How do you prepare for this question?",
   "relances": [
    "Comment exprimerais-tu cette vue avec des options plutôt qu'avec le sous-jacent ? (risque limité, pari sur la vol en plus de la direction)"
   ]
  },
  {
   "id": "mm-short-gamma",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "banque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Un desk est « short gamma » sur un indice. Que se passe-t-il pour lui, et pour le marché, quand l'indice bouge fortement ?",
   "solution": "Short gamma : son delta évolue contre lui. Quand l'indice monte, il devient vendeur et doit acheter pour se recouvrir ; quand l'indice baisse, il doit vendre. Il perd sur les grands mouvements (il gagne le theta quand le marché est calme).\nEffet de marché : si les teneurs de marché sont globalement short gamma, leurs couvertures **amplifient** les mouvements (acheter la hausse, vendre la baisse). Long gamma, leurs couvertures les **amortissent**. C'est une des explications avancées des mouvements violents autour des grosses échéances d'options.",
   "en": "A desk is short gamma on an index. What happens to it, and to the market, when the index moves sharply?"
  },
  {
   "id": "mm-meme-de-deux-fois",
   "theme": "marches",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Jeu 1 : on lance deux dés indépendants A et B, tu reçois $A \\times B / 3{,}5$ €. Jeu 2 : on lance un seul dé A, tu reçois $A \\times A / 3{,}5$ €. Le jeu 1 vaut 3,5 €. Combien vaut le jeu 2 ?",
   "solution": "$\\mathbb{E}[A^{2}]/3{,}5 = (91/6)/3{,}5 = 3{,}5 + \\operatorname{Var} (A)/3{,}5 = 3{,}5 + (35/12)/3{,}5 \\approx$ **4,33 €**.\nQuand la même variable apparaît deux fois, l'espérance du produit dépasse le produit des espérances de sa variance : c'est l'effet de convexité qui fait que $\\mathbb{E}[S^{2}] > \\mathbb{E}[S]^{2}$.",
   "en": "Game 1: two independent dice A and B, you receive $A \\cdot B/3.5$. Game 2: one die A, you receive $A \\cdot A/3.5$. Game 1 is worth 3.5. What is game 2 worth?",
   "piege": "Répondre 3,5 en appliquant E[XY] = E[X]E[Y] : c'est faux sans indépendance.",
   "relances": [
    "Et si A et B sont corrélés positivement mais pas identiques ? ($\\mathbb{E}[AB] = 3{,}5^2 + \\operatorname{Cov}(A, B)$, entre les deux)"
   ],
   "categorie": "probas",
   "titre": "Produit de deux dés ou carré d’un seul ?",
   "reponse": "(91/6)/3.5",
   "valeur": 4.333333333333333,
   "tolerance": 0.01,
   "duree": 180
  },
  {
   "id": "ml-biais-variance",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Explique le compromis biais-variance avec un exemple.",
   "solution": "Erreur de prévision attendue $= \\text{biais}^2 + \\text{variance} + \\text{bruit irréductible}$.\n- **Biais** : erreur due à un modèle trop simple (une droite pour une relation courbe) : sous-apprentissage.\n- **Variance** : sensibilité du modèle à l'échantillon d'entraînement (un polynôme de degré 20 change complètement si on change quelques points) : sur-apprentissage.\nAugmenter la complexité réduit le biais et augmente la variance ; on choisit la complexité par validation (croisée ou hors échantillon).\nEn finance, le rapport signal/bruit est très faible : la variance domine, d'où des modèles simples, fortement régularisés, et beaucoup de méfiance envers les bons résultats en échantillon.",
   "en": "Explain the bias-variance trade-off with an example.",
   "essentiel": true
  },
  {
   "id": "ml-l1-l2",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Ridge (L2) ou Lasso (L1) : quelles différences ? Pourquoi le Lasso met-il des coefficients exactement à zéro ?",
   "solution": "On ajoute $\\lambda \\| \\beta \\|^{2}$ (Ridge) ou $\\lambda \\| \\beta \\|_{1}$ (Lasso) à la somme des carrés des résidus.\n- **Ridge** : rétrécit tous les coefficients vers 0 sans les annuler ; stabilise les variables colinéaires (répartit le poids) ; solution fermée $(X^{T}X + \\lambda I)^{-1}X^{T}y$.\n- **Lasso** : produit des solutions creuses (sélection de variables) ; avec des variables colinéaires, en garde une arbitrairement.\nGéométrie : la boule L1 est un losange dont les coins sont sur les axes ; les courbes de niveau de l'erreur la touchent le plus souvent en un coin, donc avec des coefficients nuls. La boule L2 est ronde : pas de coin.\nElastic net : mélange des deux. Vue bayésienne : Ridge $= a$ priori gaussien, Lasso $= a$ priori de Laplace.",
   "en": "Ridge (L2) vs Lasso (L1): differences? Why does Lasso set coefficients exactly to zero?",
   "relances": [
    "Faut-il normaliser les variables avant ? (oui : la pénalité dépend de l'échelle)"
   ],
   "essentiel": true
  },
  {
   "id": "ml-ridge-1d",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "numerique",
   "question": "Régression Ridge à une variable, sans constante : $\\sum x_{i}y_{i} = 10, \\sum x_{i}^{2} = 20$, pénalité $\\lambda = 5$. Coefficient estimé ? (Et sans pénalité ?)",
   "solution": "$\\hat{\\beta} = \\sum xy/(\\sum x^{2} + \\lambda) = 10/25 =$ **0,4**, contre $10/20 = 0{,}5$ sans pénalité : le coefficient est rétréci vers zéro.",
   "en": "One-variable Ridge regression without intercept: $\\sum xy = 10$, $\\sum x^{2} = 20$, $\\lambda = 5$. Estimated coefficient? (And without penalty?)",
   "reponse": "10/(20+5)",
   "valeur": 0.4,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ml-validation-temporelle",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Pourquoi la validation croisée classique (k-fold aléatoire) est-elle dangereuse sur des données financières ? Que fais-tu à la place ?",
   "solution": "Les observations sont dépendantes dans le temps (autocorrélation, étiquettes construites sur des fenêtres futures qui se chevauchent) : des points de test « voient » des points d'entraînement voisins, ce qui gonfle les performances (fuite d'information). Et le futur sert à prédire le passé.\nÀ la place :\n- **walk-forward** : entraîner sur le passé, tester sur la période suivante, avancer (comme dans ton projet stat arb) ;\n- **k-fold purgé avec embargo** (López de Prado) : retirer de l'entraînement les observations dont l'étiquette chevauche la période de test, plus une marge après ;\n- un échantillon final jamais utilisé pour choisir quoi que ce soit.",
   "en": "Why is standard random k-fold cross-validation dangerous on financial data? What do you do instead?",
   "essentiel": true
  },
  {
   "id": "ml-fuite-information",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Donne trois exemples de fuite d'information (data leakage) dans un modèle de prévision de rendements.",
   "solution": "1. **Normaliser sur tout l'échantillon** (moyenne et écart-type calculés avec les données futures) avant de découper entraînement et test.\n2. **Données non point-in-time** : utiliser des résultats d'entreprise révisés, ou publiés après la date de décision ; utiliser la composition actuelle d'un indice (biais du survivant).\n3. **Décalage d'un jour** : le signal utilise le prix de clôture du jour qu'on prétend trader à la clôture (c'est le bug corrigé dans ton projet stat arb).\n4. **Sélection de variables ou d'hyperparamètres** sur l'échantillon de test.\n5. **Étiquettes qui se chevauchent** entre entraînement et test (rendements à 20 jours calculés chaque jour).",
   "en": "Give three examples of data leakage in a return-forecasting model.",
   "essentiel": true
  },
  {
   "id": "ml-foret-boosting",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Forêt aléatoire ou gradient boosting : comment fonctionnent-ils et quand choisir l'un ou l'autre ?",
   "solution": "- **Forêt aléatoire** : beaucoup d'arbres profonds entraînés en parallèle sur des échantillons bootstrap et des sous-ensembles aléatoires de variables, puis moyennés. Réduit la **variance** ; robuste, peu de réglages, difficile à sur-apprendre gravement.\n- **Gradient boosting** (XGBoost, LightGBM) : arbres peu profonds ajoutés un à un, chacun corrigeant les erreurs (le gradient de la perte) des précédents, avec un taux d'apprentissage. Réduit le **biais** ; souvent plus précis sur données tabulaires, mais plus sensible aux réglages et au sur-apprentissage (arrêt précoce).\nEn finance (signal faible), la forêt ou un boosting très régularisé, et toujours une comparaison avec un modèle linéaire simple.",
   "en": "Random forest vs gradient boosting: how do they work and when would you pick one?"
  },
  {
   "id": "ml-surapprentissage-finance",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Pourquoi le machine learning est-il plus difficile en prévision de rendements qu'en reconnaissance d'images ?",
   "solution": "- **Rapport signal/bruit minuscule** : une corrélation de 0,05 entre prévision et rendement est déjà excellente.\n- **Non-stationnarité** : les relations changent (régimes, nouveaux acteurs) ; les signaux connus s'arbitrent et disparaissent.\n- **Peu de données indépendantes** : 20 ans de données quotidiennes, c'est 5 000 points très bruités et dépendants.\n- **Réflexivité** : trader un signal modifie les prix.\n- **Coûts et capacité** : un signal prédictif peut ne pas survivre aux coûts.\nD'où : modèles simples, régularisation forte, validation stricte, interprétabilité, économie du signal (pourquoi devrait-il marcher ?).",
   "en": "Why is machine learning harder for return prediction than for image recognition?"
  },
  {
   "id": "ml-metriques-desequilibre",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Tu détectes des fraudes (0,1 % des transactions). Ton modèle a 99,9 % d'exactitude. Est-ce bien ? Quelles métriques utiliser ?",
   "solution": "Non : prédire « jamais de fraude » donne déjà 99,9 %. Métriques adaptées :\n- **précision** (parmi les alertes, combien de vraies fraudes) et **rappel** (parmi les fraudes, combien détectées) ; $F1$ ;\n- courbe précision-rappel et son aire (plus informative que l'AUC ROC quand les positifs sont rares) ;\n- coût métier : coût d'une fraude manquée contre coût d'une fausse alerte, pour choisir le seuil.\nTraitement : pondération des classes, sous- ou sur-échantillonnage, seuil adapté.",
   "en": "You detect fraud (0.1% of transactions). Your model has 99.9% accuracy. Is that good? Which metrics should you use?"
  },
  {
   "id": "ml-precision-rappel",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "numerique",
   "question": "Il y a 100 cas positifs. Ton modèle en signale 50, dont 40 sont de vrais positifs. Que vaut le score $F1$ ?",
   "solution": "Précision $= 40/50 = 0{,}8$ ; rappel $= 40/100 = 0{,}4$. $F_1 = 2PR/(P + R) = 0{,}64/1{,}2 \\approx$ **0,533** (moyenne harmonique : pénalise le déséquilibre).",
   "en": "There are 100 positive cases. Your model flags 50, of which 40 are true positives. What is the $F1$ score?",
   "reponse": "2*0.8*0.4/(0.8+0.4)",
   "valeur": 0.5333333333333333,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ml-log-loss",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "numerique",
   "question": "Un classifieur prédit une probabilité 0,8 pour un exemple dont l'étiquette vraie est 1. Que vaut l'entropie croisée (log-loss) de cet exemple, en logarithme népérien ?",
   "solution": "$-\\ln (0{,}8) \\approx$ **0,223**. Une prédiction de 0,01 pour une étiquette 1 coûterait $-\\ln (0{,}01) \\approx 4{,}6$ : la log-loss punit sévèrement la confiance mal placée.",
   "en": "A classifier predicts 0.8 for an example whose true label is 1. What is the log-loss for that example (natural log)?",
   "reponse": "-ln(0.8)",
   "valeur": 0.2231435513142097,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "ml-regression-logistique",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Explique la régression logistique : modèle, fonction de perte, interprétation des coefficients.",
   "solution": "$\\mathbb{P}(y = 1 | x) = \\sigma (\\beta^{T}x) = 1/(1 + e^{-\\beta^{T}x})$. On maximise la vraisemblance, ce qui revient à minimiser l'entropie croisée (convexe : pas de minimum local). Pas de formule fermée : Newton (IRLS) ou descente de gradient.\nInterprétation : $e^{\\beta_j}$ est le facteur multiplicatif de la **cote** $P/(1 - P)$ quand $x_j$ augmente de 1.\nUsages : score de crédit (probabilité de défaut), classification de régimes. Limites : frontière linéaire (sauf variables construites), séparation parfaite (coefficients infinis sans régularisation).",
   "en": "Explain logistic regression: model, loss function, coefficient interpretation."
  },
  {
   "id": "ml-importance-variables",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment mesurer l'importance des variables d'un modèle ? Quels pièges ?",
   "solution": "- **Importance par impureté** (MDI) des arbres : rapide, mais biaisée vers les variables continues ou à nombreuses modalités, et calculée en échantillon.\n- **Importance par permutation** (MDA) : baisse de performance hors échantillon quand on mélange une variable. Plus fiable, mais deux variables corrélées se partagent (ou se masquent) l'importance.\n- **SHAP** : contributions additives par observation, fondées sur les valeurs de Shapley ; coûteux, mêmes difficultés avec la corrélation.\nPièges : importance $\\neq$ causalité ; variables corrélées ; importance en échantillon qui reflète le sur-apprentissage. Solution partielle : regrouper les variables corrélées (importance par groupe).",
   "en": "How do you measure feature importance? What are the pitfalls?"
  },
  {
   "id": "ml-descente-gradient",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Explique la descente de gradient stochastique. Que se passe-t-il si le taux d'apprentissage est trop grand ou trop petit ?",
   "solution": "On met à jour $\\theta \\leftarrow \\theta - \\eta \\nabla L(\\theta)$ en estimant le gradient sur un mini-lot au lieu de tout l'échantillon : moins cher par pas, bruité, ce bruit aidant parfois à sortir de mauvais minima.\n- $\\eta$ trop grand : oscillations, divergence.\n- $\\eta$ trop petit : convergence très lente, blocage sur des plateaux.\nAméliorations : momentum, Adam (pas adaptatif par paramètre), décroissance du taux, normalisation des variables (un problème mal conditionné force un petit $\\eta$).",
   "en": "Explain stochastic gradient descent. What happens if the learning rate is too large or too small?",
   "relances": [
    "Pourquoi normaliser les variables accélère-t-il la convergence ? (courbes de niveau plus rondes : le gradient pointe vers le minimum)"
   ]
  },
  {
   "id": "ml-pca",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que l'analyse en composantes principales ? Comment l'utiliserais-tu sur des rendements d'actions ?",
   "solution": "On cherche les directions orthogonales de variance maximale : vecteurs propres de la matrice de covariance (ou corrélation), triés par valeur propre. On garde les premières composantes pour réduire la dimension.\nSur des rendements d'actions : la première composante est presque toujours le **marché** (tous les poids du même signe), les suivantes des secteurs ou des styles. Usages : modèles de risque factoriels, débruitage de la matrice de covariance (théorie des matrices aléatoires : les valeurs propres sous le seuil de Marchenko-Pastur sont du bruit), résidus pour de l'arbitrage statistique (Avellaneda-Lee).\nPrécautions : normaliser, instabilité des vecteurs propres, non-stationnarité.",
   "en": "What is PCA? How would you use it on stock returns?"
  },
  {
   "id": "ml-k-means",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment fonctionne l'algorithme des k-moyennes ? Quelles limites ?",
   "solution": "Initialiser $k$ centres ; répéter jusqu'à stabilité : affecter chaque point au centre le plus proche, puis recalculer chaque centre comme la moyenne de ses points. Minimise la somme des distances au carré intra-groupes (localement).\nLimites : $k$ à choisir (méthode du coude, silhouette) ; dépend de l'initialisation (k-means++ et plusieurs essais) ; suppose des groupes sphériques de tailles comparables ; sensible aux échelles et aux valeurs aberrantes.\nEn finance : regrouper des actifs par profil de corrélation (plutôt avec une distance fondée sur la corrélation, ou un regroupement hiérarchique).",
   "en": "How does k-means work? What are its limits?"
  },
  {
   "id": "ml-normalisation",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Quand faut-il normaliser les variables ? Comment le faire sans fuite d'information sur des séries temporelles ?",
   "solution": "Nécessaire pour les modèles sensibles aux échelles : régularisation (Ridge, Lasso), distances (k-moyennes, $k$ plus proches voisins), descente de gradient, réseaux de neurones, ACP. Inutile pour les arbres.\nSans fuite : calculer moyenne et écart-type sur l'échantillon d'entraînement seulement (ou sur une fenêtre glissante du passé), et les appliquer tels quels au test. En séries temporelles, préférer des normalisations glissantes (z-score sur 60 jours passés), ou des rangs en coupe transversale (chaque date séparément).",
   "en": "When should you scale features? How do you do it without leakage on time series?"
  },
  {
   "id": "ml-auc",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "numerique",
   "question": "Un classifieur donne les scores 0,9 ; 0,7 ; 0,4 à trois exemples positifs et 0,8 ; 0,3 à deux exemples négatifs. Que vaut l'AUC (aire sous la courbe ROC) ?",
   "solution": "On compare les $3 \\times 2 = 6$ paires (positif, négatif) : 0,9 bat 0,8 et 0,3 ; 0,7 bat 0,3 ; 0,4 bat 0,3. 4 paires bien ordonnées sur 6 : **AUC $= 2/3$**.\nCette lecture (statistique de Mann-Whitney) montre que l'AUC ne dépend que du classement des scores, pas de leur calibration.",
   "en": "A classifier scores three positives 0.9, 0.7, 0.4 and two negatives 0.8, 0.3. What is the ROC AUC?",
   "indice": "L'AUC est la probabilité qu'un positif tiré au hasard ait un score plus élevé qu'un négatif tiré au hasard.",
   "relances": [
    "AUC d'un classifieur aléatoire ? (0,5)"
   ],
   "reponse": "4/6",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "ml-loi-fondamentale",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "hf",
    "data"
   ],
   "type": "numerique",
   "question": "Ton signal a une corrélation de 0,05 avec les rendements futurs (information coefficient) et tu peux prendre 400 paris indépendants par an. Quel ratio d'information annuel approximatif ?",
   "solution": "Loi fondamentale de la gestion active (Grinold) : $\\text{IR} \\approx \\text{IC} \\times \\sqrt{\\text{largeur}} = 0{,}05 \\times \\sqrt{400} =$ **1**.\nMessage : une prévision faible appliquée à beaucoup de paris indépendants peut donner une bonne stratégie, d'où l'intérêt des univers larges et des horizons courts. Limites : les paris sont rarement indépendants (facteurs communs), et les coûts croissent avec la rotation.",
   "en": "Your signal has a 0.05 correlation with future returns and you can take 400 independent bets a year. Approximate annual information ratio?",
   "reponse": "0.05*sqrt(400)",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ml-desequilibre-temporel",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Ton modèle de classification de la direction du marché du lendemain a 54 % d'exactitude sur l'échantillon de test. Est-ce bon ? Comment le savoir ?",
   "solution": "Ça dépend :\n- **Référence naïve** : si le marché a monté 54 % des jours sur la période de test, « toujours hausse » fait aussi bien. Comparer à la meilleure stratégie triviale.\n- **Significativité** : sur 250 jours, l'écart-type de l'exactitude d'un classifieur au hasard est $\\sqrt{0{,}25/250} \\approx 3{,}2\\,\\%$ ; 54 % n'est qu'à environ 1,3 écart-type de 50 %.\n- **Économie** : l'exactitude ignore l'ampleur des mouvements ; un modèle juste sur les petits jours et faux sur les grands perd de l'argent. Évaluer le PnL après coûts, le Sharpe, le drawdown.\n- **Stabilité** : performance par sous-période, et absence de fuite d'information.",
   "en": "Your next-day market direction classifier is 54% accurate out of sample. Is that good? How do you know?"
  },
  {
   "id": "ml-arbre-decision",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Comment un arbre de décision choisit-il ses séparations ? Pourquoi un arbre seul sur-apprend-il facilement ?",
   "solution": "À chaque nœud, il teste toutes les variables et tous les seuils, et choisit la séparation qui réduit le plus l'impureté : indice de Gini ou entropie en classification, variance (erreur quadratique) en régression. Il recommence récursivement sur chaque sous-ensemble.\nUn arbre profond peut isoler chaque observation dans sa feuille : biais faible mais variance énorme. Remèdes : profondeur maximale, nombre minimal d'observations par feuille, élagage, et surtout les ensembles (forêts aléatoires, boosting).",
   "en": "How does a decision tree choose its splits? Why does a single tree overfit easily?"
  },
  {
   "id": "ml-acp-variance",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "numerique",
   "question": "Une ACP sur la matrice de covariance de quatre variables donne les valeurs propres 4, 2, 1 et 1. Quelle part de la variance totale la première composante explique-t-elle ?",
   "solution": "La variance totale est la somme des valeurs propres (la trace de la matrice) : $4/(4 + 2 + 1 + 1) =$ **50 %**. Les deux premières composantes : 75 %.\nSur des variables standardisées (matrice de corrélation), la somme des valeurs propres vaudrait le nombre de variables, 4 : ces valeurs propres ne peuvent donc pas venir d'une matrice de corrélation de 4 variables.",
   "en": "A PCA on the covariance matrix of four variables gives eigenvalues 4, 2, 1, 1. What share of total variance does the first component explain?",
   "piege": "Faire une ACP sur des variables d'échelles différentes sans les standardiser : la variable de plus grande variance domine la première composante.",
   "relances": [
    "Que vaut la somme des valeurs propres d'une matrice de corrélation de 4 variables ? (4)"
   ],
   "reponse": "4/(4+2+1+1)",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "ml-cote-logistique",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "numerique",
   "question": "Dans une régression logistique de défaut, le coefficient de la variable « endettement » vaut 0,7. Par combien la cote du défaut ($p/(1 - p)$) est-elle multipliée quand l'endettement augmente d'une unité ?",
   "solution": "$e^{0{,}7} \\approx$ **2,01** : la cote double environ. La probabilité, elle, ne double pas : l'effet sur $p$ dépend du niveau de départ ($dp/dx = \\beta p(1 - p)$, maximal autour de $p = 1/2$).",
   "en": "In a default logistic regression, the leverage coefficient is 0.7. By what factor are the default odds multiplied when leverage rises by one unit?",
   "reponse": "exp(0.7)",
   "valeur": 2.0137527074704766,
   "tolerance": 0.01,
   "duree": 120
  },
  {
   "id": "ml-matrice-confusion",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "numerique",
   "question": "Sur 1 000 transactions, un modèle de fraude signale 120 alertes, dont 90 vraies fraudes ; il y a 100 fraudes au total. Quelle est la précision du modèle ?",
   "solution": "Vrais positifs 90, faux positifs 30, faux négatifs 10, vrais négatifs 870. Précision $= 90/120 =$ **0,75** ; rappel $= 90/100 = 0{,}9$ ; taux de faux positifs $= 30/900 \\approx 3{,}3\\,\\%$ ; exactitude $= 960/1\\,000 = 96\\,\\%$.",
   "en": "Out of 1,000 transactions, a fraud model raises 120 alerts, 90 of which are real frauds; there are 100 frauds in total. What is the model's precision?",
   "relances": [
    "Quel seuil choisir ? (celui qui minimise le coût attendu : coût d'une fraude manquée $\\times$ faux négatifs $+$ coût d'une alerte $\\times$ faux positifs)"
   ],
   "reponse": "90/(90+30)",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ml-ridge-retrecissement",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "numerique",
   "question": "Avec des variables explicatives orthonormées ($X^{T}X = n \\cdot I$), la régression Ridge multiplie chaque coefficient des moindres carrés par $n/(n + \\lambda)$. Avec $n = 250$ observations et $\\lambda = 250$, quel facteur de rétrécissement ?",
   "solution": "$250/(250 + 250) =$ **0,5** : chaque coefficient est divisé par deux. Ridge rétrécit tous les coefficients dans la même proportion dans ce cas, alors que le Lasso soustrait un seuil et met à zéro les petits coefficients (seuillage doux).",
   "en": "With orthonormal regressors ($X^{T}X = n \\cdot I$), Ridge multiplies each OLS coefficient by $n/(n + \\lambda)$. With $n = 250$ and $\\lambda = 250$, what shrinkage factor?",
   "reponse": "1/(1+1)",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "ml-surapprentissage-signes",
   "theme": "ml",
   "niveau": 1,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment reconnais-tu un modèle qui sur-apprend, et que fais-tu ?",
   "solution": "Signes : erreur très faible à l'entraînement et nettement plus forte en validation ; performance qui se dégrade quand on ajoute des variables ou de la complexité ; résultats instables d'un échantillon ou d'une graine à l'autre ; coefficients ou importances qui changent beaucoup ; en finance, un backtest trop beau (Sharpe très élevé, peu de pertes).\nRemèdes : simplifier (moins de variables, modèle moins profond), régulariser (L1, L2, dropout, arrêt précoce), plus de données, validation plus stricte (walk-forward, échantillon de test gelé), et se méfier du nombre de variantes essayées.",
   "en": "How do you recognize an overfitting model, and what do you do?"
  },
  {
   "id": "ml-arret-precoce",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que l'arrêt précoce (early stopping) pour un réseau de neurones ou un gradient boosting ? Quel piège en séries temporelles ?",
   "solution": "On suit l'erreur sur un échantillon de validation pendant l'entraînement et on s'arrête quand elle cesse de baisser (avec une patience de quelques itérations), en gardant le meilleur modèle. C'est une régularisation : moins d'itérations, modèle plus simple.\nPiège : l'échantillon de validation sert à choisir le nombre d'itérations, il n'est donc plus un échantillon de test. En séries temporelles, il doit être **postérieur** à l'entraînement (et antérieur au test final), sinon le modèle « voit » le futur.",
   "en": "What is early stopping for neural networks or gradient boosting? What is the time-series pitfall?"
  },
  {
   "id": "ml-desequilibre-classes",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Tes données ont 1 % de positifs. Faut-il rééchantillonner (sous-échantillonnage, sur-échantillonnage, SMOTE) ? Quelles conséquences sur les probabilités prédites ?",
   "solution": "Ce n'est pas obligatoire : souvent, un modèle probabiliste bien régularisé, une pondération des classes et un **seuil** choisi selon les coûts suffisent. Le rééchantillonnage peut aider certains algorithmes à apprendre la classe rare, mais il **déforme les probabilités** : un modèle entraîné sur 50 % de positifs surestime fortement la probabilité réelle (qui est de 1 % en moyenne). Il faut alors recalibrer (correction par le taux de base, calibration de Platt ou isotonique sur des données non rééchantillonnées). SMOTE invente des points synthétiques et peut créer des fuites si on l'applique avant le découpage en validation croisée.",
   "en": "Your data has 1% positives. Should you resample (undersampling, oversampling, SMOTE)? What happens to predicted probabilities?"
  },
  {
   "id": "ml-features-finance",
   "theme": "ml",
   "niveau": 2,
   "profils": [
    "data",
    "hf"
   ],
   "type": "ouverte",
   "question": "Quelles variables construirais-tu pour prédire le rendement à 5 jours d'une action, et comment éviterais-tu les pièges ?",
   "solution": "Exemples : rendements passés sur plusieurs horizons (retour à la moyenne à court terme, momentum sur plusieurs mois), volatilité récente, volume relatif, écart au secteur, révisions d'analystes, valorisation, surprises de résultats, variables de marché (taux, volatilité implicite).\nPièges et parades :\n- **Normaliser** en coupe transversale (rangs ou z-scores par date) pour retirer l'effet marché et les échelles différentes.\n- **Données point-in-time** et décalage d'un jour pour ne rien utiliser avant sa publication.\n- **Étiquettes qui se chevauchent** (rendements à 5 jours calculés chaque jour) : validation purgée, écarts-types corrigés.\n- **Neutraliser** les expositions indésirables (secteur, taille, bêta) si l'on veut un signal spécifique.\n- Tester la **stabilité** dans le temps et le coût de transaction du signal.",
   "en": "Which features would you build to predict a stock's 5-day return, and how would you avoid pitfalls?"
  },
  {
   "id": "ml-regression-quantile",
   "theme": "ml",
   "niveau": 3,
   "profils": [
    "data",
    "hf",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que la régression quantile ? Quand la préférer à la régression des moindres carrés en finance ?",
   "solution": "Elle estime un quantile conditionnel (par exemple le 5ᵉ centile du rendement sachant des variables) en minimisant une perte asymétrique (« pinball ») : $\\tau \\cdot e$ si l'erreur $e$ est positive, $(\\tau - 1) \\cdot e$ sinon. Pour $\\tau = 0{,}5$, c'est la médiane (perte absolue), robuste aux valeurs extrêmes.\nUsages : VaR conditionnelle (CAViaR), effet des variables sur les queues de distribution plutôt que sur la moyenne, données à queues épaisses ou hétéroscédastiques. Les moindres carrés modélisent seulement la moyenne conditionnelle et sont sensibles aux valeurs extrêmes.",
   "en": "What is quantile regression? When is it preferable to least squares in finance?"
  },
  {
   "id": "proba-deux-des-somme-7",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés équilibrés. Quelle est la probabilité que la somme fasse 7 ?",
   "solution": "Les couples (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) : 6 sur 36, soit **$1/6$**. C'est la somme la plus probable.",
   "en": "You roll two fair dice. What is the probability that the sum is 7?",
   "indice": "Compte les couples ($a, b$) sur les 36 possibles.",
   "relances": [
    "Quelle est la loi de la somme ? (triangulaire : 1, 2, …, 6, …, 2, 1 sur 36)",
    "Et avec trois dés, quelle somme est la plus probable ? (10 et 11, $27/216$ chacune)"
   ],
   "reponse": "1/6",
   "valeur": 0.16666666666666666,
   "tolerance": 0.005,
   "duree": 60,
   "essentiel": true
  },
  {
   "id": "proba-des-somme-7-sachant-un-6",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés. On t'annonce qu'au moins un des deux montre un 6. Quelle est la probabilité que la somme fasse 7 ?",
   "solution": "Couples avec au moins un 6 : $6 + 6 - 1 =$ **11**. Parmi eux, somme 7 : (1,6) et (6,1). Probabilité **$2/11$**.",
   "en": "Two dice are rolled and you are told at least one of them shows a 6. What is the probability that the sum is 7?",
   "indice": "Combien de couples contiennent au moins un 6 ? (attention à ne pas compter (6,6) deux fois)",
   "piege": "Répondre $1/6$ (« le premier dé est un 6 ») : l'information « au moins un » ne désigne pas un dé précis.",
   "relances": [
    "Et si on t'avait dit « le premier dé montre 6 » ? ($1/6$)"
   ],
   "reponse": "2/11",
   "valeur": 0.18181818181818182,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "proba-attente-premier-six",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de lancers faut-il en moyenne pour obtenir le premier 6 avec un dé équilibré ?",
   "solution": "Le nombre de lancers suit une loi géométrique de paramètre $p = 1/6$ : espérance **$1/p = 6$**.\nDémonstration par conditionnement sur le premier lancer : $E = 1 + (5/6) \\cdot E$, donc $E = 6$.",
   "en": "How many rolls of a fair die do you need on average to get the first 6?",
   "relances": [
    "Variance ? ($(1 - p)/p^{2} = 30$)",
    "Probabilité qu'il faille plus de 6 lancers ? ($(5/6)^{6} \\approx 0{,}335$)"
   ],
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.005,
   "duree": 60,
   "essentiel": true
  },
  {
   "id": "proba-toutes-les-faces",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Combien de lancers faut-il en moyenne pour voir les six faces d'un dé au moins une fois ?",
   "solution": "Problème du collectionneur de vignettes. Avec $k$ faces vues, une nouvelle face sort avec probabilité $(6 - k)/6$ : attente géométrique de moyenne $6/(6 - k)$.\nTotal : $6 \\cdot (1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 6 \\times 2{,}45 =$ **14,7**.",
   "en": "What is the expected number of rolls of a fair die needed to see all six faces at least once?",
   "indice": "Découpe l'attente en étapes : quand tu as déjà vu $k$ faces, combien de lancers pour en voir une nouvelle ?",
   "relances": [
    "Ordre de grandeur pour $n$ faces ? ($n \\cdot \\ln n + 0{,}577 \\cdot n$)",
    "Variance de ce temps ? (somme des variances géométriques, $\\approx 38{,}99$)"
   ],
   "categorie": "probas",
   "titre": "Voir les six faces d’un dé (collectionneur de vignettes)",
   "reponse": "6*(1+1/2+1/3+1/4+1/5+1/6)",
   "valeur": 14.7,
   "tolerance": 0.005,
   "duree": 180,
   "voir": [
    "proba-coupons-moitie"
   ],
   "essentiel": true
  },
  {
   "id": "proba-pile-pile",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance une pièce équilibrée jusqu'à obtenir deux « pile » consécutifs. Combien de lancers en moyenne ?",
   "solution": "Soit $E$ l'attente depuis le départ, $E_{1}$ depuis « je viens d'avoir un pile ».\n- $E = 1 + \\tfrac12 E_{1} + \\tfrac12 E$\n- $E_{1} = 1 + \\tfrac12 \\cdot 0 + \\tfrac12 E$\nDe la première : $E = 2 + E_{1}$ ; avec la seconde : $E = 2 + 1 + E/2$, donc **$E = 6$**.",
   "en": "You flip a fair coin until you get two heads in a row. What is the expected number of flips?",
   "indice": "Définis des états : rien d'utile, « un pile vient de tomber ». Écris une équation par état.",
   "relances": [
    "Et pour « pile puis face » ? (4 : une fois le pile obtenu, on attend juste un face)",
    "Pourquoi PP et PF n'ont-ils pas la même attente alors qu'ils ont la même probabilité ? (PP se chevauche avec lui-même : un échec après $P$ vous renvoie au début)",
    "Formule générale pour $n$ piles consécutifs ? ($2^{n+1} - 2$)"
   ],
   "reponse": "6",
   "valeur": 6.0,
   "tolerance": 0.005,
   "duree": 180,
   "essentiel": true
  },
  {
   "id": "proba-pile-face",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance une pièce équilibrée jusqu'à voir la séquence « pile puis face ». Combien de lancers en moyenne ?",
   "solution": "Il faut d'abord un pile (2 lancers en moyenne), puis on attend un face (2 lancers en moyenne) : un face qui suit un pile termine, et un pile ne fait pas perdre la progression. Total **4**.",
   "en": "Expected number of fair coin flips until you see heads followed by tails?",
   "relances": [
    "Pourquoi PP prend-il 6 lancers en moyenne ?"
   ],
   "categorie": "probas",
   "titre": "Attendre la séquence pile puis face",
   "reponse": "4",
   "valeur": 4.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proba-pfp",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Combien de lancers d'une pièce équilibrée faut-il en moyenne pour voir apparaître la séquence pile-face-pile ?",
   "solution": "Notons $E_{0}, E_{1}$ (après $P$), $E_{2}$ (après PF).\n- $E_{0} = 1 + \\tfrac12 E_{1} + \\tfrac12 E_{0}$\n- $E_{1} = 1 + \\tfrac12 E_{1} + \\tfrac12 E_{2}$ (un $P$ de plus laisse en « P »)\n- $E_{2} = 1 + \\tfrac12 \\cdot 0 + \\tfrac12 E_{0}$ (un $F$ donne « PFF » : rien d'utile)\nOn trouve $E_{0} = 2 + E_{1}, E_{1} = 2 + E_{2}, E_{2} = 1 + E_{0}/2$, d'où $E_{0} = 5 + E_{0}/2$ et **$E_{0} = 10$**.\nMéthode rapide (martingale des parieurs, « abracadabra ») : on somme $2^k$ pour chaque $k$ où le préfixe de longueur $k$ égale le suffixe de longueur $k$ : $2^{3} + 2^{1} = 10$.",
   "en": "What is the expected number of fair coin flips until the pattern HTH first appears?",
   "indice": "États : départ, « P », « PF ». Depuis « PF », un face te renvoie au départ, pas en « P ».",
   "relances": [
    "Et pour PFF ? (8 : aucun chevauchement, $2^{3}$)",
    "Dans une course PFP contre PFF, qui sort en premier ? (chacune avec probabilité $1/2$ : après « PF », le lancer suivant décide. Une attente plus courte ne veut pas dire « gagne la course » en général : voir le jeu de Penney)"
   ],
   "categorie": "probas",
   "titre": "Attendre la séquence pile, face, pile",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-penney-ppf-pff",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance une pièce jusqu'à ce que l'une des séquences PPF ou PFF apparaisse. Quelle est la probabilité que PPF apparaisse en premier ?",
   "solution": "On attend le premier $P$. Soit a la probabilité que PPF gagne depuis l'état « P », $b$ depuis l'état « PF ».\n- Depuis « P » : si $P$, on est en « PP » et PPF gagne sûrement (un $F$ finira par venir, et tout $P$ maintient « PP ») ; si $F$, on va en « PF ». Donc $a = \\tfrac12 \\cdot 1 + \\tfrac12 \\cdot b$.\n- Depuis « PF » : si $F$, PFF gagne (0) ; si $P$, on revient en « P ». Donc $b = \\tfrac12 \\cdot a$.\n$a = \\tfrac12 + a/4$, soit **$a = 2/3$**.",
   "en": "Flip a fair coin until either HHT or HTT appears. What is the probability that HHT comes first?",
   "indice": "Les deux séquences commencent par $P$. Une fois le premier $P$ tombé, regarde ce que fait le lancer suivant.",
   "relances": [
    "Qu'est-ce que le jeu de Penney ? (pour toute séquence de 3 choisie par l'adversaire, il existe une séquence qui la bat : relation non transitive)"
   ],
   "categorie": "probas",
   "titre": "Jeu de Penney : PPF contre PFF",
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-premier-a-faire-six",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "A et B lancent un dé à tour de rôle, A commence. Le premier qui fait 6 gagne. Probabilité que A gagne ?",
   "solution": "Soit $p$ la probabilité que A gagne. A gagne au premier lancer ($1/6$), ou bien A et B ratent ($25/36$) et on recommence : $p = 1/6 + (25/36) \\cdot p$, donc $p = (1/6)/(11/36) =$ **$6/11$**.",
   "en": "A and B take turns rolling a die, A goes first. The first to roll a 6 wins. What is the probability that A wins?",
   "relances": [
    "Combien de lancers dure la partie en moyenne ? (6)",
    "Quel avantage A a-t-il ? ($6/11$ contre $5/11$ : B gagne $5/6$ fois moins souvent)"
   ],
   "categorie": "probas",
   "titre": "Le premier qui fait 6 gagne",
   "reponse": "6/11",
   "valeur": 0.5454545454545454,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "proba-deux-enfants",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une famille a deux enfants. On sait qu'au moins l'un des deux est un garçon. Quelle est la probabilité que les deux soient des garçons ? (On suppose garçon et fille équiprobables et indépendants.)",
   "solution": "Cas équiprobables : GG, GF, FG, FF. « Au moins un garçon » exclut FF : il reste 3 cas, dont un seul GG : **$1/3$**.",
   "en": "A family has two children, at least one of whom is a boy. What is the probability that both are boys?",
   "piege": "Si l'on t'avait dit « l'aîné est un garçon », la réponse serait $1/2$. La manière dont l'information est obtenue change la réponse.",
   "relances": [
    "Variante : « au moins un garçon né un mardi » ? ($13/27$ : plus l'information est précise, plus on se rapproche de $1/2$)"
   ],
   "categorie": "probas",
   "titre": "Deux enfants, au moins un garçon",
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 90,
   "voir": [
    "ct-p-garcon-mardi"
   ]
  },
  {
   "id": "proba-test-medical",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Une maladie touche 1 % de la population. Un test la détecte chez 99 % des malades, mais donne aussi un résultat positif chez 5 % des personnes saines. Ton test est positif : quelle est la probabilité que tu sois malade ?",
   "solution": "Sur 10 000 personnes : 100 malades dont 99 positifs ; 9 900 saines dont 495 positives.\n$\\mathbb{P}(\\text{malade} | \\text{positif}) = 99 / (99 + 495) = 99/594 =$ **$1/6 \\approx 16{,}7\\,\\%$**.\nFormule de Bayes : $\\mathbb{P}(M|+) = \\mathbb{P}(+|M)\\mathbb{P}(M) / [\\mathbb{P}(+|M)\\mathbb{P}(M) + \\mathbb{P}(+|S)\\mathbb{P}(S)]$.",
   "en": "A disease affects 1% of the population. A test detects it in 99% of sick people but also returns a positive result for 5% of healthy people. You test positive. What is the probability you have the disease?",
   "indice": "Raisonne sur 10 000 personnes.",
   "piege": "Répondre 99 % : on confond $\\mathbb{P}(\\text{positif} | \\text{malade})$ et $\\mathbb{P}(\\text{malade} | \\text{positif})$. C'est l'erreur du taux de base (« base rate fallacy »).",
   "relances": [
    "Que se passe-t-il si tu refais un test indépendant et qu'il est encore positif ? (cote a priori $1:5$, rapport de vraisemblance $0{,}99/0{,}05 = 19{,}8$ : cote a posteriori $\\approx 4:1$, soit $\\approx 79{,}8\\,\\%$)",
    "Lien avec la finance ? (un signal « précis » sur un événement rare donne surtout des faux positifs : fraude, défauts)"
   ],
   "categorie": "probas",
   "titre": "Test médical et faux positifs",
   "reponse": "1/6",
   "valeur": 0.16666666666666666,
   "tolerance": 0.005,
   "duree": 180,
   "essentiel": true
  },
  {
   "id": "proba-monty-hall",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois portes, une voiture derrière l'une d'elles. Tu en choisis une ; le présentateur, qui sait où est la voiture, ouvre une autre porte sans voiture et te propose de changer. Probabilité de gagner si tu changes ?",
   "solution": "Ta porte initiale a $1/3$ de chances et le présentateur ne change rien à cette probabilité (il peut toujours ouvrir une porte vide). Les $2/3$ restants se concentrent sur l'autre porte fermée : changer gagne avec probabilité **$2/3$**.",
   "en": "Monty Hall: three doors, one car. You pick a door; the host, who knows where the car is, opens another door with a goat and offers you to switch. What is your probability of winning if you switch?",
   "piege": "Le résultat dépend du comportement du présentateur : s'il ouvrait une porte au hasard (et tombait par chance sur une chèvre), changer ne donnerait que $1/2$.",
   "relances": [
    "Et avec 100 portes dont le présentateur en ouvre 98 ? ($99/100$ en changeant)"
   ],
   "categorie": "probas",
   "titre": "Le problème de Monty Hall",
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "proba-baton-triangle",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On casse un bâton de longueur 1 en deux points choisis uniformément et indépendamment. Probabilité que les trois morceaux forment un triangle ?",
   "solution": "Supposons $x < y$ (moitié du carré). Morceaux : $x, y - x, 1 - y$, tous $< 1/2$ : $x < 1/2, y > 1/2, y - x < 1/2$. C'est un triangle d'aire $1/8$ dans le demi-carré d'aire $1/2$ : probabilité **$1/4$**.",
   "en": "A stick of length 1 is broken at two points chosen uniformly at random. What is the probability that the three pieces form a triangle?",
   "indice": "Un triangle existe si et seulement si chaque morceau est plus court que $1/2$. Représente les deux points ($x, y$) dans le carré unité.",
   "relances": [
    "Et si on casse d'abord en un point, puis qu'on casse le plus long morceau en un point uniforme ? ($2 \\cdot \\ln 2 - 1 \\approx 0{,}386$)",
    "Longueur moyenne du plus long morceau ? ($11/18$)"
   ],
   "categorie": "probas",
   "titre": "Bâton cassé en trois : forme-t-il un triangle ?",
   "reponse": "1/4",
   "valeur": 0.25,
   "tolerance": 0.005,
   "duree": 300,
   "essentiel": true
  },
  {
   "id": "proba-baton-plus-long",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Un bâton de longueur 1 est cassé en trois morceaux par deux points uniformes indépendants. Longueur moyenne du plus long morceau ?",
   "solution": "Pour $n = 3$ morceaux, le plus long ($k = 3$) : $(1/3) \\cdot (1/3 + 1/2 + 1) = (1/3) \\cdot (11/6) =$ **$11/18 \\approx 0{,}611$**.\nVérification : le plus petit vaut en moyenne $1/9$, le moyen $5/18$, et $1/9 + 5/18 + 11/18 = 1$.",
   "en": "A unit stick is broken at two independent uniform points. What is the expected length of the longest piece?",
   "indice": "Les trois longueurs se comportent comme des espacements uniformes. Pour $n$ morceaux, l'espérance du k-ième plus petit est $(1/n) \\cdot (1/n + 1/(n-1) + \\dots + 1/(n-k+1))$.",
   "relances": [
    "Et le plus petit morceau ? ($1/9$)"
   ],
   "categorie": "probas",
   "titre": "Bâton cassé en trois : longueur du plus long morceau",
   "reponse": "11/18",
   "valeur": 0.6111111111111112,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "proba-demi-cercle",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On place trois points uniformément sur un cercle. Probabilité qu'ils soient tous dans un même demi-cercle ?",
   "solution": "Pour un point $i$ donné, les deux autres sont dans le demi-cercle horaire partant de $i$ avec probabilité $(1/2)^{2} = 1/4$. Ces trois événements sont disjoints (au plus un point peut « ouvrir » le demi-cercle) et leur réunion est l'événement cherché : $3 \\times 1/4 =$ **$3/4$**.",
   "en": "Three points are placed uniformly at random on a circle. What is the probability that they all lie in some semicircle?",
   "indice": "Pour chaque point, quelle est la probabilité que les deux autres soient dans le demi-cercle qui commence à ce point (sens horaire) ?",
   "relances": [
    "Généralisation à $n$ points ? ($n / 2^{n-1}$)",
    "Probabilité que le triangle formé contienne le centre ? ($1 - 3/4 = 1/4$)"
   ],
   "categorie": "probas",
   "titre": "Trois points dans un même demi-cercle",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 240,
   "voir": [
    "ct-p-triangle-aigu"
   ]
  },
  {
   "id": "proba-max-deux-uniformes",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "$U$ et $V$ sont indépendantes, uniformes sur [0, 1]. Que vaut $\\mathbb{E}[\\max (U, V)]$ ?",
   "solution": "$\\mathbb{P}(\\max \\le x) = x^{2}$, donc densité $2x$ et $E = \\int_{0}^{1} 2x^{2} dx =$ **$2/3$**.\nPlus généralement, le max de $n$ uniformes a pour espérance $n/(n+1)$, le min $1/(n+1)$.",
   "en": "$U$ and $V$ are independent uniforms on [0, 1]. What is $\\mathbb{E}[\\max (U, V)]$?",
   "relances": [
    "$\\mathbb{E}[\\min (U, V)]$ ? ($1/3$)",
    "$\\operatorname{Cov} (\\min, \\max)$ ? ($1/36$)"
   ],
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "proba-min-cinq-uniformes",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Espérance du minimum de 5 variables uniformes indépendantes sur [0, 1] ?",
   "solution": "$\\mathbb{P}(\\min > x) = (1 - x)^{5}$, donc $\\mathbb{E}[\\min] = \\int_{0}^{1} (1 - x)^{5} dx =$ **$1/6$**.\nIntuition : 5 points découpent [0, 1] en 6 intervalles de même longueur moyenne ; le minimum est le premier intervalle.",
   "en": "What is the expected minimum of 5 independent uniform [0, 1] random variables?",
   "relances": [
    "Espérance du k-ième plus petit parmi $n$ ? ($k/(n+1)$)"
   ],
   "reponse": "1/6",
   "valeur": 0.16666666666666666,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proba-ecart-uniformes",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "$U$ et $V$ sont indépendantes et uniformes sur [0, 1]. Que vaut $\\mathbb{E}[|U - V|]$ ?",
   "solution": "$|U - V| =$ max − min, donc $E = 2/3 - 1/3 =$ **$1/3$**.\nAutre méthode : la densité de $|U - V|$ est $2(1 - d)$ sur [0, 1], d'espérance $\\int 2d(1 - d) dd = 1/3$.",
   "en": "$U, V$ independent uniform on [0, 1]. Compute $\\mathbb{E}[|U - V|]$.",
   "relances": [
    "$\\mathbb{E}[(U - V)^{2}]$ ? ($1/6 = 2 \\operatorname{Var} (U)$)"
   ],
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-somme-uniformes-depasse-un",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On tire des uniformes indépendantes sur [0, 1] et on s'arrête dès que leur somme dépasse 1. Combien de tirages en moyenne ?",
   "solution": "$\\mathbb{P}(U_{1} + \\dots + U_{n} \\le 1)$ est le volume du simplexe : $1/n!$. Donc $\\mathbb{E}[N] = \\sum_{n \\ge 0} \\mathbb{P}(N > n) = \\sum 1/n! =$ **$e \\approx 2{,}718$**.",
   "en": "You draw independent uniform [0, 1] numbers until their sum exceeds 1. What is the expected number of draws?",
   "indice": "Calcule $\\mathbb{P}(N > n) = \\mathbb{P}(U_{1} + \\dots + U_{n} \\le 1)$, puis utilise $\\mathbb{E}[N] = \\sum \\mathbb{P}(N > n)$.",
   "relances": [
    "Et si le seuil est $x \\le 1$ au lieu de 1 ? ($e^{x}$)"
   ],
   "categorie": "probas",
   "titre": "Additionner des uniformes jusqu’à dépasser 1",
   "reponse": "e",
   "valeur": 2.718281828459045,
   "tolerance": 0.005,
   "duree": 420
  },
  {
   "id": "proba-passager-avion",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "100 passagers embarquent dans un avion de 100 places, chacun a une place attribuée. Le premier a perdu sa carte et s'assoit au hasard. Chaque suivant prend sa place si elle est libre, sinon une place libre au hasard. Probabilité que le dernier passager ait sa place ?",
   "solution": "À chaque fois qu'un passager choisit au hasard, il choisit avec la même probabilité la place du premier (tout rentre dans l'ordre : le dernier aura la sienne) ou celle du dernier (perdu). Les autres choix ne font que repousser la décision. Par symétrie : **$1/2$**.",
   "en": "100 passengers board a 100-seat plane. The first one lost their boarding pass and sits in a random seat. Each next passenger takes their own seat if free, otherwise a random free seat. What is the probability that the last passenger gets their own seat?",
   "indice": "Quand le jeu « se décide »-t-il ? Regarde seulement deux places : celle du premier et celle du dernier.",
   "relances": [
    "Probabilité que le 50ᵉ passager ait sa place ? (pour le k-ième : $(n - k + 1)/(n - k + 2)$, soit $51/52$ pour $k = 50$)"
   ],
   "categorie": "probas",
   "titre": "Le passager distrait et la dernière place de l’avion",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 300,
   "essentiel": true
  },
  {
   "id": "proba-points-fixes",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On mélange un jeu de 52 cartes. En moyenne, combien de cartes se retrouvent à leur position d'origine ?",
   "solution": "Linéarité de l'espérance : chaque carte est à sa place avec probabilité $1/52$ ; somme de 52 indicatrices : **1**, quel que soit le nombre de cartes.",
   "en": "A deck of 52 cards is shuffled uniformly. What is the expected number of cards that end up in their original position?",
   "relances": [
    "La variance ? (1 aussi, pour $n \\ge 2$)",
    "La loi du nombre de points fixes quand $n$ est grand ? (Poisson de paramètre 1)"
   ],
   "categorie": "probas",
   "titre": "Cartes restées à leur place après mélange",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "proba-derangement",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On mélange un jeu de 52 cartes. Probabilité qu'aucune carte ne soit à sa position d'origine (valeur approchée) ?",
   "solution": "Inclusion-exclusion : $P = \\sum_{k=0}^{n} (-1)^k / k! \\to$ **$1/e \\approx 0{,}368$**. Pour $n = 52$, la différence avec $1/e$ est inférieure à $10^{-67}$.\nIntuition : le nombre de points fixes suit approximativement une loi de Poisson(1), et $\\mathbb{P}(0) = e^{-1}$.",
   "en": "Approximately, what is the probability that a uniformly shuffled deck of 52 cards has no card in its original position?",
   "indice": "Inclusion-exclusion, ou : le nombre de points fixes est presque une loi de Poisson.",
   "relances": [
    "Le problème des chapeaux : $n$ personnes reprennent un chapeau au hasard ; probabilité qu'au moins une reprenne le sien ? ($1 - 1/e \\approx 63\\,\\%$)"
   ],
   "categorie": "probas",
   "titre": "Aucune carte à sa place (dérangements)",
   "reponse": "exp(-1)",
   "valeur": 0.36787944117144233,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "proba-anniversaires",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Dans un groupe de 23 personnes, probabilité qu'au moins deux aient le même anniversaire (365 jours équiprobables) ?",
   "solution": "$\\mathbb{P}(\\text{tous différents}) = (365/365) \\cdot (364/365) \\cdot \\dots \\cdot (343/365) \\approx 0{,}4927$, donc **$\\approx 50{,}7\\,\\%$**.\nApproximation : $\\mathbb{P}(\\text{aucune collision}) \\approx \\exp (-n(n-1)/(2 \\cdot 365)) = \\exp (-253/365) \\approx 0{,}50$ ; il y a 253 paires de personnes.",
   "en": "In a group of 23 people, what is the probability that at least two share a birthday (365 equally likely days)?",
   "indice": "Calcule plutôt la probabilité que tous les anniversaires soient différents.",
   "relances": [
    "Combien de personnes pour que l'un des autres ait le même anniversaire que TOI avec probabilité $> 1/2$ ? (253)",
    "Lien avec les collisions de hachage ? ($\\approx \\sqrt{N}$ valeurs suffisent pour une collision probable)"
   ],
   "categorie": "probas",
   "titre": "Le paradoxe des anniversaires",
   "reponse": "0.5073",
   "valeur": 0.5073,
   "tolerance": 0.003,
   "duree": 180,
   "essentiel": true
  },
  {
   "id": "proba-meme-anniversaire-que-moi",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Combien faut-il de personnes (en plus de toi) pour que la probabilité qu'au moins l'une ait le même anniversaire que toi dépasse $1/2$ ?",
   "solution": "On veut $1 - (364/365)^{n} \\ge 1/2$, soit $n \\ge \\ln 2 / \\ln (365/364) \\approx 0{,}693 \\times 364{,}5 \\approx 252{,}7$ : **253 personnes**.",
   "en": "How many other people are needed so that the probability that at least one of them shares your birthday exceeds $1/2$?",
   "relances": [
    "Pourquoi est-ce beaucoup plus que 23 ? (ici une seule date est visée ; avec 23 personnes il y a 253 paires qui peuvent coïncider)"
   ],
   "categorie": "probas",
   "titre": "Quelqu’un né le même jour que moi",
   "reponse": "253",
   "valeur": 253.0,
   "tolerance": 0.0,
   "duree": 180
  },
  {
   "id": "proba-de-avec-relance",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Tu lances un dé et tu reçois le montant affiché. Après le premier lancer, tu peux choisir de relancer une fois (et tu dois alors accepter le second résultat). Quelle est la valeur de ce jeu avec la meilleure stratégie ?",
   "solution": "On garde le premier lancer s'il dépasse 3,5, donc 4, 5 ou 6 (moyenne 5) ; sinon on relance (3,5).\nValeur : $\\tfrac12 \\times 5 + \\tfrac12 \\times 3{,}5 =$ **4,25**.",
   "en": "You roll a die and are paid the face value. After the first roll you may choose to re-roll once (and must then accept the second result). What is the value of the game under the optimal strategy?",
   "indice": "Le second lancer vaut 3,5 en moyenne. Quand vaut-il mieux garder le premier ?",
   "relances": [
    "Et avec deux relances possibles ? ($14/3 \\approx 4{,}67$ : on garde 5 ou 6 au premier lancer, puis 4 ou plus au deuxième)",
    "Combien paierais-tu pour jouer ? (au plus 4,25 si tu es neutre au risque)"
   ],
   "categorie": "strategie",
   "titre": "Un dé avec droit de relance",
   "reponse": "17/4",
   "valeur": 4.25,
   "tolerance": 0.005,
   "duree": 240,
   "voir": [
    "proba-de-deux-relances"
   ],
   "essentiel": true
  },
  {
   "id": "proba-de-deux-relances",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Tu lances un dé et tu reçois le montant affiché. Après chaque lancer, tu peux relancer, jusqu'à deux fois (trois lancers au plus) ; le dernier résultat obtenu est celui qui est payé. Valeur du jeu avec la meilleure stratégie ?",
   "solution": "Avec deux lancers restants le jeu vaut 4,25. Au premier lancer, on garde seulement 5 ou 6 (car $4 < 4{,}25$) : valeur $= (2/6) \\cdot 5{,}5 + (4/6) \\cdot 4{,}25 = 11/6 + 17/6 =$ **$14/3 \\approx 4{,}667$**.",
   "en": "You roll a die and are paid the face value. After each roll you may re-roll, up to two times (at most three rolls); the last result is paid. What is the game worth under optimal play?",
   "indice": "Récurrence à rebours : avec un lancer restant, la valeur est 3,5 ; avec deux lancers, 4,25.",
   "relances": [
    "Vers quoi tend la valeur avec $n$ relances ? (vers 6)"
   ],
   "reponse": "14/3",
   "valeur": 4.666666666666667,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-max-deux-des",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance deux dés et on reçoit le plus grand des deux résultats. Espérance du gain ?",
   "solution": "$\\mathbb{P}(\\max \\le k) = (k/6)^{2}$, donc $\\mathbb{P}(\\max = k) = (2k - 1)/36$.\n$E = \\sum k(2k - 1)/36 = (1 + 6 + 15 + 28 + 45 + 66)/36 =$ **$161/36 \\approx 4{,}47$**.",
   "en": "You roll two dice and receive the larger value. What is the expected payoff?",
   "relances": [
    "Et le minimum ? ($91/36 \\approx 2{,}53$ ; max + min = somme, d'espérance 7)"
   ],
   "reponse": "161/36",
   "valeur": 4.472222222222222,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-premier-as",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On retourne les cartes d'un jeu de 52 bien mélangé une par une. En moyenne, à quelle position apparaît le premier as ?",
   "solution": "Par symétrie, chacune des 48 autres cartes a la même probabilité $1/5$ d'être dans chacun des 5 intervalles. Avant le premier as : $48/5$ cartes en moyenne. Position du premier as : $48/5 + 1 =$ **$53/5 = 10{,}6$**.\nFormule générale : $(N + 1)/(k + 1)$ pour $k$ cartes spéciales parmi $N$.",
   "en": "Cards from a well-shuffled 52-card deck are turned over one by one. On average, at what position does the first ace appear?",
   "indice": "Les 4 as découpent les 48 autres cartes en 5 groupes. Combien de cartes dans chaque groupe en moyenne ?",
   "relances": [
    "Position moyenne du dernier as ? ($4 \\times 53/5 = 42{,}4$)"
   ],
   "categorie": "probas",
   "titre": "Position moyenne du premier as",
   "reponse": "53/5",
   "valeur": 10.6,
   "tolerance": 0.005,
   "duree": 240,
   "voir": [
    "proba-premiere-rouge"
   ]
  },
  {
   "id": "proba-ruine-equitable",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Tu as 3 €. À chaque tour tu gagnes ou perds 1 € avec probabilité $1/2$. Tu t'arrêtes à 0 € ou à 10 €. Probabilité d'atteindre 10 € ?",
   "solution": "Ta fortune est une martingale arrêtée et bornée : $\\mathbb{E}[\\text{fortune finale}] = 3 = 10 \\cdot p + 0 \\cdot (1 - p)$, donc **$p = 3/10$**.",
   "en": "You start with \\$3. Each round you win or lose \\$1 with probability $1/2$. You stop at \\$0 or \\$10. What is the probability of reaching \\$10?",
   "relances": [
    "Durée moyenne de la partie ? ($3 \\times 7 = 21$ tours : $k(N - k)$)",
    "Et si la pièce est biaisée ? ($p = (1 - (q/p)^k)/(1 - (q/p)^N)$)"
   ],
   "categorie": "probas",
   "titre": "La ruine du joueur",
   "reponse": "3/10",
   "valeur": 0.3,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "proba-duree-ruine",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Tu as 3 €. À chaque tour tu gagnes ou perds 1 € à pile ou face ; tu t'arrêtes à 0 € ou à 10 €. Combien de tours dure la partie en moyenne ?",
   "solution": "Avec $M_{n} = S_{n}^{2} - n$ et le théorème d'arrêt : $\\mathbb{E}[S_T^{2}] = 9 + \\mathbb{E}[T]$. Or $\\mathbb{E}[S_T^{2}] = 100 \\times 3/10 = 30$. Donc **$\\mathbb{E}[T] = 21$** $= k(N - k)$.",
   "en": "You start with \\$3 and win or lose \\$1 on each fair coin flip, stopping at \\$0 or \\$10. What is the expected number of rounds?",
   "indice": "$S_{n}^{2} - n$ est une martingale.",
   "relances": [
    "Et sans borne haute (on joue jusqu'à la ruine) ? (la ruine est certaine mais son temps moyen est infini)"
   ],
   "reponse": "21",
   "valeur": 21.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "proba-ruine-biaisee",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Tu as 2 €. À chaque tour tu gagnes 1 € avec probabilité 0,6 et en perds 1 avec probabilité 0,4. Tu t'arrêtes à 0 € ou à 4 €. Probabilité d'atteindre 4 € ?",
   "solution": "Avec $r = q/p = 2/3, P = (1 - r^{2})/(1 - r^{4}) = (5/9)/(65/81) =$ **$9/13 \\approx 0{,}692$**.\nVariante plus rapide : $P = 1/(1 + r^{2})$ quand la cible est le double du départ.",
   "en": "You have \\$2. Each round you win \\$1 with probability 0.6, lose \\$1 with probability 0.4. You stop at \\$0 or \\$4. Probability of reaching \\$4?",
   "indice": "$(q/p)^{S_n}$ est une martingale, avec $q/p = 2/3$.",
   "relances": [
    "Pourquoi $(q/p)^{S_n}$ est-elle une martingale ? ($\\mathbb{E}[r^{S+X}] = r^S(p \\cdot r + q/r) = r^S(q + p)$)"
   ],
   "reponse": "9/13",
   "valeur": 0.6923076923076923,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-polya",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Une urne contient une boule rouge et une bleue. On tire une boule, on la remet avec une boule de plus de la même couleur. Probabilité que les deux premiers tirages soient rouges ?",
   "solution": "$\\mathbb{P}(R \\text{ puis } R) = 1/2 \\times 2/3 =$ **$1/3$**.\nRésultat remarquable de l'urne de Pólya : le nombre de rouges après $n$ tirages est uniforme sur ${0, \\dots, n}$, et la proportion de rouges converge vers une loi uniforme sur [0, 1].",
   "en": "An urn has one red and one blue ball. Draw a ball, put it back along with another ball of the same color. Probability that the first two draws are both red?",
   "relances": [
    "La proportion de rouges est-elle une martingale ? (oui)"
   ],
   "categorie": "probas",
   "titre": "L’urne de Pólya",
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-correlation-trois",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois variables aléatoires ont deux à deux la même corrélation $\\rho$. Quelle est la plus petite valeur possible de $\\rho$ ?",
   "solution": "$\\operatorname{Var} (X + Y + Z) = 3 + 6\\rho \\ge 0$, donc $\\rho \\ge$ **$-1/2$**. La valeur est atteinte (par exemple $X + Y + Z = 0$).\nPour $n$ variables : $\\rho \\ge -1/(n - 1)$.",
   "en": "Three random variables have the same pairwise correlation $\\rho$. What is the smallest possible value of $\\rho$?",
   "indice": "La matrice de corrélation doit être semi-définie positive ; regarde la variance de $X + Y + Z$ (variables réduites).",
   "relances": [
    "Si $\\operatorname{corr} (X, Y) = 0{,}9$ et $\\operatorname{corr} (Y, Z) = 0{,}9$, quelles valeurs pour $\\operatorname{corr} (X, Z)$ ? (entre 0,62 et 1 : $\\rho_{1}\\rho_{2} \\pm \\sqrt{(1 - \\rho_{1}^{2})(1 - \\rho_{2}^{2})}$)",
    "Pourquoi cela compte-t-il en gestion des risques ? (une matrice de corrélation estimée ou « stressée » à la main peut ne pas être valide)"
   ],
   "categorie": "probas",
   "titre": "Trois corrélations égales : jusqu’où descendre ?",
   "reponse": "-1/2",
   "valeur": -0.5,
   "tolerance": 0.005,
   "duree": 240,
   "essentiel": true
  },
  {
   "id": "proba-correlation-xz",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "hf",
    "banque",
    "risque",
    "data"
   ],
   "type": "numerique",
   "question": "$\\operatorname{corr} (X, Y) = 0{,}9$ et $\\operatorname{corr} (Y, Z) = 0{,}9$. Quelle est la plus petite valeur possible de $\\operatorname{corr} (X, Z)$ ?",
   "solution": "$X = 0{,}9 \\cdot Y + \\sqrt{1 - 0{,}81} \\cdot U, Z = 0{,}9 \\cdot Y + \\sqrt{0{,}19} \\cdot V$ avec $U, V$ orthogonaux à $Y$. $\\operatorname{corr} (X, Z) = 0{,}81 + 0{,}19 \\cdot \\operatorname{corr} (U, V) \\ge 0{,}81 - 0{,}19 =$ **0,62**.\nCas général : $\\rho_{1}\\rho_{2} - \\sqrt{(1 - \\rho_{1}^{2})(1 - \\rho_{2}^{2})}$.",
   "en": "$\\operatorname{corr} (X, Y) = 0.9$ and $\\operatorname{corr} (Y, Z) = 0.9$. What is the smallest possible $\\operatorname{corr} (X, Z)$?",
   "indice": "Écris $X$ et $Z$ comme une part de $Y$ plus un bruit orthogonal à $Y$.",
   "relances": [
    "Et si les deux corrélations valent 0,5 ? (borne basse : $0{,}25 - 0{,}75 = -0{,}5$)"
   ],
   "reponse": "0.81-0.19",
   "valeur": 0.6200000000000001,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-quadrant-normal",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "hf",
    "banque",
    "mm"
   ],
   "type": "numerique",
   "question": "($X, Y$) est un vecteur gaussien centré réduit de corrélation 0,5. Que vaut $\\mathbb{P}(X > 0 \\text{ et } Y > 0)$ ?",
   "solution": "$P = 1/4 + \\arcsin(\\rho)/(2\\pi) = 1/4 + (\\pi /6)/(2\\pi) = 1/4 + 1/12 =$ **$1/3$**.\nVision géométrique : $X = \\langle Z, a \\rangle, Y = \\langle Z, b \\rangle$ avec $Z$ gaussien isotrope dans le plan et un angle $\\theta = \\arccos \\rho = 60°$ entre $a$ et $b$ ; la probabilité vaut $(\\pi - \\theta)/(2\\pi) = (180 - 60)/360$.",
   "en": "($X, Y$) is a standard bivariate normal with correlation 0.5. Compute $\\mathbb{P}(X > 0, Y > 0)$.",
   "indice": "Formule de Sheppard : $1/4 + \\arcsin(\\rho)/(2\\pi)$. Ou géométriquement : l'angle entre les deux demi-plans.",
   "relances": [
    "Cas $\\rho = 0$ ? ($1/4$) ; $\\rho = -1$ ? (0)"
   ],
   "categorie": "probas",
   "titre": "Deux gaussiennes corrélées toutes deux positives",
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-max-normales",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "hf",
    "mm",
    "banque"
   ],
   "type": "numerique",
   "question": "$X$ et $Y$ sont indépendantes de loi $N(0, 1)$. Que vaut $\\mathbb{E}[\\max (X, Y)]$ ?",
   "solution": "$\\mathbb{E}[\\max] = E|X - Y|/2$. Or $X - Y \\sim N(0, 2)$ et $E|N(0, \\sigma^{2})| = \\sigma \\sqrt{2/\\pi}$. Donc $\\mathbb{E}[\\max] = \\sqrt{2} \\cdot \\sqrt{2/\\pi}/2 =$ **$1/\\sqrt{\\pi} \\approx 0{,}564$**.",
   "en": "$X$ and $Y$ are independent standard normals. Compute $\\mathbb{E}[\\max (X, Y)]$.",
   "indice": "$\\max (X, Y) = (X + Y)/2 + |X - Y|/2$.",
   "relances": [
    "$\\mathbb{E}[|X|]$ pour $X \\sim N(0, 1)$ ? ($\\sqrt{2/\\pi} \\approx 0{,}798$)",
    "Ordre de grandeur du max de $n$ gaussiennes ? ($\\sqrt{2 \\ln n}$)"
   ],
   "reponse": "1/sqrt(pi)",
   "valeur": 0.5641895835477563,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-normale-positive",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "hf",
    "banque",
    "mm",
    "data"
   ],
   "type": "numerique",
   "question": "$X$ suit une loi $N(0, 1)$. Que vaut $\\mathbb{E}[X | X > 0]$ ?",
   "solution": "$\\mathbb{E}[X \\cdot 1{X>0}] = \\int_{0}^\\infty x \\varphi (x) dx = \\varphi (0) = 1/\\sqrt{2\\pi}$. On divise par $\\mathbb{P}(X > 0) = 1/2$ : **$\\sqrt{2/\\pi} \\approx 0{,}798$**.",
   "en": "$X$ is standard normal. What is $\\mathbb{E}[X | X > 0]$?",
   "relances": [
    "$\\mathbb{E}[X | X > a]$ ? ($\\varphi (a)/(1 - \\Phi (a))$, le ratio de Mills inverse)",
    "Lien avec l'expected shortfall ? (ES d'une gaussienne à $97{,}5\\,\\% = \\varphi (1{,}96)/0{,}025 \\approx 2{,}34 \\sigma$)"
   ],
   "reponse": "sqrt(2/pi)",
   "valeur": 0.7978845608028654,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-bertrand-boites",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Trois boîtes : l'une contient deux pièces d'or, une autre deux pièces d'argent, la dernière une d'or et une d'argent. Tu choisis une boîte au hasard et tires une pièce : elle est en or. Probabilité que l'autre pièce de la boîte soit aussi en or ?",
   "solution": "Il y a 3 pièces d'or équiprobables ; 2 d'entre elles sont dans la boîte or-or. Probabilité **$2/3$**.",
   "en": "Three boxes: gold-gold, silver-silver, gold-silver. You pick a box at random and draw a coin: it is gold. What is the probability that the other coin is also gold?",
   "piege": "« Il reste deux boîtes possibles, donc $1/2$ » : les deux boîtes n'ont pas la même probabilité de donner une pièce d'or.",
   "categorie": "probas",
   "titre": "Les boîtes de Bertrand",
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proba-pieces-un-de-plus",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "A lance 101 pièces équilibrées et B en lance 100. Probabilité que A obtienne strictement plus de « face » que B ?",
   "solution": "Symétrie : A a plus de faces que B ou plus de piles que B (A a 101 pièces : $\\text{faces}_A + \\text{piles}_A = 101 = (\\text{faces}_B + \\text{piles}_B) + 1$), exactement l'un des deux. Par symétrie pile/face, les deux événements ont la même probabilité : **$1/2$**.\nMême argument si Alice lance 10 pièces et Bob 11 : Bob a strictement plus de piles avec probabilité $1/2$.",
   "en": "A flips 101 fair coins, B flips 100. What is the probability that A gets strictly more heads than B?",
   "indice": "Compare d'abord les 100 premières pièces de A à celles de B. Que fait la dernière ? Ou : symétrie entre « face » et « pile ».",
   "categorie": "probas",
   "titre": "101 pièces contre 100 : qui fait plus de piles ?",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-attente-bus",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Des bus passent selon un processus de Poisson, en moyenne un toutes les 10 minutes. Tu arrives à l'arrêt à un instant quelconque. Combien de temps attends-tu en moyenne ?",
   "solution": "Absence de mémoire de la loi exponentielle : l'attente jusqu'au prochain bus est encore exponentielle de moyenne **10 minutes**.\nParadoxe de l'inspection : l'intervalle entre deux bus dans lequel tu tombes dure en moyenne 20 minutes, car tu as plus de chances de tomber dans un long intervalle.",
   "en": "Buses arrive as a Poisson process with on average one every 10 minutes. You arrive at a random time. What is your expected wait?",
   "relances": [
    "Et si les bus passent exactement toutes les 10 minutes ? (5 minutes)",
    "Durée moyenne de l'intervalle observé dans le cas Poisson ? (20 minutes)"
   ],
   "categorie": "probas",
   "titre": "Le paradoxe de l’attente du bus",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-ampoules",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Deux ampoules ont des durées de vie exponentielles indépendantes de moyenne 1 an. Combien de temps en moyenne avant que les deux soient grillées ?",
   "solution": "Le minimum de deux exponentielles de taux 1 est exponentiel de taux 2 : moyenne $1/2$. Ensuite, par absence de mémoire, la survivante dure encore 1 an en moyenne. Total **1,5 an**.",
   "en": "Two light bulbs have independent exponential lifetimes with mean 1 year. Expected time until both have failed?",
   "relances": [
    "Pour $n$ ampoules ? ($1 + 1/2 + \\dots + 1/n$)",
    "Probabilité que l'ampoule A grille avant B si leurs taux sont $\\lambda$ et $\\mu$ ? ($\\lambda /(\\lambda + \\mu)$)"
   ],
   "reponse": "3/2",
   "valeur": 1.5,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-premiere-rouge",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Une urne contient 3 boules rouges et 7 bleues. On tire sans remise. En moyenne, à quel tirage obtient-on la première rouge ?",
   "solution": "Les 3 rouges découpent les 7 bleues en 4 groupes de taille moyenne $7/4$. Position de la première rouge : $7/4 + 1 =$ **$11/4 = 2{,}75$**. Formule $(N + 1)/(r + 1)$.",
   "en": "An urn has 3 red and 7 blue balls. Drawing without replacement, what is the expected position of the first red ball?",
   "reponse": "11/4",
   "valeur": 2.75,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-meme-couleur",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On tire deux cartes d'un jeu de 52. Probabilité qu'elles soient de la même couleur (cœur, carreau, trèfle, pique) ?",
   "solution": "La première carte est quelconque ; il reste 12 cartes de sa couleur parmi 51 : **$12/51 = 4/17 \\approx 0{,}235$**.",
   "en": "Two cards are drawn from a 52-card deck. Probability they are of the same suit?",
   "reponse": "4/17",
   "valeur": 0.23529411764705882,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proba-poker-paire",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Probabilité qu'une main de 5 cartes contienne exactement une paire (et rien de mieux) ?",
   "solution": "$13 \\times \\binom{4{}{}2} \\times \\binom{12{}{}3} \\times 4^{3} = 13 \\times 6 \\times 220 \\times 64 = 1\\,098\\,240$ mains, sur $\\binom{52{}{}5} = 2\\,598\\,960$ : **$\\approx 42{,}3\\,\\%$**.",
   "en": "What is the probability that a 5-card poker hand contains exactly one pair?",
   "indice": "Choisis la valeur de la paire, ses deux couleurs, puis trois autres valeurs distinctes et leurs couleurs.",
   "piege": "Choisir les trois autres cartes une par une ($12 \\times 11 \\times 10$) compte chaque main $3! = 6$ fois.",
   "relances": [
    "Probabilité d'une double paire ? ($\\binom{13{}{}2} \\times 6^{2} \\times 44 / \\binom{52{}{}5} \\approx 4{,}75\\,\\%$)"
   ],
   "reponse": "13*comb(4,2)*comb(12,3)*4^3/comb(52,5)",
   "valeur": 0.4225690276110444,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-trois-des-croissants",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On lance trois dés. Probabilité que les résultats soient strictement croissants (premier < deuxième < troisième) ?",
   "solution": "Il faut trois valeurs distinctes ($\\binom{6{}{}3} = 20$ ensembles) dans le seul ordre croissant : $20/216 =$ **$5/54 \\approx 0{,}093$**.\nVérification : $\\mathbb{P}(\\text{trois valeurs distinctes}) = 120/216$, et un seul des 6 ordres est croissant.",
   "en": "Three dice are rolled. What is the probability that the results are strictly increasing?",
   "reponse": "5/54",
   "valeur": 0.09259259259259259,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-de-carre",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance un dé et tu reçois le carré du résultat. Espérance du gain ?",
   "solution": "$(1 + 4 + 9 + 16 + 25 + 36)/6 =$ **$91/6 \\approx 15{,}17$**.",
   "en": "You roll a die and receive the square of the result. Expected payoff?",
   "relances": [
    "Pourquoi est-ce plus que $3{,}5^{2} = 12{,}25$ ? ($\\mathbb{E}[X^{2}] = \\operatorname{Var} (X) + \\mathbb{E}[X]^{2}$, Var $= 35/12$ ; inégalité de Jensen)"
   ],
   "reponse": "91/6",
   "valeur": 15.166666666666666,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "proba-produit-deux-des",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance deux dés et tu reçois le produit des résultats. Espérance du gain ?",
   "solution": "Indépendance : $\\mathbb{E}[XY] = \\mathbb{E}[X]\\,\\mathbb{E}[Y] = 3{,}5^2 =$ **12,25**.",
   "en": "Two dice are rolled and you receive the product. Expected payoff?",
   "relances": [
    "Et le produit d'un dé par lui-même (un seul lancer, mis au carré) ? ($91/6$ : pas d'indépendance)"
   ],
   "reponse": "49/4",
   "valeur": 12.25,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proba-piece-truquee-bayes",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Parmi 10 pièces, une a deux faces « pile », les autres sont normales. Tu en prends une au hasard et la lances 5 fois : 5 piles. Probabilité d'avoir la pièce truquée ?",
   "solution": "Bayes : $(1/10 \\times 1) / (1/10 \\times 1 + 9/10 \\times 1/32) = 32/(32 + 9) =$ **$32/41 \\approx 0{,}78$**.\nEn cotes : a priori 1:9, rapport de vraisemblance 32:1, a posteriori 32:9.",
   "en": "One of 10 coins is double-headed, the others are fair. You pick one at random and flip it 5 times: 5 heads. Probability that you hold the double-headed coin?",
   "relances": [
    "Probabilité que le 6ᵉ lancer donne pile ? ($32/41 + 9/41 \\times 1/2 = 73/82 \\approx 0{,}89$)"
   ],
   "categorie": "probas",
   "titre": "Pièce à deux piles cachée parmi des pièces normales",
   "reponse": "32/41",
   "valeur": 0.7804878048780488,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "proba-premier-pile-pair",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance une pièce équilibrée jusqu'au premier pile. Probabilité que ce premier pile arrive à un lancer de rang pair ?",
   "solution": "$\\sum_{k \\ge 1} (1/2)^{2k} = (1/4)/(1 - 1/4) =$ **$1/3$**.\nPar conditionnement : $p = \\mathbb{P}(\\text{pair})$ ; le premier lancer est face avec probabilité $1/2$ et alors les rôles pair/impair s'inversent : $p = \\tfrac12 (1 - p)$, d'où $p = 1/3$.",
   "en": "Flip a fair coin until the first heads. What is the probability that it occurs on an even-numbered flip?",
   "categorie": "probas",
   "titre": "Le premier pile tombe-t-il à un rang pair ?",
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proba-deux-six-consecutifs",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Combien de lancers de dé faut-il en moyenne pour obtenir deux 6 consécutifs ?",
   "solution": "États : $E$ (départ), $E_{1}$ (un 6 vient de tomber).\n- $E = 1 + (1/6)E_{1} + (5/6)E$\n- $E_{1} = 1 + (1/6) \\cdot 0 + (5/6)E$\nDe la première : $E = 6 + E_{1}$ ; donc $E = 6 + 1 + (5/6)E$, soit **$E = 42$**.\nFormule générale pour une probabilité $p$ : $(1 + p)/p^{2}$ ; ici $7 \\times 6 = 42$.",
   "en": "Expected number of die rolls until you get two consecutive sixes?",
   "relances": [
    "Et un 6 suivi d'un 5 ? (36 : pas de chevauchement)"
   ],
   "reponse": "42",
   "valeur": 42.0,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-variance-uniforme",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Variance d'une loi uniforme sur [0, 1] ?",
   "solution": "$\\mathbb{E}[U^{2}] - \\mathbb{E}[U]^{2} = 1/3 - 1/4 =$ **$1/12$**. Sur [$a, b$] : $(b - a)^{2}/12$.",
   "en": "Variance of a uniform distribution on [0, 1]?",
   "relances": [
    "Variance d'un dé ? ($(6^{2} - 1)/12 = 35/12$)"
   ],
   "reponse": "1/12",
   "valeur": 0.08333333333333333,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proba-secretaire",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Tu vois défiler $n$ candidats dans un ordre aléatoire et tu dois accepter ou refuser chacun immédiatement, sans retour. Avec la meilleure stratégie, quelle probabilité de choisir le meilleur quand $n$ est grand ?",
   "solution": "Avec un seuil $r =$ xn, la probabilité de succès vaut $\\approx -x \\ln x$, maximale pour $x = 1/e$. Valeur : **$1/e \\approx 37\\,\\%$**. On observe donc environ 37 % des candidats avant de choisir.",
   "en": "Secretary problem: $n$ candidates arrive in random order; you must accept or reject each immediately. With the optimal strategy, what is the probability of picking the best one as $n$ grows?",
   "indice": "Stratégie : laisser passer les $r$ premiers, puis prendre le premier meilleur que tous ceux vus.",
   "relances": [
    "Lien avec le trading ? (vendre « au meilleur moment » : sans modèle de prix, on ne peut pas faire beaucoup mieux qu'une règle de seuil)"
   ],
   "categorie": "strategie",
   "titre": "Le problème du secrétaire (s’arrêter au bon moment)",
   "reponse": "exp(-1)",
   "valeur": 0.36787944117144233,
   "tolerance": 0.01,
   "duree": 420
  },
  {
   "id": "proba-esperance-somme-tirages-de",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Tu lances un dé jusqu'à obtenir un 6 et tu reçois la somme de tous les lancers, 6 compris. Espérance du gain ?",
   "solution": "Il y a en moyenne 5 lancers avant le 6 (6 lancers au total). Chacun, sachant qu'il n'est pas un 6, vaut 3 en moyenne (1 à 5). Gain : $5 \\times 3 + 6 =$ **21**.\nPlus rapide, identité de Wald : $\\mathbb{E}[\\text{somme}] = \\mathbb{E}[N] \\cdot \\mathbb{E}[X] = 6 \\times 3{,}5 = 21$, valable car $N$ est un temps d'arrêt.",
   "en": "Roll a die until you get a 6; you are paid the sum of all rolls, including the 6. Expected payoff?",
   "indice": "Combien de lancers « non-6 » en moyenne, et que vaut chacun en moyenne ?",
   "piege": "Conditionner à tort : les lancers avant le 6 ne valent pas 3,5 en moyenne mais 3, puisqu'on sait qu'ils ne sont pas des 6. Les deux raisonnements donnent bien 21, à condition de ne pas mélanger les deux.",
   "relances": [
    "Et si tu ne reçois que la somme des lancers avant le 6 (sans le 6) ? (15)"
   ],
   "categorie": "probas",
   "titre": "Somme des lancers jusqu’au premier 6",
   "reponse": "21",
   "valeur": 21.0,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "proba-faces-distinctes",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance un dé 6 fois. Combien de faces différentes voit-on en moyenne ?",
   "solution": "Chaque face apparaît au moins une fois avec probabilité $1 - (5/6)^{6}$. Par linéarité : $6(1 - (5/6)^{6}) \\approx$ **3,99**.",
   "en": "You roll a die 6 times. What is the expected number of distinct faces seen?",
   "indice": "Linéarité de l'espérance : somme d'indicatrices « la face $k$ est apparue ».",
   "relances": [
    "Et en $n$ lancers d'un dé à $n$ faces, quand $n$ est grand ? ($n(1 - 1/e) \\approx 0{,}63 n$)"
   ],
   "reponse": "6*(1-(5/6)^6)",
   "valeur": 3.9906121399176953,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-max-trois-des",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance trois dés. Espérance du plus grand résultat ?",
   "solution": "$\\mathbb{P}(\\max \\le k) = (k/6)^{3}$, donc $\\mathbb{E}[\\max] = \\sum_{k=1}^{6} \\mathbb{P}(\\max \\ge k) = \\sum (1 - ((k-1)/6)^{3}) = 6 - (0 + 1 + 8 + 27 + 64 + 125)/216 = 6 - 225/216 =$ **$1\\,071/216 \\approx 4{,}96$**.",
   "en": "Three dice are rolled. What is the expected maximum?",
   "relances": [
    "Méthode générale : $\\mathbb{E}[X] = \\sum \\mathbb{P}(X \\ge k)$ pour une variable entière positive."
   ],
   "reponse": "1071/216",
   "valeur": 4.958333333333333,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-premier-plus-grand",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés. Probabilité que le premier soit strictement plus grand que le second ?",
   "solution": "Égalité avec probabilité $6/36 = 1/6$ ; par symétrie, le reste se partage également : $(1 - 1/6)/2 =$ **$5/12$**.",
   "en": "Two dice are rolled. Probability that the first is strictly larger than the second?",
   "reponse": "5/12",
   "valeur": 0.4166666666666667,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proba-de-mere-un",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Probabilité d'obtenir au moins un 6 en lançant un dé 4 fois ?",
   "solution": "$1 - (5/6)^{4} \\approx$ **0,518**. Le chevalier de Méré gagnait de l'argent en pariant dessus ; il en perdait avec le pari suivant (un double six en 24 lancers de deux dés : $1 - (35/36)^{24} \\approx 0{,}491$).",
   "en": "Probability of at least one 6 in 4 rolls of a die?",
   "piege": "Additionner : $4 \\times 1/6 = 2/3$. Les événements ne sont pas disjoints.",
   "categorie": "probas",
   "titre": "Les paris du chevalier de Méré",
   "reponse": "1-(5/6)^4",
   "valeur": 0.5177469135802468,
   "tolerance": 0.005,
   "duree": 60,
   "essentiel": true
  },
  {
   "id": "proba-esperance-sachant-somme",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance deux dés et la somme vaut 10. Quelle est l'espérance du premier dé ?",
   "solution": "Par symétrie, $\\mathbb{E}[X_{1} | X_{1} + X_{2} = 10] = \\mathbb{E}[X_{2} | \\dots]$ et leur somme vaut 10 : **5**. (Vérification : cas (4,6), (5,5), (6,4).)",
   "en": "Two dice sum to 10. What is the expected value of the first die?",
   "reponse": "5",
   "valeur": 5.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proba-variance-binomiale",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Variance du nombre de « pile » en 100 lancers d'une pièce équilibrée ?",
   "solution": "$np(1 - p) = 100 \\times 1/4 =$ **25** ; écart-type 5. Donc environ 95 % de chances d'être entre 40 et 60.",
   "en": "Variance of the number of heads in 100 fair coin flips?",
   "reponse": "25",
   "valeur": 25.0,
   "tolerance": 0.005,
   "duree": 45
  },
  {
   "id": "proba-quinte-couleur",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Probabilité qu'une main de 5 cartes soit entièrement d'une même couleur (quintes flush comprises) ?",
   "solution": "$4 \\times \\binom{13}{5} = 5\\,148$ mains, sur $\\binom{52}{5} = 2\\,598\\,960$ : **$\\approx 0{,}198\\,\\%$** (environ 1 sur 505).\nAutre calcul : $1 \\times 12/51 \\times 11/50 \\times 10/49 \\times 9/48$.",
   "en": "Probability that a 5-card hand is all of one suit (straight flushes included)?",
   "reponse": "4*comb(13,5)/comb(52,5)",
   "valeur": 0.0019807923169267707,
   "tolerance": 0.01,
   "duree": 150
  },
  {
   "id": "proba-derniere-boule",
   "theme": "probas",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Une urne contient 3 boules rouges et 2 bleues. On les tire toutes, sans remise. Probabilité que la dernière soit rouge ?",
   "solution": "Par symétrie, la dernière boule est une boule quelconque de l'urne : **$3/5$**. Aucun calcul de chemins n'est nécessaire.",
   "en": "An urn has 3 red and 2 blue balls, all drawn without replacement. Probability that the last one is red?",
   "categorie": "probas",
   "titre": "La couleur de la dernière boule tirée",
   "reponse": "3/5",
   "valeur": 0.6,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proba-deux-identiques",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "On lance une pièce jusqu'à obtenir deux résultats consécutifs identiques (PP ou FF). Combien de lancers en moyenne ?",
   "solution": "Après le premier lancer, chaque lancer reproduit le précédent avec probabilité $1/2$ : attente géométrique de moyenne 2. Total **3**.",
   "en": "Flip a coin until two consecutive results are the same (HH or TT). Expected number of flips?",
   "categorie": "probas",
   "titre": "Lancer jusqu’à deux résultats identiques consécutifs",
   "reponse": "3",
   "valeur": 3.0,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "proba-somme-exponentielles",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "$X$ et $Y$ sont indépendantes de loi exponentielle de paramètre 1. Que vaut $\\mathbb{P}(X + Y \\le 1)$ ?",
   "solution": "$X + Y$ suit une loi Gamma(2, 1) de densité $t e^{-t}$. $P = \\int_{0}^{1} t e^{-t} dt = 1 - 2/e \\approx$ **0,264**.\nAutre lecture : c'est la probabilité qu'un processus de Poisson de taux 1 ait au moins 2 événements avant 1 : $1 - e^{-1} - e^{-1}$.",
   "en": "$X$ and $Y$ are independent Exp(1). Compute $\\mathbb{P}(X + Y \\le 1)$.",
   "reponse": "1-2*exp(-1)",
   "valeur": 0.26424111765711533,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-exponentielle-sachant-somme",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "$X$ et $Y$ sont indépendantes, de même loi exponentielle. On sait que $X + Y = 2$. Espérance de $X$ ?",
   "solution": "Par symétrie, $\\mathbb{E}[X | X + Y = 2] = \\mathbb{E}[Y | \\dots]$ et leur somme vaut 2 : **1**. Plus fort : sachant $X + Y = s, X$ est uniforme sur [$0, s$].",
   "en": "$X$ and $Y$ are i.i.d. exponential. Given $X + Y = 2$, what is $\\mathbb{E}[X]$?",
   "reponse": "1",
   "valeur": 1.0,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "proba-somme-normales-positive",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "$X$ et $Y$ sont indépendantes de loi $N(0, 1)$. Sachant $X > 0$, probabilité que $X + Y > 0$ ?",
   "solution": "$\\operatorname{corr} (X, X + Y) = 1/\\sqrt{2}$, donc $\\mathbb{P}(X > 0, X + Y > 0) = 1/4 + \\arcsin(1/\\sqrt{2})/(2\\pi) = 1/4 + 1/8 = 3/8$. On divise par $\\mathbb{P}(X > 0) = 1/2$ : **$3/4$**.\nGéométrie : dans le plan ($X, Y$), l'événement est un secteur d'angle 135° parmi les 180° du demi-plan $X > 0$.",
   "en": "$X$ and $Y$ are independent standard normals. Given $X > 0$, what is the probability that $X + Y > 0$?",
   "indice": "Corrélation entre $X$ et $X + Y$, puis formule des quadrants : $\\mathbb{P}(A > 0, B > 0) = 1/4 + \\arcsin(\\rho)/(2\\pi)$.",
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "proba-coupons-moitie",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Il y a 10 vignettes différentes, chaque achat en donne une au hasard. Combien d'achats en moyenne pour en avoir 5 différentes ?",
   "solution": "Avec $k$ vignettes déjà possédées, la suivante est nouvelle avec probabilité $(10 - k)/10$ : attente $10/(10 - k)$. Pour $k = 0$ à 4 : $10(1/10 + 1/9 + 1/8 + 1/7 + 1/6) \\approx$ **6,46**, contre 29,3 pour la collection complète : ce sont les dernières vignettes qui coûtent cher.",
   "en": "There are 10 distinct coupons, each purchase gives one uniformly at random. Expected number of purchases to get 5 distinct ones?",
   "reponse": "10*(1/10+1/9+1/8+1/7+1/6)",
   "valeur": 6.4563492063492065,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proba-variance-geometrique",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Variance du nombre de lancers de dé nécessaires pour obtenir le premier 6 ?",
   "solution": "Loi géométrique : $(1 - p)/p^{2} = (5/6)/(1/36) =$ **30** ; écart-type $\\approx 5{,}5$, presque égal à la moyenne (6). Le temps d'attente est très dispersé.",
   "en": "Variance of the number of die rolls needed to get the first 6?",
   "reponse": "30",
   "valeur": 30.0,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "proba-markov-meteo",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "S'il fait beau aujourd'hui, il fera beau demain avec probabilité 0,8 ; s'il pleut, il fera beau demain avec probabilité 0,4. Sur le long terme, quelle proportion des jours est ensoleillée ?",
   "solution": "Loi stationnaire $\\pi$ : $\\pi = 0{,}8\\pi + 0{,}4(1 - \\pi)$, donc $0{,}6\\pi = 0{,}4$ et **$\\pi = 2/3$**.\nFormule pour deux états : $\\pi(\\text{beau}) = \\mathbb{P}(\\text{pluie} \\to \\text{beau}) / (\\mathbb{P}(\\text{beau} \\to \\text{pluie}) + \\mathbb{P}(\\text{pluie} \\to \\text{beau})) = 0{,}4/(0{,}2 + 0{,}4)$.",
   "en": "If it is sunny today, it is sunny tomorrow with probability 0.8; if it rains, sunny tomorrow with probability 0.4. Long-run fraction of sunny days?",
   "relances": [
    "Lien avec les modèles à changement de régime en finance ? (régimes calme / agité avec probabilités de transition)"
   ],
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "proba-records",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On observe 10 valeurs indépendantes de même loi continue, dans l'ordre. Une valeur est un « record » si elle dépasse toutes les précédentes (la première en est un). Nombre moyen de records ?",
   "solution": "La k-ième valeur est un record si elle est la plus grande des $k$ premières : probabilité $1/k$ par symétrie. Espérance : $1 + 1/2 + \\dots + 1/10 \\approx$ **2,93**, qui croît comme $\\ln n$ : les records deviennent rares.",
   "en": "You observe 10 i.i.d. continuous values in order. A value is a record if it exceeds all previous ones (the first is one). Expected number of records?",
   "relances": [
    "Lien avec la finance ? (nombre de nouveaux plus hauts historiques d'une série sans tendance)"
   ],
   "categorie": "probas",
   "titre": "Nombre de records dans une suite aléatoire",
   "reponse": "1+1/2+1/3+1/4+1/5+1/6+1/7+1/8+1/9+1/10",
   "valeur": 2.9289682539682538,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "proba-boites-vides",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "On lance 10 balles au hasard dans 10 boîtes. Nombre moyen de boîtes vides ?",
   "solution": "Une boîte reste vide avec probabilité $(9/10)^{10} \\approx 0{,}349$. Par linéarité : $10 \\times 0{,}9^{10} \\approx$ **3,49**. Pour $n$ balles dans $n$ boîtes, environ $n/e$ boîtes vides.",
   "en": "10 balls are thrown at random into 10 boxes. Expected number of empty boxes?",
   "categorie": "probas",
   "titre": "Boîtes vides et faces distinctes",
   "reponse": "10*0.9^10",
   "valeur": 3.486784401000001,
   "tolerance": 0.005,
   "duree": 120,
   "voir": [
    "proba-faces-distinctes"
   ]
  },
  {
   "id": "proba-premiers-entre-eux",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "On tire deux grands entiers au hasard. Probabilité qu'ils soient premiers entre eux (valeur limite) ?",
   "solution": "Pour chaque nombre premier $p$, les deux entiers ne sont pas tous deux divisibles par $p$ avec probabilité $1 - 1/p^{2}$. En supposant ces événements indépendants : $\\Pi (1 - 1/p^{2}) = 1/\\zeta (2) =$ **$6/\\pi^{2} \\approx 0{,}608$**.\nLe lien $\\Pi (1 - p^{-s})^{-1} = \\zeta (s)$ vient du produit eulérien.",
   "en": "Pick two large random integers. What is the (limiting) probability that they are coprime?",
   "categorie": "nombres",
   "titre": "Deux entiers au hasard premiers entre eux",
   "reponse": "6/pi^2",
   "valeur": 0.6079271018540267,
   "tolerance": 0.005,
   "duree": 300
  },
  {
   "id": "proba-produit-max-min",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "$U$ et $V$ sont indépendantes et uniformes sur [0, 1]. Que vaut $\\mathbb{E}[\\max (U, V) \\times \\min (U, V)]$ ?",
   "solution": "$\\max \\times \\min = U \\times V$, toujours. Donc $E = \\mathbb{E}[U]\\mathbb{E}[V] =$ **$1/4$**. Piège classique : ne pas calculer les lois du max et du min séparément.",
   "en": "$U, V$ independent uniform on [0, 1]. Compute $\\mathbb{E}[\\max (U, V) \\cdot \\min (U, V)]$.",
   "piege": "Répondre $\\mathbb{E}[\\max] \\times \\mathbb{E}[\\min] = 2/3 \\times 1/3 = 2/9$ : max et min ne sont pas indépendants.",
   "reponse": "1/4",
   "valeur": 0.25,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proj-ia-et-synthetique",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "banque",
    "mm",
    "risque",
    "data"
   ],
   "type": "ouverte",
   "question": "« Tes projets tournent sur des données synthétiques et ont été écrits avec une IA. Qu'est-ce qu'ils prouvent, alors ? »",
   "solution": "Réponse franche et courte, puis du concret :\n- **Synthétique, par choix** : on connaît la vérité, donc on peut mesurer l'erreur (RMSE de la surface contre la vraie surface Heston), tester des cas limites, et vérifier qu'une stratégie ne gagne pas quand l'effet n'existe pas (contrôle négatif du stat arb : Sharpe $-0{,}19$). Les résultats valident le code et la méthode, pas une performance de marché, et c'est écrit dans chaque README.\n- **IA** : oui, pour une partie du code. Ce que tu as fait toi : lancer, relire, changer les paramètres, comprendre chaque choix et chaque limite (à dire seulement si c'est vrai : idéalement, les exercices d'extension : « pour que ce soit vraiment le tien »).\n- **Preuve immédiate** : propose d'expliquer n'importe quelle partie, ou un échec et son diagnostic (le minimum local de SVI, le Sharpe nul du premier réglage, le bug de compteur du market making).",
   "en": "\"Your projects run on synthetic data and were written with AI help. So what do they prove?\"",
   "piege": "Survendre (« ma stratégie a un Sharpe de 2,9 ») ou se justifier longuement : les deux font mauvaise impression.",
   "essentiel": true
  },
  {
   "id": "proj-vs-pitch",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Présente ton projet de surface de volatilité en deux minutes.",
   "solution": "Trame possible (à dire avec tes mots) :\n1. **Problème** : construire une surface de volatilité implicite lisse et sans arbitrage à partir de cotations bruitées, et savoir mesurer si elle est juste.\n2. **Données** : un marché synthétique généré par un modèle de Heston (prix semi-analytique par fonction caractéristique), bruité de 0,2 point de vol : 6 maturités de 0,1 à 2 ans $\\times 21$ strikes. On connaît la vraie surface.\n3. **Méthode** : une tranche SVI « raw » par maturité, calibrée par moindres carrés avec plusieurs points de départ et une pénalité d'arbitrage papillon ; contrôles papillon ($g(k) \\ge 0$, Gatheral-Jacquier) et calendaire (variance totale croissante en $T$) ; interpolation linéaire de la variance totale entre maturités.\n4. **Résultats** : RMSE de 0,07 point de vol contre la vraie surface (moins que le bruit injecté) ; pas d'arbitrage sur le domaine coté.\n5. **Ce que j'ai appris** : un premier ajustement sans pénalité tombait dans un minimum local qui collait aux données mais impliquait une densité négative ; et deux tranches calibrées séparément peuvent se croiser loin dans l'aile.\n6. **Limites et suite** : données réelles (bid/ask, pondération par vega, forward implicite), calibration jointe type SSVI.",
   "en": "Walk me through your volatility surface project in two minutes.",
   "essentiel": true
  },
  {
   "id": "proj-vs-variance-totale",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Pourquoi paramétrer la surface en variance totale $w = \\sigma^{2}T$ et en log-moneyness $k = \\ln (K/F)$ ?",
   "solution": "- **Log-moneyness par rapport au forward** : elle enlève l'effet du portage (taux, dividendes) et rend les tranches comparables entre maturités ; à $k = 0$ on est à la monnaie forward.\n- **Variance totale** : c'est la quantité qui entre directement dans Black-Scholes ($\\sigma \\sqrt{T}$), elle s'additionne dans le temps, et l'absence d'arbitrage calendaire s'écrit simplement : $w(k, T)$ croissante en $T$ à $k$ fixé. Interpoler linéairement $w$ en $T$ préserve cette croissance si les tranches la respectent.",
   "en": "Why parametrize the surface in total variance $w = \\sigma^{2}T$ and log-moneyness $k = \\ln (K/F)$?",
   "relances": [
    "Pourquoi pas interpoler la volatilité directement ? (une interpolation linéaire en $\\sigma$ peut créer de l'arbitrage calendaire)"
   ]
  },
  {
   "id": "proj-vs-svi",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Écris la paramétrisation SVI « raw » et donne le rôle de chaque paramètre.",
   "solution": "$w(k) = a + b [\\rho (k - m) + \\sqrt{(k - m)^{2} + \\sigma^{2}}]$.\n- **a** : niveau général de variance ;\n- **$b$** : pente des ailes ($b \\ge 0$) ;\n- **$\\rho$** ∈ ($-1$, 1) : asymétrie, le skew ($\\rho < 0$ pour les actions) ;\n- **$m$** : translation horizontale du smile ;\n- **$\\sigma$** $> 0$ : courbure au centre (arrondi du minimum).\nAiles asymptotiquement linéaires de pentes $b(1 + \\rho)$ à droite et $b(1 - \\rho)$ à gauche, ce qui est cohérent avec la formule des moments de Lee (pente $\\le 2$ en variance totale).\nAvantages : peu de paramètres interprétables, ailes cohérentes avec la théorie, conditions d'arbitrage explicites.",
   "en": "Write the raw SVI parametrization and the role of each parameter."
  },
  {
   "id": "proj-vs-ailes",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Dans une tranche SVI avec $b = 0{,}1$ et $\\rho = -0{,}6$, quelle est la pente asymptotique de l'aile gauche ($k \\to - \\infty$) de la variance totale ? Respecte-t-elle la borne de Lee ?",
   "solution": "Pente gauche $= b(1 - \\rho) = 0{,}1 \\times 1{,}6 =$ **0,16** ; pente droite $b(1 + \\rho) = 0{,}04$. Bien en dessous de la borne de Lee (2) : aucun problème de moments.",
   "en": "In an SVI slice with $b = 0.1$ and $\\rho = -0.6$, what is the asymptotic left-wing slope of total variance? Does it satisfy Lee's bound?",
   "reponse": "0.1*(1+0.6)",
   "valeur": 0.16000000000000003,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "proj-vs-papillon",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que l'arbitrage papillon, et comment le contrôles-tu dans ton projet ?",
   "solution": "Un butterfly (long $C(K - h)$, short $2 C(K)$, long $C(K + h)$) a un payoff positif ; son prix doit l'être aussi : le prix du call doit être convexe en $K$. Par Breeden-Litzenberger, $\\partial^{2}C/ \\partial K^{2}$ est la densité risque-neutre : une concavité, c'est une densité négative.\nEn variance totale, Gatheral et Jacquier traduisent cette condition par **$g(k) \\ge 0$**, avec\n$g(k) = (1 - k w'/(2w))^{2} - (w'^{2}/4)(1/w + 1/4) + w''/2$.\nDans le projet : contrôle a posteriori de $g$ sur $|k| \\le 1{,}5$ pour chaque tranche, et pénalité dans la fonction d'ajustement. Toutes les tranches finales vérifient $g \\ge 0$.",
   "en": "What is butterfly arbitrage and how do you check for it in your project?",
   "relances": [
    "Que garantit ce contrôle hors de la grille testée ? (rien en toute rigueur : il faudrait des conditions suffisantes sur les paramètres, comme en SSVI)"
   ]
  },
  {
   "id": "proj-vs-calendaire",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que l'arbitrage calendaire, et quelle limite as-tu constatée ?",
   "solution": "À strike forward fixé ($k$ fixé), la variance totale doit croître avec la maturité : sinon un calendar spread (vendre court, acheter long) aurait un prix négatif pour un payoff positif (sans dividendes ni taux, ou en termes de forward).\nDans le projet : 0 violation sur le domaine coté ($k$ de $-0{,}5$ à 0,4), mais en extrapolant loin dans l'aile ($k \\approx 0{,}8$), les tranches $T = 1$ et $T = 1{,}5$, calibrées indépendamment, se croisent. Leçon : calibrer tranche par tranche ne garantit rien entre tranches ; il faut une contrainte jointe ou une paramétrisation de surface (SSVI).",
   "en": "What is calendar arbitrage, and what limitation did you observe?"
  },
  {
   "id": "proj-vs-minimum-local",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Pourquoi lances-tu l'optimisation SVI depuis plusieurs points de départ ? Raconte ce qui s'est passé.",
   "solution": "La fonction d'erreur de SVI n'est pas convexe : un optimiseur local s'arrête dans le minimum le plus proche du point de départ. Dans le projet, un premier essai sans pénalité de papillon a trouvé pour $T = 1$ un minimum local ($\\rho = 0{,}92, m = 0{,}63$) qui ajustait bien les cotations mais impliquait une densité négative ($g$ min $= -2{,}17$).\nCorrections : plusieurs points de départ, pénalité sur $g < 0$ dans l'objectif, et $m$ borné près des données.\nMessage pour l'intervieweur : un bon ajustement aux données ne suffit pas, il faut vérifier la cohérence financière (ici, l'absence d'arbitrage).",
   "en": "Why do you run the SVI fit from several starting points? Tell me what happened."
  },
  {
   "id": "proj-vs-otm",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi utilises-tu les options hors de la monnaie pour construire la surface ?",
   "solution": "Une option très dans la monnaie vaut presque sa valeur intrinsèque ; sa valeur temps est minuscule, donc la volatilité implicite qu'on en tire est très sensible au moindre bruit de prix (vega faible). Les options hors de la monnaie (puts sous le forward, calls au-dessus) portent toute l'information de volatilité. Par la parité, call et put de même strike ont la même volatilité implicite : on ne perd rien.\nEn pratique : elles sont aussi plus liquides.",
   "en": "Why do you use out-of-the-money options to build the surface?"
  },
  {
   "id": "proj-vs-rmse",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Ton erreur de calibration est de 0,07 point de vol. C'est bien ?",
   "solution": "Ça valide le code, pas une performance de marché :\n- elle est mesurée contre une **vérité connue** (la surface Heston), ce qui est impossible sur de vraies cotations ;\n- elle est **inférieure au bruit injecté** (0,2 point) : le modèle lisse le bruit au lieu de l'apprendre, signe qu'il ne sur-ajuste pas ;\n- erreur maximale 0,19 point.\nSur de vraies données, on mesurerait plutôt l'erreur contre les cotations, relativement au spread bid-ask (une erreur à l'intérieur du spread est acceptable), et la stabilité des paramètres d'un jour à l'autre.",
   "en": "Your calibration error is 0.07 vol points. Is that good?"
  },
  {
   "id": "proj-vs-heston",
   "theme": "projets",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment calcules-tu les prix Heston dans ton projet ? Qu'est-ce que le « little Heston trap » ?",
   "solution": "Prix semi-analytique : la fonction caractéristique du log-prix est connue en forme fermée ; on obtient les probabilités $P_{1}$ et $P_{2}$ de la formule $C = S P_{1} - K e^{-rT} P_{2}$ par inversion de Gil-Pelaez, c'est-à-dire une intégrale numérique (`scipy.integrate.quad`) de $\\operatorname{Re}\\left[e^{-iu \\ln K} \\varphi(u)/(iu)\\right]$.\n« Little Heston trap » (Albrecher et al.) : la formule d'origine contient un logarithme complexe qui peut sauter de branche quand $u$ ou $T$ grandissent, ce qui produit des prix faux. Une écriture équivalente des termes évite ces discontinuités.\nPuis on inverse Black-Scholes (méthode de Brent) pour obtenir la volatilité implicite « vraie ».",
   "en": "How do you compute Heston prices in your project? What is the \"little Heston trap\"?",
   "relances": [
    "Alternative plus rapide pour beaucoup de strikes ? (Carr-Madan par FFT, ou méthode COS)"
   ]
  },
  {
   "id": "proj-vs-donnees-reelles",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Que changerais-tu pour calibrer ta surface sur de vraies cotations ?",
   "solution": "- Utiliser bid et ask, pondérer les erreurs par vega ou par l'inverse du spread ; accepter une erreur à l'intérieur du spread.\n- Déduire le **forward implicite** de la parité call-put (plutôt que de supposer taux et dividendes), et traiter les dividendes discrets.\n- Filtrer les cotations périmées ou aberrantes, les options trop peu liquides, et les options américaines (dé-américaniser si besoin).\n- Calibrer une surface jointe sans arbitrage (SSVI ou contraintes entre tranches) et surveiller la stabilité des paramètres dans le temps.",
   "en": "What would you change to calibrate your surface on real quotes?"
  },
  {
   "id": "proj-sa-pitch",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Présente ton projet d'arbitrage statistique en deux minutes.",
   "solution": "Trame possible :\n1. **Problème** : trouver des paires d'actifs dont l'écart revient à la moyenne, et trader cet écart sans se mentir sur la performance.\n2. **Données** : un marché synthétique de 18 actifs (6 paires réellement cointégrées, spread Ornstein-Uhlenbeck de demi-vie 8 jours, 6 actifs isolés, un facteur commun) : la vérité est connue.\n3. **Méthode** : sélection par Engle-Granger écrit à la main (OLS puis ADF, seuil 1 %, valeur critique de MacKinnon), filtre de demi-vie ; signal z-score (entrée à 2, sortie à 0,5, stop à 4) ; backtest walk-forward (504 jours de formation, 63 de trading, paramètres figés) ; coûts de 5 points de base.\n4. **Validation** : Sharpe 2,87 avec un intervalle bootstrap par blocs de 1,99 à 3,82 ; contrôle négatif (mêmes règles sans cointégration) à $-0{,}19$ ; Sharpe déflaté.\n5. **Ce que j'ai appris** : le premier réglage donnait un Sharpe nul : test trop peu puissant et 1 540 paires testées, donc des faux positifs. J'ai changé le réglage après avoir vu ce résultat, ce que le Sharpe déflaté prend en compte.\n6. **Limites** : spread parfaitement OU, $\\beta$ fixe, pas de rupture de régime ni de coûts d'emprunt.",
   "en": "Walk me through your statistical arbitrage project in two minutes.",
   "piege": "Présenter le Sharpe de 2,87 comme une performance : il prouve que le pipeline fonctionne quand l'effet existe, rien de plus.",
   "essentiel": true
  },
  {
   "id": "proj-sa-coint-corr",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Quelle différence entre corrélation et cointégration ? Pourquoi ton projet utilise-t-il la cointégration ?",
   "solution": "- **Corrélation** : les rendements bougent ensemble à court terme. Deux prix très corrélés peuvent s'éloigner indéfiniment.\n- **Cointégration** : deux prix non stationnaires ont une combinaison linéaire stationnaire (le spread $y - \\beta x$ revient à sa moyenne).\nPour du pairs trading, c'est le retour du spread à sa moyenne qui fait gagner : la cointégration est la bonne propriété. Exemple : deux marches aléatoires indépendantes peuvent avoir des rendements corrélés par hasard sur une période ; un ivrogne et son chien en laisse (cointégrés) peuvent avoir des pas peu corrélés.",
   "en": "What is the difference between correlation and cointegration? Why does your project use cointegration?"
  },
  {
   "id": "proj-sa-engle-granger",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Décris la procédure d'Engle-Granger telle que tu l'as codée.",
   "solution": "1. Régression OLS des log-prix : $\\ln y = \\alpha + \\beta \\ln x + \\varepsilon$.\n2. Test de Dickey-Fuller sur les résidus : $\\Delta \\varepsilon_t = \\gamma \\varepsilon_{t-1} + u_t$ ; $H_{0}$ : $\\gamma = 0$ (pas de cointégration).\n3. Comparer la t-stat de $\\gamma$ aux valeurs critiques de **MacKinnon** ($-3{,}90$ à 1 % pour deux séries), plus sévères que celles d'un ADF classique car les résidus ont été estimés pour avoir l'air stationnaires.\n4. Filtres supplémentaires : demi-vie ($-\\ln 2/\\ln (1 + \\gamma)$) inférieure à 40 jours, $\\beta > 0$ ; on garde les 5 meilleures paires.\nLimites : ADF sans retard, valeurs critiques asymptotiques, résultat dépendant de la variable choisie comme expliquée (Johansen est symétrique).",
   "en": "Describe the Engle-Granger procedure as you implemented it."
  },
  {
   "id": "proj-sa-faux-positifs",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Ton premier réglage testait 1 540 paires au seuil de 5 %. Combien de paires « cointégrées » par pur hasard attend-on s'il n'y en avait aucune ?",
   "solution": "$1\\,540 \\times 0{,}05 =$ **77** faux positifs (si les tests étaient indépendants). Dans le projet, des paires de marches aléatoires passaient le test avec une statistique d'environ $-5$, et aucune vraie paire n'était retenue. D'où la réduction de l'univers et le seuil à 1 %.",
   "en": "Your first setup tested 1,540 pairs at the 5% level. How many spurious \"cointegrated\" pairs do you expect if none were real?",
   "reponse": "1540*0.05",
   "valeur": 77.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "proj-sa-walk-forward",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un backtest walk-forward, et comment t'es-tu assuré de ne pas regarder le futur ?",
   "solution": "On estime tout (choix des paires, $\\beta$, moyenne et écart-type du spread) sur une fenêtre passée (504 jours), puis on trade la fenêtre suivante (63 jours) avec ces paramètres **figés** ; on avance et on recommence. Le résultat hors échantillon est la concaténation des fenêtres de trading.\nGarde-fous : le signal à la clôture de $t - 1$ décide de la position qui touche le rendement de $t$ ; un test unitaire dédié (`test_pas_de_regard_vers_le_futur`) vérifie qu'on ne peut pas utiliser une donnée future. Ce test a été ajouté après la correction d'un vrai bug de décalage d'un jour entre signal et rendement.",
   "en": "What is a walk-forward backtest, and how did you make sure you did not look ahead?"
  },
  {
   "id": "proj-sa-sharpe-haut",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "« Ton Sharpe de 2,9, c'est énorme. Pourquoi ne le tradeons-nous pas demain ? »",
   "solution": "Parce qu'il est obtenu sur un marché synthétique où la cointégration existe **par construction** (spread OU parfait de demi-vie 8 jours). Il prouve que le pipeline sait gagner quand l'effet existe, et qu'il ne gagne pas quand l'effet n'existe pas (contrôle négatif : $-0{,}19$ en moyenne sur 10 graines). Il ne dit rien des marchés réels, où les relations sont plus faibles, changent de régime et disparaissent quand trop de monde les trade. Un Sharpe de 2,9 sur données réelles serait plutôt le signe d'une erreur.",
   "en": "\"Your Sharpe of 2.9 is huge. Why don't we trade it tomorrow?\"",
   "essentiel": true
  },
  {
   "id": "proj-sa-echec-reel",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qui ferait échouer cette stratégie sur de vraies données ?",
   "solution": "- **Rupture de la relation** (fusion, changement d'activité, régime de marché) : le spread ne revient plus.\n- **$\\beta$ instable** : figé sur la fenêtre de formation alors qu'il dérive (piste : filtre de Kalman).\n- **Coûts** : spread bid-ask, impact, coût d'emprunt des titres vendus à découvert ; ton propre test montre qu'à 50 pb le Sharpe tombe à 0,31.\n- **Capacité et crowding** : tout le monde trade les mêmes paires, les sorties se font en même temps (août 2007).\n- **Pertes corrélées** : plusieurs stops touchés ensemble lors d'un choc de marché.\n- **Biais de survie** dans la sélection des paires et l'univers.",
   "en": "What would make this strategy fail on real data?"
  },
  {
   "id": "proj-sa-stop",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi un stop à $|z| > 4$ ? Que se passerait-il sans ?",
   "solution": "Si le spread s'écarte autant, l'hypothèse de cointégration est probablement cassée : on coupe une position qui ne reviendra peut-être jamais, et on limite la perte. C'est un choix **arbitraire**, à tester (2,5 ? 3 ? 5 ?), et il a un coût : sur une vraie paire, on coupe parfois juste avant le retour. Sans stop, une seule rupture de relation peut effacer des mois de gains (rendements très asymétriques).",
   "en": "Why a stop at $|z| > 4$? What would happen without it?"
  },
  {
   "id": "proj-sa-beta-dynamique",
   "theme": "projets",
   "niveau": 3,
   "profils": [
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Comment estimerais-tu un $\\beta$ qui varie dans le temps ?",
   "solution": "- **Fenêtre glissante** : simple, mais bruitée et en retard.\n- **Filtre de Kalman** : modèle état-espace où $\\beta_t$ suit une marche aléatoire ($\\beta_t = \\beta_{t-1} + \\eta_t$) et $y_t = \\beta_t x_t + \\varepsilon_t$. Le filtre met à jour $\\beta$ et son incertitude à chaque observation ; le rapport des variances de $\\eta$ et $\\varepsilon$ règle la réactivité.\n- **Pondération exponentielle** des observations.\nRisque : un $\\beta$ trop réactif absorbe le spread lui-même (le signal disparaît).",
   "en": "How would you estimate a time-varying hedge ratio $\\beta$?"
  },
  {
   "id": "proj-sa-couts",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "mm",
    "risque"
   ],
   "type": "ouverte",
   "question": "Comment ta stratégie réagit-elle aux coûts de transaction ? Qu'en conclus-tu ?",
   "solution": "Sharpe de 3,15 sans coûts, 2,87 à 5 points de base, 2,00 à 20 pb, 0,31 à 50 pb. La rentabilité dépend directement de la qualité d'exécution : une stratégie qui retourne souvent ses positions est très sensible aux coûts. Sur données réelles, il faut aussi l'impact de marché (qui croît avec la taille) et le coût d'emprunt des titres : la capacité de la stratégie est limitée.",
   "en": "How does your strategy react to transaction costs? What do you conclude?"
  },
  {
   "id": "proj-mm-pitch",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "ouverte",
   "question": "Présente ton projet de market making en deux minutes.",
   "solution": "Trame possible :\n1. **Problème** : un teneur de marché gagne le spread mais porte un risque d'inventaire ; comment coter pour équilibrer les deux ?\n2. **Modèle** : Avellaneda-Stoikov (2008). Prix milieu brownien, exécutions qui arrivent avec une intensité $\\lambda (\\delta) = A e^{-k\\delta}$ (plus on cote loin, moins on est exécuté). Prix de réservation décalé selon l'inventaire, spread optimal.\n3. **Méthode** : simulateur Monte-Carlo vectorisé (4 000 trajectoires en moins d'une seconde), comparaison avec un teneur naïf symétrique de même demi-spread moyen (comparaison équitable).\n4. **Résultats** : A-S divise par 2 l'écart-type du PnL (5,9 contre 12,1) et par 3 l'inventaire final, pour un PnL moyen plus bas (45 contre 56) : ratio PnL/risque de 7,7 contre 4,7. Balayage de $\\gamma$ : compromis rendement-risque.\n5. **Ce que j'ai appris** : un bug de comptage d'ordres trouvé par un test qui comparait au bon taux d'exécution en temps discret.\n6. **Limites** : pas de sélection adverse, pas de file d'attente, une seule taille d'ordre, prix brownien arithmétique.",
   "en": "Walk me through your market-making project in two minutes.",
   "essentiel": true
  },
  {
   "id": "proj-mm-reservation",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Avellaneda-Stoikov : prix milieu $s = 100$, inventaire $q = +3$, aversion $\\gamma = 0{,}5, \\sigma = 2$, temps restant $T - t = 0{,}5$. Prix de réservation ?",
   "solution": "$r = s - q \\gamma \\sigma^{2} (T - t) = 100 - 3 \\times 0{,}5 \\times 4 \\times 0{,}5 =$ **97**.\nLong de 3 unités, le teneur valorise l'actif sous le milieu : il abaisse ses deux cotations pour vendre plus facilement et acheter moins. Le décalage croît avec l'inventaire, l'aversion au risque, la volatilité et le temps restant.",
   "en": "Avellaneda-Stoikov: mid $s = 100$, inventory $q = +3, \\gamma = 0.5, \\sigma = 2, T - t = 0.5$. Reservation price?",
   "reponse": "100-3*0.5*4*0.5",
   "valeur": 97.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "proj-mm-spread",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Avec les paramètres de ton projet ($\\sigma = 2, k = 1{,}5, \\gamma = 0{,}5$) et $T - t = 1$, que vaut le spread total optimal d'Avellaneda-Stoikov ?",
   "solution": "Spread $= \\gamma \\sigma^{2}(T - t) + (2/\\gamma) \\ln (1 + \\gamma /k) = 0{,}5 \\times 4 \\times 1 + 4 \\ln (4/3) \\approx 2 + 1{,}151 =$ **$\\approx 3{,}15$**.\nLe premier terme rémunère le risque d'inventaire (il diminue à l'approche de la fin) ; le second vient du compromis prix / probabilité d'exécution ($k$ grand : la demande est sensible au prix, on cote serré).",
   "en": "With your project's parameters ($\\sigma = 2, k = 1.5, \\gamma = 0.5$) and $T - t = 1$, what is the optimal total Avellaneda-Stoikov spread?",
   "relances": [
    "Que devient le second terme quand $\\gamma \\to 0$ ? ($2/k$ : le teneur neutre au risque maximise seulement l'espérance)"
   ],
   "reponse": "0.5*4*1+(2/0.5)*ln(1+0.5/1.5)",
   "valeur": 3.150728289807123,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "proj-mm-intensite",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Que représente l'intensité $\\lambda (\\delta) = A e^{-k\\delta}$, et comment calibrerais-tu A et $k$ sur de vraies données ?",
   "solution": "C'est le taux auquel un ordre placé à une distance $\\delta$ du milieu est exécuté : A est l'activité du marché (exécutions par unité de temps au milieu), $k$ la sensibilité à la distance.\nCalibration : à partir des données de carnet et de transactions, mesurer la fréquence à laquelle le prix atteint (ou les ordres traversent) chaque distance $\\delta$, puis régresser $\\ln (\\text{fréquence})$ sur $\\delta$ : la pente donne $-k$, l'ordonnée $\\ln A$. Vérifier que l'exponentielle convient (souvent la décroissance est différente loin du milieu) et que les paramètres sont stables selon l'heure de la journée.",
   "en": "What does the intensity $\\lambda (\\delta) = A e^{-k\\delta}$ represent, and how would you calibrate A and $k$ on real data?"
  },
  {
   "id": "proj-mm-moins-de-pnl",
   "theme": "projets",
   "niveau": 1,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Ta stratégie Avellaneda-Stoikov gagne moins en moyenne que le teneur naïf. Pourquoi serait-elle meilleure ?",
   "solution": "Elle refuse des échanges qui augmenteraient l'inventaire et recentre ses prix : elle capture moins de spread (PnL moyen 45 contre 56) mais divise le risque par 2 (écart-type 5,9 contre 12,1) et l'inventaire final par 3. Le ratio PnL/risque passe de 4,7 à 7,7. C'est un choix de risque, pas une amélioration gratuite : on peut ensuite augmenter la taille pour retrouver le même PnL avec moins de risque, et un desk avec des limites de risque préfère ce profil.",
   "en": "Your Avellaneda-Stoikov strategy earns less on average than the naive market maker. Why would it be better?",
   "relances": [
    "Que montre le balayage de $\\gamma$ ? (plus $\\gamma$ est grand, plus l'inventaire et le risque baissent, et plus le PnL moyen baisse : de 60 à 21 quand $\\gamma$ passe de 0,01 à 2)"
   ]
  },
  {
   "id": "proj-mm-manque",
   "theme": "projets",
   "niveau": 2,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qui manque à ton simulateur pour ressembler à un vrai marché ?",
   "solution": "- **Sélection adverse** : les exécutions sont indépendantes du mouvement futur, alors qu'en réalité on est surtout exécuté quand le prix va contre soi. C'est la limite principale.\n- **File d'attente et priorité** : position dans le carnet, tick size, annulations.\n- **Frais et rebates**, latence.\n- **Tailles d'ordres** variables, limites d'inventaire dures.\n- **Dynamique de prix** : brownien arithmétique contre rendements, sauts, volatilité stochastique, signaux (déséquilibre du carnet).\nExercice d'extension : ajouter de la sélection adverse et voir si A-S gagne encore.",
   "en": "What is missing from your simulator compared with a real market?"
  },
  {
   "id": "proj-mm-taux-execution",
   "theme": "projets",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "Ton test du taux d'exécution compare le nombre d'ordres exécutés à $2 \\times \\text{pas} \\times (1 - e^{-\\lambda\\, dt})$ et non à $2\\lambda T$. Pourquoi ?",
   "solution": "En temps continu, un processus de Poisson d'intensité $\\lambda$ donne $\\lambda T$ exécutions en moyenne par côté. Le simulateur est en temps discret et autorise **au plus une exécution par côté et par pas** : la probabilité d'au moins une exécution sur un pas est $1 - e^{-\\lambda dt}$. L'espérance exacte du simulateur est donc $2 \\times$ nombre de pas $\\times (1 - e^{-\\lambda dt})$, un peu moins que $2\\lambda T$. Comparer au bon chiffre a permis de détecter un vrai bug : le compteur faisait `bool + bool`, ce qui en NumPy est un OU logique, et sous-comptait les doubles exécutions.",
   "en": "Your execution-rate test compares fills to $2 \\times \\text{steps} \\times (1 - e^{-\\lambda\\, dt})$ rather than $2\\lambda T$. Why?"
  },
  {
   "id": "proj-mm-hjb",
   "theme": "projets",
   "niveau": 3,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "ouverte",
   "question": "D'où vient la formule d'Avellaneda-Stoikov ?",
   "solution": "Le teneur maximise l'espérance d'une utilité exponentielle (CARA, aversion $\\gamma$) de sa richesse finale. Le problème de contrôle stochastique donne une équation de Hamilton-Jacobi-Bellman en ($t, s, q$, cash). L'utilité exponentielle permet de séparer le cash ; un développement (ansatz quadratique en l'inventaire $q$) donne le prix de réservation $r = s - q\\gamma \\sigma^{2}(T - t)$, puis l'optimisation des distances de cotation donne le spread. La solution utilisée est une approximation (les auteurs eux-mêmes linéarisent) ; Guéant, Lehalle et Fernandez-Tapia en donnent une version avec limite d'inventaire et solution asymptotique.",
   "en": "Where does the Avellaneda-Stoikov formula come from?"
  },
  {
   "id": "risque-garch-long-terme",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "risque",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Un GARCH(1,1) $\\sigma^{2}_{t} = \\omega + \\alpha \\varepsilon^{2}_{t-1} + \\beta \\sigma^{2}_{t-1}$ a $\\omega = 0{,}000002$, $\\alpha = 0{,}10$, $\\beta = 0{,}88$ (rendements quotidiens). Quelle est la volatilité quotidienne de long terme ?",
   "solution": "Variance de long terme : $\\omega /(1 - \\alpha - \\beta) = 0{,}000002/0{,}02 = 0{,}0001$, soit une volatilité de **1 % par jour** (environ 16 % par an).\n$\\alpha + \\beta = 0{,}98$ mesure la persistance : un choc de volatilité met longtemps à se dissiper (demi-vie $\\ln 0{,}5/\\ln 0{,}98 \\approx 34$ jours).",
   "en": "A GARCH(1,1) with $\\omega = 0.000002, \\alpha = 0.10, \\beta = 0.88$ (daily returns). What is the long-run daily volatility?",
   "relances": [
    "Que se passe-t-il si $\\alpha + \\beta \\ge 1$ ? (pas de variance de long terme finie : modèle intégré, IGARCH, dont l'EWMA est un cas particulier)"
   ],
   "reponse": "sqrt(0.000002/(1-0.1-0.88))",
   "valeur": 0.009999999999999995,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "risque-ewma-demi-vie",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "risque",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une volatilité EWMA (RiskMetrics) utilise $\\lambda = 0{,}94$ : $\\sigma^{2}_{t} = \\lambda \\sigma^{2}_{t-1} + (1 - \\lambda)r^{2}_{t-1}$. Quelle est la demi-vie du poids des observations, en jours ?",
   "solution": "Le poids d'une observation vieille de $k$ jours est proportionnel à $\\lambda^{k}$. Demi-vie : $\\ln 0{,}5/\\ln 0{,}94 \\approx$ **11,2 jours**. L'estimateur réagit vite, mais il est bruité et n'a pas de retour vers une moyenne de long terme.",
   "en": "An EWMA volatility uses $\\lambda = 0.94$. What is the half-life of the observation weights, in days?",
   "reponse": "ln(0.5)/ln(0.94)",
   "valeur": 11.202305583621158,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "risque-diversification-limite",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "risque",
    "hf",
    "banque",
    "data",
    "mm"
   ],
   "type": "numerique",
   "question": "Un portefeuille équipondéré contient un très grand nombre d'actions, chacune de volatilité 20 %, toutes corrélées deux à deux à 0,25. Vers quelle volatilité tend le portefeuille ?",
   "solution": "Variance avec $N$ actifs : $\\sigma^{2}[\\rho + (1 - \\rho)/N] \\to \\sigma^{2}\\rho$. Volatilité limite : $\\sigma \\sqrt{\\rho} = 20\\,\\% \\times 0{,}5 =$ **10 %**. Le risque spécifique se diversifie, le risque commun (le marché) non.",
   "en": "An equally weighted portfolio of many stocks, each with 20% vol and pairwise correlation 0.25. What does portfolio volatility converge to?",
   "relances": [
    "Et en période de crise, quand les corrélations montent vers 0,8 ? ($\\approx 17{,}9\\,\\%$ : la diversification disparaît quand on en a le plus besoin)"
   ],
   "reponse": "0.2*sqrt(0.25)",
   "valeur": 0.1,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "risque-beta",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "risque",
    "hf",
    "banque",
    "data"
   ],
   "type": "numerique",
   "question": "Une action a une volatilité de 30 %, le marché de 15 %, et leur corrélation vaut 0,6. Quel est le bêta de l'action ?",
   "solution": "$\\beta = \\operatorname{Cov} (r, r_m)/\\operatorname{Var} (r_m) = \\rho \\sigma /\\sigma_m = 0{,}6 \\times 30/15 =$ **1,2**. Pour couvrir 1 million d'euros de cette action contre le marché, il faut vendre 1,2 million d'euros d'indice.",
   "en": "A stock has 30% vol, the market 15%, correlation 0.6. What is the stock's beta?",
   "relances": [
    "Quelle part de la variance de l'action la couverture élimine-t-elle ? ($\\rho^{2} = 36\\,\\%$)"
   ],
   "reponse": "0.6*0.3/0.15",
   "valeur": 1.2,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "risque-couverture-variance-min",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque",
    "mm"
   ],
   "type": "numerique",
   "question": "Tu couvres une position avec un contrat à terme. La volatilité quotidienne de la position est 2 %, celle du contrat 2,5 %, leur corrélation 0,9. Quel ratio de couverture minimise la variance ?",
   "solution": "$h$* $= \\rho \\sigma_S/\\sigma_F = 0{,}9 \\times 2/2{,}5 =$ **0,72**. La variance résiduelle vaut $(1 - \\rho^{2}) \\sigma_S^{2}$ : il reste un risque de base (19 % de la variance).",
   "en": "You hedge a position with futures. Daily vol of the position is 2%, of the futures 2.5%, correlation 0.9. Minimum-variance hedge ratio?",
   "reponse": "0.9*0.02/0.025",
   "valeur": 0.7200000000000001,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "risque-var-historique",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment calcule-t-on une VaR historique ? Avantages et limites ?",
   "solution": "On rejoue sur le portefeuille d'aujourd'hui les variations de facteurs de risque observées sur une fenêtre passée (par exemple 500 jours), on obtient 500 PnL hypothétiques, et la VaR 99 % est (environ) la 5ᵉ pire perte.\n- **Avantages** : pas d'hypothèse de loi, capture les queues épaisses et les corrélations réelles, facile à expliquer.\n- **Limites** : dépend entièrement de la fenêtre (un krach hors fenêtre n'existe pas) ; très peu d'observations dans la queue (estimation bruitée) ; réagit tard aux changements de régime et fait des sauts quand un gros choc sort de la fenêtre ; suppose que le passé est représentatif.\nVariantes : pondération temporelle, rééchelonnement par la volatilité actuelle (filtered historical simulation), VaR stressée sur une période de crise.",
   "en": "How do you compute a historical VaR? Pros and cons?"
  },
  {
   "id": "risque-exceptions-historique",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "numerique",
   "question": "Avec 500 jours d'historique, combien de scénarios de perte se trouvent au-delà d'une VaR historique à 99 % ?",
   "solution": "$500 \\times 1\\,\\% =$ **5** scénarios : la VaR est estimée à partir de la 5ᵉ ou 6ᵉ pire perte, et l'Expected Shortfall 99 % est la moyenne de ces 5 pertes. Cinq points, c'est très peu : d'où l'instabilité des mesures de queue.",
   "en": "With 500 days of history, how many loss scenarios lie beyond a 99% historical VaR?",
   "reponse": "500*0.01",
   "valeur": 5.0,
   "tolerance": 0.005,
   "duree": 45
  },
  {
   "id": "risque-stress-test",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un stress test et en quoi complète-t-il la VaR ?",
   "solution": "On évalue la perte du portefeuille dans des scénarios extrêmes mais plausibles, sans probabilité attachée :\n- **historiques** : rejouer 1987, 2008, mars 2020, une crise de taux ;\n- **hypothétiques** : choc de taux de $+200$ pb, krach de $-30\\,\\%$ avec hausse de la volatilité, écartement des spreads de crédit ;\n- **inversés** : chercher le scénario qui ferait perdre un montant donné (ce qui casse vraiment le portefeuille).\nLa VaR décrit les pertes « normales » sur un horizon court ; le stress test regarde la queue et les ruptures (corrélations qui montent, liquidité qui disparaît). Difficulté : choisir des scénarios cohérents entre facteurs.",
   "en": "What is a stress test and how does it complement VaR?"
  },
  {
   "id": "risque-correlation-crise",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "hf",
    "banque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Pourquoi dit-on que « les corrélations tendent vers 1 en période de crise » ? Conséquences pour un gestionnaire de risque ?",
   "solution": "Lors des chocs, un facteur commun domine (fuite vers la qualité, ventes forcées, appels de marge, désendettement) : les actifs risqués baissent ensemble. Une partie de l'effet est aussi statistique : la corrélation mesurée augmente mécaniquement quand la volatilité du facteur commun augmente.\nConséquences : la diversification estimée en période calme surestime la protection ; les VaR fondées sur des corrélations récentes sous-estiment le risque de crise ; il faut des corrélations stressées, des stress tests, et regarder la dépendance de queue (copules), pas seulement la corrélation linéaire.",
   "en": "Why do people say \"correlations go to 1 in a crisis\"? Consequences for a risk manager?"
  },
  {
   "id": "risque-liquidite",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que le risque de liquidité de marché ? Comment l'intégrer dans une mesure de risque ?",
   "solution": "Le risque de ne pas pouvoir déboucler une position rapidement sans faire bouger le prix (spread qui s'écarte, profondeur qui disparaît, impact de marché), surtout en période de stress et pour des positions grandes devant le volume échangé.\nIntégration : horizon de liquidation par actif (FRTB : horizons de 10 à 120 jours selon la classe d'actifs), coût de sortie ajouté à la VaR (moitié du spread, impact en racine carrée du volume), limites de concentration par rapport au volume quotidien, stress tests de liquidité.",
   "en": "What is market liquidity risk? How do you include it in a risk measure?"
  },
  {
   "id": "risque-autocorrelation-ar1",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Un processus AR(1) $x_{t} = 0{,}8 x_{t-1} + \\varepsilon_{t}$ est stationnaire. Que vaut son autocorrélation au retard 3 ?",
   "solution": "$\\rho (k) = \\varphi^{k} = 0{,}8^{3} =$ **0,512**. Décroissance géométrique ; la variance stationnaire vaut $\\sigma_\\varepsilon^{2}/(1 - \\varphi^{2}) = \\sigma_\\varepsilon^{2}/0{,}36$.",
   "en": "A stationary AR(1) $x_{t} = 0.8 x_{t-1} + \\varepsilon_{t}$. What is its lag-3 autocorrelation?",
   "relances": [
    "Et l'autocorrélation partielle au retard 2 ? (0 : signature d'un AR(1))"
   ],
   "reponse": "0.8^3",
   "valeur": 0.5120000000000001,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "risque-variance-ar1",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "$x_{t} = 0{,}8 x_{t-1} + \\varepsilon_{t}$ avec $\\operatorname{Var} (\\varepsilon_{t}) = 1$. Variance stationnaire de $x$ ?",
   "solution": "$\\operatorname{Var} (x) = 0{,}64 \\operatorname{Var} (x) + 1$, donc $\\operatorname{Var} (x) = 1/0{,}36 \\approx$ **2,78**. Quand $\\varphi \\to 1$, la variance explose : on s'approche d'une marche aléatoire (racine unitaire).",
   "en": "$x_{t} = 0.8 x_{t-1} + \\varepsilon_{t}$ with $\\operatorname{Var} (\\varepsilon) = 1$. Stationary variance of $x$?",
   "reponse": "1/(1-0.64)",
   "valeur": 2.7777777777777777,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "risque-sharpe-levier",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "risque",
    "mm",
    "data"
   ],
   "type": "ouverte",
   "question": "Si tu doubles le levier d'une stratégie (financement au taux sans risque), que deviennent son rendement excédentaire, sa volatilité et son ratio de Sharpe ?",
   "solution": "Rendement excédentaire $\\times 2$, volatilité $\\times 2$ : le **Sharpe ne change pas**. C'est pour cela qu'on compare des stratégies par leur Sharpe et non par leur rendement. Mais le drawdown maximal, le risque de ruine et le risque de financement (appels de marge, coûts d'emprunt plus élevés que le taux sans risque) augmentent : le Sharpe n'est pas toute l'histoire.",
   "en": "If you double a strategy's leverage (financed at the risk-free rate), what happens to excess return, volatility and Sharpe ratio?"
  },
  {
   "id": "risque-drawdown-attendu",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Une stratégie a un Sharpe de 1 et une volatilité de 10 % par an. Un drawdown de 15 % au bout de deux ans signifie-t-il qu'elle ne marche plus ?",
   "solution": "Pas forcément. Avec un Sharpe de 1, les drawdowns de 1,5 volatilité annuelle ne sont pas rares sur quelques années : un mouvement brownien avec une dérive égale à la volatilité connaît régulièrement des baisses de cette ampleur. Il faut comparer le drawdown à sa distribution attendue (par simulation avec le Sharpe et la volatilité supposés), regarder si les causes sont identifiables (régime de marché, crowding, coûts) et si le comportement du signal a changé (prédictions, rotation), avant de conclure. À l'inverse, fixer à l'avance une règle de coupure évite de rationaliser après coup.",
   "en": "A strategy with Sharpe 1 and 10% annual vol suffers a 15% drawdown after two years. Does it mean it stopped working?"
  },
  {
   "id": "stats-p-valeur",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'une p-valeur ? Qu'est-ce qu'elle n'est pas ?",
   "solution": "La p-valeur est la probabilité, **si l'hypothèse nulle est vraie**, d'observer une statistique au moins aussi extrême que celle observée.\nCe qu'elle n'est pas :\n- la probabilité que l'hypothèse nulle soit vraie ;\n- la probabilité que le résultat soit dû au hasard ;\n- une mesure de la taille de l'effet (un effet minuscule devient « significatif » avec assez de données).\nSous $H_{0}$ (statistique continue), la p-valeur est uniforme sur [0, 1] : en testant 100 stratégies sans aucun pouvoir prédictif, environ 5 auront $p < 0{,}05$.",
   "en": "What is a p-value? What is it not?",
   "relances": [
    "Pourquoi est-ce dangereux en recherche quantitative ? (on teste des milliers de signaux : il faut corriger les comparaisons multiples)"
   ],
   "essentiel": true
  },
  {
   "id": "stats-erreurs",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Erreur de première espèce, erreur de seconde espèce, puissance : définis-les et donne un exemple en trading.",
   "solution": "- **Erreur de 1ʳᵉ espèce ($\\alpha$)** : rejeter $H_{0}$ alors qu'elle est vraie. Exemple : croire qu'un signal prédit les rendements alors qu'il n'a aucun pouvoir (faux positif), puis le trader.\n- **Erreur de 2ᵉ espèce ($\\beta$)** : ne pas rejeter $H_{0}$ alors qu'elle est fausse. Exemple : jeter un vrai signal faute de données.\n- **Puissance $= 1 - \\beta$** : probabilité de détecter un effet qui existe. Elle augmente avec la taille de l'échantillon et la taille de l'effet.\nDans ton projet stat arb, le premier réglage (252 jours, demi-vie 15 jours) manquait de puissance : le test ADF ne détectait pas les vraies paires.",
   "en": "Define type I error, type II error and power, with a trading example."
  },
  {
   "id": "stats-sharpe-annualise",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "mm",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Une stratégie a un Sharpe quotidien de 0,1 (rendement moyen divisé par l'écart-type, en données journalières). Quel est son Sharpe annualisé (252 jours) ?",
   "solution": "La moyenne est multipliée par 252, l'écart-type par $\\sqrt{252}$ : Sharpe annuel $= 0{,}1 \\times \\sqrt{252} \\approx$ **1,59**.\nHypothèse : rendements indépendants d'un jour à l'autre. Avec de l'autocorrélation positive, cette règle surestime le Sharpe (Lo, 2002).",
   "en": "A strategy has a daily Sharpe ratio of 0.1. What is its annualized Sharpe (252 trading days)?",
   "relances": [
    "Un Sharpe annuel de 2 correspond à quel Sharpe mensuel ? ($2/\\sqrt{12} \\approx 0{,}58$)"
   ],
   "reponse": "0.1*sqrt(252)",
   "valeur": 1.5874507866387546,
   "tolerance": 0.005,
   "duree": 60,
   "essentiel": true
  },
  {
   "id": "stats-sharpe-erreur",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Tu estimes un Sharpe annuel de 1 à partir de 4 ans de rendements quotidiens (gaussiens, indépendants). Quel est environ l'écart-type de cet estimateur ?",
   "solution": "Sharpe quotidien : $1/\\sqrt{252}$ ; $\\operatorname{Var}(\\widehat{\\text{SR}}_\\text{quotidien}) \\approx (1 + 1/504)/1\\,008$. On annualise en multipliant l'écart-type par $\\sqrt{252}$ : $\\sqrt{252/1\\,008} \\approx$ **0,50**. Règle à retenir : écart-type $\\approx 1/\\sqrt{\\text{nombre d'années}}$.\nUn Sharpe estimé de 1 sur 4 ans est donc compatible avec un vrai Sharpe entre 0 et 2 ($\\pm 2$ écarts-types). Il faut beaucoup d'années pour distinguer un bon gérant d'un chanceux.\nDans ton projet stat arb, l'intervalle de confiance du Sharpe vient d'un bootstrap par blocs (1,99 à 3,82), plus réaliste quand les rendements sont autocorrélés ou à queues épaisses.",
   "en": "You estimate an annual Sharpe of 1 from 4 years of daily returns (i.i.d. normal). What is the approximate standard error of the estimate?",
   "indice": "Formule de Lo pour un Sharpe par période estimé sur $n$ périodes : $\\operatorname{Var}(\\widehat{\\text{SR}}) \\approx (1 + \\text{SR}^{2}/2)/n$. Le Sharpe quotidien est minuscule.",
   "relances": [
    "Combien d'années pour que l'écart-type tombe à 0,25 ? (16 ans)",
    "Avec des rendements annuels seulement, que devient la formule ? ($\\sqrt{(1 + \\text{SR}^{2}/2)/T}$ : le terme $\\text{SR}^{2}/2$ n'est plus négligeable)"
   ],
   "reponse": "sqrt((1+1/504)/4)",
   "valeur": 0.5004957859423311,
   "tolerance": 0.02,
   "duree": 180
  },
  {
   "id": "stats-tests-multiples",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Tu testes 100 signaux indépendants qui n'ont en réalité aucun pouvoir prédictif, chacun au seuil de 5 %. Probabilité qu'au moins un ressorte « significatif » ?",
   "solution": "$1 - 0{,}95^{100} \\approx$ **99,4 %**. En moyenne, 5 signaux seront faussement significatifs.\nCorrections : Bonferroni (seuil $\\alpha /m$), Holm, contrôle du taux de fausses découvertes (Benjamini-Hochberg), Sharpe déflaté, et surtout un échantillon de validation jamais utilisé pour choisir.",
   "en": "You test 100 independent signals with no real predictive power, each at the 5% level. What is the probability that at least one comes out significant?",
   "relances": [
    "Seuil de Bonferroni pour 100 tests à 5 % ? (0,0005)",
    "Pourquoi Bonferroni est-il trop conservateur quand les tests sont corrélés ?"
   ],
   "reponse": "1-0.95^100",
   "valeur": 0.994079470779666,
   "tolerance": 0.005,
   "duree": 120,
   "essentiel": true
  },
  {
   "id": "stats-bonferroni",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Dans ton projet stat arb, tu as testé 1 540 paires. Quel seuil de p-valeur faudrait-il par paire avec une correction de Bonferroni pour garder un risque global de 5 % ?",
   "solution": "$0{,}05/1\\,540 \\approx$ **$3{,}2 \\times 10^{-5}$**. Sans correction, on attend $\\sim 77$ paires faussement cointégrées : c'est ce qui a fait échouer ton premier réglage (des marches aléatoires avec une statistique ADF $\\approx -5$).\nAlternative plus puissante : Benjamini-Hochberg (contrôle du taux de fausses découvertes), ou une présélection économique (même secteur) qui réduit le nombre de tests.",
   "en": "You tested 1,540 pairs. What per-pair p-value threshold would a Bonferroni correction require for a 5% family-wise error rate?",
   "reponse": "0.05/1540",
   "valeur": 3.246753246753247e-05,
   "tolerance": 0.01,
   "duree": 90
  },
  {
   "id": "stats-biais-backtest",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Cite les principaux biais qui rendent un backtest trop optimiste.",
   "solution": "- **Regard vers le futur** (look-ahead) : utiliser une information pas encore disponible (prix de clôture pour trader à la clôture, données révisées, normalisation sur tout l'échantillon). Ton projet stat arb a un test dédié.\n- **Biais du survivant** : ne garder que les actifs qui existent aujourd'hui (les faillites ont disparu).\n- **Sur-apprentissage, data snooping** : essayer beaucoup de variantes et garder la meilleure ; d'où le Sharpe déflaté et le contrôle négatif.\n- **Coûts sous-estimés** : spread, impact de marché, coûts d'emprunt des titres, frais ; capacité.\n- **Biais de sélection de période** : choisir une fenêtre favorable.\n- **Fuite d'information** dans la validation : validation croisée aléatoire sur des séries temporelles.",
   "en": "List the main biases that make a backtest too optimistic.",
   "relances": [
    "Comment s'en protéger ? (walk-forward, échantillon de test gelé, données point-in-time, univers historique complet, coûts conservateurs, contrôle négatif)"
   ],
   "essentiel": true
  },
  {
   "id": "stats-ols-hypotheses",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Quelles sont les hypothèses de la régression linéaire par moindres carrés (MCO), et que se passe-t-il si chacune est violée ?",
   "solution": "Modèle $y = X\\beta + \\varepsilon$.\n- **Exogénéité** $\\mathbb{E}[\\varepsilon | X] = 0$ : sinon les coefficients sont biaisés (variable omise, causalité inverse, erreur de mesure sur $X$).\n- **Pas de colinéarité parfaite** : sinon $\\beta$ n'est pas identifiable ; une forte colinéarité gonfle les variances.\n- **Homoscédasticité** : sinon les estimateurs restent sans biais mais les écarts-types sont faux (écarts-types de White).\n- **Pas d'autocorrélation des erreurs** : idem, écarts-types faux (Newey-West) ; fréquent en séries temporelles.\n- **Normalité des erreurs** : utile seulement pour les tests exacts en petit échantillon.\nSous les quatre premières, MCO est le meilleur estimateur linéaire sans biais (Gauss-Markov).",
   "en": "What are the OLS assumptions, and what happens when each is violated?",
   "relances": [
    "Formule de $\\hat{\\beta}$ ? ($(X^{T}X)^{-1}X^{T}y$)"
   ],
   "essentiel": true
  },
  {
   "id": "stats-pentes-croisees",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "La corrélation entre $x$ et y vaut 0,5. La pente de la régression de y sur $x$ vaut 0,8. Que vaut la pente de la régression de $x$ sur y ?",
   "solution": "$\\text{pente}(y \\mid x) = \\rho\\, \\sigma_y/\\sigma_x$ et $\\text{pente}(x \\mid y) = \\rho\\, \\sigma_x/\\sigma_y$ : leur produit vaut $\\rho^{2} = 0{,}25$. Donc $\\text{pente}(x \\mid y) = 0{,}25/0{,}8 =$ **0,3125**.",
   "en": "$\\operatorname{corr} (x, y) = 0.5$ and the slope of y regressed on $x$ is 0.8. What is the slope of $x$ regressed on y?",
   "piege": "Répondre $1/0{,}8 = 1{,}25$ : les deux régressions minimisent des erreurs différentes (verticales et horizontales), elles ne sont pas inverses l'une de l'autre sauf si $|\\rho | = 1$.",
   "relances": [
    "Lien avec le choix de $\\beta$ dans un pairs trading ? (régresser A sur B ou B sur A ne donne pas le même ratio de couverture ; alternatives : moindres carrés totaux, Johansen)"
   ],
   "reponse": "0.25/0.8",
   "valeur": 0.3125,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "stats-donnees-doublees",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Tu dupliques par erreur toutes les lignes de ton jeu de données avant une régression. Que deviennent les coefficients, les écarts-types et les t-stats ?",
   "solution": "- Les **coefficients** ne changent pas ($X^{T}X$ et $X^{T}y$ sont simplement multipliés par 2).\n- La variance estimée des résidus ne change presque pas, mais $(X^{T}X)^{-1}$ est divisé par 2 : les **écarts-types sont divisés par $\\sqrt{2}$**.\n- Les **t-stats sont multipliées par $\\sqrt{2}$** : la régression paraît plus significative qu'elle ne l'est.\nMême phénomène, moins visible, avec des rendements sur fenêtres glissantes qui se chevauchent : les observations ne sont pas indépendantes, il faut corriger les écarts-types (Newey-West, Hansen-Hodrick).",
   "en": "You accidentally duplicate every row of your dataset before running a regression. What happens to coefficients, standard errors and t-stats?"
  },
  {
   "id": "stats-r2",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Que mesure le $R^{2}$ ? Un $R^{2}$ de 1 % est-il forcément inutile en finance ?",
   "solution": "$R^{2} =$ part de la variance de y expliquée par le modèle $= 1 -$ SCR/SCT ; en régression simple, $R^{2} = \\rho^{2}$.\nUn $R^{2}$ de 1 % sur des rendements quotidiens peut valoir beaucoup : une corrélation de 0,1 entre prévision et rendement, appliquée sur des milliers de paris indépendants, donne un Sharpe élevé (loi fondamentale de la gestion active : $\\text{IR} \\approx \\text{IC} \\times \\sqrt{\\text{nombre de paris indépendants}}$).\nÀ l'inverse, un $R^{2}$ élevé entre deux séries de **prix** (non stationnaires) peut être une régression fallacieuse.",
   "en": "What does $R^{2}$ measure? Is an $R^{2}$ of 1% necessarily useless in finance?",
   "relances": [
    "$R^{2}$ ajusté ? (pénalise le nombre de variables)"
   ]
  },
  {
   "id": "stats-regression-fallacieuse",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Tu régresses le prix d'une action sur celui d'une autre et tu trouves $R^{2} = 0{,}9$ et une t-stat de 40. Est-ce une bonne nouvelle ?",
   "solution": "Pas forcément : deux marches aléatoires indépendantes donnent souvent des $R^{2}$ élevés et des t-stats énormes (Granger-Newbold, 1974). Les prix ne sont pas stationnaires et les erreurs sont fortement autocorrélées : les tests usuels ne s'appliquent pas.\nCe qu'il faut faire : régresser les **rendements** (stationnaires), ou tester la **cointégration** (le résidu est-il stationnaire ? Engle-Granger avec les valeurs critiques de MacKinnon, ou Johansen). C'est la démarche de ton projet stat arb.",
   "en": "You regress one stock's price on another's and find $R^{2} = 0.9$ with a t-stat of 40. Is that good news?"
  },
  {
   "id": "stats-stationnarite",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'une série stationnaire ? Les prix le sont-ils ? Les rendements ?",
   "solution": "Stationnarité (faible) : moyenne et variance constantes, autocovariance qui ne dépend que de l'écart entre les dates.\n- Les **prix** ne le sont pas : ils se comportent comme des marches aléatoires (racine unitaire), leur variance croît avec le temps.\n- Les **rendements** le sont approximativement, mais leur volatilité varie (regroupement de volatilité, GARCH), leurs queues sont épaisses, et les régimes changent.\nTests : ADF ($H_{0}$ : racine unitaire), KPSS ($H_{0}$ : stationnarité).",
   "en": "What is a stationary time series? Are prices stationary? Returns?",
   "essentiel": true
  },
  {
   "id": "stats-adf",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Explique le test de Dickey-Fuller augmenté. Pourquoi les valeurs critiques changent-elles quand on l'applique aux résidus d'une régression ?",
   "solution": "On régresse $\\Delta x_t = \\alpha + \\gamma x_{t-1} + \\sum \\delta_i \\Delta x_{t-i} + \\varepsilon_t$ et on teste $H_{0}$ : $\\gamma = 0$ (racine unitaire) contre $\\gamma < 0$ (retour à la moyenne). La statistique est la t-stat de $\\gamma$, mais sous $H_{0}$ elle ne suit pas une loi de Student : valeurs critiques de Dickey-Fuller ($\\approx -2{,}86$ à 5 % avec constante).\nSur des **résidus** d'Engle-Granger, la régression a déjà choisi $\\beta$ pour rendre le résidu le plus stationnaire possible : la statistique est biaisée vers des valeurs négatives, d'où des valeurs critiques plus sévères (MacKinnon ; $-3{,}90$ à 1 % dans ton projet pour deux séries).\nLien avec la demi-vie : $\\varphi = 1 + \\gamma$, demi-vie $= -\\ln 2/\\ln \\varphi$.",
   "en": "Explain the augmented Dickey-Fuller test. Why do critical values change when it is applied to regression residuals?",
   "relances": [
    "Que sont les retards ($\\Delta x_{t-i}$) ? (ils absorbent l'autocorrélation des erreurs ; ton projet utilise un ADF sans retard, c'est une limite)"
   ]
  },
  {
   "id": "stats-mle-exponentielle",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Tu observes $n$ durées $x_{1}, \\dots, x_{n}$ supposées exponentielles de paramètre $\\lambda$. Estimateur du maximum de vraisemblance de $\\lambda$ ?",
   "solution": "Log-vraisemblance : $n \\ln \\lambda - \\lambda \\sum x_{i}$. Dérivée nulle : $n/\\lambda - \\sum x_{i} = 0$, donc **$\\hat{\\lambda} = 1/\\bar{x}$**.\nIl est biaisé en petit échantillon ($\\mathbb{E}[\\hat{\\lambda}] = n\\lambda /(n - 1)$) mais convergent ; sa variance asymptotique est $\\lambda^{2}/n$ (inverse de l'information de Fisher).",
   "en": "You observe $n$ durations assumed exponential with rate $\\lambda$. What is the MLE of $\\lambda$?",
   "relances": [
    "Propriétés générales du maximum de vraisemblance ? (convergent, asymptotiquement normal et efficace, invariant par reparamétrisation)"
   ]
  },
  {
   "id": "stats-variance-n-moins-un",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Pourquoi divise-t-on par $n - 1$ et non par $n$ pour estimer une variance ?",
   "solution": "Les écarts sont mesurés à la moyenne empirique $\\bar{x}$, qui est elle-même ajustée aux données : $\\sum (x_{i} - \\bar{x})^{2}$ est en moyenne plus petit que $\\sum (x_{i} - \\mu)^{2}$. Précisément $\\mathbb{E}[\\sum (x_{i} - \\bar{x})^{2}] = (n - 1)\\sigma^{2}$ : on a perdu un degré de liberté. Diviser par $n - 1$ rend l'estimateur sans biais (correction de Bessel).\nL'écart-type obtenu (racine) reste légèrement biaisé, et l'estimateur en $1/n$ a une erreur quadratique plus faible : sans biais ne veut pas dire meilleur.",
   "en": "Why divide by $n - 1$ rather than $n$ when estimating a variance?"
  },
  {
   "id": "stats-intervalle-moyenne",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "numerique",
   "question": "Sur 100 observations indépendantes d'écart-type 10, quelle est la demi-largeur d'un intervalle de confiance à 95 % pour la moyenne ?",
   "solution": "Erreur standard $= \\sigma /\\sqrt{n} = 10/10 = 1$, demi-largeur $= 1{,}96 \\times 1 \\approx$ **1,96**.",
   "en": "With 100 i.i.d. observations of standard deviation 10, what is the half-width of a 95% confidence interval for the mean?",
   "relances": [
    "Combien d'observations pour diviser la largeur par 2 ? (4 fois plus : 400)"
   ],
   "reponse": "1.96",
   "valeur": 1.96,
   "tolerance": 0.01,
   "duree": 90
  },
  {
   "id": "stats-taille-echantillon",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Avec 100 observations, ton intervalle de confiance sur une moyenne est trop large. Combien d'observations faut-il pour diviser sa largeur par deux ?",
   "solution": "La largeur est en $1/\\sqrt{n}$ : pour la diviser par 2, il faut 4 fois plus de données, **400**.",
   "en": "With 100 observations your confidence interval for a mean is too wide. How many observations are needed to halve its width?",
   "reponse": "400",
   "valeur": 400.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "stats-vol-portefeuille",
   "theme": "stats",
   "niveau": 1,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm",
    "banque"
   ],
   "type": "numerique",
   "question": "Un portefeuille $50/50$ contient deux actifs de volatilités 20 % et 30 %, corrélés à 0,5. Volatilité du portefeuille ?",
   "solution": "$\\sigma^{2} = 0{,}25 \\times 0{,}04 + 0{,}25 \\times 0{,}09 + 2 \\times 0{,}25 \\times 0{,}5 \\times 0{,}2 \\times 0{,}3 = 0{,}01 + 0{,}0225 + 0{,}015 = 0{,}0475$, donc $\\sigma \\approx$ **21,8 %**, moins que la moyenne des volatilités (25 %) : c'est la diversification.",
   "en": "A $50/50$ portfolio holds two assets with vols of 20% and 30% and correlation 0.5. Portfolio volatility?",
   "relances": [
    "Et avec une corrélation de $-1$ ? ($|0{,}1 - 0{,}15| = 5\\,\\%$)",
    "Quels poids minimisent la variance ? ($w_{1} = (\\sigma_{2}^{2} - \\rho \\sigma_{1}\\sigma_{2})/(\\sigma_{1}^{2} + \\sigma_{2}^{2} - 2\\rho \\sigma_{1}\\sigma_{2}) = 0{,}06/0{,}07 \\approx 86\\,\\%$)"
   ],
   "reponse": "sqrt(0.25*0.04+0.25*0.09+2*0.25*0.5*0.2*0.3)",
   "valeur": 0.21794494717703367,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "stats-heteroscedasticite",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que l'hétéroscédasticité ? Comment la détecter et la corriger ? Et l'autocorrélation des résidus ?",
   "solution": "Hétéroscédasticité : la variance des erreurs dépend des variables ou du temps (très fréquent : la volatilité des rendements varie).\n- Détection : graphique des résidus, tests de Breusch-Pagan ou de White.\n- Correction : écarts-types robustes de White (les coefficients MCO restent sans biais), moindres carrés pondérés si la forme est connue, modélisation GARCH.\nAutocorrélation : test de Durbin-Watson ou de Ljung-Box ; écarts-types de **Newey-West** (robustes à l'hétéroscédasticité et à l'autocorrélation), indispensables avec des fenêtres de rendements qui se chevauchent.",
   "en": "What is heteroskedasticity? How do you detect and correct it? And residual autocorrelation?"
  },
  {
   "id": "stats-erreur-variable",
   "theme": "stats",
   "niveau": 3,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "numerique",
   "question": "Vrai modèle : $y = x + \\varepsilon$. Mais tu n'observes que $x$̃ $= x + u$, avec $\\operatorname{Var} (x) = 1, \\operatorname{Var} (u) = 0{,}25, u$ indépendant du reste. Vers quelle valeur tend la pente estimée de y sur $x$̃ ?",
   "solution": "Pente $= \\operatorname{Cov} (y, x̃)/\\operatorname{Var} (x̃) = \\operatorname{Var} (x)/(\\operatorname{Var} (x) + \\operatorname{Var} (u)) = 1/1{,}25 =$ **0,8**. C'est le biais d'atténuation : le bruit de mesure sur la variable explicative tire la pente vers zéro.\nEn finance : les bêtas estimés avec des variables bruitées sont trop faibles ; corrections par variables instrumentales ou en agrégeant (portefeuilles) pour réduire le bruit.",
   "en": "True model $y = x + \\varepsilon$, but you only observe $x$̃ $= x + u$ with $\\operatorname{Var} (x) = 1, \\operatorname{Var} (u) = 0.25, u$ independent. What does the OLS slope of y on $x$̃ converge to?",
   "reponse": "0.8",
   "valeur": 0.8,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "stats-pca-taux",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Tu fais une ACP des variations quotidiennes de la courbe des taux (2 à 30 ans). Que trouves-tu, et à quoi ça sert ?",
   "solution": "Trois facteurs expliquent la quasi-totalité de la variance (souvent plus de 95 %) :\n1. **niveau** : tous les taux bougent ensemble ;\n2. **pente** : courts et longs en sens opposés ;\n3. **courbure** : le milieu de la courbe contre les extrémités.\nUsages : réduire la dimension pour la gestion du risque (couvrir le niveau et la pente), construire des stratégies de valeur relative (papillons neutres en niveau et pente), simuler des scénarios cohérents.\nPrécautions : faire l'ACP sur des variations (stationnaires), pas sur des niveaux ; vecteurs propres instables dans le temps ; signe arbitraire.",
   "en": "You run a PCA on daily changes of the yield curve (2y to 30y). What do you find and what is it used for?"
  },
  {
   "id": "stats-colinearite",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Deux variables explicatives sont corrélées à 0,98. Qu'arrive-t-il à ta régression, et que fais-tu ?",
   "solution": "Les coefficients deviennent instables : grandes variances, signes qui changent d'un échantillon à l'autre, coefficients individuellement non significatifs alors que le modèle l'est globalement. La prévision reste correcte tant que la colinéarité persiste.\nRemèdes : retirer ou combiner les variables (leur somme, leur différence), régularisation Ridge (qui stabilise exactement ce cas), ACP, ou accepter l'instabilité si seule la prévision compte. Diagnostic : facteur d'inflation de la variance VIF $= 1/(1 - R^{2}_j) \\approx 25$ ici.",
   "en": "Two regressors are 0.98 correlated. What happens to your regression and what do you do?"
  },
  {
   "id": "stats-correlation-rendements",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "La corrélation entre deux actions vaut 0,6 en rendements quotidiens et 0,2 en rendements mensuels. Comment est-ce possible ?",
   "solution": "Les corrélations dépendent de l'horizon. Causes possibles :\n- dynamiques différentes à long terme (une action suit le marché au jour le jour mais ses résultats propres dominent sur un mois) ;\n- autocorrélations et corrélations croisées décalées (retour à la moyenne relatif, l'une réagit avec retard à l'autre) ;\n- effets de microstructure à haute fréquence (bruit de fixing, asynchronie des cours, effet Epps : corrélation plus faible à très haute fréquence) ;\n- simple bruit d'estimation : peu de points mensuels, intervalle de confiance large.\nConséquence pratique : estime la corrélation à l'horizon de détention de ta stratégie.",
   "en": "Two stocks have 0.6 correlation in daily returns but 0.2 in monthly returns. How is that possible?"
  },
  {
   "id": "stats-bootstrap",
   "theme": "stats",
   "niveau": 2,
   "profils": [
    "hf",
    "data",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que le bootstrap ? Pourquoi utilises-tu un bootstrap par blocs pour un Sharpe dans ton projet stat arb ?",
   "solution": "Bootstrap : on rééchantillonne avec remise les données observées pour approcher la loi d'un estimateur (écart-type, intervalle de confiance) sans hypothèse de loi.\nLe bootstrap simple suppose les observations indépendantes. Les rendements d'une stratégie sont autocorrélés (positions tenues plusieurs jours, régimes de volatilité) : tirer des jours isolés casse cette dépendance et donne des intervalles trop étroits. Le **bootstrap par blocs** tire des blocs de jours consécutifs, ce qui préserve la dépendance à court terme. Choix de la longueur de bloc : de l'ordre de la mémoire de la série (quelques jours à quelques semaines).",
   "en": "What is the bootstrap? Why use a block bootstrap for a Sharpe ratio?"
  },
  {
   "id": "stats-sharpe-deflate",
   "theme": "stats",
   "niveau": 3,
   "profils": [
    "hf",
    "data"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que le Sharpe déflaté et pourquoi l'as-tu utilisé ?",
   "solution": "Quand on essaie $N$ variantes et qu'on garde la meilleure, son Sharpe est biaisé vers le haut : même sans aucun effet, le maximum de $N$ Sharpe estimés est positif. Le Sharpe déflaté (Bailey et López de Prado) calcule la probabilité que le vrai Sharpe soit positif en comparant le Sharpe observé au maximum attendu sous l'hypothèse nulle pour $N$ essais, et en tenant compte de la longueur de l'échantillon, de l'asymétrie et de l'aplatissement des rendements.\nDans ton projet, le réglage final a été choisi après un premier essai raté : le compter comme 10 essais est une façon honnête de reconnaître ce choix. Limite : le nombre « effectif » d'essais est difficile à connaître.",
   "en": "What is the deflated Sharpe ratio and why did you use it?",
   "relances": [
    "Ordre de grandeur du maximum de $N$ Sharpe nuls ? ($\\approx \\sqrt{2 \\ln N} \\times$ écart-type de l'estimateur)"
   ]
  },
  {
   "id": "stoch-definition-brownien",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Donne la définition d'un mouvement brownien standard et trois de ses propriétés.",
   "solution": "$W$ est un mouvement brownien standard si :\n- $W_{0} = 0$ ;\n- ses accroissements sont indépendants : $W_t - W_s$ est indépendant de $(W_u)_{u \\le s}$ ;\n- ses accroissements sont gaussiens et stationnaires : $W_t - W_s \\sim N(0, t - s)$ ;\n- ses trajectoires sont continues.\n\nPropriétés utiles en entretien : c'est une martingale ; ses trajectoires ne sont nulle part dérivables ; sa variation quadratique sur [$0, t$] vaut $t$ ; $\\operatorname{Cov} (W_s, W_t) = \\min (s, t)$ ; il est invariant par changement d'échelle ($c^{-1/2} \\cdot W_{ct}$ est encore un brownien) ; il est markovien.",
   "en": "Define a standard Brownian motion and give three of its properties.",
   "relances": [
    "Pourquoi ses trajectoires ne sont-elles pas dérivables ? (les accroissements sont d'ordre $\\sqrt{dt}$, donc $(W_{t+h} - W_t)/h \\sim h^{-1/2}$ explose)",
    "$W_t^{2}$ est-il une martingale ? (non : $W_t^{2} - t$ l'est)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-covariance",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "$W$ est un mouvement brownien standard. Que vaut $\\mathbb{E}[W_{2} \\cdot W_{5}]$ ?",
   "solution": "Écris $W_{5} = W_{2} + (W_{5} - W_{2})$ avec un accroissement indépendant de $W_{2}$ et centré : $\\mathbb{E}[W_{2}W_{5}] = \\mathbb{E}[W_{2}^{2}] + 0 =$ **2** $= \\min (2, 5)$.",
   "en": "$W$ is a standard Brownian motion. What is $\\mathbb{E}[W_{2} W_{5}]$?",
   "relances": [
    "Corrélation entre $W_{2}$ et $W_{5}$ ? ($2/\\sqrt{10} \\approx 0{,}63$ ; en général $\\sqrt{s/t}$)"
   ],
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "stoch-moment-quatre",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut $\\mathbb{E}[W_{2}^{4}]$ pour un mouvement brownien standard ?",
   "solution": "$W_{2} \\sim N(0, 2)$ et pour une gaussienne centrée de variance $\\sigma^{2}, \\mathbb{E}[X^{4}] = 3\\sigma^{4}$. Donc **$3 \\times 4 = 12$**.",
   "en": "Compute $\\mathbb{E}[W_{2}^{4}]$ for a standard Brownian motion.",
   "relances": [
    "Kurtosis d'une gaussienne ? (3) ; kurtosis en excès ? (0)",
    "Comment retrouver $3\\sigma^{4}$ avec Itô ? ($d(W^{4}) = 4W^{3}dW + 6W^{2}dt$, donc $\\mathbb{E}[W_t^{4}] = 6 \\int_0^t s\\, ds = 3t^{2}$)"
   ],
   "reponse": "12",
   "valeur": 12.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "stoch-ito-carre",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Calcule $d(W_t^{2})$ avec le lemme d'Itô. Pourquoi y a-t-il un terme de plus qu'en calcul classique ?",
   "solution": "Lemme d'Itô pour $f(W)$ : $df = f'(W) dW + \\tfrac12 f''(W) dt$. Avec $f(x) = x^{2}$ : **$d(W^{2}) = 2W dW + dt$**.\nLe terme $dt$ vient de la variation quadratique : $(dW)^{2} = dt$, qui n'est pas négligeable contrairement à $(dx)^{2}$ en calcul classique.\nConséquence : $W_t^{2} - t$ est une martingale, et $\\mathbb{E}[W_t^{2}] = t$.",
   "en": "Compute $d(W_t^{2})$ using Itô's lemma. Why is there an extra term compared to ordinary calculus?",
   "relances": [
    "Énonce le lemme d'Itô pour $f(t, X_t)$ avec $dX = \\mu dt + \\sigma dW$. ($df = (f_t + \\mu f_x + \\tfrac12 \\sigma^{2} f_{xx}) dt + \\sigma f_x dW$)",
    "$d(e^{W_t})$ ? ($e^W dW + \\tfrac12 e^W dt$)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-integrale-w-dw",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Que vaut l'intégrale d'Itô $\\int_{0}^{T} W_t dW_t$ ?",
   "solution": "D'après $d(W^{2}) = 2W dW + dt$, en intégrant : $W_T^{2} = 2 \\int_{0}^{T} W dW + T$, donc **$\\int_{0}^{T} W dW = (W_T^{2} - T)/2$**.\nC'est une martingale d'espérance nulle (contrairement à $W_T^{2}/2$ du calcul classique).",
   "en": "Compute the Itô integral $\\int_{0}^{T} W_t dW_t$.",
   "indice": "Utilise le résultat de $d(W^{2})$.",
   "piege": "Répondre $W_T^{2}/2$ : c'est l'intégrale de Stratonovich, pas celle d'Itô.",
   "relances": [
    "Pourquoi l'intégrale d'Itô d'un processus adapté est-elle une martingale ? (on évalue l'intégrande au début de chaque pas : pas d'anticipation)",
    "Variance de $\\int_{0}^{T} W dW$ ? (isométrie d'Itô : $\\int_{0}^{T} t dt = T^{2}/2$)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-isometrie",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut la variance de $\\int_{0}^{1} t dW_t$ ?",
   "solution": "Isométrie d'Itô : $\\mathbb{E}[(\\int_{0}^{1} t dW_t)^{2}] = \\int_{0}^{1} t^{2} dt =$ **$1/3$**. L'intégrale est gaussienne centrée de variance $1/3$.",
   "en": "What is the variance of $\\int_{0}^{1} t dW_t$?",
   "relances": [
    "Que vaut $\\int_{0}^{1} t dW_t$ en fonction de $W$ ? (par parties : $W_{1} - \\int_{0}^{1} W_t dt$)"
   ],
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "stoch-integrale-temps",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Quelle est la variance de $X = \\int_{0}^{1} W_t dt$ (l'aire sous une trajectoire brownienne) ?",
   "solution": "$\\operatorname{Var} (X) = \\int_{0}^{1} \\int_{0}^{1} \\min (s, t) ds dt = 2 \\int_{0}^{1} \\int_{0}^{t} s ds dt = 2 \\int_{0}^{1} t^{2}/2 dt =$ **$1/3$**. Plus généralement, $\\int_{0}^{T} W dt \\sim N(0, T^{3}/3)$.",
   "en": "What is the variance of $X = \\int_{0}^{1} W_t dt$?",
   "indice": "$\\operatorname{Var} (X) = \\int \\int \\operatorname{Cov} (W_s, W_t) ds dt$.",
   "relances": [
    "Lien avec les options asiatiques ? (la moyenne arithmétique est moins volatile que le sous-jacent final : l'option asiatique coûte moins cher)"
   ],
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "stoch-gbm",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Résous l'équation $dS_t = \\mu S_t dt + \\sigma S_t dW_t$ (mouvement brownien géométrique).",
   "solution": "$d(\\ln S) = dS/S - \\tfrac12 (dS)^{2}/S^{2} = (\\mu - \\sigma^{2}/2) dt + \\sigma dW$.\nDonc **$S_t = S_{0} \\exp ((\\mu - \\sigma^{2}/2)t + \\sigma W_t)$**.\n$S_t$ est log-normal ; $\\mathbb{E}[S_t] = S_{0}e^{\\mu t}$ ; sa médiane vaut $S_{0}e^{(\\mu - \\sigma^{2}/2)t}$, plus basse que l'espérance.",
   "en": "Solve the SDE $dS = \\mu S dt + \\sigma S dW$ (geometric Brownian motion).",
   "indice": "Applique Itô à $\\ln S_t$.",
   "relances": [
    "Pourquoi le terme $-\\sigma^{2}/2$ ? (convexité du logarithme : inégalité de Jensen)",
    "Variance de $S_t$ ? ($S_{0}^{2}e^{2\\mu t}(e^{\\sigma^{2}t} - 1)$)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-esperance-gbm",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "$S$ suit un brownien géométrique avec $S_{0} = 100, \\mu = 5\\,\\%$ et $\\sigma = 30\\,\\%$. Que vaut $\\mathbb{E}[S_{1}]$ ?",
   "solution": "$\\mathbb{E}[S_t] = S_{0}e^{\\mu t}$ ne dépend pas de $\\sigma$ : **$100 \\cdot e^{0{,}05} \\approx 105{,}13$**.",
   "en": "$S$ is a GBM with $S_{0} = 100, \\mu = 5\\,\\%, \\sigma = 30\\,\\%$. Compute $\\mathbb{E}[S_{1}]$.",
   "piege": "Ajouter $-\\sigma^{2}/2$ : ce terme concerne l'espérance de $\\ln S$, pas celle de $S$.",
   "reponse": "100*exp(0.05)",
   "valeur": 105.12710963760242,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "stoch-mediane-gbm",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Sans dérive $(\\mu = 0), \\sigma = 20\\,\\%, S_{0} = 100$. Quelle est la médiane de $S_{1}$ ?",
   "solution": "$\\ln S_{1} \\sim N(\\ln 100 - \\sigma^{2}/2, \\sigma^{2})$, de médiane $\\ln 100 - 0{,}02$. Médiane : **$100 \\cdot e^{-0{,}02} \\approx 98{,}02$**, alors que l'espérance vaut 100.",
   "en": "GBM with zero drift, $\\sigma = 20\\,\\%, S_{0} = 100$. What is the median of $S_{1}$?",
   "relances": [
    "Que se passe-t-il quand $T \\to \\infty$ ? ($S_T \\to 0$ presque sûrement alors que $\\mathbb{E}[S_T] = 100$ : l'espérance est portée par des trajectoires de plus en plus rares)"
   ],
   "reponse": "100*exp(-0.02)",
   "valeur": 98.01986733067552,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "stoch-proba-au-dessus",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Brownien géométrique sans dérive, $\\sigma = 20\\,\\%, S_{0} = 100$. Probabilité que $S_{1} > 100$ ? ($N(0{,}1) = 0{,}5$ ; $N(0{,}1)$ en $0{,}1 \\approx 0{,}540$)",
   "solution": "$S_{1} > 100 \\Leftrightarrow -\\sigma^{2}/2 + \\sigma W_{1} > 0 \\Leftrightarrow W_{1} > \\sigma /2 = 0{,}1$. Probabilité **$1 - \\Phi (0{,}1) \\approx 0{,}460$**.\nL'espérance reste 100 mais la loi est asymétrique : beaucoup de petites baisses, quelques fortes hausses.",
   "en": "Driftless GBM, $\\sigma = 20\\,\\%, S_{0} = 100$. What is $\\mathbb{P}(S_{1} > 100)$? ($\\Phi (0.1) \\approx 0.540$)",
   "relances": [
    "C'est quoi, en pricing ? ($N(d_{2})$ d'un call à la monnaie avec $r = 0$ : la probabilité risque-neutre d'exercice)"
   ],
   "reponse": "1-N(0.1)",
   "valeur": 0.460172162722971,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "stoch-martingale-exponentielle",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Montre que $M_t = \\exp (\\theta W_t - \\theta^{2}t/2)$ est une martingale. À quoi sert-elle ?",
   "solution": "Par Itô : $dM = M(\\theta dW - \\theta^{2}/2 dt) + \\tfrac12 M \\theta^{2} dt = \\theta M dW$. Pas de terme en $dt$ : $M$ est une martingale locale, et une vraie martingale ($\\mathbb{E}[M_t] = 1$ en calculant $\\mathbb{E}[e^{\\theta W_t}] = e^{\\theta^{2}t/2}$).\nUsages : changement de probabilité de Girsanov ($M$ est la densité qui ajoute une dérive $\\theta$ au brownien) ; calcul de lois de temps d'atteinte (transformée de Laplace de $\\tau_a$ : $\\mathbb{E}[e^{-\\lambda \\tau_a}] = e^{-a\\sqrt{2\\lambda}}$).",
   "en": "Show that $M_t = \\exp (\\theta W_t - \\theta^{2}t/2)$ is a martingale. What is it used for?",
   "relances": [
    "Énonce Girsanov simplement. (sous $Q$ définie par $dQ/dP = M_T, W_t - \\theta t$ est un brownien)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-sortie-intervalle",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Un brownien standard part de 0. Probabilité qu'il atteigne $+1$ avant $-2$ ?",
   "solution": "$W$ est une martingale ; au temps d'arrêt $\\tau$ (sortie de ]$-2$, 1[) : $0 = \\mathbb{E}[W_\\tau] = 1 \\cdot p - 2(1 - p)$, donc **$p = 2/3$**. C'est la ruine du joueur en continu : $b/(a + b)$ avec $a = 1, b = 2$.",
   "en": "A standard Brownian motion starts at 0. What is the probability it hits $+1$ before $-2$?",
   "relances": [
    "Temps moyen de sortie ? (ab $= 2$, via $W^{2} - t$)",
    "Et avec une dérive $\\mu$ ? (utiliser la martingale $\\exp (-2\\mu W)$)"
   ],
   "reponse": "2/3",
   "valeur": 0.6666666666666666,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "stoch-temps-sortie",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Un brownien standard part de 0. Combien de temps faut-il en moyenne pour qu'il sorte de l'intervalle ]$-2$, 1[ ?",
   "solution": "$W_t^{2} - t$ est une martingale : $\\mathbb{E}[\\tau] = \\mathbb{E}[W_\\tau^{2}] = (2/3) \\cdot 1 + (1/3) \\cdot 4 =$ **2** $= a \\cdot b$.",
   "en": "Expected time for a standard Brownian motion started at 0 to exit ($-2$, 1)?",
   "relances": [
    "Et le temps pour atteindre $+1$ sans borne basse ? (fini presque sûrement mais d'espérance infinie)"
   ],
   "reponse": "2",
   "valeur": 2.0,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "stoch-reflexion",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Probabilité qu'un brownien standard dépasse le niveau 1 au moins une fois avant la date 1 ? ($\\Phi (1) \\approx 0{,}841$)",
   "solution": "$\\mathbb{P}(\\max_{[0{,}1]} W \\ge 1) = 2 \\cdot \\mathbb{P}(W_{1} \\ge 1) = 2(1 - \\Phi (1)) \\approx$ **0,317**.\nApplication : prix d'options à barrière, et probabilité qu'un stop soit touché.",
   "en": "Probability that a standard Brownian motion exceeds level 1 at some time before $t = 1$? ($\\Phi (1) \\approx 0.841$)",
   "indice": "Principe de réflexion : après avoir touché 1, la trajectoire symétrisée est aussi probable.",
   "relances": [
    "Loi du maximum $M_{1}$ ? (même loi que $|W_{1}|$)",
    "En temps discret (observations quotidiennes), la probabilité est-elle plus petite ou plus grande ? (plus petite : on rate des franchissements ; correction de Broadie-Glasserman, barrière décalée de $0{,}5826 \\cdot \\sigma \\sqrt{\\Delta}t$)"
   ],
   "reponse": "2*(1-N(1))",
   "valeur": 0.31731050786291415,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "stoch-variation-quadratique",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que la variation quadratique d'un processus ? Que vaut-elle pour un brownien, et pourquoi dit-on que « $dW^{2} = dt$ » ?",
   "solution": "$[X]_t =$ limite de $\\sum (X_{t_{i+1}} - X_{t_i})^{2}$ quand le pas de la subdivision tend vers 0.\nPour le brownien : chaque terme a pour espérance $\\Delta t$ et pour variance $2\\Delta t^{2}$ ; la somme a pour espérance $t$ et pour variance $2\\sum \\Delta t^{2} \\to 0$. Donc **$[W]_t = t$**, de façon déterministe.\nC'est ce que résume la règle $dW \\cdot dW = dt$ (et $dt \\cdot dW = dt \\cdot dt = 0$). Une fonction dérivable a une variation quadratique nulle.\nEn finance : la variance réalisée estime la variation quadratique du log-prix, $\\int \\sigma_t^{2} dt$.",
   "en": "What is quadratic variation? What is it for Brownian motion, and why do we write $dW^{2} = dt$?",
   "relances": [
    "Variation quadratique de $\\int \\sigma_s dW_s$ ? ($\\int \\sigma_s^{2} ds$)",
    "Que vaut la variation totale ($\\sum |\\Delta W|$) du brownien ? (infinie)"
   ]
  },
  {
   "id": "stoch-w-cube",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "$W_t^{3}$ est-il une martingale ? Sinon, comment la corriger ?",
   "solution": "Itô : $d(W^{3}) = 3W^{2} dW + 3W dt$. Le terme $3W dt$ n'est pas nul, donc $W^{3}$ n'est pas une martingale (même si $\\mathbb{E}[W_t^{3}] = 0$ pour tout $t$).\nCorrection : $d(tW) = W dt + t dW$, donc **$W_t^{3} - 3tW_t$** est une martingale (c'est un polynôme d'Hermite).",
   "en": "Is $W_t^{3} a$ martingale? If not, how do you fix it?",
   "piege": "« $\\mathbb{E}[W_t^{3}] = 0$ pour tout $t$ donc c'est une martingale » : une espérance constante ne suffit pas, il faut $\\mathbb{E}[X_t | F_s] = X_s$."
  },
  {
   "id": "stoch-ornstein-uhlenbeck",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Écris le processus d'Ornstein-Uhlenbeck, sa moyenne, sa variance stationnaire et sa demi-vie. Où l'as-tu utilisé ?",
   "solution": "$dX = \\kappa (\\theta - X) dt + \\sigma dW$. Solution : $X_t = \\theta + (X_{0} - \\theta)e^{-\\kappa t} + \\sigma \\int_{0}^{t} e^{-\\kappa (t-s)} dW_s$.\n- $\\mathbb{E}[X_t] = \\theta + (X_{0} - \\theta)e^{-\\kappa t}$ ;\n- $\\operatorname{Var} (X_t) = \\sigma^{2}(1 - e^{-2\\kappa t})/(2\\kappa) \\to$ **$\\sigma^{2}/(2\\kappa)$** ;\n- demi-vie de l'écart à la moyenne : **$\\ln 2/\\kappa$**.\nDiscrétisé au pas $\\Delta$, c'est un AR(1) : $X_{t+1} = c + \\varphi X_t + \\varepsilon$ avec $\\varphi = e^{-\\kappa \\Delta}$. Dans ton projet stat arb, le spread est simulé comme un OU de demi-vie 8 jours, et la demi-vie estimée vient de la régression AR(1) du spread : demi-vie $= -\\ln 2/\\ln \\varphi$.\nUsages : spreads de paires, taux courts (Vasicek), volatilité (log-vol en OU).",
   "en": "Write the Ornstein-Uhlenbeck process, its mean, stationary variance and half-life. Where have you used it?",
   "relances": [
    "Avec $\\kappa = 0{,}1$ par jour, demi-vie ? (6,9 jours)",
    "Comment estimer $\\kappa$ à partir de données quotidiennes ? (régression de $\\Delta X$ sur $X$ : pente $-(1 - \\varphi)$)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-demi-vie",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "hf",
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Un spread suit un processus d'Ornstein-Uhlenbeck de vitesse de retour $\\kappa = 0{,}1$ par jour. Quelle est sa demi-vie, en jours ?",
   "solution": "L'écart à la moyenne décroît en $e^{-\\kappa t}$ : demi-vie $= \\ln 2 / \\kappa = 0{,}693/0{,}1 \\approx$ **6,93 jours**.",
   "en": "A spread follows an OU process with mean-reversion speed $\\kappa = 0.1$ per day. What is its half-life in days?",
   "relances": [
    "Si la régression AR(1) quotidienne donne $\\varphi = 0{,}9$, demi-vie ? ($-\\ln 2/\\ln 0{,}9 \\approx 6{,}58$ jours)"
   ],
   "reponse": "ln(2)/0.1",
   "valeur": 6.931471805599452,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "stoch-ito-stratonovich",
   "theme": "stoch",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Quelle est la différence entre les intégrales d'Itô et de Stratonovich ? Pourquoi la finance utilise-t-elle Itô ?",
   "solution": "Les deux sont des limites de sommes de Riemann $\\sum H(\\tau_i)(W_{t_{i+1}} - W_{t_i})$ ; Itô évalue $H$ au début de l'intervalle ($\\tau_i = t_i$), Stratonovich au milieu. Pour un brownien, le choix change la limite à cause de la variation quadratique : $\\int W$ ∘ $dW = W_T^{2}/2$ (Stratonovich) contre $(W_T^{2} - T)/2$ (Itô).\n- Itô : l'intégrande ne regarde pas le futur (une stratégie de trading décide avant de connaître le mouvement), l'intégrale est une martingale. C'est le bon modèle pour un gain de trading.\n- Stratonovich : la règle de dérivation classique s'applique, utile en physique et pour certaines méthodes numériques.\nConversion : $\\int H$ ∘ $dW = \\int H dW + \\tfrac12 [H, W]$.",
   "en": "What is the difference between Itô and Stratonovich integrals? Why does finance use Itô?"
  },
  {
   "id": "stoch-girsanov",
   "theme": "stoch",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Explique le théorème de Girsanov et son rôle dans le passage à la probabilité risque-neutre.",
   "solution": "Si $W$ est un brownien sous $P$ et $\\theta$ un processus adapté (assez régulier), alors sous $Q$ définie par $dQ/dP = \\exp (- \\int \\theta dW - \\tfrac12 \\int \\theta^{2} dt)$, le processus $W$̃$_t = W_t + \\int_{0}^{t} \\theta_s ds$ est un brownien.\nEn finance : $dS = \\mu S dt + \\sigma S dW$. Avec $\\theta = (\\mu - r)/\\sigma$ (prix de marché du risque), $dS = rS\\, dt + \\sigma S\\, d\\tilde{W}$ sous $Q$ : l'actif actualisé devient une martingale. Les prix sont alors des espérances sous $Q$ des flux actualisés, et la dérive réelle $\\mu$ disparaît.\nGirsanov ne change que la dérive, jamais la volatilité : la volatilité se mesure sous $P$ (variation quadratique), la dérive non.",
   "en": "Explain Girsanov's theorem and its role in moving to the risk-neutral measure.",
   "relances": [
    "Pourquoi la volatilité est-elle la même sous $P$ et $Q$ ? (la variation quadratique est une propriété des trajectoires, et $P$ et $Q$ sont équivalentes)",
    "Qu'est-ce que la mesure forward-neutre ? (numéraire = zéro-coupon de maturité $T$ : le forward devient une martingale)"
   ],
   "essentiel": true
  },
  {
   "id": "stoch-feynman-kac",
   "theme": "stoch",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que la formule de Feynman-Kac ? Donne l'exemple de Black-Scholes.",
   "solution": "Elle relie une EDP parabolique à une espérance. Si $dX = \\mu (t, X) dt + \\sigma (t, X) dW$ et que $u$ résout\n$\\partial u/ \\partial t + \\mu \\partial u/ \\partial x + \\tfrac12 \\sigma^{2} \\partial^{2}u/ \\partial x^{2} - r u = 0$, avec $u(T, x) = g(x)$,\nalors $u(t, x) = \\mathbb{E}[e^{-r(T-t)} g(X_T) | X_t = x]$.\nBlack-Scholes : avec $dS = rS dt + \\sigma S dW$ sous $Q$, le prix $V(t, S) = E^Q[e^{-r(T-t)}(S_T - K)^{+}]$ résout l'EDP de Black-Scholes. On peut donc pricer par Monte-Carlo (l'espérance) ou par différences finies (l'EDP).",
   "en": "What is the Feynman-Kac formula? Give the Black-Scholes example.",
   "relances": [
    "Quand préfères-tu l'EDP, quand le Monte-Carlo ? (EDP : faible dimension, Greeks lisses, options américaines ; Monte-Carlo : grande dimension, dépendance au chemin)"
   ]
  },
  {
   "id": "stoch-discretisation-euler",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Comment simules-tu une EDS $dX = a(X) dt + b(X) dW$ ? Quelle est la précision du schéma d'Euler ?",
   "solution": "Schéma d'Euler-Maruyama : $X_{n+1} = X_n + a(X_n)\\Delta t + b(X_n)\\sqrt{\\Delta}t \\cdot Z_n, Z_n \\sim N(0, 1)$ indépendantes.\n- Convergence **forte** (trajectoire par trajectoire) en $\\sqrt{\\Delta}t$ ; convergence **faible** (espérances) en $\\Delta t$.\n- Le schéma de Milstein ajoute $\\tfrac12 b b'(\\Delta W^{2} - \\Delta t)$ et atteint l'ordre fort 1.\n- Pour un brownien géométrique, simuler le logarithme est exact : $S_{n+1} = S_n \\exp ((\\mu - \\sigma^{2}/2)\\Delta t + \\sigma \\sqrt{\\Delta}t Z)$.\nPièges : variance négative avec Euler sur Heston (troncature ou schéma QE d'Andersen), coût en $1/\\varepsilon^{3}$ pour une erreur $\\varepsilon$ (Monte-Carlo + biais), d'où le multi-niveaux (MLMC).",
   "en": "How do you simulate an SDE $dX = a(X) dt + b(X) dW$? What is the accuracy of the Euler scheme?",
   "relances": [
    "Combien de trajectoires pour diviser l'erreur Monte-Carlo par 10 ? (100 fois plus)"
   ]
  },
  {
   "id": "stoch-esperance-exponentielle",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "$W$ est un mouvement brownien standard. Que vaut $\\mathbb{E}[e^{W_{2}}]$ ?",
   "solution": "Pour $X \\sim N(0, \\sigma^{2}), \\mathbb{E}[e^X] = e^{\\sigma^{2}/2}$. Ici $\\sigma^{2} = 2$ : **$e \\approx 2{,}718$**.\nC'est pour cela que $e^{W_t - t/2}$ est une martingale.",
   "en": "Compute $\\mathbb{E}[e^{W_{2}}]$ for a standard Brownian motion.",
   "reponse": "e",
   "valeur": 2.718281828459045,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "stoch-deux-instants-positifs",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Probabilité qu'un brownien standard soit positif à la fois en $t = 1$ et en $t = 2$ ?",
   "solution": "$\\operatorname{corr} (W_{1}, W_{2}) = 1/\\sqrt{2}$. $P = 1/4 + \\arcsin(1/\\sqrt{2})/(2\\pi) = 1/4 + (\\pi /4)/(2\\pi) =$ **$3/8$**.\nAutre méthode : $\\mathbb{P}(W_{1} > 0, W_{2} - W_{1} > -W_{1}) = \\mathbb{E}[1{W_{1}>0} \\Phi (W_{1})] = 3/8$.",
   "en": "Probability that a standard Brownian motion is positive at both $t = 1$ and $t = 2$?",
   "indice": "$\\operatorname{corr} (W_{1}, W_{2}) = \\sqrt{1/2}$ ; formule des quadrants pour un couple gaussien.",
   "reponse": "3/8",
   "valeur": 0.375,
   "tolerance": 0.005,
   "duree": 240
  },
  {
   "id": "stoch-pont-esperance",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "On sait que $W_{4} = 2$. Que vaut $\\mathbb{E}[W_{1} | W_{4} = 2]$ ?",
   "solution": "Pont brownien : $\\mathbb{E}[W_s | W_t = x] =$ (s/t)$\\cdot x = (1/4) \\times 2 =$ **0,5**. Interpolation linéaire entre 0 et la valeur connue.",
   "en": "Given $W_{4} = 2$, what is $\\mathbb{E}[W_{1} | W_{4} = 2]$?",
   "relances": [
    "Variance conditionnelle ? ($s(t - s)/t = 3/4$)",
    "Usage en Monte-Carlo ? (construire une trajectoire en raffinant par ponts browniens, ce qui améliore le quasi-Monte-Carlo ; corriger les franchissements de barrière entre deux dates)"
   ],
   "reponse": "0.5",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "stoch-pont-variance",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut $\\operatorname{Var} (W_{1} | W_{4})$ ?",
   "solution": "$s(t - s)/t = 1 \\times 3/4 =$ **0,75**, quelle que soit la valeur de $W_{4}$. L'incertitude est maximale au milieu de l'intervalle ($s = t/2$).",
   "en": "What is $\\operatorname{Var} (W_{1} | W_{4})$?",
   "reponse": "0.75",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "stoch-integrale-carre",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut $\\mathbb{E}[\\int_{0}^{1} W_t^{2} dt]$ ?",
   "solution": "Fubini : $\\int_{0}^{1} \\mathbb{E}[W_t^{2}] dt = \\int_{0}^{1} t dt =$ **$1/2$**.",
   "en": "Compute $\\mathbb{E}[\\int_{0}^{1} W_t^{2} dt]$.",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "stoch-variance-somme",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Que vaut $\\operatorname{Var} (W_{1} + W_{2})$ ?",
   "solution": "$\\operatorname{Var} (W_{1}) + \\operatorname{Var} (W_{2}) + 2\\operatorname{Cov} (W_{1}, W_{2}) = 1 + 2 + 2 \\times 1 =$ **5**. Ou : $W_{1} + W_{2} = 2W_{1} + (W_{2} - W_{1})$, variance $4 + 1$.",
   "en": "What is $\\operatorname{Var} (W_{1} + W_{2})$?",
   "piege": "Oublier la covariance (répondre 3).",
   "reponse": "5",
   "valeur": 5.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "stoch-covariance-carre",
   "theme": "stoch",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Que vaut $\\operatorname{Cov} (W_t, W_t^{2})$ ?",
   "solution": "$\\mathbb{E}[W_t^{3}] - \\mathbb{E}[W_t]\\mathbb{E}[W_t^{2}] = 0 - 0 =$ **0** (moment impair d'une gaussienne centrée). $W_t$ et $W_t^{2}$ sont pourtant fortement dépendants : covariance nulle ne veut pas dire indépendance.",
   "en": "What is $\\operatorname{Cov} (W_t, W_t^{2})$?",
   "reponse": "0",
   "valeur": 0.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "stoch-temps-atteinte",
   "theme": "stoch",
   "niveau": 3,
   "profils": [
    "banque",
    "risque",
    "hf",
    "mm"
   ],
   "type": "ouverte",
   "question": "Soit $\\tau$ le premier instant où un brownien standard atteint 1. $\\tau$ est-il fini ? Quelle est son espérance ? Sa loi ?",
   "solution": "- $\\tau$ est fini presque sûrement (le brownien en dimension 1 est récurrent).\n- Mais **$\\mathbb{E}[\\tau] = + \\infty$** : sinon, par le théorème d'arrêt, $\\mathbb{E}[W_\\tau] = 1$ serait égal à $\\mathbb{E}[W_{0}] = 0$.\n- Par le principe de réflexion : $\\mathbb{P}(\\tau \\le t) = \\mathbb{P}(\\max_{[0,t]} W \\ge 1) = 2(1 - \\Phi (1/\\sqrt{t}))$. Densité $\\sim t^{-3/2}$ pour $t$ grand : queue lourde (loi de Lévy).\n- Transformée de Laplace : $\\mathbb{E}[e^{-\\lambda \\tau}] = e^{-\\sqrt{2\\lambda}}$.",
   "en": "Let $\\tau$ be the first time a standard Brownian motion hits 1. Is $\\tau$ finite? What is its expectation? Its distribution?",
   "relances": [
    "Avec une dérive $\\mu > 0$ ? ($\\mathbb{E}[\\tau] = 1/\\mu$)"
   ]
  },
  {
   "id": "stoch-ito-produit",
   "theme": "stoch",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Calcule $d(X_t Y_t)$ pour deux processus d'Itô. Application : $d(t \\cdot W_t)$ et $d(S_t/B_t)$ avec $B_t = e^{rt}$.",
   "solution": "Formule du produit : **$d$(XY) $= X dY + Y dX + d \\langle X, Y \\rangle$**.\n- $d(tW_t) = t dW + W dt$ ($t$ est déterministe : pas de covariation).\n- $S$ actualisé : $d(S/B) = (1/B) dS - (rS/B) dt = (S/B)[(\\mu - r) dt + \\sigma dW]$. Sous la probabilité risque-neutre ($\\mu$ remplacé par $r$), le terme en $dt$ disparaît : l'actif actualisé est une martingale.",
   "en": "Compute $d(X_t Y_t)$ for two Itô processes. Apply to $d(tW_t)$ and $d(S_t/B_t)$ with $B_t = e^{rt}$."
  },
  {
   "id": "struct-capital-garanti",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "numerique",
   "question": "On construit un produit à capital garanti à 5 ans sur un indice. Un zéro-coupon qui rembourse 100 dans 5 ans coûte 90. Un call à la monnaie à 5 ans sur l'indice coûte 20 % du nominal. Pour 100 investis, quel taux de participation à la hausse peut-on offrir (sans marge) ?",
   "solution": "On achète le zéro-coupon (90) pour garantir le capital ; il reste 10 pour acheter des calls à 20 chacun (en % du nominal) : participation $= 10/20 =$ **50 %** de la hausse de l'indice.\nLeviers pour améliorer la participation : taux plus élevés (zéro-coupon moins cher), maturité plus longue, plafonner la hausse (call spread), moyenne asiatique (call moins cher), capital garanti partiel. La marge de la banque se prend sur ces 10.",
   "en": "A 5-year capital-guaranteed note on an index: a zero-coupon paying 100 in 5 years costs 90, a 5-year ATM call costs 20% of notional. For 100 invested, what upside participation can be offered (no margin)?",
   "relances": [
    "Pourquoi ces produits étaient-ils difficiles à construire quand les taux étaient nuls ou négatifs ? (le zéro-coupon coûte presque 100 : il ne reste rien pour l'option)"
   ],
   "reponse": "(100-90)/20",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 150
  },
  {
   "id": "struct-reverse-convertible",
   "theme": "derives",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un reverse convertible ? Pourquoi paie-t-il un coupon élevé ?",
   "solution": "Une obligation courte qui paie un coupon élevé ; à l'échéance, si l'action sous-jacente a baissé sous un niveau (souvent le strike, ou une barrière), l'investisseur est remboursé en actions (ou en cash équivalent) au lieu du nominal.\nDécomposition : **obligation + vente d'un put** (éventuellement down-and-in). Le coupon élevé = intérêt de l'obligation + prime du put vendu. L'investisseur est vendeur de volatilité et porte le risque de baisse ; le coupon est d'autant plus élevé que la volatilité implicite est haute.",
   "en": "What is a reverse convertible? Why does it pay a high coupon?",
   "relances": [
    "Qui est long volatilité dans l'opération ? (la banque, qui a acheté le put à l'investisseur, et se couvre en delta)"
   ]
  },
  {
   "id": "struct-autocall",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Explique le fonctionnement d'un autocall et ses principaux risques pour la banque qui le vend.",
   "solution": "À chaque date d'observation (par exemple annuelle), si le sous-jacent est au-dessus de son niveau initial (barrière de rappel), le produit est remboursé par anticipation avec un coupon (souvent cumulatif). Sinon il continue. À l'échéance, si le sous-jacent n'a jamais été rappelé et termine sous une barrière de protection (par exemple $-40\\,\\%$), l'investisseur subit la baisse : il a vendu un **put down-and-in**.\nPour l'investisseur : coupon attrayant en marché stable ou modérément haussier, risque de perte en capital en cas de forte baisse. Pour la banque :\n- gestion des **barrières** (gamma et vega très concentrés près des barrières et des dates d'observation) ;\n- sensibilité au **skew** et à la **volatilité future** (durée de vie aléatoire) ;\n- risque de **dividendes** (la banque est souvent exposée aux dividendes futurs via sa couverture) ;\n- si plusieurs sous-jacents (worst-of) : risque de **corrélation** ;\n- concentration : toutes les banques ont des positions semblables, ce qui peut amplifier les mouvements de volatilité et de dividendes en crise (comme en 2020).",
   "en": "Explain how an autocallable works and its main risks for the issuing bank."
  },
  {
   "id": "struct-worst-of",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Comment la valeur d'un put sur le moins performant de plusieurs actions (worst-of) dépend-elle de leur corrélation ? Et celle d'un call worst-of ?",
   "solution": "Le moins bon de plusieurs actifs est d'autant plus bas que les actifs se dispersent, c'est-à-dire que leur corrélation est faible.\n- **Put worst-of** : il paie quand le moins bon est bas ; sa valeur **diminue quand la corrélation augmente** (moins de dispersion). Avec une corrélation de 1 et des actifs identiques, il vaut un put simple ; avec une corrélation faible, nettement plus.\n- **Call worst-of** : il faut que tous montent ; sa valeur **augmente avec la corrélation**.\nLes produits worst-of offrent donc des coupons plus élevés (l'investisseur vend un put worst-of, plus cher), en échange d'un risque accru. Pour la banque, la corrélation est un paramètre peu observable (peu d'instruments cotés), difficile à couvrir : un risque de modèle important.",
   "en": "How does the value of a worst-of put on several stocks depend on their correlation? And a worst-of call?",
   "relances": [
    "Comment estimer la corrélation implicite ? (à partir des options sur indice et des options sur ses composants : dispersion)"
   ]
  },
  {
   "id": "struct-dispersion",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "hf",
    "mm"
   ],
   "type": "numerique",
   "question": "Un indice équipondéré très diversifié a des composants de même volatilité implicite 30 %. La volatilité implicite de l'indice est de 15 %. Quelle corrélation implicite moyenne entre composants ? (Approximation pour un grand nombre de composants.)",
   "solution": "Pour $N$ grand, $\\sigma^{2}_\\text{indice} \\approx \\rho \\sigma^{2}$ (le risque spécifique se diversifie). $\\rho \\approx (15/30)^{2} =$ **0,25**.\nUn trade de **dispersion** vend la volatilité de l'indice et achète celle des composants (ou l'inverse) : c'est un pari sur l'écart entre corrélation implicite et corrélation réalisée. La corrélation implicite est en général au-dessus de la réalisée (prime de risque de corrélation).",
   "en": "A broad equally weighted index has components with 30% implied vol each, and the index implied vol is 15%. What average implied correlation? (Large-N approximation.)",
   "reponse": "(0.15/0.3)^2",
   "valeur": 0.25,
   "tolerance": 0.01,
   "duree": 300
  },
  {
   "id": "struct-cliquet",
   "theme": "derives",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'une option cliquet, et pourquoi son prix dépend-il beaucoup du modèle ?",
   "solution": "Une suite d'options à départ différé : chaque période (par exemple chaque mois), on regarde la performance de la période, souvent plafonnée et planchée localement (entre $-2\\,\\%$ et $+2\\,\\%$), puis on somme les performances, avec parfois un plancher global.\nSon prix dépend de la distribution des rendements **futurs** de chaque période, donc du **smile forward** (le smile qu'on observera dans le futur), qui n'est pas observable aujourd'hui. Volatilité locale et volatilité stochastique, calibrées sur les mêmes vanilles, donnent des prix très différents : les cliquets ont causé des pertes importantes à certaines banques au début des années 2000 et ont poussé à l'usage de modèles à volatilité stochastique.",
   "en": "What is a cliquet option and why is its price highly model-dependent?"
  },
  {
   "id": "struct-greques-barriere",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "mm"
   ],
   "type": "ouverte",
   "question": "Tu es long d'un put down-and-in de strike 100 et de barrière 70, à l'approche de l'échéance, le sous-jacent valant 71. Que dire de tes Greeks ?",
   "solution": "Juste au-dessus de la barrière, près de l'échéance : si le sous-jacent touche 70, tu reçois un put très dans la monnaie (valeur $\\approx 30$) ; sinon presque rien. La valeur saute donc d'environ 0 à 30 autour de 70 : **delta énorme** (très négatif), **gamma** et **vega** extrêmes et instables, qui changent de signe de part et d'autre de la barrière. La couverture en delta est impraticable (il faudrait vendre une quantité énorme d'actions juste au-dessus de 70). En pratique, les desks lissent la barrière (barrière décalée dans le sens conservateur, « barrier shift ») et facturent ce coût, et ils surveillent le risque de « pin » autour des barrières.",
   "en": "You are long a down-and-in put, strike 100, barrier 70, close to expiry, spot at 71. What about your Greeks?"
  },
  {
   "id": "struct-couverture-dividendes",
   "theme": "derives",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Pourquoi une banque qui vend beaucoup de produits structurés sur indices actions est-elle exposée aux dividendes futurs ? Comment se couvre-t-elle ?",
   "solution": "Le forward d'un indice baisse quand les dividendes attendus montent : $F \\approx S e^{rT} -$ dividendes capitalisés. Or la banque, en vendant des autocalls et des reverse convertibles, **achète des puts** aux investisseurs. Un put vaut plus quand le forward est bas, c'est-à-dire quand les dividendes attendus sont élevés : la banque est donc **longue des dividendes**. Si les dividendes futurs baissent, le forward monte et ses puts perdent de la valeur. Comme toutes les banques vendent des produits semblables, cette exposition est concentrée et pèse sur le prix des dividendes futurs.\nCouverture : **futures sur dividendes** (indices de dividendes cotés, par exemple sur l'Euro Stoxx 50) et swaps de dividendes. Les dividendes réels peuvent chuter brutalement (suspensions en 2020), ce qui a provoqué des pertes sur ces positions.",
   "en": "Why is a bank that sells many equity-index structured products exposed to future dividends? How does it hedge?"
  },
  {
   "id": "taux-duration",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Un zéro-coupon de maturité 5 ans a un rendement de 4 % (composition annuelle). Quelle est sa duration modifiée ?",
   "solution": "Duration de Macaulay d'un zéro-coupon = sa maturité, 5 ans. Duration modifiée $= D/(1 + y) = 5/1{,}04 \\approx$ **4,81**.\nLecture : si le taux monte de 1 point, le prix baisse d'environ 4,81 %.",
   "en": "A 5-year zero-coupon bond yields 4% (annual compounding). What is its modified duration?",
   "relances": [
    "Duration d'une obligation à coupons ? (moyenne des dates de flux pondérée par leur valeur actualisée : inférieure à la maturité)",
    "En composition continue ? (duration modifiée = duration de Macaulay)"
   ],
   "reponse": "5/1.04",
   "valeur": 4.8076923076923075,
   "tolerance": 0.005,
   "duree": 90,
   "essentiel": true
  },
  {
   "id": "taux-dv01",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Une position obligataire vaut 10 millions d'euros avec une duration modifiée de 4,8. Quelle est sa DV01 (variation de valeur pour 1 point de base) ?",
   "solution": "$\\text{DV01} \\approx \\text{valeur} \\times \\text{duration modifiée} \\times 0{,}0001 = 10\\,000\\,000 \\times 4{,}8 \\times 0{,}0001 =$ **4 800 €** par point de base.",
   "en": "A bond position is worth €10m with a modified duration of 4.8. What is its DV01?",
   "relances": [
    "Comment couvrir cette position avec un future de DV01 80 € par contrat ? (60 contrats vendus)"
   ],
   "reponse": "10000000*4.8*0.0001",
   "valeur": 4800.0,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "taux-convexite",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce que la convexité d'une obligation, et pourquoi est-elle appréciée ?",
   "solution": "La duration est l'approximation au premier ordre de la variation de prix ; la convexité est le terme du second ordre :\n$\\Delta P/P \\approx -D_\\text{mod} \\Delta y + \\tfrac12 C (\\Delta y)^{2}$.\nUne convexité positive fait que le prix monte plus quand les taux baissent qu'il ne baisse quand les taux montent : c'est un avantage quand la volatilité des taux est forte, que le marché fait payer (rendement plus faible à duration égale).\nLes obligations remboursables par anticipation et les MBS ont une convexité négative (l'émetteur rembourse quand les taux baissent).",
   "en": "What is bond convexity and why is it valuable?"
  },
  {
   "id": "taux-forward",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "numerique",
   "question": "Les taux zéro-coupon sont de 3 % à 1 an et 4 % à 2 ans (composition annuelle). Quel taux forward 1 an dans 1 an ?",
   "solution": "Absence d'arbitrage : $(1{,}04)^{2} = 1{,}03 \\times (1 + f)$, donc $f = 1{,}0816/1{,}03 - 1 \\approx$ **5,01 %**.\nApproximation rapide : $2 \\times 4\\,\\% - 3\\,\\% = 5\\,\\%$.",
   "en": "Zero rates are 3% for 1 year and 4% for 2 years (annual compounding). What is the 1-year rate one year forward?",
   "reponse": "1.04^2/1.03-1",
   "valeur": 0.050097087378640826,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "taux-swap-par",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Les facteurs d'actualisation sont 0,97 à 1 an et 0,94 à 2 ans. Quel est le taux fixe d'un swap 2 ans à paiements annuels qui vaut zéro aujourd'hui ?",
   "solution": "La jambe variable vaut $1 -$ DF($T$) (elle se réplique par un prêt au jour le jour renouvelé), la jambe fixe vaut $S \\times \\Sigma$ DF($t_{i}$).\n$S = (1 - 0{,}94)/(0{,}97 + 0{,}94) = 0{,}06/1{,}91 \\approx$ **3,14 %**.",
   "en": "Discount factors are 0.97 (1y) and 0.94 (2y). What is the par fixed rate of a 2-year annual swap?",
   "relances": [
    "Pourquoi la jambe variable vaut-elle $1 -$ DF($T$) ? (recevoir les taux variables plus le nominal à la fin équivaut à placer 1 aujourd'hui)",
    "Comment construire une courbe à partir de swaps ? (bootstrap successif des facteurs d'actualisation)"
   ],
   "reponse": "(1-0.94)/(0.97+0.94)",
   "valeur": 0.03141361256544505,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "taux-swap-definition",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Qu'est-ce qu'un swap de taux d'intérêt ? Qui l'utilise et pourquoi ?",
   "solution": "Échange périodique de flux d'intérêts sur un nominal qui n'est pas échangé : une jambe fixe contre une jambe variable indexée sur un taux de référence (€STR, SOFR, Euribor).\nUsages : une entreprise endettée à taux variable se couvre contre la hausse des taux ; une banque ajuste la duration de son bilan ; un assureur allonge la duration de son actif ; un fonds prend une position sur les taux sans acheter d'obligations.\nValeur : différence des valeurs actuelles des deux jambes ; à la mise en place, le taux fixe est choisi pour qu'elle soit nulle (taux de swap « par »).",
   "en": "What is an interest rate swap? Who uses it and why?",
   "relances": [
    "Qu'est-ce que la transition des IBOR ? (remplacement du LIBOR par des taux au jour le jour issus de transactions : SOFR, €STR, SONIA)"
   ]
  },
  {
   "id": "taux-courbe-inversee",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "banque",
    "risque",
    "hf"
   ],
   "type": "ouverte",
   "question": "Que signifie une courbe des taux inversée ? Quelles théories expliquent la forme de la courbe ?",
   "solution": "Courbe inversée : les taux courts sont au-dessus des taux longs. Le marché anticipe en général des baisses de taux directeurs, souvent liées à un ralentissement attendu ; historiquement, l'inversion a souvent précédé des récessions aux États-Unis, mais pas de façon mécanique.\nThéories :\n- **anticipations** : les taux longs sont la moyenne des taux courts futurs attendus ;\n- **prime de terme** : les investisseurs exigent un supplément pour détenir du long ;\n- **habitat préféré / segmentation** : offre et demande propres à chaque maturité (fonds de pension, banques centrales).",
   "en": "What does an inverted yield curve mean? Which theories explain the shape of the curve?"
  },
  {
   "id": "taux-var-normale",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque",
    "hf"
   ],
   "type": "numerique",
   "question": "Un portefeuille de 1 million d'euros a une volatilité quotidienne de 1 %. VaR à 1 jour, 99 %, en supposant des rendements gaussiens centrés ? (quantile $N(0{,}1)$ à 99 % : 2,326)",
   "solution": "VaR $= 2{,}326 \\times 1\\,\\% \\times 1\\,000\\,000 \\approx$ **23 260 €** : une perte qui ne devrait être dépassée qu'un jour sur cent.",
   "en": "A €1m portfolio has 1% daily volatility. One-day 99% VaR under centered normal returns? (99% normal quantile: 2.326)",
   "relances": [
    "VaR à 10 jours ? ($\\times \\sqrt{10} \\approx 73\\,600$ €, en supposant des rendements indépendants)",
    "Pourquoi l'hypothèse gaussienne est-elle dangereuse ? (queues épaisses : la VaR gaussienne sous-estime les pertes extrêmes)"
   ],
   "reponse": "2.3263*10000",
   "valeur": 23262.999999999996,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "taux-var-10-jours",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "numerique",
   "question": "La VaR 99 % à 1 jour d'un portefeuille vaut 23 263 €. Quelle VaR à 10 jours avec la règle de la racine du temps ?",
   "solution": "$23\\,263 \\times \\sqrt{10} \\approx$ **73 565 €**. Hypothèses : rendements indépendants et identiquement distribués, portefeuille inchangé sur 10 jours. Avec du retour à la moyenne la règle surestime le risque ; avec de l'autocorrélation positive ou des régimes de volatilité, elle le sous-estime.",
   "en": "The 1-day 99% VaR is €23,263. What is the 10-day VaR using the square-root-of-time rule?",
   "reponse": "23263*sqrt(10)",
   "valeur": 73564.065208497,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "taux-var-es",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque",
    "hf"
   ],
   "type": "ouverte",
   "question": "VaR et Expected Shortfall : différences, avantages et défauts de chacune.",
   "solution": "- **VaR à $\\alpha$** : le quantile de la perte ; « on ne perdra pas plus que $X$ avec probabilité $\\alpha$ ». Simple, facile à backtester, mais muette sur l'ampleur des pertes au-delà, et **non sous-additive** (la VaR d'un portefeuille peut dépasser la somme des VaR : elle peut pénaliser la diversification).\n- **ES à $\\alpha$** : la perte moyenne au-delà de la VaR. Mesure cohérente (sous-additive), sensible aux queues, mais plus difficile à estimer et à backtester.\nLe cadre réglementaire FRTB est passé d'une VaR 99 % à une ES 97,5 % (valeurs proches pour une gaussienne : $2{,}33\\sigma$ et $2{,}34\\sigma$).\nMéthodes de calcul : paramétrique (variance-covariance), historique, Monte-Carlo.",
   "en": "VaR vs Expected Shortfall: differences, pros and cons.",
   "essentiel": true
  },
  {
   "id": "taux-es-gaussienne",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque",
    "hf"
   ],
   "type": "numerique",
   "question": "Pour une perte gaussienne centrée réduite, que vaut l'Expected Shortfall à 97,5 % (en nombre d'écarts-types) ?",
   "solution": "ES $= \\varphi (1{,}96)/(1 - 0{,}975) = 0{,}0584/0{,}025 \\approx$ **$2{,}34 \\sigma$**, à comparer à la VaR $99\\,\\% (2{,}33 \\sigma)$.",
   "en": "For a standard normal loss, what is the 97.5% Expected Shortfall (in standard deviations)?",
   "indice": "ES $= \\mathbb{E}[L | L > q]$ avec $q = 1{,}96$ ; utilise $\\mathbb{E}[X \\cdot 1{X>q}] = \\varphi (q)$.",
   "reponse": "phi(1.96)/0.025",
   "valeur": 2.337637773338059,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "taux-exceptions-var",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "numerique",
   "question": "Combien d'exceptions (pertes supérieures à la VaR) attend-on en un an (250 jours) pour une VaR 99 % bien calibrée ?",
   "solution": "$250 \\times 1\\,\\% =$ **2,5**. Le nombre d'exceptions suit une loi binomiale (250 ; 0,01).\nFeux tricolores de Bâle : 0 à 4 exceptions vert, 5 à 9 orange, 10 ou plus rouge. Test de Kupiec (fréquence), test de Christoffersen (indépendance : les exceptions ne doivent pas être groupées).",
   "en": "How many exceptions do you expect over 250 days for a well-calibrated 99% VaR?",
   "relances": [
    "Probabilité d'au moins 5 exceptions si le modèle est juste ? ($\\approx 10{,}8\\,\\%$)"
   ],
   "reponse": "2.5",
   "valeur": 2.5,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "taux-intensite-defaut",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque",
    "hf"
   ],
   "type": "numerique",
   "question": "Un CDS cote 120 points de base, le taux de recouvrement est supposé de 40 %. Intensité de défaut approximative ?",
   "solution": "Règle du triangle de crédit : spread $\\approx \\lambda (1 - R)$, donc $\\lambda \\approx 0{,}012/0{,}6 =$ **2 % par an**.",
   "en": "A CDS trades at 120 bp with an assumed 40% recovery. Approximate default intensity?",
   "relances": [
    "Probabilité de survie à 5 ans ? ($e^{-0{,}1} \\approx 90{,}5\\,\\%$)"
   ],
   "reponse": "0.012/0.6",
   "valeur": 0.02,
   "tolerance": 0.005,
   "duree": 90
  },
  {
   "id": "taux-survie",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "numerique",
   "question": "Intensité de défaut constante de 2 % par an. Probabilité de survie à 5 ans ?",
   "solution": "$S(5) = e^{-0{,}02 \\times 5} = e^{-0{,}1} \\approx$ **90,5 %**.",
   "en": "Constant default intensity of 2% per year. Five-year survival probability?",
   "reponse": "exp(-0.1)",
   "valeur": 0.9048374180359595,
   "tolerance": 0.005,
   "duree": 60
  },
  {
   "id": "taux-cva-simple",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "numerique",
   "question": "Exposition positive attendue de 1 million d'euros sur un an, probabilité de défaut de la contrepartie sur l'année de 2 %, recouvrement 40 %, actualisation ignorée. CVA approximative ?",
   "solution": "$\\text{CVA} \\approx (1 - R) \\times \\text{PD} \\times \\text{EPE} = 0{,}6 \\times 0{,}02 \\times 1\\,000\\,000 =$ **12 000 €**.\nFormule générale : CVA $= (1 - R) \\Sigma$ DF($t_{i}$) EE($t_{i}$) PD($t_{i-1}, t_{i}$).",
   "en": "Expected positive exposure of €1m over one year, 2% one-year default probability, 40% recovery, ignoring discounting. Approximate CVA?",
   "relances": [
    "Qu'est-ce que le risque de corrélation défavorable (wrong-way risk) ? (l'exposition augmente quand la contrepartie se dégrade : un put sur une banque acheté à cette même banque)"
   ],
   "reponse": "0.6*0.02*1000000",
   "valeur": 12000.0,
   "tolerance": 0.005,
   "duree": 120
  },
  {
   "id": "taux-xva",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "Quels sont les principaux ajustements XVA et que représentent-ils ?",
   "solution": "Ajustements au prix « sans risque » d'un dérivé de gré à gré :\n- **CVA** : coût du risque de défaut de la contrepartie ;\n- **DVA** : symétrique, propre risque de défaut (gain comptable controversé) ;\n- **FVA** : coût de financement des flux et du collatéral non couvert ;\n- **ColVA** : effets des conditions du contrat de collatéral (rémunération, devise) ;\n- **MVA** : coût de financement de la marge initiale ;\n- **KVA** : coût du capital réglementaire immobilisé.\nCalcul : simulation Monte-Carlo de l'exposition future de tout le portefeuille d'une contrepartie (compensation, collatéral), ce qui demande des modèles hybrides et beaucoup de calcul (différentiation automatique adjointe pour les sensibilités).",
   "en": "What are the main XVA adjustments and what do they represent?"
  },
  {
   "id": "taux-validation-modele",
   "theme": "taux",
   "niveau": 2,
   "profils": [
    "risque",
    "banque"
   ],
   "type": "ouverte",
   "question": "En quoi consiste la validation de modèles dans une banque ? Que regarderais-tu pour valider un modèle de pricing ?",
   "solution": "Une équipe indépendante des développeurs vérifie qu'un modèle est adapté à son usage et en mesure le risque (le « risque de modèle »).\nPour un modèle de pricing :\n- **cadre théorique** : hypothèses, adéquation au produit (smile, sauts, taux stochastiques) ;\n- **implémentation** : réimplémentation indépendante, comparaison à des cas à formule fermée, convergence numérique (pas de grille, nombre de trajectoires) ;\n- **calibration** : stabilité des paramètres, qualité d'ajustement, sensibilité aux données ;\n- **tests de stress et cas limites** : paramètres extrêmes, maturités courtes, taux négatifs ;\n- **comparaison à des modèles alternatifs** pour chiffrer le risque de modèle, réserves éventuelles ;\n- **suivi** : backtests, $P$&L explain.\nTon projet de surface de volatilité est un petit exercice de ce type : vérité connue, contrôles d'arbitrage, limites documentées.",
   "en": "What does model validation involve at a bank? What would you check to validate a pricing model?"
  },
  {
   "id": "taux-modeles-taux-courts",
   "theme": "taux",
   "niveau": 3,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "ouverte",
   "question": "Compare les modèles de Vasicek, CIR et Hull-White.",
   "solution": "- **Vasicek** : $dr = \\kappa (\\theta - r) dt + \\sigma dW$. Gaussien, formules fermées pour les zéro-coupons, mais taux négatifs possibles (longtemps vu comme un défaut, devenu réaliste en zone euro).\n- **CIR** : $dr = \\kappa (\\theta - r) dt + \\sigma \\sqrt{r} dW$. Taux positifs (Feller : $2\\kappa \\theta \\ge \\sigma^{2}$), volatilité qui croît avec le niveau, formules fermées.\n- **Hull-White** : Vasicek avec $\\theta (t)$ dépendant du temps, choisi pour reproduire exactement la courbe des taux d'aujourd'hui. Très utilisé pour les produits de taux simples et les XVA ; la volatilité $\\sigma (t)$ se calibre sur des swaptions.\nLimites communes : un seul facteur, donc taux parfaitement corrélés entre maturités ; d'où les modèles à deux facteurs et le LMM.",
   "en": "Compare the Vasicek, CIR and Hull-White short-rate models."
  },
  {
   "id": "taux-hedge-ratio-future",
   "theme": "taux",
   "niveau": 1,
   "profils": [
    "banque",
    "risque"
   ],
   "type": "numerique",
   "question": "Ta position obligataire a une DV01 de 4 800 €. Un contrat future a une DV01 de 80 €. Combien de contrats vendre pour couvrir le risque de taux ?",
   "solution": "$4\\,800/80 =$ **60 contrats** vendus. La couverture n'est parfaite que pour un déplacement parallèle de la courbe : risque de pente si les maturités diffèrent, et risque de base entre l'obligation et le future.",
   "en": "Your bond position has a DV01 of €4,800. A futures contract has a DV01 of €80. How many contracts do you sell to hedge?",
   "reponse": "4800/80",
   "valeur": 60.0,
   "tolerance": 0.005,
   "duree": 60
  }
 ],
 "guides": [
  {
   "id": "methode",
   "titre": "Comment répondre à une question technique",
   "texte": "En entretien quant, la bonne réponse compte, mais la façon d'y arriver compte autant. L'intervieweur veut voir comment tu penses, parce que c'est ce qu'il aura en face de lui tous les jours. Un candidat qui se trompe en raisonnant à voix haute bat souvent un candidat qui donne le bon chiffre après deux minutes de silence.\n\n## Les six étapes\n\n1. **Reformule la question.** « Si je comprends bien, on lance les dés jusqu'à… et on cherche l'espérance de… ? » Tu évites de répondre à côté et tu gagnes dix secondes.\n2. **Clarifie les hypothèses.** Dés équilibrés ? Tirage avec ou sans remise ? Taux nuls ? Si l'intervieweur dit « à toi de voir », choisis l'hypothèse la plus simple et dis-le.\n3. **Annonce ta démarche avant de calculer.** « Je vais conditionner sur le premier lancer », « Je pose un état par préfixe de la séquence », « C'est une martingale arrêtée ». Même si le calcul échoue, l'idée est notée.\n4. **Commence par un cas simple.** $n = 1, n = 2$, une seule période, un seul dé. Le cas simple donne souvent la forme générale, et montre de la méthode.\n5. **Calcule en parlant.** Écris lisiblement (papier ou tableau virtuel), donne les résultats intermédiaires.\n6. **Vérifie.** Ordre de grandeur, cas limite ($p = 0, p = 1, \\sigma \\to 0$), symétrie, unité. « 14,7 lancers pour voir les six faces : plus que 6, moins que $6 \\times 6$, ça tient. »\n\n## Quand tu bloques\n\n- Dis ce que tu sais : « Je sais que l'espérance s'écrit comme une somme sur… mais je ne vois pas encore comment la calculer. »\n- Propose une version plus simple du problème, ou une simulation mentale (« si je le simulais, je ferais… »).\n- Demande si tu peux faire une hypothèse : c'est une question normale, pas un aveu de faiblesse.\n- Accepte l'indice et rebondis vite : savoir utiliser un indice est une compétence évaluée.\n- Ne reste jamais plus de 20 à 30 secondes en silence total.\n\n## Quand tu t'es trompé\n\nCorrige simplement : « Ah, j'ai compté (6,6) deux fois, donc 11 cas et non 12. » Pas d'excuse, pas de panique. Chez un teneur de marché, l'intervieweur peut te contredire exprès alors que tu as raison : vérifie, puis maintiens ta réponse calmement si elle est juste.\n\n## Les questions ouvertes (« comment ferais-tu… ? »)\n\nStructure : objectif → données → méthode → validation → limites. Par exemple, « Comment construirais-tu un signal de momentum ? » : ce qu'on prédit et à quel horizon ; quelles données (point-in-time, sans biais du survivant) ; la construction ; le backtest (walk-forward, coûts) ; les risques (crowding, retournements, sur-apprentissage).\n\n## Le code en direct\n\n- Commence par la solution simple qui marche, annonce sa complexité, puis améliore.\n- Nomme bien tes variables, teste sur un petit exemple à la main, pense aux cas limites (liste vide, un seul élément, valeurs égales).\n- Parle de ce que tu ferais avec plus de temps (tests, vectorisation).\n\n## Ce qui fait la différence\n\n- **Les relances.** Chaque fiche de l'application liste celles qu'on te posera probablement : entraîne-toi à y répondre, pas seulement à la question initiale.\n- **La concision.** Une réponse de motivation dure une minute, pas cinq.\n- **L'honnêteté.** « Je ne sais pas, mais voilà comment je chercherais » vaut mieux qu'une réponse inventée, surtout sur tes projets."
  },
  {
   "id": "plan",
   "titre": "Plan de préparation",
   "texte": "Tu vises un stage de césure de 5 à 6 mois à partir de [mois de début]. Les recrutements pour ce type de stage « off-cycle » se font souvent quelques semaines à quelques mois avant le début : de décembre à février, des entretiens peuvent tomber à tout moment. Le plan ci-dessous fonctionne donc par **routine quotidienne** et **montée en charge** plutôt que par dates fixes.\n\n## La routine quotidienne (30 à 45 minutes)\n\n| Durée | Quoi | Où |\n|---|---|---|\n| 15 à 25 min | Révisions espacées (15 nouvelles questions par jour + rappels) | Révisions |\n| 3 à 8 min | Un sprint de calcul mental | Calcul mental |\n| 5 à 10 min | Un entretien blanc court, ou une partie de market making (en alternance) | Entretien blanc, Market making |\n| 2 min | Répéter une histoire à voix haute | Mes histoires |\n\nLe plus important est la régularité : la répétition espacée ne marche que si tu reviens chaque jour, même dix minutes.\n\n## Semaine 1 : poser les bases\n\n- Lire les guides « Comment répondre », « Ce que testent les maisons » et « Défendre tes projets ».\n- Écrire « Présente-toi », « Pourquoi la finance quantitative ? » et « Ton stage actuel ».\n- Relancer le code de tes projets, relire tes notes de défense, faire **un** exercice d'extension par projet.\n- Noter ton niveau de départ au calcul mental (sprint de 2 minutes et 80 en 8 minutes).\n\n## Semaines 2 et 3 : volume\n\n- Révisions quotidiennes ; passer à 20 nouvelles questions par jour si le temps le permet.\n- Deux entretiens blancs par semaine, dont un oral avec Claude en mode vocal (Entretien blanc → « Entretien oral avec Claude »).\n- Toutes les histoires rédigées et dites une fois à voix haute.\n- Calcul mental : viser plus de 90 % de précision avant de chercher la vitesse.\n\n## Dès qu'un entretien est fixé\n\n- L'ajouter dans le Journal : l'accueil affiche le compte à rebours et la liste $J-7, J-1$, Jour $J$.\n- Réviser en priorité le profil de cette maison (Réglages → profil prioritaire).\n- Préparer « Pourquoi nous ? » pour cette entreprise précise.\n- Un entretien blanc du bon profil à $J-3$, pas plus tard.\n- Juste après : noter toutes les questions posées. Elles deviennent des fiches « Mes questions ».\n\n## Les deux pièges\n\n1. **Réviser au lieu de s'entraîner.** Lire une solution donne l'illusion de savoir. Il faut répondre d'abord, à voix haute, puis comparer.\n2. **Négliger les projets.** Ce sont les seules questions dont tu connais le sujet à l'avance. Un intervieweur qui creuse un projet et trouve de la compréhension réelle te donnera un avis très favorable ; s'il trouve un vernis, c'est éliminatoire."
  },
  {
   "id": "maisons",
   "titre": "Ce que testent les différentes maisons",
   "texte": "Les processus varient d'une entreprise et d'une année à l'autre ; ce qui suit décrit des tendances souvent rapportées, pas des règles. Renseigne-toi sur chaque processus précis (site de l'entreprise, anciens stagiaires de ton école).\n\n## Déroulé fréquent\n\n1. **Candidature** (CV, parfois lettre ou questions ouvertes).\n2. **Test en ligne** : calcul mental chronométré, probabilités, suites logiques, code (HackerRank, Codility…), parfois des jeux.\n3. **Premier entretien** (RH ou opérationnel, 30 à 45 minutes) : parcours, motivation, quelques questions techniques.\n4. **Entretiens techniques** (un à trois) : probabilités, mathématiques, code, projets.\n5. **Journée finale** (« superday ») : plusieurs entretiens à la suite, parfois une étude de cas ou un jeu de trading.\n\n## Hedge funds et recherche quantitative (QRT, CFM, Squarepoint, Two Sigma…)\n\n- **Probabilités et statistiques** solides : espérances conditionnelles, tests, régression, biais de backtest, sur-apprentissage.\n- **Code** : Python propre, parfois des exercices d'algorithmique ; NumPy et pandas.\n- **Recherche** : « comment testerais-tu ce signal ? », « que penses-tu de ce résultat ? ». Esprit critique sur les données.\n- **Projets** : creusés en profondeur, surtout ce qui n'a pas marché.\n- Dans l'application : profil « hf ». Thèmes prioritaires : probas, stats, ML, code. Ton projet le plus pertinent : stat arb.\n\n## Teneurs de marché et trading propriétaire (Optiver, IMC, Jane Street, Flow Traders, SIG…)\n\n- **Calcul mental** chronométré, souvent dès le premier test (le format « 80 questions en 8 minutes » est fréquemment cité).\n- **Probabilités rapides** et espérances de jeux, souvent en temps limité.\n- **Jeux de market making** : coter un bid/ask sur une quantité incertaine, réagir aux ordres.\n- **Paris et gestion du risque** : Kelly, quand refuser un pari favorable.\n- **Comportement** : calme sous pression, décisions rapides, capacité à changer d'avis.\n- Dans l'application : profil « mm ». Calcul mental tous les jours, Market making, probas niveau $1-2$ en vitesse. Projet : market making.\n\n## Banques : quant pricing, strats, structuration (BNP Paribas, Société Générale, Natixis, CACIB, banques américaines…)\n\n- **Produits dérivés** : Black-Scholes, Greeks, parité, smile, options exotiques simples.\n- **Calcul stochastique** : Itô, mouvement brownien, martingales, changement de probabilité, EDP.\n- **Méthodes numériques** : Monte-Carlo, différences finies, calibration.\n- **Code** : Python, souvent C++ (questions de langage).\n- **Culture de marché** : « parle-moi d'un sujet de marché », taux, volatilité.\n- Dans l'application : profil « banque ». Projet le plus pertinent : surface de volatilité.\n\n## Risque, validation de modèles, XVA\n\n- VaR, Expected Shortfall, backtesting ; CVA et exposition ; sensibilités.\n- **Esprit critique** sur les modèles : hypothèses, limites, tests de stress ; qualité de rédaction.\n- Dans l'application : profil « risque ». Thème « Taux, crédit et XVA ».\n\n## Data science et ML (plan B)\n\n- Validation croisée et fuites d'information, régularisation, métriques, choix de modèles.\n- Statistiques et code (pandas, scikit-learn) ; parfois une étude de cas à rendre.\n- Communication des résultats à des non-spécialistes.\n- Dans l'application : profil « data ».\n\n## Langue\n\nBeaucoup d'entretiens se déroulent en anglais, même à Paris. Active « questions en anglais » (Réglages) quelques jours par semaine, et fais un entretien oral avec Claude en anglais."
  },
  {
   "id": "antiseche",
   "titre": "Antisèche : formules",
   "texte": "À relire la veille. Chaque formule ici sert dans au moins une fiche de révision.\n\n## Probabilités\n\n| Loi | Espérance | Variance |\n|---|---|---|\n| Bernoulli($p$) | $p$ | $p(1 - p)$ |\n| Binomiale($n, p$) | np | np($1 - p$) |\n| Géométrique($p$), nombre d'essais | $1/p$ | $(1 - p)/p^{2}$ |\n| Poisson($\\lambda$) | $\\lambda$ | $\\lambda$ |\n| Uniforme[$a, b$] | $(a + b)/2$ | $(b - a)^{2}/12$ |\n| Exponentielle($\\lambda$) | $1/\\lambda$ | $1/\\lambda^{2}$ |\n| Normale($\\mu, \\sigma^{2}$) | $\\mu$ | $\\sigma^{2}$ |\n| Dé à 6 faces | 3,5 | $35/12 \\approx 2{,}92$ |\n\n- **Espérance totale** : $\\mathbb{E}[X] = \\mathbb{E}[\\mathbb{E}[X | Y]]$ ; **variance totale** : $\\operatorname{Var} X = \\mathbb{E}[\\operatorname{Var} (X | Y)] + \\operatorname{Var} (\\mathbb{E}[X | Y])$.\n- **Bayes** : $\\mathbb{P}(A | B) = \\mathbb{P}(B | A) \\mathbb{P}(A) / \\mathbb{P}(B)$ ; en cotes : $\\text{cote a posteriori} = \\text{cote a priori} \\times \\text{rapport de vraisemblance}$.\n- **$\\mathbb{E}[X] = \\sum \\mathbb{P}(X > n)$** pour $X$ entier positif ; $\\int \\mathbb{P}(X > x) dx$ en continu.\n- **Statistiques d'ordre** de $n$ uniformes : $\\mathbb{E}[\\text{k-ième plus petit}] = k/(n + 1)$.\n- **Min d'exponentielles** de taux $\\lambda_{i}$ : exponentielle de taux $\\sum \\lambda_{i}$ ; $\\mathbb{P}(i \\text{ est le premier}) = \\lambda_{i}/\\sum \\lambda$.\n- **Ruine du joueur** (pièce équilibrée, départ $k$, bornes 0 et $N$) : $\\mathbb{P}(N) = k/N$ ; durée moyenne $k(N - k)$.\n- **Biaisée** ($r = q/p$) : $\\mathbb{P}(N) = (1 - r^k)/(1 - r^N)$.\n- **Attente d'un motif** à pile ou face : somme des $2^\\ell$ pour chaque longueur $\\ell$ où préfixe = suffixe (PP : 6, PF : 4, PFP : 10, PPP : 14).\n- **Collectionneur** : $n(1 + 1/2 + \\dots + 1/n)$.\n- **Normale** : $E|Z| = \\sqrt{2/\\pi} \\approx 0{,}80$ ; $\\mathbb{E}[Z | Z > a] = \\varphi (a)/(1 - \\Phi (a))$ ; $\\mathbb{E}[\\max (Z_{1}, Z_{2})] = 1/\\sqrt{\\pi}$.\n- **Corrélation** : pour $n$ variables de corrélation commune $\\rho, \\rho \\ge -1/(n - 1)$.\n\n## Calcul stochastique\n\n- Brownien : $W_t \\sim N(0, t)$ ; $\\operatorname{Cov} (W_s, W_t) = \\min (s, t)$ ; $[W]_t = t$ ; $\\mathbb{E}[W_t^{4}] = 3t^{2}$.\n- **Itô** : $df(t, X) = (f_t + \\mu f_x + \\tfrac12 \\sigma^{2} f_{xx}) dt + \\sigma f_x dW$, avec $dX = \\mu dt + \\sigma dW$.\n- $d(W^{2}) = 2W dW + dt$ ; $\\int_{0}^{T} W dW = (W_T^{2} - T)/2$.\n- **Isométrie** : $\\mathbb{E}[(\\int H dW)^{2}] = \\mathbb{E}[\\int H^{2} dt]$.\n- **Martingales** : $W_t, W_t^{2} - t, \\exp (\\theta W_t - \\theta^{2}t/2), W_t^{3} - 3tW_t$.\n- **Brownien géométrique** : $S_t = S_{0} \\exp ((\\mu - \\sigma^{2}/2)t + \\sigma W_t)$ ; $\\mathbb{E}[S_t] = S_{0}e^{\\mu t}$.\n- **Ornstein-Uhlenbeck** $dX = \\kappa (\\theta - X) dt + \\sigma dW$ : variance stationnaire $\\sigma^{2}/(2\\kappa)$ ; demi-vie $\\ln 2/\\kappa$ ; AR(1) de coefficient $e^{-\\kappa \\Delta}$.\n- **Réflexion** : $\\mathbb{P}(\\max_{[0,T]} W \\ge a) = 2\\mathbb{P}(W_T \\ge a)$.\n- **Sortie** de ($-a, b$) depuis 0 : $\\mathbb{P}(b \\text{ avant} -a) = a/(a + b)$ ; $\\mathbb{E}[\\tau] = ab$.\n- **Girsanov** : sous $dQ/dP = \\exp (- \\int \\theta dW - \\tfrac12 \\int \\theta^{2} dt), W + \\int \\theta dt$ est un brownien.\n\n## Black-Scholes (dividende q)\n\n- $C = S e^{-qT} N(d_{1}) - K e^{-rT} N(d_{2})$ ; $P = K e^{-rT} N(-d_{2}) - S e^{-qT} N(-d_{1})$\n- $d_{1} = [\\ln (S/K) + (r - q + \\sigma^{2}/2)T]/(\\sigma \\sqrt{T})$ ; $d_{2} = d_{1} - \\sigma \\sqrt{T}$\n- **Parité** : $C - P = S e^{-qT} - K e^{-rT}$ ; forward $F = S e^{(r - q)T}$\n- **Delta** call $e^{-qT}N(d_{1})$ ; **Gamma** $e^{-qT}\\varphi (d_{1})/(S\\sigma \\sqrt{T})$ ; **Vega** $S e^{-qT}\\varphi (d_{1})\\sqrt{T}$ ; Vega $= \\Gamma S^{2}\\sigma T$\n- **Theta et gamma** (portefeuille couvert, $r \\approx 0$) : $\\Theta \\approx - \\tfrac12 \\sigma^{2}S^{2}\\Gamma$\n- **À la monnaie** ($r = 0$) : $C \\approx 0{,}4 \\sigma S \\sqrt{T}$ ; straddle $\\approx 0{,}8 \\sigma S \\sqrt{T}$ ; delta $\\approx 0{,}5 + 0{,}2 \\sigma \\sqrt{T}$\n- **Digitale** : $e^{-rT}N(d_{2})$ ; $= - \\partial C/ \\partial K$\n- **Densité** (Breeden-Litzenberger) : $q(K) = e^{rT} \\partial^{2}C/ \\partial K^{2}$\n- **EDP** : $V_t + (r - q)S V_S + \\tfrac12 \\sigma^{2}S^{2} V_{SS} - rV = 0$\n- **PnL couvert** : $\\tfrac12 \\Gamma S^{2}(\\sigma^{2}_\\text{réalisée} - \\sigma^{2}_\\text{implicite}) dt$\n\n## Taux et crédit\n\n- Duration modifiée $D_\\text{mod} = D_\\text{Mac}/(1 + y)$ ; $\\Delta P/P \\approx -D_\\text{mod} \\Delta y + \\tfrac12 C \\Delta y^{2}$ ; $\\text{DV01} \\approx P \\times D_\\text{mod} \\times 10^{-4}$\n- Forward : $(1 + r_{2})^{2} = (1 + r_{1})(1 + f_{1},_{2})$\n- Swap par : $S = (1 - \\text{DF}(T)) / \\sum_i \\text{ DF}(t_{i})$ (paiements annuels)\n- Crédit : spread $\\approx \\lambda (1 - R)$ ; survie $e^{-\\lambda T}$\n- CVA $\\approx (1 - R) \\Sigma$ DF($t_{i}$) EE($t_{i}$) PD($t_{i-1}, t_{i}$)\n- VaR normale : $z_\\alpha \\sigma \\sqrt{h} \\times$ valeur ; $z_{95} = 1{,}645$ ; $z_{99} = 2{,}326$ ; $\\text{ES}_{97{,}5} \\approx 2{,}34\\,\\sigma$\n\n## Statistiques\n\n- OLS : $\\hat{\\beta} = (X^{T}X)^{-1}X^{T}y$ ; régression simple : $\\beta = \\rho \\sigma_y/\\sigma_x$ ; $R^{2} = \\rho^{2}$\n- Erreur standard de la moyenne $\\sigma /\\sqrt{n}$ ; IC 95 % : $\\pm 1{,}96 \\sigma /\\sqrt{n}$\n- Sharpe annuel = Sharpe quotidien $\\times \\sqrt{252}$ ; écart-type de l'estimateur $\\approx 1/\\sqrt{\\text{années}}$\n- Tests multiples : $\\mathbb{P}(\\text{au moins un faux positif}) = 1 - (1 - \\alpha)^m$ ; Bonferroni $\\alpha /m$\n- Biais d'atténuation : pente $\\times \\operatorname{Var} (x)/(\\operatorname{Var} (x) + \\operatorname{Var} (\\text{bruit}))$\n- Kelly : $f^{\\star} = (bp - q)/b$ ; en continu $\\mu /\\sigma^{2}$ ; croissance $\\text{SR}^{2}/2$\n\n## Avellaneda-Stoikov (ton projet)\n\n- Prix de réservation $r = s - q\\gamma \\sigma^{2}(T - t)$\n- Spread $= \\gamma \\sigma^{2}(T - t) + (2/\\gamma) \\ln (1 + \\gamma /k)$\n- Intensité d'exécution $\\lambda (\\delta) = A e^{-k\\delta}$\n\n## SVI (ton projet)\n\n- $w(k) = a + b[\\rho (k - m) + \\sqrt{(k - m)^{2} + \\sigma^{2}}]$ ; ailes $b(1 \\pm \\rho) \\le 2$ (Lee)\n- Papillon : $g(k) \\ge 0$ ; calendaire : $w(k, T)$ croissante en $T$"
  },
  {
   "id": "projets",
   "titre": "Défendre tes projets",
   "texte": "Un à trois projets personnels sont ton meilleur atout et ton plus grand risque. Ils montrent de l'initiative et des sujets pertinents ; mais ils tournent sur des données synthétiques et ont été écrits avec l'aide d'une IA. Un intervieweur creusera, c'est certain. L'objectif : qu'il trouve de la compréhension réelle à chaque niveau où il creuse.\n\n## La règle d'or\n\nNe dis rien que tu ne saurais pas défendre en deux relances. Présente les résultats comme ce qu'ils sont : une validation du code et de la méthode sur une vérité connue, pas une performance de marché. Si on te demande si une IA t'a aidé : oui, et voilà ce que tu as compris, cassé et réparé toi-même.\n\n## Avant chaque entretien (1 heure par projet, une fois)\n\nÉcris, pour chaque projet, une courte note de défense (choix, limites, ce que tu ferais ensuite) et fais au moins un exercice d'extension : change un paramètre, casse quelque chose, répare-le. Tu pourras alors raconter quelque chose que **tu** as observé.\n\n**Surface de volatilité**\n- Change `PARAMS` ($\\rho = 0, \\xi$ élevé, condition de Feller violée) et regarde ce qui casse.\n- Remplace le bruit gaussien par un bruit proportionnel au spread.\n- Ajoute la pondération par vega dans `fit_svi` et compare les erreurs.\n\n**Arbitrage statistique**\n- Fais varier `demi_vie` (4, 8, 15, 30) et `formation` ; trace la proportion de vraies paires retenues.\n- Ajoute une correction de Bonferroni dans `_choisir_paires` et compare.\n- Ajoute une rupture de régime au milieu du spread et observe le drawdown.\n\n**Market making**\n- Ajoute de la sélection adverse (exécutions surtout quand le prix va contre toi) : A-S gagne-t-il encore ?\n- Ajoute une limite d'inventaire dure et mesure son coût.\n- Refais le balayage de $\\gamma$ pour un autre $\\sigma$ et explique la différence.\n\n## Les pitchs de 30 secondes\n\nÀ écrire toi-même dans Mes histoires → « Le projet dont tu es le plus fier ». Trame : le problème, ce que tu as construit, un chiffre honnête, ce qui n'a pas marché et ce que tu en as appris.\n\n## Ce que l'intervieweur cherche, par projet\n\n| Projet | Pour quel poste | Ce qu'il va tester |\n|---|---|---|\n| Surface de volatilité | Banque (pricing, strats), risque | Black-Scholes, smile, arbitrage, calibration, Heston |\n| Arbitrage statistique | Hedge fund, data science | Cointégration, biais de backtest, tests multiples, validation |\n| Market making | Teneur de marché, trading | Inventaire, spread, sélection adverse, simulation |\n\nLes fiches du thème « Projets types » donnent des exemples de questions probables sur trois projets de référence (surface de volatilité, arbitrage statistique, market making), avec leurs chiffres ; adapte-les à tes propres projets. Révise-les jusqu'à les maîtriser toutes : ce sont les seules questions que tu peux être sûr de recevoir.\n\n## Les anecdotes à savoir raconter\n\n- **SVI** : un minimum local ($\\rho = 0{,}92, m = 0{,}63$) ajustait bien les cotations mais donnait une densité négative ($g$ min $= -2{,}17$) → pénalité, plusieurs départs, $m$ borné.\n- **Stat arb** : premier réglage à Sharpe nul malgré 8 vraies paires → test peu puissant et 1 540 paires testées (faux positifs) → réglage changé après coup, d'où le Sharpe déflaté et le contrôle négatif. Et un bug de décalage d'un jour, d'où le test anti regard vers le futur.\n- **Market making** : le compteur d'ordres faisait `bool + bool` (OU logique en NumPy) → détecté par un test qui comparait au bon taux d'exécution en temps discret."
  },
  {
   "id": "calcul",
   "titre": "Astuces de calcul mental",
   "texte": "Le calcul mental se travaille comme un sport : un peu chaque jour. Ces astuces font gagner du temps sur les tests chronométrés et pendant les questions de probabilités.\n\n## Ce qu'il faut savoir par cœur\n\n- Tables de multiplication jusqu'à $12 \\times 12$, idéalement jusqu'à $20 \\times 20$.\n- Carrés jusqu'à 25 (et 30 si possible) : $13^{2} = 169$, $14^{2} = 196$, $15^{2} = 225$, $16^{2} = 256$, $17^{2} = 289$, $18^{2} = 324$, $19^{2} = 361$, $21^{2} = 441$, $22^{2} = 484$, $23^{2} = 529$, $24^{2} = 576$, $25^{2} = 625$.\n- Fractions usuelles : $1/6 = 0{,}1667$ ; $1/7 = 0{,}1429$ ; $1/8 = 0{,}125$ ; $1/9 = 0{,}111$ ; $1/11 = 0{,}0909$ ; $1/12 = 0{,}0833$ ; $1/16 = 0{,}0625$ ; $3/8 = 0{,}375$ ; $5/8 = 0{,}625$ ; $7/8 = 0{,}875$.\n- Puissances de 2 jusqu'à $2^{16}$, quelques constantes (thème « Chiffres à connaître »).\n\n## Multiplications\n\n- **Décomposer** : $47 \\times 6 = 40 \\times 6 + 7 \\times 6 = 240 + 42 = 282$.\n- **Arrondir puis corriger** : $49 \\times 23 = 50 \\times 23 - 23 = 1\\,150 - 23 = 1\\,127$.\n- **Par 5, 25, 125** : $\\times 5 = \\times 10 / 2$ ; $\\times 25 = \\times 100 / 4$ ; $\\times 125 = \\times 1\\,000 / 8$.\n- **Carré d'un nombre finissant par 5** : $65^{2} = 6 \\times 7$ puis $25 \\to 4\\,225$.\n- **Autour d'une base** : $97 \\times 96$ : écarts $-3$ et $-4$ ; $97 - 4 = 93$ ; $3 \\times 4 = 12 \\to 9\\,312$.\n- **Différence de carrés** : $52 \\times 48 = 50^{2} - 2^{2} = 2\\,496$.\n- **Par 11** (deux chiffres) : $63 \\times 11 \\to 6$, $6 + 3$, $3 \\to 693$.\n\n## Divisions et pourcentages\n\n- Simplifier d'abord : $7{,}2 \\div 0{,}9 = 72 \\div 9 = 8$.\n- Diviser par $5 =$ multiplier par 2 et diviser par 10.\n- $x \\%$ de $y = y \\%$ de $x$ : 16 % de $25 = 25\\,\\%$ de $16 = 4$.\n- Hausse de a % puis baisse de a % : variation de $-a^{2}/100\\,\\%$.\n\n## Décimaux\n\n- Aligner mentalement les virgules ; travailler en centimes : $12{,}75 + 8{,}6 = 1\\,275 + 860$ centimes $= 2\\,135 \\to 21{,}35$.\n- Multiplier des décimaux : calculer avec des entiers et replacer la virgule (somme des décimales) : $0{,}6 \\times 0{,}7 = 0{,}42$.\n\n## Estimation et vérification\n\n- Ordre de grandeur avant tout : $312 \\times 48 \\approx 300 \\times 50 = 15\\,000$ (exact : 14 976).\n- Preuve par 9 pour détecter une erreur d'addition ou de multiplication.\n- Approximations : $\\sqrt{1 + x} \\approx 1 + x/2$ ; $(1 + x)^{n} \\approx 1 +$ nx ; $e^{x} \\approx 1 + x + x^{2}/2$ ; $\\ln (1 + x) \\approx x - x^{2}/2$.\n\n## Stratégie pendant un test chronométré\n\n- La précision d'abord : une erreur coûte souvent plus qu'une question sautée.\n- Ne pas rester bloqué : si une question prend deux fois plus de temps que le rythme visé, passer (si le format le permet).\n- S'entraîner dans les conditions du test : même durée, même nombre de questions, sans papier si le test l'interdit."
  },
  {
   "id": "ressources",
   "titre": "Pour aller plus loin",
   "texte": "Une sélection courte. Mieux vaut un livre travaillé à fond que cinq feuilletés.\n\n## Préparation aux entretiens\n\n- **Xinfeng Zhou, $_A$ Practical Guide to Quantitative Finance Interviews_** : la référence ; casse-têtes, probabilités, calcul stochastique, finance, algorithmes. À faire en entier, en cachant les solutions.\n- **Timothy Crack, _Heard on the Street_** : questions d'entretien quant et finance, avec solutions détaillées.\n- **Mark Joshi, Nick Denson et Andrew Downes, _Quant Job Interview Questions and Answers_** : orienté banque (pricing, C++).\n- **Frederick Mosteller, _Fifty Challenging Problems in Probability_** : court, classique, excellent pour l'intuition.\n\n## Probabilités et calcul stochastique\n\n- **Joseph Blitzstein et Jessica Hwang, _Introduction to Probability_** : clair, beaucoup d'exercices de type entretien.\n- **Steven Shreve, _Stochastic Calculus for Finance I et II_** : du modèle binomial au calcul d'Itô, rigoureux et pédagogique.\n\n## Produits dérivés et volatilité\n\n- **John Hull, _Options, Futures, and Other Derivatives_** : la base pour les entretiens en banque.\n- **Sheldon Natenberg, _Option Volatility and Pricing_** : le point de vue du trader d'options (Greeks, stratégies).\n- **Jim Gatheral, _The Volatility Surface_** : SVI, volatilité locale et stochastique ; directement lié à ton projet.\n- **Paul Wilmott, _Frequently Asked Questions in Quantitative Finance_** : réponses courtes à beaucoup de questions.\n\n## Recherche quantitative, données, microstructure\n\n- **Marcos López de Prado, _Advances in Financial Machine Learning_** : validation croisée purgée, Sharpe déflaté, pièges du backtest.\n- **Jean-Philippe Bouchaud, Julius Bonart, Jonathan Donier et Martin Gould, _Trades, Quotes and Prices_** : microstructure, impact de marché.\n- **Álvaro Cartea, Sebastian Jaimungal et José Penalva, _Algorithmic and High-Frequency Trading_** : market making optimal, prolongement naturel de ton projet Avellaneda-Stoikov.\n\n## Comment t'en servir avec cette application\n\nQuand une question d'un livre te pose problème, ajoute-la à tes révisions : écris-la dans le Journal (un entretien « Autre » nommé d'après le livre), puis « Questions → révisions ». Elle reviendra au bon moment comme les autres."
  }
 ]
};
