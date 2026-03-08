import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'ROLE_TEACHER') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (user.role === 'ROLE_STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  // All checks passed
  return children;
};

export default ProtectedRoute;
