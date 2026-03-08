import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import '../../styles/Dashboard.css';

const TeacherUploadStudentAnswer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    question_id: '',
    student_id: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadQuestions();
    loadStudents();
  }, [user]);

  const loadQuestions = async () => {
    if (!user?.id) return;
    
    setLoadingQuestions(true);
    try {
      const response = await axios.get(API_ENDPOINTS.FACULTY_QUESTION_GET_BY_FACULTY_ID(user.id));
      
      if (response.data?.success && response.data?.data) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setMessage({ type: 'error', text: 'Failed to load questions' });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await axios.get(API_ENDPOINTS.STUDENT_GET_ALL);
      
      if (response.data?.success && response.data?.data) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setMessage({ type: 'error', text: 'Failed to load students' });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size must be less than 10MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question_id) {
      newErrors.question_id = 'Please select a question';
    }
    
    if (!formData.student_id) {
      newErrors.student_id = 'Please select a student';
    }
    
    if (!formData.image) {
      newErrors.image = 'Please select an answer sheet image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('student_id', formData.student_id);
      uploadData.append('question_id', formData.question_id);
      uploadData.append('image', formData.image);
      
      const response = await axios.post(
        API_ENDPOINTS.STUDENT_ANSWER_CREATE,
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Student answer uploaded successfully! You can now evaluate it.'
        });
        
        setFormData({
          question_id: '',
          student_id: '',
          image: null
        });
        setImagePreview(null);
        
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error uploading answer:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload answer. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedQuestion = questions.find(q => q.id === parseInt(formData.question_id));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>📤 Upload Student Answer</h1>
          <p>
            Registered Teacher: <strong>{displayName || "Teacher"}</strong>
          </p>
        </div>
      </div>

      <div className="question-card">
        <h2>Upload Student's Answer Sheet</h2>
        <p className="subtitle">Select question, student, and upload their answer photo</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="question_id">Select Question *</label>
            {loadingQuestions ? (
              <p className="helper-text">Loading questions...</p>
            ) : questions.length === 0 ? (
              <p className="helper-text">No questions available. Please create a question first.</p>
            ) : (
              <select
                id="question_id"
                name="question_id"
                value={formData.question_id}
                onChange={handleChange}
                className={errors.question_id ? 'error' : ''}
              >
                <option value="">-- Select a Question --</option>
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    Q{question.id}: {question.question.substring(0, 60)}... ({question.max_mark} marks)
                  </option>
                ))}
              </select>
            )}
            {errors.question_id && (
              <span className="error-message">{errors.question_id}</span>
            )}
          </div>

          {selectedQuestion && (
            <div className="question-meta">
              <h3>Selected Question Details</h3>
              <p><strong>Question:</strong> {selectedQuestion.question}</p>
              <p><strong>Max Marks:</strong> {selectedQuestion.max_mark}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="student_id">Select Student *</label>
            {loadingStudents ? (
              <p className="helper-text">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="helper-text">No students registered yet.</p>
            ) : (
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className={errors.student_id ? 'error' : ''}
              >
                <option value="">-- Select a Student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - Roll: {student.rollNumber} ({student.email})
                  </option>
                ))}
              </select>
            )}
            {errors.student_id && (
              <span className="error-message">{errors.student_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Answer Sheet Image *</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className={errors.image ? 'error' : ''}
            />
            <span className="helper-text">
              Upload student's answer sheet image (JPG, PNG - Max 10MB)
            </span>
            {errors.image && (
              <span className="error-message">{errors.image}</span>
            )}
          </div>

          {imagePreview && (
            <div className="image-preview">
              <h3>Image Preview</h3>
              <img src={imagePreview} alt="Answer preview" />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Answer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherUploadStudentAnswer;
