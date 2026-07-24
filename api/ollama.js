/**
 * api/ollama.js — Vercel Serverless Function
 * Proxy vers Ollama local ou remote (OLLAMA_URL env var)
 * Modèle par défaut : llama3.2 (configurable via OLLAMA_MODEL)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, messages, model } = req.body;
  if (!prompt && !messages) return res.status(400).json({ error: 'prompt ou messages requis' });

  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  const OLLAMA_MODEL = model || process.env.OLLAMA_MODEL || 'llama3.2';

  // Système spécialisé café Bénin
  const systemPrompt = `Tu es CaféBot, expert en café béninois et africain. 
Tu connais parfaitement la filière caféière du Bénin (Robusta, zones de production comme Atakora, Collines), 
les traditions de préparation (café au gingembre, clous de girofle, sel), 
les cérémonies africaines du café, et les données 2025-2026 sur le marché mondial. 
Réponds en français, de façon concise, chaleureuse et experte.`;

  // Construire le payload chat ou generate
  let ollamaPayload;
  if (messages && Array.isArray(messages)) {
    // Mode chat conversationnel
    ollamaPayload = {
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      stream: false
    };
    try {
      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ollamaPayload),
        signal: AbortSignal.timeout(30000)
      });
      if (!response.ok) throw new Error(`Ollama HTTP ${response.status}`);
      const data = await response.json();
      return res.status(200).json({
        reply: data.message?.content || '',
        model: OLLAMA_MODEL,
        source: 'ollama'
      });
    } catch (err) {
      return res.status(503).json({ error: 'Ollama indisponible: ' + err.message });
    }
  } else {
    // Mode generate simple
    ollamaPayload = {
      model: OLLAMA_MODEL,
      prompt: `${systemPrompt}\n\nQuestion: ${prompt}`,
      stream: false
    };
    try {
      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ollamaPayload),
        signal: AbortSignal.timeout(30000)
      });
      if (!response.ok) throw new Error(`Ollama HTTP ${response.status}`);
      const data = await response.json();
      return res.status(200).json({
        reply: data.response || '',
        model: OLLAMA_MODEL,
        source: 'ollama'
      });
    } catch (err) {
      return res.status(503).json({ error: 'Ollama indisponible: ' + err.message });
    }
  }
}
