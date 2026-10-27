# Exploitation et publication

## Source de vérité

La branche main du dépôt GitHub est l’unique source du site officiel : https://kevingiscard.github.io/cafe-benin-info/. Les interactions courantes sont exécutées dans le navigateur; aucun serveur applicatif n’est requis. Les cinq routes statiques sont construites à partir du même dépôt et déployées ensemble.

## Automatisations réellement présentes

| Automatisation | Déclencheur | Fonction |
|---|---|---|
| Validation | Push vers main et pull request vers main | npm run verify : structure, tests, assets, taille, accessibilité, SEO, sécurité et liens internes. |
| Publication GitHub Pages | Push vers main, après validation | Déploie la racine statique du dépôt. |
| Dependabot npm | Mensuel | Propose des mises à jour du verrouillage npm. |
| Dependabot GitHub Actions | Hebdomadaire | Propose des mises à jour de workflows. |

Aucun workflow de surveillance quotidienne, de contrôle hebdomadaire des liens externes ou de création automatique d’issues n’est présent dans le dépôt. Les liens externes se contrôlent à la demande.

## Contrôles locaux

| Commande | Rôle |
|---|---|
| npm ci --ignore-scripts | Installe les dépendances verrouillées sans scripts de paquet. |
| npm run verify | Exécute le release gate local complet et les liens internes. |
| npm run check:links:external | Vérifie les références externes avec le réseau; les indisponibilités temporaires doivent être revérifiées. |
| npm run health | Vérifie l’URL publique, les ancres, scripts, manifeste, robots, sitemap et images-clés. |

Le contrôle public de santé et les liens externes sont des opérations manuelles; ils ne sont pas planifiés par GitHub Actions. Les nouvelles pages statiques suivent le déploiement normal de GitHub Pages.

## GitHub Actions et jetons

Les workflows de validation ne reçoivent que contents: read. Le workflow Pages garde contents: read au niveau général, puis attribue pages: write et id-token: write uniquement au job deploy. GitHub fournit au job un jeton d’exécution limité et un jeton OIDC temporaire pour la publication. Aucun PAT n’est stocké dans le dépôt.

## Unifier l’ancienne adresse Vercel

Le fichier vercel.json redirige toutes les routes de l’ancien domaine Vercel vers le site officiel GitHub Pages. Pour que cette redirection et les prochaines mises à jour fonctionnent, le projet Vercel doit être relié à Kevingiscard/cafe-benin-info, avec main comme branche de production et la racine du dépôt comme répertoire. Cette association n’a pas pu être confirmée depuis la connexion Vercel disponible.

Une fois l’association faite, tout commit fusionné sur main republiera GitHub Pages et déclenchera le déploiement Vercel; la règle de redirection présentera alors une seule adresse publique.

## Budgets médias et protection des visiteurs

Le contrôle d’assets bloque le dépôt si le total des images dépasse 7 Mo ou si une image dépasse son budget individuel. Les photos supplémentaires ne doivent être ajoutées qu’après vérification de leur provenance et de leur licence. Le site ne charge pas de service d’analytics. Le carnet et les préférences restent sur l’appareil; aucune synchronisation serveur ou multi-appareil n’est activée. La police est chargée depuis Google Fonts.