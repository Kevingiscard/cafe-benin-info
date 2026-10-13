# Café Bénin — Encyclopédie du café

**Café Bénin** est une plateforme documentaire francophone consacrée au café, de la plante à la tasse, avec un dossier dédié à la filière béninoise. Le site couvre l’histoire, la botanique, la culture, la transformation, la torréfaction, l’extraction, la dégustation, la santé et l’économie. Les données locales doivent être accompagnées de sources vérifiables.

## Site public

- **Site principal :** https://kevingiscard.github.io/cafe-benin-info/
- **Miroir Vercel :** https://cafe-benin-info.vercel.app/
- **Code source :** https://github.com/Kevingiscard/cafe-benin-info

Le dépôt GitHub et sa branche `main` constituent la source unique. GitHub Pages est déployé par GitHub Actions. Vercel doit être relié au même dépôt, avec `main` comme branche de production, afin de publier le même site statique. Les déploiements des deux plateformes se vérifient séparément.

## Fonctionnalités

| Fonction | Comportement |
|---|---|
| Encyclopédie | Parcours de la plante à la tasse et dossier consacré au Bénin. |
| Recherche globale | Recherche dans les sections et le dictionnaire ; raccourcis `Ctrl + K` ou `Cmd + K`. |
| Dictionnaire | Recherche, filtres, fiches et favoris enregistrés localement dans le navigateur. |
| CaféBot local | Assistant documentaire sans appel réseau ni clé API. |
| Recommandations | Conseils de préparation locaux et explicables. |
| Thèmes | Mode clair et sombre, avec préférence locale. |
| Contribution | Prépare un e-mail ; le site n’envoie ni ne stocke lui-même la contribution. |
| PWA | Manifeste et chemins relatifs compatibles avec le sous-chemin GitHub Pages. |

## Architecture

- `index.html` : structure, contenu, métadonnées SEO et points d’entrée.
- `styles.css`, `v4.css`, `motion.css`, `theme.css` : présentation, composants, animations et thèmes.
- `app.js` : navigation, recherche, thème, recommandations et contribution.
- `dictionary-v4.js` : corpus et fonctionnalités du dictionnaire.
- `local-assistant.js` : réponses documentaires locales.
- `motion.js` : enrichissements éditoriaux progressifs.
- `img/` : visuels et schémas locaux.
- `scripts/` et `tests/` : contrôles automatiques de structure, sécurité, accessibilité, SEO, ressources et fonctionnement.
- `docs/` : procédures d’exploitation, de test et de récupération.
- `content-sources.md` : références et crédits éditoriaux.

Le site est statique : il ne nécessite ni serveur applicatif, ni base de données, ni variable d’environnement, ni dépendance JavaScript d’exécution.

## Vérifier avant publication

Prérequis : Node.js 18 ou plus récent.

```bash
npm ci --ignore-scripts
npm run verify
npm run health
```

Pour une vérification locale, servez le dossier avec un serveur statique, par exemple `npx serve .`.

## Déploiement GitHub Pages

Dans **Settings → Pages**, choisissez **GitHub Actions** comme source. Le workflow `.github/workflows/pages-deploy.yml` valide le site avant de publier le contenu statique. Chaque commit sur `main` déclenche le workflow.

- [Historique des déploiements GitHub Actions](https://github.com/Kevingiscard/cafe-benin-info/actions)
- [Documentation GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Déploiement Vercel

Dans Vercel, importez `Kevingiscard/cafe-benin-info`, sélectionnez `main` comme branche de production et publiez la racine du dépôt en tant que site statique. Aucun framework ni build command n’est requis. Activez l’intégration Git pour que chaque commit sur `main` déclenche le déploiement. Vérifiez ensuite le statut dans le tableau de bord Vercel.

## Politique éditoriale et maintenance

Ne publiez pas de statistiques locales sans source, période et contexte. Avant chaque publication, vérifiez les ancres, le menu mobile, la recherche, le dictionnaire, les favoris, CaféBot et les deux thèmes. Après publication, exécutez `npm run health`.

Consultez `docs/OPERATIONS.md`, `docs/RECOVERY.md`, `docs/PRODUCTION_CHECKLIST.md` et `docs/SECURITY.md` pour les procédures détaillées.

## Contact

Les contributions préparent un e-mail à destination de **kevingiscard93@outlook.com**. Instagram : **@kevin48life**.
