import React from 'react';

// AuthLayout is now a transparent passthrough.
// Each auth page (Login, FacultyRegister, StudentRegister, RegisterChoice)
// renders its own full-page background, particles, and glassmorphism card directly.
export const AuthLayout = ({ children }) => {
  return <>{children}</>;
};

export default AuthLayout;
