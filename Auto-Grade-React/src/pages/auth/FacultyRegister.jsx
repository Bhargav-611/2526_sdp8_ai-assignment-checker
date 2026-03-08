import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Field = ({ id, label, type = 'text', placeholder, min, formData, handleChange, errors, isSubmitting }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={formData[id]}
      onChange={handleChange}
      className={errors[id] ? 'error' : ''}
      placeholder={placeholder}
      disabled={isSubmitting}
      min={min}
    />
    {errors[id] && <span className="error-text">{errors[id]}</span>}
  </div>
);

const FacultyRegister = () => {

  const navigate = useNavigate();
  const { registerFaculty } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', designation: '', qualification: '', experienceYears: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.department.trim()) errs.department = 'Department is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.qualification.trim()) errs.qualification = 'Qualification is required';
    if (!formData.experienceYears) errs.experienceYears = 'Experience is required';
    else if (isNaN(formData.experienceYears) || parseInt(formData.experienceYears) < 0)
      errs.experienceYears = 'Must be a positive number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await registerFaculty({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        qualification: formData.qualification.trim(),
        experienceYears: parseInt(formData.experienceYears),
      });
      setMessage({ type: 'success', text: '✓ Registration successful! Redirecting...' });
      setTimeout(() => navigate('/teacher/dashboard'), 600);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Registration failed.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-particles">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
      </div>

      <div className="auth-container">
        <motion.div
          className="auth-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="auth-brand-logo">🎓</span>
          <h1>AutoGrade AI</h1>
          <p>Create your faculty account</p>
        </motion.div>

        <motion.div
          className="auth-card"
          style={{ maxWidth: 680 }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-header">
            <span className="header-icon">👩‍🏫</span>
            <h2>Faculty Registration</h2>
            <p>Create your account to manage questions and evaluate students</p>
            <div className="role-tag">🏫 Teacher Account</div>
          </div>

          <AnimatePresence>
            {message.text && (
              <motion.div
                className={`message ${message.type}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0 }}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-row">
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="name" label="Full Name *" placeholder="Enter your full name" />
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="email" label="Email Address *" type="email" placeholder="you@example.com" />
            </div>
            <div className="form-row">
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="password" label="Password *" type="password" placeholder="Min 6 characters" />
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="confirmPassword" label="Confirm Password *" type="password" placeholder="Repeat password" />
            </div>
            <div className="form-row">
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="department" label="Department *" placeholder="e.g., Computer Science" />
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="designation" label="Designation *" placeholder="e.g., Professor" />
            </div>
            <div className="form-row">
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="qualification" label="Qualification *" placeholder="e.g., Ph.D., M.Tech" />
              <Field formData={formData} handleChange={handleChange} errors={errors} isSubmitting={isSubmitting} id="experienceYears" label="Experience (Years) *" type="number" placeholder="Years of experience" min="0" />
            </div>


            <motion.button
              type="submit"
              className="btn-auth-submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? <><span className="btn-spinner" /> Registering...</> : '→ Register as Faculty'}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="link-button">Sign in</Link></p>
            <p style={{ marginTop: 6 }}>
              <Link to="/register" className="link-button">← Back to registration options</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyRegister;
