import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const ok = message => console.log('✓ ' + message);
const fail = message => { failures.push(message); console.error('✖ ' + message); };
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

let manifest;
try { manifest = JSON.parse(read('site.webmanifest')); }
catch { fail('site.webmanifest doit contenir un JSON valide.'); }

if (manifest) {
  if (!manifest.name || !manifest.short_name) fail('Nom complet et nom court obligatoires dans le manifest.');
  if (manifest.start_url !== './' || manifest.scope !== './') fail('Le manifest doit rester dans le sous-chemin GitHub Pages.');
  if (!['standalone', 'minimal-ui'].includes(manifest.display)) fail('Mode d’affichage PWA invalide.');
  if (!Array.isArray(manifest.icons) || !manifest.icons.length) fail('Au moins une icône PWA est requise.');
  for (const icon of manifest.icons || []) {
    if (!icon.src || !exists(icon.src)) fail('Icône PWA introuvable : ' + (icon.src || '(sans chemin)') + '.');
  }
  for (const shortcut of manifest.shortcuts || []) {
    if (!shortcut.url || !exists(shortcut.url.split(/[?#]/)[0])) fail('Raccourci PWA invalide : ' + (shortcut.url || '(sans URL)') + '.');
  }
}

const worker = read('sw.js');
const app = read('app.js');
const home = read('index.html');
if (!/addEventListener\(['"]install['"]/.test(worker)) fail('Événement install du service worker absent.');
if (!/addEventListener\(['"]activate['"]/.test(worker)) fail('Événement activate du service worker absent.');
if (!/addEventListener\(['"]fetch['"]/.test(worker)) fail('Routage fetch du service worker absent.');
if (!/request\.mode === ['"]navigate['"]/.test(worker)) fail('Stratégie de navigation hors ligne absente.');
if (!/SKIP_WAITING/.test(worker) || !/clients\.claim/.test(worker)) fail('Cycle de mise à jour du service worker incomplet.');
if (!/navigator\.serviceWorker\.register/.test(app) || !/setupPWA\(\)/.test(app)) fail('Enregistrement du service worker absent de l’application.');
if (!/<link rel="manifest" href="site\.webmanifest">/.test(home)) fail('Manifest non lié depuis la page d’accueil.');
if (!/id="mobile-nav"/.test(home) || !/id="search-modal"/.test(home)) fail('Navigation mobile ou recherche globale absente de la page d’accueil.');
if (!exists('sw.js')) fail('sw.js absent du dépôt.');
if (failures.length) process.exit(1);
ok('Manifest, raccourcis, installation, cache, navigation hors ligne et mise à jour PWA vérifiés.');
