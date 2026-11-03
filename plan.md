# Plan de refonte — Café Bénin v2 documentaire

## Objectif

Faire évoluer Café Bénin d’une encyclopédie statique enrichie vers un portail documentaire plus structuré, interactif, actualisable et transparent sur ses niveaux de preuve.

## Périmètre livré

- créer une page `observatoire.html` dédiée aux données, tendances, chronologies et méthodes ;
- séparer explicitement les données mondiales, béninoises historiques et béninoises récentes ;
- afficher les unités, années, éditeurs, dates de consultation et niveaux de confiance ;
- ajouter des graphiques SVG interactifs sans dépendance externe ;
- ajouter un convertisseur sacs/tonnes et un comparateur de périmètres statistiques ;
- ajouter une frise historique du café au Bénin et du café mondial ;
- ajouter trois schémas pédagogiques : chaîne du café, extraction, lecture des preuves ;
- enrichir la navigation et les pages existantes avec un lien vers l’Observatoire ;
- documenter les nouvelles sources dans `content-sources.md` et les nouvelles données dans `data/coffee-observatory.js` ;
- conserver les protections : aucune donnée personnelle inventée, aucun chiffre béninois présenté sans réserve, aucune photo générée présentée comme reportage.

## Architecture

- `observatoire.html` : page éditoriale et interface visible ;
- `observatoire.js` : données, graphiques, filtres, convertisseur, interactions ;
- `observatoire.css` : composants propres à la page ;
- `data/coffee-observatory.js` : objets de données et métadonnées éditoriales ;
- `img/coffee-chain-diagram.svg`, `img/extraction-flow.svg`, `img/evidence-ladder.svg` : schémas déterministes ;
- `scripts/check-site.mjs`, `scripts/check-seo.mjs`, `scripts/check-a11y.mjs` : couverture étendue à la nouvelle page.

## Direction design choisie

Trois pistes considérées :

- **Atlas éditorial vivant** — probabilité 0,06 : données en panneaux, frise et cartes de preuve ;
- **Laboratoire de dégustation** — probabilité 0,04 : fiches techniques, mesures et interactions ;
- **Carnet documentaire** — probabilité 0,08 : notes, citations et photos de terrain.

Choix : **Atlas éditorial vivant**.

### Principes

1. Une donnée importante est toujours accompagnée de son année, son unité et sa source.
2. Le contenu doit distinguer observation, estimation historique, projection et absence de preuve.
3. Les graphiques sont lisibles sans couleur seule et restent utilisables au clavier.
4. Les interactions réduisent la complexité : filtre, détail au clic, conversion et comparaison.

### Philosophie couleur

Le brun torréfié sert de couleur de marque. Le vert feuille signale l’agronomie et la durabilité. Le bleu ardoise signale les données et la méthode. L’ambre signale une réserve ou une source secondaire, jamais une alerte sensationnaliste.

### Typographie et voix

DM Sans reste la police de l’interface. Les titres conservent le contraste display existant. Le ton est précis, accessible et honnête : « Ce que la source permet de dire » plutôt que « La vérité sur… ».

## Données intégrées

- FAO : monde 2024, plus de 11 Mt, valeur de production d’environ 25 Md USD, commerce supérieur à 34 Md USD, environ 8 Mt exportées, Arabica autour de 60 % ;
- USDA FAS : prévisions de production mondiale en années commerciales 2024/25 et 2025/26, en sacs de 60 kg ;
- Bénin : série 2021–2024 de café vert reprise par Africa API comme relais de FAOSTAT, 55,00 à 55,30 tonnes, affichée comme source secondaire à vérifier directement dans FAOSTAT ;
- décret béninois de 2001 : repères historiques 1960–1999, affichés comme données historiques ;
- OMS/BMJ : santé et grossesse, avec avertissement contre les promesses médicales ;
- climat : revue Plants 2022 et étude carbone 2020, contextualisées et non généralisées au Bénin.

## Contraintes

Ne pas publier une donnée béninoise comme nulle en cas d’absence de source. Ne pas mélanger année civile et année commerciale. Ne pas comparer tonnes de café vert, sacs de 60 kg, café torréfié et consommation intérieure sans afficher la conversion et le périmètre. Ne pas utiliser de données privées ou personnelles sur Kevin sans validation.

## Validation

Le build doit contrôler la nouvelle page, le nouveau JavaScript, les SVG et les liens externes. Les graphiques doivent être rendus en SVG accessible, les données tabulaires doivent être disponibles dans le HTML ou une vue accessible, et les interactions doivent fonctionner sans bibliothèque distante.
