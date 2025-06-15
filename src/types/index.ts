import type { Permission, Feature } from '../utils/permissions';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: Permission[];
  features: Feature[];
  name?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}

export interface AccessLevel {
  role: 'admin' | 'user';
  permissions: Permission[];
  features: Feature[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 