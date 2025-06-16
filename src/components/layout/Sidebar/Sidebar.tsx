import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { Button } from '../../common/Button/Button';
import { PermissionGate } from '../../common/AccessControl/PermissionGate';
import styles from './Sidebar.module.css';
import { PageType } from '../../../types/navigation';

interface NavigationItem {
  id: PageType;
  label: string;
  icon: string;
  permission?: 'view_dashboard' | 'view_products' | 'manage_users';
  adminOnly?: boolean;
}

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { currentUser, logout } = useAuth();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      permission: 'view_dashboard'
    },
    {
      id: 'products',
      label: 'Product Catalog',
      icon: '🛍️',
      permission: 'view_products'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: '👥',
      permission: 'manage_users'
    },
    {
      id: 'tracking',
      label: 'Tracking Upload',
      icon: '📦',
      adminOnly: true
    },
    {
      id: 'tracking-database',
      label: 'Tracking Database',
      icon: '🔍'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h1 className={styles.title}>Royal Commerce</h1>
        <p className={styles.subtitle}>Etsy Management Platform</p>
      </div>
      
      <nav className={styles.nav}>
        {navigationItems.map((item) => (
          <PermissionGate 
            key={item.id} 
            permission={item.permission}
            adminOnly={item.adminOnly}
          >
            <SidebarTab
              item={item}
              isActive={currentPage === item.id}
              onClick={() => onPageChange(item.id)}
            />
          </PermissionGate>
        ))}
      </nav>

      {currentUser && (
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser.email}</span>
          </div>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
};

// Separate component for sidebar tabs
interface SidebarTabProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}

const SidebarTab: React.FC<SidebarTabProps> = ({ item, isActive, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getTabClassName = () => {
    if (isActive) return styles.tabActive;
    if (isHovered) return styles.tabHovered;
    return styles.tab;
  };

  return (
    <button
      onClick={onClick}
      className={getTabClassName()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={styles.tabIcon}>{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
}; 