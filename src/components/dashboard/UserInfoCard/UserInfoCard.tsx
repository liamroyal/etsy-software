import React from 'react';
import styled from 'styled-components';
import { Card } from '../../common';
import { User } from '../../../types';

interface UserInfoCardProps {
  user: User;
  className?: string;
}

const InfoSection = styled.div`
  background-color: #e3f2fd;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1976d2;
  font-size: 1.1rem;
  font-weight: 600;
`;

const InfoRow = styled.p`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`;

const Label = styled.strong`
  color: #333;
  margin-right: 0.5rem;
`;

const RoleBadge = styled.span<{ role?: string }>`
  background-color: ${props => 
    props.role === 'admin' ? '#4caf50' : '#2196f3'
  };
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 0.5rem;
`;

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user, className }) => {
  return (
    <Card className={className}>
      <InfoSection>
        <SectionTitle>User Information</SectionTitle>
        
        {user.email && (
          <InfoRow>
            <Label>Email:</Label>
            {user.email}
          </InfoRow>
        )}
        

        
        {user.role && (
          <InfoRow>
            <Label>Role:</Label>
            <RoleBadge role={user.role}>
              {user.role}
            </RoleBadge>
          </InfoRow>
        )}
      </InfoSection>
    </Card>
  );
};

export default UserInfoCard; 