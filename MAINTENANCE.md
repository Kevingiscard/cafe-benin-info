# Maintenance de Café Bénin

Les fichiers HTML suivis à la racine sont la source éditoriale actuelle. Les styles et scripts locaux sont servis tels quels. `npm run verify` contrôle le site sans réécrire ces contenus.

## Générateur historique

`scripts/build-site.mjs` et `scripts/chapters-data.mjs` précèdent plusieurs enrichissements faits directement dans les pages. Ce générateur est conservé, mais refuse désormais de remplacer les fichiers sans le drapeau explicite `--allow-legacy-overwrite`. Ne pas l'utiliser pour une publication normale : il ne reproduit pas les derniers ajouts, les métadonnées ni les vérifications de propriété. Le drapeau est une issue de secours pour une migration examinée avec un diff complet, pas une commande de build courante.

## Avant publication

- Faire approuver les nouveaux contenus et vérifier les changements du dépôt distant.
- Préserver les balises de propriété Google/Bing, les fonctions et les réserves documentaires non résolues.
- Exécuter `npm run verify` et rejouer les interactions du navigateur.
- Si le texte change, régénérer l'index de recherche local depuis les pages et vérifier CaféBot.
- Distinguer date de révision éditoriale et date de la source. Le flux RSS n'annonce aucune heure de publication supposée.
- Augmenter la version du cache de service worker en cas de modification des ressources.
- Vérifier les deux sites après le déploiement autorisé, y compris sur mobile et hors ligne.

## Poids et archives

L'historique Git n'est pas envoyé au navigateur. Ne pas réécrire cet historique ni supprimer les archives pour réduire le poids affiché du dépôt. Les images du site sont déjà servies dans leurs formats existants ; une conversion doit préserver le rendu et les crédits, se mesurer avant/après et être testée. Aucun service payant n'est requis.

Les pages anglaises actuelles sont des guides partiels. Les liens de navigation existent, mais aucun couple hreflang ne déclare ces contenus comme traductions équivalentes des pages françaises complètes. Ajouter hreflang seulement quand le contenu correspondant sera réellement équivalent.
