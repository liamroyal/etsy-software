export type Permission = 
  | 'view_dashboard'
  | 'view_products'
  | 'edit_products'
  | 'manage_users'
  | 'manage_products'
  | 'manage_orders';

export type Feature = 
  | 'bulk_import'
  | 'analytics'
  | 'advanced_pricing';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: Permission[];
  features: Feature[];
}

// Simplified permissions - just what we actually need
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'view_dashboard',
    'view_products',
    'edit_products',
    'manage_users',
    'manage_products',
    'manage_orders'
  ],
  user: [
    'view_dashboard',
    'view_products'
  ]
};

// Permission checking utilities
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission) || 
         ROLE_PERMISSIONS[user.role]?.includes(permission) || 
         user.role === 'admin';
};

export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

export const hasFeature = (user: User | null, feature: Feature): boolean => {
  if (!user) return false;
  return user.features.includes(feature) || user.role === 'admin';
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isUser = (user: User | null): boolean => {
  return user?.role === 'user';
};

// Convenience checks for common patterns
export const canViewProducts = (user: User | null): boolean => {
  return hasPermission(user, 'view_products');
};

export const canEditProducts = (user: User | null): boolean => {
  return hasPermission(user, 'edit_products');
};

export const canManageUsers = (user: User | null): boolean => {
  return hasPermission(user, 'manage_users');
}; 