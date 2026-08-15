# Café Bénin — V1.0

**Café Bénin** est une plateforme documentaire francophone consacrée au café : histoire, botanique, culture, transformation, torréfaction, extraction, dégustation, santé, économie et filière béninoise. Le site distingue les sources générales sur le café des informations locales documentées et n’affiche pas de statistiques béninoises non vérifiées.

La version V1.0 est un **site statique autonome**. Elle fonctionne sur GitHub Pages sans base de données, serveur, clé API, compte tiers ou dépendance d’exécution.

## Adresse publique

<https://kevingiscard.github.io/cafe-benin-info/>

## Fonctionnalités

| Fonction | Comportement |
|---|---|
| Encyclopédie | Parcours éditorial de la plante à la tasse, avec dossier Bénin et sources institutionnelles. |
| Recherche | Ouverture avec le bouton, `Ctrl + K` ou `Cmd + K` ; recherche dans les sections et le dictionnaire. |
| Dictionnaire | Filtre, recherche, fiche détaillée et favoris persistants stockés uniquement dans le navigateur. |
| CaféBot local | Assistant documentaire sans réseau ; il répond avec prudence et renvoie vers les rubriques pertinentes. |
| Recommandation | Conseils de préparation locaux et explicables, sans collecte de données. |
| Thèmes | Mode clair et sombre, préférence système au premier chargement et préférence mémorisée localement. |
| Contribution | Prépare un e-mail local vers l’adresse du projet ; aucun message n’est envoyé ni stocké par le site. |

## Architecture

| Élément | Rôle |
|---|---|
| `index.html` | Structure sémantique, métadonnées, sections documentaires et points d’entrée. |
| `styles.css`, `v4.css`, `motion.css`, `theme.css` | Mise en page éditoriale, composants, récits visuels et tokens clair/sombre. |
| `app.js` | Thème, navigation, recherche, focus, CaféBot local, recommandations et contribution. |
| `dictionary-v4.js` | Corpus, filtres, favoris et fiches du dictionnaire. |
| `local-assistant.js` | Réponses locales documentaires, sans appel réseau. |
| `motion.js` | Sections éditoriales complémentaires et améliorations de mouvement progressives. |
| `scripts/` | Contrôles de structure, tests, assets, budgets, accessibilité, SEO, liens, santé publique et sécurité. |
| `docs/` | Exploitation, stratégie de tests, sécurité, récupération et checklist de release. |

## Développement local

Une version récente de Node.js, à partir de 18, suffit. Aucune variable d’environnement n’est requise.

```bash
git clone https://github.com/Kevingiscard/cafe-benin-info.git
cd cafe-benin-info
npm ci --ignore-scripts
npm run verify
```

Pour consulter la page localement, servez le dossier avec un serveur statique, par exemple `npx serve .`. Cette commande n’est pas nécessaire pour les validations automatisées.

## Déploiement GitHub Pages

Le dépôt est conçu pour GitHub Pages. Après la publication des workflows V1.0+, sélectionnez **GitHub Actions** dans **Settings → Pages**. Le workflow `pages-deploy.yml` exécute la release gate, prépare un artefact strictement statique et le déploie dans l’environnement `github-pages`. Cette méthode suit les actions Pages officielles.[1]

Les chemins sont relatifs afin de rester compatibles avec `https://kevingiscard.github.io/cafe-benin-info/`. Le fichier `robots.txt`, le sitemap, le manifest, le favicon et les métadonnées Open Graph utilisent l’URL publique canonique.

## Politique éditoriale et médias

Les données locales demandent une source, une période et un contexte. Les informations historiques restent présentées comme historiques. Les crédits de la photographie de cérémonie éthiopienne et les statuts des schémas pédagogiques figurent dans [`content-sources.md`](content-sources.md).

## Maintenance

Avant toute publication, exécutez `npm run verify`, vérifiez les ancres, le menu mobile, la recherche, le dictionnaire, les favoris, CaféBot et les deux thèmes. Après publication, lancez `npm run health`. Ne modifiez pas les contenus relatifs au Bénin sans source vérifiable. Le détail de l’exploitation est disponible dans [`docs/OPERATIONS.md`](docs/OPERATIONS.md), la récupération dans [`docs/RECOVERY.md`](docs/RECOVERY.md) et la checklist dans [`docs/PRODUCTION_CHECKLIST.md`](docs/PRODUCTION_CHECKLIST.md).

## Référence GitHub Pages

[1] [GitHub Docs — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Contact

Les contributions préparent un e-mail à destination de **kevingiscard93@outlook.com**. Instagram : **@kevin48life**.
