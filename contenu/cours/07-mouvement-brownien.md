---
titre: Le mouvement brownien
partie: Calcul stochastique
resume: De la marche aléatoire au brownien ; covariance, indépendance des accroissements et calculs d'espérances ; variation quadratique démontrée (d'où vient dW² = dt) ; martingales browniennes ; temps de sortie, principe de réflexion et pont brownien.
duree: 3 h
fiches: stoch-definition-brownien stoch-covariance stoch-variance-somme stoch-moment-quatre stoch-covariance-carre stoch-esperance-exponentielle stoch-variation-quadratique stoch-martingale-exponentielle stoch-w-cube stoch-sortie-intervalle stoch-temps-sortie stoch-reflexion stoch-temps-atteinte stoch-deux-instants-positifs stoch-pont-esperance stoch-pont-variance jeu-marche-aleatoire-sortie
---
Le mouvement brownien est la brique de base de toute la finance en temps continu : le prix d'une action, un taux court, une volatilité stochastique sont construits à partir de lui. Ce chapitre ne suppose que les chapitres [[n:esperance-variance-covariance]] à [[n:lois-gaussiennes]]. Le point clé à retenir : **presque tous les calculs sur le brownien se font en découpant en accroissements indépendants et gaussiens**. Le seul fait vraiment nouveau, la variation quadratique, est ce qui rendra le calcul d'Itô différent du calcul ordinaire.

## De la marche aléatoire au brownien

Prenons une marche aléatoire symétrique et accélérons-la : sur $[0, T]$, on fait $n$ pas de durée $\Delta t = T/n$, chacun valant $\pm\sqrt{\Delta t}$ avec probabilité $1/2$.

- Au temps $t = k\Delta t$, la position $W^{(n)}_t$ est une somme de $k$ pas indépendants de moyenne 0 et de variance $\Delta t$ : $\mathbb{E}[W^{(n)}_t] = 0$ et $\operatorname{Var}(W^{(n)}_t) = k\Delta t = t$.
- Par le théorème central limite, quand $n \to \infty$, $W^{(n)}_t$ devient gaussienne $\mathcal{N}(0, t)$.

:::intuition Pourquoi des pas en √Δt et non en Δt
Si les pas valaient $\pm\Delta t$, la variance au temps $t$ serait $k\Delta t^2 = t\,\Delta t \to 0$ : la limite serait constante. Avec des pas $\pm 1$, elle exploserait. Seul le choix $\sqrt{\Delta t}$ donne une limite aléatoire non triviale. Toute la « bizarrerie » du brownien vient de là : sur un intervalle court $\Delta t$, il se déplace d'environ $\sqrt{\Delta t}$, ce qui est **beaucoup plus** que $\Delta t$. Sa vitesse moyenne $\sqrt{\Delta t}/\Delta t = 1/\sqrt{\Delta t}$ explose quand $\Delta t \to 0$ : les trajectoires ne sont dérivables nulle part.
:::

:::widget brownien
:::

## Définition et premières propriétés

:::definition Mouvement brownien standard
Un processus $(W_t)_{t \ge 0}$ est un mouvement brownien standard si :
1. $W_0 = 0$ ;
2. pour $0 \le t_0 < t_1 < \dots < t_n$, les accroissements $W_{t_1} - W_{t_0}, \dots, W_{t_n} - W_{t_{n-1}}$ sont **indépendants** ;
3. pour $s < t$, $W_t - W_s \sim \mathcal{N}(0, t - s)$ (accroissements **stationnaires gaussiens**) ;
4. les trajectoires $t \mapsto W_t$ sont continues.
:::

:::methode Calculer avec un brownien
Pour calculer une espérance faisant intervenir $W$ à plusieurs dates $s < t$ :
1. écrire $W_t = W_s + (W_t - W_s)$ ;
2. utiliser que $W_t - W_s$ est **indépendant** de $W_s$ (et de tout le passé avant $s$), de loi $\mathcal{N}(0, t - s)$ ;
3. développer et utiliser $\mathbb{E}[XY] = \mathbb{E}[X]\mathbb{E}[Y]$ pour les facteurs indépendants.
:::

:::theoreme Covariance du brownien
Pour tous $s, t \ge 0$ : $\operatorname{Cov}(W_s, W_t) = \mathbb{E}[W_s W_t] = \min(s, t)$. Le brownien est un processus gaussien : tout vecteur $(W_{t_1}, \dots, W_{t_n})$ est un vecteur gaussien.
:::

:::preuve
Supposons $s \le t$. Par la méthode : $\mathbb{E}[W_sW_t] = \mathbb{E}\big[W_s(W_s + (W_t - W_s))\big] = \mathbb{E}[W_s^2] + \mathbb{E}[W_s]\,\mathbb{E}[W_t - W_s] = s + 0 = s$. Vecteur gaussien : $(W_{t_1}, \dots, W_{t_n})$ est une transformation linéaire (sommes partielles) du vecteur des accroissements, qui est gaussien à composantes indépendantes ; on applique la propriété 1 des vecteurs gaussiens (chapitre [[n:lois-gaussiennes]]).
:::

:::exemple Trois calculs typiques, détaillés
**1. Variance d'une somme.** $\operatorname{Var}(W_1 + W_2) = \operatorname{Var}(W_1) + \operatorname{Var}(W_2) + 2\operatorname{Cov}(W_1, W_2) = 1 + 2 + 2\times 1 = 5$ ([[fiche:stoch-variance-somme]]). Autre façon : $W_1 + W_2 = 2W_1 + (W_2 - W_1)$, somme de deux termes indépendants de variances $4$ et $1$.

**2. Espérance conditionnelle.** Pour $s < t$ : $\mathbb{E}[W_t^2 \mid \mathcal{F}_s] = \mathbb{E}\big[(W_s + \Delta)^2 \mid \mathcal{F}_s\big]$ avec $\Delta = W_t - W_s$ indépendant du passé :
$$
= W_s^2 + 2W_s\,\mathbb{E}[\Delta] + \mathbb{E}[\Delta^2] = W_s^2 + (t - s).
$$

**3. Un moment croisé.** $\mathbb{E}[W_1^2 W_2^2]$ : avec $\Delta = W_2 - W_1 \sim \mathcal{N}(0,1)$ indépendant de $W_1$,
$$
\mathbb{E}[W_1^2(W_1 + \Delta)^2] = \mathbb{E}[W_1^4] + 2\mathbb{E}[W_1^3]\mathbb{E}[\Delta] + \mathbb{E}[W_1^2]\mathbb{E}[\Delta^2] = 3 + 0 + 1 = 4.
$$
:::

:::exercice ex-bm-var-somme-trois
reponse: 14
Calcule $\operatorname{Var}(W_1 + W_2 + W_3)$.
---
Méthode 1, covariances : $\sum_i \operatorname{Var}(W_i) + 2\sum_{i<j}\min(i, j) = (1 + 2 + 3) + 2(1 + 1 + 2) = 6 + 8 = 14$.

Méthode 2, accroissements : avec $A = W_1$, $B = W_2 - W_1$, $C = W_3 - W_2$ (indépendants, variance 1 chacun), $W_1 + W_2 + W_3 = 3A + 2B + C$, de variance $9 + 4 + 1 = 14$. La méthode 2 est souvent plus sûre : plus de covariances à oublier.
:::

:::exercice ex-bm-moment-croise
reponse: 5
Calcule $\mathbb{E}[W_1^2 W_3^2]$.
---
$\Delta = W_3 - W_1 \sim \mathcal{N}(0, 2)$, indépendant de $W_1$ :
$$
\mathbb{E}[W_1^2(W_1 + \Delta)^2] = \mathbb{E}[W_1^4] + 2\,\mathbb{E}[W_1^3]\,\mathbb{E}[\Delta] + \mathbb{E}[W_1^2]\,\mathbb{E}[\Delta^2] = 3 + 0 + 1 \times 2 = 5.
$$
:::

:::exercice ex-bm-esperance-conditionnelle
reponse: 6
On observe $W_1 = 2$. Que vaut $\mathbb{E}[W_3^2 \mid W_1 = 2]$ ?
---
$\mathbb{E}[W_3^2 \mid \mathcal{F}_1] = W_1^2 + (3 - 1) = 4 + 2 = 6$ (deuxième calcul de l'exemple). Remarque : $\mathbb{E}[W_3 \mid W_1 = 2] = 2$, mais $\mathbb{E}[W_3^2 \mid W_1 = 2] \ne 2^2$ : l'incertitude restante ajoute sa variance.
:::

## Invariances

:::theoreme Propriétés d'invariance
Si $W$ est un brownien standard, les processus suivants le sont aussi :
1. **symétrie** : $(-W_t)$ ;
2. **changement d'échelle** : pour $c > 0$, $\left(\frac{1}{\sqrt c}W_{ct}\right)$ ;
3. **propriété de Markov** : pour un instant fixe $s$, $(W_{s+t} - W_s)_{t \ge 0}$, qui est de plus indépendant de $(W_u)_{u \le s}$ ; **propriété de Markov forte** : de même pour un temps d'arrêt $\tau$ fini presque sûrement, $(W_{\tau+t} - W_\tau)_{t \ge 0}$ étant alors indépendant de $\mathcal{F}_\tau$ (le passé jusqu'à $\tau$).
:::

:::preuve Du changement d'échelle
$B_t = W_{ct}/\sqrt c$ : $B_0 = 0$, trajectoires continues, accroissements indépendants (ce sont des accroissements de $W$ sur des intervalles disjoints), et $B_t - B_s = (W_{ct} - W_{cs})/\sqrt c \sim \mathcal{N}\big(0, \frac{c(t-s)}{c}\big) = \mathcal{N}(0, t - s)$.
:::

Le changement d'échelle explique la **racine du temps** : regarder le brownien sur un horizon 4 fois plus long revient à le voir 2 fois plus grand. C'est pourquoi une volatilité annuelle de 16 % correspond à un mouvement quotidien typique de $16\%/\sqrt{252} \approx 1\%$.

## Variation quadratique : d'où vient dW² = dt

C'est **le** résultat qui distingue le calcul stochastique du calcul ordinaire. Prends le temps de lire la démonstration : elle est courte et c'est elle qui justifie la règle $(dW)^2 = dt$ du lemme d'Itô.

:::theoreme Variation quadratique du brownien
Soit $0 = t_0 < t_1 < \dots < t_n = t$ une subdivision de $[0, t]$ de pas $\delta = \max_k (t_{k+1} - t_k)$. Alors
$$
Q_n = \sum_{k=0}^{n-1}\big(W_{t_{k+1}} - W_{t_k}\big)^2 \xrightarrow[\delta \to 0]{} t \quad \text{dans } L^2,
$$
c'est-à-dire $\mathbb{E}[(Q_n - t)^2] \to 0$. On note $[W]_t = t$.
:::

:::preuve
Notons $\Delta_k = W_{t_{k+1}} - W_{t_k} \sim \mathcal{N}(0, h_k)$ avec $h_k = t_{k+1} - t_k$ ; les $\Delta_k$ sont indépendants.

**Espérance** : $\mathbb{E}[Q_n] = \sum_k \mathbb{E}[\Delta_k^2] = \sum_k h_k = t$. La somme des carrés est **exactement** centrée sur $t$, pour toute subdivision.

**Variance** : les $\Delta_k^2$ sont indépendants, donc les variances s'additionnent. Pour une gaussienne $\mathcal{N}(0, h)$, $\operatorname{Var}(\Delta^2) = \mathbb{E}[\Delta^4] - \mathbb{E}[\Delta^2]^2 = 3h^2 - h^2 = 2h^2$. D'où
$$
\mathbb{E}[(Q_n - t)^2] = \operatorname{Var}(Q_n) = \sum_k 2h_k^2 \le 2\delta \sum_k h_k = 2\delta\,t \xrightarrow[\delta\to 0]{} 0.
$$
:::

:::intuition Lire le résultat
Chaque carré $\Delta_k^2$ est aléatoire, d'ordre $h_k$. Mais en sommant beaucoup de petits carrés **indépendants**, les fluctuations se compensent (loi des grands nombres) : la somme devient déterministe et vaut $t$. C'est ce qu'on résume par
$$
(dW_t)^2 = dt, \qquad dW_t\,dt = 0, \qquad (dt)^2 = 0.
$$
Sur un petit intervalle, $(\Delta W)^2$ est du même ordre que $\Delta t$ (donc pas négligeable), alors que $\Delta W\,\Delta t \sim \Delta t^{3/2}$ et $\Delta t^2$ le sont. Pour une fonction dérivable $f$, au contraire, $\sum (f(t_{k+1}) - f(t_k))^2 \approx \sum f'(t_k)^2 h_k^2 \to 0$ : la variation quadratique d'une fonction régulière est nulle. Fiche : [[fiche:stoch-variation-quadratique]].
:::

:::exemple Variation totale infinie
La variation totale $V_n = \sum_k \lvert\Delta_k\rvert$ a pour espérance $\sum_k \sqrt{h_k}\sqrt{2/\pi}$. Pour une subdivision régulière ($h_k = t/n$), c'est $\sqrt{2nt/\pi} \to \infty$. Ce n'est qu'une espérance ; l'argument trajectoriel est $Q_n \le \max_k\lvert\Delta_k\rvert\,V_n$ : comme $Q_n \to t > 0$ et $\max_k\lvert\Delta_k\rvert \to 0$ (continuité uniforme de la trajectoire), $V_n \to \infty$. Les trajectoires sont donc de longueur infinie sur tout intervalle : on ne peut pas définir $\int f\,dW$ comme une intégrale de Stieltjes classique. D'où la construction spécifique de l'intégrale d'Itô (chapitre [[n:integrale-et-lemme-ito]]).
:::

:::exercice ex-bm-variance-qv
reponse: 0.02
Sur $[0, 1]$ découpé en 100 pas égaux, quelle est la variance de $Q_{100} = \sum_k (\Delta_k W)^2$ ?
---
$\operatorname{Var}(Q_n) = \sum_k 2h_k^2 = n \times 2(1/n)^2 = 2/n = 0{,}02$, soit un écart-type de $0{,}14$ autour de $1$. Avec 10 000 pas : écart-type $0{,}014$. Vérifie-le sur la simulation : Σ(ΔW)² se resserre autour de 1.
:::

## Les martingales browniennes

Notons $\mathcal{F}_s$ l'information contenue dans la trajectoire jusqu'au temps $s$.

:::theoreme Trois martingales à connaître
Les processus suivants sont des martingales :
$$
W_t, \qquad W_t^2 - t, \qquad M^\theta_t = \exp\!\left(\theta W_t - \tfrac12\theta^2 t\right) \text{ pour tout réel } \theta.
$$
:::

:::preuve
Pour $s < t$, posons $\Delta = W_t - W_s \sim \mathcal{N}(0, t-s)$, indépendant de $\mathcal{F}_s$.
- $\mathbb{E}[W_t \mid \mathcal{F}_s] = W_s + \mathbb{E}[\Delta] = W_s$.
- $\mathbb{E}[W_t^2 \mid \mathcal{F}_s] = W_s^2 + (t - s)$ (calcul fait plus haut), donc $\mathbb{E}[W_t^2 - t \mid \mathcal{F}_s] = W_s^2 - s$.
- $\mathbb{E}[e^{\theta W_t} \mid \mathcal{F}_s] = e^{\theta W_s}\,\mathbb{E}[e^{\theta\Delta}] = e^{\theta W_s}e^{\theta^2(t-s)/2}$ (transformée de Laplace, chapitre [[n:lois-gaussiennes]]). En multipliant par $e^{-\theta^2 t/2}$ : $\mathbb{E}[M^\theta_t \mid \mathcal{F}_s] = M^\theta_s$.
:::

:::attention Espérance constante ne suffit pas
$W_t^3$ a une espérance nulle pour tout $t$, mais ce n'est pas une martingale : $\mathbb{E}[W_t^3 \mid \mathcal{F}_s] = W_s^3 + 3W_s(t - s)$ (développe $(W_s + \Delta)^3$). La version corrigée $W_t^3 - 3tW_t$ en est une ([[fiche:stoch-w-cube]]). Le chapitre [[n:integrale-et-lemme-ito]] donnera la méthode systématique : un processus est une martingale si son terme en $dt$ (donné par Itô) est nul.
:::

## Temps de sortie et temps d'atteinte

Les martingales et le théorème d'arrêt (chapitre [[n:conditionnement-markov-martingales]]) s'appliquent en temps continu dans les mêmes conditions.

:::theoreme Sortie d'un intervalle
Soient $a, b > 0$ et $\tau$ le premier instant où $W$ sort de $]-a, b[$. Alors $\tau$ est fini presque sûrement et
$$
\mathbb{P}(W_\tau = b) = \frac{a}{a + b}, \qquad \mathbb{E}[\tau] = ab.
$$
:::

:::preuve
**$\tau$ est fini** : $W_t^2 - t$ étant une martingale, $\mathbb{E}[\tau \wedge n] = \mathbb{E}[W_{\tau\wedge n}^2] \le \max(a, b)^2$, donc par convergence monotone $\mathbb{E}[\tau] < \infty$ et $\tau < \infty$ p.s. Le processus arrêté $W_{t \wedge \tau}$ reste dans $[-a, b]$, donc est borné : le théorème d'arrêt s'applique. Avec $p = \mathbb{P}(W_\tau = b)$ :
$$
0 = \mathbb{E}[W_\tau] = b\,p - a(1 - p) \implies p = \frac{a}{a+b}.
$$
Avec $W^2 - t$ (en l'appliquant à $\tau \wedge n$ puis en faisant $n \to \infty$ par convergence monotone et dominée) :
$$
\mathbb{E}[\tau] = \mathbb{E}[W_\tau^2] = b^2\frac{a}{a+b} + a^2\frac{b}{a+b} = \frac{ab(a+b)}{a+b} = ab.
$$
Ce sont exactement les formules de la ruine du joueur équitable, en continu. Fiches : [[fiche:stoch-sortie-intervalle]], [[fiche:stoch-temps-sortie]].
:::

:::exercice ex-bm-sortie
reponse: 1/3
Probabilité qu'un brownien standard atteigne $+2$ avant $-1$ ?
---
Avec $a = 1$ (barrière basse à distance 1) et $b = 2$ : $\mathbb{P}(W_\tau = 2) = \frac{a}{a+b} = \frac13$. Logique : la barrière haute est deux fois plus loin, elle est atteinte en premier deux fois moins souvent.
:::

:::theoreme Temps d'atteinte d'un niveau
Soit $\tau_a = \inf\{t : W_t = a\}$ pour $a > 0$. Alors $\tau_a < \infty$ presque sûrement, mais $\mathbb{E}[\tau_a] = +\infty$, et
$$
\mathbb{E}\big[e^{-\lambda\tau_a}\big] = e^{-a\sqrt{2\lambda}} \qquad (\lambda > 0).
$$
:::

:::preuve
**Fini** : $\tau_a$ est plus petit que le temps de sortie de $]-c, a[$ par le haut, et $\mathbb{P}(\text{sortie par } a) = \frac{c}{a + c} \to 1$ quand $c \to \infty$.

**Transformée de Laplace** : on prend la martingale $M^\theta$ avec $\theta = \sqrt{2\lambda}$, de sorte que $\theta^2/2 = \lambda$. Jusqu'à $\tau_a$, $W \le a$, donc $0 \le M^\theta_{t \wedge \tau_a} \le e^{\theta a}$ : borné. Le théorème d'arrêt donne
$$
1 = \mathbb{E}\big[M^\theta_{\tau_a}\big] = \mathbb{E}\big[e^{\theta a - \lambda\tau_a}\big] \implies \mathbb{E}[e^{-\lambda\tau_a}] = e^{-\theta a} = e^{-a\sqrt{2\lambda}}.
$$

**Espérance infinie** : si $\mathbb{E}[\tau_a] < \infty$, le théorème d'arrêt appliqué à $W$ donnerait $\mathbb{E}[W_{\tau_a}] = 0$, alors que $W_{\tau_a} = a$. (Autre lecture : la dérivée en $\lambda = 0$ de $e^{-a\sqrt{2\lambda}}$ est infinie.) Fiche : [[fiche:stoch-temps-atteinte]].
:::

:::exercice ex-bm-laplace-atteinte
reponse: exp(-1)
Que vaut $\mathbb{E}[e^{-\tau_1/2}]$, où $\tau_1$ est le temps d'atteinte de 1 ?
---
$\lambda = 1/2$, donc $\sqrt{2\lambda} = 1$ et $\mathbb{E}[e^{-\lambda\tau_1}] = e^{-1} \approx 0{,}368$. Interprétation financière : si un actif paie 1 à l'instant où le brownien touche 1, et qu'on actualise au taux $\lambda = 50\%$, il vaut $e^{-1}$ aujourd'hui.
:::

## Principe de réflexion

:::theoreme Principe de réflexion
Pour $a > 0$ et $t > 0$, avec $M_t = \max_{s \le t} W_s$ :
$$
\mathbb{P}(M_t \ge a) = 2\,\mathbb{P}(W_t \ge a) = 2\big(1 - \Phi(a/\sqrt t)\big).
$$
Conséquence : $M_t$ a la même loi que $\lvert W_t\rvert$.
:::

:::preuve Argument de symétrie
Découpons selon que $W$ finit au-dessus ou en dessous de $a$ :
$$
\mathbb{P}(M_t \ge a) = \mathbb{P}(M_t \ge a,\ W_t \ge a) + \mathbb{P}(M_t \ge a,\ W_t < a).
$$
Le premier terme vaut $\mathbb{P}(W_t \ge a)$ (finir au-dessus de $a$ implique d'avoir touché $a$). Pour le second, on utilise la propriété de Markov forte en $\tau_a$ : après $\tau_a$, le processus $W_{\tau_a + s} - a$ est un brownien indépendant du passé, symétrique. Réfléchir la trajectoire après $\tau_a$ (remplacer $W$ par $2a - W$) transforme les trajectoires qui finissent sous $a$ en trajectoires qui finissent au-dessus, avec la même probabilité. Donc le second terme vaut aussi $\mathbb{P}(W_t > a)$.
:::

:::exemple Probabilité de toucher un niveau
$\mathbb{P}(\max_{[0,1]} W \ge 1) = 2(1 - \Phi(1)) \approx 0{,}317$ ([[fiche:stoch-reflexion]]). En finance : probabilité qu'un stop-loss ou une barrière soit touché avant l'échéance. Avec une surveillance seulement quotidienne, on rate des franchissements : la probabilité discrète est plus faible, ce que corrige le décalage de barrière de Broadie-Glasserman ($0{,}5826\,\sigma\sqrt{\Delta t}$).
:::

:::exercice ex-bm-reflexion
reponse: 2*(1-N(1))
tolerance: 0.003
Probabilité qu'un brownien standard dépasse 2 au moins une fois avant la date 4 ?
---
$\mathbb{P}(M_4 \ge 2) = 2\big(1 - \Phi(2/\sqrt 4)\big) = 2(1 - \Phi(1)) \approx 0{,}317$. Par changement d'échelle, c'est le même problème que « dépasser 1 avant la date 1 ».
:::

## Brownien avec dérive et pont brownien

:::definition Brownien avec dérive et brownien géométrique
$X_t = \mu t + \sigma W_t$ est un brownien de dérive $\mu$ et de volatilité $\sigma$ : $X_t \sim \mathcal{N}(\mu t, \sigma^2 t)$. Le **brownien géométrique** $S_t = S_0\,e^{(\mu - \sigma^2/2)t + \sigma W_t}$ est le modèle de prix de Black-Scholes ; le $-\sigma^2/2$ assure que $\mathbb{E}[S_t] = S_0e^{\mu t}$ (chapitre [[n:lois-gaussiennes]]). Le chapitre [[n:equations-differentielles-stochastiques]] montrera qu'il est la solution de $dS = \mu S\,dt + \sigma S\,dW$.
:::

:::definition Pont brownien
Le pont brownien sur $[0, T]$ est le brownien « conditionné à revenir en 0 » : $B_t = W_t - \frac{t}{T}W_T$. C'est un processus gaussien centré de covariance $\operatorname{Cov}(B_s, B_t) = s\left(1 - \frac tT\right)$ pour $s \le t$, nul en $0$ et en $T$.
:::

:::preuve De la covariance du pont
Par bilinéarité, pour $s \le t$, avec $\operatorname{Cov}(W_u, W_v) = \min(u, v)$ :
$$
\operatorname{Cov}\Big(W_s - \tfrac sT W_T,\ W_t - \tfrac tT W_T\Big) = \underbrace{\operatorname{Cov}(W_s, W_t)}_{s} - \frac tT\underbrace{\operatorname{Cov}(W_s, W_T)}_{s} - \frac sT\underbrace{\operatorname{Cov}(W_T, W_t)}_{t} + \frac{st}{T^2}\underbrace{\operatorname{Var}(W_T)}_{T}
$$
$$
= s - \frac{st}{T} - \frac{st}{T} + \frac{st}{T} = s - \frac{st}{T} = s\left(1 - \frac tT\right).
$$
De plus $\operatorname{Cov}(B_t, W_T) = t - \frac tT T = 0$ : le pont est indépendant de $W_T$ (vecteur gaussien). Donc **sachant** $W_T = x$, $W_t = B_t + \frac tT x$ : moyenne $\frac tT x$ et variance $\frac{t(T-t)}{T}$, comme au chapitre [[n:lois-gaussiennes]]. Fiches : [[fiche:stoch-pont-esperance]], [[fiche:stoch-pont-variance]].
:::

:::entretien Ce que l'intervieweur veut voir
Les questions sur le brownien sont presque toujours des calculs d'espérance ou de variance déguisés. Réflexe : **découper en accroissements indépendants**, puis développer. Pour toute question de type « probabilité d'atteindre » ou « temps moyen », cite la martingale utilisée et le théorème d'arrêt. Et sache redémontrer en une minute que $\sum (\Delta W)^2 \to t$ : c'est la question de fond qui justifie tout le calcul d'Itô.
:::
