import React from 'react';
import styled, { css } from 'styled-components';

interface LayoutProps {
  children: React.ReactNode;
  type?: 'default' | 'centered' | 'fullHeight';
  backgroundColor?: string;
  maxWidth?: string;
  padding?: string;
  className?: string;
}

const StyledLayout = styled.div<LayoutProps>`
  ${props => {
    switch (props.type) {
      case 'centered':
        return css`
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
        `;
      case 'fullHeight':
        return css`
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        `;
      default:
        return css`
          width: 100%;
        `;
    }
  }}
  
  background-color: ${props => props.backgroundColor || '#f8f9fa'};
  padding: ${props => props.padding || '0'};
`;

const Container = styled.div<{ maxWidth?: string }>`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Layout: React.FC<LayoutProps> = ({
  children,
  type = 'default',
  backgroundColor = '#f8f9fa',
  maxWidth = '1200px',
  padding,
  className,
  ...props
}) => {
  if (type === 'centered') {
    return (
      <StyledLayout
        type={type}
        backgroundColor={backgroundColor}
        padding={padding}
        className={className}
        {...props}
      >
        {children}
      </StyledLayout>
    );
  }

  return (
    <StyledLayout
      type={type}
      backgroundColor={backgroundColor}
      padding={padding}
      className={className}
      {...props}
    >
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </StyledLayout>
  );
};

export default Layout; 