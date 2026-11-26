// Journal : tes vrais entretiens (à venir et passés), les questions qu'on t'a posées, et une liste de préparation.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const TYPES = ['Test en ligne', 'Échange RH', 'Entretien technique', 'Entretien fit / motivation', 'Journée finale (superday)', 'Autre'];
  const SUITES = ['En attente', 'Tour suivant', 'Refus', 'Offre'];

  const PREPARATION = [
    { quand: 'J−7', items: ['Relire l’annonce et noter les trois compétences qu’elle demande vraiment.',
      'Lire ce que fait l’équipe (site, publications, présentations) : deux faits précis pour « Pourquoi nous ? ».',
      'Faire deux entretiens blancs du bon profil, dont un en anglais si l’entretien l’est.',
      'Relancer le projet le plus pertinent, changer un paramètre, relire tes notes de défense.'] },
    { quand: 'J−1', items: ['Relire « Présente-toi », « Pourquoi nous ? » et tes questions à poser ; les dire à voix haute une fois.',
      'Un sprint de calcul mental et cinq questions de probas faciles, pas plus : on ne révise pas la veille, on s’échauffe.',
      'Visio : tester la caméra, le micro, la connexion, un fond neutre ; papier et stylo à portée de main.', 'Dormir.'] },
    { quand: 'Jour J', items: ['Dix minutes d’échauffement : calcul mental et deux problèmes simples.',
      'Pendant l’entretien : reformuler la question, penser tout haut, annoncer la démarche avant de calculer, vérifier un cas limite.',
      'Si tu bloques : dire ce que tu sais, proposer un cas simple, demander si tu peux faire une hypothèse.',
      'Juste après : noter ici toutes les questions posées, tant que tu t’en souviens.'] }
  ];

  function rendre(main, params) {
    if (params.fiche) { rendreFiche(main, params.fiche); return; }
    const etat = A.etat;
    const jour = A.aujourdhui();
    const avenir = etat.journal.filter(function (e) { return e.date >= jour && !e.passe; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    const passes = etat.journal.filter(function (e) { return !(e.date >= jour && !e.passe); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    const prochain = avenir[0];
    let html = '<h1>Journal d’entretiens</h1><p class="doux">Tes entretiens à venir, et les questions posées, qui deviennent des fiches de révision.</p>';
    if (prochain) {
      const n = o.ecartJours(jour, prochain.date);
      const etape = n >= 2 ? 0 : n === 1 ? 1 : 2;
      html += '<div class="carte"><h2 style="margin-top:0">Prochain : ' + o.echapper(prochain.entreprise) + ' · ' + (n === 0 ? 'aujourd’hui' : 'dans ' + n + ' jour' + (n > 1 ? 's' : '')) + '</h2>' +
        '<p class="petit doux">' + o.echapper(prochain.type || '') + (prochain.poste ? ' · ' + o.echapper(prochain.poste) : '') + ' · ' + o.dateLisible(prochain.date) + '</p>' +
        PREPARATION.map(function (p, i) {
          return '<details' + (i === etape ? ' open' : '') + '><summary>' + p.quand + '</summary><ul>' + p.items.map(function (x, k) {
            const cle = p.quand + '-' + k;
            const coche = prochain.prep && prochain.prep[cle];
            return '<li style="list-style:none;margin-left:-1.2em"><label class="case"><input type="checkbox" data-prep="' + o.echapper(cle) + '" data-id="' + prochain.id + '"' + (coche ? ' checked' : '') + '> ' + o.echapper(x) + '</label></li>';
          }).join('') + '</ul></details>';
        }).join('') +
        '<div class="ligne" style="margin-top:10px"><a class="bouton principal" href="#journal/fiche=' + prochain.id + '">Fiche de préparation</a>' +
        '<a class="bouton" href="#entretien">Entretien blanc</a><a class="bouton" href="#histoires">Mes histoires</a></div></div>';
    }
    html += '<div class="carte"><h2 style="margin-top:0" data-titre-form>Ajouter un entretien</h2><form data-form><input type="hidden" data-champ="id">' +
      '<div class="grille" style="margin:0">' +
      '<div><label for="j-entreprise">Entreprise</label><input id="j-entreprise" data-champ="entreprise" required></div>' +
      '<div><label for="j-poste">Poste</label><input id="j-poste" data-champ="poste" placeholder="ex. Quant research intern"></div>' +
      '<div><label for="j-date">Date</label><input id="j-date" type="date" data-champ="date" required value="' + jour + '"></div>' +
      '<div><label for="j-type">Type</label><select id="j-type" data-champ="type">' + TYPES.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div>' +
      '<div><label for="j-profil">Profil de la maison</label><select id="j-profil" data-champ="profil">' + Object.keys(A.banque().profils).map(function (p) {
        return '<option value="' + p + '">' + o.echapper(A.banque().profils[p]) + '</option>';
      }).join('') + '</select></div>' +
      '<div><label for="j-suite">Suite</label><select id="j-suite" data-champ="suite">' + SUITES.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div></div>' +
      '<label for="j-notes">Notes de préparation (pourquoi eux, ce que fait l’équipe, contacts)</label><textarea id="j-notes" data-champ="notes" style="min-height:4em"></textarea>' +
      '<label for="j-questions">Questions posées (une par ligne, à remplir après l’entretien)</label><textarea id="j-questions" data-champ="questions" style="min-height:5em"></textarea>' +
      '<label for="j-ressenti">Ressenti et leçons</label><textarea id="j-ressenti" data-champ="ressenti" style="min-height:3em"></textarea>' +
      '<label class="case"><input type="checkbox" data-champ="passe"> Entretien passé</label>' +
      '<div class="ligne" style="margin-top:10px"><button class="principal" type="submit">Enregistrer</button><button type="button" data-annuler hidden>Annuler</button></div></form></div>';
    const tableau = function (titre, liste) {
      if (!liste.length) return '';
      return '<div class="carte"><h2 style="margin-top:0">' + titre + '</h2><ul class="liste-fiches">' + liste.map(function (e) {
        const qs = (e.questions || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
        return '<li><div class="ligne"><b>' + o.echapper(e.entreprise) + '</b><span class="petit doux">' + o.dateLisible(e.date) + ' · ' + o.echapper(e.type || '') +
          (e.poste ? ' · ' + o.echapper(e.poste) : '') + '</span><span class="etiquette ' + (e.suite === 'Offre' ? 'succes' : e.suite === 'Refus' ? 'erreur' : e.suite === 'Tour suivant' ? 'accent' : '') + '">' +
          o.echapper(e.suite || 'En attente') + '</span><span class="espace"></span><a class="bouton discret" href="#journal/fiche=' + e.id + '">Fiche</a><button class="discret" data-modifier="' + e.id + '">Modifier</button>' +
          (qs.length ? '<button class="discret" data-reviser="' + e.id + '">Questions → révisions</button>' : '') +
          '<button class="discret" data-supprimer="' + e.id + '">Supprimer</button></div>' +
          (qs.length ? '<details class="petit"><summary>' + qs.length + ' question' + (qs.length > 1 ? 's' : '') + ' posée' + (qs.length > 1 ? 's' : '') + '</summary><ul>' +
            qs.map(function (q) { return '<li>' + o.echapper(q) + '</li>'; }).join('') + '</ul></details>' : '') +
          (e.ressenti ? '<p class="petit doux">' + o.echapper(e.ressenti) + '</p>' : '') + '</li>';
      }).join('') + '</ul></div>';
    };
    html += tableau('À venir', avenir) + tableau('Passés', passes) + rendreMesQuestions();
    main.innerHTML = html;
    brancher(main, params);
  }

  function rendreMesQuestions() {
    const perso = A.etat.perso;
    if (!perso.length) return '';
    return '<div class="carte"><h2 style="margin-top:0">Mes questions (' + perso.length + ')</h2><p class="petit doux">Les questions qu’on t’a posées en vrai. ' +
      'Écris ta meilleure réponse : elle s’affichera comme solution dans les révisions.</p><ul class="liste-fiches">' + perso.map(function (f) {
        return '<li><details><summary>' + o.echapper(f.question) + (f.solution.indexOf('À compléter') === 0 ? ' <span class="etiquette alerte">réponse à écrire</span>' : '') + '</summary>' +
          '<textarea data-perso="' + f.id + '" style="min-height:5em">' + o.echapper(f.solution.indexOf('À compléter') === 0 ? '' : f.solution) + '</textarea>' +
          '<div class="ligne"><span class="petit doux">' + o.echapper(f.source || '') + '</span><span class="espace"></span><button class="discret" data-perso-suppr="' + f.id + '">Retirer</button></div></details></li>';
      }).join('') + '</ul></div>';
  }

  function brancher(main) {
    const etat = A.etat;
    const form = main.querySelector('[data-form]');
    const champs = form.querySelectorAll('[data-champ]');
    function remplir(e) {
      champs.forEach(function (c) {
        const k = c.getAttribute('data-champ');
        if (c.type === 'checkbox') c.checked = !!e[k];
        else c.value = e[k] == null ? '' : e[k];
      });
      main.querySelector('[data-titre-form]').textContent = e.id ? 'Modifier : ' + e.entreprise : 'Ajouter un entretien';
      main.querySelector('[data-annuler]').hidden = !e.id;
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const e = {};
      champs.forEach(function (c) {
        const k = c.getAttribute('data-champ');
        e[k] = c.type === 'checkbox' ? c.checked : c.value.trim();
      });
      if (e.id) {
        const i = etat.journal.findIndex(function (x) { return x.id === e.id; });
        if (i >= 0) etat.journal[i] = Object.assign(etat.journal[i], e);
      } else {
        e.id = 'e' + Date.now().toString(36);
        e.prep = {};
        etat.journal.push(e);
      }
      A.sauver();
      A.toast('Entretien enregistré.');
      A.afficher();
    });
    main.querySelector('[data-annuler]').addEventListener('click', function () { remplir({ date: A.aujourdhui() }); });
    main.addEventListener('click', function (ev) {
      const b = ev.target.closest('button');
      if (!b) return;
      const trouver = function (attr) { const id = b.getAttribute(attr); return etat.journal.filter(function (x) { return x.id === id; })[0]; };
      if (b.hasAttribute('data-modifier')) {
        remplir(trouver('data-modifier'));
        form.scrollIntoView({ behavior: 'smooth' });
      } else if (b.hasAttribute('data-supprimer')) {
        const e = trouver('data-supprimer');
        if (e) A.confirmer('Supprimer l’entretien ' + e.entreprise + ' ?', 'Supprimer', function () {
          etat.journal = etat.journal.filter(function (x) { return x !== e; });
          A.sauver();
          A.afficher();
        });
      } else if (b.hasAttribute('data-reviser')) {
        const e = trouver('data-reviser');
        const n = ajouterQuestions(e);
        A.toast(n ? n + ' question(s) ajoutée(s) à « Mes questions ».' : 'Ces questions sont déjà dans tes révisions.');
        A.afficher();
      } else if (b.hasAttribute('data-perso-suppr')) {
        const id = b.getAttribute('data-perso-suppr');
        etat.perso = etat.perso.filter(function (f) { return f.id !== id; });
        delete etat.cartes[id];
        A.sauver();
        A.afficher();
      }
    });
    main.addEventListener('change', function (ev) {
      const c = ev.target;
      if (c.hasAttribute && c.hasAttribute('data-prep')) {
        const e = etat.journal.filter(function (x) { return x.id === c.getAttribute('data-id'); })[0];
        if (!e) return;
        e.prep = e.prep || {};
        e.prep[c.getAttribute('data-prep')] = c.checked;
        A.sauver();
      }
    });
    main.addEventListener('input', function (ev) {
      const t = ev.target;
      if (t.hasAttribute && t.hasAttribute('data-perso')) {
        const f = etat.perso.filter(function (x) { return x.id === t.getAttribute('data-perso'); })[0];
        if (f) { f.solution = t.value.trim() || 'À compléter : écris ta réponse dans Journal → Mes questions.'; A.sauver(); }
      }
    });
  }

  function ajouterQuestions(e) {
    const etat = A.etat;
    const existantes = {};
    etat.perso.forEach(function (f) { existantes[f.question.trim().toLowerCase()] = true; });
    let n = 0;
    (e.questions || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (q, k) {
      if (existantes[q.toLowerCase()]) return;
      existantes[q.toLowerCase()] = true;
      etat.perso.push({ id: 'perso-' + Date.now().toString(36) + '-' + k, theme: 'perso', niveau: 2, profils: [e.profil || 'hf'], type: 'ouverte',
        question: q, solution: 'À compléter : écris ta réponse dans Journal → Mes questions.', source: e.entreprise + ' · ' + o.dateLisible(e.date) });
      n++;
    });
    A.sauver();
    return n;
  }

  // Fiche de préparation imprimable : tout ce qu'il faut relire la veille, sur une ou deux pages.
  function rendreFiche(main, id) {
    const etat = A.etat;
    const e = etat.journal.filter(function (x) { return x.id === id; })[0];
    if (!e) { main.innerHTML = '<h1>Fiche introuvable</h1><p><a href="#journal">Retour au journal</a></p>'; return; }
    const histoire = function (cle) { return (etat.histoires[cle] || '').trim(); };
    const bloc = function (titre, texte, vide) {
      return '<h2>' + titre + '</h2>' + (texte ? '<div class="texte-fiche">' + o.echapper(texte).replace(/\n/g, '<br>') + '</div>' :
        '<p class="doux petit">' + vide + '</p>');
    };
    const profil = e.profil || 'hf';
    // questions techniques les plus fragiles du profil : d'abord les essentielles, puis les moins maîtrisées
    // score : essentielle, thème prioritaire pour ce type de maison, peu maîtrisée ; au plus 4 questions par thème
    const poids = (P.entretien && P.entretien.PROFILS[profil] ? P.entretien.PROFILS[profil].poids : {});
    const candidates = A.fiches().filter(function (f) { return f.theme !== 'fit' && (f.profils.indexOf(profil) >= 0 || f.theme === 'projets'); })
      .map(function (f) {
        const m = P.srs.maitrise(etat.cartes[f.id]);
        return { f: f, m: m, score: (f.essentiel ? 1.5 : 0) + (poids[f.theme] || (f.theme === 'projets' ? 2 : 0)) / 2 - 1.5 * m };
      })
      .sort(function (a, b) { return b.score - a.score; });
    const parTheme = {};
    const fragiles = [];
    candidates.forEach(function (x) {
      if (fragiles.length >= 15 || (parTheme[x.f.theme] || 0) >= 4) return;
      parTheme[x.f.theme] = (parTheme[x.f.theme] || 0) + 1;
      fragiles.push(x);
    });
    const banque = A.banque();
    main.innerHTML = '<p class="sans-impression"><a href="#journal">\u2190 Journal</a> · ' + (A.restreint ? '<span class="petit doux">Pour l\u2019imprimer, ouvre l\u2019application sur ton ordinateur.</span>' : '<button data-imprimer>Imprimer ou enregistrer en PDF</button>') + '</p>' +
      '<article class="carte fiche-prep"><h1>' + o.echapper(e.entreprise) + '</h1>' +
      '<p class="doux">' + [e.poste, e.type, e.date ? o.dateLisible(e.date) : '', banque.profils[profil]].filter(Boolean).map(o.echapper).join(' · ') + '</p>' +
      bloc('Ce que je sais d\u2019eux', e.notes, 'Rien noté : complète « Notes de préparation » dans le journal (ce que fait l\u2019équipe, deux faits précis).') +
      bloc('Présente-toi', histoire('pitch'), 'À écrire dans Mes histoires.') +
      (histoire('pitch:en') ? bloc('Tell me about yourself', histoire('pitch:en'), '') : '') +
      bloc('Pourquoi nous ?', histoire('pourquoi-maison'), 'À écrire dans Mes histoires, adapté à cette entreprise.') +
      bloc('Pourquoi la finance quantitative ?', histoire('pourquoi-quant'), 'À écrire dans Mes histoires.') +
      bloc('Mes questions à poser', histoire('questions'), 'À écrire dans Mes histoires.') +
      '<h2>Questions techniques à revoir · ' + o.echapper(banque.profils[profil] || profil) + '</h2>' +
      '<p class="petit doux">Les essentielles d\u2019abord, puis celles que tu maîtrises le moins. Réponds-y de tête, à voix haute.</p><ol class="petit">' +
      fragiles.map(function (x) {
        return '<li>' + o.echapper(o.resume(x.f.question, 160)) + ' <span class="doux">(' + o.echapper(A.nomTheme(x.f.theme)) + ', maîtrise ' + Math.round(100 * x.m) + ' %)</span></li>';
      }).join('') + '</ol>' +
      '<h2>Pendant l\u2019entretien</h2><ol class="petit"><li>Reformuler, clarifier les hypothèses.</li><li>Annoncer la démarche avant de calculer.</li>' +
      '<li>Commencer par un cas simple ; penser tout haut.</li><li>Vérifier : ordre de grandeur, cas limite, symétrie.</li>' +
      '<li>Bloqué : dire ce que je sais, proposer une simplification, accepter l\u2019indice.</li><li>Projets : honnête sur les données synthétiques et l\u2019IA, précis sur ce que j\u2019ai compris.</li></ol>' +
      '<h2>Jour J</h2><ul class="petit">' + PREPARATION[2].items.map(function (x) { return '<li>' + o.echapper(x) + '</li>'; }).join('') + '</ul></article>';
    const imprimer = main.querySelector('[data-imprimer]');
    if (imprimer) imprimer.addEventListener('click', function () { racine.print(); });
  }

  A.enregistrerVue({ id: 'journal', titre: 'Journal d’entretiens', court: 'Journal', icone: '☷', ordre: 8, rendre: rendre });
  P.journal = { PREPARATION: PREPARATION, ajouterQuestions: ajouterQuestions };
})(this);
