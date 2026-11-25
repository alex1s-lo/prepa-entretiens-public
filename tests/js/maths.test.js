// Toutes les formules du cours doivent être acceptées par KaTeX (sinon elles s'afficheraient en rouge).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');

const racine = path.join(__dirname, '..', '..');
const katex = require(path.join(racine, 'app', 'vendor', 'katex', 'katex.min.js'));

function chargerCours() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(racine, 'app', 'cours.js'), 'utf8'), ctx);
  return ctx.window.PREPA_COURS;
}

function formules(texte) {
  const sansCode = texte.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  const res = [];
  const sansBlocs = sansCode.replace(/\$\$([\s\S]+?)\$\$/g, function (_, tex) { res.push({ tex: tex.trim(), bloc: true }); return ''; });
  sansBlocs.replace(/(^|[^\\])\$([^$\n]+?)\$/g, function (_, avant, tex) { res.push({ tex: tex, bloc: false }); return ''; });
  return res;
}

test('chaque formule du cours se compile avec KaTeX', () => {
  const cours = chargerCours();
  let total = 0;
  const erreurs = [];
  for (const c of cours.chapitres) {
    for (const f of formules(c.texte + '\n' + c.resume)) {
      total++;
      try {
        katex.renderToString(f.tex, { displayMode: f.bloc, throwOnError: true, strict: 'ignore' });
      } catch (e) {
        erreurs.push(c.id + ' : ' + f.tex.slice(0, 80) + ' → ' + e.message.slice(0, 120));
      }
    }
  }
  assert.ok(total > 100, 'peu de formules trouvées : ' + total);
  assert.deepEqual(erreurs, []);
});

function chargerBanque() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(racine, 'app', 'banque.js'), 'utf8'), ctx);
  return ctx.window.PREPA_BANQUE;
}
function textesFiche(f) {
  return [f.titre, f.question, f.en, f.indice, f.solution, f.piege].concat(f.relances || [], f.variantes || []).filter(Boolean);
}

test('chaque formule des fiches, des variantes et des guides se compile avec KaTeX', () => {
  const banque = chargerBanque();
  let total = 0;
  const erreurs = [];
  const textes = [];
  banque.fiches.forEach(function (f) { textesFiche(f).forEach(function (t) { textes.push([f.id, t]); }); });
  banque.guides.forEach(function (g) { textes.push([g.id, g.texte]); });
  for (const [id, t] of textes) {
    for (const f of formules(t)) {
      total++;
      try {
        katex.renderToString(f.tex, { displayMode: f.bloc, throwOnError: true, strict: 'ignore' });
      } catch (e) {
        erreurs.push(id + ' : ' + f.tex.slice(0, 80) + ' → ' + e.message.slice(0, 120));
      }
    }
  }
  assert.ok(total > 2500, 'peu de formules trouvées : ' + total);
  assert.deepEqual(erreurs, []);
});

test('aucun symbole mathématique hors d’une formule dans les fiches et les guides', () => {
  const banque = chargerBanque();
  // flèche « → » autorisée en prose (« Réglages → profil »), comme « ° » et « % »
  const symbole = /[²³⁴⁵⁶⁷⁸⁹⁰¹ⁿ₀₁₂₃₄₅₆₇₈₉ₙᵢₜ√σμρλπθαβγδεκΣ∑∫≈≤≥×∞≠±Δℓ]/;
  const fautes = [];
  const verifier = function (id, t) {
    const hors = t.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '').replace(/\b(?:k?m|cm|mm|m\/s)[²³]/g, '')
      .replace(/\$\$[\s\S]+?\$\$/g, '').replace(/(^|[^\\])\$([^$\n]+?)\$/g, '$1');
    const m = symbole.exec(hors);
    if (m) fautes.push(id + ' : « ' + hors.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\n/g, ' ') + ' »');
  };
  banque.fiches.forEach(function (f) { textesFiche(f).forEach(function (t) { verifier(f.id, t); }); });
  banque.guides.forEach(function (g) { verifier(g.id, g.texte); });
  assert.deepEqual(fautes, []);
});
