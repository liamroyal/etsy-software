import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { LoginForm } from './components/auth/LoginForm/LoginForm';
import DashboardPage from './pages/Dashboard';
import { Products } from './pages/Products';
import UserManagement from './pages/UserManagement';
import { TrackingUploader } from './components/features/TrackingUploader';
import { TrackingDatabase } from './components/features/TrackingDatabase/TrackingDatabase';
import { Notes } from './components/features/Notes/Notes';
import styles from './styles/components/App.module.css';
import { PageType } from './types/navigation';
// Import the utilities
import './utils/clearOrders';
import './utils/debugOrders';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <LoginForm />;
  }

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    // Map page types to their corresponding routes
    const routeMap: Record<PageType, string> = {
      'dashboard': '/dashboard',
      'products': '/products',
      'users': '/users',
      'tracking': '/tracking',
      'tracking-database': '/tracking-database',
      'notes': '/notes'
    };
    navigate(routeMap[page]);
  };

  return (
    <AppLayout currentPage={currentPage} onPageChange={handlePageChange}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage onPageChange={handlePageChange} />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/tracking" element={<TrackingUploader />} />
        <Route path="/tracking-database" element={<TrackingDatabase />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className={styles.app}>
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
