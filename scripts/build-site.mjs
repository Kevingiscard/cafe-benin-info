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
  <section id="${c.slug}-sources" class="refs" aria-labelledby="${c.slug}-src-t"><h2 id="${c.slug}-src-t">Références</h2><p class="muted small">Les affirmations renvoient aux références numérotées ci-dessous, avec leur date de consultation. Les rubriques marquées « à documenter » n’ont pas encore de source vérifiée et n’affirment rien. Certaines sources sont secondaires : leur nature est indiquée dans leur intitulé.</p><ol>
${refs}
  </ol></section>
  <nav class="pager" aria-label="Chapitres voisins"><a href="chapitre-${prev.slug}.html"><small>← Précédent</small><b>${esc(prev.title)}</b></a><a href="chapitre-${next.slug}.html"><small>Suivant →</small><b>${esc(next.title)}</b></a></nav>
</div>
</main>
` + foot;
}
chapters.forEach((c, i) => fs.writeFileSync(`chapitre-${c.slug}.html`, renderChapter(c, i)));

// ---------- dossier Bénin (nouvelle présentation, contenu d'origine conservé)
function renderBenin() {
  const ICO = 'https://www.ico.org/documents/cy2014-15/icc-114-5e-overview-coffee-sector-africa.pdf';
  const a = (h, t) => `<a href="${h}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  const acc = (t, h, open) => `<details class="acc"${open ? ' open' : ''}><summary>${t}</summary><div class="acc-body">${h}</div></details>`;
  const url = `${ORIGIN}benin.html`;
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Dossier Bénin | Café Bénin', url, inLanguage: 'fr-FR', description: 'Dossier documentaire sur le café au Bénin, ses sources, ses limites et les pistes de recherche.' });
  return head({ title: 'Dossier Bénin | Café Bénin', desc: 'Dossier documentaire sur le café au Bénin, ses sources, ses limites et les pistes de recherche.', url, image: 'img/atlas-benin-field-notebook-web.webp', extra: `<script type="application/ld+json">${ld}</script>\n` }) + `
<main id="main" class="chapter">
<div class="container chapter-body">
  <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <span>Dossier Bénin</span></nav>
  <span class="eyebrow">Territoire documentaire · édition premium</span>
  <h1>Le café au Bénin.</h1>
  <p class="lead">Une page structurée pour distinguer ce qui est établi, ce qui est historique et ce qui reste à documenter. Aucun chiffre local n’est publié sans source datée et vérifiable.</p>
  <section class="essential" id="benin-etat"><h2>État des preuves</h2><p>Cette version ne prétend pas décrire une production actuelle, des zones caféières ou une filière organisée. Le dossier est ouvert, évolutif et méthodologiquement prudent.</p></section>
  <section id="benin-details"><h2>Approfondir</h2><p class="muted small">Touchez un titre pour ouvrir ou fermer la rubrique.</p>
${acc('Ce que disent les sources (mise à jour du 20 novembre 2026)', `<p class="muted">Chaque donnée porte sa source, son année et son périmètre.</p>
<h3>Historique de production (OIC, 2015)</h3><p>Production moyenne du Bénin : 18 000 sacs de 60 kg dans les années 1970, 33 000 dans les années 1980 (environ 1 980 t, calcul du site), puis aucune production enregistrée dans les années 1990, 2000 et en 2013/14 (estimation). Source : ${a(ICO, 'OIC, ICC-114-5 (2015), annexe, tableau 1')}.</p>
<h3>Producteurs et superficie (OIC, 2015)</h3><p>Le même rapport estime 8 000 producteurs, tous en petites exploitations, et 15 000 ha de café. Ce sont des estimations publiées en 2015, dont l’année d’observation n’est pas précisée : elles ne décrivent pas forcément 2015 et ne sont pas des chiffres actuels. Source : ${a(ICO, 'OIC, ICC-114-5 (2015), annexe, tableau 3')}.</p>
<h3>Décret béninois n° 2001-351 (source officielle, 2001)</h3><p>Le texte, qui présente l’Accord international de 2001 sur le café, résume l’histoire de la filière : de 1960 à 1972, environ 10 000 t exportées sur 5 000 ha ; de 1972 à 1993, des plantations passées de 5 000 à 600 ha pour environ 150 t par an ; depuis 1994, un regain d’intérêt de 2 000 producteurs ; 78,5 ha de nouvelles plantations de 1997 à 1999. Il publie aussi des exportations contrôlées : 32,6 t (1991), 49,5 t (1992), 234,3 t (1993), 100,2 t (1994), 120 t (1995), puis 1 850,8 t (1996) et 1 144,0 t (1997). Le décret attribue les écarts de 1996 et 1997 à la contrebande de production de pays voisins. Il estime à plus de 700 000 ha les zones favorables (97 % dans les départements du Sud, le reste au sud de la Donga, sous-préfecture de Bassila) : c’est un potentiel estimé en 2001, pas une surface cultivée. Source : ${a('https://sgg.gouv.bj/doc/decret-2001-351/download', 'Décret n° 2001-351 (Secrétariat général du gouvernement)')}, pages 2 et 3, chiffres relus sur le document.</p>
<h3>FAOSTAT : valeur récente, à confirmer</h3><p>Des sites secondaires reprenant FAOSTAT donnent environ 55 t de café vert en 2024, valeur estimée par la FAO ou issue d’une autre source internationale, non statistique nationale officielle (${a('https://beanesis.com/fr/origins/benin/', 'Beanesis')}, ${a('https://waramina.com/pays/benin/production-de-cafe', 'Waramina')}). Non vérifié sur la base FAOSTAT elle-même : à confirmer.</p>
<h3>Initiative récente (déclarations non vérifiées)</h3><p>Le 26 juin 2026, un média béninois rapporte le lancement par l’Association IBILE et la Coopérative Cacao-Café Bénin d’un programme de plantation de cacao et de café dans le Centre et le Nord. Selon les promoteurs : plus de 300 producteurs déjà engagés et plus de 80 000 plants disponibles. Ce sont des affirmations des promoteurs, sans confirmation indépendante. Source : ${a('https://lanatayaise.com/production-du-cacao-et-du-cafe-un-programme-cooperatif-lance-pour-developper-la-filiere-au-centre-et-au-nord-du-benin/', 'Lanatayaise (2026)')}.</p>
<p><strong>Lecture prudente :</strong> ces sources ne mesurent pas la même chose. L’OIC donne des moyennes de production par décennie en milliers de sacs (un « 0 » peut être un arrondi ou une absence d’enregistrement, sans qu’on sache lequel). Le décret donne une production d’environ 150 t par an pour les anciennes plantations (près de 600 ha) et des exportations contrôlées année par année, dont les pics de 1996-1997 sont attribués à la contrebande, donc ce ne sont pas des volumes produits au Bénin. On ne peut pas conclure à une contradiction ; on retient que le décret atteste une activité caféière réelle dans les années 1990, que l’OIC n’enregistre pas à son niveau d’arrondi. Le chiffre récent compare 2013/14 (OIC) et 2024 (FAOSTAT) : à confirmer auprès de FAOSTAT, de l’OIC et de la Direction de la Statistique Agricole. Aucune zone de culture actuelle n’est affirmée ici. Voir aussi le chapitre <a href="chapitre-afrique.html">Afrique et Bénin</a>.</p>`, true)}
${acc('Architecture du dossier', '<p><b>1. Méthode.</b> Chaque affirmation locale doit porter sa source, sa date, son unité et son périmètre.</p><p><b>2. Sources.</b> DSA, FAO (historique), OIC et documents officiels uniquement.</p><p><b>3. Limites.</b> Les blancs sont signalés. « Non documenté » ≠ « inexistant ».</p>')}
${acc('Sources de départ', `<ul><li><b>Nationale.</b> ${a('https://dsa.agriculture.gouv.bj/', 'Direction de la Statistique Agricole')} : point d’entrée pour les publications agricoles datées.</li><li><b>Historique.</b> ${a('https://www.fao.org/4/x6939e/X6939e03.htm', 'FAO – contexte de filière')} : à relire avec sa date. Ne pas présenter comme actuel.</li><li><b>Internationale.</b> ${a('https://www.ico.org/', 'Organisation internationale du café')} : statistiques mondiales. Extraire avec année et définition.</li></ul>`)}
${acc('Prochaines étapes prioritaires', '<ul><li><b>Archivage primaire.</b> Extraire et dater les séries FAOSTAT / DSA avec métadonnées complètes.</li><li><b>Acteurs et terrain.</b> Identifier structures avec consentement, date, lieu et rôle.</li><li><b>Visuels documentaires.</b> Remplacer progressivement les illustrations générées par des photos licenciées.</li></ul><p><a class="btn primary" href="sources.html#contribuer">Proposer une source</a></p>')}
  </section>
  <p class="img-note">Aucune image n’illustre cette page : le dossier attend des photos licenciées et documentées.</p>
</div>
</main>
` + foot;
}
fs.writeFileSync('benin.html', renderBenin());
// ---------- explorer (hub des chapitres, descriptions d'origine conservées)
const EXPLORER_CARDS = [["history", "Chapitre 01", "Histoire du café", "Origines, diffusion, routes commerciales, lieux de consommation et industrialisation. Les récits sont replacés dans leur contexte historique et documentaire.", "histoire"], ["botany", "Chapitre 02", "Botanique & diversité", "Genre Coffea, Arabica, Canephora, anatomie de la cerise, fleur, graine, diversité génétique et cultivars.", "botanique"], ["agronomy", "Chapitre 03", "Culture & agronomie", "Exigences pédoclimatiques, ombrage, nutrition, santé des caféiers, récolte et limites des rendements.", "agronomie"], ["processing", "Chapitre 04", "Post-récolte", "Voies sèche, humide et honey ; fermentation, dépulpage, lavage, séchage, stockage et traçabilité.", "post-recolte"], ["roasting", "Chapitre 05", "Torréfaction", "Transfert de chaleur, réactions chimiques, premier crack, développement aromatique, dégazage et conservation.", "torrefaction"], ["extraction", "Chapitre 06", "Extraction", "Mouture, ratio, température, eau, débit, pression et mesures de concentration. Principes des méthodes filtre et espresso.", "extraction"], ["sensory", "Chapitre 07", "Dégustation", "Arôme, acidité, corps, équilibre, finale et défauts. Vocabulaire sensoriel, cupping et limites de la description subjective.", "sensoriel"], ["preparation", "Chapitre 08", "Préparation", "Filtre, espresso, immersion et méthodes hybrides. Paramètres à noter pour reproduire une tasse.", "extraction"], ["health", "Chapitre 09", "Santé & qualité", "Ce que les sources permettent d’affirmer, les zones d’incertitude et la nécessaire prudence. Aucun contenu ne remplace un avis médical.", "sante"], ["economy", "Chapitre 10", "Filière & économie", "Acteurs, traçabilité, marchés internationaux et questions de terrain. Pour le Bénin : données disponibles, limites et pistes de documentation.", "filiere"]];
function renderExplorer() {
  const bySlug = Object.fromEntries(chapters.map(c => [c.slug, c]));
  const extra = { preparation: ' <a class="portal-link" href="outils.html">Voir les outils →</a>', economy: ' <a class="portal-link" href="benin.html">Dossier Bénin →</a> <a class="portal-link" href="chapitre-afrique.html">Afrique et Bénin →</a>' };
  const cards = EXPLORER_CARDS.map(([id, num, title, desc, slug]) => { const c = bySlug[slug]; return `<article class="chapter-card" data-chapter="${id}"><small>${num}</small><h3>${esc(title)}</h3><p>${esc(desc)}</p><p class="muted small">Publié dans le chapitre : ${esc(c.short)} Le reste du programme ci-dessus est en cours de rédaction et de sourçage.</p><p><a class="portal-link" href="chapitre-${slug}.html">Lire le chapitre →</a>${extra[id] || ''}</p><div class="card-actions"><button class="chapter-read btn" type="button" aria-pressed="false">Marquer comme lu</button><span class="chapter-status">À découvrir</span></div></article>`; }).join('\n');
  const url = `${ORIGIN}explorer.html`;
  return head({ title: 'Explorer les chapitres | Café Bénin', desc: 'Parcours en dix chapitres, de la plante à la tasse, avec progression conservée sur l’appareil.', url, image: 'img/ch-histoire.webp' }) + `
<main id="main" class="chapter">
<div class="container chapter-body">
  <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <span>Explorer</span></nav>
  <span class="eyebrow">Encyclopédie · 10 chapitres</span>
  <h1>Explorer de la plante à la tasse.</h1>
  <p class="lead">Un parcours structuré pour comprendre le café dans ses dimensions botaniques, techniques, sensorielles, économiques et territoriales. Cochez les chapitres déjà lus : votre progression est conservée sur cet appareil.</p>
  <div class="reading-progress"><label for="chapter-progress">Votre progression</label> <progress id="chapter-progress" max="10" value="0"></progress> <strong id="chapter-progress-label">0 sur 10 chapitres</strong> <button id="reset-reading" class="btn" type="button">Réinitialiser</button></div>
  <div class="cards-grid" id="chapter-grid">
${cards}
  </div>
  <section aria-labelledby="exp-more"><h2 id="exp-more">Aller plus loin</h2>
  <div class="chips"><a class="chip big" href="dictionnaire.html">Dictionnaire</a><a class="chip big" href="sources.html">Sources et méthode</a><a class="chip big" href="chapitre-afrique.html">Afrique et Bénin</a><a class="chip big" href="outils.html">Outils</a></div>
  <p class="muted small">Dictionnaire : termes et définitions organisés par catégories, avec recherche et favoris locaux. Sources et méthode : références, crédits visuels, méthode éditoriale et modalités de contribution.</p></section>
</div>
</main>
<script src="explorer.js" defer></script>
` + foot;
}
fs.writeFileSync('explorer.html', renderExplorer());



// ---------- accueil
const idMap = { histoire: 'histoire', botanique: 'botanique', agronomie: 'culture', 'post-recolte': 'processus', torrefaction: 'torréfaction', extraction: 'extraction', sensoriel: 'degustation', sante: 'sante', filiere: 'coffee-shops', afrique: 'benin' };
const featured = ['histoire', 'botanique', 'torrefaction', 'afrique'];
const tileHtml = c => `      <a class="tile" id="${idMap[c.slug]}" href="chapitre-${c.slug}.html"><img src="img/${c.img}-700.webp" width="700" height="394" alt="${esc(c.alt)}" loading="lazy" decoding="async"><span class="tile-text"><small>${c.n} · ${esc(c.tag)}</small><b>${esc(c.title)}</b><span class="tile-desc">${esc(c.short)}</span></span></a>`;
const tiles = chapters.filter(c => featured.includes(c.slug)).map(tileHtml).join('\n');
const rows = chapters.filter(c => !featured.includes(c.slug)).map(c => `        <a class="row" id="${idMap[c.slug]}" href="chapitre-${c.slug}.html"><img src="img/${c.img}-700.webp" width="700" height="394" alt="${esc(c.alt)}" loading="lazy" decoding="async"><span><small>${c.n} · ${esc(c.tag)}</small><b>${esc(c.title)}</b></span></a>`).join('\n');
const moreItems = [['benin.html','Dossier Bénin','Sources, repères et données à confirmer.'],['observatoire.html','Observatoire','Indicateurs, unités, périodes et limites.'],['outils.html','Laboratoire','Calculateur, guide d’infusion, roue aromatique.'],['dictionnaire.html','Dictionnaire','254 termes classés en catégories.'],['professionnels.html','Professionnels','Acteurs et lieux du café.'],['sources.html','Sources et contribuer','Méthode, crédits, formulaire de contribution.']];
const more = moreItems.map(([h, t, d]) => `      <a class="chip big" href="${h}" title="${esc(d)}"${t.startsWith('Sources') ? ' id="sources"' : ''}${t === 'Dictionnaire' ? ' id="dictionnaire"' : ''}>${t}</a>`).join('\n');
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
    <p class="lead">Un atlas documentaire francophone du café, de la plante à la tasse. Les chapitres citent leurs sources ; ce qui reste à documenter est signalé.</p>
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
    <details class="acc all-chapters"><summary>Voir les ${chapters.length - featured.length} autres chapitres</summary><div class="acc-body rows">
${rows}
    </div></details>
  </div>
</section>
<section class="band alt" id="plus" aria-labelledby="plus-title">
  <div class="container">
    <h2 id="plus-title">Aller plus loin</h2>
    <div class="chips">
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
