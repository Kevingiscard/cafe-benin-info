import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const shouldCheckExternal = process.argv.includes('--external');
const sourceFiles = ['index.html', 'motion.js', 'content-sources.md'];
const refs = new Set();
const failures = [];
const warnings = [];
const ignoredExternalOrigins = new Set(['https://fonts.googleapis.com', 'https://fonts.gstatic.com']);
const ok = message => console.log(`✓ ${message}`);
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };

for (const file of sourceFiles) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of content.matchAll(/(?:href|src)=["']([^"']+)["']|\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/gi)) refs.add(match[1] || match[2]);
}

const isExternal = ref => /^https?:\/\//i.test(ref);
const internal = [...refs].filter(ref => ref && !isExternal(ref) && !ref.startsWith('#') && !ref.startsWith('mailto:'));
for (const ref of internal) {
  const local = ref.split('#')[0].split('?')[0].replace(/^\.\//, '');
  if (!local) continue;
  fs.existsSync(path.join(root, local)) ? ok(`Lien local OK : ${local}`) : fail(`Lien local absent : ${local}`);
}

const request = async (url, attempt = 1) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'CafeBeninLinkCheck/1.0' } });
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, attempt * 1_500));
      return request(url, attempt + 1);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
};

if (shouldCheckExternal) {
  for (const ref of [...refs].filter(ref => isExternal(ref) && !ignoredExternalOrigins.has(ref)).sort()) {
    try {
      const response = await request(ref);
      if ([404, 410].includes(response.status)) fail(`Lien externe définitivement indisponible : ${response.status} ${ref}`);
      else if (!response.ok) warnings.push(`Lien externe à surveiller : ${response.status} ${ref}`);
      else ok(`Lien externe OK : ${response.status} ${ref}`);
    } catch (error) {
      warnings.push(`Lien externe non vérifiable après relances : ${ref} (${error.name})`);
    }
  }
} else {
  ok('Liens externes réservés au contrôle planifié (--external).');
}

warnings.forEach(message => console.warn(`! ${message}`));
if (failures.length) process.exit(1);
