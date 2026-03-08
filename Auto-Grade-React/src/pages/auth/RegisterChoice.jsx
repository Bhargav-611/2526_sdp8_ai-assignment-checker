import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/Auth.css';

const CHOICES = [
  {
    icon: '👩‍🏫',
    title: 'Teacher',
    description: 'Create questions, upload student answers, evaluate with AI.',
    badge: 'Faculty',
    path: '/register/teacher',
  },
  {
    icon: '👨‍🎓',
    title: 'Student',
    description: 'Upload your answer sheets and view AI-powered results.',
    badge: 'Student',
    path: '/register/student',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const RegisterChoice = () => {
  const navigate = useNavigate();

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
        {/* Brand */}
        <motion.div
          className="auth-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="auth-brand-logo">🎓</span>
          <h1>AutoGrade AI</h1>
          <p>Choose your account type to get started</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="auth-card"
          style={{ maxWidth: 600 }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-header">
            <span className="header-icon">✨</span>
            <h2>Create Account</h2>
            <p>Select your role to register</p>
          </div>

          <div className="choice-container">
            {CHOICES.map((choice, i) => (
              <motion.div
                key={choice.path}
                className="choice-card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(choice.path)}
              >
                <span className="choice-icon">{choice.icon}</span>
                <h2>{choice.title}</h2>
                <p>{choice.description}</p>
                <span className="choice-badge">{choice.badge}</span>
              </motion.div>
            ))}
          </div>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="link-button">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterChoice;
