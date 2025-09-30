export interface AIGenerateSummaryRequest {
  content: string;
  maxLength?: number;
  language?: string;
}

export interface AIGenerateSummaryResponse {
  summary: string;
  keyPoints: string[];
  confidence: number;
}

export interface AISuggestTagsRequest {
  content: string;
  title?: string;
  description?: string;
  maxTags?: number;
}

export interface AISuggestTagsResponse {
  tags: string[];
  confidence: number;
}

export interface AIExtractKeywordsRequest {
  content: string;
  maxKeywords?: number;
}

export interface AIExtractKeywordsResponse {
  keywords: string[];
  confidence: number;
}

export interface AIAnalyzeDocumentRequest {
  content: string;
  title?: string;
  fileType?: string;
}

export interface AIAnalyzeDocumentResponse {
  summary: string;
  tags: string[];
  keywords: string[];
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // in minutes
  confidence: number;
}

export interface AISearchRequest {
  query: string;
  context?: string;
  filters?: {
    category?: string;
    tags?: string[];
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
}

export interface AISearchResponse {
  results: AISearchResult[];
  suggestions: string[];
  confidence: number;
}

export interface AISearchResult {
  documentId: string;
  title: string;
  description: string;
  relevance: number;
  highlights: string[];
  tags: string[];
}