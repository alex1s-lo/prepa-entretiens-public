// Synchronisation : fusion de deux progressions et chiffrement (sans réseau).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const S = require(path.join(__dirname, '..', '..', 'app', 'synchro.js'));

function etat() {
  return { version: 1, cartes: {}, jours: {}, calcul: [], marche: [], entretiens: [], tests: [], kelly: [], journal: [],
    histoires: {}, perso: [], notes: {}, cours: { exercices: {}, lus: {}, demos: {} }, reglages: { profils: ['hf'], theme: 'auto' } };
}
// applique une modification sur un appareil, horodatée comme le fait l'application à l'enregistrement
function modifier(e, t, f) {
  const avant = S.entrees(e);
  f(e);
  S.horodater(e, avant, t);
}

test('la modification la plus récente gagne, élément par élément', () => {
  const pc = etat(), tel = etat();
  modifier(pc, 1000, function (e) { e.cartes.a = { vu: 1, derniere: '2026-11-20' }; e.histoires.presente = 'version PC'; });
  modifier(tel, 2000, function (e) { e.cartes.b = { vu: 2, derniere: '2026-11-21' }; e.histoires.presente = 'version téléphone'; });
  modifier(pc, 3000, function (e) { e.notes.a = 'note du PC'; });
  const f = S.fusionnerEtats(pc, tel);
  assert.deepEqual(Object.keys(f.cartes).sort(), ['a', 'b']);
  assert.equal(f.histoires.presente, 'version téléphone');
  assert.equal(f.notes.a, 'note du PC');
  // fusion symétrique sur le contenu
  const g = S.fusionnerEtats(tel, pc);
  assert.deepEqual(S.entrees(g), S.entrees(f));
});

test('une suppression récente se propage, une suppression ancienne non', () => {
  const pc = etat();
  modifier(pc, 1000, function (e) { e.journal.push({ id: 'e1', entreprise: 'A' }, { id: 'e2', entreprise: 'B' }); });
  const tel = JSON.parse(JSON.stringify(pc));
  modifier(tel, 2000, function (e) { e.journal = e.journal.filter(function (x) { return x.id !== 'e1'; }); });
  modifier(pc, 3000, function (e) { e.journal[1].entreprise = 'B modifiée'; });
  const f = S.fusionnerEtats(pc, tel);
  assert.deepEqual(f.journal.map(function (x) { return x.id; }), ['e2']);
  assert.equal(f.journal[0].entreprise, 'B modifiée');
});

test('historiques réunis sans doublon, activité au maximum par jour', () => {
  const pc = etat(), tel = etat();
  const s1 = { date: '2026-11-20', score: 40 };
  pc.calcul.push(s1); tel.calcul.push(s1, { date: '2026-11-21', score: 45 });
  pc.jours['2026-11-21'] = { revues: 10, calcul: 1 };
  tel.jours['2026-11-21'] = { revues: 4, cours: 2 };
  const f = S.fusionnerEtats(pc, tel);
  assert.equal(f.calcul.length, 2);
  assert.deepEqual(f.jours['2026-11-21'], { revues: 10, calcul: 1, cours: 2 });
});

test('sans horodatage (anciennes données), la carte la plus récemment révisée gagne', () => {
  const pc = etat(), tel = etat();
  pc.cartes.x = { vu: 3, derniere: '2026-11-10' };
  tel.cartes.x = { vu: 1, derniere: '2026-11-15' };
  assert.equal(S.fusionnerEtats(pc, tel).cartes.x.derniere, '2026-11-15');
  assert.equal(S.fusionnerEtats(tel, pc).cartes.x.derniere, '2026-11-15');
});

test('un appareil neuf récupère tout, sans rien écraser avec ses valeurs par défaut', () => {
  const pc = etat();
  modifier(pc, 5000, function (e) { e.reglages = { profils: ['mm', 'hf'], theme: 'dark' }; e.cours.lus['ch-1'] = true; });
  const neuf = etat();
  const f = S.fusionnerEtats(neuf, pc);
  assert.deepEqual(f.reglages, { profils: ['mm', 'hf'], theme: 'dark' });
  assert.equal(f.cours.lus['ch-1'], true);
});

test('chiffrement : aller-retour, et phrase de passe fausse refusée', async () => {
  const e = etat();
  e.histoires.presente = 'Bonjour, je suis…';
  const chiffre = await S.chiffrer(e, 'cheval correct batterie agrafe');
  assert.ok(!chiffre.includes('Bonjour'), 'le texte clair ne doit pas apparaître');
  assert.deepEqual(await S.dechiffrer(chiffre, 'cheval correct batterie agrafe'), e);
  await assert.rejects(S.dechiffrer(chiffre, 'mauvaise phrase'), /Phrase de passe incorrecte/);
});

test('code de liaison et nom de dépôt', () => {
  const c = { depot: 'moi/prepa-sauvegarde', jeton: 'github_pat_abc', phrase: 'quatre mots au hasard' };
  assert.deepEqual(S.lireCodeLiaison(S.codeLiaison(c)), c);
  assert.equal(S.normaliserDepot('https://github.com/moi/prepa-sauvegarde.git'), 'moi/prepa-sauvegarde');
  assert.equal(S.normaliserDepot('pas un dépôt'), null);
});
