// Jeu de paris répétés : quelle fraction de sa richesse miser sur un pari favorable ? (critère de Kelly)
// Les issues sont tirées à l'avance : on peut rejouer la même suite de pile/face avec d'autres stratégies.
(function (racine) {
  'use strict';
  const outils = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Prepa.outils;

  // Fraction de Kelly pour un pari gagné avec probabilité p, qui rapporte b par unité misée.
  function fractionKelly(p, b) {
    return Math.max(0, (b * p - (1 - p)) / b);
  }

  // Croissance logarithmique espérée par pari en misant la fraction f.
  function croissance(p, b, f) {
    if (f >= 1) return -Infinity;
    return p * Math.log(1 + b * f) + (1 - p) * Math.log(1 - f);
  }

  function nouvellePartie(config, alea) {
    const a = alea || Math.random;
    const c = Object.assign({ p: 0.6, b: 1, tours: 40, richesse: 100 }, config || {});
    const issues = [];
    for (let i = 0; i < c.tours; i++) issues.push(a() < c.p);
    return { config: c, issues: issues, rang: 0, richesse: c.richesse, chemin: [c.richesse], fractions: [], fini: false };
  }

  function parier(partie, fraction) {
    if (partie.fini) throw new Error('partie terminée');
    if (!(fraction >= 0 && fraction <= 1)) throw new Error('fraction entre 0 et 1');
    const gagne = partie.issues[partie.rang];
    const mise = partie.richesse * fraction;
    partie.richesse += gagne ? mise * partie.config.b : -mise;
    partie.richesse = Math.max(0, partie.richesse);
    partie.chemin.push(partie.richesse);
    partie.fractions.push(fraction);
    partie.rang += 1;
    if (partie.rang >= partie.issues.length || partie.richesse <= 1e-9) partie.fini = true;
    return { gagne: gagne, mise: mise, richesse: partie.richesse };
  }

  // Chemin de richesse d'une stratégie à fraction constante sur les mêmes issues.
  function cheminConstant(partie, fraction) {
    let w = partie.config.richesse;
    const chemin = [w];
    for (let i = 0; i < partie.issues.length; i++) {
      w += partie.issues[i] ? w * fraction * partie.config.b : -w * fraction;
      chemin.push(w);
    }
    return chemin;
  }

  // Richesse médiane après n paris à fraction constante (calcul exact par la loi binomiale).
  function medianeApres(p, b, f, n, w0) {
    let cumul = 0;
    const lp = Math.log(p), lq = Math.log(1 - p);
    let lc = 0; // log C(n, k), mis à jour de proche en proche
    for (let k = 0; k <= n; k++) {
      if (k > 0) lc += Math.log((n - k + 1) / k);
      cumul += Math.exp(lc + k * lp + (n - k) * lq);
      if (cumul >= 0.5) return w0 * Math.pow(1 + b * f, k) * Math.pow(1 - f, n - k);
    }
    return w0 * Math.pow(1 + b * f, n);
  }

  const kelly = { fractionKelly: fractionKelly, croissance: croissance, nouvellePartie: nouvellePartie, parier: parier,
    cheminConstant: cheminConstant, medianeApres: medianeApres };
  if (typeof module !== 'undefined' && module.exports) module.exports = kelly;
  else (racine.Prepa = racine.Prepa || {}).kelly = kelly;
})(this);
