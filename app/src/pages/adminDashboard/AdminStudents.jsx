import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav/AdminNav';
import '../../styles/AdminStudents.css'; // Import custom styles

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost/e-learning/server/getStudents.php', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching students');
        setLoading(false);
      }
    };
    fetchStudents();
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

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id ? { ...student, is_banned: newStatus } : student
        )
      );
    } catch (err) {
      setError('Failed to update ban status');
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
        <AdminNav />
      <h2 className="page-title">Manage Students</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.is_banned ? 'Banned' : 'Active'}</td>
              <td>
                <button
                  className={`action-btn ${student.is_banned ? 'unban-btn' : 'ban-btn'}`}
                  onClick={() => handleBanUnban(student.id, student.is_banned)}
                >
                  {student.is_banned ? 'Unban' : 'Ban'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStudents;
