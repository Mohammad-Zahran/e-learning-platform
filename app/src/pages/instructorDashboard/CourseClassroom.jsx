import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CourseNav from '../../components/CourseNav'; 
import StreamPage from './StreamPage'; 
import ClassworkPage from './ClassworkPage'; 
import PeoplePage from './PeoplePage';
import '../../styles/CourseClassroom.css';

const CourseClassroom = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('stream'); 
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

  if (error) return <div className="error">{error}</div>;
  if (!courseDetails) return <div>Loading course details...</div>;

  return (
    <div className="course-classroom">
      <header className="classroom-header">
        <h2>{courseDetails.name}</h2>
        <p>{courseDetails.description}</p>
      </header>
      
      <CourseNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="classroom-content">
        {activeTab === 'stream' && <StreamPage />}
        {activeTab === 'classwork' && <ClassworkPage />}
        {activeTab === 'people' && <PeoplePage />}
      </main>
    </div>
  );
};

export default CourseClassroom;
