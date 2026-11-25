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
  function rendreAccueil(main) {
    const qs = toutes();
    const s = suivi();
    const faites = qs.filter(function (q) { return s[q.id]; });
    const justes = faites.filter(function (q) { return s[q.id].r; }).length;
    const fausses = faites.length - justes;
    main.innerHTML = '<h1>QCM</h1><p class="doux">Une question à choix multiples par fiche et par chapitre du cours. Les mauvaises réponses ' +
      'ne sont pas là pour faire nombre : ce sont les erreurs que l’on commet vraiment (oubli d’un cas, formule voisine, intuition trompeuse), ' +
      'et chacune est expliquée après ta réponse. Ta progression ici est <strong>séparée</strong> des révisions : elle ne change pas le planning des fiches.</p>' +
      '<div class="grille stats-ct">' +
      '<div class="carte"><div class="chiffre">' + qs.length + '</div><div class="legende">questions</div></div>' +
      '<div class="carte"><div class="chiffre" data-qcm-faites>' + faites.length + '</div><div class="legende">déjà répondues</div>' + barre(faites.length / Math.max(1, qs.length)) + '</div>' +
      '<div class="carte"><div class="chiffre">' + (faites.length ? Math.round(100 * justes / faites.length) + ' %' : '–') + '</div><div class="legende">de réussite à la dernière tentative · ' + fausses + ' à retravailler</div></div></div>' +
      '<div class="ligne" style="margin:4px 0 20px"><button class="principal" data-qcm-tout>Session de ' + TAILLE + ' questions, tous domaines</button>' +
      (fausses ? '<button data-qcm-erreurs>Retravailler mes ' + fausses + ' erreur' + (fausses > 1 ? 's' : '') + '</button>' : '') + '</div>' +
      '<h2>Par domaine</h2><div class="liste-qcm">' + domaines().map(function (d) {
        const l = qs.filter(function (q) { return domaine(q) === d; });
        const f = l.filter(function (q) { return s[q.id]; });
        const j = f.filter(function (q) { return s[q.id].r; }).length;
        return '<button type="button" class="ligne-qcm" data-qcm-domaine="' + o.echapper(d) + '"><span class="nom-qcm">' + o.echapper(nomDomaine(d)) + '</span>' +
          '<span class="legende">' + f.length + ' / ' + l.length + (f.length ? ' · ' + Math.round(100 * j / f.length) + ' % justes' : '') + '</span>' +
          barre(f.length / Math.max(1, l.length)) + '</button>';
      }).join('') + '</div>';
    main.querySelector('[data-qcm-tout]').addEventListener('click', function () { lancer(tirer(qs, TAILLE)); });
    const err = main.querySelector('[data-qcm-erreurs]');
    if (err) err.addEventListener('click', function () { lancer(tirer(qs.filter(function (q) { return etatQ(q) === 'fausse'; }), TAILLE)); });
    main.querySelectorAll('[data-qcm-domaine]').forEach(function (b) {
      b.addEventListener('click', function () {
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

  function rendreSession(main, ids) {
    const parId = {};
    toutes().forEach(function (q) { parId[q.id] = q; });
    const liste = ids.map(function (id) { return parId[id]; }).filter(Boolean);
    if (!liste.length) { A.aller('qcm'); return; }
    const resultats = [];
    let rang = 0;

    function question() {
      const q = liste[rang];
      const ordre = o.melanger(Math.random, q.choix.map(function (c, i) { return i; }));
      let repondu = false;
      main.innerHTML = '<p class="petit"><a href="#qcm">← QCM</a></p>' +
        '<div class="ligne petit doux" style="margin-bottom:6px"><span>Question ' + (rang + 1) + ' sur ' + liste.length + '</span><span class="espace"></span>' +
        '<span>' + resultats.filter(Boolean).length + ' juste' + (resultats.filter(Boolean).length > 1 ? 's' : '') + '</span></div>' +
        barre(rang / liste.length) +
        '<section class="carte carte-qcm"><div class="petit doux source-qcm">' + source(q) + '</div>' +
        '<div class="question">' + o.markdown(enonce(q)) + '</div>' +
        '<ol class="choix-qcm" role="list">' + ordre.map(function (i, k) {
          return '<li><button type="button" class="choix" data-choix="' + i + '"><span class="lettre">' + LETTRES[k] + '</span>' +
            '<span class="texte-choix">' + o.enLigne(q.choix[i].t) + '</span></button><div class="pourquoi" hidden></div></li>';
        }).join('') + '</ol><div data-qcm-suite></div></section>';

      function repondre(i) {
        if (repondu) return;
        repondu = true;
        const juste = q.choix[i].ok;
        resultats.push(juste);
        const s = suivi();
        const prec = s[q.id] || { n: 0, j: 0 };
        s[q.id] = { n: prec.n + 1, j: prec.j + (juste ? 1 : 0), r: juste, d: A.aujourdhui() };
        A.noterActivite('qcm');
        A.sauver();
        main.querySelectorAll('[data-choix]').forEach(function (b) {
          const k = Number(b.getAttribute('data-choix'));
          const c = q.choix[k];
          b.disabled = true;
          b.classList.add(c.ok ? 'bonne' : k === i ? 'mauvaise' : 'autre');
          if (k === i) b.setAttribute('aria-label', (c.ok ? 'Ta réponse, juste : ' : 'Ta réponse, fausse : ') + o.sansTex(c.t));
          const p = b.parentNode.querySelector('.pourquoi');
          p.innerHTML = '<span class="verdict-choix">' + (c.ok ? 'Juste.' : k === i ? 'Ta réponse, fausse.' : 'Faux.') + '</span> ' + o.enLigne(c.pourquoi);
          p.hidden = false;
        });
        const fin = rang + 1 >= liste.length;
        const suite = main.querySelector('[data-qcm-suite]');
        suite.innerHTML = '<div class="encadre ' + (juste ? 'succes' : 'erreur') + '"><strong>' + (juste ? 'Juste.' : 'Pas cette fois.') + '</strong> ' +
          (juste ? 'Lis quand même pourquoi les autres réponses sont fausses : ce sont les pièges qu’on te tendra.' : 'Lis l’explication de ta réponse, puis celle de la bonne.') + '</div>' +
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
      controle = {
        touche: function (e, saisie) {
          if (saisie) return false;
          if (!repondu) {
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
      const ratees = liste.filter(function (q, i) { return !resultats[i]; });
      main.innerHTML = '<p class="petit"><a href="#qcm">← QCM</a></p><h1>Bilan</h1>' +
        '<div class="carte"><div class="chiffre">' + n + ' / ' + liste.length + '</div><div class="legende">' +
        (n === liste.length ? 'Sans faute.' : n >= liste.length * 0.7 ? 'Solide : relis les pièges qui t’ont eu.' : 'Les questions ratées reviendront en priorité dans tes prochaines sessions.') + '</div></div>' +
        (ratees.length ? '<h2>À revoir</h2><ul class="liens-fiches">' + ratees.map(function (q) {
          return '<li>' + o.echapper(o.resume(o.sansTex(enonce(q)), 110)) + ' · ' + source(q) + '</li>';
        }).join('') + '</ul>' : '') +
        '<div class="ligne" style="margin-top:16px">' +
        (ratees.length ? '<button class="principal" data-qcm-refaire>Refaire mes erreurs</button>' : '') +
        '<button' + (ratees.length ? '' : ' class="principal"') + ' data-qcm-autre>Nouvelle session</button><a class="bouton" href="#qcm">Retour au QCM</a></div>';
      const r = main.querySelector('[data-qcm-refaire]');
      if (r) r.addEventListener('click', function () { lancer(o.melanger(Math.random, ratees)); });
      main.querySelector('[data-qcm-autre]').addEventListener('click', function () {
        const doms = {};
        liste.forEach(function (q) { doms[domaine(q)] = true; });
        const memes = Object.keys(doms).length === 1 ? toutes().filter(function (q) { return doms[domaine(q)]; }) : toutes();
        lancer(tirer(memes, TAILLE));
      });
    }

    question();
  }

  // Questions d'un chapitre du cours : celles du chapitre lui-même et celles de ses fiches.
  function duChapitre(id) {
    const c = chapitre(id);
    const fiches = c ? c.fiches || [] : [];
    return toutes().filter(function (q) { return q.cible === 'cours:' + id || fiches.indexOf(q.cible) >= 0; });
  }

  function rendre(main, params) {
    controle = null;
    if (params.s) return rendreSession(main, params.s.split(',').filter(Boolean));
    if (params.c) {
      const liste = tirer(duChapitre(params.c), TAILLE);
      if (liste.length) return rendreSession(main, liste.map(function (q) { return q.id; }));
    }
    rendreAccueil(main);
  }

  A.enregistrerVue({
    id: 'qcm', titre: 'QCM', court: 'QCM', icone: '✓', ordre: 5.2, rendre: rendre,
    touche: function (e, saisie) {
      if (controle && controle.touche(e, saisie)) e.preventDefault();
    }
  });
  P.qcm = { toutes: toutes, domaine: domaine, tirer: tirer, duChapitre: duChapitre };
})(this);
