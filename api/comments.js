const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function sendNotificationEmail(comment) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD }
  });
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `[Café Bénin] Nouveau commentaire de ${comment.name}`,
    html: `<h3>Nouveau commentaire</h3>
      <p><strong>Nom:</strong> ${comment.name}</p>
      <p><strong>Email:</strong> ${comment.email}</p>
      <p><strong>Section:</strong> ${comment.section || 'N/A'}</p>
      <p><strong>Note:</strong> ${comment.rating || 'N/A'}/5</p>
      <p><strong>Message:</strong> ${comment.content}</p>`
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
    const { name, email, content, section, rating } = req.body;
    if (!name || !email || !content) {
      return res.status(400).json({ error: 'Champs requis: name, email, content' });
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
