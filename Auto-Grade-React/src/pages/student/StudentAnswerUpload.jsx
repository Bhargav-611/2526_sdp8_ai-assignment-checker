import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const StudentAnswerUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const displayName =
    user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Student';

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.FACULTY_QUESTION_GET_ALL);
      const all = res.data?.data || [];
      setQuestions(Array.isArray(all) ? all : []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not load questions. Please try again.' });
    }
  };

  const processFile = useCallback((selected) => {
    setFile(selected || null);
    setEvaluation(null);
    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = () => setIsDragActive(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setEvaluation(null);
    if (!selectedQuestionId) { setMessage({ type: 'error', text: 'Please select a question.' }); return; }
    if (!file) { setMessage({ type: 'error', text: 'Please upload an answer sheet image.' }); return; }
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('student_id', user.id.toString());
      formData.append('question_id', selectedQuestionId.toString());

      const uploadRes = await axios.post(API_ENDPOINTS.STUDENT_ANSWER_UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadData = uploadRes.data?.data || uploadRes.data;
      if (!uploadData?.id) {
        setMessage({ type: 'error', text: uploadRes.data?.message || 'Upload failed. Please try again.' });
        setIsUploading(false);
        return;
      }

      const studentQuesAnsId = uploadData.id;

      // Trigger AI evaluation
      try {
        const evalRes = await axios.post(API_ENDPOINTS.STUDENT_ANSWER_EVALUATE(studentQuesAnsId));
        // The evaluate endpoint returns the saved StudentQuesAns entity
        const evalData = evalRes.data?.data || evalRes.data;
        setEvaluation({
          marks: evalData.answer_mark,
          maxMarks: evalData.maxMarks ?? evalData.facultyMarks,
          evaluationText: evalData.evolution,
          studentAnswer: evalData.answer,
          accuracyCmp: evalData.accuracy_cmp,
          questionText: evalData.questionText || evalData.question,
        });
      } catch (evalErr) {
        // AI evaluation service may be unavailable
        console.warn('AI evaluation error:', evalErr);
        setMessage({ type: 'info', text: '✓ Uploaded! AI evaluation is pending — check your dashboard later.' });
      }

      if (!evaluation) {
        setMessage({ type: 'success', text: '✓ Answer uploaded and evaluated successfully!' });
      }

      setFile(null);
      setPreviewUrl(null);
      setSelectedQuestionId('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.response?.data?.error || 'Upload failed. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="dashboard">
      <motion.div className="page-header"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header-left">
          <h1><span className="page-title-emoji">📤</span> Upload Answer</h1>
          <p>Student: <strong style={{ color: 'var(--text-accent)' }}>{displayName}</strong></p>
        </div>
        <motion.button className="btn-secondary" onClick={() => navigate('/student/dashboard')}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          ← Back to Dashboard
        </motion.button>
      </motion.div>

      <motion.div className="question-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <h2>Submit Your Answer</h2>
        <p className="subtitle">Select a question and upload your handwritten answer sheet for AI evaluation</p>

        <AnimatePresence>
          {message.text && (
            <motion.div className={`message ${message.type}`}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0 }}>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="question-form">
          {/* Question Select */}
          <div className="form-group">
            <label htmlFor="questionSelect">Select Question *</label>
            <select id="questionSelect" value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}>
              <option value="">-- Choose a question --</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.question} ({q.max_mark} marks)</option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="form-group">
            <label>Answer Sheet Image *</label>
            <div
              className={`upload-zone${isDragActive ? ' drag-active' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input type="file" id="answerImage" accept="image/*" onChange={handleFileChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', fontSize: 0 }} />
              {file ? (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 36 }}>✓</span>
                  <h3 style={{ color: 'var(--accent-green)' }}>Image Ready!</h3>
                  <p style={{ fontSize: 13, marginTop: 4 }}>{file.name}</p>
                  <p style={{ fontSize: 12, marginTop: 8, color: 'var(--text-muted)' }}>Click or drop to change</p>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span className="upload-icon">📸</span>
                  <h3>Drop your answer sheet here</h3>
                  <p>or click to browse — JPG, PNG, JPEG · Max 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          <AnimatePresence>
            {previewUrl && (
              <motion.div className="image-preview"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                <h3>Preview</h3>
                <img src={previewUrl} alt="Answer preview" />
              </motion.div>
            )}
          </AnimatePresence>

          {isUploading && (
            <div className="upload-progress">
              <div className="upload-progress-bar" />
            </div>
          )}

          <motion.button type="submit" className="btn-primary" disabled={isUploading}
            whileHover={{ scale: isUploading ? 1 : 1.02 }}
            whileTap={{ scale: isUploading ? 1 : 0.97 }}>
            {isUploading ? '⏳ Uploading & Evaluating...' : '🚀 Upload & Evaluate'}
          </motion.button>
        </form>

        {/* Evaluation Result Card */}
        <AnimatePresence>
          {evaluation && (
            <motion.div className="evaluation-card"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <h3>✓ AI Evaluation Complete</h3>

              {/* OCR Extracted Answer */}
              {evaluation.studentAnswer && (
                <div className="extracted-answer" style={{ marginBottom: 14 }}>
                  <h3>📝 Extracted Answer (OCR)</h3>
                  <p>{evaluation.studentAnswer}</p>
                </div>
              )}

              {/* Marks */}
              <div className="marks-display">
                <span className="marks-obtained">
                  {evaluation.marks != null ? parseFloat(evaluation.marks).toFixed(1) : '—'}
                </span>
                <span className="marks-separator">/</span>
                <span className="marks-total">
                  {evaluation.maxMarks != null ? evaluation.maxMarks : '?'}
                </span>
                <span className="marks-label">marks</span>
              </div>

              {/* AI Accuracy */}
              {evaluation.accuracyCmp != null && evaluation.accuracyCmp > 0 && (
                <div className="accuracy">
                  🎯 AI Accuracy Score: <strong>{parseFloat(evaluation.accuracyCmp).toFixed(1)}%</strong>
                </div>
              )}

              {/* Evaluation Details */}
              {evaluation.evaluationText && evaluation.evaluationText !== 'AI service error' && (
                <div className="feedback-section">
                  <h4>💡 Evaluation Breakdown</h4>
                  <p>{evaluation.evaluationText}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default StudentAnswerUpload;
