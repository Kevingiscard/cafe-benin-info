import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const imgRoot = path.join(root, 'img');
const critical = new Map([
  ['img/hero-bg.jpg', 3_200_000],
  ['img/benin-coffee-dawn.jpg', 500_000],
  ['img/ethiopian-coffee-ceremony-ccby.jpg', 500_000],
  ['img/coffee_shop_cotonou.webp', 1_200_000]
]);
const supported = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp']);
const generalLimit = 1_300_000;
const totalLimit = 7_000_000;
const failures = [];
const warnings = [];
const ok = message => console.log(`✓ ${message}`);
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };

if (!fs.existsSync(imgRoot)) fail('Répertoire img absent.');
const files = fs.existsSync(imgRoot) ? fs.readdirSync(imgRoot, { recursive: true }).filter(file => {
  const absolute = path.join(imgRoot, file);
  return fs.statSync(absolute).isFile();
}) : [];
let total = 0;
for (const file of files) {
  const relative = path.posix.join('img', file.split(path.sep).join('/'));
  const size = fs.statSync(path.join(imgRoot, file)).size;
  total += size;
  const extension = path.extname(file).toLowerCase();
  if (!supported.has(extension)) fail(`Format média non contrôlé : ${relative}`);
  const limit = critical.get(relative) ?? generalLimit;
  if (size > limit) fail(`Asset trop lourd : ${relative} (${size} octets, budget ${limit}).`);
}
for (const file of critical.keys()) if (!fs.existsSync(path.join(root, file))) fail(`Asset critique absent : ${file}`);
if (total > totalLimit) fail(`Poids total des images trop élevé : ${total} octets, budget ${totalLimit}.`);
if (files.length < 6) warnings.push('Nombre de médias étonnamment faible : vérifier les visuels éditoriaux.');
ok(`${files.length} assets contrôlés, ${total} octets au total.`);
warnings.forEach(message => console.warn(`! ${message}`));
if (failures.length) process.exit(1);
