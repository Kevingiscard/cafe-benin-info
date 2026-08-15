# Exploitation de production

La V1.0+ reste une publication **statique, autonome et sans collecte serveur**. L’exploitation repose sur les scripts locaux du dépôt, GitHub Actions et GitHub Pages. Aucun contenu factuel, média ou source documentaire n’est modifié par une automatisation.

## Déclencheurs et responsabilités

| Mécanisme | Déclencheur | Contrôle | Réaction attendue |
|---|---|---|---|
| CI — Qualité Café Bénin | Push et pull request vers `main` | Validation, tests, assets, budgets, accessibilité, SEO, sécurité, liens internes | Corriger avant fusion ou publication. |
| Déploiement GitHub Pages | Push vers `main` | Release gate puis artefact statique | Publier uniquement si la release est valide. |
| Santé publique | Chaque jour à 07:20 UTC | Accueil, ancres critiques, scripts, manifest, robots, sitemap et images-clés | Consulter le rapport si l’exécution échoue. |
| Liens documentaires | Chaque lundi à 08:30 UTC | Liens locaux et sources externes, avec relances | Remplacer un lien définitivement indisponible ; surveiller les erreurs temporaires. |
| Dépendances et budgets | Chaque jour à 07:20 UTC | `npm audit`, secrets, tailles, accessibilité et SEO | Ouvrir une correction proportionnée au risque. |
| Dependabot | Npm mensuel, GitHub Actions hebdomadaire | Propositions de mises à jour en pull request | Lire le diff et exécuter la CI avant fusion. |

> Les contrôles planifiés utilisent des permissions minimales. Une issue d’alerte n’est créée que si une exécution planifiée échoue ; le workflow recherche d’abord une issue ouverte de même titre afin d’éviter les doublons.

## Commandes locales

| Commande | Rôle |
|---|---|
| `npm run validate` | Structure, SEO minimum, ancres, assets, syntaxe et autonomie du runtime. |
| `npm test` | Parcours critiques, CaféBot, formulaires, stockage local, ancres et supports de production. |
| `npm run check:assets` | Formats, présence et budgets des médias. |
| `npm run check:size` | Budgets HTML, CSS et JavaScript. |
| `npm run check:a11y` | Structure, étiquettes, alternatives, focus et mouvement réduit. |
| `npm run check:seo` | Balises, données structurées, manifest, robots et sitemap. |
| `npm run check:security` | Signatures de secrets, primitives JavaScript dangereuses et audit npm. |
| `npm run check:links` | Liens locaux uniquement, sans réseau. |
| `npm run check:links:external` | Vérification des sources externes avec relances. |
| `npm run health` | Smoke test de l’URL publique et génération optionnelle d’un rapport JSON. |
| `npm run verify` | Release gate complet local, incluant les liens internes. |

## Budgets actuels

| Famille | Seuil de blocage | Mesure actuelle de référence |
|---|---:|---:|
| HTML | 180 000 octets | 43 111 octets |
| CSS cumulé | 180 000 octets | 47 345 octets |
| JavaScript cumulé | 450 000 octets | 71 018 octets |
| Images cumulées | 7 000 000 octets | 5 336 528 octets |
| Image standard | 1 300 000 octets | Contrôlée à chaque release |

Ces seuils sont volontairement explicites, stables et indépendants d’un service tiers. Ils complètent les inspections de navigateur ; ils ne sont pas un substitut à une étude laboratoire de performance.

## Bascule GitHub Pages

Après publication des fichiers de workflow, ouvrez **Settings → Pages** et sélectionnez **GitHub Actions** comme source de publication. Le workflow `pages-deploy.yml` suit la séquence officielle : configuration Pages, upload d’un artefact statique, puis déploiement avec un environnement `github-pages`.[1]

Le job de déploiement reçoit uniquement `pages: write` et `id-token: write`. Les jobs de contrôle utilisent `contents: read` ; seul l’agrégateur d’alerte reçoit `issues: write`.[2]

## Absence volontaire de télémétrie externe

La V1.0+ n’ajoute ni Google Analytics, ni Sentry, ni service de performance tiers dans le runtime. Les logs GitHub Actions, les artefacts de santé de 30 jours et les contrôles déterministes suffisent au périmètre actuel, tout en protégeant les visiteurs d’un traçage non nécessaire.

## Références

[1] [GitHub Docs — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)  
[2] [GitHub Docs — Use GITHUB_TOKEN for authentication in workflows](https://docs.github.com/actions/reference/authentication-in-a-workflow)
