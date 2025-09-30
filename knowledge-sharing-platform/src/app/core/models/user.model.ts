export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export interface UserProfile {
  id: string;
  bio?: string;
  skills: string[];
  interests: string[];
  socialLinks?: SocialLinks;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  department: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  socialLinks?: SocialLinks;
}