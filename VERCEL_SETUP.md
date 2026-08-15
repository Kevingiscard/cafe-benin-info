# ⚡ Configuration Vercel — Café Bénin

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
Sur https://vercel.com → **Project → Settings → Environment Variables**, ajoutez les variables dans les environnements **Production**, **Preview** et **Development**. Ne mettez jamais ces valeurs dans GitHub, dans un fichier JavaScript client ou dans l’URL du site.

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | https://xxx.supabase.co |
| `SUPABASE_KEY` | clé publique anon Supabase |
| `GEMINI_API_KEY` | clé Google AI Studio, obligatoire pour CaféBot et les recommandations |
| `GEMINI_MODEL` | `gemini-3.6-flash` (optionnel : valeur par défaut dans le code) |
| `GMAIL_USER` | compte Gmail émetteur des alertes |
| `GMAIL_PASSWORD` | App Password Gmail (16 chars) |
| `ADMIN_EMAIL` | `kevingiscard93@outlook.com` |

> **Activation de l’IA.** Créez la clé dans [Google AI Studio](https://aistudio.google.com/app/apikey), ajoutez-la sous le nom exact `GEMINI_API_KEY`, puis redéployez la branche `main`. Sans cette variable, CaféBot répond volontairement avec l’état « moteur IA non configuré » plutôt qu’avec une fausse réponse.

> **Ollama est facultatif.** Laissez `OLLAMA_URL` vide sur Vercel, sauf si vous disposez d’un serveur Ollama public, sécurisé et joignable par Internet. Une adresse `localhost` ne fonctionne que sur votre propre machine et ralentirait les requêtes de production.

## 7. Routes API disponibles
- `GET  /api/comments` — Commentaires approuvés
- `POST /api/comments` — Soumettre un commentaire
- `POST /api/ai`       — Recommandation Gemini
- `POST /api/chat`     — Conversation CaféBot
- `GET  /api/dictionary?q=arabica` — Recherche dictionnaire
- `GET  /api/encyclopedia?category=terroir` — Articles

## ⚠️ Notes importantes
- Le compte émetteur de Gmail doit être une adresse Gmail avec la validation en deux étapes et un App Password ; les notifications peuvent ensuite être reçues sur `kevingiscard93@outlook.com`.
- Exécutez `supabase-setup.sql` avant le premier déploiement avec commentaires.
- GitHub Pages sert le frontend statique ; les routes `/api/*` sont exécutées par le déploiement Vercel configuré dans `backend-client.js`.
