import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseClassroom = ({ courseId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost/e-learning/server/getCourseData.php?course_id=${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          setAnnouncements(response.data.data.announcements); 
          setAssignments(response.data.data.assignments);
        } else {
          setError(response.data.message || 'Failed to fetch course data.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching course data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]); 

  if (loading) return <div>Loading course data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Course Announcements</h2>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement.id}>{announcement.content}</li>
        ))}
      </ul>

      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>{assignment.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseClassroom;
