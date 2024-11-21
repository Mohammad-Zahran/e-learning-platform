import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa'; 
import { useParams } from 'react-router-dom'; // Import useParams
import '../../styles/PeoplePage.css';

const PeoplePage = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [instructor, setInstructor] = useState(null);
  const [students, setStudents] = useState([
    { name: "Alice Smith", email: "alice.smith@example.com" },
    { name: "Bob Johnson", email: "bob.johnson@example.com" },
    { name: "Charlie Brown", email: "charlie.brown@example.com" },
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && courseId) {
      axios
        .get(`http://localhost/e-learning/server/getInstructorByCourse.php?course_id=${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.status === 'success') {
            setInstructor(response.data.instructor);
          } else {
            setError(response.data.message || 'An error occurred while fetching instructor data.');
          }
        })
        .catch((err) => {
          setError(err.response ? err.response.data.message : 'Error contacting the server.');
        });
    } else {
      setError('Authorization token or course ID missing');
    }
  }, [courseId]); 

  const handleInvite = () => {
    alert("Invite functionality coming soon!");
  };

  return (
    <div className="people-page">
      {error && <div className="error-message">{error}</div>}

      {instructor ? (
        <div className="instructor-section">
          <h2>Instructor</h2>
          <div className="instructor-card">
            <div className="instructor-info">
              <h3>{instructor.name}</h3>
              <p>{instructor.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="instructor-section">
          <h2>Instructor</h2>
          <p>Loading instructor data...</p>
        </div>
      )}

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
