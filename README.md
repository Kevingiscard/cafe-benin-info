# Café Bénin — Encyclopédie du café

Une encyclopédie documentaire francophone consacrée au café, de la plante à la tasse, avec un dossier central sur le Bénin. Les contenus distinguent les connaissances générales des informations locales qui doivent être vérifiées et sourcées.

## Lien public unique

**Site officiel :** https://cafe-benin-info.edgeone.dev/

Le dépôt GitHub et sa branche `main` sont la source de vérité du code. Le site public est servi sur Tencent Cloud EdgeOne à l’adresse ci-dessus. Le workflow GitHub Actions décrit plus bas exécute les contrôles qualité ; il ne publie pas lui-même le site. Le mécanisme exact de synchronisation entre `main` et EdgeOne doit être vérifié dans la configuration Tencent EdgeOne avant de le présenter comme automatique. L’ancienne adresse Vercel n’est qu’un alias éventuel et doit être testée séparément.

## Ce que le site permet de faire

- Entrer par six parcours éditoriaux : encyclopédie, dossier Bénin, observatoire, laboratoire d’outils, dictionnaire et espace professionnel. Les pages Sources, À propos et les ressources transversales complètent le portail.
- Rechercher dans les chapitres et le dictionnaire avec Ctrl+K ou Cmd+K.
- Rechercher parmi 310 termes annoncés sur l’accueil, ouvrir les fiches et enregistrer des favoris localement dans ce navigateur. Le nombre de termes doit rester synchronisé avec le dictionnaire réellement publié.
- Interroger CaféBot, un assistant documentaire local guidé par règles et thèmes intégrés, sans compte, clé d’IA ni appel à une API. Il ne s’agit pas d’un grand modèle génératif.
- Accéder à 13 outils pratiques annoncés : ratios, espresso, extraction, mouture, eau, cold brew, caféine, coût, fraîcheur, roue aromatique et carnets. Vérifier chaque outil individuellement avant de le qualifier de disponible hors ligne.
- Choisir un thème clair ou sombre; la préférence est enregistrée localement.
- Installer la PWA sur les navigateurs compatibles; le service worker met en cache les pages du sitemap et les ressources locales essentielles, puis les ressources consultées à la demande.
- Préparer une contribution dans l’application e-mail choisie par le visiteur. Le site ne transmet ni ne conserve ce message.

## Architecture

- index.html : contenu, navigation, métadonnées et formulaires accessibles.
- app.js : recherche, navigation, thème, calculateur, recommandation et préparation de l’e-mail.
- explorer.js, map.js, tools.js : progression de lecture, carte schématique et outils locaux.
- portal.css : présentation partagée des nouveaux espaces.
- dictionary-v4.js et local-assistant.js : dictionnaire et réponses documentaires locales.
- styles.css, v4.css, motion.css, theme.css : présentation, composants, mouvement progressif et thèmes.
- img/ : photographies et schémas locaux.
- scripts/ et tests/ : validation, accessibilité, SEO, sécurité, liens et tests du projet.
- docs/ : authentification réelle, procédures d’exploitation et limites connues.

Le site de `main` est statique. Il ne crée pas de compte visiteur, n’utilise pas de base de données ou d’API métier, et ne demande aucune variable d’environnement. Le service worker `sw.js` construit sa portée à partir de l’enregistrement du navigateur ; sur le domaine EdgeOne actuel, vérifier que son scope est bien la racine du site. La première installation et le premier remplissage du cache nécessitent une connexion ; les ressources non consultées et les polices externes peuvent ne pas être disponibles hors ligne.

LiteRT n’est pas encore activé dans le navigateur : l’intégration Android native via Google Play Services et l’inférence web sont deux voies techniques distinctes. Aucun modèle lourd n’est téléchargé sans action du visiteur.

## Vérification locale

Prérequis : Node.js 18 ou plus récent.

```bash
npm ci --ignore-scripts
npm run verify
npm run health
```

Pour vérifier les sources externes séparément : npm run check:links:external.

## Publication et synchronisation

Le workflow `.github/workflows/pages-deploy.yml` valide le site après chaque push sur `main` avec `npm run verify`. Malgré son ancien nom, ce workflow ne publie pas le site : il ne contient aucune étape de déploiement. La production publique est l’instance Tencent Cloud EdgeOne. Vérifier dans la console EdgeOne la source d’origine, la règle de mise à jour, le dernier déploiement et le résultat du build avant de considérer la synchronisation automatique comme opérationnelle.

Le 28 novembre 2026, les copies Vercel (cafe-benin-info.vercel.app) et GitHub Pages (kevingiscard.github.io/cafe-benin-info) ont été supprimées à la demande du propriétaire. Ces deux anciennes adresses renvoient maintenant 404. Le seul lien officiel est https://cafe-benin-info.edgeone.dev/.

## Documentation

- [Authentification et traitement des jetons](docs/AUTHENTICATION_AND_TOKENS.md)
- [Sécurité et vie privée](docs/SECURITY.md)
- [Exploitation et publication](docs/OPERATIONS.md)
- [Architecture Smart Coffee Atlas, PWA et positionnement LiteRT](docs/SMART_COFFEE_ATLAS.md)
- [État des déploiements](DEPLOYMENT_STATUS.md)
- [Sources et crédits visuels](content-sources.md)

Les photographies doivent avoir une source, une licence ou une mention claire de leur création avant d’être présentées comme documentaires. Les références actuellement manquantes sont listées dans content-sources.md.

## Contact

Les contributions préparent un e-mail à kevingiscard93@outlook.com. Instagram : @kevin48life.
