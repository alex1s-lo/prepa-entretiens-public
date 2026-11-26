// QCM : une question à choix multiples par fiche (et des questions sur chaque chapitre du cours), à part des révisions.
// Les mauvaises réponses sont des pièges courants, chacune avec son explication : on apprend en lisant pourquoi c'est faux.
// La progression du QCM est séparée de la répétition espacée : répondre ici ne change pas le planning des fiches.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;
  const TAILLE = 10;
  const LETTRES = ['A', 'B', 'C', 'D', 'E'];

  function toutes() { return (racine.PREPA_QCM && racine.PREPA_QCM.questions) || []; }
  function suivi() {
    if (!A.etat.qcm || typeof A.etat.qcm !== 'object') A.etat.qcm = {};
    return A.etat.qcm;
  }
  function chapitre(id) {
    const c = racine.PREPA_COURS && racine.PREPA_COURS.chapitres;
    return c ? c.filter(function (x) { return x.id === id; })[0] || null : null;
  }
  function estCours(q) { return q.cible.indexOf('cours:') === 0; }
  // Domaine d'une question : « cours », « casse-tete » (toute énigme de la section Casse-têtes) ou le thème de la fiche.
  function domaine(q) {
    if (estCours(q)) return 'cours';
    const f = A.fiche(q.cible);
    if (!f) return 'autre';
    return f.categorie ? 'casse-tete' : f.theme;
  }
  function nomDomaine(d) {
    if (d === 'cours') return 'Cours';
    if (d === 'casse-tete') return 'Casse-têtes';
    return A.nomTheme(d);
  }
  function domaines() {
    const vus = {};
    toutes().forEach(function (q) { vus[domaine(q)] = true; });
    const ordre = ['cours'].concat(Object.keys(A.banque().themes || {}));
    return ordre.filter(function (d) { return vus[d]; }).concat(Object.keys(vus).filter(function (d) { return ordre.indexOf(d) < 0; }));
  }
  function etatQ(q) {
    const s = suivi()[q.id];
    if (!s) return 'nouvelle';
    return s.r ? 'juste' : 'fausse';
  }

  // Tirage : d'abord les questions ratées la dernière fois, puis les jamais vues, puis les plus anciennes.
  function tirer(liste, n) {
    const s = suivi();
    const fausses = o.melanger(Math.random, liste.filter(function (q) { return etatQ(q) === 'fausse'; }));
    const neuves = o.melanger(Math.random, liste.filter(function (q) { return etatQ(q) === 'nouvelle'; }));
    const justes = liste.filter(function (q) { return etatQ(q) === 'juste'; })
      .sort(function (a, b) { return (s[a.id].d || '') < (s[b.id].d || '') ? -1 : (s[a.id].d || '') > (s[b.id].d || '') ? 1 : 0; });
    return fausses.concat(neuves, justes).slice(0, n);
  }

  function barre(part) {
    return '<div class="barre"><span style="width:' + Math.round(100 * part) + '%"></span></div>';
  }

  // --- Accueil du QCM -----------------------------------------------------------------------------------------------
  // Ligne de liste : nom, détail, avancement, et l'action au bout
  function ligneListe(attrs, nom, detail, part, droite) {
    return '<li><a class="ligne-liste" ' + attrs + '><span class="ll-nom">' + nom + '</span><span class="ll-detail">' + detail + '</span>' +
      (part == null ? '' : '<span class="ll-barre">' + barre(part) + '</span>') + '<span class="ll-droite">' + (droite || 'Jouer') + '</span></a></li>';
  }
  function rendreAccueil(main, par) {
    const qs = toutes();
    const s = suivi();
    const faites = qs.filter(function (q) { return s[q.id]; });
    const justes = faites.filter(function (q) { return s[q.id].r; }).length;
    const fausses = faites.length - justes;
    const jeuOn = A.jeuActif() && P.jeu2;
    const onglets = [['domaines', 'Par domaine'], ['chapitres', 'Par chapitre du cours']].concat(jeuOn ? [['classees', 'Parties classées']] : []);
    if (!onglets.some(function (x) { return x[0] === par; })) par = 'domaines';
    let corps = '';
    if (par === 'chapitres') {
      const C = (racine.PREPA_COURS && racine.PREPA_COURS.chapitres) || [];
      let partie = '';
      corps = C.map(function (c) {
        const l = duChapitre(c.id);
        if (!l.length) return '';
        const f = l.filter(function (q) { return s[q.id]; });
        const j = f.filter(function (q) { return s[q.id].r; }).length;
        const tete = c.partie !== partie ? (partie ? '</ul>' : '') + '<h2 class="tete-liste">' + o.echapper(c.partie) + '</h2><ul class="liste-lignes">' : '';
        partie = c.partie;
        return tete + ligneListe('href="#qcm/c=' + encodeURIComponent(c.id) + '"', '<span class="ll-num">' + c.numero + '</span>' + o.echapper(c.titre),
          f.length + ' / ' + l.length + (f.length ? ' · ' + Math.round(100 * j / f.length) + ' % justes' : ''), f.length / l.length);
      }).join('') + '</ul>';
    } else if (par === 'classees') {
      corps = '<p class="petit doux">Les questions se calent sur ta cote dans le domaine : réussir plus difficile que ton niveau la fait monter, rater plus facile la fait baisser.</p>' +
        '<ul class="liste-lignes">' + domaines().map(function (d) {
          const c = P.jeu2.coteJoueur(A.etat, d);
          const l = P.jeu2.ligue(c.r);
          return ligneListe('href="#qcm/classee=' + encodeURIComponent(d) + '" data-classee="' + o.echapper(d) + '"', o.echapper(nomDomaine(d)),
            (c.n ? c.n + ' réponses' : 'Non classé') + (l.suivante ? ' · ' + l.suivante.nom + ' à ' + l.suivante.cote : ''), null,
            '<span class="badge-ligue ligue-' + o.echapper(l.nom.toLowerCase()) + '">' + o.echapper(l.nom) + ' · ' + c.r + '</span>');
        }).join('') + '</ul>';
    } else {
      corps = '<ul class="liste-lignes">' + domaines().map(function (d) {
        const l = qs.filter(function (q) { return domaine(q) === d; });
        const f = l.filter(function (q) { return s[q.id]; });
        const j = f.filter(function (q) { return s[q.id].r; }).length;
        return ligneListe('href="#qcm" data-qcm-domaine="' + o.echapper(d) + '"', o.echapper(nomDomaine(d)),
          f.length + ' / ' + l.length + (f.length ? ' · ' + Math.round(100 * j / f.length) + ' % justes' : ''), f.length / Math.max(1, l.length));
      }).join('') + '</ul>';
    }
    main.innerHTML = '<div class="tete-page"><div><h1>QCM</h1><p class="chapeau">Une question par fiche et par chapitre du cours ; chaque réponse est corrigée et expliquée.</p></div>' +
      '<div class="ligne">' + (fausses ? '<button data-qcm-erreurs>Mes ' + fausses + ' erreur' + (fausses > 1 ? 's' : '') + '</button>' : '') +
      '<button class="principal" data-qcm-tout>Session de ' + TAILLE + '</button></div></div>' +
      '<p class="resume-stats"><span><b data-qcm-faites>' + faites.length + '</b> / ' + qs.length + ' répondues</span>' +
      '<span><b>' + (faites.length ? Math.round(100 * justes / faites.length) + ' %' : '–') + '</b> de réussite</span>' +
      '<span><b>' + fausses + '</b> à retravailler</span></p>' +
      '<details class="aide-page"><summary>Comment ça marche</summary><p>Les mauvaises réponses sont les erreurs que l’on commet vraiment (oubli d’un cas, formule voisine, intuition trompeuse). ' +
      'Tu ne connais pas la notion ? « Voir le cours d’abord » affiche la section du cours qui l’explique, « Je ne sais pas encore » montre la réponse sans pénalité, ' +
      'et chaque correction donne la solution rédigée pas à pas. Les ratées reviennent en priorité. Cette progression est séparée des révisions : elle ne change pas le planning des fiches.</p></details>' +
      '<div class="onglets" role="tablist">' + onglets.map(function (x) {
        return '<a class="bouton-onglet" role="tab" aria-selected="' + (x[0] === par) + '" href="#qcm/par=' + x[0] + '">' + x[1] + '</a>';
      }).join('') + '</div>' + corps;
    main.querySelector('[data-qcm-tout]').addEventListener('click', function () { lancer(tirer(qs, TAILLE)); });
    const err = main.querySelector('[data-qcm-erreurs]');
    if (err) err.addEventListener('click', function () { lancer(tirer(qs.filter(function (q) { return etatQ(q) === 'fausse'; }), TAILLE)); });
    main.querySelectorAll('[data-qcm-domaine]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        const d = b.getAttribute('data-qcm-domaine');
        lancer(tirer(qs.filter(function (q) { return domaine(q) === d; }), TAILLE));
      });
    });
  }

  function lancer(liste) {
    if (!liste.length) { A.toast('Aucune question à proposer.'); return; }
    A.aller('qcm', { s: liste.map(function (q) { return q.id; }).join(',') });
  }

  // --- Session ------------------------------------------------------------------------------------------------------
  let controle = null;
  function source(q) {
    if (estCours(q)) {
      const c = chapitre(q.cible.slice(6));
      return c ? '<a href="#cours/c=' + encodeURIComponent(c.id) + '">Cours, chapitre ' + c.numero + ' : ' + o.echapper(c.titre) + '</a>' : 'Cours';
    }
    const f = A.fiche(q.cible);
    if (!f) return '';
    const lien = P.composants && P.composants.lienFiche ? P.composants.lienFiche(f) : '#revisions/fiche=' + encodeURIComponent(f.id);
    return '<a href="' + lien + '">' + (f.titre ? o.enLigne(f.titre) : 'Voir la fiche complète') + '</a> · ' + o.echapper(nomDomaine(domaine(q)));
  }
  function enonce(q) {
    if (q.question) return q.question;
    const f = A.fiche(q.cible);
    return f ? f.question : '';
  }

  // --- Apprendre en répondant : la section du cours qui explique la notion, la correction complète -----------------
  // On suppose qu'on peut découvrir une notion par le QCM : chaque question mène à son explication (extrait du chapitre
  // affiché sur place, solution rédigée de la fiche) au lieu de donner seulement la bonne lettre.
  const VIDES = {};
  ('avec dans pour sont plus cette elle elles nous vous leur leurs mais donc alors comme quand toute tous tout toutes entre sans sous etre fait faire meme ' +
    'aussi bien encore deux quel quelle quels quelles vaut valeur ainsi chaque autre autres est-ce peut doit faut seulement toujours jamais exemple').split(' ').forEach(function (m) { VIDES[m] = true; });
  function motsDe(t) {
    const r = {};
    o.sansTex(String(t || '')).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z0-9]+/).forEach(function (m) {
      if (m.length >= 4 && !VIDES[m]) r[m.length > 6 ? m.slice(0, 6) : m] = true;   // racine grossière : pluriels, accords
    });
    return r;
  }
  function bonneReponse(q) { return q.choix.filter(function (c) { return c.ok; })[0]; }
  // Fiche d'une question et ses ancêtres (une variante hérite du cours de son problème parent)
  function lignee(q) {
    const r = [];
    let f = estCours(q) ? null : A.fiche(q.cible);
    while (f && r.length < 4) { r.push(f); f = f.parent ? A.fiche(f.parent) : null; }
    return r;
  }
  function chapitresDe(q) {
    if (!P.cours) return [];
    if (estCours(q)) { const c = chapitre(q.cible.slice(6)); return c ? [c] : []; }
    const l = lignee(q);
    for (let k = 0; k < l.length; k++) { const c = P.cours.chapitresDeLaFiche(l[k].id); if (c.length) return c; }
    return [];
  }
  // Fiche qu'aucun chapitre ne cite : on cherche dans les chapitres de son domaine, et on ne propose la section que
  // si elle colle assez (sinon, la correction rédigée suffit).
  const PROBAS = ['esperance-variance-covariance', 'denombrement-et-poisson', 'conditionnement-markov-martingales', 'lois-gaussiennes'];
  const CHAPITRES_DOMAINE = {
    probas: PROBAS,
    stats: ['statistiques-et-regression', 'algebre-lineaire-covariances', 'lois-gaussiennes'],
    stoch: ['mouvement-brownien', 'integrale-et-lemme-ito', 'equations-differentielles-stochastiques', 'conditionnement-markov-martingales'],
    derives: ['arbitrage-et-risque-neutre', 'black-scholes', 'grecques-et-couverture', 'volatilite', 'options-exotiques', 'methodes-numeriques'],
    taux: ['taux-et-credit', 'arbitrage-et-risque-neutre', 'equations-differentielles-stochastiques'],
    marches: ['risque-et-portefeuille', 'market-making-et-microstructure', 'energie-et-matieres-premieres', 'volatilite', 'grecques-et-couverture'],
    ml: ['machine-learning', 'statistiques-et-regression', 'algebre-lineaire-covariances'],
    algo: ['code-et-algorithmique'],
    'casse-tete:probas': PROBAS, 'casse-tete:denombrement': PROBAS, 'casse-tete:strategie': PROBAS
  };
  function chapitresVoisins(q) {
    const f = lignee(q)[0];
    if (!f) return [];
    const ids = CHAPITRES_DOMAINE[f.theme === 'casse-tete' ? 'casse-tete:' + f.categorie : f.theme] || [];
    return ids.map(chapitre).filter(Boolean);
  }
  const SEUIL_VOISIN = 1;
  // La section la plus proche de la question : celle qui cite la fiche, sinon le meilleur recouvrement de mots
  // (pondéré par leur rareté dans le chapitre).
  // Candidats : chaque section, avec ses mots et ceux des fiches qu'elle cite (des problèmes voisins écrits comme
  // la question, donc plus comparables que le texte du cours).
  const cacheCands = {};
  function candidats(chaps) {
    const cle = chaps.map(function (c) { return c.id; }).join(',');
    if (cacheCands[cle]) return cacheCands[cle];
    const cands = [];
    chaps.forEach(function (c) {
      P.cours.sections(c).forEach(function (s) {
        if (s.texte.trim().length < 80) return;
        const ids = (s.texte.match(/\[\[fiche:([a-z0-9-]+)\]\]/g) || []).map(function (m) { return m.slice(8, -2); });
        const fiches = ids.map(function (id) { const f = A.fiche(id); return f ? { mots: motsDe((f.titre || '') + ' ' + f.question) } : null; }).filter(Boolean);
        cands.push({ chap: c, section: s, ids: ids, mots: motsDe(s.titre + ' ' + s.texte), titre: motsDe(s.titre), fiches: fiches });
      });
    });
    const df = {};
    cands.forEach(function (x) { Object.keys(x.mots).forEach(function (m) { df[m] = (df[m] || 0) + 1; }); });
    cacheCands[cle] = { liste: cands, df: df };
    return cacheCands[cle];
  }
  // Meilleure section : celle qui cite la fiche ; sinon recouvrement de mots pondéré par leur rareté, avec le cours et
  // avec les fiches citées par la section. Mesuré sur les fiches citées (en masquant la citation) : bon chapitre
  // ~9 fois sur 10 au-dessus du seuil, mais bonne section seulement ~6 fois sur 10 : pour une fiche non citée on
  // ne propose donc que le chapitre.
  function chercher(q, chaps, l) {
    const c = candidats(chaps);
    const n = c.liste.length;
    const poids = function (m) { return Math.log(1 + n / (c.df[m] || 0.5)); };
    const f = l[0];
    const req = motsDe(f ? (f.titre || '') + ' ' + f.question : enonce(q) + ' ' + bonneReponse(q).t + ' ' + bonneReponse(q).pourquoi);
    const cles = Object.keys(req);
    const norme = cles.reduce(function (a, m) { return a + poids(m); }, 0) || 1;
    let best = null;
    c.liste.forEach(function (x) {
      let sc = 0;
      cles.forEach(function (m) { if (x.mots[m]) sc += poids(m) * (x.titre[m] ? 2 : 1); });
      let voisins = 0;
      x.fiches.forEach(function (g) {
        let a = 0; cles.forEach(function (m) { if (g.mots[m]) a += poids(m); });
        voisins = Math.max(voisins, a);
      });
      sc = (sc + 1.5 * voisins) / norme;
      if (l.some(function (g) { return x.ids.indexOf(g.id) >= 0; })) sc += 10;
      if (!best || sc > best.score) best = { chap: x.chap, section: x.section, score: sc };
    });
    return best;
  }
  const cachePoint = {};
  function pointDeCours(q) {
    if (Object.prototype.hasOwnProperty.call(cachePoint, q.id)) return cachePoint[q.id];
    let res = null;
    if (P.cours && P.cours.sections) {
      const cites = chapitresDe(q);
      const l = lignee(q);
      if (cites.length) res = chercher(q, cites, l) || { chap: cites[0], section: null };
      else {
        const v = chapitresVoisins(q);
        const b = v.length ? chercher(q, v, l) : null;
        if (b && b.score >= SEUIL_VOISIN) res = { chap: b.chap, section: null, voisin: true };
      }
    }
    cachePoint[q.id] = res;
    return res;
  }
  function lienPoint(p) {
    return '#cours/c=' + encodeURIComponent(p.chap.id) + (p.section && p.section.k ? '/s=' + p.section.k : '');
  }
  // Extrait du cours, replié ou ouvert
  function blocCours(q, ouvert) {
    const p = pointDeCours(q);
    if (!p) return '';
    const nomChap = 'chapitre ' + p.chap.numero + ', ' + o.echapper(p.chap.titre);
    if (!p.section || !P.cours.extrait) {
      return '<details class="point-cours"' + (ouvert ? ' open' : '') + ' data-point-cours><summary><span class="libelle-point">Le cours sur ce thème</span> ' + nomChap + '</summary>' +
        (p.chap.resume ? '<p class="petit">Au programme du chapitre : ' + o.enLigne(p.chap.resume) + '</p>' : '') +
        '<p class="petit lire-suite"><a href="' + lienPoint(p) + '">Ouvrir le chapitre →</a></p></details>';
    }
    const ex = P.cours.extrait(p.chap, p.section.texte);
    return '<details class="point-cours"' + (ouvert ? ' open' : '') + ' data-point-cours><summary><span class="libelle-point">' + 'Le point de cours' + '</span> ' +
      (p.section.k ? o.enLigne(p.section.titre) + ' <span class="doux">· ' + nomChap + '</span>' : nomChap) + '</summary>' +
      '<div class="extrait-cours">' + ex.html + '</div>' +
      '<p class="petit lire-suite"><a href="' + lienPoint(p) + '">' + (ex.coupe ? 'Démonstrations, exercices et suite dans le chapitre →' : 'Ouvrir cette section dans le chapitre →') + '</a></p></details>';
  }
  // Correction détaillée : la bonne réponse et sa justification, la solution rédigée de la fiche, le point de cours.
  function correction(q, ouvert, sansBonne) {
    const f = lignee(q)[0];
    const bonne = bonneReponse(q);
    let h = '<div class="correction-detaillee" data-correction>';
    if (!sansBonne) h += '<div class="bonne-reponse"><span class="libelle-point">La bonne réponse</span><p class="reponse-retenue">' + o.enLigne(bonne.t) + '</p>' +
      '<p class="justification">' + o.enLigne(bonne.pourquoi) + '</p></div>';
    if (f && f.solution) {
      h += '<details class="solution-complete"' + (ouvert ? ' open' : '') + ' data-solution-complete><summary><span class="libelle-point">Correction complète</span> pas à pas</summary>' +
        (q.question ? '<div class="enonce-origine"><span class="legende">Le problème d’origine</span>' + o.markdown(f.question) + '</div>' : '') +
        o.markdown(f.solution) +
        (f.piege ? '<div class="encadre alerte"><strong>Le piège classique.</strong> ' + o.enLigne(f.piege) + '</div>' : '') + '</details>';
    }
    h += blocCours(q, ouvert && (!f || !f.solution));
    return h + '</div>';
  }

  // mode : { niveau } (campagne), { classee: domaine } (partie classée), ou rien
  function rendreSession(main, ids, mode) {
    mode = mode || {};
    const parId = {};
    toutes().forEach(function (q) { parId[q.id] = q; });
    const liste = ids.map(function (id) { return parId[id]; }).filter(Boolean);
    if (!liste.length) { A.aller('qcm'); return; }
    const resultats = [];
    let rang = 0;
    let combo = 0;          // bonnes réponses d'affilée dans la session
    let bonusSession = 0;   // XP de combo gagnée dans la session
    const jeu = A.jeuActif() && P.jeu;
    const J2 = jeu && P.jeu2;
    let eloSession = 0;
    const coteDepart = J2 && mode.classee ? P.jeu2.coteJoueur(A.etat, mode.classee).r : null;
    const libelleCombo = function () {
      if (!jeu || combo < 2) return '';
      const b = P.jeu.bonusCombo(combo + 1);
      return '<span class="combo' + (combo >= 5 ? ' chaud' : '') + '" title="Bonnes réponses d’affilée">Combo ×' + combo + (b ? ' · prochaine +' + b + ' XP' : '') + '</span>';
    };

    function question() {
      const q = liste[rang];
      const ordre = o.melanger(Math.random, q.choix.map(function (c, i) { return i; }));
      let repondu = false;
      const retourLien = mode.niveau ? '<a href="#campagne">← Campagne</a>' : '<a href="#qcm">← QCM</a>';
      const tete = mode.niveau ? '<span class="tete-partie" style="margin:0">Niveau ' + mode.niveau.numero + ' · ' + o.echapper(mode.niveau.titre) + '</span><span>&nbsp;· ' : '<span>';
      main.innerHTML = '<p class="petit">' + retourLien + '</p>' +
        '<div class="ligne petit doux" style="margin-bottom:6px">' + tete + 'Question ' + (rang + 1) + ' sur ' + liste.length + '</span><span class="espace"></span>' +
        (mode.classee && J2 ? '<span data-elo class="elo-direct">Cote ' + P.jeu2.coteJoueur(A.etat, mode.classee).r + '</span>' : '') +
        '<span data-combo>' + libelleCombo() + '</span><span>' + resultats.filter(Boolean).length + ' juste' + (resultats.filter(Boolean).length > 1 ? 's' : '') + '</span></div>' +
        barre(rang / liste.length) +
        '<section class="carte carte-qcm"><div class="petit doux source-qcm">' + source(q) + '</div>' +
        '<div class="question">' + o.markdown(enonce(q)) + '</div>' +
        '<ol class="choix-qcm" role="list">' + ordre.map(function (i, k) {
          return '<li><button type="button" class="choix" data-choix="' + i + '"><span class="lettre">' + LETTRES[k] + '</span>' +
            '<span class="texte-choix">' + o.enLigne(q.choix[i].t) + '</span></button><div class="pourquoi" hidden></div></li>';
        }).join('') + '</ol>' + aides() + '<div data-qcm-aide></div><div data-qcm-suite></div></section>';
      let aide = false;   // indice ou cours consulté avant de répondre : pas de combo ni de cote en jeu
      function aides() {
        const f = lignee(q)[0];
        const p = pointDeCours(q);
        return '<div class="ligne aides-qcm" data-aides>' +
          (p ? '<button type="button" class="discret" data-qcm-voir-cours title="L’explication de la notion, sans la réponse">Voir le cours d’abord</button>' : '') +
          (f && f.indice ? '<button type="button" class="discret" data-qcm-indice>Un indice</button>' : '') +
          '<span class="espace"></span><button type="button" class="discret" data-qcm-inconnu title="Montre la réponse et l’explication ; la question reviendra plus tard">Je ne sais pas encore <kbd>?</kbd></button></div>';
      }

      function repondre(i) {
        if (repondu) return;
        repondu = true;
        const inconnu = i < 0;   // « Je ne sais pas encore » : on montre tout, sans pénalité de cote
        const juste = !inconnu && q.choix[i].ok;
        resultats.push(juste);
        const s = suivi();
        const prec = s[q.id] || { n: 0, j: 0 };
        const dejaJusteAujourdhui = !!(prec.r && prec.d === A.aujourdhui());
        s[q.id] = { n: prec.n + 1, j: prec.j + (juste ? 1 : 0), r: juste, d: A.aujourdhui() };
        A.noterActivite('qcm');
        if (juste && !aide) {
          combo += 1;
          // le combo ne paie que sur une question pas déjà réussie aujourd'hui (pas de farming)
          if (jeu && !dejaJusteAujourdhui) bonusSession += P.jeu.ajouterBonus(A.etat, A.aujourdhui(), P.jeu.bonusCombo(combo));
          if (jeu) A.etat.jeu.meilleurCombo = Math.max(A.etat.jeu.meilleurCombo || 0, combo);
        } else if (!juste) combo = 0;
        if (!inconnu) A.son(juste ? (combo >= 3 ? 'combo' : 'juste') : 'faux');
        let elo = null;
        if (J2 && !inconnu && !aide) { elo = P.jeu2.majElo(A.etat, A.contexteJeu(), q, juste); eloSession += elo.delta; }
        A.sauver();
        if (elo && mode.classee) {
          const ze = main.querySelector('[data-elo]');
          if (ze) ze.innerHTML = 'Cote ' + elo.cote + ' <span class="' + (elo.delta >= 0 ? 'positif' : 'negatif') + '">' + (elo.delta >= 0 ? '+' : '') + elo.delta + '</span>';
        }
        const zc = main.querySelector('[data-combo]');
        if (zc) zc.innerHTML = libelleCombo();
        main.querySelectorAll('[data-choix]').forEach(function (b) {
          const k = Number(b.getAttribute('data-choix'));
          const c = q.choix[k];
          b.disabled = true;
          b.classList.add(c.ok ? 'bonne' : k === i ? 'mauvaise' : 'autre');
          if (k === i) b.setAttribute('aria-label', (c.ok ? 'Ta réponse, juste : ' : 'Ta réponse, fausse : ') + o.sansTex(c.t));
          const p = b.parentNode.querySelector('.pourquoi');
          p.innerHTML = '<span class="verdict-choix">' + (c.ok ? (inconnu ? 'La bonne réponse.' : 'Juste.') : k === i ? 'Ta réponse, fausse.' : 'Faux.') + '</span> ' + o.enLigne(c.pourquoi);
          p.hidden = false;
        });
        const za = main.querySelector('[data-aides]');
        if (za) za.remove();
        const zaide = main.querySelector('[data-qcm-aide]');
        const coursDejaOuvert = !!(zaide && zaide.querySelector('[data-point-cours]'));
        if (zaide) zaide.innerHTML = '';
        const fin = rang + 1 >= liste.length;
        const suite = main.querySelector('[data-qcm-suite]');
        const message = inconnu ? '<div class="encadre info"><strong>Pas de souci, c’est fait pour apprendre.</strong> Lis la correction ci-dessous ; la question reviendra dans une prochaine session' +
            (mode.classee ? ' (ta cote ne bouge pas)' : '') + '.</div>' :
          '<div class="encadre ' + (juste ? 'succes' : 'erreur') + '"><strong>' + (juste ? 'Juste.' : 'Pas cette fois.') + '</strong> ' +
          (juste ? 'Lis quand même pourquoi les autres réponses sont fausses : ce sont les pièges qu’on te tendra.' : 'Regarde pourquoi ta réponse ne marche pas, puis la correction complète ci-dessous.') + '</div>';
        // ratée ou inconnue : correction ouverte ; juste : repliée, à consulter au besoin
        suite.innerHTML = message + correction(q, !juste || coursDejaOuvert, false) +
          '<div class="ligne fin"><button class="principal" data-qcm-suivante>' + (fin ? 'Voir le bilan' : 'Question suivante') + ' <kbd>Entrée</kbd></button></div>';
        suite.querySelector('[data-qcm-suivante]').addEventListener('click', suivante);
        suite.querySelector('[data-qcm-suivante]').focus({ preventScroll: true });
      }
      function suivante() {
        rang += 1;
        if (rang >= liste.length) bilan(); else { question(); racine.scrollTo(0, 0); }
      }
      main.querySelectorAll('[data-choix]').forEach(function (b) {
        b.addEventListener('click', function () { repondre(Number(b.getAttribute('data-choix'))); });
      });
      function brancherAides() {
        const zaide = main.querySelector('[data-qcm-aide]');
        const vc = main.querySelector('[data-qcm-voir-cours]');
        if (vc) vc.addEventListener('click', function () {
          aide = true; vc.remove();
          zaide.insertAdjacentHTML('beforeend', blocCours(q, true));
        });
        const vi = main.querySelector('[data-qcm-indice]');
        if (vi) vi.addEventListener('click', function () {
          aide = true; vi.remove();
          zaide.insertAdjacentHTML('afterbegin', '<div class="encadre info indice-qcm"><strong>Indice.</strong> ' + o.enLigne(lignee(q)[0].indice) + '</div>');
        });
        main.querySelector('[data-qcm-inconnu]').addEventListener('click', function () { repondre(-1); });
      }
      brancherAides();
      controle = {
        touche: function (e, saisie) {
          if (saisie) return false;
          if (!repondu) {
            if (e.key === '?') { repondre(-1); return true; }
            const k = '1234567'.indexOf(e.key) >= 0 ? Number(e.key) - 1 : LETTRES.indexOf(e.key.toUpperCase());
            if (k >= 0 && k < ordre.length) { repondre(ordre[k]); return true; }
            return false;
          }
          if (e.key === 'Enter' || e.key === ' ') { suivante(); return true; }
          return false;
        }
      };
    }

    function bilan() {
      controle = null;
      const n = resultats.filter(Boolean).length;
      if (mode.niveau && J2) return bilanNiveau(n);
      const ratees = liste.filter(function (q, i) { return !resultats[i]; });
      // en mode carrière : où en sont les quêtes, et la suite en un clic
      const rj = jeu ? A.resultatJeu() : null;
      const quetes = rj ? rj.quetes.jour.concat([rj.quetes.semaine]) : [];
      main.innerHTML = '<p class="petit"><a href="#qcm">← QCM</a></p><h1>Bilan</h1>' +
        '<div class="carte"><div class="chiffre">' + n + ' / ' + liste.length + '</div><div class="legende">' +
        (n === liste.length ? 'Sans faute.' : n >= liste.length * 0.7 ? 'Solide : relis les pièges qui t’ont eu.' : 'Les questions ratées reviendront en priorité dans tes prochaines sessions.') +
        (bonusSession ? ' Bonus de combo : +' + bonusSession + ' XP.' : '') + '</div></div>' +
        (mode.classee && J2 ? blocClassement(mode.classee, coteDepart) : '') +
        (rj ? '<div class="carte"><div class="ligne"><h2 style="margin:0">Quêtes</h2><span class="espace"></span><span class="legende">Niveau ' + rj.niveau + ' · ' +
          (rj.seuilSuivant ? (rj.seuilSuivant - rj.total) + ' XP avant le suivant' : 'niveau maximal') + '</span></div><ul class="quetes-mini">' + quetes.map(function (x) {
            return '<li class="' + (x.reussie ? 'reussie' : '') + '"><span>' + (x.reussie ? '✓ ' : '') + o.echapper(x.titre) + '</span>' + barre(Math.min(1, x.fait / x.cible)) +
              '<span class="legende">' + Math.min(x.fait, x.cible) + ' / ' + x.cible + '</span></li>';
          }).join('') + '</ul>' + (rj.prochaine ? '<p class="petit" style="margin-bottom:0">Ensuite : <a href="' + rj.prochaine.lien + '">' + o.echapper(rj.prochaine.titre) + '</a></p>' : '') + '</div>' : '') +
        (ratees.length ? '<h2>À revoir</h2><p class="petit doux">Clique sur une question pour revoir sa correction et le point de cours.</p><ul class="liste-revoir">' + ratees.map(function (q) {
          return '<li><details class="revoir"><summary>' + o.echapper(o.resume(o.sansTex(enonce(q)), 110)) + '</summary>' +
            '<p class="petit">' + source(q) + '</p>' + correction(q, true, false) + '</details></li>';
        }).join('') + '</ul>' : '') +
        '<div class="ligne" style="margin-top:16px">' +
        '<button class="principal" data-qcm-autre>Encore 10 <kbd>Entrée</kbd></button>' +
        (ratees.length ? '<button data-qcm-refaire>Refaire mes erreurs</button>' : '') +
        '<a class="bouton" href="#qcm">Retour au QCM</a></div>';
      controle = { touche: function (e, saisie) { if (!saisie && e.key === 'Enter') { main.querySelector('[data-qcm-autre]').click(); return true; } return false; } };
      const r = main.querySelector('[data-qcm-refaire]');
      if (r) r.addEventListener('click', function () { lancer(o.melanger(Math.random, ratees)); });
      main.querySelector('[data-qcm-autre]').addEventListener('click', function () {
        const doms = {};
        liste.forEach(function (q) { doms[domaine(q)] = true; });
        if (mode.classee) { A.aller('qcm', { classee: mode.classee, t: Date.now() }); return; }
        const memes = Object.keys(doms).length === 1 ? toutes().filter(function (q) { return doms[domaine(q)]; }) : toutes();
        lancer(tirer(memes, TAILLE));
      });
    }

    // Fin d'un niveau de campagne : étoiles, record, niveau suivant.
    function bilanNiveau(n) {
      const niv = mode.niveau;
      const ctx = A.contexteJeu();
      const res = P.jeu2.terminerNiveau(A.etat, ctx, niv.id, n, liste.length);
      A.sauver();
      const camp = P.jeu2.campagne(A.etat, ctx);
      let suivant = null, trouve = false;
      camp.mondes.forEach(function (m) { m.niveaux.forEach(function (x) { if (trouve && !suivant) suivant = x; if (x.id === niv.id) trouve = true; }); });
      const reussi = res.etoiles >= 1;
      A.son(res.etoiles >= 2 ? 'coffre' : reussi ? 'quete' : 'faux');
      const etoilesHtml = [1, 2, 3].map(function (k) { return '<span class="etoile' + (k <= res.etoiles ? ' pleine' : '') + '" style="animation-delay:' + (0.15 + 0.25 * k) + 's">★</span>'; }).join('');
      const ratees = liste.filter(function (q, i) { return !resultats[i]; });
      main.innerHTML = '<p class="petit"><a href="#campagne">← Campagne</a></p>' +
        '<section class="carte fin-niveau' + (reussi ? ' reussi' : '') + '"><p class="tete-partie">Niveau ' + niv.numero + ' · ' + o.echapper(niv.sous) + '</p>' +
        '<h1>' + (res.etoiles === 3 ? 'Parfait' : reussi ? 'Niveau réussi' : 'Pas encore') + '</h1><div class="etoiles-fin">' + etoilesHtml + '</div>' +
        '<p class="chiffre">' + n + ' / ' + liste.length + '</p>' +
        '<p class="doux">' + (res.record ? 'Nouveau record sur ce niveau. ' : '') + (res.nouveauMonde ? 'Monde terminé : +' + P.jeu2.MONDE_XP + ' XP. ' : '') +
        (reussi ? (res.etoiles < 3 ? 'Une étoile de plus à ' + (res.etoiles === 1 ? '80 %' : '100 %') + '.' : '') : 'Il faut 60 % pour passer. Les questions changent à chaque partie.') +
        (bonusSession ? ' Combo : +' + bonusSession + ' XP.' : '') + '</p>' +
        (!reussi && chapitre(niv.id.split(':')[0]) ? '<p class="petit">Avant de rejouer : <a href="#cours/c=' + encodeURIComponent(niv.id.split(':')[0]) + '" data-relire-chapitre>relis le chapitre ' +
          chapitre(niv.id.split(':')[0]).numero + '</a>, ou déplie la correction des questions ratées ci-dessous.</p>' : '') +
        '<div class="ligne centre">' + (reussi && suivant ? '<a class="bouton principal" href="#campagne/n=' + encodeURIComponent(suivant.id) + '" data-niveau-suivant>Niveau suivant <kbd>Entrée</kbd></a>' : '') +
        '<a class="bouton' + (reussi && suivant ? '' : ' principal') + '" href="#qcm/niveau=' + encodeURIComponent(niv.id) + '/t=' + Date.now() + '" data-rejouer>Rejouer' + (reussi && suivant ? '' : ' <kbd>Entrée</kbd>') + '</a>' +
        '<a class="bouton" href="#campagne">Carte</a></div></section>' +
        (ratees.length ? '<h2>À revoir</h2><p class="petit doux">Clique sur une question pour revoir sa correction et le point de cours.</p><ul class="liste-revoir">' + ratees.map(function (q) {
          return '<li><details class="revoir"><summary>' + o.echapper(o.resume(o.sansTex(enonce(q)), 110)) + '</summary>' +
            '<p class="petit">' + source(q) + '</p>' + correction(q, true, false) + '</details></li>';
        }).join('') + '</ul>' : '');
      const principal = main.querySelector('[data-niveau-suivant]') || main.querySelector('[data-rejouer]');
      controle = { touche: function (e, saisie) { if (!saisie && e.key === 'Enter') { principal.click(); return true; } return false; } };
      racine.scrollTo(0, 0);
    }

    question();
  }

  function blocClassement(dom, depart) {
    const c = P.jeu2.coteJoueur(A.etat, dom);
    const l = P.jeu2.ligue(c.r);
    const delta = c.r - (depart == null ? c.r : depart);
    return '<div class="carte classement"><div class="ligne"><span class="badge-ligue ligue-' + o.echapper(l.nom.toLowerCase()) + '">' + o.echapper(l.nom) + '</span>' +
      '<span class="chiffre" style="font-size:1.6rem">' + c.r + '</span><span class="' + (delta >= 0 ? 'positif' : 'negatif') + '">' + (delta >= 0 ? '+' : '') + delta + '</span>' +
      '<span class="espace"></span><span class="legende">' + nomDomaine(dom) + (l.suivante ? ' · ' + l.suivante.nom + ' à ' + l.suivante.cote : ' · ligue maximale') + '</span></div></div>';
  }

  // Questions d'un chapitre du cours : celles du chapitre lui-même et celles de ses fiches.
  function duChapitre(id) {
    const c = chapitre(id);
    const fiches = c ? c.fiches || [] : [];
    return toutes().filter(function (q) { return q.cible === 'cours:' + id || fiches.indexOf(q.cible) >= 0; });
  }

  // --- Épreuves (boss) : un test chronométré, sans explications pendant l'épreuve, corrigé en entier à la fin --------
  function noter(q, juste) {
    const s = suivi();
    const prec = s[q.id] || { n: 0, j: 0 };
    s[q.id] = { n: prec.n + 1, j: prec.j + (juste ? 1 : 0), r: juste, d: A.aujourdhui() };
    A.noterActivite('qcm');
    if (A.jeuActif() && P.jeu2) P.jeu2.majElo(A.etat, A.contexteJeu(), q, juste);
  }
  // Questions de l'épreuve : au hasard dans le domaine ; pour l'épreuve finale, une par domaine à tour de rôle.
  function questionsBoss(b) {
    if (!b.final) return o.melanger(Math.random, toutes().filter(function (q) { return domaine(q) === b.domaine; })).slice(0, b.questions);
    const parDom = {};
    o.melanger(Math.random, toutes()).forEach(function (q) { (parDom[domaine(q)] = parDom[domaine(q)] || []).push(q); });
    const doms = o.melanger(Math.random, Object.keys(parDom));
    const res = [];
    for (let k = 0; res.length < b.questions && k < 1000; k++) {
      const l = parDom[doms[k % doms.length]];
      if (l.length) res.push(l.pop());
    }
    return res;
  }
  let minuteurBoss = null;
  function rendreBoss(main, id) {
    const r = A.resultatJeu();
    const b = r && r.boss.filter(function (x) { return x.id === id; })[0];
    if (!b) { A.aller('carriere'); return; }
    const dom = b.final ? 'tous les domaines' : b.domaine === 'cours' ? 'le cours' : b.domaine === 'casse-tete' ? 'les casse-têtes' : A.nomTheme(b.domaine);
    main.innerHTML = '<p class="petit"><a href="#carriere">← Carrière</a></p><p class="tete-partie">Épreuve</p><h1>' + o.echapper(b.nom) + '</h1>' +
      '<div class="carte"><p>' + b.questions + ' questions sur ' + o.echapper(dom) + ', ' + Math.round(b.duree / 60) + ' minutes en tout. ' +
      'Pas d’explication pendant l’épreuve : tu les verras toutes à la fin, comme après un vrai test en ligne.</p>' +
      '<p class="legende">Bronze à 60 %, argent à ' + Math.round(100 * b.seuilVictoire) + ' % (victoire), or à 90 %. ' + (b.tentatives ? 'Ton record : ' + Math.round(100 * b.meilleur) + ' %.' : 'Première tentative.') + '</p></div>' +
      blocMise(r, b) +
      '<div class="ligne"><button class="principal" data-boss-go>Commencer l’épreuve <kbd>Entrée</kbd></button></div>';
    const lire = function () { const el = main.querySelector('[data-mise]'); return el ? Math.round(r.desk.capital * Number(el.value) / 100) : 0; };
    const curseur = main.querySelector('[data-mise]');
    if (curseur) curseur.addEventListener('input', function () {
      main.querySelector('[data-mise-texte]').textContent = Number(curseur.value) ? curseur.value + ' % du capital, soit ' + lire().toLocaleString('fr-FR') + ' €' : 'aucune mise';
    });
    const go = function () { lancerBoss(main, b, Math.max(0, lire())); };
    controle = { touche: function (e, saisie) { if (!saisie && e.key === 'Enter') { go(); return true; } return false; } };
    main.querySelector('[data-boss-go]').addEventListener('click', go);
  }
  // Mise du desk sur sa propre victoire, à 1 contre 1 : la mise de Kelly f* = 2p − 1 est affichée, avec p estimée.
  function blocMise(r, b) {
    if (!r.desk || r.desk.capital <= 0) return '';
    const est = P.jeu.estimationVictoire(A.etat, A.contexteJeu(), b);
    const kelly = Math.round(100 * est.kelly);
    return '<div class="carte mise-desk"><div class="ligne"><h2 style="margin:0">Miser sur ta victoire</h2><span class="espace"></span>' +
      '<span class="legende">Capital du desk : ' + r.desk.capital.toLocaleString('fr-FR') + ' €</span></div>' +
      '<p class="petit">Pari à 1 contre 1 sur la victoire (au moins ' + Math.round(100 * b.seuilVictoire) + ' %). D’après ta précision passée sur ce domaine (' + Math.round(100 * est.precision) + ' %), ' +
      'ta probabilité de victoire est d’environ <strong>' + Math.round(100 * est.victoire) + ' %</strong> ; la mise de Kelly vaut 2p − 1, soit <strong>' + kelly + ' %</strong> du capital' +
      (kelly === 0 ? ' : aucune mise n’est rentable, sauf si tu penses avoir progressé.' : '. Comme p n’est qu’une estimation, les professionnels misent plutôt la moitié (demi-Kelly : ' + Math.round(kelly / 2) + ' %).') + '</p>' +
      '<label class="ligne petit" style="gap:12px"><input type="range" min="0" max="50" step="1" value="0" data-mise style="flex:1"><span data-mise-texte style="min-width:16ch">aucune mise</span></label></div>';
  }
  function lancerBoss(main, b, mise) {
    const liste = questionsBoss(b);
    const reponses = [];
    const fin = Date.now() + b.duree * 1000;
    let rang = 0;
    let termine = false;
    clearInterval(minuteurBoss);
    minuteurBoss = setInterval(function () {
      const c = main.querySelector('[data-boss-chrono]');
      if (!c || !main.isConnected) { clearInterval(minuteurBoss); return; }
      const reste = Math.max(0, Math.round((fin - Date.now()) / 1000));
      c.textContent = o.duree(reste);
      if (reste <= 30) c.classList.add('urgent');
      if (reste <= 0) terminer();
    }, 500);
    function question() {
      const q = liste[rang];
      const ordre = o.melanger(Math.random, q.choix.map(function (c, i) { return i; }));
      main.innerHTML = '<div class="ligne petit doux" style="margin-bottom:6px"><span class="tete-partie" style="margin:0">' + o.echapper(b.nom) + '</span><span class="espace"></span>' +
        '<span>Question ' + (rang + 1) + ' / ' + liste.length + '</span><span class="chrono" data-boss-chrono>' + o.duree(Math.max(0, Math.round((fin - Date.now()) / 1000))) + '</span></div>' +
        barre(rang / liste.length) +
        '<section class="carte carte-qcm"><div class="question">' + o.markdown(enonce(q)) + '</div><ol class="choix-qcm" role="list">' + ordre.map(function (i, k) {
          return '<li><button type="button" class="choix" data-choix="' + i + '"><span class="lettre">' + LETTRES[k] + '</span><span class="texte-choix">' + o.enLigne(q.choix[i].t) + '</span></button></li>';
        }).join('') + '</ol></section>';
      let fait = false;
      function repondre(i) {
        if (fait || termine) return;
        fait = true;
        reponses.push(i);
        A.son('clic');
        const bouton = main.querySelector('[data-choix="' + i + '"]');
        if (bouton) bouton.classList.add('choisie');
        setTimeout(function () {
          rang += 1;
          if (rang >= liste.length) terminer(); else question();
        }, 220);
      }
      main.querySelectorAll('[data-choix]').forEach(function (bt) { bt.addEventListener('click', function () { repondre(Number(bt.getAttribute('data-choix'))); }); });
      controle = { touche: function (e, saisie) {
        if (saisie) return false;
        const k = '1234567'.indexOf(e.key) >= 0 ? Number(e.key) - 1 : LETTRES.indexOf(e.key.toUpperCase());
        if (k >= 0 && k < ordre.length) { repondre(ordre[k]); return true; }
        return false;
      } };
    }
    function terminer() {
      if (termine) return;
      termine = true;
      clearInterval(minuteurBoss);
      controle = null;
      let justes = 0;
      liste.forEach(function (q, k) {
        if (k >= reponses.length) return;   // non répondue faute de temps : comptée fausse, sans toucher au suivi du QCM
        const juste = !!q.choix[reponses[k]].ok;
        if (juste) justes++;
        noter(q, juste);
      });
      const med = P.jeu.enregistrerBoss(A.etat, b.id, justes, liste.length, A.aujourdhui(), mise || 0, b.nom);
      A.sauver();
      A.son(med === 'or' || med === 'argent' ? 'coffre' : med ? 'juste' : 'faux');
      const gagne = justes / liste.length >= b.seuilVictoire;
      const pct = Math.round(100 * justes / liste.length);
      const verdict = med === 'or' ? 'Médaille d’or. Écrasant.' : med === 'argent' ? 'Victoire : médaille d’argent.' : med === 'bronze' ? 'Médaille de bronze : pas encore une victoire (75 %).' : 'Défaite. Lis la correction, puis reviens.';
      main.innerHTML = '<p class="petit"><a href="#carriere">← Carrière</a></p><h1>' + o.echapper(b.nom) + ' : ' + pct + ' %</h1>' +
        '<div class="carte resultat-boss' + (med ? ' medaille-' + med : '') + '"><div class="chiffre">' + justes + ' / ' + liste.length + '</div><div class="legende">' + verdict +
        (reponses.length < liste.length ? ' Temps écoulé : ' + (liste.length - reponses.length) + ' question' + (liste.length - reponses.length > 1 ? 's' : '') + ' sans réponse.' : '') +
        (mise ? ' Mise : ' + (gagne ? '+' : '−') + Math.round(mise).toLocaleString('fr-FR') + ' € pour le desk.' : '') + '</div>' +
        '<div class="ligne" style="margin-top:12px"><a class="bouton principal" href="#qcm/boss=' + encodeURIComponent(b.id) + '" data-boss-rejouer>Rejouer</a><a class="bouton" href="#carriere">Carrière</a></div></div>' +
        '<h2>Correction</h2><ol class="correction-boss">' + liste.map(function (q, k) {
          const rep = k < reponses.length ? reponses[k] : -1;
          const bonne = q.choix.filter(function (c) { return c.ok; })[0];
          const juste = rep >= 0 && q.choix[rep].ok;
          return '<li class="' + (juste ? 'juste' : 'faux') + '"><div class="question">' + o.markdown(enonce(q)) + '</div>' +
            (juste ? '' : '<p class="petit"><strong>Ta réponse :</strong> ' + (rep >= 0 ? o.enLigne(q.choix[rep].t) + ' · ' + o.enLigne(q.choix[rep].pourquoi) : 'aucune (temps écoulé)') + '</p>') +
            '<p class="petit"><strong>' + (juste ? 'Juste : ' : 'Bonne réponse : ') + '</strong>' + o.enLigne(bonne.t) + ' · ' + o.enLigne(bonne.pourquoi) + '</p>' +
            '<p class="petit">' + source(q) + '</p>' + correction(q, false, true) + '</li>';
        }).join('') + '</ol>';
      racine.scrollTo(0, 0);
    }
    question();
  }

  function rendre(main, params) {
    controle = null;
    clearInterval(minuteurBoss);
    if (params.boss) return rendreBoss(main, params.boss);
    if (params.niveau && P.jeu2) {
      const ctx = A.contexteJeu();
      const niv = ctx && P.jeu2.niveauParId(ctx, params.niveau);
      if (niv) {
        const parId = {};
        toutes().forEach(function (q) { parId[q.id] = q; });
        // tirage pondéré : d'abord les questions ratées ou jamais vues du vivier, puis les autres
        const s = suivi();
        const vivier = o.melanger(Math.random, niv.vivier.slice()).sort(function (a, b) {
          const pa = s[a] ? (s[a].r ? 2 : 0) : 1, pb = s[b] ? (s[b].r ? 2 : 0) : 1;
          return pa - pb;
        });
        const ids = o.melanger(Math.random, vivier.slice(0, Math.min(vivier.length, niv.n + 4))).slice(0, niv.n);
        const camp = P.jeu2.campagne(A.etat, ctx);
        let numero = 0;
        camp.mondes.forEach(function (m) { m.niveaux.forEach(function (x) { if (x.id === niv.id) numero = x.numero; }); });
        return rendreSession(main, ids, { niveau: Object.assign({}, niv, { numero: numero }) });
      }
    }
    if (params.classee && P.jeu2) {
      const ctx = A.contexteJeu();
      const qs = ctx ? P.jeu2.questionsClassees(A.etat, ctx, params.classee, TAILLE, Math.random) : [];
      if (qs.length) return rendreSession(main, qs.map(function (q) { return q.id; }), { classee: params.classee });
    }
    if (params.s) return rendreSession(main, params.s.split(',').filter(Boolean));
    if (params.c) {
      const liste = tirer(duChapitre(params.c), TAILLE);
      if (liste.length) return rendreSession(main, liste.map(function (q) { return q.id; }));
    }
    rendreAccueil(main, params.par);
  }

  A.enregistrerVue({
    id: 'qcm', titre: 'QCM', court: 'QCM', icone: '✓', ordre: 5.2, rendre: rendre,
    touche: function (e, saisie) {
      if (controle && controle.touche(e, saisie)) e.preventDefault();
    }
  });
  P.qcm = { toutes: toutes, domaine: domaine, tirer: tirer, duChapitre: duChapitre, pointDeCours: pointDeCours, correction: correction };
})(this);
