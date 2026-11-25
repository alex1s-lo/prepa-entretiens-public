# Antisèche : formules

À relire la veille. Chaque formule ici sert dans au moins une fiche de révision.

## Probabilités

| Loi | Espérance | Variance |
|---|---|---|
| Bernoulli($p$) | $p$ | $p(1 - p)$ |
| Binomiale($n, p$) | np | np($1 - p$) |
| Géométrique($p$), nombre d'essais | $1/p$ | $(1 - p)/p^{2}$ |
| Poisson($\lambda$) | $\lambda$ | $\lambda$ |
| Uniforme[$a, b$] | $(a + b)/2$ | $(b - a)^{2}/12$ |
| Exponentielle($\lambda$) | $1/\lambda$ | $1/\lambda^{2}$ |
| Normale($\mu, \sigma^{2}$) | $\mu$ | $\sigma^{2}$ |
| Dé à 6 faces | 3,5 | $35/12 \approx 2{,}92$ |

- **Espérance totale** : $\mathbb{E}[X] = \mathbb{E}[\mathbb{E}[X | Y]]$ ; **variance totale** : $\operatorname{Var} X = \mathbb{E}[\operatorname{Var} (X | Y)] + \operatorname{Var} (\mathbb{E}[X | Y])$.
- **Bayes** : $\mathbb{P}(A | B) = \mathbb{P}(B | A) \mathbb{P}(A) / \mathbb{P}(B)$ ; en cotes : $\text{cote a posteriori} = \text{cote a priori} \times \text{rapport de vraisemblance}$.
- **$\mathbb{E}[X] = \sum \mathbb{P}(X > n)$** pour $X$ entier positif ; $\int \mathbb{P}(X > x) dx$ en continu.
- **Statistiques d'ordre** de $n$ uniformes : $\mathbb{E}[\text{k-ième plus petit}] = k/(n + 1)$.
- **Min d'exponentielles** de taux $\lambda_{i}$ : exponentielle de taux $\sum \lambda_{i}$ ; $\mathbb{P}(i \text{ est le premier}) = \lambda_{i}/\sum \lambda$.
- **Ruine du joueur** (pièce équilibrée, départ $k$, bornes 0 et $N$) : $\mathbb{P}(N) = k/N$ ; durée moyenne $k(N - k)$.
- **Biaisée** ($r = q/p$) : $\mathbb{P}(N) = (1 - r^k)/(1 - r^N)$.
- **Attente d'un motif** à pile ou face : somme des $2^\ell$ pour chaque longueur $\ell$ où préfixe = suffixe (PP : 6, PF : 4, PFP : 10, PPP : 14).
- **Collectionneur** : $n(1 + 1/2 + \dots + 1/n)$.
- **Normale** : $E|Z| = \sqrt{2/\pi} \approx 0{,}80$ ; $\mathbb{E}[Z | Z > a] = \varphi (a)/(1 - \Phi (a))$ ; $\mathbb{E}[\max (Z_{1}, Z_{2})] = 1/\sqrt{\pi}$.
- **Corrélation** : pour $n$ variables de corrélation commune $\rho, \rho \ge -1/(n - 1)$.

## Calcul stochastique

- Brownien : $W_t \sim N(0, t)$ ; $\operatorname{Cov} (W_s, W_t) = \min (s, t)$ ; $[W]_t = t$ ; $\mathbb{E}[W_t^{4}] = 3t^{2}$.
- **Itô** : $df(t, X) = (f_t + \mu f_x + \tfrac12 \sigma^{2} f_{xx}) dt + \sigma f_x dW$, avec $dX = \mu dt + \sigma dW$.
- $d(W^{2}) = 2W dW + dt$ ; $\int_{0}^{T} W dW = (W_T^{2} - T)/2$.
- **Isométrie** : $\mathbb{E}[(\int H dW)^{2}] = \mathbb{E}[\int H^{2} dt]$.
- **Martingales** : $W_t, W_t^{2} - t, \exp (\theta W_t - \theta^{2}t/2), W_t^{3} - 3tW_t$.
- **Brownien géométrique** : $S_t = S_{0} \exp ((\mu - \sigma^{2}/2)t + \sigma W_t)$ ; $\mathbb{E}[S_t] = S_{0}e^{\mu t}$.
- **Ornstein-Uhlenbeck** $dX = \kappa (\theta - X) dt + \sigma dW$ : variance stationnaire $\sigma^{2}/(2\kappa)$ ; demi-vie $\ln 2/\kappa$ ; AR(1) de coefficient $e^{-\kappa \Delta}$.
- **Réflexion** : $\mathbb{P}(\max_{[0,T]} W \ge a) = 2\mathbb{P}(W_T \ge a)$.
- **Sortie** de ($-a, b$) depuis 0 : $\mathbb{P}(b \text{ avant} -a) = a/(a + b)$ ; $\mathbb{E}[\tau] = ab$.
- **Girsanov** : sous $dQ/dP = \exp (- \int \theta dW - \tfrac12 \int \theta^{2} dt), W + \int \theta dt$ est un brownien.

## Black-Scholes (dividende q)

- $C = S e^{-qT} N(d_{1}) - K e^{-rT} N(d_{2})$ ; $P = K e^{-rT} N(-d_{2}) - S e^{-qT} N(-d_{1})$
- $d_{1} = [\ln (S/K) + (r - q + \sigma^{2}/2)T]/(\sigma \sqrt{T})$ ; $d_{2} = d_{1} - \sigma \sqrt{T}$
- **Parité** : $C - P = S e^{-qT} - K e^{-rT}$ ; forward $F = S e^{(r - q)T}$
- **Delta** call $e^{-qT}N(d_{1})$ ; **Gamma** $e^{-qT}\varphi (d_{1})/(S\sigma \sqrt{T})$ ; **Vega** $S e^{-qT}\varphi (d_{1})\sqrt{T}$ ; Vega $= \Gamma S^{2}\sigma T$
- **Theta et gamma** (portefeuille couvert, $r \approx 0$) : $\Theta \approx - \tfrac12 \sigma^{2}S^{2}\Gamma$
- **À la monnaie** ($r = 0$) : $C \approx 0{,}4 \sigma S \sqrt{T}$ ; straddle $\approx 0{,}8 \sigma S \sqrt{T}$ ; delta $\approx 0{,}5 + 0{,}2 \sigma \sqrt{T}$
- **Digitale** : $e^{-rT}N(d_{2})$ ; $= - \partial C/ \partial K$
- **Densité** (Breeden-Litzenberger) : $q(K) = e^{rT} \partial^{2}C/ \partial K^{2}$
- **EDP** : $V_t + (r - q)S V_S + \tfrac12 \sigma^{2}S^{2} V_{SS} - rV = 0$
- **PnL couvert** : $\tfrac12 \Gamma S^{2}(\sigma^{2}_\text{réalisée} - \sigma^{2}_\text{implicite}) dt$

## Taux et crédit

- Duration modifiée $D_\text{mod} = D_\text{Mac}/(1 + y)$ ; $\Delta P/P \approx -D_\text{mod} \Delta y + \tfrac12 C \Delta y^{2}$ ; $\text{DV01} \approx P \times D_\text{mod} \times 10^{-4}$
- Forward : $(1 + r_{2})^{2} = (1 + r_{1})(1 + f_{1},_{2})$
- Swap par : $S = (1 - \text{DF}(T)) / \sum_i \text{ DF}(t_{i})$ (paiements annuels)
- Crédit : spread $\approx \lambda (1 - R)$ ; survie $e^{-\lambda T}$
- CVA $\approx (1 - R) \Sigma$ DF($t_{i}$) EE($t_{i}$) PD($t_{i-1}, t_{i}$)
- VaR normale : $z_\alpha \sigma \sqrt{h} \times$ valeur ; $z_{95} = 1{,}645$ ; $z_{99} = 2{,}326$ ; $\text{ES}_{97{,}5} \approx 2{,}34\,\sigma$

## Statistiques

- OLS : $\hat{\beta} = (X^{T}X)^{-1}X^{T}y$ ; régression simple : $\beta = \rho \sigma_y/\sigma_x$ ; $R^{2} = \rho^{2}$
- Erreur standard de la moyenne $\sigma /\sqrt{n}$ ; IC 95 % : $\pm 1{,}96 \sigma /\sqrt{n}$
- Sharpe annuel = Sharpe quotidien $\times \sqrt{252}$ ; écart-type de l'estimateur $\approx 1/\sqrt{\text{années}}$
- Tests multiples : $\mathbb{P}(\text{au moins un faux positif}) = 1 - (1 - \alpha)^m$ ; Bonferroni $\alpha /m$
- Biais d'atténuation : pente $\times \operatorname{Var} (x)/(\operatorname{Var} (x) + \operatorname{Var} (\text{bruit}))$
- Kelly : $f^{\star} = (bp - q)/b$ ; en continu $\mu /\sigma^{2}$ ; croissance $\text{SR}^{2}/2$

## Avellaneda-Stoikov (ton projet)

- Prix de réservation $r = s - q\gamma \sigma^{2}(T - t)$
- Spread $= \gamma \sigma^{2}(T - t) + (2/\gamma) \ln (1 + \gamma /k)$
- Intensité d'exécution $\lambda (\delta) = A e^{-k\delta}$

## SVI (ton projet)

- $w(k) = a + b[\rho (k - m) + \sqrt{(k - m)^{2} + \sigma^{2}}]$ ; ailes $b(1 \pm \rho) \le 2$ (Lee)
- Papillon : $g(k) \ge 0$ ; calendaire : $w(k, T)$ croissante en $T$
