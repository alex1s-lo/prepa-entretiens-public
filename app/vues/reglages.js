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
      '<div class="carte"><h2 style="margin-top:0">Sauvegarde</h2><p>Ta progression est enregistrée <b>dans ce navigateur</b>, sur cet appareil. ' +
      'Pour la garder en cas de nettoyage du navigateur, ou la passer du PC au téléphone : exporte un fichier, puis importe-le de l’autre côté.</p>' +
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
    main.querySelector('[data-etat-stockage]').textContent = A.stockageOk() ?
      'Sauvegarde locale active.' : 'Ce navigateur bloque la sauvegarde locale : exporte ta progression avant de fermer la page.';
  }

  A.enregistrerVue({ id: 'reglages', titre: 'Réglages', icone: '⚙', ordre: 11, rendre: rendre });
})(this);
