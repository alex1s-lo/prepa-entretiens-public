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
   "solution": "```python\ndef meilleur_gain(prix):\n    plus_bas = float(\"inf\")\n    meilleur = 0\n    for p in prix:\n        plus_bas = min(plus_bas, p)\n        meilleur = max(meilleur, p - plus_bas)\n    return meilleur\n```\nTemps O(n), mémoire O(1). La solution naïve (toutes les paires) est en O(n²).",
   "en": "Given a list of daily stock prices, write a function returning the maximum profit from one buy followed by one sell. Complexity?",
   "indice": "Parcours la liste une seule fois en retenant le plus bas prix vu jusqu'ici.",
   "relances": [
    "Et si on peut faire autant d'allers-retours qu'on veut ? (somme des hausses quotidiennes positives)",
    "Et avec au plus deux transactions ? (programmation dynamique à quatre états, O(n))",
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
   "solution": "Algorithme de Kadane : la meilleure somme qui se termine en i est soit x[i], soit x[i] + la meilleure qui se termine en i − 1.\n```python\ndef somme_max(x):\n    courant = meilleur = x[0]\n    for v in x[1:]:\n        courant = max(v, courant + v)\n        meilleur = max(meilleur, courant)\n    return meilleur\n```\nO(n) en temps, O(1) en mémoire.",
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
   "solution": "```python\ndef drawdown_max(valeurs):\n    sommet = valeurs[0]\n    pire = 0.0\n    for v in valeurs:\n        sommet = max(sommet, v)\n        pire = min(pire, v / sommet - 1)\n    return pire          # par exemple -0.16 pour -16 %\n```\nO(n). En NumPy : `(v / np.maximum.accumulate(v) - 1).min()`.",
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
   "question": "Dans une liste d'entiers, trouve deux éléments dont la somme vaut une cible donnée. Fais mieux que O(n²).",
   "solution": "Dictionnaire des valeurs déjà vues :\n```python\ndef deux_somme(x, cible):\n    vus = {}\n    for i, v in enumerate(x):\n        if cible - v in vus:\n            return vus[cible - v], i\n        vus[v] = i\n    return None\n```\nO(n) en moyenne en temps et en mémoire. Alternative : trier puis deux pointeurs, O(n log n) et O(1) mémoire supplémentaire.",
   "en": "In a list of integers, find two elements summing to a target. Do better than O(n²).",
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
   "question": "Calcule la moyenne mobile sur k jours d'une série de n prix en O(n), sans recalculer chaque somme.",
   "solution": "Somme glissante : on ajoute l'entrant et on retire le sortant.\n```python\ndef moyenne_mobile(x, k):\n    res, s = [], 0.0\n    for i, v in enumerate(x):\n        s += v\n        if i >= k:\n            s -= x[i - k]\n        if i >= k - 1:\n            res.append(s / k)\n    return res\n```\nEn NumPy : `c = np.cumsum(np.insert(x, 0, 0)); (c[k:] - c[:-k]) / k`. En pandas : `serie.rolling(k).mean()`.",
   "en": "Compute the k-day moving average of n prices in O(n) without recomputing each sum.",
   "relances": [
    "Attention aux erreurs d'arrondi qui s'accumulent sur de très longues séries (recalculer la somme de temps en temps, ou sommation de Kahan)",
    "Et un écart-type glissant ? (sommes glissantes de x et de x², ou algorithme de Welford pour la stabilité)"
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
   "solution": "Deux tas : un tas max pour la moitié basse, un tas min pour la moitié haute, de tailles égales à un près.\n```python\nimport heapq\n\nclass Mediane:\n    def __init__(self):\n        self.bas = []   # tas max (valeurs opposées)\n        self.haut = []  # tas min\n\n    def ajouter(self, x):\n        heapq.heappush(self.bas, -x)\n        heapq.heappush(self.haut, -heapq.heappop(self.bas))\n        if len(self.haut) > len(self.bas):\n            heapq.heappush(self.bas, -heapq.heappop(self.haut))\n\n    def mediane(self):\n        if len(self.bas) > len(self.haut):\n            return -self.bas[0]\n        return (-self.bas[0] + self.haut[0]) / 2\n```\nO(log n) par insertion, O(1) pour lire la médiane.",
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
   "solution": "Échantillonnage par réservoir : garder le i-ème élément avec probabilité 1/i.\n```python\nimport random\n\ndef tirer(flux):\n    choix = None\n    for i, x in enumerate(flux, start=1):\n        if random.random() < 1 / i:\n            choix = x\n    return choix\n```\nPreuve : l'élément i est choisi (1/i) puis jamais remplacé : (1/i)·(i/(i+1))·…·((n−1)/n) = 1/n.\nPour k éléments : garder les k premiers, puis remplacer un élément au hasard avec probabilité k/i.",
   "en": "A stream of trades of unknown length passes by. How do you sample one uniformly at random in a single pass?"
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
   "solution": "Fisher-Yates :\n```python\nimport random\n\ndef melanger(x):\n    for i in range(len(x) - 1, 0, -1):\n        j = random.randint(0, i)   # j dans [0, i]\n        x[i], x[j] = x[j], x[i]\n```\nLa version naïve (j dans [0, n − 1] à chaque étape) produit nⁿ suites de tirages équiprobables pour n! permutations ; nⁿ n'est pas un multiple de n! (pour n = 3 : 27 et 6), donc certaines permutations sont plus probables.",
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
   "solution": "Rejet : deux appels donnent un entier uniforme de 0 à 24 ; on garde les 21 premiers.\n```python\ndef rand7():\n    while True:\n        n = 5 * (rand5() - 1) + (rand5() - 1)   # uniforme sur 0..24\n        if n < 21:\n            return n % 7 + 1\n```\nProbabilité d'accepter : 21/25 ; nombre moyen d'appels à rand5 : 2 × 25/21 ≈ 2,38.",
   "en": "Given rand5() returning a uniform integer in 1..5, build rand7().",
   "piege": "rand5() + rand5() n'est pas uniforme (loi triangulaire)."
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
   "solution": "```python\ndef vol_implicite(prix_marche, prix_bs, bas=1e-4, haut=5.0, tol=1e-8):\n    # prix_bs(sigma) est croissant en sigma : on coupe l'intervalle en deux\n    while haut - bas > tol:\n        milieu = (bas + haut) / 2\n        if prix_bs(milieu) < prix_marche:\n            bas = milieu\n        else:\n            haut = milieu\n    return (bas + haut) / 2\n```\nLe prix d'une option est strictement croissant en σ (vega > 0) : la dichotomie converge toujours, en log₂((haut − bas)/tol) itérations. Newton (σ ← σ − (C(σ) − C_marché)/vega) converge beaucoup plus vite mais peut diverger loin de la monnaie (vega minuscule) ; on combine souvent les deux (Brent, comme dans ton projet).",
   "en": "Write a binary search. How do you use it to compute an implied volatility?",
   "relances": [
    "Combien d'itérations pour passer d'un intervalle de 5 à une précision de 10⁻⁸ ? (environ 29)"
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
   "solution": "On divise par deux à chaque étape : il faut ⌈log₂(1 000 001)⌉ = **20** comparaisons (2²⁰ = 1 048 576).",
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
   "solution": "Une pile :\n```python\ndef equilibre(s):\n    paires = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    pile = []\n    for c in s:\n        if c in \"([{\":\n            pile.append(c)\n        elif c in paires:\n            if not pile or pile.pop() != paires[c]:\n                return False\n    return not pile\n```\nO(n).",
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
   "solution": "f(n) = f(n − 1) + f(n − 2), f(1) = 1, f(2) = 2 : suite de Fibonacci décalée. f(10) = **89**.\n```python\ndef facons(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\nLa récursion naïve est exponentielle ; la mémoïsation ou l'itération est en O(n).",
   "en": "In how many ways can you climb a 10-step staircase taking 1 or 2 steps at a time?",
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
   "solution": "Il faut 8 pas dont 4 vers la droite : C(8, 4) = **70**.",
   "en": "How many lattice paths go from (0, 0) to (4, 4) using only right and up steps?",
   "relances": [
    "Lien avec un arbre binomial ? (nombre de chemins menant à un nœud = coefficient binomial)"
   ],
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
   "solution": "Le Global Interpreter Lock empêche plusieurs threads d'exécuter du bytecode Python en même temps dans un même processus (CPython). Les threads aident pour les entrées-sorties (réseau, disque), pas pour le calcul pur.\nPour accélérer :\n- **vectoriser** avec NumPy (boucles en C, qui libèrent souvent le GIL) ;\n- **multiprocessing** / `concurrent.futures.ProcessPoolExecutor` pour paralléliser sur plusieurs cœurs ;\n- compiler les boucles chaudes : Numba, Cython, ou une extension C++ ;\n- mieux : un meilleur algorithme (O(n) au lieu de O(n²)).\nProfiler d'abord (`cProfile`) avant d'optimiser. (Des versions récentes de CPython proposent une construction expérimentale sans GIL.)",
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
   "solution": "- `x in liste` : O(n) (parcours).\n- `x in dict` / `x in set` : O(1) en moyenne, O(n) au pire (collisions).\nUn dictionnaire est une table de hachage : la clé est hachée pour trouver une case ; les collisions sont résolues par adressage ouvert ; la table est agrandie quand elle se remplit (coût amorti O(1)). Les clés doivent être hachables (immuables : pas de liste comme clé). Depuis Python 3.7, l'ordre d'insertion est conservé.",
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
   "solution": "Une boucle Python manipule des objets un par un (typage dynamique, appels de fonction, allocation). NumPy stocke des données homogènes contiguës en mémoire et exécute la boucle en C compilé, souvent avec des instructions SIMD : facteur 10 à 100.\n**Broadcasting** : règles qui étendent virtuellement les dimensions de taille 1 pour combiner des tableaux de formes différentes sans copie. Exemple : `prix (n, 1) - strikes (1, m)` donne une matrice (n, m) de payoffs. Un simulateur de market making vectorise 4 000 trajectoires de cette façon.",
   "en": "Why is a vectorized NumPy operation much faster than a Python loop? What is broadcasting?",
   "relances": [
    "Piège classique ? (une forme (n,) contre (n, 1) produit une matrice (n, n) par broadcasting au lieu d'une erreur)"
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
   "question": "Pourquoi 0,1 + 0,2 ≠ 0,3 en Python ? Quelles conséquences en finance, et comment les gérer ?",
   "solution": "Les flottants sont stockés en binaire (IEEE 754, 53 bits de mantisse) : 0,1 n'a pas de représentation binaire exacte, l'erreur d'arrondi apparaît dans la somme (0,30000000000000004).\nConséquences : comparaisons d'égalité fausses, accumulation d'erreurs sur de longues sommes, **annulation catastrophique** quand on soustrait deux nombres proches (différences finies avec un pas trop petit, variance calculée comme E[X²] − E[X]²).\nRemèdes : comparer avec une tolérance (`math.isclose`), `decimal.Decimal` ou des entiers (centimes) pour la comptabilité, sommation de Kahan ou `math.fsum`, algorithmes stables (Welford pour la variance), pas de différences finies adapté (≈ √ε × échelle).",
   "en": "Why is 0.1 + 0.2 != 0.3 in Python? What are the consequences in finance and how do you handle them?"
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
   "relances": [
    "Et pour trouver seulement le plus rapide ? (6 courses)"
   ],
   "reponse": "7",
   "valeur": 7.0,
   "tolerance": 0.005,
   "duree": 300,
   "essentiel": true
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
   "en": "Two ropes each burn in exactly one hour, but unevenly. How do you measure 45 minutes?"
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
   "question": "100 casiers fermés. Le passage k (k = 1 à 100) change l'état (ouvert/fermé) de tous les casiers dont le numéro est multiple de k. Combien de casiers sont ouverts à la fin ?",
   "solution": "Le casier n est touché une fois par diviseur de n. Les diviseurs vont par paires (d, n/d), sauf quand d = n/d : seuls les carrés parfaits ont un nombre impair de diviseurs. Carrés jusqu'à 100 : 1, 4, …, 100, soit **10 casiers**.",
   "en": "100 closed lockers. On pass k (k = 1 to 100) you toggle every locker whose number is a multiple of k. How many lockers are open at the end?",
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 180,
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
   "solution": "Avec n lâchers, on lâche le premier œuf à l'étage n ; s'il casse, on teste un à un les n − 1 étages en dessous avec le second. S'il ne casse pas, on monte de n − 1 étages, puis n − 2, etc. On couvre n + (n − 1) + … + 1 = n(n + 1)/2 étages. Il faut n(n + 1)/2 ≥ 100, donc **n = 14** (14 × 15/2 = 105). Étages du premier œuf : 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100.",
   "en": "Two identical eggs, a 100-floor building. Find the highest floor from which an egg survives. Minimum number of drops in the worst case?",
   "indice": "Si tu disposes de n lâchers au total, de quel étage lâcher le premier œuf ?",
   "relances": [
    "Avec trois œufs ? (9 lâchers : C(n,1) + C(n,2) + C(n,3) ≥ 100)"
   ],
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
   "reponse": "17",
   "valeur": 17.0,
   "tolerance": 0.005,
   "duree": 300
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
   "solution": "L'aiguille des minutes est sur 3 (90°). Celle des heures a avancé d'un quart d'heure au-delà de 3 : 90° + 15 × 0,5° = 97,5°. Angle : **7,5°**.",
   "en": "What is the angle (in degrees) between the clock hands at 3:15?",
   "relances": [
    "Combien de fois par jour les aiguilles se superposent-elles ? (22)"
   ],
   "reponse": "7.5",
   "valeur": 7.5,
   "tolerance": 0.005,
   "duree": 120
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
   "question": "Par combien de zéros se termine 100! ?",
   "solution": "Chaque zéro vient d'un facteur 10 = 2 × 5 ; les 2 sont plus nombreux que les 5. Facteurs 5 : ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = **24**.",
   "en": "How many trailing zeros does 100! have?",
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
   "question": "Quel est le dernier chiffre de 7²⁰²⁶ ?",
   "solution": "Les derniers chiffres des puissances de 7 forment le cycle 7, 9, 3, 1 (période 4). 2026 = 4 × 506 + 2 : même dernier chiffre que 7², soit **9**.",
   "en": "What is the last digit of 7^2026?",
   "reponse": "9",
   "valeur": 9.0,
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
   "solution": "Numérote les bouteilles en binaire (10 bits suffisent : 2¹⁰ = 1 024 ≥ 1 000). Le rat i boit de chaque bouteille dont le bit i vaut 1. L'ensemble des rats morts donne l'écriture binaire de la bouteille empoisonnée : **10 rats**.",
   "en": "One of 1,000 bottles is poisoned; the poison kills within 24 hours even in tiny doses. You have 24 hours. Minimum number of rats needed?",
   "relances": [
    "Et si tu as 48 heures (deux vagues de tests) ? (chaque rat a 3 issues : mort au jour 1, au jour 2, vivant ; 3⁷ = 2 187 ≥ 1 000, donc 7 rats)"
   ],
   "reponse": "10",
   "valeur": 10.0,
   "tolerance": 0.005,
   "duree": 240
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
   "question": "Combien de carrés (de toutes tailles) contient un échiquier de 8 × 8 ?",
   "solution": "Un carré de côté k peut se placer de (9 − k)² façons : Σ_{k=1}^{8} k² = 8 × 9 × 17/6 = **204**.",
   "en": "How many squares of all sizes are there on an 8×8 chessboard?",
   "relances": [
    "Et combien de rectangles ? (C(9,2)² = 1 296)"
   ],
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
   "solution": "C(20, 2) = 20 × 19/2 = **190**.",
   "en": "20 people each shake hands once with everyone else. How many handshakes?",
   "reponse": "190",
   "valeur": 190.0,
   "tolerance": 0.005,
   "duree": 60
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
   "question": "Que vaut 1 + 3 + 5 + … + 99 (somme des nombres impairs jusqu'à 99) ?",
   "solution": "Il y a 50 termes ; la somme des n premiers impairs vaut n² : **2 500**. (Ou : 50 termes de moyenne 50.)",
   "en": "Compute 1 + 3 + 5 + … + 99.",
   "reponse": "2500",
   "valeur": 2500.0,
   "tolerance": 0.005,
   "duree": 60
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
   "solution": "Deux fourmis qui se croisent et font demi-tour se comportent exactement comme si elles se traversaient (on échange juste leurs noms). Chaque « trajectoire » parcourt au plus 100 cm : **100 secondes** au pire.",
   "en": "100 ants are placed randomly on a 1 m stick, each facing left or right at random, moving at 1 cm/s. When two ants meet they both turn around; ants fall off at the ends. In the worst case, how many seconds until all have fallen?",
   "reponse": "100",
   "valeur": 100.0,
   "tolerance": 0.005,
   "duree": 240
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
   "solution": "Les trains se rencontrent après 1 heure ; la mouche vole pendant 1 heure : **75 km**. Inutile de sommer la série infinie des allers-retours.",
   "en": "Two trains 100 km apart approach each other at 50 km/h each. A fly shuttles between them at 75 km/h until they meet. How far does the fly travel?",
   "reponse": "75",
   "valeur": 75.0,
   "tolerance": 0.005,
   "duree": 120
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
   "reponse": "21",
   "valeur": 21.0,
   "tolerance": 0.005,
   "duree": 120
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
   "solution": "Argument de comptage : 24 possibilités (12 pièces × 2 sens) et 3³ = 27 issues pour trois pesées : c'est possible en principe, à condition que chaque pesée sépare bien les cas.\nStratégie : pesée 1 : {1,2,3,4} contre {5,6,7,8}.\n- **Équilibre** : la fausse est parmi 9 à 12. Pesée 2 : {9,10,11} contre {1,2,3} (vraies). Si équilibre, c'est 12 : pesée 3 contre une vraie pour savoir le sens. Sinon on connaît le sens (lourd ou léger) et il reste 3 pièces : pesée 3 de 9 contre 10.\n- **Déséquilibre**, disons {1,2,3,4} plus lourd : soit l'une de 1 à 4 est lourde, soit l'une de 5 à 8 est légère. Pesée 2 : {1,2,5} contre {3,6,9}. Si le côté gauche est plus lourd : 1 ou 2 lourde, ou 6 légère ; pesée 3 : 1 contre 2 (équilibre → 6). Si le côté droit est plus lourd : 3 lourde ou 5 légère ; pesée 3 : 3 contre 9. Si équilibre : 4 lourde ou 7, 8 légère ; pesée 3 : 7 contre 8 (équilibre → 4).\nCe qui est évalué : l'argument d'information (chaque pesée a 3 issues) et la capacité à organiser les cas.",
   "en": "12 coins, one counterfeit that is heavier or lighter (unknown). Find it and determine heavier/lighter in 3 weighings on a balance.",
   "relances": [
    "Jusqu'à combien de pièces peut-on aller en 3 pesées ? (12 si on doit aussi trouver le sens ; 13 si on a une pièce vraie de référence)"
   ]
  },
  {
   "id": "ct-chapeaux",
   "theme": "casse-tete",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "ouverte",
   "question": "100 prisonniers en file indienne portent un chapeau noir ou blanc. Chacun voit les chapeaux devant lui, pas le sien ni ceux de derrière. En partant du dernier de la file, chacun dit à haute voix une couleur ; ceux qui disent la couleur de leur propre chapeau sont libérés. Ils se concertent avant. Combien peuvent être sauvés à coup sûr ?",
   "solution": "**99** à coup sûr. Le dernier annonce la parité du nombre de chapeaux noirs qu'il voit (« noir » = impair). Il a une chance sur deux pour lui-même. Chacun des suivants connaît cette parité, voit les chapeaux devant lui et a entendu les réponses (justes) de ceux de derrière : il en déduit la couleur de son chapeau.\nIdée clé : une seule information (un bit de parité) suffit, et chaque réponse transmet de l'information aux suivants.",
   "en": "100 prisoners in a line wear black or white hats; each sees the hats in front only. Starting from the back, each says a color aloud; those naming their own hat color go free. They can agree on a strategy beforehand. How many can be saved for sure?"
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
   "solution": "Raisonnement à rebours (en appelant les pirates 1 à 5, 5 étant le plus ancien) :\n- 2 pirates : le 2 garde tout (sa voix suffit) : (100, 0).\n- 3 pirates : le 3 doit acheter une voix ; le pirate 1 aurait 0 sinon, 1 pièce lui suffit : (1, 0, 99).\n- 4 pirates : il faut 2 voix ; le pirate 2 aurait 0 dans le cas à 3 : (0, 1, 0, 99).\n- 5 pirates : il faut 3 voix ; acheter les pirates 1 et 3 (qui auraient 0 dans le cas à 4) avec 1 pièce chacun : **98 pour le plus ancien, 1 pour les pirates 1 et 3, 0 pour les autres**.\nCe qui est évalué : l'induction à rebours, comme en théorie des jeux et en évaluation d'options américaines.",
   "en": "Five rational pirates split 100 gold coins. The most senior proposes a split; if at least half (including him) accept, done; otherwise he is thrown overboard. Each wants to survive, then maximize gold, then see others thrown overboard. What does the first pirate propose?"
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
   "solution": "Allume le 1 pendant quelques minutes, éteins-le, allume le 2, monte. Ampoule allumée : interrupteur 2. Éteinte mais chaude : 1. Éteinte et froide : 3. L'astuce est d'utiliser une deuxième information (la chaleur) : trois états avec une seule observation.",
   "en": "Three switches downstairs control one bulb in the attic; you may go up only once. How do you identify the right switch?"
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
   "solution": "Ce qui compte est la décomposition et la cohérence, pas le chiffre. Un exemple :\n- Paris intra-muros : ~2 millions d'habitants, ~1 million de foyers.\n- Foyers avec un piano : ~3 % → 30 000 pianos ; plus écoles, conservatoires, salles : disons 40 000.\n- Accord : en moyenne une fois par an.\n- Un accordeur : ~3 accords par jour, ~220 jours par an → ~650 accords par an.\n- Besoin : 40 000/650 ≈ **60 accordeurs** (ordre de grandeur : quelques dizaines à une centaine).\nMéthode : annoncer la structure, arrondir franchement, vérifier par une seconde approche (par exemple le nombre de magasins de pianos), donner une fourchette et dire quelle hypothèse est la plus incertaine.",
   "en": "How many piano tuners are there in Paris? (Estimation question: reason aloud.)"
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
   "solution": "Approche par la demande :\n- ~40 millions de voitures, ~13 000 km par an, 6 L/100 km → ~800 L par voiture et par an, soit ~32 milliards de litres (plus utilitaires et poids lourds : disons 45 milliards).\n- Une station vend ~3 à 5 millions de litres par an (quelques milliers de litres par jour, un peu plus pour les grandes surfaces).\n- 45 milliards / 4 millions ≈ **11 000 stations**.\nContrôle par l'offre : ~35 000 communes, une station pour 3 à 4 communes en moyenne → 10 000. Cohérent (l'ordre de grandeur réel est de l'ordre de 10 000).\nDire quelle hypothèse est la plus fragile (volume par station) et comment l'affiner.",
   "en": "How many gas stations are there in France? Reason aloud."
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
   "en": "Table returns(ticker, day, r). Write a SQL query giving, for each ticker with at least 200 observations, the mean return and standard deviation, sorted by mean descending."
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
   "en": "Compute, for each row, the 20-observation moving average of r for the same ticker.",
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
   "question": "Qu'est-ce que la sémantique de déplacement (move) en C++11 ? Que fait `std::move` ?",
   "solution": "Une référence rvalue (`T&&`) désigne un objet temporaire dont on peut « voler » les ressources (le tampon d'un `std::vector` ou d'une `std::string`) au lieu de les copier : le constructeur et l'affectation par déplacement transfèrent un pointeur au lieu de copier les données (O(1) au lieu de O(n)).\n`std::move` ne déplace rien : c'est une conversion en rvalue qui **autorise** le déplacement. Après un déplacement, l'objet source est dans un état valide mais non spécifié.\nRègle des cinq : si une classe définit un destructeur, un constructeur de copie ou une affectation, elle doit en général définir les cinq (ou aucun, en s'appuyant sur des membres RAII).",
   "en": "What are move semantics in C++11? What does std::move do?"
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
   "en": "What does m contain after m = [[0]*3]*3; m[0][0] = 1, and why?"
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
   "solution": "Trier par début, puis balayer :\n```python\ndef fusionner(intervalles):\n    res = []\n    for debut, fin in sorted(intervalles):\n        if res and debut <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], fin)\n        else:\n            res.append([debut, fin])\n    return res\n```\nO(n log n) à cause du tri. Cas limites : intervalles inclus l'un dans l'autre (d'où le `max`), intervalles qui se touchent (choisir `<=` ou `<` selon la convention).",
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
   "question": "Trouve les k plus grandes valeurs d'une liste de n nombres (n très grand, k petit). Quelle complexité ?",
   "solution": "- Trier tout : O(n log n).\n- **Tas min de taille k** : parcourir la liste, garder les k plus grandes vues ; O(n log k) et mémoire O(k), utilisable en flux : `heapq.nlargest(k, donnees)`.\n- **Quickselect** : partitionner autour d'un pivot comme dans le tri rapide, ne continuer que du côté utile ; O(n) en moyenne, O(n²) au pire (pivot aléatoire ou médiane des médianes). `numpy.partition` le fait.",
   "en": "Find the k largest values among n numbers (n huge, k small). Complexity?"
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
   "solution": "C(1 000, 2) = 1 000 × 999/2 = **499 500** : c'est le O(n²) qui devient prohibitif quand n grandit (50 milliards pour n = 316 000).",
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
   "question": "√2 ≈ ? (3 décimales)",
   "solution": "**√2 ≈ 1,414** ; √3 ≈ 1,732 ; √5 ≈ 2,236 ; √10 ≈ 3,162.",
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
   "question": "ln 2 ≈ ? (3 décimales)",
   "solution": "**ln 2 ≈ 0,693** ; ln 3 ≈ 1,099 ; ln 10 ≈ 2,303. Sert pour les demi-vies (ln 2/κ) et la règle de 72 (temps de doublement ≈ 72/taux en %).",
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
   "question": "e ≈ ? (3 décimales) Et 1/e ?",
   "solution": "**e ≈ 2,718** (2,718281828…) ; 1/e ≈ 0,368. 1/e revient dans les dérangements, le problème de la secrétaire et (1 − 1/n)ⁿ.",
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
   "question": "1/7 en décimal ? (4 décimales)",
   "solution": "**1/7 = 0,142857…** (période de 6 chiffres) ; 2/7 = 0,2857… ; 1/6 = 0,1667 ; 1/8 = 0,125 ; 1/9 = 0,111… ; 1/11 = 0,0909… ; 1/12 = 0,0833.",
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
   "question": "N(1) = P(Z ≤ 1) pour Z normale centrée réduite ≈ ? (3 décimales)",
   "solution": "**N(1) ≈ 0,841**. Donc P(|Z| ≤ 1) ≈ 68 %, P(|Z| ≤ 2) ≈ 95 %, P(|Z| ≤ 3) ≈ 99,7 %.",
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
   "question": "1/√(2π), la densité de la loi normale en 0 ≈ ?",
   "solution": "**≈ 0,399**, soit environ 0,4 : c'est le « 0,4 » de l'approximation d'un call à la monnaie (0,4 σ S √T). φ(1) ≈ 0,242 ; φ(2) ≈ 0,054.",
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
   "question": "√252 ≈ ? (nombre de jours de bourse par an, pour annualiser une volatilité)",
   "solution": "**√252 ≈ 15,87**, souvent arrondi à 16. Une volatilité annuelle de 16 % correspond à un mouvement quotidien typique de 1 %. √12 ≈ 3,46 ; √52 ≈ 7,21.",
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
   "solution": "32 %/√252 ≈ 32/16 ≈ **2 % par jour**.",
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
   "solution": "Règle de 72 : 72/6 = **12 ans** (exactement ln 2/ln 1,06 ≈ 11,9).",
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
   "question": "2¹⁶ = ?",
   "solution": "**65 536**. 2¹⁰ = 1 024 ≈ 10³ ; 2²⁰ ≈ 10⁶ ; 2³² ≈ 4,3 × 10⁹.",
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
   "question": "e^{0,1} ≈ ? (de tête)",
   "solution": "1 + x + x²/2 = 1 + 0,1 + 0,005 ≈ **1,105**. Pour x petit, e^x ≈ 1 + x et ln(1 + x) ≈ x − x²/2.",
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
   "question": "17² = ?",
   "solution": "**289**. À connaître : les carrés jusqu'à 25 (169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625). Astuce : (a + b)² = a² + 2ab + b², par exemple 47² = 2 500 − 300 + 9 = 2 209.",
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
   "solution": "E[X²] − E[X]² = 91/6 − 49/4 = **35/12 ≈ 2,917** ; écart-type ≈ 1,708. Pour la somme de n dés : variance 35n/12.",
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
   "question": "Σ 1/n² (n de 1 à l'infini) = ?",
   "solution": "**π²/6 ≈ 1,645** (problème de Bâle). À connaître aussi : Σ 1/n diverge (≈ ln n + 0,577), Σ xⁿ = 1/(1 − x), Σ n xⁿ⁻¹ = 1/(1 − x)².",
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
   "question": "dX = −3X dt + 2 dW (Ornstein-Uhlenbeck). Quelle est la variance stationnaire de X ?",
   "solution": "κ = 3, σ = 2 : variance stationnaire σ²/(2κ) = 4/6 = **2/3**.\nDémonstration : X_t = X₀e^{−κt} + σ∫₀ᵗ e^{−κ(t−s)} dW_s, de variance σ²(1 − e^{−2κt})/(2κ) → σ²/(2κ).",
   "en": "dX = −3X dt + 2 dW (Ornstein-Uhlenbeck). What is the stationary variance of X?",
   "indice": "Facteur intégrant e^{κt}, puis isométrie d'Itô : σ² ∫₀^∞ e^{−2κu} du.",
   "piege": "Oublier le 2 : σ²/κ est faux, car ∫₀^∞ e^{−2κu} du = 1/(2κ).",
   "relances": [
    "Et la demi-vie ? (ln 2/3 ≈ 0,23)",
    "Que vaut Cov(X_s, X_t) en régime stationnaire ? (σ²/(2κ)·e^{−κ|t−s|})"
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
   "question": "Taux court CIR : dr = κ(θ − r)dt + σ√r dW avec κ = 1, θ = 5 %, σ = 10 %, r₀ = 1 %. Que vaut E[r₁] ?",
   "solution": "m(t) = E[r_t] vérifie m' = κ(θ − m), donc m(t) = θ + (r₀ − θ)e^{−κt} = 0,05 − 0,04e^{−1} ≈ **3,53 %**.\nLa volatilité n'intervient pas : CIR et Vasicek ont la même moyenne.",
   "en": "CIR short rate with κ = 1, θ = 5%, σ = 10%, r₀ = 1%. What is E[r₁]?",
   "indice": "Prends l'espérance de l'EDS : le terme en dW disparaît.",
   "relances": [
    "Variance stationnaire de CIR ? (σ²θ/(2κ), obtenue en appliquant Itô à r²)",
    "Qu'est-ce que la condition de Feller ? (2κθ ≥ σ² : le taux ne touche pas 0)"
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
   "question": "Dans le modèle de Vasicek, comment obtient-on le prix d'un zéro-coupon P(0, T) = E[exp(−∫₀ᵀ r_t dt)] ?",
   "solution": "r est un processus d'Ornstein-Uhlenbeck, donc gaussien ; I = ∫₀ᵀ r_t dt est une intégrale (limite de sommes) de gaussiennes : **I est gaussienne**.\n- E[I] = θT + (r₀ − θ)B(T), avec B(T) = (1 − e^{−κT})/κ.\n- Var(I) = (σ²/κ²)(T − 2B(T) + (1 − e^{−2κT})/(2κ)), par Fubini stochastique puis isométrie.\n- P(0, T) = E[e^{−I}] = exp(−E[I] + Var(I)/2) (transformée de Laplace gaussienne).\nLe terme +Var/2 est un effet de convexité : plus les taux sont volatils, plus les zéro-coupons longs valent cher.",
   "en": "In the Vasicek model, how do you get the zero-coupon bond price P(0, T) = E[exp(−∫₀ᵀ r_t dt)]?",
   "relances": [
    "Pourquoi Vasicek peut-il donner des taux négatifs ?",
    "Que change Hull-White ? (θ(t) pour recaler la courbe initiale)"
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
   "question": "Call sur un futures d'électricité : F = K = 80, volatilité 25 %, maturité 1 an, taux 4 %. Prix par la formule de Black ? (N(0,125) ≈ 0,5497)",
   "solution": "d₁ = 0,125, d₂ = −0,125. C = e^{−0,04} × 80 × (N(0,125) − N(−0,125)) ≈ 0,9608 × 80 × 0,0995 ≈ **7,65**.\nApproximation : e^{−rT} × 0,4 × σ × F × √T = 0,96 × 0,4 × 0,25 × 80 ≈ 7,69.",
   "en": "Call on a power futures: F = K = 80, vol 25%, maturity 1 year, rate 4%. Black-76 price? (N(0.125) ≈ 0.5497)",
   "indice": "C = e^{−rT}(F N(d₁) − K N(d₂)) avec d₁,₂ = ±σ√T/2 à la monnaie.",
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
   "question": "Démontre l'identité S φ(d₁) = K e^{−rT} φ(d₂) et déduis-en le vega d'un call Black-Scholes.",
   "solution": "φ(d₁)/φ(d₂) = exp(−(d₁² − d₂²)/2) = exp(−(d₁ − d₂)(d₁ + d₂)/2). Or d₁ − d₂ = σ√T et d₁ + d₂ = (2 ln(S/K) + 2rT)/(σ√T) : le produit vaut 2 ln(S/K) + 2rT, donc φ(d₁)/φ(d₂) = K e^{−rT}/S.\n**Vega** : ∂C/∂σ = S φ(d₁) ∂d₁/∂σ − K e^{−rT} φ(d₂) ∂d₂/∂σ = S φ(d₁)(∂d₁/∂σ − ∂d₂/∂σ) = **S φ(d₁) √T**, car d₁ − d₂ = σ√T.\nLa même identité donne Δ = N(d₁), le theta et le rho en quelques lignes.",
   "en": "Prove S φ(d₁) = K e^{−rT} φ(d₂) and use it to derive the Black-Scholes vega.",
   "relances": [
    "Quel est le vega d'un call à la monnaie un an, S = 100 ? (≈ 0,4 par point de vol)",
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
   "solution": "σ_loc²(T, K) = ∂_T C / (½ K² ∂_KK C).\n**Heuristique** : appliquer Itô à (S_T − K)⁺ avec f' = 1{S > K} et f'' = δ_K (formule de Tanaka). En espérance, le terme en dS disparaît (S martingale) et il reste ∂_T C = ½ σ_loc²(T, K) K² f(K, T), où f est la densité de S_T. Breeden-Litzenberger donne f(K, T) = ∂_KK C. On divise.\n**À dire ensuite** : la vol locale calibre exactement les vanilles mais donne une mauvaise dynamique du smile ; il faut une surface lissée et sans arbitrage (dérivées de données bruitées).",
   "en": "Write Dupire's local volatility formula (zero rates and dividends) and explain where it comes from.",
   "relances": [
    "Que se passe-t-il si la surface a un arbitrage papillon ? (∂_KK C < 0 : variance locale négative)",
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
   "solution": "P(achat | 120) = 0,25 + 0,75/2 = 0,625 ; P(achat | 80) = 0,375 ; P(achat) = ½. Donc P(120 | achat) = 0,625 et ask = 80 + 0,625 × 40 = **105**.\nPar symétrie bid = 95 : le spread vaut α × (V_H − V_L) = 10, uniquement à cause de l'information privée.",
   "en": "A stock is worth 80 or 120 with probability ½. A quarter of the clients know the true value; the others buy or sell at random. What ask does a break-even market maker quote?",
   "indice": "ask = E[V | achat], par Bayes.",
   "relances": [
    "Un client vient d'acheter. Quel ask pour le suivant ? (E[V | deux achats] ≈ 109,4)",
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
   "question": "Dans Avellaneda-Stoikov, démontre que le prix de réservation vaut r = s − q γ σ² (T − t).",
   "solution": "Avec une utilité exponentielle et S_T ~ N(s, σ²(T − t)), la valeur d'un inventaire figé est −exp(−γ·EC) avec l'**équivalent certain** EC = x + q s − ½ γ q² σ² (T − t) (transformée de Laplace gaussienne).\nPrix de réservation à l'achat r_b : indifférence entre (x, q) et (x − r_b, q + 1), soit r_b = s − ½(1 + 2q) γ σ² (T − t). À la vente : r_a = s + ½(1 − 2q) γ σ² (T − t). La moyenne vaut **s − q γ σ² (T − t)**.\nLecture : long d'inventaire, on baisse ses prix pour vendre ; l'effet croît avec γ, σ² et le temps restant.",
   "en": "In Avellaneda-Stoikov, prove that the reservation price is r = s − q γ σ² (T − t).",
   "relances": [
    "D'où vient le terme (2/γ) ln(1 + γ/k) du spread ?",
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
   "solution": "Avec ρ = 0 : w₁ = σ₂²/(σ₁² + σ₂²) = 0,04/0,05 = **0,8**. Sans corrélation, on pondère par l'inverse des variances.\nVol obtenue : √(0,64 × 0,01 + 0,04 × 0,04) ≈ 8,9 %, moins que le moins risqué des deux.",
   "en": "Two uncorrelated assets with vols 10% and 20%. Which weight in the first minimises portfolio variance (fully invested)?",
   "indice": "w₁ = (σ₂² − ρσ₁σ₂)/(σ₁² + σ₂² − 2ρσ₁σ₂).",
   "relances": [
    "Forme générale ? (Σ⁻¹1 / 1ᵀΣ⁻¹1, par le lagrangien)",
    "Et si ρ = 1 ?"
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
   "solution": "Pour des stratégies non corrélées, SR*² = Σ SRᵢ² (portefeuille tangent, SR*² = mᵀΣ⁻¹m). √(0,36 + 0,64) = **1**.\nC'est la logique des fonds multi-stratégies et de la loi fondamentale IR ≈ IC √N.",
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
   "solution": "Deux prêts indépendants perdent chacun 100 avec probabilité 4 %. Pour chacun, P(perte > 0) = 4 % < 5 %, donc VaR 95 % = 0. Pour les deux ensemble, P(au moins une perte) = 1 − 0,96² = 7,84 % > 5 %, donc VaR 95 % = 100 > 0 + 0.\nLa VaR peut donc pénaliser la diversification, et elle ignore ce qui se passe au-delà du seuil. L'**ES** (moyenne des pertes au-delà de la VaR) est sous-additive (mesure de risque cohérente) et voit la queue ; la réglementation (FRTB) l'utilise à 97,5 %.",
   "en": "Show with an example that VaR is not subadditive. Why is Expected Shortfall preferred?",
   "relances": [
    "ES à 97,5 % d'une gaussienne, en écarts-types ? (≈ 2,34, proche de la VaR à 99 %)",
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
   "solution": "e^{θX} est une martingale si θμ + ½θ²σ² = 0, soit θ = −2μ/σ². Arrêt optionnel entre −d et +a, puis a → ∞ : P = e^{−2μd/σ²} = e^{−2 × 0,05 × 0,1/0,01} = **e^{−1} ≈ 0,37**.\nVersion continue de la ruine du joueur avec biais.",
   "en": "A strategy's value follows a Brownian motion with drift 5% and volatility 10% per year. What is the probability that it ever falls 10% below its current level?",
   "indice": "Cherche θ tel que e^{θX_t} soit une martingale, puis arrêt optionnel.",
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
   "question": "Lasso à une variable normée (Σxᵢ² = 1), critère Σ(yᵢ − βxᵢ)² + λ|β| avec λ = 1. Le coefficient des moindres carrés vaut 0,8. Coefficient Lasso ?",
   "solution": "Pour β > 0 : 2β − 2z + λ = 0, donc β = z − λ/2 = 0,8 − 0,5 = **0,3** (valable car positif).\nSeuillage doux : β = signe(z)(|z| − λ/2)⁺. Si z valait 0,3, le Lasso donnerait exactement 0 : c'est ainsi qu'il sélectionne les variables.",
   "en": "One-variable Lasso with Σxᵢ² = 1, objective Σ(yᵢ − βxᵢ)² + λ|β| with λ = 1. The OLS coefficient is 0.8. Lasso coefficient?",
   "indice": "Le critère vaut β² − 2βz + λ|β| à une constante près ; dérive pour β > 0.",
   "relances": [
    "Et la Ridge avec le même λ ? (z/(1 + λ) = 0,4)",
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
   "question": "Dérive l'estimateur des moindres carrés et sa variance Var(β̂ | X) = σ²(XᵀX)⁻¹. Quelles hypothèses utilises-tu ?",
   "solution": "Gradient de ‖y − Xβ‖² : −2Xᵀy + 2XᵀXβ = 0, donc β̂ = (XᵀX)⁻¹Xᵀy (XᵀX inversible : pas de colinéarité parfaite).\nβ̂ = β + (XᵀX)⁻¹Xᵀε. **Sans biais** si E[ε | X] = 0 (exogénéité). **Variance** : Var(Aε) = A Var(ε) Aᵀ avec A = (XᵀX)⁻¹Xᵀ ; si Var(ε | X) = σ²I (homoscédasticité, pas d'autocorrélation), on obtient σ²(XᵀX)⁻¹XᵀX(XᵀX)⁻¹ = **σ²(XᵀX)⁻¹**.\nSi l'homoscédasticité tombe, les coefficients restent sans biais mais les erreurs standard sont fausses (White, Newey-West).",
   "en": "Derive the OLS estimator and its variance Var(β̂ | X) = σ²(XᵀX)⁻¹. Which assumptions do you use?",
   "relances": [
    "Que devient la variance d'une pente quand deux variables sont corrélées à 0,9 ? (× 5,3)",
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
   "solution": "ρσ² + (1 − ρ)σ²/B = 0,2 + 0,8/50 = **0,216**. Le terme ρσ² ne diminue pas avec le nombre d'arbres : d'où le tirage aléatoire de variables, qui décorrèle les arbres. Même calcul que la limite de la diversification d'un portefeuille.",
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
   "solution": "p = σ(z), z = xᵀβ, σ'(z) = σ(z)(1 − σ(z)). Donc ∂/∂z ln σ = 1 − σ et ∂/∂z ln(1 − σ) = −σ.\nPour un exemple : ∂/∂z [−y ln σ − (1 − y) ln(1 − σ)] = −y(1 − σ) + (1 − y)σ = **σ(z) − y**. En chaîne (∂z/∂β = x) : gradient (p − y)x, soit **Xᵀ(p − y)/n** pour la moyenne.\nMême forme que les moindres carrés ; la perte est convexe (hessienne Σ p(1 − p)xxᵀ ≥ 0).",
   "en": "Derive the gradient of the logistic regression log-loss.",
   "relances": [
    "Interprétation d'un coefficient ? (multiplie la cote par e^β)",
    "Pourquoi pas les moindres carrés sur une étiquette 0/1 ?"
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
   "solution": "Var((f(Z) + f(−Z))/2) = ½(Var f(Z) + Cov(f(Z), f(−Z))). À coût égal, le gain existe si et seulement si **Cov(f(Z), f(−Z)) < 0**, ce qui est vrai pour f monotone (un call, un put).\nInutiles (voire nuisibles) pour f paire : un straddle à la monnaie, f(z) = z². Autres réductions : variable de contrôle (variance × (1 − ρ²)), échantillonnage préférentiel, quasi-Monte-Carlo.",
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
   "question": "Schéma explicite pour ∂_τu = ½σ²∂_xxu avec σ = 30 % et un pas en log-prix Δx = 0,02. Plus grand pas de temps stable, en années ?",
   "solution": "Stabilité si α ≤ ½, soit Δτ ≤ Δx²/σ² = 0,0004/0,09 ≈ **0,0044 an** (environ 1,1 jour ouvré).\nDiviser Δx par 2 oblige à diviser Δτ par 4 : d'où les schémas implicites ou Crank-Nicolson.",
   "en": "Explicit scheme for ∂_τu = ½σ²∂_xxu with σ = 30% and Δx = 0.02 in log-price. Largest stable time step, in years?",
   "indice": "Analyse de von Neumann : facteur d'amplification 1 − 4α sin²(kΔx/2), avec α = σ²Δτ/(2Δx²).",
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
   "solution": "**Box-Muller** : R = √(−2 ln U₁), Θ = 2πU₂, Z₁ = R cos Θ, Z₂ = R sin Θ.\nEn polaires, la densité (1/2π)e^{−r²/2} r dr dθ se factorise : Θ uniforme, indépendant de R, et R²/2 ~ Exp(1). Or −ln U₁ ~ Exp(1) (méthode d'inversion).\nPour deux gaussiennes corrélées à ρ : X₂ = ρZ₁ + √(1 − ρ²)Z₂ (Cholesky).",
   "en": "How do you generate two independent standard normals from two uniforms? Why does it work?",
   "relances": [
    "Simuler une exponentielle ? (−ln U / λ)",
    "Un point uniforme dans un disque ? (r = √U, pas r = U)"
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
   "question": "Pourquoi la jambe variable d'un swap de taux vaut-elle 1 − P(0, T_n) (pour un nominal de 1) ? Quel est le taux de swap au pair ?",
   "solution": "Recevoir δL_i en T_i (L_i fixé en T_{i−1}) se réplique en plaçant 1 en T_{i−1} jusqu'à T_i, ce qui rapporte 1 + δL_i : le flux vaut P(0, T_{i−1}) − P(0, T_i). En sommant, tout se télescope : **1 − P(0, T_n)**.\nJambe fixe : K δ Σ P(0, T_i). Taux au pair : **S = (1 − P(0, T_n)) / (δ Σ P(0, T_i))**, moyenne pondérée des forwards.\nDepuis 2008, actualisation et projection n'utilisent plus la même courbe : la formule n'est plus exacte (mono-courbe).",
   "en": "Why is the floating leg of an interest rate swap worth 1 − P(0, T_n) (unit notional)? What is the par swap rate?",
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
   "solution": "(a − b)/(a + b) = (7 − 3)/10 = **2/5**.\nPreuve : les bons dépouillements commencent par A ; ceux qui, partant de là, touchent l'égalité sont en bijection (par réflexion avant le premier retour à 0) avec les dépouillements qui commencent par B. On obtient C(9, 6) − C(9, 7) = 84 − 36 = 48 bons sur C(10, 3) = 120.",
   "en": "Candidate A gets 7 votes, B gets 3, counted in random order. Probability that A is strictly ahead throughout the count?",
   "indice": "Théorème du scrutin, démontré par le principe de réflexion.",
   "relances": [
    "Et si l'on demande « jamais derrière » au lieu de « strictement devant » ? ((a + 1 − b)/(a + 1))",
    "Lien avec les nombres de Catalan ?"
   ],
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
   "solution": "Nombre de Catalan C₄ = C(8, 4)/5 = 70/5 = **14**.\nPreuve par réflexion : parmi les C(8, 4) chemins de 0 à 0, ceux qui passent sous 0 sont en bijection avec les chemins de 0 à −2, au nombre de C(8, 5) = 56 ; 70 − 56 = 14.",
   "en": "How many well-formed sequences of 4 opening and 4 closing parentheses are there?",
   "relances": [
    "Combien d'arbres binaires à 4 nœuds internes ? (14 aussi)",
    "Comment le vérifier en code ? (pile, ou compteur qui ne doit jamais devenir négatif)"
   ],
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
   "question": "Des ordres arrivent selon un processus de Poisson de 6 par minute ; chacun est un gros ordre avec probabilité 1/3, indépendamment. Probabilité de recevoir au moins 2 gros ordres dans la minute ?",
   "solution": "Par amincissement, les gros ordres suivent un Poisson d'intensité 2 par minute : P(N ≥ 2) = 1 − e^{−2}(1 + 2) = **1 − 3e^{−2} ≈ 0,594**.\nLe nombre de petits ordres est un Poisson indépendant (intensité 4) : observer beaucoup de petits ordres n'apprend rien sur les gros.",
   "en": "Orders arrive as a Poisson process at 6 per minute; each is large with probability 1/3, independently. Probability of at least 2 large orders within a minute?",
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
   "solution": "Vecteur propre 1 = (1, …, 1) : valeur propre 1 + (n − 1)ρ = 1 + 5 × 0,2 = **2** (le mode marché, un tiers de la variance totale 6). Les cinq autres valent 1 − ρ = 0,8.\nConséquence : la matrice n'est valide que si ρ ≥ −1/(n − 1) = −0,2.",
   "en": "Six standardised assets with pairwise correlation 0.2. Largest eigenvalue of their correlation matrix?",
   "indice": "R = (1 − ρ)I + ρ11ᵀ.",
   "relances": [
    "Quelle part de variance explique la première composante principale ? (2/6)"
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
   "question": "Factorisation de Cholesky Σ = LLᵀ de la matrice de covariance [[4, 2], [2, 4]] : que vaut L₂₂ ?",
   "solution": "L₁₁ = √4 = 2, L₂₁ = 2/2 = 1, L₂₂ = √(4 − 1²) = **√3 ≈ 1,732**.\nLecture : X₂ = 1·Z₁ + √3·Z₂ ; √3² = 3 est la variance de X₂ non expliquée par X₁ (4 × (1 − ρ²) avec ρ = 0,5).",
   "en": "Cholesky factorisation Σ = LLᵀ of the covariance matrix [[4, 2], [2, 4]]: what is L₂₂?",
   "relances": [
    "Comment simuler (X₁, X₂) ? (X = LZ)",
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
   "question": "Black-Scholes, taux nul, S₀ = K = 100, σ = 20 %, T = 1 an. Prix d'un call down-and-in de barrière 80 (surveillance continue) ? Utilise la réplication statique par des puts.",
   "solution": "B²/K = 64. P(100, 64) avec d₁ = (ln(100/64) + 0,02)/0,2 ≈ 2,331 et d₂ ≈ 2,131 : P = 64 N(−2,131) − 100 N(−2,331) ≈ 0,0712. Donc C_DI = (100/80) × 0,0712 ≈ **0,089**.\nPourquoi : si la barrière n'est jamais touchée, les puts de strike 64 < 80 expirent sans valeur ; si elle l'est, en S = B la symétrie call-put donne C(B, K) = (K/B) P(B, B²/K) et l'on échange les puts contre le call sans frais.",
   "en": "Black-Scholes with zero rates, S₀ = K = 100, σ = 20%, T = 1. Price of a down-and-in call with barrier 80 (continuous monitoring)? Use the static put replication.",
   "indice": "C_DI = (K/B) · P(S₀, B²/K), par la symétrie call-put.",
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
   "question": "Taux nul, σ = 24 %, T = 1 an. Quelle volatilité utiliser dans la formule de Black pour un call sur la moyenne géométrique continue du sous-jacent ?",
   "solution": "ln G = ln S₀ − σ²T/4 + (σ/T)∫₀ᵀ W_t dt, et Var(∫₀ᵀ W dt) = T³/3. Donc Var(ln G) = σ²T/3 : volatilité **σ/√3 ≈ 13,9 %**, avec le forward S₀ e^{−σ²T/12}.\nL'asiatique géométrique sert de variable de contrôle pour l'arithmétique, qui n'a pas de formule fermée.",
   "en": "Zero rates, σ = 24%, T = 1. Which volatility goes into Black's formula for a call on the continuous geometric average?",
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
   "question": "Pourquoi le prix d'une digitale n'est-il pas e^{−rT}N(d₂) calculé à la vol implicite de son strike ? Dans quel sens joue le skew des actions ?",
   "solution": "La digitale est la limite d'un call spread : D = −dC/dK, où C(K) = C_BS(K, σ(K)). En dérivant : **D = e^{−rT}N(d₂) − Vega × ∂σ/∂K**.\nSur actions, le skew est négatif (∂σ/∂K < 0) : la correction est **positive**, une digitale call vaut plus que Black-Scholes à la vol du strike (et une digitale put moins). L'effet est du même ordre que le prix lui-même : ignorer le skew est une erreur de premier ordre.",
   "en": "Why is a digital option not priced as e^{−rT}N(d₂) at its strike's implied vol? Which way does the equity skew push the price?",
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
   "question": "Modèle de Schwartz (log-spot Ornstein-Uhlenbeck) avec κ = 2 par an. Quelle fraction de la volatilité du spot porte un forward livrant dans 3 mois ?",
   "solution": "dF/F = σ e^{−κ(T − t)} dW : fraction e^{−2 × 0,25} = **e^{−0,5} ≈ 0,61**.\nC'est l'effet Samuelson : la volatilité d'un forward augmente à l'approche de la livraison, car un choc sur le spot a le temps de se résorber avant une livraison lointaine.",
   "en": "Schwartz model (Ornstein-Uhlenbeck log-spot) with κ = 2 per year. Which fraction of spot volatility does a forward delivering in 3 months carry?",
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
   "solution": "Moyenne pondérée par les heures : (100 × 744 + 80 × 672)/1 416 ≈ **90,51 €/MWh** (et non 90 : janvier compte plus d'heures).\nLes deux portefeuilles (le produit bimestriel, ou janvier plus février) livrent exactement la même énergie : même prix.",
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
   "solution": "Quand le tableau est plein, on alloue une capacité **multipliée** par un facteur r > 1 et on recopie. Les recopies ont lieu à des tailles en progression géométrique ; leur coût total est une série géométrique inférieure à n/(r − 1). Pour n ajouts, le coût total est O(n), donc O(1) en moyenne par ajout (avec r = 2 : moins de 3n opérations).\nAvec une croissance **additive** de 10 cases, on recopie 10, 20, 30, … éléments : O(n²) au total.",
   "en": "Why is appending to a Python list or std::vector O(1) amortised? What if capacity grew by 10 slots each time?",
   "relances": [
    "Pourquoi CPython agrandit-il d'environ 12,5 % plutôt que de doubler ? (mémoire gaspillée contre fréquence des recopies)"
   ],
   "duree": 150
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
   "question": "Écris la formule de Black-Scholes pour un call européen et explique d₁ et d₂.",
   "solution": "C = S N(d₁) − K e^{−rT} N(d₂), avec\nd₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T), d₂ = d₁ − σ√T.\n- **N(d₂)** est la probabilité risque-neutre que le call finisse dans la monnaie.\n- **N(d₁)** est le delta, et la probabilité d'exercice sous la mesure qui prend l'action comme numéraire.\n- Avec un dividende continu q : remplacer S par S e^{−qT} (et r par r − q dans d₁).\nLecture : le call vaut « ce que je reçois » (l'action si exercice) moins « ce que je paie » (K actualisé si exercice).",
   "en": "Write the Black-Scholes formula for a European call and explain d₁ and d₂.",
   "relances": [
    "Et le put ? (K e^{−rT} N(−d₂) − S N(−d₁))",
    "Que devient C quand σ → 0 ? (max(S − K e^{−rT}, 0)) ; quand σ → ∞ ? (S)"
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
   "solution": "Parité : C − P = S − K e^{−rT}, donc P = C − S + K = 8 − 100 + 105 = **13**.\nDémonstration : long call + short put = (S_T − K) dans tous les cas = un forward ; par absence d'arbitrage, même prix aujourd'hui.",
   "en": "A 1-year European call struck at 105 is worth 8. Spot is 100, no dividends, zero rates. What is the put with the same strike and maturity worth?",
   "relances": [
    "La parité dépend-elle d'un modèle ? (non : seulement de l'absence d'arbitrage, pour des options européennes)",
    "Et pour des options américaines ? (seulement des inégalités : S − K ≤ C − P ≤ S − K e^{−rT} sans dividende)"
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
   "question": "Estime de tête le prix d'un call à la monnaie, S = K = 100, σ = 20 %, maturité 1 an, taux nuls.",
   "solution": "C ≈ 0,4 × 0,2 × 100 × 1 = **8** (valeur exacte : 100(2N(0,1) − 1) ≈ 7,97).\nL'approximation vient d'un développement de N au voisinage de 0 : C ≈ S σ√T / √(2π).",
   "en": "Estimate mentally the price of an at-the-money call: S = K = 100, σ = 20%, 1 year, zero rates.",
   "indice": "Approximation à la monnaie : C ≈ 0,4·σ·S·√T (car 1/√(2π) ≈ 0,4).",
   "relances": [
    "Prix du straddle à la monnaie ? (≈ 0,8 σ S √T ≈ 16)",
    "Si la maturité passe à 3 mois ? (divisé par 2, car √(1/4) = 1/2)"
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
   "question": "Delta d'un call à la monnaie (S = K = 100), σ = 20 %, maturité 1 an, taux nuls ? Pourquoi n'est-il pas exactement 0,5 ?",
   "solution": "Δ = N(d₁) avec d₁ = σ√T/2 = 0,1 : **Δ ≈ 0,540**.\nIl dépasse 0,5 à cause du terme +σ²/2 : la loi log-normale est asymétrique à droite. Le call de delta 0,5 a un strike un peu au-dessus du forward (K = F e^{σ²T/2}).",
   "en": "Delta of an ATM call (S = K = 100), σ = 20%, 1 year, zero rates? Why isn't it exactly 0.5?",
   "relances": [
    "Delta du put ? (N(d₁) − 1 ≈ −0,46)",
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
   "question": "Gamma d'un call à la monnaie, S = K = 100, σ = 20 %, maturité 1 an, taux nuls ? De combien le delta bouge-t-il si le sous-jacent prend 1 point ?",
   "solution": "Γ = φ(d₁)/(Sσ√T) = φ(0,1)/20 ≈ 0,397/20 ≈ **0,0198**. Une hausse d'un point fait passer le delta d'environ 0,540 à 0,560.\nOrdre de grandeur à retenir : à la monnaie, Γ ≈ 0,4/(Sσ√T).",
   "en": "Gamma of an ATM call, S = K = 100, σ = 20%, T = 1, zero rates? How much does delta move for a 1-point move in spot?",
   "relances": [
    "Où le gamma est-il maximal ? (près de la monnaie, et il explose quand la maturité tend vers 0)",
    "Quel lien entre gamma et vega pour une option vanille ? (Vega = Γ S² σ T)"
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
   "question": "Un call à la monnaie (S = K = 100, maturité 1 an, taux nuls) est coté avec 20 % de volatilité. De combien augmente son prix si la volatilité passe à 21 % ?",
   "solution": "Vega = S√T φ(d₁) ≈ 100 × 0,397 ≈ 39,7 par unité de volatilité, soit **≈ 0,40 par point de vol**. Le calcul exact (7,97 → 8,36) donne 0,397.\nApproximation : à la monnaie, le prix est presque linéaire en σ (0,4 S √T par unité), d'où vega ≈ 0,4 S √T.",
   "en": "An ATM call (S = K = 100, 1 year, zero rates) is priced at 20% vol. By how much does its price increase if vol goes to 21%?",
   "relances": [
    "Où le vega est-il maximal ? (près de la monnaie ; il croît avec la maturité en √T)",
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
   "question": "Que vaut une option digitale qui paie 1 si S_T > 100 (S₀ = 100, σ = 20 %, maturité 1 an, taux nuls) ?",
   "solution": "Prix = e^{−rT} N(d₂) avec d₂ = −σ√T/2 = −0,1 : **≈ 0,460**.\nCe n'est pas 0,5 : sous la mesure risque-neutre avec taux nuls, la médiane de S_T est sous 100.",
   "en": "Price of a digital option paying 1 if S_T > 100 (S₀ = 100, σ = 20%, T = 1, zero rates)?",
   "relances": [
    "Comment répliquer une digitale avec des calls ? (call spread serré : [C(K − ε) − C(K + ε)]/(2ε), donc digitale = −∂C/∂K)",
    "En quoi le smile change-t-il le prix ? (digitale = −∂C/∂K au total : −∂C_BS/∂K − Vega·∂σ/∂K ; avec un skew négatif, la digitale call coûte plus cher que N(d₂))"
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
   "solution": "Près de l'échéance et du strike, le delta d'une digitale (≈ densité au strike) devient énorme et change de signe très vite : le gamma est explosif, la couverture en delta demande des volumes déraisonnables (« pin risk »).\nGestion : on la risque-manage comme un **call spread** légèrement décalé dans le sens conservateur (« overhedge », par exemple entre K − ε et K), ce qui borne les Greeks et facture la différence au client. Le prix inclut aussi le skew (dérivée de la vol implicite en K).",
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
   "solution": "| Greek | Call acheté | Put acheté |\n|---|---|---|\n| Delta | + (entre 0 et 1) | − (entre −1 et 0) |\n| Gamma | + | + (même gamma que le call) |\n| Vega | + | + |\n| Theta | − en général | − en général (peut être + pour un put européen très dans la monnaie) |\n| Rho | + | − |\nÊtre long d'une option, c'est être long de la convexité (gamma, vega) et payer le temps (theta).",
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
   "solution": "L'EDP de Black-Scholes s'écrit Θ + rSΔ + ½σ²S²Γ = rV. Pour un portefeuille delta-neutre et avec r ≈ 0 : **Θ ≈ −½σ²S²Γ**.\nInterprétation : être long gamma (on gagne sur les grands mouvements, dans les deux sens) se paie par une perte de valeur temps chaque jour. Sur un pas dt, le PnL d'une position couverte est ≈ ½ΓS²[(ΔS/S)² − σ²dt] : on gagne si le marché bouge plus que la volatilité implicite.",
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
   "solution": "Le PnL instantané de la position couverte vaut ½ΓS²(σ_réalisée² − σ_implicite²)dt. Avec 25 % > 20 %, tu gagnes **en espérance**, mais le gain total est\n½ ∫ Γ_t S_t² (σ_r² − σ_i²) dt :\nil dépend du chemin. Si le sous-jacent bouge beaucoup quand l'option est loin de la monnaie (gamma faible), tu gagnes peu ; s'il bouge près du strike à l'approche de l'échéance (gamma fort), tu gagnes beaucoup.\nDétails : si tu couvres avec le delta calculé à la vol implicite, le PnL dépend du chemin ; avec le delta à la vol réalisée (inconnue a priori), le PnL final est déterministe mais le PnL intermédiaire fluctue.",
   "en": "You buy an option at 20% implied vol and delta-hedge it until expiry. Realized vol is 25%. Do you make money? What does the P&L depend on?",
   "relances": [
    "Comment parier sur la volatilité sans cette dépendance au chemin ? (swap de variance : son payoff est la variance réalisée moins le strike, répliqué par un portefeuille d'options pondérées en 1/K²)"
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
   "solution": "Call sans dividende : C ≥ S − K e^{−rT} > S − K (pour r > 0). L'option vaut toujours plus que sa valeur d'exercice : mieux vaut la vendre (ou garder la protection contre une baisse et payer K plus tard). Donc call américain = call européen.\nPut : exercer tôt peut être optimal si le put est très dans la monnaie, car recevoir K tout de suite rapporte des intérêts, ce qui peut valoir plus que la valeur temps restante. Le put américain vaut strictement plus que l'européen (si r > 0).\nAvec des dividendes, exercer un call juste avant le détachement peut être optimal.",
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
   "question": "Pourquoi le prix d'un call doit-il être décroissant et convexe en fonction du strike ? Que représente ∂²C/∂K² ?",
   "solution": "- **Décroissant** : un call de strike plus bas paie toujours au moins autant. Sinon : acheter le call de strike bas, vendre celui de strike haut = arbitrage.\n- **Convexe** : un butterfly (C(K − h) − 2C(K) + C(K + h)) a un payoff positif ou nul, donc un prix positif ou nul.\n- **Breeden-Litzenberger** : ∂²C/∂K² = e^{−rT} q(K), où q est la densité risque-neutre de S_T. Une convexité violée équivaut à une densité négative : arbitrage papillon.\nC'est exactement ce que contrôle la condition g(k) ≥ 0 de Gatheral-Jacquier dans ton projet de surface de volatilité.",
   "en": "Why must the call price be decreasing and convex in the strike? What does ∂²C/∂K² represent?",
   "relances": [
    "Quelles bornes encadrent la pente ∂C/∂K ? (entre −e^{−rT} et 0)"
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
   "solution": "**max(S − K e^{−rT}, 0) ≤ C ≤ S.**\n- C ≤ S : le call paie au plus S_T.\n- C ≥ S − K e^{−rT} : le call domine un forward acheté (payoff max(S_T − K, 0) ≥ S_T − K).\n- C ≥ 0.\nPour un put : max(K e^{−rT} − S, 0) ≤ P ≤ K e^{−rT}.",
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
   "solution": "F = S e^{(r − q)T} = 100 e^{0,03} ≈ **103,05**.\nRéplication : emprunter S pour acheter l'action, recevoir les dividendes, rembourser S e^{rT} ; le forward doit coûter ce que coûte ce portage.",
   "en": "Stock at 100, continuous rate 5%, continuous dividend yield 2%. One-year forward price?",
   "relances": [
    "Et avec un dividende discret D versé avant l'échéance ? (F = (S − D e^{−rt_D}) e^{rT})"
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
   "solution": "Moins chère (à la monnaie) : la moyenne est moins volatile que le prix final. Pour un brownien, la moyenne sur [0, T] a une variance T/3 contre T pour la valeur finale : volatilité effective ≈ σ/√3.\nPas de formule fermée pour la moyenne arithmétique (une somme de log-normales n'est pas log-normale) : Monte-Carlo, avec l'asiatique géométrique (formule fermée) comme variable de contrôle.",
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
   "solution": "L'erreur standard vaut σ/√N : diviser l'erreur par 10 coûte 100 fois plus de trajectoires, d'où l'intérêt de réduire σ.\n- **Variables antithétiques** : utiliser Z et −Z ; efficace si le payoff est monotone en Z.\n- **Variable de contrôle** : ajouter c(Y − E[Y]) avec Y corrélé au payoff et E[Y] connu (le sous-jacent actualisé, une asiatique géométrique, un call vanille).\n- **Échantillonnage préférentiel** : tirer davantage là où le payoff compte (options très hors de la monnaie), corriger par le rapport de vraisemblance.\n- Aussi : quasi-Monte-Carlo (suites de Sobol), stratification, conditionnement.",
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
   "solution": "- **Explicite** : simple, mais stable seulement si Δt ≤ Δx²/(σ²S²) environ (condition de type CFL) : pas de temps minuscules quand la grille s'affine.\n- **Implicite** : inconditionnellement stable, système tridiagonal à résoudre à chaque pas (algorithme de Thomas, O(n)), précision d'ordre 1 en temps.\n- **Crank-Nicolson** : ordre 2 en temps et stable, mais produit des oscillations parasites sur des payoffs non lisses (digitales, strike d'un call) : on démarre par quelques pas implicites (lissage de Rannacher).\nAutres points : conditions aux bords, grille en log S, maillage resserré autour du strike et des barrières.",
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
   "solution": "- **Volatilité locale** : σ(t, S) déterministe, déduite de toute la surface de vanilles par la formule de Dupire. Elle reproduit exactement les vanilles d'aujourd'hui.\n- **Volatilité stochastique** : la variance a sa propre dynamique (Heston : retour à la moyenne, vol de vol, corrélation spot-vol). Calibration approximative du smile, surtout pour les maturités courtes.\nLes deux peuvent donner les mêmes vanilles mais pas la même **dynamique du smile** : en vol locale, quand le spot bouge, le smile se déplace dans le sens opposé à celui observé sur le marché (critique de Hagan et al., 2002, à l'origine de SABR), et les smiles futurs (forward) s'aplatissent ; en vol stochastique, le smile se déplace avec le spot et les smiles futurs gardent leur forme. Les produits sensibles au smile forward (options à départ différé, cliquets, barrières, variance options) ont des prix très différents. D'où des modèles mixtes : vol locale stochastique (LSV).",
   "en": "Local volatility (Dupire) vs stochastic volatility (Heston): what are the differences, and when does it matter for pricing?",
   "relances": [
    "Formule de Dupire ? (σ²(K, T) = (∂C/∂T + (r − q)K ∂C/∂K + qC) / (½K² ∂²C/∂K²))"
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
   "solution": "dS = μS dt + √v S dW₁, dv = κ(θ − v) dt + ξ√v dW₂, d⟨W₁, W₂⟩ = ρ dt.\n- v₀ : variance actuelle (niveau des vols courtes) ;\n- θ : variance de long terme (niveau des vols longues) ;\n- κ : vitesse de retour à θ (forme de la structure par terme) ;\n- ξ : volatilité de la variance (courbure du smile) ;\n- ρ : corrélation spot-variance (pente du skew ; ρ < 0 pour les actions).\n**Feller** : 2κθ ≥ ξ² garantit que la variance ne touche pas 0. Souvent violée par les calibrations, d'où des schémas de simulation adaptés (QE d'Andersen).\nPrix : semi-analytique par la fonction caractéristique et une intégrale de Fourier (Gil-Pelaez, Carr-Madan), avec la forme « little Heston trap » pour éviter les discontinuités du logarithme complexe : c'est ce que fait un projet de surface de volatilité.",
   "en": "Write the Heston model and the role of each parameter. What is the Feller condition?",
   "relances": [
    "Pourquoi ρ < 0 donne-t-il un skew négatif ? (quand le spot baisse, la variance monte : queue gauche épaisse)"
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
   "solution": "dF = α F^β dW₁, dα = ν α dW₂, d⟨W₁, W₂⟩ = ρ dt, sur le forward F.\n- α : niveau de volatilité ; β : forme du « backbone » (comment la vol à la monnaie bouge avec F ; souvent fixé) ; ρ : pente du skew ; ν : vol de vol, courbure du smile.\nUtilisé surtout en **taux** (swaptions, caps) grâce à la formule asymptotique de Hagan qui donne directement une volatilité implicite. Limite : la formule peut donner des densités négatives pour des strikes très bas ; variantes sans arbitrage et « shifted SABR » pour les taux négatifs.",
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
   "solution": "Une option peut être **répliquée** par un portefeuille dynamique d'action et de cash (couverture en delta). Par absence d'arbitrage, son prix est le coût de cette réplication, quelles que soient les préférences des investisseurs. Comme le portefeuille couvert est sans risque, on peut faire le calcul « comme si » tout le monde était neutre au risque : tous les actifs rapportent alors le taux sans risque, et le prix est l'espérance actualisée du payoff sous cette probabilité Q.\nLe rendement espéré μ disparaît parce que le risque directionnel est neutralisé par la couverture : seule la volatilité compte. μ influence les probabilités réelles d'exercice, pas le prix.",
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
   "solution": "dS = μS dt + σS dW. Par Itô : dV = (V_t + μS V_S + ½σ²S² V_SS) dt + σS V_S dW.\nPortefeuille Π = V − Δ S : dΠ = dV − Δ dS. Avec **Δ = V_S**, le terme en dW (et μ) disparaît :\ndΠ = (V_t + ½σ²S² V_SS) dt.\nSans risque, il doit rapporter le taux sans risque : dΠ = rΠ dt = r(V − S V_S) dt. D'où\n**V_t + rS V_S + ½σ²S² V_SS − rV = 0**, avec la condition terminale V(T, S) = payoff.",
   "en": "Derive the Black-Scholes PDE.",
   "indice": "Portefeuille Π = V − ΔS, applique Itô à V(t, S), choisis Δ pour annuler le terme en dW.",
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
   "solution": "8 ≈ 0,8 × σ × 100 × √0,25 = 40σ, donc **σ ≈ 20 %** (l'inversion exacte de Black-Scholes donne 20,06 %).\nRéflexe utile chez un teneur de marché : un straddle à la monnaie coûte environ l'écart-type du sous-jacent à l'échéance × 0,8 (car E|Z| = √(2/π) ≈ 0,8).",
   "en": "A 3-month ATM straddle on an underlying at 100 (zero rates) trades at 8. What implied volatility, mentally?",
   "indice": "Straddle à la monnaie ≈ 0,8·σ·S·√T.",
   "relances": [
    "Le mouvement quotidien moyen attendu correspondant ? (σ/√252 ≈ 1,26 % par jour, soit environ 1 point)"
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
   "question": "Dans Black-Scholes avec taux nuls, S₀ = 100, σ = 20 %, combien vaut un contrat qui paie S_T² dans 1 an ?",
   "solution": "Sous Q, S_T = S₀ exp(−σ²T/2 + σW_T), donc S_T² = S₀² exp(−σ²T + 2σW_T) et E[S_T²] = S₀² exp(−σ²T + 2σ²T) = S₀² e^{σ²T}.\nPrix : 10 000 × e^{0,04} ≈ **10 408,1**.",
   "en": "In Black-Scholes with zero rates, S₀ = 100, σ = 20%, what is the price of a contract paying S_T² in one year?",
   "relances": [
    "Plus généralement, prix de S_T^n ? (S₀ⁿ exp(n(r − σ²/2)T + n²σ²T/2) × e^{−rT})"
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
   "solution": "À peu près, mais pas exactement :\n- la probabilité risque-neutre d'exercice est N(d₂), légèrement inférieure à N(d₁) = delta ;\n- la probabilité réelle dépend de la dérive réelle μ, pas de r.\nEn pratique les traders utilisent le delta comme approximation rapide de la probabilité d'exercice, en sachant que l'écart grandit avec σ√T.",
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
   "solution": "- **Taux en hausse** : le forward S e^{rT} monte et le strike actualisé K e^{−rT} baisse : le call prend de la valeur (rho > 0), le put en perd.\n- **Dividende plus élevé** : le forward baisse (l'action perd le dividende au détachement) : le call perd de la valeur, le put en gagne.\nRaisonner en forward évite les erreurs : un call est un call sur le forward.",
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
   "solution": "q = (100 − 80)/(120 − 80) = 1/2. Prix = q × 20 + (1 − q) × 0 = **10**.\nPar réplication : Δ = (20 − 0)/(120 − 80) = 0,5 action ; le portefeuille 0,5 action − 40 de cash vaut 20 ou 0, comme le call ; il coûte 50 − 40 = 10.",
   "en": "A stock at 100 will be worth 120 or 80 in one year. Zero rates. What is a one-year call struck at 100 worth?",
   "indice": "Probabilité risque-neutre q telle que l'action soit une martingale : 100 = 120q + 80(1 − q).",
   "relances": [
    "Et si la vraie probabilité de hausse est 90 % ? (le prix ne change pas : seule compte la réplication)",
    "Et avec un taux de 5 % sur la période ? (q = (105 − 80)/40 = 0,625 ; prix 0,625 × 20/1,05 ≈ 11,90)"
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
   "question": "Même arbre à une période (100 → 120 ou 80, taux nul). Combien d'actions faut-il détenir pour couvrir un call vendu de strike 100 ?",
   "solution": "Δ = (C_haut − C_bas)/(S_haut − S_bas) = (20 − 0)/(120 − 80) = **0,5** action. C'est l'équivalent discret de ∂C/∂S.",
   "en": "One-period tree (100 → 120 or 80, zero rates). How many shares hedge a short call struck at 100?",
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
   "solution": "q = (1 − 0,9)/(1,1 − 0,9) = 1/2. Valeurs finales : 121 (proba 1/4), 99 (1/2), 81 (1/4). Seul 121 paie 21 : prix = 21/4 = **5,25**.",
   "en": "Two-step tree: each step the stock is multiplied by 1.1 or 0.9. Start at 100, zero rates. Price of a European call struck at 100 after two steps?",
   "relances": [
    "Pourquoi l'arbre est-il « recombinant » ? (haut puis bas = bas puis haut : 99 ; le nombre de nœuds croît linéairement)",
    "Lien avec Black-Scholes ? (avec u = e^{σ√Δt}, d = 1/u et Δt → 0, le prix converge vers Black-Scholes : Cox-Ross-Rubinstein)"
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
   "solution": "q = 0,625. Valeurs finales : 144, 96, 64 ; payoffs du put : 0, 4, 36.\n- Nœud 120 : continuation (0,625 × 0 + 0,375 × 4)/1,05 ≈ 1,43 ; exercice 0 → **1,43**.\n- Nœud 80 : continuation (0,625 × 4 + 0,375 × 36)/1,05 ≈ 15,24 ; exercice 20 → **20** (on exerce tôt).\n- Racine : (0,625 × 1,43 + 0,375 × 20)/1,05 ≈ **7,99**.\nLe put européen vaut 6,29 : l'exercice anticipé vaut environ 1,70.",
   "en": "Two-period tree: stock at 100, multiplied by 1.2 or 0.8 each period; interest 5% per period. Price of an American put struck at 100?",
   "indice": "q = (1,05 − 0,8)/(1,2 − 0,8). À chaque nœud intermédiaire, compare la valeur de continuation à l'exercice immédiat.",
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
   "question": "Black-Scholes, taux nuls, σ = 20 %, S₀ = 100. Une option démarre dans un an : à cette date, on reçoit un call à la monnaie (strike = cours du jour) de maturité un an. Que vaut-elle aujourd'hui ?",
   "solution": "Dans un an, le call à la monnaie vaudra S₁ × c, où c = 2N(σ/2) − 1 est le prix d'un call à la monnaie pour un sous-jacent valant 1 (homogénéité de Black-Scholes). Aujourd'hui : E[S₁] × c = 100 × (2N(0,1) − 1) ≈ **7,97**, comme un call à la monnaie démarrant tout de suite.\nC'est un produit sensible au **smile futur** (forward) : en vol locale et en vol stochastique, les prix diffèrent, d'où son usage pour départager les modèles.",
   "en": "Black-Scholes, zero rates, σ = 20%, S₀ = 100. A forward-start option: in one year you receive a one-year at-the-money call (strike = spot then). What is it worth today?",
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
   "question": "Deux actions valent chacune 100, avec des volatilités de 20 %, une corrélation de 0,5, sans dividende. Que vaut l'option d'échanger l'action B contre l'action A dans un an (payoff max(A − B, 0)) ?",
   "solution": "Formule de Margrabe : le taux d'intérêt disparaît, et la volatilité effective est √(0,04 + 0,04 − 2 × 0,5 × 0,04) = 20 %. Le prix est celui d'un call à la monnaie avec σ = 20 % : 100(2N(0,1) − 1) ≈ **7,97**.\nPlus la corrélation est forte, moins l'option vaut (ρ = 1 et même volatilité : prix nul).",
   "en": "Two stocks both at 100, 20% vol each, correlation 0.5, no dividends. What is the option to exchange B for A in one year (payoff max(A − B, 0)) worth?",
   "indice": "Prends B comme numéraire : c'est un call de strike 1 sur A/B. Volatilité du ratio : √(σ_A² + σ_B² − 2ρσ_Aσ_B).",
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
   "solution": "Payoff : N × (variance réalisée − K_var), où la variance réalisée est la moyenne annualisée des carrés des rendements logarithmiques quotidiens.\n**Réplication** (sans modèle, si les trajectoires sont continues) : un portefeuille statique d'options hors de la monnaie de tous les strikes, pondérées en 1/K², plus une couverture dynamique en delta (position en 1/S). Le strike équitable est donc lisible sur la surface de volatilité ; c'est le principe du VIX.\n**Strike au-dessus de la vol ATM** : les poids en 1/K² donnent beaucoup d'importance aux puts de strike bas, plus chers en vol à cause du skew.\nLe payoff est convexe en volatilité : un swap de vol (sur l'écart-type) vaut moins que la racine du strike de variance (ajustement de convexité). Risque : les sauts et les krachs, qui font exploser la variance réalisée (pertes énormes pour les vendeurs en 2008).",
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
   "solution": "Une option sur un actif coté dans une devise étrangère, mais payée dans la devise domestique à un taux de change fixé d'avance (par exemple un call sur le Nikkei payé en euros, 1 point = 1 €).\nPour la valoriser en mesure risque-neutre domestique, le sous-jacent étranger reçoit une dérive corrigée : r_f − q − ρ σ_S σ_X, où ρ est la corrélation entre l'actif et le taux de change (domestique par unité étrangère). Si l'actif a tendance à monter quand la devise étrangère baisse, le quanto est plus cher pour l'acheteur d'un call, etc. Le vendeur est exposé à la corrélation, difficile à couvrir.",
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
   "solution": "- **Erreur de couverture** : entre deux réajustements, le gamma crée un PnL ½ΓS²[(ΔS/S)² − σ²Δt] qui ne s'annule qu'en moyenne. L'écart-type de l'erreur totale décroît en √Δt : diviser l'erreur par 2 demande 4 fois plus de réajustements.\n- **Coûts** : chaque réajustement coûte ; avec des réajustements plus fréquents, les coûts explosent. Il y a un arbitrage entre risque et coûts : couverture par bandes autour du delta cible (Whalley-Wilmott), ou volatilité modifiée de Leland (le vendeur d'options utilise une vol majorée pour payer ses coûts).\n- En pratique : couverture plus fréquente près de l'échéance et du strike (gamma fort), tolérance plus large ailleurs.",
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
   "solution": "L'action a un delta de 1 mais un gamma nul : elle ne peut pas neutraliser le gamma. Il faut d'abord une **autre option** (par exemple un call d'un autre strike ou d'une autre maturité) en quantité Γ_vendu/Γ_option pour annuler le gamma ; cette option apporte son propre delta. Ensuite, on annule le delta total avec l'action. Si on veut aussi neutraliser le vega, il faut une deuxième option (deux équations, deux inconnues) ; l'ordre « options d'abord, action en dernier » vaut toujours.",
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
   "solution": "- **Non stockable** à grande échelle (ou très cher : batteries, barrages, STEP) : l'offre doit égaler la demande à chaque instant, d'où des **pics de prix** et une volatilité très forte.\n- **Saisonnalité** à plusieurs échelles : heure de la journée, jour de la semaine, saison (chauffage, climatisation).\n- **Retour à la moyenne** rapide après les chocs (pannes, vagues de froid), avec des sauts.\n- **Livraison sur une période** (une heure, un jour, un mois, un trimestre, une année ; produits base et pointe) plutôt qu'à une date.\n- **Dépendance à la météo** (température, vent, ensoleillement, hydraulicité) et aux combustibles (gaz, charbon) et au prix du CO₂.\n- **Prix négatifs** possibles.\nConséquence : les modèles de type Black-Scholes s'appliquent mal au prix spot ; on modélise plutôt la courbe forward, avec retour à la moyenne, saisonnalité et sauts.",
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
   "question": "Une centrale au gaz a un rendement de 50 % (il faut 2 MWh de gaz pour produire 1 MWh d'électricité). L'électricité vaut 90 €/MWh, le gaz 35 €/MWh. Quel est le spark spread (marge brute par MWh électrique, hors CO₂) ?",
   "solution": "Spark spread = prix de l'électricité − taux de chaleur × prix du gaz = 90 − 2 × 35 = **20 €/MWh**.\nLa centrale produit quand le spread couvre ses coûts variables : c'est une **option** sur le spread (voir la fiche sur la valeur d'une centrale).",
   "en": "A gas plant has 50% efficiency (heat rate 2). Power is €90/MWh, gas €35/MWh. What is the spark spread per MWh of electricity (excluding CO₂)?",
   "relances": [
    "Et le « clean spark spread » ? (on retire aussi le coût du CO₂ : émissions par MWh électrique × prix du quota)",
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
   "question": "Même centrale (rendement 50 %, électricité 90 €/MWh, gaz 35 €/MWh). Elle émet 0,4 tonne de CO₂ par MWh électrique et le quota coûte 80 €/t. Que vaut le clean spark spread ? La centrale doit-elle produire ?",
   "solution": "90 − 2 × 35 − 0,4 × 80 = 90 − 70 − 32 = **−12 €/MWh**. Négatif : produire à ces prix fait perdre de l'argent sur les coûts variables, la centrale ne devrait pas tourner (sauf contraintes techniques, services au réseau ou couverture déjà vendue).",
   "en": "Same plant (heat rate 2, power €90, gas €35). It emits 0.4 t CO₂ per MWh and allowances cost €80/t. Clean spark spread? Should it run?",
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
   "solution": "Pour chaque heure, l'exploitant peut produire (et gagner le spread P − H·G − c) ou s'arrêter (gain nul) : le gain est **max(P − H·G − c, 0)**, une option d'échange (spread option) entre électricité et gaz. La centrale est une suite d'options horaires : sa valeur augmente avec la volatilité du spread et diminue avec la corrélation électricité-gaz (comme l'option de Margrabe).\nValorisation :\n- approche simple : somme d'options de spread (formule de Margrabe si c = 0, approximation de Kirk sinon) sur les forwards ;\n- approche réaliste : Monte-Carlo de prix horaires (retour à la moyenne, saisonnalité, sauts, corrélation) avec contraintes techniques (temps de démarrage, coûts de démarrage, durée minimale de fonctionnement) résolues par programmation dynamique ou Longstaff-Schwartz.\nC'est aussi la logique de la couverture : vendre à terme la production attendue (le delta) et ajuster.",
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
   "solution": "Modèle de Schwartz à un facteur : le logarithme du prix suit un Ornstein-Uhlenbeck,\nd ln S = κ(μ − ln S) dt + σ dW (on ajoute une saisonnalité déterministe pour l'électricité).\nLe log du forward F(t, T) est une moyenne pondérée entre le log spot actuel et le niveau de long terme, avec un poids e^{−κ(T−t)} sur le spot : les forwards lointains bougent peu quand le spot bouge. Leur volatilité vaut σ e^{−κ(T−t)} : c'est l'**effet Samuelson** (volatilité décroissante avec la maturité).\nExtensions : modèle à deux facteurs (court terme et long terme, Schwartz-Smith), sauts et changements de régime pour les pics de l'électricité.",
   "en": "Which simple model would you use for a mean-reverting commodity spot price? What does the forward price become?",
   "relances": [
    "Lien avec tes projets ? (le spread du projet stat arb est aussi un processus d'Ornstein-Uhlenbeck : même demi-vie ln 2/κ)"
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
   "question": "Une entreprise vaut, pour son propriétaire, un montant uniforme entre 0 et 100 qu'il est seul à connaître. Entre tes mains, elle vaudrait 1,5 fois ce montant. Tu fais une seule offre b ; il accepte si b dépasse la valeur pour lui. Quelle offre maximise ton gain espéré ?",
   "solution": "Si b est accepté, la valeur pour le propriétaire est uniforme sur [0, b], de moyenne b/2 ; pour toi elle vaut 1,5 × b/2 = 0,75 b < b. Chaque offre acceptée perd 0,25 b en moyenne : gain espéré = (b/100) × (−0,25 b) < 0. Meilleure offre : **0** (ne rien proposer).\nC'est la **malédiction du vainqueur** : être accepté est une information défavorable. Même mécanisme que la sélection adverse d'un teneur de marché.",
   "en": "A company is worth U(0, 100) to its owner, who alone knows the value. In your hands it is worth 1.5 times that. You make one bid b; the owner accepts if b exceeds his value. What bid maximizes your expected profit?",
   "indice": "Sachant que ton offre b est acceptée, quelle est la valeur moyenne de l'entreprise ?",
   "piege": "Raisonner sur la valeur moyenne non conditionnelle (50 × 1,5 = 75) et offrir jusqu'à 75.",
   "relances": [
    "À partir de quel multiplicateur l'offre devient-elle intéressante ? (au-delà de 2 : valeur conditionnelle k·b/2 ≥ b)"
   ],
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
   "solution": "Chaque proposition coupe l'intervalle en deux : 2⁷ − 1 = 127 ≥ 100 > 63 = 2⁶ − 1. Il faut **7** propositions au pire.",
   "en": "I think of an integer from 1 to 100. You guess; I answer higher, lower or correct. Worst-case number of guesses with the best strategy?",
   "relances": [
    "Si je te paie 100 − 10 × (nombre d'essais), combien paierais-tu pour jouer ? (calcule le nombre moyen d'essais de la dichotomie : 5,8 environ, donc environ 42)"
   ],
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
   "solution": "Même méthode que pour deux piles (états 0, 1, 2 piles consécutifs), ou formule 2^(n+1) − 2 : **14**.\nVérification avec les états : E₂ = 1 + E₀/2, E₁ = 1 + E₂/2 + E₀/2, E₀ = 1 + E₁/2 + E₀/2 donne E₀ = 14.",
   "en": "Expected number of fair coin flips to get three heads in a row?",
   "reponse": "14",
   "valeur": 14.0,
   "tolerance": 0.005,
   "duree": 120
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
   "question": "Une marche aléatoire part de 0 et fait des pas de +1 ou −1 avec probabilité 1/2. Combien de pas en moyenne avant d'atteindre +10 ou −10 ?",
   "solution": "S_n² − n est une martingale : E[T] = E[S_T²] = **100**. Plus généralement, sortir de ]−a, b[ prend ab pas en moyenne : il faut environ a² pas pour s'éloigner de a, la diffusion est en √n.",
   "en": "A symmetric ±1 random walk starts at 0. Expected number of steps to reach +10 or −10?",
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
   "solution": "V = −0,01 + E[max(X, V)], donc 0,01 = E[(X − V)⁺] = (1 − V)²/2. D'où V = 1 − √0,02 ≈ **0,859** : on s'arrête dès qu'un tirage dépasse 0,859.\nMême logique que l'exercice d'une option américaine : on arrête quand la valeur immédiate dépasse la valeur de continuation.",
   "en": "You may draw as many uniform [0, 1] numbers as you like, each draw costing 0.01. When you stop you win the last number drawn. What is the game worth under optimal play?",
   "indice": "La meilleure stratégie est un seuil : s'arrêter dès que le tirage dépasse la valeur V du jeu.",
   "relances": [
    "Si le tirage est gratuit mais limité à 3 tirages ? (récurrence à rebours : 0,5 ; 0,625 ; 0,695)"
   ],
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
   "question": "On lance une pièce jusqu'au premier « face ». Si cela arrive au lancer n, tu gagnes 2ⁿ euros. Combien paierais-tu pour jouer ?",
   "solution": "L'espérance est infinie : Σ (1/2)ⁿ × 2ⁿ = 1 + 1 + 1 + … Pourtant personne ne paierait une grosse somme. Explications à donner :\n- **Contrepartie limitée** : la banque ne peut pas payer plus que ce qu'elle possède. Si elle a 1 milliard (≈ 2³⁰), l'espérance tombe à environ 31 €.\n- **Utilité** : avec une utilité logarithmique, l'équivalent certain est faible (Bernoulli, 1738).\n- **Variance et horizon** : on ne joue pas assez de fois pour que la moyenne s'applique ; la médiane du gain est 2 à 4 €.\nRéponse attendue : un prix chiffré et justifié (« une vingtaine d'euros, parce que… »), pas « l'infini ».",
   "en": "St. Petersburg game: a coin is flipped until the first tails; if it happens on flip n you win 2ⁿ. How much would you pay to play?"
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
   "en": "Two envelopes, one holds twice the other. You open one: $100. \"The other holds 50 or 200 with equal probability, so 125 on average: switch.\" What is wrong?"
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
   "solution": "Égalités relancées : on conditionne sur « pas d'égalité ». Par symétrie, P = **1/2**. (Sans relance : 15/36 = 5/12.)",
   "en": "Two dice are rolled; you bet that the first is larger than the second, with ties re-rolled. Probability of winning?",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 180
  },
  {
   "id": "jeu-pieces-alice-bob",
   "theme": "probas",
   "niveau": 3,
   "profils": [
    "mm",
    "hf"
   ],
   "type": "numerique",
   "question": "Alice lance une pièce 10 fois, Bob 11 fois. Probabilité que Bob obtienne strictement plus de « pile » qu'Alice ?",
   "solution": "Compare d'abord les 10 premiers lancers de Bob à ceux d'Alice : Bob est devant (p), à égalité (q) ou derrière (p) par symétrie. Bob gagne s'il est devant, ou à égalité et que son 11ᵉ lancer est pile : p + q/2 = (2p + q)/2 = **1/2**.",
   "en": "Alice flips a coin 10 times, Bob 11 times. Probability that Bob gets strictly more heads than Alice?",
   "reponse": "1/2",
   "valeur": 0.5,
   "tolerance": 0.005,
   "duree": 300
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
   "solution": "Non. La plus longue suite de piles en n lancers est de l'ordre de log₂(n) : en moyenne environ 6 pour n = 100, et la probabilité d'avoir une suite d'au moins 5 piles dépasse 80 % (≈ 0,81). Le pari est défavorable.\nMessage : l'intuition sous-estime la longueur des séries dans le hasard (les « séries » d'un trader ou d'un gérant peuvent être du pur hasard).",
   "en": "\"I flip a coin 100 times; if the longest run of heads is at least 5, I win $10, otherwise you win $10.\" Do you accept?",
   "relances": [
    "Comment le calculer exactement ? (chaîne de Markov sur la longueur de la série en cours, ou récurrence sur le nombre de suites sans série de 5)"
   ]
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
   "solution": "B doit gagner les 3 manches suivantes pour l'emporter : probabilité (1/2)³ = 1/8. A gagne avec probabilité **7/8** : 87,50 € pour A, 12,50 € pour B. C'est le problème des partis (Pascal et Fermat, 1654), à l'origine du calcul des probabilités et, en un sens, de la valorisation par espérance.",
   "en": "Two equally skilled players play first to 5 wins, each staking $50. Play stops at 4–2 for A. What fair fraction of the pot goes to A?",
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
   "solution": "Critère de Kelly : maximiser E[ln(richesse)] = p ln(1 + f) + q ln(1 − f). Dérivée nulle : p/(1 + f) = q/(1 − f), donc **f* = p − q = 0,2** (20 %).\nFormule générale pour une cote b contre 1 : f* = (bp − q)/b, soit « avantage / cote ».",
   "en": "A coin lands heads with probability 0.6. You can repeatedly bet a fraction of your wealth at even odds. What fraction maximizes long-run growth?",
   "relances": [
    "Que se passe-t-il si tu mises 40 % ? (croissance nulle à long terme : à 2f* la croissance retombe à environ zéro ; au-delà, ruine presque sûre)",
    "Pourquoi les praticiens misent-ils souvent « demi-Kelly » ? (incertitude sur p, volatilité énorme de Kelly plein ; demi-Kelly garde 75 % de la croissance avec moitié moins de volatilité)",
    "Lien avec le Sharpe ? (en continu, fraction optimale = μ/σ², croissance = SR²/2)"
   ],
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
   "solution": "f* = (bp − q)/b = (2 × 0,4 − 0,6)/2 = **0,1** (10 %). Espérance par euro : 0,4 × 2 − 0,6 = 0,2 > 0, mais le pari perd souvent : on mise peu.",
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
   "question": "On lance un dé. Combien vaut une option qui paie max(résultat − 3, 0) ?",
   "solution": "Paiements 0, 0, 0, 1, 2, 3 : espérance (1 + 2 + 3)/6 = **1**.",
   "en": "A die is rolled. What is an option paying max(result − 3, 0) worth?",
   "relances": [
    "Et le « put » max(3 − résultat, 0) ? ((2 + 1 + 0)/6 = 0,5) ; vérifie la parité : call − put = E[X] − 3 = 0,5",
    "Combien vaut un call de strike 3,5 ? ((0,5 + 1,5 + 2,5)/6 = 0,75)"
   ],
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
   "solution": "On résout la récurrence à rebours avec V(r, 0) = r (on prend toutes les rouges restantes) et V(0, n) = 0 (on s'arrête). Pour 26/26, **V ≈ 2,62 €**.\nIntuition : le jeu vaut au moins 0 (on peut s'arrêter tout de suite, et on finit sinon à 0) ; l'option de s'arrêter a de la valeur car on arrête quand on est en avance et que le paquet restant penche contre nous.",
   "en": "A deck of 26 red and 26 black cards is turned over one card at a time. Each red pays you $1, each black costs you $1, and you may stop at any time. What is the value of the game under optimal play (approximately)?",
   "indice": "Programmation dynamique sur (rouges restantes, noires restantes) : V(r, n) = max(0, r/(r+n)·(1 + V(r−1, n)) + n/(r+n)·(−1 + V(r, n−1))).",
   "relances": [
    "Combien paierais-tu pour jouer ? (moins de 2,62 € ; un teneur de marché coterait autour)",
    "Et si on ne peut s'arrêter qu'au milieu du paquet ? (calcule : il faut alors l'espérance de max(gain à 26 cartes, 0))"
   ],
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
   "solution": "Espérance : 7 ; écart-type : √(2 × 35/12) ≈ 2,4. Un marché raisonnable : 6,5 à 7,5 (ou plus large si la contrepartie est bien informée).\nAprès « premier dé = 6 » : espérance 6 + 3,5 = 9,5, écart-type 1,7. Nouveau marché autour de 9,5 (par exemple 9 à 10). Tu es vendeur d'une unité à 7,5 : tu perds en moyenne 2 sur cette position, à couvrir en achetant.\nRéflexes à montrer : recalculer l'espérance à chaque information, adapter l'écart à l'incertitude restante, tenir compte de ta position.",
   "en": "\"Make me a market on the sum of two dice.\" Then: \"I buy at your offer. The first die shows 6. New market?\"",
   "relances": [
    "Et si on te dit seulement « au moins un dé fait 6 » ? (espérance conditionnelle : (somme sur les 11 cas)/11 = 102/11 ≈ 9,27)"
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
   "solution": "Trois composantes classiques :\n1. **coûts de traitement** (frais, infrastructure) ;\n2. **risque d'inventaire** : le teneur porte une position qui peut perdre (proportionnel à la volatilité et au temps de détention, comme le terme γσ²(T − t) d'Avellaneda-Stoikov) ;\n3. **sélection adverse** : compensation des pertes contre les contreparties informées.\nIl est plus large quand la volatilité est forte, la liquidité faible (petites capitalisations, obligations peu échangées), l'information asymétrique (avant des résultats), la concurrence entre teneurs faible, ou le pas de cotation grand.",
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
   "solution": "Loi empirique en racine carrée : impact ≈ Y σ_jour √(Q/V), avec Y de l'ordre de 1. Ici √0,05 ≈ 0,22 : impact ≈ 0,2 à 0,25 fois la volatilité quotidienne (par exemple 40 points de base pour 2 % de volatilité).\nExécution : découper l'ordre dans le temps (TWAP, VWAP suivant la courbe de volume, participation fixe), arbitrer entre impact (aller vite coûte) et risque de prix (aller lentement expose aux mouvements) : modèle d'Almgren-Chriss. Mélanger ordres passifs et agressifs, utiliser des plateformes sans pré-transparence pour les gros blocs.\nMesure : implementation shortfall (prix moyen obtenu contre le prix au moment de la décision).",
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
   "solution": "Développement de Taylor (PnL explain) :\nPnL ≈ Δ·δS (≈ 0 si couvert) + ½Γ·δS² + Θ·δt + Vega·δσ + Vanna·δS·δσ + ½Volga·δσ² + Rho·δr + résidu.\n- **Gamma contre theta** : on gagne si le mouvement réalisé dépasse ce que le theta payé suppose.\n- **Vega** : variation de la volatilité implicite (niveau, pente, courbure du smile).\n- **Résidu** inexpliqué : signale un modèle ou des données de marché faux ; c'est ce que surveillent les contrôleurs de risque.",
   "en": "How do you decompose the daily P&L of a delta-hedged options book?"
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
   "solution": "Indice de volatilité implicite à 30 jours du S&P 500, calculé sans modèle à partir d'un panier d'options hors de la monnaie pondérées en 1/K² : c'est la racine du prix d'un swap de variance à 30 jours (×100).\nOn ne peut pas acheter l'indice lui-même : on traite des futures et des options sur VIX. Les futures sont en général en **contango** (plus chers que l'indice), d'où des pertes régulières pour les produits « long VIX » qui roulent les futures. Le VIX monte quand le marché baisse (corrélation négative), avec des pics lors des crises.",
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
   "solution": "L'espérance est positive (+1 million), mais la réponse dépend de ta richesse et de ton aversion au risque : perdre 1 million que tu n'as pas est une ruine. Ce que l'intervieweur veut entendre :\n- l'espérance seule ne suffit pas : c'est l'utilité, ou la croissance du capital (Kelly), qui compte ;\n- une fraction de Kelly : p − q/b = 0,5 − 0,5/3 = 1/3 de ta richesse : ce pari n'a de sens que si 1 million représente au plus un tiers de ce que tu possèdes ;\n- des solutions créatives : vendre une partie du pari à d'autres (syndication), demander à le jouer en plus petit et plusieurs fois.\nPuis donner une réponse nette : « Je refuse à titre personnel ; une entreprise avec 100 millions de capital devrait l'accepter. »",
   "en": "I offer you a bet: fair coin, heads you win €3m, tails you lose €1m. One time only. Do you take it?"
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
   "question": "Jeu 1 : on lance deux dés indépendants A et B, tu reçois A × B / 3,5 €. Jeu 2 : on lance un seul dé A, tu reçois A × A / 3,5 €. Le jeu 1 vaut 3,5 €. Combien vaut le jeu 2 ?",
   "solution": "E[A²]/3,5 = (91/6)/3,5 = 3,5 + Var(A)/3,5 = 3,5 + (35/12)/3,5 ≈ **4,33 €**.\nQuand la même variable apparaît deux fois, l'espérance du produit dépasse le produit des espérances de sa variance : c'est l'effet de convexité qui fait que E[S²] > E[S]².",
   "en": "Game 1: two independent dice A and B, you receive A·B/3.5. Game 2: one die A, you receive A·A/3.5. Game 1 is worth 3.5. What is game 2 worth?",
   "piege": "Répondre 3,5 en appliquant E[XY] = E[X]E[Y] : c'est faux sans indépendance.",
   "relances": [
    "Et si A et B sont corrélés positivement mais pas identiques ? (E[AB] = 3,5² + Cov(A, B), entre les deux)"
   ],
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
   "solution": "Erreur de prévision attendue = biais² + variance + bruit irréductible.\n- **Biais** : erreur due à un modèle trop simple (une droite pour une relation courbe) : sous-apprentissage.\n- **Variance** : sensibilité du modèle à l'échantillon d'entraînement (un polynôme de degré 20 change complètement si on change quelques points) : sur-apprentissage.\nAugmenter la complexité réduit le biais et augmente la variance ; on choisit la complexité par validation (croisée ou hors échantillon).\nEn finance, le rapport signal/bruit est très faible : la variance domine, d'où des modèles simples, fortement régularisés, et beaucoup de méfiance envers les bons résultats en échantillon.",
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
   "solution": "On ajoute λ‖β‖² (Ridge) ou λ‖β‖₁ (Lasso) à la somme des carrés des résidus.\n- **Ridge** : rétrécit tous les coefficients vers 0 sans les annuler ; stabilise les variables colinéaires (répartit le poids) ; solution fermée (XᵀX + λI)⁻¹Xᵀy.\n- **Lasso** : produit des solutions creuses (sélection de variables) ; avec des variables colinéaires, en garde une arbitrairement.\nGéométrie : la boule L1 est un losange dont les coins sont sur les axes ; les courbes de niveau de l'erreur la touchent le plus souvent en un coin, donc avec des coefficients nuls. La boule L2 est ronde : pas de coin.\nElastic net : mélange des deux. Vue bayésienne : Ridge = a priori gaussien, Lasso = a priori de Laplace.",
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
   "question": "Régression Ridge à une variable, sans constante : Σxᵢyᵢ = 10, Σxᵢ² = 20, pénalité λ = 5. Coefficient estimé ? (Et sans pénalité ?)",
   "solution": "β̂ = Σxy/(Σx² + λ) = 10/25 = **0,4**, contre 10/20 = 0,5 sans pénalité : le coefficient est rétréci vers zéro.",
   "en": "One-variable Ridge regression without intercept: Σxy = 10, Σx² = 20, λ = 5. Estimated coefficient? (And without penalty?)",
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
   "solution": "Non : prédire « jamais de fraude » donne déjà 99,9 %. Métriques adaptées :\n- **précision** (parmi les alertes, combien de vraies fraudes) et **rappel** (parmi les fraudes, combien détectées) ; F1 ;\n- courbe précision-rappel et son aire (plus informative que l'AUC ROC quand les positifs sont rares) ;\n- coût métier : coût d'une fraude manquée contre coût d'une fausse alerte, pour choisir le seuil.\nTraitement : pondération des classes, sous- ou sur-échantillonnage, seuil adapté.",
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
   "question": "Il y a 100 cas positifs. Ton modèle en signale 50, dont 40 sont de vrais positifs. Que vaut le score F1 ?",
   "solution": "Précision = 40/50 = 0,8 ; rappel = 40/100 = 0,4. F1 = 2PR/(P + R) = 0,64/1,2 ≈ **0,533** (moyenne harmonique : pénalise le déséquilibre).",
   "en": "There are 100 positive cases. Your model flags 50, of which 40 are true positives. What is the F1 score?",
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
   "solution": "−ln(0,8) ≈ **0,223**. Une prédiction de 0,01 pour une étiquette 1 coûterait −ln(0,01) ≈ 4,6 : la log-loss punit sévèrement la confiance mal placée.",
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
   "solution": "P(y = 1 | x) = σ(βᵀx) = 1/(1 + e^{−βᵀx}). On maximise la vraisemblance, ce qui revient à minimiser l'entropie croisée (convexe : pas de minimum local). Pas de formule fermée : Newton (IRLS) ou descente de gradient.\nInterprétation : e^{β_j} est le facteur multiplicatif de la **cote** P/(1 − P) quand x_j augmente de 1.\nUsages : score de crédit (probabilité de défaut), classification de régimes. Limites : frontière linéaire (sauf variables construites), séparation parfaite (coefficients infinis sans régularisation).",
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
   "solution": "- **Importance par impureté** (MDI) des arbres : rapide, mais biaisée vers les variables continues ou à nombreuses modalités, et calculée en échantillon.\n- **Importance par permutation** (MDA) : baisse de performance hors échantillon quand on mélange une variable. Plus fiable, mais deux variables corrélées se partagent (ou se masquent) l'importance.\n- **SHAP** : contributions additives par observation, fondées sur les valeurs de Shapley ; coûteux, mêmes difficultés avec la corrélation.\nPièges : importance ≠ causalité ; variables corrélées ; importance en échantillon qui reflète le sur-apprentissage. Solution partielle : regrouper les variables corrélées (importance par groupe).",
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
   "solution": "On met à jour θ ← θ − η ∇L(θ) en estimant le gradient sur un mini-lot au lieu de tout l'échantillon : moins cher par pas, bruité, ce bruit aidant parfois à sortir de mauvais minima.\n- η trop grand : oscillations, divergence.\n- η trop petit : convergence très lente, blocage sur des plateaux.\nAméliorations : momentum, Adam (pas adaptatif par paramètre), décroissance du taux, normalisation des variables (un problème mal conditionné force un petit η).",
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
   "solution": "Initialiser k centres ; répéter jusqu'à stabilité : affecter chaque point au centre le plus proche, puis recalculer chaque centre comme la moyenne de ses points. Minimise la somme des distances au carré intra-groupes (localement).\nLimites : k à choisir (méthode du coude, silhouette) ; dépend de l'initialisation (k-means++ et plusieurs essais) ; suppose des groupes sphériques de tailles comparables ; sensible aux échelles et aux valeurs aberrantes.\nEn finance : regrouper des actifs par profil de corrélation (plutôt avec une distance fondée sur la corrélation, ou un regroupement hiérarchique).",
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
   "solution": "Nécessaire pour les modèles sensibles aux échelles : régularisation (Ridge, Lasso), distances (k-moyennes, k plus proches voisins), descente de gradient, réseaux de neurones, ACP. Inutile pour les arbres.\nSans fuite : calculer moyenne et écart-type sur l'échantillon d'entraînement seulement (ou sur une fenêtre glissante du passé), et les appliquer tels quels au test. En séries temporelles, préférer des normalisations glissantes (z-score sur 60 jours passés), ou des rangs en coupe transversale (chaque date séparément).",
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
   "solution": "On compare les 3 × 2 = 6 paires (positif, négatif) : 0,9 bat 0,8 et 0,3 ; 0,7 bat 0,3 ; 0,4 bat 0,3. 4 paires bien ordonnées sur 6 : **AUC = 2/3**.\nCette lecture (statistique de Mann-Whitney) montre que l'AUC ne dépend que du classement des scores, pas de leur calibration.",
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
   "solution": "Loi fondamentale de la gestion active (Grinold) : IR ≈ IC × √(largeur) = 0,05 × √400 = **1**.\nMessage : une prévision faible appliquée à beaucoup de paris indépendants peut donner une bonne stratégie, d'où l'intérêt des univers larges et des horizons courts. Limites : les paris sont rarement indépendants (facteurs communs), et les coûts croissent avec la rotation.",
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
   "solution": "Ça dépend :\n- **Référence naïve** : si le marché a monté 54 % des jours sur la période de test, « toujours hausse » fait aussi bien. Comparer à la meilleure stratégie triviale.\n- **Significativité** : sur 250 jours, l'écart-type de l'exactitude d'un classifieur au hasard est √(0,25/250) ≈ 3,2 % ; 54 % n'est qu'à environ 1,3 écart-type de 50 %.\n- **Économie** : l'exactitude ignore l'ampleur des mouvements ; un modèle juste sur les petits jours et faux sur les grands perd de l'argent. Évaluer le PnL après coûts, le Sharpe, le drawdown.\n- **Stabilité** : performance par sous-période, et absence de fuite d'information.",
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
   "solution": "La variance totale est la somme des valeurs propres (la trace de la matrice) : 4/(4 + 2 + 1 + 1) = **50 %**. Les deux premières composantes : 75 %.\nSur des variables standardisées (matrice de corrélation), la somme des valeurs propres vaudrait le nombre de variables, 4 : ces valeurs propres ne peuvent donc pas venir d'une matrice de corrélation de 4 variables.",
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
   "question": "Dans une régression logistique de défaut, le coefficient de la variable « endettement » vaut 0,7. Par combien la cote du défaut (p/(1 − p)) est-elle multipliée quand l'endettement augmente d'une unité ?",
   "solution": "e^{0,7} ≈ **2,01** : la cote double environ. La probabilité, elle, ne double pas : l'effet sur p dépend du niveau de départ (dp/dx = β p(1 − p), maximal autour de p = 1/2).",
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
   "solution": "Vrais positifs 90, faux positifs 30, faux négatifs 10, vrais négatifs 870. Précision = 90/120 = **0,75** ; rappel = 90/100 = 0,9 ; taux de faux positifs = 30/900 ≈ 3,3 % ; exactitude = 960/1 000 = 96 %.",
   "en": "Out of 1,000 transactions, a fraud model raises 120 alerts, 90 of which are real frauds; there are 100 frauds in total. What is the model's precision?",
   "relances": [
    "Quel seuil choisir ? (celui qui minimise le coût attendu : coût d'une fraude manquée × faux négatifs + coût d'une alerte × faux positifs)"
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
   "question": "Avec des variables explicatives orthonormées (XᵀX = n·I), la régression Ridge multiplie chaque coefficient des moindres carrés par n/(n + λ). Avec n = 250 observations et λ = 250, quel facteur de rétrécissement ?",
   "solution": "250/(250 + 250) = **0,5** : chaque coefficient est divisé par deux. Ridge rétrécit tous les coefficients dans la même proportion dans ce cas, alors que le Lasso soustrait un seuil et met à zéro les petits coefficients (seuillage doux).",
   "en": "With orthonormal regressors (XᵀX = n·I), Ridge multiplies each OLS coefficient by n/(n + λ). With n = 250 and λ = 250, what shrinkage factor?",
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
   "solution": "Elle estime un quantile conditionnel (par exemple le 5ᵉ centile du rendement sachant des variables) en minimisant une perte asymétrique (« pinball ») : τ·e si l'erreur e est positive, (τ − 1)·e sinon. Pour τ = 0,5, c'est la médiane (perte absolue), robuste aux valeurs extrêmes.\nUsages : VaR conditionnelle (CAViaR), effet des variables sur les queues de distribution plutôt que sur la moyenne, données à queues épaisses ou hétéroscédastiques. Les moindres carrés modélisent seulement la moyenne conditionnelle et sont sensibles aux valeurs extrêmes.",
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
   "solution": "Les couples (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) : 6 sur 36, soit **1/6**. C'est la somme la plus probable.",
   "en": "You roll two fair dice. What is the probability that the sum is 7?",
   "indice": "Compte les couples (a, b) sur les 36 possibles.",
   "relances": [
    "Quelle est la loi de la somme ? (triangulaire : 1, 2, …, 6, …, 2, 1 sur 36)",
    "Et avec trois dés, quelle somme est la plus probable ? (10 et 11, 27/216 chacune)"
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
   "solution": "Couples avec au moins un 6 : 6 + 6 − 1 = **11**. Parmi eux, somme 7 : (1,6) et (6,1). Probabilité **2/11**.",
   "en": "Two dice are rolled and you are told at least one of them shows a 6. What is the probability that the sum is 7?",
   "indice": "Combien de couples contiennent au moins un 6 ? (attention à ne pas compter (6,6) deux fois)",
   "piege": "Répondre 1/6 (« le premier dé est un 6 ») : l'information « au moins un » ne désigne pas un dé précis.",
   "relances": [
    "Et si on t'avait dit « le premier dé montre 6 » ? (1/6)"
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
   "solution": "Le nombre de lancers suit une loi géométrique de paramètre p = 1/6 : espérance **1/p = 6**.\nDémonstration par conditionnement sur le premier lancer : E = 1 + (5/6)·E, donc E = 6.",
   "en": "How many rolls of a fair die do you need on average to get the first 6?",
   "relances": [
    "Variance ? ((1 − p)/p² = 30)",
    "Probabilité qu'il faille plus de 6 lancers ? ((5/6)⁶ ≈ 0,335)"
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
   "solution": "Problème du collectionneur de vignettes. Avec k faces vues, une nouvelle face sort avec probabilité (6 − k)/6 : attente géométrique de moyenne 6/(6 − k).\nTotal : 6·(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 6 × 2,45 = **14,7**.",
   "en": "What is the expected number of rolls of a fair die needed to see all six faces at least once?",
   "indice": "Découpe l'attente en étapes : quand tu as déjà vu k faces, combien de lancers pour en voir une nouvelle ?",
   "relances": [
    "Ordre de grandeur pour n faces ? (n·ln n + 0,577·n)",
    "Variance de ce temps ? (somme des variances géométriques, ≈ 38,99)"
   ],
   "reponse": "6*(1+1/2+1/3+1/4+1/5+1/6)",
   "valeur": 14.7,
   "tolerance": 0.005,
   "duree": 180,
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
   "solution": "Soit E l'attente depuis le départ, E₁ depuis « je viens d'avoir un pile ».\n- E = 1 + ½E₁ + ½E\n- E₁ = 1 + ½·0 + ½E\nDe la première : E = 2 + E₁ ; avec la seconde : E = 2 + 1 + E/2, donc **E = 6**.",
   "en": "You flip a fair coin until you get two heads in a row. What is the expected number of flips?",
   "indice": "Définis des états : rien d'utile, « un pile vient de tomber ». Écris une équation par état.",
   "relances": [
    "Et pour « pile puis face » ? (4 : une fois le pile obtenu, on attend juste un face)",
    "Pourquoi PP et PF n'ont-ils pas la même attente alors qu'ils ont la même probabilité ? (PP se chevauche avec lui-même : un échec après P vous renvoie au début)",
    "Formule générale pour n piles consécutifs ? (2^(n+1) − 2)"
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
   "solution": "Notons E₀, E₁ (après P), E₂ (après PF).\n- E₀ = 1 + ½E₁ + ½E₀\n- E₁ = 1 + ½E₁ + ½E₂ (un P de plus laisse en « P »)\n- E₂ = 1 + ½·0 + ½E₀ (un F donne « PFF » : rien d'utile)\nOn trouve E₀ = 2 + E₁, E₁ = 2 + E₂, E₂ = 1 + E₀/2, d'où E₀ = 5 + E₀/2 et **E₀ = 10**.\nMéthode rapide (martingale des parieurs, « abracadabra ») : on somme 2^k pour chaque k où le préfixe de longueur k égale le suffixe de longueur k : 2³ + 2¹ = 10.",
   "en": "What is the expected number of fair coin flips until the pattern HTH first appears?",
   "indice": "États : départ, « P », « PF ». Depuis « PF », un face te renvoie au départ, pas en « P ».",
   "relances": [
    "Et pour PFF ? (8 : aucun chevauchement, 2³)",
    "Dans une course PFP contre PFF, qui sort en premier ? (chacune avec probabilité 1/2 : après « PF », le lancer suivant décide. Une attente plus courte ne veut pas dire « gagne la course » en général : voir le jeu de Penney)"
   ],
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
   "solution": "On attend le premier P. Soit a la probabilité que PPF gagne depuis l'état « P », b depuis l'état « PF ».\n- Depuis « P » : si P, on est en « PP » et PPF gagne sûrement (un F finira par venir, et tout P maintient « PP ») ; si F, on va en « PF ». Donc a = ½·1 + ½·b.\n- Depuis « PF » : si F, PFF gagne (0) ; si P, on revient en « P ». Donc b = ½·a.\na = ½ + a/4, soit **a = 2/3**.",
   "en": "Flip a fair coin until either HHT or HTT appears. What is the probability that HHT comes first?",
   "indice": "Les deux séquences commencent par P. Une fois le premier P tombé, regarde ce que fait le lancer suivant.",
   "relances": [
    "Qu'est-ce que le jeu de Penney ? (pour toute séquence de 3 choisie par l'adversaire, il existe une séquence qui la bat : relation non transitive)"
   ],
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
   "solution": "Soit p la probabilité que A gagne. A gagne au premier lancer (1/6), ou bien A et B ratent (25/36) et on recommence : p = 1/6 + (25/36)·p, donc p = (1/6)/(11/36) = **6/11**.",
   "en": "A and B take turns rolling a die, A goes first. The first to roll a 6 wins. What is the probability that A wins?",
   "relances": [
    "Combien de lancers dure la partie en moyenne ? (6)",
    "Quel avantage A a-t-il ? (6/11 contre 5/11 : B gagne 5/6 fois moins souvent)"
   ],
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
   "solution": "Cas équiprobables : GG, GF, FG, FF. « Au moins un garçon » exclut FF : il reste 3 cas, dont un seul GG : **1/3**.",
   "en": "A family has two children, at least one of whom is a boy. What is the probability that both are boys?",
   "piege": "Si l'on t'avait dit « l'aîné est un garçon », la réponse serait 1/2. La manière dont l'information est obtenue change la réponse.",
   "relances": [
    "Variante : « au moins un garçon né un mardi » ? (13/27 : plus l'information est précise, plus on se rapproche de 1/2)"
   ],
   "reponse": "1/3",
   "valeur": 0.3333333333333333,
   "tolerance": 0.005,
   "duree": 90
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
   "solution": "Sur 10 000 personnes : 100 malades dont 99 positifs ; 9 900 saines dont 495 positives.\nP(malade | positif) = 99 / (99 + 495) = 99/594 = **1/6 ≈ 16,7 %**.\nFormule de Bayes : P(M|+) = P(+|M)P(M) / [P(+|M)P(M) + P(+|S)P(S)].",
   "en": "A disease affects 1% of the population. A test detects it in 99% of sick people but also returns a positive result for 5% of healthy people. You test positive. What is the probability you have the disease?",
   "indice": "Raisonne sur 10 000 personnes.",
   "piege": "Répondre 99 % : on confond P(positif | malade) et P(malade | positif). C'est l'erreur du taux de base (« base rate fallacy »).",
   "relances": [
    "Que se passe-t-il si tu refais un test indépendant et qu'il est encore positif ? (cote a priori 1:5 × rapport de vraisemblance 19,8 → ≈ 79,8 %)",
    "Lien avec la finance ? (un signal « précis » sur un événement rare donne surtout des faux positifs : fraude, défauts)"
   ],
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
   "solution": "Ta porte initiale a 1/3 de chances et le présentateur ne change rien à cette probabilité (il peut toujours ouvrir une porte vide). Les 2/3 restants se concentrent sur l'autre porte fermée : changer gagne avec probabilité **2/3**.",
   "en": "Monty Hall: three doors, one car. You pick a door; the host, who knows where the car is, opens another door with a goat and offers you to switch. What is your probability of winning if you switch?",
   "piege": "Le résultat dépend du comportement du présentateur : s'il ouvrait une porte au hasard (et tombait par chance sur une chèvre), changer ne donnerait que 1/2.",
   "relances": [
    "Et avec 100 portes dont le présentateur en ouvre 98 ? (99/100 en changeant)"
   ],
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
   "solution": "Supposons x < y (moitié du carré). Morceaux : x, y − x, 1 − y, tous < 1/2 : x < 1/2, y > 1/2, y − x < 1/2. C'est un triangle d'aire 1/8 dans le demi-carré d'aire 1/2 : probabilité **1/4**.",
   "en": "A stick of length 1 is broken at two points chosen uniformly at random. What is the probability that the three pieces form a triangle?",
   "indice": "Un triangle existe si et seulement si chaque morceau est plus court que 1/2. Représente les deux points (x, y) dans le carré unité.",
   "relances": [
    "Et si on casse d'abord en un point, puis qu'on casse le plus long morceau en un point uniforme ? (2·ln 2 − 1 ≈ 0,386)",
    "Longueur moyenne du plus long morceau ? (11/18)"
   ],
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
   "solution": "Pour n = 3 morceaux, le plus long (k = 3) : (1/3)·(1/3 + 1/2 + 1) = (1/3)·(11/6) = **11/18 ≈ 0,611**.\nVérification : le plus petit vaut en moyenne 1/9, le moyen 5/18, et 1/9 + 5/18 + 11/18 = 1.",
   "en": "A unit stick is broken at two independent uniform points. What is the expected length of the longest piece?",
   "indice": "Les trois longueurs se comportent comme des espacements uniformes. Pour n morceaux, l'espérance du k-ième plus petit est (1/n)·(1/n + 1/(n−1) + … + 1/(n−k+1)).",
   "relances": [
    "Et le plus petit morceau ? (1/9)"
   ],
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
   "solution": "Pour un point i donné, les deux autres sont dans le demi-cercle horaire partant de i avec probabilité (1/2)² = 1/4. Ces trois événements sont disjoints (au plus un point peut « ouvrir » le demi-cercle) et leur réunion est l'événement cherché : 3 × 1/4 = **3/4**.",
   "en": "Three points are placed uniformly at random on a circle. What is the probability that they all lie in some semicircle?",
   "indice": "Pour chaque point, quelle est la probabilité que les deux autres soient dans le demi-cercle qui commence à ce point (sens horaire) ?",
   "relances": [
    "Généralisation à n points ? (n / 2^(n−1))",
    "Probabilité que le triangle formé contienne le centre ? (1 − 3/4 = 1/4)"
   ],
   "reponse": "3/4",
   "valeur": 0.75,
   "tolerance": 0.005,
   "duree": 240
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
   "question": "U et V sont indépendantes, uniformes sur [0, 1]. Que vaut E[max(U, V)] ?",
   "solution": "P(max ≤ x) = x², donc densité 2x et E = ∫₀¹ 2x² dx = **2/3**.\nPlus généralement, le max de n uniformes a pour espérance n/(n+1), le min 1/(n+1).",
   "en": "U and V are independent uniforms on [0, 1]. What is E[max(U, V)]?",
   "relances": [
    "E[min(U, V)] ? (1/3)",
    "Cov(min, max) ? (1/36)"
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
   "solution": "P(min > x) = (1 − x)⁵, donc E[min] = ∫₀¹ (1 − x)⁵ dx = **1/6**.\nIntuition : 5 points découpent [0, 1] en 6 intervalles de même longueur moyenne ; le minimum est le premier intervalle.",
   "en": "What is the expected minimum of 5 independent uniform [0, 1] random variables?",
   "relances": [
    "Espérance du k-ième plus petit parmi n ? (k/(n+1))"
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
   "question": "U et V sont indépendantes et uniformes sur [0, 1]. Que vaut E[|U − V|] ?",
   "solution": "|U − V| = max − min, donc E = 2/3 − 1/3 = **1/3**.\nAutre méthode : la densité de |U − V| est 2(1 − d) sur [0, 1], d'espérance ∫ 2d(1 − d) dd = 1/3.",
   "en": "U, V independent uniform on [0, 1]. Compute E[|U − V|].",
   "relances": [
    "E[(U − V)²] ? (1/6 = 2 Var(U))"
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
   "solution": "P(U₁ + … + Uₙ ≤ 1) est le volume du simplexe : 1/n!. Donc E[N] = Σ_{n≥0} P(N > n) = Σ 1/n! = **e ≈ 2,718**.",
   "en": "You draw independent uniform [0, 1] numbers until their sum exceeds 1. What is the expected number of draws?",
   "indice": "Calcule P(N > n) = P(U₁ + … + Uₙ ≤ 1), puis utilise E[N] = Σ P(N > n).",
   "relances": [
    "Et si le seuil est x ≤ 1 au lieu de 1 ? (eˣ)"
   ],
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
   "solution": "À chaque fois qu'un passager choisit au hasard, il choisit avec la même probabilité la place du premier (tout rentre dans l'ordre : le dernier aura la sienne) ou celle du dernier (perdu). Les autres choix ne font que repousser la décision. Par symétrie : **1/2**.",
   "en": "100 passengers board a 100-seat plane. The first one lost their boarding pass and sits in a random seat. Each next passenger takes their own seat if free, otherwise a random free seat. What is the probability that the last passenger gets their own seat?",
   "indice": "Quand le jeu « se décide »-t-il ? Regarde seulement deux places : celle du premier et celle du dernier.",
   "relances": [
    "Probabilité que le 50ᵉ passager ait sa place ? (pour le k-ième : (n − k + 1)/(n − k + 2), soit 51/52 pour k = 50)"
   ],
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
   "solution": "Linéarité de l'espérance : chaque carte est à sa place avec probabilité 1/52 ; somme de 52 indicatrices : **1**, quel que soit le nombre de cartes.",
   "en": "A deck of 52 cards is shuffled uniformly. What is the expected number of cards that end up in their original position?",
   "relances": [
    "La variance ? (1 aussi, pour n ≥ 2)",
    "La loi du nombre de points fixes quand n est grand ? (Poisson de paramètre 1)"
   ],
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
   "solution": "Inclusion-exclusion : P = Σ_{k=0}^{n} (−1)^k / k! → **1/e ≈ 0,368**. Pour n = 52, la différence avec 1/e est inférieure à 10⁻⁶⁷.\nIntuition : le nombre de points fixes suit approximativement une loi de Poisson(1), et P(0) = e⁻¹.",
   "en": "Approximately, what is the probability that a uniformly shuffled deck of 52 cards has no card in its original position?",
   "indice": "Inclusion-exclusion, ou : le nombre de points fixes est presque une loi de Poisson.",
   "relances": [
    "Le problème des chapeaux : n personnes reprennent un chapeau au hasard ; probabilité qu'au moins une reprenne le sien ? (1 − 1/e ≈ 63 %)"
   ],
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
   "solution": "P(tous différents) = (365/365)·(364/365)·…·(343/365) ≈ 0,4927, donc **≈ 50,7 %**.\nApproximation : P(aucune collision) ≈ exp(−n(n−1)/(2·365)) = exp(−253/365) ≈ 0,50 ; il y a 253 paires de personnes.",
   "en": "In a group of 23 people, what is the probability that at least two share a birthday (365 equally likely days)?",
   "indice": "Calcule plutôt la probabilité que tous les anniversaires soient différents.",
   "relances": [
    "Combien de personnes pour que l'un des autres ait le même anniversaire que TOI avec probabilité > 1/2 ? (253)",
    "Lien avec les collisions de hachage ? (≈ √N valeurs suffisent pour une collision probable)"
   ],
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
   "question": "Combien faut-il de personnes (en plus de toi) pour que la probabilité qu'au moins l'une ait le même anniversaire que toi dépasse 1/2 ?",
   "solution": "On veut 1 − (364/365)ⁿ ≥ 1/2, soit n ≥ ln 2 / ln(365/364) ≈ 0,693 × 364,5 ≈ 252,7 : **253 personnes**.",
   "en": "How many other people are needed so that the probability that at least one of them shares your birthday exceeds 1/2?",
   "relances": [
    "Pourquoi est-ce beaucoup plus que 23 ? (ici une seule date est visée ; avec 23 personnes il y a 253 paires qui peuvent coïncider)"
   ],
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
   "solution": "On garde le premier lancer s'il dépasse 3,5, donc 4, 5 ou 6 (moyenne 5) ; sinon on relance (3,5).\nValeur : ½ × 5 + ½ × 3,5 = **4,25**.",
   "en": "You roll a die and are paid the face value. After the first roll you may choose to re-roll once (and must then accept the second result). What is the value of the game under the optimal strategy?",
   "indice": "Le second lancer vaut 3,5 en moyenne. Quand vaut-il mieux garder le premier ?",
   "relances": [
    "Et avec deux relances possibles ? (14/3 ≈ 4,67 : on garde 5 ou 6 au premier lancer, puis 4 ou plus au deuxième)",
    "Combien paierais-tu pour jouer ? (au plus 4,25 si tu es neutre au risque)"
   ],
   "reponse": "17/4",
   "valeur": 4.25,
   "tolerance": 0.005,
   "duree": 240,
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
   "solution": "Avec deux lancers restants le jeu vaut 4,25. Au premier lancer, on garde seulement 5 ou 6 (car 4 < 4,25) : valeur = (2/6)·5,5 + (4/6)·4,25 = 11/6 + 17/6 = **14/3 ≈ 4,667**.",
   "en": "You roll a die and are paid the face value. After each roll you may re-roll, up to two times (at most three rolls); the last result is paid. What is the game worth under optimal play?",
   "indice": "Récurrence à rebours : avec un lancer restant, la valeur est 3,5 ; avec deux lancers, 4,25.",
   "relances": [
    "Vers quoi tend la valeur avec n relances ? (vers 6)"
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
   "solution": "P(max ≤ k) = (k/6)², donc P(max = k) = (2k − 1)/36.\nE = Σ k(2k − 1)/36 = (1 + 6 + 15 + 28 + 45 + 66)/36 = **161/36 ≈ 4,47**.",
   "en": "You roll two dice and receive the larger value. What is the expected payoff?",
   "relances": [
    "Et le minimum ? (91/36 ≈ 2,53 ; max + min = somme, d'espérance 7)"
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
   "solution": "Par symétrie, chacune des 48 autres cartes a la même probabilité 1/5 d'être dans chacun des 5 intervalles. Avant le premier as : 48/5 cartes en moyenne. Position du premier as : 48/5 + 1 = **53/5 = 10,6**.\nFormule générale : (N + 1)/(k + 1) pour k cartes spéciales parmi N.",
   "en": "Cards from a well-shuffled 52-card deck are turned over one by one. On average, at what position does the first ace appear?",
   "indice": "Les 4 as découpent les 48 autres cartes en 5 groupes. Combien de cartes dans chaque groupe en moyenne ?",
   "relances": [
    "Position moyenne du dernier as ? (4 × 53/5 = 42,4)"
   ],
   "reponse": "53/5",
   "valeur": 10.6,
   "tolerance": 0.005,
   "duree": 240
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
   "question": "Tu as 3 €. À chaque tour tu gagnes ou perds 1 € avec probabilité 1/2. Tu t'arrêtes à 0 € ou à 10 €. Probabilité d'atteindre 10 € ?",
   "solution": "Ta fortune est une martingale arrêtée et bornée : E[fortune finale] = 3 = 10·p + 0·(1 − p), donc **p = 3/10**.",
   "en": "You start with $3. Each round you win or lose $1 with probability 1/2. You stop at $0 or $10. What is the probability of reaching $10?",
   "relances": [
    "Durée moyenne de la partie ? (3 × 7 = 21 tours : k(N − k))",
    "Et si la pièce est biaisée ? (p = (1 − (q/p)^k)/(1 − (q/p)^N))"
   ],
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
   "solution": "Avec Mₙ = Sₙ² − n et le théorème d'arrêt : E[S_T²] = 9 + E[T]. Or E[S_T²] = 100 × 3/10 = 30. Donc **E[T] = 21** = k(N − k).",
   "en": "You start with $3 and win or lose $1 on each fair coin flip, stopping at $0 or $10. What is the expected number of rounds?",
   "indice": "Sₙ² − n est une martingale.",
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
   "solution": "Avec r = q/p = 2/3, P = (1 − r²)/(1 − r⁴) = (5/9)/(65/81) = **9/13 ≈ 0,692**.\nVariante plus rapide : P = 1/(1 + r²) quand la cible est le double du départ.",
   "en": "You have $2. Each round you win $1 with probability 0.6, lose $1 with probability 0.4. You stop at $0 or $4. Probability of reaching $4?",
   "indice": "(q/p)^Sₙ est une martingale, avec q/p = 2/3.",
   "relances": [
    "Pourquoi (q/p)^Sₙ est-elle une martingale ? (E[r^(S+X)] = r^S(p·r + q/r) = r^S(q + p))"
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
   "solution": "P(R puis R) = 1/2 × 2/3 = **1/3**.\nRésultat remarquable de l'urne de Pólya : le nombre de rouges après n tirages est uniforme sur {0, …, n}, et la proportion de rouges converge vers une loi uniforme sur [0, 1].",
   "en": "An urn has one red and one blue ball. Draw a ball, put it back along with another ball of the same color. Probability that the first two draws are both red?",
   "relances": [
    "La proportion de rouges est-elle une martingale ? (oui)"
   ],
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
   "question": "Trois variables aléatoires ont deux à deux la même corrélation ρ. Quelle est la plus petite valeur possible de ρ ?",
   "solution": "Var(X + Y + Z) = 3 + 6ρ ≥ 0, donc ρ ≥ **−1/2**. La valeur est atteinte (par exemple X + Y + Z = 0).\nPour n variables : ρ ≥ −1/(n − 1).",
   "en": "Three random variables have the same pairwise correlation ρ. What is the smallest possible value of ρ?",
   "indice": "La matrice de corrélation doit être semi-définie positive ; regarde la variance de X + Y + Z (variables réduites).",
   "relances": [
    "Si corr(X, Y) = 0,9 et corr(Y, Z) = 0,9, quelles valeurs pour corr(X, Z) ? (entre 0,62 et 1 : ρ₁ρ₂ ± √((1 − ρ₁²)(1 − ρ₂²)))",
    "Pourquoi cela compte-t-il en gestion des risques ? (une matrice de corrélation estimée ou « stressée » à la main peut ne pas être valide)"
   ],
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
   "question": "corr(X, Y) = 0,9 et corr(Y, Z) = 0,9. Quelle est la plus petite valeur possible de corr(X, Z) ?",
   "solution": "X = 0,9·Y + √(1 − 0,81)·U, Z = 0,9·Y + √0,19·V avec U, V orthogonaux à Y. corr(X, Z) = 0,81 + 0,19·corr(U, V) ≥ 0,81 − 0,19 = **0,62**.\nCas général : ρ₁ρ₂ − √((1 − ρ₁²)(1 − ρ₂²)).",
   "en": "corr(X, Y) = 0.9 and corr(Y, Z) = 0.9. What is the smallest possible corr(X, Z)?",
   "indice": "Écris X et Z comme une part de Y plus un bruit orthogonal à Y.",
   "relances": [
    "Et si les deux corrélations valent 0,5 ? (borne basse : 0,25 − 0,75 = −0,5)"
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
   "question": "(X, Y) est un vecteur gaussien centré réduit de corrélation 0,5. Que vaut P(X > 0 et Y > 0) ?",
   "solution": "P = 1/4 + arcsin(ρ)/(2π) = 1/4 + (π/6)/(2π) = 1/4 + 1/12 = **1/3**.\nVision géométrique : X = ⟨Z, a⟩, Y = ⟨Z, b⟩ avec Z gaussien isotrope dans le plan et un angle θ = arccos ρ = 60° entre a et b ; la probabilité vaut (π − θ)/(2π) = (180 − 60)/360.",
   "en": "(X, Y) is a standard bivariate normal with correlation 0.5. Compute P(X > 0, Y > 0).",
   "indice": "Formule de Sheppard : 1/4 + arcsin(ρ)/(2π). Ou géométriquement : l'angle entre les deux demi-plans.",
   "relances": [
    "Cas ρ = 0 ? (1/4) ; ρ = −1 ? (0)"
   ],
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
   "question": "X et Y sont indépendantes de loi N(0, 1). Que vaut E[max(X, Y)] ?",
   "solution": "E[max] = E|X − Y|/2. Or X − Y ~ N(0, 2) et E|N(0, σ²)| = σ√(2/π). Donc E[max] = √2·√(2/π)/2 = **1/√π ≈ 0,564**.",
   "en": "X and Y are independent standard normals. Compute E[max(X, Y)].",
   "indice": "max(X, Y) = (X + Y)/2 + |X − Y|/2.",
   "relances": [
    "E[|X|] pour X ~ N(0, 1) ? (√(2/π) ≈ 0,798)",
    "Ordre de grandeur du max de n gaussiennes ? (√(2 ln n))"
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
   "question": "X suit une loi N(0, 1). Que vaut E[X | X > 0] ?",
   "solution": "E[X·1{X>0}] = ∫₀^∞ x φ(x) dx = φ(0) = 1/√(2π). On divise par P(X > 0) = 1/2 : **√(2/π) ≈ 0,798**.",
   "en": "X is standard normal. What is E[X | X > 0]?",
   "relances": [
    "E[X | X > a] ? (φ(a)/(1 − Φ(a)), le ratio de Mills inverse)",
    "Lien avec l'expected shortfall ? (ES d'une gaussienne à 97,5 % = φ(1,96)/0,025 ≈ 2,34 σ)"
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
   "solution": "Il y a 3 pièces d'or équiprobables ; 2 d'entre elles sont dans la boîte or-or. Probabilité **2/3**.",
   "en": "Three boxes: gold-gold, silver-silver, gold-silver. You pick a box at random and draw a coin: it is gold. What is the probability that the other coin is also gold?",
   "piege": "« Il reste deux boîtes possibles, donc 1/2 » : les deux boîtes n'ont pas la même probabilité de donner une pièce d'or.",
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
   "solution": "Symétrie : A a plus de faces que B ou plus de piles que B (A a 101 pièces : faces_A + piles_A = 101 = (faces_B + piles_B) + 1), exactement l'un des deux. Par symétrie pile/face, les deux événements ont la même probabilité : **1/2**.",
   "en": "A flips 101 fair coins, B flips 100. What is the probability that A gets strictly more heads than B?",
   "indice": "Compare d'abord les 100 premières pièces de A à celles de B. Que fait la dernière ? Ou : symétrie entre « face » et « pile ».",
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
   "solution": "Le minimum de deux exponentielles de taux 1 est exponentiel de taux 2 : moyenne 1/2. Ensuite, par absence de mémoire, la survivante dure encore 1 an en moyenne. Total **1,5 an**.",
   "en": "Two light bulbs have independent exponential lifetimes with mean 1 year. Expected time until both have failed?",
   "relances": [
    "Pour n ampoules ? (1 + 1/2 + … + 1/n)",
    "Probabilité que l'ampoule A grille avant B si leurs taux sont λ et μ ? (λ/(λ + μ))"
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
   "solution": "Les 3 rouges découpent les 7 bleues en 4 groupes de taille moyenne 7/4. Position de la première rouge : 7/4 + 1 = **11/4 = 2,75**. Formule (N + 1)/(r + 1).",
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
   "solution": "La première carte est quelconque ; il reste 12 cartes de sa couleur parmi 51 : **12/51 = 4/17 ≈ 0,235**.",
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
   "solution": "13 × C(4,2) × C(12,3) × 4³ = 13 × 6 × 220 × 64 = 1 098 240 mains, sur C(52,5) = 2 598 960 : **≈ 42,3 %**.",
   "en": "What is the probability that a 5-card poker hand contains exactly one pair?",
   "indice": "Choisis la valeur de la paire, ses deux couleurs, puis trois autres valeurs distinctes et leurs couleurs.",
   "piege": "Choisir les trois autres cartes une par une (12 × 11 × 10) compte chaque main 3! = 6 fois.",
   "relances": [
    "Probabilité d'une double paire ? (C(13,2) × 6² × 44 / C(52,5) ≈ 4,75 %)"
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
   "solution": "Il faut trois valeurs distinctes (C(6,3) = 20 ensembles) dans le seul ordre croissant : 20/216 = **5/54 ≈ 0,093**.\nVérification : P(trois valeurs distinctes) = 120/216, et un seul des 6 ordres est croissant.",
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
   "solution": "(1 + 4 + 9 + 16 + 25 + 36)/6 = **91/6 ≈ 15,17**.",
   "en": "You roll a die and receive the square of the result. Expected payoff?",
   "relances": [
    "Pourquoi est-ce plus que 3,5² = 12,25 ? (E[X²] = Var(X) + E[X]², Var = 35/12 ; inégalité de Jensen)"
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
   "solution": "Indépendance : E[XY] = E[X]E[Y] = 3,5² = **12,25**.",
   "en": "Two dice are rolled and you receive the product. Expected payoff?",
   "relances": [
    "Et le produit d'un dé par lui-même (un seul lancer, mis au carré) ? (91/6 : pas d'indépendance)"
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
   "solution": "Bayes : (1/10 × 1) / (1/10 × 1 + 9/10 × 1/32) = 32/(32 + 9) = **32/41 ≈ 0,78**.\nEn cotes : a priori 1:9, rapport de vraisemblance 32:1, a posteriori 32:9.",
   "en": "One of 10 coins is double-headed, the others are fair. You pick one at random and flip it 5 times: 5 heads. Probability that you hold the double-headed coin?",
   "relances": [
    "Probabilité que le 6ᵉ lancer donne pile ? (32/41 + 9/41 × 1/2 = 73/82 ≈ 0,89)"
   ],
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
   "solution": "Σ_{k≥1} (1/2)^(2k) = (1/4)/(1 − 1/4) = **1/3**.\nPar conditionnement : p = P(pair) ; le premier lancer est face avec probabilité 1/2 et alors les rôles pair/impair s'inversent : p = ½(1 − p), d'où p = 1/3.",
   "en": "Flip a fair coin until the first heads. What is the probability that it occurs on an even-numbered flip?",
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
   "solution": "États : E (départ), E₁ (un 6 vient de tomber).\n- E = 1 + (1/6)E₁ + (5/6)E\n- E₁ = 1 + (1/6)·0 + (5/6)E\nDe la première : E = 6 + E₁ ; donc E = 6 + 1 + (5/6)E, soit **E = 42**.\nFormule générale pour une probabilité p : (1 + p)/p² ; ici 7 × 6 = 42.",
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
   "solution": "E[U²] − E[U]² = 1/3 − 1/4 = **1/12**. Sur [a, b] : (b − a)²/12.",
   "en": "Variance of a uniform distribution on [0, 1]?",
   "relances": [
    "Variance d'un dé ? ((6² − 1)/12 = 35/12)"
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
   "question": "Tu vois défiler n candidats dans un ordre aléatoire et tu dois accepter ou refuser chacun immédiatement, sans retour. Avec la meilleure stratégie, quelle probabilité de choisir le meilleur quand n est grand ?",
   "solution": "Avec un seuil r = xn, la probabilité de succès vaut ≈ −x ln x, maximale pour x = 1/e. Valeur : **1/e ≈ 37 %**. On observe donc environ 37 % des candidats avant de choisir.",
   "en": "Secretary problem: n candidates arrive in random order; you must accept or reject each immediately. With the optimal strategy, what is the probability of picking the best one as n grows?",
   "indice": "Stratégie : laisser passer les r premiers, puis prendre le premier meilleur que tous ceux vus.",
   "relances": [
    "Lien avec le trading ? (vendre « au meilleur moment » : sans modèle de prix, on ne peut pas faire beaucoup mieux qu'une règle de seuil)"
   ],
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
   "solution": "Il y a en moyenne 5 lancers avant le 6 (6 lancers au total). Chacun, sachant qu'il n'est pas un 6, vaut 3 en moyenne (1 à 5). Gain : 5 × 3 + 6 = **21**.\nPlus rapide, identité de Wald : E[somme] = E[N]·E[X] = 6 × 3,5 = 21, valable car N est un temps d'arrêt.",
   "en": "Roll a die until you get a 6; you are paid the sum of all rolls, including the 6. Expected payoff?",
   "indice": "Combien de lancers « non-6 » en moyenne, et que vaut chacun en moyenne ?",
   "piege": "Conditionner à tort : les lancers avant le 6 ne valent pas 3,5 en moyenne mais 3, puisqu'on sait qu'ils ne sont pas des 6. Les deux raisonnements donnent bien 21, à condition de ne pas mélanger les deux.",
   "relances": [
    "Et si tu ne reçois que la somme des lancers avant le 6 (sans le 6) ? (15)"
   ],
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
   "solution": "Chaque face apparaît au moins une fois avec probabilité 1 − (5/6)⁶. Par linéarité : 6(1 − (5/6)⁶) ≈ **3,99**.",
   "en": "You roll a die 6 times. What is the expected number of distinct faces seen?",
   "indice": "Linéarité de l'espérance : somme d'indicatrices « la face k est apparue ».",
   "relances": [
    "Et en n lancers d'un dé à n faces, quand n est grand ? (n(1 − 1/e) ≈ 0,63 n)"
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
   "solution": "P(max ≤ k) = (k/6)³, donc E[max] = Σ_{k=1}^{6} P(max ≥ k) = Σ (1 − ((k−1)/6)³) = 6 − (0 + 1 + 8 + 27 + 64 + 125)/216 = 6 − 225/216 = **1 071/216 ≈ 4,96**.",
   "en": "Three dice are rolled. What is the expected maximum?",
   "relances": [
    "Méthode générale : E[X] = Σ P(X ≥ k) pour une variable entière positive."
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
   "solution": "Égalité avec probabilité 6/36 = 1/6 ; par symétrie, le reste se partage également : (1 − 1/6)/2 = **5/12**.",
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
   "solution": "1 − (5/6)⁴ ≈ **0,518**. Le chevalier de Méré gagnait de l'argent en pariant dessus ; il en perdait avec le pari suivant (un double six en 24 lancers de deux dés : 1 − (35/36)²⁴ ≈ 0,491).",
   "en": "Probability of at least one 6 in 4 rolls of a die?",
   "piege": "Additionner : 4 × 1/6 = 2/3. Les événements ne sont pas disjoints.",
   "reponse": "1-(5/6)^4",
   "valeur": 0.5177469135802468,
   "tolerance": 0.005,
   "duree": 60,
   "essentiel": true
  },
  {
   "id": "proba-de-mere-deux",
   "theme": "probas",
   "niveau": 2,
   "profils": [
    "mm",
    "hf",
    "banque"
   ],
   "type": "numerique",
   "question": "Probabilité d'obtenir au moins un double six en 24 lancers de deux dés ?",
   "solution": "1 − (35/36)²⁴ ≈ **0,491**, un peu moins de 1/2. Il faut 25 lancers pour dépasser 1/2 (≈ 0,506).\nL'intuition « 4 lancers pour un 6, donc 24 pour un double six » se trompe parce que la probabilité n'est pas proportionnelle au nombre d'essais.",
   "en": "Probability of at least one double six in 24 rolls of two dice?",
   "reponse": "1-(35/36)^24",
   "valeur": 0.4914038761309034,
   "tolerance": 0.005,
   "duree": 90
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
   "solution": "Par symétrie, E[X₁ | X₁ + X₂ = 10] = E[X₂ | …] et leur somme vaut 10 : **5**. (Vérification : cas (4,6), (5,5), (6,4).)",
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
   "solution": "np(1 − p) = 100 × 1/4 = **25** ; écart-type 5. Donc environ 95 % de chances d'être entre 40 et 60.",
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
   "solution": "4 × C(13, 5) = 5 148 mains, sur C(52, 5) = 2 598 960 : **≈ 0,198 %** (environ 1 sur 505).\nAutre calcul : 1 × 12/51 × 11/50 × 10/49 × 9/48.",
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
   "solution": "Par symétrie, la dernière boule est une boule quelconque de l'urne : **3/5**. Aucun calcul de chemins n'est nécessaire.",
   "en": "An urn has 3 red and 2 blue balls, all drawn without replacement. Probability that the last one is red?",
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
   "solution": "Après le premier lancer, chaque lancer reproduit le précédent avec probabilité 1/2 : attente géométrique de moyenne 2. Total **3**.",
   "en": "Flip a coin until two consecutive results are the same (HH or TT). Expected number of flips?",
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
   "question": "X et Y sont indépendantes de loi exponentielle de paramètre 1. Que vaut P(X + Y ≤ 1) ?",
   "solution": "X + Y suit une loi Gamma(2, 1) de densité t e^{−t}. P = ∫₀¹ t e^{−t} dt = 1 − 2/e ≈ **0,264**.\nAutre lecture : c'est la probabilité qu'un processus de Poisson de taux 1 ait au moins 2 événements avant 1 : 1 − e⁻¹ − e⁻¹.",
   "en": "X and Y are independent Exp(1). Compute P(X + Y ≤ 1).",
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
   "question": "X et Y sont indépendantes, de même loi exponentielle. On sait que X + Y = 2. Espérance de X ?",
   "solution": "Par symétrie, E[X | X + Y = 2] = E[Y | …] et leur somme vaut 2 : **1**. Plus fort : sachant X + Y = s, X est uniforme sur [0, s].",
   "en": "X and Y are i.i.d. exponential. Given X + Y = 2, what is E[X]?",
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
   "question": "X et Y sont indépendantes de loi N(0, 1). Sachant X > 0, probabilité que X + Y > 0 ?",
   "solution": "corr(X, X + Y) = 1/√2, donc P(X > 0, X + Y > 0) = 1/4 + arcsin(1/√2)/(2π) = 1/4 + 1/8 = 3/8. On divise par P(X > 0) = 1/2 : **3/4**.\nGéométrie : dans le plan (X, Y), l'événement est un secteur d'angle 135° parmi les 180° du demi-plan X > 0.",
   "en": "X and Y are independent standard normals. Given X > 0, what is the probability that X + Y > 0?",
   "indice": "Corrélation entre X et X + Y, puis formule des quadrants : P(A > 0, B > 0) = 1/4 + arcsin(ρ)/(2π).",
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
   "solution": "Avec k vignettes déjà possédées, la suivante est nouvelle avec probabilité (10 − k)/10 : attente 10/(10 − k). Pour k = 0 à 4 : 10(1/10 + 1/9 + 1/8 + 1/7 + 1/6) ≈ **6,46**, contre 29,3 pour la collection complète : ce sont les dernières vignettes qui coûtent cher.",
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
   "solution": "Loi géométrique : (1 − p)/p² = (5/6)/(1/36) = **30** ; écart-type ≈ 5,5, presque égal à la moyenne (6). Le temps d'attente est très dispersé.",
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
   "solution": "Loi stationnaire π : π = 0,8π + 0,4(1 − π), donc 0,6π = 0,4 et **π = 2/3**.\nFormule pour deux états : π(beau) = P(pluie→beau) / (P(beau→pluie) + P(pluie→beau)) = 0,4/(0,2 + 0,4).",
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
   "solution": "La k-ième valeur est un record si elle est la plus grande des k premières : probabilité 1/k par symétrie. Espérance : 1 + 1/2 + … + 1/10 ≈ **2,93**, qui croît comme ln n : les records deviennent rares.",
   "en": "You observe 10 i.i.d. continuous values in order. A value is a record if it exceeds all previous ones (the first is one). Expected number of records?",
   "relances": [
    "Lien avec la finance ? (nombre de nouveaux plus hauts historiques d'une série sans tendance)"
   ],
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
   "solution": "Une boîte reste vide avec probabilité (9/10)¹⁰ ≈ 0,349. Par linéarité : 10 × 0,9¹⁰ ≈ **3,49**. Pour n balles dans n boîtes, environ n/e boîtes vides.",
   "en": "10 balls are thrown at random into 10 boxes. Expected number of empty boxes?",
   "reponse": "10*0.9^10",
   "valeur": 3.486784401000001,
   "tolerance": 0.005,
   "duree": 120
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
   "solution": "Pour chaque nombre premier p, les deux entiers ne sont pas tous deux divisibles par p avec probabilité 1 − 1/p². En supposant ces événements indépendants : Π (1 − 1/p²) = 1/ζ(2) = **6/π² ≈ 0,608**.\nLe lien Π(1 − p^{−s})^{−1} = ζ(s) vient du produit eulérien.",
   "en": "Pick two large random integers. What is the (limiting) probability that they are coprime?",
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
   "question": "U et V sont indépendantes et uniformes sur [0, 1]. Que vaut E[max(U, V) × min(U, V)] ?",
   "solution": "max × min = U × V, toujours. Donc E = E[U]E[V] = **1/4**. Piège classique : ne pas calculer les lois du max et du min séparément.",
   "en": "U, V independent uniform on [0, 1]. Compute E[max(U, V) · min(U, V)].",
   "piege": "Répondre E[max] × E[min] = 2/3 × 1/3 = 2/9 : max et min ne sont pas indépendants.",
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
   "solution": "Réponse franche et courte, puis du concret :\n- **Synthétique, par choix** : on connaît la vérité, donc on peut mesurer l'erreur (RMSE de la surface contre la vraie surface Heston), tester des cas limites, et vérifier qu'une stratégie ne gagne pas quand l'effet n'existe pas (contrôle négatif du stat arb : Sharpe −0,19). Les résultats valident le code et la méthode, pas une performance de marché, et c'est écrit dans chaque README.\n- **IA** : oui, pour une partie du code. Ce que tu as fait toi : lancer, relire, changer les paramètres, comprendre chaque choix et chaque limite (à dire seulement si c'est vrai : idéalement, les exercices d'extension : « pour que ce soit vraiment le tien »).\n- **Preuve immédiate** : propose d'expliquer n'importe quelle partie, ou un échec et son diagnostic (le minimum local de SVI, le Sharpe nul du premier réglage, le bug de compteur du market making).",
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
   "solution": "Trame possible (à dire avec tes mots) :\n1. **Problème** : construire une surface de volatilité implicite lisse et sans arbitrage à partir de cotations bruitées, et savoir mesurer si elle est juste.\n2. **Données** : un marché synthétique généré par un modèle de Heston (prix semi-analytique par fonction caractéristique), bruité de 0,2 point de vol : 6 maturités de 0,1 à 2 ans × 21 strikes. On connaît la vraie surface.\n3. **Méthode** : une tranche SVI « raw » par maturité, calibrée par moindres carrés avec plusieurs points de départ et une pénalité d'arbitrage papillon ; contrôles papillon (g(k) ≥ 0, Gatheral-Jacquier) et calendaire (variance totale croissante en T) ; interpolation linéaire de la variance totale entre maturités.\n4. **Résultats** : RMSE de 0,07 point de vol contre la vraie surface (moins que le bruit injecté) ; pas d'arbitrage sur le domaine coté.\n5. **Ce que j'ai appris** : un premier ajustement sans pénalité tombait dans un minimum local qui collait aux données mais impliquait une densité négative ; et deux tranches calibrées séparément peuvent se croiser loin dans l'aile.\n6. **Limites et suite** : données réelles (bid/ask, pondération par vega, forward implicite), calibration jointe type SSVI.",
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
   "question": "Pourquoi paramétrer la surface en variance totale w = σ²T et en log-moneyness k = ln(K/F) ?",
   "solution": "- **Log-moneyness par rapport au forward** : elle enlève l'effet du portage (taux, dividendes) et rend les tranches comparables entre maturités ; à k = 0 on est à la monnaie forward.\n- **Variance totale** : c'est la quantité qui entre directement dans Black-Scholes (σ√T), elle s'additionne dans le temps, et l'absence d'arbitrage calendaire s'écrit simplement : w(k, T) croissante en T à k fixé. Interpoler linéairement w en T préserve cette croissance si les tranches la respectent.",
   "en": "Why parametrize the surface in total variance w = σ²T and log-moneyness k = ln(K/F)?",
   "relances": [
    "Pourquoi pas interpoler la volatilité directement ? (une interpolation linéaire en σ peut créer de l'arbitrage calendaire)"
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
   "solution": "w(k) = a + b [ρ(k − m) + √((k − m)² + σ²)].\n- **a** : niveau général de variance ;\n- **b** : pente des ailes (b ≥ 0) ;\n- **ρ** ∈ (−1, 1) : asymétrie, le skew (ρ < 0 pour les actions) ;\n- **m** : translation horizontale du smile ;\n- **σ** > 0 : courbure au centre (arrondi du minimum).\nAiles asymptotiquement linéaires de pentes b(1 + ρ) à droite et b(1 − ρ) à gauche, ce qui est cohérent avec la formule des moments de Lee (pente ≤ 2 en variance totale).\nAvantages : peu de paramètres interprétables, ailes cohérentes avec la théorie, conditions d'arbitrage explicites.",
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
   "question": "Dans une tranche SVI avec b = 0,1 et ρ = −0,6, quelle est la pente asymptotique de l'aile gauche (k → −∞) de la variance totale ? Respecte-t-elle la borne de Lee ?",
   "solution": "Pente gauche = b(1 − ρ) = 0,1 × 1,6 = **0,16** ; pente droite b(1 + ρ) = 0,04. Bien en dessous de la borne de Lee (2) : aucun problème de moments.",
   "en": "In an SVI slice with b = 0.1 and ρ = −0.6, what is the asymptotic left-wing slope of total variance? Does it satisfy Lee's bound?",
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
   "solution": "Un butterfly (long C(K − h), short 2 C(K), long C(K + h)) a un payoff positif ; son prix doit l'être aussi : le prix du call doit être convexe en K. Par Breeden-Litzenberger, ∂²C/∂K² est la densité risque-neutre : une concavité, c'est une densité négative.\nEn variance totale, Gatheral et Jacquier traduisent cette condition par **g(k) ≥ 0**, avec\ng(k) = (1 − k w'/(2w))² − (w'²/4)(1/w + 1/4) + w''/2.\nDans le projet : contrôle a posteriori de g sur |k| ≤ 1,5 pour chaque tranche, et pénalité dans la fonction d'ajustement. Toutes les tranches finales vérifient g ≥ 0.",
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
   "solution": "À strike forward fixé (k fixé), la variance totale doit croître avec la maturité : sinon un calendar spread (vendre court, acheter long) aurait un prix négatif pour un payoff positif (sans dividendes ni taux, ou en termes de forward).\nDans le projet : 0 violation sur le domaine coté (k de −0,5 à 0,4), mais en extrapolant loin dans l'aile (k ≈ 0,8), les tranches T = 1 et T = 1,5, calibrées indépendamment, se croisent. Leçon : calibrer tranche par tranche ne garantit rien entre tranches ; il faut une contrainte jointe ou une paramétrisation de surface (SSVI).",
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
   "solution": "La fonction d'erreur de SVI n'est pas convexe : un optimiseur local s'arrête dans le minimum le plus proche du point de départ. Dans le projet, un premier essai sans pénalité de papillon a trouvé pour T = 1 un minimum local (ρ = 0,92, m = 0,63) qui ajustait bien les cotations mais impliquait une densité négative (g min = −2,17).\nCorrections : plusieurs points de départ, pénalité sur g < 0 dans l'objectif, et m borné près des données.\nMessage pour l'intervieweur : un bon ajustement aux données ne suffit pas, il faut vérifier la cohérence financière (ici, l'absence d'arbitrage).",
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
   "solution": "Prix semi-analytique : la fonction caractéristique du log-prix est connue en forme fermée ; on obtient les probabilités P₁ et P₂ de la formule C = S P₁ − K e^{−rT} P₂ par inversion de Gil-Pelaez, c'est-à-dire une intégrale numérique (`scipy.integrate.quad`) de Re[e^{−iu ln K} φ(u)/(iu)].\n« Little Heston trap » (Albrecher et al.) : la formule d'origine contient un logarithme complexe qui peut sauter de branche quand u ou T grandissent, ce qui produit des prix faux. Une écriture équivalente des termes évite ces discontinuités.\nPuis on inverse Black-Scholes (méthode de Brent) pour obtenir la volatilité implicite « vraie ».",
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
   "solution": "Trame possible :\n1. **Problème** : trouver des paires d'actifs dont l'écart revient à la moyenne, et trader cet écart sans se mentir sur la performance.\n2. **Données** : un marché synthétique de 18 actifs (6 paires réellement cointégrées, spread Ornstein-Uhlenbeck de demi-vie 8 jours, 6 actifs isolés, un facteur commun) : la vérité est connue.\n3. **Méthode** : sélection par Engle-Granger écrit à la main (OLS puis ADF, seuil 1 %, valeur critique de MacKinnon), filtre de demi-vie ; signal z-score (entrée à 2, sortie à 0,5, stop à 4) ; backtest walk-forward (504 jours de formation, 63 de trading, paramètres figés) ; coûts de 5 points de base.\n4. **Validation** : Sharpe 2,87 avec un intervalle bootstrap par blocs de 1,99 à 3,82 ; contrôle négatif (mêmes règles sans cointégration) à −0,19 ; Sharpe déflaté.\n5. **Ce que j'ai appris** : le premier réglage donnait un Sharpe nul : test trop peu puissant et 1 540 paires testées, donc des faux positifs. J'ai changé le réglage après avoir vu ce résultat, ce que le Sharpe déflaté prend en compte.\n6. **Limites** : spread parfaitement OU, β fixe, pas de rupture de régime ni de coûts d'emprunt.",
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
   "solution": "- **Corrélation** : les rendements bougent ensemble à court terme. Deux prix très corrélés peuvent s'éloigner indéfiniment.\n- **Cointégration** : deux prix non stationnaires ont une combinaison linéaire stationnaire (le spread y − βx revient à sa moyenne).\nPour du pairs trading, c'est le retour du spread à sa moyenne qui fait gagner : la cointégration est la bonne propriété. Exemple : deux marches aléatoires indépendantes peuvent avoir des rendements corrélés par hasard sur une période ; un ivrogne et son chien en laisse (cointégrés) peuvent avoir des pas peu corrélés.",
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
   "solution": "1. Régression OLS des log-prix : ln y = α + β ln x + ε.\n2. Test de Dickey-Fuller sur les résidus : Δε_t = γ ε_{t−1} + u_t ; H₀ : γ = 0 (pas de cointégration).\n3. Comparer la t-stat de γ aux valeurs critiques de **MacKinnon** (−3,90 à 1 % pour deux séries), plus sévères que celles d'un ADF classique car les résidus ont été estimés pour avoir l'air stationnaires.\n4. Filtres supplémentaires : demi-vie (−ln 2/ln(1 + γ)) inférieure à 40 jours, β > 0 ; on garde les 5 meilleures paires.\nLimites : ADF sans retard, valeurs critiques asymptotiques, résultat dépendant de la variable choisie comme expliquée (Johansen est symétrique).",
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
   "solution": "1 540 × 0,05 = **77** faux positifs (si les tests étaient indépendants). Dans le projet, des paires de marches aléatoires passaient le test avec une statistique d'environ −5, et aucune vraie paire n'était retenue. D'où la réduction de l'univers et le seuil à 1 %.",
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
   "solution": "On estime tout (choix des paires, β, moyenne et écart-type du spread) sur une fenêtre passée (504 jours), puis on trade la fenêtre suivante (63 jours) avec ces paramètres **figés** ; on avance et on recommence. Le résultat hors échantillon est la concaténation des fenêtres de trading.\nGarde-fous : le signal à la clôture de t − 1 décide de la position qui touche le rendement de t ; un test unitaire dédié (`test_pas_de_regard_vers_le_futur`) vérifie qu'on ne peut pas utiliser une donnée future. Ce test a été ajouté après la correction d'un vrai bug de décalage d'un jour entre signal et rendement.",
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
   "solution": "Parce qu'il est obtenu sur un marché synthétique où la cointégration existe **par construction** (spread OU parfait de demi-vie 8 jours). Il prouve que le pipeline sait gagner quand l'effet existe, et qu'il ne gagne pas quand l'effet n'existe pas (contrôle négatif : −0,19 en moyenne sur 10 graines). Il ne dit rien des marchés réels, où les relations sont plus faibles, changent de régime et disparaissent quand trop de monde les trade. Un Sharpe de 2,9 sur données réelles serait plutôt le signe d'une erreur.",
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
   "solution": "- **Rupture de la relation** (fusion, changement d'activité, régime de marché) : le spread ne revient plus.\n- **β instable** : figé sur la fenêtre de formation alors qu'il dérive (piste : filtre de Kalman).\n- **Coûts** : spread bid-ask, impact, coût d'emprunt des titres vendus à découvert ; ton propre test montre qu'à 50 pb le Sharpe tombe à 0,31.\n- **Capacité et crowding** : tout le monde trade les mêmes paires, les sorties se font en même temps (août 2007).\n- **Pertes corrélées** : plusieurs stops touchés ensemble lors d'un choc de marché.\n- **Biais de survie** dans la sélection des paires et l'univers.",
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
   "question": "Pourquoi un stop à |z| > 4 ? Que se passerait-il sans ?",
   "solution": "Si le spread s'écarte autant, l'hypothèse de cointégration est probablement cassée : on coupe une position qui ne reviendra peut-être jamais, et on limite la perte. C'est un choix **arbitraire**, à tester (2,5 ? 3 ? 5 ?), et il a un coût : sur une vraie paire, on coupe parfois juste avant le retour. Sans stop, une seule rupture de relation peut effacer des mois de gains (rendements très asymétriques).",
   "en": "Why a stop at |z| > 4? What would happen without it?"
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
   "question": "Comment estimerais-tu un β qui varie dans le temps ?",
   "solution": "- **Fenêtre glissante** : simple, mais bruitée et en retard.\n- **Filtre de Kalman** : modèle état-espace où β_t suit une marche aléatoire (β_t = β_{t−1} + η_t) et y_t = β_t x_t + ε_t. Le filtre met à jour β et son incertitude à chaque observation ; le rapport des variances de η et ε règle la réactivité.\n- **Pondération exponentielle** des observations.\nRisque : un β trop réactif absorbe le spread lui-même (le signal disparaît).",
   "en": "How would you estimate a time-varying hedge ratio β?"
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
   "solution": "Trame possible :\n1. **Problème** : un teneur de marché gagne le spread mais porte un risque d'inventaire ; comment coter pour équilibrer les deux ?\n2. **Modèle** : Avellaneda-Stoikov (2008). Prix milieu brownien, exécutions qui arrivent avec une intensité λ(δ) = A e^{−kδ} (plus on cote loin, moins on est exécuté). Prix de réservation décalé selon l'inventaire, spread optimal.\n3. **Méthode** : simulateur Monte-Carlo vectorisé (4 000 trajectoires en moins d'une seconde), comparaison avec un teneur naïf symétrique de même demi-spread moyen (comparaison équitable).\n4. **Résultats** : A-S divise par 2 l'écart-type du PnL (5,9 contre 12,1) et par 3 l'inventaire final, pour un PnL moyen plus bas (45 contre 56) : ratio PnL/risque de 7,7 contre 4,7. Balayage de γ : compromis rendement-risque.\n5. **Ce que j'ai appris** : un bug de comptage d'ordres trouvé par un test qui comparait au bon taux d'exécution en temps discret.\n6. **Limites** : pas de sélection adverse, pas de file d'attente, une seule taille d'ordre, prix brownien arithmétique.",
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
   "question": "Avellaneda-Stoikov : prix milieu s = 100, inventaire q = +3, aversion γ = 0,5, σ = 2, temps restant T − t = 0,5. Prix de réservation ?",
   "solution": "r = s − q γ σ² (T − t) = 100 − 3 × 0,5 × 4 × 0,5 = **97**.\nLong de 3 unités, le teneur valorise l'actif sous le milieu : il abaisse ses deux cotations pour vendre plus facilement et acheter moins. Le décalage croît avec l'inventaire, l'aversion au risque, la volatilité et le temps restant.",
   "en": "Avellaneda-Stoikov: mid s = 100, inventory q = +3, γ = 0.5, σ = 2, T − t = 0.5. Reservation price?",
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
   "question": "Avec les paramètres de ton projet (σ = 2, k = 1,5, γ = 0,5) et T − t = 1, que vaut le spread total optimal d'Avellaneda-Stoikov ?",
   "solution": "Spread = γσ²(T − t) + (2/γ) ln(1 + γ/k) = 0,5 × 4 × 1 + 4 ln(4/3) ≈ 2 + 1,151 = **≈ 3,15**.\nLe premier terme rémunère le risque d'inventaire (il diminue à l'approche de la fin) ; le second vient du compromis prix / probabilité d'exécution (k grand : la demande est sensible au prix, on cote serré).",
   "en": "With your project's parameters (σ = 2, k = 1.5, γ = 0.5) and T − t = 1, what is the optimal total Avellaneda-Stoikov spread?",
   "relances": [
    "Que devient le second terme quand γ → 0 ? (2/k : le teneur neutre au risque maximise seulement l'espérance)"
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
   "question": "Que représente l'intensité λ(δ) = A e^{−kδ}, et comment calibrerais-tu A et k sur de vraies données ?",
   "solution": "C'est le taux auquel un ordre placé à une distance δ du milieu est exécuté : A est l'activité du marché (exécutions par unité de temps au milieu), k la sensibilité à la distance.\nCalibration : à partir des données de carnet et de transactions, mesurer la fréquence à laquelle le prix atteint (ou les ordres traversent) chaque distance δ, puis régresser ln(fréquence) sur δ : la pente donne −k, l'ordonnée ln A. Vérifier que l'exponentielle convient (souvent la décroissance est différente loin du milieu) et que les paramètres sont stables selon l'heure de la journée.",
   "en": "What does the intensity λ(δ) = A e^{−kδ} represent, and how would you calibrate A and k on real data?"
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
    "Que montre le balayage de γ ? (plus γ est grand, plus l'inventaire et le risque baissent, et plus le PnL moyen baisse : de 60 à 21 quand γ passe de 0,01 à 2)"
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
   "question": "Ton test du taux d'exécution compare le nombre d'ordres exécutés à 2·pas·(1 − e^{−λdt}) et non à 2λT. Pourquoi ?",
   "solution": "En temps continu, un processus de Poisson d'intensité λ donne λT exécutions en moyenne par côté. Le simulateur est en temps discret et autorise **au plus une exécution par côté et par pas** : la probabilité d'au moins une exécution sur un pas est 1 − e^{−λdt}. L'espérance exacte du simulateur est donc 2 × nombre de pas × (1 − e^{−λdt}), un peu moins que 2λT. Comparer au bon chiffre a permis de détecter un vrai bug : le compteur faisait `bool + bool`, ce qui en NumPy est un OU logique, et sous-comptait les doubles exécutions.",
   "en": "Your execution-rate test compares fills to 2·steps·(1 − e^{−λdt}) rather than 2λT. Why?"
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
   "solution": "Le teneur maximise l'espérance d'une utilité exponentielle (CARA, aversion γ) de sa richesse finale. Le problème de contrôle stochastique donne une équation de Hamilton-Jacobi-Bellman en (t, s, q, cash). L'utilité exponentielle permet de séparer le cash ; un développement (ansatz quadratique en l'inventaire q) donne le prix de réservation r = s − qγσ²(T − t), puis l'optimisation des distances de cotation donne le spread. La solution utilisée est une approximation (les auteurs eux-mêmes linéarisent) ; Guéant, Lehalle et Fernandez-Tapia en donnent une version avec limite d'inventaire et solution asymptotique.",
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
   "question": "Un GARCH(1,1) σ²ₜ = ω + α ε²ₜ₋₁ + β σ²ₜ₋₁ a ω = 0,000002, α = 0,10, β = 0,88 (rendements quotidiens). Quelle est la volatilité quotidienne de long terme ?",
   "solution": "Variance de long terme : ω/(1 − α − β) = 0,000002/0,02 = 0,0001, soit une volatilité de **1 % par jour** (environ 16 % par an).\nα + β = 0,98 mesure la persistance : un choc de volatilité met longtemps à se dissiper (demi-vie ln 0,5/ln 0,98 ≈ 34 jours).",
   "en": "A GARCH(1,1) with ω = 0.000002, α = 0.10, β = 0.88 (daily returns). What is the long-run daily volatility?",
   "relances": [
    "Que se passe-t-il si α + β ≥ 1 ? (pas de variance de long terme finie : modèle intégré, IGARCH, dont l'EWMA est un cas particulier)"
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
   "question": "Une volatilité EWMA (RiskMetrics) utilise λ = 0,94 : σ²ₜ = λσ²ₜ₋₁ + (1 − λ)r²ₜ₋₁. Quelle est la demi-vie du poids des observations, en jours ?",
   "solution": "Le poids d'une observation vieille de k jours est proportionnel à λᵏ. Demi-vie : ln 0,5/ln 0,94 ≈ **11,2 jours**. L'estimateur réagit vite, mais il est bruité et n'a pas de retour vers une moyenne de long terme.",
   "en": "An EWMA volatility uses λ = 0.94. What is the half-life of the observation weights, in days?",
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
   "solution": "Variance avec N actifs : σ²[ρ + (1 − ρ)/N] → σ²ρ. Volatilité limite : σ√ρ = 20 % × 0,5 = **10 %**. Le risque spécifique se diversifie, le risque commun (le marché) non.",
   "en": "An equally weighted portfolio of many stocks, each with 20% vol and pairwise correlation 0.25. What does portfolio volatility converge to?",
   "relances": [
    "Et en période de crise, quand les corrélations montent vers 0,8 ? (≈ 17,9 % : la diversification disparaît quand on en a le plus besoin)"
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
   "solution": "β = Cov(r, r_m)/Var(r_m) = ρ σ/σ_m = 0,6 × 30/15 = **1,2**. Pour couvrir 1 million d'euros de cette action contre le marché, il faut vendre 1,2 million d'euros d'indice.",
   "en": "A stock has 30% vol, the market 15%, correlation 0.6. What is the stock's beta?",
   "relances": [
    "Quelle part de la variance de l'action la couverture élimine-t-elle ? (ρ² = 36 %)"
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
   "solution": "h* = ρ σ_S/σ_F = 0,9 × 2/2,5 = **0,72**. La variance résiduelle vaut (1 − ρ²) σ_S² : il reste un risque de base (19 % de la variance).",
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
   "solution": "500 × 1 % = **5** scénarios : la VaR est estimée à partir de la 5ᵉ ou 6ᵉ pire perte, et l'Expected Shortfall 99 % est la moyenne de ces 5 pertes. Cinq points, c'est très peu : d'où l'instabilité des mesures de queue.",
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
   "solution": "On évalue la perte du portefeuille dans des scénarios extrêmes mais plausibles, sans probabilité attachée :\n- **historiques** : rejouer 1987, 2008, mars 2020, une crise de taux ;\n- **hypothétiques** : choc de taux de +200 pb, krach de −30 % avec hausse de la volatilité, écartement des spreads de crédit ;\n- **inversés** : chercher le scénario qui ferait perdre un montant donné (ce qui casse vraiment le portefeuille).\nLa VaR décrit les pertes « normales » sur un horizon court ; le stress test regarde la queue et les ruptures (corrélations qui montent, liquidité qui disparaît). Difficulté : choisir des scénarios cohérents entre facteurs.",
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
   "question": "Un processus AR(1) xₜ = 0,8 xₜ₋₁ + εₜ est stationnaire. Que vaut son autocorrélation au retard 3 ?",
   "solution": "ρ(k) = φᵏ = 0,8³ = **0,512**. Décroissance géométrique ; la variance stationnaire vaut σ_ε²/(1 − φ²) = σ_ε²/0,36.",
   "en": "A stationary AR(1) xₜ = 0.8 xₜ₋₁ + εₜ. What is its lag-3 autocorrelation?",
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
   "question": "xₜ = 0,8 xₜ₋₁ + εₜ avec Var(εₜ) = 1. Variance stationnaire de x ?",
   "solution": "Var(x) = 0,64 Var(x) + 1, donc Var(x) = 1/0,36 ≈ **2,78**. Quand φ → 1, la variance explose : on s'approche d'une marche aléatoire (racine unitaire).",
   "en": "xₜ = 0.8 xₜ₋₁ + εₜ with Var(ε) = 1. Stationary variance of x?",
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
   "solution": "Rendement excédentaire × 2, volatilité × 2 : le **Sharpe ne change pas**. C'est pour cela qu'on compare des stratégies par leur Sharpe et non par leur rendement. Mais le drawdown maximal, le risque de ruine et le risque de financement (appels de marge, coûts d'emprunt plus élevés que le taux sans risque) augmentent : le Sharpe n'est pas toute l'histoire.",
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
   "solution": "La p-valeur est la probabilité, **si l'hypothèse nulle est vraie**, d'observer une statistique au moins aussi extrême que celle observée.\nCe qu'elle n'est pas :\n- la probabilité que l'hypothèse nulle soit vraie ;\n- la probabilité que le résultat soit dû au hasard ;\n- une mesure de la taille de l'effet (un effet minuscule devient « significatif » avec assez de données).\nSous H₀ (statistique continue), la p-valeur est uniforme sur [0, 1] : en testant 100 stratégies sans aucun pouvoir prédictif, environ 5 auront p < 0,05.",
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
   "solution": "- **Erreur de 1ʳᵉ espèce (α)** : rejeter H₀ alors qu'elle est vraie. Exemple : croire qu'un signal prédit les rendements alors qu'il n'a aucun pouvoir (faux positif), puis le trader.\n- **Erreur de 2ᵉ espèce (β)** : ne pas rejeter H₀ alors qu'elle est fausse. Exemple : jeter un vrai signal faute de données.\n- **Puissance = 1 − β** : probabilité de détecter un effet qui existe. Elle augmente avec la taille de l'échantillon et la taille de l'effet.\nDans ton projet stat arb, le premier réglage (252 jours, demi-vie 15 jours) manquait de puissance : le test ADF ne détectait pas les vraies paires.",
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
   "solution": "La moyenne est multipliée par 252, l'écart-type par √252 : Sharpe annuel = 0,1 × √252 ≈ **1,59**.\nHypothèse : rendements indépendants d'un jour à l'autre. Avec de l'autocorrélation positive, cette règle surestime le Sharpe (Lo, 2002).",
   "en": "A strategy has a daily Sharpe ratio of 0.1. What is its annualized Sharpe (252 trading days)?",
   "relances": [
    "Un Sharpe annuel de 2 correspond à quel Sharpe mensuel ? (2/√12 ≈ 0,58)"
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
   "solution": "Sharpe quotidien : 1/√252 ; Var(SR̂_quotidien) ≈ (1 + 1/504)/1 008. On annualise en multipliant l'écart-type par √252 : √(252/1 008) ≈ **0,50**. Règle à retenir : écart-type ≈ 1/√(nombre d'années).\nUn Sharpe estimé de 1 sur 4 ans est donc compatible avec un vrai Sharpe entre 0 et 2 (± 2 écarts-types). Il faut beaucoup d'années pour distinguer un bon gérant d'un chanceux.\nDans ton projet stat arb, l'intervalle de confiance du Sharpe vient d'un bootstrap par blocs (1,99 à 3,82), plus réaliste quand les rendements sont autocorrélés ou à queues épaisses.",
   "en": "You estimate an annual Sharpe of 1 from 4 years of daily returns (i.i.d. normal). What is the approximate standard error of the estimate?",
   "indice": "Formule de Lo pour un Sharpe par période estimé sur n périodes : Var ≈ (1 + SR²/2)/n. Le Sharpe quotidien est minuscule.",
   "relances": [
    "Combien d'années pour que l'écart-type tombe à 0,25 ? (16 ans)",
    "Avec des rendements annuels seulement, que devient la formule ? (√((1 + SR²/2)/T) : le terme SR²/2 n'est plus négligeable)"
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
   "solution": "1 − 0,95¹⁰⁰ ≈ **99,4 %**. En moyenne, 5 signaux seront faussement significatifs.\nCorrections : Bonferroni (seuil α/m), Holm, contrôle du taux de fausses découvertes (Benjamini-Hochberg), Sharpe déflaté, et surtout un échantillon de validation jamais utilisé pour choisir.",
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
   "solution": "0,05/1 540 ≈ **3,2 × 10⁻⁵**. Sans correction, on attend ~77 paires faussement cointégrées : c'est ce qui a fait échouer ton premier réglage (des marches aléatoires avec une statistique ADF ≈ −5).\nAlternative plus puissante : Benjamini-Hochberg (contrôle du taux de fausses découvertes), ou une présélection économique (même secteur) qui réduit le nombre de tests.",
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
   "solution": "Modèle y = Xβ + ε.\n- **Exogénéité** E[ε | X] = 0 : sinon les coefficients sont biaisés (variable omise, causalité inverse, erreur de mesure sur X).\n- **Pas de colinéarité parfaite** : sinon β n'est pas identifiable ; une forte colinéarité gonfle les variances.\n- **Homoscédasticité** : sinon les estimateurs restent sans biais mais les écarts-types sont faux (écarts-types de White).\n- **Pas d'autocorrélation des erreurs** : idem, écarts-types faux (Newey-West) ; fréquent en séries temporelles.\n- **Normalité des erreurs** : utile seulement pour les tests exacts en petit échantillon.\nSous les quatre premières, MCO est le meilleur estimateur linéaire sans biais (Gauss-Markov).",
   "en": "What are the OLS assumptions, and what happens when each is violated?",
   "relances": [
    "Formule de β̂ ? ((XᵀX)⁻¹Xᵀy)"
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
   "question": "La corrélation entre x et y vaut 0,5. La pente de la régression de y sur x vaut 0,8. Que vaut la pente de la régression de x sur y ?",
   "solution": "Pente(y|x) = ρ σ_y/σ_x et pente(x|y) = ρ σ_x/σ_y : leur produit vaut ρ² = 0,25. Donc pente(x|y) = 0,25/0,8 = **0,3125**.",
   "en": "corr(x, y) = 0.5 and the slope of y regressed on x is 0.8. What is the slope of x regressed on y?",
   "piege": "Répondre 1/0,8 = 1,25 : les deux régressions minimisent des erreurs différentes (verticales et horizontales), elles ne sont pas inverses l'une de l'autre sauf si |ρ| = 1.",
   "relances": [
    "Lien avec le choix de β dans un pairs trading ? (régresser A sur B ou B sur A ne donne pas le même ratio de couverture ; alternatives : moindres carrés totaux, Johansen)"
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
   "solution": "- Les **coefficients** ne changent pas (XᵀX et Xᵀy sont simplement multipliés par 2).\n- La variance estimée des résidus ne change presque pas, mais (XᵀX)⁻¹ est divisé par 2 : les **écarts-types sont divisés par √2**.\n- Les **t-stats sont multipliées par √2** : la régression paraît plus significative qu'elle ne l'est.\nMême phénomène, moins visible, avec des rendements sur fenêtres glissantes qui se chevauchent : les observations ne sont pas indépendantes, il faut corriger les écarts-types (Newey-West, Hansen-Hodrick).",
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
   "question": "Que mesure le R² ? Un R² de 1 % est-il forcément inutile en finance ?",
   "solution": "R² = part de la variance de y expliquée par le modèle = 1 − SCR/SCT ; en régression simple, R² = ρ².\nUn R² de 1 % sur des rendements quotidiens peut valoir beaucoup : une corrélation de 0,1 entre prévision et rendement, appliquée sur des milliers de paris indépendants, donne un Sharpe élevé (loi fondamentale de la gestion active : IR ≈ IC × √(nombre de paris indépendants)).\nÀ l'inverse, un R² élevé entre deux séries de **prix** (non stationnaires) peut être une régression fallacieuse.",
   "en": "What does R² measure? Is an R² of 1% necessarily useless in finance?",
   "relances": [
    "R² ajusté ? (pénalise le nombre de variables)"
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
   "question": "Tu régresses le prix d'une action sur celui d'une autre et tu trouves R² = 0,9 et une t-stat de 40. Est-ce une bonne nouvelle ?",
   "solution": "Pas forcément : deux marches aléatoires indépendantes donnent souvent des R² élevés et des t-stats énormes (Granger-Newbold, 1974). Les prix ne sont pas stationnaires et les erreurs sont fortement autocorrélées : les tests usuels ne s'appliquent pas.\nCe qu'il faut faire : régresser les **rendements** (stationnaires), ou tester la **cointégration** (le résidu est-il stationnaire ? Engle-Granger avec les valeurs critiques de MacKinnon, ou Johansen). C'est la démarche de ton projet stat arb.",
   "en": "You regress one stock's price on another's and find R² = 0.9 with a t-stat of 40. Is that good news?"
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
   "solution": "Stationnarité (faible) : moyenne et variance constantes, autocovariance qui ne dépend que de l'écart entre les dates.\n- Les **prix** ne le sont pas : ils se comportent comme des marches aléatoires (racine unitaire), leur variance croît avec le temps.\n- Les **rendements** le sont approximativement, mais leur volatilité varie (regroupement de volatilité, GARCH), leurs queues sont épaisses, et les régimes changent.\nTests : ADF (H₀ : racine unitaire), KPSS (H₀ : stationnarité).",
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
   "solution": "On régresse Δx_t = α + γ x_{t−1} + Σ δ_i Δx_{t−i} + ε_t et on teste H₀ : γ = 0 (racine unitaire) contre γ < 0 (retour à la moyenne). La statistique est la t-stat de γ, mais sous H₀ elle ne suit pas une loi de Student : valeurs critiques de Dickey-Fuller (≈ −2,86 à 5 % avec constante).\nSur des **résidus** d'Engle-Granger, la régression a déjà choisi β pour rendre le résidu le plus stationnaire possible : la statistique est biaisée vers des valeurs négatives, d'où des valeurs critiques plus sévères (MacKinnon ; −3,90 à 1 % dans ton projet pour deux séries).\nLien avec la demi-vie : φ = 1 + γ, demi-vie = −ln 2/ln φ.",
   "en": "Explain the augmented Dickey-Fuller test. Why do critical values change when it is applied to regression residuals?",
   "relances": [
    "Que sont les retards (Δx_{t−i}) ? (ils absorbent l'autocorrélation des erreurs ; ton projet utilise un ADF sans retard, c'est une limite)"
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
   "question": "Tu observes n durées x₁, …, xₙ supposées exponentielles de paramètre λ. Estimateur du maximum de vraisemblance de λ ?",
   "solution": "Log-vraisemblance : n ln λ − λ Σxᵢ. Dérivée nulle : n/λ − Σxᵢ = 0, donc **λ̂ = 1/x̄**.\nIl est biaisé en petit échantillon (E[λ̂] = nλ/(n − 1)) mais convergent ; sa variance asymptotique est λ²/n (inverse de l'information de Fisher).",
   "en": "You observe n durations assumed exponential with rate λ. What is the MLE of λ?",
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
   "question": "Pourquoi divise-t-on par n − 1 et non par n pour estimer une variance ?",
   "solution": "Les écarts sont mesurés à la moyenne empirique x̄, qui est elle-même ajustée aux données : Σ(xᵢ − x̄)² est en moyenne plus petit que Σ(xᵢ − μ)². Précisément E[Σ(xᵢ − x̄)²] = (n − 1)σ² : on a perdu un degré de liberté. Diviser par n − 1 rend l'estimateur sans biais (correction de Bessel).\nL'écart-type obtenu (racine) reste légèrement biaisé, et l'estimateur en 1/n a une erreur quadratique plus faible : sans biais ne veut pas dire meilleur.",
   "en": "Why divide by n − 1 rather than n when estimating a variance?"
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
   "solution": "Erreur standard = σ/√n = 10/10 = 1, demi-largeur = 1,96 × 1 ≈ **1,96**.",
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
   "solution": "La largeur est en 1/√n : pour la diviser par 2, il faut 4 fois plus de données, **400**.",
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
   "question": "Un portefeuille 50/50 contient deux actifs de volatilités 20 % et 30 %, corrélés à 0,5. Volatilité du portefeuille ?",
   "solution": "σ² = 0,25 × 0,04 + 0,25 × 0,09 + 2 × 0,25 × 0,5 × 0,2 × 0,3 = 0,01 + 0,0225 + 0,015 = 0,0475, donc σ ≈ **21,8 %**, moins que la moyenne des volatilités (25 %) : c'est la diversification.",
   "en": "A 50/50 portfolio holds two assets with vols of 20% and 30% and correlation 0.5. Portfolio volatility?",
   "relances": [
    "Et avec une corrélation de −1 ? (|0,1 − 0,15| = 5 %)",
    "Quels poids minimisent la variance ? (w₁ = (σ₂² − ρσ₁σ₂)/(σ₁² + σ₂² − 2ρσ₁σ₂) = 0,06/0,07 ≈ 86 %)"
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
   "question": "Vrai modèle : y = x + ε. Mais tu n'observes que x̃ = x + u, avec Var(x) = 1, Var(u) = 0,25, u indépendant du reste. Vers quelle valeur tend la pente estimée de y sur x̃ ?",
   "solution": "Pente = Cov(y, x̃)/Var(x̃) = Var(x)/(Var(x) + Var(u)) = 1/1,25 = **0,8**. C'est le biais d'atténuation : le bruit de mesure sur la variable explicative tire la pente vers zéro.\nEn finance : les bêtas estimés avec des variables bruitées sont trop faibles ; corrections par variables instrumentales ou en agrégeant (portefeuilles) pour réduire le bruit.",
   "en": "True model y = x + ε, but you only observe x̃ = x + u with Var(x) = 1, Var(u) = 0.25, u independent. What does the OLS slope of y on x̃ converge to?",
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
   "solution": "Les coefficients deviennent instables : grandes variances, signes qui changent d'un échantillon à l'autre, coefficients individuellement non significatifs alors que le modèle l'est globalement. La prévision reste correcte tant que la colinéarité persiste.\nRemèdes : retirer ou combiner les variables (leur somme, leur différence), régularisation Ridge (qui stabilise exactement ce cas), ACP, ou accepter l'instabilité si seule la prévision compte. Diagnostic : facteur d'inflation de la variance VIF = 1/(1 − R²_j) ≈ 25 ici.",
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
   "solution": "Quand on essaie N variantes et qu'on garde la meilleure, son Sharpe est biaisé vers le haut : même sans aucun effet, le maximum de N Sharpe estimés est positif. Le Sharpe déflaté (Bailey et López de Prado) calcule la probabilité que le vrai Sharpe soit positif en comparant le Sharpe observé au maximum attendu sous l'hypothèse nulle pour N essais, et en tenant compte de la longueur de l'échantillon, de l'asymétrie et de l'aplatissement des rendements.\nDans ton projet, le réglage final a été choisi après un premier essai raté : le compter comme 10 essais est une façon honnête de reconnaître ce choix. Limite : le nombre « effectif » d'essais est difficile à connaître.",
   "en": "What is the deflated Sharpe ratio and why did you use it?",
   "relances": [
    "Ordre de grandeur du maximum de N Sharpe nuls ? (≈ √(2 ln N) × écart-type de l'estimateur)"
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
   "solution": "W est un mouvement brownien standard si :\n- W₀ = 0 ;\n- ses accroissements sont indépendants : W_t − W_s est indépendant de (W_u)_{u ≤ s} ;\n- ses accroissements sont gaussiens et stationnaires : W_t − W_s ~ N(0, t − s) ;\n- ses trajectoires sont continues.\n\nPropriétés utiles en entretien : c'est une martingale ; ses trajectoires ne sont nulle part dérivables ; sa variation quadratique sur [0, t] vaut t ; Cov(W_s, W_t) = min(s, t) ; il est invariant par changement d'échelle (c^(−1/2)·W_{ct} est encore un brownien) ; il est markovien.",
   "en": "Define a standard Brownian motion and give three of its properties.",
   "relances": [
    "Pourquoi ses trajectoires ne sont-elles pas dérivables ? (les accroissements sont d'ordre √dt, donc (W_{t+h} − W_t)/h ~ h^(−1/2) explose)",
    "W_t² est-il une martingale ? (non : W_t² − t l'est)"
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
   "question": "W est un mouvement brownien standard. Que vaut E[W₂·W₅] ?",
   "solution": "Écris W₅ = W₂ + (W₅ − W₂) avec un accroissement indépendant de W₂ et centré : E[W₂W₅] = E[W₂²] + 0 = **2** = min(2, 5).",
   "en": "W is a standard Brownian motion. What is E[W₂ W₅]?",
   "relances": [
    "Corrélation entre W₂ et W₅ ? (2/√10 ≈ 0,63 ; en général √(s/t))"
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
   "question": "Que vaut E[W₂⁴] pour un mouvement brownien standard ?",
   "solution": "W₂ ~ N(0, 2) et pour une gaussienne centrée de variance σ², E[X⁴] = 3σ⁴. Donc **3 × 4 = 12**.",
   "en": "Compute E[W₂⁴] for a standard Brownian motion.",
   "relances": [
    "Kurtosis d'une gaussienne ? (3) ; kurtosis en excès ? (0)",
    "Comment retrouver 3σ⁴ avec Itô ? (d(W⁴) = 4W³dW + 6W²dt, donc E[W_t⁴] = 6∫s ds = 3t²)"
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
   "question": "Calcule d(W_t²) avec le lemme d'Itô. Pourquoi y a-t-il un terme de plus qu'en calcul classique ?",
   "solution": "Lemme d'Itô pour f(W) : df = f'(W) dW + ½ f''(W) dt. Avec f(x) = x² : **d(W²) = 2W dW + dt**.\nLe terme dt vient de la variation quadratique : (dW)² = dt, qui n'est pas négligeable contrairement à (dx)² en calcul classique.\nConséquence : W_t² − t est une martingale, et E[W_t²] = t.",
   "en": "Compute d(W_t²) using Itô's lemma. Why is there an extra term compared to ordinary calculus?",
   "relances": [
    "Énonce le lemme d'Itô pour f(t, X_t) avec dX = μ dt + σ dW. (df = (f_t + μ f_x + ½σ² f_xx) dt + σ f_x dW)",
    "d(e^{W_t}) ? (e^W dW + ½ e^W dt)"
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
   "question": "Que vaut l'intégrale d'Itô ∫₀ᵀ W_t dW_t ?",
   "solution": "D'après d(W²) = 2W dW + dt, en intégrant : W_T² = 2∫₀ᵀ W dW + T, donc **∫₀ᵀ W dW = (W_T² − T)/2**.\nC'est une martingale d'espérance nulle (contrairement à W_T²/2 du calcul classique).",
   "en": "Compute the Itô integral ∫₀ᵀ W_t dW_t.",
   "indice": "Utilise le résultat de d(W²).",
   "piege": "Répondre W_T²/2 : c'est l'intégrale de Stratonovich, pas celle d'Itô.",
   "relances": [
    "Pourquoi l'intégrale d'Itô d'un processus adapté est-elle une martingale ? (on évalue l'intégrande au début de chaque pas : pas d'anticipation)",
    "Variance de ∫₀ᵀ W dW ? (isométrie d'Itô : ∫₀ᵀ t dt = T²/2)"
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
   "question": "Que vaut la variance de ∫₀¹ t dW_t ?",
   "solution": "Isométrie d'Itô : E[(∫₀¹ t dW_t)²] = ∫₀¹ t² dt = **1/3**. L'intégrale est gaussienne centrée de variance 1/3.",
   "en": "What is the variance of ∫₀¹ t dW_t?",
   "relances": [
    "Que vaut ∫₀¹ t dW_t en fonction de W ? (par parties : W₁ − ∫₀¹ W_t dt)"
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
   "question": "Quelle est la variance de X = ∫₀¹ W_t dt (l'aire sous une trajectoire brownienne) ?",
   "solution": "Var(X) = ∫₀¹∫₀¹ min(s, t) ds dt = 2∫₀¹∫₀ᵗ s ds dt = 2∫₀¹ t²/2 dt = **1/3**. Plus généralement, ∫₀ᵀ W dt ~ N(0, T³/3).",
   "en": "What is the variance of X = ∫₀¹ W_t dt?",
   "indice": "Var(X) = ∫∫ Cov(W_s, W_t) ds dt.",
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
   "question": "Résous l'équation dS_t = μ S_t dt + σ S_t dW_t (mouvement brownien géométrique).",
   "solution": "d(ln S) = dS/S − ½ (dS)²/S² = (μ − σ²/2) dt + σ dW.\nDonc **S_t = S₀ exp((μ − σ²/2)t + σW_t)**.\nS_t est log-normal ; E[S_t] = S₀e^{μt} ; sa médiane vaut S₀e^{(μ − σ²/2)t}, plus basse que l'espérance.",
   "en": "Solve the SDE dS = μ S dt + σ S dW (geometric Brownian motion).",
   "indice": "Applique Itô à ln S_t.",
   "relances": [
    "Pourquoi le terme −σ²/2 ? (convexité du logarithme : inégalité de Jensen)",
    "Variance de S_t ? (S₀²e^{2μt}(e^{σ²t} − 1))"
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
   "question": "S suit un brownien géométrique avec S₀ = 100, μ = 5 % et σ = 30 %. Que vaut E[S₁] ?",
   "solution": "E[S_t] = S₀e^{μt} ne dépend pas de σ : **100·e^{0,05} ≈ 105,13**.",
   "en": "S is a GBM with S₀ = 100, μ = 5%, σ = 30%. Compute E[S₁].",
   "piege": "Ajouter −σ²/2 : ce terme concerne l'espérance de ln S, pas celle de S.",
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
   "question": "Sans dérive (μ = 0), σ = 20 %, S₀ = 100. Quelle est la médiane de S₁ ?",
   "solution": "ln S₁ ~ N(ln 100 − σ²/2, σ²), de médiane ln 100 − 0,02. Médiane : **100·e^{−0,02} ≈ 98,02**, alors que l'espérance vaut 100.",
   "en": "GBM with zero drift, σ = 20%, S₀ = 100. What is the median of S₁?",
   "relances": [
    "Que se passe-t-il quand T → ∞ ? (S_T → 0 presque sûrement alors que E[S_T] = 100 : l'espérance est portée par des trajectoires de plus en plus rares)"
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
   "question": "Brownien géométrique sans dérive, σ = 20 %, S₀ = 100. Probabilité que S₁ > 100 ? (N(0,1) = 0,5 ; N(0,1) en 0,1 ≈ 0,540)",
   "solution": "S₁ > 100 ⇔ −σ²/2 + σW₁ > 0 ⇔ W₁ > σ/2 = 0,1. Probabilité **1 − Φ(0,1) ≈ 0,460**.\nL'espérance reste 100 mais la loi est asymétrique : beaucoup de petites baisses, quelques fortes hausses.",
   "en": "Driftless GBM, σ = 20%, S₀ = 100. What is P(S₁ > 100)? (Φ(0.1) ≈ 0.540)",
   "relances": [
    "C'est quoi, en pricing ? (N(d₂) d'un call à la monnaie avec r = 0 : la probabilité risque-neutre d'exercice)"
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
   "question": "Montre que M_t = exp(θW_t − θ²t/2) est une martingale. À quoi sert-elle ?",
   "solution": "Par Itô : dM = M(θ dW − θ²/2 dt) + ½ M θ² dt = θM dW. Pas de terme en dt : M est une martingale locale, et une vraie martingale (E[M_t] = 1 en calculant E[e^{θW_t}] = e^{θ²t/2}).\nUsages : changement de probabilité de Girsanov (M est la densité qui ajoute une dérive θ au brownien) ; calcul de lois de temps d'atteinte (transformée de Laplace de τ_a : E[e^{−λτ_a}] = e^{−a√(2λ)}).",
   "en": "Show that M_t = exp(θW_t − θ²t/2) is a martingale. What is it used for?",
   "relances": [
    "Énonce Girsanov simplement. (sous Q définie par dQ/dP = M_T, W_t − θt est un brownien)"
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
   "question": "Un brownien standard part de 0. Probabilité qu'il atteigne +1 avant −2 ?",
   "solution": "W est une martingale ; au temps d'arrêt τ (sortie de ]−2, 1[) : 0 = E[W_τ] = 1·p − 2(1 − p), donc **p = 2/3**. C'est la ruine du joueur en continu : b/(a + b) avec a = 1, b = 2.",
   "en": "A standard Brownian motion starts at 0. What is the probability it hits +1 before −2?",
   "relances": [
    "Temps moyen de sortie ? (ab = 2, via W² − t)",
    "Et avec une dérive μ ? (utiliser la martingale exp(−2μW))"
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
   "question": "Un brownien standard part de 0. Combien de temps faut-il en moyenne pour qu'il sorte de l'intervalle ]−2, 1[ ?",
   "solution": "W_t² − t est une martingale : E[τ] = E[W_τ²] = (2/3)·1 + (1/3)·4 = **2** = a·b.",
   "en": "Expected time for a standard Brownian motion started at 0 to exit (−2, 1)?",
   "relances": [
    "Et le temps pour atteindre +1 sans borne basse ? (fini presque sûrement mais d'espérance infinie)"
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
   "question": "Probabilité qu'un brownien standard dépasse le niveau 1 au moins une fois avant la date 1 ? (Φ(1) ≈ 0,841)",
   "solution": "P(max_{[0,1]} W ≥ 1) = 2·P(W₁ ≥ 1) = 2(1 − Φ(1)) ≈ **0,317**.\nApplication : prix d'options à barrière, et probabilité qu'un stop soit touché.",
   "en": "Probability that a standard Brownian motion exceeds level 1 at some time before t = 1? (Φ(1) ≈ 0.841)",
   "indice": "Principe de réflexion : après avoir touché 1, la trajectoire symétrisée est aussi probable.",
   "relances": [
    "Loi du maximum M₁ ? (même loi que |W₁|)",
    "En temps discret (observations quotidiennes), la probabilité est-elle plus petite ou plus grande ? (plus petite : on rate des franchissements ; correction de Broadie-Glasserman, barrière décalée de 0,5826·σ√Δt)"
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
   "question": "Qu'est-ce que la variation quadratique d'un processus ? Que vaut-elle pour un brownien, et pourquoi dit-on que « dW² = dt » ?",
   "solution": "[X]_t = limite de Σ (X_{t_{i+1}} − X_{t_i})² quand le pas de la subdivision tend vers 0.\nPour le brownien : chaque terme a pour espérance Δt et pour variance 2Δt² ; la somme a pour espérance t et pour variance 2Σ Δt² → 0. Donc **[W]_t = t**, de façon déterministe.\nC'est ce que résume la règle dW·dW = dt (et dt·dW = dt·dt = 0). Une fonction dérivable a une variation quadratique nulle.\nEn finance : la variance réalisée estime la variation quadratique du log-prix, ∫σ_t² dt.",
   "en": "What is quadratic variation? What is it for Brownian motion, and why do we write dW² = dt?",
   "relances": [
    "Variation quadratique de ∫σ_s dW_s ? (∫σ_s² ds)",
    "Que vaut la variation totale (Σ|ΔW|) du brownien ? (infinie)"
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
   "question": "W_t³ est-il une martingale ? Sinon, comment la corriger ?",
   "solution": "Itô : d(W³) = 3W² dW + 3W dt. Le terme 3W dt n'est pas nul, donc W³ n'est pas une martingale (même si E[W_t³] = 0 pour tout t).\nCorrection : d(tW) = W dt + t dW, donc **W_t³ − 3tW_t** est une martingale (c'est un polynôme d'Hermite).",
   "en": "Is W_t³ a martingale? If not, how do you fix it?",
   "piege": "« E[W_t³] = 0 pour tout t donc c'est une martingale » : une espérance constante ne suffit pas, il faut E[X_t | F_s] = X_s."
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
   "solution": "dX = κ(θ − X) dt + σ dW. Solution : X_t = θ + (X₀ − θ)e^{−κt} + σ∫₀ᵗ e^{−κ(t−s)} dW_s.\n- E[X_t] = θ + (X₀ − θ)e^{−κt} ;\n- Var(X_t) = σ²(1 − e^{−2κt})/(2κ) → **σ²/(2κ)** ;\n- demi-vie de l'écart à la moyenne : **ln 2/κ**.\nDiscrétisé au pas Δ, c'est un AR(1) : X_{t+1} = c + φX_t + ε avec φ = e^{−κΔ}. Dans ton projet stat arb, le spread est simulé comme un OU de demi-vie 8 jours, et la demi-vie estimée vient de la régression AR(1) du spread : demi-vie = −ln 2/ln φ.\nUsages : spreads de paires, taux courts (Vasicek), volatilité (log-vol en OU).",
   "en": "Write the Ornstein-Uhlenbeck process, its mean, stationary variance and half-life. Where have you used it?",
   "relances": [
    "Avec κ = 0,1 par jour, demi-vie ? (6,9 jours)",
    "Comment estimer κ à partir de données quotidiennes ? (régression de ΔX sur X : pente −(1 − φ))"
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
   "question": "Un spread suit un processus d'Ornstein-Uhlenbeck de vitesse de retour κ = 0,1 par jour. Quelle est sa demi-vie, en jours ?",
   "solution": "L'écart à la moyenne décroît en e^{−κt} : demi-vie = ln 2 / κ = 0,693/0,1 ≈ **6,93 jours**.",
   "en": "A spread follows an OU process with mean-reversion speed κ = 0.1 per day. What is its half-life in days?",
   "relances": [
    "Si la régression AR(1) quotidienne donne φ = 0,9, demi-vie ? (−ln 2/ln 0,9 ≈ 6,58 jours)"
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
   "solution": "Les deux sont des limites de sommes de Riemann Σ H(τ_i)(W_{t_{i+1}} − W_{t_i}) ; Itô évalue H au début de l'intervalle (τ_i = t_i), Stratonovich au milieu. Pour un brownien, le choix change la limite à cause de la variation quadratique : ∫W ∘ dW = W_T²/2 (Stratonovich) contre (W_T² − T)/2 (Itô).\n- Itô : l'intégrande ne regarde pas le futur (une stratégie de trading décide avant de connaître le mouvement), l'intégrale est une martingale. C'est le bon modèle pour un gain de trading.\n- Stratonovich : la règle de dérivation classique s'applique, utile en physique et pour certaines méthodes numériques.\nConversion : ∫H ∘ dW = ∫H dW + ½[H, W].",
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
   "solution": "Si W est un brownien sous P et θ un processus adapté (assez régulier), alors sous Q définie par dQ/dP = exp(−∫θ dW − ½∫θ² dt), le processus W̃_t = W_t + ∫₀ᵗ θ_s ds est un brownien.\nEn finance : dS = μS dt + σS dW. Avec θ = (μ − r)/σ (prix de marché du risque), dS = rS dt + σS dW̃ sous Q : l'actif actualisé devient une martingale. Les prix sont alors des espérances sous Q des flux actualisés, et la dérive réelle μ disparaît.\nGirsanov ne change que la dérive, jamais la volatilité : la volatilité se mesure sous P (variation quadratique), la dérive non.",
   "en": "Explain Girsanov's theorem and its role in moving to the risk-neutral measure.",
   "relances": [
    "Pourquoi la volatilité est-elle la même sous P et Q ? (la variation quadratique est une propriété des trajectoires, et P et Q sont équivalentes)",
    "Qu'est-ce que la mesure forward-neutre ? (numéraire = zéro-coupon de maturité T : le forward devient une martingale)"
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
   "solution": "Elle relie une EDP parabolique à une espérance. Si dX = μ(t, X) dt + σ(t, X) dW et que u résout\n∂u/∂t + μ ∂u/∂x + ½σ² ∂²u/∂x² − r u = 0, avec u(T, x) = g(x),\nalors u(t, x) = E[e^{−r(T−t)} g(X_T) | X_t = x].\nBlack-Scholes : avec dS = rS dt + σS dW sous Q, le prix V(t, S) = E^Q[e^{−r(T−t)}(S_T − K)⁺] résout l'EDP de Black-Scholes. On peut donc pricer par Monte-Carlo (l'espérance) ou par différences finies (l'EDP).",
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
   "question": "Comment simules-tu une EDS dX = a(X) dt + b(X) dW ? Quelle est la précision du schéma d'Euler ?",
   "solution": "Schéma d'Euler-Maruyama : X_{n+1} = X_n + a(X_n)Δt + b(X_n)√Δt·Z_n, Z_n ~ N(0, 1) indépendantes.\n- Convergence **forte** (trajectoire par trajectoire) en √Δt ; convergence **faible** (espérances) en Δt.\n- Le schéma de Milstein ajoute ½b b'(ΔW² − Δt) et atteint l'ordre fort 1.\n- Pour un brownien géométrique, simuler le logarithme est exact : S_{n+1} = S_n exp((μ − σ²/2)Δt + σ√Δt Z).\nPièges : variance négative avec Euler sur Heston (troncature ou schéma QE d'Andersen), coût en 1/ε³ pour une erreur ε (Monte-Carlo + biais), d'où le multi-niveaux (MLMC).",
   "en": "How do you simulate an SDE dX = a(X) dt + b(X) dW? What is the accuracy of the Euler scheme?",
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
   "question": "W est un mouvement brownien standard. Que vaut E[e^{W₂}] ?",
   "solution": "Pour X ~ N(0, σ²), E[e^X] = e^{σ²/2}. Ici σ² = 2 : **e ≈ 2,718**.\nC'est pour cela que e^{W_t − t/2} est une martingale.",
   "en": "Compute E[e^{W₂}] for a standard Brownian motion.",
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
   "question": "Probabilité qu'un brownien standard soit positif à la fois en t = 1 et en t = 2 ?",
   "solution": "corr(W₁, W₂) = 1/√2. P = 1/4 + arcsin(1/√2)/(2π) = 1/4 + (π/4)/(2π) = **3/8**.\nAutre méthode : P(W₁ > 0, W₂ − W₁ > −W₁) = E[1{W₁>0} Φ(W₁)] = 3/8.",
   "en": "Probability that a standard Brownian motion is positive at both t = 1 and t = 2?",
   "indice": "corr(W₁, W₂) = √(1/2) ; formule des quadrants pour un couple gaussien.",
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
   "question": "On sait que W₄ = 2. Que vaut E[W₁ | W₄ = 2] ?",
   "solution": "Pont brownien : E[W_s | W_t = x] = (s/t)·x = (1/4) × 2 = **0,5**. Interpolation linéaire entre 0 et la valeur connue.",
   "en": "Given W₄ = 2, what is E[W₁ | W₄ = 2]?",
   "relances": [
    "Variance conditionnelle ? (s(t − s)/t = 3/4)",
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
   "question": "Que vaut Var(W₁ | W₄) ?",
   "solution": "s(t − s)/t = 1 × 3/4 = **0,75**, quelle que soit la valeur de W₄. L'incertitude est maximale au milieu de l'intervalle (s = t/2).",
   "en": "What is Var(W₁ | W₄)?",
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
   "question": "Que vaut E[∫₀¹ W_t² dt] ?",
   "solution": "Fubini : ∫₀¹ E[W_t²] dt = ∫₀¹ t dt = **1/2**.",
   "en": "Compute E[∫₀¹ W_t² dt].",
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
   "question": "Que vaut Var(W₁ + W₂) ?",
   "solution": "Var(W₁) + Var(W₂) + 2Cov(W₁, W₂) = 1 + 2 + 2 × 1 = **5**. Ou : W₁ + W₂ = 2W₁ + (W₂ − W₁), variance 4 + 1.",
   "en": "What is Var(W₁ + W₂)?",
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
   "question": "Que vaut Cov(W_t, W_t²) ?",
   "solution": "E[W_t³] − E[W_t]E[W_t²] = 0 − 0 = **0** (moment impair d'une gaussienne centrée). W_t et W_t² sont pourtant fortement dépendants : covariance nulle ne veut pas dire indépendance.",
   "en": "What is Cov(W_t, W_t²)?",
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
   "question": "Soit τ le premier instant où un brownien standard atteint 1. τ est-il fini ? Quelle est son espérance ? Sa loi ?",
   "solution": "- τ est fini presque sûrement (le brownien en dimension 1 est récurrent).\n- Mais **E[τ] = +∞** : sinon, par le théorème d'arrêt, E[W_τ] = 1 serait égal à E[W₀] = 0.\n- Par le principe de réflexion : P(τ ≤ t) = P(max_{[0,t]} W ≥ 1) = 2(1 − Φ(1/√t)). Densité ~ t^{−3/2} pour t grand : queue lourde (loi de Lévy).\n- Transformée de Laplace : E[e^{−λτ}] = e^{−√(2λ)}.",
   "en": "Let τ be the first time a standard Brownian motion hits 1. Is τ finite? What is its expectation? Its distribution?",
   "relances": [
    "Avec une dérive μ > 0 ? (E[τ] = 1/μ)"
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
   "question": "Calcule d(X_t Y_t) pour deux processus d'Itô. Application : d(t·W_t) et d(S_t/B_t) avec B_t = e^{rt}.",
   "solution": "Formule du produit : **d(XY) = X dY + Y dX + d⟨X, Y⟩**.\n- d(tW_t) = t dW + W dt (t est déterministe : pas de covariation).\n- S actualisé : d(S/B) = (1/B) dS − (rS/B) dt = (S/B)[(μ − r) dt + σ dW]. Sous la probabilité risque-neutre (μ remplacé par r), le terme en dt disparaît : l'actif actualisé est une martingale.",
   "en": "Compute d(X_t Y_t) for two Itô processes. Apply to d(tW_t) and d(S_t/B_t) with B_t = e^{rt}."
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
   "solution": "On achète le zéro-coupon (90) pour garantir le capital ; il reste 10 pour acheter des calls à 20 chacun (en % du nominal) : participation = 10/20 = **50 %** de la hausse de l'indice.\nLeviers pour améliorer la participation : taux plus élevés (zéro-coupon moins cher), maturité plus longue, plafonner la hausse (call spread), moyenne asiatique (call moins cher), capital garanti partiel. La marge de la banque se prend sur ces 10.",
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
   "solution": "À chaque date d'observation (par exemple annuelle), si le sous-jacent est au-dessus de son niveau initial (barrière de rappel), le produit est remboursé par anticipation avec un coupon (souvent cumulatif). Sinon il continue. À l'échéance, si le sous-jacent n'a jamais été rappelé et termine sous une barrière de protection (par exemple −40 %), l'investisseur subit la baisse : il a vendu un **put down-and-in**.\nPour l'investisseur : coupon attrayant en marché stable ou modérément haussier, risque de perte en capital en cas de forte baisse. Pour la banque :\n- gestion des **barrières** (gamma et vega très concentrés près des barrières et des dates d'observation) ;\n- sensibilité au **skew** et à la **volatilité future** (durée de vie aléatoire) ;\n- risque de **dividendes** (la banque est souvent exposée aux dividendes futurs via sa couverture) ;\n- si plusieurs sous-jacents (worst-of) : risque de **corrélation** ;\n- concentration : toutes les banques ont des positions semblables, ce qui peut amplifier les mouvements de volatilité et de dividendes en crise (comme en 2020).",
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
   "solution": "Pour N grand, σ²_indice ≈ ρ σ² (le risque spécifique se diversifie). ρ ≈ (15/30)² = **0,25**.\nUn trade de **dispersion** vend la volatilité de l'indice et achète celle des composants (ou l'inverse) : c'est un pari sur l'écart entre corrélation implicite et corrélation réalisée. La corrélation implicite est en général au-dessus de la réalisée (prime de risque de corrélation).",
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
   "solution": "Une suite d'options à départ différé : chaque période (par exemple chaque mois), on regarde la performance de la période, souvent plafonnée et planchée localement (entre −2 % et +2 %), puis on somme les performances, avec parfois un plancher global.\nSon prix dépend de la distribution des rendements **futurs** de chaque période, donc du **smile forward** (le smile qu'on observera dans le futur), qui n'est pas observable aujourd'hui. Volatilité locale et volatilité stochastique, calibrées sur les mêmes vanilles, donnent des prix très différents : les cliquets ont causé des pertes importantes à certaines banques au début des années 2000 et ont poussé à l'usage de modèles à volatilité stochastique.",
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
   "solution": "Juste au-dessus de la barrière, près de l'échéance : si le sous-jacent touche 70, tu reçois un put très dans la monnaie (valeur ≈ 30) ; sinon presque rien. La valeur saute donc d'environ 0 à 30 autour de 70 : **delta énorme** (très négatif), **gamma** et **vega** extrêmes et instables, qui changent de signe de part et d'autre de la barrière. La couverture en delta est impraticable (il faudrait vendre une quantité énorme d'actions juste au-dessus de 70). En pratique, les desks lissent la barrière (barrière décalée dans le sens conservateur, « barrier shift ») et facturent ce coût, et ils surveillent le risque de « pin » autour des barrières.",
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
   "solution": "Le forward d'un indice baisse quand les dividendes attendus montent : F ≈ S e^{rT} − dividendes capitalisés. Or la banque, en vendant des autocalls et des reverse convertibles, **achète des puts** aux investisseurs. Un put vaut plus quand le forward est bas, c'est-à-dire quand les dividendes attendus sont élevés : la banque est donc **longue des dividendes**. Si les dividendes futurs baissent, le forward monte et ses puts perdent de la valeur. Comme toutes les banques vendent des produits semblables, cette exposition est concentrée et pèse sur le prix des dividendes futurs.\nCouverture : **futures sur dividendes** (indices de dividendes cotés, par exemple sur l'Euro Stoxx 50) et swaps de dividendes. Les dividendes réels peuvent chuter brutalement (suspensions en 2020), ce qui a provoqué des pertes sur ces positions.",
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
   "solution": "Duration de Macaulay d'un zéro-coupon = sa maturité, 5 ans. Duration modifiée = D/(1 + y) = 5/1,04 ≈ **4,81**.\nLecture : si le taux monte de 1 point, le prix baisse d'environ 4,81 %.",
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
   "solution": "DV01 ≈ valeur × duration modifiée × 0,0001 = 10 000 000 × 4,8 × 0,0001 = **4 800 €** par point de base.",
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
   "solution": "La duration est l'approximation au premier ordre de la variation de prix ; la convexité est le terme du second ordre :\nΔP/P ≈ −D_mod Δy + ½ C (Δy)².\nUne convexité positive fait que le prix monte plus quand les taux baissent qu'il ne baisse quand les taux montent : c'est un avantage quand la volatilité des taux est forte, que le marché fait payer (rendement plus faible à duration égale).\nLes obligations remboursables par anticipation et les MBS ont une convexité négative (l'émetteur rembourse quand les taux baissent).",
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
   "solution": "Absence d'arbitrage : (1,04)² = 1,03 × (1 + f), donc f = 1,0816/1,03 − 1 ≈ **5,01 %**.\nApproximation rapide : 2 × 4 % − 3 % = 5 %.",
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
   "solution": "La jambe variable vaut 1 − DF(T) (elle se réplique par un prêt au jour le jour renouvelé), la jambe fixe vaut S × Σ DF(tᵢ).\nS = (1 − 0,94)/(0,97 + 0,94) = 0,06/1,91 ≈ **3,14 %**.",
   "en": "Discount factors are 0.97 (1y) and 0.94 (2y). What is the par fixed rate of a 2-year annual swap?",
   "relances": [
    "Pourquoi la jambe variable vaut-elle 1 − DF(T) ? (recevoir les taux variables plus le nominal à la fin équivaut à placer 1 aujourd'hui)",
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
   "question": "Un portefeuille de 1 million d'euros a une volatilité quotidienne de 1 %. VaR à 1 jour, 99 %, en supposant des rendements gaussiens centrés ? (quantile N(0,1) à 99 % : 2,326)",
   "solution": "VaR = 2,326 × 1 % × 1 000 000 ≈ **23 260 €** : une perte qui ne devrait être dépassée qu'un jour sur cent.",
   "en": "A €1m portfolio has 1% daily volatility. One-day 99% VaR under centered normal returns? (99% normal quantile: 2.326)",
   "relances": [
    "VaR à 10 jours ? (× √10 ≈ 73 600 €, en supposant des rendements indépendants)",
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
   "solution": "23 263 × √10 ≈ **73 565 €**. Hypothèses : rendements indépendants et identiquement distribués, portefeuille inchangé sur 10 jours. Avec du retour à la moyenne la règle surestime le risque ; avec de l'autocorrélation positive ou des régimes de volatilité, elle le sous-estime.",
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
   "solution": "- **VaR à α** : le quantile de la perte ; « on ne perdra pas plus que X avec probabilité α ». Simple, facile à backtester, mais muette sur l'ampleur des pertes au-delà, et **non sous-additive** (la VaR d'un portefeuille peut dépasser la somme des VaR : elle peut pénaliser la diversification).\n- **ES à α** : la perte moyenne au-delà de la VaR. Mesure cohérente (sous-additive), sensible aux queues, mais plus difficile à estimer et à backtester.\nLe cadre réglementaire FRTB est passé d'une VaR 99 % à une ES 97,5 % (valeurs proches pour une gaussienne : 2,33σ et 2,34σ).\nMéthodes de calcul : paramétrique (variance-covariance), historique, Monte-Carlo.",
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
   "solution": "ES = φ(1,96)/(1 − 0,975) = 0,0584/0,025 ≈ **2,34 σ**, à comparer à la VaR 99 % (2,33 σ).",
   "en": "For a standard normal loss, what is the 97.5% Expected Shortfall (in standard deviations)?",
   "indice": "ES = E[L | L > q] avec q = 1,96 ; utilise E[X·1{X>q}] = φ(q).",
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
   "solution": "250 × 1 % = **2,5**. Le nombre d'exceptions suit une loi binomiale (250 ; 0,01).\nFeux tricolores de Bâle : 0 à 4 exceptions vert, 5 à 9 orange, 10 ou plus rouge. Test de Kupiec (fréquence), test de Christoffersen (indépendance : les exceptions ne doivent pas être groupées).",
   "en": "How many exceptions do you expect over 250 days for a well-calibrated 99% VaR?",
   "relances": [
    "Probabilité d'au moins 5 exceptions si le modèle est juste ? (≈ 10,8 %)"
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
   "solution": "Règle du triangle de crédit : spread ≈ λ(1 − R), donc λ ≈ 0,012/0,6 = **2 % par an**.",
   "en": "A CDS trades at 120 bp with an assumed 40% recovery. Approximate default intensity?",
   "relances": [
    "Probabilité de survie à 5 ans ? (e^{−0,1} ≈ 90,5 %)"
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
   "solution": "S(5) = e^{−0,02 × 5} = e^{−0,1} ≈ **90,5 %**.",
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
   "solution": "CVA ≈ (1 − R) × PD × EPE = 0,6 × 0,02 × 1 000 000 = **12 000 €**.\nFormule générale : CVA = (1 − R) Σ DF(tᵢ) EE(tᵢ) PD(tᵢ₋₁, tᵢ).",
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
   "solution": "Une équipe indépendante des développeurs vérifie qu'un modèle est adapté à son usage et en mesure le risque (le « risque de modèle »).\nPour un modèle de pricing :\n- **cadre théorique** : hypothèses, adéquation au produit (smile, sauts, taux stochastiques) ;\n- **implémentation** : réimplémentation indépendante, comparaison à des cas à formule fermée, convergence numérique (pas de grille, nombre de trajectoires) ;\n- **calibration** : stabilité des paramètres, qualité d'ajustement, sensibilité aux données ;\n- **tests de stress et cas limites** : paramètres extrêmes, maturités courtes, taux négatifs ;\n- **comparaison à des modèles alternatifs** pour chiffrer le risque de modèle, réserves éventuelles ;\n- **suivi** : backtests, P&L explain.\nTon projet de surface de volatilité est un petit exercice de ce type : vérité connue, contrôles d'arbitrage, limites documentées.",
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
   "solution": "- **Vasicek** : dr = κ(θ − r) dt + σ dW. Gaussien, formules fermées pour les zéro-coupons, mais taux négatifs possibles (longtemps vu comme un défaut, devenu réaliste en zone euro).\n- **CIR** : dr = κ(θ − r) dt + σ√r dW. Taux positifs (Feller : 2κθ ≥ σ²), volatilité qui croît avec le niveau, formules fermées.\n- **Hull-White** : Vasicek avec θ(t) dépendant du temps, choisi pour reproduire exactement la courbe des taux d'aujourd'hui. Très utilisé pour les produits de taux simples et les XVA ; la volatilité σ(t) se calibre sur des swaptions.\nLimites communes : un seul facteur, donc taux parfaitement corrélés entre maturités ; d'où les modèles à deux facteurs et le LMM.",
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
   "solution": "4 800/80 = **60 contrats** vendus. La couverture n'est parfaite que pour un déplacement parallèle de la courbe : risque de pente si les maturités diffèrent, et risque de base entre l'obligation et le future.",
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
   "texte": "En entretien quant, la bonne réponse compte, mais la façon d'y arriver compte autant. L'intervieweur veut voir comment tu penses, parce que c'est ce qu'il aura en face de lui tous les jours. Un candidat qui se trompe en raisonnant à voix haute bat souvent un candidat qui donne le bon chiffre après deux minutes de silence.\n\n## Les six étapes\n\n1. **Reformule la question.** « Si je comprends bien, on lance les dés jusqu'à… et on cherche l'espérance de… ? » Tu évites de répondre à côté et tu gagnes dix secondes.\n2. **Clarifie les hypothèses.** Dés équilibrés ? Tirage avec ou sans remise ? Taux nuls ? Si l'intervieweur dit « à toi de voir », choisis l'hypothèse la plus simple et dis-le.\n3. **Annonce ta démarche avant de calculer.** « Je vais conditionner sur le premier lancer », « Je pose un état par préfixe de la séquence », « C'est une martingale arrêtée ». Même si le calcul échoue, l'idée est notée.\n4. **Commence par un cas simple.** n = 1, n = 2, une seule période, un seul dé. Le cas simple donne souvent la forme générale, et montre de la méthode.\n5. **Calcule en parlant.** Écris lisiblement (papier ou tableau virtuel), donne les résultats intermédiaires.\n6. **Vérifie.** Ordre de grandeur, cas limite (p = 0, p = 1, σ → 0), symétrie, unité. « 14,7 lancers pour voir les six faces : plus que 6, moins que 6 × 6, ça tient. »\n\n## Quand tu bloques\n\n- Dis ce que tu sais : « Je sais que l'espérance s'écrit comme une somme sur… mais je ne vois pas encore comment la calculer. »\n- Propose une version plus simple du problème, ou une simulation mentale (« si je le simulais, je ferais… »).\n- Demande si tu peux faire une hypothèse : c'est une question normale, pas un aveu de faiblesse.\n- Accepte l'indice et rebondis vite : savoir utiliser un indice est une compétence évaluée.\n- Ne reste jamais plus de 20 à 30 secondes en silence total.\n\n## Quand tu t'es trompé\n\nCorrige simplement : « Ah, j'ai compté (6,6) deux fois, donc 11 cas et non 12. » Pas d'excuse, pas de panique. Chez un teneur de marché, l'intervieweur peut te contredire exprès alors que tu as raison : vérifie, puis maintiens ta réponse calmement si elle est juste.\n\n## Les questions ouvertes (« comment ferais-tu… ? »)\n\nStructure : objectif → données → méthode → validation → limites. Par exemple, « Comment construirais-tu un signal de momentum ? » : ce qu'on prédit et à quel horizon ; quelles données (point-in-time, sans biais du survivant) ; la construction ; le backtest (walk-forward, coûts) ; les risques (crowding, retournements, sur-apprentissage).\n\n## Le code en direct\n\n- Commence par la solution simple qui marche, annonce sa complexité, puis améliore.\n- Nomme bien tes variables, teste sur un petit exemple à la main, pense aux cas limites (liste vide, un seul élément, valeurs égales).\n- Parle de ce que tu ferais avec plus de temps (tests, vectorisation).\n\n## Ce qui fait la différence\n\n- **Les relances.** Chaque fiche de l'application liste celles qu'on te posera probablement : entraîne-toi à y répondre, pas seulement à la question initiale.\n- **La concision.** Une réponse de motivation dure une minute, pas cinq.\n- **L'honnêteté.** « Je ne sais pas, mais voilà comment je chercherais » vaut mieux qu'une réponse inventée, surtout sur tes projets."
  },
  {
   "id": "plan",
   "titre": "Plan de préparation",
   "texte": "Tu vises un stage de césure de 5 à 6 mois à partir de [mois de début]. Les recrutements pour ce type de stage « off-cycle » se font souvent quelques semaines à quelques mois avant le début : de décembre à février, des entretiens peuvent tomber à tout moment. Le plan ci-dessous fonctionne donc par **routine quotidienne** et **montée en charge** plutôt que par dates fixes.\n\n## La routine quotidienne (30 à 45 minutes)\n\n| Durée | Quoi | Où |\n|---|---|---|\n| 15 à 25 min | Révisions espacées (15 nouvelles questions par jour + rappels) | Révisions |\n| 3 à 8 min | Un sprint de calcul mental | Calcul mental |\n| 5 à 10 min | Un entretien blanc court, ou une partie de market making (en alternance) | Entretien blanc, Market making |\n| 2 min | Répéter une histoire à voix haute | Mes histoires |\n\nLe plus important est la régularité : la répétition espacée ne marche que si tu reviens chaque jour, même dix minutes.\n\n## Semaine 1 : poser les bases\n\n- Lire les guides « Comment répondre », « Ce que testent les maisons » et « Défendre tes projets ».\n- Écrire « Présente-toi », « Pourquoi la finance quantitative ? » et « Ton stage actuel ».\n- Relancer le code de tes projets, relire tes notes de défense, faire **un** exercice d'extension par projet.\n- Noter ton niveau de départ au calcul mental (sprint de 2 minutes et 80 en 8 minutes).\n\n## Semaines 2 et 3 : volume\n\n- Révisions quotidiennes ; passer à 20 nouvelles questions par jour si le temps le permet.\n- Deux entretiens blancs par semaine, dont un oral avec Claude en mode vocal (Entretien blanc → « Entretien oral avec Claude »).\n- Toutes les histoires rédigées et dites une fois à voix haute.\n- Calcul mental : viser plus de 90 % de précision avant de chercher la vitesse.\n\n## Dès qu'un entretien est fixé\n\n- L'ajouter dans le Journal : l'accueil affiche le compte à rebours et la liste J−7, J−1, Jour J.\n- Réviser en priorité le profil de cette maison (Réglages → profil prioritaire).\n- Préparer « Pourquoi nous ? » pour cette entreprise précise.\n- Un entretien blanc du bon profil à J−3, pas plus tard.\n- Juste après : noter toutes les questions posées. Elles deviennent des fiches « Mes questions ».\n\n## Les deux pièges\n\n1. **Réviser au lieu de s'entraîner.** Lire une solution donne l'illusion de savoir. Il faut répondre d'abord, à voix haute, puis comparer.\n2. **Négliger les projets.** Ce sont les seules questions dont tu connais le sujet à l'avance. Un intervieweur qui creuse un projet et trouve de la compréhension réelle te donnera un avis très favorable ; s'il trouve un vernis, c'est éliminatoire."
  },
  {
   "id": "maisons",
   "titre": "Ce que testent les différentes maisons",
   "texte": "Les processus varient d'une entreprise et d'une année à l'autre ; ce qui suit décrit des tendances souvent rapportées, pas des règles. Renseigne-toi sur chaque processus précis (site de l'entreprise, anciens stagiaires de ton école).\n\n## Déroulé fréquent\n\n1. **Candidature** (CV, parfois lettre ou questions ouvertes).\n2. **Test en ligne** : calcul mental chronométré, probabilités, suites logiques, code (HackerRank, Codility…), parfois des jeux.\n3. **Premier entretien** (RH ou opérationnel, 30 à 45 minutes) : parcours, motivation, quelques questions techniques.\n4. **Entretiens techniques** (un à trois) : probabilités, mathématiques, code, projets.\n5. **Journée finale** (« superday ») : plusieurs entretiens à la suite, parfois une étude de cas ou un jeu de trading.\n\n## Hedge funds et recherche quantitative (QRT, CFM, Squarepoint, Two Sigma…)\n\n- **Probabilités et statistiques** solides : espérances conditionnelles, tests, régression, biais de backtest, sur-apprentissage.\n- **Code** : Python propre, parfois des exercices d'algorithmique ; NumPy et pandas.\n- **Recherche** : « comment testerais-tu ce signal ? », « que penses-tu de ce résultat ? ». Esprit critique sur les données.\n- **Projets** : creusés en profondeur, surtout ce qui n'a pas marché.\n- Dans l'application : profil « hf ». Thèmes prioritaires : probas, stats, ML, code. Ton projet le plus pertinent : stat arb.\n\n## Teneurs de marché et trading propriétaire (Optiver, IMC, Jane Street, Flow Traders, SIG…)\n\n- **Calcul mental** chronométré, souvent dès le premier test (le format « 80 questions en 8 minutes » est fréquemment cité).\n- **Probabilités rapides** et espérances de jeux, souvent en temps limité.\n- **Jeux de market making** : coter un bid/ask sur une quantité incertaine, réagir aux ordres.\n- **Paris et gestion du risque** : Kelly, quand refuser un pari favorable.\n- **Comportement** : calme sous pression, décisions rapides, capacité à changer d'avis.\n- Dans l'application : profil « mm ». Calcul mental tous les jours, Market making, probas niveau 1-2 en vitesse. Projet : market making.\n\n## Banques : quant pricing, strats, structuration (BNP Paribas, Société Générale, Natixis, CACIB, banques américaines…)\n\n- **Produits dérivés** : Black-Scholes, Greeks, parité, smile, options exotiques simples.\n- **Calcul stochastique** : Itô, mouvement brownien, martingales, changement de probabilité, EDP.\n- **Méthodes numériques** : Monte-Carlo, différences finies, calibration.\n- **Code** : Python, souvent C++ (questions de langage).\n- **Culture de marché** : « parle-moi d'un sujet de marché », taux, volatilité.\n- Dans l'application : profil « banque ». Projet le plus pertinent : surface de volatilité.\n\n## Risque, validation de modèles, XVA\n\n- VaR, Expected Shortfall, backtesting ; CVA et exposition ; sensibilités.\n- **Esprit critique** sur les modèles : hypothèses, limites, tests de stress ; qualité de rédaction.\n- Dans l'application : profil « risque ». Thème « Taux, crédit et XVA ».\n\n## Data science et ML (plan B)\n\n- Validation croisée et fuites d'information, régularisation, métriques, choix de modèles.\n- Statistiques et code (pandas, scikit-learn) ; parfois une étude de cas à rendre.\n- Communication des résultats à des non-spécialistes.\n- Dans l'application : profil « data ».\n\n## Langue\n\nBeaucoup d'entretiens se déroulent en anglais, même à Paris. Active « questions en anglais » (Réglages) quelques jours par semaine, et fais un entretien oral avec Claude en anglais."
  },
  {
   "id": "antiseche",
   "titre": "Antisèche : formules",
   "texte": "À relire la veille. Chaque formule ici sert dans au moins une fiche de révision.\n\n## Probabilités\n\n| Loi | Espérance | Variance |\n|---|---|---|\n| Bernoulli(p) | p | p(1 − p) |\n| Binomiale(n, p) | np | np(1 − p) |\n| Géométrique(p), nombre d'essais | 1/p | (1 − p)/p² |\n| Poisson(λ) | λ | λ |\n| Uniforme[a, b] | (a + b)/2 | (b − a)²/12 |\n| Exponentielle(λ) | 1/λ | 1/λ² |\n| Normale(μ, σ²) | μ | σ² |\n| Dé à 6 faces | 3,5 | 35/12 ≈ 2,92 |\n\n- **Espérance totale** : E[X] = E[E[X | Y]] ; **variance totale** : Var X = E[Var(X | Y)] + Var(E[X | Y]).\n- **Bayes** : P(A | B) = P(B | A) P(A) / P(B) ; en cotes : cote a posteriori = cote a priori × rapport de vraisemblance.\n- **E[X] = Σ P(X > n)** pour X entier positif ; ∫ P(X > x) dx en continu.\n- **Statistiques d'ordre** de n uniformes : E[k-ième plus petit] = k/(n + 1).\n- **Min d'exponentielles** de taux λᵢ : exponentielle de taux Σλᵢ ; P(i est le premier) = λᵢ/Σλ.\n- **Ruine du joueur** (pièce équilibrée, départ k, bornes 0 et N) : P(N) = k/N ; durée moyenne k(N − k).\n- **Biaisée** (r = q/p) : P(N) = (1 − r^k)/(1 − r^N).\n- **Attente d'un motif** à pile ou face : somme des 2^ℓ pour chaque longueur ℓ où préfixe = suffixe (PP : 6, PF : 4, PFP : 10, PPP : 14).\n- **Collectionneur** : n(1 + 1/2 + … + 1/n).\n- **Normale** : E|Z| = √(2/π) ≈ 0,80 ; E[Z | Z > a] = φ(a)/(1 − Φ(a)) ; E[max(Z₁, Z₂)] = 1/√π.\n- **Corrélation** : pour n variables de corrélation commune ρ, ρ ≥ −1/(n − 1).\n\n## Calcul stochastique\n\n- Brownien : W_t ~ N(0, t) ; Cov(W_s, W_t) = min(s, t) ; [W]_t = t ; E[W_t⁴] = 3t².\n- **Itô** : df(t, X) = (f_t + μ f_x + ½σ² f_xx) dt + σ f_x dW, avec dX = μ dt + σ dW.\n- d(W²) = 2W dW + dt ; ∫₀ᵀ W dW = (W_T² − T)/2.\n- **Isométrie** : E[(∫ H dW)²] = E[∫ H² dt].\n- **Martingales** : W_t, W_t² − t, exp(θW_t − θ²t/2), W_t³ − 3tW_t.\n- **Brownien géométrique** : S_t = S₀ exp((μ − σ²/2)t + σW_t) ; E[S_t] = S₀e^{μt}.\n- **Ornstein-Uhlenbeck** dX = κ(θ − X) dt + σ dW : variance stationnaire σ²/(2κ) ; demi-vie ln 2/κ ; AR(1) de coefficient e^{−κΔ}.\n- **Réflexion** : P(max_{[0,T]} W ≥ a) = 2P(W_T ≥ a).\n- **Sortie** de (−a, b) depuis 0 : P(b avant −a) = a/(a + b) ; E[τ] = ab.\n- **Girsanov** : sous dQ/dP = exp(−∫θ dW − ½∫θ² dt), W + ∫θ dt est un brownien.\n\n## Black-Scholes (dividende q)\n\n- C = S e^{−qT} N(d₁) − K e^{−rT} N(d₂) ; P = K e^{−rT} N(−d₂) − S e^{−qT} N(−d₁)\n- d₁ = [ln(S/K) + (r − q + σ²/2)T]/(σ√T) ; d₂ = d₁ − σ√T\n- **Parité** : C − P = S e^{−qT} − K e^{−rT} ; forward F = S e^{(r − q)T}\n- **Delta** call e^{−qT}N(d₁) ; **Gamma** e^{−qT}φ(d₁)/(Sσ√T) ; **Vega** S e^{−qT}φ(d₁)√T ; Vega = ΓS²σT\n- **Theta et gamma** (portefeuille couvert, r ≈ 0) : Θ ≈ −½σ²S²Γ\n- **À la monnaie** (r = 0) : C ≈ 0,4 σ S √T ; straddle ≈ 0,8 σ S √T ; delta ≈ 0,5 + 0,2 σ√T\n- **Digitale** : e^{−rT}N(d₂) ; = −∂C/∂K\n- **Densité** (Breeden-Litzenberger) : q(K) = e^{rT} ∂²C/∂K²\n- **EDP** : V_t + (r − q)S V_S + ½σ²S² V_SS − rV = 0\n- **PnL couvert** : ½ΓS²(σ²_réalisée − σ²_implicite) dt\n\n## Taux et crédit\n\n- Duration modifiée D_mod = D_Mac/(1 + y) ; ΔP/P ≈ −D_mod Δy + ½C Δy² ; DV01 ≈ P × D_mod × 10⁻⁴\n- Forward : (1 + r₂)² = (1 + r₁)(1 + f₁,₂)\n- Swap par : S = (1 − DF(T))/Σ DF(tᵢ) (paiements annuels)\n- Crédit : spread ≈ λ(1 − R) ; survie e^{−λT}\n- CVA ≈ (1 − R) Σ DF(tᵢ) EE(tᵢ) PD(tᵢ₋₁, tᵢ)\n- VaR normale : z_α σ √h × valeur ; z₉₅ = 1,645 ; z₉₉ = 2,326 ; ES₉₇,₅ ≈ 2,34 σ\n\n## Statistiques\n\n- OLS : β̂ = (XᵀX)⁻¹Xᵀy ; régression simple : β = ρ σ_y/σ_x ; R² = ρ²\n- Erreur standard de la moyenne σ/√n ; IC 95 % : ± 1,96 σ/√n\n- Sharpe annuel = Sharpe quotidien × √252 ; écart-type de l'estimateur ≈ 1/√(années)\n- Tests multiples : P(au moins un faux positif) = 1 − (1 − α)^m ; Bonferroni α/m\n- Biais d'atténuation : pente × Var(x)/(Var(x) + Var(bruit))\n- Kelly : f* = (bp − q)/b ; en continu μ/σ² ; croissance SR²/2\n\n## Avellaneda-Stoikov (ton projet)\n\n- Prix de réservation r = s − qγσ²(T − t)\n- Spread = γσ²(T − t) + (2/γ) ln(1 + γ/k)\n- Intensité d'exécution λ(δ) = A e^{−kδ}\n\n## SVI (ton projet)\n\n- w(k) = a + b[ρ(k − m) + √((k − m)² + σ²)] ; ailes b(1 ± ρ) ≤ 2 (Lee)\n- Papillon : g(k) ≥ 0 ; calendaire : w(k, T) croissante en T"
  },
  {
   "id": "projets",
   "titre": "Défendre tes projets",
   "texte": "Un à trois projets personnels sont ton meilleur atout et ton plus grand risque. Ils montrent de l'initiative et des sujets pertinents ; mais ils tournent sur des données synthétiques et ont été écrits avec l'aide d'une IA. Un intervieweur creusera, c'est certain. L'objectif : qu'il trouve de la compréhension réelle à chaque niveau où il creuse.\n\n## La règle d'or\n\nNe dis rien que tu ne saurais pas défendre en deux relances. Présente les résultats comme ce qu'ils sont : une validation du code et de la méthode sur une vérité connue, pas une performance de marché. Si on te demande si une IA t'a aidé : oui, et voilà ce que tu as compris, cassé et réparé toi-même.\n\n## Avant chaque entretien (1 heure par projet, une fois)\n\nÉcris, pour chaque projet, une courte note de défense (choix, limites, ce que tu ferais ensuite) et fais au moins un exercice d'extension : change un paramètre, casse quelque chose, répare-le. Tu pourras alors raconter quelque chose que **tu** as observé.\n\n**Surface de volatilité**\n- Change `PARAMS` (ρ = 0, ξ élevé, condition de Feller violée) et regarde ce qui casse.\n- Remplace le bruit gaussien par un bruit proportionnel au spread.\n- Ajoute la pondération par vega dans `fit_svi` et compare les erreurs.\n\n**Arbitrage statistique**\n- Fais varier `demi_vie` (4, 8, 15, 30) et `formation` ; trace la proportion de vraies paires retenues.\n- Ajoute une correction de Bonferroni dans `_choisir_paires` et compare.\n- Ajoute une rupture de régime au milieu du spread et observe le drawdown.\n\n**Market making**\n- Ajoute de la sélection adverse (exécutions surtout quand le prix va contre toi) : A-S gagne-t-il encore ?\n- Ajoute une limite d'inventaire dure et mesure son coût.\n- Refais le balayage de γ pour un autre σ et explique la différence.\n\n## Les pitchs de 30 secondes\n\nÀ écrire toi-même dans Mes histoires → « Le projet dont tu es le plus fier ». Trame : le problème, ce que tu as construit, un chiffre honnête, ce qui n'a pas marché et ce que tu en as appris.\n\n## Ce que l'intervieweur cherche, par projet\n\n| Projet | Pour quel poste | Ce qu'il va tester |\n|---|---|---|\n| Surface de volatilité | Banque (pricing, strats), risque | Black-Scholes, smile, arbitrage, calibration, Heston |\n| Arbitrage statistique | Hedge fund, data science | Cointégration, biais de backtest, tests multiples, validation |\n| Market making | Teneur de marché, trading | Inventaire, spread, sélection adverse, simulation |\n\nLes fiches du thème « Projets types » donnent des exemples de questions probables sur trois projets de référence (surface de volatilité, arbitrage statistique, market making), avec leurs chiffres ; adapte-les à tes propres projets. Révise-les jusqu'à les maîtriser toutes : ce sont les seules questions que tu peux être sûr de recevoir.\n\n## Les anecdotes à savoir raconter\n\n- **SVI** : un minimum local (ρ = 0,92, m = 0,63) ajustait bien les cotations mais donnait une densité négative (g min = −2,17) → pénalité, plusieurs départs, m borné.\n- **Stat arb** : premier réglage à Sharpe nul malgré 8 vraies paires → test peu puissant et 1 540 paires testées (faux positifs) → réglage changé après coup, d'où le Sharpe déflaté et le contrôle négatif. Et un bug de décalage d'un jour, d'où le test anti regard vers le futur.\n- **Market making** : le compteur d'ordres faisait `bool + bool` (OU logique en NumPy) → détecté par un test qui comparait au bon taux d'exécution en temps discret."
  },
  {
   "id": "calcul",
   "titre": "Astuces de calcul mental",
   "texte": "Le calcul mental se travaille comme un sport : un peu chaque jour. Ces astuces font gagner du temps sur les tests chronométrés et pendant les questions de probabilités.\n\n## Ce qu'il faut savoir par cœur\n\n- Tables de multiplication jusqu'à 12 × 12, idéalement jusqu'à 20 × 20.\n- Carrés jusqu'à 25 (et 30 si possible) : 13² = 169, 14² = 196, 15² = 225, 16² = 256, 17² = 289, 18² = 324, 19² = 361, 21² = 441, 22² = 484, 23² = 529, 24² = 576, 25² = 625.\n- Fractions usuelles : 1/6 = 0,1667 ; 1/7 = 0,1429 ; 1/8 = 0,125 ; 1/9 = 0,111 ; 1/11 = 0,0909 ; 1/12 = 0,0833 ; 1/16 = 0,0625 ; 3/8 = 0,375 ; 5/8 = 0,625 ; 7/8 = 0,875.\n- Puissances de 2 jusqu'à 2¹⁶, quelques constantes (thème « Chiffres à connaître »).\n\n## Multiplications\n\n- **Décomposer** : 47 × 6 = 40 × 6 + 7 × 6 = 240 + 42 = 282.\n- **Arrondir puis corriger** : 49 × 23 = 50 × 23 − 23 = 1 150 − 23 = 1 127.\n- **Par 5, 25, 125** : × 5 = × 10 / 2 ; × 25 = × 100 / 4 ; × 125 = × 1 000 / 8.\n- **Carré d'un nombre finissant par 5** : 65² = 6 × 7 puis 25 → 4 225.\n- **Autour d'une base** : 97 × 96 : écarts −3 et −4 ; 97 − 4 = 93 ; 3 × 4 = 12 → 9 312.\n- **Différence de carrés** : 52 × 48 = 50² − 2² = 2 496.\n- **Par 11** (deux chiffres) : 63 × 11 → 6, 6 + 3, 3 → 693.\n\n## Divisions et pourcentages\n\n- Simplifier d'abord : 7,2 ÷ 0,9 = 72 ÷ 9 = 8.\n- Diviser par 5 = multiplier par 2 et diviser par 10.\n- x % de y = y % de x : 16 % de 25 = 25 % de 16 = 4.\n- Hausse de a % puis baisse de a % : variation de −a²/100 %.\n\n## Décimaux\n\n- Aligner mentalement les virgules ; travailler en centimes : 12,75 + 8,6 = 1 275 + 860 centimes = 2 135 → 21,35.\n- Multiplier des décimaux : calculer avec des entiers et replacer la virgule (somme des décimales) : 0,6 × 0,7 = 0,42.\n\n## Estimation et vérification\n\n- Ordre de grandeur avant tout : 312 × 48 ≈ 300 × 50 = 15 000 (exact : 14 976).\n- Preuve par 9 pour détecter une erreur d'addition ou de multiplication.\n- Approximations : √(1 + x) ≈ 1 + x/2 ; (1 + x)ⁿ ≈ 1 + nx ; eˣ ≈ 1 + x + x²/2 ; ln(1 + x) ≈ x − x²/2.\n\n## Stratégie pendant un test chronométré\n\n- La précision d'abord : une erreur coûte souvent plus qu'une question sautée.\n- Ne pas rester bloqué : si une question prend deux fois plus de temps que le rythme visé, passer (si le format le permet).\n- S'entraîner dans les conditions du test : même durée, même nombre de questions, sans papier si le test l'interdit."
  },
  {
   "id": "ressources",
   "titre": "Pour aller plus loin",
   "texte": "Une sélection courte. Mieux vaut un livre travaillé à fond que cinq feuilletés.\n\n## Préparation aux entretiens\n\n- **Xinfeng Zhou, _A Practical Guide to Quantitative Finance Interviews_** : la référence ; casse-têtes, probabilités, calcul stochastique, finance, algorithmes. À faire en entier, en cachant les solutions.\n- **Timothy Crack, _Heard on the Street_** : questions d'entretien quant et finance, avec solutions détaillées.\n- **Mark Joshi, Nick Denson et Andrew Downes, _Quant Job Interview Questions and Answers_** : orienté banque (pricing, C++).\n- **Frederick Mosteller, _Fifty Challenging Problems in Probability_** : court, classique, excellent pour l'intuition.\n\n## Probabilités et calcul stochastique\n\n- **Joseph Blitzstein et Jessica Hwang, _Introduction to Probability_** : clair, beaucoup d'exercices de type entretien.\n- **Steven Shreve, _Stochastic Calculus for Finance I et II_** : du modèle binomial au calcul d'Itô, rigoureux et pédagogique.\n\n## Produits dérivés et volatilité\n\n- **John Hull, _Options, Futures, and Other Derivatives_** : la base pour les entretiens en banque.\n- **Sheldon Natenberg, _Option Volatility and Pricing_** : le point de vue du trader d'options (Greeks, stratégies).\n- **Jim Gatheral, _The Volatility Surface_** : SVI, volatilité locale et stochastique ; directement lié à ton projet.\n- **Paul Wilmott, _Frequently Asked Questions in Quantitative Finance_** : réponses courtes à beaucoup de questions.\n\n## Recherche quantitative, données, microstructure\n\n- **Marcos López de Prado, _Advances in Financial Machine Learning_** : validation croisée purgée, Sharpe déflaté, pièges du backtest.\n- **Jean-Philippe Bouchaud, Julius Bonart, Jonathan Donier et Martin Gould, _Trades, Quotes and Prices_** : microstructure, impact de marché.\n- **Álvaro Cartea, Sebastian Jaimungal et José Penalva, _Algorithmic and High-Frequency Trading_** : market making optimal, prolongement naturel de ton projet Avellaneda-Stoikov.\n\n## Comment t'en servir avec cette application\n\nQuand une question d'un livre te pose problème, ajoute-la à tes révisions : écris-la dans le Journal (un entretien « Autre » nommé d'après le livre), puis « Questions → révisions ». Elle reviendra au bon moment comme les autres."
  }
 ]
};
