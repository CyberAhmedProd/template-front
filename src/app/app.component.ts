import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-professional-template';

  constructor(private authService: AuthService) {
    // Pour les tests : nettoyer le localStorage au démarrage
    // Décommentez cette ligne pour tester la redirection vers login
    localStorage.clear();
    console.log('App started - localStorage cleared for testing');
  }

  // Méthode de test pour vérifier l'authentification
  testAuth() {
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Token:', this.authService.getToken());
    console.log('Current user:', this.authService.getCurrentUser());
  }
}