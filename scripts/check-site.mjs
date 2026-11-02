import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://kevingiscard.github.io/cafe-benin-info/';
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html') && file !== '404.html');
const failures = [];
const warnings = [];
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };
const ok = message => console.log(`✓ ${message}`);
const exists = file => fs.existsSync(path.join(root, file));

if (!pages.length) fail('Aucune page HTML principale détectée.');

for (const file of pages.sort()) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const label = file;
  if (!/<html[^>]+lang="fr"/i.test(html)) fail(`${label}: lang="fr" absent.`);
  if (!/<title>[^<]{20,}<\/title>/i.test(html)) fail(`${label}: titre trop court ou absent.`);
  if (!/<meta[^>]+name="description"[^>]+content="[^"]{50,}"/i.test(html)) fail(`${label}: meta description absente ou trop courte.`);
  if (!/<link[^>]+rel="canonical"[^>]+href="https:\/\/kevingiscard\.github\.io\/cafe-benin-info\//i.test(html)) fail(`${label}: canonical GitHub Pages absente.`);
  if (!/<main\b/i.test(html)) fail(`${label}: landmark main absent.`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) fail(`${label}: la page doit avoir exactement un H1.`);
  if (!/<meta[^>]+property="og:image:alt"/i.test(html)) warnings.push(`${label}: og:image:alt absent.`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/gi)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${label}: identifiant(s) dupliqué(s) : ${[...new Set(duplicates)].join(', ')}.`);
  for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt="[^"]*"/i.test(image[1])) fail(`${label}: image sans alt.`);
  }
  for (const link of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = link[1];
    if (/target="_blank"/i.test(attrs) && !/rel="[^"]*\bnoopener\b[^"]*"/i.test(attrs)) fail(`${label}: lien target=_blank sans noopener.`);
  }
  const localRefs = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/gi)) {
    const ref = match[1].split('#')[0].split('?')[0];
    if (!ref || ref.startsWith('#') || /^(https?:|mailto:|javascript:|data:)/i.test(ref)) continue;
    localRefs.add(ref.replace(/^\.\//, ''));
  }
  for (const ref of localRefs) if (!exists(ref)) fail(`${label}: ressource locale absente : ${ref}.`);
  ok(`${label}: structure et ressources vérifiées.`);
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const page of pages) {
  const expected = `${origin}${page === 'index.html' ? '' : page}`;
  if (!sitemap.includes(`<loc>${expected}</loc>`)) fail(`sitemap.xml: page absente : ${expected}`);
}
if (!fs.existsSync(path.join(root, 'a-propos.html'))) fail('Page auteur absente.');
if (warnings.length) warnings.forEach(message => console.warn(`! ${message}`));
if (failures.length) process.exit(1);
ok(`${pages.length} pages principales contrôlées sans erreur.`);
