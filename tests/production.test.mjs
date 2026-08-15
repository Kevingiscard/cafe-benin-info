import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const html = read('index.html');
const app = read('app.js');
const dictionary = read('dictionary-v4.js');
const motion = read('motion.js');

test('les points d’entrée et les ancres historiques restent disponibles', () => {
  for (const id of ['accueil', 'histoire', 'benin', 'botanique', 'culture', 'processus', 'torréfaction', 'extraction', 'degustation', 'dictionnaire', 'filiere', 'sante', 'cafebot', 'sources', 'contact', 'coffee-shops']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(motion, /section\.id = 'voyage-visuel'/);
  assert.match(motion, /section\.id = 'carnet'/);
});

test('les composants critiques de navigation, recherche et dictionnaire sont présents', () => {
  for (const id of ['site-nav', 'nav-toggle', 'mobile-nav', 'search-open', 'search-modal', 'global-search', 'search-results', 'dict-search', 'dict-filter', 'dict-list']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /ArrowDown/);
  assert.match(app, /Escape/);
  assert.match(app, /cafeb:dictionary-ready/);
});

test('les formulaires exposent des contraintes HTML et des retours accessibles', () => {
  assert.match(html, /id="comment-name" required maxlength="80"/);
  assert.match(html, /id="comment-email" type="email" required maxlength="160"/);
  assert.match(html, /id="comment-content" required maxlength="4000"/);
  assert.match(html, /id="comment-status"[^>]*aria-live="polite"/);
  assert.match(app, /encodeURIComponent\(`Contribution Café Bénin/);
});

test('le thème et le stockage local récupèrent des valeurs indisponibles ou invalides', () => {
  assert.match(app, /try \{ return localStorage\.getItem/);
  assert.match(app, /value === 'dark' \? 'dark' : 'light'/);
  assert.match(dictionary, /catch\{return\[\]\}/);
  assert.match(dictionary, /typeof v==='string'/);
  assert.match(dictionary, /slice\(0,100\)/);
});

test('le runtime n’exécute ni code dynamique ni requête applicative', () => {
  const runtime = `${app}\n${dictionary}\n${motion}\n${read('local-assistant.js')}`;
  assert.doesNotMatch(runtime, /\beval\(|new Function|document\.write/);
  assert.doesNotMatch(runtime, /fetch\(|XMLHttpRequest|WebSocket/);
  assert.match(app, /text\.textContent = message/);
  assert.match(app, /target\.textContent = message/);
});

test('les supports de production et de récupération existent', () => {
  for (const file of ['404.html', 'package-lock.json', 'sitemap.xml', 'robots.txt', 'favicon.svg', 'site.webmanifest']) assert.equal(exists(file), true, `${file} absent`);
  const pkg = JSON.parse(read('package.json'));
  for (const script of ['check:assets', 'check:links', 'check:security', 'health', 'verify']) assert.equal(typeof pkg.scripts[script], 'string', `${script} absent`);
});

test('les alternatives textuelles et la préférence de réduction des mouvements sont déclarées', () => {
  for (const image of html.matchAll(/<img\b([^>]+)>/gi)) assert.match(image[1], /\balt="[^"]*"/i);
  assert.match(read('theme.css'), /prefers-reduced-motion/);
  assert.match(read('motion.css'), /prefers-reduced-motion/);
  assert.match(html, /class="skip-link"/);
});
