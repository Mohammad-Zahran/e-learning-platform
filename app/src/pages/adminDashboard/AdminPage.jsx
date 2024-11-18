import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/AdminNav/AdminNav';
import jwt_decode from 'jwt-decode';

const AdminPage = () => {
  // I am creating a useState to set the adminName with empty string
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Here I am getting the token from the localstorage from the login page
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        // Here I am decoding the jwt token and then setting the token as the name.
        const decoded = jwt_decode(token);
        setAdminName(decoded.name); 
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="admin-content">
        <h2>Welcome, {adminName || 'Admin'}</h2> 
      </div>
    </div>
  );
};

export default AdminPage;
