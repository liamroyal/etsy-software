import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };



  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      {/* Simple Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>Etsy Dropshipping Manager</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2>🎉 SUCCESS! Authentication Working!</h2>
        
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>✅ User Information:</h3>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>ID:</strong> {currentUser.id}</p>
          <p><strong>Role:</strong> <span style={{
            backgroundColor: currentUser.role === 'admin' ? '#28a745' : '#007bff',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>{currentUser.role.toUpperCase()}</span></p>

        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <h3>🚀 What's Working:</h3>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>✅ Firebase Authentication</li>
            <li>✅ Firestore User Data</li>
            <li>✅ Role-based Access Control</li>
            <li>✅ Protected Routes</li>
            <li>✅ Login/Logout Functionality</li>
          </ul>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Feature Status:</h4>
            <p>📦 Products: Coming Soon</p>
            <p>📋 Orders: Coming Soon</p>
            <p>📊 Analytics: Coming Soon</p>
            {currentUser.role === 'admin' && (
              <p>⚙️ Admin Panel: Coming Soon (Admin Only)</p>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6c757d' }}>
            🎯 <strong>Next Step:</strong> Add styled-components back gradually once core functionality is stable
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
