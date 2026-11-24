---
titre: Absence d'arbitrage et probabilité risque-neutre
partie: Pricing
resume: Tout le pricing repose sur une idée, l'absence d'arbitrage. On en tire le prix forward, la parité call-put et les bornes sur les options, puis la réplication dans un arbre binomial, qui fait apparaître la probabilité risque-neutre. On passe au temps continu avec Girsanov et on termine par le changement de numéraire, qui donne Black-Scholes presque sans calcul.
duree: 3 h 30
fiches: der-risque-neutre der-arbre-un-pas der-arbre-delta der-arbre-deux-pas der-put-americain-arbre der-parite-call-put der-bornes der-convexite-strike der-call-americain der-forward-dividende der-forward-futures stoch-girsanov der-digitale-prix der-digitale-replication der-proba-exercice der-option-carre
---
Les questions de pricing en entretien ne demandent presque jamais de calcul compliqué. Elles demandent de **raisonner par arbitrage** : « pourquoi le forward vaut-il $Se^{rT}$ ? », « prouve la parité call-put », « pourquoi n'exerce-t-on jamais un call américain sans dividende ? », « pourquoi la probabilité réelle de hausse n'apparaît-elle pas dans le prix ? ». Ce chapitre construit ces réponses dans l'ordre, du plus simple (un portefeuille statique) au plus abstrait (le changement de probabilité).

Notations : taux sans risque continu $r$ constant, maturité $T$, sous-jacent $S$, strike $K$. Un euro placé aujourd'hui vaut $e^{rT}$ en $T$ ; un euro reçu en $T$ vaut $e^{-rT}$ aujourd'hui.

## Arbitrage et loi du prix unique

:::definition Arbitrage
Un **arbitrage** est une stratégie qui ne coûte rien aujourd'hui (ou rapporte de l'argent), ne peut jamais perdre, et gagne avec une probabilité strictement positive. Dans un marché sans frais où tout le monde peut acheter et vendre à découvert, on suppose qu'il n'en existe pas : sinon tout le monde l'exploiterait et les prix s'ajusteraient.
:::

:::theoreme Loi du prix unique
En l'absence d'arbitrage, deux portefeuilles qui ont **la même valeur en $T$ dans tous les états du monde** ont la même valeur aujourd'hui. Plus généralement, si le portefeuille A vaut toujours au moins autant que B en $T$, alors A vaut au moins autant que B aujourd'hui.
:::

:::preuve
Si A valait moins que B aujourd'hui, on achèterait A et vendrait B : on encaisse la différence aujourd'hui et, en $T$, la position vaut $A_T - B_T \ge 0$. C'est un arbitrage.
:::

C'est l'outil unique de cette section : pour pricer un produit, on cherche un portefeuille d'actifs dont on connaît le prix et qui a le **même flux** en $T$. On dit qu'on **réplique** le produit.

## Ce que l'arbitrage suffit à prouver

### Le prix forward

:::theoreme Prix forward
Un contrat forward oblige à acheter l'actif en $T$ au prix $F$ fixé aujourd'hui, sans paiement initial. Sans dividende, le seul prix forward sans arbitrage est
$$
F = S_0e^{rT}.
$$
:::

:::preuve Par cash-and-carry
**Si $F > S_0e^{rT}$** : j'emprunte $S_0$, j'achète l'action et je **vends** le forward. Coût initial nul. En $T$, je livre l'action contre $F$ et je rembourse $S_0e^{rT}$ : gain certain $F - S_0e^{rT} > 0$.

**Si $F < S_0e^{rT}$** : je vends l'action à découvert, je place $S_0$ et j'**achète** le forward. En $T$, je récupère $S_0e^{rT}$, j'achète l'action à $F$ pour rendre celle que j'ai empruntée : gain $S_0e^{rT} - F > 0$.
:::

:::propriete Avec des revenus ou des coûts de portage
- Dividende discret $D$ payé en $t_1 < T$ : $F = (S_0 - De^{-rt_1})e^{rT}$. On retire la valeur actuelle des dividendes, que le détenteur du forward ne touche pas ([[fiche:der-forward-dividende]]).
- Taux de dividende continu $q$ (indice) : $F = S_0e^{(r - q)T}$.
- Change : $F = S_0e^{(r_{dom} - r_{etr})T}$ (parité des taux couverte).
- Matière première avec coût de stockage $u$ et rendement d'opportunité $y$ : $F = S_0e^{(r + u - y)T}$. Quand le stockage est impossible (électricité), l'argument de cash-and-carry tombe et le forward n'est plus lié au spot par arbitrage.
:::

:::attention Forward contre futures
Un **futures** est un forward avec appels de marge quotidiens. Si les taux sont déterministes, les deux prix coïncident. Si le prix du sous-jacent est **positivement corrélé aux taux**, le détenteur long du futures reçoit des marges quand les taux sont hauts (il les place à bon prix) et paie quand ils sont bas : le prix futures est supérieur au prix forward. C'est l'**ajustement de convexité**, important sur les futures de taux ([[fiche:der-forward-futures]]).
:::

:::exercice ex-rn-forward-dividende
reponse: (100-3*exp(-0.02))*exp(0.04)
tolerance: 0.001
Action à 100, taux 4 %, maturité un an, dividende de 3 versé dans six mois. Quel est le prix forward ?
---
$F = (100 - 3e^{-0{,}04 \times 0{,}5})e^{0{,}04} = 100e^{0{,}04} - 3e^{0{,}02} \approx 104{,}081 - 3{,}061 = 101{,}02$. La seconde écriture se lit directement : on porte l'action à crédit jusqu'en $T$, et le dividende reçu à mi-parcours est replacé six mois.
:::

### La parité call-put

:::theoreme Parité call-put (options européennes)
$$
C - P = S_0 - Ke^{-rT}.
$$
:::

:::preuve
En $T$, pour toute valeur de $S_T$ : $(S_T - K)^+ - (K - S_T)^+ = S_T - K$. (Si $S_T \ge K$ : $S_T - K - 0$ ; sinon : $0 - (K - S_T)$.) Le portefeuille « long call, short put » a donc le même flux qu'un forward de prix $K$, c'est-à-dire « long une action, emprunt de $Ke^{-rT}$ ». Par la loi du prix unique, $C - P = S_0 - Ke^{-rT}$.
:::

Conséquences immédiates ([[fiche:der-parite-call-put]]) : à la monnaie forward ($K = S_0e^{rT}$), le call et le put valent la même chose ; un call et un put de même strike ont le **même gamma et le même vega** (leur différence est linéaire en $S$) ; et si la parité est violée sur un marché, on l'arbitre avec une « conversion » ou une « reversal ».

:::exercice ex-rn-parite
reponse: 10-100+100*exp(-0.05)
tolerance: 0.001
$S_0 = K = 100$, $r = 5\,\%$, $T = 1$ et le call vaut 10. Combien vaut le put ?
---
$P = C - S_0 + Ke^{-rT} = 10 - 100 + 100e^{-0{,}05} \approx 5{,}12$. Le put vaut moins que le call parce que le forward ($105{,}1$) est au-dessus du strike : le call est dans la monnaie forward.
:::

### Les bornes et la forme du prix d'un call

:::propriete Bornes sans arbitrage sur un call européen
$$
\max\big(S_0 - Ke^{-rT},\ 0\big) \le C \le S_0.
$$
De même $\max(Ke^{-rT} - S_0, 0) \le P \le Ke^{-rT}$ ([[fiche:der-bornes]]).
:::

:::preuve
- $C \le S_0$ : le flux du call, $(S_T - K)^+$, est toujours inférieur à $S_T$, flux d'une action.
- $C \ge 0$ : le flux est positif.
- $C \ge S_0 - Ke^{-rT}$ : par parité, $C = S_0 - Ke^{-rT} + P$ et $P \ge 0$.
:::

:::theoreme Call américain sans dividende
Sur une action sans dividende (et $r \ge 0$), il n'est **jamais optimal d'exercer un call américain avant l'échéance** : il vaut le même prix que le call européen ([[fiche:der-call-americain]]).
:::

:::preuve
À tout instant $t < T$, le call américain vaut au moins le call européen, qui vaut au moins $S_t - Ke^{-r(T - t)} \ge S_t - K$. Exercer rapporte $S_t - K$, ce qui est moins que la valeur de l'option : mieux vaut la **vendre** (ou la garder) que l'exercer. Intuition : exercer tôt, c'est payer $K$ plus tôt (perte des intérêts) et renoncer à l'assurance contre une baisse.
:::

:::attention Ce n'est pas vrai pour un put
Un put américain profondément dans la monnaie peut être exercé tôt : recevoir $K$ tout de suite et le placer vaut plus que garder une option dont la valeur temps est devenue minuscule. Avec des dividendes, un call américain peut être exercé juste avant le détachement.
:::

:::propriete Forme de $K \mapsto C(K)$
1. **Décroissante** : $C(K_1) \ge C(K_2)$ pour $K_1 < K_2$ (le flux est plus grand).
2. **Pente bornée** : $C(K_1) - C(K_2) \le (K_2 - K_1)e^{-rT}$ (le call spread paie au plus $K_2 - K_1$).
3. **Convexe** : $C(K - h) - 2C(K) + C(K + h) \ge 0$ (le **papillon** a un flux positif) ([[fiche:der-convexite-strike]]).
:::

:::theoreme Breeden-Litzenberger : les prix d'options donnent la loi risque-neutre
Si $C(K) = e^{-rT}\mathbb{E}^{\mathbb{Q}}[(S_T - K)^+]$ et que $S_T$ a une densité $f$ sous $\mathbb{Q}$, alors
$$
\frac{\partial C}{\partial K} = -e^{-rT}\,\mathbb{Q}(S_T > K), \qquad \frac{\partial^2 C}{\partial K^2} = e^{-rT}f(K).
$$
:::

:::preuve
$C(K) = e^{-rT}\int_K^\infty (s - K)f(s)\,ds$. On dérive une intégrale dont la borne et l'intégrande dépendent de $K$ : le terme de bord vaut $(K - K)f(K) = 0$, il reste $C'(K) = -e^{-rT}\int_K^\infty f(s)\,ds = -e^{-rT}\mathbb{Q}(S_T > K)$. On dérive encore : $C''(K) = e^{-rT}f(K)$.
:::

Conséquence pratique : une **digitale** (qui paie 1 si $S_T > K$) se réplique par un call spread serré, $\frac{1}{h}\big(C(K) - C(K + h)\big) \to -\partial_K C$ ([[fiche:der-digitale-replication]]). Avec un smile, $-\partial_K C$ contient la pente de la volatilité implicite en $K$ : le prix d'une digitale n'est pas $e^{-rT}N(d_2)$ calculé à la vol du strike (voir le chapitre sur la volatilité).

:::exercice ex-rn-papillon
reponse: 2
Les calls de strikes 90, 100 et 110 (même maturité) valent 14, 8 et $x$. Quelle est la plus petite valeur de $x$ sans arbitrage papillon ?
---
Convexité : $C(90) - 2C(100) + C(110) \ge 0$, soit $14 - 16 + x \ge 0$, donc $x \ge 2$. Si le call 110 cotait moins de 2, on achèterait le papillon (un 90, deux 100 vendus, un 110) pour un prix négatif, alors que son flux est toujours positif.
:::

## La réplication dans un arbre à une période

On passe des portefeuilles **statiques** (achetés une fois pour toutes) aux portefeuilles **dynamiques**, avec le modèle le plus simple possible.

:::definition Modèle binomial à une période
Aujourd'hui l'action vaut $S$ ; dans $T$, elle vaut $Su$ (hausse, probabilité réelle $p$) ou $Sd$ (baisse), avec $d < u$. Une obligation sans risque vaut 1 aujourd'hui et $e^{rT}$ en $T$. Une option paie $C_u$ dans l'état haut et $C_d$ dans l'état bas.
:::

:::theoreme Prix par réplication
On peut répliquer l'option avec $\Delta$ actions et $B$ euros d'obligation :
$$
\Delta = \frac{C_u - C_d}{Su - Sd}, \qquad C_0 = \Delta S + B = e^{-rT}\big(q\,C_u + (1 - q)\,C_d\big), \qquad q = \frac{e^{rT} - d}{u - d}.
$$
L'absence d'arbitrage équivaut à $d < e^{rT} < u$, c'est-à-dire $0 < q < 1$.
:::

:::preuve
**Réplication** : on veut que le portefeuille vaille $C_u$ en haut et $C_d$ en bas :
$$
\Delta Su + Be^{rT} = C_u, \qquad \Delta Sd + Be^{rT} = C_d.
$$
En soustrayant : $\Delta S(u - d) = C_u - C_d$, d'où $\Delta$ ([[fiche:der-arbre-delta]]). En reportant dans la deuxième équation : $Be^{rT} = C_d - \dfrac{(C_u - C_d)d}{u - d} = \dfrac{uC_d - dC_u}{u - d}$.

**Prix** : par la loi du prix unique, $C_0 = \Delta S + B$ :
$$
C_0 = \frac{C_u - C_d}{u - d} + e^{-rT}\,\frac{uC_d - dC_u}{u - d} = \frac{e^{-rT}}{u - d}\Big(e^{rT}(C_u - C_d) + uC_d - dC_u\Big) = \frac{e^{-rT}}{u - d}\Big(C_u(e^{rT} - d) + C_d(u - e^{rT})\Big).
$$
On reconnaît $q = \frac{e^{rT} - d}{u - d}$ et $1 - q = \frac{u - e^{rT}}{u - d}$.

**Arbitrage** : si $e^{rT} \ge u$, l'action fait toujours moins bien que l'obligation : on la vend à découvert et on place le produit, gain $\ge 0$ partout et $> 0$ en bas. Symétriquement si $e^{rT} \le d$.
:::

:::intuition Pourquoi la probabilité réelle $p$ n'apparaît pas
Le prix est fixé par la **réplication**, qui marche dans les deux états quelle que soit leur probabilité. L'information sur $p$ est déjà contenue dans le prix de l'action $S$ : si tout le monde pensait que la hausse est très probable, $S$ serait plus cher aujourd'hui. Une fois $S$ donné, deux investisseurs en désaccord sur $p$ doivent s'accorder sur le prix de l'option, sinon l'un d'eux offre un arbitrage à l'autre ([[fiche:der-risque-neutre]]).
:::

:::definition Probabilité risque-neutre
$q$ est une probabilité (entre 0 et 1) sous laquelle **l'action rapporte en moyenne le taux sans risque** :
$$
q\,Su + (1 - q)\,Sd = Se^{rT} \iff q = \frac{e^{rT} - d}{u - d}.
$$
Sous $q$, le prix de tout actif est l'espérance de son flux actualisé : $C_0 = e^{-rT}\mathbb{E}^{q}[C_T]$. Ce n'est **pas** une hypothèse sur les préférences des investisseurs : c'est une façon commode d'écrire le prix de réplication.
:::

:::exemple Un arbre chiffré
$S = 100$, $u = 1{,}2$, $d = 0{,}9$, $r = 0$, call de strike 100 : $C_u = 20$, $C_d = 0$ ([[fiche:der-arbre-un-pas]]).
- $\Delta = \frac{20 - 0}{120 - 90} = \frac23$ et $B = \frac{1{,}2 \times 0 - 0{,}9 \times 20}{0{,}3} = -60$ : on achète $\frac23$ d'action (66,67) financés en partie par un emprunt de 60.
- Prix : $66{,}67 - 60 = 6{,}67$. Avec $q = \frac{1 - 0{,}9}{0{,}3} = \frac13$ : $\frac13 \times 20 = 6{,}67$. ✓
- Même si la probabilité réelle de hausse est de 90 %, le call vaut 6,67.
:::

:::exercice ex-rn-un-pas
reponse: 20/3
Action à 100, qui vaudra 120 ou 90 dans un an, taux nul. Prix du call de strike 100 ? (Refais le calcul par réplication, sans regarder l'exemple.)
---
$\Delta = 20/30$, $B = -\Delta \times 90 = -60$ (le portefeuille doit valoir 0 en bas), prix $= \frac23 \times 100 - 60 = \frac{20}{3} \approx 6{,}67$.
:::

## Arbres à plusieurs pas

:::methode Induction à rebours
1. Construire l'arbre des prix : après $j$ hausses et $n - j$ baisses, $S_{n,j} = Su^jd^{n-j}$ (l'arbre est **recombinant** : haut puis bas = bas puis haut).
2. À la maturité, la valeur de l'option est son flux.
3. En reculant d'un pas : $V_{k,j} = e^{-r\Delta t}\big(q\,V_{k+1, j+1} + (1 - q)\,V_{k+1, j}\big)$.
4. **Option américaine** : à chaque nœud, $V_{k,j} = \max\big(\text{valeur de continuation},\ \text{valeur d'exercice}\big)$ ([[fiche:der-put-americain-arbre]]).
5. Le delta à chaque nœud est $\Delta_{k,j} = \frac{V_{k+1,j+1} - V_{k+1,j}}{S_{k+1,j+1} - S_{k+1,j}}$ : c'est la stratégie de couverture dynamique, réajustée à chaque pas.
:::

:::propriete Formule fermée pour une européenne
Pour un flux $g(S_T)$, l'induction donne directement
$$
V_0 = e^{-rT}\sum_{j=0}^n \binom{n}{j}q^j(1 - q)^{n - j}\,g\big(Su^jd^{n-j}\big).
$$
C'est l'espérance de $g(S_T)$ quand le nombre de hausses suit une loi binomiale $\mathcal{B}(n, q)$ ([[fiche:der-arbre-deux-pas]]).
:::

:::intuition Convergence vers Black-Scholes
Avec Cox-Ross-Rubinstein, $u = e^{\sigma\sqrt{\Delta t}}$ et $d = 1/u$. Le logarithme de $S_T/S_0$ est une somme de $n$ variables indépendantes valant $\pm\sigma\sqrt{\Delta t}$ ; par le théorème central limite, il devient gaussien, de variance $n\sigma^2\Delta t = \sigma^2T$, et de moyenne $(r - \frac12\sigma^2)T$ (un développement limité de $q$ le montre). On retrouve le modèle log-normal sous la probabilité risque-neutre, et le prix de l'arbre tend vers Black-Scholes. Le widget montre cette convergence, avec son oscillation caractéristique selon la position du strike par rapport aux nœuds.
:::

:::widget binomial
:::

:::exemple Un put américain à deux pas
$S = 100$, $u = 1{,}2$, $d = 0{,}8$, $K = 100$, facteur de capitalisation par pas $R = 1{,}05$, donc $q = \frac{1{,}05 - 0{,}8}{0{,}4} = 0{,}625$.
- Maturité : $S = 144, 96, 64$, flux du put $0, 4, 36$.
- Nœud haut ($S = 120$) : continuation $\frac{0{,}625 \times 0 + 0{,}375 \times 4}{1{,}05} = 1{,}43$, exercice $0$ : on garde.
- Nœud bas ($S = 80$) : continuation $\frac{0{,}625 \times 4 + 0{,}375 \times 36}{1{,}05} = \frac{16}{1{,}05} = 15{,}24$, exercice $100 - 80 = 20$ : **on exerce**.
- Racine : $\frac{0{,}625 \times 1{,}43 + 0{,}375 \times 20}{1{,}05} \approx 7{,}99$, contre $6{,}29$ pour le put européen (qui garde $15{,}24$ au nœud bas).
:::

:::exercice ex-rn-put-americain
reponse: (0.625*1.5/1.05+0.375*20)/1.05
tolerance: 0.001
Reprends l'exemple précédent sans le regarder : prix du put américain à deux pas ($S = K = 100$, $u = 1{,}2$, $d = 0{,}8$, $R = 1{,}05$ par pas) ?
---
Au nœud bas, exercer (20) bat la continuation (15,24) ; au nœud haut, la continuation vaut $1{,}5/1{,}05$. Racine : $\big(0{,}625 \times \frac{1{,}5}{1{,}05} + 0{,}375 \times 20\big)/1{,}05 \approx 7{,}993$.
:::

## Le théorème fondamental

:::theoreme Théorème fondamental de l'évaluation (énoncé)
1. Le marché est **sans arbitrage** si et seulement s'il existe une probabilité $\mathbb{Q}$, équivalente à la probabilité réelle (mêmes événements de probabilité nulle), sous laquelle les **prix actualisés** $e^{-rt}S_t$ de tous les actifs sont des **martingales**.
2. Le marché est **complet** (tout flux est réplicable) si et seulement si cette probabilité est **unique**.
:::

Dans l'arbre à une période, $\mathbb{Q}$ est $q$ ; elle est unique parce qu'il y a deux états et deux actifs. Avec trois états et deux actifs (arbre trinomial), il y a une infinité de $q$ possibles et un intervalle de prix sans arbitrage : le marché est **incomplet**. Les modèles à volatilité stochastique ou à sauts sont incomplets, ce qui explique qu'il faille y choisir une mesure (en pratique, en calant sur les prix d'options cotées).

:::propriete Le prix est une espérance risque-neutre
Dans un marché complet sans arbitrage, tout flux $X$ payé en $T$ vaut aujourd'hui
$$
V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[X], \qquad \text{et plus généralement} \qquad V_t = e^{-r(T - t)}\,\mathbb{E}^{\mathbb{Q}}[X \mid \mathcal{F}_t].
$$
:::

## En temps continu : le théorème de Girsanov

Dans le modèle de Black-Scholes, $dS = \mu S\,dt + \sigma S\,dW$ sous la probabilité réelle $\mathbb{P}$. Il faut une probabilité $\mathbb{Q}$ sous laquelle $e^{-rt}S_t$ est une martingale, c'est-à-dire sous laquelle la dérive de $S$ est $r$ au lieu de $\mu$. Girsanov dit comment **changer la dérive d'un brownien en changeant de probabilité**.

:::theoreme Changement de probabilité pour une gaussienne
Soit $X \sim \mathcal{N}(0, 1)$ sous $\mathbb{P}$ et $\theta \in \mathbb{R}$. Posons $Z = e^{\theta X - \theta^2/2}$ et définissons $\mathbb{Q}$ par $\mathbb{Q}(A) = \mathbb{E}^{\mathbb{P}}[Z\,\mathbf{1}_A]$. Alors $\mathbb{Q}$ est une probabilité et, sous $\mathbb{Q}$, $X \sim \mathcal{N}(\theta, 1)$.
:::

:::preuve
$Z > 0$ et $\mathbb{E}[Z] = e^{-\theta^2/2}\,\mathbb{E}[e^{\theta X}] = e^{-\theta^2/2}e^{\theta^2/2} = 1$ : $\mathbb{Q}$ est une probabilité. Pour toute fonction $g$ :
$$
\mathbb{E}^{\mathbb{Q}}[g(X)] = \int g(x)\,e^{\theta x - \theta^2/2}\,\frac{e^{-x^2/2}}{\sqrt{2\pi}}\,dx = \int g(x)\,\frac{e^{-(x - \theta)^2/2}}{\sqrt{2\pi}}\,dx,
$$
car $-\frac{x^2}{2} + \theta x - \frac{\theta^2}{2} = -\frac{(x - \theta)^2}{2}$ (complétion du carré). C'est l'espérance de $g$ sous $\mathcal{N}(\theta, 1)$.
:::

:::theoreme Girsanov (cas d'une dérive constante)
Soit $W$ un brownien sous $\mathbb{P}$ sur $[0, T]$ et $\theta \in \mathbb{R}$. Définissons $\mathbb{Q}$ par la densité
$$
\frac{d\mathbb{Q}}{d\mathbb{P}} = Z_T = \exp\left(\theta W_T - \tfrac12\theta^2T\right).
$$
Alors $\widetilde W_t = W_t - \theta t$ est un brownien sous $\mathbb{Q}$ : sous $\mathbb{Q}$, $W$ est un brownien **avec dérive $\theta$** ([[fiche:stoch-girsanov]]).
:::

:::preuve De la loi de $W_t$ sous $\mathbb{Q}$
Calculons la transformée de Laplace de $W_t$ sous $\mathbb{Q}$, pour $t \le T$. On conditionne par $\mathcal{F}_t$ et on utilise que $Z_t = e^{\theta W_t - \theta^2t/2}$ est une martingale (chapitre [[n:integrale-et-lemme-ito]]) : $\mathbb{E}[Z_T \mid \mathcal{F}_t] = Z_t$. Donc
$$
\mathbb{E}^{\mathbb{Q}}\big[e^{uW_t}\big] = \mathbb{E}\big[e^{uW_t}Z_T\big] = \mathbb{E}\big[e^{uW_t}Z_t\big] = e^{-\theta^2t/2}\,\mathbb{E}\big[e^{(u + \theta)W_t}\big] = e^{-\theta^2t/2}\,e^{(u + \theta)^2t/2} = e^{u\theta t + u^2t/2}.
$$
C'est la transformée de Laplace de $\mathcal{N}(\theta t, t)$ : $W_t - \theta t \sim \mathcal{N}(0, t)$ sous $\mathbb{Q}$. Le même calcul, fait sur plusieurs dates à la fois, montre que les accroissements de $\widetilde W$ sont indépendants et gaussiens (admis).
:::

:::exemple La probabilité risque-neutre de Black-Scholes
On écrit $\mu = r + \sigma\lambda$, avec $\lambda = \frac{\mu - r}{\sigma}$ le **prix de marché du risque** (le Sharpe de l'action). Alors
$$
dS = \mu S\,dt + \sigma S\,dW = rS\,dt + \sigma S\,(dW + \lambda\,dt).
$$
On veut que $\widetilde W_t = W_t + \lambda t$ soit un brownien : Girsanov avec $\theta = -\lambda$, donc $\frac{d\mathbb{Q}}{d\mathbb{P}} = e^{-\lambda W_T - \lambda^2T/2}$. Sous $\mathbb{Q}$ : $dS = rS\,dt + \sigma S\,d\widetilde W$. **La volatilité ne change pas, seule la dérive change.** C'est pour cela que $\mu$ disparaît des prix d'options, comme $p$ disparaissait de l'arbre.
:::

:::intuition Ce que fait le changement de probabilité
$\mathbb{Q}$ donne plus de poids aux scénarios **défavorables** (ceux où $W_T$ est bas, puisque $\lambda > 0$ quand $\mu > r$) : c'est une probabilité « prudente », qui intègre l'aversion au risque dans les poids plutôt que dans le taux d'actualisation. Un changement de probabilité équivalent peut déplacer la moyenne, mais **pas la variation quadratique** : $\langle W\rangle_T = T$ sous les deux probabilités, car elle se lit sur une seule trajectoire. D'où la règle : on peut changer la dérive, jamais la volatilité.
:::

:::exercice ex-rn-girsanov
reponse: 2
Sous $\mathbb{P}$, $W$ est un brownien. Que vaut $\mathbb{E}^{\mathbb{P}}\big[W_1^2\,e^{W_1 - 1/2}\big]$ ? (Indice : reconnais une densité de changement de probabilité.)
---
$e^{W_1 - 1/2}$ est la densité de Girsanov avec $\theta = 1$ : l'espérance vaut $\mathbb{E}^{\mathbb{Q}}[W_1^2]$ où $W_1 \sim \mathcal{N}(1, 1)$ sous $\mathbb{Q}$, soit $1 + 1^2 = 2$. Calcul direct pour vérifier : $\int x^2 e^{x - 1/2}\varphi(x)\,dx = \int x^2\varphi(x - 1)\,dx = 2$.
:::

## Pricer par espérance, et changer de numéraire

:::exemple Prix d'une digitale
Une digitale cash paie 1 si $S_T > K$. Sous $\mathbb{Q}$, $\ln S_T = \ln S_0 + (r - \frac12\sigma^2)T + \sigma\widetilde W_T$, donc (chapitre [[n:equations-differentielles-stochastiques]], avec $\mu = r$)
$$
D = e^{-rT}\,\mathbb{Q}(S_T > K) = e^{-rT}N(d_2), \qquad d_2 = \frac{\ln(S_0/K) + (r - \frac12\sigma^2)T}{\sigma\sqrt T}.
$$
$N(d_2)$ est la probabilité **risque-neutre** d'exercice, pas la probabilité réelle ([[fiche:der-digitale-prix]], [[fiche:der-proba-exercice]]).
:::

:::exercice ex-rn-digitale
reponse: N(-0.1)
tolerance: 0.001
$S_0 = K = 100$, $\sigma = 20\,\%$, $r = 0$, $T = 1$. Prix de la digitale qui paie 1 si $S_T > K$ ?
---
$d_2 = \frac{0 - 0{,}02}{0{,}2} = -0{,}1$ et $D = N(-0{,}1) \approx 0{,}460$. Moins de 0,5 alors que l'option est à la monnaie : sous $\mathbb{Q}$, la médiane de $S_T$ est $100e^{-0{,}02} < 100$.
:::

:::exemple Une option sur le carré
Le flux $S_T^2$ vaut $e^{-rT}\mathbb{E}^{\mathbb{Q}}[S_T^2] = e^{-rT}S_0^2e^{(2r + \sigma^2)T} = S_0^2e^{(r + \sigma^2)T}$ ([[fiche:der-option-carre]]). Il vaut **plus** que la valeur actualisée du carré du forward, $e^{-rT}F^2 = S_0^2e^{rT}$ : c'est encore la convexité (ici de $x \mapsto x^2$), et elle se paie $\sigma^2T$ en exposant.
:::

:::exercice ex-rn-puissance
reponse: exp(0.04)
tolerance: 0.0005
$S_0 = 1$, $\sigma = 20\,\%$, $r = 0$, $T = 1$. Combien vaut aujourd'hui le flux $S_T^2$ ?
---
$e^{(r + \sigma^2)T} = e^{0{,}04} \approx 1{,}0408$.
:::

:::theoreme Changement de numéraire : l'action comme unité de compte
Définissons $\mathbb{Q}^S$ par $\dfrac{d\mathbb{Q}^S}{d\mathbb{Q}} = \dfrac{e^{-rT}S_T}{S_0}$. Alors, pour tout événement $A$ observable en $T$,
$$
e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\big[S_T\mathbf{1}_A\big] = S_0\,\mathbb{Q}^S(A),
$$
et sous $\mathbb{Q}^S$, $\ln S_T = \ln S_0 + (r + \frac12\sigma^2)T + \sigma\widehat W_T$ avec $\widehat W$ un brownien.
:::

:::preuve
La première égalité est la définition de $\mathbb{Q}^S$ : $S_0\,\mathbb{Q}^S(A) = S_0\,\mathbb{E}^{\mathbb{Q}}\big[\frac{e^{-rT}S_T}{S_0}\mathbf{1}_A\big]$. Pour la loi : $\frac{e^{-rT}S_T}{S_0} = e^{\sigma\widetilde W_T - \sigma^2T/2}$, c'est la densité de Girsanov avec $\theta = \sigma$. Sous $\mathbb{Q}^S$, $\widetilde W_t = \widehat W_t + \sigma t$ avec $\widehat W$ brownien. On remplace : $\ln S_T = \ln S_0 + (r - \frac12\sigma^2)T + \sigma(\widehat W_T + \sigma T) = \ln S_0 + (r + \frac12\sigma^2)T + \sigma\widehat W_T$.
:::

:::exemple Black-Scholes en trois lignes
On décompose le flux du call : $(S_T - K)^+ = S_T\mathbf{1}_{S_T > K} - K\mathbf{1}_{S_T > K}$. Donc
$$
C = e^{-rT}\mathbb{E}^{\mathbb{Q}}\big[S_T\mathbf{1}_{S_T > K}\big] - Ke^{-rT}\,\mathbb{Q}(S_T > K) = S_0\,\mathbb{Q}^S(S_T > K) - Ke^{-rT}N(d_2).
$$
Sous $\mathbb{Q}^S$, la dérive du log est $r + \frac12\sigma^2$, donc $\mathbb{Q}^S(S_T > K) = N(d_1)$ avec $d_1 = \frac{\ln(S_0/K) + (r + \frac12\sigma^2)T}{\sigma\sqrt T} = d_2 + \sigma\sqrt T$. D'où
$$
C = S_0N(d_1) - Ke^{-rT}N(d_2).
$$
**Lecture** : $N(d_2)$ est la probabilité d'exercice sous la probabilité risque-neutre, $N(d_1)$ la probabilité d'exercice quand on compte en actions. Le chapitre suivant refait ce calcul par intégration directe et par l'EDP.
:::

## Pièges classiques

:::attention Les confusions fréquentes
- « Le prix d'une option est l'espérance de son flux » : oui, mais sous $\mathbb{Q}$, et actualisée. Sous la probabilité réelle, il faudrait un taux d'actualisation ajusté au risque, inconnu et variable.
- « $\mathbb{Q}$ suppose des investisseurs neutres au risque » : non. Le prix est celui de la **réplication** ; $\mathbb{Q}$ est un outil de calcul qui en découle.
- Oublier que **seule la dérive change** sous Girsanov : la volatilité est la même sous $\mathbb{P}$ et $\mathbb{Q}$. C'est ce qui permet d'estimer $\sigma$ sur l'historique (en théorie).
- Confondre $N(d_2)$ (probabilité risque-neutre d'exercice) et le **delta** $N(d_1)$.
- Appliquer la parité call-put à des options **américaines** : on n'a qu'un encadrement, $S_0 - K \le C - P \le S_0 - Ke^{-rT}$ sans dividende.
- Appliquer l'argument de cash-and-carry à l'électricité, qui ne se stocke pas.
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Pourquoi le forward vaut-il $Se^{rT}$ ? Et avec des dividendes ? »** Cash-and-carry dans les deux sens, en trente secondes. Puis la différence forward-futures.
- **« Démontre la parité call-put. »** Flux identiques, loi du prix unique. Puis : « que se passe-t-il pour des américaines ? ».
- **« Pourquoi n'exerce-t-on jamais un call américain sans dividende ? »** $C \ge S - Ke^{-r(T-t)} > S - K$ : l'option vaut plus vivante que morte.
- **« Price ce call dans un arbre à une période. Pourquoi la probabilité de hausse ne compte-t-elle pas ? »** Réplication, $\Delta$, $q$, et l'argument du prix de l'action qui contient déjà $p$. Question quasi systématique en salle de marché.
- **« Qu'est-ce que la probabilité risque-neutre ? »** La probabilité sous laquelle les prix actualisés sont des martingales ; elle existe si et seulement s'il n'y a pas d'arbitrage, elle est unique si le marché est complet.
- **« Énonce Girsanov. Qu'est-ce qui change, qu'est-ce qui ne change pas ? »** La dérive change, la volatilité non. Exemple : passer de $\mu$ à $r$.
- **« Que représentent $N(d_1)$ et $N(d_2)$ ? »** Probabilités d'exercice sous deux numéraires ; $N(d_1)$ est aussi le delta.
:::
