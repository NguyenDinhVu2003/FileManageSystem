import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchControl = new FormControl('');
  selectedFilter = 'all';
  searchResults: any[] = [];
  hasSearched = false;

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  performSearch(): void {
    const query = this.searchControl.value?.trim();
    if (query) {
      this.hasSearched = true;
      // Mock search results
      this.searchResults = [
        {
          title: 'Angular Best Practices',
          type: 'Document',
          description: 'Comprehensive guide to Angular development best practices...',
          date: new Date('2024-01-15')
        },
        {
          title: 'TypeScript Guidelines',
          type: 'Document', 
          description: 'TypeScript coding standards and guidelines for the team...',
          date: new Date('2024-01-10')
        },
        {
          title: 'API Documentation',
          type: 'Document',
          description: 'Complete API documentation for our microservices...',
          date: new Date('2024-01-05')
        }
      ].filter(result => 
        this.selectedFilter === 'all' || 
        result.type.toLowerCase() === this.selectedFilter
      );
    }
  }

  quickSearch(term: string): void {
    this.searchControl.setValue(term);
    this.performSearch();
  }
}