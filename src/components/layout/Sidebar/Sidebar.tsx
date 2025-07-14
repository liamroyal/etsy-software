import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { Button } from '../../common/Button/Button';
import { PermissionGate } from '../../common/AccessControl/PermissionGate';
import { PageType } from '../../../types/navigation';
import { theme } from '../../../styles/theme';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const Container = styled.aside`
  width: 280px;
  background-color: ${theme.colors.background.primary};
  border-right: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 320px;
  }
`;

const Header = styled.div`
  padding: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const Nav = styled.nav`
  flex: 1;
  padding: ${theme.spacing.md} 0;
  overflow-y: auto;
`;

const NavButton = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  background: ${props => props.isActive ? theme.colors.primary[50] : 'transparent'};
  color: ${props => props.isActive ? theme.colors.primary[700] : theme.colors.text.secondary};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid ${props => props.isActive ? theme.colors.primary[600] : 'transparent'};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${props => props.isActive ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal};

  @media (max-width: 768px) {
    padding: ${theme.spacing.xl} ${theme.spacing.xl};
    font-size: ${theme.typography.fontSize.lg};
  }

  &:hover {
    background-color: ${props => props.isActive ? theme.colors.primary[50] : theme.colors.neutral[50]};
    color: ${props => props.isActive ? theme.colors.primary[700] : theme.colors.text.primary};
  }
`;

const Footer = styled.div`
  padding: ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.neutral[200]};
`;

const UserInfo = styled.div`
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  background-color: ${theme.colors.neutral[50]};
  border-radius: ${theme.borderRadius.md};
`;

const UserEmail = styled.span`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { currentUser, logout } = useAuth();
  const { isAdmin } = usePermissions();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦', permission: 'view_products' as const },
    { id: 'tracking', label: 'Tracking Upload', icon: '📤' },
    { id: 'tracking-database', label: 'Tracking Database', icon: '🗄️' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'users', label: 'User Management', icon: '👥', adminOnly: true }
  ];

  return (
    <Container>
      <Header>
        <Title>Etsy Manager</Title>
      </Header>

      <Nav>
        {navigationItems.map(item => (
          <PermissionGate
            key={item.id}
            permission={item.permission}
            adminOnly={item.adminOnly}
          >
            <NavButton
              isActive={currentPage === item.id}
              onClick={() => onPageChange(item.id as PageType)}
            >
              <span role="img" aria-label={item.label}>{item.icon}</span>
              {item.label}
            </NavButton>
          </PermissionGate>
        ))}
      </Nav>

      <Footer>
        <UserInfo>
          <UserEmail>{currentUser?.email}</UserEmail>
        </UserInfo>
        <Button
          variant="danger"
          size="lg"
          onClick={logout}
          fullWidth
        >
          Sign Out
        </Button>
      </Footer>
    </Container>
  );
}; 