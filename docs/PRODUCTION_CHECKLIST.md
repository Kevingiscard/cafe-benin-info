# Checklist de release V1.0+

| Vérification | Commande ou preuve | État attendu |
|---|---|---|
| Installation déterministe | `npm ci --ignore-scripts` | Succès sans script post-install. |
| Release gate | `npm run verify` | Toutes les étapes vertes. |
| Santé publique | `npm run health` | Accueil, ancres et assets critiques en HTTP 200. |
| Sources externes | `npm run check:links:external` | Aucune 404/410 confirmée. |
| Contrôle visuel | Accueil, thème sombre, mobile, recherche et CaféBot | Lisibilité et interactions intactes. |
| Pages | Exécution « Déploiement GitHub Pages » | Artefact et environnement `github-pages` verts. |
| Documentation | Changelog et documentation opérationnelle | Mis à jour si le comportement change. |
