import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const PROD_ORIGIN = 'https://kevingiscard.github.io/cafe-benin-info/';
const fail = message => { console.error(`✖ ${message}`); process.exitCode = 1; };
const ok = message => console.log(`✓ ${message}`);
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

for (const required of ['index.html', 'styles.css', 'v4.css', 'motion.css', 'theme.css', 'app.js', 'local-assistant.js', 'motion.js', 'dictionary-v4.js', 'content-sources.md', 'favicon.svg', 'site.webmanifest', 'package.json', 'robots.txt']) {
  if (!exists(required)) fail(`Fichier requis absent: ${required}`); else ok(`Présent: ${required}`);
}
if (!exists('index.html')) process.exit(1);

let html = read('index.html');
const canonical = `<link rel="canonical" href="${PROD_ORIGIN}">`;
if (!html.includes(canonical)) fail('Canonical GitHub Pages absente ou incorrecte.');
if (!/Sitemap:\s*https:\/\/kevingiscard\.github\.io\/cafe-benin-info\/sitemap\.xml/i.test(read('robots.txt'))) fail('Robots.txt ne référence pas le sitemap GitHub Pages.');
if (!exists('sitemap.xml') || !read('sitemap.xml').includes(`<loc>${PROD_ORIGIN}</loc>`)) fail('Sitemap GitHub Pages absente ou incorrecte.');
const app = read('app.js');
if (!/<html[^>]+lang="fr"/i.test(html)) fail('Attribut lang="fr" absent.');
if (!/<meta[^>]+name="description"/i.test(html)) fail('Meta description absente.');
if (!/kevingiscard\.github\.io\/cafe-benin-info/.test(html)) fail('Canonical GitHub Pages absente.');
if (!/application\/ld\+json/.test(html) || !/twitter:card/.test(html)) fail('Métadonnées structurées ou sociales absentes.');
if (!/local-assistant\.js/.test(html) || !/app\.js/.test(html) || !/dictionary-v4\.js/.test(html) || !/theme\.css/.test(html)) fail('Scripts ou styles frontend autonomes absents.');
if (!/id="theme-toggle"/.test(html) || !/(?:data-theme|dataset\.theme)/.test(html)) fail('Contrôle de thème accessible ou amorçage anti-flash absent.');
if ((read('styles.css').match(/@import\s+url\([^)]*fonts\.googleapis/gi) || []).length) fail('Les polices ne doivent pas être importées deux fois.');
if (/backend-client\.js|\/api\/|vercel\.app/i.test(`${html}\n${app}`)) fail('Référence serveur externe détectée dans le frontend.');
ok('Architecture GitHub Pages autonome cohérente.');

const localRefs = new Set();
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const ref = match[1].split('#')[0].split('?')[0];
  if (!ref || ref.startsWith('#') || /^(https?:|mailto:|javascript:)/.test(ref)) continue;
  localRefs.add(ref.replace(/^\.\//, ''));
}
for (const ref of localRefs) {
  if (!exists(ref)) fail(`Ressource locale introuvable: ${ref}`); else ok(`Ressource OK: ${ref}`);
}

for (const visual of ['img/benin-coffee-dawn.jpg', 'img/ethiopian-coffee-ceremony-ccby.jpg', 'img/v14_atlas_world.jpg', 'img/coffee_beans_macro.webp', 'img/premium_coffee_pour.webp', 'img/coffee_shop_cotonou.webp']) {
  if (!exists(visual)) fail(`Visuel éditorial absent: ${visual}`); else ok(`Visuel éditorial OK: ${visual}`);
}

for (const file of ['app.js', 'local-assistant.js', 'motion.js', 'dictionary-v4.js']) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`Syntaxe JS invalide: ${file}\n${result.stderr}`); else ok(`Syntaxe JS OK: ${file}`);
}

for (const removed of ['api', 'lib', 'backend-client.js', 'vercel.json']) {
  if (exists(removed)) fail(`Intégration externe à retirer: ${removed}`);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.dependencies && Object.keys(pkg.dependencies).length) fail('Le site statique ne doit pas exiger de dépendance de serveur.');
ok('Configuration statique sans dépendance externe cohérente.');

if (process.exitCode) process.exit(1);
console.log('\nValidation GitHub Pages terminée sans erreur.');
