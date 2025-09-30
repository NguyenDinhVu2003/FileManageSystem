export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
  pagination?: PaginationInfo;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  thumbnailUrl?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface UIState {
  loading: LoadingState;
  errors: { [key: string]: string };
  notifications: Notification[];
  theme: Theme;
  sidebarCollapsed: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
  read: boolean;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface AppConfig {
  apiUrl: string;
  version: string;
  environment: string;
  features: {
    aiIntegration: boolean;
    fileUpload: boolean;
    realTimeNotifications: boolean;
    analytics: boolean;
  };
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  usageCount: number;
  createdAt: Date;
}