import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigate = (page, data = {}) => {
    const routes = {
      'home': '/',
      'login': '/login',
      'register-choice': '/register',
      'faculty-register': '/register/teacher',
      'student-register': '/register/student',
      'teacher-dashboard': '/teacher/dashboard',
      'teacher-submissions': '/teacher/submissions',
      'teacher-upload-answer': '/teacher/upload-evaluate',
      'student-dashboard': '/student/dashboard',
      'student-upload': '/student/upload-answer',
      'answer-upload': '/student/upload-answer',
    };

    const path = routes[page] || '/login';
    navigate(path, { state: data });
  };

  return (
    <NavigationContext.Provider value={{ handleNavigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export default NavigationProvider;
