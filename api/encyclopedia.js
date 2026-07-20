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

  const { category } = req.query;
  let query = supabase.from('encyclopedia').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);

  const { data, error } = await query.limit(50);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ articles: data || [] });
}
