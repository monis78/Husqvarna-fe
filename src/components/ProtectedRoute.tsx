import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../component/Header/Header';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component - wraps authenticated routes
 * Checks if user is authenticated, if not redirects to login
 * Wraps the content with Header for authenticated pages
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default ProtectedRoute;
