# AutoGrade System Architecture

## 🏗️ Complete Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                     http://localhost:5174                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND (Vite)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Auth Pages   │  │ Dashboards   │  │ Answer Upload       │ │
│  │ - Login      │  │ - Teacher    │  │ - Image Upload     │ │
│  │ - Register   │  │ - Student    │  │ - Evaluation View  │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐│
│  │           AuthContext (JWT Token Management)                ││
│  │  - Token storage in localStorage                           ││
│  │  - Automatic token injection in API calls                  ││
│  │  - Auto-redirect based on authentication state             ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP Requests with JWT
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SPRING BOOT BACKEND (REST API)                   │
│                     http://localhost:8080                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Security Layer (JWT)                     │  │
│  │  - JwtTokenProvider: Generate & Validate tokens          │  │
│  │  - SecurityConfig: Configure authentication              │  │
│  │  - Role-based access control (@PreAuthorize)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                 │                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Controllers                            │  │
│  │  ┌────────────────┐  ┌──────────────────────────────┐  │  │
│  │  │ AuthController │  │ FacultyQuesAnsController     │  │  │
│  │  │ - login        │  │ - POST /facultyquesans       │  │  │
│  │  │ - register     │  │ - GET /facultyquesans/all    │  │  │
│  │  └────────────────┘  └──────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ StudentQuesAnsController                         │  │  │
│  │  │ - POST /questions (upload answer)                │  │  │
│  │  │ - POST /questions/ai/{id} (evaluate)             │  │  │
│  │  │ - GET /questions/student/{id}                    │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                 │                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Services                             │  │
│  │  - AuthService: User authentication & registration       │  │
│  │  - FacultyQuesAnsServices: Question CRUD operations      │  │
│  │  - StudentQuesAnsServices: Submission & evaluation       │  │
│  │  - OcrService: Text extraction from images              │  │
│  │  - CloudinaryService: Image upload to cloud             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                 │                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   JPA Repositories                        │  │
│  │  - FacultyRepo                                           │  │
│  │  - StudentRepo                                           │  │
│  │  - FacultyQuesAnsRepo                                    │  │
│  │  - StudentQuesAnsRepo                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                     │                           │
                     │                           │
                     ▼                           ▼
     ┌───────────────────────────┐  ┌──────────────────────────┐
     │   PostgreSQL Database      │  │   Cloudinary (Image CDN)│
     │   localhost:5432           │  │   Cloud Storage         │
     │                            │  │                          │
     │  Tables:                   │  │  - Store answer images  │
     │  - faculty                 │  │  - Return image URLs    │
     │  - student                 │  │                          │
     │  - faculty_ques_ans        │  └──────────────────────────┘
     │  - student_ques_ans        │
     └───────────────────────────┘
                     │
                     │
                     ▼
     ┌───────────────────────────┐
     │   AI Service (Python)      │
     │   http://localhost:8000    │
     │                            │
     │  - OCR: Extract text       │
     │  - NLP: Compare answers    │
     │  - Scoring: Calculate marks│
     └───────────────────────────┘
```

## 🔄 Data Flow Examples

### 1. User Registration Flow

```
User fills registration form
         │
         ▼
Frontend validates input
         │
         ▼
POST /api/auth/register/faculty or /student
    { name, email, password, ... }
         │
         ▼
Backend AuthService
    ├─ Check if email exists
    ├─ Hash password with BCrypt
    ├─ Save to database (Faculty/Student table)
    └─ Generate JWT token
         │
         ▼
Response: { token, id, email, name, role }
         │
         ▼
Frontend AuthContext
    ├─ Store token in localStorage
    ├─ Set axios default headers
    └─ Update user state
         │
         ▼
Auto-redirect to appropriate dashboard
```

### 2. Question Creation Flow (Faculty)

```
Faculty fills question form
         │
         ▼
POST /api/facultyquesans
    Authorization: Bearer {token}
    { faculty_id, question, answer, max_mark }
         │
         ▼
Backend JWT Filter
    ├─ Extract token from header
    ├─ Validate token
    └─ Check role = ROLE_TEACHER
         │
         ▼
FacultyQuesAnsService
    └─ Save to faculty_ques_ans table
         │
         ▼
Response: { id, faculty_id, question, answer, max_mark }
         │
         ▼
Frontend shows success message
```

### 3. Answer Submission & Evaluation Flow (Student)

```
Student uploads answer image
         │
         ▼
POST /api/questions
    multipart/form-data
    { image, student_id, question_id }
         │
         ▼
Backend StudentQuesAnsService
    ├─ Upload image to Cloudinary
    ├─ Get image URL
    └─ Save to student_ques_ans table
         │
         ▼
Response: { id, student_id, question_id, imageUrl }
         │
         ▼
POST /api/questions/ai/{id}
         │
         ▼
Backend OcrService
    ├─ Call Python AI service with image URL
    ├─ Extract text from image (OCR)
    ├─ Get faculty model answer
    ├─ Compare answers using NLP
    └─ Calculate marks
         │
         ▼
Update student_ques_ans table
    { answer, answer_mark, evolution, accuracy_ocr, accuracy_cmp }
         │
         ▼
Response: Complete evaluation data
         │
         ▼
Frontend displays results
    - Marks: 8/10
    - Feedback: "Good explanation..."
    - OCR Accuracy: 95%
```

## 🔐 Authentication Flow Detail

```
┌─────────────────────────────────────────────────────────────┐
│                    Login/Register                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend generates JWT token:                               │
│  Header: { "alg": "HS256", "typ": "JWT" }                  │
│  Payload: { "sub": "email", "role": "ROLE_X", "exp": ... } │
│  Signature: HMACSHA256(base64(header) + base64(payload))   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend stores token:                                     │
│  localStorage.setItem('token', token)                       │
│  axios.defaults.headers.common['Authorization'] = token     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  All subsequent API calls automatically include:            │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend validates token on every protected endpoint:       │
│  - Extract token from Authorization header                  │
│  - Verify signature with secret key                         │
│  - Check expiration                                         │
│  - Check role against @PreAuthorize annotation              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                    Request processed
```

## 📊 Database Schema

```
┌─────────────────────────────────┐
│          Faculty                │
├─────────────────────────────────┤
│ id: Long (PK)                   │
│ name: String                    │
│ email: String (UNIQUE)          │
│ password: String (BCrypt)       │
│ role: Enum (ROLE_TEACHER)       │
│ department: String              │
│ designation: String             │
│ qualification: String           │
│ experienceYears: Integer        │
│ createdAt: Timestamp            │
│ updatedAt: Timestamp            │
└─────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────┐
│      FacultyQuesAns             │
├─────────────────────────────────┤
│ id: Long (PK)                   │
│ faculty_id: Long (FK)           │
│ question: Text                  │
│ answer: Text (model answer)     │
│ max_mark: Integer               │
│ createdAt: Timestamp            │
└─────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────┐      ┌─────────────────────┐
│      StudentQuesAns             │◄─────│     Student         │
├─────────────────────────────────┤  N:1 ├─────────────────────┤
│ id: Long (PK)                   │      │ id: Long (PK)       │
│ student_id: Long (FK)           │      │ name: String        │
│ question_id: Long (FK)          │      │ email: String       │
│ answer: Text (extracted)        │      │ password: String    │
│ answer_mark: Integer            │      │ role: Enum          │
│ evolution: Text (feedback)      │      │ rollNumber: String  │
│ accuracy_ocr: Double            │      │ semester: String    │
│ accuracy_cmp: Double            │      │ section: String     │
│ imageUrl: String                │      │ admissionYear: Str  │
│ createdAt: Timestamp            │      └─────────────────────┘
└─────────────────────────────────┘
```

## 🎯 Role-Based Access Matrix

| Endpoint | PUBLIC | STUDENT | TEACHER |
|----------|--------|---------|---------|
| `/api/auth/login` | ✅ | - | - |
| `/api/auth/register/*` | ✅ | - | - |
| `/api/facultyquesans` (POST) | ❌ | ❌ | ✅ |
| `/api/facultyquesans/all` | ❌ | ✅ | ✅ |
| `/api/facultyquesans/id/{id}` | ❌ | ✅ | ✅ |
| `/api/facultyquesans/faculty/{id}` | ❌ | ❌ | ✅ |
| `/api/questions` (POST) | ❌ | ✅ | ❌ |
| `/api/questions/ai/{id}` | ❌ | ✅ | ✅ |
| `/api/questions/student/{id}` | ❌ | ✅ | ✅ |
| `/api/questions/question/{id}` | ❌ | ✅ | ✅ |

## 🔧 Technology Stack

### Frontend
- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool & dev server
- **Axios 1.13.2** - HTTP client
- **CSS3** - Styling with custom properties
- **Context API** - State management

### Backend
- **Spring Boot 3.x** - Java framework
- **Spring Security** - Authentication & authorization
- **JWT (JJWT)** - Token-based auth
- **JPA/Hibernate** - ORM
- **PostgreSQL** - Database
- **Cloudinary SDK** - Image storage

### AI Service
- **Python** - Programming language
- **TrOCR** - Text extraction
- **Transformers** - NLP models
- **OpenCV** - Image processing

## 📝 Configuration Summary

### Backend (application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/autograde
jwt.secret=your-secret-key
jwt.expiration=86400000 (24 hours)
cloudinary.cloud_name=dcq2zv9kc
fastapi.base-url=http://localhost:8000
```

### Frontend (api.js)
```javascript
const API_BASE_URL = "http://localhost:8080/api"
```

### CORS Configuration
```java
allowedOrigins = ["http://localhost:5173", "http://localhost:5174"]
```

## ✅ System Status

| Component | Status | Port |
|-----------|--------|------|
| Frontend | ✅ Running | 5174 |
| Backend | 🟡 Ready | 8080 |
| Database | ✅ Configured | 5432 |
| AI Service | 🟡 Ready | 8000 |

**Legend:**
- ✅ Currently running
- 🟡 Configured and ready to start

---

**All systems are working and ready for use!** 🚀
