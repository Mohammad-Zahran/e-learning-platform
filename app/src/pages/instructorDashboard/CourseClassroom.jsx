// CourseClassroom.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CourseNav from '../../components/CourseNav'; 
import '../../styles/CourseClassroom.css';

const CourseClassroom = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('stream'); // Default tab is 'stream'
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/e-learning/server/getCourseDetails.php?course_id=${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCourseDetails(response.data);
      } catch (err) {
        setError('Failed to fetch course details');
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stream':
        return <div className="tab-content">Stream content goes here...</div>;
      case 'classwork':
        return <div className="tab-content">Classwork content goes here...</div>;
      case 'people':
        return <div className="tab-content">People content goes here...</div>;
      default:
        return null;
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!courseDetails) return <div>Loading course details...</div>;

  return (
    <div className="course-classroom">
      <header className="classroom-header">
        <h2>{courseDetails.name}</h2>
        <p>{courseDetails.description}</p>
      </header>
      
      {/* Use CourseNav component */}
      <CourseNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="classroom-content">{renderTabContent()}</main>
    </div>
  );
};

export default CourseClassroom;
