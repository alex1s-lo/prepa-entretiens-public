---
titre: Options exotiques et produits structurés
partie: Pricing
resume: Les produits qui reviennent en entretien de structuration et de pricing : digitales et effet du skew, barrières (parité, réplication statique de Carr par la symétrie call-put, surveillance discrète), asiatiques, options à départ différé et cliquets, option d'échange de Margrabe par changement de numéraire, quantos, puis la décomposition des produits structurés (capital garanti, reverse convertible, autocall, worst-of) et leurs risques pour la banque.
duree: 3 h
fiches: der-digitale-prix der-digitale-replication der-proba-exercice der-barriere-parite struct-greques-barriere der-asiatique der-forward-start struct-cliquet der-margrabe der-quanto struct-capital-garanti struct-reverse-convertible struct-autocall struct-worst-of struct-dispersion struct-couverture-dividendes der-barriere-carr der-asiatique-geometrique der-digitale-skew
---
Une option **exotique** est tout ce qui n'est pas un call ou un put vanille (européen ou américain) : son flux dépend du chemin (barrière, moyenne, maximum), de plusieurs sous-jacents (échange, panier, worst-of), ou d'une date future (départ différé). Les desks de structuration actions et les équipes de pricing en banque passent leur temps sur ces produits, et les entretiens y piochent des questions courtes : « décompose ce produit », « comment varie-t-il avec la corrélation ? », « où est le risque pour la banque ? ». Les outils sont ceux des chapitres [[n:arbitrage-et-risque-neutre]] à [[n:volatilite]] : réplication, changement de numéraire, réflexion, et grecques.

Sauf mention contraire : Black-Scholes, taux nul, pas de dividende, ce qui allège les formules sans rien changer aux idées.

## Digitales et skew

:::propriete Digitale cash (rappel)
Une digitale qui paie 1 si $S_T > K$ vaut $e^{-rT}N(d_2)$ dans Black-Scholes ([[fiche:der-digitale-prix]]). Elle se **réplique** par un call spread serré : $\frac1h\big(C(K) - C(K + h)\big) \to -\partial_KC$ (chapitre [[n:arbitrage-et-risque-neutre]]).
:::

:::theoreme Prix d'une digitale avec un smile
Si les calls cotent avec une volatilité implicite $\sigma(K)$ qui dépend du strike, la digitale vaut
$$
D(K) = -\frac{d}{dK}C_{\text{BS}}\big(K, \sigma(K)\big) = e^{-rT}N(d_2) - \mathcal{V}\,\frac{\partial\sigma}{\partial K},
$$
où $N(d_2)$ et la vega $\mathcal{V}$ sont calculés avec la vol du strike $\sigma(K)$.
:::

:::preuve
Le prix de marché du call est $C(K) = C_{\text{BS}}(K, \sigma(K))$. La digitale est la limite du call spread, donc $-\frac{dC}{dK}$. Par la dérivation en chaîne : $\frac{dC}{dK} = \frac{\partial C_{\text{BS}}}{\partial K} + \frac{\partial C_{\text{BS}}}{\partial\sigma}\,\sigma'(K)$. Le premier terme vaut $-e^{-rT}N(d_2)$ (Breeden-Litzenberger dans Black-Scholes), le second $\mathcal{V}\sigma'(K)$.
:::

:::intuition Lecture
Avec un **skew négatif** ($\sigma'(K) < 0$, cas des actions), le terme correctif est **positif** : une digitale call vaut plus que ce que dit Black-Scholes à la vol du strike, et une digitale put moins. Ignorer le skew sur une digitale est une erreur de pricing de premier ordre, pas un raffinement : l'effet est du même ordre que le prix lui-même. Et près de l'échéance, le delta d'une digitale explose : on la couvre comme un call spread un peu décalé dans le sens prudent ([[fiche:der-digitale-replication]]).
:::

:::exercice ex-ex-digitale-skew
reponse: N(-0.1)+100*phi(0.1)*0.002
tolerance: 0.002
$S_0 = K = 100$, $T = 1$, $r = 0$, vol implicite à la monnaie 20 %, et un skew de $-0{,}2$ point de vol par point de strike ($\sigma'(K) = -0{,}002$). Prix de la digitale qui paie 1 si $S_T > 100$ ?
---
Black-Scholes à 20 % : $N(d_2) = N(-0{,}1) \approx 0{,}4602$. Vega : $100\,\varphi(0{,}1) \approx 39{,}70$. Correction : $-39{,}70 \times (-0{,}002) \approx +0{,}0794$. Prix $\approx 0{,}540$, soit 17 % de plus que la formule sans skew.
:::

## Options à barrière

:::definition Barrières
Une option **knock-out** disparaît si le sous-jacent touche la barrière $B$ avant l'échéance ; une **knock-in** n'existe que si la barrière a été touchée. On précise le sens (up ou down) et le type (call ou put) : un *down-and-in call* est un call qui ne s'active que si $S$ passe sous $B$.
:::

:::theoreme Parité in-out ([[fiche:der-barriere-parite]])
Pour un même strike, une même barrière et une même échéance : knock-in + knock-out = vanille.
:::

:::preuve
Sur chaque trajectoire, exactement l'une des deux est active à l'échéance (la barrière a été touchée ou non) et elle paie alors le flux de la vanille. Les deux portefeuilles ont le même flux sur toutes les trajectoires : même prix.
:::

:::theoreme Symétrie call-put (taux nul)
Dans Black-Scholes avec $r = q = 0$, pour tout $S$ et tout $K$ :
$$
C(S, K) = \frac KS\,P\Big(S, \frac{S^2}{K}\Big).
$$
:::

:::preuve
Notons $K' = S^2/K$. Pour le put de strike $K'$ : $d_1' = \frac{\ln(S/K') + \frac12\sigma^2T}{\sigma\sqrt T} = \frac{\ln(K/S) + \frac12\sigma^2T}{\sigma\sqrt T} = -d_2$ et $d_2' = d_1' - \sigma\sqrt T = -d_1$, où $d_1, d_2$ sont ceux du call de strike $K$. Donc
$$
P(S, K') = K'N(-d_2') - SN(-d_1') = \frac{S^2}{K}N(d_1) - SN(d_2) = \frac SK\big(SN(d_1) - KN(d_2)\big) = \frac SK\,C(S, K).
$$
:::

:::theoreme Réplication statique d'un down-and-in call (Carr)
Avec $r = q = 0$ et une barrière $B \le K$, $B < S_0$ :
$$
C_{\text{DI}}(S_0) = \frac KB\,P\Big(S_0, \frac{B^2}{K}\Big) = \frac{S_0}{B}\,C\Big(\frac{B^2}{S_0}, K\Big).
$$
On réplique l'option en achetant $\frac KB$ puts de strike $\frac{B^2}{K}$ ; si la barrière est touchée, on les échange sans frais contre un call de strike $K$.
:::

:::preuve
**Si la barrière n'est jamais touchée**, $S_T > B \ge \frac{B^2}{K}$ (car $B \le K$) : les puts finissent sans valeur, comme la knock-in qui ne s'est jamais activée.

**Si elle est touchée** à l'instant $\tau$, alors $S_\tau = B$ (trajectoires continues). Par la symétrie call-put appliquée en $S = B$ et pour la durée restante : $C(B, K) = \frac KB\,P\big(B, \frac{B^2}{K}\big)$. Les $\frac KB$ puts valent donc exactement un call de strike $K$ : on les vend et on achète le call, ce qui reproduit la knock-in désormais active.

Le portefeuille de puts réplique la knock-in dans tous les cas : par la loi du prix unique, ils ont le même prix. La seconde écriture découle de la symétrie (homogénéité de degré 1 du prix en $(S, K)$).
:::

:::intuition Le facteur $S_0/B$ et la méthode des images
La formule $\frac{S_0}{B}C\big(\frac{B^2}{S_0}, K\big)$ est une « image » : on place une source fictive au point $\frac{B^2}{S_0}$, symétrique de $S_0$ par rapport à $B$ en échelle logarithmique. C'est le principe de réflexion du chapitre [[n:mouvement-brownien]], corrigé du facteur $\frac{S_0}{B}$ qui compense la dérive de $\ln S$. Avec des taux non nuls, le facteur devient une puissance de $\frac{S_0}{B}$ ; les idées restent les mêmes.
:::

:::exercice ex-ex-barriere
reponse: 100*(N(0.1)-N(-0.1))-100/90*(81*N(-(log(100/81)-0.02)/0.2)-100*N(-(log(100/81)+0.02)/0.2))
tolerance: 0.01
$S_0 = K = 100$, barrière $B = 90$ (surveillance continue), $\sigma = 20\,\%$, $T = 1$, $r = 0$. Prix du **down-and-out** call ?
---
Knock-in : $\frac{100}{90}P(100, 81)$. Avec $d_1 = \frac{\ln(100/81) + 0{,}02}{0{,}2} \approx 1{,}154$ et $d_2 \approx 0{,}954$ : $P(100, 81) = 81N(-0{,}954) - 100N(-1{,}154) \approx 1{,}348$, d'où $C_{\text{DI}} \approx 1{,}498$. Vanille : $7{,}966$. Knock-out : $7{,}966 - 1{,}498 \approx 6{,}47$.
:::

:::widget barriere
:::

:::attention Ce qui complique les barrières en pratique
- **Surveillance discrète** : si la barrière n'est vérifiée qu'aux clôtures, elle est touchée moins souvent ; on l'approche par une barrière continue décalée, $Be^{-0{,}5826\,\sigma\sqrt{\Delta t}}$ pour une barrière basse (correction de Broadie-Glasserman-Kou).
- **Grecques près de la barrière** : près de l'échéance et de la barrière, le prix d'une knock-out peut passer d'une valeur positive à zéro en un tick : delta et gamma explosent et changent de signe ([[fiche:struct-greques-barriere]]). Le desk « décale » la barrière dans sa valorisation pour se constituer une réserve.
- **Smile** : la réplication statique de Carr exige un smile symétrique au sens de la symétrie call-put ; avec un skew, les puts de strike $B^2/K$ n'ont plus le bon prix, et les modèles (vol locale contre vol stochastique) donnent des prix différents.
:::

## Options sur moyenne : les asiatiques

:::theoreme Moyenne géométrique continue
Avec $r = 0$, la moyenne géométrique $G = \exp\big(\frac1T\int_0^T\ln S_t\,dt\big)$ est log-normale :
$$
\ln G \sim \mathcal{N}\Big(\ln S_0 - \frac{\sigma^2T}{4},\ \frac{\sigma^2T}{3}\Big), \qquad \mathbb{E}[G] = S_0e^{-\sigma^2T/12}.
$$
Un call sur $G$ se price donc par la formule de Black avec le forward $S_0e^{-\sigma^2T/12}$ et la volatilité $\sigma/\sqrt3$.
:::

:::preuve
$\ln S_t = \ln S_0 - \frac12\sigma^2t + \sigma W_t$, donc $\frac1T\int_0^T\ln S_t\,dt = \ln S_0 - \frac{\sigma^2}{2T}\cdot\frac{T^2}{2} + \frac\sigma T\int_0^TW_t\,dt$. L'intégrale $\int_0^TW_t\,dt$ est gaussienne, centrée, de variance $\frac{T^3}{3}$ (chapitre [[n:mouvement-brownien]] : $\int_0^T\!\int_0^T\min(s, t)\,ds\,dt = \frac{T^3}{3}$). Donc la variance de $\ln G$ vaut $\frac{\sigma^2}{T^2}\cdot\frac{T^3}{3} = \frac{\sigma^2T}{3}$. Enfin $\mathbb{E}[G] = \exp\big(m + \frac v2\big) = S_0\exp\big(-\frac{\sigma^2T}{4} + \frac{\sigma^2T}{6}\big) = S_0e^{-\sigma^2T/12}$.
:::

:::propriete Asiatique arithmétique ([[fiche:der-asiatique]])
La moyenne arithmétique est toujours supérieure à la géométrique (inégalité arithmético-géométrique) mais n'est pas log-normale : pas de formule fermée. On price par Monte-Carlo avec l'asiatique **géométrique comme variable de contrôle** (corrélation supérieure à 0,99, chapitre [[n:methodes-numeriques]]), ou par des approximations (appariement des moments). Une asiatique est **moins chère** qu'une vanille à la monnaie (vol effective $\approx \sigma/\sqrt3$) et beaucoup plus facile à couvrir près de l'échéance, car la moyenne bouge de moins en moins. On l'utilise sur les matières premières, où l'on achète et vend en continu.
:::

:::exercice ex-ex-asiatique
reponse: 6.5083
tolerance: 0.002
$S_0 = K = 100$, $\sigma = 30\,\%$, $T = 1$, $r = 0$. Prix du call sur la moyenne géométrique continue ? Compare à la vanille (11,92).
---
Forward $F = 100e^{-0{,}09/12} \approx 99{,}253$, vol $\sigma_G = 0{,}3/\sqrt3 \approx 0{,}1732$. $d_1 = \frac{\ln(F/K) + \sigma_G^2/2}{\sigma_G} = \frac{-0{,}0075 + 0{,}015}{0{,}1732} \approx 0{,}0433$, $d_2 \approx -0{,}1299$. $C = FN(d_1) - KN(d_2) \approx 6{,}51$ : un peu plus de la moitié de la vanille.
:::

## Départ différé et cliquets

:::theoreme Option à départ différé
Une option qui, à la date $t_1$, devient un call à la monnaie (strike $S_{t_1}$) d'échéance $T$ vaut aujourd'hui, avec $r = 0$,
$$
S_0\,c(\sigma, T - t_1), \qquad c(\sigma, \tau) = N\big(\tfrac12\sigma\sqrt\tau\big) - N\big(-\tfrac12\sigma\sqrt\tau\big),
$$
le prix d'un call à la monnaie sur un sous-jacent valant 1 ([[fiche:der-forward-start]]).
:::

:::preuve
En $t_1$, par homogénéité de Black-Scholes ($C(\lambda S, \lambda K) = \lambda C(S, K)$), le call de strike $S_{t_1}$ vaut $S_{t_1}\,c(\sigma, T - t_1)$. Ce nombre est une quantité fixe d'actions : sa valeur aujourd'hui est $c \times$ (valeur d'une action livrée en $t_1$) $= c\,S_0$.
:::

:::intuition Pourquoi les desks s'en méfient
Dans Black-Scholes, le prix ne dépend que de la vol entre $t_1$ et $T$. En réalité, il dépend du **smile qu'on observera en $t_1$** (le smile forward), que personne ne voit aujourd'hui : la vol locale et la vol stochastique, calibrées sur les mêmes vanilles, donnent des prix différents. Un **cliquet** est une somme d'options à départ différé, souvent avec des plafonds et planchers locaux : c'est un pari sur le smile forward et sur la vol de la vol ([[fiche:struct-cliquet]]).
:::

:::exercice ex-ex-forward-start
reponse: 100*(N(0.1*sqrt(0.5))-N(-0.1*sqrt(0.5)))
tolerance: 0.002
$S_0 = 100$, $\sigma = 20\,\%$, $r = 0$. Dans six mois, tu reçois un call à la monnaie d'échéance un an (à compter d'aujourd'hui). Combien vaut-il aujourd'hui ?
---
Durée restante en $t_1$ : six mois. $c = N(0{,}1\sqrt{0{,}5}) - N(-0{,}1\sqrt{0{,}5}) = N(0{,}0707) - N(-0{,}0707) \approx 0{,}0564$. Prix $\approx 5{,}64$, contre $7{,}97$ pour un call à la monnaie d'un an qui démarre aujourd'hui.
:::

## Plusieurs sous-jacents

:::theoreme Option d'échange (Margrabe)
Le droit d'échanger l'actif 1 contre l'actif 2 à l'échéance, de flux $(S_2(T) - S_1(T))^+$, vaut, quels que soient les taux,
$$
S_2(0)N(d_1) - S_1(0)N(d_2), \qquad d_{1,2} = \frac{\ln\big(S_2(0)/S_1(0)\big) \pm \frac12\sigma^2T}{\sigma\sqrt T}, \qquad \sigma^2 = \sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2.
$$
:::

:::preuve Par changement de numéraire
Prenons l'actif 1 comme unité de compte (chapitre [[n:arbitrage-et-risque-neutre]]) : le prix vaut $S_1(0)\,\mathbb{E}^{\mathbb{Q}^1}\big[(Y_T - 1)^+\big]$ avec $Y = S_2/S_1$, qui est une **martingale** sous $\mathbb{Q}^1$ (un prix exprimé dans le numéraire). Par Itô sur un quotient, la partie brownienne de $dY/Y$ est $\sigma_2\,dW^2 - \sigma_1\,dW^1$, de variance $(\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2)\,dt$ : $Y$ est log-normale de volatilité $\sigma$ et sans dérive. L'espérance est donc un call de Black sur $Y$, de strike 1 et sans taux : $Y_0N(d_1) - N(d_2)$. On multiplie par $S_1(0)$. Le taux a disparu : il est le même pour les deux actifs.
:::

:::exercice ex-ex-margrabe
reponse: 100*(N(sqrt(0.058)/2)-N(-sqrt(0.058)/2))
tolerance: 0.002
Deux actions valent 100, de volatilités 30 % et 20 %, corrélées à 0,6. Prix de l'option d'échanger la première contre la seconde dans un an ?
---
$\sigma^2 = 0{,}09 + 0{,}04 - 2 \times 0{,}6 \times 0{,}3 \times 0{,}2 = 0{,}058$, $\sigma \approx 24{,}1\,\%$. À la monnaie : $100\big(N(0{,}1204) - N(-0{,}1204)\big) \approx 9{,}58$. Plus la corrélation est forte, moins l'échange vaut ([[fiche:der-margrabe]]). C'est aussi le prix d'un spread option de strike nul, utile en énergie (chapitre [[n:energie-et-matieres-premieres]]).
:::

:::propriete Quanto ([[fiche:der-quanto]])
Une option sur un actif étranger payée en devise domestique à un **taux de change fixé d'avance** se price en donnant au sous-jacent, sous la probabilité risque-neutre domestique, la dérive
$$
r_f - q - \rho\,\sigma_S\,\sigma_X,
$$
où $\sigma_X$ est la vol du change (domestique par unité étrangère) et $\rho$ sa corrélation avec l'actif.
:::

:::preuve Esquisse
L'actif étranger converti en devise domestique, $S\,X$, est un actif domestique : sous $\mathbb{Q}^d$, sa dérive est $r_d - q$. Par Itô sur un produit, $\frac{d(SX)}{SX} = \frac{dS}{S} + \frac{dX}{X} + \rho\sigma_S\sigma_X\,dt$. Le change a, sous $\mathbb{Q}^d$, la dérive $r_d - r_f$ (parité des taux couverte). Donc la dérive de $S$ vaut $(r_d - q) - (r_d - r_f) - \rho\sigma_S\sigma_X = r_f - q - \rho\sigma_S\sigma_X$. C'est un effet de **convexité croisée**, du même type que le paradoxe de Siegel (chapitre [[n:integrale-et-lemme-ito]]).
:::

:::exercice ex-ex-quanto
reponse: 100*exp(0.02+0.3*0.2*0.1)
tolerance: 0.15
Un indice étranger vaut 100, taux étranger 2 %, pas de dividende, vol 20 %. Le change (domestique par unité étrangère) a une vol de 10 % et une corrélation de $-0{,}3$ avec l'indice. Quel est le forward **quanto** à un an (payé en devise domestique, un point d'indice = une unité domestique) ?
---
Dérive quanto : $0{,}02 - (-0{,}3)(0{,}2)(0{,}1) = 0{,}026$, donc $F = 100e^{0{,}026} \approx 102{,}63$, contre $102{,}02$ sans ajustement. Avec une corrélation négative, un investisseur domestique qui détient l'indice perd sur le change quand l'indice monte ; le contrat quanto neutralise cet effet, d'où une dérive (et un forward) plus élevée.
:::

## Produits structurés

:::methode Décomposer un produit structuré
1. Écrire le flux à l'échéance (et aux dates intermédiaires) en fonction du ou des sous-jacents.
2. Le découper en briques : zéro-coupon, forward, calls et puts vanille, digitales, barrières.
3. Pricer chaque brique ; la marge de la banque est l'écart entre le prix de vente (le nominal) et la somme des briques.
4. Lire les **risques** : quelles briques la banque est-elle **courte** ? Elle est exposée à ce que l'investisseur a acheté.
:::

:::exemple Capital garanti ([[fiche:struct-capital-garanti]])
Zéro-coupon qui rembourse le nominal + calls sur l'indice. Avec un zéro-coupon à 90 et des calls à 20 % du nominal, il reste 10 pour les calls : participation de 50 % à la hausse. Les taux élevés et les maturités longues rendent le zéro-coupon moins cher et la participation plus forte ; on l'augmente aussi en plafonnant la hausse (call spread) ou en moyennant (asiatique).
:::

:::exemple Reverse convertible ([[fiche:struct-reverse-convertible]])
Obligation à fort coupon dont le remboursement devient des actions si l'action a baissé : **obligation + vente d'un put** par l'investisseur. Le coupon élevé est la prime du put. L'investisseur est vendeur de volatilité : il gagne un peu si rien ne se passe et perd beaucoup en cas de forte baisse.
:::

:::exercice ex-ex-reverse-convertible
reponse: 11.694
tolerance: 0.002
Reverse convertible à un an sur une action à 100 : à l'échéance, l'investisseur reçoit le coupon $c$ (en % du nominal) plus le nominal 100, diminué de $(100 - S_T)^+$. Taux 3 % (continu), vol 25 %. Quel coupon rend le produit équitable (valeur 100 aujourd'hui) ?
---
Valeur $= (100 + c)e^{-0{,}03} - P$ avec $P$ le put Black-Scholes de strike 100 : $d_1 = \frac{0{,}03 + 0{,}03125}{0{,}25} = 0{,}245$, $d_2 = -0{,}005$, $P = 100e^{-0{,}03}N(0{,}005) - 100N(-0{,}245) \approx 8{,}39$. Donc $c = (100 + 8{,}39)e^{0{,}03} - 100 \approx 11{,}69\,\%$ : le taux (3 %) plus la prime du put capitalisée.
:::

:::propriete Autocall et worst-of ([[fiche:struct-autocall]], [[fiche:struct-worst-of]])
- **Autocall** : remboursement anticipé avec coupon si le sous-jacent est au-dessus d'un niveau à une date d'observation ; sinon le produit continue ; à l'échéance, en dessous d'une barrière de protection, l'investisseur subit la baisse. Il a **vendu un put down-and-in** et acheté des digitales (ses coupons conditionnels). La banque est donc longue de ce put et courte des digitales : sensible au skew, aux dividendes ([[fiche:struct-couverture-dividendes]]), avec un gamma qui change de signe près des barrières.
- **Worst-of** : le flux dépend du moins performant de plusieurs actions. Le moins bon est d'autant plus bas que les actions se dispersent : un put worst-of **perd de la valeur quand la corrélation monte**. L'investisseur qui vend ce put (autocall worst-of) est long corrélation ; la banque qui l'achète est courte corrélation, un risque qu'elle ne peut couvrir qu'imparfaitement, avec des produits de dispersion ([[fiche:struct-dispersion]]).
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Pricer une digitale avec la vol du strike sans le terme de skew.
- Oublier que knock-in + knock-out = vanille, ou appliquer la réplication de Carr avec un smile asymétrique.
- Traiter une barrière surveillée chaque jour comme une barrière continue.
- Croire qu'une option à départ différé ne dépend que de la vol d'aujourd'hui.
- Garder le taux d'intérêt dans la formule de Margrabe.
- Oublier le signe de la corrélation dans l'ajustement quanto.
- Dire qu'une banque qui vend des autocalls est « longue volatilité » sans préciser : elle est longue du put down-and-in, donc longue vol à la baisse et courte corrélation sur les worst-of.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Comment couvrir une digitale ? Que change le skew ? »** Call spread, terme $-\mathcal{V}\sigma'(K)$, overhedge.
- **« Knock-in plus knock-out ? Pourquoi une barrière est-elle moins chère ? »** Parité, et une barrière enlève des scénarios.
- **« Price un down-and-in call sans calcul stochastique. »** Réplication statique de Carr par les puts de strike $B^2/K$.
- **« Asiatique plus chère ou moins chère que la vanille ? »** Moins chère, vol $\sigma/\sqrt3$, variable de contrôle géométrique.
- **« Option d'échange de deux actions ? »** Changement de numéraire, $\sigma^2 = \sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2$, pas de taux.
- **« Décompose un reverse convertible, un autocall. Où est le risque pour la banque ? »** La méthode en quatre étapes.
:::
