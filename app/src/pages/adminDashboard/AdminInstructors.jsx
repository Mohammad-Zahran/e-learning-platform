import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav/AdminNav';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminStudents.css';

const AdminInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get('http://localhost/e-learning/server/getInstructors.php', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setInstructors(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching instructors');
                setLoading(false);
            }
        };
        fetchInstructors();
    }, []);

    const handleBanUnban = async (id, isBanned) => {
        const newStatus = isBanned ? 0 : 1;
        try {
            await axios.post(
                'http://localhost/e-learning/server/banUsers.php',
                { id, is_banned: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setInstructors((prevInstructors) =>
                prevInstructors.map((instructor) =>
                    instructor.id === id ? { ...instructor, is_banned: newStatus } : instructor
                )
            );
        } catch (err) {
            setError('Failed to update ban status');
        }
    };

    // Display loading or error messages
    if (loading) return <div className="loading">Loading instructors...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <AdminNav />
            <h2 className="page-title">Manage Instructors</h2>
            <table className="students-table">

                <button className="create-btn" onClick={() => navigate('/create-instructor')}>
                    Create Course
                </button>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instructors.map((instructor) => (
                        <tr key={instructor.id}>
                            <td>{instructor.name}</td>
                            <td>{instructor.email}</td>
                            <td>{instructor.is_banned ? 'Banned' : 'Active'}</td>
                            <td>
                                <button
                                    className={`action-btn ${instructor.is_banned ? 'unban-btn' : 'ban-btn'}`}
                                    onClick={() => handleBanUnban(instructor.id, instructor.is_banned)}
                                >
                                    {instructor.is_banned ? 'Unban' : 'Ban'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminInstructors;
