# DESIGN.md — Café Bénin

## Produit

Café Bénin est un portail documentaire francophone sur le café, avec un centre de gravité au Bénin et en Afrique de l’Ouest. Les visiteurs viennent lire, comparer des preuves, apprendre une méthode et retrouver une source.

## Mode des surfaces

- **Read** : articles, dossiers, dictionnaire et sources privilégient la compréhension.
- **Operate** : outils, calculateur, filtres et Observatoire privilégient la lisibilité et le retour immédiat.
- **Experience** : la galerie et les images donnent une présence sensible au sujet sans transformer une illustration en preuve.

## Direction

Un atlas éditorial chaleureux : fond brun presque noir, papier ivoire pour les zones de lecture, vert botanique pour les données et orange torréfaction pour les repères. La page doit évoquer un carnet de terrain édité, pas un tableau de bord générique.

## Règles visuelles

1. Une hiérarchie principale par écran : titre, explication, action.
2. Les données utilisent le vert botanique ; les repères de transformation utilisent l’orange ; ne pas colorer chaque élément.
3. Les images documentaires montrent leur source ou leur licence ; les images générées disent explicitement qu’elles sont illustratives.
4. Les cartes servent à regrouper une idée. Elles ne doivent pas remplacer une phrase ou une preuve.
5. Les marges et la ligne de lecture sont régulières sur mobile comme sur grand écran.
6. Une animation doit expliquer, confirmer ou guider. Elle ne doit jamais ralentir une action répétée.

## Tokens de référence

- Surface sombre : `#0b0a09`
- Surface claire : `#f4eee4`
- Texte principal : `#f7efe5`
- Texte secondaire : `#b9aea2`
- Accent botanique : `#496e5a`
- Accent torréfaction : `#d58a4d`
- Focus clavier : `#f0b66e`
- Rayon petit : `12px`
- Rayon carte : `18–22px`
- Interaction courte : `160–240ms`
- Courbe : `cubic-bezier(0.23, 1, 0.32, 1)`

## Contrôle avant publication

Tester les parcours à 1440, 768 et 390 px. Vérifier le premier écran, les marges, les images, les crédits, les états hover/focus/active, le clavier, la préférence de mouvement réduit, les champs invalides, le menu mobile et les longues données de l’Observatoire.
