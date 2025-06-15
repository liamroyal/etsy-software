import { ReactNode } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasFeature,
  type Permission,
  type Feature 
} from '../../../utils/permissions';

interface PermissionGateProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  feature?: Feature;
  fallback?: ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  feature,
  fallback,
  adminOnly = false,
  userOnly = false
}) => {
  const { currentUser } = useAuth();

  // No user means no access
  if (!currentUser) {
    return fallback ? <>{fallback}</> : null;
  }

  // Check admin/user only access
  if (adminOnly && currentUser?.role !== 'admin') {
    return fallback ? <>{fallback}</> : null;
  }

  if (userOnly && currentUser?.role !== 'user') {
    return fallback ? <>{fallback}</> : null;
  }

  // Check single permission
  if (permission && !hasPermission(currentUser, permission)) {
    return fallback ? <>{fallback}</> : null;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(currentUser, permissions)
      : hasAnyPermission(currentUser, permissions);

    if (!hasAccess) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  // Check feature access
  if (feature && !hasFeature(currentUser, feature)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <PermissionGate adminOnly fallback={fallback}>
    {children}
  </PermissionGate>
);

export const UserOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <PermissionGate userOnly fallback={fallback}>
    {children}
  </PermissionGate>
);

export const FeatureGate: React.FC<{ 
  feature: Feature; 
  children: ReactNode; 
  fallback?: ReactNode 
}> = ({ feature, children, fallback = null }) => (
  <PermissionGate feature={feature} fallback={fallback}>
    {children}
  </PermissionGate>
); 