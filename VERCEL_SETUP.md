# ⚡ Configuration Vercel — Café Bénin v2.0

## 1. Installer Vercel CLI
```bash
npm install -g vercel
```

## 2. Login
```bash
vercel login
```

## 3. Tester en local
```bash
npm install
vercel dev
# Site disponible sur http://localhost:3000
# API sur http://localhost:3000/api/comments
```

## 4. Variables d'environnement locales
Créer `.env` depuis `.env.example` :
```bash
cp .env.example .env
# Remplir les valeurs
```

## 5. Déployer en production
```bash
vercel --prod
```

## 6. Ajouter les variables sur Vercel Dashboard
Sur https://vercel.com → Project → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | https://xxx.supabase.co |
| `SUPABASE_KEY` | clé anon Supabase |
| `GEMINI_API_KEY` | clé Google AI Studio |
| `GMAIL_USER` | votre@gmail.com |
| `GMAIL_PASSWORD` | App Password Gmail (16 chars) |
| `ADMIN_EMAIL` | votre@gmail.com |

## 7. Routes API disponibles
- `GET  /api/comments` — Commentaires approuvés
- `POST /api/comments` — Soumettre un commentaire
- `POST /api/ai`       — Recommandation Gemini
- `GET  /api/dictionary?q=arabica` — Recherche dictionnaire
- `GET  /api/encyclopedia?category=terroir` — Articles

## ⚠️ Notes importantes
- Gmail : utiliser obligatoirement `@gmail.com` (pas `@outlook.com`)
- Gmail : activer 2FA → App Password → Mail
- Supabase : exécuter `supabase-setup.sql` avant le premier déploiement
- GitHub Pages sert uniquement le frontend statique (pas les API)
