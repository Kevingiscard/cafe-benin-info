# Revue visuelle locale — prépublication V1.0

Le hero, les deux appels à l’action, la recherche, le lien d’évitement et le contrôle de thème sont bien présents dans le rendu local. La nouvelle hiérarchie du hero est plus explicite que la version antérieure.

Le contrôle visuel a également mis en évidence que la première ligne du titre du hero reste trop sombre dans le rendu observé. Une règle de contraste a été ajoutée dans `theme.css`; le prochain contrôle doit vérifier la feuille chargée et la couleur calculée, en tenant compte du cache local.

Le diagnostic DOM a confirmé une couleur calculée sombre (`rgb(35, 26, 20)`) et l’absence de la règle récente dans la feuille `theme.css?v=1`, ce qui indique une ressource mise en cache plutôt qu’une règle de thème concurrente. La référence a été versionnée en `theme.css?v=2` avant le prochain contrôle.

Le nouveau contrôle local confirme que `theme.css?v=2` est chargé et que le titre principal du hero est désormais lisible. Le bouton de thème met bien à jour `data-theme`, `aria-pressed` et `localStorage`. La couleur de fond doit encore être vérifiée après la durée de transition, car la mesure immédiate conserve la valeur claire au moment du clic.

Après la transition, le thème sombre applique bien le fond chaud attendu (`rgb(26, 22, 19)`) et la surface `#1d1713`. Le système de thème est donc fonctionnel en clair comme en sombre.

Le parcours de recherche depuis le header ouvre bien une modale sombre au-dessus de la page et affiche des résultats éditoriaux initiaux. Le prochain contrôle vérifiera une requête de dictionnaire, la navigation clavier, Escape et le retour de focus.

Le test « canephora » a révélé une course d’initialisation : le corpus global existait bien (254 fiches), mais l’événement du dictionnaire pouvait se déclencher avant l’écouteur de recherche. `app.js` récupère désormais immédiatement `window.cafeBeninDictionary` en complément de l’événement. Après réinjection du corpus dans la session de test, la recherche retournait bien la fiche « Liberica », dont la définition mentionne Canephora.

Après rechargement avec la correction, la recherche « canephora » affiche directement la fiche « Liberica » sans aucune réinjection manuelle. La touche Échap ferme la modale et le bouton de recherche redevient l’élément actif, ce qui valide la fermeture clavier et le retour de focus.

Le menu mobile a également été contrôlé par interaction : son ouverture définit `aria-expanded="true"`, expose le panneau, verrouille le défilement et place le focus sur le premier lien. La touche Échap ferme ensuite le panneau, restaure le focus sur le déclencheur et libère le défilement.

Le parcours dictionnaire fonctionne : la fiche « Bourbon » est présente, le favori bascule dans `localStorage`, puis l’état est correctement restauré après un second clic. CaféBot local répond sans service externe et retourne des liens éditoriaux pertinents pour une question sur la prudence documentaire au Bénin. Enfin, la navigation directe vers `#coffee-shops` ouvre bien la section historique des usages et recommandations : l’URL partagée reste compatible.

Le journal de la console ne relève aucune erreur JavaScript et le contrôle réseau ne relève aucun statut HTTP d’échec. Le contrôle d’images a signalé `img/roast-curve.svg` comme non chargée dans une session en mémoire, mais le fichier SVG existe, est valide et est référencé à deux endroits. Le statut observé correspond au chargement différé de ces deux images hors viewport, pas à une ressource manquante.

Un rechargement isolé confirme que `app.js?v=2` est exécuté, que le corpus contient 254 fiches et que « canephora » retourne la fiche « Liberica » sans réinjection. Le défaut de recherche est donc résolu sur un chargement neuf.

## Vérification publique — GitHub Pages

Après publication, la page `https://kevingiscard.github.io/cafe-benin-info/` sert bien la V1.0. Le contrôle sur le site public confirme l’exécution de `app.js?v=2`, un corpus de 254 fiches, un résultat pour « canephora », une réponse de CaféBot avec la source `local` et aucune ressource chargée avec un statut HTTP d’échec.

## Révision typographique — en cours

La revue locale de la version typographique allégée confirme une hiérarchie sans sérif plus compacte : le hero, les boutons, les métriques et les textes documentaires utilisent désormais une lecture homogène, avec des titres réduits et une largeur de contenu resserrée. La grille des en-têtes de section aligne le titre et le texte d’introduction sur deux colonnes à large écran, puis les empile sur mobile. Un `scroll-margin-top` est appliqué aux sections afin que les titres atteints par ancre ne soient plus masqués par la navigation fixe.

Le contrôle de l’ancre Histoire confirme que le titre est désormais entièrement visible sous le header fixe. En thème sombre, le navigateur applique bien `DM Sans` au hero et au corps, tandis que l’en-tête de section utilise une grille de deux colonnes calculée, avec un espacement cohérent ; aucun style de police décoratif n’est conservé dans la hiérarchie principale.

Les tests visuels doivent continuer avec le thème sombre, la recherche, le dictionnaire, l’assistant local, le menu mobile et l’ancre historique `#coffee-shops`.
