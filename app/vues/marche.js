// Jeu de market making : « fais-moi un marché sur la somme de quatre dés ».
(function (racine) {
  'use strict';
  const P = racine.Prepa;
  const o = P.outils;
  const A = P.app;
  const M = P.marche;

  let partie = null;
  let dernierTour = null;

  function onglets(actif) {
    return '<div class="onglets" role="tablist">' + [['marche', 'Market making'], ['kelly', 'Paris répétés (Kelly)']].map(function (x) {
      return '<a role="tab" class="bouton-onglet" aria-selected="' + (x[0] === actif) + '" href="#marche' + (x[0] === 'kelly' ? '/onglet=kelly' : '') + '">' + x[1] + '</a>';
    }).join('') + '</div>';
  }

  function rendre(main, params) {
    if (params && params.onglet === 'kelly') { rendreKelly(main); return; }
    if (partie && !partie.fini) { rendreJeu(main); return; }
    partie = null;
    dernierTour = null;
    main.innerHTML = '<h1>Market making</h1>' + onglets('marche') +
      '<div class="carte"><p>Un exercice fréquent chez les teneurs de marché : « <i>Make me a market on the sum of four dice.</i> » ' +
      'Tu donnes un prix d’achat (bid) et un prix de vente (ask). L’intervieweur achète ou vend, puis révèle une information. ' +
      'Ce qu’on regarde : ton espérance est-elle juste, ton écart reflète-t-il l’incertitude, et apprends-tu des ordres que tu reçois ?</p>' +
      '<details><summary>Comment bien jouer</summary>' + o.markdown([
        '- **Centre** ta cotation sur l’espérance : un dé vaut 3,5 en moyenne, donc quatre dés valent 14 avant toute information.',
        '- **Écarte** quand l’incertitude est grande (écart-type d’un dé : $\\sqrt{35/12} \\approx 1{,}71$ ; de $n$ dés : $1{,}71\\sqrt{n}$), resserre quand elle baisse.',
        '- **Écoute les ordres** : une contrepartie informée achète quand ton ask est trop bas. Un achat est un indice que la valeur est plus haute.',
        '- **Gère ton inventaire** : si tu es déjà très vendeur, remonte un peu tes prix pour être plutôt acheteur au tour suivant.',
        '- **Cartes** : le tirage est sans remise. Après avoir vu un roi, l’espérance d’une carte suivante baisse un peu (somme du paquet 364 ; moyenne 7).'
      ].join('\n')) + '</details></div>' +
      '<form class="carte" data-config><h2 style="margin-top:0">Nouvelle partie</h2><div class="grille" style="margin:0">' +
      '<div><label for="mm-jeu">Valeur cachée</label><select id="mm-jeu"><option value="des">Somme de dés</option><option value="cartes">Somme de cartes (jeu de 52)</option></select></div>' +
      '<div><label for="mm-n">Nombre de dés ou de cartes</label><select id="mm-n"><option>3</option><option selected>4</option><option>5</option><option>6</option></select></div>' +
      '<div><label for="mm-spread">Écart maximal</label><select id="mm-spread"><option value="1">1 (serré)</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="6">6 (cartes)</option></select></div>' +
      '<div><label for="mm-inf">Contreparties informées</label><select id="mm-inf"><option value="0.2">Peu (20 %)</option><option value="0.35" selected>Moyen (35 %)</option><option value="0.55">Beaucoup (55 %)</option></select></div>' +
      '</div><p class="petit doux">Deux contreparties par tour, une unité chacune. Une contrepartie informée connaît l’élément qui sera révélé au tour suivant. Position limitée à ±6.</p>' +
      '<button class="principal" type="submit">Jouer</button></form>' + historique();
    const f = main.querySelector('[data-config]');
    f.querySelector('#mm-jeu').addEventListener('change', function (e) {
      f.querySelector('#mm-spread').value = e.target.value === 'cartes' ? '6' : '2';
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      partie = M.nouvellePartie({
        jeu: f.querySelector('#mm-jeu').value, n: Number(f.querySelector('#mm-n').value),
        spreadMax: Number(f.querySelector('#mm-spread').value), informes: Number(f.querySelector('#mm-inf').value)
      });
      dernierTour = null;
      rendreJeu(main);
    });
  }

  function historique() {
    const l = A.etat.marche.slice(-10).reverse();
    if (!l.length) return '';
    const total = A.etat.marche.reduce(function (s, x) { return s + x.pnl; }, 0);
    return '<div class="carte"><h2 style="margin-top:0">Tes parties</h2><p class="legende">PnL cumulé sur ' + A.etat.marche.length + ' parties : <b>' +
      o.formaterNombre(total, 4) + '</b></p><div class="tableau"><table><thead><tr><th>Date</th><th>Jeu</th><th>PnL</th><th>Avantage à la valeur juste</th><th>Écart moyen du milieu</th></tr></thead><tbody>' +
      l.map(function (x) {
        return '<tr><td>' + o.dateLisible(x.date) + '</td><td>' + (x.jeu === 'cartes' ? 'Cartes' : 'Dés') + ' × ' + x.n + '</td><td>' + o.formaterNombre(x.pnl, 4) +
          '</td><td>' + o.formaterNombre(x.avantage, 3) + '</td><td>' + o.formaterNombre(x.ecartMilieu, 3) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function element(v, cache) {
    return '<span class="de' + (cache ? ' cache' : '') + '" aria-label="' + (cache ? 'caché' : String(v)) + '">' + (cache ? '?' : v) + '</span>';
  }

  function rendreJeu(main) {
    const c = partie.config;
    const vus = M.revelees(partie);
    let elements = '';
    for (let i = 0; i < c.n; i++) elements += element(partie.tirage[i], i >= partie.revele);
    let html = '<h1>Market making</h1><div class="carte"><div class="ligne"><span class="etiquette accent">' +
      (c.jeu === 'cartes' ? 'Somme de ' + c.n + ' cartes' : 'Somme de ' + c.n + ' dés') + '</span><span class="etiquette">écart max ' + c.spreadMax + '</span>' +
      '<span class="espace"></span><span class="petit">Position : <b>' + partie.position + '</b> · Cash : <b>' + o.formaterNombre(partie.cash, 5) + '</b></span></div>' +
      '<div class="des">' + elements + '</div>' +
      '<p class="petit doux">' + (vus.length ? 'Révélé : ' + vus.join(' + ') + ' = ' + vus.reduce(function (s, x) { return s + x; }, 0) + '. ' : 'Rien n’est encore révélé. ') +
      'Tour ' + (partie.tours.length + 1) + ' sur ' + c.n + '.</p>';
    if (dernierTour) html += resumeTour(dernierTour);
    html += '<form data-coter autocomplete="off"><div class="cotation"><div><label for="mm-bid">Bid (j’achète à)</label><input id="mm-bid" inputmode="decimal"></div>' +
      '<div><label for="mm-ask">Ask (je vends à)</label><input id="mm-ask" inputmode="decimal"></div></div>' +
      '<p class="petit" data-erreur style="color:var(--erreur)"></p>' +
      '<div class="ligne"><button class="principal" type="submit">Coter</button><button type="button" class="discret" data-aide>Afficher l’espérance</button>' +
      '<span class="petit doux" data-aide-texte></span><span class="espace"></span><button type="button" class="discret" data-abandon>Abandonner</button></div></form></div>';
    main.innerHTML = html;
    const f = main.querySelector('[data-coter]');
    const bid = f.querySelector('#mm-bid'), ask = f.querySelector('#mm-ask');
    if (dernierTour) { bid.value = String(dernierTour.bid).replace('.', ','); ask.value = String(dernierTour.ask).replace('.', ','); }
    setTimeout(function () { bid.focus(); bid.select(); }, 0);
    f.querySelector('[data-aide]').addEventListener('click', function () {
      const l = M.loi(partie, partie.revele);
      f.querySelector('[data-aide-texte]').textContent = 'Espérance ' + o.formaterNombre(l.esperance, 4) + ' ; écart-type ' + o.formaterNombre(l.ecartType, 3) + '.';
    });
    f.querySelector('[data-abandon]').addEventListener('click', function () { partie = null; A.afficher(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      const b = o.lireNombre(bid.value), a = o.lireNombre(ask.value);
      const err = M.verifierCotation(partie, b, a);
      if (err) { f.querySelector('[data-erreur]').textContent = err; return; }
      dernierTour = M.coter(partie, b, a);
      if (partie.fini) finir(main);
      else rendreJeu(main);
    });
  }

  function resumeTour(t) {
    const lignes = t.echanges.map(function (e) {
      const qui = e.contrepartie === 'informée' ? '<b>informée</b>' : 'au hasard';
      if (e.sens === 'passe') return '<li>Une contrepartie (' + qui + ') ne traite pas.</li>';
      return '<li>Une contrepartie (' + qui + ') ' + (e.sens === 'achete' ? 't’achète' : 'te vend') + ' à ' + o.formaterNombre(e.prix, 5) +
        ' <span class="petit doux">(avantage à la valeur juste : ' + (e.avantage >= 0 ? '+' : '') + o.formaterNombre(e.avantage, 3) + ')</span></li>';
    }).join('');
    return '<div class="encadre info"><div class="bloc-titre">Tour ' + t.numero + ' : tu cotais ' + o.formaterNombre(t.bid, 5) + ' / ' + o.formaterNombre(t.ask, 5) +
      '</div><ul>' + lignes + '</ul>' + M.commentaire(t, partie ? partie.config.spreadMax : 2).map(function (m) { return '<p class="petit">' + o.echapper(m) + '</p>'; }).join('') + '</div>';
  }

  function finir(main) {
    const b = M.bilan(partie);
    A.etat.marche.push({ date: A.aujourdhui(), jeu: partie.config.jeu, n: partie.config.n, pnl: b.pnl, avantage: b.avantageAttendu, ecartMilieu: b.ecartMoyenMilieu, echanges: b.echanges });
    if (A.etat.marche.length > 300) A.etat.marche.splice(0, A.etat.marche.length - 300);
    A.noterActivite('marche');
    A.sauver();
    let elements = '';
    partie.tirage.forEach(function (v) { elements += element(v, false); });
    const conseils = [];
    if (b.ecartMoyenMilieu > 0.75) conseils.push('Ton milieu s’éloignait en moyenne de ' + o.formaterNombre(b.ecartMoyenMilieu, 3) + ' de l’espérance : recalcule-la à chaque tour (somme révélée + éléments restants × moyenne).');
    if (b.parInformes > 0 && b.avantageAttendu < 0) conseils.push('Les contreparties informées t’ont pris de l’argent : après un achat ou une vente informée, décale ta cotation dans le sens de l’ordre.');
    if (Math.abs(b.positionFinale) >= 4) conseils.push('Position finale de ' + b.positionFinale + ' : tu portais beaucoup de risque au moment de la révélation. Décale tes prix pour réduire l’inventaire.');
    if (!conseils.length) conseils.push('Bonne partie : cotation centrée et inventaire maîtrisé. Essaie un écart plus serré ou plus de contreparties informées.');
    main.innerHTML = '<h1>Market making</h1><div class="carte"><h2 style="margin-top:0">Partie terminée</h2><div class="des">' + elements + '</div>' +
      '<p>Valeur finale : <b>' + b.valeur + '</b>. Position soldée : ' + b.positionFinale + ' × ' + b.valeur + '.</p>' +
      (dernierTour ? resumeTour(dernierTour) : '') +
      '<div class="grille"><div><div class="chiffre">' + o.formaterNombre(b.pnl, 4) + '</div><div class="legende">PnL final</div></div>' +
      '<div><div class="chiffre">' + (b.avantageAttendu >= 0 ? '+' : '') + o.formaterNombre(b.avantageAttendu, 3) + '</div><div class="legende">avantage mesuré à la valeur juste au moment de chaque échange</div></div>' +
      '<div><div class="chiffre">' + b.echanges + '</div><div class="legende">échanges, dont ' + b.parInformes + ' avec une contrepartie informée</div></div></div>' +
      '<p class="petit doux">Le PnL mélange ton avantage (ce que tu gagnes en moyenne) et la chance (la valeur finale). L’avantage à la valeur juste est la vraie mesure de ta cotation.</p>' +
      conseils.map(function (m) { return '<div class="encadre alerte">' + o.echapper(m) + '</div>'; }).join('') +
      '<div class="tableau"><table><thead><tr><th>Tour</th><th>Connu</th><th>Espérance</th><th>Bid / ask</th><th>Échanges</th></tr></thead><tbody>' +
      partie.tours.map(function (t) {
        return '<tr><td>' + t.numero + '</td><td>' + (t.connu.join(' + ') || '—') + '</td><td>' + o.formaterNombre(t.juste, 4) + ' ± ' + o.formaterNombre(t.ecartType, 2) +
          '</td><td>' + o.formaterNombre(t.bid, 5) + ' / ' + o.formaterNombre(t.ask, 5) + '</td><td>' + t.echanges.map(function (e) {
            return e.sens === 'passe' ? '·' : (e.sens === 'achete' ? 'achat' : 'vente') + (e.contrepartie === 'informée' ? ' (inf.)' : '');
          }).join(', ') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="ligne"><button class="principal" data-rejouer>Rejouer</button></div></div>';
    const config = partie.config;
    partie = null;
    main.querySelector('[data-rejouer]').addEventListener('click', function () {
      partie = M.nouvellePartie(config);
      dernierTour = null;
      rendreJeu(main);
    });
  }

  // --- Paris répétés : critère de Kelly ---------------------------------------------------------------------------
  const K = P.kelly;
  let pk = null;

  function pourcent(x) { return o.formaterNombre(100 * x, 3) + ' %'; }

  function rendreKelly(main) {
    if (pk && !pk.fini) { rendreKellyJeu(main); return; }
    pk = null;
    main.innerHTML = '<h1>Market making</h1>' + onglets('kelly') +
      '<div class="carte"><p>Question classique chez les teneurs de marché : « Tu as un pari favorable, tu peux le rejouer beaucoup de fois. ' +
      'Combien mises-tu à chaque fois ? » Trop peu, tu gâches ton avantage ; trop, tu finis ruiné même avec un pari gagnant. ' +
      'Joue une série de paris, puis compare ta richesse à celle des stratégies de Kelly <b>sur les mêmes tirages</b>.</p>' +
      '<details><summary>Le critère de Kelly en bref</summary>' + o.markdown([
        '- Miser la fraction **$f^{\\star} = (bp - q)/b$** de sa richesse maximise la croissance à long terme ($p$ : probabilité de gagner, $q = 1 - p$, $b$ : gain par euro misé).',
        '- Pièce à 60 % et cote 1 contre 1 : $f^{\\star} = 0{,}6 - 0{,}4 =$ **20 %**.',
        '- Miser **$2f^{\\star}$** ramène la croissance à environ zéro ; au-delà, la richesse tend vers 0 presque sûrement, malgré une espérance positive.',
        '- En pratique on mise souvent **une demi-fraction de Kelly** : on garde environ 75 % de la croissance avec deux fois moins de volatilité, et on se protège d\u2019une erreur sur $p$.'
      ].join('\n')) + '</details></div>' +
      '<form class="carte" data-kelly><div class="grille" style="margin:0">' +
      '<div><label for="k-p">Probabilité de gagner</label><select id="k-p"><option value="0.55">55 %</option><option value="0.6" selected>60 %</option>' +
      '<option value="0.65">65 %</option><option value="inconnue">Inconnue (entre 50 et 70 %)</option></select></div>' +
      '<div><label for="k-b">Cote</label><select id="k-b"><option value="1">1 contre 1 (tu gagnes ta mise)</option><option value="2">2 contre 1 (tu gagnes 2 × ta mise)</option></select></div>' +
      '<div><label for="k-tours">Nombre de paris</label><select id="k-tours"><option>30</option><option selected>50</option><option>100</option></select></div></div>' +
      '<p class="petit doux">Richesse de départ : 100 €. Si la probabilité est « inconnue », estime-la à partir des résultats au fil des paris.</p>' +
      '<button class="principal" type="submit">Jouer</button></form>' + historiqueKelly();
    const f = main.querySelector('[data-kelly]');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      const choix = f.querySelector('#k-p').value;
      const p = choix === 'inconnue' ? 0.5 + 0.2 * Math.random() : Number(choix);
      pk = K.nouvellePartie({ p: p, b: Number(f.querySelector('#k-b').value), tours: Number(f.querySelector('#k-tours').value) });
      pk.inconnue = choix === 'inconnue';
      rendreKellyJeu(main);
    });
  }

  function historiqueKelly() {
    const l = A.etat.kelly.slice(-8).reverse();
    if (!l.length) return '';
    return '<div class="carte"><h2 style="margin-top:0">Tes parties</h2><div class="tableau"><table><thead><tr><th>Date</th><th>Pari</th><th>Ta richesse finale</th><th>Kelly</th><th>Ta mise moyenne</th></tr></thead><tbody>' +
      l.map(function (x) {
        return '<tr><td>' + o.dateLisible(x.date) + '</td><td>' + pourcent(x.p) + ', ' + x.b + ' contre 1</td><td>' + o.formaterNombre(x.finale, 4) + ' €</td><td>' +
          o.formaterNombre(x.kelly, 4) + ' €</td><td>' + pourcent(x.miseMoyenne) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function rendreKellyJeu(main) {
    const c = pk.config;
    const gains = pk.issues.slice(0, pk.rang).filter(Boolean).length;
    const dernier = pk.rang ? pk.issues[pk.rang - 1] : null;
    main.innerHTML = '<h1>Market making</h1>' + onglets('kelly') + '<div class="carte"><div class="ligne"><span class="etiquette accent">' +
      (pk.inconnue ? 'Probabilité inconnue' : 'Gagne avec ' + pourcent(c.p)) + '</span><span class="etiquette">' + c.b + ' contre 1</span>' +
      '<span class="espace"></span><span class="petit">Pari ' + (pk.rang + 1) + ' sur ' + c.tours + '</span></div>' +
      '<p class="chiffre" style="margin:14px 0 2px">' + o.formaterNombre(pk.richesse, 5) + ' €</p><p class="legende">ta richesse' +
      (pk.rang ? ' · ' + gains + ' gain' + (gains > 1 ? 's' : '') + ' sur ' + pk.rang + ' paris (' + pourcent(gains / pk.rang) + ')' : '') + '</p>' +
      (dernier !== null ? '<div class="encadre ' + (dernier ? 'succes' : 'erreur') + ' petit">Dernier pari ' + (dernier ? 'gagné' : 'perdu') + '.</div>' : '') +
      '<form data-pari autocomplete="off"><label for="k-f">Mise, en % de ta richesse</label><div class="ligne">' +
      '<input id="k-f" inputmode="decimal" style="width:8em" value="' + (pk.fractions.length ? o.formaterNombre(100 * pk.fractions[pk.fractions.length - 1], 4) : '') + '">' +
      [0, 5, 10, 20, 30, 50].map(function (x) { return '<button type="button" class="discret" data-f="' + x + '">' + x + ' %</button>'; }).join('') +
      '</div><p class="petit" data-erreur style="color:var(--erreur)"></p><div class="ligne"><button class="principal" type="submit">Parier</button>' +
      '<span class="espace"></span><button type="button" class="discret" data-fin>Abandonner</button></div></form></div>';
    const champ = main.querySelector('#k-f');
    setTimeout(function () { champ.focus(); champ.select(); }, 0);
    main.querySelectorAll('[data-f]').forEach(function (b) { b.addEventListener('click', function () { champ.value = b.getAttribute('data-f'); champ.focus(); }); });
    main.querySelector('[data-fin]').addEventListener('click', function () { pk = null; A.aller('marche', { onglet: 'kelly' }); });
    main.querySelector('[data-pari]').addEventListener('submit', function (e) {
      e.preventDefault();
      const v = o.lireNombre(champ.value.replace('%', ''));
      if (!isFinite(v) || v < 0 || v > 100) { main.querySelector('[data-erreur]').textContent = 'Entre un pourcentage entre 0 et 100.'; return; }
      K.parier(pk, v / 100);
      if (pk.fini) finirKelly(main); else rendreKellyJeu(main);
    });
  }

  // Graphique de plusieurs chemins de richesse, échelle logarithmique.
  function courbesLog(series) {
    const L = 640, H = 220, m = 36;
    const toutes = [].concat.apply([], series.map(function (s) { return s.valeurs; })).filter(function (v) { return v > 0; });
    const lmin = Math.log10(Math.min.apply(null, toutes.concat([50]))), lmax = Math.log10(Math.max.apply(null, toutes.concat([200])));
    const n = series[0].valeurs.length;
    const x = function (i) { return m + i * (L - m - 8) / Math.max(1, n - 1); };
    const y = function (v) { return H - 24 - (Math.log10(Math.max(v, Math.pow(10, lmin))) - lmin) * (H - 40) / (lmax - lmin || 1); };
    let svg = '<svg class="courbe courbes" viewBox="0 0 ' + L + ' ' + H + '" role="img" aria-label="Richesse au fil des paris">';
    [1, 10, 100, 1000, 10000, 100000].forEach(function (v) {
      const lv = Math.log10(v);
      if (lv < lmin - 1e-9 || lv > lmax + 1e-9) return;
      svg += '<line class="grille-svg" x1="' + m + '" x2="' + (L - 8) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="2" y="' + (y(v) + 4) + '">' + v + '</text>';
    });
    // la première série (le joueur) est tracée en dernier pour rester visible au-dessus des autres
    series.slice().reverse().forEach(function (s, r) {
      const k = series.length - 1 - r;
      svg += '<polyline class="trait serie-' + k + '" points="' + s.valeurs.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ') + '"/>';
    });
    svg += '</svg><div class="ligne petit">' + series.map(function (s, k) {
      return '<span><span class="puce serie-' + k + '"></span> ' + o.echapper(s.nom) + '</span>';
    }).join('') + '</div>';
    return svg;
  }

  function finirKelly(main) {
    const c = pk.config;
    const fk = K.fractionKelly(c.p, c.b);
    const kellyChemin = K.cheminConstant(pk, fk);
    const demi = K.cheminConstant(pk, fk / 2);
    const double = K.cheminConstant(pk, Math.min(0.99, 2 * fk));
    const toi = pk.chemin.concat(Array(Math.max(0, pk.issues.length + 1 - pk.chemin.length)).fill(pk.richesse));
    const miseMoyenne = pk.fractions.length ? pk.fractions.reduce(function (s, x) { return s + x; }, 0) / pk.fractions.length : 0;
    A.etat.kelly.push({ date: A.aujourdhui(), p: c.p, b: c.b, finale: pk.richesse, kelly: kellyChemin[kellyChemin.length - 1], miseMoyenne: miseMoyenne });
    if (A.etat.kelly.length > 200) A.etat.kelly.splice(0, A.etat.kelly.length - 200);
    A.noterActivite('marche');
    A.sauver();
    const g = function (f) { return K.croissance(c.p, c.b, f); };
    let conseil;
    if (fk <= 0) conseil = 'Ce pari n\u2019était pas favorable : la bonne mise était 0.';
    else if (miseMoyenne > 1.6 * fk) conseil = 'Tu as misé nettement plus que Kelly (' + pourcent(fk) + ') : au-delà de 2 × Kelly, la croissance devient négative, même avec un pari gagnant en moyenne.';
    else if (miseMoyenne < 0.4 * fk) conseil = 'Tu as misé bien moins que Kelly (' + pourcent(fk) + ') : peu de risque, mais une croissance faible.';
    else conseil = 'Mise proche de la zone raisonnable (Kelly : ' + pourcent(fk) + ', demi-Kelly : ' + pourcent(fk / 2) + ').';
    main.innerHTML = '<h1>Market making</h1>' + onglets('kelly') + '<div class="carte"><h2 style="margin-top:0">Fin de la série</h2>' +
      (pk.inconnue ? '<p>La probabilité était de <b>' + pourcent(c.p) + '</b>.</p>' : '') +
      '<div class="grille"><div><div class="chiffre">' + o.formaterNombre(pk.richesse, 4) + ' €</div><div class="legende">ta richesse finale (mise moyenne ' + pourcent(miseMoyenne) + ')</div></div>' +
      '<div><div class="chiffre">' + o.formaterNombre(kellyChemin[kellyChemin.length - 1], 4) + ' €</div><div class="legende">Kelly (' + pourcent(fk) + ' à chaque pari), mêmes tirages</div></div>' +
      '<div><div class="chiffre">' + o.formaterNombre(demi[demi.length - 1], 4) + ' €</div><div class="legende">demi-Kelly (' + pourcent(fk / 2) + ')</div></div></div>' +
      courbesLog([{ nom: 'Toi', valeurs: toi }, { nom: 'Kelly', valeurs: kellyChemin }, { nom: 'Demi-Kelly', valeurs: demi }, { nom: 'Double Kelly', valeurs: double }]) +
      '<div class="encadre info">' + o.echapper(conseil) + '</div>' +
      '<p class="petit doux">Croissance espérée par pari (logarithme) : Kelly ' + o.formaterNombre(g(fk), 3) + ' ; demi-Kelly ' + o.formaterNombre(g(fk / 2), 3) +
      ' ; double Kelly ' + o.formaterNombre(g(Math.min(0.99, 2 * fk)), 3) + '. Sur une seule série, la chance compte beaucoup : rejoue plusieurs fois.</p>' +
      '<div class="ligne"><button class="principal" data-rejouer>Rejouer</button></div></div>';
    const config = { p: c.p, b: c.b, tours: c.tours };
    const inconnue = pk.inconnue;
    pk = null;
    main.querySelector('[data-rejouer]').addEventListener('click', function () {
      pk = K.nouvellePartie(inconnue ? Object.assign({}, config, { p: 0.5 + 0.2 * Math.random() }) : config);
      pk.inconnue = inconnue;
      rendreKellyJeu(main);
    });
  }

  A.enregistrerVue({ id: 'marche', titre: 'Market making', court: 'Marché', icone: '⇅', ordre: 6, rendre: rendre });
})(this);
