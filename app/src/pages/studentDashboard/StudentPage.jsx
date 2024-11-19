import React, { useState } from 'react';
import '../../styles/StudentPage.css';

const StudentPage = () => {
  const [activeItem, setActiveItem] = useState('My Courses');

  return (
    <div className="student-page">
      <aside className="student-sidebar">
        <h2>Student Dashboard</h2>
        <nav>
          <ul>
            {['My Courses', 'Assignments', 'Announcements', 'Comments'].map((item) => (
              <li
                key={item}
                className={activeItem === item ? 'active' : ''}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="student-content">
        <h1>{activeItem}</h1>
        <p>Content for {activeItem} goes here.</p>
      </main>
    </div>
  );
};

export default StudentPage;
