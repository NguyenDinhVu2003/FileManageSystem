import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  AuthRequest, 
  AuthResponse, 
  AuthUser,
  Document,
  DocumentCategory,
  DocumentPrivacy,
  CreateDocumentRequest,
  DocumentSearchResult,
  DocumentSearchFilters,
  ApiResponse,
  User,
  UserRole,
  Tag
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@company.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      department: 'IT',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: '2',
      email: 'manager@company.com',
      firstName: 'Manager',
      lastName: 'User',
      role: UserRole.MANAGER,
      department: 'Product',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: '3',
      email: 'user@company.com',
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
      department: 'Development',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true
    }
  ];

  private documents: Document[] = [
    {
      id: '1',
      title: 'Angular Best Practices Guide',
      description: 'Comprehensive guide for Angular development best practices',
      content: 'This is a detailed guide about Angular best practices...',
      summary: 'Key practices for developing scalable Angular applications',
      tags: ['angular', 'best-practices', 'frontend', 'development'],
      category: DocumentCategory.GUIDE,
      privacy: DocumentPrivacy.PUBLIC,
      authorId: '1',
      author: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        avatar: 'https://via.placeholder.com/150'
      },
      rating: {
        average: 4.5,
        count: 25,
        distribution: { 1: 1, 2: 2, 3: 3, 4: 8, 5: 11 }
      },
      downloadCount: 150,
      viewCount: 300,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isActive: true,
      fileUrl: '/assets/docs/angular-best-practices.pdf',
      fileName: 'angular-best-practices.pdf',
      fileSize: 2048000,
      fileType: 'application/pdf'
    },
    {
      id: '2',
      title: 'React vs Angular Comparison',
      description: 'Detailed comparison between React and Angular frameworks',
      content: 'This document compares React and Angular...',
      summary: 'Comprehensive comparison of two popular frontend frameworks',
      tags: ['react', 'angular', 'comparison', 'frontend'],
      category: DocumentCategory.CASE_STUDY,
      privacy: DocumentPrivacy.PUBLIC,
      authorId: '2',
      author: {
        id: '2',
        firstName: 'Manager',
        lastName: 'User',
        avatar: 'https://via.placeholder.com/150'
      },
      rating: {
        average: 4.2,
        count: 18,
        distribution: { 1: 0, 2: 1, 3: 4, 4: 8, 5: 5 }
      },
      downloadCount: 89,
      viewCount: 200,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      isActive: true,
      fileUrl: '/assets/docs/react-vs-angular.pdf',
      fileName: 'react-vs-angular.pdf',
      fileSize: 1536000,
      fileType: 'application/pdf'
    }
  ];

  private tags: Tag[] = [
    { id: '1', name: 'angular', usageCount: 45, createdAt: new Date('2024-01-01') },
    { id: '2', name: 'react', usageCount: 32, createdAt: new Date('2024-01-01') },
    { id: '3', name: 'typescript', usageCount: 28, createdAt: new Date('2024-01-01') },
    { id: '4', name: 'best-practices', usageCount: 25, createdAt: new Date('2024-01-01') },
    { id: '5', name: 'frontend', usageCount: 40, createdAt: new Date('2024-01-01') },
    { id: '6', name: 'development', usageCount: 35, createdAt: new Date('2024-01-01') },
    { id: '7', name: 'testing', usageCount: 22, createdAt: new Date('2024-01-01') },
    { id: '8', name: 'performance', usageCount: 18, createdAt: new Date('2024-01-01') }
  ];

  /**
   * Authentication Mock APIs
   */
  login(credentials: AuthRequest): Observable<ApiResponse<AuthResponse>> {
    return of(null).pipe(
      delay(1000), // Simulate network delay
      map(() => {
        const user = this.users.find(u => u.email === credentials.email);
        
        if (!user || credentials.password !== 'password123') {
          throw new Error('Invalid email or password');
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          avatar: user.avatar
        };

        const response: ApiResponse<AuthResponse> = {
          success: true,
          data: {
            accessToken: `mock-access-token-${user.id}-${Date.now()}`,
            refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
            user: authUser,
            expiresIn: 3600 // 1 hour
          }
        };

        return response;
      })
    );
  }

  logout(): Observable<ApiResponse<void>> {
    return of({
      success: true,
      message: 'Logged out successfully'
    }).pipe(delay(500));
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const user = this.users[0]; // Default to first user for mock
        
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          avatar: user.avatar
        };

        const response: ApiResponse<AuthResponse> = {
          success: true,
          data: {
            accessToken: `mock-access-token-refreshed-${Date.now()}`,
            refreshToken: `mock-refresh-token-refreshed-${Date.now()}`,
            user: authUser,
            expiresIn: 3600
          }
        };

        return response;
      })
    );
  }

  /**
   * Documents Mock APIs
   */
  getDocuments(page = 1, limit = 10, filters?: DocumentSearchFilters): Observable<ApiResponse<DocumentSearchResult>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        let filteredDocs = [...this.documents];

        // Apply filters
        if (filters?.query) {
          const query = filters.query.toLowerCase();
          filteredDocs = filteredDocs.filter(doc => 
            doc.title.toLowerCase().includes(query) ||
            doc.description.toLowerCase().includes(query) ||
            doc.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        if (filters?.tags && filters.tags.length > 0) {
          filteredDocs = filteredDocs.filter(doc =>
            filters.tags!.some(tag => doc.tags.includes(tag))
          );
        }

        if (filters?.category) {
          filteredDocs = filteredDocs.filter(doc => doc.category === filters.category);
        }

        if (filters?.privacy) {
          filteredDocs = filteredDocs.filter(doc => doc.privacy === filters.privacy);
        }

        // Sort by creation date (newest first)
        filteredDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

        const result: DocumentSearchResult = {
          documents: paginatedDocs,
          total: filteredDocs.length,
          page,
          limit,
          hasNext: endIndex < filteredDocs.length,
          hasPrevious: page > 1
        };

        return {
          success: true,
          data: result
        };
      })
    );
  }

  getDocument(id: string): Observable<ApiResponse<Document>> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const document = this.documents.find(doc => doc.id === id);
        
        if (!document) {
          throw new Error('Document not found');
        }

        return {
          success: true,
          data: document
        };
      })
    );
  }

  createDocument(request: CreateDocumentRequest): Observable<ApiResponse<Document>> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        const newDocument: Document = {
          id: (this.documents.length + 1).toString(),
          title: request.title,
          description: request.description,
          content: request.content,
          tags: request.tags,
          category: request.category,
          privacy: request.privacy,
          authorId: '1', // Mock current user
          author: {
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            avatar: 'https://via.placeholder.com/150'
          },
          rating: {
            average: 0,
            count: 0,
            distribution: {}
          },
          downloadCount: 0,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };

        this.documents.push(newDocument);

        return {
          success: true,
          data: newDocument,
          message: 'Document created successfully'
        };
      })
    );
  }

  updateDocument(id: string, updates: Partial<Document>): Observable<ApiResponse<Document>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const docIndex = this.documents.findIndex(doc => doc.id === id);
        
        if (docIndex === -1) {
          throw new Error('Document not found');
        }

        this.documents[docIndex] = {
          ...this.documents[docIndex],
          ...updates,
          updatedAt: new Date()
        };

        return {
          success: true,
          data: this.documents[docIndex],
          message: 'Document updated successfully'
        };
      })
    );
  }

  deleteDocument(id: string): Observable<ApiResponse<void>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const docIndex = this.documents.findIndex(doc => doc.id === id);
        
        if (docIndex === -1) {
          throw new Error('Document not found');
        }

        this.documents.splice(docIndex, 1);

        return {
          success: true,
          message: 'Document deleted successfully'
        };
      })
    );
  }

  /**
   * Tags Mock APIs
   */
  getTags(): Observable<ApiResponse<Tag[]>> {
    return of({
      success: true,
      data: this.tags
    }).pipe(delay(300));
  }

  /**
   * File Upload Mock API
   */
  uploadFile(file: File): Observable<ApiResponse<any>> {
    return of(null).pipe(
      delay(2000), // Simulate upload time
      map(() => {
        const fileId = `file-${Date.now()}`;
        return {
          success: true,
          data: {
            fileId,
            fileName: file.name,
            fileUrl: `/api/files/${fileId}`,
            fileSize: file.size,
            fileType: file.type,
            thumbnailUrl: file.type.startsWith('image/') ? `/api/files/${fileId}/thumbnail` : undefined
          },
          message: 'File uploaded successfully'
        };
      })
    );
  }

  /**
   * AI Mock APIs
   */
  generateSummary(content: string): Observable<ApiResponse<any>> {
    return of({
      success: true,
      data: {
        summary: 'This is a mock AI-generated summary of the provided content. The content covers key topics and important points that users should be aware of.',
        keyPoints: [
          'Key point 1 extracted from content',
          'Key point 2 identified by AI',
          'Key point 3 highlighting important information'
        ],
        confidence: 0.85
      }
    }).pipe(delay(2000));
  }

  suggestTags(content: string): Observable<ApiResponse<any>> {
    const mockTags = ['angular', 'typescript', 'frontend', 'development', 'best-practices'];
    
    return of({
      success: true,
      data: {
        tags: mockTags.slice(0, Math.floor(Math.random() * 5) + 1),
        confidence: 0.78
      }
    }).pipe(delay(1500));
  }
}