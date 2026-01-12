// API Configuration
// Update this base URL if your backend runs on a different port
const API_BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
  // Faculty endpoints
  FACULTY_REGISTER: `${API_BASE_URL}/faculty`,
  FACULTY_GET_BY_ID: (id) => `${API_BASE_URL}/faculty/id/${id}`,
  
  // Faculty Question Answer endpoints
  FACULTY_QUESTION_CREATE: `${API_BASE_URL}/facultyquesans`,
  FACULTY_QUESTION_GET_ALL: `${API_BASE_URL}/facultyquesans/all`,
  FACULTY_QUESTION_GET_BY_ID: (id) => `${API_BASE_URL}/facultyquesans/id/${id}`,
};

export default API_BASE_URL;
