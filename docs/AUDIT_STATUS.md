# État de l’audit technique — Café Bénin

**Dernière vérification documentaire : 12 novembre 2026**  
**Dépôt :** [Kevingiscard/cafe-benin-info](https://github.com/Kevingiscard/cafe-benin-info)  
**Branche examinée :** `main`  
**Objet :** noter les preuves disponibles, les inconnues et les étapes de vérification. Ce document ne certifie pas les réglages privés des hébergeurs.

## Résumé

La branche `main` décrit un site statique GitHub Pages sans authentification de visiteurs ni API métier active. La publication est automatisée par GitHub Actions avec des permissions Pages et OIDC limitées au travail de déploiement.

L’ancienne intégration Vercel n’a pas pu être auditée côté compte : l’API Vercel a refusé l’accès au périmètre d’équipe `kevingiscardd-6768` (403). Le commit de la PR de documentation a un statut Vercel en échec. L’API GitHub Actions consultée sur le dernier commit de tête retourne zéro exécution associée ; le statut combiné ne retourne que l’intégration Vercel en échec. Cela ne prouve ni succès ni échec de validation, et peut signifier que l’exécution n’a pas été lancée ou n’est pas visible via la connexion.

## État par sujet

| Sujet | Ce qui est vérifié | Ce qui reste inconnu | Action requise |
|---|---|---|---|
| Authentification publique | Les pages/scripts de `main` examinés n’implémentent pas de compte, session ou jeton de visiteur. | Une version externe ancienne peut différer. | Comparer les déploiements hébergés au SHA source réellement relié. |
| API applicative | `api/README.md` et `api/openapi.yaml` décrivent un contrat préparatoire et un domaine factice. | Aucun service correspondant n’a été observé dans `main`; l’existence d’un ancien serveur Vercel n’a pas été confirmée. | Inspecter le projet et ses fichiers de déploiement après accès Vercel autorisé. |
| Actions de validation | Le workflow déclare un déclenchement par push et pull request vers `main`, `contents: read` et `npm run verify`. | Le statut combiné du commit de doc consulté n’a pas retourné de résultat Actions. | Lire l’exécution Actions associée à la PR et relever son SHA et sa conclusion. |
| Pages | Le workflow attend la validation, téléverse un artefact statique, puis déploie vers l’environnement `github-pages`. | Les paramètres privés Pages et les règles de protection de l’environnement n’ont pas été consultés. | Dans Settings → Pages/Environments, confirmer la source Actions et les restrictions de branche. |
| Vercel | Le dépôt inclut `vercel.json` qui décrit une redirection vers GitHub Pages. Le statut externe de la PR est en échec. | Dépôt Git relié, branche, build, variables, domaines, code API et cause détaillée de l’échec ne sont pas vérifiés. | Autoriser le connecteur Vercel pour l’équipe, inspecter sans exposer les secrets, puis documenter chaque résultat. |
| Secrets | `.env.example` dit qu’aucune variable n’est utilisée par `main`. Le workflow Pages ne déclare pas de secret applicatif. | Des secrets peuvent exister dans les réglages privés GitHub/Vercel ; leur présence n’est pas visible depuis le code seul. | Inventorier noms, portée et environnement depuis les interfaces autorisées ; ne jamais publier les valeurs. |
| Consentement | `cookie-consent.js` mémorise le choix localement. La page indique qu’aucun fournisseur d’audience n’est activé. | Aucun relevé réseau exhaustif de toutes les pages en production n’a été effectué. | Capturer les requêtes réseau ; aligner l’intitulé du bouton et la politique sur le comportement réel. |
| Ressources tierces | La police DM Sans est appelée depuis Google Fonts dans le code/documentation consultés. | Les requêtes de toutes les pages, y compris les intégrations indirectes en production, ne sont pas exhaustivement inventoriées. | Faire un audit réseau des pages principales et décider si les polices doivent être hébergées localement. |
| Données locales | Thème, favoris et choix de bannière sont documentés comme stockage navigateur. | Inventaire exhaustif de toutes les clés des carnets/outils et format de sauvegarde non consolidé ici. | Rechercher les accès à `localStorage`/IndexedDB, documenter les clés, leur durée, export et effacement. |

## Blocage Vercel

L’outil de lecture Vercel a retourné un refus HTTP 403 : l’accès au projet demandé dépend du périmètre `kevingiscardd-6768`. Aucune modification des réglages Vercel n’a été tentée. Pour continuer l’audit, l’accès de l’équipe doit être autorisé dans le connecteur Vercel, puis les lectures suivantes pourront être faites :

1. fiche du projet et liaison Git ;
2. branche de production, root directory et commandes de build ;
3. déploiements récents, SHA et journaux de la tentative échouée ;
4. domaines, alias et TLS ;
5. noms/cibles des variables d’environnement, sans lire ni copier leurs valeurs ;
6. fonctions/API incluses dans le déploiement ;
7. comportement HTTP réel des redirections à la racine et sur plusieurs chemins.

Si le but est de conserver Vercel uniquement comme redirection, confirmer d’abord le déploiement du `vercel.json` depuis le bon dépôt. Ne pas supprimer des secrets ou un projet avant d’identifier leurs consommateurs.

## Consentement et mesure d’audience

La bannière de confidentialité propose les actions « Continuer sans analytics » et « Autoriser la mesure », tandis que le texte embarqué indique qu’aucun fournisseur d’audience n’est activé dans cette version. Le script mémorise un booléen de choix ; il ne charge pas à lui seul un fournisseur d’analytics.

La correction à choisir est fonctionnelle et éditoriale :

- **Sans analytics** : présenter le choix comme un réglage ou une information, éviter de suggérer qu’une mesure peut être activée si aucun service ne l’est, et vérifier que la page de confidentialité décrit exactement le stockage local.
- **Avec analytics futur** : sélectionner un fournisseur, bloquer ses scripts et requêtes avant consentement, les charger après un consentement explicite, respecter le refus et la révocation, tester le comportement réseau et mettre à jour les informations de confidentialité avant activation.

Cette documentation ne remplace pas une validation juridique des obligations applicables.

## Séquence recommandée de clôture

- [ ] Lire les contrôles GitHub Actions de la PR et corriger toute erreur de validation.
- [ ] Ouvrir le diff final et intégrer la documentation une fois les contrôles exigés réussis.
- [ ] Vérifier le déploiement GitHub Pages et le rendu des pages documentaires.
- [ ] Autoriser l’accès Vercel à l’équipe concernée et terminer l’audit en lecture seule.
- [ ] Comparer Vercel au dépôt et décider si le projet reste une redirection ou est retiré de l’usage.
- [ ] Faire un inventaire réseau des pages et clarifier le bouton d’analytics.
- [ ] Recenser toutes les clés de stockage local et leurs options d’effacement/export.
- [ ] Si des comptes sont demandés plus tard, spécifier le modèle d’identité et les règles d’accès avant d’implémenter le backend.

## Sources du dépôt

- [Guide complet sur l’authentification et les jetons](AUTHENTICATION_AND_TOKENS.md)
- [Sécurité et vie privée](SECURITY.md)
- [Exploitation et publication](OPERATIONS.md)
- [Checklist de production](PRODUCTION_CHECKLIST.md)
- [Contrat API préparatoire](../api/openapi.yaml)
- [Workflow de validation](../.github/workflows/validate.yml)
- [Workflow de publication Pages](../.github/workflows/pages-deploy.yml)
