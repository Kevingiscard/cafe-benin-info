import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules']);
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile()) files.push(absolute);
  }
};
walk(root);

const failures = [];
const warn = [];
const fail = message => { failures.push(message); console.error(`✖ ${message}`); };
const ok = message => console.log(`✓ ${message}`);
const signatures = [
  { label: 'clé privée', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: 'jeton GitHub', regex: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
  { label: 'clé Google', regex: /AIza[\w-]{20,}/ },
  { label: 'clé AWS', regex: /AKIA[0-9A-Z]{16}/ },
  { label: 'clé Stripe', regex: /sk_(?:live|test)_[A-Za-z0-9]{16,}/ }
];
const runtimeFiles = new Set(['app.js', 'dictionary-v4.js', 'local-assistant.js', 'motion.js']);

for (const file of files) {
  if (!/\.(?:css|html|js|json|md|mjs|txt|ya?ml)$/i.test(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const signature of signatures) if (signature.regex.test(content)) fail(`${signature.label} détecté dans ${path.relative(root, file)}`);
  if (runtimeFiles.has(path.relative(root, file)) && /\beval\(|new Function|document\.write/.test(content)) fail(`Primitive JavaScript dangereuse détectée dans ${path.relative(root, file)}`);
}

const audit = spawnSync('npm', ['audit', '--omit=dev', '--audit-level=high', '--json'], { cwd: root, encoding: 'utf8' });
if (audit.status !== 0) {
  try {
    const result = JSON.parse(audit.stdout);
    const vulnerabilities = result.metadata?.vulnerabilities || {};
    if ((vulnerabilities.critical || 0) + (vulnerabilities.high || 0) > 0) fail(`npm audit signale ${vulnerabilities.critical || 0} vulnérabilité(s) critique(s) et ${vulnerabilities.high || 0} élevée(s).`);
    else warn.push('npm audit a retourné un état non nul sans vulnérabilité haute ou critique exploitable.');
  } catch {
    warn.push('npm audit n’a pas produit de rapport JSON exploitable.');
  }
} else ok('npm audit ne signale aucune vulnérabilité haute ou critique.');

ok('Scan statique des secrets et primitives dangereuses terminé.');
warn.forEach(message => console.warn(`! ${message}`));
if (failures.length) process.exit(1);
