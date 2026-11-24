---
titre: Market making et microstructure
partie: Risque, données et marchés
resume: Le carnet d'ordres et les trois composantes du spread, la sélection adverse dans le modèle de Glosten-Milgrom (calcul bayésien complet), le prix de réservation d'Avellaneda-Stoikov démontré par équivalent certain, le spread optimal, l'impact de marché, et la méthode pour « faire un marché » dans les jeux de trading d'Optiver, IMC ou SIG. C'est le chapitre de un projet de market making.
duree: 2 h 30
fiches: mm-carnet-ordres mm-composantes-spread mm-selection-adverse mm-faire-un-marche mm-marche-somme-des mm-option-sur-de mm-meme-de-deux-fois mm-impact-marche mm-arbitrage-etf mm-carry mm-pari-favorable mm-cartes-rouges-noires proj-mm-pitch proj-mm-reservation proj-mm-spread proj-mm-intensite proj-mm-moins-de-pnl proj-mm-manque proj-mm-hjb mm-glosten-milgrom mm-reservation-equivalent-certain
---
Les sociétés de trading (Optiver, IMC, Jane Street, SIG, Flow Traders) sont des **teneurs de marché** : elles affichent en permanence un prix d'achat et un prix de vente, et gagnent l'écart. Leurs entretiens testent donc la capacité à **fixer un prix sous incertitude**, à **réviser** ce prix quand on apprend quelque chose (y compris par le simple fait qu'un client veuille traiter) et à **gérer un inventaire**. Ce chapitre donne la théorie derrière ces réflexes, et celle de ton projet ([[fiche:proj-mm-pitch]]).

## Le carnet d'ordres

:::definition Carnet d'ordres à cours limité ([[fiche:mm-carnet-ordres]])
- Un **ordre à cours limité** (limit order) propose d'acheter ou de vendre une quantité à un prix donné ; s'il n'est pas exécuté immédiatement, il attend dans le **carnet**.
- Un **ordre au marché** (market order) s'exécute immédiatement contre les meilleurs ordres en attente.
- Le meilleur prix d'achat est le **bid**, le meilleur prix de vente l'**ask** ; leur écart est le **spread**, leur moyenne le **prix milieu** (mid). La quantité disponible à chaque prix est la **profondeur**.
- **Priorité prix-temps** : à prix égal, le premier arrivé est servi en premier. D'où la course à la latence et l'importance de la position dans la file.
:::

Un teneur de marché **fournit de la liquidité** avec des ordres limites ; celui qui envoie un ordre au marché **consomme** la liquidité et paie le demi-spread.

:::propriete Les trois composantes du spread ([[fiche:mm-composantes-spread]])
1. **Coûts de traitement** : frais, infrastructure, capital.
2. **Risque d'inventaire** : après avoir acheté, le teneur de marché porte une position dont le prix peut baisser ; il se fait rémunérer ce risque, d'autant plus que l'actif est volatil et peu liquide.
3. **Sélection adverse** : certains clients sont mieux informés ; quand ils achètent, c'est souvent que le prix va monter. Le spread doit compenser les pertes contre ces clients par les gains sur les autres.
Le spread est plus large sur les actifs volatils, peu échangés, et autour des annonces (plus d'information privée).
:::

## La sélection adverse : le modèle de Glosten-Milgrom

:::definition Le modèle
La valeur de l'actif est $V_H$ ou $V_L$ avec probabilité $\frac12$ chacune. Un client arrive : avec probabilité $\alpha$ il est **informé** (il connaît $V$ : il achète si $V = V_H$, vend si $V = V_L$) ; avec probabilité $1 - \alpha$ il est **non informé** et achète ou vend avec probabilité $\frac12$. Le teneur de marché, neutre au risque et en concurrence, fixe des prix qui ne lui font rien gagner en moyenne **sachant** l'ordre reçu :
$$
\text{ask} = \mathbb{E}[V \mid \text{achat}], \qquad \text{bid} = \mathbb{E}[V \mid \text{vente}].
$$
:::

:::theoreme Prix et spread de Glosten-Milgrom
$$
\text{ask} = V_L + \frac{1 + \alpha}{2}(V_H - V_L), \qquad \text{bid} = V_L + \frac{1 - \alpha}{2}(V_H - V_L), \qquad \text{spread} = \alpha\,(V_H - V_L).
$$
:::

:::preuve Par la formule de Bayes (chapitre [[n:conditionnement-markov-martingales]])
$\mathbb{P}(\text{achat} \mid V_H) = \alpha + \frac{1 - \alpha}{2} = \frac{1 + \alpha}{2}$ (l'informé achète toujours, le non informé une fois sur deux) et $\mathbb{P}(\text{achat} \mid V_L) = \frac{1 - \alpha}{2}$. Donc $\mathbb{P}(\text{achat}) = \frac12$ et
$$
\mathbb{P}(V_H \mid \text{achat}) = \frac{\frac12 \cdot \frac{1 + \alpha}{2}}{\frac12} = \frac{1 + \alpha}{2}.
$$
L'ask est $V_L + \mathbb{P}(V_H \mid \text{achat})(V_H - V_L)$. Par symétrie, $\mathbb{P}(V_H \mid \text{vente}) = \frac{1 - \alpha}{2}$. La différence donne le spread.
:::

:::intuition Ce que dit le modèle ([[fiche:mm-selection-adverse]])
- Le spread existe **même sans coût ni aversion au risque** : il vient uniquement de l'asymétrie d'information. Il est proportionnel à la proportion d'informés et à l'incertitude sur la valeur.
- **Chaque ordre est une information** : après un achat, le teneur de marché révise sa croyance vers $V_H$ et monte ses prix. Au fil des ordres, les prix convergent vers la vraie valeur : le marché **apprend**.
- C'est la question piège des entretiens : « je t'achète à ton ask ; tu me refais un prix ? » Il faut **monter**, parce que le fait que j'aie voulu acheter est une information.
:::

:::widget glosten
:::

:::exercice ex-mm-glosten
reponse: 103
La valeur d'une action est 90 ou 110 avec probabilité $\frac12$. 30 % des clients sont informés, les autres achètent ou vendent au hasard. Quel ask fixe un teneur de marché qui ne veut ni gagner ni perdre en moyenne ?
---
$\mathbb{P}(V_H \mid \text{achat}) = \frac{1 + 0{,}3}{2} = 0{,}65$, donc ask $= 90 + 0{,}65 \times 20 = 103$. Par symétrie, bid $= 97$ : spread de 6 $= 0{,}3 \times 20$.
:::

:::exercice ex-mm-glosten-maj
reponse: 90+20*0.65**2/(0.65**2+0.35**2)
tolerance: 0.001
Même marché. Un premier client achète. Quel ask le teneur de marché affiche-t-il pour le client suivant ?
---
Après l'achat, $\mathbb{P}(V_H) = 0{,}65$. Le prochain ask est $\mathbb{E}[V \mid \text{deux achats}]$ : $\mathbb{P}(V_H \mid \text{deux achats}) = \frac{0{,}65 \times 0{,}65}{0{,}65 \times 0{,}65 + 0{,}35 \times 0{,}35} = \frac{0{,}4225}{0{,}545} \approx 0{,}775$, donc ask $\approx 90 + 0{,}775 \times 20 \approx 105{,}5$.
:::

## Le risque d'inventaire : Avellaneda-Stoikov

:::definition Le cadre (celui de ton projet)
- Le prix milieu suit un brownien arithmétique $dS_t = \sigma\,dW_t$ jusqu'à l'horizon $T$.
- Le teneur de marché détient $q$ titres et $x$ euros ; il cote un ask $S + \delta^a$ et un bid $S - \delta^b$.
- Ses ordres sont exécutés selon des processus de Poisson d'intensité $\lambda(\delta) = Ae^{-k\delta}$ : plus il cote loin du milieu, moins il est exécuté ([[fiche:proj-mm-intensite]]).
- Il maximise une **utilité exponentielle** $\mathbb{E}\big[-e^{-\gamma(x_T + q_TS_T)}\big]$, avec une aversion au risque $\gamma$.
:::

:::theoreme Prix de réservation
Le prix auquel le teneur de marché est **indifférent** à acheter ou vendre une unité supplémentaire est, en moyenne entre achat et vente,
$$
r = s - q\,\gamma\,\sigma^2\,(T - t).
$$
:::

:::preuve Par l'équivalent certain
**Étape 1 : la valeur d'un inventaire figé.** Sans trader d'ici $T$, la richesse finale est $x + qS_T$ avec $S_T \sim \mathcal{N}\big(s, \sigma^2(T - t)\big)$. Par la transformée de Laplace gaussienne (chapitre [[n:lois-gaussiennes]]), $\mathbb{E}[e^{-\gamma qS_T}] = e^{-\gamma qs + \frac12\gamma^2q^2\sigma^2(T - t)}$, donc
$$
v(x, q) = \mathbb{E}\big[-e^{-\gamma(x + qS_T)}\big] = -\exp\Big(-\gamma\Big(x + qs - \tfrac12\gamma q^2\sigma^2(T - t)\Big)\Big).
$$
La quantité $x + qs - \frac12\gamma q^2\sigma^2(T - t)$ est l'**équivalent certain** : la valeur de marché moins une pénalité quadratique en l'inventaire.

**Étape 2 : prix de réservation à l'achat.** C'est le prix $r^b$ qui laisse indifférent à acheter une unité : $v(x - r^b, q + 1) = v(x, q)$. En égalant les équivalents certains :
$$
x - r^b + (q + 1)s - \tfrac12\gamma(q + 1)^2\sigma^2(T - t) = x + qs - \tfrac12\gamma q^2\sigma^2(T - t),
$$
d'où $r^b = s - \frac12\gamma\sigma^2(T - t)\big((q + 1)^2 - q^2\big) = s - \frac12(1 + 2q)\,\gamma\sigma^2(T - t)$.

**Étape 3 : à la vente**, $v(x + r^a, q - 1) = v(x, q)$ donne de même $r^a = s + \frac12(1 - 2q)\,\gamma\sigma^2(T - t)$.

**Étape 4 :** la moyenne $\frac12(r^a + r^b) = s - q\gamma\sigma^2(T - t)$.
:::

:::intuition Lecture ([[fiche:proj-mm-reservation]])
Avec un inventaire **long** ($q > 0$), le prix de réservation est **sous** le milieu : le teneur de marché baisse ses deux cotations, ce qui le fait vendre plus facilement et acheter moins. Le décalage est proportionnel à l'inventaire, à l'aversion au risque, à la variance et au **temps restant** (à l'approche de la clôture, il reste peu de risque à porter). Exemple de la fiche : $s = 100$, $q = 3$, $\gamma = 0{,}5$, $\sigma = 2$, $T - t = 0{,}5$ donnent $r = 100 - 3 \times 0{,}5 \times 4 \times 0{,}5 = 97$.
:::

:::exercice ex-mm-reservation
reponse: 50.8
Prix milieu 50, inventaire **court** de 4 titres ($q = -4$), $\gamma = 0{,}1$, $\sigma = 1$, $T - t = 2$. Prix de réservation ?
---
$r = 50 - (-4) \times 0{,}1 \times 1 \times 2 = 50{,}8$ : à découvert, le teneur de marché remonte ses prix pour racheter plus facilement.
:::

:::theoreme Spread optimal (admis, via l'équation de Hamilton-Jacobi-Bellman)
Autour du prix de réservation, le spread total optimal est approximativement
$$
\delta^a + \delta^b = \gamma\sigma^2(T - t) + \frac{2}{\gamma}\ln\Big(1 + \frac\gamma k\Big).
$$
:::

:::preuve Du second terme, isolé
Le terme $\frac1\gamma\ln(1 + \frac\gamma k)$ est l'écart optimal de **chaque** côté pour une seule exécution : on maximise l'utilité espérée du gain $\delta$ pondérée par la probabilité d'exécution, soit $e^{-k\delta}\big(1 - e^{-\gamma\delta}\big)$ (à des constantes près). En dérivant :
$$
-ke^{-k\delta}\big(1 - e^{-\gamma\delta}\big) + e^{-k\delta}\gamma e^{-\gamma\delta} = 0 \iff e^{-\gamma\delta}(\gamma + k) = k \iff \delta = \frac1\gamma\ln\Big(1 + \frac\gamma k\Big).
$$
Quand $\gamma \to 0$ (neutralité au risque), $\delta \to \frac1k$ : c'est le maximum de $\delta e^{-k\delta}$, compromis entre gagner plus par exécution et être exécuté moins souvent. Le premier terme du spread, $\gamma\sigma^2(T - t)$, rémunère le risque d'inventaire ([[fiche:proj-mm-spread]], [[fiche:proj-mm-hjb]]).
:::

:::exercice ex-mm-spread
reponse: 0.1*4+2/0.1*log(1+0.1/1)
tolerance: 0.001
Avellaneda-Stoikov avec $\gamma = 0{,}1$, $\sigma = 2$, $k = 1$, $T - t = 1$. Spread total optimal ?
---
$0{,}1 \times 4 \times 1 + \frac{2}{0{,}1}\ln(1{,}1) = 0{,}4 + 20 \times 0{,}0953 \approx 2{,}31$. Le terme de liquidité domine (proche de $2/k = 2$), le risque d'inventaire ajoute 0,4.
:::

:::attention Ce que ton projet montre et ce qui lui manque ([[fiche:proj-mm-moins-de-pnl]], [[fiche:proj-mm-manque]])
Ta stratégie Avellaneda-Stoikov gagne **moins en moyenne** que le teneur de marché naïf, mais avec un PnL beaucoup moins dispersé et un inventaire contenu : c'est un choix de **risque**, pas une amélioration gratuite. Ce qui manque pour un vrai marché : la **sélection adverse** (section précédente : tes exécutions seraient plus souvent du mauvais côté), la file d'attente, les tailles, le tick, les frais et rabais, la latence, les sauts. Bonne extension à proposer en entretien : ajouter des clients informés et voir si la stratégie reste rentable.
:::

## L'impact de marché et l'exécution

:::propriete La loi en racine carrée ([[fiche:mm-impact-marche]])
Empiriquement, l'impact moyen d'un ordre de taille $Q$ exécuté dans la journée est
$$
\text{impact} \approx Y\,\sigma_{\text{jour}}\sqrt{\frac{Q}{V}},
$$
où $V$ est le volume quotidien et $Y$ une constante de l'ordre de 1. Il est **concave** : doubler la taille ne double pas l'impact.
:::

:::exemple Acheter 5 % du volume quotidien
Volatilité quotidienne 2 % : impact $\approx 2\,\% \times \sqrt{0{,}05} \approx 0{,}45\,\%$, soit 45 points de base, souvent bien plus que le spread. On découpe l'ordre (TWAP, VWAP, participation à un pourcentage du volume) ; le modèle d'**Almgren-Chriss** choisit le rythme qui équilibre impact (aller vite coûte cher) et risque de prix (aller lentement expose aux mouvements du marché), avec la même logique moyenne-variance qu'au chapitre [[n:risque-et-portefeuille]].
:::

:::exercice ex-mm-impact
reponse: 2*sqrt(0.05)
tolerance: 0.001
Une action a une volatilité quotidienne de 2 %. Tu dois acheter 5 % de son volume quotidien. Impact attendu, en %, avec la loi en racine carrée ($Y = 1$) ?
---
$2\,\% \times \sqrt{0{,}05} \approx 0{,}447\,\%$. Pour 20 % du volume, ce serait $0{,}89\,\%$ : quatre fois plus de titres, deux fois plus d'impact.
:::

:::propriete Deux arbitrages classiques
- **ETF contre panier** ([[fiche:mm-arbitrage-etf]]) : si l'ETF cote au-dessus de la valeur de son panier, les participants autorisés achètent le panier, créent des parts d'ETF et les vendent ; l'inverse sinon. Ce mécanisme de création-rachat maintient le prix de l'ETF près de sa valeur liquidative, aux coûts près.
- **Carry** ([[fiche:mm-carry]]) : être long de l'actif qui rapporte le plus en le finançant avec celui qui rapporte le moins (devises à taux élevé contre devises à taux bas, pente de la courbe des taux). Gain régulier, risque de krach brutal (« monter par l'escalier, descendre par l'ascenseur »).
:::

## Faire un marché en entretien

:::methode Répondre à « fais-moi un marché sur… » ([[fiche:mm-faire-un-marche]])
1. **Estimer une valeur juste** (espérance) et une **incertitude** (écart-type), à voix haute, avec des ordres de grandeur.
2. **Coter** bid et ask autour de la valeur juste, avec une largeur qui reflète l'incertitude : assez étroite pour être utile à l'autre, assez large pour ne pas se faire arbitrer.
3. **Réviser après chaque trade** : si l'on t'achète à ton ask, c'est peut-être que tu es trop bas ; remonte le milieu (sélection adverse), et tiens compte de ton inventaire (Avellaneda-Stoikov).
4. **Réviser après chaque information** : recalculer l'espérance conditionnelle.
5. Rester **cohérent** : ne jamais coter un bid au-dessus d'un ask que tu as affiché, ni des prix qui permettent de t'arbitrer (une somme de marchés incohérente).
:::

:::exemple La somme de deux dés ([[fiche:mm-marche-somme-des]])
Valeur juste $\mathbb{E}[S] = 7$, écart-type $\sqrt{2 \times \frac{35}{12}} = \sqrt{\frac{35}{6}} \approx 2{,}4$. Un marché raisonnable : $6{,}5 - 7{,}5$. Si l'on t'achète à 7,5 et qu'on t'apprend que le premier dé fait 6, la nouvelle valeur juste est $6 + 3{,}5 = 9{,}5$ : tu cotes par exemple $9 - 10$. Ta position courte vient de perdre 2 en espérance : c'est le risque d'inventaire.
:::

:::exercice ex-mm-ecart-type-des
reponse: sqrt(35/6)
tolerance: 0.001
Écart-type de la somme de deux dés équilibrés ?
---
Un dé a une variance $\frac{6^2 - 1}{12} = \frac{35}{12}$ ; les dés sont indépendants : $\operatorname{Var}(S) = \frac{35}{6}$ et l'écart-type vaut $\approx 2{,}42$.
:::

:::exercice ex-mm-max-des
reponse: 161/36
tolerance: 0.001
Valeur juste du maximum de deux dés équilibrés ?
---
$\mathbb{P}(\max \le k) = \frac{k^2}{36}$, donc $\mathbb{P}(\max = k) = \frac{k^2 - (k - 1)^2}{36} = \frac{2k - 1}{36}$. $\mathbb{E}[\max] = \sum_k k\,\frac{2k - 1}{36} = \frac{1 + 6 + 15 + 28 + 45 + 66}{36} = \frac{161}{36} \approx 4{,}47$.
:::

:::exercice ex-mm-option-des
reponse: 5/9
tolerance: 0.001
Combien vaut une option qui paie $\max(S - 8, 0)$, où $S$ est la somme de deux dés ?
---
$\mathbb{P}(S = 9, 10, 11, 12) = \frac{4}{36}, \frac{3}{36}, \frac{2}{36}, \frac{1}{36}$. Valeur $= \frac{1 \times 4 + 2 \times 3 + 3 \times 2 + 4 \times 1}{36} = \frac{20}{36} = \frac59 \approx 0{,}56$. Remarque : c'est plus que $\max(\mathbb{E}[S] - 8, 0) = 0$ ; une option a de la valeur grâce à la dispersion (Jensen), comme au chapitre [[n:black-scholes]].
:::

:::propriete Espérance, variance et taille des paris ([[fiche:mm-pari-favorable]])
Un pari d'espérance positive n'est pas forcément à prendre **en entier** : « pile tu gagnes 3 M€, face tu perds 1 M€ » a une espérance de 1 M€, mais une perte de 1 M€ peut être ruineuse. La bonne réponse parle de **taille** (Kelly, chapitre [[n:risque-et-portefeuille]]), de partage du risque (vendre une partie du pari) et d'utilité. En jeu de trading, on dimensionne ses positions en fonction de l'avantage **et** de la variance, et on ne met jamais en jeu toute sa richesse.
:::

:::exemple Le jeu des cartes rouges et noires ([[fiche:mm-cartes-rouges-noires]])
On retourne 52 cartes ; chaque rouge rapporte 1, chaque noire coûte 1, et l'on peut s'arrêter quand on veut. La valeur se calcule par **programmation dynamique** à rebours : $V(r, n) = \max\big(0, \frac{r}{r + n}(1 + V(r - 1, n)) + \frac{n}{r + n}(-1 + V(r, n - 1))\big)$ avec $r$ rouges et $n$ noires restantes. On trouve environ 2,62 pour un jeu complet. C'est le même raisonnement d'arrêt optimal que pour une option américaine (chapitre [[n:arbitrage-et-risque-neutre]]).
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Ne pas bouger son prix après avoir été traité (oublier la sélection adverse).
- Coter un marché trop large par prudence : en entretien, un marché inutilisable est une mauvaise réponse.
- Confondre la valeur juste (espérance) et le prix qu'on accepterait compte tenu de son inventaire (prix de réservation).
- Ignorer l'impact de marché dans un backtest (chapitre [[n:statistiques-et-regression]]).
- Accepter un pari favorable sans parler de sa taille.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Fais-moi un marché sur la somme de deux dés. Je t'achète. Le premier dé fait 6. Nouveau marché ? »** Méthode en cinq étapes, valeur juste 9,5, et le mot « sélection adverse ».
- **« De quoi se compose le spread ? »** Coûts, inventaire, sélection adverse ; Glosten-Milgrom en une phrase.
- **« Présente ton projet de market making. »** Le problème (spread contre risque d'inventaire), le prix de réservation démontré par équivalent certain, le spread optimal, le compromis PnL moyen contre dispersion, et ce qui manque.
- **« Comment exécuterais-tu un ordre de 5 % du volume quotidien ? »** Loi en racine carrée, découpage, Almgren-Chriss.
- **« Pile tu gagnes 3 M€, face tu perds 1 M€. Tu prends ? »** Espérance, variance, taille, Kelly, partage du risque.
:::
