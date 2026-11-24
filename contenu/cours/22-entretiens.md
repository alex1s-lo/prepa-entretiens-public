---
titre: Les entretiens : formats, témoignages et plan d'entraînement
partie: Entretiens
resume: Ce que testent réellement les sociétés de trading, les fonds quantitatifs et les banques, d'après leurs pages officielles et des témoignages de candidats ; comment chaque épreuve se relie aux chapitres du cours et aux outils de l'application ; un plan d'entraînement de six semaines ; la méthode pour répondre au tableau ; et les meilleures ressources externes, gratuites d'abord.
duree: 1 h
fiches: fit-ouverture-presente-toi fit-ouverture-parcours fit-pourquoi-quant fit-pourquoi-nous fit-cesure fit-stage-actuel fit-ia fit-plan-b fit-echec fit-equipe fit-pression fit-qualites-defauts fit-cinq-ans fit-dernieres-nouvelles fit-questions-a-poser mm-sujet-de-marche proj-vs-pitch proj-sa-pitch proj-mm-pitch ct-oeufs mm-faire-un-marche
---
Ce dernier chapitre ne contient pas de mathématiques nouvelles. Il répond à une autre question : **qu'est-ce qui t'attend, concrètement**, et comment utiliser tout ce qui précède pour t'y préparer. Les informations viennent de deux types de sources, qu'il faut lire différemment :
- les **pages officielles** des entreprises (processus de recrutement, guides publiés), fiables mais générales ;
- les **témoignages anonymes** de candidats (Glassdoor surtout), précis mais variables d'une année, d'un bureau et d'un poste à l'autre. Un témoignage isolé n'est pas une règle ; une question qui revient chez plusieurs candidats en est presque une.

## Trois familles d'employeurs, trois façons d'interroger

:::propriete Ce que chacun teste
| Famille | Exemples | Ce qui est testé | Chapitres |
|---|---|---|---|
| Sociétés de trading | Optiver, IMC, Jane Street, SIG, Flow Traders | calcul mental rapide, probabilités et espérances, jeux de paris et de market making, décision sous incertitude | 1, 2, 14, 15 |
| Fonds quantitatifs | QRT, CFM, Squarepoint | probabilités, statistiques et régression, machine learning, code (Python, algorithmique) | 1, 2, 4, 12, 16 |
| Banques (desks, recherche, risque, validation) | BNP Paribas, Société Générale, Natixis, Crédit Agricole CIB | calcul stochastique, Black-Scholes, grecques et couverture, volatilité, taux, C++ ou Python | 5 à 13 |
:::

Dans toutes les familles, il y a aussi un entretien **comportemental** (motivation, parcours, projets) et souvent des **casse-têtes**. Pour un stage de césure, on attend de la solidité sur les fondamentaux et de la clarté de raisonnement bien plus qu'un savoir encyclopédique.

## Ce que rapportent les candidats, entreprise par entreprise

### Sociétés de trading

:::exemple Optiver
**Officiel** : candidature, puis évaluation quantitative en ligne, puis entretien comportemental, puis entretien final ([FAQ Optiver](https://www.optiver.com/recruitment-blog/post/apac-graduate-faqs/)).

**Témoignages** : un test de calcul de **80 questions en 8 minutes** (un candidat parle d'un seuil vers 55/80), des tests en ligne de plusieurs heures au total (suites logiques, probabilités, mini-jeux), puis des jeux de trading en direct ([Glassdoor](https://www.glassdoor.com/Interview/Optiver-Interview-E243355-RVW70376629.htm)).

**Préparation** : le mode « test 80 questions » de la vue Calcul mental de l'application reproduit ce format ; vise la régularité plus que la vitesse de pointe.
:::

:::exemple IMC
**Officiel** : candidature, évaluation en ligne et/ou entretien, puis premiers entretiens ([processus IMC](https://www.imc.com/eu/careers/recruitment-process)).

**Témoignages** : jeux de réflexes et de calcul en ligne, entretien vidéo enregistré, puis entretiens mêlant motivation, market making et questions quantitatives, et une journée finale (maths, trading, personnalité).
:::

:::exemple Jane Street
**Officiel** : entretiens téléphoniques puis sur site ; la société publie elle-même un guide « Probability & Markets » (dénombrement, espérance, conditionnement, market making, sélection adverse) et une vidéo d'entretien blanc d'une vingtaine de minutes. Elle précise qu'aucune connaissance de finance n'est requise ([guide Probability & Markets](https://www.janestreet.com/probability-markets/), [entretiens de trading](https://www.janestreet.com/trading-interviews/)).

**Témoignages** : jeux de dés, espérances conditionnelles, « fais un marché sur la somme de quatre dés », et une grande attention à la **clarté** du raisonnement à voix haute.

**Préparation** : lis le guide officiel en entier (il est court) et regarde la vidéo avant tout entretien en trading ; c'est la meilleure source primaire qui existe.
:::

:::exemple SIG (Susquehanna)
**Officiel** : SIG présente le trading comme de la prise de décision sous incertitude et forme ses recrues aux probabilités, aux cotes et à l'espérance par des jeux de stratégie ([page campus SIG](https://sig.com/campus-programs/trading/)).

**Témoignages et guides de préparation** : un test en ligne de calcul et de probabilités, puis des entretiens dominés par l'espérance, les chaînes de Markov et des jeux de paris, souvent inspirés du poker ([guide Tradermath](https://tradermath.org/knowledge-base/sig-interview-guide)). Les nombres de tours varient selon les témoignages.
:::

### Fonds quantitatifs

:::exemple QRT (Qube Research & Technologies)
**Témoignages** : hypothèses des moindres carrés, Ridge contre Lasso, ruine du joueur, chaînes de Markov, problèmes de code de niveau « moyen à difficile », manipulation de données en Python en direct, et une discussion approfondie des projets. À Paris : RH, puis quant junior, puis quant senior, puis une épreuve finale ([Glassdoor](https://www.glassdoor.ca/Interview/Qube-Research-and-Technologies-Interview-E3226090-RVW104382198.htm)).

**Préparation** : chapitres [[n:conditionnement-markov-martingales]] (Markov, ruine), 4 (régression, Ridge et Lasso), 16, et des exercices d'algorithmique.
:::

:::exemple Squarepoint
**Témoignages** : plusieurs entretiens techniques d'environ une heure mêlant probabilités de base, statistiques (régularisation, sélection de variables) et code en direct (programmation dynamique, niveau « moyen »), avec parfois un jeu ou un peu de théorie des jeux ; les avis sur la difficulté sont très partagés ([Glassdoor](https://www.glassdoor.com/Interview/Squarepoint-Capital-Interview-E1442647-RVW90603426.htm)).
:::

:::exemple CFM
Pas de témoignage d'entretien détaillé trouvé. Les offres publiées insistent sur le machine learning (y compris des modèles récents), les séries temporelles et les mathématiques appliquées ([carrières CFM](https://jobs.cfm.com)). Attends-toi à une discussion technique de tes projets et à des questions de statistiques solides (chapitres [[n:statistiques-et-regression]] et [[n:machine-learning]]).
:::

### Banques

:::exemple BNP Paribas
**Témoignages** : tests écrits de calcul stochastique, probabilités et C ou C++ ; pour un stage de recherche sur les dérivés actions, un long entretien avec deux quants (projets, modélisation, calcul stochastique, casse-tête) ; démontrer Black-Scholes ; mouvement brownien ; algorithme de tri ; le problème des œufs et des cent étages ([Glassdoor](https://fr.glassdoor.ca/Entretien/BNP-Paribas-Entretien-E10342-RVW11101968.htm), [[fiche:ct-oeufs]]).

**Préparation** : chapitres [[n:mouvement-brownien]] à [[n:black-scholes]] en priorité. Sache refaire **sans notes** la dérivation de l'EDP et le calcul de l'espérance du chapitre [[n:black-scholes]].
:::

:::exemple Société Générale
**Témoignages** : répliquer un call spread, PnL de la couverture en delta d'une option achetée, gamma et positions courtes en gamma, stress tests et CVA ; en structuration actions, des maths de base et deux casse-têtes ; motivation ([Glassdoor](https://www.glassdoor.com/Interview/Soci%C3%A9t%C3%A9-G%C3%A9n%C3%A9rale-Interview-E10350-RVW68018317.htm)).

**Préparation** : chapitres [[n:arbitrage-et-risque-neutre]], [[n:grecques-et-couverture]] et [[n:taux-et-credit]]. La question du PnL de couverture est traitée en détail au chapitre [[n:grecques-et-couverture]].
:::

:::exemple Natixis
**Témoignages** (peu nombreux) : une question sur le **modèle de Dupire** (retrouver la formule de la volatilité locale), et un processus RH puis équipe portant sur le CV, les mathématiques et la finance ([Glassdoor](https://www.glassdoor.com/Interview/Natixis-Interview-E10682-RVW52160237.htm)). La dérivation heuristique de Dupire est au chapitre [[n:volatilite]].
:::

## Chaque épreuve, et l'outil qui y prépare

:::methode Correspondance entre épreuves et entraînement
- **Test de calcul chronométré** : vue *Calcul mental* (formats test 80, sprint, estimation, pricing) ; en complément, [Zetamac](https://arithmetic.zetamac.com) chaque jour quelques minutes.
- **Test en ligne de probabilités** : vue *Test en ligne*, accessible depuis *Entretien blanc* (questions à temps limité) et les chapitres [[n:esperance-variance-covariance]] à [[n:lois-gaussiennes]].
- **Entretien technique** : le cours (démonstrations à refaire au tableau), puis les fiches liées en fin de chaque chapitre, en mode « S'entraîner sur ces fiches ».
- **Jeu de market making** : vue *Market making* (faire un marché, gérer son inventaire, Kelly) et chapitre [[n:market-making-et-microstructure]].
- **Entretien comportemental** : vue *Mes histoires* (tes réponses en français et en anglais) et les fiches ci-dessous.
- **Présentation de projets** : les fiches de pitch ([[fiche:proj-vs-pitch]], [[fiche:proj-sa-pitch]], [[fiche:proj-mm-pitch]]) et les sections « ce que ton projet montre » des chapitres [[n:equations-differentielles-stochastiques]], [[n:volatilite]] et [[n:market-making-et-microstructure]].
:::

## Un plan d'entraînement de six semaines

:::methode Le rythme quotidien (environ 1 h 30)
1. **10 minutes de calcul mental** (vue Calcul mental ou Zetamac). Tous les jours, sans exception : c'est la compétence qui progresse le plus vite avec la régularité.
2. **30 minutes de révisions espacées** (vue Révisions) : les fiches dues du jour, en répondant à voix haute avant de regarder la solution.
3. **45 minutes de cours** : une section, en refaisant chaque démonstration sur papier sans regarder, puis les exercices du chapitre.
4. **5 minutes de journal** : ce qui a coincé, à revoir.
:::

:::propriete Les six semaines
| Semaine | Cours | Objectif |
|---|---|---|
| 1 | chapitres [[n:esperance-variance-covariance]] à [[n:lois-gaussiennes]] | manipuler espérances, variances, covariances et gaussiennes sans hésiter |
| 2 | chapitres [[n:statistiques-et-regression]] et [[n:mouvement-brownien]] | régression et tests ; mouvement brownien |
| 3 | chapitres [[n:integrale-et-lemme-ito]] et [[n:equations-differentielles-stochastiques]] | Itô et EDS : refaire chaque application du chapitre [[n:integrale-et-lemme-ito]] |
| 4 | chapitres [[n:arbitrage-et-risque-neutre]] à [[n:grecques-et-couverture]] | arbitrage, Black-Scholes (deux dérivations chronométrées), grecques |
| 5 | chapitres [[n:volatilite]] à [[n:taux-et-credit]], selon les postes visés | volatilité, numérique, taux et crédit |
| 6 | chapitres [[n:risque-et-portefeuille]] à [[n:machine-learning]] et entretiens blancs | risque, market making, ML ; deux entretiens blancs (vue Entretien blanc) |

Adapte l'ordre aux entretiens qui arrivent : une société de trading la semaine prochaine fait passer les chapitres [[n:esperance-variance-covariance]], [[n:conditionnement-markov-martingales]] et [[n:market-making-et-microstructure]] avant tout le reste.
:::

## Répondre au tableau

:::methode La méthode qui fait la différence
1. **Reformuler** la question et poser les hypothèses (« je suppose les lancers indépendants »). Demander une précision n'est jamais une faiblesse.
2. **Penser à voix haute** : l'intervieweur note le raisonnement plus que le résultat. Un silence de deux minutes suivi d'une bonne réponse vaut moins qu'un raisonnement visible avec une erreur corrigée.
3. **Commencer par un ordre de grandeur** ou un cas simple ($n = 1$, $n = 2$), puis généraliser.
4. **Vérifier** : cas limites, symétries, signe, unité, ordre de grandeur (les contrôles des chapitres [[n:black-scholes]] et [[n:grecques-et-couverture]] sont faits pour ça).
5. **Accepter les indices** : un indice n'est pas un échec, c'est un test de ta capacité à intégrer une information. Le refuser par orgueil, si.
6. Si tu ne sais pas, dis **ce que tu ferais** (simuler, chercher une récurrence, une martingale) plutôt que rien.
:::

:::attention Ce qui élimine le plus souvent
- Se précipiter sur une formule sans comprendre la question.
- Ne pas savoir expliquer **son propre projet** en profondeur, ou en exagérer les résultats. Tes trois projets reposent sur des données synthétiques : dis-le, et dis ce qu'ils valident (le code, la compréhension), pas ce qu'ils ne valident pas (une performance de marché).
- Ne pas savoir pourquoi tu postules **chez eux** ([[fiche:fit-pourquoi-nous]]).
- Le calcul mental lent ou peu fiable dans les sociétés de trading.
:::

## Les questions personnelles

:::methode Les réponses à préparer par écrit, puis à dire à voix haute
- **Présente-toi** et **ton parcours** ([[fiche:fit-ouverture-presente-toi]], [[fiche:fit-ouverture-parcours]]) : ta formation, ton parcours, ta césure, en deux minutes, avec un fil conducteur.
- **Pourquoi la finance quantitative**, **pourquoi nous**, **pourquoi une césure** ([[fiche:fit-pourquoi-quant]], [[fiche:fit-pourquoi-nous]], [[fiche:fit-cesure]]).
- **Ton stage actuel** ([[fiche:fit-stage-actuel]]) : ce que tu y as appris de transférable (données réelles, modélisation, travail en équipe) ; c'est aussi une porte d'entrée naturelle vers l'énergie et les matières premières.
- **Tes projets écrits avec une IA** ([[fiche:fit-ia]]) : le dire simplement, et montrer que tu les as compris, cassés et réparés.
- **Ton plan B** ([[fiche:fit-plan-b]]), un **échec** ([[fiche:fit-echec]]), le **travail en équipe** ([[fiche:fit-equipe]]), la **pression** ([[fiche:fit-pression]]), **qualités et défauts** ([[fiche:fit-qualites-defauts]]), **dans cinq ans** ([[fiche:fit-cinq-ans]]).
- **Un sujet de marché** ([[fiche:mm-sujet-de-marche]], [[fiche:fit-dernieres-nouvelles]]) : choisis-en un, lis trois articles, sache donner un chiffre et un avis.
- **Tes questions à poser** à la fin ([[fiche:fit-questions-a-poser]]) : en prépare trois, précises, sur le travail de l'équipe.
:::

## Ressources externes

:::propriete Gratuites, à utiliser en priorité
- [Jane Street, Probability & Markets](https://www.janestreet.com/probability-markets/) : le meilleur guide officiel sur les probabilités et le market making en entretien.
- [Zetamac](https://arithmetic.zetamac.com) : entraînement au calcul mental chronométré, réglable.
- [OpenQuant](https://openquant.co/questions) : questions de probabilités, statistiques et casse-têtes, avec une évaluation chronométrée.
- [Brainstellar](https://brainstellar.com) : énigmes de probabilités classées par difficulté, avec solutions.
- [MIT OCW 18.S096](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/) et [MIT OCW 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) : cours et vidéos de mathématiques financières (calcul d'Itô, EDS), un bon complément aux chapitres [[n:mouvement-brownien]] à [[n:equations-differentielles-stochastiques]].
:::

:::propriete Payantes ou en partie payantes
- [QuantGuide](https://quantguide.io) : grande banque de questions classées par entreprise et par thème, avec un jeu de calcul rapide ; les solutions complètes sont dans l'offre payante.
- [Tradermath](https://tradermath.org) : questions et guides par entreprise, en partie payants.
:::

:::propriete Livres de référence
- X. Zhou, *A Practical Guide to Quantitative Finance Interviews* (le « green book ») : le classique des questions d'entretien.
- T. Crack, *Heard on the Street* ; D. Stefanica, R. Radoičić et T.-H. Wang, *150 Most Frequently Asked Questions on Quant Interviews* ; M. Joshi et al., *Quant Job Interview Questions and Answers*.
- F. Mosteller, *Fifty Challenging Problems in Probability* : court, excellent pour les probabilités.
- Pour approfondir : S. Shreve, *Stochastic Calculus for Finance* (I et II) ; J. Hull, *Options, Futures and Other Derivatives* ; J. Gatheral, *The Volatility Surface* ; M. López de Prado, *Advances in Financial Machine Learning*.
:::

:::entretien La règle d'or
Il vaut mieux maîtriser **parfaitement** les quinze démonstrations et calculs qui reviennent partout (variance d'une somme, Bayes, premier pas, ruine du joueur, gaussiennes et log-normales, $\int W\,dW$, lemme d'Itô sur $\ln S$, Ornstein-Uhlenbeck, parité call-put, arbre à une période, Black-Scholes, PnL gamma-theta, MCO, VaR gaussienne, Kelly) que survoler cent sujets. Ce cours est organisé pour ça : la liste à cocher en tête du sommaire du cours reprend ces quinze démonstrations avec un lien vers chacune, chaque chapitre se termine par sa liste de questions typiques, et chaque fiche te renvoie à la démonstration correspondante.
:::
