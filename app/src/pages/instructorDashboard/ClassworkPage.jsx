import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import { MdAssignment } from 'react-icons/md'; 
import "../../styles/ClassworkPage.css";

const ClassworkPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [openAssignment, setOpenAssignment] = useState(null);

  const { courseId } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost/e-learning/server/getAssignments.php?course_id=${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAssignments(response.data); 
      } catch (err) {
        setError('Failed to fetch assignments');
        console.error(err);
      }
    };

    fetchAssignments();
  }, [courseId]);

  const handleAssignmentClick = (id) => {
    setOpenAssignment(openAssignment === id ? null : id); 
  };

  if (error) return <div className="error">{error}</div>;
  if (!assignments.length) return <div className="no-assignments">No assignments available.</div>;

  return (
    <div className="classwork-page">
      <h3>Assignments</h3>
      <ul className="assignments-list">
        {assignments.map((assignment) => (
          <li 
            key={assignment.id} 
            className="assignment-item" 
            onClick={() => handleAssignmentClick(assignment.id)}
          >
            <div className="assignment-header">
              <div className='title'>
              <MdAssignment className="assignment-icon" />
              <h4 className="assignment-title">{assignment.title}</h4>
              </div>
              <span className="due-date">{new Date(assignment.due_date).toLocaleDateString()}</span>
            </div>
            <div 
              className={`assignment-description ${openAssignment === assignment.id ? 'open' : ''}`}
            >
              <p>{assignment.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassworkPage;
