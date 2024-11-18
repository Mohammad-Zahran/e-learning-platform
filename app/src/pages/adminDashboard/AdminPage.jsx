import React from 'react';
import AdminNav from '../../components/AdminNav/AdminNav';


const AdminPage = () => {
  return (
    <div>
        <AdminNav />
      <div className="admin-content">
        <h2>Welcome to the Admin Dashboard</h2>
        {/* Add other admin page content here */}
      </div>
    </div>
  );
};

export default AdminPage;
