// Campagne, classement Elo, collection et usine (jeu2.js), sur un petit jeu de données fictif.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const J = require(path.join(__dirname, '..', '..', 'app', 'jeu.js'));
const J2 = require(path.join(__dirname, '..', '..', 'app', 'jeu2.js'));
const srs = require(path.join(__dirname, '..', '..', 'app', 'srs.js'));

const JOUR = '2026-11-25';
function contexte() {
  const fiches = [];
  for (let k = 0; k < 12; k++) fiches.push({ id: 'p' + k, niveau: 1 + (k % 3), theme: 'probas' });
  for (let k = 0; k < 8; k++) fiches.push({ id: 'l' + k, niveau: 1 + (k % 2), theme: 'casse-tete', categorie: 'logique', titre: 'Énigme ' + k });
  const qcm = fiches.map((f) => ({ id: f.id + '~1', cible: f.id, choix: [] }));
  for (let k = 0; k < 6; k++) qcm.push({ id: 'cours:esperance-variance-covariance~' + k, cible: 'cours:esperance-variance-covariance', choix: [] });
  const parId = {}; fiches.forEach((f) => { parId[f.id] = f; });
  return {
    fiches, qcm, jour: JOUR, maitrise: srs.maitrise, fiche: (id) => parId[id],
    chapitres: [{ id: 'esperance-variance-covariance', titre: 'Espérance', partie: 'Probabilités', numero: 1, fiches: fiches.filter((f) => f.theme === 'probas').map((f) => f.id), exercices: [] }],
    categories: { logique: 'Logique' }, themes: { probas: 'Probabilités', 'casse-tete': 'Casse-têtes' },
    domaine: (q) => q.cible.indexOf('cours:') === 0 ? 'cours' : parId[q.cible].categorie ? 'casse-tete' : 'probas'
  };
}
const vide = () => ({ cartes: {}, jours: {}, qcm: {}, cours: {}, jeu: {} });

test('campagne : niveaux générés, le premier ouvert, une étoile débloque le suivant', () => {
  const ctx = contexte();
  const e = vide();
  const c = J2.campagne(e, ctx);
  const niveaux = c.mondes[0].niveaux;
  assert.ok(niveaux.length >= 3, 'bases, approfondissement, énigmes');
  assert.ok(niveaux[0].debloque && !niveaux[1].debloque);
  assert.equal(c.prochain.id, niveaux[0].id);
  assert.equal(J2.terminerNiveau(e, ctx, niveaux[0].id, 3, 6).etoiles, 0);
  assert.ok(!J2.campagne(e, ctx).mondes[0].niveaux[1].debloque, 'moins de 60 % : pas de déblocage');
  const r = J2.terminerNiveau(e, ctx, niveaux[0].id, 5, 6);
  assert.equal(r.etoiles, 2);
  assert.ok(J2.campagne(e, ctx).mondes[0].niveaux[1].debloque);
  // un moins bon score ne retire pas d'étoile
  J2.terminerNiveau(e, ctx, niveaux[0].id, 4, 6);
  assert.equal(e.jeu.niveaux[niveaux[0].id], 2);
  assert.equal(J.calculer(e, ctx).xp.campagne, 2 * J2.ETOILES_XP);
});

test('étoiles : 60 %, 80 %, sans faute', () => {
  assert.equal(J2.etoilesPour(0.59), 0);
  assert.equal(J2.etoilesPour(0.6), 1);
  assert.equal(J2.etoilesPour(0.8), 2);
  assert.equal(J2.etoilesPour(1), 3);
});

test('Elo : réussir une question difficile fait monter, rater une facile fait baisser ; ligues', () => {
  const ctx = contexte();
  const e = vide();
  const dur = ctx.qcm.find((q) => q.cible === 'p2'), facile = ctx.qcm.find((q) => q.cible === 'p0');
  const a = J2.majElo(e, ctx, dur, true);
  assert.ok(a.delta > 20, 'gros gain sur une question dure : ' + a.delta);
  const b = J2.majElo(e, ctx, facile, false);
  assert.ok(b.delta < -15, 'perte sur une question facile : ' + b.delta);
  assert.equal(J2.ligue(990).nom, 'Bronze');
  assert.equal(J2.ligue(1210).nom, 'Or');
  assert.equal(J2.ligue(1210).suivante.nom, 'Platine');
  const qs = J2.questionsClassees(e, ctx, 'probas', 4, () => 0);
  assert.equal(qs.length, 4);
});

test('collection : une carte par fiche maîtrisée, paliers de set', () => {
  const ctx = contexte();
  const e = vide();
  ['l0', 'l1', 'l2', 'l3'].forEach((id) => { e.cartes[id] = { vu: 3, rep: 3, intervalle: 30, notes: [2, 2, 3] }; });
  const c = J2.collection(e, ctx);
  const set = c.sets.find((s) => s.id === 'ct:logique');
  assert.equal(set.obtenues, 4);
  assert.equal(set.paliers, 2);
  assert.equal(c.xp, 80);
});

test('usine : production nulle avant la première fiche, stock plafonné par l’entrepôt, collecte vers le desk, achats', () => {
  const ctx = contexte();
  const e = vide();
  const t0 = Date.parse('2026-11-25T08:00:00Z');
  let r = J.calculer(e, ctx);
  assert.equal(J2.usine(e, ctx, r, t0).tauxHeure, 0);
  ctx.fiches.filter((f) => f.theme === 'probas').forEach((f) => { e.cartes[f.id] = { vu: 3, rep: 3, intervalle: 30, notes: [2, 2, 3], echeance: '2027-01-01' }; });
  r = J.calculer(e, ctx);
  assert.equal(J2.collecter(e, ctx, r, t0), 0, 'démarrage');
  const u = J2.usine(e, ctx, r, t0 + 100 * 3600000);
  assert.ok(u.tauxHeure > 0 && u.plein);
  assert.equal(u.stock, u.tauxHeure * u.capacite, 'plafonné à la capacité');
  const m = J2.collecter(e, ctx, r, t0 + 100 * 3600000);
  assert.equal(J.desk(e).capital, 100000 + m);
  // des révisions en retard font ralentir la machine
  ctx.fiches.filter((f) => f.theme === 'probas').forEach((f) => { e.cartes[f.id].echeance = '2026-01-01'; });
  assert.equal(J2.usine(e, ctx, J.calculer(e, ctx), t0).machines[0].etat, 'enrayee');
  // achat : amélioration payée par le capital, production ×1,5
  ctx.fiches.filter((f) => f.theme === 'probas').forEach((f) => { e.cartes[f.id].echeance = '2027-01-01'; });
  r = J.calculer(e, ctx);
  const avant = J2.usine(e, ctx, r, t0).machines[0].taux;
  assert.ok(J2.acheter(e, ctx, r, 'esperance-variance-covariance', t0 + 1));
  assert.ok(Math.abs(J2.usine(e, ctx, r, t0).machines[0].taux - avant * 1.5) <= 1);
  assert.ok(J.desk(e).capital < 100000 + m);
});

test('événement de la semaine et bonus de retour', () => {
  const ctx = contexte();
  const e = vide();
  assert.ok(J.evenement(ctx));
  e.jours['2026-11-20'] = { revues: 3 };
  assert.ok(J.retour(e, JOUR));
  e.jours['2026-11-24'] = { revues: 3 };
  assert.ok(!J.retour(e, JOUR));
  e.jours = { '2026-11-20': { revues: 3 } };
  const q = J.calculer(e, ctx).quetes;
  assert.ok(q.double && q.jour[0].xp === 2 * J.BAREME.quete);
});
