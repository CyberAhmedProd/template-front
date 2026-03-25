import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProcessService } from '../../core/services/process.service';
import { Process, ProcessStatus } from '../../shared/models/process.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header-bar">
      <div>
        <h1>Vue d'ensemble</h1>
        <div class="sub">Système de Management de la Qualité — ISO 9001:2015</div>
      </div>
      <div class="ph-actions"></div>
    </div>

    <div class="content-scroll">
      <!-- Processus clés -->
      <div class="table-wrap">
        <div class="table-toolbar">
          <span style="font-size:12.5px;font-weight:600;color:var(--text-primary)">Processus clés</span>
          <div style="margin-left:auto">
            <button class="btn btn-ghost" style="font-size:11.5px;padding:4px 10px" routerLink="/processus">
              Voir tout →
            </button>
          </div>
        </div>
        <table class="word-table">
          <thead>
            <tr>
              <th>Processus</th>
              <th>Type</th>
              <th>Conformité</th>
              <th>Statut</th>
              <th>Pilote</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let process of processes">
              <td>
                <div style="font-weight:600">{{process.name}}</div>
                <div class="doc-ref">{{process.code}}</div>
              </td>
              <td style="color:var(--text-muted);font-size:12px">
                {{getProcessTypeShort(process.type)}}
              </td>
              <td>
                <div class="prog-bar">
                  <div class="prog-fill" 
                       [style.width.%]="process.conformityScore"
                       [style.background]="getScoreColor(process.conformityScore)">
                  </div>
                </div>
                <div style="font-size:10.5px;font-weight:700;margin-top:3px"
                     [style.color]="getScoreColor(process.conformityScore)">
                  {{process.conformityScore}}%
                </div>
              </td>
              <td>
                <span class="tag" [ngClass]="getStatusClass(process.status)">
                  {{getStatusIcon(process.status)}} {{process.status}}
                </span>
              </td>
              <td style="font-size:12px;color:var(--text-secondary)">
                {{process.pilot}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Non-Conformités ouvertes -->
      <div class="table-wrap">
        <div class="table-toolbar">
          <span style="font-size:12.5px;font-weight:600;color:var(--text-primary)">Non-Conformités ouvertes</span>
          <div style="margin-left:auto">
            <button class="btn btn-ghost" style="font-size:11.5px;padding:4px 10px">Voir tout →</button>
          </div>
        </div>
        <table class="word-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Description</th>
              <th>Processus</th>
              <th>Priorité</th>
              <th>Avancement</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let nc of nonConformities">
              <td style="font-family:monospace;font-size:11px;color:var(--text-muted)">
                {{nc.ref}}
              </td>
              <td style="font-weight:600">{{nc.description}}</td>
              <td><span class="tag xl">{{nc.processCode}}</span></td>
              <td><span class="tag" [ngClass]="getPriorityClass(nc.priority)">{{nc.priority}}</span></td>
              <td>
                <div class="prog-bar">
                  <div class="prog-fill" 
                       [style.width.%]="nc.progress"
                       [style.background]="getProgressColor(nc.progress)">
                  </div>
                </div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:3px">
                  {{nc.progress}}%
                </div>
              </td>
              <td style="font-size:12px;color:var(--text-secondary)">
                {{nc.responsible}}
              </td>
            </tr>
          </tbody>
        </table>
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

    .doc-ref {
      font-size: 10.5px; 
      color: var(--text-muted); 
      font-family: 'Courier New', monospace;
    }
  `]
})
export class DashboardComponent implements OnInit {
  processes: Process[] = [];
  nonConformities = [
    {
      ref: 'NC-031',
      description: 'Écart de traçabilité',
      processCode: 'P-04',
      priority: 'Élevée',
      progress: 20,
      responsible: 'R. Haddad'
    },
    {
      ref: 'NC-028',
      description: 'Calibration non conforme',
      processCode: 'P-07',
      priority: 'Élevée',
      progress: 55,
      responsible: 'A. Mansouri'
    },
    {
      ref: 'NC-025',
      description: 'Délai fournisseur dépassé',
      processCode: 'P-02',
      priority: 'Moyenne',
      progress: 70,
      responsible: 'K. Mrad'
    },
    {
      ref: 'NC-022',
      description: 'Formation manquante',
      processCode: 'P-11',
      priority: 'Faible',
      progress: 90,
      responsible: 'S. Ben Ali'
    }
  ];

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  loadProcesses(): void {
    this.processService.getProcesses().subscribe({
      next: (processes) => {
        this.processes = processes.slice(0, 5); // Show only first 5
      },
      error: (error) => {
        console.error('Error loading processes:', error);
      }
    });
  }

  getProcessTypeShort(type: string): string {
    switch (type) {
      case 'Processus de pilotage':
        return 'Pilotage';
      case 'Processus opérationnel':
        return 'Opérationnel';
      case 'Processus support':
        return 'Support';
      case 'Processus de mesure':
        return 'Mesure';
      default:
        return type;
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'var(--s-green)';
    if (score >= 60) return 'var(--s-yellow)';
    return 'var(--s-red)';
  }

  getStatusClass(status: ProcessStatus): string {
    switch (status) {
      case ProcessStatus.CONFORME:
        return 'conforme';
      case ProcessStatus.A_SURVEILLER:
        return 'revision';
      case ProcessStatus.NON_CONFORME:
        return 'perime';
      default:
        return '';
    }
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

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Élevée':
        return 'perime';
      case 'Moyenne':
        return 'revision';
      case 'Faible':
        return 'conforme';
      default:
        return '';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'var(--s-green)';
    if (progress >= 50) return 'var(--s-yellow)';
    return 'var(--s-red)';
  }
}