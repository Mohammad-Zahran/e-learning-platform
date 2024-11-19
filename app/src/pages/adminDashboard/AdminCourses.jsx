import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        }
        catch (err) {
            setError('Failed to fetch courses.');
        }
        finally {
            setLoading(false);
        }
    };

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost/e-learning/server/getInstructors.php',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setInstructors(response.data);
        }
        catch (err) {
            setError('Failed to fetch instructor')
        }
    }

    // Here I am fetching the delete api and when deleting a course it will refresh my website
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
            fetchCourses(); // Refresh courses after assigning
        } catch (err) {
            setError('Failed to assign instructor.');
        }
    };



    return (
        <div>AdminCourses</div>
    )
}

export default AdminCourses