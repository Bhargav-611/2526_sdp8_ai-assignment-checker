import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Layout.css';

const TEACHER_MENU = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: '⚡' },
  { label: 'Submissions', path: '/teacher/submissions', icon: '📋' },
  { label: 'Upload & Evaluate', path: '/teacher/upload-evaluate', icon: '📤' },
  { label: 'Profile', path: '/teacher/profile', icon: '👤' },
];

const STUDENT_MENU = [
  { label: 'Dashboard', path: '/student/dashboard', icon: '🎓' },
  { label: 'Profile', path: '/student/profile', icon: '👤' },
];

export const DashboardLayout = ({ children, userType = 'teacher' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // useContext is always called — null-guard provides safe fallback if
  // ThemeProvider is somehow missing (rules-of-hooks compliant)
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx?.theme ?? 'dark';
  const toggleTheme = themeCtx?.toggleTheme ?? (() => { });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = userType === 'teacher' ? TEACHER_MENU : STUDENT_MENU;

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    'User';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    user?.role === 'ROLE_TEACHER' ? 'Teacher' :
      user?.role === 'ROLE_STUDENT' ? 'Student' : 'User';

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        {/* Brand */}
        <NavLink to={menuItems[0].path} className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <span className="navbar-title">AutoGrade AI</span>
        </NavLink>

        {/* Nav links */}
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side: theme toggle + user chip + logout */}
        <div className="navbar-user">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{displayName}</span>
            <span className="user-role-badge">{roleLabel}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout} title="Logout">
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
