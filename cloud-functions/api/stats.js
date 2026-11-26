import { getStore } from '@edgeone/pages-blob';

// Compteurs, votes, signalements et avis modérés pour Café Bénin.
// Aucune donnée personnelle conservée : ni IP, ni e-mail, ni identifiant de visiteur.
const PAGE = /^(?:index|[a-z0-9][a-z0-9-]{0,60})\.html$/;
const DAILY_VIEW_CAP = 8000;
const DAILY_WRITE_CAP = 400;
const MAX_REVIEW = 500;
const recent = new Map();

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-store' }
});
const today = () => new Date().toISOString().slice(0, 10);

function limited(request, key, max, windowMs) {
  // Mémoire de l'instance seulement, jamais enregistrée.
  const ip = (request.headers.get('x-forwarded-for') || request.headers.get('eo-connecting-ip') || 'x').split(',')[0].trim();
  const id = key + '|' + ip;
  const now = Date.now();
  const list = (recent.get(id) || []).filter(t => now - t < windowMs);
  if (list.length >= max) { recent.set(id, list); return true; }
  list.push(now); recent.set(id, list);
  if (recent.size > 3000) recent.clear();
  return false;
}

function cleanText(value, max) {
  return String(value || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}
function hasPersonalOrSpam(text) {
  return /https?:\/\/|www\.|@[\w.-]+\.[a-z]{2,}|\b\+?\d[\d .-]{7,}\d\b|\.(com|ru|cn|xyz|top)\b/i.test(text)
    || /(.)\1{9,}/.test(text);
}
const slugOf = page => (PAGE.test(String(page || '')) ? String(page) : null);

async function readJson(store, key, fallback) {
  try { const v = await store.get(key, { type: 'json', consistency: 'strong' }); return v || fallback; } catch { return fallback; }
}

async function bumpDay(store, kind, cap) {
  const key = 'quota/' + today() + '-' + kind + '.json';
  const q = await readJson(store, key, { n: 0 });
  if (q.n >= cap) return false;
  q.n += 1;
  await store.setJSON(key, q);
  return true;
}

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const store = getStore('cafe-benin-stats');
  try {
    if (request.method === 'GET') {
      const action = url.searchParams.get('action') || 'get';
      if (action === 'top') {
        const views = await readJson(store, 'views.json', {});
        const top = Object.entries(views).filter(([k]) => PAGE.test(k) && k !== 'index.html')
          .map(([k, v]) => ({ page: k, views: v.n || 0, title: v.t || k }))
          .sort((a, b) => b.views - a.views).slice(0, 8);
        return json({ top });
      }
      const page = slugOf(url.searchParams.get('page'));
      if (!page) return json({ error: 'page' }, 400);
      const views = await readJson(store, 'views.json', {});
      const votes = await readJson(store, 'votes/' + page + '.json', { up: 0, down: 0 });
      const reviews = await readJson(store, 'approved/' + page + '.json', []);
      return json({ views: (views[page] || {}).n || 0, up: votes.up, down: votes.down, reviews: reviews.slice(-10) });
    }
    if (request.method !== 'POST') return json({ error: 'method' }, 405);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'json' }, 400); }
    const page = slugOf(body.page);
    if (!page) return json({ error: 'page' }, 400);
    if (body.website) return json({ ok: true }); // piège anti-robot : champ caché rempli

    if (body.action === 'view') {
      if (limited(request, 'view', 30, 60000)) return json({ ok: false, limited: true });
      if (!(await bumpDay(store, 'view', DAILY_VIEW_CAP))) return json({ ok: false, capped: true });
      const views = await readJson(store, 'views.json', {});
      const entry = views[page] || { n: 0, t: '' };
      entry.n += 1;
      const title = cleanText(body.title, 90);
      if (title) entry.t = title;
      views[page] = entry;
      await store.setJSON('views.json', views);
      return json({ ok: true, views: entry.n });
    }
    if (body.action === 'vote') {
      if (limited(request, 'vote', 6, 3600000)) return json({ error: 'limit' }, 429);
      if (body.v !== 'up' && body.v !== 'down') return json({ error: 'v' }, 400);
      if (!(await bumpDay(store, 'write', DAILY_WRITE_CAP))) return json({ error: 'cap' }, 429);
      const votes = await readJson(store, 'votes/' + page + '.json', { up: 0, down: 0 });
      votes[body.v] += 1;
      await store.setJSON('votes/' + page + '.json', votes);
      return json({ ok: true, up: votes.up, down: votes.down });
    }
    if (body.action === 'report' || body.action === 'review') {
      if (limited(request, body.action, 3, 3600000)) return json({ error: 'limit' }, 429);
      const text = cleanText(body.text, MAX_REVIEW);
      const name = cleanText(body.name, 30);
      if (text.length < 10) return json({ error: 'short' }, 400);
      if (hasPersonalOrSpam(text) || hasPersonalOrSpam(name)) return json({ error: 'filtered' }, 400);
      if (!(await bumpDay(store, 'write', DAILY_WRITE_CAP))) return json({ error: 'cap' }, 429);
      const id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      await store.setJSON('pending/' + body.action + '-' + id + '.json', { id, kind: body.action, page, name, text, at: new Date().toISOString() });
      return json({ ok: true, pending: true });
    }
    return json({ error: 'action' }, 400);
  } catch (error) {
    return json({ ok: false, error: 'unavailable' }, 200);
  }
}
