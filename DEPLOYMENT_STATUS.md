# État des déploiements — Café Bénin

## Adresse officielle

Le dépôt GitHub Kevingiscard/cafe-benin-info, branche main, est la source unique. Le site officiel et son URL canonique sont : https://kevingiscard.github.io/cafe-benin-info/.

## Constat du 27 octobre 2026, avant la réunification

- GitHub Pages répondait HTTP 200. Son HTML, de 44 048 octets, correspondait au fichier index.html de main; son en-tête indiquait une publication datée du 13 octobre 2026.
- L’URL Vercel répondait HTTP 200, mais servait un HTML différent de main (39 267 octets), qui chargeait backend-client.js v4 et app-v3.js, absents de main.
- Le statut Vercel associé au dernier commit main était en échec. Le lien public restait accessible via une version déjà déployée; cela ne prouvait pas une synchronisation avec GitHub.
- La connexion Vercel disponible ne donnait pas accès au projet cafe-benin-info. Sa branche de production, sa racine et ses journaux n’ont donc pas pu être vérifiés.

## Réunification

Le fichier vercel.json dans main redirige toutes les routes Vercel vers l’URL officielle. Cela ne prendra effet qu’après un déploiement Vercel qui utilise main. GitHub Pages, lui, est publié automatiquement par GitHub Actions après validation d’un push sur main.

## Action restante dans Vercel

Dans le tableau de bord Vercel, reconnecter Kevingiscard/cafe-benin-info, choisir main comme branche de production et la racine comme répertoire. Garder le build statique sans commande ni framework; lancer un déploiement, puis vérifier que cafe-benin-info.vercel.app redirige vers le site officiel.

Après toute fusion, vérifier l’exécution des workflows GitHub Actions et la date de publication Pages. Ne pas annoncer que l’alias Vercel est synchronisé tant que son redéploiement et sa redirection n’ont pas été confirmés.