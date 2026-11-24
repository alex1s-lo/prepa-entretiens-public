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

  function rendreNavigation() {
    const nav = document.getElementById('navigation');
    const liste = Object.keys(vues).map(function (k) { return vues[k]; })
      .filter(function (v) { return !v.cache; }).sort(function (a, b) { return a.ordre - b.ordre; });
    const lien = function (v, classe) {
      const pastille = v.pastille ? v.pastille() : '';
      return '<a href="#' + v.id + '"' + (classe ? ' class="' + classe + '"' : '') + (vueCourante === v ? ' aria-current="page"' : '') +
        '><span class="ico" aria-hidden="true">' + v.icone + '</span><span>' + o.echapper(v.court || v.titre) + '</span>' +
        (pastille ? '<span class="pastille">' + o.echapper(pastille) + '</span>' : '') + '</a>';
    };
    const secondaireActive = vueCourante && (vueCourante.ordre > PRINCIPALES || vueCourante.id === 'plus');
    nav.innerHTML = liste.map(function (v) { return lien(v, v.ordre > PRINCIPALES ? 'secondaire' : ''); }).join('') +
      '<a href="#plus" class="plus-mobile"' + (secondaireActive ? ' aria-current="page"' : '') +
      '><span class="ico" aria-hidden="true">\u22ef</span><span>Plus</span></a>';
  }

  // Écran « Plus » (téléphone) : les sections secondaires en grands boutons.
  enregistrerVue({
    id: 'plus', titre: 'Plus', icone: '\u22ef', ordre: 99, cache: true,
    rendre: function (main) {
      const liste = Object.keys(vues).map(function (k) { return vues[k]; })
        .filter(function (v) { return !v.cache && v.ordre > PRINCIPALES; }).sort(function (a, b) { return a.ordre - b.ordre; });
      main.innerHTML = '<h1>Plus</h1><div class="grille">' + liste.map(function (v) {
        return '<a class="carte bouton-section" href="#' + v.id + '"><span class="ico" aria-hidden="true">' + v.icone + '</span> ' +
          o.echapper(v.titre) + '</a>';
      }).join('') + '</div>';
    }
  });

  function rafraichirEntete() {
    const el = document.getElementById('entete-infos');
    if (!el) return;
    const s = serie();
    const prochain = prochainEntretien();
    let html = '<span title="Jours consécutifs d’entraînement">Série : <b>' + s + ' j</b></span>' +
      '<span>À revoir : <b>' + dues() + '</b></span>';
    if (prochain) {
      const n = o.ecartJours(aujourdhui(), prochain.date);
      html += '<span>' + o.echapper(prochain.entreprise || 'Entretien') + ' : <b>' + (n === 0 ? 'aujourd’hui' : 'J−' + n) + '</b></span>';
    }
    el.innerHTML = html;
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
    appliquerTheme: appliquerTheme, rendreNavigation: rendreNavigation, stockageOk: function () { return stockageOk; }
  };
})(this);
