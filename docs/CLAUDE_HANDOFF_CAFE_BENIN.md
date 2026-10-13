BRIEF TECHNIQUE — CAFÉ BÉNIN INFO

Dépôt : https://github.com/Kevingiscard/cafe-benin-info
Site GitHub Pages : https://kevingiscard.github.io/cafe-benin-info/
Site miroir Vercel déclaré : https://cafe-benin-info.vercel.app/
Branche principale : main
Dernier commit de référence au moment du brief : 252ed236b5e6e881d06f2593ab4c57ac91ff74b7

OBJECTIF
Auditer, corriger et fiabiliser uniquement le site Café Bénin Info. Examiner le dépôt réel avant de tirer des conclusions. Implémenter les corrections, exécuter les tests et fournir un compte rendu vérifiable.

ARCHITECTURE
Site statique HTML/CSS/JavaScript, sans backend/runtime obligatoire. Principaux fichiers à inspecter : index.html, app.js, dictionary-v4.js, local-assistant.js, motion.js, motion.css, styles.css, v4.css, theme.css, manifest/service worker éventuel, img/, scripts/, tests/, .github/workflows/. Documents utiles : docs/OPERATIONS.md, docs/PRODUCTION_CHECKLIST.md, docs/RECOVERY.md, docs/SECURITY.md, docs/TESTING.md, content-sources.md.

FONCTIONNALITÉS À PRÉSERVER
- Encyclopédie et contenus sur le café au Bénin.
- Recherche globale (Ctrl/Cmd+K) et dictionnaire.
- Favoris enregistrés dans le navigateur.
- CaféBot local/hors ligne, sans clé/API externe.
- Recommandations de boissons.
- Modes clair/sombre.
- Préparation de contributions par e-mail.
- PWA/offline et gestion correcte du sous-chemin GitHub Pages /cafe-benin-info/.
- Accessibilité clavier, focus visibles et prise en charge prefers-reduced-motion.

CONSIGNES DE VÉRIFICATION
1. Inspecter le dépôt et les scripts réels avant toute modification.
2. Installer les dépendances selon le lockfile si présent, par exemple : npm ci --ignore-scripts.
3. Lancer les vérifications documentées. Les commandes attendues dans l’historique sont `npm run verify` et `npm run health` ; confirmer qu’elles existent avant usage.
4. Vérifier liens locaux, chemins et assets, console JS, responsive mobile/desktop, accessibilité, SEO, métadonnées, PWA/manifest/service worker, navigation clavier, recherche/dictionnaire/favoris/CaféBot et URLs sous GitHub Pages.
5. Évaluer la sécurité et les workflows GitHub Actions. Ne jamais exposer secrets ou ajouter clés côté client.
6. Ne jamais inventer des données, producteurs, chiffres ou faits concernant le café béninois. Ajouter des sources fiables pour les nouvelles affirmations.
7. Contrôler le déploiement GitHub Pages et les logs Actions.
8. Vérifier séparément Vercel : dépôt Git connecté, branche `main`, configuration de site statique, derniers déploiements/logs et alias `cafe-benin-info.vercel.app`. Un précédent accès au compte Vercel avait échoué (403), donc ne pas affirmer que Vercel fonctionne sans preuve actuelle.

PRÉCAUTIONS
- Faire une sauvegarde logique via branche et commits propres avant changements significatifs.
- Éviter les refontes inutiles ; corriger par priorité : blocage/crash, fonctionnalités, sécurité, accessibilité, performances, SEO, qualité visuelle.
- Ne pas supprimer de contenu/fichier sans prouver qu’il est obsolète.
- Le dossier `umami/` existe dans le dépôt et semble pouvoir être un projet distinct lié à un restaurant ; ne pas le supprimer, fusionner ou modifier sans vérifier sa relation au site Café Bénin Info.
- Ne pas déclarer « tout est corrigé » sans tests et vérification en production.

LIVRABLES ATTENDUS
- Liste des problèmes classés par criticité, avec preuves.
- Corrections implémentées avec changements minimaux et explication.
- Résultat des tests avec commandes, succès/échecs et limites.
- État du déploiement GitHub Pages et état de Vercel, en distinguant clairement ce qui a été vérifié de ce qui ne l’a pas été.
- Liste des risques résiduels et recommandations prioritaires.

Référence de commit précédente : 252ed236b5e6e881d06f2593ab4c57ac91ff74b7. Revalider le SHA actuel et travailler sur l’état réel du dépôt.