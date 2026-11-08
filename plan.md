# Plan de refonte — Café Bénin, Atlas vivant du café

## Objectif

Refondre Café Bénin comme une plateforme documentaire francophone de référence : plus claire, plus immersive, plus visuelle et plus interactive, sans perdre les contenus existants, les sources, le dictionnaire, l’Observatoire ni les protections de confidentialité.

## Direction choisie

### Trois pistes

- **Atlas vivant du café** — probabilité 0,07 : grand récit visuel, cartes de connaissances, chapitres immersifs et données lisibles.
- **Laboratoire de dégustation** — probabilité 0,05 : mesures, outils, fiches techniques et comparaisons.
- **Carnet de terrain Bénin** — probabilité 0,08 : photographie documentaire, témoignages, terroirs et chronologies.

Choix : **Atlas vivant du café**, enrichi de modules de laboratoire et de terrain.

### Mouvement design

Éditorial muséal contemporain : grands plans, cartes topographiques, panneaux de preuve, marges de lecture et détails à révélation progressive. L’interface doit donner la sensation de parcourir une exposition documentée, pas un long article empilé.

### Principes

1. Le visiteur comprend en 10 secondes où commencer et peut ensuite descendre très loin dans le sujet.
2. Chaque donnée importante indique son statut : fait documenté, estimation, repère historique ou point à vérifier.
3. L’image explique une idée : botanique, transformation, torréfaction, extraction, dégustation ou filière.
4. Les interactions servent la lecture : cartes filtrables, accordéons, frises, recherche instantanée, comparaisons et vues accessibles.

### Philosophie couleur

Brun cacao pour l’histoire et la matière ; vert feuille pour le vivant et l’agronomie ; bleu minéral pour les preuves et les données ; corail torréfié pour les moments d’action. Le fond clair reste ivoire et le fond sombre devient espresso profond, avec des contrastes élevés et des bordures fines.

### Layout paradigm

Une composition en “récit vertical” : hero plein écran, bandeau de chiffres, navigation par chapitres, sections alternant pleine largeur et compositions asymétriques. Les cartes ne sont pas toutes identiques : grande carte manifeste, petites fiches, ruban horizontal et panneau latéral de contexte.

### Signature elements

- le **fil d’Ariane vivant** : une ligne de progression plante → fruit → grain → tasse qui suit la lecture ;
- les **cartes de preuve** : une source, une date et un niveau de confiance visibles en une ligne ;
- les **pastilles atlas** : repères numérotés qui ouvrent une explication sans faire disparaître le contenu.

### Interaction philosophy

Les animations sont courtes, explicatives et réversibles. Aucun texte documentaire ne dépend d’un reveal pour être visible. Les images peuvent se déplacer légèrement au survol, les panneaux s’ouvrir au clavier, les filtres mettent à jour les résultats sans rechargement, et le mode sombre/clair garde les mêmes repères.

### Animation

Transitions de 160–240 ms, mouvement doux et uniquement sur transform/opacity décoratifs. Respect de `prefers-reduced-motion`. Pas de rotation infinie, pas de texte qui clignote, pas de contenu rendu invisible au chargement.

### Typographie

DM Sans pour l’interface et les données ; une serif de contraste uniquement pour les grands titres et les citations. Les titres sont courts, les paragraphes respirent, les métriques sont tabulaires et les libellés restent lisibles sur mobile.

### Brand essence

**Le grand atlas francophone pour comprendre le café, avec le Bénin comme territoire d’attention et de preuve.** Personnalités : précis, chaleureux, curieux.

### Voix

- Titre : « Le café n’est pas une boisson. C’est une chaîne de transformations. »
- CTA : « Commencer par la plante » / « Voir ce que la source permet de dire ».

### Wordmark & logo

Conserver le monogramme circulaire C, mais le traiter comme un repère cartographique : cercle, point cardinal et ligne de progression plutôt qu’un simple badge.

### Couleur de marque

Corail torréfié `#c96b45`, utilisé avec parcimonie pour les actions et les points d’entrée.

## Architecture livrée

- `index.html` : nouvelle page d’accueil éditoriale et interactive.
- `redesign.css` : couche de design complète et responsive, chargée en dernier.
- `redesign.js` : progression, filtres de chapitres, atlas interactif, compteurs et micro-interactions.
- `img/atlas-*.jpg` : visuels générés avec un usage explicite dans l’interface.
- pages existantes conservées et progressivement harmonisées par la couche redesign.
- `manus-routes.json` : routes documentaires déclarées pour le preview.

## Contraintes conservées

Ne supprimer aucun contenu documentaire existant. Ne pas présenter une image générée comme une photographie de terrain. Garder les crédits, les sources, le RGPD, les CGU, les contrôles de liens, l’accessibilité clavier, le responsive et le mode clair/sombre.
