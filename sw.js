// Fichier généré par construire.py : ne pas modifier à la main.
// Usage hors ligne quand l'application est servie en http(s) (GitHub Pages) ; inactif en ouverture locale (file://).
// Stratégie « réseau d'abord » : en ligne on reçoit toujours la dernière version, hors ligne on lit le cache.
const VERSION = 'prepa-36cb448abb59';
const FICHIERS = [
  './index.html',
  './manifest.webmanifest',
  './app/app.js',
  './app/banque.js',
  './app/calcul.js',
  './app/cours.js',
  './app/icone-192.png',
  './app/icone-512.png',
  './app/icone-masquable-512.png',
  './app/kelly.js',
  './app/marche.js',
  './app/outils.js',
  './app/srs.js',
  './app/style.css',
  './app/vendor/katex/fonts/KaTeX_AMS-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2',
  './app/vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2',
  './app/vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Main-Bold.woff2',
  './app/vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2',
  './app/vendor/katex/fonts/KaTeX_Main-Italic.woff2',
  './app/vendor/katex/fonts/KaTeX_Main-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2',
  './app/vendor/katex/fonts/KaTeX_Math-Italic.woff2',
  './app/vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2',
  './app/vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2',
  './app/vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Script-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Size1-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Size2-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Size3-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Size4-Regular.woff2',
  './app/vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2',
  './app/vendor/katex/katex.min.css',
  './app/vendor/katex/katex.min.js',
  './app/vues/accueil.js',
  './app/vues/calcul.js',
  './app/vues/cours.js',
  './app/vues/entretien.js',
  './app/vues/guides.js',
  './app/vues/histoires.js',
  './app/vues/journal.js',
  './app/vues/marche.js',
  './app/vues/progres.js',
  './app/vues/reglages.js',
  './app/vues/revisions.js',
  './app/vues/test.js',
  './app/widgets.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (rep) {
    if (rep.ok) { const copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(req, copie); }); }
    return rep;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('./index.html'); });
  }));
});
