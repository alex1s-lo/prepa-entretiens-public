// Widgets interactifs du cours : simulations à manipuler pour voir les théorèmes à l'œuvre.
// Chaque widget est une fonction (conteneur, paramètres) qui dessine ses commandes et sa toile.
(function (racine) {
  'use strict';
  const P = racine.Prepa = racine.Prepa || {};
  const o = P.outils;

  // --- Outils de dessin -------------------------------------------------------------------------------------------
  function couleurs() {
    const cs = racine.getComputedStyle(document.documentElement);
    const v = function (n) { return cs.getPropertyValue(n).trim() || '#888'; };
    return { texte: v('--texte'), doux: v('--texte-doux'), bord: v('--bord'), fond: v('--surface'), accent: v('--accent'),
      succes: v('--succes'), erreur: v('--erreur'), alerte: v('--alerte'), fort: v('--accent-fort') };
  }

  function toile(conteneur, rapport) {
    const c = document.createElement('canvas');
    c.setAttribute('role', 'img');
    conteneur.appendChild(c);
    c.rapport = rapport || 0.5;
    return c;
  }

  // Prépare le contexte : taille réelle selon la largeur affichée, repère [xmin, xmax] × [ymin, ymax].
  function repere(c, b) {
    const largeur = Math.max(280, c.clientWidth || c.parentNode.clientWidth || 600);
    const hauteur = Math.round(largeur * c.rapport);
    const dpr = racine.devicePixelRatio || 1;
    c.width = Math.round(largeur * dpr);
    c.height = Math.round(hauteur * dpr);
    c.style.height = hauteur + 'px';
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const col = couleurs();
    ctx.fillStyle = col.fond;
    ctx.fillRect(0, 0, largeur, hauteur);
    const m = { g: 44, d: 12, h: 12, b: 26 };
    const X = function (x) { return m.g + (x - b.xmin) / (b.xmax - b.xmin) * (largeur - m.g - m.d); };
    const Y = function (y) { return hauteur - m.b - (y - b.ymin) / (b.ymax - b.ymin) * (hauteur - m.h - m.b); };
    // grille et graduations
    ctx.strokeStyle = col.bord;
    ctx.lineWidth = 1;
    ctx.fillStyle = col.doux;
    ctx.font = '11px system-ui, sans-serif';
    const ticks = function (a, z, n) {
      const pas = Math.pow(10, Math.floor(Math.log10((z - a) / n)));
      const k = [1, 2, 2.5, 5, 10].map(function (f) { return f * pas; }).filter(function (p) { return (z - a) / p <= n; })[0] || pas * 10;
      const t = [];
      for (let v = Math.ceil(a / k) * k; v <= z + 1e-12; v += k) t.push(Math.abs(v) < 1e-12 ? 0 : v);
      return t;
    };
    ticks(b.ymin, b.ymax, 5).forEach(function (v) {
      ctx.beginPath(); ctx.moveTo(m.g, Y(v)); ctx.lineTo(largeur - m.d, Y(v)); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(b.fy ? b.fy(v) : fmt(v), m.g - 4, Y(v) + 4);
    });
    ticks(b.xmin, b.xmax, 7).forEach(function (v) {
      ctx.textAlign = 'center'; ctx.fillText(b.fx ? b.fx(v) : fmt(v), X(v), hauteur - 8);
    });
    return { ctx: ctx, X: X, Y: Y, col: col, largeur: largeur, hauteur: hauteur };
  }

  function fmt(v) {
    const a = Math.abs(v);
    if (a >= 1000) return String(Math.round(v));
    if (a >= 10) return String(Math.round(v * 10) / 10).replace('.', ',');
    return String(Math.round(v * 100) / 100).replace('.', ',');
  }
  function nb(v, n) { return o.formaterNombre(v, n || 4); }

  function ligne(r, points, couleur, epaisseur, pointille) {
    const ctx = r.ctx;
    ctx.strokeStyle = couleur;
    ctx.lineWidth = epaisseur || 1.6;
    ctx.setLineDash(pointille ? [5, 4] : []);
    ctx.beginPath();
    points.forEach(function (p, i) { if (i) ctx.lineTo(r.X(p[0]), r.Y(p[1])); else ctx.moveTo(r.X(p[0]), r.Y(p[1])); });
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function nuage(r, points, couleur, rayon) {
    const ctx = r.ctx;
    ctx.fillStyle = couleur;
    ctx.globalAlpha = 0.55;
    points.forEach(function (p) { ctx.beginPath(); ctx.arc(r.X(p[0]), r.Y(p[1]), rayon || 2, 0, 2 * Math.PI); ctx.fill(); });
    ctx.globalAlpha = 1;
  }
  function barres(r, bords, hauteurs, couleur) {
    const ctx = r.ctx;
    ctx.fillStyle = couleur;
    ctx.globalAlpha = 0.6;
    hauteurs.forEach(function (h, i) {
      const x0 = r.X(bords[i]), x1 = r.X(bords[i + 1]);
      ctx.fillRect(x0 + 0.5, r.Y(h), Math.max(1, x1 - x0 - 1), r.Y(0) - r.Y(h));
    });
    ctx.globalAlpha = 1;
  }

  // Commandes : curseurs et listes, avec la valeur affichée à côté du libellé.
  function commandes(conteneur, defs, surChangement) {
    const zone = document.createElement('div');
    zone.className = 'commandes';
    const valeurs = {};
    defs.forEach(function (d) {
      const lab = document.createElement('label');
      const id = 'w' + Math.random().toString(36).slice(2, 9);
      if (d.choix) {
        lab.innerHTML = '<span>' + o.echapper(d.libelle) + '</span><select id="' + id + '">' + d.choix.map(function (c) {
          return '<option value="' + o.echapper(c[0]) + '"' + (c[0] === d.valeur ? ' selected' : '') + '>' + o.echapper(c[1]) + '</option>';
        }).join('') + '</select>';
        valeurs[d.nom] = d.valeur;
      } else {
        lab.innerHTML = '<span>' + o.echapper(d.libelle) + ' : <b data-v></b></span><input type="range" id="' + id + '" min="' + d.min + '" max="' + d.max +
          '" step="' + d.pas + '" value="' + d.valeur + '">';
        valeurs[d.nom] = d.valeur;
      }
      lab.setAttribute('for', id);
      zone.appendChild(lab);
      const champ = lab.querySelector('input, select');
      const affiche = function () {
        const v = d.choix ? champ.value : Number(champ.value);
        valeurs[d.nom] = d.transforme ? d.transforme(v) : v;
        const b = lab.querySelector('[data-v]');
        if (b) b.textContent = d.format ? d.format(valeurs[d.nom]) : String(valeurs[d.nom]).replace('.', ',');
      };
      affiche();
      champ.addEventListener('input', function () { affiche(); surChangement(valeurs); });
    });
    // les commandes se placent au-dessus du premier graphique
    const premiere = conteneur.querySelector('canvas');
    if (premiere) conteneur.insertBefore(zone, premiere); else conteneur.appendChild(zone);
    return valeurs;
  }

  function entete(el, titre, texte) {
    el.innerHTML = '<div class="widget-titre">' + o.echapper(titre) + '</div>' + (texte ? '<p class="petit doux" style="margin:0 0 6px">' + texte + '</p>' : '');
  }
  function sortie(el) { const d = document.createElement('div'); d.className = 'sortie'; el.appendChild(d); return d; }
  function bouton(el, libelle, action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = libelle;
    b.addEventListener('click', action);
    el.appendChild(b);
    return b;
  }

  // --- Probabilités élémentaires ------------------------------------------------------------------------------------
  function gauss(alea) {
    let u = 0, v = 0;
    while (u === 0) u = alea();
    while (v === 0) v = alea();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function N(x) { // fonction de répartition normale (même formule que calcul.js)
    const z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? 1 - r / 2 : r / 2;
  }
  function phi(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
  function bs(S, K, s, T, r) {
    const st = s * Math.sqrt(T), d1 = (Math.log(S / K) + (r + s * s / 2) * T) / st, d2 = d1 - st;
    const c = S * N(d1) - K * Math.exp(-r * T) * N(d2);
    return { call: c, put: c - S + K * Math.exp(-r * T), d1: d1, d2: d2, delta: N(d1), gamma: phi(d1) / (S * st), vega: S * phi(d1) * Math.sqrt(T),
      theta: -S * phi(d1) * s / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * N(d2), rho: K * T * Math.exp(-r * T) * N(d2) };
  }

  // --- 1. Théorème central limite -----------------------------------------------------------------------------------
  function tcl(el) {
    entete(el, 'Théorème central limite', 'On tire 4 000 fois la somme de n variables, on la centre et on la réduit : (Sₙ − nμ)/(σ√n). L’histogramme se rapproche de la courbe de Gauss quand n grandit, quelle que soit la loi de départ.');
    const c = toile(el, 0.5);
    const lois = {
      de: { nom: 'dé à 6 faces', mu: 3.5, s: Math.sqrt(35 / 12), tire: function (a) { return 1 + Math.floor(6 * a()); } },
      unif: { nom: 'uniforme sur [0, 1]', mu: 0.5, s: Math.sqrt(1 / 12), tire: function (a) { return a(); } },
      expo: { nom: 'exponentielle (asymétrique)', mu: 1, s: 1, tire: function (a) { return -Math.log(1 - a()); } },
      bern: { nom: 'Bernoulli(0,1) (très asymétrique)', mu: 0.1, s: Math.sqrt(0.09), tire: function (a) { return a() < 0.1 ? 1 : 0; } }
    };
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'loi', libelle: 'Loi de départ', choix: [['de', 'Dé'], ['unif', 'Uniforme'], ['expo', 'Exponentielle'], ['bern', 'Bernoulli(0,1)']], valeur: 'expo' },
      { nom: 'n', libelle: 'Nombre de termes n', min: 1, max: 60, pas: 1, valeur: 1 }
    ], dessiner);
    function dessiner() {
      const loi = lois[v.loi], n = v.n, a = o.hasard(7 + n);
      const z = [];
      for (let k = 0; k < 4000; k++) {
        let s = 0;
        for (let j = 0; j < n; j++) s += loi.tire(a);
        z.push((s - n * loi.mu) / (loi.s * Math.sqrt(n)));
      }
      const bords = [], hist = [];
      for (let k = 0; k <= 40; k++) bords.push(-4 + k * 0.2);
      for (let k = 0; k < 40; k++) hist.push(0);
      z.forEach(function (x) { const i = Math.floor((x + 4) / 0.2); if (i >= 0 && i < 40) hist[i]++; });
      const dens = hist.map(function (h) { return h / (4000 * 0.2); });
      const r = repere(c, { xmin: -4, xmax: 4, ymin: 0, ymax: Math.max(0.5, Math.max.apply(null, dens) * 1.1) });
      barres(r, bords, dens, r.col.accent);
      const courbe = [];
      for (let x = -4; x <= 4.001; x += 0.05) courbe.push([x, phi(x)]);
      ligne(r, courbe, r.col.erreur, 2);
      const m = z.reduce(function (s, x) { return s + x; }, 0) / z.length;
      const sd = Math.sqrt(z.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / z.length);
      const asym = z.reduce(function (s, x) { return s + Math.pow((x - m) / sd, 3); }, 0) / z.length;
      out.innerHTML = 'Loi : ' + loi.nom + ' · moyenne ' + nb(m, 2) + ' · écart-type ' + nb(sd, 3) + ' · asymétrie ' + nb(asym, 2) +
        ' <span class="doux">(la courbe rouge est la densité N(0, 1) ; l’asymétrie décroît en 1/√n)</span>';
    }
    dessiner();
  }

  // --- 2. Covariance, Cholesky et variance d'un portefeuille ---------------------------------------------------------
  function covariance(el) {
    entete(el, 'Covariance et portefeuille à deux actifs', 'Rendements X₁ = σ₁Z₁ et X₂ = σ₂(ρZ₁ + √(1 − ρ²)Z₂) avec Z₁, Z₂ indépendantes : c’est la décomposition de Cholesky. Le tableau développe Var(w₁X₁ + w₂X₂) terme à terme.');
    const c = toile(el, 0.6);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 's1', libelle: 'σ₁', min: 5, max: 50, pas: 1, valeur: 20, format: function (x) { return x + ' %'; } },
      { nom: 's2', libelle: 'σ₂', min: 5, max: 50, pas: 1, valeur: 30, format: function (x) { return x + ' %'; } },
      { nom: 'rho', libelle: 'Corrélation ρ', min: -1, max: 1, pas: 0.05, valeur: 0.5, format: function (x) { return nb(x, 2); } },
      { nom: 'w', libelle: 'Poids w₁ (w₂ = 1 − w₁)', min: 0, max: 1, pas: 0.05, valeur: 0.5, format: function (x) { return Math.round(100 * x) + ' %'; } }
    ], dessiner);
    function dessiner() {
      const s1 = v.s1 / 100, s2 = v.s2 / 100, rho = v.rho, w1 = v.w, w2 = 1 - v.w;
      const a = o.hasard(3), pts = [];
      let sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0;
      const n = 700;
      for (let k = 0; k < n; k++) {
        const z1 = gauss(a), z2 = gauss(a);
        const x = s1 * z1, y = s2 * (rho * z1 + Math.sqrt(Math.max(0, 1 - rho * rho)) * z2);
        pts.push([x, y]);
        sx += x; sy += y; sxy += x * y; sxx += x * x; syy += y * y;
      }
      const cov = sxy / n - (sx / n) * (sy / n);
      const corr = cov / Math.sqrt((sxx / n - Math.pow(sx / n, 2)) * (syy / n - Math.pow(sy / n, 2)));
      const L = 3.2 * Math.max(s1, s2);
      const r = repere(c, { xmin: -L * 1.6, xmax: L * 1.6, ymin: -L, ymax: L, fx: function (t) { return Math.round(100 * t) + '%'; }, fy: function (t) { return Math.round(100 * t) + '%'; } });
      nuage(r, pts, r.col.accent, 2);
      const t1 = w1 * w1 * s1 * s1, t2 = w2 * w2 * s2 * s2, t3 = 2 * w1 * w2 * rho * s1 * s2;
      const varp = t1 + t2 + t3;
      const denom = s1 * s1 + s2 * s2 - 2 * rho * s1 * s2;
      const wmin = denom > 1e-12 ? (s2 * s2 - rho * s1 * s2) / denom : 0.5;
      out.innerHTML = '<div class="tableau"><table><tbody>' +
        '<tr><td>w₁²σ₁²</td><td>' + nb(t1, 4) + '</td></tr><tr><td>w₂²σ₂²</td><td>' + nb(t2, 4) + '</td></tr>' +
        '<tr><td>2w₁w₂ρσ₁σ₂ (terme de covariance)</td><td>' + nb(t3, 4) + '</td></tr>' +
        '<tr><td><b>Variance du portefeuille</b></td><td><b>' + nb(varp, 4) + '</b> → volatilité <b>' + nb(100 * Math.sqrt(Math.max(0, varp)), 3) + ' %</b></td></tr>' +
        '<tr><td>Moyenne pondérée des volatilités</td><td>' + nb(100 * (w1 * s1 + w2 * s2), 3) + ' % (gain de diversification : ' + nb(100 * (w1 * s1 + w2 * s2 - Math.sqrt(Math.max(0, varp))), 3) + ' points)</td></tr>' +
        '<tr><td>Poids de variance minimale w₁*</td><td>' + (wmin >= 0 && wmin <= 1 ? Math.round(100 * wmin) + ' %' : nb(100 * wmin, 3) + ' % (hors de [0, 1] : vente à découvert)') + '</td></tr>' +
        '<tr><td>Corrélation mesurée sur le nuage (700 points)</td><td>' + nb(corr, 3) + '</td></tr></tbody></table></div>';
    }
    dessiner();
  }

  // --- 3. Quadrants d'une gaussienne à deux dimensions ---------------------------------------------------------------
  function quadrants(el) {
    entete(el, 'P(X > 0, Y > 0) pour un couple gaussien', 'Comparaison de la fréquence simulée (20 000 tirages) et de la formule de Sheppard 1/4 + arcsin(ρ)/(2π).');
    const c = toile(el, 0.6);
    const out = sortie(el);
    const v = commandes(el, [{ nom: 'rho', libelle: 'Corrélation ρ', min: -0.99, max: 0.99, pas: 0.01, valeur: 0.5, format: function (x) { return nb(x, 2); } }], dessiner);
    function dessiner() {
      const a = o.hasard(11), rho = v.rho, s = Math.sqrt(1 - rho * rho);
      let k = 0;
      const pts = [];
      for (let i = 0; i < 20000; i++) {
        const x = gauss(a), y = rho * x + s * gauss(a);
        if (x > 0 && y > 0) k++;
        if (i < 800) pts.push([x, y]);
      }
      const r = repere(c, { xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5 });
      r.ctx.fillStyle = r.col.succes;
      r.ctx.globalAlpha = 0.12;
      r.ctx.fillRect(r.X(0), r.Y(3.5), r.X(3.5) - r.X(0), r.Y(0) - r.Y(3.5));
      r.ctx.globalAlpha = 1;
      nuage(r, pts, r.col.accent, 1.8);
      out.innerHTML = 'Simulation : <b>' + nb(k / 20000, 4) + '</b> · formule : <b>' + nb(0.25 + Math.asin(rho) / (2 * Math.PI), 4) + '</b>';
    }
    dessiner();
  }

  // --- 4. Trajectoires browniennes et variation quadratique ----------------------------------------------------------
  function brownien(el) {
    entete(el, 'Mouvement brownien et variation quadratique', 'W est approché par une marche de n pas indépendants N(0, T/n). Quand n grandit, Σ(ΔW)² se stabilise sur T (variation quadratique) alors que Σ|ΔW| explose (variation totale infinie).');
    const c = toile(el, 0.5);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'lg', libelle: 'Nombre de pas n', min: 1, max: 4, pas: 0.25, valeur: 2.5, transforme: function (x) { return Math.round(Math.pow(10, x)); }, format: function (x) { return String(x); } },
      { nom: 'm', libelle: 'Trajectoires', min: 1, max: 12, pas: 1, valeur: 5 }
    ], dessiner);
    bouton(el, 'Nouveaux tirages', function () { graine++; dessiner(); });
    function dessiner() {
      const n = v.lg, T = 1, dt = T / n, a = o.hasard(100 * graine);
      const chemins = [];
      let qv = 0, tv = 0, mini = 0, maxi = 0;
      for (let j = 0; j < v.m; j++) {
        let w = 0;
        const ch = [[0, 0]];
        for (let i = 1; i <= n; i++) {
          const d = Math.sqrt(dt) * gauss(a);
          if (j === 0) { qv += d * d; tv += Math.abs(d); }
          w += d;
          ch.push([i * dt, w]);
          mini = Math.min(mini, w); maxi = Math.max(maxi, w);
        }
        chemins.push(ch);
      }
      const L = Math.max(2.5, Math.abs(mini), Math.abs(maxi)) * 1.05;
      const r = repere(c, { xmin: 0, xmax: 1, ymin: -L, ymax: L });
      const palette = [r.col.accent, r.col.succes, r.col.alerte, r.col.erreur, r.col.fort, r.col.doux];
      chemins.forEach(function (ch, j) { ligne(r, ch, palette[j % palette.length], j === 0 ? 2 : 1.1); });
      ligne(r, [[0, 0], [1, 0]], r.col.bord, 1);
      out.innerHTML = 'Première trajectoire (épaisse) : Σ(ΔW)² = <b>' + nb(qv, 4) + '</b> (théorie : T = 1) · Σ|ΔW| = <b>' + nb(tv, 4) +
        '</b> (≈ √(2n/π) = ' + nb(Math.sqrt(2 * n / Math.PI), 4) + ', infini quand n → ∞) · W₁ = ' + nb(chemins[0][n][1], 3);
    }
    dessiner();
  }

  // --- 5. Vérifier le lemme d'Itô sur une trajectoire ----------------------------------------------------------------
  function ito(el) {
    entete(el, 'Le lemme d’Itô sur une trajectoire', 'Sur une trajectoire simulée, on compare f(W_T) − f(W₀) à la somme Σ f′(W)ΔW (calcul « classique ») puis à Σ f′(W)ΔW + ½ Σ f″(W)Δt (Itô). Sans le terme d’Itô, l’écart ne disparaît pas quand le pas diminue.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    const F = {
      carre: { nom: 'f(x) = x²', f: function (x) { return x * x; }, d1: function (x) { return 2 * x; }, d2: function () { return 2; } },
      cube: { nom: 'f(x) = x³', f: function (x) { return x * x * x; }, d1: function (x) { return 3 * x * x; }, d2: function (x) { return 6 * x; } },
      exp: { nom: 'f(x) = eˣ', f: Math.exp, d1: Math.exp, d2: Math.exp },
      sin: { nom: 'f(x) = sin x', f: Math.sin, d1: Math.cos, d2: function (x) { return -Math.sin(x); } }
    };
    let graine = 1;
    const v = commandes(el, [
      { nom: 'f', libelle: 'Fonction', choix: [['carre', 'x²'], ['cube', 'x³'], ['exp', 'eˣ'], ['sin', 'sin x']], valeur: 'carre' },
      { nom: 'lg', libelle: 'Nombre de pas', min: 1, max: 4.5, pas: 0.25, valeur: 3, transforme: function (x) { return Math.round(Math.pow(10, x)); }, format: function (x) { return String(x); } }
    ], dessiner);
    bouton(el, 'Nouvelle trajectoire', function () { graine++; dessiner(); });
    function dessiner() {
      const g = F[v.f], n = v.lg, T = 1, dt = T / n, a = o.hasard(500 + graine);
      let w = 0, s1 = 0, s2 = 0;
      const vrai = [[0, g.f(0)]], classique = [[0, g.f(0)]], itoC = [[0, g.f(0)]];
      for (let i = 1; i <= n; i++) {
        const d = Math.sqrt(dt) * gauss(a);
        s1 += g.d1(w) * d;
        s2 += 0.5 * g.d2(w) * dt;
        w += d;
        if (n <= 2000 || i % Math.ceil(n / 2000) === 0 || i === n) {
          vrai.push([i * dt, g.f(w)]); classique.push([i * dt, g.f(0) + s1]); itoC.push([i * dt, g.f(0) + s1 + s2]);
        }
      }
      const tout = vrai.concat(classique, itoC).map(function (p) { return p[1]; });
      const lo = Math.min.apply(null, tout), hi = Math.max.apply(null, tout), marge = (hi - lo) * 0.1 + 0.1;
      const r = repere(c, { xmin: 0, xmax: 1, ymin: lo - marge, ymax: hi + marge });
      ligne(r, classique, r.col.erreur, 1.4, true);
      ligne(r, itoC, r.col.succes, 2.4);
      ligne(r, vrai, r.col.accent, 1.2);
      const delta = g.f(w) - g.f(0);
      out.innerHTML = g.nom + ' · f(W_T) − f(W₀) = <b>' + nb(delta, 5) + '</b><br>Σ f′(W)ΔW = ' + nb(s1, 5) + ' (écart ' + nb(delta - s1, 4) + ')' +
        '<br>Σ f′(W)ΔW + ½ Σ f″(W)Δt = <b>' + nb(s1 + s2, 5) + '</b> (écart ' + nb(delta - s1 - s2, 3) + ')' +
        '<br><span class="doux">Bleu : f(W_t) ; vert : reconstruction d’Itô ; rouge pointillé : sans le terme ½ f″ dt.</span>';
    }
    dessiner();
  }

  // --- 6. Ruine du joueur --------------------------------------------------------------------------------------------
  function marche(el) {
    entete(el, 'Ruine du joueur', 'Une fortune part de k et gagne ou perd 1 à chaque tour (gain avec probabilité p), jusqu’à 0 ou N. Simulation de 3 000 parties contre les formules exactes.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'k', libelle: 'Départ k', min: 1, max: 19, pas: 1, valeur: 3 },
      { nom: 'N', libelle: 'Objectif N', min: 2, max: 20, pas: 1, valeur: 10 },
      { nom: 'p', libelle: 'Probabilité de gain p', min: 0.3, max: 0.7, pas: 0.01, valeur: 0.5, format: function (x) { return nb(x, 2); } }
    ], dessiner);
    bouton(el, 'Relancer', function () { graine++; dessiner(); });
    function dessiner() {
      const N2 = v.N, k = Math.min(v.k, N2 - 1), p = v.p, q = 1 - p, a = o.hasard(900 + graine);
      let gagne = 0, duree = 0;
      const exemples = [];
      for (let j = 0; j < 3000; j++) {
        let x = k, t = 0;
        const ch = [[0, x]];
        while (x > 0 && x < N2) { x += a() < p ? 1 : -1; t++; if (j < 6) ch.push([t, x]); }
        if (x === N2) gagne++;
        duree += t;
        if (j < 6) exemples.push(ch);
      }
      const tmax = Math.max.apply(null, exemples.map(function (ch) { return ch.length; }));
      const r = repere(c, { xmin: 0, xmax: Math.max(10, tmax), ymin: 0, ymax: N2 });
      const palette = [r.col.accent, r.col.succes, r.col.alerte, r.col.erreur, r.col.fort, r.col.doux];
      exemples.forEach(function (ch, j) { ligne(r, ch, palette[j], 1.3); });
      let theo, dureeTheo;
      if (Math.abs(p - 0.5) < 1e-9) { theo = k / N2; dureeTheo = k * (N2 - k); }
      else {
        const rr = q / p;
        theo = (1 - Math.pow(rr, k)) / (1 - Math.pow(rr, N2));
        dureeTheo = k / (q - p) - N2 / (q - p) * theo;
      }
      out.innerHTML = 'Départ ' + k + ', objectif ' + N2 + ' · P(atteindre N) : simulation <b>' + nb(gagne / 3000, 3) + '</b>, formule <b>' + nb(theo, 4) + '</b>' +
        ' · durée moyenne : simulation <b>' + nb(duree / 3000, 4) + '</b>, formule <b>' + nb(dureeTheo, 4) + '</b>';
    }
    dessiner();
  }

  // --- 7. Calculatrice Black-Scholes ---------------------------------------------------------------------------------
  function bsWidget(el) {
    entete(el, 'Black-Scholes : prix et Greeks', 'Fais varier les paramètres et regarde la courbe du prix du call (bleu) au-dessus de son payoff (pointillé) : l’écart est la valeur temps.');
    const c = toile(el, 0.5);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'S', libelle: 'Sous-jacent S', min: 50, max: 150, pas: 1, valeur: 100 },
      { nom: 'K', libelle: 'Strike K', min: 50, max: 150, pas: 1, valeur: 100 },
      { nom: 's', libelle: 'Volatilité σ', min: 5, max: 80, pas: 1, valeur: 20, format: function (x) { return x + ' %'; } },
      { nom: 'T', libelle: 'Maturité T (années)', min: 0.02, max: 3, pas: 0.02, valeur: 1, format: function (x) { return nb(x, 3); } },
      { nom: 'r', libelle: 'Taux r', min: 0, max: 10, pas: 0.25, valeur: 0, format: function (x) { return nb(x, 3) + ' %'; } }
    ], dessiner);
    function dessiner() {
      const s = v.s / 100, r0 = v.r / 100;
      const g = bs(v.S, v.K, s, v.T, r0);
      const pts = [], pay = [];
      for (let x = 40; x <= 160; x += 1) { pts.push([x, bs(x, v.K, s, v.T, r0).call]); pay.push([x, Math.max(x - v.K, 0)]); }
      const r = repere(c, { xmin: 40, xmax: 160, ymin: 0, ymax: Math.max(20, pts[pts.length - 1][1]) });
      ligne(r, pay, r.col.doux, 1.3, true);
      ligne(r, pts, r.col.accent, 2.2);
      r.ctx.fillStyle = r.col.erreur;
      r.ctx.beginPath(); r.ctx.arc(r.X(v.S), r.Y(g.call), 4, 0, 2 * Math.PI); r.ctx.fill();
      out.innerHTML = '<div class="tableau"><table><tbody>' +
        '<tr><td>d₁ ; d₂</td><td>' + nb(g.d1, 4) + ' ; ' + nb(g.d2, 4) + '</td><td>Call ; put</td><td><b>' + nb(g.call, 5) + '</b> ; <b>' + nb(g.put, 5) + '</b></td></tr>' +
        '<tr><td>Delta du call N(d₁)</td><td>' + nb(g.delta, 4) + '</td><td>Gamma</td><td>' + nb(g.gamma, 4) + '</td></tr>' +
        '<tr><td>Vega (par point de vol)</td><td>' + nb(g.vega / 100, 4) + '</td><td>Theta (par jour)</td><td>' + nb(g.theta / 365, 4) + '</td></tr>' +
        '<tr><td>Rho (par point de taux)</td><td>' + nb(g.rho / 100, 4) + '</td><td>Approximation 0,4·σ·S·√T</td><td>' + nb(0.4 * s * v.S * Math.sqrt(v.T), 4) + '</td></tr>' +
        '</tbody></table></div>';
    }
    dessiner();
  }

  // --- 8. Arbre binomial et convergence vers Black-Scholes ------------------------------------------------------------
  function binomial(el) {
    entete(el, 'Arbre binomial de Cox-Ross-Rubinstein', 'u = e^{σ√Δt}, d = 1/u, probabilité risque-neutre q = (e^{rΔt} − d)/(u − d). Le prix du call converge vers Black-Scholes en oscillant quand le nombre de pas augmente.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'n', libelle: 'Pas maximal affiché', min: 2, max: 200, pas: 1, valeur: 60 },
      { nom: 's', libelle: 'Volatilité σ', min: 5, max: 60, pas: 1, valeur: 20, format: function (x) { return x + ' %'; } },
      { nom: 'K', libelle: 'Strike K (S = 100, T = 1, r = 2 %)', min: 70, max: 130, pas: 1, valeur: 100 }
    ], dessiner);
    function prixArbre(n, s, K) {
      const T = 1, rr = 0.02, dt = T / n, u = Math.exp(s * Math.sqrt(dt)), d = 1 / u, q = (Math.exp(rr * dt) - d) / (u - d), disc = Math.exp(-rr * dt);
      const val = [];
      for (let j = 0; j <= n; j++) val.push(Math.max(100 * Math.pow(u, j) * Math.pow(d, n - j) - K, 0));
      for (let e = n - 1; e >= 0; e--) for (let j = 0; j <= e; j++) val[j] = disc * (q * val[j + 1] + (1 - q) * val[j]);
      return { prix: val[0], q: q, u: u };
    }
    function dessiner() {
      const s = v.s / 100;
      const ref = bs(100, v.K, s, 1, 0.02).call;
      const pts = [];
      for (let n = 1; n <= v.n; n++) pts.push([n, prixArbre(n, s, v.K).prix]);
      const ys = pts.map(function (p) { return p[1]; });
      const lo = Math.min.apply(null, ys.concat([ref])), hi = Math.max.apply(null, ys.concat([ref]));
      const r = repere(c, { xmin: 1, xmax: v.n, ymin: lo - 0.1 * (hi - lo + 0.1), ymax: hi + 0.1 * (hi - lo + 0.1) });
      ligne(r, [[1, ref], [v.n, ref]], r.col.erreur, 1.5, true);
      ligne(r, pts, r.col.accent, 1.6);
      const a1 = prixArbre(1, s, v.K), an = prixArbre(v.n, s, v.K);
      out.innerHTML = 'Black-Scholes : <b>' + nb(ref, 5) + '</b> · arbre à 1 pas : ' + nb(a1.prix, 5) + ' (q = ' + nb(a1.q, 4) + ', u = ' + nb(a1.u, 4) +
        ') · arbre à ' + v.n + ' pas : <b>' + nb(an.prix, 5) + '</b> (écart ' + nb(an.prix - ref, 3) + ')';
    }
    dessiner();
  }

  // --- 9. Monte-Carlo : convergence et variables antithétiques --------------------------------------------------------
  function montecarlo(el) {
    entete(el, 'Prix d’un call par Monte-Carlo', 'S = K = 100, σ = 20 %, T = 1, r = 0. Estimation courante en fonction du nombre de tirages, simple (bleu) et avec variables antithétiques (vert) ; la ligne rouge est le prix exact.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'lg', libelle: 'Tirages', min: 2, max: 5, pas: 0.25, valeur: 4, transforme: function (x) { return Math.round(Math.pow(10, x)); }, format: function (x) { return String(x); } }
    ], dessiner);
    bouton(el, 'Relancer', function () { graine++; dessiner(); });
    function dessiner() {
      const n = v.lg, a = o.hasard(1300 + graine), s = 0.2;
      const ref = bs(100, 100, s, 1, 0).call;
      let somme = 0, somme2 = 0, sa = 0, sa2 = 0;
      const p1 = [], p2 = [];
      const pas = Math.max(1, Math.floor(n / 400));
      for (let i = 1; i <= n; i++) {
        const z = gauss(a);
        const f = function (x) { return Math.max(100 * Math.exp(-s * s / 2 + s * x) - 100, 0); };
        const y = f(z), ya = 0.5 * (f(z) + f(-z));
        somme += y; somme2 += y * y; sa += ya; sa2 += ya * ya;
        if (i % pas === 0 || i === n) { p1.push([i, somme / i]); p2.push([i, sa / i]); }
      }
      const r = repere(c, { xmin: 0, xmax: n, ymin: ref - 4, ymax: ref + 4 });
      ligne(r, [[0, ref], [n, ref]], r.col.erreur, 1.5, true);
      ligne(r, p1, r.col.accent, 1.4);
      ligne(r, p2, r.col.succes, 1.8);
      const m = somme / n, e1 = Math.sqrt((somme2 / n - m * m) / n), ma = sa / n, e2 = Math.sqrt((sa2 / n - ma * ma) / n);
      out.innerHTML = 'Exact : <b>' + nb(ref, 5) + '</b> · simple : ' + nb(m, 5) + ' ± ' + nb(1.96 * e1, 3) + ' · antithétique : ' + nb(ma, 5) + ' ± ' + nb(1.96 * e2, 3) +
        ' <span class="doux">(intervalles à 95 % ; réduction de l’écart-type par paire : ×' + nb(e1 / e2 / Math.SQRT2, 3) + ' à coût égal)</span>';
    }
    dessiner();
  }

  // --- 10. Critère de Kelly -------------------------------------------------------------------------------------------
  function kelly(el) {
    entete(el, 'Croissance en fonction de la fraction misée', 'g(f) = p ln(1 + bf) + (1 − p) ln(1 − f). Le maximum est la fraction de Kelly ; à environ deux fois cette fraction, la croissance retombe à zéro.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'p', libelle: 'Probabilité de gain p', min: 0.4, max: 0.9, pas: 0.01, valeur: 0.6, format: function (x) { return nb(x, 2); } },
      { nom: 'b', libelle: 'Cote b (gain par euro misé)', min: 0.5, max: 4, pas: 0.1, valeur: 1, format: function (x) { return nb(x, 2); } }
    ], dessiner);
    function dessiner() {
      const p = v.p, b = v.b, g = function (f) { return p * Math.log(1 + b * f) + (1 - p) * Math.log(1 - f); };
      const fk = Math.max(0, (b * p - (1 - p)) / b);
      const pts = [];
      for (let f = 0; f <= 0.98; f += 0.005) pts.push([f, g(f)]);
      const gmax = g(fk);
      const r = repere(c, { xmin: 0, xmax: 1, ymin: Math.min(-0.1, -gmax * 2), ymax: Math.max(0.05, gmax * 1.4), fx: function (t) { return Math.round(100 * t) + '%'; } });
      ligne(r, [[0, 0], [1, 0]], r.col.bord, 1);
      ligne(r, pts.filter(function (q) { return q[1] > r.Y ? true : true; }), r.col.accent, 2);
      ligne(r, [[fk, 0], [fk, gmax]], r.col.succes, 1.5, true);
      out.innerHTML = 'Espérance par euro misé : ' + nb(b * p - (1 - p), 3) + ' · fraction de Kelly f* = <b>' + nb(100 * fk, 3) + ' %</b> · croissance g(f*) = ' + nb(gmax, 4) +
        ' par pari · demi-Kelly : g = ' + nb(g(fk / 2), 4) + ' (' + (gmax > 0 ? Math.round(100 * g(fk / 2) / gmax) : 0) + ' % du maximum)';
    }
    dessiner();
  }

  // --- 11. Processus d'Ornstein-Uhlenbeck ----------------------------------------------------------------------------
  function ou(el) {
    entete(el, 'Ornstein-Uhlenbeck : retour à la moyenne', 'dX = κ(θ − X)dt + σdW avec θ = 0, départ X₀ = 3. Les bandes pointillées valent ±1 écart-type stationnaire σ/√(2κ) ; la ligne verticale marque la demi-vie ln 2/κ.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'k', libelle: 'Vitesse κ (par jour)', min: 0.02, max: 0.5, pas: 0.01, valeur: 0.1, format: function (x) { return nb(x, 2); } },
      { nom: 's', libelle: 'Volatilité σ (par √jour)', min: 0.05, max: 1, pas: 0.05, valeur: 0.3, format: function (x) { return nb(x, 2); } }
    ], dessiner);
    bouton(el, 'Nouveaux tirages', function () { graine++; dessiner(); });
    function dessiner() {
      const k = v.k, s = v.s, jours = 100, n = 1000, dt = jours / n, a = o.hasard(1700 + graine);
      const sd = s / Math.sqrt(2 * k), L = Math.max(3.5, 3 * sd);
      const r = repere(c, { xmin: 0, xmax: jours, ymin: -L, ymax: L });
      ligne(r, [[0, sd], [jours, sd]], r.col.doux, 1, true);
      ligne(r, [[0, -sd], [jours, -sd]], r.col.doux, 1, true);
      const hl = Math.log(2) / k;
      if (hl < jours) ligne(r, [[hl, -L], [hl, L]], r.col.succes, 1.3, true);
      const moyenne = [];
      for (let t = 0; t <= jours; t += 1) moyenne.push([t, 3 * Math.exp(-k * t)]);
      ligne(r, moyenne, r.col.erreur, 2);
      const palette = [r.col.accent, r.col.fort, r.col.alerte];
      for (let j = 0; j < 3; j++) {
        let x = 3;
        const ch = [[0, x]];
        const e = Math.exp(-k * dt), sdPas = s * Math.sqrt((1 - e * e) / (2 * k));
        for (let i = 1; i <= n; i++) { x = x * e + sdPas * gauss(a); ch.push([i * dt, x]); }
        ligne(r, ch, palette[j], 1.2);
      }
      out.innerHTML = 'Demi-vie ln 2/κ = <b>' + nb(hl, 3) + ' jours</b> · écart-type stationnaire σ/√(2κ) = <b>' + nb(sd, 3) + '</b> · coefficient AR(1) quotidien φ = e^{−κ} = ' + nb(Math.exp(-k), 4) +
        ' <span class="doux">(courbe rouge : espérance 3e^{−κt})</span>';
    }
    dessiner();
  }

  // --- 12. Smile SVI et contrôle du papillon -------------------------------------------------------------------------
  function svi(el) {
    entete(el, 'Une tranche SVI', 'w(k) = a + b[ρ(k − m) + √((k − m)² + σ²)], variance totale en fonction de la log-moneyness k. En dessous : la fonction g(k) de Gatheral-Jacquier, qui doit rester positive (absence d’arbitrage papillon).');
    const c = toile(el, 0.45);
    const c2 = toile(el, 0.25);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'a', libelle: 'a (niveau)', min: -0.05, max: 0.1, pas: 0.005, valeur: 0.02, format: function (x) { return nb(x, 3); } },
      { nom: 'b', libelle: 'b (pente des ailes)', min: 0.01, max: 0.6, pas: 0.01, valeur: 0.1, format: function (x) { return nb(x, 2); } },
      { nom: 'rho', libelle: 'ρ (asymétrie)', min: -0.95, max: 0.95, pas: 0.05, valeur: -0.4, format: function (x) { return nb(x, 2); } },
      { nom: 'm', libelle: 'm (translation)', min: -0.5, max: 0.5, pas: 0.02, valeur: 0, format: function (x) { return nb(x, 2); } },
      { nom: 'sig', libelle: 'σ (courbure)', min: 0.01, max: 0.5, pas: 0.01, valeur: 0.15, format: function (x) { return nb(x, 2); } }
    ], dessiner);
    function dessiner() {
      const a = v.a, b = v.b, rho = v.rho, m = v.m, s = v.sig;
      const w = function (k) { return a + b * (rho * (k - m) + Math.sqrt((k - m) * (k - m) + s * s)); };
      const w1 = function (k) { return b * (rho + (k - m) / Math.sqrt((k - m) * (k - m) + s * s)); };
      const w2 = function (k) { return b * s * s / Math.pow((k - m) * (k - m) + s * s, 1.5); };
      const g = function (k) { const W = w(k), d = w1(k); return Math.pow(1 - k * d / (2 * W), 2) - d * d / 4 * (1 / W + 0.25) + w2(k) / 2; };
      const pts = [], gs = [];
      let gmin = Infinity, wmin = Infinity;
      for (let k = -1.5; k <= 1.5001; k += 0.01) {
        const W = w(k);
        pts.push([k, W]); wmin = Math.min(wmin, W);
        const gv = W > 0 ? g(k) : -1;
        gs.push([k, gv]); gmin = Math.min(gmin, gv);
      }
      const r = repere(c, { xmin: -1.5, xmax: 1.5, ymin: Math.min(0, wmin), ymax: Math.max.apply(null, pts.map(function (p) { return p[1]; })) * 1.1 });
      ligne(r, pts, r.col.accent, 2.2);
      const r2 = repere(c2, { xmin: -1.5, xmax: 1.5, ymin: Math.min(-0.2, gmin), ymax: 1.5 });
      ligne(r2, [[-1.5, 0], [1.5, 0]], r2.col.erreur, 1, true);
      ligne(r2, gs.map(function (p) { return [p[0], Math.min(1.5, p[1])]; }), gmin < 0 ? r2.col.erreur : r2.col.succes, 1.8);
      out.innerHTML = 'Pentes des ailes : gauche b(1 − ρ) = ' + nb(b * (1 - rho), 3) + ', droite b(1 + ρ) = ' + nb(b * (1 + rho), 3) + ' (borne de Lee : 2) · ' +
        (wmin <= 0 ? '<b style="color:var(--erreur)">variance totale négative : paramètres impossibles</b>' :
          gmin < 0 ? '<b style="color:var(--erreur)">arbitrage papillon : g(k) &lt; 0 quelque part</b> (min ' + nb(gmin, 3) + ')' : '<b style="color:var(--succes)">pas d’arbitrage papillon sur [−1,5 ; 1,5]</b> (min g = ' + nb(gmin, 3) + ')');
    }
    dessiner();
  }

  // --- 13. Couverture en delta : erreur et PnL -----------------------------------------------------------------------
  function couverture(el) {
    entete(el, 'Vendre un call et le couvrir en delta', 'On vend un call à la monnaie (S = K = 100, 3 mois, taux nul) au prix Black-Scholes avec la volatilité implicite, puis on le couvre en delta à intervalles réguliers. Histogramme du PnL final sur 1 000 trajectoires.');
    const c = toile(el, 0.45);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'n', libelle: 'Réajustements', choix: [['1', '1 (une fois)'], ['4', '4'], ['13', '13 (hebdomadaire)'], ['63', '63 (quotidien)'], ['252', '252']], valeur: '13', transforme: Number },
      { nom: 'si', libelle: 'Vol implicite vendue', min: 10, max: 40, pas: 1, valeur: 20, format: function (x) { return x + ' %'; } },
      { nom: 'sr', libelle: 'Vol réalisée', min: 10, max: 40, pas: 1, valeur: 20, format: function (x) { return x + ' %'; } }
    ], dessiner);
    bouton(el, 'Relancer', function () { graine++; dessiner(); });
    function dessiner() {
      const n = v.n, T = 0.25, dt = T / n, si = v.si / 100, sr = v.sr / 100, a = o.hasard(2100 + graine);
      const prime = bs(100, 100, si, T, 0).call;
      const pnl = [];
      for (let j = 0; j < 1000; j++) {
        let S = 100, cash = prime, delta = bs(S, 100, si, T, 0).delta;
        cash -= delta * S;
        for (let i = 1; i <= n; i++) {
          S *= Math.exp(-sr * sr / 2 * dt + sr * Math.sqrt(dt) * gauss(a));
          const reste = T - i * dt;
          const nd = reste > 1e-9 ? bs(S, 100, si, reste, 0).delta : (S > 100 ? 1 : 0);
          cash -= (nd - delta) * S;
          delta = nd;
        }
        pnl.push(cash + delta * S - Math.max(S - 100, 0));
      }
      const m = pnl.reduce(function (s, x) { return s + x; }, 0) / pnl.length;
      const sd = Math.sqrt(pnl.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / pnl.length);
      const L = Math.max(6, Math.abs(m) + 4 * sd);
      const bords = [], hist = [];
      for (let k = 0; k <= 40; k++) bords.push(-L + k * 2 * L / 40);
      for (let k = 0; k < 40; k++) hist.push(0);
      pnl.forEach(function (x) { const i = Math.floor((x + L) / (2 * L / 40)); if (i >= 0 && i < 40) hist[i]++; });
      const r = repere(c, { xmin: -L, xmax: L, ymin: 0, ymax: Math.max.apply(null, hist) * 1.1 });
      barres(r, bords, hist, r.col.accent);
      ligne(r, [[0, 0], [0, Math.max.apply(null, hist) * 1.1]], r.col.doux, 1, true);
      ligne(r, [[m, 0], [m, Math.max.apply(null, hist) * 1.1]], m >= 0 ? r.col.succes : r.col.erreur, 2);
      const theo = bs(100, 100, si, T, 0).call - bs(100, 100, sr, T, 0).call;
      out.innerHTML = 'Prime encaissée : ' + nb(prime, 4) + ' · PnL moyen : <b>' + nb(m, 3) + '</b> (prix à la vol implicite − prix à la vol réalisée ≈ ' + nb(theo, 3) + ')' +
        ' · écart-type : <b>' + nb(sd, 3) + '</b> <span class="doux">(divisé par ≈ 2 quand on réajuste 4 fois plus souvent)</span>';
    }
    dessiner();
  }

  // --- 14. Temps d'attente d'un motif à pile ou face -----------------------------------------------------------------
  function conditionnement(el) {
    entete(el, 'Temps d’attente d’un motif à pile ou face', 'Simulation de 5 000 séries de lancers contre la valeur exacte obtenue par la méthode du premier pas (somme des 2^ℓ sur les chevauchements préfixe = suffixe).');
    const c = toile(el, 0.4);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'm', libelle: 'Motif', choix: [['P', 'P'], ['PP', 'PP'], ['PF', 'PF'], ['PPP', 'PPP'], ['PFP', 'PFP'], ['PFF', 'PFF'], ['PPPP', 'PPPP'], ['PFPF', 'PFPF']], valeur: 'PFP' }
    ], dessiner);
    bouton(el, 'Relancer', function () { graine++; dessiner(); });
    function exact(m) {
      let e = 0;
      for (let l = 1; l <= m.length; l++) if (m.slice(0, l) === m.slice(m.length - l)) e += Math.pow(2, l);
      return e;
    }
    function dessiner() {
      const m = v.m, a = o.hasard(2600 + graine), temps = [];
      for (let j = 0; j < 5000; j++) {
        let s = '', t = 0;
        while (s.slice(-m.length) !== m) { s += a() < 0.5 ? 'P' : 'F'; t++; if (s.length > 40) s = s.slice(-m.length); }
        temps.push(t);
      }
      const moy = temps.reduce(function (x, y) { return x + y; }, 0) / temps.length;
      const tmax = 60, hist = [];
      for (let k = 0; k < tmax; k++) hist.push(0);
      temps.forEach(function (t) { if (t <= tmax) hist[t - 1]++; });
      const bords = [];
      for (let k = 0; k <= tmax; k++) bords.push(k + 0.5);
      const r = repere(c, { xmin: 0.5, xmax: tmax + 0.5, ymin: 0, ymax: Math.max.apply(null, hist) * 1.1 });
      barres(r, bords, hist, r.col.accent);
      const ex = exact(m);
      ligne(r, [[ex, 0], [ex, Math.max.apply(null, hist) * 1.1]], r.col.erreur, 2);
      out.innerHTML = 'Motif ' + m + ' · moyenne simulée <b>' + nb(moy, 4) + '</b> · valeur exacte <b>' + ex + '</b> <span class="doux">(ligne rouge ; l’histogramme montre la loi du temps d’attente)</span>';
    }
    dessiner();
  }

  // --- 15. Régression : estimation, erreur standard, atténuation ----------------------------------------------------
  function regression(el) {
    entete(el, 'Moindres carrés sur un échantillon simulé', 'Vrai modèle y = 1,5·x + ε avec x ~ N(0, 1). Pointillé : la vraie droite ; trait plein : la droite estimée. Ajoute du bruit de mesure sur x pour voir la pente s’atténuer vers 1,5·Var(x)/(Var(x) + Var(u)).');
    const c = toile(el, 0.55);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'n', libelle: 'Observations n', min: 10, max: 500, pas: 10, valeur: 50 },
      { nom: 'e', libelle: 'Bruit sur y (écart-type de ε)', min: 0.1, max: 3, pas: 0.1, valeur: 1, format: function (x) { return nb(x, 2); } },
      { nom: 'u', libelle: 'Bruit de mesure sur x (écart-type de u)', min: 0, max: 1.5, pas: 0.05, valeur: 0, format: function (x) { return nb(x, 2); } }
    ], dessiner);
    bouton(el, 'Nouvel échantillon', function () { graine++; dessiner(); });
    function dessiner() {
      const a = o.hasard(3100 + graine), pts = [];
      for (let i = 0; i < v.n; i++) {
        const x = gauss(a), y = 1.5 * x + v.e * gauss(a);
        pts.push([x + v.u * gauss(a), y]);
      }
      const mx = pts.reduce(function (s, p) { return s + p[0]; }, 0) / v.n, my = pts.reduce(function (s, p) { return s + p[1]; }, 0) / v.n;
      let sxy = 0, sxx = 0, syy = 0;
      pts.forEach(function (p) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); syy += (p[1] - my) * (p[1] - my); });
      const b = sxy / sxx, a0 = my - b * mx;
      let scr = 0;
      pts.forEach(function (p) { scr += Math.pow(p[1] - a0 - b * p[0], 2); });
      const se = Math.sqrt(scr / (v.n - 2) / sxx), r2 = 1 - scr / syy;
      const L = 4.5, H = Math.max(6, 3 * Math.sqrt(2.25 + v.e * v.e));
      const r = repere(c, { xmin: -L, xmax: L, ymin: -H, ymax: H });
      nuage(r, pts, r.col.accent, 2.2);
      ligne(r, [[-L, -1.5 * L], [L, 1.5 * L]], r.col.doux, 1.5, true);
      ligne(r, [[-L, a0 - b * L], [L, a0 + b * L]], r.col.erreur, 2.2);
      const attendu = 1.5 / (1 + v.u * v.u);
      out.innerHTML = 'Pente estimée <b>' + nb(b, 3) + '</b> ± ' + nb(se, 2) + ' (erreur standard σ̂/√Σ(x − x̄)²) · t = ' + nb(b / se, 3) + ' · R² = ' + nb(r2, 3) +
        ' · pente vers laquelle l’estimation converge : <b>' + nb(attendu, 3) + '</b>' + (v.u > 0 ? ' <span class="doux">(atténuée par l’erreur de mesure)</span>' : '') +
        ' <span class="doux">· quadrupler n divise l’erreur standard par deux</span>';
    }
    dessiner();
  }

  // --- 16. Obligation : prix, duration, convexité -------------------------------------------------------------------
  function obligation(el) {
    entete(el, 'Prix d’une obligation en fonction du rendement', 'Courbe bleue : le prix exact. Pointillé : l’approximation par la duration (tangente). Vert : duration et convexité (parabole). Le point rouge est le rendement actuel.');
    const c = toile(el, 0.5);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'T', libelle: 'Maturité (années)', min: 1, max: 30, pas: 1, valeur: 10 },
      { nom: 'c', libelle: 'Coupon annuel', min: 0, max: 10, pas: 0.25, valeur: 4, format: function (x) { return nb(x, 3) + ' %'; } },
      { nom: 'y', libelle: 'Rendement actuel', min: 0.25, max: 10, pas: 0.25, valeur: 4, format: function (x) { return nb(x, 3) + ' %'; } }
    ], dessiner);
    function mesures(T, cp, y) {
      let p = 0, d1 = 0, d2 = 0;
      for (let t = 1; t <= T; t++) {
        const f = (t === T ? 100 + cp : cp), act = Math.pow(1 + y, -t);
        p += f * act;
        d1 += -t * f * act / (1 + y);
        d2 += t * (t + 1) * f * act / ((1 + y) * (1 + y));
      }
      return { prix: p, dmod: -d1 / p, conv: d2 / p };
    }
    function dessiner() {
      const T = v.T, cp = v.c, y0 = v.y / 100;
      const m = mesures(T, cp, y0);
      const exact = [], lin = [], quad = [];
      for (let k = 0; k <= 120; k++) {
        const y = k / 1000;
        const dy = y - y0;
        exact.push([100 * y, mesures(T, cp, y).prix]);
        lin.push([100 * y, m.prix * (1 - m.dmod * dy)]);
        quad.push([100 * y, m.prix * (1 - m.dmod * dy + 0.5 * m.conv * dy * dy)]);
      }
      const ys = exact.map(function (q) { return q[1]; });
      const r = repere(c, { xmin: 0, xmax: 12, ymin: Math.max(0, Math.min.apply(null, ys) * 0.85), ymax: Math.max.apply(null, ys) * 1.05, fx: function (t) { return fmt(t) + '%'; } });
      ligne(r, lin, r.col.doux, 1.4, true);
      ligne(r, quad, r.col.succes, 1.6);
      ligne(r, exact, r.col.accent, 2.4);
      r.ctx.fillStyle = r.col.erreur;
      r.ctx.beginPath(); r.ctx.arc(r.X(100 * y0), r.Y(m.prix), 4, 0, 2 * Math.PI); r.ctx.fill();
      const haut = mesures(T, cp, y0 + 0.01).prix;
      out.innerHTML = 'Prix <b>' + nb(m.prix, 5) + '</b> · duration de Macaulay ' + nb(m.dmod * (1 + y0), 4) + ' ans · duration modifiée <b>' + nb(m.dmod, 4) + '</b> · convexité ' + nb(m.conv, 4) +
        ' · DV01 (pour 100 de nominal) ' + nb(m.dmod * m.prix * 1e-4, 3) +
        '<br>Rendement +1 point : prix exact ' + nb(haut - m.prix, 4) + ', duration seule ' + nb(-m.dmod * m.prix * 0.01, 4) + ', avec convexité ' + nb(m.prix * (-m.dmod * 0.01 + 0.5 * m.conv * 1e-4), 4);
    }
    dessiner();
  }

  // --- 17. Glosten-Milgrom : le marché apprend par les ordres -------------------------------------------------------
  function glosten(el) {
    entete(el, 'Sélection adverse : le modèle de Glosten-Milgrom', 'La valeur vaut 90 ou 110. Une proportion α des clients connaît la vraie valeur ; les autres achètent ou vendent au hasard. Le teneur de marché fixe ask = E[V | achat] et bid = E[V | vente], puis révise sa croyance par Bayes après chaque ordre.');
    const c = toile(el, 0.5);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'alpha', libelle: 'Part de clients informés α', min: 0.05, max: 0.8, pas: 0.05, valeur: 0.3, format: function (x) { return Math.round(100 * x) + ' %'; } },
      { nom: 'vraie', libelle: 'Vraie valeur', choix: [['110', '110 (haute)'], ['90', '90 (basse)']], valeur: '110', transforme: Number },
      { nom: 'n', libelle: 'Nombre d’ordres', min: 10, max: 80, pas: 5, valeur: 40 }
    ], dessiner);
    bouton(el, 'Autre séquence', function () { graine++; dessiner(); });
    function dessiner() {
      const al = v.alpha, V = v.vraie, a = o.hasard(3500 + graine);
      let pi = 0.5, pnl = 0, pnlInf = 0, pnlNon = 0;
      const asks = [], bids = [], milieu = [];
      for (let k = 0; k < v.n; k++) {
        const pAchatH = (1 + al) / 2, pAchatL = (1 - al) / 2;
        const hAchat = pi * pAchatH / (pi * pAchatH + (1 - pi) * pAchatL);
        const hVente = pi * (1 - pAchatH) / (pi * (1 - pAchatH) + (1 - pi) * (1 - pAchatL));
        const ask = 90 + 20 * hAchat, bid = 90 + 20 * hVente;
        asks.push([k, ask]); bids.push([k, bid]); milieu.push([k, 90 + 20 * pi]);
        const informe = a() < al;
        const achat = informe ? V === 110 : a() < 0.5;
        const g = achat ? ask - V : V - bid;
        pnl += g;
        if (informe) pnlInf += g; else pnlNon += g;
        pi = achat ? hAchat : hVente;
      }
      const r = repere(c, { xmin: 0, xmax: v.n, ymin: 88, ymax: 112 });
      ligne(r, [[0, V], [v.n, V]], r.col.succes, 1.5, true);
      ligne(r, asks, r.col.erreur, 1.8);
      ligne(r, bids, r.col.accent, 1.8);
      ligne(r, milieu, r.col.doux, 1.2, true);
      out.innerHTML = 'Spread initial <b>' + nb(20 * al, 3) + '</b> (= α × 20) · croyance finale P(V = 110) = <b>' + nb(pi, 3) + '</b> · PnL du teneur de marché : ' + nb(pnl, 3) +
        ' dont ' + nb(pnlInf, 3) + ' contre les informés et ' + (pnlNon >= 0 ? '+' : '') + nb(pnlNon, 3) + ' contre les autres <span class="doux">(rouge : ask, bleu : bid, vert : vraie valeur ; nul en espérance)</span>';
    }
    dessiner();
  }

  // --- 18. Descente de gradient sur une fonction quadratique --------------------------------------------------------
  function gradient(el) {
    entete(el, 'Descente de gradient et conditionnement', 'On minimise L(x, y) = ½(x² + κy²). Le pas est exprimé en fraction de la limite de stabilité 2/κ (la direction la plus raide). Au-delà de 1, l’algorithme diverge ; quand κ est grand, la direction plate converge lentement.');
    const c = toile(el, 0.55);
    const out = sortie(el);
    const v = commandes(el, [
      { nom: 'k', libelle: 'Conditionnement κ', min: 1, max: 50, pas: 1, valeur: 10 },
      { nom: 'f', libelle: 'Pas η (fraction de 2/κ)', min: 0.05, max: 1.2, pas: 0.05, valeur: 0.9, format: function (x) { return nb(x, 2); } },
      { nom: 'm', libelle: 'Méthode', choix: [['0', 'descente simple'], ['0.9', 'avec moment (β = 0,9)']], valeur: '0', transforme: Number }
    ], dessiner);
    function dessiner() {
      const k = v.k, eta = v.f * 2 / k, beta = v.m;
      let x = -4, y = 1.5, vx = 0, vy = 0;
      const traj = [[x, y]];
      let iter = 0;
      for (; iter < 60; iter++) {
        vx = beta * vx - eta * x; vy = beta * vy - eta * k * y;
        x += vx; y += vy;
        traj.push([Math.max(-50, Math.min(50, x)), Math.max(-50, Math.min(50, y))]);
        if (Math.abs(x) + Math.abs(y) > 1e6) break;
      }
      const r = repere(c, { xmin: -5, xmax: 5, ymin: -2.5, ymax: 2.5 });
      [0.1, 0.5, 1.5, 4, 8, 16].forEach(function (niv) {
        const pts = [];
        for (let t = 0; t <= 64; t++) { const u = 2 * Math.PI * t / 64; pts.push([Math.sqrt(2 * niv) * Math.cos(u), Math.sqrt(2 * niv / k) * Math.sin(u)]); }
        ligne(r, pts, r.col.bord, 1);
      });
      r.ctx.save();
      r.ctx.beginPath(); r.ctx.rect(r.X(-5), r.Y(2.5), r.X(5) - r.X(-5), r.Y(-2.5) - r.Y(2.5)); r.ctx.clip();
      ligne(r, traj, r.col.erreur, 1.6);
      nuage(r, traj, r.col.erreur, 2.5);
      r.ctx.restore();
      const facteurs = [Math.abs(1 - eta), Math.abs(1 - eta * k)];
      const norme = Math.sqrt(x * x + y * y);
      out.innerHTML = 'η = ' + nb(eta, 3) + ' · facteurs par pas |1 − ηλ| : ' + nb(facteurs[0], 3) + ' (direction plate) et ' + nb(facteurs[1], 3) + ' (direction raide)' +
        ' · distance au minimum après ' + iter + ' pas : <b>' + (isFinite(norme) && norme < 1e6 ? nb(norme, 3) : 'divergence') + '</b>' +
        (beta ? ' <span class="doux">(le moment accélère la direction plate quand κ est grand)</span>' : '');
    }
    dessiner();
  }

  // --- 19. Processus de Poisson et paradoxe de l'inspection ----------------------------------------------------------
  function poisson(el) {
    entete(el, 'Processus de Poisson et paradoxe de l’inspection', 'Des événements arrivent au taux λ par minute (en haut, les 60 premières minutes). Histogramme des durées entre événements contre la densité exponentielle λ·exp(−λt) (en rouge). En bas : ce que vit un voyageur arrivant à un instant au hasard.');
    const frise = toile(el, 0.08);
    const c = toile(el, 0.42);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'l', libelle: 'Intensité λ (par minute)', min: 0.05, max: 1, pas: 0.05, valeur: 0.1, format: function (x) { return nb(x, 2) + ' (un toutes les ' + nb(1 / x, 3) + ' min)'; } }
    ], dessiner);
    bouton(el, 'Nouveaux tirages', function () { graine++; dessiner(); });
    function dessiner() {
      const l = v.l, a = o.hasard(3900 + graine), horizon = 20000 / l;
      const temps = [];
      let t = 0;
      while (t < horizon) { t += -Math.log(1 - a()) / l; temps.push(t); }
      const ecarts = [];
      for (let i = 1; i < temps.length; i++) ecarts.push(temps[i] - temps[i - 1]);
      // voyageurs arrivant au hasard : attente et longueur de l'intervalle qui les contient
      let attente = 0, longueur = 0, nbv = 0, j = 0;
      for (let k = 0; k < 4000; k++) {
        const u = temps[0] + a() * (temps[temps.length - 1] - temps[0]);
        while (temps[j + 1] < u) j++;
        while (j > 0 && temps[j] > u) j--;
        attente += temps[j + 1] - u; longueur += temps[j + 1] - temps[j]; nbv++;
      }
      // frise des 60 premières minutes
      const rf = repere(frise, { xmin: 0, xmax: 60, ymin: 0, ymax: 1, fy: function () { return ''; } });
      rf.ctx.fillStyle = rf.col.accent;
      temps.filter(function (x) { return x <= 60; }).forEach(function (x) { rf.ctx.fillRect(rf.X(x) - 1, rf.Y(0.9), 2, rf.Y(0.1) - rf.Y(0.9)); });
      const L = 5 / l, nbBarres = 40, larg = L / nbBarres, hist = [], bords = [];
      for (let k = 0; k <= nbBarres; k++) bords.push(k * larg);
      for (let k = 0; k < nbBarres; k++) hist.push(0);
      ecarts.forEach(function (e) { const k = Math.floor(e / larg); if (k < nbBarres) hist[k]++; });
      const dens = hist.map(function (h) { return h / (ecarts.length * larg); });
      const r = repere(c, { xmin: 0, xmax: L, ymin: 0, ymax: l * 1.15 });
      barres(r, bords, dens, r.col.accent);
      const courbe = [];
      for (let k = 0; k <= 100; k++) { const x = k * L / 100; courbe.push([x, l * Math.exp(-l * x)]); }
      ligne(r, courbe, r.col.erreur, 2);
      const moy = ecarts.reduce(function (s, e) { return s + e; }, 0) / ecarts.length;
      out.innerHTML = 'Durée moyenne entre deux événements : <b>' + nb(moy, 3) + '</b> min (théorie 1/λ = ' + nb(1 / l, 3) + ')' +
        '<br>Voyageur arrivant au hasard : attente moyenne <b>' + nb(attente / nbv, 3) + '</b> min (1/λ, et non 1/(2λ)) · intervalle qui le contient : <b>' + nb(longueur / nbv, 3) + '</b> min (2/λ = ' + nb(2 / l, 3) + ')';
    }
    dessiner();
  }

  // --- 20. Matrice de corrélation 3 × 3 : quand est-elle valide ? --------------------------------------------------
  function valeursPropres3(m) { // matrice symétrique 3 × 3, méthode trigonométrique
    const p1 = m[0][1] * m[0][1] + m[0][2] * m[0][2] + m[1][2] * m[1][2];
    if (p1 < 1e-14) return [m[0][0], m[1][1], m[2][2]].sort(function (a, b) { return b - a; });
    const q = (m[0][0] + m[1][1] + m[2][2]) / 3;
    const p2 = Math.pow(m[0][0] - q, 2) + Math.pow(m[1][1] - q, 2) + Math.pow(m[2][2] - q, 2) + 2 * p1;
    const p = Math.sqrt(p2 / 6);
    const B = m.map(function (l, i) { return l.map(function (x, j) { return (x - (i === j ? q : 0)) / p; }); });
    const detB = B[0][0] * (B[1][1] * B[2][2] - B[1][2] * B[2][1]) - B[0][1] * (B[1][0] * B[2][2] - B[1][2] * B[2][0]) + B[0][2] * (B[1][0] * B[2][1] - B[1][1] * B[2][0]);
    const phi = Math.acos(Math.max(-1, Math.min(1, detB / 2))) / 3;
    const e1 = q + 2 * p * Math.cos(phi), e3 = q + 2 * p * Math.cos(phi + 2 * Math.PI / 3);
    return [e1, 3 * q - e1 - e3, e3];
  }
  function correlations(el) {
    entete(el, 'Une matrice de corrélation 3 × 3 est-elle possible ?', 'Fixe ρ₁₂ et ρ₁₃, puis déplace ρ₂₃. Courbe : det R en fonction de ρ₂₃ ; la zone verte est l’intervalle admissible ab ± √((1 − a²)(1 − b²)). En bas : les trois valeurs propres (toutes ≥ 0 pour une matrice valide).');
    const c = toile(el, 0.42);
    const c2 = toile(el, 0.2);
    const out = sortie(el);
    const f2 = function (x) { return nb(x, 2); };
    const v = commandes(el, [
      { nom: 'a', libelle: 'ρ₁₂', min: -1, max: 1, pas: 0.05, valeur: 0.9, format: f2 },
      { nom: 'b', libelle: 'ρ₁₃', min: -1, max: 1, pas: 0.05, valeur: 0.7, format: f2 },
      { nom: 'c', libelle: 'ρ₂₃', min: -1, max: 1, pas: 0.05, valeur: 0, format: f2 }
    ], dessiner);
    function det(a, b, x) { return 1 + 2 * a * b * x - a * a - b * b - x * x; }
    function dessiner() {
      const a = v.a, b = v.b, x = v.c;
      const largeur = Math.sqrt(Math.max(0, (1 - a * a) * (1 - b * b)));
      const lo = a * b - largeur, hi = a * b + largeur;
      const r = repere(c, { xmin: -1, xmax: 1, ymin: -1.2, ymax: 1.05 });
      r.ctx.fillStyle = r.col.succes; r.ctx.globalAlpha = 0.15;
      r.ctx.fillRect(r.X(lo), r.Y(1.05), r.X(hi) - r.X(lo), r.Y(-1.2) - r.Y(1.05));
      r.ctx.globalAlpha = 1;
      ligne(r, [[-1, 0], [1, 0]], r.col.doux, 1, true);
      const courbe = [];
      for (let k = 0; k <= 200; k++) { const t = -1 + k / 100; courbe.push([t, Math.max(-1.2, det(a, b, t))]); }
      ligne(r, courbe, r.col.accent, 2);
      const d = det(a, b, x);
      r.ctx.fillStyle = d >= -1e-12 ? r.col.succes : r.col.erreur;
      r.ctx.beginPath(); r.ctx.arc(r.X(x), r.Y(Math.max(-1.2, d)), 5, 0, 2 * Math.PI); r.ctx.fill();
      const vp = valeursPropres3([[1, a, b], [a, 1, x], [b, x, 1]]);
      const r2 = repere(c2, { xmin: 0, xmax: 3, ymin: Math.min(-0.5, vp[2] - 0.1), ymax: Math.max(3, vp[0] + 0.1), fx: function () { return ''; } });
      vp.forEach(function (l, i) {
        r2.ctx.fillStyle = l >= -1e-12 ? r2.col.accent : r2.col.erreur;
        const y0 = r2.Y(0), y1 = r2.Y(l);
        r2.ctx.fillRect(r2.X(i + 0.25), Math.min(y0, y1), r2.X(i + 0.75) - r2.X(i + 0.25), Math.abs(y1 - y0));
      });
      ligne(r2, [[0, 0], [3, 0]], r2.col.doux, 1);
      out.innerHTML = 'det R = <b>' + nb(d, 4) + '</b> · valeurs propres ' + vp.map(function (l) { return nb(l, 3); }).join(' ; ') +
        ' · ρ₂₃ admissible dans [' + nb(lo, 3) + ' ; ' + nb(hi, 3) + '] · ' +
        (d >= -1e-12 && vp[2] >= -1e-12 ? '<b style="color:var(--succes)">matrice valide</b>' : '<b style="color:var(--erreur)">impossible : aucune variable aléatoire n’a ces corrélations</b>');
    }
    dessiner();
  }

  // --- 21. Option à barrière : simulation contre la réplication de Carr ---------------------------------------------
  function barriere(el) {
    entete(el, 'Down-and-in et down-and-out call', 'S₀ = K = 100, T = 1 an, taux nul. Trajectoires rouges : la barrière a été touchée (la knock-in est active). On compare le prix simulé (3 000 trajectoires) à la formule (S₀/B)·C(B²/S₀, K), et, en surveillance discrète, à la barrière décalée de Broadie-Glasserman-Kou.');
    const c = toile(el, 0.5);
    const out = sortie(el);
    let graine = 1;
    const v = commandes(el, [
      { nom: 'B', libelle: 'Barrière B', min: 70, max: 98, pas: 1, valeur: 90 },
      { nom: 's', libelle: 'Volatilité σ', min: 10, max: 40, pas: 1, valeur: 20, format: function (x) { return x + ' %'; } },
      { nom: 'f', libelle: 'Surveillance', choix: [['0', 'continue'], ['1', 'quotidienne'], ['5', 'hebdomadaire'], ['21', 'mensuelle']], valeur: '0', transforme: Number }
    ], dessiner);
    bouton(el, 'Relancer', function () { graine++; dessiner(); });
    function dessiner() {
      const B = v.B, s = v.s / 100, f = v.f, a = o.hasard(4300 + graine), pas = 252, dt = 1 / pas;
      let sDI = 0, sDO = 0;
      const chemins = [];
      for (let j = 0; j < 3000; j++) {
        let S = 100, touche = false;
        const ch = j < 25 ? [[0, 100]] : null;
        for (let i = 1; i <= pas; i++) {
          const S2 = S * Math.exp(-s * s / 2 * dt + s * Math.sqrt(dt) * gauss(a));
          if (!touche) {
            if (f === 0) {
              if (S2 <= B) touche = true;
              else if (a() < Math.exp(-2 * Math.log(S / B) * Math.log(S2 / B) / (s * s * dt))) touche = true; // pont brownien
            } else if (i % f === 0 && S2 <= B) touche = true;
          }
          S = S2;
          if (ch && i % 3 === 0) ch.push([i * dt, S]);
        }
        const g = Math.max(S - 100, 0);
        if (touche) sDI += g; else sDO += g;
        if (ch) chemins.push({ ch: ch, touche: touche });
      }
      const r = repere(c, { xmin: 0, xmax: 1, ymin: 50, ymax: 170 });
      chemins.forEach(function (x) { ligne(r, x.ch, x.touche ? r.col.erreur : r.col.accent, 1); });
      ligne(r, [[0, B], [1, B]], r.col.texte, 1.6, true);
      ligne(r, [[0, 100], [1, 100]], r.col.doux, 1, true);
      const vanille = bs(100, 100, s, 1, 0).call;
      const formuleDI = function (b) { return 100 / b * bs(b * b / 100, 100, s, 1, 0).call; };
      const bEff = f ? B * Math.exp(-0.5826 * s * Math.sqrt(f * dt)) : B;
      out.innerHTML = 'Simulé : down-and-in <b>' + nb(sDI / 3000, 4) + '</b>, down-and-out <b>' + nb(sDO / 3000, 4) + '</b> (somme ' + nb((sDI + sDO) / 3000, 4) + ', vanille ' + nb(vanille, 4) + ')' +
        '<br>Formule' + (f ? ' avec la barrière décalée ' + nb(bEff, 4) : '') + ' : down-and-in ' + nb(formuleDI(bEff), 4) + ', down-and-out ' + nb(vanille - formuleDI(bEff), 4) +
        ' <span class="doux">(écart dû au tirage : environ ±0,2)</span>';
    }
    dessiner();
  }

  P.widgets = { barriere: barriere, correlations: correlations, poisson: poisson, tcl: tcl, covariance: covariance, quadrants: quadrants, brownien: brownien, ito: ito, marche: marche, bs: bsWidget,
    binomial: binomial, montecarlo: montecarlo, kelly: kelly, ou: ou, svi: svi, couverture: couverture, conditionnement: conditionnement,
    regression: regression, obligation: obligation, glosten: glosten, gradient: gradient };
})(this);
