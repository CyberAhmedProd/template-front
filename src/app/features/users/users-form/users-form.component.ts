import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="users-form">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{isEditMode ? 'Modifier' : 'Ajouter'}} un utilisateur</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Prénom</mat-label>
                <input matInput 
                       formControlName="firstName"
                       placeholder="Prénom de l'utilisateur">
                <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
                  Le prénom est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Nom</mat-label>
                <input matInput 
                       formControlName="lastName"
                       placeholder="Nom de l'utilisateur">
                <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
                  Le nom est requis
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput 
                     type="email"
                     formControlName="email"
                     placeholder="email@exemple.com">
              <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                L'email est requis
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                Format d'email invalide
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Rôle</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="Admin">Administrateur</mat-option>
                  <mat-option value="User">Utilisateur</mat-option>
                  <mat-option value="Manager">Manager</mat-option>
                </mat-select>
                <mat-error *ngIf="userForm.get('role')?.hasError('required')">
                  Le rôle est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Statut</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="Active">Actif</mat-option>
                  <mat-option value="Inactive">Inactif</mat-option>
                </mat-select>
                <mat-error *ngIf="userForm.get('status')?.hasError('required')">
                  Le statut est requis
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button 
                      type="button" 
                      (click)="goBack()">
                Annuler
              </button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="userForm.invalid || isLoading">
                {{isLoading ? 'Enregistrement...' : (isEditMode ? 'Modifier' : 'Créer')}}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .form-actions {
        flex-direction: column-reverse;
        gap: 12px;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class UsersFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', [Validators.required]],
      status: ['Active', [Validators.required]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  private loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        this.notificationService.showError('Utilisateur non trouvé');
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const formData = this.userForm.value;

      const operation = this.isEditMode 
        ? this.userService.updateUser({ ...formData, id: this.userId })
        : this.userService.createUser(formData);

      operation.subscribe({
        next: (user) => {
          const message = this.isEditMode 
            ? 'Utilisateur modifié avec succès' 
            : 'Utilisateur créé avec succès';
          
          this.notificationService.showSuccess(message);
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}