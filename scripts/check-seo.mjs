import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://kevingiscard.github.io/cafe-benin-info/';
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
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
for (const [label, matcher] of required) if (!matcher.test(html)) fail(`Élément SEO absent : ${label}`);

const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (jsonLd) {
  try {
    const parsed = JSON.parse(jsonLd);
    if (parsed.url !== origin || parsed.name !== 'Café Bénin') fail('JSON-LD incohérent avec le site public.');
  } catch { fail('JSON-LD invalide.'); }
}
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site.webmanifest'), 'utf8'));
if (!robots.includes(`${origin}sitemap.xml`)) fail('robots.txt ne déclare pas le sitemap public.');
if (!sitemap.includes(`<loc>${origin}</loc>`)) fail('sitemap.xml ne déclare pas la page d’accueil publique.');
if (manifest.start_url !== '/cafe-benin-info/') fail('Le manifest ne respecte pas le chemin GitHub Pages.');
ok('Balises, JSON-LD, robots, sitemap et manifest vérifiés.');
if (failures.length) process.exit(1);
