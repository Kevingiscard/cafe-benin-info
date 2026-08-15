# Audit pré-refonte — Café Bénin

**Périmètre audité :** HTML, couches CSS, scripts de navigation et d’animation, dictionnaire, assistant local, ressources, tests, validation, workflow GitHub Pages et documentation. Cet audit précède toute refonte visuelle ou fonctionnelle.

## Synthèse

Le site dispose déjà d’une base éditoriale ambitieuse et d’un fonctionnement totalement statique compatible avec GitHub Pages. Ses atouts principaux sont le corpus documentaire, la navigation par ancres, le dictionnaire enrichi, les favoris locaux et l’assistant de recherche local. La dette la plus importante vient de la superposition de plusieurs générations de CSS et JavaScript, qui complique la cohérence visuelle, le futur mode clair/sombre, les tests et l’accessibilité.

| Domaine | Constat | Risque | Décision de refonte |
|---|---|---|---|
| Architecture CSS | `styles.css` définit un thème sombre, `v4.css` le remplace largement par un thème clair, puis `motion.css` force plusieurs couleurs et utilise des `!important`. | Contrastes incohérents et composants oubliés au changement de thème. | Centraliser les tokens et faire dépendre toutes les surfaces de `data-theme`. |
| Architecture JavaScript | `app-v3.js` concentre navigation, recherche, favoris, assistant, formulaire et un premier dictionnaire ; `dictionary-v4.js` redéfinit un dictionnaire plus complet. | Duplication de corpus et conflits de rendu. | Définir une seule source de vérité du dictionnaire, puis brancher recherche et favoris dessus. |
| Sections dynamiques | `motion.js` injecte `#voyage-visuel` et `#carnet` après le chargement. | Les ancres, le SEO, le focus et les tests sont plus fragiles. | Conserver les ancres mais intégrer ces sections dans le HTML statique. |
| Thèmes | Aucun sélecteur clair/sombre persistant n’existe. | La demande Light/Dark ne peut pas être satisfaite de manière cohérente. | Créer un bouton accessible, `data-theme`, persistance locale et détection du système. |
| Médias | Plusieurs images locales dépassent 2 à 7 Mo ; les images n’ont pas toutes de dimensions intrinsèques dans le HTML. | LCP, consommation mobile et décalages de mise en page. | Réduire les grands actifs utilisés, ajouter `width`/`height`, `sizes` et chargement critique explicite. |
| Galerie | La galerie utilise des redirections Wikimedia distantes et des crédits incomplets pour certains fichiers. | Dépendance réseau et attribution insuffisamment traçable. | Préserver uniquement les images avec source et licence documentées ; afficher contexte, auteur et source. |
| Accessibilité | La base est correcte (`lang`, labels, réduction de mouvement), mais le menu mobile et la recherche n’ont pas de focus trap, et les modales ne restaurent pas le focus. | Navigation clavier incomplète. | Ajouter le contrôle du focus, Escape, rôles de dialogue et états ARIA cohérents. |
| SEO | Title, description, canonical, robots et sitemap existent. Open Graph est partiel, l’image OG est relative et le schéma structuré est absent. | Partage social et compréhension sémantique perfectibles. | Ajouter OG/Twitter absolus et un schéma `WebSite` sobre. |
| Déploiement | GitHub Pages fonctionne sans serveur. Le workflow ne lance que la validation, pas les tests. | Régressions fonctionnelles non bloquées par CI. | Exécuter également `npm test` dans le workflow. |
| Fichiers hérités | `.env.example` décrit une ancienne architecture serveur. Il n’est pas chargé par le site statique. | Confusion de maintenance, sans impact sur le déploiement public. | Ne jamais l’utiliser côté navigateur ; documenter l’architecture statique dans le README. |

## Fonctionnalités à préserver

La refonte doit préserver, tester et améliorer les comportements suivants :

- Les liens historiques et les ancres éditoriales, y compris la compatibilité avec `#coffee-shops`.
- La recherche globale via le bouton et `Ctrl/Cmd + K`.
- Le dictionnaire, ses catégories, ses favoris persistants et l’ouverture d’une fiche.
- Les favoris stockés localement, sans compte utilisateur ni serveur.
- CaféBot local, ses suggestions, ses réponses documentaires et ses liens contextuels.
- Les recommandations de préparation locales.
- Le formulaire de contribution, qui prépare un e-mail vers `kevingiscard93@outlook.com` sans collecter de données sur un serveur.
- La compatibilité GitHub Pages, les sources éditoriales et l’attribution de la cérémonie éthiopienne.

## Priorités de mise à niveau

La refonte procédera dans cet ordre : d’abord établir les tokens et les deux thèmes, ensuite restructurer les éléments statiques et la navigation, puis consolider recherche/dictionnaire/favoris/CaféBot. Enfin, elle traitera images, données structurées, tests, liens, performance et validation dans le navigateur.

> **Règle éditoriale maintenue.** Aucune statistique, production, acteur, région, prix ou information contemporaine sur le Bénin ne sera ajoutée sans source, période et contexte vérifiables.
