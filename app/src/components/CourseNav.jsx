import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CourseNav.css';

const CourseNav = ({ activeTab, setActiveTab }) => {
  const handleTabChange = (e, tab) => {
    e.preventDefault();  
    setActiveTab(tab);    
  };

  return (
    <nav className="classroom-nav">
      <Link
        to="#"
        className={activeTab === 'stream' ? 'active' : ''}
        onClick={(e) => handleTabChange(e, 'stream')}
      >
        Stream
      </Link>
      <Link
        to="/course/:courseId"
        className={activeTab === 'classwork' ? 'active' : ''}
        onClick={(e) => handleTabChange(e, 'classwork')}
      >
        Classwork
      </Link>
      <Link
        to="#"
        className={activeTab === 'people' ? 'active' : ''}
        onClick={(e) => handleTabChange(e, 'people')}
      >
        People
      </Link>
    </nav>
  );
};

export default CourseNav;
