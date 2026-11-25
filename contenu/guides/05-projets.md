# Défendre tes projets

Un à trois projets personnels sont ton meilleur atout et ton plus grand risque. Ils montrent de l'initiative et des sujets pertinents ; mais ils tournent sur des données synthétiques et ont été écrits avec l'aide d'une IA. Un intervieweur creusera, c'est certain. L'objectif : qu'il trouve de la compréhension réelle à chaque niveau où il creuse.

## La règle d'or

Ne dis rien que tu ne saurais pas défendre en deux relances. Présente les résultats comme ce qu'ils sont : une validation du code et de la méthode sur une vérité connue, pas une performance de marché. Si on te demande si une IA t'a aidé : oui, et voilà ce que tu as compris, cassé et réparé toi-même.

## Avant chaque entretien (1 heure par projet, une fois)

Écris, pour chaque projet, une courte note de défense (choix, limites, ce que tu ferais ensuite) et fais au moins un exercice d'extension : change un paramètre, casse quelque chose, répare-le. Tu pourras alors raconter quelque chose que **tu** as observé.

**Surface de volatilité**
- Change `PARAMS` ($\rho = 0, \xi$ élevé, condition de Feller violée) et regarde ce qui casse.
- Remplace le bruit gaussien par un bruit proportionnel au spread.
- Ajoute la pondération par vega dans `fit_svi` et compare les erreurs.

**Arbitrage statistique**
- Fais varier `demi_vie` (4, 8, 15, 30) et `formation` ; trace la proportion de vraies paires retenues.
- Ajoute une correction de Bonferroni dans `_choisir_paires` et compare.
- Ajoute une rupture de régime au milieu du spread et observe le drawdown.

**Market making**
- Ajoute de la sélection adverse (exécutions surtout quand le prix va contre toi) : A-S gagne-t-il encore ?
- Ajoute une limite d'inventaire dure et mesure son coût.
- Refais le balayage de $\gamma$ pour un autre $\sigma$ et explique la différence.

## Les pitchs de 30 secondes

À écrire toi-même dans Mes histoires → « Le projet dont tu es le plus fier ». Trame : le problème, ce que tu as construit, un chiffre honnête, ce qui n'a pas marché et ce que tu en as appris.

## Ce que l'intervieweur cherche, par projet

| Projet | Pour quel poste | Ce qu'il va tester |
|---|---|---|
| Surface de volatilité | Banque (pricing, strats), risque | Black-Scholes, smile, arbitrage, calibration, Heston |
| Arbitrage statistique | Hedge fund, data science | Cointégration, biais de backtest, tests multiples, validation |
| Market making | Teneur de marché, trading | Inventaire, spread, sélection adverse, simulation |

Les fiches du thème « Projets types » donnent des exemples de questions probables sur trois projets de référence (surface de volatilité, arbitrage statistique, market making), avec leurs chiffres ; adapte-les à tes propres projets. Révise-les jusqu'à les maîtriser toutes : ce sont les seules questions que tu peux être sûr de recevoir.

## Les anecdotes à savoir raconter

- **SVI** : un minimum local ($\rho = 0{,}92, m = 0{,}63$) ajustait bien les cotations mais donnait une densité négative ($g$ min $= -2{,}17$) → pénalité, plusieurs départs, $m$ borné.
- **Stat arb** : premier réglage à Sharpe nul malgré 8 vraies paires → test peu puissant et 1 540 paires testées (faux positifs) → réglage changé après coup, d'où le Sharpe déflaté et le contrôle négatif. Et un bug de décalage d'un jour, d'où le test anti regard vers le futur.
- **Market making** : le compteur d'ordres faisait `bool + bool` (OU logique en NumPy) → détecté par un test qui comparait au bon taux d'exécution en temps discret.
