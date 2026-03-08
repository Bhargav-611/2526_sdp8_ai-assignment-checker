import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const displayName =
    user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Student';

  useEffect(() => { if (user?.id) loadSubmissions(); }, [user?.id]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axios.get(API_ENDPOINTS.STUDENT_ANSWER_GET_BY_STUDENT(user.id));
      const raw = res.data;
      const list = raw?.data ?? raw ?? [];
      setSubmissions(Array.isArray(list) ? list : []);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not load your results.' });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Evaluated = AI has run (evolution set and valid), NOT whether marks > 0
  const evalCheck = (s) =>
    !!(s.evolution &&
      s.evolution !== 'AI service error' &&
      s.evolution !== 'AI evaluation unavailable' &&
      s.evolution.length > 5);

  const evaluated = submissions.filter(evalCheck).length;
  const pending = submissions.length - evaluated;
  const avgScore = evaluated > 0
    ? Math.round(submissions
      .filter(evalCheck)
      .reduce((sum, s) => sum + (s.answer_mark / (s.maxMarks || s.facultyQuesAns?.max_mark || 1)) * 100, 0) / evaluated)
    : 0;

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div className="page-header"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header-left">
          <h1><span className="page-title-emoji">🎓</span> Student Dashboard</h1>
          <p>
            Welcome back, <strong style={{ color: 'var(--text-accent)' }}>{displayName}</strong>
            {user?.rollNumber && <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 13 }}>
              · Roll: {user.rollNumber}
            </span>}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '📊', label: 'Total Submitted', value: submissions.length, color: 'stat-icon-purple' },
          { icon: '✅', label: 'Evaluated', value: evaluated, color: 'stat-icon-green' },
          { icon: '⏳', label: 'Pending', value: pending, color: 'stat-icon-yellow' },
          { icon: '🎯', label: 'Avg Score', value: `${avgScore}%`, color: 'stat-icon-cyan' },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-card"
            custom={i} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ y: -4 }}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Results Panel */}
      <motion.div className="question-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2>My Evaluation Results</h2>
        <p className="subtitle">Full AI evaluation output including OCR extraction and scoring details</p>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        {loadingSubmissions ? (
          <div className="loading-container" style={{ minHeight: 200 }}>
            <div className="loading-spinner" />
            <p>Loading your results...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <h3>No Results Yet</h3>
            <p>Your teacher will upload and evaluate your answer sheets.</p>
          </div>

        ) : (
          <div className="submissions-grid">
            {submissions.map((s, index) => {
              // Support both new flat fields and legacy nested fields
              const questionText = s.questionText || s.facultyQuesAns?.question || 'N/A';
              const maxMarks = s.maxMarks ?? s.facultyQuesAns?.max_mark ?? 'N/A';
              const isEv = evalCheck(s);
              const pct = isEv && maxMarks !== 'N/A'
                ? Math.round((s.answer_mark / maxMarks) * 100) : null;

              return (
                <motion.div key={s.id} className="submission-item"
                  custom={index} variants={cardVariants} initial="hidden" animate="visible"
                  whileHover={{ y: -2 }}>
                  <div className="submission-header">
                    <span className="submission-number">Result #{index + 1}</span>
                    <span className={`submission-status ${isEv ? 'evaluated' : 'pending'}`}>
                      {isEv ? '✓ Evaluated' : '⏳ Pending'}
                    </span>
                  </div>

                  <div className="submission-content">
                    {/* Question */}
                    <div className="question-meta">
                      <h3>Question</h3>
                      <p>{questionText}</p>
                      <p style={{ marginTop: 6 }}>
                        <strong>Maximum Marks:</strong> {maxMarks}
                      </p>
                    </div>

                    {/* Answer Sheet Image */}
                    {s.photo?.url && (
                      <div className="image-preview">
                        <h3>Your Answer Sheet</h3>
                        <img src={s.photo.url} alt="Your answer sheet" />
                      </div>
                    )}

                    {/* OCR Extracted Answer */}
                    {s.answer && (
                      <div className="extracted-answer">
                        <h3>📝 Extracted Answer (OCR)</h3>
                        <p>{s.answer}</p>
                      </div>
                    )}

                    {/* Marks */}
                    {isEv ? (
                      <div className="marks-display">
                        <span className="marks-obtained">{parseFloat(s.answer_mark).toFixed(1)}</span>
                        <span className="marks-separator">/</span>
                        <span className="marks-total">{maxMarks}</span>
                        {pct !== null && <span className="marks-label">&nbsp; {pct}%</span>}
                      </div>
                    ) : (
                      <div className="marks-display pending-eval">
                        <span style={{ color: 'var(--accent-yellow)', fontSize: 14, fontWeight: 600 }}>
                          ⏳ Awaiting evaluation
                        </span>
                      </div>
                    )}

                    {/* AI Accuracy */}
                    {s.accuracy_cmp > 0 && (
                      <div className="accuracy">
                        🎯 AI Accuracy: <strong>{parseFloat(s.accuracy_cmp).toFixed(1)}%</strong>
                      </div>
                    )}

                    {/* AI Evaluation Details */}
                    {s.evolution && s.evolution !== 'AI service error' && (
                      <div className="feedback">
                        <h3>💡 AI Evaluation Details</h3>
                        <p>{s.evolution}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
