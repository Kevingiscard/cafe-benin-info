/** Café Bénin — optional Ollama proxy. */
const { setCors } = require('../lib/cors');
const MAX_TEXT = 4000;

const clean = value => String(value || '').trim().slice(0, MAX_TEXT);

export default async function handler(req, res) {
  setCors(req, res, 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ollamaUrl = process.env.OLLAMA_URL;
  if (!ollamaUrl) return res.status(503).json({ error: 'OLLAMA_URL n’est pas configurée.' });

  const prompt = clean(req.body?.prompt);
  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(0, 20) : null;
  if (!prompt && !messages?.length) return res.status(400).json({ error: 'prompt ou messages requis' });

  const model = clean(req.body?.model || process.env.OLLAMA_MODEL || 'llama3.2').slice(0, 100);
  const systemPrompt = `Tu es CaféBot, assistant du portail Café Bénin. Réponds en français, clairement et sans inventer de données locales non vérifiées.`;
  const url = ollamaUrl.replace(/\/$/, '');

  try {
    const payload = messages?.length
      ? { model, messages: [{ role: 'system', content: systemPrompt }, ...messages], stream: false }
      : { model, prompt: `${systemPrompt}\n\nQuestion: ${prompt}`, stream: false };
    const endpoint = messages?.length ? '/api/chat' : '/api/generate';
    const response = await fetch(`${url}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ error: 'Ollama a refusé la requête.' });
    const data = await response.json();
    return res.status(200).json({
      reply: data.message?.content || data.response || '',
      model,
      source: 'ollama'
    });
  } catch (_) {
    return res.status(503).json({ error: 'Ollama est indisponible.' });
  }
}
