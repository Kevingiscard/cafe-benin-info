const { createClient } = require('@supabase/supabase-js');
const { setCors } = require('../lib/cors');
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

module.exports = async function handler(req, res) {
  setCors(req, res, 'GET,OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabase) return res.status(503).json({ error: 'L’encyclopédie connectée n’est pas encore configurée.' });

  const category = String(req.query?.category || '').trim().slice(0, 80);
  let query = supabase.from('encyclopedia').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);

  const { data, error } = await query.limit(50);
  if (error) return res.status(500).json({ error: 'Impossible de charger l’encyclopédie.' });
  return res.status(200).json({ articles: data || [] });
};
