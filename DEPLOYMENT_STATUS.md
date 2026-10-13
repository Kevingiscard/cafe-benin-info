# État de déploiement — Café Bénin

## Source de vérité
Le dépôt GitHub `Kevingiscard/cafe-benin-info`, branche `main`, est la source de vérité du site statique.

- Site principal : https://kevingiscard.github.io/cafe-benin-info/
- Miroir Vercel déclaré : https://cafe-benin-info.vercel.app/
- Dépôt : https://github.com/Kevingiscard/cafe-benin-info

## Dernière vérification du dépôt
Le commit `94840a36bb3b412ac098ee913c0ea0d9db35a160` a passé le workflow de validation et le workflow de déploiement GitHub Pages le 13 octobre 2026. Les liens vers les journaux sont disponibles dans l'onglet Actions du dépôt.

Le workflow de validation a été renforcé pour exécuter `npm run verify`, qui inclut les tests, les contrôles des assets, de l'accessibilité, du SEO, de la sécurité et des liens internes.

## Vercel
Le domaine Vercel est conservé comme miroir, mais son état de production doit être vérifié séparément dans le tableau de bord Vercel. La connexion Vercel disponible pendant la dernière intervention n'a pas autorisé l'accès au scope du compte ; aucun statut Vercel ne doit donc être présenté comme confirmé.

## Architecture
Le site public est statique. L'assistant documentaire `local-assistant.js` fonctionne sans API distante ni clé applicative. Le dépôt ne doit pas contenir de secrets actifs. Les procédures d'exploitation et de récupération sont conservées dans `docs/`.
