import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService, NotificationService } from '../../core/services';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  // Login Success Effect
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        this.notificationService.success('Welcome!', 'You have successfully logged in.');
        
        // Redirect to intended URL or dashboard
        const redirectUrl = localStorage.getItem('redirectUrl') || '/dashboard';
        localStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
      })
    ),
    { dispatch: false }
  );

  // Login Failure Effect
  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(action => {
        this.notificationService.error('Login Failed', action.error);
      })
    ),
    { dispatch: false }
  );

  // Register Effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(action =>
        this.authService.register(action.userData).pipe(
          map(user => AuthActions.registerSuccess({ user })),
          catchError(error => of(AuthActions.registerFailure({ error: error.message })))
        )
      )
    )
  );

  // Register Success Effect
  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => {
        this.notificationService.success('Registration Successful!', 'Welcome to the platform!');
        this.router.navigate(['/dashboard']);
      })
    ),
    { dispatch: false }
  );

  // Register Failure Effect
  registerFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerFailure),
      tap(action => {
        this.notificationService.error('Registration Failed', action.error);
      })
    ),
    { dispatch: false }
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => of(AuthActions.logoutFailure({ error: error.message })))
        )
      )
    )
  );

  // Logout Success Effect
  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.notificationService.info('Logged Out', 'You have been successfully logged out.');
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  // Refresh Token Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map(authResponse => AuthActions.refreshTokenSuccess({ user: authResponse.user })),
          catchError(error => of(AuthActions.refreshTokenFailure({ error: error.message })))
        )
      )
    )
  );

  // Change Password Effect
  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      exhaustMap(action =>
        this.authService.changePassword(action.request).pipe(
          map(() => AuthActions.changePasswordSuccess()),
          catchError(error => of(AuthActions.changePasswordFailure({ error: error.message })))
        )
      )
    )
  );

  // Change Password Success Effect
  changePasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePasswordSuccess),
      tap(() => {
        this.notificationService.success('Password Changed', 'Your password has been successfully updated.');
      })
    ),
    { dispatch: false }
  );

  // Change Password Failure Effect
  changePasswordFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePasswordFailure),
      tap(action => {
        this.notificationService.error('Password Change Failed', action.error);
      })
    ),
    { dispatch: false }
  );
}