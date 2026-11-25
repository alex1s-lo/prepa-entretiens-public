// Réglages : profils visés, rythme, langue, apparence, profil de candidat, sauvegarde.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;

  function rendre(main) {
    const etat = A.etat;
    const r = etat.reglages;
    const profils = A.banque().profils;
    main.innerHTML = '<h1>Réglages</h1>' +
      '<form class="carte" data-form><h2 style="margin-top:0">Ce que tu vises</h2>' +
      '<p class="petit doux">Les révisions du jour privilégient les questions de ces profils ; le premier est prioritaire.</p>' +
      '<label for="r-prio">Profil prioritaire</label><select id="r-prio">' + Object.keys(profils).map(function (p) {
        return '<option value="' + p + '"' + (r.profils[0] === p ? ' selected' : '') + '>' + o.echapper(profils[p]) + '</option>';
      }).join('') + '</select>' +
      '<fieldset><legend>Autres profils visés</legend>' + Object.keys(profils).map(function (p) {
        return '<label class="case"><input type="checkbox" data-profil value="' + p + '"' + (r.profils.indexOf(p) >= 0 ? ' checked' : '') + '> ' + o.echapper(profils[p]) + '</label>';
      }).join('') + '</fieldset>' +
      '<label for="r-nouveaux">Nouvelles questions par jour</label><input id="r-nouveaux" type="number" min="0" max="60" value="' + r.nouveauxParJour + '" style="width:7em">' +
      '<p class="petit doux">15 par jour font environ 20 à 30 minutes de révisions avec les rappels. À moins de deux semaines d’un entretien, monte à 25.</p>' +
      '<label class="case"><input type="checkbox" id="r-anglais"' + (r.anglais ? ' checked' : '') + '> Afficher les questions en anglais quand une version existe</label>' +
      '<label for="r-theme">Apparence</label><select id="r-theme"><option value="auto">Comme le système</option><option value="light">Claire</option><option value="dark">Sombre</option></select></form>' +
      '<div class="carte"><h2 style="margin-top:0">Mon profil pour l’entretien</h2><p class="petit doux">Utilisé dans les consignes de l’entretien oral avec Claude. ' +
      'Complète les parties entre crochets ; n’écris que des faits vrais.</p><textarea id="r-candidat" style="min-height:12em">' +
      o.echapper(r.profilCandidat || P.entretien.PROFIL_CANDIDAT_DEFAUT) + '</textarea></div>' +
      (A.restreint ? '' : '<div class="carte" data-carte-synchro></div>') +
      '<div class="carte"><h2 style="margin-top:0">Sauvegarde</h2><p>Ta progression est enregistrée <b>dans ce navigateur</b>, sur cet appareil. ' +
      'Sans synchronisation, tu peux aussi la garder ou la transférer à la main : exporte un fichier, puis importe-le de l’autre côté.</p>' +
      '<div class="ligne"><button class="principal" data-exporter>Exporter ma progression</button><label class="bouton" style="margin:0;font-weight:400">Importer un fichier' +
      '<input type="file" accept=".json,application/json" data-importer hidden></label><span class="espace"></span><button data-reinit>Tout effacer</button></div>' +
      '<details style="margin-top:10px"><summary class="petit">Importer un texte copié</summary>' +
      '<textarea id="r-import" placeholder="Colle ici une sauvegarde copiée (texte commençant par « { »)" style="min-height:6em"></textarea>' +
      '<button data-importer-texte>Importer ce texte</button></details>' +
      '<p class="petit doux" data-etat-stockage></p></div>';
    const form = main.querySelector('[data-form]');
    form.querySelector('#r-theme').value = r.theme || 'auto';
    function enregistrer() {
      const prio = form.querySelector('#r-prio').value;
      const autres = Array.prototype.map.call(form.querySelectorAll('[data-profil]:checked'), function (c) { return c.value; })
        .filter(function (p) { return p !== prio; });
      r.profils = [prio].concat(autres);
      form.querySelectorAll('[data-profil]').forEach(function (c) { if (c.value === prio) c.checked = true; });
      const n = parseInt(form.querySelector('#r-nouveaux').value, 10);
      r.nouveauxParJour = isFinite(n) ? Math.max(0, Math.min(60, n)) : 15;
      r.anglais = form.querySelector('#r-anglais').checked;
      r.theme = form.querySelector('#r-theme').value;
      A.appliquerTheme();
      A.sauver();
    }
    form.addEventListener('change', enregistrer);
    form.addEventListener('submit', function (e) { e.preventDefault(); enregistrer(); });
    main.querySelector('#r-candidat').addEventListener('input', function (e) {
      r.profilCandidat = e.target.value;
      A.sauver();
    });
    main.querySelector('[data-exporter]').addEventListener('click', A.exporter);
    main.querySelector('[data-importer]').addEventListener('change', function (e) {
      const fichier = e.target.files && e.target.files[0];
      if (!fichier) return;
      const lecteur = new FileReader();
      lecteur.onload = function () {
        try {
          A.importer(String(lecteur.result));
          A.toast('Progression importée.');
          A.afficher();
        } catch (err) {
          A.toast(err.message || 'Fichier illisible.');
        }
      };
      lecteur.readAsText(fichier);
    });
    main.querySelector('[data-importer-texte]').addEventListener('click', function () {
      try {
        A.importer(main.querySelector('#r-import').value);
        A.toast('Progression importée.');
        A.afficher();
      } catch (err) {
        A.toast(err instanceof SyntaxError ? 'Ce texte n\u2019est pas une sauvegarde complète : recopie-la en entier.' : (err.message || 'Texte illisible.'));
      }
    });
    main.querySelector('[data-reinit]').addEventListener('click', function () {
      A.confirmer('Effacer toute ta progression, tes histoires et ton journal ? Exporte d’abord si tu veux les garder.', 'Tout effacer', function () {
        A.reinitialiser();
        A.toast('Tout est effacé.');
        A.afficher();
      });
    });
    const carteSynchro = main.querySelector('[data-carte-synchro]');
    if (carteSynchro) {
      rendreSynchro(carteSynchro);
      const surSynchro = function () { if (carteSynchro.isConnected) rendreSynchro(carteSynchro); };
      document.addEventListener('prepa-synchro', surSynchro);
      // l'écran se démonte au changement de vue : on retire l'écouteur à ce moment
      setTimeout(function () { racine.addEventListener('hashchange', function retirer() {
        document.removeEventListener('prepa-synchro', surSynchro); racine.removeEventListener('hashchange', retirer);
      }); }, 0);
    }
    main.querySelector('[data-etat-stockage]').textContent = A.stockageOk() ?
      'Sauvegarde locale active.' : 'Ce navigateur bloque la sauvegarde locale : exporte ta progression avant de fermer la page.';
  }

  // --- Synchronisation téléphone et ordinateur -------------------------------------------------------------------------
  function depuis(ms) {
    if (!ms) return 'jamais';
    const s = Math.round((Date.now() - ms) / 1000);
    if (s < 60) return 'à l’instant';
    if (s < 3600) return 'il y a ' + Math.round(s / 60) + ' min';
    if (s < 86400) return 'il y a ' + Math.round(s / 3600) + ' h';
    return 'le ' + new Date(ms).toLocaleDateString('fr-FR');
  }
  function rendreSynchro(el) {
    const c = A.configSynchro();
    const se = A.synchroEtat;
    const titre = '<h2 style="margin-top:0">Synchroniser téléphone et ordinateur</h2>';
    if (c) {
      el.innerHTML = titre + '<p>Synchronisation <b>active</b> avec le dépôt privé <code>' + o.echapper(c.depot) + '</code>. ' +
        'Elle se fait toute seule : à l’ouverture, une vingtaine de secondes après chaque réponse, et quand l’application revient au premier plan.</p>' +
        '<p class="petit ' + (se.erreur ? '' : 'doux') + '" data-synchro-statut>' +
        (se.enCours ? 'Synchronisation en cours…' : (se.erreur ? '<span class="etiquette erreur">erreur</span> ' : '') +
          'Dernière synchronisation : ' + depuis(c.derniere) + (se.message ? ' · ' + o.echapper(se.message) : '')) + '</p>' +
        '<div class="ligne"><button class="principal" data-synchro-maintenant' + (se.enCours ? ' disabled' : '') + '>Synchroniser maintenant</button>' +
        '<button data-synchro-code>Code pour un autre appareil</button><span class="espace"></span>' +
        '<button class="discret" data-synchro-couper>Désactiver sur cet appareil</button></div>' +
        '<div data-synchro-code-zone></div>';
      el.querySelector('[data-synchro-maintenant]').addEventListener('click', function () { A.synchroniser(true); });
      el.querySelector('[data-synchro-code]').addEventListener('click', function () {
        el.querySelector('[data-synchro-code-zone]').innerHTML = '<div class="encadre alerte" style="margin-top:12px"><p><b>Code de liaison</b> : colle-le sur ton autre appareil ' +
          '(Réglages → Synchroniser → « J’ai déjà un code »). Il contient ton jeton et ta phrase de passe : ne le partage avec personne, ' +
          'envoie-le-toi par un moyen privé puis supprime le message.</p><textarea readonly data-synchro-code-texte style="min-height:4em;font-family:var(--mono);font-size:.8rem">' +
          o.echapper(P.synchro.codeLiaison(c)) + '</textarea><button data-synchro-copier>Copier le code</button></div>';
        el.querySelector('[data-synchro-copier]').addEventListener('click', function () {
          const zone = el.querySelector('[data-synchro-code-texte]');
          A.copier(zone.value, zone);
        });
      });
      el.querySelector('[data-synchro-couper]').addEventListener('click', function () {
        A.confirmer('Désactiver la synchronisation sur cet appareil ? Ta progression locale et la copie du dépôt sont conservées.', 'Désactiver', function () {
          A.ecrireConfigSynchro(null);
          A.toast('Synchronisation désactivée sur cet appareil.');
          rendreSynchro(el);
        });
      });
      return;
    }
    el.innerHTML = titre + '<p>Pour retrouver la même progression sur ton téléphone et ton ordinateur, l’application dépose une copie <b>chiffrée</b> ' +
      'dans un dépôt GitHub privé qui t’appartient. GitHub ne voit que des données illisibles ; la phrase de passe ne quitte pas tes appareils.</p>' +
      '<details data-synchro-aide><summary>Préparer une fois (5 minutes, sur l’ordinateur)</summary><ol class="petit">' +
      '<li>Sur <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">github.com/new</a>, crée un dépôt <b>privé</b>, par exemple <code>prepa-sauvegarde</code>.</li>' +
      '<li>Sur <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">la page des jetons GitHub</a>, crée un jeton « fine-grained » : ' +
      'accès à <b>ce seul dépôt</b> (« Only select repositories »), permission <b>Contents : Read and write</b>, durée d’un an. Copie le jeton (il commence par <code>github_pat_</code>).</li>' +
      '<li>Choisis une phrase de passe (quatre ou cinq mots), différente de tes autres mots de passe. Sans elle, la copie est illisible : note-la.</li>' +
      '<li>Remplis le formulaire ci-dessous, puis « Activer ». Sur le téléphone, colle ensuite le <b>code de liaison</b> que l’ordinateur te donne.</li></ol></details>' +
      '<form data-synchro-form autocomplete="off">' +
      '<label for="s-depot">Dépôt privé (compte/nom)</label><input id="s-depot" placeholder="ton-compte/prepa-sauvegarde" style="width:100%" spellcheck="false">' +
      '<label for="s-jeton">Jeton GitHub</label><input id="s-jeton" type="password" placeholder="github_pat_…" style="width:100%" spellcheck="false">' +
      '<label for="s-phrase">Phrase de passe (identique sur tous tes appareils)</label><input id="s-phrase" type="password" style="width:100%">' +
      '<div class="ligne" style="margin-top:14px"><button class="principal" type="submit">Activer la synchronisation</button></div></form>' +
      '<details style="margin-top:12px"><summary class="petit">J’ai déjà un code de liaison (deuxième appareil)</summary>' +
      '<textarea data-synchro-liaison placeholder="PREPA1:…" style="min-height:4em;font-family:var(--mono);font-size:.8rem"></textarea>' +
      '<button data-synchro-lier>Utiliser ce code</button></details>' +
      '<p class="petit" data-synchro-statut></p>';
    const statut = el.querySelector('[data-synchro-statut]');
    function activer(config) {
      statut.textContent = 'Connexion au dépôt…';
      A.ecrireConfigSynchro(config);
      A.synchroniser(false).then(function (res) {
        if (res) {
          A.toast(res.recu ? 'Synchronisation activée : progression de l’autre appareil récupérée.' : 'Synchronisation activée.');
          rendreSynchro(el);
          if (res.recu) A.afficher();
        } else {
          A.ecrireConfigSynchro(null);
          statut.innerHTML = '<span class="etiquette erreur">échec</span> ' + o.echapper(A.synchroEtat.message);
        }
      });
    }
    el.querySelector('[data-synchro-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      const depot = P.synchro.normaliserDepot(el.querySelector('#s-depot').value);
      const jeton = el.querySelector('#s-jeton').value.trim();
      const phrase = el.querySelector('#s-phrase').value;
      if (!depot) { statut.textContent = 'Écris le dépôt sous la forme « compte/nom-du-dépôt ».'; return; }
      if (!jeton) { statut.textContent = 'Colle le jeton GitHub.'; return; }
      if (phrase.length < 8) { statut.textContent = 'Choisis une phrase de passe d’au moins 8 caractères.'; return; }
      activer({ depot: depot, jeton: jeton, phrase: phrase });
    });
    el.querySelector('[data-synchro-lier]').addEventListener('click', function () {
      try {
        activer(P.synchro.lireCodeLiaison(el.querySelector('[data-synchro-liaison]').value));
      } catch (err) {
        statut.textContent = 'Code illisible : recopie-le en entier (il commence par « PREPA1: »).';
      }
    });
  }

  A.enregistrerVue({ id: 'reglages', titre: 'Réglages', icone: '⚙', ordre: 11, rendre: rendre });
})(this);
