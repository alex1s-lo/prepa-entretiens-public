---
titre: Mode d'emploi du cours
partie: Méthode
resume: Comment lire ce cours, dans quel ordre, et comment le relier à tes révisions et aux entretiens.
duree: 10 min
---
Ce cours est écrit pour toi : un parcours de classes préparatoires puis d'école d'ingénieurs, donc de bonnes bases d'analyse et d'algèbre linéaire, mais des trous en probabilités appliquées, en calcul stochastique et dans la manipulation des covariances. Il ne suppose rien d'autre que ce que tu as vu en prépa, et il reprend chaque calcul ligne à ligne. Quand une étape te paraît évidente, saute-la ; quand elle ne l'est pas, c'est qu'elle mérite d'être refaite à la main.

## Comment est construit un chapitre

Chaque chapitre suit le même rythme :

- des **définitions** (encadré bleu) et des **théorèmes** (encadré bleu foncé), énoncés avec précision ;
- leurs **démonstrations** complètes, en pointillés : tu peux les replier, mais refais au moins une fois celles qu'on te demande en entretien (l'encadré « En entretien » de fin de chapitre les liste) ;
- des **exemples** calculés en entier, sans « on voit facilement que » ;
- des encadrés **Méthode** qui résument un réflexe de calcul, **Attention** pour les pièges classiques, **En entretien** pour ce que l'intervieweur attend vraiment ;
- des **exercices** : la plupart ont une réponse numérique que l'outil vérifie, et tous ont une solution détaillée ;
- des **simulations** à manipuler : un théorème qu'on a vu marcher sur une simulation se retient beaucoup mieux ;
- à la fin, les **fiches de révision** du chapitre, en un clic.

Depuis une fiche de révision, le lien « Revoir le cours » sous la solution ramène au chapitre correspondant.

## Dans quel ordre

Les chapitres sont dans un ordre logique : chaque partie s'appuie sur les précédentes. Les numéros de chapitre cités dans le texte sont des liens.

1. **Probabilités** (chapitres [[n:esperance-variance-covariance]] à [[n:lois-gaussiennes]]) : le socle. Le chapitre [[n:esperance-variance-covariance]] (espérance, variance, covariance) est le plus rentable de tout le cours : la moitié des questions d'entretien se résolvent avec ses outils. Le chapitre [[n:denombrement-et-poisson]] couvre le comptage et les temps d'attente (très demandés en trading), le chapitre [[n:conditionnement-markov-martingales]] le conditionnement et les martingales, le chapitre [[n:lois-gaussiennes]] les vecteurs gaussiens, qui préparent le calcul stochastique.
2. **Algèbre linéaire et statistiques** (chapitres [[n:algebre-lineaire-covariances]] et [[n:statistiques-et-regression]]) : les matrices de covariance (positivité, Cholesky, inverse, ACP), puis la régression, les tests et les pièges des backtests.
3. **Calcul stochastique** (chapitres [[n:mouvement-brownien]] à [[n:equations-differentielles-stochastiques]]) : mouvement brownien, intégrale et lemme d'Itô, équations différentielles stochastiques. C'est souvent là qu'on a le plus de lacunes : ces chapitres vont lentement et refont tous les calculs.
4. **Pricing** (chapitres [[n:arbitrage-et-risque-neutre]] à [[n:energie-et-matieres-premieres]]) : absence d'arbitrage et probabilité risque-neutre, Black-Scholes démontré de trois façons, grecques et couverture, volatilité (un projet de surface de volatilité), options exotiques et produits structurés, méthodes numériques, taux et crédit, énergie et matières premières.
5. **Risque, données et marchés** (chapitres [[n:risque-et-portefeuille]] à [[n:machine-learning]]) : risque et construction de portefeuille avec Kelly, market making (un projet de market making), machine learning.
6. **Programmation** (chapitre [[n:code-et-algorithmique]]) : la méthode et les techniques des entretiens de code, avec les pièges de Python, NumPy, pandas, C++ et SQL.
7. **Entretiens** (chapitre [[n:entretiens]]) : ce que rapportent les candidats sur les processus des maisons que tu vises, un plan d'entraînement de six semaines et les meilleures ressources.

Si un entretien approche et que le temps manque :
- **banque** (pricing, recherche dérivés) : chapitres [[n:esperance-variance-covariance]], [[n:lois-gaussiennes]], [[n:integrale-et-lemme-ito]], [[n:black-scholes]] et [[n:grecques-et-couverture]], puis [[n:options-exotiques]] pour la structuration ;
- **teneur de marché** (Optiver, IMC, Jane Street, SIG) : chapitres [[n:esperance-variance-covariance]], [[n:denombrement-et-poisson]], [[n:conditionnement-markov-martingales]] et [[n:market-making-et-microstructure]] ;
- **fonds systématique** (QRT, CFM, Squarepoint) : chapitres [[n:esperance-variance-covariance]], [[n:conditionnement-markov-martingales]], [[n:statistiques-et-regression]], [[n:machine-learning]] et [[n:code-et-algorithmique]] ;
- **énergie** : chapitres [[n:equations-differentielles-stochastiques]] et [[n:energie-et-matieres-premieres]].

Ton projet de stat arb s'appuie sur les chapitres [[n:statistiques-et-regression]] et [[n:equations-differentielles-stochastiques]], celui de surface de volatilité sur le chapitre [[n:volatilite]], celui de market making sur le chapitre [[n:market-making-et-microstructure]].

## Comment travailler

- **Lis avec un crayon.** Refais les calculs des exemples avant de lire la solution. En entretien, on te demandera de les faire au tableau, en parlant.
- **Fais les exercices avant d'ouvrir la solution**, même cinq minutes. Se tromper puis corriger est ce qui fixe la méthode.
- **Enchaîne avec les fiches du chapitre** : elles reprennent les mêmes idées sous forme de questions d'entretien et reviennent ensuite en répétition espacée.
- **Explique à voix haute.** Après un chapitre, essaie de redémontrer un résultat (Itô, Black-Scholes, la variance d'un portefeuille) sans notes, comme devant un intervieweur. L'entretien blanc oral avec Claude s'y prête très bien.

:::intuition Pourquoi des démonstrations, si l'entretien demande des réponses ?
Parce que l'intervieweur relance presque toujours : « d'où vient ce terme ? », « et si les variables ne sont pas indépendantes ? », « refais-le sans la formule ». Un résultat appris par cœur casse à la première relance ; un résultat compris se re-dérive en trente secondes.
:::
