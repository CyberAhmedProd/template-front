# Guide Technique - Angular Professional Template

## 🏗️ Architecture

### Structure des dossiers
```
src/app/
├── core/                    # Services et utilitaires globaux
│   ├── services/           # Services métier (API, Auth, etc.)
│   ├── guards/             # Guards de navigation
│   └── interceptors/       # Interceptors HTTP
├── shared/                 # Composants et modèles partagés
│   ├── components/         # Composants réutilisables
│   └── models/            # Interfaces TypeScript
├── features/              # Modules fonctionnels
│   ├── auth/              # Authentification
│   ├── users/             # Gestion des utilisateurs
│   └── dashboard/         # Tableau de bord
├── layout/                # Composants de mise en page
│   ├── sidebar/           # Menu latéral
│   ├── header/            # En-tête
│   └── main-layout/       # Layout principal
└── app-routing.module.ts  # Configuration des routes
```

## 🔧 Services Core

### AuthService
- Gestion de l'authentification JWT
- Stockage sécurisé des tokens
- Observable pour l'état de connexion

### ApiService
- Service générique pour les appels HTTP
- Méthodes CRUD standardisées
- Gestion centralisée des endpoints

### NotificationService
- Notifications toast avec Angular Material
- Types: success, error, info, warning
- Configuration centralisée

### LoadingService
- Gestion globale des états de chargement
- Compteur de requêtes actives
- Observable pour l'affichage du loader

## 🛡️ Sécurité

### Guards
- **AuthGuard**: Protection des routes privées
- **LoginGuard**: Redirection si déjà connecté

### Interceptors
- **AuthInterceptor**: Ajout automatique du token JWT
- **ErrorInterceptor**: Gestion centralisée des erreurs HTTP
- **LoadingInterceptor**: Affichage automatique du loader

## 🎨 UI/UX

### Angular Material
- Thème: Indigo-Pink
- Composants: Cards, Tables, Forms, Buttons, Icons
- Responsive design

### Layout
- Sidebar fixe à gauche (250px)
- Header fixe en haut
- Zone de contenu scrollable
- Design adaptatif mobile

## 📊 Gestion des données

### Modèles TypeScript
```typescript
interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}
```

### API Mock (json-server)
- Endpoints RESTful automatiques
- Base de données JSON
- Simulation d'authentification

## 🚀 Fonctionnalités

### Authentification
- [x] Login/Logout
- [x] Token JWT simulé
- [x] Persistance localStorage
- [x] Guards de protection

### CRUD Utilisateurs
- [x] Liste avec pagination
- [x] Création/Modification
- [x] Suppression avec confirmation
- [x] Validation des formulaires

### Dashboard
- [x] Statistiques en temps réel
- [x] Actions rapides
- [x] Utilisateurs récents

### Navigation
- [x] Lazy loading des modules
- [x] Routes protégées
- [x] Menu responsive

## 🔄 Flux de données

### Authentification
1. Utilisateur saisit ses identifiants
2. AuthService vérifie avec l'API mock
3. Token stocké dans localStorage
4. Redirection vers le dashboard
5. AuthGuard protège les routes privées

### CRUD Utilisateurs
1. UserService appelle l'API via ApiService
2. LoadingService affiche le loader
3. Données affichées dans les composants
4. NotificationService confirme les actions

## 🧪 Tests et Qualité

### Bonnes pratiques implémentées
- Separation of concerns
- Services injectables
- Composants standalone
- TypeScript strict
- Gestion d'erreurs centralisée
- Code modulaire et réutilisable

## 📱 Responsive Design

### Breakpoints
- Desktop: > 768px
- Mobile: ≤ 768px

### Adaptations mobiles
- Sidebar collapsible
- Tables scrollables
- Formulaires empilés
- Boutons pleine largeur

## 🔧 Configuration

### Environnements
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Styles globaux
- Variables CSS personnalisées
- Classes utilitaires
- Thème Angular Material
- Styles pour notifications

## 📈 Performance

### Optimisations
- Lazy loading des modules
- OnPush change detection (où applicable)
- Standalone components
- Tree shaking automatique
- Minification en production

## 🛠️ Développement

### Scripts npm
```json
{
  "start": "ng serve",
  "api": "json-server --watch db.json --port 3000",
  "dev": "concurrently \"npm run api\" \"ng serve\"",
  "build": "ng build"
}
```

### Commandes utiles
```bash
# Générer un composant
ng generate component features/example

# Générer un service
ng generate service core/services/example

# Build de production
npm run build
```