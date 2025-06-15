import { useAuth } from '../context/AuthContext';
import { 
  hasPermission, 
  hasFeature,
  isAdmin,
  isUser,
  canViewProducts,
  canEditProducts,
  canManageUsers,
  type Permission,
  type Feature
} from '../utils/permissions';

export const usePermissions = () => {
  const { currentUser } = useAuth();

  return {
    isAdmin: isAdmin(currentUser),
    isUser: isUser(currentUser),
    canViewProducts: canViewProducts(currentUser),
    canEditProducts: canEditProducts(currentUser),
    canManageUsers: canManageUsers(currentUser),
    hasPermission: (permission: Permission) => hasPermission(currentUser, permission),
    hasFeature: (feature: Feature) => hasFeature(currentUser, feature)
  };
}; 