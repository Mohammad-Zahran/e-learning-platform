import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/RegisterPage.css';
import logo from './../../assets/logo.svg';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/e-learning/server/register.php', {
        name,
        email,
        password,
      });

      if (response.data.status === 'success') {
        console.log("User registered successfully:", response.data.message);
        navigate('/');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="site-name">E-Learn Platform</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder='Full Name'
            onChange={(event) => setName(event.target.value)}
            value={name}
            required
          />
          <input
            className="input-field"
            placeholder='Email'
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder='Password'
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">
            Register
          </button>
        </form>

        <button className="secondary-btn" onClick={() => navigate("/")}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
