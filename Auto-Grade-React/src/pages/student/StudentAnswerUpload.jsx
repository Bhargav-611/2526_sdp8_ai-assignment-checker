import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

const StudentAnswerUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.FACULTY_QUESTION_GET_ALL);
      const all = res.data?.data || [];
      setQuestions(Array.isArray(all) ? all : []);
    } catch (err) {
      console.error("Failed to load questions:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not load questions. Please try again.",
      });
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected || null);
    setEvaluation(null);
    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setEvaluation(null);

    if (!selectedQuestionId) {
      setMessage({ type: "error", text: "Please select a question." });
      return;
    }

    if (!file) {
      setMessage({ type: "error", text: "Please upload an answer sheet image." });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("student_id", user.id.toString());
      formData.append("question_id", selectedQuestionId.toString());

      const uploadRes = await axios.post(
        API_ENDPOINTS.STUDENT_ANSWER_UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadData = uploadRes.data?.data || uploadRes.data;
      if (!uploadData || !uploadData.id) {
        setMessage({
          type: "error",
          text: uploadRes.data?.message || "Failed to upload answer. Please try again.",
        });
        setIsUploading(false);
        return;
      }

      const studentQuesAnsId = uploadData.id;

      try {
        const evalRes = await axios.post(
          API_ENDPOINTS.STUDENT_ANSWER_EVALUATE(studentQuesAnsId)
        );

        const evalData = evalRes.data;
        setEvaluation({
          marks: evalData.answer_mark,
          maxMarks: evalData.facultyMarks,
          evaluationText: evalData.evolution,
          studentAnswer: evalData.answer,
          accuracyCmp: evalData.accuracy_cmp,
        });
      } catch (evalErr) {
        console.log("Evaluation pending or unavailable");
      }

      setMessage({
        type: "success",
        text: "Answer uploaded successfully!",
      });

      setFile(null);
      setPreviewUrl(null);
      setSelectedQuestionId("");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.response?.data?.error || "Failed to upload answer. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>📤 Upload Answer</h1>
          <p>Student: {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate('/student/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="question-card">
        <h2>Submit Your Answer</h2>
        <p className="subtitle">
          Select a question and upload your handwritten answer
        </p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="questionSelect">Select Question *</label>
            <select
              id="questionSelect"
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
            >
              <option value="">-- Choose a question --</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question} ({q.max_mark} marks)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="answerImage">Upload Answer Sheet Image *</label>
            <input
              type="file"
              id="answerImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <small className="helper-text">
                ✓ Image selected
              </small>
            )}
          </div>

          {previewUrl && (
            <div className="image-preview">
              <h3>Image Preview</h3>
              <img src={previewUrl} alt="Answer preview" />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isUploading}
          >
            {isUploading ? "Uploading & Evaluating..." : "Upload & Evaluate"}
          </button>
        </form>

        {evaluation && (
          <div className="evaluation-card">
            <h3>✓ Evaluation Result</h3>
            <div className="marks-display">
              <span className="marks-obtained">{evaluation.marks}</span>
              <span className="marks-separator">/</span>
              <span className="marks-total">{evaluation.maxMarks}</span>
              <span className="marks-label">marks</span>
            </div>
            {evaluation.evaluationText && (
              <div className="feedback-section">
                <h4>Feedback</h4>
                <p>{evaluation.evaluationText}</p>
              </div>
            )}
            {evaluation.studentAnswer && (
              <div className="extracted-answer">
                <h4>Extracted Answer (OCR)</h4>
                <p>{evaluation.studentAnswer}</p>
              </div>
            )}
            {evaluation.accuracyCmp !== null && evaluation.accuracyCmp !== undefined && (
              <div className="accuracy">
                <p>Accuracy: {(evaluation.accuracyCmp * 100).toFixed(2)}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnswerUpload;
