/**
 * Café Bénin — Backend Client v3.0
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

    /**
     * Recommandation café par humeur
     * Utilise Ollama en priorité, Gemini en fallback
     * @param {string} mood - Ex: "fatigué", "joyeux", "concentré"
     * @param {string[]} preferences - Ex: ["fort", "épicé"]
     * @param {string[]} excludes - Ex: ["sucré"]
     */
    async getAIRecommendation(mood, preferences = [], excludes = []) {
      const data = await fetchAPI('ai', {
        method: 'POST',
        body: JSON.stringify({ mood, preferences, excludes })
      });
      return data.recommendation;
    },

    /**
     * Chat conversationnel avec CaféBot (Ollama/Gemini)
     * @param {Array<{role: string, content: string}>} messages - Historique
     * @returns {Promise<{reply: string, source: string, model: string}>}
     */
    async chat(messages) {
      return fetchAPI('chat', {
        method: 'POST',
        body: JSON.stringify({ messages })
      });
    },

    /**
     * Appel direct Ollama (prompt simple)
     * @param {string} prompt
     * @param {string} [model] - Modèle Ollama optionnel
     */
    async askOllama(prompt, model = null) {
      const body = model ? { prompt, model } : { prompt };
      return fetchAPI('ollama', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    }
  };
})();

// Export pour modules ES6
if (typeof module !== 'undefined') module.exports = cafeBenin;
