import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (user?.role === 'ROLE_TEACHER') navigate('/teacher/dashboard', { replace: true });
    else if (user?.role === 'ROLE_STUDENT') navigate('/student/dashboard', { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await login(formData.email, formData.password);
      setMessage({ type: 'success', text: '✓ Login successful! Redirecting...' });
      setTimeout(() => {
        if (response.user.role === 'ROLE_TEACHER') navigate('/teacher/dashboard');
        else if (response.user.role === 'ROLE_STUDENT') navigate('/student/dashboard');
      }, 600);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Login failed.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div className="auth-bg" />
      <div className="auth-particles">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
      </div>

      <div className="auth-container">
        {/* Brand */}
        <motion.div
          className="auth-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="auth-brand-logo">🎓</span>
          <h1>AutoGrade AI</h1>
          <p>AI-Powered Answer Sheet Evaluator</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="auth-card login-card"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-header">
            <span className="header-icon">🔐</span>
            <h2>Welcome back</h2>
            <p>Sign in to your Teacher or Student account</p>
          </div>

          {/* Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                className={`message ${message.type}`}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
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
                autoComplete="current-password"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <motion.button
              type="submit"
              className="btn-auth-submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <><span className="btn-spinner" /> Signing in...</>
              ) : (
                '→ Sign In'
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link-button">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
