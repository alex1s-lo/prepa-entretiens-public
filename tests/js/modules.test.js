// Tests des modules purs de l'application (Node, sans dépendance) : node --test tests/js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const app = path.join(__dirname, '..', '..', 'app');
const o = require(path.join(app, 'outils.js'));
const srs = require(path.join(app, 'srs.js'));
const calcul = require(path.join(app, 'calcul.js'));
const marche = require(path.join(app, 'marche.js'));

test('lireNombre : formats acceptés', () => {
  const cas = [
    ['1/6', 1 / 6], ['0,1667', 0.1667], ['16,7 %', 0.167], ['16.7%', 0.167], ['  42 ', 42], ['-3', -3], ['−3', -3],
    ['e^-1', Math.exp(-1)], ['exp(-1)', Math.exp(-1)], ['sqrt(2)/2', Math.SQRT2 / 2], ['√2/2', Math.SQRT2 / 2],
    ['2pi', 2 * Math.PI], ['3^2', 9], ['2**10', 1024], ['ln 2', Math.LN2], ['ln(2)', Math.LN2], ['1e-3', 0.001],
    ['(1+2)*3', 9], ['2(3)', 6], ['5!', 120], ['1/sqrt(pi)', 1 / Math.sqrt(Math.PI)], ['161/36', 161 / 36], ['3 × 4', 12],
    ['10 ÷ 4', 2.5], ['.5', 0.5], ['2^-2', 0.25]
  ];
  for (const [saisie, attendu] of cas) {
    assert.ok(Math.abs(o.lireNombre(saisie) - attendu) < 1e-12, saisie + ' → ' + o.lireNombre(saisie));
  }
  for (const mauvais of ['', 'abc', '1/', '(1', '2)', 'foo(2)', '1,2,3', '--']) {
    assert.ok(Number.isNaN(o.lireNombre(mauvais)), mauvais + ' devrait être refusé');
  }
});

test('procheDe : tolérance relative', () => {
  assert.ok(o.procheDe(0.1667, 1 / 6, 0.005));
  assert.ok(!o.procheDe(0.18, 1 / 6, 0.005));
  assert.ok(o.procheDe(0, 0, 0.005));
  assert.ok(!o.procheDe(NaN, 1, 0.5));
  assert.ok(o.procheDe(253, 253, 0));
  assert.ok(!o.procheDe(252, 253, 0));
});

test('markdown : échappe le HTML et rend les blocs', () => {
  const h = o.markdown('**gras** et `code` <script>alert(1)</script>\n\n- un\n- deux\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n```python\nx = 1 < 2\n```');
  assert.ok(h.includes('<strong>gras</strong>'));
  assert.ok(h.includes('<code>code</code>'));
  assert.ok(!h.includes('<script>'));
  assert.ok(h.includes('&lt;script&gt;'));
  assert.ok(h.includes('<ul><li>un</li><li>deux</li></ul>'));
  assert.ok(h.includes('<th>a</th>'));
  assert.ok(h.includes('<pre><code>x = 1 &lt; 2</code></pre>'));
  assert.ok(!o.markdown('[x](javascript:alert(1))').includes('href'));
});

test('dates', () => {
  assert.equal(o.ajouterJours('2026-12-31', 1), '2027-01-01');
  assert.equal(o.ajouterJours('2027-03-01', -1), '2027-02-28');
  assert.equal(o.ecartJours('2026-11-24', '2027-03-01'), 97);
  assert.equal(o.dateLisible('2027-03-01'), '1 mars 2027');
});

test('hasard reproductible', () => {
  const a = o.hasard(42), b = o.hasard(42);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
  const m = o.melanger(o.hasard(1), [1, 2, 3, 4, 5]);
  assert.deepEqual([...m].sort(), [1, 2, 3, 4, 5]);
});

test('répétition espacée : intervalles croissants, raté remis à zéro', () => {
  const j = '2026-11-24';
  let e = srs.planifier(null, 2, j);
  assert.equal(e.intervalle, 1);
  assert.equal(e.echeance, '2026-11-25');
  e = srs.planifier(e, 2, e.echeance);
  assert.equal(e.intervalle, 3);
  e = srs.planifier(e, 2, e.echeance);
  assert.ok(e.intervalle >= 7);
  const avant = e.intervalle;
  e = srs.planifier(e, 3, e.echeance);
  assert.ok(e.intervalle > avant);
  e = srs.planifier(e, 0, '2027-01-10');
  assert.equal(e.intervalle, 0);
  assert.equal(e.echeance, '2027-01-10');
  assert.equal(e.rates, 1);
  assert.ok(e.facilite >= 1.3);
  assert.equal(srs.maitrise(e), 0.05);
  assert.throws(() => srs.planifier(null, 5, j));
  // la facilité ne descend jamais sous 1,3 et l'intervalle reste borné
  let x = null;
  for (let k = 0; k < 30; k++) x = srs.planifier(x, k % 2, j);
  assert.ok(x.facilite >= 1.3);
  let y = null;
  for (let k = 0; k < 30; k++) y = srs.planifier(y, 3, j);
  assert.ok(y.intervalle <= 120);
});

test('file du jour : dues d\'abord, nouvelles limitées et filtrées', () => {
  const fiches = [];
  const themes = ['probas', 'stats', 'derives'];
  for (let i = 0; i < 30; i++) fiches.push({ id: 'f' + i, theme: themes[i % 3], niveau: 1 + (i % 3), profils: i % 2 ? ['hf'] : ['mm'] });
  const etats = {
    f0: { echeance: '2026-11-20', intervalle: 1 }, f1: { echeance: '2026-11-24', intervalle: 1 }, f2: { echeance: '2026-12-01', intervalle: 7 }
  };
  const file = srs.construireFile(fiches, etats, { jour: '2026-11-24', nouveauxMax: 5, alea: o.hasard(3) });
  assert.deepEqual(file.slice(0, 2), ['f0', 'f1']);
  assert.equal(file.length, 7);
  assert.ok(!file.includes('f2'));
  const neuves = file.slice(2).map((id) => fiches.find((f) => f.id === id));
  assert.ok(neuves.every((f) => !etats[f.id]));
  assert.ok(new Set(neuves.map((f) => f.theme)).size >= 2, 'thèmes alternés');
  const deja = srs.construireFile(fiches, etats, { jour: '2026-11-24', nouveauxMax: 5, nouveauxFaits: 5 });
  assert.equal(deja.length, 2);
  const parProfil = srs.construireFile(fiches, {}, { jour: '2026-11-24', nouveauxMax: 50, profils: ['hf'] });
  assert.ok(parProfil.every((id) => fiches.find((f) => f.id === id).profils.includes('hf')));
  const parTheme = srs.construireFile(fiches, {}, { jour: '2026-11-24', nouveauxMax: 50, themes: ['stats'] });
  assert.equal(parTheme.length, 10);
  assert.deepEqual(srs.previsions(fiches, etats, '2026-11-24', 8), [2, 0, 0, 0, 0, 0, 0, 1]);
});

test('calcul mental : réponses exactes et vérification', () => {
  const alea = o.hasard(5);
  for (const type of Object.keys(calcul.TYPES)) {
    for (const niveau of [1, 2, 3]) {
      for (let k = 0; k < 300; k++) {
        const q = calcul.generer(type, niveau, alea);
        assert.ok(Number.isFinite(q.reponse), type + niveau + ' ' + q.texte);
        assert.ok(q.texte.length > 0);
        // recalcul indépendant à partir du texte affiché (sauf suites et phrases)
        const m = /^(−?[\d,]+) ([+−×÷]) ([\d,]+)$/.exec(q.texte);
        if (m) {
          const a = o.lireNombre(m[1]), b = o.lireNombre(m[3]);
          const v = { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[m[2]];
          assert.ok(Math.abs(v - q.reponse) < 1e-9 * Math.max(1, Math.abs(v)), q.texte + ' = ' + q.reponse + ' (attendu ' + v + ')');
        }
        assert.ok(calcul.verifier(q, String(q.reponse)), 'la bonne réponse est acceptée : ' + q.texte);
        assert.ok(calcul.verifier(q, String(q.reponse).replace('.', ',')), 'virgule acceptée');
        const relatif = type === 'estim' || type === 'pricing' || type === 'proba';
        const faux = relatif ? (q.reponse === 0 ? 0.1 : q.reponse * 1.08) : q.reponse + 1;
        assert.ok(!calcul.verifier(q, String(faux)), 'une mauvaise réponse est refusée : ' + q.texte);
        if (type === 'estim') assert.ok(calcul.verifier(q, String(q.reponse * 0.97)), 'estimation à 3 % acceptée : ' + q.texte);
        if (type === 'pricing') assert.ok(calcul.verifier(q, String(q.reponse * (1 + q.tolerance * 0.9))), 'pricing dans la tolérance : ' + q.texte);
      }
    }
  }
  const sq = calcul.generer('carre', 1, o.hasard(2));
  assert.equal(sq.reponse, Math.pow(o.lireNombre(sq.texte.replace('²', '')), 2));
});

test('pricing de tête : Black-Scholes de référence et approximations', () => {
  const v = calcul.bs(100, 100, 0.2, 1, 0);
  assert.ok(Math.abs(v.call - 7.965567) < 1e-4, 'call ATM ' + v.call);
  assert.ok(Math.abs(v.delta - 0.539828) < 1e-5);
  assert.ok(Math.abs(calcul.N(1.96) - 0.9750021) < 1e-6);
  assert.ok(Math.abs(calcul.N(-1) - 0.1586553) < 1e-6);
  const w = calcul.bs(100, 110, 0.25, 0.5, 0.03);
  assert.ok(Math.abs(w.call - w.put - (100 - 110 * Math.exp(-0.015))) < 1e-9, 'parité');
  // l'approximation 0,4·σ·S·√T doit être acceptée pour les calls à la monnaie générés
  const alea = o.hasard(31);
  let atm = 0;
  for (let k = 0; k < 2000; k++) {
    const q = calcul.generer('pricing', 1 + (k % 3), alea);
    assert.ok(Number.isFinite(q.reponse) && q.reponse > 0, q.texte);
    if (q.genre === 'atm' && /^Call/.test(q.texte) && /taux nuls/.test(q.texte)) {
      const S = Number(/S = K = (\d+)/.exec(q.texte)[1]);
      const sigma = o.lireNombre(/σ = ([\d,]+) %/.exec(q.texte)[1]) / 100;
      const T = /(\d+) mois/.test(q.texte) ? Number(/(\d+) mois/.exec(q.texte)[1]) / 12 : /2 ans/.test(q.texte) ? 2 : 1;
      if (sigma * Math.sqrt(T) <= 0.35) {
        atm++;
        assert.ok(calcul.verifier(q, String(0.4 * sigma * S * Math.sqrt(T))), 'approximation ATM refusée : ' + q.texte);
      }
    }
  }
  assert.ok(atm > 20);
});

test('probabilités rapides : réponses confirmées par simulation', () => {
  const alea = o.hasard(41);
  const sim = o.hasard(42);
  const de = () => 1 + Math.floor(sim() * 6);
  const vus = {};
  for (let k = 0; k < 400; k++) {
    const q = calcul.generer('proba', 1 + (k % 3), alea);
    if (vus[q.texte]) continue;
    vus[q.texte] = true;
    let m = null;
    const n = 40000;
    if ((m = /^Deux dés : P\(somme = (\d+)\)$/.exec(q.texte))) {
      let c = 0; for (let i = 0; i < n; i++) if (de() + de() === Number(m[1])) c++; m = c / n;
    } else if ((m = /^(\d+) lancers de dé : P\(au moins un 6\)$/.exec(q.texte))) {
      const r = Number(m[1]); let c = 0;
      for (let i = 0; i < n; i++) { let ok = false; for (let j = 0; j < r; j++) if (de() === 6) ok = true; if (ok) c++; } m = c / n;
    } else if ((m = /^Urne de (\d+) rouges et (\d+) bleues/.exec(q.texte))) {
      const r = Number(m[1]), b = Number(m[2]); let c = 0;
      for (let i = 0; i < n; i++) { const u = o.melanger(sim, Array(r).fill('R').concat(Array(b).fill('B'))); if (u[0] === 'R' && u[1] === 'R') c++; } m = c / n;
    } else if ((m = /^Variance de la somme de (\d+) dés$/.exec(q.texte))) {
      const r = Number(m[1]); let s1 = 0, s2 = 0;
      for (let i = 0; i < n; i++) { let t = 0; for (let j = 0; j < r; j++) t += de(); s1 += t; s2 += t * t; } m = s2 / n - (s1 / n) ** 2;
    } else continue;
    assert.ok(Math.abs(m - q.reponse) < 0.02 * Math.max(1, q.reponse), q.texte + ' : ' + q.reponse + ' contre ' + m);
  }
  assert.ok(Object.keys(vus).length > 30);
});

test('calcul mental : suites cohérentes', () => {
  const alea = o.hasard(9);
  for (let k = 0; k < 500; k++) {
    const s = calcul.suite(1 + (k % 3), alea);
    const termes = s.texte.replace(' ; ?', '').split(' ; ');
    assert.equal(termes.length, 5, s.texte);
    assert.ok(Number.isInteger(s.reponse), s.texte);
  }
});

test('market making : espérance, loi et bilan', () => {
  const p = marche.nouvellePartie({ jeu: 'des', n: 4, spreadMax: 2, informes: 0.5 }, o.hasard(4));
  assert.equal(marche.valeurJuste(p), 14);
  assert.ok(Math.abs(marche.ecartType(p) - Math.sqrt(4 * 35 / 12)) < 1e-12);
  assert.equal(marche.verifierCotation(p, 14, 13), 'L’ask doit être strictement au-dessus du bid.');
  assert.ok(marche.verifierCotation(p, 12, 15).startsWith('Écart maximal'));
  const alea = o.hasard(8);
  let tours = 0;
  while (!p.fini) {
    const j = marche.valeurJuste(p);
    marche.coter(p, j - 1, j + 1, alea);
    tours++;
  }
  assert.equal(tours, 4);
  const b = marche.bilan(p);
  const valeur = p.tirage.reduce((s, x) => s + x, 0);
  assert.equal(b.valeur, valeur);
  assert.ok(Math.abs(b.pnl - (p.cash + p.position * valeur)) < 1e-9);
  assert.throws(() => marche.coter(p, 1, 2, alea));
});

test('market making : cartes sans remise', () => {
  const p = marche.nouvellePartie({ jeu: 'cartes', n: 5, spreadMax: 6 }, o.hasard(11));
  assert.equal(marche.valeurJuste(p), 35);
  // espérance après une carte révélée : v + 4 × (364 − v)/51
  p.revele = 1;
  const v = p.tirage[0];
  assert.ok(Math.abs(marche.valeurJuste(p) - (v + 4 * (364 - v) / 51)) < 1e-9);
  // vérification Monte-Carlo de l'écart-type d'une somme de 5 cartes sans remise
  const alea = o.hasard(12);
  let s = 0, s2 = 0;
  const n = 40000;
  for (let i = 0; i < n; i++) {
    const t = marche.nouvellePartie({ jeu: 'cartes', n: 5 }, alea).tirage.reduce((a, x) => a + x, 0);
    s += t; s2 += t * t;
  }
  const sd = Math.sqrt(s2 / n - (s / n) ** 2);
  p.revele = 0;
  assert.ok(Math.abs(sd - marche.ecartType(p)) < 0.1, sd + ' contre ' + marche.ecartType(p));
});

test('Kelly : fraction optimale, croissance et rejeu des mêmes tirages', () => {
  const kelly = require(path.join(app, 'kelly.js'));
  assert.ok(Math.abs(kelly.fractionKelly(0.6, 1) - 0.2) < 1e-12);
  assert.ok(Math.abs(kelly.fractionKelly(0.4, 2) - 0.1) < 1e-12);
  assert.equal(kelly.fractionKelly(0.4, 1), 0);
  // la fraction de Kelly maximise la croissance
  const g = (f) => kelly.croissance(0.6, 1, f);
  for (const f of [0, 0.05, 0.1, 0.15, 0.25, 0.3, 0.4]) assert.ok(g(0.2) >= g(f));
  assert.ok(Math.abs(g(0.4)) < 0.005, 'double Kelly : croissance quasi nulle');
  const p = kelly.nouvellePartie({ p: 0.6, b: 1, tours: 50 }, o.hasard(7));
  for (let i = 0; i < 50; i++) kelly.parier(p, 0.2);
  assert.ok(p.fini);
  const meme = kelly.cheminConstant(p, 0.2);
  assert.ok(Math.abs(meme[50] - p.richesse) < 1e-9, 'rejouer la même fraction redonne la même richesse');
  assert.throws(() => kelly.parier(p, 0.1));
  // médiane exacte contre simulation
  const alea = o.hasard(13);
  const finales = [];
  for (let k = 0; k < 4001; k++) {
    const q = kelly.nouvellePartie({ p: 0.6, b: 1, tours: 30 }, alea);
    finales.push(kelly.cheminConstant(q, 0.2)[30]);
  }
  finales.sort((a, b) => a - b);
  assert.ok(Math.abs(finales[2000] / kelly.medianeApres(0.6, 1, 0.2, 30, 100) - 1) < 0.35);
  // tout miser sur un pari perdu ruine et termine la partie
  const r = kelly.nouvellePartie({ p: 0.0001, tours: 10 }, o.hasard(1));
  kelly.parier(r, 1);
  assert.ok(r.fini && r.richesse === 0);
});

test('market making : une cotation juste et serrée gagne en moyenne contre le bruit', () => {
  const alea = o.hasard(21);
  let total = 0;
  for (let k = 0; k < 2000; k++) {
    const p = marche.nouvellePartie({ jeu: 'des', n: 4, spreadMax: 2, informes: 0 }, alea);
    while (!p.fini) { const j = marche.valeurJuste(p); marche.coter(p, j - 1, j + 1, alea); }
    total += marche.bilan(p).pnl;
  }
  assert.ok(total / 2000 > 0, 'PnL moyen ' + total / 2000);
});
