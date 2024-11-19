import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/AdminNav/AdminNav';
import AdminCards from '../../components/AdminCards';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import '../../styles/AdminPage.css';

const AdminPage = () => {
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setAdminName(decoded.name);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost/e-learning/server/getAdminStats.php', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        setStats([
          { title: 'Students', count: data.students },
          { title: 'Instructors', count: data.instructors },
          { title: 'Courses', count: data.courses },
          { title: 'Banned Students', count: data.bannedStudents },
          { title: 'Banned Instructors', count: data.bannedInstructors },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="admin-content">
        <h2>Welcome, {adminName || 'Admin not found'}</h2>
        <AdminCards stats={stats} />
      </div>
    </div>
  );
};

export default AdminPage;
