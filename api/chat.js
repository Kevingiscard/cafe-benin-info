/** Café Bénin — production chatbot endpoint. */
const { GoogleGenAI } = require('@google/genai');
const { setCors } = require('../lib/cors');

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

const systemPrompt = `Tu es CaféBot, l'assistant expert du portail Café Bénin.
Tu peux expliquer le café, sa botanique, sa transformation, ses méthodes de préparation,
son histoire et les informations documentées sur la filière béninoise.
Ne présente jamais une information non vérifiée comme un fait local. Pour les prix, données
récentes, santé ou informations réglementaires, indique clairement les limites et recommande
une source officielle ou scientifique. Réponds en français, de façon claire et concise.`;

function normalizeMessages(messages, question) {
  const raw = Array.isArray(messages) ? messages : [{ role: 'user', content: question }];
  if (!raw.length || raw.length > MAX_MESSAGES) throw new Error('Historique de conversation invalide.');

  return raw.map(message => {
    const role = message?.role === 'assistant' ? 'assistant' : 'user';
    const content = String(message?.content || '').trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) throw new Error('Message invalide ou trop long.');
    return { role, content };
  });
}

module.exports = async function handler(req, res) {
  setCors(req, res, 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const messages = normalizeMessages(req.body?.messages, req.body?.question);
    const ollamaUrl = process.env.OLLAMA_URL;
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';

    // Optional Ollama path. On Vercel, do not default to localhost: it only adds latency.
    if (ollamaUrl) {
      try {
        const response = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            stream: false
          }),
          signal: AbortSignal.timeout(8000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data.message?.content) {
            return res.status(200).json({ reply: data.message.content, source: 'ollama', model: ollamaModel });
          }
        }
      } catch (_) {}
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Aucun moteur IA n’est configuré.', reply: 'CaféBot est temporairement indisponible.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const transcript = messages.map(m => `${m.role === 'assistant' ? 'CaféBot' : 'Utilisateur'}: ${m.content}`).join('\n');
    const interaction = await ai.interactions.create({
      model: MODEL,
      input: `${systemPrompt}\n\nConversation:\n${transcript}\n\nRéponds au dernier message de l'utilisateur.`
    });
    const reply = String(interaction.output_text || '').trim();
    if (!reply) throw new Error('Réponse IA vide.');

    return res.status(200).json({
      reply,
      source: 'gemini',
      model: MODEL
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Requête invalide.' });
  }
};
