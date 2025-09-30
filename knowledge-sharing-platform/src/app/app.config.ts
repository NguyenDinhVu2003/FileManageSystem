import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthInterceptor, ErrorInterceptor, LoadingInterceptor } from './core/interceptors/auth.interceptor';
import { authReducer } from './state/auth/auth.reducer';
import { documentsReducer } from './state/documents/documents.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { DocumentsEffects } from './state/documents/documents.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    // Temporarily disable SSR for development
    // provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      documents: documentsReducer
    }),
    provideEffects([AuthEffects, DocumentsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
