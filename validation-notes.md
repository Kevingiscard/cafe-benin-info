# Validation publique — 15 août 2026

La version GitHub Pages servie avec le commit `8ba7297` charge correctement le nouveau visuel principal et la section « Récit visuel ». La section affiche les trois cartes illustrées et ses images locales sans erreur visible.

La vérification de style a relevé une anomalie de contraste : le titre `.display` dans `#voyage-visuel` reçoit la couleur calculée `rgb(23, 19, 16)`, ce qui le rend presque noir sur le fond sombre. Le premier correctif de spécificité dans `motion.css` n’a pas modifié la couleur calculée dans la version GitHub Pages. Même après la version de feuille de style et l’attribut de style ajoutés, le rendu public restait trop sombre ; une correction DOM directe lors de la création de la section est nécessaire pour garantir une couleur explicite et lisible.

La vérification du serveur Vercel confirme que la fonction CaféBot charge désormais sans erreur d’invocation. Elle répond actuellement `503` avec le message « Aucun moteur IA n’est configuré », indiquant qu’il reste à définir `GEMINI_API_KEY` dans les variables d’environnement du projet Vercel.

La première vérification de l’ancre `#carnet` juste après le commit `7b4d7e0` a encore chargé `motion.js?v=contrast-2`, alors que le dépôt contient la version `contrast-3`. GitHub Pages diffusait donc encore une version précédemment mise en cache du document. Le test doit être répété après propagation avant de conclure sur le comportement du défilement direct.

Après propagation, la version publique charge bien `motion.js?v=contrast-3`. Le partage avec `#carnet` place correctement la vue sur le carnet de terrain, affiche les trois cartes documentaires et présente l’attribution visible de l’image de cérémonie éthiopienne à Steve Evans sous CC BY 2.0.

La vérification de la version `motion.js?v=contrast-4` confirme que l’ancre `#carnet` mène au Carnet sans espace vide : la carte mondiale, désormais servie en JPEG optimisé, est visible dès l’ouverture. Les autres cartes suivent immédiatement dans le flux de lecture.

La première vérification de l’assistant local a été effectuée immédiatement après le commit `7136780`. Le texte de confirmation n’était pas encore trouvé dans la page publique, ce qui indique une diffusion GitHub Pages en cours ou un script encore mis en cache. Une vérification différée est requise avant d’interpréter ce résultat comme une anomalie fonctionnelle.

Après diffusion, le message « Assistant de recherche local » est bien visible dans la page publique. Le formulaire CaféBot accepte une question et crée une réponse locale ainsi que des liens contextuels ; le premier contrôle de contenu a sélectionné les liens de navigation plutôt que le paragraphe de réponse, ce qui nécessite une vérification DOM ciblée du texte, mais confirme que l’interaction est exécutée sans requête API distante.

Le contrôle DOM ciblé confirme la réponse locale attendue pour la comparaison « café naturel / café lavé », accompagnée des liens vers « Transformation du café » et « Dictionnaire ». La solution autonome est donc utilisable sans clé Gemini, Supabase ou déploiement Vercel.
