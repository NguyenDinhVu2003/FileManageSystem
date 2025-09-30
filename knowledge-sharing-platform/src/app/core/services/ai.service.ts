import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  AIGenerateSummaryRequest,
  AIGenerateSummaryResponse,
  AISuggestTagsRequest,
  AISuggestTagsResponse,
  AIExtractKeywordsRequest,
  AIExtractKeywordsResponse,
  AIAnalyzeDocumentRequest,
  AIAnalyzeDocumentResponse,
  AISearchRequest,
  AISearchResponse,
  ApiResponse
} from '../models';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  
  private readonly API_URL = '/api/ai';
  private readonly USE_MOCK = true; // Toggle for mock/real API

  /**
   * Generate summary for content using AI
   */
  generateSummary(request: AIGenerateSummaryRequest): Observable<AIGenerateSummaryResponse> {
    if (this.USE_MOCK) {
      return this.mockApi.generateSummary(request.content)
        .pipe(map(response => response.data!));
    }

    return this.http.post<ApiResponse<AIGenerateSummaryResponse>>(`${this.API_URL}/summarize`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Suggest tags for content using AI
   */
  suggestTags(request: AISuggestTagsRequest): Observable<AISuggestTagsResponse> {
    if (this.USE_MOCK) {
      return this.mockApi.suggestTags(request.content)
        .pipe(map(response => response.data!));
    }

    return this.http.post<ApiResponse<AISuggestTagsResponse>>(`${this.API_URL}/suggest-tags`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Extract keywords from content using AI
   */
  extractKeywords(request: AIExtractKeywordsRequest): Observable<AIExtractKeywordsResponse> {
    if (this.USE_MOCK) {
      const mockResponse: AIExtractKeywordsResponse = {
        keywords: ['artificial intelligence', 'machine learning', 'data analysis', 'automation', 'technology'],
        confidence: 0.82
      };

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockResponse);
          observer.complete();
        }, 1200);
      });
    }

    return this.http.post<ApiResponse<AIExtractKeywordsResponse>>(`${this.API_URL}/extract-keywords`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Analyze document comprehensively using AI
   */
  analyzeDocument(request: AIAnalyzeDocumentRequest): Observable<AIAnalyzeDocumentResponse> {
    if (this.USE_MOCK) {
      const mockResponse: AIAnalyzeDocumentResponse = {
        summary: 'This document provides comprehensive insights into the topic with detailed explanations and practical examples.',
        tags: ['analysis', 'best-practices', 'guidelines', 'tutorial'],
        keywords: ['implementation', 'methodology', 'framework', 'optimization'],
        category: 'guide',
        complexity: 'intermediate',
        estimatedReadTime: 8,
        confidence: 0.87
      };

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockResponse);
          observer.complete();
        }, 2500);
      });
    }

    return this.http.post<ApiResponse<AIAnalyzeDocumentResponse>>(`${this.API_URL}/analyze`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * AI-powered search
   */
  searchWithAI(request: AISearchRequest): Observable<AISearchResponse> {
    if (this.USE_MOCK) {
      const mockResponse: AISearchResponse = {
        results: [
          {
            documentId: '1',
            title: 'Angular Best Practices Guide',
            description: 'Comprehensive guide for Angular development',
            relevance: 0.95,
            highlights: ['Angular best practices', 'component architecture', 'performance optimization'],
            tags: ['angular', 'best-practices', 'frontend']
          },
          {
            documentId: '2',
            title: 'TypeScript Advanced Patterns',
            description: 'Advanced TypeScript design patterns and techniques',
            relevance: 0.87,
            highlights: ['TypeScript patterns', 'generic types', 'advanced features'],
            tags: ['typescript', 'patterns', 'advanced']
          }
        ],
        suggestions: ['angular performance', 'typescript generics', 'component design'],
        confidence: 0.89
      };

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockResponse);
          observer.complete();
        }, 1800);
      });
    }

    return this.http.post<ApiResponse<AISearchResponse>>(`${this.API_URL}/search`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Generate content suggestions based on user input
   */
  generateContentSuggestions(topic: string, type: 'title' | 'description' | 'content'): Observable<string[]> {
    if (this.USE_MOCK) {
      const suggestions: { [key: string]: string[] } = {
        title: [
          `Complete Guide to ${topic}`,
          `${topic}: Best Practices and Tips`,
          `Understanding ${topic}: A Comprehensive Overview`,
          `${topic} Implementation Strategies`,
          `Advanced ${topic} Techniques`
        ],
        description: [
          `This comprehensive guide covers everything you need to know about ${topic}.`,
          `Learn the fundamentals and advanced concepts of ${topic} through practical examples.`,
          `Discover best practices and common pitfalls when working with ${topic}.`,
          `A detailed exploration of ${topic} with real-world applications and use cases.`,
          `Master ${topic} with this step-by-step guide featuring expert insights.`
        ],
        content: [
          `Introduction to ${topic}`,
          `Key concepts and terminology`,
          `Implementation guidelines`,
          `Best practices and recommendations`,
          `Common challenges and solutions`,
          `Advanced techniques and patterns`,
          `Performance optimization`,
          `Troubleshooting and debugging`,
          `Future considerations and trends`
        ]
      };

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(suggestions[type] || []);
          observer.complete();
        }, 800);
      });
    }

    return this.http.post<ApiResponse<string[]>>(`${this.API_URL}/suggest-content`, { topic, type })
      .pipe(map(response => response.data!));
  }

  /**
   * Improve content quality using AI
   */
  improveContent(content: string, improvementType: 'grammar' | 'clarity' | 'structure'): Observable<string> {
    if (this.USE_MOCK) {
      const improvedContent = content + '\n\n[AI Improved Version]\nThis content has been enhanced for better ' + improvementType + '.';
      
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(improvedContent);
          observer.complete();
        }, 1500);
      });
    }

    return this.http.post<ApiResponse<string>>(`${this.API_URL}/improve-content`, { content, improvementType })
      .pipe(map(response => response.data!));
  }

  /**
   * Generate quiz questions from content
   */
  generateQuiz(content: string, questionCount = 5): Observable<any[]> {
    if (this.USE_MOCK) {
      const mockQuestions = Array.from({ length: questionCount }, (_, index) => ({
        id: index + 1,
        question: `Question ${index + 1} based on the provided content?`,
        options: [
          'Option A - First possible answer',
          'Option B - Second possible answer',
          'Option C - Third possible answer',
          'Option D - Fourth possible answer'
        ],
        correctAnswer: 0,
        explanation: 'This is the correct answer because...'
      }));

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockQuestions);
          observer.complete();
        }, 2000);
      });
    }

    return this.http.post<ApiResponse<any[]>>(`${this.API_URL}/generate-quiz`, { content, questionCount })
      .pipe(map(response => response.data!));
  }

  /**
   * Check content for quality and completeness
   */
  analyzeContentQuality(content: string): Observable<any> {
    if (this.USE_MOCK) {
      const qualityReport = {
        overallScore: 85,
        readabilityScore: 88,
        completenessScore: 82,
        structureScore: 87,
        recommendations: [
          'Add more examples to improve clarity',
          'Consider breaking down complex sentences',
          'Include a summary section at the end',
          'Add more visual elements if possible'
        ],
        strengths: [
          'Clear introduction and objectives',
          'Good use of technical terminology',
          'Logical flow of information'
        ],
        areas_for_improvement: [
          'Could benefit from more practical examples',
          'Some sections are too dense',
          'Missing conclusion section'
        ]
      };

      return new Observable(observer => {
        setTimeout(() => {
          observer.next(qualityReport);
          observer.complete();
        }, 1800);
      });
    }

    return this.http.post<ApiResponse<any>>(`${this.API_URL}/analyze-quality`, { content })
      .pipe(map(response => response.data!));
  }
}