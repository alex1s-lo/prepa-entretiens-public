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
