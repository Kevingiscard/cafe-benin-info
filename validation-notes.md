# Validation publique — 15 août 2026

La version GitHub Pages servie avec le commit `8ba7297` charge correctement le nouveau visuel principal et la section « Récit visuel ». La section affiche les trois cartes illustrées et ses images locales sans erreur visible.

La vérification de style a relevé une anomalie de contraste : le titre `.display` dans `#voyage-visuel` reçoit la couleur calculée `rgb(23, 19, 16)`, ce qui le rend presque noir sur le fond sombre. La couche `v4.css` applique une règle plus spécifique que la règle initiale de `motion.css`. Une correction de spécificité ou une déclaration `!important` limitée à ce titre est nécessaire.

La vérification du serveur Vercel confirme que la fonction CaféBot charge désormais sans erreur d’invocation. Elle répond actuellement `503` avec le message « Aucun moteur IA n’est configuré », indiquant qu’il reste à définir `GEMINI_API_KEY` dans les variables d’environnement du projet Vercel.
