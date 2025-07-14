import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PermissionGate } from '../components/common/AccessControl/PermissionGate';
import { Button } from '../components/common/Button/Button';
import { EmailOrdersList, OrdersStats } from '../components/features/EmailOrders';
import { FulfilledOrdersList } from '../components/features/EmailOrders/FulfilledOrdersList';
import { PageType } from '../types/navigation';
import { theme } from '../styles/theme';

interface DashboardProps {
  onPageChange: (page: PageType) => void;
}

const dashboardStyles = {
  container: {
    maxWidth: '100%'
  },
  header: {
    marginBottom: theme.spacing['2xl']
  },
  title: {
    margin: 0,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.tight
  },
  subtitle: {
    margin: `${theme.spacing.sm} 0 0 0`,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],

    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing.lg
    },

    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: theme.spacing.md
    }
  },
  statCard: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,
    transition: theme.transitions.normal,

    '@media (max-width: 768px)': {
      padding: theme.spacing.lg
    }
  },
  statCardHover: {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)'
  },
  statIcon: {
    fontSize: theme.typography.fontSize['2xl'],
    marginBottom: theme.spacing.md
  },
  statValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: 0,
    fontFamily: theme.typography.fontFamily.sans
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: `${theme.spacing.xs} 0 0 0`,
    fontFamily: theme.typography.fontFamily.sans
  },
  actionsSection: {
    marginBottom: theme.spacing['2xl']
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: `0 0 ${theme.spacing.lg} 0`,
    fontFamily: theme.typography.fontFamily.sans
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.lg,

    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: theme.spacing.md
    }
  },
  actionCard: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,

    '@media (max-width: 768px)': {
      padding: theme.spacing.lg
    }
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: `0 0 ${theme.spacing.sm} 0`,
    fontFamily: theme.typography.fontFamily.sans
  },
  actionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: `0 0 ${theme.spacing.lg} 0`,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.relaxed
  },
  emailOrdersContainer: {
    marginBottom: theme.spacing.xl
  },
  dateSection: {
    marginBottom: theme.spacing.lg
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.medium
  }
};

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { currentUser } = useAuth();

  // Format current date like in the image
  const getCurrentDateString = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return now.toLocaleDateString('en-AU', options);
  };

  const quickActions = [
    {
      id: 'products',
      title: 'Manage Products',
      description: 'Add, edit, or remove products from your catalog',
      action: () => onPageChange('products'),
      permission: 'view_products' as const,
      buttonText: 'View Products',
      buttonVariant: 'primary' as const
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      action: () => onPageChange('users'),
      permission: 'manage_users' as const,
      buttonText: 'Manage Users',
      buttonVariant: 'secondary' as const
    }
  ];

  return (
    <div style={dashboardStyles.container}>
      {/* Header */}
      <div style={dashboardStyles.header}>
        <h1 style={dashboardStyles.title}>
          Welcome back, {currentUser?.email?.split('@')[0]}! 👋
        </h1>
        <p style={dashboardStyles.subtitle}>
          Here's what's happening with your dropshipping business today.
        </p>
      </div>

      {/* Date Display */}
      <div style={dashboardStyles.dateSection}>
        <span style={dashboardStyles.dateText}>📅 {getCurrentDateString()}</span>
      </div>

      {/* Revenue Statistics - Admin Only */}
      <PermissionGate 
        adminOnly={true}
        fallback={
          <div style={{
            ...dashboardStyles.actionsSection,
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            border: '2px dashed #dee2e6',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            margin: '2rem 0',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              margin: '0 0 0.5rem 0',
              color: '#495057'
            }}>
              Financial Dashboard - Admin Access Required
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              margin: 0,
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.5'
            }}>
              Revenue and profit analytics are restricted to administrators. 
              Contact your admin to request access to financial data.
            </p>
          </div>
        }
      >
        <OrdersStats />
      </PermissionGate>

      {/* Email Orders Section */}
      <div style={dashboardStyles.actionsSection}>
        <h2 style={dashboardStyles.sectionTitle}>📧 Recent Email Orders</h2>
        <div style={dashboardStyles.emailOrdersContainer}>
          <EmailOrdersList />
        </div>
      </div>

      {/* Fulfilled Orders Section */}
      <div style={dashboardStyles.actionsSection}>
        <h2 style={dashboardStyles.sectionTitle}>📦 Fulfilled Orders</h2>
        <FulfilledOrdersList />
      </div>

      {/* Quick Actions */}
      <div style={dashboardStyles.actionsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Quick Actions</h2>
        <div style={dashboardStyles.actionsGrid}>
          {quickActions.map((action) => (
            <PermissionGate key={action.id} permission={action.permission}>
              <div style={dashboardStyles.actionCard}>
                <h3 style={dashboardStyles.actionTitle}>{action.title}</h3>
                <p style={dashboardStyles.actionDescription}>{action.description}</p>
                <Button
                  variant={action.buttonVariant}
                  size="md"
                  onClick={action.action}
                >
                  {action.buttonText}
                </Button>
              </div>
            </PermissionGate>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 