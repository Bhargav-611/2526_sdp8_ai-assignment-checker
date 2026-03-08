import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Consolidated API Service
 * All API calls go through here (except auth which also lives in authService)
 * All requests automatically include the JWT token via the interceptor in authService.js
 */

// ============================================================
// AUTH
// ============================================================

export const login = (email, password) =>
    axios.post(`${API_BASE_URL}/auth/login`, { email, password });

export const registerFaculty = (data) =>
    axios.post(`${API_BASE_URL}/auth/register/faculty`, {
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department,
        designation: data.designation,
        qualification: data.qualification,
        experienceYears: data.experienceYears,
    });

export const registerStudent = (data) =>
    axios.post(`${API_BASE_URL}/auth/register/student`, {
        name: data.name,
        email: data.email,
        password: data.password,
        rollNumber: data.rollNumber,
        semester: data.semester,
        section: data.section,
        admissionYear: data.admissionYear,
    });

// ============================================================
// FACULTY QUESTION / ANSWER
// ============================================================

export const createQuestion = (payload) =>
    axios.post(`${API_BASE_URL}/facultyquesans`, payload);

export const getQuestionsByFacultyId = (facultyId) =>
    axios.get(`${API_BASE_URL}/facultyquesans/faculty/${facultyId}`);

export const getAllQuestions = () =>
    axios.get(`${API_BASE_URL}/facultyquesans/all`);

export const getQuestionById = (id) =>
    axios.get(`${API_BASE_URL}/facultyquesans/id/${id}`);

// ============================================================
// STUDENTS
// ============================================================

export const getAllStudents = () =>
    axios.get(`${API_BASE_URL}/student/all`);

export const getStudentById = (id) =>
    axios.get(`${API_BASE_URL}/student/id/${id}`);

// ============================================================
// SUBMISSIONS (Student Question Answers)
// ============================================================

/**
 * Upload student answer image (teacher uploads for student)
 * @param {FormData} formData - must include: student_id, question_id, image
 */
export const uploadAnswer = (formData) =>
    axios.post(`${API_BASE_URL}/questions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/**
 * Student uploads their own answer
 */
export const studentUploadAnswer = (formData) =>
    axios.post(`${API_BASE_URL}/questions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/**
 * Trigger AI evaluation for a submission
 */
export const aiEvaluate = (submissionId) =>
    axios.post(`${API_BASE_URL}/questions/ai/${submissionId}`);

/**
 * Get all submissions for a specific student
 */
export const getSubmissions = (studentId) =>
    axios.get(`${API_BASE_URL}/questions/student/${studentId}`);

/**
 * Get all submissions for a faculty's questions
 */
export const getSubmissionsByFaculty = (facultyId) =>
    axios.get(`${API_BASE_URL}/questions/faculty/${facultyId}/submissions`);

/**
 * Get submissions by question
 */
export const getSubmissionsByQuestion = (questionId) =>
    axios.get(`${API_BASE_URL}/questions/question/${questionId}`);

/**
 * Get all submissions (admin)
 */
export const getAllSubmissions = () =>
    axios.get(`${API_BASE_URL}/questions/all`);

/**
 * Update marks manually
 */
export const updateMarks = (submissionId, { answer_mark, evolution }) =>
    axios.put(`${API_BASE_URL}/questions/update-marks/${submissionId}`, {
        answer_mark,
        evolution,
    });

// ============================================================
// EXPORTS GROUPED
// ============================================================

const apiService = {
    // Auth
    login,
    registerFaculty,
    registerStudent,

    // Questions
    createQuestion,
    getQuestionsByFacultyId,
    getAllQuestions,
    getQuestionById,

    // Students
    getAllStudents,
    getStudentById,

    // Submissions
    uploadAnswer,
    studentUploadAnswer,
    aiEvaluate,
    getSubmissions,
    getSubmissionsByFaculty,
    getSubmissionsByQuestion,
    getAllSubmissions,
    updateMarks,
};

export default apiService;
