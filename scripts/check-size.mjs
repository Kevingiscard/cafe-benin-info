import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const groups = {
  html: { files: ['index.html', '404.html'], limit: 180_000 },
  css: { files: ['styles.css', 'v4.css', 'motion.css', 'theme.css', 'observatoire.css', 'professionnels.css', 'cookie-consent.css', 'redesign.css'], limit: 230_000 },
  javascript: { files: ['app.js', 'sw.js', 'dictionary-v4.js', 'local-assistant.js', 'motion.js', 'observatoire.js', 'cookie-consent.js', 'form-guard.js', 'https-redirect.js', 'redesign.js', 'data/coffee-observatory.js'], limit: 480_000 }
};
const failures = [];
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };
const ok = message => console.log(`✓ ${message}`);
for (const [name, group] of Object.entries(groups)) {
  const size = group.files.reduce((total, file) => total + fs.statSync(path.join(root, file)).size, 0);
  if (size > group.limit) fail(`${name} dépasse son budget : ${size} octets, limite ${group.limit}.`);
  else ok(`${name} : ${size} octets, budget ${group.limit}.`);
}
if (failures.length) process.exit(1);
