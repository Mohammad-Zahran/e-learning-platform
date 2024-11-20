import React from 'react';
import { useParams } from 'react-router-dom';

const CourseClassroom = () => {
  const { id } = useParams();

  return (
    <div className="course-classroom">
      <h2>Course Classroom</h2>
      <p>Welcome to the classroom for course ID: {id}</p>
    </div>
  );
};

export default CourseClassroom;
