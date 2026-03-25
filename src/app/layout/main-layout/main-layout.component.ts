import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    LoadingComponent
  ],
  template: `
    <!-- TOPBAR -->
    <header class="topbar">
      <div class="topbar-brand">
        <div class="brand-icon">
          <svg fill="none" stroke="white" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        </div>
        <span class="brand-name">Quality<span>OS</span></span>
        <span class="brand-tag">ISO 9001:2015</span>
      </div>
      <span class="topbar-sep"></span>
      <div class="topbar-notif">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="notif-dot"></span>
      </div>
      <app-header></app-header>
    </header>

    <div class="app-body">
      <app-sidebar></app-sidebar>
      
      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </div>
    
    <app-loading></app-loading>
  `,
  styles: [`
    /* TOPBAR */
    .topbar {
      height: var(--topbar-h);
      background: var(--xl-green);
      display: flex;
      align-items: center;
      padding: 0 16px;
      flex-shrink: 0;
      gap: 12px;
    }

    .topbar-brand { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
    }

    .brand-icon {
      width: 28px; 
      height: 28px;
      background: rgba(255,255,255,0.18);
      border-radius: 3px;
      display: flex; 
      align-items: center; 
      justify-content: center;
      flex-shrink: 0;
    }

    .brand-icon svg { 
      width: 15px; 
      height: 15px; 
    }

    .brand-name { 
      font-size: 15px; 
      font-weight: 700; 
      color: white; 
      letter-spacing: -0.1px; 
    }

    .brand-name span { 
      color: #90EE90; 
    }

    .brand-tag {
      font-size: 10px; 
      font-weight: 600;
      background: rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.8);
      padding: 2px 7px; 
      border-radius: 2px;
      letter-spacing: 0.4px;
    }

    .topbar-sep { 
      flex: 1; 
    }

    .topbar-notif {
      width: 32px; 
      height: 32px; 
      border-radius: var(--radius);
      display: flex; 
      align-items: center; 
      justify-content: center;
      cursor: pointer; 
      position: relative;
      color: rgba(255,255,255,0.8); 
      transition: background 0.1s;
    }

    .topbar-notif:hover { 
      background: rgba(255,255,255,0.12); 
      color: white; 
    }

    .topbar-notif svg { 
      width: 17px; 
      height: 17px; 
    }

    .notif-dot {
      position: absolute; 
      top: 5px; 
      right: 5px;
      width: 7px; 
      height: 7px; 
      background: #E74C3C;
      border-radius: 50%; 
      border: 1.5px solid var(--xl-green);
    }

    /* APP BODY */
    .app-body { 
      flex: 1; 
      display: flex; 
      overflow: hidden; 
    }

    .content-area { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
      overflow: hidden; 
    }
  `]
})
export class MainLayoutComponent {}