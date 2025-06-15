import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button/Button';
import { theme } from '../styles/theme';

const userManagementStyles = {
  container: {
    maxWidth: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing['2xl'],
    flexWrap: 'wrap' as const,
    gap: theme.spacing.lg
  },
  headerContent: {
    flex: 1,
    minWidth: '200px'
  },
  title: {
    margin: 0,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.tight
  },
  subtitle: {
    margin: `${theme.spacing.sm} 0 0 0`,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap' as const
  },
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: theme.spacing.xl
  },
  userCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,
    padding: theme.spacing.xl,
    transition: theme.transitions.normal
  },
  userCardHover: {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)'
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary[600]
  },
  userInfo: {
    flex: 1
  },
  userName: {
    margin: 0,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.tight
  },
  userEmail: {
    margin: `${theme.spacing.xs} 0 0 0`,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  },
  userDetails: {
    marginBottom: theme.spacing.lg
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.colors.neutral[100]}`
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans
  },
  roleBadge: (role: string) => ({
    fontSize: theme.typography.fontSize.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: role === 'admin' ? theme.colors.primary[100] : theme.colors.neutral[100],
    color: role === 'admin' ? theme.colors.primary[700] : theme.colors.neutral[700],
    borderRadius: theme.borderRadius.sm,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.sans,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  }),
  statusBadge: (status: string) => ({
    fontSize: theme.typography.fontSize.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: status === 'active' ? theme.colors.success[100] : theme.colors.warning[100],
    color: status === 'active' ? theme.colors.success[700] : theme.colors.warning[700],
    borderRadius: theme.borderRadius.sm,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.sans,
    textTransform: 'capitalize' as const
  }),
  userActions: {
    display: 'flex',
    gap: theme.spacing.sm,
    flexWrap: 'wrap' as const
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: theme.spacing['3xl'],
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`
  },
  emptyIcon: {
    fontSize: theme.typography.fontSize['4xl'],
    marginBottom: theme.spacing.lg
  },
  emptyTitle: {
    margin: 0,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans
  },
  emptyDescription: {
    margin: `${theme.spacing.sm} 0 ${theme.spacing.xl} 0`,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  }
};

const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

  // Mock user data (in real app, this would come from Firebase/API)
  const users = [
    {
      id: '1',
      email: 'liam@admin.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2024-01-01'
    },
    {
      id: '2',
      email: 'sarah@user.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2024-01-10'
    },
    {
      id: '3',
      email: 'mike@user.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-01-05',
      joinDate: '2024-01-08'
    }
  ];

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit user functionality
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
    // TODO: Implement delete user functionality
  };

  const handleAddUser = () => {
    console.log('Add new user');
    // TODO: Implement add user functionality
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div style={userManagementStyles.container}>
      {/* Header */}
      <div style={userManagementStyles.header}>
        <div style={userManagementStyles.headerContent}>
          <h1 style={userManagementStyles.title}>👥 User Management</h1>
          <p style={userManagementStyles.subtitle}>
            Manage user accounts and permissions
          </p>
        </div>
        
        <div style={userManagementStyles.headerActions}>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => console.log('Export users')}
          >
            Export Users
          </Button>
        </div>
      </div>

      {/* Users Grid */}
      {users.length > 0 ? (
        <div style={userManagementStyles.usersGrid}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                ...userManagementStyles.userCard,
                ...(hoveredCard === user.id ? userManagementStyles.userCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(user.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* User Header */}
              <div style={userManagementStyles.userHeader}>
                <div style={userManagementStyles.userAvatar}>
                  {getInitials(user.email)}
                </div>
                <div style={userManagementStyles.userInfo}>
                  <h3 style={userManagementStyles.userName}>
                    {user.email.split('@')[0]}
                  </h3>
                  <p style={userManagementStyles.userEmail}>{user.email}</p>
                </div>
              </div>

              {/* User Details */}
              <div style={userManagementStyles.userDetails}>
                <div style={userManagementStyles.detailRow}>
                  <span style={userManagementStyles.detailLabel}>Role</span>
                  <span style={userManagementStyles.roleBadge(user.role)}>
                    {user.role}
                  </span>
                </div>
                <div style={userManagementStyles.detailRow}>
                  <span style={userManagementStyles.detailLabel}>Status</span>
                  <span style={userManagementStyles.statusBadge(user.status)}>
                    {user.status}
                  </span>
                </div>
                <div style={userManagementStyles.detailRow}>
                  <span style={userManagementStyles.detailLabel}>Last Login</span>
                  <span style={userManagementStyles.detailValue}>{user.lastLogin}</span>
                </div>
                <div style={userManagementStyles.detailRow}>
                  <span style={userManagementStyles.detailLabel}>Joined</span>
                  <span style={userManagementStyles.detailValue}>{user.joinDate}</span>
                </div>
              </div>

              {/* User Actions */}
              <div style={userManagementStyles.userActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => console.log('View user:', user.id)}
                >
                  View Details
                </Button>
                
                {currentUser?.id !== user.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={userManagementStyles.emptyState}>
          <div style={userManagementStyles.emptyIcon}>👥</div>
          <h2 style={userManagementStyles.emptyTitle}>No Users Found</h2>
          <p style={userManagementStyles.emptyDescription}>
            Start by adding your first user to the system.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddUser}
          >
            Add First User
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 