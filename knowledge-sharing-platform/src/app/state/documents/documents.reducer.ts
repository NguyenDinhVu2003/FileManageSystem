import { createReducer, on } from '@ngrx/store';
import { Document, DocumentSearchFilters, DocumentSearchResult, Comment, Tag } from '../../core/models';
import * as DocumentsActions from './documents.actions';

export interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  searchResults: DocumentSearchResult | null;
  popularDocuments: Document[];
  recentDocuments: Document[];
  userDocuments: Document[];
  comments: { [documentId: string]: Comment[] };
  tags: Tag[];
  filters: DocumentSearchFilters;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  lastSearchQuery: string;
}

export const initialState: DocumentsState = {
  documents: [],
  selectedDocument: null,
  searchResults: null,
  popularDocuments: [],
  recentDocuments: [],
  userDocuments: [],
  comments: {},
  tags: [],
  filters: {},
  searchQuery: '',
  loading: false,
  error: null,
  lastSearchQuery: ''
};

export const documentsReducer = createReducer(
  initialState,

  // Load Documents
  on(DocumentsActions.loadDocuments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadDocumentsSuccess, (state, { result }) => ({
    ...state,
    documents: result.documents,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadDocumentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Document Detail
  on(DocumentsActions.loadDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadDocumentSuccess, (state, { document }) => ({
    ...state,
    selectedDocument: document,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadDocumentFailure, (state, { error }) => ({
    ...state,
    selectedDocument: null,
    loading: false,
    error
  })),

  // Create Document
  on(DocumentsActions.createDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.createDocumentSuccess, (state, { document }) => ({
    ...state,
    documents: [document, ...state.documents],
    selectedDocument: document,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.createDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Document
  on(DocumentsActions.updateDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.updateDocumentSuccess, (state, { document }) => ({
    ...state,
    documents: state.documents.map(doc => doc.id === document.id ? document : doc),
    selectedDocument: state.selectedDocument?.id === document.id ? document : state.selectedDocument,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.updateDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Document
  on(DocumentsActions.deleteDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.deleteDocumentSuccess, (state, { id }) => ({
    ...state,
    documents: state.documents.filter(doc => doc.id !== id),
    selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.deleteDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search Documents
  on(DocumentsActions.searchDocuments, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    searchQuery: query
  })),
  
  on(DocumentsActions.searchDocumentsSuccess, (state, { result, query }) => ({
    ...state,
    searchResults: result,
    lastSearchQuery: query,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.searchDocumentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Rate Document
  on(DocumentsActions.rateDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.rateDocumentSuccess, (state, { document }) => ({
    ...state,
    documents: state.documents.map(doc => doc.id === document.id ? document : doc),
    selectedDocument: state.selectedDocument?.id === document.id ? document : state.selectedDocument,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.rateDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Comments
  on(DocumentsActions.loadComments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadCommentsSuccess, (state, { comments, documentId }) => ({
    ...state,
    comments: {
      ...state.comments,
      [documentId]: comments
    },
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadCommentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(DocumentsActions.addComment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.addCommentSuccess, (state, { comment, documentId }) => ({
    ...state,
    comments: {
      ...state.comments,
      [documentId]: [...(state.comments[documentId] || []), comment]
    },
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.addCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Popular Documents
  on(DocumentsActions.loadPopularDocuments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadPopularDocumentsSuccess, (state, { documents }) => ({
    ...state,
    popularDocuments: documents,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadPopularDocumentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Recent Documents
  on(DocumentsActions.loadRecentDocuments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadRecentDocumentsSuccess, (state, { documents }) => ({
    ...state,
    recentDocuments: documents,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadRecentDocumentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // User Documents
  on(DocumentsActions.loadUserDocuments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadUserDocumentsSuccess, (state, { documents }) => ({
    ...state,
    userDocuments: documents,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadUserDocumentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Tags
  on(DocumentsActions.loadTags, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsActions.loadTagsSuccess, (state, { tags }) => ({
    ...state,
    tags,
    loading: false,
    error: null
  })),
  
  on(DocumentsActions.loadTagsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Set Filters
  on(DocumentsActions.setFilters, (state, { filters }) => ({
    ...state,
    filters
  })),

  // Clear Actions
  on(DocumentsActions.clearSelectedDocument, (state) => ({
    ...state,
    selectedDocument: null
  })),
  
  on(DocumentsActions.clearSearchResults, (state) => ({
    ...state,
    searchResults: null,
    searchQuery: '',
    lastSearchQuery: ''
  })),
  
  on(DocumentsActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);