/**
 * Café Bénin — Backend Client v2.0
 * Connecte le frontend aux Vercel Serverless Functions
 */

const cafeBenin = (() => {
  // En production: URL Vercel. En local: localhost:3000
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
    /** Récupère les articles encyclopédie */
    async getEncyclopedia(category = null) {
      const params = category ? `?category=${encodeURIComponent(category)}` : '';
      const data = await fetchAPI(`encyclopedia${params}`);
      return data.articles;
    },

    /** Recherche dans le dictionnaire */
    async searchDictionary(query = '') {
      const params = query ? `?q=${encodeURIComponent(query)}` : '';
      const data = await fetchAPI(`dictionary${params}`);
      return data.terms;
    },

    /** Soumet un commentaire */
    async submitComment(name, email, content, section = null, rating = null) {
      return fetchAPI('comments', {
        method: 'POST',
        body: JSON.stringify({ name, email, content, section, rating })
      });
    },

    /** Récupère les commentaires approuvés */
    async getComments() {
      const data = await fetchAPI('comments');
      return data.comments;
    },

    /** Obtient une recommandation IA Gemini */
    async getAIRecommendation(mood, preferences = [], excludes = []) {
      const data = await fetchAPI('ai', {
        method: 'POST',
        body: JSON.stringify({ mood, preferences, excludes })
      });
      return data.recommendation;
    }
  };
})();

// Export pour modules ES6
if (typeof module !== 'undefined') module.exports = cafeBenin;
