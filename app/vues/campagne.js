// Campagne : la carte des niveaux, monde par monde, de la candidature à l'offre. Chaque niveau est une courte série de
// QCM (1 étoile à 60 %, 2 à 80 %, 3 sans faute) ; une étoile débloque le suivant. Le contenu reste accessible ailleurs :
// seule la progression sur la carte est séquentielle, comme dans un jeu de niveaux.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;
  const ECART = 92;
  const CADENAS = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';   // distance verticale entre deux niveaux (px)

  function etoiles(n, total) {
    let h = '<span class="etoiles" aria-label="' + n + ' étoile' + (n > 1 ? 's' : '') + ' sur 3">';
    for (let k = 1; k <= (total || 3); k++) h += '<i class="' + (k <= n ? 'pleine' : '') + '">★</i>';
    return h + '</span>';
  }
  // Position horizontale (en %) du niveau i sur le chemin sinueux
  function x(i) { return 50 + 30 * Math.sin(i * 0.95); }

  function carteMonde(m, courant) {
    const n = m.niveaux.length;
    const hauteur = n * ECART + 20;
    const pts = m.niveaux.map(function (niv, i) { return x(i).toFixed(2) + ',' + (i * ECART + 40); }).join(' ');
    const fait = m.niveaux.filter(function (niv) { return niv.etoiles > 0; }).length;
    return '<section class="monde' + (m.debloque ? '' : ' verrouille') + (m.fini ? ' fini' : '') + '" id="monde-' + m.id + '">' +
      '<header class="tete-monde"><span class="numero-monde">Monde ' + m.numero + '</span><h2>' + o.echapper(m.titre) + '</h2>' +
      '<span class="legende">' + m.etoiles + ' / ' + m.etoilesMax + ' ★ · ' + fait + ' / ' + n + ' niveaux</span></header>' +
      (m.debloque ? '<p class="recit">' + o.echapper(m.recit) + '</p>' : '<p class="recit doux">Termine le monde précédent pour découvrir la suite de l’histoire.</p>') +
      '<div class="chemin" style="height:' + hauteur + 'px"><svg class="trace" viewBox="0 0 100 ' + hauteur + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<polyline points="' + pts + '"/></svg>' +
      m.niveaux.map(function (niv, i) {
        const etat = niv.etoiles ? 'fait' : niv.debloque ? 'ouvert' : 'ferme';
        const estCourant = courant && courant.id === niv.id;
        return '<a class="noeud ' + etat + (niv.boss ? ' boss-niveau' : '') + (estCourant ? ' courant' : '') + (x(i) > 55 ? ' gauche' : '') + '" style="left:' + x(i).toFixed(2) + '%;top:' + (i * ECART + 40) + 'px"' +
          (niv.debloque ? ' href="#campagne/n=' + encodeURIComponent(niv.id) + '"' : ' aria-disabled="true"') + ' data-niveau="' + o.echapper(niv.id) + '" title="' + o.echapper(niv.titre + ' · ' + niv.sous) + '">' +
          '<span class="pastille-niveau">' + (niv.debloque ? (niv.boss ? '♛' : niv.numero) : CADENAS) + '</span>' + (niv.etoiles ? etoiles(niv.etoiles) : '') +
          '<span class="etiquette-niveau">' + o.echapper(niv.titre) + '<small>' + o.echapper(niv.sous) + '</small></span></a>';
      }).join('') + '</div></section>';
  }

  // Chapitres du cours derrière un niveau : le sien, ou tous ceux du monde pour le boss ; aucun pour les énigmes.
  function chapitresDuNiveau(niv, monde) {
    const tous = (racine.PREPA_COURS && racine.PREPA_COURS.chapitres) || [];
    const par = function (id) { return tous.filter(function (c) { return c.id === id; })[0]; };
    let ids = [];
    if (niv.boss && monde) ids = monde.niveaux.filter(function (x) { return !x.boss && !/^ct:/.test(x.id); }).map(function (x) { return x.id.split(':')[0]; });
    else if (!/^ct:/.test(niv.id)) ids = [niv.id.split(':')[0]];
    return ids.filter(function (v, i) { return ids.indexOf(v) === i; }).map(par).filter(Boolean);
  }
  function avantDeJouer(niv, monde) {
    const chaps = chapitresDuNiveau(niv, monde);
    const lien = function (c) { return '<a href="#cours/c=' + encodeURIComponent(c.id) + '">chapitre ' + c.numero + ', ' + o.echapper(c.titre) + '</a>' + (c.duree ? ' <span class="doux">(' + o.echapper(c.duree) + ')</span>' : ''); };
    return '<div class="avant-jouer"><p class="libelle-point">Tu découvres la notion ?</p><p class="petit">' +
      (chaps.length ? (niv.boss ? 'Ce boss mêle les chapitres ' : 'Deux façons d’apprendre : lis d’abord le ') + chaps.map(lien).join(', ') + ', ou lance-toi directement. ' :
        'Ces énigmes reposent sur quelques idées astucieuses : lance-toi, ') +
      'Pendant la partie, « Voir le cours d’abord » affiche l’explication de la notion, « Je ne sais pas encore » montre la réponse, et chaque correction est rédigée pas à pas. ' +
      'Les questions ratées reviennent à la partie suivante.</p></div>';
  }

  function rendre(main, params) {
    if (!P.jeu2 || !A.contexteJeu()) { main.innerHTML = '<h1>Campagne</h1><p class="doux">Indisponible.</p>'; return; }
    const camp = P.jeu2.campagne(A.etat, A.contexteJeu());
    let mondeChoisi = null;
    const choisi = params.n ? (function () { let r = null; camp.mondes.forEach(function (m) { m.niveaux.forEach(function (x) { if (x.id === params.n) { r = x; mondeChoisi = m; } }); }); return r; })() : null;
    const courant = camp.prochain;
    let h = '<h1>Campagne</h1><p class="doux">Ta candidature en ' + camp.total + ' niveaux, du CV à l’offre. Une étoile à 60 %, deux à 80 %, trois sans faute.</p>' +
      '<div class="grille stats-ct"><div class="carte"><div class="chiffre">' + camp.etoiles + ' ★</div><div class="legende">sur ' + camp.etoilesMax + '</div></div>' +
      '<div class="carte"><div class="chiffre">' + camp.mondesFinis + ' / ' + camp.mondes.length + '</div><div class="legende">mondes terminés</div></div>' +
      '<div class="carte"><div class="chiffre">' + (courant ? courant.numero : '✓') + '</div><div class="legende">' + (courant ? 'prochain niveau : ' + o.echapper(courant.titre) : 'toute la campagne à 3 étoiles') + '</div></div></div>';
    if (choisi) {
      h += '<section class="carte panneau-niveau" data-panneau><p class="tete-partie">Niveau ' + choisi.numero + (choisi.boss ? ' · boss du monde' : '') + '</p>' +
        '<h2>' + o.echapper(choisi.titre) + '</h2><p class="doux">' + o.echapper(choisi.sous) + ' · ' + choisi.n + ' questions, avec la correction après chaque réponse.</p>' +
        '<p>' + etoiles(choisi.etoiles) + ' <span class="legende">' + (choisi.etoiles ? 'record' : 'pas encore joué') + '</span></p>' + avantDeJouer(choisi, mondeChoisi) +
        '<div class="ligne">' + (choisi.debloque ? '<a class="bouton principal" href="#qcm/niveau=' + encodeURIComponent(choisi.id) + '" data-jouer>Jouer <kbd>Entrée</kbd></a>' :
          '<span class="doux">Verrouillé : réussis d’abord le niveau précédent.</span>') + '<a class="bouton" href="#campagne">Fermer</a></div></section>';
    } else if (courant) {
      h += '<div class="ligne" style="margin-bottom:8px"><a class="bouton principal" href="#campagne/n=' + encodeURIComponent(courant.id) + '" data-aller-courant>Niveau ' + courant.numero + ' : ' + o.echapper(courant.titre) + ' <kbd>Entrée</kbd></a></div>';
    }
    h += camp.mondes.map(function (m) { return carteMonde(m, courant); }).join('');
    main.innerHTML = h;
    // centrer la carte sur le niveau en cours (ou choisi)
    const cible = main.querySelector('.noeud.courant');
    if (!choisi && cible && cible.scrollIntoView) setTimeout(function () { cible.scrollIntoView({ block: 'center', behavior: 'auto' }); }, 30);
  }

  A.enregistrerVue({
    id: 'campagne', titre: 'Campagne', court: 'Niveaux', icone: '⚑', ordre: 4.9, rendre: rendre,
    touche: function (e, saisie) {
      if (saisie || e.key !== 'Enter') return;
      const b = document.querySelector('[data-jouer]') || document.querySelector('[data-aller-courant]');
      if (b) { e.preventDefault(); b.click(); }
    }
  });
})(this);
