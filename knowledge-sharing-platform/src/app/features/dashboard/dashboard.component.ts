import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// State imports
import * as DocumentsActions from '../../state/documents/documents.actions';
import * as DocumentsSelectors from '../../state/documents/documents.selectors';
import * as AuthSelectors from '../../state/auth/auth.selectors';
import { Document, AuthUser } from '../../core/models';

interface DashboardStats {
  totalDocuments: number;
  popularThisWeek: number;
  myDocuments: number;
  addedThisWeek: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  // Observables
  currentUser$: Observable<AuthUser | null> = this.store.select(AuthSelectors.selectCurrentUser);
  recentDocuments$: Observable<Document[]> = this.store.select(DocumentsSelectors.selectRecentDocuments);
  popularDocuments$: Observable<Document[]> = this.store.select(DocumentsSelectors.selectPopularDocuments);
  userDocuments$: Observable<Document[]> = this.store.select(DocumentsSelectors.selectUserDocuments);

  // Stats observable (mock data for now)
  stats$: Observable<DashboardStats> = new Observable(observer => {
    observer.next({
      totalDocuments: 156,
      popularThisWeek: 12,
      myDocuments: 8,
      addedThisWeek: 23
    });
  });

  ngOnInit(): void {
    // Load dashboard data
    this.store.dispatch(DocumentsActions.loadDocuments({ filters: {} }));
  }

  // Navigation methods
  viewDocument(id: string): void {
    // Navigate to document detail
    console.log('View document:', id);
  }

  editDocument(id: string): void {
    // Navigate to document edit
    console.log('Edit document:', id);
  }

  shareDocument(id: string): void {
    // Open share dialog
    console.log('Share document:', id);
  }

  uploadDocument(): void {
    // Navigate to upload page
    console.log('Upload document');
  }

  searchDocuments(): void {
    // Navigate to search page
    console.log('Search documents');
  }
}