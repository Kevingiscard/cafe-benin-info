const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { q } = req.query;
  let query = supabase.from('dictionary').select('*').order('term', { ascending: true });
  if (q) query = query.ilike('term', `%${q}%`);

  const { data, error } = await query.limit(100);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ terms: data || [] });
}
