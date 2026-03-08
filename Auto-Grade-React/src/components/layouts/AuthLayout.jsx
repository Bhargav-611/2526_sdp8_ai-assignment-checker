import React from 'react';
import '../../styles/Auth.css';

export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>🎓 Auto-Grade Portal</h1>
      </div>
      <div className="auth-box">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
