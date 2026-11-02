import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://kevingiscard.github.io/cafe-benin-info/';
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html') && file !== '404.html');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site.webmanifest'), 'utf8'));
const failures = [];
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };
const ok = message => console.log(`✓ ${message}`);

const required = [
  ['langue', /<html[^>]+lang="fr"/i],
  ['titre', /<title>[^<]{20,}<[\/ ]title>/i],
  ['description', /<meta[^>]+name="description"[^>]+content="[^"]{50,}"/i],
  ['canonical', new RegExp(`<link rel="canonical" href="${origin}">`)],
  ['Open Graph', /property="og:title"[\s\S]*property="og:description"|property="og:description"[\s\S]*property="og:title"/],
  ['Twitter', /name="twitter:card"/],
  ['données structurées', /<script type="application\/ld\+json">([\s\S]*?)<\/script>/]
];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const pageOrigin = `${origin}${page === 'index.html' ? '' : page}`;
  for (const [label, matcher] of required) {
    const effectiveMatcher = label === 'canonical' ? new RegExp(`<link rel="canonical" href="${pageOrigin}">`) : matcher;
    if (!effectiveMatcher.test(html)) fail(`${page}: élément SEO absent : ${label}`);
  }
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (jsonLd) {
    try {
      const parsed = JSON.parse(jsonLd);
      if (parsed.url !== pageOrigin) fail(`${page}: JSON-LD incohérent avec l’URL publique.`);
    } catch { fail(`${page}: JSON-LD invalide.`); }
  }
  if (!sitemap.includes(`<loc>${pageOrigin}</loc>`)) fail(`${page}: page absente du sitemap.`);
}
if (!robots.includes(`${origin}sitemap.xml`)) fail('robots.txt ne déclare pas le sitemap public.');
if (!sitemap.includes(`<loc>${origin}</loc>`)) fail('sitemap.xml ne déclare pas la page d’accueil publique.');
if (!['./', '/cafe-benin-info/'].includes(manifest.start_url)) fail('Le manifest doit utiliser un chemin compatible avec GitHub Pages et Vercel.');
ok(`${pages.length} pages : balises, JSON-LD, robots, sitemap et manifest vérifiés.`);
if (failures.length) process.exit(1);
