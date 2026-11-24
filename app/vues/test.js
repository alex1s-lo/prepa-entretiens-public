// Test en ligne : une série de questions à réponse chiffrée, chronomètre global, sans solution avant la fin.
// Reproduit les tests de présélection (probabilités et calcul rapides) ; les résultats alimentent les révisions.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const FORMATS = {
    rapide: { nom: 'Rapide : 10 questions, 12 minutes', n: 10, duree: 720, niveaux: [1, 2] },
    standard: { nom: 'Standard : 15 questions, 20 minutes', n: 15, duree: 1200, niveaux: [1, 2, 3] },
    difficile: { nom: 'Difficile : 8 questions, 20 minutes', n: 8, duree: 1200, niveaux: [2, 3] }
  };
  const THEMES_PAR_PROFIL = {
    mm: { probas: 4, 'casse-tete': 2, constantes: 1, marches: 1 },
    hf: { probas: 3, stats: 2, 'casse-tete': 1, stoch: 1, ml: 1 },
    banque: { derives: 3, stoch: 2, probas: 2, taux: 1 },
    risque: { taux: 3, stats: 2, derives: 2, probas: 1 },
    data: { stats: 3, probas: 2, ml: 2, algo: 1 }
  };

  // Tire n fiches numériques selon les poids de thèmes du profil, sans doublon.
  function composer(profil, format, alea) {
    const a = alea || Math.random;
    const poids = THEMES_PAR_PROFIL[profil] || THEMES_PAR_PROFIL.mm;
    const candidates = A.banque().fiches.filter(function (f) {
      return f.type === 'numerique' && poids[f.theme] && format.niveaux.indexOf(f.niveau) >= 0;
    });
    const choisies = [];
    const prises = {};
    for (let k = 0; k < format.n; k++) {
      const libres = candidates.filter(function (f) { return !prises[f.id]; });
      if (!libres.length) break;
      const w = libres.map(function (f) { return poids[f.theme] / libres.filter(function (g) { return g.theme === f.theme; }).length; });
      const total = w.reduce(function (s, x) { return s + x; }, 0);
      let r = a() * total;
      let i = 0;
      while (i < libres.length - 1 && (r -= w[i]) > 0) i++;
      prises[libres[i].id] = true;
      choisies.push(libres[i]);
    }
    return choisies;
  }

  let partie = null;
  let minuteur = null;
  function arreter() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }

  function rendre(main) {
    arreter();
    if (partie && !partie.fini) { rendreQuestion(main); return arreter; }
    partie = null;
    main.innerHTML = '<h1>Test en ligne</h1><div class="carte"><p>Beaucoup de processus commencent par un test chronométré : ' +
      'probabilités, espérances, calcul, parfois des suites. Ici : des questions à réponse chiffrée tirées de la banque, un chrono ' +
      'global, <b>pas de solution avant la fin</b>, et tu peux passer une question pour y revenir. Prévois papier et crayon.</p>' +
      '<p class="petit doux">À la fin, chaque question réussie compte comme « bon » et chaque question ratée ou non répondue comme « raté » dans tes révisions.</p></div>' +
      '<form class="carte" data-config><div class="grille" style="margin:0"><div><label for="t-profil">Type de poste</label><select id="t-profil">' +
      Object.keys(THEMES_PAR_PROFIL).map(function (p) {
        return '<option value="' + p + '"' + (p === (A.etat.reglages.profils[0] || 'mm') ? ' selected' : '') + '>' + o.echapper(A.banque().profils[p]) + '</option>';
      }).join('') + '</select></div><div><label for="t-format">Format</label><select id="t-format">' + Object.keys(FORMATS).map(function (k) {
        return '<option value="' + k + '">' + FORMATS[k].nom + '</option>';
      }).join('') + '</select></div></div>' +
      '<label class="case" style="margin-top:10px"><input type="checkbox" id="t-anglais"' + (A.etat.reglages.anglais ? ' checked' : '') + '> En anglais quand c’est possible</label>' +
      '<div class="ligne" style="margin-top:12px"><button class="principal" type="submit">Commencer le test</button></div></form>' + historique();
    main.querySelector('[data-config]').addEventListener('submit', function (e) {
      e.preventDefault();
      const format = FORMATS[main.querySelector('#t-format').value];
      const fiches = composer(main.querySelector('#t-profil').value, format);
      partie = { format: format, fiches: fiches, reponses: fiches.map(function () { return ''; }), rang: 0, debut: Date.now(),
        anglais: main.querySelector('#t-anglais').checked, profil: main.querySelector('#t-profil').value };
      rendreQuestion(main);
    });
    return arreter;
  }

  function historique() {
    const l = (A.etat.tests || []).slice(-8).reverse();
    if (!l.length) return '';
    return '<div class="carte"><h2 style="margin-top:0">Tes derniers tests</h2><div class="tableau"><table><thead><tr><th>Date</th><th>Poste</th><th>Score</th><th>Durée</th></tr></thead><tbody>' +
      l.map(function (t) {
        return '<tr><td>' + o.dateLisible(t.date) + '</td><td>' + o.echapper(t.profil) + '</td><td>' + t.justes + ' / ' + t.n + '</td><td>' + o.duree(t.duree) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function rendreQuestion(main) {
    arreter();
    const p = partie;
    const f = p.fiches[p.rang];
    const repondues = p.reponses.filter(function (r) { return r.trim(); }).length;
    main.innerHTML = '<div class="carte"><div class="ligne"><span class="etiquette accent">Test en ligne</span>' +
      '<span class="petit doux">Question ' + (p.rang + 1) + ' sur ' + p.fiches.length + ' · ' + repondues + ' répondue' + (repondues > 1 ? 's' : '') + '</span>' +
      '<span class="espace"></span><span class="chrono" data-chrono></span></div>' +
      '<div class="ligne petit" style="margin:10px 0 4px">' + p.fiches.map(function (x, i) {
        const fait = p.reponses[i].trim();
        return '<button class="discret' + (i === p.rang ? ' principal' : '') + '" data-aller="' + i + '" aria-label="Question ' + (i + 1) + '" style="min-width:2.2em">' +
          (i + 1) + (fait ? '✓' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="question" style="margin-top:12px">' + o.markdown(p.anglais && f.en ? f.en : f.question) + '</div>' +
      '<form class="ligne" data-form autocomplete="off" style="margin-top:12px"><input data-saisie aria-label="Ta réponse" style="flex:1;min-width:12ch" placeholder="Ta réponse" value="' +
      o.echapper(p.reponses[p.rang]) + '"><button class="principal" type="submit">Valider et suivante</button></form>' +
      '<p class="petit doux" data-lecture></p>' +
      (repondues === p.fiches.length ? '<div class="encadre info petit">Toutes les questions ont une réponse : relis-les ou termine le test.</div>' : '') +
      '<div class="ligne" style="margin-top:8px"><button data-passer>Passer</button><span class="espace"></span><button data-terminer>Terminer le test</button></div></div>';
    const saisie = main.querySelector('[data-saisie]');
    const lecture = main.querySelector('[data-lecture]');
    const majLecture = function () {
      const v = o.lireNombre(saisie.value);
      lecture.textContent = saisie.value.trim() ? (isFinite(v) ? 'Lu : ' + o.formaterNombre(v, 6) : 'Je ne lis pas ce nombre.') : '';
    };
    saisie.addEventListener('input', function () { p.reponses[p.rang] = saisie.value; majLecture(); });
    majLecture();
    setTimeout(function () { saisie.focus(); }, 0);
    const suivante = function () {
      const libres = [];
      for (let k = 1; k <= p.fiches.length; k++) {
        const i = (p.rang + k) % p.fiches.length;
        if (!p.reponses[i].trim()) libres.push(i);
      }
      p.rang = libres.length ? libres[0] : (p.rang + 1) % p.fiches.length;
      rendreQuestion(main);
    };
    main.querySelector('[data-form]').addEventListener('submit', function (e) { e.preventDefault(); suivante(); });
    main.querySelector('[data-passer]').addEventListener('click', function () { p.rang = (p.rang + 1) % p.fiches.length; rendreQuestion(main); });
    main.querySelector('[data-terminer]').addEventListener('click', function () {
      const vides = p.reponses.filter(function (r) { return !r.trim(); }).length;
      if (!vides) terminer(main);
      else A.confirmer(vides + ' question(s) sans réponse. Terminer quand même ?', 'Terminer', function () { terminer(main); });
    });
    main.querySelectorAll('[data-aller]').forEach(function (b) {
      b.addEventListener('click', function () { p.rang = Number(b.getAttribute('data-aller')); rendreQuestion(main); });
    });
    const chrono = main.querySelector('[data-chrono]');
    const tic = function () {
      const reste = p.format.duree - (Date.now() - p.debut) / 1000;
      chrono.textContent = o.duree(reste);
      chrono.classList.toggle('urgent', reste < 60);
      if (reste <= 0) terminer(main);
    };
    tic();
    minuteur = setInterval(tic, 500);
  }

  function terminer(main) {
    const p = partie;
    if (!p || p.fini) return;
    p.fini = true;
    arreter();
    const jour = A.aujourdhui();
    const resultats = p.fiches.map(function (f, i) {
      const v = o.lireNombre(p.reponses[i]);
      const juste = isFinite(v) && o.procheDe(v, f.valeur, f.tolerance);
      return { fiche: f, saisie: p.reponses[i], juste: juste };
    });
    resultats.forEach(function (r) {
      const avant = A.etat.cartes[r.fiche.id];
      A.etat.cartes[r.fiche.id] = P.srs.planifier(avant, r.juste ? 2 : 0, jour);
      A.noterActivite('revues');
      if (r.juste) A.noterActivite('justes');
      if (!avant) A.noterActivite('nouvelles');
    });
    const justes = resultats.filter(function (r) { return r.juste; }).length;
    const duree = Math.min(p.format.duree, Math.round((Date.now() - p.debut) / 1000));
    A.etat.tests = (A.etat.tests || []).concat([{ date: jour, profil: p.profil, n: resultats.length, justes: justes, duree: duree }]).slice(-200);
    A.noterActivite('entretiens');
    A.sauver();
    main.innerHTML = '<div class="carte"><h2 style="margin-top:0">Résultat du test</h2><div class="grille">' +
      '<div><div class="chiffre">' + justes + ' / ' + resultats.length + '</div><div class="legende">bonnes réponses</div></div>' +
      '<div><div class="chiffre">' + o.duree(duree) + '</div><div class="legende">temps utilisé sur ' + o.duree(p.format.duree) + '</div></div></div>' +
      '<p class="petit doux">Les questions ratées reviennent dans tes révisions dès aujourd’hui.</p>' +
      resultats.map(function (r, i) {
        return '<details class="carte" style="margin:10px 0"' + (r.juste ? '' : ' open') + '><summary><span class="etiquette ' + (r.juste ? 'succes' : 'erreur') + '">' +
          (r.juste ? 'juste' : r.saisie.trim() ? 'faux' : 'sans réponse') + '</span> ' + (i + 1) + '. ' + o.echapper(o.resume(r.fiche.question, 110)) + '</summary>' +
          '<p class="petit">Ta réponse : <b>' + o.echapper(r.saisie || '—') + '</b> · attendue : <b>' + o.echapper(r.fiche.reponse) + '</b> ≈ ' + o.formaterNombre(r.fiche.valeur, 5) + '</p>' +
          '<div class="solution" style="margin-top:6px;padding-top:6px">' + o.markdown(r.fiche.solution) + '</div></details>';
      }).join('') +
      '<div class="ligne"><button class="principal" data-nouveau>Nouveau test</button><a class="bouton" href="#revisions">Réviser les ratées</a></div></div>';
    partie = null;
    main.querySelector('[data-nouveau]').addEventListener('click', function () { A.afficher(); });
  }

  A.enregistrerVue({ id: 'test', titre: 'Test en ligne', icone: '⏱', ordre: 4.5, cache: true, rendre: rendre });
  P.testEnLigne = { composer: composer, FORMATS: FORMATS };
})(this);
