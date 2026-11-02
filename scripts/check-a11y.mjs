import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html') && file !== '404.html');
const motion = fs.readFileSync(path.join(root, 'motion.js'), 'utf8');
const dictionary = fs.readFileSync(path.join(root, 'dictionary-v4.js'), 'utf8');
const failures = [];
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };
const ok = message => console.log(`✓ ${message}`);

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if ((html.match(/<h1\b/gi) || []).length !== 1) fail(`${file}: la page doit posséder exactement un H1.`);
  if (!/<main\b/i.test(html)) fail(`${file}: landmark main absent.`);
  if (!/<a[^>]*class="skip-link"[^>]*href="#(?:main|accueil)"/i.test(html)) fail(`${file}: lien d’évitement absent.`);
  if (!/<nav[^>]*aria-label="Navigation principale"/i.test(html)) fail(`${file}: navigation principale insuffisamment nommée.`);
  if (!/<nav[^>]*id="mobile-nav"[^>]*aria-hidden="true"/i.test(html)) fail(`${file}: menu mobile sans état ARIA initial sûr.`);
  if (!/<button[^>]*id="nav-toggle"[^>]*aria-expanded="false"/i.test(html)) fail(`${file}: déclencheur mobile sans état initial sûr.`);
  if (!/<div[^>]*id="search-modal"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-label="Recherche globale"/i.test(html)) fail(`${file}: recherche globale sans nom accessible.`);
  if (html.includes('id="comment-form"') && !/id="comment-status"[^>]*aria-live="polite"/i.test(html)) fail(`${file}: retour de contribution non annoncé.`);
  const labels = new Set([...html.matchAll(/<label\s+for="([^"]+)"/gi)].map(match => match[1]));
  for (const match of html.matchAll(/<(input|textarea|select)\b([^>]*)>/gi)) {
    const attrs = match[2];
    const id = attrs.match(/\bid="([^"]+)"/i)?.[1];
    const wrapped = id && new RegExp(`<label\\b[^>]*>[\\s\\S]{0,500}\\bid="${id}"`, 'i').test(html);
    const labelled = /aria-label="[^"]+"/i.test(attrs) || /aria-labelledby="[^"]+"/i.test(attrs) || wrapped;
    if (id && !labels.has(id) && !labelled) fail(`${file}: champ sans étiquette : #${id}.`);
  }
  for (const image of html.matchAll(/<img\b([^>]+)>/gi)) if (!/\balt="[^"]*"/i.test(image[1])) fail(`${file}: image sans texte alternatif.`);
  for (const button of html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gis)) {
    const attrs = button[1];
    const text = button[2].replace(/<[^>]*>/g, '').trim();
    if (!text && !/aria-label="[^"]+"/i.test(attrs)) fail(`${file}: bouton sans nom accessible.`);
  }
}

for (const image of `${motion}\n${dictionary}`.matchAll(/<img\b([^>]+)>/gi)) if (!/\balt="[^\"]*"/i.test(image[1])) fail('Image injectée par JavaScript sans texte alternatif.');
for (const css of ['theme.css', 'motion.css', 'styles.css']) {
  if (!fs.readFileSync(path.join(root, css), 'utf8').includes('prefers-reduced-motion')) fail(`${css} ne respecte pas prefers-reduced-motion.`);
}
if (!/:focus-visible/.test(fs.readFileSync(path.join(root, 'theme.css'), 'utf8'))) fail('Indicateur de focus visible absent.');
ok(`${pages.length} pages et les composants injectés : structure, libellés, alternatives, focus et mouvement réduit vérifiés.`);
if (failures.length) process.exit(1);
