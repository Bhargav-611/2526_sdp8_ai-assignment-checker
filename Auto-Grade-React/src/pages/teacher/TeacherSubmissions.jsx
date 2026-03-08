import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const TeacherSubmissions = () => {
  const { user } = useAuth();
  const displayName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  // A submission is "evaluated" when the AI has run (evolution text is set)
  // answer_mark can legitimately be 0 when accuracy < 30%
  const isEvaluated = (s) =>
    !!(s.evolution &&
      s.evolution !== 'AI service error' &&
      s.evolution !== 'AI evaluation unavailable' &&
      s.evolution.length > 5);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [evaluating, setEvaluating] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [marksForm, setMarksForm] = useState({ answer_mark: '', evolution: '' });

  // Sort / filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | evaluated | pending
  const [sortBy, setSortBy] = useState('newest');          // newest | oldest | marks_asc | marks_desc | name

  useEffect(() => { loadSubmissions(); }, [user]);

  const loadSubmissions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.STUDENT_ANSWER_GET_BY_FACULTY(user.id));
      const list = res.data?.data ?? res.data ?? [];
      setSubmissions(Array.isArray(list) ? list : []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load submissions.' });
    } finally {
      setLoading(false);
    }
  };

  // ── derived filtered + sorted list ───────────────────────────
  const filtered = useMemo(() => {
    let list = [...submissions];

    // Status filter
    if (filterStatus === 'evaluated') list = list.filter(s => isEvaluated(s));
    if (filterStatus === 'pending') list = list.filter(s => !isEvaluated(s));

    // Search by student name or roll
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        (s.studentName || '').toLowerCase().includes(q) ||
        (s.studentRollNumber || '').toLowerCase().includes(q) ||
        (s.questionText || '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    if (sortBy === 'oldest') list.sort((a, b) => a.id - b.id);
    if (sortBy === 'marks_desc') list.sort((a, b) => (b.answer_mark || 0) - (a.answer_mark || 0));
    if (sortBy === 'marks_asc') list.sort((a, b) => (a.answer_mark || 0) - (b.answer_mark || 0));
    if (sortBy === 'name') list.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));

    return list;
  }, [submissions, filterStatus, search, sortBy]);

  const evaluated = submissions.filter(s => isEvaluated(s)).length;
  const pending = submissions.length - evaluated;

  // ── actions ──────────────────────────────────────────────────
  const handleAiEvaluate = async (id) => {
    setEvaluating(id);
    setMessage({ type: '', text: '' });
    try {
      await axios.post(API_ENDPOINTS.STUDENT_ANSWER_EVALUATE(id));
      setMessage({ type: 'success', text: '✓ AI evaluation complete!' });
      loadSubmissions();
    } catch {
      setMessage({ type: 'error', text: 'AI evaluation failed. Check the processing service.' });
    } finally {
      setEvaluating(null);
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setMarksForm({ answer_mark: s.answer_mark || '', evolution: s.evolution || '' });
  };

  const saveMarks = async (id, maxMarks) => {
    if (marksForm.answer_mark === '' || isNaN(marksForm.answer_mark)) {
      setMessage({ type: 'error', text: 'Enter valid marks.' }); return;
    }
    const val = parseFloat(marksForm.answer_mark);
    if (maxMarks && val > maxMarks) {
      setMessage({ type: 'error', text: `Marks cannot exceed max (${maxMarks}).` }); return;
    }
    try {
      await axios.put(API_ENDPOINTS.STUDENT_ANSWER_UPDATE_MARKS(id), {
        answer_mark: val,
        evolution: marksForm.evolution,
      });
      setMessage({ type: 'success', text: '✓ Marks saved!' });
      setEditingId(null);
      loadSubmissions();
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to update marks.' });
    }
  };

  // ── card body helper ──────────────────────────────────────────
  const SubmissionDetail = ({ s }) => {
    const maxMarks = s.maxMarks ?? s.facultyQuesAns?.max_mark ?? null;
    const isEditing = editingId === s.id;

    return (
      <motion.div
        className="submission-detail-panel"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>

        {/* Question */}
        <div className="submission-meta">
          <h3>📋 Question</h3>
          <p>{s.questionText || s.facultyQuesAns?.question || 'N/A'}</p>
          <p style={{ marginTop: 6 }}>
            <strong>Max Marks:</strong> {maxMarks ?? 'N/A'}
          </p>
        </div>

        {/* Answer Sheet Photo */}
        {s.photo?.url && (
          <div className="image-preview">
            <h3>📷 Answer Sheet Photo</h3>
            <img src={s.photo.url} alt="Student answer sheet" />
          </div>
        )}

        {/* Cleaned / Corrected Answer Text */}
        {(s.answerClean || s.answer) && (
          <div className="extracted-answer">
            <h3>✍️ Processed Answer Text</h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginBottom: 6 }}>
              Grammar-corrected OCR output used for AI scoring
            </span>
            <p>{s.answerClean || s.answer}</p>
          </div>
        )}

        {/* Raw OCR (collapsible hint) */}
        {s.answerClean && s.answer && s.answerClean !== s.answer && (
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
              📄 Show raw OCR text
            </summary>
            <p style={{ fontSize: 13, marginTop: 8, padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
              {s.answer}
            </p>
          </details>
        )}

        {/* AI Accuracy */}
        {s.accuracy_cmp > 0 && (
          <div className="accuracy">
            🎯 AI Accuracy Score: <strong>{parseFloat(s.accuracy_cmp).toFixed(1)}%</strong>
          </div>
        )}

        {/* Evaluation Breakdown */}
        {s.evolution && s.evolution !== 'AI service error' && (
          <div className="feedback">
            <h3>💡 AI Evaluation Breakdown</h3>
            <p>{s.evolution}</p>
          </div>
        )}

        {/* Marks Display or Edit */}
        {isEditing ? (
          <div className="marks-edit-form">
            <h3>✏️ Override Marks</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              AI gave {isEvaluated(s) ? `${parseFloat(s.answer_mark).toFixed(1)} marks` : 'no marks yet'}.
              {isEvaluated(s) ? ' Override below if needed.' : ' Set marks manually.'}
            </p>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>Marks (max: {maxMarks ?? '?'})</label>
              <input type="number" value={marksForm.answer_mark} min="0" max={maxMarks}
                onChange={e => setMarksForm(p => ({ ...p, answer_mark: e.target.value }))}
                placeholder="Enter marks" />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>Additional Feedback</label>
              <textarea value={marksForm.evolution} rows="3"
                onChange={e => setMarksForm(p => ({ ...p, evolution: e.target.value }))}
                placeholder="Optional teacher comment..." />
            </div>
            <div className="submission-actions">
              <button className="btn-primary" onClick={() => saveMarks(s.id, maxMarks)}>💾 Save</button>
              <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {isEvaluated(s) ? (
              <div className="marks-display">
                <span className="marks-obtained">{parseFloat(s.answer_mark).toFixed(1)}</span>
                <span className="marks-separator">/</span>
                <span className="marks-total">{maxMarks ?? '?'}</span>
                <span className="marks-label">marks</span>
                {maxMarks && <span className="marks-label" style={{ marginLeft: 8 }}>
                  ({Math.round((s.answer_mark / maxMarks) * 100)}%)
                </span>}
              </div>
            ) : (
              <div className="marks-display pending-eval">
                <span style={{ color: 'var(--accent-yellow)', fontSize: 14 }}>Not yet evaluated</span>
              </div>
            )}

            <div className="submission-actions" style={{ marginTop: 14 }}>
              <motion.button className="btn-primary"
                onClick={() => handleAiEvaluate(s.id)}
                disabled={evaluating === s.id}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {evaluating === s.id ? '⏳ Evaluating...' : isEvaluated(s) ? '🔄 Re-evaluate' : '🤖 AI Evaluate'}
              </motion.button>
              <motion.button className="btn-secondary"
                onClick={() => startEdit(s)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {s.answer_mark > 0 ? '✏️ Override Marks' : '✏️ Set Manually'}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>Loading submissions...</p>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div className="page-header"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header-left">
          <h1><span className="page-title-emoji">📋</span> Student Submissions</h1>
          <p>Faculty: <strong style={{ color: 'var(--text-accent)' }}>{displayName}</strong></p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { icon: '📊', label: 'Total', value: submissions.length, color: 'stat-icon-purple' },
          { icon: '✅', label: 'Evaluated', value: evaluated, color: 'stat-icon-green' },
          { icon: '⏳', label: 'Pending', value: pending, color: 'stat-icon-yellow' },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div className={`message ${message.type}`}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0 }}>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort / Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="filter-search"
          placeholder="🔍 Search by name, roll, or question..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="evaluated">✅ Evaluated</option>
          <option value="pending">⏳ Pending</option>
        </select>
        <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="marks_desc">Marks ↓</option>
          <option value="marks_asc">Marks ↑</option>
          <option value="name">Student Name A–Z</option>
        </select>
      </div>

      {/* Submission Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">{submissions.length === 0 ? '📭' : '🔍'}</span>
          <h3>{submissions.length === 0 ? 'No Submissions Yet' : 'No Results Found'}</h3>
          <p>{submissions.length === 0
            ? 'Upload student answers from the "Upload & Evaluate" page.'
            : 'Try adjusting your search or filter.'}</p>
        </div>
      ) : (
        <div className="submission-cards-list">
          {filtered.map((s, idx) => {
            const isExpanded = expandedId === s.id;
            const studentName = s.studentName || s.student?.name || 'Unknown';
            const roll = s.studentRollNumber || s.student?.rollNumber || '—';
            const questionShort = (s.questionText || s.facultyQuesAns?.question || 'N/A').substring(0, 60);
            const maxMarks = s.maxMarks ?? s.facultyQuesAns?.max_mark ?? null;
            const evaluated_s = isEvaluated(s);
            const pct = evaluated_s && maxMarks ? Math.round((s.answer_mark / maxMarks) * 100) : null;

            return (
              <motion.div
                key={s.id}
                className={`submission-card${isExpanded ? ' expanded' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.35 }}>

                {/* Card Summary Row — click to expand */}
                <div className="submission-card-summary" onClick={() => setExpandedId(isExpanded ? null : s.id)}>
                  <div className="submission-card-left">
                    <div className="student-avatar">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="submission-card-info">
                      <span className="student-name">{studentName}</span>
                      <span className="student-meta">Roll: {roll}</span>
                      <span className="question-short">Q: {questionShort}{questionShort.length >= 60 ? '…' : ''}</span>
                    </div>
                  </div>

                  <div className="submission-card-right">
                    {evaluated_s ? (
                      <div className="marks-badge">
                        <span className="marks-badge-val">{parseFloat(s.answer_mark).toFixed(1)}</span>
                        <span className="marks-badge-sep">/</span>
                        <span className="marks-badge-max">{maxMarks ?? '?'}</span>
                        {pct !== null && <span className="marks-badge-pct">{pct}%</span>}
                      </div>
                    ) : null}
                    <span className={`submission-status ${evaluated_s ? 'evaluated' : 'pending'}`}>
                      {evaluated_s ? '✓ Done' : '⏳ Pending'}
                    </span>
                    <span className="expand-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                <AnimatePresence>
                  {isExpanded && <SubmissionDetail s={s} key="detail" />}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissions;
