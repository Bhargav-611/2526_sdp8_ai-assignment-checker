# 🎓 Auto Grade - Complete Workflow Guide

## 📋 **Your Workflow - Now Implemented!**

### **Step-by-Step Process:**

```
1. Teacher Logs In
   ↓
2. Teacher Creates Question (with model answer & max marks)
   ↓
3. Teacher Uploads Student's Answer Photo
   (Requires: Question ID + Student ID + Image)
   ↓
4. System Stores Answer in Database
   ↓
5. Teacher Can Trigger AI Evaluation (Optional)
   ↓
6. Teacher Can View Submissions
   ↓
7. Teacher Can Manually Update Marks & Feedback
```

---

## 🎯 **Complete Feature Flow**

### **1. Teacher Creates Question**
**Page:** Teacher Dashboard → "Add Question" tab

**What Teacher Does:**
- Enters question text
- Specifies maximum marks
- Provides model answer
- Clicks "Add Question"

**Backend Endpoint:**
```
POST /api/facultyquesans
Body: {
  faculty_id: <teacher_id>,
  question: "What is polymorphism?",
  answer: "Model answer here...",
  max_mark: 10
}
```

---

### **2. Teacher Uploads Student Answer**
**Page:** Teacher Dashboard → "Upload Student Answer" button

**What Teacher Does:**
- Selects a question from dropdown (shows all their questions)
- Selects a student from dropdown (shows all registered students)
- Uploads student's answer sheet image
- Clicks "Upload Answer"

**Backend Endpoint:**
```
POST /api/questions
FormData: {
  question_id: <selected_question_id>,
  student_id: <selected_student_id>,
  image: <answer_sheet_file>
}
```

**What Happens:**
1. ✅ Validates question exists
2. ✅ Validates student exists
3. ✅ Uploads image to Cloudinary
4. ✅ Creates StudentQuesAns record
5. ✅ Links to student and question
6. ✅ Stores in database

---

### **3. Teacher Views Submissions**
**Page:** Teacher Dashboard → "View Submissions" button

**What Teacher Sees:**
- All student submissions for their questions
- Student details (ID, Name, Roll Number)
- Question details
- Uploaded answer sheet image
- OCR extracted text (if evaluated)
- Current marks (if evaluated)
- Evaluation status (Evaluated/Pending)

**Backend Endpoint:**
```
GET /api/questions/faculty/{facultyId}/submissions
```

---

### **4. Teacher Evaluates (Optional AI)**
**Page:** Teacher Submissions → Click "Evaluate Now"

**Two Options:**

**A. Trigger AI Evaluation:**
```
POST /api/questions/ai/{studentQuesAnsId}
```
- Extracts text using OCR
- AI evaluates answer vs model answer
- Automatically assigns marks
- Generates feedback

**B. Manual Evaluation:**
- Teacher enters marks manually
- Teacher writes feedback
- Clicks "Save Marks"

```
PUT /api/questions/update-marks/{studentQuesAnsId}
Body: {
  answer_mark: 8,
  evolution: "Good answer, key points covered..."
}
```

---

## 🖥️ **Frontend Pages**

### **1. TeacherDashboard.jsx**
**Features:**
- Create questions (with model answers)
- View all created questions
- Navigate to upload student answer
- Navigate to view submissions

**Buttons:**
- 📤 **Upload Student Answer** → Goes to TeacherUploadStudentAnswer
- 📊 **View Submissions** → Goes to TeacherSubmissions
- 🚪 **Logout**

---

### **2. TeacherUploadStudentAnswer.jsx** ✨ NEW
**Features:**
- Dropdown: Select question (shows teacher's questions)
- Dropdown: Select student (shows all students)
- File upload: Answer sheet image
- Image preview before upload
- Form validation
- Success/error messages

**Process:**
1. Teacher selects question
2. Shows question details (text, max marks, model answer)
3. Teacher selects student
4. Teacher uploads image
5. Preview shown
6. Click "Upload Answer"
7. Success message displayed

---

### **3. TeacherSubmissions.jsx**
**Features:**
- View all submissions for teacher's questions
- Student information display
- Answer sheet image viewer
- OCR extracted text display
- Evaluate submissions
- Assign marks manually
- Write feedback
- Edit existing evaluations
- Status badges (Evaluated/Pending)

---

## 🔗 **API Endpoints Used**

### **Authentication**
```
POST /api/auth/login
POST /api/auth/register/faculty
POST /api/auth/register/student
```

### **Teacher Question Management**
```
POST /api/facultyquesans                    - Create question
GET  /api/facultyquesans/all                - Get all questions
GET  /api/facultyquesans/faculty/{id}       - Get teacher's questions
```

### **Student Data**
```
GET  /api/student/all                       - Get all students (NEW)
```

### **Answer Upload & Evaluation**
```
POST /api/questions                         - Upload student answer (question_id + student_id + image)
GET  /api/questions/faculty/{id}/submissions - Get submissions for teacher's questions
POST /api/questions/ai/{id}                 - Trigger AI evaluation
PUT  /api/questions/update-marks/{id}       - Manual mark update
```

---

## 📊 **Database Flow**

### **Tables & Relationships:**

```
Faculty (Teacher)
├── id
├── name, email, password
├── department, specialization
└── One-to-Many → FacultyQuesAns

FacultyQuesAns (Question)
├── id
├── question (text)
├── answer (model answer)
├── max_mark
├── Many-to-One → Faculty
└── One-to-Many → StudentQuesAns

Student
├── id
├── name, email, password
├── rollNumber, semester, department
└── One-to-Many → StudentQuesAns

StudentQuesAns (Student's Answer)
├── id
├── answer (OCR extracted text)
├── answer_mark (assigned marks)
├── evolution (feedback)
├── Many-to-One → Student
├── Many-to-One → FacultyQuesAns
└── One-to-One → Image

Image
├── id
├── url (Cloudinary URL)
└── public_id
```

---

## 🎯 **Complete Test Flow**

### **Test Scenario 1: Teacher Creates Question & Uploads Student Answer**

1. **Login as Teacher**
   - Email: teacher@example.com
   - Password: password123

2. **Create Question**
   - Go to "Add Question" tab
   - Question: "What is polymorphism in Java?"
   - Max Marks: 10
   - Model Answer: "Polymorphism is the ability of objects..."
   - Click "Add Question"
   - ✅ Success message shown

3. **Upload Student Answer**
   - Click "Upload Student Answer" button
   - Select Question: "What is polymorphism..." (from dropdown)
   - Select Student: "John Doe - Roll: 101" (from dropdown)
   - Upload Image: student_answer.jpg
   - Preview shown
   - Click "Upload Answer"
   - ✅ Answer uploaded successfully

4. **View Submissions**
   - Click "View Submissions" button
   - See John Doe's submission
   - View answer sheet image
   - Status: Pending

5. **Evaluate**
   - Click "Evaluate Now"
   - Option 1: Trigger AI (automatic marks)
   - Option 2: Enter marks manually (e.g., 8/10)
   - Write feedback: "Good understanding shown..."
   - Click "Save Marks"
   - ✅ Status changes to "Evaluated"

---

## 🔒 **Security Configuration**

### **Backend Security:**
```java
// SecurityConfig.java
.requestMatchers("/api/auth/**").permitAll()
.requestMatchers("/api/facultyquesans/**").permitAll()
.requestMatchers("/api/questions/**").permitAll()
.requestMatchers("/api/student/all").permitAll()

// Only faculty can update marks
@PreAuthorize("hasRole('TEACHER')")
@PutMapping("/update-marks/{id}")
```

---

## ✅ **What's Working Now**

### **Backend:**
- ✅ Question creation with model answers
- ✅ Answer upload (question_id + student_id + image)
- ✅ Image upload to Cloudinary
- ✅ OCR text extraction
- ✅ AI evaluation
- ✅ Manual mark assignment
- ✅ Get all students endpoint
- ✅ Get teacher's submissions

### **Frontend:**
- ✅ Teacher Dashboard (create questions)
- ✅ Teacher Upload Student Answer page (NEW)
  - Question dropdown
  - Student dropdown
  - Image upload
  - Preview
- ✅ Teacher Submissions page
  - View all submissions
  - Evaluate submissions
  - Assign marks
  - Write feedback
- ✅ Complete navigation flow

---

## 🚀 **How to Test**

### **1. Start Backend**
```powershell
cd Auto-Grade-Springboot
./mvnw.cmd spring-boot:run
```

### **2. Start Frontend**
```powershell
cd Auto-Grade-React
npm run dev
```

### **3. Test Flow**
1. Register/Login as Teacher
2. Create a question
3. Click "Upload Student Answer"
4. Select question and student
5. Upload image
6. View submissions
7. Evaluate and assign marks

---

## 🎉 **Summary**

Your exact workflow is now **fully implemented**:

✅ Teacher creates questions with model answers
✅ Teacher uploads student answer photos (with question_id + student_id)
✅ System stores marks for that particular question for that student
✅ Teacher can view all submissions
✅ Teacher can evaluate and assign marks manually
✅ Optional AI-powered evaluation available
✅ Complete UI with dropdowns, image preview, validation

**Everything is working according to your specification!** 🚀
