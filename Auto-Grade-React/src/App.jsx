import React, { useState, useEffect } from "react";
import TeacherSignup from "./pages/TeacherSignup";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentAnswerUpload from "./pages/StudentAnswerUpload";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("signup"); // 'signup' | 'dashboard' | 'upload'
  const [teacherId, setTeacherId] = useState(null);

  // Check if teacher is already logged in (has teacherId in localStorage)
  useEffect(() => {
    const storedTeacherId = localStorage.getItem("teacherId");
    if (storedTeacherId) {
      setTeacherId(storedTeacherId);
      setCurrentPage("dashboard");
    }
  }, []);

  // Handle successful signup
  const handleSignupSuccess = (id) => {
    setTeacherId(id);
    setCurrentPage("dashboard");
  };

  const goToDashboard = () => setCurrentPage("dashboard");
  const goToUpload = () => setCurrentPage("upload");

  return (
    <div className="app">
      {currentPage === "signup" && (
        <TeacherSignup onSignupSuccess={handleSignupSuccess} />
      )}

      {currentPage === "dashboard" && (
        <TeacherDashboard teacherId={teacherId} onGoToUpload={goToUpload} />
      )}

      {currentPage === "upload" && (
        <StudentAnswerUpload
          teacherId={teacherId}
          onBackToDashboard={goToDashboard}
        />
      )}
    </div>
  );
}

export default App;
