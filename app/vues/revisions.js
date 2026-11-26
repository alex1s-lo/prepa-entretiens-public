// Révisions : file du jour (répétition espacée), révision libre par thème, et banque de questions consultable.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  // --- Synthèse vocale du navigateur (hors ligne avec les voix du système) ---
  function voixDisponible() { return typeof racine.speechSynthesis !== 'undefined' && typeof racine.SpeechSynthesisUtterance !== 'undefined'; }
  function taire() { if (voixDisponible()) racine.speechSynthesis.cancel(); }
  function parler(texte, anglais) {
    if (!voixDisponible() || !texte) return;
    const synthese = racine.speechSynthesis;
    synthese.cancel();
    const u = new racine.SpeechSynthesisUtterance(texte);
    u.lang = anglais ? 'en-GB' : 'fr-FR';
    const voix = (synthese.getVoices() || []).filter(function (v) { return v.lang && v.lang.replace('_', '-').toLowerCase().indexOf(anglais ? 'en' : 'fr') === 0; });
    const preferee = voix.filter(function (v) { return /en-GB|fr-FR/i.test(v.lang.replace('_', '-')); })[0] || voix[0];
    if (preferee) u.voice = preferee;
    u.rate = 0.97;
    synthese.speak(u);
  }

  function niveauTexte(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

  function delaiTexte(jours) {
    if (jours <= 0) return 'à revoir tout de suite';
    if (jours === 1) return 'demain';
    if (jours < 30) return 'dans ' + jours + ' j';
    return 'dans ' + Math.round(jours / 30) + ' mois';
  }

  function etiquettes(f) {
    const banque = A.banque();
    let h = '<span class="etiquette accent">' + o.echapper(A.nomTheme(f.theme)) + '</span> ' +
      '<span class="etiquette" title="Difficulté">' + niveauTexte(f.niveau || 1) + '</span> ';
    (f.profils || []).forEach(function (p) {
      h += '<span class="etiquette" title="' + o.echapper(banque.profils[p] || p) + '">' + o.echapper(p) + '</span> ';
    });
    if (f.essentiel) h += '<span class="etiquette alerte" title="Fait partie des essentiels">essentiel</span> ';
    if (f.source) h += '<span class="etiquette">' + o.echapper(f.source) + '</span>';
    return h;
  }

  // Lien vers une fiche : les énigmes s'ouvrent dans Casse-têtes, les autres questions dans Révisions.
  function lienFiche(f) {
    return (f.categorie ? '#casse-tetes/f=' : '#revisions/fiche=') + encodeURIComponent(f.id);
  }
  function nomFiche(f) {
    return f.titre ? o.enLigne(f.titre) : o.echapper(o.resume(f.question, 90));
  }
  // Variantes d'un problème d'origine (fiches qui portent « parent: id »).
  function variantesDe(id) {
    return A.fiches().filter(function (x) { return x.parent === id; });
  }
  function listeLiens(fiches) {
    return '<ul class="liens-fiches">' + fiches.map(function (x) {
      const vue = A.etat.cartes[x.id];
      return '<li><a href="' + lienFiche(x) + '">' + nomFiche(x) + '</a>' + (vue ? ' <span class="etiquette accent">vu</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }

  // Carte de question réutilisable (révisions et entretien blanc).
  // options : onNote(note, infos) appelé après la note ; chrono (bool) ; titre (texte au-dessus) ; sansNote (bool)
  function carteQuestion(f, options) {
    const opt = options || {};
    const etat = A.etat;
    const enAnglais = !!(etat.reglages.anglais && f.en);
    const racineEl = A.el('<section class="carte carte-question" aria-live="polite"></section>');
    const infos = { indice: false, juste: null, saisie: '', revelee: false, debut: Date.now(), anglais: enAnglais };
    let minuteur = null;

    function enonce() {
      return infos.anglais && f.en ? f.en : f.question;
    }

    racineEl.innerHTML =
      (opt.titre ? '<div class="bloc-titre">' + o.echapper(opt.titre) + '</div>' : '') +
      '<div class="ligne petit">' + etiquettes(f) + '<span class="espace"></span>' +
      (opt.chrono ? '<span class="chrono" data-chrono>0:00</span>' : '') +
      (f.en ? '<button class="discret" data-langue title="Changer de langue (touche e)">' + (infos.anglais ? 'FR' : 'EN') + '</button>' : '') +
      (voixDisponible() ? '<button class="discret" data-lire title="Écouter la question (touche l)" aria-label="Écouter la question"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg></button>' : '') +
      '</div>' +
      (f.parent && A.fiche(f.parent) ? '<p class="remarque-variante">Variante de <a href="' + lienFiche(A.fiche(f.parent)) + '">' + nomFiche(A.fiche(f.parent)) + '</a></p>' : '') +
      '<div class="question" data-enonce>' + o.markdown(enonce()) + '</div>' +
      (f.type === 'numerique' ?
        '<form class="ligne" data-form autocomplete="off"><input data-saisie aria-label="Ta réponse" placeholder="Ta réponse (ex. 1/6, 0,17, e^-1, √2/2)" style="flex:1;min-width:12ch">' +
        '<button class="principal" type="submit">Vérifier</button></form><div data-verdict></div>' : '') +
      '<div class="ligne" data-actions style="margin-top:12px">' +
      (f.indice ? '<button data-indice>Indice <kbd>i</kbd></button>' : '') +
      '<button class="principal" data-reveler>Voir la solution <kbd>espace</kbd></button></div>' +
      '<div data-indice-texte></div>' +
      '<div class="solution" data-solution hidden></div>';

    const q = function (s) { return racineEl.querySelector(s); };

    if (opt.chrono) {
      minuteur = setInterval(function () {
        const c = q('[data-chrono]');
        if (!c || !racineEl.isConnected) { clearInterval(minuteur); return; }
        const s = (Date.now() - infos.debut) / 1000;
        c.textContent = o.duree(s);
        if (f.duree && s > f.duree) c.classList.add('urgent');
      }, 500);
    }

    function lire() {
      if (!voixDisponible()) return;
      parler(o.textePrononcable(enonce(), infos.anglais && !!f.en), infos.anglais && !!f.en);
    }
    function basculerLangue() {
      if (!f.en) return;
      infos.anglais = !infos.anglais;
      q('[data-enonce]').innerHTML = o.markdown(enonce());
      q('[data-langue]').textContent = infos.anglais ? 'FR' : 'EN';
    }
    function montrerIndice() {
      if (!f.indice || q('[data-indice-texte]').innerHTML) return;
      infos.indice = true;
      q('[data-indice-texte]').innerHTML = '<div class="encadre alerte"><div class="bloc-titre">Indice</div>' + o.markdown(f.indice) + '</div>';
      const b = q('[data-indice]');
      if (b) b.disabled = true;
    }
    function verifier() {
      const saisie = q('[data-saisie]');
      if (!saisie || infos.juste !== null) return;
      const v = o.lireNombre(saisie.value);
      if (!isFinite(v)) {
        q('[data-verdict]').innerHTML = '<p class="petit doux">Je ne lis pas ce nombre. Exemples : 1/6 ; 0,1667 ; 16,7 % ; e^-1 ; sqrt(2)/2.</p>';
        return;
      }
      infos.saisie = saisie.value;
      infos.juste = o.procheDe(v, f.valeur, f.tolerance);
      saisie.disabled = true;
      q('[data-form] button').disabled = true;
      q('[data-verdict]').innerHTML = infos.juste ?
        '<div class="encadre succes"><strong>Juste.</strong> Réponse attendue : ' + o.echapper(f.reponse) + ' ≈ ' + o.formaterNombre(f.valeur, 5) + '.</div>' :
        '<div class="encadre erreur"><strong>Pas tout à fait.</strong> Tu as répondu ' + o.formaterNombre(v, 5) + ' ; réponse attendue : ' +
          o.echapper(f.reponse) + ' ≈ ' + o.formaterNombre(f.valeur, 5) + '.</div>';
      reveler();
    }
    function reveler() {
      if (infos.revelee) return;
      infos.revelee = true;
      infos.duree = (Date.now() - infos.debut) / 1000;
      if (minuteur) clearInterval(minuteur);
      const etatCarte = A.etat.cartes[f.id];
      const jour = A.aujourdhui();
      let h = '<div class="bloc-titre">Solution</div>' + o.markdown(f.solution);
      if (f.piege) h += '<div class="encadre alerte"><div class="bloc-titre">Piège classique</div>' + o.markdown(f.piege) + '</div>';
      const enfants = variantesDe(f.id);
      if (enfants.length) h += '<div class="bloc-titre">Variantes de ce problème</div><div class="variantes">' + listeLiens(enfants) + '</div>';
      const voisins = (f.voir || []).map(A.fiche).filter(Boolean);
      if (voisins.length) h += '<div class="bloc-titre">Problèmes voisins</div>' + listeLiens(voisins);
      if (f.relances && f.relances.length) {
        h += '<div class="bloc-titre">Relances probables de l’intervieweur</div><ul>' +
          f.relances.map(function (r) { return '<li>' + o.enLigne(r) + '</li>'; }).join('') + '</ul>';
      }
      if (f.en && !infos.anglais) h += '<details class="petit"><summary>Formulation en anglais</summary>' + o.markdown(f.en) + '</details>';
      const chapitres = P.cours ? P.cours.chapitresDeLaFiche(f.id) : [];
      if (chapitres.length) {
        h += '<p class="petit">Revoir le cours : ' + chapitres.map(function (c) {
          return '<a href="#cours/c=' + c.id + '">chapitre ' + c.numero + ', ' + o.echapper(c.titre) + '</a>';
        }).join(' · ') + '</p>';
      }
      h += '<details class="petit" data-note-bloc' + (A.etat.notes[f.id] ? ' open' : '') + '><summary>Ma note sur cette question</summary>' +
        '<textarea data-note placeholder="Ce que j’ai raté, une astuce, ma propre formulation…" style="min-height:4em">' +
        o.echapper(A.etat.notes[f.id] || '') + '</textarea></details>';
      if (!opt.sansNote) {
        const suggestion = infos.juste === false ? 0 : infos.juste === true ? (infos.indice ? 1 : 2) : -1;
        h += '<div class="bloc-titre">Comment ça s’est passé ?</div><div class="ligne" data-notes>' + P.srs.NOTES.map(function (nom, n) {
          const prevu = P.srs.planifier(etatCarte, n, jour).intervalle;
          return '<button class="note-' + n + (n === suggestion ? ' principal' : '') + '" data-note-val="' + n + '"><kbd>' + (n + 1) + '</kbd> ' + nom +
            ' <span class="petit doux">' + delaiTexte(prevu) + '</span></button>';
        }).join('') + '</div>';
      }
      const sol = q('[data-solution]');
      sol.innerHTML = h;
      sol.hidden = false;
      const actions = q('[data-actions]');
      if (actions) actions.hidden = true;
      const note = q('[data-note]');
      note.addEventListener('input', function () {
        if (note.value.trim()) A.etat.notes[f.id] = note.value; else delete A.etat.notes[f.id];
        A.sauver();
      });
      racineEl.querySelectorAll('[data-note-val]').forEach(function (b) {
        b.addEventListener('click', function () { noter(Number(b.getAttribute('data-note-val'))); });
      });
      if (opt.onRevele) opt.onRevele(infos);
    }
    let note = null;
    function noter(n) {
      if (!infos.revelee || note !== null || opt.sansNote) return;
      note = n;
      const avant = A.etat.cartes[f.id];
      A.etat.cartes[f.id] = P.srs.planifier(avant, n, A.aujourdhui());
      A.noterActivite('revues');
      if (n >= 2) A.noterActivite('justes');
      if (!avant) A.noterActivite('nouvelles');
      if (A.son) A.son(n >= 2 ? 'juste' : n === 1 ? 'clic' : 'faux');
      A.sauver();
      racineEl.querySelectorAll('[data-note-val]').forEach(function (b) { b.disabled = true; });
      if (opt.onNote) opt.onNote(n, infos);
    }

    racineEl.addEventListener('click', function (e) {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.hasAttribute('data-langue')) basculerLangue();
      else if (t.hasAttribute('data-lire')) lire();
      else if (t.hasAttribute('data-indice')) montrerIndice();
      else if (t.hasAttribute('data-reveler')) reveler();
    });
    const form = q('[data-form]');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); verifier(); });

    racineEl.controle = {
      touche: function (e, saisie) {
        if (saisie) return false;
        if (e.key === ' ' || e.key === 'Enter') { if (!infos.revelee) { reveler(); return true; } return false; }
        if (e.key === 'i') { montrerIndice(); return true; }
        if (e.key === 'e') { basculerLangue(); return true; }
        if (e.key === 'l') { lire(); return true; }
        if (/^[1-4]$/.test(e.key) && infos.revelee) { noter(Number(e.key) - 1); return true; }
        return false;
      },
      reveler: reveler,
      arreter: function () { if (minuteur) clearInterval(minuteur); taire(); },
      infos: infos
    };
    setTimeout(function () { const s = q('[data-saisie]'); if (s && opt.focus !== false) s.focus(); }, 0);
    if (opt.lireAuto) setTimeout(lire, 300);
    return racineEl;
  }

  // --- Vue ------------------------------------------------------------------------------------------------------------
  let controleCourant = null;
  let session = null;

  function themesDisponibles() {
    const banque = A.banque();
    const t = Object.keys(banque.themes);
    if (A.etat.perso.length) t.push('perso');
    return t;
  }

  function nouvelleSession(mode, theme) {
    const etat = A.etat;
    const jour = A.aujourdhui();
    const toutes = A.fiches();
    let ids;
    if (mode === 'chapitre') {
      // les fiches d'un chapitre du cours : d'abord les moins maîtrisées
      const chap = P.cours && P.cours.chapitre(theme);
      const liste = chap ? chap.fiches.map(function (id) { return A.fiche(id); }).filter(Boolean) : [];
      ids = liste.sort(function (a, b) {
        return P.srs.maitrise(etat.cartes[a.id]) - P.srs.maitrise(etat.cartes[b.id]) || a.niveau - b.niveau;
      }).map(function (f) { return f.id; });
    } else if (mode === 'libre') {
      // révision libre d'un thème : d'abord les moins maîtrisées, sans tenir compte de l'échéance
      const liste = toutes.filter(function (f) { return theme === 'essentiels' ? f.essentiel : f.theme === theme; });
      ids = o.melanger(Math.random, liste).sort(function (a, b) {
        return P.srs.maitrise(etat.cartes[a.id]) - P.srs.maitrise(etat.cartes[b.id]) || a.niveau - b.niveau;
      }).slice(0, 15).map(function (f) { return f.id; });
    } else {
      const faits = (etat.jours[jour] && etat.jours[jour].nouvelles) || 0;
      ids = P.srs.construireFile(toutes, etat.cartes, {
        jour: jour, nouveauxMax: etat.reglages.nouveauxParJour, nouveauxFaits: faits,
        themes: theme ? [theme] : null, profils: theme ? null : etat.reglages.profils
      });
    }
    session = { mode: mode, theme: theme || null, file: ids, rang: 0, notes: [], remis: {} };
  }

  function rendre(main, params) {
    controleCourant = null;
    if (params.onglet === 'banque') {
      // ancien onglet : la banque a sa propre page
      const p = Object.assign({}, params); delete p.onglet;
      let h = '#banque';
      Object.keys(p).forEach(function (k) { h += '/' + k + '=' + encodeURIComponent(p[k]); });
      racine.location.replace(h);
      return;
    }
    const onglet = params.onglet || 'session';
    main.appendChild(A.el('<div><h1>Révisions</h1><p class="doux">Réponds à voix haute, regarde la solution, note-toi : chaque question revient au bon moment.</p></div>'));
    const onglets = A.el('<div class="onglets"><div class="onglets-tabs" role="tablist">' +
      ['session:Session du jour', 'themes:Par thème'].map(function (x) {
        const p = x.split(':');
        return '<button role="tab" aria-selected="' + (p[0] === onglet) + '" data-onglet="' + p[0] + '">' + p[1] + '</button>';
      }).join('') + '</div><a class="onglet-lien" href="#banque">Banque de questions →</a></div>');
    onglets.addEventListener('click', function (e) {
      const b = e.target.closest('[data-onglet]');
      if (b) { session = null; A.aller('revisions', { onglet: b.getAttribute('data-onglet') }); }
    });
    main.appendChild(onglets);
    const zone = A.el('<div></div>');
    main.appendChild(zone);
    if (onglet === 'themes' && !params.theme) rendreThemes(zone);
    else {
      const mode = params.mode || 'jour';
      const finie = session && session.rang >= session.file.length;
      if (params.fiche) session = { mode: 'unique', theme: null, file: [params.fiche], rang: 0, notes: [], remis: {} };
      else if (params.ids) {
        const ids = params.ids.split(',').filter(function (id) { return A.fiche(id); });
        if (!session || finie || session.mode !== 'liste' || session.cle !== params.ids) session = { mode: 'liste', cle: params.ids, theme: null, file: ids, rang: 0, notes: [], remis: {} };
      }
      else if (params.chapitre) {
        if (!session || finie || session.mode !== 'chapitre' || session.theme !== params.chapitre) nouvelleSession('chapitre', params.chapitre);
      }
      else if (!session || finie || session.mode !== mode || session.theme !== (params.theme || null)) nouvelleSession(mode, params.theme || null);
      rendreSession(zone);
    }
    return function () { if (controleCourant && controleCourant.arreter) controleCourant.arreter(); };
  }

  function rendreSession(zone) {
    zone.innerHTML = '';
    if (!session.file.length) {
      zone.appendChild(A.el('<div class="carte"><h2>Rien à revoir pour l’instant</h2><p>Tu as fait toutes les cartes prévues aujourd’hui ' +
        '(et ta dose de nouvelles questions). Pour aller plus loin : révise un thème précis, ou augmente le nombre de nouvelles questions par jour dans Réglages.</p>' +
        '<div class="ligne"><a class="bouton principal" href="#revisions/onglet=themes">Réviser un thème</a> <a class="bouton" href="#calcul">Calcul mental</a> ' +
        '<a class="bouton" href="#entretien">Entretien blanc</a></div></div>'));
      return;
    }
    if (session.rang >= session.file.length) { rendreBilan(zone); return; }
    const f = A.fiche(session.file[session.rang]);
    if (!f) { session.rang++; rendreSession(zone); return; }
    const total = session.file.length;
    const chapitreSession = session.mode === 'chapitre' && P.cours ? P.cours.chapitre(session.theme) : null;
    const titre = chapitreSession ? 'Cours, chapitre ' + chapitreSession.numero + ' : ' + chapitreSession.titre :
      session.mode === 'libre' ? 'Révision libre : ' + A.nomTheme(session.theme) :
      session.mode === 'unique' ? 'Question choisie' : session.mode === 'liste' ? 'Sélection de la banque' : 'Session du jour';
    zone.appendChild(A.el('<div class="ligne petit doux" style="margin-bottom:8px"><span>' + o.echapper(titre) + '</span><span class="espace"></span>' +
      '<span class="progression-texte">' + (session.rang + 1) + ' / ' + total + '</span></div>'));
    zone.appendChild(A.el('<div class="barre" style="margin-bottom:14px"><span style="width:' + Math.round(100 * session.rang / total) + '%"></span></div>'));
    const carte = carteQuestion(f, {
      chrono: true,
      onNote: function (n) {
        session.notes.push({ id: f.id, note: n, theme: f.theme });
        if (n === 0 && !session.remis[f.id]) { session.remis[f.id] = true; session.file.push(f.id); }
        session.rang++;
        setTimeout(function () { rendreSession(zone); racine.scrollTo(0, 0); }, 150);
      }
    });
    zone.appendChild(carte);
    controleCourant = carte.controle;
  }

  function rendreBilan(zone) {
    controleCourant = null;
    const n = session.notes.length;
    const bons = session.notes.filter(function (x) { return x.note >= 2; }).length;
    const parTheme = {};
    session.notes.forEach(function (x) {
      const t = parTheme[x.theme] || (parTheme[x.theme] = { n: 0, bons: 0 });
      t.n++; if (x.note >= 2) t.bons++;
    });
    const lignes = Object.keys(parTheme).map(function (t) {
      return '<li>' + o.echapper(A.nomTheme(t)) + ' : ' + parTheme[t].bons + ' / ' + parTheme[t].n + '</li>';
    }).join('');
    const rates = session.notes.filter(function (x) { return x.note === 0; }).map(function (x) { return A.fiche(x.id); }).filter(Boolean);
    zone.appendChild(A.el('<div class="carte"><h2>Session terminée</h2><p class="chiffre">' + bons + ' / ' + n + '</p>' +
      '<p class="legende">réponses notées « bon » ou « facile »</p><ul>' + lignes + '</ul>' +
      (rates.length ? '<p>À retravailler (elles reviendront demain au plus tard) :</p><ul>' + rates.map(function (f) {
        return '<li><a href="#revisions/fiche=' + encodeURIComponent(f.id) + '">' + o.echapper(o.resume(f.question, 120)) + '</a></li>';
      }).join('') + '</ul>' : '') +
      '<div class="ligne"><a class="bouton principal" href="#accueil">Retour à l’accueil</a> <a class="bouton" href="#revisions/onglet=themes">Réviser un thème</a></div></div>'));
  }

  function rendreThemes(zone) {
    const etat = A.etat;
    const toutes = A.fiches();
    const essentiels = toutes.filter(function (f) { return f.essentiel; });
    const me = A.maitriseMoyenne(essentiels);
    const carteEssentiels = essentiels.length ? '<div class="carte" style="border-left:4px solid var(--accent)"><h3 style="margin-top:0">Les essentiels</h3>' +
      '<p class="legende">' + essentiels.length + ' questions qui reviennent le plus souvent · maîtrise ' + Math.round(100 * me) + ' %</p>' +
      '<div class="barre" style="margin:8px 0 12px"><span style="width:' + Math.round(100 * me) + '%"></span></div>' +
      '<div class="ligne"><a class="bouton principal" href="#revisions/onglet=themes/theme=essentiels/mode=libre">Réviser</a>' +
      '<a class="bouton" href="#banque/essentiels=1">Parcourir</a></div></div>' : '';
    const html = carteEssentiels + themesDisponibles().map(function (t) {
      const liste = toutes.filter(function (f) { return f.theme === t; });
      if (!liste.length) return '';
      const vues = liste.filter(function (f) { return etat.cartes[f.id]; }).length;
      const m = liste.reduce(function (s, f) { return s + P.srs.maitrise(etat.cartes[f.id]); }, 0) / liste.length;
      return '<div class="carte"><h3 style="margin-top:0">' + o.echapper(A.nomTheme(t)) + '</h3>' +
        '<p class="legende">' + liste.length + ' questions · ' + vues + ' déjà vues · maîtrise ' + Math.round(100 * m) + ' %</p>' +
        '<div class="barre" style="margin:8px 0 12px"><span style="width:' + Math.round(100 * m) + '%"></span></div>' +
        '<div class="ligne"><a class="bouton principal" href="#revisions/onglet=themes/theme=' + t + '/mode=libre">Réviser</a>' +
        '<a class="bouton" href="#banque/theme=' + t + '">Parcourir</a></div></div>';
    }).join('');
    zone.appendChild(A.el('<div class="grille">' + html + '</div>'));
  }

  A.enregistrerVue({
    id: 'revisions', titre: 'Révisions', icone: '↻', ordre: 3, rendre: rendre,
    pastille: function () { const n = A.dues(); return n ? String(n) : ''; },
    touche: function (e, saisie) {
      if (controleCourant && controleCourant.touche(e, saisie)) e.preventDefault();
    }
  });
  P.composants = P.composants || {};
  P.composants.carteQuestion = carteQuestion;
  P.composants.lienFiche = lienFiche;
  P.composants.variantesDe = variantesDe;
  P.composants.parler = parler;
  P.composants.taire = taire;
  P.composants.voixDisponible = voixDisponible;
  P.composants.etiquettes = etiquettes;
})(this);
