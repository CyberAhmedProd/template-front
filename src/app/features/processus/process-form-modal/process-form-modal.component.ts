import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Process, ProcessType, ReviewFrequency } from '../../../shared/models/process.model';

interface DialogData {
  process: Process | null;
  isEdit: boolean;
}

@Component({
  selector: 'app-process-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="modal-header">
      <div class="modal-title">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4"/>
        </svg>
        {{data.isEdit ? 'Modifier le processus' : 'Nouveau processus'}}
      </div>
      <button class="modal-close" (click)="onCancel()">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <form [formGroup]="processForm" (ngSubmit)="onSave()">
        <div class="form-section">
          <div class="form-section-title">Informations générales</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Code <span class="req">*</span></label>
              <input type="text" formControlName="code" placeholder="Ex : P-19">
              <div *ngIf="processForm.get('code')?.invalid && processForm.get('code')?.touched" 
                   class="error-message">
                Le code est requis
              </div>
            </div>
            <div class="form-group">
              <label>Intitulé <span class="req">*</span></label>
              <input type="text" formControlName="name" placeholder="Ex : Gestion des ressources humaines">
              <div *ngIf="processForm.get('name')?.invalid && processForm.get('name')?.touched" 
                   class="error-message">
                L'intitulé est requis
              </div>
            </div>
            <div class="form-group">
              <label>Type <span class="req">*</span></label>
              <select formControlName="type">
                <option value="">— Sélectionner —</option>
                <option [value]="ProcessType.PILOTAGE">{{ProcessType.PILOTAGE}}</option>
                <option [value]="ProcessType.OPERATIONNEL">{{ProcessType.OPERATIONNEL}}</option>
                <option [value]="ProcessType.SUPPORT">{{ProcessType.SUPPORT}}</option>
                <option [value]="ProcessType.MESURE">{{ProcessType.MESURE}}</option>
              </select>
              <div *ngIf="processForm.get('type')?.invalid && processForm.get('type')?.touched" 
                   class="error-message">
                Le type est requis
              </div>
            </div>
            <div class="form-group">
              <label>Clause ISO 9001</label>
              <select formControlName="clauseISO">
                <option value="">— Sélectionner —</option>
                <option value="§4 - Contexte">§4 - Contexte</option>
                <option value="§5 - Leadership">§5 - Leadership</option>
                <option value="§6 - Planification">§6 - Planification</option>
                <option value="§7 - Support">§7 - Support</option>
                <option value="§8 - Réalisation">§8 - Réalisation</option>
                <option value="§9 - Évaluation">§9 - Évaluation</option>
                <option value="§10 - Amélioration">§10 - Amélioration</option>
              </select>
            </div>
            <div class="form-group full">
              <label>Objectif <span class="req">*</span></label>
              <textarea formControlName="objective" placeholder="Décrire l'objectif principal de ce processus..."></textarea>
              <div *ngIf="processForm.get('objective')?.invalid && processForm.get('objective')?.touched" 
                   class="error-message">
                L'objectif est requis
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">Responsabilité</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Pilote <span class="req">*</span></label>
              <div class="owner-chips">
                <div class="owner-chip" 
                     [class.sel]="processForm.get('pilot')?.value === 'A. Mansouri'"
                     (click)="selectPilot('A. Mansouri')">
                  <div class="owner-av" style="background:var(--xl-green-mid)">AM</div>
                  A. Mansouri
                </div>
                <div class="owner-chip" 
                     [class.sel]="processForm.get('pilot')?.value === 'K. Mrad'"
                     (click)="selectPilot('K. Mrad')">
                  <div class="owner-av" style="background:#6C3483">KM</div>
                  K. Mrad
                </div>
                <div class="owner-chip" 
                     [class.sel]="processForm.get('pilot')?.value === 'S. Ben Ali'"
                     (click)="selectPilot('S. Ben Ali')">
                  <div class="owner-av" style="background:#1A5276">SB</div>
                  S. Ben Ali
                </div>
                <div class="owner-chip" 
                     [class.sel]="processForm.get('pilot')?.value === 'R. Haddad'"
                     (click)="selectPilot('R. Haddad')">
                  <div class="owner-av" style="background:#9B1C1C">RH</div>
                  R. Haddad
                </div>
              </div>
              <div *ngIf="processForm.get('pilot')?.invalid && processForm.get('pilot')?.touched" 
                   class="error-message">
                Le pilote est requis
              </div>
            </div>
            <div class="form-group">
              <label>Fréquence de revue</label>
              <select formControlName="reviewFrequency">
                <option [value]="ReviewFrequency.MENSUELLE">{{ReviewFrequency.MENSUELLE}}</option>
                <option [value]="ReviewFrequency.TRIMESTRIELLE">{{ReviewFrequency.TRIMESTRIELLE}}</option>
                <option [value]="ReviewFrequency.SEMESTRIELLE">{{ReviewFrequency.SEMESTRIELLE}}</option>
                <option [value]="ReviewFrequency.ANNUELLE">{{ReviewFrequency.ANNUELLE}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date de création</label>
              <input type="date" formControlName="createdDate">
            </div>
            <div class="form-group">
              <label>Prochaine revue</label>
              <input type="date" formControlName="nextReview">
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">Indicateurs (KPI)</div>
          <div class="kpi-list">
            <div *ngFor="let kpi of kpis; let i = index" class="kpi-row">
              <svg fill="none" stroke="var(--text-muted)" stroke-width="2" viewBox="0 0 24 24" style="width:12px;height:12px;flex-shrink:0">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/>
              </svg>
              <input type="text" [(ngModel)]="kpis[i]" [ngModelOptions]="{standalone: true}">
              <button type="button" class="rm-btn" (click)="removeKPI(i)">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <button type="button" class="add-kpi" (click)="addKPI()">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Ajouter un indicateur
          </button>
        </div>

        <div class="form-section">
          <div class="form-section-title">Score de conformité initial</div>
          <div style="max-width:360px">
            <label style="display:block;margin-bottom:8px">Auto-évaluation du pilote</label>
            <div class="score-row">
              <input type="range" 
                     class="word-slider" 
                     min="0" 
                     max="100" 
                     formControlName="conformityScore"
                     (input)="updateScoreDisplay()">
              <div class="score-val" [style.color]="getScoreColor()">
                {{processForm.get('conformityScore')?.value}}%
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" (click)="onCancel()">Annuler</button>
      <button type="button" class="btn btn-secondary">Enregistrer brouillon</button>
      <button type="button" class="btn btn-primary" (click)="onSave()" [disabled]="processForm.invalid">
        ✓ {{data.isEdit ? 'Modifier' : 'Créer'}} le processus
      </button>
    </div>
  `,
  styles: [`
    .form-section { 
      margin-bottom: 22px; 
    }

    .form-section-title {
      font-size: 11px; 
      font-weight: 700; 
      text-transform: uppercase;
      letter-spacing: 0.7px; 
      color: var(--xl-green);
      margin-bottom: 14px; 
      padding-bottom: 7px;
      border-bottom: 1px solid var(--xl-green-xlight);
    }

    .form-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 14px; 
    }

    .form-group.full { 
      grid-column: 1/-1; 
    }

    .error-message {
      color: var(--s-red);
      font-size: 11px;
      margin-top: 4px;
    }

    .owner-chips { 
      display: flex; 
      gap: 6px; 
      flex-wrap: wrap; 
    }

    .owner-chip {
      display: flex; 
      align-items: center; 
      gap: 5px;
      padding: 4px 10px; 
      border: 1px solid var(--border-mid);
      cursor: pointer; 
      font-size: 12px; 
      color: var(--text-secondary);
      background: white; 
      transition: all 0.1s;
      border-radius: var(--radius);
    }

    .owner-chip:hover { 
      border-color: var(--xl-green-mid); 
      color: var(--xl-green); 
      background: var(--xl-green-xlight); 
    }

    .owner-chip.sel { 
      border-color: var(--xl-green-mid); 
      background: var(--xl-green-xlight); 
      color: var(--xl-green); 
      font-weight: 600; 
    }

    .owner-av { 
      width: 18px; 
      height: 18px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 8px; 
      font-weight: 700; 
      color: white; 
    }

    .kpi-list { 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
    }

    .kpi-row { 
      display: flex; 
      align-items: center; 
      gap: 7px; 
      padding: 6px 10px; 
      background: var(--bg-raised); 
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }

    .kpi-row input { 
      flex: 1; 
      border: none; 
      background: transparent; 
      outline: none; 
      font-family: inherit; 
      font-size: 12.5px; 
      color: var(--text-primary); 
    }

    .rm-btn { 
      width: 20px; 
      height: 20px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      cursor: pointer; 
      border: none; 
      background: transparent; 
      color: var(--text-muted);
      border-radius: var(--radius);
      transition: all 0.1s;
    }

    .rm-btn:hover { 
      color: var(--s-red); 
      background: var(--s-red-bg);
    }

    .rm-btn svg { 
      width: 11px; 
      height: 11px; 
    }

    .add-kpi {
      display: flex; 
      align-items: center; 
      gap: 6px;
      padding: 6px 10px; 
      border: 1px dashed var(--border-mid);
      background: transparent; 
      cursor: pointer;
      font-size: 12px; 
      color: var(--text-muted); 
      font-family: inherit; 
      width: 100%;
      margin-top: 6px; 
      transition: all 0.1s;
      border-radius: var(--radius);
    }

    .add-kpi:hover { 
      border-color: var(--xl-green-mid); 
      color: var(--xl-green); 
      background: var(--xl-green-xlight); 
    }

    .add-kpi svg { 
      width: 12px; 
      height: 12px; 
    }

    .score-row { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
    }

    .word-slider {
      -webkit-appearance: none; 
      appearance: none;
      flex: 1; 
      height: 4px; 
      background: var(--border);
      outline: none; 
      border: none; 
      padding: 0;
      border-radius: 2px;
    }

    .word-slider::-webkit-slider-thumb {
      -webkit-appearance: none; 
      width: 14px; 
      height: 14px;
      border-radius: 50%; 
      background: var(--xl-green-mid);
      cursor: pointer; 
      border: 2px solid white;
      box-shadow: 0 0 0 1px var(--xl-green-mid);
    }

    .word-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--xl-green-mid);
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 0 0 1px var(--xl-green-mid);
    }

    .score-val { 
      font-size: 16px; 
      font-weight: 700; 
      min-width: 42px; 
      text-align: right; 
    }
  `]
})
export class ProcessFormModalComponent implements OnInit {
  processForm!: FormGroup;
  kpis: string[] = [];
  ProcessType = ProcessType;
  ReviewFrequency = ReviewFrequency;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProcessFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log('ProcessFormModalComponent initialized with data:', data);
  }

  ngOnInit(): void {
    this.initForm();
    if (this.data.process) {
      this.loadProcessData();
    }
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split('T')[0];

    this.processForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      objective: ['', [Validators.required]],
      pilot: ['', [Validators.required]],
      reviewFrequency: [ReviewFrequency.SEMESTRIELLE],
      createdDate: [today],
      nextReview: [nextYearStr],
      conformityScore: [75],
      clauseISO: ['']
    });

    this.kpis = ['Taux de conformité', 'Délai moyen de traitement'];
    console.log('Form initialized:', this.processForm.value);
  }

  loadProcessData(): void {
    if (this.data.process) {
      console.log('Loading process data:', this.data.process);
      this.processForm.patchValue(this.data.process);
      this.kpis = [...(this.data.process.kpis || [])];
      if (this.kpis.length === 0) {
        this.kpis = ['Taux de conformité', 'Délai moyen de traitement'];
      }
    }
  }

  selectPilot(pilot: string): void {
    console.log('Selecting pilot:', pilot);
    this.processForm.patchValue({ pilot });
  }

  addKPI(): void {
    this.kpis.push('');
    console.log('Added KPI, current KPIs:', this.kpis);
  }

  removeKPI(index: number): void {
    this.kpis.splice(index, 1);
    console.log('Removed KPI at index', index, 'current KPIs:', this.kpis);
  }

  updateScoreDisplay(): void {
    // Trigger change detection for score color update
  }

  getScoreColor(): string {
    const score = this.processForm.get('conformityScore')?.value || 0;
    if (score >= 80) return 'var(--s-green)';
    if (score >= 60) return 'var(--s-yellow)';
    return 'var(--s-red)';
  }

  onSave(): void {
    console.log('Save clicked, form valid:', this.processForm.valid);
    console.log('Form value:', this.processForm.value);
    console.log('Form errors:', this.getFormErrors());
    
    if (this.processForm.valid) {
      const formValue = this.processForm.value;
      const processData = {
        ...formValue,
        kpis: this.kpis.filter(kpi => kpi.trim() !== ''),
        status: this.getStatusFromScore(formValue.conformityScore)
      };
      console.log('Saving process data:', processData);
      this.dialogRef.close(processData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.processForm.controls).forEach(key => {
        this.processForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid, marking all fields as touched');
    }
  }

  onCancel(): void {
    console.log('Cancel clicked');
    this.dialogRef.close();
  }

  private getStatusFromScore(score: number): string {
    if (score >= 80) return 'Conforme';
    if (score >= 60) return 'À surveiller';
    return 'Non conforme';
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.processForm.controls).forEach(key => {
      const control = this.processForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}