# Authentification, requêtes et jetons

## Réponse rapide

Le code de main n’authentifie pas les visiteurs : il n’y a ni écran de connexion, ni compte, ni session, ni cookie applicatif, ni jeton utilisateur. Le navigateur utilise des fichiers statiques et réalise localement la recherche, le dictionnaire, CaféBot, les recommandations, les favoris, le thème et le calculateur de dose.

Les seuls jetons du parcours actuellement exploité sont ceux de GitHub Actions pour valider et publier le dépôt. Ils sont séparés des fonctions visibles par le public.

## Composants et flux du site

| Composant | Fichiers | Flux et données | Authentification |
|---|---|---|---|
| Page | index.html | Le navigateur charge HTML, CSS, scripts et images statiques depuis GitHub Pages. | Aucune. |
| Recherche | app.js | Recherche locale dans les sections et le dictionnaire. | Aucune requête API. |
| Dictionnaire | dictionary-v4.js | Recherche et filtres locaux; favoris dans localStorage sous cb-favorites. | Aucune. |
| CaféBot | local-assistant.js, app.js | La question est traitée localement à partir du corpus embarqué; la réponse reste dans la page. | Aucun fournisseur IA, aucune clé. |
| Recommandation et dosage | local-assistant.js, app.js | La recommandation suit des règles locales; le calculateur applique eau/ratio et affiche le résultat. | Aucune. |
| Thème | app.js | Le choix clair/sombre est conservé sous cb-theme dans le navigateur. | Aucune. |
| Contribution | app.js | Le formulaire construit un lien mailto avec le message prérempli. Le visiteur doit l’envoyer depuis son application e-mail. | Le site ne voit ni ne stocke de mot de passe e-mail. |

Le navigateur charge aussi DM Sans depuis Google Fonts; cette requête de police n’est pas une authentification et ne transmet pas les messages du formulaire.

## Publication GitHub Pages

1. Une pull request vers main déclenche .github/workflows/validate.yml. Le job a contents: read et valide le dépôt.
2. Un push sur main déclenche .github/workflows/pages-deploy.yml. Son job validate vérifie le même site avant la publication.
3. Le job deploy téléverse l’artefact statique puis appelle l’action de déploiement Pages.

Dans le workflow Pages, contents: read s’applique par défaut. Seul deploy reçoit pages: write et id-token: write. GitHub Actions crée automatiquement un jeton d’exécution limité pour les actions qui en ont besoin; le mécanisme OIDC fournit au service Pages une preuve temporaire du job. Il n’y a ni token GitHub personnel, ni secret applicatif à copier dans le dépôt. Le code destiné aux visiteurs ne reçoit aucun de ces jetons.

## Variables présentes dans les anciennes versions

Le fichier .env.example actuel précise qu’aucune variable n’est utilisée par main. Une ancienne branche V3 contient toutefois un prototype de fonctions serverless Vercel :

- OLLAMA_URL et OLLAMA_MODEL pour joindre un serveur Ollama.
- GEMINI_API_KEY pour les fonctions qui appellent Gemini depuis le serveur.
- SUPABASE_URL et SUPABASE_KEY pour la base de commentaires.
- GMAIL_USER, GMAIL_PASSWORD et ADMIN_EMAIL pour les notifications.

Ces valeurs ne sont pas nécessaires à GitHub Pages et ne doivent pas être ajoutées à main. Pour une fonction serverless, les secrets doivent rester dans les variables d’environnement serveur du fournisseur. Une clé anon Supabase est un identifiant public de projet soumis aux règles RLS; elle n’est pas un jeton de connexion ni une preuve d’identité. Une clé service-role, une clé Gemini ou un mot de passe Gmail ne doit jamais être publié dans un script client.

## Ancienne API Vercel : absence d’authentification

La page Vercel observée le 27 octobre 2026 charge un client backend v4 et un script app-v3.js qui ne sont pas dans la branche main. Le client envoie les requêtes vers /api et définit credentials: omit; il ne joint pas d’en-tête Authorization. Les handlers V3 suivis dans GitHub n’implémentent pas de connexion utilisateur : leurs réponses CORS ouvertes n’assurent aucune protection. La route de commentaires accepte les envois publics; les fonctions IA pourraient consommer le quota configuré au serveur.

Le code serveur actuellement déployé sur Vercel n’a pas pu être inspecté via la connexion Vercel disponible. Il ne faut donc pas supposer que ces routes sont protégées ou que les secrets du compte sont configurés correctement. Le fichier vercel.json ramène le domaine Vercel vers la version statique de main après reconnexion et redéploiement.

## Pour ajouter plus tard des comptes ou des données synchronisées

Il faudra choisir un fournisseur d’identité, protéger les opérations d’administration, définir les règles d’accès par utilisateur, limiter les appels publics, prévenir le spam, informer les visiteurs sur la collecte de leur e-mail, et permettre l’accès/suppression des données. Les favoris synchronisés entre appareils exigeraient un stockage authentifié; les favoris actuels sont seulement locaux.