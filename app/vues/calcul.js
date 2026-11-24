// Calcul mental : sprints chronométrés façon test numérique, suites logiques, entraînement libre.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;
  const C = P.calcul;

  let partie = null;   // session en cours
  let minuteur = null;

  function arreterMinuteur() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }

  function rendre(main) {
    arreterMinuteur();
    partie = null;
    const etat = A.etat;
    main.appendChild(A.el('<div><h1>Calcul mental</h1><p class="doux">Les teneurs de marché et beaucoup de desks de trading font passer ' +
      'un test de calcul chronométré, souvent dès le début du processus. Le seul moyen de progresser : un peu chaque jour. ' +
      'Tape la réponse puis <kbd>Entrée</kbd> ; une erreur ne bloque pas, la question suivante arrive tout de suite.</p></div>'));
    const formats = C.FORMATS.map(function (f) {
      const sessions = etat.calcul.filter(function (s) { return s.format === f.id; });
      const record = sessions.reduce(function (m, s) { return Math.max(m, s.justes); }, 0);
      return '<div class="carte"><h3 style="margin-top:0">' + o.echapper(f.nom) + '</h3><p class="petit doux">' + o.echapper(f.detail) + '</p>' +
        (sessions.length ? '<p class="petit">Record : <b>' + record + '</b> bonnes réponses · ' + sessions.length + ' session' + (sessions.length > 1 ? 's' : '') + '</p>' : '') +
        '<button class="principal" data-format="' + f.id + '">Commencer</button></div>';
    }).join('');
    const niveau = etat.reglages.niveauCalcul || 2;
    main.appendChild(A.el('<div class="carte"><div class="ligne"><label for="niveau-calcul" style="margin:0">Niveau</label>' +
      '<select id="niveau-calcul">' + [1, 2, 3].map(function (n) {
        return '<option value="' + n + '"' + (n === niveau ? ' selected' : '') + '>' + ['Échauffement', 'Type test', 'Difficile (décimaux, 3 chiffres)'][n - 1] + '</option>';
      }).join('') + '</select><span class="espace"></span><span class="legende">Le niveau s’applique à tous les formats.</span></div>' +
      '<fieldset data-types><legend>Opérations (entraînement libre)</legend>' + Object.keys(C.TYPES).map(function (t) {
        return '<label class="case"><input type="checkbox" value="' + t + '"' + (['suite', 'carre', 'estim', 'pricing', 'proba'].indexOf(t) < 0 ? ' checked' : '') + '> ' + o.echapper(C.TYPES[t]) + '</label>';
      }).join('') + '</fieldset></div>'));
    main.appendChild(A.el('<div class="grille">' + formats + '</div>'));
    main.appendChild(historique());
    main.querySelector('#niveau-calcul').addEventListener('change', function (e) {
      etat.reglages.niveauCalcul = Number(e.target.value);
      A.sauver();
    });
    main.addEventListener('click', function (e) {
      const b = e.target.closest('[data-format]');
      if (!b) return;
      const format = C.FORMATS.filter(function (f) { return f.id === b.getAttribute('data-format'); })[0];
      let types = format.types;
      if (!types) {
        types = Array.prototype.map.call(main.querySelectorAll('[data-types] input:checked'), function (i) { return i.value; });
        if (!types.length) { A.toast('Coche au moins une opération.'); return; }
      }
      lancer(main, format, types, etat.reglages.niveauCalcul || 2);
    });
    return arreterMinuteur;
  }

  function historique() {
    const sessions = A.etat.calcul.filter(function (s) { return s.format === 'test80' || s.format === 'sprint2'; }).slice(-30);
    if (sessions.length < 2) return A.el('<div></div>');
    const par = {};
    sessions.forEach(function (s) { (par[s.format] = par[s.format] || []).push(s); });
    let html = '<div class="carte"><h2 style="margin-top:0">Progression</h2>';
    Object.keys(par).forEach(function (fid) {
      const f = C.FORMATS.filter(function (x) { return x.id === fid; })[0];
      html += '<h3>' + o.echapper(f.nom) + '</h3>' + courbe(par[fid].map(function (s) { return s.justes; }), par[fid].map(function (s) { return s.date.slice(5); }));
    });
    return A.el(html + '<p class="legende">Bonnes réponses par session (30 dernières).</p></div>');
  }

  // Petit graphique en ligne (SVG) : valeurs entières positives.
  function courbe(valeurs, etiquettes) {
    const L = 600, H = 160, m = 28;
    const max = Math.max.apply(null, valeurs.concat([10]));
    const x = function (i) { return m + (valeurs.length === 1 ? 0 : i * (L - 2 * m) / (valeurs.length - 1)); };
    const y = function (v) { return H - m + 6 - v * (H - 2 * m) / max; };
    let svg = '<svg class="courbe" viewBox="0 0 ' + L + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Progression">';
    [0, 0.5, 1].forEach(function (k) {
      const v = Math.round(max * k);
      svg += '<line class="grille-svg" x1="' + m + '" x2="' + (L - m / 2) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="2" y="' + (y(v) + 4) + '">' + v + '</text>';
    });
    svg += '<polyline class="trait" points="' + valeurs.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ') + '"/>';
    valeurs.forEach(function (v, i) { svg += '<circle class="point" cx="' + x(i) + '" cy="' + y(v) + '" r="3"><title>' + o.echapper(etiquettes[i]) + ' : ' + v + '</title></circle>'; });
    return svg + '</svg>';
  }

  function lancer(main, format, types, niveau) {
    arreterMinuteur();
    partie = { format: format, types: types, niveau: niveau, debut: Date.now(), justes: 0, faites: 0, erreurs: [], question: null, debutQuestion: Date.now(), temps: [] };
    main.innerHTML = '<div class="carte" data-zone>' +
      '<div class="ligne"><span class="etiquette accent">' + o.echapper(format.nom) + '</span><span class="espace"></span>' +
      '<span class="progression-texte" data-score></span><span class="chrono" data-chrono></span></div>' +
      '<div class="calcul-question" data-question aria-live="polite"></div>' +
      '<form class="calcul-saisie" data-form autocomplete="off"><button type="button" data-signe aria-label="Changer le signe" title="Changer le signe">\u00b1</button>' +
      '<input data-saisie inputmode="decimal" aria-label="Ta réponse" autocomplete="off">' +
      '<button class="principal" type="submit">OK</button></form>' +
      '<p class="legende" style="text-align:center;margin-top:12px">Virgule ou point acceptés. ' +
      (format.types && format.types.indexOf('frac') >= 0 ? 'Fractions : 3 décimales suffisent. ' : '') +
      '<button class="discret" data-fin>Terminer maintenant</button></p></div>';
    const zone = main.querySelector('[data-zone]');
    const saisie = main.querySelector('[data-saisie]');
    function suivante() {
      partie.question = C.genererMelange(types, niveau);
      partie.debutQuestion = Date.now();
      main.querySelector('[data-question]').textContent = partie.question.texte + (partie.question.type === 'suite' ? '' : (partie.question.type === 'estim' || partie.question.type === 'pricing') ? ' \u2248 ?' : partie.question.type === 'proba' ? ' ?' : ' =');
      saisie.value = '';
      saisie.focus();
      majScore();
    }
    function majScore() {
      main.querySelector('[data-score]').textContent = partie.justes + ' / ' + partie.faites + (format.max ? '  (' + partie.faites + ' sur ' + format.max + ')' : '');
    }
    function tic() {
      const ecoule = (Date.now() - partie.debut) / 1000;
      const c = main.querySelector('[data-chrono]');
      if (!c) { arreterMinuteur(); return; }
      if (format.duree) {
        const reste = format.duree - ecoule;
        c.textContent = o.duree(reste);
        c.classList.toggle('urgent', reste < 30);
        if (reste <= 0) terminer(main);
      } else c.textContent = o.duree(ecoule);
    }
    main.querySelector('[data-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!saisie.value.trim()) return;
      const q = partie.question;
      const ok = C.verifier(q, saisie.value);
      partie.faites++;
      partie.temps.push((Date.now() - partie.debutQuestion) / 1000);
      if (ok) partie.justes++;
      else partie.erreurs.push({ texte: q.texte, reponse: q.reponse, saisie: saisie.value, estim: q.type === 'estim' || q.type === 'pricing' || q.type === 'proba' });
      zone.classList.remove('flash-ok', 'flash-ko');
      void zone.offsetWidth;
      zone.classList.add(ok ? 'flash-ok' : 'flash-ko');
      if (format.max && partie.faites >= format.max) { terminer(main); return; }
      suivante();
    });
    main.querySelector('[data-fin]').addEventListener('click', function () { terminer(main); });
    // les claviers décimaux des téléphones n'ont souvent pas de signe moins
    main.querySelector('[data-signe]').addEventListener('click', function () {
      saisie.value = /^\s*[-\u2212]/.test(saisie.value) ? saisie.value.replace(/^\s*[-\u2212]/, '') : '-' + saisie.value;
      saisie.focus();
    });
    minuteur = setInterval(tic, 250);
    tic();
    suivante();
  }

  function terminer(main) {
    if (!partie || partie.fini) return;
    partie.fini = true;
    arreterMinuteur();
    const duree = (Date.now() - partie.debut) / 1000;
    const p = partie;
    const enregistrement = { date: A.aujourdhui(), format: p.format.id, niveau: p.niveau, types: p.types, justes: p.justes, faites: p.faites, duree: Math.round(duree) };
    if (p.faites > 0) {
      A.etat.calcul.push(enregistrement);
      if (A.etat.calcul.length > 500) A.etat.calcul.splice(0, A.etat.calcul.length - 500);
      A.noterActivite('calcul', p.faites);
      A.sauver();
    }
    const precision = p.faites ? Math.round(100 * p.justes / p.faites) : 0;
    const rythme = p.faites ? (duree / p.faites).toFixed(1).replace('.', ',') : '—';
    const anciens = A.etat.calcul.filter(function (s) { return s.format === p.format.id && s !== enregistrement; });
    const record = anciens.reduce(function (m, s) { return Math.max(m, s.justes); }, 0);
    let conseil = '';
    if (p.faites && precision < 85) conseil = 'Ta précision est sous 85 % : dans un vrai test, les erreurs coûtent souvent des points. Ralentis un peu, la vitesse viendra.';
    else if (p.faites && duree / p.faites > 8) conseil = 'Bonne précision. Pour gagner en vitesse : apprends les tables jusqu’à 20 × 20, les carrés jusqu’à 30 et les fractions usuelles (1/8, 1/7, 1/6…).';
    else if (p.faites) conseil = 'Bon rythme et bonne précision. Passe au niveau supérieur ou au format 80 questions en 8 minutes.';
    main.innerHTML = '<div class="carte"><h2 style="margin-top:0">Résultat</h2><div class="grille">' +
      '<div><div class="chiffre">' + p.justes + '</div><div class="legende">bonnes réponses' + (record && p.justes > record ? ' · nouveau record !' : record ? ' · record ' + record : '') + '</div></div>' +
      '<div><div class="chiffre">' + precision + ' %</div><div class="legende">précision (' + p.faites + ' réponses)</div></div>' +
      '<div><div class="chiffre">' + rythme + ' s</div><div class="legende">par question</div></div></div>' +
      (conseil ? '<div class="encadre info">' + o.echapper(conseil) + '</div>' : '') +
      (p.erreurs.length ? '<h3>Erreurs</h3><ul>' + p.erreurs.slice(0, 30).map(function (e) {
        return '<li>' + o.echapper(e.texte) + ' = <b>' + o.echapper(e.estim ? o.formaterNombre(e.reponse, 4) : C.fr(e.reponse)) + '</b> <span class="doux">(tu as répondu ' + o.echapper(e.saisie) + ')</span></li>';
      }).join('') + '</ul>' : '') +
      '<div class="ligne"><button class="principal" data-rejouer>Recommencer</button><a class="bouton" href="#calcul" data-retour>Changer de format</a></div></div>';
    main.querySelector('[data-rejouer]').addEventListener('click', function () { lancer(main, p.format, p.types, p.niveau); });
    main.querySelector('[data-retour]').addEventListener('click', function (e) { e.preventDefault(); A.afficher(); });
  }

  A.enregistrerVue({ id: 'calcul', titre: 'Calcul mental', court: 'Calcul', icone: '±', ordre: 4, rendre: rendre });
  P.composants = P.composants || {};
  P.composants.courbe = courbe;
})(this);
