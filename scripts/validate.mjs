import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const PROD_ORIGIN = 'https://cafe-benin-info.vercel.app/';
const fail = message => { console.error(`✖ ${message}`); process.exitCode = 1; };
const ok = message => console.log(`✓ ${message}`);
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value, 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

for (const required of ['index.html', 'styles.css', 'v4.css', 'motion.css', 'app-v3.js', 'local-assistant.js', 'motion.js', 'dictionary-v4.js', 'backend-client.js', 'content-sources.md', 'package.json', 'vercel.json', 'robots.txt']) {
  if (!exists(required)) fail(`Fichier requis absent: ${required}`); else ok(`Présent: ${required}`);
}
if (!exists('index.html')) process.exit(1);

let html = read('index.html');
const canonical = '<link rel="canonical" href="https://cafe-benin-info.vercel.app/">';
if (/<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)) html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, canonical);
else html = html.replace('</head>', `${canonical}\n</head>`);
write('index.html', html);
write('robots.txt', `User-agent: *\nDisallow: /*?*\nAllow: /$\nSitemap: ${PROD_ORIGIN}sitemap.xml\n`);

if (exists('sitemap.xml')) {
  let sitemap = read('sitemap.xml');
  sitemap = sitemap.replace(/<loc>[^<]+<\/loc>/i, `<loc>${PROD_ORIGIN}</loc>`);
  sitemap = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/i, `<lastmod>${new Date().toISOString().slice(0,10)}</lastmod>`);
  write('sitemap.xml', sitemap);
}

html = read('index.html');
const app = read('app-v3.js');
const dict = read('dictionary-v4.js');
if (!/<html[^>]+lang="fr"/i.test(html)) fail('Attribut lang="fr" absent.');
if (!/<meta[^>]+name="description"/i.test(html)) fail('Meta description absente.');
if (!/<link[^>]+rel="canonical"[^>]+cafe-benin-info\.vercel\.app/i.test(html)) fail('Canonical production Vercel absente.');
if (!/backend-client\.js/.test(html) || !/app-v3\.js/.test(html) || !/dictionary-v4\.js/.test(html)) fail('Scripts frontend principaux absents.');
if (!/cafe-benin-info\.vercel\.app/.test(app)) fail('Le frontend ne force pas le canonical de production Vercel.');
if (!/const EXTRA=/.test(dict) || !/function init\(/.test(dict) || !/#dict-list/.test(dict)) fail('Module dictionnaire V4 incomplet.');
ok('Architecture HTML et dictionnaire V4 cohérents.');

const localRefs = new Set();
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const ref = match[1].split('#')[0].split('?')[0];
  if (!ref || ref.startsWith('#') || ref.startsWith('http:') || ref.startsWith('https:') || ref.startsWith('mailto:') || ref.startsWith('javascript:')) continue;
  localRefs.add(ref.replace(/^\.\//, ''));
}
for (const ref of localRefs) {
  if (!exists(ref)) fail(`Ressource locale introuvable: ${ref}`); else ok(`Ressource OK: ${ref}`);
}

for (const visual of ['img/benin-coffee-dawn.jpg', 'img/ethiopian-coffee-ceremony-ccby.jpg', 'img/v14_atlas_world.jpg', 'img/coffee_shop_cotonou.png']) {
  if (!exists(visual)) fail(`Visuel éditorial absent: ${visual}`); else ok(`Visuel éditorial OK: ${visual}`);
}

const jsFiles = ['app-v3.js', 'local-assistant.js', 'motion.js', 'backend-client.js', ...fs.readdirSync(path.join(root, 'api')).filter(f => f.endsWith('.js')).map(f => `api/${f}`), 'lib/cors.js'];
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`Syntaxe JS invalide: ${file}\n${result.stderr}`); else ok(`Syntaxe JS OK: ${file}`);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.engines?.node !== '24.x') fail('Node.js production doit être épinglé sur 24.x.');
if (!pkg.dependencies?.['@google/genai']) fail('@google/genai doit être présent.');
if (pkg.dependencies?.['@google/generative-ai']) fail('Ancien SDK @google/generative-ai encore présent.');
if (pkg.devDependencies?.vercel) fail('Vercel CLI ne doit pas être une dépendance du projet.');
if (!pkg.dependencies?.nodemailer || !/^\^9\./.test(pkg.dependencies.nodemailer)) fail('Nodemailer doit utiliser la branche 9.x actuelle.');
ok('Configuration Node/Gemini/Nodemailer cohérente.');

const env = exists('.env.example') ? read('.env.example') : '';
if (env.includes('AIza') || env.includes('SUPABASE_SERVICE_ROLE')) fail('Secret potentiel détecté dans .env.example.');
ok('Aucun secret évident dans .env.example.');

if (process.exitCode) process.exit(1);
console.log('\nValidation de déploiement terminée sans erreur.');
