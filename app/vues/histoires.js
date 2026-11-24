// Mes histoires : les réponses de parcours et de motivation, écrites une fois, répétées à voix haute avec un chrono.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  const HISTOIRES = [
    { id: 'pitch', en: 'Tell me about yourself.', titre: 'Présente-toi', cible: 75,
      consigne: 'La première question de presque tous les entretiens, et la seule que tu peux préparer mot pour mot. 60 à 90 secondes, trois temps : ' +
        'qui tu es (formation, ce qui t’a amené aux maths financières), ce que tu as fait (stage actuel, projets : une phrase chacun, avec un résultat), ' +
        'ce que tu cherches et pourquoi chez eux (stage de césure de 5 à 6 mois en quant à partir de [mois de début]). Termine sur une porte ouverte vers un projet.',
      modele: 'Je suis en [année] à [école], dans [parcours], où je suis la mention [à compléter].\n' +
        'En ce moment, je suis en stage actuel jusqu’à [mois de fin] : [une phrase sur le sujet et ce que tu y fais].\n' +
        'À côté, j’ai construit trois projets quant en Python : [une phrase, le plus parlant pour CE poste].\n' +
        'Je cherche un stage de césure de cinq à six mois à partir de [mois de début], en [recherche / pricing / strats], parce que [raison concrète].' },
    { id: 'pourquoi-quant', en: 'Why quantitative finance?', titre: 'Pourquoi la finance quantitative ?', cible: 60,
      consigne: 'Évite « j’aime les maths et la finance » : tout le monde le dit. Donne un déclic concret (un cours, un problème, un projet), ' +
        'ce qui te plaît dans le travail réel (modéliser, tester sur des données, avoir un retour rapide du marché), et une preuve que tu l’as déjà fait.' },
    { id: 'pourquoi-maison', en: 'Why us?', titre: 'Pourquoi nous ?', cible: 45,
      consigne: 'À adapter à chaque entreprise (garde tes notes par entreprise dans le Journal). Trois éléments : ce que fait l’équipe (lu dans l’annonce, ' +
        'leur site, leurs publications), le lien avec ce que tu as fait, et ce que tu veux y apprendre. Une banque, un fonds et un teneur de marché ' +
        'n’attendent pas la même réponse.' },
    { id: 'stage', en: 'Tell me about your current internship.', titre: 'Ton stage actuel', cible: 90,
      consigne: 'Méthode STAR : Situation (l’équipe, l’enjeu), Tâche (ce qu’on t’a confié), Action (ce que TU as fait, avec les outils), ' +
        'Résultat (un chiffre si possible), puis ce que tu en retiens pour un poste quant. Prépare une version de 30 secondes et une de 2 minutes : on te ' +
        'demandera souvent de détailler.', modele: 'Situation : \nTâche : \nAction : \nRésultat : \nCe que j’en retiens pour ce poste : ' },
    { id: 'projet', en: 'Tell me about the project you are most proud of.', titre: 'Le projet dont tu es le plus fier', cible: 120,
      consigne: 'Choisis celui qui colle au poste : surface de vol (banque, pricing), stat arb (hedge fund, recherche), market making (trading). ' +
        'Raconte le problème, ta démarche, ce qui n’a pas marché au début et comment tu l’as diagnostiqué, et la limite principale. ' +
        'Un intervieweur retient mieux un échec bien analysé qu’un résultat parfait.' },
    { id: 'ia', en: 'Did you use AI for these projects?', titre: '« Tu as fait ces projets avec une IA ? »', cible: 45,
      consigne: 'La question viendra, peut-être pas en ces termes. Réponds franchement et sans te justifier trop longtemps : ce que l’IA a fait, ' +
        'ce que toi tu as fait (relire, lancer, modifier, casser, comprendre chaque choix), et une preuve immédiate : propose d’expliquer n’importe ' +
        'quelle ligne. N’écris ici que ce qui est vrai : tout se vérifie en deux questions.' },
    { id: 'echec', en: 'Tell me about a failure.', titre: 'Un échec ou une difficulté', cible: 75,
      consigne: 'Un vrai échec, pas un faux défaut. Ce qui s’est passé, ta part de responsabilité, ce que tu as changé ensuite. ' +
        'Le premier réglage du projet stat arb (Sharpe nul, comparaisons multiples) peut servir si tu l’as vraiment vécu.' },
    { id: 'equipe', en: 'Tell me about a disagreement with a teammate.', titre: 'Travail en équipe, désaccord', cible: 75,
      consigne: 'Une situation précise (projet d’école, stage, association, sport) : le désaccord, comment tu as argumenté avec des faits, ' +
        'comment ça s’est fini. Montre que tu sais changer d’avis face à de meilleurs arguments.' },
    { id: 'qualites', en: 'What are your strengths and weaknesses?', titre: 'Qualités et défauts', cible: 45,
      consigne: 'Deux qualités prouvées par un exemple chacune. Un défaut réel mais gérable, avec ce que tu fais pour le corriger.' },
    { id: 'cesure', en: 'Why a gap year, and what comes next?', titre: 'Pourquoi une césure, et après ?', cible: 45,
      consigne: 'Explique le calendrier sans t’excuser : stage actuel jusqu’à sa date de fin, puis 5 à 6 mois en quant à partir de [mois de début], ' +
        'avant [la suite de ta formation]. Dis ce que la césure t’apporte et ce que tu vises ensuite (stage de fin d’études, premier poste).' },
    { id: 'plan-b', en: 'Why not data science or trading?', titre: '« Pourquoi pas data science, ou trading ? »', cible: 45,
      consigne: 'Tu candidates aussi en data science et en trading : sois prêt à expliquer la cohérence. Le fil rouge (modéliser des données ' +
        'bruitées et décider sous incertitude) et ce qui te fait préférer le poste en face de toi.' },
    { id: 'marche', en: 'Tell me about a market topic you follow.', titre: 'Un sujet de marché que tu suis', cible: 90,
      consigne: 'Choisis un sujet que tu suis vraiment depuis quelques semaines (taux, volatilité, une classe d’actifs). Donne une thèse, le mécanisme, ' +
        'les chiffres clés (niveau approximatif, sens), et ce qui te ferait changer d’avis. Mets-le à jour chaque semaine avant tes entretiens.' },
    { id: 'questions', en: 'Do you have any questions for us?', titre: 'Mes questions à poser', cible: 30,
      consigne: 'Trois à cinq questions qui montrent ta curiosité pour le travail réel : comment se passe une journée, comment un stagiaire est évalué, ' +
        'quel projet a fait un ancien stagiaire, comment une idée passe de la recherche à la production, quels outils (langages, données). ' +
        'Évite le salaire et ce qui est écrit sur le site.' }
  ];

  const MOTS_PAR_SECONDE = 2.4; // ~145 mots par minute à l'oral

  let chrono = null;

  function rendre(main) {
    const etat = A.etat;
    const remplies = HISTOIRES.filter(function (h) { return (etat.histoires[h.id] || '').trim().length > 40; }).length;
    const remplissesEn = HISTOIRES.filter(function (h) { return (etat.histoires[h.id + ':en'] || '').trim().length > 40; }).length;
    main.innerHTML = '<h1>Mes histoires</h1><div class="carte"><p>Les questions de parcours et de motivation se préparent à l’avance. ' +
      'Écris tes réponses ici, en phrases parlées (pas en style CV), puis répète-les à voix haute avec le chrono jusqu’à les dire sans lire. ' +
      'Tout reste dans ton navigateur.</p><p class="legende">' + remplies + ' sur ' + HISTOIRES.length + ' rédigées en français, ' + remplissesEn + ' en anglais. Beaucoup d’entretiens se déroulent en anglais, même à Paris : prépare au moins « Présente-toi » et « Pourquoi la finance quantitative ? » dans les deux langues.</p>' +
      '<div class="ligne"><button data-exporter>Exporter en texte</button><button data-imprimer' + (A.restreint ? ' hidden' : '') + '>Imprimer</button></div></div>' +
      HISTOIRES.map(function (h) {
        const texte = etat.histoires[h.id] || '';
        return '<details class="carte" data-histoire="' + h.id + '"><summary>' + o.echapper(h.titre) +
          ' <span class="etiquette" data-statut></span></summary>' +
          '<p class="petit doux">' + o.echapper(h.consigne) + '</p>' +
          '<div class="onglets" role="tablist" style="margin-bottom:8px"><button role="tab" type="button" aria-selected="true" data-langue-histoire="fr">Français</button>' +
          '<button role="tab" type="button" aria-selected="false" data-langue-histoire="en">English</button></div>' +
          '<p class="petit" data-titre-en hidden><b>« ' + o.echapper(h.en || '') + ' »</b> Your answer in English, as you would say it.</p>' +
          '<textarea data-texte aria-label="' + o.echapper(h.titre) + '" placeholder="' + o.echapper(h.modele || 'Ta réponse, comme tu la dirais à l’oral…') + '" style="min-height:9em">' + o.echapper(texte) + '</textarea>' +
          '<div class="ligne petit"><span data-compte></span><span class="espace"></span>' +
          (h.modele ? '<button class="discret" data-modele>Partir du modèle</button>' : '') +
          '<button data-repeter>Répéter à voix haute</button><span class="chrono" data-chrono hidden></span></div></details>';
      }).join('');
    main.querySelectorAll('[data-histoire]').forEach(function (bloc) {
      const h = HISTOIRES.filter(function (x) { return x.id === bloc.getAttribute('data-histoire'); })[0];
      const zone = bloc.querySelector('[data-texte]');
      let langue = 'fr';
      const cle = function () { return langue === 'en' ? h.id + ':en' : h.id; };
      const statut = function () {
        const fr = (etat.histoires[h.id] || '').trim().length > 40;
        const en = (etat.histoires[h.id + ':en'] || '').trim().length > 40;
        const st = bloc.querySelector('[data-statut]');
        st.textContent = fr || en ? 'rédigée' + (fr && en ? ' · FR + EN' : fr ? ' · FR' : ' · EN') : 'à écrire';
        st.className = 'etiquette ' + (fr || en ? 'succes' : '');
      };
      bloc.querySelectorAll('[data-langue-histoire]').forEach(function (b) {
        b.addEventListener('click', function () {
          langue = b.getAttribute('data-langue-histoire');
          bloc.querySelectorAll('[data-langue-histoire]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
          bloc.querySelector('[data-titre-en]').hidden = langue !== 'en';
          const bm = bloc.querySelector('[data-modele]');
          if (bm) bm.hidden = langue === 'en';
          zone.value = etat.histoires[cle()] || '';
          zone.placeholder = langue === 'en' ? 'Your answer, as you would say it out loud…' : (h.modele || 'Ta réponse, comme tu la dirais à l’oral…');
          compte();
          zone.focus();
        });
      });
      const compte = function () {
        const mots = (zone.value.match(/\S+/g) || []).length;
        const s = Math.round(mots / MOTS_PAR_SECONDE);
        bloc.querySelector('[data-compte]').textContent = mots + ' mots · environ ' + o.duree(s) + ' à l’oral (cible ' + o.duree(h.cible) + ')' +
          (s > h.cible * 1.4 ? ' : trop long, coupe' : '');
        statut();
      };
      zone.addEventListener('input', function () {
        if (zone.value.trim()) etat.histoires[cle()] = zone.value; else delete etat.histoires[cle()];
        A.sauver();
        compte();
      });
      compte();
      const m = bloc.querySelector('[data-modele]');
      if (m) m.addEventListener('click', function () {
        const remplacer = function () {
          zone.value = h.modele;
          zone.dispatchEvent(new Event('input'));
          zone.focus();
        };
        if (zone.value.trim()) A.confirmer('Remplacer ton texte par le modèle ?', 'Remplacer', remplacer);
        else remplacer();
      });
      bloc.querySelector('[data-repeter]').addEventListener('click', function (e) {
        const bouton = e.target;
        const aff = bloc.querySelector('[data-chrono]');
        if (chrono && chrono.bloc === bloc) {
          clearInterval(chrono.id);
          const s = (Date.now() - chrono.debut) / 1000;
          A.toast('Durée : ' + o.duree(s) + (s > h.cible * 1.3 ? ' — un peu long, vise ' + o.duree(h.cible) : s < h.cible * 0.5 ? ' — un peu court, développe' : ' — bonne durée'));
          A.noterActivite('histoires');
          A.sauver();
          bouton.textContent = 'Répéter à voix haute';
          chrono = null;
          return;
        }
        if (chrono) { clearInterval(chrono.id); chrono.bouton.textContent = 'Répéter à voix haute'; }
        chrono = { bloc: bloc, bouton: bouton, debut: Date.now() };
        bouton.textContent = 'Terminé';
        aff.hidden = false;
        chrono.id = setInterval(function () {
          if (!aff.isConnected) { clearInterval(chrono.id); chrono = null; return; }
          const s = (Date.now() - chrono.debut) / 1000;
          aff.textContent = o.duree(s);
          aff.classList.toggle('urgent', s > h.cible);
        }, 250);
      });
    });
    main.querySelector('[data-exporter]').addEventListener('click', function () {
      A.donnerTexte('mes-histoires-' + A.aujourdhui() + '.txt', texteComplet(), 'text/plain;charset=utf-8', 'Toutes tes histoires, à copier où tu veux.');
    });
    main.querySelector('[data-imprimer]').addEventListener('click', function () {
      main.querySelectorAll('details').forEach(function (d) { d.open = true; });
      racine.print();
    });
    return function () { if (chrono) { clearInterval(chrono.id); chrono = null; } };
  }

  function texteComplet() {
    return HISTOIRES.map(function (h) {
      const en = (A.etat.histoires[h.id + ':en'] || '').trim();
      return '## ' + h.titre + '\n\n' + ((A.etat.histoires[h.id] || '').trim() || '(à écrire)') + '\n' +
        (en ? '\n### ' + h.en + '\n\n' + en + '\n' : '');
    }).join('\n');
  }

  A.enregistrerVue({ id: 'histoires', titre: 'Mes histoires', court: 'Histoires', icone: '✎', ordre: 7, rendre: rendre });
  P.histoires = { HISTOIRES: HISTOIRES };
})(this);
