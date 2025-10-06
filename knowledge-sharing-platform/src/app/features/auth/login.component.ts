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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router: Router = inject(Router);

  loginForm!: FormGroup;
  hidePassword = true;

  // Mock user credentials
  private readonly mockUser = {
    email: 'admin@company.com',
    password: 'password123'
  };

  // Observables
  loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  error$ = this.store.select(AuthSelectors.selectAuthError);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);

  ngOnInit(): void {
    this.createForm();
    
    // Redirect if already authenticated
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      
      // Debug: Log form values
      console.log('Form Values:', formValues);
      console.log('Expected:', this.mockUser);
      console.log('Email match:', formValues.email === this.mockUser.email);
      console.log('Password match:', formValues.password === this.mockUser.password);
      
      // Mock validation
      if (formValues.email === this.mockUser.email && formValues.password === this.mockUser.password) {
        const credentials: AuthRequest = {
          email: formValues.email,
          password: formValues.password
        };
        console.log('Login successful, dispatching action...');
        this.store.dispatch(AuthActions.login({ credentials }));
      } else {
        // Dispatch login error for invalid credentials
        console.log('Login failed - credentials mismatch');
        this.store.dispatch(AuthActions.loginFailure({ 
          error: 'Invalid email or password' 
        }));
      }
    } else {
      console.log('Form is invalid:', this.loginForm.errors);
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // Debug helper method
  fillTestCredentials(): void {
    this.loginForm.patchValue({
      email: this.mockUser.email,
      password: this.mockUser.password
    });
  }
}