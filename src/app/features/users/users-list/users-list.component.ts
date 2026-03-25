import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="users-list">
      <div class="header">
        <h1>Gestion des utilisateurs</h1>
        <button mat-raised-button color="primary" routerLink="/users/new">
          <mat-icon>add</mat-icon>
          Ajouter un utilisateur
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="users" class="users-table">
              
              <!-- Colonne ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let user">{{user.id}}</td>
              </ng-container>

              <!-- Colonne Nom complet -->
              <ng-container matColumnDef="fullName">
                <th mat-header-cell *matHeaderCellDef>Nom complet</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <strong>{{user.firstName}} {{user.lastName}}</strong>
                    <div class="user-email">{{user.email}}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Rôle -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rôle</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="user.role === 'Admin' ? 'primary' : 'accent'">
                    {{user.role}}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Statut -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="user.status === 'Active' ? 'primary' : 'warn'">
                    {{user.status}}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Date de création -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Créé le</th>
                <td mat-cell *matCellDef="let user">
                  {{formatDate(user.createdAt)}}
                </td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <div class="action-buttons">
                    <button mat-icon-button 
                            color="primary"
                            [routerLink]="['/users/edit', user.id]"
                            matTooltip="Modifier">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button 
                            color="warn"
                            (click)="deleteUser(user)"
                            matTooltip="Supprimer">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div *ngIf="users.length === 0" class="no-data">
            <mat-icon>people_outline</mat-icon>
            <p>Aucun utilisateur trouvé</p>
            <button mat-raised-button color="primary" routerLink="/users/new">
              Ajouter le premier utilisateur
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-list {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .header button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-email {
      font-size: 12px;
      color: #666;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .no-data p {
      margin-bottom: 20px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'role', 'status', 'createdAt', 'actions'];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.notificationService.showSuccess('Utilisateur supprimé avec succès');
          this.loadUsers(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}