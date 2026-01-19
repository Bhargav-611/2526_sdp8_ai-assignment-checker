import React, { useState, useEffect } from "react";
import TeacherSignup from "./pages/TeacherSignup";
import TeacherDashboard from "./pages/TeacherDashboard";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("signup"); // 'signup' or 'dashboard'
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

  // Handle navigation (if needed for future logout functionality)
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      {currentPage === "signup" ? (
        <TeacherSignup onSignupSuccess={handleSignupSuccess} />
      ) : (
        <TeacherDashboard teacherId={teacherId} />
      )}
    </div>
  );
}

export default App;
