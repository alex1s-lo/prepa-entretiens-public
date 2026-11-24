---
titre: Énergie et matières premières
partie: Pricing
resume: Ce qui rend l'électricité et le gaz différents des actions (stockage, saisonnalité, retour à la moyenne, prix négatifs, livraison sur une période), la cohérence de la courbe forward, le modèle de Schwartz et l'effet Samuelson démontrés, les centrales vues comme des options sur spread (Margrabe, Kirk), le stockage et les options swing, et la couverture d'un producteur avec le risque de volume. C'est le chapitre qui relie une expérience dans l'énergie à la finance de marché.
duree: 2 h 30
fiches: nrj-specificites-electricite nrj-prix-negatifs nrj-spark-spread nrj-clean-spark nrj-centrale-option nrj-schwartz nrj-couverture-producteur nrj-parler-stage der-forward-futures der-asiatique der-margrabe nrj-samuelson nrj-calendaire
---
Les marchés de l'énergie sont un débouché important pour un profil quantitatif (desks de trading des énergéticiens, banques, négociants, gestion d'actifs de production), et si tu as une expérience de terrain dans l'énergie, c'est un avantage : on te demandera ce qu'elle t'a appris, et pouvoir la relier aux outils de pricing de ce cours fait une vraie différence ([[fiche:nrj-parler-stage]]). Ce chapitre réutilise les outils des chapitres [[n:equations-differentielles-stochastiques]] (Ornstein-Uhlenbeck), [[n:arbitrage-et-risque-neutre]] (forwards) et [[n:options-exotiques]] (Margrabe, asiatiques).

## Ce qui rend l'électricité différente

:::propriete Les spécificités ([[fiche:nrj-specificites-electricite]])
1. **Non stockable** (ou très cher à stocker) : l'offre doit égaler la demande à chaque instant. D'où des **pics** de prix extrêmes quand le système est tendu, et une volatilité du spot de plusieurs centaines de pourcents.
2. **Saisonnalités** emboîtées : heure de la journée, jour de la semaine, saison.
3. **Retour à la moyenne** rapide après un choc (panne, vague de froid), avec des sauts.
4. **Livraison sur une période** : on n'achète pas « de l'électricité en mars », mais 1 MW pendant toutes les heures de mars (produit **base**) ou seulement les heures ouvrées de journée (**pointe**).
5. **Prix négatifs** possibles quand la production non pilotable dépasse la demande et que s'arrêter coûte plus cher que payer pour produire ([[fiche:nrj-prix-negatifs]]).
6. Un prix formé par l'**ordre de mérite** : les centrales sont appelées par coût marginal croissant, et le prix est fixé par la dernière centrale appelée. C'est souvent une centrale au gaz, d'où le lien étroit entre prix de l'électricité, prix du gaz et prix du CO₂.
:::

:::intuition Pourquoi le stockage change tout
Pour un actif stockable, le forward est lié au spot par **cash-and-carry** (chapitre [[n:arbitrage-et-risque-neutre]]) : $F = S_0e^{(r + u - y)T}$, avec un coût de stockage $u$ et un rendement d'opportunité $y$ (l'avantage d'avoir le bien physiquement). Pour l'électricité, cet argument tombe : le forward de décembre n'est relié au spot d'aujourd'hui par aucun arbitrage. Il reflète l'**anticipation** du spot de décembre (plus une prime de risque), et chaque échéance de la courbe vit sa propre vie. Le gaz, stockable mais avec des capacités limitées, est entre les deux.
:::

## La courbe forward

:::theoreme Cohérence entre produits de livraison
Sans frottement, le prix d'un produit livrant sur une période est la **moyenne pondérée par les heures** des prix des sous-périodes qui la composent :
$$
F_{\text{année}} = \frac{\sum_{q}h_qF_q}{\sum_qh_q}, \qquad F_{\text{base}} = \frac{h_{\text{pointe}}F_{\text{pointe}} + h_{\text{creuse}}F_{\text{creuse}}}{h_{\text{pointe}} + h_{\text{creuse}}}.
$$
:::

:::preuve
Acheter le produit annuel, c'est recevoir 1 MW pendant les $\sum_qh_q$ heures de l'année au prix $F_{\text{année}}$. Acheter les quatre trimestres donne exactement les mêmes livraisons, pour un coût total $\sum_qh_qF_q$. Les flux physiques sont identiques ; si les coûts différaient, on achèterait le moins cher et on vendrait l'autre (loi du prix unique). Les flux étant payés au fil de la livraison, l'actualisation introduit en toute rigueur de petites corrections, négligeables à cette échelle.
:::

:::exercice ex-en-calendaire
reponse: (120*2160+70*2184+80*2208+110*2208)/8760
tolerance: 0.001
Forwards base trimestriels (€/MWh) : T1 120 (2 160 heures), T2 70 (2 184 h), T3 80 (2 208 h), T4 110 (2 208 h). Quel prix annuel base est cohérent ?
---
$\frac{120 \times 2\,160 + 70 \times 2\,184 + 80 \times 2\,208 + 110 \times 2\,208}{8\,760} = \frac{831\,600}{8\,760} \approx 94{,}93$ €/MWh, un peu en dessous de la moyenne simple (95) : T1, le plus cher, est aussi le plus court.
:::

:::attention Forwards, futures et marchés spot
Le spot électrique s'échange surtout la veille pour le lendemain (enchère **day-ahead**, heure par heure, ou par quart d'heure), puis en **intraday** jusqu'à quelques minutes avant la livraison. Les produits à terme (mois, trimestres, années, base et pointe) se traitent en futures sur des bourses comme l'EEX, ou de gré à gré. Les futures à appels de marge quotidiens et les forwards diffèrent par l'effet de convexité vu au chapitre [[n:arbitrage-et-risque-neutre]] ([[fiche:der-forward-futures]]), et surtout par le partage des risques : un forward de gré à gré porte un **risque de contrepartie**, un future compensé un **risque de liquidité** (appels de marge quotidiens). En 2022, l'envolée des prix a provoqué des appels de marge massifs sur les futures, et une partie des acteurs s'est reportée vers le gré à gré, au prix d'un risque de contrepartie accru.
:::

## Le modèle de Schwartz et l'effet Samuelson

:::definition Modèle de Schwartz à un facteur ([[fiche:nrj-schwartz]])
Le logarithme du spot suit un processus d'Ornstein-Uhlenbeck (sous la probabilité risque-neutre) : $dX_t = \kappa(\mu - X_t)\,dt + \sigma\,dW_t$, $S_t = e^{X_t}$. Pour l'électricité, on ajoute une saisonnalité déterministe : $S_t = e^{f(t) + X_t}$.
:::

:::theoreme Prix forward et sa dynamique
Avec $\tau = T - t$ :
$$
\ln F(t, T) = \mu + (X_t - \mu)e^{-\kappa\tau} + \frac{\sigma^2}{4\kappa}\big(1 - e^{-2\kappa\tau}\big), \qquad \frac{dF(t, T)}{F(t, T)} = \sigma e^{-\kappa(T - t)}\,dW_t.
$$
La volatilité instantanée d'un forward vaut $\sigma e^{-\kappa(T - t)}$ : elle est faible pour les échéances lointaines et **augmente à l'approche de la livraison**. C'est l'**effet Samuelson**.
:::

:::preuve
**Prix** : $F(t, T) = \mathbb{E}[S_T \mid \mathcal{F}_t]$ et, sachant $X_t$, $X_T$ est gaussien de moyenne $\mu + (X_t - \mu)e^{-\kappa\tau}$ et de variance $\frac{\sigma^2}{2\kappa}(1 - e^{-2\kappa\tau})$ (chapitre [[n:equations-differentielles-stochastiques]]). On applique $\mathbb{E}[e^G] = e^{m + v/2}$.

**Dynamique** : $F(t, T)$ est une martingale en $t$ (espérance conditionnelle d'une même variable), donc sa dynamique n'a pas de dérive. Son seul terme aléatoire vient de $X_t$ : $\ln F = e^{-\kappa\tau}X_t + (\text{fonction déterministe de } t)$, donc la partie brownienne de $d\ln F$ est $e^{-\kappa\tau}\,\sigma\,dW_t$, et c'est aussi celle de $\frac{dF}{F}$ (Itô ne change que la dérive).
:::

:::intuition Lecture
Un choc sur le spot se résorbe à la vitesse $\kappa$ (demi-vie $\ln 2/\kappa$) : il ne concerne presque pas une livraison dans deux ans. Les forwards lointains bougent peu, les proches bougent beaucoup. Conséquences : la volatilité implicite d'une option sur un forward dépend de l'**échéance de l'option** et de la **date de livraison** du forward, et une couverture d'un risque de court terme par un forward long (ou l'inverse) est mauvaise. Les modèles à deux facteurs (Schwartz-Smith) ajoutent un facteur de long terme quasi brownien, qui explique que les forwards lointains bougent quand même.
:::

:::exercice ex-en-samuelson
reponse: exp(-1.5)
tolerance: 0.0005
Dans un modèle de Schwartz, la vitesse de retour est $\kappa = 3$ par an. Quelle fraction de la volatilité du spot porte aujourd'hui un forward livrant dans six mois ?
---
$e^{-\kappa(T - t)} = e^{-3 \times 0{,}5} = e^{-1{,}5} \approx 22\,\%$. Avec une vol spot de 100 %, ce forward a une vol instantanée d'environ 22 %, qui montera vers 100 % à l'approche de la livraison.
:::

:::exercice ex-en-forward-schwartz
reponse: exp(log(60)+log(50/60)*exp(-1)+0.64*(1-exp(-2))/8)
tolerance: 0.01
Modèle de Schwartz : spot 50, niveau de long terme $e^\mu = 60$, $\kappa = 2$, $\sigma = 80\,\%$. Prix forward pour une livraison dans six mois ?
---
$\kappa\tau = 1$ : $\ln F = \ln 60 + \ln(50/60)\,e^{-1} + \frac{0{,}64}{8}(1 - e^{-2}) \approx 4{,}0943 - 0{,}0671 + 0{,}0692$, soit $F \approx 60{,}1$. L'écart au spot s'est déjà résorbé aux deux tiers, et la convexité ($+\frac12\operatorname{Var}$) remonte un peu le forward.
:::

## Centrales et options sur spread

:::definition Spark spread, clean spark spread ([[fiche:nrj-spark-spread]], [[fiche:nrj-clean-spark]])
Pour une centrale au gaz de **taux de chaleur** $H$ (MWh de gaz par MWh électrique, l'inverse du rendement) et d'intensité carbone $e$ (tonnes de CO₂ par MWh électrique) :
$$
\text{spark spread} = P - H\,G, \qquad \text{clean spark spread} = P - H\,G - e\,C,
$$
avec $P$, $G$ et $C$ les prix de l'électricité, du gaz et du quota de CO₂. Pour le charbon, on parle de *dark spread*.
:::

:::exercice ex-en-clean-spark
reponse: 110-1.9*40-0.37*70
tolerance: 0.001
Électricité 110 €/MWh, gaz 40 €/MWh, taux de chaleur 1,9, émissions 0,37 t/MWh, quota 70 €/t. Clean spark spread ?
---
$110 - 1{,}9 \times 40 - 0{,}37 \times 70 = 110 - 76 - 25{,}9 = 8{,}1$ €/MWh : la centrale couvre ses coûts variables de combustible et de carbone, de peu.
:::

:::theoreme Une centrale est une suite d'options sur spread ([[fiche:nrj-centrale-option]])
Pour chaque heure, l'exploitant choisit de produire (gain $P - HG - c$, avec $c$ les autres coûts variables) ou de s'arrêter (gain nul). Sa marge horaire vaut $\max(P - HG - c, 0)$ : une **option d'échange** de $H$ MWh de gaz contre 1 MWh d'électricité, de strike $c$. Si $c = 0$, c'est exactement l'option de Margrabe (chapitre [[n:options-exotiques]]) :
$$
V = e^{-rT}\big(F_PN(d_1) - HF_GN(d_2)\big), \qquad \sigma^2 = \sigma_P^2 + \sigma_G^2 - 2\rho\sigma_P\sigma_G.
$$
:::

:::preuve
L'option d'échange de Margrabe s'applique avec $S_2 = P$ (l'électricité reçue) et $S_1 = HG$ (le gaz livré, dont la volatilité est celle du gaz, $H$ étant une constante) ; on travaille sur les forwards de la période de livraison, ce qui fait disparaître les rendements d'opportunité ; il ne reste que l'actualisation $e^{-rT}$ du paiement à la livraison (les forwards ne sont pas des actifs payés aujourd'hui). Pour $c > 0$, il n'y a pas de formule fermée ; l'**approximation de Kirk** traite $HG + c$ comme une log-normale de volatilité ajustée $\sigma_G\frac{HF_G}{HF_G + c}$, puis applique Margrabe.
:::

:::intuition Ce que dit la formule
- La valeur d'une centrale **augmente avec la volatilité du spread** : une centrale flexible a de la valeur même si son spread moyen est nul, parce qu'elle ne tourne que quand c'est rentable. C'est la **valeur extrinsèque** de la flexibilité.
- Elle **diminue avec la corrélation** électricité-gaz : si les deux bougent ensemble, le spread bouge peu.
- Les contraintes réelles (temps de démarrage, coûts de démarrage, durées minimales de marche) réduisent cette valeur : on les traite par programmation dynamique ou par simulation avec régression (chapitre [[n:methodes-numeriques]]).
:::

:::exercice ex-en-spread
reponse: 5.0156
tolerance: 0.002
Pour un mois de livraison ($T = 1/12$) : forward électricité 72 €/MWh, coût du gaz $HF_G = 70$ €/MWh, volatilités 60 % et 40 %, corrélation 0,6, autres coûts nuls, taux nul. Valeur de l'option de produire, par MWh ?
---
$\sigma^2 = 0{,}36 + 0{,}16 - 2 \times 0{,}6 \times 0{,}6 \times 0{,}4 = 0{,}232$, $\sigma\sqrt T \approx 0{,}1390$. $d_1 = \frac{\ln(72/70) + \frac12 \times 0{,}232/12}{0{,}1390} \approx 0{,}272$, $d_2 \approx 0{,}133$. $V = 72N(0{,}272) - 70N(0{,}133) \approx 5{,}02$ €/MWh, contre une valeur intrinsèque de 2 : la flexibilité vaut ici plus que la marge moyenne.
:::

## Stockage, options swing et options sur moyenne

:::propriete Les options de flexibilité
- **Stockage de gaz** : acheter l'été, vendre l'hiver. La **valeur intrinsèque** est l'écart entre les forwards d'hiver et d'été, moins les coûts d'injection et de soutirage ; la **valeur extrinsèque** vient de la possibilité de réoptimiser au fil des prix (on vend quand l'hiver est cher, on rachète quand il baisse). Valorisation par programmation dynamique sur la quantité stockée.
- **Option swing** : droit d'acheter, chaque jour, une quantité entre un minimum et un maximum, avec des volumes totaux bornés. C'est une suite d'options américaines couplées par la contrainte de volume ; on la valorise par programmation dynamique ou par Monte-Carlo avec régression (Longstaff-Schwartz).
- **Options sur moyenne** : un contrat mensuel se règle souvent sur la **moyenne** des prix journaliers du mois. L'option correspondante est une asiatique, moins volatile qu'une option sur un prix ponctuel ([[fiche:der-asiatique]]).
:::

## Couvrir un producteur et le risque de volume

:::methode Couvrir une production ([[fiche:nrj-couverture-producteur]])
1. Vendre à terme une partie de la production attendue (prix bloqué, mais on renonce à la hausse).
2. Ou acheter des puts sur les futures (plancher en gardant la hausse, contre une prime).
3. Ou signer des contrats de long terme avec des clients (PPA).
Le **risque de volume** reste : si l'on a vendu plus que ce qu'on produit (panne, vent faible), il faut racheter au prix du moment, souvent quand il est haut. C'est la raison pour laquelle on ne couvre jamais 100 % d'une production incertaine.
:::

:::theoreme Prix capturé et covariance volume-prix
Le revenu moyen par heure d'un producteur de production $V$ et de prix $P$ vaut
$$
\mathbb{E}[VP] = \mathbb{E}[V]\,\mathbb{E}[P] + \operatorname{Cov}(V, P),
$$
et son **prix capturé** (revenu moyen par MWh produit) vaut $\mathbb{E}[P] + \dfrac{\operatorname{Cov}(V, P)}{\mathbb{E}[V]}$.
:::

:::preuve
C'est la définition de la covariance (chapitre [[n:esperance-variance-covariance]]) : $\operatorname{Cov}(V, P) = \mathbb{E}[VP] - \mathbb{E}[V]\mathbb{E}[P]$. On divise par $\mathbb{E}[V]$ pour obtenir le revenu par MWh.

**Lecture** : un parc éolien ou solaire produit surtout quand tous les parcs semblables produisent, donc quand les prix sont bas : $\operatorname{Cov}(V, P) < 0$, et son prix capturé est inférieur au prix moyen (effet de **cannibalisation**). C'est exactement le même calcul qu'un ajustement quanto (chapitre [[n:options-exotiques]]) : une corrélation entre la quantité et le prix modifie la valeur.
:::

:::exercice ex-en-capture
reponse: 56
tolerance: 0.001
Un parc éolien produit en moyenne 30 MW (écart-type 15 MW). Le prix horaire vaut en moyenne 60 €/MWh (écart-type 20 €/MWh). La corrélation entre production et prix est de $-0{,}4$. Quel est son prix capturé ?
---
$\operatorname{Cov}(V, P) = -0{,}4 \times 15 \times 20 = -120$. Prix capturé : $60 + \frac{-120}{30} = 56$ €/MWh, soit 4 € de moins que le prix moyen, uniquement à cause de la corrélation.
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Appliquer le cash-and-carry à l'électricité.
- Oublier qu'un produit électrique livre sur une période (et qu'un annuel est une moyenne pondérée par les heures).
- Utiliser la même volatilité pour toutes les échéances de la courbe (effet Samuelson).
- Valoriser une centrale à sa seule marge moyenne, en oubliant la valeur de la flexibilité.
- Couvrir 100 % d'une production incertaine.
- Ignorer la corrélation volume-prix dans un revenu attendu.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Qu'est-ce qui rend l'électricité spéciale ? »** Non stockable, saisonnalités, retour à la moyenne, livraison sur une période, prix négatifs, ordre de mérite.
- **« Pourquoi une centrale est-elle une option ? Comment la valorises-tu ? »** Spread option, Margrabe, Kirk, contraintes techniques par programmation dynamique.
- **« Que devient la volatilité d'un forward à l'approche de la livraison ? »** Effet Samuelson, démontré dans le modèle de Schwartz.
- **« Comment un producteur se couvre-t-il ? Quels risques restent ? »** Forwards, puts, PPA ; risque de volume, de profil, de contrepartie.
- **« Que retiens-tu de ton stage pour un poste en finance de marché ? »** Des exemples concrets, et un lien avec un outil de ce chapitre si c'est vrai pour toi.
:::
