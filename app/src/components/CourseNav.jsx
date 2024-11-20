import React from 'react';
import '.././styles/CourseNav.css'

const CourseNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="classroom-nav">
      <button
        className={activeTab === 'stream' ? 'active' : ''}
        onClick={() => setActiveTab('stream')}
      >
        Stream
      </button>
      <button
        className={activeTab === 'classwork' ? 'active' : ''}
        onClick={() => setActiveTab('classwork')}
      >
        Classwork
      </button>
      <button
        className={activeTab === 'people' ? 'active' : ''}
        onClick={() => setActiveTab('people')}
      >
        People
      </button>
    </nav>
  );
};

export default CourseNav;
