import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PermissionGate } from '../components/common/AccessControl/PermissionGate';
import { Button } from '../components/common/Button/Button';
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['2xl']
  },
  statCard: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,
    transition: theme.transitions.normal
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.lg
  },
  actionCard: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm
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
  }
};

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { currentUser } = useAuth();
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

  const stats = [
    { id: 'products', icon: '📦', value: '24', label: 'Total Products' },
    { id: 'orders', icon: '🛒', value: '156', label: 'Orders This Month' },
    { id: 'revenue', icon: '💰', value: '$3,240', label: 'Monthly Revenue' },
    { id: 'customers', icon: '👥', value: '89', label: 'Active Customers' }
  ];

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

      {/* Stats Grid */}
      <div style={dashboardStyles.statsGrid}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            style={{
              ...dashboardStyles.statCard,
              ...(hoveredCard === stat.id ? dashboardStyles.statCardHover : {})
            }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={dashboardStyles.statIcon}>{stat.icon}</div>
            <h3 style={dashboardStyles.statValue}>{stat.value}</h3>
            <p style={dashboardStyles.statLabel}>{stat.label}</p>
          </div>
        ))}
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