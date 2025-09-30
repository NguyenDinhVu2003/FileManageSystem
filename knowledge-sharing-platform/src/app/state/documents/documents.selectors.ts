import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentsState } from './documents.reducer';

export const selectDocumentsState = createFeatureSelector<DocumentsState>('documents');

export const selectDocuments = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.documents
);

export const selectSelectedDocument = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.selectedDocument
);

export const selectSearchResults = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.searchResults
);

export const selectPopularDocuments = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.popularDocuments
);

export const selectRecentDocuments = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.recentDocuments
);

export const selectUserDocuments = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.userDocuments
);

export const selectTags = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.tags
);

export const selectDocumentsLoading = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.loading
);

export const selectDocumentsError = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.error
);

export const selectFilters = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.filters
);

export const selectSearchQuery = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.searchQuery
);

export const selectLastSearchQuery = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.lastSearchQuery
);

export const selectComments = createSelector(
  selectDocumentsState,
  (state: DocumentsState) => state.comments
);

export const selectDocumentComments = (documentId: string) => createSelector(
  selectComments,
  (comments) => comments[documentId] || []
);

export const selectDocumentById = (id: string) => createSelector(
  selectDocuments,
  (documents) => documents.find(doc => doc.id === id)
);

export const selectDocumentsByCategory = (category: string) => createSelector(
  selectDocuments,
  (documents) => documents.filter(doc => doc.category === category)
);

export const selectDocumentsByAuthor = (authorId: string) => createSelector(
  selectDocuments,
  (documents) => documents.filter(doc => doc.authorId === authorId)
);

export const selectTopRatedDocuments = createSelector(
  selectDocuments,
  (documents) => [...documents]
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 10)
);

export const selectMostViewedDocuments = createSelector(
  selectDocuments,
  (documents) => [...documents]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
);

export const selectDocumentsWithTag = (tag: string) => createSelector(
  selectDocuments,
  (documents) => documents.filter(doc => doc.tags.includes(tag))
);

export const selectAllTags = createSelector(
  selectDocuments,
  (documents) => {
    const tagSet = new Set<string>();
    documents.forEach(doc => {
      doc.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }
);

export const selectTagsWithCount = createSelector(
  selectDocuments,
  (documents) => {
    const tagCounts = new Map<string, number>();
    documents.forEach(doc => {
      doc.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
);

export const selectDocumentStatistics = createSelector(
  selectDocuments,
  (documents) => ({
    total: documents.length,
    totalViews: documents.reduce((sum, doc) => sum + doc.viewCount, 0),
    totalDownloads: documents.reduce((sum, doc) => sum + doc.downloadCount, 0),
    averageRating: documents.length > 0 
      ? documents.reduce((sum, doc) => sum + doc.rating.average, 0) / documents.length 
      : 0,
    categoryCounts: documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  })
);

export const selectSearchState = createSelector(
  selectSearchResults,
  selectSearchQuery,
  selectLastSearchQuery,
  (results, query, lastQuery) => ({
    results,
    query,
    lastQuery,
    hasResults: results && results.documents.length > 0,
    hasSearched: lastQuery !== ''
  })
);