import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const motion = fs.readFileSync(path.join(root, 'motion.js'), 'utf8');
const failures = [];
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };
const ok = message => console.log(`✓ ${message}`);

if ((html.match(/<h1\b/gi) || []).length !== 1) fail('La page doit posséder exactement un H1.');
if (!/<main\b[^>]*id="accueil"/i.test(html)) fail('Landmark main absent.');
if (!/<a[^>]*class="skip-link"[^>]*href="#accueil"/i.test(html)) fail('Lien d’évitement vers le contenu principal absent.');
if (!/id="site-nav"/.test(html) || !/aria-label="Navigation principale"/.test(html)) fail('Navigation principale insuffisamment nommée.');
if (!/id="mobile-nav"[^>]*aria-hidden="true"/.test(html) || !/id="nav-toggle"[^>]*aria-expanded="false"/.test(html)) fail('Menu mobile sans état ARIA initial sûr.');
if (!/id="search-modal"[^>]*role="dialog"[^>]*aria-modal="true"/.test(html)) fail('Recherche globale sans sémantique de dialogue.');
if (!/id="comment-status"[^>]*aria-live="polite"/.test(html)) fail('Retour du formulaire non annoncé.');

const labels = new Set([...html.matchAll(/<label\s+for="([^"]+)"/gi)].map(match => match[1]));
for (const match of html.matchAll(/<(input|textarea|select)\b([^>]*)>/gi)) {
  const attrs = match[2];
  const id = attrs.match(/\bid="([^"]+)"/i)?.[1];
  const labelled = /aria-label="[^"]+"/i.test(attrs) || /aria-labelledby="[^"]+"/i.test(attrs);
  if (id && !labels.has(id) && !labelled) fail(`Champ sans étiquette : #${id}`);
}
for (const image of `${html}\n${motion}`.matchAll(/<img\b([^>]+)>/gi)) {
  if (!/\balt="[^"]*"/i.test(image[1])) fail('Image sans texte alternatif.');
}
for (const button of html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gis)) {
  const attrs = button[1];
  const text = button[2].replace(/<[^>]*>/g, '').trim();
  if (!text && !/aria-label="[^"]+"/i.test(attrs)) fail('Bouton sans nom accessible.');
}
for (const css of ['theme.css', 'motion.css', 'styles.css']) {
  if (!fs.readFileSync(path.join(root, css), 'utf8').includes('prefers-reduced-motion')) fail(`${css} ne respecte pas prefers-reduced-motion.`);
}
if (!/:focus-visible/.test(fs.readFileSync(path.join(root, 'theme.css'), 'utf8'))) fail('Indicateur de focus visible absent.');
ok('Structure, libellés, alternatives, focus et mouvement réduit vérifiés.');
if (failures.length) process.exit(1);
