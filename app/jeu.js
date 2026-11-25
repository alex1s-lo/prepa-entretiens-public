// Mode carrière : la préparation vue comme un jeu, sans jamais récompenser le remplissage.
//
// Principes :
// - tout est calculé à partir de la progression réelle (cartes de révision, QCM, cours, calcul, entretiens…) : l'historique
//   compte dès le premier affichage, et l'on ne peut pas « farmer » (répondre dix fois à la même question ne rapporte
//   qu'une fois ; la maîtrise durable rapporte plus que la découverte) ;
// - seuls les résultats datés qu'on ne peut pas recalculer sont gardés dans etat.jeu : quêtes accomplies, meilleurs
//   scores aux épreuves (boss), date d'obtention des succès ;
// - rien n'est jamais bloqué : les prérequis de l'arbre de compétences sont des recommandations.
// Module pur (aucun accès au DOM) : utilisable dans le navigateur et testé sous Node.
(function (racine) {
  'use strict';

  // --- Niveaux et rangs --------------------------------------------------------------------------------------------
  const NIVEAU_MAX = 40;
  // XP totale nécessaire pour atteindre le niveau n (niveau 1 à 0 XP) : croissance quadratique, jamais de mur.
  function seuil(n) { return 30 * n * (n - 1); }
  function niveauDe(xp) {
    let n = 1;
    while (n < NIVEAU_MAX && xp >= seuil(n + 1)) n++;
    return n;
  }
  const RANGS = [
    [1, 'Stagiaire'], [4, 'Analyste'], [8, 'Associate'], [12, 'Quant junior'], [17, 'Quant'],
    [22, 'Senior quant'], [27, 'Lead quant'], [32, 'Head of desk'], [37, 'Partner'], [40, 'Légende du desk']
  ];
  function rangDe(niveau) {
    let r = RANGS[0][1];
    RANGS.forEach(function (x) { if (niveau >= x[0]) r = x[1]; });
    return r;
  }
  function prochainRang(niveau) {
    for (let i = 0; i < RANGS.length; i++) if (RANGS[i][0] > niveau) return { niveau: RANGS[i][0], titre: RANGS[i][1] };
    return null;
  }

  // --- Barème (affiché dans l'écran Carrière : rien de caché) ----------------------------------------------------------
  const BAREME = {
    ficheVue: 4,           // par niveau de difficulté de la fiche, à la première révision
    ficheMaitrise: 20,     // par niveau de difficulté, proportionnel à la maîtrise (1 = tient trois semaines)
    qcmJuste: 4,           // question de QCM juste à la dernière tentative
    qcmCorrige: 4,         // bonus quand une question ratée un jour est maintenant juste
    chapitreLu: 25,
    exercice: 10,          // exercice du cours réussi
    demo: 15,              // démonstration incontournable maîtrisée
    calculParJuste: 1,     // par réponse juste en calcul mental (au plus 100 par session)
    entretienBlanc: 40,    // plus la moitié du score
    testEnLigne: 30,
    partieMarche: 15,
    partieKelly: 10,
    vraiEntretien: 150,    // entretien réel passé, noté dans le journal
    histoire: 20,          // réponse de parcours écrite (plus de 200 caractères)
    quete: 30,
    queteHebdo: 100,
    toutesQuetes: 30,
    boss: { bronze: 100, argent: 200, or: 350 }
  };

  // --- Outils -----------------------------------------------------------------------------------------------------
  function moyenne(l) { return l.length ? l.reduce(function (s, x) { return s + x; }, 0) / l.length : 0; }
  function graine(texte) {
    let h = 2166136261;
    for (let i = 0; i < texte.length; i++) { h ^= texte.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h;
  }
  function ajouterJours(jour, n) {
    const d = new Date(jour + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  // Lundi de la semaine du jour (AAAA-MM-JJ)
  function lundi(jour) {
    const d = new Date(jour + 'T12:00:00Z');
    const k = (d.getUTCDay() + 6) % 7;
    return ajouterJours(jour, -k);
  }
  function etatJeu(etat) {
    const j = etat.jeu && typeof etat.jeu === 'object' ? etat.jeu : (etat.jeu = {});
    ['quetes', 'boss', 'succes'].forEach(function (k) { if (!j[k] || typeof j[k] !== 'object') j[k] = {}; });
    return j;
  }
  function exerciceReussi(rec) {
    if (!rec) return false;
    if (typeof rec === 'string') return true;
    return rec.juste !== false;
  }
  function jourExercice(rec) {
    if (!rec) return null;
    return typeof rec === 'string' ? rec : rec.jour || null;
  }

  // --- Compétences : un chapitre du cours = une compétence ; plus une par famille de casse-têtes -------------------------
  // Prérequis recommandés (jamais bloquants), dans l'ordre du cours.
  const PREREQUIS = {
    'denombrement-et-poisson': ['esperance-variance-covariance'],
    'conditionnement-markov-martingales': ['esperance-variance-covariance'],
    'lois-gaussiennes': ['esperance-variance-covariance'],
    'algebre-lineaire-covariances': ['esperance-variance-covariance'],
    'statistiques-et-regression': ['lois-gaussiennes', 'algebre-lineaire-covariances'],
    'mouvement-brownien': ['lois-gaussiennes', 'conditionnement-markov-martingales'],
    'integrale-et-lemme-ito': ['mouvement-brownien'],
    'equations-differentielles-stochastiques': ['integrale-et-lemme-ito'],
    'arbitrage-et-risque-neutre': ['conditionnement-markov-martingales'],
    'black-scholes': ['equations-differentielles-stochastiques', 'arbitrage-et-risque-neutre'],
    'grecques-et-couverture': ['black-scholes'],
    'volatilite': ['grecques-et-couverture'],
    'options-exotiques': ['grecques-et-couverture'],
    'methodes-numeriques': ['black-scholes'],
    'taux-et-credit': ['arbitrage-et-risque-neutre'],
    'energie-et-matieres-premieres': ['black-scholes'],
    'risque-et-portefeuille': ['statistiques-et-regression'],
    'market-making-et-microstructure': ['conditionnement-markov-martingales'],
    'machine-learning': ['statistiques-et-regression']
  };
  const PALIERS = [0.15, 0.35, 0.55, 0.75, 0.9];  // score → niveau de compétence 1 à 5
  function niveauCompetence(score) {
    let n = 0;
    PALIERS.forEach(function (p) { if (score >= p) n++; });
    return n;
  }
  // Moyenne pondérée des composantes présentes (un chapitre sans exercices n'est pas pénalisé).
  function scorePondere(parts) {
    let s = 0, w = 0;
    parts.forEach(function (p) { if (p.present) { s += p.poids * p.valeur; w += p.poids; } });
    return w ? s / w : 0;
  }

  // --- Calcul complet -------------------------------------------------------------------------------------------------
  // ctx : { fiches, chapitres, qcm (questions), categories, themes, jour, maitrise(carte) → [0, 1] }
  function calculer(etat, ctx) {
    const jeu = etatJeu(etat);
    const cartes = etat.cartes || {};
    const suiviQcm = etat.qcm || {};
    const ec = etat.cours || {};
    const exercices = ec.exercices || {};
    const jour = ctx.jour;
    const parFiche = {};
    ctx.fiches.forEach(function (f) { parFiche[f.id] = f; });
    const qcmParCible = {};
    ctx.qcm.forEach(function (q) { (qcmParCible[q.cible] = qcmParCible[q.cible] || []).push(q); });

    // XP par source
    const xp = { fiches: 0, qcm: 0, cours: 0, entrainement: 0, carriere: 0, quetes: 0, boss: 0 };
    let fichesVues = 0, fichesMaitrisees = 0;
    ctx.fiches.forEach(function (f) {
      const c = cartes[f.id];
      if (!c || !c.vu) return;
      const m = ctx.maitrise(c);
      const niv = f.niveau || 1;
      fichesVues++;
      if (m >= 0.8) fichesMaitrisees++;
      xp.fiches += niv * (BAREME.ficheVue + BAREME.ficheMaitrise * m);
    });
    let qcmRepondues = 0, qcmJustes = 0, qcmCorriges = 0;
    ctx.qcm.forEach(function (q) {
      const s = suiviQcm[q.id];
      if (!s) return;
      qcmRepondues++;
      if (s.r) {
        qcmJustes++;
        xp.qcm += BAREME.qcmJuste;
        if ((s.n || 0) > (s.j || 0)) { qcmCorriges++; xp.qcm += BAREME.qcmCorrige; }
      }
    });
    const chapitresLus = ctx.chapitres.filter(function (c) { return (ec.lus || {})[c.id]; }).length;
    let exercicesReussis = 0;
    Object.keys(exercices).forEach(function (id) { if (exerciceReussi(exercices[id])) exercicesReussis++; });
    const demos = Object.keys(ec.demos || {}).length;
    xp.cours = chapitresLus * BAREME.chapitreLu + exercicesReussis * BAREME.exercice + demos * BAREME.demo;
    (etat.calcul || []).forEach(function (s) { xp.entrainement += Math.min(100, (s.justes || 0) * BAREME.calculParJuste); });
    (etat.entretiens || []).forEach(function (e) { xp.entrainement += BAREME.entretienBlanc + Math.round((e.score || 0) / 2); });
    xp.entrainement += (etat.tests || []).length * BAREME.testEnLigne + (etat.marche || []).length * BAREME.partieMarche +
      (etat.kelly || []).length * BAREME.partieKelly;
    const vraisEntretiens = (etat.journal || []).filter(function (e) { return e.passe || (e.date && e.date < jour); }).length;
    const histoires = Object.keys(etat.histoires || {}).filter(function (k) { return String(etat.histoires[k] || '').trim().length > 200; }).length;
    xp.carriere = vraisEntretiens * BAREME.vraiEntretien + histoires * BAREME.histoire;
    Object.keys(jeu.quetes).forEach(function (k) { xp.quetes += Number(jeu.quetes[k]) || 0; });
    Object.keys(jeu.boss).forEach(function (k) {
      const m = medaille(jeu.boss[k].meilleur || 0);
      if (m) xp.boss += BAREME.boss[m];
    });
    Object.keys(xp).forEach(function (k) { xp[k] = Math.round(xp[k]); });
    const total = Object.keys(xp).reduce(function (s, k) { return s + xp[k]; }, 0);
    const niveau = niveauDe(total);

    // Compétences
    const competences = ctx.chapitres.filter(function (c) { return c.id !== 'mode-emploi'; }).map(function (c) {
      const fichesC = (c.fiches || []).map(function (id) { return parFiche[id]; }).filter(Boolean);
      let qs = (qcmParCible['cours:' + c.id] || []).slice();
      (c.fiches || []).forEach(function (id) { qs = qs.concat(qcmParCible[id] || []); });
      const exIds = (c.exercices || []).map(function (x) { return x.id; });
      const parts = [
        { poids: 0.10, present: true, valeur: (ec.lus || {})[c.id] ? 1 : 0 },
        { poids: 0.25, present: exIds.length > 0, valeur: exIds.length ? exIds.filter(function (id) { return exerciceReussi(exercices[id]); }).length / exIds.length : 0 },
        { poids: 0.35, present: fichesC.length > 0, valeur: moyenne(fichesC.map(function (f) { return ctx.maitrise(cartes[f.id]); })) },
        { poids: 0.30, present: qs.length > 0, valeur: qs.length ? qs.filter(function (q) { return suiviQcm[q.id] && suiviQcm[q.id].r; }).length / qs.length : 0 }
      ];
      const score = scorePondere(parts);
      return { id: c.id, titre: c.titre, partie: c.partie, numero: c.numero, score: score, niveau: niveauCompetence(score),
        prerequis: PREREQUIS[c.id] || [], type: 'cours', nQcm: qs.length, nFiches: fichesC.length };
    });
    Object.keys(ctx.categories || {}).forEach(function (cat) {
      const l = ctx.fiches.filter(function (f) { return f.categorie === cat; });
      if (!l.length) return;
      const qs = [].concat.apply([], l.map(function (f) { return qcmParCible[f.id] || []; }));
      const score = scorePondere([
        { poids: 0.6, present: true, valeur: moyenne(l.map(function (f) { return ctx.maitrise(cartes[f.id]); })) },
        { poids: 0.4, present: qs.length > 0, valeur: qs.length ? qs.filter(function (q) { return suiviQcm[q.id] && suiviQcm[q.id].r; }).length / qs.length : 0 }
      ]);
      competences.push({ id: 'ct:' + cat, titre: ctx.categories[cat], partie: 'Casse-têtes', score: score, niveau: niveauCompetence(score),
        prerequis: [], type: 'casse-tete', categorie: cat, nFiches: l.length, nQcm: qs.length });
    });
    const parId = {};
    competences.forEach(function (c) { parId[c.id] = c; });
    competences.forEach(function (c) {
      // « recommandée » quand ses prérequis atteignent le niveau 2 ; rien n'est jamais bloqué
      c.prete = c.prerequis.every(function (p) { return !parId[p] || parId[p].niveau >= 2; });
    });

    const s = serie(etat, jour);
    const stats = {
      fichesVues: fichesVues, fichesMaitrisees: fichesMaitrisees, qcmRepondues: qcmRepondues, qcmJustes: qcmJustes,
      qcmCorriges: qcmCorriges, qcmTotal: ctx.qcm.length, chapitresLus: chapitresLus, chapitresTotal: ctx.chapitres.length,
      exercicesReussis: exercicesReussis, demos: demos, vraisEntretiens: vraisEntretiens, histoires: histoires,
      entretiensBlancs: (etat.entretiens || []).length, partiesMarche: (etat.marche || []).length, partiesKelly: (etat.kelly || []).length,
      meilleurCalcul: Math.max.apply(null, [0].concat((etat.calcul || []).map(function (x) { return x.justes || 0; }))),
      serie: s.serie, meilleureSerie: s.meilleure
    };
    const res = {
      xp: xp, total: total, niveau: niveau, rang: rangDe(niveau), prochainRang: prochainRang(niveau),
      seuilActuel: seuil(niveau), seuilSuivant: niveau < NIVEAU_MAX ? seuil(niveau + 1) : null,
      competences: competences, serie: s.serie, jokers: s.jokers, jokersUtilises: s.utilises, stats: stats
    };
    res.quetes = quetes(etat, ctx, res);
    res.boss = listeBoss(etat, ctx);
    res.succes = succes(etat, ctx, res);
    return res;
  }

  // --- Série avec jokers ----------------------------------------------------------------------------------------------
  // Un jour sans activité ne casse pas la série si un joker est disponible. On gagne un joker tous les 7 jours actifs
  // d'affilée (deux au plus en réserve). Aujourd'hui ne compte pas tant que la journée n'est pas finie.
  function actif(etat, j) {
    const x = (etat.jours || {})[j];
    return !!x && Object.keys(x).some(function (k) { return x[k] > 0; });
  }
  function serie(etat, jour) {
    const jours = Object.keys(etat.jours || {}).filter(function (j) { return actif(etat, j) && j <= jour; }).sort();
    if (!jours.length) return { serie: 0, jokers: 0, utilises: 0, meilleure: 0 };
    let n = 0, jokers = 0, utilises = 0, affilee = 0, meilleure = 0;
    for (let j = jours[0]; j <= jour; j = ajouterJours(j, 1)) {
      if (actif(etat, j)) {
        n++; affilee++;
        if (affilee % 7 === 0) jokers = Math.min(2, jokers + 1);
      } else if (j !== jour) {
        affilee = 0;
        if (n > 0 && jokers > 0) { jokers--; utilises++; } else { n = 0; utilises = 0; }
      }
      meilleure = Math.max(meilleure, n);
    }
    return { serie: n, jokers: jokers, utilises: utilises, meilleure: meilleure };
  }

  // --- Quêtes ---------------------------------------------------------------------------------------------------------
  // Trois quêtes par jour (la première est toujours la révision), choisies selon tes points faibles, et une quête de la
  // semaine. Les progrès se lisent dans ce que tu as fait aujourd'hui : aucune case à cocher.
  function quetes(etat, ctx, res) {
    const jeu = etatJeu(etat);
    const jour = ctx.jour;
    const aujourd = (etat.jours || {})[jour] || {};
    const suiviQcm = etat.qcm || {};
    const cartes = etat.cartes || {};
    const qcmDuJour = ctx.qcm.filter(function (q) { return suiviQcm[q.id] && suiviQcm[q.id].d === jour; });
    // compétence la plus faible parmi celles « prêtes » qui ont des questions
    const candidates = res.competences.filter(function (c) { return c.type === 'cours' && c.id !== 'entretiens' && c.prete && c.nQcm >= 5 && c.niveau < 5; })
      .sort(function (a, b) { return a.score - b.score || (a.numero || 0) - (b.numero || 0); });
    const faible = candidates[0] || null;
    const chapFaible = faible ? ctx.chapitres.filter(function (c) { return c.id === faible.id; })[0] : null;
    const ciblesFaible = chapFaible ? ['cours:' + chapFaible.id].concat(chapFaible.fiches || []) : [];
    const enigmesDuJour = ctx.fiches.filter(function (f) {
      const c = cartes[f.id];
      return f.categorie && c && c.derniere === jour && (c.notes || []).length <= 1;
    }).length;
    const exercicesDuJour = Object.keys((etat.cours || {}).exercices || {}).filter(function (id) {
      return jourExercice(etat.cours.exercices[id]) === jour;
    }).length;
    const pool = {
      'qcm-faible': faible ? {
        titre: 'Point faible : ' + faible.titre, detail: '10 questions de QCM sur ta compétence la plus faible',
        cible: 10, fait: qcmDuJour.filter(function (q) { return ciblesFaible.indexOf(q.cible) >= 0; }).length,
        lien: '#qcm/c=' + encodeURIComponent(faible.id)
      } : null,
      'enigme': { titre: 'Une énigme inédite', detail: 'Un casse-tête jamais vu, cherché à voix haute avant l’indice', cible: 1, fait: enigmesDuJour, lien: '#casse-tetes' },
      'calcul': { titre: 'Échauffement', detail: 'Une session de calcul mental', cible: 1,
        fait: (etat.calcul || []).filter(function (x) { return x.date === jour; }).length, lien: '#calcul' },
      'erreurs': { titre: 'Revanche', detail: 'Corriger 5 questions de QCM ratées auparavant', cible: 5,
        fait: qcmDuJour.filter(function (q) { const s = suiviQcm[q.id]; return s.r && s.n > s.j; }).length, lien: '#qcm' },
      'cours': { titre: 'Au tableau', detail: 'Faire 2 exercices du cours', cible: 2, fait: exercicesDuJour, lien: '#cours' },
      'marche': { titre: 'Sur le desk', detail: 'Une partie de market making', cible: 1,
        fait: (etat.marche || []).filter(function (x) { return x.date === jour; }).length, lien: '#marche' },
      'qcm': { titre: 'Pièges', detail: '15 questions de QCM, tous domaines', cible: 15, fait: qcmDuJour.length, lien: '#qcm' }
    };
    const aleatoire = ['qcm-faible', 'enigme', 'calcul', 'erreurs', 'cours', 'marche', 'qcm'].filter(function (k) { return pool[k]; });
    // la quête « revanche » n'a de sens que s'il reste des erreurs
    const erreursRestantes = ctx.qcm.filter(function (q) { return suiviQcm[q.id] && !suiviQcm[q.id].r; }).length;
    const possibles = aleatoire.filter(function (k) { return k !== 'erreurs' || erreursRestantes >= 5; });
    const h = graine(jour);
    const choisies = [];
    if (possibles.indexOf('qcm-faible') >= 0 && h % 3 !== 0) choisies.push('qcm-faible');
    let k = h;
    while (choisies.length < 2 && possibles.length > choisies.length) {
      const c = possibles[k % possibles.length];
      if (choisies.indexOf(c) < 0) choisies.push(c);
      k = Math.floor(k / 7) + 13;
    }
    const liste = [{ id: 'revisions', titre: 'Routine', detail: 'Réviser 15 questions (les dues d’abord)', cible: 15, fait: aujourd.revues || 0, lien: '#revisions' }]
      .concat(choisies.map(function (id) { return Object.assign({ id: id }, pool[id]); }));
    liste.forEach(function (q) {
      q.xp = BAREME.quete;
      q.cle = jour + ':' + q.id;
      q.reussie = q.fait >= q.cible || !!jeu.quetes[q.cle];
    });
    // quête de la semaine : un entretien blanc, ou une épreuve (boss), en alternance
    const debut = lundi(jour);
    const semainePaire = Math.floor(graine(debut) / 3) % 2 === 0;
    const hebdo = semainePaire ?
      { id: 'hebdo-entretien', titre: 'Grand oral de la semaine', detail: 'Un entretien blanc complet', cible: 1,
        fait: (etat.entretiens || []).filter(function (e) { return e.date >= debut && e.date <= jour; }).length, lien: '#entretien' } :
      { id: 'hebdo-boss', titre: 'Épreuve de la semaine', detail: 'Affronter une épreuve (boss) et obtenir au moins le bronze', cible: 1,
        fait: Object.keys(jeu.boss).filter(function (b) { const x = jeu.boss[b]; return x.dernierJour >= debut && medaille(x.dernierScore || 0); }).length,
        lien: '#carriere' };
    hebdo.xp = BAREME.queteHebdo;
    hebdo.cle = 'semaine-' + debut + ':' + hebdo.id;
    hebdo.reussie = hebdo.fait >= hebdo.cible || !!jeu.quetes[hebdo.cle];
    hebdo.hebdo = true;
    const bonus = { cle: jour + ':toutes', xp: BAREME.toutesQuetes, reussie: liste.every(function (q) { return q.reussie; }) };
    return { jour: liste, semaine: hebdo, bonus: bonus };
  }

  // --- Épreuves (boss) ------------------------------------------------------------------------------------------------
  function medaille(score) {
    return score >= 0.9 ? 'or' : score >= 0.75 ? 'argent' : score >= 0.6 ? 'bronze' : null;
  }
  const BOSS_NOMS = {
    probas: 'Le croupier', stats: 'L’économètre', stoch: 'Le brownien', derives: 'Le pricer', taux: 'La courbe',
    marches: 'Le teneur de marché', ml: 'Le modèle sur-ajusté', algo: 'Le compilateur', 'casse-tete': 'Le sphinx',
    constantes: 'Le calculateur', projets: 'Le contradicteur', fit: 'Le RH', cours: 'Le professeur', final: 'Le comité de recrutement'
  };
  function listeBoss(etat, ctx) {
    const jeu = etatJeu(etat);
    const parDomaine = {};
    ctx.qcm.forEach(function (q) { const d = ctx.domaine(q); parDomaine[d] = (parDomaine[d] || 0) + 1; });
    const ordre = ['cours'].concat(Object.keys(ctx.themes || {})).filter(function (d) { return parDomaine[d] >= 12; });
    const liste = ordre.map(function (d) {
      return { id: d, nom: BOSS_NOMS[d] || 'Le gardien', domaine: d, questions: 12, duree: 12 * 75, seuilVictoire: 0.75 };
    });
    liste.push({ id: 'final', nom: BOSS_NOMS.final, domaine: null, questions: 20, duree: 20 * 75, seuilVictoire: 0.8, final: true });
    liste.forEach(function (b) {
      const x = jeu.boss[b.id] || {};
      b.meilleur = x.meilleur || 0;
      b.tentatives = x.tentatives || 0;
      b.medaille = medaille(b.meilleur);
      b.vaincu = b.meilleur >= b.seuilVictoire;
    });
    return liste;
  }
  // Enregistre le résultat d'une épreuve ; renvoie la médaille obtenue (ou null).
  function enregistrerBoss(etat, id, justes, total, jour) {
    const jeu = etatJeu(etat);
    const score = total ? justes / total : 0;
    const x = jeu.boss[id] || { meilleur: 0, tentatives: 0 };
    jeu.boss[id] = { meilleur: Math.max(x.meilleur || 0, score), tentatives: (x.tentatives || 0) + 1, dernierScore: score, dernierJour: jour,
      premiere: x.premiere || jour };
    return medaille(score);
  }

  // --- Succès ---------------------------------------------------------------------------------------------------------
  // cache : le titre reste masqué tant que le succès n'est pas obtenu (la description donne un indice).
  const SUCCES = [
    { id: 'premier-pas', titre: 'Premier pas', desc: 'Réviser ta première fiche.', test: function (s) { return s.fichesVues >= 1; } },
    { id: 'centurion', titre: 'Centurion', desc: '100 fiches travaillées.', test: function (s) { return s.fichesVues >= 100; } },
    { id: 'encyclopedie', titre: 'Encyclopédie vivante', desc: '500 fiches travaillées.', test: function (s) { return s.fichesVues >= 500; } },
    { id: 'memoire-50', titre: 'Mémoire longue', desc: '50 fiches maîtrisées (elles tiennent trois semaines).', test: function (s) { return s.fichesMaitrisees >= 50; } },
    { id: 'memoire-200', titre: 'Mémoire d’éléphant', desc: '200 fiches maîtrisées.', test: function (s) { return s.fichesMaitrisees >= 200; } },
    { id: 'serie-7', titre: 'Une semaine pleine', desc: '7 jours d’affilée.', test: function (s) { return s.meilleureSerie >= 7; } },
    { id: 'serie-30', titre: 'Discipline', desc: '30 jours d’affilée.', test: function (s) { return s.meilleureSerie >= 30; } },
    { id: 'serie-100', titre: 'Machine', desc: '100 jours d’affilée.', test: function (s) { return s.meilleureSerie >= 100; } },
    { id: 'qcm-100', titre: 'Détecteur de pièges', desc: '100 questions de QCM répondues.', test: function (s) { return s.qcmRepondues >= 100; } },
    { id: 'qcm-500', titre: 'Démineur', desc: '500 questions de QCM répondues.', test: function (s) { return s.qcmRepondues >= 500; } },
    { id: 'qcm-tout', titre: 'Plus aucun piège', desc: 'Toutes les questions de QCM justes à la dernière tentative.', test: function (s) { return s.qcmTotal > 0 && s.qcmJustes >= s.qcmTotal; } },
    { id: 'revanche-50', titre: 'Esprit de revanche', desc: '50 questions de QCM ratées puis réussies.', test: function (s) { return s.qcmCorriges >= 50; } },
    { id: 'lecteur', titre: 'Lecteur assidu', desc: 'Tous les chapitres du cours lus.', test: function (s) { return s.chapitresTotal > 0 && s.chapitresLus >= s.chapitresTotal; } },
    { id: 'exercices-50', titre: 'Au tableau', desc: '50 exercices du cours réussis.', test: function (s) { return s.exercicesReussis >= 50; } },
    { id: 'demos', titre: 'CQFD', desc: '10 démonstrations incontournables maîtrisées.', test: function (s) { return s.demos >= 10; } },
    { id: 'calcul-60', titre: 'Calculette humaine', desc: '60 bonnes réponses dans une session de calcul mental.', test: function (s) { return s.meilleurCalcul >= 60; } },
    { id: 'oral-5', titre: 'Rodé à l’oral', desc: '5 entretiens blancs.', test: function (s) { return s.entretiensBlancs >= 5; } },
    { id: 'desk-10', titre: 'Teneur de marché', desc: '10 parties de market making.', test: function (s) { return s.partiesMarche >= 10; } },
    { id: 'kelly', titre: 'Bon parieur', desc: '5 parties de paris répétés (Kelly).', test: function (s) { return s.partiesKelly >= 5; } },
    { id: 'histoires', titre: 'Conteur', desc: '8 réponses de parcours écrites.', test: function (s) { return s.histoires >= 8; } },
    { id: 'vrai-entretien', titre: 'Baptême du feu', desc: 'Ton premier vrai entretien, noté dans le journal.', test: function (s) { return s.vraisEntretiens >= 1; } },
    { id: 'boss-1', titre: 'Premier boss', desc: 'Vaincre une épreuve.', test: function (s, r) { return r.boss.some(function (b) { return b.vaincu; }); } },
    { id: 'boss-or', titre: 'Médaille d’or', desc: 'Au moins 90 % à une épreuve.', test: function (s, r) { return r.boss.some(function (b) { return b.medaille === 'or'; }); } },
    { id: 'boss-tous', titre: 'Grand chelem', desc: 'Vaincre toutes les épreuves de domaine.', test: function (s, r) { return r.boss.filter(function (b) { return !b.final; }).every(function (b) { return b.vaincu; }); } },
    { id: 'boss-final', titre: 'Recruté', desc: 'Vaincre le comité de recrutement.', test: function (s, r) { return r.boss.some(function (b) { return b.final && b.vaincu; }); } },
    { id: 'competence-5', titre: 'Spécialiste', desc: 'Une compétence au niveau 5.', test: function (s, r) { return r.competences.some(function (c) { return c.niveau >= 5; }); } },
    { id: 'polyvalent', titre: 'Polyvalent', desc: 'Toutes les compétences du cours au niveau 3.', test: function (s, r) { return r.competences.filter(function (c) { return c.type === 'cours'; }).every(function (c) { return c.niveau >= 3; }); } },
    { id: 'niveau-10', titre: 'Dix niveaux', desc: 'Atteindre le niveau 10.', test: function (s, r) { return r.niveau >= 10; } },
    { id: 'niveau-25', titre: 'Vétéran', desc: 'Atteindre le niveau 25.', test: function (s, r) { return r.niveau >= 25; } },
    { id: 'legende', titre: 'Légende du desk', desc: 'Atteindre le niveau 40.', test: function (s, r) { return r.niveau >= 40; } },
    // succès cachés
    { id: 'curieux', titre: 'Curieux', cache: true, desc: 'Explorer une variante avant son problème d’origine.',
      test: function (s, r, etat, ctx) {
        const c = etat.cartes || {};
        return ctx.fiches.some(function (f) { return f.parent && c[f.id] && !c[f.parent]; });
      } },
    { id: 'monty', titre: 'J’aurais changé de porte', cache: true, desc: 'Juger « facile » le problème de Monty Hall.',
      test: function (s, r, etat) { const c = (etat.cartes || {})['proba-monty-hall']; return !!c && (c.notes || []).slice(-1)[0] === 3; } },
    { id: 'joker', titre: 'Sauvé par le gong', cache: true, desc: 'Un joker a sauvé ta série.', test: function (s, r) { return r.jokersUtilises > 0; } },
    { id: 'tenace', titre: 'Tenace', cache: true, desc: 'Retenter une épreuve perdue et la vaincre.',
      test: function (s, r) { return r.boss.some(function (b) { return b.vaincu && b.tentatives >= 2; }); } },
    { id: 'sphinx', titre: 'Plus malin que le sphinx', cache: true, desc: 'Toutes les familles de casse-têtes au niveau 3.',
      test: function (s, r) { const l = r.competences.filter(function (c) { return c.type === 'casse-tete'; }); return l.length > 0 && l.every(function (c) { return c.niveau >= 3; }); } }
  ];
  function succes(etat, ctx, res) {
    const jeu = etatJeu(etat);
    return SUCCES.map(function (x) {
      let ok = false;
      try { ok = !!x.test(res.stats, res, etat, ctx); } catch (e) { ok = false; }
      return { id: x.id, titre: x.titre, desc: x.desc, cache: !!x.cache, obtenu: ok || !!jeu.succes[x.id], date: jeu.succes[x.id] || null, nouveau: ok && !jeu.succes[x.id] };
    });
  }

  // --- Mise à jour à l'enregistrement --------------------------------------------------------------------------------
  // Fige ce qui vient d'être accompli (quêtes, succès) et renvoie les événements à annoncer.
  function mettreAJour(etat, ctx, avant) {
    const jeu = etatJeu(etat);
    let r = calculer(etat, ctx);
    const evenements = [];
    const quetesFaites = r.quetes.jour.concat([r.quetes.semaine]).filter(function (q) { return q.reussie && !jeu.quetes[q.cle]; });
    quetesFaites.forEach(function (q) { jeu.quetes[q.cle] = q.xp; evenements.push({ type: 'quete', titre: q.titre, xp: q.xp }); });
    if (r.quetes.bonus.reussie && !jeu.quetes[r.quetes.bonus.cle]) {
      jeu.quetes[r.quetes.bonus.cle] = r.quetes.bonus.xp;
      evenements.push({ type: 'quete', titre: 'Toutes les quêtes du jour', xp: r.quetes.bonus.xp });
    }
    if (evenements.length) r = calculer(etat, ctx);
    r.succes.filter(function (x) { return x.nouveau; }).forEach(function (x) {
      jeu.succes[x.id] = ctx.jour;
      evenements.push({ type: 'succes', titre: x.titre });
    });
    if (avant) {
      if (r.total > avant.total) evenements.unshift({ type: 'xp', xp: r.total - avant.total });
      if (r.niveau > avant.niveau) evenements.push({ type: 'niveau', niveau: r.niveau, rang: r.rang, nouveauRang: r.rang !== avant.rang });
    }
    return { resultat: r, evenements: evenements };
  }

  // nettoyage des quêtes anciennes (garde l'XP sous forme agrégée pour ne pas alourdir la progression)
  function compacter(etat, jour) {
    const jeu = etatJeu(etat);
    const limite = ajouterJours(jour, -60);
    let archive = Number(jeu.quetes['archive']) || 0;
    Object.keys(jeu.quetes).forEach(function (k) {
      if (k === 'archive') return;
      const d = k.indexOf('semaine-') === 0 ? k.slice(8, 18) : k.slice(0, 10);
      if (d < limite) { archive += Number(jeu.quetes[k]) || 0; delete jeu.quetes[k]; }
    });
    if (archive) jeu.quetes['archive'] = archive;
  }

  const api = {
    BAREME: BAREME, RANGS: RANGS, NIVEAU_MAX: NIVEAU_MAX, PALIERS: PALIERS, seuil: seuil, niveauDe: niveauDe, rangDe: rangDe,
    calculer: calculer, serie: serie, medaille: medaille, enregistrerBoss: enregistrerBoss, mettreAJour: mettreAJour,
    compacter: compacter, lundi: lundi, SUCCES: SUCCES
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { racine.Prepa = racine.Prepa || {}; racine.Prepa.jeu = api; }
})(this);
