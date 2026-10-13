# État de déploiement — Café Bénin

La version publiée sur GitHub Pages est autonome. Elle charge l’assistant local `local-assistant.js` et ne charge plus `backend-client.js` ni de route `/api/`. La même branche `main` constitue désormais la source de déploiement miroir pour Vercel, afin d’éviter que l’ancienne V3 reste publiée séparément.

Le contrôle public du 15 août 2026 confirme que l’assistant local répond à une question sur la mouture filtre et renvoie vers les sections **Extraction** et **Dictionnaire**. Les modules de serveur, de base de données, de notifications et d’IA distante ont été retirés du déploiement.

Adresse publique : <https://kevingiscard.github.io/cafe-benin-info/>
Adresse miroir Vercel : <https://cafe-benin-info.vercel.app>
