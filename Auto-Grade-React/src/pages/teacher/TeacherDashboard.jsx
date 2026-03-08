import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  }),
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const [formData, setFormData] = useState({ question: '', marks: '', modelAnswer: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState('add');

  useEffect(() => {
    if (activeTab === 'view' && user?.id) loadQuestions();
  }, [activeTab, user?.id]);

  const loadQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await axios.get(API_ENDPOINTS.FACULTY_QUESTION_GET_BY_FACULTY_ID(user.id));
      if (res.data?.success && res.data?.data) setQuestions(res.data.data);
      else if (res.data?.data) setQuestions(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not load questions.' });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.question.trim()) errs.question = 'Question is required';
    if (!formData.marks) errs.marks = 'Marks are required';
    else if (isNaN(formData.marks) || parseFloat(formData.marks) <= 0) errs.marks = 'Must be positive';
    if (!formData.modelAnswer.trim()) errs.modelAnswer = 'Model answer is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validateForm()) return;
    if (!user?.id) { setMessage({ type: 'error', text: 'User ID missing. Please login again.' }); return; }
    setIsSubmitting(true);
    try {
      await axios.post(API_ENDPOINTS.FACULTY_QUESTION_CREATE, {
        faculty_id: user.id,
        question: formData.question.trim(),
        answer: formData.modelAnswer.trim(),
        max_mark: parseInt(formData.marks, 10),
      });
      setMessage({ type: 'success', text: '✓ Question added successfully!' });
      setFormData({ question: '', marks: '', modelAnswer: '' });
      if (activeTab === 'view') loadQuestions();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.response?.data?.error || 'Failed to add question.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const NAV_CARDS = [
    {
      icon: '📋', title: 'View Submissions', desc: 'Review and evaluate student answer sheets.',
      path: '/teacher/submissions', color: 'stat-icon-cyan',
    },
    {
      icon: '📤', title: 'Upload & Evaluate', desc: 'Upload student answers and trigger AI evaluation.',
      path: '/teacher/upload-evaluate', color: 'stat-icon-pink',
    },
  ];

  return (
    <div className="dashboard">
      {/* Page Header */}
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header-left">
          <h1><span className="page-title-emoji">⚡</span> Teacher Dashboard</h1>
          <p>Welcome back, <strong style={{ color: 'var(--text-accent)' }}>{displayName || 'Teacher'}</strong></p>
        </div>
      </motion.div>

      {/* Quick Nav Cards */}
      <div className="dashboard-nav-grid">
        {NAV_CARDS.map((card, i) => (
          <motion.div
            key={card.path}
            className="dashboard-nav-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.path)}
          >
            <div className={`nav-card-icon ${card.color}`}>{card.icon}</div>
            <div className="nav-card-title">{card.title}</div>
            <div className="nav-card-desc">{card.desc}</div>
            <div className="nav-card-arrow">→</div>
          </motion.div>
        ))}
      </div>

      {/* Question Management */}
      <motion.div className="question-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>

        <div className="tabs">
          {['add', 'view'].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'add' ? '✏️ Add Question' : '📚 View Questions'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div className={`message ${message.type}`}
              key={message.text}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0 }}>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'add' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.35 }}>
            <h2>Add New Question</h2>
            <p className="subtitle">Create questions with model answers for AI-powered evaluation</p>

            <form onSubmit={handleSubmit} className="question-form">
              <div className="form-group">
                <label htmlFor="question">Question *</label>
                <textarea id="question" name="question" value={formData.question} onChange={handleChange}
                  placeholder="Enter the question here..." rows="4" className={errors.question ? 'error' : ''} />
                {errors.question && <span className="error-message">{errors.question}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="marks">Total Marks *</label>
                <input type="number" id="marks" name="marks" value={formData.marks} onChange={handleChange}
                  placeholder="Enter max marks" min="1" step="1" className={errors.marks ? 'error' : ''} />
                {errors.marks && <span className="error-message">{errors.marks}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="modelAnswer">Model Answer *</label>
                <textarea id="modelAnswer" name="modelAnswer" value={formData.modelAnswer} onChange={handleChange}
                  placeholder="Enter the model answer for AI comparison..." rows="6" className={errors.modelAnswer ? 'error' : ''} />
                {errors.modelAnswer && <span className="error-message">{errors.modelAnswer}</span>}
              </div>
              <motion.button type="submit" className="btn-primary" disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}>
                {isSubmitting ? '⏳ Adding...' : '✚ Add Question'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {activeTab === 'view' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}>
            <h2>Your Questions</h2>
            <p className="subtitle">All questions you've created for evaluation</p>

            {loadingQuestions ? (
              <div className="loading-container" style={{ minHeight: 200 }}>
                <div className="loading-spinner" />
                <p>Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">📝</span>
                <h3>No questions yet</h3>
                <p>Start by adding a question in the "Add Question" tab.</p>
              </div>
            ) : (
              <div className="questions-grid">
                {questions.map((question, index) => (
                  <motion.div key={question.id} className="question-item"
                    custom={index} variants={cardVariants} initial="hidden" animate="visible"
                    whileHover={{ y: -3 }}>
                    <div className="question-number">
                      <span>Q #{index + 1}</span>
                      <span style={{ background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: 10 }}>
                        {question.max_mark} marks
                      </span>
                    </div>
                    <h3>{question.question}</h3>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
