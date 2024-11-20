import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/EditAssignmentPage.css";

const EditAssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    course_id: ''  
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`http://localhost/e-learning/server/getAssignmentDetails.php?assignment_id=${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  
          },
        });
        setAssignment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch assignment details');
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost/e-learning/server/editAssignment.php`, 
        {
          assignment_id: assignmentId,  
          title: assignment.title,
          description: assignment.description,
          due_date: assignment.due_date,
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      if (response.status === 200) {
        navigate(`/course/${assignment.course_id}`);  
      }
    } catch (err) {
      setError('Failed to update assignment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-assignment-page">
      <h2>Edit Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={assignment.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={assignment.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={assignment.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditAssignmentPage;
