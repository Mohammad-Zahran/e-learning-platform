import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch courses with assigned instructors
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost/e-learning/server/getCoursesWithInstructors.php',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all instructors
  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        'http://localhost/e-learning/server/getInstructors.php',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setInstructors(response.data);
    } catch (err) {
      setError('Failed to fetch instructors.');
    }
  };

  // Delete a course
  const deleteCourse = async (courseId) => {
    try {
      await axios.post(
        'http://localhost/e-learning/server/deleteCourse.php',
        { course_id: courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchCourses(); // Refresh courses after deletion
    } catch (err) {
      setError('Failed to delete the course.');
    }
  };

  // Assign an instructor to a course
  const assignInstructor = async (courseId, instructorId) => {
    try {
      await axios.post(
        'http://localhost/e-learning/server/assignCourseToInstructor.php',
        { course_id: courseId, instructor_id: instructorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Instructor assigned successfully.');
      fetchCourses(); 
    } catch (err) {
      setError('Failed to assign instructor.');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Courses</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Description</th>
            <th>Assigned Instructors</th>
            <th>Assign Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>
                {course.assignedInstructors?.length > 0 ? (
                  <ul>
                    {course.assignedInstructors.map((instructor) => (
                      <li key={instructor.id}>{instructor.name}</li>
                    ))}
                  </ul>
                ) : (
                  'No instructors assigned'
                )}
              </td>
              <td>
                <select
                  onChange={(e) =>
                    assignInstructor(course.id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Instructor
                  </option>
                  {instructors.map((instructor) => {
                    const isAssigned = course.assignedInstructors?.some(
                      (assigned) => assigned.id === instructor.id
                    );
                    return (
                      <option
                        key={instructor.id}
                        value={instructor.id}
                        disabled={isAssigned}
                      >
                        {instructor.name} {isAssigned ? '(Assigned)' : ''}
                      </option>
                    );
                  })}
                </select>
              </td>
              <td>
                <button onClick={() => deleteCourse(course.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCourses;
