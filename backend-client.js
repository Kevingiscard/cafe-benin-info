/**
 * Café Bénin — Backend Client v4
 * Same-origin API on Vercel with a configurable fallback for static hosting.
 */

const cafeBenin = (() => {
  const API_ORIGIN = String(window.CAFE_BENIN_API_URL || '').replace(/\/$/, '');
  const FALLBACK_ORIGIN = 'https://cafe-benin-info.vercel.app';
  const BASE_URL = API_ORIGIN || (window.location.hostname.endsWith('.github.io') ? FALLBACK_ORIGIN : '');
  const REQUEST_TIMEOUT_MS = 20000;

  async function fetchAPI(endpoint, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const headers = new Headers(options.headers || {});
      if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');

      const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
        ...options,
        headers,
        signal: options.signal || controller.signal,
        credentials: 'omit'
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};

      if (!res.ok) throw new Error(data.error || `Erreur HTTP ${res.status}`);
      return data;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('La requête a expiré. Réessayez.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    async getEncyclopedia(category = null) {
      const params = category ? `?category=${encodeURIComponent(category)}` : '';
      const data = await fetchAPI(`encyclopedia${params}`);
      return data.articles || [];
    },

    async searchDictionary(query = '') {
      const params = query ? `?q=${encodeURIComponent(query)}` : '';
      const data = await fetchAPI(`dictionary${params}`);
      return data.terms || [];
    },

    async submitComment(name, email, content, section = null, rating = null) {
      return fetchAPI('comments', {
        method: 'POST',
        body: JSON.stringify({ name, email, content, section, rating })
      });
    },

    async getComments() {
      const data = await fetchAPI('comments');
      return data.comments || [];
    },

    async getAIRecommendation(mood, preferences = [], excludes = []) {
      const data = await fetchAPI('ai', {
        method: 'POST',
        body: JSON.stringify({ mood, preferences, excludes })
      });
      return data.recommendation || '';
    },

    async chat(messages) {
      const data = await fetchAPI('chat', {
        method: 'POST',
        body: JSON.stringify({ messages })
      });
      return data;
    },

    async askOllama(prompt, model = null) {
      const body = model ? { prompt, model } : { prompt };
      return fetchAPI('ollama', { method: 'POST', body: JSON.stringify(body) });
    }
  };
})();

// app-v3.js consumes the client from the browser global namespace.
window.cafeBenin = cafeBenin;
if (typeof module !== 'undefined') module.exports = cafeBenin;
