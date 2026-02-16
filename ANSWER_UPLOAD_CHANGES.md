# Answer Upload Page - Faculty-Only Changes

## Overview
Updated the Answer Upload page to be **faculty-only** with the required 3 fields:
1. **Select Question** - Choose which question the answer is for
2. **Select Student** - Choose which student submitted this answer
3. **Upload Answer Sheet Image** - Upload the photo of student's answer

## Changes Made

### Frontend Changes

#### 1. StudentAnswerUpload.jsx
**Location:** `Auto-Grade-React/src/pages/StudentAnswerUpload.jsx`

**Changes:**
- Added `students` state to store all students
- Added `selectedStudentId` state for student selection
- Added `loadStudents()` function to fetch all students from backend
- Updated `handleSubmit()` to validate student selection
- Updated form data to use `selectedStudentId` instead of current user's ID
- Updated UI to show "Faculty: {user?.name}" instead of "Student"
- Added student dropdown with format: "Name - Roll: RollNumber (Sem: Semester)"
- Reset `selectedStudentId` after successful submission

**Key Code Snippet:**
```jsx
// Load students
const loadStudents = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.STUDENT_GET_ALL);
    const all = res.data?.data || [];
    setStudents(Array.isArray(all) ? all : []);
  } catch (err) {
    console.error("Failed to load students:", err);
  }
};

// Student dropdown in form
<div className="form-group">
  <label htmlFor="studentSelect">Select Student *</label>
  <select
    id="studentSelect"
    value={selectedStudentId}
    onChange={(e) => setSelectedStudentId(e.target.value)}
    className="select-input"
  >
    <option value="">-- Choose a student --</option>
    {students.map((s) => (
      <option key={s.id} value={s.id}>
        {s.name} - Roll: {s.rollNumber} (Sem: {s.semester})
      </option>
    ))}
  </select>
</div>
```

#### 2. TeacherDashboard.jsx
**Location:** `Auto-Grade-React/src/pages/TeacherDashboard.jsx`

**Changes:**
- Updated button to navigate to 'answer-upload' page
- Button text: "Upload & Evaluate Answer"

### Backend Changes

#### StudentQuesAnsController.java
**Location:** `Auto-Grade-Springboot/src/main/java/com/ogs/autograde/controller/StudentQuesAnsController.java`

**Changes:**
- Added `@PreAuthorize("hasRole('TEACHER')")` annotation to `createQuestion()` endpoint
- This ensures only teachers can upload student answers

**Code:**
```java
@PostMapping()
@PreAuthorize("hasRole('TEACHER')")
public ResponseEntity<?> createQuestion(@ModelAttribute CreateStudentQADto createStudentQADto) throws IOException {
    return studentQuesAnsServices.createQuestion(createStudentQADto);
}
```

## API Endpoint

**Endpoint:** `POST /api/questions`

**Required Fields:**
- `image` (MultipartFile) - Answer sheet photo
- `question_id` (Long) - ID of the question
- `student_id` (Long) - ID of the student

**Authorization:** Requires `ROLE_TEACHER`

**DTO:** `CreateStudentQADto`
```java
@Data
public class CreateStudentQADto {
    private MultipartFile image;
    private Long student_id;
    private Long question_id;
}
```

## User Workflow

### Faculty Workflow:
1. Login as teacher
2. Click "Upload & Evaluate Answer" button
3. Select question from dropdown
4. Select student from dropdown
5. Upload answer sheet image
6. Click "Upload & Evaluate"
7. System processes OCR and AI evaluation
8. Results displayed immediately

### Student Workflow:
- Students can only **view** their evaluation results (read-only)
- Students cannot access the upload page
- Students see their marks and feedback in StudentDashboard

## Security

- ✅ Backend endpoint protected with `@PreAuthorize("hasRole('TEACHER')")`
- ✅ Only teachers can upload student answers
- ✅ Only teachers can access this page
- ✅ Students have read-only access to their results

## Testing Steps

1. **Start Backend:**
   ```powershell
   cd Auto-Grade-Springboot
   ./mvnw.cmd spring-boot:run
   ```

2. **Start Frontend:**
   ```powershell
   cd Auto-Grade-React
   npm run dev
   ```

3. **Test as Teacher:**
   - Login with teacher credentials
   - Click "Upload & Evaluate Answer"
   - Verify all 3 dropdowns/fields appear:
     - Question dropdown shows teacher's questions
     - Student dropdown shows all students
     - File upload accepts images
   - Upload and verify success

4. **Test as Student:**
   - Login with student credentials
   - Verify student dashboard is read-only
   - Verify student cannot access upload page

## Notes

- The page uses existing backend endpoint `/api/questions`
- Backend already supported the 3-field structure (no DTO changes needed)
- GET `/api/student/all` endpoint was already implemented in previous session
- All form validations are in place
- Image preview functionality remains intact
- AI evaluation runs automatically after upload
