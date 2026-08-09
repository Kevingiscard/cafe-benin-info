const { createClient } = require('@supabase/supabase-js');
const { setCors } = require('../lib/cors');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  setCors(req, res, 'GET,OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const q = String(req.query?.q || '').trim().slice(0, 100);
  let query = supabase.from('dictionary').select('*').order('term', { ascending: true });
  if (q) query = query.ilike('term', `%${q.replace(/[%_]/g, '\\$&')}%`);

  const { data, error } = await query.limit(100);
  if (error) return res.status(500).json({ error: 'Impossible de charger le dictionnaire.' });
  return res.status(200).json({ terms: data || [] });
}
