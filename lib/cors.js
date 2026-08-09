const DEFAULT_ORIGINS = [
  'https://cafe-benin-info.vercel.app',
  'https://kevingiscard.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(','))
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
}

function setCors(req, res, methods = 'GET,POST,OPTIONS') {
  const origin = req.headers?.origin;
  const allowed = allowedOrigins();
  const value = origin && allowed.includes(origin) ? origin : allowed[0];

  res.setHeader('Access-Control-Allow-Origin', value);
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

module.exports = { setCors };
