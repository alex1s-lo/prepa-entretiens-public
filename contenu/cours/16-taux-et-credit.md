---
titre: Taux d'intérêt et risque de crédit
partie: Pricing
resume: Actualisation et courbe zéro-coupon, taux forward par arbitrage, duration, DV01 et convexité démontrées, valorisation d'un swap de taux par télescopage, forme et ACP de la courbe ; puis le crédit : intensité de défaut, triangle du crédit (démontré exactement), modèle de Merton et CVA.
duree: 2 h 30
fiches: taux-forward taux-duration taux-dv01 taux-convexite taux-hedge-ratio-future taux-swap-definition taux-swap-par taux-courbe-inversee stats-pca-taux taux-modeles-taux-courts taux-intensite-defaut taux-survie taux-cva-simple taux-xva taux-validation-modele taux-swap-telescopage
---
Les taux sont partout : chaque flux futur doit être actualisé, chaque dérivé a une jambe de financement, et une banque gère des milliers de swaps. Les questions d'entretien sont surtout des **calculs d'arbitrage** courts (taux forward, taux de swap, duration) et des **intuitions** (convexité, forme de la courbe, CVA). Le crédit ajoute une idée : un défaut se modélise comme le premier saut d'un processus de Poisson, ce qui transforme une probabilité de survie en un taux d'actualisation supplémentaire.

## Actualisation et courbe zéro-coupon

:::definition Facteur d'actualisation et taux zéro-coupon
$P(0, T)$ est le prix aujourd'hui d'un euro payé en $T$ sans risque (une obligation **zéro-coupon**). On l'exprime par un taux zéro-coupon $r(T)$, selon une convention :
- composition **annuelle** : $P(0, T) = (1 + r_a)^{-T}$ ;
- composition **continue** : $P(0, T) = e^{-r_cT}$, avec $r_c = \ln(1 + r_a)$ ;
- **simple** (monétaire, moins d'un an) : $P(0, T) = \frac{1}{1 + r_sT}$.
La fonction $T \mapsto r(T)$ est la **courbe des taux**.
:::

:::propriete Valeur d'un flux quelconque
Par absence d'arbitrage, une suite de flux certains $c_i$ payés en $T_i$ vaut $\sum_i c_iP(0, T_i)$ : chaque flux est répliqué par $c_i$ zéro-coupons. C'est la loi du prix unique du chapitre [[n:arbitrage-et-risque-neutre]], appliquée flux par flux.
:::

## Taux forward

:::theoreme Taux forward par arbitrage
Le taux forward $f(T_1, T_2)$ est le taux que l'on peut **garantir aujourd'hui** pour un prêt entre $T_1$ et $T_2$. Sans arbitrage,
$$
1 + f(T_1, T_2)\,(T_2 - T_1) = \frac{P(0, T_1)}{P(0, T_2)} \quad \text{(simple)}, \qquad f = \frac{r_2T_2 - r_1T_1}{T_2 - T_1} \quad \text{(continu)}.
$$
:::

:::preuve
Placer un euro jusqu'en $T_2$ rapporte $1/P(0, T_2)$. Autre stratégie : placer jusqu'en $T_1$ (on obtient $1/P(0, T_1)$), et **fixer aujourd'hui** le replacement de cette somme entre $T_1$ et $T_2$ au taux $f$. Les deux stratégies ne comportent aucun risque et coûtent un euro : elles doivent rapporter la même chose, $\frac{1}{P(0, T_1)}\big(1 + f(T_2 - T_1)\big) = \frac{1}{P(0, T_2)}$. Si $f$ était plus grand, on emprunterait sur $[0, T_2]$ et on placerait par la seconde stratégie, et inversement. En continu : $e^{r_1T_1}e^{f(T_2 - T_1)} = e^{r_2T_2}$.
:::

:::intuition Le forward est une moyenne
En continu, $r_2T_2 = r_1T_1 + f\,(T_2 - T_1)$ : le taux long est la **moyenne** du taux court et du forward. Si la courbe monte ($r_2 > r_1$), le forward est **au-dessus** des deux taux. Le **forward instantané** $f(0, T) = -\partial_T\ln P(0, T)$ est la limite quand $T_2 \to T_1$.
:::

:::exercice ex-tc-forward
reponse: 1.03**2/1.02-1
tolerance: 0.00001
Taux zéro-coupon (composition annuelle) : 2 % à 1 an, 3 % à 2 ans. Quel est le taux forward 1 an dans 1 an ?
---
$(1{,}03)^2 = (1{,}02)(1 + f)$, donc $f = \frac{1{,}0609}{1{,}02} - 1 \approx 4{,}01\,\%$. Approximation par la moyenne : $2 \times 3\,\% - 2\,\% = 4\,\%$.
:::

## Obligations : duration et convexité

:::definition Rendement actuariel, duration, convexité
Une obligation qui paie $c_i$ en $T_i$ a un prix $P(y) = \sum_i c_i(1 + y)^{-T_i}$, où $y$ est son **rendement actuariel** (le taux unique qui redonne le prix de marché). On définit :
- la **duration de Macaulay** $D_{\text{mac}} = \dfrac{1}{P}\sum_i T_i\,c_i(1 + y)^{-T_i}$, moyenne des dates de paiement pondérée par la valeur actuelle des flux ;
- la **duration modifiée** $D = -\dfrac{1}{P}\dfrac{dP}{dy}$, sensibilité relative du prix au rendement ;
- la **convexité** $C = \dfrac{1}{P}\dfrac{d^2P}{dy^2}$.
:::

:::theoreme Lien entre les durations, approximation du prix
$$
D = \frac{D_{\text{mac}}}{1 + y}, \qquad \frac{\Delta P}{P} \approx -D\,\Delta y + \frac12\,C\,(\Delta y)^2.
$$
En composition continue ($P = \sum c_ie^{-yT_i}$), $D = D_{\text{mac}}$ exactement. Pour un zéro-coupon, $D_{\text{mac}} = T$.
:::

:::preuve
$\frac{dP}{dy} = \sum_i c_i\,(-T_i)(1 + y)^{-T_i - 1} = -\frac{1}{1 + y}\sum_i T_ic_i(1 + y)^{-T_i} = -\frac{P\,D_{\text{mac}}}{1 + y}$. On divise par $-P$. L'approximation est le développement de Taylor de $P$ à l'ordre 2 en $y$, divisé par $P$. En continu, $\frac{dP}{dy} = -\sum T_ic_ie^{-yT_i}$, d'où $D = D_{\text{mac}}$.
:::

:::propriete DV01 et couverture ([[fiche:taux-dv01]], [[fiche:taux-hedge-ratio-future]])
- **DV01** (ou PV01) : variation de valeur pour une baisse d'un point de base ($0{,}01\,\%$) : $\text{DV01} = D \times P \times 10^{-4}$. Une position de 10 M€ de duration 4,8 a une DV01 de 4 800 €.
- **Couvrir** une position avec un instrument de DV01 $d_h$ : vendre $\text{DV01}_{\text{position}}/d_h$ unités. C'est une couverture contre un **déplacement parallèle** de la courbe seulement.
:::

:::intuition Pourquoi la convexité est appréciée ([[fiche:taux-convexite]])
La convexité est positive pour une obligation classique (le prix est une somme d'exponentielles décroissantes, donc convexe en $y$). Pour deux portefeuilles de même prix et même duration, le plus convexe gagne plus quand les taux baissent et perd moins quand ils montent : le terme $\frac12C(\Delta y)^2$ est toujours positif. C'est l'analogue exact du **gamma** d'une option (chapitre [[n:grecques-et-couverture]]), et il se paie de la même façon : les obligations plus convexes offrent un rendement un peu plus faible.
:::

:::widget obligation
:::

:::exercice ex-tc-duration
reponse: (5/1.05+2*105/1.05**2)/100/1.05
tolerance: 0.0001
Obligation à 2 ans, coupon annuel de 5 %, rendement actuariel 5 % (elle cote donc 100). Quelle est sa duration modifiée ?
---
Flux actualisés : $5/1{,}05 = 4{,}762$ à 1 an et $105/1{,}05^2 = 95{,}238$ à 2 ans. $D_{\text{mac}} = \frac{1 \times 4{,}762 + 2 \times 95{,}238}{100} = 1{,}952$ an, et $D = 1{,}952/1{,}05 \approx 1{,}859$. Un point de rendement en plus fait perdre environ 1,86 % du prix.
:::

:::exercice ex-tc-convexite
reponse: exp(-0.1)-1
tolerance: 0.00001
Zéro-coupon 10 ans, taux en composition continue passant de 4 % à 5 %. Variation relative **exacte** du prix ? Compare à l'approximation par la duration seule, puis avec la convexité.
---
$P = e^{-10y}$, donc $\frac{\Delta P}{P} = e^{-10 \times 0{,}01} - 1 \approx -9{,}516\,\%$. Duration seule ($D = 10$) : $-10\,\%$. Avec la convexité ($C = T^2 = 100$) : $-10\,\% + \frac12 \times 100 \times 0{,}0001 = -9{,}5\,\%$, beaucoup plus proche.
:::

## Swaps de taux

:::definition Swap de taux d'intérêt ([[fiche:taux-swap-definition]])
Deux contreparties échangent, sur un nominal $N$ et aux dates $T_1, \dots, T_n$ (pas $\delta$), une **jambe fixe** (taux $K$) contre une **jambe variable** (le taux de référence de chaque période : Euribor, fixé au début de la période, ou €STR composé au jour le jour sur la période, connu seulement à la fin). Le nominal n'est pas échangé. Usages : une entreprise transforme une dette à taux variable en taux fixe ; une banque couvre son risque de taux ; un investisseur prend une position sur les taux sans financer d'obligation.
:::

:::theoreme Valeur de la jambe variable et taux de swap au pair
Dans le cadre classique (une seule courbe pour projeter et actualiser), la jambe variable vaut $N\big(1 - P(0, T_n)\big)$ et le taux fixe qui annule la valeur du swap est
$$
S = \frac{1 - P(0, T_n)}{\delta\sum_{i=1}^n P(0, T_i)}.
$$
Le dénominateur $A = \delta\sum P(0, T_i)$ est l'**annuité** (ou PV01 du swap, à $10^{-4}$ près).
:::

:::preuve Par télescopage
Le paiement variable de la période $i$ vaut $\delta L_i$ payé en $T_i$, où $L_i$ est le taux fixé en $T_{i-1}$. Par le même argument que pour le taux forward, ce flux se réplique sans risque : placer un euro en $T_{i-1}$ jusqu'en $T_i$ rapporte $1 + \delta L_i$ en $T_i$. Recevoir $\delta L_i$ en $T_i$ équivaut donc à recevoir 1 en $T_{i-1}$ et payer 1 en $T_i$, ce qui vaut aujourd'hui $P(0, T_{i-1}) - P(0, T_i)$. En sommant :
$$
\sum_{i=1}^n\big(P(0, T_{i-1}) - P(0, T_i)\big) = P(0, T_0) - P(0, T_n) = 1 - P(0, T_n).
$$
La jambe fixe vaut $K\delta\sum_i P(0, T_i) = KA$. On égalise les deux jambes.
:::

:::intuition Lecture
Le taux de swap est une **moyenne pondérée des taux forward** (poids proportionnels aux $P(0, T_i)$). Une obligation à taux fixe de coupon $S$ cote au pair : un swap payeur de taux fixe équivaut à « être court d'une obligation à taux fixe et long d'une obligation à taux variable », d'où sa duration négative.
:::

:::exercice ex-tc-swap
reponse: (1-0.93)/(0.98+0.955+0.93)
tolerance: 0.00001
Facteurs d'actualisation : 0,98 à 1 an, 0,955 à 2 ans, 0,93 à 3 ans. Quel est le taux d'un swap 3 ans à paiements annuels, de valeur nulle aujourd'hui ?
---
$S = \frac{1 - 0{,}93}{0{,}98 + 0{,}955 + 0{,}93} = \frac{0{,}07}{2{,}865} \approx 2{,}443\,\%$.
:::

:::attention Le monde à plusieurs courbes
Depuis 2008, on n'actualise plus avec la même courbe que celle qui sert à projeter les taux variables : les flux collatéralisés sont actualisés au taux du collatéral (€STR, SOFR), et l'Euribor contient une prime de crédit et de liquidité. La formule de télescopage n'est alors plus exacte. Il suffit de le mentionner en entretien.
:::

## La forme de la courbe

:::propriete Formes et théories ([[fiche:taux-courbe-inversee]])
- Courbe **croissante** (normale), **plate**, **inversée** (taux courts au-dessus des longs, souvent quand le marché anticipe des baisses de taux de la banque centrale, historiquement avant des récessions).
- **Anticipations** : les taux longs reflètent les taux courts futurs attendus. **Prime de terme** (ou de liquidité) : les investisseurs exigent un supplément pour prêter long. **Segmentation** : chaque maturité a son offre et sa demande.
:::

:::propriete ACP des variations de la courbe ([[fiche:stats-pca-taux]])
Une analyse en composantes principales des variations quotidiennes des taux de 2 à 30 ans donne trois facteurs : **niveau** (tous les taux bougent ensemble, environ 80 à 90 % de la variance), **pente** (courts contre longs, environ 5 à 15 %), **courbure** (milieu contre extrémités, quelques %). On couvre un livre de taux facteur par facteur plutôt que maturité par maturité.
:::

## Risque de crédit

:::definition Intensité de défaut
On modélise l'instant de défaut $\tau$ comme le premier saut d'un processus de Poisson d'intensité $\lambda$ : sur un petit intervalle, $\mathbb{P}(\tau \in [t, t + dt] \mid \tau > t) = \lambda\,dt$. Alors $\tau$ suit une loi **exponentielle** :
$$
\mathbb{P}(\tau > t) = e^{-\lambda t}.
$$
:::

:::preuve
Notons $Q(t) = \mathbb{P}(\tau > t)$. Survivre jusqu'en $t + dt$, c'est survivre jusqu'en $t$ puis ne pas faire défaut : $Q(t + dt) = Q(t)(1 - \lambda\,dt)$. D'où $Q'(t) = -\lambda Q(t)$ et $Q(t) = e^{-\lambda t}$ puisque $Q(0) = 1$ ([[fiche:taux-survie]]).
:::

:::exemple Une obligation risquée
Une obligation zéro-coupon émise par un emprunteur d'intensité $\lambda$, avec recouvrement nul, vaut $e^{-rT}\mathbb{P}(\tau > T) = e^{-(r + \lambda)T}$ : l'intensité s'**ajoute au taux**. Avec un recouvrement $R$, le spread de crédit vaut environ $\lambda(1 - R)$.
:::

:::exercice ex-tc-survie
reponse: exp(-0.06)-exp(-0.09)
tolerance: 0.0001
Intensité de défaut constante de 3 % par an. Quelle est la probabilité que le défaut survienne **pendant la troisième année** ?
---
$\mathbb{P}(2 < \tau \le 3) = e^{-0{,}06} - e^{-0{,}09} \approx 0{,}9418 - 0{,}9139 = 2{,}78\,\%$. C'est un peu moins que 3 % : il faut d'abord survivre deux ans.
:::

:::theoreme Le triangle du crédit
Un CDS protège contre le défaut : l'acheteur paie une prime continue au taux $s$ (le **spread**) tant qu'il n'y a pas de défaut, et reçoit $1 - R$ au défaut si celui-ci survient avant $T$. Avec intensité $\lambda$ et taux $r$ constants, le spread qui annule la valeur du contrat est **exactement**
$$
s = \lambda\,(1 - R).
$$
:::

:::preuve
**Jambe de prime** : $\mathbb{E}\left[\int_0^{T \wedge \tau}s\,e^{-rt}\,dt\right] = s\int_0^T e^{-rt}\,\mathbb{P}(\tau > t)\,dt = s\int_0^T e^{-(r + \lambda)t}\,dt$.

**Jambe de protection** : $\mathbb{E}\big[(1 - R)e^{-r\tau}\mathbf{1}_{\tau \le T}\big] = (1 - R)\int_0^T e^{-rt}\,\lambda e^{-\lambda t}\,dt = (1 - R)\,\lambda\int_0^T e^{-(r + \lambda)t}\,dt$, en utilisant la densité $\lambda e^{-\lambda t}$ de $\tau$.

Les deux intégrales sont identiques : l'égalité des jambes donne $s = \lambda(1 - R)$, quels que soient $r$ et $T$ ([[fiche:taux-intensite-defaut]]).
:::

:::exercice ex-tc-triangle
reponse: 0.018/0.6
tolerance: 0.0001
Un CDS 5 ans cote 180 points de base, le recouvrement supposé est de 40 %. Quelle intensité de défaut le marché implique-t-il ?
---
$\lambda = \frac{s}{1 - R} = \frac{0{,}018}{0{,}6} = 3\,\%$ par an, soit une probabilité de survie à 5 ans de $e^{-0{,}15} \approx 86\,\%$.
:::

:::definition Le modèle structurel de Merton
L'actif de l'entreprise $A$ suit un brownien géométrique ; la dette est un zéro-coupon de nominal $D$ à l'échéance $T$. À l'échéance, les actionnaires reçoivent $(A_T - D)^+$ : **les actions sont un call sur l'actif** de l'entreprise, et la dette risquée vaut une dette sans risque moins un put. La probabilité de défaut risque-neutre est $N(-d_2)$, et la « distance au défaut » $d_2$ mesure en écarts-types l'éloignement de l'actif au seuil de dette.
:::

## CVA et XVA

:::definition CVA (credit valuation adjustment)
Si la contrepartie d'un dérivé fait défaut alors que le contrat a pour nous une valeur positive, on perd cette valeur (moins le recouvrement). La CVA est la valeur de cette perte :
$$
\text{CVA} \approx (1 - R)\sum_i \text{EE}(t_i)\;\mathbb{P}(t_{i-1} < \tau \le t_i)\;P(0, t_i),
$$
où $\text{EE}(t) = \mathbb{E}[\max(V_t, 0)]$ est l'**exposition attendue** ([[fiche:taux-cva-simple]]).
:::

:::preuve Idée
La perte est $(1 - R)\max(V_\tau, 0)\,\mathbf{1}_{\tau \le T}$ actualisée. En découpant $[0, T]$ en intervalles et en supposant l'exposition **indépendante** du défaut (pas de « wrong-way risk »), l'espérance de chaque morceau est le produit de l'exposition attendue et de la probabilité de défaut sur l'intervalle.
:::

:::exercice ex-tc-cva
reponse: 0.6*(1000*(1-exp(-0.02))+2000*(exp(-0.02)-exp(-0.04)))
tolerance: 0.01
Exposition attendue : 1 M€ à la fin de la première année, 2 M€ à la fin de la deuxième. Intensité de défaut 2 %, recouvrement 40 %, actualisation ignorée. CVA en milliers d'euros ?
---
$0{,}6 \times \big(1\,000 \times (1 - e^{-0{,}02}) + 2\,000 \times (e^{-0{,}02} - e^{-0{,}04})\big) = 0{,}6 \times (19{,}8 + 38{,}8) \approx 35{,}2$ k€.
:::

:::propriete La famille XVA ([[fiche:taux-xva]])
- **CVA** : risque de défaut de la contrepartie. **DVA** : symétrique, notre propre défaut (un gain comptable controversé).
- **FVA** : coût de financement des positions non collatéralisées.
- **MVA** : coût de financement de la marge initiale. **KVA** : coût du capital réglementaire immobilisé.
Le **wrong-way risk** (l'exposition augmente quand la contrepartie se dégrade, par exemple un swap de change avec une banque d'un pays en crise) rend la formule produit ci-dessus trop optimiste.
:::

:::exemple Ce que regarde la validation de modèles ([[fiche:taux-validation-modele]])
Hypothèses et domaine de validité, implémentation indépendante (« contre-modèle »), tests de convergence numérique, stabilité de la calibration, comportement dans les cas limites (comme les contrôles du chapitre [[n:black-scholes]]), tests de couverture sur l'historique (le PnL de couverture est-il expliqué ?), et suivi en production. C'est un débouché fréquent pour un premier poste quantitatif en banque.
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Mélanger les conventions de composition (annuelle, continue, simple) dans un même calcul.
- Confondre duration de Macaulay (en années) et duration modifiée (sensibilité).
- Couvrir avec la DV01 et croire être couvert contre tous les mouvements de courbe (seulement les déplacements parallèles).
- Oublier que la jambe variable d'un swap, augmentée du nominal à l'échéance (une obligation à taux variable), vaut le pair à chaque date de fixing (dans le cadre mono-courbe) ; sans le nominal, elle vaut $N\big(1 - P(t, T_n)\big)$.
- Écrire la survie $1 - \lambda t$ au lieu de $e^{-\lambda t}$ sur de longues durées.
- Ignorer le wrong-way risk dans une discussion de CVA.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Taux à 1 an 3 %, à 2 ans 4 % : quel forward 1 an dans 1 an ? Démontre-le. »** L'argument d'arbitrage, puis la règle de la moyenne.
- **« Qu'est-ce que la duration ? La convexité ? Pourquoi la convexité a-t-elle de la valeur ? »** Définitions, approximation de Taylor, analogie avec le gamma.
- **« Comment valorise-t-on un swap de taux ? Quel est le taux de swap au pair ? »** Télescopage, annuité.
- **« Un CDS cote 120 pb, recouvrement 40 % : intensité de défaut ? »** $2\,\%$, et la démonstration en deux intégrales.
- **« Qu'est-ce que la CVA ? Qu'est-ce que le wrong-way risk ? »** Formule, hypothèse d'indépendance, exemples.
- **« Que regarderais-tu pour valider un modèle de pricing ? »** La liste ci-dessus, avec un exemple tiré de tes projets (tests de convergence, cas limites).
:::
