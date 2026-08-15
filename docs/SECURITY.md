# Sécurité et confidentialité

Le risque principal de Café Bénin est éditorial et frontend : faire publier un script, un asset ou un contenu non sûr, ou casser un parcours de lecture. L’architecture ne stocke ni compte, ni base de données, ni clé API, ni formulaire serveur.

| Surface | Mesure appliquée |
|---|---|
| Dépendances | `package-lock.json`, `npm ci --ignore-scripts`, audit npm et Dependabot. |
| Secrets | Scan de signatures de clés privées, GitHub, Google, AWS et Stripe ; aucune clé dans le dépôt. |
| JavaScript | Refus de `eval`, `new Function` et `document.write` dans les modules exécutés. |
| Runtime | Refus des appels applicatifs `fetch`, `XMLHttpRequest` et `WebSocket` dans les modules locaux. |
| Liens externes | `rel="noopener"` requis pour les ouvertures dans un nouvel onglet. |
| Workflows | Permissions réduites par job ; pas de `pull_request_target` ; aucune exécution de contenu distant. |
| Vie privée | Pas d’analytics ni d’observabilité tiers par défaut. Les favoris et le thème restent dans le navigateur. |

Les données du dictionnaire sont des contenus éditoriaux versionnés dans le dépôt, et non des données saisies par un visiteur. Toute future importation de contenu externe devra être revue avant publication, rendue avec des APIs DOM sûres (`textContent`), et couverte par un test de non-régression.

Si une clé, un jeton ou une donnée personnelle est introduit par erreur, retirez-le du fichier, révoquez-le auprès de son fournisseur, vérifiez l’historique GitHub et suivez la procédure de [`RECOVERY.md`](RECOVERY.md). Ne publiez jamais une clé pour rétablir rapidement un contrôle automatisé.
