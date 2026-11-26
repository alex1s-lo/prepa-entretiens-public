// Guides : méthode, plan de préparation, ce que testent les différentes maisons, antisèche de formules.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  function rendre(main, params) {
    const guides = A.banque().guides;
    const courant = guides.filter(function (g) { return g.id === params.g; })[0];
    if (courant) {
      main.innerHTML = '<p><a href="#guides">← Tous les guides</a></p><article class="carte guide"><h1>' + o.echapper(courant.titre) + '</h1>' +
        o.markdown(courant.texte) + '</article>' +
        '<div class="ligne">' + guides.map(function (g) {
          return g.id === courant.id ? '' : '<a class="bouton" href="#guides/g=' + g.id + '">' + o.echapper(g.titre) + '</a>';
        }).join('') + '</div>';
      return;
    }
    main.innerHTML = '<h1>Guides</h1><p class="doux">À lire une fois en entier, puis à relire la veille d’un entretien.</p><div class="grille">' +
      guides.map(function (g) {
        const premiere = g.texte.split('\n').filter(function (l) { return l.trim() && !/^[#|>-]/.test(l.trim()); })[0] || '';
        return '<a class="carte carte-lien" href="#guides/g=' + g.id + '"><h2 class="titre-carte">' +
          o.echapper(g.titre) + '</h2><p class="petit doux">' + o.enLigne(premiere.slice(0, 180)) + (premiere.length > 180 ? '…' : '') + '</p></a>';
      }).join('') + '</div>';
  }

  A.enregistrerVue({ id: 'guides', titre: 'Guides', icone: 'ℹ', ordre: 9, rendre: rendre });
})(this);
