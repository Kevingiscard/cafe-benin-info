# État des déploiements

## Site officiel (gratuit)
**URL :** https://cafe-benin-info.edgeone.dev/

## Dernier état
- Branche `main` à jour
- Site public servi sur Tencent Cloud EdgeOne
- Workflow GitHub Actions `pages-deploy.yml` : validation automatique uniquement (`npm run verify`), aucune étape de publication
- Synchronisation `main` → EdgeOne : à confirmer dans la console Tencent (source d’origine, déclencheur, dernier déploiement et statut du build)
- Aucun domaine personnalisé actif (100 % gratuit)

## Prochaines étapes recommandées
1. Vérifier dans Tencent EdgeOne la source d’origine et le mécanisme de mise à jour
2. Comparer le commit `main` avec la version effectivement servie après publication
3. Tester les parcours clés sur mobile et desktop
