import fs from 'node:fs';

const base = new URL(process.env.SITE_URL || 'https://kevingiscard.github.io/cafe-benin-info/');
const reportPath = process.env.REPORT_PATH;
const attempts = Number(process.env.HEALTH_ATTEMPTS || 3);
const delay = Number(process.env.HEALTH_RETRY_DELAY_MS || 2_500);
const relativeUrl = relative => new URL(relative, base).href;
const failures = [];
const results = [];
const record = (name, passed, detail) => {
  results.push({ name, passed, detail, checkedAt: new Date().toISOString() });
  console.log(`${passed ? '✓' : '✖'} ${name} — ${detail}`);
  if (!passed) failures.push(`${name}: ${detail}`);
};

const fetchWithRetry = async (url, attempt = 1) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'CafeBeninHealthCheck/1.0' } });
    if ((response.status === 429 || response.status >= 500) && attempt < attempts) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
      return fetchWithRetry(url, attempt + 1);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
};

const checkAsset = async relative => {
  const url = relativeUrl(relative);
  try {
    const response = await fetchWithRetry(url);
    record(relative, response.ok, `HTTP ${response.status}`);
  } catch (error) {
    record(relative, false, `${error.name}: ${error.message}`);
  }
};

try {
  const started = Date.now();
  const response = await fetchWithRetry(base.href);
  const page = await response.text();
  record('homepage', response.ok && page.includes('Café Bénin'), `HTTP ${response.status}, ${Date.now() - started} ms`);
  for (const required of ['id="dictionnaire"', 'id="cafebot"', 'id="benin"', 'id="sources"', 'id="coffee-shops"']) {
    record(`contenu ${required}`, page.includes(required), page.includes(required) ? 'présent' : 'absent');
  }
} catch (error) {
  record('homepage', false, `${error.name}: ${error.message}`);
}

for (const relative of ['theme.css?v=3', 'app.js?v=2', 'dictionary-v4.js', 'local-assistant.js', 'favicon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'img/hero-bg.jpg', 'img/benin-coffee-dawn.jpg']) await checkAsset(relative);

const report = { base: base.href, passed: failures.length === 0, failures, results, finishedAt: new Date().toISOString() };
if (reportPath) fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) process.exit(1);
