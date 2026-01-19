import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const StudentAnswerUpload = ({ teacherId, onBackToDashboard }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load questions for this faculty
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.FACULTY_QUESTION_GET_ALL);
        // Response: ApiResponse with data = list of FacultyQuesAns
        const all = res.data?.data || [];
        const tid = parseInt(teacherId || localStorage.getItem("teacherId"), 10);
        const filtered = all.filter(
          (q) => q.faculty && q.faculty.id === tid
        );
        setQuestions(filtered);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setMessage({
          type: "error",
          text:
            err.response?.data?.message ||
            "Could not load questions. Please try again.",
        });
      }
    };

    if (teacherId || localStorage.getItem("teacherId")) {
      loadQuestions();
    } else {
      setMessage({
        type: "error",
        text: "Teacher ID not found. Please register first.",
      });
    }
  }, [teacherId]);

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
    if (!studentId) {
      setMessage({ type: "error", text: "Please enter a student ID." });
      return;
    }
    if (!file) {
      setMessage({ type: "error", text: "Please upload an answer sheet image." });
      return;
    }

    setIsUploading(true);

    try {
      // 1) Upload student answer image (multipart/form-data)
      const formData = new FormData();
      formData.append("image", file);
      formData.append("student_id", studentId);
      formData.append("question_id", selectedQuestionId);

      const uploadRes = await axios.post(
        API_ENDPOINTS.STUDENT_ANSWER_UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadData = uploadRes.data?.data;
      if (!uploadData || !uploadData.id) {
        setMessage({
          type: "error",
          text:
            uploadRes.data?.message ||
            "Failed to upload student answer. Please try again.",
        });
        setIsUploading(false);
        return;
      }

      const studentQuesAnsId = uploadData.id;

      // 2) Call AI evaluation on uploaded answer
      const evalRes = await axios.post(
        API_ENDPOINTS.STUDENT_ANSWER_EVALUATE(studentQuesAnsId)
      );

      const evalData = evalRes.data;
      setEvaluation({
        marks: evalData.answer_mark,
        evaluationText: evalData.evolution,
        studentAnswer: evalData.answer,
        accuracyOcr: evalData.accuracy_ocr,
        accuracyCmp: evalData.accuracy_cmp,
      });

      setMessage({
        type: "success",
        text: "Answer uploaded and evaluated successfully!",
      });
    } catch (err) {
      console.error("Upload/evaluation error:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to upload or evaluate answer. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="question-card">
        {teacherId && (
          <div className="question-id">Teacher ID: {teacherId}</div>
        )}

        <h2>Student Answer Upload</h2>
        <p className="subtitle">
          Select a question and upload the student&apos;s handwritten answer
        </p>

        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="questionSelect">Select Question *</label>
            <select
              id="questionSelect"
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              className="select-input"
            >
              <option value="">-- Choose a question --</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="studentId">Student ID *</label>
            <input
              type="number"
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter existing student ID"
            />
            <small className="helper-text">
              Student must already be created in the system.
            </small>
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
                Image selected. Preview shown below.
              </small>
            )}
          </div>

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Answer preview" />
            </div>
          )}

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isUploading}
          >
            {isUploading ? "Uploading & Evaluating..." : "Upload & Evaluate"}
          </button>

          {onBackToDashboard && (
            <button
              type="button"
              className="secondary-btn"
              onClick={onBackToDashboard}
            >
              Back to Question Setup
            </button>
          )}
        </form>

        {evaluation && (
          <div className="evaluation-card">
            <h3>Evaluation Result</h3>
            <p>
              <strong>Marks Awarded:</strong> {evaluation.marks}
            </p>
            {evaluation.evaluationText && (
              <p>
                <strong>Feedback:</strong> {evaluation.evaluationText}
              </p>
            )}
            {evaluation.studentAnswer && (
              <p>
                <strong>Extracted Answer:</strong> {evaluation.studentAnswer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnswerUpload;

