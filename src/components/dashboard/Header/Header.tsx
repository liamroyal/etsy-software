import React from 'react';
import styled from 'styled-components';
import { Button } from '../../common';
import { User } from '../../../types';

interface HeaderProps {
  title: string;
  user?: User;
  onLogout?: () => void;
}

const HeaderContainer = styled.header`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 1.25rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const UserInfo = styled.div`
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const UserEmail = styled.span`
  color: #666;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.2rem;
`;

const Header: React.FC<HeaderProps> = ({ title, user, onLogout }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <UserSection>
        {user && (
          <UserInfo>
            {user.email && <UserEmail>{user.email}</UserEmail>}
          </UserInfo>
        )}
        {onLogout && (
          <Button variant="danger" size="sm" onClick={onLogout}>
            Sign Out
          </Button>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header; 