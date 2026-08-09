/** Café Bénin — recommendation endpoint. */
const { GoogleGenAI } = require('@google/genai');
const { setCors } = require('../lib/cors');

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const clean = (value, max = 300) => String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);

export default async function handler(req, res) {
  setCors(req, res, 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const mood = clean(req.body?.mood, 200);
  const preferences = Array.isArray(req.body?.preferences) ? req.body.preferences.slice(0, 8).map(v => clean(v, 100)).filter(Boolean) : [];
  const excludes = Array.isArray(req.body?.excludes) ? req.body.excludes.slice(0, 8).map(v => clean(v, 100)).filter(Boolean) : [];
  if (!mood) return res.status(400).json({ error: 'mood requis' });

  const prompt = `Tu es un expert du café béninois.\nHumeur: ${mood}\nPréférences: ${preferences.join(', ') || 'aucune'}\nÀ éviter: ${excludes.join(', ') || 'rien'}\n\nRecommande 2 à 3 options de café adaptées. N’invente pas l’existence d’un producteur, d’une marque ou d’un café béninois précis si tu n’en as pas la certitude. Si les données locales sont insuffisantes, formule la réponse comme une suggestion générale. Réponds en français, brièvement.`;

  const ollamaUrl = process.env.OLLAMA_URL;
  if (ollamaUrl) {
    try {
      const response = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'llama3.2', prompt, stream: false }),
        signal: AbortSignal.timeout(8000)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.response) return res.status(200).json({ recommendation: data.response, source: 'ollama', model: process.env.OLLAMA_MODEL || 'llama3.2' });
      }
    } catch (_) {}
  }

  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Aucun moteur IA n’est configuré.' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
    return res.status(200).json({ recommendation: response.text || '', source: 'gemini', model: MODEL });
  } catch (_) {
    return res.status(502).json({ error: 'Le service IA est temporairement indisponible.' });
  }
}
