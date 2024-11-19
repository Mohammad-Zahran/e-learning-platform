import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/CreateInstructors.css'; 
import AdminNav from '../../components/AdminNav/AdminNav';

const CreateCourses = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
      });
      const [message, setMessage] = useState('');
      const [error, setError] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            'http://localhost/e-learning/server/createCourse.php',
            formData,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
    
          if (response.data.status === 'success') {
            setMessage(response.data.message);
            setError('');
            setFormData({
              name: '',
              description: '',
            });
          } else {
            setMessage('');
            setError(response.data.message);
          }
        } catch (err) {
          setError('Failed to create course. Please try again.');
          setMessage('');
        }
      };
    
      return (
        <div>
          <AdminNav />
        <div className="create-instructor-container">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="create-instructor-form">
            <label>
             Course Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Course Description:
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Create Course</button>
          </form>
        </div>
        </div>
      );
}

export default CreateCourses