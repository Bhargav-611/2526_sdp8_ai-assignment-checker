# AutoGrade API Summary

## Backend API Endpoints

### Authentication Endpoints
All authentication endpoints are **PUBLIC** (no JWT required)

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, id, email, name, role }` | Login for both Faculty and Student |
| POST | `/api/auth/register/faculty` | `{ name, email, password, department, designation, qualification, experienceYears }` | `{ token, id, email, name, role }` | Register new Faculty |
| POST | `/api/auth/register/student` | `{ name, email, password, rollNumber, semester, section, admissionYear }` | `{ token, id, email, name, role }` | Register new Student |

### Faculty Endpoints
Requires JWT with **ROLE_TEACHER**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/faculty` | TEACHER | Create faculty profile |
| GET | `/api/faculty/all` | TEACHER | Get all faculty |
| GET | `/api/faculty/id/{id}` | TEACHER | Get faculty by ID |

### Faculty Question-Answer Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/facultyquesans` | TEACHER | Create question with model answer |
| GET | `/api/facultyquesans/all` | **BOTH** (TEACHER, STUDENT) | Get all questions - Students can browse |
| GET | `/api/facultyquesans/id/{id}` | **BOTH** (TEACHER, STUDENT) | Get specific question by ID |
| GET | `/api/facultyquesans/faculty/{id}` | TEACHER | Get all questions created by specific faculty |

**Request Body for POST** `/api/facultyquesans`:
```json
{
  "faculty_id": 1,
  "question": "Question text here",
  "answer": "Model answer here",
  "max_mark": 10
}
```

### Student Question-Answer (Submission) Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/questions` | STUDENT | Upload answer sheet (multipart/form-data) |
| POST | `/api/questions/ai/{id}` | **BOTH** | Trigger AI evaluation for submission |
| GET | `/api/questions/student/{id}` | **BOTH** | Get all submissions by student |
| GET | `/api/questions/question/{id}` | **BOTH** | Get all submissions for a question |
| POST | `/api/questions/extract` | **BOTH** | Extract text from image (OCR test) |

**Request for POST** `/api/questions` (multipart/form-data):
- `image`: File (answer sheet image)
- `student_id`: Long
- `question_id`: Long (references FacultyQuesAns ID)

**Response from AI Evaluation** `/api/questions/ai/{id}`:
```json
{
  "id": 1,
  "student_id": 1,
  "question_id": 1,
  "answer": "Extracted text from image",
  "answer_mark": 8,
  "facultyMarks": 10,
  "evolution": "AI feedback on answer quality",
  "accuracy_ocr": 0.95,
  "accuracy_cmp": 0.85,
  "imageUrl": "cloudinary_url"
}
```

## Frontend API Integration

All API calls are configured in `src/config/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

### Authentication Flow

1. **Login**
   - Frontend: Calls `AUTH_LOGIN` with email/password
   - Backend: Returns JWT token + user data
   - Frontend: Stores token in localStorage via AuthService
   - Frontend: Redirects to appropriate dashboard based on role

2. **Registration**
   - Frontend: Calls `AUTH_REGISTER_FACULTY` or `AUTH_REGISTER_STUDENT`
   - Backend: Creates user + returns JWT token
   - Frontend: Auto-login with token
   - Frontend: Redirects to dashboard

3. **Auto-redirect on Reload**
   - AuthContext checks localStorage for token on mount
   - If valid token exists, user is logged in automatically
   - App.jsx redirects to appropriate dashboard

### JWT Token Management

**Automatic Token Injection:**
- All API calls (except auth endpoints) automatically include JWT token
- Handled by axios interceptor in `authService.js`:
  ```javascript
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  ```

**Automatic Logout on 401:**
- Axios response interceptor catches 401 errors
- Clears token and redirects to login

## User Flows

### Faculty Flow
1. Register → Auto-login → Teacher Dashboard
2. Add Question (with question text, model answer, max marks)
3. View all created questions
4. View student submissions (coming soon)

### Student Flow
1. Register → Auto-login → Student Dashboard
2. Browse Available Questions (from all faculty)
3. Select question → Upload Answer
4. Submit answer sheet image
5. AI evaluates automatically
6. View results: marks, feedback, accuracy scores
7. View all previous submissions with evaluation status

## Key Features Implemented

✅ **Backend:**
- JWT authentication with role-based access control
- Faculty can create questions with model answers
- Students can browse ALL questions from any faculty
- Students can upload answer images
- AI evaluation with OCR and comparison
- Cloudinary integration for image storage

✅ **Frontend:**
- Complete authentication system (login/register)
- Separate dashboards for Faculty and Students
- Faculty: Create and view questions
- Student: Browse questions, submit answers, view evaluations
- Automatic JWT token management
- Auto-redirect after login/registration
- Responsive modern UI

## Testing the Application

### 1. Start Backend
```bash
cd Auto-Grade-Springboot
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`

### 2. Start Frontend
```bash
cd Auto-Grade-React
npm install
npm run dev
```
Frontend runs on `http://localhost:5174`

### 3. Test Flow
1. **Register as Faculty:**
   - Open http://localhost:5174
   - Click "Register" → "Faculty"
   - Fill form and submit
   - You'll be auto-logged in and redirected to Teacher Dashboard

2. **Create Question:**
   - Click "Add Question" tab
   - Enter question text, model answer, and max marks
   - Submit
   - Question is saved

3. **Register as Student (new incognito/private window):**
   - Open http://localhost:5174 in new incognito window
   - Click "Register" → "Student"
   - Fill form and submit
   - You'll be auto-logged in to Student Dashboard

4. **Browse and Submit Answer:**
   - You'll see the question created by faculty
   - Click "Submit Answer"
   - Upload answer sheet image
   - Click "Upload & Evaluate"
   - AI will evaluate and show results

5. **View Results:**
   - See marks obtained vs max marks
   - View AI feedback
   - See OCR accuracy
   - Check comparison accuracy

## API Security Notes

- All endpoints except `/api/auth/*` require JWT token
- Token must be sent in `Authorization: Bearer {token}` header
- Tokens expire based on JWT configuration
- Frontend handles token refresh/re-login automatically
- CORS is configured for `http://localhost:5173` and `http://localhost:5174`

## Database Schema

**Faculty:**
- id, name, email, password (encrypted), role, department, designation, qualification, experienceYears

**Student:**
- id, name, email, password (encrypted), role, rollNumber, semester, section, admissionYear

**FacultyQuesAns:**
- id, faculty_id, question, answer (model answer), max_mark

**StudentQuesAns:**
- id, student_id, question_id (FK to FacultyQuesAns), answer (extracted), answer_mark, evolution (feedback), accuracy_ocr, accuracy_cmp, imageUrl
