export interface Document {
  id: string;
  title: string;
  description: string;
  content?: string;
  summary?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  thumbnailUrl?: string;
  tags: string[];
  category: DocumentCategory;
  privacy: DocumentPrivacy;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: DocumentRating;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  comments?: Comment[];
  aiGenerated?: boolean;
}

export enum DocumentCategory {
  TUTORIAL = 'tutorial',
  GUIDE = 'guide',
  REFERENCE = 'reference',
  BEST_PRACTICE = 'best_practice',
  CASE_STUDY = 'case_study',
  TEMPLATE = 'template',
  PRESENTATION = 'presentation',
  VIDEO = 'video',
  OTHER = 'other'
}

export enum DocumentPrivacy {
  PRIVATE = 'private',
  GROUP = 'group',
  PUBLIC = 'public'
}

export interface DocumentRating {
  average: number;
  count: number;
  distribution: {
    [key: number]: number; // key: star rating (1-5), value: count
  };
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
  parentId?: string;
}

export interface CreateDocumentRequest {
  title: string;
  description: string;
  content?: string;
  tags: string[];
  category: DocumentCategory;
  privacy: DocumentPrivacy;
  file?: File;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
  category?: DocumentCategory;
  privacy?: DocumentPrivacy;
}

export interface DocumentSearchFilters {
  query?: string;
  tags?: string[];
  category?: DocumentCategory;
  privacy?: DocumentPrivacy;
  authorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minRating?: number;
}

export interface DocumentSearchResult {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RateDocumentRequest {
  documentId: string;
  rating: number; // 1-5
}

export interface AddCommentRequest {
  documentId: string;
  content: string;
  parentId?: string;
}