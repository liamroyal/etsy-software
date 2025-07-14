import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

interface MainContentProps {
  children: React.ReactNode;
}

const Container = styled.div`
  flex: 1;
  background-color: ${theme.colors.background.secondary};
  min-height: 100vh;
  overflow: auto;
  padding: ${theme.spacing['2xl']};

  @media (max-width: 1024px) {
    padding: ${theme.spacing.xl};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Container>
      <Content>
        {children}
      </Content>
    </Container>
  );
}; 