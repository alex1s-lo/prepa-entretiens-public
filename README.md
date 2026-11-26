# Prépa entretiens quant

Une application pour préparer les entretiens de stage en finance quantitative (recherche, pricing, trading, risque, data science) : **un double-clic, rien à installer, tout reste sur ton ordinateur.** Elle marche aussi sur téléphone.

Elle est pensée pour une préparation quotidienne de 30 à 45 minutes, pas pour être lue d'une traite : on répond d'abord (à voix haute), on regarde la solution ensuite, et l'outil repose chaque question au bon moment.

## Démarrer

- **Windows** : double-clic sur `Ouvrir.bat` (ou directement sur `index.html`).
- **Mac / Linux** : ouvrir `index.html` dans un navigateur (Chrome, Firefox, Edge, Safari).
- **Téléphone** : publier le dossier avec GitHub Pages (voir plus bas), ou copier le dossier sur le téléphone et ouvrir `index.html`.

Sur téléphone, la barre du bas garde les cinq sections du quotidien ; les autres sont sous « Plus ».

Pas de serveur, pas de compte, pas de connexion Internet : la page ne charge rien de l'extérieur et n'envoie rien. La progression est enregistrée dans le navigateur ; **Réglages → Exporter** crée une sauvegarde à réimporter ailleurs (autre navigateur, téléphone).

**Synchroniser téléphone et ordinateur** (facultatif, Réglages) : la progression est chiffrée sur l'appareil (AES-GCM, clé tirée d'une phrase de passe), puis déposée dans un dépôt GitHub **privé** qui t'appartient ; chaque appareil la fusionne avec la sienne, élément par élément (la modification la plus récente l'emporte, les historiques s'additionnent sans doublon). C'est automatique : à l'ouverture, une vingtaine de secondes après chaque réponse, au retour du réseau. Hors ligne, rien ne change : la synchronisation reprend dès que le réseau revient. Il faut une fois : un dépôt privé vide, un jeton GitHub « fine-grained » limité à ce dépôt (permission *Contents : Read and write*) et une phrase de passe ; le deuxième appareil se configure en collant un **code de liaison**. Le jeton et la phrase de passe restent dans le navigateur de chaque appareil et ne sont jamais synchronisés. « Tout effacer » n'efface que l'appareil : la copie synchronisée revient à la synchronisation suivante.

## Ce qu'il y a dedans

| Écran | À quoi il sert |
|---|---|
| **Aujourd'hui** | Le programme du jour, le compte à rebours jusqu'au prochain entretien, la question du jour |
| **Cours** | Un cours complet en 23 chapitres, des probabilités au calcul stochastique, au pricing (exotiques et énergie compris), au risque, au market making, au machine learning et au code : définitions, démonstrations complètes ligne à ligne, exemples chiffrés, 160 exercices à réponse vérifiée, 21 simulations interactives, et des liens vers les fiches de révision correspondantes (voir plus bas) |
| **Révisions** | 781 questions en répétition espacée : une question ratée revient le lendemain, une question facile dans quelques semaines. Session du jour, révision par thème, banque consultable avec recherche |
| **Banque de questions** | Toutes les fiches rangées comme un sommaire : index des thèmes, puis groupes par chapitre du cours (ou par famille pour les casse-têtes), triés par difficulté, chaque variante sous son problème. Filtres par statut (jamais vue, à revoir, en cours, maîtrisée), difficulté, poste, essentiels ; recherche plein texte (<kbd>/</kbd>). Une ligne se déplie sur place (énoncé, solution, liens vers le cours et le QCM). Les filtres restent dans l'adresse ; « Réviser cette sélection » lance une session sur les 15 moins maîtrisées |
| **Recherche** | <kbd>Ctrl</kbd> <kbd>K</kbd> (ou <kbd>⌘</kbd> <kbd>K</kbd>, ou le bouton en haut de la barre latérale) : pages, chapitres et sections du cours, questions, casse-têtes et guides dans une seule liste, au clavier |
| **QCM** | Une question à choix multiples pour **chacune** des fiches (casse-têtes et variantes compris). Les mauvaises réponses sont des pièges courants (formule voisine, cas oublié, intuition trompeuse) et **chaque** réponse est expliquée après coup, la bonne comme les fausses. Pensé pour découvrir une notion en jouant : avant de répondre, « Voir le cours d'abord » affiche la section du cours qui l'explique (ou un indice), et « Je ne sais pas encore » montre la réponse sans pénalité ; après la réponse, la **correction détaillée** rappelle la bonne réponse et sa justification, donne la solution rédigée pas à pas de la fiche (avec le piège classique) et le point de cours en extrait, ouvert d'office après une erreur. La section est celle qui cite la fiche ; pour une fiche qu'aucun chapitre ne cite, seul le chapitre du domaine est proposé (le bon chapitre est trouvé environ 9 fois sur 10, la bonne section seulement 6 fois sur 10). Trois entrées : par domaine, par chapitre du cours, ou en parties classées. Les longueurs des réponses sont équilibrées (la bonne n'est nettement la plus longue que dans 13 % des questions), pour qu'on ne puisse pas deviner à la forme. Sessions de 10 par domaine ou tous domaines (d'abord les questions ratées, puis les jamais vues), bilan et « refaire mes erreurs ». Progression à part : répondre au QCM ne change pas le planning des révisions |
| **Calcul mental** | Format « 80 questions en 8 minutes », sprint de 2 minutes, ordres de grandeur (estimer à 5 % près), **probabilités rapides** (dés, pièces, cartes, urnes, à l'infini), **pricing d'options de tête** (calls et straddles à la monnaie, parité, forwards, delta, vega, vol implicite d'un straddle), suites logiques, entraînement libre ; courbes de progression |
| **Entretien blanc** | Un entretien complet et chronométré, composé pour un type de maison (hedge fund, teneur de marché, banque, risque, data) : présentation, un de tes projets, technique, motivation. Après une question sur deux environ, l'intervieweur **relance** (« et avec trois dés ? », « quelle limite ? ») ; tu réponds, puis tu vois la réponse attendue. L'intervieweur peut aussi lire chaque question à voix haute (synthèse vocale du navigateur, en français ou en anglais). Et des consignes à coller dans l'application Claude pour un **entretien oral en mode vocal** |
| **Test en ligne** | Le format des tests de présélection : questions chiffrées tirées de la banque selon le type de poste, chrono global, navigation libre entre les questions, corrigé à la fin (Entretien blanc → Test en ligne) |
| **Casse-têtes** | Toutes les énigmes qui tombent en entretien quant, recensées sur une vingtaine de sources publiques et dédoublonnées. Chaque **variante** d'un problème classique est une énigme à part entière (énoncé, indice, correction), rangée sous son problème d'origine, avec un lien dans les deux sens. Onze familles (logique, pesées, stratégie, probabilités, dénombrement, nombres, invariants, recherche optimale, géométrie, vitesses et calendriers, estimations de Fermi), recherche, filtres, compteur des énigmes **jamais vues**, tirage au hasard ou session de 5, notation reliée à la répétition espacée. Un casse-tête jamais vu est proposé chaque jour sur l'accueil |
| **Market making** | « Fais-moi un marché sur la somme de quatre dés » : tu cotes bid/ask, des contreparties (dont certaines informées) traitent, l'information arrive tour par tour ; bilan avec avantage à la valeur juste et sélection adverse. Onglet **Paris répétés** : combien miser sur un pari favorable ? Ta richesse comparée à Kelly, demi-Kelly et double Kelly sur les mêmes tirages |
| **Mes histoires** | Les réponses de parcours et de motivation (présente-toi, pourquoi le quant, stage actuel, échec, IA…), en français **et en anglais**, avec consignes, compteur de durée à l'oral et chrono de répétition ; elles peuvent être ajoutées aux consignes de l'entretien oral avec Claude pour qu'il les challenge |
| **Journal** | Tes vrais entretiens : liste de préparation J−7 / J−1 / Jour J, **fiche de préparation imprimable** par entretien (tes notes, présentation, « pourquoi nous », questions à poser, les 15 questions techniques à revoir pour ce type de maison), et les questions posées deviennent des fiches de révision |
| **Guides** | Méthode pour répondre, plan de préparation, ce que testent les différentes maisons, antisèche de formules, défense de tes projets, astuces de calcul, lectures |
| **Campagne** | Les niveaux à battre, comme dans un jeu de niveaux : ta candidature racontée en 8 mondes (de l'envoi du CV à l'offre), 63 niveaux de QCM sur une carte, 1 étoile à 60 % pour passer, 2 à 80 %, 3 sans faute, un boss par monde. Les questions changent à chaque partie et les ratées reviennent en priorité ; le contenu reste accessible partout ailleurs |
| **Carrière** | Le mode jeu, désactivable dans les Réglages (on retrouve alors exactement la version d'avant). Un bouton **Continuer** lance toujours la prochaine action utile. Niveaux et rangs (de stagiaire à légende du desk) calculés à partir de ta progression réelle, historique compris, sans farming possible. **Quêtes** du jour choisies selon tes points faibles et **coffre du jour** (XP, joker de série ou couleur) quand elles sont faites. **Combos** au QCM (bonus plafonné). **Épreuves** (boss) chronométrées par domaine, corrigées à la fin, avec médailles. **Desk** : un capital virtuel de 100 000 € ; on mise sur sa propre victoire à une épreuve, avec la probabilité estimée et la mise de Kelly affichées, et le market making y entre aussi (courbe de capital, drawdown). **Arbre de compétences**, **succès** dont des cachés, **couleurs d'accent** à débloquer, série protégée par des jokers, célébration de niveau (réduite si le système demande moins d’animations) et sons discrets, coupés par défaut (activables dans les Réglages). Barème complet affiché |
| **Usine, classement et collection** | Dans Carrière : l'**usine du quant** (une machine par chapitre, qui produit du capital même application fermée, ralentit puis s'enraye quand des révisions sont en retard, améliorations et entrepôt à acheter) ; les **parties classées** au QCM avec une cote Elo par domaine, des ligues (Bronze à Légende) et des questions calées sur ton niveau ; la **collection** de cartes (une par fiche maîtrisée, quatre raretés, sets à compléter) ; un **événement par semaine** sur un domaine et un **bonus de retour** après une absence |
| **Progrès** | Maîtrise par thème, activité, questions les plus ratées, révisions à venir |

### La banque de questions

| Thème | Fiches | Thème | Fiches |
|---|---|---|---|
| Casse-têtes | 363 | Probabilités | 90 |
| Produits dérivés et pricing | 58 | Statistiques et économétrie | 41 |
| Code et algorithmique | 39 | Calcul stochastique | 37 |
| Marchés et trading | 33 | Machine learning | 31 |
| Projets types | 30 | Taux, crédit et XVA | 27 |
| Chiffres à connaître | 16 | Motivation et parcours | 16 |

Toutes les formules (fiches, guides, simulations) sont écrites en LaTeX et rendues par KaTeX, hors ligne ; un test vérifie que chacune se compile et qu'aucun symbole mathématique ne reste en texte simple.

Chaque fiche a une solution rédigée, souvent un indice, le **piège classique** et les **relances probables** de l'intervieweur ; la plupart ont aussi une formulation en anglais (touche `e`). Les 474 questions à réponse chiffrée acceptent `1/6`, `0,1667`, `16,7 %`, `e^-1`, `√2/2`…

**Chaque réponse chiffrée est vérifiée par un calcul indépendant** dans `tests/verifs.py` : dénombrement exhaustif, chaîne de Markov résolue en fractions exactes, intégration numérique, programmation dynamique ou Monte-Carlo à graine fixe. Les prix d'options, par exemple, sont recalculés par intégration contre la densité log-normale, sans utiliser la formule de Black-Scholes. Une fiche ajoutée sans vérification fait échouer les tests.

**Les essentiels** (`contenu/essentiels.lst`) : 65 questions qui reviennent le plus souvent, avec leur propre session de révision et leur taux de maîtrise sur l'accueil. Si le temps manque avant un entretien, commencer par elles.

Les fiches « Projets types » reprennent des questions et des chiffres de trois projets de référence sur données synthétiques.

### Le cours

Écrit pour un parcours classes préparatoires puis école d'ingénieurs, avec des lacunes en calcul stochastique et en manipulation des covariances : chaque calcul est fait ligne à ligne, chaque résultat demandé en entretien est démontré.

| Partie | Chapitres |
|---|---|
| Probabilités | 1. Espérance, variance, covariance · 2. Dénombrement, lois discrètes et processus de Poisson · 3. Conditionnement, chaînes de Markov, martingales · 4. Loi normale, log-normale et vecteurs gaussiens |
| Algèbre linéaire et statistiques | 5. Matrices de covariance (positivité, Cholesky, inverse, ACP, facteurs) · 6. Statistiques, régression et backtests |
| Calcul stochastique | 7. Le mouvement brownien · 8. L'intégrale d'Itô et le lemme d'Itô · 9. Équations différentielles stochastiques |
| Pricing | 10. Absence d'arbitrage et probabilité risque-neutre · 11. Black-Scholes (trois dérivations) · 12. Grecques et couverture · 13. Volatilité (smile, SVI, Dupire, Heston, swaps de variance) · 14. Options exotiques et produits structurés · 15. Méthodes numériques · 16. Taux et crédit · 17. Énergie et matières premières |
| Risque, données et marchés | 18. Risque et portefeuille (Markowitz, VaR, GARCH, Kelly) · 19. Market making et microstructure · 20. Machine learning |
| Programmation | 21. Code et algorithmique (méthode, complexité, techniques, Python, C++, SQL) |
| Entretiens | 22. Formats et témoignages par entreprise (sources citées), plan de six semaines, ressources |

- **Formules** rendues par KaTeX, embarqué dans `app/vendor/katex` (licence MIT) : aucune connexion nécessaire.
- **Exercices** : la réponse tapée est vérifiée (fractions, décimaux, `e^-1`…), et la solution détaillée est repliée. Comme pour les fiches, **chaque réponse est recalculée indépendamment** dans `tests/verifs_cours.py` (dénombrement exact, intégration numérique, Monte-Carlo à graine fixe, différences finies, schéma d'EDP…).
- **Simulations** : loi des grands nombres et TCL, nuages corrélés, quadrants gaussiens, trajectoires browniennes, vérification du lemme d'Itô, ruine du joueur, Black-Scholes, arbre binomial, Monte-Carlo antithétique, Kelly, Ornstein-Uhlenbeck, tranche SVI, couverture en delta, temps d'attente d'un motif, moindres carrés et erreur de mesure, prix d'une obligation (duration, convexité), sélection adverse de Glosten-Milgrom, descente de gradient.
- **Les 15 démonstrations à savoir refaire sans notes** (variance d'une somme, Bayes, ruine du joueur, Itô, Black-Scholes, gamma-theta, MCO, VaR, Kelly…) : une liste à cocher en tête du sommaire, avec un lien vers chacune.
- **Liens avec l'entraînement** : chaque chapitre liste ses fiches (« S'entraîner sur ces fiches » lance une session dédiée) ; sous la solution d'une fiche, « Revoir le cours » ramène au chapitre qui la démontre. Chaque chapitre s'imprime (ou s'enregistre en PDF) avec ses solutions, pour travailler sur papier.
- Les chapitres sont des fichiers Markdown lisibles dans `contenu/cours/` (encadrés `:::theoreme`, `:::preuve`, `:::exercice`…, formules entre `$`, renvois `[[n:id-du-chapitre]]` qui deviennent le numéro du chapitre avec un lien) ; `python construire.py` les valide et régénère `app/cours.js`.
- Les chapitres techniques ont été relus par des relecteurs indépendants chargés de chercher les erreurs mathématiques (en recalculant chaque valeur) ; leurs corrections sont intégrées.

### Raccourcis clavier (révisions et entretien blanc)

`espace` voir la solution · `i` indice · `e` français / anglais · `l` écouter la question · `1` raté · `2` difficile · `3` bon · `4` facile

## Ajouter ou corriger une question

Les questions sont des fichiers texte lisibles dans `contenu/` :

```
=== proba-deux-des-somme-7
theme: probas
niveau: 1
profils: mm hf banque data
type: numerique
reponse: 1/6
--- question
On lance deux dés équilibrés. Quelle est la probabilité que la somme fasse 7 ?
--- en
You roll two fair dice. What is the probability that the sum is 7?
--- indice
--- solution
--- piege
--- relances
- une relance par ligne
```

Les formules s'écrivent en LaTeX entre `$…$` (ou `$$…$$` sur une ligne à part) ; un dollar se note `\$`. Une fiche porte en plus `categorie:` et `titre:` pour figurer dans la section Casse-têtes (familles listées dans `construire.py`). Une variante est une fiche complète qui porte `parent: <id du problème d'origine>` (elle hérite de son thème, de sa famille, de ses profils et de son niveau, sauf mention contraire) ; `voir: id1 id2` relie des problèmes voisins. Les variantes des casse-têtes sont dans `contenu/ctv_*.txt`.

Les QCM sont dans `contenu/qcm/*.txt`, un bloc par question (plusieurs blocs peuvent viser la même fiche ; `=== cours:<chapitre>` vise un chapitre du cours, avec un énoncé obligatoire) :

```
=== proba-monty-hall
? Énoncé facultatif (par défaut, celui de la fiche)
+ Bonne réponse
  Pourquoi elle est juste (ligne indentée).
- Piège courant
  Pourquoi c'est faux.
```

Il faut exactement une bonne réponse, de 3 à 5 réponses, et une explication pour chacune ; `construire.py` écrit `app/qcm.js`, et `tests/test_qcm.py` vérifie que chaque fiche a son QCM. `python outils/formules.py fichier.txt` propose une conversion des formules écrites en texte simple, à relire.

Puis `python construire.py` régénère `app/banque.js` (que la page charge). Pour une question numérique, ajouter sa vérification dans `tests/verifs.py`. Les questions posées en vrai s'ajoutent plus simplement depuis le Journal, sans toucher aux fichiers.

## Architecture

```
index.html              la page (ouvrable directement, aucun serveur)
Ouvrir.bat              lanceur Windows
construire.py           contenu/ → app/banque.js et sw.js (bibliothèque standard Python)
icones.py               génère les icônes PNG
manifest.webmanifest    installation sur téléphone
sw.js                   généré : cache hors ligne (http(s) seulement)
artefact.html           généré : variante pour une page privée claude.ai (export par copie, sans impression)
contenu/*.txt           les fiches, par thème
contenu/guides/*.md     les guides
contenu/essentiels.lst  les questions à maîtriser en priorité
contenu/cours/*.md      les chapitres du cours
cours.py                lecture et validation des chapitres (blocs, exercices, formules, liens vers les fiches)
app/banque.js           généré : ne pas modifier à la main
app/cours.js            généré : les chapitres du cours
app/widgets.js          les simulations interactives du cours (canvas)
app/vendor/katex/       KaTeX 0.16.11 (rendu des formules, licence MIT)
app/outils.js           Markdown simple, lecture des réponses numériques, dates, hasard reproductible
app/srs.js              répétition espacée (variante de SM-2) et file du jour
app/calcul.js           générateurs de calcul mental et de suites (décimaux exacts)
app/marche.js           moteur du jeu de market making (dés, cartes sans remise)
app/kelly.js            jeu de paris répétés (critère de Kelly)
app/app.js              état, sauvegarde locale, navigation, export/import
app/vues/*.js           un fichier par écran
tests/test_banque.py    format des fiches, banque à jour, réponses vérifiées
tests/verifs.py         une vérification indépendante par réponse chiffrée
tests/test_cours.py     chapitres bien formés, cours.js à jour, exercices vérifiés
tests/verifs_cours.py   une vérification indépendante par exercice du cours
tests/js/               tests des modules JavaScript (node --test)
tests/navigateur.js     parcours complet dans Chromium (Playwright), mobile compris
```

JavaScript sans framework ni dépendance, scripts classiques (pas de modules ES) pour fonctionner en `file://`.

## Tests

```bash
python -m unittest            # depuis ce dossier : banque, vérifications, JS (si Node), navigateur (si Playwright)
node --test tests/js/modules.test.js
node tests/navigateur.js captures/   # parcours complet, avec captures d'écran
```

## Hébergement

Ce dépôt est autonome : aucun serveur, aucune dépendance.

La version publique du projet est mise à jour automatiquement à chaque modification (voir `outils/publier.py` et `.github/workflows/publier.yml`).

### Sur téléphone avec GitHub Pages

Dans ce dépôt : Settings → Pages → « Deploy from a branch », branche `main`, dossier `/`. L'application est alors accessible à l'adresse `https://<ton-compte>.github.io/prepa-entretiens/`. Servie ainsi, l'application s'**installe** sur l'écran d'accueil du téléphone (menu du navigateur → « Ajouter à l'écran d'accueil ») et fonctionne **hors connexion** grâce à son service worker (`sw.js`, généré par `construire.py`). La page ne contient aucune donnée personnelle (ta progression reste dans chaque navigateur) ; mais si le dépôt est public, les fiches « Projets types » et le profil par défaut sont des exemples génériques, sans donnée personnelle. Pour passer ta progression du PC au téléphone : Réglages → Exporter, puis Importer sur le téléphone.

## Limites

- La progression vit dans le navigateur : vider les données du site l'efface. Exporte régulièrement.
- Les notes en révision sont auto-évaluées : leur valeur dépend de ton honnêteté.
- Les descriptions des processus de recrutement (guides, chapitre 17 du cours) résument des pages officielles et des témoignages anonymes consultés en novembre 2026 : ce sont des tendances, à revérifier avant chaque entretien.
- Le cours a été rédigé avec l'aide d'une IA. Les réponses chiffrées sont vérifiées par les tests, mais le texte peut contenir des imprécisions : en cas de doute, refais le calcul (c'est aussi le meilleur entraînement).
- Les fiches de projets supposent les versions actuelles des projets ; si tu modifies un projet, mets à jour `contenu/projets.txt`.
