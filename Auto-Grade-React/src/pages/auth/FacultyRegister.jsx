import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const FacultyRegister = () => {
  const navigate = useNavigate();
  const { registerFaculty } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    designation: '',
    qualification: '',
    experienceYears: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Qualification is required';
    }

    if (!formData.experienceYears) {
      newErrors.experienceYears = 'Experience years is required';
    } else if (isNaN(formData.experienceYears) || parseInt(formData.experienceYears) < 0) {
      newErrors.experienceYears = 'Experience years must be a positive number';
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
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        qualification: formData.qualification.trim(),
        experienceYears: parseInt(formData.experienceYears),
      };

      await registerFaculty(registerData);
      
      setMessage({
        type: 'success',
        text: 'Registration successful! Redirecting to dashboard...',
      });

      setTimeout(() => {
        navigate('/teacher/dashboard');
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card register-form">
      <div className="login-header">
        <h2 className="login-title">Faculty Registration</h2>
        <p className="login-subtitle">
          Create your faculty account to manage questions and evaluate student answers.
        </p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter password (min 6 chars)"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'error' : ''}
              placeholder="e.g., Computer Science"
              disabled={isSubmitting}
            />
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation *</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={errors.designation ? 'error' : ''}
              placeholder="e.g., Professor, Assistant Professor"
              disabled={isSubmitting}
            />
            {errors.designation && <span className="error-text">{errors.designation}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="qualification">Qualification *</label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={errors.qualification ? 'error' : ''}
              placeholder="e.g., Ph.D., M.Tech"
              disabled={isSubmitting}
            />
            {errors.qualification && <span className="error-text">{errors.qualification}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="experienceYears">Experience (Years) *</label>
            <input
              type="number"
              id="experienceYears"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className={errors.experienceYears ? 'error' : ''}
              placeholder="Enter years of experience"
              min="0"
              disabled={isSubmitting}
            />
            {errors.experienceYears && <span className="error-text">{errors.experienceYears}</span>}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary login-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register as Faculty'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="link-button">
            Login here
          </Link>
        </p>
        <p>
          <Link to="/register" className="link-button">
            Back to registration options
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FacultyRegister;
