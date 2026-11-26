// Recherche globale (Ctrl+K ou ⌘K, ou le bouton « Rechercher ») : pages, chapitres et sections du cours, fiches,
// casse-têtes et guides, dans une seule liste au clavier. L'index est construit à la première ouverture.
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;
  const PAR_TYPE = { page: 6, chapitre: 5, section: 6, fiche: 10, guide: 4 };
  const NOMS = { page: 'Pages', chapitre: 'Chapitres du cours', section: 'Sections du cours', fiche: 'Questions', guide: 'Guides' };
  const ORDRE = ['page', 'chapitre', 'section', 'fiche', 'guide'];

  // texte normalisé : minuscules sans accents, mots séparés par une espace, avec une espace devant (début de mot = « ␣mot »)
  function norm(s) { return ' ' + String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

  let index = null;
  function construire() {
    const r = [];
    document.querySelectorAll('#navigation a[href^="#"]').forEach(function (a) {
      const t = a.querySelector('.nav-texte');
      if (t) r.push({ type: 'page', titre: t.textContent, lien: a.getAttribute('href'), cle: norm(t.textContent) });
    });
    r.push({ type: 'page', titre: 'Banque de questions', lien: '#banque', cle: norm('banque de questions fiches liste') });
    const cours = racine.PREPA_COURS ? racine.PREPA_COURS.chapitres : [];
    cours.forEach(function (c) {
      r.push({ type: 'chapitre', titre: 'Chapitre ' + c.numero + ' · ' + c.titre, sous: c.partie, lien: '#cours/c=' + encodeURIComponent(c.id),
        cle: norm(c.titre + ' ' + c.partie), texte: norm(c.resume || '') });
      if (P.cours && P.cours.sections) P.cours.sections(c).forEach(function (s) {
        if (!s.k) return;
        r.push({ type: 'section', titre: s.titre, sous: 'Chapitre ' + c.numero + ' · ' + c.titre, lien: '#cours/c=' + encodeURIComponent(c.id) + '/s=' + s.k,
          cle: norm(o.sansTex(s.titre)), texte: norm(o.sansTex(s.texte.slice(0, 1500))) });
      });
    });
    A.fiches().forEach(function (f) {
      const titre = f.titre || o.resume(o.sansTex(f.question), 110);
      r.push({ type: 'fiche', titre: titre, tex: !!f.titre, sous: f.categorie ? 'Casse-tête' : A.nomTheme(f.theme),
        lien: f.categorie ? '#casse-tetes/f=' + encodeURIComponent(f.id) : '#banque/fiche=' + encodeURIComponent(f.id),
        cle: norm(o.sansTex(f.titre || '')), texte: norm(o.sansTex(f.question + ' ' + (f.en || ''))) });
    });
    (A.banque().guides || []).forEach(function (g) {
      r.push({ type: 'guide', titre: g.titre, sous: 'Guide', lien: '#guides/g=' + g.id, cle: norm(g.titre), texte: norm(o.sansTex(g.texte.slice(0, 3000))) });
    });
    return r;
  }

  // Score : tous les mots doivent apparaître ; le titre compte plus que le texte, un début de mot plus qu'un milieu.
  function score(x, mots) {
    let s = 0;
    for (let k = 0; k < mots.length; k++) {
      const m = mots[k];
      const i = x.cle.indexOf(' ' + m);
      if (i >= 0) s += (i === 0 ? 6 : 4);
      else if (m.length >= 4 && x.cle.indexOf(m) >= 0) s += 2;
      else if (x.texte && x.texte.indexOf(' ' + m) >= 0) s += 1;
      else return 0;
    }
    return s + (x.type === 'page' ? 2 : x.type === 'chapitre' ? 1.5 : 0);
  }
  function chercher(q) {
    if (!index) index = construire();
    const mots = norm(q).split(' ').filter(Boolean);
    if (!mots.length) return index.filter(function (x) { return x.type === 'page'; }).slice(0, 12);
    const par = {};
    index.forEach(function (x) {
      const s = score(x, mots);
      if (s) (par[x.type] = par[x.type] || []).push({ x: x, s: s });
    });
    let r = [];
    ORDRE.forEach(function (t) {
      (par[t] || []).sort(function (a, b) { return b.s - a.s; }).slice(0, PAR_TYPE[t]).forEach(function (y) { r.push(y.x); });
    });
    return r;
  }

  let ouvert = null;
  function ouvrir() {
    if (ouvert) { ouvert.querySelector('input').focus(); return; }
    const avant = document.activeElement;
    const voile = A.el('<div class="voile-recherche"><div class="palette" role="dialog" aria-modal="true" aria-label="Rechercher">' +
      '<div class="palette-tete"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input type="search" role="combobox" aria-expanded="true" aria-controls="resultats-recherche" aria-autocomplete="list" placeholder="Chercher une notion, un chapitre, une question…" autocomplete="off" spellcheck="false">' +
      '<kbd>Échap</kbd></div><ul class="palette-liste" id="resultats-recherche" role="listbox" aria-label="Résultats"></ul>' +
      '<div class="palette-pied"><span><kbd>↑</kbd><kbd>↓</kbd> choisir</span><span><kbd>Entrée</kbd> ouvrir</span><span><kbd>Ctrl</kbd><kbd>K</kbd> partout</span></div></div></div>');
    ouvert = voile;
    const champ = voile.querySelector('input');
    const liste = voile.querySelector('ul');
    let res = [];
    let actif = 0;
    const fermer = function () {
      voile.remove(); ouvert = null;
      document.removeEventListener('keydown', clavier, true);
      if (avant && avant.focus) try { avant.focus({ preventScroll: true }); } catch (e) { /* rien */ }
    };
    const aller = function (x) { fermer(); racine.location.hash = x.lien; };
    function marquer() {
      liste.querySelectorAll('[role="option"]').forEach(function (li, k) {
        li.setAttribute('aria-selected', String(k === actif));
        if (k === actif) { champ.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); }
      });
    }
    function afficher() {
      res = chercher(champ.value);
      actif = 0;
      let type = '';
      liste.innerHTML = res.length ? res.map(function (x, k) {
        const tete = x.type !== type ? '<li class="palette-groupe" role="presentation">' + NOMS[x.type] + '</li>' : '';
        type = x.type;
        return tete + '<li role="option" id="res-' + k + '" data-k="' + k + '"><span class="palette-titre">' + (x.tex ? o.enLigne(x.titre) : o.echapper(x.titre)) + '</span>' +
          (x.sous ? '<span class="palette-sous">' + o.echapper(x.sous) + '</span>' : '') + '</li>';
      }).join('') : '<li class="palette-vide" role="presentation">Rien trouvé. Essaie un autre mot, ou sans accent.</li>';
      marquer();
    }
    function clavier(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fermer(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); e.stopPropagation();
        if (res.length) { actif = (actif + (e.key === 'ArrowDown' ? 1 : -1) + res.length) % res.length; marquer(); }
        return;
      }
      if (e.key === 'Enter' && res[actif]) { e.preventDefault(); e.stopPropagation(); aller(res[actif]); return; }
      if (e.key === 'Tab') { e.preventDefault(); champ.focus(); }
      e.stopPropagation();   // les raccourcis de la page ne voient pas la frappe
    }
    champ.addEventListener('input', afficher);
    liste.addEventListener('click', function (e) { const li = e.target.closest('[data-k]'); if (li) aller(res[Number(li.getAttribute('data-k'))]); });
    liste.addEventListener('mousemove', function (e) { const li = e.target.closest('[data-k]'); if (li && Number(li.getAttribute('data-k')) !== actif) { actif = Number(li.getAttribute('data-k')); marquer(); } });
    voile.addEventListener('mousedown', function (e) { if (e.target === voile) fermer(); });
    document.addEventListener('keydown', clavier, true);
    document.body.appendChild(voile);
    afficher();
    champ.focus();
  }

  function brancher() {
    const bouton = '<button type="button" class="bouton-recherche" data-recherche aria-label="Rechercher (Ctrl+K)">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<span class="bouton-recherche-texte">Rechercher</span><kbd>Ctrl K</kbd></button>';
    const marque = document.querySelector('.laterale .marque');
    if (marque) marque.insertAdjacentHTML('afterend', bouton);
    const entete = document.querySelector('.entete .marque');
    if (entete) entete.insertAdjacentHTML('afterend', bouton.replace('class="bouton-recherche"', 'class="bouton-recherche compacte"'));
    document.addEventListener('click', function (e) { if (e.target.closest('[data-recherche]')) ouvrir(); });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); ouvrir(); }
    });
    if (/Mac|iPhone|iPad/.test(navigator.platform || '')) document.querySelectorAll('.bouton-recherche kbd').forEach(function (k) { k.textContent = '⌘K'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher); else brancher();
  P.recherche = { ouvrir: ouvrir, chercher: chercher };
})(this);
