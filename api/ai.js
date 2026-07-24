/**
 * api/ai.js — Recommandation café par humeur
 * Stratégie: Ollama local d'abord → fallback Gemini
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { mood, preferences = [], excludes = [] } = req.body;
  if (!mood) return res.status(400).json({ error: 'mood requis' });

  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  const prompt = `Tu es un expert en café béninois.
Un client cherche un café avec l'humeur: "${mood}".
Préférences: ${preferences.join(', ') || 'aucune'}.
À éviter: ${excludes.join(', ') || 'rien'}.
Recommande 2-3 cafés béninois spécifiques avec une description courte. Réponds en français, de façon concise.`;

  // 1. Essai Ollama
  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      signal: AbortSignal.timeout(25000)
    });
    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      return res.status(200).json({
        recommendation: data.response,
        source: 'ollama',
        model: OLLAMA_MODEL
      });
    }
  } catch (_) { /* fallback */ }

  // 2. Fallback Gemini
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Aucune IA disponible (OLLAMA_URL ou GEMINI_API_KEY requis)' });

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return res.status(200).json({
      recommendation: result.response.text(),
      source: 'gemini',
      model: 'gemini-1.5-flash'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur IA: ' + error.message });
  }
}
