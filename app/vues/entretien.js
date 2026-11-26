// Entretien blanc : une suite de questions réaliste pour un type de maison, chronométrée, avec bilan.
// Et un générateur de consignes pour passer un entretien oral avec Claude (mode vocal de l'application).
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  // Poids des thèmes techniques par profil (ce que ces maisons testent le plus souvent).
  const PROFILS = {
    hf: { nom: 'Hedge fund (recherche quant)', poids: { probas: 3, stats: 3, ml: 1.5, algo: 1.5, 'casse-tete': 1, marches: 0.5, stoch: 0.5 },
      attentes: 'Rigueur statistique (biais, sur-apprentissage, tests multiples), probabilités, code propre, curiosité pour la recherche.' },
    mm: { nom: 'Teneur de marché / trading prop', poids: { probas: 4, 'casse-tete': 2, marches: 1.5, constantes: 1, derives: 0.5 },
      attentes: 'Probabilités et espérances rapides, calcul mental, décisions sous incertitude, paris et market making, sang-froid.' },
    banque: { nom: 'Banque : quant pricing / strats', poids: { derives: 4, stoch: 3, probas: 1.5, taux: 1, algo: 1 },
      attentes: 'Black-Scholes et Greeks, calcul d’Itô, pricing par Monte-Carlo ou EDP, rigueur mathématique, code (Python ou C++).' },
    risque: { nom: 'Risque, validation de modèles, XVA', poids: { taux: 3, derives: 3, stats: 1.5, stoch: 1, probas: 1 },
      attentes: 'VaR et ES, sensibilités, CVA et exposition, limites des modèles, esprit critique et rédaction claire.' },
    data: { nom: 'Data science / ML', poids: { ml: 4, stats: 3, algo: 2, probas: 1 },
      attentes: 'Validation croisée, fuite d’information, régularisation, métriques, mise en production, communication des résultats.' }
  };
  const DUREES = { court: { nom: 'Court (~20 min)', technique: 3 }, standard: { nom: 'Standard (~45 min)', technique: 5 }, long: { nom: 'Complet (~60 min)', technique: 8 } };

  // Tirage pondéré sans remise de fiches techniques : privilégie le profil, les questions peu maîtrisées et les niveaux 2-3.
  function composer(profil, duree, avecProjet, alea) {
    const a = alea || Math.random;
    const etat = A.etat;
    const toutes = A.banque().fiches;
    const cfg = PROFILS[profil];
    const choisies = [];
    const prises = {};
    function tirer(candidates, poidsFiche) {
      const libres = candidates.filter(function (f) { return !prises[f.id]; });
      if (!libres.length) return null;
      const w = libres.map(poidsFiche);
      const total = w.reduce(function (s, x) { return s + x; }, 0);
      let r = a() * total;
      for (let i = 0; i < libres.length; i++) { r -= w[i]; if (r <= 0) { prises[libres[i].id] = true; return libres[i]; } }
      prises[libres[libres.length - 1].id] = true;
      return libres[libres.length - 1];
    }
    const poidsFiche = function (f) {
      const m = P.srs.maitrise(etat.cartes[f.id]);
      return (f.profils.indexOf(profil) >= 0 ? 3 : 0.3) * (f.niveau === 1 ? 0.6 : 1) * (1.3 - m);
    };
    const ouverture = toutes.filter(function (f) { return f.theme === 'fit' && /ouverture/.test(f.id); });
    const motivation = toutes.filter(function (f) { return f.theme === 'fit' && !/ouverture|questions-a-poser/.test(f.id); });
    const cloture = toutes.filter(function (f) { return f.id === 'fit-questions-a-poser'; });
    const projets = toutes.filter(function (f) { return f.theme === 'projets'; });
    const debut = tirer(ouverture, function () { return 1; });
    if (debut) choisies.push({ fiche: debut, etape: 'Ouverture' });
    if (avecProjet) {
      const p = tirer(projets, function (f) { return (f.profils.indexOf(profil) >= 0 ? 3 : 1) * (1.3 - P.srs.maitrise(etat.cartes[f.id])); });
      if (p) choisies.push({ fiche: p, etape: 'Ton projet' });
    }
    // répartition des questions techniques selon les poids du profil
    const themes = Object.keys(cfg.poids);
    for (let k = 0; k < DUREES[duree].technique; k++) {
      const totalPoids = themes.reduce(function (s, t) { return s + cfg.poids[t]; }, 0);
      let r = a() * totalPoids, theme = themes[0];
      for (let i = 0; i < themes.length; i++) { r -= cfg.poids[themes[i]]; if (r <= 0) { theme = themes[i]; break; } }
      const f = tirer(toutes.filter(function (x) { return x.theme === theme; }), poidsFiche) ||
        tirer(toutes.filter(function (x) { return cfg.poids[x.theme]; }), poidsFiche);
      if (f) choisies.push({ fiche: f, etape: 'Technique' });
    }
    const m = tirer(motivation, function () { return 1; });
    if (m) choisies.push({ fiche: m, etape: 'Motivation' });
    if (cloture[0]) choisies.push({ fiche: cloture[0], etape: 'Clôture' });
    return choisies;
  }

  let courant = null;   // entretien en cours
  let controle = null;

  function rendre(main, params) {
    controle = null;
    if (params.vue === 'claude') { rendreClaude(main, params); return; }
    if (courant && !courant.fini) { rendreEtape(main); return function () { if (controle && controle.arreter) controle.arreter(); }; }
    const etat = A.etat;
    const profilDefaut = etat.reglages.profils[0] || 'hf';
    main.appendChild(A.el('<div><h1>Entretien blanc</h1><p class="doux">Présentation, projet, questions techniques puis motivation, chronométrés. Réponds à voix haute avant de regarder la solution.</p></div>'));
    const form = A.el('<form class="carte" data-config><h2 style="margin-top:0">Préparer l’entretien</h2>' +
      '<label for="eb-profil">Type de poste</label><select id="eb-profil">' + Object.keys(PROFILS).map(function (p) {
        return '<option value="' + p + '"' + (p === profilDefaut ? ' selected' : '') + '>' + o.echapper(PROFILS[p].nom) + '</option>';
      }).join('') + '</select><p class="petit doux" data-attentes></p>' +
      '<label for="eb-duree">Durée</label><select id="eb-duree">' + Object.keys(DUREES).map(function (d) {
        return '<option value="' + d + '"' + (d === 'standard' ? ' selected' : '') + '>' + DUREES[d].nom + '</option>';
      }).join('') + '</select>' +
      '<div class="options"><label class="case"><input type="checkbox" id="eb-projet" checked> Inclure une question sur un de mes projets</label>' +
      '<label class="case"><input type="checkbox" id="eb-relances" checked> Relances de l\u2019intervieweur après les questions</label>' +
      '<label class="case"><input type="checkbox" id="eb-anglais"' + (etat.reglages.anglais ? ' checked' : '') + '> Questions en anglais quand c’est possible</label>' +
      (P.composants.voixDisponible() ? '<label class="case"><input type="checkbox" id="eb-voix"' + (etat.reglages.lectureAuto ? ' checked' : '') + '> L’intervieweur lit chaque question à voix haute</label>' : '') + '</div>' +
      '<div class="ligne" style="margin-top:20px"><button class="principal" type="submit">Commencer l’entretien</button>' +
      '<a class="bouton" href="#entretien/vue=claude">Entretien oral avec Claude</a></div></form>');
    main.appendChild(A.el('<div class="grille"><a class="carte tuile" href="#test"><span class="tuile-ico">' + A.icone('test') + '</span>' +
      '<span><span class="tuile-titre">Test en ligne chronométré</span><span class="tuile-detail">Questions chiffrées, chrono global, solutions à la fin</span></span></a>' +
      '<a class="carte tuile" href="#entretien/vue=claude"><span class="tuile-ico">' + A.icone('entretien') + '</span>' +
      '<span><span class="tuile-titre">Entretien oral avec Claude</span><span class="tuile-detail">Mode vocal de l\u2019application Claude</span></span></a></div>'));
    main.appendChild(form);
    const attentes = form.querySelector('[data-attentes]');
    const majAttentes = function () { attentes.textContent = 'Ce qu’on attend souvent : ' + PROFILS[form.querySelector('#eb-profil').value].attentes; };
    form.querySelector('#eb-profil').addEventListener('change', majAttentes);
    majAttentes();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const profil = form.querySelector('#eb-profil').value;
      const duree = form.querySelector('#eb-duree').value;
      const anglais = form.querySelector('#eb-anglais').checked;
      const voix = form.querySelector('#eb-voix');
      A.etat.reglages.lectureAuto = !!(voix && voix.checked);
      courant = { profil: profil, duree: duree, anglais: anglais, debut: Date.now(), etapes: composer(profil, duree, form.querySelector('#eb-projet').checked), rang: 0, resultats: [],
        avecRelances: form.querySelector('#eb-relances').checked, relances: [] };
      courant.anglaisAvant = A.etat.reglages.anglais;
      A.etat.reglages.anglais = anglais;
      main.innerHTML = '';
      rendreEtape(main);
    });
    main.appendChild(historique());
    return function () { if (controle && controle.arreter) controle.arreter(); };
  }

  function rendreEtape(main) {
    main.innerHTML = '';
    const c = courant;
    if (c.rang >= c.etapes.length) { terminer(main); return; }
    const etape = c.etapes[c.rang];
    main.appendChild(A.el('<div class="ligne petit doux" style="margin-bottom:8px"><span>Entretien blanc · ' + o.echapper(PROFILS[c.profil].nom) +
      '</span><span class="espace"></span><span>Écoulé : <span data-total>' + o.duree((Date.now() - c.debut) / 1000) + '</span></span>' +
      '<button class="discret" data-abandon>Arrêter</button></div>'));
    main.appendChild(A.el('<div class="barre" style="margin-bottom:14px"><span style="width:' + Math.round(100 * c.rang / c.etapes.length) + '%"></span></div>'));
    const carte = P.composants.carteQuestion(etape.fiche, {
      chrono: true,
      lireAuto: !!A.etat.reglages.lectureAuto,
      titre: etape.etape + ' · question ' + (c.rang + 1) + ' sur ' + c.etapes.length,
      onNote: function (n, infos) {
        c.resultats.push({ id: etape.fiche.id, etape: etape.etape, theme: etape.fiche.theme, note: n, duree: Math.round(infos.duree || 0), indice: infos.indice });
        c.rang++;
        const relance = c.avecRelances && n >= 1 ? choisirRelance(etape.fiche) : null;
        setTimeout(function () {
          if (relance) rendreRelance(main, etape.fiche, relance); else rendreEtape(main);
          racine.scrollTo(0, 0);
        }, 150);
      }
    });
    main.appendChild(carte);
    controle = carte.controle;
    main.querySelector('[data-abandon]').addEventListener('click', function () {
      if (c.resultats.length) terminer(main);
      else { A.etat.reglages.anglais = c.anglaisAvant; A.sauver(); courant = null; A.afficher(); }
    });
    const total = main.querySelector('[data-total]');
    const t = setInterval(function () {
      if (!total.isConnected) { clearInterval(t); return; }
      total.textContent = o.duree((Date.now() - c.debut) / 1000);
    }, 1000);
  }

  // Sépare « question (réponse) » : la réponse attendue est entre parenthèses à la fin de la relance.
  function decouperRelance(texte) {
    const m = /^(.*\S)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*$/.exec(texte);
    return m ? { question: m[1], reponse: m[2] } : { question: texte, reponse: '' };
  }

  // Une relance par question environ une fois sur deux (pas sur les questions de motivation), au hasard.
  function choisirRelance(f) {
    if (!f.relances || !f.relances.length || f.theme === 'fit' || Math.random() < 0.4) return null;
    return decouperRelance(f.relances[Math.floor(Math.random() * f.relances.length)]);
  }

  function rendreRelance(main, f, relance) {
    const c = courant;
    const debut = Date.now();
    main.innerHTML = '<div class="ligne petit doux" style="margin-bottom:8px"><span>Entretien blanc · ' + o.echapper(PROFILS[c.profil].nom) + '</span></div>' +
      '<section class="carte"><div class="bloc-titre">Relance de l\u2019intervieweur</div>' +
      '<p class="petit doux">Sur : ' + o.echapper(o.resume(f.question, 110)) + '</p>' +
      '<div class="question">' + o.markdown(relance.question) + '</div>' +
      '<p class="petit doux">Réponds à voix haute, en une ou deux phrases.</p>' +
      '<div class="ligne" data-actions-relance><button class="principal" data-voir>' + (relance.reponse ? 'Voir la réponse attendue' : 'J\u2019ai répondu') + '</button>' +
      (P.composants.voixDisponible() ? '<button class="discret" data-ecouter aria-label="Écouter la relance"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg></button>' : '') + '</div>' +
      '<div data-reponse hidden></div></section>';
    const lire = function () { P.composants.parler(o.textePrononcable(relance.question, false), false); };
    if (A.etat.reglages.lectureAuto) setTimeout(lire, 300);
    const ecouter = main.querySelector('[data-ecouter]');
    if (ecouter) ecouter.addEventListener('click', lire);
    const suite = function (ok) {
      c.relances.push({ id: f.id, question: relance.question, ok: ok, duree: Math.round((Date.now() - debut) / 1000) });
      P.composants.taire();
      rendreEtape(main);
      racine.scrollTo(0, 0);
    };
    main.querySelector('[data-voir]').addEventListener('click', function () {
      if (!relance.reponse) { suite(null); return; }
      main.querySelector('[data-actions-relance]').hidden = true;
      const zone = main.querySelector('[data-reponse]');
      zone.hidden = false;
      zone.innerHTML = '<div class="encadre info"><div class="bloc-titre">Réponse attendue</div>' + o.markdown(relance.reponse) + '</div>' +
        '<div class="ligne"><button class="note-2" data-ok>Je savais</button><button class="note-0" data-ko>Je ne savais pas</button></div>';
      zone.querySelector('[data-ok]').addEventListener('click', function () { suite(true); });
      zone.querySelector('[data-ko]').addEventListener('click', function () { suite(false); });
    });
  }

  function terminer(main) {
    const c = courant;
    c.fini = true;
    controle = null;
    A.etat.reglages.anglais = c.anglaisAvant;
    const duree = Math.round((Date.now() - c.debut) / 1000);
    const n = c.resultats.length;
    const score = n ? c.resultats.reduce(function (s, r) { return s + r.note; }, 0) / (3 * n) : 0;
    A.etat.entretiens.push({ date: A.aujourdhui(), profil: c.profil, duree: duree, score: Math.round(100 * score), resultats: c.resultats, relances: c.relances });
    A.noterActivite('entretiens');
    A.sauver();
    const faibles = c.resultats.filter(function (r) { return r.note <= 1; });
    const lentes = c.resultats.filter(function (r) { const f = A.fiche(r.id); return f && f.theme !== 'fit' && r.duree > 300; });
    let verdict;
    if (score >= 0.75) verdict = 'Solide. Passe au niveau supérieur : format complet, questions en anglais, ou un autre type de maison.';
    else if (score >= 0.5) verdict = 'Correct, avec des trous. Révise les thèmes ci-dessous puis refais un entretien blanc dans deux ou trois jours.';
    else verdict = 'Difficile, et c’est le but d’un entraînement. Les questions ratées reviennent dans tes révisions dès demain.';
    main.innerHTML = '<div class="carte"><h2 style="margin-top:0">Bilan de l’entretien blanc</h2><div class="grille">' +
      '<div><div class="chiffre">' + Math.round(100 * score) + ' %</div><div class="legende">score (Raté 0 · Difficile 1 · Bon 2 · Facile 3)</div></div>' +
      '<div><div class="chiffre">' + o.duree(duree) + '</div><div class="legende">durée totale</div></div>' +
      '<div><div class="chiffre">' + n + '</div><div class="legende">questions</div></div></div>' +
      '<div class="encadre info">' + o.echapper(verdict) + '</div>' +
      '<div class="tableau"><table><thead><tr><th>Étape</th><th>Question</th><th>Temps</th><th>Note</th></tr></thead><tbody>' +
      c.resultats.map(function (r) {
        const f = A.fiche(r.id);
        return '<tr><td>' + o.echapper(r.etape) + '</td><td><a href="#revisions/fiche=' + encodeURIComponent(r.id) + '">' +
          o.echapper(o.resume(f ? f.question : r.id, 90)) + '</a></td><td>' + o.duree(r.duree) + '</td><td>' +
          '<span class="etiquette ' + ['erreur', 'alerte', 'succes', 'accent'][r.note] + '">' + P.srs.NOTES[r.note] + (r.indice ? ' (indice)' : '') + '</span></td></tr>';
      }).join('') + '</tbody></table></div>' +
      (c.relances.length ? '<h3>Relances</h3><ul class="petit">' + c.relances.map(function (r) {
        return '<li><span class="etiquette ' + (r.ok === true ? 'succes' : r.ok === false ? 'erreur' : '') + '">' +
          (r.ok === true ? 'su' : r.ok === false ? 'pas su' : 'répondu') + '</span> ' + o.echapper(r.question) + '</li>';
      }).join('') + '</ul>' : '') +
      (faibles.length ? '<p>À retravailler en priorité : ' + faibles.map(function (r) { return o.echapper(A.nomTheme(r.theme)); })
        .filter(function (x, i, t) { return t.indexOf(x) === i; }).join(', ') + '.</p>' : '') +
      (lentes.length ? '<p class="petit doux">' + lentes.length + ' question(s) technique(s) t’ont pris plus de 5 minutes : en entretien, annonce ta démarche dès la première minute, même si le calcul n’est pas fini.</p>' : '') +
      '<div class="ligne"><button class="principal" data-nouveau>Nouvel entretien</button><a class="bouton" href="#revisions">Réviser</a></div></div>';
    courant = null;
    main.querySelector('[data-nouveau]').addEventListener('click', function () { A.afficher(); });
  }

  function historique() {
    const liste = A.etat.entretiens.slice(-10).reverse();
    if (!liste.length) return A.el('<div></div>');
    return A.el('<div class="carte"><h2 style="margin-top:0">Derniers entretiens blancs</h2><div class="tableau"><table><thead><tr><th>Date</th><th>Poste</th><th>Durée</th><th>Score</th></tr></thead><tbody>' +
      liste.map(function (e) {
        return '<tr><td>' + o.dateLisible(e.date) + '</td><td>' + o.echapper(PROFILS[e.profil] ? PROFILS[e.profil].nom : e.profil) + '</td><td>' + o.duree(e.duree) + '</td><td>' + e.score + ' %</td></tr>';
      }).join('') + '</tbody></table></div></div>');
  }

  // --- Entretien oral avec Claude ------------------------------------------------------------------------------------
  // Réponses préparées (Mes histoires) à faire challenger par Claude, dans la langue de l'entretien si possible.
  function histoiresPourClaude(langue) {
    const h = A.etat.histoires;
    const choix = [['pitch', 'Présente-toi', 'Tell me about yourself'], ['pourquoi-quant', 'Pourquoi la finance quantitative', 'Why quant'],
      ['stage', 'Mon stage actuel', 'My current internship'], ['projet', 'Mon projet préféré', 'My favourite project'], ['pourquoi-maison', 'Pourquoi vous', 'Why you']];
    return choix.map(function (c) {
      const texte = ((langue === 'en' ? h[c[0] + ':en'] : '') || h[c[0]] || '').trim();
      return texte ? '[' + (langue === 'en' ? c[2] : c[1]) + ']\n' + texte : '';
    }).filter(Boolean).join('\n\n');
  }

  function consignes(profil, entreprise, langue, theme, avecHistoires) {
    const etat = A.etat;
    const cfg = PROFILS[profil];
    const candidat = (etat.reglages.profilCandidat || PROFIL_CANDIDAT_DEFAUT).trim();
    const fr = langue === 'fr';
    const themes = Object.keys(cfg.poids).sort(function (a, b) { return cfg.poids[b] - cfg.poids[a]; })
      .map(function (t) { return A.nomTheme(t); }).join(', ');
    const lignes = fr ? [
      'Tu es un intervieweur exigeant mais bienveillant pour un stage en finance quantitative (' + cfg.nom + ')' + (entreprise ? ' chez ' + entreprise : '') + '.',
      'Fais-moi passer un entretien réaliste d’environ 40 minutes, en français.',
      '',
      'Mon profil :',
      candidat,
      '',
      'Déroulé : (1) présente-toi en une phrase et demande-moi de me présenter ; (2) creuse un de mes projets (choix, limites, ce que je ferais autrement) ; ' +
        '(3) ' + (theme ? 'des questions techniques centrées sur : ' + theme : 'quatre ou cinq questions techniques, surtout : ' + themes) + ' ; (4) motivation : pourquoi ce métier, pourquoi cette maison ; (5) demande-moi si j’ai des questions.',
      '',
      'Règles :',
      '- Une seule question à la fois ; attends ma réponse avant de continuer.',
      '- Ne donne jamais la solution tout de suite : si je bloque, donne un petit indice, comme un vrai intervieweur.',
      '- Relance une ou deux fois sur chaque réponse (« pourquoi ? », « et si… ? », « quelle limite ? »), surtout si je reste vague.',
      '- Si je fais une erreur de calcul, laisse-moi une chance de la trouver avant de la signaler.',
      '- Reste dans ton rôle jusqu’à ce que je dise « fin de l’entretien ».',
      '',
      'À la fin : un retour structuré avec (a) une note sur 10 pour la technique, la clarté du raisonnement, la communication et la motivation ; ' +
        '(b) mes trois points forts ; (c) mes trois points faibles, avec la bonne réponse aux questions ratées ; (d) ce que je dois réviser en priorité.'
    ] : [
      'You are a demanding but fair interviewer for a quantitative finance internship (' + cfg.nom + ')' + (entreprise ? ' at ' + entreprise : '') + '.',
      'Run a realistic interview of about 40 minutes, in English. I am a French speaker: do not correct my English unless it hurts clarity.',
      '',
      'My background:',
      candidat,
      '',
      'Structure: (1) introduce yourself in one sentence and ask me to introduce myself; (2) dig into one of my projects (choices, limits, what I would do differently); ' +
        '(3) ' + (theme ? 'technical questions focused on: ' + theme : 'four or five technical questions, mostly: ' + themes) + '; (4) motivation: why this job, why this firm; (5) ask whether I have questions.',
      '',
      'Rules:',
      '- One question at a time; wait for my answer.',
      '- Never give the solution right away: if I am stuck, give a small hint, as a real interviewer would.',
      '- Follow up once or twice on every answer ("why?", "what if…?", "what are the limits?"), especially if I stay vague.',
      '- If I make an arithmetic mistake, give me a chance to catch it before pointing it out.',
      '- Stay in character until I say "end of interview".',
      '',
      'At the end, give structured feedback: (a) a score out of 10 for technical skills, clarity of reasoning, communication and motivation; ' +
        '(b) my three strengths; (c) my three weaknesses, with the correct answer to the questions I missed; (d) what I should review first.'
    ];
    const histoires = avecHistoires ? histoiresPourClaude(langue) : '';
    if (histoires) {
      lignes.push('', fr ? 'Mes réponses préparées (pose les questions correspondantes, puis challenge-moi : ce qui est vague, ce qui ne tient pas, ce qu\u2019un recruteur relèverait) :' :
        'My prepared answers (ask the matching questions, then challenge me: what is vague, what does not hold, what a recruiter would pick on):', histoires);
    }
    return lignes.join('\n');
  }

  const PROFIL_CANDIDAT_DEFAUT = [
    '- Je cherche un stage de césure de 5 à 6 mois à partir de [mois de début] en finance quantitative (recherche, pricing, strats ; data science en second choix).',
    '- Formation : [à compléter : école, année, parcours ].',
    '- Expérience : stage en cours [à compléter : entreprise, date de fin] [à compléter : équipe, sujet, résultat].',
    '- Projets personnels en Python (NumPy, SciPy), tous sur données synthétiques et écrits avec l’aide d’une IA, que je sais défendre :',
    '  1. Surface de volatilité : marché Heston synthétique bruité, calibration SVI par tranche, contrôles d’arbitrage papillon et calendaire.',
    '  2. Arbitrage statistique : paires cointégrées (Engle-Granger), backtest walk-forward, coûts, bootstrap du Sharpe, Sharpe déflaté, contrôle négatif.',
    '  3. Market making : Avellaneda–Stoikov contre un teneur naïf, simulation Monte-Carlo, compromis PnL / risque d’inventaire.'
  ].join('\n');

  function rendreClaude(main, params) {
    const etat = A.etat;
    main.innerHTML = '<h1>Entretien oral avec Claude</h1>' +
      '<div class="carte"><p>L’écrit ne remplace pas l’oral. Pour t’entraîner à <b>parler</b> : copie ces consignes, colle-les dans une ' +
      'nouvelle conversation de l’application Claude, puis active le <b>mode vocal</b> et réponds à voix haute. Claude joue l’intervieweur, ' +
      'relance et te fait un retour à la fin.</p><p class="petit doux">Ton profil vient de Réglages → « Mon profil pour l’entretien » : ' +
      'complète-le (école, sujet du stage actuel) pour des questions plus justes. Rien n’est envoyé par cette page : tu copies, tu colles.</p></div>' +
      '<form class="carte" data-claude><div class="grille" style="margin:0">' +
      '<div><label for="cl-profil">Type de poste</label><select id="cl-profil">' + Object.keys(PROFILS).map(function (p) {
        return '<option value="' + p + '"' + (p === (etat.reglages.profils[0] || 'hf') ? ' selected' : '') + '>' + o.echapper(PROFILS[p].nom) + '</option>';
      }).join('') + '</select></div>' +
      '<div><label for="cl-entreprise">Entreprise (facultatif)</label><input id="cl-entreprise" placeholder="ex. un fonds systématique parisien"></div>' +
      '<div><label for="cl-langue">Langue</label><select id="cl-langue"><option value="fr">Français</option><option value="en">Anglais</option></select></div>' +
      '<div><label for="cl-theme">Thème imposé (facultatif)</label><input id="cl-theme" placeholder="ex. calcul stochastique, mon projet stat arb"></div></div>' +
      '<label class="case" style="margin-top:10px"><input type="checkbox" id="cl-histoires"> Inclure mes histoires rédigées pour que Claude les challenge</label>' +
      '<label for="cl-texte">Consignes à copier</label><textarea id="cl-texte" style="min-height:22em" spellcheck="false"></textarea>' +
      '<div class="ligne"><button class="principal" type="button" data-copier>Copier les consignes</button><a class="bouton" href="#entretien">Retour</a></div></form>';
    const f = main.querySelector('[data-claude]');
    function maj() {
      f.querySelector('#cl-texte').value = consignes(f.querySelector('#cl-profil').value, f.querySelector('#cl-entreprise').value.trim(),
        f.querySelector('#cl-langue').value, f.querySelector('#cl-theme').value.trim(), f.querySelector('#cl-histoires').checked);
    }
    f.addEventListener('input', function (e) { if (e.target.id !== 'cl-texte') maj(); });
    f.addEventListener('change', function (e) { if (e.target.id !== 'cl-texte') maj(); });
    maj();
    f.querySelector('[data-copier]').addEventListener('click', function () {
      const t = f.querySelector('#cl-texte');
      const ok = function () { A.toast('Consignes copiées : colle-les dans Claude.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(ok, function () { t.select(); document.execCommand('copy'); ok(); });
      else { t.select(); document.execCommand('copy'); ok(); }
    });
  }

  A.enregistrerVue({
    id: 'entretien', titre: 'Entretien blanc', court: 'Entretien', icone: '▶', ordre: 5.05, rendre: rendre,
    touche: function (e, saisie) { if (controle && controle.touche(e, saisie)) e.preventDefault(); }
  });
  P.entretien = { PROFILS: PROFILS, DUREES: DUREES, composer: composer, decouperRelance: decouperRelance, consignes: consignes, PROFIL_CANDIDAT_DEFAUT: PROFIL_CANDIDAT_DEFAUT };
})(this);
