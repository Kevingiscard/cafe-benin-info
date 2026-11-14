'use strict';

const SHELL_CACHE = 'cafe-benin-shell-v1';
const RUNTIME_CACHE = 'cafe-benin-runtime-v1';
const MAX_RUNTIME_ENTRIES = 140;
const scopeUrl = new URL(self.registration.scope);
const shellFiles = [
  './', './index.html', './site.webmanifest', './favicon.svg', './404.html',
  './styles.css', './v4.css', './motion.css', './theme.css', './polish.css',
  './portal.css', './app.js', './dictionary-v4.js', './local-assistant.js',
  './explorer.js', './map.js', './tools.js', './sitemap.xml'
];

function isInsideScope(url) {
  return url.origin === scopeUrl.origin && url.pathname.startsWith(scopeUrl.pathname);
}

function isCacheable(response) {
  return response && response.status === 200 && (response.type === 'basic' || response.type === 'default');
}

async function saveResponse(cacheName, request, response) {
  if (!isCacheable(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  if (cacheName === RUNTIME_CACHE) await trimRuntimeCache(cacheName);
}

async function trimRuntimeCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= MAX_RUNTIME_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_RUNTIME_ENTRIES).map(key => cache.delete(key)));
}

async function precacheOne(cache, url) {
  try {
    const request = new Request(url, { cache: 'reload', credentials: 'same-origin' });
    const response = await fetch(request);
    if (isCacheable(response)) await cache.put(request, response);
  } catch {
    // Une ressource secondaire indisponible ne doit pas empêcher l'installation PWA.
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.all(shellFiles.map(file => precacheOne(cache, new URL(file, scopeUrl).href)));

    try {
      const sitemapResponse = await fetch(new URL('sitemap.xml', scopeUrl));
      if (sitemapResponse.ok) {
        const xml = await sitemapResponse.text();
        const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
          .map(match => {
            try { return new URL(match[1].trim(), scopeUrl); } catch { return null; }
          })
          .filter(url => url && isInsideScope(url) && url.origin === scopeUrl.origin);
        await Promise.all(urls.map(url => precacheOne(cache, url.href)));
      }
    } catch {
      // Le cache applicatif essentiel reste disponible sans sitemap.
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('cafe-benin-') && ![SHELL_CACHE, RUNTIME_CACHE].includes(name))
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (isCacheable(response)) await saveResponse(RUNTIME_CACHE, request, response);
    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const home = await caches.match(scopeUrl.href) || await caches.match(new URL('index.html', scopeUrl).href);
    if (home) return home;
    return new Response(
      '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Hors ligne · Café Bénin</title><main><h1>Connexion indisponible</h1><p>Cette page n’a pas encore été mise en cache. Revenez à l’accueil lorsque la connexion sera rétablie.</p></main></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  const update = fetch(request).then(async response => {
    if (isCacheable(response)) await saveResponse(RUNTIME_CACHE, request, response);
    return response;
  });
  if (cached) {
    // Met à jour le cache en arrière-plan sans bloquer l'affichage.
    update.catch(() => {});
    return cached;
  }
  try { return await update; }
  catch {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension:')) return;
  const url = new URL(request.url);
  if (!isInsideScope(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (['style', 'script', 'image', 'font', 'manifest'].includes(request.destination) ||
      /\.(?:css|js|mjs|svg|png|jpe?g|webp|avif|woff2?|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
