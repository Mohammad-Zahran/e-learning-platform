import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/InstructorNav.css';

const InstructorNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="instructor-navbar">
      <h1 className="brand">Instructor Panel</h1>
      <ul>
        <li><Link to="/instructor">Dashboard</Link></li>
        <li><Link to="/course/stream">Stream</Link></li>
        <li><Link to="/course/classwork">Classwork</Link></li>
        <li><Link to="/course/people">People</Link></li>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default InstructorNav;
