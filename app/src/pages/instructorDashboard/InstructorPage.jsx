import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import '../../styles/InstructorPage.css';
import InstructorNav from '../../components/InstructorNav';

const InstructorPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost/e-learning/server/getCoursesForInstructor.php', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`); 
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="instructor-page">
      
      <h2>Your Courses</h2>
      <div className="courses-container">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => handleCourseClick(course.id)}
          >
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <div className="course-dates">
              <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
              <span>Updated: {new Date(course.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorPage;
