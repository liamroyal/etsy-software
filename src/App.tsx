import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm/LoginForm';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { PageType } from './types/navigation';
import styles from './styles/components/App.module.css';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Loading...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm />;
  }

  return <AppLayout currentPage={currentPage} onPageChange={setCurrentPage} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
