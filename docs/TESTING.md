# Stratégie de tests V1.0+

Les tests protègent les comportements qui rendent l’encyclopédie utilisable, autonome et fiable. Ils ne se limitent pas à vérifier l’existence de fichiers : chaque contrôle est relié à une régression concrète à éviter.

| Parcours ou risque | Contrôle |
|---|---|
| Navigation et URLs existantes | Présence des ancres de contenu, dont `#coffee-shops`, et des sections injectées `#voyage-visuel` et `#carnet`. |
| Recherche globale | Présence de la modale, de la navigation clavier et de l’événement `cafeb:dictionary-ready`. |
| Dictionnaire et favoris | Corpus exposé, stockage local filtré et borné à 100 entrées. |
| CaféBot local | Réponse documentée sur sujet connu et réponse de repli explicite hors corpus, sans réseau. |
| Thèmes | Amorçage avant rendu, préférence locale protégée et bascule clair/sombre. |
| Contribution | Contraintes de longueur, e-mail HTML, statut annoncé et encodage du contenu. |
| Accessibilité | Un H1, main, lien d’évitement, libellés de champs, alternatives, focus visible et mouvement réduit. |
| SEO | Canonical, données structurées, robots, sitemap et manifest cohérents avec GitHub Pages. |
| Sécurité | Absence de primitives dangereuses dans le runtime, de requêtes applicatives et de signatures de secrets. |
| Production | Page 404, lockfile, budgets et scripts de santé présents. |

## Exécution avant une publication

Exécutez `npm ci --ignore-scripts`, puis `npm run verify`. Si la modification touche l’interface, vérifiez aussi manuellement la page d’accueil, `#coffee-shops`, la recherche de « Canephora », l’ouverture/fermeture mobile, les deux thèmes et CaféBot. Une vérification publique supplémentaire se fait avec `npm run health` après la propagation GitHub Pages.

Les liens externes sont scannés séparément avec `npm run check:links:external`. Une erreur 429 ou 5xx déclenche des relances ; une 404 ou 410 confirmée échoue afin qu’une source soit corrigée. Cette séparation empêche une indisponibilité temporaire d’un site tiers de bloquer la validation locale quotidienne.
