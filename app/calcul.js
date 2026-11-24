// Générateurs de calcul mental (tests numériques des teneurs de marché) et de suites logiques.
// Chaque question : { type, texte, reponse, tolerance }. Les décimaux sont construits en entiers pour éviter les
// erreurs d'arrondi binaire (0,1 + 0,2).
(function (racine) {
  'use strict';
  const outils = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Prepa.outils;
  const entier = outils.entier;
  const choisir = outils.choisir;

  const TYPES = {
    add: 'Additions',
    sub: 'Soustractions',
    mul: 'Multiplications',
    div: 'Divisions',
    frac: 'Fractions → décimaux',
    pct: 'Pourcentages',
    carre: 'Carrés',
    suite: 'Suites logiques',
    estim: 'Estimations (à 5 % près)',
    pricing: 'Pricing d\u2019options de tête',
    proba: 'Probabilités rapides'
  };

  // Écrit un nombre à la française (virgule), sans zéros inutiles.
  function fr(n) {
    const s = String(Math.round(n * 1e6) / 1e6);
    return s.replace('-', '−').replace('.', ',');
  }
  // n / 10^p, exact pour l'affichage
  function dec(n, p) { return Math.round(n) / Math.pow(10, p); }

  function addition(niveau, alea) {
    if (niveau === 1) { const a = entier(alea, 12, 99), b = entier(alea, 12, 99); return q('add', fr(a) + ' + ' + fr(b), a + b); }
    if (niveau === 2) {
      if (alea() < 0.5) { const a = entier(alea, 100, 999), b = entier(alea, 25, 999); return q('add', fr(a) + ' + ' + fr(b), a + b); }
      const a = entier(alea, 11, 999), b = entier(alea, 11, 999);
      return q('add', fr(dec(a, 1)) + ' + ' + fr(dec(b, 1)), dec(a + b, 1));
    }
    const a = entier(alea, 101, 9999), b = entier(alea, 11, 999), pa = choisir(alea, [1, 2]), pb = choisir(alea, [1, 2]);
    const p = Math.max(pa, pb);
    const na = a * Math.pow(10, p - pa), nb = b * Math.pow(10, p - pb);
    return q('add', fr(dec(a, pa)) + ' + ' + fr(dec(b, pb)), dec(na + nb, p));
  }

  function soustraction(niveau, alea) {
    if (niveau === 1) { const b = entier(alea, 11, 89), a = b + entier(alea, 5, 99); return q('sub', fr(a) + ' − ' + fr(b), a - b); }
    if (niveau === 2) {
      if (alea() < 0.5) { const a = entier(alea, 200, 999), b = entier(alea, 25, a - 10); return q('sub', fr(a) + ' − ' + fr(b), a - b); }
      const a = entier(alea, 100, 999), b = entier(alea, 11, 999);
      return q('sub', fr(dec(a, 1)) + ' − ' + fr(dec(b, 1)), dec(a - b, 1));
    }
    const a = entier(alea, 101, 9999), b = entier(alea, 101, 9999), pa = choisir(alea, [1, 2]), pb = choisir(alea, [1, 2]);
    const p = Math.max(pa, pb);
    const na = a * Math.pow(10, p - pa), nb = b * Math.pow(10, p - pb);
    return q('sub', fr(dec(a, pa)) + ' − ' + fr(dec(b, pb)), dec(na - nb, p));
  }

  function multiplication(niveau, alea) {
    if (niveau === 1) {
      const a = entier(alea, 12, 99), b = entier(alea, 3, 9);
      return q('mul', fr(a) + ' × ' + fr(b), a * b);
    }
    if (niveau === 2) {
      const r = alea();
      if (r < 0.45) { const a = entier(alea, 12, 99), b = entier(alea, 11, 49); return q('mul', fr(a) + ' × ' + fr(b), a * b); }
      if (r < 0.75) { // 0,25 × 48 ; 1,5 × 36
        const d = choisir(alea, [[25, 2], [75, 2], [125, 2], [15, 1], [5, 1], [35, 1], [45, 1], [12, 1], [2, 1], [25, 1]]);
        const b = entier(alea, 12, 96);
        return q('mul', fr(dec(d[0], d[1])) + ' \u00d7 ' + fr(b), dec(d[0] * b, d[1]));
      }
      const a = entier(alea, 101, 999), b = entier(alea, 3, 9);
      return q('mul', fr(a) + ' × ' + fr(b), a * b);
    }
    const r = alea();
    if (r < 0.4) { const a = entier(alea, 101, 999), b = entier(alea, 11, 99); return q('mul', fr(a) + ' × ' + fr(b), a * b); }
    const a = entier(alea, 11, 99), b = entier(alea, 11, 99), pa = choisir(alea, [1, 2]), pb = choisir(alea, [1, 2]);
    return q('mul', fr(dec(a, pa)) + ' × ' + fr(dec(b, pb)), dec(a * b, pa + pb));
  }

  function division(niveau, alea) {
    if (niveau === 1) { const b = entier(alea, 3, 9), r = entier(alea, 4, 25); return q('div', fr(b * r) + ' ÷ ' + fr(b), r); }
    if (niveau === 2) {
      if (alea() < 0.6) { const b = entier(alea, 11, 25), r = entier(alea, 3, 40); return q('div', fr(b * r) + ' ÷ ' + fr(b), r); }
      const b = choisir(alea, [2, 4, 5, 8]), n = entier(alea, 11, 199);
      return q('div', fr(n) + ' \u00f7 ' + fr(b), n / b);
    }
    if (alea() < 0.5) { // 7,2 ÷ 0,9
      const b = entier(alea, 2, 9), r = entier(alea, 2, 30), pb = choisir(alea, [1, 2]), pn = choisir(alea, [0, 1]);
      // num = (b/10^pb) * (r/10^pn) → affiché à (pb+pn) décimales
      return q('div', fr(dec(b * r, pb + pn)) + ' ÷ ' + fr(dec(b, pb)), dec(r, pn));
    }
    const b = entier(alea, 12, 49), r = entier(alea, 12, 99);
    return q('div', fr(b * r) + ' ÷ ' + fr(b), r);
  }

  function fraction(niveau, alea) {
    if (niveau === 1) {
      const d = choisir(alea, [2, 4, 5, 8, 10, 20, 25]);
      const n = entier(alea, 1, d - 1);
      return q('frac', n + '/' + d + ' en décimal', n / d);
    }
    const d = niveau === 2 ? choisir(alea, [3, 6, 7, 8, 9, 11, 12, 16]) : choisir(alea, [7, 11, 12, 13, 15, 16, 17, 19, 24, 32]);
    let n = entier(alea, 1, d - 1);
    if (niveau === 3 && alea() < 0.4) n = entier(alea, d + 1, 3 * d);
    return q('frac', n + '/' + d + ' en décimal (3 chiffres)', n / d, 0.0015);
  }

  function pourcentage(niveau, alea) {
    if (niveau === 1) {
      const p = choisir(alea, [10, 20, 25, 50, 5, 75]), b = entier(alea, 2, 40) * 20;
      return q('pct', p + ' % de ' + fr(b), p * b / 100);
    }
    if (niveau === 2) {
      const p = choisir(alea, [15, 12.5, 35, 2.5, 45, 8, 60, 120]), b = entier(alea, 2, 60) * 40;
      return q('pct', fr(p) + ' % de ' + fr(b), p * b / 100);
    }
    const r = alea();
    if (r < 0.35) {
      const x = choisir(alea, [10, 20, 25, 50]);
      return q('pct', '+' + x + ' % puis −' + x + ' % : variation totale en %', -x * x / 100);
    }
    if (r < 0.7) {
      const total = entier(alea, 2, 40) * 25, part = total * choisir(alea, [8, 12, 16, 24, 36, 44, 64, 72]) / 100;
      return q('pct', fr(part) + ' représente quel % de ' + fr(total) + ' ?', part / total * 100);
    }
    const p = choisir(alea, [1.5, 3.5, 6.5, 0.4]), b = entier(alea, 4, 80) * 50;
    return q('pct', fr(p) + ' % de ' + fr(b), Math.round(p * b * 1e4) / 1e6);
  }

  function carre(niveau, alea) {
    const n = niveau === 1 ? entier(alea, 11, 25) : niveau === 2 ? entier(alea, 26, 99) : choisir(alea, [entier(alea, 101, 130), entier(alea, 26, 99) / 10]);
    const texte = fr(n) + '²';
    return q('carre', texte, Math.round(n * n * 100) / 100);
  }

  // --- Suites logiques ------------------------------------------------------------------------------------------------
  function suite(niveau, alea) {
    const genres = niveau === 1 ? ['arith', 'geom', 'carres', 'diff'] :
      niveau === 2 ? ['diff', 'fibo', 'alterne', 'affine', 'carres', 'geom'] :
        ['fibo', 'alterne', 'affine', 'diff2', 'premiers', 'produit', 'cubes'];
    const genre = choisir(alea, genres);
    let t = [];
    if (genre === 'arith') { const a = entier(alea, 1, 30), d = choisir(alea, [3, 4, 6, 7, 9, 11, -4, -7]); for (let i = 0; i < 6; i++) t.push(a + i * d); }
    else if (genre === 'geom') { const a = entier(alea, 1, 5), r = choisir(alea, [2, 3, -2, 4]); for (let i = 0; i < 6; i++) t.push(a * Math.pow(r, i)); }
    else if (genre === 'carres') { const c = entier(alea, -3, 5), s = entier(alea, 1, 6); for (let i = 0; i < 6; i++) t.push((s + i) * (s + i) + c); }
    else if (genre === 'cubes') { const s = entier(alea, 1, 4); for (let i = 0; i < 6; i++) t.push(Math.pow(s + i, 3) - (s + i)); }
    else if (genre === 'diff') { const a = entier(alea, 1, 20), d = entier(alea, 1, 5), k = entier(alea, 1, 3); let x = a; for (let i = 0; i < 6; i++) { t.push(x); x += d + i * k; } }
    else if (genre === 'diff2') { const a = entier(alea, 1, 10); let x = a, d = 1; for (let i = 0; i < 6; i++) { t.push(x); x += d; d *= 2; } }
    else if (genre === 'fibo') { let a = entier(alea, 1, 6), b = entier(alea, a, 9); for (let i = 0; i < 6; i++) { t.push(a); const c = a + b; a = b; b = c; } }
    else if (genre === 'alterne') {
      const a = entier(alea, 1, 20), b = entier(alea, 20, 60), da = choisir(alea, [2, 3, 5]), db = choisir(alea, [-1, -2, -4, 3]);
      for (let i = 0; i < 6; i++) t.push(i % 2 === 0 ? a + (i / 2) * da : b + ((i - 1) / 2) * db);
    }
    else if (genre === 'affine') { const m = choisir(alea, [2, 3]), c = choisir(alea, [1, -1, 2, -3]); let x = entier(alea, 1, 5); for (let i = 0; i < 6; i++) { t.push(x); x = m * x + c; } }
    else if (genre === 'premiers') { const p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]; const s = entier(alea, 0, 6); const k = choisir(alea, [1, 2]); for (let i = 0; i < 6; i++) t.push(k * p[s + i]); }
    else if (genre === 'produit') { let x = 1, f = entier(alea, 1, 2); for (let i = 0; i < 6; i++) { t.push(x); x *= (f + i); } }
    const reponse = t.pop();
    return { type: 'suite', genre: genre, texte: t.map(fr).join(' ; ') + ' ; ?', reponse: reponse, tolerance: 0 };
  }

  // --- Estimations : la réponse exacte est calculée, on accepte 5 % d'écart -------------------------------------------
  function estimation(niveau, alea) {
    const genres = niveau === 1 ? ['produit', 'racine', 'compose', 'division'] :
      niveau === 2 ? ['produit', 'racine', 'compose', 'puissance', 'division', 'exp'] :
        ['produit3', 'compose', 'puissance2', 'factorielle', 'exp', 'ln', 'racine'];
    const g = choisir(alea, genres);
    let texte, v;
    if (g === 'produit') { const a = entier(alea, 23, 989), b = entier(alea, 13, 97); texte = fr(a) + ' \u00d7 ' + fr(b); v = a * b; }
    else if (g === 'produit3') { const a = entier(alea, 101, 999), b = entier(alea, 101, 999), c = entier(alea, 11, 99); texte = fr(a) + ' \u00d7 ' + fr(b) + ' \u00d7 ' + fr(c); v = a * b * c; }
    else if (g === 'division') { const a = entier(alea, 1000, 99999), b = entier(alea, 13, 97); texte = fr(a) + ' \u00f7 ' + fr(b); v = a / b; }
    else if (g === 'racine') { const n = entier(alea, 11, niveau === 1 ? 500 : 9999); texte = '\u221a' + fr(n); v = Math.sqrt(n); }
    else if (g === 'compose') {
      const t = entier(alea, 2, 12), n = entier(alea, 5, 30), c = choisir(alea, [100, 1000, 5000]);
      texte = fr(c) + ' \u20ac placés à ' + t + ' % par an pendant ' + n + ' ans'; v = c * Math.pow(1 + t / 100, n);
    }
    else if (g === 'puissance') { const n = entier(alea, 16, 40); texte = '2^' + n; v = Math.pow(2, n); }
    else if (g === 'puissance2') { const b = choisir(alea, [3, 5, 7, 1.1, 1.5]), n = b < 2 ? entier(alea, 10, 40) : entier(alea, 6, 15); texte = fr(b) + '^' + n; v = Math.pow(b, n); }
    else if (g === 'factorielle') { const n = entier(alea, 7, 14); texte = n + '!'; v = factorielle(n); }
    else if (g === 'exp') { const x = entier(alea, 15, 70) / 10; texte = 'e^' + fr(x); v = Math.exp(x); }
    else { const n = entier(alea, 3, 5000); texte = 'ln ' + fr(n); v = Math.log(n); }
    return { type: 'estim', genre: g, texte: 'Estime : ' + texte, reponse: v, tolerance: 0.05 };
  }

  function factorielle(n) { let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; }

  // --- Pricing d'options de tête : réponse exacte par Black-Scholes, tolérance d'approximation -------------------------
  // Fonction de répartition normale (erfc de Numerical Recipes, erreur relative < 1,2e-7).
  function N(x) {
    const z = Math.abs(x) / Math.SQRT2;
    const t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? 1 - r / 2 : r / 2;
  }
  function phi(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
  // Call et put européens (taux r continu, pas de dividende).
  function bs(S, K, sigma, T, r) {
    const st = sigma * Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / st, d2 = d1 - st;
    const call = S * N(d1) - K * Math.exp(-r * T) * N(d2);
    return { call: call, put: call - S + K * Math.exp(-r * T), delta: N(d1), vega: S * phi(d1) * Math.sqrt(T), d1: d1, d2: d2 };
  }

  // --- Probabilités rapides : réponses exactes par dénombrement --------------------------------------------------------
  function comb(n, k) { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }

  function probaQuestion(niveau, alea) {
    const genres = niveau === 1 ? ['somme2', 'aumoins', 'binom', 'attente', 'urne'] :
      niveau === 2 ? ['somme2', 'aumoins', 'binom', 'max', 'urne', 'cartes', 'condition'] :
        ['binom', 'max', 'urne', 'cartes', 'condition', 'somme3', 'variance'];
    const g = choisir(alea, genres);
    let texte, v;
    if (g === 'somme2') {
      const k = entier(alea, 3, 11);
      let n = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === k) n++;
      texte = 'Deux dés : P(somme = ' + k + ')'; v = n / 36;
    } else if (g === 'somme3') {
      const k = entier(alea, 5, 16);
      let n = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) if (a + b + c === k) n++;
      texte = 'Trois dés : P(somme = ' + k + ')'; v = n / 216;
    } else if (g === 'aumoins') {
      const n = entier(alea, 2, 8);
      texte = n + ' lancers de dé : P(au moins un 6)'; v = 1 - Math.pow(5 / 6, n);
    } else if (g === 'binom') {
      const n = entier(alea, 3, niveau === 1 ? 6 : 10), k = entier(alea, 0, n);
      texte = n + ' lancers de pièce : P(exactement ' + k + ' pile' + (k > 1 ? 's' : '') + ')'; v = comb(n, k) / Math.pow(2, n);
    } else if (g === 'attente') {
      const m = entier(alea, 1, 3);
      texte = 'Nombre moyen de lancers de dé pour obtenir ' + (m === 1 ? 'un 6' : m === 2 ? 'un 5 ou un 6' : 'un 4, 5 ou 6'); v = 6 / m;
    } else if (g === 'max') {
      const n = entier(alea, 2, 3);
      let tot = 0, cas = 0;
      const rec = function (reste, mx) { if (!reste) { tot += mx; cas++; return; } for (let f = 1; f <= 6; f++) rec(reste - 1, Math.max(mx, f)); };
      rec(n, 0);
      texte = n + ' dés : espérance du plus grand résultat'; v = tot / cas;
    } else if (g === 'urne') {
      const r = entier(alea, 2, 6), b = entier(alea, 2, 6);
      texte = 'Urne de ' + r + ' rouges et ' + b + ' bleues, 2 tirages sans remise : P(deux rouges)'; v = r * (r - 1) / ((r + b) * (r + b - 1));
    } else if (g === 'cartes') {
      const c = choisir(alea, ['as', 'couleur', 'paire']);
      if (c === 'as') { texte = '2 cartes d\u2019un jeu de 52 : P(deux as)'; v = (4 / 52) * (3 / 51); }
      else if (c === 'couleur') { texte = '2 cartes d\u2019un jeu de 52 : P(même couleur, cœur/carreau/trèfle/pique)'; v = 12 / 51; }
      else { texte = '2 cartes d\u2019un jeu de 52 : P(même valeur)'; v = 3 / 51; }
    } else if (g === 'condition') {
      const d = entier(alea, 1, 6), k = entier(alea, 8, 11);
      let n = 0;
      for (let b = 1; b <= 6; b++) if (d + b >= k) n++;
      texte = 'Deux dés, le premier fait ' + d + ' : P(somme \u2265 ' + k + ')'; v = n / 6;
    } else {
      const n = entier(alea, 2, 5);
      texte = 'Variance de la somme de ' + n + ' dés'; v = n * 35 / 12;
    }
    return { type: 'proba', genre: g, texte: texte, reponse: v, tolerance: 0.005 };
  }

  function pricingQuestion(niveau, alea) {
    const genres = niveau === 1 ? ['atm', 'straddle', 'parite', 'mouvement'] :
      niveau === 2 ? ['atm', 'straddle', 'parite', 'forward', 'mouvement', 'delta', 'vega'] :
        ['atm', 'straddle-vol', 'forward', 'delta', 'vega', 'digitale', 'parite-taux'];
    const g = choisir(alea, genres);
    const S = choisir(alea, [50, 80, 100, 120, 200, 250, 400]);
    const sigma = choisir(alea, [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]);
    const mois = choisir(alea, [1, 3, 4, 6, 9, 12, 24]);
    const T = mois / 12;
    const echeance = mois === 12 ? '1 an' : mois === 24 ? '2 ans' : mois + ' mois';
    const pct = function (x) { return fr(Math.round(x * 1000) / 10) + ' %'; };
    let texte, v, tol = 0.03;
    if (g === 'atm') {
      const put = alea() < 0.3;
      texte = (put ? 'Put' : 'Call') + ' à la monnaie, S = K = ' + S + ', \u03c3 = ' + pct(sigma) + ', ' + echeance + ', taux nuls : prix';
      v = put ? bs(S, S, sigma, T, 0).put : bs(S, S, sigma, T, 0).call;
    } else if (g === 'straddle') {
      texte = 'Straddle à la monnaie, S = ' + S + ', \u03c3 = ' + pct(sigma) + ', ' + echeance + ', taux nuls : prix';
      v = 2 * bs(S, S, sigma, T, 0).call;
    } else if (g === 'straddle-vol') {
      const prix = Math.round(2 * bs(S, S, sigma, T, 0).call * 10) / 10;
      texte = 'Straddle à la monnaie à ' + echeance + ' sur S = ' + S + ' coté ' + fr(prix) + ' (taux nuls) : volatilité implicite en %';
      let lo = 0.001, hi = 3;
      for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (2 * bs(S, S, m, T, 0).call < prix) lo = m; else hi = m; }
      v = 100 * lo;
    } else if (g === 'parite') {
      const K = Math.round(S * choisir(alea, [1, 1.05, 1.1, 1.2])); // put à la monnaie ou dans la monnaie : prix significatif
      const c = Math.round(bs(S, K, sigma, T, 0).call * 100) / 100;
      texte = 'Taux nuls, S = ' + S + ', call de strike ' + K + ' à ' + fr(c) + ' : prix du put de même strike';
      v = c - S + K; tol = 0.002;
    } else if (g === 'parite-taux') {
      const K = Math.round(S * choisir(alea, [1, 1.05, 1.1])), r = choisir(alea, [0.02, 0.03, 0.05]);
      const c = Math.round(bs(S, K, sigma, T, r).call * 100) / 100;
      texte = 'Taux continu ' + pct(r) + ', S = ' + S + ', ' + echeance + ', call de strike ' + K + ' à ' + fr(c) + ' : prix du put';
      v = c - S + K * Math.exp(-r * T); tol = 0.005;
    } else if (g === 'forward') {
      const r = choisir(alea, [0.02, 0.03, 0.04, 0.05]), q = choisir(alea, [0, 0.01, 0.02, 0.03]);
      texte = 'Forward à ' + echeance + ' : S = ' + S + ', taux ' + pct(r) + ', dividende continu ' + pct(q);
      v = S * Math.exp((r - q) * T); tol = 0.002;
    } else if (g === 'mouvement') {
      texte = 'Volatilité annuelle ' + pct(sigma) + ' sur S = ' + S + ' : mouvement quotidien typique (un écart-type), en points';
      v = S * sigma / Math.sqrt(252); tol = 0.05;
    } else if (g === 'delta') {
      texte = 'Delta d\u2019un call à la monnaie, \u03c3 = ' + pct(sigma) + ', ' + echeance + ', taux nuls';
      v = bs(S, S, sigma, T, 0).delta; tol = 0.02;
    } else if (g === 'vega') {
      texte = 'Call à la monnaie, S = ' + S + ', ' + echeance + ', \u03c3 = ' + pct(sigma) + ', taux nuls : hausse du prix pour +1 point de vol';
      v = bs(S, S, sigma, T, 0).vega / 100; tol = 0.03;
    } else {
      texte = 'Digitale qui paie 1 si S_T > S\u2080, \u03c3 = ' + pct(sigma) + ', ' + echeance + ', taux nuls : prix';
      v = N(bs(S, S, sigma, T, 0).d2); tol = 0.02;
    }
    return { type: 'pricing', genre: g, texte: texte, reponse: v, tolerance: tol };
  }

  function q(type, texte, reponse, tolerance) {
    return { type: type, texte: texte, reponse: Math.round(reponse * 1e9) / 1e9, tolerance: tolerance || 0 };
  }

  const GENERATEURS = { add: addition, sub: soustraction, mul: multiplication, div: division, frac: fraction,
    pct: pourcentage, carre: carre, suite: suite, estim: estimation, pricing: pricingQuestion, proba: probaQuestion };

  function generer(type, niveau, alea) {
    const g = GENERATEURS[type];
    if (!g) throw new Error('type inconnu : ' + type);
    return g(niveau || 2, alea || Math.random);
  }

  // Tire un type au hasard parmi « types » (un mélange façon test numérique si non précisé).
  function genererMelange(types, niveau, alea) {
    const a = alea || Math.random;
    const liste = types && types.length ? types : ['add', 'sub', 'mul', 'div'];
    return generer(choisir(a, liste), niveau, a);
  }

  function verifier(question, saisie) {
    const v = outils.lireNombre(saisie);
    if (!isFinite(v)) return false;
    if (!question.tolerance) return Math.abs(v - question.reponse) < 1e-6 * Math.max(1, Math.abs(question.reponse));
    if (question.type === 'estim' || question.type === 'pricing' || question.type === 'proba') return Math.abs(v - question.reponse) <= question.tolerance * Math.abs(question.reponse);
    return Math.abs(v - question.reponse) <= question.tolerance * Math.max(1, Math.abs(question.reponse));
  }

  // Formats de session proposés à l'écran.
  const FORMATS = [
    { id: 'test80', nom: '80 questions en 8 minutes', detail: 'Le format de test numérique le plus cité chez les teneurs de marché : rythme de 6 s par question.', duree: 480, max: 80, types: ['add', 'sub', 'mul', 'div', 'frac', 'pct'], niveau: 2 },
    { id: 'sprint2', nom: 'Sprint de 2 minutes', detail: 'Échauffement quotidien : autant de bonnes réponses que possible.', duree: 120, max: 0, types: ['add', 'sub', 'mul', 'div'], niveau: 2 },
    { id: 'estimation', nom: 'Ordres de grandeur (4 min)', detail: 'Estimer à 5 % près : produits, racines, puissances, intérêts composés. Pour 8,6 milliards, tape 8,6e9.', duree: 240, max: 0, types: ['estim'], niveau: 2 },
    { id: 'pricing', nom: 'Pricing de tête (5 min)', detail: 'Prix d\u2019options à la monnaie (0,4·\u03c3·S·\u221aT), straddles, parité, forwards, delta, vega. Une approximation à 3 % près suffit.', duree: 300, max: 0, types: ['pricing'], niveau: 2 },
    { id: 'probas', nom: 'Probabilités rapides (5 min)', detail: 'Dés, pièces, cartes, urnes : les calculs des tests en ligne des teneurs de marché. Réponse en fraction ou en décimal.', duree: 300, max: 0, types: ['proba'], niveau: 2 },
    { id: 'suites', nom: 'Suites logiques (5 min)', detail: 'Trouver le terme suivant : différences, rapports, suites entrelacées.', duree: 300, max: 0, types: ['suite'], niveau: 2 },
    { id: 'libre', nom: 'Entraînement libre', detail: 'Sans chrono global ; choisis les opérations et le niveau.', duree: 0, max: 0, types: null, niveau: 2 }
  ];

  const calcul = { TYPES: TYPES, FORMATS: FORMATS, generer: generer, genererMelange: genererMelange, verifier: verifier,
    suite: suite, fr: fr, bs: bs, N: N };
  if (typeof module !== 'undefined' && module.exports) module.exports = calcul;
  else (racine.Prepa = racine.Prepa || {}).calcul = calcul;
})(this);
