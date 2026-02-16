# 🚀 Auto Grade - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Database Setup (1 minute)
```bash
# Start PostgreSQL and create database
psql -U postgres
CREATE DATABASE autograde;
\q
```

### Step 2: Configure Backend (1 minute)
```bash
# Edit Auto-Grade-Springboot/src/main/resources/application.properties
# Update these values:
spring.datasource.url=jdbc:postgresql://localhost:5432/autograde
spring.datasource.username=postgres
spring.datasource.password=your_password

app.jwt-secret=your-secret-key-minimum-256-bits
app.jwt-expiration-ms=86400000

cloudinary.cloud-name=your_cloudinary_name
cloudinary.api-key=your_cloudinary_key
cloudinary.api-secret=your_cloudinary_secret
```

### Step 3: Start Backend (1 minute)
```bash
cd Auto-Grade-Springboot
./mvnw spring-boot:run
```
✅ Backend running on http://localhost:8080

### Step 4: Start Python AI Service (1 minute)
```bash
cd preprocessing
pip install -r requirements.txt
python app.py
```
✅ AI Service running on http://localhost:8000

### Step 5: Start Frontend (1 minute)
```bash
cd Auto-Grade-React
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

---

## 🎯 Quick Test Flow

### Test 1: Faculty Flow (2 minutes)

1. **Register Faculty**
   - Go to http://localhost:5173
   - Click "Register as Faculty"
   - Fill form with your details
   - Submit

2. **Login**
   - Enter email and password
   - Auto-redirected to Teacher Dashboard

3. **Create Question**
   - Enter: "What is polymorphism in Java?"
   - Marks: 10
   - Model Answer: "Polymorphism is the ability of objects to take multiple forms..."
   - Click "Add Question"

4. **View Submissions**
   - Click "View Submissions" button
   - (Empty initially - students haven't submitted yet)

### Test 2: Student Flow (3 minutes)

1. **Register Student**
   - Click "Register as Student"
   - Fill form (MUST include Roll Number, Semester, Department)
   - Submit

2. **Login**
   - Enter email and password
   - Should redirect to Student Dashboard (NOT back to login!)

3. **Upload Answer**
   - Browse questions
   - Click "Upload Answer" on any question
   - Select image file (answer sheet photo)
   - Click "Upload & Evaluate"
   - Wait for OCR extraction and AI evaluation
   - View your marks and feedback!

### Test 3: Faculty Evaluation (2 minutes)

1. **Login as Faculty** (use faculty credentials from Test 1)

2. **View Submissions**
   - Click "View Submissions"
   - See student's submission with:
     - Student details (ID, name, roll number)
     - Answer sheet image
     - OCR extracted text
     - AI-assigned marks (if already evaluated)

3. **Manual Evaluation**
   - Click "Evaluate Now" or "Edit Marks"
   - Enter marks (0-10)
   - Write feedback: "Good understanding shown..."
   - Click "Save Marks"
   - Status changes to "Evaluated"!

---

## ✅ Verification Checklist

- [ ] PostgreSQL database created
- [ ] Backend application.properties configured
- [ ] Spring Boot backend running (port 8080)
- [ ] Python AI service running (port 8000)
- [ ] React frontend running (port 5173)
- [ ] Faculty can register and login
- [ ] Student can register with department field
- [ ] Student can login (doesn't redirect back)
- [ ] Student can upload answer (doesn't redirect to login)
- [ ] Faculty can view submissions
- [ ] Faculty can evaluate and assign marks

---

## 🐛 Quick Troubleshooting

### "Student login redirects to login"
✅ **FIXED** - Department field added to student registration

### "Upload redirects to login"
✅ **FIXED** - Security configuration updated

### "Faculty can't see submissions"
✅ **FIXED** - New endpoints and UI created

### "CORS error"
✅ **FIXED** - Both ports (5173, 5174) allowed

### Backend not starting
- Check PostgreSQL is running
- Verify database credentials in application.properties
- Check Java version (need Java 17+)

### Frontend not loading
- Run `npm install` in Auto-Grade-React folder
- Check Node version (need Node 18+)
- Clear browser cache

### AI service failing
- Install Python dependencies: `pip install -r requirements.txt`
- Check Python version (need Python 3.8+)
- Verify port 8000 is not in use

---

## 🎓 Key Features Working

✅ **Authentication**
- JWT-based login/logout
- Role-based access (Faculty/Student)
- Automatic token refresh
- Secure password hashing

✅ **Question Management**
- Faculty creates questions
- Model answers with marks
- View all questions
- Question listing for students

✅ **Answer Submission**
- Image upload to Cloudinary
- OCR text extraction (Python AI)
- Automatic AI evaluation
- Marks assignment

✅ **Faculty Evaluation** ✨ NEW
- View all student submissions
- See student information
- Review answer sheets and OCR text
- Manually assign marks
- Provide feedback
- Edit existing evaluations

✅ **Security**
- Spring Security configuration
- CORS enabled for all ports
- Protected endpoints
- Axios interceptors
- Unauthorized error handling

---

## 🎉 You're All Set!

Your application is **fully functional** with all features working:

1. ✅ Students can register WITH department field
2. ✅ Students can login successfully (no redirect loop)
3. ✅ Students can upload answers (no unauthorized errors)
4. ✅ Faculty can view student submissions with details
5. ✅ Faculty can evaluate and assign marks manually
6. ✅ Faculty can edit evaluations and provide feedback

**Next Steps:**
1. Test all flows mentioned above
2. Review COMPLETE_APPLICATION_GUIDE.md for detailed documentation
3. Configure production settings when ready to deploy
4. Add more questions and test with multiple students

Happy Grading! 🚀
