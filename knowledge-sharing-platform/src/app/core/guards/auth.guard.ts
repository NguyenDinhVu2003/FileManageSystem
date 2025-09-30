import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  CanLoad, 
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthentication(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> {
    const url = segments.map(segment => segment.path).join('/');
    return this.checkAuthentication(`/${url}`);
  }

  private checkAuthentication(redirectUrl: string): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          // Store the attempted URL for redirecting after login (only in browser)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('redirectUrl', redirectUrl);
          }
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        const hasRequiredRole = requiredRoles.includes(user.role);
        
        if (!hasRequiredRole) {
          this.router.navigate(['/dashboard'], {
            queryParams: { error: 'insufficient-permissions' }
          });
          return false;
        }

        return true;
      })
    );
  }
}