import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

// State imports
import * as AuthActions from '../../state/auth/auth.actions';
import * as AuthSelectors from '../../state/auth/auth.selectors';
import { AuthRequest } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <mat-card class="login-card">
          <mat-card-header>
            <mat-card-title class="login-title">
              <mat-icon class="title-icon">school</mat-icon>
              Knowledge Sharing Platform
            </mat-card-title>
            <mat-card-subtitle>Sign in to access your account</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <!-- Email Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  type="email"
                  placeholder="Enter your email"
                  formControlName="email"
                  autocomplete="email"
                  [class.error]="email?.invalid && email?.touched"
                >
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="email?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="email?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <!-- Password Field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  placeholder="Enter your password"
                  formControlName="password"
                  autocomplete="current-password"
                  [class.error]="password?.invalid && password?.touched"
                >
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword"
                >
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="password?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="password?.hasError('minlength')">
                  Password must be at least 6 characters long
                </mat-error>
              </mat-form-field>

              <!-- Remember Me -->
              <div class="form-options">
                <mat-checkbox formControlName="rememberMe" color="primary">
                  Remember me
                </mat-checkbox>
                <a routerLink="/auth/forgot-password" class="forgot-password-link">
                  Forgot password?
                </a>
              </div>

              <!-- Error Message -->
              <div *ngIf="error$ | async as error" class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ error }}</span>
              </div>

              <!-- Submit Button -->
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || (loading$ | async)"
                class="login-button full-width"
              >
                <span *ngIf="!(loading$ | async)">Sign In</span>
                <mat-spinner *ngIf="loading$ | async" diameter="20"></mat-spinner>
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions>
            <p class="register-link">
              Don't have an account?
              <a routerLink="/auth/register" class="link">Sign up here</a>
            </p>
          </mat-card-actions>
        </mat-card>

        <!-- Demo Accounts -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title class="demo-title">Demo Accounts</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="demo-accounts">
              <button
                mat-stroked-button
                (click)="loginWithDemo('admin')"
                class="demo-button"
                [disabled]="loading$ | async"
              >
                <mat-icon>admin_panel_settings</mat-icon>
                Admin Demo
              </button>
              <button
                mat-stroked-button
                (click)="loginWithDemo('manager')"
                class="demo-button"
                [disabled]="loading$ | async"
              >
                <mat-icon>manage_accounts</mat-icon>
                Manager Demo
              </button>
              <button
                mat-stroked-button
                (click)="loginWithDemo('user')"
                class="demo-button"
                [disabled]="loading$ | async"
              >
                <mat-icon>person</mat-icon>
                User Demo
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-wrapper {
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .login-card, .demo-card {
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }

    .login-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .title-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .full-width {
      width: 100%;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
    }

    .forgot-password-link {
      color: #1976d2;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .forgot-password-link:hover {
      text-decoration: underline;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #ffebee;
      border: 1px solid #f44336;
      border-radius: 8px;
      color: #c62828;
      font-size: 0.875rem;
    }

    .error-message mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .login-button {
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
      margin-top: 16px;
    }

    .register-link {
      text-align: center;
      margin: 16px 0 0 0;
      color: #666;
    }

    .link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    .demo-title {
      font-size: 1.125rem;
      color: #424242;
      margin-bottom: 16px;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .demo-button {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-start;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 500;
    }

    .demo-button mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .error {
      border-color: #f44336 !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .login-container {
        padding: 16px;
      }

      .login-wrapper {
        max-width: 100%;
      }

      .login-card, .demo-card {
        padding: 20px;
      }

      .login-title {
        font-size: 1.25rem;
      }

      .demo-accounts {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router: Router = inject(Router);

  loginForm!: FormGroup;
  hidePassword = true;

  // Observables
  loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  error$ = this.store.select(AuthSelectors.selectAuthError);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);

  ngOnInit(): void {
    this.createForm();
    
    // Redirect if already authenticated
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        (this.router as any).navigate(['/dashboard']);
      }
    });
  }

  private createForm(): void {
    this.loginForm = (this.fb as any).group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: AuthRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.store.dispatch(AuthActions.login({ credentials }));
    } else {
      this.markFormGroupTouched();
    }
  }

  loginWithDemo(role: 'admin' | 'manager' | 'user'): void {
    const demoCredentials: { [key: string]: AuthRequest } = {
      admin: { email: 'admin@company.com', password: 'password123' },
      manager: { email: 'manager@company.com', password: 'password123' },
      user: { email: 'user@company.com', password: 'password123' }
    };

    this.store.dispatch(AuthActions.login({ credentials: demoCredentials[role] }));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}