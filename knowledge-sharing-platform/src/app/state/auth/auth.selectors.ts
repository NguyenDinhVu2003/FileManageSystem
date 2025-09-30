import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role
);

export const selectUserDepartment = createSelector(
  selectCurrentUser,
  (user) => user?.department
);

export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : null
);

export const selectUserInitials = createSelector(
  selectCurrentUser,
  (user) => user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : null
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'admin'
);

export const selectIsManager = createSelector(
  selectUserRole,
  (role) => role === 'manager' || role === 'admin'
);