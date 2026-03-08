import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Auth pages (MPA-style)
import Login from '../pages/auth/Login';
import RegisterChoice from '../pages/auth/RegisterChoice';
import FacultyRegister from '../pages/auth/FacultyRegister';
import StudentRegister from '../pages/auth/StudentRegister';

// Teacher pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherSubmissions from '../pages/teacher/TeacherSubmissions';
import TeacherUploadStudentAnswer from '../pages/teacher/TeacherUploadStudentAnswer';

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentAnswerUpload from '../pages/student/StudentAnswerUpload';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect - always go to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ===== AUTH ROUTES ===== */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterChoice />
          </AuthLayout>
        }
      />
      <Route
        path="/register/teacher"
        element={
          <AuthLayout>
            <FacultyRegister />
          </AuthLayout>
        }
      />
      <Route
        path="/register/student"
        element={
          <AuthLayout>
            <StudentRegister />
          </AuthLayout>
        }
      />

      {/* ===== TEACHER ROUTES (Protected with Layout) ===== */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_TEACHER">
            <DashboardLayout userType="teacher">
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions"
        element={
          <ProtectedRoute requiredRole="ROLE_TEACHER">
            <DashboardLayout userType="teacher">
              <TeacherSubmissions />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/upload-evaluate"
        element={
          <ProtectedRoute requiredRole="ROLE_TEACHER">
            <DashboardLayout userType="teacher">
              <TeacherUploadStudentAnswer />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ===== STUDENT ROUTES (Protected with Layout) ===== */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <DashboardLayout userType="student">
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/upload-answer"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <DashboardLayout userType="student">
              <StudentAnswerUpload />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/upload-answer/:questionId"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <DashboardLayout userType="student">
              <StudentAnswerUpload />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 - Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
