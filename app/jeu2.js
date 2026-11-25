// Mode carrière, suite : campagne à niveaux (étoiles), usine du quant (production passive), classement Elo par domaine,
// collection de cartes. Module pur, branché sur jeu.js (Prepa.jeu) ; testé sous Node.
(function (racine) {
  'use strict';
  const J = (typeof module !== 'undefined' && module.exports) ? require('./jeu.js') : racine.Prepa.jeu;

  function graine(texte) {
    let h = 2166136261;
    for (let i = 0; i < texte.length; i++) { h ^= texte.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h;
  }
  function etatJeu(etat) {
    const j = etat.jeu && typeof etat.jeu === 'object' ? etat.jeu : (etat.jeu = {});
    ['niveaux', 'elo', 'usine'].forEach(function (k) { if (!j[k] || typeof j[k] !== 'object') j[k] = {}; });
    return j;
  }

  // =====================================================================================================================
  // Campagne : huit mondes qui racontent une candidature, de l'envoi du CV à l'offre. Chaque niveau est une courte série
  // de QCM (questions tirées à chaque partie dans le vivier du niveau) ; 1 étoile à 60 % débloque le suivant, 2 à 80 %,
  // 3 sans faute. Le dernier niveau d'un monde est son boss. Le contenu reste toujours accessible ailleurs : seule la
  // progression sur la carte est séquentielle.
  // =====================================================================================================================
  const MONDES = [
    { id: 'm1', titre: 'La candidature', chapitres: ['esperance-variance-covariance', 'denombrement-et-poisson'], enigmes: ['logique', 'nombres'],
      recit: 'Ton CV part ce soir. Avant la moindre réponse, on te jugera sur les bases : espérance, variance, dénombrement. Les recruteurs adorent les énigmes de logique pour trier vite.' },
    { id: 'm2', titre: 'Le test en ligne', chapitres: ['conditionnement-markov-martingales', 'lois-gaussiennes'], enigmes: ['probas', 'denombrement'],
      recit: 'Un courriel : « Merci pour votre candidature, voici un test de 60 minutes. » Probabilités conditionnelles, gaussiennes, temps d’attente : le filtre le plus sévère du processus.' },
    { id: 'm3', titre: 'L’appel du recruteur', chapitres: ['algebre-lineaire-covariances', 'statistiques-et-regression'], enigmes: ['pesees', 'recherche'],
      recit: 'Test réussi. Au téléphone, un quant te pose des questions de statistiques et te demande de raisonner à voix haute. Il veut entendre ta méthode.' },
    { id: 'm4', titre: 'Le premier entretien', chapitres: ['market-making-et-microstructure', 'risque-et-portefeuille'], enigmes: ['strategie', 'fermi'],
      recit: 'Premier entretien en face à face, sur un desk. On te demande de faire un marché, de miser, d’estimer. Le trader en face aime les réponses rapides et chiffrées.' },
    { id: 'm5', titre: 'L’entretien technique', chapitres: ['mouvement-brownien', 'integrale-et-lemme-ito', 'equations-differentielles-stochastiques'], enigmes: ['invariants'],
      recit: 'Le deuxième tour est mené par un quant de recherche. Tableau blanc, brownien, lemme d’Itô : il veut voir les démonstrations.' },
    { id: 'm6', titre: 'Le pricing', chapitres: ['arbitrage-et-risque-neutre', 'black-scholes', 'grecques-et-couverture', 'volatilite'], enigmes: ['geometrie', 'mouvement'],
      recit: 'L’équipe dérivés te reçoit. Risque-neutre, Black-Scholes, grecques, smile : le cœur du métier, sans filet.' },
    { id: 'm7', titre: 'Le superday', chapitres: ['options-exotiques', 'methodes-numeriques', 'taux-et-credit', 'energie-et-matieres-premieres', 'machine-learning', 'code-et-algorithmique'], enigmes: [],
      recit: 'Le superday : cinq entretiens d’affilée, avec des équipes différentes. Exotiques, numérique, taux, énergie, machine learning, code. Il faut tenir la distance.' },
    { id: 'm8', titre: 'L’offre', chapitres: ['entretiens'], enigmes: [],
      recit: 'Dernier entretien avec le responsable de l’équipe : motivation, projets, et un ultime test mêlant tout ce que tu as vu. Au bout, l’offre.' }
  ];
  const ETOILES_XP = 15;
  const MONDE_XP = 100;

  let cacheCampagne = null;
  function construireCampagne(ctx) {
    const cle = ctx.qcm.length + ':' + ctx.chapitres.length + ':' + ctx.fiches.length;
    if (cacheCampagne && cacheCampagne.cle === cle) return cacheCampagne.mondes;
    const parFiche = {};
    ctx.fiches.forEach(function (f) { parFiche[f.id] = f; });
    const parCible = {};
    ctx.qcm.forEach(function (q) { (parCible[q.cible] = parCible[q.cible] || []).push(q.id); });
    const chap = {};
    ctx.chapitres.forEach(function (c) { chap[c.id] = c; });
    const mondes = MONDES.map(function (m, im) {
      const niveaux = [];
      const vivierMonde = [];
      m.chapitres.forEach(function (cid) {
        const c = chap[cid];
        if (!c) return;
        const fiches = (c.fiches || []).map(function (id) { return parFiche[id]; }).filter(Boolean);
        let faciles = [], durs = [];
        fiches.forEach(function (f) {
          if (f.niveau >= 3) durs = durs.concat(parCible[f.id] || []); else faciles = faciles.concat(parCible[f.id] || []);
        });
        const cours = parCible['cours:' + cid] || [];
        // Bases : fiches de niveau 1 et 2 ; Approfondissement : niveau 3 et questions de cours (complété si trop court)
        const bases = faciles.slice();
        let avance = durs.concat(cours);
        if (avance.length < 8) avance = avance.concat(faciles.slice(0, 8 - avance.length));
        if (bases.length >= 5) niveaux.push({ id: cid + ':1', titre: c.titre, sous: 'Les bases', vivier: bases, n: 6 });
        if (avance.length >= 5) niveaux.push({ id: cid + ':2', titre: c.titre, sous: 'Approfondissement', vivier: avance, n: 6 });
        Array.prototype.push.apply(vivierMonde, bases.concat(avance));
      });
      m.enigmes.forEach(function (cat) {
        const ids = [];
        ctx.fiches.forEach(function (f) { if (f.categorie === cat) Array.prototype.push.apply(ids, parCible[f.id] || []); });
        if (ids.length >= 5) {
          niveaux.push({ id: 'ct:' + cat + ':1', titre: (ctx.categories || {})[cat] || cat, sous: 'Énigmes', vivier: ids, n: 6 });
          Array.prototype.push.apply(vivierMonde, ids);
        }
      });
      // ordre : alterner cours et énigmes pour varier, puis le boss du monde
      const cours = niveaux.filter(function (x) { return x.id.indexOf('ct:') !== 0; });
      const enig = niveaux.filter(function (x) { return x.id.indexOf('ct:') === 0; });
      const ordre = [];
      while (cours.length || enig.length) {
        if (cours.length) ordre.push(cours.shift());
        if (cours.length) ordre.push(cours.shift());
        if (enig.length) ordre.push(enig.shift());
      }
      const uniques = vivierMonde.filter(function (x, i) { return vivierMonde.indexOf(x) === i; });
      if (uniques.length >= 10) ordre.push({ id: m.id + ':boss', titre: 'Boss : ' + m.titre, sous: '10 questions mêlées', vivier: uniques, n: 10, boss: true });
      return { id: m.id, titre: m.titre, recit: m.recit, numero: im + 1, niveaux: ordre };
    });
    // numérotation continue
    let k = 0;
    mondes.forEach(function (m) { m.niveaux.forEach(function (n) { k++; n.numero = k; n.monde = m.id; }); });
    cacheCampagne = { cle: cle, mondes: mondes };
    return mondes;
  }
  function etoilesPour(score) { return score >= 1 ? 3 : score >= 0.8 ? 2 : score >= 0.6 ? 1 : 0; }
  function campagne(etat, ctx) {
    const jeu = etatJeu(etat);
    const mondes = construireCampagne(ctx);
    let precedentReussi = true, total = 0, etoiles = 0, prochain = null, mondesFinis = 0;
    const res = mondes.map(function (m) {
      let fini = true;
      const niveaux = m.niveaux.map(function (n) {
        const e = Number(jeu.niveaux[n.id]) || 0;
        const debloque = precedentReussi;
        precedentReussi = e >= 1;
        total++; etoiles += e;
        if (!e) fini = false;
        const x = Object.assign({}, n, { etoiles: e, debloque: debloque });
        if (debloque && !e && !prochain) prochain = x;
        return x;
      });
      if (fini && niveaux.length) mondesFinis++;
      return { id: m.id, titre: m.titre, recit: m.recit, numero: m.numero, niveaux: niveaux, fini: fini && niveaux.length > 0,
        etoiles: niveaux.reduce(function (s, n) { return s + n.etoiles; }, 0), etoilesMax: 3 * niveaux.length,
        debloque: niveaux.length ? niveaux[0].debloque : false };
    });
    // à défaut de niveau neuf : le premier niveau à moins de 3 étoiles
    if (!prochain) {
      res.some(function (m) { return m.niveaux.some(function (n) { if (n.debloque && n.etoiles < 3) { prochain = n; return true; } return false; }); });
    }
    return { mondes: res, total: total, etoiles: etoiles, etoilesMax: 3 * total, prochain: prochain, mondesFinis: mondesFinis,
      xp: etoiles * ETOILES_XP + mondesFinis * MONDE_XP };
  }
  function niveauParId(ctx, id) {
    let r = null;
    construireCampagne(ctx).some(function (m) { return m.niveaux.some(function (n) { if (n.id === id) { r = n; return true; } return false; }); });
    return r;
  }
  // Enregistre une partie ; renvoie { etoiles, record, nouveauMonde }.
  function terminerNiveau(etat, ctx, id, justes, total) {
    const jeu = etatJeu(etat);
    const e = etoilesPour(total ? justes / total : 0);
    const avant = Number(jeu.niveaux[id]) || 0;
    const avantCamp = campagne(etat, ctx);
    if (e > avant) jeu.niveaux[id] = e;
    const apres = campagne(etat, ctx);
    return { etoiles: e, record: e > avant, nouveauMonde: apres.mondesFinis > avantCamp.mondesFinis };
  }

  // =====================================================================================================================
  // Classement Elo par domaine. Chaque question a une cote fixe selon sa difficulté ; ta cote monte quand tu réussis une
  // question plus difficile que ton niveau, baisse quand tu rates une question plus facile. Les parties classées
  // choisissent des questions proches de ta cote : jamais trop faciles, jamais décourageantes.
  // =====================================================================================================================
  const LIGUES = [[0, 'Bronze'], [1050, 'Argent'], [1200, 'Or'], [1350, 'Platine'], [1500, 'Diamant'], [1650, 'Quant'], [1800, 'Légende']];
  function ligue(r) {
    let l = LIGUES[0][1], suivant = null;
    for (let i = 0; i < LIGUES.length; i++) {
      if (r >= LIGUES[i][0]) l = LIGUES[i][1];
      else { suivant = { cote: LIGUES[i][0], nom: LIGUES[i][1] }; break; }
    }
    return { nom: l, suivante: suivant };
  }
  function coteQuestion(q, ctx) {
    if (q.cible.indexOf('cours:') === 0) return 1250;
    const f = ctx.fiche ? ctx.fiche(q.cible) : null;
    const niv = f ? f.niveau || 1 : 2;
    return 1000 + 200 * (niv - 1) + (f && f.parent ? 50 : 0);
  }
  function coteJoueur(etat, domaine) {
    const x = etatJeu(etat).elo[domaine];
    return x ? { r: x.r, n: x.n } : { r: 1000, n: 0 };
  }
  function majElo(etat, ctx, q, juste) {
    const jeu = etatJeu(etat);
    const d = ctx.domaine(q);
    const j = coteJoueur(etat, d);
    const attendu = 1 / (1 + Math.pow(10, (coteQuestion(q, ctx) - j.r) / 400));
    const k = j.n < 30 ? 40 : 20;
    const delta = Math.round(k * ((juste ? 1 : 0) - attendu));
    jeu.elo[d] = { r: j.r + delta, n: j.n + 1, max: Math.max((jeu.elo[d] || {}).max || 1000, j.r + delta) };
    return { domaine: d, delta: delta, cote: j.r + delta };
  }
  // Questions d'une partie classée : proches de la cote, en évitant celles déjà réussies aujourd'hui.
  function questionsClassees(etat, ctx, domaine, n, aleatoire) {
    const r = coteJoueur(etat, domaine).r;
    const suivi = etat.qcm || {};
    const jour = ctx.jour;
    const l = ctx.qcm.filter(function (q) { return ctx.domaine(q) === domaine && !(suivi[q.id] && suivi[q.id].r && suivi[q.id].d === jour); })
      .map(function (q) { return { q: q, ecart: Math.abs(coteQuestion(q, ctx) + 60 - r) + 120 * aleatoire() }; })
      .sort(function (a, b) { return a.ecart - b.ecart; });
    return l.slice(0, n).map(function (x) { return x.q; });
  }

  // =====================================================================================================================
  // Collection : une carte par fiche maîtrisée (elle tient trois semaines). Rareté selon la difficulté. Sets par thème
  // et par famille de casse-têtes ; chaque quart de set rapporte de l'XP, le set complet davantage.
  // =====================================================================================================================
  const RARETES = { commune: 'Commune', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire' };
  function rarete(f, enfants) {
    if (f.niveau >= 3 && ((enfants[f.id] || 0) >= 2 || f.essentiel)) return 'legendaire';
    if (f.niveau >= 3) return 'epique';
    if (f.niveau === 2 || f.parent) return 'rare';
    return 'commune';
  }
  function collection(etat, ctx) {
    const cartes = etat.cartes || {};
    const enfants = {};
    ctx.fiches.forEach(function (f) { if (f.parent) enfants[f.parent] = (enfants[f.parent] || 0) + 1; });
    const sets = {};
    ctx.fiches.forEach(function (f) {
      const sid = f.categorie ? 'ct:' + f.categorie : f.theme;
      const nom = f.categorie ? ((ctx.categories || {})[f.categorie] || f.categorie) : ((ctx.themes || {})[f.theme] || f.theme);
      const s = sets[sid] || (sets[sid] = { id: sid, nom: nom, cartes: [], obtenues: 0 });
      const obtenue = ctx.maitrise(cartes[f.id]) >= 0.8;
      s.cartes.push({ id: f.id, titre: f.titre || null, niveau: f.niveau, rarete: rarete(f, enfants), obtenue: obtenue, categorie: f.categorie || null });
      if (obtenue) s.obtenues++;
    });
    let xp = 0, obtenues = 0, total = 0, complets = 0;
    const parRarete = { commune: 0, rare: 0, epique: 0, legendaire: 0 };
    const liste = Object.keys(sets).map(function (k) {
      const s = sets[k];
      const part = s.cartes.length ? s.obtenues / s.cartes.length : 0;
      s.paliers = Math.floor(part * 4);   // quarts atteints (0 à 4)
      s.complet = s.obtenues === s.cartes.length && s.cartes.length > 0;
      xp += 40 * Math.min(3, s.paliers) + (s.complet ? 200 : 0);
      if (s.complet) complets++;
      obtenues += s.obtenues; total += s.cartes.length;
      s.cartes.forEach(function (c) { if (c.obtenue) parRarete[c.rarete]++; });
      return s;
    });
    return { sets: liste, obtenues: obtenues, total: total, complets: complets, parRarete: parRarete, xp: xp };
  }

  // =====================================================================================================================
  // Usine du quant : une machine par chapitre du cours, reliée à ses prérequis par des convoyeurs. Elle produit du
  // capital en continu, même application fermée, selon la maîtrise des fiches du chapitre ; elle ralentit puis s'enraye
  // quand des révisions sont en retard (l'entretien de l'usine, c'est la répétition espacée). Le stock s'accumule
  // jusqu'à la capacité de l'entrepôt : il faut revenir le collecter.
  // =====================================================================================================================
  const ENTREPOT = [12, 18, 24, 36, 48];                 // heures de stockage par niveau d'entrepôt
  const PRIX_ENTREPOT = [0, 8000, 25000, 60000, 150000];
  function prixAmelioration(niveau) { return Math.round(3000 * Math.pow(1.8, niveau)); }
  function usine(etat, ctx, res, maintenant) {
    const jeu = etatJeu(etat);
    const u = jeu.usine;
    const cartes = etat.cartes || {};
    const parFiche = {};
    ctx.fiches.forEach(function (f) { parFiche[f.id] = f; });
    const competences = {};
    (res && res.competences || []).forEach(function (c) { competences[c.id] = c; });
    const ameliorations = u.ameliorations && typeof u.ameliorations === 'object' ? u.ameliorations : {};
    const machines = ctx.chapitres.filter(function (c) { return c.id !== 'mode-emploi'; }).map(function (c, i) {
      const fiches = (c.fiches || []).map(function (id) { return parFiche[id]; }).filter(Boolean);
      const vues = fiches.filter(function (f) { return cartes[f.id] && cartes[f.id].vu; });
      const dues = vues.filter(function (f) { return cartes[f.id].echeance && cartes[f.id].echeance <= ctx.jour; }).length;
      const maitrise = fiches.length ? fiches.reduce(function (s, f) { return s + ctx.maitrise(cartes[f.id]); }, 0) / fiches.length : 0;
      const efficacite = vues.length ? Math.max(0.1, 1 - 0.9 * Math.min(1, dues / Math.max(5, vues.length * 0.6))) : 0;
      const niveauAm = Number(ameliorations[c.id]) || 0;
      const base = 20 * (1 + 0.15 * (c.numero || i));
      const taux = vues.length ? Math.round(base * (0.15 + maitrise) * efficacite * Math.pow(1.5, niveauAm)) : 0;
      const etatMachine = !vues.length ? 'a-construire' : efficacite < 0.4 ? 'enrayee' : efficacite < 0.75 ? 'ralentie' : 'en-marche';
      return { id: c.id, titre: c.titre, numero: c.numero, partie: c.partie, taux: taux, dues: dues, maitrise: maitrise, efficacite: efficacite,
        etat: etatMachine, amelioration: niveauAm, prixAmelioration: prixAmelioration(niveauAm), prerequis: (competences[c.id] || {}).prerequis || [] };
    });
    const tauxHeure = machines.reduce(function (s, m) { return s + m.taux; }, 0);
    const niveauEntrepot = Math.min(ENTREPOT.length - 1, Number(u.entrepot) || 0);
    const capacite = ENTREPOT[niveauEntrepot];
    const derniere = Number(u.derniere) || 0;
    const heures = derniere ? Math.max(0, (maintenant - derniere) / 3600000) : 0;
    const stock = Math.round(tauxHeure * Math.min(heures, capacite));
    return { machines: machines, tauxHeure: tauxHeure, stock: stock, heures: heures, capacite: capacite, plein: heures >= capacite && derniere > 0,
      entrepot: niveauEntrepot, prixEntrepot: niveauEntrepot + 1 < ENTREPOT.length ? PRIX_ENTREPOT[niveauEntrepot + 1] : null,
      capaciteSuivante: niveauEntrepot + 1 < ENTREPOT.length ? ENTREPOT[niveauEntrepot + 1] : null, demarree: derniere > 0 };
  }
  function ajouterMouvement(etat, cle, date, montant, libelle) {
    const jeu = etat.jeu;
    const x = jeu.desk[cle];
    jeu.desk[cle] = { date: date, montant: (x ? x.montant : 0) + montant, libelle: libelle };
  }
  // Collecte le stock ; au premier appel, démarre l'usine. Renvoie le montant collecté.
  function collecter(etat, ctx, res, maintenant) {
    const jeu = etatJeu(etat);
    const u = usine(etat, ctx, res, maintenant);
    jeu.usine.derniere = maintenant;
    if (u.stock > 0) ajouterMouvement(etat, 'usine-' + ctx.jour, ctx.jour, u.stock, 'Production de l’usine');
    return u.stock;
  }
  // Achat avec le capital du desk ; renvoie true si l'achat a eu lieu.
  function acheter(etat, ctx, res, quoi, maintenant) {
    const jeu = etatJeu(etat);
    const capital = J.desk(etat).capital;
    const u = usine(etat, ctx, res, maintenant);
    let prix, libelle;
    if (quoi === 'entrepot') {
      if (u.prixEntrepot == null) return false;
      prix = u.prixEntrepot; libelle = 'Agrandissement de l’entrepôt';
    } else {
      const m = u.machines.filter(function (x) { return x.id === quoi; })[0];
      if (!m || m.etat === 'a-construire') return false;
      prix = m.prixAmelioration; libelle = 'Amélioration : ' + m.titre;
    }
    if (capital < prix) return false;
    // on collecte d'abord, pour que le nouveau taux ne s'applique pas rétroactivement
    collecter(etat, ctx, res, maintenant);
    if (quoi === 'entrepot') jeu.usine.entrepot = u.entrepot + 1;
    else {
      const am = jeu.usine.ameliorations && typeof jeu.usine.ameliorations === 'object' ? Object.assign({}, jeu.usine.ameliorations) : {};
      am[quoi] = (Number(am[quoi]) || 0) + 1;
      jeu.usine.ameliorations = am;
    }
    ajouterMouvement(etat, 'achat-' + ctx.jour + '-' + Object.keys(jeu.desk).length, ctx.jour, -prix, libelle);
    return true;
  }

  // Branchement sur le calcul de jeu.js : XP de la campagne (étoiles, mondes) et de la collection (sets)
  J.EXTENSIONS.push(function (etat, ctx, xp, ext) {
    ext.campagne = campagne(etat, ctx);
    ext.collection = collection(etat, ctx);
    xp.campagne = ext.campagne.xp;
    xp.collection = ext.collection.xp;
  });

  const api = {
    MONDES: MONDES, construireCampagne: construireCampagne, campagne: campagne, niveauParId: niveauParId, terminerNiveau: terminerNiveau,
    etoilesPour: etoilesPour, LIGUES: LIGUES, ligue: ligue, coteQuestion: coteQuestion, coteJoueur: coteJoueur, majElo: majElo,
    questionsClassees: questionsClassees, RARETES: RARETES, collection: collection, usine: usine, collecter: collecter, acheter: acheter,
    prixAmelioration: prixAmelioration, ENTREPOT: ENTREPOT, ETOILES_XP: ETOILES_XP, MONDE_XP: MONDE_XP
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { racine.Prepa = racine.Prepa || {}; racine.Prepa.jeu2 = api; }
})(this);
