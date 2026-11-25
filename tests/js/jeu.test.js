// Mode carrière : XP calculée depuis la progression réelle, sans farming ; série avec jokers ; quêtes ; épreuves ; succès.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const J = require(path.join(__dirname, '..', '..', 'app', 'jeu.js'));
const srs = require(path.join(__dirname, '..', '..', 'app', 'srs.js'));

const JOUR = '2026-11-25';
function contexte(jour) {
  const fiches = [
    { id: 'f1', niveau: 1, theme: 'probas' }, { id: 'f2', niveau: 3, theme: 'probas' },
    { id: 'e1', niveau: 2, theme: 'casse-tete', categorie: 'logique' }, { id: 'e1-v', niveau: 2, theme: 'casse-tete', categorie: 'logique', parent: 'e1' }
  ];
  const qcm = [];
  ['f1', 'f2', 'e1', 'e1-v'].forEach(function (c) { qcm.push({ id: c + '~1', cible: c, choix: [] }); });
  for (let k = 0; k < 14; k++) qcm.push({ id: 'cours:ch1~' + (k + 1), cible: 'cours:ch1', choix: [] });
  return {
    fiches: fiches, qcm: qcm, jour: jour || JOUR, maitrise: srs.maitrise,
    chapitres: [{ id: 'ch1', titre: 'Probabilités', partie: 'Probabilités', numero: 1, fiches: ['f1', 'f2'], exercices: [{ id: 'ex1' }, { id: 'ex2' }] },
      { id: 'ch2', titre: 'Brownien', partie: 'Calcul stochastique', numero: 2, fiches: [], exercices: [] }],
    categories: { logique: 'Logique' }, themes: { probas: 'Probabilités', 'casse-tete': 'Casse-têtes' },
    domaine: function (q) { return q.cible.indexOf('cours:') === 0 ? 'cours' : q.cible[0] === 'e' ? 'casse-tete' : 'probas'; }
  };
}
function etatVide() {
  return { cartes: {}, jours: {}, calcul: [], marche: [], entretiens: [], tests: [], kelly: [], journal: [], histoires: {}, notes: {},
    qcm: {}, cours: { exercices: {}, lus: {}, demos: {} }, reglages: {} };
}
function carteMaitrisee() { return { vu: 3, rep: 3, intervalle: 30, notes: [2, 2, 3], derniere: JOUR, echeance: '2026-12-25' }; }

test('niveaux et rangs : courbe croissante, bornée', () => {
  assert.equal(J.niveauDe(0), 1);
  assert.equal(J.niveauDe(J.seuil(5)), 5);
  assert.equal(J.niveauDe(J.seuil(5) - 1), 4);
  assert.equal(J.niveauDe(1e9), J.NIVEAU_MAX);
  assert.equal(J.rangDe(1), 'Stagiaire');
  assert.equal(J.rangDe(40), 'Légende du desk');
});

test('une progression vide donne zéro XP, la maîtrise durable rapporte plus que la découverte', () => {
  const ctx = contexte();
  assert.equal(J.calculer(etatVide(), ctx).total, 0);
  const decouverte = etatVide();
  decouverte.cartes.f2 = { vu: 1, rep: 1, intervalle: 1, notes: [2], derniere: JOUR };
  const maitrise = etatVide();
  maitrise.cartes.f2 = carteMaitrisee();
  const a = J.calculer(decouverte, ctx).xp.fiches, b = J.calculer(maitrise, ctx).xp.fiches;
  assert.ok(a > 0 && b > 2 * a, 'découverte ' + a + ', maîtrise ' + b);
});

test('pas de farming : répondre plusieurs fois à la même question de QCM ne rapporte qu’une fois', () => {
  const ctx = contexte();
  const e = etatVide();
  e.qcm['f1~1'] = { n: 1, j: 1, r: true, d: JOUR };
  const une = J.calculer(e, ctx).xp.qcm;
  e.qcm['f1~1'] = { n: 10, j: 10, r: true, d: JOUR };
  assert.equal(J.calculer(e, ctx).xp.qcm, une);
  // une erreur corrigée rapporte un bonus
  e.qcm['f1~1'] = { n: 2, j: 1, r: true, d: JOUR };
  assert.equal(J.calculer(e, ctx).xp.qcm, une + J.BAREME.qcmCorrige);
});

test('série : un joker gagné après 7 jours sauve un jour manqué', () => {
  const e = etatVide();
  const jours = [];
  for (let k = 0; k < 9; k++) jours.push('2026-11-' + String(10 + k).padStart(2, '0'));
  jours.forEach(function (j) { e.jours[j] = { revues: 5 }; });
  // 2026-11-19 manqué, actif le 20
  e.jours['2026-11-20'] = { revues: 3 };
  const s = J.serie(e, '2026-11-20');
  assert.equal(s.serie, 10);
  assert.equal(s.utilises, 1);
  // sans joker (moins de 7 jours avant le trou), la série repart
  const f = etatVide();
  ['2026-11-10', '2026-11-11', '2026-11-13'].forEach(function (j) { f.jours[j] = { revues: 1 }; });
  assert.equal(J.serie(f, '2026-11-13').serie, 1);
  // aujourd'hui sans activité ne casse rien
  assert.equal(J.serie(f, '2026-11-14').serie, 1);
});

test('quêtes : trois par jour, stables dans la journée, validées par l’activité, figées une fois accomplies', () => {
  const ctx = contexte();
  const e = etatVide();
  const q1 = J.calculer(e, ctx).quetes, q2 = J.calculer(e, ctx).quetes;
  assert.equal(q1.jour.length, 3);
  assert.equal(q1.jour[0].id, 'revisions');
  assert.deepEqual(q1.jour.map((q) => q.id), q2.jour.map((q) => q.id));
  e.jours[JOUR] = { revues: 15 };
  const maj = J.mettreAJour(e, ctx, J.calculer(etatVide(), ctx));
  assert.ok(maj.evenements.some((ev) => ev.type === 'quete'));
  assert.equal(e.jeu.quetes[JOUR + ':revisions'], J.BAREME.quete);
  // une deuxième mise à jour ne recompte pas la quête
  const maj2 = J.mettreAJour(e, ctx, maj.resultat);
  assert.ok(!maj2.evenements.some((ev) => ev.type === 'quete' && ev.titre === 'Routine'));
});

test('épreuves : médailles, meilleur score gardé, XP selon la meilleure médaille', () => {
  const ctx = contexte();
  const e = etatVide();
  const r0 = J.calculer(e, ctx);
  assert.ok(r0.boss.some((b) => b.id === 'cours'), 'épreuve du cours (14 questions)');
  assert.ok(r0.boss.some((b) => b.final));
  assert.equal(J.enregistrerBoss(e, 'cours', 8, 12, JOUR), 'bronze');
  assert.equal(J.enregistrerBoss(e, 'cours', 5, 12, JOUR), null);
  const r = J.calculer(e, ctx);
  const b = r.boss.filter((x) => x.id === 'cours')[0];
  assert.equal(b.tentatives, 2);
  assert.equal(b.medaille, 'bronze');
  assert.ok(!b.vaincu);
  assert.equal(r.xp.boss, J.BAREME.boss.bronze);
  J.enregistrerBoss(e, 'cours', 11, 12, JOUR);
  assert.equal(J.calculer(e, ctx).xp.boss, J.BAREME.boss.or);
});

test('succès : obtenus d’après la progression, datés une seule fois ; succès cachés', () => {
  const ctx = contexte();
  const e = etatVide();
  e.cartes['e1-v'] = { vu: 1, rep: 1, intervalle: 1, notes: [2], derniere: JOUR };
  const maj = J.mettreAJour(e, ctx, null);
  const noms = maj.evenements.filter((ev) => ev.type === 'succes').map((ev) => ev.titre);
  assert.ok(noms.indexOf('Premier pas') >= 0);
  assert.ok(noms.indexOf('Curieux') >= 0, 'variante explorée avant son problème');
  assert.equal(e.jeu.succes['premier-pas'], JOUR);
  assert.equal(J.mettreAJour(e, ctx, maj.resultat).evenements.filter((ev) => ev.type === 'succes').length, 0);
});

test('compétences : score composite, prérequis conseillés et jamais bloquants', () => {
  const ctx = contexte();
  const e = etatVide();
  e.cours.lus.ch1 = true;
  e.cours.exercices.ex1 = { juste: true, jour: JOUR };
  e.cours.exercices.ex2 = { juste: true, jour: JOUR };
  e.cartes.f1 = carteMaitrisee();
  e.cartes.f2 = carteMaitrisee();
  for (let k = 1; k <= 14; k++) e.qcm['cours:ch1~' + k] = { n: 1, j: 1, r: true, d: JOUR };
  e.qcm['f1~1'] = e.qcm['f2~1'] = { n: 1, j: 1, r: true, d: JOUR };
  const c = J.calculer(e, ctx).competences.filter((x) => x.id === 'ch1')[0];
  assert.equal(c.niveau, 5);
  assert.ok(c.prete);
});

test('nettoyage : les vieilles quêtes sont archivées sans perdre d’XP', () => {
  const ctx = contexte();
  const e = etatVide();
  e.jeu = { quetes: { '2026-01-02:revisions': 30, '2026-01-02:calcul': 30, [JOUR + ':revisions']: 30 }, boss: {}, succes: {} };
  const avant = J.calculer(e, ctx).xp.quetes;
  J.compacter(e, JOUR);
  assert.equal(Object.keys(e.jeu.quetes).length, 2);
  assert.equal(J.calculer(e, ctx).xp.quetes, avant);
});
