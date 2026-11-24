---
titre: Les grecques et la couverture
partie: Pricing
resume: Chaque grecque de Black-Scholes démontrée (gamma, vega, theta, rho) grâce à une seule identité, les ordres de grandeur à la monnaie, puis ce qui compte vraiment en salle de marché : le PnL d'une option couverte en delta (gamma contre theta, volatilité réalisée contre implicite), l'erreur de couverture discrète et la neutralisation d'un portefeuille.
duree: 3 h
fiches: der-greeks-signes der-delta-atm der-gamma-atm der-vega-point der-gamma-theta der-pnl-couverture der-couverture-discrete der-greeks-portefeuille mm-short-gamma mm-pnl-trader-options der-strangle-straddle struct-greques-barriere der-straddle-vol-implicite der-grecques-identite
---
Le prix d'une option compte moins que la façon dont il **bouge**. Un trader d'options ne pense pas en euros mais en grecques : combien je gagne si le sous-jacent monte (delta), si la vol monte (vega), si une journée passe (theta), et surtout comment se comporte ma couverture (gamma). Ce chapitre démontre les formules, puis passe à la question qui tombe dans presque tous les entretiens de trading d'options : **d'où vient le PnL d'une option couverte en delta ?**

Notations du chapitre [[n:black-scholes]] : $C = SN(d_1) - Ke^{-rT}N(d_2)$, $d_{1,2} = \frac{\ln(S/K) + (r \pm \frac12\sigma^2)T}{\sigma\sqrt T}$, et l'identité clé
$$
S\varphi(d_1) = Ke^{-rT}\varphi(d_2).
$$

## Les définitions

:::definition Les grecques
Pour un prix $V(t, S, \sigma, r)$ :
- **Delta** $\Delta = \dfrac{\partial V}{\partial S}$ : exposition au sous-jacent, nombre d'actions de la couverture.
- **Gamma** $\Gamma = \dfrac{\partial^2V}{\partial S^2}$ : vitesse à laquelle le delta change, donc la couverture.
- **Vega** $\mathcal{V} = \dfrac{\partial V}{\partial\sigma}$ : exposition à la volatilité implicite.
- **Theta** $\Theta = \dfrac{\partial V}{\partial t}$ : variation due au seul passage du temps (attention : $t$ est la date, donc $\Theta = -\partial V/\partial T$).
- **Rho** $\rho = \dfrac{\partial V}{\partial r}$ : exposition au taux.
:::

:::propriete Signes pour une option achetée ([[fiche:der-greeks-signes]])
| | Delta | Gamma | Vega | Theta | Rho |
|---|---|---|---|---|---|
| Call acheté | $+$ (entre 0 et 1) | $+$ | $+$ | $-$ (en général) | $+$ |
| Put acheté | $-$ (entre $-1$ et 0) | $+$ | $+$ | $-$ (en général) | $-$ |

Toute option **achetée** est longue gamma et longue vega : elle profite des grands mouvements et de la hausse de la vol, et paie le temps qui passe. Exception au theta : un put européen profondément dans la monnaie avec $r > 0$ peut avoir un theta positif (il converge vers $K e^{-r(T-t)} - S$, qui augmente avec le temps).
:::

## Les formules, démontrées

Toutes les preuves suivent le même schéma : dériver $C = SN(d_1) - Ke^{-rT}N(d_2)$ en se rappelant que $d_1$ **et** $d_2$ dépendent du paramètre, puis utiliser l'identité clé pour faire disparaître les termes en $\varphi$.

:::theoreme Les grecques du call
$$
\Delta = N(d_1), \qquad \Gamma = \frac{\varphi(d_1)}{S\sigma\sqrt T}, \qquad \mathcal{V} = S\varphi(d_1)\sqrt T,
$$
$$
\Theta = -\frac{S\varphi(d_1)\sigma}{2\sqrt T} - rKe^{-rT}N(d_2), \qquad \rho = KTe^{-rT}N(d_2).
$$
:::

:::preuve
**Delta** : fait au chapitre [[n:black-scholes]].

**Gamma** : on dérive $\Delta = N(d_1)$ par rapport à $S$ : $\Gamma = \varphi(d_1)\,\dfrac{\partial d_1}{\partial S} = \varphi(d_1)\,\dfrac{1}{S\sigma\sqrt T}$.

**Vega** : par rapport à $\sigma$, les deux termes en $N$ donnent
$$
\frac{\partial C}{\partial\sigma} = S\varphi(d_1)\frac{\partial d_1}{\partial\sigma} - Ke^{-rT}\varphi(d_2)\frac{\partial d_2}{\partial\sigma} = S\varphi(d_1)\left(\frac{\partial d_1}{\partial\sigma} - \frac{\partial d_2}{\partial\sigma}\right),
$$
grâce à l'identité. Or $d_1 - d_2 = \sigma\sqrt T$, donc $\frac{\partial d_1}{\partial\sigma} - \frac{\partial d_2}{\partial\sigma} = \sqrt T$. D'où $\mathcal{V} = S\varphi(d_1)\sqrt T$. On n'a même pas eu besoin de calculer $\partial d_1/\partial\sigma$.

**Theta** : même idée avec $T$. Le facteur $e^{-rT}$ dépend aussi de $T$ :
$$
\frac{\partial C}{\partial T} = S\varphi(d_1)\left(\frac{\partial d_1}{\partial T} - \frac{\partial d_2}{\partial T}\right) + rKe^{-rT}N(d_2) = S\varphi(d_1)\frac{\sigma}{2\sqrt T} + rKe^{-rT}N(d_2),
$$
car $\frac{\partial}{\partial T}(\sigma\sqrt T) = \frac{\sigma}{2\sqrt T}$. Et $\Theta = -\partial C/\partial T$.

**Rho** : $d_1$ et $d_2$ ont la même dérivée en $r$ (leur différence $\sigma\sqrt T$ ne dépend pas de $r$), les termes en $\varphi$ se compensent par l'identité, il reste la dérivée de $-Ke^{-rT}$ : $\rho = KTe^{-rT}N(d_2)$.
:::

:::exemple Vérifier l'EDP avec ces formules
$\Theta + rS\Delta + \frac12\sigma^2S^2\Gamma - rC = -\frac{S\varphi(d_1)\sigma}{2\sqrt T} - rKe^{-rT}N(d_2) + rSN(d_1) + \frac12\sigma^2S^2\frac{\varphi(d_1)}{S\sigma\sqrt T} - rSN(d_1) + rKe^{-rT}N(d_2)$.

Les termes en $N$ s'annulent deux à deux, et $\frac12\sigma^2S^2\frac{\varphi(d_1)}{S\sigma\sqrt T} = \frac{S\sigma\varphi(d_1)}{2\sqrt T}$ compense le premier terme : le total est nul. ✓ C'est un excellent contrôle de mémoire en entretien.
:::

:::propriete Le put et les relations entre grecques
- Par parité ($P = C - S + Ke^{-rT}$) : $\Delta_P = N(d_1) - 1$, et le put a **le même gamma et le même vega** que le call de même strike (la différence $C - P$ est linéaire en $S$ et ne dépend pas de $\sigma$).
- **Vega et gamma** sont liés : $\mathcal{V} = \sigma TS^2\,\Gamma$ (remplacer $\varphi(d_1)$ par $\Gamma S\sigma\sqrt T$ dans la vega). Être long gamma, c'est être long vega, pour une option vanille.
- Avec $r = 0$, l'EDP donne $\Theta = -\frac12\sigma^2S^2\Gamma$ : **le theta est le prix du gamma**.
:::

## Ordres de grandeur à la monnaie

Avec $S = K$, $r = 0$ et $\sigma\sqrt T$ petit, $d_1 \approx 0$ et $\varphi(d_1) \approx \frac{1}{\sqrt{2\pi}} \approx 0{,}4$.

:::propriete À connaître par cœur
- $\Delta \approx 0{,}5$ (un peu plus : $N(\frac12\sigma\sqrt T)$).
- $\Gamma \approx \dfrac{0{,}4}{S\sigma\sqrt T}$ : il **explose** quand $T \to 0$ à la monnaie ([[fiche:der-gamma-atm]]).
- $\mathcal{V} \approx 0{,}4\,S\sqrt T$ par unité de vol, soit $0{,}004\,S\sqrt T$ **par point de vol** ([[fiche:der-vega-point]]). La vega croît comme $\sqrt T$ : les options longues sont des instruments de vol.
- $\Theta \approx -\dfrac{0{,}4\,S\sigma}{2\sqrt T}$ par an. Par jour : diviser par 365 (calendaire) ou 252 (ouvré), selon la convention du desk.
- Prix $\approx 0{,}4\,\sigma S\sqrt T$, donc $\mathcal{V} \approx C/\sigma$ : à la monnaie, le prix est **linéaire** en la vol.
:::

:::exemple $S = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = 0$
$d_1 = 0{,}1$, $\varphi(0{,}1) \approx 0{,}397$.
- $\Gamma = 0{,}397/20 \approx 0{,}0198$ : si $S$ passe de 100 à 101, le delta passe de 0,540 à environ 0,560.
- $\mathcal{V} = 100 \times 0{,}397 \approx 39{,}7$ par unité, soit $0{,}397$ par point : à 21 % de vol, le call vaut $\approx 7{,}97 + 0{,}40 = 8{,}37$.
- $\Theta = -100 \times 0{,}397 \times 0{,}2/2 \approx -3{,}97$ par an, soit $-0{,}011$ par jour calendaire.
:::

:::exercice ex-gr-gamma
reponse: phi(0.1)/20
tolerance: 0.0001
$S = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = 0$. Gamma du call ?
---
$\Gamma = \frac{\varphi(0{,}1)}{100 \times 0{,}2 \times 1} = \frac{0{,}3970}{20} \approx 0{,}0198$.
:::

:::exercice ex-gr-vega
reponse: phi(0.1)
tolerance: 0.001
Même option. De combien augmente son prix si la vol passe de 20 % à 21 % ? (Donne la vega par point de vol.)
---
$\mathcal{V} = S\varphi(d_1)\sqrt T = 100 \times 0{,}397 = 39{,}7$ par unité de vol, donc $\approx 0{,}397$ pour un point.
:::

:::exercice ex-gr-theta
reponse: -100*phi(0.1)*0.1/365
tolerance: 0.0002
Même option. Theta par jour calendaire (base 365) ?
---
$\Theta = -\frac{S\varphi(d_1)\sigma}{2\sqrt T} = -100 \times 0{,}397 \times 0{,}1 \approx -3{,}97$ par an, soit $-3{,}97/365 \approx -0{,}0109$ par jour.
:::

## Le PnL d'une option couverte en delta

C'est **la** question des entretiens de trading d'options. On achète une option, on la couvre en delta, et on se demande ce qu'on gagne.

:::theoreme PnL instantané d'une position couverte
On est long d'une option valorisée à la vol implicite $\sigma_i$ et court de $\Delta$ actions, avec $r = 0$. Sur un petit intervalle $dt$, si le sous-jacent varie de $dS$,
$$
d\text{PnL} \approx \frac12\,\Gamma\,S^2\left[\left(\frac{dS}{S}\right)^2 - \sigma_i^2\,dt\right].
$$
:::

:::preuve
Développement de Taylor du prix à l'ordre 2 en $S$ et 1 en $t$ (à vol implicite fixée) :
$$
dV \approx \Theta\,dt + \Delta\,dS + \frac12\Gamma\,(dS)^2.
$$
La position est $V - \Delta S$, donc $d\text{PnL} = dV - \Delta\,dS = \Theta\,dt + \frac12\Gamma\,(dS)^2$ : **le delta s'est éliminé**. Avec $r = 0$, l'EDP donne $\Theta = -\frac12\sigma_i^2S^2\Gamma$. On remplace et on factorise $\frac12\Gamma S^2$.
:::

:::intuition Gamma contre theta
- Le terme $\frac12\Gamma(dS)^2$ est **toujours positif** pour un long gamma : à chaque mouvement, dans un sens ou dans l'autre, on gagne (on rachète du sous-jacent quand il a baissé et on en revend quand il a monté, puisque le delta suit le prix).
- Le theta est la **location** payée chaque jour pour ce gamma.
- **Point mort** : on gagne sur la journée si $|dS/S| > \sigma_i\sqrt{dt}$, c'est-à-dire si le mouvement réalisé dépasse le mouvement « prévu » par la vol implicite. Avec $\sigma_i = 16\,\%$, le point mort quotidien est de $16\,\%/\sqrt{252} \approx 1\,\%$ ([[fiche:der-gamma-theta]]).
:::

:::theoreme PnL total jusqu'à l'échéance
En sommant sur la durée de vie, si le sous-jacent a une **volatilité réalisée** $\sigma_r$ (au sens où $(dS/S)^2 \approx \sigma_r^2\,dt$) :
$$
\text{PnL} \approx \int_0^T \frac12\,\Gamma_t\,S_t^2\,\big(\sigma_r^2 - \sigma_i^2\big)\,dt.
$$
On gagne si la vol réalisée dépasse la vol implicite payée ([[fiche:der-pnl-couverture]]), mais le montant **dépend du chemin** : les écarts de vol comptent surtout quand le gamma est grand, c'est-à-dire quand le sous-jacent est près du strike et l'échéance proche.
:::

:::propriete Avec quel delta couvrir ?
- **Couvrir au delta de la vol réalisée** (si on la connaissait) : le PnL final est **déterministe**, égal à $V(\sigma_r) - V(\sigma_i)$, la différence des deux prix Black-Scholes.
- **Couvrir au delta de la vol implicite** (ce qu'on fait en pratique) : le PnL est **aléatoire** (son montant dépend du chemin) mais, pour une option vanille ($\Gamma > 0$) couverte en continu, il est positif sur chaque trajectoire si $\sigma_r > \sigma_i$ ; il est donné par l'intégrale pondérée par le gamma ci-dessus. En couverture discrète s'ajoute l'erreur de la section suivante.

Le widget ci-dessous vend un call et le couvre au delta de la vol implicite : choisis une vol réalisée différente et regarde la moyenne se déplacer.
:::

:::widget couverture
:::

:::exercice ex-gr-pnl-vol
reponse: 100*(N(0.125)-N(-0.125))-100*(N(0.1)-N(-0.1))
tolerance: 0.05
Tu achètes un call à la monnaie ($S = K = 100$, $T = 1$, $r = 0$) à 20 % de vol implicite. La vol réalisée sera de 25 %, et tu la connais : tu couvres en continu avec le delta à 25 %. Quel est ton PnL final ?
---
Couvrir au delta de la vol réalisée réplique l'option au coût $V(25\,\%)$ ; tu l'as payée $V(20\,\%)$. PnL $= 100\big(N(0{,}125) - N(-0{,}125)\big) - 100\big(N(0{,}1) - N(-0{,}1)\big) \approx 9{,}95 - 7{,}97 = 1{,}98$, soit environ 5 points de vol $\times$ vega $0{,}4$.
:::

:::exercice ex-gr-point-mort
reponse: 16/sqrt(252)
tolerance: 0.01
Tu es long d'un call à la monnaie couvert en delta, valorisé à 16 % de vol implicite, $S = 100$, $r = 0$. Avec la convention de 252 jours ouvrés, de combien le sous-jacent doit-il bouger en une journée (en points) pour que le gain de gamma compense exactement le theta ?
---
$\frac12\Gamma(dS)^2 = -\Theta\,dt = \frac12\sigma_i^2S^2\Gamma\,dt$, donc $|dS| = \sigma_iS\sqrt{dt} = 0{,}16 \times 100/\sqrt{252} \approx 1{,}01$. Le résultat ne dépend ni de la maturité ni du gamma : le point mort est toujours le mouvement « annoncé » par la vol implicite.
:::

## Couvrir en temps discret

:::propriete L'erreur de couverture discrète
Si l'on réajuste $N$ fois, même quand la vol réalisée égale la vol implicite, le PnL n'est pas nul : chaque intervalle laisse un résidu $\frac12\Gamma S^2\sigma^2\Delta t\,(Z^2 - 1)$, avec $Z \sim \mathcal{N}(0,1)$, d'espérance nulle mais de variance $\frac12(\Gamma S^2\sigma^2\Delta t)^2$. Ces résidus sont non corrélés (incréments de martingale), donc la variance totale est d'ordre
$$
N \times \frac12\left(\Gamma S^2\sigma^2\,\frac TN\right)^2 \propto \frac1N, \qquad \text{écart-type} \propto \frac{1}{\sqrt N}.
$$
**Réajuster quatre fois plus souvent divise l'erreur par deux.** Pour une option à la monnaie, l'écart-type vaut environ $\sqrt{\pi/4}\;\mathcal{V}\,\sigma/\sqrt N$ (Derman et Kamal, admis ; le widget le confirme) ([[fiche:der-couverture-discrete]]).
:::

:::attention Coûts de transaction
Chaque réajustement coûte une fraction du montant traité ; plus on réajuste, plus on paie. Il y a donc un **arbitrage entre erreur de couverture et coûts** : en pratique on couvre par **bandes** (on ne réajuste que quand le delta s'écarte trop de sa cible) ou à heure fixe. Les coûts agissent comme un ajustement de la vol (modèle de Leland) : le vendeur d'option (court gamma) doit compter une vol majorée, l'acheteur couvert (long gamma) une vol minorée ; dans les deux cas, ils jouent contre celui qui couvre.
:::

## Grecques d'un portefeuille

:::propriete Additivité
Les grecques sont des dérivées, donc **linéaires** : celles d'un portefeuille sont la somme pondérée de celles de ses lignes. L'action a un delta de 1 et **aucun** gamma ni vega ; seules des options peuvent corriger le gamma et la vega.
:::

:::methode Neutraliser un portefeuille en delta et en gamma ([[fiche:der-greeks-portefeuille]])
1. D'abord le **gamma** (et la vega) avec des options cotées : $n = -\Gamma_{\text{portefeuille}}/\Gamma_{\text{option}}$.
2. Ensuite le **delta** avec le sous-jacent, en tenant compte du delta apporté par ces options.
L'ordre compte : acheter des options change le delta, alors qu'acheter le sous-jacent ne change pas le gamma.
:::

:::exercice ex-gr-gamma-neutre
reponse: 24
Tu es vendeur de 100 calls ($\Delta = 0{,}54$, $\Gamma = 0{,}02$ chacun). Tu disposes d'une autre option ($\Delta = 0{,}6$, $\Gamma = 0{,}04$) et du sous-jacent. Après avoir neutralisé le gamma, combien d'unités du sous-jacent dois-tu acheter pour être neutre en delta ?
---
Gamma : $-100 \times 0{,}02 + n \times 0{,}04 = 0$, donc $n = 50$ options achetées. Delta : $-100 \times 0{,}54 + 50 \times 0{,}6 = -54 + 30 = -24$, donc on achète **24** unités du sous-jacent.
:::

:::definition Grecques d'ordre deux à connaître de nom
- **Vanna** $\dfrac{\partial^2V}{\partial S\,\partial\sigma} = \dfrac{\partial\Delta}{\partial\sigma}$ : comment le delta réagit à la vol. Importante avec un skew (la vol bouge avec le spot).
- **Volga** (ou vomma) $\dfrac{\partial^2V}{\partial\sigma^2}$ : convexité en vol. Quasi nulle (légèrement négative) à la monnaie, où le prix est presque linéaire en vol, positive pour les options en dehors : elles valent plus quand on est incertain sur la vol, d'où les ailes du smile.
- **Charm** $\dfrac{\partial\Delta}{\partial t}$ : dérive du delta avec le temps (le delta d'un call en dehors de la monnaie fond à l'approche de l'échéance).
:::

## Lire et expliquer un PnL

:::methode Décomposition du PnL quotidien d'un livre d'options ([[fiche:mm-pnl-trader-options]])
$$
\text{PnL} \approx \underbrace{\Delta\,dS}_{\text{directionnel}} + \underbrace{\tfrac12\Gamma\,(dS)^2}_{\text{gamma}} + \underbrace{\mathcal{V}\,d\sigma}_{\text{vega}} + \underbrace{\Theta\,dt}_{\text{temps}} + \underbrace{\rho\,dr}_{\text{taux}} + \text{(vanna, volga, résidu)}.
$$
Un livre couvert en delta a un terme directionnel nul. Le **résidu inexpliqué** est surveillé de près par le risque : un résidu important signale un modèle mal calibré ou une grecque oubliée.
:::

:::exemple Un desk court gamma ([[fiche:mm-short-gamma]])
Un desk qui a vendu des options est **court gamma** : pour rester neutre, il doit **vendre quand le marché baisse et acheter quand il monte**, ce qui amplifie les mouvements. À l'inverse, des teneurs de marché longs gamma achètent les baisses et vendent les hausses, ce qui amortit la volatilité. C'est un mécanisme réel de marché, souvent cité autour des échéances d'options sur indices.
:::

:::exemple Les barrières, où les grecques deviennent extrêmes ([[fiche:struct-greques-barriere]])
Près d'une barrière et de l'échéance, le prix d'une option à barrière peut sauter quand le sous-jacent franchit la barrière : delta et gamma deviennent énormes et changent de signe. Le desk ne peut pas couvrir ce saut au delta ; il « déplace » la barrière dans sa valorisation (barrier shift) pour se constituer une réserve.
:::

## Stratégies et grecques

:::propriete Les stratégies simples ([[fiche:der-strangle-straddle]])
- **Straddle** (call + put même strike, à la monnaie) : delta $\approx 0$, gamma et vega maximaux. Pari pur sur la volatilité (réalisée ou implicite). Prix $\approx 0{,}8\,\sigma S\sqrt T$.
- **Strangle** (put en dehors + call en dehors) : moins cher, gamma concentré loin du spot, pari sur un grand mouvement.
- **Call spread**, **put spread** : vue directionnelle avec risque limité, vega faible.
- **Papillon** : court vol autour d'un strike, gain maximal si le sous-jacent finit au strike central.
- **Risk reversal** (long call en dehors, court put en dehors) : pari sur le skew et sur la direction.
:::

## Pièges classiques

:::attention Les erreurs fréquentes
- Confondre $\Theta = \partial_t V$ et $\partial_T V$ (signes opposés).
- Donner la vega « par unité de vol » quand on demande l'effet d'un point (diviser par 100).
- Dire que le gamma est maximal exactement à la monnaie : en dérivant $\varphi(d_1)/S$, on trouve le maximum en $d_1 = -\sigma\sqrt T$, soit $S = Ke^{-(r + \frac32\sigma^2)T}$, légèrement **en dessous** du strike ; à l'oral, « près de la monnaie » suffit.
- Dire qu'un long gamma couvert gagne « quand la vol monte » : c'est la vol **réalisée** qui compte pour le gamma, l'**implicite** pour la vega.
- Oublier que le PnL d'une couverture à la vol implicite dépend du chemin.
- Neutraliser le delta avant le gamma.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Donne les signes des grecques d'un call et d'un put achetés. »** Le tableau, en dix secondes.
- **« Dérive le vega de Black-Scholes. »** L'identité $S\varphi(d_1) = Ke^{-rT}\varphi(d_2)$ puis $d_1 - d_2 = \sigma\sqrt T$.
- **« Tu achètes une option à 20 % de vol, la vol réalisée est de 25 %. Gagnes-tu ? Combien ? »** Oui, sur toute trajectoire en couverture continue ; formule gamma-theta ; dépend du chemin si on couvre à l'implicite ; $V(25\,\%) - V(20\,\%)$ si on couvre à la réalisée.
- **« Quel est le point mort quotidien d'une option à 16 % de vol ? »** 1 % par jour, et savoir le justifier.
- **« Pourquoi le gamma explose-t-il à l'échéance ? »** $\Gamma \approx 0{,}4/(S\sigma\sqrt T)$ ; le delta passe brutalement de 0 à 1 autour du strike.
- **« Tu es court d'un call, comment te couvrir en delta et en gamma ? »** Options d'abord, sous-jacent ensuite.
- **« Que se passe-t-il si tu couvres une fois par jour ? »** Erreur aléatoire d'espérance nulle, écart-type en $1/\sqrt N$, arbitrage avec les coûts.
:::
