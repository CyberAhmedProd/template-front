import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document, DocumentType, DocumentStatus } from '../../../shared/models/process.model';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header-bar">
      <div>
        <h1>Documents</h1>
        <div class="sub">Gestion documentaire — {{filteredDocuments.length}} documents</div>
      </div>
      <div class="ph-actions">
        <button class="btn btn-ghost">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Importer
        </button>
        <button class="btn btn-primary" style="margin-left:4px">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau document
        </button>
      </div>
    </div>

    <div class="content-scroll">
      <div class="table-wrap">
        <div class="table-toolbar">
          <div class="tb-search">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" 
                   placeholder="Rechercher..." 
                   [(ngModel)]="searchTerm"
                   (input)="filterDocuments()">
          </div>
          
          <div style="display:flex;gap:4px">
            <button class="tb-filter" 
                    [class.active]="typeFilter === 'all'"
                    (click)="setTypeFilter('all')">
              Tous
            </button>
            <button class="tb-filter" 
                    [class.active]="typeFilter === 'Manuel'"
                    (click)="setTypeFilter('Manuel')">
              Manuels
            </button>
            <button class="tb-filter" 
                    [class.active]="typeFilter === 'Procédure'"
                    (click)="setTypeFilter('Procédure')">
              Procédures
            </button>
            <button class="tb-filter" 
                    [class.active]="typeFilter === 'Enregistrement'"
                    (click)="setTypeFilter('Enregistrement')">
              Enregistrements
            </button>
            <button class="tb-filter" 
                    [class.active]="typeFilter === 'Formulaire'"
                    (click)="setTypeFilter('Formulaire')">
              Formulaires
            </button>
          </div>
          
          <div style="margin-left:auto;display:flex;gap:5px;align-items:center">
            <span style="font-size:11.5px;color:var(--text-muted)">Statut :</span>
            <div style="display:flex;gap:4px">
              <button class="tb-filter" 
                      [class.active]="statusFilter === 'all'"
                      (click)="setStatusFilter('all')">
                Tous
              </button>
              <button class="tb-filter" 
                      [class.active]="statusFilter === 'Approuvé'"
                      (click)="setStatusFilter('Approuvé')">
                Approuvés
              </button>
              <button class="tb-filter" 
                      [class.active]="statusFilter === 'En révision'"
                      (click)="setStatusFilter('En révision')">
                En révision
              </button>
              <button class="tb-filter" 
                      [class.active]="statusFilter === 'Périmé'"
                      (click)="setStatusFilter('Périmé')">
                Périmés
              </button>
            </div>
          </div>
        </div>
        
        <table class="word-table">
          <thead>
            <tr>
              <th class="sort" (click)="sortBy('name')">Document ↕</th>
              <th>Type</th>
              <th>Processus</th>
              <th>Statut</th>
              <th class="sort" (click)="sortBy('version')">Révision ↕</th>
              <th class="sort" (click)="sortBy('updatedDate')">Mis à jour ↕</th>
              <th>Responsable</th>
              <th style="width:90px"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of paginatedDocuments">
              <td>
                <div class="doc-cell">
                  <div class="doc-icon" [ngClass]="getDocIconClass(doc.type)">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" [innerHTML]="getDocIcon(doc.type)">
                    </svg>
                  </div>
                  <div>
                    <div class="doc-name">{{doc.name}}</div>
                    <div class="doc-ref">{{doc.ref}}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="tag" [ngClass]="getTypeClass(doc.type)">{{doc.type}}</span>
              </td>
              <td>
                <span class="tag xl">{{doc.processCode}}</span>
              </td>
              <td>
                <span class="tag" [ngClass]="getStatusClass(doc.status)">
                  {{getStatusIcon(doc.status)}} {{doc.status}}
                </span>
              </td>
              <td style="font-family:'Courier New',monospace;font-size:11.5px;color:var(--text-muted)">
                {{doc.version}}
              </td>
              <td style="font-size:11.5px;color:var(--text-muted)">
                {{doc.updatedDate}}
              </td>
              <td>
                <div style="display:flex;align-items:center;gap:6px">
                  <div class="owner-av" [style.background]="getOwnerColor(doc.owner)">
                    {{getOwnerInitials(doc.owner)}}
                  </div>
                  <span style="font-size:12px;color:var(--text-secondary)">{{doc.owner}}</span>
                </div>
              </td>
              <td>
                <div class="row-actions">
                  <button class="row-btn" title="Voir">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="row-btn" title="Modifier">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="row-btn" title="Télécharger">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </button>
                  <button class="row-btn del" title="Supprimer">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="table-footer">
          <span>Affichage {{startIndex + 1}}–{{endIndex}} sur {{filteredDocuments.length}} document{{filteredDocuments.length > 1 ? 's' : ''}}</span>
          <div class="page-btns">
            <button class="page-btn" (click)="previousPage()" [disabled]="currentPage === 1">‹</button>
            <button class="page-btn" 
                    *ngFor="let page of getPageNumbers()" 
                    [class.active]="page === currentPage"
                    (click)="goToPage(page)">
              {{page}}
            </button>
            <button class="page-btn" (click)="nextPage()" [disabled]="currentPage === totalPages">›</button>
          </div>
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

    .doc-cell { 
      display: flex; 
      align-items: center; 
      gap: 9px; 
    }

    .doc-icon {
      width: 28px; 
      height: 28px; 
      border-radius: var(--radius);
      display: flex; 
      align-items: center; 
      justify-content: center; 
      flex-shrink: 0;
    }

    .doc-icon svg { 
      width: 15px; 
      height: 15px; 
    }

    .doc-icon.proc   { 
      background: var(--s-blue-bg);  
      color: var(--s-blue); 
    }

    .doc-icon.manuel { 
      background: #F4EEF9; 
      color: #6C3483; 
    }

    .doc-icon.enreg  { 
      background: #FEF5E7; 
      color: #935116; 
    }

    .doc-icon.form   { 
      background: var(--s-green-bg); 
      color: var(--s-green); 
    }

    .doc-name { 
      font-weight: 600; 
      font-size: 12.5px; 
      color: var(--text-primary); 
    }

    .doc-ref  { 
      font-size: 10.5px; 
      color: var(--text-muted); 
      font-family: 'Courier New', monospace; 
    }

    .owner-av { 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 8px; 
      font-weight: 700; 
      color: white; 
    }

    .table-footer {
      display: flex; 
      align-items: center; 
      justify-content: space-between;
      padding: 8px 14px; 
      background: var(--bg-raised);
      border-top: 1px solid var(--border);
      font-size: 11.5px; 
      color: var(--text-muted);
    }

    .page-btns { 
      display: flex; 
      gap: 3px; 
    }

    .page-btn {
      width: 26px; 
      height: 26px; 
      border: 1px solid var(--border);
      background: white; 
      border-radius: var(--radius); 
      cursor: pointer;
      font-size: 11.5px; 
      font-weight: 600; 
      color: var(--text-secondary);
      display: flex; 
      align-items: center; 
      justify-content: center;
      transition: all 0.1s;
    }

    .page-btn:hover:not(:disabled) { 
      border-color: var(--xl-green-mid); 
      color: var(--xl-green); 
    }

    .page-btn.active { 
      background: var(--xl-green-mid); 
      color: white; 
      border-color: var(--xl-green-mid); 
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class DocumentsListComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  paginatedDocuments: Document[] = [];
  
  searchTerm = '';
  typeFilter = 'all';
  statusFilter = 'all';
  
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  startIndex = 0;
  endIndex = 0;

  private ownerColors: { [key: string]: string } = {
    'A. Mansouri': 'var(--xl-green-mid)',
    'K. Mrad': '#6C3483',
    'S. Ben Ali': '#1A5276',
    'R. Haddad': '#9B1C1C'
  };

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    // Mock data - replace with actual service call
    this.documents = [
      { id: 1, ref: 'MQ-001', name: 'Manuel Qualité', type: DocumentType.MANUEL, processCode: 'P-01', status: DocumentStatus.APPROUVE, version: 'v3.2', updatedDate: '15/01/2026', owner: 'A. Mansouri' },
      { id: 2, ref: 'PRO-001', name: 'Maîtrise des documents', type: DocumentType.PROCEDURE, processCode: 'P-01', status: DocumentStatus.APPROUVE, version: 'v2.0', updatedDate: '10/01/2026', owner: 'A. Mansouri' },
      { id: 3, ref: 'PRO-002', name: 'Maîtrise des enregistrements', type: DocumentType.PROCEDURE, processCode: 'P-01', status: DocumentStatus.APPROUVE, version: 'v1.8', updatedDate: '10/01/2026', owner: 'K. Mrad' },
      { id: 4, ref: 'PRO-003', name: 'Audit interne', type: DocumentType.PROCEDURE, processCode: 'P-01', status: DocumentStatus.EN_REVISION, version: 'v2.1', updatedDate: '05/01/2026', owner: 'A. Mansouri' },
      { id: 5, ref: 'ENR-001', name: 'Registre des audits', type: DocumentType.ENREGISTREMENT, processCode: 'P-01', status: DocumentStatus.APPROUVE, version: 'v1.0', updatedDate: '01/02/2026', owner: 'A. Mansouri' },
      { id: 6, ref: 'FOR-001', name: 'Fiche d\'action corrective', type: DocumentType.FORMULAIRE, processCode: 'P-01', status: DocumentStatus.APPROUVE, version: 'v2.0', updatedDate: '01/01/2026', owner: 'A. Mansouri' },
      { id: 7, ref: 'ENR-024', name: 'Enregistrements audits internes', type: DocumentType.ENREGISTREMENT, processCode: 'P-01', status: DocumentStatus.PERIME, version: 'v1.0', updatedDate: '15/06/2025', owner: 'K. Mrad' },
      { id: 8, ref: 'PRO-007', name: 'Qualification fournisseurs', type: DocumentType.PROCEDURE, processCode: 'P-02', status: DocumentStatus.APPROUVE, version: 'v1.2', updatedDate: '08/12/2025', owner: 'K. Mrad' },
      { id: 9, ref: 'FOR-003', name: 'Bon de commande standard', type: DocumentType.FORMULAIRE, processCode: 'P-02', status: DocumentStatus.EN_REVISION, version: 'v1.4', updatedDate: '15/12/2025', owner: 'K. Mrad' },
      { id: 10, ref: 'PRO-011', name: 'Réception et inspection', type: DocumentType.PROCEDURE, processCode: 'P-04', status: DocumentStatus.APPROUVE, version: 'v2.2', updatedDate: '15/11/2025', owner: 'S. Ben Ali' }
    ];
    
    this.filterDocuments();
  }

  filterDocuments(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = !this.searchTerm || 
        doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.ref.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.typeFilter === 'all' || doc.type === this.typeFilter;
      const matchesStatus = this.statusFilter === 'all' || doc.status === this.statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
    
    this.updatePagination();
  }

  setTypeFilter(type: string): void {
    this.typeFilter = type;
    this.currentPage = 1;
    this.filterDocuments();
  }

  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.filterDocuments();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.filteredDocuments.length);
    
    this.paginatedDocuments = this.filteredDocuments.slice(this.startIndex, this.endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  sortBy(field: string): void {
    // Implement sorting logic
    console.log('Sort by:', field);
  }

  getDocIconClass(type: DocumentType): string {
    switch (type) {
      case DocumentType.MANUEL:
        return 'manuel';
      case DocumentType.PROCEDURE:
        return 'proc';
      case DocumentType.ENREGISTREMENT:
        return 'enreg';
      case DocumentType.FORMULAIRE:
        return 'form';
      default:
        return 'proc';
    }
  }

  getDocIcon(type: DocumentType): string {
    switch (type) {
      case DocumentType.MANUEL:
        return '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>';
      case DocumentType.PROCEDURE:
        return '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-3 4v6m-3-3h6"/>';
      case DocumentType.ENREGISTREMENT:
        return '<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>';
      case DocumentType.FORMULAIRE:
        return '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-5 6l2 2 4-4"/>';
      default:
        return '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-3 4v6m-3-3h6"/>';
    }
  }

  getTypeClass(type: DocumentType): string {
    switch (type) {
      case DocumentType.MANUEL:
        return 'purple';
      case DocumentType.PROCEDURE:
        return 'blue';
      case DocumentType.ENREGISTREMENT:
        return 'orange';
      case DocumentType.FORMULAIRE:
        return 'green-t';
      default:
        return 'blue';
    }
  }

  getStatusClass(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.APPROUVE:
        return 'conforme';
      case DocumentStatus.EN_REVISION:
        return 'revision';
      case DocumentStatus.PERIME:
        return 'perime';
      default:
        return '';
    }
  }

  getStatusIcon(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.APPROUVE:
        return '●';
      case DocumentStatus.EN_REVISION:
        return '⏳';
      case DocumentStatus.PERIME:
        return '✕';
      default:
        return '';
    }
  }

  getOwnerColor(owner: string): string {
    return this.ownerColors[owner] || 'var(--xl-green-mid)';
  }

  getOwnerInitials(owner: string): string {
    return owner.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}