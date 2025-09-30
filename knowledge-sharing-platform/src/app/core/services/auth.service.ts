import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, timer, throwError, of } from 'rxjs';
import { map, tap, catchError, switchMap, takeUntil } from 'rxjs/operators';
import { 
  AuthRequest, 
  AuthResponse, 
  AuthUser, 
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse 
} from '../models';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mockApi = inject(MockApiService);
  
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getCurrentUser());
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private sessionTimer?: Observable<number>;
  private logoutTimer?: any;

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeSessionManagement();
  }

  /**
   * Login user with email and password
   */
  login(credentials: AuthRequest): Observable<AuthUser> {
    return this.mockApi.login(credentials)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.error || 'Login failed');
          }
          return response.data;
        }),
        tap((authResponse: AuthResponse) => {
          this.setSession(authResponse);
          this.startSessionTimer();
        }),
        map(authResponse => authResponse.user),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user and clear session
   */
  logout(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/logout`, {})
      .pipe(
        map(() => void 0),
        tap(() => this.clearSession()),
        catchError(() => {
          // Even if logout API fails, clear local session
          this.clearSession();
          return of(void 0);
        })
      );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('No refresh token available'));
    }

    const refreshRequest: RefreshTokenRequest = { refreshToken };
    
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/refresh`, refreshRequest)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.error || 'Token refresh failed');
          }
          return response.data;
        }),
        tap((authResponse: AuthResponse) => {
          this.setSession(authResponse);
          this.startSessionTimer();
        }),
        catchError(error => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<AuthUser> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/register`, userData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.error || 'Registration failed');
          }
          return response.data;
        }),
        tap((authResponse: AuthResponse) => {
          this.setSession(authResponse);
          this.startSessionTimer();
        }),
        map(authResponse => authResponse.user),
        catchError(this.handleError)
      );
  }

  /**
   * Change user password
   */
  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/change-password`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.error || 'Password change failed');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Request password reset
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/forgot-password`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.error || 'Password reset request failed');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Reset password with token
   */
  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/reset-password`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.error || 'Password reset failed');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get current user data
   */
  getCurrentUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Update current user data
   */
  updateCurrentUser(user: AuthUser): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Private Methods
   */

  private setSession(authResponse: AuthResponse): void {
    const expiresAt = Date.now() + (authResponse.expiresIn * 1000);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
      localStorage.setItem('expires_at', expiresAt.toString());
    }
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem('expires_at');
    }
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.stopSessionTimer();
    
    // Redirect to login using window.location for SSR compatibility
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/auth/login';
    }
  }

  private hasValidToken(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiresAt = localStorage.getItem('expires_at');
    
    if (!token || !expiresAt) {
      return false;
    }
    
    return Date.now() < parseInt(expiresAt);
  }

  private initializeSessionManagement(): void {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Start session timer if user is already authenticated
    if (this.isAuthenticated()) {
      this.startSessionTimer();
    }

    // Listen for storage changes (multi-tab logout)
    window.addEventListener('storage', (event) => {
      if (event.key === this.TOKEN_KEY && !event.newValue) {
        this.clearSession();
      }
    });

    // Listen for user activity to reset session timer
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => {
        if (this.isAuthenticated()) {
          this.resetSessionTimer();
        }
      }, { passive: true });
    });
  }

  private startSessionTimer(): void {
    this.stopSessionTimer();
    
    this.logoutTimer = setTimeout(() => {
      this.logout().subscribe();
    }, this.SESSION_TIMEOUT);
  }

  private stopSessionTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private resetSessionTimer(): void {
    if (this.isAuthenticated()) {
      this.startSessionTimer();
    }
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Auth Service Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return throwError(() => new Error(errorMessage));
  };
}