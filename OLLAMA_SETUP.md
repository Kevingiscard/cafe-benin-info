# ☕ Intégration Ollama — Café Bénin

## Architecture IA

```
Frontend → /api/chat ou /api/ai ou /api/ollama
                    ↓
          Ollama local (prioritaire)
                    ↓ (si indisponible)
          Gemini 1.5 Flash (fallback)
```

## Endpoints disponibles

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/ollama` | POST | Appel direct Ollama (generate ou chat) |
| `/api/chat` | POST | Chatbot conversationnel CaféBot |
| `/api/ai` | POST | Recommandation par humeur |

## Setup local (développement)

### 1. Lancer Ollama
```bash
# Installer Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Télécharger un modèle
ollama pull llama3.2
# ou léger :
ollama pull phi3
# ou multilingue :
ollama pull mistral

# Lancer
ollama serve
```

### 2. Configurer les variables
```bash
cp .env.example .env.local
# Éditer .env.local avec tes valeurs
```

### 3. Variables d'environnement
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
GEMINI_API_KEY=optionnel_si_tu_veux_le_fallback
```

## Setup Vercel (production)

Pour exposer Ollama depuis Vercel, deux options :

### Option A — Ollama sur un VPS/serveur
```env
OLLAMA_URL=https://ton-serveur.com:11434
OLLAMA_MODEL=llama3.2
```

### Option B — Fallback Gemini uniquement (gratuit)
```env
GEMINI_API_KEY=ta_cle_gemini
# OLLAMA_URL non défini → utilise uniquement Gemini
```

## Usage depuis le frontend

```javascript
// Chat conversationnel
const { reply, source, model } = await cafeBenin.chat([
  { role: 'user', content: 'Quel café béninois pour se réveiller le matin ?' }
]);
console.log(`[${source}/${model}] ${reply}`);

// Recommandation par humeur
const reco = await cafeBenin.getAIRecommendation(
  'fatigué',
  ['fort', 'épicé'],
  ['sucré']
);

// Ollama direct
const { reply } = await cafeBenin.askOllama(
  'Explique la différence Arabica/Robusta en 3 phrases',
  'phi3' // modèle optionnel
);
```

## Modèles recommandés

| Modèle | Taille | Usage |
|---|---|---|
| `phi3` | ~2GB | Chromebook/RAM limitée |
| `llama3.2` | ~2GB | Équilibre qualité/vitesse |
| `mistral` | ~4GB | Meilleur en français |
| `llama3.1:8b` | ~5GB | Qualité maximale |
