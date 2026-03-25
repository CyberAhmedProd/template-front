import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking authentication...');
  const isAuth = authService.isAuthenticated();
  console.log('AuthGuard: Is authenticated?', isAuth);
  console.log('AuthGuard: Token:', authService.getToken());

  if (isAuth) {
    console.log('AuthGuard: User is authenticated, allowing access');
    return true;
  }

  console.log('AuthGuard: User not authenticated, redirecting to login');
  // Redirection vers la page de connexion si non authentifié
  router.navigate(['/login']);
  return false;
};

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirection vers le dashboard si déjà authentifié
  router.navigate(['/dashboard']);
  return false;
};