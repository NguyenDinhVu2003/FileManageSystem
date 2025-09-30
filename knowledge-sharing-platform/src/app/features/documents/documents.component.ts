import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// State imports
import * as DocumentSelectors from '../../state/documents/documents.selectors';
import { Document } from '../../core/models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  private readonly store = inject(Store);

  documents$: Observable<Document[]> = this.store.select(DocumentSelectors.selectDocuments);

  ngOnInit(): void {
    // Load documents if needed
  }
}