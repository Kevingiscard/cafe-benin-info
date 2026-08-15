import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const PROD_ORIGIN = 'https://kevingiscard.github.io/cafe-benin-info/';
let failed = false;
const fail = message => { console.error(`✖ ${message}`); failed = true; };
const ok = message => console.log(`✓ ${message}`);
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const requireFile = file => exists(file) ? ok(`Présent: ${file}`) : fail(`Fichier requis absent: ${file}`);

[
  'index.html', '404.html', 'styles.css', 'v4.css', 'motion.css', 'theme.css',
  'app.js', 'local-assistant.js', 'motion.js', 'dictionary-v4.js', 'content-sources.md',
  'favicon.svg', 'site.webmanifest', 'package.json', 'package-lock.json', 'robots.txt', 'sitemap.xml'
].forEach(requireFile);
if (failed) process.exit(1);

const html = read('index.html');
const app = read('app.js');
const motion = read('motion.js');
const dictionary = read('dictionary-v4.js');
const pkg = JSON.parse(read('package.json'));

if (!html.includes(`<link rel="canonical" href="${PROD_ORIGIN}">`)) fail('Canonical GitHub Pages absente ou incorrecte.');
if (!/Sitemap:\s*https:\/\/kevingiscard\.github\.io\/cafe-benin-info\/sitemap\.xml/i.test(read('robots.txt'))) fail('Robots.txt ne référence pas le sitemap GitHub Pages.');
if (!read('sitemap.xml').includes(`<loc>${PROD_ORIGIN}</loc>`)) fail('Sitemap GitHub Pages absente ou incorrecte.');
if (!/<html[^>]+lang="fr"/i.test(html)) fail('Attribut lang="fr" absent.');
if (!/<meta[^>]+name="description"/i.test(html)) fail('Meta description absente.');
if (!/application\/ld\+json/.test(html) || !/twitter:card/.test(html) || !/og:title/.test(html)) fail('Métadonnées structurées ou sociales incomplètes.');
if (!/<main\b[^>]*id="accueil"/i.test(html) || !/class="skip-link"/i.test(html)) fail('Landmark principal ou lien d’évitement absent.');
if ((html.match(/<h1\b/gi) || []).length !== 1) fail('La page doit contenir exactement un H1.');
if (!/id="theme-toggle"/.test(html) || !/localStorage\.getItem\('cb-theme'\)/.test(html)) fail('Contrôle de thème accessible ou amorçage anti-flash absent.');
if (!/id="search-modal"/.test(html) || !/id="global-search"/.test(html) || !/id="mobile-nav"/.test(html)) fail('Composants de recherche ou de navigation mobile absents.');
if (!/id="cafebot"/.test(html) || !/id="dictionnaire"/.test(html) || !/id="benin"/.test(html) || !/id="sources"/.test(html) || !/id="contact"/.test(html)) fail('Contenu documentaire critique absent.');
if (!/local-assistant\.js/.test(html) || !/app\.js/.test(html) || !/dictionary-v4\.js/.test(html) || !/theme\.css/.test(html)) fail('Scripts ou styles frontend autonomes absents.');
if ((read('styles.css').match(/@import\s+url\([^)]*fonts\.googleapis/gi) || []).length) fail('Les polices ne doivent pas être importées deux fois.');
if (/backend-client\.js|\/api\/|vercel\.app/i.test(`${html}\n${app}`)) fail('Référence serveur externe détectée dans le frontend.');
if (pkg.dependencies && Object.keys(pkg.dependencies).length) fail('Le site statique ne doit pas exiger de dépendance runtime.');
if (!pkg.scripts?.test?.includes('tests/*.test.mjs')) fail('La commande de test doit couvrir toutes les suites Node.');
ok('Architecture statique, SEO minimal et parcours critiques cohérents.');

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/gi)].map(match => match[1]));
const staticIdCount = [...html.matchAll(/\bid="([^"]+)"/gi)].length;
if (ids.size !== staticIdCount) fail('Des identifiants HTML sont dupliqués.');
['voyage-visuel', 'carnet'].forEach(id => ids.add(id));
const internalLinks = [...`${html}\n${motion}`.matchAll(/href="#([^"]+)"/gi)].map(match => match[1]);
for (const id of new Set([...internalLinks, 'coffee-shops'])) {
  if (!ids.has(id)) fail(`Ancre interne absente: #${id}`);
}
ok('Ancres historiques et navigation interne vérifiées.');

const localRefs = new Set();
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const ref = match[1].split('#')[0].split('?')[0];
  if (!ref || ref.startsWith('#') || /^(https?:|mailto:|javascript:)/.test(ref)) continue;
  localRefs.add(ref.replace(/^\.\//, ''));
}
for (const match of `${motion}\n${app}`.matchAll(/(?:src|href)=["']([^"']+\.(?:avif|gif|jpe?g|png|svg|webp))["']/gi)) {
  const ref = match[1].split('?')[0];
  if (!/^(https?:|data:)/.test(ref)) localRefs.add(ref.replace(/^\.\//, ''));
}
for (const ref of localRefs) exists(ref) ? ok(`Ressource OK: ${ref}`) : fail(`Ressource locale introuvable: ${ref}`);

for (const visual of ['img/benin-coffee-dawn.jpg', 'img/ethiopian-coffee-ceremony-ccby.jpg', 'img/v14_atlas_world.jpg', 'img/coffee_beans_macro.webp', 'img/premium_coffee_pour.webp', 'img/coffee_shop_cotonou.webp']) {
  exists(visual) ? ok(`Visuel éditorial OK: ${visual}`) : fail(`Visuel éditorial absent: ${visual}`);
}
for (const imageTag of html.matchAll(/<img\b([^>]+)>/gi)) {
  if (!/\balt="[^"]*"/i.test(imageTag[1])) fail('Une image statique ne possède pas d’alternative textuelle.');
}
for (const linkTag of html.matchAll(/<a\b([^>]+)>/gi)) {
  if (/target="_blank"/i.test(linkTag[1]) && !/rel="[^"]*\bnoopener\b[^"]*"/i.test(linkTag[1])) fail('Un lien nouvel onglet ne possède pas rel="noopener".');
}
ok('Assets locaux, textes alternatifs et liens externes sécurisés.');

for (const file of ['app.js', 'local-assistant.js', 'motion.js', 'dictionary-v4.js']) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  result.status === 0 ? ok(`Syntaxe JS OK: ${file}`) : fail(`Syntaxe JS invalide: ${file}\n${result.stderr}`);
}
for (const removed of ['api', 'lib', 'backend-client.js', 'vercel.json', 'app-v3.js']) {
  if (exists(removed)) fail(`Intégration ou version obsolète à retirer: ${removed}`);
}
if (/\beval\(|new Function|document\.write/i.test(`${app}\n${motion}\n${dictionary}`)) fail('Primitive JavaScript dangereuse détectée.');
if (/fetch\(|XMLHttpRequest|WebSocket/i.test(`${app}\n${motion}\n${dictionary}`)) fail('Le runtime autonome ne doit pas dépendre d’un appel réseau applicatif.');
ok('Runtime JavaScript autonome et syntaxiquement valide.');

if (failed) process.exit(1);
console.log('\nValidation GitHub Pages terminée sans erreur.');
