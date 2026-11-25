// Noyau de l'application : état sauvegardé dans le navigateur, navigation, composants communs.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const CLE = 'prepa-entretiens-v1';
  const VERSION = 1;

  function etatVide() {
    return {
      version: VERSION,
      cartes: {},        // id de fiche -> état de répétition espacée
      jours: {},         // AAAA-MM-JJ -> { revues, justes, nouvelles, calcul, entretiens, marche }
      calcul: [],        // sessions de calcul mental
      marche: [],        // parties de market making
      entretiens: [],    // entretiens blancs
      tests: [],         // tests en ligne chronométrés
      kelly: [],         // parties du jeu de paris (Kelly)
      journal: [],       // vrais entretiens (date, entreprise, questions posées…)
      histoires: {},     // id d'histoire -> texte
      perso: [],         // fiches ajoutées par toi (questions posées en vrai)
      notes: {},         // id de fiche -> note personnelle
      cours: { exercices: {}, lus: {}, demos: {} },  // exercices faits, chapitres lus, démonstrations maîtrisées
      reglages: { profils: ['hf', 'banque', 'mm'], nouveauxParJour: 15, anglais: false, theme: 'auto', niveauCalcul: 2 }
    };
  }

  let etat = etatVide();
  let stockageOk = true;

  function fusionner(base, lu) {
    const e = Object.assign(base, lu || {});
    e.reglages = Object.assign(etatVide().reglages, (lu && lu.reglages) || {});
    ['calcul', 'marche', 'entretiens', 'tests', 'kelly', 'journal', 'perso'].forEach(function (k) { if (!Array.isArray(e[k])) e[k] = []; });
    ['cartes', 'jours', 'histoires', 'notes'].forEach(function (k) { if (!e[k] || typeof e[k] !== 'object') e[k] = {}; });
    if (!e.cours || typeof e.cours !== 'object') e.cours = {};
    if (!e.cours.exercices || typeof e.cours.exercices !== 'object') e.cours.exercices = {};
    if (!e.cours.lus || typeof e.cours.lus !== 'object') e.cours.lus = {};
    if (!e.cours.demos || typeof e.cours.demos !== 'object') e.cours.demos = {};
    return e;
  }

  function charger() {
    try {
      const brut = racine.localStorage.getItem(CLE);
      etat = fusionner(etatVide(), brut ? JSON.parse(brut) : null);
    } catch (err) {
      stockageOk = false;
      etat = etatVide();
    }
  }

  function sauver() {
    try {
      racine.localStorage.setItem(CLE, JSON.stringify(etat));
      stockageOk = true;
    } catch (err) {
      if (stockageOk) toast('Sauvegarde impossible dans ce navigateur : exporte ta progression dans Réglages.');
      stockageOk = false;
    }
    rafraichirEntete();
  }

  function aujourdhui() { return o.jourDe(new Date()); }

  function noterActivite(cle, n) {
    const j = aujourdhui();
    const jour = etat.jours[j] || (etat.jours[j] = {});
    jour[cle] = (jour[cle] || 0) + (n == null ? 1 : n);
  }

  // Jours consécutifs avec une activité, jusqu'à aujourd'hui (ou hier si rien encore aujourd'hui).
  function serie() {
    let j = aujourdhui();
    const actif = function (d) { const x = etat.jours[d]; return !!x && Object.keys(x).some(function (k) { return x[k] > 0; }); };
    if (!actif(j)) j = o.ajouterJours(j, -1);
    let n = 0;
    while (actif(j)) { n++; j = o.ajouterJours(j, -1); }
    return n;
  }

  // Fiches de la banque + fiches personnelles (questions notées dans le journal).
  function fiches() {
    return P_BANQUE().fiches.concat(etat.perso);
  }
  function P_BANQUE() { return racine.PREPA_BANQUE || { themes: {}, profils: {}, fiches: [], guides: [] }; }
  function fiche(id) {
    const liste = fiches();
    for (let i = 0; i < liste.length; i++) if (liste[i].id === id) return liste[i];
    return null;
  }
  function nomTheme(t) { return t === 'perso' ? 'Mes questions' : t === 'essentiels' ? 'Les essentiels' : (P_BANQUE().themes[t] || t); }

  // Maîtrise moyenne (0 à 1) d'une liste de fiches.
  function maitriseMoyenne(liste) {
    if (!liste.length) return 0;
    return liste.reduce(function (s, f) { return s + P.srs.maitrise(etat.cartes[f.id]); }, 0) / liste.length;
  }

  function dues() {
    const j = aujourdhui();
    return fiches().filter(function (f) { return P.srs.estDue(etat.cartes[f.id], j); }).length;
  }

  function prochainEntretien() {
    const j = aujourdhui();
    const futurs = etat.journal.filter(function (e) { return e.date && e.date >= j && !e.passe; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    return futurs[0] || null;
  }

  // --- Navigation -----------------------------------------------------------------------------------------------------
  const vues = {};
  let vueCourante = null;
  let nettoyage = null;

  function enregistrerVue(v) { vues[v.id] = v; }

  function lireHash() {
    const h = (racine.location.hash || '').replace(/^#/, '');
    const parts = h.split('/');
    const id = vues[parts[0]] ? parts[0] : 'accueil';
    const params = {};
    parts.slice(1).forEach(function (p) {
      const k = p.indexOf('=');
      if (k > 0) params[decodeURIComponent(p.slice(0, k))] = decodeURIComponent(p.slice(k + 1));
    });
    return { id: id, params: params };
  }

  function aller(id, params) {
    let h = '#' + id;
    Object.keys(params || {}).forEach(function (k) { h += '/' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); });
    if (racine.location.hash === h) afficher();
    else racine.location.hash = h;
  }

  function afficher() {
    const cible = lireHash();
    if (typeof nettoyage === 'function') { try { nettoyage(); } catch (e) { /* rien */ } }
    nettoyage = null;
    vueCourante = vues[cible.id];
    const main = document.getElementById('contenu');
    main.innerHTML = '';
    const res = vueCourante.rendre(main, cible.params);
    if (typeof res === 'function') nettoyage = res;
    rendreNavigation();
    rafraichirEntete();
    document.title = vueCourante.titre + ' · Prépa entretiens';
    if (!cible.params.garder) racine.scrollTo(0, 0);
  }

  // Sur téléphone, seules les sections principales (ordre ≤ 5 : accueil, cours, révisions, calcul, entretien) sont dans
  // la barre du bas ; les autres passent par « Plus ».
  const PRINCIPALES = 5;

  // Icônes au trait (24 × 24), dessinées pour l'application : une par section.
  const TRACES = {
    accueil: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-6h4v6"/>',
    cours: '<path d="M3 4.5h5.5A3.5 3.5 0 0 1 12 8v12a2.5 2.5 0 0 0-2.5-2.5H3z"/><path d="M21 4.5h-5.5A3.5 3.5 0 0 0 12 8v12a2.5 2.5 0 0 1 2.5-2.5H21z"/>',
    revisions: '<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M7.5 3.5H19a1.5 1.5 0 0 1 1.5 1.5v11.5"/>',
    calcul: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
    entretien: '<path d="M20.5 12a8 8 0 0 1-11.6 7.2L4 20.5l1.3-4.4A8 8 0 1 1 20.5 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    marche: '<path d="M3.5 3.5v17h17"/><path d="m7.5 14.5 3.5-4 3 2.5 5-6"/>',
    histoires: '<path d="M12 20.5h8.5"/><path d="M16.2 3.8a2.1 2.1 0 0 1 3 3L7.5 18.5l-4 1 1-4z"/>',
    journal: '<rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M16 2.5v4M8 2.5v4M3.5 10h17"/>',
    guides: '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5"/><path d="M8.5 13h7M8.5 17h4.5"/>',
    progres: '<path d="M3.5 20.5h17"/><path d="M7 16.5v-5M12 16.5V6.5M17 16.5v-8"/>',
    reglages: '<path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    'casse-tetes': '<path d="M9.5 4.5a2.5 2.5 0 0 1 5 0V6H18a1 1 0 0 1 1 1v3.5h-1.5a2.5 2.5 0 0 0 0 5H19V19a1 1 0 0 1-1 1h-3.5v-1.5a2.5 2.5 0 0 0-5 0V20H6a1 1 0 0 1-1-1v-3.5h1.5a2.5 2.5 0 0 0 0-5H5V7a1 1 0 0 1 1-1h3.5z"/>',
    test: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2 2M9.5 2.5h5"/>',
    plus: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>'
  };
  function icone(id, classe) {
    const trace = TRACES[id];
    if (!trace) return '';
    return '<svg class="' + (classe || 'ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + trace + '</svg>';
  }

  // Regroupement de la barre latérale (ordinateur) ; les sections absentes de la liste vont dans le dernier groupe.
  const GROUPES = [
    { titre: '', ids: ['accueil'] },
    { titre: 'Apprendre', ids: ['cours', 'revisions', 'calcul'] },
    { titre: 'S’entraîner', ids: ['entretien', 'casse-tetes', 'marche'] },
    { titre: 'Préparer', ids: ['histoires', 'journal', 'guides'] },
    { titre: 'Suivi', ids: ['progres', 'reglages'] }
  ];

  function rendreNavigation() {
    const nav = document.getElementById('navigation');
    const liste = Object.keys(vues).map(function (k) { return vues[k]; })
      .filter(function (v) { return !v.cache; }).sort(function (a, b) { return a.ordre - b.ordre; });
    const lien = function (v, classe) {
      const pastille = v.pastille ? v.pastille() : '';
      return '<a href="#' + v.id + '"' + (classe ? ' class="' + classe + '"' : '') + (vueCourante === v ? ' aria-current="page"' : '') +
        '>' + icone(v.id) + '<span class="nav-texte">' + o.echapper(v.court || v.titre) + '</span>' +
        (pastille ? '<span class="pastille">' + o.echapper(pastille) + '</span>' : '') + '</a>';
    };
    const connus = {};
    GROUPES.forEach(function (g) { g.ids.forEach(function (id) { connus[id] = true; }); });
    const groupes = GROUPES.map(function (g) {
      return { titre: g.titre, vues: liste.filter(function (v) { return g.ids.indexOf(v.id) >= 0; }) };
    });
    groupes[groupes.length - 1].vues = groupes[groupes.length - 1].vues.concat(liste.filter(function (v) { return !connus[v.id]; }));
    const secondaireActive = vueCourante && (vueCourante.ordre > PRINCIPALES || vueCourante.id === 'plus');
    nav.innerHTML = groupes.filter(function (g) { return g.vues.length; }).map(function (g) {
      return (g.titre ? '<div class="nav-groupe" aria-hidden="true">' + o.echapper(g.titre) + '</div>' : '') +
        g.vues.map(function (v) { return lien(v, v.ordre > PRINCIPALES ? 'secondaire' : ''); }).join('');
    }).join('') +
      '<a href="#plus" class="plus-mobile"' + (secondaireActive ? ' aria-current="page"' : '') +
      '>' + icone('plus') + '<span class="nav-texte">Plus</span></a>';
  }

  // Écran « Plus » (téléphone) : les sections secondaires en grands boutons.
  enregistrerVue({
    id: 'plus', titre: 'Plus', icone: '⋯', ordre: 99, cache: true,
    rendre: function (main) {
      const liste = Object.keys(vues).map(function (k) { return vues[k]; })
        .filter(function (v) { return !v.cache && v.ordre > PRINCIPALES; }).sort(function (a, b) { return a.ordre - b.ordre; });
      main.innerHTML = '<h1>Plus</h1><div class="liste-sections">' + liste.map(function (v) {
        return '<a class="bouton-section" href="#' + v.id + '">' + icone(v.id) + '<span>' + o.echapper(v.titre) + '</span>' +
          '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></a>';
      }).join('') + '</div>';
    }
  });

  function rafraichirEntete() {
    const zones = document.querySelectorAll('.entete-infos');
    if (!zones.length) return;
    const s = serie();
    const d = dues();
    const prochain = prochainEntretien();
    let html = '<span class="info" title="Jours consécutifs d’entraînement"><span class="info-libelle">Série</span><b>' + s + ' j</b></span>' +
      '<span class="info' + (d ? ' info-accent' : '') + '"><span class="info-libelle">À revoir</span><b>' + d + '</b></span>';
    if (prochain) {
      const n = o.ecartJours(aujourdhui(), prochain.date);
      html += '<span class="info"><span class="info-libelle">' + o.echapper(prochain.entreprise || 'Entretien') + '</span><b>' + (n === 0 ? 'aujourd’hui' : 'J−' + n) + '</b></span>';
    }
    zones.forEach(function (el) { el.innerHTML = html; });
  }

  // --- Composants communs ---------------------------------------------------------------------------------------------
  let minuteurToast = null;
  function toast(message) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = message;
    t.classList.add('visible');
    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(function () { t.classList.remove('visible'); }, 2800);
  }

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function telecharger(nom, contenu, type) {
    const blob = new Blob([contenu], { type: type || 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // Page publiée sur claude.ai : téléchargements, impression et boîtes confirm() y sont bloqués.
  const restreint = !!racine.PREPA_ARTEFACT;

  // Fenêtre dans la page (remplace confirm(), bloqué dans certains cadres) ; « contenu » est du HTML déjà échappé.
  function fenetre(titre, contenu, boutons) {
    const voile = el('<div class="voile" role="dialog" aria-modal="true" aria-label="' + o.echapper(titre) + '"><div class="carte boite">' +
      '<h2 style="margin-top:0">' + o.echapper(titre) + '</h2>' + contenu + '<div class="ligne fin" data-boutons></div></div></div>');
    const fermer = function () { voile.remove(); document.removeEventListener('keydown', echap, true); };
    const echap = function (e) { if (e.key === 'Escape') { e.stopPropagation(); fermer(); } };
    boutons.forEach(function (b) {
      const bouton = el('<button' + (b.principal ? ' class="principal"' : '') + '>' + o.echapper(b.libelle) + '</button>');
      bouton.addEventListener('click', function () { if (b.action) b.action(voile); if (!b.garder) fermer(); });
      voile.querySelector('[data-boutons]').appendChild(bouton);
    });
    voile.addEventListener('click', function (e) { if (e.target === voile) fermer(); });
    document.addEventListener('keydown', echap, true);
    document.body.appendChild(voile);
    const premier = voile.querySelector('textarea, button.principal, button');
    if (premier) premier.focus();
    return { fermer: fermer, element: voile };
  }

  function confirmer(message, libelle, action) {
    fenetre('Confirmer', '<p>' + o.echapper(message) + '</p>', [{ libelle: 'Annuler' }, { libelle: libelle || 'Confirmer', principal: true, action: action }]);
  }

  function copier(texte, zone) {
    const ok = function () { toast('Copié dans le presse-papiers.'); };
    const repli = function () { if (zone) { zone.focus(); zone.select(); } toast('Sélectionné : copie avec Ctrl+C (ou appui long sur téléphone).'); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(ok, repli);
      else repli();
    } catch (e) { repli(); }
  }

  // Donne un texte à garder : fichier téléchargé en local, texte à copier dans une page publiée.
  function donnerTexte(nom, texte, type, explication) {
    if (!restreint) { telecharger(nom, texte, type); return; }
    fenetre('Copier', '<p class="petit">' + o.echapper(explication) + '</p><textarea readonly data-texte-a-copier style="min-height:12em;font-family:var(--mono);font-size:.8rem">' +
      o.echapper(texte) + '</textarea>', [{ libelle: 'Fermer' }, { libelle: 'Copier', principal: true, garder: true,
      action: function (v) { copier(texte, v.querySelector('[data-texte-a-copier]')); } }]);
  }

  function exporter() {
    donnerTexte('prepa-entretiens-sauvegarde-' + aujourdhui() + '.json', JSON.stringify(etat, null, 1), 'application/json',
      'Copie ce texte et garde-le (note, mail à toi-même). Pour le restaurer : Réglages → Importer un texte copié.');
  }

  function importer(texte) {
    const lu = JSON.parse(texte);
    if (!lu || typeof lu !== 'object' || lu.version !== VERSION || typeof lu.cartes !== 'object') {
      throw new Error('Ce fichier n’est pas une sauvegarde de Prépa entretiens.');
    }
    etat = fusionner(etatVide(), lu);
    sauver();
    appliquerTheme();
  }

  function reinitialiser() {
    etat = etatVide();
    sauver();
    appliquerTheme();
  }

  function appliquerTheme() {
    const t = etat.reglages.theme;
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }

  // Raccourcis clavier : transmis à la vue courante (sauf pendant une saisie, à moins que la vue ne le demande).
  function surTouche(e) {
    if (!vueCourante || !vueCourante.touche) return;
    const cible = e.target;
    const saisie = cible && (cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA' || cible.tagName === 'SELECT' || cible.isContentEditable);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    vueCourante.touche(e, saisie);
  }

  function demarrer() {
    charger();
    appliquerTheme();
    racine.addEventListener('hashchange', afficher);
    document.addEventListener('keydown', surTouche);
    // un clic sur la section déjà ouverte la réaffiche (par exemple pour quitter un bilan)
    document.addEventListener('click', function (e) {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href') === racine.location.hash) { e.preventDefault(); afficher(); }
    });
    afficher();
    // hors ligne et installable sur téléphone quand l'application est servie en http(s) (GitHub Pages)
    if ('serviceWorker' in navigator && /^https?:$/.test(racine.location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* sans service worker, l'application marche quand même */ });
    }
    if (!stockageOk) toast('Ce navigateur bloque la sauvegarde locale : ta progression ne sera pas gardée.');
  }

  P.app = {
    CLE: CLE, VERSION: VERSION, demarrer: demarrer, enregistrerVue: enregistrerVue, aller: aller, afficher: afficher,
    get etat() { return etat; }, sauver: sauver, aujourdhui: aujourdhui, noterActivite: noterActivite, serie: serie,
    fiches: fiches, fiche: fiche, banque: P_BANQUE, nomTheme: nomTheme, maitriseMoyenne: maitriseMoyenne, dues: dues, prochainEntretien: prochainEntretien,
    toast: toast, el: el, telecharger: telecharger, exporter: exporter, restreint: restreint, fenetre: fenetre,
    confirmer: confirmer, copier: copier, donnerTexte: donnerTexte, importer: importer, reinitialiser: reinitialiser,
    appliquerTheme: appliquerTheme, rendreNavigation: rendreNavigation, icone: icone, stockageOk: function () { return stockageOk; }
  };
})(this);
