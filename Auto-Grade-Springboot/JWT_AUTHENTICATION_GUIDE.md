# JWT-Based Role-Based Authentication - Implementation Guide

## Overview
This project implements JWT (JSON Web Token) based authentication with role-based access control (RBAC) for the AutoGrade Spring Boot application.

## Architecture

### Layered Structure
```
├── Configuration/       # Security and application configuration
├── security/           # JWT components (Filter, Provider, EntryPoint)
├── controller/         # REST API endpoints
├── service/           # Business logic layer
├── Repository/        # Data access layer
├── models/            # Entity models
└── payloads/          # DTOs (Data Transfer Objects)
```

## Key Components

### 1. Security Layer (`/security`)

#### JwtTokenProvider.java
- Generates JWT tokens with user details and roles
- Validates JWT tokens
- Extracts username and roles from tokens
- Uses HS512 algorithm with 256-bit secret key

#### JwtAuthenticationFilter.java
- Intercepts every HTTP request
- Extracts JWT from Authorization header
- Validates token and sets authentication in SecurityContext
- Extends OncePerRequestFilter for efficiency

#### JwtAuthenticationEntryPoint.java
- Handles unauthorized access attempts
- Returns 401 HTTP status with error details
- Implements AuthenticationEntryPoint interface

### 2. Configuration Layer (`/Configuration`)

#### SecurityConfig.java
- Main security configuration
- Defines protected and public endpoints
- Configures stateless session management
- Sets up JWT filter chain
- Role-based access control rules:
  - `/api/auth/**` - Public (login, register)
  - `/api/faculty/**` - ROLE_TEACHER only
  - `/api/student/**` - ROLE_STUDENT only

#### CorsConfig.java
- Configures Cross-Origin Resource Sharing
- Allows React frontend (ports 3000, 5173)
- Permits credentials and all headers

### 3. Service Layer (`/services`)

#### UserDetailsServiceImpl.java
- Implements Spring Security's UserDetailsService
- Loads user from Faculty or Student repository
- Returns UserDetails with email and role

#### AuthService.java
- Handles login logic
- Registers new Faculty and Student users
- Generates JWT tokens after successful authentication
- Encrypts passwords using BCryptPasswordEncoder

### 4. Controller Layer (`/controller`)

#### AuthController.java
Endpoints:
- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/register/faculty` - Faculty registration
- `POST /api/auth/register/student` - Student registration
- `GET /api/auth/health` - Health check

### 5. DTOs (`/payloads`)

#### LoginRequest.java
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### LoginResponse.java
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "role": "ROLE_TEACHER"
}
```

#### RegisterRequest.java
```json
{
  "name": "Faculty Name",
  "email": "faculty@example.com",
  "password": "password123",
  "department": "Computer Science",
  "designation": "Professor",
  "qualification": "PhD",
  "experienceYears": 10
}
```

## Configuration

### application.properties
```properties
# JWT Configuration
jwt.secret=your-256-bit-secret-key-make-it-very-long-and-secure-with-random-characters-at-least-256-bits-of-entropy
jwt.expiration=86400000  # 24 hours in milliseconds
```

**IMPORTANT**: Change the jwt.secret to a secure random string in production!

## API Endpoints

### Authentication Endpoints (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register/faculty` | Register faculty |
| POST | `/api/auth/register/student` | Register student |
| GET | `/api/auth/health` | Health check |

### Faculty Endpoints (ROLE_TEACHER required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty/all` | Get all faculty |
| GET | `/api/faculty/id/{id}` | Get faculty by ID |
| POST | `/api/facultyquesans` | Create question |
| GET | `/api/facultyquesans/all` | Get all questions |

### Student Endpoints (ROLE_STUDENT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/questions` | Submit answer |
| GET | `/api/questions/student/{id}` | Get student answers |

## How to Use

### 1. Register a New User

**Faculty Registration:**
```bash
curl -X POST http://localhost:8080/api/auth/register/faculty \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "email": "john.doe@university.edu",
    "password": "secure123",
    "department": "Computer Science",
    "designation": "Professor",
    "qualification": "PhD",
    "experienceYears": 15
  }'
```

**Student Registration:**
```bash
curl -X POST http://localhost:8080/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@student.edu",
    "password": "secure123",
    "rollNumber": "CS2023001",
    "department": "Computer Science",
    "semester": "6",
    "section": "A",
    "admissionYear": "2023"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@university.edu",
    "password": "secure123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huLmRvZUB1bml2ZXJzaXR5LmVkdSIsInJvbGVzIjoiUk9MRV9URUFDSEVSIiwiaWF0IjoxNzA2MTg0MDAwLCJleHAiOjE3MDYyNzA0MDB9.signature",
    "type": "Bearer",
    "id": 1,
    "email": "john.doe@university.edu",
    "name": "Dr. John Doe",
    "role": "ROLE_TEACHER"
  }
}
```

### 3. Access Protected Endpoints

Include the JWT token in the Authorization header:

```bash
curl -X GET http://localhost:8080/api/faculty/all \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

## Frontend Integration

### React/JavaScript Example

```javascript
// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login function
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, ...userData } = response.data.data;
  
  // Store token and user data
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  return response.data;
};

// Register function
export const registerFaculty = async (data) => {
  const response = await api.post('/auth/register/faculty', data);
  const { token, ...userData } = response.data.data;
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  return response.data;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;
```

## Security Best Practices

1. **Secret Key**: Use a strong, random 256-bit secret key in production
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Tokens expire after 24 hours (configurable)
4. **Password Encryption**: BCrypt with salt rounds
5. **CORS**: Configure allowed origins carefully
6. **Role-Based Access**: Endpoints protected by roles
7. **Stateless Sessions**: No server-side session storage

## Testing

### Using Postman

1. **Register**: POST to `/api/auth/register/faculty`
2. **Login**: POST to `/api/auth/login` → Copy the token
3. **Protected Request**: 
   - Add header: `Authorization: Bearer <token>`
   - Make request to protected endpoint

## Troubleshooting

### 401 Unauthorized
- Check if token is included in Authorization header
- Verify token hasn't expired
- Ensure user has correct role for endpoint

### 403 Forbidden
- User authenticated but lacks required role
- Check @PreAuthorize annotations on controllers

### Token Validation Failed
- Token might be expired or malformed
- Check jwt.secret matches between token generation and validation

## Database Schema

### Faculty Table
- id, name, email, password (encrypted)
- role (ROLE_TEACHER)
- department, designation, qualification, experienceYears

### Student Table
- id, name, email, password (encrypted)
- role (ROLE_STUDENT)
- rollNumber, department, semester, section, admissionYear

## Future Enhancements

1. **Refresh Tokens**: Implement refresh token mechanism
2. **Email Verification**: Verify email during registration
3. **Password Reset**: Forgot password functionality
4. **Rate Limiting**: Prevent brute force attacks
5. **Audit Logging**: Track login attempts and access
6. **Multi-Factor Authentication**: Add 2FA support
7. **Token Blacklisting**: Invalidate tokens on logout

## Support

For issues or questions, check:
- Spring Security documentation
- JWT.io for token debugging
- Application logs for detailed error messages
