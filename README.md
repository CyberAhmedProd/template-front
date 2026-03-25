# Angular Professional Template

Une application Angular complète avec authentification, CRUD, et architecture modulaire.

## 🚀 Installation rapide

### Option 1: Script automatique (Linux/Mac)
```bash
./install.sh
```

### Option 2: Installation manuelle
```bash
# 1. Installer Angular CLI (si pas déjà fait)
npm install -g @angular/cli

# 2. Installer les dépendances
npm install

# 3. Lancer l'API mock
npm run api

# 4. Dans un autre terminal, lancer Angular
npm start

# Ou lancer les deux en même temps
npm run dev
```

## 🌐 Accès à l'application
- **Application**: http://localhost:4200
- **API Mock**: http://localhost:3000

## 🔑 Compte de test
- **Email**: admin@test.com
- **Password**: admin123

## Structure du projet
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/
│   │   ├── components/
│   │   └── models/
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   └── dashboard/
│   ├── layout/
│   │   ├── sidebar/
│   │   └── header/
│   └── app-routing.module.ts
```

## Fonctionnalités
- ✅ Authentification JWT simulée
- ✅ CRUD complet pour les utilisateurs
- ✅ Sidebar avec navigation
- ✅ Guards et interceptors
- ✅ Gestion d'erreurs globale
- ✅ Notifications (snackbar)
- ✅ Lazy loading
- ✅ Architecture modulaire