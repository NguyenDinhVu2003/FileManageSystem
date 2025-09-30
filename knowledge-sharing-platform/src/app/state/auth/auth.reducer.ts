import { createReducer, on } from '@ngrx/store';
import { AuthUser } from '../../core/models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })),
  
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AuthActions.refreshTokenSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),

  // Change Password
  on(AuthActions.changePassword, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.changePasswordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  
  on(AuthActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User
  on(AuthActions.updateUser, (state, { user }) => ({
    ...state,
    user
  })),

  // Clear Error
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);