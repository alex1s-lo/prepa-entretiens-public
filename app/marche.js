// Jeu de tenue de marché : une valeur cachée (somme de dés ou de cartes) est révélée petit à petit. À chaque tour, tu
// cotes un prix d'achat (bid) et de vente (ask) avec un écart limité ; des contreparties arrivent : certaines au hasard
// (bruit), d'autres connaissent l'information du tour suivant (informées). À la fin, ta position est soldée à la vraie valeur.
(function (racine) {
  'use strict';
  const outils = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Prepa.outils;

  const JEUX = {
    des: { nom: 'Somme de dés', detail: 'Somme de N dés à six faces ; un dé est révélé à chaque tour.' },
    cartes: { nom: 'Somme de cartes', detail: 'Somme de N cartes tirées sans remise d’un jeu de 52 (as = 1, valet = 11, dame = 12, roi = 13).' }
  };

  function paquet() {
    const p = [];
    for (let v = 1; v <= 13; v++) for (let c = 0; c < 4; c++) p.push(v);
    return p;
  }

  function nouvellePartie(config, alea) {
    const a = alea || Math.random;
    const c = Object.assign({ jeu: 'des', n: 4, spreadMax: 2, informes: 0.35, arrivees: 2, limite: 6 }, config || {});
    let tirage;
    if (c.jeu === 'cartes') tirage = outils.melanger(a, paquet()).slice(0, c.n);
    else { tirage = []; for (let i = 0; i < c.n; i++) tirage.push(outils.entier(a, 1, 6)); }
    return { config: c, tirage: tirage, revele: 0, position: 0, cash: 0, tours: [], fini: false };
  }

  function revelees(partie) { return partie.tirage.slice(0, partie.revele); }

  // Espérance et écart-type de la valeur cachée sachant « k » éléments révélés.
  function loi(partie, k) {
    const c = partie.config;
    const vus = partie.tirage.slice(0, k);
    const somme = vus.reduce(function (s, x) { return s + x; }, 0);
    const reste = c.n - k;
    if (c.jeu === 'cartes') {
      const deck = paquet();
      vus.forEach(function (v) { deck.splice(deck.indexOf(v), 1); });
      const N = deck.length;
      const m = deck.reduce(function (s, x) { return s + x; }, 0) / N;
      const v = deck.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / N;
      const variance = reste > 0 ? reste * v * (N - reste) / (N - 1) : 0; // tirage sans remise
      return { esperance: somme + reste * m, ecartType: Math.sqrt(variance) };
    }
    return { esperance: somme + reste * 3.5, ecartType: Math.sqrt(reste * 35 / 12) };
  }
  function valeurJuste(partie) { return loi(partie, partie.revele).esperance; }
  function ecartType(partie) { return loi(partie, partie.revele).ecartType; }
  function valeurFinale(partie) { return partie.tirage.reduce(function (s, x) { return s + x; }, 0); }

  function verifierCotation(partie, bid, ask) {
    if (!isFinite(bid) || !isFinite(ask)) return 'Entre un bid et un ask.';
    if (ask <= bid) return 'L’ask doit être strictement au-dessus du bid.';
    if (ask - bid > partie.config.spreadMax + 1e-9) return 'Écart maximal autorisé : ' + partie.config.spreadMax + '.';
    return '';
  }

  // Joue un tour : les contreparties réagissent à la cotation, puis un élément est révélé.
  function coter(partie, bid, ask, alea) {
    const a = alea || Math.random;
    const erreur = verifierCotation(partie, bid, ask);
    if (erreur) throw new Error(erreur);
    if (partie.fini) throw new Error('partie terminée');
    const c = partie.config;
    const juste = valeurJuste(partie);
    const sigma = ecartType(partie);
    const informe = loi(partie, Math.min(c.n, partie.revele + 1)).esperance; // ce que sait l'informé : un élément de plus
    const echanges = [];
    for (let k = 0; k < c.arrivees; k++) {
      const estInforme = a() < c.informes;
      let sens = 'passe';
      if (estInforme) {
        if (informe > ask) sens = 'achete';
        else if (informe < bid) sens = 'vend';
      } else {
        sens = a() < 0.5 ? 'achete' : 'vend';
      }
      // limite de position : au-delà, le teneur n'est plus servi de ce côté
      if (sens === 'achete' && partie.position <= -c.limite) sens = 'passe';
      if (sens === 'vend' && partie.position >= c.limite) sens = 'passe';
      let prix = null, avantage = 0;
      if (sens === 'achete') { prix = ask; partie.position -= 1; partie.cash += ask; avantage = ask - juste; }
      else if (sens === 'vend') { prix = bid; partie.position += 1; partie.cash -= bid; avantage = juste - bid; }
      echanges.push({ contrepartie: estInforme ? 'informée' : 'bruit', sens: sens, prix: prix, avantage: avantage });
    }
    const tour = { numero: partie.tours.length + 1, connu: revelees(partie), bid: bid, ask: ask, juste: juste, ecartType: sigma,
      echanges: echanges, positionApres: partie.position };
    partie.tours.push(tour);
    partie.revele += 1;
    if (partie.revele >= c.n) partie.fini = true;
    return tour;
  }

  function bilan(partie) {
    const valeur = valeurFinale(partie);
    const pnl = partie.cash + partie.position * valeur;
    let avantage = 0, nb = 0, ecartMilieu = 0;
    partie.tours.forEach(function (t) {
      ecartMilieu += Math.abs((t.bid + t.ask) / 2 - t.juste);
      t.echanges.forEach(function (e) { if (e.sens !== 'passe') { avantage += e.avantage; nb += 1; } });
    });
    const parInformes = partie.tours.reduce(function (n, t) {
      return n + t.echanges.filter(function (e) { return e.contrepartie === 'informée' && e.sens !== 'passe'; }).length;
    }, 0);
    return {
      valeur: valeur, pnl: pnl, echanges: nb, avantageAttendu: avantage,
      // ce qui sépare le PnL de l'avantage mesuré à la valeur juste : la chance et la sélection adverse
      ecart: pnl - avantage, ecartMoyenMilieu: partie.tours.length ? ecartMilieu / partie.tours.length : 0,
      parInformes: parInformes, positionFinale: partie.position
    };
  }

  // Conseils lisibles sur un tour joué.
  function commentaire(tour, spreadMax) {
    const milieu = (tour.bid + tour.ask) / 2;
    const ecart = milieu - tour.juste;
    const msgs = [];
    if (Math.abs(ecart) <= 0.25) msgs.push('Milieu bien centré sur l’espérance (' + outils.formaterNombre(tour.juste, 4) + ').');
    else msgs.push('Milieu à ' + outils.formaterNombre(milieu, 4) + ', espérance ' + outils.formaterNombre(tour.juste, 4) +
      ' : tu étais ' + (ecart > 0 ? 'trop haut' : 'trop bas') + ' de ' + outils.formaterNombre(Math.abs(ecart), 3) + '.');
    const informes = tour.echanges.filter(function (e) { return e.contrepartie === 'informée' && e.sens !== 'passe'; });
    if (informes.length) msgs.push('Une contrepartie informée a traité : son ordre t’apprend que l’élément suivant est plutôt ' +
      (informes[0].sens === 'achete' ? 'haut' : 'bas') + '. Décale ta cotation dans ce sens au tour suivant.');
    if (tour.ask - tour.bid < spreadMax && tour.ecartType > 1.5) msgs.push('Tu pouvais coter plus large : l’incertitude est encore grande.');
    return msgs;
  }

  const marche = { JEUX: JEUX, nouvellePartie: nouvellePartie, revelees: revelees, loi: loi, valeurJuste: valeurJuste,
    ecartType: ecartType, valeurFinale: valeurFinale, verifierCotation: verifierCotation, coter: coter, bilan: bilan,
    commentaire: commentaire };
  if (typeof module !== 'undefined' && module.exports) module.exports = marche;
  else (racine.Prepa = racine.Prepa || {}).marche = marche;
})(this);
