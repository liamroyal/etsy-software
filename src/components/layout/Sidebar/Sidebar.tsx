import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PermissionGate } from '../../common/AccessControl/PermissionGate';
import { usePermissions } from '../../../hooks/usePermissions';
import { Button } from '../../common/Button/Button';
import styles from '../../../styles/components/Sidebar.module.css';
import { PageType } from '../../../types/navigation';

interface NavigationItem {
  id: PageType;
  label: string;
  icon: string;
  permission: 'view_dashboard' | 'view_products' | 'manage_users';
}

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { currentUser, logout } = useAuth();
  const permissions = usePermissions();

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
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>🏪 Etsy Dropship</h3>
        <p className={styles.subtitle}>Manager</p>
      </div>

      {/* User Info */}
      <div className={styles.userInfo}>
        <p className={styles.userEmail}>{currentUser?.email}</p>
        <span className={currentUser?.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeUser}>
          {currentUser?.role}
        </span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navigationItems.map((item) => (
          <PermissionGate key={item.id} permission={item.permission}>
            <SidebarTab
              item={item}
              isActive={currentPage === item.id}
              onClick={() => onPageChange(item.id)}
            />
          </PermissionGate>
        ))}
      </nav>

      {/* Logout */}
      <div className={styles.footer}>
        <Button 
          variant="ghost" 
          size="md" 
          fullWidth 
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    </div>
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