// Génère index.html et les pages chapitre-*.html à partir de scripts/chapters-data.mjs.
// Usage : node scripts/build-site.mjs
import fs from 'node:fs';
import { chapters, REFS, ACCESSED } from './chapters-data.mjs';
const ORIGIN = 'https://kevingiscard.github.io/cafe-benin-info/';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nav = [['explorer.html','Explorer'],['benin.html','Dossier Bénin'],['observatoire.html','Observatoire'],['outils.html','Outils'],['dictionnaire.html','Dictionnaire'],['sources.html','Sources']];
const head = ({ title, desc, url, image, extra = '' }) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script>!function(){try{var e=localStorage.getItem('cb-theme'),t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=e||t}catch(e){document.documentElement.dataset.theme='light'}}()</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#f5f0e7">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}${image}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ORIGIN}${image}">
<link rel="canonical" href="${url}">
<link rel="manifest" href="site.webmanifest">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="atlas.css?v=1">
${extra}</head>
<body>
<a class="skip-link" href="#accueil">Aller au contenu principal</a>
<div id="progress" aria-hidden="true"></div>
<header id="site-nav" class="nav">
  <div class="container nav-inner">
    <a class="brand" href="index.html" aria-label="Café Bénin, accueil"><span class="brand-mark">C</span><span>Café Bénin</span></a>
    <nav class="nav-links" aria-label="Navigation principale">
${nav.map(([h, l]) => `      <a href="${h}">${l}</a>`).join('\n')}
    </nav>
    <div class="nav-actions">
      <button id="search-open" class="search-trigger" type="button">⌕ Rechercher <span>Ctrl K</span></button>
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Activer le mode sombre" aria-pressed="false"><span aria-hidden="true">◐</span><span class="theme-toggle-label">Thème</span></button>
      <button id="nav-toggle" class="menu-toggle icon-btn" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-nav">☰</button>
    </div>
  </div>
</header>
<nav id="mobile-nav" class="mobile-nav" aria-label="Navigation mobile" aria-hidden="true">
  <a class="mobile-link" href="explorer.html">Explorer les chapitres</a>
  <a class="mobile-link" href="benin.html">Dossier Bénin</a>
  <a class="mobile-link" href="observatoire.html">Observatoire des données</a>
  <a class="mobile-link" href="professionnels.html">Espace professionnel</a>
  <a class="mobile-link" href="outils.html">Outils pratiques</a>
  <a class="mobile-link" href="dictionnaire.html">Dictionnaire</a>
  <a class="mobile-link" href="sources.html">Sources et contribuer</a>
  <a class="mobile-link" href="index.html#cafebot">CaféBot local</a>
  <a class="mobile-link" href="a-propos.html">À propos</a>
</nav>
<div id="search-modal" class="search-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Recherche globale">
  <div class="search-panel">
    <div class="search-head">
      <span id="search-title" aria-hidden="true">⌕</span>
      <input id="global-search" type="search" placeholder="Rechercher un terme, une méthode, un chapitre…" aria-label="Recherche dans Café Bénin" aria-controls="search-results">
      <button id="search-close" class="icon-btn" type="button" aria-label="Fermer la recherche">×</button>
    </div>
    <div id="search-results" class="search-results" aria-live="polite"></div>
  </div>
</div>
`;
const foot = `<footer class="footer">
  <div class="container footer-grid">
    <div><a class="brand" href="index.html"><span class="brand-mark">C</span><span>Café Bénin</span></a><p class="muted">Atlas documentaire francophone du café, de la plante à la tasse.</p></div>
    <div><p><a href="explorer.html">Explorer</a> · <a href="benin.html">Dossier Bénin</a> · <a href="outils.html">Outils</a> · <a href="dictionnaire.html">Dictionnaire</a></p><p><a href="observatoire.html">Observatoire</a> · <a href="professionnels.html">Professionnels</a> · <a href="sources.html">Sources</a></p><p><a href="confidentialite.html">Confidentialité</a> · <a href="mentions-legales.html">Mentions légales</a> · <a href="cgu.html">CGU</a></p></div>
    <p class="muted">© <span id="year"></span> Café Bénin · Projet documentaire porté par Kevin Giscard.</p>
  </div>
</footer>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<script src="dictionary-v4.js" defer></script>
<script src="local-assistant.js" defer></script>
<script src="app.js" defer></script>
</body>
</html>
`;
const picture = (c, cls = '', lazy = true) => `<img class="${cls}" src="img/${c.img}${c.imgPlain ? '' : ''}.webp" ${c.imgPlain ? '' : `srcset="img/${c.img}-700.webp 700w, img/${c.img}.webp 1280w" sizes="(min-width: 900px) 33vw, 50vw"`} width="1280" height="720" alt="${esc(c.alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`;
const imgSrc = c => c.imgPlain ? `img/${c.img}.webp` : `img/${c.img}.webp`;

// ---------- chapitres
function renderChapter(c, i) {
  const order = []; const cite = html => html.replace(/\[\[(\w+)\]\]/g, (_, k) => {
    if (!REFS[k]) throw new Error('Référence inconnue ' + k);
    let n = order.indexOf(k); if (n < 0) { order.push(k); n = order.length - 1; }
    return `<sup class="cite"><a href="#ref-${k}" aria-label="Source ${n + 1}">[${n + 1}]</a></sup>`;
  });
  const points = c.points.map(p => `<li>${cite(p)}</li>`).join('\n');
  const sections = c.sections.map(([t, h], j) => `<details class="acc"${j === 0 ? ' open' : ''}><summary>${t}</summary><div class="acc-body">${cite(h)}</div></details>`).join('\n');
  const terms = (c.terms || []).map(t => `<a class="chip" href="dictionnaire.html?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('');
  const refs = order.map((k, n) => `<li id="ref-${k}"><a href="${REFS[k][1]}" rel="noopener noreferrer" target="_blank">${esc(REFS[k][0])}</a> <span class="muted">· consulté le ${ACCESSED}</span></li>`).join('\n');
  const prev = chapters[(i + chapters.length - 1) % chapters.length], next = chapters[(i + 1) % chapters.length];
  const url = `${ORIGIN}chapitre-${c.slug}.html`;
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: c.title, inLanguage: 'fr-FR', url, image: `${ORIGIN}img/${c.img}.webp`, isPartOf: { '@type': 'WebSite', name: 'Café Bénin', url: ORIGIN } });
  return head({ title: `${c.title} · Café Bénin`, desc: c.lead.slice(0, 155), url, image: `img/${c.img}.webp`, extra: `<script type="application/ld+json">${ld}</script>\n` }) + `
<main id="accueil" class="chapter">
<section class="chapter-hero" id="${c.slug}-intro">
  <img class="chapter-hero-img" src="${imgSrc(c)}" ${c.imgPlain ? '' : `srcset="img/${c.img}-700.webp 700w, img/${c.img}.webp 1280w" sizes="100vw"`} alt="${esc(c.alt)}" fetchpriority="high">
  <div class="container chapter-hero-text">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <a href="explorer.html">Explorer</a> › <span>${esc(c.tag)}</span></nav>
    <span class="eyebrow">Chapitre ${c.n} · ${esc(c.tag)}</span>
    <h1>${esc(c.title)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
<div class="container chapter-body">
  <section class="essential" id="${c.slug}-essentiel" aria-labelledby="${c.slug}-ess-t"><h2 id="${c.slug}-ess-t">L’essentiel en trois points</h2><ul>${points}</ul></section>
  <section id="${c.slug}-details" aria-labelledby="${c.slug}-det-t"><h2 id="${c.slug}-det-t">Approfondir</h2><p class="muted small">Touchez un titre pour ouvrir ou fermer la rubrique.</p>
${sections}
  </section>
  <p class="img-note">Image : illustration générée pour le site, à valeur éditoriale, pas un document photographique.</p>
  ${terms ? `<section id="${c.slug}-termes" aria-labelledby="${c.slug}-ter-t"><h2 id="${c.slug}-ter-t">Termes du dictionnaire</h2><div class="chips">${terms}</div></section>` : ''}
  <section id="${c.slug}-sources" class="refs" aria-labelledby="${c.slug}-src-t"><h2 id="${c.slug}-src-t">Références</h2><p class="muted small">Chaque affirmation chiffrée renvoie à une source consultable. Les mentions « repère de pratique » signalent un contenu en attente de source.</p><ol>
${refs}
  </ol></section>
  <nav class="pager" aria-label="Chapitres voisins"><a href="chapitre-${prev.slug}.html"><small>← Précédent</small><b>${esc(prev.title)}</b></a><a href="chapitre-${next.slug}.html"><small>Suivant →</small><b>${esc(next.title)}</b></a></nav>
</div>
</main>
` + foot;
}
chapters.forEach((c, i) => fs.writeFileSync(`chapitre-${c.slug}.html`, renderChapter(c, i)));

// ---------- accueil
const idMap = { histoire: 'histoire', botanique: 'botanique', agronomie: 'culture', 'post-recolte': 'processus', torrefaction: 'torréfaction', extraction: 'extraction', sensoriel: 'degustation', sante: 'sante', filiere: 'coffee-shops', afrique: 'benin' };
const tiles = chapters.map(c => `      <a class="tile" id="${idMap[c.slug]}" href="chapitre-${c.slug}.html"><img src="img/${c.img}-700.webp" width="700" height="394" alt="${esc(c.alt)}" loading="lazy" decoding="async"><span class="tile-text"><small>${c.n} · ${esc(c.tag)}</small><b>${esc(c.title)}</b><span class="tile-desc">${esc(c.short)}</span></span></a>`).join('\n');
const more = [['benin.html','Dossier Bénin','Sources, repères et données à confirmer.'],['observatoire.html','Observatoire','Indicateurs, unités, périodes et limites.'],['outils.html','Laboratoire','Calculateur, guide d’infusion, roue aromatique.'],['dictionnaire.html','Dictionnaire','254 termes classés en catégories.'],['professionnels.html','Professionnels','Acteurs et lieux du café.'],['sources.html','Sources et contribuer','Méthode, crédits, formulaire de contribution.']].map(([h, t, d]) => `      <a class="more" href="${h}"${t.startsWith('Sources') ? ' id="sources"' : ''}${t === 'Dictionnaire' ? ' id="dictionnaire"' : ''}><b>${t}</b><span>${d}</span></a>`).join('\n');
const botHome = `<section class="band" id="cafebot" aria-labelledby="bot-title">
  <div class="container">
    <details class="acc bot-acc"><summary id="bot-title">CaféBot local : poser une question</summary>
    <div class="acc-body">
      <p class="muted small">Assistant documentaire à règles locales : pas de compte, pas de clé API, aucune question transmise à un service distant. Ce n’est pas un modèle génératif. <a href="sources.html">Méthode et limites</a></p>
      <div class="bot-panel">
        <div id="bot-log" class="chat-log" role="log" aria-live="polite" aria-label="Conversation avec CaféBot">
          <div class="chat assistant"><small>CaféBot local</small><p>Bonjour. Je peux vous orienter sur les espèces, les procédés post-récolte, la torréfaction, l’extraction, la dégustation et le dossier Bénin.</p></div>
        </div>
        <form id="bot-form" class="chat-form">
          <label class="sr-only" for="bot-input">Votre question sur le café</label>
          <input id="bot-input" type="text" maxlength="4000" placeholder="Ex. : Quelle différence entre Arabica et Canephora ?" autocomplete="off">
          <button class="btn primary" type="submit">Envoyer</button>
        </form>
      </div>
      <article class="tech-note"><h3>IA locale, sans promesse artificielle.</h3>
        <p>Le socle actuel est un assistant documentaire à règles locales. L’exécution de modèles spécialisés avec LiteRT pourra être ajoutée lorsqu’un modèle compatible, suffisamment léger et correctement licencié aura été sélectionné et testé sur les appareils cibles.</p>
        <p>LiteRT dans Google Play Services concerne une application Android native ; pour une PWA web, l’intégration doit utiliser une voie web compatible et un modèle adapté. Aucun modèle lourd n’est téléchargé à l’ouverture du site.</p></article>
    </div></details>
  </div>
</section>`;
const homeLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Café Bénin', url: ORIGIN, inLanguage: 'fr-FR', description: 'Encyclopédie documentaire francophone du café, avec un dossier Bénin et Afrique.' });
const home = head({ title: 'Café Bénin — Encyclopédie et atlas du café', desc: 'Encyclopédie documentaire du café : histoire, botanique, culture, torréfaction, extraction, dégustation, santé, Afrique et Bénin, avec sources.', url: ORIGIN, image: 'img/social-card.jpg', extra: `<script type="application/ld+json">${homeLd}</script>\n` }) + `
<main id="accueil">
<section class="hero" id="hero">
  <img class="hero-img" src="img/atlas-hero-living-coffee-web-1400.webp" srcset="img/atlas-hero-living-coffee-web-800.webp 800w, img/atlas-hero-living-coffee-web-1400.webp 1280w, img/atlas-hero-living-coffee-web.webp 2200w" sizes="100vw" alt="Illustration générée : un monde du café, de la plante à la tasse" fetchpriority="high">
  <div class="container hero-text">
    <span class="eyebrow">Encyclopédie · science · pratiques · Afrique · Bénin</span>
    <h1>Le café n’est pas une boisson. <span>C’est un monde à comprendre.</span></h1>
    <p class="lead">Un atlas documentaire francophone du café, de la plante à la tasse. Chaque affirmation renvoie à une source consultable.</p>
    <form id="hero-search-form" class="hero-search" role="search">
      <label class="sr-only" for="hero-search">Rechercher dans l’encyclopédie</label>
      <input id="hero-search" type="search" placeholder="Arabica, fermentation, mouture, terroir…">
      <button class="btn primary" type="submit">Rechercher</button>
    </form>
    <p class="hero-meta"><span><strong>254+</strong> termes</span><span><strong>${chapters.length}</strong> chapitres</span><span><strong>5</strong> outils</span></p>
  </div>
</section>
<section class="band" id="filiere" aria-labelledby="chap-title">
  <div class="container">
    <div class="band-head"><h2 id="chap-title">Explorer par chapitre</h2><a href="explorer.html">Tout voir →</a></div>
    <div class="tiles">
${tiles}
    </div>
  </div>
</section>
<section class="band alt" id="plus" aria-labelledby="plus-title">
  <div class="container">
    <h2 id="plus-title">Aller plus loin</h2>
    <div class="mores">
${more}
    </div>
    <p class="contact-line" id="contact">Une correction ou une source à proposer ? <a href="sources.html#contribuer">Écrire depuis la page Sources</a>.</p>
  </div>
</section>
${botHome}
</main>
` + foot;
fs.writeFileSync('index.html', home);
console.log('généré', chapters.length, 'chapitres + accueil');
