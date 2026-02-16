# Auto-Grade React Frontend

A modern React application for the Auto-Grade system with JWT-based authentication, role-based access control, and comprehensive question evaluation features.

## Features

### Authentication & Authorization
- **JWT-Based Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Separate interfaces for Faculty (Teachers) and Students
- **Protected Routes**: Automatic redirection based on authentication status and user role
- **Persistent Sessions**: Token stored in localStorage for seamless experience

### Faculty Features
- **Registration**: Complete profile setup with department, designation, qualification, and experience
- **Login**: Secure email/password authentication
- **Question Management**:
  - Create questions with marks and model answers
  - View all created questions
  - Track question submissions
- **Dashboard**:
  - Tabbed interface for adding and viewing questions
  - Quick access to answer upload functionality

### Student Features
- **Registration**: Profile creation with roll number, semester, section, and admission year
- **Login**: Secure email/password authentication
- **Question Browser**: View all available questions with faculty details
- **Answer Submission**:
  - Upload handwritten answer sheets (image format)
  - Automatic OCR and AI evaluation
  - Real-time feedback and marks
- **Submission Tracking**:
  - View all submitted answers
  - Check evaluation status
  - Review marks, feedback, and accuracy scores

## Project Structure

```
src/
├── config/
│   └── api.js                 # API endpoints configuration
├── context/
│   └── AuthContext.jsx        # Authentication context provider
├── services/
│   └── authService.js         # Authentication service with JWT handling
├── pages/
│   ├── Login.jsx              # Login page for all users
│   ├── RegisterChoice.jsx     # Registration type selection
│   ├── FacultyRegister.jsx    # Faculty registration form
│   ├── StudentRegister.jsx    # Student registration form
│   ├── TeacherDashboard.jsx   # Faculty dashboard with question management
│   ├── StudentDashboard.jsx   # Student dashboard with submissions
│   └── StudentAnswerUpload.jsx # Answer upload and evaluation
├── styles/
│   └── Auth.css               # Authentication pages styling
├── App.jsx                    # Main app component with routing
├── main.jsx                   # App entry point
└── index.css                  # Global styles

```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register/faculty` - Faculty registration
- `POST /api/auth/register/student` - Student registration

### Faculty Endpoints
- `GET /api/faculty/all` - Get all faculty (protected)
- `GET /api/faculty/id/:id` - Get faculty by ID (protected)
- `POST /api/faculty` - Create faculty

### Question Endpoints
- `POST /api/facultyquesans` - Create question (faculty only)
- `GET /api/facultyquesans/all` - Get all questions (protected)
- `GET /api/facultyquesans/id/:id` - Get question by ID (protected)
- `GET /api/facultyquesans/faculty/:id` - Get questions by faculty ID (faculty only)

### Student Answer Endpoints
- `POST /api/questions` - Upload student answer (student only)
- `POST /api/questions/ai/:id` - Evaluate answer with AI (protected)
- `GET /api/questions/student/:id` - Get submissions by student (protected)
- `GET /api/questions/question/:id` - Get submissions by question (protected)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Update API base URL in `src/config/api.js` if needed:
```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### For Faculty

1. **Register**:
   - Click "Register here" on login page
   - Select "Register as Faculty"
   - Fill in all required details
   - System automatically logs you in after registration

2. **Create Questions**:
   - Navigate to "Add Question" tab
   - Enter question text, marks, and model answer
   - Submit to save

3. **View Questions**:
   - Switch to "View Questions" tab
   - See all your created questions
   - Access student submissions

### For Students

1. **Register**:
   - Click "Register here" on login page
   - Select "Register as Student"
   - Fill in all required details including roll number
   - System automatically logs you in after registration

2. **Browse Questions**:
   - View "Available Questions" tab
   - See all questions with marks and faculty details
   - Click "Submit Answer" on any question

3. **Submit Answer**:
   - Select question (or pre-selected if coming from dashboard)
   - Upload answer sheet image
   - Click "Upload & Evaluate"
   - View instant evaluation results

4. **Track Submissions**:
   - Navigate to "My Submissions" tab
   - View all submitted answers
   - Check marks, feedback, and accuracy scores

## Authentication Flow

1. **Login**:
   - User enters email and password
   - Backend validates credentials and returns JWT token
   - Token stored in localStorage
   - User redirected to appropriate dashboard based on role

2. **Auto-Login**:
   - On app load, checks for existing token
   - If valid token found, user auto-logged in
   - Maintains session across page refreshes

3. **Token Management**:
   - Token automatically added to all API requests via Axios interceptor
   - 401 responses trigger automatic logout and redirect to login

4. **Logout**:
   - Clears token from localStorage
   - Redirects to login page

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only approach**: Token stored in localStorage (consider httpOnly cookies for production)
- **Axios Interceptors**: Automatic token injection and 401 handling
- **Role-Based UI**: Different interfaces based on user role
- **Protected Routes**: Authentication checks before rendering components

## Styling

The application uses a modern, clean design with:
- **Color Scheme**: Purple gradient primary colors with semantic colors for success, error, warning
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Consistent UI**: Unified design language across all pages

## Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Environment Variables

For production, consider using environment variables for:
- API base URL
- Token expiration settings
- Image upload size limits

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- **React 19.2.0**: UI library
- **Axios 1.13.2**: HTTP client for API requests
- **Vite 7.2.4**: Build tool and dev server

## Future Enhancements

- [ ] Add password reset functionality
- [ ] Implement real-time notifications
- [ ] Add bulk question upload
- [ ] Export submission reports
- [ ] Add question categories/tags
- [ ] Implement search and filter for questions
- [ ] Add user profile management
- [ ] Implement dark mode
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

## Troubleshooting

### Token Expired Issues
- Tokens expire after a certain time (configured in backend)
- User automatically logged out and redirected to login
- Re-login required to get new token

### API Connection Issues
- Check if backend server is running on correct port
- Verify API_BASE_URL in `src/config/api.js`
- Check browser console for CORS errors

### Upload Issues
- Ensure image file size is within limits
- Verify file format is supported (JPEG, PNG, etc.)
- Check browser console for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the AutoGrade system.
