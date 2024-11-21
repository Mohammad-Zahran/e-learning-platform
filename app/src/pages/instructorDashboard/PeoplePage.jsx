import React from 'react';
import '../../styles/PeoplePage.css';
import { FaUserPlus } from 'react-icons/fa'; 

const PeoplePage = () => {
  const instructor = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  const students = [
    { name: "Alice Smith", email: "alice.smith@example.com" },
    { name: "Bob Johnson", email: "bob.johnson@example.com" },
    { name: "Charlie Brown", email: "charlie.brown@example.com" },
  ];

  const handleInvite = () => {
    alert("Invite functionality coming soon!");
  };

  return (
    <div className="people-page">
      <div className="instructor-section">
        <h2>Instructor</h2>
        <div className="instructor-card">
          <div className="instructor-info">
            <h3>{instructor.name}</h3>
            <p>{instructor.email}</p>
          </div>
        </div>
      </div>



      <div className="students-section">
        <div className="invite-section">
          <h2>Students</h2>
          <button className="invite-button" onClick={handleInvite}>
            <FaUserPlus /> Invite Students
          </button>
        </div>

        {students.length > 0 ? (
          <ul className="students-list">
            {students.map((student, index) => (
              <li key={index} className="student-item">
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p>{student.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No students enrolled yet.</p>
        )}
      </div>
    </div>
  );
};

export default PeoplePage;
