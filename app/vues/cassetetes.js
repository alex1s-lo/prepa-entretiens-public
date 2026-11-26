// Casse-têtes : toutes les énigmes d'entretien rangées par famille (logique, pesées, stratégie, probabilités…),
// chacune avec ses variantes (problèmes à part entière, rangés sous leur problème d'origine). Objectif : qu'aucune énigme posée en entretien ne soit vraiment nouvelle.
// Chaque fiche qui porte une « categorie » y figure, quel que soit son thème ; la notation alimente la répétition espacée.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const ETATS = {
    tous: 'Tous', nouveaux: 'Jamais vus', revoir: 'À revoir', vus: 'Déjà vus', maitrises: 'Maîtrisés'
  };
  // Filtres de la liste, gardés le temps de la visite (et dans le navigateur, si possible).
  const CLE_FILTRES = 'prepa-casse-tetes-filtres';
  let filtres = { cat: '', niveau: '', etat: 'tous', texte: '', variantes: true };
  try { Object.assign(filtres, JSON.parse(racine.localStorage.getItem(CLE_FILTRES) || '{}')); } catch (e) { /* sans stockage */ }
  function garderFiltres() {
    try { racine.localStorage.setItem(CLE_FILTRES, JSON.stringify(filtres)); } catch (e) { /* sans stockage */ }
  }

  function categories() { return A.banque().categories || {}; }
  function enigmes() {
    return A.fiches().filter(function (f) { return f.categorie; });
  }
  function etatDe(f) {
    const c = A.etat.cartes[f.id];
    if (!c) return 'nouveau';
    if (P.srs.estDue(c, A.aujourdhui())) return 'revoir';
    return P.srs.maitrise(c) >= 0.8 ? 'maitrise' : 'vu';
  }
  const LIBELLE_ETAT = {
    nouveau: '<span class="etiquette">jamais vu</span>',
    revoir: '<span class="etiquette alerte">à revoir</span>',
    vu: '<span class="etiquette accent">vu</span>',
    maitrise: '<span class="etiquette succes">maîtrisé</span>'
  };
  function retenu(f) {
    if (filtres.cat && f.categorie !== filtres.cat) return false;
    if (filtres.niveau && String(f.niveau) !== filtres.niveau) return false;
    const e = etatDe(f);
    if (filtres.etat === 'nouveaux' && e !== 'nouveau') return false;
    if (filtres.etat === 'revoir' && e !== 'revoir') return false;
    if (filtres.etat === 'vus' && e === 'nouveau') return false;
    if (filtres.etat === 'maitrises' && e !== 'maitrise') return false;
    if (!filtres.variantes && f.parent) return false;
    if (filtres.texte) {
      const cherche = o.sansTex(filtres.texte).toLowerCase();
      const texte = o.sansTex([f.titre, f.question].join(' ')).toLowerCase();
      if (texte.indexOf(cherche) < 0) return false;
    }
    return true;
  }
  function niveau(n) {
    return '<span class="niveau-points" title="Difficulté ' + n + ' sur 3" aria-label="Difficulté ' + n + ' sur 3">' +
      [1, 2, 3].map(function (k) { return '<i class="' + (k <= n ? 'plein' : '') + '"></i>'; }).join('') + '</span>';
  }

  // --- Liste --------------------------------------------------------------------------------------------------------
  function rendreListe(main) {
    const toutes = enigmes();
    const cats = categories();
    const vues = toutes.filter(function (f) { return A.etat.cartes[f.id]; }).length;
    const maitrisees = toutes.filter(function (f) { return etatDe(f) === 'maitrise'; }).length;
    const aRevoir = toutes.filter(function (f) { return etatDe(f) === 'revoir'; }).length;
    const nVariantes = toutes.filter(function (f) { return f.parent; }).length;

    main.innerHTML = '<h1>Casse-têtes</h1><p class="doux">Les énigmes posées en entretien quant, recensées sur une vingtaine de sources et ' +
      'dédoublonnées. Les variantes d’un problème sont des énigmes à part entière, rangées juste sous lui. Cherche à voix haute avant de regarder l’indice ; ' +
      'la note que tu te donnes décide quand l’énigme reviendra.</p>' +
      '<div class="grille stats-ct">' +
      '<div class="carte"><div class="chiffre">' + toutes.length + '</div><div class="legende">énigmes, dont ' + nVariantes + ' variantes d’un problème classique</div></div>' +
      '<div class="carte"><div class="chiffre" data-ct-vues>' + vues + '</div><div class="legende">déjà vues · ' + (toutes.length - vues) + ' jamais vues</div>' +
      '<div class="barre" style="margin-top:6px"><span style="width:' + Math.round(100 * vues / Math.max(1, toutes.length)) + '%"></span></div></div>' +
      '<div class="carte"><div class="chiffre">' + maitrisees + '</div><div class="legende">maîtrisées · ' + aRevoir + ' à revoir aujourd’hui</div></div></div>' +
      '<div class="carte filtres-ct"><div class="ligne">' +
      '<input type="search" data-ct-texte placeholder="Chercher : chapeaux, pesée, dés, horloge…" aria-label="Chercher une énigme" value="' + o.echapper(filtres.texte) + '" style="flex:1;min-width:14ch">' +
      '<select data-ct-niveau aria-label="Difficulté"><option value="">Toutes difficultés</option><option value="1">Facile</option><option value="2">Moyen</option><option value="3">Difficile</option></select>' +
      '<select data-ct-etat aria-label="Progression">' + Object.keys(ETATS).map(function (k) {
        return '<option value="' + k + '">' + ETATS[k] + '</option>';
      }).join('') + '</select><label class="case-ct"><input type="checkbox" data-ct-variantes' + (filtres.variantes ? ' checked' : '') + '> Variantes</label></div>' +
      '<div class="puces-ct" role="group" aria-label="Familles"><button type="button" data-ct-cat="" aria-pressed="' + (!filtres.cat) + '">Toutes</button>' +
      Object.keys(cats).filter(function (c) { return toutes.some(function (f) { return f.categorie === c; }); }).map(function (c) {
        return '<button type="button" data-ct-cat="' + c + '" aria-pressed="' + (filtres.cat === c) + '">' + o.echapper(cats[c]) + '</button>';
      }).join('') + '</div>' +
      '<div class="ligne" style="margin-top:14px"><button class="principal" data-ct-hasard>Une énigme jamais vue, au hasard</button>' +
      '<button data-ct-session>Session de 5 énigmes</button><span class="espace"></span><span class="legende" data-ct-compte></span></div></div>' +
      '<div data-ct-liste></div>';

    main.querySelector('[data-ct-niveau]').value = filtres.niveau;
    main.querySelector('[data-ct-etat]').value = filtres.etat;

    function majListe() {
      const retenues = toutes.filter(retenu);
      main.querySelector('[data-ct-compte]').textContent = retenues.length + ' énigme' + (retenues.length > 1 ? 's' : '') + ' affichée' + (retenues.length > 1 ? 's' : '');
      const parCat = {};
      retenues.forEach(function (f) { (parCat[f.categorie] = parCat[f.categorie] || []).push(f); });
      const html = Object.keys(cats).filter(function (c) { return parCat[c]; }).map(function (c) {
        // problèmes d'origine par difficulté puis par titre, chaque variante juste sous son problème
        const ordre = function (a, b) { return a.niveau - b.niveau || o.sansTex(a.titre).localeCompare(o.sansTex(b.titre), 'fr'); };
        const ici = parCat[c];
        const tete = function (f) { return f.parent && A.fiche(f.parent) ? A.fiche(f.parent) : f; };
        const meres = [];
        ici.forEach(function (f) { const m = tete(f); if (meres.indexOf(m) < 0) meres.push(m); });
        meres.sort(ordre);
        const liste = [];
        meres.forEach(function (m) {
          if (ici.indexOf(m) >= 0) liste.push(m);
          ici.filter(function (f) { return f.parent === m.id; }).sort(ordre).forEach(function (f) { liste.push(f); });
        });
        const total = toutes.filter(function (f) { return f.categorie === c; });
        const vuesCat = total.filter(function (f) { return A.etat.cartes[f.id]; }).length;
        return '<section class="famille-ct"><div class="entete-famille"><h2 class="partie-cours">' + o.echapper(cats[c]) + '</h2>' +
          '<span class="legende">' + vuesCat + ' / ' + total.length + ' vues</span></div><ul class="liste-ct">' + liste.map(function (f) {
            const nv = P.composants.variantesDe(f.id).length;
            const mere = f.parent ? A.fiche(f.parent) : null;
            return '<li' + (mere ? ' class="variante-ct"' : '') + '><a href="#casse-tetes/f=' + encodeURIComponent(f.id) + '" data-ct-fiche="' + o.echapper(f.id) + '">' +
              '<span class="titre-ct">' + o.enLigne(f.titre) + '</span>' +
              '<span class="resume-ct">' + (mere ? 'Variante de « ' + o.echapper(o.sansTex(mere.titre || '')) + ' » · ' : '') + o.echapper(o.resume(f.question, 110)) + '</span>' +
              '<span class="meta-ct">' + niveau(f.niveau) + (nv ? '<span class="legende">' + nv + ' variante' + (nv > 1 ? 's' : '') + '</span>' : '') +
              LIBELLE_ETAT[etatDe(f)] + '</span></a></li>';
          }).join('') + '</ul></section>';
      }).join('');
      main.querySelector('[data-ct-liste]').innerHTML = html ||
        '<div class="carte"><p class="doux">Aucune énigme ne correspond à ces filtres.</p></div>';
    }
    majListe();

    main.querySelector('[data-ct-texte]').addEventListener('input', function (e) { filtres.texte = e.target.value; garderFiltres(); majListe(); });
    main.querySelector('[data-ct-niveau]').addEventListener('change', function (e) { filtres.niveau = e.target.value; garderFiltres(); majListe(); });
    main.querySelector('[data-ct-variantes]').addEventListener('change', function (e) { filtres.variantes = e.target.checked; garderFiltres(); majListe(); });
    main.querySelector('[data-ct-etat]').addEventListener('change', function (e) { filtres.etat = e.target.value; garderFiltres(); majListe(); });
    main.querySelectorAll('[data-ct-cat]').forEach(function (b) {
      b.addEventListener('click', function () {
        filtres.cat = b.getAttribute('data-ct-cat');
        garderFiltres();
        main.querySelectorAll('[data-ct-cat]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        majListe();
      });
    });
    main.querySelector('[data-ct-hasard]').addEventListener('click', function () {
      const f = tirer(1, true)[0];
      if (!f) { A.toast('Tu as déjà vu toutes les énigmes de ces filtres.'); return; }
      A.aller('casse-tetes', { f: f.id });
    });
    main.querySelector('[data-ct-session]').addEventListener('click', function () {
      const ids = tirer(5).map(function (f) { return f.id; });
      if (!ids.length) { A.toast('Aucune énigme à proposer avec ces filtres.'); return; }
      A.aller('casse-tetes', { session: ids.join(',') });
    });
  }

  // Tirage dans les filtres courants. « Jamais vue » (bouton, lien après une énigme, ou filtre d'état « Jamais vus ») :
  // uniquement des énigmes jamais travaillées. Sinon (session) : d'abord les énigmes à revoir, puis les jamais vues ;
  // le filtre « À revoir » limite aux énigmes dues.
  function tirer(n, jamaisVues) {
    const base = enigmes().filter(function (f) {
      return (!filtres.cat || f.categorie === filtres.cat) && (!filtres.niveau || String(f.niveau) === filtres.niveau) &&
        (!filtres.variantes ? !f.parent : true);
    });
    const seulementNeuves = jamaisVues || filtres.etat === 'nouveaux';
    const dues = seulementNeuves ? [] : o.melanger(Math.random, base.filter(function (f) { return etatDe(f) === 'revoir'; }));
    if (filtres.etat === 'revoir' && !jamaisVues) return dues.slice(0, n);
    const neuves = base.filter(function (f) { return etatDe(f) === 'nouveau'; });
    // une variante passe après son problème d'origine : on la propose une fois l'origine déjà travaillée
    const pretes = o.melanger(Math.random, neuves.filter(function (f) { return !f.parent || A.etat.cartes[f.parent]; }));
    const plusTard = o.melanger(Math.random, neuves.filter(function (f) { return f.parent && !A.etat.cartes[f.parent]; }));
    return dues.concat(pretes, plusTard).slice(0, n);
  }

  // --- Entraînement sur une énigme (ou une session) -----------------------------------------------------------------
  let controleCourant = null;
  function rendreEnigme(main, ids, rang) {
    const f = A.fiche(ids[rang]);
    if (!f) { A.aller('casse-tetes'); return; }
    const cats = categories();
    const session = ids.length > 1;
    main.innerHTML = '<p class="petit"><a href="#casse-tetes">← Toutes les énigmes</a></p>' +
      '<p class="tete-partie">' + o.echapper(cats[f.categorie] || '') + (session ? ' · énigme ' + (rang + 1) + ' sur ' + ids.length : '') + '</p>' +
      '<h1 class="titre-enigme">' + o.enLigne(f.titre) + '</h1><div data-ct-carte></div><div data-ct-suite></div>';
    const carte = P.composants.carteQuestion(f, {
      chrono: true,
      onNote: function () {
        const suite = main.querySelector('[data-ct-suite]');
        if (session && rang + 1 < ids.length) {
          suite.innerHTML = '<div class="ligne fin"><button class="principal" data-ct-suivante>Énigme suivante →</button></div>';
          suite.querySelector('[data-ct-suivante]').addEventListener('click', function () { rendreEnigme(main, ids, rang + 1); racine.scrollTo(0, 0); });
        } else {
          const autre = tirer(1, true)[0];
          suite.innerHTML = '<div class="ligne fin">' + (session ? '<span class="doux petit">Session terminée.</span><span class="espace"></span>' : '') +
            '<a class="bouton" href="#casse-tetes">Retour à la liste</a>' +
            (autre ? '<a class="bouton principal" href="#casse-tetes/f=' + encodeURIComponent(autre.id) + '">Une autre, jamais vue →</a>' : '') + '</div>';
        }
      }
    });
    main.querySelector('[data-ct-carte]').appendChild(carte);
    controleCourant = carte.controle || null;
  }

  function rendre(main, params) {
    controleCourant = null;
    if (params.session) return rendreEnigme(main, params.session.split(',').filter(Boolean), 0);
    if (params.f) return rendreEnigme(main, [params.f], 0);
    rendreListe(main);
  }

  A.enregistrerVue({
    id: 'casse-tetes', titre: 'Casse-têtes', court: 'Casse-têtes', icone: '?', ordre: 5.5, rendre: rendre,
    touche: function (e, saisie) {
      if (controleCourant && controleCourant.touche && controleCourant.touche(e, saisie)) e.preventDefault();
    }
  });
})(this);
