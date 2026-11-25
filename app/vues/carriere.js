// Carrière : le hub du mode jeu. Onglets : Aujourd'hui (continuer, quêtes, coffre), Épreuves, Compétences, Desk,
// Succès et style. Tout est calculé par jeu.js à partir de la progression réelle ; cet écran affiche et lance.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const ONGLETS = { jour: 'Aujourd’hui', epreuves: 'Épreuves', competences: 'Compétences', desk: 'Desk', succes: 'Succès et style' };
  const MEDAILLES = { or: 'Or', argent: 'Argent', bronze: 'Bronze' };
  const SOURCES = {
    fiches: 'Fiches maîtrisées', qcm: 'QCM', cours: 'Cours', entrainement: 'Entraînement (calcul, oral, marché)',
    carriere: 'Histoires et vrais entretiens', quetes: 'Quêtes', boss: 'Épreuves', recompenses: 'Combos et coffres'
  };
  let onglet = 'jour';
  try { onglet = racine.sessionStorage.getItem('prepa-carriere-onglet') || 'jour'; } catch (e) { /* sans stockage */ }

  function barre(part, classe) {
    return '<div class="barre' + (classe ? ' ' + classe : '') + '"><span style="width:' + Math.max(0, Math.min(100, Math.round(100 * part))) + '%"></span></div>';
  }
  function pips(n) {
    let h = '<span class="pips" aria-label="Niveau ' + n + ' sur 5">';
    for (let k = 1; k <= 5; k++) h += '<i class="' + (k <= n ? 'plein' : '') + '"></i>';
    return h + '</span>';
  }
  function euros(x) { return Math.round(x).toLocaleString('fr-FR') + ' €'; }
  // Emblème du rang : hexagone dont le contour se remplit vers le niveau suivant.
  function embleme(niveau, part) {
    const r = 34, cx = 40, cy = 40;
    const pts = [];
    for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    const perimetre = 6 * r;
    return '<svg class="embleme" viewBox="0 0 80 80" aria-hidden="true"><polygon points="' + pts.join(' ') + '" class="embleme-fond"/>' +
      (part > 0.005 ? '<polygon points="' + pts.join(' ') + '" class="embleme-trait" stroke-dasharray="' + (perimetre * part).toFixed(1) + ' ' + perimetre + '"/>' : '') +
      '<text x="40" y="47" text-anchor="middle">' + niveau + '</text></svg>';
  }

  // --- En-tête commun : le joueur et le bouton « Continuer » -----------------------------------------------------------
  function enTete(r) {
    const part = r.seuilSuivant ? (r.total - r.seuilActuel) / (r.seuilSuivant - r.seuilActuel) : 1;
    const p = r.prochaine;
    return '<section class="carte joueur">' + embleme(r.niveau, part) +
      '<div class="joueur-texte"><p class="tete-partie">Niveau ' + r.niveau + ' · série ' + r.serie + ' j' + (r.jokers ? ' · ' + r.jokers + ' joker' + (r.jokers > 1 ? 's' : '') : '') + '</p>' +
      '<h2 class="rang">' + o.echapper(r.rang) + '</h2>' + barre(part, 'barre-xp') +
      '<p class="legende">' + r.total.toLocaleString('fr-FR') + ' XP' + (r.seuilSuivant ? ' · encore <strong>' + (r.seuilSuivant - r.total).toLocaleString('fr-FR') + '</strong> pour le niveau ' + (r.niveau + 1) : ' · niveau maximal') +
      (r.prochainRang ? ' · ' + o.echapper(r.prochainRang.titre) + ' au niveau ' + r.prochainRang.niveau : '') + '</p></div>' +
      (p ? '<a class="bouton principal continuer" href="' + p.lien + '" data-continuer><span class="continuer-libelle">Continuer</span><span class="continuer-titre">' + o.echapper(p.titre) + '</span>' +
        '<span class="continuer-detail">' + o.echapper(p.detail) + (p.xp ? ' · +' + p.xp + ' XP' : '') + '</span></a>' : '') + '</section>';
  }

  // --- Onglet Aujourd'hui -------------------------------------------------------------------------------------------------
  function ongletJour(r) {
    const q = r.quetes;
    const ligneQuete = function (x) {
      return '<li class="quete' + (x.reussie ? ' reussie' : '') + '"><div class="quete-texte"><span class="titre-quete">' + o.echapper(x.titre) + (x.hebdo ? ' <span class="etiquette accent">semaine</span>' : '') + '</span>' +
        '<span class="legende">' + o.echapper(x.detail) + '</span>' + barre(Math.min(1, x.fait / x.cible)) + '</div>' +
        '<div class="quete-droite"><span class="xp-quete">' + (x.reussie ? '✓ ' : '') + '+' + x.xp + ' XP</span><span class="legende">' + Math.min(x.fait, x.cible) + ' / ' + x.cible + '</span>' +
        (x.reussie ? '' : '<a class="bouton" href="' + x.lien + '">Y aller</a>') + '</div></li>';
    };
    const faites = q.jour.filter(function (x) { return x.reussie; }).length;
    let h = '<section class="carte"><div class="ligne"><h2 style="margin:0">Quêtes du jour</h2><span class="espace"></span><span class="legende">' + faites + ' / ' + q.jour.length + '</span></div>' +
      '<p class="legende">Choisies selon tes points faibles, validées toutes seules. Les trois faites ouvrent le coffre du jour.</p>' +
      '<ul class="quetes">' + q.jour.map(ligneQuete).join('') + ligneQuete(q.semaine) + '</ul></section>';
    // coffre
    const c = r.coffre;
    h += '<section class="carte coffre' + (c.ouvert ? ' ouvert' : c.disponible ? ' pret' : '') + '"><div class="coffre-icone" aria-hidden="true">' + iconeCoffre(!!c.ouvert) + '</div>' +
      '<div class="coffre-texte"><h2 style="margin:0">Coffre du jour</h2>' +
      (c.ouvert ? '<p class="doux" style="margin:4px 0 0">Ouvert : <strong>' + o.echapper(c.ouvert.titre) + '</strong>. Un nouveau coffre demain.</p>' :
        c.disponible ? '<p class="doux" style="margin:4px 0 0">Toutes les quêtes sont faites : il est à toi.</p>' :
          '<p class="doux" style="margin:4px 0 0">Il s’ouvre quand les trois quêtes du jour sont faites (' + faites + ' / 3). XP, joker de série ou nouvelle couleur.</p>') + '</div>' +
      (c.disponible && !c.ouvert ? '<button class="principal" data-ouvrir-coffre>Ouvrir</button>' : '') + '</section>';
    // prochains déblocages
    const prochaineCouleur = r.couleurs.filter(function (x) { return !x.debloquee; })[0];
    const presque = r.succes.filter(function (x) { return !x.obtenu && !x.cache; }).slice(0, 0);
    h += '<section class="carte"><h2 style="margin-top:0">Prochains déblocages</h2><ul class="liste-deblocages">' +
      (r.prochainRang ? '<li><span>Rang ' + o.echapper(r.prochainRang.titre) + '</span><span class="legende">niveau ' + r.prochainRang.niveau + ' · encore ' + Math.max(0, P.jeu.seuil(r.prochainRang.niveau) - r.total).toLocaleString('fr-FR') + ' XP</span></li>' : '') +
      (prochaineCouleur ? '<li><span>Couleur ' + o.echapper(prochaineCouleur.nom) + '</span><span class="legende">niveau ' + prochaineCouleur.niveau + ' (ou par un coffre)</span></li>' : '') +
      r.boss.filter(function (b) { return !b.vaincu; }).sort(function (a, b) { return b.meilleur - a.meilleur; }).slice(0, 2).map(function (b) {
        return '<li><span>Vaincre ' + o.echapper(b.nom) + '</span><span class="legende">' + (b.tentatives ? 'record ' + Math.round(100 * b.meilleur) + ' %, victoire à ' + Math.round(100 * b.seuilVictoire) + ' %' : 'jamais affronté') + '</span></li>';
      }).join('') + presque.join('') + '</ul></section>';
    return h;
  }
  function iconeCoffre(ouvert) {
    return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' +
      (ouvert ? '<path d="M8 22h32v18H8z"/><path d="M8 22 13 10h22l5 12"/><path d="M20 22v6h8v-6"/>' :
        '<path d="M8 20h32v20H8z"/><path d="M8 20c0-6 4-10 10-10h12c6 0 10 4 10 10"/><path d="M20 20v8h8v-8"/>') + '</svg>';
  }

  // --- Onglet Épreuves --------------------------------------------------------------------------------------------------
  function ongletEpreuves(r) {
    return '<p class="doux">Un test chronométré par domaine, sans explication pendant l’épreuve (comme un vrai test en ligne), corrigé à la fin. ' +
      'Bronze à 60 %, argent (victoire) à 75 %, or à 90 %. Tu peux miser une part du capital du desk sur ta victoire.</p><div class="grille-boss">' +
      r.boss.map(function (b) {
        const dom = b.final ? 'Tous les domaines' : b.domaine === 'cours' ? 'Cours' : b.domaine === 'casse-tete' ? 'Casse-têtes' : A.nomTheme(b.domaine);
        return '<div class="carte boss' + (b.final ? ' boss-final' : '') + (b.medaille ? ' medaille-' + b.medaille : '') + '">' +
          '<div class="boss-tete"><span class="boss-nom">' + o.echapper(b.nom) + '</span>' + (b.medaille ? '<span class="medaille">' + MEDAILLES[b.medaille] + '</span>' : '') + '</div>' +
          '<div class="legende">' + o.echapper(dom) + ' · ' + b.questions + ' questions · ' + Math.round(b.duree / 60) + ' min</div>' +
          (b.tentatives ? barre(b.meilleur, 'barre-boss') : '') +
          '<div class="legende">' + (b.tentatives ? 'Record ' + Math.round(100 * b.meilleur) + ' % · ' + b.tentatives + ' tentative' + (b.tentatives > 1 ? 's' : '') : 'Jamais affronté') + '</div>' +
          '<a class="bouton' + (b.vaincu ? '' : ' principal') + '" href="#qcm/boss=' + encodeURIComponent(b.id) + '" data-boss="' + o.echapper(b.id) + '">' + (b.vaincu ? 'Rejouer' : 'Affronter') + '</a></div>';
      }).join('') + '</div>';
  }

  // --- Onglet Compétences -----------------------------------------------------------------------------------------------
  function ongletCompetences(r) {
    const conseillee = r.competences.filter(function (c) { return c.type === 'cours' && c.prete && c.niveau < 3; })
      .sort(function (a, b) { return (a.numero || 0) - (b.numero || 0); })[0];
    const parties = [];
    r.competences.forEach(function (c) { if (parties.indexOf(c.partie) < 0) parties.push(c.partie); });
    const titres = {};
    r.competences.forEach(function (c) { titres[c.id] = c.titre; });
    return '<p class="doux">Un chapitre du cours, une compétence (lecture, exercices, fiches, QCM), et une par famille de casse-têtes. ' +
      'Les prérequis sont des conseils : rien n’est verrouillé.' + (conseillee ? ' Prochaine étape conseillée : <a href="#cours/c=' + encodeURIComponent(conseillee.id) + '">' + o.echapper(conseillee.titre) + '</a>.' : '') + '</p>' +
      parties.map(function (p) {
        return '<h3 class="partie-cours">' + o.echapper(p) + '</h3><div class="grille-competences">' + r.competences.filter(function (c) { return c.partie === p; }).map(function (c) {
          const lien = c.type === 'cours' ? '#qcm/c=' + encodeURIComponent(c.id) : '#casse-tetes';
          const conseil = !c.prete && c.niveau < 2 ? '<span class="legende">Conseillé après : ' + c.prerequis.map(function (x) { return o.echapper(titres[x] || x); }).join(', ') + '</span>' : '';
          return '<a class="competence' + (c.prete ? '' : ' en-attente') + (conseillee && conseillee.id === c.id ? ' conseillee' : '') + (c.niveau >= 5 ? ' maitrisee' : '') + '" href="' + lien + '" data-competence="' + o.echapper(c.id) + '" title="' +
            (c.type === 'cours' ? 'Ouvre le QCM du chapitre' : 'Ouvre les casse-têtes') + '">' +
            '<span class="competence-titre">' + o.echapper(c.titre) + '</span>' + pips(c.niveau) + barre(c.score) +
            '<span class="legende">' + Math.round(100 * c.score) + ' %' + (c.niveau < 5 ? ' · niveau ' + (c.niveau + 1) + ' à ' + Math.round(100 * P.jeu.PALIERS[c.niveau]) + ' %' : ' · maîtrisée') + '</span>' + conseil + '</a>';
        }).join('') + '</div>';
      }).join('');
  }

  // --- Onglet Desk ----------------------------------------------------------------------------------------------------
  function courbe(points) {
    if (points.length < 2) return '<p class="legende">La courbe apparaîtra après ta première mise ou partie de market making.</p>';
    const l = 600, h = 160;
    const min = Math.min.apply(null, points), max = Math.max.apply(null, points);
    const y = function (v) { return max === min ? h / 2 : h - 8 - (h - 16) * (v - min) / (max - min); };
    const pts = points.map(function (v, i) { return (i * l / (points.length - 1)).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    const base = y(points[0]);
    return '<svg class="courbe-desk" viewBox="0 0 ' + l + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Évolution du capital">' +
      '<line x1="0" x2="' + l + '" y1="' + base.toFixed(1) + '" y2="' + base.toFixed(1) + '" class="courbe-base"/>' +
      '<polyline points="' + pts + '" class="courbe-ligne"/></svg>';
  }
  function ongletDesk(r) {
    const d = r.desk;
    return '<div class="grille stats-ct">' +
      '<div class="carte"><div class="chiffre">' + euros(d.capital) + '</div><div class="legende">capital (départ ' + euros(d.depart) + ')</div></div>' +
      '<div class="carte"><div class="chiffre ' + (d.performance >= 0 ? 'positif' : 'negatif') + '">' + (d.performance >= 0 ? '+' : '') + (100 * d.performance).toFixed(1).replace('.', ',') + ' %</div><div class="legende">performance</div></div>' +
      '<div class="carte"><div class="chiffre">' + (100 * d.drawdownMax).toFixed(1).replace('.', ',') + ' %</div><div class="legende">drawdown maximal</div></div></div>' +
      '<section class="carte"><h2 style="margin-top:0">Courbe de capital</h2>' + courbe(d.courbe) +
      '<p class="petit doux">Le desk vit de deux sources : tes mises sur les épreuves (pari à 1 contre 1 sur la victoire ; l’écran de l’épreuve affiche ta probabilité estimée et la mise de Kelly, 2p − 1) ' +
      'et tes parties de <a href="#marche">market making</a>. Miser trop gros sur une épreuve incertaine, c’est exactement l’erreur que le critère de Kelly évite : c’est ici qu’on la sent.</p></section>' +
      (d.mouvements.length ? '<section class="carte"><h2 style="margin-top:0">Derniers mouvements</h2><ul class="mouvements">' + d.mouvements.slice(-12).reverse().map(function (m) {
        return '<li><span>' + o.echapper(m.libelle) + '</span><span class="legende">' + o.dateLisible(m.date) + '</span><span class="' + (m.montant >= 0 ? 'positif' : 'negatif') + '">' + (m.montant >= 0 ? '+' : '−') + euros(Math.abs(m.montant)) + '</span></li>';
      }).join('') + '</ul></section>' : '');
  }

  // --- Onglet Succès et style ------------------------------------------------------------------------------------------
  function ongletSucces(r) {
    const obtenus = r.succes.filter(function (s) { return s.obtenu; }).length;
    const choisie = A.etat.reglages.couleur || 'bleu';
    let h = '<section class="carte"><h2 style="margin-top:0">Style</h2><p class="legende">Couleurs d’accent débloquées avec les rangs, ou plus tôt grâce à un coffre.</p><div class="couleurs">' +
      r.couleurs.map(function (c) {
        return '<button type="button" class="pastille-couleur' + (c.id === choisie ? ' choisie' : '') + '" data-couleur="' + c.id + '"' + (c.debloquee ? '' : ' disabled') +
          ' aria-pressed="' + (c.id === choisie) + '"><span class="echantillon echantillon-' + c.id + '"></span>' + o.echapper(c.nom) +
          (c.debloquee ? '' : '<span class="legende"> · niveau ' + c.niveau + '</span>') + '</button>';
      }).join('') + '</div></section>';
    h += '<h2>Succès <span class="legende">' + obtenus + ' / ' + r.succes.length + '</span></h2><div class="grille-succes">' +
      r.succes.slice().sort(function (a, b) { return (b.obtenu ? 1 : 0) - (a.obtenu ? 1 : 0); }).map(function (s) {
        const masque = s.cache && !s.obtenu;
        return '<div class="succes-tuile' + (s.obtenu ? ' obtenu' : '') + '"><span class="succes-titre">' + (masque ? 'Succès caché' : o.echapper(s.titre)) + '</span>' +
          '<span class="legende">' + (masque ? 'Continue à explorer l’application.' : o.echapper(s.desc)) + '</span>' +
          (s.date ? '<span class="legende">Obtenu le ' + o.dateLisible(s.date) + '</span>' : '') + '</div>';
      }).join('') + '</div>';
    const B = P.jeu.BAREME;
    h += '<section class="carte" style="margin-top:20px"><h2 style="margin-top:0">D’où vient ton XP</h2>' + Object.keys(SOURCES).map(function (k) {
      return '<div class="theme-ligne"><span>' + SOURCES[k] + '</span>' + barre(r.total ? (r.xp[k] || 0) / r.total : 0) + '<span>' + (r.xp[k] || 0).toLocaleString('fr-FR') + '</span></div>';
    }).join('') +
      '<details><summary>Le barème complet</summary><ul class="petit">' +
      '<li>Fiche : ' + B.ficheVue + ' XP par niveau de difficulté à la première révision, puis jusqu’à ' + B.ficheMaitrise + ' de plus quand elle tient trois semaines. Revoir une fiche maîtrisée ne rapporte rien de plus : c’est la mémoire durable qui paie.</li>' +
      '<li>QCM : ' + B.qcmJuste + ' XP par question juste à la dernière tentative, ' + B.qcmCorrige + ' de bonus quand une erreur passée est corrigée. Combo (bonnes réponses d’affilée) : +1, +2 puis +3 XP par réponse à partir de 3, 5 et 10, au plus ' + B.comboMaxJour + ' par jour, et seulement sur des questions pas encore réussies dans la journée.</li>' +
      '<li>Cours : ' + B.chapitreLu + ' par chapitre lu, ' + B.exercice + ' par exercice réussi, ' + B.demo + ' par démonstration maîtrisée.</li>' +
      '<li>Entraînement : 1 par bonne réponse en calcul mental (100 au plus par session), ' + B.entretienBlanc + ' par entretien blanc plus la moitié du score, ' + B.testEnLigne + ' par test en ligne, ' + B.partieMarche + ' par partie de market making, ' + B.partieKelly + ' par partie de paris.</li>' +
      '<li>Carrière : ' + B.histoire + ' par réponse de parcours écrite, ' + B.vraiEntretien + ' par vrai entretien passé.</li>' +
      '<li>Quêtes : ' + B.quete + ' chacune, ' + B.toutesQuetes + ' de bonus si toutes sont faites (et le coffre), ' + B.queteHebdo + ' pour celle de la semaine. Épreuves : ' + B.boss.bronze + ' / ' + B.boss.argent + ' / ' + B.boss.or + ' selon la meilleure médaille.</li>' +
      '<li>Série : un jour sans activité ne la casse pas si tu as un joker ; tu en gagnes un tous les 7 jours d’affilée (deux au plus), et parfois dans un coffre.</li>' +
      '</ul></details></section>';
    return h;
  }

  function rendre(main, params) {
    if (!P.jeu) { main.innerHTML = '<h1>Carrière</h1><p>Indisponible.</p>'; return; }
    if (params.onglet && ONGLETS[params.onglet]) onglet = params.onglet;
    const r = A.resultatJeu();
    if (!r) { main.innerHTML = '<h1>Carrière</h1><p class="doux">Chargement des données impossible.</p>'; return; }
    let h = '<h1>Carrière</h1>';
    if (!A.jeuActif()) h += '<div class="encadre alerte">Le mode carrière est désactivé dans les Réglages : rien n’est perdu. <a href="#reglages">Le réactiver</a></div>';
    h += enTete(r) + '<div class="onglets onglets-carriere" role="tablist">' + Object.keys(ONGLETS).map(function (k) {
      return '<button type="button" role="tab" aria-selected="' + (k === onglet) + '" data-onglet="' + k + '">' + ONGLETS[k] + '</button>';
    }).join('') + '</div><div data-contenu-onglet></div>';
    main.innerHTML = h;
    const zone = main.querySelector('[data-contenu-onglet]');
    function afficherOnglet() {
      const res = A.resultatJeu();
      zone.innerHTML = onglet === 'epreuves' ? ongletEpreuves(res) : onglet === 'competences' ? ongletCompetences(res) :
        onglet === 'desk' ? ongletDesk(res) : onglet === 'succes' ? ongletSucces(res) : ongletJour(res);
      main.querySelectorAll('[data-onglet]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-onglet') === onglet)); });
      const ouvrir = zone.querySelector('[data-ouvrir-coffre]');
      if (ouvrir) ouvrir.addEventListener('click', function () {
        const t = P.jeu.ouvrirCoffre(A.etat, A.contexteJeu());
        if (!t) return;
        A.son('coffre');
        zone.querySelector('.coffre').classList.add('ouverture');
        A.sauver();
        if (t.type === 'couleur') { A.etat.reglages.couleur = t.valeur; A.appliquerTheme(); A.sauver(); }
        A.toast('Coffre : ' + t.titre);
        setTimeout(function () { rendre(main, {}); }, 650);
      });
      zone.querySelectorAll('[data-couleur]').forEach(function (b) {
        b.addEventListener('click', function () {
          A.etat.reglages.couleur = b.getAttribute('data-couleur');
          A.appliquerTheme();
          A.sauver();
          A.son('clic');
          afficherOnglet();
        });
      });
    }
    main.querySelectorAll('[data-onglet]').forEach(function (b) {
      b.addEventListener('click', function () {
        onglet = b.getAttribute('data-onglet');
        try { racine.sessionStorage.setItem('prepa-carriere-onglet', onglet); } catch (e) { /* sans stockage */ }
        afficherOnglet();
      });
    });
    afficherOnglet();
  }

  A.enregistrerVue({ id: 'carriere', titre: 'Carrière', court: 'Carrière', icone: '★', ordre: 9.5, rendre: rendre });
})(this);
