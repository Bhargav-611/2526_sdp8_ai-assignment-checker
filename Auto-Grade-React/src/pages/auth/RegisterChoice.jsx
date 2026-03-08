import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-card register-choice">
      <div className="login-header">
        <h2 className="login-title">Create New Account</h2>
        <p className="login-subtitle">
          Choose whether you want to sign up as a Teacher or a Student.
        </p>
      </div>

      <div className="choice-container">
        <div 
          className="choice-card"
          onClick={() => navigate('/register/teacher')}
        >
          <div className="choice-icon">👨‍🏫</div>
          <h3>Faculty</h3>
          <p>Register as a teacher to create questions and evaluate student answers</p>
          <button className="btn-primary">Register as Faculty</button>
        </div>

        <div 
          className="choice-card"
          onClick={() => navigate('/register/student')}
        >
          <div className="choice-icon">👨‍🎓</div>
          <h3>Student</h3>
          <p>Register as a student to submit answers and view your results</p>
          <button className="btn-primary">Register as Student</button>
        </div>
      </div>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="link-button">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterChoice;
