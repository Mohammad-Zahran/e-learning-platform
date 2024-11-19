import React from 'react'
import { Link } from "react-router-dom";
import "../../styles/AdminNav.css"
const AdminNav = () => {
  return (
    <nav className="navbar">
      <h1>Admin Panel</h1>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin-students">Manage Students</Link></li>
        <li><Link to="/admin-instructors">Manage Instructors</Link></li>
        <li><Link to="/admin-courses">Manage Courses</Link></li>
      </ul>
    </nav>
  )
}

export default AdminNav