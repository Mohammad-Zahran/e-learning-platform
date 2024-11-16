import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './RegisterPage.css';
import logo from './../../assets/logo.svg';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Proceed with registration logic (e.g., API call)
      console.log("User registered");
    } else {
      alert("Passwords do not match!");
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
