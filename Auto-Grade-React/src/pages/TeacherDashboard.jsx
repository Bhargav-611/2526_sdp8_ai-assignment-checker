import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const TeacherDashboard = ({ teacherId: propTeacherId }) => {
  const [teacherId, setTeacherId] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    marks: "",
    modelAnswer: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Get teacher ID from localStorage or props
  useEffect(() => {
    const storedTeacherId = localStorage.getItem("teacherId");
    if (propTeacherId) {
      setTeacherId(propTeacherId);
    } else if (storedTeacherId) {
      setTeacherId(storedTeacherId);
    } else {
      // If no teacher ID found, show error message
      setMessage({
        type: "error",
        text: "Teacher ID not found. Please register first.",
      });
    }
  }, [propTeacherId]);

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

    if (!teacherId) {
      setMessage({
        type: "error",
        text: "Teacher ID is missing. Please register first.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend API endpoint: POST /facultyquesans
      // Request body format: { faculty_id: Long, question: String, answer: String, max_mark: int }
      const payload = {
        faculty_id: parseInt(teacherId, 10), // Convert to number (Long)
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
      <div className="question-card">
        {/* Display Teacher ID on top-right */}
        {teacherId && (
          <div className="question-id">Teacher ID: {teacherId}</div>
        )}

        <h2>Question Setup</h2>
        <p className="subtitle">Add questions for evaluation</p>

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
              placeholder="Enter the model answer here..."
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
    </div>
  );
};

export default TeacherDashboard;
