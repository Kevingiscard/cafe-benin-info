# Validation publique — 15 août 2026

La version GitHub Pages servie avec le commit `8ba7297` charge correctement le nouveau visuel principal et la section « Récit visuel ». La section affiche les trois cartes illustrées et ses images locales sans erreur visible.

La vérification de style a relevé une anomalie de contraste : le titre `.display` dans `#voyage-visuel` reçoit la couleur calculée `rgb(23, 19, 16)`, ce qui le rend presque noir sur le fond sombre. Le premier correctif de spécificité dans `motion.css` n’a pas modifié la couleur calculée dans la version GitHub Pages ; il faut donc inspecter la règle de style dynamique injectée par la couche éditoriale et appliquer la couleur directement lors de la création de la section.

La vérification du serveur Vercel confirme que la fonction CaféBot charge désormais sans erreur d’invocation. Elle répond actuellement `503` avec le message « Aucun moteur IA n’est configuré », indiquant qu’il reste à définir `GEMINI_API_KEY` dans les variables d’environnement du projet Vercel.
