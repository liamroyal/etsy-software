import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { PageType } from '../../../types/navigation';
import { MainContent } from '../MainContent/MainContent';

interface AppLayoutProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  children: React.ReactNode;
}

const layoutStyles = {
  container: {
    display: 'flex',
    height: '100vh'
  }
};

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPage, onPageChange, children }) => {
  return (
    <div style={layoutStyles.container}>
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
}; 