import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";

const TeacherDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    question: "",
    marks: "",
    modelAnswer: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState("add"); // 'add' or 'view'

  // Load questions for this faculty
  useEffect(() => {
    if (activeTab === "view" && user?.id) {
      loadQuestions();
    }
  }, [activeTab, user?.id]);

  const loadQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await axios.get(
        API_ENDPOINTS.FACULTY_QUESTION_GET_BY_FACULTY_ID(user.id)
      );
      
      if (res.data?.success && res.data?.data) {
        setQuestions(res.data.data);
      } else if (res.data?.data) {
        // Handle if backend returns data directly
        setQuestions(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not load questions.",
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.marks) {
      newErrors.marks = "Marks are required";
    } else if (isNaN(formData.marks) || parseFloat(formData.marks) <= 0) {
      newErrors.marks = "Marks must be a positive number";
    }

    if (!formData.modelAnswer.trim()) {
      newErrors.modelAnswer = "Model answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setMessage({
        type: "error",
        text: "User ID is missing. Please login again.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend API endpoint: POST /facultyquesans
      // Request body format: { faculty_id: Long, question: String, answer: String, max_mark: int }
      const payload = {
        faculty_id: user.id,
        question: formData.question.trim(),
        answer: formData.modelAnswer.trim(), // Backend expects "answer" field
        max_mark: parseInt(formData.marks, 10), // Backend expects "max_mark" field
      };

      const response = await axios.post(
        API_ENDPOINTS.FACULTY_QUESTION_CREATE,
        payload
      );

      // Backend returns FacultyQuesAns object on success
      if (response.data) {
        setMessage({
          type: "success",
          text: "Question added successfully!",
        });

        // Reset form after successful submission
        setFormData({
          question: "",
          marks: "",
          modelAnswer: "",
        });

        // Reload questions if on view tab
        if (activeTab === "view") {
          loadQuestions();
        }
      }
    } catch (error) {
      console.error("Error adding question:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add question. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Teacher Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => onNavigate('answer-upload')}
          >
            Upload & Evaluate Answer
          </button>
          <button
            className="btn-primary"
            onClick={() => onNavigate('teacher-submissions')}
          >
            View Submissions
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Question
        </button>
        <button
          className={`tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View Questions
        </button>
      </div>

      {activeTab === "add" && (
        <div className="question-card">
          <h2>Add New Question</h2>
          <p className="subtitle">Create questions for evaluation</p>

          <form onSubmit={handleSubmit} className="question-form">
            <div className="form-group">
              <label htmlFor="question">Question *</label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter the question here..."
                rows="4"
                className={errors.question ? "error" : ""}
              />
              {errors.question && (
                <span className="error-message">{errors.question}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="marks">Marks *</label>
              <input
                type="number"
                id="marks"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Enter marks"
                min="1"
                step="1"
                className={errors.marks ? "error" : ""}
              />
              {errors.marks && (
                <span className="error-message">{errors.marks}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modelAnswer">Model Answer *</label>
              <textarea
                id="modelAnswer"
                name="modelAnswer"
                value={formData.modelAnswer}
                onChange={handleChange}
                placeholder="Enter the correct answer here..."
                rows="5"
                className={errors.modelAnswer ? "error" : ""}
              />
              {errors.modelAnswer && (
                <span className="error-message">{errors.modelAnswer}</span>
              )}
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "view" && (
        <div className="questions-list">
          <h2>Your Questions</h2>
          {loadingQuestions ? (
            <div className="loading">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <p>No questions added yet. Start by adding your first question!</p>
              <button className="btn-primary" onClick={() => setActiveTab("add")}>
                Add Question
              </button>
            </div>
          ) : (
            <div className="questions-grid">
              {questions.map((q, index) => (
                <div key={q.id} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-marks">{q.max_mark} marks</span>
                  </div>
                  <div className="question-content">
                    <h3>Question:</h3>
                    <p>{q.question}</p>
                  </div>
                  <div className="answer-content">
                    <h3>Model Answer:</h3>
                    <p>{q.answer}</p>
                  </div>
                  <div className="question-actions">
                    <button
                      className="btn-small"
                      onClick={() => onNavigate('student-upload', { questionId: q.id })}
                    >
                      View Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
