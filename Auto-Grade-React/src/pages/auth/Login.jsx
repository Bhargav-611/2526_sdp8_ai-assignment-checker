import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // If already logged in in this session, redirect straight to dashboard
  useEffect(() => {
    if (user?.role === 'ROLE_TEACHER') {
      navigate('/teacher/dashboard', { replace: true });
    } else if (user?.role === 'ROLE_STUDENT') {
      navigate('/student/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(formData.email, formData.password);

      setMessage({
        type: 'success',
        text: 'Login successful! Redirecting...',
      });

      setTimeout(() => {
        if (response.user.role === 'ROLE_TEACHER') {
          navigate('/teacher/dashboard');
        } else if (response.user.role === 'ROLE_STUDENT') {
          navigate('/student/dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          error.message ||
          'Login failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card login-form">
      <div className="login-header">
        <h2 className="login-title">Login to Auto‑Grade Portal</h2>
        <p className="login-subtitle">
          Access your {` `}
          <span className="login-role-highlight">Teacher</span>
          {` `} or
          {` `}
          <span className="login-role-highlight">Student</span>
          {` `} dashboard using your registered email.
        </p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="you@example.com"
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary login-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="link-button">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
