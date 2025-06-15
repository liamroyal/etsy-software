import React from 'react';
import styled, { css } from 'styled-components';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

const StyledAlert = styled.div<AlertProps>`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  line-height: 1.4;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return css`
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        `;
      case 'warning':
        return css`
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
        `;
      case 'info':
        return css`
          background-color: #d1ecf1;
          border: 1px solid #bee5eb;
          color: #0c5460;
        `;
      default: // error
        return css`
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        `;
    }
  }}
`;

const AlertContent = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'error',
  onClose,
  className,
  ...props
}) => {
  return (
    <StyledAlert variant={variant} className={className} {...props}>
      <AlertContent>{children}</AlertContent>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close alert">
          ×
        </CloseButton>
      )}
    </StyledAlert>
  );
};

export default Alert; 