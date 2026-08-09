/**
 * Café Bénin — Backend Client v3.1
 * Connecte le frontend aux Vercel Serverless Functions
 * Supporte Ollama local + Gemini fallback
 */

const cafeBenin = (() => {
  const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://cafe-benin-info.vercel.app';

  async function fetchAPI(endpoint, options = {}) {
    const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Erreur HTTP ${res.status}`);
    }
    return res.json();
  }

  return {
    async getEncyclopedia(category = null) {
      const params = category ? `?category=${encodeURIComponent(category)}` : '';
      const data = await fetchAPI(`encyclopedia${params}`);
      return data.articles;
    },

    async searchDictionary(query = '') {
      const params = query ? `?q=${encodeURIComponent(query)}` : '';
      const data = await fetchAPI(`dictionary${params}`);
      return data.terms;
    },

    async submitComment(name, email, content, section = null, rating = null) {
      return fetchAPI('comments', {
        method: 'POST',
        body: JSON.stringify({ name, email, content, section, rating })
      });
    },

    async getComments() {
      const data = await fetchAPI('comments');
      return data.comments;
    },

    async getAIRecommendation(mood, preferences = [], excludes = []) {
      const data = await fetchAPI('ai', {
        method: 'POST',
        body: JSON.stringify({ mood, preferences, excludes })
      });
      return data.recommendation;
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
      return fetchAPI('ollama', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    }
  };
})();

if (typeof module !== 'undefined') module.exports = cafeBenin;

/* Progressive V2 enhancements. Loaded from the existing backend-client hook so
 * no existing HTML structure has to be replaced. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('script');
    s.src = 'v2-enhancements.js';
    s.defer = true;
    document.body.appendChild(s);
  }, { once: true });
} else {
  const s = document.createElement('script');
  s.src = 'v2-enhancements.js';
  s.defer = true;
  document.body.appendChild(s);
}
