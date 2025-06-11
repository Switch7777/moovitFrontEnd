# MooveIt - App de coaching sportif

Bienvenue sur le dépôt **MooveIt**, une application mobile de coaching sportif développée avec **React Native** et **Expo**, intégrant un onboarding dynamique, un système de progression par niveaux, des activités sportives adaptées, et une personnalisation complète de l'expérience utilisateur.

---

## 🚀 Fonctionnalités principales

- Onboarding intelligent avec questions dynamiques (type, âge, objectifs...)
- Authentification email + Google Sign-In
- Recommandation d'activités sportives adaptées
- Progression par niveaux avec sauvegarde des stats (XP, calories...)
- Géolocalisation de la ville de l'utilisateur
- Upload de photo de profil

---

## 📱 Stack technique

### Frontend
- **React Native** (avec **Expo**)
- **Redux Toolkit** pour la gestion de l’état
- **Redux Persist** pour la persistance locale
- **React Navigation** pour la navigation entre les écrans
- **@env** pour les variables d’environnement

### UI / Responsive
- `react-native-responsive-dimensions`
- `expo-font` pour la gestion des polices
- `react-native-safe-area-context` pour l’affichage multi-plateforme

### Autres
- `expo-image-picker` (upload d’avatar)
- `@react-native-async-storage/async-storage`
- Requêtes HTTP via `fetch`

---

## 🔧 Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/Switch7777/moovitFrontEnd.git
cd moovitFrontEnd
```

### 2. Installer les dépendances

# yarn install

### 3. Lancer l’application Expo
```bash
npx expo start
```

> ⚠️ Assure-toi d’avoir un `.env` avec la variable `API_URL` vers ton backend.

---

## 🗂️ Structure du projet

```
├── components/             # Composants UI (formulaires, boutons, etc.)
├── reducers/               # Redux slices (user, onboarding)
├── screens/                # Écrans principaux de l'app
├── assets/                 # Images et polices
├── App.js                  # Entrée de l'app
├── .env                    # Variables d'environnement
```

---

## 🔐 Authentification
- SignIn classique avec email / mot de passe
- Google Sign-In via `expo-auth-session` (ou `@react-native-google-signin/google-signin` si natif)
- Token temporaire `provToken` utilisé pendant l’onboarding

---

## 🧠 À venir

- Intégration de l’API météo pour les recommandations en temps réel
- Système de planning hebdo et notifications push
- Tableau de bord personnalisé avec statistiques graphiques
- Mode hors-ligne

---


## 📩 Contact
Développé par **Sami Allaoui** dans le cadre du projet de fin de formation *Concepteur Développeur d'Applications Web & Mobile - La Capsule*. Pour toute question : `sami.allaoui@protonmail.com`

---



---

## 📝 Licence
Projet à but éducatif - Tous droits réservés © 2025
