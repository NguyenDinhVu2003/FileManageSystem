import { Injectable, inject } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't add token to auth endpoints
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    // Add auth token to request
    const authRequest = this.addAuthToken(request);

    return next.handle(authRequest).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authRequest, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();
    
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((authResponse) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(authResponse.accessToken);
          
          // Retry the failed request with new token
          const newRequest = this.addAuthToken(request);
          return next.handle(newRequest);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          // Refresh failed, logout user
          this.authService.logout().subscribe();
          return throwError(() => error);
        })
      );
    }

    // If refresh is in progress, wait for it to complete
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => {
        const newRequest = this.addAuthToken(request);
        return next.handle(newRequest);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/forgot-password', '/api/auth/reset-password'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: request.url,
          method: request.method
        });

        return throwError(() => ({
          ...error,
          userMessage: errorMessage
        }));
      })
    );
  }
}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loadingRequests = new Map<string, boolean>();
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestKey = `${request.method}-${request.url}`;
    
    // Start loading
    this.loadingRequests.set(requestKey, true);
    this.updateLoadingState();

    return next.handle(request).pipe(
      catchError(error => {
        // Stop loading on error
        this.loadingRequests.delete(requestKey);
        this.updateLoadingState();
        return throwError(() => error);
      }),
      // Stop loading on completion
      tap({
        next: () => {},
        complete: () => {
          this.loadingRequests.delete(requestKey);
          this.updateLoadingState();
        }
      })
    );
  }

  private updateLoadingState(): void {
    const isLoading = this.loadingRequests.size > 0;
    this.loadingSubject.next(isLoading);
  }
}