/**
 * api/chat.js — Chatbot conversationnel Café Bénin
 * Stratégie: Ollama d'abord → fallback Gemini si dispo
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, question } = req.body;
  if (!messages && !question) return res.status(400).json({ error: 'messages ou question requis' });

  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  const systemPrompt = `Tu es CaféBot ☕, l'assistant expert du portail Café Bénin. 
Tu maîtrises : la filière Robusta béninoise (régions Atakora, Collines, Donga), 
les prix du marché 2025-2026, les recettes traditionnelles (café gingembre, café épicé), 
les cérémonies du café en Afrique, les bienfaits santé, et l'histoire du café. 
Style: chaleureux, expert, concis. Toujours en français.`;

  const chatMessages = messages || [{ role: 'user', content: question }];

  // 1. Essai Ollama
  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
        stream: false
      }),
      signal: AbortSignal.timeout(25000)
    });
    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      return res.status(200).json({
        reply: data.message?.content || '',
        source: 'ollama',
        model: OLLAMA_MODEL
      });
    }
  } catch (_) { /* Ollama non dispo, on tente Gemini */ }

  // 2. Fallback Gemini
  if (GEMINI_KEY) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(GEMINI_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const lastMessage = chatMessages[chatMessages.length - 1]?.content || '';
      const result = await model.generateContent(`${systemPrompt}\n\n${lastMessage}`);
      return res.status(200).json({
        reply: result.response.text(),
        source: 'gemini',
        model: 'gemini-1.5-flash'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Gemini erreur: ' + err.message });
    }
  }

  // 3. Aucune IA dispo
  return res.status(503).json({
    error: 'Aucun moteur IA disponible. Configurez OLLAMA_URL ou GEMINI_API_KEY.',
    reply: 'Je suis temporairement indisponible. Veuillez réessayer dans quelques instants ☕'
  });
}
