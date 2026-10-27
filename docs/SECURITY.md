# Sécurité et confidentialité

## Version actuellement publiée

La branche main contient un site statique sans authentification visiteur ni serveur applicatif. Aucun compte, session, cookie applicatif, jeton d’accès, API métier, base de données ou secret d’exécution n’est utilisé par le code chargé par index.html.

| Surface | État et mesure |
|---|---|
| Données locales | Thème cb-theme et favoris cb-favorites enregistrés uniquement dans le localStorage du navigateur. |
| Assistant et recommandations | Calculs locaux; aucun prompt n’est envoyé à un fournisseur d’IA. |
| Contribution | Le formulaire prépare un mailto; l’envoi et la conservation relèvent du logiciel e-mail du visiteur. |
| CI | Le workflow de validation reçoit contents: read. |
| Publication Pages | Seul le job deploy reçoit pages: write et id-token: write; le jeton OIDC de déploiement est temporaire. |
| Dépendances | package-lock.json, npm ci --ignore-scripts, npm audit et mises à jour Dependabot. |
| Runtime | Les scripts applicatifs n’utilisent pas fetch, XMLHttpRequest, WebSocket, eval ou document.write. |

Le site charge la police DM Sans depuis Google Fonts. Ce chargement constitue une requête réseau vers Google; il n’y a pas d’outil d’analytics tiers intégré. Pour une politique sans requête tierce, il faudra héberger localement une police dont la licence autorise cet usage.

## Ancienne API Vercel et branches V2/V3

Les anciennes versions contiennent des fonctions serverless pour les commentaires et l’IA. Elles ne font pas partie de main. Le client public observé sur cafe-benin-info.vercel.app appelle des routes /api et ne fournit ni en-tête Authorization ni cookie. L’ancienne source V3 accepte des soumissions publiques, annonce Access-Control-Allow-Origin: * et ne met en place ni authentification, ni limitation de débit.

CORS ne protège pas une API. Le fichier SQL V3 autorise toute insertion de commentaire, tandis que la clé anon Supabase n’est pas une identité d’utilisateur. Les handlers attendent des variables côté serveur comme GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY, GMAIL_USER et GMAIL_PASSWORD; ne placez jamais ces secrets dans le navigateur ou dans le dépôt. L’URL Ollama par défaut localhost n’est pas joignable depuis une fonction cloud.

La version Vercel servie au moment de l’audit diffère de main et son code serveur/configuration ne sont pas accessibles par la connexion Vercel de cette tâche. La redirection définie dans vercel.json retire cette version divergente après le prochain déploiement Vercel depuis main.

Avant tout retour à un backend, il faudra ajouter une authentification adaptée aux visiteurs et aux actions d’administration, des règles de lecture/écriture strictes, une validation de taille et de contenu, une protection contre le spam et les abus, une politique de conservation/suppression des e-mails, une gestion des erreurs sans divulgation de détails internes, ainsi qu’une revue des coûts d’IA.

## Prévention des fuites

- Les fichiers .env et .env.* sont ignorés par Git; seul .env.example est conservé et il ne contient aucune valeur.
- Les secrets d’un futur backend doivent être ajoutés dans le coffre-fort du fournisseur côté serveur, jamais dans HTML, CSS, JavaScript public ou le dépôt.
- Un jeton divulgué doit être révoqué auprès de son fournisseur, l’historique vérifié et la procédure de [récupération](RECOVERY.md) suivie.
- Une future importation de texte externe doit être rendue avec des APIs DOM sûres comme textContent et couverte par un test de non-régression.