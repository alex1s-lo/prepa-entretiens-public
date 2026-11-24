---
titre: Le modèle de Black-Scholes
partie: Pricing
resume: Les hypothèses, puis trois démonstrations complètes de la formule (l'EDP par couverture en delta, sa réduction à l'équation de la chaleur, le calcul direct de l'espérance par complétion du carré), le delta, les cas limites, l'approximation à la monnaie à connaître par cœur et les variantes (dividendes, Black-76, Bachelier).
duree: 3 h
fiches: der-formule-bs der-hypotheses-bs der-edp-bs der-approx-atm der-delta-atm der-parite-call-put der-straddle-vol-implicite der-proba-exercice der-sensibilite-taux-dividendes der-forward-dividende stoch-feynman-kac stoch-gbm der-black76
---
Savoir **dériver Black-Scholes** est le minimum attendu pour un poste de pricing ou de recherche quantitative en banque, et la question tombe aussi chez les fonds. On te demandera l'une des deux dérivations (par l'EDP ou par l'espérance), parfois les deux, puis des questions de bon sens sur la formule. Ce chapitre fait tous les calculs, sans sauter de ligne.

## Les hypothèses

:::definition Le modèle
- Le sous-jacent suit un **brownien géométrique** : $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, avec $\sigma$ **constant** et connu.
- Le taux sans risque $r$ est **constant** ; on peut prêter et emprunter à ce taux.
- Pas de dividende (on les ajoute plus bas), pas de coût de transaction, pas de contrainte sur la vente à découvert, actifs divisibles.
- On peut trader **en continu**.
- Pas d'arbitrage.
:::

:::attention Ce qui est faux dans ces hypothèses (et qu'on te demandera)
La volatilité n'est pas constante (le **smile** en est la preuve), les rendements ont des **queues épaisses** et des sauts, on ne couvre pas en continu (erreur de couverture), il y a des coûts de transaction et des taux stochastiques. La formule reste l'outil standard parce qu'elle sert de **langage** : on cote les options en volatilité implicite ([[fiche:der-hypotheses-bs]]).
:::

## Première dérivation : l'EDP par couverture en delta

C'est la démonstration historique, et la plus demandée en banque, parce qu'elle explique **pourquoi** $\mu$ disparaît : on peut éliminer le risque.

:::theoreme EDP de Black-Scholes
Le prix $V(t, S)$ de toute option européenne vérifie
$$
\frac{\partial V}{\partial t} + rS\frac{\partial V}{\partial S} + \frac12\sigma^2S^2\frac{\partial^2V}{\partial S^2} - rV = 0,
$$
avec la condition finale $V(T, S) = g(S)$, le flux de l'option ([[fiche:der-edp-bs]]).
:::

:::preuve
**Étape 1 : la dynamique de l'option.** On suppose que le prix de l'option est une fonction régulière $V(t, S_t)$. Par Itô, avec $(dS)^2 = \sigma^2S^2\,dt$ :
$$
dV = \frac{\partial V}{\partial t}dt + \frac{\partial V}{\partial S}dS + \frac12\frac{\partial^2V}{\partial S^2}\sigma^2S^2\,dt.
$$
**Étape 2 : le portefeuille couvert.** On détient l'option et on vend $\Delta$ actions : $\Pi = V - \Delta S$. Sur un instant $dt$, à $\Delta$ fixé (on choisit la position avant le mouvement, comme dans l'intégrale d'Itô) :
$$
d\Pi = dV - \Delta\,dS = \left(\frac{\partial V}{\partial t} + \frac12\sigma^2S^2\frac{\partial^2V}{\partial S^2}\right)dt + \left(\frac{\partial V}{\partial S} - \Delta\right)dS.
$$
**Étape 3 : supprimer le risque.** Tout l'aléa est dans le terme en $dS$ (c'est lui qui contient $dW$). On choisit
$$
\Delta = \frac{\partial V}{\partial S}.
$$
Alors $d\Pi = \left(\frac{\partial V}{\partial t} + \frac12\sigma^2S^2\frac{\partial^2V}{\partial S^2}\right)dt$ : **il n'y a plus de $dW$**, le portefeuille est sans risque sur l'instant $dt$. Remarque : $\mu$ a disparu avec le terme en $dS$.

**Étape 4 : absence d'arbitrage.** Un portefeuille sans risque doit rapporter le taux sans risque, sinon on emprunterait pour l'acheter (ou l'inverse) : $d\Pi = r\Pi\,dt = r\left(V - S\frac{\partial V}{\partial S}\right)dt$.

**Étape 5 : on égalise.**
$$
\frac{\partial V}{\partial t} + \frac12\sigma^2S^2\frac{\partial^2V}{\partial S^2} = rV - rS\frac{\partial V}{\partial S},
$$
ce qui est l'EDP annoncée.
:::

:::intuition Lire l'EDP comme un bilan de PnL
Réécris-la avec les grecques $\Theta = \partial_t V$, $\Delta = \partial_S V$, $\Gamma = \partial_{SS}V$ :
$$
\Theta + \tfrac12\sigma^2S^2\,\Gamma = r\,(V - \Delta S).
$$
Avec $r = 0$ : $\Theta = -\frac12\sigma^2S^2\Gamma$. Un portefeuille couvert en delta et **long gamma** gagne sur les mouvements du sous-jacent ($\frac12\Gamma(dS)^2$) et le paie par l'érosion du temps ($\Theta < 0$). Si la volatilité réalisée égale $\sigma$, les deux s'annulent **en moyenne** : c'est le sens profond de l'EDP. Le chapitre suivant développe ce bilan.
:::

## Deuxième dérivation : réduire l'EDP à l'équation de la chaleur

:::theoreme Changement de variables
Posons $\tau = T - t$ (temps restant), $x = \ln S + (r - \frac12\sigma^2)\tau$ et $V(t, S) = e^{-r\tau}w(\tau, x)$. Alors $V$ vérifie l'EDP de Black-Scholes si et seulement si
$$
\frac{\partial w}{\partial\tau} = \frac12\sigma^2\frac{\partial^2w}{\partial x^2}, \qquad w(0, x) = g(e^x).
$$
:::

:::preuve
On calcule chaque dérivée de $V$ en fonction de celles de $w$. Comme $\tau$ et $x$ dépendent tous deux de $t$ ($\partial_t\tau = -1$, $\partial_t x = -(r - \frac12\sigma^2)$) :
$$
\frac{\partial V}{\partial t} = e^{-r\tau}\Big(rw - w_\tau - \big(r - \tfrac12\sigma^2\big)w_x\Big).
$$
Pour $S$ : $\partial_S x = 1/S$, donc
$$
\frac{\partial V}{\partial S} = e^{-r\tau}\,\frac{w_x}{S}, \qquad \frac{\partial^2V}{\partial S^2} = e^{-r\tau}\left(\frac{w_{xx}}{S^2} - \frac{w_x}{S^2}\right)
$$
(la seconde par la règle du produit appliquée à $w_x \cdot \frac1S$). On remplace dans l'EDP et on factorise $e^{-r\tau}$ :
$$
rw - w_\tau - \big(r - \tfrac12\sigma^2\big)w_x + r\,w_x + \tfrac12\sigma^2\big(w_{xx} - w_x\big) - rw = -w_\tau + \tfrac12\sigma^2w_{xx}.
$$
Les termes en $w$ se compensent ($rw - rw$), ceux en $w_x$ aussi ($-r + \frac12\sigma^2 + r - \frac12\sigma^2 = 0$). Il reste l'équation de la chaleur.
:::

:::theoreme Solution de l'équation de la chaleur
La solution de $w_\tau = \frac12\sigma^2w_{xx}$, $w(0, x) = h(x)$, est
$$
w(\tau, x) = \mathbb{E}\big[h(x + \sigma\sqrt\tau\,Z)\big] = \int h(x + \sigma\sqrt\tau\,z)\,\varphi(z)\,dz, \qquad Z \sim \mathcal{N}(0,1).
$$
:::

:::preuve Vérification
C'est Feynman-Kac (chapitre [[n:equations-differentielles-stochastiques]]) pour la diffusion $dX = \sigma\,dW$ ([[fiche:stoch-feynman-kac]]). On peut aussi vérifier directement : la densité $p(\tau, y) = \frac{1}{\sigma\sqrt{2\pi\tau}}e^{-y^2/(2\sigma^2\tau)}$ de $\sigma\sqrt\tau Z$ vérifie $p_\tau = \frac12\sigma^2p_{yy}$ (calcul de dérivées), et on dérive sous l'intégrale $w = \int h(x + y)p(\tau, y)\,dy$.
:::

En revenant aux variables de départ, $x + \sigma\sqrt\tau Z = \ln S + (r - \frac12\sigma^2)\tau + \sigma\sqrt\tau Z$ :
$$
V(t, S) = e^{-r\tau}\,\mathbb{E}\Big[g\Big(Se^{(r - \frac12\sigma^2)\tau + \sigma\sqrt\tau\,Z}\Big)\Big].
$$
C'est **l'espérance risque-neutre** du flux actualisé : sous $\mathbb{Q}$, $S_T = Se^{(r - \sigma^2/2)\tau + \sigma\sqrt\tau Z}$. Les deux points de vue (EDP et espérance) se rejoignent.

## Troisième dérivation : le calcul direct de l'espérance

C'est le calcul que l'on demande de faire **au tableau**. Il n'utilise qu'une technique : la complétion du carré.

:::theoreme Formule de Black-Scholes
$$
C = S_0N(d_1) - Ke^{-rT}N(d_2), \qquad P = Ke^{-rT}N(-d_2) - S_0N(-d_1),
$$
$$
d_1 = \frac{\ln(S_0/K) + (r + \frac12\sigma^2)T}{\sigma\sqrt T}, \qquad d_2 = d_1 - \sigma\sqrt T = \frac{\ln(S_0/K) + (r - \frac12\sigma^2)T}{\sigma\sqrt T}.
$$
:::

:::preuve
Sous $\mathbb{Q}$, $S_T = S_0e^{(r - \frac12\sigma^2)T + \sigma\sqrt T\,Z}$ avec $Z \sim \mathcal{N}(0,1)$, et $C = e^{-rT}\mathbb{E}[(S_T - K)^+]$.

**Étape 1 : la région d'exercice.** $S_T > K \iff \ln S_0 + (r - \frac12\sigma^2)T + \sigma\sqrt T Z > \ln K \iff Z > -d_2$.

**Étape 2 : on sépare.** $(S_T - K)^+ = S_T\mathbf{1}_{Z > -d_2} - K\mathbf{1}_{Z > -d_2}$, donc
$$
C = e^{-rT}\,\mathbb{E}\big[S_T\mathbf{1}_{Z > -d_2}\big] - Ke^{-rT}\,\mathbb{P}(Z > -d_2).
$$
**Étape 3 : le second terme.** Par symétrie de la gaussienne, $\mathbb{P}(Z > -d_2) = \mathbb{P}(Z < d_2) = N(d_2)$.

**Étape 4 : le premier terme.** On écrit l'espérance comme une intégrale :
$$
e^{-rT}\,\mathbb{E}\big[S_T\mathbf{1}_{Z > -d_2}\big] = e^{-rT}\int_{-d_2}^{\infty} S_0e^{(r - \frac12\sigma^2)T + \sigma\sqrt T z}\,\frac{e^{-z^2/2}}{\sqrt{2\pi}}\,dz = S_0\int_{-d_2}^{\infty}\frac{1}{\sqrt{2\pi}}\,e^{-\frac12\sigma^2T + \sigma\sqrt T z - \frac12z^2}\,dz.
$$
On complète le carré dans l'exposant : $-\frac12z^2 + \sigma\sqrt Tz - \frac12\sigma^2T = -\frac12\big(z - \sigma\sqrt T\big)^2$. Donc
$$
= S_0\int_{-d_2}^{\infty}\varphi\big(z - \sigma\sqrt T\big)\,dz = S_0\int_{-d_2 - \sigma\sqrt T}^{\infty}\varphi(u)\,du = S_0\,\mathbb{P}(Z > -d_1) = S_0N(d_1),
$$
avec le changement de variable $u = z - \sigma\sqrt T$ et $d_1 = d_2 + \sigma\sqrt T$.

**Le put** se déduit de la parité : $P = C - S_0 + Ke^{-rT} = Ke^{-rT}(1 - N(d_2)) - S_0(1 - N(d_1)) = Ke^{-rT}N(-d_2) - S_0N(-d_1)$.
:::

:::intuition Ce que disent les deux termes
- $Ke^{-rT}N(d_2)$ : on paie $K$ en $T$ **si** on exerce, ce qui arrive avec la probabilité risque-neutre $N(d_2)$ ([[fiche:der-proba-exercice]]).
- $S_0N(d_1)$ : la valeur actuelle de ce qu'on reçoit, l'action, **si** on exerce. Ce n'est pas $S_0N(d_2)$ parce que les scénarios d'exercice sont ceux où l'action vaut cher : l'action pèse plus dans ces scénarios. Le changement de numéraire du chapitre [[n:arbitrage-et-risque-neutre]] donne la même lecture.
:::

:::widget bs
:::

:::exercice ex-bs-call-atm
reponse: 100*(N(0.1)-N(-0.1))
tolerance: 0.001
$S_0 = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = 0$. Prix du call ?
---
$d_1 = \frac{0 + 0{,}02}{0{,}2} = 0{,}1$, $d_2 = -0{,}1$. $C = 100\big(N(0{,}1) - N(-0{,}1)\big) = 100\,(0{,}5398 - 0{,}4602) \approx 7{,}97$. L'approximation $0{,}4\,\sigma S\sqrt T = 8$ est excellente.
:::

:::exercice ex-bs-put
reponse: 110*exp(-0.015)*N(-((log(100/110)+(0.03-0.25**2/2)*0.5)/(0.25*sqrt(0.5))))-100*N(-((log(100/110)+(0.03+0.25**2/2)*0.5)/(0.25*sqrt(0.5))))
tolerance: 0.001
$S_0 = 100$, $K = 110$, $\sigma = 25\,\%$, $T = 6$ mois, $r = 3\,\%$. Prix du put ?
---
$\sigma\sqrt T = 0{,}25 \times 0{,}7071 = 0{,}1768$. $d_1 = \frac{\ln(100/110) + (0{,}03 + 0{,}03125) \times 0{,}5}{0{,}1768} = \frac{-0{,}0953 + 0{,}0306}{0{,}1768} \approx -0{,}366$ et $d_2 = d_1 - 0{,}1768 \approx -0{,}543$.

$P = 110e^{-0{,}015}N(0{,}543) - 100N(0{,}366) \approx 108{,}36 \times 0{,}7063 - 100 \times 0{,}6428 \approx 12{,}26$.

Contrôles : la borne inférieure sans arbitrage est $Ke^{-rT} - S_0 = 8{,}36$ et la valeur intrinsèque $K - S_0 = 10$ : le put vaut plus que les deux (valeur temps $\approx 2{,}26$) ; le call de même strike vaut $P + S_0 - Ke^{-rT} \approx 3{,}90$, cohérent avec la parité.
:::

## Le delta et une identité indispensable

:::propriete Une identité qui simplifie tous les calculs de grecques
$$
S_0\,\varphi(d_1) = Ke^{-rT}\,\varphi(d_2).
$$
:::

:::preuve
$\dfrac{\varphi(d_1)}{\varphi(d_2)} = e^{-\frac12(d_1^2 - d_2^2)} = e^{-\frac12(d_1 - d_2)(d_1 + d_2)}$. Or $d_1 - d_2 = \sigma\sqrt T$ et $d_1 + d_2 = \dfrac{2\ln(S_0/K) + 2rT}{\sigma\sqrt T}$. Le produit vaut $2\ln(S_0/K) + 2rT$, donc
$$
\frac{\varphi(d_1)}{\varphi(d_2)} = e^{-\ln(S_0/K) - rT} = \frac{Ke^{-rT}}{S_0}.
$$
:::

:::theoreme Delta du call
$$
\Delta = \frac{\partial C}{\partial S_0} = N(d_1).
$$
:::

:::preuve
$d_1$ et $d_2$ dépendent de $S_0$, avec $\frac{\partial d_1}{\partial S_0} = \frac{\partial d_2}{\partial S_0} = \frac{1}{S_0\sigma\sqrt T}$. En dérivant la formule :
$$
\frac{\partial C}{\partial S_0} = N(d_1) + S_0\varphi(d_1)\frac{\partial d_1}{\partial S_0} - Ke^{-rT}\varphi(d_2)\frac{\partial d_2}{\partial S_0} = N(d_1) + \frac{S_0\varphi(d_1) - Ke^{-rT}\varphi(d_2)}{S_0\sigma\sqrt T} = N(d_1),
$$
car le numérateur est nul par l'identité.
:::

:::attention Le delta à la monnaie n'est pas 0,5
À la monnaie ($S_0 = K$) et avec $r = 0$, $d_1 = \frac12\sigma\sqrt T > 0$, donc $\Delta = N(\frac12\sigma\sqrt T)$ est **légèrement supérieur à 0,5** (0,54 pour $\sigma = 20\,\%$, $T = 1$). Le delta vaut exactement 0,5 pour un strike un peu au-dessus du spot, $K = S_0e^{(r + \sigma^2/2)T}$ ([[fiche:der-delta-atm]]).
:::

:::exercice ex-bs-delta
reponse: N(0.1)
tolerance: 0.001
$S_0 = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = 0$. Delta du call ?
---
$\Delta = N(d_1) = N(0{,}1) \approx 0{,}540$.
:::

## Cas limites et ordres de grandeur

:::propriete Comportements à connaître (et à vérifier sur ta formule)
- **$\sigma \to 0$** : $S_T$ devient déterministe, égal au forward $S_0e^{rT}$. Le call tend vers $(S_0 - Ke^{-rT})^+$.
- **$T \to 0$** : le call tend vers sa valeur intrinsèque $(S_0 - K)^+$.
- **$\sigma \to \infty$** : $d_1 \to +\infty$, $d_2 \to -\infty$, donc $C \to S_0$ (la borne supérieure du chapitre [[n:arbitrage-et-risque-neutre]]).
- **$S_0 \to \infty$** : $C \approx S_0 - Ke^{-rT}$ (on est sûr d'exercer, le call est un forward). **$S_0 \to 0$** : $C \to 0$.
- Le prix est **croissant** en $S_0$, $\sigma$, $T$ (sans dividende) et $r$, **décroissant** en $K$ ([[fiche:der-sensibilite-taux-dividendes]]).
:::

:::theoreme Approximation à la monnaie
Pour $S_0 = K$, $r = 0$ et $\sigma\sqrt T$ petit,
$$
C = P \approx \frac{1}{\sqrt{2\pi}}\,\sigma S_0\sqrt T \approx 0{,}4\,\sigma S_0\sqrt T.
$$
Un straddle (call + put) à la monnaie vaut donc $\approx 0{,}8\,\sigma S_0\sqrt T$ ([[fiche:der-approx-atm]], [[fiche:der-straddle-vol-implicite]]).
:::

:::preuve
Avec $S_0 = K$ et $r = 0$, $d_1 = \frac12\sigma\sqrt T$ et $d_2 = -\frac12\sigma\sqrt T$, donc $C = S_0\big(N(\frac12\sigma\sqrt T) - N(-\frac12\sigma\sqrt T)\big)$. Au premier ordre, $N(\varepsilon) - N(-\varepsilon) \approx 2\varepsilon\,\varphi(0) = \frac{2\varepsilon}{\sqrt{2\pi}}$. Avec $\varepsilon = \frac12\sigma\sqrt T$ : $C \approx S_0\frac{\sigma\sqrt T}{\sqrt{2\pi}}$, et $\frac{1}{\sqrt{2\pi}} = 0{,}3989$. L'erreur relative est de l'ordre de $\sigma^2T/24$, négligeable en pratique.
:::

:::methode Calcul mental en entretien
- Convertir la maturité : $\sqrt{T}$ pour 1 mois $\approx 0{,}29$, 3 mois $= 0{,}5$, 6 mois $\approx 0{,}71$, 1 an $= 1$.
- Volatilité quotidienne : $\sigma/\sqrt{252} \approx \sigma/16$. Une vol de 16 % fait 1 % par jour.
- Call ATM 3 mois, vol 20 %, spot 100 : $0{,}4 \times 0{,}2 \times 100 \times 0{,}5 = 4$.
- Inversement, la **vol implicite** d'un straddle ATM coté $X$ : $\sigma \approx \dfrac{X}{0{,}8\,S_0\sqrt T}$.
:::

:::exercice ex-bs-approx
reponse: 100*(N(0.075)-N(-0.075))
tolerance: 0.01
$S_0 = K = 100$, $\sigma = 30\,\%$, $T = 3$ mois, $r = 0$. Donne d'abord l'approximation, puis le prix exact.
---
Approximation : $0{,}4 \times 0{,}3 \times 100 \times 0{,}5 = 6$. Exact : $d_1 = \frac12 \times 0{,}3 \times 0{,}5 = 0{,}075$, $C = 100\big(N(0{,}075) - N(-0{,}075)\big) \approx 5{,}98$.
:::

:::exercice ex-bs-straddle
reponse: 200*(N(0.04)-N(-0.04))
tolerance: 0.01
$S_0 = K = 100$, $\sigma = 16\,\%$, $T = 3$ mois, $r = 0$. Prix du straddle (call + put) ?
---
Par parité avec $r = 0$ et $K = S_0$, call et put ont le même prix. $d_1 = \frac12 \times 0{,}16 \times 0{,}5 = 0{,}04$ : straddle $= 200\big(N(0{,}04) - N(-0{,}04)\big) \approx 6{,}38$. Approximation : $0{,}8 \times 0{,}16 \times 100 \times 0{,}5 = 6{,}4$.
:::

:::exercice ex-bs-vol-implicite
reponse: 0.2006
tolerance: 0.0005
$S_0 = K = 100$, $T = 3$ mois, $r = 0$, le call cote 4. Quelle est la volatilité implicite ? (Donne-la à $10^{-3}$ près.)
---
L'approximation donne $\sigma \approx \frac{4}{0{,}4 \times 100 \times 0{,}5} = 0{,}20$. Exactement : $100\big(2N(\frac{\sigma}{4}) - 1\big) = 4$, donc $N(\frac\sigma4) = 0{,}52$, $\frac\sigma4 = N^{-1}(0{,}52) \approx 0{,}0502$ et $\sigma \approx 20{,}06\,\%$. L'approximation sous-estime à peine, parce que $\frac{1}{\sqrt{2\pi}} = 0{,}399 < 0{,}4$.
:::

## Variantes

:::propriete Dividendes, forwards, devises
- **Dividende continu $q$** (indice) : on remplace $S_0$ par $S_0e^{-qT}$ :
$$
C = S_0e^{-qT}N(d_1) - Ke^{-rT}N(d_2), \qquad d_{1,2} = \frac{\ln(S_0/K) + (r - q \pm \frac12\sigma^2)T}{\sigma\sqrt T}.
$$
- **Formule de Black (Black-76)**, sur le forward $F = S_0e^{(r - q)T}$ :
$$
C = e^{-rT}\big(FN(d_1) - KN(d_2)\big), \qquad d_{1,2} = \frac{\ln(F/K) \pm \frac12\sigma^2T}{\sigma\sqrt T}.
$$
C'est la forme utilisée sur les options sur futures (énergie, taux) et la plus propre : tout dépend du forward, de $K$ et de la **variance totale** $\sigma^2T$.
- **Devises (Garman-Kohlhagen)** : $q$ est le taux étranger.
:::

:::exemple Pourquoi « tout dépend du forward »
Dans Black-76, le taux et les dividendes n'entrent que par $F$ et par l'actualisation $e^{-rT}$. Un dividende plus élevé baisse le forward, donc le call ; un taux plus élevé monte le forward (effet positif sur le call) mais augmente l'actualisation (effet négatif) : l'effet du forward domine pour un call ([[fiche:der-forward-dividende]]).
:::

:::exercice ex-bs-dividende
reponse: exp(-0.03)*100*(N(0.1)-N(-0.1))
tolerance: 0.001
$S_0 = K = 100$, $\sigma = 20\,\%$, $T = 1$, $r = q = 3\,\%$. Prix du call ?
---
$F = 100e^{(0{,}03 - 0{,}03)} = 100 = K$ : on est à la monnaie forward. Black-76 : $C = e^{-0{,}03} \times 100\big(N(0{,}1) - N(-0{,}1)\big) \approx 0{,}9704 \times 7{,}966 \approx 7{,}73$.
:::

:::exercice ex-bs-black76
reponse: exp(-0.05)*50*(N(0.2)-N(-0.2))
tolerance: 0.001
Call sur un futures d'électricité : $F = K = 50$, $\sigma = 40\,\%$, $T = 1$, $r = 5\,\%$. Prix ?
---
$d_1 = \frac12 \times 0{,}4 = 0{,}2$, $d_2 = -0{,}2$. $C = e^{-0{,}05} \times 50 \times \big(N(0{,}2) - N(-0{,}2)\big) = 0{,}9512 \times 50 \times 0{,}1585 \approx 7{,}54$. Approximation : $e^{-0{,}05} \times 0{,}4 \times 0{,}4 \times 50 = 7{,}6$.
:::

:::propriete Le modèle de Bachelier (normal)
Si $S_T = S_0 + \sigma_n W_T$ (vol **absolue**, en euros par $\sqrt{\text{an}}$, avec $r = 0$) :
$$
C = (S_0 - K)\,N(d) + \sigma_n\sqrt T\,\varphi(d), \qquad d = \frac{S_0 - K}{\sigma_n\sqrt T}.
$$
À la monnaie, $C = \sigma_n\sqrt{T}\,\varphi(0) \approx 0{,}4\,\sigma_n\sqrt T$ : c'est **exactement** l'approximation de Black-Scholes avec $\sigma_n = \sigma S_0$. On l'utilise quand le sous-jacent peut devenir négatif (taux, spreads, électricité) ; la preuve est un exercice du chapitre [[n:lois-gaussiennes]].
:::

## Pièges classiques

:::attention Les erreurs qui coûtent cher
- Écrire $d_2 = d_1 + \sigma\sqrt T$ (c'est **moins**), ou $\ln(K/S_0)$ au lieu de $\ln(S_0/K)$. Contrôle : un call très dans la monnaie a $d_1, d_2 \to +\infty$.
- Croire que $\mu$ apparaît dans le prix. Il disparaît par la couverture (ou, de façon équivalente, par le changement de probabilité).
- Dire que $N(d_2)$ est la probabilité **réelle** d'exercice.
- Oublier que l'approximation $0{,}4\,\sigma S\sqrt T$ n'est valable qu'**à la monnaie** (forward).
- Dans la dérivation par l'EDP : oublier de dire **pourquoi** $\Delta$ est constant sur $dt$ (on choisit la position avant le mouvement) et pourquoi le portefeuille rapporte $r$ (absence d'arbitrage).
:::

## En entretien

:::entretien Questions typiques et réponses attendues
- **« Dérive l'équation de Black-Scholes. »** Les cinq étapes de la première preuve, en nommant Itô, le choix du delta et l'argument d'arbitrage.
- **« Calcule le prix d'un call sous la probabilité risque-neutre. »** La troisième preuve : région d'exercice, séparation, complétion du carré. Entraîne-toi à la faire en moins de cinq minutes sans regarder.
- **« Combien vaut un call à la monnaie un an, vol 20 % ? »** Environ 8 % du spot, et savoir dire d'où vient le 0,4.
- **« Quelles hypothèses sont fausses ? Que fait-on en pratique ? »** Smile, sauts, couverture discrète, coûts ; on utilise la formule comme convertisseur prix ↔ vol implicite et on modélise le smile (chapitre sur la volatilité).
- **« Pourquoi le prix ne dépend-il pas de $\mu$ ? »** Parce que l'option est réplicable par l'action et le cash ; tout désaccord sur $\mu$ est déjà dans le prix de l'action.
- **« Que valent $N(d_1)$ et $N(d_2)$ ? »** Le delta et la probabilité risque-neutre d'exercice ; $N(d_1)$ est aussi une probabilité d'exercice, sous la mesure où l'action sert de numéraire.
:::
