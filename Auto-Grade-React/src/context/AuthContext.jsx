import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage helper – use sessionStorage so closing the browser clears the session
const storage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: (key) => sessionStorage.removeItem(key),
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in in this browser session
    const token = storage.getItem('token');
    const userData = storage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        authService.getToken();
      } catch (error) {
        console.error('Failed to parse user data:', error);
        storage.removeItem('token');
        storage.removeItem('user');
      }
    }
    setLoading(false);

    const handleUnauthorized = () => {
      setUser(null);
    };
    
    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    // mirror authService into session storage
    storage.setItem('token', response.token);
    storage.setItem('user', JSON.stringify(response.user));
    return response;
  };

  const registerFaculty = async (data) => {
    const response = await authService.registerFaculty(data);
    setUser(response.user);
    storage.setItem('token', response.token);
    storage.setItem('user', JSON.stringify(response.user));
    return response;
  };

  const registerStudent = async (data) => {
    const response = await authService.registerStudent(data);
    setUser(response.user);
    storage.setItem('token', response.token);
    storage.setItem('user', JSON.stringify(response.user));
    return response;
  };

  const logout = () => {
    authService.logout();
    storage.removeItem('token');
    storage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!storage.getItem('token');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    registerFaculty,
    registerStudent,
    logout,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
