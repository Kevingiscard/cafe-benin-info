# Café Bénin — Encyclopédie du café

Une encyclopédie documentaire francophone consacrée au café, de la plante à la tasse, avec un dossier central sur le Bénin. Les contenus distinguent les connaissances générales des informations locales qui doivent être vérifiées et sourcées.

## Lien public unique

**Site officiel :** https://kevingiscard.github.io/cafe-benin-info/

Le dépôt GitHub et sa branche main sont la source de vérité. Chaque modification fusionnée sur main passe par la validation puis le déploiement GitHub Pages. L’ancienne adresse Vercel est conservée comme alias et redirige vers ce lien lorsque le projet Vercel est reconnecté à main.

## Ce que le site permet de faire

- Parcourir les chapitres histoire, Bénin, botanique, culture, post-récolte, torréfaction, extraction, dégustation, économie et santé.
- Rechercher dans les chapitres et le dictionnaire avec Ctrl+K ou Cmd+K.
- Filtrer le dictionnaire, ouvrir des fiches et enregistrer jusqu’à 100 favoris dans ce navigateur.
- Interroger CaféBot localement et obtenir une recommandation de préparation sans compte, clé d’IA ni appel à une API.
- Calculer une dose de café filtre selon la quantité d’eau et le ratio choisi.
- Choisir un thème clair ou sombre; la préférence est enregistrée localement.
- Préparer une contribution dans l’application e-mail choisie par le visiteur. Le site ne transmet ni ne conserve ce message.

## Architecture

- index.html : contenu, navigation, métadonnées et formulaires accessibles.
- app.js : recherche, navigation, thème, recommandation, calculateur et préparation de l’e-mail.
- dictionary-v4.js et local-assistant.js : dictionnaire et réponses documentaires locales.
- styles.css, v4.css, motion.css, theme.css : présentation, composants, mouvement progressif et thèmes.
- img/ : photographies et schémas locaux.
- scripts/ et tests/ : validation, accessibilité, SEO, sécurité, liens et tests du projet.
- docs/ : authentification réelle, procédures d’exploitation et limites connues.

Le site de main est statique. Il ne crée pas de compte visiteur, n’utilise pas de base de données ou d’API métier, et ne demande aucune variable d’environnement. Le manifeste web ne constitue pas un cache hors ligne : aucun service worker n’est installé.

## Vérification locale

Prérequis : Node.js 18 ou plus récent.

```bash
npm ci --ignore-scripts
npm run verify
npm run health
```

Pour vérifier les sources externes séparément : npm run check:links:external.

## Publication et synchronisation

Le workflow .github/workflows/pages-deploy.yml valide le site puis le publie sur GitHub Pages après chaque push sur main. Dans Settings → Pages, la source doit être GitHub Actions.

Pour garder l’ancienne adresse cafe-benin-info.vercel.app comme alias du site officiel, reconnecte une seule fois le projet Vercel au dépôt Kevingiscard/cafe-benin-info, choisis main comme branche de production et la racine du dépôt comme répertoire. Le fichier vercel.json redirige alors l’ensemble de l’ancienne adresse vers le lien officiel. Les réglages du projet Vercel n’étaient pas accessibles depuis la connexion utilisée pendant cette mise à jour; il faudra confirmer cette association dans le tableau de bord Vercel.

## Documentation

- [Authentification et traitement des jetons](docs/AUTHENTICATION_AND_TOKENS.md)
- [Sécurité et vie privée](docs/SECURITY.md)
- [Exploitation et publication](docs/OPERATIONS.md)
- [État des déploiements](DEPLOYMENT_STATUS.md)
- [Sources et crédits visuels](content-sources.md)

Les photographies doivent avoir une source, une licence ou une mention claire de leur création avant d’être présentées comme documentaires. Les références actuellement manquantes sont listées dans content-sources.md.

## Contact

Les contributions préparent un e-mail à kevingiscard93@outlook.com. Instagram : @kevin48life.