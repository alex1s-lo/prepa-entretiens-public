# Comment répondre à une question technique

En entretien quant, la bonne réponse compte, mais la façon d'y arriver compte autant. L'intervieweur veut voir comment tu penses, parce que c'est ce qu'il aura en face de lui tous les jours. Un candidat qui se trompe en raisonnant à voix haute bat souvent un candidat qui donne le bon chiffre après deux minutes de silence.

## Les six étapes

1. **Reformule la question.** « Si je comprends bien, on lance les dés jusqu'à… et on cherche l'espérance de… ? » Tu évites de répondre à côté et tu gagnes dix secondes.
2. **Clarifie les hypothèses.** Dés équilibrés ? Tirage avec ou sans remise ? Taux nuls ? Si l'intervieweur dit « à toi de voir », choisis l'hypothèse la plus simple et dis-le.
3. **Annonce ta démarche avant de calculer.** « Je vais conditionner sur le premier lancer », « Je pose un état par préfixe de la séquence », « C'est une martingale arrêtée ». Même si le calcul échoue, l'idée est notée.
4. **Commence par un cas simple.** n = 1, n = 2, une seule période, un seul dé. Le cas simple donne souvent la forme générale, et montre de la méthode.
5. **Calcule en parlant.** Écris lisiblement (papier ou tableau virtuel), donne les résultats intermédiaires.
6. **Vérifie.** Ordre de grandeur, cas limite (p = 0, p = 1, σ → 0), symétrie, unité. « 14,7 lancers pour voir les six faces : plus que 6, moins que 6 × 6, ça tient. »

## Quand tu bloques

- Dis ce que tu sais : « Je sais que l'espérance s'écrit comme une somme sur… mais je ne vois pas encore comment la calculer. »
- Propose une version plus simple du problème, ou une simulation mentale (« si je le simulais, je ferais… »).
- Demande si tu peux faire une hypothèse : c'est une question normale, pas un aveu de faiblesse.
- Accepte l'indice et rebondis vite : savoir utiliser un indice est une compétence évaluée.
- Ne reste jamais plus de 20 à 30 secondes en silence total.

## Quand tu t'es trompé

Corrige simplement : « Ah, j'ai compté (6,6) deux fois, donc 11 cas et non 12. » Pas d'excuse, pas de panique. Chez un teneur de marché, l'intervieweur peut te contredire exprès alors que tu as raison : vérifie, puis maintiens ta réponse calmement si elle est juste.

## Les questions ouvertes (« comment ferais-tu… ? »)

Structure : objectif → données → méthode → validation → limites. Par exemple, « Comment construirais-tu un signal de momentum ? » : ce qu'on prédit et à quel horizon ; quelles données (point-in-time, sans biais du survivant) ; la construction ; le backtest (walk-forward, coûts) ; les risques (crowding, retournements, sur-apprentissage).

## Le code en direct

- Commence par la solution simple qui marche, annonce sa complexité, puis améliore.
- Nomme bien tes variables, teste sur un petit exemple à la main, pense aux cas limites (liste vide, un seul élément, valeurs égales).
- Parle de ce que tu ferais avec plus de temps (tests, vectorisation).

## Ce qui fait la différence

- **Les relances.** Chaque fiche de l'application liste celles qu'on te posera probablement : entraîne-toi à y répondre, pas seulement à la question initiale.
- **La concision.** Une réponse de motivation dure une minute, pas cinq.
- **L'honnêteté.** « Je ne sais pas, mais voilà comment je chercherais » vaut mieux qu'une réponse inventée, surtout sur tes projets.
