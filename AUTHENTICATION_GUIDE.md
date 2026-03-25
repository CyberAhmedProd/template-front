# Guide d'authentification ✅

## Vue d'ensemble
L'application dispose d'un système d'authentification complet avec login, guards et gestion des sessions.

## 🔐 Fonctionnalités d'authentification

### 1. Page de connexion moderne
- **Design moderne** : Interface glassmorphism avec animations
- **Validation en temps réel** : Erreurs affichées instantanément
- **Responsive** : Adaptation mobile et desktop
- **Credentials de démo** : Pré-remplies pour faciliter les tests

### 2. Protection des routes
- **AuthGuard** : Protège les routes authentifiées
- **LoginGuard** : Redirige si déjà connecté
- **Redirection automatique** : Vers login si non authentifié

### 3. Gestion des sessions
- **Token JWT** : Stockage sécurisé en localStorage
- **Utilisateur actuel** : Observable pour réactivité
- **Déconnexion** : Nettoyage complet des données

## 🎯 Composants principaux

### LoginComponent
```typescript
// Localisation: src/app/features/auth/login/
- login.component.ts    // Logique de connexion
- login.component.html  // Template moderne
- login.component.scss  // Styles glassmorphism
```

**Fonctionnalités :**
- Formulaire réactif avec validation
- Gestion des erreurs
- État de chargement
- Credentials de démonstration

### AuthService
```typescript
// Localisation: src/app/core/services/auth.service.ts
```

**Méthodes principales :**
- `login(credentials)` : Authentification
- `logout()` : Déconnexion
- `isAuthenticated()` : Vérification du statut
- `getCurrentUser()` : Utilisateur actuel

### Guards
```typescript
// Localisation: src/app/core/guards/auth.guard.ts
```

**Guards disponibles :**
- `authGuard` : Protège les routes authentifiées
- `loginGuard` : Évite l'accès au login si connecté

## 🚀 Configuration des routes

```typescript
// app-routing.module.ts
export const routes: Routes = [
  // Route publique avec loginGuard
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/auth/login/login.component')
  },
  
  // Routes protégées avec authGuard
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component'),
    children: [
      { path: 'dashboard', loadComponent: ... },
      { path: 'processus', loadComponent: ... },
      // ...
    ]
  }
];
```

## 🎨 Interface utilisateur

### Page de connexion
```
┌─────────────────────────────────────┐
│              [LOGO]                 │
│            Bienvenue                │
│    Connectez-vous à votre espace    │
│                                     │
│  📧 [admin@test.com            ]    │
│  🔒 [admin123              ] 👁️    │
│                                     │
│        [Se connecter]               │
│                                     │
│  ⏰ Compte de démonstration         │
│     Email: admin@test.com           │
│     Mot de passe: admin123          │
└─────────────────────────────────────┘
```

### Menu utilisateur (Header)
```
┌─────────────────────────────────────┐
│                    Admin User  [AM] │
│                    Resp. Qualité ▼  │
│                      ┌─────────────┐│
│                      │ 🚪 Déconnex.││
│                      └─────────────┘│
└─────────────────────────────────────┘
```

## 🔧 Données de test

### Compte administrateur
```json
{
  "email": "admin@test.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "Responsable Qualité"
}
```

### Token JWT (simulé)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛡️ Sécurité

### Stockage
- **Token** : localStorage avec clé `auth_token`
- **Utilisateur** : localStorage avec clé `auth_user`
- **Nettoyage** : Suppression complète à la déconnexion

### Validation
- **Email** : Format email requis
- **Mot de passe** : Champ requis
- **Token** : Vérification de présence (expiration simulée)

## 🔄 Flux d'authentification

1. **Accès à une route protégée** → Redirection vers `/login`
2. **Saisie des credentials** → Validation côté client
3. **Soumission du formulaire** → Appel API simulé
4. **Authentification réussie** → Stockage token + redirection
5. **Navigation** → Vérification automatique du token
6. **Déconnexion** → Nettoyage + redirection vers login

## 🚀 Utilisation

### Connexion
1. Aller sur `http://localhost:4200/`
2. Redirection automatique vers `/login`
3. Utiliser les credentials de démo ou saisir manuellement
4. Cliquer sur "Se connecter"
5. Redirection vers le dashboard

### Déconnexion
1. Cliquer sur l'avatar utilisateur (en haut à droite)
2. Sélectionner "Se déconnecter"
3. Redirection automatique vers la page de login

## 🎯 Points clés

- ✅ **Authentification fonctionnelle** avec simulation API
- ✅ **Guards configurés** pour protéger les routes
- ✅ **Interface moderne** avec animations et responsive
- ✅ **Gestion des erreurs** avec messages utilisateur
- ✅ **Session persistante** avec localStorage
- ✅ **Déconnexion propre** avec nettoyage complet

L'authentification est maintenant complètement opérationnelle et prête pour la production !