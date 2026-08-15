# Récupération de production

La récupération vise à remettre le site documentaire en service sans masquer la cause et sans perdre de contenu validé. Les scripts de santé et les rapports GitHub Actions doivent être consultés avant toute action.

| Situation | Première action | Récupération | Validation de sortie |
|---|---|---|---|
| Accueil ou asset critique en erreur | Ouvrir le rapport `health-report` et confirmer avec `npm run health`. | Revenir au dernier commit validé via un commit de revert dans GitHub ; ne pas réécrire l’historique partagé. | HTTP 200, ancres et assets critiques verts. |
| Déploiement Pages en échec | Lire les logs « Déploiement GitHub Pages ». | Corriger le release gate ou restaurer le dernier commit vert ; relancer le workflow. | URL d’environnement Pages et smoke test corrects. |
| Lien source 404/410 | Vérifier la source et le contexte éditorial. | Mettre à jour le lien vers une source équivalente vérifiable, ou le retirer. | `npm run check:links:external` passe. |
| Test, accessibilité ou SEO rouge | Reproduire localement avec la commande dédiée. | Corriger le composant ou la métadonnée concernée ; ajouter un test si le cas n’était pas couvert. | `npm run verify` passe. |
| Suspicion de secret | Ne pas repousser le secret et ne pas l’afficher dans une issue. | Révoquer le secret, le supprimer et examiner l’historique de dépôt. | `npm run check:security` passe et le fournisseur confirme la révocation. |
| Modification de contenu Bénin douteuse | Suspendre la publication éditoriale. | Réintroduire la formulation sourcée antérieure ou étiqueter « à vérifier ». | Source, période, unité et contexte explicités. |

> Une correction urgente reste soumise au release gate. Il est préférable de rétablir un commit vert clair que d’introduire une exception permanente dans les contrôles.

## Rollback GitHub Pages

Dans l’onglet **Actions**, identifiez la dernière exécution Pages réussie et son commit. Créez ensuite un revert du commit défaillant depuis GitHub ou localement, poussez le revert, puis attendez le déploiement du nouvel artefact. Cette méthode conserve une trace claire de l’incident et évite un `push --force` sur `main`.

Lorsque la publication bascule vers la source **GitHub Actions**, l’environnement `github-pages` protège la séquence artefact → déploiement selon la configuration officielle.[1]

## Référence

[1] [GitHub Docs — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
