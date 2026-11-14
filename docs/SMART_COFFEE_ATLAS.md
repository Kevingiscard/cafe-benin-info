# Architecture Smart Coffee Atlas

## Objectif
Réunir l’encyclopédie, le dossier Bénin, l’observatoire, les outils pratiques, le dictionnaire et l’assistant documentaire dans une seule expérience web cohérente.

## Fonctionnement actuel
- Site statique : aucune base de données ni serveur métier requis pour consulter les contenus.
- PWA : manifeste installable et service worker limité au sous-chemin du projet.
- Hors ligne : pages publiques du sitemap et ressources essentielles mises en cache à l’installation ; les ressources consultées ensuite sont mises en cache à la demande.
- Navigation : accueil, recherche globale, thème clair/sombre et menu mobile partagés.
- CaféBot : assistant local guidé par règles et thèmes documentaires. Il n’est pas présenté comme un grand modèle de langage.
- Données personnelles : favoris, progression et carnet restent dans le navigateur ; aucune synchronisation distante implicite.

## Limites hors ligne
La première installation et le premier remplissage du cache nécessitent une connexion. Les polices externes et les contenus qui n’ont pas été mis en cache peuvent manquer hors ligne. Les pages textuelles et les ressources locales sont prioritaires ; les images lourdes sont mises en cache à leur première consultation.

## Place de LiteRT
LiteRT Google Play Services cible une intégration Android native. Il ne peut pas être importé tel quel dans une page GitHub Pages/PWA. Pour le web, il faudra sélectionner une voie compatible navigateur, vérifier les navigateurs et les capacités WebGPU/CPU, puis choisir un modèle au format et à la licence compatibles. Pour Android natif, LiteRT via Google Play Services est une piste distincte.

Aucune inférence LiteRT n’est activée dans cette version : aucun modèle .tflite ou modèle de langage compatible n’est livré. Cette limite évite de télécharger un modèle volumineux sans consentement ni de promettre une fonction qui n’a pas encore été validée.

## Évolutions possibles
1. Choisir un modèle botanique spécialisé compact, documenter ses données d’entraînement et sa licence.
2. Mesurer son poids, sa latence, sa mémoire et sa précision sur des appareils Android modestes.
3. Ajouter un téléchargement à la demande, avec progression, annulation et suppression locale.
4. Garder le mode documentaire local fonctionnel lorsque le modèle ou le GPU est indisponible.
5. N’ajouter une API cloud qu’avec un backend sécurisé ; ne jamais placer une clé secrète dans le JavaScript public.

## Contrôles
\`npm run verify\` exécute les validations, tests, contrôles d’accessibilité, sécurité, référencement, ressources, liens et cohérence PWA.
