import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import RegisterChoice from "./pages/RegisterChoice";
import FacultyRegister from "./pages/FacultyRegister";
import StudentRegister from "./pages/StudentRegister";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAnswerUpload from "./pages/StudentAnswerUpload";
import TeacherSubmissions from "./pages/TeacherSubmissions";
import TeacherUploadStudentAnswer from "./pages/TeacherUploadStudentAnswer";
import "./index.css";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [navigationData, setNavigationData] = useState({});

  const handleNavigate = (page, data = {}) => {
    setCurrentPage(page);
    setNavigationData(data);
  };

  // Auto-redirect to dashboard when user logs in
  useEffect(() => {
    if (user && currentPage === "home") {
      if (user.role === "ROLE_TEACHER") {
        setCurrentPage("teacher-dashboard");
      } else if (user.role === "ROLE_STUDENT") {
        setCurrentPage("student-dashboard");
      }
    }
  }, [user, currentPage]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (user) {
    // Handle navigation for authenticated users
    switch (currentPage) {
      case "home":
      case "login":
        // Auto-redirect to appropriate dashboard
        if (user.role === "ROLE_TEACHER") {
          return <TeacherDashboard onNavigate={handleNavigate} />;
        } else {
          return <StudentDashboard onNavigate={handleNavigate} />;
        }
      
      case "teacher-dashboard":
        return <TeacherDashboard onNavigate={handleNavigate} />;
      
      case "teacher-submissions":
        return <TeacherSubmissions onNavigate={handleNavigate} />;
      
      case "teacher-upload-answer":
        return <TeacherUploadStudentAnswer onNavigate={handleNavigate} />;
      
      case "student-dashboard":
        return <StudentDashboard onNavigate={handleNavigate} />;
      
      case "student-upload":
      case "answer-upload":
        return (
          <StudentAnswerUpload
            onNavigate={handleNavigate}
            questionId={navigationData.questionId}
          />
        );
      
      default:
        // Default to appropriate dashboard
        if (user.role === "ROLE_TEACHER") {
          return <TeacherDashboard onNavigate={handleNavigate} />;
        } else {
          return <StudentDashboard onNavigate={handleNavigate} />;
        }
    }
  }

  // If user is not authenticated, show login/register pages
  switch (currentPage) {
    case "login":
      return <Login onNavigate={handleNavigate} />;
    
    case "register-choice":
      return <RegisterChoice onNavigate={handleNavigate} />;
    
    case "faculty-register":
      return <FacultyRegister onNavigate={handleNavigate} />;
    
    case "student-register":
      return <StudentRegister onNavigate={handleNavigate} />;
    
    default:
      return <Login onNavigate={handleNavigate} />;
  }
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
