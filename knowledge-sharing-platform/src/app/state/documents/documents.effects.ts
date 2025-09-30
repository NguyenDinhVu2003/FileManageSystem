import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, switchMap } from 'rxjs/operators';
import { DocumentService, NotificationService } from '../../core/services';
import * as DocumentsActions from './documents.actions';
import * as AuthSelectors from '../auth/auth.selectors';

@Injectable()
export class DocumentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly documentService = inject(DocumentService);
  private readonly notificationService = inject(NotificationService);
  private readonly store = inject(Store);

  // Load Documents Effect
  loadDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadDocuments),
      switchMap(action =>
        this.documentService.getDocuments(action.pagination, action.filters).pipe(
          map(result => DocumentsActions.loadDocumentsSuccess({ result })),
          catchError(error => of(DocumentsActions.loadDocumentsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Document Detail Effect
  loadDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadDocument),
      switchMap(action =>
        this.documentService.getDocument(action.id).pipe(
          map(document => DocumentsActions.loadDocumentSuccess({ document })),
          catchError(error => of(DocumentsActions.loadDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  // Create Document Effect
  createDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.createDocument),
      exhaustMap(action =>
        this.documentService.createDocument(action.request).pipe(
          map(document => DocumentsActions.createDocumentSuccess({ document })),
          catchError(error => of(DocumentsActions.createDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  // Create Document Success Effect
  createDocumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.createDocumentSuccess),
      tap(() => {
        this.notificationService.success('Success!', 'Document created successfully.');
      })
    ),
    { dispatch: false }
  );

  // Create Document Failure Effect
  createDocumentFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.createDocumentFailure),
      tap(action => {
        this.notificationService.error('Creation Failed', action.error);
      })
    ),
    { dispatch: false }
  );

  // Update Document Effect
  updateDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.updateDocument),
      exhaustMap(action =>
        this.documentService.updateDocument(action.id, action.request).pipe(
          map(document => DocumentsActions.updateDocumentSuccess({ document })),
          catchError(error => of(DocumentsActions.updateDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  // Update Document Success Effect
  updateDocumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.updateDocumentSuccess),
      tap(() => {
        this.notificationService.success('Success!', 'Document updated successfully.');
      })
    ),
    { dispatch: false }
  );

  // Delete Document Effect
  deleteDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.deleteDocument),
      exhaustMap(action =>
        this.documentService.deleteDocument(action.id).pipe(
          map(() => DocumentsActions.deleteDocumentSuccess({ id: action.id })),
          catchError(error => of(DocumentsActions.deleteDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete Document Success Effect
  deleteDocumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.deleteDocumentSuccess),
      tap(() => {
        this.notificationService.success('Success!', 'Document deleted successfully.');
      })
    ),
    { dispatch: false }
  );

  // Search Documents Effect
  searchDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.searchDocuments),
      switchMap(action =>
        this.documentService.searchDocuments(action.query, action.filters, action.pagination).pipe(
          map(result => DocumentsActions.searchDocumentsSuccess({ result, query: action.query })),
          catchError(error => of(DocumentsActions.searchDocumentsFailure({ error: error.message })))
        )
      )
    )
  );

  // Rate Document Effect
  rateDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.rateDocument),
      exhaustMap(action =>
        this.documentService.rateDocument(action.request).pipe(
          map(document => DocumentsActions.rateDocumentSuccess({ document })),
          catchError(error => of(DocumentsActions.rateDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  // Rate Document Success Effect
  rateDocumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.rateDocumentSuccess),
      tap(() => {
        this.notificationService.success('Thank you!', 'Your rating has been submitted.');
      })
    ),
    { dispatch: false }
  );

  // Add Comment Effect
  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.addComment),
      exhaustMap(action =>
        this.documentService.addComment(action.request).pipe(
          map(comment => DocumentsActions.addCommentSuccess({ 
            comment, 
            documentId: action.request.documentId 
          })),
          catchError(error => of(DocumentsActions.addCommentFailure({ error: error.message })))
        )
      )
    )
  );

  // Add Comment Success Effect
  addCommentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.addCommentSuccess),
      tap(() => {
        this.notificationService.success('Success!', 'Comment added successfully.');
      })
    ),
    { dispatch: false }
  );

  // Load Comments Effect
  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadComments),
      switchMap(action =>
        this.documentService.getComments(action.documentId).pipe(
          map(comments => DocumentsActions.loadCommentsSuccess({ 
            comments, 
            documentId: action.documentId 
          })),
          catchError(error => of(DocumentsActions.loadCommentsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Popular Documents Effect
  loadPopularDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadPopularDocuments),
      switchMap(action =>
        this.documentService.getPopularDocuments(action.limit).pipe(
          map(documents => DocumentsActions.loadPopularDocumentsSuccess({ documents })),
          catchError(error => of(DocumentsActions.loadPopularDocumentsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Recent Documents Effect
  loadRecentDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadRecentDocuments),
      switchMap(action =>
        this.documentService.getRecentDocuments(action.limit).pipe(
          map(documents => DocumentsActions.loadRecentDocumentsSuccess({ documents })),
          catchError(error => of(DocumentsActions.loadRecentDocumentsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load User Documents Effect
  loadUserDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadUserDocuments),
      switchMap(action =>
        this.documentService.getUserDocuments(action.userId, action.limit).pipe(
          map(documents => DocumentsActions.loadUserDocumentsSuccess({ documents })),
          catchError(error => of(DocumentsActions.loadUserDocumentsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Tags Effect
  loadTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadTags),
      switchMap(() =>
        this.documentService.getTags().pipe(
          map(tags => DocumentsActions.loadTagsSuccess({ tags })),
          catchError(error => of(DocumentsActions.loadTagsFailure({ error: error.message })))
        )
      )
    )
  );

  // Error Effects
  loadDocumentsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.loadDocumentsFailure),
      tap(action => {
        this.notificationService.error('Loading Failed', action.error);
      })
    ),
    { dispatch: false }
  );

  searchDocumentsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsActions.searchDocumentsFailure),
      tap(action => {
        this.notificationService.error('Search Failed', action.error);
      })
    ),
    { dispatch: false }
  );
}