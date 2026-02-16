import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  async login(email, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.success && response.data.data) {
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set default authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        success: true,
        user: userData,
        token,
      };
    }
    
    throw new Error(response.data.message || 'Login failed');
  }

  async registerFaculty(data) {
    const response = await axios.post(`${API_BASE_URL}/auth/register/faculty`, {
      name: data.name,
      email: data.email,
      password: data.password,
      department: data.department,
      designation: data.designation,
      qualification: data.qualification,
      experienceYears: data.experienceYears,
    });

    if (response.data.success && response.data.data) {
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        success: true,
        user: userData,
        token,
      };
    }
    
    throw new Error(response.data.message || 'Registration failed');
  }

  async registerStudent(data) {
    const response = await axios.post(`${API_BASE_URL}/auth/register/student`, {
      name: data.name,
      email: data.email,
      password: data.password,
      rollNumber: data.rollNumber,
      semester: data.semester,
      section: data.section,
      admissionYear: data.admissionYear,
    });

    if (response.data.success && response.data.data) {
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        success: true,
        user: userData,
        token,
      };
    }
    
    throw new Error(response.data.message || 'Registration failed');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

// Setup axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup axios interceptor to handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only logout if it's not a login request
      if (!error.config.url.includes('/auth/login')) {
        authService.logout();
        // Use event to notify app instead of direct redirect
        window.dispatchEvent(new Event('unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);
