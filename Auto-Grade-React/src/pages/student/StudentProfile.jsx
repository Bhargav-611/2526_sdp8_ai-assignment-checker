import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const StudentProfile = () => {
    const { user } = useAuth();
    const [copyMsg, setCopyMsg] = useState('');

    const displayName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Student';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const copy = (val) => {
        navigator.clipboard.writeText(val).then(() => {
            setCopyMsg('Copied!');
            setTimeout(() => setCopyMsg(''), 1500);
        });
    };

    const fields = [
        { label: 'Full Name', value: user?.name, icon: '👤' },
        { label: 'Email Address', value: user?.email, icon: '✉️', copyable: true },
        { label: 'Roll Number', value: user?.rollNumber, icon: '🔢', copyable: true },
        { label: 'Department', value: user?.department, icon: '🏛️' },
        { label: 'Semester', value: user?.semester ? `Semester ${user.semester}` : null, icon: '📅' },
        { label: 'Section', value: user?.section, icon: '📌' },
        { label: 'Admission Year', value: user?.admissionYear, icon: '🗓️' },
        { label: 'Role', value: 'Student', icon: '🔖' },
        { label: 'Account ID', value: user?.id, icon: '🆔', copyable: true },
    ];

    return (
        <div className="dashboard">
            <motion.div className="page-header"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="page-header-left">
                    <h1><span className="page-title-emoji">👤</span> My Profile</h1>
                    <p>Your account information</p>
                </div>
            </motion.div>

            {/* Avatar card */}
            <motion.div className="question-card"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                <div className="profile-hero">
                    <div className="profile-avatar-large">{initials}</div>
                    <div className="profile-hero-info">
                        <h2>{displayName}</h2>
                        <p className="profile-role-tag">🎓 Student</p>
                        {user?.rollNumber && (
                            <p className="profile-dept">Roll No: <strong>{user.rollNumber}</strong></p>
                        )}
                        {user?.department && <p className="profile-dept">{user.department}</p>}
                    </div>
                </div>

                {copyMsg && (
                    <div className="message success" style={{ marginBottom: 12 }}>{copyMsg}</div>
                )}

                <div className="profile-fields">
                    {fields.map(f => f.value != null && (
                        <motion.div key={f.label} className="profile-field"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                            whileHover={{ x: 4 }}>
                            <span className="profile-field-icon">{f.icon}</span>
                            <div className="profile-field-content">
                                <span className="profile-field-label">{f.label}</span>
                                <span className="profile-field-value">{f.value}</span>
                            </div>
                            {f.copyable && (
                                <button className="profile-copy-btn" onClick={() => copy(String(f.value))}
                                    title="Copy">⎘</button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default StudentProfile;
