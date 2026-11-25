// Carrière : niveau et rang, quêtes du jour et de la semaine, épreuves (boss), arbre de compétences, succès.
// Tout est calculé par jeu.js à partir de la progression réelle ; cet écran ne fait qu'afficher et lancer les épreuves.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const MEDAILLES = { or: 'Or', argent: 'Argent', bronze: 'Bronze' };
  const SOURCES = {
    fiches: 'Fiches maîtrisées', qcm: 'QCM', cours: 'Cours', entrainement: 'Entraînement (calcul, oral, marché)',
    carriere: 'Histoires et vrais entretiens', quetes: 'Quêtes', boss: 'Épreuves'
  };

  function barre(part, classe) {
    return '<div class="barre' + (classe ? ' ' + classe : '') + '"><span style="width:' + Math.max(0, Math.min(100, Math.round(100 * part))) + '%"></span></div>';
  }
  function pips(n) {
    let h = '<span class="pips" aria-label="Niveau ' + n + ' sur 5">';
    for (let k = 1; k <= 5; k++) h += '<i class="' + (k <= n ? 'plein' : '') + '"></i>';
    return h + '</span>';
  }
  // Emblème du rang : un hexagone dont le remplissage suit la progression vers le niveau suivant.
  function embleme(niveau, part) {
    const r = 34, cx = 40, cy = 40;
    const pts = [];
    for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    const perimetre = 6 * r;
    return '<svg class="embleme" viewBox="0 0 80 80" aria-hidden="true">' +
      '<polygon points="' + pts.join(' ') + '" class="embleme-fond"/>' +
      (part > 0.005 ? '<polygon points="' + pts.join(' ') + '" class="embleme-trait" stroke-dasharray="' + (perimetre * part).toFixed(1) + ' ' + perimetre + '"/>' : '') +
      '<text x="40" y="47" text-anchor="middle">' + niveau + '</text></svg>';
  }

  function rendre(main) {
    if (!P.jeu) { main.innerHTML = '<h1>Carrière</h1><p>Indisponible.</p>'; return; }
    const r = A.resultatJeu();
    if (!r) { main.innerHTML = '<h1>Carrière</h1><p class="doux">Chargement des données impossible.</p>'; return; }
    const actif = A.jeuActif();
    const part = r.seuilSuivant ? (r.total - r.seuilActuel) / (r.seuilSuivant - r.seuilActuel) : 1;
    const vaincus = r.boss.filter(function (b) { return b.vaincu; }).length;
    const succesObtenus = r.succes.filter(function (s) { return s.obtenu; }).length;
    let h = '<h1>Carrière</h1>';
    if (!actif) h += '<div class="encadre alerte">Le mode carrière est désactivé dans les Réglages : rien n’est perdu, tout est recalculé à partir de ta progression. <a href="#reglages">Le réactiver</a></div>';

    // --- Fiche du joueur
    h += '<section class="carte joueur">' + embleme(r.niveau, part) +
      '<div class="joueur-texte"><p class="tete-partie">Niveau ' + r.niveau + '</p><h2 class="rang">' + o.echapper(r.rang) + '</h2>' +
      barre(part, 'barre-xp') +
      '<p class="legende">' + r.total.toLocaleString('fr-FR') + ' XP' + (r.seuilSuivant ? ' · encore ' + (r.seuilSuivant - r.total).toLocaleString('fr-FR') + ' pour le niveau ' + (r.niveau + 1) : ' · niveau maximal') +
      (r.prochainRang ? ' · prochain rang : ' + o.echapper(r.prochainRang.titre) + ' au niveau ' + r.prochainRang.niveau : '') + '</p></div></section>';
    h += '<div class="grille stats-ct">' +
      '<div class="carte"><div class="chiffre">' + r.serie + ' j</div><div class="legende">série · ' + (r.jokers ? r.jokers + ' joker' + (r.jokers > 1 ? 's' : '') + ' en réserve' : 'un joker tous les 7 jours d’affilée') + '</div></div>' +
      '<div class="carte"><div class="chiffre">' + r.stats.fichesMaitrisees + '</div><div class="legende">fiches maîtrisées sur ' + r.stats.fichesVues + ' travaillées</div></div>' +
      '<div class="carte"><div class="chiffre">' + vaincus + ' / ' + r.boss.length + '</div><div class="legende">épreuves vaincues · ' + succesObtenus + ' succès</div></div></div>';

    // --- Quêtes
    const q = r.quetes;
    const ligneQuete = function (x) {
      return '<li class="quete' + (x.reussie ? ' reussie' : '') + '"><div class="quete-texte"><span class="titre-quete">' + o.echapper(x.titre) + (x.hebdo ? ' <span class="etiquette accent">semaine</span>' : '') + '</span>' +
        '<span class="legende">' + o.echapper(x.detail) + '</span>' + barre(Math.min(1, x.fait / x.cible)) + '</div>' +
        '<div class="quete-droite"><span class="xp-quete">' + (x.reussie ? '✓ ' : '') + '+' + x.xp + ' XP</span><span class="legende">' + Math.min(x.fait, x.cible) + ' / ' + x.cible + '</span>' +
        (x.reussie ? '' : '<a class="bouton" href="' + x.lien + '">Y aller</a>') + '</div></li>';
    };
    h += '<section class="carte"><div class="ligne"><h2 style="margin:0">Quêtes</h2><span class="espace"></span><span class="legende">' +
      q.jour.filter(function (x) { return x.reussie; }).length + ' / ' + q.jour.length + ' aujourd’hui · bonus de ' + q.bonus.xp + ' XP si tout est fait</span></div>' +
      '<p class="legende">Choisies chaque jour selon tes points faibles. Elles se valident toutes seules à partir de ce que tu fais.</p>' +
      '<ul class="quetes">' + q.jour.map(ligneQuete).join('') + ligneQuete(q.semaine) + '</ul></section>';

    // --- Épreuves
    h += '<section><h2>Épreuves</h2><p class="doux">Un test chronométré par domaine, sans explications pendant l’épreuve (comme un vrai test en ligne), corrigé à la fin. ' +
      'Bronze à 60 %, argent (victoire) à 75 %, or à 90 %. Le comité de recrutement mélange tous les domaines.</p><div class="grille-boss">' +
      r.boss.map(function (b) {
        const dom = b.final ? 'Tous les domaines' : b.domaine === 'cours' ? 'Cours' : b.domaine === 'casse-tete' ? 'Casse-têtes' : A.nomTheme(b.domaine);
        return '<div class="carte boss' + (b.final ? ' boss-final' : '') + (b.medaille ? ' medaille-' + b.medaille : '') + '">' +
          '<div class="boss-tete"><span class="boss-nom">' + o.echapper(b.nom) + '</span>' +
          (b.medaille ? '<span class="medaille">' + MEDAILLES[b.medaille] + '</span>' : '') + '</div>' +
          '<div class="legende">' + o.echapper(dom) + ' · ' + b.questions + ' questions · ' + Math.round(b.duree / 60) + ' min</div>' +
          '<div class="legende">' + (b.tentatives ? 'Record ' + Math.round(100 * b.meilleur) + ' % · ' + b.tentatives + ' tentative' + (b.tentatives > 1 ? 's' : '') : 'Jamais affronté') + '</div>' +
          '<a class="bouton' + (b.vaincu ? '' : ' principal') + '" href="#qcm/boss=' + encodeURIComponent(b.id) + '" data-boss="' + o.echapper(b.id) + '">' + (b.vaincu ? 'Rejouer' : 'Affronter') + '</a></div>';
      }).join('') + '</div></section>';

    // --- Arbre de compétences
    const conseillee = r.competences.filter(function (c) { return c.type === 'cours' && c.prete && c.niveau < 3; })
      .sort(function (a, b) { return (a.numero || 0) - (b.numero || 0); })[0];
    const parties = [];
    r.competences.forEach(function (c) { if (parties.indexOf(c.partie) < 0) parties.push(c.partie); });
    const titres = {};
    r.competences.forEach(function (c) { titres[c.id] = c.titre; });
    h += '<section><h2>Compétences</h2><p class="doux">Un chapitre du cours, une compétence : lecture, exercices, maîtrise des fiches reliées et QCM. ' +
      'Les prérequis sont des conseils, rien n’est verrouillé.' + (conseillee ? ' Prochaine étape conseillée : <a href="#cours/c=' + encodeURIComponent(conseillee.id) + '">' + o.echapper(conseillee.titre) + '</a>.' : '') + '</p>' +
      parties.map(function (p) {
        return '<h3 class="partie-cours">' + o.echapper(p) + '</h3><div class="grille-competences">' + r.competences.filter(function (c) { return c.partie === p; }).map(function (c) {
          const lien = c.type === 'cours' ? '#cours/c=' + encodeURIComponent(c.id) : '#casse-tetes';
          const conseil = !c.prete && c.niveau < 2 ? '<span class="legende">Conseillé après : ' + c.prerequis.map(function (x) { return o.echapper(titres[x] || x); }).join(', ') + '</span>' : '';
          return '<a class="competence' + (c.prete ? '' : ' en-attente') + (conseillee && conseillee.id === c.id ? ' conseillee' : '') + '" href="' + lien + '" data-competence="' + o.echapper(c.id) + '">' +
            '<span class="competence-titre">' + o.echapper(c.titre) + '</span>' + pips(c.niveau) +
            barre(c.score) + '<span class="legende">' + Math.round(100 * c.score) + ' %</span>' + conseil + '</a>';
        }).join('') + '</div>';
      }).join('') + '</section>';

    // --- Succès
    h += '<section><h2>Succès <span class="legende">' + succesObtenus + ' / ' + r.succes.length + '</span></h2><div class="grille-succes">' +
      r.succes.map(function (s) {
        const masque = s.cache && !s.obtenu;
        return '<div class="succes-tuile' + (s.obtenu ? ' obtenu' : '') + '"><span class="succes-titre">' + (masque ? 'Succès caché' : o.echapper(s.titre)) + '</span>' +
          '<span class="legende">' + (masque ? 'Continue à explorer l’application.' : o.echapper(s.desc)) + '</span>' +
          (s.date ? '<span class="legende">Obtenu le ' + o.dateLisible(s.date) + '</span>' : '') + '</div>';
      }).join('') + '</div></section>';

    // --- Transparence : d'où vient l'XP, et le barème
    const B = P.jeu.BAREME;
    h += '<section class="carte"><h2 style="margin-top:0">D’où vient ton XP</h2>' + Object.keys(SOURCES).map(function (k) {
      return '<div class="theme-ligne"><span>' + SOURCES[k] + '</span>' + barre(r.total ? r.xp[k] / r.total : 0) + '<span>' + r.xp[k].toLocaleString('fr-FR') + '</span></div>';
    }).join('') +
      '<details><summary>Le barème complet</summary><ul class="petit">' +
      '<li>Fiche : ' + B.ficheVue + ' XP par niveau de difficulté à la première révision, puis jusqu’à ' + B.ficheMaitrise + ' de plus quand elle tient trois semaines. Revoir une fiche maîtrisée ne rapporte rien de plus : c’est la mémoire durable qui paie.</li>' +
      '<li>QCM : ' + B.qcmJuste + ' XP par question juste à la dernière tentative, ' + B.qcmCorrige + ' de bonus quand une erreur passée est corrigée. Répondre dix fois à la même question ne rapporte qu’une fois.</li>' +
      '<li>Cours : ' + B.chapitreLu + ' par chapitre lu, ' + B.exercice + ' par exercice réussi, ' + B.demo + ' par démonstration maîtrisée.</li>' +
      '<li>Entraînement : 1 par bonne réponse en calcul mental (100 au plus par session), ' + B.entretienBlanc + ' par entretien blanc plus la moitié du score, ' + B.testEnLigne + ' par test en ligne, ' + B.partieMarche + ' par partie de market making, ' + B.partieKelly + ' par partie de paris.</li>' +
      '<li>Carrière : ' + B.histoire + ' par réponse de parcours écrite, ' + B.vraiEntretien + ' par vrai entretien passé.</li>' +
      '<li>Quêtes : ' + B.quete + ' chacune, ' + B.toutesQuetes + ' de bonus si toutes sont faites, ' + B.queteHebdo + ' pour celle de la semaine. Épreuves : ' + B.boss.bronze + ' / ' + B.boss.argent + ' / ' + B.boss.or + ' selon la meilleure médaille.</li>' +
      '<li>Série : un jour sans activité ne la casse pas si tu as un joker ; tu en gagnes un tous les 7 jours d’affilée (deux au plus).</li>' +
      '</ul></details></section>';
    main.innerHTML = h;
  }

  A.enregistrerVue({ id: 'carriere', titre: 'Carrière', court: 'Carrière', icone: '★', ordre: 9.5, rendre: rendre });
})(this);
