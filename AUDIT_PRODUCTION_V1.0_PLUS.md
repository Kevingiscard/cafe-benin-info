# Audit de production V1.0+ — Café Bénin

**Périmètre audité :** dépôt `Kevingiscard/cafe-benin-info`, branche `main`, architecture GitHub Pages statique.  
**Date :** 15 août 2026.  
**Méthode :** inventaire local des fichiers, scripts, ancres, assets, workflows et surfaces DOM, puis vérification de l’état de publication publique.

## État de référence conservé

Le produit est une encyclopédie statique en français. Son exécution côté client repose sur `index.html`, quatre feuilles CSS, `app.js`, `dictionary-v4.js`, `local-assistant.js` et `motion.js`. Les fonctions actuelles à préserver sont la navigation et les ancres, les thèmes clair/sombre, la recherche globale, le dictionnaire de 254 fiches, les favoris locaux, CaféBot local, la galerie, le formulaire de contribution vers une application e-mail et l’ancre historique `#coffee-shops`.

| Élément inventorié | État initial | Décision V1.0+ |
|---|---|---|
| Hébergement | GitHub Pages, chemin `/cafe-benin-info/` | Conserver |
| Runtime | HTML/CSS/JS locaux, sans API ni backend | Conserver et contrôler |
| Tests | 5 tests Node ciblés | Étendre aux régressions critiques |
| Validation | `scripts/validate.mjs` | Étendre à la sécurité, SEO, accessibilité et structure |
| Workflows | Un seul workflow `validate.yml` | Séparer CI, déploiement et surveillances |
| Dépendances | Aucune dépendance runtime | Ajouter un lockfile déterministe sans introduire de package inutile |
| PWA | Manifest présent, aucun service worker | Ne pas ajouter de cache applicatif fragile |

## Observations prioritaires

| Priorité | Constat vérifié | Impact | Correction prévue |
|---|---|---|---|
| Haute | Le seul workflow utilise `npm install` et ne lance pas la suite de tests complète. | Une régression peut atteindre `main` sans test. | Créer une CI avec `npm ci`, validation, tests, audits statiques et artefacts. |
| Haute | Aucun contrôle public réutilisable ne vérifie l’accueil, les assets essentiels et les ancres après une publication. | Une panne GitHub Pages ou une ressource cassée peut rester silencieuse. | Créer un script de santé avec délais, relances et sortie non nulle. |
| Haute | `dictionary-v4.js` construit des fiches et une modale avec `innerHTML`. | Une future donnée éditoriale non maîtrisée pourrait devenir une surface XSS. | Rendre les fiches, favoris, options et modale avec des nœuds DOM et `textContent`. |
| Moyenne | `.env.example` contient des exemples historiques Gemini, Supabase, Ollama et Gmail, alors que le produit est désormais autonome. | Confusion d’architecture et faux positifs de sécurité. | Retirer ce reliquat et l’interdire dans le validateur. |
| Moyenne | Aucun lockfile npm n’est suivi. | Installation non explicitement reproductible en CI. | Générer et suivre un `package-lock.json` minimal, puis employer `npm ci`. |
| Moyenne | Aucun fichier `404.html` cohérent n’est présent. | Les URL erronées ne disposent pas d’un retour utile. | Ajouter une page statique de récupération avec retour accueil et recherche. |
| Moyenne | Les tests actuels vérifient surtout la présence de code. | La plupart des parcours de navigation, stockage et sécurité ne sont pas protégés. | Ajouter des tests de structure, ancres, formulaires, themes, dictionnaire et protections DOM. |
| Basse | La police est servie par Google Fonts ; les références documentaires sont externes. | Dépendances réseau non critiques. | Garder les fallbacks, contrôler les liens externes avec tolérance aux erreurs temporaires. |

## Contrôles déjà satisfaits

Le site public est statique, sans endpoint applicatif ni clé API. CaféBot répond localement et les assets éditoriaux essentiels sont locaux. Le thème s’amorce avant le rendu et la navigation mobile, la recherche et les modales possèdent une gestion clavier. Le manifest ne référence pas de service worker, ce qui évite une couche de cache supplémentaire non contrôlée. Les liens internes actuellement utilisés sont explicitement inventoriés et devront rester présents.

## Contraintes de sécurité et d’automatisation

Les futurs workflows n’utiliseront pas `pull_request_target`, disposeront de permissions minimales et n’exécuteront aucun script distant arbitraire. Les contrôles récurrents GitHub Actions seront déterministes : santé, liens, sécurité de dépendances et budgets statiques. Ils ne modifieront jamais le contenu scientifique, les sources, les médias ni la direction artistique. Dependabot pourra proposer des mises à jour dans des pull requests ; aucune mise à jour majeure ne sera fusionnée automatiquement.

Les scans externes seront relancés avant un échec définitif et les erreurs HTTP transitoires seront distinguées des liens définitivement cassés. La création d’issue automatique sera limitée aux échecs confirmés, avec recherche préalable d’une issue ouverte de même nature.

## Critères de sortie

La release V1.0+ ne sera considérée comme prête qu’après validation locale, tests, audit de sécurité raisonnable, smoke test du site public, contrôle des ancres et confirmation que les workflows de production sont présents dans le dépôt. Les éléments qu’un environnement GitHub donné empêcherait de publier seront explicitement signalés, sans être présentés comme actifs.

## Références de mise en œuvre

Les workflows Pages suivent la documentation GitHub sur les workflows personnalisés : `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4` et `actions/deploy-pages@v4`, avec les permissions `pages: write` et `id-token: write` limitées au seul job de déploiement.[1] La configuration Dependabot utilise le format `version: 2`, avec des écosystèmes explicitement définis et une fréquence de contrôle planifiée.[2] Les workflows limitent les permissions du `GITHUB_TOKEN` au besoin de chaque job conformément au principe du moindre privilège.[3]

[1] [GitHub Docs — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)  
[2] [GitHub Docs — Dependabot options reference](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)  
[3] [GitHub Docs — Use GITHUB_TOKEN for authentication in workflows](https://docs.github.com/actions/reference/authentication-in-a-workflow)
