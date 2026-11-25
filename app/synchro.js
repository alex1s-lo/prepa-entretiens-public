// Synchronisation entre appareils (téléphone et ordinateur) par un dépôt GitHub privé.
//
// Principe : la progression est chiffrée sur l'appareil (AES-GCM, clé tirée d'une phrase de passe par PBKDF2), puis
// déposée dans un fichier d'un dépôt privé de l'utilisateur via l'API GitHub. Chaque appareil lit ce fichier, le fusionne
// avec sa progression locale élément par élément (la modification la plus récente l'emporte), puis le réécrit. GitHub
// ne voit que des données chiffrées ; la phrase de passe et le jeton restent dans le navigateur, hors de la progression.
//
// Fusion :
// - éléments identifiés (cartes de révision, QCM, histoires, notes, cours, entretiens du journal, questions perso, réglages) :
//   chaque modification est horodatée à l'enregistrement (horodater) ; la plus récente gagne, une suppression aussi ;
// - historiques (sessions de calcul, entretiens blancs, parties…) : réunion sans doublon ;
// - activité par jour : maximum de chaque compteur (jamais de double comptage).
(function (racine) {
  'use strict';

  const OBJETS = ['cartes', 'histoires', 'notes', 'qcm', 'jeu.quetes', 'jeu.boss', 'jeu.succes', 'jeu.bonus', 'jeu.coffres', 'jeu.desk', 'jeu.niveaux', 'jeu.elo', 'jeu.usine', 'cours.exercices', 'cours.lus', 'cours.demos'];
  const LISTES_ID = ['journal', 'perso'];
  const HISTORIQUES = ['calcul', 'marche', 'entretiens', 'tests', 'kelly'];

  function lireChemin(etat, chemin) {
    return chemin.split('.').reduce(function (o, k) { return o && typeof o === 'object' ? o[k] : undefined; }, etat);
  }

  // Empreinte des éléments identifiés : clé « collection:id » → JSON de la valeur.
  function entrees(etat) {
    const m = {};
    OBJETS.forEach(function (c) {
      const o = lireChemin(etat, c) || {};
      Object.keys(o).forEach(function (id) { m[c + ':' + id] = JSON.stringify(o[id]); });
    });
    LISTES_ID.forEach(function (c) {
      (etat[c] || []).forEach(function (x) { if (x && x.id != null) m[c + ':' + x.id] = JSON.stringify(x); });
    });
    m.reglages = JSON.stringify(etat.reglages || {});
    return m;
  }

  // Horodate (date en millisecondes) chaque élément ajouté, modifié ou supprimé depuis l'empreinte « avant ».
  function horodater(etat, avant, maintenant) {
    const apres = entrees(etat);
    const h = etat.horodatage && typeof etat.horodatage === 'object' ? etat.horodatage : {};
    const cles = {};
    Object.keys(avant || {}).forEach(function (k) { cles[k] = 1; });
    Object.keys(apres).forEach(function (k) { cles[k] = 1; });
    Object.keys(cles).forEach(function (k) {
      if ((avant || {})[k] !== apres[k]) h[k] = maintenant;
    });
    etat.horodatage = h;
    return apres;
  }

  function separer(cle) {
    const i = cle.indexOf(':');
    return i < 0 ? [cle, null] : [cle.slice(0, i), cle.slice(i + 1)];
  }

  function ecrire(r, cle, json) {
    const c = separer(cle);
    if (c[0] === 'reglages') {
      if (json != null) r.reglages = JSON.parse(json);
      return;
    }
    if (OBJETS.indexOf(c[0]) >= 0) {
      const parts = c[0].split('.');
      let o = r;
      parts.forEach(function (p) { if (!o[p] || typeof o[p] !== 'object') o[p] = {}; o = o[p]; });
      if (json == null) delete o[c[1]]; else o[c[1]] = JSON.parse(json);
      return;
    }
    if (LISTES_ID.indexOf(c[0]) >= 0) {
      const liste = Array.isArray(r[c[0]]) ? r[c[0]] : (r[c[0]] = []);
      const i = liste.findIndex(function (x) { return x && String(x.id) === c[1]; });
      if (json == null) { if (i >= 0) liste.splice(i, 1); return; }
      if (i >= 0) liste[i] = JSON.parse(json); else liste.push(JSON.parse(json));
    }
  }

  // Départage sans horodatage (première synchronisation de données anciennes).
  function departager(cle, ja, jb) {
    if (ja == null) return 'b';
    if (jb == null) return 'a';
    if (separer(cle)[0] === 'cartes') {
      const a = JSON.parse(ja), b = JSON.parse(jb);
      if ((a.derniere || '') !== (b.derniere || '')) return (a.derniere || '') > (b.derniere || '') ? 'a' : 'b';
      return (b.vu || 0) > (a.vu || 0) ? 'b' : 'a';
    }
    return jb.length > ja.length ? 'b' : 'a';
  }

  // Fusionne deux progressions ; « a » est la progression locale (elle garde ses autres champs).
  function fusionnerEtats(a, b) {
    const r = JSON.parse(JSON.stringify(a || {}));
    b = b || {};
    const ea = entrees(a || {}), eb = entrees(b);
    const ha = (a && a.horodatage) || {}, hb = b.horodatage || {};
    const cles = {};
    [ea, eb, ha, hb].forEach(function (m) { Object.keys(m).forEach(function (k) { cles[k] = 1; }); });
    r.horodatage = {};
    Object.keys(cles).forEach(function (k) {
      const ta = ha[k] || 0, tb = hb[k] || 0;
      const choix = ta > tb ? 'a' : tb > ta ? 'b' : departager(k, ea[k], eb[k]);
      const t = Math.max(ta, tb);
      if (t) r.horodatage[k] = t;
      ecrire(r, k, choix === 'a' ? ea[k] : eb[k]);
    });
    // historiques : réunion sans doublon, dans l'ordre chronologique
    HISTORIQUES.forEach(function (c) {
      const vus = {};
      const tout = [];
      (Array.isArray(r[c]) ? r[c] : []).concat(Array.isArray(b[c]) ? b[c] : []).forEach(function (x) {
        const s = JSON.stringify(x);
        if (!vus[s]) { vus[s] = 1; tout.push(x); }
      });
      tout.sort(function (x, y) { return String((x && x.date) || '') < String((y && y.date) || '') ? -1 : String((x && x.date) || '') > String((y && y.date) || '') ? 1 : 0; });
      r[c] = tout;
    });
    // activité par jour : maximum de chaque compteur
    r.jours = r.jours && typeof r.jours === 'object' ? r.jours : {};
    Object.keys(b.jours || {}).forEach(function (j) {
      const d = r.jours[j] || (r.jours[j] = {});
      Object.keys(b.jours[j] || {}).forEach(function (k) { d[k] = Math.max(d[k] || 0, b.jours[j][k] || 0); });
    });
    return r;
  }

  // --- Chiffrement (WebCrypto) --------------------------------------------------------------------------------------
  function sousCrypto() {
    const c = racine.crypto || (typeof globalThis !== 'undefined' && globalThis.crypto);
    if (!c || !c.subtle) throw new Error('Ce navigateur ne permet pas le chiffrement nécessaire à la synchronisation.');
    return c;
  }
  function versBase64(octets) {
    let s = '';
    for (let i = 0; i < octets.length; i += 0x8000) s += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000));
    return racine.btoa ? racine.btoa(s) : Buffer.from(s, 'binary').toString('base64');
  }
  function depuisBase64(texte) {
    const s = racine.atob ? racine.atob(texte) : Buffer.from(texte, 'base64').toString('binary');
    const o = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) o[i] = s.charCodeAt(i);
    return o;
  }
  function texteVersBase64(t) { return versBase64(new TextEncoder().encode(t)); }
  function base64VersTexte(b) { return new TextDecoder().decode(depuisBase64(b.replace(/\s+/g, ''))); }

  function deriverCle(phrase, sel) {
    const c = sousCrypto();
    return c.subtle.importKey('raw', new TextEncoder().encode(phrase), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return c.subtle.deriveKey({ name: 'PBKDF2', salt: sel, iterations: 210000, hash: 'SHA-256' }, base,
        { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  function chiffrer(objet, phrase) {
    const c = sousCrypto();
    const sel = c.getRandomValues(new Uint8Array(16));
    const iv = c.getRandomValues(new Uint8Array(12));
    return deriverCle(phrase, sel).then(function (cle) {
      return c.subtle.encrypt({ name: 'AES-GCM', iv: iv }, cle, new TextEncoder().encode(JSON.stringify(objet)));
    }).then(function (chiffre) {
      return JSON.stringify({ format: 'prepa-entretiens-synchro', version: 1, sel: versBase64(sel), iv: versBase64(iv),
        donnees: versBase64(new Uint8Array(chiffre)) });
    });
  }
  function dechiffrer(texte, phrase) {
    let enveloppe;
    try { enveloppe = JSON.parse(texte); } catch (e) { enveloppe = null; }
    if (!enveloppe || enveloppe.format !== 'prepa-entretiens-synchro') {
      return Promise.reject(new Error('Le fichier du dépôt n’est pas une sauvegarde chiffrée de Prépa entretiens.'));
    }
    const c = sousCrypto();
    return deriverCle(phrase, depuisBase64(enveloppe.sel)).then(function (cle) {
      return c.subtle.decrypt({ name: 'AES-GCM', iv: depuisBase64(enveloppe.iv) }, cle, depuisBase64(enveloppe.donnees));
    }).then(function (clair) {
      return JSON.parse(new TextDecoder().decode(clair));
    }, function () {
      throw new Error('Phrase de passe incorrecte : elle doit être identique sur tous tes appareils.');
    });
  }

  // --- Dépôt GitHub (API « contents ») ------------------------------------------------------------------------------
  const API = 'https://api.github.com';
  const FICHIER = 'progression-prepa-entretiens.json';

  function normaliserDepot(texte) {
    const t = String(texte || '').trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/+$/, '');
    return /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(t) ? t : null;
  }

  function requete(config, methode, corps) {
    const url = API + '/repos/' + config.depot + '/contents/' + FICHIER;
    return racine.fetch(url, {
      method: methode,
      cache: 'no-store',
      headers: {
        Authorization: 'Bearer ' + config.jeton,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: corps ? JSON.stringify(corps) : undefined
    }).catch(function () {
      throw new Error('Pas de connexion à GitHub (hors ligne ?). La synchronisation reprendra plus tard.');
    });
  }
  function erreurHttp(rep, ecriture) {
    if (rep.status === 401) return new Error('Jeton refusé par GitHub (expiré ou mal copié).');
    if (rep.status === 403) return new Error('Le jeton n’a pas le droit d’' + (ecriture ? 'écrire' : 'accéder') + ' à ce dépôt (permission « Contents : Read and write » nécessaire).');
    if (rep.status === 404) return new Error('Dépôt introuvable, ou jeton sans accès à ce dépôt. Vérifie « compte/nom-du-dépôt ».');
    return new Error('Réponse inattendue de GitHub (' + rep.status + ').');
  }

  // Lit le fichier distant : { etat, sha } ou { etat: null, sha: null } s'il n'existe pas encore.
  function lireDistant(config) {
    return requete(config, 'GET').then(function (rep) {
      if (rep.status === 404) {
        // fichier absent… ou dépôt inaccessible : on vérifie le dépôt pour donner le bon message
        return racine.fetch(API + '/repos/' + config.depot, {
          cache: 'no-store', headers: { Authorization: 'Bearer ' + config.jeton, Accept: 'application/vnd.github+json' }
        }).then(function (r2) {
          if (!r2.ok) throw erreurHttp(r2, false);
          return { etat: null, sha: null };
        });
      }
      if (!rep.ok) throw erreurHttp(rep, false);
      return rep.json().then(function (j) {
        return dechiffrer(base64VersTexte(j.content || ''), config.phrase).then(function (etat) { return { etat: etat, sha: j.sha }; });
      });
    });
  }
  function ecrireDistant(config, etat, sha) {
    return chiffrer(etat, config.phrase).then(function (texte) {
      const corps = { message: 'Synchronisation de la progression', content: texteVersBase64(texte) };
      if (sha) corps.sha = sha;
      return requete(config, 'PUT', corps);
    }).then(function (rep) {
      if (rep.status === 409 || rep.status === 422) return { conflit: true };
      if (!rep.ok) throw erreurHttp(rep, true);
      return { conflit: false };
    });
  }

  // Contenu comparable de deux progressions (sans l'horodatage, avec un ordre de clés stable).
  function empreinteSans(etat) {
    const copie = {};
    Object.keys(etat || {}).sort().forEach(function (k) { if (k !== 'horodatage') copie[k] = etat[k]; });
    const e = entrees(etat || {});
    copie.horodatage = null;
    return JSON.stringify(Object.keys(e).sort().map(function (k) { return [k, e[k]]; })) + JSON.stringify(
      ['calcul', 'marche', 'entretiens', 'tests', 'kelly', 'jours'].map(function (k) { return copie[k] || null; }));
  }

  // Un cycle complet. lireLocal() rend l'état local courant ; appliquer(fusion) l'installe.
  // Rend { recu: bool (le distant apportait du nouveau), envoye: bool }.
  function synchroniser(config, lireLocal, appliquer, essai) {
    return lireDistant(config).then(function (d) {
      const local = lireLocal();
      const fusion = d.etat ? fusionnerEtats(local, d.etat) : JSON.parse(JSON.stringify(local));
      const recu = !!d.etat && empreinteSans(fusion) !== empreinteSans(local);
      if (recu) appliquer(fusion);
      const aEnvoyer = !d.etat || empreinteSans(fusion) !== empreinteSans(d.etat) ||
        JSON.stringify(fusion.horodatage || {}) !== JSON.stringify(d.etat.horodatage || {});
      if (!aEnvoyer) return { recu: recu, envoye: false };
      return ecrireDistant(config, fusion, d.sha).then(function (res) {
        if (res.conflit) {
          if ((essai || 0) >= 2) throw new Error('Un autre appareil écrit en même temps : réessaie dans un instant.');
          return synchroniser(config, lireLocal, appliquer, (essai || 0) + 1);
        }
        return { recu: recu, envoye: true };
      });
    });
  }

  // Code de liaison : la configuration à recopier sur l'autre appareil (à ne communiquer à personne).
  function codeLiaison(config) {
    return 'PREPA1:' + texteVersBase64(JSON.stringify({ d: config.depot, j: config.jeton, p: config.phrase }));
  }
  function lireCodeLiaison(code) {
    const t = String(code || '').trim();
    if (t.indexOf('PREPA1:') !== 0) throw new Error('Ce n’est pas un code de liaison de Prépa entretiens.');
    const o = JSON.parse(base64VersTexte(t.slice(7)));
    return { depot: o.d, jeton: o.j, phrase: o.p };
  }

  const synchro = {
    entrees: entrees, horodater: horodater, fusionnerEtats: fusionnerEtats, chiffrer: chiffrer, dechiffrer: dechiffrer,
    normaliserDepot: normaliserDepot, synchroniser: synchroniser, codeLiaison: codeLiaison, lireCodeLiaison: lireCodeLiaison,
    FICHIER: FICHIER
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = synchro;
  else (racine.Prepa = racine.Prepa || {}).synchro = synchro;
})(typeof window !== 'undefined' ? window : globalThis);
