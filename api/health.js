const { setCors } = require('../lib/cors');

export default async function handler(req, res) {
  setCors(req, res, 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  return res.status(200).json({
    status: 'ok',
    service: 'cafe-benin-info',
    timestamp: new Date().toISOString()
  });
}
