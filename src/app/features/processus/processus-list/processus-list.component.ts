import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Process, ProcessType, ProcessStatus } from '../../../shared/models/process.model';
import { ProcessService } from '../../../core/services/process.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ProcessFormModalComponent } from '../process-form-modal/process-form-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-processus-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-header-bar">
      <div>
        <h1>Processus</h1>
        <div class="sub">Cartographie — {{processes.length}} processus actifs</div>
      </div>
      <div class="ph-actions">
        <button class="btn btn-primary" (click)="openCreateModal()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau processus
        </button>
      </div>
    </div>

    <div class="content-scroll">
      <div class="proc-grid">
        <div 
          *ngFor="let process of processes" 
          class="proc-card"
          [ngClass]="getCardClass(process.status)">
          <div class="pc-header">
            <div class="pc-code">{{process.code}}</div>
            <div class="pc-score" [style.color]="getScoreColor(process.conformityScore)">
              {{process.conformityScore}}%
            </div>
          </div>
          <div class="pc-name">{{process.name}}</div>
          <div class="pc-type">{{process.type}}</div>
          <div class="pc-bar">
            <div class="pc-bar-fill" 
                 [style.width.%]="process.conformityScore"
                 [style.background]="getScoreColor(process.conformityScore)">
            </div>
          </div>
          <div class="pc-footer">
            <span>{{process.proceduresCount || 0}} procédures · {{process.documentsCount || 0}} docs</span>
            <span [style.color]="getScoreColor(process.conformityScore)" style="font-weight:700">
              {{getStatusIcon(process.status)}} {{process.status}}
            </span>
          </div>
          <div class="card-actions" (click)="$event.stopPropagation()">
            <button class="row-btn" (click)="openEditModal(process)" title="Modifier">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button class="row-btn del" (click)="confirmDelete(process)" title="Supprimer">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="proc-card add" (click)="openCreateModal()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:22px;height:22px">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          <div style="font-size:12.5px;font-weight:600">Nouveau processus</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header-bar {
      background: var(--bg-white);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex; 
      align-items: center; 
      justify-content: space-between;
      flex-shrink: 0;
    }

    .page-header-bar h1 { 
      font-size: 16px; 
      font-weight: 700; 
      color: var(--text-primary); 
    }

    .page-header-bar .sub { 
      font-size: 11.5px; 
      color: var(--text-muted); 
      margin-top: 2px; 
    }

    .ph-actions { 
      display: flex; 
      gap: 8px; 
      align-items: center; 
    }

    .content-scroll { 
      flex: 1; 
      overflow-y: auto; 
      padding: 24px; 
    }

    .proc-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
      gap: 14px; 
    }

    .proc-card {
      background: var(--bg-white); 
      border: 1px solid var(--border);
      border-top: 3px solid var(--xl-green-mid);
      padding: 16px; 
      cursor: pointer;
      transition: box-shadow 0.15s;
      box-shadow: var(--shadow);
      position: relative;
    }

    .proc-card:hover { 
      box-shadow: 0 4px 16px rgba(0,0,0,0.12); 
    }

    .proc-card.clr-green  { 
      border-top-color: var(--s-green); 
    }

    .proc-card.clr-yellow { 
      border-top-color: var(--s-yellow); 
    }

    .proc-card.clr-red    { 
      border-top-color: var(--s-red); 
    }

    .proc-card.add {
      border-style: dashed; 
      border-top-style: dashed;
      border-color: var(--border-mid); 
      box-shadow: none;
      display: flex; 
      align-items: center; 
      justify-content: center;
      flex-direction: column; 
      gap: 6px; 
      min-height: 130px;
      color: var(--text-muted);
    }

    .proc-card.add:hover { 
      border-color: var(--xl-green-mid); 
      color: var(--xl-green); 
      background: var(--xl-green-xlight); 
    }

    .pc-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 8px; 
    }

    .pc-code { 
      font-size: 10px; 
      font-family: 'Courier New', monospace; 
      background: var(--bg-raised); 
      border: 1px solid var(--border); 
      padding: 1px 5px; 
      color: var(--text-muted); 
    }

    .pc-score { 
      font-size: 20px; 
      font-weight: 700; 
    }

    .pc-name  { 
      font-size: 14px; 
      font-weight: 700; 
      color: var(--text-primary); 
      margin-bottom: 2px; 
    }

    .pc-type  { 
      font-size: 11px; 
      color: var(--text-muted); 
      margin-bottom: 10px; 
    }

    .pc-bar   { 
      height: 4px; 
      background: var(--border); 
      margin-bottom: 10px; 
    }

    .pc-bar-fill { 
      height: 100%; 
    }

    .pc-footer { 
      display: flex; 
      justify-content: space-between; 
      font-size: 11px; 
      color: var(--text-muted); 
      border-top: 1px solid var(--border); 
      padding-top: 8px; 
    }

    .card-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 2px;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .proc-card:hover .card-actions {
      opacity: 1;
    }
  `]
})
export class ProcessusListComponent implements OnInit {
  processes: Process[] = [];

  constructor(
    private processService: ProcessService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  loadProcesses(): void {
    this.processService.getProcesses().subscribe({
      next: (processes) => {
        this.processes = processes;
      },
      error: (error) => {
        this.toastService.showError('Erreur lors du chargement des processus');
        console.error('Error loading processes:', error);
      }
    });
  }

  openCreateModal(): void {
    console.log('Opening create modal...');
    try {
      const dialogRef = this.dialog.open(ProcessFormModalComponent, {
        width: '600px',
        maxHeight: '90vh',
        data: { process: null, isEdit: false },
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result) {
          this.processService.createProcess(result).subscribe({
            next: (newProcess) => {
              this.processes.push(newProcess);
              this.toastService.showSuccess(`Processus "${newProcess.name}" créé avec succès !`);
            },
            error: (error) => {
              this.toastService.showError('Erreur lors de la création du processus');
              console.error('Error creating process:', error);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error opening create modal:', error);
      this.toastService.showError('Erreur lors de l\'ouverture de la modale');
    }
  }

  openEditModal(process: Process): void {
    console.log('Opening edit modal for process:', process);
    try {
      const dialogRef = this.dialog.open(ProcessFormModalComponent, {
        width: '600px',
        maxHeight: '90vh',
        data: { process: { ...process }, isEdit: true },
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Edit dialog closed with result:', result);
        if (result && process.id) {
          this.processService.updateProcess(process.id, result).subscribe({
            next: (updatedProcess) => {
              const index = this.processes.findIndex(p => p.id === process.id);
              if (index !== -1) {
                this.processes[index] = updatedProcess;
              }
              this.toastService.showSuccess(`Processus "${updatedProcess.name}" modifié avec succès !`);
            },
            error: (error) => {
              this.toastService.showError('Erreur lors de la modification du processus');
              console.error('Error updating process:', error);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error opening edit modal:', error);
      this.toastService.showError('Erreur lors de l\'ouverture de la modale');
    }
  }

  confirmDelete(process: Process): void {
    console.log('Confirming delete for process:', process);
    try {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Supprimer le processus',
          message: `Êtes-vous sûr de vouloir supprimer le processus "${process.name}" (${process.code}) ?`,
          confirmText: 'Supprimer',
          cancelText: 'Annuler'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Confirm dialog closed with result:', result);
        if (result && process.id) {
          this.processService.deleteProcess(process.id).subscribe({
            next: () => {
              this.processes = this.processes.filter(p => p.id !== process.id);
              this.toastService.showSuccess(`Processus "${process.name}" supprimé avec succès !`);
            },
            error: (error) => {
              this.toastService.showError('Erreur lors de la suppression du processus');
              console.error('Error deleting process:', error);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error opening confirm dialog:', error);
      this.toastService.showError('Erreur lors de l\'ouverture de la confirmation');
    }
  }

  getCardClass(status: ProcessStatus): string {
    switch (status) {
      case ProcessStatus.CONFORME:
        return 'clr-green';
      case ProcessStatus.A_SURVEILLER:
        return 'clr-yellow';
      case ProcessStatus.NON_CONFORME:
        return 'clr-red';
      default:
        return '';
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'var(--s-green)';
    if (score >= 60) return 'var(--s-yellow)';
    return 'var(--s-red)';
  }

  getStatusIcon(status: ProcessStatus): string {
    switch (status) {
      case ProcessStatus.CONFORME:
        return '●';
      case ProcessStatus.A_SURVEILLER:
        return '⚠';
      case ProcessStatus.NON_CONFORME:
        return '✕';
      default:
        return '';
    }
  }
}