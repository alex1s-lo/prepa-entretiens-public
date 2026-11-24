// Cours : chapitres avec formules, définitions, théorèmes, preuves, exemples, exercices vérifiables, widgets interactifs
// et liens vers les fiches de révision.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const OPTIONS = { maths: true, prose: true };
  const LIBELLES = {
    definition: 'Définition', theoreme: 'Théorème', propriete: 'Propriété', preuve: 'Démonstration', exemple: 'Exemple',
    methode: 'Méthode', intuition: 'Intuition', attention: 'Attention', entretien: 'En entretien', exercice: 'Exercice'
  };

  function donnees() { return racine.PREPA_COURS || { parties: [], chapitres: [] }; }
  function chapitre(id) { return donnees().chapitres.filter(function (c) { return c.id === id; })[0] || null; }

  function etatCours() {
    const e = A.etat;
    if (!e.cours || typeof e.cours !== 'object') e.cours = {};
    if (!e.cours.exercices) e.cours.exercices = {};
    if (!e.cours.lus) e.cours.lus = {};
    if (!e.cours.demos) e.cours.demos = {};
    return e.cours;
  }

  // Chapitres qui citent une fiche (en-tête « fiches: » ou lien [[fiche:…]] dans le texte).
  let index = null;
  function chapitresDeLaFiche(idFiche) {
    if (!index) {
      index = {};
      donnees().chapitres.forEach(function (c) {
        const ids = c.fiches.slice();
        (c.texte.match(/\[\[fiche:([a-z0-9-]+)\]\]/g) || []).forEach(function (m) { ids.push(m.slice(8, -2)); });
        ids.forEach(function (f) { (index[f] = index[f] || []).indexOf(c) < 0 && index[f].push(c); });
      });
    }
    return index[idFiche] || [];
  }

  // --- Découpage du texte en segments : Markdown ordinaire et blocs « ::: » ----------------------------------------
  function decouper(texte) {
    const lignes = texte.split('\n');
    const segments = [];
    let tampon = [];
    let bloc = null;
    let dansCode = false;
    const vider = function () { if (tampon.length) { segments.push({ type: 'md', texte: tampon.join('\n') }); tampon = []; } };
    lignes.forEach(function (l) {
      if (/^```/.test(l)) dansCode = !dansCode;
      if (!dansCode && /^:::/.test(l)) {
        const reste = l.slice(3).trim();
        if (!reste && bloc) { segments.push(bloc); bloc = null; return; }
        if (reste && !bloc) {
          vider();
          const genre = reste.split(' ')[0];
          bloc = { type: 'bloc', genre: genre, titre: reste.slice(genre.length).trim(), lignes: [] };
          return;
        }
      }
      if (bloc) bloc.lignes.push(l); else tampon.push(l);
    });
    vider();
    if (bloc) segments.push(bloc);
    return segments;
  }

  // Liens [[fiche:id]] : remplacés par un jeton qui survit à l'échappement, puis par un lien.
  function avecLiens(html) {
    return html.replace(/\u0002([a-z0-9-]+)\u0002/g, function (_, id) {
      const f = A.fiche(id);
      if (!f) return '';
      return '<a class="lien-fiche" href="#revisions/fiche=' + encodeURIComponent(id) + '" title="S’entraîner sur cette fiche">' +
        '<span aria-hidden="true">↻</span> ' + o.echapper(o.resume(f.question, 70)) + '</a>';
    });
  }
  // Renvois [[n:id]] vers un autre chapitre : le numéro (calculé, donc toujours à jour) devient un lien.
  function jetonsChapitres(texte) { return texte.replace(/\[\[n:([a-z0-9-]+)\]\]/g, '\u0005$1\u0005'); }
  function avecChapitres(html) {
    return html.replace(/\u0005([a-z0-9-]+)\u0005/g, function (_, id) {
      const c = chapitre(id);
      return c ? '<a class="lien-chapitre" href="#cours/c=' + c.id + '" title="' + o.echapper(c.titre) + '">' + c.numero + '</a>' : '?';
    });
  }
  function md(texte) {
    return avecChapitres(avecLiens(o.markdown(jetonsChapitres(texte.replace(/\[\[fiche:([a-z0-9-]+)\]\]/g, '\u0002$1\u0002')), OPTIONS)));
  }
  function ligne(texte) { return avecChapitres(o.enLigne(jetonsChapitres(texte), OPTIONS)); }

  // Titre d'un encadré : libellé (« Théorème »), texte avec formules, puis les fiches citées sous forme de pastilles.
  function titreBloc(libelle, titre) {
    const ids = [];
    const noter = function (bloc) { bloc.replace(/\[\[fiche:([a-z0-9-]+)\]\]/g, function (_, id) { ids.push(id); return ''; }); return ''; };
    let t = String(titre || '').replace(/\s*\(((?:\s*\[\[fiche:[a-z0-9-]+\]\]\s*,?)+)\)/g, function (_, g) { return noter(g); });
    t = t.replace(/\[\[fiche:[a-z0-9-]+\]\]/g, noter).trim();
    const pastilles = ids.map(function (id) {
      const f = A.fiche(id);
      if (!f) return '';
      return '<a class="lien-fiche lien-fiche-court" href="#revisions/fiche=' + encodeURIComponent(id) + '" title="' +
        o.echapper('S’entraîner : ' + o.resume(f.question, 90)) + '"><span aria-hidden="true">↻</span> fiche</a>';
    }).join('');
    return '<span class="libelle-bloc">' + o.echapper(libelle) + '</span>' +
      (t ? '<span class="titre-bloc">' + ligne(t) + '</span>' : '') + pastilles;
  }

  function rendreBloc(b, chap) {
    const corps = b.lignes.join('\n');
    if (b.genre === 'widget') {
      return '<div class="widget" data-widget="' + o.echapper(b.titre) + '" data-parametres="' + o.echapper(corps.trim()) + '"></div>';
    }
    if (b.genre === 'exercice') {
      const id = b.titre;
      const meta = (chap.exercices || []).filter(function (x) { return x.id === id; })[0] || {};
      const lignes = b.lignes.slice();
      while (lignes.length && /^(reponse|tolerance):/.test(lignes[0])) lignes.shift();
      const k = lignes.indexOf('---');
      const enonce = lignes.slice(0, k).join('\n');
      const solution = lignes.slice(k + 1).join('\n');
      const fait = normaliser(etatCours().exercices[id]);
      const du = fait && fait.echeance <= A.aujourdhui();
      return '<div class="bloc bloc-exercice" data-exercice="' + o.echapper(id) + '" id="ex-' + o.echapper(id) + '">' +
        '<div class="bloc-titre-cours"><span class="libelle-bloc">Exercice</span>' +
        (fait ? '<span class="etiquette ' + (du || fait.juste === false ? 'alerte' : 'succes') + '" data-statut-ex>' + (du ? 'à refaire' : fait.juste === false ? 'à revoir' : 'fait') + '</span>' :
          '<span class="etiquette" data-statut-ex>à faire</span>') + '</div>' +
        md(enonce) +
        (meta.reponse ? '<form class="ligne" data-form-ex autocomplete="off"><input aria-label="Ta réponse" placeholder="Ta réponse (fraction, décimal…)" style="flex:1;min-width:10ch">' +
          '<button class="principal" type="submit">Vérifier</button></form><div data-verdict-ex></div>' : '') +
        '<details class="solution-ex"><summary>Voir la solution détaillée</summary>' + md(solution) + '</details>' +
        (meta.reponse ? '' : '<div class="ligne" style="margin-top:8px"><button class="discret" data-ex-fait>J’ai fait cet exercice</button></div>') +
        '</div>';
    }
    const titre = titreBloc(LIBELLES[b.genre] || b.genre, b.titre);
    if (b.genre === 'preuve') {
      return '<details class="bloc bloc-preuve" open><summary class="bloc-titre-cours">' + titre + '</summary>' + md(corps) +
        '<p class="fin-preuve" aria-hidden="true">∎</p></details>';
    }
    return '<div class="bloc bloc-' + b.genre + '"><div class="bloc-titre-cours">' + titre + '</div>' + md(corps) + '</div>';
  }

  // Sections du chapitre (titres « ## ») : une ancre chacune pour la table des matières.
  function rendreChapitreHtml(chap) {
    const segments = decouper(chap.texte);
    let html = '';
    let n = 0;
    segments.forEach(function (s) {
      if (s.type === 'bloc') { html += rendreBloc(s, chap); return; }
      // découpe le Markdown sur les titres de section pour poser les ancres
      const morceaux = s.texte.split(/\n(?=## )/);
      morceaux.forEach(function (m) {
        const t = /^## (.*)\n?/.exec(m);
        if (t) {
          n++;
          html += '<h2 class="section-cours" id="s-' + n + '">' + ligne(t[1]) + '</h2>' + md(m.slice(t[0].length));
        } else html += md(m);
      });
    });
    return html;
  }

  // --- Vues ---------------------------------------------------------------------------------------------------------
  function progression(chap) {
    const ex = etatCours().exercices;
    const n = (chap.exercicesTous || compterExercices(chap));
    const faits = n.filter(function (id) { return ex[id]; }).length;
    return { faits: faits, total: n.length, lu: !!etatCours().lus[chap.id] };
  }
  function compterExercices(chap) {
    chap.exercicesTous = (chap.texte.match(/^:::exercice\s+([a-z0-9-]+)/gm) || []).map(function (m) { return m.replace(/^:::exercice\s+/, ''); });
    return chap.exercicesTous;
  }

  // Les démonstrations qui reviennent dans presque tous les entretiens : à savoir refaire sans notes, au tableau.
  const INCONTOURNABLES = [
    ['var-somme', 'Variance d’une somme et d’un portefeuille (bilinéarité de la covariance)', 'esperance-variance-covariance', 6],
    ['bayes', 'Formule de Bayes (test médical, pièce truquée)', 'conditionnement-markov-martingales', 1],
    ['premier-pas', 'Méthode du premier pas (temps d’attente d’un motif)', 'conditionnement-markov-martingales', 3],
    ['ruine', 'Ruine du joueur, équitable et biaisée', 'conditionnement-markov-martingales', 5],
    ['laplace', 'Transformée de Laplace gaussienne et moments de la log-normale', 'lois-gaussiennes', 2],
    ['wdw', '$\\int_0^T W\\,dW = \\frac12(W_T^2 - T)$ par les sommes de Riemann', 'integrale-et-lemme-ito', 3],
    ['ito-log', 'Itô sur $\\ln S$ : résoudre le brownien géométrique', 'equations-differentielles-stochastiques', 2],
    ['ou', 'Ornstein-Uhlenbeck : solution, variance stationnaire, demi-vie', 'equations-differentielles-stochastiques', 3],
    ['parite', 'Prix forward et parité call-put par arbitrage', 'arbitrage-et-risque-neutre', 2],
    ['arbre', 'Arbre à une période : réplication, delta, probabilité risque-neutre', 'arbitrage-et-risque-neutre', 3],
    ['bs', 'Black-Scholes : l’EDP par couverture en delta, puis le prix par l’espérance', 'black-scholes', 2],
    ['gamma-theta', 'PnL d’une option couverte : gamma contre theta', 'grecques-et-couverture', 4],
    ['mco', 'Moindres carrés : estimateur, biais, variance $\\sigma^2(X^\\top X)^{-1}$', 'statistiques-et-regression', 6],
    ['var', 'VaR et ES gaussiennes ; la VaR n’est pas sous-additive', 'risque-et-portefeuille', 4],
    ['kelly', 'Critère de Kelly, pour un pari et en temps continu', 'risque-et-portefeuille', 7]
  ];
  // --- Répétition espacée du cours : exercices et démonstrations reviennent à intervalles croissants ------------------
  // Réussi : retour dans 3, 7, 21 puis 60 jours ; raté : retour le lendemain.
  const PALIERS = [3, 7, 21, 60];
  function planifier(ancien, juste, jour) {
    const n = juste ? Math.min(((ancien && ancien.n) || 0) + 1, PALIERS.length) : 0;
    return { juste: juste, jour: jour, n: n, echeance: o.ajouterJours(jour, juste ? PALIERS[n - 1] : 1) };
  }
  // Les enregistrements anciens (avant la répétition espacée) n'avaient pas d'échéance : on la déduit.
  function normaliser(rec) {
    if (!rec) return null;
    if (typeof rec === 'string') return { juste: true, jour: rec, n: 1, echeance: o.ajouterJours(rec, PALIERS[0]) };
    if (!rec.echeance) return Object.assign({ n: rec.juste === false ? 0 : 1 }, rec, { echeance: o.ajouterJours(rec.jour || A.aujourdhui(), rec.juste === false ? 1 : PALIERS[0]) });
    return rec;
  }
  function estDu(rec, jour) { rec = normaliser(rec); return !!rec && rec.echeance <= jour; }
  function idsExercices(chap) { return chap.exercicesTous || compterExercices(chap); }
  // Ce qui est à refaire aujourd'hui (utilisé par le sommaire et par l'accueil).
  function aRefaire(jour) {
    const ec = etatCours();
    jour = jour || A.aujourdhui();
    const exercices = [];
    donnees().chapitres.forEach(function (c) {
      idsExercices(c).forEach(function (id, k) { if (estDu(ec.exercices[id], jour)) exercices.push({ chap: c, id: id, rang: k + 1 }); });
    });
    const demos = INCONTOURNABLES.filter(function (x) { return estDu(ec.demos[x[0]], jour); });
    return { exercices: exercices, demos: demos };
  }
  function dateCourte(jour) { const p = jour.split('-'); return p[2] + '/' + p[1]; }

  function rendreARefaire() {
    const r = aRefaire();
    if (!r.exercices.length && !r.demos.length) return '';
    const items = r.exercices.map(function (x) {
      const rec = normaliser(etatCours().exercices[x.id]);
      return '<li><a href="#cours/c=' + x.chap.id + '/ex=' + encodeURIComponent(x.id) + '">Chapitre ' + x.chap.numero + ', exercice ' + x.rang + '</a> <span class="petit doux">' +
        o.echapper(x.chap.titre) + (rec.juste === false ? ' · raté la dernière fois' : '') + '</span></li>';
    }).concat(r.demos.map(function (x) {
      const chap = chapitre(x[2]);
      return '<li><a href="#cours/c=' + x[2] + '/s=' + x[3] + '">Démonstration : ' + ligne(x[1]) + '</a> <span class="petit doux">chapitre ' + (chap ? chap.numero : '') + '</span></li>';
    }));
    return '<div class="carte" data-a-refaire style="border-left:3px solid var(--alerte)"><h2>À refaire aujourd’hui</h2>' +
      '<p class="petit doux">Répétition espacée : un exercice raté revient le lendemain, un exercice réussi après 3, 7, 21 puis 60 jours. Refais-le sans regarder la solution, puis valide ta réponse.</p>' +
      '<ul class="liste-demos">' + items.join('') + '</ul></div>';
  }

  function rendreIncontournables() {
    const faits = etatCours().demos || {};
    const jour = A.aujourdhui();
    const n = INCONTOURNABLES.filter(function (x) { return faits[x[0]]; }).length;
    return '<div class="carte" data-incontournables><div class="entete-carte"><h2>Les 15 démonstrations à savoir refaire sans notes</h2>' +
      '<span class="legende" data-compte-demos>' + n + ' / ' + INCONTOURNABLES.length + ' maîtrisées</span></div>' +
      '<p class="petit doux">Elles reviennent dans presque tous les entretiens techniques. Coche une ligne quand tu sais la refaire au tableau, en parlant, en moins de cinq minutes. ' +
      'Elle te sera reproposée après 3 jours, puis 7, 21 et 60 : si tu y arrives encore, valide ; sinon, décoche et reprends le chapitre.</p>' +
      '<ol class="liste-demos">' +
      INCONTOURNABLES.map(function (x) {
        const chap = chapitre(x[2]);
        if (!chap) return '';
        const rec = normaliser(faits[x[0]]);
        const etat = !rec ? '' : rec.echeance <= jour ?
          ' <span class="etiquette alerte">à refaire</span> <button class="discret petit" data-demo-refaite="' + x[0] + '">Refaite sans notes ✓</button>' :
          ' <span class="petit doux">prochaine vérification le ' + dateCourte(rec.echeance) + '</span>';
        return '<li><label><input type="checkbox" data-demo="' + x[0] + '"' + (rec ? ' checked' : '') + '> ' + ligne(x[1]) + '</label> ' +
          '<a class="petit" href="#cours/c=' + chap.id + '/s=' + x[3] + '">chapitre ' + chap.numero + ' →</a>' + etat + '</li>';
      }).join('') + '</ol></div>';
  }

  function rendreSommaire(main) {
    const d = donnees();
    const parParties = {};
    d.chapitres.forEach(function (c) { (parParties[c.partie] = parParties[c.partie] || []).push(c); });
    const tous = d.chapitres.length;
    const lus = d.chapitres.filter(function (c) { return etatCours().lus[c.id]; }).length;
    let html = '<h1>Cours</h1><p class="doux">Le cours derrière les fiches : définitions, théorèmes et démonstrations complètes, calculs ' +
      'détaillés ligne à ligne, exercices corrigés et simulations à manipuler. Chaque chapitre se termine par les fiches de révision qui s’y rattachent.</p>' +
      '<div class="progression-cours"><div class="barre"><span style="width:' + Math.round(100 * lus / Math.max(1, tous)) + '%"></span></div>' +
      '<span class="legende">' + lus + ' chapitre' + (lus > 1 ? 's' : '') + ' lu' + (lus > 1 ? 's' : '') + ' sur ' + tous + '</span></div>' +
      rendreARefaire();
    d.parties.forEach(function (p) {
      const liste = parParties[p];
      if (!liste) return;
      html += '<h2 class="partie-cours">' + o.echapper(p) + '</h2><div class="grille-chapitres">' + liste.map(function (c) {
        const pr = progression(c);
        return '<a class="carte chapitre-carte" href="#cours/c=' + c.id + '"><div class="ligne petit doux"><span class="numero-chapitre">' + c.numero + '</span>' +
          (c.duree ? '<span>' + o.echapper(c.duree) + '</span>' : '') + '<span class="espace"></span>' +
          (pr.lu ? '<span class="etiquette succes">lu</span>' : '') + '</div><h3>' + o.echapper(c.titre) + '</h3>' +
          '<p class="petit doux">' + ligne(c.resume) + '</p>' +
          '<div class="ligne petit doux">' + (pr.total ? '<span>' + pr.faits + '/' + pr.total + ' exercices</span>' : '') +
          (c.fiches.length ? '<span>' + c.fiches.length + ' fiches liées</span>' : '') + '</div></a>';
      }).join('') + '</div>';
    });
    html += '<h2 class="partie-cours">À savoir refaire</h2>' + rendreIncontournables();
    main.innerHTML = html;
    main.querySelectorAll('[data-demo]').forEach(function (c) {
      c.addEventListener('change', function () {
        const ec = etatCours();
        if (!ec.demos) ec.demos = {};
        if (c.checked) { ec.demos[c.getAttribute('data-demo')] = planifier(null, true, A.aujourdhui()); A.noterActivite('cours'); } else delete ec.demos[c.getAttribute('data-demo')];
        A.sauver();
        const n = INCONTOURNABLES.filter(function (x) { return ec.demos[x[0]]; }).length;
        main.querySelector('[data-compte-demos]').textContent = n + ' / ' + INCONTOURNABLES.length + ' maîtrisées';
      });
    });
    main.querySelectorAll('[data-demo-refaite]').forEach(function (b) {
      b.addEventListener('click', function () {
        const ec = etatCours(), id = b.getAttribute('data-demo-refaite');
        ec.demos[id] = planifier(normaliser(ec.demos[id]), true, A.aujourdhui());
        A.noterActivite('cours');
        A.sauver();
        rendreSommaire(main);
      });
    });
  }

  function rendreChapitre(main, chap, params) {
    const d = donnees();
    const i = d.chapitres.indexOf(chap);
    const prec = d.chapitres[i - 1], suiv = d.chapitres[i + 1];
    const pr = progression(chap);
    const toc = chap.sections.map(function (s, k) {
      return '<li><a href="#cours/c=' + chap.id + '/s=' + (k + 1) + '" data-ancre="s-' + (k + 1) + '">' + ligne(s) + '</a></li>';
    }).join('');
    main.innerHTML = '<div class="cours-cadre"><aside class="cours-toc" aria-label="Sommaire du chapitre"><p class="petit"><a href="#cours">← Tous les chapitres</a></p>' +
      '<details class="toc-plan" open><summary class="bloc-titre">Chapitre ' + chap.numero + ' · sommaire</summary><ol>' + toc + '</ol></details>' +
      (chap.fiches.length ? '<p class="petit"><a href="#revisions/chapitre=' + chap.id + '">S’entraîner : ' + chap.fiches.length + ' fiches</a></p>' : '') + '</aside>' +
      '<article class="cours-article"><p class="petit doux">' + o.echapper(chap.partie) + ' · chapitre ' + chap.numero + (chap.duree ? ' · ' + o.echapper(chap.duree) : '') + '</p>' +
      '<h1>' + o.echapper(chap.titre) + '</h1><p class="chapo">' + ligne(chap.resume) + '</p>' +
      rendreChapitreHtml(chap) +
      '<div class="carte fin-chapitre"><h2 style="margin-top:0">Et maintenant ?</h2>' +
      (chap.fiches.length ? '<p>Les ' + chap.fiches.length + ' fiches de ce chapitre, en révision espacée : elles reviendront ensuite au bon moment avec les autres.</p>' +
        '<div class="ligne"><a class="bouton principal" href="#revisions/chapitre=' + chap.id + '">S’entraîner sur ces fiches</a>' : '<div class="ligne">') +
      '<button data-lu>' + (pr.lu ? 'Marqué comme lu ✓' : 'Marquer ce chapitre comme lu') + '</button>' +
      (A.restreint ? '' : '<button data-imprimer-chapitre title="Pour travailler sur papier : solutions dépliées, sans les simulations">Imprimer ou enregistrer en PDF</button>') +
      '</div></div>' +
      '<nav class="ligne nav-chapitres" aria-label="Chapitres voisins">' +
      (prec ? '<a class="bouton" href="#cours/c=' + prec.id + '">← ' + o.echapper(prec.titre) + '</a>' : '') + '<span class="espace"></span>' +
      (suiv ? '<a class="bouton" href="#cours/c=' + suiv.id + '">' + o.echapper(suiv.titre) + ' →</a>' : '') + '</nav></article></div>';
    const plan = main.querySelector('.toc-plan');
    if (plan && racine.matchMedia && racine.matchMedia('(max-width: 1100px)').matches) plan.open = false;
    brancher(main, chap);
    if (params.s) {
      const cible = main.querySelector('#s-' + params.s);
      if (cible) setTimeout(function () { cible.scrollIntoView(); }, 0);
    } else if (params.ex) {
      const cible = main.querySelector('#ex-' + params.ex);
      if (cible) setTimeout(function () { cible.scrollIntoView(); }, 0);
    }
  }

  function brancher(main, chap) {
    const ec = etatCours();
    main.querySelectorAll('[data-exercice]').forEach(function (bloc) {
      const id = bloc.getAttribute('data-exercice');
      const meta = (chap.exercices || []).filter(function (x) { return x.id === id; })[0] || {};
      const statut = function (juste) {
        ec.exercices[id] = planifier(normaliser(ec.exercices[id]), juste, A.aujourdhui());
        A.noterActivite('cours');
        A.sauver();
        const st = bloc.querySelector('[data-statut-ex]');
        st.textContent = juste === false ? 'à revoir' : 'fait';
        st.className = 'etiquette ' + (juste === false ? 'alerte' : 'succes');
      };
      const form = bloc.querySelector('[data-form-ex]');
      if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        const champ = form.querySelector('input');
        const v = o.lireNombre(champ.value);
        const verdict = bloc.querySelector('[data-verdict-ex]');
        if (!isFinite(v)) { verdict.innerHTML = '<p class="petit doux">Je ne lis pas ce nombre (exemples : 1/6 ; 0,1667 ; e^-1 ; sqrt(2)/2).</p>'; return; }
        const juste = o.procheDe(v, meta.valeur, meta.tolerance);
        verdict.innerHTML = juste ? '<div class="encadre succes"><strong>Juste.</strong> Compare quand même ta démarche avec la solution.</div>' :
          '<div class="encadre erreur"><strong>Pas encore.</strong> Tu as trouvé ' + o.formaterNombre(v, 5) + '. Reprends le calcul ou ouvre la solution.</div>';
        statut(juste);
        if (juste) bloc.querySelector('.solution-ex').open = true;
      });
      const fait = bloc.querySelector('[data-ex-fait]');
      if (fait) fait.addEventListener('click', function () { statut(true); fait.disabled = true; });
    });
    // formules plus larges que l'écran (téléphone) : une ombre au bord droit signale qu'elles défilent
    const marquerDefilement = function () {
      main.querySelectorAll('.math-bloc').forEach(function (m) {
        const reste = m.scrollWidth - m.clientWidth - m.scrollLeft;
        m.classList.toggle('defile', reste > 2);
      });
    };
    main.querySelectorAll('.math-bloc').forEach(function (m) { m.addEventListener('scroll', marquerDefilement, { passive: true }); });
    setTimeout(marquerDefilement, 0);
    if (!racine.__coursRedim) {
      racine.__coursRedim = true;
      racine.addEventListener('resize', function () {
        const m = document.querySelector('main');
        if (m) m.querySelectorAll('.math-bloc').forEach(function (b) { b.classList.toggle('defile', b.scrollWidth - b.clientWidth - b.scrollLeft > 2); });
      });
    }
    const imprimer = main.querySelector('[data-imprimer-chapitre]');
    if (imprimer) imprimer.addEventListener('click', function () {
      main.querySelectorAll('details').forEach(function (d) { d.open = true; });
      racine.print();
    });
    const lu = main.querySelector('[data-lu]');
    lu.addEventListener('click', function () {
      ec.lus[chap.id] = !ec.lus[chap.id];
      if (ec.lus[chap.id]) A.noterActivite('cours');
      A.sauver();
      lu.textContent = ec.lus[chap.id] ? 'Marqué comme lu ✓' : 'Marquer ce chapitre comme lu';
    });
    main.querySelectorAll('[data-ancre]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const cible = main.querySelector('#' + a.getAttribute('data-ancre'));
        if (cible) { e.preventDefault(); cible.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
    if (P.widgets) {
      main.querySelectorAll('[data-widget]').forEach(function (w) {
        const f = P.widgets[w.getAttribute('data-widget')];
        if (f) {
          try { f(w, w.getAttribute('data-parametres') || ''); } catch (err) { w.textContent = 'Simulation indisponible.'; }
        }
      });
    }
  }

  function rendre(main, params) {
    const chap = params.c ? chapitre(params.c) : null;
    if (chap) rendreChapitre(main, chap, params);
    else rendreSommaire(main);
  }

  A.enregistrerVue({ id: 'cours', titre: 'Cours', icone: '∑', ordre: 2, rendre: rendre });
  P.cours = { donnees: donnees, chapitre: chapitre, chapitresDeLaFiche: chapitresDeLaFiche, decouper: decouper, aRefaire: aRefaire, planifier: planifier };
})(this);
