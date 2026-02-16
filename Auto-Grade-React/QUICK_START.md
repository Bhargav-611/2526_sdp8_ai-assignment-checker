# AutoGrade Frontend - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd Auto-Grade-React
npm install
```

### Step 2: Verify Backend is Running
Make sure your Spring Boot backend is running on `http://localhost:8080`

### Step 3: Start the Frontend
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 👥 User Roles & Access

### Faculty (Teacher)
**Can do:**
- Create questions with marks and model answers
- View all their created questions
- Access student answer uploads
- View question submissions

**Cannot do:**
- Submit answers as a student
- View other faculty's questions (unless shared)

### Student
**Can do:**
- Browse all available questions
- Upload answer sheets (images)
- Get instant AI evaluation and marks
- View all their submissions and results
- Track evaluation status

**Cannot do:**
- Create questions
- Access faculty dashboard

## 📝 Testing the Application

### 1. Register as Faculty
1. Open `http://localhost:5173`
2. Click "Register here"
3. Click "Register as Faculty"
4. Fill in the form:
   - Name: John Doe
   - Email: john@teacher.com
   - Password: password123
   - Department: Computer Science
   - Designation: Professor
   - Qualification: Ph.D.
   - Experience: 10
5. Click "Register as Faculty"
6. You'll be auto-logged in and redirected to Teacher Dashboard

### 2. Create a Question (as Faculty)
1. In the Teacher Dashboard, you're on "Add Question" tab by default
2. Fill in the form:
   - Question: "What is polymorphism in OOP?"
   - Marks: 10
   - Model Answer: "Polymorphism is the ability of objects to take many forms..."
3. Click "Submit Question"
4. Success message appears
5. Switch to "View Questions" tab to see your question

### 3. Register as Student
1. Logout from faculty account
2. Click "Register here"
3. Click "Register as Student"
4. Fill in the form:
   - Name: Jane Smith
   - Email: jane@student.com
   - Password: password123
   - Roll Number: 2021001
   - Semester: 6th Semester
   - Section: A
   - Admission Year: 2021
5. Click "Register as Student"
6. You'll be auto-logged in and redirected to Student Dashboard

### 4. Submit an Answer (as Student)
1. In Student Dashboard, view "Available Questions" tab
2. You'll see the question created by faculty
3. Click "Submit Answer" on the question
4. Select question from dropdown (if not pre-selected)
5. Upload an answer sheet image
6. Click "Upload & Evaluate"
7. Wait for evaluation (OCR + AI processing)
8. View results: marks, feedback, extracted answer, accuracy

### 5. View Submissions (as Student)
1. Go to "My Submissions" tab
2. See all your submitted answers
3. View evaluation status:
   - **Evaluated**: Shows marks and feedback
   - **Pending**: Still being processed
4. Check accuracy scores and detailed feedback

## 🔐 Authentication Flow

### First Time Users
1. **Register** → Choose role (Faculty/Student)
2. **Fill Form** → All required fields
3. **Auto-Login** → Redirected to dashboard
4. **Token Stored** → Session persists

### Returning Users
1. **Auto-Login** → If token valid
2. **Or Login** → Enter email/password
3. **Role-Based Redirect** → Teacher or Student dashboard

### Logout
- Click "Logout" button in header
- Token cleared
- Redirected to login page

## 📊 Sample Data for Testing

### Faculty Account
```
Email: teacher@test.com
Password: Test@123
```

### Student Account
```
Email: student@test.com
Password: Test@123
```

### Sample Question
```
Question: Explain the concept of inheritance in Java.
Marks: 15
Model Answer: Inheritance is a mechanism in Java where one class acquires the properties (fields) and behaviors (methods) of another class. It promotes code reusability and establishes a parent-child relationship between classes.
```

## 🎨 UI Navigation

### Teacher Dashboard
```
Header: Name, Logout button
Tabs: [Add Question] [View Questions]
- Add Question: Form to create new question
- View Questions: Grid of all your questions
```

### Student Dashboard
```
Header: Name, Roll No, Logout button
Tabs: [Available Questions] [My Submissions]
- Available Questions: Browse and submit answers
- My Submissions: Track all your submissions
```

### Answer Upload Page
```
Header: Back to Dashboard button
Form:
- Question dropdown
- Image upload
- Preview
- Submit button
Result:
- Marks display
- Feedback
- Extracted answer
- Accuracy score
```

## 🐛 Troubleshooting

### "Failed to fetch" Error
**Problem**: Backend not running
**Solution**: Start Spring Boot backend on port 8080

### "Invalid credentials" on Login
**Problem**: Wrong email/password or user doesn't exist
**Solution**: Check credentials or register new account

### Upload Button Disabled
**Problem**: Form validation failed
**Solution**: Fill all required fields (question, image)

### Automatic Logout
**Problem**: Token expired
**Solution**: Re-login (token expires after configured time)

### Image Upload Fails
**Problem**: Image too large or invalid format
**Solution**: Use smaller images (< 5MB), JPEG/PNG format

### Questions Not Loading
**Problem**: API endpoint issue or no questions created
**Solution**: Check browser console, verify backend connection

## 📱 Browser Recommendations

**Best Experience:**
- Chrome (latest)
- Firefox (latest)
- Edge (latest)

**Mobile:**
- iOS Safari (latest)
- Chrome Mobile (latest)

## 🔗 Useful URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Backend Health: `http://localhost:8080/api/auth/health`

## ⚙️ Configuration

### Change API URL
Edit `src/config/api.js`:
```javascript
const API_BASE_URL = "http://your-backend-url:port/api";
```

### Change Port
Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000 // Your preferred port
  }
})
```

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API responses
4. Review IMPLEMENTATION_SUMMARY.md for details
5. Check FRONTEND_README.md for comprehensive documentation

## ✅ Feature Checklist

Before going to production, verify:
- [ ] Backend URL configured correctly
- [ ] All environment variables set
- [ ] CORS configured on backend
- [ ] Token expiration time set appropriately
- [ ] Image upload size limits configured
- [ ] Error handling tested
- [ ] Responsive design tested on mobile
- [ ] All user flows tested
- [ ] Security best practices followed

## 🎉 You're All Set!

The AutoGrade frontend is fully functional with:
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Faculty Dashboard with Question Management
- ✅ Student Dashboard with Submission Tracking
- ✅ Answer Upload and AI Evaluation
- ✅ Modern, Responsive UI
- ✅ Comprehensive Error Handling

Happy grading! 🚀
