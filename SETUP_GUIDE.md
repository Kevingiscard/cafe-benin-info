# 📖 Guide de Configuration - Café Bénin Portail Next-Gen

Bienvenue ! Ce guide vous aidera à configurer votre portail café avec **Formspree** pour les notifications et **Vercel** pour l'hébergement.

---

## 🚀 Étape 1 : Configurer Formspree pour les Notifications

### Qu'est-ce que Formspree ?
Formspree est un service qui capture les messages de votre formulaire de contact et vous les envoie par email (et peut les intégrer à Instagram via des webhooks).

### Comment faire ?

1.  **Allez sur [Formspree.io](https://formspree.io/forms)**
2.  **Cliquez sur "Create"** pour créer un nouveau formulaire
3.  **Remplissez les informations** :
    - **Email** : Votre email personnel (ex: kevin@example.com)
    - **Project Name** : "Café Bénin" ou ce que vous voulez
4.  **Cliquez sur "Create Form"**
5.  **Vous verrez un ID de formulaire** (ex: `f1a2b3c4d5e6f7g8`)
6.  **Copiez cet ID**

### Intégrer l'ID dans votre site

1.  **Ouvrez votre dépôt GitHub** : [github.com/Kevingiscard/cafe-benin-info](https://github.com/Kevingiscard/cafe-benin-info)
2.  **Appuyez sur la touche `.` (point)** pour ouvrir l'éditeur en ligne
3.  **Ouvrez le fichier `index.html`**
4.  **Trouvez cette ligne** (environ ligne 355) :
    ```html
    <form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    ```
5.  **Remplacez `YOUR_FORM_ID`** par votre ID Formspree (ex: `f1a2b3c4d5e6f7g8`)
6.  **Cliquez sur l'icône "Source Control"** à gauche (symbole avec nœuds)
7.  **Écrivez un message** : "Intégration Formspree"
8.  **Cliquez sur "Commit & Push"**

✅ **Voilà !** Vos messages de contact arriveront maintenant à votre email.

---

## 🌐 Étape 2 : Déployer sur Vercel (Gratuit & Ultra-Rapide)

### Qu'est-ce que Vercel ?
Vercel est une plateforme d'hébergement gratuite, plus rapide que GitHub Pages, avec un déploiement automatique.

### Comment faire ?

1.  **Allez sur [Vercel.com](https://vercel.com)**
2.  **Cliquez sur "Sign Up"** et connectez-vous avec votre compte GitHub
3.  **Autorisez Vercel** à accéder à vos dépôts GitHub
4.  **Cliquez sur "Import Project"**
5.  **Sélectionnez le dépôt** `Kevingiscard/cafe-benin-info`
6.  **Cliquez sur "Import"**
7.  **Vercel va analyser votre projet** (aucune configuration nécessaire, c'est un site statique)
8.  **Cliquez sur "Deploy"**
9.  **Attendez 1-2 minutes** et voilà ! Votre site est en ligne sur Vercel 🎉

### Votre nouveau lien Vercel
Une fois déployé, vous aurez un lien comme :
```
https://cafe-benin-info.vercel.app
```

Vous pouvez aussi **ajouter votre propre domaine** (ex: `www.cafebenin.com`) dans les paramètres Vercel.

---

## 📝 Étape 3 : Modifier Votre Site (Facile !)

### Pour ajouter du contenu, des images ou faire des mises à jour :

1.  **Allez sur votre dépôt GitHub** : [github.com/Kevingiscard/cafe-benin-info](https://github.com/Kevingiscard/cafe-benin-info)
2.  **Appuyez sur `.` (point)** pour ouvrir l'éditeur
3.  **Modifiez les fichiers** :
    - **`index.html`** : Texte et structure
    - **`style.css`** : Design et couleurs
    - **`img/`** : Ajoutez vos images ici
4.  **Sauvegardez** : Cliquez sur "Source Control" → "Commit & Push"
5.  **Vercel redéploie automatiquement** en 1-2 minutes ✨

---

## 🎯 Intégration Instagram (Optionnel mais Puissant)

Si vous voulez que les messages du formulaire arrivent **directement sur votre Instagram** `@kevin48life` :

1.  **Allez sur [Make.com](https://www.make.com)** (anciennement Integromat)
2.  **Créez un nouveau scénario** (workflow)
3.  **Connectez Formspree** → **Instagram Direct Message**
4.  **Testez et activez**

Cela nécessite un peu plus de configuration, mais c'est très puissant !

---

## 📊 Tableau de Bord Vercel

Une fois sur Vercel, vous avez accès à :
- **Analytics** : Voir qui visite votre site
- **Deployments** : Historique de vos déploiements
- **Settings** : Domaines personnalisés, variables d'environnement, etc.

---

## ❓ FAQ

**Q : Combien ça coûte ?**
A : **Gratuit !** Formspree et Vercel offrent des plans gratuits généreux.

**Q : Mon site sera-t-il rapide ?**
A : **Oui !** Vercel est connu pour sa vitesse ultra-rapide. Votre site chargera en moins d'une seconde.

**Q : Puis-je utiliser mon propre domaine ?**
A : **Oui !** Vercel vous permet d'ajouter un domaine personnalisé dans les paramètres.

**Q : Que se passe-t-il si je fais une erreur ?**
A : Pas de panique ! GitHub garde l'historique de tous vos changements. Vous pouvez toujours revenir à une version antérieure.

---

## 🎉 Vous êtes Prêt !

Votre portail café est maintenant :
✅ **Moderne et intuitif**
✅ **Hébergé gratuitement sur Vercel**
✅ **Avec notifications Formspree**
✅ **Facile à mettre à jour**

Profitez-en bien et n'hésitez pas à me contacter si vous avez des questions ! ☕✨
