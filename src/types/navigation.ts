export type PageType = 
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'users'
  | 'settings';

export interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
} 