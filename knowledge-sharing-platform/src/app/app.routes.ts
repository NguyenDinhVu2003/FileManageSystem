import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root to dashboard
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },

  // Auth routes (only accessible when not authenticated)
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: async () => (await import('./features/auth/login.component')).LoginComponent
      },
      { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
      }
    ]
  },

  // Protected routes (requires authentication)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: async () => (await import('./features/dashboard/dashboard.component')).DashboardComponent
  },
  
  {
    path: 'documents',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: async () => (await import('./features/documents/documents.component')).DocumentsComponent
      },
      {
        path: 'upload',
        loadComponent: async () => (await import('./features/documents/upload.component')).UploadComponent
      }
    ]
  },

  {
    path: 'search',
    canActivate: [AuthGuard],
    loadComponent: async () => (await import('./features/search/search.component')).SearchComponent
  },

  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: async () => (await import('./features/profile/profile.component')).ProfileComponent
  },

  // Wildcard route - must be last
  { 
    path: '**', 
    redirectTo: '/dashboard'
  }
];
