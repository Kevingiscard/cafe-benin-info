import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const fail = message => { console.error(`✖ ${message}`); process.exitCode = 1; };
const ok = message => console.log(`✓ ${message}`);

const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

for (const required of ['index.html', 'styles.css', 'app-v3.js', 'backend-client.js', 'package.json', 'vercel.json', 'robots.txt']) {
  if (!exists(required)) fail(`Fichier requis absent: ${required}`); else ok(`Présent: ${required}`);
}

const html = read('index.html');
if (!/<html[^>]+lang="fr"/i.test(html)) fail('Attribut lang="fr" absent.');
if (!/<meta[^>]+name="description"/i.test(html)) fail('Meta description absente.');
if (!/<link[^>]+rel="canonical"/i.test(html)) fail('Canonical absente.');
if (!/backend-client\.js/.test(html) || !/app-v3\.js/.test(html)) fail('Scripts frontend principaux absents.');
if (/https:\/\/kevingiscard\.github\.io\/cafe-benin-info\//.test(html)) fail('Canonical encore configurée sur GitHub Pages: Vercel doit être la cible de production.');

const localRefs = new Set();
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const ref = match[1].split('#')[0].split('?')[0];
  if (!ref || ref.startsWith('#') || ref.startsWith('http:') || ref.startsWith('https:') || ref.startsWith('mailto:') || ref.startsWith('javascript:')) continue;
  localRefs.add(ref.replace(/^\.\//, ''));
}
for (const ref of localRefs) {
  if (!exists(ref)) fail(`Ressource locale introuvable: ${ref}`); else ok(`Ressource OK: ${ref}`);
}

const jsFiles = ['app-v3.js', 'backend-client.js', ...fs.readdirSync(path.join(root, 'api')).filter(f => f.endsWith('.js')).map(f => `api/${f}`)];
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`Syntaxe JS invalide: ${file}\n${result.stderr}`); else ok(`Syntaxe JS OK: ${file}`);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.engines?.node !== '24.x') fail('Node.js production doit être épinglé sur 24.x.');
if (!pkg.dependencies?.['@google/genai']) fail('@google/genai doit être présent.');
if (pkg.dependencies?.['@google/generative-ai']) fail('Ancien SDK @google/generative-ai encore présent.');
ok('Configuration Node/Gemini cohérente.');

const env = exists('.env.example') ? read('.env.example') : '';
if (env.includes('AIza') || env.includes('SUPABASE_SERVICE_ROLE')) fail('Secret potentiel détecté dans .env.example.');
ok('Aucun secret évident dans .env.example.');

if (process.exitCode) process.exit(1);
console.log('\nValidation de déploiement terminée sans erreur.');
