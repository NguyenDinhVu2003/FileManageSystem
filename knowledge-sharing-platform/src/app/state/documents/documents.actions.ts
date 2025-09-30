import { createAction, props } from '@ngrx/store';
import { 
  Document, 
  CreateDocumentRequest, 
  UpdateDocumentRequest,
  DocumentSearchFilters,
  DocumentSearchResult,
  PaginationRequest,
  RateDocumentRequest,
  AddCommentRequest,
  Comment,
  Tag
} from '../../core/models';

// Load Documents Actions
export const loadDocuments = createAction(
  '[Documents] Load Documents',
  props<{ pagination?: PaginationRequest; filters?: DocumentSearchFilters }>()
);

export const loadDocumentsSuccess = createAction(
  '[Documents] Load Documents Success',
  props<{ result: DocumentSearchResult }>()
);

export const loadDocumentsFailure = createAction(
  '[Documents] Load Documents Failure',
  props<{ error: string }>()
);

// Load Document Detail Actions
export const loadDocument = createAction(
  '[Documents] Load Document',
  props<{ id: string }>()
);

export const loadDocumentSuccess = createAction(
  '[Documents] Load Document Success',
  props<{ document: Document }>()
);

export const loadDocumentFailure = createAction(
  '[Documents] Load Document Failure',
  props<{ error: string }>()
);

// Create Document Actions
export const createDocument = createAction(
  '[Documents] Create Document',
  props<{ request: CreateDocumentRequest }>()
);

export const createDocumentSuccess = createAction(
  '[Documents] Create Document Success',
  props<{ document: Document }>()
);

export const createDocumentFailure = createAction(
  '[Documents] Create Document Failure',
  props<{ error: string }>()
);

// Update Document Actions
export const updateDocument = createAction(
  '[Documents] Update Document',
  props<{ id: string; request: UpdateDocumentRequest }>()
);

export const updateDocumentSuccess = createAction(
  '[Documents] Update Document Success',
  props<{ document: Document }>()
);

export const updateDocumentFailure = createAction(
  '[Documents] Update Document Failure',
  props<{ error: string }>()
);

// Delete Document Actions
export const deleteDocument = createAction(
  '[Documents] Delete Document',
  props<{ id: string }>()
);

export const deleteDocumentSuccess = createAction(
  '[Documents] Delete Document Success',
  props<{ id: string }>()
);

export const deleteDocumentFailure = createAction(
  '[Documents] Delete Document Failure',
  props<{ error: string }>()
);

// Search Documents Actions
export const searchDocuments = createAction(
  '[Documents] Search Documents',
  props<{ query: string; filters?: DocumentSearchFilters; pagination?: PaginationRequest }>()
);

export const searchDocumentsSuccess = createAction(
  '[Documents] Search Documents Success',
  props<{ result: DocumentSearchResult; query: string }>()
);

export const searchDocumentsFailure = createAction(
  '[Documents] Search Documents Failure',
  props<{ error: string }>()
);

// Rate Document Actions
export const rateDocument = createAction(
  '[Documents] Rate Document',
  props<{ request: RateDocumentRequest }>()
);

export const rateDocumentSuccess = createAction(
  '[Documents] Rate Document Success',
  props<{ document: Document }>()
);

export const rateDocumentFailure = createAction(
  '[Documents] Rate Document Failure',
  props<{ error: string }>()
);

// Comment Actions
export const addComment = createAction(
  '[Documents] Add Comment',
  props<{ request: AddCommentRequest }>()
);

export const addCommentSuccess = createAction(
  '[Documents] Add Comment Success',
  props<{ comment: Comment; documentId: string }>()
);

export const addCommentFailure = createAction(
  '[Documents] Add Comment Failure',
  props<{ error: string }>()
);

export const loadComments = createAction(
  '[Documents] Load Comments',
  props<{ documentId: string }>()
);

export const loadCommentsSuccess = createAction(
  '[Documents] Load Comments Success',
  props<{ comments: Comment[]; documentId: string }>()
);

export const loadCommentsFailure = createAction(
  '[Documents] Load Comments Failure',
  props<{ error: string }>()
);

// Load Popular Documents Actions
export const loadPopularDocuments = createAction(
  '[Documents] Load Popular Documents',
  props<{ limit?: number }>()
);

export const loadPopularDocumentsSuccess = createAction(
  '[Documents] Load Popular Documents Success',
  props<{ documents: Document[] }>()
);

export const loadPopularDocumentsFailure = createAction(
  '[Documents] Load Popular Documents Failure',
  props<{ error: string }>()
);

// Load Recent Documents Actions
export const loadRecentDocuments = createAction(
  '[Documents] Load Recent Documents',
  props<{ limit?: number }>()
);

export const loadRecentDocumentsSuccess = createAction(
  '[Documents] Load Recent Documents Success',
  props<{ documents: Document[] }>()
);

export const loadRecentDocumentsFailure = createAction(
  '[Documents] Load Recent Documents Failure',
  props<{ error: string }>()
);

// Load User Documents Actions
export const loadUserDocuments = createAction(
  '[Documents] Load User Documents',
  props<{ userId: string; limit?: number }>()
);

export const loadUserDocumentsSuccess = createAction(
  '[Documents] Load User Documents Success',
  props<{ documents: Document[] }>()
);

export const loadUserDocumentsFailure = createAction(
  '[Documents] Load User Documents Failure',
  props<{ error: string }>()
);

// Load Tags Actions
export const loadTags = createAction('[Documents] Load Tags');

export const loadTagsSuccess = createAction(
  '[Documents] Load Tags Success',
  props<{ tags: Tag[] }>()
);

export const loadTagsFailure = createAction(
  '[Documents] Load Tags Failure',
  props<{ error: string }>()
);

// Set Filters Action
export const setFilters = createAction(
  '[Documents] Set Filters',
  props<{ filters: DocumentSearchFilters }>()
);

// Clear Selected Document Action
export const clearSelectedDocument = createAction('[Documents] Clear Selected Document');

// Clear Search Results Action
export const clearSearchResults = createAction('[Documents] Clear Search Results');

// Clear Error Action
export const clearError = createAction('[Documents] Clear Error');