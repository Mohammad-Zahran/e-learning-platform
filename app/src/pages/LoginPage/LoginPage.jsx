import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import logo from './../../assets/logo.svg';  
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post("http://localhost/e-learning/server/login.php", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        const decodedToken = jwt_decode(response.data.token); 

        if (decodedToken.role === "student") {
          navigate('/student');
        } else if (decodedToken.role === "admin") {
          navigate('/admin');
        } else if (decodedToken.role === "instructor") {
          navigate('/instructor');
        } else {
          setErrorMessage("Unknown role");
        }
      } else {
        setErrorMessage(response.data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred during login");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo and Name */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="site-name">E-Learn Platform</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder='Email Here'
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
          <input
            className="input-field"
            placeholder='Password Here'
            type="password" 
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button className="secondary-btn" onClick={() => navigate("/register")}>
          Go to register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
