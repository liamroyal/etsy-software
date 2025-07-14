import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  outlined?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonProps['variant'] = 'primary', outlined: boolean = false) => {
  const variants = {
    primary: css`
      background-color: ${outlined ? 'transparent' : theme.colors.primary[600]};
      color: ${outlined ? theme.colors.primary[600] : 'white'};
      border: 1px solid ${theme.colors.primary[600]};
      box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(2, 132, 199, 0.15)'};
      
      &:hover:not(:disabled) {
        background-color: ${outlined ? theme.colors.primary[50] : theme.colors.primary[700]};
        box-shadow: ${outlined ? 'none' : '0 4px 6px rgba(2, 132, 199, 0.2)'};
      }
      
      &:active:not(:disabled) {
        background-color: ${outlined ? theme.colors.primary[100] : theme.colors.primary[700]};
        box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(2, 132, 199, 0.1)'};
      }
    `,
    secondary: css`
      background-color: ${outlined ? 'transparent' : theme.colors.neutral[100]};
      color: ${outlined ? theme.colors.text.primary : theme.colors.text.primary};
      border: 1px solid ${theme.colors.neutral[200]};
      box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
      
      &:hover:not(:disabled) {
        background-color: ${outlined ? theme.colors.neutral[50] : theme.colors.neutral[200]};
        box-shadow: ${outlined ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.07)'};
      }
      
      &:active:not(:disabled) {
        background-color: ${outlined ? theme.colors.neutral[100] : theme.colors.neutral[300]};
        box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.03)'};
      }
    `,
    success: css`
      background-color: ${outlined ? 'transparent' : theme.colors.success[600]};
      color: ${outlined ? theme.colors.success[600] : 'white'};
      border: 1px solid ${theme.colors.success[600]};
      box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(22, 163, 74, 0.15)'};
      
      &:hover:not(:disabled) {
        background-color: ${outlined ? theme.colors.success[50] : theme.colors.success[700]};
        box-shadow: ${outlined ? 'none' : '0 4px 6px rgba(22, 163, 74, 0.2)'};
      }
      
      &:active:not(:disabled) {
        background-color: ${outlined ? theme.colors.success[100] : theme.colors.success[700]};
        box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(22, 163, 74, 0.1)'};
      }
    `,
    warning: css`
      background-color: ${outlined ? 'transparent' : theme.colors.warning[500]};
      color: ${outlined ? theme.colors.warning[700] : 'white'};
      border: 1px solid ${theme.colors.warning[500]};
      box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(245, 158, 11, 0.15)'};
      
      &:hover:not(:disabled) {
        background-color: ${outlined ? theme.colors.warning[50] : theme.colors.warning[600]};
        box-shadow: ${outlined ? 'none' : '0 4px 6px rgba(245, 158, 11, 0.2)'};
      }
      
      &:active:not(:disabled) {
        background-color: ${outlined ? theme.colors.warning[100] : theme.colors.warning[700]};
        box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(245, 158, 11, 0.1)'};
      }
    `,
    danger: css`
      background-color: ${outlined ? 'transparent' : theme.colors.error[600]};
      color: ${outlined ? theme.colors.error[600] : 'white'};
      border: 1px solid ${theme.colors.error[600]};
      box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(220, 38, 38, 0.15)'};
      
      &:hover:not(:disabled) {
        background-color: ${outlined ? theme.colors.error[50] : theme.colors.error[700]};
        box-shadow: ${outlined ? 'none' : '0 4px 6px rgba(220, 38, 38, 0.2)'};
      }
      
      &:active:not(:disabled) {
        background-color: ${outlined ? theme.colors.error[100] : theme.colors.error[700]};
        box-shadow: ${outlined ? 'none' : '0 2px 4px rgba(220, 38, 38, 0.1)'};
      }
    `
  };

  return variants[variant];
};

const getSizeStyles = (size: ButtonProps['size'] = 'md') => {
  const sizes = {
    sm: css`
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
      
      @media (max-width: 768px) {
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.typography.fontSize.xs};
      }
    `,
    md: css`
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.base};
      
      @media (max-width: 768px) {
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.sm};
      }
    `,
    lg: css`
      padding: ${theme.spacing.lg} ${theme.spacing.xl};
      font-size: ${theme.typography.fontSize.lg};
      
      @media (max-width: 768px) {
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.base};
      }
    `
  };

  return sizes[size];
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;
  
  ${props => getVariantStyles(props.variant, props.outlined)}
  ${props => getSizeStyles(props.size)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    transition: background 0.2s;
    pointer-events: none;
  }

  &:hover:not(:disabled)::before {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    min-height: 36px;
    font-weight: 500;
    letter-spacing: 0.01em;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: ${theme.spacing.sm};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  outlined = false,
  loading = false,
  icon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      outlined={outlined}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon}
      {children}
    </StyledButton>
  );
};