// Accueil : le programme du jour, le prochain entretien, et la question du jour.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  // Fiche « du jour » : même fiche toute la journée, choisie parmi les questions de niveau 2 et 3 des profils visés.
  function ficheDuJour(jour) {
    const profils = A.etat.reglages.profils;
    const liste = A.banque().fiches.filter(function (f) {
      return f.niveau >= 2 && ['probas', 'casse-tete', 'stoch', 'derives', 'stats'].indexOf(f.theme) >= 0 && P.srs.pertinence(f, profils) > 0;
    });
    if (!liste.length) return null;
    let h = 0;
    for (let i = 0; i < jour.length; i++) h = (h * 31 + jour.charCodeAt(i)) >>> 0;
    return liste[h % liste.length];
  }

  // Cours : le premier chapitre pas encore lu (le mode d'emploi compte), ou une démonstration à refaire quand tout est lu.
  function tacheCours(etat, aujourd) {
    const chapitres = (racine.PREPA_COURS || { chapitres: [] }).chapitres;
    const lus = (etat.cours && etat.cours.lus) || {};
    const suivant = chapitres.filter(function (c) { return !lus[c.id]; })[0];
    const fait = (aujourd.cours || 0) > 0;
    // répétition espacée : les exercices et démonstrations dus passent avant le chapitre suivant
    const dus = P.cours && P.cours.aRefaire ? P.cours.aRefaire() : { exercices: [], demos: [] };
    const nEx = dus.exercices.length, nDem = dus.demos.length;
    if (nEx + nDem > 0) {
      const morceaux = [];
      if (nEx) morceaux.push(nEx + ' exercice' + (nEx > 1 ? 's' : ''));
      if (nDem) morceaux.push(nDem + ' démonstration' + (nDem > 1 ? 's' : ''));
      return { fait: false, titre: 'Cours', detail: morceaux.join(' et ') + ' à refaire (répétition espacée)', lien: '#cours', bouton: 'Refaire' };
    }
    return {
      fait: fait,
      titre: 'Cours',
      detail: fait ? 'Fait aujourd’hui' : suivant ? 'Chapitre ' + suivant.numero + ' : ' + suivant.titre + ' (une section, crayon en main, puis ses exercices)' :
        'Tous les chapitres sont lus : refais sans notes une des 15 démonstrations incontournables',
      lien: suivant ? '#cours/c=' + suivant.id : '#cours',
      bouton: 'Lire'
    };
  }

  function rendre(main) {
    const etat = A.etat;
    const jour = A.aujourdhui();
    const aujourd = etat.jours[jour] || {};
    const toutes = A.fiches();
    const dues = A.dues();
    const restantNeuves = Math.max(0, etat.reglages.nouveauxParJour - (aujourd.nouvelles || 0));
    const neuvesDispo = toutes.filter(function (f) { return !etat.cartes[f.id] && P.srs.pertinence(f, etat.reglages.profils) > 0; }).length;
    const aFaire = dues + Math.min(restantNeuves, neuvesDispo);
    const debutant = !Object.keys(etat.jours).length;
    const prochain = A.prochainEntretien();
    const calculFait = etat.calcul.some(function (s) { return s.date === jour; });
    const blancFait = etat.entretiens.some(function (s) { return s.date === jour; });
    const marcheFait = etat.marche.some(function (s) { return s.date === jour; });
    const histoiresManquantes = P.histoires.HISTOIRES.filter(function (h) { return !(etat.histoires[h.id] || '').trim(); });
    // entretien blanc un jour sur deux, market making l'autre (plus souvent si le profil prioritaire est le trading)
    const parite = o.ecartJours('2026-01-01', jour) % 2 === 0;
    const proposeMarche = etat.reglages.profils[0] === 'mm' || !parite;

    let html = '<h1>Aujourd’hui</h1><p class="doux">' + o.dateLisible(jour) + '</p>';

    if (debutant && !etat.reglages.guideMasque) {
      html += '<div class="carte carte-mise-en-avant"><div class="ligne"><h2 style="margin:0">Par où commencer</h2><span class="espace"></span><button class="discret" data-masquer-guide>Masquer</button></div><ol class="etapes">' +
        '<li><a href="#reglages">Réglages</a> : choisis le type de poste que tu vises en priorité et complète ton profil.</li>' +
        '<li><a href="#revisions">Révisions</a> : fais ta première session (15 questions). Réponds à voix haute avant de regarder la solution.</li>' +
        '<li><a href="#calcul">Calcul mental</a> : un sprint de 2 minutes pour connaître ton niveau de départ.</li>' +
        '<li><a href="#cours">Cours</a> : lis le mode d’emploi, puis le chapitre 1 (espérance, variance, covariance), le plus rentable pour les entretiens.</li>' +
        '<li><a href="#histoires">Mes histoires</a> : écris ta réponse à « Présente-toi ».</li>' +
        '<li><a href="#guides">Guides</a> : lis « Comment répondre à une question technique » et le plan de préparation.</li></ol>' +
        '<p class="legende" style="margin-top:14px">Ta progression reste dans ce navigateur. Pense à l’exporter de temps en temps (Réglages).</p></div>';
    }

    if (prochain) {
      const n = o.ecartJours(jour, prochain.date);
      html += '<div class="carte" style="border-left:4px solid var(--accent)"><div class="ligne"><div><div class="bloc-titre" style="margin-top:0">Prochain entretien</div>' +
        '<h2 style="margin:0">' + o.echapper(prochain.entreprise) + ' · ' + (n === 0 ? 'aujourd’hui' : n === 1 ? 'demain' : 'dans ' + n + ' jours') + '</h2>' +
        '<p class="petit doux" style="margin:0">' + o.echapper(prochain.type || '') + (prochain.poste ? ' · ' + o.echapper(prochain.poste) : '') + '</p></div><span class="espace"></span>' +
        '<a class="bouton principal" href="#journal">Liste de préparation</a></div></div>';
    }

    const taches = [
      { fait: aFaire === 0 && (aujourd.revues || 0) > 0, titre: 'Révisions', detail: aFaire ? aFaire + ' question' + (aFaire > 1 ? 's' : '') + ' (' + dues + ' à revoir, ' + Math.min(restantNeuves, neuvesDispo) + ' nouvelles)' : ((aujourd.revues || 0) ? 'Fait : ' + aujourd.revues + ' questions aujourd’hui' : 'Rien de prévu'), lien: '#revisions', bouton: 'Réviser' },
      { fait: calculFait, titre: 'Calcul mental', detail: calculFait ? 'Fait aujourd’hui' : 'Un sprint de 2 minutes, ou le test de 80 questions', lien: '#calcul', bouton: 'S’entraîner' },
      tacheCours(etat, aujourd),
      proposeMarche ?
        { fait: marcheFait, titre: 'Market making', detail: marcheFait ? 'Fait aujourd’hui' : 'Une ou deux parties sur la somme de dés', lien: '#marche', bouton: 'Jouer' } :
        { fait: blancFait, titre: 'Entretien blanc', detail: blancFait ? 'Fait aujourd’hui' : 'Un entretien court, à voix haute', lien: '#entretien', bouton: 'Commencer' }
    ];
    const essentiels = toutes.filter(function (x) { return x.essentiel; });
    const me = A.maitriseMoyenne(essentiels);
    if (essentiels.length && me < 0.8) {
      taches.push({ fait: false, titre: 'Les essentiels', detail: Math.round(100 * me) + ' % maîtrisés : les ' + essentiels.length + ' questions les plus fréquentes, à connaître en priorité', lien: '#revisions/onglet=themes/theme=essentiels/mode=libre', bouton: 'Réviser' });
    }
    // casse-tête du jour : une énigme jamais vue (une variante seulement après son problème d'origine), la même toute la journée
    const enigmes = toutes.filter(function (x) { return x.categorie && !etat.cartes[x.id] && (!x.parent || etat.cartes[x.parent]); });
    const enigmeFaite = toutes.some(function (x) { return x.categorie && etat.cartes[x.id] && etat.cartes[x.id].derniere === jour; });
    if (enigmes.length || enigmeFaite) {
      let h = 0;
      for (let i = 0; i < jour.length; i++) h = (h * 33 + jour.charCodeAt(i)) >>> 0;
      const e = enigmes.length ? enigmes[h % enigmes.length] : null;
      taches.push({ fait: enigmeFaite, titre: 'Casse-tête du jour', detail: enigmeFaite ? 'Fait aujourd’hui' : o.sansTex(e.titre) + ' (jamais vu)',
        lien: enigmeFaite ? '#casse-tetes' : '#casse-tetes/f=' + encodeURIComponent(e.id), bouton: 'Chercher' });
    }
    // QCM : une session de 10 par jour, en commençant par les erreurs passées
    if (P.qcm && P.qcm.toutes().length) {
      const qcmJour = (etat.jours[jour] && etat.jours[jour].qcm) || 0;
      const erreurs = P.qcm.toutes().filter(function (q) { return etat.qcm && etat.qcm[q.id] && !etat.qcm[q.id].r; }).length;
      taches.push({ fait: qcmJour >= 10, titre: 'QCM', detail: qcmJour >= 10 ? qcmJour + ' questions aujourd’hui' :
        (erreurs ? erreurs + ' erreur' + (erreurs > 1 ? 's' : '') + ' à retravailler, puis des questions jamais vues' : '10 questions à choix multiples, pièges expliqués'),
        lien: '#qcm', bouton: 'Commencer' });
    }
    if (histoiresManquantes.length) {
      taches.push({ fait: false, titre: 'Mes histoires', detail: 'À écrire : « ' + histoiresManquantes[0].titre + ' »' + (histoiresManquantes.length > 1 ? ' (+' + (histoiresManquantes.length - 1) + ')' : ''), lien: '#histoires', bouton: 'Écrire' });
    }
    // mode carrière : niveau, progression et quêtes du jour
    const rj = A.jeuActif() ? A.resultatJeu() : null;
    if (rj) {
      const partXp = rj.seuilSuivant ? (rj.total - rj.seuilActuel) / (rj.seuilSuivant - rj.seuilActuel) : 1;
      const qf = rj.quetes.jour.filter(function (q) { return q.reussie; }).length;
      const suite = rj.prochaine;
      html += '<div class="carte bandeau-carriere"><a class="bandeau-niveau" href="#carriere" title="Ma carrière">' + rj.niveau + '</a>' +
        '<a class="bandeau-texte" href="#carriere"><b>' + o.echapper(rj.rang) + '</b><span class="barre barre-xp"><span style="width:' + Math.round(100 * partXp) + '%"></span></span>' +
        '<span class="legende">' + (rj.seuilSuivant ? (rj.seuilSuivant - rj.total).toLocaleString('fr-FR') + ' XP avant le niveau ' + (rj.niveau + 1) : 'Niveau maximal') + ' · quêtes ' + qf + ' / ' + rj.quetes.jour.length +
        (rj.serie ? ' · série ' + rj.serie + ' j' : '') + (function () {
          if (!P.jeu2) return '';
          const u = P.jeu2.usine(A.etat, A.contexteJeu(), rj, Date.now());
          return u.demarree && u.stock > 0 ? ' · <strong>usine : ' + Math.round(u.stock).toLocaleString('fr-FR') + ' € à collecter' + (u.plein ? ' (entrepôt plein)' : '') + '</strong>' : '';
        })() + '</span></a>' +
        (suite ? '<a class="bouton principal continuer" href="' + suite.lien + '"><span class="continuer-libelle">Continuer</span><span class="continuer-titre">' + o.echapper(suite.titre) + '</span></a>' : '') + '</div>';
    }
    const restantes = taches.filter(function (t) { return !t.fait; }).length;
    const premiere = taches.filter(function (t) { return !t.fait; })[0];
    const coche = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
    html += '<div class="carte"><div class="entete-carte"><h2>Programme du jour</h2><span class="legende">' +
      (restantes ? restantes + ' sur ' + taches.length + ' à faire' : 'Tout est fait') + '</span></div><ul class="liste-fiches taches">' + taches.map(function (t) {
      return '<li class="tache' + (t.fait ? ' faite' : '') + '"><span class="tache-etat" title="' + (t.fait ? 'Fait' : 'À faire') + '">' + (t.fait ? coche : '') + '</span>' +
        '<span class="tache-texte"><span class="tache-titre">' + o.echapper(t.titre) + '</span><span class="tache-detail">' + o.echapper(t.detail) + '</span></span>' +
        '<a class="bouton' + (t === premiere ? ' principal' : '') + '" href="' + t.lien + '">' + t.bouton + '</a></li>';
    }).join('') + '</ul></div>';

    const f = ficheDuJour(jour);
    if (f) {
      html += '<div class="carte"><div class="entete-carte"><h2>Question du jour</h2></div><div class="ligne petit" style="margin-bottom:12px">' + P.composants.etiquettes(f) + '</div>' +
        '<div class="question">' + o.markdown(f.question) + '</div><div style="margin-top:16px"><a class="bouton" href="#revisions/fiche=' + encodeURIComponent(f.id) + '">Y répondre</a></div></div>';
    }

    const vues = toutes.filter(function (x) { return etat.cartes[x.id]; }).length;
    const prev = P.srs.previsions(toutes, etat.cartes, jour, 7);
    html += '<div class="grille"><div class="carte"><div class="chiffre">' + A.serie() + ' j</div><div class="legende">série d’entraînement</div></div>' +
      '<div class="carte"><div class="chiffre">' + vues + '</div><div class="legende">questions travaillées sur ' + toutes.length + '</div></div>' +
      '<div class="carte"><div class="legende" style="margin-bottom:6px">Révisions prévues cette semaine</div><div class="histogramme" style="height:50px">' +
      prev.map(function (v) { const m = Math.max.apply(null, prev.concat([1])); return '<span class="' + (v ? '' : 'vide') + '" style="height:' + Math.max(4, Math.round(100 * v / m)) + '%" title="' + v + '"></span>'; }).join('') +
      '</div><div class="axe"><span>auj.</span><span></span><span></span><span></span><span></span><span></span><span>+6</span></div></div></div>';
    main.innerHTML = html;
    const mg = main.querySelector('[data-masquer-guide]');
    if (mg) mg.addEventListener('click', function () { etat.reglages.guideMasque = true; A.sauver(); mg.closest('.carte').remove(); });
  }

  A.enregistrerVue({ id: 'accueil', titre: 'Aujourd’hui', court: 'Accueil', icone: '⌂', ordre: 1, rendre: rendre });
})(this);
