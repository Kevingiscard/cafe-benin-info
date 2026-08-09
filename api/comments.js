const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const { setCors } = require('../lib/cors');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const cleanText = (value, max) => String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

async function sendNotificationEmail(comment) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD || !process.env.ADMIN_EMAIL) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD }
  });
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `[Café Bénin] Nouveau commentaire de ${cleanText(comment.name, 80)}`,
    html: `<h3>Nouveau commentaire</h3>
      <p><strong>Nom:</strong> ${escapeHTML(comment.name)}</p>
      <p><strong>Email:</strong> ${escapeHTML(comment.email)}</p>
      <p><strong>Section:</strong> ${escapeHTML(comment.section || 'N/A')}</p>
      <p><strong>Note:</strong> ${escapeHTML(comment.rating ?? 'N/A')}/5</p>
      <p><strong>Message:</strong> ${escapeHTML(comment.content).replace(/\n/g, '<br>')}</p>`
  });
}

export default async function handler(req, res) {
  setCors(req, res, 'GET,POST,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('comments')
      .select('id, name, content, section, rating, created_at')
      .eq('approved', true).order('created_at', { ascending: false }).limit(50);
    if (error) return res.status(500).json({ error: 'Impossible de charger les commentaires.' });
    return res.status(200).json({ comments: data || [] });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const name = cleanText(req.body?.name, 80);
  const email = cleanText(req.body?.email, 160).toLowerCase();
  const content = cleanText(req.body?.content, 3000);
  const section = cleanText(req.body?.section, 100) || null;
  const rating = req.body?.rating == null || req.body.rating === '' ? null : Number(req.body.rating);

  if (!name || !email || !content) return res.status(400).json({ error: 'Nom, email et message sont obligatoires.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Adresse email invalide.' });
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) return res.status(400).json({ error: 'La note doit être comprise entre 1 et 5.' });

  const { data, error } = await supabase.from('comments').insert([{ name, email, content, section, rating, approved: false }]).select('id, name, section, rating, created_at').single();
  if (error) return res.status(500).json({ error: 'Impossible d’enregistrer le commentaire.' });

  try { await sendNotificationEmail({ name, email, content, section, rating }); } catch (_) {}
  return res.status(201).json({ success: true, comment: data });
}
