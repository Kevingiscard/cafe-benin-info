# Validation publique — 15 août 2026

La version GitHub Pages servie avec le commit `8ba7297` charge correctement le nouveau visuel principal et la section « Récit visuel ». La section affiche les trois cartes illustrées et ses images locales sans erreur visible.

La vérification de style a relevé une anomalie de contraste : le titre `.display` dans `#voyage-visuel` reçoit la couleur calculée `rgb(23, 19, 16)`, ce qui le rend presque noir sur le fond sombre. Le premier correctif de spécificité dans `motion.css` n’a pas modifié la couleur calculée dans la version GitHub Pages. Même après la version de feuille de style et l’attribut de style ajoutés, le rendu public restait trop sombre ; une correction DOM directe lors de la création de la section est nécessaire pour garantir une couleur explicite et lisible.

La vérification du serveur Vercel confirme que la fonction CaféBot charge désormais sans erreur d’invocation. Elle répond actuellement `503` avec le message « Aucun moteur IA n’est configuré », indiquant qu’il reste à définir `GEMINI_API_KEY` dans les variables d’environnement du projet Vercel.

La première vérification de l’ancre `#carnet` juste après le commit `7b4d7e0` a encore chargé `motion.js?v=contrast-2`, alors que le dépôt contient la version `contrast-3`. GitHub Pages diffusait donc encore une version précédemment mise en cache du document. Le test doit être répété après propagation avant de conclure sur le comportement du défilement direct.

Après propagation, la version publique charge bien `motion.js?v=contrast-3`. Le partage avec `#carnet` place correctement la vue sur le carnet de terrain, affiche les trois cartes documentaires et présente l’attribution visible de l’image de cérémonie éthiopienne à Steve Evans sous CC BY 2.0.
