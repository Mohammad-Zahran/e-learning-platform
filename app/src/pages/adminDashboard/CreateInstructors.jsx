import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/CreateInstructors.css'; 
import AdminNav from '../../components/AdminNav/AdminNav';

const CreateInstructors = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
        'http://localhost/e-learning/server/createInstructor.php',
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
          email: '',
          password: '',
        });
      } else {
        setMessage('');
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to create instructor. Please try again.');
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
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Create Instructor</button>
      </form>
    </div>
    </div>
  );
};

export default CreateInstructors;
