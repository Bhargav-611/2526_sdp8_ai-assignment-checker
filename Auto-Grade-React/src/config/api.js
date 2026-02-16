// API Configuration
// Update this base URL if your backend runs on a different port
const API_BASE_URL = "http://localhost:8080/api";

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER_FACULTY: `${API_BASE_URL}/auth/register/faculty`,
  AUTH_REGISTER_STUDENT: `${API_BASE_URL}/auth/register/student`,
  AUTH_HEALTH: `${API_BASE_URL}/auth/health`,

  // Faculty endpoints
  FACULTY_CREATE: `${API_BASE_URL}/faculty`,
  FACULTY_GET_ALL: `${API_BASE_URL}/faculty/all`,
  FACULTY_GET_BY_ID: (id) => `${API_BASE_URL}/faculty/id/${id}`,
  
  // Faculty Question Answer endpoints
  FACULTY_QUESTION_CREATE: `${API_BASE_URL}/facultyquesans`,
  FACULTY_QUESTION_GET_ALL: `${API_BASE_URL}/facultyquesans/all`,
  FACULTY_QUESTION_GET_BY_ID: (id) => `${API_BASE_URL}/facultyquesans/id/${id}`,
  FACULTY_QUESTION_GET_BY_FACULTY_ID: (id) => `${API_BASE_URL}/facultyquesans/faculty/${id}`,

  // Student endpoints
  STUDENT_CREATE: `${API_BASE_URL}/student`, // POST ?name=
  STUDENT_GET_ALL: `${API_BASE_URL}/student/all`,
  STUDENT_GET_BY_ID: (id) => `${API_BASE_URL}/student/id/${id}`,
  
  // Student Question Answer endpoints
  STUDENT_ANSWER_CREATE: `${API_BASE_URL}/questions`, // POST multipart/form-data (teacher uploads student answer)
  STUDENT_ANSWER_UPLOAD: `${API_BASE_URL}/questions`, // POST multipart/form-data
  STUDENT_ANSWER_EVALUATE: (id) => `${API_BASE_URL}/questions/ai/${id}`,
  STUDENT_ANSWER_GET_BY_STUDENT: (id) => `${API_BASE_URL}/questions/student/${id}`,
  STUDENT_ANSWER_GET_BY_QUESTION: (id) => `${API_BASE_URL}/questions/question/${id}`,
  STUDENT_ANSWER_EXTRACT_TEXT: `${API_BASE_URL}/questions/extract`,
  STUDENT_ANSWER_UPDATE_MARKS: (id) => `${API_BASE_URL}/questions/update-marks/${id}`,
  STUDENT_ANSWER_GET_ALL: `${API_BASE_URL}/questions/all`,
  STUDENT_ANSWER_GET_BY_FACULTY: (facultyId) => `${API_BASE_URL}/questions/faculty/${facultyId}/submissions`,
};

export default API_BASE_URL;
