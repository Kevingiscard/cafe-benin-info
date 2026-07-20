const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { mood, preferences = [], excludes = [] } = req.body;
  if (!mood) return res.status(400).json({ error: 'mood requis' });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Clé Gemini manquante' });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Tu es un expert en café béninois. 
Un client cherche un café avec l'humeur: "${mood}".
Préférences: ${preferences.join(', ') || 'aucune'}.
À éviter: ${excludes.join(', ') || 'rien'}.
Recommande 2-3 cafés béninois spécifiques avec une description courte. Réponds en français, de façon concise.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return res.status(200).json({ recommendation: text });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur Gemini: ' + error.message });
  }
}
