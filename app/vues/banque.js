// Banque de questions : toutes les fiches, rangées comme un sommaire. Un index des thèmes à gauche ; dans un thème,
// des groupes par chapitre du cours (ou par famille pour les casse-têtes), triés par difficulté, chaque variante juste
// sous son problème. Une ligne se déplie sur place (énoncé, solution, liens). Les filtres vivent dans l'adresse :
// le bouton Retour et un lien copié retrouvent la même sélection.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;
  const PAR_GROUPE = 30;   // lignes affichées par groupe avant « Afficher la suite »

  const STATUTS = {
    nouvelle: { libelle: 'Jamais vue', classe: '' },
    revoir: { libelle: 'À revoir', classe: 'alerte' },
    encours: { libelle: 'En cours', classe: 'accent' },
    maitrisee: { libelle: 'Maîtrisée', classe: 'succes' }
  };
  const TRIS = { difficulte: 'Par difficulté', revoir: 'À revoir d’abord', maitrise: 'Moins maîtrisées d’abord' };

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function statutDe(f) {
    const c = A.etat.cartes[f.id];
    if (!c) return 'nouvelle';
    if (P.srs.estDue(c, A.aujourdhui())) return 'revoir';
    return P.srs.maitrise(c) >= 0.8 ? 'maitrisee' : 'encours';
  }
  function themes() {
    const t = Object.keys(A.banque().themes);
    if (A.etat.perso && A.etat.perso.length) t.push('perso');
    return t;
  }
  // Chapitre de rattachement : le premier chapitre (dans l'ordre du cours) qui cite la fiche ou son problème d'origine.
  const cacheChap = {};
  function chapitreDe(f) {
    if (Object.prototype.hasOwnProperty.call(cacheChap, f.id)) return cacheChap[f.id];
    let r = null;
    if (P.cours) {
      let g = f;
      for (let k = 0; g && k < 4 && !r; k++) {
        const l = P.cours.chapitresDeLaFiche(g.id).slice().sort(function (a, b) { return a.numero - b.numero; });
        r = l[0] || null;
        g = g.parent ? A.fiche(g.parent) : null;
      }
    }
    cacheChap[f.id] = r;
    return r;
  }
  function cleGroupe(f) {
    if (f.categorie) return 'cat:' + f.categorie;
    const c = chapitreDe(f);
    return c ? 'chap:' + c.id : 'autre';
  }
  function titreGroupe(cle) {
    if (cle.indexOf('cat:') === 0) return (A.banque().categories || {})[cle.slice(4)] || cle.slice(4);
    if (cle.indexOf('chap:') === 0) {
      const c = P.cours.chapitre(cle.slice(5));
      return c ? 'Chapitre ' + c.numero + ' · ' + c.titre : cle;
    }
    return 'Sans chapitre de cours';
  }
  function ordreGroupe(cle) {
    if (cle.indexOf('chap:') === 0) { const c = P.cours.chapitre(cle.slice(5)); return c ? c.numero : 900; }
    if (cle.indexOf('cat:') === 0) return 500 + Object.keys(A.banque().categories || {}).indexOf(cle.slice(4));
    return 999;
  }
  const cacheLibelle = {};
  function libelle(f) {
    if (!cacheLibelle[f.id]) cacheLibelle[f.id] = f.titre ? o.enLigne(f.titre) : o.echapper(o.resume(o.sansTex(f.question), 130));
    return cacheLibelle[f.id];
  }
  function points(n) {
    return '<span class="niveau-points" title="Difficulté ' + n + ' sur 3"><span class="sr">Difficulté ' + n + ' sur 3</span>' +
      [1, 2, 3].map(function (k) { return '<i class="' + (k <= n ? 'plein' : '') + '"></i>'; }).join('') + '</span>';
  }
  function texteRecherche(f) {
    return norm([f.titre || '', f.question, f.en || '', f.solution, o.sansTex(f.question + ' ' + f.solution)].join(' '));
  }
  const cacheTexte = {};

  // Ordre d'affichage dans un groupe : tri choisi, puis chaque variante juste après son problème d'origine.
  function ordonner(liste, tri) {
    const rangStatut = { revoir: 0, encours: 1, nouvelle: 2, maitrisee: 3 };
    const cmp = function (a, b) {
      if (tri === 'revoir') { const d = rangStatut[statutDe(a)] - rangStatut[statutDe(b)]; if (d) return d; }
      if (tri === 'maitrise') { const d = P.srs.maitrise(A.etat.cartes[a.id]) - P.srs.maitrise(A.etat.cartes[b.id]); if (d) return d; }
      return (a.niveau - b.niveau) || norm(a.titre || a.question).localeCompare(norm(b.titre || b.question));
    };
    const ids = {};
    liste.forEach(function (f) { ids[f.id] = true; });
    const racines = liste.filter(function (f) { return !f.parent || !ids[f.parent]; }).sort(cmp);
    const enfants = {};
    liste.forEach(function (f) { if (f.parent && ids[f.parent]) (enfants[f.parent] = enfants[f.parent] || []).push(f); });
    const r = [];
    const poser = function (f, profondeur) {
      r.push({ f: f, variante: profondeur > 0 });
      (enfants[f.id] || []).sort(cmp).forEach(function (g) { poser(g, profondeur + 1); });
    };
    racines.forEach(function (f) { poser(f, 0); });
    return r;
  }

  function ligne(x) {
    const f = x.f;
    const s = statutDe(f);
    return '<li class="ligne-fiche' + (x.variante ? ' variante' : '') + '" data-id="' + o.echapper(f.id) + '">' +
      '<button type="button" class="tete-fiche" aria-expanded="false" data-deplier>' +
      '<span class="libelle-fiche">' + (x.variante ? '<span class="marque-variante">Variante</span> ' : '') + libelle(f) + '</span>' +
      (f.essentiel ? '<span class="etiquette accent" title="Question qui revient très souvent">Essentiel</span>' : '') +
      points(f.niveau) + '<span class="statut-fiche ' + STATUTS[s].classe + '">' + STATUTS[s].libelle + '</span></button>' +
      '<div class="detail-fiche" hidden></div></li>';
  }

  function detail(f) {
    const chap = chapitreDe(f);
    const qcm = P.qcm ? P.qcm.toutes().filter(function (q) { return q.cible === f.id; }) : [];
    const parent = f.parent ? A.fiche(f.parent) : null;
    return (parent ? '<p class="petit doux">Variante de <a href="#banque/fiche=' + encodeURIComponent(parent.id) + '">' + libelle(parent) + '</a></p>' : '') +
      '<div class="question">' + o.markdown(f.question) + '</div>' +
      '<details class="solution-banque"><summary>Solution</summary>' + o.markdown(f.solution) +
      (f.piege ? '<p><strong>Piège :</strong> ' + o.enLigne(f.piege) + '</p>' : '') +
      (f.relances && f.relances.length ? '<p class="petit"><strong>Relances probables</strong></p><ul class="petit">' + f.relances.map(function (r) { return '<li>' + o.enLigne(r) + '</li>'; }).join('') + '</ul>' : '') +
      '</details>' +
      '<div class="actions-fiche"><a class="bouton principal" href="#revisions/fiche=' + encodeURIComponent(f.id) + '">S’entraîner</a>' +
      (qcm.length ? '<a class="bouton" href="#qcm/s=' + encodeURIComponent(qcm.map(function (q) { return q.id; }).join(',')) + '">QCM</a>' : '') +
      (chap ? '<a class="bouton discret" href="#cours/c=' + encodeURIComponent(chap.id) + '">Cours : chapitre ' + chap.numero + '</a>' : '') +
      (f.categorie ? '<a class="bouton discret" href="#casse-tetes/f=' + encodeURIComponent(f.id) + '">Ouvrir dans Casse-têtes</a>' : '') + '</div>';
  }

  function rendre(main, params) {
    const etat = {
      theme: params.theme || '', q: params.q || '', statut: params.statut || '', niveau: params.niveau || '',
      profil: params.profil || '', essentiels: params.essentiels === '1', tri: TRIS[params.tri] ? params.tri : 'difficulte'
    };
    const deplies = {};
    const banque = A.banque();
    main.innerHTML = '<div class="tete-page"><div><h1>Banque de questions</h1><p class="chapeau">Toutes les fiches, rangées par thème puis par chapitre du cours.</p></div>' +
      '<div class="ligne"><button class="bouton principal" data-reviser-selection>Réviser cette sélection</button></div></div>' +
      '<div class="banque">' +
      '<nav class="index-banque" aria-label="Thèmes"><ul data-index></ul></nav>' +
      '<section class="corps-banque" aria-label="Questions">' +
      '<div class="outils-banque">' +
      '<label class="champ-recherche"><span class="sr">Chercher</span><input type="search" data-cherche placeholder="Chercher : Itô, gamma, dés, Kelly…" value="' + o.echapper(etat.q) + '"><kbd>/</kbd></label>' +
      '<button type="button" class="bouton-filtres" data-filtres aria-expanded="false" aria-controls="filtres-banque">Filtres<span data-nb-filtres></span></button>' +
      '<div class="filtres-banque" id="filtres-banque">' +
      '<select data-statut aria-label="Statut"><option value="">Tous les statuts</option>' + Object.keys(STATUTS).map(function (k) {
        return '<option value="' + k + '"' + (etat.statut === k ? ' selected' : '') + '>' + STATUTS[k].libelle + '</option>';
      }).join('') + '</select>' +
      '<select data-niveau aria-label="Difficulté"><option value="">Toutes difficultés</option>' + [1, 2, 3].map(function (n) {
        return '<option value="' + n + '"' + (etat.niveau === String(n) ? ' selected' : '') + '>' + ['Facile', 'Moyenne', 'Difficile'][n - 1] + '</option>';
      }).join('') + '</select>' +
      '<select data-profil aria-label="Profil de poste"><option value="">Tous les postes</option>' + Object.keys(banque.profils).map(function (p) {
        return '<option value="' + p + '"' + (etat.profil === p ? ' selected' : '') + '>' + o.echapper(banque.profils[p]) + '</option>';
      }).join('') + '</select>' +
      '<select data-tri aria-label="Ordre">' + Object.keys(TRIS).map(function (k) {
        return '<option value="' + k + '"' + (etat.tri === k ? ' selected' : '') + '>' + TRIS[k] + '</option>';
      }).join('') + '</select>' +
      '<label class="case"><input type="checkbox" data-essentiels' + (etat.essentiels ? ' checked' : '') + '> Essentiels</label>' +
      '</div></div><p class="compte-banque" data-compte aria-live="polite"></p><div data-groupes></div></section></div>';

    const zIndex = main.querySelector('[data-index]');
    const zGroupes = main.querySelector('[data-groupes]');
    let selection = [];

    function garderAdresse() {
      const p = {};
      if (etat.theme) p.theme = etat.theme;
      if (etat.q) p.q = etat.q;
      if (etat.statut) p.statut = etat.statut;
      if (etat.niveau) p.niveau = etat.niveau;
      if (etat.profil) p.profil = etat.profil;
      if (etat.essentiels) p.essentiels = '1';
      if (etat.tri !== 'difficulte') p.tri = etat.tri;
      let h = '#banque';
      Object.keys(p).forEach(function (k) { h += '/' + k + '=' + encodeURIComponent(p[k]); });
      try { racine.history.replaceState(null, '', h); } catch (e) { /* file:// sans historique : sans importance */ }
    }
    // Filtres hors thème : servent aussi aux compteurs de l'index
    function passe(f) {
      if (etat.statut && statutDe(f) !== etat.statut) return false;
      if (etat.niveau && String(f.niveau) !== etat.niveau) return false;
      if (etat.profil && (f.profils || []).indexOf(etat.profil) < 0) return false;
      if (etat.essentiels && !f.essentiel) return false;
      if (etat.q) {
        if (!cacheTexte[f.id]) cacheTexte[f.id] = texteRecherche(f);
        const mots = norm(etat.q).split(/\s+/).filter(Boolean);
        for (let k = 0; k < mots.length; k++) if (cacheTexte[f.id].indexOf(mots[k]) < 0) return false;
      }
      return true;
    }

    function maj() {
      const toutes = A.fiches();
      const filtrees = toutes.filter(passe);
      const parTheme = {};
      filtrees.forEach(function (f) { (parTheme[f.theme] = parTheme[f.theme] || []).push(f); });
      // index
      zIndex.innerHTML = '<li><a href="#banque" data-theme=""' + (!etat.theme ? ' aria-current="true"' : '') + '><span>Tous les thèmes</span><span class="nb">' + filtrees.length + '</span></a></li>' +
        themes().map(function (t) {
          const n = (parTheme[t] || []).length;
          return '<li><a href="#banque/theme=' + t + '" data-theme="' + t + '"' + (etat.theme === t ? ' aria-current="true"' : '') + (n ? '' : ' class="vide"') + '>' +
            '<span>' + o.echapper(A.nomTheme(t)) + '</span><span class="nb">' + n + '</span></a></li>';
        }).join('');
      // sur téléphone l'index défile à l'horizontale : garder le thème choisi en vue
      const courant = zIndex.querySelector('[aria-current]');
      const barre = zIndex.parentNode;
      if (courant && barre.scrollWidth > barre.clientWidth) barre.scrollLeft = courant.offsetLeft - (barre.clientWidth - courant.offsetWidth) / 2;
      // groupes : par thème si aucun thème choisi, sinon par chapitre / famille
      const liste = etat.theme ? (parTheme[etat.theme] || []) : filtrees;
      selection = liste;
      const groupes = {};
      liste.forEach(function (f) {
        const cle = etat.theme ? cleGroupe(f) : 'theme:' + f.theme;
        (groupes[cle] = groupes[cle] || []).push(f);
      });
      const cles = Object.keys(groupes).sort(function (a, b) {
        if (!etat.theme) return themes().indexOf(a.slice(6)) - themes().indexOf(b.slice(6));
        return ordreGroupe(a) - ordreGroupe(b);
      });
      const filtresActifs = etat.q || etat.statut || etat.niveau || etat.profil || etat.essentiels;
      const nbFiltres = [etat.statut, etat.niveau, etat.profil, etat.essentiels].filter(Boolean).length;
      main.querySelector('[data-nb-filtres]').textContent = nbFiltres ? ' · ' + nbFiltres : '';
      main.querySelector('[data-compte]').innerHTML = liste.length + ' question' + (liste.length > 1 ? 's' : '') +
        (etat.theme ? ' en ' + o.echapper(A.nomTheme(etat.theme)) : '') +
        (filtresActifs ? ' · <button class="lien" data-effacer>Effacer les filtres</button>' : '');
      // en vue d'ensemble on replie : 6 par thème ; dans un thème ou une recherche, 30 par groupe
      const limite = etat.theme || etat.q ? PAR_GROUPE : 6;
      zGroupes.innerHTML = cles.length ? cles.map(function (cle) {
        const l = ordonner(groupes[cle], etat.tri);
        const titre = cle.indexOf('theme:') === 0 ? A.nomTheme(cle.slice(6)) : titreGroupe(cle);
        const maitrise = l.reduce(function (s, x) { return s + P.srs.maitrise(A.etat.cartes[x.f.id]); }, 0) / l.length;
        const tout = deplies[cle];
        const vus = tout ? l : l.slice(0, limite);
        const lienGroupe = cle.indexOf('theme:') === 0 ? '<a class="petit" href="#banque/theme=' + cle.slice(6) + '" data-theme="' + cle.slice(6) + '">Tout le thème →</a>' :
          cle.indexOf('chap:') === 0 ? '<a class="petit" href="#cours/c=' + encodeURIComponent(cle.slice(5)) + '">Lire le chapitre</a>' : '';
        return '<section class="groupe-banque" id="g-' + o.echapper(cle.replace(/[^a-z0-9-]/gi, '-')) + '">' +
          '<header><h2>' + o.enLigne(titre) + '</h2><span class="legende">' + l.length + ' · maîtrise ' + Math.round(100 * maitrise) + ' %</span>' +
          '<span class="espace"></span>' + lienGroupe + '</header>' +
          '<ul class="lignes-fiches">' + vus.map(ligne).join('') + '</ul>' +
          (vus.length < l.length ? '<button class="lien plus-groupe" data-plus="' + o.echapper(cle) + '">Afficher les ' + (l.length - vus.length) + ' autres</button>' : '') +
          '</section>';
      }).join('') : '<div class="vide-banque"><p>Aucune question ne correspond.</p>' + (filtresActifs ? '<button data-effacer>Effacer les filtres</button>' : '') + '</div>';
      garderAdresse();
    }

    function lire() {
      etat.q = main.querySelector('[data-cherche]').value.trim();
      etat.statut = main.querySelector('[data-statut]').value;
      etat.niveau = main.querySelector('[data-niveau]').value;
      etat.profil = main.querySelector('[data-profil]').value;
      etat.tri = main.querySelector('[data-tri]').value;
      etat.essentiels = main.querySelector('[data-essentiels]').checked;
    }
    let attente = null;
    main.querySelector('.outils-banque').addEventListener('input', function (e) {
      clearTimeout(attente);
      attente = setTimeout(function () { lire(); maj(); }, e.target.matches('[data-cherche]') ? 120 : 0);
    });
    main.addEventListener('click', function (e) {
      const t = e.target.closest('[data-theme]');
      if (t && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        etat.theme = t.getAttribute('data-theme');
        maj();
        racine.scrollTo(0, 0);
        return;
      }
      const d = e.target.closest('[data-deplier]');
      if (d) {
        const li = d.parentNode;
        const zone = li.querySelector('.detail-fiche');
        const ouvrir = zone.hidden;
        if (ouvrir && !zone.innerHTML) zone.innerHTML = detail(A.fiche(li.getAttribute('data-id')));
        zone.hidden = !ouvrir;
        d.setAttribute('aria-expanded', String(ouvrir));
        li.classList.toggle('ouverte', ouvrir);
        return;
      }
      const bf = e.target.closest('[data-filtres]');
      if (bf) {
        const z = main.querySelector('.outils-banque');
        const ouvert = !z.classList.contains('filtres-ouverts');
        z.classList.toggle('filtres-ouverts', ouvert);
        bf.setAttribute('aria-expanded', String(ouvert));
        return;
      }
      const p = e.target.closest('[data-plus]');
      if (p) { deplies[p.getAttribute('data-plus')] = true; maj(); return; }
      if (e.target.closest('[data-effacer]')) {
        etat.q = ''; etat.statut = ''; etat.niveau = ''; etat.profil = ''; etat.essentiels = false;
        main.querySelector('[data-cherche]').value = '';
        ['statut', 'niveau', 'profil'].forEach(function (k) { main.querySelector('[data-' + k + ']').value = ''; });
        main.querySelector('[data-essentiels]').checked = false;
        maj();
      }
    });
    main.querySelector('[data-reviser-selection]').addEventListener('click', function () {
      // 15 questions de la sélection, les moins maîtrisées d'abord
      const ids = o.melanger(Math.random, selection.slice()).sort(function (a, b) {
        return P.srs.maitrise(A.etat.cartes[a.id]) - P.srs.maitrise(A.etat.cartes[b.id]);
      }).slice(0, 15).map(function (f) { return f.id; });
      if (!ids.length) { A.toast('Aucune question dans la sélection.'); return; }
      A.aller('revisions', { ids: ids.join(',') });
    });
    maj();
    // lien direct vers une fiche : son thème, la ligne dépliée
    if (params.fiche) {
      const f = A.fiche(params.fiche);
      if (f) {
        etat.theme = f.theme; maj();
        let li = main.querySelector('.ligne-fiche[data-id="' + f.id + '"]');
        if (!li) { deplies[cleGroupe(f)] = true; maj(); li = main.querySelector('.ligne-fiche[data-id="' + f.id + '"]'); }
        if (li) { li.querySelector('[data-deplier]').click(); setTimeout(function () { li.scrollIntoView({ block: 'center' }); }, 30); }
      }
    }
  }

  A.enregistrerVue({
    id: 'banque', titre: 'Banque de questions', court: 'Banque', icone: '≡', ordre: 6.5, rendre: rendre,
    touche: function (e, saisie) {
      if (!saisie && e.key === '/') {
        const c = document.querySelector('[data-cherche]');
        if (c) { e.preventDefault(); c.focus(); c.select(); }
      }
    }
  });
})(this);
