import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdAssignment } from 'react-icons/md';
import { CiMenuKebab } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import "../../styles/ClassworkPage.css";

const ClassworkPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [openAssignment, setOpenAssignment] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  const { courseId } = useParams();
  const navigate = useNavigate();

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

  const handleMenuToggle = (id) => {
    setShowMenu(showMenu === id ? null : id);
  };

  const handleEditAssignment = (id) => {
    navigate(`/edit-assignment/${id}`);
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const response = await axios.delete(`http://localhost/e-learning/server/deleteAssignment.php`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            assignment_id: id,
          },
        });

        if (response.status === 200) {
          setAssignments(assignments.filter(assignment => assignment.id !== id));
        }
      } catch (err) {
        console.error("Failed to delete assignment:", err);
        setError('Failed to delete assignment');
      }
    }
  };

  const handleCreateAssignment = () => {
    navigate(`/create-assignment/${courseId}`);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.menu') && !event.target.closest('.kebab-icon')) {
      setShowMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!assignments.length) return <div className="no-assignments">No assignments available.</div>;

  return (
    <div className="classwork-page">
      <h3>Assignments</h3>
      <button className="create-assignment-btn" onClick={handleCreateAssignment}>
      <FaPlus /> Create
      </button>
      <ul className="assignments-list">
        {assignments.map((assignment) => (
          <li
            key={assignment.id}
            className="assignment-item"
            onClick={() => handleAssignmentClick(assignment.id)}
          >
            <div className="assignment-header">
              <div className="title">
                <MdAssignment className="assignment-icon" />
                <h4 className="assignment-title">{assignment.title}</h4>
              </div>
              <div className="header-right">
                <span className="due-date">{new Date(assignment.due_date).toLocaleDateString()}</span>
                <div className="kebab-container">
                  <CiMenuKebab
                    className="kebab-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuToggle(assignment.id);
                    }}
                  />
                  {showMenu === assignment.id && (
                    <div className="menu">
                      <button onClick={() => handleEditAssignment(assignment.id)}>Edit</button>
                      <button onClick={() => handleDeleteAssignment(assignment.id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
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
