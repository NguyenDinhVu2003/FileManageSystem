import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

// State imports
import * as AuthActions from '../state/auth/auth.actions';
import * as AuthSelectors from '../state/auth/auth.selectors';
import { AuthUser } from '../core/models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    TitleCasePipe
  ],
  template: `
    <div class="layout-container" *ngIf="currentUser$ | async as user">
      <mat-sidenav-container class="sidenav-container">
        <!-- Modern Sidebar -->
        <mat-sidenav 
          #drawer 
          class="modern-sidenav" 
          fixedInViewport 
          [attr.role]="'navigation'"
          [mode]="'side'"
          [opened]="true"
        >
          <!-- Sidebar Header with Brand -->
          <div class="sidebar-header">
            <div class="brand-container">
              <div class="brand-icon">
                <mat-icon>auto_stories</mat-icon>
              </div>
              <div class="brand-text">
                <div class="brand-title">Knowledge</div>
                <div class="brand-subtitle">Platform</div>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <div class="nav-section">
            <div class="nav-group">
              <div class="nav-group-title">Main</div>
              <nav class="nav-menu">
                <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
                  <div class="nav-icon">
                    <mat-icon></mat-icon>
                  </div>
                  <span class="nav-label">Dashboard</span>
                </a>

                <a class="nav-item" routerLink="/documents" routerLinkActive="active">
                  <div class="nav-icon">
                    <mat-icon></mat-icon>
                  </div>
                  <span class="nav-label">Documents</span>
                </a>

                <a class="nav-item" routerLink="/search" routerLinkActive="active">
                  <div class="nav-icon">
                    <mat-icon></mat-icon>
                  </div>
                  <span class="nav-label">Search</span>
                </a>

                <a class="nav-item" routerLink="/documents/upload" routerLinkActive="active">
                  <div class="nav-icon">
                    <mat-icon></mat-icon>
                  </div>
                  <span class="nav-label">Upload</span>
                </a>
              </nav>
            </div>

            <div class="nav-group">
              <div class="nav-group-title">Account</div>
              <nav class="nav-menu">
                <a class="nav-item" routerLink="/profile" routerLinkActive="active">
                  <div class="nav-icon">
                    <mat-icon></mat-icon>
                  </div>
                  <span class="nav-label">Profile</span>
                </a>

                <a 
                  *ngIf="(isAdmin$ | async)"
                  class="nav-item" 
                  routerLink="/admin" 
                  routerLinkActive="active"
                >
                  <div class="nav-icon">
                    <mat-icon>admin_panel_settings</mat-icon>
                  </div>
                  <span class="nav-label">Admin Panel</span>
                </a>
              </nav>
            </div>
          </div>

          <!-- Sidebar Footer -->
          <div class="sidebar-footer">
            <button class="logout-btn" (click)="logout()" matTooltip="Logout">
              <mat-icon></mat-icon>
              <span>Sign Out</span>
            </button>
          </div>
        </mat-sidenav>
        

        <!-- Main Content Area -->
        <mat-sidenav-content>
          <!-- Modern Header/Toolbar -->
          <header class="modern-header">
            <div class="header-left">
              <button
                mat-icon-button
                class="mobile-menu-btn"
                (click)="drawer.toggle()"
                matTooltip="Toggle menu"
              >
                <mat-icon>menu</mat-icon>
              </button>

              <div class="page-title">
                <h1>{{ getPageTitle() }}</h1>
              </div>
            </div>

            <div class="header-center">
              <!-- Enhanced Search Bar -->
              <div class="search-wrapper">
                <div class="search-container">
                  <mat-icon class="search-icon">search</mat-icon>
                  <input 
                    type="text" 
                    placeholder="Search documents, users, or content..." 
                    class="search-input"
                    #searchInput
                  >
                  <button 
                    mat-icon-button 
                    class="search-clear"
                    *ngIf="searchInput.value"
                    (click)="clearSearch(searchInput)"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class="header-right">
              <!-- Quick Actions -->
              <!-- <div class="quick-actions">
                <button 
                  mat-icon-button 
                  class="action-btn"
                  matTooltip="Notifications"
                  [matMenuTriggerFor]="notificationMenu"
                >
                  <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
                </button>

                <button 
                  mat-icon-button 
                  class="action-btn"
                  matTooltip="Quick upload"
                  routerLink="/documents/upload"
                >
                  <mat-icon>add_circle_outline</mat-icon>
                </button>
              </div> -->

              <!-- User Profile Menu -->
              <div class="user-menu-container">
                <button 
                  mat-button 
                  class="user-profile-btn"
                  [matMenuTriggerFor]="userMenu"
                >
                  <div class="user-avatar-container">
                    <div class="user-avatar">
                      <mat-icon *ngIf="!user.avatar">person</mat-icon>
                      <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.firstName + ' ' + user.lastName">
                    </div>
                    <div class="user-status"></div>
                  </div>
                  <!-- <div class="user-info">
                    <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                    <span class="user-role">{{ user.role | titlecase }}</span>
                  </div>
                  <mat-icon class="dropdown-icon">expand_more</mat-icon> -->
                </button>
              </div>
            </div>

            <!-- Notification Menu -->
            <mat-menu #notificationMenu="matMenu" class="notification-menu">
              <div class="menu-header">
                <h3>Notifications</h3>
                <button mat-button class="mark-read-btn">Mark all as read</button>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item class="notification-item">
                <mat-icon>description</mat-icon>
                <div class="notification-content">
                  <div class="notification-title">New document shared</div>
                  <div class="notification-time">2 minutes ago</div>
                </div>
              </button>
              <button mat-menu-item class="notification-item">
                <mat-icon>comment</mat-icon>
                <div class="notification-content">
                  <div class="notification-title">Comment on your document</div>
                  <div class="notification-time">1 hour ago</div>
                </div>
              </button>
              <button mat-menu-item class="notification-item">
                <mat-icon>star</mat-icon>
                <div class="notification-content">
                  <div class="notification-title">Document liked by someone</div>
                  <div class="notification-time">3 hours ago</div>
                </div>
              </button>
            </mat-menu>

            <!-- User Menu -->
            <mat-menu #userMenu="matMenu" class="user-menu">
              <div class="user-menu-header">
                <div class="user-avatar large">
                  <mat-icon *ngIf="!user.avatar">person</mat-icon>
                  <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.firstName + ' ' + user.lastName">
                </div>
                <div class="user-details">
                  <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>account_circle</mat-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item>
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <button mat-menu-item>
                <mat-icon>help_outline</mat-icon>
                <span>Help & Support</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()" class="logout-menu-item">
                <mat-icon>logout</mat-icon>
                <span>Sign Out</span>
              </button>
            </mat-menu>
          </header>

          <!-- Page Content -->
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>

    <!-- Auth Layout -->
    <div *ngIf="!(currentUser$ | async)" class="auth-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    /* Layout Container */
    .layout-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
    }

    /* Modern Sidebar Styles */
    .modern-sidenav {
      width: 280px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 24px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
    }

    .sidebar-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      pointer-events: none;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .brand-icon mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .brand-text {
      color: white;
    }

    .brand-title {
      font-size: 1.125rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 2px;
    }

    .brand-subtitle {
      font-size: 0.875rem;
      opacity: 0.9;
      font-weight: 400;
    }

    /* Navigation Section */
    .nav-section {
      flex: 1;
      padding: 24px 0;
      overflow-y: auto;
    }

    .nav-group {
      margin-bottom: 32px;
    }

    .nav-group:last-child {
      margin-bottom: 0;
    }

    .nav-group-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      padding: 0 24px 12px;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 16px;
    }

    /* Navigation Items */
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      text-decoration: none;
      color: #374151;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-item:hover {
      background-color: #f3f4f6;
      color: #1f2937;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #fbbf24;
      border-radius: 0 4px 4px 0;
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .nav-item:not(.active) .nav-icon {
      background: rgba(59, 130, 246, 0.1);
    }

    .nav-item.active .nav-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-item:not(.active) .nav-icon mat-icon {
      color: #3b82f6;
    }

    .nav-label {
      font-weight: 500;
      font-size: 0.875rem;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid #e5e7eb;
      margin-top: auto;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: none;
      background: transparent;
      color: #ef4444;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    /* Modern Header Styles */
    .modern-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    /* Header Left */
    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 0 0 auto;
    }

    .mobile-menu-btn {
      display: none;
    }

    .page-title h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    /* Header Center - Search */
    .header-center {
      flex: 1;
      max-width: 600px;
      margin: 0 24px;
    }

    .search-wrapper {
      width: 100%;
    }

    .search-container {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 8px 16px;
      transition: all 0.2s ease;
      position: relative;
    }

    .search-container:focus-within {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      color: #6b7280;
      margin-right: 12px;
      font-size: 20px;
    }

    .search-input {
      border: none;
      background: transparent;
      outline: none;
      flex: 1;
      font-size: 14px;
      color: #1f2937;
      font-weight: 400;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .search-clear {
      width: 24px;
      height: 24px;
      margin-left: 8px;
    }

    .search-clear mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Header Right */
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 0 0 auto;
    }

    /* Quick Actions */
    .quick-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: #f3f4f6;
    }

    /* User Profile Button */
    .user-menu-container {
      position: relative;
    }

    .user-profile-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 12px;
      transition: all 0.2s ease;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .user-profile-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .user-avatar-container {
      position: relative;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-avatar mat-icon {
      color: white;
      font-size: 20px;
    }

    .user-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
      line-height: 1.2;
    }

    .dropdown-icon {
      color: #6b7280;
      font-size: 18px;
      transition: transform 0.2s ease;
    }

    .user-profile-btn[aria-expanded="true"] .dropdown-icon {
      transform: rotate(180deg);
    }

    /* Menu Styles */
    .notification-menu,
    .user-menu {
      margin-top: 8px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border: 1px solid #e5e7eb;
      min-width: 280px;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }

    .menu-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .mark-read-btn {
      font-size: 0.75rem;
      color: #3b82f6;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 20px;
      min-height: auto;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .notification-time {
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* User Menu Header */
    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .user-avatar.large {
      width: 48px;
      height: 48px;
    }

    .user-details .user-name {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .user-email {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .logout-menu-item {
      color: #ef4444 !important;
    }

    /* Main Content */
    .main-content {
      background: #f8fafc;
      min-height: calc(100vh - 64px);
      overflow-y: auto;
    }

    /* Auth Layout */
    .auth-layout {
      height: 100vh;
      overflow-y: auto;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .header-center {
        max-width: 400px;
        margin: 0 16px;
      }

      .user-info {
        display: none;
      }

      .modern-header {
        padding: 0 16px;
      }
    }

    @media (max-width: 768px) {
      .modern-sidenav {
        width: 100%;
        position: fixed;
        z-index: 1000;
        height: 100vh;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .page-title {
        display: none;
      }

      .header-center {
        margin: 0 12px;
        max-width: none;
        flex: 1;
      }

      .quick-actions {
        gap: 4px;
      }

      .action-btn {
        width: 36px;
        height: 36px;
      }

      .user-profile-btn {
        padding: 6px 8px;
        gap: 8px;
      }

      .user-avatar {
        width: 32px;
        height: 32px;
      }

      .dropdown-icon {
        display: none;
      }

      .modern-header {
        height: 56px;
        padding: 0 12px;
      }

      .main-content {
        min-height: calc(100vh - 56px);
      }
    }

    @media (max-width: 480px) {
      .search-container {
        display: none;
      }

      .header-center {
        display: none;
      }

      .modern-header {
        padding: 0 8px;
      }
    }

    /* Animation Utilities */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .notification-menu,
    .user-menu {
      animation: slideIn 0.2s ease-out;
    }

    /* Focus States */
    .nav-item:focus-visible,
    .action-btn:focus-visible,
    .user-profile-btn:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Dark mode preparation */
    @media (prefers-color-scheme: dark) {
      /* Future dark mode styles can be added here */
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  // Observables
  currentUser$ = this.store.select(AuthSelectors.selectCurrentUser);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  isAdmin$ = this.store.select(AuthSelectors.selectIsAdmin);

  ngOnInit(): void {
    // Initialize layout
  }

  getPageTitle(): string {
    const url = (this.router as any).url;
    const titleMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/documents': 'Documents',
      '/search': 'Search',
      '/profile': 'Profile',
      '/admin': 'Admin Panel',
      '/documents/upload': 'Upload Document'
    };

    // Check for exact matches first
    if (titleMap[url]) {
      return titleMap[url];
    }

    // Check for partial matches (for dynamic routes)
    for (const [route, title] of Object.entries(titleMap)) {
      if (url.startsWith(route)) {
        return title;
      }
    }

    return 'Knowledge Platform';
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.performSearch(event);
    }
  }

  performSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();
    if (query) {
      (this.router as any).navigate(['/search'], { queryParams: { q: query } });
      target.value = '';
    }
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    input.focus();
  }
}