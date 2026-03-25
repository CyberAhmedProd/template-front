import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="topbar-user">
      <div style="text-align:right">
        <div class="topbar-user-name">{{currentUser?.name || 'Utilisateur'}}</div>
        <div class="topbar-user-role">Responsable Qualité</div>
      </div>
      <div class="topbar-user-av">{{getInitials()}}</div>
    </div>
  `,
  styles: [`
    .topbar-user {
      display: flex; 
      align-items: center; 
      gap: 8px;
      cursor: pointer; 
      padding: 5px 10px; 
      border-radius: var(--radius);
      transition: background 0.1s;
    }

    .topbar-user:hover { 
      background: rgba(255,255,255,0.1); 
    }

    .topbar-user-av {
      width: 28px; 
      height: 28px;
      background: rgba(255,255,255,0.22);
      border-radius: 50%;
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 11px; 
      font-weight: 700; 
      color: white;
    }

    .topbar-user-name { 
      font-size: 12.5px; 
      font-weight: 600; 
      color: white; 
    }

    .topbar-user-role { 
      font-size: 10.5px; 
      color: rgba(255,255,255,0.65); 
    }
  `]
})
export class HeaderComponent {
  currentUser$ = this.authService.currentUser$;
  
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  constructor(private authService: AuthService) {}

  getInitials(): string {
    const user = this.currentUser;
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  }

  logout(): void {
    this.authService.logout();
  }
}