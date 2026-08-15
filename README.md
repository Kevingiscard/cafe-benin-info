# Café Bénin — Encyclopédie Mondiale Interactive

Le site est une encyclopédie francophone du café, avec un dossier documentaire consacré au Bénin, à l’Afrique et aux cultures du café. Il est conçu comme un **site statique autonome** : il fonctionne sur GitHub Pages sans base de données, serveur, clé API ni compte tiers.

## Fonctionnalités disponibles

Le site propose une encyclopédie structurée, un dictionnaire consultable, des recettes et méthodes de préparation, un carnet de terrain enrichi d’images documentaires, des favoris stockés dans le navigateur et un **assistant de recherche local**. Cet assistant donne des réponses pédagogiques immédiates et renvoie vers les sections pertinentes ; il ne prétend pas remplacer une source primaire ou un avis médical.

## Publication

La version publique est servie par GitHub Pages :

<https://kevingiscard.github.io/cafe-benin-info/>

Pour publier une modification, poussez les fichiers sur la branche `main` du dépôt. Dans GitHub, vérifiez que **Settings → Pages** utilise la branche `main` et le répertoire racine (`/`).

## Vérification locale

Une installation Node.js récente est facultative mais permet de lancer les contrôles :

```bash
npm test
npm run validate
```

Ces commandes vérifient les scripts JavaScript, les liens locaux, les images, les métadonnées GitHub Pages et l’absence de dépendances serveur.

## Contact

Les contributions passent par le formulaire du site, qui prépare un e-mail à envoyer à **kevingiscard93@outlook.com**. Instagram : **@kevin48life**.
