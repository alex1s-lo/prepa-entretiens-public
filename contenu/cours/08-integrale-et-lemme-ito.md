---
titre: L'intégrale d'Itô et le lemme d'Itô
partie: Calcul stochastique
resume: Pourquoi il faut une nouvelle intégrale, comment on la construit, ses deux propriétés clés (espérance nulle, isométrie), puis le lemme d'Itô démontré et appliqué pas à pas à une dizaine de cas classiques, avec la méthode pour trouver des martingales et calculer des espérances.
duree: 4 h
fiches: stoch-ito-carre stoch-integrale-w-dw stoch-isometrie stoch-integrale-temps stoch-integrale-carre stoch-w-cube stoch-martingale-exponentielle stoch-esperance-exponentielle stoch-moment-quatre stoch-ito-stratonovich stoch-ito-produit stoch-gbm stoch-variation-quadratique stoch-discretisation-euler
---
C'est le chapitre central du calcul stochastique, et celui que les intervieweurs de banque testent le plus : « applique Itô à… », « montre que … est une martingale », « calcule $\int_0^T W\,dW$ ». Tout repose sur une seule idée, vue au chapitre [[n:mouvement-brownien]] : $(dW)^2 = dt$. On va lentement. Chaque calcul est fait ligne à ligne, et tu peux vérifier le lemme d'Itô sur une simulation.

## Pourquoi une nouvelle intégrale

En finance, on veut écrire le **gain d'une stratégie** : on détient une quantité $H_t$ d'un actif dont le prix bouge de $dW_t$. Sur une grille de dates $t_0 < t_1 < \dots < t_n$, si l'on choisit sa position $H_{t_k}$ au début de chaque intervalle, le gain cumulé est
$$
G = \sum_{k=0}^{n-1} H_{t_k}\big(W_{t_{k+1}} - W_{t_k}\big).
$$
On aimerait faire tendre le pas vers 0 et appeler la limite $\int_0^T H_t\,dW_t$. Deux difficultés :

1. Les trajectoires de $W$ ont une **variation totale infinie** (chapitre [[n:mouvement-brownien]]) : la théorie de l'intégrale de Stieltjes, qui marche pour les fonctions à variation bornée, ne s'applique pas trajectoire par trajectoire.
2. **Le point où l'on évalue $H$ compte.** Pour une intégrale ordinaire, prendre $H$ au début, au milieu ou à la fin de l'intervalle donne la même limite. Ici non, à cause de la variation quadratique : l'écart entre deux choix est de l'ordre de $\sum (\Delta W)^2 \to T$, qui ne disparaît pas.

:::intuition Le choix d'Itô : évaluer au début de l'intervalle
Itô évalue l'intégrande au **début** de chaque intervalle. C'est le seul choix qui a un sens financier : une position doit être décidée **avant** le mouvement de prix, avec l'information disponible. Un intégrande qui ne regarde pas le futur est dit **adapté** (ou non anticipant). Ce choix donne à l'intégrale sa propriété fondamentale : c'est une martingale, son espérance est nulle. On ne gagne rien en moyenne à trader un actif qui n'a pas de dérive.
:::

## Construction et propriétés

:::definition Intégrale d'un processus simple
Un processus simple est constant par morceaux : $H_t = H_k$ pour $t \in [t_k, t_{k+1}[$, où chaque $H_k$ est connu au temps $t_k$ (fonction de $(W_s)_{s \le t_k}$) et de carré intégrable. On pose
$$
\int_0^T H_t\,dW_t = \sum_{k=0}^{n-1} H_k\,\big(W_{t_{k+1}} - W_{t_k}\big).
$$
:::

:::theoreme Espérance nulle et isométrie d'Itô
Pour un processus simple $H$ :
$$
\mathbb{E}\left[\int_0^T H_t\,dW_t\right] = 0, \qquad \mathbb{E}\left[\left(\int_0^T H_t\,dW_t\right)^2\right] = \mathbb{E}\left[\int_0^T H_t^2\,dt\right].
$$
:::

:::preuve
Notons $\Delta_k = W_{t_{k+1}} - W_{t_k}$ et $h_k = t_{k+1} - t_k$. Le point clé : $\Delta_k$ est **indépendant** de tout ce qui est connu au temps $t_k$, en particulier de $H_k$, et de $H_j, \Delta_j$ pour $j < k$.

**Espérance** : $\mathbb{E}[H_k\Delta_k] = \mathbb{E}[H_k]\,\mathbb{E}[\Delta_k] = 0$ pour chaque $k$ ; on somme.

**Isométrie** : développons le carré de la somme :
$$
\Big(\sum_k H_k\Delta_k\Big)^2 = \sum_k H_k^2\Delta_k^2 + 2\sum_{j < k} H_jH_k\,\Delta_j\Delta_k.
$$
- Termes diagonaux : $\mathbb{E}[H_k^2\Delta_k^2] = \mathbb{E}[H_k^2]\,\mathbb{E}[\Delta_k^2] = \mathbb{E}[H_k^2]\,h_k$ (indépendance de $\Delta_k$ et $H_k$).
- Termes croisés, $j < k$ : $H_j$, $H_k$ et $\Delta_j$ sont connus au temps $t_k$, et $\Delta_k$ est indépendant d'eux : $\mathbb{E}[H_jH_k\Delta_j\Delta_k] = \mathbb{E}[H_jH_k\Delta_j]\,\mathbb{E}[\Delta_k] = 0$.

Il reste $\sum_k \mathbb{E}[H_k^2]\,h_k = \mathbb{E}\big[\int_0^T H_t^2\,dt\big]$.
:::

:::theoreme Extension (admis)
Pour tout processus adapté $H$ tel que $\mathbb{E}\int_0^T H_t^2\,dt < \infty$, on peut approcher $H$ par des processus simples ; grâce à l'isométrie, les intégrales correspondantes forment une suite de Cauchy dans $L^2$ et convergent. La limite définit $\int_0^T H_t\,dW_t$, qui vérifie :
1. **linéarité** en $H$ ;
2. $\mathbb{E}\left[\int_0^T H\,dW\right] = 0$ et l'**isométrie** $\mathbb{E}\left[\left(\int_0^T H\,dW\right)^2\right] = \mathbb{E}\int_0^T H^2\,dt$ ;
3. plus généralement $\mathbb{E}\left[\int_0^T H\,dW \int_0^T K\,dW\right] = \mathbb{E}\int_0^T H_tK_t\,dt$ ;
4. $t \mapsto \int_0^t H\,dW$ est une **martingale** continue ;
5. si $H$ est **déterministe** (une fonction $f(t)$), $\int_0^T f(t)\,dW_t \sim \mathcal{N}\left(0, \int_0^T f(t)^2\,dt\right)$.
:::

La propriété 5 vient de ce que, pour $f$ déterministe, l'intégrale est une limite de combinaisons linéaires d'accroissements gaussiens indépendants, donc gaussienne.

:::exemple Calculs immédiats avec l'isométrie
- $\int_0^1 t\,dW_t \sim \mathcal{N}\left(0, \int_0^1 t^2\,dt\right) = \mathcal{N}(0, 1/3)$ ([[fiche:stoch-isometrie]]).
- $\operatorname{Var}\left(\int_0^T W_t\,dW_t\right) = \mathbb{E}\int_0^T W_t^2\,dt = \int_0^T t\,dt = T^2/2$. Ici l'intégrale n'est **pas** gaussienne (on verra qu'elle vaut $(W_T^2 - T)/2$).
- $\operatorname{Cov}\left(\int_0^1 t\,dW_t,\ W_1\right) = \operatorname{Cov}\left(\int_0^1 t\,dW_t, \int_0^1 1\,dW_t\right) = \int_0^1 t\,dt = \frac12$, par la propriété 3 (car $W_1 = \int_0^1 dW$).
:::

:::exercice ex-ito-isometrie
reponse: 8/3
Quelle est la variance de $\int_0^2 t\,dW_t$ ?
---
$f(t) = t$ est déterministe : l'intégrale est gaussienne centrée de variance $\int_0^2 t^2\,dt = \frac{8}{3}$.
:::

:::exercice ex-ito-covariance
reponse: 1/2
Calcule $\operatorname{Cov}\left(\int_0^1 t\,dW_t,\ W_1\right)$.
---
$W_1 = \int_0^1 1\,dW_t$, donc par l'isométrie généralisée $\operatorname{Cov} = \int_0^1 t \times 1\,dt = \frac12$. Corrélation : $\frac{1/2}{\sqrt{1/3}\times 1} = \frac{\sqrt3}{2} \approx 0{,}87$.
:::

## Le calcul fondamental : ∫ W dW

:::theoreme
$$
\int_0^T W_t\,dW_t = \frac{W_T^2 - T}{2}.
$$
:::

:::preuve Par les sommes de Riemann
Sur une subdivision $0 = t_0 < \dots < t_n = T$, notons $W_k = W_{t_k}$. On utilise l'identité algébrique, valable pour tous réels $a, b$ :
$$
a(b - a) = \tfrac12\left(b^2 - a^2\right) - \tfrac12(b - a)^2.
$$
(Vérification : le membre de droite vaut $\frac12(b - a)(b + a) - \frac12(b-a)^2 = \frac12(b-a)\big((b+a) - (b-a)\big) = a(b - a)$.) En l'appliquant à chaque terme avec $a = W_k$, $b = W_{k+1}$ :
$$
\sum_{k=0}^{n-1} W_k(W_{k+1} - W_k) = \frac12\sum_k \left(W_{k+1}^2 - W_k^2\right) - \frac12\sum_k (W_{k+1} - W_k)^2 = \frac12\left(W_T^2 - W_0^2\right) - \frac12\,Q_n.
$$
La première somme est télescopique et vaut $W_T^2/2$. La seconde est la variation quadratique, qui tend vers $T$ (chapitre [[n:mouvement-brownien]]). D'où la limite $\frac{W_T^2 - T}{2}$.
:::

:::intuition Le −T/2 est le terme d'Itô
En calcul ordinaire, $\int_0^T w\,dw = w^2/2$. Le terme supplémentaire $-T/2$ vient exclusivement de la variation quadratique. Il garantit que l'intégrale est d'espérance nulle : $\mathbb{E}[(W_T^2 - T)/2] = (T - T)/2 = 0$, alors que $W_T^2/2$ a pour espérance $T/2$.

Avec l'intégrande évalué au **milieu** de chaque intervalle (intégrale de Stratonovich), le terme de variation quadratique disparaît et on retrouve $W_T^2/2$. Fiches : [[fiche:stoch-integrale-w-dw]], [[fiche:stoch-ito-stratonovich]].
:::

## Processus d'Itô

:::definition Processus d'Itô
Un processus d'Itô est un processus de la forme
$$
X_t = X_0 + \int_0^t \mu_s\,ds + \int_0^t \sigma_s\,dW_s, \quad \text{noté} \quad dX_t = \mu_t\,dt + \sigma_t\,dW_t,
$$
où $\mu$ (la **dérive**) et $\sigma$ (la **volatilité**) sont des processus adaptés. La notation différentielle n'est qu'une abréviation de l'écriture intégrale.
:::

:::theoreme Variation quadratique et règles de calcul
La variation quadratique d'un processus d'Itô vaut $[X]_t = \int_0^t \sigma_s^2\,ds$, ce qu'on écrit $d[X]_t = (dX_t)^2 = \sigma_t^2\,dt$. Les règles de multiplication des différentielles sont :

| × | $dt$ | $dW_t$ |
|---|---|---|
| $dt$ | 0 | 0 |
| $dW_t$ | 0 | $dt$ |

Pour deux browniens $W$ et $B$ de corrélation $\rho$ : $dW_t\,dB_t = \rho\,dt$. Pour deux browniens indépendants : $dW\,dB = 0$.
:::

:::exemple Utiliser la table
Si $dX = \mu\,dt + \sigma\,dW$, alors
$$
(dX)^2 = \mu^2(dt)^2 + 2\mu\sigma\,dt\,dW + \sigma^2(dW)^2 = 0 + 0 + \sigma^2\,dt.
$$
**Seule la partie brownienne compte** dans la variation quadratique ; la dérive ne contribue pas. C'est pourquoi la volatilité se mesure sur les trajectoires (variance réalisée) alors que la dérive est très difficile à estimer.
:::

## Le lemme d'Itô

:::theoreme Lemme d'Itô
Soit $X$ un processus d'Itô, $dX_t = \mu_t\,dt + \sigma_t\,dW_t$, et $f(t, x)$ une fonction de classe $C^{1,2}$ (une fois dérivable en $t$, deux fois en $x$). Alors $Y_t = f(t, X_t)$ est un processus d'Itô et
$$
df(t, X_t) = \frac{\partial f}{\partial t}\,dt + \frac{\partial f}{\partial x}\,dX_t + \frac12\frac{\partial^2 f}{\partial x^2}\,(dX_t)^2,
$$
soit, en remplaçant $dX$ et $(dX)^2 = \sigma^2\,dt$ :
$$
df(t, X_t) = \left(\frac{\partial f}{\partial t} + \mu_t\frac{\partial f}{\partial x} + \frac12\sigma_t^2\frac{\partial^2 f}{\partial x^2}\right)dt + \sigma_t\frac{\partial f}{\partial x}\,dW_t.
$$
Cas le plus simple, $X = W$ et $f$ ne dépendant pas de $t$ : $df(W_t) = f'(W_t)\,dW_t + \frac12 f''(W_t)\,dt$.
:::

:::preuve Idée de la démonstration (cas $f(W_t)$)
Sur une subdivision fine, on écrit $f(W_T) - f(W_0)$ comme somme télescopique et on développe chaque terme par la formule de Taylor à l'ordre 2 :
$$
f(W_T) - f(W_0) = \sum_k \big(f(W_{k+1}) - f(W_k)\big) = \sum_k f'(W_k)\,\Delta_k + \frac12\sum_k f''(W_k)\,\Delta_k^2 + \sum_k R_k,
$$
avec un reste $\lvert R_k\rvert \le \varepsilon\,\Delta_k^2$ où $\varepsilon$ est petit quand le pas est petit (continuité uniforme de $f''$ sur l'ensemble borné parcouru par la trajectoire).

- Le premier terme est une somme de Riemann d'Itô : il tend vers $\int_0^T f'(W_t)\,dW_t$.
- Le deuxième tend vers $\frac12\int_0^T f''(W_t)\,dt$ : c'est la même preuve que la variation quadratique, avec des poids. On compare $\sum f''(W_k)\Delta_k^2$ à $\sum f''(W_k)h_k$ ; la différence $\sum f''(W_k)(\Delta_k^2 - h_k)$ est une somme de termes centrés non corrélés de variance $\mathbb{E}[f''(W_k)^2]\,2h_k^2$, qui tend vers 0.
- Le reste est majoré par $\varepsilon\sum\Delta_k^2 \approx \varepsilon T \to 0$.

En calcul ordinaire, le terme d'ordre 2 disparaît car $\sum (\Delta x)^2 \to 0$ pour une fonction régulière. Ici, $\sum \Delta_k^2 \to T$ : **le terme d'ordre 2 survit**, et c'est tout le lemme d'Itô.
:::

:::widget ito
:::

:::methode Appliquer Itô en quatre étapes
1. **Identifier** $X$ (souvent $W$ ou $S$), sa dérive $\mu$ et sa volatilité $\sigma$, et la fonction $f(t, x)$.
2. **Calculer** les trois dérivées $f_t$, $f_x$, $f_{xx}$.
3. **Écrire** $df = f_t\,dt + f_x\,dX + \frac12 f_{xx}\,(dX)^2$ et remplacer $(dX)^2 = \sigma^2\,dt$.
4. **Regrouper** les termes en $dt$ (la dérive) et en $dW$ (la partie martingale).
:::

## Dix applications, pas à pas

:::exemple 1. Le carré du brownien
$f(x) = x^2$ : $f' = 2x$, $f'' = 2$. Donc $d(W_t^2) = 2W_t\,dW_t + \frac12 \cdot 2\,dt = 2W_t\,dW_t + dt$. En intégrant : $W_T^2 = 2\int_0^T W\,dW + T$, ce qui redonne $\int_0^T W\,dW = (W_T^2 - T)/2$. Et $d(W_t^2 - t) = 2W_t\,dW_t$ : pas de $dt$, c'est une martingale ([[fiche:stoch-ito-carre]]).
:::

:::exemple 2. Le cube
$f(x) = x^3$ : $f' = 3x^2$, $f'' = 6x$. $d(W_t^3) = 3W_t^2\,dW_t + 3W_t\,dt$. Le terme $3W_t\,dt$ n'est pas nul : $W^3$ n'est pas une martingale. Pour le compenser, on cherche un terme $g(t, W_t)$ dont le $dt$ vaut $-3W_t\,dt$ : avec $g = -3tW_t$, $dg = -3W_t\,dt - 3t\,dW_t$ (règle du produit, $t$ déterministe). Donc
$$
d\big(W_t^3 - 3tW_t\big) = (3W_t^2 - 3t)\,dW_t,
$$
une martingale ([[fiche:stoch-w-cube]]).
:::

:::exemple 3. L'exponentielle et la martingale exponentielle
$f(t, x) = e^{\theta x - \frac12\theta^2 t}$ : $f_t = -\frac12\theta^2 f$, $f_x = \theta f$, $f_{xx} = \theta^2 f$. Pour $X = W$ ($\mu = 0$, $\sigma = 1$) :
$$
df = \left(-\tfrac12\theta^2 f + \tfrac12\theta^2 f\right)dt + \theta f\,dW_t = \theta f\,dW_t.
$$
Les deux termes en $dt$ s'annulent exactement : le $-\frac12\theta^2 t$ dans l'exposant est **précisément** la correction qui compense le terme d'Itô. $M_t = e^{\theta W_t - \theta^2 t/2}$ est une martingale ([[fiche:stoch-martingale-exponentielle]]). Sans correction, $d(e^{\theta W}) = \theta e^{\theta W}\,dW + \frac12\theta^2 e^{\theta W}\,dt$.
:::

:::exemple 4. Le produit t·W (règle du produit)
Pour deux processus d'Itô, $d(XY) = X\,dY + Y\,dX + dX\,dY$ (c'est Itô appliqué à $f(x, y) = xy$, dont la seule dérivée seconde non nulle est $f_{xy} = 1$). Avec $X = t$ et $Y = W$ : $dX\,dY = dt\,dW = 0$, donc $d(tW_t) = W_t\,dt + t\,dW_t$. En intégrant sur $[0, T]$ :
$$
TW_T = \int_0^T W_t\,dt + \int_0^T t\,dW_t \implies \int_0^T W_t\,dt = \int_0^T (T - t)\,dW_t.
$$
L'aire sous le brownien est donc gaussienne de variance $\int_0^T (T - t)^2\,dt = T^3/3$ ([[fiche:stoch-integrale-temps]], [[fiche:stoch-ito-produit]]).
:::

:::exemple 5. Le logarithme d'un brownien géométrique
$dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, donc $(dS)^2 = \sigma^2S_t^2\,dt$. Avec $f(x) = \ln x$ : $f' = 1/x$, $f'' = -1/x^2$.
$$
d\ln S_t = \frac{dS_t}{S_t} - \frac12\frac{(dS_t)^2}{S_t^2} = \mu\,dt + \sigma\,dW_t - \frac12\sigma^2\,dt = \left(\mu - \tfrac12\sigma^2\right)dt + \sigma\,dW_t.
$$
Le second membre ne dépend plus de $S$ : on intègre directement, $\ln S_T = \ln S_0 + (\mu - \frac12\sigma^2)T + \sigma W_T$. C'est la résolution du brownien géométrique ([[fiche:stoch-gbm]]). Le $-\frac12\sigma^2$ est le terme d'Itô : le rendement logarithmique moyen est inférieur au rendement arithmétique.
:::

:::exemple 6. Le carré d'un prix
$f(x) = x^2$ appliqué à $S$ : $d(S^2) = 2S\,dS + (dS)^2 = 2S(\mu S\,dt + \sigma S\,dW) + \sigma^2S^2\,dt = (2\mu + \sigma^2)S^2\,dt + 2\sigma S^2\,dW$. Donc $S^2$ est lui-même un brownien géométrique de dérive $2\mu + \sigma^2$ et de volatilité $2\sigma$, et $\mathbb{E}[S_T^2] = S_0^2e^{(2\mu + \sigma^2)T}$ ([[fiche:der-option-carre]] pour la version risque-neutre).
:::

:::exemple 7. L'inverse d'un prix
$f(x) = 1/x$ : $f' = -1/x^2$, $f'' = 2/x^3$. $d(1/S) = -\frac{dS}{S^2} + \frac{(dS)^2}{S^3} = \frac{1}{S}\left(-\mu\,dt - \sigma\,dW + \sigma^2\,dt\right) = \frac1S\left((\sigma^2 - \mu)\,dt - \sigma\,dW\right)$. Si $S$ est un taux de change EUR/USD de dérive nulle, $1/S$ (USD/EUR) a une dérive $+\sigma^2$ : sous une même probabilité, un taux de change et son inverse ne peuvent pas être tous deux des martingales (sauf si $\sigma = 0$ ; c'est l'inégalité de Jensen, $\mathbb{E}[1/S_T] > 1/\mathbb{E}[S_T]$). C'est le **paradoxe de Siegel**. Il n'y a pas de contradiction en valorisation, car chaque devise a sa propre probabilité risque-neutre ; le même effet de convexité réapparaît dans les ajustements de quanto.
:::

:::exemple 8. Un processus actualisé
$\tilde S_t = e^{-rt}S_t$. Règle du produit avec $d(e^{-rt}) = -re^{-rt}\,dt$ (déterministe, donc $d(e^{-rt})\,dS = 0$) :
$$
d\tilde S_t = e^{-rt}\,dS_t - re^{-rt}S_t\,dt = \tilde S_t\big((\mu - r)\,dt + \sigma\,dW_t\big).
$$
Le prix actualisé est une martingale si et seulement si $\mu = r$ : c'est le point de départ de la valorisation risque-neutre (chapitre [[n:arbitrage-et-risque-neutre]]).
:::

:::exemple 9. Calculer un moment grâce à Itô
Calculons $m(t) = \mathbb{E}[W_t^4]$ sans connaître la loi. $d(W^4) = 4W^3\,dW + \frac12 \cdot 12W^2\,dt = 4W^3\,dW + 6W^2\,dt$. On intègre et on prend l'espérance ; l'intégrale stochastique a une espérance nulle :
$$
\mathbb{E}[W_t^4] = 6\int_0^t \mathbb{E}[W_s^2]\,ds = 6\int_0^t s\,ds = 3t^2.
$$
Même méthode pour $\mathbb{E}[e^{\theta W_t}]$ : $d(e^{\theta W}) = \theta e^{\theta W}dW + \frac12\theta^2e^{\theta W}dt$ donne $m'(t) = \frac12\theta^2 m(t)$, $m(0) = 1$, donc $m(t) = e^{\theta^2t/2}$ ([[fiche:stoch-moment-quatre]], [[fiche:stoch-esperance-exponentielle]]).
:::

:::exemple 10. Deux browniens corrélés
$W$ et $B$ de corrélation $\rho$ : $d(W_tB_t) = W\,dB + B\,dW + dW\,dB = W\,dB + B\,dW + \rho\,dt$. Donc $\mathbb{E}[W_tB_t] = \rho t$ et $W_tB_t - \rho t$ est une martingale. Pour un ratio de prix $X/Y$ (deux browniens géométriques corrélés), Itô à deux variables donne une volatilité $\sqrt{\sigma_X^2 + \sigma_Y^2 - 2\rho\sigma_X\sigma_Y}$ : c'est la volatilité de la formule de Margrabe ([[fiche:der-margrabe]]).
:::

:::theoreme Lemme d'Itô en plusieurs dimensions
Pour $X = (X^1, \dots, X^n)$ des processus d'Itô et $f(t, x)$ de classe $C^{1,2}$ :
$$
df(t, X_t) = \frac{\partial f}{\partial t}dt + \sum_i \frac{\partial f}{\partial x_i}dX^i_t + \frac12\sum_{i,j}\frac{\partial^2 f}{\partial x_i\partial x_j}\,dX^i_t\,dX^j_t,
$$
où les produits $dX^i\,dX^j$ se calculent avec la table ($dW^i\,dW^j = \rho_{ij}\,dt$). C'est la formule de Taylor à l'ordre 2 où l'on garde tous les termes d'ordre $dt$.
:::

## Trouver une martingale, calculer une espérance

:::methode Le réflexe « terme en dt nul »
Un processus d'Itô $dY = a_t\,dt + b_t\,dW_t$ (avec $b$ raisonnable) est une martingale **si et seulement si** sa dérive $a_t$ est nulle. Pour trouver une martingale de la forme $f(t, W_t)$, on écrit Itô et on impose
$$
\frac{\partial f}{\partial t} + \frac12\frac{\partial^2 f}{\partial x^2} = 0
$$
(l'équation de la chaleur rétrograde). Pour une diffusion $dX = \mu\,dt + \sigma\,dW$, la condition devient $f_t + \mu f_x + \frac12\sigma^2 f_{xx} = 0$. C'est l'équation de Black-Scholes une fois la dérive réelle remplacée par la dérive risque-neutre ($rS$ pour $X = S$) et l'actualisation ajoutée (terme $-rf$) : $f_t + rSf_S + \frac12\sigma^2S^2f_{SS} - rf = 0$, où $\mu$ n'apparaît pas (chapitre [[n:black-scholes]]).
:::

:::exemple Trouver la martingale polynomiale de degré 4
On cherche $f(t, x) = x^4 + a\,t\,x^2 + b\,t^2$ avec $f_t + \frac12 f_{xx} = 0$. On a $f_t = ax^2 + 2bt$ et $f_{xx} = 12x^2 + 2at$, donc
$$
f_t + \tfrac12 f_{xx} = ax^2 + 2bt + 6x^2 + at = (a + 6)x^2 + (2b + a)t = 0 \implies a = -6,\ b = 3.
$$
$W_t^4 - 6tW_t^2 + 3t^2$ est une martingale (c'est un polynôme d'Hermite). En prenant l'espérance : $\mathbb{E}[W_t^4] = 6t\cdot t - 3t^2 = 3t^2$, cohérent.
:::

:::exercice ex-ito-moment-six
reponse: 120
Utilise Itô pour calculer $\mathbb{E}[W_2^6]$ à partir de $\mathbb{E}[W_s^4] = 3s^2$.
---
$d(W^6) = 6W^5\,dW + \frac12 \cdot 30W^4\,dt = 6W^5\,dW + 15W^4\,dt$. En prenant l'espérance :
$$
\mathbb{E}[W_t^6] = 15\int_0^t 3s^2\,ds = 15t^3.
$$
Pour $t = 2$ : $15 \times 8 = 120$. Cohérent avec $\mathbb{E}[Z^6] = 15$ et $W_t = \sqrt t\,Z$.
:::

:::exercice ex-ito-exponentielle
reponse: exp(2)
Calcule $\mathbb{E}[e^{2W_1}]$ en écrivant l'équation différentielle vérifiée par $m(t) = \mathbb{E}[e^{2W_t}]$.
---
$d(e^{2W}) = 2e^{2W}\,dW + \frac12 \cdot 4e^{2W}\,dt$, donc $m'(t) = 2m(t)$ avec $m(0) = 1$ : $m(t) = e^{2t}$ et $m(1) = e^2 \approx 7{,}39$. (Formule générale : $e^{\theta^2 t/2}$ avec $\theta = 2$.)
:::

:::exercice ex-ito-aire
reponse: 8/3
Quelle est la variance de $\int_0^2 W_t\,dt$ ?
---
Par l'exemple 4, $\int_0^T W_t\,dt = \int_0^T (T - t)\,dW_t$, gaussienne de variance $\int_0^T (T-t)^2\,dt = T^3/3$. Pour $T = 2$ : $8/3$. Vérification directe : $\iint_{[0,2]^2}\min(s,t)\,ds\,dt = 8/3$.
:::

:::exercice ex-ito-variance-wdw
reponse: 2
Calcule $\operatorname{Var}\left(\int_0^2 W_t\,dW_t\right)$ de deux façons : par l'isométrie, puis avec la formule $(W_2^2 - 2)/2$.
---
**Isométrie** : $\mathbb{E}\int_0^2 W_t^2\,dt = \int_0^2 t\,dt = 2$.

**Formule** : $\operatorname{Var}\left(\frac{W_2^2 - 2}{2}\right) = \frac14\operatorname{Var}(W_2^2) = \frac14\left(\mathbb{E}[W_2^4] - \mathbb{E}[W_2^2]^2\right) = \frac14(3 \times 4 - 4) = 2$. Les deux méthodes concordent.
:::

## Pièges classiques

:::attention Les erreurs qui coûtent un entretien
- **Oublier le terme ½ f″ (dX)²**, c'est-à-dire faire du calcul ordinaire. Vérifie toujours : « y a-t-il un terme en $dt$ qui vient de la dérivée seconde ? »
- **Écrire (dX)² = σ² dW² sans le remplacer par σ² dt**, ou garder un terme en $dW\,dt$.
- **Oublier la dérive de X dans le terme en f′** : $f_x\,dX = f_x\mu\,dt + f_x\sigma\,dW$.
- **Dire « espérance nulle » pour une intégrale dont l'intégrande regarde le futur** : $\mathbb{E}\int H\,dW = 0$ exige $H$ adapté (et de carré intégrable).
- **Confondre « espérance constante » et « martingale »** (exemple de $W^3$).
- **Utiliser Stratonovich sans le dire** : en finance, toutes les intégrales sont d'Itô.
:::

:::entretien Ce que l'intervieweur veut voir
« Applique le lemme d'Itô à $f(W_t)$ » : écris d'abord la formule générale $df = f_t\,dt + f_x\,dX + \frac12 f_{xx}(dX)^2$, calcule les dérivées à voix haute, puis simplifie avec $(dW)^2 = dt$. Si on te demande **pourquoi** il y a un terme en plus, réponds par la variation quadratique : $\sum(\Delta W)^2 \to t$ alors que pour une fonction dérivable cette somme tend vers 0. Et pour « montre que … est une martingale » : applique Itô et montre que le terme en $dt$ est nul.
:::
