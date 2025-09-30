import { createAction, props } from '@ngrx/store';
import { AuthRequest, AuthUser, ChangePasswordRequest } from '../../core/models';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: AuthRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: AuthUser }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ userData: any }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: AuthUser }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Token Refresh Actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ user: AuthUser }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Change Password Actions
export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ request: ChangePasswordRequest }>()
);

export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success'
);

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: string }>()
);

// Update User Actions
export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: AuthUser }>()
);

// Clear Error Action
export const clearError = createAction('[Auth] Clear Error');