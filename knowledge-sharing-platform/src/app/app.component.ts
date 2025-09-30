import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { AuthService } from './core/services';
import * as AuthActions from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <app-main-layout></app-main-layout>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  
  title = 'knowledge-sharing-platform';

  ngOnInit(): void {
    // Initialize auth state from stored token
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.authService.isAuthenticated()) {
      this.store.dispatch(AuthActions.updateUser({ user: currentUser }));
    }
  }
}
