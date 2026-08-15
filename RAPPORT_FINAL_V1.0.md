# Rapport final V1.0 — Café Bénin

**Projet :** Café Bénin — Encyclopédie et dictionnaire du café  
**URL publique :** <https://kevingiscard.github.io/cafe-benin-info/>  
**Dépôt :** <https://github.com/Kevingiscard/cafe-benin-info>  
**Version publiée :** `514e64c`, complétée par `40f0c89`  
**Date de vérification :** 15 août 2026

## 1. Objet de la V1.0

Cette V1.0 transforme la page existante en une plateforme documentaire statique consacrée au café, avec un dossier éditorial central pour le Bénin et l’Afrique. La cible est un site présentable à des universités, institutions publiques, organisations scientifiques et professionnels du café. L’architecture retenue est volontairement sobre : **HTML, CSS et JavaScript locaux**, publiés gratuitement sur GitHub Pages, sans serveur applicatif, base de données, clé API ou dépendance à un assistant distant.

> Le site ne présente aucune donnée chiffrée actuelle sur le Bénin sans période, définition et source. Il distingue explicitement les sources historiques des données contemporaines à documenter.

| Exigence de publication | État V1.0 |
|---|---|
| Hébergement gratuit et autonome | Validé sur GitHub Pages |
| Fonctionnalité sans API ni backend | Validée : CaféBot est local |
| Design éditorial premium | Mis en œuvre avec une direction « magazine documentaire » |
| Dossier Bénin prudent et sourcé | Mis en œuvre |
| Recherche et dictionnaire | Mis en œuvre, 254 fiches actives |
| Accessibilité clavier et thèmes | Mise en œuvre et contrôles réalisés |

## 2. Diagnostic initial et corrections structurantes

L’audit préalable, conservé dans `AUDIT_PRE_REFONTE.md`, a mis en évidence une architecture encombrée par des intégrations qui ne pouvaient pas fonctionner de manière fiable dans un site GitHub Pages gratuit : routes serveur, références à des services distants et logique dépendant d’API. Ces éléments ne correspondaient ni à la contrainte de gratuité, ni à l’objectif d’autonomie.

Ils ont été retirés ou remplacés. `app-v3.js` a cédé la place à `app.js`, qui regroupe les comportements de l’interface. L’assistant distant a été remplacé par `local-assistant.js`, un CaféBot documentaire utilisant des réponses et passerelles internes préétablies. Les formulaires qui auraient exigé un service tiers produisent désormais une action explicite et statique vers l’adresse de contact officielle, `kevingiscard93@outlook.com`.

## 3. Direction artistique, interface et thèmes

Le design a été recomposé en une grammaire visuelle cohérente : palette café, ivoire, cuivre et tons terreux ; grandes compositions éditoriales ; typographie expressive pour les titres ; police sans sérif lisible pour le contenu, et typographie monospacée ponctuelle pour les repères techniques. Les variables et composants de thème sont centralisés dans `theme.css` afin d’éviter les divergences de couleur et de contraste.

Le thème clair et le thème sombre sont disponibles depuis le header. Le choix est persistant dans `localStorage`, respecte la préférence du navigateur au premier chargement et met à jour les attributs ARIA ainsi que la couleur d’interface du navigateur. Le contrôle visuel a confirmé l’application du fond sombre chaud `#1a1613` et la lisibilité du titre principal du hero après correction de contraste.

Le header est désormais fixe et compact, la navigation est structurée par chapitres, et le menu mobile gère ouverture, fermeture, verrouillage du défilement, focus initial, boucle de tabulation et fermeture par la touche Échap. Le hero présente deux actions non ambiguës : accéder au dictionnaire ou consulter le dossier Bénin.

## 4. Contenu documentaire, galerie et dossier Bénin

Le parcours éditorial couvre l’histoire, la botanique, la culture, la transformation post-récolte, la torréfaction, l’extraction, la dégustation, la santé, l’économie et le vocabulaire du café. Les contenus sont organisés pour relier notions, procédés, limites de connaissance et sources. Les illustrations pédagogiques locales expliquent l’anatomie de la cerise, la chaîne post-récolte, la torréfaction et l’extraction.

La galerie combine ces schémas avec une photographie de cérémonie du café éthiopienne attribuée à Steve Evans sous licence CC BY 2.0. La légende précise qu’il s’agit d’un contexte éthiopien et ne le présente pas comme une pratique béninoise. Les crédits et la politique d’utilisation des visuels sont documentés dans `content-sources.md`.

La section Bénin refuse les raccourcis promotionnels. Elle présente le café béninois comme un chantier documentaire, rappelle la nécessité d’attribuer et dater les informations, distingue une référence historique de la FAO des statistiques contemporaines, et oriente le lecteur vers la Direction de la Statistique Agricole du Bénin ainsi que vers l’Organisation internationale du café. Les axes à documenter sont explicitement nommés : territoires, acteurs, données, marchés, qualité et valeur ajoutée locale.[1] [2] [3]

## 5. Fonctionnalités livrées

| Fonctionnalité | Comportement livré |
|---|---|
| Recherche globale | Modale accessible avec raccourci `Ctrl/Cmd + K`, navigation par flèches, fermeture par Échap et retour de focus |
| Dictionnaire | 254 fiches, recherche textuelle, filtres, fiche détaillée et favoris stockés localement |
| Intégration recherche/dictionnaire | Les fiches sont disponibles même si le dictionnaire a été initialisé avant la recherche |
| CaféBot | Réponses documentaires locales, suggestions et liens internes, sans réseau ni compte |
| Recommandation locale | Conseil de préparation informatif sans appel externe |
| Contribution | Préparation d’un e-mail vers `kevingiscard93@outlook.com` sans collecte serveur |
| Ancres historiques | L’URL `#coffee-shops` reste fonctionnelle |
| Fallback médias | État visuel de remplacement si une image est indisponible |

Une anomalie détectée pendant la recette de test a été corrigée : la recherche ne récupérait pas toujours le dictionnaire lorsqu’un événement `cafeb:dictionary-ready` avait été émis avant son écouteur. `app.js` lit désormais aussi `window.cafeBeninDictionary` à l’initialisation. Le test « canephora » retourne désormais la fiche « Liberica » dont la définition mentionne *Canephora*.

## 6. Performance, médias, SEO et accessibilité

Les médias éditoriaux utilisés ont été convertis en WebP lorsque cela améliorait le poids sans dégrader l’intention visuelle. Seuls les visuels réellement référencés ont été conservés ; les assets PNG, JPG et séries V14/V15 inutilisés ont été supprimés. Le répertoire d’images utilisé par le site ne représente plus qu’environ 5,2 Mo dans l’espace de travail au terme du nettoyage.

La publication inclut une canonical GitHub Pages, une description, des balises Open Graph et Twitter/X, des données structurées JSON-LD, un favicon SVG, un manifest et un sitemap. `robots.txt` déclare le sitemap. Les liens de navigation, les textes alternatifs, les libellés de champs et les contrôles de thème/recherche ont été revus pour soutenir un objectif **WCAG 2.2 AA**. Les animations privilégient les propriétés non bloquantes et respectent la préférence de réduction des mouvements.

## 7. Vérifications effectuées

La commande `npm run build` a été exécutée après les corrections. Elle a validé la présence de toutes les ressources locales, les métadonnées, l’absence d’intégration serveur externe, la syntaxe de chaque module JavaScript et la configuration sans dépendance runtime. Les quatre tests automatisés sont passés : assistant local, recommandation sans API, thème accessible et intégration recherche/dictionnaire déjà initialisé.

Les parcours manuels contrôlés couvrent la recherche, le résultat dictionnaire, le thème sombre, les favoris, CaféBot, la fermeture par Échap, le focus de retour, le menu mobile et l’ancre `#coffee-shops`. Le contrôle public après déploiement confirme que GitHub Pages sert `app.js?v=2`, que le corpus contient 254 fiches, que CaféBot répond avec une source locale, que la requête « canephora » affiche son résultat, et qu’aucune ressource inspectée ne remonte de statut HTTP d’échec.

| Contrôle | Résultat |
|---|---|
| Validation locale `npm run build` | Réussie |
| Tests Node | 4/4 réussis |
| Erreurs JavaScript observées | Aucune |
| Échecs HTTP de ressources inspectés | Aucun |
| Recherche `canephora` | Résultat présent |
| CaféBot public | Fonctionnel en local |
| Ancre `#coffee-shops` | Fonctionnelle |

## 8. Fichiers et changements principaux

Les livrables centraux sont `index.html`, `app.js`, `theme.css`, `dictionary-v4.js`, `local-assistant.js`, `motion.js`, `styles.css`, `v4.css`, `motion.css`, `content-sources.md`, `README.md`, `CHANGELOG.md`, `site.webmanifest`, `favicon.svg`, `sitemap.xml`, `scripts/validate.mjs` et `tests/local-assistant.test.mjs`. Le détail des vérifications visuelles est conservé dans `VISUAL_REVIEW.md`.

Deux commits ont été poussés sur `main` : `514e64c` pour la refonte V1.0 et `40f0c89` pour la preuve de vérification publique. Le site publié utilise donc l’URL officielle GitHub Pages indiquée en tête du rapport.

## 9. Point restant et recommandation de maintenance

La modification prévue du workflow GitHub Actions n’a pas pu être poussée par le jeton actuel, car GitHub a refusé les mises à jour de `.github/workflows/validate.yml` sans permission `workflows`. Le site V1.0, ses ressources et son code ont été publiés ; seule cette adaptation du workflow n’a pas été livrée à distance. Un propriétaire disposant de cette permission peut appliquer ultérieurement la version locale du workflow afin de lancer `npm run build` à chaque push.

Pour les évolutions futures, il est recommandé de conserver la règle éditoriale actuelle : ne pas ajouter de chiffres ou de cartographies sur le Bénin sans source primaire, année, unité et périmètre ; attribuer chaque photographie tierce ; et relancer `npm run build` avant toute publication. Une vérification manuelle complémentaire sur un téléphone réel aux largeurs 320 px, 375 px et 768 px reste conseillée avant une présentation institutionnelle à enjeu élevé.

## Références

[1] [FAO — Coffee in Benin, source historique](https://www.fao.org/4/x6939e/X6939e03.htm)  
[2] [Direction de la Statistique Agricole du Bénin](https://dsa.agriculture.gouv.bj/)  
[3] [Organisation internationale du café](https://ico.org/fr/)
