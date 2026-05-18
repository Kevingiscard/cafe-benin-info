# 📱 Guide de Déploiement Mobile : Café Bénin (v13.0)

Ce guide est conçu pour transformer votre portail web en une application mobile native (iOS & Android) en moins de 30 minutes, même si vous n'avez jamais codé d'application mobile.

---

## 🚀 Étape 1 : Prérequis (5 minutes)
*Ces outils sont gratuits et indispensables.*

1. **Installer Node.js** : Téléchargez la version "LTS" sur [nodejs.org](https://nodejs.org/).
2. **Créer un compte Expo** : Allez sur [expo.dev](https://expo.dev/) et inscrivez-vous. C'est l'outil qui va construire votre application.
3. **Créer un compte Supabase** : Allez sur [supabase.com](https://supabase.com/) pour stocker vos données de café.

---

## 📦 Étape 2 : Initialisation (5 minutes)

Ouvrez votre terminal (ou invite de commande) et tapez :

```bash
# 1. Créer le projet mobile
npx create-expo-app CafeBeninMobile --template typescript

# 2. Entrer dans le dossier
cd CafeBeninMobile

# 3. Installer les outils nécessaires
npx expo install react-native-maps react-native-mmkv @tanstack/react-query expo-location
```

---

## 🔐 Étape 3 : Configuration des Clés (10 minutes)

1. **Supabase** :
   - Créez un projet "CafeBenin" sur Supabase.
   - Copiez l'**URL** et la **Clé Anon** depuis *Project Settings > API*.
   - Créez un fichier `.env` à la racine de votre projet mobile et collez :
     ```env
     EXPO_PUBLIC_SUPABASE_URL=votre_url_ici
     EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_ici
     ```

2. **Google Maps** (Optionnel pour le développement) :
   - Pour Android, vous aurez besoin d'une clé API Google Maps pour la version finale.

---

## 🧪 Étape 4 : Test sur votre Téléphone (5 minutes)

1. Installez l'application **"Expo Go"** sur votre iPhone ou Android.
2. Dans votre terminal, tapez :
   ```bash
   npx expo start
   ```
3. Scannez le QR Code avec votre téléphone. **Magie !** Votre application s'ouvre.

---

## 🏗️ Étape 5 : Création du fichier final (Build)

Pour créer le fichier que vous installerez sur votre téléphone ou mettrez sur les stores :

```bash
# Installer l'outil de build
npm install -g eas-cli

# Se connecter
eas login

# Lancer la création pour Android (APK)
eas build --platform android --profile preview
```

Une fois terminé, Expo vous donnera un lien pour télécharger votre application `.apk`.

---

## ✨ Conseils de Pro pour Kevin
- **Images** : Remplacez les icônes dans le dossier `assets/` par vos propres logos de Café Bénin.
- **Mises à jour** : Une fois l'app installée, vous pouvez mettre à jour le contenu instantanément sans que l'utilisateur n'ait à retélécharger l'app (grâce à Expo Updates).

**Fait avec ❤️ pour Café Bénin par Manus.**
