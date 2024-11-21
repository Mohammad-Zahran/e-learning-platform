import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/StudentPage.css';

const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost/e-learning/server/getInvitedCourses.php', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.status === 'success') {
          setCourses(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch courses.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleEnroll = async (courseId, event) => {
    event.stopPropagation(); 
    try {
      const response = await axios.post(
        'http://localhost/e-learning/server/accept_invitation.php',
        { course_id: courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert(response.data.message);
      if (response.data.status === 'success') {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId ? { ...course, status: 'accepted' } : course
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll in the course');
    }
  };
  
  

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-page">
      <h2>Your Courses</h2>
      <div className="courses-container">
        {courses.length === 0 ? (
          <div>No courses available.</div>
        ) : (
          courses.map((course) => (
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
              {course.status === 'pending' && (
                <button
                  className="enroll-btn"
                  onClick={(event) => handleEnroll(course.id, event)}
                >
                  Enroll
                </button>
              )}
              {course.status === 'accepted' && <span className="enrolled-badge">Enrolled</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentPage;
