export type PageType = 'dashboard' | 'products' | 'users' | 'tracking' | 'tracking-database' | 'notes';

export type Permission = 'view_dashboard' | 'view_products' | 'manage_users' | 'admin_only';

export interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
} 