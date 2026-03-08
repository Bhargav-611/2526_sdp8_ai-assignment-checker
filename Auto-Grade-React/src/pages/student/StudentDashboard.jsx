import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user?.id) {
      loadSubmissions();
    }
  }, [user?.id]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axios.get(
        API_ENDPOINTS.STUDENT_ANSWER_GET_BY_STUDENT(user.id)
      );
      
      if (res.data?.success && res.data?.data) {
        setSubmissions(res.data.data);
      } else if (res.data?.data) {
        setSubmissions(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not load your results.",
      });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>👨‍🎓 Student Dashboard</h1>
          <p>Welcome, {user?.firstName} {user?.lastName}</p>
          <p className="user-detail">Roll No: {user?.rollNumber} | Semester: {user?.semester}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/student/upload-answer')}
          >
            📤 Upload Answer
          </button>
        </div>
      </div>

      <div className="question-card">
        <h2>My Evaluation Results</h2>
        <p className="subtitle">View your marks and feedback from teachers</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {loadingSubmissions ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your results...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <p>No evaluations yet. Your teacher will upload and evaluate your answers.</p>
          </div>
        ) : (
          <div className="submissions-grid">
            {submissions.map((submission, index) => (
              <div key={submission.id} className="submission-item">
                <div className="submission-header">
                  <span className="submission-number">Submission #{index + 1}</span>
                  {submission.answer_mark !== null && submission.answer_mark !== undefined ? (
                    <span className="submission-status evaluated">Evaluated</span>
                  ) : (
                    <span className="submission-status pending">Pending</span>
                  )}
                </div>

                <div className="submission-content">
                  <div className="question-meta">
                    <h3>Question</h3>
                    <p>{submission.facultyQuesAns?.question || 'Question not available'}</p>
                    <p style={{ marginTop: '8px' }}>
                      <strong>Maximum Marks:</strong> {submission.facultyQuesAns?.max_mark || 'N/A'}
                    </p>
                  </div>

                  {submission.photo?.url && (
                    <div className="image-preview">
                      <h3>Your Answer Sheet</h3>
                      <img src={submission.photo.url} alt="Your answer sheet" />
                    </div>
                  )}

                  {submission.answer && (
                    <div className="extracted-answer">
                      <h3>Extracted Answer</h3>
                      <p>{submission.answer}</p>
                    </div>
                  )}

                  {submission.answer_mark !== null && submission.answer_mark !== undefined ? (
                    <div className="marks-display">
                      <span className="marks-obtained">{submission.answer_mark}</span>
                      <span className="marks-separator">/</span>
                      <span className="marks-total">{submission.facultyQuesAns?.max_mark}</span>
                      <span className="marks-label">Marks</span>
                    </div>
                  ) : (
                    <div className="marks-display" style={{ background: 'rgba(246, 173, 85, 0.1)' }}>
                      <span style={{ color: 'var(--warning)', fontSize: '16px' }}>
                        Not yet evaluated by teacher
                      </span>
                    </div>
                  )}

                  {submission.evolution && (
                    <div className="feedback">
                      <h3>Teacher's Feedback</h3>
                      <p>{submission.evolution}</p>
                    </div>
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

export default StudentDashboard;
