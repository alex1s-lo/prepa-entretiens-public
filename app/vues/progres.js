// Progrès : maîtrise par thème, activité, calcul mental, entretiens blancs, questions les plus ratées.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  function rendre(main) {
    const etat = A.etat;
    const toutes = A.fiches();
    const jour = A.aujourdhui();
    const themes = Object.keys(A.banque().themes).concat(etat.perso.length ? ['perso'] : []);
    const vues = toutes.filter(function (f) { return etat.cartes[f.id]; }).length;
    const maitriseGlobale = toutes.length ? toutes.reduce(function (s, f) { return s + P.srs.maitrise(etat.cartes[f.id]); }, 0) / toutes.length : 0;
    let html = '<h1>Progrès</h1><div class="grille">' +
      '<div class="carte"><div class="chiffre">' + vues + ' / ' + toutes.length + '</div><div class="legende">questions déjà travaillées</div></div>' +
      '<div class="carte"><div class="chiffre">' + Math.round(100 * maitriseGlobale) + ' %</div><div class="legende">maîtrise moyenne de la banque</div></div>' +
      '<div class="carte"><div class="chiffre">' + A.serie() + ' j</div><div class="legende">série en cours</div></div>' +
      '<div class="carte"><div class="chiffre">' + etat.entretiens.length + '</div><div class="legende">entretiens blancs</div></div></div>';

    html += '<div class="carte"><h2 style="margin-top:0">Maîtrise par thème</h2><p class="legende">Une question est maîtrisée quand tu peux la laisser trois semaines sans l’oublier.</p>' +
      themes.map(function (t) {
        const l = toutes.filter(function (f) { return f.theme === t; });
        if (!l.length) return '';
        const m = l.reduce(function (s, f) { return s + P.srs.maitrise(etat.cartes[f.id]); }, 0) / l.length;
        const vu = l.filter(function (f) { return etat.cartes[f.id]; }).length;
        return '<div class="theme-ligne"><a href="#revisions/onglet=themes/theme=' + t + '/mode=libre">' + o.echapper(A.nomTheme(t)) + '</a>' +
          '<div class="barre"><span style="width:' + Math.round(100 * m) + '%"></span></div><span class="petit doux">' + Math.round(100 * m) + ' % · ' + vu + '/' + l.length + '</span></div>';
      }).join('') + '</div>';

    // activité des 28 derniers jours
    const jours = [];
    for (let k = 27; k >= 0; k--) jours.push(o.ajouterJours(jour, -k));
    const valeurs = jours.map(function (j) { const x = etat.jours[j] || {}; return (x.revues || 0) + (x.calcul ? Math.ceil(x.calcul / 10) : 0) + 5 * (x.entretiens || 0) + 2 * (x.marche || 0); });
    const max = Math.max.apply(null, valeurs.concat([1]));
    html += '<div class="carte"><h2 style="margin-top:0">Activité (4 semaines)</h2><div class="histogramme" role="img" aria-label="Activité quotidienne">' +
      valeurs.map(function (v, i) {
        return '<span class="' + (v ? '' : 'vide') + '" style="height:' + Math.max(3, Math.round(100 * v / max)) + '%" title="' + o.dateLisible(jours[i]) + ' : ' + v + '"></span>';
      }).join('') + '</div><div class="axe">' + jours.map(function (j, i) { return '<span>' + (i % 7 === 0 || i === 27 ? j.slice(8) : '') + '</span>'; }).join('') + '</div>' +
      '<p class="legende">Révisions + calcul (par dizaine) + entretiens blancs (×5) + parties de market making (×2).</p></div>';

    const rates = toutes.filter(function (f) { const e = etat.cartes[f.id]; return e && e.rates > 0; })
      .sort(function (a, b) { return etat.cartes[b.id].rates - etat.cartes[a.id].rates; }).slice(0, 12);
    if (rates.length) {
      html += '<div class="carte"><h2 style="margin-top:0">Les plus ratées</h2><ul>' + rates.map(function (f) {
        return '<li><a href="#revisions/fiche=' + encodeURIComponent(f.id) + '">' + o.echapper(o.resume(f.question, 120)) + '</a> <span class="etiquette erreur">' +
          etat.cartes[f.id].rates + ' raté' + (etat.cartes[f.id].rates > 1 ? 's' : '') + '</span></li>';
      }).join('') + '</ul></div>';
    }

    const prevision = P.srs.previsions(toutes, etat.cartes, jour, 14);
    const pmax = Math.max.apply(null, prevision.concat([1]));
    html += '<div class="carte"><h2 style="margin-top:0">Révisions à venir (14 jours)</h2><div class="histogramme">' + prevision.map(function (v, i) {
      return '<span class="' + (v ? '' : 'vide') + '" style="height:' + Math.max(3, Math.round(100 * v / pmax)) + '%" title="' + o.dateLisible(o.ajouterJours(jour, i)) + ' : ' + v + '"></span>';
    }).join('') + '</div><div class="axe">' + prevision.map(function (v, i) { return '<span>' + (i === 0 ? 'auj.' : i % 2 === 0 ? '+' + i : '') + '</span>'; }).join('') + '</div></div>';

    const calc = etat.calcul.filter(function (s) { return s.format === 'test80'; }).slice(-30);
    if (calc.length >= 2) {
      html += '<div class="carte"><h2 style="margin-top:0">Calcul mental : 80 en 8 minutes</h2>' +
        P.composants.courbe(calc.map(function (s) { return s.justes; }), calc.map(function (s) { return s.date; })) + '</div>';
    }
    if (etat.entretiens.length >= 2) {
      const l = etat.entretiens.slice(-30);
      html += '<div class="carte"><h2 style="margin-top:0">Entretiens blancs : score</h2>' +
        P.composants.courbe(l.map(function (e) { return e.score; }), l.map(function (e) { return e.date + ' ' + e.profil; })) + '</div>';
    }
    main.innerHTML = html;
  }

  A.enregistrerVue({ id: 'progres', titre: 'Progrès', icone: '↗', ordre: 10, rendre: rendre });
})(this);
