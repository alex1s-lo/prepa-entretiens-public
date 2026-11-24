// Répétition espacée (variante de SM-2) : quand revoir une question, et dans quel ordre la proposer.
// Notes : 0 = raté, 1 = difficile, 2 = bon, 3 = facile.
(function (racine) {
  'use strict';
  const outils = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Prepa.outils;

  const NOTES = ['Raté', 'Difficile', 'Bon', 'Facile'];
  const FACILITE_MIN = 1.3;

  // Renvoie le nouvel état d'une carte après une réponse notée « note » le jour « jour ».
  function planifier(etat, note, jour) {
    if (!(note >= 0 && note <= 3)) throw new Error('note hors de 0 à 3');
    const e = etat ? Object.assign({}, etat) : { rep: 0, intervalle: 0, facilite: 2.5, vu: 0, rates: 0, notes: [] };
    e.notes = (e.notes || []).concat([note]).slice(-12);
    e.vu = (e.vu || 0) + 1;
    e.derniere = jour;
    if (note === 0) {
      e.rep = 0;
      e.intervalle = 0;
      e.facilite = Math.max(FACILITE_MIN, e.facilite - 0.2);
      e.rates = (e.rates || 0) + 1;
    } else {
      if (note === 1) {
        e.intervalle = Math.max(1, Math.round(e.intervalle * 1.2));
        e.facilite = Math.max(FACILITE_MIN, e.facilite - 0.15);
      } else if (note === 2) {
        e.intervalle = e.rep === 0 ? 1 : e.rep === 1 ? 3 : Math.max(e.intervalle + 1, Math.round(e.intervalle * e.facilite));
      } else {
        e.intervalle = e.rep === 0 ? 3 : e.rep === 1 ? 7 : Math.max(e.intervalle + 2, Math.round(e.intervalle * e.facilite * 1.3));
        e.facilite = e.facilite + 0.15;
      }
      e.rep += 1;
    }
    e.intervalle = Math.min(e.intervalle, 120);
    e.echeance = outils.ajouterJours(jour, e.intervalle);
    return e;
  }

  function estDue(etat, jour) {
    return !!etat && etat.echeance <= jour;
  }

  // Maîtrise entre 0 et 1 : 0 jamais vue ou ratée la dernière fois, 1 quand l'intervalle atteint trois semaines.
  function maitrise(etat) {
    if (!etat || !etat.vu) return 0;
    const derniere = etat.notes && etat.notes.length ? etat.notes[etat.notes.length - 1] : 0;
    if (derniere === 0) return 0.05;
    return Math.min(1, 0.2 + 0.8 * etat.intervalle / 21);
  }

  // Poids d'une fiche pour les profils visés : 2 si elle concerne le premier profil, 1 pour les autres, 0 sinon.
  function pertinence(fiche, profils) {
    if (!profils || !profils.length) return 1;
    let meilleur = 0;
    profils.forEach(function (p, rang) {
      if (fiche.profils.indexOf(p) >= 0) meilleur = Math.max(meilleur, rang === 0 ? 2 : 1);
    });
    return meilleur;
  }

  // File de révision du jour : cartes dues (les plus en retard d'abord), puis nouvelles cartes.
  // options : jour, nouveauxMax, nouveauxFaits (déjà introduites aujourd'hui), themes (liste ou null), profils, alea
  function construireFile(fiches, etats, options) {
    const o = options || {};
    const jour = o.jour || outils.jourDe();
    const alea = o.alea || Math.random;
    const garde = function (f) {
      if (o.themes && o.themes.length && o.themes.indexOf(f.theme) < 0) return false;
      if (o.profils && o.profils.length && pertinence(f, o.profils) === 0) return false;
      return true;
    };
    const dues = fiches.filter(function (f) { return garde(f) && estDue(etats[f.id], jour); });
    dues.sort(function (a, b) {
      const ea = etats[a.id].echeance, eb = etats[b.id].echeance;
      return ea < eb ? -1 : ea > eb ? 1 : 0;
    });
    const restant = Math.max(0, (o.nouveauxMax == null ? 15 : o.nouveauxMax) - (o.nouveauxFaits || 0));
    const neuves = fiches.filter(function (f) { return garde(f) && !etats[f.id]; });
    // ordre : niveau croissant, profil prioritaire d'abord, puis thèmes alternés pour varier
    const melangees = outils.melanger(alea, neuves);
    melangees.sort(function (a, b) {
      return (a.niveau - b.niveau) || (pertinence(b, o.profils) - pertinence(a, o.profils));
    });
    const parTheme = {};
    const ordreThemes = [];
    melangees.forEach(function (f) {
      if (!parTheme[f.theme]) { parTheme[f.theme] = []; ordreThemes.push(f.theme); }
      parTheme[f.theme].push(f);
    });
    const choisies = [];
    let encore = true;
    while (choisies.length < restant && encore) {
      encore = false;
      for (let k = 0; k < ordreThemes.length && choisies.length < restant; k++) {
        const pile = parTheme[ordreThemes[k]];
        if (pile.length) { choisies.push(pile.shift()); encore = true; }
      }
    }
    return dues.map(function (f) { return f.id; }).concat(choisies.map(function (f) { return f.id; }));
  }

  // Nombre de cartes dues dans les n prochains jours (pour l'accueil).
  function previsions(fiches, etats, jour, n) {
    const res = [];
    for (let k = 0; k < n; k++) {
      const j = outils.ajouterJours(jour, k);
      res.push(fiches.filter(function (f) { const e = etats[f.id]; return e && (k === 0 ? e.echeance <= j : e.echeance === j); }).length);
    }
    return res;
  }

  const srs = { NOTES: NOTES, planifier: planifier, estDue: estDue, maitrise: maitrise, pertinence: pertinence,
    construireFile: construireFile, previsions: previsions };
  if (typeof module !== 'undefined' && module.exports) module.exports = srs;
  else (racine.Prepa = racine.Prepa || {}).srs = srs;
})(this);
