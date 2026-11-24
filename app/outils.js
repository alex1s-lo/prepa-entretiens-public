// Outils communs : échappement, Markdown simple, lecture d'une réponse numérique, dates, hasard reproductible.
(function (racine) {
  'use strict';

  function echapper(texte) {
    return String(texte == null ? '' : texte)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // --- Formules (KaTeX si présent, sinon le code TeX affiché tel quel) -------------------------------------------------
  function rendreTex(tex, affichage) {
    const k = racine && racine.katex;
    if (k) {
      try { return k.renderToString(tex, { displayMode: !!affichage, throwOnError: false, strict: 'ignore', trust: false }); } catch (e) { /* repli */ }
    }
    return affichage ? '<pre class="tex">' + echapper(tex) + '</pre>' : '<code class="tex">' + echapper(tex) + '</code>';
  }

  // --- Markdown simple (titres, listes, tableaux, code, gras, italique, liens, citations) ---------------------------
  // options.maths : formules $…$ et $$…$$ ; options.prose : les lignes d'un paragraphe sont jointes par une espace.
  function enLigne(texte, options) {
    const codes = [];
    const formules = [];
    let source = String(texte == null ? '' : texte);
    if (options && options.maths) {
      source = source.replace(/(^|[^\\])\$([^$\n]+?)\$/g, function (_, avant, tex) {
        formules.push(tex);
        return avant + '\u0003' + (formules.length - 1) + '\u0003';
      }).replace(/\\\$/g, '$');
    }
    let t = echapper(source).replace(/`([^`]+)`/g, function (_, c) { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[\s(«])_([^_\n]+)_(?=$|[\s).,;:!?»])/g, '$1<em>$2</em>');
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    t = t.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>').replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
    t = t.replace(/\u0000(\d+)\u0000/g, function (_, i) { return '<code>' + codes[Number(i)] + '</code>'; });
    if (formules.length) t = t.replace(/\u0003(\d+)\u0003/g, function (_, i) { return rendreTex(formules[Number(i)], false); });
    return t;
  }

  function markdown(source, options) {
    const opts = options || {};
    const ligne = function (t) { return enLigne(t, opts); };
    let texte = String(source || '').replace(/\r\n?/g, '\n');
    const blocsMaths = [];
    if (opts.maths) {
      texte = texte.replace(/\$\$([\s\S]+?)\$\$/g, function (_, tex) {
        blocsMaths.push(tex.trim());
        return '\n\u0004' + (blocsMaths.length - 1) + '\u0004\n';
      });
    }
    const lignes = texte.split('\n');
    const html = [];
    let i = 0;
    while (i < lignes.length) {
      const l = lignes[i];
      const formule = /^\u0004(\d+)\u0004$/.exec(l.trim());
      if (formule) {
        html.push('<div class="math-bloc">' + rendreTex(blocsMaths[Number(formule[1])], true) + '</div>');
        i++;
        continue;
      }
      if (/^```/.test(l)) {
        const bloc = [];
        i++;
        while (i < lignes.length && !/^```/.test(lignes[i])) { bloc.push(lignes[i]); i++; }
        i++;
        html.push('<pre><code>' + echapper(bloc.join('\n')) + '</code></pre>');
        continue;
      }
      const titre = /^(#{1,4})\s+(.*)$/.exec(l);
      if (titre) {
        const n = titre[1].length + 1;
        html.push('<h' + n + '>' + ligne(titre[2]) + '</h' + n + '>');
        i++;
        continue;
      }
      if (/^\|.*\|\s*$/.test(l)) {
        const rangs = [];
        while (i < lignes.length && /^\|.*\|\s*$/.test(lignes[i])) { rangs.push(lignes[i]); i++; }
        const cellules = function (r) { return r.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); };
        let tete = null;
        let corps = rangs;
        if (rangs.length > 1 && /^\|[\s:|-]+\|\s*$/.test(rangs[1])) { tete = cellules(rangs[0]); corps = rangs.slice(2); }
        let t = '<div class="tableau"><table>';
        if (tete) t += '<thead><tr>' + tete.map(function (c) { return '<th>' + ligne(c) + '</th>'; }).join('') + '</tr></thead>';
        t += '<tbody>' + corps.map(function (r) {
          return '<tr>' + cellules(r).map(function (c) { return '<td>' + ligne(c) + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
        html.push(t);
        continue;
      }
      if (/^\s*[-*]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l)) {
        const ordonnee = /^\s*\d+[.)]\s+/.test(l);
        const items = [];
        while (i < lignes.length && (ordonnee ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/).test(lignes[i])) {
          let item = lignes[i].replace(ordonnee ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/, '');
          i++;
          while (i < lignes.length && /^\s{2,}\S/.test(lignes[i]) && !/^\s*([-*]|\d+[.)])\s+/.test(lignes[i])) {
            item += ' ' + lignes[i].trim();
            i++;
          }
          items.push('<li>' + ligne(item) + '</li>');
        }
        html.push((ordonnee ? '<ol>' : '<ul>') + items.join('') + (ordonnee ? '</ol>' : '</ul>'));
        continue;
      }
      if (/^>\s?/.test(l)) {
        const bloc = [];
        while (i < lignes.length && /^>\s?/.test(lignes[i])) { bloc.push(lignes[i].replace(/^>\s?/, '')); i++; }
        html.push('<blockquote>' + markdown(bloc.join('\n'), opts) + '</blockquote>');
        continue;
      }
      if (!l.trim()) { i++; continue; }
      const para = [];
      while (i < lignes.length && lignes[i].trim() && !/^(```|#{1,4}\s|\||>|\s*[-*]\s+|\s*\d+[.)]\s+|\u0004)/.test(lignes[i])) {
        para.push(lignes[i]);
        i++;
      }
      if (!para.length) { para.push(lignes[i]); i++; }
      html.push('<p>' + (opts.prose ? ligne(para.join(' ')) : para.map(ligne).join('<br>')) + '</p>');
    }
    return html.join('\n');
  }

  // --- Lecture d'une réponse numérique : « 1/6 », « 0,1667 », « 16,7 % », « 3/2^4 », « √2/2 », « e^-1 », « ln 2 » ---
  function lireNombre(saisie) {
    let s = String(saisie == null ? '' : saisie).trim().toLowerCase();
    if (!s) return NaN;
    s = s.replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt').replace(/\s+/g, '');
    // virgule décimale (« 0,25 ») : seulement entre deux chiffres et hors d'un appel de fonction à plusieurs arguments
    s = s.replace(/(\d),(\d)/g, '$1.$2');
    let pos = 0;
    const FONCTIONS = { sqrt: Math.sqrt, exp: Math.exp, ln: Math.log, log: Math.log, abs: Math.abs };
    function voir() { return s[pos]; }
    function erreur() { throw new Error('saisie'); }
    function expression() {
      let v = terme();
      while (voir() === '+' || voir() === '-') { const op = s[pos++]; const d = terme(); v = op === '+' ? v + d : v - d; }
      return v;
    }
    function terme() {
      let v = puissance();
      for (;;) {
        if (voir() === '*' || voir() === '/') { const op = s[pos++]; const d = puissance(); v = op === '*' ? v * d : v / d; }
        else if (voir() !== undefined && /[0-9a-z(.]/.test(voir())) { v = v * puissance(); } // multiplication implicite : 2pi, 3sqrt2
        else break;
      }
      return v;
    }
    function puissance() {
      const base = unaire();
      if (voir() === '^' || (voir() === '*' && s[pos + 1] === '*')) {
        pos += voir() === '^' ? 1 : 2;
        return Math.pow(base, puissanceDroite());
      }
      return base;
    }
    function puissanceDroite() { // l'exposant peut porter un signe : e^-1
      if (voir() === '-') { pos++; return -puissanceDroite(); }
      if (voir() === '+') { pos++; return puissanceDroite(); }
      return puissance();
    }
    function unaire() {
      if (voir() === '-') { pos++; return -unaire(); }
      if (voir() === '+') { pos++; return unaire(); }
      return primaire();
    }
    function primaire() {
      let v;
      if (voir() === '(') {
        pos++;
        v = expression();
        if (voir() !== ')') erreur();
        pos++;
      } else if (/[0-9.]/.test(voir() || '')) {
        const m = /^(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/.exec(s.slice(pos));
        if (!m) erreur();
        pos += m[0].length;
        v = parseFloat(m[0]);
      } else if (/[a-z]/.test(voir() || '')) {
        const m = /^[a-z]+/.exec(s.slice(pos));
        const nom = m[0];
        pos += nom.length;
        if (nom === 'pi') v = Math.PI;
        else if (nom === 'e') v = Math.E;
        else if (FONCTIONS[nom]) v = FONCTIONS[nom](voir() === '(' ? primaire() : puissance());
        else erreur();
      } else erreur();
      if (voir() === '%') { pos++; v = v / 100; }
      if (voir() === '!') { pos++; v = factorielle(v); }
      return v;
    }
    try {
      const v = expression();
      if (pos !== s.length) return NaN;
      return v;
    } catch (e) {
      return NaN;
    }
  }

  function factorielle(n) {
    if (n < 0 || n !== Math.floor(n) || n > 170) throw new Error('factorielle');
    let r = 1;
    for (let k = 2; k <= n; k++) r *= k;
    return r;
  }

  // Vrai si « valeur » est égale à « attendu » à la tolérance relative près (absolue si attendu vaut 0).
  function procheDe(valeur, attendu, tolerance) {
    if (!isFinite(valeur)) return false;
    const tol = tolerance == null ? 0.005 : tolerance;
    if (attendu === 0) return Math.abs(valeur) <= Math.max(tol, 1e-9);
    return Math.abs(valeur - attendu) <= tol * Math.abs(attendu) + 1e-12;
  }

  function formaterNombre(v, chiffres) {
    if (!isFinite(v)) return '—';
    const n = chiffres == null ? 4 : chiffres;
    const arrondi = Number(v.toPrecision(n));
    if (Math.abs(arrondi) >= 1e4 && Math.abs(arrondi) < 1e15) {
      try { return arrondi.toLocaleString('fr-FR', { maximumFractionDigits: 0 }); } catch (e) { /* repli ci-dessous */ }
    }
    if (Math.abs(arrondi) >= 1e15) return String(arrondi.toExponential(n - 1)).replace('.', ',').replace('e+', ' × 10^');
    return String(arrondi).replace('.', ',');
  }

  // --- Dates locales au format AAAA-MM-JJ ----------------------------------------------------------------------------
  function jourDe(date) {
    const d = date || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function versDate(jour) {
    const p = jour.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2], 12);
  }
  function ajouterJours(jour, n) {
    const d = versDate(jour);
    d.setDate(d.getDate() + n);
    return jourDe(d);
  }
  function ecartJours(de, a) {
    return Math.round((versDate(a) - versDate(de)) / 86400000);
  }
  function dateLisible(jour) {
    const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const p = jour.split('-').map(Number);
    return p[2] + ' ' + mois[p[1] - 1] + ' ' + p[0];
  }

  // --- Hasard reproductible (mulberry32) -----------------------------------------------------------------------------
  function hasard(graine) {
    let a = (graine == null ? Math.floor(Math.random() * 4294967296) : graine) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function entier(alea, min, max) { return min + Math.floor(alea() * (max - min + 1)); }
  function choisir(alea, liste) { return liste[Math.floor(alea() * liste.length)]; }
  function melanger(alea, liste) {
    const t = liste.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(alea() * (i + 1));
      const x = t[i]; t[i] = t[j]; t[j] = x;
    }
    return t;
  }

  // Première ligne d'un texte Markdown, sans balisage, coupée proprement à « max » caractères.
  function resume(texte, max) {
    const n = max || 120;
    let l = String(texte || '').split('\n').filter(function (x) { return x.trim() && !/^```/.test(x); })[0] || '';
    l = l.replace(/[*`]/g, '').replace(/\^\{([^{}]+)\}/g, '^$1').replace(/_\{([^{}]+)\}/g, '_$1').trim();
    if (l.length <= n) return l;
    const coupe = l.slice(0, n);
    const espace = coupe.lastIndexOf(' ');
    return (espace > n * 0.6 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:(.]+$/, '') + '…';
  }

  // Texte brut prononçable à partir d'un énoncé Markdown (pour la synthèse vocale).
  function textePrononcable(texte, anglais) {
    const fr = !anglais;
    return String(texte || '')
      .replace(/```[\s\S]*?```/g, fr ? ' (code affiché à l’écran) ' : ' (code shown on screen) ')
      .replace(/[*`_>#|]/g, ' ')
      .replace(/\^\{([^{}]+)\}/g, fr ? ' puissance $1 ' : ' to the power $1 ')
      .replace(/×/g, fr ? ' fois ' : ' times ').replace(/÷/g, fr ? ' divisé par ' : ' divided by ')
      .replace(/√/g, fr ? ' racine de ' : ' square root of ').replace(/²/g, fr ? ' au carré ' : ' squared ')
      .replace(/≈/g, fr ? ' environ ' : ' about ').replace(/≥/g, fr ? ' supérieur ou égal à ' : ' at least ')
      .replace(/≤/g, fr ? ' inférieur ou égal à ' : ' at most ').replace(/−/g, '-')
      .replace(/\s+/g, ' ').trim();
  }

  function duree(secondes) {
    const s = Math.max(0, Math.round(secondes));
    const m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
  }

  const outils = {
    echapper: echapper, markdown: markdown, enLigne: enLigne, rendreTex: rendreTex, lireNombre: lireNombre, procheDe: procheDe,
    formaterNombre: formaterNombre, jourDe: jourDe, ajouterJours: ajouterJours, ecartJours: ecartJours,
    dateLisible: dateLisible, resume: resume, textePrononcable: textePrononcable, hasard: hasard, entier: entier, choisir: choisir, melanger: melanger, duree: duree,
    factorielle: factorielle
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = outils;
  else (racine.Prepa = racine.Prepa || {}).outils = outils;
})(this);
