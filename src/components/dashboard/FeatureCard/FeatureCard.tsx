import React from 'react';
import styled from 'styled-components';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  status?: 'coming-soon' | 'active' | 'disabled';
  requiredRole?: 'admin' | 'user';
  userRole?: string;
  onClick?: () => void;
  className?: string;
}

const StyledFeatureCard = styled.div<{ 
  clickable?: boolean; 
  status?: string;
  hasAccess?: boolean;
}>`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease-in-out;
  border: 2px solid ${props => {
    if (!props.hasAccess) return '#ff5722';
    if (props.status === 'active') return '#4caf50';
    return '#ddd';
  }};
  
  ${props => props.clickable && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
  `}
  
  ${props => !props.hasAccess && `
    opacity: 0.6;
    background-color: #f5f5f5;
  `}
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Title = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 1rem;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #888;
`;

const StatusBadge = styled.span<{ status?: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-top: 0.5rem;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background-color: #4caf50;
          color: white;
        `;
      case 'disabled':
        return `
          background-color: #f44336;
          color: white;
        `;
      default:
        return `
          background-color: #ff9800;
          color: white;
        `;
    }
  }}
`;

const AccessDenied = styled.div`
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  status = 'coming-soon',
  requiredRole,
  userRole,
  onClick,
  className
}) => {
  const hasAccess = !requiredRole || userRole === requiredRole || userRole === 'admin';
  const isClickable = onClick && hasAccess && status === 'active';

  const handleClick = () => {
    if (isClickable) {
      onClick!();
    }
  };

  return (
    <StyledFeatureCard
      clickable={isClickable}
      status={status}
      hasAccess={hasAccess}
      onClick={handleClick}
      className={className}
    >
      {icon && <Icon>{icon}</Icon>}
      <Title>{title}</Title>
      <Description>{description}</Description>
      
      {status && (
        <StatusBadge status={status}>
          {status === 'coming-soon' ? 'Coming Soon' : status}
        </StatusBadge>
      )}
      
      {!hasAccess && (
        <AccessDenied>
          Requires {requiredRole} access
        </AccessDenied>
      )}
    </StyledFeatureCard>
  );
};

export default FeatureCard; 