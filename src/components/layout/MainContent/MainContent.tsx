import React from 'react';
import { theme } from '../../../styles/theme';

interface MainContentProps {
  children: React.ReactNode;
}

const mainContentStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    minHeight: '100vh',
    overflow: 'auto'
  },
  content: {
    padding: theme.spacing['2xl'],
    maxWidth: '1200px',
    margin: '0 auto'
  }
};

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div style={mainContentStyles.container}>
      <div style={mainContentStyles.content}>
        {children}
      </div>
    </div>
  );
}; 