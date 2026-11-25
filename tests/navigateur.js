// Parcours complet de l'application dans Chromium (Playwright), ouverte depuis le disque (file://) comme chez
// l'utilisateur. Échoue à la moindre erreur JavaScript. Usage : node tests/navigateur.js [dossier-captures]
'use strict';
const path = require('node:path');
const fs = require('node:fs');
let playwright;
try { playwright = require('playwright'); } catch (e) { console.log('SAUTE : playwright absent'); process.exit(0); }

const RACINE = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(RACINE, 'index.html');
const CAPTURES = process.argv[2] || '';

function verifier(cond, message) { if (!cond) throw new Error(message); }

(async () => {
  const navigateur = await playwright.chromium.launch();
  const erreurs = [];
  const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await contexte.newPage();
  page.on('pageerror', (e) => erreurs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
  page.on('dialog', (d) => { erreurs.push('boîte de dialogue native : ' + d.message()); d.dismiss(); });
  const capture = async (nom) => { if (CAPTURES) await page.screenshot({ path: path.join(CAPTURES, nom + '.png'), fullPage: true }); };
  const titre = async () => (await page.textContent('main h1')).trim();
  // clique un lien de navigation et attend que l'écran correspondant soit affiché
  const naviguer = async (id, attendu) => {
    if (process.env.DEBUG) console.log('->', id);
    await page.click('nav a[href="#' + id + '"]');
    await page.waitForFunction((t) => { const h = document.querySelector('main h1'); return h && h.textContent.trim() === t; }, attendu);
  };

  await page.goto(URL);
  verifier((await titre()) === 'Aujourd’hui', 'accueil : ' + await titre());
  verifier(await page.isVisible('text=Par où commencer'), 'accueil : guide de démarrage absent');
  verifier(!!(await page.$('.liste-fiches a[href="#cours/c=mode-emploi"]')), 'accueil : chapitre du cours à lire');
  await capture('01-accueil');

  // --- Révisions : une session complète de 4 cartes ---
  await naviguer('revisions', 'Révisions');
  for (let k = 0; k < 4; k++) {
    await page.waitForSelector('.carte-question');
    const saisie = await page.$('[data-saisie]');
    if (saisie) {
      await saisie.fill('1/6');
      await page.click('[data-form] button');
      await page.waitForSelector('[data-verdict] .encadre');
    } else {
      await page.keyboard.press('Space');
    }
    await page.waitForSelector('[data-solution]:not([hidden])');
    if (k === 0) await capture('02-revision');
    await page.keyboard.press(String(1 + (k % 4)));
    await page.waitForTimeout(250);
  }
  const etat1 = await page.evaluate(() => JSON.parse(localStorage.getItem('prepa-entretiens-v1')));
  verifier(Object.keys(etat1.cartes).length === 4, 'quatre cartes notées, trouvé ' + Object.keys(etat1.cartes).length);
  // la carte ratée (note 0) est due aujourd'hui
  verifier(Object.values(etat1.cartes).some((c) => c.intervalle === 0), 'carte ratée reprogrammée aujourd’hui');

  // banque de questions : recherche
  await page.click('[data-onglet="banque"]');
  await page.waitForSelector('[data-cherche]');
  await page.fill('[data-cherche]', 'Itô');
  await page.waitForTimeout(100);
  const n = await page.$$eval('.liste-fiches > li', (l) => l.length);
  verifier(n >= 3, 'recherche « Itô » : ' + n + ' résultats');
  await page.click('[data-onglet="themes"]');
  await page.waitForSelector('a[href="#revisions/onglet=themes/theme=projets/mode=libre"]');
  verifier((await page.$$('.grille .carte')).length >= 12, 'cartes de thèmes');
  await page.click('a[href="#revisions/onglet=themes/theme=projets/mode=libre"]');
  await page.waitForSelector('.carte-question');
  verifier((await page.textContent('.carte-question .etiquette.accent')).includes('Projets types'), 'révision libre du thème projets');
  // bascule de langue
  const avant = await page.textContent('[data-enonce]');
  await page.click('[data-langue]');
  const apres = await page.textContent('[data-enonce]');
  verifier(avant !== apres, 'bascule FR/EN');

  // --- Les essentiels ---
  await page.evaluate(() => { location.hash = '#revisions/onglet=themes/theme=essentiels/mode=libre'; });
  await page.waitForSelector('.carte-question .etiquette.alerte');
  verifier((await page.textContent('.carte-question .etiquette.alerte')).includes('essentiel'), 'session des essentiels');
  verifier((await page.textContent('.progression-texte')).includes('/ 15'), 'quinze essentiels par session');

  // --- Cours : sommaire, chapitre avec formules, exercice vérifié, widget, lien fiche → cours ---
  await naviguer('cours', 'Cours');
  verifier((await page.$$('.chapitre-carte')).length >= 2, 'chapitres du cours');
  verifier((await page.$$('[data-demo]')).length === 15, 'quinze démonstrations incontournables');
  await page.check('[data-demo="bs"]');
  verifier((await page.textContent('[data-compte-demos]')).startsWith('1 / 15'), 'démonstration cochée');
  verifier(await page.evaluate(() => !!JSON.parse(localStorage.getItem('prepa-entretiens-v1')).cours.demos.bs), 'démonstration enregistrée');
  await page.click('.chapitre-carte[href="#cours/c=esperance-variance-covariance"]');
  await page.waitForSelector('.cours-article .katex');
  verifier((await page.$$('.cours-article .katex')).length > 100, 'formules rendues par KaTeX');
  verifier((await page.$$('.cours-article code.tex')).length === 0, 'aucune formule laissée en TeX brut');
  verifier((await page.$$('.widget canvas')).length >= 1, 'widget du chapitre');
  verifier(await page.isVisible('[data-imprimer-chapitre]'), 'bouton d’impression du chapitre');
  await page.fill('[data-exercice="ex-var-combinaison"] input', '19');
  await page.click('[data-exercice="ex-var-combinaison"] button[type="submit"]');
  verifier((await page.textContent('[data-exercice="ex-var-combinaison"] [data-statut-ex]')) === 'fait', 'exercice du cours validé');
  await capture('14-cours-chapitre');
  await page.click('.fin-chapitre a.principal');
  await page.waitForSelector('.carte-question');
  verifier(/\/ \d+/.test(await page.textContent('.progression-texte')), 'session des fiches du chapitre');
  verifier((await page.textContent('.carte-question')).length > 0 && (await page.textContent('main')).includes('Cours, chapitre 1'), 'titre de la session du chapitre');
  await page.evaluate(() => { location.hash = '#revisions/fiche=proba-points-fixes'; });
  await page.waitForSelector('.carte-question [data-saisie]');
  await page.fill('[data-saisie]', '1');
  await page.click('[data-form] button');
  await page.waitForSelector('a[href="#cours/c=esperance-variance-covariance"]');

  // tous les chapitres : formules sans erreur, titres d'encadrés rendus, chaque simulation dessinée et manipulable
  const chapitres = await page.evaluate(() => window.PREPA_COURS.chapitres.map((c) => ({ id: c.id, titre: c.titre, widgets: c.widgets.length })));
  let simulations = 0;
  for (const ch of chapitres) {
    await page.evaluate((id) => { location.hash = '#cours/c=' + id; }, ch.id);
    await page.waitForFunction((t) => { const h = document.querySelector('.cours-article h1'); return h && h.textContent.trim() === t; }, ch.titre);
    verifier((await page.$$('.cours-article .katex-error, .cours-article code.tex')).length === 0, 'formule en erreur : ' + ch.id);
    const titresBruts = await page.$$eval('.bloc-titre-cours', (els) => els.filter((e) => /\$|\[\[fiche/.test(e.textContent)).length);
    verifier(titresBruts === 0, 'titre d’encadré non rendu : ' + ch.id);
    const texteHorsFormules = await page.$eval('.cours-article', (a) => { const c = a.cloneNode(true); c.querySelectorAll('.katex').forEach((k) => k.remove()); return c.textContent; });
    verifier(!/\[\[|\u0005/.test(texteHorsFormules), 'lien ou renvoi non rendu : ' + ch.id);
    const widgets = await page.$$('.widget');
    verifier(widgets.length === ch.widgets, 'simulations de ' + ch.id + ' : ' + widgets.length + ' sur ' + ch.widgets);
    for (const w of widgets) {
      verifier((await w.$$('canvas')).length >= 1 && (await w.textContent()).length > 40, 'simulation vide dans ' + ch.id);
      const curseur = await w.$('input[type="range"]');
      if (curseur) await curseur.evaluate((c) => { c.value = c.max; c.dispatchEvent(new Event('input')); });
      simulations++;
    }
  }
  verifier(simulations >= 18, 'simulations parcourues : ' + simulations);

  // répétition espacée du cours : un exercice et une démonstration arrivés à échéance reviennent
  await page.evaluate(() => {
    const A = window.Prepa.app;
    A.etat.cours.exercices['ex-var-combinaison'] = { juste: true, jour: '2000-01-01', n: 1, echeance: '2000-01-04' };
    A.etat.cours.demos.bs = { juste: true, jour: '2000-01-01', n: 1, echeance: '2000-01-04' };
    A.sauver();
    location.hash = '#accueil';
  });
  await page.waitForFunction(() => /à refaire/.test(document.querySelector('main').textContent));
  verifier(/1 exercice et 1 démonstration à refaire/.test(await page.textContent('main')), 'accueil : cours à refaire');
  await page.evaluate(() => { location.hash = '#cours'; });
  await page.waitForSelector('[data-a-refaire]');
  verifier((await page.$$('[data-a-refaire] li')).length === 2, 'deux éléments à refaire');
  await page.click('[data-demo-refaite="bs"]');
  await page.waitForFunction(() => document.querySelectorAll('[data-a-refaire] li').length === 1);
  const prochaine = await page.evaluate(() => window.Prepa.app.etat.cours.demos.bs);
  verifier(prochaine.n === 2 && prochaine.echeance > prochaine.jour, 'démonstration reprogrammée : ' + JSON.stringify(prochaine));
  await page.click('[data-a-refaire] a[href*="ex=ex-var-combinaison"]');
  await page.waitForSelector('[data-exercice="ex-var-combinaison"] [data-statut-ex]');
  verifier((await page.textContent('[data-exercice="ex-var-combinaison"] [data-statut-ex]')) === 'à refaire', 'exercice marqué à refaire');
  await page.fill('[data-exercice="ex-var-combinaison"] input', '19');
  await page.click('[data-exercice="ex-var-combinaison"] button[type="submit"]');
  const exo = await page.evaluate(() => window.Prepa.app.etat.cours.exercices['ex-var-combinaison']);
  verifier(exo.n === 2 && exo.juste === true, 'exercice reprogrammé : ' + JSON.stringify(exo));

  // --- Calcul mental : sprint de 2 minutes, quelques réponses, fin anticipée ---
  await naviguer('calcul', 'Calcul mental');
  await page.click('[data-format="sprint2"]');
  for (let k = 0; k < 6; k++) {
    const q = await page.textContent('[data-question]');
    const expr = q.replace(' =', '').replace(/,/g, '.').replace('−', '-').replace('×', '*').replace('÷', '/');
    const val = Function('"use strict"; return (' + expr + ')')();
    await page.fill('[data-saisie]', String(Math.round(val * 1e6) / 1e6));
    await page.keyboard.press('Enter');
  }
  await capture('03-calcul');
  await page.click('[data-fin]');
  await page.waitForSelector('text=Résultat');
  const score = await page.textContent('.chiffre');
  verifier(score.trim() === '6', 'six bonnes réponses au calcul, lu : ' + score);

  // --- Entretien blanc complet (format court, sans projet) ---
  await naviguer('entretien', 'Entretien blanc');
  await page.selectOption('#eb-profil', 'mm');
  await page.selectOption('#eb-duree', 'court');
  await page.click('[data-config] button[type="submit"]');
  let etapes = 0;
  let relances = 0;
  while (etapes < 20) {
    const fini = await page.$('text=Bilan de l’entretien blanc');
    if (fini) break;
    await page.waitForSelector('.carte-question, [data-voir]');
    if (await page.$('[data-voir]')) {
      relances++;
      if (relances === 1) await capture('04b-relance');
      await page.click('[data-voir]');
      const ok = await page.$('[data-ok]');
      if (ok) await ok.click();
      await page.waitForTimeout(150);
      continue;
    }
    if (etapes === 1) await capture('04-entretien');
    await page.click('[data-reveler]');
    await page.waitForSelector('[data-note-val]');
    await page.click('[data-note-val="2"]');
    await page.waitForTimeout(250);
    etapes++;
  }
  verifier(etapes >= 5 && etapes <= 8, 'entretien court : ' + etapes + ' questions');
  await capture('05-bilan-entretien');
  // consignes pour Claude
  await naviguer('entretien', 'Entretien blanc');
  await page.click('a[href="#entretien/vue=claude"]');
  await page.waitForSelector('#cl-texte');
  await page.fill('#cl-entreprise', 'un teneur de marché');
  const consignes = await page.inputValue('#cl-texte');
  verifier(consignes.includes('un teneur de marché') && consignes.includes('[mois de début]'), 'consignes Claude');
  await page.selectOption('#cl-langue', 'en');
  verifier((await page.inputValue('#cl-texte')).startsWith('You are'), 'consignes en anglais');

  // --- Market making : une partie complète ---
  await naviguer('marche', 'Market making');
  await page.click('[data-config] button[type="submit"]');
  for (let k = 0; k < 4; k++) {
    await page.click('[data-aide]');
    const aide = await page.textContent('[data-aide-texte]');
    const e = parseFloat(/Espérance ([\d,]+)/.exec(aide)[1].replace(',', '.'));
    await page.fill('#mm-bid', String(e - 1));
    await page.fill('#mm-ask', String(e + 1));
    await page.click('[data-coter] button[type="submit"]');
    await page.waitForTimeout(100);
    if (k === 1) await capture('06-market-making');
  }
  await page.waitForSelector('text=Partie terminée');
  await capture('07-market-making-fin');

  // --- Paris répétés (Kelly) : 30 paris à 20 % ---
  await page.evaluate(() => { location.hash = '#marche/onglet=kelly'; });
  await page.waitForSelector('[data-kelly]');
  await page.selectOption('#k-tours', '30');
  await page.click('[data-kelly] button[type="submit"]');
  for (let k = 0; k < 30; k++) {
    const fin = await page.$('text=Fin de la série');
    if (fin) break;
    await page.fill('#k-f', '20');
    await page.click('[data-pari] button[type="submit"]');
  }
  await page.waitForSelector('text=Fin de la série');
  await page.waitForSelector('svg.courbes polyline.serie-3');
  await capture('07b-kelly');
  // à 20 % sur les mêmes tirages, le joueur et Kelly finissent avec la même richesse
  const chiffres = await page.$$eval('.grille .chiffre', (l) => l.map((x) => x.textContent));
  verifier(chiffres[0] === chiffres[1], 'même richesse que Kelly : ' + chiffres.join(' / '));

  // --- Test en ligne : format rapide, deux réponses, fin ---
  await page.evaluate(() => { location.hash = '#test'; });
  await page.waitForSelector('[data-config]');
  await page.selectOption('#t-profil', 'mm');
  await page.click('[data-config] button[type="submit"]');
  await page.waitForSelector('[data-saisie]');
  await capture('07c-test-en-ligne');
  await page.fill('[data-saisie]', '1/6');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  await page.click('[data-passer]');
  await page.fill('[data-saisie]', '0,5');
  await page.click('[data-terminer]');
  await page.waitForSelector('.voile button.principal');
  await page.click('.voile button.principal');
  await page.waitForSelector('text=Résultat du test');
  const lignes = await page.$$eval('main details', (l) => l.length);
  verifier(lignes === 10, 'test rapide : 10 questions corrigées, trouvé ' + lignes);
  const etatTest = await page.evaluate(() => JSON.parse(localStorage.getItem('prepa-entretiens-v1')));
  verifier(etatTest.tests.length === 1 && etatTest.tests[0].n === 10, 'test enregistré');

  // --- Estimations (calcul mental) ---
  await naviguer('calcul', 'Calcul mental');
  await page.click('[data-format="estimation"]');
  const qe = await page.textContent('[data-question]');
  verifier(/^Estime : .* ≈ \?$/.test(qe), 'question d’estimation : ' + qe);
  await page.fill('[data-saisie]', '12');
  await page.click('[data-signe]');
  verifier((await page.inputValue('[data-saisie]')) === '-12', 'bouton ± : ' + await page.inputValue('[data-saisie]'));
  await page.click('[data-signe]');
  verifier((await page.inputValue('[data-saisie]')) === '12', 'bouton ± (retour)');
  await page.click('[data-fin]');
  await page.waitForSelector('text=Résultat');
  await naviguer('calcul', 'Calcul mental');
  await page.click('[data-format="pricing"]');
  const qp = await page.textContent('[data-question]');
  verifier(/≈ \?$/.test(qp) && qp.length > 30, 'question de pricing : ' + qp);
  await page.click('[data-fin]');
  await page.waitForSelector('text=Résultat');
  await naviguer('calcul', 'Calcul mental');
  await page.click('[data-format="probas"]');
  const qq = await page.textContent('[data-question]');
  verifier(/\?$/.test(qq), 'question de probabilité rapide : ' + qq);
  await page.click('[data-fin]');

  // --- Casse-têtes : liste dédoublonnée, filtres, recherche, énigme jamais vue, variantes, notation ---
  await naviguer('casse-tetes', 'Casse-têtes');
  const nEnigmes = (await page.$$('.liste-ct li')).length;
  verifier(nEnigmes >= 200, 'casse-têtes : ' + nEnigmes + ' énigmes listées');
  const titresCt = await page.$$eval('.titre-ct', (l) => l.map((x) => x.textContent.trim().toLowerCase()));
  verifier(new Set(titresCt).size === titresCt.length, 'casse-têtes : titres en double');
  await page.click('[data-ct-cat="pesees"]');
  const nPesees = (await page.$$('.liste-ct li')).length;
  verifier(nPesees > 5 && nPesees < nEnigmes, 'filtre par famille : ' + nPesees);
  await page.click('[data-ct-cat=""]');
  await page.fill('[data-ct-texte]', 'chapeau');
  await page.waitForFunction(() => document.querySelectorAll('.liste-ct li').length >= 3);
  await page.fill('[data-ct-texte]', '');
  await page.click('[data-ct-hasard]');
  await page.waitForSelector('h1.titre-enigme');
  await page.goto(URL + '#casse-tetes/f=ct-prisonniers-boites');
  await page.waitForSelector('h1.titre-enigme');
  verifier((await page.$$('.carte-question .katex')).length > 0, 'casse-têtes : formule de l’énoncé rendue');
  await page.click('[data-reveler]');
  verifier((await page.$$('ul.variantes li')).length >= 2, 'casse-têtes : variantes affichées avec la solution');
  await page.click('[data-note-val="2"]');
  await page.waitForSelector('[data-ct-suite] a.bouton');
  verifier(await page.evaluate(() => !!window.Prepa.app.etat.cartes['ct-prisonniers-boites']), 'casse-têtes : note enregistrée');
  await page.click('[data-ct-suite] a[href="#casse-tetes"]');
  await page.waitForSelector('.liste-ct');
  verifier((await page.textContent('[data-ct-vues]')).trim() !== '0', 'casse-têtes : compteur des énigmes vues');
  await capture('16-casse-tetes');

  // --- Histoires ---
  await naviguer('histoires', 'Mes histoires');
  await page.click('[data-histoire="pitch"] summary');
  await page.fill('[data-histoire="pitch"] [data-texte]', 'Je suis en césure et je cherche un stage quant de cinq à six mois à partir de [mois de début], parce que…');
  await page.waitForTimeout(100);
  verifier((await page.textContent('[data-histoire="pitch"] [data-statut]')) === 'rédigée · FR', 'histoire rédigée');
  await page.click('[data-histoire="pitch"] [data-langue-histoire="en"]');
  verifier((await page.inputValue('[data-histoire="pitch"] [data-texte]')) === '', 'version anglaise vide au départ');
  await page.fill('[data-histoire="pitch"] [data-texte]', 'I am a student looking for a five to six month quant internship starting in March 2027…');
  await page.waitForTimeout(100);
  verifier((await page.textContent('[data-histoire="pitch"] [data-statut]')) === 'rédigée · FR + EN', 'histoire en deux langues');
  await page.click('[data-histoire="pitch"] [data-langue-histoire="fr"]');
  verifier((await page.inputValue('[data-histoire="pitch"] [data-texte]')).startsWith('Je suis'), 'retour au français');
  await page.evaluate(() => { location.hash = '#entretien/vue=claude'; });
  await page.waitForSelector('#cl-histoires');
  await page.check('#cl-histoires');
  verifier((await page.inputValue('#cl-texte')).includes('Je suis en césure'), 'histoires dans les consignes Claude');
  await page.selectOption('#cl-langue', 'en');
  verifier((await page.inputValue('#cl-texte')).includes('I am a student'), 'histoire anglaise dans les consignes en anglais');

  // --- Journal : entretien à venir, puis questions vers les révisions ---
  await naviguer('journal', 'Journal d’entretiens');
  const demain = await page.evaluate(() => Prepa.outils.ajouterJours(Prepa.app.aujourdhui(), 3));
  await page.fill('#j-entreprise', 'Fonds Exemple');
  await page.fill('#j-date', demain);
  await page.fill('#j-questions', 'Espérance du max de deux dés ?\nPourquoi la cointégration ?');
  await page.click('[data-form] button[type="submit"]');
  await page.waitForSelector('text=Prochain : Fonds Exemple');
  await page.click('[data-reviser]');
  await page.waitForSelector('text=Mes questions (2)');
  await page.locator('details:has(textarea[data-perso]) > summary').first().click();
  await page.fill('textarea[data-perso]', 'Ma réponse : 161/36.');
  await capture('08-journal');
  verifier((await page.textContent('#entete-infos')).includes('J−3'), 'compte à rebours dans l’en-tête');
  await page.click('a[href^="#journal/fiche="]');
  await page.waitForSelector('article.fiche-prep h1');
  verifier((await page.textContent('article.fiche-prep h1')) === 'Fonds Exemple', 'fiche de préparation');
  verifier((await page.$$('article.fiche-prep ol li')).length >= 15, 'questions à revoir dans la fiche');
  await capture('08b-fiche-preparation');

  // --- Guides, progrès, réglages ---
  await naviguer('guides', 'Guides');
  const guides = await page.$$eval('main a.carte', (l) => l.map((a) => a.getAttribute('href')));
  verifier(guides.length >= 7, 'guides : ' + guides.length);
  for (const g of guides) {
    await page.evaluate((h) => { location.hash = h; }, g);
    await page.waitForSelector('article.guide h1');
  }
  await page.evaluate(() => { location.hash = '#guides/g=antiseche'; });
  await page.waitForSelector('article.guide h1');
  await capture('09-antiseche');
  await naviguer('progres', 'Progrès');
  await capture('10-progres');
  await naviguer('reglages', 'Réglages');
  await page.selectOption('#r-theme', 'dark');
  verifier((await page.getAttribute('html', 'data-theme')) === 'dark', 'thème sombre');
  await naviguer('accueil', 'Aujourd’hui');
  await capture('11-accueil-sombre');
  await page.evaluate(() => { location.hash = '#reglages'; });
  await page.waitForSelector('#r-theme');
  await page.selectOption('#r-theme', 'auto');

  // export puis réimport de la sauvegarde
  const [telechargement] = await Promise.all([page.waitForEvent('download'), page.click('[data-exporter]')]);
  const fichier = await telechargement.path();
  const sauvegarde = JSON.parse(fs.readFileSync(fichier, 'utf8'));
  verifier(sauvegarde.version === 1 && sauvegarde.perso.length === 2 && sauvegarde.journal.length === 1, 'contenu de la sauvegarde');
  await page.evaluate(() => { localStorage.clear(); });
  await page.setInputFiles('[data-importer]', fichier);
  await page.waitForTimeout(300);
  const restaure = await page.evaluate(() => JSON.parse(localStorage.getItem('prepa-entretiens-v1')));
  verifier(restaure.journal.length === 1 && Object.keys(restaure.cartes).length >= 4, 'import de la sauvegarde');

  // import d'une sauvegarde copiée (texte)
  await page.evaluate(() => { location.hash = '#reglages'; });
  await page.waitForSelector('[data-importer-texte]', { state: 'attached' });
  await page.click('text=Importer un texte copié');
  await page.fill('#r-import', JSON.stringify(sauvegarde));
  await page.click('[data-importer-texte]');
  await page.waitForTimeout(200);
  const restaure2 = await page.evaluate(() => JSON.parse(localStorage.getItem('prepa-entretiens-v1')));
  verifier(restaure2.journal.length === 1, 'import par texte collé');
  // réinitialisation confirmée dans la page
  await page.click('[data-reinit]');
  await page.click('.voile button.principal');
  await page.waitForTimeout(200);
  const vide = await page.evaluate(() => JSON.parse(localStorage.getItem('prepa-entretiens-v1')));
  verifier(vide.journal.length === 0, 'réinitialisation');

  // --- Version publiée sur claude.ai (artefact.html) : export par copie, pas d'impression ---
  const c4 = await navigateur.newContext();
  const p4 = await c4.newPage();
  p4.on('pageerror', (e) => erreurs.push('artefact pageerror: ' + e.message));
  p4.on('dialog', (d) => { erreurs.push('artefact : boîte de dialogue native'); d.dismiss(); });
  await p4.goto('file://' + path.join(RACINE, 'artefact.html') + '#reglages');
  await p4.waitForSelector('[data-exporter]');
  await p4.click('[data-exporter]');
  await p4.waitForSelector('.voile [data-texte-a-copier]');
  const exporte = JSON.parse(await p4.inputValue('.voile [data-texte-a-copier]'));
  verifier(exporte.version === 1, 'export par copie dans la page publiée');
  await p4.keyboard.press('Escape');
  await p4.evaluate(() => { location.hash = '#histoires'; });
  await p4.waitForSelector('[data-imprimer]', { state: 'attached' });
  verifier(await p4.$eval('[data-imprimer]', (b) => b.hidden), 'pas de bouton Imprimer dans la page publiée');
  await c4.close();

  // --- Téléphone : pas de défilement horizontal sur chaque écran ---
  const mobile = await navigateur.newContext({ viewport: { width: 375, height: 740 }, deviceScaleFactor: 1 });
  const p2 = await mobile.newPage();
  p2.on('pageerror', (e) => erreurs.push('mobile pageerror: ' + e.message));
  for (const v of ['accueil', 'revisions', 'calcul', 'entretien', 'marche', 'marche/onglet=kelly', 'test', 'plus', 'histoires', 'journal', 'guides', 'guides/g=antiseche', 'progres', 'reglages', 'revisions/onglet=banque', 'casse-tetes', 'casse-tetes/f=ct-p-racines-reelles']) {
    await p2.goto(URL + '#' + v);
    await p2.waitForSelector('main h1');
    const deborde = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    verifier(deborde <= 1, 'défilement horizontal sur mobile (' + v + ') : ' + deborde + ' px');
  }
  // barre du bas : cinq sections + « Plus », sans débordement
  await p2.goto(URL + '#accueil');
  const visibles = await p2.$$eval('#navigation a', (l) => l.filter((a) => a.offsetParent !== null).map((a) => a.textContent.trim()));
  verifier(visibles.length === 6 && visibles[5].includes('Plus'), 'navigation mobile : ' + visibles.join(', '));
  const navDeborde = await p2.$eval('#navigation', (n) => n.scrollWidth - n.clientWidth);
  verifier(navDeborde <= 1, 'la barre du bas déborde de ' + navDeborde + ' px');
  await p2.click('#navigation a.plus-mobile');
  await p2.waitForSelector('a.bouton-section[href="#journal"]');
  if (CAPTURES) {
    await p2.screenshot({ path: path.join(CAPTURES, '13-mobile-plus.png') });
    await p2.goto(URL + '#revisions');
    await p2.screenshot({ path: path.join(CAPTURES, '12-mobile-revision.png') });
  }

  // --- Servie en http : service worker, puis usage hors ligne ---
  const http = require('node:http');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
  const serveur = http.createServer((req, res) => {
    const chemin = path.join(RACINE, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
    if (!chemin.startsWith(RACINE) || !fs.existsSync(chemin) || fs.statSync(chemin).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(chemin)] || 'application/octet-stream' });
    fs.createReadStream(chemin).pipe(res);
  });
  await new Promise((ok) => serveur.listen(0, '127.0.0.1', ok));
  const base = 'http://127.0.0.1:' + serveur.address().port + '/';
  const c3 = await navigateur.newContext();
  const p3 = await c3.newPage();
  p3.on('pageerror', (e) => erreurs.push('http pageerror: ' + e.message));
  await p3.goto(base + 'index.html');
  await p3.evaluate(() => navigator.serviceWorker.ready);
  await p3.reload();
  await p3.waitForFunction(() => !!navigator.serviceWorker.controller);
  await c3.setOffline(true);
  await p3.reload();
  await p3.waitForSelector('main h1');
  verifier((await p3.textContent('main h1')).trim() === 'Aujourd’hui', 'application hors ligne via le service worker');
  await p3.evaluate(() => { location.hash = '#revisions'; });
  await p3.waitForSelector('.carte-question');
  serveur.close();

  await navigateur.close();
  verifier(!erreurs.length, 'erreurs JavaScript :\n' + erreurs.join('\n'));
  console.log('OK : parcours complet sans erreur');
})().catch((e) => { console.error('ÉCHEC : ' + e.message); process.exit(1); });
