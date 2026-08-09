const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const cleanText = (value, max) => String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

async function sendNotificationEmail(comment) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD || !process.env.ADMIN_EMAIL) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD }
  });
  const name = escapeHTML(comment.name);
  const email = escapeHTML(comment.email);
  const section = escapeHTML(comment.section || 'N/A');
  const rating = escapeHTML(comment.rating || 'N/A');
  const content = escapeHTML(comment.content).replace(/\n/g, '<br>');
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `[Café Bénin] Nouveau commentaire de ${comment.name}`,
    html: `<h3>Nouveau commentaire</h3>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Section:</strong> ${section}</p>
      <p><strong>Note:</strong> ${rating}/5</p>
      <p><strong>Message:</strong> ${content}</p>`
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('comments')
      .select('id, name, content, section, rating, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ comments: data });
  }

  if (req.method === 'POST') {
    const name = cleanText(req.body?.name, 80);
    const email = cleanText(req.body?.email, 160);
    const content = cleanText(req.body?.content, 3000);
    const section = cleanText(req.body?.section, 100) || null;
    const rating = req.body?.rating == null || req.body.rating === '' ? null : Number(req.body.rating);

    if (!name || !email || !content) {
      return res.status(400).json({ error: 'Champs requis: name, email, content' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide' });
    }
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'La note doit être comprise entre 1 et 5' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ name, email, content, section, rating, approved: false }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    try { await sendNotificationEmail({ name, email, content, section, rating }); } catch(e) {}
    return res.status(201).json({ success: true, comment: data[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
