import React from 'react';
import '../styles/Auth.css';

const RegisterChoice = ({ onNavigate }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Choose Registration Type</h1>
          <p>Select your role to create an account</p>
        </div>

        <div className="choice-container">
          <div className="choice-card" onClick={() => onNavigate('faculty-register')}>
            <div className="choice-icon">👨‍🏫</div>
            <h2>Faculty</h2>
            <p>Register as a teacher to create questions and evaluate student answers</p>
            <button className="btn-primary">Register as Faculty</button>
          </div>

          <div className="choice-card" onClick={() => onNavigate('student-register')}>
            <div className="choice-icon">👨‍🎓</div>
            <h2>Student</h2>
            <p>Register as a student to submit answers and view your results</p>
            <button className="btn-primary">Register as Student</button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              className="link-button"
              onClick={() => onNavigate('login')}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
