import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ");
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
  const [activeTab, setActiveTab] = useState("add");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

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
      const payload = {
        faculty_id: user.id,
        question: formData.question.trim(),
        answer: formData.modelAnswer.trim(),
        max_mark: parseInt(formData.marks, 10),
      };

      const response = await axios.post(
        API_ENDPOINTS.FACULTY_QUESTION_CREATE,
        payload
      );

      if (response.data) {
        setMessage({
          type: "success",
          text: "Question added successfully!",
        });

        setFormData({
          question: "",
          marks: "",
          modelAnswer: "",
        });

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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>📚 Teacher Dashboard</h1>
          <p>
            Welcome, <strong>{displayName || "Teacher"}</strong>
          </p>
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

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

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
                placeholder="Enter the model answer..."
                rows="6"
                className={errors.modelAnswer ? "error" : ""}
              />
              {errors.modelAnswer && (
                <span className="error-message">{errors.modelAnswer}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Question"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "view" && (
        <div className="question-card">
          <h2>Your Questions</h2>
          <p className="subtitle">View all questions you've created</p>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {loadingQuestions ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <p>No questions created yet. Start by adding a question!</p>
            </div>
          ) : (
            <div className="questions-grid">
              {questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-number">Question #{index + 1}</div>
                  <h3>{question.question}</h3>
                  <p><strong>Marks:</strong> {question.max_mark}</p>
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
