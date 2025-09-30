import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentSearchFilters,
  DocumentSearchResult,
  RateDocumentRequest,
  AddCommentRequest,
  Comment,
  ApiResponse,
  PaginationRequest,
  Tag
} from '../models';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  
  private readonly API_URL = '/api/documents';
  private readonly USE_MOCK = true; // Toggle for mock/real API

  /**
   * Get paginated list of documents
   */
  getDocuments(
    pagination: PaginationRequest = {},
    filters: DocumentSearchFilters = {}
  ): Observable<DocumentSearchResult> {
    if (this.USE_MOCK) {
      return this.mockApi.getDocuments(pagination.page, pagination.limit, filters)
        .pipe(map(response => response.data!));
    }

    let params = new HttpParams();
    
    // Add pagination params
    if (pagination.page) params = params.set('page', pagination.page.toString());
    if (pagination.limit) params = params.set('limit', pagination.limit.toString());
    if (pagination.sortBy) params = params.set('sortBy', pagination.sortBy);
    if (pagination.sortOrder) params = params.set('sortOrder', pagination.sortOrder);
    
    // Add filter params
    if (filters.query) params = params.set('query', filters.query);
    if (filters.tags?.length) params = params.set('tags', filters.tags.join(','));
    if (filters.category) params = params.set('category', filters.category);
    if (filters.privacy) params = params.set('privacy', filters.privacy);
    if (filters.authorId) params = params.set('authorId', filters.authorId);
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo.toISOString());
    if (filters.minRating) params = params.set('minRating', filters.minRating.toString());

    return this.http.get<ApiResponse<DocumentSearchResult>>(this.API_URL, { params })
      .pipe(map(response => response.data!));
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): Observable<Document> {
    if (this.USE_MOCK) {
      return this.mockApi.getDocument(id)
        .pipe(
          map(response => response.data!),
          tap(document => this.incrementViewCount(document.id))
        );
    }

    return this.http.get<ApiResponse<Document>>(`${this.API_URL}/${id}`)
      .pipe(
        map(response => response.data!),
        tap(document => this.incrementViewCount(document.id))
      );
  }

  /**
   * Create new document
   */
  createDocument(request: CreateDocumentRequest): Observable<Document> {
    if (this.USE_MOCK) {
      return this.mockApi.createDocument(request)
        .pipe(map(response => response.data!));
    }

    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('category', request.category);
    formData.append('privacy', request.privacy);
    formData.append('tags', JSON.stringify(request.tags));
    
    if (request.content) {
      formData.append('content', request.content);
    }
    
    if (request.file) {
      formData.append('file', request.file);
    }

    return this.http.post<ApiResponse<Document>>(this.API_URL, formData)
      .pipe(map(response => response.data!));
  }

  /**
   * Update document
   */
  updateDocument(id: string, request: UpdateDocumentRequest): Observable<Document> {
    if (this.USE_MOCK) {
      return this.mockApi.updateDocument(id, request)
        .pipe(map(response => response.data!));
    }

    return this.http.put<ApiResponse<Document>>(`${this.API_URL}/${id}`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Delete document
   */
  deleteDocument(id: string): Observable<void> {
    if (this.USE_MOCK) {
      return this.mockApi.deleteDocument(id)
        .pipe(map(() => void 0));
    }

    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(map(() => void 0));
  }

  /**
   * Rate document
   */
  rateDocument(request: RateDocumentRequest): Observable<Document> {
    if (this.USE_MOCK) {
      // Mock rating update
      return this.getDocument(request.documentId);
    }

    return this.http.post<ApiResponse<Document>>(`${this.API_URL}/${request.documentId}/rate`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Add comment to document
   */
  addComment(request: AddCommentRequest): Observable<Comment> {
    if (this.USE_MOCK) {
      // Mock comment creation
      const mockComment: Comment = {
        id: `comment-${Date.now()}`,
        content: request.content,
        authorId: '1',
        author: {
          id: '1',
          firstName: 'Current',
          lastName: 'User',
          avatar: 'https://via.placeholder.com/150'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: request.parentId
      };

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockComment);
          observer.complete();
        }, 500);
      });
    }

    return this.http.post<ApiResponse<Comment>>(`${this.API_URL}/${request.documentId}/comments`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Get comments for document
   */
  getComments(documentId: string): Observable<Comment[]> {
    if (this.USE_MOCK) {
      // Return mock comments
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Great document! Very helpful for understanding the concepts.',
          authorId: '2',
          author: {
            id: '2',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://via.placeholder.com/150'
          },
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          content: 'Thanks for sharing this knowledge. The examples are very clear.',
          authorId: '3',
          author: {
            id: '3',
            firstName: 'Jane',
            lastName: 'Smith',
            avatar: 'https://via.placeholder.com/150'
          },
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22')
        }
      ];

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockComments);
          observer.complete();
        }, 300);
      });
    }

    return this.http.get<ApiResponse<Comment[]>>(`${this.API_URL}/${documentId}/comments`)
      .pipe(map(response => response.data!));
  }

  /**
   * Search documents
   */
  searchDocuments(
    query: string,
    filters: DocumentSearchFilters = {},
    pagination: PaginationRequest = {}
  ): Observable<DocumentSearchResult> {
    const searchFilters = { ...filters, query };
    return this.getDocuments(pagination, searchFilters);
  }

  /**
   * Get popular documents
   */
  getPopularDocuments(limit = 5): Observable<Document[]> {
    const filters: DocumentSearchFilters = {};
    const pagination: PaginationRequest = { page: 1, limit, sortBy: 'rating', sortOrder: 'desc' };
    
    return this.getDocuments(pagination, filters)
      .pipe(map(result => result.documents));
  }

  /**
   * Get recent documents
   */
  getRecentDocuments(limit = 5): Observable<Document[]> {
    const filters: DocumentSearchFilters = {};
    const pagination: PaginationRequest = { page: 1, limit, sortBy: 'createdAt', sortOrder: 'desc' };
    
    return this.getDocuments(pagination, filters)
      .pipe(map(result => result.documents));
  }

  /**
   * Get user documents
   */
  getUserDocuments(userId: string, limit = 5): Observable<Document[]> {
    const filters: DocumentSearchFilters = { authorId: userId };
    const pagination: PaginationRequest = { page: 1, limit, sortBy: 'createdAt', sortOrder: 'desc' };
    
    return this.getDocuments(pagination, filters)
      .pipe(map(result => result.documents));
  }

  /**
   * Upload file
   */
  uploadFile(file: File): Observable<any> {
    if (this.USE_MOCK) {
      return this.mockApi.uploadFile(file)
        .pipe(map(response => response.data!));
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<any>>('/api/upload', formData)
      .pipe(map(response => response.data!));
  }

  /**
   * Get available tags
   */
  getTags(): Observable<Tag[]> {
    if (this.USE_MOCK) {
      return this.mockApi.getTags()
        .pipe(map(response => response.data!));
    }

    return this.http.get<ApiResponse<Tag[]>>('/api/tags')
      .pipe(map(response => response.data!));
  }

  /**
   * Download document
   */
  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/download`, { 
      responseType: 'blob',
      observe: 'body'
    }).pipe(
      tap(() => this.incrementDownloadCount(id))
    );
  }

  /**
   * Private helper methods
   */
  private incrementViewCount(documentId: string): void {
    // In real implementation, this would be a separate API call
    if (!this.USE_MOCK) {
      this.http.post(`${this.API_URL}/${documentId}/view`, {}).subscribe();
    }
  }

  private incrementDownloadCount(documentId: string): void {
    // In real implementation, this would be a separate API call
    if (!this.USE_MOCK) {
      this.http.post(`${this.API_URL}/${documentId}/download`, {}).subscribe();
    }
  }
}