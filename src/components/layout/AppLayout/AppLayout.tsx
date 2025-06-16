import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { PageType } from '../../../types/navigation';
import { MainContent } from '../MainContent/MainContent';
import Dashboard from '../../../pages/Dashboard';
import { ProductCatalog } from '../../products/ProductCatalog/ProductCatalog';
import UserManagement from '../../../pages/UserManagement';

interface AppLayoutProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const layoutStyles = {
  container: {
    display: 'flex',
    height: '100vh'
  }
};

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPage, onPageChange }) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductCatalog />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard onPageChange={onPageChange} />;
    }
  };

  return (
    <div style={layoutStyles.container}>
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <MainContent>
        {renderPage()}
      </MainContent>
    </div>
  );
}; 