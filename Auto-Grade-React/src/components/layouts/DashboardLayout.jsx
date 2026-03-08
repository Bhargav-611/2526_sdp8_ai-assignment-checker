import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Layout.css';

export const DashboardLayout = ({ children, userType = 'teacher' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teacherMenuItems = [
    { label: 'Dashboard', path: '/teacher/dashboard' },
    { label: 'View Submissions', path: '/teacher/submissions' },
    { label: 'Upload & Evaluate', path: '/teacher/upload-evaluate' },
  ];

  const studentMenuItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Upload Answer', path: '/student/upload-answer' },
  ];

  const menuItems = userType === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="dashboard-layout">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🎓 Auto-Grade Portal</h1>
        </div>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                className="nav-link"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="navbar-user">
          <span className="user-info">
            {user?.firstName} {user?.lastName}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
