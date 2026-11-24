# Antisèche : formules

À relire la veille. Chaque formule ici sert dans au moins une fiche de révision.

## Probabilités

| Loi | Espérance | Variance |
|---|---|---|
| Bernoulli(p) | p | p(1 − p) |
| Binomiale(n, p) | np | np(1 − p) |
| Géométrique(p), nombre d'essais | 1/p | (1 − p)/p² |
| Poisson(λ) | λ | λ |
| Uniforme[a, b] | (a + b)/2 | (b − a)²/12 |
| Exponentielle(λ) | 1/λ | 1/λ² |
| Normale(μ, σ²) | μ | σ² |
| Dé à 6 faces | 3,5 | 35/12 ≈ 2,92 |

- **Espérance totale** : E[X] = E[E[X | Y]] ; **variance totale** : Var X = E[Var(X | Y)] + Var(E[X | Y]).
- **Bayes** : P(A | B) = P(B | A) P(A) / P(B) ; en cotes : cote a posteriori = cote a priori × rapport de vraisemblance.
- **E[X] = Σ P(X > n)** pour X entier positif ; ∫ P(X > x) dx en continu.
- **Statistiques d'ordre** de n uniformes : E[k-ième plus petit] = k/(n + 1).
- **Min d'exponentielles** de taux λᵢ : exponentielle de taux Σλᵢ ; P(i est le premier) = λᵢ/Σλ.
- **Ruine du joueur** (pièce équilibrée, départ k, bornes 0 et N) : P(N) = k/N ; durée moyenne k(N − k).
- **Biaisée** (r = q/p) : P(N) = (1 − r^k)/(1 − r^N).
- **Attente d'un motif** à pile ou face : somme des 2^ℓ pour chaque longueur ℓ où préfixe = suffixe (PP : 6, PF : 4, PFP : 10, PPP : 14).
- **Collectionneur** : n(1 + 1/2 + … + 1/n).
- **Normale** : E|Z| = √(2/π) ≈ 0,80 ; E[Z | Z > a] = φ(a)/(1 − Φ(a)) ; E[max(Z₁, Z₂)] = 1/√π.
- **Corrélation** : pour n variables de corrélation commune ρ, ρ ≥ −1/(n − 1).

## Calcul stochastique

- Brownien : W_t ~ N(0, t) ; Cov(W_s, W_t) = min(s, t) ; [W]_t = t ; E[W_t⁴] = 3t².
- **Itô** : df(t, X) = (f_t + μ f_x + ½σ² f_xx) dt + σ f_x dW, avec dX = μ dt + σ dW.
- d(W²) = 2W dW + dt ; ∫₀ᵀ W dW = (W_T² − T)/2.
- **Isométrie** : E[(∫ H dW)²] = E[∫ H² dt].
- **Martingales** : W_t, W_t² − t, exp(θW_t − θ²t/2), W_t³ − 3tW_t.
- **Brownien géométrique** : S_t = S₀ exp((μ − σ²/2)t + σW_t) ; E[S_t] = S₀e^{μt}.
- **Ornstein-Uhlenbeck** dX = κ(θ − X) dt + σ dW : variance stationnaire σ²/(2κ) ; demi-vie ln 2/κ ; AR(1) de coefficient e^{−κΔ}.
- **Réflexion** : P(max_{[0,T]} W ≥ a) = 2P(W_T ≥ a).
- **Sortie** de (−a, b) depuis 0 : P(b avant −a) = a/(a + b) ; E[τ] = ab.
- **Girsanov** : sous dQ/dP = exp(−∫θ dW − ½∫θ² dt), W + ∫θ dt est un brownien.

## Black-Scholes (dividende q)

- C = S e^{−qT} N(d₁) − K e^{−rT} N(d₂) ; P = K e^{−rT} N(−d₂) − S e^{−qT} N(−d₁)
- d₁ = [ln(S/K) + (r − q + σ²/2)T]/(σ√T) ; d₂ = d₁ − σ√T
- **Parité** : C − P = S e^{−qT} − K e^{−rT} ; forward F = S e^{(r − q)T}
- **Delta** call e^{−qT}N(d₁) ; **Gamma** e^{−qT}φ(d₁)/(Sσ√T) ; **Vega** S e^{−qT}φ(d₁)√T ; Vega = ΓS²σT
- **Theta et gamma** (portefeuille couvert, r ≈ 0) : Θ ≈ −½σ²S²Γ
- **À la monnaie** (r = 0) : C ≈ 0,4 σ S √T ; straddle ≈ 0,8 σ S √T ; delta ≈ 0,5 + 0,2 σ√T
- **Digitale** : e^{−rT}N(d₂) ; = −∂C/∂K
- **Densité** (Breeden-Litzenberger) : q(K) = e^{rT} ∂²C/∂K²
- **EDP** : V_t + (r − q)S V_S + ½σ²S² V_SS − rV = 0
- **PnL couvert** : ½ΓS²(σ²_réalisée − σ²_implicite) dt

## Taux et crédit

- Duration modifiée D_mod = D_Mac/(1 + y) ; ΔP/P ≈ −D_mod Δy + ½C Δy² ; DV01 ≈ P × D_mod × 10⁻⁴
- Forward : (1 + r₂)² = (1 + r₁)(1 + f₁,₂)
- Swap par : S = (1 − DF(T))/Σ DF(tᵢ) (paiements annuels)
- Crédit : spread ≈ λ(1 − R) ; survie e^{−λT}
- CVA ≈ (1 − R) Σ DF(tᵢ) EE(tᵢ) PD(tᵢ₋₁, tᵢ)
- VaR normale : z_α σ √h × valeur ; z₉₅ = 1,645 ; z₉₉ = 2,326 ; ES₉₇,₅ ≈ 2,34 σ

## Statistiques

- OLS : β̂ = (XᵀX)⁻¹Xᵀy ; régression simple : β = ρ σ_y/σ_x ; R² = ρ²
- Erreur standard de la moyenne σ/√n ; IC 95 % : ± 1,96 σ/√n
- Sharpe annuel = Sharpe quotidien × √252 ; écart-type de l'estimateur ≈ 1/√(années)
- Tests multiples : P(au moins un faux positif) = 1 − (1 − α)^m ; Bonferroni α/m
- Biais d'atténuation : pente × Var(x)/(Var(x) + Var(bruit))
- Kelly : f* = (bp − q)/b ; en continu μ/σ² ; croissance SR²/2

## Avellaneda-Stoikov (ton projet)

- Prix de réservation r = s − qγσ²(T − t)
- Spread = γσ²(T − t) + (2/γ) ln(1 + γ/k)
- Intensité d'exécution λ(δ) = A e^{−kδ}

## SVI (ton projet)

- w(k) = a + b[ρ(k − m) + √((k − m)² + σ²)] ; ailes b(1 ± ρ) ≤ 2 (Lee)
- Papillon : g(k) ≥ 0 ; calendaire : w(k, T) croissante en T
