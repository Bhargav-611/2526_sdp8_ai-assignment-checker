import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const TeacherSubmissions = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editingMarks, setEditingMarks] = useState(null);
  const [marksForm, setMarksForm] = useState({
    answer_mark: '',
    evolution: ''
  });

  useEffect(() => {
    loadSubmissions();
  }, [user]);

  const loadSubmissions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.STUDENT_ANSWER_GET_BY_FACULTY(user.id));
      
      if (response.data.success && response.data.data) {
        setSubmissions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load submissions. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMarks = (submission) => {
    setEditingMarks(submission.id);
    setMarksForm({
      answer_mark: submission.answer_mark || '',
      evolution: submission.evolution || ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setEditingMarks(null);
    setMarksForm({ answer_mark: '', evolution: '' });
  };

  const handleUpdateMarks = async (submissionId) => {
    if (!marksForm.answer_mark) {
      setMessage({ type: 'error', text: 'Please enter marks' });
      return;
    }

    try {
      const response = await axios.put(
        API_ENDPOINTS.STUDENT_ANSWER_UPDATE_MARKS(submissionId),
        {
          answer_mark: parseInt(marksForm.answer_mark),
          evolution: marksForm.evolution
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Marks updated successfully!' });
        setEditingMarks(null);
        loadSubmissions(); // Reload to show updated data
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update marks'
      });
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const getStatusBadge = (submission) => {
    if (submission.answer_mark !== null && submission.answer_mark !== undefined) {
      return <span className="submission-status evaluated">Evaluated</span>;
    }
    return <span className="submission-status pending">Pending</span>;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Student Submissions</h1>
          <p>Faculty: {user?.name}</p>
          <span className="user-detail">{user?.email}</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => onNavigate('teacher-dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="submissions-list">
        {submissions.length === 0 ? (
          <div className="empty-state">
            <p>No submissions yet. Students haven't submitted any answers.</p>
          </div>
        ) : (
          <div className="submissions-grid">
            {submissions.map((submission, index) => (
              <div key={submission.id} className="submission-item">
                <div className="submission-header">
                  <span className="submission-number">Submission #{index + 1}</span>
                  {getStatusBadge(submission)}
                </div>

                <div className="submission-content">
                  <div className="submission-meta">
                    <h3>Student Information</h3>
                    <p><strong>Student ID:</strong> {submission.student?.id || 'N/A'}</p>
                    <p><strong>Student Name:</strong> {submission.student?.name || 'N/A'}</p>
                    <p><strong>Roll Number:</strong> {submission.student?.rollNumber || 'N/A'}</p>
                  </div>

                  <div className="submission-meta">
                    <h3>Question</h3>
                    <p>{submission.facultyQuesAns?.question || 'Question not available'}</p>
                    <p><strong>Max Marks:</strong> {submission.facultyQuesAns?.max_mark || 'N/A'}</p>
                  </div>

                  {submission.photo?.url && (
                    <div className="image-preview">
                      <h3>Answer Sheet</h3>
                      <img src={submission.photo.url} alt="Answer sheet" />
                    </div>
                  )}

                  {submission.answer && (
                    <div className="extracted-answer">
                      <h3>Extracted Answer</h3>
                      <p>{submission.answer}</p>
                    </div>
                  )}

                  {editingMarks === submission.id ? (
                    <div className="marks-edit-form">
                      <h3>Edit Marks</h3>
                      <div className="form-group">
                        <label>Marks Obtained</label>
                        <input
                          type="number"
                          value={marksForm.answer_mark}
                          onChange={(e) => setMarksForm({ ...marksForm, answer_mark: e.target.value })}
                          placeholder="Enter marks"
                          max={submission.facultyQuesAns?.max_mark}
                        />
                      </div>
                      <div className="form-group">
                        <label>Feedback/Evaluation</label>
                        <textarea
                          value={marksForm.evolution}
                          onChange={(e) => setMarksForm({ ...marksForm, evolution: e.target.value })}
                          placeholder="Enter your feedback..."
                          rows="4"
                        />
                      </div>
                      <div className="submission-actions">
                        <button className="btn-primary" onClick={() => handleUpdateMarks(submission.id)}>
                          Save Marks
                        </button>
                        <button className="btn-secondary" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(submission.answer_mark !== null && submission.answer_mark !== undefined) ? (
                        <div className="marks-display">
                          <span className="marks-obtained">{submission.answer_mark}</span>
                          <span className="marks-separator">/</span>
                          <span className="marks-total">{submission.facultyQuesAns?.max_mark}</span>
                          <span className="marks-label">Marks</span>
                        </div>
                      ) : (
                        <div className="marks-display" style={{ background: 'rgba(246, 173, 85, 0.1)' }}>
                          <span style={{ color: 'var(--warning)', fontSize: '16px' }}>Not yet evaluated</span>
                        </div>
                      )}

                      {submission.evolution && (
                        <div className="feedback">
                          <h3>Faculty Feedback</h3>
                          <p>{submission.evolution}</p>
                        </div>
                      )}

                      <div className="submission-actions">
                        <button className="btn-primary" onClick={() => handleEditMarks(submission)}>
                          {submission.answer_mark ? 'Edit Marks' : 'Evaluate Now'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSubmissions;
