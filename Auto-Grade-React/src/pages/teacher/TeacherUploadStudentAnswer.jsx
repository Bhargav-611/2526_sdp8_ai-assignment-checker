import React, { useState, useEffect, useCallback, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import '../../styles/Dashboard.css';

const TeacherUploadStudentAnswer = () => {
  const { user } = useAuth();
  const displayName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ question_id: '', student_id: '', image: null });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => { if (user?.id) { loadQuestions(); loadStudents(); } }, [user]);

  const loadQuestions = async () => {
    if (!user?.id) return;
    setLoadingQuestions(true);
    try {
      const response = await axios.get(API_ENDPOINTS.FACULTY_QUESTION_GET_BY_FACULTY_ID(user.id));
      if (response.data?.success && response.data?.data) setQuestions(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load questions' });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await axios.get(API_ENDPOINTS.STUDENT_GET_ALL);
      if (response.data?.success && response.data?.data) setStudents(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load students' });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors((p) => ({ ...p, image: 'Please select an image file' })); return; }
    if (file.size > 10 * 1024 * 1024) { setErrors((p) => ({ ...p, image: 'File size must be less than 10MB' })); return; }
    setFormData((p) => ({ ...p, image: file }));
    setErrors((p) => ({ ...p, image: '' }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = () => setIsDragActive(false);

  const validateForm = () => {
    const errs = {};
    if (!formData.question_id) errs.question_id = 'Please select a question';
    if (!formData.student_id) errs.student_id = 'Please select a student';
    if (!formData.image) errs.image = 'Please select an answer sheet image';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const uploadData = new FormData();
      uploadData.append('student_id', formData.student_id);
      uploadData.append('question_id', formData.question_id);
      uploadData.append('image', formData.image);

      const response = await axios.post(API_ENDPOINTS.STUDENT_ANSWER_CREATE, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: '✓ Answer uploaded successfully! You can now evaluate it from the Submissions page.' });
        setFormData({ question_id: '', student_id: '', image: null });
        setImagePreview(null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload answer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedQuestion = questions.find((q) => q.id === parseInt(formData.question_id));

  return (
    <div className="dashboard">
      <motion.div className="page-header"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header-left">
          <h1><span className="page-title-emoji">📤</span> Upload Student Answer</h1>
          <p>Upload answer sheets for AI-powered evaluation. Teacher: <strong style={{ color: 'var(--text-accent)' }}>{displayName || 'Teacher'}</strong></p>
        </div>
      </motion.div>

      <motion.div className="question-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <h2>Upload Student's Answer Sheet</h2>
        <p className="subtitle">Select question, student, then drag-and-drop or choose the answer sheet image</p>

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
            <label htmlFor="question_id">Select Question *</label>
            {loadingQuestions ? (
              <p className="helper-text">⏳ Loading questions...</p>
            ) : questions.length === 0 ? (
              <p className="helper-text">No questions available. Please create a question first.</p>
            ) : (
              <select id="question_id" name="question_id" value={formData.question_id}
                onChange={handleChange} className={errors.question_id ? 'error' : ''}>
                <option value="">-- Select a Question --</option>
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    Q{q.id}: {q.question.substring(0, 60)}... ({q.max_mark} marks)
                  </option>
                ))}
              </select>
            )}
            {errors.question_id && <span className="error-message">{errors.question_id}</span>}
          </div>

          {/* Selected Question Preview */}
          <AnimatePresence>
            {selectedQuestion && (
              <motion.div className="submission-meta"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}>
                <h3>Selected Question</h3>
                <p>{selectedQuestion.question}</p>
                <p><strong>Max Marks:</strong> {selectedQuestion.max_mark}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Student Select */}
          <div className="form-group">
            <label htmlFor="student_id">Select Student *</label>
            {loadingStudents ? (
              <p className="helper-text">⏳ Loading students...</p>
            ) : students.length === 0 ? (
              <p className="helper-text">No students registered yet.</p>
            ) : (
              <select id="student_id" name="student_id" value={formData.student_id}
                onChange={handleChange} className={errors.student_id ? 'error' : ''}>
                <option value="">-- Select a Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — Roll: {s.rollNumber} ({s.email})
                  </option>
                ))}
              </select>
            )}
            {errors.student_id && <span className="error-message">{errors.student_id}</span>}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="form-group">
            <label>Answer Sheet Image *</label>
            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              className={`upload-zone${isDragActive ? ' drag-active' : ''}`}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {imagePreview ? (
                <div>
                  <span style={{ fontSize: 32 }}>✓</span>
                  <h3 style={{ color: 'var(--accent-green)' }}>Image Selected!</h3>
                  <p>{formData.image?.name}</p>
                  <p style={{ marginTop: 8, fontSize: 12 }}>Click or drop to change</p>
                </div>
              ) : (
                <div>
                  <span className="upload-icon">📸</span>
                  <h3>Drop image here or click to browse</h3>
                  <p>Supports JPG, PNG, JPEG — Max 10MB</p>
                </div>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div className="image-preview"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                <h3>Preview</h3>
                <img src={imagePreview} alt="Answer sheet preview" />
              </motion.div>
            )}
          </AnimatePresence>

          {isSubmitting && (
            <div className="upload-progress">
              <div className="upload-progress-bar" />
            </div>
          )}

          <motion.button type="submit" className="btn-primary" disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}>
            {isSubmitting ? '⏳ Uploading...' : '📤 Upload Answer Sheet'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TeacherUploadStudentAnswer;
