import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../../components/AdminNav/AdminNav';
import '../../styles/AdminCourses.css'; 

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState(null); 
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const navigate = useNavigate();

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
      fetchCourses();
    } catch (err) {
      setError('Failed to delete the course.');
    }
  };

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

  const updateCourse = async (courseId) => {
    try {
      await axios.post(
        'http://localhost/e-learning/server/updateCourse.php',
        { course_id: courseId, name: updatedName, description: updatedDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Course updated successfully.');
      setEditingCourse(null); 
      fetchCourses(); 
    } catch (err) {
      setError('Failed to update the course.');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-courses-container">
      <AdminNav />
      <div className="header-section">
        <h1>Admin Courses</h1>
        <button className="create-course-btn" onClick={() => navigate('/create-course')}>
          Create Course
        </button>
      </div>
      <table className="courses-table">
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
              <td>
                {editingCourse === course.id ? (
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                ) : (
                  course.name
                )}
              </td>
              <td>
                {editingCourse === course.id ? (
                  <textarea
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />
                ) : (
                  course.description
                )}
              </td>
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
                  onChange={(e) => assignInstructor(course.id, e.target.value)}
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
                <div className='buttons'>
                {editingCourse === course.id ? (
                  <button
                    className="save-btn"
                    onClick={() => updateCourse(course.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingCourse(course.id);
                    setUpdatedName(course.name);
                    setUpdatedDescription(course.description);
                  }}
                >
                  Edit
                </button>
                
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCourses;
