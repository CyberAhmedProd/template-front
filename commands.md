# Commandes de développement

## Installation initiale
```bash
# Installer Angular CLI globalement (si pas déjà fait)
npm install -g @angular/cli

# Installer les dépendances du projet
npm install
```

## Développement
```bash
# Lancer l'API mock (json-server) - Terminal 1
npm run api

# Lancer Angular en mode développement - Terminal 2
npm start

# Ou lancer les deux en même temps
npm run dev
```

## Build et production
```bash
# Build pour la production
npm run build

# Build en mode watch (développement)
npm run watch
```

## Tests
```bash
# Lancer les tests unitaires
npm test
```

## Accès à l'application
- Application Angular: http://localhost:4200
- API Mock (json-server): http://localhost:3000

## Compte de test
- Email: admin@test.com
- Mot de passe: admin123

## Structure des endpoints API
- GET /auth - Authentification
- GET /users - Liste des utilisateurs
- GET /users/:id - Utilisateur par ID
- POST /users - Créer un utilisateur
- PUT /users/:id - Modifier un utilisateur
- DELETE /users/:id - Supprimer un utilisateur